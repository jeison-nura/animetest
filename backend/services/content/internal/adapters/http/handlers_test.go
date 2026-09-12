package http

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"mnglib/content/internal/app"
	"mnglib/content/internal/domain"
)

type stubContentService struct {
	listResult       []*domain.Source
	getStreamResult  *app.StreamHandle
	getStreamErr     error
	registerSource   *domain.Source
	registerErr      error
}

func (s *stubContentService) ListSourcesByEntry(ctx context.Context, entryID int64, kind domain.SourceKind, number float64) ([]*domain.Source, error) {
	return s.listResult, nil
}
func (s *stubContentService) GetStreamHandle(ctx context.Context, sourceID int64) (*app.StreamHandle, error) {
	return s.getStreamResult, s.getStreamErr
}
func (s *stubContentService) GetSignedPages(ctx context.Context, sourceID int64) ([]app.SignedPage, error) {
	return nil, nil
}
func (s *stubContentService) RegisterSource(ctx context.Context, req app.RegisterSourceRequest) (*domain.Source, error) {
	return s.registerSource, s.registerErr
}
func (s *stubContentService) StartUpload(ctx context.Context, req app.StartUploadRequest) (*app.UploadHandle, error) {
	return nil, nil
}
func (s *stubContentService) CompleteUpload(ctx context.Context, jobID string) (*domain.UploadJob, error) {
	return nil, nil
}
func (s *stubContentService) GetJob(ctx context.Context, jobID string) (*domain.UploadJob, error) {
	return nil, nil
}
func (s *stubContentService) CreateProvider(ctx context.Context, slug, name string, kind domain.ProviderKind) (*domain.Provider, error) {
	return nil, nil
}

func TestListSources_Validation(t *testing.T) {
	handler := NewRouter(NewHandler(&stubContentService{}))

	// Missing kind
	req := httptest.NewRequest("GET", "/sources/entry/1", nil)
	rec := httptest.NewRecorder()
	handler.ServeHTTP(rec, req)
	if rec.Code != http.StatusBadRequest {
		t.Errorf("expected 400 for missing kind, got %d", rec.Code)
	}

	// Invalid kind
	req = httptest.NewRequest("GET", "/sources/entry/1?kind=movie&number=1", nil)
	rec = httptest.NewRecorder()
	handler.ServeHTTP(rec, req)
	if rec.Code != http.StatusBadRequest {
		t.Errorf("expected 400 for invalid kind, got %d", rec.Code)
	}
}

func TestRegisterSource_MissingFields(t *testing.T) {
	handler := NewRouter(NewHandler(&stubContentService{}))

	body, _ := json.Marshal(map[string]interface{}{})
	req := httptest.NewRequest("POST", "/provider/sources", bytes.NewReader(body))
	rec := httptest.NewRecorder()
	handler.ServeHTTP(rec, req)

	if rec.Code != http.StatusUnprocessableEntity {
		t.Errorf("expected 422, got %d", rec.Code)
	}
}

func TestGetStream_NotReady(t *testing.T) {
	service := &stubContentService{getStreamErr: domain.ErrSourceNotReady}
	handler := NewRouter(NewHandler(service))

	req := httptest.NewRequest("GET", "/sources/media/999/stream", nil)
	rec := httptest.NewRecorder()
	handler.ServeHTTP(rec, req)

	if rec.Code != http.StatusConflict {
		t.Errorf("expected 409 for not ready, got %d", rec.Code)
	}
}
