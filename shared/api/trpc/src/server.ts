import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { prisma } from '@/shared/api/database/index';
import type { PrismaClient } from '@/shared/api/database/index';

export const createContext = () => {
  return {
    prisma,
  };
};

export type Context = {
  prisma: PrismaClient;
};

const t = initTRPC.context<Context>().create();

const publicProcedure = t.procedure;
const router = t.router;

export const appRouter = router({
  hello: publicProcedure.input(z.string().nullish()).query(({ input }) => {
    return `Hello ${input ?? 'World'}!`;
  }),

  users: router({
    getAll: publicProcedure.query(async ({ ctx }) => {
      return await ctx.prisma.appUsers.findMany({
        include: {
          role: true,
        },
      });
    }),

    getById: publicProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ ctx, input }) => {
        return await ctx.prisma.appUsers.findUnique({
          where: { id: input.id },
          include: {
            role: true,
            createdProducts: true,
          },
        });
      }),
  }),
});

export type AppRouter = typeof appRouter;
