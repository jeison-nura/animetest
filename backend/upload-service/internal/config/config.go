package config

import "os"

type Config struct {
	PostgresConStr string
	ServerPort     string
	MongoUri       string
}

func LoadConfigFromEnv() Config {
	return Config{
		PostgresConStr: getEnv("POSTGRES_CON_STR", "host=localhost user=postgres password=postgres dbname=postgres port=5432 sslmode=disable"),
		ServerPort:     getEnv("PORT", ":8080"),
		MongoUri:       getEnv("MONGO_URI", "mongodb://localhost:27017"),
	}
}

func getEnv(key string, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	return value
}
