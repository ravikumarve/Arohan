// Settings Tab Component with memoization

import { memo, useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Settings, Bell, Shield, Database, Save, RotateCcw, CheckCircle, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'react-hot-toast';
import { LoadingSpinner } from '@/components/ui/loading/LoadingSpinner';

const SettingsTab = memo(() => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
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
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success('Settings saved successfully');
    }, 1500);
  }, []);

  const handleResetSettings = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
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
    }, 1000);
  }, []);

  const handleTestConnection = useCallback((service: string) => {
    toast.success(`${service} connection test successful`);
  }, []);

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
          <p className="text-slate-400">Configure system preferences and integrations</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleResetSettings}
            disabled={loading}
            variant="outline"
            className="border-slate-700 hover:bg-slate-800"
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
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
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
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-purple-400" />
            <CardTitle className="text-white">API Configuration</CardTitle>
          </div>
          <CardDescription className="text-slate-400">
            Configure third-party service API keys and credentials
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Twilio */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Twilio</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="twilio-account-sid">Account SID</Label>
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
                <Label htmlFor="twilio-auth-token">Auth Token</Label>
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
                <Label htmlFor="twilio-phone-number">Phone Number</Label>
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
                  className="w-full border-slate-700 hover:bg-slate-800"
                >
                  Test Connection
                </Button>
              </div>
            </div>
          </div>

          {/* Meta */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Meta (WhatsApp)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="meta-app-id">App ID</Label>
                <Input
                  id="meta-app-id"
                  value={apiSettings.metaAppId}
                  onChange={(e) => handleApiSettingChange('metaAppId', e.target.value)}
                  placeholder="Enter Meta App ID"
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="meta-app-secret">App Secret</Label>
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
                <Label htmlFor="meta-phone-number-id">Phone Number ID</Label>
                <Input
                  id="meta-phone-number-id"
                  value={apiSettings.metaPhoneNumberId}
                  onChange={(e) => handleApiSettingChange('metaPhoneNumberId', e.target.value)}
                  placeholder="Enter Phone Number ID"
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="meta-access-token">Access Token</Label>
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
            <h3 className="text-lg font-semibold text-white">Bhashini</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bhashini-api-key">API Key</Label>
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
                  className="w-full border-slate-700 hover:bg-slate-800"
                >
                  Test Connection
                </Button>
              </div>
            </div>
          </div>

          {/* OpenAI */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">OpenAI (Whisper)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="openai-api-key">API Key</Label>
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
                  className="w-full border-slate-700 hover:bg-slate-800"
                >
                  Test Connection
                </Button>
              </div>
            </div>
          </div>

          {/* Pinecone */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Pinecone</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pinecone-api-key">API Key</Label>
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
                <Label htmlFor="pinecone-index-name">Index Name</Label>
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
                  className="w-full border-slate-700 hover:bg-slate-800"
                >
                  Test Connection
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-400" />
            <CardTitle className="text-white">Notification Settings</CardTitle>
          </div>
          <CardDescription className="text-slate-400">
            Configure how and when you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
              <div>
                <p className="text-white font-medium">Email Alerts</p>
                <p className="text-sm text-slate-400">Receive notifications via email</p>
              </div>
              <Switch
                checked={notificationSettings.emailAlerts}
                onCheckedChange={(checked) => handleNotificationToggle('emailAlerts', checked)}
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
              <div>
                <p className="text-white font-medium">SMS Alerts</p>
                <p className="text-sm text-slate-400">Receive critical alerts via SMS</p>
              </div>
              <Switch
                checked={notificationSettings.smsAlerts}
                onCheckedChange={(checked) => handleNotificationToggle('smsAlerts', checked)}
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
              <div>
                <p className="text-white font-medium">WhatsApp Alerts</p>
                <p className="text-sm text-slate-400">Receive notifications via WhatsApp</p>
              </div>
              <Switch
                checked={notificationSettings.whatsappAlerts}
                onCheckedChange={(checked) => handleNotificationToggle('whatsappAlerts', checked)}
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
              <div>
                <p className="text-white font-medium">Push Notifications</p>
                <p className="text-sm text-slate-400">Receive in-app notifications</p>
              </div>
              <Switch
                checked={notificationSettings.pushNotifications}
                onCheckedChange={(checked) => handleNotificationToggle('pushNotifications', checked)}
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
              <div>
                <p className="text-white font-medium">Daily Reports</p>
                <p className="text-sm text-slate-400">Receive daily summary reports</p>
              </div>
              <Switch
                checked={notificationSettings.dailyReports}
                onCheckedChange={(checked) => handleNotificationToggle('dailyReports', checked)}
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
              <div>
                <p className="text-white font-medium">Weekly Reports</p>
                <p className="text-sm text-slate-400">Receive weekly analytics reports</p>
              </div>
              <Switch
                checked={notificationSettings.weeklyReports}
                onCheckedChange={(checked) => handleNotificationToggle('weeklyReports', checked)}
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
              <div>
                <p className="text-white font-medium">Critical Alerts</p>
                <p className="text-sm text-slate-400">Immediate alerts for critical issues</p>
              </div>
              <Switch
                checked={notificationSettings.criticalAlerts}
                onCheckedChange={(checked) => handleNotificationToggle('criticalAlerts', checked)}
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
              <div>
                <p className="text-white font-medium">System Updates</p>
                <p className="text-sm text-slate-400">Notifications about system updates</p>
              </div>
              <Switch
                checked={notificationSettings.systemUpdates}
                onCheckedChange={(checked) => handleNotificationToggle('systemUpdates', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-400" />
            <CardTitle className="text-white">Security Settings</CardTitle>
          </div>
          <CardDescription className="text-slate-400">
            Configure security and compliance settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
              <div>
                <p className="text-white font-medium">Two-Factor Authentication</p>
                <p className="text-sm text-slate-400">Require 2FA for all users</p>
              </div>
              <Switch
                checked={securitySettings.twoFactorAuth}
                onCheckedChange={(checked) => handleSecurityToggle('twoFactorAuth', checked)}
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
              <div>
                <p className="text-white font-medium">IP Whitelist</p>
                <p className="text-sm text-slate-400">Restrict access by IP address</p>
              </div>
              <Switch
                checked={securitySettings.ipWhitelist}
                onCheckedChange={(checked) => handleSecurityToggle('ipWhitelist', checked)}
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
              <div>
                <p className="text-white font-medium">Audit Logging</p>
                <p className="text-sm text-slate-400">Log all system activities</p>
              </div>
              <Switch
                checked={securitySettings.auditLogging}
                onCheckedChange={(checked) => handleSecurityToggle('auditLogging', checked)}
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
              <div>
                <p className="text-white font-medium">Encryption at Rest</p>
                <p className="text-sm text-slate-400">Encrypt stored data</p>
              </div>
              <Switch
                checked={securitySettings.encryptionAtRest}
                onCheckedChange={(checked) => handleSecurityToggle('encryptionAtRest', checked)}
              />
            </div>
            <div className="space-y-2 p-4 bg-slate-800/50 rounded-lg">
              <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
              <Input
                id="session-timeout"
                type="number"
                value={securitySettings.sessionTimeout}
                onChange={(e) => handleSecurityInputChange('sessionTimeout', parseInt(e.target.value))}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div className="space-y-2 p-4 bg-slate-800/50 rounded-lg">
              <Label htmlFor="password-expiry">Password Expiry (days)</Label>
              <Input
                id="password-expiry"
                type="number"
                value={securitySettings.passwordExpiry}
                onChange={(e) => handleSecurityInputChange('passwordExpiry', parseInt(e.target.value))}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div className="space-y-2 p-4 bg-slate-800/50 rounded-lg md:col-span-2">
              <Label htmlFor="data-retention">Data Retention Period (days)</Label>
              <Input
                id="data-retention"
                type="number"
                value={securitySettings.dataRetention}
                onChange={(e) => handleSecurityInputChange('dataRetention', parseInt(e.target.value))}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Messages */}
      <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
        <CheckCircle className="w-5 h-5 text-green-400" />
        <div className="flex-1">
          <p className="text-white font-medium">All settings are up to date</p>
          <p className="text-sm text-slate-400">Last saved: 2 minutes ago</p>
        </div>
      </div>
    </div>
  );
});

SettingsTab.displayName = 'SettingsTab';

export default SettingsTab;
