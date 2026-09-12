package postgres

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"

	"mnglib/activity/internal/app"
	"mnglib/activity/internal/domain"
)

type Repo struct {
	pool *pgxpool.Pool
}

func NewRepo(pool *pgxpool.Pool) *Repo {
	return &Repo{pool: pool}
}

func (r *Repo) ListAnime(ctx context.Context, userID string) ([]app.ListEntryDTO, error) {
	return r.listByKind(ctx, userID, "anime")
}

func (r *Repo) ListManga(ctx context.Context, userID string) ([]app.ListEntryDTO, error) {
	return r.listByKind(ctx, userID, "manga")
}

func (r *Repo) listByKind(ctx context.Context, userID, kind string) ([]app.ListEntryDTO, error) {
	const query = `
		SELECT ul.catalog_id, ul.status
		FROM user_lists ul
		WHERE ul.user_id = $1 AND ul.kind = $2
		ORDER BY ul.updated_at DESC`

	rows, err := r.pool.Query(ctx, query, userID, kind)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var entries []app.ListEntryDTO
	for rows.Next() {
		var dto app.ListEntryDTO
		if err := rows.Scan(&dto.CatalogID, &dto.Status); err != nil {
			return nil, err
		}
		entries = append(entries, dto)
	}

	return entries, rows.Err()
}

func (r *Repo) UpsertListStatus(ctx context.Context, userID string, catalogID int64, kind string, status domain.ListStatus) error {
	const query = `
		INSERT INTO user_lists (user_id, catalog_id, kind, status)
		VALUES ($1, $2, $3, $4)
		ON CONFLICT (user_id, catalog_id)
		DO UPDATE SET status = EXCLUDED.status, updated_at = now()`

	_, err := r.pool.Exec(ctx, query, userID, catalogID, kind, status)
	return err
}

func (r *Repo) UpsertProgress(ctx context.Context, userID string, p domain.Progress) error {
	const query = `
		INSERT INTO progress (user_id, catalog_id, episode, progress, provider, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6)
		ON CONFLICT (user_id, catalog_id)
		DO UPDATE SET episode = EXCLUDED.episode,
		              progress = EXCLUDED.progress,
		              provider = EXCLUDED.provider,
		              updated_at = EXCLUDED.updated_at`

	_, err := r.pool.Exec(ctx, query,
		userID, p.CatalogID, p.Episode, p.Progress, p.Provider, p.UpdatedAt)
	return err
}

func (r *Repo) RecentActivity(ctx context.Context, userID string, limit int) ([]domain.ActivityItem, error) {
	return r.activity(ctx, userID, limit)
}

func (r *Repo) WatchHistory(ctx context.Context, userID string) ([]domain.ActivityItem, error) {
	return r.activity(ctx, userID, 100)
}

func (r *Repo) ContinueWatching(ctx context.Context, userID string) ([]domain.WatchProgress, error) {
	const query = `
		SELECT catalog_id, episode, progress, provider, updated_at
		FROM progress
		WHERE user_id = $1 AND progress > 0
		ORDER BY updated_at DESC
		LIMIT 20`

	rows, err := r.pool.Query(ctx, query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	items := []domain.WatchProgress{}
	for rows.Next() {
		var p domain.WatchProgress
		if err := rows.Scan(&p.CatalogID, &p.Episode, &p.Progress, &p.Provider, &p.UpdatedAt); err != nil {
			return nil, err
		}
		items = append(items, p)
	}
	return items, rows.Err()
}

func (r *Repo) activity(ctx context.Context, userID string, limit int) ([]domain.ActivityItem, error) {
	const query = `
		SELECT id, title, ep, rating, color,
		       to_char(created_at, 'YYYY-MM-DD HH24:MI') AS date
		FROM activity_items
		WHERE user_id = $1
		ORDER BY created_at DESC
		LIMIT $2`

	rows, err := r.pool.Query(ctx, query, userID, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	items := []domain.ActivityItem{}
	for rows.Next() {
		var item domain.ActivityItem
		if err := rows.Scan(&item.ID, &item.Title, &item.Ep, &item.Rating, &item.Color, &item.Date); err != nil {
			return nil, err
		}
		items = append(items, item)
	}

	return items, rows.Err()
}

func (r *Repo) Stats(ctx context.Context, userID string) ([]domain.ProfileStat, error) {
	const query = `
		SELECT label, value, icon FROM profile_stats WHERE user_id = $1`

	rows, err := r.pool.Query(ctx, query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	stats := []domain.ProfileStat{}
	for rows.Next() {
		var stat domain.ProfileStat
		if err := rows.Scan(&stat.Label, &stat.Value, &stat.Icon); err != nil {
			return nil, err
		}
		stats = append(stats, stat)
	}

	return stats, rows.Err()
}

func (r *Repo) GenreAffinities(ctx context.Context, userID string) ([]domain.GenreAffinity, error) {
	const query = `
		SELECT genre, pct, color FROM genre_affinities WHERE user_id = $1 ORDER BY pct DESC`

	rows, err := r.pool.Query(ctx, query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	affinities := []domain.GenreAffinity{}
	for rows.Next() {
		var g domain.GenreAffinity
		if err := rows.Scan(&g.Genre, &g.Pct, &g.Color); err != nil {
			return nil, err
		}
		affinities = append(affinities, g)
	}

	return affinities, rows.Err()
}

func (r *Repo) Achievements(ctx context.Context, userID string) ([]domain.Achievement, error) {
	const query = `
		SELECT label, description, icon, color FROM achievements WHERE user_id = $1`

	rows, err := r.pool.Query(ctx, query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	achievements := []domain.Achievement{}
	for rows.Next() {
		var a domain.Achievement
		if err := rows.Scan(&a.Label, &a.Desc, &a.Icon, &a.Color); err != nil {
			return nil, err
		}
		achievements = append(achievements, a)
	}

	return achievements, rows.Err()
}

func (r *Repo) Settings(ctx context.Context, userID string) (*domain.UserSettings, error) {
	const query = `
		SELECT display_name, email, language, country FROM user_settings WHERE user_id = $1`

	settings := &domain.UserSettings{}
	err := r.pool.QueryRow(ctx, query, userID).
		Scan(&settings.DisplayName, &settings.Email, &settings.Language, &settings.Country)
	if err != nil {
		return nil, err
	}

	return settings, nil
}

func (r *Repo) UpsertSettings(ctx context.Context, userID string, s domain.UserSettings) error {
	const query = `
		INSERT INTO user_settings (user_id, display_name, email, language, country)
		VALUES ($1, $2, $3, $4, $5)
		ON CONFLICT (user_id)
		DO UPDATE SET display_name = EXCLUDED.display_name,
		              email = EXCLUDED.email,
		              language = EXCLUDED.language,
		              country = EXCLUDED.country`

	_, err := r.pool.Exec(ctx, query, userID, s.DisplayName, s.Email, s.Language, s.Country)
	return err
}
