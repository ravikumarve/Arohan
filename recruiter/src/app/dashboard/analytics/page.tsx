'use client';

import { useState } from 'react';
import { TrendingUp, TrendingDown, Users, Clock, Target, MapPin, Award, BarChart3, ArrowUpRight } from 'lucide-react';

const funnelStages = [
  { label: 'Total Applicants', value: 1245, pct: 100, fill: 'linear-gradient(90deg, #6366f1, #8b5cf6)' },
  { label: 'Screened', value: 1087, pct: 87, fill: 'linear-gradient(90deg, #3b82f6, #06b6d4)' },
  { label: 'Interviewed', value: 654, pct: 52, fill: 'linear-gradient(90deg, #10b981, #34d399)' },
  { label: 'Shortlisted', value: 312, pct: 25, fill: 'linear-gradient(90deg, #f59e0b, #fbbf24)' },
  { label: 'Hired', value: 186, pct: 15, fill: '#10b981' },
];

const sources = [
  { name: 'WhatsApp', pct: 65, value: '45.2%', color: '#10b981' },
  { name: 'IVR', pct: 55, value: '38.7%', color: '#3b82f6' },
  { name: 'Referrals', pct: 89, value: '62.1%', color: '#8b5cf6' },
  { name: 'Job Portals', pct: 41, value: '28.4%', color: '#f59e0b' },
  { name: 'Campus', pct: 51, value: '35.9%', color: '#ec4899' },
];

export default function RecruiterAnalyticsPage() {
  const [timeRange, setTimeRange] = useState('6m');

  return (
    <div className="p-8 h-full overflow-y-auto">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-8">

        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-[1.8rem] font-semibold tracking-tight" style={{ color: '#ffffff' }}>
              Analytics
            </h1>
            <p className="text-sm font-mono tracking-wide" style={{ color: '#8b5cf6' }}>
              Comprehensive hiring analytics and insights
            </p>
          </div>
          <div>
            <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} className="bg-neutral-800 border border-neutral-700 text-white rounded-lg px-3 py-2">
              <option value="1m">Last Month</option>
              <option value="3m">Last 3 Months</option>
              <option value="6m">Last 6 Months</option>
              <option value="1y">Last Year</option>
            </select>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="metric-card-recruiter">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium" style={{ color: 'var(--text-muted, #94a3b8)' }}>Total Screenings</span>
              <Users className="w-5 h-5" style={{ color: '#8b5cf6' }} />
            </div>
            <div className="mc-value-recruiter">1,245</div>
            <div className="text-sm flex items-center gap-1" style={{ color: '#10b981' }}><ArrowUpRight className="w-3 h-3" /> +12% from last period</div>
          </div>
          <div className="metric-card-recruiter">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium" style={{ color: 'var(--text-muted, #94a3b8)' }}>Completion Rate</span>
              <Target className="w-5 h-5" style={{ color: '#3b82f6' }} />
            </div>
            <div className="mc-value-recruiter">87.3%</div>
            <div className="text-sm flex items-center gap-1" style={{ color: '#10b981' }}><ArrowUpRight className="w-3 h-3" /> +3.2% from last period</div>
          </div>
          <div className="metric-card-recruiter">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium" style={{ color: 'var(--text-muted, #94a3b8)' }}>Avg. Score</span>
              <Award className="w-5 h-5" style={{ color: '#f59e0b' }} />
            </div>
            <div className="mc-value-recruiter">72.8</div>
            <div className="text-sm flex items-center gap-1" style={{ color: '#ef4444' }}><TrendingDown className="w-3 h-3" /> -1.5% from last period</div>
          </div>
          <div className="metric-card-recruiter">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium" style={{ color: 'var(--text-muted, #94a3b8)' }}>Time to Hire</span>
              <Clock className="w-5 h-5" style={{ color: '#10b981' }} />
            </div>
            <div className="mc-value-recruiter">4.2 days</div>
            <div className="text-sm flex items-center gap-1" style={{ color: '#10b981' }}><ArrowUpRight className="w-3 h-3" /> -0.8 days</div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Hiring Funnel */}
          <div className="panel-recruiter">
            <div className="panel-header-recruiter">
              <h2 className="text-base font-semibold" style={{ color: '#ffffff' }}>Hiring Funnel</h2>
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
                      <div className="progress-fill-recruiter" style={{ width: `${stage.pct}%`, background: stage.fill }} />
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
                      <div className="bar-fill-recruiter" style={{ width: `${src.pct}%`, background: src.color }} />
                    </div>
                    <span className="text-sm font-mono text-right" style={{ color: '#ffffff' }}>{src.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="metric-card-recruiter">
            <span className="text-sm font-medium" style={{ color: 'var(--text-muted, #94a3b8)' }}>Top Performing Location</span>
            <div className="flex items-center gap-2 mt-2" style={{ color: '#ffffff' }}><MapPin className="w-5 h-5" style={{ color: '#8b5cf6' }} /> Bangalore</div>
            <div className="mc-value-recruiter mt-1">324 candidates</div>
          </div>
          <div className="metric-card-recruiter">
            <span className="text-sm font-medium" style={{ color: 'var(--text-muted, #94a3b8)' }}>Best Conversion Channel</span>
            <div className="flex items-center gap-2 mt-2" style={{ color: '#ffffff' }}><BarChart3 className="w-5 h-5" style={{ color: '#10b981' }} /> Referrals</div>
            <div className="mc-value-recruiter mt-1">62.1% rate</div>
          </div>
          <div className="metric-card-recruiter">
            <span className="text-sm font-medium" style={{ color: 'var(--text-muted, #94a3b8)' }}>Month-over-Month</span>
            <div className="flex items-center gap-2 mt-2" style={{ color: '#ffffff' }}><TrendingUp className="w-5 h-5" style={{ color: '#10b981' }} /> Growing</div>
            <div className="mc-value-recruiter mt-1">+18%</div>
          </div>
        </div>

      </div>
    </div>
  );
}
