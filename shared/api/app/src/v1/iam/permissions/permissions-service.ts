import { z } from 'zod';
import { permissionsRepository } from './permissions-repository';
import {
  createPermissionSchema,
  updatePermissionSchema,
  permissionQuerySchema,
} from './permissions-schema';
import { protectedProcedure } from '@/shared/api/utils';

export const permissionsService = {
  getAll: protectedProcedure
    .input(permissionQuerySchema)
    .query(async ({ input, ctx }) => {
      return await permissionsRepository(ctx.prisma).getAll(input);
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string().ulid() }))
    .query(async ({ input, ctx }) => {
      return await permissionsRepository(ctx.prisma).getById(input.id);
    }),

  getByName: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .query(async ({ input, ctx }) => {
      return await permissionsRepository(ctx.prisma).getByName(input.name);
    }),

  create: protectedProcedure
    .input(createPermissionSchema)
    .mutation(async ({ input, ctx }) => {
      const existingPermission = await permissionsRepository(
        ctx.prisma
      ).existsByName(input.name);
      if (existingPermission) {
        return { message: 'Permission name already exists' };
      }
      return await permissionsRepository(ctx.prisma).create(input);
    }),

  update: protectedProcedure
    .input(updatePermissionSchema)
    .mutation(async ({ input, ctx }) => {
      const permissionExists = await permissionsRepository(ctx.prisma).exists(
        input.id
      );
      if (!permissionExists) {
        return { message: 'Permission not found' };
      }
      if (input.name) {
        const existingPermission = await permissionsRepository(
          ctx.prisma
        ).getByName(input.name);
        if ('id' in existingPermission && existingPermission.id !== input.id) {
          return { message: 'Permission name already exists' };
        }
      }
      return await permissionsRepository(ctx.prisma).update(input);
    }),

  partialUpdate: protectedProcedure
    .input(
      z.object({
        id: z.string().ulid(),
        data: z.object({
          name: z.string().min(1).max(100).optional(),
          permission: z.string().min(1).max(200).optional(),
        }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const permissionExists = await permissionsRepository(ctx.prisma).exists(
        input.id
      );
      if (!permissionExists) {
        return { message: 'Permission not found' };
      }
      if (input.data.name) {
        const existingPermission = await permissionsRepository(
          ctx.prisma
        ).getByName(input.data.name);
        if ('id' in existingPermission && existingPermission.id !== input.id) {
          return { message: 'Permission name already exists' };
        }
      }
      return await permissionsRepository(ctx.prisma).partialUpdate(
        input.id,
        input.data
      );
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().ulid() }))
    .mutation(async ({ input, ctx }) => {
      return await permissionsRepository(ctx.prisma).delete(input.id);
    }),

  exists: protectedProcedure
    .input(z.object({ id: z.string().ulid() }))
    .query(async ({ input, ctx }) => {
      return await permissionsRepository(ctx.prisma).exists(input.id);
    }),

  existsByName: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .query(async ({ input, ctx }) => {
      return await permissionsRepository(ctx.prisma).existsByName(input.name);
    }),

  getRolesCount: protectedProcedure
    .input(z.object({ id: z.string().ulid() }))
    .query(async ({ input, ctx }) => {
      return await permissionsRepository(ctx.prisma).getRolesCount(input.id);
    }),
};

export type PermissionsRouter = typeof permissionsService;
