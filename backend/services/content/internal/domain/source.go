package domain

import (
	"errors"
	"time"
)

var (
	ErrNotFound        = errors.New("source not found")
	ErrSourceNotReady  = errors.New("source is not ready")
	ErrDuplicateSource = errors.New("source already exists for this provider/entry/number/language")
)

type SourceKind string

const (
	KindEpisode SourceKind = "episode"
	KindChapter SourceKind = "chapter"
)

type SourceFormat string

const (
	FormatHLS    SourceFormat = "hls"
	FormatMP4    SourceFormat = "mp4"
	FormatImages SourceFormat = "images"
	FormatLink   SourceFormat = "link"
)

type SourceStatus string

const (
	StatusProcessing SourceStatus = "processing"
	StatusReady      SourceStatus = "ready"
	StatusFailed     SourceStatus = "failed"
	StatusTakenDown  SourceStatus = "taken_down"
)

type Source struct {
	ID          int64        `json:"-"`
	ProviderID  string       `json:"providerId"`
	EntryID     int64        `json:"entryId"`
	Kind        SourceKind   `json:"kind"`
	Number      float64      `json:"number"`
	Title       string       `json:"title,omitempty"`
	Language    string       `json:"language"`
	Quality     string       `json:"quality,omitempty"`
	Format      SourceFormat `json:"format"`
	ExternalURL string       `json:"-"`
	Status      SourceStatus `json:"status"`
	CreatedAt   time.Time    `json:"-"`
}
