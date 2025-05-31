import superjson from 'superjson';
import { ZodError } from 'zod';
import { initTRPC, TRPCError } from '@trpc/server';
import { auth } from './auth';
import { prisma } from '@/shared/api/database';

export const createTRPCContext = async (opts: { headers: Headers }) => {
  const authSession = await auth.api.getSession({
    headers: opts.headers,
  });
  console.log('Auth Session', authSession);
  const source = opts.headers.get('x-trpc-source') ?? 'unknown';
  console.log('>>> tRPC Request from', source, 'by', authSession?.user.email);
  return {
    prisma,
    user: authSession?.user,
    headers: opts.headers,
  };
};
type Context = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter: ({ shape, error }) => ({
    ...shape,
    data: {
      ...shape.data,
      zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
    },
  }),
});

export const createCallerFactory = t.createCallerFactory;

export const createTRPCInstance = t.router;

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user?.id) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});
