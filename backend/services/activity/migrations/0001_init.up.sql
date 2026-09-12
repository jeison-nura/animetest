CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS user_lists (
    user_id    text NOT NULL,
    catalog_id bigint NOT NULL,
    kind       text NOT NULL CHECK (kind IN ('anime', 'manga')),
    status     text NOT NULL CHECK (status IN ('inProgress', 'completed', 'planned', 'dropped')),
    updated_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, catalog_id)
);

CREATE TABLE IF NOT EXISTS progress (
    user_id    text NOT NULL,
    catalog_id bigint NOT NULL,
    episode    text NOT NULL DEFAULT '',
    progress   int NOT NULL DEFAULT 0,
    provider   text NOT NULL DEFAULT '',
    updated_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, catalog_id)
);

CREATE TABLE IF NOT EXISTS activity_items (
    id         bigserial PRIMARY KEY,
    user_id    text NOT NULL,
    title      text NOT NULL,
    ep         text NOT NULL,
    rating     int NOT NULL,
    color      text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_activity_user ON activity_items(user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS profile_stats (
    user_id text NOT NULL,
    label   text NOT NULL,
    value   text NOT NULL,
    icon    text NOT NULL,
    PRIMARY KEY (user_id, label)
);

CREATE TABLE IF NOT EXISTS genre_affinities (
    user_id text NOT NULL,
    genre   text NOT NULL,
    pct     int NOT NULL,
    color   text NOT NULL,
    PRIMARY KEY (user_id, genre)
);

CREATE TABLE IF NOT EXISTS achievements (
    user_id     text NOT NULL,
    label       text NOT NULL,
    description text NOT NULL,
    icon        text NOT NULL,
    color       text NOT NULL,
    PRIMARY KEY (user_id, label)
);

CREATE TABLE IF NOT EXISTS user_settings (
    user_id      text PRIMARY KEY,
    display_name text NOT NULL,
    email        text NOT NULL,
    language     text NOT NULL DEFAULT 'English',
    country      text NOT NULL DEFAULT ''
);
