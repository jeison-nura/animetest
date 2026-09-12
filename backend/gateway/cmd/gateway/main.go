package main

import (
	"context"
	"errors"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"strings"
	"time"

	"mnglib/gateway/internal/authmw"
	"mnglib/gateway/internal/config"
	"mnglib/gateway/internal/middleware"
	"mnglib/gateway/internal/proxy"
)

func main() {
	logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))
	cfg := config.Load()
	if err := cfg.Validate(); err != nil {
		logger.Error("invalid config", "error", err)
		os.Exit(1)
	}

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt)
	defer stop()

	keyStore := authmw.NewKeyStore(cfg.AuthServiceURL, cfg.JWKSRefreshEvery, logger)
	go keyStore.Run(ctx)

	authProxy, err := proxy.New(cfg.AuthServiceURL)
	if err != nil {
		logger.Error("invalid auth service url", "error", err)
		os.Exit(1)
	}
	catalogProxy, err := proxy.New(cfg.CatalogServiceURL)
	if err != nil {
		logger.Error("invalid catalog service url", "error", err)
		os.Exit(1)
	}
	activityProxy, err := proxy.New(cfg.ActivityServiceURL)
	if err != nil {
		logger.Error("invalid activity service url", "error", err)
		os.Exit(1)
	}
	contentProxy, err := proxy.New(cfg.ContentServiceURL)
	if err != nil {
		logger.Error("invalid content service url", "error", err)
		os.Exit(1)
	}
	verifier := authmw.NewVerifier(keyStore)
	limiter := middleware.NewRateLimiter(cfg.RateLimitRPM)

	mux := http.NewServeMux()

	mux.HandleFunc("GET /healthz", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("ok"))
	})

	mux.Handle("/auth/", authProxy)

	protected := verifier.Middleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		switch {
		case strings.HasPrefix(r.URL.Path, "/catalog/"):
			catalogProxy.ServeHTTP(w, r)
		case strings.HasPrefix(r.URL.Path, "/sources/"),
			strings.HasPrefix(r.URL.Path, "/provider"),
			strings.HasPrefix(r.URL.Path, "/uploads"):
			contentProxy.ServeHTTP(w, r)
		default:
			activityProxy.ServeHTTP(w, r)
		}
	}))
	mux.Handle("/me/", protected)
	mux.Handle("/catalog/", protected)
	mux.Handle("/sources/", protected)
	mux.Handle("/provider", protected)
	mux.Handle("/provider/", protected)
	mux.Handle("/uploads", protected)
	mux.Handle("/uploads/", protected)

	handler := middleware.Recover(logger,
		middleware.Logging(logger,
			middleware.RateLimit(limiter,
				middleware.BodyLimit(int64(cfg.BodyLimitMB)*1024*1024,
					middleware.CORS(cfg.AllowedOrigin,
						middleware.StripTrailingSlash(mux),
					),
				),
			),
		),
	)

	server := &http.Server{
		Addr:         ":" + cfg.Port,
		Handler:      handler,
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 30 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	go func() {
		logger.Info("gateway listening", "port", cfg.Port, "auth", cfg.AuthServiceURL)
		if err := server.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			logger.Error("server failed", "error", err)
			os.Exit(1)
		}
	}()

	<-ctx.Done()

	shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := server.Shutdown(shutdownCtx); err != nil {
		logger.Error("graceful shutdown failed", "error", err)
	}
	logger.Info("gateway stopped")
}

func writeNotDeployed(w http.ResponseWriter, service string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusServiceUnavailable)
	w.Write([]byte(`{"error":{"code":"not_deployed","message":"` + service + ` is not deployed yet"}}`))
}

var _ = writeNotDeployed
