package http

import (
	"encoding/json"
	"errors"
	"log/slog"
	"net/http"
	"strconv"
	"context"

	"mnglib/content/internal/app"
	"mnglib/content/internal/domain"
)

// ContentService is the port the handler depends on.
type ContentService interface {
	ListSourcesByEntry(ctx context.Context, entryID int64, kind domain.SourceKind, number float64) ([]*domain.Source, error)
	GetStreamHandle(ctx context.Context, sourceID int64) (*app.StreamHandle, error)
	GetSignedPages(ctx context.Context, sourceID int64) ([]app.SignedPage, error)
	RegisterSource(ctx context.Context, req app.RegisterSourceRequest) (*domain.Source, error)
	StartUpload(ctx context.Context, req app.StartUploadRequest) (*app.UploadHandle, error)
	CompleteUpload(ctx context.Context, jobID string) (*domain.UploadJob, error)
	GetJob(ctx context.Context, jobID string) (*domain.UploadJob, error)
	CreateProvider(ctx context.Context, slug, name string, kind domain.ProviderKind) (*domain.Provider, error)
}

type Handler struct {
	service ContentService
}

func NewHandler(service ContentService) *Handler {
	return &Handler{service: service}
}

func writeJSON(w http.ResponseWriter, status int, body any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(body)
}

func writeDomainError(w http.ResponseWriter, err error) {
	switch {
	case errors.Is(err, domain.ErrNotFound), errors.Is(err, domain.ErrProviderNotFound), errors.Is(err, domain.ErrJobNotFound):
		writeJSON(w, http.StatusNotFound, errorBody("not_found", err.Error()))
	case errors.Is(err, domain.ErrSourceNotReady):
		writeJSON(w, http.StatusConflict, errorBody("not_ready", err.Error()))
	case errors.Is(err, domain.ErrDuplicateSource):
		writeJSON(w, http.StatusConflict, errorBody("duplicate_source", err.Error()))
	case errors.Is(err, domain.ErrInvalidUpload):
		writeJSON(w, http.StatusUnprocessableEntity, errorBody("invalid_upload", err.Error()))
	default:
		writeJSON(w, http.StatusInternalServerError, errorBody("internal", "unexpected error"))
	}
}

func errorBody(code, message string) map[string]any {
	return map[string]any{
		"error": map[string]string{"code": code, "message": message},
	}
}

// GET /sources/entry/{entryId}?kind=episode&number=12
func (h *Handler) ListSources(w http.ResponseWriter, r *http.Request) {
	entryID, err := strconv.ParseInt(r.PathValue("entryId"), 10, 64)
	if err != nil || entryID <= 0 {
		writeJSON(w, http.StatusBadRequest, errorBody("invalid_entry", "entryId must be a positive integer"))
		return
	}

	kind := domain.SourceKind(r.URL.Query().Get("kind"))
	if kind != domain.KindEpisode && kind != domain.KindChapter {
		writeJSON(w, http.StatusBadRequest, errorBody("invalid_kind", "kind must be episode or chapter"))
		return
	}

	number, err := strconv.ParseFloat(r.URL.Query().Get("number"), 64)
	if err != nil || number <= 0 {
		writeJSON(w, http.StatusBadRequest, errorBody("invalid_number", "number must be a positive number (e.g. 12 or 12.5)"))
		return
	}

	sources, err := h.service.ListSourcesByEntry(r.Context(), entryID, kind, number)
	if err != nil {
		writeDomainError(w, err)
		return
	}

	writeJSON(w, http.StatusOK, sources)
}

// GET /sources/{id}/stream
func (h *Handler) GetStream(w http.ResponseWriter, r *http.Request) {
	sourceID, err := strconv.ParseInt(r.PathValue("id"), 10, 64)
	if err != nil {
		writeJSON(w, http.StatusBadRequest, errorBody("invalid_source", "invalid source id"))
		return
	}

	handle, err := h.service.GetStreamHandle(r.Context(), sourceID)
	if err != nil {
		writeDomainError(w, err)
		return
	}

	writeJSON(w, http.StatusOK, handle)
}

// GET /sources/{id}/pages
func (h *Handler) GetPages(w http.ResponseWriter, r *http.Request) {
	sourceID, err := strconv.ParseInt(r.PathValue("id"), 10, 64)
	if err != nil {
		writeJSON(w, http.StatusBadRequest, errorBody("invalid_source", "invalid source id"))
		return
	}

	pages, err := h.service.GetSignedPages(r.Context(), sourceID)
	if err != nil {
		writeDomainError(w, err)
		return
	}

	writeJSON(w, http.StatusOK, pages)
}

// POST /provider/sources — registro de fuentes (scan/external/internal)
func (h *Handler) RegisterSource(w http.ResponseWriter, r *http.Request) {
	var req app.RegisterSourceRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSON(w, http.StatusBadRequest, errorBody("invalid_body", "malformed JSON"))
		return
	}

	if req.ProviderSlug == "" || req.EntryID <= 0 || req.Number <= 0 || req.Language == "" || req.Format == "" {
		writeJSON(w, http.StatusUnprocessableEntity, errorBody("validation_failed",
			"providerSlug, entryId, number, language and format are required"))
		return
	}

	if req.Format == domain.FormatLink && req.ExternalURL == "" {
		writeJSON(w, http.StatusUnprocessableEntity, errorBody("validation_failed", "externalUrl is required for link sources"))
		return
	}

	source, err := h.service.RegisterSource(r.Context(), req)
	if err != nil {
		writeDomainError(w, err)
		return
	}

	writeJSON(w, http.StatusCreated, source)
}

// POST /uploads — inicia upload: firma PUT y devuelve instrucciones
func (h *Handler) StartUpload(w http.ResponseWriter, r *http.Request) {
	var req app.StartUploadRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.SourceID <= 0 || req.Filename == "" {
		writeJSON(w, http.StatusUnprocessableEntity, errorBody("invalid_upload", "sourceId and filename are required"))
		return
	}

	handle, err := h.service.StartUpload(r.Context(), req)
	if err != nil {
		writeDomainError(w, err)
		return
	}

	writeJSON(w, http.StatusAccepted, handle)
}

// POST /uploads/{jobId}/complete — el cliente avisa que ya subió (presigned PUT)
func (h *Handler) CompleteUpload(w http.ResponseWriter, r *http.Request) {
	jobID := r.PathValue("jobId")
	if jobID == "" {
		writeJSON(w, http.StatusBadRequest, errorBody("invalid_job", "jobId is required"))
		return
	}

	job, err := h.service.CompleteUpload(r.Context(), jobID)
	if err != nil {
		slog.Error("complete upload failed", "jobId", jobID, "error", err)
		writeDomainError(w, err)
		return
	}

	writeJSON(w, http.StatusOK, map[string]any{
		"jobId":   job.ID,
		"state":   job.State,
		"message": "transcode queued",
	})
}

// GET /uploads/{jobId}
func (h *Handler) GetUploadStatus(w http.ResponseWriter, r *http.Request) {
	jobID := r.PathValue("jobId")

	job, err := h.service.GetJob(r.Context(), jobID)
	if err != nil {
		writeDomainError(w, err)
		return
	}

	writeJSON(w, http.StatusOK, map[string]any{
		"jobId":    job.ID,
		"state":    job.State,
		"progress": job.Progress,
	})
}

// POST /providers — alta de proveedor (publisher onboarding)
func (h *Handler) CreateProvider(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Slug    string `json:"slug"`
		Name    string `json:"name"`
		Kind    string `json:"kind"`
		OwnerID string `json:"-"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.Slug == "" || req.Name == "" {
		writeJSON(w, http.StatusUnprocessableEntity, errorBody("validation_failed", "slug and name are required"))
		return
	}

	provider, err := h.service.CreateProvider(r.Context(), req.Slug, req.Name, domain.ProviderKind(req.Kind))
	if err != nil {
		writeDomainError(w, err)
		return
	}

	writeJSON(w, http.StatusCreated, provider)
}
