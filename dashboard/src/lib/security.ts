// CSRF Protection utilities

class CSRFProtection {
  private static readonly CSRF_TOKEN_KEY = 'csrf_token';
  private static readonly CSRF_HEADER_NAME = 'X-CSRFToken';

  // Get CSRF token from cookie
  public static getToken(): string | null {
    if (typeof window === 'undefined') return null;

    const match = document.cookie.match(new RegExp(`(^| )${this.CSRF_TOKEN_KEY}=([^;]+)`));
    return match ? decodeURIComponent(match[2]) : null;
  }

  // Set CSRF token in cookie
  public static setToken(token: string, maxAge: number = 3600): void {
    if (typeof window === 'undefined') return;

    document.cookie = `${this.CSRF_TOKEN_KEY}=${encodeURIComponent(token)}; max-age=${maxAge}; path=/; samesite=strict; secure`;
  }

  // Clear CSRF token
  public static clearToken(): void {
    if (typeof window === 'undefined') return;

    document.cookie = `${this.CSRF_TOKEN_KEY}=; max-age=0; path=/; samesite=strict; secure`;
  }

  // Generate CSRF token
  public static generateToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  // Get CSRF header name
  public static getHeaderName(): string {
    return this.CSRF_HEADER_NAME;
  }

  // Validate CSRF token
  public static validateToken(token: string): boolean {
    const storedToken = this.getToken();
    return storedToken === token;
  }

  // Get CSRF headers for requests
  public static getHeaders(): Record<string, string> {
    const token = this.getToken();
    if (!token) {
      // Generate and set new token if none exists
      const newToken = this.generateToken();
      this.setToken(newToken);
      return { [this.CSRF_HEADER_NAME]: newToken };
    }
    return { [this.CSRF_HEADER_NAME]: token };
  }
}

// Rate limiting utilities
class RateLimiter {
  private static requests: Map<string, number[]> = new Map();
  private static readonly DEFAULT_WINDOW = 60000; // 1 minute
  private static readonly DEFAULT_MAX_REQUESTS = 100;

  // Check if request is allowed
  public static isAllowed(
    endpoint: string,
    window: number = this.DEFAULT_WINDOW,
    maxRequests: number = this.DEFAULT_MAX_REQUESTS
  ): boolean {
    const now = Date.now();
    const timestamps = this.requests.get(endpoint) || [];

    // Remove timestamps outside the window
    const validTimestamps = timestamps.filter(timestamp => now - timestamp < window);

    if (validTimestamps.length >= maxRequests) {
      return false;
    }

    // Add current timestamp
    validTimestamps.push(now);
    this.requests.set(endpoint, validTimestamps);

    return true;
  }

  // Get remaining requests for endpoint
  public static getRemainingRequests(
    endpoint: string,
    window: number = this.DEFAULT_WINDOW,
    maxRequests: number = this.DEFAULT_MAX_REQUESTS
  ): number {
    const now = Date.now();
    const timestamps = this.requests.get(endpoint) || [];
    const validTimestamps = timestamps.filter(timestamp => now - timestamp < window);
    return Math.max(0, maxRequests - validTimestamps.length);
  }

  // Reset rate limiter for endpoint
  public static reset(endpoint: string): void {
    this.requests.delete(endpoint);
  }

  // Clear all rate limiters
  public static clearAll(): void {
    this.requests.clear();
  }
}

// Secure headers utilities
class SecureHeaders {
  // Get security headers for API requests
  public static getSecurityHeaders(): Record<string, string> {
    return {
      'X-Requested-With': 'XMLHttpRequest',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
    };
  }

  // Get CSP header
  public static getCSPHeader(): string {
    return [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://api.openai.com https://*.bhashini.ai",
      "frame-src 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "report-uri /csp-violation-report",
    ].join('; ');
  }
}

// Environment variable validation
class EnvValidator {
  // Validate required environment variables
  public static validateRequired(vars: string[]): { valid: boolean; missing: string[] } {
    const missing: string[] = [];

    for (const variable of vars) {
      if (!process.env[variable]) {
        missing.push(variable);
      }
    }

    return {
      valid: missing.length === 0,
      missing,
    };
  }

  // Get environment variable with fallback
  public static getWithFallback(key: string, fallback: string): string {
    return process.env[key] || fallback;
  }

  // Validate URL format
  public static validateURL(key: string): { valid: boolean; value?: string; error?: string } {
    const value = process.env[key];
    if (!value) {
      return { valid: false, error: `Environment variable ${key} is not set` };
    }

    try {
      new URL(value);
      return { valid: true, value };
    } catch {
      return { valid: false, error: `Environment variable ${key} is not a valid URL` };
    }
  }
}

export { CSRFProtection, RateLimiter, SecureHeaders, EnvValidator };
