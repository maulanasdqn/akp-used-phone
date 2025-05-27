import { z } from 'zod';

export const roleSchema = z.object({
  id: z
    .string({ required_error: 'Role ID is required' })
    .ulid({ message: 'Invalid role ID format' }),
  name: z
    .string({ required_error: 'Role name is required' })
    .min(1, { message: 'Role name cannot be empty' })
    .max(100, { message: 'Role name cannot exceed 100 characters' }),
  createdAt: z.date({ required_error: 'Created date is required' }),
  updatedAt: z.date({ required_error: 'Updated date is required' }),
});

export const createRoleSchema = z.object({
  name: z
    .string({ required_error: 'Role name is required' })
    .min(1, { message: 'Role name cannot be empty' })
    .max(100, { message: 'Role name cannot exceed 100 characters' }),
});

export const updateRoleSchema = z.object({
  id: z
    .string({ required_error: 'Role ID is required' })
    .ulid({ message: 'Invalid role ID format' }),
  name: z
    .string()
    .min(1, { message: 'Role name cannot be empty' })
    .max(100, { message: 'Role name cannot exceed 100 characters' })
    .optional(),
});

export const partialUpdateRoleSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Role name cannot be empty' })
    .max(100, { message: 'Role name cannot exceed 100 characters' })
    .optional(),
});

export const roleResponseSchema = z.object({
  id: z
    .string({ required_error: 'Role ID is required' })
    .ulid({ message: 'Invalid role ID format' }),
  name: z.string({ required_error: 'Role name is required' }),
  createdAt: z.date({ required_error: 'Created date is required' }),
  updatedAt: z.date({ required_error: 'Updated date is required' }),
});

export const roleQuerySchema = z.object({
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
    .enum(['createdAt', 'updatedAt', 'name'], {
      invalid_type_error: 'Invalid sort field',
    })
    .default('createdAt'),
  sortOrder: z
    .enum(['asc', 'desc'], {
      invalid_type_error: 'Sort order must be asc or desc',
    })
    .default('desc'),
});
