use axum::{routing::get, Router};

use crate::adapters::http::{handlers, AppState};

pub fn router(state: AppState) -> Router {
    Router::new()
        .route("/catalog/hero-slides", get(handlers::hero_slides))
        .route("/catalog/top-picks", get(handlers::top_picks))
        .route("/catalog/search", get(handlers::search))
        .route("/catalog/trending", get(handlers::trending))
        .route("/catalog/top-manga", get(handlers::top_manga))
        .route("/catalog/entries/{id}", get(handlers::entry))
        .route("/healthz", get(|| async { "ok" }))
        .with_state(state)
}
