"""
Unit Tests for Pydantic Schemas
"""

import pytest
from datetime import datetime
from uuid import UUID, uuid4
from pydantic import ValidationError

from src.models.schemas import (
    CompanyCreate,
    CompanyUpdate,
    CompanyResponse,
    UserCreate,
    UserUpdate,
    UserResponse,
    UserRole,
    UserLogin,
    LoginResponse,
    RequisitionCreate,
    RequisitionUpdate,
    RequisitionResponse,
    CampaignCreate,
    CampaignUpdate,
    CampaignResponse,
    CandidateCreate,
    CandidateUpdate,
    CandidateResponse,
    TranscriptCreate,
    TranscriptResponse,
    TranscriptSegment,
    ScorecardCreate,
    ScorecardUpdate,
    ScorecardResponse,
    BaseResponse,
    ErrorResponse,
    PaginationParams,
    PaginatedResponse
)


class TestCompanySchemas:
    """Test company schemas"""
    
    def test_company_create_valid(self):
        """Test valid company creation"""
        data = {
            "name": "Test Company",
            "domain": "testcompany.com",
            "industry": "Technology",
            "size": "51-200",
            "plan": "growth"
        }
        
        company = CompanyCreate(**data)
        
        assert company.name == "Test Company"
        assert company.domain == "testcompany.com"
        assert company.industry == "Technology"
        assert company.size == "51-200"
        assert company.plan == "growth"
    
    def test_company_create_invalid_domain(self):
        """Test invalid domain validation"""
        data = {
            "name": "Test Company",
            "domain": "invalid domain with spaces",
            "industry": "Technology"
        }
        
        with pytest.raises(ValidationError):
            CompanyCreate(**data)
    
    def test_company_create_invalid_plan(self):
        """Test invalid plan validation"""
        data = {
            "name": "Test Company",
            "domain": "testcompany.com",
            "plan": "invalid_plan"
        }
        
        with pytest.raises(ValidationError):
            CompanyCreate(**data)
    
    def test_company_update_partial(self):
        """Test partial company update"""
        data = {
            "name": "Updated Company",
            "industry": "Finance"
        }
        
        company = CompanyUpdate(**data)
        
        assert company.name == "Updated Company"
        assert company.industry == "Finance"
        assert company.domain is None
        assert company.size is None
    
    def test_company_response(self):
        """Test company response"""
        company_id = uuid4()
        data = {
            "id": company_id,
            "name": "Test Company",
            "domain": "testcompany.com",
            "industry": "Technology",
            "size": "51-200",
            "plan": "growth",
            "status": "active",
            "settings": {},
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        company = CompanyResponse(**data)
        
        assert company.id == company_id
        assert company.name == "Test Company"
        assert company.status == "active"


class TestUserSchemas:
    """Test user schemas"""
    
    def test_user_create_valid(self):
        """Test valid user creation"""
        company_id = uuid4()
        data = {
            "company_id": company_id,
            "email": "test@example.com",
            "phone": "+919876543210",
            "name": "Test User",
            "role": UserRole.ADMIN,
            "password": "TestPassword123!"
        }
        
        user = UserCreate(**data)
        
        assert user.company_id == company_id
        assert user.email == "test@example.com"
        assert user.phone == "+919876543210"
        assert user.name == "Test User"
        assert user.role == UserRole.ADMIN
    
    def test_user_create_invalid_email(self):
        """Test invalid email validation"""
        company_id = uuid4()
        data = {
            "company_id": company_id,
            "email": "invalid-email",
            "name": "Test User",
            "role": UserRole.ADMIN,
            "password": "TestPassword123!"
        }
        
        with pytest.raises(ValidationError):
            UserCreate(**data)
    
    def test_user_create_invalid_phone(self):
        """Test invalid phone validation"""
        company_id = uuid4()
        data = {
            "company_id": company_id,
            "email": "test@example.com",
            "phone": "invalid-phone",
            "name": "Test User",
            "role": UserRole.ADMIN,
            "password": "TestPassword123!"
        }
        
        with pytest.raises(ValidationError):
            UserCreate(**data)
    
    def test_user_create_short_password(self):
        """Test short password validation"""
        company_id = uuid4()
        data = {
            "company_id": company_id,
            "email": "test@example.com",
            "name": "Test User",
            "role": UserRole.ADMIN,
            "password": "short"
        }
        
        with pytest.raises(ValidationError):
            UserCreate(**data)
    
    def test_user_login_valid(self):
        """Test valid user login"""
        data = {
            "email": "test@example.com",
            "password": "TestPassword123!"
        }
        
        login = UserLogin(**data)
        
        assert login.email == "test@example.com"
        assert login.password == "TestPassword123!"
    
    def test_user_login_invalid_email(self):
        """Test invalid email in login"""
        data = {
            "email": "invalid-email",
            "password": "TestPassword123!"
        }
        
        with pytest.raises(ValidationError):
            UserLogin(**data)
    
    def test_login_response(self):
        """Test login response"""
        user_id = uuid4()
        company_id = uuid4()
        data = {
            "access_token": "test_token",
            "token_type": "bearer",
            "user": {
                "id": user_id,
                "company_id": company_id,
                "email": "test@example.com",
                "phone": "+919876543210",
                "name": "Test User",
                "role": "admin",
                "status": "active",
                "last_login": datetime.utcnow(),
                "settings": {},
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
        }
        
        response = LoginResponse(**data)
        
        assert response.access_token == "test_token"
        assert response.token_type == "bearer"
        assert response.user.email == "test@example.com"


class TestRequisitionSchemas:
    """Test requisition schemas"""
    
    def test_requisition_create_valid(self):
        """Test valid requisition creation"""
        data = {
            "title": "Delivery Partner",
            "description": "Delivery partner for last-mile logistics",
            "requirements": {
                "experience": "1+ years",
                "skills": ["driving", "navigation"]
            },
            "score_threshold": 70,
            "geo_radius_km": 10,
            "pin_code": "110001",
            "shift_preference": "flexible",
            "salary_range": "₹20,000-25,000"
        }
        
        requisition = RequisitionCreate(**data)
        
        assert requisition.title == "Delivery Partner"
        assert requisition.score_threshold == 70
        assert requisition.geo_radius_km == 10
        assert requisition.shift_preference == "flexible"
    
    def test_requisition_create_invalid_score(self):
        """Test invalid score threshold"""
        data = {
            "title": "Delivery Partner",
            "score_threshold": 150  # Invalid: > 100
        }
        
        with pytest.raises(ValidationError):
            RequisitionCreate(**data)
    
    def test_requisition_create_invalid_radius(self):
        """Test invalid geo radius"""
        data = {
            "title": "Delivery Partner",
            "geo_radius_km": 150  # Invalid: > 100
        }
        
        with pytest.raises(ValidationError):
            RequisitionCreate(**data)
    
    def test_requisition_create_invalid_shift(self):
        """Test invalid shift preference"""
        data = {
            "title": "Delivery Partner",
            "shift_preference": "invalid_shift"
        }
        
        with pytest.raises(ValidationError):
            RequisitionCreate(**data)


class TestCandidateSchemas:
    """Test candidate schemas"""
    
    def test_candidate_create_valid(self):
        """Test valid candidate creation"""
        campaign_id = uuid4()
        data = {
            "campaign_id": campaign_id,
            "phone": "+919876543210",
            "pin_code": "110001",
            "name": "Test Candidate",
            "email": "candidate@example.com",
            "language_detected": "hi-IN",
            "inbound_channel": "ivr"
        }
        
        candidate = CandidateCreate(**data)
        
        assert candidate.campaign_id == campaign_id
        assert candidate.phone == "+919876543210"
        assert candidate.pin_code == "110001"
        assert candidate.language_detected == "hi-IN"
        assert candidate.inbound_channel == "ivr"
    
    def test_candidate_create_invalid_phone(self):
        """Test invalid phone validation"""
        data = {
            "phone": "invalid-phone",
            "pin_code": "110001"
        }
        
        with pytest.raises(ValidationError):
            CandidateCreate(**data)
    
    def test_candidate_create_invalid_channel(self):
        """Test invalid inbound channel"""
        data = {
            "phone": "+919876543210",
            "pin_code": "110001",
            "inbound_channel": "invalid_channel"
        }
        
        with pytest.raises(ValidationError):
            CandidateCreate(**data)


class TestTranscriptSchemas:
    """Test transcript schemas"""
    
    def test_transcript_create_valid(self):
        """Test valid transcript creation"""
        candidate_id = uuid4()
        data = {
            "candidate_id": candidate_id,
            "raw_text": "Hello, my name is Test Candidate",
            "audio_url": "https://example.com/audio/test.mp3",
            "audio_duration_seconds": 30,
            "segments": [
                {
                    "speaker": "candidate",
                    "text": "Hello, my name is Test Candidate",
                    "timestamp": 0.0,
                    "confidence": 0.95
                }
            ],
            "confidence_score": 0.95
        }
        
        transcript = TranscriptCreate(**data)
        
        assert transcript.candidate_id == candidate_id
        assert transcript.raw_text == "Hello, my name is Test Candidate"
        assert transcript.audio_duration_seconds == 30
        assert transcript.confidence_score == 0.95
    
    def test_transcript_segment_valid(self):
        """Test valid transcript segment"""
        data = {
            "speaker": "candidate",
            "text": "Hello, my name is Test Candidate",
            "timestamp": 0.0,
            "confidence": 0.95
        }
        
        segment = TranscriptSegment(**data)
        
        assert segment.speaker == "candidate"
        assert segment.text == "Hello, my name is Test Candidate"
        assert segment.timestamp == 0.0
        assert segment.confidence == 0.95
    
    def test_transcript_create_invalid_confidence(self):
        """Test invalid confidence score"""
        candidate_id = uuid4()
        data = {
            "candidate_id": candidate_id,
            "raw_text": "Hello",
            "confidence_score": 1.5  # Invalid: > 1.0
        }
        
        with pytest.raises(ValidationError):
            TranscriptCreate(**data)


class TestScorecardSchemas:
    """Test scorecard schemas"""
    
    def test_scorecard_create_valid(self):
        """Test valid scorecard creation"""
        candidate_id = uuid4()
        requisition_id = uuid4()
        data = {
            "candidate_id": candidate_id,
            "requisition_id": requisition_id,
            "overall_score": 85.5,
            "communication_score": 88.0,
            "domain_knowledge_score": 82.0,
            "situational_judgment_score": 86.0,
            "confidence_score": 90.0,
            "language_fluency": "proficient",
            "assessor_notes": "Strong candidate",
            "recommended_roles": ["Delivery Partner", "Warehouse Associate"],
            "shortlist_flag": True
        }
        
        scorecard = ScorecardCreate(**data)
        
        assert scorecard.candidate_id == candidate_id
        assert scorecard.overall_score == 85.5
        assert scorecard.communication_score == 88.0
        assert scorecard.language_fluency == "proficient"
        assert scorecard.shortlist_flag is True
    
    def test_scorecard_create_invalid_score(self):
        """Test invalid overall score"""
        candidate_id = uuid4()
        data = {
            "candidate_id": candidate_id,
            "overall_score": 150.0  # Invalid: > 100
        }
        
        with pytest.raises(ValidationError):
            ScorecardCreate(**data)
    
    def test_scorecard_create_invalid_fluency(self):
        """Test invalid language fluency"""
        candidate_id = uuid4()
        data = {
            "candidate_id": candidate_id,
            "overall_score": 85.0,
            "language_fluency": "invalid_fluency"
        }
        
        with pytest.raises(ValidationError):
            ScorecardCreate(**data)


class TestBaseSchemas:
    """Test base schemas"""
    
    def test_base_response(self):
        """Test base response"""
        response = BaseResponse(
            success=True,
            message="Operation successful"
        )
        
        assert response.success is True
        assert response.message == "Operation successful"
        assert response.timestamp is not None
    
    def test_error_response(self):
        """Test error response"""
        response = ErrorResponse(
            error="Validation Error",
            message="Invalid input data",
            details={"field": "email"}
        )
        
        assert response.success is False
        assert response.error == "Validation Error"
        assert response.message == "Invalid input data"
        assert response.details == {"field": "email"}
    
    def test_pagination_params(self):
        """Test pagination parameters"""
        params = PaginationParams(
            page=2,
            page_size=50,
            sort_by="created_at",
            sort_order="desc"
        )
        
        assert params.page == 2
        assert params.page_size == 50
        assert params.sort_by == "created_at"
        assert params.sort_order == "desc"
    
    def test_pagination_params_defaults(self):
        """Test pagination parameter defaults"""
        params = PaginationParams()
        
        assert params.page == 1
        assert params.page_size == 20
        assert params.sort_by is None
        assert params.sort_order == "desc"
    
    def test_pagination_params_invalid_page(self):
        """Test invalid page number"""
        with pytest.raises(ValidationError):
            PaginationParams(page=0)
    
    def test_pagination_params_invalid_page_size(self):
        """Test invalid page size"""
        with pytest.raises(ValidationError):
            PaginationParams(page_size=150)  # Invalid: > 100
    
    def test_paginated_response(self):
        """Test paginated response"""
        response = PaginatedResponse(
            items=[{"id": 1}, {"id": 2}],
            total=100,
            page=1,
            page_size=20,
            total_pages=5,
            has_next=True,
            has_previous=False
        )
        
        assert len(response.items) == 2
        assert response.total == 100
        assert response.page == 1
        assert response.page_size == 20
        assert response.total_pages == 5
        assert response.has_next is True
        assert response.has_previous is False


if __name__ == "__main__":
    pytest.main([__file__, "-v"])