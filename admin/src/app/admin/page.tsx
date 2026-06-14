'use client';

import { useState } from 'react';
import { Users, Building2, Activity, DollarSign, Server, Clock, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

export default function AdminOverview() {
  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
        <p className="text-neutral-400">Platform metrics and system status at a glance</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4"><span className="text-neutral-400 text-sm">Total Users</span><Users className="w-5 h-5 text-indigo-400" /></div>
          <div className="text-2xl font-bold text-white">1,245</div>
          <div className="text-sm text-emerald-400 mt-1">+12% this month</div>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4"><span className="text-neutral-400 text-sm">Companies</span><Building2 className="w-5 h-5 text-blue-400" /></div>
          <div className="text-2xl font-bold text-white">48</div>
          <div className="text-sm text-emerald-400 mt-1">+3 new this week</div>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4"><span className="text-neutral-400 text-sm">Screenings</span><Activity className="w-5 h-5 text-violet-400" /></div>
          <div className="text-2xl font-bold text-white">3,892</div>
          <div className="text-sm text-emerald-400 mt-1">+245 this week</div>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4"><span className="text-neutral-400 text-sm">Revenue</span><DollarSign className="w-5 h-5 text-amber-400" /></div>
          <div className="text-2xl font-bold text-white">₹12.4L</div>
          <div className="text-sm text-emerald-400 mt-1">+8% this month</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {[
              { id: '1', message: 'New user registration: Priya Sharma', time: '2 min ago', type: 'user' },
              { id: '2', message: 'Company onboarded: TechCorp India', time: '5 min ago', type: 'company' },
              { id: '3', message: 'Invoice #INV-2025-003 issued', time: '15 min ago', type: 'billing' },
              { id: '4', message: 'System health check passed', time: '30 min ago', type: 'system' },
            ].map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 bg-neutral-800/50 rounded-lg">
                <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${activity.type === 'user' ? 'bg-indigo-500' : activity.type === 'company' ? 'bg-blue-500' : activity.type === 'billing' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                <div>
                  <p className="text-white text-sm">{activity.message}</p>
                  <p className="text-neutral-400 text-xs mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">System Status</h3>
          <div className="space-y-3">
            {[
              { name: 'API Gateway', status: 'healthy', uptime: '99.99%', latency: '12ms' },
              { name: 'Database', status: 'healthy', uptime: '99.95%', latency: '8ms' },
              { name: 'Redis Cache', status: 'healthy', uptime: '99.98%', latency: '2ms' },
              { name: 'STT Pipeline', status: 'degraded', uptime: '97.50%', latency: '320ms' },
            ].map((service) => (
              <div key={service.name} className="flex items-center justify-between p-3 bg-neutral-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${service.status === 'healthy' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  <span className="text-white font-medium">{service.name}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-neutral-400">
                  <span>{service.uptime}</span>
                  <span>{service.latency}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
