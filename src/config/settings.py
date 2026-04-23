"""
AROHAN Configuration Settings
Environment-based configuration management
"""

from pydantic_settings import BaseSettings
from pydantic import Field, validator
from typing import List, Optional
import os


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""

    # Application
    ENVIRONMENT: str = Field(default="development", description="Application environment")
    DEBUG: bool = Field(default=True, description="Debug mode")
    LOG_LEVEL: str = Field(default="INFO", description="Logging level")
    API_HOST: str = Field(default="0.0.0.0", description="API host")
    API_PORT: int = Field(default=8000, description="API port")
    WORKERS: int = Field(default=4, description="Number of worker processes")

    # Database
    POSTGRES_USER: str = Field(default="arohan", description="PostgreSQL username")
    POSTGRES_PASSWORD: str = Field(default="arohan_dev", description="PostgreSQL password")
    POSTGRES_DB: str = Field(default="arohan", description="PostgreSQL database name")
    DATABASE_URL: str = Field(
        default="postgresql+asyncpg://arohan:arohan_dev@localhost:5432/arohan",
        description="Database connection URL"
    )

    # Redis
    REDIS_PASSWORD: str = Field(default="redis_dev", description="Redis password")
    REDIS_URL: str = Field(
        default="redis://:redis_dev@localhost:6379/0",
        description="Redis connection URL"
    )

    # RabbitMQ
    RABBITMQ_USER: str = Field(default="arohan", description="RabbitMQ username")
    RABBITMQ_PASSWORD: str = Field(default="rabbitmq_dev", description="RabbitMQ password")
    RABBITMQ_VHOST: str = Field(default="/arohan", description="RabbitMQ virtual host")
    RABBITMQ_URL: str = Field(
        default="amqp://arohan:rabbitmq_dev@localhost:5672//arohan",
        description="RabbitMQ connection URL"
    )

    # JWT
    JWT_SECRET_KEY: str = Field(default="dev_secret_change_in_production", description="JWT secret key")
    JWT_ALGORITHM: str = Field(default="RS256", description="JWT algorithm")
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(default=30, description="JWT access token expiration")
    JWT_REFRESH_TOKEN_EXPIRE_DAYS: int = Field(default=7, description="JWT refresh token expiration")

    # External APIs - Twilio
    TWILIO_ACCOUNT_SID: Optional[str] = Field(default=None, description="Twilio account SID")
    TWILIO_AUTH_TOKEN: Optional[str] = Field(default=None, description="Twilio auth token")
    TWILIO_PHONE_NUMBER: Optional[str] = Field(default=None, description="Twilio phone number")

    # External APIs - Meta (WhatsApp)
    META_APP_ID: Optional[str] = Field(default=None, description="Meta app ID")
    META_APP_SECRET: Optional[str] = Field(default=None, description="Meta app secret")
    META_PHONE_NUMBER_ID: Optional[str] = Field(default=None, description="Meta phone number ID")
    META_ACCESS_TOKEN: Optional[str] = Field(default=None, description="Meta access token")
    META_WEBHOOK_VERIFY_TOKEN: Optional[str] = Field(default=None, description="Meta webhook verify token")

    # External APIs - Bhashini
    BHASHINI_API_KEY: Optional[str] = Field(default=None, description="Bhashini API key")
    BHASHINI_USER_ID: Optional[str] = Field(default=None, description="Bhashini user ID")

    # External APIs - OpenAI
    OPENAI_API_KEY: Optional[str] = Field(default=None, description="OpenAI API key")

    # External APIs - Pinecone
    PINECONE_API_KEY: Optional[str] = Field(default=None, description="Pinecone API key")
    PINECONE_INDEX_NAME: str = Field(default="arohan-candidates", description="Pinecone index name")
    PINECONE_ENVIRONMENT: str = Field(default="us-east-1-aws", description="Pinecone environment")

    # Celery
    CELERY_BROKER_URL: str = Field(
        default="amqp://arohan:rabbitmq_dev@localhost:5672//arohan",
        description="Celery broker URL"
    )
    CELERY_RESULT_BACKEND: str = Field(
        default="redis://:redis_dev@localhost:6379/0",
        description="Celery result backend"
    )
    CELERY_TASK_ACKS_LATE: bool = Field(default=True, description="Celery task acks late")
    CELERY_WORKER_PREFETCH_MULTIPLIER: int = Field(default=1, description="Celery worker prefetch multiplier")
    CELERY_WORKER_CONCURRENCY: int = Field(default=8, description="Celery worker concurrency")

    # Audio Processing
    AUDIO_MAX_DURATION_SECONDS: int = Field(default=300, description="Maximum audio duration in seconds")
    AUDIO_SAMPLE_RATE: int = Field(default=16000, description="Audio sample rate")
    AUDIO_CHANNELS: int = Field(default=1, description="Audio channels")
    SUPPORTED_AUDIO_FORMATS: List[str] = Field(
        default=["wav", "mp3", "m4a", "ogg"],
        description="Supported audio formats"
    )

    # Performance
    CACHE_TTL_SECONDS: int = Field(default=3600, description="Cache TTL in seconds")
    DB_POOL_SIZE: int = Field(default=20, description="Database pool size")
    DB_MAX_OVERFLOW: int = Field(default=10, description="Database max overflow")
    REQUEST_TIMEOUT_SECONDS: int = Field(default=30, description="Request timeout in seconds")

    # Security
    CORS_ORIGINS: List[str] = Field(
        default=["http://localhost:3000", "http://localhost:8000"],
        description="CORS allowed origins"
    )
    ALLOWED_HOSTS: List[str] = Field(
        default=["localhost", "127.0.0.1"],
        description="Allowed hosts"
    )
    RATE_LIMIT_ENABLED: bool = Field(default=True, description="Rate limiting enabled")
    RATE_LIMIT_PER_MINUTE: int = Field(default=60, description="Rate limit per minute")

    # Monitoring
    PROMETHEUS_ENABLED: bool = Field(default=True, description="Prometheus enabled")
    PROMETHEUS_PORT: int = Field(default=9090, description="Prometheus port")
    HEALTH_CHECK_INTERVAL_SECONDS: int = Field(default=30, description="Health check interval")

    @validator("CORS_ORIGINS", "ALLOWED_HOSTS", pre=True)
    def parse_list_field(cls, v):
        """Parse comma-separated list fields"""
        if isinstance(v, str):
            return [item.strip() for item in v.split(",")]
        return v

    @validator("SUPPORTED_AUDIO_FORMATS", pre=True)
    def parse_audio_formats(cls, v):
        """Parse supported audio formats"""
        if isinstance(v, str):
            return [item.strip() for item in v.split(",")]
        return v

    class Config:
        env_file = "config/.env"
        env_file_encoding = "utf-8"
        case_sensitive = True
        extra = "ignore"  # Ignore extra fields from .env file


# Create global settings instance
settings = Settings()