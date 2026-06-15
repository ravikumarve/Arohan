'use client';

import { useState } from 'react';
import { Plus, Search, Filter, TrendingUp, Users, DollarSign, Play, Pause, MoreVertical } from 'lucide-react';

const mockCampaigns = [
  { id: '1', name: 'Delivery Partners - Bangalore', targetRole: 'Delivery Partner', status: 'active', type: 'Bulk Hiring', budget: 500000, candidates: 145, startDate: '2025-01-15', endDate: '2025-06-15' },
  { id: '2', name: 'Retail Staff - Mumbai', targetRole: 'Retail Associate', status: 'paused', type: 'Targeted', budget: 250000, candidates: 78, startDate: '2025-02-01', endDate: '2025-05-01' },
  { id: '3', name: 'Customer Support - Hyderabad', targetRole: 'Support Executive', status: 'active', type: 'Referral', budget: 180000, candidates: 42, startDate: '2025-01-20', endDate: '2025-04-20' },
];

export default function RecruiterCampaignsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const filteredCampaigns = mockCampaigns.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'paused': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'completed': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="p-8 h-full overflow-y-auto">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-8">

        {/* Page header */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-[1.8rem] font-semibold tracking-tight" style={{ color: '#ffffff' }}>
              Campaigns
            </h1>
            <p className="text-sm font-mono tracking-wide" style={{ color: '#8b5cf6' }}>
              Manage your hiring campaigns and track progress
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowFilters(!showFilters)} className="btn-recruiter-secondary text-sm">
              <Filter size={14} /> Filters
            </button>
            <button className="btn-recruiter-primary text-sm">
              <Plus size={14} /> New Campaign
            </button>
          </div>
        </div>

        {/* Metrics grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="metric-card-recruiter">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium" style={{ color: 'var(--text-muted, #94a3b8)' }}>Total Campaigns</span>
              <TrendingUp size={16} style={{ color: 'var(--text-muted, #94a3b8)' }} />
            </div>
            <div className="mc-value-recruiter">{mockCampaigns.length}</div>
          </div>
          <div className="metric-card-recruiter">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium" style={{ color: 'var(--text-muted, #94a3b8)' }}>Active</span>
              <Play size={16} style={{ color: '#10b981' }} />
            </div>
            <div className="mc-value-recruiter">2</div>
          </div>
          <div className="metric-card-recruiter">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium" style={{ color: 'var(--text-muted, #94a3b8)' }}>Total Screened</span>
              <Users size={16} style={{ color: 'var(--text-muted, #94a3b8)' }} />
            </div>
            <div className="mc-value-recruiter">265</div>
          </div>
          <div className="metric-card-recruiter">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium" style={{ color: 'var(--text-muted, #94a3b8)' }}>Total Budget</span>
              <DollarSign size={16} style={{ color: 'var(--text-muted, #94a3b8)' }} />
            </div>
            <div className="mc-value-recruiter">₹9.3L</div>
          </div>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="panel-recruiter">
            <div className="panel-body-recruiter">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-muted, #94a3b8)' }}>Status</label>
                  <select onChange={(e) => setStatusFilter(e.target.value)} className="w-full bg-neutral-800 border border-neutral-700 text-white rounded-lg px-3 py-2">
                    <option value="all">All</option>
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-muted, #94a3b8)' }}>Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted, #94a3b8)' }} />
                    <input type="text" placeholder="Search campaigns..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 rounded-lg pl-10 pr-3 py-2" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Campaigns table */}
        <div className="panel-recruiter">
          <div className="overflow-x-auto">
            <table className="w-full" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-dim, rgba(255,255,255,0.05))' }}>
                  <th className="text-left p-4 text-xs uppercase tracking-wider font-medium" style={{ color: 'var(--text-faint, #475569)' }}>Campaign</th>
                  <th className="text-left p-4 text-xs uppercase tracking-wider font-medium" style={{ color: 'var(--text-faint, #475569)' }}>Status</th>
                  <th className="text-left p-4 text-xs uppercase tracking-wider font-medium" style={{ color: 'var(--text-faint, #475569)' }}>Type</th>
                  <th className="text-left p-4 text-xs uppercase tracking-wider font-medium" style={{ color: 'var(--text-faint, #475569)' }}>Candidates</th>
                  <th className="text-left p-4 text-xs uppercase tracking-wider font-medium" style={{ color: 'var(--text-faint, #475569)' }}>Budget</th>
                  <th className="text-left p-4 text-xs uppercase tracking-wider font-medium" style={{ color: 'var(--text-faint, #475569)' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCampaigns.map((campaign) => (
                  <tr
                    key={campaign.id}
                    style={{ borderBottom: '1px solid var(--border-dim, rgba(255,255,255,0.05))' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover, #161925)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                  >
                    <td className="p-4">
                      <div className="font-medium" style={{ color: '#ffffff' }}>{campaign.name}</div>
                      <div className="text-sm mt-0.5 font-mono" style={{ color: 'var(--text-muted, #94a3b8)' }}>{campaign.targetRole}</div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-1 text-xs font-mono font-semibold rounded-full border ${getStatusColor(campaign.status)}`}>
                        {campaign.status === 'active' ? <Play className="w-3 h-3 mr-1.5" /> : <Pause className="w-3 h-3 mr-1.5" />}
                        {campaign.status}
                      </span>
                    </td>
                    <td className="p-4" style={{ color: 'var(--text-muted, #94a3b8)' }}>{campaign.type}</td>
                    <td className="p-4 font-mono" style={{ color: '#ffffff' }}>{campaign.candidates}</td>
                    <td className="p-4 font-mono" style={{ color: '#ffffff' }}>₹{(campaign.budget / 100000).toFixed(1)}L</td>
                    <td className="p-4">
                      <button
                        className="p-2 rounded-lg transition-colors"
                        style={{ color: 'var(--text-muted, #94a3b8)' }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#ffffff'; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-muted, #94a3b8)'; }}
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
    </div>
  );
}
