"""
AROHAN Authentication API Routes
User authentication and authorization endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.db.database import get_db
from src.auth.service import auth_service
from src.auth.dependencies import (
    get_current_user,
    get_current_user_optional,
    require_admin,
    AuthenticatedUser
)
from src.models.schemas import (
    UserCreate,
    UserLogin,
    LoginResponse,
    UserResponse,
    BaseResponse,
    ErrorResponse
)

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register_user(
    user_data: UserCreate,
    db: AsyncSession = Depends(get_db)
):
    """Register a new user
    
    Args:
        user_data: User creation data
        db: Database session
        
    Returns:
        UserResponse: Created user response
        
    Raises:
        HTTPException: If registration fails
    """
    try:
        return await auth_service.register_user(user_data, db)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {str(e)}"
        )


@router.post("/login", response_model=LoginResponse)
async def login_user(
    login_data: UserLogin,
    db: AsyncSession = Depends(get_db)
):
    """Authenticate user and return tokens
    
    Args:
        login_data: User login data
        db: Database session
        
    Returns:
        LoginResponse: Login response with tokens and user data
        
    Raises:
        HTTPException: If authentication fails
    """
    try:
        return await auth_service.authenticate_user(login_data, db)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Authentication failed: {str(e)}"
        )


@router.post("/refresh", response_model=LoginResponse)
async def refresh_tokens(
    refresh_token: str,
    db: AsyncSession = Depends(get_db)
):
    """Refresh access token using refresh token
    
    Args:
        refresh_token: Refresh token string
        db: Database session
        
    Returns:
        LoginResponse: New login response with fresh tokens
        
    Raises:
        HTTPException: If refresh fails
    """
    try:
        return await auth_service.refresh_tokens(refresh_token, db)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Token refresh failed: {str(e)}"
        )


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    current_user: AuthenticatedUser = Depends(get_current_user)
):
    """Get current authenticated user information
    
    Args:
        current_user: Current authenticated user
        
    Returns:
        UserResponse: Current user information
    """
    try:
        db = await get_db().__anext__()
        return await auth_service.get_user_by_id(current_user.user_id, db)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get user information: {str(e)}"
        )


@router.post("/logout", response_model=BaseResponse)
async def logout_user(
    current_user: AuthenticatedUser = Depends(get_current_user)
):
    """Logout user (client-side token invalidation)
    
    Args:
        current_user: Current authenticated user
        
    Returns:
        BaseResponse: Logout confirmation
    """
    # Note: JWT tokens are stateless, so logout is handled client-side
    # by discarding the tokens. For server-side logout, we would need
    # to implement a token blacklist using Redis.
    
    return BaseResponse(
        success=True,
        message="Logout successful. Please discard your tokens."
    )


@router.post("/change-password", response_model=BaseResponse)
async def change_password(
    current_password: str,
    new_password: str,
    current_user: AuthenticatedUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Change user password
    
    Args:
        current_password: Current password
        new_password: New password
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        BaseResponse: Password change confirmation
        
    Raises:
        HTTPException: If password change fails
    """
    try:
        await auth_service.update_user_password(
            current_user.user_id,
            current_password,
            new_password,
            db
        )
        
        return BaseResponse(
            success=True,
            message="Password changed successfully"
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Password change failed: {str(e)}"
        )


@router.post("/deactivate", response_model=BaseResponse)
async def deactivate_user_account(
    current_user: AuthenticatedUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Deactivate current user account
    
    Args:
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        BaseResponse: Deactivation confirmation
        
    Raises:
        HTTPException: If deactivation fails
    """
    try:
        await auth_service.deactivate_user(current_user.user_id, db)
        
        return BaseResponse(
            success=True,
            message="Account deactivated successfully"
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Account deactivation failed: {str(e)}"
        )


# Admin-only endpoints
@router.post("/admin/users/{user_id}/activate", response_model=BaseResponse)
async def admin_activate_user(
    user_id: str,
    current_user: AuthenticatedUser = Depends(require_admin()),
    db: AsyncSession = Depends(get_db)
):
    """Activate user account (admin only)
    
    Args:
        user_id: User ID to activate
        current_user: Current authenticated admin user
        db: Database session
        
    Returns:
        BaseResponse: Activation confirmation
        
    Raises:
        HTTPException: If activation fails
    """
    try:
        await auth_service.activate_user(user_id, db)
        
        return BaseResponse(
            success=True,
            message="User account activated successfully"
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"User activation failed: {str(e)}"
        )


@router.post("/admin/users/{user_id}/deactivate", response_model=BaseResponse)
async def admin_deactivate_user(
    user_id: str,
    current_user: AuthenticatedUser = Depends(require_admin()),
    db: AsyncSession = Depends(get_db)
):
    """Deactivate user account (admin only)
    
    Args:
        user_id: User ID to deactivate
        current_user: Current authenticated admin user
        db: Database session
        
    Returns:
        BaseResponse: Deactivation confirmation
        
    Raises:
        HTTPException: If deactivation fails
    """
    try:
        await auth_service.deactivate_user(user_id, db)
        
        return BaseResponse(
            success=True,
            message="User account deactivated successfully"
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"User deactivation failed: {str(e)}"
        )


@router.get("/admin/users/{user_id}", response_model=UserResponse)
async def admin_get_user(
    user_id: str,
    current_user: AuthenticatedUser = Depends(require_admin()),
    db: AsyncSession = Depends(get_db)
):
    """Get user by ID (admin only)
    
    Args:
        user_id: User ID to retrieve
        current_user: Current authenticated admin user
        db: Database session
        
    Returns:
        UserResponse: User information
        
    Raises:
        HTTPException: If user retrieval fails
    """
    try:
        user = await auth_service.get_user_by_id(user_id, db)
        
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        return user
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get user: {str(e)}"
        )