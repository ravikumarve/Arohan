// Input validation schemas using Zod

import { z } from 'zod';

// API Configuration Schema
export const apiConfigSchema = z.object({
  apiUrl: z.string().url('Invalid URL format'),
  wsUrl: z.string().url('Invalid WebSocket URL format'),
  apiKey: z.string().min(1, 'API key is required'),
  apiTimeout: z.string().regex(/^\d+$/, 'Must be a number').transform(Number),
  maxRetries: z.string().regex(/^\d+$/, 'Must be a number').transform(Number),
});

export type ApiConfigInput = z.infer<typeof apiConfigSchema>;

// Notification Configuration Schema
export const notificationConfigSchema = z.object({
  emailEnabled: z.boolean(),
  smsEnabled: z.boolean(),
  whatsappEnabled: z.boolean(),
  emailAlerts: z.string().regex(/^(critical|warning|info)(,(critical|warning|info))*$/, 'Invalid alert levels'),
  smsAlerts: z.string().regex(/^(critical|warning|info)(,(critical|warning|info))*$/, 'Invalid alert levels'),
  whatsappAlerts: z.string().regex(/^(critical|warning|info)(,(critical|warning|info))*$/, 'Invalid alert levels'),
  quietHoursStart: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
  quietHoursEnd: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
});

export type NotificationConfigInput = z.infer<typeof notificationConfigSchema>;

// Security Configuration Schema
export const securityConfigSchema = z.object({
  sessionTimeout: z.string().regex(/^\d+$/, 'Must be a number').transform(Number),
  maxLoginAttempts: z.string().regex(/^\d+$/, 'Must be a number').transform(Number),
  passwordMinLength: z.string().regex(/^\d+$/, 'Must be a number').transform(Number),
  requireTwoFactor: z.boolean(),
  ipWhitelist: z.string().optional(),
  allowedOrigins: z.string().regex(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/, 'Invalid origin format'),
});

export type SecurityConfigInput = z.infer<typeof securityConfigSchema>;

// Login Schema
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;

// Session Creation Schema
export const createSessionSchema = z.object({
  candidatePhone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format'),
  candidatePinCode: z.string().regex(/^\d{6}$/, 'Invalid PIN code format (6 digits)'),
  language: z.string().min(2, 'Language code required'),
  requisitionId: z.string().uuid('Invalid requisition ID').optional(),
});

export type CreateSessionInput = z.infer<typeof createSessionSchema>;

// Agent Test Schema
export const agentTestSchema = z.object({
  agentName: z.enum(['proctor', 'assessor', 'matchmaker'], 'Invalid agent name'),
  testData: z.object({
    candidatePhone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format').optional(),
    language: z.string().min(2, 'Language code required').optional(),
    testType: z.enum(['quick', 'full'], 'Invalid test type'),
  }).optional(),
});

export type AgentTestInput = z.infer<typeof agentTestSchema>;

// Pagination Schema
export const paginationSchema = z.object({
  page: z.string().regex(/^\d+$/, 'Must be a number').transform(Number).default('1'),
  limit: z.string().regex(/^\d+$/, 'Must be a number').transform(Number).default('10'),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export type PaginationInput = z.infer<typeof paginationSchema>;

// Search Schema
export const searchSchema = z.object({
  query: z.string().min(1, 'Search query required').max(100, 'Query too long'),
  filters: z.record(z.string()).optional(),
  pagination: paginationSchema.optional(),
});

export type SearchInput = z.infer<typeof searchSchema>;

// Validation helper function
export const validateSchema = <T>(schema: z.ZodSchema<T>, data: unknown): { success: boolean; data?: T; errors?: Record<string, string> } => {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach((err) => {
        const path = err.path.join('.');
        errors[path] = err.message;
      });
      return { success: false, errors };
    }
    return { success: false, errors: { general: 'Validation failed' } };
  }
};

// Form validation hook helper
export const getFormErrors = <T>(schema: z.ZodSchema<T>, data: unknown): Record<string, string> => {
  const result = validateSchema(schema, data);
  return result.errors || {};
};
