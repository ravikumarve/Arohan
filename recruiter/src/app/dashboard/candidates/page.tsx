'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { Search, Filter, Download, Users, CheckCircle, XCircle, Clock, Award, MoreVertical } from 'lucide-react';

const mockCandidates = [
  { id: '1', name: 'Rajesh Kumar', phone: '+91 98765 43210', email: 'rajesh.k@email.com', role: 'Delivery Partner', location: 'Bangalore, Karnataka', status: 'screened', score: 78, lastActive: '2025-05-10T10:30:00Z' },
  { id: '2', name: 'Priya Sharma', phone: '+91 87654 32109', email: 'priya.s@email.com', role: 'Retail Associate', location: 'Mumbai, Maharashtra', status: 'shortlisted', score: 85, lastActive: '2025-05-09T14:15:00Z' },
  { id: '3', name: 'Amit Patel', phone: '+91 76543 21098', email: 'amit.p@email.com', role: 'Support Executive', location: 'Hyderabad, Telangana', status: 'pending', score: 0, lastActive: '2025-05-10T09:00:00Z' },
  { id: '4', name: 'Sunita Devi', phone: '+91 65432 10987', email: 'sunita.d@email.com', role: 'Field Sales', location: 'Chennai, Tamil Nadu', status: 'rejected', score: 45, lastActive: '2025-05-08T16:45:00Z' },
  { id: '5', name: 'Ravi Verma', phone: '+91 54321 09876', email: 'ravi.v@email.com', role: 'Delivery Partner', location: 'Delhi, NCR', status: 'screened', score: 72, lastActive: '2025-05-10T11:00:00Z' },
];

const statusConfig: Record<string, string> = {
  shortlisted: 'status-badge-recruiter shortlisted',
  screened: 'status-badge-recruiter screened',
  pending: 'status-badge-recruiter pending',
};

export default function RecruiterCandidatesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [scoreFilter, setScoreFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const handleExport = useCallback(() => {
    toast.success('Exporting candidates data...');
  }, []);

  const handleCandidateAction = useCallback((name: string) => {
    toast.info(`Actions for ${name}`, { description: 'View profile, shortlist, or contact candidate' });
  }, []);

  const filtered = mockCandidates.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.phone.includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchesScore = scoreFilter === 'all' ||
      (scoreFilter === 'high' && c.score >= 80) ||
      (scoreFilter === 'medium' && c.score >= 60 && c.score < 80) ||
      (scoreFilter === 'low' && c.score < 60 && c.score > 0);
    return matchesSearch && matchesStatus && matchesScore;
  });

  const getStatusBadge = (status: string) => {
    const className = statusConfig[status];
    if (className) {
      return <span className={className}>{status}</span>;
    }
    return (
      <span
        className="status-badge-recruiter"
        style={{
          background: 'rgba(239, 68, 68, 0.1)',
          color: '#ef4444',
          borderColor: 'rgba(239, 68, 68, 0.2)',
        }}
      >
        {status}
      </span>
    );
  };

  const getScoreStyle = (score: number) => {
    if (score >= 80) return { color: '#10b981' };
    if (score >= 60) return { color: '#f59e0b' };
    if (score > 0) return { color: '#ef4444' };
    return { color: 'var(--text-faint, #475569)' };
  };

  return (
    <div className="p-8 h-full overflow-y-auto">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-8">

        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-[1.8rem] font-semibold tracking-tight" style={{ color: '#ffffff' }}>
              Candidates
            </h1>
            <p className="text-sm font-mono tracking-wide" style={{ color: '#8b5cf6' }}>
              View and manage candidate profiles and screening results
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters ? "btn-recruiter-primary text-sm" : "btn-recruiter-secondary text-sm"}
            >
              <Filter size={14} /> Filters
            </button>
            <button className="btn-recruiter-secondary text-sm" onClick={handleExport}>
              <Download size={14} /> Export
            </button>
          </div>
        </div>

        {/* Metric cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="metric-card-recruiter">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium" style={{ color: 'var(--text-muted, #94a3b8)' }}>Total</span>
              <Users size={16} style={{ color: '#8b5cf6' }} />
            </div>
            <div className="mc-value-recruiter">{mockCandidates.length}</div>
          </div>
          <div className="metric-card-recruiter">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium" style={{ color: 'var(--text-muted, #94a3b8)' }}>Screened</span>
              <Clock size={16} style={{ color: '#3b82f6' }} />
            </div>
            <div className="mc-value-recruiter">3</div>
          </div>
          <div className="metric-card-recruiter">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium" style={{ color: 'var(--text-muted, #94a3b8)' }}>Shortlisted</span>
              <CheckCircle size={16} style={{ color: '#10b981' }} />
            </div>
            <div className="mc-value-recruiter">1</div>
          </div>
          <div className="metric-card-recruiter">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium" style={{ color: 'var(--text-muted, #94a3b8)' }}>Rejected</span>
              <XCircle size={16} style={{ color: '#ef4444' }} />
            </div>
            <div className="mc-value-recruiter">1</div>
          </div>
          <div className="metric-card-recruiter">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium" style={{ color: 'var(--text-muted, #94a3b8)' }}>Avg Score</span>
              <Award size={16} style={{ color: '#f59e0b' }} />
            </div>
            <div className="mc-value-recruiter">64.8</div>
          </div>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div className="panel-recruiter">
            <div className="panel-body-recruiter">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-muted, #94a3b8)' }}>Status</label>
                  <select onChange={(e) => setStatusFilter(e.target.value)} className="w-full bg-neutral-800 border border-neutral-700 text-white rounded-lg px-3 py-2">
                    <option value="all">All</option>
                    <option value="pending">Pending</option>
                    <option value="screened">Screened</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-muted, #94a3b8)' }}>Score</label>
                  <select onChange={(e) => setScoreFilter(e.target.value)} className="w-full bg-neutral-800 border border-neutral-700 text-white rounded-lg px-3 py-2">
                    <option value="all">All Scores</option>
                    <option value="high">High (80+)</option>
                    <option value="medium">Medium (60-79)</option>
                    <option value="low">Low (0-59)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-muted, #94a3b8)' }}>Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-faint, #475569)' }} />
                    <input type="text" placeholder="Search candidates..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 rounded-lg pl-10 pr-3 py-2" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Candidates Table */}
        <div className="panel-recruiter">
          <div className="panel-header-recruiter">
            <h2 className="text-base font-semibold" style={{ color: '#ffffff' }}>All Candidates</h2>
            <span className="text-xs font-mono" style={{ color: 'var(--text-faint, #475569)' }}>{filtered.length} results</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-dim, rgba(255,255,255,0.05))' }}>
                  <th className="p-4 text-left text-[0.75rem] uppercase tracking-wider font-semibold" style={{ color: 'var(--text-faint, #475569)' }}>Candidate</th>
                  <th className="p-4 text-left text-[0.75rem] uppercase tracking-wider font-semibold" style={{ color: 'var(--text-faint, #475569)' }}>Role</th>
                  <th className="p-4 text-left text-[0.75rem] uppercase tracking-wider font-semibold" style={{ color: 'var(--text-faint, #475569)' }}>Status</th>
                  <th className="p-4 text-left text-[0.75rem] uppercase tracking-wider font-semibold" style={{ color: 'var(--text-faint, #475569)' }}>Score</th>
                  <th className="p-4 text-left text-[0.75rem] uppercase tracking-wider font-semibold" style={{ color: 'var(--text-faint, #475569)' }}>Location</th>
                  <th className="p-4 text-left text-[0.75rem] uppercase tracking-wider font-semibold" style={{ color: 'var(--text-faint, #475569)' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((candidate) => (
                  <tr
                    key={candidate.id}
                    style={{ borderBottom: '1px solid var(--border-dim, rgba(255,255,255,0.05))' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.01)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                  >
                    <td className="p-4">
                      <div className="text-sm font-semibold" style={{ color: '#ffffff' }}>{candidate.name}</div>
                      <div className="text-xs font-mono" style={{ color: 'var(--text-muted, #94a3b8)' }}>{candidate.phone}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm" style={{ color: '#ffffff' }}>{candidate.role}</div>
                    </td>
                    <td className="p-4">
                      {getStatusBadge(candidate.status)}
                    </td>
                    <td className="p-4">
                      <span className="font-mono font-semibold" style={getScoreStyle(candidate.score)}>
                        {candidate.score > 0 ? candidate.score : '--'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="text-sm" style={{ color: 'var(--text-muted, #94a3b8)' }}>{candidate.location}</div>
                    </td>
                    <td className="p-4">
                      <button className="btn-recruiter-secondary" style={{ padding: '0.35rem', borderRadius: '6px' }} onClick={() => handleCandidateAction(candidate.name)}>
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
