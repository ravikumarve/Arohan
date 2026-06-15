// Agents Tab Component with memoization

import { memo, useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Bot, Zap, Play, Settings, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { LoadingSpinner } from '@/components/ui/loading/LoadingSpinner';
import { useTimeout } from '@/hooks/use-timeout';

const AgentsTab = memo(() => {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  const { safeSetTimeout, isMounted } = useTimeout();

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
    toast(`Configuration panel for ${agentName} would open here`);
  }, [isMounted]);

  const handleViewLogs = useCallback((agentName: string) => {
    if (!isMounted.current) return;
    toast(`Logs for ${agentName} would open here`);
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
          <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Test and monitor AI agents</p>
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
            <div className="glass-accent rounded-lg p-5 h-full flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                {getStatusBadge(agent.status)}
              </div>
              <h3 className="text-base font-medium text-white mb-1" style={{ fontFamily: 'var(--font-space-grotesk, "Space Grotesk"), sans-serif' }}>
                {agent.name}
              </h3>
              <p className="text-xs leading-relaxed mb-4" style={{ color: 'var(--text-tertiary)' }}>
                {agent.description}
              </p>
              <div className="flex-1 space-y-4">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid var(--border-glass)',
                      borderRadius: '0.5rem',
                      padding: '0.5rem',
                    }}
                  >
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Success Rate</p>
                    <p className="text-white font-medium" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{agent.successRate}</p>
                  </div>
                  <div
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid var(--border-glass)',
                      borderRadius: '0.5rem',
                      padding: '0.5rem',
                    }}
                  >
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Uptime</p>
                    <p className="text-white font-medium" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{agent.uptime}</p>
                  </div>
                </div>

                {/* Last Run */}
                <div className="flex items-center gap-2 text-sm">
                  {getStatusIcon(agent.status)}
                  <span style={{ color: 'var(--text-tertiary)' }}>Last run: {agent.lastRun}</span>
                </div>

                {/* Version */}
                <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
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
                    className="border-white/10 text-white hover:bg-white/5 hover:border-white/20"
                  >
                    <Settings className="w-3 h-3" />
                  </Button>
                  <Button
                    onClick={() => handleViewLogs(agent.name)}
                    variant="outline"
                    size="sm"
                    className="border-white/10 text-white hover:bg-white/5 hover:border-white/20"
                  >
                    <Clock className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="glass rounded-lg p-6">
        <h3 className="text-base font-medium text-white mb-1" style={{ fontFamily: 'var(--font-space-grotesk, "Space Grotesk"), sans-serif' }}>
          Agent Performance
        </h3>
        <p className="text-xs mb-5" style={{ color: 'var(--text-tertiary)' }}>Overall system metrics</p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid var(--border-glass)',
              borderRadius: '0.5rem',
              padding: '1rem',
            }}
          >
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Total Agents</p>
            <p className="text-2xl font-bold text-white" style={{ fontFamily: 'JetBrains Mono, monospace' }}>3</p>
          </div>
          <div
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid var(--border-glass)',
              borderRadius: '0.5rem',
              padding: '1rem',
            }}
          >
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Active Agents</p>
            <p className="text-2xl font-bold text-green-400" style={{ fontFamily: 'JetBrains Mono, monospace' }}>3</p>
          </div>
          <div
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid var(--border-glass)',
              borderRadius: '0.5rem',
              padding: '1rem',
            }}
          >
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Avg Success Rate</p>
            <p className="text-2xl font-bold text-white" style={{ fontFamily: 'JetBrains Mono, monospace' }}>98.3%</p>
          </div>
          <div
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid var(--border-glass)',
              borderRadius: '0.5rem',
              padding: '1rem',
            }}
          >
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Total Tests Today</p>
            <p className="text-2xl font-bold text-white" style={{ fontFamily: 'JetBrains Mono, monospace' }}>247</p>
          </div>
        </div>
      </div>
    </div>
  );
});

AgentsTab.displayName = 'AgentsTab';

export default AgentsTab;
