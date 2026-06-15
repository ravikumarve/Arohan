// Scorecards Tab Component with memoization

import { memo, useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FileText, TrendingUp, TrendingDown, Award, AlertTriangle, Download, Eye, Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useTimeout } from '@/hooks/use-timeout';

const ScorecardsTab = memo(() => {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // Use custom hook for timeout management
  const { safeSetTimeout, isMounted } = useTimeout();

  // Memoize scorecards data
  const scorecards = useMemo(() => [
    {
      id: 'SC-001',
      candidate: 'Rahul Sharma',
      phone: '+91 98765 43210',
      role: 'Delivery Partner',
      overallScore: 85,
      communicationScore: 88,
      domainKnowledgeScore: 82,
      situationalJudgmentScore: 84,
      confidenceScore: 87,
      languageFluency: 'proficient' as const,
      recommendedRoles: ['Delivery Partner', 'Warehouse Associate'],
      shortlistFlag: true,
      date: '2025-04-28',
      assessorNotes: 'Strong communication skills, good domain knowledge. Recommended for immediate hire.',
    },
    {
      id: 'SC-002',
      candidate: 'Priya Patel',
      phone: '+91 87654 32109',
      role: 'Customer Service',
      overallScore: 72,
      communicationScore: 75,
      domainKnowledgeScore: 68,
      situationalJudgmentScore: 70,
      confidenceScore: 74,
      languageFluency: 'proficient' as const,
      recommendedRoles: ['Customer Service', 'Sales Associate'],
      shortlistFlag: false,
      date: '2025-04-28',
      assessorNotes: 'Good communication but needs more domain knowledge training.',
    },
    {
      id: 'SC-003',
      candidate: 'Amit Kumar',
      phone: '+91 76543 21098',
      role: 'Warehouse Associate',
      overallScore: 91,
      communicationScore: 90,
      domainKnowledgeScore: 92,
      situationalJudgmentScore: 89,
      confidenceScore: 93,
      languageFluency: 'native' as const,
      recommendedRoles: ['Warehouse Associate', 'Team Lead'],
      shortlistFlag: true,
      date: '2025-04-27',
      assessorNotes: 'Excellent candidate across all metrics. Highly recommended.',
    },
    {
      id: 'SC-004',
      candidate: 'Sneha Reddy',
      phone: '+91 65432 10987',
      role: 'Retail Associate',
      overallScore: 58,
      communicationScore: 62,
      domainKnowledgeScore: 55,
      situationalJudgmentScore: 56,
      confidenceScore: 60,
      languageFluency: 'functional' as const,
      recommendedRoles: ['Retail Associate'],
      shortlistFlag: false,
      date: '2025-04-27',
      assessorNotes: 'Below average performance. Needs significant training.',
    },
    {
      id: 'SC-005',
      candidate: 'Vikram Singh',
      phone: '+91 54321 09876',
      role: 'Delivery Partner',
      overallScore: 78,
      communicationScore: 80,
      domainKnowledgeScore: 76,
      situationalJudgmentScore: 77,
      confidenceScore: 79,
      languageFluency: 'proficient' as const,
      recommendedRoles: ['Delivery Partner'],
      shortlistFlag: true,
      date: '2025-04-26',
      assessorNotes: 'Good candidate with room for improvement.',
    },
  ], []);

  // Filter scorecards based on search query
  const filteredScorecards = useMemo(() => {
    if (!searchQuery) return scorecards;

    const query = searchQuery.toLowerCase();
    return scorecards.filter(scorecard =>
      scorecard.candidate.toLowerCase().includes(query) ||
      scorecard.phone.includes(query) ||
      scorecard.role.toLowerCase().includes(query) ||
      scorecard.id.toLowerCase().includes(query)
    );
  }, [scorecards, searchQuery]);

  const handleViewDetails = useCallback((scorecardId: string) => {
    if (!isMounted.current) return;
    toast.info(`Scorecard details for ${scorecardId} would open here`);
  }, [isMounted]);

  const handleDownloadReport = useCallback((scorecardId: string) => {
    if (!isMounted.current) return;
    toast.success(`Report for ${scorecardId} downloaded`);
  }, [isMounted]);

  const handleExportAll = useCallback(() => {
    if (!isMounted.current) return;

    setLoading(true);
    safeSetTimeout(() => {
      if (isMounted.current) {
        setLoading(false);
        toast.success('All scorecards exported successfully');
      }
    }, 1500);
  }, [safeSetTimeout, isMounted]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBarColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getFluencyBadge = (fluency: string) => {
    switch (fluency) {
      case 'native':
        return <Badge className="bg-green-500/10 text-green-400 border-green-500/30">Native</Badge>;
      case 'proficient':
        return <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/30">Proficient</Badge>;
      case 'functional':
        return <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/30">Functional</Badge>;
      default:
        return <Badge className="bg-slate-500/10 text-slate-400 border-slate-500/30">Unknown</Badge>;
    }
  };

  const getScoreTrend = (score: number) => {
    if (score >= 80) return <TrendingUp className="w-4 h-4 text-green-400" />;
    if (score >= 60) return <TrendingDown className="w-4 h-4 text-yellow-400" />;
    return <AlertTriangle className="w-4 h-4 text-red-400" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Scorecards</h2>
          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Candidate assessment results and analytics</p>
        </div>
        <Button
          onClick={handleExportAll}
          disabled={loading}
          variant="outline"
          className="border-white/10 text-white hover:bg-white/5 hover:border-white/20"
        >
          {loading ? (
            'Exporting...'
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Export All
            </>
          )}
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="glass rounded-lg p-6">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
            <Input
              placeholder="Search scorecards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
            />
          </div>
          <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 hover:border-white/20">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Scorecards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredScorecards.map((scorecard, index) => (
          <motion.div
            key={scorecard.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <div className="glass-accent rounded-lg p-5 space-y-4">
              {/* Card Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{scorecard.candidate}</p>
                    <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                      {scorecard.role} • {scorecard.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {scorecard.shortlistFlag && (
                    <Badge className="bg-green-500/10 text-green-400 border-green-500/30">
                      <Award className="w-3 h-3 mr-1" />
                      Shortlisted
                    </Badge>
                  )}
                  {getFluencyBadge(scorecard.languageFluency)}
                </div>
              </div>

              {/* Overall Score */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getScoreTrend(scorecard.overallScore)}
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Overall Score</span>
                </div>
                <span
                  className={`text-2xl font-bold ${getScoreColor(scorecard.overallScore)}`}
                  style={{ fontFamily: 'JetBrains Mono, monospace' }}
                >
                  {scorecard.overallScore}
                </span>
              </div>

              {/* Score Bar */}
              <div className="w-full rounded-full h-2" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <div
                  className={`${getScoreBarColor(scorecard.overallScore)} h-2 rounded-full transition-all`}
                  style={{ width: `${scorecard.overallScore}%` }}
                />
              </div>

              {/* Detailed Scores */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', borderRadius: '0.5rem', padding: '0.5rem' }}>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Communication</p>
                  <p className={`font-medium ${getScoreColor(scorecard.communicationScore)}`} style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                    {scorecard.communicationScore}
                  </p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', borderRadius: '0.5rem', padding: '0.5rem' }}>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Domain Knowledge</p>
                  <p className={`font-medium ${getScoreColor(scorecard.domainKnowledgeScore)}`} style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                    {scorecard.domainKnowledgeScore}
                  </p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', borderRadius: '0.5rem', padding: '0.5rem' }}>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Situational Judgment</p>
                  <p className={`font-medium ${getScoreColor(scorecard.situationalJudgmentScore)}`} style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                    {scorecard.situationalJudgmentScore}
                  </p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', borderRadius: '0.5rem', padding: '0.5rem' }}>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Confidence</p>
                  <p className={`font-medium ${getScoreColor(scorecard.confidenceScore)}`} style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                    {scorecard.confidenceScore}
                  </p>
                </div>
              </div>

              {/* Recommended Roles */}
              <div>
                <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>Recommended Roles</p>
                <div className="flex flex-wrap gap-2">
                  {scorecard.recommendedRoles.map((role, i) => (
                    <Badge key={i} variant="outline" className="border-white/10 text-white/80">
                      {role}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Assessor Notes */}
              <div
                className="text-sm line-clamp-2"
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: '0.5rem',
                  padding: '0.75rem',
                  color: 'var(--text-tertiary)',
                }}
              >
                {scorecard.assessorNotes}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  onClick={() => handleViewDetails(scorecard.id)}
                  variant="outline"
                  size="sm"
                  className="flex-1 border-white/10 text-white hover:bg-white/5 hover:border-white/20"
                >
                  <Eye className="w-3 h-3 mr-1" />
                  View Details
                </Button>
                <Button
                  onClick={() => handleDownloadReport(scorecard.id)}
                  variant="outline"
                  size="sm"
                  className="border-white/10 text-white hover:bg-white/5 hover:border-white/20"
                >
                  <Download className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredScorecards.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--text-tertiary)' }} />
          <p style={{ color: 'var(--text-tertiary)' }}>No scorecards found matching your search</p>
        </div>
      )}

      {/* Scorecard Analytics */}
      <div className="glass rounded-lg p-6 space-y-5">
        <div>
          <h3 className="text-base font-medium text-white" style={{ fontFamily: 'var(--font-space-grotesk, "Space Grotesk"), sans-serif' }}>
            Scorecard Analytics
          </h3>
          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Overall assessment metrics</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', borderRadius: '0.5rem', padding: '1rem' }}>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Total Scorecards</p>
            <p className="text-2xl font-bold text-white" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{scorecards.length}</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', borderRadius: '0.5rem', padding: '1rem' }}>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Shortlisted</p>
            <p className="text-2xl font-bold text-green-400" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
              {scorecards.filter(s => s.shortlistFlag).length}
            </p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', borderRadius: '0.5rem', padding: '1rem' }}>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Avg Score</p>
            <p className="text-2xl font-bold text-white" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
              {Math.round(scorecards.reduce((acc, s) => acc + s.overallScore, 0) / scorecards.length)}
            </p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', borderRadius: '0.5rem', padding: '1rem' }}>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>High Performers (80+)</p>
            <p className="text-2xl font-bold text-green-400" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
              {scorecards.filter(s => s.overallScore >= 80).length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

ScorecardsTab.displayName = 'ScorecardsTab';

export default ScorecardsTab;
