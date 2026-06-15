'use client';

import { useState } from 'react';
import { DollarSign, Search, XCircle, Clock, FileText, Download, Calendar } from 'lucide-react';

const mockInvoices = [
  { id: 'INV-2025-001', company: 'TechCorp India Pvt Ltd', amount: 45000, status: 'paid', date: '2025-05-01', dueDate: '2025-05-15' },
  { id: 'INV-2025-002', company: 'RetailMax Solutions', amount: 28000, status: 'paid', date: '2025-05-03', dueDate: '2025-05-17' },
  { id: 'INV-2025-003', company: 'LogiChain Logistics', amount: 12000, status: 'pending', date: '2025-05-05', dueDate: '2025-05-19' },
  { id: 'INV-2025-004', company: 'FoodExpress Delivery', amount: 95000, status: 'paid', date: '2025-05-07', dueDate: '2025-05-21' },
  { id: 'INV-2025-005', company: 'HealthFirst Clinics', amount: 22000, status: 'overdue', date: '2025-04-15', dueDate: '2025-04-29' },
];

export const dynamic = 'force-dynamic';

export default function AdminBillingPage() {
  const [search, setSearch] = useState('');

  const filtered = mockInvoices.filter(i => 
    i.company.toLowerCase().includes(search.toLowerCase()) || 
    i.id.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'pending': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'overdue': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  const totalRevenue = mockInvoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0);
  const pendingAmount = mockInvoices.filter(i => i.status === 'pending').reduce((sum, i) => sum + i.amount, 0);
  const overdueAmount = mockInvoices.filter(i => i.status === 'overdue').reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-8">

        {/* Page header */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-[1.8rem] font-semibold tracking-tight" style={{ color: '#f8fafc' }}>
              Billing
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-muted, #94a3b8)' }}>
              Manage invoices and revenue
            </p>
          </div>
          <div className="flex gap-3">
            <button className="btn-cobalt-secondary text-sm">
              <Calendar size={14} />
              Last 30 Days
            </button>
            <button className="btn-cobalt-primary text-sm">
              <FileText size={14} />
              Create Invoice
            </button>
          </div>
        </div>

        {/* Metrics grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="metric-card-cobalt">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium" style={{ color: 'var(--text-muted, #94a3b8)' }}>
                Total Revenue
              </span>
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background: 'var(--bg-hover, #1e2230)',
                  border: '1px solid var(--border-light, rgba(255,255,255,0.05))',
                  color: '#10b981',
                }}
              >
                <DollarSign size={16} />
              </div>
            </div>
            <div className="metric-value">₹{totalRevenue.toLocaleString()}</div>
          </div>
          <div className="metric-card-cobalt">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium" style={{ color: 'var(--text-muted, #94a3b8)' }}>
                Pending
              </span>
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background: 'var(--bg-hover, #1e2230)',
                  border: '1px solid var(--border-light, rgba(255,255,255,0.05))',
                  color: '#f59e0b',
                }}
              >
                <Clock size={16} />
              </div>
            </div>
            <div className="metric-value">₹{pendingAmount.toLocaleString()}</div>
          </div>
          <div className="metric-card-cobalt">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium" style={{ color: 'var(--text-muted, #94a3b8)' }}>
                Overdue
              </span>
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background: 'var(--bg-hover, #1e2230)',
                  border: '1px solid var(--border-light, rgba(255,255,255,0.05))',
                  color: '#ef4444',
                }}
              >
                <XCircle size={16} />
              </div>
            </div>
            <div className="metric-value">₹{overdueAmount.toLocaleString()}</div>
          </div>
          <div className="metric-card-cobalt">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium" style={{ color: 'var(--text-muted, #94a3b8)' }}>
                Invoices
              </span>
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background: 'var(--bg-hover, #1e2230)',
                  border: '1px solid var(--border-light, rgba(255,255,255,0.05))',
                  color: '#6366f1',
                }}
              >
                <FileText size={16} />
              </div>
            </div>
            <div className="metric-value">{mockInvoices.length}</div>
          </div>
        </div>

        {/* Invoices table */}
        <div className="panel">
          <div className="panel-header">
            <h2 className="panel-title" style={{ color: '#f8fafc' }}>
              <FileText size={16} style={{ color: '#6366f1' }} />
              Invoices
            </h2>
            <div className="search-bar-cobalt" style={{ width: '280px' }}>
              <Search size={16} style={{ color: 'var(--text-muted, #94a3b8)' }} />
              <input
                type="text"
                placeholder="Search invoices..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="panel-body" style={{ padding: 0 }}>
            <table className="w-full" style={{ borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr
                  className="text-[0.75rem] uppercase tracking-wider font-semibold"
                  style={{ color: 'var(--text-faint, #475569)', borderBottom: '1px solid var(--border-medium, rgba(255,255,255,0.1))' }}
                >
                  <th className="px-4 py-3 font-semibold">Invoice ID</th>
                  <th className="px-4 py-3 font-semibold">Company</th>
                  <th className="px-4 py-3 font-semibold">Amount</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((invoice) => (
                  <tr key={invoice.id} className="transition-colors" style={{ borderBottom: '1px solid var(--border-light, rgba(255,255,255,0.05))' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.01)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                  >
                    <td className="px-4 py-4 font-medium" style={{ color: '#f8fafc' }}>{invoice.id}</td>
                    <td className="px-4 py-4 text-sm" style={{ color: 'var(--text-muted, #94a3b8)' }}>{invoice.company}</td>
                    <td className="px-4 py-4 font-mono text-sm" style={{ color: 'var(--text-main, #f8fafc)' }}>₹{invoice.amount.toLocaleString()}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(invoice.status)}`}>{invoice.status}</span>
                    </td>
                    <td className="px-4 py-4 text-sm" style={{ color: 'var(--text-muted, #94a3b8)' }}>{invoice.date}</td>
                    <td className="px-4 py-4">
                      <button
                        className="p-2 rounded-lg transition-all"
                        style={{
                          background: 'transparent',
                          border: '1px solid var(--border-medium, rgba(255,255,255,0.1))',
                          color: 'var(--text-muted, #94a3b8)',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-hover, #1e2230)'; e.currentTarget.style.color = '#f8fafc'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted, #94a3b8)'; }}
                      >
                        <Download size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
