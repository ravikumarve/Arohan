// Monitoring Tab Component with memoization

import { memo, useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Activity, Cpu, HardDrive, MemoryStick, AlertTriangle, CheckCircle, Clock, Zap, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'react-hot-toast';
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
          <p className="text-slate-400">Real-time system health and performance metrics</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleRefresh}
            disabled={loading}
            variant="outline"
            className="border-slate-700 hover:bg-slate-800"
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
            className={autoRefresh ? 'bg-green-600 hover:bg-green-700' : 'border-slate-700 hover:bg-slate-800'}
          >
            <Zap className="w-4 h-4 mr-2" />
            Auto Refresh
          </Button>
        </div>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CPU */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-slate-400">CPU Usage</CardTitle>
              <Cpu className="w-4 h-4 text-slate-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-2xl font-bold ${getMetricColor(systemMetrics.cpu.usage)}`}>
                {systemMetrics.cpu.usage}%
              </span>
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 mb-2">
              <div
                className={`${getMetricBarColor(systemMetrics.cpu.usage)} h-2 rounded-full transition-all`}
                style={{ width: `${systemMetrics.cpu.usage}%` }}
              />
            </div>
            <p className="text-xs text-slate-400">
              {systemMetrics.cpu.cores} cores • {systemMetrics.cpu.temperature}°C
            </p>
          </CardContent>
        </Card>

        {/* Memory */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-slate-400">Memory Usage</CardTitle>
              <MemoryStick className="w-4 h-4 text-slate-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-2xl font-bold ${getMetricColor(systemMetrics.memory.percentage)}`}>
                {systemMetrics.memory.percentage}%
              </span>
              <TrendingDown className="w-4 h-4 text-green-400" />
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 mb-2">
              <div
                className={`${getMetricBarColor(systemMetrics.memory.percentage)} h-2 rounded-full transition-all`}
                style={{ width: `${systemMetrics.memory.percentage}%` }}
              />
            </div>
            <p className="text-xs text-slate-400">
              {systemMetrics.memory.used}GB / {systemMetrics.memory.total}GB
            </p>
          </CardContent>
        </Card>

        {/* Disk */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-slate-400">Disk Usage</CardTitle>
              <HardDrive className="w-4 h-4 text-slate-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-2xl font-bold ${getMetricColor(systemMetrics.disk.percentage)}`}>
                {systemMetrics.disk.percentage}%
              </span>
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 mb-2">
              <div
                className={`${getMetricBarColor(systemMetrics.disk.percentage)} h-2 rounded-full transition-all`}
                style={{ width: `${systemMetrics.disk.percentage}%` }}
              />
            </div>
            <p className="text-xs text-slate-400">
              {systemMetrics.disk.used}GB / {systemMetrics.disk.total}GB
            </p>
          </CardContent>
        </Card>

        {/* Network */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-slate-400">Network</CardTitle>
              <Activity className="w-4 h-4 text-slate-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Inbound</span>
                <span className="text-sm font-medium text-green-400">
                  {systemMetrics.network.inbound} MB/s
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Outbound</span>
                <span className="text-sm font-medium text-blue-400">
                  {systemMetrics.network.outbound} MB/s
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Services Status */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Service Status</CardTitle>
          <CardDescription className="text-slate-400">Health check for all services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {services.map((service, index) => (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-4 p-4 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors border border-slate-700/50 hover:border-slate-700"
              >
                <div className="flex items-center gap-3 flex-1">
                  {getStatusIcon(service.status)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-white font-medium">{service.name}</p>
                      {getStatusBadge(service.status)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <span>Uptime: {service.uptime}</span>
                      <span>Response: {service.responseTime}</span>
                      <span>Requests: {service.requests}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">{service.lastCheck}</span>
                  <Button
                    onClick={() => handleViewLogs(service.name)}
                    variant="ghost"
                    size="sm"
                    className="text-slate-400 hover:text-white hover:bg-slate-700"
                  >
                    Logs
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Alerts */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Recent Alerts</CardTitle>
          <CardDescription className="text-slate-400">System notifications and warnings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {alerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-4 p-4 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors border border-slate-700/50 hover:border-slate-700"
              >
                <div className="flex items-center gap-3 flex-1">
                  {getAlertSeverityIcon(alert.severity)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-white font-medium">{alert.message}</p>
                      {getAlertSeverityBadge(alert.severity)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <span>{alert.service}</span>
                      <span>{alert.timestamp}</span>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => handleViewAlert(alert.id)}
                  variant="ghost"
                  size="sm"
                  className="text-slate-400 hover:text-white hover:bg-slate-700"
                >
                  View
                </Button>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

MonitoringTab.displayName = 'MonitoringTab';

export default MonitoringTab;
