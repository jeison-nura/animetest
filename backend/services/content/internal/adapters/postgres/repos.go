package postgres

import (
	"context"
	"errors"
	"fmt"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgxpool"

	"mnglib/content/internal/app"
	"mnglib/content/internal/domain"
)

type SourceRepo struct {
	pool *pgxpool.Pool
}

func NewSourceRepo(pool *pgxpool.Pool) *SourceRepo {
	return &SourceRepo{pool: pool}
}

func (r *SourceRepo) Insert(ctx context.Context, s *domain.Source) error {
	const query = `
		INSERT INTO sources (provider_id, entry_id, kind, number, title, language, quality, format, external_url, status)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
		RETURNING id, created_at`

	err := r.pool.QueryRow(ctx, query,
		s.ProviderID, s.EntryID, s.Kind, s.Number, s.Title,
		s.Language, s.Quality, s.Format, s.ExternalURL, s.Status,
	).Scan(&s.ID, &s.CreatedAt)

	var pgErr *pgconn.PgError
	if errors.As(err, &pgErr) && pgErr.Code == "23505" {
		return domain.ErrDuplicateSource
	}
	return err
}

func (r *SourceRepo) GetByID(ctx context.Context, id int64) (*domain.Source, error) {
	const query = `
		SELECT id, provider_id, entry_id, kind, number, title, language, quality, format, external_url, status, created_at
		FROM sources WHERE id = $1`

	source := &domain.Source{}
	err := r.pool.QueryRow(ctx, query, id).Scan(
		&source.ID, &source.ProviderID, &source.EntryID, &source.Kind,
		&source.Number, &source.Title, &source.Language, &source.Quality,
		&source.Format, &source.ExternalURL, &source.Status, &source.CreatedAt,
	)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, domain.ErrNotFound
	}
	if err != nil {
		return nil, err
	}
	return source, nil
}

func (r *SourceRepo) ListByEntry(ctx context.Context, entryID int64, kind domain.SourceKind, number float64) ([]*domain.Source, error) {
	const query = `
		SELECT id, provider_id, entry_id, kind, number, title, language, quality, format, external_url, status, created_at
		FROM sources
		WHERE entry_id = $1 AND kind = $2 AND number = $3 AND status IN ('ready', 'processing')
		ORDER BY CASE WHEN provider_id = 'mnglib' THEN 0 ELSE 1 END, provider_id`

	rows, err := r.pool.Query(ctx, query, entryID, kind, number)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	sources := []*domain.Source{}
	for rows.Next() {
		s := &domain.Source{}
		if err := rows.Scan(&s.ID, &s.ProviderID, &s.EntryID, &s.Kind, &s.Number,
			&s.Title, &s.Language, &s.Quality, &s.Format, &s.ExternalURL, &s.Status, &s.CreatedAt); err != nil {
			return nil, err
		}
		sources = append(sources, s)
	}
	return sources, rows.Err()
}

func (r *SourceRepo) SetStatus(ctx context.Context, id int64, status domain.SourceStatus) error {
	const query = `UPDATE sources SET status = $2, updated_at = now() WHERE id = $1`
	_, err := r.pool.Exec(ctx, query, id, status)
	return err
}

func (r *SourceRepo) SetReadyWithPlaylist(ctx context.Context, id int64, playlistKey string) error {
	const query = `
		UPDATE sources SET status = 'ready', playlist_key = $2, updated_at = now() WHERE id = $1`
	_, err := r.pool.Exec(ctx, query, id, playlistKey)
	return err
}

func (r *SourceRepo) ListReadyPages(ctx context.Context, sourceID int64) ([]app.PageInfo, error) {
	const query = `
		SELECT page_number, image_key, COALESCE(width, 0), COALESCE(height, 0)
		FROM chapter_pages WHERE source_id = $1 ORDER BY page_number`

	rows, err := r.pool.Query(ctx, query, sourceID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	pages := []app.PageInfo{}
	for rows.Next() {
		var p app.PageInfo
		if err := rows.Scan(&p.PageNumber, &p.ImageKey, &p.Width, &p.Height); err != nil {
			return nil, err
		}
		pages = append(pages, p)
	}
	return pages, rows.Err()
}

func (r *SourceRepo) InsertPages(ctx context.Context, sourceID int64, pages []app.PageInfo) error {
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	const query = `
		INSERT INTO chapter_pages (source_id, page_number, image_key, width, height)
		VALUES ($1, $2, $3, $4, $5)
		ON CONFLICT (source_id, page_number) DO UPDATE
		SET image_key = EXCLUDED.image_key, width = EXCLUDED.width, height = EXCLUDED.height`

	for _, page := range pages {
		if _, err := tx.Exec(ctx, query, sourceID, page.PageNumber, page.ImageKey, page.Width, page.Height); err != nil {
			return err
		}
	}

	return tx.Commit(ctx)
}

type ProviderRepo struct {
	pool *pgxpool.Pool
}

func NewProviderRepo(pool *pgxpool.Pool) *ProviderRepo {
	return &ProviderRepo{pool: pool}
}

func (r *ProviderRepo) GetBySlug(ctx context.Context, slug string) (*domain.Provider, error) {
	const query = `
		SELECT id, slug, name, kind, owner_user_id, status, created_at
		FROM providers WHERE slug = $1`

	provider := &domain.Provider{}
	err := r.pool.QueryRow(ctx, query, slug).Scan(
		&provider.ID, &provider.Slug, &provider.Name, &provider.Kind,
		&provider.OwnerID, &provider.Status, &provider.CreatedAt,
	)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, domain.ErrProviderNotFound
	}
	if err != nil {
		return nil, err
	}
	return provider, nil
}

func (r *ProviderRepo) Create(ctx context.Context, p *domain.Provider) error {
	const query = `
		INSERT INTO providers (slug, name, kind, owner_user_id, status)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id, created_at`

	err := r.pool.QueryRow(ctx, query,
		p.Slug, p.Name, p.Kind, p.OwnerID, p.Status,
	).Scan(&p.ID, &p.CreatedAt)

	var pgErr *pgconn.PgError
	if errors.As(err, &pgErr) && pgErr.Code == "23505" {
		return fmt.Errorf("provider slug already exists: %w", err)
	}
	return err
}

type JobRepo struct {
	pool *pgxpool.Pool
}

func NewJobRepo(pool *pgxpool.Pool) *JobRepo {
	return &JobRepo{pool: pool}
}

func (r *JobRepo) Insert(ctx context.Context, job *domain.UploadJob) error {
	const query = `
		INSERT INTO upload_jobs (source_id, state, object_key)
		VALUES ($1, $2, $3)
		RETURNING id, created_at, updated_at`

	return r.pool.QueryRow(ctx, query, job.SourceID, job.State, job.ObjectKey).
		Scan(&job.ID, &job.CreatedAt, &job.UpdatedAt)
}

func (r *JobRepo) GetByID(ctx context.Context, id string) (*domain.UploadJob, error) {
	const query = `
		SELECT id, source_id, state, progress, error, object_key, created_at, updated_at
		FROM upload_jobs WHERE id = $1`

	job := &domain.UploadJob{}
	err := r.pool.QueryRow(ctx, query, id).Scan(
		&job.ID, &job.SourceID, &job.State, &job.Progress, &job.Error, &job.ObjectKey, &job.CreatedAt, &job.UpdatedAt,
	)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, domain.ErrJobNotFound
	}
	if err != nil {
		return nil, err
	}
	return job, nil
}

func (r *JobRepo) SetState(ctx context.Context, id, state string, progress int, errMsg string) error {
	const query = `
		UPDATE upload_jobs SET state = $2, progress = $3, error = NULLIF($4, ''), updated_at = now()
		WHERE id = $1`
	_, err := r.pool.Exec(ctx, query, id, state, progress, errMsg)
	return err
}
