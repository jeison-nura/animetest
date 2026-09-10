package routes

import (
	"github.com/animetest/backend/upload-service/internal/application/controllers"
	"github.com/animetest/backend/upload-service/internal/application/useCases"
	"github.com/gin-gonic/gin"
)

// SetupRoutes configures all application routes
func SetupRoutes(
	router *gin.Engine,
	getMangaByIDUseCase useCases.GetMangaByIDUseCase,
) {
	// Create controllers
	mangaController := controllers.NewMangaController(getMangaByIDUseCase)

	// API routes
	api := router.Group("/api/v1")
	{
		// Manga routes
		manga := api.Group("/manga")
		{
			manga.GET("/:id", mangaController.GetMangaByID)
		}
	}

	// Health check route
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":  "ok",
			"message": "Upload service is running",
		})
	})
}
