package storage

import (
	"context"
	"fmt"
	"strings"

	"mnglib/content/internal/app"
)

type StorageConfig struct {
	Provider     string
	Endpoint     string
	Region       string
	AccessKey    string
	SecretKey    string
	UsePathStyle bool
	Bucket       string
}

// NewObjectStore builds the concrete adapter for the configured provider.
// main.go never needs to know which SDK or protocol is used.
func NewObjectStore(ctx context.Context, cfg StorageConfig) (app.ObjectStore, error) {
	provider := strings.ToLower(cfg.Provider)
	if !app.IsSupportedStorageProvider(provider) {
		return nil, fmt.Errorf("unsupported storage provider %q (supported: %s)",
			cfg.Provider, strings.Join(app.SupportedStorageProviders, ", "))
	}

	// All current providers are S3-compatible; the endpoint is the differentiator.
	return NewS3Storage(ctx, cfg.Endpoint, cfg.Region, cfg.AccessKey, cfg.SecretKey, cfg.Bucket, cfg.UsePathStyle)
}
