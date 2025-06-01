/**
 * Main API server entry point
 *
 * This file sets up the Hono web server with:
 * - CORS configuration for cross-origin requests
 * - Authentication middleware using Better Auth
 * - tRPC middleware for type-safe API endpoints
 * - Request logging middleware
 * - Health check endpoint
 */

import { Hono } from 'hono';
import { trpcMiddleware } from './middleware/trpc';
import { loggerMiddleware } from './middleware/logger';
import { cors } from 'hono/cors';
import { auth } from '@/shared/api/utils';

// Initialize Hono application instance
const app = new Hono();

/**
 * Configure CORS (Cross-Origin Resource Sharing) middleware
 *
 * Allows requests from:
 * - Local development servers (store and backoffice)
 * - Production domains for store and backoffice
 *
 * Security features:
 * - Specific origin allowlist (no wildcard)
 * - Credential support for authentication cookies
 * - Limited allowed headers and methods
 * - Cache control with maxAge
 */
app.use(
  '*',
  cors({
    origin: [
      'http://localhost:5173', // Local store development
      'http://localhost:5174', // Local backoffice development
      'https://store.used.msdqn.dev', // Production store
      'https://backoffice.used.msdqn.dev', // Production backoffice
    ],
    allowHeaders: ['Content-Type', 'Authorization', 'Cookie', 'x-trpc-source'],
    allowMethods: ['POST', 'GET', 'OPTIONS'],
    exposeHeaders: ['Content-Length', 'Set-Cookie'],
    maxAge: 600, // Cache preflight requests for 10 minutes
    credentials: true, // Allow cookies and authorization headers
  })
);

/**
 * Apply request logging middleware
 *
 * Logs all incoming requests with:
 * - HTTP method and URL
 * - Response status and timing
 * - Request/response sizes
 */
loggerMiddleware(app);

/**
 * Better Auth authentication routes
 *
 * Handles all authentication-related endpoints:
 * - POST /api/auth/sign-in - User login
 * - POST /api/auth/sign-up - User registration
 * - POST /api/auth/sign-out - User logout
 * - GET /api/auth/session - Get current session
 * - And other Better Auth endpoints
 */
app.on(['POST', 'GET'], '/api/auth/**', (c) => auth.handler(c.req.raw));

/**
 * tRPC API routes
 *
 * All business logic API endpoints are handled through tRPC:
 * - /v1/trpc/users.* - User management
 * - /v1/trpc/products.* - Product management
 * - /v1/trpc/roles.* - Role management
 * - /v1/trpc/permissions.* - Permission management
 *
 * tRPC provides:
 * - End-to-end type safety
 * - Automatic input validation with Zod
 * - Built-in error handling
 * - Request/response serialization
 */
app.use('/v1/trpc/*', trpcMiddleware());

/**
 * Health check endpoint
 *
 * Simple endpoint to verify server is running
 * Returns current timestamp for monitoring purposes
 */
app.get('/api/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/**
 * Start development server using Bun runtime
 *
 * Only runs in development mode when using Bun
 * In production, the app is exported for external server handling
 */
if (process.env.NODE_ENV !== 'production' && typeof Bun !== 'undefined') {
  Bun.serve({
    hostname: '0.0.0.0', // Listen on all interfaces
    port: process.env.API_PORT ?? 3000, // Use environment port or default to 3000
    fetch: app.fetch, // Hono request handler
  });
}

/**
 * Export app for production deployment
 *
 * This export is used by:
 * - Cloudflare Workers
 * - Vercel Edge Functions
 * - Other serverless platforms
 */
export default {
  fetch: app.fetch,
};
