import { z } from 'zod';
import { productsRepository } from './products-repository';
import {
  createProductSchema,
  updateProductSchema,
  productQuerySchema,
} from './products-schema';
import { commonService } from '../iam/common/common-service';

const t = commonService().initTrpc();
const publicProcedure = t.procedure;
const router = t.router;

export const productsRouter = router({
  getAll: publicProcedure.input(productQuerySchema).query(async ({ input }) => {
    return await productsRepository().getAll(input);
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string().ulid() }))
    .query(async ({ input }) => {
      return await productsRepository().getById(input.id);
    }),

  getBySku: publicProcedure
    .input(z.object({ sku: z.string().min(1) }))
    .query(async ({ input }) => {
      return await productsRepository().getBySku(input.sku);
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string().min(1) }))
    .query(async ({ input }) => {
      return await productsRepository().getBySlug(input.slug);
    }),

  getByCreator: publicProcedure
    .input(
      z.object({
        createdBy: z.string().ulid(),
        query: productQuerySchema,
      })
    )
    .query(async ({ input }) => {
      return await productsRepository().getByCreator(
        input.createdBy,
        input.query
      );
    }),

  create: publicProcedure
    .input(createProductSchema)
    .mutation(async ({ input }) => {
      // Check if SKU already exists
      const existingSku = await productsRepository().existsBySku(input.sku);
      if (existingSku) {
        return { message: 'SKU already exists' };
      }

      // Check if slug already exists
      const existingSlug = await productsRepository().existsBySlug(input.slug);
      if (existingSlug) {
        return { message: 'Slug already exists' };
      }

      return await productsRepository().create(input);
    }),

  update: publicProcedure
    .input(updateProductSchema)
    .mutation(async ({ input }) => {
      // Check if product exists
      const productExists = await productsRepository().exists(input.id);
      if (!productExists) {
        return { message: 'Product not found' };
      }

      // Check if new SKU already exists (if SKU is being updated)
      if (input.sku) {
        const existingProduct = await productsRepository().getBySku(input.sku);
        if ('id' in existingProduct && existingProduct.id !== input.id) {
          return { message: 'SKU already exists' };
        }
      }

      // Check if new slug already exists (if slug is being updated)
      if (input.slug) {
        const existingProduct = await productsRepository().getBySlug(
          input.slug
        );
        if ('id' in existingProduct && existingProduct.id !== input.id) {
          return { message: 'Slug already exists' };
        }
      }

      return await productsRepository().update(input);
    }),

  partialUpdate: publicProcedure
    .input(
      z.object({
        id: z.string().ulid(),
        data: z.object({
          sku: z.string().min(1).max(50).optional(),
          slug: z
            .string()
            .min(1)
            .max(100)
            .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
            .optional(),
          name: z.string().min(1).max(200).optional(),
          description: z.string().min(1).optional(),
          price: z.number().positive().multipleOf(0.01).optional(),
          imageUrl: z.string().url().optional().nullable(),
          stockQuantity: z.number().int().min(0).optional(),
          minimumOrderQuantity: z.number().int().min(1).optional(),
        }),
      })
    )
    .mutation(async ({ input }) => {
      // Check if product exists
      const productExists = await productsRepository().exists(input.id);
      if (!productExists) {
        return { message: 'Product not found' };
      }

      // Check if new SKU already exists (if SKU is being updated)
      if (input.data.sku) {
        const existingProduct = await productsRepository().getBySku(
          input.data.sku
        );
        if ('id' in existingProduct && existingProduct.id !== input.id) {
          return { message: 'SKU already exists' };
        }
      }

      // Check if new slug already exists (if slug is being updated)
      if (input.data.slug) {
        const existingProduct = await productsRepository().getBySlug(
          input.data.slug
        );
        if ('id' in existingProduct && existingProduct.id !== input.id) {
          return { message: 'Slug already exists' };
        }
      }

      return await productsRepository().partialUpdate(input.id, input.data);
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string().ulid() }))
    .mutation(async ({ input }) => {
      return await productsRepository().delete(input.id);
    }),

  exists: publicProcedure
    .input(z.object({ id: z.string().ulid() }))
    .query(async ({ input }) => {
      return await productsRepository().exists(input.id);
    }),

  existsBySku: publicProcedure
    .input(z.object({ sku: z.string().min(1) }))
    .query(async ({ input }) => {
      return await productsRepository().existsBySku(input.sku);
    }),

  existsBySlug: publicProcedure
    .input(z.object({ slug: z.string().min(1) }))
    .query(async ({ input }) => {
      return await productsRepository().existsBySlug(input.slug);
    }),

  updateStock: publicProcedure
    .input(
      z.object({
        id: z.string().ulid(),
        stockQuantity: z.number().int().min(0),
      })
    )
    .mutation(async ({ input }) => {
      // Check if product exists
      const productExists = await productsRepository().exists(input.id);
      if (!productExists) {
        return { message: 'Product not found' };
      }

      return await productsRepository().updateStock(
        input.id,
        input.stockQuantity
      );
    }),
});

export type ProductsRouter = typeof productsRouter;

export const productsService = () => {
  return productsRepository();
};
