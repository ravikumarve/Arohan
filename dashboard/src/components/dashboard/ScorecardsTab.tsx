// Scorecards Tab Component with memoization

import { memo, useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FileText, TrendingUp, TrendingDown, Award, AlertTriangle, Download, Eye, Filter, Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'react-hot-toast';
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
          <p className="text-slate-400">Candidate assessment results and analytics</p>
        </div>
        <Button
          onClick={handleExportAll}
          disabled={loading}
          variant="outline"
          className="border-slate-700 hover:bg-slate-800"
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
      <Card className="bg-slate-900/50 border-slate-800">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search scorecards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
              />
            </div>
            <Button variant="outline" className="border-slate-700 hover:bg-slate-800">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Scorecards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredScorecards.map((scorecard, index) => (
          <motion.div
            key={scorecard.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-white">{scorecard.candidate}</CardTitle>
                      <CardDescription className="text-slate-400 text-xs">
                        {scorecard.role} • {scorecard.date}
                      </CardDescription>
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
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Overall Score */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getScoreTrend(scorecard.overallScore)}
                    <span className="text-slate-400 text-sm">Overall Score</span>
                  </div>
                  <span className={`text-2xl font-bold ${getScoreColor(scorecard.overallScore)}`}>
                    {scorecard.overallScore}
                  </span>
                </div>

                {/* Score Bar */}
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div
                    className={`${getScoreBarColor(scorecard.overallScore)} h-2 rounded-full transition-all`}
                    style={{ width: `${scorecard.overallScore}%` }}
                  />
                </div>

                {/* Detailed Scores */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-slate-800/50 p-2 rounded">
                    <p className="text-slate-400 text-xs">Communication</p>
                    <p className={`font-medium ${getScoreColor(scorecard.communicationScore)}`}>
                      {scorecard.communicationScore}
                    </p>
                  </div>
                  <div className="bg-slate-800/50 p-2 rounded">
                    <p className="text-slate-400 text-xs">Domain Knowledge</p>
                    <p className={`font-medium ${getScoreColor(scorecard.domainKnowledgeScore)}`}>
                      {scorecard.domainKnowledgeScore}
                    </p>
                  </div>
                  <div className="bg-slate-800/50 p-2 rounded">
                    <p className="text-slate-400 text-xs">Situational Judgment</p>
                    <p className={`font-medium ${getScoreColor(scorecard.situationalJudgmentScore)}`}>
                      {scorecard.situationalJudgmentScore}
                    </p>
                  </div>
                  <div className="bg-slate-800/50 p-2 rounded">
                    <p className="text-slate-400 text-xs">Confidence</p>
                    <p className={`font-medium ${getScoreColor(scorecard.confidenceScore)}`}>
                      {scorecard.confidenceScore}
                    </p>
                  </div>
                </div>

                {/* Recommended Roles */}
                <div>
                  <p className="text-slate-400 text-xs mb-2">Recommended Roles</p>
                  <div className="flex flex-wrap gap-2">
                    {scorecard.recommendedRoles.map((role, i) => (
                      <Badge key={i} variant="outline" className="border-slate-700 text-slate-300">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Assessor Notes */}
                <div className="bg-slate-800/30 p-3 rounded text-sm text-slate-400 line-clamp-2">
                  {scorecard.assessorNotes}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={() => handleViewDetails(scorecard.id)}
                    variant="outline"
                    size="sm"
                    className="flex-1 border-slate-700 hover:bg-slate-800"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    View Details
                  </Button>
                  <Button
                    onClick={() => handleDownloadReport(scorecard.id)}
                    variant="outline"
                    size="sm"
                    className="border-slate-700 hover:bg-slate-800"
                  >
                    <Download className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredScorecards.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">No scorecards found matching your search</p>
        </div>
      )}

      {/* Quick Stats */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Scorecard Analytics</CardTitle>
          <CardDescription className="text-slate-400">Overall assessment metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <p className="text-slate-400 text-sm">Total Scorecards</p>
              <p className="text-2xl font-bold text-white">{scorecards.length}</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <p className="text-slate-400 text-sm">Shortlisted</p>
              <p className="text-2xl font-bold text-green-400">
                {scorecards.filter(s => s.shortlistFlag).length}
              </p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <p className="text-slate-400 text-sm">Avg Score</p>
              <p className="text-2xl font-bold text-white">
                {Math.round(scorecards.reduce((acc, s) => acc + s.overallScore, 0) / scorecards.length)}
              </p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <p className="text-slate-400 text-sm">High Performers (80+)</p>
              <p className="text-2xl font-bold text-green-400">
                {scorecards.filter(s => s.overallScore >= 80).length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

ScorecardsTab.displayName = 'ScorecardsTab';

export default ScorecardsTab;
