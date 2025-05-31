# Vercel Deployment Guide

## Issues Fixed

The 404 errors on Vercel were caused by several configuration issues in `vercel.json`:

### 1. Incorrect API Build Path

- **Problem**: The original config pointed to `dist/apps/api/apps/api/src/main.js` which doesn't exist
- **Solution**: Updated to point to the correct built file `dist/apps/api/main.js`

### 2. Wrong Build Script for Backoffice

- **Problem**: `package.json` had `"backoffice:build": "nx dev backoffice"` (dev instead of build)
- **Solution**: Changed to `"backoffice:build": "nx build backoffice"`

### 3. Simplified Vercel Configuration

- **Problem**: Overcomplicated build configuration with unnecessary static build setup
- **Solution**: Streamlined to use only the necessary builds and routes

## Current Configuration

### Build Process

```bash
nx build api && nx build store && nx build backoffice
```

### Routes

- `/api/*` → API serverless function
- `/v1/trpc/*` → tRPC API routes
- `/backoffice/*` → Backoffice SPA
- `/store/*` → Store SPA
- `/*` → Default to Store SPA (root)

### File Structure After Build

```
dist/
├── apps/
│   ├── api/
│   │   └── main.js (serverless function)
│   ├── backoffice/
│   │   ├── index.html
│   │   └── assets/
│   └── store/
│       ├── index.html
│       └── assets/
```

## Deployment Steps

1. **Commit the changes**:

   ```bash
   git add .
   git commit -m "Fix Vercel deployment configuration"
   git push
   ```

2. **Deploy to Vercel**:
   - The build will now work correctly
   - API routes will be available at `/api/*` and `/v1/trpc/*`
   - Frontend apps will be served at `/store/*` and `/backoffice/*`

## Environment Variables

Make sure to set these in your Vercel dashboard:

```env
DATABASE_URL=your_production_database_url
BETTER_AUTH_URL=https://your-vercel-domain.vercel.app
BETTER_AUTH_SECRET=your_production_secret
FRONTEND_URL=https://your-vercel-domain.vercel.app
NODE_ENV=production
```

## Testing

After deployment, test these endpoints:

- `https://your-domain.vercel.app/api/health` - API health check
- `https://your-domain.vercel.app/store` - Store frontend
- `https://your-domain.vercel.app/backoffice` - Backoffice frontend

## Notes

- The API is now properly configured as a serverless function
- Frontend apps are served as static files with proper SPA routing
- All builds are working locally and should work on Vercel
