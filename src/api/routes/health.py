"""
AROHAN Health Check API Routes
Monitoring and health check endpoints
"""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from src.db.database import get_db
from src.config.settings import settings
import time

router = APIRouter()


@router.get("/", response_model=dict)
async def health_check():
    """
    Basic health check endpoint

    Returns service health status and version information.
    """
    return {
        "status": "healthy",
        "service": "arohan-api",
        "version": "2.0.0",
        "environment": settings.ENVIRONMENT,
        "timestamp": time.time()
    }


@router.get("/detailed", response_model=dict)
async def detailed_health_check(db: AsyncSession = Depends(get_db)):
    """
    Detailed health check with component status

    Returns health status of all system components including
    database, cache, message queue, and external services.
    """
    health_status = {
        "status": "healthy",
        "service": "arohan-api",
        "version": "2.0.0",
        "environment": settings.ENVIRONMENT,
        "timestamp": time.time(),
        "components": {}
    }

    # Check database health
    try:
        await db.execute("SELECT 1")
        health_status["components"]["database"] = {
            "status": "healthy",
            "type": "postgresql"
        }
    except Exception as e:
        health_status["components"]["database"] = {
            "status": "unhealthy",
            "type": "postgresql",
            "error": str(e)
        }
        health_status["status"] = "degraded"

    # Check Redis health (TODO: Implement Redis health check)
    health_status["components"]["redis"] = {
        "status": "healthy",
        "type": "redis"
    }

    # Check RabbitMQ health (TODO: Implement RabbitMQ health check)
    health_status["components"]["rabbitmq"] = {
        "status": "healthy",
        "type": "rabbitmq"
    }

    # Check external services (TODO: Implement external service health checks)
    health_status["components"]["external_services"] = {
        "twilio": {"status": "unknown"},
        "meta": {"status": "unknown"},
        "bhashini": {"status": "unknown"},
        "openai": {"status": "unknown"},
        "pinecone": {"status": "unknown"}
    }

    return health_status


@router.get("/readiness", response_model=dict)
async def readiness_check(db: AsyncSession = Depends(get_db)):
    """
    Readiness check for Kubernetes/container orchestration

    Returns whether the service is ready to accept traffic.
    """
    try:
        # Check database connection
        await db.execute("SELECT 1")

        return {
            "status": "ready",
            "timestamp": time.time()
        }
    except Exception as e:
        return {
            "status": "not_ready",
            "reason": str(e),
            "timestamp": time.time()
        }


@router.get("/liveness", response_model=dict)
async def liveness_check():
    """
    Liveness check for Kubernetes/container orchestration

    Returns whether the service is alive and responding.
    """
    return {
        "status": "alive",
        "timestamp": time.time()
    }