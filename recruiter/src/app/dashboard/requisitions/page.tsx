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
  MapPin,
  Calendar,
  Users,
  Briefcase,
  AlertCircle,
  CheckCircle,
  PauseCircle,
  Edit,
  Trash2,
  Target,
  Clock,
  TrendingUp,
  Building2,
  User,
  Navigation,
} from 'lucide-react';

// Mock data - will be replaced with real API calls
const mockRequisitions = [
  {
    id: '1',
    title: 'Delivery Partners - Mumbai Region',
    department: 'Operations',
    location: 'Mumbai, Maharashtra',
    pinCode: '400001',
    geoRadius: 25,
    priority: 'high',
    status: 'open',
    positions: 50,
    filled: 32,
    hiringManager: 'Rajesh Kumar',
    createdAt: '2025-04-15',
    deadline: '2025-05-30',
    description: 'Hiring delivery partners for Mumbai region with good local knowledge',
    requirements: [
      'Valid driving license',
      'Own vehicle (two-wheeler)',
      'Good communication skills',
      'Basic smartphone knowledge',
    ],
    salary: {
      min: 15000,
      max: 25000,
      currency: 'INR',
    },
  },
  {
    id: '2',
    title: 'Warehouse Associates - Delhi NCR',
    department: 'Logistics',
    location: 'Delhi, Delhi',
    pinCode: '110001',
    geoRadius: 30,
    priority: 'medium',
    status: 'open',
    positions: 30,
    filled: 18,
    hiringManager: 'Priya Sharma',
    createdAt: '2025-04-20',
    deadline: '2025-06-15',
    description: 'Warehouse staff for Delhi NCR distribution center',
    requirements: [
      'Physical fitness',
      'Willingness to work in shifts',
      'Basic computer literacy',
      'Team player',
    ],
    salary: {
      min: 12000,
      max: 18000,
      currency: 'INR',
    },
  },
  {
    id: '3',
    title: 'Retail Staff - Bangalore Outlets',
    department: 'Sales',
    location: 'Bangalore, Karnataka',
    pinCode: '560001',
    geoRadius: 15,
    priority: 'high',
    status: 'on-hold',
    positions: 25,
    filled: 15,
    hiringManager: 'Amit Patel',
    createdAt: '2025-04-01',
    deadline: '2025-05-15',
    description: 'Retail staff for Bangalore outlets with customer service experience',
    requirements: [
      'Customer service skills',
      'Sales experience',
      'Fluent in English and local language',
      'Presentable appearance',
    ],
    salary: {
      min: 18000,
      max: 28000,
      currency: 'INR',
    },
  },
  {
    id: '4',
    title: 'Customer Support - Hyderabad',
    department: 'Customer Service',
    location: 'Hyderabad, Telangana',
    pinCode: '500001',
    geoRadius: 20,
    priority: 'low',
    status: 'closed',
    positions: 20,
    filled: 20,
    hiringManager: 'Suresh Reddy',
    createdAt: '2025-03-15',
    deadline: '2025-04-30',
    description: 'Customer support executives for Hyderabad office',
    requirements: [
      'Excellent communication',
      'Problem-solving skills',
      'Patience and empathy',
      'Technical aptitude',
    ],
    salary: {
      min: 20000,
      max: 35000,
      currency: 'INR',
    },
  },
  {
    id: '5',
    title: 'Field Sales - Chennai',
    department: 'Sales',
    location: 'Chennai, Tamil Nadu',
    pinCode: '600001',
    geoRadius: 35,
    priority: 'medium',
    status: 'draft',
    positions: 40,
    filled: 0,
    hiringManager: 'Lakshmi Devi',
    createdAt: '2025-05-01',
    deadline: '2025-07-01',
    description: 'Field sales representatives for Chennai region',
    requirements: [
      'Sales experience',
      'Local market knowledge',
      'Self-motivated',
      'Good negotiation skills',
    ],
    salary: {
      min: 15000,
      max: 30000,
      currency: 'INR',
    },
  },
];

export default function RecruiterRequisitionsPage() {
  const [requisitions, setRequisitions] = useState(mockRequisitions);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRequisition, setSelectedRequisition] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [requisitionToDelete, setRequisitionToDelete] = useState<any>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter requisitions
  const filteredRequisitions = requisitions.filter((requisition) => {
    const matchesSearch =
      requisition.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      requisition.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      requisition.hiringManager.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || requisition.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || requisition.priority === priorityFilter;
    const matchesDepartment =
      departmentFilter === 'all' || requisition.department === departmentFilter;
    return matchesSearch && matchesStatus && matchesPriority && matchesDepartment;
  });

  // Pagination
  const totalPages = Math.ceil(filteredRequisitions.length / itemsPerPage);
  const paginatedRequisitions = filteredRequisitions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Statistics
  const stats = {
    total: requisitions.length,
    open: requisitions.filter((r) => r.status === 'open').length,
    filled: requisitions.filter((r) => r.filled === r.positions).length,
    onHold: requisitions.filter((r) => r.status === 'on-hold').length,
    totalPositions: requisitions.reduce((sum, r) => sum + r.positions, 0),
    filledPositions: requisitions.reduce((sum, r) => sum + r.filled, 0),
  };

  // Handlers
  const handleRefresh = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
  };

  const handleCreateRequisition = (requisitionData: any) => {
    const newRequisition = {
      ...requisitionData,
      id: String(requisitions.length + 1),
      filled: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setRequisitions([...requisitions, newRequisition]);
    setShowCreateModal(false);
  };

  const handleEditRequisition = (requisitionData: any) => {
    setRequisitions(
      requisitions.map((r) =>
        r.id === selectedRequisition.id ? { ...r, ...requisitionData } : r
      )
    );
    setShowEditModal(false);
    setSelectedRequisition(null);
  };

  const handleDeleteRequisition = () => {
    setRequisitions(requisitions.filter((r) => r.id !== requisitionToDelete.id));
    setShowDeleteModal(false);
    setRequisitionToDelete(null);
  };

  const handleStatusChange = (requisitionId: string, newStatus: string) => {
    setRequisitions(
      requisitions.map((r) => (r.id === requisitionId ? { ...r, status: newStatus } : r))
    );
  };

  const handleViewRequisition = (requisition: any) => {
    setSelectedRequisition(requisition);
    setShowViewModal(true);
  };

  // Status badge colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-recruiter-success/20 text-recruiter-success border-recruiter-success/30';
      case 'closed':
        return 'bg-recruiter-info/20 text-recruiter-info border-recruiter-info/30';
      case 'on-hold':
        return 'bg-recruiter-warning/20 text-recruiter-warning border-recruiter-warning/30';
      case 'draft':
        return 'bg-recruiter-primary/20 text-recruiter-primary border-recruiter-primary/30';
      default:
        return 'bg-recruiter-background-tertiary text-recruiter-primary-light';
    }
  };

  // Priority badge colors
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-recruiter-danger/20 text-recruiter-danger border-recruiter-danger/30';
      case 'medium':
        return 'bg-recruiter-warning/20 text-recruiter-warning border-recruiter-warning/30';
      case 'low':
        return 'bg-recruiter-info/20 text-recruiter-info border-recruiter-info/30';
      default:
        return 'bg-recruiter-background-tertiary text-recruiter-primary-light';
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Requisitions</h1>
          <p className="text-recruiter-primary-light">
            Manage job requisitions with geo-radius targeting
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
            variant="outline"
            className="border-recruiter-background-tertiary text-recruiter-primary-light hover:text-white hover:bg-recruiter-background-tertiary"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-recruiter-primary hover:bg-recruiter-primary-light text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Requisition
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Requisitions"
          value={stats.total}
          icon={<Briefcase className="w-5 h-5" />}
          color="recruiter-primary"
        />
        <StatCard
          title="Open Positions"
          value={stats.open}
          icon={<Target className="w-5 h-5" />}
          color="recruiter-success"
        />
        <StatCard
          title="Filled"
          value={stats.filled}
          icon={<CheckCircle className="w-5 h-5" />}
          color="recruiter-info"
        />
        <StatCard
          title="On Hold"
          value={stats.onHold}
          icon={<PauseCircle className="w-5 h-5" />}
          color="recruiter-warning"
        />
      </div>

      {/* Progress Overview */}
      <Card className="bg-recruiter-background-secondary border-recruiter-background-tertiary p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Hiring Progress</h3>
          <span className="text-recruiter-primary-light text-sm">
            {stats.filledPositions} / {stats.totalPositions} positions filled
          </span>
        </div>
        <div className="w-full bg-recruiter-background-tertiary rounded-full h-3">
          <div
            className="bg-gradient-to-r from-recruiter-primary to-recruiter-success h-3 rounded-full transition-all"
            style={{
              width: `${(stats.filledPositions / stats.totalPositions) * 100}%`,
            }}
          />
        </div>
      </Card>

      {/* Filters */}
      {showFilters && (
        <Card className="bg-recruiter-background-secondary border-recruiter-background-tertiary p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                <option value="open">Open</option>
                <option value="closed">Closed</option>
                <option value="on-hold">On Hold</option>
                <option value="draft">Draft</option>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-recruiter-primary-light mb-2">
                Priority
              </label>
              <Select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="bg-recruiter-background-tertiary border-recruiter-background-tertiary text-white"
              >
                <option value="all">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-recruiter-primary-light mb-2">
                Department
              </label>
              <Select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="bg-recruiter-background-tertiary border-recruiter-background-tertiary text-white"
              >
                <option value="all">All Departments</option>
                <option value="Operations">Operations</option>
                <option value="Logistics">Logistics</option>
                <option value="Sales">Sales</option>
                <option value="Customer Service">Customer Service</option>
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
                  placeholder="Search requisitions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-recruiter-background-tertiary border-recruiter-background-tertiary text-white placeholder-recruiter-primary-light"
                />
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Requisitions Table */}
      <Card className="bg-recruiter-background-secondary border-recruiter-background-tertiary overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : paginatedRequisitions.length === 0 ? (
          <EmptyState
            icon={<Briefcase className="w-12 h-12" />}
            title="No requisitions found"
            description={
              searchQuery ||
              statusFilter !== 'all' ||
              priorityFilter !== 'all' ||
              departmentFilter !== 'all'
                ? 'Try adjusting your filters or search query'
                : 'Get started by creating your first requisition'
            }
            action={
              !searchQuery &&
              statusFilter === 'all' &&
              priorityFilter === 'all' &&
              departmentFilter === 'all' ? (
                <Button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-recruiter-primary hover:bg-recruiter-primary-light text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Requisition
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
                    Requisition
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-recruiter-primary-light">
                    Department
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-recruiter-primary-light">
                    Priority
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-recruiter-primary-light">
                    Status
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-recruiter-primary-light">
                    Progress
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-recruiter-primary-light">
                    Location
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-recruiter-primary-light">
                    Deadline
                  </th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-recruiter-primary-light">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedRequisitions.map((requisition) => (
                  <tr
                    key={requisition.id}
                    className="border-b border-recruiter-background-tertiary hover:bg-recruiter-background-tertiary/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white font-medium">{requisition.title}</p>
                        <p className="text-recruiter-primary-light text-sm">
                          {requisition.hiringManager}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-recruiter-primary-light" />
                        <span className="text-white">{requisition.department}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={getPriorityColor(requisition.priority)}>
                        {requisition.priority.charAt(0).toUpperCase() + requisition.priority.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={getStatusColor(requisition.status)}>
                        {requisition.status === 'on-hold'
                          ? 'On Hold'
                          : requisition.status.charAt(0).toUpperCase() + requisition.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-white">
                            {requisition.filled} / {requisition.positions}
                          </span>
                          <span className="text-recruiter-primary-light">
                            {Math.round((requisition.filled / requisition.positions) * 100)}%
                          </span>
                        </div>
                        <div className="w-full bg-recruiter-background-tertiary rounded-full h-2">
                          <div
                            className="bg-recruiter-primary h-2 rounded-full transition-all"
                            style={{
                              width: `${(requisition.filled / requisition.positions) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-recruiter-primary-light" />
                          <span className="text-white">{requisition.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Navigation className="w-4 h-4 text-recruiter-primary-light" />
                          <span className="text-recruiter-primary-light">
                            {requisition.geoRadius} km radius
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-recruiter-primary-light" />
                        <span className="text-white">{formatDate(requisition.deadline)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewRequisition(requisition)}
                          className="border-recruiter-background-tertiary text-recruiter-primary-light hover:text-white hover:bg-recruiter-background-tertiary"
                        >
                          <Target className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedRequisition(requisition);
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
                            setRequisitionToDelete(requisition);
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
        {paginatedRequisitions.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-recruiter-background-tertiary">
            <p className="text-sm text-recruiter-primary-light">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, filteredRequisitions.length)} of{' '}
              {filteredRequisitions.length} requisitions
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

      {/* Create Requisition Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Requisition"
        className="bg-recruiter-background-secondary border-recruiter-background-tertiary max-w-4xl"
      >
        <RequisitionForm onSubmit={handleCreateRequisition} onCancel={() => setShowCreateModal(false)} />
      </Modal>

      {/* Edit Requisition Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedRequisition(null);
        }}
        title="Edit Requisition"
        className="bg-recruiter-background-secondary border-recruiter-background-tertiary max-w-4xl"
      >
        <RequisitionForm
          requisition={selectedRequisition}
          onSubmit={handleEditRequisition}
          onCancel={() => {
            setShowEditModal(false);
            setSelectedRequisition(null);
          }}
        />
      </Modal>

      {/* View Requisition Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedRequisition(null);
        }}
        title="Requisition Details"
        className="bg-recruiter-background-secondary border-recruiter-background-tertiary max-w-4xl"
      >
        {selectedRequisition && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">{selectedRequisition.title}</h3>
                <div className="flex flex-wrap gap-3">
                  <Badge className={getStatusColor(selectedRequisition.status)}>
                    {selectedRequisition.status === 'on-hold'
                      ? 'On Hold'
                      : selectedRequisition.status.charAt(0).toUpperCase() +
                        selectedRequisition.status.slice(1)}
                  </Badge>
                  <Badge className={getPriorityColor(selectedRequisition.priority)}>
                    {selectedRequisition.priority.charAt(0).toUpperCase() +
                      selectedRequisition.priority.slice(1)} Priority
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <p className="text-recruiter-primary-light text-sm mb-1">Progress</p>
                <p className="text-2xl font-bold text-white">
                  {selectedRequisition.filled} / {selectedRequisition.positions}
                </p>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailCard
                title="Basic Information"
                icon={<Briefcase className="w-5 h-5" />}
                details={[
                  { label: 'Department', value: selectedRequisition.department },
                  { label: 'Hiring Manager', value: selectedRequisition.hiringManager },
                  { label: 'Created', value: formatDate(selectedRequisition.createdAt) },
                  { label: 'Deadline', value: formatDate(selectedRequisition.deadline) },
                ]}
              />
              <DetailCard
                title="Location & Geo-Radius"
                icon={<MapPin className="w-5 h-5" />}
                details={[
                  { label: 'Location', value: selectedRequisition.location },
                  { label: 'Pin Code', value: selectedRequisition.pinCode },
                  { label: 'Geo-Radius', value: `${selectedRequisition.geoRadius} km` },
                  { label: 'Coverage Area', value: 'Local candidates only' },
                ]}
              />
            </div>

            {/* Salary Information */}
            <Card className="bg-recruiter-background-tertiary border-recruiter-background-tertiary p-4">
              <h4 className="text-lg font-semibold text-white mb-3">Salary Range</h4>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <p className="text-recruiter-primary-light text-sm mb-1">Minimum</p>
                  <p className="text-xl font-bold text-white">
                    ₹{selectedRequisition.salary.min.toLocaleString()}
                  </p>
                </div>
                <div className="text-recruiter-primary-light">to</div>
                <div className="flex-1">
                  <p className="text-recruiter-primary-light text-sm mb-1">Maximum</p>
                  <p className="text-xl font-bold text-white">
                    ₹{selectedRequisition.salary.max.toLocaleString()}
                  </p>
                </div>
                <div className="text-recruiter-primary-light">per month</div>
              </div>
            </Card>

            {/* Requirements */}
            <Card className="bg-recruiter-background-tertiary border-recruiter-background-tertiary p-4">
              <h4 className="text-lg font-semibold text-white mb-3">Requirements</h4>
              <ul className="space-y-2">
                {selectedRequisition.requirements.map((req: string, index: number) => (
                  <li key={index} className="flex items-start gap-2 text-recruiter-primary-light">
                    <CheckCircle className="w-4 h-4 text-recruiter-success mt-0.5 flex-shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Description */}
            <Card className="bg-recruiter-background-tertiary border-recruiter-background-tertiary p-4">
              <h4 className="text-lg font-semibold text-white mb-3">Description</h4>
              <p className="text-recruiter-primary-light">{selectedRequisition.description}</p>
            </Card>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedRequisition(null);
                }}
                className="border-recruiter-background-tertiary text-recruiter-primary-light hover:text-white hover:bg-recruiter-background-tertiary"
              >
                Close
              </Button>
              {selectedRequisition.status === 'open' && (
                <>
                  <Button
                    onClick={() => {
                      handleStatusChange(selectedRequisition.id, 'on-hold');
                      setShowViewModal(false);
                    }}
                    className="bg-recruiter-warning hover:bg-recruiter-warning/90 text-white"
                  >
                    <PauseCircle className="w-4 h-4 mr-2" />
                    Put on Hold
                  </Button>
                  <Button
                    onClick={() => {
                      handleStatusChange(selectedRequisition.id, 'closed');
                      setShowViewModal(false);
                    }}
                    className="bg-recruiter-info hover:bg-recruiter-info/90 text-white"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Close
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setRequisitionToDelete(null);
        }}
        title="Delete Requisition"
        className="bg-recruiter-background-secondary border-recruiter-background-tertiary"
      >
        <div className="space-y-4">
          <p className="text-recruiter-primary-light">
            Are you sure you want to delete the requisition "{requisitionToDelete?.title}"? This action
            cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteModal(false);
                setRequisitionToDelete(null);
              }}
              className="border-recruiter-background-tertiary text-recruiter-primary-light hover:text-white hover:bg-recruiter-background-tertiary"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteRequisition}
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
    'recruiter-danger': 'bg-recruiter-danger/20 text-recruiter-danger',
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

// Detail Card Component
function DetailCard({
  title,
  icon,
  details,
}: {
  title: string;
  icon: React.ReactNode;
  details: { label: string; value: string }[];
}) {
  return (
    <Card className="bg-recruiter-background-tertiary border-recruiter-background-tertiary p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-2 bg-recruiter-primary/20 rounded-lg text-recruiter-primary">{icon}</div>
        <h4 className="text-lg font-semibold text-white">{title}</h4>
      </div>
      <div className="space-y-2">
        {details.map((detail, index) => (
          <div key={index} className="flex justify-between text-sm">
            <span className="text-recruiter-primary-light">{detail.label}</span>
            <span className="text-white">{detail.value}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

// Requisition Form Component
function RequisitionForm({
  requisition,
  onSubmit,
  onCancel,
}: {
  requisition?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState(
    requisition || {
      title: '',
      department: 'Operations',
      location: '',
      pinCode: '',
      geoRadius: 25,
      priority: 'medium',
      status: 'draft',
      positions: '',
      hiringManager: '',
      deadline: '',
      description: '',
      requirements: '',
      salaryMin: '',
      salaryMax: '',
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      positions: parseInt(formData.positions),
      salary: {
        min: parseInt(formData.salaryMin),
        max: parseInt(formData.salaryMax),
        currency: 'INR',
      },
      requirements: formData.requirements.split('\n').filter((r: string) => r.trim()),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-white">Basic Information</h4>
        <div>
          <label className="block text-sm font-medium text-recruiter-primary-light mb-2">
            Requisition Title
          </label>
          <Input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g., Delivery Partners - Mumbai Region"
            required
            className="bg-recruiter-background-tertiary border-recruiter-background-tertiary text-white placeholder-recruiter-primary-light"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-recruiter-primary-light mb-2">
              Department
            </label>
            <Select
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="bg-recruiter-background-tertiary border-recruiter-background-tertiary text-white"
            >
              <option value="Operations">Operations</option>
              <option value="Logistics">Logistics</option>
              <option value="Sales">Sales</option>
              <option value="Customer Service">Customer Service</option>
              <option value="IT">IT</option>
              <option value="HR">HR</option>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-recruiter-primary-light mb-2">
              Hiring Manager
            </label>
            <Input
              type="text"
              value={formData.hiringManager}
              onChange={(e) => setFormData({ ...formData, hiringManager: e.target.value })}
              placeholder="e.g., Rajesh Kumar"
              required
              className="bg-recruiter-background-tertiary border-recruiter-background-tertiary text-white placeholder-recruiter-primary-light"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-recruiter-primary-light mb-2">
              Priority
            </label>
            <Select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="bg-recruiter-background-tertiary border-recruiter-background-tertiary text-white"
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-recruiter-primary-light mb-2">
              Number of Positions
            </label>
            <Input
              type="number"
              value={formData.positions}
              onChange={(e) => setFormData({ ...formData, positions: e.target.value })}
              placeholder="e.g., 50"
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
              value={formData.createdAt}
              onChange={(e) => setFormData({ ...formData, createdAt: e.target.value })}
              required
              className="bg-recruiter-background-tertiary border-recruiter-background-tertiary text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-recruiter-primary-light mb-2">
              Deadline
            </label>
            <Input
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              required
              className="bg-recruiter-background-tertiary border-recruiter-background-tertiary text-white"
            />
          </div>
        </div>
      </div>

      {/* Location & Geo-Radius */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-white">Location & Geo-Radius</h4>
        <div>
          <label className="block text-sm font-medium text-recruiter-primary-light mb-2">
            Location
          </label>
          <Input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="e.g., Mumbai, Maharashtra"
            required
            className="bg-recruiter-background-tertiary border-recruiter-background-tertiary text-white placeholder-recruiter-primary-light"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-recruiter-primary-light mb-2">
              Pin Code
            </label>
            <Input
              type="text"
              value={formData.pinCode}
              onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
              placeholder="e.g., 400001"
              required
              className="bg-recruiter-background-tertiary border-recruiter-background-tertiary text-white placeholder-recruiter-primary-light"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-recruiter-primary-light mb-2">
              Geo-Radius (km)
            </label>
            <Input
              type="number"
              value={formData.geoRadius}
              onChange={(e) => setFormData({ ...formData, geoRadius: e.target.value })}
              placeholder="e.g., 25"
              required
              min="1"
              max="100"
              className="bg-recruiter-background-tertiary border-recruiter-background-tertiary text-white placeholder-recruiter-primary-light"
            />
          </div>
        </div>
      </div>

      {/* Salary Information */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-white">Salary Information</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-recruiter-primary-light mb-2">
              Minimum Salary (₹)
            </label>
            <Input
              type="number"
              value={formData.salaryMin}
              onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value })}
              placeholder="e.g., 15000"
              required
              min="1"
              className="bg-recruiter-background-tertiary border-recruiter-background-tertiary text-white placeholder-recruiter-primary-light"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-recruiter-primary-light mb-2">
              Maximum Salary (₹)
            </label>
            <Input
              type="number"
              value={formData.salaryMax}
              onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value })}
              placeholder="e.g., 25000"
              required
              min="1"
              className="bg-recruiter-background-tertiary border-recruiter-background-tertiary text-white placeholder-recruiter-primary-light"
            />
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-white">Description</h4>
        <div>
          <label className="block text-sm font-medium text-recruiter-primary-light mb-2">
            Job Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe the role, responsibilities, and expectations..."
            required
            rows={4}
            className="w-full bg-recruiter-background-tertiary border-recruiter-background-tertiary text-white placeholder-recruiter-primary-light rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-recruiter-primary"
          />
        </div>
      </div>

      {/* Requirements */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-white">Requirements</h4>
        <div>
          <label className="block text-sm font-medium text-recruiter-primary-light mb-2">
            Key Requirements (one per line)
          </label>
          <textarea
            value={formData.requirements}
            onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
            placeholder="Valid driving license&#10;Own vehicle (two-wheeler)&#10;Good communication skills&#10;Basic smartphone knowledge"
            required
            rows={4}
            className="w-full bg-recruiter-background-tertiary border-recruiter-background-tertiary text-white placeholder-recruiter-primary-light rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-recruiter-primary"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-recruiter-background-tertiary">
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
          {requisition ? 'Update Requisition' : 'Create Requisition'}
        </Button>
      </div>
    </form>
  );
}

