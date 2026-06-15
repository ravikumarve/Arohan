'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { FileText, Download } from 'lucide-react';

const reportTypes = [
  { id: 'hiring', name: 'Hiring Summary', description: 'Overview of all hiring activities' },
  { id: 'screening', name: 'Screening Report', description: 'Candidate screening results and scores' },
  { id: 'campaign', name: 'Campaign Performance', description: 'Campaign metrics and ROI analysis' },
  { id: 'interview', name: 'Interview Analysis', description: 'Interview completion and feedback data' },
];

const recentReports = [
  { name: 'Hiring Summary - May 2025', date: '2025-05-15', size: '2.4 MB' },
  { name: 'Campaign Performance - Q2 2025', date: '2025-05-10', size: '1.8 MB' },
  { name: 'Screening Report - April 2025', date: '2025-04-30', size: '3.2 MB' },
  { name: 'Interview Analysis - Q1 2025', date: '2025-04-15', size: '1.5 MB' },
];

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState('last-30-days');

  const handleExportAll = useCallback(() => {
    toast.success('Exporting all reports...');
  }, []);

  const handleDownloadReport = useCallback((name: string) => {
    toast.success(`Downloading "${name}"`);
  }, []);

  return (
    <div className="p-8 h-full overflow-y-auto">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[1.8rem] font-semibold tracking-tight" style={{ color: '#ffffff' }}>
              Reports
            </h1>
            <p className="text-sm font-mono tracking-wide" style={{ color: '#8b5cf6' }}>
              Generate and download hiring reports
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-neutral-800 border border-neutral-700 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-violet-500"
            >
              <option value="last-7-days">Last 7 Days</option>
              <option value="last-30-days">Last 30 Days</option>
              <option value="last-90-days">Last 90 Days</option>
              <option value="this-year">This Year</option>
            </select>
            <button className="btn-recruiter-primary text-sm" onClick={handleExportAll}>
              <Download className="w-4 h-4" />
              Export All
            </button>
          </div>
        </div>

        {/* Report Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reportTypes.map((report) => (
            <div key={report.id} className="metric-card-recruiter">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: 'rgba(139, 92, 246, 0.1)' }}
                  >
                    <FileText className="w-5 h-5" style={{ color: '#8b5cf6' }} />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{report.name}</h3>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-muted, #94a3b8)' }}>{report.description}</p>
                  </div>
                </div>
                <button
                  className="flex items-center gap-1 text-sm transition-colors"
                  style={{ color: '#8b5cf6' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#a78bfa'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#8b5cf6'; }}
                  onClick={() => handleDownloadReport(report.name)}
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Reports */}
        <div className="panel-recruiter">
          <div className="panel-header-recruiter">
            <h2 className="text-base font-semibold" style={{ color: '#ffffff' }}>Recent Reports</h2>
          </div>
          <div className="panel-body-recruiter p-0">
            {recentReports.map((report, index) => (
              <div
                key={index}
                className="flex items-center justify-between px-6 py-4 transition-colors"
                style={{ borderBottom: index < recentReports.length - 1 ? '1px solid var(--border-dim, rgba(255,255,255,0.05))' : 'none' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover, #161925)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5" style={{ color: 'var(--text-muted, #94a3b8)' }} />
                  <div>
                    <p className="text-white text-sm font-medium">{report.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-faint, #475569)' }}>
                      {report.date} · {report.size}
                    </p>
                  </div>
                </div>
                <button
                  className="transition-colors"
                  style={{ color: '#8b5cf6' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#a78bfa'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#8b5cf6'; }}
                  onClick={() => handleDownloadReport(report.name)}
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
