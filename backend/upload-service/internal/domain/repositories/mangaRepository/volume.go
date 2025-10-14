package repositories

import (
	"context"

	entity "github.com/animetest/backend/upload-service/internal/domain/entities/manga"
)

type IVolumeRepository interface {
	AddVolume(ctx context.Context, mangaID string, volume *entity.Volume) (*entity.Volume, error)
	GetVolumeByID(ctx context.Context, volumeID string) (*entity.Volume, error)
	UpdateVolume(ctx context.Context, volume *entity.Volume) (*entity.Volume, error)
	DeleteVolume(ctx context.Context, volumeID string) error
	ListVolumesByMangaID(ctx context.Context, mangaID string) ([]*entity.Volume, error)
}