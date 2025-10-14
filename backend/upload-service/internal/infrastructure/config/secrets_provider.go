package config

import (
	"context"
	"encoding/json"
	"strconv"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/secretsmanager"
)

type SecretsProvider struct {
	client *secretsmanager.Client
	cache  map[string]string
	region string
}

func NewSecretsProvider(region string) (*SecretsProvider, error) {
	cfg, err := config.LoadDefaultConfig(context.TODO(), config.WithRegion(region))
	if err != nil {
		return nil, err
	}

	client := secretsmanager.NewFromConfig(cfg)

	return &SecretsProvider{
		client: client,
		cache:  make(map[string]string),
		region: region,
	}, nil
}

func (s *SecretsProvider) GetSecret(key string) (string, error) {
	if val, ok := s.cache[key]; ok {
		return val, nil
	}

	input := &secretsmanager.GetSecretValueInput{
		SecretId: aws.String(key),
	}

	result, err := s.client.GetSecretValue(context.TODO(), input)
	if err != nil {
		return "", err
	}

	var secretValue string

	if result.SecretString != nil {
		secretValue = *result.SecretString
	}

	s.cache[key] = secretValue

	return secretValue, nil
}

func (s *SecretsProvider) GetString(key string) string {
	secretValue, err := s.GetSecret(key)
	if err != nil {
		return ""
	}
	var jsonMap map[string]interface{}
	if err := json.Unmarshal([]byte(secretValue), &jsonMap); err != nil {
		if value, ok := jsonMap[key]; ok {
			if strValue, ok := value.(string); ok {
				return strValue
			}
		}
	}
	return secretValue
}

func (s *SecretsProvider) GetInt(key string) int {
	val, err := strconv.Atoi(s.GetString(key))
	if err != nil {
		return 0
	}
	return val
}

func (s *SecretsProvider) GetBool(key string) bool {
	val, err := strconv.ParseBool(s.GetString(key))
	if err != nil {
		return false
	}
	return val
}

func (s *SecretsProvider) GetFloat(key string) float64 {
	val, err := strconv.ParseFloat(s.GetString(key), 64)
	if err != nil {
		return 0
	}
	return val
}
