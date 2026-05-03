// Shared authentication utilities for AROHAN dashboards

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserRole, AuthResponse } from './types';

// ============================================================================
// Auth Store
// ============================================================================

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  login: (response: AuthResponse) => void;
  logout: () => void;
  checkAuth: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      
      setToken: (token) => set({ token }),
      
      login: (response) => {
        set({
          user: response.user,
          token: response.token,
          isAuthenticated: true,
          isLoading: false,
        });
      },
      
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },
      
      checkAuth: () => {
        const { user, token } = get();
        return !!(user && token);
      },
    }),
    {
      name: 'arohan-auth',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);

// ============================================================================
// Permission Utilities
// ============================================================================

import { Permission } from './types';

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  ADMIN: Object.values(Permission),
  RECRUITER: [
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
    Permission.ANALYTICS_READ,
    Permission.ANALYTICS_EXPORT,
    Permission.REPORTS_READ,
    Permission.REPORTS_GENERATE,
    Permission.AUDIT_READ,
    Permission.API_READ,
    Permission.API_WRITE,
    Permission.AGENT_READ,
    Permission.AGENT_EXECUTE,
    Permission.INTEGRATION_READ,
  ],
  VIEWER: [
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
  ],
};

export function hasPermission(userRole: UserRole, permission: Permission): boolean {
  const rolePermissions = ROLE_PERMISSIONS[userRole] || [];
  return rolePermissions.includes(permission);
}

export function hasAnyPermission(userRole: UserRole, permissions: Permission[]): boolean {
  const rolePermissions = ROLE_PERMISSIONS[userRole] || [];
  return permissions.some(permission => rolePermissions.includes(permission));
}

export function hasAllPermissions(userRole: UserRole, permissions: Permission[]): boolean {
  const rolePermissions = ROLE_PERMISSIONS[userRole] || [];
  return permissions.every(permission => rolePermissions.includes(permission));
}

export function requirePermission(userRole: UserRole, permission: Permission): void {
  if (!hasPermission(userRole, permission)) {
    throw new Error(`Permission denied: ${permission}`);
  }
}

// ============================================================================
// Data Isolation Utilities
// ============================================================================

export function ensureCompanyAccess(user: User, companyId: string): void {
  if (user.role === 'ADMIN') {
    // Admins can access all companies
    return;
  }

  if (user.companyId !== companyId) {
    throw new Error('Access denied: You do not have access to this company');
  }
}

export function filterByCompany<T extends { companyId: string }>(
  items: T[],
  user: User
): T[] {
  if (user.role === 'ADMIN') {
    return items;
  }

  return items.filter(item => item.companyId === user.companyId);
}

// ============================================================================
// Role Utilities
// ============================================================================

export function isAdmin(user: User | null): boolean {
  return user?.role === 'ADMIN';
}

export function isRecruiter(user: User | null): boolean {
  return user?.role === 'RECRUITER';
}

export function isViewer(user: User | null): boolean {
  return user?.role === 'VIEWER';
}

export function canManageUsers(user: User | null): boolean {
  return isAdmin(user);
}

export function canManageCompanies(user: User | null): boolean {
  return isAdmin(user);
}

export function canManageCampaigns(user: User | null): boolean {
  return isAdmin(user) || isRecruiter(user);
}

export function canManageCandidates(user: User | null): boolean {
  return isAdmin(user) || isRecruiter(user);
}

export function canViewAnalytics(user: User | null): boolean {
  return !!user; // All authenticated users can view analytics
}

export function canExportData(user: User | null): boolean {
  return isAdmin(user) || isRecruiter(user);
}
