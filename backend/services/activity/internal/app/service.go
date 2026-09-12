package app

import (
	"context"

	"mnglib/activity/internal/domain"
)

// Port interface: handlers depend on this, not on the concrete postgres.Repo.
type Repo interface {
	ListAnime(ctx context.Context, userID string) ([]ListEntryDTO, error)
	ListManga(ctx context.Context, userID string) ([]ListEntryDTO, error)
	UpsertListStatus(ctx context.Context, userID string, catalogID int64, kind string, status domain.ListStatus) error
	UpsertProgress(ctx context.Context, userID string, p domain.Progress) error
	RecentActivity(ctx context.Context, userID string, limit int) ([]domain.ActivityItem, error)
	WatchHistory(ctx context.Context, userID string) ([]domain.ActivityItem, error)
	ContinueWatching(ctx context.Context, userID string) ([]domain.WatchProgress, error)
	Stats(ctx context.Context, userID string) ([]domain.ProfileStat, error)
	GenreAffinities(ctx context.Context, userID string) ([]domain.GenreAffinity, error)
	Achievements(ctx context.Context, userID string) ([]domain.Achievement, error)
	Settings(ctx context.Context, userID string) (*domain.UserSettings, error)
	UpsertSettings(ctx context.Context, userID string, s domain.UserSettings) error
}

type ListEntryDTO struct {
	CatalogID int64
	Status    string
}
