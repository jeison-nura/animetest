package app

import (
	"context"
	"time"

	"io"
	"log/slog"

	"mnglib/content/internal/domain"
)

type mockSourceRepo struct {
	getByIDResult  *domain.Source
	getByIDErr     error
	listResult     []*domain.Source
	listErr        error
	setStatusCalls int
	lastStatus     domain.SourceStatus
}

func (m *mockSourceRepo) Insert(ctx context.Context, s *domain.Source) error { return nil }
func (m *mockSourceRepo) GetByID(ctx context.Context, id int64) (*domain.Source, error) {
	return m.getByIDResult, m.getByIDErr
}
func (m *mockSourceRepo) ListByEntry(ctx context.Context, id int64, kind domain.SourceKind, num float64) ([]*domain.Source, error) {
	return m.listResult, m.listErr
}
func (m *mockSourceRepo) SetStatus(ctx context.Context, id int64, status domain.SourceStatus) error {
	m.setStatusCalls++
	m.lastStatus = status
	return nil
}
func (m *mockSourceRepo) SetReadyWithPlaylist(ctx context.Context, id int64, key string) error {
	m.setStatusCalls++
	m.lastStatus = domain.StatusReady
	return nil
}
func (m *mockSourceRepo) ListReadyPages(ctx context.Context, id int64) ([]PageInfo, error) { return nil, nil }
func (m *mockSourceRepo) InsertPages(ctx context.Context, id int64, pages []PageInfo) error { return nil }

type mockProviderRepo struct {
	getBySlugResult *domain.Provider
	getBySlugErr    error
}

func (m *mockProviderRepo) GetBySlug(ctx context.Context, slug string) (*domain.Provider, error) {
	return m.getBySlugResult, m.getBySlugErr
}
func (m *mockProviderRepo) Create(ctx context.Context, p *domain.Provider) error { return nil }

type mockJobRepo struct {
	getResult *domain.UploadJob
	getErr    error
	setStateCalls int
}

func (m *mockJobRepo) Insert(ctx context.Context, job *domain.UploadJob) error { return nil }
func (m *mockJobRepo) GetByID(ctx context.Context, id string) (*domain.UploadJob, error) {
	return m.getResult, m.getErr
}
func (m *mockJobRepo) SetState(ctx context.Context, id, state string, progress int, errMsg string) error {
	m.setStateCalls++
	return nil
}

type mockStorage struct {
	presignGetURL string
	presignGetErr error
	downloadErr   error
	uploadErr     error
}

func (m *mockStorage) PresignGet(ctx context.Context, key string, ttl time.Duration) (string, error) {
	return m.presignGetURL, m.presignGetErr
}
func (m *mockStorage) PresignPut(ctx context.Context, key string, ttl time.Duration) (string, error) {
	return "https://example.com/put", nil
}
func (m *mockStorage) Download(ctx context.Context, key, dest string) error { return m.downloadErr }
func (m *mockStorage) Upload(ctx context.Context, key, src string) error    { return nil }

type mockPublisher struct {
	requestedCalls int
	progressCalls  int
	completedCalls int
	failedCalls    int
	readyCalls     int
	lastFailedErr  string
}

func (m *mockPublisher) PublishTranscodeRequested(ctx context.Context, jobID string, sourceID int64, bucket, key string) error {
	m.requestedCalls++
	return nil
}
func (m *mockPublisher) PublishTranscodeProgress(ctx context.Context, jobID string, sourceID int64, pct int) error {
	m.progressCalls++
	return nil
}
func (m *mockPublisher) PublishTranscodeCompleted(ctx context.Context, jobID string, sourceID int64) error {
	m.completedCalls++
	return nil
}
func (m *mockPublisher) PublishTranscodeFailed(ctx context.Context, jobID string, sourceID int64, msg string) error {
	m.failedCalls++
	m.lastFailedErr = msg
	return nil
}
func (m *mockPublisher) PublishSourceReady(ctx context.Context, sourceID int64) error {
	m.readyCalls++
	return nil
}

func newTestService(sources SourceRepo, providers ProviderRepo, jobs JobRepo, storage ObjectStore, events EventPublisher) *Service {
	return NewService(sources, providers, jobs, storage, events, Config{
		MediaBucket: "test-bucket",
		PresignTTL:  time.Hour,
	}, newTestLogger())
}

func newTestLogger() *slog.Logger {
	return slog.New(slog.NewTextHandler(io.Discard, nil))
}

func sources() SourceRepo {
	return &mockSourceRepo{}
}
