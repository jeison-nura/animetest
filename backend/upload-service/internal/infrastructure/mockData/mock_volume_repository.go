package mockData

import (
	"context"
	"fmt"

	entity "github.com/animetest/backend/upload-service/internal/domain/entities/manga"
	repositories "github.com/animetest/backend/upload-service/internal/domain/repositories/mangaRepository"
)

// MockVolumeRepository implements IVolumeRepository using mock data
type MockVolumeRepository struct {
	data *MockData
}

// NewMockVolumeRepository creates a new mock volume repository
func NewMockVolumeRepository() repositories.IVolumeRepository {
	return &MockVolumeRepository{
		data: GetMockData(),
	}
}

func (m *MockVolumeRepository) AddVolume(ctx context.Context, mangaID string, volume *entity.Volume) (*entity.Volume, error) {
	// Generate a new ID (in real implementation, this would be done by the database)
	volume.ID = fmt.Sprintf("volume-%d", len(m.data.Volumes)+1)
	volume.MangaID = mangaID
	m.data.Volumes = append(m.data.Volumes, volume)
	return volume, nil
}

func (m *MockVolumeRepository) GetVolumeByID(ctx context.Context, volumeID string) (*entity.Volume, error) {
	for _, volume := range m.data.Volumes {
		if volume.ID == volumeID {
			return volume, nil
		}
	}
	return nil, fmt.Errorf("volume with ID %s not found", volumeID)
}

func (m *MockVolumeRepository) UpdateVolume(ctx context.Context, volume *entity.Volume) (*entity.Volume, error) {
	for i, existingVolume := range m.data.Volumes {
		if existingVolume.ID == volume.ID {
			m.data.Volumes[i] = volume
			return volume, nil
		}
	}
	return nil, fmt.Errorf("volume with ID %s not found", volume.ID)
}

func (m *MockVolumeRepository) DeleteVolume(ctx context.Context, volumeID string) error {
	for i, volume := range m.data.Volumes {
		if volume.ID == volumeID {
			m.data.Volumes = append(m.data.Volumes[:i], m.data.Volumes[i+1:]...)
			return nil
		}
	}
	return fmt.Errorf("volume with ID %s not found", volumeID)
}

func (m *MockVolumeRepository) ListVolumesByMangaID(ctx context.Context, mangaID string) ([]*entity.Volume, error) {
	var result []*entity.Volume
	for _, volume := range m.data.Volumes {
		if volume.MangaID == mangaID {
			result = append(result, volume)
		}
	}
	return result, nil
}
