// Sidebar Component with memoization and accessibility

import { memo } from 'react';
import { LayoutDashboard, Bot, Users, MessageSquare, FileText, BarChart3, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
      className="w-64 bg-slate-900 border-r border-slate-800 p-4"
      aria-label="Main navigation"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
          <Bot className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white">AROHAN</h1>
          <p className="text-xs text-slate-400">Admin Dashboard</p>
        </div>
      </div>

      <nav aria-label="Dashboard navigation" className="space-y-2">
        {menuItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            onClick={() => handleTabClick(item.id)}
            onKeyDown={(e) => handleKeyDown(e, item.id)}
            aria-current={activeTab === item.id ? 'page' : undefined}
            className={`w-full justify-start gap-3 px-4 py-3 h-auto transition-all ${
              activeTab === item.id
                ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border border-purple-500/30 hover:from-purple-500/30 hover:to-pink-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <item.icon className="w-5 h-5" aria-hidden="true" />
            <span className="font-medium">{item.label}</span>
          </Button>
        ))}
      </nav>
    </aside>
  );
});

Sidebar.displayName = 'Sidebar';

export default Sidebar;
