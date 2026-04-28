// TypeScript type definitions for AROHAN Dashboard

export interface DashboardStats {
  label: string;
  value: string;
  change: string;
  icon: any;
  color: string;
}

export interface SystemHealth {
  service: string;
  status: "healthy" | "unhealthy" | "degraded";
  uptime: string;
  lastCheck: string;
}

export interface Agent {
  name: string;
  description: string;
  status: "active" | "inactive" | "error";
  lastRun: string;
  successRate: string;
  version?: string;
}

export interface Session {
  id: string;
  candidate: string;
  phone: string;
  language: string;
  status: "completed" | "in_progress" | "failed" | "dropped";
  score: number | null;
  duration: string;
  date: string;
  dropOffCount?: number;
}

export interface Integration {
  name: string;
  status: "connected" | "disconnected" | "error";
  type: string;
  lastSync: string;
  error?: string;
}

export interface Scorecard {
  id: string;
  sessionId: string;
  candidate: string;
  overallScore: number;
  communicationScore: number;
  domainKnowledgeScore: number;
  situationalJudgmentScore: number;
  confidenceScore: number;
  languageFluency: "native" | "proficient" | "functional";
  assessorNotes: string;
  recommendedRoles: string[];
  shortlistFlag: boolean;
  createdAt: string;
}

export interface ApiConfig {
  apiUrl: string;
  wsUrl: string;
  apiKey: string;
  apiTimeout: number;
  maxRetries: number;
}

export interface NotificationConfig {
  emailEnabled: boolean;
  smsEnabled: boolean;
  whatsappEnabled: boolean;
  emailAlerts: string;
  smsAlerts: string;
  whatsappAlerts: string;
  quietHoursStart: string;
  quietHoursEnd: string;
}

export interface SecurityConfig {
  sessionTimeout: number;
  maxLoginAttempts: number;
  passwordMinLength: number;
  requireTwoFactor: boolean;
  ipWhitelist: string;
  allowedOrigins: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user" | "viewer";
  createdAt: string;
}

export interface AuthSession {
  user: AuthUser;
  token: string;
  expiresAt: string;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: any;
}
