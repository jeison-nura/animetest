package mongodb

import (
	"context"
	"time"

	entity "github.com/animetest/backend/upload-service/internal/domain/entities/manga"
	connectionsMongo "github.com/animetest/backend/upload-service/internal/infrastructure/persistence/database/connections"
	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson"
)

type VolumeRepository struct {
	conn *connectionsMongo.ConnectionMongo
}

func NewVolumeRepository(conn *connectionsMongo.ConnectionMongo) *VolumeRepository {
	return &VolumeRepository{
		conn: conn,
	}
}

func (r *VolumeRepository) AddVolume(ctx context.Context, mangaID string, volume *entity.Volume) (*entity.Volume, error) {
	if volume.ID == "" {
		volume.ID = uuid.New().String()
	}
	volume.MangaID = mangaID
	now := time.Now()
	volume.Date.CreatedAt = now
	volume.Date.UpdatedAt = now
	_, err := r.conn.Db.Collection("volumes").InsertOne(ctx, volume)
	if err != nil {
		return nil, err
	}
	return volume, nil
}

func (r *VolumeRepository) GetVolumeByID(ctx context.Context, volumeID string) (*entity.Volume, error) {
	var volume entity.Volume
	filter := bson.M{"id": volumeID}
	err := r.conn.Db.Collection("volumes").FindOne(ctx, filter).Decode(&volume)
	if err != nil {
		return nil, err
	}
	return &volume, nil
}

func (r *VolumeRepository) UpdateVolume(ctx context.Context, volume *entity.Volume) (*entity.Volume, error) {
	volume.Date.UpdatedAt = time.Now()
	filter := bson.M{"id": volume.ID}
	update := bson.M{"$set": volume}
	_, err := r.conn.Db.Collection("volumes").UpdateOne(ctx, filter, update)
	if err != nil {
		return nil, err
	}
	return volume, nil
}

func (r *VolumeRepository) DeleteVolume(ctx context.Context, volumeID string) error {
	filter := bson.M{"id": volumeID}
	_, err := r.conn.Db.Collection("volumes").DeleteOne(ctx, filter)
	if err != nil {
		return err
	}
	return nil
}

func (r *VolumeRepository) ListVolumesByMangaID(ctx context.Context, mangaID string) ([]*entity.Volume, error) {
	var volumes []*entity.Volume
	filter := bson.M{"mangaid": mangaID}
	cursor, err := r.conn.Db.Collection("volumes").Find(ctx, filter)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)
	for cursor.Next(ctx) {
		var volume entity.Volume
		if err := cursor.Decode(&volume); err != nil {
			return nil, err
		}
		volumes = append(volumes, &volume)
	}
	if err := cursor.Err(); err != nil {
		return nil, err
	}
	return volumes, nil
}