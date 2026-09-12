package http

import (
	"net/http"
)

func NewRouter(handler *Handler) *Router {
	mux := http.NewServeMux()

	mux.HandleFunc("GET /me/lists/anime", handler.ListAnime)
	mux.HandleFunc("GET /me/lists/manga", handler.ListManga)
	mux.HandleFunc("POST /me/lists", handler.UpsertList)
	mux.HandleFunc("POST /me/progress", handler.UpsertProgress)
	mux.HandleFunc("GET /me/activity/recent", handler.RecentActivity)
	mux.HandleFunc("GET /me/activity/history", handler.WatchHistory)
	mux.HandleFunc("GET /me/continue-watching", handler.ContinueWatching)
	mux.HandleFunc("GET /me/profile/stats", handler.Stats)
	mux.HandleFunc("GET /me/profile/genre-affinities", handler.GenreAffinities)
	mux.HandleFunc("GET /me/achievements", handler.Achievements)
	mux.HandleFunc("GET /me/settings", handler.Settings)
	mux.HandleFunc("PUT /me/settings", handler.Settings)
	mux.HandleFunc("GET /healthz", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("ok"))
	})

	return &Router{mux: mux}
}

type Router struct {
	mux *http.ServeMux
}

func (rt *Router) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	rt.mux.ServeHTTP(w, r)
}
