package mockData

import (
	"context"
	"fmt"

	entity "github.com/animetest/backend/upload-service/internal/domain/entities/manga"
	repositories "github.com/animetest/backend/upload-service/internal/domain/repositories/mangaRepository"
)

// MockMangaRepository implements IMangaRepository using mock data
type MockMangaRepository struct {
	data *MockData
}

// NewMockMangaRepository creates a new mock manga repository
func NewMockMangaRepository() repositories.IMangaRepository {
	return &MockMangaRepository{
		data: GetMockData(),
	}
}

func (m *MockMangaRepository) Create(ctx context.Context, manga *entity.Manga) (*entity.Manga, error) {
	// Generate a new ID (in real implementation, this would be done by the database)
	manga.ID = fmt.Sprintf("manga-%d", len(m.data.Mangas)+1)
	m.data.Mangas = append(m.data.Mangas, manga)
	return manga, nil
}

func (m *MockMangaRepository) GetMangaByID(ctx context.Context, mangaID string) (*entity.Manga, error) {
	for _, manga := range m.data.Mangas {
		if manga.ID == mangaID {
			return manga, nil
		}
	}
	return nil, fmt.Errorf("manga with ID %s not found", mangaID)
}

func (m *MockMangaRepository) UpdateManga(ctx context.Context, manga *entity.Manga) (*entity.Manga, error) {
	for i, existingManga := range m.data.Mangas {
		if existingManga.ID == manga.ID {
			m.data.Mangas[i] = manga
			return manga, nil
		}
	}
	return nil, fmt.Errorf("manga with ID %s not found", manga.ID)
}

func (m *MockMangaRepository) DeleteManga(ctx context.Context, mangaID string) error {
	for i, manga := range m.data.Mangas {
		if manga.ID == mangaID {
			m.data.Mangas = append(m.data.Mangas[:i], m.data.Mangas[i+1:]...)
			return nil
		}
	}
	return fmt.Errorf("manga with ID %s not found", mangaID)
}

func (m *MockMangaRepository) ListMangaByAuthor(ctx context.Context, author string) ([]*entity.Manga, error) {
	var result []*entity.Manga
	for _, manga := range m.data.Mangas {
		if manga.Author == author {
			result = append(result, manga)
		}
	}
	return result, nil
}

func (m *MockMangaRepository) ListMangaByStatus(ctx context.Context, status string) ([]*entity.Manga, error) {
	var result []*entity.Manga
	for _, manga := range m.data.Mangas {
		if manga.Status == status {
			result = append(result, manga)
		}
	}
	return result, nil
}

func (m *MockMangaRepository) ListMangaByName(ctx context.Context, name string) (*entity.Manga, error) {
	for _, manga := range m.data.Mangas {
		for _, mangaName := range manga.Names {
			if mangaName == name {
				return manga, nil
			}
		}
	}
	return nil, fmt.Errorf("manga with name %s not found", name)
}

func (m *MockMangaRepository) ListMangaByLanguageName(ctx context.Context, language string) (*entity.Manga, error) {
	for _, manga := range m.data.Mangas {
		if _, exists := manga.Names[language]; exists {
			return manga, nil
		}
	}
	return nil, fmt.Errorf("manga with language %s not found", language)
}
