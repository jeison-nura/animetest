use crate::domain::{CatalogEntry, EntryKind};

#[derive(Debug, sqlx::FromRow)]
pub struct EntryRow {
    pub id: i64,
    pub kind: String,
    pub slug: String,
    pub title: String,
    pub description: Option<String>,
    pub year: i32,
    pub rating: rust_decimal::Decimal,
    pub episode_count: Option<i32>,
    pub chapter_count: Option<i32>,
    pub color: String,
    pub is_new: bool,
    pub related_id: Option<i64>,
}

#[derive(Debug, sqlx::FromRow)]
pub struct EntryGenreRow {
    pub entry_id: i64,
    pub genre: String,
}

impl TryFrom<(EntryRow, Vec<String>)> for CatalogEntry {
    type Error = String;

    fn try_from((row, genres): (EntryRow, Vec<String>)) -> Result<Self, Self::Error> {
        let kind = EntryKind::parse(&row.kind)
            .ok_or_else(|| format!("invalid entry kind: {}", row.kind))?;

        Ok(Self {
            id: row.id,
            kind,
            slug: row.slug,
            title: row.title,
            description: row.description,
            year: row.year,
            rating: row.rating,
            episode_count: row.episode_count,
            chapter_count: row.chapter_count,
            color: row.color,
            is_new: row.is_new,
            related_id: row.related_id,
            genres,
        })
    }
}
#[derive(Debug, sqlx::FromRow)]
pub struct HeroSlideRow {
    pub id: i64,
    pub catalog_id: i64,
    pub title: String,
    pub subtitle: String,
    pub description: String,
    pub rating: String,
    pub episodes: i32,
    #[sqlx(json)]
    pub palette: crate::domain::Palette,
}
