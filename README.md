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

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Store App     │    │  Backoffice     │    │    API Server   │
│   (Customer)    │    │   (Admin)       │    │   (Backend)     │
│                 │    │                 │    │                 │
│  React + Vite   │    │  React + Vite   │    │  Hono + tRPC    │
│  Port: 4200     │    │  Port: 4201     │    │  Port: 3000     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   PostgreSQL    │
                    │   Database      │
                    │                 │
                    │  Users & Phones │
                    └─────────────────┘
```

## 🛠️ Tech Stack

### Frontend

- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe JavaScript
- **Vite** - Next-generation frontend tooling
- **tRPC** - End-to-end typesafe APIs

### Backend

- **Bun** - Fast JavaScript runtime
- **Hono** - Lightweight web framework
- **tRPC** - Type-safe API layer
- **Zod** - Schema validation
- **Swagger UI** - API documentation

### Database & ORM

- **PostgreSQL** - Reliable relational database
- **Prisma** - Next-generation ORM
- **ULID** - Universally unique lexicographically sortable identifiers

### Development Tools

- **Nx** - Smart monorepo management
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Vitest** - Unit testing framework

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

### 3. Database Setup

```bash
# Generate Prisma client
bun run db:generate

# Push schema to database
bun run db:push

# Or run migrations (for production)
bun run db:migrate
```

### 4. Start Development

```bash
# Start all applications
bun run dev

# Or start individual apps
bun run api:dev      # API server (http://localhost:3000)
nx serve store       # Customer store (http://localhost:4200)
nx serve backoffice  # Admin panel (http://localhost:4201)
```

## 📁 Project Structure

```
akp-used-phone/
├── 📱 apps/
│   ├── 🛒 store/          # Customer-facing storefront
│   ├── 🏢 backoffice/     # Admin management panel
│   └── 🔌 api/            # Backend API server
├── 🔗 shared/
│   └── trpc/              # Shared tRPC definitions
├── 🗃️ prisma/
│   └── schema.prisma      # Database schema
├── 📋 package.json        # Project dependencies
└── 📖 README.md          # You are here! 👋
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
- User management
- Order processing
- Analytics dashboard
- Product catalog management

### 🔌 API Features

- RESTful endpoints with Swagger documentation
- JWT-based authentication
- Input validation with Zod schemas
- Type-safe database operations
- Comprehensive error handling

## 🗃️ Database Schema

### Users (`AppUser`)

- Unique email-based authentication
- Secure password hashing
- Profile management (firstName, lastName)
- Audit trails (createdAt, updatedAt)

### Products (`AppProduct`)

- Unique SKU and slug identifiers
- Rich product descriptions
- Decimal pricing for accuracy
- Stock quantity tracking
- Minimum order quantities
- Image URL support

## 🧪 Development Commands

```bash
# Database Operations
bun run db:pull      # Pull schema from database
bun run db:push      # Push schema to database
bun run db:migrate   # Run database migrations
bun run db:generate  # Generate Prisma client

# API Development
bun run api:dev      # Start API in development mode
bun run api:build    # Build API for production
bun run api:prod     # Run production API build

# Testing
nx test              # Run all tests
nx test store        # Test specific app
nx test --coverage   # Run tests with coverage

# Code Quality
nx lint              # Lint all projects
nx format            # Format code with Prettier
```

## 🌟 API Documentation

Once the API server is running, visit:

- **Swagger UI**: http://localhost:3000/ui
- **API Endpoints**: http://localhost:3000/api

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

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

Having trouble? We're here to help!

- 📧 **Email**: support@akp-phones.com
- 🐛 **Issues**: [GitHub Issues](../../issues)
- 💬 **Discussions**: [GitHub Discussions](../../discussions)

---

<div align="center">

**Built with ❤️ by the AKP Team**

_Making quality used phones accessible to everyone_ 📱✨

</div>
