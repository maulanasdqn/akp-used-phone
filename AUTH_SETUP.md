# Authentication & Authorization Setup

This document describes the complete authentication and authorization system implemented for the AKP Used Phone project.

## 🚀 Features

- **JWT-based Authentication**: Secure token-based authentication with access and refresh tokens
- **Role-based Authorization**: Hierarchical role system (Admin, Manager, User)
- **Permission-based Access Control**: Granular permissions for different resources
- **Password Security**: Argon2 password hashing for maximum security
- **TRPC Integration**: Type-safe API endpoints for authentication
- **Middleware Protection**: Automatic route protection with JWT verification

## 📋 Setup Instructions

### 1. Environment Configuration

Copy the example environment file and configure your settings:

```bash
cp .env.example .env
```

Update the following variables in your `.env` file:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/your_database"

# JWT Configuration (IMPORTANT: Change these in production!)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-this-in-production"
ACCESS_TOKEN_EXPIRES_IN="15m"
REFRESH_TOKEN_EXPIRES_IN="7d"
```

### 2. Database Setup

Run the database migrations and seed the initial data:

```bash
# Generate Prisma client
bun run db:generate

# Run migrations
bun run db:migrate

# Seed the database with default roles, permissions, and users
bun run db:seed
```

### 3. Default Users

After seeding, you'll have these default users:

- **Admin User**

  - Email: `admin@example.com`
  - Password: `admin123`
  - Role: Admin (full access)

- **Test User**
  - Email: `user@example.com`
  - Password: `user123`
  - Role: User (limited access)

## 🔐 Authentication Endpoints

All authentication endpoints are available via TRPC at `/v1/trpc/auth.*`:

### Login

```typescript
// POST /v1/trpc/auth.login
{
  email: "admin@example.com",
  password: "admin123"
}

// Response
{
  data: {
    token: {
      accessToken: "eyJhbGciOiJIUzI1NiIs...",
      refreshToken: "eyJhbGciOiJIUzI1NiIs..."
    },
    user: {
      id: "01HXXX...",
      email: "admin@example.com",
      firstName: "Admin",
      lastName: "User",
      roleId: "01HXXX...",
      createdAt: "2025-01-01T00:00:00.000Z",
      updatedAt: "2025-01-01T00:00:00.000Z"
    }
  },
  message: "Login successful"
}
```

### Register

```typescript
// POST /v1/trpc/auth.register
{
  email: "newuser@example.com",
  password: "password123",
  firstName: "New",
  lastName: "User"
}

// Response
{
  message: "User registered successfully"
}
```

### Refresh Token

```typescript
// POST /v1/trpc/auth.refreshToken
{
  refreshToken: 'eyJhbGciOiJIUzI1NiIs...';
}

// Response
{
  data: {
    accessToken: 'eyJhbGciOiJIUzI1NiIs...';
  }
}
```

### Change Password

```typescript
// POST /v1/trpc/auth.changePassword
{
  userId: "01HXXX...",
  passwords: {
    currentPassword: "oldpassword",
    newPassword: "newpassword123",
    confirmPassword: "newpassword123"
  }
}
```

## 🛡️ Authorization System

### Roles

1. **Admin**: Full system access

   - All permissions
   - Can manage users, products, and system settings

2. **Manager**: Business operations access

   - Can read/write users and products
   - Cannot delete or access admin functions

3. **User**: Basic access
   - Can only read products
   - Limited to their own profile

### Permissions

- `users.read` - View user information
- `users.write` - Create and update users
- `users.delete` - Delete users
- `products.read` - View products
- `products.write` - Create and update products
- `products.delete` - Delete products
- `admin.access` - Access admin panel

## 🔒 Using Authentication in Your Code

### Protecting Routes

Routes are automatically protected by the auth middleware. Public routes are:

- `/auth/*` - Authentication endpoints
- `/products/list` - Public product listing
- `/products/detail/*` - Public product details
- `/docs` - API documentation

### Getting Current User

In your TRPC procedures or Hono handlers:

```typescript
import { getCurrentUser } from '@/apps/api/src/middleware/auth';

// In a Hono handler
app.get('/protected', async (c) => {
  const user = getCurrentUser(c);
  return c.json({ user });
});
```

### Role-based Protection

```typescript
import { requireRole } from '@/apps/api/src/middleware/auth';

// Require admin role
app.get('/admin-only', requireRole(['admin']), async (c) => {
  return c.json({ message: 'Admin access granted' });
});

// Require admin or manager role
app.get('/management', requireRole(['admin', 'manager']), async (c) => {
  return c.json({ message: 'Management access granted' });
});
```

### Permission-based Protection

```typescript
import { requirePermission } from '@/apps/api/src/middleware/auth';

// Require specific permission
app.get('/users', requirePermission('users.read'), async (c) => {
  return c.json({ users: [] });
});
```

## 🔧 JWT Token Details

### Access Token

- **Expires**: 15 minutes (configurable)
- **Purpose**: API authentication
- **Contains**: userId, email, roleId

### Refresh Token

- **Expires**: 7 days (configurable)
- **Purpose**: Obtaining new access tokens
- **Contains**: userId, email, roleId

### Token Usage

Include the access token in the Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🚨 Security Best Practices

1. **Change Default Secrets**: Always change JWT secrets in production
2. **Use HTTPS**: Never send tokens over unencrypted connections
3. **Token Storage**: Store tokens securely on the client side
4. **Token Rotation**: Implement proper refresh token rotation
5. **Rate Limiting**: Add rate limiting to authentication endpoints
6. **Password Policy**: Enforce strong password requirements

## 🧪 Testing Authentication

### Using curl

```bash
# Login
curl -X POST http://localhost:3000/v1/trpc/auth.login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'

# Use the returned access token for protected endpoints
curl -X GET http://localhost:3000/v1/trpc/users.getAll \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Using a REST client

Import the following into Postman or similar:

```json
{
  "info": {
    "name": "AKP Auth API"
  },
  "item": [
    {
      "name": "Login",
      "request": {
        "method": "POST",
        "url": "{{baseUrl}}/v1/trpc/auth.login",
        "body": {
          "mode": "raw",
          "raw": "{\"email\":\"admin@example.com\",\"password\":\"admin123\"}"
        }
      }
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3000"
    }
  ]
}
```

## 🔄 Development Workflow

1. **Start the API**: `bun run api:dev`
2. **Test Authentication**: Use the default admin credentials
3. **Create New Users**: Use the register endpoint or admin panel
4. **Assign Roles**: Update user roles through the admin interface
5. **Test Permissions**: Verify role-based access control

## 📚 Additional Resources

- [JWT.io](https://jwt.io/) - JWT token debugger
- [Argon2](https://github.com/P-H-C/phc-winner-argon2) - Password hashing
- [TRPC Documentation](https://trpc.io/) - Type-safe APIs
- [Hono Documentation](https://hono.dev/) - Web framework

## 🐛 Troubleshooting

### Common Issues

1. **"Invalid token" errors**: Check if the token has expired or is malformed
2. **"User not authenticated"**: Ensure the Authorization header is properly set
3. **"Insufficient permissions"**: Verify the user has the required role/permission
4. **Database connection errors**: Check your DATABASE_URL configuration

### Debug Mode

Set `NODE_ENV=development` to enable detailed error messages and logging.
