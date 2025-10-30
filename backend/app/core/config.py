"""
Configuration settings for THOTH application
"""
from typing import List, Optional, Union
from pydantic_settings import BaseSettings
from pydantic import Field, field_validator, ValidationError
import os
import secrets


class Settings(BaseSettings):
    """Application settings"""

    # Project Info
    PROJECT_NAME: str = "THOTH API"
    VERSION: str = "1.0.0"
    APP_ENV: str = Field(default="development", env="APP_ENV")
    DEBUG: bool = Field(default=True, env="DEBUG")

    # API Settings
    API_V1_PREFIX: str = "/api/v1"
    SECRET_KEY: str = Field(default="", env="SECRET_KEY")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    @field_validator('SECRET_KEY')
    @classmethod
    def validate_secret_key(cls, v: str, info) -> str:
        """Validate SECRET_KEY is strong enough"""
        # Get environment info
        data = info.data if info.data else {}
        is_dev = data.get('APP_ENV') == 'development' or data.get('DEBUG') is True

        # If empty, handle based on environment
        if not v or v == "":
            if is_dev:
                # Generate a random key for development
                print("⚠️  WARNING: No SECRET_KEY provided. Generating random key for development.")
                return secrets.token_urlsafe(32)
            raise ValueError(
                "SECRET_KEY must be set in production. "
                "Generate one with: python -c 'import secrets; print(secrets.token_urlsafe(32))'"
            )

        # Check if it's the default weak key
        weak_keys = [
            "dev-secret-key-change-in-production",
            "your-secret-key-change-in-production",
            "change-me",
            "secret",
        ]
        if v.lower() in weak_keys:
            if not is_dev:
                raise ValueError(
                    "Cannot use default/weak SECRET_KEY in production. "
                    "Generate a strong key with: python -c 'import secrets; print(secrets.token_urlsafe(32))'"
                )
            # In dev, warn but allow
            print(f"⚠️  WARNING: Using weak SECRET_KEY '{v}'. Generating secure key for development.")
            return secrets.token_urlsafe(32)

        # Validate minimum length
        if len(v) < 32:
            if not is_dev:
                raise ValueError("SECRET_KEY must be at least 32 characters long in production")
            print(f"⚠️  WARNING: SECRET_KEY is too short ({len(v)} chars). Should be at least 32.")

        return v

    # CORS
    cors_origins_str: str = Field(
        default="http://localhost:3000,http://localhost",
        env="CORS_ORIGINS"
    )
    allowed_hosts_str: str = Field(
        default="localhost,127.0.0.1",
        env="ALLOWED_HOSTS"
    )

    @property
    def CORS_ORIGINS(self) -> List[str]:
        """Get CORS origins as list"""
        if isinstance(self.cors_origins_str, str):
            return [origin.strip() for origin in self.cors_origins_str.split(",") if origin.strip()]
        return [self.cors_origins_str]

    @property
    def ALLOWED_HOSTS(self) -> List[str]:
        """Get allowed hosts as list"""
        if isinstance(self.allowed_hosts_str, str):
            return [host.strip() for host in self.allowed_hosts_str.split(",") if host.strip()]
        return [self.allowed_hosts_str]

    # Database
    DATABASE_URL: str = Field(..., env="DATABASE_URL")

    # Redis
    REDIS_URL: str = Field(..., env="REDIS_URL")

    # Qdrant Vector Database
    QDRANT_URL: str = Field(..., env="QDRANT_URL")
    QDRANT_API_KEY: Optional[str] = Field(default=None, env="QDRANT_API_KEY")
    QDRANT_COLLECTION_NAME: str = "thoth_documents"

    # DeepSeek API
    DEEPSEEK_API_KEY: str = Field(..., env="DEEPSEEK_API_KEY")
    DEEPSEEK_API_BASE: str = "https://api.deepseek.com/v1"
    DEEPSEEK_MODEL: str = "deepseek-chat"
    DEEPSEEK_REASONING_MODEL: str = "deepseek-reasoner"

    # Embeddings
    EMBEDDING_MODEL: str = "BAAI/bge-m3"
    EMBEDDING_DIMENSION: int = 1024

    # File Upload
    MAX_UPLOAD_SIZE: int = 10 * 1024 * 1024  # 10 MB
    ALLOWED_EXTENSIONS: List[str] = [".txt", ".docx", ".pdf", ".md"]
    UPLOAD_DIR: str = "./uploads"

    # Celery
    CELERY_BROKER_URL: str = Field(default="", env="REDIS_URL")
    CELERY_RESULT_BACKEND: str = Field(default="", env="REDIS_URL")

    # RAG Settings
    RAG_CHUNK_SIZE: int = 512
    RAG_CHUNK_OVERLAP: int = 50
    RAG_TOP_K: int = 5

    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 60

    # Logging
    LOG_LEVEL: str = Field(default="INFO", env="LOG_LEVEL")

    class Config:
        env_file = ".env"
        case_sensitive = True


# Create settings instance
settings = Settings()
