import z from 'zod';
import {
  permissionSchema,
  createPermissionSchema,
  updatePermissionSchema,
  partialUpdatePermissionSchema,
  permissionResponseSchema,
  permissionQuerySchema,
} from './permissions-schema';

export type TPermissionItem = z.infer<typeof permissionSchema>;
export type TRequestCreatePermission = z.infer<typeof createPermissionSchema>;
export type TRequestUpdatePermission = z.infer<typeof updatePermissionSchema>;
export type TRequestPartialUpdatePermission = z.infer<
  typeof partialUpdatePermissionSchema
>;
export type TResponsePermission = z.infer<typeof permissionResponseSchema>;
export type TRequestPermissionQuery = z.infer<typeof permissionQuerySchema>;
