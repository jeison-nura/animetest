use crate::domain::{CatalogEntry, CatalogError, EntryKind, HeroSlide, Pagination};
use futures_util::future::BoxFuture;

pub trait CatalogRepository: Send + Sync {
    fn top_anime(&self, limit: i64) -> BoxFuture<'_, Result<Vec<CatalogEntry>, CatalogError>>;
    fn trending(&self, limit: i64) -> BoxFuture<'_, Result<Vec<CatalogEntry>, CatalogError>>;
    fn top_manga(&self, limit: i64) -> BoxFuture<'_, Result<Vec<CatalogEntry>, CatalogError>>;
    fn entry(&self, id: i64) -> BoxFuture<'_, Result<Option<CatalogEntry>, CatalogError>>;
    fn search<'a>(
        &'a self,
        query: &'a str,
        kind: Option<EntryKind>,
        pagination: Pagination,
    ) -> BoxFuture<'a, Result<Vec<CatalogEntry>, CatalogError>>;
    fn hero_slides(&self) -> BoxFuture<'_, Result<Vec<HeroSlide>, CatalogError>>;
}

#[derive(Clone)]
pub struct CatalogService {
    repository: std::sync::Arc<dyn CatalogRepository>,
}

impl CatalogService {
    pub fn new(repository: std::sync::Arc<dyn CatalogRepository>) -> Self {
        Self { repository }
    }

    pub async fn top_picks(&self) -> Result<Vec<CatalogEntry>, CatalogError> {
        self.repository.top_anime(8).await
    }

    pub async fn trending(&self) -> Result<Vec<CatalogEntry>, CatalogError> {
        self.repository.trending(6).await
    }

    pub async fn top_manga(&self) -> Result<Vec<CatalogEntry>, CatalogError> {
        self.repository.top_manga(6).await
    }

    pub async fn entry(&self, id: i64) -> Result<CatalogEntry, CatalogError> {
        self.repository
            .entry(id)
            .await?
            .ok_or(CatalogError::NotFound)
    }

    pub async fn search(
        &self,
        query: &str,
        kind: Option<EntryKind>,
        pagination: Pagination,
    ) -> Result<Vec<CatalogEntry>, CatalogError> {
        if query.trim().is_empty() {
            return Err(CatalogError::InvalidInput("q is required".into()));
        }

        self.repository.search(query.trim(), kind, pagination).await
    }

    pub async fn hero_slides(&self) -> Result<Vec<HeroSlide>, CatalogError> {
        self.repository.hero_slides().await
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::sync::Arc;

    #[derive(Default)]
    struct MemoryRepo;

    impl CatalogRepository for MemoryRepo {
        fn top_anime(&self, _limit: i64) -> BoxFuture<'_, Result<Vec<CatalogEntry>, CatalogError>> {
            Box::pin(std::future::ready(Ok(Vec::new())))
        }

        fn trending(&self, _limit: i64) -> BoxFuture<'_, Result<Vec<CatalogEntry>, CatalogError>> {
            Box::pin(std::future::ready(Ok(Vec::new())))
        }

        fn top_manga(&self, _limit: i64) -> BoxFuture<'_, Result<Vec<CatalogEntry>, CatalogError>> {
            Box::pin(std::future::ready(Ok(Vec::new())))
        }

        fn entry(&self, _id: i64) -> BoxFuture<'_, Result<Option<CatalogEntry>, CatalogError>> {
            Box::pin(std::future::ready(Ok(None)))
        }

        fn search(
            &self,
            query: &str,
            _kind: Option<EntryKind>,
            _pagination: Pagination,
        ) -> BoxFuture<'_, Result<Vec<CatalogEntry>, CatalogError>> {
            assert!(!query.trim().is_empty());
            Box::pin(std::future::ready(Ok(Vec::new())))
        }

        fn hero_slides(&self) -> BoxFuture<'_, Result<Vec<HeroSlide>, CatalogError>> {
            Box::pin(std::future::ready(Ok(Vec::new())))
        }
    }

    #[tokio::test]
    async fn search_rejects_empty_query_without_touching_repository() {
        let service = CatalogService::new(Arc::new(MemoryRepo));
        let result = service
            .search("  ", None, Pagination::new(1, 10))
            .await
            .unwrap_err();

        assert!(matches!(result, CatalogError::InvalidInput(_)));
    }
}
