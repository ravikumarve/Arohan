// Custom hooks for data fetching and state management

import { useState, useEffect, useCallback, useRef } from 'react';
import { ApiError } from './types';
import apiClient from './api-client';

// Generic API hook for data fetching
export function useApi<T>(
  endpoint: string,
  options: {
    enabled?: boolean;
    refetchInterval?: number;
    onSuccess?: (data: T) => void;
    onError?: (error: ApiError) => void;
  } = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const { enabled = true, refetchInterval, onSuccess, onError } = options;

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get<T>(endpoint);
      setData(response.data);
      onSuccess?.(response.data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      onError?.(apiError);
    } finally {
      setLoading(false);
    }
  }, [endpoint, enabled, onSuccess, onError]);

  useEffect(() => {
    fetchData();

    if (refetchInterval) {
      const interval = setInterval(fetchData, refetchInterval);
      return () => clearInterval(interval);
    }
  }, [fetchData, refetchInterval]);

  return { data, loading, error, refetch: fetchData };
}

// Hook for mutations (POST, PUT, DELETE)
export function useMutation<T, P = any>(
  mutationFn: (params: P) => Promise<ApiResponse<T>>,
  options: {
    onSuccess?: (data: T) => void;
    onError?: (error: ApiError) => void;
    onSettled?: () => void;
  } = {}
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [data, setData] = useState<T | null>(null);

  const { onSuccess, onError, onSettled } = options;

  const mutate = useCallback(async (params: P) => {
    setLoading(true);
    setError(null);

    try {
      const response = await mutationFn(params);
      setData(response.data);
      onSuccess?.(response.data);
      return { success: true, data: response.data };
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      onError?.(apiError);
      return { success: false, error: apiError };
    } finally {
      setLoading(false);
      onSettled?.();
    }
  }, [mutationFn, onSuccess, onError, onSettled]);

  return { mutate, loading, error, data, reset: () => { setData(null); setError(null); } };
}

// Hook for loading state management
export function useLoadingState() {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  const setLoading = useCallback((key: string, value: boolean) => {
    setLoadingStates(prev => ({ ...prev, [key]: value }));
  }, []);

  const isLoading = useCallback((key: string) => {
    return loadingStates[key] || false;
  }, [loadingStates]);

  const withLoading = useCallback(async <T>(
    key: string,
    fn: () => Promise<T>
  ): Promise<T> => {
    try {
      setLoading(key, true);
      return await fn();
    } finally {
      setLoading(key, false);
    }
  }, [setLoading]);

  return { loadingStates, setLoading, isLoading, withLoading };
}

// Hook for debounced values
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Hook for local storage persistence
export function usePersistedState<T>(
  key: string,
  defaultValue: T,
  options: {
    serialize?: (value: T) => string;
    deserialize?: (value: string) => T;
  } = {}
) {
  const { serialize = JSON.stringify, deserialize = JSON.parse } = options;

  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return defaultValue;

    try {
      const item = localStorage.getItem(key);
      return item ? deserialize(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  });

  const setPersistedValue = useCallback((newValue: T) => {
    setValue(newValue);

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(key, serialize(newValue));
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    }
  }, [key, serialize]);

  return [value, setPersistedValue] as const;
}

// Hook for WebSocket connections
export function useWebSocket<T>(url: string, options: {
  onMessage?: (data: T) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  reconnectInterval?: number;
} = {}) {
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { onMessage, onConnect, onDisconnect, reconnectInterval = 3000 } = options;

  const connect = useCallback(() => {
    try {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        setConnected(true);
        setError(null);
        onConnect?.();
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as T;
          onMessage?.(data);
        } catch (err) {
          console.error('Failed to parse WebSocket message:', err);
        }
      };

      ws.onerror = (event) => {
        console.error('WebSocket error:', event);
        setError(new Error('WebSocket connection error'));
      };

      ws.onclose = () => {
        setConnected(false);
        onDisconnect?.();

        // Attempt to reconnect
        if (reconnectInterval > 0) {
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectInterval);
        }
      };
    } catch (err) {
      setError(err as Error);
    }
  }, [url, onMessage, onConnect, onDisconnect, reconnectInterval]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    setConnected(false);
  }, []);

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return { connected, error, disconnect };
}

// Hook for pagination
export function usePagination<T>(
  fetchFn: (page: number, limit: number) => Promise<{ data: T[]; total: number }>,
  initialLimit: number = 10
) {
  const [data, setData] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(initialLimit);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async (currentPage: number) => {
    setLoading(true);
    try {
      const response = await fetchFn(currentPage, limit);
      setData(response.data);
      setTotal(response.total);
    } finally {
      setLoading(false);
    }
  }, [fetchFn, limit]);

  useEffect(() => {
    fetchData(page);
  }, [page, fetchData]);

  const totalPages = Math.ceil(total / limit);

  const nextPage = useCallback(() => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  }, [page, totalPages]);

  const prevPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const goToPage = useCallback((newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  }, [totalPages]);

  return {
    data,
    page,
    setPage,
    limit,
    setLimit,
    total,
    totalPages,
    loading,
    refresh: () => fetchData(page),
    nextPage,
    prevPage,
    goToPage,
  };
}
