package config

import (
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

type EnvProvider struct {
}

func NewEnvProvider() (*EnvProvider, error) {
	if os.Getenv("GO_ENV") != "production" {
		if err := godotenv.Load(); err != nil {
			return nil, err
		}
	}
	return &EnvProvider{}, nil
}

func (e *EnvProvider) GetString(key string) string {
	return os.Getenv(key)
}

func (e *EnvProvider) GetInt(key string) int {
	val, err := strconv.Atoi(os.Getenv(key))
	if err != nil {
		return 0
	}
	return val
}

func (e *EnvProvider) GetBool(key string) bool {
	val, err := strconv.ParseBool(os.Getenv(key))
	if err != nil {
		return false
	}
	return val
}

func (e *EnvProvider) GetFloat(key string) float64 {
	val, err := strconv.ParseFloat(os.Getenv(key), 64)
	if err != nil {
		return 0
	}
	return val
}
