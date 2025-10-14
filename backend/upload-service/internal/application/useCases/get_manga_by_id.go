package useCases

import (
	"context"

	entity "github.com/animetest/backend/upload-service/internal/domain/entities/manga"
	repositories "github.com/animetest/backend/upload-service/internal/domain/repositories/mangaRepository"
)

// GetMangaByIDUseCase defines the interface for getting a manga by ID
type GetMangaByIDUseCase interface {
	Execute(ctx context.Context, mangaID string) (*entity.Manga, error)
}

// getMangaByIDUseCase implements GetMangaByIDUseCase
type getMangaByIDUseCase struct {
	mangaRepository repositories.IMangaRepository
}

// NewGetMangaByIDUseCase creates a new instance of GetMangaByIDUseCase
func NewGetMangaByIDUseCase(mangaRepository repositories.IMangaRepository) GetMangaByIDUseCase {
	return &getMangaByIDUseCase{
		mangaRepository: mangaRepository,
	}
}

// Execute retrieves a manga by its ID
func (u *getMangaByIDUseCase) Execute(ctx context.Context, mangaID string) (*entity.Manga, error) {
	// Validate input
	if mangaID == "" {
		return nil, ErrInvalidMangaID
	}

	// Get manga from repository
	manga, err := u.mangaRepository.GetMangaByID(ctx, mangaID)
	if err != nil {
		return nil, err
	}

	return manga, nil
}
