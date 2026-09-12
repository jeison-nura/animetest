package main

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"net/http"
	"os"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"

	authhttp "mnglib/activity/internal/adapters/http"
	authmigration "mnglib/activity/internal/adapters/migration"
	"mnglib/activity/internal/adapters/postgres"
	appmigration "mnglib/activity/internal/migration"
	"mnglib/activity/internal/config"
)

func main() {
	logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))
	cfg := config.Load()
	if err := cfg.Validate(); err != nil {
		logger.Error("config validation failed", "error", err)
		os.Exit(1)
	}

	ctx := context.Background()

	pool, err := connectWithRetry(ctx, cfg.DatabaseURL, logger)
	if err != nil {
		logger.Error("database connection failed", "error", err)
		os.Exit(1)
	}
	defer pool.Close()

	runner := authmigration.NewPostgresRunner(pool)
	if err := runner.Run(ctx, appmigration.Options{Dir: "migrations"}); err != nil {
		logger.Error("migrations failed", "error", err)
		os.Exit(1)
	}
	logger.Info("migrations applied")

	handler := authhttp.NewHandler(postgres.NewRepo(pool))
	router := authhttp.NewRouter(handler)
	protected := authhttp.WithUserID(router)
	mux := http.NewServeMux()
	mux.Handle("/", protected)
	mux.HandleFunc("GET /healthz", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("ok"))
	})

	server := &http.Server{
		Addr:         ":" + cfg.Port,
		Handler:      mux,
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	logger.Info("activity service listening", "port", cfg.Port)
	if err := server.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
		logger.Error("server failed", "error", err)
		os.Exit(1)
	}
}

func connectWithRetry(ctx context.Context, url string, logger *slog.Logger) (*pgxpool.Pool, error) {
	var pool *pgxpool.Pool
	var err error

	for attempt := 1; attempt <= 10; attempt++ {
		pool, err = pgxpool.New(ctx, url)
		if err == nil {
			if pingErr := pool.Ping(ctx); pingErr == nil {
				return pool, nil
			} else {
				err = pingErr
			}
		}
		logger.Warn("database not ready, retrying", "attempt", attempt, "error", err)
		time.Sleep(2 * time.Second)
	}

	return nil, fmt.Errorf("database unreachable: %w", err)
}
