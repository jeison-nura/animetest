package config

import "testing"

func TestValidate_MissingPort(t *testing.T) {
	cfg := Config{DatabaseURL: "postgres://localhost/test"}
	if err := cfg.Validate(); err == nil {
		t.Error("expected error for missing PORT")
	}
}

func TestValidate_MissingDatabaseURL(t *testing.T) {
	cfg := Config{Port: "8081"}
	if err := cfg.Validate(); err == nil {
		t.Error("expected error for missing DATABASE_URL")
	}
}

func TestValidate_NegativeTTL(t *testing.T) {
	cfg := Config{Port: "8081", DatabaseURL: "postgres://x", AccessTokenTTL: -1}
	if err := cfg.Validate(); err == nil {
		t.Error("expected error for negative TTL")
	}
}

func TestValidate_Success(t *testing.T) {
	cfg := Config{Port: "8081", DatabaseURL: "postgres://localhost/test", AccessTokenTTL: 1, RefreshTokenTTL: 1}
	if err := cfg.Validate(); err != nil {
		t.Errorf("unexpected error: %v", err)
	}
}
