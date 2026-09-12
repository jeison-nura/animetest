CREATE TABLE IF NOT EXISTS entries (
    id            bigint PRIMARY KEY,
    kind          text NOT NULL CHECK (kind IN ('anime', 'manga')),
    slug          text NOT NULL UNIQUE,
    title         text NOT NULL,
    description   text,
    year          int NOT NULL,
    rating        numeric(3,1) NOT NULL DEFAULT 0,
    episode_count int,
    chapter_count int,
    color         text NOT NULL DEFAULT '#7c3aed',
    is_new        boolean NOT NULL DEFAULT false,
    related_id    bigint REFERENCES entries(id)
);

CREATE INDEX IF NOT EXISTS idx_entries_kind ON entries(kind);
CREATE INDEX IF NOT EXISTS idx_entries_rating ON entries(rating DESC);

CREATE TABLE IF NOT EXISTS genres (
    id   serial PRIMARY KEY,
    name text NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS entry_genres (
    entry_id bigint NOT NULL REFERENCES entries(id) ON DELETE CASCADE,
    genre_id int NOT NULL REFERENCES genres(id) ON DELETE CASCADE,
    PRIMARY KEY (entry_id, genre_id)
);

CREATE TABLE IF NOT EXISTS hero_slides (
    id         bigint PRIMARY KEY,
    entry_id   bigint NOT NULL REFERENCES entries(id),
    subtitle   text NOT NULL,
    description text NOT NULL,
    position   int NOT NULL DEFAULT 0,
    palette    jsonb NOT NULL
);

CREATE TABLE IF NOT EXISTS schema_migrations (
    version    text PRIMARY KEY,
    applied_at timestamptz NOT NULL DEFAULT now()
);
