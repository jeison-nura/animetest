package app

import (
	"context"
	"time"

	"mnglib/auth/internal/domain"
)

type UserRepo interface {
	Create(ctx context.Context, user *domain.User) error
	GetByEmail(ctx context.Context, email string) (*domain.User, error)
	GetByID(ctx context.Context, id string) (*domain.User, error)
}

type RefreshRepo interface {
	Create(ctx context.Context, userID, tokenHash string, expiresAt time.Time) error
	FindActive(ctx context.Context, tokenHash string) (*RefreshToken, error)
	Revoke(ctx context.Context, tokenID string) error
	RevokeAllForUser(ctx context.Context, userID string) error
}

type RefreshToken struct {
	ID        string
	UserID    string
	ExpiresAt time.Time
}

type Hasher interface {
	Hash(password string) (string, error)
	Verify(password, hash string) bool
}

type TokenIssuer interface {
	Issue(ctx context.Context, claims domain.AccessTokenClaims) (token string, expiresAt time.Time, err error)
	JWKSJSON() []byte
}

type Service struct {
	users      UserRepo
	refresh    RefreshRepo
	hasher     Hasher
	issuer     TokenIssuer
	accessTTL  time.Duration
	refreshTTL time.Duration
	now        func() time.Time
}

func NewService(
	users UserRepo,
	refresh RefreshRepo,
	hasher Hasher,
	issuer TokenIssuer,
	accessTTL time.Duration,
	refreshTTL time.Duration,
) *Service {
	return &Service{
		users:      users,
		refresh:    refresh,
		hasher:     hasher,
		issuer:     issuer,
		accessTTL:  accessTTL,
		refreshTTL: refreshTTL,
		now:        time.Now,
	}
}

func (s *Service) Register(ctx context.Context, email, username, password string) (domain.PublicUser, error) {
	hash, err := s.hasher.Hash(password)
	if err != nil {
		return domain.PublicUser{}, err
	}

	user := &domain.User{
		Email:        normalizeEmail(email),
		Username:     username,
		PasswordHash: hash,
		CreatedAt:    s.now(),
	}

	if err := s.users.Create(ctx, user); err != nil {
		return domain.PublicUser{}, err
	}

	return user.Public(), nil
}

func (s *Service) Login(ctx context.Context, email, password string) (domain.TokenPair, error) {
	user, err := s.users.GetByEmail(ctx, normalizeEmail(email))
	if err != nil || user == nil {
		return domain.TokenPair{}, domain.ErrInvalidCredentials
	}

	if !s.hasher.Verify(password, user.PasswordHash) {
		return domain.TokenPair{}, domain.ErrInvalidCredentials
	}

	return s.issuePair(ctx, user)
}

func (s *Service) Refresh(ctx context.Context, refreshToken string) (domain.TokenPair, error) {
	tokenHash := hashRefreshToken(refreshToken)

	current, err := s.refresh.FindActive(ctx, tokenHash)
	if err != nil {
		return domain.TokenPair{}, domain.ErrInvalidRefresh
	}

	if err := s.refresh.Revoke(ctx, current.ID); err != nil {
		return domain.TokenPair{}, err
	}

	user, err := s.users.GetByID(ctx, current.UserID)
	if err != nil {
		return domain.TokenPair{}, domain.ErrInvalidRefresh
	}

	return s.issuePair(ctx, user)
}

func (s *Service) Logout(ctx context.Context, refreshToken string) error {
	tokenHash := hashRefreshToken(refreshToken)

	current, err := s.refresh.FindActive(ctx, tokenHash)
	if err != nil {
		return nil
	}

	return s.refresh.Revoke(ctx, current.ID)
}

func (s *Service) JWKS() []byte {
	return s.issuer.JWKSJSON()
}

func (s *Service) issuePair(ctx context.Context, user *domain.User) (domain.TokenPair, error) {
	refreshToken, err := generateRefreshToken()
	if err != nil {
		return domain.TokenPair{}, err
	}

	refreshExpires := s.now().Add(s.refreshTTL)
	if err := s.refresh.Create(ctx, user.ID, hashRefreshToken(refreshToken), refreshExpires); err != nil {
		return domain.TokenPair{}, err
	}

	access, expiresAt, err := s.issuer.Issue(ctx, domain.AccessTokenClaims{
		Subject:  user.ID,
		Email:    user.Email,
		Username: user.Username,
	})
	if err != nil {
		return domain.TokenPair{}, err
	}

	return domain.TokenPair{
		AccessToken:  access,
		RefreshToken: refreshToken,
		TokenType:    "Bearer",
		ExpiresAt:    expiresAt,
		User:         user.Public(),
	}, nil
}
