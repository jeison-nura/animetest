package entity

import "time"

type DatePersistence struct {
	CreatedAt time.Time `binding:"required"`
	UpdatedAt time.Time
}