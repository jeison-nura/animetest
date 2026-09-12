package domain

import (
	"errors"
	"time"
)

var (
	ErrInvalidUpload     = errors.New("invalid upload request")
	ErrJobNotFound       = errors.New("upload job not found")
	ErrEntryNotInCatalog = errors.New("entry does not exist in catalog")
)

type UploadJob struct {
	ID        string    `json:"-"`
	SourceID  int64     `json:"-"`
	State     string    `json:"-"`
	Progress  int       `json:"-"`
	Error     *string   `json:"-"`
	ObjectKey string    `json:"-"`
	CreatedAt time.Time `json:"-"`
	UpdatedAt time.Time `json:"-"`
}
