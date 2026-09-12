# syntax=docker/dockerfile:1.7
FROM rust:1.88-alpine AS build
RUN apk add --no-cache musl-dev pkgconfig libpq-dev
WORKDIR /src
COPY Cargo.toml Cargo.lock* ./
COPY src ./src
COPY migrations ./migrations
RUN cargo build --release

# healthchecker estático (distroless no tiene shell)
FROM rust:1.88-alpine AS healthcheck-build
WORKDIR /src
COPY cmd/healthcheck/main.rs ./main.rs
RUN rustc -O -o /bin/healthcheck main.rs

FROM gcr.io/distroless/cc-debian12:nonroot
COPY --from=build /src/target/release/catalog /bin/catalog
COPY --from=healthcheck-build /bin/healthcheck /bin/healthcheck
EXPOSE 8082
ENTRYPOINT ["/bin/catalog"]
