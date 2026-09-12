package app

import (
	"context"
	"io"
	"log/slog"
	"time"

	"mnglib/auth/internal/domain"
)

type mockUserRepo struct {
	getByEmailResult *domain.User
	getByEmailErr    error
	createErr        error
}

func (m *mockUserRepo) Create(ctx context.Context, user *domain.User) error { return m.createErr }
func (m *mockUserRepo) GetByEmail(ctx context.Context, email string) (*domain.User, error) {
	return m.getByEmailResult, m.getByEmailErr
}
func (m *mockUserRepo) GetByID(ctx context.Context, id string) (*domain.User, error) {
	return nil, nil
}

type mockRefreshRepo struct {
	findResult *RefreshToken
	findErr    error
	revokeAll  bool
}

func (m *mockRefreshRepo) Create(ctx context.Context, userID, tokenHash string, expiresAt time.Time) error {
	return nil
}
func (m *mockRefreshRepo) FindActive(ctx context.Context, tokenHash string) (*RefreshToken, error) {
	return m.findResult, m.findErr
}
func (m *mockRefreshRepo) Revoke(ctx context.Context, tokenID string) error { return nil }
func (m *mockRefreshRepo) RevokeAllForUser(ctx context.Context, userID string) error {
	m.revokeAll = true
	return nil
}

type mockHasher struct{ verify bool }

func (m *mockHasher) Hash(password string) (string, error) { return "hashed-password", nil }
func (m *mockHasher) Verify(password, hash string) bool    { return m.verify }

type mockIssuer struct{}

func (m *mockIssuer) Issue(ctx context.Context, claims domain.AccessTokenClaims) (string, time.Time, error) {
	return "access-token", time.Now().Add(time.Minute), nil
}
func (m *mockIssuer) JWKSJSON() []byte { return []byte(`{"keys":[]}`) }

func newTestService(users UserRepo, refresh RefreshRepo, hasher Hasher, issuer TokenIssuer) *Service {
	return NewService(users, refresh, hasher, issuer, 15*time.Minute, 720*time.Hour)
}

func testLogger() *slog.Logger {
	return slog.New(slog.NewTextHandler(io.Discard, nil))
}

func readyUser(id string) *domain.User {
	return &domain.User{ID: id, Email: "test@example.com", Username: "testuser"}
}
