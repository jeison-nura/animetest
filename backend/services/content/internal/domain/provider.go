package domain

import (
	"errors"
	"time"
)

var ErrProviderNotFound = errors.New("provider not found")

type ProviderKind string

const (
	ProviderInternal ProviderKind = "internal"
	ProviderScan     ProviderKind = "scan"
	ProviderExternal ProviderKind = "external"
)

type Provider struct {
	ID        string       `json:"id"`
	Slug      string       `json:"slug"`
	Name      string       `json:"name"`
	Kind      ProviderKind `json:"kind"`
	OwnerID   *string      `json:"-"`
	Status    string       `json:"status"`
	CreatedAt time.Time    `json:"-"`
}
