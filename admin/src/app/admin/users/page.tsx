'use client';

import { useState } from 'react';
import { Users, Search, Shield, Mail, Phone, Calendar, MoreVertical, CheckCircle, XCircle, Clock } from 'lucide-react';

const mockUsers = [
  { id: '1', name: 'Ravi Kumar', email: 'ravi.kumar@arohan.ai', phone: '+91 98765 43210', role: 'Super Admin', status: 'active', lastLogin: '2025-05-10 10:30 AM' },
  { id: '2', name: 'Priya Sharma', email: 'priya.sharma@arohan.ai', phone: '+91 87654 32109', role: 'Admin', status: 'active', lastLogin: '2025-05-10 09:15 AM' },
  { id: '3', name: 'Amit Patel', email: 'amit.patel@arohan.ai', phone: '+91 76543 21098', role: 'Recruiter', status: 'active', lastLogin: '2025-05-09 05:45 PM' },
  { id: '4', name: 'Sunita Devi', email: 'sunita.devi@arohan.ai', phone: '+91 65432 10987', role: 'Recruiter', status: 'inactive', lastLogin: '2025-05-08 03:20 PM' },
  { id: '5', name: 'Ravi Verma', email: 'ravi.verma@arohan.ai', phone: '+91 54321 09876', role: 'Viewer', status: 'active', lastLogin: '2025-05-10 08:00 AM' },
];

export const dynamic = 'force-dynamic';


export default function AdminUsersPage() {
  const [search, setSearch] = useState('');

  const filtered = mockUsers.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'inactive': return 'bg-neutral-700 text-neutral-400 border-neutral-600';
      default: return 'bg-neutral-800 text-neutral-400';
    }
  };

  return (
    <div className="space-y-8 p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Users</h1>
          <p className="text-neutral-400">Manage platform users and roles</p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors flex items-center gap-2">
          <Users className="w-4 h-4" /> Add User
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4"><span className="text-neutral-400 text-sm">Total Users</span><Users className="w-5 h-5 text-indigo-400" /></div>
          <div className="text-2xl font-bold text-white">{mockUsers.length}</div>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4"><span className="text-neutral-400 text-sm">Active</span><CheckCircle className="w-5 h-5 text-emerald-400" /></div>
          <div className="text-2xl font-bold text-white">4</div>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4"><span className="text-neutral-400 text-sm">Inactive</span><XCircle className="w-5 h-5 text-red-400" /></div>
          <div className="text-2xl font-bold text-white">1</div>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4"><span className="text-neutral-400 text-sm">Recruiters</span><Shield className="w-5 h-5 text-blue-400" /></div>
          <div className="text-2xl font-bold text-white">2</div>
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-neutral-800">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input type="text" placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 rounded-lg pl-10 pr-3 py-2" />
          </div>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-800">
              <th className="text-left text-neutral-400 font-medium text-sm p-4">User</th>
              <th className="text-left text-neutral-400 font-medium text-sm p-4">Role</th>
              <th className="text-left text-neutral-400 font-medium text-sm p-4">Status</th>
              <th className="text-left text-neutral-400 font-medium text-sm p-4">Last Login</th>
              <th className="text-left text-neutral-400 font-medium text-sm p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => (
              <tr key={user.id} className="border-b border-neutral-800 hover:bg-neutral-800/50 transition-colors">
                <td className="p-4">
                  <div className="font-medium text-white">{user.name}</div>
                  <div className="text-sm text-neutral-400">{user.email}</div>
                </td>
                <td className="p-4 text-neutral-300">{user.role}</td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(user.status)}`}>{user.status}</span>
                </td>
                <td className="p-4 text-neutral-400 text-sm">{user.lastLogin}</td>
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
