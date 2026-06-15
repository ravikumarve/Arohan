'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { Bell, Mail, User, Building2, Shield, Palette } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    weeklyReport: true,
  });

  const handleSaveProfile = useCallback(() => {
    toast.success('Profile saved successfully');
  }, []);

  const handleSaveCompany = useCallback(() => {
    toast.success('Company settings saved successfully');
  }, []);

  const handleUpdatePassword = useCallback(() => {
    toast.success('Password updated successfully');
  }, []);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'company', label: 'Company', icon: Building2 },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <div className="p-8 h-full overflow-y-auto">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-8">
        {/* Header */}
        <div>
          <h1 className="text-[1.8rem] font-semibold tracking-tight" style={{ color: '#ffffff' }}>
            Settings
          </h1>
          <p className="text-sm font-mono tracking-wide" style={{ color: '#8b5cf6' }}>
            Manage your account and preferences
          </p>
        </div>

        <div className="flex gap-6">
          {/* Sidebar Tabs */}
          <div className="w-64 flex-shrink-0">
            <div className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={
                      activeTab === tab.id
                        ? { background: 'rgba(139, 92, 246, 0.15)', color: '#ffffff', borderLeft: '2px solid #8b5cf6', borderRadius: '4px 6px 6px 4px' }
                        : { color: 'var(--text-muted, #94a3b8)' }
                    }
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all ${
                      activeTab === tab.id ? '' : 'hover:text-white hover:bg-[var(--bg-hover,#161925)]'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 space-y-6">
            {activeTab === 'profile' && (
              <div className="panel-recruiter">
                <div className="panel-body-recruiter space-y-6">
                  <h2 className="text-lg font-semibold text-white" style={{ fontFamily: 'var(--font-space-grotesk, "Space Grotesk"), sans-serif' }}>
                    Profile Settings
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-muted, #94a3b8)' }}>First Name</label>
                      <input
                        type="text"
                        defaultValue="HR"
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-muted, #94a3b8)' }}>Last Name</label>
                      <input
                        type="text"
                        defaultValue="Manager"
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-muted, #94a3b8)' }}>Email</label>
                      <input
                        type="email"
                        defaultValue="hr@logisticspro.com"
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-muted, #94a3b8)' }}>Phone</label>
                      <input
                        type="tel"
                        defaultValue="+91 98765 43210"
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button className="btn-recruiter-primary" onClick={handleSaveProfile}>
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'company' && (
              <div className="panel-recruiter">
                <div className="panel-body-recruiter space-y-6">
                  <h2 className="text-lg font-semibold text-white" style={{ fontFamily: 'var(--font-space-grotesk, "Space Grotesk"), sans-serif' }}>
                    Company Settings
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-muted, #94a3b8)' }}>Company Name</label>
                      <input
                        type="text"
                        defaultValue="LogisticsPro Ltd"
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-muted, #94a3b8)' }}>Industry</label>
                      <select className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500">
                        <option>Logistics & Transportation</option>
                        <option>Technology</option>
                        <option>Healthcare</option>
                        <option>Retail</option>
                        <option>Manufacturing</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-muted, #94a3b8)' }}>Website</label>
                      <input
                        type="url"
                        defaultValue="https://logisticspro.com"
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button className="btn-recruiter-primary" onClick={handleSaveCompany}>
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="panel-recruiter">
                <div className="panel-body-recruiter space-y-6">
                  <h2 className="text-lg font-semibold text-white" style={{ fontFamily: 'var(--font-space-grotesk, "Space Grotesk"), sans-serif' }}>
                    Notification Preferences
                  </h2>

                  <div className="space-y-4">
                    {[
                      { id: 'email', label: 'Email Notifications', description: 'Receive updates via email', icon: Mail },
                      { id: 'push', label: 'Push Notifications', description: 'Browser push notifications', icon: Bell },
                      { id: 'sms', label: 'SMS Alerts', description: 'Critical alerts via SMS', icon: Bell },
                      { id: 'weeklyReport', label: 'Weekly Reports', description: 'Weekly hiring summary', icon: Mail },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <div key={item.id} className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid var(--border-dim, rgba(255,255,255,0.05))' }}>
                          <div className="flex items-center gap-3">
                            <Icon className="w-5 h-5" style={{ color: 'var(--text-muted, #94a3b8)' }} />
                            <div>
                              <p className="text-white font-medium">{item.label}</p>
                              <p className="text-sm" style={{ color: 'var(--text-muted, #94a3b8)' }}>{item.description}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => setNotifications(prev => ({ ...prev, [item.id]: !prev[item.id as keyof typeof notifications] }))}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifications[item.id as keyof typeof notifications] ? '' : 'bg-neutral-700'}`}
                            style={notifications[item.id as keyof typeof notifications] ? { background: 'linear-gradient(135deg, #8b5cf6, #ec4899)' } : undefined}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                notifications[item.id as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="panel-recruiter">
                <div className="panel-body-recruiter space-y-6">
                  <h2 className="text-lg font-semibold text-white" style={{ fontFamily: 'var(--font-space-grotesk, "Space Grotesk"), sans-serif' }}>
                    Security Settings
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-muted, #94a3b8)' }}>Current Password</label>
                      <input
                        type="password"
                        placeholder="Enter current password"
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-muted, #94a3b8)' }}>New Password</label>
                      <input
                        type="password"
                        placeholder="Enter new password"
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-muted, #94a3b8)' }}>Confirm New Password</label>
                      <input
                        type="password"
                        placeholder="Confirm new password"
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button className="btn-recruiter-primary" onClick={handleUpdatePassword}>
                      Update Password
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
