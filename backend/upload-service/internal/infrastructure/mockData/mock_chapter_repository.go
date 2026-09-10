package mockData

import (
	"context"
	"fmt"

	entity "github.com/animetest/backend/upload-service/internal/domain/entities/manga"
	repositories "github.com/animetest/backend/upload-service/internal/domain/repositories/mangaRepository"
)

// MockChapterRepository implements IChapterRepository using mock data
type MockChapterRepository struct {
	data *MockData
}

// NewMockChapterRepository creates a new mock chapter repository
func NewMockChapterRepository() repositories.IChapterRepository {
	return &MockChapterRepository{
		data: GetMockData(),
	}
}

func (m *MockChapterRepository) AddChapter(ctx context.Context, mangaID string, chapter *entity.Chapter) (*entity.Chapter, error) {
	// Generate a new ID (in real implementation, this would be done by the database)
	chapter.ID = fmt.Sprintf("chapter-%d", len(m.data.Chapters)+1)
	chapter.MangaID = mangaID
	m.data.Chapters = append(m.data.Chapters, chapter)
	return chapter, nil
}

func (m *MockChapterRepository) GetChapterByID(ctx context.Context, chapterID string) (*entity.Chapter, error) {
	for _, chapter := range m.data.Chapters {
		if chapter.ID == chapterID {
			return chapter, nil
		}
	}
	return nil, fmt.Errorf("chapter with ID %s not found", chapterID)
}

func (m *MockChapterRepository) UpdateChapter(ctx context.Context, chapter *entity.Chapter) (*entity.Chapter, error) {
	for i, existingChapter := range m.data.Chapters {
		if existingChapter.ID == chapter.ID {
			m.data.Chapters[i] = chapter
			return chapter, nil
		}
	}
	return nil, fmt.Errorf("chapter with ID %s not found", chapter.ID)
}

func (m *MockChapterRepository) DeleteChapter(ctx context.Context, chapterID string) error {
	for i, chapter := range m.data.Chapters {
		if chapter.ID == chapterID {
			m.data.Chapters = append(m.data.Chapters[:i], m.data.Chapters[i+1:]...)
			return nil
		}
	}
	return fmt.Errorf("chapter with ID %s not found", chapterID)
}

func (m *MockChapterRepository) ListChaptersByMangaID(ctx context.Context, mangaID string) ([]*entity.Chapter, error) {
	var result []*entity.Chapter
	for _, chapter := range m.data.Chapters {
		if chapter.MangaID == mangaID {
			result = append(result, chapter)
		}
	}
	return result, nil
}
