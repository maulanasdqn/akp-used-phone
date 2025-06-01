# 📱 AKP Used Phone Marketplace

> _Where pre-loved phones find their perfect match!_ 💕

Welcome to the **AKP Used Phone Marketplace** - a modern, full-stack e-commerce platform built for buying and selling quality used smartphones. This project showcases a complete marketplace solution with separate customer and admin interfaces, all powered by cutting-edge web technologies.

## 🚀 What Makes This Special?

- 🏪 **Customer Store**: Beautiful, responsive storefront for browsing and purchasing used phones
- 🛠️ **Admin Backoffice**: Powerful admin panel for managing inventory, orders, and users
- 🔌 **REST API**: Robust backend API with authentication and data validation
- 🎯 **Type-Safe**: End-to-end type safety with tRPC and TypeScript
- ⚡ **Lightning Fast**: Built with Bun runtime and Vite for blazing performance
- 🗃️ **Modern Database**: PostgreSQL with Prisma ORM for reliable data management
- 🔐 **Role-Based Access Control**: Complete RBAC system with permissions and roles
- 🌱 **Database Seeding**: Pre-configured sample data for quick development

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Store App     │    │  Backoffice     │    │    API Server   │
│   (Customer)    │    │   (Admin)       │    │   (Backend)     │
│                 │    │                 │    │                 │
│  React + Vite   │    │  React + Vite   │    │  Hono + tRPC    │
│  Port: 5173     │    │  Port: 5174     │    │  Port: 3000     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   PostgreSQL    │
                    │   Database      │
                    └─────────────────┘
```

## 🛠️ Tech Stack

### Frontend

- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe JavaScript
- **Vite** - Next-generation frontend tooling
- **tRPC** - End-to-end typesafe APIs
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality UI components

### Backend

- **Bun** - Fast JavaScript runtime
- **Hono** - Lightweight web framework
- **tRPC** - Type-safe API layer
- **Zod** - Schema validation
- **Better Auth** - Modern authentication library
- **JWT** - JSON Web Token authentication

### Database & ORM

- **PostgreSQL** - Reliable relational database
- **Prisma** - Next-generation ORM
- **ULID** - Universally unique lexicographically sortable identifiers

### Development Tools

- **Nx** - Smart monorepo management
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Vitest** - Unit testing framework
- **Husky** - Git hooks

## 📋 Prerequisites

Before setting up the project, ensure you have the following installed:

### Required Software

- **Bun** >= 1.0.0 ([Install Bun](https://bun.sh/docs/installation))
- **PostgreSQL** >= 14.0 ([Download PostgreSQL](https://www.postgresql.org/download/))
- **Node.js** >= 18.0 (for some tooling compatibility)
- **Git** for version control

### System Requirements

- **Operating System**: Windows 10+, macOS 10.15+, or Linux
- **RAM**: Minimum 4GB, recommended 8GB+
- **Storage**: At least 2GB free space for dependencies and database

### Database Setup

1. **Install PostgreSQL** and ensure it's running
2. **Create a database** for the project:
   ```sql
   CREATE DATABASE akp_used_phone;
   CREATE USER akp_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE akp_used_phone TO akp_user;
   ```

## 🚀 Quick Start

### 1. Clone & Install

```bash
# Clone the repository
git clone https://github.com/your-username/akp-used-phone.git
cd akp-used-phone

# Install dependencies
bun install
```

### 2. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your configuration
nano .env  # or use your preferred editor
```

**Required environment variables:**

```env
# Database Configuration
DATABASE_URL="postgresql://akp_user:your_password@localhost:5432/akp_used_phone"

# Server Ports
API_PORT=3000
STORE_PORT=5173
BACKOFFICE_PORT=5174

# Authentication
JWT_SECRET="your-super-secure-jwt-secret-key-min-32-chars"
BETTER_AUTH_SECRET="your-better-auth-secret-key"
BETTER_AUTH_URL="http://localhost:3000"

# Environment
NODE_ENV="development"
```

### 3. Database Setup

```bash
# Generate Prisma client
bun run db:generate

# Push schema to database (for development)
bun run db:push

# Run database seeding (creates sample data)
bun run db:seed
```

**For production, use migrations instead:**

```bash
# Run database migrations
bun run db:migrate
```

### 4. Start Development

```bash
# Start all applications concurrently
bun run dev

# Or start individual applications:
bun run api:dev         # API server (http://localhost:3000)
bun run store:dev       # Customer store (http://localhost:5173)
bun run backoffice:dev  # Admin panel (http://localhost:5174)
```

### 5. Access the Applications

- **Customer Store**: http://localhost:5173
- **Admin Backoffice**: http://localhost:5174
- **API Health Check**: http://localhost:3000/api/health
- **tRPC Endpoints**: http://localhost:3000/v1/trpc

### 6. Login Credentials (After Seeding)

**Admin User:**

- Email: `admin@example.com`
- Password: `admin123`

**Manager User:**

- Email: `manager@example.com`
- Password: `manager123`

**Regular User:**

- Email: `user@example.com`
- Password: `user123`

## 📁 Project Structure

```
akp-used-phone/
├── 📱 apps/
│   ├── 🛒 store/              # Customer-facing storefront (React + Vite)
│   │   ├── src/
│   │   │   ├── app/           # Main application components
│   │   │   ├── global.css     # Global styles
│   │   │   └── main.tsx       # Application entry point
│   │   ├── vite.config.ts     # Vite configuration (Port: 5173)
│   │   └── project.json       # Nx project configuration
│   ├── 🏢 backoffice/         # Admin management panel (React + Vite)
│   │   ├── src/
│   │   │   ├── app/           # Admin application components
│   │   │   ├── global.css     # Global styles
│   │   │   └── main.tsx       # Application entry point
│   │   ├── vite.config.ts     # Vite configuration (Port: 5174)
│   │   └── project.json       # Nx project configuration
│   └── 🔌 api/                # Backend API server (Hono + tRPC)
│       ├── src/
│       │   ├── main.ts        # Server entry point (Port: 3000)
│       │   └── middleware/    # Authentication, logging, tRPC middleware
│       ├── vite.config.ts     # Build configuration
│       └── project.json       # Nx project configuration
├── 🔗 shared/
│   ├── api/
│   │   ├── app/               # Shared API application logic
│   │   │   └── src/v1/        # API v1 routes and services
│   │   │       ├── iam/       # Identity & Access Management
│   │   │       │   ├── users/ # User management services
│   │   │       │   ├── roles/ # Role management services
│   │   │       │   └── permissions/ # Permission management services
│   │   │       └── products/  # Product management services
│   │   ├── database/          # Database utilities and Prisma client
│   │   ├── trpc/              # tRPC server definitions
│   │   └── utils/             # Shared utilities (JWT, password hashing)
│   └── web/
│       ├── components/        # Shared UI components (Tailwind + shadcn/ui)
│       └── utils/             # Shared web utilities
├── 🗃️ prisma/
│   ├── schema.prisma          # Database schema with RBAC
│   ├── seed.ts                # Database seeding script
│   └── migrations/            # Database migration files
├── 📋 package.json            # Project dependencies and scripts
├── 🔧 nx.json                 # Nx workspace configuration
└── 📖 README.md              # You are here! 👋
```

## 🗃️ Database Schema

The database is designed with a comprehensive RBAC (Role-Based Access Control) system and follows best practices for e-commerce applications.

### Core Tables

#### Users (`user`)

```sql
CREATE TABLE "user" (
  "id" TEXT PRIMARY KEY DEFAULT ulid(),
  "name" TEXT NOT NULL,
  "email" TEXT UNIQUE NOT NULL,
  "emailVerified" BOOLEAN DEFAULT false,
  "image" TEXT,
  "roleId" TEXT REFERENCES "Role"("id"),
  "isDeleted" BOOLEAN DEFAULT false,
  "createdAt" TIMESTAMP DEFAULT now(),
  "updatedAt" TIMESTAMP DEFAULT now()
);
```

**Key Features:**

- **ULID-based IDs**: Universally unique, lexicographically sortable identifiers
- **Email-based authentication**: Unique email constraint with verification support
- **Better Auth integration**: Compatible with Better Auth for session management
- **Soft deletion**: `isDeleted` flag for data retention
- **Role association**: Foreign key to roles table for RBAC
- **Profile management**: Name and image fields for user profiles

#### Roles & Permissions System

```sql
CREATE TABLE "Role" (
  "id" TEXT PRIMARY KEY DEFAULT ulid(),
  "name" TEXT UNIQUE NOT NULL,
  "isDeleted" BOOLEAN DEFAULT false,
  "createdAt" TIMESTAMP DEFAULT now(),
  "updatedAt" TIMESTAMP DEFAULT now()
);

CREATE TABLE "Permission" (
  "id" TEXT PRIMARY KEY DEFAULT ulid(),
  "name" TEXT UNIQUE NOT NULL,
  "isDeleted" BOOLEAN DEFAULT false,
  "createdAt" TIMESTAMP DEFAULT now(),
  "updatedAt" TIMESTAMP DEFAULT now()
);

CREATE TABLE "RolePermission" (
  "id" TEXT PRIMARY KEY DEFAULT ulid(),
  "roleId" TEXT REFERENCES "Role"("id") ON DELETE CASCADE,
  "permissionId" TEXT REFERENCES "Permission"("id") ON DELETE CASCADE,
  "createdAt" TIMESTAMP DEFAULT now(),
  "updatedAt" TIMESTAMP DEFAULT now(),
  UNIQUE("roleId", "permissionId")
);
```

**RBAC Implementation:**

- **Roles**: Define user access levels (admin, manager, user)
- **Permissions**: Granular access controls (users.read, products.write, etc.)
- **Many-to-many relationship**: Flexible permission assignment to roles
- **Cascade deletion**: Automatic cleanup when roles/permissions are deleted
- **Unique constraints**: Prevent duplicate role-permission assignments

#### Products (`product`)

```sql
CREATE TABLE "Product" (
  "id" TEXT PRIMARY KEY DEFAULT ulid(),
  "sku" TEXT UNIQUE NOT NULL,
  "slug" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "price" DECIMAL NOT NULL,
  "imageUrl" TEXT,
  "stockQuantity" INTEGER NOT NULL,
  "minimumOrderQuantity" INTEGER NOT NULL,
  "isDeleted" BOOLEAN DEFAULT false,
  "isActive" BOOLEAN DEFAULT true,
  "createdBy" TEXT REFERENCES "user"("id") NOT NULL,
  "createdAt" TIMESTAMP DEFAULT now(),
  "updatedAt" TIMESTAMP DEFAULT now()
);
```

**E-commerce Features:**

- **SKU & Slug**: Unique identifiers for inventory and SEO
- **Decimal pricing**: Precise financial calculations
- **Stock management**: Quantity tracking with minimum order requirements
- **Product status**: Active/inactive and soft deletion flags
- **Creator tracking**: Audit trail for who created each product
- **Image support**: URL field for product photos

#### Authentication Tables (Better Auth)

```sql
CREATE TABLE "session" (
  "id" TEXT PRIMARY KEY,
  "expiresAt" TIMESTAMP NOT NULL,
  "token" TEXT UNIQUE NOT NULL,
  "createdAt" TIMESTAMP DEFAULT now(),
  "updatedAt" TIMESTAMP DEFAULT now(),
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "userId" TEXT REFERENCES "user"("id") ON DELETE CASCADE
);

CREATE TABLE "account" (
  "id" TEXT PRIMARY KEY,
  "accountId" TEXT NOT NULL,
  "providerId" TEXT NOT NULL,
  "userId" TEXT REFERENCES "user"("id") ON DELETE CASCADE,
  "accessToken" TEXT,
  "refreshToken" TEXT,
  "idToken" TEXT,
  "accessTokenExpiresAt" TIMESTAMP,
  "refreshTokenExpiresAt" TIMESTAMP,
  "scope" TEXT,
  "password" TEXT,
  "createdAt" TIMESTAMP DEFAULT now(),
  "updatedAt" TIMESTAMP DEFAULT now()
);
```

**Security Features:**

- **Session management**: Secure token-based sessions with expiration
- **Multi-provider support**: OAuth and password-based authentication
- **Token management**: Access and refresh token handling
- **Security tracking**: IP address and user agent logging

### Database Relationships

```mermaid
erDiagram
    User ||--o{ Product : creates
    User }o--|| Role : has
    Role ||--o{ RolePermission : contains
    Permission ||--o{ RolePermission : granted_by
    User ||--o{ Session : has
    User ||--o{ Account : owns

    User {
        string id PK
        string name
        string email UK
        boolean emailVerified
        string image
        string roleId FK
        boolean isDeleted
        datetime createdAt
        datetime updatedAt
    }

    Role {
        string id PK
        string name UK
        boolean isDeleted
        datetime createdAt
        datetime updatedAt
    }

    Permission {
        string id PK
        string name UK
        boolean isDeleted
        datetime createdAt
        datetime updatedAt
    }

    Product {
        string id PK
        string sku UK
        string slug UK
        string name
        string description
        decimal price
        string imageUrl
        int stockQuantity
        int minimumOrderQuantity
        boolean isDeleted
        boolean isActive
        string createdBy FK
        datetime createdAt
        datetime updatedAt
    }
```

## 🌱 Database Seeding

The project includes a comprehensive seeding system that creates sample data for development and testing.

### Default Roles Created:

- **Admin**: Full system access with all permissions
- **Manager**: Product and user management permissions
- **User**: Basic product read permissions

### Default Permissions:

- `users.read` - Read users
- `users.write` - Create and update users
- `users.delete` - Delete users
- `products.read` - Read products
- `products.write` - Create and update products
- `products.delete` - Delete products
- `admin.access` - Access admin panel

### Sample Users Created:

- **Admin User**: `admin@example.com` / `admin123`
- **Manager User**: `manager@example.com` / `manager123`
- **Regular User**: `user@example.com` / `user123`
- **Test Users**:
  - `john.doe@example.com` / `password123`
  - `jane.smith@example.com` / `password123`

### Sample Products:

- **iPhone 14 128GB Black** - Rp 12,500,000
- **Samsung Galaxy S23 256GB White** - Rp 11,000,000
- **Xiaomi 13 128GB Blue** - Rp 7,500,000
- **OPPO Reno8 128GB Gold** - Rp 5,500,000
- **Vivo V27 256GB Purple** - Rp 6,200,000

**Run seeding with:**

```bash
bun run db:seed
```

## 🎯 Key Features

### 🛒 Customer Store

- Browse available used phones
- Search and filter by brand, price, condition
- Secure user authentication
- Shopping cart and checkout process
- Order history and tracking

### 🏢 Admin Backoffice

- Inventory management
- User management with role-based access
- Order processing
- Analytics dashboard
- Product catalog management

### 🔌 API Features

- RESTful endpoints with tRPC
- JWT-based authentication
- Input validation with Zod schemas
- Type-safe database operations
- Comprehensive error handling
- Role-based access control (RBAC)

## 🧪 Development Commands

```bash
# Database Operations
bun run db:pull      # Pull schema from database
bun run db:push      # Push schema to database
bun run db:migrate   # Run database migrations
bun run db:reset     # Reset database (interactive)
bun run db:generate  # Generate Prisma client
bun run db:seed      # Seed database with sample data

# Development
bun run dev          # Start all applications
bun run api:dev      # Start API server only (Port: 3000)
bun run store:dev    # Start store app only (Port: 5173)
bun run backoffice:dev # Start backoffice app only (Port: 5174)

# Building
bun run build        # Build all applications
bun run api:build    # Build API for production
bun run store:build  # Build store for production
bun run backoffice:build # Build backoffice for production

# Production
bun run api:prod     # Run production API build
bun run store:prod   # Preview store production build
bun run backoffice:prod # Preview backoffice production build

# Testing & Quality
bun run test         # Run all tests
bun run lint         # Lint all projects
bun run format       # Format code with Prettier
```

## 🌟 API Documentation

Once the API server is running, visit:

- **tRPC Endpoints**: http://localhost:3000/v1/trpc

### Available API Routes:

#### Authentication (`/v1/trpc/auth`)

- User registration and login
- JWT token management
- Password reset functionality

#### Users (`/v1/trpc/users`)

- User profile management
- Role assignment (admin only)
- User listing with pagination

#### Products (`/v1/trpc/products`)

- Product CRUD operations
- Inventory management
- Product search and filtering

#### Roles & Permissions (`/v1/trpc/roles`, `/v1/trpc/permissions`)

- Role management
- Permission assignment
- Access control configuration

## 🔐 Authentication & Authorization

The system implements a comprehensive RBAC (Role-Based Access Control) system:

### Authentication Flow:

1. User registers/logs in with email and password
2. Server validates credentials and returns JWT token
3. Client includes JWT token in subsequent requests
4. Server validates token and extracts user information

### Authorization Levels:

- **Public**: Product browsing, user registration
- **User**: Profile management, order placement
- **Manager**: Product management, user management
- **Admin**: Full system access, role management

## 🚀 Deployment

### Environment Variables for Production:

```env
DATABASE_URL="postgresql://username:password@host:port/database"
API_PORT=3000
JWT_SECRET="your-secure-jwt-secret"
BETTER_AUTH_SECRET="your-better-auth-secret"
BETTER_AUTH_URL="https://your-api-domain.com"
NODE_ENV="production"
```

### Build for Production:

```bash
# Build all applications
bun run build

# Run API in production
bun run api:prod

# Serve frontend applications
bun run store:prod
bun run backoffice:prod
```

## 🛠️ Development Process & Decisions

### Architecture Decisions

#### 1. Monorepo with Nx

**Decision**: Use Nx for monorepo management
**Reasoning**:

- Shared code between frontend and backend
- Consistent tooling across all applications
- Efficient build caching and dependency management
- Easy to scale with additional applications

**Challenges Encountered**:

- Initial setup complexity with multiple TypeScript configurations
- Learning curve for Nx-specific commands and project structure
- **Resolution**: Created comprehensive npm scripts that abstract Nx complexity

#### 2. tRPC for Type-Safe APIs

**Decision**: Use tRPC instead of traditional REST APIs
**Reasoning**:

- End-to-end type safety from database to frontend
- Automatic API documentation
- Better developer experience with autocomplete
- Reduced boilerplate code

**Challenges Encountered**:

- Integration with Better Auth required custom middleware
- Complex setup for file uploads and non-JSON responses
- **Resolution**: Created custom tRPC procedures and middleware for authentication

#### 3. Better Auth vs NextAuth

**Decision**: Choose Better Auth over NextAuth
**Reasoning**:

- Framework agnostic (works with Hono)
- Better TypeScript support
- More flexible session management
- Smaller bundle size

**Challenges Encountered**:

- Less community documentation compared to NextAuth
- Required custom integration with Prisma
- **Resolution**: Created custom auth utilities and comprehensive documentation

#### 4. ULID vs UUID

**Decision**: Use ULID for primary keys
**Reasoning**:

- Lexicographically sortable (better for database performance)
- URL-safe and case-insensitive
- Timestamp-based ordering
- Better for distributed systems

**Challenges Encountered**:

- Limited Prisma support required custom implementation
- Frontend libraries needed ULID validation
- **Resolution**: Created custom Zod schemas and validation utilities

#### 5. Bun Runtime

**Decision**: Use Bun instead of Node.js
**Reasoning**:

- Significantly faster package installation
- Built-in bundler and test runner
- Better TypeScript support out of the box
- Smaller memory footprint

**Challenges Encountered**:

- Some npm packages not fully compatible
- Limited production deployment options
- **Resolution**: Added Node.js compatibility layer and Docker support

### Database Design Decisions

#### 1. Soft Deletion Strategy

**Decision**: Implement soft deletion with `isDeleted` flags
**Reasoning**:

- Data retention for audit purposes
- Ability to restore accidentally deleted records
- Compliance with data protection regulations

#### 2. Role-Based Access Control (RBAC)

**Decision**: Implement granular RBAC system
**Reasoning**:

- Scalable permission management
- Fine-grained access control
- Easy to audit and modify permissions

**Implementation**:

- Roles table for user groups
- Permissions table for specific actions
- Junction table for many-to-many relationships

#### 3. Decimal Pricing

**Decision**: Use Decimal type for product prices
**Reasoning**:

- Avoid floating-point precision issues
- Accurate financial calculations
- Better for currency handling

### Frontend Architecture

#### 1. Component Library Strategy

**Decision**: Use shadcn/ui with Tailwind CSS
**Reasoning**:

- Copy-paste components (no runtime dependency)
- Highly customizable
- Consistent design system
- Great TypeScript support

#### 2. State Management

**Decision**: Combine tRPC React Query with Zustand
**Reasoning**:

- tRPC for server state management
- Zustand for client-side state
- Minimal boilerplate
- Great TypeScript integration

### Performance Optimizations

#### 1. Database Indexing

- Unique indexes on email, SKU, and slug fields
- Composite indexes for common query patterns
- Foreign key indexes for join performance

#### 2. Frontend Optimizations

- Code splitting with React.lazy
- Image optimization with proper sizing
- Efficient re-rendering with React.memo

#### 3. API Optimizations

- Request/response compression
- Database connection pooling
- Efficient pagination with cursor-based approach

### Security Implementations

#### 1. Authentication Security

- JWT tokens with short expiration
- Secure HTTP-only cookies for refresh tokens
- CORS configuration for cross-origin requests

#### 2. Input Validation

- Zod schemas for all API inputs
- SQL injection prevention with Prisma
- XSS protection with proper sanitization

#### 3. Authorization Middleware

- Role-based route protection
- Permission checking at API level
- Frontend route guards

### Testing Strategy

#### 1. Unit Testing

- Vitest for fast unit tests
- Testing utilities for React components
- Database mocking for service tests

#### 2. Integration Testing

- API endpoint testing
- Database integration tests
- Authentication flow testing

### Deployment Considerations

#### 1. Containerization

- Docker support for all applications
- Multi-stage builds for optimization
- Environment-specific configurations

#### 2. Database Migrations

- Prisma migrations for schema changes
- Rollback strategies for failed deployments
- Data seeding for different environments

### Lessons Learned

1. **Start with a solid foundation**: Investing time in proper project structure and tooling pays off significantly
2. **Type safety is crucial**: tRPC and TypeScript prevented numerous runtime errors
3. **Documentation is essential**: Comprehensive README and code comments save time for future development
4. **Testing early**: Setting up testing infrastructure early prevents technical debt
5. **Security by design**: Implementing security measures from the beginning is easier than retrofitting

## 🤝 Contributing

We love contributions! Here's how to get started:

### Development Setup

1. **Fork** the repository
2. **Clone** your fork locally
3. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
4. **Install** dependencies (`bun install`)
5. **Set up** environment variables (copy `.env.example` to `.env`)
6. **Run** database setup (`bun run db:push && bun run db:seed`)

### Development Guidelines

- **Follow TypeScript best practices**
- **Write tests for new features**
- **Use conventional commit messages**
- **Ensure all lints pass before submitting**
- **Update documentation for new features**
- **Add comments to complex code sections**

### Code Style

- Use **Prettier** for code formatting
- Follow **ESLint** rules
- Use **meaningful variable names**
- Write **JSDoc comments** for public APIs
- Keep **functions small and focused**

### Pull Request Process

1. **Update** the README.md with details of changes if applicable
2. **Add** tests for new functionality
3. **Ensure** all tests pass (`bun run test`)
4. **Run** linting (`bun run lint`)
5. **Update** documentation as needed
6. **Request** review from maintainers

## 🐛 Troubleshooting

### Common Issues

#### Database Connection Issues

```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql  # Linux
brew services list | grep postgresql  # macOS

# Test database connection
psql -h localhost -U akp_user -d akp_used_phone
```

#### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill the process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

#### Prisma Client Issues

```bash
# Regenerate Prisma client
bun run db:generate

# Reset database if needed
bun run db:reset
```

#### Bun Installation Issues

```bash
# Clear Bun cache
rm -rf ~/.bun/install/cache

# Reinstall dependencies
rm -rf node_modules bun.lockb
bun install
```

### Getting Help

- 📧 **Email**: support@akp-phones.com
- 🐛 **Issues**: [GitHub Issues](../../issues)
- 💬 **Discussions**: [GitHub Discussions](../../discussions)
- 📚 **Documentation**: Check this README and inline code comments

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ by the AKP Team**

_Making quality used phones accessible to everyone_ 📱✨

</div>
