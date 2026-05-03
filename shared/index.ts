// Main export file for AROHAN shared library

// ============================================================================
// Types
// ============================================================================

export * from './lib/types';

// ============================================================================
// Utilities
// ============================================================================

export * from './lib/utils';
export * from './lib/constants';

// ============================================================================
// API Client
// ============================================================================

export { ApiClient, createApiClient } from './lib/api-client';

// ============================================================================
// Authentication
// ============================================================================

export {
  useAuthStore,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  requirePermission,
  ensureCompanyAccess,
  filterByCompany,
  isAdmin,
  isRecruiter,
  isViewer,
  canManageUsers,
  canManageCompanies,
  canManageCampaigns,
  canManageCandidates,
  canViewAnalytics,
  canExportData,
} from './lib/auth';

// ============================================================================
// Version
// ============================================================================

export const SHARED_LIBRARY_VERSION = '1.0.0';
