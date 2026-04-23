"""
Drop-off Recovery End-to-End Tests
Comprehensive testing of drop-off recovery functionality
"""

import pytest
import asyncio
import json
from datetime import datetime, timedelta
from typing import Dict, Any
from unittest.mock import Mock, AsyncMock, patch
import redis.asyncio as redis

from src.agents.orchestrator import AgentOrchestrator
from src.agents.state import (
    CandidateSessionState,
    InterviewState,
    AgentRole
)
from src.config.settings import settings


@pytest.fixture
async def redis_client():
    """Create Redis client for testing"""
    client = redis.from_url(
        settings.REDIS_URL,
        encoding="utf-8",
        decode_responses=True
    )
    yield client
    await client.close()


@pytest.fixture
async def orchestrator(redis_client):
    """Create orchestrator instance for testing"""
    with patch('src.agents.orchestrator.redis.from_url', return_value=redis_client):
        orch = AgentOrchestrator()
        orch.redis_client = redis_client
        yield orch
        await orch.close()


@pytest.fixture
def sample_session_state() -> CandidateSessionState:
    """Create sample session state for testing"""
    return {
        "session_id": "test-session-001",
        "candidate_phone": "+919876543210",
        "candidate_pin_code": "400001",
        "campaign_id": "campaign-123",
        "requisition_id": "req-456",
        "interview_state": InterviewState.IN_PROGRESS,
        "current_question_index": 2,
        "total_questions": 5,
        "interview_duration_seconds": 120,
        "language_detected": "hi-IN",
        "inbound_channel": "ivr",
        "transcript_segments": [
            {
                "speaker": "candidate",
                "text": "Hello, my name is Rahul",
                "timestamp": datetime.utcnow().isoformat(),
                "confidence": 0.95
            }
        ],
        "question_responses": [
            {
                "question": "What is your name?",
                "answer": "My name is Rahul",
                "confidence": 0.95,
                "timestamp": datetime.utcnow().isoformat()
            }
        ],
        "scorecard": None,
        "matched_requisitions": [],
        "drop_off_count": 0,
        "last_question_asked": "What is your experience?",
        "recovery_context": None,
        "created_at": datetime.utcnow(),
        "last_active_at": datetime.utcnow(),
        "completed_at": None
    }


class TestDropOffRecovery:
    """Test suite for drop-off recovery functionality"""

    @pytest.mark.asyncio
    async def test_session_creation_and_persistence(self, orchestrator, redis_client):
        """Test that sessions are created and persisted to Redis correctly"""
        # Arrange
        session_id = "test-session-creation"
        candidate_phone = "+919876543210"
        candidate_pin_code = "400001"

        # Act
        state = await orchestrator.start_session(
            session_id=session_id,
            candidate_phone=candidate_phone,
            candidate_pin_code=candidate_pin_code,
            inbound_channel="ivr"
        )

        # Assert
        assert state["session_id"] == session_id
        assert state["candidate_phone"] == candidate_phone
        assert state["candidate_pin_code"] == candidate_pin_code
        assert state["interview_state"] == InterviewState.INITIATED
        assert state["drop_off_count"] == 0

        # Verify persistence to Redis
        saved_state = await redis_client.get(f"session:{session_id}")
        assert saved_state is not None
        saved_data = json.loads(saved_state)
        assert saved_data["session_id"] == session_id

    @pytest.mark.asyncio
    async def test_session_state_loading(self, orchestrator, redis_client, sample_session_state):
        """Test that session states can be loaded from Redis correctly"""
        # Arrange
        session_id = sample_session_state["session_id"]
        state_json = json.dumps(sample_session_state, default=str)
        await redis_client.setex(f"session:{session_id}", 86400, state_json)

        # Act
        loaded_state = await orchestrator.get_session_state(session_id)

        # Assert
        assert loaded_state is not None
        assert loaded_state["session_id"] == session_id
        assert loaded_state["candidate_phone"] == sample_session_state["candidate_phone"]
        assert loaded_state["interview_state"] == sample_session_state["interview_state"]
        assert len(loaded_state["transcript_segments"]) == len(sample_session_state["transcript_segments"])

    @pytest.mark.asyncio
    async def test_drop_off_detection_and_recovery(self, orchestrator, redis_client, sample_session_state):
        """Test that drop-offs are detected and sessions can be recovered"""
        # Arrange
        session_id = sample_session_state["session_id"]
        sample_session_state["interview_state"] = InterviewState.DROPPED_OFF
        sample_session_state["drop_off_count"] = 0
        state_json = json.dumps(sample_session_state, default=str)
        await redis_client.setex(f"session:{session_id}", 86400, state_json)

        recovery_context = {
            "recovery_method": "whatsapp",
            "recovery_timestamp": datetime.utcnow().isoformat(),
            "recovery_message": "Koi baat nahi — jahan chhoda wahan se shuru karte hain."
        }

        # Act
        recovered_state = await orchestrator.recover_session(
            session_id=session_id,
            recovery_context=recovery_context
        )

        # Assert
        assert recovered_state["interview_state"] == InterviewState.RECOVERED
        assert recovered_state["drop_off_count"] == 1
        assert recovered_state["recovery_context"] == recovery_context
        assert recovered_state["last_active_at"] > sample_session_state["last_active_at"]

        # Verify persistence
        saved_state = await redis_client.get(f"session:{session_id}")
        saved_data = json.loads(saved_state)
        assert saved_data["interview_state"] == InterviewState.RECOVERED
        assert saved_data["drop_off_count"] == 1

    @pytest.mark.asyncio
    async def test_multiple_drop_off_recovery(self, orchestrator, redis_client, sample_session_state):
        """Test that multiple drop-offs can be recovered correctly"""
        # Arrange
        session_id = sample_session_state["session_id"]
        sample_session_state["interview_state"] = InterviewState.DROPPED_OFF
        sample_session_state["drop_off_count"] = 2
        state_json = json.dumps(sample_session_state, default=str)
        await redis_client.setex(f"session:{session_id}", 86400, state_json)

        # Act - First recovery
        recovered_state_1 = await orchestrator.recover_session(session_id)
        assert recovered_state_1["drop_off_count"] == 3

        # Simulate another drop-off
        recovered_state_1["interview_state"] = InterviewState.DROPPED_OFF
        state_json = json.dumps(recovered_state_1, default=str)
        await redis_client.setex(f"session:{session_id}", 86400, state_json)

        # Act - Second recovery
        recovered_state_2 = await orchestrator.recover_session(session_id)

        # Assert
        assert recovered_state_2["drop_off_count"] == 4
        assert recovered_state_2["interview_state"] == InterviewState.RECOVERED

    @pytest.mark.asyncio
    async def test_session_continuation_after_recovery(self, orchestrator, redis_client, sample_session_state):
        """Test that sessions can continue normally after recovery"""
        # Arrange
        session_id = sample_session_state["session_id"]
        sample_session_state["interview_state"] = InterviewState.RECOVERED
        sample_session_state["drop_off_count"] = 1
        state_json = json.dumps(sample_session_state, default=str)
        await redis_client.setex(f"session:{session_id}", 86400, state_json)

        # Mock the graph invocation
        with patch.object(orchestrator.graph, 'ainvoke', new_callable=AsyncMock) as mock_invoke:
            mock_invoke.return_value = sample_session_state

            # Act
            audio_data = b"mock_audio_data"
            continued_state = await orchestrator.continue_session(
                session_id=session_id,
                audio_data=audio_data
            )

            # Assert
            assert continued_state is not None
            mock_invoke.assert_called_once()
            call_args = mock_invoke.call_args
            assert call_args[0][0]["session_id"] == session_id

    @pytest.mark.asyncio
    async def test_session_not_found_error(self, orchestrator):
        """Test that appropriate error is raised when session is not found"""
        # Arrange
        non_existent_session_id = "non-existent-session"

        # Act & Assert
        with pytest.raises(ValueError, match="Session .* not found"):
            await orchestrator.continue_session(
                session_id=non_existent_session_id,
                audio_data=b"test_audio"
            )

    @pytest.mark.asyncio
    async def test_recovery_context_preservation(self, orchestrator, redis_client, sample_session_state):
        """Test that recovery context is preserved across multiple recoveries"""
        # Arrange
        session_id = sample_session_state["session_id"]
        recovery_context_1 = {
            "recovery_method": "whatsapp",
            "recovery_timestamp": datetime.utcnow().isoformat(),
            "recovery_message": "First recovery"
        }

        # Act - First recovery
        sample_session_state["interview_state"] = InterviewState.DROPPED_OFF
        state_json = json.dumps(sample_session_state, default=str)
        await redis_client.setex(f"session:{session_id}", 86400, state_json)

        recovered_state_1 = await orchestrator.recover_session(
            session_id=session_id,
            recovery_context=recovery_context_1
        )

        # Assert - First recovery
        assert recovered_state_1["recovery_context"] == recovery_context_1

        # Act - Second recovery with new context
        recovery_context_2 = {
            "recovery_method": "ivr",
            "recovery_timestamp": datetime.utcnow().isoformat(),
            "recovery_message": "Second recovery"
        }

        recovered_state_1["interview_state"] = InterviewState.DROPPED_OFF
        state_json = json.dumps(recovered_state_1, default=str)
        await redis_client.setex(f"session:{session_id}", 86400, state_json)

        recovered_state_2 = await orchestrator.recover_session(
            session_id=session_id,
            recovery_context=recovery_context_2
        )

        # Assert - Second recovery
        assert recovered_state_2["recovery_context"] == recovery_context_2
        assert recovered_state_2["drop_off_count"] == 2

    @pytest.mark.asyncio
    async def test_transcript_preservation_across_recovery(self, orchestrator, redis_client, sample_session_state):
        """Test that transcript segments are preserved across drop-off and recovery"""
        # Arrange
        session_id = sample_session_state["session_id"]
        original_transcript_count = len(sample_session_state["transcript_segments"])

        # Act - Simulate drop-off and recovery
        sample_session_state["interview_state"] = InterviewState.DROPPED_OFF
        state_json = json.dumps(sample_session_state, default=str)
        await redis_client.setex(f"session:{session_id}", 86400, state_json)

        recovered_state = await orchestrator.recover_session(session_id)

        # Assert
        assert len(recovered_state["transcript_segments"]) == original_transcript_count
        assert recovered_state["transcript_segments"][0]["text"] == sample_session_state["transcript_segments"][0]["text"]

    @pytest.mark.asyncio
    async def test_question_progress_preservation(self, orchestrator, redis_client, sample_session_state):
        """Test that question progress is preserved across drop-off and recovery"""
        # Arrange
        session_id = sample_session_state["session_id"]
        original_question_index = sample_session_state["current_question_index"]
        original_total_questions = sample_session_state["total_questions"]

        # Act - Simulate drop-off and recovery
        sample_session_state["interview_state"] = InterviewState.DROPPED_OFF
        state_json = json.dumps(sample_session_state, default=str)
        await redis_client.setex(f"session:{session_id}", 86400, state_json)

        recovered_state = await orchestrator.recover_session(session_id)

        # Assert
        assert recovered_state["current_question_index"] == original_question_index
        assert recovered_state["total_questions"] == original_total_questions
        assert recovered_state["last_question_asked"] == sample_session_state["last_question_asked"]

    @pytest.mark.asyncio
    async def test_session_ttl_expiration(self, orchestrator, redis_client):
        """Test that sessions expire after TTL"""
        # Arrange
        session_id = "test-session-ttl"
        short_ttl_state = {
            "session_id": session_id,
            "candidate_phone": "+919876543210",
            "candidate_pin_code": "400001",
            "interview_state": InterviewState.IN_PROGRESS,
            "current_question_index": 0,
            "total_questions": 5,
            "interview_duration_seconds": 0,
            "language_detected": "hi-IN",
            "inbound_channel": "ivr",
            "transcript_segments": [],
            "question_responses": [],
            "scorecard": None,
            "matched_requisitions": [],
            "drop_off_count": 0,
            "last_question_asked": None,
            "recovery_context": None,
            "created_at": datetime.utcnow(),
            "last_active_at": datetime.utcnow(),
            "completed_at": None
        }

        # Act - Save with short TTL
        state_json = json.dumps(short_ttl_state, default=str)
        await redis_client.setex(f"session:{session_id}", 2, state_json)  # 2 second TTL

        # Assert - Session exists immediately
        immediate_state = await orchestrator.get_session_state(session_id)
        assert immediate_state is not None

        # Wait for expiration
        await asyncio.sleep(3)

        # Assert - Session expired
        expired_state = await orchestrator.get_session_state(session_id)
        assert expired_state is None

    @pytest.mark.asyncio
    async def test_concurrent_session_handling(self, orchestrator, redis_client):
        """Test that multiple sessions can be handled concurrently"""
        # Arrange
        session_ids = [f"concurrent-session-{i}" for i in range(5)]

        # Act - Create multiple sessions concurrently
        tasks = []
        for session_id in session_ids:
            task = orchestrator.start_session(
                session_id=session_id,
                candidate_phone=f"+91987654321{i}",
                candidate_pin_code="400001",
                inbound_channel="ivr"
            )
            tasks.append(task)

        results = await asyncio.gather(*tasks)

        # Assert
        assert len(results) == 5
        for i, state in enumerate(results):
            assert state["session_id"] == session_ids[i]
            assert state["candidate_phone"] == f"+91987654321{i}"

        # Verify all sessions are persisted
        for session_id in session_ids:
            loaded_state = await orchestrator.get_session_state(session_id)
            assert loaded_state is not None


class TestWhatsAppRecovery:
    """Test suite for WhatsApp-based recovery"""

    @pytest.mark.asyncio
    async def test_whatsapp_recovery_notification(self, orchestrator, redis_client, sample_session_state):
        """Test WhatsApp recovery notification generation"""
        # Arrange
        session_id = sample_session_state["session_id"]
        candidate_phone = sample_session_state["candidate_phone"]
        sample_session_state["interview_state"] = InterviewState.DROPPED_OFF
        state_json = json.dumps(sample_session_state, default=str)
        await redis_client.setex(f"session:{session_id}", 86400, state_json)

        recovery_context = {
            "recovery_method": "whatsapp",
            "recovery_timestamp": datetime.utcnow().isoformat(),
            "recovery_message": "Koi baat nahi — jahan chhoda wahan se shuru karte hain.",
            "candidate_phone": candidate_phone,
            "last_question": sample_session_state["last_question_asked"]
        }

        # Act
        recovered_state = await orchestrator.recover_session(
            session_id=session_id,
            recovery_context=recovery_context
        )

        # Assert
        assert recovered_state["recovery_context"]["recovery_method"] == "whatsapp"
        assert "recovery_message" in recovered_state["recovery_context"]
        assert recovered_state["recovery_context"]["candidate_phone"] == candidate_phone

    @pytest.mark.asyncio
    async def test_whatsapp_recovery_with_context(self, orchestrator, redis_client, sample_session_state):
        """Test WhatsApp recovery with interview context"""
        # Arrange
        session_id = sample_session_state["session_id"]
        sample_session_state["interview_state"] = InterviewState.DROPPED_OFF
        sample_session_state["current_question_index"] = 2
        sample_session_state["total_questions"] = 5
        state_json = json.dumps(sample_session_state, default=str)
        await redis_client.setex(f"session:{session_id}", 86400, state_json)

        recovery_context = {
            "recovery_method": "whatsapp",
            "recovery_timestamp": datetime.utcnow().isoformat(),
            "recovery_message": f"You were on question {sample_session_state['current_question_index'] + 1} of {sample_session_state['total_questions']}",
            "progress": {
                "current_question": sample_session_state["current_question_index"],
                "total_questions": sample_session_state["total_questions"],
                "percentage_complete": (sample_session_state["current_question_index"] / sample_session_state["total_questions"]) * 100
            }
        }

        # Act
        recovered_state = await orchestrator.recover_session(
            session_id=session_id,
            recovery_context=recovery_context
        )

        # Assert
        assert "progress" in recovered_state["recovery_context"]
        assert recovered_state["recovery_context"]["progress"]["current_question"] == 2
        assert recovered_state["recovery_context"]["progress"]["total_questions"] == 5


class TestRecoveryScenarios:
    """Test suite for real-world recovery scenarios"""

    @pytest.mark.asyncio
    async def test_network_drop_recovery(self, orchestrator, redis_client, sample_session_state):
        """Test recovery after network drop"""
        # Arrange
        session_id = sample_session_state["session_id"]
        sample_session_state["interview_state"] = InterviewState.DROPPED_OFF
        state_json = json.dumps(sample_session_state, default=str)
        await redis_client.setex(f"session:{session_id}", 86400, state_json)

        recovery_context = {
            "recovery_method": "automatic",
            "recovery_timestamp": datetime.utcnow().isoformat(),
            "drop_reason": "network_timeout",
            "drop_duration_seconds": 30
        }

        # Act
        recovered_state = await orchestrator.recover_session(
            session_id=session_id,
            recovery_context=recovery_context
        )

        # Assert
        assert recovered_state["interview_state"] == InterviewState.RECOVERED
        assert recovered_state["recovery_context"]["drop_reason"] == "network_timeout"

    @pytest.mark.asyncio
    async def test_user_initiated_drop_recovery(self, orchestrator, redis_client, sample_session_state):
        """Test recovery after user-initiated drop"""
        # Arrange
        session_id = sample_session_state["session_id"]
        sample_session_state["interview_state"] = InterviewState.DROPPED_OFF
        state_json = json.dumps(sample_session_state, default=str)
        await redis_client.setex(f"session:{session_id}", 86400, state_json)

        recovery_context = {
            "recovery_method": "user_initiated",
            "recovery_timestamp": datetime.utcnow().isoformat(),
            "drop_reason": "user_hangup",
            "time_since_drop_minutes": 15
        }

        # Act
        recovered_state = await orchestrator.recover_session(
            session_id=session_id,
            recovery_context=recovery_context
        )

        # Assert
        assert recovered_state["interview_state"] == InterviewState.RECOVERED
        assert recovered_state["recovery_context"]["drop_reason"] == "user_hangup"

    @pytest.mark.asyncio
    async def test_system_error_recovery(self, orchestrator, redis_client, sample_session_state):
        """Test recovery after system error"""
        # Arrange
        session_id = sample_session_state["session_id"]
        sample_session_state["interview_state"] = InterviewState.DROPPED_OFF
        state_json = json.dumps(sample_session_state, default=str)
        await redis_client.setex(f"session:{session_id}", 86400, state_json)

        recovery_context = {
            "recovery_method": "automatic",
            "recovery_timestamp": datetime.utcnow().isoformat(),
            "drop_reason": "system_error",
            "error_code": "STT_TIMEOUT",
            "error_message": "Speech-to-text service timeout"
        }

        # Act
        recovered_state = await orchestrator.recover_session(
            session_id=session_id,
            recovery_context=recovery_context
        )

        # Assert
        assert recovered_state["interview_state"] == InterviewState.RECOVERED
        assert recovered_state["recovery_context"]["error_code"] == "STT_TIMEOUT"

    @pytest.mark.asyncio
    async def test_long_session_recovery(self, orchestrator, redis_client):
        """Test recovery of long-running session with extensive data"""
        # Arrange
        session_id = "long-session-test"
        long_session_state = {
            "session_id": session_id,
            "candidate_phone": "+919876543210",
            "candidate_pin_code": "400001",
            "interview_state": InterviewState.DROPPED_OFF,
            "current_question_index": 4,
            "total_questions": 5,
            "interview_duration_seconds": 300,  # 5 minutes
            "language_detected": "hi-IN",
            "inbound_channel": "ivr",
            "transcript_segments": [
                {
                    "speaker": "candidate",
                    "text": f"Response {i}",
                    "timestamp": datetime.utcnow().isoformat(),
                    "confidence": 0.9 + (i * 0.01)
                }
                for i in range(20)  # 20 transcript segments
            ],
            "question_responses": [
                {
                    "question": f"Question {i}",
                    "answer": f"Answer {i}",
                    "confidence": 0.9,
                    "timestamp": datetime.utcnow().isoformat()
                }
                for i in range(4)  # 4 question responses
            ],
            "scorecard": None,
            "matched_requisitions": [],
            "drop_off_count": 0,
            "last_question_asked": "What are your salary expectations?",
            "recovery_context": None,
            "created_at": datetime.utcnow() - timedelta(minutes=5),
            "last_active_at": datetime.utcnow(),
            "completed_at": None
        }

        state_json = json.dumps(long_session_state, default=str)
        await redis_client.setex(f"session:{session_id}", 86400, state_json)

        # Act
        recovered_state = await orchestrator.recover_session(session_id)

        # Assert
        assert recovered_state["interview_state"] == InterviewState.RECOVERED
        assert len(recovered_state["transcript_segments"]) == 20
        assert len(recovered_state["question_responses"]) == 4
        assert recovered_state["interview_duration_seconds"] == 300
        assert recovered_state["current_question_index"] == 4