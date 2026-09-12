use std::env;

#[derive(Debug)]
pub struct ConfigError(pub String);

#[derive(Clone)]
pub struct Config {
    pub port: u16,
    pub database_url: String,
}

impl Config {
    pub fn from_env() -> Self {
        Self {
            port: env::var("PORT")
                .ok()
                .and_then(|p| p.parse().ok())
                .unwrap_or(8082),
            database_url: env::var("DATABASE_URL")
                .unwrap_or_else(|_| "postgres://mnglib:mnglib_dev@localhost:5432/catalog".into()),
        }
    }

    pub fn validate(&self) -> Result<(), ConfigError> {
        if self.port == 0 {
            return Err(ConfigError("PORT must be positive".into()));
        }
        if self.database_url.is_empty() {
            return Err(ConfigError("DATABASE_URL is required".into()));
        }
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn validate_rejects_zero_port() {
        let cfg = Config {
            port: 0,
            database_url: "postgres://localhost/test".into(),
        };
        assert!(cfg.validate().is_err());
    }

    #[test]
    fn validate_rejects_empty_database_url() {
        let cfg = Config {
            port: 8082,
            database_url: "".into(),
        };
        assert!(cfg.validate().is_err());
    }

    #[test]
    fn validate_accepts_valid_config() {
        let cfg = Config {
            port: 8082,
            database_url: "postgres://localhost/catalog".into(),
        };
        assert!(cfg.validate().is_ok());
    }
}
