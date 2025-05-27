import { z } from 'zod';
import { rolesRepository } from './roles-repository';
import {
  createRoleSchema,
  updateRoleSchema,
  roleQuerySchema,
} from './roles-schema';
import { commonService } from '../common/common-service';

const t = commonService().initTrpc();
const publicProcedure = t.procedure;
const router = t.router;

export const rolesRouter = router({
  getAll: publicProcedure.input(roleQuerySchema).query(async ({ input }) => {
    return await rolesRepository().getAll(input);
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string().ulid() }))
    .query(async ({ input }) => {
      return await rolesRepository().getById(input.id);
    }),

  getByName: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .query(async ({ input }) => {
      return await rolesRepository().getByName(input.name);
    }),

  create: publicProcedure
    .input(createRoleSchema)
    .mutation(async ({ input }) => {
      // Check if role name already exists
      const existingRole = await rolesRepository().existsByName(input.name);
      if (existingRole) {
        return { message: 'Role name already exists' };
      }

      return await rolesRepository().create(input);
    }),

  update: publicProcedure
    .input(updateRoleSchema)
    .mutation(async ({ input }) => {
      // Check if role exists
      const roleExists = await rolesRepository().exists(input.id);
      if (!roleExists) {
        return { message: 'Role not found' };
      }

      // Check if new name already exists (if name is being updated)
      if (input.name) {
        const existingRole = await rolesRepository().getByName(input.name);
        if ('id' in existingRole && existingRole.id !== input.id) {
          return { message: 'Role name already exists' };
        }
      }

      return await rolesRepository().update(input);
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
    .mutation(async ({ input }) => {
      // Check if role exists
      const roleExists = await rolesRepository().exists(input.id);
      if (!roleExists) {
        return { message: 'Role not found' };
      }

      // Check if new name already exists (if name is being updated)
      if (input.data.name) {
        const existingRole = await rolesRepository().getByName(input.data.name);
        if ('id' in existingRole && existingRole.id !== input.id) {
          return { message: 'Role name already exists' };
        }
      }

      return await rolesRepository().partialUpdate(input.id, input.data);
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string().ulid() }))
    .mutation(async ({ input }) => {
      return await rolesRepository().delete(input.id);
    }),

  exists: publicProcedure
    .input(z.object({ id: z.string().ulid() }))
    .query(async ({ input }) => {
      return await rolesRepository().exists(input.id);
    }),

  existsByName: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .query(async ({ input }) => {
      return await rolesRepository().existsByName(input.name);
    }),

  getUsersCount: publicProcedure
    .input(z.object({ id: z.string().ulid() }))
    .query(async ({ input }) => {
      return await rolesRepository().getUsersCount(input.id);
    }),
});

export type RolesRouter = typeof rolesRouter;

export const rolesService = () => {
  return rolesRepository();
};
