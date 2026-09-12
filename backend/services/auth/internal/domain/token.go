package domain

import (
	"errors"
	"time"
)

var (
	ErrInvalidRefresh = errors.New("invalid refresh token")
	ErrRefreshReuse   = errors.New("refresh token reuse detected")
)

type AccessTokenClaims struct {
	Subject  string
	Email    string
	Username string
}

type TokenPair struct {
	AccessToken  string     `json:"accessToken"`
	RefreshToken string     `json:"refreshToken"`
	TokenType    string     `json:"tokenType"`
	ExpiresAt    time.Time  `json:"expiresAt"`
	User         PublicUser `json:"user"`
}
