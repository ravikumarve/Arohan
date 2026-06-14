/**
 * Billing API Hook
 * React hook for managing billing and invoice data with loading states and error handling
 */

import { useState, useEffect, useCallback } from 'react';
import {
  getInvoices,
  getInvoiceById,
  getRevenueMetrics,
  markInvoiceAsPaid,
  cancelInvoice,
  sendInvoiceReminder,
  generateInvoicePdf,
  type Invoice,
  type RevenueMetrics,
  type InvoicesFilters,
} from '../../lib/api/billing';

export function useInvoices(filters?: InvoicesFilters) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getInvoices(filters);
      setInvoices(response.invoices);
      setTotal(response.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch invoices');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  return { invoices, loading, error, total, refetch: fetchInvoices };
}

export function useInvoiceById(invoiceId: string) {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchInvoice() {
      setLoading(true);
      setError(null);
      try {
        const data = await getInvoiceById(invoiceId);
        setInvoice(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch invoice');
      } finally {
        setLoading(false);
      }
    }

    if (invoiceId) {
      fetchInvoice();
    }
  }, [invoiceId]);

  return { invoice, loading, error };
}

export function useRevenueMetrics() {
  const [metrics, setMetrics] = useState<RevenueMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMetrics() {
      setLoading(true);
      setError(null);
      try {
        const data = await getRevenueMetrics();
        setMetrics(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch revenue metrics');
      } finally {
        setLoading(false);
      }
    }

    fetchMetrics();
  }, []);

  return { metrics, loading, error };
}

export function useInvoiceActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const markAsPaid = useCallback(async (invoiceId: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await markInvoiceAsPaid(invoiceId);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark invoice as paid');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const cancel = useCallback(async (invoiceId: string, reason?: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await cancelInvoice(invoiceId, reason);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel invoice');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const sendReminder = useCallback(async (invoiceId: string) => {
    setLoading(true);
    setError(null);
    try {
      await sendInvoiceReminder(invoiceId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send invoice reminder');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const generatePdf = useCallback(async (invoiceId: string) => {
    setLoading(true);
    setError(null);
    try {
      const blob = await generateInvoicePdf(invoiceId);
      return blob;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate invoice PDF');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    markAsPaid,
    cancel,
    sendReminder,
    generatePdf,
    loading,
    error,
  };
}
