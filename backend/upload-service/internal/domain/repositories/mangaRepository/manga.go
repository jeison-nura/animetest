package repositories

import (
	"context"

	entity "github.com/animetest/backend/upload-service/internal/domain/entities/manga"
)

type IMangaRepository interface {
	Create(ctx context.Context, manga *entity.Manga) (*entity.Manga, error)
	GetMangaByID(ctx context.Context, mangaID string) (*entity.Manga, error)
	UpdateManga(ctx context.Context, manga *entity.Manga) (*entity.Manga, error)
	DeleteManga(ctx context.Context, mangaID string) error

	ListMangaByAuthor(ctx context.Context, author string) ([]*entity.Manga, error)
	ListMangaByStatus(ctx context.Context, status string) ([]*entity.Manga, error)
	ListMangaByName(ctx context.Context, name string) (*entity.Manga, error)
	ListMangaByLanguageName(ctx context.Context, language string) (*entity.Manga, error)
}
