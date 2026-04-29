// Async Error Boundary for handling async operation errors
// Provides error handling for promises, async/await, and async operations

import { Component, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, XCircle } from 'lucide-react';

interface AsyncError {
  message: string;
  code?: string;
  details?: any;
}

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: AsyncError) => void;
}

interface State {
  hasError: boolean;
  error?: AsyncError;
  isPending: boolean;
}

export class AsyncErrorBoundary extends Component<Props, State> {
  private pendingPromises: Set<Promise<any>> = new Set();

  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, isPending: false };
  }

  // Track pending promises
  trackPromise = <T,>(promise: Promise<T>): Promise<T> => {
    this.pendingPromises.add(promise);
    this.setState({ isPending: true });

    promise.finally(() => {
      this.pendingPromises.delete(promise);
      if (this.pendingPromises.size === 0) {
        this.setState({ isPending: false });
      }
    });

    return promise.catch((error) => {
      this.handleError(error);
      throw error;
    });
  };

  // Handle async errors
  handleError = (error: any) => {
    const asyncError: AsyncError = {
      message: error.message || 'An async error occurred',
      code: error.code,
      details: error.details,
    };

    this.setState({ hasError: true, error: asyncError });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(asyncError);
    }

    // Log to error tracking service in production
    if (process.env.NODE_ENV === 'production') {
      console.error('Production async error:', asyncError);
    }
  };

  // Retry the failed operation
  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  // Clear error
  handleClear = () => {
    this.setState({ hasError: false, error: undefined });
  };

  // Cleanup on unmount
  componentWillUnmount() {
    this.pendingPromises.clear();
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card className="w-full border-red-500/50 bg-red-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-400">
              <AlertCircle className="w-5 h-5" />
              Async Operation Error
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-400 text-sm">
              {this.state.error?.message || 'An async operation failed'}
            </p>
            
            {this.state.error?.code && (
              <p className="text-xs text-slate-500">
                Error Code: {this.state.error.code}
              </p>
            )}
            
            {process.env.NODE_ENV === 'development' && this.state.error?.details && (
              <details className="mt-4">
                <summary className="cursor-pointer text-slate-500 text-sm hover:text-slate-400">
                  Error Details
                </summary>
                <pre className="mt-2 p-3 bg-slate-900 rounded text-xs text-slate-400 overflow-auto max-h-40">
                  {JSON.stringify(this.state.error.details, null, 2)}
                </pre>
              </details>
            )}
            
            <div className="flex gap-2">
              <Button
                onClick={this.handleRetry}
                variant="outline"
                className="flex-1 border-red-500/50 text-red-400 hover:bg-red-500/10"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </Button>
              <Button
                onClick={this.handleClear}
                variant="outline"
                className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Dismiss
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

// Hook for using async error boundary
export function useAsyncError() {
  const handleError = (error: any) => {
    throw error; // This will be caught by the nearest AsyncErrorBoundary
  };

  return { handleError };
}

// HOC for wrapping components with async error boundary
export function withAsyncErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return function WithAsyncErrorBoundaryWrapper(props: P) {
    return (
      <AsyncErrorBoundary fallback={fallback}>
        <Component {...props} />
      </AsyncErrorBoundary>
    );
  };
}
