"""
AROHAN - AI-Powered Voice Screening System
Main FastAPI Application Entry Point
"""

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import structlog

from src.config.settings import settings
from src.db.database import engine, Base
from src.api.routes import api_router
from src.api.routes.auth import router as auth_router
from src.utils.logging import setup_logging, LoggingMiddleware
from src.utils.metrics import setup_metrics
from src.security.middleware import create_security_middleware

# Configure structured logging
setup_logging()
logger = structlog.get_logger()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    # Startup
    logger.info("Starting AROHAN API server")
    logger.info(f"Environment: {settings.ENVIRONMENT}")
    logger.info(f"Debug mode: {settings.DEBUG}")

    # Setup metrics
    setup_metrics(app)
    logger.info("Prometheus metrics initialized")

    # Create database tables
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        logger.info("Database tables created successfully")
    except Exception as e:
        logger.error(f"Failed to create database tables: {e}")

    yield

    # Shutdown
    logger.info("Shutting down AROHAN API server")


# Create FastAPI application
app = FastAPI(
    title="AROHAN API",
    description="AI-Powered Voice Screening System for Blue-Collar Recruitment",
    version="2.0.0",
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
    lifespan=lifespan
)

# Add logging middleware for correlation IDs
app.add_middleware(LoggingMiddleware)


# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Global exception handler for unhandled errors"""
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "Internal server error",
            "message": "An unexpected error occurred",
            "detail": str(exc) if settings.DEBUG else None
        }
    )


# Health check endpoint
@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint for monitoring"""
    return {
        "status": "healthy",
        "service": "arohan-api",
        "version": "2.0.0",
        "environment": settings.ENVIRONMENT
    }


# Include API routes
app.include_router(auth_router, prefix="/api/v1")
app.include_router(api_router, prefix="/api/v1")


# Root endpoint
@app.get("/", tags=["Root"])
async def root():
    """Root endpoint with API information"""
    return {
        "name": "AROHAN API",
        "version": "2.0.0",
        "description": "AI-Powered Voice Screening System for Blue-Collar Recruitment",
        "documentation": "/docs" if settings.DEBUG else "Documentation disabled in production",
        "health": "/health",
        "metrics": "/metrics"
    }


# Apply security middleware (must be applied last)
app = create_security_middleware(
    app,
    enable_security_headers=True,
    enable_rate_limiting=True,
    enable_request_validation=True,
    enable_input_sanitization=True,
    enable_cors=True,
    enable_https_redirect=False,
    enable_trusted_host=False,
)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "src.main:app",
        host=settings.API_HOST,
        port=settings.API_PORT,
        workers=settings.WORKERS,
        reload=settings.DEBUG
    )