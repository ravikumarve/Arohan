"""
AROHAN Authentication Service
User authentication, registration, and token management
"""

from typing import Optional, Dict, Any
from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status

from src.auth.jwt import (
    verify_password,
    get_password_hash,
    create_token_pair,
    refresh_access_token
)
from src.auth.dependencies import AuthenticatedUser
from src.models.database import User, Company
from src.models.schemas import UserCreate, UserLogin, LoginResponse, UserResponse


class AuthService:
    """Authentication service for user management"""
    
    @staticmethod
    async def register_user(
        user_data: UserCreate,
        db: AsyncSession
    ) -> UserResponse:
        """Register a new user
        
        Args:
            user_data: User creation data
            db: Database session
            
        Returns:
            UserResponse: Created user response
            
        Raises:
            HTTPException: If registration fails
        """
        # Check if company exists
        result = await db.execute(
            select(Company).where(Company.id == user_data.company_id)
        )
        company = result.scalar_one_or_none()
        
        if company is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Company not found"
            )
        
        if company.status != "active":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Company account is not active"
            )
        
        # Check if email already exists
        result = await db.execute(
            select(User).where(User.email == user_data.email)
        )
        existing_user = result.scalar_one_or_none()
        
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Check if phone already exists
        if user_data.phone:
            result = await db.execute(
                select(User).where(User.phone == user_data.phone)
            )
            existing_phone = result.scalar_one_or_none()
            
            if existing_phone:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Phone number already registered"
                )
        
        # Hash password
        password_hash = get_password_hash(user_data.password)
        
        # Create user
        user = User(
            company_id=user_data.company_id,
            email=user_data.email,
            phone=user_data.phone,
            name=user_data.name,
            role=user_data.role.value,
            password_hash=password_hash,
            settings=user_data.settings or {}
        )
        
        db.add(user)
        await db.commit()
        await db.refresh(user)
        
        return UserResponse(
            id=user.id,
            company_id=user.company_id,
            email=user.email,
            phone=user.phone,
            name=user.name,
            role=user.role,
            status=user.status,
            last_login=user.last_login,
            settings=user.settings,
            created_at=user.created_at,
            updated_at=user.updated_at
        )
    
    @staticmethod
    async def authenticate_user(
        login_data: UserLogin,
        db: AsyncSession
    ) -> LoginResponse:
        """Authenticate user and return tokens
        
        Args:
            login_data: User login data
            db: Database session
            
        Returns:
            LoginResponse: Login response with tokens and user data
            
        Raises:
            HTTPException: If authentication fails
        """
        # Find user by email
        result = await db.execute(
            select(User).where(User.email == login_data.email)
        )
        user = result.scalar_one_or_none()
        
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Verify password
        if not verify_password(login_data.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Check if user is active
        if user.status != "active":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User account is not active",
            )
        
        # Check if company is active
        result = await db.execute(
            select(Company).where(Company.id == user.company_id)
        )
        company = result.scalar_one_or_none()
        
        if company is None or company.status != "active":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Company account is not active",
            )
        
        # Update last login
        user.last_login = datetime.utcnow()
        await db.commit()
        
        # Create token pair
        tokens = create_token_pair(
            user_id=str(user.id),
            company_id=str(user.company_id),
            role=user.role,
            email=user.email,
            name=user.name
        )
        
        # Return login response
        return LoginResponse(
            access_token=tokens["access_token"],
            token_type=tokens["token_type"],
            user=UserResponse(
                id=user.id,
                company_id=user.company_id,
                email=user.email,
                phone=user.phone,
                name=user.name,
                role=user.role,
                status=user.status,
                last_login=user.last_login,
                settings=user.settings,
                created_at=user.created_at,
                updated_at=user.updated_at
            )
        )
    
    @staticmethod
    async def refresh_tokens(
        refresh_token: str,
        db: AsyncSession
    ) -> LoginResponse:
        """Refresh access token using refresh token
        
        Args:
            refresh_token: Refresh token string
            db: Database session
            
        Returns:
            LoginResponse: New login response with fresh tokens
            
        Raises:
            HTTPException: If refresh fails
        """
        # Refresh access token
        new_tokens = refresh_access_token(refresh_token)
        
        if new_tokens is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Get user ID from new tokens
        user_id = new_tokens.get("sub")
        
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Get user from database
        result = await db.execute(
            select(User).where(User.id == user_id)
        )
        user = result.scalar_one_or_none()
        
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Check if user is active
        if user.status != "active":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User account is not active",
            )
        
        # Return new login response
        return LoginResponse(
            access_token=new_tokens["access_token"],
            token_type=new_tokens["token_type"],
            user=UserResponse(
                id=user.id,
                company_id=user.company_id,
                email=user.email,
                phone=user.phone,
                name=user.name,
                role=user.role,
                status=user.status,
                last_login=user.last_login,
                settings=user.settings,
                created_at=user.created_at,
                updated_at=user.updated_at
            )
        )
    
    @staticmethod
    async def get_user_by_id(
        user_id: str,
        db: AsyncSession
    ) -> Optional[UserResponse]:
        """Get user by ID
        
        Args:
            user_id: User ID
            db: Database session
            
        Returns:
            Optional[UserResponse]: User response or None
        """
        result = await db.execute(
            select(User).where(User.id == user_id)
        )
        user = result.scalar_one_or_none()
        
        if user is None:
            return None
        
        return UserResponse(
            id=user.id,
            company_id=user.company_id,
            email=user.email,
            phone=user.phone,
            name=user.name,
            role=user.role,
            status=user.status,
            last_login=user.last_login,
            settings=user.settings,
            created_at=user.created_at,
            updated_at=user.updated_at
        )
    
    @staticmethod
    async def update_user_password(
        user_id: str,
        current_password: str,
        new_password: str,
        db: AsyncSession
    ) -> bool:
        """Update user password
        
        Args:
            user_id: User ID
            current_password: Current password
            new_password: New password
            db: Database session
            
        Returns:
            bool: True if password updated successfully
            
        Raises:
            HTTPException: If update fails
        """
        # Get user
        result = await db.execute(
            select(User).where(User.id == user_id)
        )
        user = result.scalar_one_or_none()
        
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Verify current password
        if not verify_password(current_password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Current password is incorrect"
            )
        
        # Update password
        user.password_hash = get_password_hash(new_password)
        await db.commit()
        
        return True
    
    @staticmethod
    async def deactivate_user(
        user_id: str,
        db: AsyncSession
    ) -> bool:
        """Deactivate user account
        
        Args:
            user_id: User ID
            db: Database session
            
        Returns:
            bool: True if user deactivated successfully
            
        Raises:
            HTTPException: If deactivation fails
        """
        # Get user
        result = await db.execute(
            select(User).where(User.id == user_id)
        )
        user = result.scalar_one_or_none()
        
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Deactivate user
        user.status = "inactive"
        await db.commit()
        
        return True
    
    @staticmethod
    async def activate_user(
        user_id: str,
        db: AsyncSession
    ) -> bool:
        """Activate user account
        
        Args:
            user_id: User ID
            db: Database session
            
        Returns:
            bool: True if user activated successfully
            
        Raises:
            HTTPException: If activation fails
        """
        # Get user
        result = await db.execute(
            select(User).where(User.id == user_id)
        )
        user = result.scalar_one_or_none()
        
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Activate user
        user.status = "active"
        await db.commit()
        
        return True


# Create authentication service instance
auth_service = AuthService()