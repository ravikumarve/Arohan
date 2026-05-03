# AROHAN Shared Component Library

Shared components, utilities, and types for AROHAN dashboards.

## Installation

```bash
npm install @arohan/shared
```

## Usage

### Types

```typescript
import { User, UserRole, Campaign, Candidate } from '@arohan/shared';

const user: User = {
  id: '123',
  email: 'user@example.com',
  name: 'John Doe',
  role: UserRole.RECRUITER,
  // ...
};
```

### API Client

```typescript
import { createApiClient } from '@arohan/shared';

const apiClient = createApiClient('https://api.arohan.com');

// Set authentication token
apiClient.setToken('your-jwt-token');

// Make API calls
const response = await apiClient.get<User>('/api/users/123');
```

### Authentication

```typescript
import { useAuthStore, hasPermission, Permission } from '@arohan/shared';

// Use auth store
const { user, isAuthenticated, login, logout } = useAuthStore();

// Check permissions
if (hasPermission(user.role, Permission.USER_READ)) {
  // User has permission
}
```

### Utilities

```typescript
import { cn, formatDate, formatCurrency } from '@arohan/shared';

// CSS utilities
const className = cn('px-4 py-2', 'bg-blue-500', 'text-white');

// Date formatting
const formattedDate = formatDate(new Date());

// Currency formatting
const formattedCurrency = formatCurrency(1000);
```

## Components

### UI Components

```typescript
import { Button, Card, Input } from '@arohan/shared/components/ui';
```

### Layout Components

```typescript
import { Header, Sidebar, Footer } from '@arohan/shared/components/layout';
```

### Common Components

```typescript
import { ErrorBoundary, LoadingSpinner } from '@arohan/shared/components/common';
```

## Development

```bash
# Install dependencies
npm install

# Build the library
npm run build

# Watch for changes
npm run dev

# Run tests
npm test

# Lint code
npm run lint
```

## License

MIT
