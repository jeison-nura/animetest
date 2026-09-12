package config

import (
	"errors"
	"log"
	"os"
	"time"
)

type Config struct {
	Port          string
	DatabaseURL   string
	AccessTokenTTL  time.Duration
	RefreshTokenTTL time.Duration
}

func Load() Config {
	return Config{
		Port:            envOr("PORT", "8081"),
		DatabaseURL:     envOr("DATABASE_URL", "postgres://mnglib:mnglib_dev@localhost:5432/auth?sslmode=disable"),
		AccessTokenTTL:  envDuration("ACCESS_TOKEN_TTL", 15*time.Minute),
		RefreshTokenTTL: envDuration("REFRESH_TOKEN_TTL", 720*time.Hour),
	}
}

func (c Config) Validate() error {
	if c.Port == "" {
		return errors.New("PORT is required")
	}
	if c.DatabaseURL == "" {
		return errors.New("DATABASE_URL is required")
	}
	if c.AccessTokenTTL <= 0 {
		return errors.New("ACCESS_TOKEN_TTL must be positive")
	}
	if c.RefreshTokenTTL <= 0 {
		return errors.New("REFRESH_TOKEN_TTL must be positive")
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
