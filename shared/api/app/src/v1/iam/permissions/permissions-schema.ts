import { z } from 'zod';

export const permissionSchema = z.object({
  id: z
    .string({ required_error: 'Permission ID is required' })
    .ulid({ message: 'Invalid permission ID format' }),
  name: z
    .string({ required_error: 'Permission name is required' })
    .min(1, { message: 'Permission name cannot be empty' })
    .max(100, { message: 'Permission name cannot exceed 100 characters' }),

  createdAt: z.date({ required_error: 'Created date is required' }),
  updatedAt: z.date({ required_error: 'Updated date is required' }),
});

export const createPermissionSchema = z.object({
  name: z
    .string({ required_error: 'Permission name is required' })
    .min(1, { message: 'Permission name cannot be empty' })
    .max(100, { message: 'Permission name cannot exceed 100 characters' }),
});

export const updatePermissionSchema = z.object({
  id: z
    .string({ required_error: 'Permission ID is required' })
    .ulid({ message: 'Invalid permission ID format' }),
  name: z
    .string()
    .min(1, { message: 'Permission name cannot be empty' })
    .max(100, { message: 'Permission name cannot exceed 100 characters' })
    .optional(),
});

export const partialUpdatePermissionSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Permission name cannot be empty' })
    .max(100, { message: 'Permission name cannot exceed 100 characters' })
    .optional(),
});

export const permissionResponseSchema = z.object({
  id: z
    .string({ required_error: 'Permission ID is required' })
    .ulid({ message: 'Invalid permission ID format' }),
  name: z.string({ required_error: 'Permission name is required' }),

  createdAt: z.date({ required_error: 'Created date is required' }),
  updatedAt: z.date({ required_error: 'Updated date is required' }),
});

export const permissionQuerySchema = z.object({
  page: z.coerce
    .number({ invalid_type_error: 'Page must be a number' })
    .min(1, { message: 'Page must be at least 1' })
    .default(1),
  limit: z.coerce
    .number({ invalid_type_error: 'Limit must be a number' })
    .min(1, { message: 'Limit must be at least 1' })
    .max(100, { message: 'Limit cannot exceed 100' })
    .default(10),
  search: z.string().optional(),
  sortBy: z
    .enum(['createdAt', 'updatedAt', 'name', 'permission'], {
      invalid_type_error: 'Invalid sort field',
    })
    .default('createdAt'),
  sortOrder: z
    .enum(['asc', 'desc'], {
      invalid_type_error: 'Sort order must be asc or desc',
    })
    .default('desc'),
});
