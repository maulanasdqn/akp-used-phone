import z from 'zod';
import {
  userSchema,
  createUserSchema,
  updateUserSchema,
  partialUpdateUserSchema,
  userResponseSchema,
  userWithRoleSchema,
  userQuerySchema,
} from './users-schema';

export type TUserItem = z.infer<typeof userSchema>;
export type TRequestCreateUser = z.infer<typeof createUserSchema>;
export type TRequestUpdateUser = z.infer<typeof updateUserSchema>;
export type TRequestPartialUpdateUser = z.infer<typeof partialUpdateUserSchema>;
export type TResponseUser = z.infer<typeof userResponseSchema>;
export type TResponseUserWithRole = z.infer<typeof userWithRoleSchema>;
export type TRequestUserQuery = z.infer<typeof userQuerySchema>;
