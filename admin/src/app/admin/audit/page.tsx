'use client';

import { useState } from 'react';
import { Search, Shield, CheckCircle, AlertTriangle, Info, Clock, User, FileText, Filter } from 'lucide-react';

const mockLogs = [
  { id: '1', user: 'Ravi Kumar', action: 'User Created', entity: 'User', entityId: 'USR-123', details: 'Created new user account for Priya Sharma', timestamp: '2025-05-10 10:30:15', severity: 'info' },
  { id: '2', user: 'System', action: 'Login Failed', entity: 'Authentication', entityId: 'AUTH-456', details: 'Failed login attempt from IP 192.168.1.100', timestamp: '2025-05-10 10:25:42', severity: 'warning' },
  { id: '3', user: 'Priya Sharma', action: 'Company Updated', entity: 'Company', entityId: 'COM-789', details: 'Updated billing information for TechCorp India', timestamp: '2025-05-10 09:45:30', severity: 'info' },
  { id: '4', user: 'Amit Patel', action: 'Password Changed', entity: 'User', entityId: 'USR-456', details: 'User changed their password', timestamp: '2025-05-10 09:12:18', severity: 'info' },
  { id: '5', user: 'System', action: 'API Rate Limit', entity: 'API', entityId: 'API-001', details: 'Rate limit exceeded for endpoint /api/v1/candidates', timestamp: '2025-05-10 08:55:22', severity: 'warning' },
];

export const dynamic = 'force-dynamic';


export default function AdminAuditPage() {
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');

  const filtered = mockLogs.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(search.toLowerCase()) || log.action.toLowerCase().includes(search.toLowerCase());
    const matchesSeverity = severityFilter === 'all' || log.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'info': return <Info className="w-4 h-4 text-blue-400" />;
      default: return <Info className="w-4 h-4 text-neutral-400" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'warning': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'info': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-neutral-800 text-neutral-400';
    }
  };

  return (
    <div className="space-y-8 p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Audit Logs</h1>
          <p className="text-neutral-400">System audit trail and activity logs</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4"><span className="text-neutral-400 text-sm">Total Logs</span><FileText className="w-5 h-5 text-indigo-400" /></div>
          <div className="text-2xl font-bold text-white">{mockLogs.length}</div>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4"><span className="text-neutral-400 text-sm">Info</span><Info className="w-5 h-5 text-blue-400" /></div>
          <div className="text-2xl font-bold text-white">3</div>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4"><span className="text-neutral-400 text-sm">Warnings</span><AlertTriangle className="w-5 h-5 text-amber-400" /></div>
          <div className="text-2xl font-bold text-white">2</div>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4"><span className="text-neutral-400 text-sm">Critical</span><Shield className="w-5 h-5 text-red-400" /></div>
          <div className="text-2xl font-bold text-white">0</div>
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-neutral-800 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input type="text" placeholder="Search audit logs..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 rounded-lg pl-10 pr-3 py-2" />
          </div>
          <select onChange={(e) => setSeverityFilter(e.target.value)} className="bg-neutral-800 border border-neutral-700 text-white rounded-lg px-3 py-2">
            <option value="all">All Severities</option>
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="critical">Critical</option>
          </select>
        </div>
        <div className="divide-y divide-neutral-800">
          {filtered.map((log) => (
            <div key={log.id} className="p-4 hover:bg-neutral-800/50 transition-colors">
              <div className="flex items-start gap-3">
                <div className="mt-0.5">{getSeverityIcon(log.severity)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white font-medium">{log.action}</span>
                    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full border ${getSeverityColor(log.severity)}`}>{log.severity}</span>
                  </div>
                  <p className="text-neutral-400 text-sm">{log.details}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text organizational neutrality">
                    <span className="text-neutral-500 flex items-center gap-1"><User className="w-3 h-3" /> {log.user}</span>
                    <span className="text-neutral-500 flex items-center gap-1"><Clock className="w-3 h-3" /> {log.timestamp}</span>
                    <span className="text-neutral-500">{log.entity}: {log.entityId}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
