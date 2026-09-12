package domain

import (
	"errors"
	"time"
)

var (
	ErrEmailTaken         = errors.New("email already registered")
	ErrUsernameTaken      = errors.New("username already taken")
	ErrInvalidCredentials = errors.New("invalid credentials")
)

type User struct {
	ID           string
	Email        string
	Username     string
	CreatedAt    time.Time
	PasswordHash string
}

type PublicUser struct {
	ID        string    `json:"id"`
	Email     string    `json:"email"`
	Username  string    `json:"username"`
	CreatedAt time.Time `json:"createdAt"`
}

func (u *User) Public() PublicUser {
	return PublicUser{
		ID:        u.ID,
		Email:     u.Email,
		Username:  u.Username,
		CreatedAt: u.CreatedAt,
	}
}
