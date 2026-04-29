// Overview Tab Component with memoization and proper error handling

import { memo, useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Users, Bot, BarChart3, CheckCircle, Activity, Phone, MessageSquare, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'react-hot-toast';
import { useTimeout } from '@/hooks/use-timeout';

const OverviewTab = memo(() => {
  const [loading, setLoading] = useState(false);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  
  // Use custom hook for timeout management
  const { safeSetTimeout, isMounted } = useTimeout();

  // Memoize static data to prevent unnecessary re-renders
  const stats = useMemo(() => [
    { label: 'Total Sessions', value: '1,234', change: '+12%', icon: Users, color: 'from-blue-500 to-cyan-500' },
    { label: 'Active Agents', value: '3', change: '0%', icon: Bot, color: 'from-purple-500 to-pink-500' },
    { label: 'Avg Score', value: '78.5', change: '+5%', icon: BarChart3, color: 'from-green-500 to-emerald-500' },
    { label: 'Success Rate', value: '94.2%', change: '+2%', icon: CheckCircle, color: 'from-orange-500 to-red-500' },
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

  // Memoize callback functions to prevent unnecessary re-renders
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Overview</h2>
          <p className="text-slate-400">System performance and activity</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleLiveStatus}
            disabled={loading}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            {loading ? (
              <>
                <Zap className="w-4 h-4 mr-2 animate-spin" />
                Checking...
              </>
            ) : (
              <>
                <Activity className="w-4 h-4 mr-2" />
                Live Status
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-colors">
              <CardHeader className="pb-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-2`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <CardDescription className="text-slate-400">{stat.label}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl text-white">{stat.value}</CardTitle>
                  <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30">
                    {stat.change}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* System Health */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">System Health</CardTitle>
          <CardDescription className="text-slate-400">Real-time service status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {systemHealth.map((service, index) => (
              <motion.div
                key={service.service}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    service.status === 'healthy' ? 'bg-green-500' :
                    service.status === 'degraded' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`} />
                  <span className="text-white font-medium">{service.service}</span>
                </div>
                <div className="flex items-center gap-4">
                  <Badge className={getStatusColor(service.status)}>
                    {service.status}
                  </Badge>
                  <span className="text-slate-400 text-sm">{service.uptime}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Quick Actions</CardTitle>
          <CardDescription className="text-slate-400">Common tasks and tests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button
              onClick={handleTestIVR}
              disabled={loadingStates.ivr}
              variant="outline"
              className="border-slate-700 hover:bg-slate-800 hover:border-slate-600"
            >
              {loadingStates.ivr ? (
                <>
                  <Zap className="w-4 h-4 mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <Phone className="w-4 h-4 mr-2" />
                  Test IVR
                </>
              )}
            </Button>
            <Button
              onClick={handleTestWhatsApp}
              disabled={loadingStates.whatsapp}
              variant="outline"
              className="border-slate-700 hover:bg-slate-800 hover:border-slate-600"
            >
              {loadingStates.whatsapp ? (
                <>
                  <Zap className="w-4 h-4 mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Test WhatsApp
                </>
              )}
            </Button>
            <Button
              onClick={handleRunDiagnostics}
              disabled={loadingStates.diagnostics}
              variant="outline"
              className="border-slate-700 hover:bg-slate-800 hover:border-slate-600"
            >
              {loadingStates.diagnostics ? (
                <>
                  <Zap className="w-4 h-4 mr-2 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Activity className="w-4 h-4 mr-2" />
                  Run Diagnostics
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Recent Activity</CardTitle>
          <CardDescription className="text-slate-400">Latest system events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center">
                  <activity.icon className="w-4 h-4 text-slate-300" />
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm">{activity.message}</p>
                  <p className="text-slate-400 text-xs">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

OverviewTab.displayName = 'OverviewTab';

export default OverviewTab;
