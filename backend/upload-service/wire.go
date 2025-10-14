//go:build wireinject
// +build wireinject

package main

import (
	"github.com/animetest/backend/upload-service/internal/application/routes"
	"github.com/animetest/backend/upload-service/internal/application/useCases"
	"github.com/animetest/backend/upload-service/internal/infrastructure/config"
	"github.com/animetest/backend/upload-service/internal/infrastructure/mockData"
	"github.com/gin-gonic/gin"
	"github.com/google/wire"
)

func InitializeApp(cfg config.Config, router *gin.Engine) (*gin.Engine, error) {
	wire.Build(
		// Repositories
		mockData.NewMockMangaRepository,
		mockData.NewMockChapterRepository,
		mockData.NewMockVolumeRepository,

		// Use Cases
		useCases.NewGetMangaByIDUseCase,

		// Routes
		routes.SetupRoutes,
	)
	return router, nil
}
