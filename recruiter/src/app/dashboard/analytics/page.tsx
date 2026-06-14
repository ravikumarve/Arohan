'use client';

import { useState } from 'react';
import { TrendingUp, TrendingDown, Users, Clock, Target, MapPin, Award, Calendar, BarChart3, PieChart as PieIcon, ArrowUpRight } from 'lucide-react';

export default function RecruiterAnalyticsPage() {
  const [timeRange, setTimeRange] = useState('6m');

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
          <p className="text-neutral-400">Comprehensive hiring analytics and insights</p>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-neutral-400 text-sm">Total Screenings</span>
            <Users className="w-5 h-5 text-violet-400" />
          </div>
          <div className="text-2xl font-bold text-white">1,245</div>
          <div className="text-sm text-emerald-400 mt-1 flex items-center gap-1"><ArrowUpRight className="w-3 h-3" /> +12% from last period</div>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-neutral-400 text-sm">Completion Rate</span>
            <Target className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white">87.3%</div>
          <div className="text-sm text-emerald-400 mt-1 flex items-center gap-1"><ArrowUpRight className="w-3 h-3" /> +3.2% from last period</div>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-neutral-400 text-sm">Avg. Score</span>
            <Award className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white">72.8</div>
          <div className="text-sm text-red-400 mt-1 flex items-center gap-1"><TrendingDown className="w-3 h-3" /> -1.5% from last period</div>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-neutral-400 text-sm">Time to Hire</span>
            <Clock className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white">4.2 days</div>
          <div className="text-sm text-emerald-400 mt-1 flex items-center gap-1"><ArrowUpRight className="w-3 h-3" /> -0.8 days</div>
        </div>
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Hiring Funnel</h3>
          <div className="space-y-4">
            {[
              { label: 'Total Applicants', value: 1245, color: 'bg-violet-500', width: '100%' },
              { label: 'Screened', value: 1087, color: 'bg-blue-500', width: '87%' },
              { label: 'Interviewed', value: 654, color: 'bg-emerald-500', width: '52%' },
              { label: 'Shortlisted', value: 312, color: 'bg-amber-500', width: '25%' },
              { label: 'Hired', value: 186, color: 'bg-green-500', width: '15%' },
            ].map(stage => (
              <div key={stage.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-neutral-300">{stage.label}</span>
                  <span className="text-white font-medium">{stage.value}</span>
                </div>
                <div className="h-3 bg-neutral-800 rounded-full overflow-hidden">
                  <div className={`h-full ${stage.color} rounded-full transition-all`} style={{ width: stage.width }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Source Performance</h3>
          <div className="space-y-4">
            {[
              { source: 'WhatsApp', conversions: 45.2, color: 'bg-emerald-500' },
              { source: 'IVR', conversions: 38.7, color: 'bg-blue-500' },
              { source: 'Referrals', conversions: 62.1, color: 'bg-violet-500' },
              { source: 'Job Portals', conversions: 28.4, color: 'bg-amber-500' },
              { source: 'Campus', conversions: 35.9, color: 'bg-pink-500' },
            ].map(s => (
              <div key={s.source} className="flex items-center gap-4">
                <span className="text-neutral-300 w-24 text-sm">{s.source}</span>
                <div className="flex-1 h-3 bg-neutral-800 rounded-full overflow-hidden">
                  <div className={`h-full ${s.color} rounded-full`} style={{ width: `${(s.conversions / 70) * 100}%` }} />
                </div>
                <span className="text-white text-sm font-medium w-12 text-right">{s.conversions}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <h4 className="text-sm font-medium text-neutral-400 mb-2">Top Performing Location</h4>
          <div className="flex items-center gap-2 text-white"><MapPin className="w-5 h-5 text-violet-400" /> Bangalore</div>
          <div className="text-2xl font-bold text-white mt-2">324 candidates</div>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <h4 className="text-sm font-medium text-neutral-400 mb-2">Best Conversion Channel</h4>
          <div className="flex items-center gap-2 text-white"><BarChart3 className="w-5 h-5 text-emerald-400" /> Referrals</div>
          <div className="text-2xl font-bold text-white mt-2">62.1% rate</div>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <h4 className="text-sm font-medium text-neutral-400 mb-2">Month-over-Month</h4>
          <div className="flex items-center gap-2 text-white"><TrendingUp className="w-5 h-5 text-emerald-400" /> Growing</div>
          <div className="text-2xl font-bold text-white mt-2">+18%</div>
        </div>
      </div>
    </div>
  );
}
