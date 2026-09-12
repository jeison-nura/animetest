mod config;
mod handlers;
mod models;
mod repo;

use axum::{routing::get, Router};
use sqlx::postgres::PgPoolOptions;

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt()
        .with_env_filter(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "info,tower_http=warn".into()),
        )
        .init();

    let cfg = config::Config::from_env();
    cfg.validate().expect("invalid config");

    let pool = PgPoolOptions::new()
        .max_connections(10)
        .acquire_timeout(std::time::Duration::from_secs(10))
        .connect(&cfg.database_url)
        .await
        .expect("database connection failed");

    sqlx::migrate!("./migrations")
        .run(&pool)
        .await
        .expect("migrations failed");

    let state = handlers::AppState { pool };

    let app = Router::new()
        .route("/catalog/hero-slides", get(handlers::hero_slides))
        .route("/catalog/top-picks", get(handlers::top_picks))
        .route("/catalog/search", get(handlers::search))
        .route("/catalog/trending", get(handlers::trending))
        .route("/catalog/top-manga", get(handlers::top_manga))
        .route("/catalog/entries/{id}", get(handlers::get_entry))
        .route("/healthz", get(|| async { "ok" }))
        .with_state(state);

    let addr = format!("0.0.0.0:{}", cfg.port);
    tracing::info!("catalog listening on {addr}");

    let listener = tokio::net::TcpListener::bind(&addr).await.expect("bind");
    axum::serve(listener, app).await.expect("serve");
}
