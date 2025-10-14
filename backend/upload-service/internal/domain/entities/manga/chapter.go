package entity

import (
	common "github.com/animetest/backend/upload-service/internal/domain/entities/common"
)

type Chapter struct {
	ID          string
	MangaID     string   `binding:"required"`
	VolumeID    string   `binding:"required"`
	ChapterName string   `binding:"required"`
	ChapterNum  int      `binding:"required"`
	Images      []string `binding:"required"`
	Language    string   `binding:"required"`
	UserID      string   `binding:"required"`
	ScanID      string   `binding:"required"`
	Date        common.DatePersistence
}