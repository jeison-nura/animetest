use axum::{
    extract::{Path, Query, State},
    Json,
};

use crate::adapters::http::errors::ApiError;
use crate::app::CatalogService;
use crate::domain::{CatalogEntry, CatalogError, EntryKind, HeroSlide, Pagination};

#[derive(Clone)]
pub struct AppState {
    pub service: CatalogService,
}

#[derive(serde::Deserialize)]
pub struct SearchQuery {
    pub q: String,
    pub kind: Option<String>,
    #[serde(default = "default_page")]
    pub page: i64,
    #[serde(default = "default_limit")]
    pub limit: i64,
}

fn default_page() -> i64 {
    1
}

fn default_limit() -> i64 {
    20
}

pub async fn hero_slides(State(state): State<AppState>) -> Result<Json<Vec<HeroSlide>>, ApiError> {
    Ok(Json(state.service.hero_slides().await?))
}

pub async fn top_picks(State(state): State<AppState>) -> Result<Json<Vec<CatalogEntry>>, ApiError> {
    Ok(Json(state.service.top_picks().await?))
}

pub async fn trending(State(state): State<AppState>) -> Result<Json<Vec<CatalogEntry>>, ApiError> {
    Ok(Json(state.service.trending().await?))
}

pub async fn top_manga(State(state): State<AppState>) -> Result<Json<Vec<CatalogEntry>>, ApiError> {
    Ok(Json(state.service.top_manga().await?))
}

pub async fn entry(
    State(state): State<AppState>,
    Path(id): Path<i64>,
) -> Result<Json<CatalogEntry>, ApiError> {
    Ok(Json(state.service.entry(id).await?))
}

pub async fn search(
    State(state): State<AppState>,
    Query(query): Query<SearchQuery>,
) -> Result<Json<Vec<CatalogEntry>>, ApiError> {
    let kind = query.kind.as_deref().map(EntryKind::parse);
    let kind = match kind {
        Some(Some(kind)) => Some(kind),
        Some(None) => {
            return Err(ApiError::from(CatalogError::InvalidInput(
                "kind must be anime or manga".into(),
            )))
        }
        None => None,
    };

    Ok(Json(
        state
            .service
            .search(
                &query.q,
                kind,
                Pagination::new(query.page, query.limit.clamp(1, 50)),
            )
            .await?,
    ))
}
