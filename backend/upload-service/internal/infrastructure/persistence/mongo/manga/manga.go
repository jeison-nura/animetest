package mongodb

import (
	"context"
	"fmt"
	"time"

	entity "github.com/animetest/backend/upload-service/internal/domain/entities/manga"
	connectionsMongo "github.com/animetest/backend/upload-service/internal/infrastructure/persistence/database/connections"
	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson"
)

type MangaRepository struct {
	conn *connectionsMongo.ConnectionMongo
}

func NewMangaRepository(conn *connectionsMongo.ConnectionMongo) *MangaRepository {
	return &MangaRepository{
		conn: conn,
	}
}

func (r *MangaRepository) Create(ctx context.Context, manga *entity.Manga) (*entity.Manga, error) {
	if manga.ID == "" {
		manga.ID = uuid.New().String()
	}
	now := time.Now()
	manga.Date.CreatedAt = now
	manga.Date.UpdatedAt = now
	_, err := r.conn.Db.Collection("mangas").InsertOne(ctx, manga)
	if err != nil {
		return nil, err
	}
	return manga, nil
}

func (r *MangaRepository) GetMangaByID(ctx context.Context, mangaID string) (*entity.Manga, error) {
	var manga entity.Manga
	filter := bson.M{"id": mangaID}
	err := r.conn.Db.Collection("mangas").FindOne(ctx, filter).Decode(&manga)
	if err != nil {
		return nil, err
	}
	return &manga, nil
}

func (r *MangaRepository) UpdateManga(ctx context.Context, manga *entity.Manga) (*entity.Manga, error) {
	manga.Date.UpdatedAt = time.Now()
	filter := bson.M{"id": manga.ID}
	update := bson.M{"$set": manga}
	_, err := r.conn.Db.Collection("mangas").UpdateOne(ctx, filter, update)
	if err != nil {
		return nil, err
	}
	return manga, nil
}

func (r *MangaRepository) DeleteManga(ctx context.Context, mangaID string) error {
	filter := bson.M{"id": mangaID}
	_, err := r.conn.Db.Collection("mangas").DeleteOne(ctx, filter)
	if err != nil {
		return err
	}
	return nil
}

func (r *MangaRepository) findMangas(ctx context.Context, filter bson.M) ([]*entity.Manga, error) {
	var mangas []*entity.Manga
	cursor, err := r.conn.Db.Collection("mangas").Find(ctx, filter)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)
	for cursor.Next(ctx) {
		var manga entity.Manga
		if err := cursor.Decode(&manga); err != nil {
			return nil, err
		}
		mangas = append(mangas, &manga)
	}
	if err := cursor.Err(); err != nil {
		return nil, err
	}
	return mangas, nil
}

func (r *MangaRepository) ListMangaByAuthor(ctx context.Context, author string) ([]*entity.Manga, error) {
	filter := bson.M{"author": author}
	return r.findMangas(ctx, filter)
}

func (r *MangaRepository) ListMangaByStatus(ctx context.Context, status string) ([]*entity.Manga, error) {
	filter := bson.M{"status": status}
	return r.findMangas(ctx, filter)
}

func (r *MangaRepository) ListMangaByName(ctx context.Context, name string) ([]*entity.Manga, error) {
	filter := bson.M{"names": name}
	return r.findMangas(ctx, filter)

}

func (r *MangaRepository) ListMangaByLanguageName(ctx context.Context, language string) ([]*entity.Manga, error) {
	// Buscar mangas que tengan una entrada para el idioma especificado
	filter := bson.M{fmt.Sprintf("names.%s", language): bson.M{"$exists": true}}
	return r.findMangas(ctx, filter)
}
