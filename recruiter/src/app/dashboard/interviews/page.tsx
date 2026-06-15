'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { Calendar, Clock, Phone, Video, CheckCircle, XCircle, AlertCircle, MoreVertical, Calendar as CalendarIcon, Users, Star, TrendingUp } from 'lucide-react';

const mockInterviews = [
  { id: '1', candidateName: 'Rajesh Kumar', phone: '+91 98765 43210', role: 'Delivery Partner', type: 'voice', status: 'completed', date: '2025-05-10', score: 78, duration: '5:32' },
  { id: '2', candidateName: 'Priya Sharma', phone: '+91 87654 32109', role: 'Retail Associate', type: 'voice', status: 'scheduled', date: '2025-05-11', score: 0, duration: '0:00' },
  { id: '3', candidateName: 'Amit Patel', phone: '+91 76543 21098', role: 'Support Executive', type: 'video', status: 'in-progress', date: '2025-05-10', score: 0, duration: '3:15' },
  { id: '4', candidateName: 'Sunita Devi', phone: '+91 65432 10987', role: 'Field Sales', type: 'voice', status: 'completed', date: '2025-05-09', score: 85, duration: '6:18' },
];

const metrics = [
  { title: 'Total Interviews', value: '4', icon: CalendarIcon, color: '#8b5cf6' },
  { title: 'Completed', value: '2', icon: CheckCircle, color: '#10b981' },
  { title: 'Scheduled', value: '1', icon: Clock, color: '#3b82f6' },
  { title: 'Avg Score', value: '81.5', icon: Star, color: '#f59e0b' },
];

export default function RecruiterInterviewsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const handleScheduleInterview = useCallback(() => {
    toast.info('Schedule interview form coming soon');
  }, []);

  const handleInterviewAction = useCallback((name: string) => {
    toast.info(`Actions for ${name}`, { description: 'View details, reschedule, or cancel interview' });
  }, []);

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
      default: return '';
    }
  };

  return (
    <div className="p-8 h-full overflow-y-auto">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-8">

        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-[1.8rem] font-semibold tracking-tight" style={{ color: '#ffffff' }}>
              Interviews
            </h1>
            <p className="text-sm font-mono tracking-wide" style={{ color: '#8b5cf6' }}>
              Schedule and manage candidate interviews
            </p>
          </div>
          <button className="btn-recruiter-primary" onClick={handleScheduleInterview}>
            <Calendar className="w-4 h-4" /> Schedule Interview
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((m) => (
            <div key={m.title} className="metric-card-recruiter">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium" style={{ color: 'var(--text-muted, #94a3b8)' }}>
                  {m.title}
                </span>
                <m.icon size={16} style={{ color: m.color }} />
              </div>
              <div className="mc-value-recruiter">{m.value}</div>
            </div>
          ))}
        </div>

        <div className="panel-recruiter">
          <div className="panel-header-recruiter">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search interviews..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 rounded-lg pl-3 pr-3 py-2"
              />
            </div>
            <select onChange={(e) => setStatusFilter(e.target.value)} className="bg-neutral-800 border border-neutral-700 text-white rounded-lg px-3 py-2">
              <option value="all">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="scheduled">Scheduled</option>
              <option value="in-progress">In Progress</option>
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-dim, rgba(255,255,255,0.05))' }}>
                  <th className="text-left p-4 text-xs uppercase tracking-wider font-semibold" style={{ color: 'var(--text-faint, #475569)' }}>Candidate</th>
                  <th className="text-left p-4 text-xs uppercase tracking-wider font-semibold" style={{ color: 'var(--text-faint, #475569)' }}>Role</th>
                  <th className="text-left p-4 text-xs uppercase tracking-wider font-semibold" style={{ color: 'var(--text-faint, #475569)' }}>Status</th>
                  <th className="text-left p-4 text-xs uppercase tracking-wider font-semibold" style={{ color: 'var(--text-faint, #475569)' }}>Score</th>
                  <th className="text-left p-4 text-xs uppercase tracking-wider font-semibold" style={{ color: 'var(--text-faint, #475569)' }}>Date</th>
                  <th className="text-left p-4 text-xs uppercase tracking-wider font-semibold" style={{ color: 'var(--text-faint, #475569)' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((interview) => (
                  <tr
                    key={interview.id}
                    style={{ borderBottom: '1px solid var(--border-dim, rgba(255,255,255,0.05))' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover, #161925)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                  >
                    <td className="p-4">
                      <div className="text-sm font-semibold" style={{ color: '#ffffff' }}>{interview.candidateName}</div>
                      <div className="text-xs font-mono" style={{ color: 'var(--text-muted, #94a3b8)' }}>{interview.phone}</div>
                    </td>
                    <td className="p-4 text-sm" style={{ color: '#ffffff' }}>{interview.role}</td>
                    <td className="p-4">
                      <span className={`status-badge-recruiter ${getStatusColor(interview.status)}`}>
                        {interview.status}
                      </span>
                    </td>
                    <td className="p-4">
                      {interview.score > 0 ? (
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${interview.score}%`,
                                background: interview.score >= 80 ? '#10b981' : interview.score >= 60 ? '#f59e0b' : '#ef4444',
                              }}
                            />
                          </div>
                          <span className="text-sm font-mono" style={{ color: '#ffffff' }}>{interview.score}</span>
                        </div>
                      ) : (
                        <span className="text-sm" style={{ color: 'var(--text-faint, #475569)' }}>--</span>
                      )}
                    </td>
                    <td className="p-4 text-sm font-mono" style={{ color: 'var(--text-muted, #94a3b8)' }}>{interview.date}</td>
                    <td className="p-4">
                      <button
                        className="p-2 rounded-lg transition-colors"
                        style={{ color: 'var(--text-muted, #94a3b8)' }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#ffffff'; (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover, #161925)'; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-muted, #94a3b8)'; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                        onClick={() => handleInterviewAction(interview.candidateName)}
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
