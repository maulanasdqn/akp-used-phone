# tRPC Client Setup

This directory contains the tRPC client configuration for both the store and backoffice applications.

## Files Overview

- `client.ts` - Main tRPC client configuration and React hooks setup
- `provider.tsx` - React provider component that wraps the app with tRPC and React Query
- `hooks.ts` - Custom hooks for common tRPC operations
- `index.ts` - Main export file

## Usage

### 1. Provider Setup

The `TRPCProvider` is already configured in both apps:

**Store App** (`apps/store/src/main.tsx`):

```tsx
import { TRPCProvider } from '@/shared/web/utils';

// Wrapped in the main app
<TRPCProvider>
  <RouterProvider router={router} />
</TRPCProvider>;
```

**Backoffice App** (`apps/backoffice/src/main.tsx`):

```tsx
import { TRPCProvider } from '@/shared/web/utils';

// Wrapped in the main app
<TRPCProvider>
  <App />
</TRPCProvider>;
```

### 2. Using tRPC in Components

#### Direct tRPC Usage

```tsx
import { trpc } from '@/shared/web/utils';

function MyComponent() {
  // Queries
  const usersQuery = trpc.users.getAll.useQuery({ page: 1, limit: 10 });
  const userQuery = trpc.users.getById.useQuery({ id: 'user-id' });

  // Mutations
  const createUserMutation = trpc.users.create.useMutation();
  const loginMutation = trpc.auth.login.useMutation();

  const handleCreateUser = async () => {
    try {
      const result = await createUserMutation.mutateAsync({
        email: 'user@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        roleId: 'role-id-here',
      });
      console.log('User created:', result);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      {usersQuery.isLoading && <p>Loading...</p>}
      {usersQuery.error && <p>Error: {usersQuery.error.message}</p>}
      {usersQuery.data && (
        <ul>
          {usersQuery.data.map((user) => (
            <li key={user.id}>{user.email}</li>
          ))}
        </ul>
      )}

      <button onClick={handleCreateUser}>
        {createUserMutation.isPending ? 'Creating...' : 'Create User'}
      </button>
    </div>
  );
}
```

#### Using Custom Hooks

```tsx
import { useAuth, useUsersList, useUsers } from '@/shared/web/utils';

function MyComponent() {
  const auth = useAuth();
  const usersList = useUsersList({ page: 1, limit: 10 });
  const users = useUsers();

  return (
    <div>
      <p>Authenticated: {auth.isAuthenticated ? 'Yes' : 'No'}</p>

      {usersList.isLoading && <p>Loading users...</p>}
      {usersList.users && (
        <ul>
          {usersList.users.map((user) => (
            <li key={user.id}>{user.email}</li>
          ))}
        </ul>
      )}

      <button
        onClick={() =>
          users.createUser.mutate({
            email: 'new@example.com',
            password: 'password123',
            firstName: 'New',
            lastName: 'User',
            roleId: 'role-id',
          })
        }
      >
        Create User
      </button>
    </div>
  );
}
```

## Available API Endpoints

### Authentication (`trpc.auth`)

- `login` - User login
- `register` - User registration
- `logout` - User logout
- `me` - Get current user profile
- `refreshToken` - Refresh authentication token
- `verifyOtp` - Verify OTP
- `changePassword` - Change user password

### Users (`trpc.users`)

- `getAll` - Get all users with pagination and filters
- `getById` - Get user by ID
- `getByEmail` - Get user by email
- `create` - Create new user
- `update` - Update user
- `delete` - Delete user
- `updatePassword` - Update user password
- `changePassword` - Change user password with current password verification

## Custom Hooks

### `useAuth()`

Returns authentication-related mutations and queries:

- `login` - Login mutation
- `register` - Register mutation
- `logout` - Logout mutation
- `me` - Current user query
- `refreshToken` - Refresh token mutation
- `verifyOtp` - OTP verification mutation
- `changePassword` - Change password mutation
- `isAuthenticated` - Boolean indicating auth status
- `isLoading` - Boolean indicating loading state

### `useUsers()`

Returns user management mutations:

- `createUser` - Create user mutation
- `updateUser` - Update user mutation
- `deleteUser` - Delete user mutation
- `updatePassword` - Update password mutation
- `changePassword` - Change password mutation

### `useUsersList(queryParams?)`

Returns paginated users list:

- `users` - Array of users
- `isLoading` - Loading state
- `error` - Error state
- `refetch` - Refetch function

### `useUser(id)`

Returns single user by ID:

- `user` - User object
- `isLoading` - Loading state
- `error` - Error state
- `refetch` - Refetch function

### `useUserByEmail(email)`

Returns single user by email:

- `user` - User object
- `isLoading` - Loading state
- `error` - Error state
- `refetch` - Refetch function

## Configuration

The tRPC client is configured to:

- Use `/api/trpc` as the default endpoint
- Batch requests for better performance
- Retry failed requests (except 4xx errors)
- Cache queries for 5 minutes by default

You can customize the API URL by passing it to the `TRPCProvider`:

```tsx
<TRPCProvider apiUrl="http://localhost:3001/api/trpc">
  <App />
</TRPCProvider>
```

## Error Handling

All tRPC operations return standard React Query states:

- `isLoading` - Request is in progress
- `error` - Error object if request failed
- `data` - Response data if request succeeded
- `isPending` - Mutation is in progress (for mutations)

Handle errors appropriately in your components:

```tsx
if (query.error) {
  return <div>Error: {query.error.message}</div>;
}
```

## Examples

See the example files for complete usage demonstrations:

- Store: `apps/store/src/app/(public)/example-trpc.tsx`
- Backoffice: `apps/backoffice/src/app/example-trpc.tsx`
