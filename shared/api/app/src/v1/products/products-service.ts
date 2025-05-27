import { z } from 'zod';
import { productsRepository } from './products-repository';
import {
  createProductSchema,
  updateProductSchema,
  productQuerySchema,
  partialUpdateProductSchema,
} from './products-schema';
import { protectedProcedure, publicProcedure } from '@/shared/api/utils';

export const productsService = {
  getAll: publicProcedure
    .input(productQuerySchema)
    .query(async ({ input, ctx }) => {
      return await productsRepository(ctx.prisma).getAll(input);
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string().ulid() }))
    .query(async ({ input, ctx }) => {
      return await productsRepository(ctx.prisma).getById(input.id);
    }),

  getBySku: publicProcedure
    .input(z.object({ sku: z.string().min(1) }))
    .query(async ({ input, ctx }) => {
      return await productsRepository(ctx.prisma).getBySku(input.sku);
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string().min(1) }))
    .query(async ({ input, ctx }) => {
      return await productsRepository(ctx.prisma).getBySlug(input.slug);
    }),

  getByCreator: publicProcedure
    .input(
      z.object({
        createdBy: z.string().ulid(),
        query: productQuerySchema,
      })
    )
    .query(async ({ input, ctx }) => {
      return await productsRepository(ctx.prisma).getByCreator(
        input.createdBy,
        input.query
      );
    }),

  create: protectedProcedure
    .input(createProductSchema)
    .mutation(async ({ input, ctx }) => {
      const existingSku = await productsRepository(ctx.prisma).existsBySku(
        input.sku
      );
      if (existingSku) {
        return { message: 'SKU already exists' };
      }
      const existingSlug = await productsRepository(ctx.prisma).existsBySlug(
        input.slug
      );
      if (existingSlug) {
        return { message: 'Slug already exists' };
      }
      return await productsRepository(ctx.prisma).create(input);
    }),

  update: protectedProcedure
    .input(updateProductSchema)
    .mutation(async ({ input, ctx }) => {
      const productExists = await productsRepository(ctx.prisma).exists(
        input.id
      );
      if (!productExists) {
        return { message: 'Product not found' };
      }
      if (input.sku) {
        const existingProduct = await productsRepository(ctx.prisma).getBySku(
          input.sku
        );
        if ('id' in existingProduct && existingProduct.id !== input.id) {
          return { message: 'SKU already exists' };
        }
      }
      if (input.slug) {
        const existingProduct = await productsRepository(ctx.prisma).getBySlug(
          input.slug
        );
        if ('id' in existingProduct && existingProduct.id !== input.id) {
          return { message: 'Slug already exists' };
        }
      }
      return await productsRepository(ctx.prisma).update(input);
    }),

  partialUpdate: protectedProcedure
    .input(partialUpdateProductSchema)
    .mutation(async ({ input, ctx }) => {
      const productExists = await productsRepository(ctx.prisma).exists(
        input.id
      );
      if (!productExists) {
        return { message: 'Product not found' };
      }
      if (input.sku) {
        const existingProduct = await productsRepository(ctx.prisma).getBySku(
          input.sku
        );
        if ('id' in existingProduct && existingProduct.id !== input.id) {
          return { message: 'SKU already exists' };
        }
      }
      if (input.slug) {
        const existingProduct = await productsRepository(ctx.prisma).getBySlug(
          input.slug
        );
        if ('id' in existingProduct && existingProduct.id !== input.id) {
          return { message: 'Slug already exists' };
        }
      }
      return await productsRepository(ctx.prisma).partialUpdate(input);
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().ulid() }))
    .mutation(async ({ input, ctx }) => {
      return await productsRepository(ctx.prisma).delete(input.id);
    }),

  exists: protectedProcedure
    .input(z.object({ id: z.string().ulid() }))
    .query(async ({ input, ctx }) => {
      return await productsRepository(ctx.prisma).exists(input.id);
    }),

  existsBySku: protectedProcedure
    .input(z.object({ sku: z.string().min(1) }))
    .query(async ({ input, ctx }) => {
      return await productsRepository(ctx.prisma).existsBySku(input.sku);
    }),

  existsBySlug: protectedProcedure
    .input(z.object({ slug: z.string().min(1) }))
    .query(async ({ input, ctx }) => {
      return await productsRepository(ctx.prisma).existsBySlug(input.slug);
    }),

  updateStock: protectedProcedure
    .input(
      z.object({
        id: z.string().ulid(),
        stockQuantity: z.number().int().min(0),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const productExists = await productsRepository(ctx.prisma).exists(
        input.id
      );
      if (!productExists) {
        return { message: 'Product not found' };
      }
      return await productsRepository(ctx.prisma).updateStock(
        input.id,
        input.stockQuantity
      );
    }),
};

export type ProductsRouter = typeof productsService;
