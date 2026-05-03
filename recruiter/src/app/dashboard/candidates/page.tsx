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
  Search,
  Filter,
  Download,
  RefreshCw,
  MoreVertical,
  User,
  Phone,
  MapPin,
  Calendar,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Download as DownloadIcon,
  FileText,
  TrendingUp,
  Users,
  Award,
  X,
} from 'lucide-react';

// Mock data - will be replaced with real API calls
const mockCandidates = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    phone: '+91 98765 43210',
    email: 'rajesh.kumar@email.com',
    location: 'Mumbai, Maharashtra',
    pinCode: '400001',
    role: 'Delivery Partner',
    status: 'shortlisted',
    score: 85,
    language: 'Hindi',
    experience: '2 years',
    interviewedAt: '2025-05-03T14:30:00',
    campaignId: '1',
    campaignName: 'Delivery Partner Hiring - Mumbai',
    notes: 'Strong communication skills, good geographical knowledge',
  },
  {
    id: '2',
    name: 'Priya Sharma',
    phone: '+91 87654 32109',
    email: 'priya.sharma@email.com',
    location: 'Delhi, Delhi',
    pinCode: '110001',
    role: 'Warehouse Associate',
    status: 'screened',
    score: 78,
    language: 'Hindi',
    experience: '1 year',
    interviewedAt: '2025-05-03T13:15:00',
    campaignId: '2',
    campaignName: 'Warehouse Staff - Delhi',
    notes: 'Good physical fitness, willing to work shifts',
  },
  {
    id: '3',
    name: 'Amit Patel',
    phone: '+91 76543 21098',
    email: 'amit.patel@email.com',
    location: 'Bangalore, Karnataka',
    pinCode: '560001',
    role: 'Retail Staff',
    status: 'shortlisted',
    score: 92,
    language: 'English',
    experience: '3 years',
    interviewedAt: '2025-05-03T11:45:00',
    campaignId: '3',
    campaignName: 'Retail Staff - Bangalore',
    notes: 'Excellent customer service skills, fluent in English',
  },
  {
    id: '4',
    name: 'Suresh Reddy',
    phone: '+91 65432 10987',
    email: 'suresh.reddy@email.com',
    location: 'Hyderabad, Telangana',
    pinCode: '500001',
    role: 'Delivery Partner',
    status: 'rejected',
    score: 45,
    language: 'Telugu',
    experience: '6 months',
    interviewedAt: '2025-05-03T10:30:00',
    campaignId: '4',
    campaignName: 'Delivery Partner Hiring - Hyderabad',
    notes: 'Poor communication, lacks geographical knowledge',
  },
  {
    id: '5',
    name: 'Lakshmi Devi',
    phone: '+91 54321 09876',
    email: 'lakshmi.devi@email.com',
    location: 'Chennai, Tamil Nadu',
    pinCode: '600001',
    role: 'Customer Support',
    status: 'pending',
    score: 0,
    language: 'Tamil',
    experience: '4 years',
    interviewedAt: null,
    campaignId: '5',
    campaignName: 'Customer Support - Chennai',
    notes: 'Scheduled for interview tomorrow',
  },
];

export default function RecruiterCandidatesPage() {
  const [candidates, setCandidates] = useState(mockCandidates);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [scoreFilter, setScoreFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [selectedCandidates, setSelectedCandidates] = useState<Set<string>>(new Set());
  const [showBulkActionModal, setShowBulkActionModal] = useState(false);
  const [bulkAction, setBulkAction] = useState<'shortlist' | 'reject' | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter candidates
  const filteredCandidates = candidates.filter((candidate) => {
    const matchesSearch =
      candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.phone.includes(searchQuery) ||
      candidate.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || candidate.status === statusFilter;
    const matchesScore =
      scoreFilter === 'all' ||
      (scoreFilter === 'high' && candidate.score >= 80) ||
      (scoreFilter === 'medium' && candidate.score >= 60 && candidate.score < 80) ||
      (scoreFilter === 'low' && candidate.score < 60);
    const matchesRole = roleFilter === 'all' || candidate.role === roleFilter;
    return matchesSearch && matchesStatus && matchesScore && matchesRole;
  });

  // Pagination
  const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage);
  const paginatedCandidates = filteredCandidates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Statistics
  const stats = {
    total: candidates.length,
    screened: candidates.filter((c) => c.status === 'screened').length,
    shortlisted: candidates.filter((c) => c.status === 'shortlisted').length,
    rejected: candidates.filter((c) => c.status === 'rejected').length,
    avgScore: Math.round(
      candidates.filter((c) => c.score > 0).reduce((sum, c) => sum + c.score, 0) /
        candidates.filter((c) => c.score > 0).length
    ),
  };

  // Handlers
  const handleRefresh = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
  };

  const handleViewProfile = (candidate: any) => {
    setSelectedCandidate(candidate);
    setShowProfileModal(true);
  };

  const handleSelectCandidate = (candidateId: string) => {
    const newSelected = new Set(selectedCandidates);
    if (newSelected.has(candidateId)) {
      newSelected.delete(candidateId);
    } else {
      newSelected.add(candidateId);
    }
    setSelectedCandidates(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedCandidates.size === paginatedCandidates.length) {
      setSelectedCandidates(new Set());
    } else {
      setSelectedCandidates(new Set(paginatedCandidates.map((c) => c.id)));
    }
  };

  const handleBulkAction = (action: 'shortlist' | 'reject') => {
    setBulkAction(action);
    setShowBulkActionModal(true);
  };

  const executeBulkAction = () => {
    if (!bulkAction) return;

    setCandidates(
      candidates.map((c) =>
        selectedCandidates.has(c.id) ? { ...c, status: bulkAction } : c
      )
    );
    setSelectedCandidates(new Set());
    setShowBulkActionModal(false);
    setBulkAction(null);
  };

  const handleStatusChange = (candidateId: string, newStatus: string) => {
    setCandidates(
      candidates.map((c) => (c.id === candidateId ? { ...c, status: newStatus } : c))
    );
  };

  // Status badge colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'shortlisted':
        return 'bg-recruiter-success/20 text-recruiter-success border-recruiter-success/30';
      case 'screened':
        return 'bg-recruiter-info/20 text-recruiter-info border-recruiter-info/30';
      case 'rejected':
        return 'bg-recruiter-danger/20 text-recruiter-danger border-recruiter-danger/30';
      case 'pending':
        return 'bg-recruiter-warning/20 text-recruiter-warning border-recruiter-warning/30';
      default:
        return 'bg-recruiter-background-tertiary text-recruiter-primary-light';
    }
  };

  // Score badge colors
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-recruiter-success/20 text-recruiter-success border-recruiter-success/30';
    if (score >= 60) return 'bg-recruiter-warning/20 text-recruiter-warning border-recruiter-warning/30';
    if (score > 0) return 'bg-recruiter-danger/20 text-recruiter-danger border-recruiter-danger/30';
    return 'bg-recruiter-background-tertiary text-recruiter-primary-light';
  };

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not interviewed';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Candidates</h1>
          <p className="text-recruiter-primary-light">
            View and manage candidate profiles and screening results
          </p>
        </div>
        <div className="flex gap-3">
          {selectedCandidates.size > 0 && (
            <>
              <Button
                variant="outline"
                onClick={() => handleBulkAction('shortlist')}
                className="border-recruiter-success/30 text-recruiter-success hover:bg-recruiter-success/10"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Shortlist ({selectedCandidates.size})
              </Button>
              <Button
                variant="outline"
                onClick={() => handleBulkAction('reject')}
                className="border-recruiter-danger/30 text-recruiter-danger hover:bg-recruiter-danger/10"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Reject ({selectedCandidates.size})
              </Button>
            </>
          )}
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
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Candidates"
          value={stats.total}
          icon={<Users className="w-5 h-5" />}
          color="recruiter-primary"
        />
        <StatCard
          title="Screened"
          value={stats.screened}
          icon={<Clock className="w-5 h-5" />}
          color="recruiter-info"
        />
        <StatCard
          title="Shortlisted"
          value={stats.shortlisted}
          icon={<CheckCircle className="w-5 h-5" />}
          color="recruiter-success"
        />
        <StatCard
          title="Rejected"
          value={stats.rejected}
          icon={<XCircle className="w-5 h-5" />}
          color="recruiter-danger"
        />
        <StatCard
          title="Avg Score"
          value={stats.avgScore}
          icon={<Award className="w-5 h-5" />}
          color="recruiter-warning"
        />
      </div>

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
                <option value="screened">Screened</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="rejected">Rejected</option>
                <option value="pending">Pending</option>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-recruiter-primary-light mb-2">
                Score Range
              </label>
              <Select
                value={scoreFilter}
                onChange={(e) => setScoreFilter(e.target.value)}
                className="bg-recruiter-background-tertiary border-recruiter-background-tertiary text-white"
              >
                <option value="all">All Scores</option>
                <option value="high">High (80+)</option>
                <option value="medium">Medium (60-79)</option>
                <option value="low">Low (<60)</option>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-recruiter-primary-light mb-2">
                Role
              </label>
              <Select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-recruiter-background-tertiary border-recruiter-background-tertiary text-white"
              >
                <option value="all">All Roles</option>
                <option value="Delivery Partner">Delivery Partner</option>
                <option value="Warehouse Associate">Warehouse Associate</option>
                <option value="Retail Staff">Retail Staff</option>
                <option value="Customer Support">Customer Support</option>
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
                  placeholder="Search candidates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-recruiter-background-tertiary border-recruiter-background-tertiary text-white placeholder-recruiter-primary-light"
                />
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Candidates Table */}
      <Card className="bg-recruiter-background-secondary border-recruiter-background-tertiary overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : paginatedCandidates.length === 0 ? (
          <EmptyState
            icon={<User className="w-12 h-12" />}
            title="No candidates found"
            description={
              searchQuery ||
              statusFilter !== 'all' ||
              scoreFilter !== 'all' ||
              roleFilter !== 'all'
                ? 'Try adjusting your filters or search query'
                : 'No candidates have been screened yet'
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <thead>
                <tr className="border-b border-recruiter-background-tertiary">
                  <th className="px-6 py-4 text-sm font-semibold text-recruiter-primary-light">
                    <input
                      type="checkbox"
                      checked={selectedCandidates.size === paginatedCandidates.length}
                      onChange={handleSelectAll}
                      className="rounded border-recruiter-background-tertiary bg-recruiter-background-tertiary text-recruiter-primary focus:ring-recruiter-primary"
                    />
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-recruiter-primary-light">
                    Candidate
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-recruiter-primary-light">
                    Role
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-recruiter-primary-light">
                    Status
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-recruiter-primary-light">
                    Score
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-recruiter-primary-light">
                    Location
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-recruiter-primary-light">
                    Interviewed
                  </th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-recruiter-primary-light">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedCandidates.map((candidate) => (
                  <tr
                    key={candidate.id}
                    className="border-b border-recruiter-background-tertiary hover:bg-recruiter-background-tertiary/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedCandidates.has(candidate.id)}
                        onChange={() => handleSelectCandidate(candidate.id)}
                        className="rounded border-recruiter-background-tertiary bg-recruiter-background-tertiary text-recruiter-primary focus:ring-recruiter-primary"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-recruiter-primary rounded-full flex items-center justify-center text-white font-medium">
                          {candidate.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-white font-medium">{candidate.name}</p>
                          <p className="text-recruiter-primary-light text-sm">{candidate.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white">{candidate.role}</p>
                        <p className="text-recruiter-primary-light text-sm">{candidate.experience}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={getStatusColor(candidate.status)}>
                        {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={getScoreColor(candidate.score)}>
                        {candidate.score > 0 ? `${candidate.score}/100` : 'Pending'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-recruiter-primary-light" />
                        <span className="text-white">{candidate.location}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-recruiter-primary-light" />
                        <span className="text-white">{formatDate(candidate.interviewedAt)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewProfile(candidate)}
                          className="border-recruiter-background-tertiary text-recruiter-primary-light hover:text-white hover:bg-recruiter-background-tertiary"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {candidate.status === 'screened' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusChange(candidate.id, 'shortlisted')}
                              className="border-recruiter-success/30 text-recruiter-success hover:bg-recruiter-success/10"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusChange(candidate.id, 'rejected')}
                              className="border-recruiter-danger/30 text-recruiter-danger hover:bg-recruiter-danger/10"
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}

        {/* Pagination */}
        {paginatedCandidates.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-recruiter-background-tertiary">
            <p className="text-sm text-recruiter-primary-light">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, filteredCandidates.length)} of{' '}
              {filteredCandidates.length} candidates
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

      {/* Candidate Profile Modal */}
      <Modal
        isOpen={showProfileModal}
        onClose={() => {
          setShowProfileModal(false);
          setSelectedCandidate(null);
        }}
        title="Candidate Profile"
        className="bg-recruiter-background-secondary border-recruiter-background-tertiary max-w-4xl"
      >
        {selectedCandidate && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 bg-recruiter-primary rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {selectedCandidate.name.charAt(0)}
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-2">{selectedCandidate.name}</h3>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-recruiter-primary-light" />
                    <span className="text-white">{selectedCandidate.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-recruiter-primary-light" />
                    <span className="text-white">{selectedCandidate.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-recruiter-primary-light" />
                    <span className="text-white">
                      {formatDate(selectedCandidate.interviewedAt)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <Badge className={getScoreColor(selectedCandidate.score)} size="lg">
                  Score: {selectedCandidate.score}/100
                </Badge>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailCard
                title="Contact Information"
                icon={<User className="w-5 h-5" />}
                details={[
                  { label: 'Email', value: selectedCandidate.email },
                  { label: 'Phone', value: selectedCandidate.phone },
                  { label: 'Location', value: selectedCandidate.location },
                  { label: 'Pin Code', value: selectedCandidate.pinCode },
                ]}
              />
              <DetailCard
                title="Professional Details"
                icon={<FileText className="w-5 h-5" />}
                details={[
                  { label: 'Role', value: selectedCandidate.role },
                  { label: 'Experience', value: selectedCandidate.experience },
                  { label: 'Language', value: selectedCandidate.language },
                  { label: 'Status', value: selectedCandidate.status },
                ]}
              />
            </div>

            {/* Campaign Information */}
            <Card className="bg-recruiter-background-tertiary border-recruiter-background-tertiary p-4">
              <h4 className="text-lg font-semibold text-white mb-3">Campaign Information</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-recruiter-primary-light mb-1">Campaign</p>
                  <p className="text-white">{selectedCandidate.campaignName}</p>
                </div>
                <div>
                  <p className="text-recruiter-primary-light mb-1">Campaign ID</p>
                  <p className="text-white">{selectedCandidate.campaignId}</p>
                </div>
              </div>
            </Card>

            {/* Notes */}
            <Card className="bg-recruiter-background-tertiary border-recruiter-background-tertiary p-4">
              <h4 className="text-lg font-semibold text-white mb-3">Assessment Notes</h4>
              <p className="text-recruiter-primary-light">{selectedCandidate.notes}</p>
            </Card>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowProfileModal(false);
                  setSelectedCandidate(null);
                }}
                className="border-recruiter-background-tertiary text-recruiter-primary-light hover:text-white hover:bg-recruiter-background-tertiary"
              >
                Close
              </Button>
              {selectedCandidate.status === 'screened' && (
                <>
                  <Button
                    onClick={() => {
                      handleStatusChange(selectedCandidate.id, 'shortlisted');
                      setShowProfileModal(false);
                    }}
                    className="bg-recruiter-success hover:bg-recruiter-success/90 text-white"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Shortlist
                  </Button>
                  <Button
                    onClick={() => {
                      handleStatusChange(selectedCandidate.id, 'rejected');
                      setShowProfileModal(false);
                    }}
                    className="bg-recruiter-danger hover:bg-recruiter-danger/90 text-white"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Bulk Action Confirmation Modal */}
      <Modal
        isOpen={showBulkActionModal}
        onClose={() => {
          setShowBulkActionModal(false);
          setBulkAction(null);
        }}
        title="Confirm Bulk Action"
        className="bg-recruiter-background-secondary border-recruiter-background-tertiary"
      >
        <div className="space-y-4">
          <p className="text-recruiter-primary-light">
            Are you sure you want to {bulkAction} {selectedCandidates.size} candidate(s)? This action
            cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowBulkActionModal(false);
                setBulkAction(null);
              }}
              className="border-recruiter-background-tertiary text-recruiter-primary-light hover:text-white hover:bg-recruiter-background-tertiary"
            >
              Cancel
            </Button>
            <Button
              onClick={executeBulkAction}
              className={
                bulkAction === 'shortlist'
                  ? 'bg-recruiter-success hover:bg-recruiter-success/90 text-white'
                  : 'bg-recruiter-danger hover:bg-recruiter-danger/90 text-white'
              }
            >
              {bulkAction === 'shortlist' ? 'Shortlist' : 'Reject'}
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
    'recruiter-danger': 'bg-recruiter-danger/20 text-recruiter-danger',
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
