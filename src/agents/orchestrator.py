"""
AROHAN LangGraph Agent Orchestration
Main agent workflow and state management
"""

from typing import Dict, Any, Optional, TypedDict
from datetime import datetime
import json
import redis.asyncio as redis
from langgraph.graph import StateGraph, END
from langgraph.checkpoint.redis.aio import RedisCheckpointSaver

from src.agents.state import (
    CandidateSessionState,
    InterviewState,
    AgentRole,
    AgentMessage
)
from src.config.settings import settings


class AgentOrchestrator:
    """
    Main orchestrator for AROHAN agent system
    Manages LangGraph workflow and state persistence
    """

    def __init__(self):
        """Initialize the agent orchestrator"""
        self.redis_client = None
        self.checkpoint_saver = None
        self.graph = None
        self._initialize_redis()
        self._build_graph()

    def _initialize_redis(self):
        """Initialize Redis connection for state persistence"""
        self.redis_client = redis.from_url(
            settings.REDIS_URL,
            encoding="utf-8",
            decode_responses=True
        )
        self.checkpoint_saver = RedisCheckpointSaver(
            self.redis_client,
            checkpointer_name="arohan_agent_state"
        )

    def _build_graph(self):
        """Build the LangGraph workflow for agent orchestration"""
        # Create state graph
        workflow = StateGraph(CandidateSessionState)

        # Add nodes for each agent
        workflow.add_node("proctor", self._proctor_node)
        workflow.add_node("assessor", self._assessor_node)
        workflow.add_node("matchmaker", self._matchmaker_node)

        # Add edges for workflow transitions
        workflow.add_edge("proctor", "assessor")
        workflow.add_edge("assessor", "matchmaker")
        workflow.add_edge("matchmaker", END)

        # Set entry point
        workflow.set_entry_point("proctor")

        # Add conditional edges for drop-off recovery
        workflow.add_conditional_edges(
            "proctor",
            self._should_continue_interview,
            {
                "continue": "proctor",
                "complete": "assessor",
                "recover": "proctor"
            }
        )

        # Compile graph with checkpoint saver
        self.graph = workflow.compile(checkpointer=self.checkpoint_saver)

    async def _proctor_node(self, state: CandidateSessionState) -> CandidateSessionState:
        """
        Proctor agent node - conducts adaptive voice interview
        """
        from src.agents.proctor import ProctorAgent

        proctor = ProctorAgent()
        return await proctor.process_interview(state)

    async def _assessor_node(self, state: CandidateSessionState) -> CandidateSessionState:
        """
        Assessor agent node - evaluates candidate and generates scorecard
        """
        from src.agents.assessor import AssessorAgent

        assessor = AssessorAgent()
        return await assessor.evaluate_candidate(state)

    async def _matchmaker_node(self, state: CandidateSessionState) -> CandidateSessionState:
        """
        Matchmaker agent node - finds matching job requisitions
        """
        from src.agents.matchmaker import MatchmakerAgent

        matchmaker = MatchmakerAgent()
        return await matchmaker.find_matches(state)

    def _should_continue_interview(self, state: CandidateSessionState) -> str:
        """
        Determine if interview should continue, complete, or recover
        """
        # Check for drop-off recovery
        if state.get("drop_off_count", 0) > 0 and state.get("interview_state") == InterviewState.DROPPED_OFF:
            return "recover"

        # Check if interview is complete
        if state.get("interview_state") == InterviewState.COMPLETED:
            return "complete"

        # Continue interview
        return "continue"

    async def start_session(
        self,
        session_id: str,
        candidate_phone: str,
        candidate_pin_code: str,
        campaign_id: Optional[str] = None,
        requisition_id: Optional[str] = None,
        inbound_channel: str = "ivr"
    ) -> CandidateSessionState:
        """
        Start a new candidate screening session

        Args:
            session_id: Unique session identifier
            candidate_phone: Candidate's phone number (E.164 format)
            candidate_pin_code: Candidate's pin code for geo-matching
            campaign_id: Optional campaign ID
            requisition_id: Optional requisition ID
            inbound_channel: Channel type ("ivr", "whatsapp_audio", "whatsapp_text")

        Returns:
            Initial session state
        """
        # Create initial state
        initial_state: CandidateSessionState = {
            "session_id": session_id,
            "candidate_phone": candidate_phone,
            "candidate_pin_code": candidate_pin_code,
            "campaign_id": campaign_id,
            "requisition_id": requisition_id,
            "interview_state": InterviewState.INITIATED,
            "current_question_index": 0,
            "total_questions": 5,
            "interview_duration_seconds": 0,
            "language_detected": "hi-IN",  # Default, will be detected
            "inbound_channel": inbound_channel,
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

        # Save initial state to Redis
        await self._save_state(session_id, initial_state)

        return initial_state

    async def continue_session(
        self,
        session_id: str,
        audio_data: bytes,
        metadata: Optional[Dict[str, Any]] = None
    ) -> CandidateSessionState:
        """
        Continue an existing session with new audio input

        Args:
            session_id: Session identifier
            audio_data: Audio data from candidate
            metadata: Optional metadata (language, duration, etc.)

        Returns:
            Updated session state
        """
        # Load current state
        state = await self._load_state(session_id)

        if not state:
            raise ValueError(f"Session {session_id} not found")

        # Update last active time
        state["last_active_at"] = datetime.utcnow()

        # Process audio through the graph
        config = {"configurable": {"thread_id": session_id}}
        result = await self.graph.ainvoke(state, config)

        # Save updated state
        await self._save_state(session_id, result)

        return result

    async def recover_session(
        self,
        session_id: str,
        recovery_context: Optional[Dict[str, Any]] = None
    ) -> CandidateSessionState:
        """
        Recover a dropped-off session

        Args:
            session_id: Session identifier
            recovery_context: Optional recovery context

        Returns:
            Recovered session state
        """
        # Load current state
        state = await self._load_state(session_id)

        if not state:
            raise ValueError(f"Session {session_id} not found")

        # Update state for recovery
        state["interview_state"] = InterviewState.RECOVERED
        state["drop_off_count"] = state.get("drop_off_count", 0) + 1
        state["recovery_context"] = recovery_context
        state["last_active_at"] = datetime.utcnow()

        # Save recovered state
        await self._save_state(session_id, state)

        return state

    async def get_session_state(self, session_id: str) -> Optional[CandidateSessionState]:
        """
        Get current session state

        Args:
            session_id: Session identifier

        Returns:
            Current session state or None if not found
        """
        return await self._load_state(session_id)

    async def _save_state(self, session_id: str, state: CandidateSessionState):
        """Save state to Redis"""
        state_json = json.dumps(state, default=str)
        await self.redis_client.setex(
            f"session:{session_id}",
            86400,  # 24 hour TTL
            state_json
        )

    async def _load_state(self, session_id: str) -> Optional[CandidateSessionState]:
        """Load state from Redis"""
        state_json = await self.redis_client.get(f"session:{session_id}")
        if state_json:
            return json.loads(state_json)
        return None

    async def close(self):
        """Close Redis connection"""
        if self.redis_client:
            await self.redis_client.close()


# Global orchestrator instance
orchestrator = AgentOrchestrator()