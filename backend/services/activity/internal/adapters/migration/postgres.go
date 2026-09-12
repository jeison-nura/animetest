package migration

import (
	"context"
	"fmt"
	"io/fs"
	"os"
	"sort"
	"strings"

	"github.com/jackc/pgx/v5/pgxpool"

	appmigration "mnglib/activity/internal/migration"
)

const schemaVersionTable = `
	CREATE TABLE IF NOT EXISTS schema_migrations (
		version    text PRIMARY KEY,
		applied_at timestamptz NOT NULL DEFAULT now()
	)`

type PostgresRunner struct {
	pool *pgxpool.Pool
}

func NewPostgresRunner(pool *pgxpool.Pool) *PostgresRunner {
	return &PostgresRunner{pool: pool}
}

func (r *PostgresRunner) Run(ctx context.Context, opts appmigration.Options) error {
	if _, err := r.pool.Exec(ctx, schemaVersionTable); err != nil {
		return fmt.Errorf("ensure schema_migrations: %w", err)
	}

	var entries []fs.DirEntry
	var err error
	if opts.Embedded {
		entries, err = fs.ReadDir(opts.FS, ".")
	} else {
		entries, err = os.ReadDir(opts.Dir)
	}
	if err != nil {
		return fmt.Errorf("read migrations dir: %w", err)
	}

	var ups []string
	for _, entry := range entries {
		name := entry.Name()
		if strings.HasSuffix(name, ".up.sql") && len(name) >= 7 {
			ups = append(ups, name)
		}
	}
	sort.Strings(ups)

	for _, name := range ups {
		var exists bool
		if err := r.pool.QueryRow(ctx,
			`SELECT EXISTS (SELECT 1 FROM schema_migrations WHERE version = $1)`,
			name,
		).Scan(&exists); err != nil {
			return fmt.Errorf("check migration %s: %w", name, err)
		}
		if exists {
			continue
		}

		var content []byte
		if opts.Embedded {
			content, err = fs.ReadFile(opts.FS, name)
		} else {
			content, err = os.ReadFile(fmt.Sprintf("%s/%s", opts.Dir, name))
		}
		if err != nil {
			return fmt.Errorf("read migration %s: %w", name, err)
		}

		tx, err := r.pool.Begin(ctx)
		if err != nil {
			return fmt.Errorf("begin tx for %s: %w", name, err)
		}

		if _, err := tx.Exec(ctx, string(content)); err != nil {
			tx.Rollback(ctx)
			return fmt.Errorf("apply migration %s: %w", name, err)
		}

		if _, err := tx.Exec(ctx,
			`INSERT INTO schema_migrations (version) VALUES ($1)`, name); err != nil {
			tx.Rollback(ctx)
			return fmt.Errorf("record migration %s: %w", name, err)
		}

		if err := tx.Commit(ctx); err != nil {
			return fmt.Errorf("commit migration %s: %w", name, err)
		}
	}
	return nil
}
