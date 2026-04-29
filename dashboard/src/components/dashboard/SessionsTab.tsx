// Sessions Tab Component with memoization

import { memo, useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Users, Phone, Clock, CheckCircle, XCircle, AlertCircle, Search, Filter, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'react-hot-toast';
import { useTimeout } from '@/hooks/use-timeout';

const SessionsTab = memo(() => {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Use custom hook for timeout management
  const { safeSetTimeout, isMounted } = useTimeout();

  // Memoize sessions data
  const sessions = useMemo(() => [
    {
      id: 'SES-001',
      candidate: 'Rahul Sharma',
      phone: '+91 98765 43210',
      language: 'Hindi',
      status: 'completed' as const,
      score: 85,
      duration: '4:32',
      date: '2025-04-28',
      dropOffCount: 0,
    },
    {
      id: 'SES-002',
      candidate: 'Priya Patel',
      phone: '+91 87654 32109',
      language: 'English',
      status: 'in_progress' as const,
      score: null,
      duration: '2:15',
      date: '2025-04-28',
      dropOffCount: 1,
    },
    {
      id: 'SES-003',
      candidate: 'Amit Kumar',
      phone: '+91 76543 21098',
      language: 'Tamil',
      status: 'completed' as const,
      score: 72,
      duration: '5:10',
      date: '2025-04-27',
      dropOffCount: 0,
    },
    {
      id: 'SES-004',
      candidate: 'Sneha Reddy',
      phone: '+91 65432 10987',
      language: 'Telugu',
      status: 'failed' as const,
      score: null,
      duration: '1:45',
      date: '2025-04-27',
      dropOffCount: 2,
    },
    {
      id: 'SES-005',
      candidate: 'Vikram Singh',
      phone: '+91 54321 09876',
      language: 'Hindi',
      status: 'completed' as const,
      score: 91,
      duration: '3:58',
      date: '2025-04-26',
      dropOffCount: 0,
    },
  ], []);

  // Filter sessions based on search query
  const filteredSessions = useMemo(() => {
    if (!searchQuery) return sessions;
    
    const query = searchQuery.toLowerCase();
    return sessions.filter(session =>
      session.candidate.toLowerCase().includes(query) ||
      session.phone.includes(query) ||
      session.id.toLowerCase().includes(query) ||
      session.language.toLowerCase().includes(query)
    );
  }, [sessions, searchQuery]);

  const handleViewDetails = useCallback((sessionId: string) => {
    if (!isMounted.current) return;
    toast.info(`Session details for ${sessionId} would open here`);
  }, [isMounted]);

  const handleDownloadReport = useCallback((sessionId: string) => {
    if (!isMounted.current) return;
    toast.success(`Report for ${sessionId} downloaded`);
  }, [isMounted]);

  const handleExportAll = useCallback(() => {
    if (!isMounted.current) return;
    
    setLoading(true);
    safeSetTimeout(() => {
      if (isMounted.current) {
        setLoading(false);
        toast.success('All sessions exported successfully');
      }
    }, 1500);
  }, [safeSetTimeout, isMounted]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500/10 text-green-400 border-green-500/30">Completed</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/30">In Progress</Badge>;
      case 'failed':
        return <Badge className="bg-red-500/10 text-red-400 border-red-500/30">Failed</Badge>;
      case 'dropped':
        return <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/30">Dropped</Badge>;
      default:
        return <Badge className="bg-slate-500/10 text-slate-400 border-slate-500/30">Unknown</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'in_progress':
        return <Clock className="w-4 h-4 text-blue-400" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-400" />;
      case 'dropped':
        return <AlertCircle className="w-4 h-4 text-yellow-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-slate-400" />;
    }
  };

  const getScoreColor = (score: number | null) => {
    if (score === null) return 'text-slate-400';
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Sessions</h2>
          <p className="text-slate-400">Interview sessions and results</p>
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
                placeholder="Search sessions..."
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

      {/* Sessions Table */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Recent Sessions</CardTitle>
          <CardDescription className="text-slate-400">
            Showing {filteredSessions.length} of {sessions.length} sessions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filteredSessions.map((session, index) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-4 p-4 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors border border-slate-700/50 hover:border-slate-700"
              >
                <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center">
                  <Users className="w-5 h-5 text-slate-300" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-white font-medium truncate">{session.candidate}</p>
                    {getStatusBadge(session.status)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {session.phone}
                    </span>
                    <span>{session.language}</span>
                    <span>{session.date}</span>
                  </div>
                </div>

                <div className="text-right">
                  {session.score !== null ? (
                    <p className={`text-lg font-bold ${getScoreColor(session.score)}`}>
                      {session.score}
                    </p>
                  ) : (
                    <p className="text-lg font-bold text-slate-400">—</p>
                  )}
                  <p className="text-xs text-slate-400">{session.duration}</p>
                </div>

                <div className="flex items-center gap-2">
                  {getStatusIcon(session.status)}
                  <Button
                    onClick={() => handleViewDetails(session.id)}
                    variant="ghost"
                    size="sm"
                    className="text-slate-400 hover:text-white hover:bg-slate-700"
                  >
                    View
                  </Button>
                  <Button
                    onClick={() => handleDownloadReport(session.id)}
                    variant="ghost"
                    size="sm"
                    className="text-slate-400 hover:text-white hover:bg-slate-700"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredSessions.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No sessions found matching your search</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
});

SessionsTab.displayName = 'SessionsTab';

export default SessionsTab;
