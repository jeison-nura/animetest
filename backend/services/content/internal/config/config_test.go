package config

import (
	"strings"
	"testing"
	"time"
)

func TestValidate_UnsupportedProvider(t *testing.T) {
	cfg := Config{Port: "8084", DatabaseURL: "postgres://x", StorageProvider: "azure", MediaBucket: "b", PresignTTL: time.Hour}
	err := cfg.Validate()
	if err == nil {
		t.Fatal("expected error for unsupported provider")
	}
	if !strings.Contains(err.Error(), "unsupported STORAGE_PROVIDER") {
		t.Errorf("unexpected error message: %v", err)
	}
}

func TestValidate_MinioMissingEndpoint(t *testing.T) {
	cfg := Config{Port: "8084", DatabaseURL: "postgres://x", StorageProvider: "minio", StorageAccessKey: "k", StorageSecretKey: "s", MediaBucket: "b", PresignTTL: time.Hour}
	if err := cfg.Validate(); err == nil {
		t.Error("expected error for minio without endpoint")
	}
}

func TestValidate_S3MissingCredentials(t *testing.T) {
	cfg := Config{Port: "8084", DatabaseURL: "postgres://x", StorageProvider: "s3", MediaBucket: "b", PresignTTL: time.Hour}
	if err := cfg.Validate(); err == nil {
		t.Error("expected error for s3 without access key")
	}
}

func TestValidate_Success(t *testing.T) {
	cfg := Config{Port: "8084", DatabaseURL: "postgres://x", StorageProvider: "minio", StorageEndpoint: "http://minio:9000", StorageAccessKey: "mnglib", StorageSecretKey: "mnglib_dev", MediaBucket: "media", PresignTTL: time.Hour}
	if err := cfg.Validate(); err != nil {
		t.Errorf("unexpected error: %v", err)
	}
}
