package app

import "context"

// ObjectStorage es la versión exportable del puerto (para main.go).
type ObjectStorage = ObjectStore

// EnsureCompleteUpload firma la URL de subida para el flujo de dos pasos
// (StartUpload → PUT directo al bucket → CompleteUpload). El worker luego
// consume transcode.requested.
func (s *Service) EnsureDependencies(ctx context.Context) error {
	return nil
}
