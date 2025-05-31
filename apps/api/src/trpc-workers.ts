import { initTRPC } from '@trpc/server';
import { z } from 'zod';

const t = initTRPC.context<{ headers: Headers }>().create();

export const appRouterWorkers = t.router({
  health: t.procedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  users: t.router({
    list: t.procedure.query(() => {
      return {
        users: [],
        message: 'Users service not implemented in Workers version',
      };
    }),

    create: t.procedure
      .input(
        z.object({
          email: z.string().email(),
          name: z.string().min(1),
        })
      )
      .mutation(({ input }) => {
        return {
          success: false,
          message: 'User creation not implemented in Workers version',
          input,
        };
      }),
  }),

  products: t.router({
    list: t.procedure.query(() => {
      return {
        products: [],
        message: 'Products service not implemented in Workers version',
      };
    }),
    create: t.procedure
      .input(
        z.object({
          name: z.string().min(1),
          price: z.number().positive(),
          description: z.string().optional(),
        })
      )
      .mutation(({ input }) => {
        return {
          success: false,
          message: 'Product creation not implemented in Workers version',
          input,
        };
      }),
  }),
  roles: t.router({
    list: t.procedure.query(() => {
      return {
        roles: [],
        message: 'Roles service not implemented in Workers version',
      };
    }),
  }),
  permissions: t.router({
    list: t.procedure.query(() => {
      return {
        permissions: [],
        message: 'Permissions service not implemented in Workers version',
      };
    }),
  }),
});

export type AppRouterWorkers = typeof appRouterWorkers;
