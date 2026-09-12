package config

import (
	"errors"
	"log"
	"os"
	"strconv"
	"time"
)

type Config struct {
	Port               string
	AuthServiceURL     string
	CatalogServiceURL  string
	ActivityServiceURL string
	ContentServiceURL  string
	AllowedOrigin      string
	RateLimitRPM       int
	BodyLimitMB        int
	JWKSRefreshEvery   time.Duration
}

func Load() Config {
	return Config{
		Port:               envOr("PORT", "8080"),
		AuthServiceURL:     envOr("AUTH_SERVICE_URL", "http://localhost:8081"),
		CatalogServiceURL:  envOr("CATALOG_SERVICE_URL", "http://localhost:8082"),
		ActivityServiceURL: envOr("ACTIVITY_SERVICE_URL", "http://localhost:8083"),
		ContentServiceURL:  envOr("CONTENT_SERVICE_URL", "http://localhost:8084"),
		AllowedOrigin:      envOr("ALLOWED_ORIGIN", "http://localhost:3000"),
		RateLimitRPM:       envInt("RATE_LIMIT_RPM", 120),
		BodyLimitMB:        envInt("BODY_LIMIT_MB", 10),
		JWKSRefreshEvery:   envDuration("JWKS_REFRESH_INTERVAL", 10*time.Minute),
	}
}

func (c Config) Validate() error {
	if c.Port == "" {
		return errors.New("PORT is required")
	}
	if c.AuthServiceURL == "" {
		return errors.New("AUTH_SERVICE_URL is required")
	}
	if c.RateLimitRPM <= 0 {
		return errors.New("RATE_LIMIT_RPM must be positive")
	}
	if c.BodyLimitMB <= 0 {
		return errors.New("BODY_LIMIT_MB must be positive")
	}
	return nil
}

func envOr(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}

func envDuration(key string, fallback time.Duration) time.Duration {
	value := os.Getenv(key)
	if value == "" {
		return fallback
	}
	duration, err := time.ParseDuration(value)
	if err != nil {
		log.Printf("invalid %s=%q, using default %s", key, value, fallback)
		return fallback
	}
	return duration
}

func envInt(key string, fallback int) int {
	value := os.Getenv(key)
	if value == "" {
		return fallback
	}
	parsed, err := strconv.Atoi(value)
	if err != nil {
		log.Printf("invalid %s=%q, using default %d", key, value, fallback)
		return fallback
	}
	return parsed
}
