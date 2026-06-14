/**
 * Audit Logs API Hook
 * React hook for managing audit log data with loading states and error handling
 */

import { useState, useEffect, useCallback } from 'react';
import {
  getAuditLogs,
  getAuditLogById,
  getEntityAuditLogs,
  getUserActivityLogs,
  getComplianceReports,
  generateComplianceReport,
  downloadComplianceReport,
  getAuditStats,
  type AuditLog,
  type ComplianceReport,
  type AuditLogsFilters,
} from '../../lib/api/audit';

export function useAuditLogs(filters?: AuditLogsFilters) {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAuditLogs(filters);
      setLogs(response.logs);
      setTotal(response.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch audit logs');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return { logs, loading, error, total, refetch: fetchLogs };
}

export function useAuditLogById(logId: string) {
  const [log, setLog] = useState<AuditLog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLog() {
      setLoading(true);
      setError(null);
      try {
        const data = await getAuditLogById(logId);
        setLog(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch audit log');
      } finally {
        setLoading(false);
      }
    }

    if (logId) {
      fetchLog();
    }
  }, [logId]);

  return { log, loading, error };
}

export function useEntityAuditLogs(entityType: string, entityId: string) {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLogs() {
      setLoading(true);
      setError(null);
      try {
        const data = await getEntityAuditLogs(entityType, entityId);
        setLogs(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch entity audit logs');
      } finally {
        setLoading(false);
      }
    }

    if (entityType && entityId) {
      fetchLogs();
    }
  }, [entityType, entityId]);

  return { logs, loading, error };
}

export function useUserActivityLogs(userId: string, limit: number = 50) {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLogs() {
      setLoading(true);
      setError(null);
      try {
        const data = await getUserActivityLogs(userId, limit);
        setLogs(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch user activity logs');
      } finally {
        setLoading(false);
      }
    }

    if (userId) {
      fetchLogs();
    }
  }, [userId, limit]);

  return { logs, loading, error };
}

export function useComplianceReports() {
  const [reports, setReports] = useState<ComplianceReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getComplianceReports();
      setReports(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch compliance reports');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return { reports, loading, error, refetch: fetchReports };
}

export function useAuditStats() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      setError(null);
      try {
        const data = await getAuditStats();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch audit stats');
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return { stats, loading, error };
}

export function useComplianceActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateReport = useCallback(async (
    reportType: 'gdpr' | 'data_protection' | 'access_control' | 'audit_trail',
    startDate: string,
    endDate: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      const result = await generateComplianceReport(reportType, startDate, endDate);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate compliance report');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const downloadReport = useCallback(async (reportId: string) => {
    setLoading(true);
    setError(null);
    try {
      const blob = await downloadComplianceReport(reportId);
      return blob;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to download compliance report');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    generateReport,
    downloadReport,
    loading,
    error,
  };
}
