'use client';

import { useState, useEffect } from 'react';
import { Button } from '@arohan/shared';
import { 
  Activity,
  Cpu,
  HardDrive,
  MemoryStick,
  Network,
  Server,
  Database,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  Thermometer,
  Gauge
} from 'lucide-react';

export default function SystemMonitoringPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Mock system metrics - replace with real API calls
  const systemMetrics = {
    cpu: {
      usage: 45,
      cores: 8,
      temperature: 65,
      status: 'healthy',
    },
    memory: {
      used: 8.2,
      total: 16,
      percentage: 51,
      status: 'healthy',
    },
    disk: {
      used: 450,
      total: 1000,
      percentage: 45,
      status: 'healthy',
    },
    network: {
      inbound: 125.5,
      outbound: 89.3,
      status: 'healthy',
    },
  };

  const services = [
    {
      id: '1',
      name: 'FastAPI Server',
      status: 'healthy',
      uptime: '99.9%',
      responseTime: '45ms',
      lastCheck: '2 seconds ago',
      icon: Server,
    },
    {
      id: '2',
      name: 'PostgreSQL Database',
      status: 'healthy',
      uptime: '99.8%',
      responseTime: '12ms',
      lastCheck: '5 seconds ago',
      icon: Database,
    },
    {
      id: '3',
      name: 'Redis Cache',
      status: 'healthy',
      uptime: '99.9%',
      responseTime: '3ms',
      lastCheck: '1 second ago',
      icon: MemoryStick,
    },
    {
      id: '4',
      name: 'RabbitMQ Queue',
      status: 'degraded',
      uptime: '99.5%',
      responseTime: '150ms',
      lastCheck: '10 seconds ago',
      icon: Activity,
    },
    {
      id: '5',
      name: 'Celery Workers',
      status: 'healthy',
      uptime: '99.7%',
      responseTime: 'N/A',
      lastCheck: '3 seconds ago',
      icon: Cpu,
    },
  ];

  const recentAlerts = [
    {
      id: '1',
      type: 'warning',
      message: 'RabbitMQ queue processing delay detected',
      time: '5 minutes ago',
      service: 'RabbitMQ Queue',
    },
    {
      id: '2',
      type: 'info',
      message: 'Scheduled database backup completed successfully',
      time: '1 hour ago',
      service: 'PostgreSQL Database',
    },
    {
      id: '3',
      type: 'success',
      message: 'System health check passed for all services',
      time: '2 hours ago',
      service: 'System',
    },
  ];

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setLastUpdated(new Date());
    }, 1000);
  };

  useEffect(() => {
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-400 bg-green-900/20 border-green-700';
      case 'degraded':
        return 'text-yellow-400 bg-yellow-900/20 border-yellow-700';
      case 'unhealthy':
        return 'text-red-400 bg-red-900/20 border-red-700';
      default:
        return 'text-gray-400 bg-gray-900/20 border-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-5 h-5" />;
      case 'degraded':
        return <AlertTriangle className="w-5 h-5" />;
      case 'unhealthy':
        return <XCircle className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const getAlertTypeColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'border-yellow-700 bg-yellow-900/20';
      case 'error':
        return 'border-red-700 bg-red-900/20';
      case 'success':
        return 'border-green-700 bg-green-900/20';
      case 'info':
      default:
        return 'border-blue-700 bg-blue-900/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">System Monitoring</h1>
          <p className="text-admin-primary-light mt-1">
            Real-time system metrics and service health status
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-admin-primary-light">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="CPU Usage"
          value={`${systemMetrics.cpu.usage}%`}
          icon={Cpu}
          color="blue"
          details={`${systemMetrics.cpu.cores} cores • ${systemMetrics.cpu.temperature}°C`}
          status={systemMetrics.cpu.status}
        />
        <MetricCard
          title="Memory Usage"
          value={`${systemMetrics.memory.percentage}%`}
          icon={MemoryStick}
          color="purple"
          details={`${systemMetrics.memory.used}GB / ${systemMetrics.memory.total}GB`}
          status={systemMetrics.memory.status}
        />
        <MetricCard
          title="Disk Usage"
          value={`${systemMetrics.disk.percentage}%`}
          icon={HardDrive}
          color="green"
          details={`${systemMetrics.disk.used}GB / ${systemMetrics.disk.total}GB`}
          status={systemMetrics.disk.status}
        />
        <MetricCard
          title="Network"
          value="Active"
          icon={Network}
          color="orange"
          details={`↓ ${systemMetrics.network.inbound}MB/s • ↑ ${systemMetrics.network.outbound}MB/s`}
          status={systemMetrics.network.status}
        />
      </div>

      {/* Services Health */}
      <div className="bg-admin-background-secondary rounded-lg border border-admin-background-tertiary">
        <div className="p-6 border-b border-admin-background-tertiary">
          <h2 className="text-xl font-semibold text-white">Services Health</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                getStatusColor={getStatusColor}
                getStatusIcon={getStatusIcon}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="bg-admin-background-secondary rounded-lg border border-admin-background-tertiary">
        <div className="p-6 border-b border-admin-background-tertiary">
          <h2 className="text-xl font-semibold text-white">Recent Alerts</h2>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            {recentAlerts.map((alert) => (
              <AlertItem
                key={alert.id}
                alert={alert}
                getAlertTypeColor={getAlertTypeColor}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-admin-background-secondary rounded-lg border border-admin-background-tertiary">
          <div className="p-6 border-b border-admin-background-tertiary">
            <h2 className="text-xl font-semibold text-white">Response Times</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <PerformanceBar
                label="API Response"
                value={45}
                max={100}
                color="blue"
              />
              <PerformanceBar
                label="Database Query"
                value={12}
                max={100}
                color="green"
              />
              <PerformanceBar
                label="Cache Hit"
                value={95}
                max={100}
                color="purple"
              />
              <PerformanceBar
                label="Queue Processing"
                value={78}
                max={100}
                color="orange"
              />
            </div>
          </div>
        </div>

        <div className="bg-admin-background-secondary rounded-lg border border-admin-background-tertiary">
          <div className="p-6 border-b border-admin-background-tertiary">
            <h2 className="text-xl font-semibold text-white">Throughput</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <ThroughputCard
                label="Requests/Second"
                value={1250}
                change="+15%"
                trend="up"
                icon={Zap}
              />
              <ThroughputCard
                label="Screenings/Hour"
                value={450}
                change="+8%"
                trend="up"
                icon={Activity}
              />
              <ThroughputCard
                label="Active Sessions"
                value={342}
                change="+12%"
                trend="up"
                icon={Gauge}
              />
              <ThroughputCard
                label="Error Rate"
                value="0.2%"
                change="-0.1%"
                trend="down"
                icon={AlertTriangle}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Metric Card Component
function MetricCard({
  title,
  value,
  icon: Icon,
  color,
  details,
  status,
}: {
  title: string;
  value: string;
  icon: any;
  color: string;
  details: string;
  status: string;
}) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600',
    green: 'from-green-500 to-green-600',
    orange: 'from-orange-500 to-orange-600',
  };

  return (
    <div className="bg-admin-background-secondary rounded-lg p-6 border border-admin-background-tertiary">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${status === 'healthy' ? 'text-green-400 bg-green-900/20 border-green-700' : 'text-yellow-400 bg-yellow-900/20 border-yellow-700'}`}>
          {status === 'healthy' ? <CheckCircle className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
          {status}
        </div>
      </div>
      <h3 className="text-sm font-medium text-admin-primary-light mb-1">{title}</h3>
      <div className="text-2xl font-bold text-white mb-2">{value}</div>
      <p className="text-xs text-admin-primary-light">{details}</p>
    </div>
  );
}

// Service Card Component
function ServiceCard({
  service,
  getStatusColor,
  getStatusIcon,
}: {
  service: any;
  getStatusColor: (status: string) => string;
  getStatusIcon: (status: string) => any;
}) {
  const Icon = service.icon;

  return (
    <div className="bg-admin-background-tertiary rounded-lg p-4 border border-admin-background-tertiary hover:border-admin-primary/50 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${getStatusColor(service.status)}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-white">{service.name}</h3>
            <p className="text-xs text-admin-primary-light">{service.uptime} uptime</p>
          </div>
        </div>
        {getStatusIcon(service.status)}
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-admin-primary-light">Response Time</span>
          <span className="text-white">{service.responseTime}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-admin-primary-light">Last Check</span>
          <span className="text-white">{service.lastCheck}</span>
        </div>
      </div>
    </div>
  );
}

// Alert Item Component
function AlertItem({
  alert,
  getAlertTypeColor,
}: {
  alert: any;
  getAlertTypeColor: (type: string) => string;
}) {
  return (
    <div className={`flex items-start gap-3 p-4 rounded-lg border ${getAlertTypeColor(alert.type)}`}>
      <div className="mt-1">
        {alert.type === 'warning' && <AlertTriangle className="w-5 h-5 text-yellow-400" />}
        {alert.type === 'error' && <XCircle className="w-5 h-5 text-red-400" />}
        {alert.type === 'success' && <CheckCircle className="w-5 h-5 text-green-400" />}
        {alert.type === 'info' && <Clock className="w-5 h-5 text-blue-400" />}
      </div>
      <div className="flex-1">
        <p className="text-sm text-white">{alert.message}</p>
        <p className="text-xs text-admin-primary-light mt-1">
          {alert.service} • {alert.time}
        </p>
      </div>
    </div>
  );
}

// Performance Bar Component
function PerformanceBar({
  label,
  value,
  max,
  color,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
}) {
  const percentage = (value / max) * 100;
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
  };

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-admin-primary-light">{label}</span>
        <span className="text-white">{value}ms</span>
      </div>
      <div className="w-full bg-admin-background-tertiary rounded-full h-2">
        <div
          className={`h-2 rounded-full ${colorClasses[color as keyof typeof colorClasses]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// Throughput Card Component
function ThroughputCard({
  label,
  value,
  change,
  trend,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down';
  icon: any;
}) {
  return (
    <div className="flex items-center justify-between p-3 bg-admin-background-tertiary rounded-lg">
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-admin-primary" />
        <div>
          <p className="text-xs text-admin-primary-light">{label}</p>
          <p className="text-sm font-medium text-white">{value}</p>
        </div>
      </div>
      <div className={`text-sm ${trend === 'up' ? 'text-admin-success' : 'text-admin-danger'}`}>
        {trend === 'up' ? '↑' : '↓'} {change}
      </div>
    </div>
  );
}
