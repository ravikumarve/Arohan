'use client';

import { useState } from 'react';
import { Server, Activity, AlertTriangle, CheckCircle, Clock, TrendingUp, BarChart3, RefreshCw } from 'lucide-react';

const mockServices = [
  { name: 'API Gateway', status: 'healthy', uptime: '99.99%', latency: '12ms' },
  { name: 'Database', status: 'healthy', uptime: '99.95%', latency: '8ms' },
  { name: 'Redis Cache', status: 'healthy', uptime: '99.98%', latency: '2ms' },
  { name: 'Celery Worker', status: 'healthy', uptime: '99.90%', latency: '45ms' },
  { name: 'STT Pipeline', status: 'degraded', uptime: '97.50%', latency: '320ms' },
];

const mockAlerts = [
  { id: '1', message: 'High CPU usage on API Gateway', severity: 'warning', time: '2 min ago' },
  { id: '2', message: 'STT Pipeline latency spike', severity: 'critical', time: '5 min ago' },
  { id: '3', message: 'Database backup completed', severity: 'info', time: '15 min ago' },
];

export const dynamic = 'force-dynamic';

const severityStyles: Record<string, { bg: string; color: string }> = {
  info: { bg: 'rgba(99, 102, 241, 0.15)', color: '#6366f1' },
  warning: { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' },
  critical: { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' },
};

export default function AdminSystemPage() {
  const [lastRefresh, setLastRefresh] = useState(new Date());

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-8">

        {/* Page header */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-[1.8rem] font-semibold tracking-tight" style={{ color: '#f8fafc' }}>
              System Monitoring
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-muted, #94a3b8)' }}>
              Real-time system health and performance metrics
            </p>
          </div>
          <button onClick={() => setLastRefresh(new Date())} className="btn-cobalt-secondary text-sm">
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>

        {/* Metric cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="metric-card-cobalt">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium" style={{ color: 'var(--text-muted, #94a3b8)' }}>System Health</span>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--bg-hover, #1e2230)', border: '1px solid var(--border-light, rgba(255,255,255,0.05))', color: '#10b981' }}>
                <Activity size={16} />
              </div>
            </div>
            <div className="metric-value">98.5%</div>
            <div className="flex items-center gap-2 text-sm font-medium" style={{ color: '#10b981' }}>
              <span className="trend-pill">All Systems Operational</span>
            </div>
          </div>
          <div className="metric-card-cobalt">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium" style={{ color: 'var(--text-muted, #94a3b8)' }}>Active Alerts</span>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--bg-hover, #1e2230)', border: '1px solid var(--border-light, rgba(255,255,255,0.05))', color: '#f59e0b' }}>
                <AlertTriangle size={16} />
              </div>
            </div>
            <div className="metric-value">2</div>
            <div className="flex items-center gap-2 text-sm font-medium" style={{ color: '#f59e0b' }}>
              <span className="trend-pill" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>1 Critical, 1 Warning</span>
            </div>
          </div>
          <div className="metric-card-cobalt">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium" style={{ color: 'var(--text-muted, #94a3b8)' }}>Avg Response</span>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--bg-hover, #1e2230)', border: '1px solid var(--border-light, rgba(255,255,255,0.05))', color: '#6366f1' }}>
                <Clock size={16} />
              </div>
            </div>
            <div className="metric-value">45ms</div>
            <div className="flex items-center gap-2 text-sm font-medium" style={{ color: '#10b981' }}>
              <span className="trend-pill">-12ms from yesterday</span>
            </div>
          </div>
          <div className="metric-card-cobalt">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium" style={{ color: 'var(--text-muted, #94a3b8)' }}>Throughput</span>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--bg-hover, #1e2230)', border: '1px solid var(--border-light, rgba(255,255,255,0.05))', color: '#a855f7' }}>
                <TrendingUp size={16} />
              </div>
            </div>
            <div className="metric-value">1,245</div>
            <div className="flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--text-muted, #94a3b8)' }}>
              <span style={{ fontWeight: 400 }}>req/min</span>
            </div>
          </div>
        </div>

        {/* Lower grid: Service Health + Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Service Health panel */}
          <div className="panel">
            <div className="panel-header">
              <h2 className="panel-title" style={{ color: '#f8fafc' }}>
                <Server size={16} style={{ color: '#6366f1' }} />
                Service Health
              </h2>
            </div>
            <div className="panel-body">
              <div className="flex flex-col gap-3">
                {mockServices.map((service) => (
                  <div key={service.name} className="flex items-center gap-4 p-4 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-medium, rgba(255,255,255,0.1))' }}>
                    <div className={`w-2 h-2 rounded-full ${service.status === 'healthy' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                    <span className="text-sm font-medium" style={{ color: '#f8fafc' }}>{service.name}</span>
                    <div className="ml-auto flex gap-4 text-sm font-mono" style={{ color: 'var(--text-muted, #94a3b8)' }}>
                      <span>{service.uptime}</span>
                      <span>{service.latency}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Alerts panel */}
          <div className="panel">
            <div className="panel-header">
              <h2 className="panel-title" style={{ color: '#f8fafc' }}>
                <AlertTriangle size={16} style={{ color: '#f59e0b' }} />
                Recent Alerts
              </h2>
            </div>
            <div className="panel-body" style={{ padding: '0 1.5rem' }}>
              <div className="flex flex-col">
                {mockAlerts.map((alert, i) => {
                  const sev = severityStyles[alert.severity] || severityStyles.warning;
                  return (
                    <div
                      key={alert.id}
                      className="flex gap-4 py-4"
                      style={{ borderBottom: i < mockAlerts.length - 1 ? '1px solid var(--border-light, rgba(255,255,255,0.05))' : 'none' }}
                    >
                      <div className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: sev.bg, color: sev.color }}>
                        <AlertTriangle size={14} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <span className="text-sm font-medium" style={{ color: alert.severity === 'critical' ? '#ef4444' : alert.severity === 'warning' ? '#f59e0b' : '#f8fafc' }}>
                            {alert.message}
                          </span>
                          <span className="font-mono text-[0.7rem] flex-shrink-0" style={{ color: 'var(--text-faint, #475569)' }}>
                            {alert.time}
                          </span>
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
  );
}
