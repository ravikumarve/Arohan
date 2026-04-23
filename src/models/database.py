"""
AROHAN Database Models
SQLAlchemy ORM models for all database tables
"""

from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, Text, ForeignKey, JSON, Enum, Index
from sqlalchemy.dialects.postgresql import UUID, ARRAY, JSONB
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
import enum

from src.db.database import Base


class Company(Base):
    """Company model for multi-tenant architecture"""
    __tablename__ = "companies"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    domain = Column(String(255), unique=True, nullable=False)
    industry = Column(String(100))
    size = Column(String(50))  # "1-10", "11-50", "51-200", "201-500", "500+"
    plan = Column(String(50), default="startup")  # "startup", "growth", "enterprise"
    status = Column(String(20), default="active")  # "active", "suspended", "deleted"
    settings = Column(JSONB, default={})
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    users = relationship("User", back_populates="company")
    requisitions = relationship("Requisition", back_populates="company")
    campaigns = relationship("Campaign", back_populates="company")

    __table_args__ = (
        Index('idx_companies_domain', 'domain'),
        Index('idx_companies_status', 'status'),
    )


class User(Base):
    """User model for authentication and authorization"""
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    company_id = Column(UUID(as_uuid=True), ForeignKey("companies.id"), nullable=False)
    email = Column(String(255), nullable=False, unique=True)
    phone = Column(String(20), unique=True)
    name = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False)  # "admin", "viewer", "recruiter"
    password_hash = Column(String(255), nullable=False)
    status = Column(String(20), default="active")  # "active", "inactive", "deleted"
    last_login = Column(DateTime)
    settings = Column(JSONB, default={})
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    company = relationship("Company", back_populates="users")

    __table_args__ = (
        Index('idx_users_email', 'email'),
        Index('idx_users_company_id', 'company_id'),
        Index('idx_users_role', 'role'),
        Index('idx_users_status', 'status'),
    )


class Requisition(Base):
    """Job requisition model"""
    __tablename__ = "requisitions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    company_id = Column(UUID(as_uuid=True), ForeignKey("companies.id"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    requirements = Column(JSONB, default={})
    score_threshold = Column(Integer, default=70)  # Minimum score for shortlisting
    geo_radius_km = Column(Integer, default=10)  # Geographic search radius
    pin_code = Column(String(10))  # Location pin code
    shift_preference = Column(String(50))  # "day", "night", "flexible"
    salary_range = Column(String(50))  # "₹20,000-25,000"
    status = Column(String(20), default="open")  # "open", "closed", "paused"
    statistics = Column(JSONB, default={})
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    company = relationship("Company", back_populates="requisitions")
    campaigns = relationship("Campaign", back_populates="requisition")
    scorecards = relationship("Scorecard", back_populates="requisition")

    __table_args__ = (
        Index('idx_requisitions_company_id', 'company_id'),
        Index('idx_requisitions_status', 'status'),
        Index('idx_requisitions_pin_code', 'pin_code'),
        Index('idx_requisitions_score_threshold', 'score_threshold'),
    )


class Campaign(Base):
    """Screening campaign model"""
    __tablename__ = "campaigns"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    company_id = Column(UUID(as_uuid=True), ForeignKey("companies.id"), nullable=False)
    requisition_id = Column(UUID(as_uuid=True), ForeignKey("requisitions.id"), nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    status = Column(String(20), default="active")  # "active", "completed", "paused"
    settings = Column(JSONB, default={})
    statistics = Column(JSONB, default={})
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    completed_at = Column(DateTime)

    # Relationships
    company = relationship("Company", back_populates="campaigns")
    requisition = relationship("Requisition", back_populates="campaigns")
    candidates = relationship("Candidate", back_populates="campaign")

    __table_args__ = (
        Index('idx_campaigns_company_id', 'company_id'),
        Index('idx_campaigns_requisition_id', 'requisition_id'),
        Index('idx_campaigns_status', 'status'),
    )


class Candidate(Base):
    """Candidate model"""
    __tablename__ = "candidates"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    campaign_id = Column(UUID(as_uuid=True), ForeignKey("campaigns.id"), nullable=True)
    phone = Column(String(20), nullable=False, unique=True)
    pin_code = Column(String(10), nullable=False)
    name = Column(String(255))
    email = Column(String(255))
    language_detected = Column(String(10), default="hi-IN")
    inbound_channel = Column(String(50))  # "ivr", "whatsapp_audio", "whatsapp_text"
    status = Column(String(20), default="pending")  # "pending", "in_progress", "completed", "shortlisted", "rejected"
    geo_data = Column(JSONB, default={})
    language_data = Column(JSONB, default={})
    demographic_data = Column(JSONB, default={})
    enriched_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    campaign = relationship("Campaign", back_populates="candidates")
    transcripts = relationship("Transcript", back_populates="candidate")
    scorecard = relationship("Scorecard", back_populates="candidate", uselist=False)
    sessions = relationship("CandidateSession", back_populates="candidate")

    __table_args__ = (
        Index('idx_candidates_phone', 'phone'),
        Index('idx_candidates_pin_code', 'pin_code'),
        Index('idx_candidates_campaign_id', 'campaign_id'),
        Index('idx_candidates_status', 'status'),
        Index('idx_candidates_language_detected', 'language_detected'),
    )


class Transcript(Base):
    """Transcript model for interview recordings"""
    __tablename__ = "transcripts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    candidate_id = Column(UUID(as_uuid=True), ForeignKey("candidates.id"), nullable=False)
    raw_text = Column(Text, nullable=False)
    normalized_text = Column(Text)
    language_detected = Column(String(10))
    audio_url = Column(String(500))
    audio_duration_seconds = Column(Integer)
    segments = Column(JSONB, default=[])  # Array of transcript segments
    confidence_score = Column(Float)
    normalized = Column(Boolean, default=False)
    normalized_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    candidate = relationship("Candidate", back_populates="transcripts")

    __table_args__ = (
        Index('idx_transcripts_candidate_id', 'candidate_id'),
        Index('idx_transcripts_language_detected', 'language_detected'),
        Index('idx_transcripts_created_at', 'created_at'),
    )


class Scorecard(Base):
    """Scorecard model for candidate assessment"""
    __tablename__ = "scorecards"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    candidate_id = Column(UUID(as_uuid=True), ForeignKey("candidates.id"), nullable=False)
    requisition_id = Column(UUID(as_uuid=True), ForeignKey("requisitions.id"), nullable=True)
    session_id = Column(UUID(as_uuid=True))
    overall_score = Column(Float, nullable=False)  # 1-100
    communication_score = Column(Float)  # 1-100
    domain_knowledge_score = Column(Float)  # 1-100
    situational_judgment_score = Column(Float)  # 1-100
    confidence_score = Column(Float)  # 1-100
    language_fluency = Column(String(20))  # "native", "proficient", "functional"
    assessor_notes = Column(Text)
    recommended_roles = Column(ARRAY(String))
    shortlist_flag = Column(Boolean, default=False)
    metrics = Column(JSONB, default={})
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    candidate = relationship("Candidate", back_populates="scorecard")
    requisition = relationship("Requisition", back_populates="scorecards")

    __table_args__ = (
        Index('idx_scorecards_candidate_id', 'candidate_id'),
        Index('idx_scorecards_requisition_id', 'requisition_id'),
        Index('idx_scorecards_overall_score', 'overall_score'),
        Index('idx_scorecards_shortlist_flag', 'shortlist_flag'),
    )


class CandidateSession(Base):
    """Candidate session model for interview state management"""
    __tablename__ = "candidate_sessions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    candidate_id = Column(UUID(as_uuid=True), ForeignKey("candidates.id"), nullable=False)
    session_id = Column(String(100), unique=True, nullable=False)
    interview_state = Column(String(50), default="initiated")  # "initiated", "in_progress", "completed", "dropped_off", "recovered"
    current_question_index = Column(Integer, default=0)
    total_questions = Column(Integer, default=5)
    interview_duration_seconds = Column(Integer, default=0)
    language_detected = Column(String(10), default="hi-IN")
    inbound_channel = Column(String(50), default="ivr")
    transcript_segments = Column(JSONB, default=[])
    question_responses = Column(JSONB, default=[])
    drop_off_count = Column(Integer, default=0)
    last_question_asked = Column(Text)
    recovery_context = Column(JSONB, default={})
    matched_requisitions = Column(JSONB, default=[])
    created_at = Column(DateTime, default=datetime.utcnow)
    last_active_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime)

    # Relationships
    candidate = relationship("Candidate", back_populates="sessions")

    __table_args__ = (
        Index('idx_candidate_sessions_candidate_id', 'candidate_id'),
        Index('idx_candidate_sessions_session_id', 'session_id'),
        Index('idx_candidate_sessions_interview_state', 'interview_state'),
        Index('idx_candidate_sessions_last_active_at', 'last_active_at'),
    )


class AuditTrail(Base):
    """Audit trail model for compliance and tracking"""
    __tablename__ = "audit_trail"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    event_id = Column(UUID(as_uuid=True))
    event_type = Column(String(100), nullable=False)
    entity_type = Column(String(50), nullable=False)  # "candidate", "requisition", "campaign", "user"
    entity_id = Column(UUID(as_uuid=True), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    changes = Column(JSONB, default={})
    ip_address = Column(String(50))
    user_agent = Column(String(500))
    created_at = Column(DateTime, default=datetime.utcnow)

    __table_args__ = (
        Index('idx_audit_trail_entity_type', 'entity_type'),
        Index('idx_audit_trail_entity_id', 'entity_id'),
        Index('idx_audit_trail_user_id', 'user_id'),
        Index('idx_audit_trail_event_type', 'event_type'),
        Index('idx_audit_trail_created_at', 'created_at'),
    )


class Event(Base):
    """Event model for tracking system events"""
    __tablename__ = "events"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    event_type = Column(String(100), nullable=False)
    entity_type = Column(String(50), nullable=False)
    entity_id = Column(UUID(as_uuid=True), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    changes = Column(JSONB, default={})
    ip_address = Column(String(50))
    user_agent = Column(String(500))
    audited = Column(Boolean, default=False)
    audited_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)

    __table_args__ = (
        Index('idx_events_entity_type', 'entity_type'),
        Index('idx_events_entity_id', 'entity_id'),
        Index('idx_events_audited', 'audited'),
        Index('idx_events_created_at', 'created_at'),
    )