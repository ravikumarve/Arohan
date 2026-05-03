import { useState, useCallback } from 'react';
import { apiClient } from '../lib/api-client';

export interface UseApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

export function useApi<T = any>() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<T | null>(null);

  const execute = useCallback(
    async (apiCall: () => Promise<T>, options?: UseApiOptions<T>) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await apiCall();
        setData(result);
        options?.onSuccess?.(result);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('An error occurred');
        setError(error);
        options?.onError?.(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return { execute, isLoading, error, data, reset };
}

// Specific API hooks
export function useUsers() {
  const { execute, isLoading, error, data } = useApi<User[]>();

  const fetchUsers = useCallback(async () => {
    return execute(() => apiClient.get<User[]>('/users'));
  }, [execute]);

  const createUser = useCallback(async (userData: CreateUserRequest) => {
    return execute(() => apiClient.post<User>('/users', userData));
  }, [execute]);

  const updateUser = useCallback(async (userId: string, userData: UpdateUserRequest) => {
    return execute(() => apiClient.put<User>(`/users/${userId}`, userData));
  }, [execute]);

  const deleteUser = useCallback(async (userId: string) => {
    return execute(() => apiClient.delete(`/users/${userId}`));
  }, [execute]);

  return { fetchUsers, createUser, updateUser, deleteUser, isLoading, error, data };
}

export function useCompanies() {
  const { execute, isLoading, error, data } = useApi<Company[]>();

  const fetchCompanies = useCallback(async () => {
    return execute(() => apiClient.get<Company[]>('/companies'));
  }, [execute]);

  const createCompany = useCallback(async (companyData: CreateCompanyRequest) => {
    return execute(() => apiClient.post<Company>('/companies', companyData));
  }, [execute]);

  const updateCompany = useCallback(async (companyId: string, companyData: UpdateCompanyRequest) => {
    return execute(() => apiClient.put<Company>(`/companies/${companyId}`, companyData));
  }, [execute]);

  const deleteCompany = useCallback(async (companyId: string) => {
    return execute(() => apiClient.delete(`/companies/${companyId}`));
  }, [execute]);

  return { fetchCompanies, createCompany, updateCompany, deleteCompany, isLoading, error, data };
}

export function useCampaigns() {
  const { execute, isLoading, error, data } = useApi<Campaign[]>();

  const fetchCampaigns = useCallback(async (companyId?: string) => {
    const params = companyId ? { company_id: companyId } : {};
    return execute(() => apiClient.get<Campaign[]>('/campaigns', { params }));
  }, [execute]);

  const createCampaign = useCallback(async (campaignData: CreateCampaignRequest) => {
    return execute(() => apiClient.post<Campaign>('/campaigns', campaignData));
  }, [execute]);

  const updateCampaign = useCallback(async (campaignId: string, campaignData: UpdateCampaignRequest) => {
    return execute(() => apiClient.put<Campaign>(`/campaigns/${campaignId}`, campaignData));
  }, [execute]);

  const deleteCampaign = useCallback(async (campaignId: string) => {
    return execute(() => apiClient.delete(`/campaigns/${campaignId}`));
  }, [execute]);

  return { fetchCampaigns, createCampaign, updateCampaign, deleteCampaign, isLoading, error, data };
}

export function useCandidates() {
  const { execute, isLoading, error, data } = useApi<Candidate[]>();

  const fetchCandidates = useCallback(async (campaignId?: string) => {
    const params = campaignId ? { campaign_id: campaignId } : {};
    return execute(() => apiClient.get<Candidate[]>('/candidates', { params }));
  }, [execute]);

  const createCandidate = useCallback(async (candidateData: CreateCandidateRequest) => {
    return execute(() => apiClient.post<Candidate>('/candidates', candidateData));
  }, [execute]);

  const updateCandidate = useCallback(async (candidateId: string, candidateData: UpdateCandidateRequest) => {
    return execute(() => apiClient.put<Candidate>(`/candidates/${candidateId}`, candidateData));
  }, [execute]);

  const deleteCandidate = useCallback(async (candidateId: string) => {
    return execute(() => apiClient.delete(`/candidates/${candidateId}`));
  }, [execute]);

  return { fetchCandidates, createCandidate, updateCandidate, deleteCandidate, isLoading, error, data };
}

export function useRequisitions() {
  const { execute, isLoading, error, data } = useApi<Requisition[]>();

  const fetchRequisitions = useCallback(async (companyId?: string) => {
    const params = companyId ? { company_id: companyId } : {};
    return execute(() => apiClient.get<Requisition[]>('/requisitions', { params }));
  }, [execute]);

  const createRequisition = useCallback(async (requisitionData: CreateRequisitionRequest) => {
    return execute(() => apiClient.post<Requisition>('/requisitions', requisitionData));
  }, [execute]);

  const updateRequisition = useCallback(async (requisitionId: string, requisitionData: UpdateRequisitionRequest) => {
    return execute(() => apiClient.put<Requisition>(`/requisitions/${requisitionId}`, requisitionData));
  }, [execute]);

  const deleteRequisition = useCallback(async (requisitionId: string) => {
    return execute(() => apiClient.delete(`/requisitions/${requisitionId}`));
  }, [execute]);

  return { fetchRequisitions, createRequisition, updateRequisition, deleteRequisition, isLoading, error, data };
}
