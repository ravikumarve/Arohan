'use client';

import { useState } from 'react';
import { Plus, Search, Filter, RefreshCw, TrendingUp, Users, Phone, Calendar, DollarSign, Play, Pause, MoreVertical } from 'lucide-react';

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
      default: return 'bg-neutral-800 text-neutral-400';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Campaigns</h1>
          <p className="text-neutral-400">Manage your hiring campaigns and track progress</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowFilters(!showFilters)} className="px-4 py-2 border border-neutral-700 text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors flex items-center gap-2">
            <Filter className="w-4 h-4" /> Filters
          </button>
          <button className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Campaign
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6"> 
          <div className="flex items-center justify-between mb-4"> 
            <span className="text-neutral-400 text-sm">Total Campaigns</span> 
            <TrendingUp className="w-5 h-5 text-violet-400" /> 
          </div> 
          <div className="text-2xl font-bold text-white">{mockCampaigns.length}</div> 
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-neutral-400 text-sm">Active</span>
            <Play className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white">2</div>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-neutral-400 text-sm">Total Screened</span>
            <Users className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white">265</div>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-neutral-400 text-sm">Total Budget</span>
            <DollarSign className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white">₹9.3L</div>
        </div>
      </div>

      {showFilters && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">Status</label>
              <select onChange={(e) => setStatusFilter(e.target.value)} className="w-full bg-neutral-800 border border-neutral-700 text-white rounded-lg px-3 py-2">
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-400 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input type="text" placeholder="Search campaigns..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 rounded-lg pl-10 pr-3 py-2" />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-800">
              <th className="text-left text-neutral-400 font-medium text-sm p-4">Campaign</th>
              <th className="text-left text-neutral-400 font-medium text-sm p-4">Status</th>
              <th className="text-left text-neutral-400 font-medium text-sm p-4">Type</th>
              <th className="text-left text-neutral-400 font-medium text-sm p-4">Candidates</th>
              <th className="text-left text-neutral-400 font-medium text-sm p-4">Budget</th>
              <th className="text-left text-neutral-400 font-medium text-sm p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCampaigns.map((campaign) => (
              <tr key={campaign.id} className="border-b border-neutral-800 hover:bg-neutral-800/50 transition-colors">
                <td className="p-4">
                  <div className="font-medium text-white">{campaign.name}</div>
                  <div className="text-sm text-neutral-400">{campaign.targetRole}</div>
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(campaign.status)}`}>
                    {campaign.status === 'active' ? <Play className="w-3 h-3 mr-1" /> : <Pause className="w-3 h-3 mr-1" />}
                    {campaign.status}
                  </span>
                </td>
                <td className="p-4 text-neutral-300">{campaign.type}</td>
                <td className="p-4 text-neutral-300">{campaign.candidates}</td>
                <td className="p-4 text-neutral-300">₹{(campaign.budget / 100000).toFixed(1)}L</td>
                <td className="p-4">
                  <button className="p-2 hover:bg-neutral-800 rounded-lg transition-colors text-neutral-400 hover:text-white">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
