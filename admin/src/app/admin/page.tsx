'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import {
  Users, Building2, Activity, IndianRupee, Search, Bell,
  Sun, Download, Calendar, Shield, Zap,
} from 'lucide-react';

const metrics = [
  {
    title: 'Monthly Recurring Rev',
    value: '₹12.4L',
    trend: '+8.2%',
    trendLabel: 'from last month',
    icon: IndianRupee,
  },
  {
    title: 'Active Companies',
    value: '48',
    trend: '+3',
    trendLabel: 'onboarded this week',
    icon: Building2,
  },
  {
    title: 'Total Screenings',
    value: '3,892',
    trend: '+245',
    trendLabel: 'processed today',
    icon: Activity,
  },
  {
    title: 'Platform Users',
    value: '1,245',
    trend: '+12%',
    trendLabel: 'active seats',
    icon: Users,
  },
];

const recentTenants = [
  { initials: 'TC', name: 'TechCorp India Pvt Ltd', email: 'hr@techcorp.in', plan: 'Enterprise' as const, status: 'Active' as const, mrr: '₹45,000' },
  { initials: 'RM', name: 'RetailMax Solutions', email: 'jobs@retailmax.com', plan: 'Growth' as const, status: 'Active' as const, mrr: '₹28,000' },
  { initials: 'LC', name: 'LogiChain Logistics', email: 'careers@logichain.in', plan: 'Startup' as const, status: 'Trial' as const, mrr: '--' },
  { initials: 'FE', name: 'FoodExpress Delivery', email: 'hiring@foodexpress.in', plan: 'Enterprise' as const, status: 'Active' as const, mrr: '₹95,000' },
];

const auditLogs = [
  { icon: Users, severity: 'info' as const, title: 'User Created', time: '10:30 AM', desc: 'New admin account provisioned for Priya Sharma.', meta: 'By: Ravi Kumar · ID: USR-123' },
  { icon: Shield, severity: 'warn' as const, title: 'Login Failed', time: '10:25 AM', desc: 'Failed login attempt detected from IP 192.168.1.100.', meta: 'By: System · AUTH-456' },
  { icon: Building2, severity: 'info' as const, title: 'Company Updated', time: '09:45 AM', desc: 'Billing information updated for TechCorp India.', meta: 'By: Priya Sharma · COM-789' },
  { icon: Activity, severity: 'crit' as const, title: 'API Rate Limit', time: '08:55 AM', desc: 'Rate limit exceeded for endpoint /api/v1/candidates.', meta: 'By: System · API-001' },
];

const severityStyles: Record<string, { bg: string; color: string }> = {
  info: { bg: 'rgba(99, 102, 241, 0.15)', color: '#6366f1' },
  warn: { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' },
  crit: { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' },
};

const planStyles: Record<string, string> = {
  Enterprise: 'badge-cobalt enterprise',
  Growth: 'badge-cobalt growth',
  Startup: 'badge-cobalt startup',
};

const statusStyles: Record<string, string> = {
  Active: 'status-dot active',
  Trial: 'status-dot trial',
  Inactive: 'status-dot inactive',
};

export default function AdminOverview() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  const handleExportReport = useCallback(() => {
    setLoadingStates(prev => ({ ...prev, export: true }));
    setTimeout(() => {
      setLoadingStates(prev => ({ ...prev, export: false }));
      toast.success('Report exported successfully');
    }, 1000);
  }, []);

  const handleLast30Days = useCallback(() => {
    toast.info('Showing data for last 30 days');
  }, []);

  const handleViewAll = useCallback(() => {
    toast.info('Viewing all tenants');
  }, []);

  const handleViewLogs = useCallback(() => {
    toast.info('Opening audit logs');
  }, []);

  const handleToggleTheme = useCallback(() => {
    toast.info('Theme toggle coming soon');
  }, []);

  const handleNotifications = useCallback(() => {
    toast.info('No new notifications');
  }, []);

  return (
    <>
      {/* Topbar */}
      <header
        className="flex items-center justify-between px-8"
        style={{
          height: '72px',
          borderBottom: '1px solid var(--border-medium, rgba(255,255,255,0.1))',
          background: 'rgba(9, 10, 15, 0.8)',
          backdropFilter: 'blur(12px)',
        }}
      >
        {/* Search */}
        <div className="search-bar-cobalt">
          <Search size={16} style={{ color: 'var(--text-muted, #94a3b8)' }} />
          <input
            type="text"
            placeholder="Search companies, users, or invoice IDs..."
          />
          <span className="text-[0.65rem] tracking-wider" style={{ color: 'var(--text-faint, #475569)', fontFamily: 'JetBrains Mono, monospace' }}>
            Cmd+K
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            className="w-9 h-9 rounded-lg flex items-center justify-center transition-all"
            style={{
              background: 'transparent',
              border: '1px solid var(--border-medium, rgba(255,255,255,0.1))',
              color: 'var(--text-muted, #94a3b8)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-hover, #1e2230)'; e.currentTarget.style.color = '#f8fafc'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted, #94a3b8)'; }}
            onClick={handleToggleTheme}
          >
            <Sun size={16} />
          </button>
          <button
            className="w-9 h-9 rounded-lg flex items-center justify-center transition-all relative"
            style={{
              background: 'transparent',
              border: '1px solid var(--border-medium, rgba(255,255,255,0.1))',
              color: 'var(--text-muted, #94a3b8)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-hover, #1e2230)'; e.currentTarget.style.color = '#f8fafc'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted, #94a3b8)'; }}
            onClick={handleNotifications}
          >
            <Bell size={16} />
            <span
              className="absolute w-1.5 h-1.5 rounded-full"
              style={{ top: '8px', right: '8px', background: '#ef4444', boxShadow: '0 0 5px #ef4444' }}
            />
          </button>
        </div>
      </header>

      {/* Content scroll */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-[1400px] mx-auto flex flex-col gap-8">

          {/* Page header */}
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-[1.8rem] font-semibold tracking-tight" style={{ color: '#f8fafc' }}>
                Dashboard Overview
              </h1>
              <p className="text-sm" style={{ color: 'var(--text-muted, #94a3b8)' }}>
                Platform metrics and tenant health at a glance.
              </p>
            </div>
            <div className="flex gap-3">
              <button className="btn-cobalt-secondary text-sm" onClick={handleLast30Days}>
                <Calendar size={14} />
                Last 30 Days
              </button>
              <button
                onClick={handleExportReport}
                disabled={loadingStates.export}
                className="btn-cobalt-primary text-sm"
              >
                {loadingStates.export ? (
                  <><Zap size={14} className="animate-spin" /> Exporting...</>
                ) : (
                  <><Download size={14} /> Export Report</>
                )}
              </button>
            </div>
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
                      color: '#6366f1',
                    }}
                  >
                    <metric.icon size={16} />
                  </div>
                </div>
                <div className="metric-value">{metric.value}</div>
                <div className="flex items-center gap-2 text-sm font-medium" style={{ color: '#10b981' }}>
                  <span className="trend-pill">{metric.trend}</span>
                  <span style={{ color: 'var(--text-muted, #94a3b8)', fontWeight: 400 }}>{metric.trendLabel}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Lower grid: Tenant table + Audit feed */}
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">

            {/* Recent Tenants */}
            <div className="panel">
              <div className="panel-header">
                <h2 className="panel-title" style={{ color: '#f8fafc' }}>Recent Tenants</h2>
                <button className="btn-cobalt-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }} onClick={handleViewAll}>
                  View All
                </button>
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
                      <th className="px-4 py-3 font-semibold">MRR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTenants.map((tenant) => (
                      <tr key={tenant.email} className="transition-colors" style={{ borderBottom: '1px solid var(--border-light, rgba(255,255,255,0.05))' }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.01)'; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                      >
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-8 h-8 rounded-md flex items-center justify-center text-xs font-semibold"
                              style={{
                                background: 'var(--bg-hover, #1e2230)',
                                border: '1px solid var(--border-medium, rgba(255,255,255,0.1))',
                                color: 'var(--text-muted, #94a3b8)',
                              }}
                            >
                              {tenant.initials}
                            </div>
                            <div>
                              <div className="text-sm font-medium" style={{ color: '#f8fafc' }}>{tenant.name}</div>
                              <div className="text-xs" style={{ color: 'var(--text-muted, #94a3b8)' }}>{tenant.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className={planStyles[tenant.plan]}>{tenant.plan}</span>
                        </td>
                        <td className="px-4 py-4">
                          <span className={statusStyles[tenant.status]} style={{ color: 'var(--text-secondary, #94a3b8)' }}>
                            {tenant.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 font-mono text-sm" style={{ color: 'var(--text-main, #f8fafc)' }}>
                          {tenant.mrr}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Audit Log */}
            <div className="panel">
              <div className="panel-header">
                <h2 className="panel-title" style={{ color: '#f8fafc' }}>
                  <Shield size={16} style={{ color: '#6366f1' }} />
                  Security & Audit
                </h2>
                <button className="btn-cobalt-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }} onClick={handleViewLogs}>
                  Logs
                </button>
              </div>
              <div className="panel-body" style={{ padding: '0 1.5rem' }}>
                <div className="flex flex-col">
                  {auditLogs.map((log, i) => {
                    const sev = severityStyles[log.severity];
                    return (
                      <div
                        key={i}
                        className="flex gap-4 py-4"
                        style={{ borderBottom: i < auditLogs.length - 1 ? '1px solid var(--border-light, rgba(255,255,255,0.05))' : 'none' }}
                      >
                        <div
                          className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0"
                          style={{ background: sev.bg, color: sev.color }}
                        >
                          <log.icon size={14} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-2">
                            <span className="text-sm font-medium" style={{ color: log.severity === 'warn' ? '#f59e0b' : log.severity === 'crit' ? '#ef4444' : '#f8fafc' }}>
                              {log.title}
                            </span>
                            <span className="font-mono text-[0.7rem] flex-shrink-0" style={{ color: 'var(--text-faint, #475569)' }}>
                              {log.time}
                            </span>
                          </div>
                          <p className="text-xs mt-1" style={{ color: 'var(--text-muted, #94a3b8)', lineHeight: 1.4 }}>
                            {log.desc}
                          </p>
                          <div className="font-mono text-[0.65rem] mt-1.5" style={{ color: 'var(--text-faint, #475569)' }}>
                            {log.meta}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </>
  );
}
