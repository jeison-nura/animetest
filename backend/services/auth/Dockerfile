# syntax=docker/dockerfile:1.7
FROM golang:1.24-alpine AS build
WORKDIR /src
COPY go.mod go.sum* ./
RUN go mod download || true
COPY . .
RUN go mod tidy && CGO_ENABLED=0 go build -ldflags="-s -w" -o /bin/auth ./cmd/auth

# healthchecker estático (distroless no tiene shell)
FROM golang:1.24-alpine AS healthcheck-build
WORKDIR /src
COPY cmd/healthcheck/main.go ./main.go
RUN CGO_ENABLED=0 go build -ldflags="-s -w" -o /bin/healthcheck main.go

FROM gcr.io/distroless/static-debian12:nonroot
COPY --from=build /bin/auth /bin/auth
COPY --from=healthcheck-build /bin/healthcheck /bin/healthcheck
EXPOSE 8081
ENTRYPOINT ["/bin/auth"]
