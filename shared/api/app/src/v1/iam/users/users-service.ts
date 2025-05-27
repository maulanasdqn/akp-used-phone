import { z } from 'zod';
import { usersRepository } from './users-repository';
import {
  createUserSchema,
  updateUserSchema,
  userQuerySchema,
  changePasswordSchema,
} from './users-schema';
import { hashPassword, verifyPassword } from '@/shared/api/utils';
import { commonService } from '../common/common-service';

const t = commonService().initTrpc();
const publicProcedure = t.procedure;
const router = t.router;

export const usersRouter = router({
  getAll: publicProcedure.input(userQuerySchema).query(async ({ input }) => {
    return await usersRepository().getAll(input);
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string().ulid() }))
    .query(async ({ input }) => {
      return await usersRepository().getById(input.id);
    }),

  getByEmail: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ input }) => {
      return await usersRepository().getByEmail(input.email);
    }),

  create: publicProcedure
    .input(createUserSchema)
    .mutation(async ({ input }) => {
      const password = await hashPassword(input.password);
      return await usersRepository().create({
        ...input,
        password,
      });
    }),

  update: publicProcedure
    .input(updateUserSchema)
    .mutation(async ({ input }) => {
      const updateData = { ...input };
      if (input.password) {
        const currentUser = await usersRepository().getByEmail(
          input.email ?? ''
        );
        if ('message' in currentUser) {
          return { message: 'User not found' };
        }
        const isSamePassword = await verifyPassword(
          input.password,
          currentUser.password
        );
        if (!isSamePassword) {
          const hashedPassword = await hashPassword(input.password);
          updateData.password = hashedPassword;
        } else {
          delete updateData.password;
        }
      }
      return await usersRepository().update(updateData);
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string().ulid() }))
    .mutation(async ({ input }) => {
      return await usersRepository().delete(input.id);
    }),

  updatePassword: publicProcedure
    .input(
      z.object({
        id: z.string().ulid(),
        newPassword: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const currentUser = await usersRepository().getById(input.id);
      if ('message' in currentUser) {
        return { message: 'User not found' };
      }
      const userWithPassword = await usersRepository().getByEmail(
        currentUser.email
      );
      if ('message' in userWithPassword) {
        return { message: 'User not found' };
      }
      const isSamePassword = await verifyPassword(
        input.newPassword,
        userWithPassword.password
      );
      if (isSamePassword) {
        return { message: 'New password is the same as current password' };
      }
      const hashedPassword = await hashPassword(input.newPassword);
      return await usersRepository().updatePassword(input.id, hashedPassword);
    }),

  changePassword: publicProcedure
    .input(
      z.object({
        id: z.string().ulid(),
        passwords: changePasswordSchema,
      })
    )
    .mutation(async ({ input }) => {
      const currentUser = await usersRepository().getById(input.id);
      if ('message' in currentUser) {
        return { message: 'User not found' };
      }
      const userWithPassword = await usersRepository().getByEmail(
        currentUser.email
      );
      if ('message' in userWithPassword) {
        return { message: 'User not found' };
      }
      const isCurrentPasswordValid = await verifyPassword(
        input.passwords.currentPassword,
        userWithPassword.password
      );
      if (!isCurrentPasswordValid) {
        return { message: 'Current password is incorrect' };
      }
      const isSamePassword = await verifyPassword(
        input.passwords.newPassword,
        userWithPassword.password
      );
      if (isSamePassword) {
        return { message: 'New password is the same as current password' };
      }
      const hashedPassword = await hashPassword(input.passwords.newPassword);
      return await usersRepository().updatePassword(input.id, hashedPassword);
    }),
});

export type UsersRouter = typeof usersRouter;

export const usersService = () => {
  return usersRepository();
};
