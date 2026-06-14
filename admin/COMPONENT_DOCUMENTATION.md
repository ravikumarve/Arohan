# AROHAN Admin Dashboard - Component Documentation

## Overview

This document provides comprehensive documentation for all components in the AROHAN Admin Dashboard component library. All components are built with TypeScript, follow React best practices, and are fully accessible (WCAG 2.1 AA compliant).

## Installation

```bash
npm install framer-motion recharts lucide-react next-themes react-hook-form @hookform/resolvers zod
```

## Component Categories

### 1. Core UI Components

#### Button
A versatile button component with multiple variants and sizes.

```tsx
import { Button } from "@/components/ui/button"

<Button variant="default" size="md">
  Click me
</Button>
```

**Variants:** `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`
**Sizes:** `sm`, `md`, `lg`, `icon`

#### Card
A flexible card component for grouping related content.

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    Card content goes here
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

#### Badge
Status badges with multiple color variants.

```tsx
import { Badge } from "@/components/ui/badge"

<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="destructive">Error</Badge>
```

**Variants:** `default`, `secondary`, `destructive`, `outline`, `success`, `warning`, `info`

#### Input
Styled input component with focus states.

```tsx
import { Input } from "@/components/ui/input"

<Input placeholder="Enter text..." />
```

#### Label
Accessible label component.

```tsx
import { Label } from "@/components/ui/label"

<Label htmlFor="email">Email</Label>
<Input id="email" type="email" />
```

### 2. Dashboard Components

#### StatCard
Animated stat cards with trend indicators.

```tsx
import { StatCard } from "@/components/dashboard/stat-card"

<StatCard
  title="Total Users"
  value="1,234"
  change={{ value: 12, trend: "up" }}
  delay={0}
/>
```

#### MetricCard
Detailed metric cards with descriptions.

```tsx
import { MetricCard } from "@/components/dashboard/metric-card"

<MetricCard
  title="Revenue"
  value="$45,678"
  description="Monthly revenue"
  trend={{ value: 8, label: "vs last month", positive: true }}
/>
```

#### AnimatedCard
Advanced animated cards with hover effects.

```tsx
import { AnimatedCard } from "@/components/dashboard/animated-card"

<AnimatedCard title="Analytics" hover={true}>
  <p>Card content</p>
</AnimatedCard>
```

### 3. Advanced UI Components

#### DataTable
Full-featured data table with sorting and filtering.

```tsx
import { DataTable } from "@/components/ui/data-table"

const columns = [
  { id: "name", header: "Name", accessorKey: "name", sortable: true, filterable: true },
  { id: "email", header: "Email", accessorKey: "email", sortable: true },
]

<DataTable
  data={users}
  columns={columns}
  onRowClick={(row) => console.log(row)}
/>
```

#### FilterPanel
Comprehensive filter panel with multiple filter types.

```tsx
import { FilterPanel } from "@/components/ui/filter-panel"

const filters = [
  { id: "status", label: "Status", type: "select", options: [...] },
  { id: "date", label: "Date", type: "date" },
]

<FilterPanel
  filters={filters}
  onFilterChange={(id, value) => console.log(id, value)}
  onClearAll={() => {}}
  onApply={() => {}}
/>
```

#### Modal
Accessible modal dialog using Radix UI.

```tsx
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription, ModalFooter } from "@/components/ui/modal"

<Modal open={isOpen} onOpenChange={setIsOpen}>
  <ModalContent>
    <ModalHeader>
      <ModalTitle>Modal Title</ModalTitle>
      <ModalDescription>Modal description</ModalDescription>
    </ModalHeader>
    <ModalFooter>
      <Button onClick={() => setIsOpen(false)}>Close</Button>
    </ModalFooter>
  </ModalContent>
</Modal>
```

#### Toast
Toast notification system.

```tsx
import { Toast, ToastTitle, ToastDescription } from "@/components/ui/toast"

<Toast variant="success">
  <ToastTitle>Success</ToastTitle>
  <ToastDescription>Operation completed successfully</ToastDescription>
</Toast>
```

### 4. Layout Components

#### AdminLayout
Complete admin layout with collapsible sidebar.

```tsx
import { AdminLayout } from "@/components/layout/admin-layout"

<AdminLayout>
  <YourContent />
</AdminLayout>
```

#### DashboardLayout
Flexible dashboard layout.

```tsx
import { DashboardLayout } from "@/components/layout/dashboard-layout"

<DashboardLayout header={<Header />} sidebar={<Sidebar />}>
  <YourContent />
</DashboardLayout>
```

#### Container
Responsive container component.

```tsx
import { Container } from "@/components/layout"

<Container size="lg">
  <YourContent />
</Container>
```

#### ResponsiveGrid
Responsive grid layout.

```tsx
import { ResponsiveGrid } from "@/components/layout"

<ResponsiveGrid cols={{ mobile: 1, tablet: 2, desktop: 3 }} gap={4}>
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
</ResponsiveGrid>
```

### 5. Chart Components

#### LineChart
Interactive line chart.

```tsx
import { LineChartComponent } from "@/components/charts"

<LineChartComponent
  data={data}
  lines={[
    { dataKey: "value", name: "Revenue", color: "#3b82f6" }
  ]}
/>
```

#### BarChart
Bar chart with grouped data.

```tsx
import { BarChartComponent } from "@/components/charts"

<BarChartComponent
  data={data}
  bars={[
    { dataKey: "sales", name: "Sales", color: "#10b981" }
  ]}
/>
```

#### PieChart
Pie chart with percentage labels.

```tsx
import { PieChartComponent } from "@/components/charts"

<PieChartComponent
  data={[
    { name: "Active", value: 60, color: "#10b981" },
    { name: "Inactive", value: 40, color: "#ef4444" }
  ]}
/>
```

### 6. Theme Components

#### ThemeProvider
Theme provider for dark mode support.

```tsx
import { ThemeProvider } from "@/components/theme"

<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
  <YourApp />
</ThemeProvider>
```

#### ThemeToggle
Theme toggle button.

```tsx
import { ThemeToggle } from "@/components/theme"

<ThemeToggle />
```

### 7. Accessibility Components

#### VisuallyHidden
Visually hidden content for screen readers.

```tsx
import { VisuallyHidden } from "@/components/accessibility"

<VisuallyHidden>
  <span>Screen reader only text</span>
</VisuallyHidden>
```

#### SkipLink
Skip navigation link for keyboard users.

```tsx
import { SkipLink } from "@/components/accessibility"

<SkipLink href="#main-content">Skip to main content</SkipLink>
```

#### FocusTrap
Focus trap for modals and dialogs.

```tsx
import { FocusTrap } from "@/components/accessibility"

<FocusTrap enabled={isOpen}>
  <ModalContent>...</ModalContent>
</FocusTrap>
```

#### LiveRegion
Live region for dynamic content announcements.

```tsx
import { LiveRegion } from "@/components/accessibility"

<LiveRegion politeness="polite">
  {statusMessage}
</LiveRegion>
```

### 8. Animation Components

#### AnimatedWrapper
Animated wrapper with predefined animations.

```tsx
import { AnimatedWrapper, fadeInUp } from "@/components/animations"

<AnimatedWrapper variants={fadeInUp} delay={0.2}>
  <YourContent />
</AnimatedWrapper>
```

#### StaggerWrapper
Staggered animation for lists.

```tsx
import { StaggerWrapper } from "@/components/animations"

<StaggerWrapper staggerDelay={0.1}>
  <Item>Item 1</Item>
  <Item>Item 2</Item>
  <Item>Item 3</Item>
</StaggerWrapper>
```

#### PageTransition
Page transition animation.

```tsx
import { PageTransition } from "@/components/animations"

<PageTransition>
  <YourPage />
</PageTransition>
```

### 9. Internationalization

#### LanguageSwitcher
Language switcher component.

```tsx
import { LanguageSwitcher } from "@/components/i18n"

<LanguageSwitcher />
```

#### useTranslation Hook
Translation hook for internationalization.

```tsx
import { useTranslation } from "@/components/i18n"

function MyComponent() {
  const { t } = useTranslation("en")
  
  return <h1>{t("adminDashboard")}</h1>
}
```

### 10. Responsive Hooks

#### useBreakpoint
Hook for breakpoint detection.

```tsx
import { useBreakpoint } from "@/hooks/use-responsive"

const isDesktop = useBreakpoint("lg")
```

#### useMediaQuery
Hook for custom media queries.

```tsx
import { useMediaQuery } from "@/hooks/use-responsive"

const isMobile = useMediaQuery("(max-width: 768px)")
```

#### useIsMobile, useIsTablet, useIsDesktop
Convenience hooks for device detection.

```tsx
import { useIsMobile, useIsTablet, useIsDesktop } from "@/hooks/use-responsive"

const isMobile = useIsMobile()
const isTablet = useIsTablet()
const isDesktop = useIsDesktop()
```

## Best Practices

### 1. Accessibility
- Always use semantic HTML elements
- Provide proper ARIA labels
- Ensure keyboard navigation works
- Test with screen readers

### 2. Performance
- Use React.memo for expensive components
- Implement proper loading states
- Optimize re-renders with useCallback/useMemo
- Lazy load heavy components

### 3. TypeScript
- Always define proper types for props
- Use strict mode
- Avoid `any` types
- Leverage type inference

### 4. Responsive Design
- Mobile-first approach
- Test on multiple screen sizes
- Use responsive utilities
- Consider touch targets

### 5. Internationalization
- Keep translations external
- Use translation keys, not hardcoded text
- Consider text expansion in different languages
- Test with RTL languages

## Contributing

When adding new components:

1. Follow the existing component structure
2. Include TypeScript types
3. Add accessibility attributes
4. Write documentation
5. Add examples
6. Test on multiple devices
7. Ensure responsive design

## Support

For issues or questions, please refer to the main project documentation or contact the development team.
