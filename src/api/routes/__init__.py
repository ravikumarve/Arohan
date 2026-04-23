"""
AROHAN API Routes
Main API router including all endpoint modules
"""

from fastapi import APIRouter
from src.api.routes import (
    campaigns,
    candidates,
    requisitions,
    agents,
    health
)

# Create main API router
api_router = APIRouter()

# Include route modules
api_router.include_router(campaigns.router, prefix="/campaigns", tags=["Campaigns"])
api_router.include_router(candidates.router, prefix="/candidates", tags=["Candidates"])
api_router.include_router(requisitions.router, prefix="/requisitions", tags=["Requisitions"])
api_router.include_router(agents.router, prefix="/agents", tags=["Agents"])
api_router.include_router(health.router, prefix="/health", tags=["Health"])