package useCases

import "errors"

// Common use case errors
var (
	ErrInvalidMangaID   = errors.New("invalid manga ID")
	ErrMangaNotFound    = errors.New("manga not found")
	ErrInvalidChapterID = errors.New("invalid chapter ID")
	ErrChapterNotFound  = errors.New("chapter not found")
	ErrInvalidVolumeID  = errors.New("invalid volume ID")
	ErrVolumeNotFound   = errors.New("volume not found")
	ErrInvalidInput     = errors.New("invalid input")
	ErrUnauthorized     = errors.New("unauthorized")
	ErrInternalError    = errors.New("internal server error")
)
