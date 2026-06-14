/**
 * Companies API Hook
 * React hook for managing companies data with loading states and error handling
 */

import { useState, useEffect, useCallback } from 'react';
import {
  getCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany,
  getCompanyStats,
  type Company,
  type CreateCompanyRequest,
  type UpdateCompanyRequest,
  type CompaniesFilters,
} from '../../lib/api/companies';

export function useCompanies(filters?: CompaniesFilters) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getCompanies(filters);
      setCompanies(response.companies);
      setTotal(response.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch companies');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  return { companies, loading, error, total, refetch: fetchCompanies };
}

export function useCompany(companyId: string) {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCompany() {
      setLoading(true);
      setError(null);
      try {
        const data = await getCompanyById(companyId);
        setCompany(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch company');
      } finally {
        setLoading(false);
      }
    }

    if (companyId) {
      fetchCompany();
    }
  }, [companyId]);

  return { company, loading, error };
}

export function useCompanyStats() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      setError(null);
      try {
        const data = await getCompanyStats();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch company stats');
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return { stats, loading, error };
}

export function useCompanyActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCompanyAction = useCallback(async (data: CreateCompanyRequest) => {
    setLoading(true);
    setError(null);
    try {
      const result = await createCompany(data);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create company');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCompanyAction = useCallback(async (companyId: string, data: UpdateCompanyRequest) => {
    setLoading(true);
    setError(null);
    try {
      const result = await updateCompany(companyId, data);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update company');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteCompanyAction = useCallback(async (companyId: string) => {
    setLoading(true);
    setError(null);
    try {
      await deleteCompany(companyId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete company');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createCompany: createCompanyAction,
    updateCompany: updateCompanyAction,
    deleteCompany: deleteCompanyAction,
    loading,
    error,
  };
}
