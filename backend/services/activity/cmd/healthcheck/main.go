package main

import (
	"fmt"
	"net"
	"os"
)

func main() {
	port := os.Getenv("HEALTHCHECK_PORT")
	if port == "" {
		port = "8081"
	}

	conn, err := net.Dial("tcp", "localhost:"+port)
	if err != nil {
		fmt.Fprintln(os.Stderr, "dial failed:", err)
		os.Exit(1)
	}
	defer conn.Close()

	if _, err := fmt.Fprintf(conn, "GET /healthz HTTP/1.0\r\nHost: localhost\r\n\r\n"); err != nil {
		fmt.Fprintln(os.Stderr, "write failed:", err)
		os.Exit(1)
	}

	buf := make([]byte, 128)
	if _, err := conn.Read(buf); err != nil {
		fmt.Fprintln(os.Stderr, "read failed:", err)
		os.Exit(1)
	}

	if string(buf[:12]) != "HTTP/1.1 200" && string(buf[:12]) != "HTTP/1.0 200" {
		fmt.Fprintln(os.Stderr, "unexpected response:", string(buf))
		os.Exit(1)
	}
}
