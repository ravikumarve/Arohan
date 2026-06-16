'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Search, User, LogOut, Settings, Menu } from 'lucide-react';
import { toast } from 'sonner';

interface AdminHeaderProps {
  onMenuClick?: () => void;
}

export default function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <header className="bg-card border-b px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Menu button */}
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors mr-4"
            aria-label="Toggle menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        )}

        {/* Search */}
        <div className="flex-1 max-w-md">
          {isSearchOpen ? (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search users, companies, campaigns..."
                className="w-full pl-10 pr-4 py-2 bg-muted border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                autoFocus
                onBlur={() => setIsSearchOpen(false)}
              />
            </div>
          ) : (
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Search className="w-5 h-5" />
              <span className="hidden sm:inline">Search...</span>
            </button>
          )}
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-lg shadow-xl z-50">
                <div className="p-4 border-b border-border">
                  <h3 className="font-semibold text-foreground">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  <NotificationItem
                    title="New company onboarded"
                    message="LogisticsPro Ltd has joined the platform"
                    time="2 hours ago"
                    unread
                  />
                  <NotificationItem
                    title="System alert"
                    message="Queue service experiencing high load"
                    time="5 hours ago"
                    unread
                  />
                  <NotificationItem
                    title="Payment received"
                    message="Growth plan payment from RetailMax"
                    time="1 day ago"
                  />
                </div>
                <div className="p-4 border-t border-border">
                  <button
                    onClick={() => {
                      setIsNotificationsOpen(false);
                      toast.info('All notifications view coming soon');
                    }}
                    className="text-sm text-primary hover:text-foreground transition-colors"
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
              className="flex items-center gap-3 p-2 hover:bg-muted rounded-lg transition-colors"
              aria-label="User menu"
            >
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-foreground" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-foreground">Admin User</p>
                <p className="text-xs text-muted-foreground">Platform Administrator</p>
              </div>
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-xl z-50">
                <div className="p-4 border-b border-border">
                  <p className="font-medium text-foreground">Admin User</p>
                  <p className="text-sm text-muted-foreground">admin@arohan.com</p>
                </div>
                <div className="py-2">
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      router.push('/admin/settings');
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-left text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
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
                    className="flex items-center gap-2 w-full px-4 py-2 text-left text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
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
    <div className={`p-4 border-b border-border hover:bg-muted transition-colors ${unread ? 'bg-muted/50' : ''}`}>
      <div className="flex items-start gap-3">
        {unread && <div className="w-2 h-2 bg-primary rounded-full mt-2" />}
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground">{title}</p>
          <p className="text-xs text-muted-foreground mt-1">{message}</p>
          <p className="text-xs text-muted-foreground/70 mt-2">{time}</p>
        </div>
      </div>
    </div>
  );
}
