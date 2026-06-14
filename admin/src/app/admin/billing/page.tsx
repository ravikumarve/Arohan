'use client';

import { useState } from 'react';
import { DollarSign, Search, CreditCard, CheckCircle, XCircle, Clock, TrendingUp, FileText, Download, Calendar } from 'lucide-react';

const mockInvoices = [
  { id: 'INV-2025-001', company: 'TechCorp India Pvt Ltd', amount: 45000, status: 'paid', date: '2025-05-01', dueDate: '2025-05-15' },
  { id: 'INV-2025-002', company: 'RetailMax Solutions', amount: 28000, status: 'paid', date: '2025-05-03', dueDate: '2025-05-17' },
  { id: 'INV-2025-003', company: 'LogiChain Logistics', amount: 12000, status: 'pending', date: '2025-05-05', dueDate: '2025-05-19' },
  { id: 'INV-2025-004', company: 'FoodExpress Delivery', amount: 95000, status: 'paid', date: '2025-05-07', dueDate: '2025-05-21' },
  { id: 'INV-2025-005', company: 'HealthFirst Clinics', amount: 22000, status: 'overdue', date: '2025-04-15', dueDate: '2025-04-29' },
];

export const dynamic = 'force-dynamic';


export default function AdminBillingPage() {
  const [search, setSearch] = useState('');

  const filtered = mockInvoices.filter(i => 
    i.company.toLowerCase().includes(search.toLowerCase()) || 
    i.id.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'pending': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'overdue': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-neutral-800 text-neutral-400';
    }
  };

  const totalRevenue = mockInvoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0);
  const pendingAmount = mockInvoices.filter(i => i.status === 'pending').reduce((sum, i) => sum + i.amount, 0);
  const overdueAmount = mockInvoices.filter(i => i.status === 'overdue').reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="space-y-8 p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Billing</h1>
          <p className="text-neutral-400">Manage invoices and revenue</p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors flex items-center gap-2">
          <FileText className="w-4 h-4" /> Create Invoice
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4"><span className="text-neutral-400 text-sm">Total Revenue</span><DollarSign className="w-5 h-5 text-emerald-400" /></div>
          <div className="text-2xl font-bold text-white">₹{totalRevenue.toLocaleString()}</div>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4"><span className="text-neutral-400 text-sm">Pending</span><Clock className="w-5 h-5 text-amber-400" /></div>
          <div className="text-2xl font-bold text-white">₹{pendingAmount.toLocaleString()}</div>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4"><span className="text-neutral-400 text-sm">Overdue</span><XCircle className="w-5 h-5 text-red-400" /></div>
          <div className="text-2xl font-bold text-white">₹{overdueAmount.toLocaleString()}</div>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4"><span className="text-neutral-400 text-sm">Invoices</span><FileText className="w-5 h-5 text-blue-400" /></div>
          <div className="text-2xl font-bold text-white">{mockInvoices.length}</div>
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-neutral-800">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input type="text" placeholder="Search invoices..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 rounded-lg pl-10 pr-3 py-2" />
          </div>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-800">
              <th className="text-left text-neutral-400 font-medium text-sm p-4">Invoice ID</th>
              <th className="text-left text-neutral-400 font-medium text-sm p-4">Company</th>
              <th className="text-left text-neutral-400 font-medium text-sm p-4">Amount</th>
              <th className="text-left text-neutral-400 font-medium text-sm p-4">Status</th>
              <th className="text-left text-neutral-400 font-medium text-sm p-4">Date</th>
              <th className="text-left text-neutral-400 font-medium text-sm p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((invoice) => (
              <tr key={invoice.id} className="border-b border-neutral-800 hover:bg-neutral-800/50 transition-colors">
                <td className="p-4 font-medium text-white">{invoice.id}</td>
                <td className="p-4 text-neutral-300">{invoice.company}</td>
                <td className="p-4 text-white font-medium">₹{invoice.amount.toLocaleString()}</td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(invoice.status)}`}>{invoice.status}</span>
                </td>
                <td className="p-4 text-neutral-400 text-sm">{invoice.date}</td>
                <td className="p-4">
                  <button className="p-2 hover:bg-neutral-800 rounded-lg transition-colors text-neutral-400 hover:text-white"><Download className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
