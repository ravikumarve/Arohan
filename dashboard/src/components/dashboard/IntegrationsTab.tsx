// Integrations Tab Component with memoization

import { memo, useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plug, CheckCircle, XCircle, AlertCircle, Settings, RefreshCw, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { toast } from 'react-hot-toast';
import { LoadingSpinner } from '@/components/ui/loading/LoadingSpinner';

const IntegrationsTab = memo(() => {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const [integrationStates, setIntegrationStates] = useState<Record<string, boolean>>({
    twilio: true,
    meta: true,
    pinecone: true,
    bhashini: true,
    openai: true,
    redis: true,
    rabbitmq: true,
    postgresql: true,
  });

  // Memoize integrations data
  const integrations = useMemo(() => [
    {
      id: 'twilio',
      name: 'Twilio',
      description: 'IVR calling and SMS notifications',
      status: 'connected' as const,
      version: '8.x',
      lastSync: '2 minutes ago',
      icon: '📞',
      category: 'Communication',
      docsUrl: 'https://www.twilio.com/docs',
    },
    {
      id: 'meta',
      name: 'Meta (WhatsApp)',
      description: 'WhatsApp Business API for candidate communication',
      status: 'connected' as const,
      version: 'v18.0',
      lastSync: '5 minutes ago',
      icon: '💬',
      category: 'Communication',
      docsUrl: 'https://developers.facebook.com/docs/whatsapp',
    },
    {
      id: 'pinecone',
      name: 'Pinecone',
      description: 'Vector database for trait embedding similarity',
      status: 'connected' as const,
      version: '2.x',
      lastSync: '10 minutes ago',
      icon: '🔍',
      category: 'Database',
      docsUrl: 'https://docs.pinecone.io',
    },
    {
      id: 'bhashini',
      name: 'Bhashini',
      description: 'Government STT API for 22 Indian languages',
      status: 'connected' as const,
      version: 'v1',
      lastSync: '15 minutes ago',
      icon: '🎤',
      category: 'AI/ML',
      docsUrl: 'https://bhashini.ai',
    },
    {
      id: 'openai',
      name: 'OpenAI Whisper',
      description: 'Fallback STT for English and on-premise deployments',
      status: 'connected' as const,
      version: 'v3',
      lastSync: '20 minutes ago',
      icon: '🤖',
      category: 'AI/ML',
      docsUrl: 'https://platform.openai.com/docs',
    },
    {
      id: 'redis',
      name: 'Redis',
      description: 'Session state and LangGraph checkpointing',
      status: 'connected' as const,
      version: '7.x',
      lastSync: '1 minute ago',
      icon: '⚡',
      category: 'Database',
      docsUrl: 'https://redis.io/docs',
    },
    {
      id: 'rabbitmq',
      name: 'RabbitMQ',
      description: 'Task queue for audio processing',
      status: 'connected' as const,
      version: '3.12',
      lastSync: '3 minutes ago',
      icon: '📬',
      category: 'Infrastructure',
      docsUrl: 'https://www.rabbitmq.com/docs',
    },
    {
      id: 'postgresql',
      name: 'PostgreSQL',
      description: 'Primary database for candidates and requisitions',
      status: 'connected' as const,
      version: '15',
      lastSync: '5 minutes ago',
      icon: '🗄️',
      category: 'Database',
      docsUrl: 'https://www.postgresql.org/docs',
    },
  ], []);

  const handleToggleIntegration = useCallback((integrationId: string) => {
    setIntegrationStates(prev => ({ ...prev, [integrationId]: !prev[integrationId] }));
    toast.success(`${integrationId} ${integrationStates[integrationId] ? 'disabled' : 'enabled'}`);
  }, [integrationStates]);

  const handleTestConnection = useCallback((integrationId: string) => {
    setLoadingStates(prev => ({ ...prev, [integrationId]: true }));
    
    // Simulate API call
    setTimeout(() => {
      setLoadingStates(prev => ({ ...prev, [integrationId]: false }));
      toast.success(`${integrationId} connection test successful`);
    }, 2000);
  }, []);

  const handleSync = useCallback((integrationId: string) => {
    setLoadingStates(prev => ({ ...prev, [integrationId]: true }));
    
    // Simulate API call
    setTimeout(() => {
      setLoadingStates(prev => ({ ...prev, [integrationId]: false }));
      toast.success(`${integrationId} synced successfully`);
    }, 1500);
  }, []);

  const handleConfigure = useCallback((integrationId: string) => {
    toast.info(`Configuration panel for ${integrationId} would open here`);
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-500/10 text-green-400 border-green-500/30">Connected</Badge>;
      case 'disconnected':
        return <Badge className="bg-red-500/10 text-red-400 border-red-500/30">Disconnected</Badge>;
      case 'error':
        return <Badge className="bg-red-500/10 text-red-400 border-red-500/30">Error</Badge>;
      case 'syncing':
        return <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/30">Syncing</Badge>;
      default:
        return <Badge className="bg-slate-500/10 text-slate-400 border-slate-500/30">Unknown</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'disconnected':
        return <XCircle className="w-4 h-4 text-red-400" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-400" />;
      case 'syncing':
        return <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />;
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-400" />;
    }
  };

  // Group integrations by category
  const groupedIntegrations = useMemo(() => {
    const groups: Record<string, typeof integrations> = {};
    integrations.forEach(integration => {
      if (!groups[integration.category]) {
        groups[integration.category] = [];
      }
      groups[integration.category].push(integration);
    });
    return groups;
  }, [integrations]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Integrations</h2>
          <p className="text-slate-400">Manage third-party service connections</p>
        </div>
        <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
          <Plug className="w-4 h-4 mr-2" />
          Add Integration
        </Button>
      </div>

      {/* Integration Categories */}
      {Object.entries(groupedIntegrations).map(([category, categoryIntegrations], categoryIndex) => (
        <div key={category} className="space-y-4">
          <h3 className="text-lg font-semibold text-white">{category}</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {categoryIntegrations.map((integration, index) => (
              <motion.div
                key={integration.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (categoryIndex * 0.1) + (index * 0.05) }}
              >
                <Card className="bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-2xl">
                          {integration.icon}
                        </div>
                        <div>
                          <CardTitle className="text-white">{integration.name}</CardTitle>
                          <CardDescription className="text-slate-400 text-xs">
                            {integration.version}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(integration.status)}
                        <Switch
                          checked={integrationStates[integration.id]}
                          onCheckedChange={() => handleToggleIntegration(integration.id)}
                        />
                      </div>
                    </div>
                    <CardDescription className="text-slate-400 line-clamp-2">
                      {integration.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Status */}
                    <div className="flex items-center gap-2 text-sm">
                      {getStatusIcon(integration.status)}
                      <span className="text-slate-400">Last sync: {integration.lastSync}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        onClick={() => handleTestConnection(integration.id)}
                        disabled={loadingStates[integration.id]}
                        variant="outline"
                        size="sm"
                        className="flex-1 border-slate-700 hover:bg-slate-800"
                      >
                        {loadingStates[integration.id] ? (
                          <LoadingSpinner size="sm" />
                        ) : (
                          'Test Connection'
                        )}
                      </Button>
                      <Button
                        onClick={() => handleSync(integration.id)}
                        disabled={loadingStates[integration.id]}
                        variant="outline"
                        size="sm"
                        className="border-slate-700 hover:bg-slate-800"
                      >
                        {loadingStates[integration.id] ? (
                          <LoadingSpinner size="sm" />
                        ) : (
                          <RefreshCw className="w-3 h-3" />
                        )}
                      </Button>
                      <Button
                        onClick={() => handleConfigure(integration.id)}
                        variant="outline"
                        size="sm"
                        className="border-slate-700 hover:bg-slate-800"
                      >
                        <Settings className="w-3 h-3" />
                      </Button>
                      <Button
                        onClick={() => window.open(integration.docsUrl, '_blank')}
                        variant="outline"
                        size="sm"
                        className="border-slate-700 hover:bg-slate-800"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      ))}

      {/* Quick Stats */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Integration Health</CardTitle>
          <CardDescription className="text-slate-400">Overall system connectivity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <p className="text-slate-400 text-sm">Total Integrations</p>
              <p className="text-2xl font-bold text-white">{integrations.length}</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <p className="text-slate-400 text-sm">Connected</p>
              <p className="text-2xl font-bold text-green-400">
                {integrations.filter(i => i.status === 'connected').length}
              </p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <p className="text-slate-400 text-sm">Active</p>
              <p className="text-2xl font-bold text-white">
                {Object.values(integrationStates).filter(Boolean).length}
              </p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <p className="text-slate-400 text-sm">Categories</p>
              <p className="text-2xl font-bold text-white">
                {Object.keys(groupedIntegrations).length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

IntegrationsTab.displayName = 'IntegrationsTab';

export default IntegrationsTab;
