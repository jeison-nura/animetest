package config

import (
	"errors"
	"fmt"
	"log"
	"os"
	"strings"
	"time"

	"mnglib/content/internal/app"
)

type Config struct {
	Port                string
	DatabaseURL         string
	NatsURL             string
	StorageProvider     string
	StorageEndpoint     string
	StorageRegion       string
	StorageAccessKey    string
	StorageSecretKey    string
	StorageUsePathStyle bool
	MediaBucket         string
	PresignTTL          time.Duration
}

func Load() Config {
	return Config{
		Port:          envOr("PORT", "8084"),
		DatabaseURL:   envOr("DATABASE_URL", "postgres://mnglib:mnglib_dev@localhost:5432/content?sslmode=disable"),
		NatsURL:       envOr("NATS_URL", "nats://localhost:4222"),
		StorageProvider:     envOr("STORAGE_PROVIDER", "s3"),
		StorageEndpoint:     envOr("STORAGE_ENDPOINT", "http://localhost:9000"),
		StorageRegion:       envOr("STORAGE_REGION", "us-east-1"),
		StorageAccessKey:    envOr("STORAGE_ACCESS_KEY", "mnglib"),
		StorageSecretKey:    envOr("STORAGE_SECRET_KEY", "mnglib_dev"),
		StorageUsePathStyle: envOr("STORAGE_PATH_STYLE", "true") == "true",
		MediaBucket:         envOr("MEDIA_BUCKET", "media"),
		PresignTTL:          envDuration("PRESIGN_TTL", time.Hour),
	}
}

func (c Config) Validate() error {
	if c.Port == "" {
		return errors.New("PORT is required")
	}
	if c.DatabaseURL == "" {
		return errors.New("DATABASE_URL is required")
	}
	provider := strings.ToLower(c.StorageProvider)
	if !app.IsSupportedStorageProvider(provider) {
		return fmt.Errorf("unsupported STORAGE_PROVIDER %q (supported: %s)",
			c.StorageProvider, strings.Join(app.SupportedStorageProviders, ", "))
	}

	switch provider {
	case "s3":
		if c.StorageEndpoint == "" && c.StorageAccessKey == "" {
			return errors.New("STORAGE_ACCESS_KEY is required for s3 provider")
		}
	case "minio", "gcs":
		if c.StorageEndpoint == "" {
			return fmt.Errorf("STORAGE_ENDPOINT is required for %s provider", provider)
		}
		if c.StorageAccessKey == "" || c.StorageSecretKey == "" {
			return fmt.Errorf("STORAGE_ACCESS_KEY and STORAGE_SECRET_KEY are required for %s", provider)
		}
	}
	if c.MediaBucket == "" {
		return errors.New("MEDIA_BUCKET is required")
	}
	if c.PresignTTL <= 0 {
		return errors.New("PRESIGN_TTL must be positive")
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
