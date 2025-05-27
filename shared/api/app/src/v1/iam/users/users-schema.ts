import { z } from 'zod';

export const userSchema = z.object({
  id: z
    .string({ required_error: 'User ID is required' })
    .ulid({ message: 'Invalid user ID format' }),
  email: z
    .string({ required_error: 'Email is required' })
    .email({ message: 'Invalid email format' }),
  password: z
    .string({ required_error: 'Password is required' })
    .min(8, { message: 'Password must be at least 8 characters long' }),
  firstName: z
    .string({ required_error: 'First name is required' })
    .min(1, { message: 'First name cannot be empty' }),
  lastName: z
    .string({ required_error: 'Last name is required' })
    .min(1, { message: 'Last name cannot be empty' }),
  roleId: z
    .string({ required_error: 'Role ID is required' })
    .ulid({ message: 'Invalid role ID format' }),
  createdAt: z.date({ required_error: 'Created date is required' }),
  updatedAt: z.date({ required_error: 'Updated date is required' }),
});

export const createUserSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email({ message: 'Invalid email format' }),
  password: z
    .string({ required_error: 'Password is required' })
    .min(8, { message: 'Password must be at least 8 characters long' }),
  firstName: z
    .string({ required_error: 'First name is required' })
    .min(1, { message: 'First name cannot be empty' }),
  lastName: z
    .string({ required_error: 'Last name is required' })
    .min(1, { message: 'Last name cannot be empty' }),
  roleId: z
    .string({ required_error: 'Role ID is required' })
    .ulid({ message: 'Invalid role ID format' }),
});

export const updateUserSchema = z.object({
  id: z
    .string({ required_error: 'User ID is required' })
    .ulid({ message: 'Invalid user ID format' }),
  email: z.string().email({ message: 'Invalid email format' }).optional(),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .optional(),
  firstName: z
    .string()
    .min(1, { message: 'First name cannot be empty' })
    .optional(),
  lastName: z
    .string()
    .min(1, { message: 'Last name cannot be empty' })
    .optional(),
  roleId: z.string().ulid({ message: 'Invalid role ID format' }).optional(),
});

export const partialUpdateUserSchema = z.object({
  email: z.string().email({ message: 'Invalid email format' }).optional(),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .optional(),
  firstName: z
    .string()
    .min(1, { message: 'First name cannot be empty' })
    .optional(),
  lastName: z
    .string()
    .min(1, { message: 'Last name cannot be empty' })
    .optional(),
  roleId: z.string().ulid({ message: 'Invalid role ID format' }).optional(),
});

export const userResponseSchema = z.object({
  id: z
    .string({ required_error: 'User ID is required' })
    .ulid({ message: 'Invalid user ID format' }),
  email: z
    .string({ required_error: 'Email is required' })
    .email({ message: 'Invalid email format' }),
  firstName: z.string({ required_error: 'First name is required' }),
  lastName: z.string({ required_error: 'Last name is required' }),
  roleId: z
    .string({ required_error: 'Role ID is required' })
    .ulid({ message: 'Invalid role ID format' }),
  createdAt: z.date({ required_error: 'Created date is required' }),
  updatedAt: z.date({ required_error: 'Updated date is required' }),
});

export const userWithRoleSchema = userResponseSchema.extend({
  role: z.object({
    id: z
      .string({ required_error: 'Role ID is required' })
      .ulid({ message: 'Invalid role ID format' }),
    name: z.string({ required_error: 'Role name is required' }),
    createdAt: z.date({ required_error: 'Created date is required' }),
    updatedAt: z.date({ required_error: 'Updated date is required' }),
  }),
});

export const userLoginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email({ message: 'Invalid email format' }),
  password: z
    .string({ required_error: 'Password is required' })
    .min(1, { message: 'Password cannot be empty' }),
});

export const userRegistrationSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email({ message: 'Invalid email format' }),
  password: z
    .string({ required_error: 'Password is required' })
    .min(8, { message: 'Password must be at least 8 characters long' }),
  firstName: z
    .string({ required_error: 'First name is required' })
    .min(1, { message: 'First name cannot be empty' }),
  lastName: z
    .string({ required_error: 'Last name is required' })
    .min(1, { message: 'Last name cannot be empty' }),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string({ required_error: 'Current password is required' })
      .min(1, { message: 'Current password cannot be empty' }),
    newPassword: z
      .string({ required_error: 'New password is required' })
      .min(8, { message: 'New password must be at least 8 characters long' }),
    confirmPassword: z
      .string({ required_error: 'Password confirmation is required' })
      .min(8, {
        message: 'Password confirmation must be at least 8 characters long',
      }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const userQuerySchema = z.object({
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
  roleId: z.string().ulid({ message: 'Invalid role ID format' }).optional(),
  sortBy: z
    .enum(['createdAt', 'updatedAt', 'email', 'firstName', 'lastName'], {
      invalid_type_error: 'Invalid sort field',
    })
    .default('createdAt'),
  sortOrder: z
    .enum(['asc', 'desc'], {
      invalid_type_error: 'Sort order must be asc or desc',
    })
    .default('desc'),
});
