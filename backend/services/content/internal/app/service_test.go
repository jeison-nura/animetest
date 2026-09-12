package app

import (
	"context"
	"testing"

	"mnglib/content/internal/domain"
)

func TestGetStreamHandle_ReadySource(t *testing.T) {
	sources := &mockSourceRepo{
		getByIDResult: &domain.Source{
			ID:     1,
			Status: domain.StatusReady,
			Format: domain.FormatHLS,
		},
	}
	storage := &mockStorage{presignGetURL: "https://media.example.com/signed"}
	svc := newTestService(sources, nil, nil, storage, nil)

	handle, err := svc.GetStreamHandle(t.Context(), 1)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if handle.URL != "https://media.example.com/signed" {
		t.Errorf("expected presigned URL, got %q", handle.URL)
	}
	if handle.Format != string(domain.FormatHLS) {
		t.Errorf("expected format hls, got %q", handle.Format)
	}
}

func TestGetStreamHandle_NotReady(t *testing.T) {
	sources := &mockSourceRepo{
		getByIDResult: &domain.Source{
			ID:     1,
			Status: domain.StatusProcessing,
			Format: domain.FormatHLS,
		},
	}
	svc := newTestService(sources, nil, nil, &mockStorage{}, nil)

	_, err := svc.GetStreamHandle(t.Context(), 1)
	if err == nil {
		t.Fatal("expected error for processing source")
	}
	if err != domain.ErrSourceNotReady {
		t.Errorf("expected ErrSourceNotReady, got %v", err)
	}
}

func TestGetStreamHandle_UnsupportedFormat(t *testing.T) {
	sources := &mockSourceRepo{
		getByIDResult: &domain.Source{
			ID:     1,
			Status: domain.StatusReady,
			Format: domain.FormatImages,
		},
	}
	svc := newTestService(sources, nil, nil, &mockStorage{}, nil)

	_, err := svc.GetStreamHandle(t.Context(), 1)
	if err != domain.ErrSourceNotReady {
		t.Errorf("expected ErrSourceNotReady for images format, got %v", err)
	}
}

func TestRegisterSource_ProviderNotFound(t *testing.T) {
	providers := &mockProviderRepo{getBySlugErr: domain.ErrProviderNotFound}
	svc := newTestService(&mockSourceRepo{}, providers, nil, &mockStorage{}, nil)

	req := RegisterSourceRequest{ProviderSlug: "nonexistent", EntryID: 1}
	_, err := svc.RegisterSource(t.Context(), req)
	if err != domain.ErrProviderNotFound {
		t.Errorf("expected ErrProviderNotFound, got %v", err)
	}
}

func TestRegisterSource_ProviderLookupFails(t *testing.T) {
	providers := &mockProviderRepo{getBySlugErr: context.DeadlineExceeded}
	svc := newTestService(sources(), providers, nil, &mockStorage{}, nil)

	req := RegisterSourceRequest{ProviderSlug: "mnglib"}
	_, err := svc.RegisterSource(t.Context(), req)
	if err == nil {
		t.Fatal("expected error for provider lookup failure")
	}
	if err == domain.ErrProviderNotFound {
		t.Error("infrastructure error should not be masked as ErrProviderNotFound")
	}
}

func TestHandleTranscodeFailed_SetsSourceFailed(t *testing.T) {
	sources := &mockSourceRepo{}
	jobs := &mockJobRepo{getResult: &domain.UploadJob{ID: "job-1", SourceID: 5}}
	publisher := &mockPublisher{}
	svc := newTestService(sources, nil, jobs, &mockStorage{}, publisher)

	err := svc.HandleTranscodeFailed(t.Context(), "job-1", 5, "transcode failed")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if sources.setStatusCalls == 0 {
		t.Error("expected SetStatus to be called")
	}
	if sources.lastStatus != domain.StatusFailed {
		t.Errorf("expected status failed, got %s", sources.lastStatus)
	}
}

func TestHandleTranscodeProgress_SetsTranscodingState(t *testing.T) {
	jobs := &mockJobRepo{getResult: &domain.UploadJob{ID: "job-1", SourceID: 5}}
	svc := newTestService(nil, nil, jobs, &mockStorage{}, nil)

	if err := svc.HandleTranscodeProgress(t.Context(), "job-1", 5, 50); err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if jobs.setStateCalls == 0 {
		t.Error("expected SetState to be called")
	}
}

func TestCompleteUpload_PublishesTranscodeRequested(t *testing.T) {
	sources := &mockSourceRepo{getByIDResult: &domain.Source{ID: 5}}
	jobs := &mockJobRepo{getResult: &domain.UploadJob{ID: "job-1", SourceID: 5, ObjectKey: "uploads/5/file.mp4"}}
	publisher := &mockPublisher{}
	svc := newTestService(sources, nil, jobs, &mockStorage{}, publisher)

	job, err := svc.CompleteUpload(t.Context(), "job-1")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if publisher.requestedCalls != 1 {
		t.Errorf("expected 1 transcode requested event, got %d", publisher.requestedCalls)
	}
	if job.State != "uploaded" {
		t.Errorf("expected state uploaded, got %s", job.State)
	}
}

func TestIsSupportedStorageProvider(t *testing.T) {
	if !IsSupportedStorageProvider("s3") {
		t.Error("s3 should be supported")
	}
	if !IsSupportedStorageProvider("minio") {
		t.Error("minio should be supported")
	}
	if !IsSupportedStorageProvider("MINIO") {
		t.Error("MINIO (case insensitive) should be supported")
	}
	if IsSupportedStorageProvider("azure") {
		t.Error("azure should not be supported yet")
	}
	if IsSupportedStorageProvider("") {
		t.Error("empty string should not be supported")
	}
}
