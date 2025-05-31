# Docker Setup for AKP Used Phone

This project has been dockerized with 3 main applications:

- **API**: Backend service running on port 3000
- **Store**: Customer-facing frontend running on port 8080
- **Backoffice**: Admin frontend running on port 8081

## Prerequisites

- Docker
- Docker Compose
- Bun (for local development)

## Quick Start

1. **Clone the repository and navigate to the project directory**

   ```bash
   cd akp-used-phone
   ```

2. **Build and start all services**

   ```bash
   docker-compose up --build
   ```

3. **Access the applications**
   - Store Frontend: http://localhost:8080
   - Backoffice Frontend: http://localhost:8081
   - API: http://localhost:3000
   - Database: localhost:5432

## Environment Variables

The docker-compose.yml includes default environment variables. For production, you should:

1. Create a `.env` file in the root directory
2. Override the default values, especially:
   - `BETTER_AUTH_SECRET`: Use a strong, unique secret
   - `POSTGRES_PASSWORD`: Use a secure password
   - Database credentials

Example `.env` file:

```env
POSTGRES_DB=akp_used_phone
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_password
DATABASE_URL=postgresql://postgres:your_secure_password@postgres:5432/akp_used_phone
BETTER_AUTH_SECRET=your-very-secure-secret-key-here
API_PORT=3000
FRONTEND_URL=http://localhost:8080
```

## Available Commands

### Start all services

```bash
docker-compose up
```

### Start services in background

```bash
docker-compose up -d
```

### Build and start (rebuild images)

```bash
docker-compose up --build
```

### Stop all services

```bash
docker-compose down
```

### Stop and remove volumes (⚠️ This will delete database data)

```bash
docker-compose down -v
```

### View logs

```bash
# All services
docker-compose logs

# Specific service
docker-compose logs api
docker-compose logs store
docker-compose logs backoffice
docker-compose logs postgres
```

### Execute commands in containers

```bash
# Access API container
docker-compose exec api sh

# Access database
docker-compose exec postgres psql -U postgres -d akp_used_phone
```

## Database Management

### Run Prisma migrations

```bash
# Access the API container
docker-compose exec api sh

# Inside the container, run migrations
bun run db:migrate
```

### Seed the database

```bash
# Access the API container
docker-compose exec api sh

# Inside the container, run seed
bun run db:seed
```

## Development vs Production

### Development

The current setup is optimized for development with:

- Hot reloading disabled (containers serve built files)
- Default credentials
- Debug-friendly configurations

### Production Considerations

For production deployment:

1. **Security**:

   - Change all default passwords
   - Use strong secrets
   - Enable HTTPS
   - Configure proper CORS origins

2. **Performance**:

   - Use multi-stage builds (already implemented)
   - Configure proper resource limits
   - Set up health checks (basic ones included)

3. **Monitoring**:
   - Add logging aggregation
   - Set up monitoring and alerting
   - Configure backup strategies

## Troubleshooting

### Port conflicts

If you get port conflicts, you can change the ports in docker-compose.yml:

```yaml
ports:
  - '3001:3000' # Change 3000 to 3001 for API
  - '8082:80' # Change 8080 to 8082 for Store
  - '8083:80' # Change 8081 to 8083 for Backoffice
```

### Database connection issues

1. Ensure PostgreSQL container is healthy:

   ```bash
   docker-compose ps
   ```

2. Check database logs:

   ```bash
   docker-compose logs postgres
   ```

3. Verify connection from API container:
   ```bash
   docker-compose exec api sh
   # Inside container:
   bun run db:generate
   ```

### Build issues

1. Clear Docker cache:

   ```bash
   docker system prune -a
   ```

2. Rebuild without cache:
   ```bash
   docker-compose build --no-cache
   ```

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Store App     │    │  Backoffice App │    │    API Server   │
│   (Port 8080)   │    │   (Port 8081)   │    │   (Port 3000)   │
│                 │    │                 │    │                 │
│  React + Vite   │    │  React + Vite   │    │  Hono + tRPC    │
│     Nginx       │    │     Nginx       │    │      Bun        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   PostgreSQL    │
                    │   (Port 5432)   │
                    │                 │
                    │   Database      │
                    └─────────────────┘
```

All services communicate through a Docker network called `akp-network`.
