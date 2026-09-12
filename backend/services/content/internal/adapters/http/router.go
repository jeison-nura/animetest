package http

import (
	"log/slog"
	"net/http"
	"time"
)

func NewRouter(handler *Handler) *Router {
	mux := http.NewServeMux()

	// Consumo (usuário final vía gateway)
	mux.HandleFunc("GET /sources/entry/{entryId}", handler.ListSources)
	mux.HandleFunc("GET /sources/media/{id}/stream", handler.GetStream)
	mux.HandleFunc("GET /sources/media/{id}/pages", handler.GetPages)

	// Publishers (scans / internal)
	mux.HandleFunc("POST /provider/sources", handler.RegisterSource)
	mux.HandleFunc("POST /providers", handler.CreateProvider)
	mux.HandleFunc("POST /uploads", handler.StartUpload)
	mux.HandleFunc("POST /uploads/{jobId}/complete", handler.CompleteUpload)
	mux.HandleFunc("GET /uploads/{jobId}", handler.GetUploadStatus)

	mux.HandleFunc("GET /healthz", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("ok"))
	})

	return &Router{mux: mux}
}

type Router struct {
	mux *http.ServeMux
}

func (rt *Router) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	rt.mux.ServeHTTP(w, r)
}

func RecoverMiddleware(logger *slog.Logger, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			if rec := recover(); rec != nil {
				slog.Error("panic recovered", "panic", rec, "path", r.URL.Path)
				writeJSON(w, http.StatusInternalServerError, errorBody("internal", "unexpected error"))
			}
		}()
		next.ServeHTTP(w, r)
	})
}

func LoggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		next.ServeHTTP(w, r)
		slog.Info("request",
			"method", r.Method,
			"path", r.URL.Path,
			"duration", time.Since(start).String(),
		)
	})
}
