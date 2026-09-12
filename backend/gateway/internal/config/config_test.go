package config

import "testing"

func TestValidate_MissingPort(t *testing.T) {
	cfg := Config{AuthServiceURL: "http://auth:8081", RateLimitRPM: 120, BodyLimitMB: 10}
	if err := cfg.Validate(); err == nil {
		t.Error("expected error for missing PORT")
	}
}

func TestValidate_MissingAuthURL(t *testing.T) {
	cfg := Config{Port: "8080", RateLimitRPM: 120, BodyLimitMB: 10}
	if err := cfg.Validate(); err == nil {
		t.Error("expected error for missing AUTH_SERVICE_URL")
	}
}

func TestValidate_NegativeRateLimit(t *testing.T) {
	cfg := Config{Port: "8080", AuthServiceURL: "http://auth:8081", RateLimitRPM: -1, BodyLimitMB: 10}
	if err := cfg.Validate(); err == nil {
		t.Error("expected error for negative RATE_LIMIT_RPM")
	}
}

func TestValidate_NegativeBodyLimit(t *testing.T) {
	cfg := Config{Port: "8080", AuthServiceURL: "http://auth:8081", RateLimitRPM: 120, BodyLimitMB: 0}
	if err := cfg.Validate(); err == nil {
		t.Error("expected error for zero BODY_LIMIT_MB")
	}
}

func TestValidate_Success(t *testing.T) {
	cfg := Config{Port: "8080", AuthServiceURL: "http://auth:8081", RateLimitRPM: 120, BodyLimitMB: 10}
	if err := cfg.Validate(); err != nil {
		t.Errorf("unexpected error: %v", err)
	}
}
