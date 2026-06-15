'use client';

import { useState } from 'react';
import { Users, Search, Shield, CheckCircle, XCircle, MoreVertical } from 'lucide-react';

const mockUsers = [
  { id: '1', name: 'Ravi Kumar', email: 'ravi.kumar@arohan.ai', phone: '+91 98765 43210', role: 'Super Admin', status: 'active', lastLogin: '2025-05-10 10:30 AM' },
  { id: '2', name: 'Priya Sharma', email: 'priya.sharma@arohan.ai', phone: '+91 87654 32109', role: 'Admin', status: 'active', lastLogin: '2025-05-10 09:15 AM' },
  { id: '3', name: 'Amit Patel', email: 'amit.patel@arohan.ai', phone: '+91 76543 21098', role: 'Recruiter', status: 'active', lastLogin: '2025-05-09 05:45 PM' },
  { id: '4', name: 'Sunita Devi', email: 'sunita.devi@arohan.ai', phone: '+91 65432 10987', role: 'Recruiter', status: 'inactive', lastLogin: '2025-05-08 03:20 PM' },
  { id: '5', name: 'Ravi Verma', email: 'ravi.verma@arohan.ai', phone: '+91 54321 09876', role: 'Viewer', status: 'active', lastLogin: '2025-05-10 08:00 AM' },
];

export const dynamic = 'force-dynamic';

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');

  const filtered = mockUsers.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'active':
        return {
          background: 'rgba(16, 185, 129, 0.1)',
          color: '#10b981',
          borderColor: 'rgba(16, 185, 129, 0.3)',
        };
      case 'inactive':
        return {
          background: 'rgba(148, 163, 184, 0.1)',
          color: '#94a3b8',
          borderColor: 'rgba(148, 163, 184, 0.3)',
        };
      default:
        return {
          background: 'rgba(148, 163, 184, 0.1)',
          color: '#94a3b8',
          borderColor: 'rgba(148, 163, 184, 0.3)',
        };
    }
  };

  const metrics = [
    { title: 'Total Users', value: String(mockUsers.length), icon: Users, iconColor: '#6366f1' },
    { title: 'Active', value: '4', icon: CheckCircle, iconColor: '#10b981' },
    { title: 'Inactive', value: '1', icon: XCircle, iconColor: '#ef4444' },
    { title: 'Recruiters', value: '2', icon: Shield, iconColor: '#6366f1' },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-8">

        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-[1.8rem] font-semibold tracking-tight" style={{ color: '#f8fafc' }}>
              Users
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-muted, #94a3b8)' }}>
              Manage platform users and roles
            </p>
          </div>
          <button className="btn-cobalt-primary">
            <Users size={16} />
            Add User
          </button>
        </div>

        {/* Metrics grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric) => (
            <div key={metric.title} className="metric-card-cobalt">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium" style={{ color: 'var(--text-muted, #94a3b8)' }}>
                  {metric.title}
                </span>
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{
                    background: 'var(--bg-hover, #1e2230)',
                    border: '1px solid var(--border-light, rgba(255,255,255,0.05))',
                    color: metric.iconColor,
                  }}
                >
                  <metric.icon size={16} />
                </div>
              </div>
              <div className="metric-value">{metric.value}</div>
            </div>
          ))}
        </div>

        {/* Users table */}
        <div className="panel">
          <div className="panel-header">
            <div className="search-bar-cobalt" style={{ width: '100%', maxWidth: '350px' }}>
              <Search size={16} style={{ color: 'var(--text-muted, #94a3b8)' }} />
              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <span className="text-[0.65rem] tracking-wider font-mono" style={{ color: 'var(--text-faint, #475569)' }}>
              {filtered.length} users
            </span>
          </div>
          <div className="panel-body" style={{ padding: 0 }}>
            <table className="w-full" style={{ borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr
                  className="text-[0.75rem] uppercase tracking-wider font-semibold"
                  style={{ color: 'var(--text-faint, #475569)', borderBottom: '1px solid var(--border-medium, rgba(255,255,255,0.1))' }}
                >
                  <th className="px-4 py-3 font-semibold">User</th>
                  <th className="px-4 py-3 font-semibold">Role</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Last Login</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((user) => (
                  <tr
                    key={user.id}
                    className="transition-colors"
                    style={{ borderBottom: '1px solid var(--border-light, rgba(255,255,255,0.05))' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.01)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                  >
                    <td className="px-4 py-4">
                      <div className="font-medium" style={{ color: '#f8fafc' }}>{user.name}</div>
                      <div className="text-xs" style={{ color: 'var(--text-muted, #94a3b8)' }}>{user.email}</div>
                    </td>
                    <td className="px-4 py-4 text-sm font-mono" style={{ color: 'var(--text-muted, #94a3b8)' }}>
                      {user.role}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className="inline-flex items-center px-2 py-1 text-xs font-medium rounded font-mono"
                        style={{
                          background: getStatusStyle(user.status).background,
                          color: getStatusStyle(user.status).color,
                          border: `1px solid ${getStatusStyle(user.status).borderColor}`,
                        }}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-mono text-xs" style={{ color: 'var(--text-faint, #475569)' }}>
                      {user.lastLogin}
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
                      >
                        <MoreVertical size={14} />
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
