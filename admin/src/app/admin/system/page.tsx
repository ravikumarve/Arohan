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


export default function AdminSystemPage() {
  const [lastRefresh, setLastRefresh] = useState(new Date());

  return (
    <div className="space-y-8 p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">System Monitoring</h1>
          <p className="text-neutral-400">Real-time system health and performance metrics</p>
        </div>
        <button onClick={() => setLastRefresh(new Date())} className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors flex items-center gap-2">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-neutral-400 text-sm">System Health</span>
            <Activity className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white">98.5%</div>
          <div className="text-sm text-emerald-400 mt-1">All Systems Operational</div>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-neutral-400 text-sm">Active Alerts</span>
            <AlertTriangle className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white">2</div>
          <div className="text-sm text-amber-400 mt-1">1 Critical, 1 Warning</div>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-neutral-400 text-sm">Avg Response</span>
            <Clock className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white">45ms</div>
          <div className="text-sm text-emerald-400 mt-1">-12ms from yesterday</div>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-neutral-400 text-sm">Throughput</span>
            <TrendingUp className="w-5 h-5 text-violet-400" />
          </div>
          <div className="text-2xl font-bold text-white">1,245</div>
          <div className="text-sm text-emerald-400 mt-1">req/min</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Service Health</h3>
          <div className="space-y-3">
            {mockServices.map((service) => (
              <div key={service.name} className="flex items-center justify-between p-3 bg-neutral-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${service.status === 'healthy' ? 'bg-emerald-500' : service.status === 'degraded' ? 'bg-amber-500' : 'bg-red-500'}`} />
                  <span className="text-white font-medium">{service.name}</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-neutral-400">{service.uptime}</span>
                  <span className="text-neutral-400">{service.latency}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Alerts</h3>
          <div className="space-y-3">
            {mockAlerts.map((alert) => (
              <div key={alert.id} className="flex items-start gap-3 p-3 bg-neutral-800/50 rounded-lg">
                <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${alert.severity === 'critical' ? 'bg-red-500' : alert.severity === 'warning' ? 'bg-amber-500' : 'bg-blue-500'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm">{alert.message}</p>
                  <p className="text-neutral-400 text-xs mt-1">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
