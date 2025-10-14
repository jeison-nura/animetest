package mongodb

import (
	"context"
	"time"

	entity "github.com/animetest/backend/upload-service/internal/domain/entities/manga"
	connectionsMongo "github.com/animetest/backend/upload-service/internal/infrastructure/persistence/database/connections"
	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson"
)

type ChapterRepository struct {
	conn *connectionsMongo.ConnectionMongo
}

func NewChapterRepository(conn *connectionsMongo.ConnectionMongo) *ChapterRepository {
	return &ChapterRepository{
		conn: conn,
	}
}

func (r *ChapterRepository) AddChapter(ctx context.Context, mangaID string, chapter *entity.Chapter) (*entity.Chapter, error) {
	if chapter.ID == "" {
		chapter.ID = uuid.New().String()
	}
	chapter.MangaID = mangaID
	now := time.Now()
	chapter.Date.CreatedAt = now
	chapter.Date.UpdatedAt = now
	_, err := r.conn.Db.Collection("chapters").InsertOne(ctx, chapter)
	if err != nil {
		return nil, err
	}
	return chapter, nil
}

func (r *ChapterRepository) GetChapterByID(ctx context.Context, chapterID string) (*entity.Chapter, error) {
	var chapter entity.Chapter
	filter := bson.M{"id": chapterID}
	err := r.conn.Db.Collection("chapters").FindOne(ctx, filter).Decode(&chapter)
	if err != nil {
		return nil, err
	}
	return &chapter, nil
}

func (r *ChapterRepository) UpdateChapter(ctx context.Context, chapter *entity.Chapter) (*entity.Chapter, error) {
	chapter.Date.UpdatedAt = time.Now()
	filter := bson.M{"id": chapter.ID}
	update := bson.M{"$set": chapter}
	_, err := r.conn.Db.Collection("chapters").UpdateOne(ctx, filter, update)
	if err != nil {
		return nil, err
	}
	return chapter, nil
}

func (r *ChapterRepository) DeleteChapter(ctx context.Context, chapterID string) error {
	filter := bson.M{"id": chapterID}
	_, err := r.conn.Db.Collection("chapters").DeleteOne(ctx, filter)
	if err != nil {
		return err
	}
	return nil
}

func (r *ChapterRepository) ListChaptersByMangaID(ctx context.Context, mangaID string) ([]*entity.Chapter, error) {
	var chapters []*entity.Chapter
	filter := bson.M{"mangaid": mangaID}
	cursor, err := r.conn.Db.Collection("chapters").Find(ctx, filter)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)
	for cursor.Next(ctx) {
		var chapter entity.Chapter
		if err := cursor.Decode(&chapter); err != nil {
			return nil, err
		}
		chapters = append(chapters, &chapter)
	}
	if err := cursor.Err(); err != nil {
		return nil, err
	}
	return chapters, nil
}

func (r *ChapterRepository) GetChaptersByVolumeId(ctx context.Context, volumeId string) ([]*entity.Chapter, error) {
	var chapters []*entity.Chapter
	filter := bson.M{"volumeid": volumeId}
	cursor, err := r.conn.Db.Collection("chapters").Find(ctx, filter)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)
	for cursor.Next(ctx) {
		var chapter entity.Chapter
		if err := cursor.Decode(&chapter); err != nil {
			return nil, err
		}
		chapters = append(chapters, &chapter)
	}
	if err := cursor.Err(); err != nil {
		return nil, err
	}
	return chapters, nil
}
