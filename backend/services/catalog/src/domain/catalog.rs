use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum EntryKind {
    Anime,
    Manga,
}

impl EntryKind {
    pub const fn as_str(self) -> &'static str {
        match self {
            Self::Anime => "anime",
            Self::Manga => "manga",
        }
    }

    pub fn parse(value: &str) -> Option<Self> {
        match value {
            "anime" => Some(Self::Anime),
            "manga" => Some(Self::Manga),
            _ => None,
        }
    }
}

impl Serialize for EntryKind {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        serializer.serialize_str(self.as_str())
    }
}

impl<'de> Deserialize<'de> for EntryKind {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        let value = String::deserialize(deserializer)?;
        Self::parse(&value).ok_or_else(|| {
            serde::de::Error::invalid_value(serde::de::Unexpected::Str(&value), &"anime or manga")
        })
    }
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct CatalogEntry {
    pub id: i64,
    pub kind: EntryKind,
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
    pub genres: Vec<String>,
}

#[derive(Debug, Clone, Serialize)]
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

#[derive(Debug, Clone, Copy)]
pub struct Pagination {
    pub limit: i64,
    pub offset: i64,
}

impl Pagination {
    pub fn new(page: i64, limit: i64) -> Self {
        Self {
            limit,
            offset: (page.max(1) - 1) * limit,
        }
    }
}
