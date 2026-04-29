// Performance monitoring hook for tracking component render times and metrics
// Helps identify performance bottlenecks and optimize components

import { useEffect, useRef, useState, useCallback } from 'react';

export interface PerformanceMetrics {
  renderCount: number;
  lastRenderTime: number;
  averageRenderTime: number;
  maxRenderTime: number;
  minRenderTime: number;
}

export function usePerformanceMonitor(componentName: string, enabled: boolean = true) {
  const renderCountRef = useRef(0);
  const renderTimesRef = useRef<number[]>([]);
  const startTimeRef = useRef<number>(0);
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderCount: 0,
    lastRenderTime: 0,
    averageRenderTime: 0,
    maxRenderTime: 0,
    minRenderTime: 0,
  });

  // Start timing on component mount
  useEffect(() => {
    if (!enabled) return;
    
    startTimeRef.current = performance.now();
    renderCountRef.current = 0;
    renderTimesRef.current = [];
    
    return () => {
      // Log performance metrics on unmount
      if (enabled && renderTimesRef.current.length > 0) {
        const avgTime = renderTimesRef.current.reduce((a, b) => a + b, 0) / renderTimesRef.current.length;
        const maxTime = Math.max(...renderTimesRef.current);
        const minTime = Math.min(...renderTimesRef.current);
        
        console.log(`[Performance] ${componentName}:`, {
          renderCount: renderCountRef.current,
          averageRenderTime: `${avgTime.toFixed(2)}ms`,
          maxRenderTime: `${maxTime.toFixed(2)}ms`,
          minRenderTime: `${minTime.toFixed(2)}ms`,
        });
      }
    };
  }, [componentName, enabled]);

  // Track render time
  useEffect(() => {
    if (!enabled) return;
    
    const renderTime = performance.now() - startTimeRef.current;
    renderCountRef.current++;
    renderTimesRef.current.push(renderTime);
    
    // Update metrics state
    const avgTime = renderTimesRef.current.reduce((a, b) => a + b, 0) / renderTimesRef.current.length;
    const maxTime = Math.max(...renderTimesRef.current);
    const minTime = Math.min(...renderTimesRef.current);
    
    setMetrics({
      renderCount: renderCountRef.current,
      lastRenderTime: renderTime,
      averageRenderTime: avgTime,
      maxRenderTime: maxTime,
      minRenderTime: minTime,
    });
    
    // Reset start time for next render
    startTimeRef.current = performance.now();
  });

  // Log slow renders (> 16ms = 60fps threshold)
  useEffect(() => {
    if (!enabled) return;
    
    if (metrics.lastRenderTime > 16) {
      console.warn(`[Performance] ${componentName} slow render: ${metrics.lastRenderTime.toFixed(2)}ms`);
    }
  }, [metrics.lastRenderTime, componentName, enabled]);

  // Get current metrics
  const getMetrics = useCallback(() => {
    return { ...metrics };
  }, [metrics]);

  // Reset metrics
  const resetMetrics = useCallback(() => {
    renderCountRef.current = 0;
    renderTimesRef.current = [];
    setMetrics({
      renderCount: 0,
      lastRenderTime: 0,
      averageRenderTime: 0,
      maxRenderTime: 0,
      minRenderTime: 0,
    });
  }, []);

  return {
    metrics,
    getMetrics,
    resetMetrics,
  };
}

// Hook for measuring async operation performance
export function useAsyncPerformance() {
  const measureAsync = useCallback(async <T,>(
    operation: () => Promise<T>,
    operationName: string
  ): Promise<T> => {
    const startTime = performance.now();
    
    try {
      const result = await operation();
      const duration = performance.now() - startTime;
      
      console.log(`[Async Performance] ${operationName}: ${duration.toFixed(2)}ms`);
      
      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      console.error(`[Async Performance] ${operationName} failed after ${duration.toFixed(2)}ms:`, error);
      throw error;
    }
  }, []);

  return { measureAsync };
}

// Hook for tracking memory usage
export function useMemoryMonitor(enabled: boolean = true, interval: number = 5000) {
  const [memoryUsage, setMemoryUsage] = useState<{
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  } | null>(null);

  useEffect(() => {
    if (!enabled || typeof performance === 'undefined' || !('memory' in performance)) {
      return;
    }

    const updateMemoryUsage = () => {
      const memory = (performance as any).memory;
      if (memory) {
        setMemoryUsage({
          usedJSHeapSize: memory.usedJSHeapSize,
          totalJSHeapSize: memory.totalJSHeapSize,
          jsHeapSizeLimit: memory.jsHeapSizeLimit,
        });
      }
    };

    updateMemoryUsage();
    const intervalId = setInterval(updateMemoryUsage, interval);

    return () => clearInterval(intervalId);
  }, [enabled, interval]);

  const getMemoryUsageMB = useCallback(() => {
    if (!memoryUsage) return null;
    
    return {
      used: (memoryUsage.usedJSHeapSize / 1048576).toFixed(2),
      total: (memoryUsage.totalJSHeapSize / 1048576).toFixed(2),
      limit: (memoryUsage.jsHeapSizeLimit / 1048576).toFixed(2),
      percentage: ((memoryUsage.usedJSHeapSize / memoryUsage.jsHeapSizeLimit) * 100).toFixed(2),
    };
  }, [memoryUsage]);

  return {
    memoryUsage,
    getMemoryUsageMB,
  };
}
