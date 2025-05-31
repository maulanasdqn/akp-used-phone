import { initTRPC } from '@trpc/server';
import { z } from 'zod';

// Initialize tRPC
const t = initTRPC.context<{ headers: Headers }>().create();

// Create router
export const appRouterWorkers = t.router({
  // Health check procedure
  health: t.procedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // Users procedures (simplified for Workers)
  users: t.router({
    list: t.procedure.query(() => {
      // Return mock data for now - replace with D1 database queries
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
        // Implement user creation with D1 database
        return {
          success: false,
          message: 'User creation not implemented in Workers version',
          input,
        };
      }),
  }),

  // Products procedures (simplified for Workers)
  products: t.router({
    list: t.procedure.query(() => {
      // Return mock data for now - replace with D1 database queries
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
        // Implement product creation with D1 database
        return {
          success: false,
          message: 'Product creation not implemented in Workers version',
          input,
        };
      }),
  }),

  // Roles procedures (simplified for Workers)
  roles: t.router({
    list: t.procedure.query(() => {
      return {
        roles: [],
        message: 'Roles service not implemented in Workers version',
      };
    }),
  }),

  // Permissions procedures (simplified for Workers)
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
