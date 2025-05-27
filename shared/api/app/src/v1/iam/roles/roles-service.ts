import { z } from 'zod';
import { rolesRepository } from './roles-repository';
import {
  createRoleSchema,
  updateRoleSchema,
  roleQuerySchema,
} from './roles-schema';
import { publicProcedure } from '@/shared/api/utils';

export const rolesService = {
  getAll: publicProcedure
    .input(roleQuerySchema)
    .query(async ({ input, ctx }) => {
      return await rolesRepository(ctx.prisma).getAll(input);
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string().ulid() }))
    .query(async ({ input, ctx }) => {
      return await rolesRepository(ctx.prisma).getById(input.id);
    }),

  getByName: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .query(async ({ input, ctx }) => {
      return await rolesRepository(ctx.prisma).getByName(input.name);
    }),

  create: publicProcedure
    .input(createRoleSchema)
    .mutation(async ({ input, ctx }) => {
      const existingRole = await rolesRepository(ctx.prisma).existsByName(
        input.name
      );
      if (existingRole) {
        return { message: 'Role name already exists' };
      }
      return await rolesRepository(ctx.prisma).create(input);
    }),

  update: publicProcedure
    .input(updateRoleSchema)
    .mutation(async ({ input, ctx }) => {
      const roleExists = await rolesRepository(ctx.prisma).exists(input.id);
      if (!roleExists) {
        return { message: 'Role not found' };
      }
      if (input.name) {
        const existingRole = await rolesRepository(ctx.prisma).getByName(
          input.name
        );
        if ('id' in existingRole && existingRole.id !== input.id) {
          return { message: 'Role name already exists' };
        }
      }
      return await rolesRepository(ctx.prisma).update(input);
    }),

  partialUpdate: publicProcedure
    .input(
      z.object({
        id: z.string().ulid(),
        data: z.object({
          name: z.string().min(1).max(100).optional(),
        }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const roleExists = await rolesRepository(ctx.prisma).exists(input.id);
      if (!roleExists) {
        return { message: 'Role not found' };
      }
      if (input.data.name) {
        const existingRole = await rolesRepository(ctx.prisma).getByName(
          input.data.name
        );
        if ('id' in existingRole && existingRole.id !== input.id) {
          return { message: 'Role name already exists' };
        }
      }
      return await rolesRepository(ctx.prisma).partialUpdate(
        input.id,
        input.data
      );
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string().ulid() }))
    .mutation(async ({ input, ctx }) => {
      return await rolesRepository(ctx.prisma).delete(input.id);
    }),

  exists: publicProcedure
    .input(z.object({ id: z.string().ulid() }))
    .query(async ({ input, ctx }) => {
      return await rolesRepository(ctx.prisma).exists(input.id);
    }),

  existsByName: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .query(async ({ input, ctx }) => {
      return await rolesRepository(ctx.prisma).existsByName(input.name);
    }),

  getUsersCount: publicProcedure
    .input(z.object({ id: z.string().ulid() }))
    .query(async ({ input, ctx }) => {
      return await rolesRepository(ctx.prisma).getUsersCount(input.id);
    }),
};

export type RolesRouter = typeof rolesService;
