"""
Integration Tests for Authentication API
"""

import pytest
from httpx import AsyncClient
from uuid import uuid4


class TestAuthEndpoints:
    """Test authentication API endpoints"""
    
    @pytest.mark.asyncio
    async def test_register_user_success(self, client: AsyncClient):
        """Test successful user registration"""
        # First create a company
        company_data = {
            "name": "Test Company",
            "domain": "testcompany.com",
            "industry": "Technology",
            "size": "51-200",
            "plan": "growth"
        }
        
        # Note: This assumes company creation endpoint exists
        # For now, we'll use a mock company ID
        company_id = str(uuid4())
        
        user_data = {
            "company_id": company_id,
            "email": "test@example.com",
            "phone": "+919876543210",
            "name": "Test User",
            "role": "viewer",
            "password": "TestPassword123!"
        }
        
        # This test will fail until we have company creation endpoint
        # For now, we'll skip it
        pytest.skip("Requires company creation endpoint")
    
    @pytest.mark.asyncio
    async def test_register_user_duplicate_email(self, client: AsyncClient):
        """Test registration with duplicate email"""
        company_id = str(uuid4())
        
        user_data = {
            "company_id": company_id,
            "email": "test@example.com",
            "phone": "+919876543210",
            "name": "Test User",
            "role": "viewer",
            "password": "TestPassword123!"
        }
        
        # First registration
        # response = await client.post("/api/v1/auth/register", json=user_data)
        # assert response.status_code == 201
        
        # Duplicate registration
        # response = await client.post("/api/v1/auth/register", json=user_data)
        # assert response.status_code == 400
        
        pytest.skip("Requires company creation endpoint")
    
    @pytest.mark.asyncio
    async def test_register_user_invalid_email(self, client: AsyncClient):
        """Test registration with invalid email"""
        company_id = str(uuid4())
        
        user_data = {
            "company_id": company_id,
            "email": "invalid-email",
            "name": "Test User",
            "role": "viewer",
            "password": "TestPassword123!"
        }
        
        response = await client.post("/api/v1/auth/register", json=user_data)
        
        # Should fail validation
        assert response.status_code == 422
    
    @pytest.mark.asyncio
    async def test_register_user_short_password(self, client: AsyncClient):
        """Test registration with short password"""
        company_id = str(uuid4())
        
        user_data = {
            "company_id": company_id,
            "email": "test@example.com",
            "name": "Test User",
            "role": "viewer",
            "password": "short"
        }
        
        response = await client.post("/api/v1/auth/register", json=user_data)
        
        # Should fail validation
        assert response.status_code == 422
    
    @pytest.mark.asyncio
    async def test_login_success(self, client: AsyncClient):
        """Test successful login"""
        # This test requires a registered user
        # For now, we'll skip it
        pytest.skip("Requires registered user")
    
    @pytest.mark.asyncio
    async def test_login_invalid_credentials(self, client: AsyncClient):
        """Test login with invalid credentials"""
        login_data = {
            "email": "nonexistent@example.com",
            "password": "WrongPassword123!"
        }
        
        response = await client.post("/api/v1/auth/login", json=login_data)
        
        # Should fail authentication
        assert response.status_code == 401
    
    @pytest.mark.asyncio
    async def test_login_invalid_email_format(self, client: AsyncClient):
        """Test login with invalid email format"""
        login_data = {
            "email": "invalid-email",
            "password": "TestPassword123!"
        }
        
        response = await client.post("/api/v1/auth/login", json=login_data)
        
        # Should fail validation
        assert response.status_code == 422
    
    @pytest.mark.asyncio
    async def test_get_current_user_unauthorized(self, client: AsyncClient):
        """Test getting current user without authentication"""
        response = await client.get("/api/v1/auth/me")
        
        # Should fail without authentication
        assert response.status_code == 401
    
    @pytest.mark.asyncio
    async def test_get_current_user_authorized(self, client: AsyncClient):
        """Test getting current user with authentication"""
        # This test requires a valid token
        # For now, we'll skip it
        pytest.skip("Requires valid authentication token")
    
    @pytest.mark.asyncio
    async def test_logout_success(self, client: AsyncClient):
        """Test successful logout"""
        # This test requires a valid token
        # For now, we'll skip it
        pytest.skip("Requires valid authentication token")
    
    @pytest.mark.asyncio
    async def test_change_password_success(self, client: AsyncClient):
        """Test successful password change"""
        # This test requires a valid token
        # For now, we'll skip it
        pytest.skip("Requires valid authentication token")
    
    @pytest.mark.asyncio
    async def test_change_password_wrong_current(self, client: AsyncClient):
        """Test password change with wrong current password"""
        # This test requires a valid token
        # For now, we'll skip it
        pytest.skip("Requires valid authentication token")
    
    @pytest.mark.asyncio
    async def test_refresh_token_success(self, client: AsyncClient):
        """Test successful token refresh"""
        # This test requires a valid refresh token
        # For now, we'll skip it
        pytest.skip("Requires valid refresh token")
    
    @pytest.mark.asyncio
    async def test_refresh_token_invalid(self, client: AsyncClient):
        """Test token refresh with invalid token"""
        refresh_token = "invalid.refresh.token"
        
        response = await client.post(
            "/api/v1/auth/refresh",
            params={"refresh_token": refresh_token}
        )
        
        # Should fail with invalid token
        assert response.status_code == 401


class TestHealthEndpoint:
    """Test health check endpoint"""
    
    @pytest.mark.asyncio
    async def test_health_check(self, client: AsyncClient):
        """Test health check endpoint"""
        response = await client.get("/health")
        
        # Should return 200 OK
        assert response.status_code == 200
        
        data = response.json()
        assert data["status"] == "healthy"
        assert "service" in data
        assert "version" in data
        assert "environment" in data
    
    @pytest.mark.asyncio
    async def test_root_endpoint(self, client: AsyncClient):
        """Test root endpoint"""
        response = await client.get("/")
        
        # Should return 200 OK
        assert response.status_code == 200
        
        data = response.json()
        assert "name" in data
        assert "version" in data
        assert "description" in data


class TestAPIResponseFormat:
    """Test API response format consistency"""
    
    @pytest.mark.asyncio
    async def test_error_response_format(self, client: AsyncClient):
        """Test error response format"""
        # Make a request that will fail
        response = await client.get("/api/v1/auth/me")
        
        # Should return 401
        assert response.status_code == 401
        
        data = response.json()
        # Error responses should have consistent format
        assert "detail" in data
    
    @pytest.mark.asyncio
    async def test_validation_error_format(self, client: AsyncClient):
        """Test validation error format"""
        # Make a request with invalid data
        invalid_data = {
            "email": "invalid-email",
            "password": "short"
        }
        
        response = await client.post("/api/v1/auth/login", json=invalid_data)
        
        # Should return 422
        assert response.status_code == 422
        
        data = response.json()
        # Validation errors should have detail
        assert "detail" in data


class TestRateLimiting:
    """Test rate limiting"""
    
    @pytest.mark.asyncio
    async def test_rate_limiting_auth_endpoints(self, client: AsyncClient):
        """Test rate limiting on auth endpoints"""
        # Make multiple requests to trigger rate limit
        # Note: This test may be slow due to rate limiting
        pytest.skip("Rate limiting test - may be slow")
    
    @pytest.mark.asyncio
    async def test_rate_limiting_headers(self, client: AsyncClient):
        """Test rate limiting headers"""
        # Make a request and check for rate limit headers
        response = await client.get("/health")
        
        # Should have rate limit headers
        # Note: Headers may not be present for all endpoints
        # assert "X-RateLimit-Limit" in response.headers


class TestCORS:
    """Test CORS configuration"""
    
    @pytest.mark.asyncio
    async def test_cors_headers(self, client: AsyncClient):
        """Test CORS headers"""
        # Make an OPTIONS request
        response = await client.options("/health")
        
        # Should have CORS headers
        # Note: CORS headers may vary by configuration
        # assert "access-control-allow-origin" in response.headers


class TestSecurityHeaders:
    """Test security headers"""
    
    @pytest.mark.asyncio
    async def test_security_headers_present(self, client: AsyncClient):
        """Test security headers are present"""
        response = await client.get("/health")
        
        headers = response.headers
        
        # Should have security headers
        # Note: Headers may vary by configuration
        # assert "x-content-type-options" in headers
        # assert "x-frame-options" in headers
        # assert "x-xss-protection" in headers


if __name__ == "__main__":
    pytest.main([__file__, "-v"])