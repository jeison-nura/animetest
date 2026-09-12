package authmw

import (
	"context"
	"crypto/rsa"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"log/slog"
	"math/big"
	"net/http"
	"strings"
	"sync"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type jwksDocument struct {
	Keys []jwk `json:"keys"`
}

type jwk struct {
	Kid string `json:"kid"`
	Kty string `json:"kty"`
	Use string `json:"use"`
	Alg string `json:"alg"`
	N   string `json:"n"`
	E   string `json:"e"`
}

type KeyStore struct {
	authURL      string
	refreshEvery time.Duration
	logger       *slog.Logger

	mu     sync.RWMutex
	client *http.Client
	keys   map[string]*rsa.PublicKey
}

func NewKeyStore(authURL string, refreshEvery time.Duration, logger *slog.Logger) *KeyStore {
	return &KeyStore{
		authURL:      authURL,
		refreshEvery: refreshEvery,
		logger:       logger,
		client:       &http.Client{Timeout: 5 * time.Second},
		keys:         make(map[string]*rsa.PublicKey),
	}
}

func (k *KeyStore) Run(ctx context.Context) {
	if err := k.refresh(ctx); err != nil {
		k.logger.Error("initial JWKS fetch failed", "error", err)
	}

	ticker := time.NewTicker(k.refreshEvery)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			return
		case <-ticker.C:
			if err := k.refresh(ctx); err != nil {
				k.logger.Warn("JWKS refresh failed", "error", err)
			}
		}
	}
}

func (k *KeyStore) refresh(ctx context.Context) error {
	url := strings.TrimRight(k.authURL, "/") + "/auth/.well-known/jwks.json"

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
	if err != nil {
		return err
	}

	resp, err := k.client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("jwks endpoint returned %d", resp.StatusCode)
	}

	var doc jwksDocument
	if err := json.NewDecoder(resp.Body).Decode(&doc); err != nil {
		return err
	}

	keys := make(map[string]*rsa.PublicKey, len(doc.Keys))
	for _, key := range doc.Keys {
		if key.Kty != "RSA" || key.Alg != "RS256" {
			continue
		}
		pub, err := key.publicKey()
		if err != nil {
			k.logger.Warn("skipping malformed JWK", "kid", key.Kid, "error", err)
			continue
		}
		keys[key.Kid] = pub
	}

	k.mu.Lock()
	k.keys = keys
	k.mu.Unlock()

	k.logger.Info("JWKS updated", "keys", len(keys))
	return nil
}

func (k *KeyStore) get(kid string) (*rsa.PublicKey, bool) {
	k.mu.RLock()
	defer k.mu.RUnlock()

	key, ok := k.keys[kid]
	return key, ok
}

func (j jwk) publicKey() (*rsa.PublicKey, error) {
	nBytes, err := base64.RawURLEncoding.DecodeString(j.N)
	if err != nil {
		return nil, fmt.Errorf("invalid n: %w", err)
	}
	eBytes, err := base64.RawURLEncoding.DecodeString(j.E)
	if err != nil {
		return nil, fmt.Errorf("invalid e: %w", err)
	}

	return &rsa.PublicKey{
		N: new(big.Int).SetBytes(nBytes),
		E: int(new(big.Int).SetBytes(eBytes).Int64()),
	}, nil
}

type Verifier struct {
	store *KeyStore
}

func NewVerifier(store *KeyStore) *Verifier {
	return &Verifier{store: store}
}

type Identity struct {
	UserID   string
	Email    string
	Username string
}

func (v *Verifier) Middleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		raw := strings.TrimPrefix(r.Header.Get("Authorization"), "Bearer ")
		if raw == "" || raw == r.Header.Get("Authorization") {
			writeError(w, http.StatusUnauthorized, "unauthorized", "missing bearer token")
			return
		}

		parsed, err := jwt.Parse(raw, func(token *jwt.Token) (any, error) {
			kid, _ := token.Header["kid"].(string)
			if kid == "" {
				return nil, fmt.Errorf("token without kid")
			}
			key, ok := v.store.get(kid)
			if !ok {
				return nil, fmt.Errorf("unknown kid %q", kid)
			}
			return key, nil
		}, jwt.WithValidMethods([]string{"RS256"}))

		if err != nil || !parsed.Valid {
			writeError(w, http.StatusUnauthorized, "unauthorized", "invalid or expired token")
			return
		}

		claims, ok := parsed.Claims.(jwt.MapClaims)
		if !ok {
			writeError(w, http.StatusUnauthorized, "unauthorized", "invalid claims")
			return
		}

		subject, _ := claims["sub"].(string)
		if subject == "" {
			writeError(w, http.StatusUnauthorized, "unauthorized", "invalid subject")
			return
		}

		identity := Identity{UserID: subject}
		identity.Email, _ = claims["email"].(string)
		identity.Username, _ = claims["username"].(string)

		ctx := r.Context()
		ctx = context.WithValue(ctx, identityContextKey{}, identity)

		r = r.Clone(ctx)
		r.Header.Set("X-User-Id", identity.UserID)
		if identity.Email != "" {
			r.Header.Set("X-User-Email", identity.Email)
		}

		next.ServeHTTP(w, r)
	})
}

func FromContext(ctx context.Context) (Identity, bool) {
	identity, ok := ctx.Value(identityContextKey{}).(Identity)
	return identity, ok
}
