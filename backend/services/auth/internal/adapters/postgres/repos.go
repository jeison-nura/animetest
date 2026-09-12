package postgres

import (
	"context"
	"errors"
	"strings"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgxpool"

	"mnglib/auth/internal/app"
	"mnglib/auth/internal/domain"
)

type UserRepo struct {
	pool *pgxpool.Pool
}

func NewUserRepo(pool *pgxpool.Pool) *UserRepo {
	return &UserRepo{pool: pool}
}

func (r *UserRepo) Create(ctx context.Context, user *domain.User) error {
	const query = `
		INSERT INTO users (email, username, password_hash, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $4)
		RETURNING id`

	err := r.pool.QueryRow(
		ctx, query,
		user.Email, user.Username, user.PasswordHash, user.CreatedAt,
	).Scan(&user.ID)

	var pgErr *pgconn.PgError
	if errors.As(err, &pgErr) && pgErr.Code == "23505" {
		if strings.Contains(pgErr.ConstraintName, "email") {
			return domain.ErrEmailTaken
		}
		if strings.Contains(pgErr.ConstraintName, "username") {
			return domain.ErrUsernameTaken
		}
	}

	return err
}

func (r *UserRepo) GetByEmail(ctx context.Context, email string) (*domain.User, error) {
	return r.scanOne(r.pool.QueryRow(ctx, `
		SELECT id, email, username, password_hash, created_at
		FROM users WHERE email = $1`, email))
}

func (r *UserRepo) GetByID(ctx context.Context, id string) (*domain.User, error) {
	return r.scanOne(r.pool.QueryRow(ctx, `
		SELECT id, email, username, password_hash, created_at
		FROM users WHERE id = $1`, id))
}

func (r *UserRepo) scanOne(row pgx.Row) (*domain.User, error) {
	user := &domain.User{}
	err := row.Scan(&user.ID, &user.Email, &user.Username, &user.PasswordHash, &user.CreatedAt)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, domain.ErrInvalidCredentials
	}
	if err != nil {
		return nil, err
	}
	return user, nil
}

type RefreshRepo struct {
	pool *pgxpool.Pool
}

func NewRefreshRepo(pool *pgxpool.Pool) *RefreshRepo {
	return &RefreshRepo{pool: pool}
}

func (r *RefreshRepo) Create(ctx context.Context, userID, tokenHash string, expiresAt time.Time) error {
	const query = `
		INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
		VALUES ($1, $2, $3)`

	_, err := r.pool.Exec(ctx, query, userID, tokenHash, expiresAt)
	return err
}

func (r *RefreshRepo) FindActive(ctx context.Context, tokenHash string) (*app.RefreshToken, error) {
	const query = `
		SELECT id, user_id, expires_at, revoked_at
		FROM refresh_tokens
		WHERE token_hash = $1 AND expires_at > $2
		FOR UPDATE`

	token := &app.RefreshToken{}
	var revokedAt *time.Time

	err := r.pool.QueryRow(ctx, query, tokenHash, time.Now()).
		Scan(&token.ID, &token.UserID, &token.ExpiresAt, &revokedAt)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, domain.ErrInvalidRefresh
	}
	if err != nil {
		return nil, err
	}

	if revokedAt != nil {
		return nil, domain.ErrRefreshReuse
	}

	return token, nil
}

func (r *RefreshRepo) Revoke(ctx context.Context, tokenID string) error {
	const query = `
		UPDATE refresh_tokens SET revoked_at = $1 WHERE id = $2`

	_, err := r.pool.Exec(ctx, query, time.Now(), tokenID)
	return err
}

func (r *RefreshRepo) RevokeAllForUser(ctx context.Context, userID string) error {
	const query = `
		UPDATE refresh_tokens SET revoked_at = $1 WHERE user_id = $2 AND revoked_at IS NULL`

	_, err := r.pool.Exec(ctx, query, time.Now(), userID)
	return err
}
