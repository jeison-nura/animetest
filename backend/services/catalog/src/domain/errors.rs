#[derive(Debug)]
pub enum CatalogError {
    NotFound,
    InvalidInput(String),
    Persistence(sqlx::Error),
}

impl From<sqlx::Error> for CatalogError {
    fn from(value: sqlx::Error) -> Self {
        Self::Persistence(value)
    }
}
