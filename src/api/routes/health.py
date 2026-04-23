"""
AROHAN Health Check API Routes
Monitoring and health check endpoints with comprehensive dependency status
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from src.db.database import get_db
from src.config.settings import settings
import time
import asyncio
import httpx
from typing import Dict, Any

router = APIRouter()


async def check_redis_health() -> Dict[str, Any]:
    """Check Redis health"""
    try:
        import redis.asyncio as redis
        redis_client = redis.from_url(settings.REDIS_URL)
        await redis_client.ping()
        await redis_client.close()
        return {
            "status": "healthy",
            "type": "redis",
            "response_time_ms": 0
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "type": "redis",
            "error": str(e)
        }


async def check_rabbitmq_health() -> Dict[str, Any]:
    """Check RabbitMQ health"""
    try:
        import aio_pika
        connection = await aio_pika.connect_robust(settings.RABBITMQ_URL)
        await connection.close()
        return {
            "status": "healthy",
            "type": "rabbitmq",
            "response_time_ms": 0
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "type": "rabbitmq",
            "error": str(e)
        }


async def check_external_service_health(service_name: str, base_url: str, health_path: str = "/") -> Dict[str, Any]:
    """Check external service health"""
    try:
        start_time = time.time()
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.get(f"{base_url}{health_path}")
            response_time_ms = (time.time() - start_time) * 1000
            
            if response.status_code < 400:
                return {
                    "status": "healthy",
                    "response_time_ms": round(response_time_ms, 2)
                }
            else:
                return {
                    "status": "unhealthy",
                    "http_status": response.status_code,
                    "response_time_ms": round(response_time_ms, 2)
                }
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e)
        }


async def check_database_health(db: AsyncSession) -> Dict[str, Any]:
    """Check database health with detailed metrics"""
    try:
        start_time = time.time()
        result = await db.execute(text("SELECT 1"))
        await result.fetchone()
        response_time_ms = (time.time() - start_time) * 1000
        
        # Get connection pool info
        pool = db.sync_engine.pool
        pool_status = {
            "size": pool.size(),
            "checked_in": pool.checkedin(),
            "checked_out": pool.checkedout(),
            "overflow": pool.overflow(),
            "max_overflow": pool.max_overflow
        }
        
        return {
            "status": "healthy",
            "type": "postgresql",
            "response_time_ms": round(response_time_ms, 2),
            "pool": pool_status
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "type": "postgresql",
            "error": str(e)
        }


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
    start_time = time.time()
    health_status = {
        "status": "healthy",
        "service": "arohan-api",
        "version": "2.0.0",
        "environment": settings.ENVIRONMENT,
        "timestamp": time.time(),
        "components": {}
    }

    # Check database health
    db_health = await check_database_health(db)
    health_status["components"]["database"] = db_health
    if db_health["status"] != "healthy":
        health_status["status"] = "degraded"

    # Check Redis health
    redis_health = await check_redis_health()
    health_status["components"]["redis"] = redis_health
    if redis_health["status"] != "healthy":
        health_status["status"] = "degraded"

    # Check RabbitMQ health
    rabbitmq_health = await check_rabbitmq_health()
    health_status["components"]["rabbitmq"] = rabbitmq_health
    if rabbitmq_health["status"] != "healthy":
        health_status["status"] = "degraded"

    # Check external services
    external_services = {}
    
    # Twilio health check
    try:
        twilio_health = await check_external_service_health(
            "twilio",
            "https://api.twilio.com",
            "/2010-04-01"
        )
        external_services["twilio"] = twilio_health
    except Exception as e:
        external_services["twilio"] = {"status": "unhealthy", "error": str(e)}
    
    # Meta (WhatsApp) health check
    try:
        meta_health = await check_external_service_health(
            "meta",
            "https://graph.facebook.com",
            "/v17.0"
        )
        external_services["meta"] = meta_health
    except Exception as e:
        external_services["meta"] = {"status": "unhealthy", "error": str(e)}
    
    # Bhashini health check
    external_services["bhashini"] = {"status": "unknown", "note": "No public health endpoint"}
    
    # OpenAI health check
    try:
        openai_health = await check_external_service_health(
            "openai",
            "https://api.openai.com",
            "/v1/models"
        )
        external_services["openai"] = openai_health
    except Exception as e:
        external_services["openai"] = {"status": "unhealthy", "error": str(e)}
    
    # Pinecone health check
    external_services["pinecone"] = {"status": "unknown", "note": "No public health endpoint"}
    
    health_status["components"]["external_services"] = external_services

    # Calculate overall response time
    total_time = (time.time() - start_time) * 1000
    health_status["response_time_ms"] = round(total_time, 2)

    return health_status


@router.get("/readiness", response_model=dict)
async def readiness_check(db: AsyncSession = Depends(get_db)):
    """
    Readiness check for Kubernetes/container orchestration

    Returns whether the service is ready to accept traffic.
    Checks critical dependencies: database, Redis, RabbitMQ.
    """
    try:
        # Check database connection
        db_health = await check_database_health(db)
        if db_health["status"] != "healthy":
            return {
                "status": "not_ready",
                "reason": "database_unhealthy",
                "timestamp": time.time()
            }

        # Check Redis connection
        redis_health = await check_redis_health()
        if redis_health["status"] != "healthy":
            return {
                "status": "not_ready",
                "reason": "redis_unhealthy",
                "timestamp": time.time()
            }

        # Check RabbitMQ connection
        rabbitmq_health = await check_rabbitmq_health()
        if rabbitmq_health["status"] != "healthy":
            return {
                "status": "not_ready",
                "reason": "rabbitmq_unhealthy",
                "timestamp": time.time()
            }

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


@router.get("/dependencies", response_model=dict)
async def dependencies_check(db: AsyncSession = Depends(get_db)):
    """
    Comprehensive dependency health check

    Returns detailed status of all dependencies with performance metrics.
    """
    start_time = time.time()
    
    dependencies = {
        "timestamp": time.time(),
        "dependencies": {}
    }

    # Check all dependencies concurrently
    check_tasks = {
        "database": check_database_health(db),
        "redis": check_redis_health(),
        "rabbitmq": check_rabbitmq_health()
    }
    
    # Execute all checks
    results = await asyncio.gather(*check_tasks.values(), return_exceptions=True)
    
    for dependency_name, result in zip(check_tasks.keys(), results):
        if isinstance(result, Exception):
            dependencies["dependencies"][dependency_name] = {
                "status": "unhealthy",
                "error": str(result)
            }
        else:
            dependencies["dependencies"][dependency_name] = result

    # Calculate overall health
    healthy_count = sum(
        1 for dep in dependencies["dependencies"].values()
        if dep.get("status") == "healthy"
    )
    total_count = len(dependencies["dependencies"])
    
    dependencies["overall_status"] = "healthy" if healthy_count == total_count else "degraded"
    dependencies["healthy_dependencies"] = healthy_count
    dependencies["total_dependencies"] = total_count
    dependencies["response_time_ms"] = round((time.time() - start_time) * 1000, 2)

    return dependencies