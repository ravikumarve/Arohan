'use client';

import { useState } from 'react';
import { Search, Shield, AlertTriangle, Info, FileText } from 'lucide-react';

const mockLogs = [
  { id: '1', user: 'Ravi Kumar', action: 'User Created', entity: 'User', entityId: 'USR-123', details: 'Created new user account for Priya Sharma', timestamp: '2025-05-10 10:30:15', severity: 'info' },
  { id: '2', user: 'System', action: 'Login Failed', entity: 'Authentication', entityId: 'AUTH-456', details: 'Failed login attempt from IP 192.168.1.100', timestamp: '2025-05-10 10:25:42', severity: 'warning' },
  { id: '3', user: 'Priya Sharma', action: 'Company Updated', entity: 'Company', entityId: 'COM-789', details: 'Updated billing information for TechCorp India', timestamp: '2025-05-10 09:45:30', severity: 'info' },
  { id: '4', user: 'Amit Patel', action: 'Password Changed', entity: 'User', entityId: 'USR-456', details: 'User changed their password', timestamp: '2025-05-10 09:12:18', severity: 'info' },
  { id: '5', user: 'System', action: 'API Rate Limit', entity: 'API', entityId: 'API-001', details: 'Rate limit exceeded for endpoint /api/v1/candidates', timestamp: '2025-05-10 08:55:22', severity: 'warning' },
];

const severityConfig: Record<string, { icon: typeof Info; bg: string; color: string }> = {
  info: { icon: Info, bg: 'rgba(99, 102, 241, 0.15)', color: '#6366f1' },
  warning: { icon: AlertTriangle, bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' },
  critical: { icon: AlertTriangle, bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' },
};

export default function AdminAuditPage() {
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');

  const filtered = mockLogs.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(search.toLowerCase()) || log.action.toLowerCase().includes(search.toLowerCase());
    const matchesSeverity = severityFilter === 'all' || log.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  const stats = [
    { title: 'Total Logs', value: String(mockLogs.length), icon: FileText, iconColor: '#6366f1' },
    { title: 'Info', value: String(mockLogs.filter(l => l.severity === 'info').length), icon: Info, iconColor: '#6366f1' },
    { title: 'Warnings', value: String(mockLogs.filter(l => l.severity === 'warning').length), icon: AlertTriangle, iconColor: '#f59e0b' },
    { title: 'Critical', value: String(mockLogs.filter(l => l.severity === 'critical').length), icon: Shield, iconColor: '#ef4444' },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-8">
        {/* Page header */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-[1.8rem] font-semibold tracking-tight" style={{ color: '#f8fafc' }}>
              Audit Logs
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-muted, #94a3b8)' }}>
              System audit trail and activity logs
            </p>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.title} className="metric-card-cobalt">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium" style={{ color: 'var(--text-muted, #94a3b8)' }}>
                  {stat.title}
                </span>
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{
                    background: 'var(--bg-hover, #1e2230)',
                    border: '1px solid var(--border-light, rgba(255,255,255,0.05))',
                    color: stat.iconColor,
                  }}
                >
                  <stat.icon size={16} />
                </div>
              </div>
              <div className="metric-value">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Logs panel */}
        <div className="panel">
          <div className="panel-header">
            <h2 className="panel-title" style={{ color: '#f8fafc' }}>
              <Shield size={16} style={{ color: '#6366f1' }} />
              Audit Trail
            </h2>
            <div className="flex gap-3">
              <div className="search-bar-cobalt" style={{ width: '260px' }}>
                <Search size={16} style={{ color: 'var(--text-muted, #94a3b8)' }} />
                <input
                  type="text"
                  placeholder="Search audit logs..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <select
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="btn-cobalt-secondary"
                style={{ padding: '0.5rem 2rem 0.5rem 0.8rem', fontSize: '0.8rem', appearance: 'auto' }}
              >
                <option value="all">All Severities</option>
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>
          <div className="panel-body" style={{ padding: '0 1.5rem' }}>
            <div className="flex flex-col">
              {filtered.length === 0 ? (
                <div className="py-8 text-center text-sm" style={{ color: 'var(--text-muted, #94a3b8)' }}>
                  No audit logs found matching your search.
                </div>
              ) : (
                filtered.map((log, i) => {
                  const sev = severityConfig[log.severity] || severityConfig.info;
                  const LogIcon = sev.icon;
                  return (
                    <div
                      key={log.id}
                      className="flex gap-4 py-4"
                      style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--border-light, rgba(255,255,255,0.05))' : 'none' }}
                    >
                      <div
                        className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0"
                        style={{ background: sev.bg, color: sev.color }}
                      >
                        <LogIcon size={14} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <span className="text-sm font-medium" style={{ color: log.severity === 'warning' ? '#f59e0b' : log.severity === 'critical' ? '#ef4444' : '#f8fafc' }}>
                            {log.action}
                          </span>
                          <span className="font-mono text-[0.7rem] flex-shrink-0" style={{ color: 'var(--text-faint, #475569)' }}>
                            {log.timestamp}
                          </span>
                        </div>
                        <p className="text-xs mt-1" style={{ color: 'var(--text-muted, #94a3b8)', lineHeight: 1.4 }}>
                          {log.details}
                        </p>
                        <div className="font-mono text-[0.65rem] mt-1.5" style={{ color: 'var(--text-faint, #475569)' }}>
                          {log.entity}: {log.entityId} · By: {log.user}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
