package controllers

import (
	"net/http"

	"github.com/animetest/backend/upload-service/internal/application/useCases"
	"github.com/gin-gonic/gin"
)

// MangaController handles manga-related HTTP requests
type MangaController struct {
	getMangaByIDUseCase useCases.GetMangaByIDUseCase
}

// NewMangaController creates a new manga controller
func NewMangaController(getMangaByIDUseCase useCases.GetMangaByIDUseCase) *MangaController {
	return &MangaController{
		getMangaByIDUseCase: getMangaByIDUseCase,
	}
}

// GetMangaByID handles GET /manga/:id requests
func (c *MangaController) GetMangaByID(ctx *gin.Context) {
	mangaID := ctx.Param("id")

	if mangaID == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Manga ID is required",
		})
		return
	}

	manga, err := c.getMangaByIDUseCase.Execute(ctx.Request.Context(), mangaID)
	if err != nil {
		switch err {
		case useCases.ErrInvalidMangaID:
			ctx.JSON(http.StatusBadRequest, gin.H{
				"error": "Invalid manga ID",
			})
		case useCases.ErrMangaNotFound:
			ctx.JSON(http.StatusNotFound, gin.H{
				"error": "Manga not found",
			})
		default:
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"error": "Internal server error",
			})
		}
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"data": manga,
	})
}
