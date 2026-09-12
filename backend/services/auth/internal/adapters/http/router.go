package http

import (
	"log/slog"
	"net/http"
	"time"

	"mnglib/auth/internal/domain"
)

type pairResponse struct {
	AccessToken  string           `json:"accessToken"`
	RefreshToken string           `json:"refreshToken"`
	TokenType    string           `json:"tokenType"`
	ExpiresAt    time.Time        `json:"expiresAt"`
	User         domain.PublicUser `json:"user"`
}

type Router struct {
	mux     *http.ServeMux
	handler *Handler
}

func NewRouter(handler *Handler) *Router {
	mux := http.NewServeMux()

	mux.HandleFunc("POST /auth/register", handler.Register)
	mux.HandleFunc("POST /auth/login", handler.Login)
	mux.HandleFunc("POST /auth/refresh", handler.Refresh)
	mux.HandleFunc("POST /auth/logout", handler.Logout)
	mux.HandleFunc("GET /auth/.well-known/jwks.json", handler.JWKS)
	mux.HandleFunc("GET /healthz", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("ok"))
	})

	return &Router{mux: mux, handler: handler}
}

func (rt *Router) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	rt.mux.ServeHTTP(w, r)
}

func RecoverMiddleware(logger *slog.Logger, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			if rec := recover(); rec != nil {
				logger.Error("panic recovered", "panic", rec, "path", r.URL.Path)
				writeError(w, http.StatusInternalServerError, "internal", "unexpected error")
			}
		}()
		next.ServeHTTP(w, r)
	})
}

func LoggingMiddleware(logger *slog.Logger, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		next.ServeHTTP(w, r)
		logger.Info("request",
			"method", r.Method,
			"path", r.URL.Path,
			"duration", time.Since(start).String(),
		)
	})
}
