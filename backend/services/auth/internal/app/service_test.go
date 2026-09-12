package app

import (
	"testing"

	"mnglib/auth/internal/domain"
)

func TestRegister_Success(t *testing.T) {
	users := &mockUserRepo{}
	svc := newTestService(users, &mockRefreshRepo{}, &mockHasher{}, &mockIssuer{})

	public, err := svc.Register(t.Context(), "Test@Example.com", "testuser", "secret123")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if public.Email != "test@example.com" {
		t.Errorf("expected normalized email, got %q", public.Email)
	}
}

func TestRegister_EmailTaken(t *testing.T) {
	users := &mockUserRepo{createErr: domain.ErrEmailTaken}
	svc := newTestService(users, &mockRefreshRepo{}, &mockHasher{}, &mockIssuer{})

	_, err := svc.Register(t.Context(), "test@example.com", "testuser", "secret123")
	if err != domain.ErrEmailTaken {
		t.Errorf("expected ErrEmailTaken, got %v", err)
	}
}

func TestLogin_Success(t *testing.T) {
	user := readyUser("user-1")
	hasher := &mockHasher{verify: true}
	users := &mockUserRepo{getByEmailResult: user}
	svc := newTestService(users, &mockRefreshRepo{}, hasher, &mockIssuer{})

	pair, err := svc.Login(t.Context(), "test@example.com", "secret123")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if pair.AccessToken != "access-token" {
		t.Errorf("expected access token, got %q", pair.AccessToken)
	}
	if pair.RefreshToken == "" {
		t.Error("expected non-empty refresh token")
	}
}

func TestLogin_WrongPassword(t *testing.T) {
	user := readyUser("user-1")
	hasher := &mockHasher{verify: false}
	users := &mockUserRepo{getByEmailResult: user}
	svc := newTestService(users, &mockRefreshRepo{}, hasher, &mockIssuer{})

	_, err := svc.Login(t.Context(), "test@example.com", "wrong-password")
	if err != domain.ErrInvalidCredentials {
		t.Errorf("expected ErrInvalidCredentials, got %v", err)
	}
}

func TestLogin_UserNotFound(t *testing.T) {
	svc := newTestService(&mockUserRepo{}, &mockRefreshRepo{}, &mockHasher{}, &mockIssuer{})

	_, err := svc.Login(t.Context(), "unknown@example.com", "password")
	if err != domain.ErrInvalidCredentials {
		t.Errorf("expected ErrInvalidCredentials for unknown user, got %v", err)
	}
}

func TestLogout_Success(t *testing.T) {
	refresh := &mockRefreshRepo{findResult: &RefreshToken{ID: "token-1"}}
	svc := newTestService(&mockUserRepo{}, refresh, &mockHasher{}, &mockIssuer{})

	if err := svc.Logout(t.Context(), "refresh-token"); err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
}
