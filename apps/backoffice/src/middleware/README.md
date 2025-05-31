# Middleware and Permission System

This document explains how to use the middleware and permission system in the backoffice application.

## Overview

The middleware system provides:

- Authentication checking using better-auth
- Route protection based on user permissions
- Automatic redirects for unauthorized access
- Integration with the role-based permission system

## Files Structure

```
apps/backoffice/src/
├── middleware.ts              # Main middleware function
├── lib/
│   └── permissions.ts         # Permission utilities
├── hooks/
│   └── use-permissions.ts     # React hooks for permissions
└── components/
    └── permission-guard.tsx   # Permission-based components
```

## Middleware Configuration

### Public Routes

Routes that don't require authentication:

```typescript
const mappingPublicRoutes = [
  '/auth/login',
  '/auth/forgot',
  '/auth/new-password',
  '/auth/register',
  '/auth/verify-email',
  '/auth/reset-password',
];
```

### Protected Routes with Permissions

Routes that require specific permissions:

```typescript
const mappingRoutePermissions: RoutePermission[] = [
  {
    path: '/dashboard',
    permissions: [], // No specific permissions required
    exact: true,
  },
  {
    path: '/buy',
    permissions: ['buy:access'],
    exact: false, // Matches /buy and /buy/*
  },
  {
    path: '/users',
    permissions: ['users:read', 'users:manage'], // User needs ANY of these
    exact: false,
  },
];
```

## Permission System

### Database Schema

The permission system uses these models:

- `User` - has a `roleId`
- `Role` - has many permissions through `RolePermission`
- `Permission` - defines what actions are allowed
- `RolePermission` - junction table linking roles and permissions

### Permission Utilities

```typescript
import { getUserPermissions, userHasPermission } from './lib/permissions';

// Get all permissions for a user
const permissions = await getUserPermissions(userId);

// Check if user has specific permission
const canAccess = await userHasPermission(userId, 'users:read');
```

## React Hooks

### usePermissions

Get current user's permissions:

```typescript
import { usePermissions } from './hooks/use-permissions';

function MyComponent() {
  const { permissions, loading, hasPermission } = usePermissions();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {hasPermission('users:read') && <UsersList />}
      {hasPermission('users:create') && <CreateUserButton />}
    </div>
  );
}
```

### useHasPermission

Check for a specific permission:

```typescript
import { useHasPermission } from './hooks/use-permissions';

function DeleteButton() {
  const canDelete = useHasPermission('users:delete');

  if (!canDelete) return null;

  return <button>Delete User</button>;
}
```

## Permission Guard Component

### Basic Usage

```typescript
import { PermissionGuard } from './components/permission-guard';

function AdminPanel() {
  return (
    <PermissionGuard
      permission="admin:access"
      fallback={<div>Access Denied</div>}
    >
      <AdminDashboard />
    </PermissionGuard>
  );
}
```

### Multiple Permissions

```typescript
// User needs ANY of these permissions
<PermissionGuard
  permissions={['users:read', 'users:manage']}
  fallback={<div>No access to users</div>}
>
  <UsersList />
</PermissionGuard>

// User needs ALL of these permissions
<PermissionGuard
  permissions={['users:read', 'users:delete']}
  requireAll={true}
  fallback={<div>Insufficient permissions</div>}
>
  <DeleteUserButton />
</PermissionGuard>
```

### Higher-Order Components

```typescript
import { withPermission, withPermissions } from './components/permission-guard';

// Single permission
const ProtectedComponent = withPermission(
  MyComponent,
  'admin:access',
  <div>Access Denied</div>
);

// Multiple permissions
const MultiProtectedComponent = withPermissions(
  MyComponent,
  ['users:read', 'users:write'],
  false, // requireAll = false (ANY permission)
  <div>No access</div>
);
```

## Common Permission Patterns

### CRUD Operations

```typescript
// Typical CRUD permissions for a resource
const userPermissions = [
  'users:read', // View users
  'users:create', // Create new users
  'users:update', // Edit existing users
  'users:delete', // Delete users
  'users:manage', // Full management (includes all above)
];
```

### Hierarchical Permissions

```typescript
// More specific permissions
const permissions = [
  'users:read', // Basic read access
  'users:read:own', // Read own profile only
  'users:read:team', // Read team members
  'users:read:all', // Read all users
];
```

## Error Handling

The middleware handles errors gracefully:

1. **Authentication errors**: Redirect to login
2. **Permission errors**: Redirect to dashboard with error parameter
3. **Database errors**: Log error and redirect to login

### Error URL Parameters

```typescript
// Unauthorized access
/dashboard?error=unauthorized

// You can check for this in your dashboard component
const searchParams = new URLSearchParams(window.location.search);
if (searchParams.get('error') === 'unauthorized') {
  // Show unauthorized message
}
```

## Best Practices

### 1. Granular Permissions

Create specific permissions rather than broad ones:

```typescript
// Good
'products:create';
'products:update:own';
'products:delete:any';

// Avoid
'products:all';
'admin';
```

### 2. Consistent Naming

Use a consistent pattern for permission names:

```typescript
// Pattern: resource:action[:scope]
'users:read';
'users:create';
'users:update:own';
'users:delete:any';
'orders:read:team';
'reports:generate:financial';
```

### 3. Default Permissions

Always define what happens when no permissions are specified:

```typescript
{
  path: '/dashboard',
  permissions: [], // Empty = authenticated users only
  exact: true,
}
```

### 4. Loading States

Always handle loading states in your components:

```typescript
const { permissions, loading } = usePermissions();

if (loading) {
  return <Skeleton />;
}
```

## Troubleshooting

### Common Issues

1. **Permissions not loading**: Check database connection and user role assignment
2. **Middleware not working**: Ensure middleware is properly configured in your router
3. **Permission checks failing**: Verify permission names match exactly (case-sensitive)

### Debug Mode

Add logging to see what's happening:

```typescript
// In middleware.ts
console.log('User permissions:', userPermissions);
console.log('Required permissions:', matchedRoute.permissions);
console.log('Has permission:', hasPermission);
```

## Migration Guide

If you're migrating from the old middleware:

1. Replace `SessionUser.get()` with `authClient.getSession()`
2. Replace `SessionToken.get()` with better-auth session
3. Update permission checking logic to use the new utilities
4. Add proper error handling

## Security Considerations

1. **Server-side validation**: Always validate permissions on the server side too
2. **Sensitive data**: Don't expose sensitive permission logic in client code
3. **Token validation**: Ensure better-auth tokens are properly validated
4. **Database security**: Use proper database access controls

## Performance Optimization

1. **Permission caching**: Consider caching user permissions
2. **Lazy loading**: Load permissions only when needed
3. **Batch requests**: Fetch multiple permissions in one request
4. **Memoization**: Use React.memo for permission-based components

```typescript
// Example: Memoized permission component
const MemoizedPermissionGuard = React.memo(PermissionGuard);
```
