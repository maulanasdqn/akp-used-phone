import { initTRPC } from '@trpc/server';
import { prisma } from '@/shared/api/database';
import type { PrismaClient } from '@/shared/api/database';
import { usersRouter, authRouter } from '@/shared/api/app';

export const createContext = () => {
  return {
    prisma,
  };
};

export type Context = {
  prisma: PrismaClient;
};

const t = initTRPC.context<Context>().create();

const router = t.router;

export const appRouter = router({
  users: usersRouter,
  auth: authRouter,
});

export type AppRouter = typeof appRouter;
