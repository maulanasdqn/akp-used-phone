/**
 * User Management Service
 *
 * This service provides tRPC procedures for user management operations.
 * All procedures use the users repository for database interactions.
 *
 * Features:
 * - CRUD operations for users
 * - Input validation with Zod schemas
 * - Type-safe database operations
 * - Error handling and response formatting
 */

import { z } from 'zod';
import { usersRepository } from './users-repository';
import {
  createUserSchema,
  updateUserSchema,
  userQuerySchema,
} from './users-schema';
import { publicProcedure } from '@/shared/api/utils';

export const usersService = {
  /**
   * Get all users with optional filtering and pagination
   *
   * @param input - Query parameters for filtering and pagination
   * @returns Promise<User[]> - Array of users matching the criteria
   *
   * Supports:
   * - Pagination with limit/offset
   * - Filtering by role, email, name
   * - Sorting by various fields
   * - Search functionality
   */
  getAll: publicProcedure
    .input(userQuerySchema)
    .query(async ({ input, ctx }) => {
      return await usersRepository(ctx.prisma).getAll(input);
    }),

  /**
   * Get a single user by their ULID
   *
   * @param input - Object containing the user ID
   * @returns Promise<User | null> - User object or null if not found
   *
   * Used for:
   * - User profile pages
   * - Admin user management
   * - Permission checking
   */
  getById: publicProcedure
    .input(z.object({ id: z.string().ulid() }))
    .query(async ({ input, ctx }) => {
      return await usersRepository(ctx.prisma).getById(input.id);
    }),

  /**
   * Get a user by their email address
   *
   * @param input - Object containing the email
   * @returns Promise<User | null> - User object or null if not found
   *
   * Used for:
   * - Authentication flows
   * - Email uniqueness validation
   * - Password reset functionality
   */
  getByEmail: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ input, ctx }) => {
      return await usersRepository(ctx.prisma).getByEmail(input.email);
    }),

  /**
   * Create a new user
   *
   * @param input - User creation data (name, email, role, etc.)
   * @returns Promise<User> - Created user object
   *
   * Validation includes:
   * - Email format and uniqueness
   * - Required fields (name, email)
   * - Role assignment validation
   * - Password strength requirements (if provided)
   */
  create: publicProcedure
    .input(createUserSchema)
    .mutation(async ({ input, ctx }) => {
      return await usersRepository(ctx.prisma).create({
        ...input,
      });
    }),

  /**
   * Update an existing user
   *
   * @param input - User update data with ID
   * @returns Promise<User> - Updated user object
   *
   * Features:
   * - Partial updates (only provided fields are updated)
   * - Password hashing if password is provided
   * - Email uniqueness validation
   * - Role change validation
   *
   * Note: Password handling is currently incomplete in this implementation
   * TODO: Implement proper password hashing and validation
   */
  update: publicProcedure
    .input(updateUserSchema)
    .mutation(async ({ input, ctx }) => {
      const updateData = { ...input };

      // TODO: Implement password hashing logic
      if (input.password) {
        const currentUser = await usersRepository(ctx.prisma).getByEmail(
          input.email ?? ''
        );
        if ('message' in currentUser) {
          return { message: 'User not found' };
        }
        // Password hashing should be implemented here
      }

      return await usersRepository(ctx.prisma).update(updateData);
    }),

  /**
   * Soft delete a user
   *
   * @param input - Object containing the user ID
   * @returns Promise<User> - Updated user object with isDeleted flag set
   *
   * Soft deletion:
   * - Sets isDeleted flag to true
   * - Preserves user data for audit purposes
   * - Maintains referential integrity
   * - Allows for data recovery if needed
   *
   * The user will no longer appear in normal queries but
   * remains in the database for compliance and audit trails.
   */
  delete: publicProcedure
    .input(z.object({ id: z.string().ulid() }))
    .mutation(async ({ input, ctx }) => {
      return await usersRepository(ctx.prisma).delete(input.id);
    }),
};

/**
 * Type definition for the users service router
 *
 * This type is used by tRPC to generate type-safe client code
 * and ensure consistency between server and client implementations.
 */
export type UsersRouter = typeof usersService;
