// Next.js middleware for security headers and authentication

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Security headers
const securityHeaders = {
  'X-DNS-Prefetch-Control': 'on',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  'Content-Security-Policy': [
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
  ].join('; '),
};

// Rate limiting configuration
const rateLimitConfig = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100, // 100 requests per minute
};

// Simple in-memory rate limiting (for production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record || now > record.resetTime) {
    // Create new record or reset expired one
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + rateLimitConfig.windowMs,
    });
    return true;
  }

  if (record.count >= rateLimitConfig.maxRequests) {
    return false;
  }

  record.count++;
  return true;
}

function getRateLimitHeaders(identifier: string): Record<string, string> {
  const record = rateLimitMap.get(identifier);
  if (!record) {
    return {
      'X-RateLimit-Limit': rateLimitConfig.maxRequests.toString(),
      'X-RateLimit-Remaining': rateLimitConfig.maxRequests.toString(),
      'X-RateLimit-Reset': Math.ceil((Date.now() + rateLimitConfig.windowMs) / 1000).toString(),
    };
  }

  const remaining = Math.max(0, rateLimitConfig.maxRequests - record.count);
  const resetTime = Math.ceil(record.resetTime / 1000);

  return {
    'X-RateLimit-Limit': rateLimitConfig.maxRequests.toString(),
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': resetTime.toString(),
  };
}

// Paths that don't require authentication
const publicPaths = ['/login', '/register', '/api/auth/login', '/api/auth/register'];

// Paths that require admin role
const adminPaths = ['/admin', '/api/admin'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const identifier = request.ip || request.headers.get('x-forwarded-for') || 'unknown';

  // Check rate limiting
  if (!checkRateLimit(identifier)) {
    return new NextResponse('Too Many Requests', {
      status: 429,
      headers: {
        ...getRateLimitHeaders(identifier),
        'Retry-After': '60',
      },
    });
  }

  // Add security headers
  const response = NextResponse.next();

  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Add rate limit headers
  Object.entries(getRateLimitHeaders(identifier)).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Check authentication for protected routes
  const token = request.cookies.get('auth_token')?.value;
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));

  if (!isPublicPath && !token) {
    // Redirect to login for protected routes
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check admin role for admin routes
  if (adminPaths.some(path => pathname.startsWith(path))) {
    // In production, verify the token and check user role
    // For now, we'll just check if the token exists
    if (!token) {
      return new NextResponse('Forbidden', { status: 403 });
    }
  }

  // Add CORS headers for API routes
  if (pathname.startsWith('/api')) {
  response.headers.set('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_ALLOWED_ORIGINS || '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-CSRFToken');
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  }

  // Handle OPTIONS request for CORS
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: response.headers,
    });
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
