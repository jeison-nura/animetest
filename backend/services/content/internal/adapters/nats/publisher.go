package nats

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/nats-io/nats.go"
)

const (
	SubjectTranscodeRequested = "transcode.requested"
	SubjectTranscodeProgress  = "transcode.progress"
	SubjectTranscodeCompleted = "transcode.completed"
	SubjectTranscodeFailed    = "transcode.failed"
	SubjectSourceReady        = "source.ready"
)

type TranscodeRequest struct {
	JobID    string `json:"jobId"`
	SourceID int64  `json:"sourceId"`
	Bucket   string `json:"bucket"`
	Key      string `json:"key"`
	Format   string `json:"format"`
}

type TranscodeProgressEvent struct {
	JobID    string `json:"jobId"`
	SourceID int64  `json:"sourceId"`
	Pct      int    `json:"pct"`
}

type TranscodeCompletedEvent struct {
	JobID    string `json:"jobId"`
	SourceID int64  `json:"sourceId"`
}

type TranscodeFailedEvent struct {
	JobID    string `json:"jobId"`
	SourceID int64  `json:"sourceId"`
	Error    string `json:"error"`
}

type SourceReadyEvent struct {
	SourceID int64 `json:"sourceId"`
}

type Publisher struct {
	js nats.JetStreamContext
}

func Connect(url string) (*nats.Conn, nats.JetStreamContext, error) {
	conn, err := nats.Connect(url,
		nats.Name("mnglib-content"),
		nats.MaxReconnects(-1),
		nats.ReconnectWait(2*time.Second),
	)
	if err != nil {
		return nil, nil, err
	}

	js, err := conn.JetStream()
	if err != nil {
		return nil, nil, err
	}

	return conn, js, nil
}

func EnsureStream(js nats.JetStreamContext) error {
	_, err := js.StreamInfo("MNGLIB")
	if err == nil {
		return nil
	}

	_, err = js.AddStream(&nats.StreamConfig{
		Name:      "MNGLIB",
		Subjects:  []string{"transcode.>", "source.>", "activity.>"},
		Retention: nats.LimitsPolicy,
		MaxAge:    7 * 24 * time.Hour,
		Storage:   nats.FileStorage,
	})
	if err != nil {
		return fmt.Errorf("create stream: %w", err)
	}

	return nil
}

func NewPublisher(js nats.JetStreamContext) *Publisher {
	return &Publisher{js: js}
}

func (p *Publisher) PublishTranscodeRequested(ctx context.Context, jobID string, sourceID int64, bucket, key string) error {
	payload, err := json.Marshal(TranscodeRequest{
		JobID:    jobID,
		SourceID: sourceID,
		Bucket:   bucket,
		Key:      key,
	})
	if err != nil {
		return err
	}

	ack, err := p.js.PublishMsg(&nats.Msg{Subject: SubjectTranscodeRequested, Data: payload})
	if err != nil {
		return fmt.Errorf("publish %s: %w", SubjectTranscodeRequested, err)
	}
	if ack.Stream == "" {
		return fmt.Errorf("publish %s: no ack stream", SubjectTranscodeRequested)
	}
	return nil
}

func (p *Publisher) PublishTranscodeProgress(ctx context.Context, jobID string, sourceID int64, pct int) error {
	return p.publish(ctx, SubjectTranscodeProgress, TranscodeProgressEvent{
		JobID:    jobID,
		SourceID: sourceID,
		Pct:      clampPercent(pct),
	})
}

func (p *Publisher) PublishTranscodeCompleted(ctx context.Context, jobID string, sourceID int64) error {
	return p.publish(ctx, SubjectTranscodeCompleted, TranscodeCompletedEvent{
		JobID:    jobID,
		SourceID: sourceID,
	})
}

func (p *Publisher) PublishTranscodeFailed(ctx context.Context, jobID string, sourceID int64, message string) error {
	return p.publish(ctx, SubjectTranscodeFailed, TranscodeFailedEvent{
		JobID:    jobID,
		SourceID: sourceID,
		Error:    message,
	})
}

func (p *Publisher) PublishSourceReady(ctx context.Context, sourceID int64) error {
	payload, err := json.Marshal(SourceReadyEvent{SourceID: sourceID})
	if err != nil {
		return err
	}

	ack, err := p.js.PublishMsg(&nats.Msg{Subject: SubjectSourceReady, Data: payload})
	if err != nil {
		return fmt.Errorf("publish %s: %w", SubjectSourceReady, err)
	}
	if ack.Stream == "" {
		return fmt.Errorf("publish %s: no ack stream", SubjectSourceReady)
	}
	return nil
}

func (p *Publisher) publish(ctx context.Context, subject string, event any) error {
	payload, err := json.Marshal(event)
	if err != nil {
		return err
	}

	ack, err := p.js.PublishMsg(&nats.Msg{Subject: subject, Data: payload})
	if err != nil {
		return fmt.Errorf("publish %s: %w", subject, err)
	}
	if ack.Stream == "" {
		return fmt.Errorf("publish %s: no ack stream", subject)
	}
	return nil
}

func clampPercent(value int) int {
	if value < 0 {
		return 0
	}
	if value > 100 {
		return 100
	}
	return value
}
