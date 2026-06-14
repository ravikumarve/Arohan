import { useState, useEffect, useCallback, useRef } from 'react';

// WebSocket Event Types
export interface WebSocketMessage<T = any> {
  type: string;
  data: T;
  timestamp: number;
}

export interface WebSocketConfig {
  url: string;
  protocols?: string | string[];
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  heartbeatInterval?: number;
}

export type WebSocketStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

// WebSocket Hook
export function useWebSocket<T = any>(config: WebSocketConfig) {
  const [status, setStatus] = useState<WebSocketStatus>('disconnected');
  const [lastMessage, setLastMessage] = useState<WebSocketMessage<T> | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const messageListenersRef = useRef<Map<string, Set<(data: T) => void>>>(new Map());

  const {
    url,
    protocols,
    reconnectInterval = 3000,
    maxReconnectAttempts = 5,
    heartbeatInterval = 30000,
  } = config;

  // Connect to WebSocket
  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    setStatus('connecting');
    setError(null);

    try {
      const ws = new WebSocket(url, protocols);
      wsRef.current = ws;

      ws.onopen = () => {
        setStatus('connected');
        reconnectAttemptsRef.current = 0;
        startHeartbeat();
      };

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage<T> = JSON.parse(event.data);
          setLastMessage(message);

          // Notify listeners for this message type
          const listeners = messageListenersRef.current.get(message.type);
          if (listeners) {
            listeners.forEach((listener) => listener(message.data));
          }
        } catch (err) {
          console.error('Error parsing WebSocket message:', err);
        }
      };

      ws.onerror = (event) => {
        console.error('WebSocket error:', event);
        setStatus('error');
        setError(new Error('WebSocket connection error'));
      };

      ws.onclose = () => {
        setStatus('disconnected');
        stopHeartbeat();

        // Attempt to reconnect
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current++;
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectInterval);
        }
      };
    } catch (err) {
      setStatus('error');
      setError(err as Error);
    }
  }, [url, protocols, reconnectInterval, maxReconnectAttempts]);

  // Disconnect from WebSocket
  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (heartbeatTimeoutRef.current) {
      clearTimeout(heartbeatTimeoutRef.current);
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setStatus('disconnected');
  }, []);

  // Send message
  const send = useCallback((type: string, data: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const message: WebSocketMessage = {
        type,
        data,
        timestamp: Date.now(),
      };
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected');
    }
  }, []);

  // Subscribe to message type
  const subscribe = useCallback((type: string, listener: (data: T) => void) => {
    if (!messageListenersRef.current.has(type)) {
      messageListenersRef.current.set(type, new Set());
    }
    messageListenersRef.current.get(type)!.add(listener);

    // Return unsubscribe function
    return () => {
      const listeners = messageListenersRef.current.get(type);
      if (listeners) {
        listeners.delete(listener);
        if (listeners.size === 0) {
          messageListenersRef.current.delete(type);
        }
      }
    };
  }, []);

  // Start heartbeat
  const startHeartbeat = useCallback(() => {
    if (heartbeatTimeoutRef.current) {
      clearTimeout(heartbeatTimeoutRef.current);
    }

    heartbeatTimeoutRef.current = setInterval(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: 'heartbeat', timestamp: Date.now() }));
      }
    }, heartbeatInterval);
  }, [heartbeatInterval]);

  // Stop heartbeat
  const stopHeartbeat = useCallback(() => {
    if (heartbeatTimeoutRef.current) {
      clearTimeout(heartbeatTimeoutRef.current);
      heartbeatTimeoutRef.current = null;
    }
  }, []);

  // Connect on mount
  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    status,
    lastMessage,
    error,
    isConnected: status === 'connected',
    connect,
    disconnect,
    send,
    subscribe,
  };
}

// Real-time Data Hook
export function useRealTimeData<T>(
  wsConfig: WebSocketConfig,
  messageType: string,
  initialData: T
) {
  const [data, setData] = useState<T>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const ws = useWebSocket<T>(wsConfig);

  useEffect(() => {
    const unsubscribe = ws.subscribe(messageType, (newData) => {
      setData(newData);
      setIsLoading(false);
      setError(null);
    });

    return unsubscribe;
  }, [ws, messageType]);

  const refresh = useCallback(() => {
    setIsLoading(true);
    ws.send('request', { type: messageType });
  }, [ws, messageType]);

  return {
    data,
    isLoading,
    error,
    refresh,
    status: ws.status,
    isConnected: ws.isConnected,
  };
}

// Real-time List Hook
export function useRealTimeList<T>(
  wsConfig: WebSocketConfig,
  messageType: string,
  initialList: T[] = []
) {
  const [list, setList] = useState<T[]>(initialList);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const ws = useWebSocket(wsConfig);

  useEffect(() => {
    const unsubscribe = ws.subscribe(messageType, (message) => {
      if (message.action === 'create') {
        setList((prev) => [...prev, message.item]);
      } else if (message.action === 'update') {
        setList((prev) =>
          prev.map((item) =>
            (item as any).id === message.item.id ? message.item : item
          )
        );
      } else if (message.action === 'delete') {
        setList((prev) => prev.filter((item) => (item as any).id !== message.id));
      } else if (message.action === 'replace') {
        setList(message.items);
      }
      setIsLoading(false);
      setError(null);
    });

    return unsubscribe;
  }, [ws, messageType]);

  const refresh = useCallback(() => {
    setIsLoading(true);
    ws.send('request', { type: messageType });
  }, [ws, messageType]);

  return {
    list,
    isLoading,
    error,
    refresh,
    status: ws.status,
    isConnected: ws.isConnected,
  };
}

// WebSocket Connection Status Component
interface ConnectionStatusProps {
  status: WebSocketStatus;
  className?: string;
}

export function ConnectionStatus({ status, className = '' }: ConnectionStatusProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'connected':
        return 'bg-green-500';
      case 'connecting':
        return 'bg-yellow-500';
      case 'disconnected':
        return 'bg-gray-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'connected':
        return 'Connected';
      case 'connecting':
        return 'Connecting...';
      case 'disconnected':
        return 'Disconnected';
      case 'error':
        return 'Error';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`w-2 h-2 rounded-full ${getStatusColor()} animate-pulse`} />
      <span className="text-sm text-recruiter-primary-light">{getStatusText()}</span>
    </div>
  );
}

// Real-time Updates Indicator Component
interface RealTimeIndicatorProps {
  isActive: boolean;
  lastUpdate?: Date;
  className?: string;
}

export function RealTimeIndicator({
  isActive,
  lastUpdate,
  className = '',
}: RealTimeIndicatorProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div
        className={`w-2 h-2 rounded-full ${
          isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-500'
        }`}
      />
      <span className="text-sm text-recruiter-primary-light">
        {isActive ? 'Live' : 'Offline'}
      </span>
      {lastUpdate && (
        <span className="text-xs text-recruiter-primary-light">
          Last update: {lastUpdate.toLocaleTimeString()}
        </span>
      )}
    </div>
  );
}

// Auto-refresh Hook
export function useAutoRefresh(
  callback: () => void | Promise<void>,
  interval: number,
  isActive: boolean = true
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isActive) {
      return;
    }

    const runRefresh = async () => {
      try {
        await callback();
      } catch (err) {
        console.error('Auto-refresh error:', err);
      }
    };

    // Initial refresh
    runRefresh();

    // Set up interval
    timeoutRef.current = setInterval(runRefresh, interval);

    return () => {
      if (timeoutRef.current) {
        clearInterval(timeoutRef.current);
      }
    };
  }, [callback, interval, isActive]);
}

// Real-time Counter Hook
export function useRealTimeCounter(
  wsConfig: WebSocketConfig,
  messageType: string,
  initialValue: number = 0
) {
  const [count, setCount] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(false);

  const ws = useWebSocket(wsConfig);

  useEffect(() => {
    const unsubscribe = ws.subscribe(messageType, (message) => {
      if (message.action === 'increment') {
        setCount((prev) => prev + (message.delta || 1));
      } else if (message.action === 'decrement') {
        setCount((prev) => prev - (message.delta || 1));
      } else if (message.action === 'set') {
        setCount(message.value);
      }
      setIsLoading(false);
    });

    return unsubscribe;
  }, [ws, messageType]);

  const increment = useCallback((delta: number = 1) => {
    ws.send('action', { type: messageType, action: 'increment', delta });
  }, [ws, messageType]);

  const decrement = useCallback((delta: number = 1) => {
    ws.send('action', { type: messageType, action: 'decrement', delta });
  }, [ws, messageType]);

  const reset = useCallback(() => {
    ws.send('action', { type: messageType, action: 'set', value: initialValue });
  }, [ws, messageType, initialValue]);

  return {
    count,
    isLoading,
    increment,
    decrement,
    reset,
    status: ws.status,
    isConnected: ws.isConnected,
  };
}