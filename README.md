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
- **Argon2** - Secure password hashing
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

## 🚀 Quick Start

### Prerequisites

- **Bun** >= 1.0.0 ([Install Bun](https://bun.sh/docs/installation))
- **PostgreSQL** database
- **Node.js** >= 18 (for some tooling compatibility)

### 1. Clone & Install

```bash
git clone <repository-url>
cd akp-used-phone
bun install
```

### 2. Environment Setup

```bash
cp .env.example .env
# Edit .env with your database credentials
```

Required environment variables:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/akp_used_phone"
API_PORT=3000
STORE_PORT=5173
BACKOFFICE_PORT=5174
JWT_SECRET="your-jwt-secret-key"
```

### 3. Database Setup

```bash
# Generate Prisma client
bun run db:generate

# Push schema to database
bun run db:push

# Run database seeding (creates sample data)
bun run db:seed

# Or run migrations (for production)
bun run db:migrate
```

### 4. Start Development

```bash
# Start all applications
bun run dev

# Or start individual apps
bun run api:dev         # API server (http://localhost:3000)
bun run store:dev       # Customer store (http://localhost:5173)
bun run backoffice:dev  # Admin panel (http://localhost:5174)
```

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
│   │   │       │   ├── auth/  # Authentication services
│   │   │       │   ├── users/ # User management
│   │   │       │   ├── roles/ # Role management
│   │   │       │   └── permissions/ # Permission management
│   │   │       └── products/  # Product management
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

## 🗃️ Database Schema

### Users (`AppUsers`)

- **ULID-based IDs** for unique identification
- **Email-based authentication** with unique constraints
- **Secure password hashing** using Argon2
- **Profile management** (firstName, lastName)
- **Role-based access control** (roleId foreign key)
- **Audit trails** (createdAt, updatedAt)

### Roles & Permissions (`AppRoles`, `AppPermissions`, `AppRolePermissions`)

- **Roles**: Define user access levels (admin, manager, user)
- **Permissions**: Granular access controls for specific actions
- **Role Permissions**: Many-to-many relationship between roles and permissions
- **Full RBAC implementation** for secure access control

### Products (`AppProducts`)

- **Unique SKU and slug** identifiers for inventory management
- **Rich product descriptions** with detailed specifications
- **Decimal pricing** for accurate financial calculations
- **Stock quantity tracking** with minimum order quantities
- **Image URL support** for product photos
- **Creator tracking** (createdBy user reference)
- **Audit trails** (createdAt, updatedAt)

## 🌱 Database Seeding

The project includes a comprehensive seeding system that creates sample data for development:

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

Run seeding with:

```bash
bun run db:seed
```

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

## 🤝 Contributing

We love contributions! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write tests for new features
- Use conventional commit messages
- Ensure all lints pass before submitting
- Update documentation for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

Having trouble? We're here to help!

- 📧 **Email**: support@akp-phones.com
- 🐛 **Issues**: [GitHub Issues](../../issues)
- 💬 **Discussions**: [GitHub Discussions](../../discussions)

## 🚀 Deployment

### Environment Variables for Production:

```env
DATABASE_URL="postgresql://username:password@host:port/database"
API_PORT=3000
JWT_SECRET="your-secure-jwt-secret"
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

---

<div align="center">

**Built with ❤️ by the AKP Team**

_Making quality used phones accessible to everyone_ 📱✨

</div>
