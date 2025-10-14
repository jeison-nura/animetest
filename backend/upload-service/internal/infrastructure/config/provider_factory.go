package config

import "os"

type ProviderType string

const (
	LocalProvider ProviderType = "env"
	AWSProvider   ProviderType = "aws"
)

func CreateConfigProvider() (ConfigProvider, error) {
	providerType := getProviderType()
	switch providerType {
	case AWSProvider:
		region := os.Getenv("AWS_REGION")
		if region == "" {
			region = "us-east-1"
		}
		return NewSecretsProvider(region)
	case LocalProvider:
		return NewEnvProvider()
	default:
		return nil, nil
	}
}

func getProviderType() ProviderType {
	providerName := os.Getenv("CONFIG_PROVIDER")
	if providerName == "" {
		if os.Getenv(("GO_ENV")) == "production" {
			return AWSProvider
		}
		return LocalProvider
	}
	return ProviderType(providerName)
}
