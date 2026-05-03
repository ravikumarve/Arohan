'use client';

import { useState } from 'react';
import { Button } from '@arohan/shared/components/ui/Button';
import { Card } from '@arohan/shared/components/ui/Card';
import { Input } from '@arohan/shared/components/ui/Input';
import { Select } from '@arohan/shared/components/ui/Select';
import { Badge } from '@arohan/shared/components/ui/Badge';
import { Table } from '@arohan/shared/components/ui/Table';
import { Modal } from '@arohan/shared/components/ui/Modal';
import { LoadingSpinner } from '@arohan/shared/components/ui/LoadingSpinner';
import { EmptyState } from '@arohan/shared/components/ui/EmptyState';
import {
  Plus,
  Search,
  Filter,
  Download,
  RefreshCw,
  MoreVertical,
  Play,
  Pause,
  CheckCircle,
  Clock,
  AlertCircle,
  Edit,
  Trash2,
  Users,
  Phone,
  Calendar,
  DollarSign,
  TrendingUp,
} from 'lucide-react';

// Mock data - will be replaced with real API calls
const mockCampaigns = [
  {
    id: '1',
    name: 'Delivery Partner Hiring - Mumbai',
    type: 'Bulk Hiring',
    status: 'active',
    targetRole: 'Delivery Partner',
    targetCount: 100,
    screenedCount: 67,
    shortlistedCount: 45,
    budget: 1800,
    spent: 1206,
    startDate: '2025-04-15',
    endDate: '2025-05-15',
    createdAt: '2025-04-10',
  },
  {
    id: '2',
    name: 'Warehouse Staff - Delhi',
    type: 'Targeted',
    status: 'active',
    targetRole: 'Warehouse Associate',
    targetCount: 50,
    screenedCount: 38,
    shortlistedCount: 22,
    budget: 900,
    spent: 630,
    startDate: '2025-04-20',
    endDate: '2025-05-20',
    createdAt: '2025-04-15',
  },
  {
    id: '3',
    name: 'Retail Staff - Bangalore',
    type: 'Bulk Hiring',
    status: 'paused',
    targetRole: 'Retail Staff',
    targetCount: 75,
    screenedCount: 42,
    shortlistedCount: 28,
    budget: 1350,
    spent: 756,
    startDate: '2025-04-01',
    endDate: '2025-05-01',
    createdAt: '2025-03-28',
  },
  {
    id: '4',
    name: 'Customer Support - Hyderabad',
    type: 'Targeted',
    status: 'completed',
    targetRole: 'Customer Support',
    targetCount: 30,
    screenedCount: 30,
    shortlistedCount: 25,
    budget: 540,
    spent: 540,
    startDate: '2025-03-15',
    endDate: '2025-04-15',
    createdAt: '2025-03-10',
  },
  {
    id: '5',
    name: 'Field Sales - Chennai',
    type: 'Referral',
    status: 'draft',
    targetRole: 'Field Sales',
    targetCount: 40,
    screenedCount: 0,
    shortlistedCount: 0,
    budget: 720,
    spent: 0,
    startDate: '2025-05-10',
    endDate: '2025-06-10',
    createdAt: '2025-05-01',
  },
];

export default function RecruiterCampaignsPage() {
  const [campaigns, setCampaigns] = useState(mockCampaigns);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter campaigns
  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch =
      campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.targetRole.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    const matchesType = typeFilter === 'all' || campaign.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  // Pagination
  const totalPages = Math.ceil(filteredCampaigns.length / itemsPerPage);
  const paginatedCampaigns = filteredCampaigns.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Statistics
  const stats = {
    total: campaigns.length,
    active: campaigns.filter((c) => c.status === 'active').length,
    totalCandidates: campaigns.reduce((sum, c) => sum + c.screenedCount, 0),
    totalBudget: campaigns.reduce((sum, c) => sum + c.budget, 0),
  };

  // Handlers
  const handleRefresh = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
  };

  const handleCreateCampaign = (campaignData: any) => {
    const newCampaign = {
      ...campaignData,
      id: String(campaigns.length + 1),
      screenedCount: 0,
      shortlistedCount: 0,
      spent: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setCampaigns([...campaigns, newCampaign]);
    setShowCreateModal(false);
  };

  const handleEditCampaign = (campaignData: any) => {
    setCampaigns(
      campaigns.map((c) => (c.id === selectedCampaign.id ? { ...c, ...campaignData } : c))
    );
    setShowEditModal(false);
    setSelectedCampaign(null);
  };

  const handleDeleteCampaign = () => {
    setCampaigns(campaigns.filter((c) => c.id !== campaignToDelete.id));
    setShowDeleteModal(false);
    setCampaignToDelete(null);
  };

  const handleStatusChange = (campaignId: string, newStatus: string) => {
    setCampaigns(
      campaigns.map((c) => (c.id === campaignId ? { ...c, status: newStatus } : c))
    );
  };

  // Status badge colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-recruiter-success/20 text-recruiter-success border-recruiter-success/30';
      case 'paused':
        return 'bg-recruiter-warning/20 text-recruiter-warning border-recruiter-warning/30';
      case 'completed':
        return 'bg-recruiter-info/20 text-recruiter-info border-recruiter-info/30';
      case 'draft':
        return 'bg-recruiter-primary/20 text-recruiter-primary border-recruiter-primary/30';
      default:
        return 'bg-recruiter-background-tertiary text-recruiter-primary-light';
    }
  };

  // Type badge colors
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Bulk Hiring':
        return 'bg-recruiter-primary/20 text-recruiter-primary border-recruiter-primary/30';
      case 'Targeted':
        return 'bg-recruiter-info/20 text-recruiter-info border-recruiter-info/30';
      case 'Referral':
        return 'bg-recruiter-success/20 text-recruiter-success border-recruiter-success/30';
      default:
        return 'bg-recruiter-background-tertiary text-recruiter-primary-light';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Campaigns</h1>
          <p className="text-recruiter-primary-light">
            Manage your hiring campaigns and track progress
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="border-recruiter-background-tertiary text-recruiter-primary-light hover:text-white hover:bg-recruiter-background-tertiary"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={loading}
            className="border-recruiter-background-tertiary text-recruiter-primary-light hover:text-white hover:bg-recruiter-background-tertiary"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-recruiter-primary hover:bg-recruiter-primary-light text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Campaign
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Campaigns"
          value={stats.total}
          icon={<TrendingUp className="w-5 h-5" />}
          color="recruiter-primary"
        />
        <StatCard
          title="Active Campaigns"
          value={stats.active}
          icon={<Play className="w-5 h-5" />}
          color="recruiter-success"
        />
        <StatCard
          title="Total Screened"
          value={stats.totalCandidates}
          icon={<Users className="w-5 h-5" />}
          color="recruiter-info"
        />
        <StatCard
          title="Total Budget"
          value={`₹${stats.totalBudget}`}
          icon={<DollarSign className="w-5 h-5" />}
          color="recruiter-warning"
        />
      </div>

      {/* Filters */}
      {showFilters && (
        <Card className="bg-recruiter-background-secondary border-recruiter-background-tertiary p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-recruiter-primary-light mb-2">
                Status
              </label>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-recruiter-background-tertiary border-recruiter-background-tertiary text-white"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed</option>
                <option value="draft">Draft</option>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-recruiter-primary-light mb-2">
                Type
              </label>
              <Select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-recruiter-background-tertiary border-recruiter-background-tertiary text-white"
              >
                <option value="all">All Types</option>
                <option value="Bulk Hiring">Bulk Hiring</option>
                <option value="Targeted">Targeted</option>
                <option value="Referral">Referral</option>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-recruiter-primary-light mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-recruiter-primary-light" />
                <Input
                  type="text"
                  placeholder="Search campaigns..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-recruiter-background-tertiary border-recruiter-background-tertiary text-white placeholder-recruiter-primary-light"
                />
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Campaigns Table */}
      <Card className="bg-recruiter-background-secondary border-recruiter-background-tertiary overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : paginatedCampaigns.length === 0 ? (
          <EmptyState
            icon={<Megaphone className="w-12 h-12" />}
            title="No campaigns found"
            description={
              searchQuery || statusFilter !== 'all' || typeFilter !== 'all'
                ? 'Try adjusting your filters or search query'
                : 'Get started by creating your first campaign'
            }
            action={
              !searchQuery && statusFilter === 'all' && typeFilter === 'all' ? (
                <Button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-recruiter-primary hover:bg-recruiter-primary-light text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Campaign
                </Button>
              ) : undefined
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <thead>
                <tr className="border-b border-recruiter-background-tertiary">
                  <th className="text-left px-6 py-4 text-sm font-semibold text-recruiter-primary-light">
                    Campaign
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-recruiter-primary-light">
                    Type
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-recruiter-primary-light">
                    Status
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-recruiter-primary-light">
                    Progress
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-recruiter-primary-light">
                    Budget
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-recruiter-primary-light">
                    Duration
                  </th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-recruiter-primary-light">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedCampaigns.map((campaign) => (
                  <tr
                    key={campaign.id}
                    className="border-b border-recruiter-background-tertiary hover:bg-recruiter-background-tertiary/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white font-medium">{campaign.name}</p>
                        <p className="text-recruiter-primary-light text-sm">{campaign.targetRole}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={getTypeColor(campaign.type)}>{campaign.type}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={getStatusColor(campaign.status)}>
                        {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="w-4 h-4 text-recruiter-primary-light" />
                          <span className="text-white">
                            {campaign.screenedCount} / {campaign.targetCount}
                          </span>
                        </div>
                        <div className="w-full bg-recruiter-background-tertiary rounded-full h-2">
                          <div
                            className="bg-recruiter-primary h-2 rounded-full transition-all"
                            style={{
                              width: `${(campaign.screenedCount / campaign.targetCount) * 100}%`,
                            }}
                          />
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-recruiter-success" />
                          <span className="text-recruiter-success">{campaign.shortlistedCount} shortlisted</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <DollarSign className="w-4 h-4 text-recruiter-primary-light" />
                          <span className="text-white">₹{campaign.spent} / ₹{campaign.budget}</span>
                        </div>
                        <div className="w-full bg-recruiter-background-tertiary rounded-full h-2">
                          <div
                            className="bg-recruiter-warning h-2 rounded-full transition-all"
                            style={{ width: `${(campaign.spent / campaign.budget) * 100}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-recruiter-primary-light" />
                          <span className="text-white">{campaign.startDate}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-recruiter-primary-light" />
                          <span className="text-recruiter-primary-light">{campaign.endDate}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {campaign.status === 'active' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusChange(campaign.id, 'paused')}
                            className="border-recruiter-warning/30 text-recruiter-warning hover:bg-recruiter-warning/10"
                          >
                            <Pause className="w-4 h-4" />
                          </Button>
                        )}
                        {campaign.status === 'paused' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusChange(campaign.id, 'active')}
                            className="border-recruiter-success/30 text-recruiter-success hover:bg-recruiter-success/10"
                          >
                            <Play className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedCampaign(campaign);
                            setShowEditModal(true);
                          }}
                          className="border-recruiter-background-tertiary text-recruiter-primary-light hover:text-white hover:bg-recruiter-background-tertiary"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setCampaignToDelete(campaign);
                            setShowDeleteModal(true);
                          }}
                          className="border-recruiter-danger/30 text-recruiter-danger hover:bg-recruiter-danger/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}

        {/* Pagination */}
        {paginatedCampaigns.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-recruiter-background-tertiary">
            <p className="text-sm text-recruiter-primary-light">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, filteredCampaigns.length)} of{' '}
              {filteredCampaigns.length} campaigns
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="border-recruiter-background-tertiary text-recruiter-primary-light hover:text-white hover:bg-recruiter-background-tertiary"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="border-recruiter-background-tertiary text-recruiter-primary-light hover:text-white hover:bg-recruiter-background-tertiary"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Create Campaign Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Campaign"
        className="bg-recruiter-background-secondary border-recruiter-background-tertiary"
      >
        <CampaignForm onSubmit={handleCreateCampaign} onCancel={() => setShowCreateModal(false)} />
      </Modal>

      {/* Edit Campaign Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedCampaign(null);
        }}
        title="Edit Campaign"
        className="bg-recruiter-background-secondary border-recruiter-background-tertiary"
      >
        <CampaignForm
          campaign={selectedCampaign}
          onSubmit={handleEditCampaign}
          onCancel={() => {
            setShowEditModal(false);
            setSelectedCampaign(null);
          }}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setCampaignToDelete(null);
        }}
        title="Delete Campaign"
        className="bg-recruiter-background-secondary border-recruiter-background-tertiary"
      >
        <div className="space-y-4">
          <p className="text-recruiter-primary-light">
            Are you sure you want to delete the campaign "{campaignToDelete?.name}"? This action cannot be
            undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteModal(false);
                setCampaignToDelete(null);
              }}
              className="border-recruiter-background-tertiary text-recruiter-primary-light hover:text-white hover:bg-recruiter-background-tertiary"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteCampaign}
              className="bg-recruiter-danger hover:bg-recruiter-danger/90 text-white"
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// Stat Card Component
function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}) {
  const colorClasses = {
    'recruiter-primary': 'bg-recruiter-primary/20 text-recruiter-primary',
    'recruiter-success': 'bg-recruiter-success/20 text-recruiter-success',
    'recruiter-info': 'bg-recruiter-info/20 text-recruiter-info',
    'recruiter-warning': 'bg-recruiter-warning/20 text-recruiter-warning',
  };

  return (
    <Card className="bg-recruiter-background-secondary border-recruiter-background-tertiary p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-recruiter-primary-light mb-1">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
          {icon}
        </div>
      </div>
    </Card>
  );
}

// Campaign Form Component
function CampaignForm({
  campaign,
  onSubmit,
  onCancel,
}: {
  campaign?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState(
    campaign || {
      name: '',
      type: 'Bulk Hiring',
      targetRole: '',
      targetCount: '',
      budget: '',
      startDate: '',
      endDate: '',
      status: 'draft',
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      targetCount: parseInt(formData.targetCount),
      budget: parseInt(formData.budget),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-recruiter-primary-light mb-2">
          Campaign Name
        </label>
        <Input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Delivery Partner Hiring - Mumbai"
          required
          className="bg-recruiter-background-tertiary border-recruiter-background-tertiary text-white placeholder-recruiter-primary-light"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-recruiter-primary-light mb-2">
            Type
          </label>
          <Select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="bg-recruiter-background-tertiary border-recruiter-background-tertiary text-white"
          >
            <option value="Bulk Hiring">Bulk Hiring</option>
            <option value="Targeted">Targeted</option>
            <option value="Referral">Referral</option>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-recruiter-primary-light mb-2">
            Target Role
          </label>
          <Input
            type="text"
            value={formData.targetRole}
            onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
            placeholder="e.g., Delivery Partner"
            required
            className="bg-recruiter-background-tertiary border-recruiter-background-tertiary text-white placeholder-recruiter-primary-light"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-recruiter-primary-light mb-2">
            Target Count
          </label>
          <Input
            type="number"
            value={formData.targetCount}
            onChange={(e) => setFormData({ ...formData, targetCount: e.target.value })}
            placeholder="e.g., 100"
            required
            min="1"
            className="bg-recruiter-background-tertiary border-recruiter-background-tertiary text-white placeholder-recruiter-primary-light"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-recruiter-primary-light mb-2">
            Budget (₹)
          </label>
          <Input
            type="number"
            value={formData.budget}
            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
            placeholder="e.g., 1800"
            required
            min="1"
            className="bg-recruiter-background-tertiary border-recruiter-background-tertiary text-white placeholder-recruiter-primary-light"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-recruiter-primary-light mb-2">
            Start Date
          </label>
          <Input
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            required
            className="bg-recruiter-background-tertiary border-recruiter-background-tertiary text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-recruiter-primary-light mb-2">
            End Date
          </label>
          <Input
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            required
            className="bg-recruiter-background-tertiary border-recruiter-background-tertiary text-white"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="border-recruiter-background-tertiary text-recruiter-primary-light hover:text-white hover:bg-recruiter-background-tertiary"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-recruiter-primary hover:bg-recruiter-primary-light text-white"
        >
          {campaign ? 'Update Campaign' : 'Create Campaign'}
        </Button>
      </div>
    </form>
  );
}
