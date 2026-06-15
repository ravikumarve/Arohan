'use client';

import { useState } from 'react';
import { Search, Filter, Download, RefreshCw, Users, Phone, MapPin, Calendar, CheckCircle, XCircle, Clock, Star, Award, MoreVertical } from 'lucide-react';
import { cn } from '@arohan/shared';

const mockCandidates = [
  { id: '1', name: 'Rajesh Kumar', phone: '+91 98765 43210', email: 'rajesh.k@email.com', role: 'Delivery Partner', location: 'Bangalore, Karnataka', status: 'screened', score: 78, lastActive: '2025-05-10T10:30:00Z' },
  { id: '2', name: 'Priya Sharma', phone: '+91 87654 32109', email: 'priya.s@email.com', role: 'Retail Associate', location: 'Mumbai, Maharashtra', status: 'shortlisted', score: 85, lastActive: '2025-05-09T14:15:00Z' },
  { id: '3', name: 'Amit Patel', phone: '+91 76543 21098', email: 'amit.p@email.com', role: 'Support Executive', location: 'Hyderabad, Telangana', status: 'pending', score: 0, lastActive: '2025-05-10T09:00:00Z' },
  { id: '4', name: 'Sunita Devi', phone: '+91 65432 10987', email: 'sunita.d@email.com', role: 'Field Sales', location: 'Chennai, Tamil Nadu', status: 'rejected', score: 45, lastActive: '2025-05-08T16:45:00Z' },
  { id: '5', name: 'Ravi Verma', phone: '+91 54321 09876', email: 'ravi.v@email.com', role: 'Delivery Partner', location: 'Delhi, NCR', status: 'screened', score: 72, lastActive: '2025-05-10T11:00:00Z' },
];

export default function RecruiterCandidatesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [scoreFilter, setScoreFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = mockCandidates.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.phone.includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchesScore = scoreFilter === 'all' ||
      (scoreFilter === 'high' && c.score >= 80) ||
      (scoreFilter === 'medium' && c.score >= 60 && c.score < 80) ||
      (scoreFilter === 'low' && c.score < 60 && c.score > 0);
    return matchesSearch && matchesStatus && matchesScore;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'shortlisted': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'screened': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'rejected': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'pending': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default: return 'bg-neutral-800 text-neutral-400';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-amber-400';
    if (score > 0) return 'text-red-400';
    return 'text-neutral-500';
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Candidates</h1>
          <p className="text-neutral-400">View and manage candidate profiles and screening results</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowFilters(!showFilters)} className={cn("px-4 py-2 border rounded-lg transition-colors flex items-center gap-2", showFilters ? "border-violet-500 text-violet-400 bg-violet-500/10" : "border-neutral-700 text-neutral-300 hover:text-white hover:bg-neutral-800")}>
            <Filter className="w-4 h-4" /> Filters
          </button>
          <button className="px-4 py-2 border border-neutral-700 text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4"><span className="text-neutral-400 text-sm">Total</span><Users className="w-5 h-5 text-violet-400" /></div>
          <div className="text-2xl font-bold text-white">{mockCandidates.length}</div>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4"><span className="text-neutral-400 text-sm">Screened</span><Clock className="w-5 h-5 text-blue-400" /></div>
          <div className="text-2xl font-bold text-white">3</div>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4"><span className="text-neutral-400 text-sm">Shortlisted</span><CheckCircle className="w-5 h-5 text-emerald-400" /></div>
          <div className="text-2xl font-bold text-white">1</div>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4"><span className="text-neutral-400 text-sm">Rejected</span><XCircle className="w-5 h-5 text-red-400" /></div>
          <div className="text-2xl font-bold text-white">1</div>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4"><span className="text-neutral-400 text-sm">Avg Score</span><Award className="w-5 h-5 text-amber-400" /></div>
          <div className="text-2xl font-bold text-white">64.8</div>
        </div>
      </div>

      {showFilters && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">Status</label>
              <select onChange={(e) => setStatusFilter(e.target.value)} className="w-full bg-neutral-800 border border-neutral-700 text-white rounded-lg px-3 py-2">
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="screened">Screened</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">Score</label>
              <select onChange={(e) => setScoreFilter(e.target.value)} className="w-full bg-neutral-800 border border-neutral-700 text-white rounded-lg px-3 py-2">
                <option value="all">All Scores</option>
                <option value="high">High (80+)</option>
                <option value="medium">Medium (60-79)</option>
                <option value="low">Low (0-59)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input type="text" placeholder="Search candidates..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 rounded-lg pl-10 pr-3 py-2" />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-800">
              <th className="text-left text-neutral-400 font-medium text-sm p-4">Candidate</th>
              <th className="text-left text-neutral-400 font-medium text-sm p-4">Role</th>
              <th className="text-left text-neutral-400 font-medium text-sm p-4">Status</th>
              <th className="text-left text-neutral-400 font-medium text-sm p-4">Score</th>
              <th className="text-left text-neutral-400 font-medium text-sm p-4">Location</th>
              <th className="text-left text-neutral-400 font-medium text-sm p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((candidate) => (
              <tr key={candidate.id} className="border-b border-neutral-800 hover:bg-neutral-800/50 transition-colors">
                <td className="p-4">
                  <div className="font-medium text-white">{candidate.name}</div>
                  <div className="text-sm text-neutral-400">{candidate.phone}</div>
                </td>
                <td className="p-4 text-neutral-300">{candidate.role}</td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(candidate.status)}`}>{candidate.status}</span>
                </td>
                <td className="p-4">
                  <span className={`font-medium ${getScoreColor(candidate.score)}`}>{candidate.score > 0 ? candidate.score : '--'}</span>
                </td>
                <td className="p-4 text-neutral-300">{candidate.location}</td>
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
