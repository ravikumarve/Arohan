/**
 * Requisitions API Hook
 * React hook for managing requisitions data with loading states and error handling
 */

import { useState, useEffect, useCallback } from 'react';
import {
  getRequisitions,
  getRequisitionById,
  createRequisition,
  updateRequisition,
  deleteRequisition,
  holdRequisition,
  closeRequisition,
  getRequisitionStats,
  type Requisition,
  type CreateRequisitionRequest,
  type UpdateRequisitionRequest,
  type RequisitionsFilters,
} from '../../lib/api/requisitions';

export function useRequisitions(filters?: RequisitionsFilters) {
  const [requisitions, setRequisitions] = useState<Requisition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetchRequisitions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getRequisitions(filters);
      setRequisitions(response.requisitions);
      setTotal(response.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch requisitions');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchRequisitions();
  }, [fetchRequisitions]);

  return { requisitions, loading, error, total, refetch: fetchRequisitions };
}

export function useRequisition(requisitionId: string) {
  const [requisition, setRequisition] = useState<Requisition | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRequisition() {
      setLoading(true);
      setError(null);
      try {
        const data = await getRequisitionById(requisitionId);
        setRequisition(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch requisition');
      } finally {
        setLoading(false);
      }
    }

    if (requisitionId) {
      fetchRequisition();
    }
  }, [requisitionId]);

  return { requisition, loading, error };
}

export function useRequisitionStats() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      setError(null);
      try {
        const data = await getRequisitionStats();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch requisition stats');
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return { stats, loading, error };
}

export function useRequisitionActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createRequisitionAction = useCallback(async (data: CreateRequisitionRequest) => {
    setLoading(true);
    setError(null);
    try {
      const result = await createRequisition(data);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create requisition');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateRequisitionAction = useCallback(async (requisitionId: string, data: UpdateRequisitionRequest) => {
    setLoading(true);
    setError(null);
    try {
      const result = await updateRequisition(requisitionId, data);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update requisition');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteRequisitionAction = useCallback(async (requisitionId: string) => {
    setLoading(true);
    setError(null);
    try {
      await deleteRequisition(requisitionId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete requisition');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const holdRequisitionAction = useCallback(async (requisitionId: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await holdRequisition(requisitionId);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to hold requisition');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const closeRequisitionAction = useCallback(async (requisitionId: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await closeRequisition(requisitionId);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to close requisition');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createRequisition: createRequisitionAction,
    updateRequisition: updateRequisitionAction,
    deleteRequisition: deleteRequisitionAction,
    holdRequisition: holdRequisitionAction,
    closeRequisition: closeRequisitionAction,
    loading,
    error,
  };
}
