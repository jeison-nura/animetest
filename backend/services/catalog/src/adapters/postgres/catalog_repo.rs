use std::collections::HashMap;

use futures_util::future::BoxFuture;
use sqlx::postgres::PgPool;

use crate::adapters::postgres::rows::{EntryGenreRow, EntryRow, HeroSlideRow};
use crate::app::CatalogRepository;
use crate::domain::{CatalogEntry, CatalogError, EntryKind};

const ENTRY_COLUMNS: &str = "id, kind, slug, title, description, year, rating, \
    episode_count, chapter_count, color, is_new, related_id";

pub struct PostgresCatalogRepo {
    pool: PgPool,
}

impl PostgresCatalogRepo {
    pub const fn new(pool: PgPool) -> Self {
        Self { pool }
    }
}

impl CatalogRepository for PostgresCatalogRepo {
    fn top_anime(&self, limit: i64) -> BoxFuture<'_, Result<Vec<CatalogEntry>, CatalogError>> {
        Box::pin(self.list_kind(EntryKind::Anime, "rating DESC", limit))
    }

    fn trending(&self, limit: i64) -> BoxFuture<'_, Result<Vec<CatalogEntry>, CatalogError>> {
        Box::pin(self.list_kind(EntryKind::Anime, "year DESC, rating DESC", limit))
    }

    fn top_manga(&self, limit: i64) -> BoxFuture<'_, Result<Vec<CatalogEntry>, CatalogError>> {
        Box::pin(self.list_kind(EntryKind::Manga, "rating DESC", limit))
    }

    fn entry<'a>(&'a self, id: i64) -> BoxFuture<'a, Result<Option<CatalogEntry>, CatalogError>> {
        Box::pin(async move {
            let row = sqlx::query_as::<_, EntryRow>(&format!(
                r"
                SELECT {ENTRY_COLUMNS}
                FROM entries WHERE id = $1
                "
            ))
            .bind(id)
            .fetch_optional(&self.pool)
            .await?;

            let Some(row) = row else {
                return Ok(None);
            };

            let mut genres = self
                .genres_by_entries(std::slice::from_ref(&row.id))
                .await?;
            let mut entry: CatalogEntry = (row, Vec::new())
                .try_into()
                .map_err(CatalogError::InvalidInput)?;
            entry.genres = genres.remove(&entry.id).unwrap_or_default();
            Ok(Some(entry))
        })
    }

    fn search<'a>(
        &'a self,
        query: &'a str,
        kind: Option<EntryKind>,
        pagination: crate::domain::Pagination,
    ) -> BoxFuture<'a, Result<Vec<CatalogEntry>, CatalogError>> {
        Box::pin(async move {
            let pattern = format!("%{}%", query);
            let rows = sqlx::query_as::<_, EntryRow>(&format!(
                r"
                SELECT {ENTRY_COLUMNS}
                FROM entries
                WHERE title ILIKE $1
                  AND ($2::text IS NULL OR kind = $2)
                ORDER BY rating DESC
                LIMIT $3 OFFSET $4
                "
            ))
            .bind(pattern)
            .bind(kind.map(EntryKind::as_str))
            .bind(pagination.limit)
            .bind(pagination.offset)
            .fetch_all(&self.pool)
            .await?;

            self.with_genres(rows).await
        })
    }

    fn hero_slides(&self) -> BoxFuture<'_, Result<Vec<crate::domain::HeroSlide>, CatalogError>> {
        Box::pin(async {
            let rows = sqlx::query_as::<_, HeroSlideRow>(
                r"
            SELECT hs.id, hs.entry_id AS catalog_id, e.title, hs.subtitle,
                   hs.description, CAST(e.rating AS text) AS rating,
                   COALESCE(e.episode_count, 0) AS episodes, hs.palette
            FROM hero_slides hs
            JOIN entries e ON e.id = hs.entry_id
            ORDER BY hs.position
            ",
            )
            .fetch_all(&self.pool)
            .await?;

            let mut slides = Vec::with_capacity(rows.len());
            let mut ids = Vec::with_capacity(rows.len());
            for row in rows {
                slides.push(crate::domain::HeroSlide {
                    id: row.id,
                    catalog_id: row.catalog_id,
                    title: row.title,
                    subtitle: row.subtitle,
                    description: row.description,
                    genres: Vec::new(),
                    rating: row.rating,
                    episodes: row.episodes,
                    palette: row.palette,
                });
                ids.push(row.catalog_id);
            }

            let genres_by_entry = self.genres_by_entries(&ids).await?;
            for slide in &mut slides {
                slide.genres = genres_by_entry
                    .get(&slide.catalog_id)
                    .cloned()
                    .unwrap_or_default();
            }
            Ok(slides)
        })
    }
}

impl PostgresCatalogRepo {
    fn list_kind<'a>(
        &'a self,
        kind: EntryKind,
        order: &'static str,
        limit: i64,
    ) -> BoxFuture<'a, Result<Vec<CatalogEntry>, CatalogError>> {
        Box::pin(async move {
            let query = format!(
                r"
            SELECT {ENTRY_COLUMNS}
            FROM entries
            WHERE kind = $1
            ORDER BY {order}
            LIMIT $2
            "
            );
            let rows = sqlx::query_as::<_, EntryRow>(&query)
                .bind(kind.as_str())
                .bind(limit)
                .fetch_all(&self.pool)
                .await?;

            self.with_genres(rows).await
        })
    }

    fn with_genres<'a>(
        &'a self,
        rows: Vec<EntryRow>,
    ) -> BoxFuture<'a, Result<Vec<CatalogEntry>, CatalogError>> {
        Box::pin(async move {
            let ids = rows.iter().map(|row| row.id).collect::<Vec<_>>();
            let genres_by_entry = self.genres_by_entries(&ids).await?;

            Ok(rows
                .into_iter()
                .map(|row| {
                    let genres = genres_by_entry.get(&row.id).cloned().unwrap_or_default();
                    (row, genres).try_into().map_err(CatalogError::InvalidInput)
                })
                .collect::<Result<Vec<_>, _>>()?)
        })
    }

    fn genres_by_entries<'a>(
        &'a self,
        ids: &'a [i64],
    ) -> BoxFuture<'a, Result<HashMap<i64, Vec<String>>, CatalogError>> {
        Box::pin(async move {
            if ids.is_empty() {
                return Ok(HashMap::new());
            }

            let rows = sqlx::query_as::<_, EntryGenreRow>(
                r"
                SELECT eg.entry_id, g.name AS genre
                FROM entry_genres eg
                JOIN genres g ON g.id = eg.genre_id
                WHERE eg.entry_id = ANY($1)
                ORDER BY g.name
                ",
            )
            .bind(ids)
            .fetch_all(&self.pool)
            .await?;

            let mut map: HashMap<i64, Vec<String>> = HashMap::new();
            for row in rows {
                map.entry(row.entry_id).or_default().push(row.genre);
            }
            Ok(map)
        })
    }
}
