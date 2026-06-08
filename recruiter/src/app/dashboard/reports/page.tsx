'use client';

import { useState } from 'react';
import { FileText, Download } from 'lucide-react';

const reportTypes = [
  { id: 'hiring', name: 'Hiring Summary', description: 'Overview of all hiring activities' },
  { id: 'screening', name: 'Screening Report', description: 'Candidate screening results and scores' },
  { id: 'campaign', name: 'Campaign Performance', description: 'Campaign metrics and ROI analysis' },
  { id: 'interview', name: 'Interview Analysis', description: 'Interview completion and feedback data' },
];

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState('last-30-days');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Reports</h1>
          <p className="text-neutral-400 mt-1">Generate and download hiring reports</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-neutral-900 border border-neutral-700 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-indigo-500"
          >
            <option value="last-7-days">Last 7 Days</option>
            <option value="last-30-days">Last 30 Days</option>
            <option value="last-90-days">Last 90 Days</option>
            <option value="this-year">This Year</option>
          </select>
          <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <Download className="w-4 h-4" />
            Export All
          </button>
        </div>
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reportTypes.map((report) => (
          <div
            key={report.id}
            className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-neutral-700 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-white font-medium">{report.name}</h3>
                  <p className="text-neutral-400 text-sm mt-1">{report.description}</p>
                </div>
              </div>
              <button className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 text-sm transition-colors">
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Reports */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-800">
          <h2 className="text-lg font-semibold text-white">Recent Reports</h2>
        </div>
        <div className="divide-y divide-neutral-800">
          {[
            { name: 'Hiring Summary - May 2025', date: '2025-05-15', size: '2.4 MB' },
            { name: 'Campaign Performance - Q2 2025', date: '2025-05-10', size: '1.8 MB' },
            { name: 'Screening Report - April 2025', date: '2025-04-30', size: '3.2 MB' },
            { name: 'Interview Analysis - Q1 2025', date: '2025-04-15', size: '1.5 MB' },
          ].map((report, index) => (
            <div key={index} className="px-6 py-4 flex items-center justify-between hover:bg-neutral-800/50 transition-colors">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-neutral-400" />
                <div>
                  <p className="text-white text-sm font-medium">{report.name}</p>
                  <p className="text-neutral-500 text-xs mt-0.5">{report.date} · {report.size}</p>
                </div>
              </div>
              <button className="text-indigo-400 hover:text-indigo-300 text-sm transition-colors">
                <Download className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
