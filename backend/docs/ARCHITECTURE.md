# MngLib — Arquitectura del Backend

> Documento vivo. Toda decisión mayor debería quedar registrada aquí o en `docs/adr/`.
> Última actualización: fase de diseño (pre-código).

## 1. Contexto y objetivos

- Frontend: Next.js (`../mnglib`) que consume una **API vía gateway**. El browser nunca habla directo con los microservicios.
- Modelo de negocio **híbrido**: nosotros poseemos los metadatos (catálogo) y también podemos ser proveedores de contenido (streaming propio). Terceros ("scans") pueden registrar fuentes para episodios/capítulos y **el usuario final escoge con qué proveedor ver/leer** (estilo Mangadex / selector de servidores de sitios de anime).
- **Cloud-agnostic**: todo corre igual en local (Docker Compose) que en GCP/AWS. Nada de lógica en servicios propietarios del cloud.
- Experimentación multi-lenguaje: Go (orquestación/CRUD) y Rust (data-heavy/streaming) como base; un tercer lenguaje opcional para un servicio pequeño.
- Sin DB compartida entre servicios. Comunicación sync HTTP interna + eventos asíncronos (NATS).

## 2. Vista general del sistema

```
                          Browser (Next.js, token en cliente)
                                   │  HTTPS
                                   ▼
                     ┌──────────────────────────────┐
   Cloud LB (TLS) ──▶│        API Gateway (Go)      │  ← valida JWT, enruta,
                     │  (contenedor portable)       │    agrega, rate-limit
                     └───┬─────────┬─────────┬──────┘
                         │         │         │
          ┌──────────────┘         │         └───────────────┐
          ▼                        ▼                         ▼
   ┌────────────┐          ┌────────────┐            ┌────────────┐
   │ Auth (Go)  │          │  Catalog   │            │  Activity  │
   │            │          │   (Rust)   │            │            │
   └─────┬──────┘          └─────┬──────┘            └─────┬──────┘
         │                       │                         │
         │                       ▼                         │
         │               ┌────────────┐                    │
         └──────────────▶│  Content   │◀───────────────────┘
         registra fuentes│ (providers)│ progreso/continuar
                         └─────┬──────┘
                               │ HLS / páginas firmadas
                               ▼
                    MinIO (local) / S3-GCS (cloud) + CDN
        ────────────── todos publican/consumen ──────────────
                           NATS (eventos)
```

**Principio de dirección**: el browser solo conoce `NEXT_PUBLIC_API_URL` (el gateway). Los servicios nunca se exponen al internet.

## 3. Servicios

### 3.1 API Gateway — Go

Responsabilidades:
- Punto único de entrada. Routing `/auth/*`, `/catalog/*`, `/me/*`, `/sources/*` → servicios internos.
- **Middleware de autenticación**: valida el JWT (clave compartida o JWKS), inyecta `X-User-Id` / `X-User-Roles` en headers internos. Los servicios confían solo en tráfico de la red interna.
- Rate limiting por usuario/IP (token bucket en memoria o Redis).
- CORS para el dominio del frontend.
- Futuro: agregación de respuestas (p. ej. entry + sources en una llamada) si el front lo necesita.

Tecnología: `net/http` + `chi` (o stdlib puro). Sin ORM. HTTP/JSON hacia servicios internos (gRPC solo si aparece un hot path que lo justifique).

### 3.2 Auth — Go

- Registro, login, refresh tokens, logout.
- Emite **JWT access** (corto, ~15 min, firmado con RS256) + refresh token de larga vida (rotativo, guardado en DB).
- Guarda: `users`, `credentials` (argon2id), `refresh_tokens`, `sessions`.
- El login del frontend (`authApi.login`) apunta aquí. Transición posterior a cookie httpOnly es solo config del gateway, no cambio de contrato.

### 3.3 Catalog — Rust (axum + sqlx + Postgres)

**Un solo servicio para anime y manga** (decisión: NO separarlos):
- El modelo es 90% compartido; solo difiere `episodes` (anime) vs `chapters` (manga) → columna `kind: anime | manga` + contador según kind.
- La relación anime↔manga (`related_entries`) es core de la app ("Related adaptation"); en un solo servicio es una FK. En dos servicios sería join vía red o duplicación de datos.
- Géneros, búsqueda, rankings y "hero slides" son queries iguales para ambos.

Guarda **metadatos puros**: título, sinopsis, géneros, año, rating agregado, counts. **No sabe** dónde está el media (eso es Content). Sí sabe **disponibilidad**: "ep 12 tiene N fuentes" (actualizado por eventos del Content Service).

Esquema (resumen):
```
entries(id, kind, slug, title, description, year, rating, episode_count, chapter_count, is_new)
entry_genres(entry_id, genre)          -- géneros normalizados
related_entries(anime_id, manga_id)
hero_slides(id, entry_id, subtitle, palette_json, position)
```

### 3.4 Content / Providers — el corazón del modelo híbrido

#### 3.4.1 Modelo de dominio (estilo scans)

```
providers
  id, slug, name, kind(internal | scan | external), owner_user_id?, logo_url, status
  ── internal: nosotros (nuestro storage/CDN)
  ── scan: grupo de traducción registrado que aporta capítulos/episodios
  ── external: quien solo registra links a fuentes fuera

sources                          ← "qué proveedor tiene qué"
  id, provider_id, entry_id (→ Catalog, por id estable),
  kind(episode | chapter), number (numeric, soporta cap 12.5),
  title?, language(es|en|ja), quality(720|1080), format(hls | mp4 | images | link),
  status(processing | ready | failed | taken_down), created_at
  UNIQUE(provider_id, entry_id, kind, number, language)

stream_assets (solo video)       stream_assets.source_id → 1:1
  hls_playlist_key, duration_sec, size_bytes, master_mp4_key

chapter_pages (solo manga)       source_id 1:N
  page_number, image_key, width, height

upload_jobs
  id, source_id, state(uploaded | transcoding | ready | failed), progress_pct, error?
```

Reglas:
- El **Catalog no conoce providers**; solo recibe eventos de disponibilidad.
- Un episodio/capítulo puede tener **N fuentes** (uno por proveedor). El usuario elige; el front muestra el selector.
- `taken_down` por DMCA/decisión editorial: se marca, no se borra (trazabilidad).

#### 3.4.2 Endpoints (contrato tentativo con el front)

```
GET  /sources/entry/{entryId}?kind=episode&number=12   → fuentes disponibles (para selector)
GET  /sources/media/{id}/stream   → HLS master playlist (URL firmada) [video]
GET  /sources/media/{id}/pages    → lista de URLs firmadas de páginas [manga]
POST /provider/sources         → registro bulk de fuentes (scan/external)
POST /uploads                  → inicia upload interno (multipart)
PATCH /admin/sources/{id}      → moderación (taken_down, etc.)
```

#### 3.4.3 Pipeline de streaming (video, rol de proveedor interno)

```
 master.mp4 ──▶ upload multipart ──▶ upload_jobs
                                        │ encola
                                        ▼
                     worker transcode (contenedor propio, consumidor NATS)
                     ├─ normaliza audio/video
                     ├─ HLS ABR: 1080p + 720p, segmentos ~4s
                     └─ sube a bucket: media/{sourceId}/hls/{...}.m3u8 + .ts
                                        │
                                        ▼
                        source.status = ready + evento source.ready
                                        │
                          Catalog incrementa disponibilidad
                                        │
                     Play: Content firma URLs (presigned, TTL 1h)
```

- **Storage**: API S3. Local = **MinIO** (mismo protocolo S3); cloud = S3/GCS. Cero cambios de código.
- **Servido**: presigned URLs directas al bucket/CDN. El gateway nunca proxyea bytes de video (caro); solo firma. En cloud, CDN (CloudFront/Cloud CDN) delante del bucket con OAC/OAuth — la playlist firmada sigue funcionando igual.
- Subtítulos: track HLS separado (`subtitles/{lang}.vtt`) en el master playlist.
- **Manga**: pipeline simple — validar imagen → re-encode a WebP (2 tamaños) → bucket → `chapter_pages`. No requiere workers pesados.

#### 3.4.4 El worker de transcode como servicio

El worker es un **servicio consumidor** (no API): no expone puerto HTTP, no tiene endpoints; solo escucha la cola de NATS.

```
Content API (Go)  ──publica──▶  NATS: transcode.requested
                                        │
Worker transcode  ◀──consume────────────┘
  ├─ descarga el master.mp4 del bucket
  ├─ lanza ffmpeg (proceso hijo) → HLS ABR 1080p/720p, segmentos ~4s
  ├─ sube segmentos + playlists al bucket
  ├─ publica transcode.progress {jobId, pct}        (UI de progreso)
  └─ al terminar: source.status=ready + publica source.ready
        → Catalog actualiza disponibilidad
        → Activity notifica
```

Propiedades:
- **Desacople temporal**: worker caído → los mensajes esperan en JetStream; el upload del usuario nunca falla por el transcoder.
- **Escalado por carga**: jobs pendientes ↑ → más réplicas del worker (cada una toma un mensaje).
- **Reintentos**: worker muere a mitad → job queda `transcoding`, un delivery/ack tardío o watchdog lo re-encola.
- Puede vivir en otra máquina (ej. la que tiene GPU) sin tocar el resto.

**v1: worker en Go** (`exec.CommandContext` para ffmpeg, mismo módulo, binario aparte `cmd/transcode-worker`). Si el perfilado lo justifica después, se extrae a Rust sin tocar el contrato de la cola — el contrato es el mensaje NATS, no el lenguaje.

Sujetos NATS v1:
```
transcode.requested {jobId, sourceId, bucket, key}
transcode.progress  {jobId, sourceId, pct}
transcode.completed {jobId, sourceId}
transcode.failed    {jobId, sourceId, error}
source.ready        {sourceId}      (publicado por Content al consumir transcode.completed)
source.taken_down   {sourceId}
```

### 3.5 Activity — Go o TypeScript (slot del tercer lenguaje)

Todo lo de `/me/*`:
- `user_lists` (status por entry), `progress` (ep/cap + proveedor usado → "continue watching" con contexto), `watch_history`, `comments`, `user_prefs` (idioma, proveedor favorito).
- El "continue watching" del Home sale de aquí, no del Catalog.
- Escucha `source.ready` para notificar "nuevo capítulo de X está en tu proveedor favorito".

## 4. Comunicación

| Tipo | Canal | Uso |
|---|---|---|
| Sync | HTTP/JSON interno | queries del front vía gateway (todo lo GET) |
| Async | NATS (at-least-once, subjects con wildcard) | reacciones a eventos de dominio |

**Catálogo de eventos (v1)**
```
auth.user.registered            → Activity (crea filas default)
source.registered | source.ready | source.failed | source.taken_down → Catalog (disponibilidad), Activity (notificaciones)
activity.progress.updated       → (futuro: recomendaciones)
```

Reglas: los eventos son **hechos pasados, versionados** (`{"v":1, ...}`), idempotentes al consumir (claves naturales). Ningún servicio llama a otro dentro de una request de escritura si puede esperar el evento.

## 5. Seguridad

- Login → JWT RS256. El **gateway valida** firma y expiración; servicios confían en headers internos (red privada + opcional mTLS después).
- Refresh token rotativo, revocable por sesión.
- Storage: buckets privados; solo URLs firmadas (TTL corto) exponen media.
- CORS: solo el dominio del frontend. Rate limit en gateway.
- Secretos: env vars / secret manager del cloud; nunca en el repo.

## 6. Datos y storage

| Servicio | DB | Notas |
|---|---|---|
| Auth | Postgres `auth` | users, credentials, refresh_tokens |
| Catalog | Postgres `catalog` | entries, genres, related, hero_slides |
| Content | Postgres `content` | providers, sources, assets, upload_jobs |
| Activity | Postgres `activity` | lists, progress, history, comments, prefs |

- Una sola instancia Postgres en local con DBs separadas (database-per-service lógico). En cloud, instancias gestionadas por servicio.
- **Migraciones por servicio** (sqlx en Rust, golang-migrate en Go). Jamás migraciones cruzadas.
- Redis (futuro): caché de catálogo caliente y rate-limit distribuido.
- Media: MinIO → S3/GCS + CDN.

## 7. Despliegue local vs cloud (compatibilidad)

| Pieza | Local | Cloud (GCP/AWS) |
|---|---|---|
| Gateway + servicios | `docker compose up` | Cloud Run / ECS / K8s (mismas imágenes) |
| Ingress | puerto del compose | LB del cloud (solo TLS) → gateway |
| Postgres | contenedor | Cloud SQL / RDS |
| Storage | MinIO | S3 / GCS (misma API) + CDN |
| NATS | contenedor | contenedor o managed |
| Observabilidad | logs stdout | logs del cloud + OpenTelemetry después |

La regla: **toda decisión de negocio vive en contenedores propios**; el cloud solo aporta primitives (LB, SQL gestionado, buckets). Migrar de cloud = cambiar config, no código.

## 8. Estructura del monorepo

```
backend/
  gateway/                  # Go
  services/
    auth/                   # Go
    catalog/                # Rust (axum)
    content/                # Go — API + worker transcode (binarios separados: cmd/content, cmd/transcode-worker)
    activity/               # Go
    catalog-worker/         # (futuro) Rust si el perfilado lo justifica
  deploy/
    docker-compose.yml
    Dockerfile.* (uno por servicio)
  docs/
    ARCHITECTURE.md         ← este documento
    adr/                    # decision records puntuales
```

Cada servicio (hexagonal): `cmd/` (entrypoint) + `internal/domain` (entidades y reglas) + `internal/app` (casos de uso) + `internal/adapters` (http, persistence, events) + `migrations/`.

## 9. Contrato con el frontend (estado actual)

| Endpoint (front) | Servicio | Nota |
|---|---|---|
| `/auth/login`, `/auth/logout` | Auth | mock acepta cualquier credencial |
| `/catalog/hero-slides|top-picks|trending|top-manga` | Catalog | |
| `/catalog/entries/:id` | Catalog | ya lo usa read/watch |
| `/me/profile|stats|...`, `/me/lists/*` | Activity | |
| `/me/continue-watching` | Activity | con proveedor usado |
| `/entries/:id/sources` | Content | **nuevo** para selector de scans |
| `/sources/:id/stream|pages` | Content | **nuevo** para player/visor |

Versionado: prefijo `/v1` en el gateway cuando el contrato se estabilice; durante desarrollo sin prefijo.

## 10. Roadmap

1. **Fase 1 — esqueleto**: monorepo + docker-compose (Postgres, MinIO, NATS) + Gateway Go (rutas → mocks) + Auth (registro/login/refresh JWT). El front consume gateway real.
2. **Fase 2 — Catalog** (Rust): CRUD entries, géneros, related, endpoints de listados. Se apagan los mocks del front.
3. **Fase 3 — Activity**: listas, progreso, continue-watching, preferencias.
4. **Fase 4 — Content**: registro de providers/scans, uploads, pipeline HLS + páginas manga, selector en el front.
5. **Fase 5 — Interacciones**: comentarios, ratings, feeds.

## 11. Decisiones abiertas (por decidir antes de Fase 4)

- Moderación/DMCA para scans externos: flujo de reportes y `taken_down` (pendiente diseño).
- Monetización/roles: ¿usuarios "publisher" con permisos especiales? (afecta Auth).
- DRM: fuera de alcance inicial (HLS + URLs firmadas es el techo); re-evaluar si hay contenido que lo exija.
- Observabilidad concreta: OpenTelemetry + Grafana stack vs logs del cloud.
