package mockData

import (
	"time"

	common "github.com/animetest/backend/upload-service/internal/domain/entities/common"
	entity "github.com/animetest/backend/upload-service/internal/domain/entities/manga"
)

// MockData contains all sample data
type MockData struct {
	Mangas   []*entity.Manga
	Chapters []*entity.Chapter
	Volumes  []*entity.Volume
}

// GetMockData returns sample data for testing/development
func GetMockData() *MockData {
	now := time.Now()

	// Sample chapters
	chapters := []*entity.Chapter{
		{
			ID:          "chapter-1",
			MangaID:     "manga-1",
			VolumeID:    "volume-1",
			ChapterName: "The Beginning",
			ChapterNum:  1,
			Images:      []string{"page1.jpg", "page2.jpg", "page3.jpg"},
			Language:    entity.English,
			UserID:      "user-1",
			ScanID:      "scan-1",
			Date: common.DatePersistence{
				CreatedAt: now.AddDate(0, 0, -30),
				UpdatedAt: now.AddDate(0, 0, -25),
			},
		},
		{
			ID:          "chapter-2",
			MangaID:     "manga-1",
			VolumeID:    "volume-1",
			ChapterName: "The Journey Begins",
			ChapterNum:  2,
			Images:      []string{"page1.jpg", "page2.jpg", "page3.jpg", "page4.jpg"},
			Language:    entity.English,
			UserID:      "user-1",
			ScanID:      "scan-1",
			Date: common.DatePersistence{
				CreatedAt: now.AddDate(0, 0, -25),
				UpdatedAt: now.AddDate(0, 0, -20),
			},
		},
		{
			ID:          "chapter-3",
			MangaID:     "manga-1",
			VolumeID:    "volume-2",
			ChapterName: "New Adventures",
			ChapterNum:  3,
			Images:      []string{"page1.jpg", "page2.jpg", "page3.jpg"},
			Language:    entity.English,
			UserID:      "user-2",
			ScanID:      "scan-2",
			Date: common.DatePersistence{
				CreatedAt: now.AddDate(0, 0, -20),
				UpdatedAt: now.AddDate(0, 0, -15),
			},
		},
	}

	// Sample volumes - using reflection to set unexported fields
	volumes := []*entity.Volume{
		{
			ID:           "volume-1",
			MangaID:      "manga-1",
			VolumeNumber: 1,
			Chapters:     []entity.Chapter{*chapters[0], *chapters[1]},
			Portrait:     "volume1_cover.jpg",
			Date: common.DatePersistence{
				CreatedAt: now.AddDate(0, 0, -35),
				UpdatedAt: now.AddDate(0, 0, -30),
			},
		},
		{
			ID:           "volume-2",
			MangaID:      "manga-1",
			VolumeNumber: 2,
			Chapters:     []entity.Chapter{*chapters[2]},
			Portrait:     "volume2_cover.jpg",
			Date: common.DatePersistence{
				CreatedAt: now.AddDate(0, 0, -20),
				UpdatedAt: now.AddDate(0, 0, -15),
			},
		},
	}

	// Sample mangas - using reflection to set unexported fields
	mangas := []*entity.Manga{
		{
			ID:     "manga-1",
			Author: "Takeshi Yamamoto",
			Names: map[string]string{
				entity.English:  "Adventure Quest",
				entity.Japanese: "冒険クエスト",
				entity.Spanish:  "Aventura Búsqueda",
			},
			Volumes:  []entity.Volume{*volumes[0], *volumes[1]},
			Chapters: []entity.Chapter{*chapters[0], *chapters[1], *chapters[2]},
			Status:   "ongoing",
			Date: common.DatePersistence{
				CreatedAt: now.AddDate(0, 0, -40),
				UpdatedAt: now.AddDate(0, 0, -10),
			},
		},
		{
			ID:     "manga-2",
			Author: "Sakura Tanaka",
			Names: map[string]string{
				entity.English:  "School Days",
				entity.Japanese: "スクールデイズ",
				entity.Spanish:  "Días de Escuela",
			},
			Volumes:  []entity.Volume{},
			Chapters: []entity.Chapter{},
			Status:   "completed",
			Date: common.DatePersistence{
				CreatedAt: now.AddDate(0, 0, -60),
				UpdatedAt: now.AddDate(0, 0, -5),
			},
		},
		{
			ID:     "manga-3",
			Author: "Kenji Nakamura",
			Names: map[string]string{
				entity.English:  "Mystery Files",
				entity.Japanese: "ミステリーファイル",
				entity.Spanish:  "Archivos Misterio",
			},
			Volumes:  []entity.Volume{},
			Chapters: []entity.Chapter{},
			Status:   "hiatus",
			Date: common.DatePersistence{
				CreatedAt: now.AddDate(0, 0, -20),
				UpdatedAt: now.AddDate(0, 0, -1),
			},
		},
	}

	return &MockData{
		Mangas:   mangas,
		Chapters: chapters,
		Volumes:  volumes,
	}
}
