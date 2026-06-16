'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Search, User, LogOut, Settings, Building2 } from 'lucide-react';
import { toast } from 'sonner';

export default function RecruiterHeader() {
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <header className="bg-recruiter-background-secondary border-b border-recruiter-background-tertiary px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Search */}
        <div className="flex-1 max-w-md">
          {isSearchOpen ? (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-recruiter-primary-light" />
              <input
                type="text"
                placeholder="Search candidates, campaigns, requisitions..."
                className="w-full pl-10 pr-4 py-2 bg-recruiter-background-tertiary border border-recruiter-background-tertiary rounded-lg text-white placeholder-recruiter-primary-light focus:outline-none focus:border-recruiter-primary"
                autoFocus
                onBlur={() => setIsSearchOpen(false)}
              />
            </div>
          ) : (
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 text-recruiter-primary-light hover:text-white transition-colors"
            >
              <Search className="w-5 h-5" />
              <span className="hidden sm:inline">Search...</span>
            </button>
          )}
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-4">
          {/* Company selector */}
          <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-recruiter-background-tertiary rounded-lg">
            <Building2 className="w-4 h-4 text-recruiter-primary-light" />
            <span className="text-sm text-white">LogisticsPro Ltd</span>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative p-2 text-recruiter-primary-light hover:text-white transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-recruiter-danger rounded-full" />
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-recruiter-background-secondary border border-recruiter-background-tertiary rounded-lg shadow-xl z-50">
                <div className="p-4 border-b border-recruiter-background-tertiary">
                  <h3 className="font-semibold text-white">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  <NotificationItem
                    title="New candidate screened"
                    message="Rajesh Kumar scored 85/100 for Delivery Partner"
                    time="2 hours ago"
                    unread
                  />
                  <NotificationItem
                    title="Campaign completed"
                    message="Delivery Partner campaign reached 500 candidates"
                    time="5 hours ago"
                    unread
                  />
                  <NotificationItem
                    title="Interview scheduled"
                    message="Priya Sharma interview at 3:00 PM today"
                    time="1 day ago"
                  />
                </div>
                <div className="p-4 border-t border-recruiter-background-tertiary">
                  <button
                    onClick={() => {
                      setIsNotificationsOpen(false);
                      toast.info('All notifications view coming soon');
                    }}
                    className="text-sm text-recruiter-primary hover:text-white transition-colors"
                  >
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-3 p-2 hover:bg-recruiter-background-tertiary rounded-lg transition-colors"
              aria-label="User menu"
            >
              <div className="w-8 h-8 bg-recruiter-primary rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-white">HR Manager</p>
                <p className="text-xs text-recruiter-primary-light">LogisticsPro Ltd</p>
              </div>
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-recruiter-background-secondary border border-recruiter-background-tertiary rounded-lg shadow-xl z-50">
                <div className="p-4 border-b border-recruiter-background-tertiary">
                  <p className="font-medium text-white">HR Manager</p>
                  <p className="text-sm text-recruiter-primary-light">hr@logisticspro.com</p>
                </div>
                <div className="py-2">
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      router.push('/dashboard/settings');
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-left text-recruiter-primary-light hover:text-white hover:bg-recruiter-background-tertiary transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      toast.success('Logged out successfully');
                      router.push('/login');
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-left text-recruiter-primary-light hover:text-white hover:bg-recruiter-background-tertiary transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

// Notification Item Component
function NotificationItem({
  title,
  message,
  time,
  unread,
}: {
  title: string;
  message: string;
  time: string;
  unread?: boolean;
}) {
  return (
    <div className={`p-4 border-b border-recruiter-background-tertiary hover:bg-recruiter-background-tertiary transition-colors ${unread ? 'bg-recruiter-background-tertiary/50' : ''}`}>
      <div className="flex items-start gap-3">
        {unread && <div className="w-2 h-2 bg-recruiter-primary rounded-full mt-2" />}
        <div className="flex-1">
          <p className="text-sm font-medium text-white">{title}</p>
          <p className="text-xs text-recruiter-primary-light mt-1">{message}</p>
          <p className="text-xs text-recruiter-primary-light/70 mt-2">{time}</p>
        </div>
      </div>
    </div>
  );
}
