'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { Building2, Search, Users, CheckCircle, MoreVertical } from 'lucide-react';

const mockCompanies = [
  { id: '1', name: 'TechCorp India Pvt Ltd', email: 'hr@techcorp.in', phone: '+91 80 1234 5678', location: 'Bangalore, Karnataka', status: 'active', users: 45, plan: 'Enterprise' },
  { id: '2', name: 'RetailMax Solutions', email: 'jobs@retailmax.com', phone: '+91 22 8765 4321', location: 'Mumbai, Maharashtra', status: 'active', users: 28, plan: 'Growth' },
  { id: '3', name: 'LogiChain Logistics', email: 'careers@logichain.in', phone: '+91 40 2345 6789', location: 'Hyderabad, Telangana', status: 'trial', users: 12, plan: 'Startup' },
  { id: '4', name: 'FoodExpress Delivery', email: 'hiring@foodexpress.in', phone: '+91 44 3456 7890', location: 'Chennai, Tamil Nadu', status: 'active', users: 156, plan: 'Enterprise' },
  { id: '5', name: 'HealthFirst Clinics', email: 'recruitment@healthfirst.in', phone: '+91 11 4567 8901', location: 'Delhi, NCR', status: 'inactive', users: 8, plan: 'Growth' },
];

const planStyles: Record<string, string> = {
  Enterprise: 'badge-cobalt enterprise',
  Growth: 'badge-cobalt growth',
  Startup: 'badge-cobalt startup',
};

const statusStyles: Record<string, string> = {
  active: 'status-dot active',
  trial: 'status-dot trial',
  inactive: 'status-dot inactive',
};

export default function AdminCompaniesPage() {
  const [search, setSearch] = useState('');

  const handleAddCompany = useCallback(() => {
    toast.info('Add company form coming soon');
  }, []);

  const handleCompanyAction = useCallback((companyName: string) => {
    toast.info(`Actions for ${companyName}`, { description: 'Edit, suspend, or manage company' });
  }, []);

  const filtered = mockCompanies.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = mockCompanies.filter(c => c.status === 'active').length;
  const trialCount = mockCompanies.filter(c => c.status === 'trial').length;
  const totalUsers = mockCompanies.reduce((sum, c) => sum + c.users, 0);

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-8">

        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-[1.8rem] font-semibold tracking-tight" style={{ color: '#f8fafc' }}>
              Companies
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-muted, #94a3b8)' }}>
              Manage companies and their subscriptions
            </p>
          </div>
          <button className="btn-cobalt-primary text-sm" onClick={handleAddCompany}>
            <Building2 size={14} />
            Add Company
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="metric-card-cobalt">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium" style={{ color: 'var(--text-muted, #94a3b8)' }}>Total Companies</span>
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background: 'var(--bg-hover, #1e2230)',
                  border: '1px solid var(--border-light, rgba(255,255,255,0.05))',
                  color: '#6366f1',
                }}
              >
                <Building2 size={16} />
              </div>
            </div>
            <div className="metric-value">{mockCompanies.length}</div>
          </div>
          <div className="metric-card-cobalt">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium" style={{ color: 'var(--text-muted, #94a3b8)' }}>Active</span>
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background: 'var(--bg-hover, #1e2230)',
                  border: '1px solid var(--border-light, rgba(255,255,255,0.05))',
                  color: '#10b981',
                }}
              >
                <CheckCircle size={16} />
              </div>
            </div>
            <div className="metric-value">{activeCount}</div>
          </div>
          <div className="metric-card-cobalt">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium" style={{ color: 'var(--text-muted, #94a3b8)' }}>In Trial</span>
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background: 'var(--bg-hover, #1e2230)',
                  border: '1px solid var(--border-light, rgba(255,255,255,0.05))',
                  color: '#f59e0b',
                }}
              >
                <Users size={16} />
              </div>
            </div>
            <div className="metric-value">{trialCount}</div>
          </div>
          <div className="metric-card-cobalt">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium" style={{ color: 'var(--text-muted, #94a3b8)' }}>Total Users</span>
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background: 'var(--bg-hover, #1e2230)',
                  border: '1px solid var(--border-light, rgba(255,255,255,0.05))',
                  color: '#38bdf8',
                }}
              >
                <Users size={16} />
              </div>
            </div>
            <div className="metric-value">{totalUsers}</div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <h2 className="panel-title" style={{ color: '#f8fafc' }}>All Companies</h2>
            <div className="search-bar-cobalt" style={{ width: '280px' }}>
              <Search size={16} style={{ color: 'var(--text-muted, #94a3b8)' }} />
              <input
                type="text"
                placeholder="Search companies..."
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
                  <th className="px-4 py-3 font-semibold">Company</th>
                  <th className="px-4 py-3 font-semibold">Plan</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Users</th>
                  <th className="px-4 py-3 font-semibold">Location</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((company) => (
                  <tr
                    key={company.id}
                    className="transition-colors"
                    style={{ borderBottom: '1px solid var(--border-light, rgba(255,255,255,0.05))' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.01)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                  >
                    <td className="px-4 py-4">
                      <div className="text-sm font-medium" style={{ color: '#f8fafc' }}>{company.name}</div>
                      <div className="text-xs" style={{ color: 'var(--text-muted, #94a3b8)' }}>{company.email}</div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={planStyles[company.plan]}>{company.plan}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={statusStyles[company.status]} style={{ color: 'var(--text-secondary, #94a3b8)' }}>
                        {company.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-mono text-sm" style={{ color: 'var(--text-main, #f8fafc)' }}>
                      {company.users}
                    </td>
                    <td className="px-4 py-4 text-sm" style={{ color: 'var(--text-muted, #94a3b8)' }}>
                      {company.location}
                    </td>
                    <td className="px-4 py-4">
                      <button
                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                        style={{
                          background: 'transparent',
                          border: '1px solid var(--border-medium, rgba(255,255,255,0.1))',
                          color: 'var(--text-muted, #94a3b8)',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-hover, #1e2230)'; e.currentTarget.style.color = '#f8fafc'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted, #94a3b8)'; }}
                        onClick={() => handleCompanyAction(company.name)}
                      >
                        <MoreVertical size={16} />
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
