"""
AROHAN Role-Based Access Control (RBAC)
Comprehensive permission and role management system
"""

from enum import Enum
from typing import List, Set, Dict, Any, Optional
from functools import wraps
from fastapi import HTTPException, status

from src.models.schemas import UserRole


# ============================================================================
# Permission Definitions
# ============================================================================

class Permission(str, Enum):
    """System permissions"""
    
    # Company management
    COMPANY_READ = "company:read"
    COMPANY_WRITE = "company:write"
    COMPANY_DELETE = "company:delete"
    COMPANY_SETTINGS = "company:settings"
    
    # User management
    USER_READ = "user:read"
    USER_WRITE = "user:write"
    USER_DELETE = "user:delete"
    USER_INVITE = "user:invite"
    
    # Requisition management
    REQUISITION_READ = "requisition:read"
    REQUISITION_WRITE = "requisition:write"
    REQUISITION_DELETE = "requisition:delete"
    REQUISITION_PUBLISH = "requisition:publish"
    
    # Campaign management
    CAMPAIGN_READ = "campaign:read"
    CAMPAIGN_WRITE = "campaign:write"
    CAMPAIGN_DELETE = "campaign:delete"
    CAMPAIGN_LAUNCH = "campaign:launch"
    
    # Candidate management
    CANDIDATE_READ = "candidate:read"
    CANDIDATE_WRITE = "candidate:write"
    CANDIDATE_DELETE = "candidate:delete"
    CANDIDATE_SHORTLIST = "candidate:shortlist"
    CANDIDATE_REJECT = "candidate:reject"
    
    # Interview management
    INTERVIEW_READ = "interview:read"
    INTERVIEW_WRITE = "interview:write"
    INTERVIEW_DELETE = "interview:delete"
    INTERVIEW_START = "interview:start"
    INTERVIEW_STOP = "interview:stop"
    
    # Scorecard management
    SCORECARD_READ = "scorecard:read"
    SCORECARD_WRITE = "scorecard:write"
    SCORECARD_DELETE = "scorecard:delete"
    
    # Analytics and reporting
    ANALYTICS_READ = "analytics:read"
    ANALYTICS_EXPORT = "analytics:export"
    REPORTS_READ = "reports:read"
    REPORTS_GENERATE = "reports:generate"
    
    # System administration
    SYSTEM_READ = "system:read"
    SYSTEM_WRITE = "system:write"
    SYSTEM_ADMIN = "system:admin"
    
    # Audit and compliance
    AUDIT_READ = "audit:read"
    AUDIT_EXPORT = "audit:export"
    
    # API access
    API_READ = "api:read"
    API_WRITE = "api:write"
    API_DELETE = "api:delete"
    
    # Agent management
    AGENT_READ = "agent:read"
    AGENT_WRITE = "agent:write"
    AGENT_EXECUTE = "agent:execute"
    
    # Integration management
    INTEGRATION_READ = "integration:read"
    INTEGRATION_WRITE = "integration:write"
    INTEGRATION_DELETE = "integration:delete"


# ============================================================================
# Role-Permission Mappings
# ============================================================================

ROLE_PERMISSIONS: Dict[UserRole, Set[Permission]] = {
    # Admin has all permissions
    UserRole.ADMIN: {
        # Company management
        Permission.COMPANY_READ,
        Permission.COMPANY_WRITE,
        Permission.COMPANY_DELETE,
        Permission.COMPANY_SETTINGS,
        
        # User management
        Permission.USER_READ,
        Permission.USER_WRITE,
        Permission.USER_DELETE,
        Permission.USER_INVITE,
        
        # Requisition management
        Permission.REQUISITION_READ,
        Permission.REQUISITION_WRITE,
        Permission.REQUISITION_DELETE,
        Permission.REQUISITION_PUBLISH,
        
        # Campaign management
        Permission.CAMPAIGN_READ,
        Permission.CAMPAIGN_WRITE,
        Permission.CAMPAIGN_DELETE,
        Permission.CAMPAIGN_LAUNCH,
        
        # Candidate management
        Permission.CANDIDATE_READ,
        Permission.CANDIDATE_WRITE,
        Permission.CANDIDATE_DELETE,
        Permission.CANDIDATE_SHORTLIST,
        Permission.CANDIDATE_REJECT,
        
        # Interview management
        Permission.INTERVIEW_READ,
        Permission.INTERVIEW_WRITE,
        Permission.INTERVIEW_DELETE,
        Permission.INTERVIEW_START,
        Permission.INTERVIEW_STOP,
        
        # Scorecard management
        Permission.SCORECARD_READ,
        Permission.SCORECARD_WRITE,
        Permission.SCORECARD_DELETE,
        
        # Analytics and reporting
        Permission.ANALYTICS_READ,
        Permission.ANALYTICS_EXPORT,
        Permission.REPORTS_READ,
        Permission.REPORTS_GENERATE,
        
        # System administration
        Permission.SYSTEM_READ,
        Permission.SYSTEM_WRITE,
        Permission.SYSTEM_ADMIN,
        
        # Audit and compliance
        Permission.AUDIT_READ,
        Permission.AUDIT_EXPORT,
        
        # API access
        Permission.API_READ,
        Permission.API_WRITE,
        Permission.API_DELETE,
        
        # Agent management
        Permission.AGENT_READ,
        Permission.AGENT_WRITE,
        Permission.AGENT_EXECUTE,
        
        # Integration management
        Permission.INTEGRATION_READ,
        Permission.INTEGRATION_WRITE,
        Permission.INTEGRATION_DELETE,
    },
    
    # Recruiter has most permissions except system admin
    UserRole.RECRUITER: {
        # Company management
        Permission.COMPANY_READ,
        Permission.COMPANY_SETTINGS,
        
        # User management
        Permission.USER_READ,
        Permission.USER_INVITE,
        
        # Requisition management
        Permission.REQUISITION_READ,
        Permission.REQUISITION_WRITE,
        Permission.REQUISITION_PUBLISH,
        
        # Campaign management
        Permission.CAMPAIGN_READ,
        Permission.CAMPAIGN_WRITE,
        Permission.CAMPAIGN_LAUNCH,
        
        # Candidate management
        Permission.CANDIDATE_READ,
        Permission.CANDIDATE_WRITE,
        Permission.CANDIDATE_SHORTLIST,
        Permission.CANDIDATE_REJECT,
        
        # Interview management
        Permission.INTERVIEW_READ,
        Permission.INTERVIEW_WRITE,
        Permission.INTERVIEW_START,
        Permission.INTERVIEW_STOP,
        
        # Scorecard management
        Permission.SCORECARD_READ,
        Permission.SCORECARD_WRITE,
        
        # Analytics and reporting
        Permission.ANALYTICS_READ,
        Permission.ANALYTICS_EXPORT,
        Permission.REPORTS_READ,
        Permission.REPORTS_GENERATE,
        
        # Audit and compliance
        Permission.AUDIT_READ,
        
        # API access
        Permission.API_READ,
        Permission.API_WRITE,
        
        # Agent management
        Permission.AGENT_READ,
        Permission.AGENT_EXECUTE,
        
        # Integration management
        Permission.INTEGRATION_READ,
    },
    
    # Viewer has read-only permissions
    UserRole.VIEWER: {
        # Company management
        Permission.COMPANY_READ,
        
        # User management
        Permission.USER_READ,
        
        # Requisition management
        Permission.REQUISITION_READ,
        
        # Campaign management
        Permission.CAMPAIGN_READ,
        
        # Candidate management
        Permission.CANDIDATE_READ,
        
        # Interview management
        Permission.INTERVIEW_READ,
        
        # Scorecard management
        Permission.SCORECARD_READ,
        
        # Analytics and reporting
        Permission.ANALYTICS_READ,
        Permission.REPORTS_READ,
        
        # Audit and compliance
        Permission.AUDIT_READ,
        
        # API access
        Permission.API_READ,
        
        # Agent management
        Permission.AGENT_READ,
        
        # Integration management
        Permission.INTEGRATION_READ,
    },
}


# ============================================================================
# RBAC Utilities
# ============================================================================

class RBACManager:
    """Role-Based Access Control Manager"""
    
    @staticmethod
    def get_role_permissions(role: UserRole) -> Set[Permission]:
        """Get all permissions for a role
        
        Args:
            role: User role
            
        Returns:
            Set[Permission]: Set of permissions
        """
        return ROLE_PERMISSIONS.get(role, set())
    
    @staticmethod
    def has_permission(role: UserRole, permission: Permission) -> bool:
        """Check if role has specific permission
        
        Args:
            role: User role
            permission: Permission to check
            
        Returns:
            bool: True if role has permission
        """
        role_permissions = RBACManager.get_role_permissions(role)
        return permission in role_permissions
    
    @staticmethod
    def has_any_permission(role: UserRole, permissions: List[Permission]) -> bool:
        """Check if role has any of the specified permissions
        
        Args:
            role: User role
            permissions: List of permissions to check
            
        Returns:
            bool: True if role has any of the permissions
        """
        role_permissions = RBACManager.get_role_permissions(role)
        return any(permission in role_permissions for permission in permissions)
    
    @staticmethod
    def has_all_permissions(role: UserRole, permissions: List[Permission]) -> bool:
        """Check if role has all of the specified permissions
        
        Args:
            role: User role
            permissions: List of permissions to check
            
        Returns:
            bool: True if role has all of the permissions
        """
        role_permissions = RBACManager.get_role_permissions(role)
        return all(permission in role_permissions for permission in permissions)
    
    @staticmethod
    def get_permissions_list(role: UserRole) -> List[str]:
        """Get list of permission strings for a role
        
        Args:
            role: User role
            
        Returns:
            List[str]: List of permission strings
        """
        permissions = RBACManager.get_role_permissions(role)
        return [permission.value for permission in permissions]
    
    @staticmethod
    def check_permission(
        role: UserRole,
        permission: Permission,
        raise_exception: bool = True
    ) -> bool:
        """Check permission and optionally raise exception
        
        Args:
            role: User role
            permission: Permission to check
            raise_exception: Whether to raise exception on failure
            
        Returns:
            bool: True if permission granted
            
        Raises:
            HTTPException: If permission denied and raise_exception is True
        """
        if RBACManager.has_permission(role, permission):
            return True
        
        if raise_exception:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Permission denied: {permission.value}",
            )
        
        return False
    
    @staticmethod
    def check_any_permission(
        role: UserRole,
        permissions: List[Permission],
        raise_exception: bool = True
    ) -> bool:
        """Check any permission and optionally raise exception
        
        Args:
            role: User role
            permissions: List of permissions to check
            raise_exception: Whether to raise exception on failure
            
        Returns:
            bool: True if any permission granted
            
        Raises:
            HTTPException: If all permissions denied and raise_exception is True
        """
        if RBACManager.has_any_permission(role, permissions):
            return True
        
        if raise_exception:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Permission denied: Required one of {[p.value for p in permissions]}",
            )
        
        return False
    
    @staticmethod
    def check_all_permissions(
        role: UserRole,
        permissions: List[Permission],
        raise_exception: bool = True
    ) -> bool:
        """Check all permissions and optionally raise exception
        
        Args:
            role: User role
            permissions: List of permissions to check
            raise_exception: Whether to raise exception on failure
            
        Returns:
            bool: True if all permissions granted
            
        Raises:
            HTTPException: If any permission denied and raise_exception is True
        """
        if RBACManager.has_all_permissions(role, permissions):
            return True
        
        if raise_exception:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Permission denied: Required all of {[p.value for p in permissions]}",
            )
        
        return False


# ============================================================================
# RBAC Decorators
# ============================================================================

def require_permission(permission: Permission):
    """Decorator to require specific permission
    
    Args:
        permission: Required permission
        
    Returns:
        Decorator function
    """
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Get current user from kwargs
            current_user = kwargs.get('current_user')
            
            if current_user is None:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Authentication required",
                )
            
            # Check permission
            RBACManager.check_permission(
                UserRole(current_user.role),
                permission
            )
            
            return await func(*args, **kwargs)
        
        return wrapper
    return decorator


def require_any_permission(*permissions: Permission):
    """Decorator to require any of the specified permissions
    
    Args:
        *permissions: List of required permissions
        
    Returns:
        Decorator function
    """
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Get current user from kwargs
            current_user = kwargs.get('current_user')
            
            if current_user is None:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Authentication required",
                )
            
            # Check any permission
            RBACManager.check_any_permission(
                UserRole(current_user.role),
                list(permissions)
            )
            
            return await func(*args, **kwargs)
        
        return wrapper
    return decorator


def require_all_permissions(*permissions: Permission):
    """Decorator to require all of the specified permissions
    
    Args:
        *permissions: List of required permissions
        
    Returns:
        Decorator function
    """
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Get current user from kwargs
            current_user = kwargs.get('current_user')
            
            if current_user is None:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Authentication required",
                )
            
            # Check all permissions
            RBACManager.check_all_permissions(
                UserRole(current_user.role),
                list(permissions)
            )
            
            return await func(*args, **kwargs)
        
        return wrapper
    return decorator


# ============================================================================
# Permission Groups
# ============================================================================

class PermissionGroup:
    """Predefined permission groups for common use cases"""
    
    # Full access (admin only)
    FULL_ACCESS = set(Permission)
    
    # Recruiter access
    RECRUITER_ACCESS = ROLE_PERMISSIONS[UserRole.RECRUITER]
    
    # Viewer access
    VIEWER_ACCESS = ROLE_PERMISSIONS[UserRole.VIEWER]
    
    # Read-only access
    READ_ONLY = {
        Permission.COMPANY_READ,
        Permission.USER_READ,
        Permission.REQUISITION_READ,
        Permission.CAMPAIGN_READ,
        Permission.CANDIDATE_READ,
        Permission.INTERVIEW_READ,
        Permission.SCORECARD_READ,
        Permission.ANALYTICS_READ,
        Permission.REPORTS_READ,
        Permission.AUDIT_READ,
        Permission.API_READ,
        Permission.AGENT_READ,
        Permission.INTEGRATION_READ,
    }
    
    # Hiring workflow
    HIRING_WORKFLOW = {
        Permission.REQUISITION_READ,
        Permission.REQUISITION_WRITE,
        Permission.REQUISITION_PUBLISH,
        Permission.CAMPAIGN_READ,
        Permission.CAMPAIGN_WRITE,
        Permission.CAMPAIGN_LAUNCH,
        Permission.CANDIDATE_READ,
        Permission.CANDIDATE_WRITE,
        Permission.CANDIDATE_SHORTLIST,
        Permission.CANDIDATE_REJECT,
        Permission.INTERVIEW_READ,
        Permission.INTERVIEW_WRITE,
        Permission.INTERVIEW_START,
        Permission.INTERVIEW_STOP,
        Permission.SCORECARD_READ,
        Permission.SCORECARD_WRITE,
    }
    
    # Analytics and reporting
    ANALYTICS_ACCESS = {
        Permission.ANALYTICS_READ,
        Permission.ANALYTICS_EXPORT,
        Permission.REPORTS_READ,
        Permission.REPORTS_GENERATE,
    }
    
    # System administration
    SYSTEM_ADMIN = {
        Permission.SYSTEM_READ,
        Permission.SYSTEM_WRITE,
        Permission.SYSTEM_ADMIN,
        Permission.AUDIT_READ,
        Permission.AUDIT_EXPORT,
    }


# Create RBAC manager instance
rbac_manager = RBACManager()