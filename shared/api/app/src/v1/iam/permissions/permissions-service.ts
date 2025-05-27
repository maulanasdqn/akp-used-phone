import { z } from 'zod';
import { permissionsRepository } from './permissions-repository';
import {
  createPermissionSchema,
  updatePermissionSchema,
  permissionQuerySchema,
} from './permissions-schema';
import { commonService } from '../common/common-service';

const t = commonService().initTrpc();
const publicProcedure = t.procedure;
const router = t.router;

export const permissionsRouter = router({
  getAll: publicProcedure
    .input(permissionQuerySchema)
    .query(async ({ input }) => {
      return await permissionsRepository().getAll(input);
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string().ulid() }))
    .query(async ({ input }) => {
      return await permissionsRepository().getById(input.id);
    }),

  getByName: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .query(async ({ input }) => {
      return await permissionsRepository().getByName(input.name);
    }),

  create: publicProcedure
    .input(createPermissionSchema)
    .mutation(async ({ input }) => {
      // Check if permission name already exists
      const existingPermission = await permissionsRepository().existsByName(
        input.name
      );
      if (existingPermission) {
        return { message: 'Permission name already exists' };
      }

      return await permissionsRepository().create(input);
    }),

  update: publicProcedure
    .input(updatePermissionSchema)
    .mutation(async ({ input }) => {
      // Check if permission exists
      const permissionExists = await permissionsRepository().exists(input.id);
      if (!permissionExists) {
        return { message: 'Permission not found' };
      }

      // Check if new name already exists (if name is being updated)
      if (input.name) {
        const existingPermission = await permissionsRepository().getByName(
          input.name
        );
        if ('id' in existingPermission && existingPermission.id !== input.id) {
          return { message: 'Permission name already exists' };
        }
      }

      return await permissionsRepository().update(input);
    }),

  partialUpdate: publicProcedure
    .input(
      z.object({
        id: z.string().ulid(),
        data: z.object({
          name: z.string().min(1).max(100).optional(),
          permission: z.string().min(1).max(200).optional(),
        }),
      })
    )
    .mutation(async ({ input }) => {
      // Check if permission exists
      const permissionExists = await permissionsRepository().exists(input.id);
      if (!permissionExists) {
        return { message: 'Permission not found' };
      }

      // Check if new name already exists (if name is being updated)
      if (input.data.name) {
        const existingPermission = await permissionsRepository().getByName(
          input.data.name
        );
        if ('id' in existingPermission && existingPermission.id !== input.id) {
          return { message: 'Permission name already exists' };
        }
      }

      return await permissionsRepository().partialUpdate(input.id, input.data);
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string().ulid() }))
    .mutation(async ({ input }) => {
      return await permissionsRepository().delete(input.id);
    }),

  exists: publicProcedure
    .input(z.object({ id: z.string().ulid() }))
    .query(async ({ input }) => {
      return await permissionsRepository().exists(input.id);
    }),

  existsByName: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .query(async ({ input }) => {
      return await permissionsRepository().existsByName(input.name);
    }),

  getRolesCount: publicProcedure
    .input(z.object({ id: z.string().ulid() }))
    .query(async ({ input }) => {
      return await permissionsRepository().getRolesCount(input.id);
    }),
});

export type PermissionsRouter = typeof permissionsRouter;

export const permissionsService = () => {
  return permissionsRepository();
};
