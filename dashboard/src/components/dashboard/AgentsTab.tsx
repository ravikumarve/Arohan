// Agents Tab Component with memoization

import { memo, useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Bot, Zap, Play, Settings, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'react-hot-toast';
import { LoadingSpinner } from '@/components/ui/loading/LoadingSpinner';
import { useTimeout } from '@/hooks/use-timeout';

const AgentsTab = memo(() => {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  
  // Use custom hook for timeout management
  const { safeSetTimeout, isMounted } = useTimeout();

  // Memoize agents data
  const agents = useMemo(() => [
    {
      name: 'Proctor Agent',
      description: 'Conducts adaptive 5-minute voice interviews, manages interruptions, handles colloquialisms',
      status: 'active' as const,
      lastRun: '2 minutes ago',
      successRate: '98.5%',
      version: '2.0.0',
      uptime: '99.9%',
    },
    {
      name: 'Assessor Agent',
      description: 'Analyzes transcripts for confidence, keyword accuracy, situational judgment; outputs 1-100 scorecard',
      status: 'active' as const,
      lastRun: '5 minutes ago',
      successRate: '97.2%',
      version: '2.0.0',
      uptime: '99.8%',
    },
    {
      name: 'Matchmaker Agent',
      description: 'Geo-radius requisition matching, ATS webhook dispatch, WhatsApp notifications',
      status: 'active' as const,
      lastRun: '10 minutes ago',
      successRate: '99.1%',
      version: '2.0.0',
      uptime: '99.7%',
    },
  ], []);

  const handleTestAgent = useCallback((agentName: string) => {
    if (!isMounted.current) return;
    
    setLoadingStates(prev => ({ ...prev, [agentName]: true }));
    
    safeSetTimeout(() => {
      if (isMounted.current) {
        setLoadingStates(prev => ({ ...prev, [agentName]: false }));
        toast.success(`${agentName} test completed successfully`);
      }
    }, 2000);
  }, [safeSetTimeout, isMounted]);

  const handleConfigureAgent = useCallback((agentName: string) => {
    if (!isMounted.current) return;
    toast.info(`Configuration panel for ${agentName} would open here`);
  }, [isMounted]);

  const handleViewLogs = useCallback((agentName: string) => {
    if (!isMounted.current) return;
    toast.info(`Logs for ${agentName} would open here`);
  }, [isMounted]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500/10 text-green-400 border-green-500/30">Active</Badge>;
      case 'inactive':
        return <Badge className="bg-slate-500/10 text-slate-400 border-slate-500/30">Inactive</Badge>;
      case 'error':
        return <Badge className="bg-red-500/10 text-red-400 border-red-500/30">Error</Badge>;
      default:
        return <Badge className="bg-slate-500/10 text-slate-400 border-slate-500/30">Unknown</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'inactive':
        return <Clock className="w-4 h-4 text-slate-400" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Agent Testing</h2>
          <p className="text-slate-400">Test and monitor AI agents</p>
        </div>
        <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
          <Zap className="w-4 h-4 mr-2" />
          Run All Tests
        </Button>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {agents.map((agent, index) => (
          <motion.div
            key={agent.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-colors h-full">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  {getStatusBadge(agent.status)}
                </div>
                <CardTitle className="text-white">{agent.name}</CardTitle>
                <CardDescription className="text-slate-400 line-clamp-2">
                  {agent.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-slate-800/50 p-2 rounded">
                    <p className="text-slate-400 text-xs">Success Rate</p>
                    <p className="text-white font-medium">{agent.successRate}</p>
                  </div>
                  <div className="bg-slate-800/50 p-2 rounded">
                    <p className="text-slate-400 text-xs">Uptime</p>
                    <p className="text-white font-medium">{agent.uptime}</p>
                  </div>
                </div>

                {/* Last Run */}
                <div className="flex items-center gap-2 text-sm">
                  {getStatusIcon(agent.status)}
                  <span className="text-slate-400">Last run: {agent.lastRun}</span>
                </div>

                {/* Version */}
                <div className="text-xs text-slate-500">
                  Version {agent.version}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={() => handleTestAgent(agent.name)}
                    disabled={loadingStates[agent.name]}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    size="sm"
                  >
                    {loadingStates[agent.name] ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <>
                        <Play className="w-3 h-3 mr-1" />
                        Test
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => handleConfigureAgent(agent.name)}
                    variant="outline"
                    size="sm"
                    className="border-slate-700 hover:bg-slate-800"
                  >
                    <Settings className="w-3 h-3" />
                  </Button>
                  <Button
                    onClick={() => handleViewLogs(agent.name)}
                    variant="outline"
                    size="sm"
                    className="border-slate-700 hover:bg-slate-800"
                  >
                    <Clock className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Stats */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Agent Performance</CardTitle>
          <CardDescription className="text-slate-400">Overall system metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <p className="text-slate-400 text-sm">Total Agents</p>
              <p className="text-2xl font-bold text-white">3</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <p className="text-slate-400 text-sm">Active Agents</p>
              <p className="text-2xl font-bold text-green-400">3</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <p className="text-slate-400 text-sm">Avg Success Rate</p>
              <p className="text-2xl font-bold text-white">98.3%</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <p className="text-slate-400 text-sm">Total Tests Today</p>
              <p className="text-2xl font-bold text-white">247</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

AgentsTab.displayName = 'AgentsTab';

export default AgentsTab;
