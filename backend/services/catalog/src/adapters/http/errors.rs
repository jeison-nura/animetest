use axum::{http::StatusCode, response::IntoResponse, Json};

use crate::domain::CatalogError;

pub struct ApiError {
    status: StatusCode,
    message: String,
}

impl From<CatalogError> for ApiError {
    fn from(error: CatalogError) -> Self {
        match error {
            CatalogError::NotFound => Self {
                status: StatusCode::NOT_FOUND,
                message: "entry not found".into(),
            },
            CatalogError::InvalidInput(message) => Self {
                status: StatusCode::UNPROCESSABLE_ENTITY,
                message,
            },
            CatalogError::Persistence(error) => {
                tracing::error!("database error: {error}");
                Self {
                    status: StatusCode::INTERNAL_SERVER_ERROR,
                    message: "internal error".into(),
                }
            }
        }
    }
}

impl IntoResponse for ApiError {
    fn into_response(self) -> axum::response::Response {
        (
            self.status,
            Json(serde_json::json!({
                "error": {
                    "code": "catalog_error",
                    "message": self.message,
                }
            })),
        )
            .into_response()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use axum::response::IntoResponse;

    #[tokio::test]
    async fn not_found_maps_to_404() {
        let response = ApiError::from(CatalogError::NotFound).into_response();
        assert_eq!(response.status(), StatusCode::NOT_FOUND);
    }

    #[tokio::test]
    async fn invalid_input_maps_to_422() {
        let response = ApiError::from(CatalogError::InvalidInput("bad".into())).into_response();
        assert_eq!(response.status(), StatusCode::UNPROCESSABLE_ENTITY);
    }
}
