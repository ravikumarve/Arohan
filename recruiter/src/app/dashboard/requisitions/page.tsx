'use client';

import { useState } from 'react';
import { Plus, Search, Filter, MapPin, Users, Briefcase, MoreVertical, CheckCircle, PauseCircle } from 'lucide-react';

const mockRequisitions = [
  { id: '1', title: 'Delivery Partner - Bangalore', department: 'Operations', location: 'Bangalore, Karnataka', pinCode: '560001', status: 'open', priority: 'high', positions: 50, filled: 32, hiringManager: 'Ravi Kumar', deadline: '2025-06-15' },
  { id: '2', title: 'Retail Staff - Mumbai', department: 'Retail', location: 'Mumbai, Maharashtra', pinCode: '400001', status: 'open', priority: 'medium', positions: 30, filled: 18, hiringManager: 'Priya Sharma', deadline: '2025-05-30' },
  { id: '3', title: 'Customer Support - Hyderabad', department: 'Customer Service', location: 'Hyderabad, Telangana', pinCode: '500001', status: 'closed', priority: 'low', positions: 20, filled: 20, hiringManager: 'Suresh Reddy', deadline: '2025-04-30' },
];

export default function RecruiterRequisitionsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = mockRequisitions.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || r.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'closed': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'on-hold': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default: return '';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-amber-400';
      case 'low': return 'text-blue-400';
      default: return '';
    }
  };

  return (
    <div className="p-8 h-full overflow-y-auto">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-8">

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-[1.8rem] font-semibold tracking-tight" style={{ color: '#ffffff' }}>
              Requisitions
            </h1>
            <p className="text-sm font-mono tracking-wide" style={{ color: '#8b5cf6' }}>
              Manage job requisitions with geo-radius targeting
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowFilters(!showFilters)} className="btn-recruiter-secondary">
              <Filter className="w-4 h-4" /> Filters
            </button>
            <button className="btn-recruiter-primary">
              <Plus className="w-4 h-4" /> New Requisition
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="metric-card-recruiter">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium" style={{ color: 'var(--text-muted, #94a3b8)' }}>Total Requisitions</span>
              <Briefcase className="w-5 h-5" style={{ color: 'var(--text-muted, #94a3b8)' }} />
            </div>
            <div className="mc-value-recruiter">{mockRequisitions.length}</div>
          </div>
          <div className="metric-card-recruiter">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium" style={{ color: 'var(--text-muted, #94a3b8)' }}>Open Positions</span>
              <CheckCircle className="w-5 h-5" style={{ color: '#10b981' }} />
            </div>
            <div className="mc-value-recruiter">62</div>
          </div>
          <div className="metric-card-recruiter">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium" style={{ color: 'var(--text-muted, #94a3b8)' }}>Filled Positions</span>
              <Users className="w-5 h-5" style={{ color: '#3b82f6' }} />
            </div>
            <div className="mc-value-recruiter">70</div>
          </div>
          <div className="metric-card-recruiter">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium" style={{ color: 'var(--text-muted, #94a3b8)' }}>On Hold</span>
              <PauseCircle className="w-5 h-5" style={{ color: '#f59e0b' }} />
            </div>
            <div className="mc-value-recruiter">0</div>
          </div>
        </div>

        {showFilters && (
          <div className="panel-recruiter">
            <div className="panel-body-recruiter">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-muted, #94a3b8)' }}>Status</label>
                  <select
                    onChange={(e) => setStatusFilter(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'var(--bg-panel, #0d0f16)',
                      border: '1px solid var(--border-glow, rgba(255,255,255,0.12))',
                      color: '#ffffff',
                      borderRadius: '6px',
                      padding: '0.5rem 0.75rem',
                    }}
                  >
                    <option value="all">All</option>
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                    <option value="on-hold">On Hold</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-muted, #94a3b8)' }}>Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-faint, #475569)' }} />
                    <input
                      type="text"
                      placeholder="Search requisitions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{
                        width: '100%',
                        background: 'var(--bg-panel, #0d0f16)',
                        border: '1px solid var(--border-glow, rgba(255,255,255,0.12))',
                        color: '#ffffff',
                        borderRadius: '6px',
                        padding: '0.5rem 0.75rem 0.5rem 2.5rem',
                      }}
                      className="placeholder:text-neutral-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="panel-recruiter overflow-hidden">
          <table className="w-full" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-dim, rgba(255,255,255,0.05))' }}>
                <th className="text-left text-xs font-medium uppercase tracking-wider p-4" style={{ color: 'var(--text-faint, #475569)' }}>Requisition</th>
                <th className="text-left text-xs font-medium uppercase tracking-wider p-4" style={{ color: 'var(--text-faint, #475569)' }}>Status</th>
                <th className="text-left text-xs font-medium uppercase tracking-wider p-4" style={{ color: 'var(--text-faint, #475569)' }}>Priority</th>
                <th className="text-left text-xs font-medium uppercase tracking-wider p-4" style={{ color: 'var(--text-faint, #475569)' }}>Progress</th>
                <th className="text-left text-xs font-medium uppercase tracking-wider p-4" style={{ color: 'var(--text-faint, #475569)' }}>Deadline</th>
                <th className="text-left text-xs font-medium uppercase tracking-wider p-4" style={{ color: 'var(--text-faint, #475569)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((req) => (
                <tr
                  key={req.id}
                  style={{ borderBottom: '1px solid var(--border-dim, rgba(255,255,255,0.05))' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.01)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                >
                  <td className="p-4">
                    <div className="font-medium" style={{ color: '#ffffff' }}>{req.title}</div>
                    <div className="text-sm flex items-center gap-1 mt-1" style={{ color: 'var(--text-muted, #94a3b8)' }}>
                      <MapPin className="w-3 h-3" /> {req.location}
                    </div>
                  </td>
                  <td className="p-4">
                    {(() => {
                      const cls = getStatusColor(req.status);
                      return cls ? (
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border ${cls}`}>
                          {req.status}
                        </span>
                      ) : (
                        <span
                          className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border"
                          style={{
                            background: 'var(--bg-panel, #0d0f16)',
                            color: 'var(--text-muted, #94a3b8)',
                            borderColor: 'var(--border-glow, rgba(255,255,255,0.12))',
                          }}
                        >
                          {req.status}
                        </span>
                      );
                    })()}
                  </td>
                  <td className="p-4">
                    <span className={`text-sm font-medium ${getPriorityColor(req.priority)}`}>{req.priority}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 rounded-full h-2" style={{ background: 'rgba(255,255,255,0.05)' }}>
                        <div
                          className="h-2 rounded-full transition-all"
                          style={{
                            width: `${(req.filled / req.positions) * 100}%`,
                            background: 'linear-gradient(90deg, #8b5cf6, #ec4899)',
                          }}
                        />
                      </div>
                      <span className="text-sm font-mono" style={{ color: 'var(--text-muted, #94a3b8)' }}>{req.filled}/{req.positions}</span>
                    </div>
                  </td>
                  <td className="p-4" style={{ color: 'var(--text-muted, #94a3b8)' }}>{req.deadline}</td>
                  <td className="p-4">
                    <button
                      className="p-2 rounded-lg transition-colors"
                      style={{
                        color: 'var(--text-muted, #94a3b8)',
                        background: 'transparent',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.color = '#ffffff';
                        (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover, #161925)';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.color = 'var(--text-muted, #94a3b8)';
                        (e.currentTarget as HTMLElement).style.background = 'transparent';
                      }}
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
