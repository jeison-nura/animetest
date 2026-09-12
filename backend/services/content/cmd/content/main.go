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

	contenthttp "mnglib/content/internal/adapters/http"
	migration "mnglib/content/internal/adapters/migration"
	appmigration "mnglib/content/internal/migration"
	"mnglib/content/internal/adapters/nats"
	"mnglib/content/internal/adapters/postgres"
	"mnglib/content/internal/adapters/storage"
	"mnglib/content/internal/app"
	"mnglib/content/internal/config"
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

	runner := migration.NewPostgresRunner(pool)
	if err := runner.Run(ctx, appmigration.Options{Dir: "migrations"}); err != nil {
		logger.Error("migrations failed", "error", err)
		os.Exit(1)
	}
	logger.Info("migrations applied")

	natsConn, js, err := nats.Connect(cfg.NatsURL)
	if err != nil {
		logger.Error("nats connection failed", "error", err)
		os.Exit(1)
	}
	defer natsConn.Drain()

	if err := nats.EnsureStream(js); err != nil {
		logger.Error("nats stream setup failed", "error", err)
		os.Exit(1)
	}
	logger.Info("nats connected", "url", cfg.NatsURL)

	objectStore, err := storage.NewObjectStore(ctx, storage.StorageConfig{
		Provider:     cfg.StorageProvider,
		Endpoint:     cfg.StorageEndpoint,
		Region:       cfg.StorageRegion,
		AccessKey:    cfg.StorageAccessKey,
		SecretKey:    cfg.StorageSecretKey,
		UsePathStyle: cfg.StorageUsePathStyle,
		Bucket:       cfg.MediaBucket,
	})
	if err != nil {
		logger.Error("storage setup failed", "error", err)
		os.Exit(1)
	}

	service := app.NewService(
		postgres.NewSourceRepo(pool),
		postgres.NewProviderRepo(pool),
		postgres.NewJobRepo(pool),
		objectStore,
		nats.NewPublisher(js),
		app.Config{
			MediaBucket: cfg.MediaBucket,
			PresignTTL:  cfg.PresignTTL,
		},
		logger,
	)

	router := contenthttp.NewRouter(contenthttp.NewHandler(service))
	handler := contenthttp.LoggingMiddleware(contenthttp.RecoverMiddleware(logger, router))

	server := &http.Server{
		Addr:         ":" + cfg.Port,
		Handler:      handler,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 30 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	logger.Info("content service listening", "port", cfg.Port)
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
