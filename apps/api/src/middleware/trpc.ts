import { Hono } from 'hono';
import { trpcServer } from '@hono/trpc-server';
import { appRouter } from '@/shared/trpc/server';

export const trpcMiddleware = () => {
  const app = new Hono();
  const trpc = trpcServer({
    router: appRouter,
  });
  app.use('', trpc);
  return app;
};
