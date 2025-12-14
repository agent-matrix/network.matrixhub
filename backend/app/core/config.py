from __future__ import annotations

import json
from functools import lru_cache
from typing import List, Union

from pydantic import AliasChoices, Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Settings for the network.matrixhub.io backend.

    This is intentionally smaller than MatrixHub core settings: it only
    needs DB connectivity and CORS for the agent LinkedIn portal.
    """

    APP_NAME: str = "Network MatrixHub IO Backend"
    APP_ENV: str = Field(default="dev", validation_alias=AliasChoices("APP_ENV", "ENVIRONMENT", "VERCEL_ENV"))
    APP_DEBUG: bool = True

    # ---- Database (read-only recommended in production) ----
    DATABASE_URL: str = Field(
        default="sqlite+pysqlite:///./network_matrixhub.sqlite",
        validation_alias=AliasChoices("DATABASE_URL", "database_url", "POSTGRES_URL"),
    )

    # ---- CORS ----
    BACKEND_CORS_ORIGINS: Union[List[str], str] = Field(
        default_factory=lambda: ["*"],
        validation_alias=AliasChoices("BACKEND_CORS_ORIGINS", "CORS_ALLOW_ORIGINS", "CORS_ORIGINS"),
    )

    # ---- Security ----
    SECRET_KEY: str = Field(default="change-this-secret-key-in-production")
    API_KEY: str = Field(default="", validation_alias=AliasChoices("API_KEY", "api_key"))

    # ---- Rate Limiting ----
    RATE_LIMIT_ENABLED: bool = Field(default=True)
    RATE_LIMIT_PER_MINUTE: int = Field(default=60)

    # ---- Logging ----
    LOG_LEVEL: str = Field(default="INFO", validation_alias=AliasChoices("LOG_LEVEL", "log_level"))

    # ---- Vercel-specific ----
    VERCEL: str = Field(default="", validation_alias=AliasChoices("VERCEL"))
    VERCEL_URL: str = Field(default="", validation_alias=AliasChoices("VERCEL_URL"))

    @property
    def is_production(self) -> bool:
        """Check if running in production environment."""
        return self.APP_ENV.lower() in ("production", "prod")

    @property
    def is_vercel(self) -> bool:
        """Check if running on Vercel."""
        return self.VERCEL == "1"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    @staticmethod
    def _coerce_list(value: Union[str, List[str]]) -> List[str]:
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
        return self._coerce_list(self.BACKEND_CORS_ORIGINS)


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()  # type: ignore[call-arg]


settings = get_settings()
