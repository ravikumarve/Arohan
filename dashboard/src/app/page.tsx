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

export default function DashboardPage() {
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

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-black flex">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 p-8 overflow-auto">
          {renderTab()}
        </main>
      </div>
      <CustomToaster />
      <Toaster />
    </ErrorBoundary>
  );
}
