//go:build wireinject
// +build wireinject

package main

import (
	"github.com/animetest/backend/upload-service/internal/config"
	"github.com/gin-gonic/gin"
	"github.com/google/wire"
)

func InitializeApp(cfg config.Config, router *gin.Engine) (*gin.Engine, error) {
	wire.Build(
	)
	return nil, nil
}