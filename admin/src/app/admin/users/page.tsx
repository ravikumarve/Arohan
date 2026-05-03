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
  Shield,
  Mail,
  Phone,
  Calendar,
  Download,
  RefreshCw
} from 'lucide-react';

export default function UsersManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - replace with real API call
  const users = [
    {
      id: '1',
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@example.com',
      phone: '+91 98765 43210',
      role: 'RECRUITER',
      company: 'LogisticsPro Ltd',
      status: 'active',
      lastActive: '2 hours ago',
      createdAt: '2024-01-15',
    },
    {
      id: '2',
      name: 'Priya Sharma',
      email: 'priya.sharma@example.com',
      phone: '+91 87654 32109',
      role: 'ADMIN',
      company: 'AROHAN Platform',
      status: 'active',
      lastActive: '5 minutes ago',
      createdAt: '2024-01-10',
    },
    {
      id: '3',
      name: 'Amit Patel',
      email: 'amit.patel@example.com',
      phone: '+91 76543 21098',
      role: 'RECRUITER',
      company: 'RetailMax Inc',
      status: 'inactive',
      lastActive: '3 days ago',
      createdAt: '2024-02-01',
    },
    {
      id: '4',
      name: 'Sneha Reddy',
      email: 'sneha.reddy@example.com',
      phone: '+91 65432 10987',
      role: 'VIEWER',
      company: 'LogisticsPro Ltd',
      status: 'active',
      lastActive: '1 hour ago',
      createdAt: '2024-02-15',
    },
    {
      id: '5',
      name: 'Vikram Singh',
      email: 'vikram.singh@example.com',
      phone: '+91 54321 09876',
      role: 'RECRUITER',
      company: 'Warehouse Solutions',
      status: 'active',
      lastActive: '30 minutes ago',
      createdAt: '2024-03-01',
    },
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery);
    
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleExport = () => {
    // Implement export functionality
    console.log('Exporting users...');
  };

  const handleDeleteUser = (userId: string) => {
    // Implement delete functionality
    console.log('Deleting user:', userId);
  };

  const handleEditUser = (userId: string) => {
    // Implement edit functionality
    console.log('Editing user:', userId);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-900/50 text-red-400 border-red-700';
      case 'RECRUITER':
        return 'bg-blue-900/50 text-blue-400 border-blue-700';
      case 'VIEWER':
        return 'bg-gray-900/50 text-gray-400 border-gray-700';
      default:
        return 'bg-gray-900/50 text-gray-400 border-gray-700';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-900/50 text-green-400 border-green-700';
      case 'inactive':
        return 'bg-yellow-900/50 text-yellow-400 border-yellow-700';
      case 'suspended':
        return 'bg-red-900/50 text-red-400 border-red-700';
      default:
        return 'bg-gray-900/50 text-gray-400 border-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Users Management</h1>
          <p className="text-admin-primary-light mt-1">
            Manage platform users and their permissions
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
            Add User
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value="1,247"
          change="+12%"
          trend="up"
          icon={Shield}
        />
        <StatCard
          title="Active Users"
          value="1,089"
          change="+8%"
          trend="up"
          icon={Mail}
        />
        <StatCard
          title="Admins"
          value="15"
          change="+2"
          trend="up"
          icon={Shield}
        />
        <StatCard
          title="Recruiters"
          value="1,143"
          change="+10"
          trend="up"
          icon={Phone}
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
                placeholder="Search users by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-admin-background-tertiary border border-admin-background-tertiary rounded-lg text-white placeholder-admin-primary-light focus:outline-none focus:border-admin-primary"
              />
            </div>
          </div>

          {/* Role Filter */}
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-4 py-2 bg-admin-background-tertiary border border-admin-background-tertiary rounded-lg text-white focus:outline-none focus:border-admin-primary"
          >
            <option value="all">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="RECRUITER">Recruiter</option>
            <option value="VIEWER">Viewer</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 bg-admin-background-tertiary border border-admin-background-tertiary rounded-lg text-white focus:outline-none focus:border-admin-primary"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
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
                  Company
                </label>
                <select className="w-full px-4 py-2 bg-admin-background-tertiary border border-admin-background-tertiary rounded-lg text-white focus:outline-none focus:border-admin-primary">
                  <option value="">All Companies</option>
                  <option value="logisticspro">LogisticsPro Ltd</option>
                  <option value="retailmax">RetailMax Inc</option>
                  <option value="warehouse">Warehouse Solutions</option>
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
                  Last Active
                </label>
                <select className="w-full px-4 py-2 bg-admin-background-tertiary border border-admin-background-tertiary rounded-lg text-white focus:outline-none focus:border-admin-primary">
                  <option value="">Any Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Users Table */}
      <div className="bg-admin-background-secondary rounded-lg border border-admin-background-tertiary overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-admin-background-tertiary">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-admin-primary-light uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-admin-primary-light uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-admin-primary-light uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-admin-primary-light uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-admin-primary-light uppercase tracking-wider">
                  Last Active
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-admin-primary-light uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-admin-primary-light uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-background-tertiary">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-admin-background-tertiary/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-admin-primary flex items-center justify-center text-white font-medium">
                          {user.name.charAt(0)}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">{user.name}</div>
                        <div className="text-sm text-admin-primary-light">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleBadgeColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-admin-primary-light">
                    {user.company}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-admin-primary-light">
                    {user.lastActive}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-admin-primary-light">
                    {user.createdAt}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEditUser(user.id)}
                        className="text-admin-primary-light hover:text-white transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
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
            <span className="font-medium text-white">{filteredUsers.length}</span> of{' '}
            <span className="font-medium text-white">{users.length}</span> results
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

      {/* Create User Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsCreateModalOpen(false)}
          />
          <div className="relative bg-admin-background-secondary border border-admin-background-tertiary rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-admin-background-tertiary">
              <h2 className="text-xl font-semibold text-white">Add New User</h2>
            </div>
            <div className="p-6">
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 bg-admin-background-tertiary border border-admin-background-tertiary rounded-lg text-white focus:outline-none focus:border-admin-primary"
                      placeholder="Enter full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-2 bg-admin-background-tertiary border border-admin-background-tertiary rounded-lg text-white focus:outline-none focus:border-admin-primary"
                      placeholder="Enter email address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      className="w-full px-4 py-2 bg-admin-background-tertiary border border-admin-background-tertiary rounded-lg text-white focus:outline-none focus:border-admin-primary"
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Role
                    </label>
                    <select className="w-full px-4 py-2 bg-admin-background-tertiary border border-admin-background-tertiary rounded-lg text-white focus:outline-none focus:border-admin-primary">
                      <option value="">Select role</option>
                      <option value="ADMIN">Admin</option>
                      <option value="RECRUITER">Recruiter</option>
                      <option value="VIEWER">Viewer</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Company
                    </label>
                    <select className="w-full px-4 py-2 bg-admin-background-tertiary border border-admin-background-tertiary rounded-lg text-white focus:outline-none focus:border-admin-primary">
                      <option value="">Select company</option>
                      <option value="logisticspro">LogisticsPro Ltd</option>
                      <option value="retailmax">RetailMax Inc</option>
                      <option value="warehouse">Warehouse Solutions</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Status
                    </label>
                    <select className="w-full px-4 py-2 bg-admin-background-tertiary border border-admin-background-tertiary rounded-lg text-white focus:outline-none focus:border-admin-primary">
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="suspended">Suspended</option>
                    </select>
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
                Create User
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
