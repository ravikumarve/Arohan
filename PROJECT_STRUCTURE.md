# AROHAN Project Structure

## Root Directory
```
AROHAN/
├── admin/                    # Admin Dashboard (Platform Management)
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── login/
│   │   │   └── admin/
│   │   │       ├── layout.tsx
│   │   │       └── page.tsx
│   │   ├── components/
│   │   │   └── admin/
│   │   │       ├── AdminSidebar.tsx
│   │   │       └── AdminHeader.tsx
│   │   ├── lib/
│   │   ├── hooks/
│   │   └── stores/
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.ts
│   └── tailwind.config.js
│
├── recruiter/                # Recruiter Dashboard (Employer Workflows)
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── login/
│   │   │   └── dashboard/
│   │   │       ├── layout.tsx
│   │   │       └── page.tsx
│   │   ├── components/
│   │   │   └── recruiter/
│   │   │       ├── RecruiterSidebar.tsx
│   │   │       └── RecruiterHeader.tsx
│   │   ├── lib/
│   │   ├── hooks/
│   │   └── stores/
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.ts
│   └── tailwind.config.js
│
├── shared/                   # Shared Component Library
│   ├── src/
│   │   ├── lib/
│   │   │   ├── types.ts              # TypeScript interfaces
│   │   │   ├── api-client.ts         # Axios API client
│   │   │   ├── auth.tsx              # Auth store & utilities
│   │   │   ├── utils.ts              # Helper functions
│   │   │   └── constants.ts         # Constants & config
│   │   ├── components/
│   │   │   └── ui/
│   │   │       ├── Button.tsx
│   │   │       ├── Card.tsx
│   │   │       ├── Input.tsx
│   │   │       ├── Select.tsx
│   │   │       ├── Badge.tsx
│   │   │       ├── Table.tsx
│   │   │       ├── Modal.tsx
│   │   │       ├── Toast.tsx
│   │   │       ├── LoadingSpinner.tsx
│   │   │       ├── EmptyState.tsx
│   │   │       └── index.ts
│   │   ├── hooks/
│   │   │   ├── useApi.ts
│   │   │   └── index.ts
│   │   ├── middleware/
│   │   │   └── auth.ts
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
│
├── dashboard/                # Existing System Dashboard (Technical)
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx
│   │   │   └── layout.tsx
│   │   ├── components/
│   │   ├── lib/
│   │   └── hooks/
│   ├── package.json
│   └── ...
│
├── docs/                     # Documentation
│   ├── PRD.md
│   ├── ADR.md
│   ├── API_SPEC.md
│   ├── DASHBOARD_ARCHITECTURE_DESIGN.md
│   └── DASHBOARD_COMPARISON_ANALYSIS.md
│
├── AGENTS.md                 # Agent Instructions & Session Memory
├── PHASE1_COMPLETION_SUMMARY.md
├── PROJECT_STRUCTURE.md
└── README.md
```

## Dashboard Comparison

### System Dashboard (`/dashboard`)
**Purpose**: Technical monitoring and testing
**Users**: Development team, technical staff
**Features**: 
- Agent monitoring
- Session tracking
- Integration testing
- System diagnostics

### Admin Dashboard (`/admin`)
**Purpose**: Platform management
**Users**: Platform administrators
**Features**:
- User management
- Company management
- Billing & subscriptions
- System monitoring
- Audit logs
- Platform settings

### Recruiter Dashboard (`/dashboard` - Recruiter)
**Purpose**: Employer hiring workflows
**Users**: HR managers, recruiters
**Features**:
- Campaign management
- Candidate management
- Requisition management
- Interview scheduling
- Analytics & reports
- Company settings

## Shared Library Structure

### Types (`src/lib/types.ts`)
```typescript
// Core Entities
- User
- Company
- Campaign
- Candidate
- Scorecard
- Requisition

// Enums
- UserRole (ADMIN, RECRUITER, VIEWER)
- CampaignStatus
- CandidateStatus
- RequisitionStatus

// API Types
- CreateUserRequest
- UpdateUserRequest
- CreateCompanyRequest
- UpdateCompanyRequest
- CreateCampaignRequest
- UpdateCampaignRequest
- CreateCandidateRequest
- UpdateCandidateRequest
- CreateRequisitionRequest
- UpdateRequisitionRequest
```

### API Client (`src/lib/api-client.ts`)
```typescript
// Methods
- get<T>(url, config)
- post<T>(url, data, config)
- put<T>(url, data, config)
- delete(url, config)

// Features
- Base URL configuration
- Auth header injection
- Error handling
- Response transformation
```

### Auth System (`src/lib/auth.tsx`)
```typescript
// Zustand Store
- useAuthStore()
  - user
  - token
  - login()
  - logout()
  - isAuthenticated()
  - hasPermission()

// Utilities
- useAuth() hook
- checkPermission()
- requireAuth()
```

### Utilities (`src/lib/utils.ts`)
```typescript
// Class Utilities
- cn() - Tailwind class merging

// Formatting
- formatDate()
- formatCurrency()
- formatPhoneNumber()

// Validation
- validateEmail()
- validatePhone()

// Text Utilities
- truncateText()
- generateId()
```

### UI Components (`src/components/ui/`)
```typescript
// Form Components
- Button
- Input
- Select

// Layout Components
- Card
- Modal

// Display Components
- Badge
- Table
- EmptyState
- LoadingSpinner

// Feedback Components
- Toast (ToastProvider, useToast)
```

### API Hooks (`src/hooks/useApi.ts`)
```typescript
// Generic Hook
- useApi<T>()

// Entity Hooks
- useUsers()
- useCompanies()
- useCampaigns()
- useCandidates()
- useRequisitions()
```

### Authentication Middleware (`src/middleware/auth.ts`)
```typescript
// Middleware Factory
- createAuthMiddleware(config)

// Pre-configured Middleware
- adminAuthMiddleware
- recruiterAuthMiddleware

// Features
- Public path configuration
- Role-based access control
- Login redirect
- Unauthorized handling
```

## Color Themes

### Admin Dashboard (Indigo)
```css
--admin-primary: #4F46E5;
--admin-primary-light: #818CF8;
--admin-primary-dark: #4338CA;
--admin-secondary: #EC4899;
--admin-success: #10B981;
--admin-warning: #F59E0B;
--admin-danger: #EF4444;
--admin-info: #3B82F6;
--admin-background-primary: #0F0F23;
--admin-background-secondary: #1A1A2E;
--admin-background-tertiary: #252542;
```

### Recruiter Dashboard (Violet)
```css
--recruiter-primary: #8B5CF6;
--recruiter-primary-light: #A78BFA;
--recruiter-primary-dark: #7C3AED;
--recruiter-secondary: #EC4899;
--recruiter-success: #10B981;
--recruiter-warning: #F59E0B;
--recruiter-danger: #EF4444;
--recruiter-info: #3B82F6;
--recruiter-background-primary: #0F0F23;
--recruiter-background-secondary: #1A1A2E;
--recruiter-background-tertiary: #252542;
```

## Development Workflow

### Starting Development
```bash
# Install dependencies
cd shared && npm install
cd ../admin && npm install
cd ../recruiter && npm install

# Start development servers
cd admin && npm run dev      # http://localhost:3000
cd recruiter && npm run dev  # http://localhost:3001
```

### Building for Production
```bash
# Build shared library first
cd shared && npm run build

# Build dashboards
cd admin && npm run build
cd recruiter && npm run build
```

### Testing
```bash
# Run tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test -- Button.test.tsx
```

## Key Files Reference

### Configuration Files
- `admin/next.config.ts` - Admin Next.js config
- `recruiter/next.config.ts` - Recruiter Next.js config
- `admin/tailwind.config.js` - Admin Tailwind config
- `recruiter/tailwind.config.js` - Recruiter Tailwind config
- `shared/tsconfig.json` - Shared TypeScript config

### Entry Points
- `admin/src/app/layout.tsx` - Admin root layout
- `recruiter/src/app/layout.tsx` - Recruiter root layout
- `admin/src/app/page.tsx` - Admin home page
- `recruiter/src/app/page.tsx` - Recruiter home page

### Main Pages
- `admin/src/app/admin/page.tsx` - Admin overview
- `recruiter/src/app/dashboard/page.tsx` - Recruiter overview
- `admin/src/app/login/page.tsx` - Admin login
- `recruiter/src/app/login/page.tsx` - Recruiter login

### Shared Exports
- `shared/src/index.ts` - Main export file
- `shared/src/components/ui/index.ts` - UI components export
- `shared/src/hooks/index.ts` - Hooks export

## Next Steps

### Phase 2 Implementation
1. Create admin-specific pages
2. Create recruiter-specific pages
3. Implement real API integration
4. Add data visualization components
5. Implement advanced filtering
6. Add real-time features

### Documentation
1. API documentation
2. Component documentation
3. Deployment guide
4. User guide
5. Developer guide

### Testing
1. Unit tests
2. Integration tests
3. E2E tests
4. Performance tests
5. Accessibility tests
