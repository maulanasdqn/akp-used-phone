import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { trpcServer } from '@hono/trpc-server';
import { appRouterWorkers } from './trpc-workers';

const createTRPCContext = async (opts: { headers: Headers }) => {
  return {
    headers: opts.headers,
  };
};

const app = new Hono();

app.use(
  '*',
  cors({
    origin: ['http://localhost:5174', 'https://akp-used-phone.vercel.app'],
    allowHeaders: ['Content-Type', 'Authorization', 'Cookie', 'x-trpc-source'],
    allowMethods: ['POST', 'GET', 'OPTIONS'],
    exposeHeaders: ['Content-Length', 'Set-Cookie'],
    maxAge: 600,
    credentials: true,
  })
);

app.use(logger());

app.get('/api/auth/session', (c) => {
  return c.json({ user: null, session: null });
});

app.post('/api/auth/signin', async (c) => {
  return c.json({
    success: false,
    message: 'Auth not implemented in Workers version',
  });
});

app.post('/api/auth/signup', async (c) => {
  return c.json({
    success: false,
    message: 'Auth not implemented in Workers version',
  });
});

app.post('/api/auth/signout', (c) => {
  return c.json({ success: true });
});

const trpcMiddleware = trpcServer({
  router: appRouterWorkers,
  createContext: async (_opts, c) => {
    const context = await createTRPCContext({ headers: c.req.raw.headers });
    return context as unknown as Record<string, unknown>;
  },
  endpoint: '/v1/trpc',
});

app.use('/v1/trpc/*', trpcMiddleware);

app.get('/api/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/test', (c) => {
  return c.json({
    message: 'Cloudflare Workers deployment with tRPC successful!',
  });
});

export default {
  fetch: app.fetch,
};
