import { Hono } from 'hono';
import { trpcMiddleware } from './middleware/trpc';
import { loggerMiddleware } from './middleware/logger';
import { cors } from 'hono/cors';
import { auth } from '@/shared/api/utils';

const app = new Hono();

// Apply CORS middleware first to handle preflight requests
app.use(
  '*',
  cors({
    origin:
      process.env.NODE_ENV === 'production'
        ? process.env.FRONTEND_URL
        : 'http://localhost:5174',
    allowHeaders: ['Content-Type', 'Authorization', 'Cookie', 'x-trpc-source'],
    allowMethods: ['POST', 'GET', 'OPTIONS'],
    exposeHeaders: ['Content-Length', 'Set-Cookie'],
    maxAge: 600,
    credentials: true,
  })
);

loggerMiddleware(app);

app.on(['POST', 'GET'], '/api/auth/**', (c) => auth.handler(c.req.raw));

app.use('/v1/trpc/*', trpcMiddleware());

// Health check endpoint
app.get('/api/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// For local development with Bun
if (process.env.NODE_ENV !== 'production') {
  Bun.serve({
    port: process.env.API_PORT ?? 3000,
    fetch: app.fetch,
  });
}

// Export for Vercel
export default app;
