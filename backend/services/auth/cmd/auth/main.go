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

	authhttp "mnglib/auth/internal/adapters/http"
	authmigration "mnglib/auth/internal/adapters/migration"
	"mnglib/auth/internal/adapters/postgres"
	appmigration "mnglib/auth/internal/migration"
	"mnglib/auth/internal/adapters/security"
	"mnglib/auth/internal/app"
	"mnglib/auth/internal/config"
	"mnglib/auth/migrations"
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
	if err := runner.Run(ctx, appmigration.Options{FS: migrations.FS, Embedded: true}); err != nil {
		logger.Error("migrations failed", "error", err)
		os.Exit(1)
	}
	logger.Info("migrations applied")

	privateKey, err := security.GeneratePrivateKey()
	if err != nil {
		logger.Error("key generation failed", "error", err)
		os.Exit(1)
	}

	issuer := security.NewRSAIssuer(privateKey, cfg.AccessTokenTTL)
	service := app.NewService(
		postgres.NewUserRepo(pool),
		postgres.NewRefreshRepo(pool),
		security.NewArgon2Hasher(),
		issuer,
		cfg.AccessTokenTTL,
		cfg.RefreshTokenTTL,
	)

	router := authhttp.NewRouter(authhttp.NewHandler(service))
	handler := authhttp.LoggingMiddleware(logger, authhttp.RecoverMiddleware(logger, router))

	server := &http.Server{
		Addr:         ":" + cfg.Port,
		Handler:      handler,
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	logger.Info("auth service listening", "port", cfg.Port)
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
