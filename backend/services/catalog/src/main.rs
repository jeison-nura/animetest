mod adapters;
mod app;
mod config;
mod domain;

use std::sync::Arc;

use sqlx::postgres::PgPoolOptions;

use crate::adapters::http::{router, AppState};
use crate::adapters::postgres::PostgresCatalogRepo;
use crate::app::CatalogService;
use crate::config::Config;

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt()
        .with_env_filter(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "info,tower_http=warn".into()),
        )
        .init();

    let config = Config::from_env();
    config.validate().expect("invalid config");

    let pool = PgPoolOptions::new()
        .max_connections(10)
        .acquire_timeout(std::time::Duration::from_secs(10))
        .connect(&config.database_url)
        .await
        .expect("database connection failed");

    sqlx::migrate!("./migrations")
        .run(&pool)
        .await
        .expect("migrations failed");

    let state = AppState {
        service: CatalogService::new(Arc::new(PostgresCatalogRepo::new(pool))),
    };

    let address = format!("0.0.0.0:{}", config.port);
    tracing::info!("catalog listening on {address}");
    let listener = tokio::net::TcpListener::bind(&address)
        .await
        .expect("failed to bind");
    axum::serve(listener, router(state))
        .await
        .expect("server failed");
}
