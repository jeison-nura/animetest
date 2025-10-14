package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/animetest/backend/upload-service/internal/infrastructure/config"
	"github.com/gin-gonic/gin"
)

func main() {
	cfg := config.LoadConfigFromEnv()
	router := gin.Default()
	handler, err := InitializeApp(*cfg, router)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("Server started on port %s\n", cfg.GetServerPort())
	log.Fatal(http.ListenAndServe(":"+cfg.GetServerPort(), handler))
}
