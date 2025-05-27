import { Hono } from 'hono';
import { trpcMiddleware } from './middleware/trpc';
import { authMiddleware } from './middleware/auth';
import { loggerMiddleware } from './middleware/logger';

const app = new Hono();
const v1 = new Hono();
const trpc = new Hono();

loggerMiddleware(app);

trpc.route('/', authMiddleware());
trpc.route('/', trpcMiddleware());

v1.route('/trpc', trpc);

app.route('/v1', v1);

Bun.serve({
  port: process.env.API_PORT ?? 3000,
  fetch: app.fetch,
});

export default app;
