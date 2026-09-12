package proxy

import "net/url"

func urlParse(raw string) (*url.URL, error) {
	return url.Parse(raw)
}
