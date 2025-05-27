import { trpcServer } from '@hono/trpc-server';
import { createTRPCContext } from '@/shared/api/utils';
import { appRouter } from '@/shared/trpc';
import type { Context } from 'hono';

export const trpcMiddleware = () => {
  const trpc = trpcServer({
    router: appRouter,
    createContext: async (_opts, c: Context) => {
      const context = await createTRPCContext({ headers: c.req.raw.headers });
      return context as unknown as Record<string, unknown>;
    },
    endpoint: '/v1/trpc',
  });
  return trpc;
};
