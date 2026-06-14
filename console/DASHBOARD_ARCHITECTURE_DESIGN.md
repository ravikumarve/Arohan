## ADMIN & RECRUITER Views - Complete UI/UX Specification

**Version**: 1.0  
**Date**: 2026-05-03  
**Design Status**: Ready for Implementation  
**Reviewed By**: Orchestrator Prime (AI Architect)  
**Tech Stack**: Next.js 14 + shadcn/ui + TypeScript + Tailwind CSS

---

## 🎯 Executive Summary

This document defines the complete architecture for separating AROHAN into two distinct dashboard experiences:
- **ADMIN Dashboard** (`/admin`) - Platform management and system administration
- **RECRUITER Dashboard** (`/dashboard`) - Employer hiring workflows and candidate management

**Key Design Principles:**
1. **Clear Role Separation** - Distinct interfaces for different user personas
2. **Progressive Disclosure** - Show relevant information based on user role
3. **Performance First** - Optimized for CPU-only hardware (Dell Latitude 3460)
4. **Accessibility Compliant** - WCAG 2.1 AA standards
5. **Scalable Architecture** - Multi-tenant SaaS patterns

---

## 🏗️ Architecture Overview

### Multi-Tenant Structure
```
arohan/
├── dashboard/                    # RECRUITER Dashboard (Employer View)
│   ├── src/
│   │   ├── app/
│   │   │   ├── dashboard/        # /dashboard route
│   │   │   │   ├── campaigns/
│   │   │   │   ├── candidates/
│   │   │   │   ├── requisitions/
│   │   │   │   ├── scorecards/
│   │   │   │   └── analytics/
│   │   │   └── layout.tsx
│   │   └── components/
│   │       └── recruiter/        # Recruiter-specific components
│   └── package.json
│
└── admin/                        # ADMIN Dashboard (Platform Management)
├── src/
│   ├── app/
│   │   ├── admin/            # /admin route
│   │   │   ├── users/
│   │   │   ├── companies/
│   │   │   ├── system/
│   │   │   ├── billing/
│   │   │   ├── audit/
│   │   │   └── integrations/
│   │   └── layout.tsx
│   └── components/
│       └── admin/            # Admin-specific components
└── package.json
```

### Shared Components Library
```
shared/
├── src/
│   ├── components/
│   │   ├── ui/                   # shadcn/ui base components
│   │   ├── layout/               # Shared layout components
│   │   └── common/               # Cross-role components
│   ├── lib/
│   │   ├── api-client.ts         # Shared API client
│   │   ├── auth.tsx              # Shared auth utilities
│   │   └── types.ts              # Shared TypeScript types
│   └── hooks/
│       └── use-auth.ts           # Shared auth hooks
└── package.json
```

---

## 👥 User Personas & Access Patterns

### ADMIN Persona: "Platform Administrator"
**Profile**: Technical operations manager, manages platform-wide operations
**Access Level**: Full system access, cross-tenant visibility
**Primary Goals**: System health, user management, revenue optimization

### RECRUITER Persona: "Priya Sharma - HR Manager"
**Profile**: Mid-sized logistics HR manager, 3-5 campaigns/month
**Access Level**: Single-tenant (company-specific), hiring workflows
**Primary Goals**: Fast candidate review, informed hiring decisions, campaign efficiency

### VIEWER Persona: "Read-only Employer"
**Profile**: Stakeholder who needs visibility but no write access
**Access Level**: Single-tenant, read-only
**Primary Goals**: Monitor hiring progress, view analytics

---

## 🎨 Visual Design System

### Color Palette - Role Differentiation

#### ADMIN Dashboard Colors
```css
/* Primary - Trust & Authority */
--admin-primary: #6366f1;        /* Indigo 500 */
--admin-primary-dark: #4f46e5;  /* Indigo 600 */
--admin-primary-light: #818cf8; /* Indigo 400 */

/* Secondary - System Status */
--admin-success: #10b981;       /* Emerald 500 */
--admin-warning: #f59e0b;       /* Amber 500 */
--admin-danger: #ef4444;        /* Red 500 */
--admin-info: #3b82f6;          /* Blue 500 */

/* Backgrounds */
--admin-bg-primary: #0f172a;     /* Slate 900 */
--admin-bg-secondary: #1e293b;  /* Slate 800 */
--admin-bg-tertiary: #334155;   /* Slate 700 */
```

#### RECRUITER Dashboard Colors
```css
/* Primary - Action & Engagement */
--recruiter-primary: #8b5cf6;    /* Violet 500 */
--recruiter-primary-dark: #7c3aed; /* Violet 600 */
--recruiter-primary-light: #a78bfa; /* Violet 400 */

/* Secondary - Candidate Status */
--recruiter-success: #10b981;    /* Emerald 500 */
--recruiter-warning: #f59e0b;    /* Amber 500 */
--recruiter-danger: #ef4444;     /* Red 500 */
--recruiter-info: #3b82f6;       /* Blue 500 */

/* Backgrounds */
--recruiter-bg-primary: #000000; /* Black */
--recruiter-bg-secondary: #111827; /* Gray 900 */
--recruiter-bg-tertiary: #1f2937;  /* Gray 800 */
```

### Typography System
```css
/* Font Family */
--font-primary: 'Inter', system-ui, sans-serif;
--font-mono: 'JetBrains Mono', monospace;

/* Font Sizes */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Spacing System
```css
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
--space-12: 3rem;    /* 48px */
```

---

## 🖥️ ADMIN Dashboard Design

### Navigation Structure
```
ADMIN Sidebar Navigation:
├── 🏠 Overview                    # System health dashboard
├── 👥 Users                       # User management
│   ├── All Users
│   ├── Add User
│   ├── User Permissions
│   └── User Activity
├── 🏢 Companies                  # Company management
│   ├── All Companies
│   ├── Company Onboarding
│   ├── Subscription Management
│   └── Company Analytics
├── ⚙️ System                      # System administration
│   ├── Health Monitoring
│   ├── Performance Metrics
│   ├── Configuration
│   └── Error Logs
├── 💰 Billing                     # Revenue management
│   ├── Subscriptions
│   ├── Invoices
│   ├── Usage Analytics
│   └── Revenue Reports
├── 🔍 Audit                       # Compliance & audit
│   ├── Audit Logs
│   ├── Compliance Reports
│   ├── Security Events
│   └── Data Export
├── 🔗 Integrations               # Third-party integrations
│   ├── API Management
│   ├── Webhooks
│   ├── Service Status
│   └── Integration Settings
└── ⚙️ Settings                    # Admin settings
├── Profile
├── Notifications
├── Security
└── API Keys
```

### Key ADMIN Screens

#### 1. Overview Dashboard
**Purpose**: System health at a glance
**Layout**: Grid-based metrics with drill-down capability

```tsx
// Admin Overview Layout
┌─────────────────────────────────────────────────────────┐
│  AROHAN ADMIN                    🔔 Admin | ⚙️ Settings  │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Total Users  │  │ Total Companies│  │ Active Sessions│ │
│  │    1,247     │  │      89      │  │      342      │  │
│  │  ▲ 12%       │  │  ▲ 8%        │  │  ▲ 15%       │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│                                                           │
│  ┌──────────────────────────────────────────────────┐   │
│  │              System Health Status                │   │
│  │  🟢 API: Healthy  🟢 Database: Healthy  🟡 Queue: High Load│   │
│  └──────────────────────────────────────────────────┘   │
│                                                           │
│  ┌──────────────────────────────────────────────────┐   │
│  │              Revenue This Month                  │   │
│  │  ₹4,52,000  ▲ 18% vs last month                   │   │
│  └──────────────────────────────────────────────────┘   │
│                                                           │
│  ┌──────────────────────────────────────────────────┐   │
│  │              Recent Activity                     │   │
│  │  • New company onboarded: LogisticsPro Ltd        │   │
│  │  • User created: priya.sharma@logisticspro.com   │   │
│  │  • Subscription upgraded: Growth plan            │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

#### 2. User Management
**Purpose**: CRUD operations for users across all companies
**Features**: Search, filter, bulk actions, permission management

```tsx
// User Management Table
┌─────────────────────────────────────────────────────────┐
│  Users                                    [+ Add User]  │
├─────────────────────────────────────────────────────────┤
│  Search: [___________] Filter: [Role ▼] [Company ▼]     │
├─────────────────────────────────────────────────────────┤
│  ☐ Name           Email              Role    Company     │
│  ☐ Priya Sharma   priya@logistics.com Recruiter LogisticsPro│
│  ☐ Raj Kumar      raj@retail.com      Viewer  RetailMax  │
│  ☐ Amit Singh     amit@warehouse.com  Admin   WarehouseCo│
│  ☐ ...                                                     │
├─────────────────────────────────────────────────────────┤
│  [Delete Selected] [Export] [1-50 of 1,247]              │
└─────────────────────────────────────────────────────────┘
```

#### 3. Company Management
**Purpose**: Manage companies, subscriptions, and billing
**Features**: Company onboarding, plan management, usage analytics

```tsx
// Company Management Card
┌─────────────────────────────────────────────────────────┐
│  Companies                                   [+ Onboard]  │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────┐   │
│  │ LogisticsPro Ltd                    Active       │   │
│  │ Plan: Growth | Users: 12 | Screenings: 1,234    │   │
│  │ [View Details] [Manage] [Billing]              │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │ RetailMax India                      Active       │   │
│  │ Plan: Startup | Users: 5 | Screenings: 456      │   │
│  │ [View Details] [Manage] [Billing]              │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### ADMIN UI Components

#### AdminSidebar Component
```tsx
interface AdminSidebarProps {
activeTab: string;
setActiveTab: (tab: string) => void;
userRole: 'ADMIN' | 'SUPER_ADMIN';
}

const adminMenuItems = [
{ id: 'overview', icon: LayoutDashboard, label: 'Overview', badge: null },
{ id: 'users', icon: Users, label: 'Users', badge: '1,247' },
{ id: 'companies', icon: Building2, label: 'Companies', badge: '89' },
{ id: 'system', icon: Server, label: 'System', badge: null },
{ id: 'billing', icon: IndianRupee, label: 'Billing', badge: null },
{ id: 'audit', icon: Shield, label: 'Audit', badge: '3 alerts' },
{ id: 'integrations', icon: Link, label: 'Integrations', badge: null },
{ id: 'settings', icon: Settings, label: 'Settings', badge: null },
];
```

#### AdminMetricCard Component
```tsx
interface AdminMetricCardProps {
title: string;
value: string | number;
change?: number;
trend?: 'up' | 'down' | 'neutral';
icon: LucideIcon;
color?: 'indigo' | 'emerald' | 'amber' | 'red';
}

// Usage Example
<AdminMetricCard
title="Total Users"
value="1,247"
change={12}
trend="up"
icon={Users}
color="indigo"
/>
```

---

## 🎯 RECRUITER Dashboard Design

### Navigation Structure
```
RECRUITER Sidebar Navigation:
├── 📊 Overview                    # Campaign & hiring overview
├── 📋 Campaigns                   # Campaign management
│   ├── Active Campaigns
│   ├── Campaign History
│   ├── Create Campaign
│   └── Campaign Analytics
├── 👤 Candidates                  # Candidate management
│   ├── All Candidates
│   ├── Shortlisted
│   ├── Rejected
│   └── Search & Filter
├── 📝 Requisitions                # Job requisitions
│   ├── Open Requisitions
│   ├── Create Requisition
│   ├── Match Candidates
│   └── Requisition Analytics
├── 📄 Scorecards                  # Candidate scorecards
│   ├── Recent Scorecards
│   ├── Scorecard Details
│   ├── Audio Review
│   └── Transcript Analysis
├── 📈 Analytics                   # Hiring analytics
│   ├── Pipeline Metrics
│   ├── Time-to-Hire
│   ├── Candidate Quality
│   └── Custom Reports
└── ⚙️ Settings                    # Recruiter settings
    ├── Profile
    ├── Notifications
    ├── Team Management
    └── API Access
```

### Key RECRUITER Screens

#### 1. Recruiter Overview
**Purpose**: Hiring pipeline at a glance
**Layout**: Campaign-focused with candidate metrics

```tsx
// Recruiter Overview Layout
┌─────────────────────────────────────────────────────────┐
│  AROHAN                    🔔 Priya Sharma | ⚙️ Settings  │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Active Campaigns│  │ Candidates This Week│  │ Shortlist Rate│ │
│  │      3       │  │      156     │  │     67%      │  │
│  │  Delivery    │  │  ▲ 23%       │  │  ▲ 8%        │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│                                                           │
│  ┌──────────────────────────────────────────────────┐   │
│  │              Active Campaigns                     │   │
│  │  🚀 Delivery Partners - 45 candidates screened    │   │
│  │  📦 Warehouse Staff - 32 candidates screened      │   │
│  │  🛒 Retail Associates - 28 candidates screened    │   │
│  └──────────────────────────────────────────────────┘   │
│                                                           │
│  ┌──────────────────────────────────────────────────┐   │
│  │              Top Candidates This Week             │   │
│  │  🥇 Rahul Kumar - 92/100 - Delivery Partner       │   │
│  │  🥈 Priya Singh - 88/100 - Warehouse Staff        │   │
│  │  🥉 Amit Verma - 85/100 - Retail Associate        │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

#### 2. Candidate Management
**Purpose**: Review, filter, and action on candidates
**Features**: Advanced filtering, bulk actions, scorecard preview

```tsx
// Candidate Management Table
┌─────────────────────────────────────────────────────────┐
│  Candidates                    [Shortlist] [Reject] [Export]│
├─────────────────────────────────────────────────────────┤
│  Search: [___________] Score: [70+ ▼] Language: [Hindi ▼]│
├─────────────────────────────────────────────────────────┤
│  ☐ Name          Phone    Score  Language  Status       │
│  ☐ Rahul Kumar   +91-9876  92/100 Hindi     ⭐ Shortlisted│
│  ☐ Priya Singh   +91-8765  88/100 Hinglish  ⭐ Shortlisted│
│  ☐ Amit Verma    +91-7654  85/100 Hindi     ⏳ Pending    │
│  ☐ Sunita Devi   +91-6543  72/100 Tamil     ⏳ Pending    │
│  ☐ ...                                                     │
├─────────────────────────────────────────────────────────┤
│  [Bulk Shortlist] [Bulk Reject] [1-50 of 156]            │
└─────────────────────────────────────────────────────────┘
```

#### 3. Scorecard Detail View
**Purpose**: Detailed candidate assessment review
**Features**: Score breakdown, transcript, audio playback, job matching

```tsx
// Scorecard Detail Layout
┌─────────────────────────────────────────────────────────┐
│  ← Back to Candidates    Rahul Kumar    [Shortlist] [Reject]│
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌─────────────────────────────────────────────────┐   │
│  │              Overall Score: 92/100              │   │
│  │  🟢 Communication: 95/100  🟢 Domain: 90/100      │   │
│  │  🟢 Situational: 88/100  🟢 Confidence: 94/100   │   │
│  └─────────────────────────────────────────────────┘   │
│                                                           │
│  ┌─────────────────────────────────────────────────┐   │
│  │              Language Fluency: Native           │   │
│  │  Detected: Hindi (hi-IN) | Confidence: 94%      │   │
│  └─────────────────────────────────────────────────┘   │
│                                                           │
│  ┌─────────────────────────────────────────────────┐   │
│  │              Interview Transcript               │   │
│  │  Proctor: Tell me about your experience with... │   │
│  │  Candidate: I have 3 years of experience in...  │   │
│  │  [▶ Play Audio] [Download Transcript]           │   │
│  └─────────────────────────────────────────────────┘   │
│                                                           │
│  ┌─────────────────────────────────────────────────┐   │
│  │              Matched Requisitions               │   │
│  │  📍 Delivery Partner - Nagpur (12km) - Match: 94%│   │
│  │  📍 Warehouse Staff - Nagpur (8km) - Match: 88% │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### RECRUITER UI Components

#### RecruiterSidebar Component
```tsx
interface RecruiterSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: 'RECRUITER' | 'VIEWER';
}

const recruiterMenuItems = [
  { id: 'overview', icon: LayoutDashboard, label: 'Overview', badge: null },
  { id: 'campaigns', icon: Megaphone, label: 'Campaigns', badge: '3 active' },
  { id: 'candidates', icon: Users, label: 'Candidates', badge: '156 this week' },
  { id: 'requisitions', icon: Briefcase, label: 'Requisitions', badge: '5 open' },
  { id: 'scorecards', icon: FileText, label: 'Scorecards', badge: '23 new' },
  { id: 'analytics', icon: BarChart3, label: 'Analytics', badge: null },
  { id: 'settings', icon: Settings, label: 'Settings', badge: null },
];
```

#### CandidateCard Component
```tsx
interface CandidateCardProps {
  candidate: Candidate;
  onShortlist: (id: string) => void;
  onReject: (id: string) => void;
  onViewScorecard: (id: string) => void;
}

// Usage Example
<CandidateCard
  candidate={{
    id: '123',
    name: 'Rahul Kumar',
    phone: '+91-9876543210',
    overallScore: 92,
    language: 'Hindi',
    status: 'pending'
  }}
  onShortlist={handleShortlist}
  onReject={handleReject}
  onViewScorecard={handleViewScorecard}
/>
```

#### ScorecardBreakdown Component
```tsx
interface ScorecardBreakdownProps {
  scorecard: Scorecard;
  showTranscript?: boolean;
  showAudio?: boolean;
}

// Usage Example
<ScorecardBreakdown
  scorecard={{
    overallScore: 92,
    communicationScore: 95,
    domainKnowledgeScore: 90,
    situationalJudgmentScore: 88,
    confidenceScore: 94,
    languageFluency: 'native',
    assessorNotes: 'Strong candidate with excellent communication...'
  }}
  showTranscript={true}
  showAudio={true}
/>
```

---

## 🔐 Authentication & Authorization

### Role-Based Routing
```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token');
  const userRole = getUserRoleFromToken(token?.value);

  const { pathname } = request.nextUrl;

  // Admin routes protection
  if (pathname.startsWith('/admin')) {
    if (!token || userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/unauthorized', request));
    }
  }

  // Recruiter routes protection
  if (pathname.startsWith('/dashboard')) {
    if (!token || !['RECRUITER', 'VIEWER'].includes(userRole)) {
      return NextResponse.redirect(new URL('/unauthorized', request));
    }
  }

  return NextResponse.next();
}
```

### Permission-Based Component Rendering
```tsx
// PermissionWrapper Component
interface PermissionWrapperProps {
  requiredPermission: Permission;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

function PermissionWrapper({ requiredPermission, fallback, children }: PermissionWrapperProps) {
  const { user } = useAuth();
  const hasPermission = checkPermission(user.role, requiredPermission);

  if (!hasPermission) {
    return fallback || null;
  }

  return <>{children}</>;
}

// Usage Example
<PermissionWrapper requiredPermission={Permission.USER_DELETE}>
  <Button variant="destructive">Delete User</Button>
</PermissionWrapper>
```

---

## 📱 Responsive Design Strategy

### Breakpoint System
```css
/* Mobile First Approach */
/* Mobile: < 640px */
@media (max-width: 639px) {
  .sidebar { display: none; }
  .mobile-nav { display: flex; }
}

/* Tablet: 640px - 1024px */
@media (min-width: 640px) and (max-width: 1023px) {
  .sidebar { width: 200px; }
  .main-content { margin-left: 200px; }
}

/* Desktop: >= 1024px */
@media (min-width: 1024px) {
  .sidebar { width: 256px; }
  .main-content { margin-left: 256px; }
}
```

### Mobile Navigation
```tsx
// Mobile Navigation Component
function MobileNavigation({ activeTab, setActiveTab }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        className="md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu />
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black">
          <nav className="p-4 space-y-2">
            {menuItems.map(item => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? 'default' : 'ghost'}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsOpen(false);
                }}
              >
                <item.icon className="mr-2" />
                {item.label}
              </Button>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
```

---

## ⚡ Performance Optimization

### Code Splitting Strategy
```typescript
// Dynamic imports for route-based splitting
const AdminOverview = dynamic(() => import('./admin/overview'));
const AdminUsers = dynamic(() => import('./admin/users'));
const RecruiterCampaigns = dynamic(() => import('./recruiter/campaigns'));
const RecruiterCandidates = dynamic(() => import('./recruiter/candidates'));
```

### Lazy Loading Components
```tsx
// Lazy load heavy components
const ScorecardDetail = lazy(() => import('./components/ScorecardDetail'));
const AudioPlayer = lazy(() => import('./components/AudioPlayer'));
const TranscriptViewer = lazy(() => import('./components/TranscriptViewer'));
```

### Virtual Scrolling
```tsx
// VirtualList for large datasets
import { useVirtualizer } from '@tanstack/react-virtual';

function CandidateList({ candidates }: { candidates: Candidate[] }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: candidates.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80,
    overscan: 5,
  });

  return (
    <div ref={parentRef} style={{ height: '600px', overflow: 'auto' }}>
      {virtualizer.getVirtualItems().map(virtualItem => (
        <CandidateCard
          key={virtualItem.key}
          candidate={candidates[virtualItem.index]}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', transform: `translateY(${virtualItem.start}px)` }}
        />
      ))}
    </div>
  );
}
```

---

## ♿ Accessibility Features

### WCAG 2.1 AA Compliance
```tsx
// Accessible Button Component
function AccessibleButton({ children, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      aria-label={props['aria-label'] || children?.toString()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          props.onClick?.(e as any);
        }
      }}
    >
      {children}
    </button>
  );
}

// Keyboard Navigation
function useKeyboardNavigation(items: MenuItem[]) {
  const [focusedIndex, setFocusedIndex] = useState(0);

  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        setFocusedIndex((prev) => (prev + 1) % items.length);
        break;
      case 'ArrowUp':
        setFocusedIndex((prev) => (prev - 1 + items.length) % items.length);
        break;
      case 'Enter':
        items[focusedIndex].onClick();
        break;
    }
  };

  return { focusedIndex, handleKeyDown };
}
```

### Screen Reader Support
```tsx
// Screen Reader Announcements
function useAnnouncer() {
  const announce = (message: string) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    setTimeout(() => document.body.removeChild(announcement), 1000);
  };

  return { announce };
}

// Usage
const { announce } = useAnnouncer();
announce('Candidate shortlisted successfully');
```

---

## 🔄 State Management Strategy

### Global State (Zustand)
```typescript
// stores/auth-store.ts
interface AuthState {
  user: User | null;
  token: string | null;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  logout: () => set({ user: null, token: null }),
}));

// stores/admin-store.ts
interface AdminState {
  selectedCompany: string | null;
  selectedUser: string | null;
  filters: AdminFilters;
  setSelectedCompany: (id: string) => void;
  setSelectedUser: (id: string) => void;
  setFilters: (filters: AdminFilters) => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  selectedCompany: null,
  selectedUser: null,
  filters: {},
  setSelectedCompany: (id) => set({ selectedCompany: id }),
  setSelectedUser: (id) => set({ selectedUser: id }),
  setFilters: (filters) => set({ filters }),
}));

// stores/recruiter-store.ts
interface RecruiterState {
  selectedCampaign: string | null;
  selectedCandidate: string | null;
  filters: RecruiterFilters;
  setSelectedCampaign: (id: string) => void;
  setSelectedCandidate: (id: string) => void;
  setFilters: (filters: RecruiterFilters) => void;
}

export const useRecruiterStore = create<RecruiterState>((set) => ({
  selectedCampaign: null,
  selectedCandidate: null,
  filters: {},
  setSelectedCampaign: (id) => set({ selectedCampaign: id }),
  setSelectedCandidate: (id) => set({ selectedCandidate: id }),
  setFilters: (filters) => set({ filters }),
}));
```

---

## 🧪 Testing Strategy

### Component Testing
```typescript
// AdminSidebar.test.tsx
describe('AdminSidebar', () => {
  it('renders all menu items', () => {
    const { getByText } = render(<AdminSidebar activeTab="overview" setActiveTab={jest.fn()} />);
    expect(getByText('Overview')).toBeInTheDocument();
    expect(getByText('Users')).toBeInTheDocument();
    expect(getByText('Companies')).toBeInTheDocument();
  });

  it('highlights active tab', () => {
    const { getByText } = render(<AdminSidebar activeTab="users" setActiveTab={jest.fn()} />);
    const usersButton = getByText('Users');
    expect(usersButton).toHaveClass('bg-gradient-to-r');
  });
});

// CandidateCard.test.tsx
describe('CandidateCard', () => {
  it('displays candidate information correctly', () => {
    const candidate = {
      id: '123',
      name: 'Rahul Kumar',
      phone: '+91-9876543210',
      overallScore: 92,
      language: 'Hindi',
      status: 'pending'
    };

    const { getByText } = render(
      <CandidateCard
        candidate={candidate}
        onShortlist={jest.fn()}
        onReject={jest.fn()}
        onViewScorecard={jest.fn()}
      />
    );

    expect(getByText('Rahul Kumar')).toBeInTheDocument();
    expect(getByText('92/100')).toBeInTheDocument();
  });
});
```

### E2E Testing
```typescript
// admin.spec.ts
test('admin can create new user', async ({ page }) => {
  await page.goto('/admin/users');
  await page.click('button:has-text("Add User")');
  await page.fill('input[name="name"]', 'Test User');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.selectOption('select[name="role"]', 'RECRUITER');
  await page.click('button:has-text("Create User")');
  await expect(page.locator('text=Test User')).toBeVisible();
});

// recruiter.spec.ts
test('recruiter can shortlist candidate', async ({ page }) => {
  await page.goto('/dashboard/candidates');
  await page.click('text=Rahul Kumar');
  await page.click('button:has-text("Shortlist")');
  await expect(page.locator('text=Candidate shortlisted successfully')).toBeVisible();
});
```

---

## 📊 Analytics & Monitoring

### Performance Monitoring
```typescript
// lib/performance.ts
export function trackPageView(page: string) {
  // Send to analytics
  analytics.track('page_view', { page });
}

export function trackUserAction(action: string, metadata?: any) {
  // Send to analytics
  analytics.track('user_action', { action, ...metadata });
}

export function trackError(error: Error, context?: any) {
  // Send to error tracking
  errorTracker.captureException(error, { context });
}

// Usage in components
useEffect(() => {
  trackPageView('admin/overview');
}, []);
```

### User Behavior Analytics
```typescript
// hooks/useAnalytics.ts
export function useAnalytics() {
  const trackEvent = (eventName: string, properties?: any) => {
    // Track user interactions
    analytics.track(eventName, {
      timestamp: new Date().toISOString(),
      ...properties,
    });
  };

  const trackPageView = (pageName: string) => {
    trackEvent('page_view', { page: pageName });
  };

  const trackButtonClick = (buttonName: string) => {
    trackEvent('button_click', { button: buttonName });
  };

  return { trackEvent, trackPageView, trackButtonClick };
}
```

---

## 🚀 Implementation Roadmap

### Phase 1: Foundation (Week 1-2)
- [ ] Set up separate admin and recruiter dashboard projects
- [ ] Implement shared component library
- [ ] Create authentication and authorization middleware
- [ ] Set up routing structure for both dashboards
- [ ] Implement basic layout components

### Phase 2: ADMIN Dashboard (Week 3-4)
- [ ] Implement admin overview dashboard
- [ ] Build user management interface
- [ ] Create company management system
- [ ] Implement system health monitoring
- [ ] Add billing and subscription management
- [ ] Create audit log viewer
- [ ] Implement integration management
- [ ] Add admin settings pages

### Phase 3: RECRUITER Dashboard (Week 5-6)
- [ ] Implement recruiter overview dashboard
- [ ] Build campaign management interface
- [ ] Create candidate management system
- [ ] Implement requisition management
- [ ] Build scorecard detail views
- [ ] Add analytics and reporting
- [ ] Create advanced filtering and search
- [ ] Implement bulk actions

### Phase 4: Integration & Testing (Week 7-8)
- [ ] Connect dashboards to FastAPI backend
- [ ] Implement real-time updates (WebSocket)
- [ ] Add error handling and loading states
- [ ] Perform comprehensive testing
- [ ] Optimize performance for CPU-only hardware
- [ ] Implement accessibility features
- [ ] Add responsive design for mobile
- [ ] Create user documentation

### Phase 5: Deployment & Monitoring (Week 9-10)
- [ ] Set up production deployment
- [ ] Configure monitoring and alerting
- [ ] Implement analytics tracking
- [ ] Create admin and recruiter onboarding flows
- [ ] Perform security audit
- [ ] Load testing and optimization
- [ ] Create backup and recovery procedures
- [ ] Launch and monitor initial usage

---

## 🎨 Design System Documentation

### Component Library Structure
```
shared/
├── src/
│   ├── components/
│   │   ├── ui/                    # shadcn/ui base components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   ├── table.tsx
│   │   │   ├── select.tsx
│   │   │   ├── switch.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── loading.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── tooltip.tsx
│   │   │   ├── popover.tsx
│   │   │   ├── separator.tsx
│   │   │   └── avatar.tsx
│   │   ├── layout/               # Shared layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── MobileNav.tsx
│   │   │   └── Container.tsx
│   │   ├── admin/                # Admin-specific components
│   │   │   ├── AdminSidebar.tsx
│   │   │   ├── AdminHeader.tsx
│   │   │   ├── AdminMetricCard.tsx
│   │   │   ├── UserTable.tsx
│   │   │   ├── CompanyCard.tsx
│   │   │   ├── SystemHealth.tsx
│   │   │   └── AuditLogViewer.tsx
│   │   └── recruiter/            # Recruiter-specific components
│   │       ├── RecruiterSidebar.tsx
│   │       ├── RecruiterHeader.tsx
│   │       ├── CampaignCard.tsx
│   │       ├── CandidateTable.tsx
│   │       ├── CandidateCard.tsx
│   │       ├── ScorecardDetail.tsx
│   │       ├── RequisitionCard.tsx
│   │       └── AnalyticsChart.tsx
│   ├── lib/
│   │   ├── api-client.ts         # Shared API client
│   │   ├── auth.tsx              # Shared auth utilities
│   │   ├── types.ts              # Shared TypeScript types
│   │   ├── utils.ts              # Shared utility functions
│   │   ├── constants.ts          # Shared constants
│   │   ├── validators.ts
│   │   └── formatters.ts
│   ├── hooks/
│   │   ├── use-auth.ts           # Shared auth hooks
│   │   ├── use-api.ts            # Shared API hooks
│   │   ├── use-permissions.ts    # Permission hooks
│   │   ├── use-analytics.ts      # Analytics hooks
│   │   ├── use-debounce.ts
│   │   ├── use-local-storage.ts
│   │   └── use-media-query.ts
│   └── stores/
│       ├── auth-store.ts         # Auth state management
│       ├── ui-store.ts
│       └── notification-store.ts
├── package.json
├── tsconfig.json
└── index.ts                      # Export all components
```

### Design Tokens
```typescript
// lib/constants/design-tokens.ts
export const DesignTokens = {
  // Spacing
  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    '2xl': '3rem',    // 48px
  },

  // Border Radius
  borderRadius: {
    sm: '0.25rem',    // 4px
    md: '0.5rem',     // 8px
    lg: '0.75rem',    // 12px
    xl: '1rem',       // 16px
    full: '9999px',
  },

  // Shadows
  shadow: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
  },

  // Transitions
  transition: {
    fast: '150ms ease-in-out',
    base: '200ms ease-in-out',
    slow: '300ms ease-in-out',
  },

  // Z-Index
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modal: 1040,
    popover: 1050,
    tooltip: 1060,
  },
};
```

---

## 🔧 Technical Implementation Details

### File Structure for ADMIN Dashboard
```
admin/
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   ├── layout.tsx              # Admin layout wrapper
│   │   │   ├── page.tsx               # Admin overview
│   │   │   ├── users/
│   │   │   │   ├── page.tsx           # User list
│   │   │   │   ├── [id]/
│   │   │   │   │   └── page.tsx       # User detail
│   │   │   │   └── new/
│   │   │   │       └── page.tsx       # Create user
│   │   │   ├── companies/
│   │   │   │   ├── page.tsx           # Company list
│   │   │   │   ├── [id]/
│   │   │   │   │   └── page.tsx       # Company detail
│   │   │   │   └── new/
│   │   │   │       └── page.tsx       # Create company
│   │   │   ├── system/
│   │   │   │   ├── page.tsx           # System health
│   │   │   │   ├── performance/
│   │   │   │   │   └── page.tsx       # Performance metrics
│   │   │   │   └── logs/
│   │   │   │       └── page.tsx       # Error logs
│   │   │   ├── billing/
│   │   │   │   ├── page.tsx           # Billing overview
│   │   │   │   ├── subscriptions/
│   │   │   │   │   └── page.tsx       # Subscription management
│   │   │   │   └── invoices/
│   │   │   │       └── page.tsx       # Invoice management
│   │   │   ├── audit/
│   │   │   │   ├── page.tsx           # Audit log overview
│   │   │   │   ├── compliance/
│   │   │   │   │   └── page.tsx       # Compliance reports
│   │   │   │   └── security/
│   │   │   │       └── page.tsx       # Security events
│   │   │   ├── integrations/
│   │   │   │   ├── page.tsx           # Integration overview
│   │   │   │   ├── api/
│   │   │   │   │   └── page.tsx       # API management
│   │   │   │   └── webhooks/
│   │   │   │       └── page.tsx       # Webhook configuration
│   │   │   └── settings/
│   │   │       ├── page.tsx           # Settings overview
│   │   │       ├── profile/
│   │   │       │   └── page.tsx       # Profile settings
│   │   │       └── security/
│   │   │           └── page.tsx       # Security settings
│   │   ├── login/
│   │   │   └── page.tsx               # Admin login
│   │   ├── unauthorized/
│   │   │   └── page.tsx               # Unauthorized access
│   │   ├── layout.tsx                 # Root layout
│   │   └── globals.css                # Global styles
│   ├── components/
│   │   └── admin/                      # Admin-specific components
│   ├── lib/
│   │   ├── api-client.ts               # Admin API client
│   │   └── types.ts                    # Admin types
│   └── middleware.ts                  # Admin middleware
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.ts
```

### File Structure for RECRUITER Dashboard
```
dashboard/
├── src/
│   ├── app/
│   │   ├── dashboard/
│   │   │   ├── layout.tsx              # Recruiter layout wrapper
│   │   │   ├── page.tsx               # Recruiter overview
│   │   │   ├── campaigns/
│   │   │   │   ├── page.tsx           # Campaign list
│   │   │   │   ├── [id]/
│   │   │   │   │   └── page.tsx       # Campaign detail
│   │   │   │   └── new/
│   │   │   │       └── page.tsx       # Create campaign
│   │   │   ├── candidates/
│   │   │   │   ├── page.tsx           # Candidate list
│   │   │   │   ├── [id]/
│   │   │   │   │   └── page.tsx       # Candidate detail
│   │   │   │   ├── shortlisted/
│   │   │   │   │   └── page.tsx       # Shortlisted candidates
│   │   │   │   └── rejected/
│   │   │   │       └── page.tsx       # Rejected candidates
│   │   │   ├── requisitions/
│   │   │   │   ├── page.tsx           # Requisition list
│   │   │   │   ├── [id]/
│   │   │   │   │   └── page.tsx       # Requisition detail
│   │   │   │   └── new/
│   │   │   │       └── page.tsx       # Create requisition
│   │   │   ├── scorecards/
│   │   │   │   ├── page.tsx           # Scorecard list
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx       # Scorecard detail
│   │   │   ├── analytics/
│   │   │   │   ├── page.tsx           # Analytics overview
│   │   │   │   ├── pipeline/
│   │   │   │   │   └── page.tsx       # Pipeline metrics
│   │   │   │   └── reports/
│   │   │   │       └── page.tsx       # Custom reports
│   │   │   └── settings/
│   │   │       ├── page.tsx           # Settings overview
│   │   │       ├── profile/
│   │   │       │   └── page.tsx       # Profile settings
│   │   │       ├── team/
│   │   │       │   └── page.tsx       # Team management
│   │   │       └── notifications/
│   │   │           └── page.tsx       # Notification settings
│   │   ├── login/
│   │   │   └── page.tsx               # Recruiter login
│   │   ├── unauthorized/
│   │   │   └── page.tsx               # Unauthorized access
│   │   ├── layout.tsx                 # Root layout
│   │   └── globals.css                # Global styles
│   ├── components/
│   │   └── recruiter/                  # Recruiter-specific components
│   ├── lib/
│   │   ├── api-client.ts               # Recruiter API client
│   │   └── types.ts                    # Recruiter types
│   └── middleware.ts                  # Recruiter middleware
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.ts
```

---

## 📝 API Integration Patterns

### Shared API Client
```typescript
// shared/lib/api-client.ts
import axios from 'axios';

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  setToken(token: string) {
    this.token = token;
  }

  clearToken() {
    this.token = null;
  }

  private getHeaders() {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  async get<T>(url: string, params?: any): Promise<T> {
    const response = await axios.get<T>(`${this.baseURL}${url}`, {
      headers: this.getHeaders(),
      params,
    });
    return response.data;
  }

  async post<T>(url: string, data: any): Promise<T> {
    const response = await axios.post<T>(`${this.baseURL}${url}`, data, {
      headers: this.getHeaders(),
    });
    return response.data;
  }

  async put<T>(url: string, data: any): Promise<T> {
    const response = await axios.put<T>(`${this.baseURL}${url}`, data, {
      headers: this.getHeaders(),
    });
    return response.data;
  }

  async delete<T>(url: string): Promise<T> {
    const response = await axios.delete<T>(`${this.baseURL}${url}`, {
      headers: this.getHeaders(),
    });
    return response.data;
  }
}

// Create instances for different dashboards
export const adminApiClient = new ApiClient(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000');
export const recruiterApiClient = new ApiClient(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000');
```

### Admin API Hooks
```typescript
// admin/lib/hooks/use-admin-api.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApiClient } from '@/shared/lib/api-client';

// Users
export function useUsers(filters?: UserFilters) {
  return useQuery({
    queryKey: ['users', filters],
    queryFn: () => adminApiClient.get<User[]>('/api/admin/users', filters),
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UserCreate) => adminApiClient.post<User>('/api/admin/users', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UserUpdate }) =>
      adminApiClient.put<User>(`/api/admin/users/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminApiClient.delete(`/api/admin/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

// Companies
export function useCompanies(filters?: CompanyFilters) {
  return useQuery({
    queryKey: ['companies', filters],
    queryFn: () => adminApiClient.get<Company[]>('/api/admin/companies', filters),
  });
}

export function useCreateCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CompanyCreate) => adminApiClient.post<Company>('/api/admin/companies', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    },
  });
}

// System Health
export function useSystemHealth() {
  return useQuery({
    queryKey: ['system-health'],
    queryFn: () => adminApiClient.get<SystemHealth>('/api/admin/system/health'),
    refetchInterval: 30000, // Refresh every 30 seconds
  });
}
```

### Recruiter API Hooks
```typescript
// dashboard/lib/hooks/use-recruiter-api.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { recruiterApiClient } from '@/shared/lib/api-client';

// Campaigns
export function useCampaigns(filters?: CampaignFilters) {
  return useQuery({
    queryKey: ['campaigns', filters],
    queryFn: () => recruiterApiClient.get<Campaign[]>('/api/recruiter/campaigns', filters),
  });
}

export function useCreateCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CampaignCreate) => recruiterApiClient.post<Campaign>('/api/recruiter/campaigns', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
  });
}

// Candidates
export function useCandidates(filters?: CandidateFilters) {
  return useQuery({
    queryKey: ['candidates', filters],
    queryFn: () => recruiterApiClient.get<Candidate[]>('/api/recruiter/candidates', filters),
  });
}

export function useShortlistCandidate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => recruiterApiClient.post<Candidate>(`/api/recruiter/candidates/${id}/shortlist`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
    },
  });
}

export function useRejectCandidate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => recruiterApiClient.post<Candidate>(`/api/recruiter/candidates/${id}/reject`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
    },
  });
}

// Scorecards
export function useScorecard(candidateId: string) {
  return useQuery({
    queryKey: ['scorecard', candidateId],
    queryFn: () => recruiterApiClient.get<Scorecard>(`/api/recruiter/scorecards/${candidateId}`),
    enabled: !!candidateId,
  });
}

// Requisitions
export function useRequisitions(filters?: RequisitionFilters) {
  return useQuery({
    queryKey: ['requisitions', filters],
    queryFn: () => recruiterApiClient.get<Requisition[]>('/api/recruiter/requisitions', filters),
  });
}
```

---

## 🎯 User Experience Flows

### ADMIN Onboarding Flow
```
1. Admin Login
   ↓
2. System Health Check
   ↓
3. Quick Setup Wizard
   ├── Configure system settings
   ├── Set up monitoring alerts
   └── Configure integrations
   ↓
4. Dashboard Overview
   ↓
5. First Actions
   ├── Create first company
   ├── Create first admin user
   └── Review system status
```

### RECRUITER Onboarding Flow
```
1. Recruiter Login
   ↓
2. Company Profile Setup
   ├── Company information
   ├── Team members
   └── Notification preferences
   ↓
3. Dashboard Overview
   ↓
4. First Campaign Setup
   ├── Create requisition
   ├── Define screening criteria
   └── Launch campaign
   ↓
5. Candidate Review
   ↓
6. First Shortlist
```

### ADMIN Daily Workflow
```
1. Login → Overview Dashboard
   ↓
2. Review System Health
   ├── Check API status
   ├── Review database performance
   └── Monitor queue health
   ↓
3. Review User Activity
   ├── New user registrations
   ├── User activity patterns
   └── Security events
   ↓
4. Company Management
   ├── New company onboarding
   ├── Subscription management
   └── Billing review
   ↓
5. System Administration
   ├── Configuration updates
   ├── Integration management
   └── Performance optimization
   ↓
6. Audit & Compliance
   ├── Review audit logs
   ├── Compliance reports
   └── Security monitoring
```

### RECRUITER Daily Workflow
```
1. Login → Overview Dashboard
   ↓
2. Review Campaign Status
   ├── Active campaigns
   ├── Candidate progress
   └── Screening completion rates
   ↓
3. Candidate Review
   ├── Filter by score
   ├── Review top performers
   └── Shortlist candidates
   ↓
4. Scorecard Analysis
   ├── Detailed score review
   ├── Transcript analysis
   └── Audio review
   ↓
5. Requisition Management
   ├── Open requisitions
   ├── Candidate matching
   └── Hiring pipeline
   ↓
6. Analytics & Reporting
   ├── Pipeline metrics
   ├── Time-to-hire analysis
   └── Quality reports
```

---

## 🔒 Security Considerations

### Authentication Flow
```typescript
// shared/lib/auth.tsx
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { adminApiClient, recruiterApiClient } from './api-client';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const login = useCallback(async (email: string, password: string, role: 'ADMIN' | 'RECRUITER') => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        
        // Set token in appropriate API client
        if (role === 'ADMIN') {
          adminApiClient.setToken(data.token);
          router.push('/admin');
        } else {
          recruiterApiClient.setToken(data.token);
          router.push('/dashboard');
        }
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [router]);

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setUser(null);
      adminApiClient.clearToken();
      recruiterApiClient.clearToken();
      router.push('/login');
    }
  }, [router]);

  return { user, loading, login, logout };
}
```

### Permission Checking
```typescript
// shared/lib/permissions.ts
import { UserRole, Permission } from './types';

export function hasPermission(userRole: UserRole, permission: Permission): boolean {
  const rolePermissions: Record<UserRole, Permission[]> = {
    ADMIN: Object.values(Permission),
    RECRUITER: [
      Permission.REQUISITION_READ,
      Permission.REQUISITION_WRITE,
      Permission.CAMPAIGN_READ,
      Permission.CAMPAIGN_WRITE,
      Permission.CANDIDATE_READ,
      Permission.CANDIDATE_WRITE,
      Permission.CANDIDATE_SHORTLIST,
      Permission.SCORECARD_READ,
      Permission.ANALYTICS_READ,
    ],
    VIEWER: [
      Permission.REQUISITION_READ,
      Permission.CAMPAIGN_READ,
      Permission.CANDIDATE_READ,
      Permission.SCORECARD_READ,
      Permission.ANALYTICS_READ,
    ],
  };

  return rolePermissions[userRole]?.includes(permission) || false;
}

export function requirePermission(userRole: UserRole, permission: Permission): void {
  if (!hasPermission(userRole, permission)) {
    throw new Error(`Permission denied: ${permission}`);
  }
}
```

### Data Isolation
```typescript
// shared/lib/data-isolation.ts
export function ensureCompanyAccess(user: User, companyId: string): void {
  if (user.role === 'ADMIN') {
    // Admins can access all companies
    return;
  }

  if (user.companyId !== companyId) {
    throw new Error('Access denied: You do not have access to this company');
  }
}

export function filterByCompany<T extends { companyId: string }>(
  items: T[],
  user: User
): T[] {
  if (user.role === 'ADMIN') {
    return items;
  }

  return items.filter(item => item.companyId === user.companyId);
}
```

---

## 📊 Performance Metrics & KPIs

### ADMIN Dashboard KPIs
```typescript
// Admin Performance Metrics
interface AdminMetrics {
  // User Metrics
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  userRetentionRate: number;

  // Company Metrics
  totalCompanies: number;
  activeCompanies: number;
  newCompaniesThisMonth: number;
  companyChurnRate: number;

  // System Metrics
  apiResponseTime: number;
  databaseQueryTime: number;
  systemUptime: number;
  errorRate: number;

  // Revenue Metrics
  monthlyRecurringRevenue: number;
  averageRevenuePerUser: number;
  customerLifetimeValue: number;
  churnRate: number;
}
```

### RECRUITER Dashboard KPIs
```typescript
// Recruiter Performance Metrics
interface RecruiterMetrics {
  // Campaign Metrics
  activeCampaigns: number;
  totalCampaigns: number;
  campaignCompletionRate: number;
  averageCampaignDuration: number;

  // Candidate Metrics
  totalCandidates: number;
  screenedCandidates: number;
  shortlistedCandidates: number;
  shortlistRate: number;

  // Time Metrics
  averageTimeToScreen: number;
  averageTimeToShortlist: number;
  timeToHire: number;

  // Quality Metrics
  averageScore: number;
  scoreDistribution: ScoreDistribution;
  candidateQualityScore: number;
}
```

---

## 🚀 Deployment Strategy

### Environment Configuration
```bash
# .env.admin
NEXT_PUBLIC_API_URL=https://api.arohan.com
NEXT_PUBLIC_APP_URL=https://admin.arohan.com
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id

# .env.dashboard
NEXT_PUBLIC_API_URL=https://api.arohan.com
NEXT_PUBLIC_APP_URL=https://dashboard.arohan.com
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
```

### Build Optimization
```javascript
// next.config.js (Admin)
module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  compress: true,
  productionBrowserSourceMaps: false,
  
  // Optimize for CPU-only hardware
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },

  // Image optimization
  images: {
    domains: ['arohan.com'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
  },

  // Bundle analysis
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};
```

### Monitoring Setup
```typescript
// lib/monitoring.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  beforeSend(event) {
    // Filter out sensitive data
    if (event.request) {
      delete event.request.cookies;
    }
    return event;
  },
});

// Performance monitoring
export function trackPerformance(metricName: string, value: number) {
  // Send to monitoring service
  if (typeof window !== 'undefined' && 'performance' in window) {
    performance.mark(metricName);
    performance.measure(metricName, metricName);
  }
}
```

---

## 📚 Documentation Structure

### Developer Documentation
```
docs/
├── README.md
├── ARCHITECTURE.md
├── API_REFERENCE.md
├── COMPONENT_LIBRARY.md
├── STATE_MANAGEMENT.md
├── AUTHENTICATION.md
├── PERMISSIONS.md
├── TESTING.md
├── DEPLOYMENT.md
├── TROUBLESHOOTING.md
└── CONTRIBUTING.md
```

### User Documentation
```
user-docs/
├── admin/
│   ├── GETTING_STARTED.md
│   ├── USER_MANAGEMENT.md
│   ├── COMPANY_MANAGEMENT.md
│   ├── SYSTEM_ADMINISTRATION.md
│   ├── BILLING.md
│   └── TROUBLESHOOTING.md
└── recruiter/
    ├── GETTING_STARTED.md
    ├── CAMPAIGN_MANAGEMENT.md
    ├── CANDIDATE_REVIEW.md
    ├── REQUISITION_MANAGEMENT.md
    ├── ANALYTICS.md
    └── TROUBLESHOOTING.md
```

---

## ✅ Success Criteria

### ADMIN Dashboard Success Metrics
- [ ] System health monitoring with <30s refresh rate
- [ ] User management with <500ms response time
- [ ] Company management with <600ms response time
- [ ] Real-time alerts for system issues
- [ ] Comprehensive audit logging
- [ ] 99.9% uptime for admin functions
- [ ] <3s initial page load time
- [ ] WCAG 2.1 AA compliance

### RECRUITER Dashboard Success Metrics
- [ ] Campaign management with <800ms response time
- [ ] Candidate list with 200+ items in <800ms
- [ ] Scorecard detail view in <500ms
- [ ] Bulk actions on 50+ candidates in <2s
- [ ] Real-time candidate status updates
- [ ] Advanced filtering with <400ms response
- [ ] <2s initial page load time
- [ ] WCAG 2.1 AA compliance

---

## 🎯 Next Steps

1. **Review and Approve**: Stakeholder review of this design document
2. **Set Up Projects**: Initialize admin and dashboard Next.js projects
3. **Create Shared Library**: Set up shared component library
4. **Implement Authentication**: Build auth system with role-based routing
5. **Build ADMIN Dashboard**: Implement admin features phase by phase
6. **Build RECRUITER Dashboard**: Implement recruiter features phase by phase
7. **Integration Testing**: Connect to FastAPI backend
8. **Performance Optimization**: Optimize for CPU-only hardware
9. **User Testing**: Conduct usability testing with real users
10. **Launch**: Deploy to production and monitor

---

**Document Status**: ✅ Complete and Ready for Implementation  
**Last Updated**: 2026-05-03  
**Next Review**: After Phase 1 completion  
**Maintained By**: Orchestrator Prime (AI Architect)
