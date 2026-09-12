package app

import (
	"strings"
	"context"
	"errors"
	"fmt"
	"log/slog"
	"time"

	"mnglib/content/internal/domain"
)

// ── Puertos (interfaces que los adaptadores implementan) ──────────────

type SourceRepo interface {
	Insert(ctx context.Context, source *domain.Source) error
	GetByID(ctx context.Context, id int64) (*domain.Source, error)
	ListByEntry(ctx context.Context, entryID int64, kind domain.SourceKind, number float64) ([]*domain.Source, error)
	SetStatus(ctx context.Context, id int64, status domain.SourceStatus) error
	SetReadyWithPlaylist(ctx context.Context, id int64, playlistKey string) error
	ListReadyPages(ctx context.Context, sourceID int64) ([]PageInfo, error)
	InsertPages(ctx context.Context, sourceID int64, pages []PageInfo) error
}

type PageInfo struct {
	PageNumber int
	ImageKey   string
	Width      int
	Height     int
}

type ProviderRepo interface {
	GetBySlug(ctx context.Context, slug string) (*domain.Provider, error)
	Create(ctx context.Context, provider *domain.Provider) error
}

type JobRepo interface {
	Insert(ctx context.Context, job *domain.UploadJob) error
	GetByID(ctx context.Context, id string) (*domain.UploadJob, error)
	SetState(ctx context.Context, id, state string, progress int, errMsg string) error
}

type ObjectStore interface {
	PresignGet(ctx context.Context, key string, ttl time.Duration) (string, error)
	PresignPut(ctx context.Context, key string, ttl time.Duration) (string, error)
	Download(ctx context.Context, key, destPath string) error
	Upload(ctx context.Context, key, srcPath string) error
}

// SupportedStorageProviders is the single source of truth for the factory
// and config validation. Add a new provider here when its adapter exists.
var SupportedStorageProviders = []string{"s3", "minio", "gcs"}

// IsSupportedStorageProvider reports whether the given provider has an adapter.
func IsSupportedStorageProvider(provider string) bool {
	provider = strings.ToLower(provider)
	for _, supported := range SupportedStorageProviders {
		if provider == supported {
			return true
		}
	}
	return false
}

type EventPublisher interface {
	PublishTranscodeRequested(ctx context.Context, jobID string, sourceID int64, bucket, key string) error
	PublishTranscodeProgress(ctx context.Context, jobID string, sourceID int64, pct int) error
	PublishTranscodeCompleted(ctx context.Context, jobID string, sourceID int64) error
	PublishTranscodeFailed(ctx context.Context, jobID string, sourceID int64, message string) error
	PublishSourceReady(ctx context.Context, sourceID int64) error
}

// ── Configuración ─────────────────────────────────────────────────────

type Config struct {
	MediaBucket    string
	PresignTTL     time.Duration
	InternalSlug   string
	ExternalDomain string
}

// ── Casos de uso ──────────────────────────────────────────────────────

type Service struct {
	sources   SourceRepo
	providers ProviderRepo
	jobs      JobRepo
	storage   ObjectStore
	events    EventPublisher
	cfg       Config
	logger    *slog.Logger
	now       func() time.Time
}

func NewService(
	sources SourceRepo,
	providers ProviderRepo,
	jobs JobRepo,
	storage ObjectStore,
	events EventPublisher,
	cfg Config,
	logger *slog.Logger,
) *Service {
	return &Service{
		sources:   sources,
		providers: providers,
		jobs:      jobs,
		storage:   storage,
		events:    events,
		cfg:       cfg,
		logger:    logger,
		now:       time.Now,
	}
}

// ListSourcesByEntry devuelve las fuentes disponibles para el selector.
func (s *Service) ListSourcesByEntry(ctx context.Context, entryID int64, kind domain.SourceKind, number float64) ([]*domain.Source, error) {
	return s.sources.ListByEntry(ctx, entryID, kind, number)
}

// GetStreamHandle firma la URL del HLS master playlist de un source listo.
func (s *Service) GetStreamHandle(ctx context.Context, sourceID int64) (*StreamHandle, error) {
	source, err := s.sources.GetByID(ctx, sourceID)
	if err != nil {
		return nil, err
	}
	if source.Status != domain.StatusReady {
		return nil, domain.ErrSourceNotReady
	}
	if source.Format != domain.FormatHLS && source.Format != domain.FormatMP4 {
		return nil, domain.ErrSourceNotReady
	}

	key := playlistKeyFor(source.ID, source.Format)
	url, err := s.storage.PresignGet(ctx, key, s.cfg.PresignTTL)
	if err != nil {
		return nil, err
	}

	return &StreamHandle{
		SourceID:  source.ID,
		Format:    string(source.Format),
		URL:       url,
		ExpiresAt: s.now().Add(s.cfg.PresignTTL),
	}, nil
}

// GetSignedPages devuelve las URLs firmadas de las páginas de un capítulo.
func (s *Service) GetSignedPages(ctx context.Context, sourceID int64) ([]SignedPage, error) {
	source, err := s.sources.GetByID(ctx, sourceID)
	if err != nil {
		return nil, err
	}
	if source.Status != domain.StatusReady {
		return nil, domain.ErrSourceNotReady
	}
	if source.Format != domain.FormatImages {
		return nil, domain.ErrSourceNotReady
	}

	pages, err := s.sources.ListReadyPages(ctx, source.ID)
	if err != nil {
		return nil, err
	}

	signed := make([]SignedPage, 0, len(pages))
	for _, page := range pages {
		url, err := s.storage.PresignGet(ctx, page.ImageKey, s.cfg.PresignTTL)
		if err != nil {
			return nil, err
		}
		signed = append(signed, SignedPage{
			Number: page.PageNumber,
			URL:    url,
			Width:  page.Width,
			Height: page.Height,
		})
	}

	return signed, nil
}

// RegisterSource registra una fuente de un proveedor (scan/external).
func (s *Service) RegisterSource(ctx context.Context, req RegisterSourceRequest) (*domain.Source, error) {
	if _, err := s.providers.GetBySlug(ctx, req.ProviderSlug); err != nil {
		if errors.Is(err, domain.ErrProviderNotFound) {
			return nil, domain.ErrProviderNotFound
		}
		s.logger.Error("provider lookup failed", "slug", req.ProviderSlug, "error", err)
		return nil, fmt.Errorf("provider lookup: %w", err)
	}

	source := &domain.Source{
		ProviderID:  req.ProviderSlug,
		EntryID:     req.EntryID,
		Kind:        req.Kind,
		Number:      req.Number,
		Title:       req.Title,
		Language:    req.Language,
		Quality:     req.Quality,
		Format:      req.Format,
		ExternalURL: req.ExternalURL,
		Status:      s.initialStatusFor(req.Format),
	}

	if err := s.sources.Insert(ctx, source); err != nil {
		return nil, err
	}

	return source, nil
}

// StartUpload crea el job de upload para un source interno y firma la URL de subida.
func (s *Service) StartUpload(ctx context.Context, req StartUploadRequest) (*UploadHandle, error) {
	source, err := s.sources.GetByID(ctx, req.SourceID)
	if err != nil {
		return nil, err
	}
	if source.Status != domain.StatusProcessing {
		return nil, fmt.Errorf("source %d is not in processing state", source.ID)
	}

	key := uploadKeyFor(source.ID, req.Filename)
	putURL, err := s.storage.PresignPut(ctx, key, 30*time.Minute)
	if err != nil {
		return nil, err
	}

	job := &domain.UploadJob{
		SourceID:  source.ID,
		State:     "pending_upload",
		ObjectKey: key,
	}
	if err := s.jobs.Insert(ctx, job); err != nil {
		return nil, err
	}

	return &UploadHandle{
		JobID:     job.ID,
		SourceID:  source.ID,
		UploadURL: putURL,
		Key:       key,
		ExpiresAt: s.now().Add(30 * time.Minute),
	}, nil
}

// CompleteUpload marca el upload recibido y publica el pedido de transcode.
func (s *Service) CompleteUpload(ctx context.Context, jobID string) (*domain.UploadJob, error) {
	job, err := s.jobs.GetByID(ctx, jobID)
	if err != nil {
		return nil, err
	}

	source, err := s.sources.GetByID(ctx, job.SourceID)
	if err != nil {
		return nil, err
	}

	if err := s.jobs.SetState(ctx, job.ID, "uploaded", 0, ""); err != nil {
		return nil, err
	}

	if err := s.events.PublishTranscodeRequested(ctx, job.ID, source.ID, s.cfg.MediaBucket, job.ObjectKey); err != nil {
		return nil, err
	}

	s.logger.Info("transcode requested", "jobId", job.ID, "sourceId", source.ID, "key", job.ObjectKey)
	job.State = "uploaded"
	return job, nil
}

func (s *Service) HandleTranscodeProgress(ctx context.Context, jobID string, sourceID int64, pct int) error {
	job, err := s.jobForEvent(ctx, jobID, sourceID)
	if err != nil {
		return err
	}

	state := "transcoding"
	if pct >= 100 {
		state = "uploading"
	}
	return s.jobs.SetState(ctx, job.ID, state, pct, "")
}

// GetJob devuelve el estado de un upload job.
func (s *Service) GetJob(ctx context.Context, jobID string) (*domain.UploadJob, error) {
	return s.jobs.GetByID(ctx, jobID)
}

// HandleTranscodeCompleted marca el source como ready y notifica (worker → content).
func (s *Service) HandleTranscodeCompleted(ctx context.Context, jobID string, sourceID int64) error {
	job, err := s.jobForEvent(ctx, jobID, sourceID)
	if err != nil {
		return err
	}

	playlistKey := playlistKeyFor(sourceID, domain.FormatHLS)
	if err := s.sources.SetReadyWithPlaylist(ctx, sourceID, playlistKey); err != nil {
		return err
	}

	if err := s.jobs.SetState(ctx, job.ID, "completed", 100, ""); err != nil {
		return err
	}

	return s.events.PublishSourceReady(ctx, sourceID)
}

func (s *Service) HandleTranscodeFailed(ctx context.Context, jobID string, sourceID int64, message string) error {
	job, err := s.jobForEvent(ctx, jobID, sourceID)
	if err != nil {
		return err
	}

	if err := s.sources.SetStatus(ctx, job.SourceID, domain.StatusFailed); err != nil {
		return err
	}
	return s.jobs.SetState(ctx, job.ID, "failed", job.Progress, message)
}

func (s *Service) jobForEvent(ctx context.Context, jobID string, sourceID int64) (*domain.UploadJob, error) {
	job, err := s.jobs.GetByID(ctx, jobID)
	if err != nil {
		return nil, err
	}
	if job.SourceID != sourceID {
		return nil, domain.ErrJobNotFound
	}
	return job, nil
}

// CreateProvider da de alta un proveedor (publisher onboarding).
func (s *Service) CreateProvider(ctx context.Context, slug, name string, kind domain.ProviderKind) (*domain.Provider, error) {
	if kind == "" {
		kind = domain.ProviderScan
	}

	provider := &domain.Provider{
		Slug:   slug,
		Name:   name,
		Kind:   kind,
		Status: "active",
	}

	if err := s.providers.Create(ctx, provider); err != nil {
		return nil, err
	}

	return provider, nil
}

func (s *Service) initialStatusFor(format domain.SourceFormat) domain.SourceStatus {
	if format == domain.FormatLink {
		return domain.StatusReady
	}
	return domain.StatusProcessing
}

// ── DTOs de salida ────────────────────────────────────────────────────

type StreamHandle struct {
	SourceID  int64     `json:"sourceId"`
	Format    string    `json:"format"`
	URL       string    `json:"url"`
	ExpiresAt time.Time `json:"expiresAt"`
}

type SignedPage struct {
	Number int    `json:"number"`
	URL    string `json:"url"`
	Width  int    `json:"width"`
	Height int    `json:"height"`
}

type RegisterSourceRequest struct {
	ProviderSlug string              `json:"providerSlug"`
	EntryID      int64               `json:"entryId"`
	Kind         domain.SourceKind   `json:"kind"`
	Number       float64             `json:"number"`
	Title        string              `json:"title"`
	Language     string              `json:"language"`
	Quality      string              `json:"quality"`
	Format       domain.SourceFormat `json:"format"`
	ExternalURL  string              `json:"externalUrl,omitempty"`
}

type StartUploadRequest struct {
	SourceID int64  `json:"sourceId"`
	Filename string `json:"filename"`
}

type UploadHandle struct {
	JobID     string    `json:"jobId"`
	SourceID  int64     `json:"sourceId"`
	UploadURL string    `json:"uploadUrl"`
	Key       string    `json:"-"`
	ExpiresAt time.Time `json:"expiresAt"`
}

// ── Funciones de key layout en el bucket ─────────────────────────────

func uploadKeyFor(sourceID int64, filename string) string {
	return fmt.Sprintf("uploads/%d/%s", sourceID, filename)
}

func playlistKeyFor(sourceID int64, format domain.SourceFormat) string {
	if format == domain.FormatMP4 {
		return fmt.Sprintf("media/%d/master.mp4", sourceID)
	}
	return fmt.Sprintf("media/%d/hls/master.m3u8", sourceID)
}
