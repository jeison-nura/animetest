use sqlx::postgres::PgPool;

use crate::models::{EntryRow, EntryWithGenres, HeroSlide};

pub async fn list_top_picks(pool: &PgPool) -> Result<Vec<EntryWithGenres>, sqlx::Error> {
    list_kind(pool, "anime", 8, "rating DESC").await
}

pub async fn list_trending(pool: &PgPool) -> Result<Vec<EntryWithGenres>, sqlx::Error> {
    list_kind(pool, "anime", 6, "year DESC, rating DESC").await
}

pub async fn list_top_manga(pool: &PgPool) -> Result<Vec<EntryWithGenres>, sqlx::Error> {
    list_kind(pool, "manga", 6, "rating DESC").await
}

async fn list_kind(
    pool: &PgPool,
    kind: &str,
    limit: i64,
    order: &str,
) -> Result<Vec<EntryWithGenres>, sqlx::Error> {
    let query = format!(
        r#"
        SELECT id, kind, slug, title, description, year, rating,
               episode_count, chapter_count, color, is_new, related_id
        FROM entries
        WHERE kind = $1
        ORDER BY {order}
        LIMIT $2"#
    );

    let entries: Vec<EntryRow> = sqlx::query_as(&query).bind(kind).bind(limit).fetch_all(pool).await?;

    fill_genres(pool, entries).await
}

pub async fn get_entry(pool: &PgPool, id: i64) -> Result<Option<EntryWithGenres>, sqlx::Error> {
    let entry: Option<EntryRow> = sqlx::query_as(
        r#"
        SELECT id, kind, slug, title, description, year, rating,
               episode_count, chapter_count, color, is_new, related_id
        FROM entries WHERE id = $1"#,
    )
    .bind(id)
    .fetch_optional(pool)
    .await?;

    match entry {
        Some(entry) => Ok(fill_genres(pool, vec![entry]).await?.into_iter().next()),
        None => Ok(None),
    }
}

pub async fn list_hero_slides(pool: &PgPool) -> Result<Vec<HeroSlide>, sqlx::Error> {
    let mut slides: Vec<HeroSlide> = sqlx::query_as(
        r#"
        SELECT hs.id, hs.entry_id AS catalog_id, e.title, hs.subtitle,
               hs.description, CAST(e.rating AS text) AS rating,
               COALESCE(e.episode_count, 0) AS episodes, hs.palette
        FROM hero_slides hs
        JOIN entries e ON e.id = hs.entry_id
        ORDER BY hs.position"#,
    )
    .fetch_all(pool)
    .await?;

    let ids: Vec<i64> = slides.iter().map(|s| s.catalog_id).collect();
    let genres_by_entry = entry_genres_map(pool, &ids).await?;
    for slide in &mut slides {
        slide.genres = genres_by_entry.get(&slide.catalog_id).cloned().unwrap_or_default();
    }
    Ok(slides)
}

async fn fill_genres(
    pool: &PgPool,
    entries: Vec<EntryRow>,
) -> Result<Vec<EntryWithGenres>, sqlx::Error> {
    let ids: Vec<i64> = entries.iter().map(|e| e.id).collect();

    let rows: Vec<(i64, String)> = sqlx::query_as(
        r#"
        SELECT eg.entry_id, g.name
        FROM entry_genres eg
        JOIN genres g ON g.id = eg.genre_id
        WHERE eg.entry_id = ANY($1)
        ORDER BY g.name"#,
    )
    .bind(&ids)
    .fetch_all(pool)
    .await?;

    let mut by_entry: std::collections::HashMap<i64, Vec<String>> =
        std::collections::HashMap::new();
    for (entry_id, genre) in rows {
        by_entry.entry(entry_id).or_default().push(genre);
    }

    Ok(entries
        .into_iter()
        .map(|entry| {
            let genres = by_entry.remove(&entry.id).filter(|g| !g.is_empty());
            EntryWithGenres { entry, genres }
        })
        .collect())
}

async fn entry_genres_map(
    pool: &PgPool,
    ids: &[i64],
) -> Result<std::collections::HashMap<i64, Vec<String>>, sqlx::Error> {
    if ids.is_empty() {
        return Ok(std::collections::HashMap::new());
    }

    let rows: Vec<(i64, String)> = sqlx::query_as(
        r#"
        SELECT eg.entry_id, g.name
        FROM entry_genres eg
        JOIN genres g ON g.id = eg.genre_id
        WHERE eg.entry_id = ANY($1)
        ORDER BY g.name"#,
    )
    .bind(ids)
    .fetch_all(pool)
    .await?;

    let mut map: std::collections::HashMap<i64, Vec<String>> =
        std::collections::HashMap::new();
    for (entry_id, genre) in rows {
        map.entry(entry_id).or_default().push(genre);
    }
    Ok(map)
}

pub async fn search_entries(
    pool: &PgPool,
    query: &str,
    kind: Option<&str>,
    limit: i64,
    offset: i64,
) -> Result<Vec<EntryWithGenres>, sqlx::Error> {
    let pattern = format!("%{}%", query);
    let entries: Vec<EntryRow> = sqlx::query_as(
        r#"
        SELECT id, kind, slug, title, description, year, rating,
               episode_count, chapter_count, color, is_new, related_id
        FROM entries
        WHERE title ILIKE $1
          AND ($2::text IS NULL OR kind = $2)
        ORDER BY rating DESC
        LIMIT $3 OFFSET $4"#,
    )
    .bind(&pattern)
    .bind(kind)
    .bind(limit)
    .bind(offset)
    .fetch_all(pool)
    .await?;

    fill_genres(pool, entries).await
}
