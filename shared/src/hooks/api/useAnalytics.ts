/**
 * Analytics API Hook
 * React hook for managing analytics data with loading states and error handling
 */

import { useState, useEffect, useCallback } from 'react';
import {
  getAnalyticsData,
  getAnalyticsOverview,
  getHiringFunnel,
  getTimeMetrics,
  getSourcePerformance,
  getQualityMetrics,
  getGeographicDistribution,
  getMonthlyTrends,
  getRequisitionPerformance,
  exportAnalyticsData,
  type AnalyticsData,
  type AnalyticsFilters,
  type AnalyticsOverview,
  type HiringFunnel,
  type TimeMetrics,
  type SourcePerformance,
  type QualityMetrics,
  type GeographicDistribution,
  type MonthlyTrend,
  type RequisitionPerformance,
} from '../../lib/api/analytics';

export function useAnalytics(filters?: AnalyticsFilters) {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAnalyticsData(filters);
      setAnalyticsData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return { analyticsData, loading, error, refetch: fetchAnalytics };
}

export function useAnalyticsOverview(filters?: AnalyticsFilters) {
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOverview = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAnalyticsOverview(filters);
      setOverview(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics overview');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  return { overview, loading, error, refetch: fetchOverview };
}

export function useHiringFunnel(filters?: AnalyticsFilters) {
  const [funnel, setFunnel] = useState<HiringFunnel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFunnel = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getHiringFunnel(filters);
      setFunnel(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch hiring funnel');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchFunnel();
  }, [fetchFunnel]);

  return { funnel, loading, error, refetch: fetchFunnel };
}

export function useTimeMetrics(filters?: AnalyticsFilters) {
  const [timeMetrics, setTimeMetrics] = useState<TimeMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTimeMetrics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTimeMetrics(filters);
      setTimeMetrics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch time metrics');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTimeMetrics();
  }, [fetchTimeMetrics]);

  return { timeMetrics, loading, error, refetch: fetchTimeMetrics };
}

export function useSourcePerformance(filters?: AnalyticsFilters) {
  const [sourcePerformance, setSourcePerformance] = useState<SourcePerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSourcePerformance = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSourcePerformance(filters);
      setSourcePerformance(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch source performance');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchSourcePerformance();
  }, [fetchSourcePerformance]);

  return { sourcePerformance, loading, error, refetch: fetchSourcePerformance };
}

export function useQualityMetrics(filters?: AnalyticsFilters) {
  const [qualityMetrics, setQualityMetrics] = useState<QualityMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQualityMetrics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getQualityMetrics(filters);
      setQualityMetrics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch quality metrics');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchQualityMetrics();
  }, [fetchQualityMetrics]);

  return { qualityMetrics, loading, error, refetch: fetchQualityMetrics };
}

export function useGeographicDistribution(filters?: AnalyticsFilters) {
  const [geographicDistribution, setGeographicDistribution] = useState<GeographicDistribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGeographicDistribution = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getGeographicDistribution(filters);
      setGeographicDistribution(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch geographic distribution');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchGeographicDistribution();
  }, [fetchGeographicDistribution]);

  return { geographicDistribution, loading, error, refetch: fetchGeographicDistribution };
}

export function useMonthlyTrends(filters?: AnalyticsFilters) {
  const [monthlyTrends, setMonthlyTrends] = useState<MonthlyTrend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMonthlyTrends = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMonthlyTrends(filters);
      setMonthlyTrends(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch monthly trends');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchMonthlyTrends();
  }, [fetchMonthlyTrends]);

  return { monthlyTrends, loading, error, refetch: fetchMonthlyTrends };
}

export function useRequisitionPerformance(filters?: AnalyticsFilters) {
  const [requisitionPerformance, setRequisitionPerformance] = useState<RequisitionPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRequisitionPerformance = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getRequisitionPerformance(filters);
      setRequisitionPerformance(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch requisition performance');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchRequisitionPerformance();
  }, [fetchRequisitionPerformance]);

  return { requisitionPerformance, loading, error, refetch: fetchRequisitionPerformance };
}

export function useAnalyticsActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportAnalytics = useCallback(async (filters?: AnalyticsFilters) => {
    setLoading(true);
    setError(null);
    try {
      const blob = await exportAnalyticsData(filters);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export analytics data');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    exportAnalytics,
    loading,
    error,
  };
}