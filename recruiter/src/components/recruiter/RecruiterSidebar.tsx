'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Megaphone,
  FileText,
  BarChart3,
  Settings,
  Menu,
  X,
  Briefcase,
  Phone,
} from 'lucide-react';

const menuItems = [
  { id: 'overview', icon: LayoutDashboard, label: 'Overview', href: '/dashboard' },
  { id: 'campaigns', icon: Megaphone, label: 'Campaigns', href: '/dashboard/campaigns', badge: '12' },
  { id: 'candidates', icon: Users, label: 'Candidates', href: '/dashboard/candidates', badge: '847' },
  { id: 'requisitions', icon: Briefcase, label: 'Requisitions', href: '/dashboard/requisitions', badge: '8' },
  { id: 'interviews', icon: Phone, label: 'Interviews', href: '/dashboard/interviews', badge: '34' },
  { id: 'analytics', icon: BarChart3, label: 'Analytics', href: '/dashboard/analytics' },
  { id: 'reports', icon: FileText, label: 'Reports', href: '/dashboard/reports' },
  { id: 'settings', icon: Settings, label: 'Settings', href: '/dashboard/settings' },
];

export default function RecruiterSidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-recruiter-primary rounded-lg text-white"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-64 bg-recruiter-background-secondary border-r border-recruiter-background-tertiary
          transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        aria-label="Recruiter navigation"
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 p-6 border-b border-recruiter-background-tertiary">
            <div className="w-10 h-10 bg-gradient-to-br from-recruiter-primary to-recruiter-primary-light rounded-xl flex items-center justify-center">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">AROHAN</h1>
              <p className="text-xs text-recruiter-primary-light">Recruiter Dashboard</p>
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
                        ? 'bg-gradient-to-r from-recruiter-primary/20 to-recruiter-primary/10 text-white border border-recruiter-primary/30'
                        : 'text-recruiter-primary-light hover:text-white hover:bg-recruiter-background-tertiary'
                    }
                  `}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <item.icon className="w-5 h-5" aria-hidden="true" />
                  <span className="font-medium flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="text-xs bg-recruiter-background-tertiary px-2 py-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-recruiter-background-tertiary">
            <div className="text-xs text-recruiter-primary-light">
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
