# MngLib — Frontend

Aplicación web de anime y manga construida con Next.js (App Router), React, TypeScript y Tailwind CSS 4.

## Requisitos

- Node.js >= 18
- npm (o pnpm)

## Puesta en marcha

```bash
npm install
cp .env.example .env.local
npm run dev
```

Abre `http://localhost:3000`.

### Variables de entorno

```bash
# Vacío → modo mock (datos de ejemplo, no requiere backend)
NEXT_PUBLIC_API_URL=

# Apuntando al gateway backend → API real
NEXT_PUBLIC_API_URL=http://localhost:8080
```

Ver `.env.example` y `.env.local.example`.

## Scripts

```bash
npm run dev         # servidor de desarrollo
npm run build       # build de producción
npm run start       # servir build de producción
npm run lint        # ESLint
npm run typecheck   # TypeScript
```

## Estructura

```
src/
  app/            # Rutas (App Router): home, search, profile, my-list, read, watch, login
  entities/       # Modelos y APIs de dominio: catalog, user
  features/       # Casos de uso: auth, episode-interactions
  widgets/        # Bloques grandes de UI: hero-carousel, video-player, manga-reader, side-nav
  shared/         # UI base, config, helpers, cliente HTTP
```

## Conexión con el backend

- `src/shared/api/http-client.ts` gestiona fetch al gateway, tokens y refresh.
- `src/entities/catalog/api/catalog-api.ts` y `src/entities/user/api/user-api.ts` consumen `/catalog/*` y `/me/*`.
- `src/features/auth/api/auth-api.ts` consume `/auth/login` y `/auth/logout`.
- Con `NEXT_PUBLIC_API_URL` vacío, todo corre con mocks (`isMockMode()`).

## Rutas principales

| Ruta | Descripción |
|---|---|
| `/home` | Home con hero carousel, tendencias, top picks |
| `/search` | Búsqueda de anime y manga |
| `/my-list` | Listas personales del usuario |
| `/favourites` | Favoritos |
| `/profile` | Perfil, stats, actividad, ajustes |
| `/watch/:id` | Player de anime |
| `/read/:id` | Lector de manga |
| `/login` | Autenticación |
