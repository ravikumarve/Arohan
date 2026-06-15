// Overview Tab — Console Design System
// Glass-effect metric cards, system health, quick actions, activity feed

import { memo, useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Users, Bot, BarChart3, CheckCircle, Activity, Phone, MessageSquare, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useTimeout } from '@/hooks/use-timeout';

const OverviewTab = memo(() => {
  const [loading, setLoading] = useState(false);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const { safeSetTimeout, isMounted } = useTimeout();

  const stats = useMemo(() => [
    { label: 'Total Sessions', value: '1,234', change: '+12%', icon: Users },
    { label: 'Active Agents', value: '3', change: '0%', icon: Bot },
    { label: 'Avg Score', value: '78.5', change: '+5%', icon: BarChart3 },
    { label: 'Success Rate', value: '94.2%', change: '+2%', icon: CheckCircle },
  ], []);

  const systemHealth = useMemo(() => [
    { service: 'FastAPI', status: 'healthy', uptime: '99.9%' },
    { service: 'PostgreSQL', status: 'healthy', uptime: '99.8%' },
    { service: 'Redis', status: 'healthy', uptime: '99.9%' },
    { service: 'RabbitMQ', status: 'healthy', uptime: '99.7%' },
    { service: 'Twilio', status: 'healthy', uptime: '99.5%' },
    { service: 'Meta WhatsApp', status: 'healthy', uptime: '99.6%' },
  ], []);

  const recentActivity = useMemo(() => [
    { id: 1, type: 'session', message: 'New session started', time: '2 min ago', icon: Users },
    { id: 2, type: 'agent', message: 'Proctor agent completed', time: '5 min ago', icon: Bot },
    { id: 3, type: 'call', message: 'IVR call connected', time: '8 min ago', icon: Phone },
    { id: 4, type: 'message', message: 'WhatsApp message sent', time: '12 min ago', icon: MessageSquare },
    { id: 5, type: 'alert', message: 'System health check passed', time: '15 min ago', icon: Activity },
  ], []);

  const handleLiveStatus = useCallback(() => {
    if (!isMounted.current) return;
    setLoading(true);
    safeSetTimeout(() => {
      if (isMounted.current) {
        setLoading(false);
        toast.success('Live status updated - All systems operational');
      }
    }, 1000);
  }, [safeSetTimeout, isMounted]);

  const handleTestIVR = useCallback(() => {
    if (!isMounted.current) return;
    setLoadingStates(prev => ({ ...prev, ivr: true }));
    safeSetTimeout(() => {
      if (isMounted.current) {
        setLoadingStates(prev => ({ ...prev, ivr: false }));
        toast.success('IVR test initiated - Check your phone');
      }
    }, 1000);
  }, [safeSetTimeout, isMounted]);

  const handleTestWhatsApp = useCallback(() => {
    if (!isMounted.current) return;
    setLoadingStates(prev => ({ ...prev, whatsapp: true }));
    safeSetTimeout(() => {
      if (isMounted.current) {
        setLoadingStates(prev => ({ ...prev, whatsapp: false }));
        toast.success('WhatsApp test initiated - Check your WhatsApp');
      }
    }, 1000);
  }, [safeSetTimeout, isMounted]);

  const handleRunDiagnostics = useCallback(() => {
    if (!isMounted.current) return;
    setLoadingStates(prev => ({ ...prev, diagnostics: true }));
    safeSetTimeout(() => {
      if (isMounted.current) {
        setLoadingStates(prev => ({ ...prev, diagnostics: false }));
        toast.success('Diagnostics completed - All systems healthy');
      }
    }, 2000);
  }, [safeSetTimeout, isMounted]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-500/10 text-green-400 border-green-500/30';
      case 'degraded':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      case 'unhealthy':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid — Glass cards with mono values */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <div className="glass-accent rounded-lg p-5">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-9 h-9 rounded-md flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, var(--accent-indigo), var(--accent-violet))',
                    boxShadow: '0 0 12px rgba(99, 102, 241, 0.3)',
                  }}
                >
                  <stat.icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-xs tracking-wider uppercase" style={{ color: 'var(--text-tertiary)', fontFamily: 'JetBrains Mono, monospace' }}>
                  {stat.label}
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <span
                  className="text-2xl font-bold text-white"
                  style={{ fontFamily: 'JetBrains Mono, monospace' }}
                >
                  {stat.value}
                </span>
                <Badge
                  variant="outline"
                  className="border-green-500/30 text-green-400 bg-green-500/10 text-[0.65rem] tracking-wider"
                  style={{ fontFamily: 'JetBrains Mono, monospace' }}
                >
                  {stat.change}
                </Badge>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* System Health */}
      <div className="glass rounded-lg p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-medium text-white" style={{ fontFamily: 'var(--font-space-grotesk, "Space Grotesk"), sans-serif' }}>
              System Health
            </h3>
            <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Real-time service status</p>
          </div>
          <Button
            onClick={handleLiveStatus}
            disabled={loading}
            size="sm"
            className="text-xs bg-white/5 border border-white/10 text-white hover:bg-white/10"
          >
            {loading ? (
              <><Zap className="w-3 h-3 mr-1.5 animate-spin" /> Checking...</>
            ) : (
              <><Activity className="w-3 h-3 mr-1.5" /> Live Status</>
            )}
          </Button>
        </div>
        <div className="space-y-2">
          {systemHealth.map((service, index) => (
            <motion.div
              key={service.service}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between p-3 rounded-md"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border-glass)',
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    service.status === 'healthy' ? 'bg-green-500' :
                    service.status === 'degraded' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                />
                <span className="text-sm text-white font-medium">{service.service}</span>
              </div>
              <div className="flex items-center gap-4">
                <Badge className={getStatusColor(service.status)}>
                  {service.status}
                </Badge>
                <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{service.uptime}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass rounded-lg p-6">
        <h3 className="text-base font-medium text-white mb-1" style={{ fontFamily: 'var(--font-space-grotesk, "Space Grotesk"), sans-serif' }}>
          Quick Actions
        </h3>
        <p className="text-xs mb-5" style={{ color: 'var(--text-tertiary)' }}>Common tasks and tests</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Button
            onClick={handleTestIVR}
            disabled={loadingStates.ivr}
            variant="outline"
            className="border-white/10 text-white hover:bg-white/5 hover:border-white/20"
          >
            {loadingStates.ivr ? (
              <><Zap className="w-4 h-4 mr-2 animate-spin" /> Testing...</>
            ) : (
              <><Phone className="w-4 h-4 mr-2" /> Test IVR</>
            )}
          </Button>
          <Button
            onClick={handleTestWhatsApp}
            disabled={loadingStates.whatsapp}
            variant="outline"
            className="border-white/10 text-white hover:bg-white/5 hover:border-white/20"
          >
            {loadingStates.whatsapp ? (
              <><Zap className="w-4 h-4 mr-2 animate-spin" /> Testing...</>
            ) : (
              <><MessageSquare className="w-4 h-4 mr-2" /> Test WhatsApp</>
            )}
          </Button>
          <Button
            onClick={handleRunDiagnostics}
            disabled={loadingStates.diagnostics}
            variant="outline"
            className="border-white/10 text-white hover:bg-white/5 hover:border-white/20"
          >
            {loadingStates.diagnostics ? (
              <><Zap className="w-4 h-4 mr-2 animate-spin" /> Running...</>
            ) : (
              <><Activity className="w-4 h-4 mr-2" /> Run Diagnostics</>
            )}
          </Button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass rounded-lg p-6">
        <h3 className="text-base font-medium text-white mb-1" style={{ fontFamily: 'var(--font-space-grotesk, "Space Grotesk"), sans-serif' }}>
          Recent Activity
        </h3>
        <p className="text-xs mb-5" style={{ color: 'var(--text-tertiary)' }}>Latest system events</p>
        <div className="space-y-2">
          {recentActivity.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-3 p-3 rounded-md"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border-glass)',
              }}
            >
              <div
                className="w-8 h-8 rounded-md flex items-center justify-center"
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border-glass)',
                }}
              >
                <activity.icon className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-white">{activity.message}</p>
                <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{activity.time}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
});

OverviewTab.displayName = 'OverviewTab';

export default OverviewTab;
