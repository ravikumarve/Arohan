// Integrations Tab — Console Design System
// Glass-effect integration cards, health stats, connection management

import { memo, useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plug, CheckCircle, XCircle, AlertCircle, Settings, RefreshCw, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { LoadingSpinner } from '@/components/ui/loading/LoadingSpinner';
import { useTimeout } from '@/hooks/use-timeout';

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

  const { safeSetTimeout, isMounted } = useTimeout();

  const integrations = useMemo(() => [
    {
      id: 'twilio',
      name: 'Twilio',
      description: 'IVR calling and SMS notifications',
      status: 'connected' as const,
      version: '8.x',
      lastSync: '2 minutes ago',
      icon: '\u{1F4DE}',
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
      icon: '\u{1F4AC}',
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
      icon: '\u{1F50D}',
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
      icon: '\u{1F3A4}',
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
      icon: '\u{1F916}',
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
      icon: '\u26A1',
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
      icon: '\u{1F4EC}',
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
      icon: '\u{1F5C4}\uFE0F',
      category: 'Database',
      docsUrl: 'https://www.postgresql.org/docs',
    },
  ], []);

  const handleToggleIntegration = useCallback((integrationId: string) => {
    if (!isMounted.current) return;

    setIntegrationStates(prev => ({ ...prev, [integrationId]: !prev[integrationId] }));
    toast.success(`${integrationId} ${integrationStates[integrationId] ? 'disabled' : 'enabled'}`);
  }, [integrationStates, isMounted]);

  const handleTestConnection = useCallback((integrationId: string) => {
    if (!isMounted.current) return;

    setLoadingStates(prev => ({ ...prev, [integrationId]: true }));

    safeSetTimeout(() => {
      if (isMounted.current) {
        setLoadingStates(prev => ({ ...prev, [integrationId]: false }));
        toast.success(`${integrationId} connection test successful`);
      }
    }, 2000);
  }, [safeSetTimeout, isMounted]);

  const handleSync = useCallback((integrationId: string) => {
    if (!isMounted.current) return;

    setLoadingStates(prev => ({ ...prev, [integrationId]: true }));

    safeSetTimeout(() => {
      if (isMounted.current) {
        setLoadingStates(prev => ({ ...prev, [integrationId]: false }));
        toast.success(`${integrationId} synced successfully`);
      }
    }, 1500);
  }, [safeSetTimeout, isMounted]);

  const handleConfigure = useCallback((integrationId: string) => {
    if (!isMounted.current) return;
    toast.info(`Configuration panel for ${integrationId} would open here`);
  }, [isMounted]);

  const handleAddIntegration = useCallback(() => {
    if (!isMounted.current) return;
    toast.info('Add integration form coming soon');
  }, [isMounted]);

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
          <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-space-grotesk, "Space Grotesk"), sans-serif' }}>
            Integrations
          </h2>
          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Manage third-party service connections</p>
        </div>
        <Button onClick={handleAddIntegration} className="bg-white/5 border border-white/10 text-white hover:bg-white/10">
          <Plug className="w-4 h-4 mr-2" />
          Add Integration
        </Button>
      </div>

      {/* Integration Categories */}
      {Object.entries(groupedIntegrations).map(([category, categoryIntegrations], categoryIndex) => (
        <div key={category} className="space-y-4">
          <h3 className="text-lg font-semibold text-white" style={{ fontFamily: 'var(--font-space-grotesk, "Space Grotesk"), sans-serif' }}>
            {category}
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {categoryIntegrations.map((integration, index) => (
              <motion.div
                key={integration.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (categoryIndex * 0.1) + (index * 0.05) }}
              >
                <div className="glass-accent rounded-lg p-5 hover:border-white/20 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-2xl"
                        style={{
                          background: 'var(--surface)',
                          border: '1px solid var(--border-glass)',
                        }}
                      >
                        {integration.icon}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">{integration.name}</div>
                        <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                          {integration.version}
                        </p>
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

                  <p className="text-xs mb-4 line-clamp-2" style={{ color: 'var(--text-tertiary)' }}>
                    {integration.description}
                  </p>

                  <div className="flex items-center gap-2 text-sm mb-4">
                    {getStatusIcon(integration.status)}
                    <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Last sync: {integration.lastSync}</span>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-white/5">
                    <Button
                      onClick={() => handleTestConnection(integration.id)}
                      disabled={loadingStates[integration.id]}
                      variant="outline"
                      size="sm"
                      className="flex-1 border-white/10 text-white hover:bg-white/5 hover:border-white/20"
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
                      className="border-white/10 text-white hover:bg-white/5 hover:border-white/20"
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
                      className="border-white/10 text-white hover:bg-white/5 hover:border-white/20"
                    >
                      <Settings className="w-3 h-3" />
                    </Button>
                    <Button
                      onClick={() => window.open(integration.docsUrl, '_blank')}
                      variant="outline"
                      size="sm"
                      className="border-white/10 text-white hover:bg-white/5 hover:border-white/20"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}

      {/* Integration Health */}
      <div className="glass rounded-lg p-6">
        <h3 className="text-base font-medium text-white mb-1" style={{ fontFamily: 'var(--font-space-grotesk, "Space Grotesk"), sans-serif' }}>
          Integration Health
        </h3>
        <p className="text-xs mb-5" style={{ color: 'var(--text-tertiary)' }}>Overall system connectivity</p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Integrations', value: integrations.length, valueClass: 'text-white' },
            { label: 'Connected', value: integrations.filter(i => i.status === 'connected').length, valueClass: 'text-green-400' },
            { label: 'Active', value: Object.values(integrationStates).filter(Boolean).length, valueClass: 'text-white' },
            { label: 'Categories', value: Object.keys(groupedIntegrations).length, valueClass: 'text-white' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="text-center"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border-glass)',
                borderRadius: '0.5rem',
                padding: '1rem',
              }}
            >
              <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.valueClass}`} style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

IntegrationsTab.displayName = 'IntegrationsTab';

export default IntegrationsTab;
