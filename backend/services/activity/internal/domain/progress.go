package domain

import "time"

type Progress struct {
	CatalogID  int64     `json:"-"`
	Episode    string    `json:"-"`
	Progress   int       `json:"-"`
	Provider   string    `json:"-"`
	UpdatedAt  time.Time `json:"-"`
}

type WatchProgress struct {
	CatalogID int64     `json:"catalogId"`
	Episode   string    `json:"episode"`
	Progress  int       `json:"progress"`
	Provider  string    `json:"provider"`
	UpdatedAt time.Time `json:"updatedAt"`
}
