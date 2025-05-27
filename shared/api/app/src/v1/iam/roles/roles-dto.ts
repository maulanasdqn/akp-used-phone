import z from 'zod';
import {
  roleSchema,
  createRoleSchema,
  updateRoleSchema,
  partialUpdateRoleSchema,
  roleResponseSchema,
  roleQuerySchema,
} from './roles-schema';

export type TRoleItem = z.infer<typeof roleSchema>;
export type TRequestCreateRole = z.infer<typeof createRoleSchema>;
export type TRequestUpdateRole = z.infer<typeof updateRoleSchema>;
export type TRequestPartialUpdateRole = z.infer<typeof partialUpdateRoleSchema>;
export type TResponseRole = z.infer<typeof roleResponseSchema>;
export type TRequestRoleQuery = z.infer<typeof roleQuerySchema>;
