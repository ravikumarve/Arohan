/**
 * System Monitoring API Hook
 * React hook for managing system monitoring data with loading states and error handling
 */

import { useState, useEffect, useCallback } from 'react';
import {
  getSystemMetrics,
  getServiceHealth,
  getThroughputMetrics,
  getRecentAlerts,
  getSystemHealthSummary,
  type SystemMetrics,
  type ServiceHealth,
  type ThroughputMetrics,
  type Alert,
} from '../../lib/api/system';

export function useSystemMetrics(autoRefresh: boolean = false, refreshInterval: number = 30000) {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSystemMetrics();
      setMetrics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch system metrics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMetrics();

    if (autoRefresh) {
      const interval = setInterval(fetchMetrics, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchMetrics, autoRefresh, refreshInterval]);

  return { metrics, loading, error, refetch: fetchMetrics };
}

export function useServiceHealth(autoRefresh: boolean = false, refreshInterval: number = 30000) {
  const [services, setServices] = useState<ServiceHealth[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getServiceHealth();
      setServices(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch service health');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();

    if (autoRefresh) {
      const interval = setInterval(fetchServices, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchServices, autoRefresh, refreshInterval]);

  return { services, loading, error, refetch: fetchServices };
}

export function useThroughputMetrics(autoRefresh: boolean = false, refreshInterval: number = 30000) {
  const [metrics, setMetrics] = useState<ThroughputMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getThroughputMetrics();
      setMetrics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch throughput metrics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMetrics();

    if (autoRefresh) {
      const interval = setInterval(fetchMetrics, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchMetrics, autoRefresh, refreshInterval]);

  return { metrics, loading, error, refetch: fetchMetrics };
}

export function useRecentAlerts(limit: number = 10, autoRefresh: boolean = false, refreshInterval: number = 30000) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getRecentAlerts(limit);
      setAlerts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch recent alerts');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchAlerts();

    if (autoRefresh) {
      const interval = setInterval(fetchAlerts, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchAlerts, autoRefresh, refreshInterval]);

  return { alerts, loading, error, refetch: fetchAlerts };
}

export function useSystemHealthSummary(autoRefresh: boolean = false, refreshInterval: number = 30000) {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSystemHealthSummary();
      setSummary(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch system health summary');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary();

    if (autoRefresh) {
      const interval = setInterval(fetchSummary, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchSummary, autoRefresh, refreshInterval]);

  return { summary, loading, error, refetch: fetchSummary };
}
