package main

import (
	"bufio"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log/slog"
	"os"
	"os/exec"
	"os/signal"
	"path/filepath"
	"strings"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/nats-io/nats.go"

	contentnats "mnglib/content/internal/adapters/nats"
	"mnglib/content/internal/adapters/postgres"
	"mnglib/content/internal/adapters/storage"
	"mnglib/content/internal/app"
)

type TranscodeRequest struct {
	JobID    string `json:"jobId"`
	SourceID int64  `json:"sourceId"`
	Bucket   string `json:"bucket"`
	Key      string `json:"key"`
}

type workerConfig struct {
	natsURL          string
	databaseURL      string
	workDir          string
	ffmpegBin        string
}

func loadConfig() workerConfig {
	return workerConfig{
		natsURL:          envOr("NATS_URL", "nats://localhost:4222"),
		databaseURL:      envOr("DATABASE_URL", "postgres://mnglib:mnglib_dev@localhost:5432/content?sslmode=disable"),
		workDir:          envOr("WORK_DIR", "/tmp/transcode"),
		ffmpegBin:        envOr("FFMPEG_BIN", "ffmpeg"),
	}
}

func envOr(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}

func main() {
	logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))
	cfg := loadConfig()

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt)
	defer stop()

	if err := os.MkdirAll(cfg.workDir, 0o755); err != nil {
		logger.Error("work dir setup failed", "error", err)
		os.Exit(1)
	}

	pool, err := pgxpool.New(ctx, cfg.databaseURL)
	if err != nil {
		logger.Error("database connection failed", "error", err)
		os.Exit(1)
	}
	defer pool.Close()
	if err := pool.Ping(ctx); err != nil {
		logger.Error("database ping failed", "error", err)
		os.Exit(1)
	}

	conn, err := nats.Connect(cfg.natsURL,
		nats.Name("mnglib-transcode-worker"),
		nats.MaxReconnects(-1),
		nats.ReconnectWait(2*time.Second),
	)
	if err != nil {
		logger.Error("nats connection failed", "error", err)
		os.Exit(1)
	}
	defer conn.Drain()

	js, err := conn.JetStream()
	if err != nil {
		logger.Error("jetstream setup failed", "error", err)
		os.Exit(1)
	}
	if err := contentnats.EnsureStream(js); err != nil {
		logger.Error("jetstream stream setup failed", "error", err)
		os.Exit(1)
	}

	consumerConfig := &nats.ConsumerConfig{
		Durable:       "transcode-worker",
		FilterSubject: "transcode.requested",
		AckPolicy:     nats.AckExplicitPolicy,
		AckWait:       5 * time.Minute,
		MaxDeliver:    3,
	}

	if _, err = js.AddConsumer("MNGLIB", consumerConfig); err != nil && !errors.Is(err, nats.ErrConsumerNameAlreadyInUse) {
		logger.Error("consumer setup failed", "error", err)
		os.Exit(1)
	}

	sub, err := js.PullSubscribe(
		"transcode.requested",
		"transcode-worker",
		nats.BindStream("MNGLIB"),
	)
	if err != nil {
		logger.Error("subscribe failed", "error", err)
		os.Exit(1)
	}
	logger.Info("worker listening", "subject", "transcode.requested")

	objectStore, err := storage.NewObjectStore(ctx, storage.StorageConfig{
		Provider:     envOr("STORAGE_PROVIDER", "s3"),
		Endpoint:     envOr("STORAGE_ENDPOINT", "http://localhost:9000"),
		Region:       envOr("STORAGE_REGION", "us-east-1"),
		AccessKey:    envOr("STORAGE_ACCESS_KEY", "mnglib"),
		SecretKey:    envOr("STORAGE_SECRET_KEY", "mnglib_dev"),
		UsePathStyle: envOr("STORAGE_PATH_STYLE", "true") == "true",
		Bucket:       envOr("MEDIA_BUCKET", "media"),
	})
	if err != nil {
		logger.Error("storage setup failed", "error", err)
		os.Exit(1)
	}

	events := contentnats.NewPublisher(js)
	service := app.NewService(
		postgres.NewSourceRepo(pool),
		nil,
		postgres.NewJobRepo(pool),
		nil,
		events,
		app.Config{},
		logger,
	)

	runner := &transcodeRunner{
		logger:    logger,
		service:   service,
		storage:   objectStore,
		workDir:   cfg.workDir,
		ffmpegBin: cfg.ffmpegBin,
	}

	for {
		select {
		case <-ctx.Done():
			logger.Info("worker stopped")
			return
		default:
		}

		msgs, err := sub.Fetch(1, nats.MaxWait(30*time.Second))
		if err != nil {
			if errors.Is(err, nats.ErrTimeout) || errors.Is(err, context.DeadlineExceeded) {
				continue
			}
			logger.Error("fetch failed", "error", err)
			select {
			case <-ctx.Done():
				return
			case <-time.After(time.Second):
			}
			continue
		}

		for _, msg := range msgs {
			runner.process(ctx, msg)
		}
	}
}

type transcodeRunner struct {
	logger   *slog.Logger
	service  *app.Service
	storage  app.ObjectStore
	workDir  string
	ffmpegBin string
}

func (r *transcodeRunner) process(ctx context.Context, msg *nats.Msg) {
	var req TranscodeRequest
	if err := unmarshalMessage(msg.Data, &req); err != nil || req.JobID == "" || req.SourceID <= 0 || req.Bucket == "" || req.Key == "" {
		r.logger.Error("invalid transcode message", "error", err, "subject", msg.Subject)
		if err := msg.Term(); err != nil {
			r.logger.Error("message term failed", "error", err)
		}
		return
	}

	r.logger.Info("transcode job received", "jobId", req.JobID, "sourceId", req.SourceID)
	if err := r.run(ctx, req); err != nil {
		publishErr := r.service.HandleTranscodeFailed(context.WithoutCancel(ctx), req.JobID, req.SourceID, err.Error())
		if publishErr != nil {
			r.logger.Error("failed event handling failed", "jobId", req.JobID, "error", publishErr)
		}
		r.logger.Error("transcode failed", "jobId", req.JobID, "sourceId", req.SourceID, "error", err)
		if termErr := msg.Term(); termErr != nil {
			r.logger.Error("message term failed", "error", termErr)
		}
		return
	}

	if err := r.service.HandleTranscodeCompleted(ctx, req.JobID, req.SourceID); err != nil {
		r.logger.Error("transcode completion failed", "jobId", req.JobID, "error", err)
		if nakErr := msg.Nak(); nakErr != nil {
			r.logger.Error("message nak failed", "error", nakErr)
		}
		return
	}

	if err := msg.Ack(); err != nil {
		r.logger.Error("message ack failed", "jobId", req.JobID, "error", err)
	}
}

func (r *transcodeRunner) run(ctx context.Context, req TranscodeRequest) error {
	localInput := filepath.Join(r.workDir, fmt.Sprintf("job-%s-input.mp4", req.JobID))
	outputDir := filepath.Join(r.workDir, fmt.Sprintf("job-%s-out", req.JobID))

	if err := os.MkdirAll(outputDir, 0o755); err != nil {
		return err
	}
	defer os.RemoveAll(outputDir)
	defer os.Remove(localInput)

	if err := r.download(ctx, req.Key, localInput); err != nil {
		return fmt.Errorf("download input: %w", err)
	}
	if err := r.transcode(ctx, localInput, outputDir, req); err != nil {
		return err
	}
	if err := r.upload(ctx, req.SourceID, outputDir); err != nil {
		return fmt.Errorf("upload hls: %w", err)
	}
	return nil
}

func (r *transcodeRunner) download(ctx context.Context, key, destination string) error {
	return r.storage.Download(ctx, key, destination)
}

func (r *transcodeRunner) transcode(ctx context.Context, input, outputDir string, req TranscodeRequest) error {
	command := exec.CommandContext(
		ctx,
		r.ffmpegBin,
		"-i", input,
		"-filter_complex", "[0:v]split=2[v1][v2];[v1]scale=w=1920:h=1080[v1out];[v2]scale=w=1280:h=720[v2out]",
		"-map", "[v1out]", "-c:v:0", "libx264", "-b:v:0", "5000k",
		"-map", "[v2out]", "-c:v:1", "libx264", "-b:v:1", "2800k",
		"-map", "a:0", "-map", "a:0",
		"-c:a", "aac", "-b:a", "128k", "-ac", "2",
		"-f", "hls",
		"-hls_time", "4",
		"-hls_playlist_type", "vod",
		"-hls_segment_type", "mpegts",
		"-hls_segment_filename", filepath.Join(outputDir, "seg_%03d.ts"),
		"-master_pl_name", "master.m3u8",
		"-var_stream_map", "v:0,a:0 v:1,a:1",
		"-progress", "pipe:1",
		"-nostats",
		filepath.Join(outputDir, "stream0.m3u8"),
	)

	stdout, err := command.StdoutPipe()
	if err != nil {
		return err
	}
	stderr, err := command.StderrPipe()
	if err != nil {
		return err
	}
	if err := command.Start(); err != nil {
		return err
	}

	progressDone := make(chan error, 1)
	go func() {
		progressDone <- readProgress(stdout, func(pct int) {
			if err := r.service.HandleTranscodeProgress(context.WithoutCancel(ctx), req.JobID, req.SourceID, pct); err != nil {
				r.logger.Warn("progress update failed", "jobId", req.JobID, "pct", pct, "error", err)
			}
		})
	}()

	errLines := make(chan string, 1)
	go readLastError(stderr, errLines)

	waitErr := command.Wait()
	progressErr := <-progressDone
	if waitErr != nil {
		select {
		case line := <-errLines:
			return fmt.Errorf("ffmpeg: %w: %s", waitErr, line)
		default:
			return fmt.Errorf("ffmpeg: %w", waitErr)
		}
	}
	if progressErr != nil {
		return fmt.Errorf("read ffmpeg progress: %w", progressErr)
	}

	if err := r.service.HandleTranscodeProgress(context.WithoutCancel(ctx), req.JobID, req.SourceID, 100); err != nil {
		return err
	}
	return nil
}

func readProgress(reader io.Reader, callback func(int)) error {
	scanner := bufio.NewScanner(reader)
	scanner.Buffer(make([]byte, 0, 64*1024), 1024*1024)

	for scanner.Scan() {
		line := scanner.Text()
		key, value, found := strings.Cut(line, "=")
		if !found {
			continue
		}

		if key == "progress" && value == "end" {
			callback(100)
		}
	}
	return scanner.Err()
}

func readLastError(reader io.Reader, lines chan<- string) {
	scanner := bufio.NewScanner(reader)
	scanner.Buffer(make([]byte, 0, 64*1024), 1024*1024)
	for scanner.Scan() {
		select {
		case lines <- scanner.Text():
		default:
		}
	}
}

func (r *transcodeRunner) upload(ctx context.Context, sourceID int64, dir string) error {
	return filepath.WalkDir(dir, func(path string, entry os.DirEntry, err error) error {
		if err != nil {
			return err
		}
		if entry.IsDir() {
			return nil
		}

		relative, err := filepath.Rel(dir, path)
		if err != nil {
			return err
		}
		key := fmt.Sprintf("media/%d/hls/%s", sourceID, relative)
		return r.storage.Upload(ctx, key, path)
	})
}


func unmarshalMessage(data []byte, target any) error {
	if !strings.Contains(string(data), "{") {
		return errors.New("invalid json")
	}
	return json.Unmarshal(data, target)
}
