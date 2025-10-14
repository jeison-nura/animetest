//go:build wireinject
// +build wireinject

package main

import (
	"github.com/animetest/backend/upload-service/internal/infrastructure/config"
	"github.com/animetest/backend/upload-service/internal/infrastructure/mockData"
	"github.com/gin-gonic/gin"
	"github.com/google/wire"
)

func InitializeApp(cfg config.Config, router *gin.Engine) (*gin.Engine, error) {
	wire.Build(
		mockData.NewMockMangaRepository,
		mockData.NewMockChapterRepository,
		mockData.NewMockVolumeRepository,
	)
	return router, nil
}
