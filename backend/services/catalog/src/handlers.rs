use axum::{
    extract::{Path, Query, State},
    http::StatusCode,
    response::IntoResponse,
    Json,
};
use sqlx::postgres::PgPool;

use crate::repo;

#[derive(serde::Deserialize)]
pub struct SearchQuery {
    pub q: String,
    #[serde(default)]
    pub kind: Option<String>,
    #[serde(default = "default_page")]
    pub page: i64,
    #[serde(default = "default_limit")]
    pub limit: i64,
}

fn default_page() -> i64 { 1 }
fn default_limit() -> i64 { 20 }

#[derive(Clone)]
pub struct AppState {
    pub pool: PgPool,
}

pub async fn hero_slides(State(state): State<AppState>) -> Result<Json<Vec<crate::models::HeroSlide>>, ApiError> {
    Ok(Json(repo::list_hero_slides(&state.pool).await?))
}

pub async fn top_picks(State(state): State<AppState>) -> Result<Json<Vec<crate::models::EntryWithGenres>>, ApiError> {
    Ok(Json(repo::list_top_picks(&state.pool).await?))
}

pub async fn trending(State(state): State<AppState>) -> Result<Json<Vec<crate::models::EntryWithGenres>>, ApiError> {
    Ok(Json(repo::list_trending(&state.pool).await?))
}

pub async fn top_manga(State(state): State<AppState>) -> Result<Json<Vec<crate::models::EntryWithGenres>>, ApiError> {
    Ok(Json(repo::list_top_manga(&state.pool).await?))
}

pub async fn get_entry(
    State(state): State<AppState>,
    Path(id): Path<i64>,
) -> Result<Json<crate::models::EntryWithGenres>, ApiError> {
    match repo::get_entry(&state.pool, id).await? {
        Some(entry) => Ok(Json(entry)),
        None => Err(ApiError::not_found()),
    }
}

pub async fn search(
    State(state): State<AppState>,
    Query(params): Query<SearchQuery>,
) -> Result<Json<Vec<crate::models::EntryWithGenres>>, ApiError> {
    let limit = params.limit.clamp(1, 50);
    let page = params.page.max(1);
    let offset = (page - 1) * limit;
    let kind = params.kind.as_deref();

    let entries = repo::search_entries(&state.pool, &params.q, kind, limit, offset).await?;
    Ok(Json(entries))
}

pub struct ApiError {
    status: StatusCode,
    message: String,
}

impl ApiError {
    fn not_found() -> Self {
        Self {
            status: StatusCode::NOT_FOUND,
            message: "entry not found".into(),
        }
    }
}

impl IntoResponse for ApiError {
    fn into_response(self) -> axum::response::Response {
        let body = serde_json::json!({
            "error": { "code": "catalog_error", "message": self.message }
        });
        (self.status, Json(body)).into_response()
    }
}

impl From<sqlx::Error> for ApiError {
    fn from(err: sqlx::Error) -> Self {
        tracing::error!("database error: {err}");
        Self {
            status: StatusCode::INTERNAL_SERVER_ERROR,
            message: "internal error".into(),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use axum::response::IntoResponse;

    #[tokio::test]
    async fn api_error_not_found_returns_404() {
        let err = ApiError::not_found();
        let response = err.into_response();
        assert_eq!(response.status(), StatusCode::NOT_FOUND);
    }
}
