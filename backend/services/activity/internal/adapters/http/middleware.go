package http

import (
	"context"
	"net/http"
)

type userIDKey struct{}

func UserIDFrom(ctx context.Context) string {
	id, _ := ctx.Value(userIDKey{}).(string)
	return id
}

func WithUserID(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		userID := r.Header.Get("X-User-Id")
		if userID == "" {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusUnauthorized)
			w.Write([]byte(`{"error":{"code":"unauthorized","message":"missing X-User-Id"}}`))
			return
		}
		next.ServeHTTP(w, r.WithContext(context.WithValue(r.Context(), userIDKey{}, userID)))
	})
}
