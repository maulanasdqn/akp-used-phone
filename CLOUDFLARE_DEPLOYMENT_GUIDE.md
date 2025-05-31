# Cloudflare Workers Deployment Guide

## Setup Complete ✅

Your project is now configured for Cloudflare Workers deployment using Wrangler.

## Configuration Files Created

### 1. `apps/api/wrangler.toml`

- Main configuration file for Cloudflare Workers
- Defines worker name, main entry point, and compatibility settings
- Includes staging and production environments

### 2. Updated `apps/api/src/main.ts`

- Modified export format to be compatible with Cloudflare Workers
- Added check for Bun environment to prevent errors in Workers runtime

### 3. Updated `apps/api/project.json`

- Added `deploy` and `deploy:staging` targets
- Configured to build before deployment

### 4. Updated `package.json`

- Added deployment scripts for easy access

## Deployment Steps

### 1. Login to Cloudflare

```bash
npm run wrangler:login
```

This will open a browser window to authenticate with Cloudflare.

### 2. Verify Authentication

```bash
npm run wrangler:whoami
```

### 3. Build and Deploy to Production

```bash
npm run deploy:api
```

### 4. Deploy to Staging (Optional)

```bash
npm run deploy:api:staging
```

## Environment Variables

Set these secrets in Cloudflare Workers:

```bash
# Navigate to API directory
cd apps/api

# Set environment variables
wrangler secret put DATABASE_URL
wrangler secret put BETTER_AUTH_SECRET
wrangler secret put BETTER_AUTH_URL
wrangler secret put FRONTEND_URL

# For staging environment
wrangler secret put DATABASE_URL --env staging
wrangler secret put BETTER_AUTH_SECRET --env staging
wrangler secret put BETTER_AUTH_URL --env staging
wrangler secret put FRONTEND_URL --env staging
```

## Alternative: Set via Cloudflare Dashboard

1. Go to Cloudflare Dashboard
2. Navigate to Workers & Pages
3. Select your worker
4. Go to Settings > Environment Variables
5. Add the required variables

## Required Environment Variables

| Variable             | Description                   | Example                                          |
| -------------------- | ----------------------------- | ------------------------------------------------ |
| `DATABASE_URL`       | PostgreSQL connection string  | `postgresql://user:pass@host:5432/db`            |
| `BETTER_AUTH_SECRET` | Secret key for authentication | `your-secret-key-here`                           |
| `BETTER_AUTH_URL`    | Base URL for auth             | `https://your-worker.your-subdomain.workers.dev` |
| `FRONTEND_URL`       | Frontend application URL      | `https://your-frontend-domain.com`               |

## Testing Deployment

After deployment, test these endpoints:

### Production

- `https://akp-used-phone-api.your-subdomain.workers.dev/api/health`
- `https://akp-used-phone-api.your-subdomain.workers.dev/v1/trpc/`

### Staging

- `https://akp-used-phone-api-staging.your-subdomain.workers.dev/api/health`

## Frontend Deployment Options

For the frontend apps (store and backoffice), you have several options:

### Option 1: Cloudflare Pages

```bash
# Build the frontend apps
nx build store
nx build backoffice

# Deploy to Cloudflare Pages (manual upload or Git integration)
```

### Option 2: Keep Vercel for Frontend

- Use Cloudflare Workers for API only
- Keep frontend apps on Vercel
- Update API URLs in frontend to point to Workers

## Useful Commands

```bash
# Check deployment status
wrangler deployments list

# View logs
wrangler tail

# View worker details
wrangler whoami

# Delete deployment
wrangler delete

# Local development with Wrangler
wrangler dev
```

## Database Considerations

### Option 1: Keep External PostgreSQL

- Continue using your current PostgreSQL database
- Ensure it's accessible from Cloudflare Workers
- Consider connection pooling (PgBouncer, Supabase, etc.)

### Option 2: Migrate to Cloudflare D1

- Cloudflare's serverless SQL database
- Update `wrangler.toml` to include D1 configuration
- Migrate your Prisma schema to work with D1

## Performance Benefits

- **Global Edge Network**: Your API will be deployed to 300+ locations worldwide
- **Zero Cold Starts**: Faster response times compared to traditional serverless
- **Cost Effective**: Pay only for requests, not idle time
- **Automatic Scaling**: Handles traffic spikes automatically

## Troubleshooting

### Common Issues

1. **Build Errors**: Ensure all dependencies are compatible with Workers runtime
2. **Environment Variables**: Make sure all secrets are set correctly
3. **Database Connections**: Verify database is accessible from Workers
4. **CORS Issues**: Update CORS settings if needed

### Debug Commands

```bash
# View detailed logs
wrangler tail --format=pretty

# Test locally
wrangler dev

# Check configuration
wrangler whoami
```

## Next Steps

1. Deploy your API to Cloudflare Workers
2. Update frontend environment variables to use Workers URL
3. Test all functionality
4. Consider migrating frontend to Cloudflare Pages for full edge deployment
