import { z } from 'zod';

export const productSchema = z.object({
  id: z
    .string({ required_error: 'Product ID is required' })
    .ulid({ message: 'Invalid product ID format' }),
  sku: z
    .string({ required_error: 'SKU is required' })
    .min(1, { message: 'SKU cannot be empty' })
    .max(50, { message: 'SKU cannot exceed 50 characters' }),
  slug: z
    .string({ required_error: 'Slug is required' })
    .min(1, { message: 'Slug cannot be empty' })
    .max(100, { message: 'Slug cannot exceed 100 characters' })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: 'Invalid slug format' }),
  name: z
    .string({ required_error: 'Product name is required' })
    .min(1, { message: 'Product name cannot be empty' })
    .max(200, { message: 'Product name cannot exceed 200 characters' }),
  description: z
    .string({ required_error: 'Description is required' })
    .min(1, { message: 'Description cannot be empty' }),
  price: z
    .number({ required_error: 'Price is required' })
    .positive({ message: 'Price must be positive' })
    .multipleOf(0.01, { message: 'Price must have at most 2 decimal places' }),
  imageUrl: z
    .string()
    .url({ message: 'Invalid image URL format' })
    .optional()
    .nullable(),
  stockQuantity: z
    .number({ required_error: 'Stock quantity is required' })
    .int({ message: 'Stock quantity must be an integer' })
    .min(0, { message: 'Stock quantity cannot be negative' }),
  minimumOrderQuantity: z
    .number({ required_error: 'Minimum order quantity is required' })
    .int({ message: 'Minimum order quantity must be an integer' })
    .min(1, { message: 'Minimum order quantity must be at least 1' }),
  createdBy: z
    .string({ required_error: 'Created by is required' })
    .ulid({ message: 'Invalid creator ID format' }),
  createdAt: z.date({ required_error: 'Created date is required' }),
  updatedAt: z.date({ required_error: 'Updated date is required' }),
});

export const createProductSchema = z.object({
  sku: z
    .string({ required_error: 'SKU is required' })
    .min(1, { message: 'SKU cannot be empty' })
    .max(50, { message: 'SKU cannot exceed 50 characters' }),
  slug: z
    .string({ required_error: 'Slug is required' })
    .min(1, { message: 'Slug cannot be empty' })
    .max(100, { message: 'Slug cannot exceed 100 characters' })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: 'Invalid slug format' }),
  name: z
    .string({ required_error: 'Product name is required' })
    .min(1, { message: 'Product name cannot be empty' })
    .max(200, { message: 'Product name cannot exceed 200 characters' }),
  description: z
    .string({ required_error: 'Description is required' })
    .min(1, { message: 'Description cannot be empty' }),
  price: z
    .number({ required_error: 'Price is required' })
    .positive({ message: 'Price must be positive' })
    .multipleOf(0.01, { message: 'Price must have at most 2 decimal places' }),
  imageUrl: z
    .string()
    .url({ message: 'Invalid image URL format' })
    .optional()
    .nullable(),
  stockQuantity: z
    .number({ required_error: 'Stock quantity is required' })
    .int({ message: 'Stock quantity must be an integer' })
    .min(0, { message: 'Stock quantity cannot be negative' }),
  minimumOrderQuantity: z
    .number({ required_error: 'Minimum order quantity is required' })
    .int({ message: 'Minimum order quantity must be an integer' })
    .min(1, { message: 'Minimum order quantity must be at least 1' }),
  createdBy: z
    .string({ required_error: 'Created by is required' })
    .ulid({ message: 'Invalid creator ID format' }),
});

export const updateProductSchema = z.object({
  id: z
    .string({ required_error: 'Product ID is required' })
    .ulid({ message: 'Invalid product ID format' }),
  sku: z
    .string()
    .min(1, { message: 'SKU cannot be empty' })
    .max(50, { message: 'SKU cannot exceed 50 characters' })
    .optional(),
  slug: z
    .string()
    .min(1, { message: 'Slug cannot be empty' })
    .max(100, { message: 'Slug cannot exceed 100 characters' })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: 'Invalid slug format' })
    .optional(),
  name: z
    .string()
    .min(1, { message: 'Product name cannot be empty' })
    .max(200, { message: 'Product name cannot exceed 200 characters' })
    .optional(),
  description: z
    .string()
    .min(1, { message: 'Description cannot be empty' })
    .optional(),
  price: z
    .number()
    .positive({ message: 'Price must be positive' })
    .multipleOf(0.01, { message: 'Price must have at most 2 decimal places' })
    .optional(),
  imageUrl: z
    .string()
    .url({ message: 'Invalid image URL format' })
    .optional()
    .nullable(),
  stockQuantity: z
    .number()
    .int({ message: 'Stock quantity must be an integer' })
    .min(0, { message: 'Stock quantity cannot be negative' })
    .optional(),
  minimumOrderQuantity: z
    .number()
    .int({ message: 'Minimum order quantity must be an integer' })
    .min(1, { message: 'Minimum order quantity must be at least 1' })
    .optional(),
});

export const partialUpdateProductSchema = z.object({
  id: z
    .string({ required_error: 'Product ID is required' })
    .ulid({ message: 'Invalid product ID format' }),
  sku: z
    .string()
    .min(1, { message: 'SKU cannot be empty' })
    .max(50, { message: 'SKU cannot exceed 50 characters' })
    .optional(),
  slug: z
    .string()
    .min(1, { message: 'Slug cannot be empty' })
    .max(100, { message: 'Slug cannot exceed 100 characters' })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: 'Invalid slug format' })
    .optional(),
  name: z
    .string()
    .min(1, { message: 'Product name cannot be empty' })
    .max(200, { message: 'Product name cannot exceed 200 characters' })
    .optional(),
  description: z
    .string()
    .min(1, { message: 'Description cannot be empty' })
    .optional(),
  price: z
    .number()
    .positive({ message: 'Price must be positive' })
    .multipleOf(0.01, { message: 'Price must have at most 2 decimal places' })
    .optional(),
  imageUrl: z
    .string()
    .url({ message: 'Invalid image URL format' })
    .optional()
    .nullable(),
  stockQuantity: z
    .number()
    .int({ message: 'Stock quantity must be an integer' })
    .min(0, { message: 'Stock quantity cannot be negative' })
    .optional(),
  minimumOrderQuantity: z
    .number()
    .int({ message: 'Minimum order quantity must be an integer' })
    .min(1, { message: 'Minimum order quantity must be at least 1' })
    .optional(),
});

export const productResponseSchema = z.object({
  id: z
    .string({ required_error: 'Product ID is required' })
    .ulid({ message: 'Invalid product ID format' }),
  sku: z.string({ required_error: 'SKU is required' }),
  slug: z.string({ required_error: 'Slug is required' }),
  name: z.string({ required_error: 'Product name is required' }),
  description: z.string({ required_error: 'Description is required' }),
  price: z.number({ required_error: 'Price is required' }),
  imageUrl: z.string().nullable(),
  stockQuantity: z.number({ required_error: 'Stock quantity is required' }),
  minimumOrderQuantity: z.number({
    required_error: 'Minimum order quantity is required',
  }),
  createdBy: z.string({ required_error: 'Created by is required' }),
  createdAt: z.date({ required_error: 'Created date is required' }),
  updatedAt: z.date({ required_error: 'Updated date is required' }),
});

export const productWithCreatorSchema = productResponseSchema.extend({
  creator: z.object({
    id: z.string({ required_error: 'Creator ID is required' }),
    email: z.string({ required_error: 'Creator email is required' }),
    name: z.string({ required_error: 'Creator name is required' }),
  }),
});

export const productQuerySchema = z.object({
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
  createdBy: z
    .string()
    .ulid({ message: 'Invalid creator ID format' })
    .optional(),
  minPrice: z.coerce.number().positive().optional(),
  maxPrice: z.coerce.number().positive().optional(),
  inStock: z.coerce.boolean().optional(),
  sortBy: z
    .enum(['createdAt', 'updatedAt', 'name', 'price', 'stockQuantity'], {
      invalid_type_error: 'Invalid sort field',
    })
    .default('createdAt'),
  sortOrder: z
    .enum(['asc', 'desc'], {
      invalid_type_error: 'Sort order must be asc or desc',
    })
    .default('desc'),
});
