package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/animetest/backend/upload-service/internal/config"
	"github.com/gin-gonic/gin"
)

func main() {
	cfg := config.LoadConfigFromEnv()
	router := gin.Default()
	handler, err := InitializeApp(cfg, router)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("Server started on port %s\n", cfg.ServerPort)
	log.Fatal(http.ListenAndServe(":"+cfg.ServerPort, handler))
}