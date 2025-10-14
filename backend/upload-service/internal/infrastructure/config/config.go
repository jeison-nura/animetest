package config

type ConfigProvider interface {
	GetString(key string) string
	GetInt(key string) int
	GetBool(key string) bool
	GetFloat(key string) float64
}

type Config struct {
	provider ConfigProvider
}

func NewConfig(provider ConfigProvider) *Config {
	return &Config{provider: provider}
}

func (c *Config) GetDatabaseURI() string {
	return c.provider.GetString("DATABASE_URI")
}

func (c *Config) GetServerPort() string {
	return c.provider.GetString("SERVER_PORT")
}
