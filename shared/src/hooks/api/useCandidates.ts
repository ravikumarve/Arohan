/**
 * Candidates API Hook
 * React hook for managing candidates data with loading states and error handling
 */

import { useState, useEffect, useCallback } from 'react';
import {
  getCandidates,
  getCandidateById,
  shortlistCandidate,
  rejectCandidate,
  bulkShortlistCandidates,
  bulkRejectCandidates,
  getCandidateStats,
  type Candidate,
  type CandidatesFilters,
} from '../../lib/api/candidates';

export function useCandidates(filters?: CandidatesFilters) {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetchCandidates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getCandidates(filters);
      setCandidates(response.candidates);
      setTotal(response.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch candidates');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  return { candidates, loading, error, total, refetch: fetchCandidates };
}

export function useCandidate(candidateId: string) {
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCandidate() {
      setLoading(true);
      setError(null);
      try {
        const data = await getCandidateById(candidateId);
        setCandidate(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch candidate');
      } finally {
        setLoading(false);
      }
    }

    if (candidateId) {
      fetchCandidate();
    }
  }, [candidateId]);

  return { candidate, loading, error };
}

export function useCandidateStats() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      setError(null);
      try {
        const data = await getCandidateStats();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch candidate stats');
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return { stats, loading, error };
}

export function useCandidateActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shortlistCandidateAction = useCallback(async (candidateId: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await shortlistCandidate(candidateId);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to shortlist candidate');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const rejectCandidateAction = useCallback(async (candidateId: string, reason?: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await rejectCandidate(candidateId, reason);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject candidate');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const bulkShortlistAction = useCallback(async (candidateIds: string[]) => {
    setLoading(true);
    setError(null);
    try {
      const result = await bulkShortlistCandidates(candidateIds);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to bulk shortlist candidates');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const bulkRejectAction = useCallback(async (candidateIds: string[], reason?: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await bulkRejectCandidates(candidateIds, reason);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to bulk reject candidates');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    shortlistCandidate: shortlistCandidateAction,
    rejectCandidate: rejectCandidateAction,
    bulkShortlist: bulkShortlistAction,
    bulkReject: bulkRejectAction,
    loading,
    error,
  };
}
