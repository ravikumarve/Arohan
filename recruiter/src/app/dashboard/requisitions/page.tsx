'use client';

import { useState } from 'react';
import { Plus, Search, Filter, MapPin, Users, Briefcase, Calendar, MoreVertical, CheckCircle, PauseCircle } from 'lucide-react';

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
      default: return 'bg-neutral-800 text-neutral-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-amber-400';
      case 'low': return 'text-blue-400';
      default: return 'text-neutral-400';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Requisitions</h1>
          <p className="text-neutral-400">Manage job requisitions with geo-radius targeting</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowFilters(!showFilters)} className="px-4 py-2 border border-neutral-700 text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors flex items-center gap-2">
            <Filter className="w-4 h-4" /> Filters
          </button>
          <button className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Requisition
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-neutral-400 text-sm">Total Requisitions</span>
            <Briefcase className="w-5 h-5 text-violet-400" />
          </div>
          <div className="text-2xl font-bold text-white">{mockRequisitions.length}</div>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-neutral-400 text-sm">Open Positions</span>
            <CheckCircle className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white">62</div>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-neutral-400 text-sm">Filled Positions</span>
            <Users className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white">70</div>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-neutral-400 text-sm">On Hold</span>
            <PauseCircle className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white">0</div>
        </div>
      </div>

      {showFilters && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">Status</label>
              <select onChange={(e) => setStatusFilter(e.target.value)} className="w-full bg-neutral-800 border border-neutral-700 text-white rounded-lg px-3 py-2">
                <option value="all">All</option>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
                <option value="on-hold">On Hold</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-400 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input type="text" placeholder="Search requisitions..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 rounded-lg pl-10 pr-3 py-2" />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-800">
              <th className="text-left text-neutral-400 font-medium text-sm p-4">Requisition</th>
              <th className="text-left text-neutral-400 font-medium text-sm p-4">Status</th>
              <th className="text-left text-neutral-400 font-medium text-sm p-4">Priority</th>
              <th className="text-left text-neutral-400 font-medium text-sm p-4">Progress</th>
              <th className="text-left text-neutral-400 font-medium text-sm p-4">Deadline</th>
              <th className="text-left text-neutral-400 font-medium text-sm p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((req) => (
              <tr key={req.id} className="border-b border-neutral-800 hover:bg-neutral-800/50 transition-colors">
                <td className="p-4">
                  <div className="font-medium text-white">{req.title}</div>
                  <div className="text-sm text-neutral-400 flex items-center gap-1 mt-1"><MapPin className="w-3 h-3" /> {req.location}</div>
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(req.status)}`}>{req.status}</span>
                </td>
                <td className="p-4">
                  <span className={`text-sm font-medium ${getPriorityColor(req.priority)}`}>{req.priority}</span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-neutral-700 rounded-full h-2">
                      <div className="bg-violet-500 h-2 rounded-full transition-all" style={{ width: `${(req.filled / req.positions) * 100}%` }} />
                    </div>
                    <span className="text-sm text-neutral-400">{req.filled}/{req.positions}</span>
                  </div>
                </td>
                <td className="p-4 text-neutral-300">{req.deadline}</td>
                <td className="p-4">
                  <button className="p-2 hover:bg-neutral-800 rounded-lg transition-colors text-neutral-400 hover:text-white"><MoreVertical className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
