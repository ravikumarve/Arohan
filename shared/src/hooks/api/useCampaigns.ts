/**
 * Campaigns API Hook
 * React hook for managing campaigns data with loading states and error handling
 */

import { useState, useEffect, useCallback } from 'react';
import {
  getCampaigns,
  getCampaignById,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  pauseCampaign,
  resumeCampaign,
  getCampaignStats,
  type Campaign,
  type CreateCampaignRequest,
  type UpdateCampaignRequest,
  type CampaignsFilters,
} from '../../lib/api/campaigns';

export function useCampaigns(filters?: CampaignsFilters) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetchCampaigns = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getCampaigns(filters);
      setCampaigns(response.campaigns);
      setTotal(response.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch campaigns');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  return { campaigns, loading, error, total, refetch: fetchCampaigns };
}

export function useCampaign(campaignId: string) {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCampaign() {
      setLoading(true);
      setError(null);
      try {
        const data = await getCampaignById(campaignId);
        setCampaign(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch campaign');
      } finally {
        setLoading(false);
      }
    }

    if (campaignId) {
      fetchCampaign();
    }
  }, [campaignId]);

  return { campaign, loading, error };
}

export function useCampaignStats() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      setError(null);
      try {
        const data = await getCampaignStats();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch campaign stats');
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return { stats, loading, error };
}

export function useCampaignActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCampaignAction = useCallback(async (data: CreateCampaignRequest) => {
    setLoading(true);
    setError(null);
    try {
      const result = await createCampaign(data);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create campaign');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCampaignAction = useCallback(async (campaignId: string, data: UpdateCampaignRequest) => {
    setLoading(true);
    setError(null);
    try {
      const result = await updateCampaign(campaignId, data);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update campaign');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteCampaignAction = useCallback(async (campaignId: string) => {
    setLoading(true);
    setError(null);
    try {
      await deleteCampaign(campaignId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete campaign');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const pauseCampaignAction = useCallback(async (campaignId: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await pauseCampaign(campaignId);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to pause campaign');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const resumeCampaignAction = useCallback(async (campaignId: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await resumeCampaign(campaignId);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resume campaign');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createCampaign: createCampaignAction,
    updateCampaign: updateCampaignAction,
    deleteCampaign: deleteCampaignAction,
    pauseCampaign: pauseCampaignAction,
    resumeCampaign: resumeCampaignAction,
    loading,
    error,
  };
}
