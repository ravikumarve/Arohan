"""
AROHAN Pydantic Models
Request/Response models for API endpoints
"""

from pydantic import BaseModel, Field, EmailStr, validator
from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID
from enum import Enum


# ============================================================================
# Base Models
# ============================================================================

class BaseResponse(BaseModel):
    """Base response model with common fields"""
    success: bool = True
    message: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class ErrorResponse(BaseModel):
    """Error response model"""
    success: bool = False
    error: str
    message: Optional[str] = None
    details: Optional[Dict[str, Any]] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)


# ============================================================================
# Company Models
# ============================================================================

class CompanyCreate(BaseModel):
    """Company creation request"""
    name: str = Field(..., min_length=1, max_length=255)
    domain: str = Field(..., min_length=1, max_length=255)
    industry: Optional[str] = Field(None, max_length=100)
    size: Optional[str] = Field(None, pattern="^(1-10|11-50|51-200|201-500|500+)$")
    plan: str = Field(default="startup", pattern="^(startup|growth|enterprise)$")
    settings: Optional[Dict[str, Any]] = None

    @validator('domain')
    def validate_domain(cls, v):
        if not v.replace('.', '').replace('-', '').isalnum():
            raise ValueError('Domain must contain only alphanumeric characters, dots, and hyphens')
        return v.lower()


class CompanyUpdate(BaseModel):
    """Company update request"""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    industry: Optional[str] = Field(None, max_length=100)
    size: Optional[str] = Field(None, pattern="^(1-10|11-50|51-200|201-500|500+)$")
    plan: Optional[str] = Field(None, pattern="^(startup|growth|enterprise)$")
    status: Optional[str] = Field(None, pattern="^(active|suspended|deleted)$")
    settings: Optional[Dict[str, Any]] = None


class CompanyResponse(BaseModel):
    """Company response"""
    id: UUID
    name: str
    domain: str
    industry: Optional[str]
    size: Optional[str]
    plan: str
    status: str
    settings: Dict[str, Any]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ============================================================================
# User Models
# ============================================================================

class UserRole(str, Enum):
    """User role enumeration"""
    ADMIN = "admin"
    VIEWER = "viewer"
    RECRUITER = "recruiter"


class UserCreate(BaseModel):
    """User creation request"""
    company_id: UUID
    email: EmailStr
    phone: Optional[str] = Field(None, max_length=20)
    name: str = Field(..., min_length=1, max_length=255)
    role: UserRole = UserRole.VIEWER
    password: str = Field(..., min_length=8, max_length=128)
    settings: Optional[Dict[str, Any]] = None

    @validator('phone')
    def validate_phone(cls, v):
        if v and not v.replace('+', '').replace(' ', '').replace('-', '').isdigit():
            raise ValueError('Phone must contain only digits, spaces, hyphens, and plus sign')
        return v


class UserUpdate(BaseModel):
    """User update request"""
    phone: Optional[str] = Field(None, max_length=20)
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    role: Optional[UserRole] = None
    status: Optional[str] = Field(None, pattern="^(active|inactive|deleted)$")
    settings: Optional[Dict[str, Any]] = None


class UserResponse(BaseModel):
    """User response"""
    id: UUID
    company_id: UUID
    email: str
    phone: Optional[str]
    name: str
    role: str
    status: str
    last_login: Optional[datetime]
    settings: Dict[str, Any]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class UserLogin(BaseModel):
    """User login request"""
    email: EmailStr
    password: str


class LoginResponse(BaseModel):
    """Login response"""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


# ============================================================================
# Requisition Models
# ============================================================================

class RequisitionCreate(BaseModel):
    """Requisition creation request"""
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    requirements: Optional[Dict[str, Any]] = None
    score_threshold: int = Field(default=70, ge=0, le=100)
    geo_radius_km: int = Field(default=10, ge=1, le=100)
    pin_code: Optional[str] = Field(None, max_length=10)
    shift_preference: Optional[str] = Field(None, pattern="^(day|night|flexible)$")
    salary_range: Optional[str] = Field(None, max_length=50)
    settings: Optional[Dict[str, Any]] = None


class RequisitionUpdate(BaseModel):
    """Requisition update request"""
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    requirements: Optional[Dict[str, Any]] = None
    score_threshold: Optional[int] = Field(None, ge=0, le=100)
    geo_radius_km: Optional[int] = Field(None, ge=1, le=100)
    pin_code: Optional[str] = Field(None, max_length=10)
    shift_preference: Optional[str] = Field(None, pattern="^(day|night|flexible)$")
    salary_range: Optional[str] = Field(None, max_length=50)
    status: Optional[str] = Field(None, pattern="^(open|closed|paused)$")
    settings: Optional[Dict[str, Any]] = None


class RequisitionResponse(BaseModel):
    """Requisition response"""
    id: UUID
    company_id: UUID
    title: str
    description: Optional[str]
    requirements: Dict[str, Any]
    score_threshold: int
    geo_radius_km: int
    pin_code: Optional[str]
    shift_preference: Optional[str]
    salary_range: Optional[str]
    status: str
    statistics: Dict[str, Any]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ============================================================================
# Campaign Models
# ============================================================================

class CampaignCreate(BaseModel):
    """Campaign creation request"""
    requisition_id: UUID
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    settings: Optional[Dict[str, Any]] = None


class CampaignUpdate(BaseModel):
    """Campaign update request"""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    status: Optional[str] = Field(None, pattern="^(active|completed|paused)$")
    settings: Optional[Dict[str, Any]] = None


class CampaignResponse(BaseModel):
    """Campaign response"""
    id: UUID
    company_id: UUID
    requisition_id: UUID
    name: str
    description: Optional[str]
    status: str
    settings: Dict[str, Any]
    statistics: Dict[str, Any]
    created_at: datetime
    updated_at: datetime
    completed_at: Optional[datetime]

    class Config:
        from_attributes = True


# ============================================================================
# Candidate Models
# ============================================================================

class CandidateCreate(BaseModel):
    """Candidate creation request"""
    campaign_id: Optional[UUID] = None
    phone: str = Field(..., min_length=10, max_length=20)
    pin_code: str = Field(..., min_length=6, max_length=10)
    name: Optional[str] = Field(None, max_length=255)
    email: Optional[EmailStr] = None
    language_detected: str = Field(default="hi-IN", max_length=10)
    inbound_channel: Optional[str] = Field(None, pattern="^(ivr|whatsapp_audio|whatsapp_text)$")

    @validator('phone')
    def validate_phone(cls, v):
        if not v.replace('+', '').replace(' ', '').replace('-', '').isdigit():
            raise ValueError('Phone must contain only digits, spaces, hyphens, and plus sign')
        return v


class CandidateUpdate(BaseModel):
    """Candidate update request"""
    name: Optional[str] = Field(None, max_length=255)
    email: Optional[EmailStr] = None
    status: Optional[str] = Field(None, pattern="^(pending|in_progress|completed|shortlisted|rejected)$")
    geo_data: Optional[Dict[str, Any]] = None
    language_data: Optional[Dict[str, Any]] = None
    demographic_data: Optional[Dict[str, Any]] = None


class CandidateResponse(BaseModel):
    """Candidate response"""
    id: UUID
    campaign_id: Optional[UUID]
    phone: str
    pin_code: str
    name: Optional[str]
    email: Optional[str]
    language_detected: str
    inbound_channel: Optional[str]
    status: str
    geo_data: Dict[str, Any]
    language_data: Dict[str, Any]
    demographic_data: Dict[str, Any]
    enriched_at: Optional[datetime]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class CandidateListResponse(BaseModel):
    """Candidate list response with pagination"""
    candidates: List[CandidateResponse]
    total: int
    page: int
    page_size: int
    total_pages: int


# ============================================================================
# Transcript Models
# ============================================================================

class TranscriptSegment(BaseModel):
    """Transcript segment model"""
    speaker: str
    text: str
    timestamp: float
    confidence: float


class TranscriptCreate(BaseModel):
    """Transcript creation request"""
    candidate_id: UUID
    raw_text: str = Field(..., min_length=1)
    audio_url: Optional[str] = Field(None, max_length=500)
    audio_duration_seconds: Optional[int] = Field(None, ge=0)
    segments: Optional[List[TranscriptSegment]] = None
    confidence_score: Optional[float] = Field(None, ge=0, le=1)


class TranscriptResponse(BaseModel):
    """Transcript response"""
    id: UUID
    candidate_id: UUID
    raw_text: str
    normalized_text: Optional[str]
    language_detected: Optional[str]
    audio_url: Optional[str]
    audio_duration_seconds: Optional[int]
    segments: List[Dict[str, Any]]
    confidence_score: Optional[float]
    normalized: bool
    normalized_at: Optional[datetime]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ============================================================================
# Scorecard Models
# ============================================================================

class ScorecardCreate(BaseModel):
    """Scorecard creation request"""
    candidate_id: UUID
    requisition_id: Optional[UUID] = None
    session_id: Optional[UUID] = None
    overall_score: float = Field(..., ge=0, le=100)
    communication_score: Optional[float] = Field(None, ge=0, le=100)
    domain_knowledge_score: Optional[float] = Field(None, ge=0, le=100)
    situational_judgment_score: Optional[float] = Field(None, ge=0, le=100)
    confidence_score: Optional[float] = Field(None, ge=0, le=100)
    language_fluency: Optional[str] = Field(None, pattern="^(native|proficient|functional)$")
    assessor_notes: Optional[str] = None
    recommended_roles: Optional[List[str]] = None
    shortlist_flag: bool = False
    metrics: Optional[Dict[str, Any]] = None


class ScorecardUpdate(BaseModel):
    """Scorecard update request"""
    overall_score: Optional[float] = Field(None, ge=0, le=100)
    communication_score: Optional[float] = Field(None, ge=0, le=100)
    domain_knowledge_score: Optional[float] = Field(None, ge=0, le=100)
    situational_judgment_score: Optional[float] = Field(None, ge=0, le=100)
    confidence_score: Optional[float] = Field(None, ge=0, le=100)
    language_fluency: Optional[str] = Field(None, pattern="^(native|proficient|functional)$")
    assessor_notes: Optional[str] = None
    recommended_roles: Optional[List[str]] = None
    shortlist_flag: Optional[bool] = None
    metrics: Optional[Dict[str, Any]] = None


class ScorecardResponse(BaseModel):
    """Scorecard response"""
    id: UUID
    candidate_id: UUID
    requisition_id: Optional[UUID]
    session_id: Optional[UUID]
    overall_score: float
    communication_score: Optional[float]
    domain_knowledge_score: Optional[float]
    situational_judgment_score: Optional[float]
    confidence_score: Optional[float]
    language_fluency: Optional[str]
    assessor_notes: Optional[str]
    recommended_roles: Optional[List[str]]
    shortlist_flag: bool
    metrics: Dict[str, Any]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ============================================================================
# Session Models
# ============================================================================

class CandidateSessionCreate(BaseModel):
    """Candidate session creation request"""
    candidate_id: UUID
    session_id: str = Field(..., min_length=1, max_length=100)
    language_detected: str = Field(default="hi-IN", max_length=10)
    inbound_channel: str = Field(default="ivr", pattern="^(ivr|whatsapp_audio|whatsapp_text)$")


class CandidateSessionResponse(BaseModel):
    """Candidate session response"""
    id: UUID
    candidate_id: UUID
    session_id: str
    interview_state: str
    current_question_index: int
    total_questions: int
    interview_duration_seconds: int
    language_detected: str
    inbound_channel: str
    transcript_segments: List[Dict[str, Any]]
    question_responses: List[Dict[str, Any]]
    drop_off_count: int
    last_question_asked: Optional[str]
    recovery_context: Dict[str, Any]
    matched_requisitions: List[Dict[str, Any]]
    created_at: datetime
    last_active_at: datetime
    completed_at: Optional[datetime]

    class Config:
        from_attributes = True


# ============================================================================
# Agent Models
# ============================================================================

class AgentRequest(BaseModel):
    """Agent orchestration request"""
    candidate_id: UUID
    requisition_id: Optional[UUID] = None
    agent_type: str = Field(..., pattern="^(proctor|assessor|matchmaker|orchestrator)$")
    parameters: Optional[Dict[str, Any]] = None


class AgentResponse(BaseModel):
    """Agent response"""
    agent_type: str
    session_id: str
    status: str
    result: Optional[Dict[str, Any]] = None
    error: Optional[str] = None
    execution_time_ms: Optional[float] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class InterviewStartRequest(BaseModel):
    """Interview start request"""
    candidate_id: UUID
    requisition_id: UUID
    language: str = Field(default="hi-IN", max_length=10)
    channel: str = Field(default="ivr", pattern="^(ivr|whatsapp_audio|whatsapp_text)$")
    settings: Optional[Dict[str, Any]] = None


class InterviewStartResponse(BaseModel):
    """Interview start response"""
    session_id: str
    candidate_id: UUID
    requisition_id: UUID
    status: str
    first_question: Optional[str] = None
    estimated_duration_minutes: int = 5
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class InterviewStatusResponse(BaseModel):
    """Interview status response"""
    session_id: str
    candidate_id: UUID
    status: str
    current_question_index: int
    total_questions: int
    interview_duration_seconds: int
    drop_off_count: int
    last_active_at: datetime
    can_resume: bool


# ============================================================================
# Bulk Operations Models
# ============================================================================

class BulkCandidateCreate(BaseModel):
    """Bulk candidate creation request"""
    campaign_id: UUID
    candidates: List[CandidateCreate] = Field(..., min_items=1, max_items=500)


class BulkCandidateResponse(BaseModel):
    """Bulk candidate creation response"""
    campaign_id: UUID
    total_requested: int
    successful: int
    failed: int
    candidate_ids: List[UUID]
    errors: List[Dict[str, Any]]


class BulkShortlistRequest(BaseModel):
    """Bulk shortlist request"""
    requisition_id: UUID
    candidate_ids: List[UUID] = Field(..., min_items=1, max_items=100)
    score_threshold: Optional[int] = Field(None, ge=0, le=100)


class BulkShortlistResponse(BaseModel):
    """Bulk shortlist response"""
    requisition_id: UUID
    total_requested: int
    shortlisted: int
    not_shortlisted: int
    candidate_ids: List[UUID]
    timestamp: datetime = Field(default_factory=datetime.utcnow)


# ============================================================================
# Analytics Models
# ============================================================================

class AnalyticsRequest(BaseModel):
    """Analytics request"""
    company_id: UUID
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    filters: Optional[Dict[str, Any]] = None


class AnalyticsResponse(BaseModel):
    """Analytics response"""
    company_id: UUID
    period: Dict[str, Any]
    metrics: Dict[str, Any]
    breakdown: Optional[Dict[str, Any]] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)


# ============================================================================
# Health Models
# ============================================================================

class HealthCheckResponse(BaseModel):
    """Health check response"""
    status: str
    version: str
    timestamp: datetime
    services: Dict[str, Any]
    uptime_seconds: float


# ============================================================================
# Pagination Models
# ============================================================================

class PaginationParams(BaseModel):
    """Pagination parameters"""
    page: int = Field(default=1, ge=1)
    page_size: int = Field(default=20, ge=1, le=100)
    sort_by: Optional[str] = None
    sort_order: Optional[str] = Field(default="desc", pattern="^(asc|desc)$")


class PaginatedResponse(BaseModel):
    """Generic paginated response"""
    items: List[Any]
    total: int
    page: int
    page_size: int
    total_pages: int
    has_next: bool
    has_previous: bool