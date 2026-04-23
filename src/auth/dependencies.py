"""
AROHAN Authentication Dependencies
FastAPI dependencies for JWT authentication and authorization
"""

from typing import Optional, List
from fastapi import Depends, HTTPException, status, Header
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from src.auth.jwt import (
    verify_token,
    get_token_user_id,
    get_token_company_id,
    get_token_role,
    is_token_expired
)
from src.db.database import get_db
from src.models.database import User, Company
from src.models.schemas import UserRole

# HTTP Bearer security scheme
security = HTTPBearer()


class AuthenticatedUser:
    """Authenticated user context"""
    def __init__(
        self,
        user_id: str,
        company_id: str,
        role: str,
        email: str,
        name: str
    ):
        self.user_id = user_id
        self.company_id = company_id
        self.role = role
        self.email = email
        self.name = name
    
    @property
    def is_admin(self) -> bool:
        """Check if user is admin"""
        return self.role == UserRole.ADMIN.value
    
    @property
    def is_viewer(self) -> bool:
        """Check if user is viewer"""
        return self.role == UserRole.VIEWER.value
    
    @property
    def is_recruiter(self) -> bool:
        """Check if user is recruiter"""
        return self.role == UserRole.RECRUITER.value
    
    def has_permission(self, required_role: UserRole) -> bool:
        """Check if user has required permission
        
        Args:
            required_role: Required role for permission
            
        Returns:
            bool: True if user has permission
        """
        # Admin has all permissions
        if self.is_admin:
            return True
        
        # Check role hierarchy
        role_hierarchy = {
            UserRole.ADMIN.value: 3,
            UserRole.RECRUITER.value: 2,
            UserRole.VIEWER.value: 1
        }
        
        user_level = role_hierarchy.get(self.role, 0)
        required_level = role_hierarchy.get(required_role.value, 0)
        
        return user_level >= required_level


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db)
) -> AuthenticatedUser:
    """Get current authenticated user from JWT token
    
    Args:
        credentials: HTTP Bearer credentials
        db: Database session
        
    Returns:
        AuthenticatedUser: Authenticated user context
        
    Raises:
        HTTPException: If authentication fails
    """
    token = credentials.credentials
    
    # Verify token
    payload = verify_token(token, "access")
    
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Check if token is expired
    if is_token_expired(token):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Get user ID from token
    user_id = get_token_user_id(token)
    
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Verify user exists in database
    result = await db.execute(select(User).where(User.id == user_id))
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
    
    # Check if company is active
    result = await db.execute(select(Company).where(Company.id == user.company_id))
    company = result.scalar_one_or_none()
    
    if company is None or company.status != "active":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Company account is not active",
        )
    
    # Return authenticated user context
    return AuthenticatedUser(
        user_id=str(user.id),
        company_id=str(user.company_id),
        role=user.role,
        email=user.email,
        name=user.name
    )


async def get_current_user_optional(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(HTTPBearer(auto_error=False)),
    db: AsyncSession = Depends(get_db)
) -> Optional[AuthenticatedUser]:
    """Get current authenticated user (optional)
    
    Args:
        credentials: Optional HTTP Bearer credentials
        db: Database session
        
    Returns:
        Optional[AuthenticatedUser]: Authenticated user context or None
    """
    if credentials is None:
        return None
    
    try:
        return await get_current_user(credentials, db)
    except HTTPException:
        return None


def require_role(required_role: UserRole):
    """Dependency factory for role-based access control
    
    Args:
        required_role: Required role for access
        
    Returns:
        Dependency function
    """
    async def role_checker(
        current_user: AuthenticatedUser = Depends(get_current_user)
    ) -> AuthenticatedUser:
        """Check if user has required role
        
        Args:
            current_user: Current authenticated user
            
        Returns:
            AuthenticatedUser: Authenticated user context
            
        Raises:
            HTTPException: If user doesn't have required role
        """
        if not current_user.has_permission(required_role):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Insufficient permissions. Required role: {required_role.value}",
            )
        
        return current_user
    
    return role_checker


def require_admin():
    """Dependency for admin-only access
    
    Returns:
        Dependency function
    """
    return require_role(UserRole.ADMIN)


def require_recruiter():
    """Dependency for recruiter or admin access
    
    Returns:
        Dependency function
    """
    return require_role(UserRole.RECRUITER)


def require_viewer():
    """Dependency for viewer, recruiter, or admin access
    
    Returns:
        Dependency function
    """
    return require_role(UserRole.VIEWER)


def require_company_access(company_id: str):
    """Dependency for company-specific access control
    
    Args:
        company_id: Company ID to check access against
        
    Returns:
        Dependency function
    """
    async def company_checker(
        current_user: AuthenticatedUser = Depends(get_current_user)
    ) -> AuthenticatedUser:
        """Check if user has access to company
        
        Args:
            current_user: Current authenticated user
            
        Returns:
            AuthenticatedUser: Authenticated user context
            
        Raises:
            HTTPException: If user doesn't have access to company
        """
        # Admins can access any company
        if current_user.is_admin:
            return current_user
        
        # Check if user belongs to the company
        if current_user.company_id != company_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have access to this company's resources",
            )
        
        return current_user
    
    return company_checker


def get_company_id_from_user(
    current_user: AuthenticatedUser = Depends(get_current_user)
) -> str:
    """Get company ID from authenticated user
    
    Args:
        current_user: Current authenticated user
        
    Returns:
        str: Company ID
    """
    return current_user.company_id


def get_user_id_from_user(
    current_user: AuthenticatedUser = Depends(get_current_user)
) -> str:
    """Get user ID from authenticated user
    
    Args:
        current_user: Current authenticated user
        
    Returns:
        str: User ID
    """
    return current_user.user_id


def get_user_role_from_user(
    current_user: AuthenticatedUser = Depends(get_current_user)
) -> str:
    """Get user role from authenticated user
    
    Args:
        current_user: Current authenticated user
        
    Returns:
        str: User role
    """
    return current_user.role


# Rate limiting dependencies
async def check_rate_limit(
    user_id: str,
    endpoint: str,
    limit: int = 100,
    window: int = 60
) -> bool:
    """Check if user has exceeded rate limit
    
    Args:
        user_id: User ID
        endpoint: Endpoint being accessed
        limit: Rate limit (requests per window)
        window: Time window in seconds
        
    Returns:
        bool: True if rate limit not exceeded
    """
    # TODO: Implement rate limiting using Redis
    # For now, always return True
    return True


def rate_limit(limit: int = 100, window: int = 60):
    """Dependency factory for rate limiting
    
    Args:
        limit: Rate limit (requests per window)
        window: Time window in seconds
        
    Returns:
        Dependency function
    """
    async def rate_limiter(
        current_user: AuthenticatedUser = Depends(get_current_user),
        endpoint: str = Header("", alias="X-Endpoint")
    ) -> AuthenticatedUser:
        """Check rate limit
        
        Args:
            current_user: Current authenticated user
            endpoint: Endpoint being accessed
            
        Returns:
            AuthenticatedUser: Authenticated user context
            
        Raises:
            HTTPException: If rate limit exceeded
        """
        if not await check_rate_limit(current_user.user_id, endpoint, limit, window):
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"Rate limit exceeded. Maximum {limit} requests per {window} seconds.",
            )
        
        return current_user
    
    return rate_limiter


# IP-based access control
async def check_ip_whitelist(ip_address: str, company_id: str) -> bool:
    """Check if IP address is whitelisted for company
    
    Args:
        ip_address: IP address to check
        company_id: Company ID
        
    Returns:
        bool: True if IP is whitelisted
    """
    # TODO: Implement IP whitelist checking
    # For now, always return True
    return True


def require_ip_whitelist():
    """Dependency for IP whitelist access control
    
    Returns:
        Dependency function
    """
    async def ip_checker(
        current_user: AuthenticatedUser = Depends(get_current_user),
        client_ip: str = Header("", alias="X-Real-IP")
    ) -> AuthenticatedUser:
        """Check if IP is whitelisted
        
        Args:
            current_user: Current authenticated user
            client_ip: Client IP address
            
        Returns:
            AuthenticatedUser: Authenticated user context
            
        Raises:
            HTTPException: If IP is not whitelisted
        """
        if not await check_ip_whitelist(client_ip, current_user.company_id):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Your IP address is not authorized to access this resource",
            )
        
        return current_user
    
    return ip_checker