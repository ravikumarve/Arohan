"""
AROHAN Test Configuration
Pytest configuration and fixtures
"""

import pytest
import asyncio
from typing import AsyncGenerator, Generator
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.pool import StaticPool
from httpx import AsyncClient, ASGITransport
from fastapi import FastAPI

from src.main import app
from src.db.database import Base, get_db
from src.config.settings import settings


# Test database URL (using SQLite for faster tests)
TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"


# Create test engine
test_engine = create_async_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)

# Create test session factory
TestSessionLocal = async_sessionmaker(
    test_engine,
    autocommit=False,
    autoflush=False,
    expire_on_commit=False,
)


@pytest.fixture(scope="function")
async def db_session() -> AsyncGenerator[AsyncSession, None]:
    """Create a test database session
    
    Yields:
        AsyncSession: Test database session
    """
    # Create tables
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    # Create session
    async with TestSessionLocal() as session:
        yield session
    
    # Cleanup: Drop tables
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest.fixture(scope="function")
async def client(db_session: AsyncSession) -> AsyncGenerator[AsyncClient, None]:
    """Create a test HTTP client
    
    Args:
        db_session: Test database session
        
    Yields:
        AsyncClient: Test HTTP client
    """
    # Override database dependency
    async def override_get_db():
        yield db_session
    
    app.dependency_overrides[get_db] = override_get_db
    
    # Create test client
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test"
    ) as test_client:
        yield test_client
    
    # Reset overrides
    app.dependency_overrides.clear()


@pytest.fixture(scope="function")
def sample_company_data():
    """Sample company data for testing
    
    Returns:
        dict: Sample company data
    """
    return {
        "name": "Test Company",
        "domain": "testcompany.com",
        "industry": "Technology",
        "size": "51-200",
        "plan": "growth",
        "status": "active",
        "settings": {}
    }


@pytest.fixture(scope="function")
def sample_user_data():
    """Sample user data for testing
    
    Returns:
        dict: Sample user data
    """
    return {
        "company_id": "00000000-0000-0000-0000-000000000001",
        "email": "test@example.com",
        "phone": "+919876543210",
        "name": "Test User",
        "role": "admin",
        "password": "TestPassword123!",
        "settings": {}
    }


@pytest.fixture(scope="function")
def sample_requisition_data():
    """Sample requisition data for testing
    
    Returns:
        dict: Sample requisition data
    """
    return {
        "company_id": "00000000-0000-0000-0000-000000000001",
        "title": "Delivery Partner",
        "description": "Delivery partner for last-mile logistics",
        "requirements": {
            "experience": "1+ years",
            "skills": ["driving", "navigation"],
            "languages": ["Hindi", "English"]
        },
        "score_threshold": 70,
        "geo_radius_km": 10,
        "pin_code": "110001",
        "shift_preference": "flexible",
        "salary_range": "₹20,000-25,000",
        "status": "open"
    }


@pytest.fixture(scope="function")
def sample_candidate_data():
    """Sample candidate data for testing
    
    Returns:
        dict: Sample candidate data
    """
    return {
        "campaign_id": "00000000-0000-0000-0000-000000000001",
        "phone": "+919876543211",
        "pin_code": "110001",
        "name": "Test Candidate",
        "email": "candidate@example.com",
        "language_detected": "hi-IN",
        "inbound_channel": "ivr"
    }


@pytest.fixture(scope="function")
def sample_transcript_data():
    """Sample transcript data for testing
    
    Returns:
        dict: Sample transcript data
    """
    return {
        "candidate_id": "00000000-0000-0000-0000-000000000001",
        "raw_text": "Hello, my name is Test Candidate and I am interested in this position.",
        "audio_url": "https://example.com/audio/test.mp3",
        "audio_duration_seconds": 30,
        "segments": [
            {
                "speaker": "candidate",
                "text": "Hello, my name is Test Candidate",
                "timestamp": 0.0,
                "confidence": 0.95
            },
            {
                "speaker": "candidate",
                "text": "and I am interested in this position",
                "timestamp": 2.5,
                "confidence": 0.92
            }
        ],
        "confidence_score": 0.94
    }


@pytest.fixture(scope="function")
def sample_scorecard_data():
    """Sample scorecard data for testing
    
    Returns:
        dict: Sample scorecard data
    """
    return {
        "candidate_id": "00000000-0000-0000-0000-000000000001",
        "requisition_id": "00000000-0000-0000-0000-000000000001",
        "session_id": "00000000-0000-0000-0000-000000000001",
        "overall_score": 85.5,
        "communication_score": 88.0,
        "domain_knowledge_score": 82.0,
        "situational_judgment_score": 86.0,
        "confidence_score": 90.0,
        "language_fluency": "proficient",
        "assessor_notes": "Strong candidate with good communication skills",
        "recommended_roles": ["Delivery Partner", "Warehouse Associate"],
        "shortlist_flag": True,
        "metrics": {
            "question_count": 5,
            "response_time_avg": 3.2,
            "interruption_count": 0
        }
    }


# Pytest configuration
def pytest_configure(config):
    """Configure pytest"""
    config.addinivalue_line(
        "markers", "asyncio: mark test as async"
    )
    config.addinivalue_line(
        "markers", "slow: mark test as slow"
    )
    config.addinivalue_line(
        "markers", "integration: mark test as integration test"
    )


# Run async tests
@pytest.fixture(scope="session")
def event_loop():
    """Create event loop for async tests
    
    Yields:
        asyncio.EventLoop: Event loop
    """
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()