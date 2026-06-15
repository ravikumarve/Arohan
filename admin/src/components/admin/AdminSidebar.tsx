'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Server, Users, Building2, IndianRupee, Shield, Menu, X } from 'lucide-react';

const navSections = [
  {
    label: 'Core',
    items: [
      { id: 'overview', icon: LayoutDashboard, label: 'Overview', href: '/admin' },
      { id: 'system', icon: Server, label: 'System Health', href: '/admin/system' },
    ],
  },
  {
    label: 'Tenant Management',
    items: [
      { id: 'companies', icon: Building2, label: 'Companies', href: '/admin/companies', badge: '89' },
      { id: 'users', icon: Users, label: 'Platform Users', href: '/admin/users', badge: '1,247' },
      { id: 'billing', icon: IndianRupee, label: 'Billing & Revenue', href: '/admin/billing' },
    ],
  },
  {
    label: 'Security',
    items: [
      { id: 'audit', icon: Shield, label: 'Audit Logs', href: '/admin/audit', badge: '3' },
    ],
  },
];

export default function AdminSidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg"
        style={{ background: '#6366f1', color: '#fff' }}
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
          background: 'var(--bg-sidebar, #0f1117)',
          borderRight: '1px solid var(--border-medium, rgba(255,255,255,0.1))',
          boxShadow: '4px 0 24px rgba(0,0,0,0.2)',
        }}
        aria-label="Admin navigation"
      >
        {/* Sidebar Header — cobalt logo */}
        <div
          className="flex items-center gap-3 px-6"
          style={{ height: '72px', borderBottom: '1px solid var(--border-medium, rgba(255,255,255,0.1))' }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, #4f46e5, #818cf8)',
              boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)',
            }}
          >
            <LayoutDashboard className="w-[18px] h-[18px] text-white" />
          </div>
          <div>
            <div className="font-bold text-sm tracking-wider" style={{ color: '#f8fafc' }}>AROHAN</div>
            <div className="text-[0.65rem] uppercase font-semibold tracking-wider" style={{ color: '#6366f1', fontFamily: 'JetBrains Mono, monospace' }}>
              Platform Admin
            </div>
          </div>
        </div>

        {/* Navigation sections */}
        <nav className="flex-1 overflow-y-auto py-4" aria-label="Dashboard navigation">
          {navSections.map((section) => (
            <div key={section.label} className="mb-5 px-4">
              <div
                className="text-[0.7rem] uppercase tracking-wider font-semibold mb-2 px-3"
                style={{ color: 'var(--text-faint, #475569)' }}
              >
                {section.label}
              </div>
              <div className="flex flex-col gap-0.5">
                {section.items.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all"
                      style={{
                        background: active ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                        color: active ? '#f8fafc' : 'var(--text-muted, #94a3b8)',
                        borderLeft: active ? '3px solid #6366f1' : '3px solid transparent',
                        borderRadius: active ? '4px 6px 6px 4px' : '6px',
                      }}
                      onMouseEnter={(e) => {
                        if (active) return;
                        e.currentTarget.style.background = 'var(--bg-hover, #1e2230)';
                        e.currentTarget.style.color = '#f8fafc';
                      }}
                      onMouseLeave={(e) => {
                        if (active) return;
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = 'var(--text-muted, #94a3b8)';
                      }}
                      aria-current={active ? 'page' : undefined}
                    >
                      <item.icon className="w-[18px] h-[18px]" style={{ opacity: active ? 1 : 0.7 }} aria-hidden="true" />
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <span
                          className="text-[0.65rem] px-2 py-0.5 rounded-full font-mono"
                          style={{
                            background: active ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.06)',
                            color: active ? '#818cf8' : 'var(--text-muted, #94a3b8)',
                          }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Sidebar Footer — user profile */}
        <div
          className="p-6"
          style={{ borderTop: '1px solid var(--border-medium, rgba(255,255,255,0.1))' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold"
              style={{
                background: 'var(--bg-hover, #1e2230)',
                border: '1px solid var(--border-medium, rgba(255,255,255,0.1))',
                color: '#f8fafc',
              }}
            >
              RS
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium" style={{ color: '#f8fafc' }}>Ravi Sharma</span>
              <span className="text-[0.7rem]" style={{ color: 'var(--text-muted, #94a3b8)' }}>Super Admin</span>
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
