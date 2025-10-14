package entity

import common "github.com/animetest/backend/upload-service/internal/domain/entities/common"

type Volume struct {
	ID           string
	MangaID      string `binding:"required"`
	VolumeNumber int    `binding:"required"`
	Description  description
	Chapters      []Chapter `binding:"dive"`
	Portrait     string    `binding:"required"`
	Date         common.DatePersistence
}

type description struct {
	Language    string `binding:"required"`
	Description string `binding:"required"`
}