import { z } from 'zod';
import { usersRepository } from './users-repository';
import {
  createUserSchema,
  updateUserSchema,
  userQuerySchema,
} from './users-schema';
import { publicProcedure } from '@/shared/api/utils';

export const usersService = {
  getAll: publicProcedure
    .input(userQuerySchema)
    .query(async ({ input, ctx }) => {
      return await usersRepository(ctx.prisma).getAll(input);
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string().ulid() }))
    .query(async ({ input, ctx }) => {
      return await usersRepository(ctx.prisma).getById(input.id);
    }),

  getByEmail: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ input, ctx }) => {
      return await usersRepository(ctx.prisma).getByEmail(input.email);
    }),

  create: publicProcedure
    .input(createUserSchema)
    .mutation(async ({ input, ctx }) => {
      return await usersRepository(ctx.prisma).create({
        ...input,
      });
    }),

  update: publicProcedure
    .input(updateUserSchema)
    .mutation(async ({ input, ctx }) => {
      const updateData = { ...input };
      if (input.password) {
        const currentUser = await usersRepository(ctx.prisma).getByEmail(
          input.email ?? ''
        );
        if ('message' in currentUser) {
          return { message: 'User not found' };
        }
      }
      return await usersRepository(ctx.prisma).update(updateData);
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string().ulid() }))
    .mutation(async ({ input, ctx }) => {
      return await usersRepository(ctx.prisma).delete(input.id);
    }),
};

export type UsersRouter = typeof usersService;
