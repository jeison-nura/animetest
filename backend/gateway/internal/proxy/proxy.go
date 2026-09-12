package proxy

import (
	"net/http"
	"net/http/httputil"
)

func New(target string) (*httputil.ReverseProxy, error) {
	url, err := urlParse(target)
	if err != nil {
		return nil, err
	}

	proxy := httputil.NewSingleHostReverseProxy(url)
	proxy.ErrorHandler = func(w http.ResponseWriter, r *http.Request, err error) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadGateway)
		w.Write([]byte(`{"error":{"code":"upstream_unavailable","message":"service temporarily unavailable"}}`))
	}

	return proxy, nil
}
