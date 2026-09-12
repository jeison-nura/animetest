CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS providers (
    id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    slug          text NOT NULL UNIQUE,
    name          text NOT NULL,
    kind          text NOT NULL CHECK (kind IN ('internal', 'scan', 'external')),
    owner_user_id text,
    status        text NOT NULL DEFAULT 'active',
    created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sources (
    id            bigserial PRIMARY KEY,
    provider_id   text NOT NULL,
    entry_id      bigint NOT NULL,
    kind          text NOT NULL CHECK (kind IN ('episode', 'chapter')),
    number        numeric(8,1) NOT NULL,
    title         text,
    language      text NOT NULL,
    quality       text,
    format        text NOT NULL CHECK (format IN ('hls', 'mp4', 'images', 'link')),
    external_url  text,
    playlist_key  text,
    status        text NOT NULL DEFAULT 'processing' CHECK (status IN ('processing', 'ready', 'failed', 'taken_down')),
    created_at    timestamptz NOT NULL DEFAULT now(),
    updated_at    timestamptz NOT NULL DEFAULT now(),
    UNIQUE (provider_id, entry_id, kind, number, language)
);

CREATE INDEX IF NOT EXISTS idx_sources_entry ON sources(entry_id, kind, number);

CREATE TABLE IF NOT EXISTS chapter_pages (
    source_id   bigint NOT NULL REFERENCES sources(id) ON DELETE CASCADE,
    page_number int NOT NULL,
    image_key   text NOT NULL,
    width       int,
    height      int,
    PRIMARY KEY (source_id, page_number)
);

CREATE TABLE IF NOT EXISTS upload_jobs (
    id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    source_id  bigint NOT NULL REFERENCES sources(id),
    state      text NOT NULL DEFAULT 'pending_upload',
    progress   int NOT NULL DEFAULT 0,
    error      text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_upload_jobs_source ON upload_jobs(source_id);

INSERT INTO providers (slug, name, kind) VALUES
    ('mnglib', 'MngLib', 'internal')
ON CONFLICT (slug) DO NOTHING;
