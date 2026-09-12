package http

import (
	"encoding/json"
	"log/slog"
	"net/http"
	"time"

	"mnglib/activity/internal/app"
	"mnglib/activity/internal/domain"
)

type Handler struct {
	repo app.Repo
}

func NewHandler(repo app.Repo) *Handler {
	return &Handler{repo: repo}
}

func writeJSON(w http.ResponseWriter, status int, body any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(body)
}

func writeError(w http.ResponseWriter, status int, message string) {
	writeErrorLog(w, status, message, nil)
}

func writeErrorLog(w http.ResponseWriter, status int, message string, err error) {
	if err != nil {
		slog.Error("request failed", "status", status, "error", err)
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(map[string]any{
		"error": map[string]string{"code": "activity_error", "message": message},
	})
}

type listResponse struct {
	CatalogID int64  `json:"catalogId"`
	Status    string `json:"status"`
}

func (h *Handler) ListAnime(w http.ResponseWriter, r *http.Request) {
	userID := UserIDFrom(r.Context())
	entries, err := h.repo.ListAnime(r.Context(), userID)
	if err != nil {
		writeErrorLog(w, http.StatusInternalServerError, "internal error", err)
		return
	}

	result := make([]listResponse, 0, len(entries))
	for _, e := range entries {
		result = append(result, listResponse{CatalogID: e.CatalogID, Status: e.Status})
	}
	writeJSON(w, http.StatusOK, result)
}

func (h *Handler) ListManga(w http.ResponseWriter, r *http.Request) {
	userID := UserIDFrom(r.Context())
	entries, err := h.repo.ListManga(r.Context(), userID)
	if err != nil {
		writeErrorLog(w, http.StatusInternalServerError, "internal error", err)
		return
	}

	result := make([]listResponse, 0, len(entries))
	for _, e := range entries {
		result = append(result, listResponse{CatalogID: e.CatalogID, Status: e.Status})
	}
	writeJSON(w, http.StatusOK, result)
}

type upsertListRequest struct {
	CatalogID int64  `json:"catalogId"`
	Kind      string `json:"kind"`
	Status    string `json:"status"`
}

func (h *Handler) UpsertList(w http.ResponseWriter, r *http.Request) {
	userID := UserIDFrom(r.Context())

	var req upsertListRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil ||
		req.CatalogID <= 0 || req.Kind == "" || req.Status == "" {
		writeError(w, http.StatusUnprocessableEntity, "catalogId, kind and status are required")
		return
	}

	if err := h.repo.UpsertListStatus(r.Context(), userID, req.CatalogID, req.Kind, domain.ListStatus(req.Status)); err != nil {
		writeErrorLog(w, http.StatusInternalServerError, "internal error", err)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

type upsertProgressRequest struct {
	CatalogID int64  `json:"catalogId"`
	Episode   string `json:"episode"`
	Progress  int    `json:"progress"`
	Provider  string `json:"provider"`
}

func (h *Handler) UpsertProgress(w http.ResponseWriter, r *http.Request) {
	userID := UserIDFrom(r.Context())

	var req upsertProgressRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.CatalogID <= 0 {
		writeError(w, http.StatusUnprocessableEntity, "catalogId is required")
		return
	}

	err := h.repo.UpsertProgress(r.Context(), userID, domain.Progress{
		CatalogID: req.CatalogID,
		Episode:   req.Episode,
		Progress:  req.Progress,
		Provider:  req.Provider,
		UpdatedAt: time.Now(),
	})
	if err != nil {
		writeErrorLog(w, http.StatusInternalServerError, "internal error", err)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (h *Handler) RecentActivity(w http.ResponseWriter, r *http.Request) {
	userID := UserIDFrom(r.Context())
	items, err := h.repo.RecentActivity(r.Context(), userID, 5)
	if err != nil {
		writeErrorLog(w, http.StatusInternalServerError, "internal error", err)
		return
	}
	writeJSON(w, http.StatusOK, items)
}

func (h *Handler) WatchHistory(w http.ResponseWriter, r *http.Request) {
	userID := UserIDFrom(r.Context())
	items, err := h.repo.WatchHistory(r.Context(), userID)
	if err != nil {
		writeErrorLog(w, http.StatusInternalServerError, "internal error", err)
		return
	}
	writeJSON(w, http.StatusOK, items)
}

func (h *Handler) ContinueWatching(w http.ResponseWriter, r *http.Request) {
	userID := UserIDFrom(r.Context())
	items, err := h.repo.ContinueWatching(r.Context(), userID)
	if err != nil {
		writeErrorLog(w, http.StatusInternalServerError, "internal error", err)
		return
	}
	writeJSON(w, http.StatusOK, items)
}

func (h *Handler) Stats(w http.ResponseWriter, r *http.Request) {
	userID := UserIDFrom(r.Context())
	stats, err := h.repo.Stats(r.Context(), userID)
	if err != nil {
		writeErrorLog(w, http.StatusInternalServerError, "internal error", err)
		return
	}
	writeJSON(w, http.StatusOK, stats)
}

func (h *Handler) GenreAffinities(w http.ResponseWriter, r *http.Request) {
	userID := UserIDFrom(r.Context())
	affinities, err := h.repo.GenreAffinities(r.Context(), userID)
	if err != nil {
		writeErrorLog(w, http.StatusInternalServerError, "internal error", err)
		return
	}
	writeJSON(w, http.StatusOK, affinities)
}

func (h *Handler) Achievements(w http.ResponseWriter, r *http.Request) {
	userID := UserIDFrom(r.Context())
	achievements, err := h.repo.Achievements(r.Context(), userID)
	if err != nil {
		writeErrorLog(w, http.StatusInternalServerError, "internal error", err)
		return
	}
	writeJSON(w, http.StatusOK, achievements)
}

func (h *Handler) Settings(w http.ResponseWriter, r *http.Request) {
	userID := UserIDFrom(r.Context())

	if r.Method == http.MethodPut {
		var s domain.UserSettings
		if err := json.NewDecoder(r.Body).Decode(&s); err != nil {
			writeError(w, http.StatusUnprocessableEntity, "invalid body")
			return
		}
		if err := h.repo.UpsertSettings(r.Context(), userID, s); err != nil {
			writeErrorLog(w, http.StatusInternalServerError, "internal error", err)
			return
		}
		w.WriteHeader(http.StatusNoContent)
		return
	}

	settings, err := h.repo.Settings(r.Context(), userID)
	if err != nil {
		writeErrorLog(w, http.StatusInternalServerError, "internal error", err)
		return
	}
	writeJSON(w, http.StatusOK, settings)
}
