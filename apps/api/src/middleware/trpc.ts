import { Hono } from 'hono';
import { trpcServer } from '@hono/trpc-server';
import { appRouter, createContext } from '@/shared/api/trpc/server';

export const trpcMiddleware = () => {
  const app = new Hono();
  const trpc = trpcServer({
    router: appRouter,
    createContext,
  });
  app.use('', trpc);
  return app;
};
