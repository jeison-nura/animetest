package http

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"mnglib/activity/internal/app"
	"mnglib/activity/internal/domain"
)

type mockRepo struct {
	listResult []app.ListEntryDTO
	listErr    error
	upsertErr  error
}

func (m *mockRepo) ListAnime(ctx context.Context, userID string) ([]app.ListEntryDTO, error) {
	return m.listResult, m.listErr
}
func (m *mockRepo) ListManga(ctx context.Context, userID string) ([]app.ListEntryDTO, error) {
	return nil, nil
}
func (m *mockRepo) UpsertListStatus(ctx context.Context, userID string, id int64, kind string, status domain.ListStatus) error {
	return m.upsertErr
}
func (m *mockRepo) UpsertProgress(ctx context.Context, userID string, p domain.Progress) error { return nil }
func (m *mockRepo) RecentActivity(ctx context.Context, userID string, limit int) ([]domain.ActivityItem, error) {
	return []domain.ActivityItem{{ID: 1, Title: "Test"}}, nil
}
func (m *mockRepo) WatchHistory(ctx context.Context, userID string) ([]domain.ActivityItem, error) {
	return nil, nil
}
func (m *mockRepo) ContinueWatching(ctx context.Context, userID string) ([]domain.WatchProgress, error) {
	return nil, nil
}
func (m *mockRepo) Stats(ctx context.Context, userID string) ([]domain.ProfileStat, error) {
	return []domain.ProfileStat{{Label: "anime", Value: "12"}}, nil
}
func (m *mockRepo) GenreAffinities(ctx context.Context, userID string) ([]domain.GenreAffinity, error) {
	return nil, nil
}
func (m *mockRepo) Achievements(ctx context.Context, userID string) ([]domain.Achievement, error) {
	return nil, nil
}
func (m *mockRepo) Settings(ctx context.Context, userID string) (*domain.UserSettings, error) {
	return &domain.UserSettings{DisplayName: "Test"}, nil
}
func (m *mockRepo) UpsertSettings(ctx context.Context, userID string, s domain.UserSettings) error { return nil }

func authedRequest(method, path string) *http.Request {
	req := httptest.NewRequest(method, path, nil)
	return req
}

func TestListAnime_ReturnsEntries(t *testing.T) {
	repo := &mockRepo{listResult: []app.ListEntryDTO{{CatalogID: 1, Status: "inProgress"}}}
	handler := NewRouter(NewHandler(repo))

	req := httptest.NewRequest("GET", "/me/lists/anime", nil)
	rec := httptest.NewRecorder()
	handler.ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", rec.Code)
	}
	var result []map[string]interface{}
	if err := json.Unmarshal(rec.Body.Bytes(), &result); err != nil {
		t.Fatalf("failed to parse response: %v", err)
	}
	if len(result) != 1 || result[0]["status"] != "inProgress" {
		t.Errorf("unexpected response: %s", rec.Body.String())
	}
}

func TestListAnime_RepoError(t *testing.T) {
	repo := &mockRepo{listErr: context.DeadlineExceeded}
	handler := NewRouter(NewHandler(repo))

	req := httptest.NewRequest("GET", "/me/lists/anime", nil)
	rec := httptest.NewRecorder()
	handler.ServeHTTP(rec, req)

	if rec.Code != http.StatusInternalServerError {
		t.Errorf("expected 500, got %d", rec.Code)
	}
}

func TestStats_ReturnsProfileStats(t *testing.T) {
	repo := &mockRepo{}
	handler := NewRouter(NewHandler(repo))

	req := httptest.NewRequest("GET", "/me/profile/stats", nil)
	rec := httptest.NewRecorder()
	handler.ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", rec.Code)
	}
}
