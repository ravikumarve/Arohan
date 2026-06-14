// Custom hook for managing timeouts with proper cleanup
// Prevents memory leaks by clearing timeouts on component unmount

import { useEffect, useRef, useCallback } from 'react';

export function useTimeout() {
  const isMountedRef = useRef(true);
  const timeoutIdsRef = useRef<Set<NodeJS.Timeout>>(new Set());

  // Cleanup function for all timeouts
  const clearTimeouts = useCallback(() => {
    timeoutIdsRef.current.forEach(timeoutId => {
      clearTimeout(timeoutId);
    });
    timeoutIdsRef.current.clear();
  }, []);

  // Safe setTimeout that tracks and cleans up
  const safeSetTimeout = useCallback((callback: () => void, delay: number) => {
    const timeoutId = setTimeout(() => {
      if (isMountedRef.current) {
        callback();
      }
      timeoutIdsRef.current.delete(timeoutId);
    }, delay);
    
    timeoutIdsRef.current.add(timeoutId);
    return timeoutId;
  }, []);

  // Clear specific timeout
  const clearTimeout = useCallback((timeoutId: NodeJS.Timeout) => {
    clearTimeout(timeoutId);
    timeoutIdsRef.current.delete(timeoutId);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    
    return () => {
      isMountedRef.current = false;
      clearTimeouts();
    };
  }, [clearTimeouts]);

  return {
    safeSetTimeout,
    clearTimeout,
    clearTimeouts,
    isMounted: isMountedRef,
  };
}
