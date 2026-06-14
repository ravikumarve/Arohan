/**
 * Users API Hook
 * React hook for managing users data with loading states and error handling
 */

import { useState, useEffect, useCallback } from 'react';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserStats,
  type User,
  type CreateUserRequest,
  type UpdateUserRequest,
  type UsersFilters,
} from '../../lib/api/users';

export function useUsers(filters?: UsersFilters) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getUsers(filters);
      setUsers(response.users);
      setTotal(response.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, loading, error, total, refetch: fetchUsers };
}

export function useUser(userId: string) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      setError(null);
      try {
        const data = await getUserById(userId);
        setUser(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch user');
      } finally {
        setLoading(false);
      }
    }

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  return { user, loading, error };
}

export function useUserStats() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      setError(null);
      try {
        const data = await getUserStats();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch user stats');
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return { stats, loading, error };
}

export function useUserActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createUserAction = useCallback(async (data: CreateUserRequest) => {
    setLoading(true);
    setError(null);
    try {
      const result = await createUser(data);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUserAction = useCallback(async (userId: string, data: UpdateUserRequest) => {
    setLoading(true);
    setError(null);
    try {
      const result = await updateUser(userId, data);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteUserAction = useCallback(async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      await deleteUser(userId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createUser: createUserAction,
    updateUser: updateUserAction,
    deleteUser: deleteUserAction,
    loading,
    error,
  };
}
