'use client';

import { useState } from 'react';
import { Calendar, Clock, Phone, Video, CheckCircle, XCircle, AlertCircle, MoreVertical, Calendar as CalendarIcon, Users, Star, TrendingUp } from 'lucide-react';

const mockInterviews = [
  { id: '1', candidateName: 'Rajesh Kumar', phone: '+91 98765 43210', role: 'Delivery Partner', type: 'voice', status: 'completed', date: '2025-05-10', score: 78, duration: '5:32' },
  { id: '2', candidateName: 'Priya Sharma', phone: '+91 87654 32109', role: 'Retail Associate', type: 'voice', status: 'scheduled', date: '2025-05-11', score: 0, duration: '0:00' },
  { id: '3', candidateName: 'Amit Patel', phone: '+91 76543 21098', role: 'Support Executive', type: 'video', status: 'in-progress', date: '2025-05-10', score: 0, duration: '3:15' },
  { id: '4', candidateName: 'Sunita Devi', phone: '+91 65432 10987', role: 'Field Sales', type: 'voice', status: 'completed', date: '2025-05-09', score: 85, duration: '6:18' },
];

export default function RecruiterInterviewsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = mockInterviews.filter(i => {
    const matchesSearch = i.candidateName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || i.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'scheduled': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'in-progress': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-neutral-800 text-neutral-400';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Interviews</h1>
          <p className="text-neutral-400">Schedule and manage candidate interviews</p>
        </div>
        <button className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg transition-colors flex items-center gap-2">
          <Calendar className="w-4 h-4" /> Schedule Interview
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-neutral-400 text-sm">Total Interviews</span>
            <CalendarIcon className="w-5 h-5 text-violet-400" />
          </div>
          <div className="text-2xl font-bold text-white">{mockInterviews.length}</div>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-neutral-400 text-sm">Completed</span>
            <CheckCircle className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white">2</div>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-neutral-400 text-sm">Scheduled</span>
            <Clock className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white">1</div>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-neutral-400 text-sm">Avg Score</span>
            <Star className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white">81.5</div>
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-neutral-800 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <input type="text" placeholder="Search interviews..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 rounded-lg pl-3 pr-3 py-2" />
          </div>
          <select onChange={(e) => setStatusFilter(e.target.value)} className="bg-neutral-800 border border-neutral-700 text-white rounded-lg px-3 py-2">
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="scheduled">Scheduled</option>
            <option value="in-progress">In Progress</option>
          </select>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-800">
              <th className="text-left text-neutral-400 font-medium text-sm p-4">Candidate</th>
              <th className="text-left text-neutral-400 font-medium text-sm p-4">Role</th>
              <th className="text-left text-neutral-400 font-medium text-sm p-4">Status</th>
              <th className="text-left text-neutral-400 font-medium text-sm p-4">Score</th>
              <th className="text-left text-neutral-400 font-medium text-sm p-4">Date</th>
              <th className="text-left text-neutral-400 font-medium text-sm p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((interview) => (
              <tr key={interview.id} className="border-b border-neutral-800 hover:bg-neutral-800/50 transition-colors">
                <td className="p-4">
                  <div className="font-medium text-white">{interview.candidateName}</div>
                  <div className="text-sm text-neutral-400">{interview.phone}</div>
                </td>
                <td className="p-4 text-neutral-300">{interview.role}</td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(interview.status)}`}>{interview.status}</span>
                </td>
                <td className="p-4">
                  {interview.score > 0 ? (
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-neutral-700 rounded-full h-2 w-24">
                        <div className={`h-2 rounded-full ${interview.score >= 80 ? 'bg-emerald-500' : interview.score >= 60 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${interview.score}%` }} />
                      </div>
                      <span className="text-sm text-neutral-300">{interview.score}</span>
                    </div>
                  ) : (
                    <span className="text-neutral-500 text-sm">--</span>
                  )}
                </td>
                <td className="p-4 text-neutral-300">{interview.date}</td>
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
