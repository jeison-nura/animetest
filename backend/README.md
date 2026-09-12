# Backend MngLib

Microservicios (Fase 1: Gateway + Auth). Arquitectura completa en `docs/ARCHITECTURE.md`.

## Requisitos

- Go >= 1.24
- Docker + docker-compose (o el plugin `docker compose`)
- make (opcional)

## Correr todo

```bash
cd backend
make up          # postgres + nats + minio + auth + gateway
make smoke       # health, register y login de prueba
make logs        # seguir logs
```

Primera vez: los Dockerfiles ejecutan `go mod tidy` dentro del build (necesita red una única vez).

Puertos: gateway `:8080`, auth `:8081`, postgres `:5432`, nats `:4222` (monitor `:8222`), minio `:9000` (consola `:9001`, credenciales `mnglib/mnglib_dev`).

## Compilar en local (sin Docker)

```bash
make tidy && make build
```

Levantar manualmente: Postgres en local → `DATABASE_URL=postgres://... ./services/auth` y `AUTH_SERVICE_URL=http://localhost:8081 ./gateway`.

## Endpoints (vía gateway :8080)

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/healthz` | no | estado del gateway |
| POST | `/auth/register` | no | `{email, username, password}` |
| POST | `/auth/login` | no | → `{accessToken, refreshToken, user}` |
| POST | `/auth/refresh` | no | `{refreshToken}` → nuevo par (rotación con detección de reuso) |
| POST | `/auth/logout` | no | `{refreshToken}` → revoca |
| GET | `/auth/.well-known/jwks.json` | no | claves públicas RS256 |
| GET | `/me/*` | sí | placeholder (Activity no desplegado aún) |
| GET | `/catalog/*`, `/sources/*` | sí | 503 (Catalog/Content no desplegados) |

Rutas protegidas requieren header `Authorization: Bearer <accessToken>`.

## Detalles de seguridad

- Passwords: argon2id (64MB, t=3, p=4).
- Access token: JWT RS256, 15 min. El gateway valida firma (JWKS desde auth, refresco cada 10 min) y expiración.
- Refresh tokens: opacos (32 bytes aleatorios), guardados hasheados (SHA-256), rotación en cada uso; reuso detectado → se revocan todas las sesiones del usuario.
- CORS restricto al origen del frontend.

## Estructura

```
backend/
  gateway/        # Go — routing, JWT (JWKS), CORS, logging
  services/auth/  # Go — hexagonal: domain / app (casos de uso) / adapters (http, postgres, security)
  deploy/         # docker-compose (postgres, nats, minio, auth, gateway)
  docs/           # ARCHITECTURE.md
```

Cada servicio: `cmd/` + `internal/{domain,app,adapters}` + `migrations/`. Los servicios nunca se exponen al exterior; solo el gateway publica puertos.
