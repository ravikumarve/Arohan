'use client';

import { useState } from 'react';
import { Button } from '@arohan/shared';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Building2,
  Users,
  CreditCard,
  TrendingUp,
  Download,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';

export default function CompaniesManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - replace with real API call
  const companies = [
    {
      id: '1',
      name: 'LogisticsPro Ltd',
      domain: 'logisticspro.com',
      plan: 'growth',
      status: 'active',
      users: 45,
      campaigns: 12,
      screenings: 1250,
      revenue: 45000,
      createdAt: '2024-01-15',
      nextBilling: '2024-06-15',
    },
    {
      id: '2',
      name: 'RetailMax Inc',
      domain: 'retailmax.com',
      plan: 'enterprise',
      status: 'active',
      users: 120,
      campaigns: 35,
      screenings: 5600,
      revenue: 120000,
      createdAt: '2024-02-01',
      nextBilling: '2024-06-01',
    },
    {
      id: '3',
      name: 'Warehouse Solutions',
      domain: 'warehouse.com',
      plan: 'startup',
      status: 'trial',
      users: 8,
      campaigns: 3,
      screenings: 150,
      revenue: 0,
      createdAt: '2024-05-01',
      nextBilling: '2024-06-01',
    },
    {
      id: '4',
      name: 'Delivery Partners Co',
      domain: 'delivery.com',
      plan: 'growth',
      status: 'suspended',
      users: 25,
      campaigns: 8,
      screenings: 890,
      revenue: 28000,
      createdAt: '2024-03-15',
      nextBilling: '2024-05-15',
    },
    {
      id: '5',
      name: 'QuickHire Services',
      domain: 'quickhire.com',
      plan: 'startup',
      status: 'active',
      users: 12,
      campaigns: 5,
      screenings: 320,
      revenue: 9000,
      createdAt: '2024-04-01',
      nextBilling: '2024-07-01',
    },
  ];

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = 
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.domain.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesPlan = selectedPlan === 'all' || company.plan === selectedPlan;
    const matchesStatus = selectedStatus === 'all' || company.status === selectedStatus;
    
    return matchesSearch && matchesPlan && matchesStatus;
  });

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleExport = () => {
    console.log('Exporting companies...');
  };

  const handleDeleteCompany = (companyId: string) => {
    console.log('Deleting company:', companyId);
  };

  const handleEditCompany = (companyId: string) => {
    console.log('Editing company:', companyId);
  };

  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case 'startup':
        return 'bg-blue-900/50 text-blue-400 border-blue-700';
      case 'growth':
        return 'bg-purple-900/50 text-purple-400 border-purple-700';
      case 'enterprise':
        return 'bg-amber-900/50 text-amber-400 border-amber-700';
      default:
        return 'bg-gray-900/50 text-gray-400 border-gray-700';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-900/50 text-green-400 border-green-700';
      case 'trial':
        return 'bg-blue-900/50 text-blue-400 border-blue-700';
      case 'suspended':
        return 'bg-red-900/50 text-red-400 border-red-700';
      case 'cancelled':
        return 'bg-gray-900/50 text-gray-400 border-gray-700';
      default:
        return 'bg-gray-900/50 text-gray-400 border-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4" />;
      case 'trial':
        return <Clock className="w-4 h-4" />;
      case 'suspended':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Companies Management</h1>
          <p className="text-admin-primary-light mt-1">
            Manage platform companies and their subscriptions
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant="outline"
            onClick={handleExport}
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Company
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Companies"
          value="89"
          change="+8%"
          trend="up"
          icon={Building2}
        />
        <StatCard
          title="Active Companies"
          value="75"
          change="+12%"
          trend="up"
          icon={CheckCircle}
        />
        <StatCard
          title="Total Users"
          value="1,247"
          change="+15%"
          trend="up"
          icon={Users}
        />
        <StatCard
          title="Monthly Revenue"
          value="₹4.5L"
          change="+18%"
          trend="up"
          icon={CreditCard}
        />
      </div>

      {/* Filters */}
      <div className="bg-admin-background-secondary rounded-lg p-4 border border-admin-background-tertiary">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-admin-primary-light" />
              <input
                type="text"
                placeholder="Search companies by name or domain..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-admin-background-tertiary border border-admin-background-tertiary rounded-lg text-white placeholder-admin-primary-light focus:outline-none focus:border-admin-primary"
              />
            </div>
          </div>

          {/* Plan Filter */}
          <select
            value={selectedPlan}
            onChange={(e) => setSelectedPlan(e.target.value)}
            className="px-4 py-2 bg-admin-background-tertiary border border-admin-background-tertiary rounded-lg text-white focus:outline-none focus:border-admin-primary"
          >
            <option value="all">All Plans</option>
            <option value="startup">Startup</option>
            <option value="growth">Growth</option>
            <option value="enterprise">Enterprise</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 bg-admin-background-tertiary border border-admin-background-tertiary rounded-lg text-white focus:outline-none focus:border-admin-primary"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="trial">Trial</option>
            <option value="suspended">Suspended</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Advanced Filter Toggle */}
          <Button
            variant="outline"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Advanced Filters
          </Button>
        </div>

        {/* Advanced Filters */}
        {isFilterOpen && (
          <div className="mt-4 pt-4 border-t border-admin-background-tertiary">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-admin-primary-light mb-2">
                  User Count Range
                </label>
                <select className="w-full px-4 py-2 bg-admin-background-tertiary border border-admin-background-tertiary rounded-lg text-white focus:outline-none focus:border-admin-primary">
                  <option value="">Any</option>
                  <option value="1-10">1-10 users</option>
                  <option value="11-50">11-50 users</option>
                  <option value="51-100">51-100 users</option>
                  <option value="100+">100+ users</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-admin-primary-light mb-2">
                  Created Date
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2 bg-admin-background-tertiary border border-admin-background-tertiary rounded-lg text-white focus:outline-none focus:border-admin-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-admin-primary-light mb-2">
                  Next Billing
                </label>
                <select className="w-full px-4 py-2 bg-admin-background-tertiary border border-admin-background-tertiary rounded-lg text-white focus:outline-none focus:border-admin-primary">
                  <option value="">Any Time</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="quarter">This Quarter</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Companies Table */}
      <div className="bg-admin-background-secondary rounded-lg border border-admin-background-tertiary overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-admin-background-tertiary">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-admin-primary-light uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-admin-primary-light uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-admin-primary-light uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-admin-primary-light uppercase tracking-wider">
                  Users
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-admin-primary-light uppercase tracking-wider">
                  Screenings
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-admin-primary-light uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-admin-primary-light uppercase tracking-wider">
                  Next Billing
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-admin-primary-light uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-background-tertiary">
              {filteredCompanies.map((company) => (
                <tr key={company.id} className="hover:bg-admin-background-tertiary/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-admin-primary to-admin-primary-light flex items-center justify-center text-white font-bold">
                          {company.name.charAt(0)}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">{company.name}</div>
                        <div className="text-sm text-admin-primary-light">{company.domain}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPlanBadgeColor(company.plan)}`}>
                      {company.plan.charAt(0).toUpperCase() + company.plan.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(company.status)}
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeColor(company.status)}`}>
                        {company.status.charAt(0).toUpperCase() + company.status.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-admin-primary-light">
                    {company.users}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-admin-primary-light">
                    {company.screenings.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">
                    ₹{(company.revenue / 1000).toFixed(1)}K
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-admin-primary-light">
                    {company.nextBilling}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEditCompany(company.id)}
                        className="text-admin-primary-light hover:text-white transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCompany(company.id)}
                        className="text-admin-danger hover:text-red-400 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="text-admin-primary-light hover:text-white transition-colors" title="More">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-admin-background-tertiary flex items-center justify-between">
          <div className="text-sm text-admin-primary-light">
            Showing <span className="font-medium text-white">1</span> to{' '}
            <span className="font-medium text-white">{filteredCompanies.length}</span> of{' '}
            <span className="font-medium text-white">{companies.length}</span> results
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Create Company Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsCreateModalOpen(false)}
          />
          <div className="relative bg-admin-background-secondary border border-admin-background-tertiary rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-admin-background-tertiary">
              <h2 className="text-xl font-semibold text-white">Add New Company</h2>
            </div>
            <div className="p-6">
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 bg-admin-background-tertiary border border-admin-background-tertiary rounded-lg text-white focus:outline-none focus:border-admin-primary"
                      placeholder="Enter company name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Domain
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 bg-admin-background-tertiary border border-admin-background-tertiary rounded-lg text-white focus:outline-none focus:border-admin-primary"
                      placeholder="example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Plan
                    </label>
                    <select className="w-full px-4 py-2 bg-admin-background-tertiary border border-admin-background-tertiary rounded-lg text-white focus:outline-none focus:border-admin-primary">
                      <option value="">Select plan</option>
                      <option value="startup">Startup (₹18/screening)</option>
                      <option value="growth">Growth (₹14/screening)</option>
                      <option value="enterprise">Enterprise (₹10/screening)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Status
                    </label>
                    <select className="w-full px-4 py-2 bg-admin-background-tertiary border border-admin-background-tertiary rounded-lg text-white focus:outline-none focus:border-admin-primary">
                      <option value="active">Active</option>
                      <option value="trial">Trial</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Admin Email
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-2 bg-admin-background-tertiary border border-admin-background-tertiary rounded-lg text-white focus:outline-none focus:border-admin-primary"
                      placeholder="admin@company.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Admin Phone
                    </label>
                    <input
                      type="tel"
                      className="w-full px-4 py-2 bg-admin-background-tertiary border border-admin-background-tertiary rounded-lg text-white focus:outline-none focus:border-admin-primary"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>
              </form>
            </div>
            <div className="p-6 border-t border-admin-background-tertiary flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setIsCreateModalOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={() => setIsCreateModalOpen(false)}>
                Create Company
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Stat Card Component
function StatCard({
  title,
  value,
  change,
  trend,
  icon: Icon,
}: {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: any;
}) {
  return (
    <div className="bg-admin-background-secondary rounded-lg p-6 border border-admin-background-tertiary">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-admin-primary-light">{title}</h3>
        <Icon className="w-5 h-5 text-admin-primary" />
      </div>
      <div className="text-2xl font-bold text-white mb-2">{value}</div>
      <div
        className={`text-sm ${
          trend === 'up' ? 'text-admin-success' : 'text-admin-danger'
        }`}
      >
        {trend === 'up' ? '↑' : '↓'} {change}
      </div>
    </div>
  );
}
