package config

import "testing"

func TestValidate_MissingPort(t *testing.T) {
	cfg := Config{DatabaseURL: "postgres://localhost/test"}
	if err := cfg.Validate(); err == nil {
		t.Error("expected error for missing PORT")
	}
}

func TestValidate_MissingDatabaseURL(t *testing.T) {
	cfg := Config{Port: "8083"}
	if err := cfg.Validate(); err == nil {
		t.Error("expected error for missing DATABASE_URL")
	}
}

func TestValidate_Success(t *testing.T) {
	cfg := Config{Port: "8083", DatabaseURL: "postgres://localhost/test"}
	if err := cfg.Validate(); err != nil {
		t.Errorf("unexpected error: %v", err)
	}
}
