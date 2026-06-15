// Glass-effect Sidebar — Console Design System
// Features: glass backdrop, architectural borders, Space Grotesk display, JetBrains Mono labels

import { memo } from 'react';
import { LayoutDashboard, Bot, Users, MessageSquare, FileText, BarChart3, Settings } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const menuItems = [
  { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
  { id: 'agents', icon: Bot, label: 'Agent Testing' },
  { id: 'sessions', icon: Users, label: 'Sessions' },
  { id: 'integrations', icon: MessageSquare, label: 'Integrations' },
  { id: 'scorecards', icon: FileText, label: 'Scorecards' },
  { id: 'monitoring', icon: BarChart3, label: 'Monitoring' },
  { id: 'settings', icon: Settings, label: 'Settings' },
] as const;

const Sidebar = memo(({ activeTab, setActiveTab }: SidebarProps) => {
  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
  };

  const handleKeyDown = (e: React.KeyboardEvent, tabId: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleTabClick(tabId);
    }
  };

  return (
    <aside
      className="w-64 min-h-screen border-r border-[var(--border-glass)] p-5 flex flex-col"
      style={{ background: 'var(--surface)' }}
      aria-label="Main navigation"
    >
      {/* Logo — Space Grotesk with indigo/violet mark */}
      <div className="flex items-center gap-3 mb-10">
        <div
          className="w-[14px] h-[14px] rounded-sm flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, var(--accent-indigo), var(--accent-violet))',
            boxShadow: '0 0 15px rgba(99, 102, 241, 0.4)',
          }}
        />
        <div>
          <h1
            className="text-lg font-bold text-white tracking-widest"
            style={{ fontFamily: 'var(--font-space-grotesk, "Space Grotesk"), sans-serif' }}
          >
            AROHAN
          </h1>
          <p
            className="text-[0.65rem] tracking-[0.15em] uppercase"
            style={{ color: 'var(--text-tertiary)', fontFamily: 'JetBrains Mono, monospace' }}
          >
            Console
          </p>
        </div>
      </div>

      {/* Navigation — glass items with indigo active state */}
      <nav aria-label="Console navigation" className="flex-1 space-y-1">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              onKeyDown={(e) => handleKeyDown(e, item.id)}
              aria-current={isActive ? 'page' : undefined}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-300 cursor-pointer"
              style={{
                background: isActive
                  ? 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.08))'
                  : 'transparent',
                border: isActive
                  ? '1px solid rgba(99,102,241,0.25)'
                  : '1px solid transparent',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }
              }}
            >
              <item.icon className="w-4 h-4" aria-hidden="true" style={{ opacity: isActive ? 1 : 0.5 }} />
              <span style={{ fontFamily: 'var(--font-space-grotesk, "Space Grotesk"), sans-serif', fontSize: '0.8125rem' }}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Footer — version / status */}
      <div
        className="pt-5 mt-auto border-t"
        style={{ borderColor: 'var(--border-glass)' }}
      >
        <p
          className="text-[0.6rem] tracking-[0.15em] uppercase"
          style={{ color: 'var(--text-tertiary)', fontFamily: 'JetBrains Mono, monospace' }}
        >
          v2.0 · Internal
        </p>
      </div>
    </aside>
  );
});

Sidebar.displayName = 'Sidebar';

export default Sidebar;
