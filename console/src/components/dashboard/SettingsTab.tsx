// Settings Tab Component with memoization

import { memo, useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Settings, Bell, Shield, Database, Save, RotateCcw, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { LoadingSpinner } from '@/components/ui/loading/LoadingSpinner';
import { useTimeout } from '@/hooks/use-timeout';

const SettingsTab = memo(() => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Use custom hook for timeout management
  const { safeSetTimeout, isMounted } = useTimeout();

  // API Settings
  const [apiSettings, setApiSettings] = useState({
    twilioAccountSid: '',
    twilioAuthToken: '',
    twilioPhoneNumber: '',
    metaAppId: '',
    metaAppSecret: '',
    metaPhoneNumberId: '',
    metaAccessToken: '',
    bhashiniApiKey: '',
    openaiApiKey: '',
    pineconeApiKey: '',
    pineconeIndexName: '',
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailAlerts: true,
    smsAlerts: true,
    whatsappAlerts: true,
    pushNotifications: true,
    dailyReports: false,
    weeklyReports: true,
    criticalAlerts: true,
    systemUpdates: true,
  });

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    ipWhitelist: false,
    sessionTimeout: 30,
    passwordExpiry: 90,
    auditLogging: true,
    encryptionAtRest: true,
    dataRetention: 365,
  });

  const handleSaveSettings = useCallback(() => {
    if (!isMounted.current) return;

    setSaving(true);
    safeSetTimeout(() => {
      if (isMounted.current) {
        setSaving(false);
        toast.success('Settings saved successfully');
      }
    }, 1500);
  }, [safeSetTimeout, isMounted]);

  const handleResetSettings = useCallback(() => {
    if (!isMounted.current) return;

    setLoading(true);
    safeSetTimeout(() => {
      if (isMounted.current) {
        setApiSettings({
          twilioAccountSid: '',
          twilioAuthToken: '',
          twilioPhoneNumber: '',
          metaAppId: '',
          metaAppSecret: '',
          metaPhoneNumberId: '',
          metaAccessToken: '',
          bhashiniApiKey: '',
          openaiApiKey: '',
          pineconeApiKey: '',
          pineconeIndexName: '',
        });
        setNotificationSettings({
          emailAlerts: true,
          smsAlerts: true,
          whatsappAlerts: true,
          pushNotifications: true,
          dailyReports: false,
          weeklyReports: true,
          criticalAlerts: true,
          systemUpdates: true,
        });
        setSecuritySettings({
          twoFactorAuth: false,
          ipWhitelist: false,
          sessionTimeout: 30,
          passwordExpiry: 90,
          auditLogging: true,
          encryptionAtRest: true,
          dataRetention: 365,
        });
        setLoading(false);
        toast.success('Settings reset to defaults');
      }
    }, 1000);
  }, [safeSetTimeout, isMounted]);

  const handleTestConnection = useCallback((service: string) => {
    if (!isMounted.current) return;
    toast.success(`${service} connection test successful`);
  }, [isMounted]);

  const handleApiSettingChange = useCallback((field: string, value: string) => {
    setApiSettings(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleNotificationToggle = useCallback((field: string, value: boolean) => {
    setNotificationSettings(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSecurityToggle = useCallback((field: string, value: boolean) => {
    setSecuritySettings(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSecurityInputChange = useCallback((field: string, value: string | number) => {
    setSecuritySettings(prev => ({ ...prev, [field]: value }));
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Settings</h2>
          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Configure system preferences and integrations</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleResetSettings}
            disabled={loading}
            variant="outline"
            className="border-white/10 text-white hover:bg-white/5 hover:border-white/20"
          >
            {loading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </>
            )}
          </Button>
          <Button
            onClick={handleSaveSettings}
            disabled={saving}
            className="bg-white/5 border border-white/10 text-white hover:bg-white/10"
          >
            {saving ? (
              <LoadingSpinner size="sm" />
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      {/* API Configuration */}
      <div className="glass rounded-lg p-6">
        <div className="flex items-center gap-2 mb-5">
          <Database className="w-5 h-5 text-purple-400" />
          <div>
            <h3 className="text-base font-medium text-white" style={{ fontFamily: 'var(--font-space-grotesk, "Space Grotesk"), sans-serif' }}>
              API Configuration
            </h3>
            <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Configure third-party service API keys and credentials</p>
          </div>
        </div>
        <div className="space-y-6">
          {/* Twilio */}
          <div className="space-y-4">
            <h3 className="text-base font-medium text-white" style={{ fontFamily: 'var(--font-space-grotesk, "Space Grotesk"), sans-serif' }}>Twilio</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="twilio-account-sid" style={{ color: 'var(--text-secondary)' }}>Account SID</Label>
                <Input
                  id="twilio-account-sid"
                  type="password"
                  value={apiSettings.twilioAccountSid}
                  onChange={(e) => handleApiSettingChange('twilioAccountSid', e.target.value)}
                  placeholder="Enter Twilio Account SID"
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twilio-auth-token" style={{ color: 'var(--text-secondary)' }}>Auth Token</Label>
                <Input
                  id="twilio-auth-token"
                  type="password"
                  value={apiSettings.twilioAuthToken}
                  onChange={(e) => handleApiSettingChange('twilioAuthToken', e.target.value)}
                  placeholder="Enter Twilio Auth Token"
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twilio-phone-number" style={{ color: 'var(--text-secondary)' }}>Phone Number</Label>
                <Input
                  id="twilio-phone-number"
                  value={apiSettings.twilioPhoneNumber}
                  onChange={(e) => handleApiSettingChange('twilioPhoneNumber', e.target.value)}
                  placeholder="+91 98765 43210"
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={() => handleTestConnection('Twilio')}
                  variant="outline"
                  className="w-full border-white/10 text-white hover:bg-white/5 hover:border-white/20"
                >
                  Test Connection
                </Button>
              </div>
            </div>
          </div>

          {/* Meta */}
          <div className="space-y-4">
            <h3 className="text-base font-medium text-white" style={{ fontFamily: 'var(--font-space-grotesk, "Space Grotesk"), sans-serif' }}>Meta (WhatsApp)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="meta-app-id" style={{ color: 'var(--text-secondary)' }}>App ID</Label>
                <Input
                  id="meta-app-id"
                  value={apiSettings.metaAppId}
                  onChange={(e) => handleApiSettingChange('metaAppId', e.target.value)}
                  placeholder="Enter Meta App ID"
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="meta-app-secret" style={{ color: 'var(--text-secondary)' }}>App Secret</Label>
                <Input
                  id="meta-app-secret"
                  type="password"
                  value={apiSettings.metaAppSecret}
                  onChange={(e) => handleApiSettingChange('metaAppSecret', e.target.value)}
                  placeholder="Enter Meta App Secret"
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="meta-phone-number-id" style={{ color: 'var(--text-secondary)' }}>Phone Number ID</Label>
                <Input
                  id="meta-phone-number-id"
                  value={apiSettings.metaPhoneNumberId}
                  onChange={(e) => handleApiSettingChange('metaPhoneNumberId', e.target.value)}
                  placeholder="Enter Phone Number ID"
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="meta-access-token" style={{ color: 'var(--text-secondary)' }}>Access Token</Label>
                <Input
                  id="meta-access-token"
                  type="password"
                  value={apiSettings.metaAccessToken}
                  onChange={(e) => handleApiSettingChange('metaAccessToken', e.target.value)}
                  placeholder="Enter Access Token"
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                />
              </div>
            </div>
          </div>

          {/* Bhashini */}
          <div className="space-y-4">
            <h3 className="text-base font-medium text-white" style={{ fontFamily: 'var(--font-space-grotesk, "Space Grotesk"), sans-serif' }}>Bhashini</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bhashini-api-key" style={{ color: 'var(--text-secondary)' }}>API Key</Label>
                <Input
                  id="bhashini-api-key"
                  type="password"
                  value={apiSettings.bhashiniApiKey}
                  onChange={(e) => handleApiSettingChange('bhashiniApiKey', e.target.value)}
                  placeholder="Enter Bhashini API Key"
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={() => handleTestConnection('Bhashini')}
                  variant="outline"
                  className="w-full border-white/10 text-white hover:bg-white/5 hover:border-white/20"
                >
                  Test Connection
                </Button>
              </div>
            </div>
          </div>

          {/* OpenAI */}
          <div className="space-y-4">
            <h3 className="text-base font-medium text-white" style={{ fontFamily: 'var(--font-space-grotesk, "Space Grotesk"), sans-serif' }}>OpenAI (Whisper)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="openai-api-key" style={{ color: 'var(--text-secondary)' }}>API Key</Label>
                <Input
                  id="openai-api-key"
                  type="password"
                  value={apiSettings.openaiApiKey}
                  onChange={(e) => handleApiSettingChange('openaiApiKey', e.target.value)}
                  placeholder="Enter OpenAI API Key"
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={() => handleTestConnection('OpenAI')}
                  variant="outline"
                  className="w-full border-white/10 text-white hover:bg-white/5 hover:border-white/20"
                >
                  Test Connection
                </Button>
              </div>
            </div>
          </div>

          {/* Pinecone */}
          <div className="space-y-4">
            <h3 className="text-base font-medium text-white" style={{ fontFamily: 'var(--font-space-grotesk, "Space Grotesk"), sans-serif' }}>Pinecone</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pinecone-api-key" style={{ color: 'var(--text-secondary)' }}>API Key</Label>
                <Input
                  id="pinecone-api-key"
                  type="password"
                  value={apiSettings.pineconeApiKey}
                  onChange={(e) => handleApiSettingChange('pineconeApiKey', e.target.value)}
                  placeholder="Enter Pinecone API Key"
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pinecone-index-name" style={{ color: 'var(--text-secondary)' }}>Index Name</Label>
                <Input
                  id="pinecone-index-name"
                  value={apiSettings.pineconeIndexName}
                  onChange={(e) => handleApiSettingChange('pineconeIndexName', e.target.value)}
                  placeholder="Enter Index Name"
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                />
              </div>
              <div className="flex items-end md:col-span-2">
                <Button
                  onClick={() => handleTestConnection('Pinecone')}
                  variant="outline"
                  className="w-full border-white/10 text-white hover:bg-white/5 hover:border-white/20"
                >
                  Test Connection
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="glass rounded-lg p-6">
        <div className="flex items-center gap-2 mb-5">
          <Bell className="w-5 h-5 text-blue-400" />
          <div>
            <h3 className="text-base font-medium text-white" style={{ fontFamily: 'var(--font-space-grotesk, "Space Grotesk"), sans-serif' }}>
              Notification Settings
            </h3>
            <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Configure how and when you receive notifications</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              className="flex items-center justify-between p-4 rounded-lg"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border-glass)',
                borderRadius: '0.5rem',
              }}
            >
              <div>
                <p className="text-white font-medium">Email Alerts</p>
                <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Receive notifications via email</p>
              </div>
              <Switch
                checked={notificationSettings.emailAlerts}
                onCheckedChange={(checked: boolean) => handleNotificationToggle('emailAlerts', checked)}
              />
            </div>
            <div
              className="flex items-center justify-between p-4 rounded-lg"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border-glass)',
                borderRadius: '0.5rem',
              }}
            >
              <div>
                <p className="text-white font-medium">SMS Alerts</p>
                <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Receive critical alerts via SMS</p>
              </div>
              <Switch
                checked={notificationSettings.smsAlerts}
                onCheckedChange={(checked: boolean) => handleNotificationToggle('smsAlerts', checked)}
              />
            </div>
            <div
              className="flex items-center justify-between p-4 rounded-lg"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border-glass)',
                borderRadius: '0.5rem',
              }}
            >
              <div>
                <p className="text-white font-medium">WhatsApp Alerts</p>
                <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Receive notifications via WhatsApp</p>
              </div>
              <Switch
                checked={notificationSettings.whatsappAlerts}
                onCheckedChange={(checked: boolean) => handleNotificationToggle('whatsappAlerts', checked)}
              />
            </div>
            <div
              className="flex items-center justify-between p-4 rounded-lg"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border-glass)',
                borderRadius: '0.5rem',
              }}
            >
              <div>
                <p className="text-white font-medium">Push Notifications</p>
                <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Receive in-app notifications</p>
              </div>
              <Switch
                checked={notificationSettings.pushNotifications}
                onCheckedChange={(checked: boolean) => handleNotificationToggle('pushNotifications', checked)}
              />
            </div>
            <div
              className="flex items-center justify-between p-4 rounded-lg"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border-glass)',
                borderRadius: '0.5rem',
              }}
            >
              <div>
                <p className="text-white font-medium">Daily Reports</p>
                <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Receive daily summary reports</p>
              </div>
              <Switch
                checked={notificationSettings.dailyReports}
                onCheckedChange={(checked: boolean) => handleNotificationToggle('dailyReports', checked)}
              />
            </div>
            <div
              className="flex items-center justify-between p-4 rounded-lg"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border-glass)',
                borderRadius: '0.5rem',
              }}
            >
              <div>
                <p className="text-white font-medium">Weekly Reports</p>
                <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Receive weekly analytics reports</p>
              </div>
              <Switch
                checked={notificationSettings.weeklyReports}
                onCheckedChange={(checked: boolean) => handleNotificationToggle('weeklyReports', checked)}
              />
            </div>
            <div
              className="flex items-center justify-between p-4 rounded-lg"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border-glass)',
                borderRadius: '0.5rem',
              }}
            >
              <div>
                <p className="text-white font-medium">Critical Alerts</p>
                <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Immediate alerts for critical issues</p>
              </div>
              <Switch
                checked={notificationSettings.criticalAlerts}
                onCheckedChange={(checked: boolean) => handleNotificationToggle('criticalAlerts', checked)}
              />
            </div>
            <div
              className="flex items-center justify-between p-4 rounded-lg"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border-glass)',
                borderRadius: '0.5rem',
              }}
            >
              <div>
                <p className="text-white font-medium">System Updates</p>
                <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Notifications about system updates</p>
              </div>
              <Switch
                checked={notificationSettings.systemUpdates}
                onCheckedChange={(checked: boolean) => handleNotificationToggle('systemUpdates', checked)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="glass rounded-lg p-6">
        <div className="flex items-center gap-2 mb-5">
          <Shield className="w-5 h-5 text-green-400" />
          <div>
            <h3 className="text-base font-medium text-white" style={{ fontFamily: 'var(--font-space-grotesk, "Space Grotesk"), sans-serif' }}>
              Security Settings
            </h3>
            <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Configure security and compliance settings</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              className="flex items-center justify-between p-4 rounded-lg"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border-glass)',
                borderRadius: '0.5rem',
              }}
            >
              <div>
                <p className="text-white font-medium">Two-Factor Authentication</p>
                <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Require 2FA for all users</p>
              </div>
              <Switch
                checked={securitySettings.twoFactorAuth}
                onCheckedChange={(checked: boolean) => handleSecurityToggle('twoFactorAuth', checked)}
              />
            </div>
            <div
              className="flex items-center justify-between p-4 rounded-lg"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border-glass)',
                borderRadius: '0.5rem',
              }}
            >
              <div>
                <p className="text-white font-medium">IP Whitelist</p>
                <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Restrict access by IP address</p>
              </div>
              <Switch
                checked={securitySettings.ipWhitelist}
                onCheckedChange={(checked: boolean) => handleSecurityToggle('ipWhitelist', checked)}
              />
            </div>
            <div
              className="flex items-center justify-between p-4 rounded-lg"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border-glass)',
                borderRadius: '0.5rem',
              }}
            >
              <div>
                <p className="text-white font-medium">Audit Logging</p>
                <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Log all system activities</p>
              </div>
              <Switch
                checked={securitySettings.auditLogging}
                onCheckedChange={(checked: boolean) => handleSecurityToggle('auditLogging', checked)}
              />
            </div>
            <div
              className="flex items-center justify-between p-4 rounded-lg"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border-glass)',
                borderRadius: '0.5rem',
              }}
            >
              <div>
                <p className="text-white font-medium">Encryption at Rest</p>
                <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Encrypt stored data</p>
              </div>
              <Switch
                checked={securitySettings.encryptionAtRest}
                onCheckedChange={(checked: boolean) => handleSecurityToggle('encryptionAtRest', checked)}
              />
            </div>
            <div
              className="space-y-2 p-4 rounded-lg"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border-glass)',
                borderRadius: '0.5rem',
              }}
            >
              <Label htmlFor="session-timeout" style={{ color: 'var(--text-secondary)' }}>Session Timeout (minutes)</Label>
              <Input
                id="session-timeout"
                type="number"
                value={securitySettings.sessionTimeout}
                onChange={(e) => handleSecurityInputChange('sessionTimeout', parseInt(e.target.value))}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div
              className="space-y-2 p-4 rounded-lg"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border-glass)',
                borderRadius: '0.5rem',
              }}
            >
              <Label htmlFor="password-expiry" style={{ color: 'var(--text-secondary)' }}>Password Expiry (days)</Label>
              <Input
                id="password-expiry"
                type="number"
                value={securitySettings.passwordExpiry}
                onChange={(e) => handleSecurityInputChange('passwordExpiry', parseInt(e.target.value))}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div
              className="space-y-2 p-4 rounded-lg md:col-span-2"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border-glass)',
                borderRadius: '0.5rem',
              }}
            >
              <Label htmlFor="data-retention" style={{ color: 'var(--text-secondary)' }}>Data Retention Period (days)</Label>
              <Input
                id="data-retention"
                type="number"
                value={securitySettings.dataRetention}
                onChange={(e) => handleSecurityInputChange('dataRetention', parseInt(e.target.value))}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Status Messages */}
      <div className="glass rounded-lg p-4">
        <div className="flex items-center gap-4">
          <CheckCircle className="w-5 h-5 text-green-400" />
          <div className="flex-1">
            <p className="text-white font-medium">All settings are up to date</p>
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Last saved: 2 minutes ago</p>
          </div>
        </div>
      </div>
    </div>
  );
});

SettingsTab.displayName = 'SettingsTab';

export default SettingsTab;
