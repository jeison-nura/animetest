// Package migration runs ordered migration files in the appropriate backend.
// Each service owns its migrations; this package provides the runner interfaces.
package migration

import (
	"context"
	"io/fs"
)

type Options struct {
	FS       fs.FS
	Dir      string
	Embedded bool
}

// Runner abstracts the execution backend so services can swap databases
// without changing the migration discovery or ordering logic.
type Runner interface {
	Run(ctx context.Context, opts Options) error
}
