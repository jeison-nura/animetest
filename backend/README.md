# Backend MngLib

Microservicios detrás de un API Gateway. Arquitectura completa en `docs/ARCHITECTURE.md`.

## Servicios

| Servicio | Lenguaje | Puerto | DB | Descripción |
|---|---|---|---|---|
| Gateway | Go | 8080 | — | Punto de entrada: routing, JWT, rate limit, CORS |
| Auth | Go | 8081 | `auth` | Registro, login, refresh tokens, logout |
| Catalog | Rust (axum) | 8082 | `catalog` | Anime/manga, búsqueda, listados, hero slides |
| Activity | Go | 8083 | `activity` | Listas, progreso, historial, perfil |
| Content | Go | 8084 | `content` | Providers, sources, uploads, streaming/páginas |
| Transcode Worker | Go | — | `content` | Procesa uploads (HLS/páginas) vía NATS |

Infraestructura: PostgreSQL 17, NATS 2.11 y MinIO (S3-compatible) vía Docker Compose.

## Requisitos

- Docker + docker compose (o el plugin `docker-compose`)
- Go >= 1.24 (compilar en local)
- Rust >= 1.80 (compilar Catalog en local)
- make (opcional)

## Correr todo

```bash
cd backend
make up          # postgres + nats + minio + auth + catalog + activity + content + worker + gateway
make smoke       # health, register y login de prueba
make logs        # seguir logs
make down        # detener todo
```

Primera vez: los Dockerfiles ejecutan `go mod tidy` / cargo build dentro del build (necesita red una única vez).

Puertos: gateway `:8080`, auth `:8081`, catalog `:8082`, activity `:8083`, content `:8084`, postgres `:5432`, nats `:4222` (monitor `:8222`), minio `:9000` (consola `:9001`, credenciales `mnglib/mnglib_dev`).

## Compilar en local (sin Docker)

```bash
make tidy && make build
```

Levantar manualmente: Postgres en local →

```bash
DATABASE_URL=postgres://... ./services/auth/cmd/auth/auth
CATALOG_SERVICE_URL=... ./gateway/cmd/gateway/gateway
```

Cada servicio se configura por variables de entorno (ver `deploy/docker-compose.yml`).

## Endpoints (vía gateway :8080)

### Auth (público)

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/auth/register` | `{email, username, password}` |
| POST | `/auth/login` | → `{accessToken, refreshToken, user}` |
| POST | `/auth/refresh` | `{refreshToken}` → nuevo par (rotación con detección de reuso) |
| POST | `/auth/logout` | `{refreshToken}` → revoca |
| GET | `/auth/.well-known/jwks.json` | claves públicas RS256 |
| GET | `/healthz` | estado del gateway |

### Catalog (requiere JWT)

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/catalog/hero-slides` | slides del hero |
| GET | `/catalog/top-picks` | top picks |
| GET | `/catalog/trending` | tendencias |
| GET | `/catalog/top-manga` | top manga |
| GET | `/catalog/entries/{id}` | detalle de entry |
| GET | `/catalog/search?q=&kind=anime|manga` | búsqueda paginada |

### Activity (requiere JWT)

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/me/lists/anime` / `/me/lists/manga` | listas del usuario |
| POST | `/me/lists` | crear/actualizar entrada |
| POST | `/me/progress` | actualizar progreso |
| GET | `/me/continue-watching` | continuar viendo |
| GET | `/me/activity/recent` / `history` | actividad reciente / historial |
| GET | `/me/profile/stats` / `genre-affinities` | stats de perfil |
| GET | `/me/achievements` | logros |
| GET/PUT | `/me/settings` | preferencias |

### Content (requiere JWT)

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/sources/entry/{entryId}` | fuentes disponibles para un entry |
| GET | `/sources/media/{id}/stream` | URL firmada de stream (HLS) |
| GET | `/sources/media/{id}/pages` | URLs firmadas de páginas manga |
| POST | `/providers` | crear proveedor (scans) |
| POST | `/provider/sources` | registrar source |
| POST | `/uploads` | iniciar upload |
| POST | `/uploads/{jobId}/complete` | completar upload |
| GET | `/uploads/{jobId}` | estado del upload |

Rutas protegidas requieren header `Authorization: Bearer <accessToken>`.

## Detalles de seguridad

- Passwords: argon2id (64MB, t=3, p=4).
- Access token: JWT RS256, 15 min. El gateway valida firma (JWKS desde auth, refresco cada 10 min) y expiración.
- Refresh tokens: opacos (32 bytes aleatorios), guardados hasheados (SHA-256), rotación en cada uso; reuso detectado → se revocan todas las sesiones del usuario.
- Media: buckets privados en MinIO/S3; solo URLs firmadas de corta vida.
- CORS restricto al origen del frontend; rate limit en gateway.

## Estructura

```
backend/
  gateway/                  # Go — routing, JWT (JWKS), CORS, rate limit
  services/
    auth/                   # Go — hexagonal: domain / app / adapters (http, postgres, security)
    catalog/                # Rust (axum + sqlx) — hexagonal
    activity/               # Go — hexagonal
    content/                # Go — API + worker transcode (cmd/content, cmd/transcode-worker)
  deploy/                   # docker-compose + init scripts
  docs/                     # ARCHITECTURE.md
```

Cada servicio: `cmd/` + `internal/{domain,app,adapters}` + `migrations/`. Los servicios nunca se exponen al exterior; solo el gateway publica puertos.
