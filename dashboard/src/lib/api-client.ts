// API Client with authentication, error handling, and security features

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiError, ApiResponse } from './types';

class ApiClient {
  private client: AxiosInstance;
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000') {
    this.baseURL = baseURL;
    this.client = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor for authentication
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = this.getToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error: AxiosError) => {
        return this.handleError(error);
      }
    );
  }

  private handleError(error: AxiosError): Promise<never> {
    const apiError: ApiError = {
      message: 'An unexpected error occurred',
    };

    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      apiError.status = status;
      apiError.message = (data as any)?.message || this.getDefaultErrorMessage(status);
      apiError.code = (data as any)?.code;
      apiError.details = (data as any)?.details;

      // Handle specific status codes
      switch (status) {
        case 401:
          this.handleUnauthorized();
          break;
        case 403:
          apiError.message = 'Forbidden: You do not have permission';
          break;
        case 404:
          apiError.message = 'Not Found: Resource does not exist';
          break;
        case 429:
          apiError.message = 'Too Many Requests: Please try again later';
          break;
        case 500:
          apiError.message = 'Server Error: Please try again later';
          break;
      }
    } else if (error.request) {
      // Request made but no response
      apiError.message = 'Network Error: Please check your connection';
    } else {
      // Error in request setup
      apiError.message = error.message || 'Request Error';
    }

    return Promise.reject(apiError);
  }

  private getDefaultErrorMessage(status: number): string {
    const messages: Record<number, string> = {
      400: 'Bad Request: Invalid input',
      401: 'Unauthorized: Please log in again',
      403: 'Forbidden: You do not have permission',
      404: 'Not Found: Resource does not exist',
      409: 'Conflict: Resource already exists',
      422: 'Unprocessable Entity: Invalid data',
      429: 'Too Many Requests: Please try again later',
      500: 'Server Error: Please try again later',
      502: 'Bad Gateway: Service unavailable',
      503: 'Service Unavailable: Please try again later',
    };

    return messages[status] || `Error ${status}: Unknown error`;
  }

  private handleUnauthorized(): void {
    // Clear token and redirect to login
    this.clearToken();
    
    // Only redirect if we're in the browser
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }

  // Token management
  public setToken(token: string): void {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  public getToken(): string | null {
    if (!this.token && typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
    return this.token;
  }

  public clearToken(): void {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  // API methods
  public async get<T>(url: string, config?: InternalAxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.get<ApiResponse<T>>(url, config);
    return response.data;
  }

  public async post<T>(url: string, data?: any, config?: InternalAxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.post<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  public async put<T>(url: string, data?: any, config?: InternalAxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.put<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  public async patch<T>(url: string, data?: any, config?: InternalAxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.patch<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  public async delete<T>(url: string, config?: InternalAxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.delete<ApiResponse<T>>(url, config);
    return response.data;
  }

  // Health check
  public async healthCheck(): Promise<{ status: string; timestamp: string }> {
    const response = await this.client.get('/api/v1/health');
    return response.data;
  }
}

// Create singleton instance
const apiClient = new ApiClient();

export default apiClient;
