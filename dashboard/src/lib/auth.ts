// Authentication utilities and hooks

import { useState, useEffect, useCallback } from 'react';
import { AuthUser, AuthSession } from './types';
import apiClient from './api-client';

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
    isAuthenticated: false,
  });

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const token = apiClient.getToken();
      if (!token) {
        setState({
          user: null,
          loading: false,
          error: null,
          isAuthenticated: false,
        });
        return;
      }

      const response = await apiClient.get<{ user: AuthUser }>('/api/v1/auth/verify');
      
      setState({
        user: response.data.user,
        loading: false,
        error: null,
        isAuthenticated: true,
      });
    } catch (error) {
      console.error('Auth check failed:', error);
      apiClient.clearToken();
      setState({
        user: null,
        loading: false,
        error: 'Authentication failed',
        isAuthenticated: false,
      });
    }
  }, []);

  const login = useCallback(async (email: string, password: string, rememberMe: boolean = false) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const response = await apiClient.post<AuthSession>('/api/v1/auth/login', {
        email,
        password,
        rememberMe,
      });

      // Store token
      apiClient.setToken(response.data.token);

      // Update state
      setState({
        user: response.data.user,
        loading: false,
        error: null,
        isAuthenticated: true,
      });

      return { success: true };
    } catch (error: any) {
      const errorMessage = error.message || 'Login failed';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiClient.post('/api/v1/auth/logout');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      apiClient.clearToken();
      setState({
        user: null,
        loading: false,
        error: null,
        isAuthenticated: false,
      });
    }
  }, []);

  const refreshToken = useCallback(async () => {
    try {
      const response = await apiClient.post<AuthSession>('/api/v1/auth/refresh');
      apiClient.setToken(response.data.token);
      
      setState({
        user: response.data.user,
        loading: false,
        error: null,
        isAuthenticated: true,
      });

      return { success: true };
    } catch (error: any) {
      console.error('Token refresh failed:', error);
      apiClient.clearToken();
      setState({
        user: null,
        loading: false,
        error: 'Session expired',
        isAuthenticated: false,
      });
      return { success: false, error: 'Session expired' };
    }
  }, []);

  return {
    ...state,
    login,
    logout,
    refreshToken,
    checkAuth,
  };
};

// Higher-order component for protected routes
export const withAuth = <P extends object>(Component: React.ComponentType<P>) => {
  return function ProtectedComponent(props: P) {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
      );
    }

    if (!isAuthenticated) {
      // Redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      return null;
    }

    return <Component {...props} />;
  };
};

// Role-based access control
export const hasRole = (user: AuthUser | null, roles: string[]): boolean => {
  if (!user) return false;
  return roles.includes(user.role);
};

export const isAdmin = (user: AuthUser | null): boolean => {
  return hasRole(user, ['admin']);
};

export const canAccess = (user: AuthUser | null, requiredRole: string): boolean => {
  if (!user) return false;
  
  const roleHierarchy: Record<string, number> = {
    admin: 3,
    user: 2,
    viewer: 1,
  };

  return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
};
