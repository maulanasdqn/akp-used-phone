import { Hono } from 'hono';
import { trpcMiddleware } from './middleware/trpc';
import { loggerMiddleware } from './middleware/logger';
import { cors } from 'hono/cors';
import { auth } from '@/shared/api/utils';

const app = new Hono();

app.use(
  '*',
  cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
      'https://akp-used-phone.vercel.app',
    ],
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

app.get('/api/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

if (process.env.NODE_ENV !== 'production' && typeof Bun !== 'undefined') {
  Bun.serve({
    port: process.env.API_PORT ?? 3000,
    fetch: app.fetch,
  });
}

export default {
  fetch: app.fetch,
};
