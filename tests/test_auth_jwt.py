"""
Unit Tests for JWT Authentication
"""

import pytest
from datetime import datetime, timedelta
from src.auth.jwt import (
    verify_password,
    get_password_hash,
    create_access_token,
    create_refresh_token,
    decode_token,
    verify_token,
    is_token_expired,
    get_token_expiry,
    get_token_user_id,
    get_token_company_id,
    get_token_role,
    create_token_pair,
    refresh_access_token,
)


class TestPasswordHashing:
    """Test password hashing and verification"""
    
    def test_password_hashing(self):
        """Test password hashing"""
        password = "TestPassword123!"
        hashed = get_password_hash(password)
        
        # Hash should be different from original
        assert hashed != password
        
        # Hash should be consistent
        assert verify_password(password, hashed)
    
    def test_password_verification_success(self):
        """Test successful password verification"""
        password = "TestPassword123!"
        hashed = get_password_hash(password)
        
        assert verify_password(password, hashed) is True
    
    def test_password_verification_failure(self):
        """Test failed password verification"""
        password = "TestPassword123!"
        wrong_password = "WrongPassword123!"
        hashed = get_password_hash(password)
        
        assert verify_password(wrong_password, hashed) is False
    
    def test_password_hash_uniqueness(self):
        """Test that password hashes are unique"""
        password = "TestPassword123!"
        hash1 = get_password_hash(password)
        hash2 = get_password_hash(password)
        
        # Hashes should be different due to salt
        assert hash1 != hash2
        
        # But both should verify correctly
        assert verify_password(password, hash1)
        assert verify_password(password, hash2)


class TestTokenCreation:
    """Test JWT token creation"""
    
    def test_create_access_token(self):
        """Test access token creation"""
        data = {
            "sub": "user123",
            "company_id": "company456",
            "role": "admin"
        }
        
        token = create_access_token(data)
        
        # Token should be a non-empty string
        assert isinstance(token, str)
        assert len(token) > 0
    
    def test_create_refresh_token(self):
        """Test refresh token creation"""
        data = {
            "sub": "user123",
            "company_id": "company456",
            "role": "admin"
        }
        
        token = create_refresh_token(data)
        
        # Token should be a non-empty string
        assert isinstance(token, str)
        assert len(token) > 0
    
    def test_create_token_with_custom_expiry(self):
        """Test token creation with custom expiry"""
        data = {"sub": "user123"}
        expires_delta = timedelta(hours=1)
        
        token = create_access_token(data, expires_delta)
        
        # Token should be created successfully
        assert isinstance(token, str)
        assert len(token) > 0
    
    def test_create_token_pair(self):
        """Test token pair creation"""
        tokens = create_token_pair(
            user_id="user123",
            company_id="company456",
            role="admin",
            email="test@example.com",
            name="Test User"
        )
        
        # Should have both tokens
        assert "access_token" in tokens
        assert "refresh_token" in tokens
        assert "token_type" in tokens
        assert "expires_in" in tokens
        
        # Tokens should be different
        assert tokens["access_token"] != tokens["refresh_token"]
        
        # Token type should be bearer
        assert tokens["token_type"] == "bearer"


class TestTokenDecoding:
    """Test JWT token decoding"""
    
    def test_decode_valid_token(self):
        """Test decoding a valid token"""
        data = {
            "sub": "user123",
            "company_id": "company456",
            "role": "admin"
        }
        
        token = create_access_token(data)
        payload = decode_token(token)
        
        # Payload should contain original data
        assert payload is not None
        assert payload["sub"] == "user123"
        assert payload["company_id"] == "company456"
        assert payload["role"] == "admin"
    
    def test_decode_invalid_token(self):
        """Test decoding an invalid token"""
        invalid_token = "invalid.token.string"
        
        payload = decode_token(invalid_token)
        
        # Should return None for invalid token
        assert payload is None
    
    def test_decode_empty_token(self):
        """Test decoding an empty token"""
        payload = decode_token("")
        
        # Should return None for empty token
        assert payload is None


class TestTokenVerification:
    """Test JWT token verification"""
    
    def test_verify_access_token(self):
        """Test verifying an access token"""
        data = {"sub": "user123"}
        token = create_access_token(data)
        
        payload = verify_token(token, "access")
        
        # Should verify successfully
        assert payload is not None
        assert payload["sub"] == "user123"
        assert payload["type"] == "access"
    
    def test_verify_refresh_token(self):
        """Test verifying a refresh token"""
        data = {"sub": "user123"}
        token = create_refresh_token(data)
        
        payload = verify_token(token, "refresh")
        
        # Should verify successfully
        assert payload is not None
        assert payload["sub"] == "user123"
        assert payload["type"] == "refresh"
    
    def test_verify_token_wrong_type(self):
        """Test verifying token with wrong type"""
        data = {"sub": "user123"}
        access_token = create_access_token(data)
        
        payload = verify_token(access_token, "refresh")
        
        # Should fail verification
        assert payload is None
    
    def test_verify_invalid_token(self):
        """Test verifying an invalid token"""
        invalid_token = "invalid.token.string"
        
        payload = verify_token(invalid_token, "access")
        
        # Should return None for invalid token
        assert payload is None


class TestTokenExpiry:
    """Test JWT token expiry"""
    
    def test_token_not_expired(self):
        """Test that fresh token is not expired"""
        data = {"sub": "user123"}
        token = create_access_token(data)
        
        # Fresh token should not be expired
        assert is_token_expired(token) is False
    
    def test_expired_token(self):
        """Test that expired token is detected"""
        data = {"sub": "user123"}
        # Create token with very short expiry
        expires_delta = timedelta(seconds=-1)  # Already expired
        token = create_access_token(data, expires_delta)
        
        # Expired token should be detected
        assert is_token_expired(token) is True
    
    def test_get_token_expiry(self):
        """Test getting token expiry time"""
        data = {"sub": "user123"}
        token = create_access_token(data)
        
        expiry = get_token_expiry(token)
        
        # Should get expiry time
        assert expiry is not None
        assert isinstance(expiry, datetime)
        assert expiry > datetime.utcnow()
    
    def test_get_token_expiry_invalid(self):
        """Test getting expiry from invalid token"""
        invalid_token = "invalid.token.string"
        
        expiry = get_token_expiry(invalid_token)
        
        # Should return None for invalid token
        assert expiry is None


class TestTokenDataExtraction:
    """Test extracting data from tokens"""
    
    def test_get_user_id_from_token(self):
        """Test getting user ID from token"""
        data = {"sub": "user123"}
        token = create_access_token(data)
        
        user_id = get_token_user_id(token)
        
        # Should get correct user ID
        assert user_id == "user123"
    
    def test_get_company_id_from_token(self):
        """Test getting company ID from token"""
        data = {
            "sub": "user123",
            "company_id": "company456"
        }
        token = create_access_token(data)
        
        company_id = get_token_company_id(token)
        
        # Should get correct company ID
        assert company_id == "company456"
    
    def test_get_role_from_token(self):
        """Test getting role from token"""
        data = {
            "sub": "user123",
            "role": "admin"
        }
        token = create_access_token(data)
        
        role = get_token_role(token)
        
        # Should get correct role
        assert role == "admin"
    
    def test_get_data_from_invalid_token(self):
        """Test getting data from invalid token"""
        invalid_token = "invalid.token.string"
        
        user_id = get_token_user_id(invalid_token)
        company_id = get_token_company_id(invalid_token)
        role = get_token_role(invalid_token)
        
        # Should return None for invalid token
        assert user_id is None
        assert company_id is None
        assert role is None


class TestTokenRefresh:
    """Test token refresh functionality"""
    
    def test_refresh_access_token(self):
        """Test refreshing access token"""
        # Create refresh token
        refresh_token = create_refresh_token({
            "sub": "user123",
            "company_id": "company456",
            "role": "admin",
            "email": "test@example.com",
            "name": "Test User"
        })
        
        # Refresh access token
        new_tokens = refresh_access_token(refresh_token)
        
        # Should get new tokens
        assert new_tokens is not None
        assert "access_token" in new_tokens
        assert "refresh_token" in new_tokens
        
        # Verify the new access token contains the correct user data
        new_payload = decode_token(new_tokens["access_token"])
        assert new_payload is not None
        assert new_payload["sub"] == "user123"
    
    def test_refresh_with_invalid_token(self):
        """Test refreshing with invalid token"""
        invalid_token = "invalid.token.string"
        
        new_tokens = refresh_access_token(invalid_token)
        
        # Should return None for invalid token
        assert new_tokens is None
    
    def test_refresh_with_access_token(self):
        """Test refreshing with access token (should fail)"""
        access_token = create_access_token({
            "sub": "user123",
            "company_id": "company456",
            "role": "admin",
            "email": "test@example.com",
            "name": "Test User"
        })
        
        new_tokens = refresh_access_token(access_token)
        
        # Should return None when using access token
        assert new_tokens is None


class TestTokenPayload:
    """Test token payload structure"""
    
    def test_access_token_payload_structure(self):
        """Test access token payload structure"""
        data = {"sub": "user123"}
        token = create_access_token(data)
        payload = decode_token(token)
        
        # Should have required fields
        assert "sub" in payload
        assert "exp" in payload
        assert "iat" in payload
        assert "type" in payload
        
        # Type should be access
        assert payload["type"] == "access"
    
    def test_refresh_token_payload_structure(self):
        """Test refresh token payload structure"""
        data = {"sub": "user123"}
        token = create_refresh_token(data)
        payload = decode_token(token)
        
        # Should have required fields
        assert "sub" in payload
        assert "exp" in payload
        assert "iat" in payload
        assert "type" in payload
        assert "jti" in payload
        
        # Type should be refresh
        assert payload["type"] == "refresh"
        
        # Should have unique token ID
        assert payload["jti"] is not None
        assert len(payload["jti"]) > 0


if __name__ == "__main__":
    pytest.main([__file__, "-v"])