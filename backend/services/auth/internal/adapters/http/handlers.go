package http

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"

	"mnglib/auth/internal/domain"
)

// AuthService is the port the handler depends on. app.Service implements it.
type AuthService interface {
	Register(ctx context.Context, email, username, password string) (domain.PublicUser, error)
	Login(ctx context.Context, email, password string) (domain.TokenPair, error)
	Refresh(ctx context.Context, refreshToken string) (domain.TokenPair, error)
	Logout(ctx context.Context, refreshToken string) error
	JWKS() []byte
}

type Handler struct {
	service AuthService
}

func NewHandler(service AuthService) *Handler {
	return &Handler{service: service}
}

type errorEnvelope struct {
	Error struct {
		Code    string `json:"code"`
		Message string `json:"message"`
	} `json:"error"`
}

func writeError(w http.ResponseWriter, status int, code, message string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(errorEnvelope{Error: struct {
		Code    string `json:"code"`
		Message string `json:"message"`
	}{Code: code, Message: message}})
}

func writeJSON(w http.ResponseWriter, status int, body any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(body)
}

type registerRequest struct {
	Email    string `json:"email"`
	Username string `json:"username"`
	Password string `json:"password"`
}

func (h *Handler) Register(w http.ResponseWriter, r *http.Request) {
	var req registerRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "invalid_body", "malformed JSON body")
		return
	}

	if req.Email == "" || req.Username == "" || len(req.Password) < 8 {
		writeError(w, http.StatusUnprocessableEntity, "validation_failed",
			"email, username and password (min 8 chars) are required")
		return
	}

	user, err := h.service.Register(r.Context(), req.Email, req.Username, req.Password)
	if err != nil {
		switch {
		case errors.Is(err, domain.ErrEmailTaken):
			writeError(w, http.StatusConflict, "email_taken", "email already registered")
		case errors.Is(err, domain.ErrUsernameTaken):
			writeError(w, http.StatusConflict, "username_taken", "username already taken")
		default:
			writeError(w, http.StatusInternalServerError, "internal", "unexpected error")
		}
		return
	}

	writeJSON(w, http.StatusCreated, map[string]any{"user": user})
}

type loginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func (h *Handler) Login(w http.ResponseWriter, r *http.Request) {
	var req loginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "invalid_body", "malformed JSON body")
		return
	}

	pair, err := h.service.Login(r.Context(), req.Email, req.Password)
	if err != nil {
		writeError(w, http.StatusUnauthorized, "invalid_credentials", "invalid email or password")
		return
	}

	writeJSON(w, http.StatusOK, pairResponse{
		AccessToken:  pair.AccessToken,
		RefreshToken: pair.RefreshToken,
		TokenType:    pair.TokenType,
		ExpiresAt:    pair.ExpiresAt,
		User:         pair.User,
	})
}

type refreshRequest struct {
	RefreshToken string `json:"refreshToken"`
}

func (h *Handler) Refresh(w http.ResponseWriter, r *http.Request) {
	var req refreshRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.RefreshToken == "" {
		writeError(w, http.StatusBadRequest, "invalid_body", "refreshToken is required")
		return
	}

	pair, err := h.service.Refresh(r.Context(), req.RefreshToken)
	if err != nil {
		if errors.Is(err, domain.ErrRefreshReuse) {
			writeError(w, http.StatusUnauthorized, "refresh_reuse",
				"token reuse detected, all sessions revoked")
			return
		}
		writeError(w, http.StatusUnauthorized, "invalid_refresh", "invalid refresh token")
		return
	}

	writeJSON(w, http.StatusOK, pairResponse{
		AccessToken:  pair.AccessToken,
		RefreshToken: pair.RefreshToken,
		TokenType:    pair.TokenType,
		ExpiresAt:    pair.ExpiresAt,
		User:         pair.User,
	})
}

func (h *Handler) Logout(w http.ResponseWriter, r *http.Request) {
	var req refreshRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.RefreshToken == "" {
		w.WriteHeader(http.StatusNoContent)
		return
	}

	if err := h.service.Logout(r.Context(), req.RefreshToken); err != nil {
		writeError(w, http.StatusInternalServerError, "internal", "unexpected error")
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (h *Handler) JWKS(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Cache-Control", "public, max-age=600")
	w.Write(h.service.JWKS())
}
