// Shared constants for AROHAN dashboards

// ============================================================================
// Design Tokens
// ============================================================================

export const DesignTokens = {
  // Spacing
  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    '2xl': '3rem',    // 48px
    '3xl': '4rem',    // 64px
  },

  // Border Radius
  borderRadius: {
    sm: '0.25rem',    // 4px
    md: '0.5rem',     // 8px
    lg: '0.75rem',    // 12px
    xl: '1rem',       // 16px
    '2xl': '1.5rem',  // 24px
    full: '9999px',
  },

  // Shadows
  shadow: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  },

  // Transitions
  transition: {
    fast: '150ms ease-in-out',
    base: '200ms ease-in-out',
    slow: '300ms ease-in-out',
  },

  // Z-Index
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modal: 1040,
    popover: 1050,
    tooltip: 1060,
  },
};

// ============================================================================
// Color Palettes
// ============================================================================

export const Colors = {
  // Admin Dashboard Colors
  admin: {
    primary: {
      DEFAULT: '#6366f1',      // Indigo 500
      dark: '#4f46e5',         // Indigo 600
      light: '#818cf8',        // Indigo 400
    },
    success: '#10b981',        // Emerald 500
    warning: '#f59e0b',        // Amber 500
    danger: '#ef4444',         // Red 500
    info: '#3b82f6',           // Blue 500
    background: {
      primary: '#0f172a',      // Slate 900
      secondary: '#1e293b',    // Slate 800
      tertiary: '#334155',     // Slate 700
    },
  },

  // Recruiter Dashboard Colors
  recruiter: {
    primary: {
      DEFAULT: '#8b5cf6',      // Violet 500
      dark: '#7c3aed',         // Violet 600
      light: '#a78bfa',        // Violet 400
    },
    success: '#10b981',        // Emerald 500
    warning: '#f59e0b',        // Amber 500
    danger: '#ef4444',         // Red 500
    info: '#3b82f6',           // Blue 500
    background: {
      primary: '#000000',      // Black
      secondary: '#111827',    // Gray 900
      tertiary: '#1f2937',     // Gray 800
    },
  },

  // System Dashboard Colors (Existing)
  system: {
    primary: {
      DEFAULT: '#a855f7',      // Purple 500
      dark: '#9333ea',         // Purple 600
      light: '#c084fc',        // Purple 400
    },
    secondary: {
      DEFAULT: '#ec4899',      // Pink 500
      dark: '#db2777',         // Pink 600
      light: '#f472b6',        // Pink 400
    },
    background: {
      primary: '#0f172a',      // Slate 900
      secondary: '#1e293b',    // Slate 800
      tertiary: '#334155',     // Slate 700
    },
  },
};

// ============================================================================
// API Constants
// ============================================================================

export const ApiConstants = {
  DEFAULT_TIMEOUT: 30000,      // 30 seconds
  MAX_RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,          // 1 second
  
  // Pagination
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  
  // File Upload
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
  
  // Rate Limiting
  RATE_LIMIT_REQUESTS: 100,
  RATE_LIMIT_WINDOW: 60000,    // 1 minute
};

// ============================================================================
// Validation Constants
// ============================================================================

export const ValidationConstants = {
  // User
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  EMAIL_MAX_LENGTH: 255,
  PHONE_MAX_LENGTH: 20,
  
  // Company
  COMPANY_NAME_MIN_LENGTH: 2,
  COMPANY_NAME_MAX_LENGTH: 255,
  DOMAIN_MAX_LENGTH: 255,
  
  // Campaign
  CAMPAIGN_NAME_MIN_LENGTH: 3,
  CAMPAIGN_NAME_MAX_LENGTH: 200,
  DESCRIPTION_MAX_LENGTH: 1000,
  
  // Candidate
  CANDIDATE_NAME_MIN_LENGTH: 2,
  CANDIDATE_NAME_MAX_LENGTH: 100,
  PIN_CODE_LENGTH: 6,
  
  // Requisition
  REQUISITION_TITLE_MIN_LENGTH: 3,
  REQUISITION_TITLE_MAX_LENGTH: 200,
  DESCRIPTION_MAX_LENGTH: 2000,
  LOCATION_MAX_LENGTH: 255,
  
  // Scorecard
  SCORE_MIN: 0,
  SCORE_MAX: 100,
  NOTES_MAX_LENGTH: 2000,
};

// ============================================================================
// Status Constants
// ============================================================================

export const StatusConstants = {
  // User Status
  USER_STATUS: ['active', 'inactive', 'suspended'] as const,
  
  // Company Status
  COMPANY_STATUS: ['active', 'suspended', 'deleted'] as const,
  
  // Campaign Status
  CAMPAIGN_STATUS: ['draft', 'active', 'paused', 'completed'] as const,
  
  // Candidate Status
  CANDIDATE_STATUS: ['pending', 'screening', 'completed', 'shortlisted', 'rejected'] as const,
  
  // Requisition Status
  REQUISITION_STATUS: ['draft', 'open', 'closed', 'filled'] as const,
  
  // System Health
  SYSTEM_HEALTH: ['healthy', 'degraded', 'unhealthy'] as const,
  
  // Service Health
  SERVICE_HEALTH: ['healthy', 'degraded', 'unhealthy'] as const,
};

// ============================================================================
// Subscription Plans
// ============================================================================

export const SubscriptionPlans = {
  STARTUP: {
    name: 'Startup',
    price: 18,
    currency: 'INR',
    screenings: 500,
    features: [
      'Up to 500 screenings/month',
      'Basic analytics',
      'Email support',
      'Standard integrations',
    ],
  },
  GROWTH: {
    name: 'Growth',
    price: 14,
    currency: 'INR',
    screenings: 5000,
    features: [
      'Up to 5,000 screenings/month',
      'Advanced analytics',
      'Priority support',
      'Custom integrations',
      'API access',
    ],
  },
  ENTERPRISE: {
    name: 'Enterprise',
    price: 10,
    currency: 'INR',
    screenings: -1, // Unlimited
    features: [
      'Unlimited screenings',
      'Enterprise analytics',
      '24/7 dedicated support',
      'Custom integrations',
      'API access',
      'On-premise deployment',
      'Custom SLA',
    ],
  },
} as const;

// ============================================================================
// Language Constants
// ============================================================================

export const LanguageConstants = {
  SUPPORTED_LANGUAGES: [
    { code: 'hi-IN', name: 'Hindi', nativeName: 'हिंदी' },
    { code: 'en-IN', name: 'English (Indian)', nativeName: 'English' },
    { code: 'ta-IN', name: 'Tamil', nativeName: 'தமிழ்' },
    { code: 'te-IN', name: 'Telugu', nativeName: 'తెలుగు' },
    { code: 'kn-IN', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
    { code: 'ml-IN', name: 'Malayalam', nativeName: 'മലയാളം' },
    { code: 'mr-IN', name: 'Marathi', nativeName: 'मराठी' },
    { code: 'bn-IN', name: 'Bengali', nativeName: 'বাংলা' },
    { code: 'gu-IN', name: 'Gujarati', nativeName: 'ગુજરાતી' },
    { code: 'pa-IN', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
    { code: 'or-IN', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
    { code: 'as-IN', name: 'Assamese', nativeName: 'অসমীয়া' },
  ],

  LANGUAGE_FLUENCY: ['native', 'proficient', 'functional'] as const,
};

// ============================================================================
// Role Constants
// ============================================================================

export const RoleConstants = {
  ROLES: ['ADMIN', 'RECRUITER', 'VIEWER'] as const,
  
  ROLE_DESCRIPTIONS: {
    ADMIN: 'Full system access with platform management capabilities',
    RECRUITER: 'Company-specific hiring workflows and candidate management',
    VIEWER: 'Read-only access to company data and analytics',
  },
  
  ROLE_PERMISSIONS: {
    ADMIN: 'Full access to all features',
    RECRUITER: 'Access to hiring workflows and candidate management',
    VIEWER: 'Read-only access to company data',
  },
};

// ============================================================================
// Error Messages
// ============================================================================

export const ErrorMessages = {
  // Authentication
  INVALID_CREDENTIALS: 'Invalid email or password',
  TOKEN_EXPIRED: 'Your session has expired. Please login again.',
  UNAUTHORIZED: 'You do not have permission to access this resource.',
  
  // Validation
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PHONE: 'Please enter a valid phone number',
  INVALID_PIN_CODE: 'Please enter a valid 6-digit PIN code',
  
  // API
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  NOT_FOUND: 'The requested resource was not found.',
  
  // Business Logic
  COMPANY_NOT_FOUND: 'Company not found',
  USER_NOT_FOUND: 'User not found',
  CAMPAIGN_NOT_FOUND: 'Campaign not found',
  CANDIDATE_NOT_FOUND: 'Candidate not found',
  REQUISITION_NOT_FOUND: 'Requisition not found',
  
  // Permissions
  ACCESS_DENIED: 'Access denied',
  INSUFFICIENT_PERMISSIONS: 'You do not have sufficient permissions',
};

// ============================================================================
// Success Messages
// ============================================================================

export const SuccessMessages = {
  // Authentication
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  
  // User Management
  USER_CREATED: 'User created successfully',
  USER_UPDATED: 'User updated successfully',
  USER_DELETED: 'User deleted successfully',
  
  // Company Management
  COMPANY_CREATED: 'Company created successfully',
  COMPANY_UPDATED: 'Company updated successfully',
  
  // Campaign Management
  CAMPAIGN_CREATED: 'Campaign created successfully',
  CAMPAIGN_UPDATED: 'Campaign updated successfully',
  CAMPAIGN_LAUNCHED: 'Campaign launched successfully',
  CAMPAIGN_PAUSED: 'Campaign paused successfully',
  
  // Candidate Management
  CANDIDATE_SHORTLISTED: 'Candidate shortlisted successfully',
  CANDIDATE_REJECTED: 'Candidate rejected successfully',
  
  // Requisition Management
  REQUISITION_CREATED: 'Requisition created successfully',
  REQUISITION_UPDATED: 'Requisition updated successfully',
  REQUISITION_PUBLISHED: 'Requisition published successfully',
};

// ============================================================================
// Dashboard Routes
// ============================================================================

export const DashboardRoutes = {
  // System Dashboard (Existing)
  SYSTEM: {
    BASE: '/dashboard',
    OVERVIEW: '/dashboard',
    AGENTS: '/dashboard/agents',
    SESSIONS: '/dashboard/sessions',
    INTEGRATIONS: '/dashboard/integrations',
    SCORECARDS: '/dashboard/scorecards',
    MONITORING: '/dashboard/monitoring',
    SETTINGS: '/dashboard/settings',
  },
  
  // Admin Dashboard (New)
  ADMIN: {
    BASE: '/admin',
    OVERVIEW: '/admin',
    USERS: '/admin/users',
    USER_DETAIL: '/admin/users/:id',
    USER_CREATE: '/admin/users/new',
    COMPANIES: '/admin/companies',
    COMPANY_DETAIL: '/admin/companies/:id',
    COMPANY_CREATE: '/admin/companies/new',
    SYSTEM: '/admin/system',
    BILLING: '/admin/billing',
    AUDIT: '/admin/audit',
    INTEGRATIONS: '/admin/integrations',
    SETTINGS: '/admin/settings',
  },
  
  // Recruiter Dashboard (New)
  RECRUITER: {
    BASE: '/recruiter',
    OVERVIEW: '/recruiter',
    CAMPAIGNS: '/recruiter/campaigns',
    CAMPAIGN_DETAIL: '/recruiter/campaigns/:id',
    CAMPAIGN_CREATE: '/recruiter/campaigns/new',
    CANDIDATES: '/recruiter/candidates',
    CANDIDATE_DETAIL: '/recruiter/candidates/:id',
    CANDIDATES_SHORTLISTED: '/recruiter/candidates/shortlisted',
    CANDIDATES_REJECTED: '/recruiter/candidates/rejected',
    REQUISITIONS: '/recruiter/requisitions',
    REQUISITION_DETAIL: '/recruiter/requisitions/:id',
    REQUISITION_CREATE: '/recruiter/requisitions/new',
    SCORECARDS: '/recruiter/scorecards',
    SCORECARD_DETAIL: '/recruiter/scorecards/:id',
    ANALYTICS: '/recruiter/analytics',
    SETTINGS: '/recruiter/settings',
  },
  
  // Common Routes
  LOGIN: '/login',
  LOGOUT: '/logout',
  UNAUTHORIZED: '/unauthorized',
  NOT_FOUND: '/404',
};
