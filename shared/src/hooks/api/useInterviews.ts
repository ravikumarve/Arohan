/**
 * Interviews API Hook
 * React hook for managing interviews data with loading states and error handling
 */

import { useState, useEffect, useCallback } from 'react';
import {
  getInterviews,
  getInterviewById,
  getCandidateInterviews,
  getRequisitionInterviews,
  createInterview,
  updateInterview,
  deleteInterview,
  startInterview,
  completeInterview,
  cancelInterview,
  rescheduleInterview,
  getInterviewStats,
  type Interview,
  type CreateInterviewRequest,
  type UpdateInterviewRequest,
  type InterviewsFilters,
} from '../../lib/api/interviews';

export function useInterviews(filters?: InterviewsFilters) {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetchInterviews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getInterviews(filters);
      setInterviews(response.interviews);
      setTotal(response.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch interviews');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchInterviews();
  }, [fetchInterviews]);

  return { interviews, loading, error, total, refetch: fetchInterviews };
}

export function useInterview(interviewId: string) {
  const [interview, setInterview] = useState<Interview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchInterview() {
      setLoading(true);
      setError(null);
      try {
        const data = await getInterviewById(interviewId);
        setInterview(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch interview');
      } finally {
        setLoading(false);
      }
    }

    if (interviewId) {
      fetchInterview();
    }
  }, [interviewId]);

  return { interview, loading, error };
}

export function useCandidateInterviews(candidateId: string) {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchInterviews() {
      setLoading(true);
      setError(null);
      try {
        const data = await getCandidateInterviews(candidateId);
        setInterviews(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch candidate interviews');
      } finally {
        setLoading(false);
      }
    }

    if (candidateId) {
      fetchInterviews();
    }
  }, [candidateId]);

  return { interviews, loading, error };
}

export function useRequisitionInterviews(requisitionId: string) {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchInterviews() {
      setLoading(true);
      setError(null);
      try {
        const data = await getRequisitionInterviews(requisitionId);
        setInterviews(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch requisition interviews');
      } finally {
        setLoading(false);
      }
    }

    if (requisitionId) {
      fetchInterviews();
    }
  }, [requisitionId]);

  return { interviews, loading, error };
}

export function useInterviewStats() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      setError(null);
      try {
        const data = await getInterviewStats();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch interview stats');
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return { stats, loading, error };
}

export function useInterviewActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createInterviewAction = useCallback(async (data: CreateInterviewRequest) => {
    setLoading(true);
    setError(null);
    try {
      const result = await createInterview(data);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create interview');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateInterviewAction = useCallback(async (interviewId: string, data: UpdateInterviewRequest) => {
    setLoading(true);
    setError(null);
    try {
      const result = await updateInterview(interviewId, data);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update interview');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteInterviewAction = useCallback(async (interviewId: string) => {
    setLoading(true);
    setError(null);
    try {
      await deleteInterview(interviewId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete interview');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const startInterviewAction = useCallback(async (interviewId: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await startInterview(interviewId);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start interview');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const completeInterviewAction = useCallback(async (interviewId: string, feedback: string, score: number) => {
    setLoading(true);
    setError(null);
    try {
      const result = await completeInterview(interviewId, feedback, score);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete interview');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const cancelInterviewAction = useCallback(async (interviewId: string, reason: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await cancelInterview(interviewId, reason);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel interview');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const rescheduleInterviewAction = useCallback(async (interviewId: string, scheduledDate: string, scheduledTime: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await rescheduleInterview(interviewId, scheduledDate, scheduledTime);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reschedule interview');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createInterview: createInterviewAction,
    updateInterview: updateInterviewAction,
    deleteInterview: deleteInterviewAction,
    startInterview: startInterviewAction,
    completeInterview: completeInterviewAction,
    cancelInterview: cancelInterviewAction,
    rescheduleInterview: rescheduleInterviewAction,
    loading,
    error,
  };
}
