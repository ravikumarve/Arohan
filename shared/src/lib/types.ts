// Shared TypeScript types for AROHAN dashboards

// ============================================================================
// User & Authentication Types
// ============================================================================

export enum UserRole {
  ADMIN = 'ADMIN',
  RECRUITER = 'RECRUITER',
  VIEWER = 'VIEWER'
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  companyId?: string;
  phone?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  settings?: Record<string, any>;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
  expiresIn: number;
}

// ============================================================================
// Company Types
// ============================================================================

export interface Company {
  id: string;
  name: string;
  domain: string;
  industry?: string;
  size?: string;
  plan: 'startup' | 'growth' | 'enterprise';
  status: 'active' | 'suspended' | 'deleted';
  settings: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// Campaign Types
// ============================================================================

export interface Campaign {
  id: string;
  companyId: string;
  name: string;
  description?: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  requisitionId?: string;
  totalCandidates: number;
  screenedCandidates: number;
  shortlistedCandidates: number;
  rejectedCandidates: number;
  createdAt: string;
  updatedAt: string;
  startDate?: string;
  endDate?: string;
}

// ============================================================================
// Candidate Types
// ============================================================================

export interface Candidate {
  id: string;
  companyId: string;
  campaignId?: string;
  name: string;
  phone: string;
  email?: string;
  pinCode: string;
  languageDetected: string;
  overallScore: number;
  communicationScore: number;
  domainKnowledgeScore: number;
  situationalJudgmentScore: number;
  confidenceScore: number;
  languageFluency: 'native' | 'proficient' | 'functional';
  status: 'pending' | 'screening' | 'completed' | 'shortlisted' | 'rejected';
  assessorNotes?: string;
  recommendedRoles: string[];
  shortlistFlag: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// Scorecard Types
// ============================================================================

export interface Scorecard {
  id: string;
  candidateId: string;
  overallScore: number;
  communicationScore: number;
  domainKnowledgeScore: number;
  situationalJudgmentScore: number;
  confidenceScore: number;
  languageFluency: 'native' | 'proficient' | 'functional';
  assessorNotes: string;
  recommendedRoles: string[];
  shortlistFlag: boolean;
  transcriptSegments: TranscriptSegment[];
  audioUrl?: string;
  createdAt: string;
}

export interface TranscriptSegment {
  speaker: 'proctor' | 'candidate';
  text: string;
  timestamp: number;
  confidence: number;
}

// ============================================================================
// Requisition Types
// ============================================================================

export interface Requisition {
  id: string;
  companyId: string;
  title: string;
  description?: string;
  location: string;
  pinCode: string;
  geoRadius: number;
  requiredScore: number;
  status: 'draft' | 'open' | 'closed' | 'filled';
  totalCandidates: number;
  matchedCandidates: number;
  shortlistedCandidates: number;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// System Health Types
// ============================================================================

export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  services: ServiceHealth[];
  lastChecked: string;
}

export interface ServiceHealth {
  name: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  uptime: string;
  responseTime?: number;
  lastError?: string;
}

// ============================================================================
// Analytics Types
// ============================================================================

export interface AdminMetrics {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  userRetentionRate: number;
  totalCompanies: number;
  activeCompanies: number;
  newCompaniesThisMonth: number;
  companyChurnRate: number;
  apiResponseTime: number;
  databaseQueryTime: number;
  systemUptime: number;
  errorRate: number;
  monthlyRecurringRevenue: number;
  averageRevenuePerUser: number;
  customerLifetimeValue: number;
  churnRate: number;
}

export interface RecruiterMetrics {
  activeCampaigns: number;
  totalCampaigns: number;
  campaignCompletionRate: number;
  averageCampaignDuration: number;
  totalCandidates: number;
  screenedCandidates: number;
  shortlistedCandidates: number;
  shortlistRate: number;
  averageTimeToScreen: number;
  averageTimeToShortlist: number;
  timeToHire: number;
  averageScore: number;
  scoreDistribution: ScoreDistribution;
  candidateQualityScore: number;
}

export interface ScoreDistribution {
  excellent: number; // 90-100
  good: number; // 80-89
  average: number; // 70-79
  belowAverage: number; // 60-69
  poor: number; // <60
}

// ============================================================================
// Filter Types
// ============================================================================

export interface UserFilters {
  role?: UserRole;
  companyId?: string;
  search?: string;
  status?: 'active' | 'inactive';
}

export interface CompanyFilters {
  plan?: 'startup' | 'growth' | 'enterprise';
  status?: 'active' | 'suspended' | 'deleted';
  search?: string;
}

export interface CampaignFilters {
  status?: 'draft' | 'active' | 'paused' | 'completed';
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface CandidateFilters {
  status?: 'pending' | 'screening' | 'completed' | 'shortlisted' | 'rejected';
  scoreMin?: number;
  scoreMax?: number;
  language?: string;
  search?: string;
  campaignId?: string;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
  timestamp: string;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: any;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// ============================================================================
// Permission Types
// ============================================================================

export enum Permission {
  // Company management
  COMPANY_READ = 'company:read',
  COMPANY_WRITE = 'company:write',
  COMPANY_DELETE = 'company:delete',
  COMPANY_SETTINGS = 'company:settings',
  
  // User management
  USER_READ = 'user:read',
  USER_WRITE = 'user:write',
  USER_DELETE = 'user:delete',
  USER_INVITE = 'user:invite',
  
  // Requisition management
  REQUISITION_READ = 'requisition:read',
  REQUISITION_WRITE = 'requisition:write',
  REQUISITION_DELETE = 'requisition:delete',
  REQUISITION_PUBLISH = 'requisition:publish',
  
  // Campaign management
  CAMPAIGN_READ = 'campaign:read',
  CAMPAIGN_WRITE = 'campaign:write',
  CAMPAIGN_DELETE = 'campaign:delete',
  CAMPAIGN_LAUNCH = 'campaign:launch',
  
  // Candidate management
  CANDIDATE_READ = 'candidate:read',
  CANDIDATE_WRITE = 'candidate:write',
  CANDIDATE_DELETE = 'candidate:delete',
  CANDIDATE_SHORTLIST = 'candidate:shortlist',
  CANDIDATE_REJECT = 'candidate:reject',
  
  // Interview management
  INTERVIEW_READ = 'interview:read',
  INTERVIEW_WRITE = 'interview:write',
  INTERVIEW_DELETE = 'interview:delete',
  INTERVIEW_START = 'interview:start',
  INTERVIEW_STOP = 'interview:stop',
  
  // Scorecard management
  SCORECARD_READ = 'scorecard:read',
  SCORECARD_WRITE = 'scorecard:write',
  SCORECARD_DELETE = 'scorecard:delete',
  
  // Analytics and reporting
  ANALYTICS_READ = 'analytics:read',
  ANALYTICS_EXPORT = 'analytics:export',
  REPORTS_READ = 'reports:read',
  REPORTS_GENERATE = 'reports:generate',
  
  // System administration
  SYSTEM_READ = 'system:read',
  SYSTEM_WRITE = 'system:write',
  SYSTEM_ADMIN = 'system:admin',
  
  // Audit and compliance
  AUDIT_READ = 'audit:read',
  AUDIT_EXPORT = 'audit:export',
  
  // API access
  API_READ = 'api:read',
  API_WRITE = 'api:write',
  API_DELETE = 'api:delete',
  
  // Agent management
  AGENT_READ = 'agent:read',
  AGENT_WRITE = 'agent:write',
  AGENT_EXECUTE = 'agent:execute',
  
  // Integration management
  INTEGRATION_READ = 'integration:read',
  INTEGRATION_WRITE = 'integration:write',
  INTEGRATION_DELETE = 'integration:delete',
}
