import json
from typing import Annotated, Any, List, Union
from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=False,
    )

    PROJECT_NAME: str = "MIB Digital Identity System"
    API_V1_STR: str = "/api/v1"
    VERSION: str = "1.0.0"

    # Environment
    ENVIRONMENT: str = Field(default="development", description="development, testing, or production")
    DEBUG: bool = Field(default=False)
    APP_DOMAIN: str = Field(default="mib.gameserver1.cc")

    # Security
    SECRET_KEY: str = Field(
        default="default-insecure-secret-key-change-in-production-min-32-chars",
        description="Secret key for JWT and HMAC tokens",
    )
    ALGORITHM: str = Field(default="HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(default=480)

    # Database
    DATABASE_URL: str = Field(
        default="postgresql+asyncpg://mib_user:replace_with_strong_password_in_production@db:5432/mib_db",
        description="Async database connection string",
    )

    # CORS
    CORS_ORIGINS: List[str] = Field(
        default_factory=lambda: [
            "https://mib.gameserver1.cc",
            "http://localhost:5173",
            "http://localhost:3000",
            "http://localhost:80",
        ]
    )

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str):
            v_stripped = v.strip()
            if v_stripped.startswith("[") and v_stripped.endswith("]"):
                try:
                    parsed = json.loads(v_stripped)
                    if isinstance(parsed, list):
                        return [str(item).strip() for item in parsed]
                except Exception:
                    pass
            return [i.strip() for i in v.split(",") if i.strip()]
        elif isinstance(v, list):
            return [str(i).strip() for i in v]
        return []

    # File uploads
    UPLOAD_DIR: str = Field(default="/app/uploads")
    MAX_UPLOAD_SIZE_BYTES: int = Field(default=5242880)  # 5MB


settings = Settings()
