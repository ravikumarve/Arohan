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

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg"
        style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', color: '#fff' }}
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-[260px] flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        style={{
          background: 'rgba(8, 9, 14, 0.8)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRight: '1px solid var(--border-dim, rgba(255,255,255,0.05))',
        }}
        aria-label="Recruiter navigation"
      >
        {/* Header — violet/pink gradient logo */}
        <div
          className="flex items-center gap-3 px-6"
          style={{
            height: '72px',
            borderBottom: '1px solid var(--border-dim, rgba(255,255,255,0.05))',
          }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
              boxShadow: '0 0 20px rgba(236, 72, 153, 0.3)',
            }}
          >
            <LayoutDashboard className="w-[16px] h-[16px] text-white" />
          </div>
          <div>
            <div className="font-bold text-sm tracking-wider" style={{ color: '#ffffff' }}>AROHAN</div>
            <div
              className="text-[0.65rem] uppercase tracking-wider mt-0.5"
              style={{ color: 'var(--text-muted, #94a3b8)', fontFamily: 'JetBrains Mono, monospace' }}
            >
              Recruiter Dashboard
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-0.5" aria-label="Dashboard navigation">
          {menuItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.id}
                href={item.href}
                className="flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-all"
                style={{
                  background: active
                    ? 'linear-gradient(90deg, rgba(139,92,246,0.1), transparent)'
                    : 'transparent',
                  color: active ? '#ffffff' : 'var(--text-muted, #94a3b8)',
                  borderLeft: active ? '3px solid #ec4899' : '3px solid transparent',
                  borderTop: '1px solid transparent',
                  borderBottom: '1px solid transparent',
                  borderRight: '1px solid transparent',
                  borderImage: active ? undefined : undefined,
                }}
                onMouseEnter={(e) => {
                  if (active) return;
                  e.currentTarget.style.background = 'var(--bg-hover, #161925)';
                  e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  if (active) return;
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--text-muted, #94a3b8)';
                }}
                aria-current={active ? 'page' : undefined}
              >
                <div className="flex items-center gap-3">
                  <item.icon
                    className="w-[18px] h-[18px]"
                    style={{ opacity: active ? 1 : 0.7, color: active ? '#ec4899' : undefined }}
                    aria-hidden="true"
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className="text-[0.65rem] px-2 py-0.5 rounded-full"
                    style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      background: active ? 'rgba(236,72,153,0.15)' : 'rgba(255,255,255,0.05)',
                      color: active ? '#ec4899' : 'var(--text-muted, #94a3b8)',
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div
          className="px-6 py-5 text-[0.7rem]"
          style={{
            color: 'var(--text-faint, #475569)',
            borderTop: '1px solid var(--border-dim, rgba(255,255,255,0.05))',
            fontFamily: 'JetBrains Mono, monospace',
          }}
        >
          <div>Version 1.0.0</div>
          <div className="mt-1">&copy; 2026 AROHAN</div>
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
