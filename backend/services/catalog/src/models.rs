use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, sqlx::FromRow)]
#[serde(rename_all = "camelCase")]
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

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct EntryWithGenres {
    #[serde(flatten)]
    pub entry: EntryRow,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub genres: Option<Vec<String>>,
}

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
#[serde(rename_all = "camelCase")]
pub struct HeroSlide {
    pub id: i64,
    pub catalog_id: i64,
    pub title: String,
    pub subtitle: String,
    pub description: String,
    pub genres: Vec<String>,
    pub rating: String,
    pub episodes: i32,
    #[sqlx(json)]
    pub palette: Palette,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Palette {
    pub from: String,
    pub to: String,
    pub accent: String,
    pub text_accent: String,
}

#[derive(Debug, Serialize, sqlx::FromRow)]
#[serde(rename_all = "camelCase")]
pub struct WatchProgressItem {
    pub id: i64,
    pub catalog_id: i64,
    pub title: String,
    pub episode: String,
    pub progress: i32,
    pub total_eps: i32,
    pub color: String,
}
