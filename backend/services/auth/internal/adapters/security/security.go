package security

import (
	"context"
	"crypto/rand"
	"crypto/rsa"
	"crypto/sha256"
	"crypto/subtle"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"math/big"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/argon2"

	"mnglib/auth/internal/domain"
)

type Argon2Hasher struct{}

func NewArgon2Hasher() *Argon2Hasher {
	return &Argon2Hasher{}
}

const (
	argonMemory  = 64 * 1024
	argonTime    = 3
	argonThreads = 4
	argonKeyLen  = 32
	argonSaltLen = 16
)

func (h *Argon2Hasher) Hash(password string) (string, error) {
	salt := make([]byte, argonSaltLen)
	if _, err := rand.Read(salt); err != nil {
		return "", err
	}

	key := argon2.IDKey([]byte(password), salt, argonTime, argonMemory, argonThreads, argonKeyLen)

	return fmt.Sprintf(
		"argon2id$v=%d$m=%d,t=%d,p=%d$%s$%s",
		argon2.Version, argonMemory, argonTime, argonThreads,
		base64.RawStdEncoding.EncodeToString(salt),
		base64.RawStdEncoding.EncodeToString(key),
	), nil
}

func (h *Argon2Hasher) Verify(password, encoded string) bool {
	var version int
	var memory, time uint32
	var threads uint8
	var rest string

	_, err := fmt.Sscanf(
		encoded,
		"argon2id$v=%d$m=%d,t=%d,p=%d$%s",
		&version, &memory, &time, &threads, &rest,
	)
	if err != nil {
		return false
	}

	if version != argon2.Version {
		return false
	}

	parts := strings.SplitN(rest, "$", 2)
	if len(parts) != 2 {
		return false
	}

	salt, err := base64.RawStdEncoding.DecodeString(parts[0])
	if err != nil {
		return false
	}

	expected, err := base64.RawStdEncoding.DecodeString(parts[1])
	if err != nil {
		return false
	}

	actual := argon2.IDKey([]byte(password), salt, time, memory, threads, uint32(len(expected)))

	return subtle.ConstantTimeCompare(actual, expected) == 1
}

type RSAIssuer struct {
	privateKey *rsa.PrivateKey
	publicKey  rsa.PublicKey
	kid        string
	accessTTL  time.Duration
}

func NewRSAIssuer(privateKey *rsa.PrivateKey, accessTTL time.Duration) *RSAIssuer {
	return &RSAIssuer{
		privateKey: privateKey,
		publicKey:  privateKey.PublicKey,
		kid:        KidFor(&privateKey.PublicKey),
		accessTTL:  accessTTL,
	}
}

func KidFor(pub *rsa.PublicKey) string {
	e := big.NewInt(int64(pub.E)).Bytes()
	if len(e) == 0 {
		e = []byte{0}
	}

	h := sha256.New()
	h.Write(pub.N.Bytes())
	h.Write(e)

	return base64.RawURLEncoding.EncodeToString(h.Sum(nil)[:16])
}

func (i *RSAIssuer) Issue(ctx context.Context, claims domain.AccessTokenClaims) (string, time.Time, error) {
	now := time.Now().UTC()
	expiresAt := now.Add(i.accessTTL)

	token := jwt.NewWithClaims(jwt.SigningMethodRS256, jwt.MapClaims{
		"iss":      "mnglib.auth",
		"sub":      claims.Subject,
		"email":    claims.Email,
		"username": claims.Username,
		"iat":      now.Unix(),
		"exp":      expiresAt.Unix(),
	})
	token.Header["kid"] = i.kid

	signed, err := token.SignedString(i.privateKey)
	if err != nil {
		return "", time.Time{}, err
	}

	return signed, expiresAt, nil
}

func (i *RSAIssuer) JWKSJSON() []byte {
	jwks := map[string]any{
		"keys": []map[string]any{{
			"kty": "RSA",
			"use": "sig",
			"alg": "RS256",
			"kid": i.kid,
			"n":   base64.RawURLEncoding.EncodeToString(i.publicKey.N.Bytes()),
			"e":   base64.RawURLEncoding.EncodeToString(big.NewInt(int64(i.publicKey.E)).Bytes()),
		}},
	}

	data, err := json.Marshal(jwks)
	if err != nil {
		return []byte(`{"keys":[]}`)
	}

	return data
}

func GeneratePrivateKey() (*rsa.PrivateKey, error) {
	return rsa.GenerateKey(rand.Reader, 2048)
}
