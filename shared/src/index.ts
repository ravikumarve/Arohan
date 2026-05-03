// Types
export * from './lib/types';

// API Client
export { createApiClient } from './lib/api-client';

// Create default API client instance
export const apiClient = createApiClient();

// Auth
export { useAuthStore, useAuth } from './lib/auth';

// Utils
export * from './lib/utils';

// Constants
export * from './lib/constants';

// UI Components
export * from './components/ui';

// Hooks
export * from './hooks';

// Middleware
export { createAuthMiddleware, adminAuthMiddleware, recruiterAuthMiddleware } from './middleware/auth';
export type { AuthConfig } from './middleware/auth';
