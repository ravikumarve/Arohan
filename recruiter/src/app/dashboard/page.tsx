'use client';

import { Users, Megaphone, Phone, Star, ArrowUp, Search, Filter } from 'lucide-react';

const metrics = [
  { title: 'Active Campaigns', value: '12', trend: '+2 this month', icon: Megaphone },
  { title: 'Total Candidates', value: '847', trend: '+156 new', icon: Users },
  { title: 'Screened Today', value: '34', trend: '+8 vs yesterday', icon: Phone },
  { title: 'Shortlisted', value: '23', trend: '+5 waiting review', icon: Star, glow: true },
];

const funnelStages = [
  { label: 'Total Applicants', value: '1,245', pct: 100, fill: 'linear-gradient(90deg, #6366f1, #8b5cf6)' },
  { label: 'Screened (AI Voice)', value: '1,087', pct: 87, fill: 'linear-gradient(90deg, #3b82f6, #06b6d4)' },
  { label: 'Interviewed', value: '654', pct: 52, fill: 'linear-gradient(90deg, #10b981, #34d399)' },
  { label: 'Shortlisted (>80 Score)', value: '312', pct: 25, fill: 'linear-gradient(90deg, #f59e0b, #fbbf24)' },
  { label: 'Hired', value: '186', pct: 15, fill: '#10b981' },
];

const sources = [
  { name: 'WhatsApp', pct: 85, value: '45.2%', color: '#10b981' },
  { name: 'IVR Missed Call', pct: 70, value: '38.7%', color: '#3b82f6' },
  { name: 'Referrals', pct: 95, value: '62.1%', color: '#8b5cf6' },
  { name: 'Job Portals', pct: 45, value: '28.4%', color: '#f59e0b' },
  { name: 'Campus Drives', pct: 60, value: '35.9%', color: '#ec4899' },
];

const candidates = [
  { initials: 'R', name: 'Rajesh Kumar', phone: '+91 98765 43210', role: 'Delivery Partner', score: '85', status: 'shortlisted' as const, time: '2 hours ago', variant: 'v1' as const },
  { initials: 'P', name: 'Priya Sharma', phone: '+91 87654 32109', role: 'Warehouse Associate', score: '78', status: 'screened' as const, time: '3 hours ago', variant: 'v2' as const },
  { initials: 'A', name: 'Amit Patel', phone: '+91 76543 21098', role: 'Retail Staff', score: '92', status: 'shortlisted' as const, time: '5 hours ago', variant: 'v1' as const },
];

const statusConfig: Record<string, string> = {
  shortlisted: 'status-badge-recruiter shortlisted',
  screened: 'status-badge-recruiter screened',
  pending: 'status-badge-recruiter pending',
};

const avatarVariants: Record<string, string> = {
  v1: 'rgba(139, 92, 246, 0.15)',
  v2: 'rgba(236, 72, 153, 0.15)',
};

const avatarBorderVariants: Record<string, string> = {
  v1: 'rgba(139, 92, 246, 0.3)',
  v2: 'rgba(236, 72, 153, 0.3)',
};

const avatarColorVariants: Record<string, string> = {
  v1: '#8b5cf6',
  v2: '#ec4899',
};

export default function RecruiterOverview() {
  return (
    <div className="p-8 h-full overflow-y-auto">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-8">

        {/* Page header */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-[1.8rem] font-semibold tracking-tight" style={{ color: '#ffffff' }}>
              Hiring Dashboard
            </h1>
            <p className="text-sm font-mono tracking-wide" style={{ color: '#8b5cf6' }}>
              Welcome to AROHAN Recruiter Dashboard
            </p>
          </div>
          <div className="flex gap-3">
            <button className="btn-recruiter-secondary text-sm">Upload Candidates</button>
            <button className="btn-recruiter-primary text-sm">Create Campaign</button>
          </div>
        </div>

        {/* Metrics grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((m) => (
            <div key={m.title} className={`metric-card-recruiter ${m.glow ? 'glow-last' : ''}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium" style={{ color: 'var(--text-muted, #94a3b8)' }}>
                  {m.title}
                </span>
                <m.icon size={16} style={{ color: m.glow ? '#8b5cf6' : 'var(--text-muted, #94a3b8)' }} />
              </div>
              <div className="mc-value-recruiter">{m.value}</div>
              <div className="flex items-center gap-1.5 text-sm font-medium" style={{ color: '#10b981' }}>
                <ArrowUp size={14} />
                <span>{m.trend}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Split: Hiring Funnel + Source Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Hiring Funnel */}
          <div className="panel-recruiter">
            <div className="panel-header-recruiter">
              <h2 className="text-base font-semibold" style={{ color: '#ffffff' }}>Hiring Funnel</h2>
              <button className="btn-recruiter-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}>
                Last 30 Days
              </button>
            </div>
            <div className="panel-body-recruiter">
              <div className="funnel-list-recruiter">
                {funnelStages.map((stage) => (
                  <div key={stage.label} className="funnel-item-recruiter">
                    <div className="fi-header-recruiter">
                      <span style={{ color: 'var(--text-muted, #94a3b8)' }}>{stage.label}</span>
                      <span className="fi-val-recruiter">{stage.value}</span>
                    </div>
                    <div className="progress-track-recruiter">
                      <div
                        className="progress-fill-recruiter"
                        style={{ width: `${stage.pct}%`, background: stage.fill }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Source Performance */}
          <div className="panel-recruiter">
            <div className="panel-header-recruiter">
              <h2 className="text-base font-semibold" style={{ color: '#ffffff' }}>Source Performance</h2>
            </div>
            <div className="panel-body-recruiter">
              <div className="source-list-recruiter">
                {sources.map((src) => (
                  <div key={src.name} className="source-item-recruiter">
                    <span className="text-sm" style={{ color: 'var(--text-muted, #94a3b8)' }}>{src.name}</span>
                    <div className="bar-track-recruiter">
                      <div
                        className="bar-fill-recruiter"
                        style={{ width: `${src.pct}%`, background: src.color }}
                      />
                    </div>
                    <span
                      className="text-sm font-mono text-right"
                      style={{ color: '#ffffff' }}
                    >
                      {src.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Recent Candidates Table */}
        <div className="panel-recruiter">
          <div className="panel-header-recruiter">
            <h2 className="text-base font-semibold" style={{ color: '#ffffff' }}>Recent Candidates</h2>
            <button className="btn-recruiter-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}>
              <Filter size={12} />
              Filters
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full" style={{ borderCollapse: 'collapse' }}>
              <tbody>
                {candidates.map((c) => (
                  <tr
                    key={c.phone}
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.01)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold"
                          style={{
                            background: avatarVariants[c.variant],
                            color: avatarColorVariants[c.variant],
                            border: `1px solid ${avatarBorderVariants[c.variant]}`,
                          }}
                        >
                          {c.initials}
                        </div>
                        <div>
                          <div className="text-sm font-semibold" style={{ color: '#ffffff' }}>{c.name}</div>
                          <div className="text-xs font-mono" style={{ color: 'var(--text-muted, #94a3b8)' }}>{c.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-sm" style={{ color: '#ffffff' }}>{c.role}</div>
                      <div className="text-xs font-mono" style={{ color: '#8b5cf6' }}>Score: {c.score}</div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div>
                        <span className={statusConfig[c.status]}>{c.status}</span>
                      </div>
                      <div className="text-xs font-mono mt-1.5" style={{ color: 'var(--text-faint, #475569)' }}>
                        {c.time}
                      </div>
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
