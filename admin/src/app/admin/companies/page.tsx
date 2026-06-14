'use client';

import { useState } from 'react';
import { Building2, Search, Users, CheckCircle, XCircle, MoreVertical } from 'lucide-react';

const mockCompanies = [
  { id: '1', name: 'TechCorp India Pvt Ltd', email: 'hr@techcorp.in', phone: '+91 80 1234 5678', location: 'Bangalore, Karnataka', status: 'active', users: 45, plan: 'Enterprise' },
  { id: '2', name: 'RetailMax Solutions', email: 'jobs@retailmax.com', phone: '+91 22 8765 4321', location: 'Mumbai, Maharashtra', status: 'active', users: 28, plan: 'Growth' },
  { id: '3', name: 'LogiChain Logistics', email: 'careers@logichain.in', phone: '+91 40 2345 6789', location: 'Hyderabad, Telangana', status: 'trial', users: 12, plan: 'Startup' },
  { id: '4', name: 'FoodExpress Delivery', email: 'hiring@foodexpress.in', phone: '+91 44 3456 7890', location: 'Chennai, Tamil Nadu', status: 'active', users: 156, plan: 'Enterprise' },
  { id: '5', name: 'HealthFirst Clinics', email: 'recruitment@healthfirst.in', phone: '+91 11 4567 8901', location: 'Delhi, NCR', status: 'inactive', users: 8, plan: 'Growth' },
];

export const dynamic = 'force-dynamic';


export default function AdminCompaniesPage() {
  const [search, setSearch] = useState('');

  const filtered = mockCompanies.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'trial': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'inactive': return 'bg-neutral-700 text-neutral-400 border-neutral-600';
      default: return 'bg-neutral-800 text-neutral-400';
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'Enterprise': return 'text-violet-400';
      case 'Growth': return 'text-blue-400';
      case 'Startup': return 'text-emerald-400';
      default: return 'text-neutral-400';
    }
  };

  return (
    <div className="space-y-8 p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Companies</h1>
          <p className="text-neutral-400">Manage companies and their subscriptions</p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors flex items-center gap-2">
          <Building2 className="w-4 h-4" /> Add Company
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4"><span className="CONTINUE [text-neutral-400 text-sm">Total Companies</span><Building2 className="w-5 h-5 text-indigo-400" /></div>
          <div className="text-2xl font-bold text-white">{mockCompanies.length}</div>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4"><span className="text-neutral-400 text-sm">Active</span><CheckCircle className="w-5 h-5 text-emerald-400" /></div>
          <div className="text-2xl font-bold text-white">3</div>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4"><span className="text-neutral-400 text-sm">In Trial</span><Users className="w-5 h-5 text-amber-400" /></div>
          <div className="text-2xl font-bold text-white">1</div>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4"><span className="text-neutral-400 text-sm">Total Users</span><Users className="w-5 h-5 text-blue-400" /></div>
          <div className="text-2xl font-bold text-white">249</div>
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-neutral-800">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input type="text" placeholder="Search companies..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 rounded-lg pl-10 pr-3 py-2" />
          </div>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-800">
              <th className="text-left text-neutral-400 font-medium text-sm p-4">Company</th>
              <th className="text-left text-neutral-400 font-medium text-sm p-4">Plan</th>
              <th className="text-left text-neutral-400 font-medium text-sm p-4">Status</th>
              <th className="text-left text-neutral-400 font-medium text-sm p-4">Users</th>
              <th className="text-left text-neutral-400 font-medium text-sm p-4">Location</th>
              <th className="text-left text-neutral-400 font-medium text-sm p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((company) => (
              <tr key={company.id} className="border-b border-neutral-800 hover:bg-neutral-800/50 transition-colors">
                <td className="p-4">
                  <div className="font-medium text-white">{company.name}</div>
                  <div className="text-sm text-neutral-400">{company.email}</div>
                </td>
                <td className="p-4">
                  <span className={`text-sm font-medium ${getPlanColor(company.plan)}`}>{company.plan}</span>
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(company.status)}`}>{company.status}</span>
                </td>
                <td className="p-4 text-neutral-300">{company.users}</td>
                <td className="p-4 text-neutral-300 text-sm">{company.location}</td>
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
