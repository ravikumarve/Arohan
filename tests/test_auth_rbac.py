"""
Unit Tests for Role-Based Access Control (RBAC)
"""

import pytest
from src.auth.rbac import (
    Permission,
    UserRole,
    RBACManager,
    require_permission,
    require_any_permission,
    require_all_permissions,
    PermissionGroup,
    rbac_manager
)


class TestRBACManager:
    """Test RBAC manager functionality"""
    
    def test_get_role_permissions_admin(self):
        """Test getting admin permissions"""
        permissions = RBACManager.get_role_permissions(UserRole.ADMIN)
        
        # Admin should have all permissions
        assert len(permissions) > 0
        assert Permission.SYSTEM_ADMIN in permissions
        assert Permission.USER_DELETE in permissions
        assert Permission.CANDIDATE_READ in permissions
    
    def test_get_role_permissions_recruiter(self):
        """Test getting recruiter permissions"""
        permissions = RBACManager.get_role_permissions(UserRole.RECRUITER)
        
        # Recruiter should have hiring permissions
        assert len(permissions) > 0
        assert Permission.REQUISITION_WRITE in permissions
        assert Permission.CANDIDATE_SHORTLIST in permissions
        assert Permission.INTERVIEW_START in permissions
        
        # Recruiter should not have system admin permissions
        assert Permission.SYSTEM_ADMIN not in permissions
        assert Permission.USER_DELETE not in permissions
    
    def test_get_role_permissions_viewer(self):
        """Test getting viewer permissions"""
        permissions = RBACManager.get_role_permissions(UserRole.VIEWER)
        
        # Viewer should have read-only permissions
        assert len(permissions) > 0
        assert Permission.REQUISITION_READ in permissions
        assert Permission.CANDIDATE_READ in permissions
        assert Permission.ANALYTICS_READ in permissions
        
        # Viewer should not have write permissions
        assert Permission.REQUISITION_WRITE not in permissions
        assert Permission.CANDIDATE_WRITE not in permissions
        assert Permission.INTERVIEW_START not in permissions
    
    def test_has_permission_admin(self):
        """Test admin has all permissions"""
        assert RBACManager.has_permission(UserRole.ADMIN, Permission.SYSTEM_ADMIN)
        assert RBACManager.has_permission(UserRole.ADMIN, Permission.USER_DELETE)
        assert RBACManager.has_permission(UserRole.ADMIN, Permission.CANDIDATE_READ)
    
    def test_has_permission_recruiter(self):
        """Test recruiter has specific permissions"""
        assert RBACManager.has_permission(UserRole.RECRUITER, Permission.REQUISITION_WRITE)
        assert RBACManager.has_permission(UserRole.RECRUITER, Permission.CANDIDATE_SHORTLIST)
        
        # Recruiter should not have system admin permission
        assert not RBACManager.has_permission(UserRole.RECRUITER, Permission.SYSTEM_ADMIN)
    
    def test_has_permission_viewer(self):
        """Test viewer has read permissions"""
        assert RBACManager.has_permission(UserRole.VIEWER, Permission.REQUISITION_READ)
        assert RBACManager.has_permission(UserRole.VIEWER, Permission.CANDIDATE_READ)
        
        # Viewer should not have write permissions
        assert not RBACManager.has_permission(UserRole.VIEWER, Permission.REQUISITION_WRITE)
        assert not RBACManager.has_permission(UserRole.VIEWER, Permission.CANDIDATE_SHORTLIST)
    
    def test_has_any_permission_admin(self):
        """Test admin has any of multiple permissions"""
        permissions = [
            Permission.SYSTEM_ADMIN,
            Permission.USER_DELETE,
            Permission.CANDIDATE_READ
        ]
        
        assert RBACManager.has_any_permission(UserRole.ADMIN, permissions)
    
    def test_has_any_permission_recruiter(self):
        """Test recruiter has any of multiple permissions"""
        permissions = [
            Permission.REQUISITION_WRITE,
            Permission.CANDIDATE_SHORTLIST,
            Permission.SYSTEM_ADMIN
        ]
        
        # Should have at least one permission
        assert RBACManager.has_any_permission(UserRole.RECRUITER, permissions)
    
    def test_has_any_permission_viewer(self):
        """Test viewer has any of multiple permissions"""
        permissions = [
            Permission.REQUISITION_READ,
            Permission.CANDIDATE_READ,
            Permission.REQUISITION_WRITE
        ]
        
        # Should have at least one permission
        assert RBACManager.has_any_permission(UserRole.VIEWER, permissions)
    
    def test_has_all_permissions_admin(self):
        """Test admin has all of multiple permissions"""
        permissions = [
            Permission.SYSTEM_ADMIN,
            Permission.USER_DELETE,
            Permission.CANDIDATE_READ
        ]
        
        assert RBACManager.has_all_permissions(UserRole.ADMIN, permissions)
    
    def test_has_all_permissions_recruiter(self):
        """Test recruiter has all of multiple permissions"""
        permissions = [
            Permission.REQUISITION_WRITE,
            Permission.CANDIDATE_SHORTLIST,
            Permission.INTERVIEW_START
        ]
        
        # Should have all permissions
        assert RBACManager.has_all_permissions(UserRole.RECRUITER, permissions)
    
    def test_has_all_permissions_viewer(self):
        """Test viewer has all of multiple permissions"""
        permissions = [
            Permission.REQUISITION_READ,
            Permission.CANDIDATE_READ,
            Permission.ANALYTICS_READ
        ]
        
        # Should have all permissions
        assert RBACManager.has_all_permissions(UserRole.VIEWER, permissions)
    
    def test_has_all_permissions_recruiter_missing(self):
        """Test recruiter missing some permissions"""
        permissions = [
            Permission.REQUISITION_WRITE,
            Permission.CANDIDATE_SHORTLIST,
            Permission.SYSTEM_ADMIN
        ]
        
        # Should not have all permissions (missing SYSTEM_ADMIN)
        assert not RBACManager.has_all_permissions(UserRole.RECRUITER, permissions)
    
    def test_get_permissions_list_admin(self):
        """Test getting admin permissions list"""
        permissions = RBACManager.get_permissions_list(UserRole.ADMIN)
        
        # Should return list of permission strings
        assert isinstance(permissions, list)
        assert len(permissions) > 0
        assert all(isinstance(p, str) for p in permissions)
    
    def test_get_permissions_list_recruiter(self):
        """Test getting recruiter permissions list"""
        permissions = RBACManager.get_permissions_list(UserRole.RECRUITER)
        
        # Should return list of permission strings
        assert isinstance(permissions, list)
        assert len(permissions) > 0
        assert all(isinstance(p, str) for p in permissions)
    
    def test_check_permission_success(self):
        """Test successful permission check"""
        # Should not raise exception
        RBACManager.check_permission(UserRole.ADMIN, Permission.SYSTEM_ADMIN)
    
    def test_check_permission_failure(self):
        """Test failed permission check"""
        # Should raise exception
        with pytest.raises(Exception):  # HTTPException
            RBACManager.check_permission(UserRole.VIEWER, Permission.SYSTEM_ADMIN)
    
    def test_check_permission_no_exception(self):
        """Test permission check without exception"""
        # Should return False without raising exception
        result = RBACManager.check_permission(
            UserRole.VIEWER,
            Permission.SYSTEM_ADMIN,
            raise_exception=False
        )
        
        assert result is False


class TestPermissionGroups:
    """Test permission groups"""
    
    def test_full_access_group(self):
        """Test full access permission group"""
        assert len(PermissionGroup.FULL_ACCESS) > 0
        assert Permission.SYSTEM_ADMIN in PermissionGroup.FULL_ACCESS
    
    def test_recruiter_access_group(self):
        """Test recruiter access permission group"""
        assert len(PermissionGroup.RECRUITER_ACCESS) > 0
        assert Permission.REQUISITION_WRITE in PermissionGroup.RECRUITER_ACCESS
        assert Permission.SYSTEM_ADMIN not in PermissionGroup.RECRUITER_ACCESS
    
    def test_viewer_access_group(self):
        """Test viewer access permission group"""
        assert len(PermissionGroup.VIEWER_ACCESS) > 0
        assert Permission.REQUISITION_READ in PermissionGroup.VIEWER_ACCESS
        assert Permission.REQUISITION_WRITE not in PermissionGroup.VIEWER_ACCESS
    
    def test_read_only_group(self):
        """Test read-only permission group"""
        assert len(PermissionGroup.READ_ONLY) > 0
        assert Permission.REQUISITION_READ in PermissionGroup.READ_ONLY
        assert Permission.REQUISITION_WRITE not in PermissionGroup.READ_ONLY
    
    def test_hiring_workflow_group(self):
        """Test hiring workflow permission group"""
        assert len(PermissionGroup.HIRING_WORKFLOW) > 0
        assert Permission.REQUISITION_WRITE in PermissionGroup.HIRING_WORKFLOW
        assert Permission.CANDIDATE_SHORTLIST in PermissionGroup.HIRING_WORKFLOW
        assert Permission.INTERVIEW_START in PermissionGroup.HIRING_WORKFLOW
    
    def test_analytics_access_group(self):
        """Test analytics access permission group"""
        assert len(PermissionGroup.ANALYTICS_ACCESS) > 0
        assert Permission.ANALYTICS_READ in PermissionGroup.ANALYTICS_ACCESS
        assert Permission.ANALYTICS_EXPORT in PermissionGroup.ANALYTICS_ACCESS
    
    def test_system_admin_group(self):
        """Test system admin permission group"""
        assert len(PermissionGroup.SYSTEM_ADMIN) > 0
        assert Permission.SYSTEM_ADMIN in PermissionGroup.SYSTEM_ADMIN
        assert Permission.AUDIT_READ in PermissionGroup.SYSTEM_ADMIN


class TestPermissionHierarchy:
    """Test permission hierarchy"""
    
    def test_admin_has_all_permissions(self):
        """Test admin has all permissions"""
        for permission in Permission:
            assert RBACManager.has_permission(UserRole.ADMIN, permission)
    
    def test_recruiter_permissions_subset(self):
        """Test recruiter permissions are subset of admin"""
        recruiter_perms = RBACManager.get_role_permissions(UserRole.RECRUITER)
        admin_perms = RBACManager.get_role_permissions(UserRole.ADMIN)
        
        # All recruiter permissions should be in admin permissions
        assert recruiter_perms.issubset(admin_perms)
    
    def test_viewer_permissions_subset(self):
        """Test viewer permissions are subset of recruiter"""
        viewer_perms = RBACManager.get_role_permissions(UserRole.VIEWER)
        recruiter_perms = RBACManager.get_role_permissions(UserRole.RECRUITER)
        
        # All viewer permissions should be in recruiter permissions
        assert viewer_perms.issubset(recruiter_perms)
    
    def test_viewer_permissions_subset_admin(self):
        """Test viewer permissions are subset of admin"""
        viewer_perms = RBACManager.get_role_permissions(UserRole.VIEWER)
        admin_perms = RBACManager.get_role_permissions(UserRole.ADMIN)
        
        # All viewer permissions should be in admin permissions
        assert viewer_perms.issubset(admin_perms)


class TestRBACManagerInstance:
    """Test RBAC manager instance"""
    
    def test_rbac_manager_instance(self):
        """Test RBAC manager instance"""
        assert rbac_manager is not None
        assert isinstance(rbac_manager, RBACManager)
    
    def test_rbac_manager_has_permission(self):
        """Test RBAC manager instance has_permission"""
        assert rbac_manager.has_permission(UserRole.ADMIN, Permission.SYSTEM_ADMIN)
    
    def test_rbac_manager_get_permissions(self):
        """Test RBAC manager instance get_permissions"""
        permissions = rbac_manager.get_role_permissions(UserRole.ADMIN)
        assert len(permissions) > 0


class TestPermissionEnum:
    """Test permission enum"""
    
    def test_permission_enum_values(self):
        """Test permission enum has expected values"""
        assert Permission.COMPANY_READ.value == "company:read"
        assert Permission.USER_WRITE.value == "user:write"
        assert Permission.REQUISITION_DELETE.value == "requisition:delete"
        assert Permission.CANDIDATE_SHORTLIST.value == "candidate:shortlist"
    
    def test_permission_enum_count(self):
        """Test permission enum has expected count"""
        # Should have 40+ permissions
        assert len(Permission) >= 40
    
    def test_permission_enum_unique(self):
        """Test permission enum values are unique"""
        values = [p.value for p in Permission]
        assert len(values) == len(set(values))


class TestUserRoleEnum:
    """Test user role enum"""
    
    def test_user_role_enum_values(self):
        """Test user role enum has expected values"""
        assert UserRole.ADMIN.value == "admin"
        assert UserRole.RECRUITER.value == "recruiter"
        assert UserRole.VIEWER.value == "viewer"
    
    def test_user_role_enum_count(self):
        """Test user role enum has expected count"""
        # Should have exactly 3 roles
        assert len(UserRole) == 3


if __name__ == "__main__":
    pytest.main([__file__, "-v"])