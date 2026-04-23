"""
AROHAN Agent State Management
LangGraph state definitions for agent orchestration
"""

from typing import TypedDict, List, Optional, Dict, Any
from datetime import datetime
from enum import Enum


class InterviewState(str, Enum):
    """Interview session states"""
    INITIATED = "initiated"
    IN_PROGRESS = "in_progress"
    PAUSED = "paused"
    COMPLETED = "completed"
    DROPPED_OFF = "dropped_off"
    RECOVERED = "recovered"


class AgentRole(str, Enum):
    """Agent roles in the interview process"""
    PROCTOR = "proctor"
    ASSESSOR = "assessor"
    MATCHMAKER = "matchmaker"


class TranscriptSegment(TypedDict):
    """Individual transcript segment with metadata"""
    speaker: str  # "proctor" or "candidate"
    text: str
    timestamp: datetime
    confidence: float
    language_detected: str


class QuestionResponse(TypedDict):
    """Question-response pair from interview"""
    question_id: str
    question_text: str
    response_text: str
    response_duration_seconds: int
    confidence_score: float
    follow_up_generated: bool


class Scorecard(TypedDict):
    """Candidate assessment scorecard"""
    overall_score: float  # 1-100
    communication_score: float  # 1-100
    domain_knowledge_score: float  # 1-100
    situational_judgment_score: float  # 1-100
    confidence_score: float  # 1-100
    language_fluency: str  # "native", "proficient", "functional"
    assessor_notes: str
    recommended_roles: List[str]
    shortlist_flag: bool
    assessed_at: datetime


class CandidateSessionState(TypedDict):
    """
    Main state object shared across all agents
    Persisted to Redis for drop-off recovery
    """
    # Session identification
    session_id: str
    candidate_phone: str
    candidate_pin_code: str
    campaign_id: Optional[str]
    requisition_id: Optional[str]

    # Interview state
    interview_state: InterviewState
    current_question_index: int
    total_questions: int
    interview_duration_seconds: int

    # Language and channel
    language_detected: str
    inbound_channel: str  # "ivr", "whatsapp_audio", "whatsapp_text"

    # Transcript data
    transcript_segments: List[TranscriptSegment]
    question_responses: List[QuestionResponse]

    # Assessment results
    scorecard: Optional[Scorecard]

    # Matching results
    matched_requisitions: List[Dict[str, Any]]

    # Drop-off recovery
    drop_off_count: int
    last_question_asked: Optional[str]
    recovery_context: Optional[Dict[str, Any]]

    # Metadata
    created_at: datetime
    last_active_at: datetime
    completed_at: Optional[datetime]


class AgentMessage(TypedDict):
    """Message passed between agents"""
    from_agent: AgentRole
    to_agent: AgentRole
    message_type: str
    content: Dict[str, Any]
    timestamp: datetime


class ProctorState(TypedDict):
    """Proctor agent specific state"""
    current_difficulty_level: int  # 1-5 scale
    adaptive_strategy: str  # "linear", "adaptive", "branching"
    interruption_count: int
    clarification_requests: int
    question_bank: List[Dict[str, Any]]
    next_question: Optional[str]


class AssessorState(TypedDict):
    """Assessor agent specific state"""
    analysis_progress: float  # 0-1
    confidence_metrics: Dict[str, float]
    keyword_matches: Dict[str, int]
    sentiment_analysis: Dict[str, float]
    domain_assessment: Dict[str, float]


class MatchmakerState(TypedDict):
    """Matchmaker agent specific state"""
    geo_search_radius_km: int
    score_threshold: float
    matching_criteria: Dict[str, Any]
    candidate_traits: List[float]  # Embedding vector
    potential_matches: List[Dict[str, Any]]