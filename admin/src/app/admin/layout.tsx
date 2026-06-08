import { ReactNode } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Server,
  Users,
  Building2,
  CreditCard,
  Shield,
  Bot,
} from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/system', label: 'System', icon: Server },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/companies', label: 'Companies', icon: Building2 },
  { href: '/admin/billing', label: 'Billing', icon: CreditCard },
  { href: '/admin/audit', label: 'Audit', icon: Shield },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-black flex">
      {/* Sidebar */}
      <aside className="w-64 bg-neutral-950 border-r border-neutral-800 flex-shrink-0 hidden md:flex flex-col">
        <div className="p-6 flex-1">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">AROHAN</h1>
              <p className="text-xs text-neutral-400">Admin Dashboard</p>
            </div>
          </div>

          {/* Nav */}
          <nav className="space-y-1" id="admin-nav">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  data-nav-href={item.href}
                  className="nav-link flex items-center gap-3 px-4 py-3 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800/50 transition-all"
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-h-screen overflow-auto">
        {children}
      </main>

      {/* Active nav state - runs client-side after hydration */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              var path = window.location.pathname;
              var links = document.querySelectorAll('#admin-nav a[data-nav-href]');
              links.forEach(function(link) {
                var href = link.getAttribute('data-nav-href');
                if (href === '/admin' && (path === '/admin' || path === '/admin/')) {
                  link.classList.add('text-white', 'bg-neutral-800/70');
                  link.classList.remove('text-neutral-400');
                } else if (href !== '/admin' && path.startsWith(href)) {
                  link.classList.add('text-white', 'bg-neutral-800/70');
                  link.classList.remove('text-neutral-400');
                }
              });
            })();
          `,
        }}
      />
    </div>
  );
}
