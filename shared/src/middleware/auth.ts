import { NextRequest, NextResponse } from 'next/server';
import { UserRole } from '../lib/types';

export interface AuthConfig {
  publicPaths: string[];
  adminPaths: string[];
  recruiterPaths: string[];
  loginPath: string;
}

export function createAuthMiddleware(config: AuthConfig) {
  return function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get('auth_token')?.value;
    const userRole = request.cookies.get('user_role')?.value as UserRole | undefined;

    // Check if path is public
    if (config.publicPaths.some(path => pathname.startsWith(path))) {
      return NextResponse.next();
    }

    // Check if user is authenticated
    if (!token) {
      return NextResponse.redirect(new URL(config.loginPath, request.url));
    }

    // Check role-based access
    if (config.adminPaths.some(path => pathname.startsWith(path))) {
      if (userRole !== 'ADMIN') {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
    }

    if (config.recruiterPaths.some(path => pathname.startsWith(path))) {
      if (userRole !== 'RECRUITER' && userRole !== 'ADMIN') {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
    }

    return NextResponse.next();
  };
}

// Admin dashboard middleware
export const adminAuthMiddleware = createAuthMiddleware({
  publicPaths: ['/login', '/api/auth'],
  adminPaths: ['/admin'],
  recruiterPaths: [],
  loginPath: '/login',
});

// Recruiter dashboard middleware
export const recruiterAuthMiddleware = createAuthMiddleware({
  publicPaths: ['/login', '/api/auth'],
  adminPaths: [],
  recruiterPaths: ['/dashboard'],
  loginPath: '/login',
});
