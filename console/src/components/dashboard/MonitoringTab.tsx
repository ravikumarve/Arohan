// Monitoring Tab Component with memoization — Glass design system

import { memo, useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Activity, Cpu, HardDrive, MemoryStick, AlertTriangle, CheckCircle, Clock, Zap, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { LoadingSpinner } from '@/components/ui/loading/LoadingSpinner';
import { useTimeout } from '@/hooks/use-timeout';

const MonitoringTab = memo(() => {
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  
  // Use custom hook for timeout management
  const { safeSetTimeout, isMounted } = useTimeout();

  // Memoize system metrics
  const systemMetrics = useMemo(() => ({
    cpu: {
      usage: 45,
      cores: 4,
      temperature: 52,
    },
    memory: {
      used: 8.2,
      total: 16,
      percentage: 51,
    },
    disk: {
      used: 120,
      total: 500,
      percentage: 24,
    },
    network: {
      inbound: 125.5,
      outbound: 98.3,
    },
  }), []);

  // Memoize service status
  const services = useMemo(() => [
    {
      name: 'FastAPI',
      status: 'healthy' as const,
      uptime: '99.9%',
      lastCheck: '2 seconds ago',
      responseTime: '45ms',
      requests: '1,234/min',
    },
    {
      name: 'Celery Workers',
      status: 'healthy' as const,
      uptime: '99.8%',
      lastCheck: '5 seconds ago',
      responseTime: '120ms',
      requests: '567/min',
    },
    {
      name: 'Redis',
      status: 'healthy' as const,
      uptime: '99.9%',
      lastCheck: '1 second ago',
      responseTime: '2ms',
      requests: '2,345/min',
    },
    {
      name: 'RabbitMQ',
      status: 'healthy' as const,
      uptime: '99.7%',
      lastCheck: '3 seconds ago',
      responseTime: '8ms',
      requests: '890/min',
    },
    {
      name: 'PostgreSQL',
      status: 'healthy' as const,
      uptime: '99.9%',
      lastCheck: '4 seconds ago',
      responseTime: '15ms',
      requests: '456/min',
    },
    {
      name: 'Pinecone',
      status: 'healthy' as const,
      uptime: '99.5%',
      lastCheck: '10 seconds ago',
      responseTime: '85ms',
      requests: '123/min',
    },
  ], []);

  // Memoize recent alerts
  const alerts = useMemo(() => [
    {
      id: 'ALT-001',
      severity: 'warning' as const,
      message: 'High CPU usage detected on worker-2',
      timestamp: '5 minutes ago',
      service: 'Celery Workers',
    },
    {
      id: 'ALT-002',
      severity: 'info' as const,
      message: 'Database backup completed successfully',
      timestamp: '15 minutes ago',
      service: 'PostgreSQL',
    },
    {
      id: 'ALT-003',
      severity: 'critical' as const,
      message: 'API rate limit exceeded for client-123',
      timestamp: '30 minutes ago',
      service: 'FastAPI',
    },
    {
      id: 'ALT-004',
      severity: 'info' as const,
      message: 'New deployment deployed to production',
      timestamp: '1 hour ago',
      service: 'System',
    },
  ], []);

  const handleRefresh = useCallback(() => {
    if (!isMounted.current) return;
    
    setLoading(true);
    safeSetTimeout(() => {
      if (isMounted.current) {
        setLoading(false);
        toast.success('Monitoring data refreshed');
      }
    }, 1000);
  }, [safeSetTimeout, isMounted]);

  const handleViewLogs = useCallback((serviceName: string) => {
    if (!isMounted.current) return;
    toast.info(`Logs for ${serviceName} would open here`);
  }, [isMounted]);

  const handleViewAlert = useCallback((alertId: string) => {
    if (!isMounted.current) return;
    toast.info(`Alert details for ${alertId} would open here`);
  }, [isMounted]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return <Badge className="bg-green-500/10 text-green-400 border-green-500/30">Healthy</Badge>;
      case 'degraded':
        return <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/30">Degraded</Badge>;
      case 'down':
        return <Badge className="bg-red-500/10 text-red-400 border-red-500/30">Down</Badge>;
      default:
        return <Badge className="bg-slate-500/10 text-slate-400 border-slate-500/30">Unknown</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'degraded':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'down':
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  const getAlertSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Badge className="bg-red-500/10 text-red-400 border-red-500/30">Critical</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/30">Warning</Badge>;
      case 'info':
        return <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/30">Info</Badge>;
      default:
        return <Badge className="bg-slate-500/10 text-slate-400 border-slate-500/30">Unknown</Badge>;
    }
  };

  const getAlertSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'info':
        return <CheckCircle className="w-4 h-4 text-blue-400" />;
      default:
        return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  const getMetricColor = (value: number) => {
    if (value >= 80) return 'text-red-400';
    if (value >= 60) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getMetricBarColor = (value: number) => {
    if (value >= 80) return 'bg-red-500';
    if (value >= 60) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">System Monitoring</h2>
          <p style={{ color: 'var(--text-tertiary)' }}>Real-time system health and performance metrics</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleRefresh}
            disabled={loading}
            variant="outline"
            className="border-white/10 text-white hover:bg-white/5 hover:border-white/20"
          >
            {loading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </>
            )}
          </Button>
          <Button
            onClick={() => setAutoRefresh(!autoRefresh)}
            variant={autoRefresh ? 'default' : 'outline'}
            className={autoRefresh ? 'bg-green-600 hover:bg-green-700' : 'border-white/10 text-white hover:bg-white/5 hover:border-white/20'}
          >
            <Zap className="w-4 h-4 mr-2" />
            Auto Refresh
          </Button>
        </div>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CPU */}
        <div className="glass rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs tracking-wider uppercase" style={{ color: 'var(--text-tertiary)', fontFamily: 'JetBrains Mono, monospace' }}>CPU Usage</span>
            <Cpu className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-2xl font-bold ${getMetricColor(systemMetrics.cpu.usage)}`} style={{ fontFamily: 'JetBrains Mono, monospace' }}>
              {systemMetrics.cpu.usage}%
            </span>
            <TrendingUp className="w-4 h-4 text-green-400" />
          </div>
          <div className="w-full rounded-full h-2 mb-2" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <div
              className={`${getMetricBarColor(systemMetrics.cpu.usage)} h-2 rounded-full transition-all`}
              style={{ width: `${systemMetrics.cpu.usage}%` }}
            />
          </div>
          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
            {systemMetrics.cpu.cores} cores • {systemMetrics.cpu.temperature}°C
          </p>
        </div>

        {/* Memory */}
        <div className="glass rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs tracking-wider uppercase" style={{ color: 'var(--text-tertiary)', fontFamily: 'JetBrains Mono, monospace' }}>Memory Usage</span>
            <MemoryStick className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-2xl font-bold ${getMetricColor(systemMetrics.memory.percentage)}`} style={{ fontFamily: 'JetBrains Mono, monospace' }}>
              {systemMetrics.memory.percentage}%
            </span>
            <TrendingDown className="w-4 h-4 text-green-400" />
          </div>
          <div className="w-full rounded-full h-2 mb-2" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <div
              className={`${getMetricBarColor(systemMetrics.memory.percentage)} h-2 rounded-full transition-all`}
              style={{ width: `${systemMetrics.memory.percentage}%` }}
            />
          </div>
          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
            {systemMetrics.memory.used}GB / {systemMetrics.memory.total}GB
          </p>
        </div>

        {/* Disk */}
        <div className="glass rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs tracking-wider uppercase" style={{ color: 'var(--text-tertiary)', fontFamily: 'JetBrains Mono, monospace' }}>Disk Usage</span>
            <HardDrive className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-2xl font-bold ${getMetricColor(systemMetrics.disk.percentage)}`} style={{ fontFamily: 'JetBrains Mono, monospace' }}>
              {systemMetrics.disk.percentage}%
            </span>
            <TrendingUp className="w-4 h-4 text-green-400" />
          </div>
          <div className="w-full rounded-full h-2 mb-2" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <div
              className={`${getMetricBarColor(systemMetrics.disk.percentage)} h-2 rounded-full transition-all`}
              style={{ width: `${systemMetrics.disk.percentage}%` }}
            />
          </div>
          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
            {systemMetrics.disk.used}GB / {systemMetrics.disk.total}GB
          </p>
        </div>

        {/* Network */}
        <div className="glass rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs tracking-wider uppercase" style={{ color: 'var(--text-tertiary)', fontFamily: 'JetBrains Mono, monospace' }}>Network</span>
            <Activity className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Inbound</span>
              <span className="text-sm font-medium text-green-400" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                {systemMetrics.network.inbound} MB/s
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Outbound</span>
              <span className="text-sm font-medium text-blue-400" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                {systemMetrics.network.outbound} MB/s
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Services Status */}
      <div className="glass rounded-lg p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-medium text-white" style={{ fontFamily: 'var(--font-space-grotesk, "Space Grotesk"), sans-serif' }}>
              Service Status
            </h3>
            <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Health check for all services</p>
          </div>
        </div>
        <div className="space-y-2">
          {services.map((service, index) => (
            <motion.div
              key={service.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-4 p-4 rounded-lg"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border-glass)',
              }}
            >
              <div className="flex items-center gap-3 flex-1">
                {getStatusIcon(service.status)}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-white font-medium">{service.name}</p>
                    {getStatusBadge(service.status)}
                  </div>
                  <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--text-tertiary)' }}>
                    <span>Uptime: {service.uptime}</span>
                    <span>Response: {service.responseTime}</span>
                    <span>Requests: {service.requests}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{service.lastCheck}</span>
                <Button
                  onClick={() => handleViewLogs(service.name)}
                  variant="ghost"
                  size="sm"
                  className="text-white/60 hover:text-white hover:bg-white/5"
                >
                  Logs
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="glass rounded-lg p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-medium text-white" style={{ fontFamily: 'var(--font-space-grotesk, "Space Grotesk"), sans-serif' }}>
              Recent Alerts
            </h3>
            <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>System notifications and warnings</p>
          </div>
        </div>
        <div className="space-y-2">
          {alerts.map((alert, index) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-4 p-4 rounded-lg"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border-glass)',
              }}
            >
              <div className="flex items-center gap-3 flex-1">
                {getAlertSeverityIcon(alert.severity)}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-white font-medium">{alert.message}</p>
                    {getAlertSeverityBadge(alert.severity)}
                  </div>
                  <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--text-tertiary)' }}>
                    <span>{alert.service}</span>
                    <span>{alert.timestamp}</span>
                  </div>
                </div>
              </div>
              <Button
                onClick={() => handleViewAlert(alert.id)}
                variant="ghost"
                size="sm"
                className="text-white/60 hover:text-white hover:bg-white/5"
              >
                View
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
});

MonitoringTab.displayName = 'MonitoringTab';

export default MonitoringTab;
