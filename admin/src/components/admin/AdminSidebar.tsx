'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Building2,
  Server,
  IndianRupee,
  Shield,
  Link as LinkIcon,
  Settings,
  Menu,
  X,
} from 'lucide-react';

const menuItems = [
  { id: 'overview', icon: LayoutDashboard, label: 'Overview', href: '/admin' },
  { id: 'users', icon: Users, label: 'Users', href: '/admin/users', badge: '1,247' },
  { id: 'companies', icon: Building2, label: 'Companies', href: '/admin/companies', badge: '89' },
  { id: 'system', icon: Server, label: 'System', href: '/admin/system' },
  { id: 'billing', icon: IndianRupee, label: 'Billing', href: '/admin/billing' },
  { id: 'audit', icon: Shield, label: 'Audit', href: '/admin/audit', badge: '3 alerts' },
  { id: 'integrations', icon: LinkIcon, label: 'Integrations', href: '/admin/integrations' },
  { id: 'settings', icon: Settings, label: 'Settings', href: '/admin/settings' },
];

export default function AdminSidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-admin-primary rounded-lg text-white"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-64 bg-admin-background-secondary border-r border-admin-background-tertiary
          transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        aria-label="Admin navigation"
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 p-6 border-b border-admin-background-tertiary">
            <div className="w-10 h-10 bg-gradient-to-br from-admin-primary to-admin-primary-light rounded-xl flex items-center justify-center">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">AROHAN</h1>
              <p className="text-xs text-admin-primary-light">Platform Admin</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto" aria-label="Dashboard navigation">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                    ${
                      isActive
                        ? 'bg-gradient-to-r from-admin-primary/20 to-admin-primary/10 text-white border border-admin-primary/30'
                        : 'text-admin-primary-light hover:text-white hover:bg-admin-background-tertiary'
                    }
                  `}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <item.icon className="w-5 h-5" aria-hidden="true" />
                  <span className="font-medium flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="text-xs bg-admin-background-tertiary px-2 py-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-admin-background-tertiary">
            <div className="text-xs text-admin-primary-light">
              <p>Version 1.0.0</p>
              <p className="mt-1">© 2026 AROHAN</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
