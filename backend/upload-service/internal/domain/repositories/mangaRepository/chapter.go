package repositories

import (
	"context"

	entity "github.com/animetest/backend/upload-service/internal/domain/entities/manga"
)

type IChapterRepository interface {
	AddChapter(ctx context.Context, mangaID string, chapter *entity.Chapter) (*entity.Chapter, error)
	GetChapterByID(ctx context.Context, chapterID string) (*entity.Chapter, error)
	UpdateChapter(ctx context.Context, chapter *entity.Chapter) (*entity.Chapter, error)
	DeleteChapter(ctx context.Context, chapterID string) error
	ListChaptersByMangaID(ctx context.Context, mangaID string) ([]*entity.Chapter, error)
}