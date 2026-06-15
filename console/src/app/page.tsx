"use client";

import { useState, lazy, Suspense } from "react";
import { Toaster } from "sonner";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Toaster as CustomToaster } from "@/components/Toaster";
import { FullPageLoading } from "@/components/ui/loading/LoadingSpinner";
import Sidebar from "@/components/dashboard/Sidebar";

// Dynamic imports for code splitting
const OverviewTab = lazy(() => import("@/components/dashboard/OverviewTab").then(m => ({ default: m.default })));
const AgentsTab = lazy(() => import("@/components/dashboard/AgentsTab").then(m => ({ default: m.default })));
const SessionsTab = lazy(() => import("@/components/dashboard/SessionsTab").then(m => ({ default: m.default })));
const IntegrationsTab = lazy(() => import("@/components/dashboard/IntegrationsTab").then(m => ({ default: m.default })));
const ScorecardsTab = lazy(() => import("@/components/dashboard/ScorecardsTab").then(m => ({ default: m.default })));
const MonitoringTab = lazy(() => import("@/components/dashboard/MonitoringTab").then(m => ({ default: m.default })));
const SettingsTab = lazy(() => import("@/components/dashboard/SettingsTab").then(m => ({ default: m.default })));

// Loading fallback component
function TabLoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <FullPageLoading />
    </div>
  );
}

const activeTabMeta: Record<string, { title: string; subtitle: string }> = {
  overview: { title: "Overview", subtitle: "Platform health at a glance" },
  agents: { title: "Agent Testing", subtitle: "Test and validate AI agent pipelines" },
  sessions: { title: "Sessions", subtitle: "Active and historical screening sessions" },
  integrations: { title: "Integrations", subtitle: "API credentials and webhook configurations" },
  scorecards: { title: "Scorecards", subtitle: "Candidate evaluation templates and results" },
  monitoring: { title: "Monitoring", subtitle: "System metrics and alerting" },
  settings: { title: "Settings", subtitle: "Console configuration and preferences" },
};

export default function ConsolePage() {
  const [activeTab, setActiveTab] = useState("overview");

  const renderTab = () => {
    switch (activeTab) {
      case "overview":
        return (
          <Suspense fallback={<TabLoadingFallback />}>
            <OverviewTab />
          </Suspense>
        );
      case "agents":
        return (
          <Suspense fallback={<TabLoadingFallback />}>
            <AgentsTab />
          </Suspense>
        );
      case "sessions":
        return (
          <Suspense fallback={<TabLoadingFallback />}>
            <SessionsTab />
          </Suspense>
        );
      case "integrations":
        return (
          <Suspense fallback={<TabLoadingFallback />}>
            <IntegrationsTab />
          </Suspense>
        );
      case "scorecards":
        return (
          <Suspense fallback={<TabLoadingFallback />}>
            <ScorecardsTab />
          </Suspense>
        );
      case "monitoring":
        return (
          <Suspense fallback={<TabLoadingFallback />}>
            <MonitoringTab />
          </Suspense>
        );
      case "settings":
        return (
          <Suspense fallback={<TabLoadingFallback />}>
            <SettingsTab />
          </Suspense>
        );
      default:
        return (
          <Suspense fallback={<TabLoadingFallback />}>
            <OverviewTab />
          </Suspense>
        );
    }
  };

  const currentMeta = activeTabMeta[activeTab] || activeTabMeta.overview;

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex" style={{ background: 'var(--void)' }}>
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 flex flex-col overflow-auto" style={{ background: 'var(--void)' }}>
          {/* Topbar */}
          <header
            className="flex items-center justify-between px-8 py-4 border-b"
            style={{ borderColor: 'var(--border-glass)', background: 'var(--surface)' }}
          >
            <div>
              <h1
                className="text-lg font-medium text-white"
                style={{ fontFamily: 'var(--font-space-grotesk, "Space Grotesk"), sans-serif', letterSpacing: '-0.03em' }}
              >
                {currentMeta.title}
              </h1>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                {currentMeta.subtitle}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span
                className="flex items-center gap-2 text-[0.7rem] tracking-wider uppercase"
                style={{ color: 'var(--accent-green)', fontFamily: 'JetBrains Mono, monospace' }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent-green)' }} />
                All Systems Nominal
              </span>
            </div>
          </header>

          {/* Tab content */}
          <div className="flex-1 p-8" style={{ position: 'relative', zIndex: 1 }}>
            {renderTab()}
          </div>
        </main>
      </div>
      <CustomToaster />
      <Toaster />
    </ErrorBoundary>
  );
}
