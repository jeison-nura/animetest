package http

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"mnglib/auth/internal/domain"
)

type stubAuthService struct {
	registerResult domain.PublicUser
	registerErr    error
	loginResult    domain.TokenPair
	loginErr       error
}

func (s *stubAuthService) Register(ctx context.Context, email, username, password string) (domain.PublicUser, error) {
	return s.registerResult, s.registerErr
}
func (s *stubAuthService) Login(ctx context.Context, email, password string) (domain.TokenPair, error) {
	return s.loginResult, s.loginErr
}
func (s *stubAuthService) Refresh(ctx context.Context, token string) (domain.TokenPair, error) {
	return domain.TokenPair{}, nil
}
func (s *stubAuthService) Logout(ctx context.Context, token string) error { return nil }
func (s *stubAuthService) JWKS() []byte                                   { return []byte(`{}`) }

func TestRegister_InvalidPassword(t *testing.T) {
	handler := NewRouter(NewHandler(&stubAuthService{}))

	body, _ := json.Marshal(map[string]string{"email": "a@b.com", "username": "u", "password": "short"})
	req := httptest.NewRequest("POST", "/auth/register", bytes.NewReader(body))
	rec := httptest.NewRecorder()
	handler.ServeHTTP(rec, req)

	if rec.Code != http.StatusUnprocessableEntity {
		t.Errorf("expected 422 for short password, got %d", rec.Code)
	}
}

func TestRegister_EmailTaken(t *testing.T) {
	service := &stubAuthService{registerErr: domain.ErrEmailTaken}
	handler := NewRouter(NewHandler(service))

	body, _ := json.Marshal(map[string]string{"email": "a@b.com", "username": "u", "password": "secret123"})
	req := httptest.NewRequest("POST", "/auth/register", bytes.NewReader(body))
	rec := httptest.NewRecorder()
	handler.ServeHTTP(rec, req)

	if rec.Code != http.StatusConflict {
		t.Errorf("expected 409 for taken email, got %d", rec.Code)
	}
}

func TestLogin_InvalidCredentials(t *testing.T) {
	service := &stubAuthService{loginErr: domain.ErrInvalidCredentials}
	handler := NewRouter(NewHandler(service))

	body, _ := json.Marshal(map[string]string{"email": "a@b.com", "password": "wrong"})
	req := httptest.NewRequest("POST", "/auth/login", bytes.NewReader(body))
	rec := httptest.NewRecorder()
	handler.ServeHTTP(rec, req)

	if rec.Code != http.StatusUnauthorized {
		t.Errorf("expected 401, got %d", rec.Code)
	}
}

func TestLogin_Success(t *testing.T) {
	pair := domain.TokenPair{AccessToken: "at", RefreshToken: "rt", TokenType: "Bearer"}
	service := &stubAuthService{loginResult: pair}
	handler := NewRouter(NewHandler(service))

	body, _ := json.Marshal(map[string]string{"email": "a@b.com", "password": "secret"})
	req := httptest.NewRequest("POST", "/auth/login", bytes.NewReader(body))
	rec := httptest.NewRecorder()
	handler.ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", rec.Code)
	}
	var result map[string]interface{}
	if err := json.Unmarshal(rec.Body.Bytes(), &result); err != nil {
		t.Fatalf("failed to parse: %v", err)
	}
	if result["accessToken"] != "at" {
		t.Errorf("expected accessToken, got %v", result)
	}
}
