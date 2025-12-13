"""Application Configuration Management.

This module provides centralized configuration management for the Network MatrixHub
backend using Pydantic settings. It handles environment variables, database connections,
CORS configuration, and application-level settings.

Author:
    Ruslan Magana (ruslanmv.com)

License:
    Apache 2.0
"""

from __future__ import annotations

import json
from functools import lru_cache
from typing import Any, List, Union

from pydantic import AliasChoices, Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings and configuration manager.

    This class uses Pydantic's BaseSettings to load and validate configuration
    from environment variables and .env files. It provides type-safe access to
    all application settings with sensible defaults.

    The settings are designed to be production-ready with proper defaults for
    database connectivity, CORS configuration, and application metadata.

    Attributes:
        APP_NAME: Application name displayed in logs and API responses.
        APP_ENV: Deployment environment (dev, staging, production).
        APP_DEBUG: Enable debug mode for detailed logging and error traces.
        DATABASE_URL: SQLAlchemy database connection string.
        BACKEND_CORS_ORIGINS: List of allowed CORS origins for API access.

    Example:
        >>> settings = get_settings()
        >>> print(settings.APP_NAME)
        'Network MatrixHub IO Backend'
        >>> print(settings.cors_origins)
        ['*']
    """

    # Application metadata
    APP_NAME: str = Field(
        default="Network MatrixHub IO Backend",
        description="Application name for logging and display",
    )
    APP_ENV: str = Field(
        default="dev",
        description="Application environment: dev, staging, or production",
    )
    APP_DEBUG: bool = Field(
        default=True,
        description="Enable debug mode with verbose logging",
    )

    # Database configuration
    DATABASE_URL: str = Field(
        default="sqlite+pysqlite:///./network_matrixhub.sqlite",
        validation_alias=AliasChoices("DATABASE_URL", "database_url"),
        description="SQLAlchemy database connection string",
    )

    # CORS configuration
    BACKEND_CORS_ORIGINS: Union[List[str], str] = Field(
        default_factory=lambda: ["*"],
        validation_alias=AliasChoices("BACKEND_CORS_ORIGINS", "CORS_ALLOW_ORIGINS"),
        description="Allowed CORS origins (comma-separated string or JSON list)",
    )

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
        validate_default=True,
    )

    @staticmethod
    def _coerce_list(value: Union[str, List[str], None]) -> List[str]:
        """Convert string or list to a normalized list of strings.

        This helper method handles various input formats for list-based configuration
        values, including comma-separated strings, JSON arrays, and Python lists.

        Args:
            value: Input value that can be a list, string, or None.

        Returns:
            List of strings with whitespace stripped.

        Example:
            >>> Settings._coerce_list("http://localhost:3000, http://example.com")
            ['http://localhost:3000', 'http://example.com']
            >>> Settings._coerce_list('["http://localhost:3000"]')
            ['http://localhost:3000']
        """
        if value is None:
            return []
        if isinstance(value, list):
            return value
        if isinstance(value, str):
            v = value.strip()
            if not v:
                return []
            if v.startswith("["):
                try:
                    return list(json.loads(v))
                except Exception:
                    return [x.strip() for x in v.strip("[]").split(",") if x.strip()]
            return [x.strip() for x in v.split(",") if x.strip()]
        return []

    @property
    def cors_origins(self) -> List[str]:
        """Get normalized list of CORS origins.

        Returns:
            List of allowed CORS origin URLs.

        Example:
            >>> settings = Settings()
            >>> origins = settings.cors_origins
            >>> assert isinstance(origins, list)
        """
        return self._coerce_list(self.BACKEND_CORS_ORIGINS)

    @field_validator("APP_ENV")
    @classmethod
    def validate_app_env(cls, v: str) -> str:
        """Validate that APP_ENV is one of the allowed values.

        Args:
            v: The environment value to validate.

        Returns:
            The validated environment value.

        Raises:
            ValueError: If the environment value is not recognized.
        """
        allowed = {"dev", "development", "staging", "prod", "production"}
        if v.lower() not in allowed:
            raise ValueError(
                f"APP_ENV must be one of {allowed}, got '{v}'. "
                "Using default 'dev'."
            )
        return v.lower()


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """Get cached application settings instance.

    This function uses LRU cache to ensure settings are loaded only once
    during the application lifetime, improving performance and consistency.

    Returns:
        Settings: Singleton instance of application settings.

    Example:
        >>> settings = get_settings()
        >>> assert settings.APP_NAME == "Network MatrixHub IO Backend"
    """
    return Settings()  # type: ignore[call-arg]


# Global settings instance for convenient access
settings = get_settings()
