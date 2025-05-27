import z from 'zod';
import {
  productSchema,
  createProductSchema,
  updateProductSchema,
  partialUpdateProductSchema,
  productResponseSchema,
  productWithCreatorSchema,
  productQuerySchema,
} from './products-schema';

export type TProductItem = z.infer<typeof productSchema>;
export type TRequestCreateProduct = z.infer<typeof createProductSchema>;
export type TRequestUpdateProduct = z.infer<typeof updateProductSchema>;
export type TRequestPartialUpdateProduct = z.infer<
  typeof partialUpdateProductSchema
>;
export type TResponseProduct = z.infer<typeof productResponseSchema>;
export type TResponseProductWithCreator = z.infer<
  typeof productWithCreatorSchema
>;
export type TRequestProductQuery = z.infer<typeof productQuerySchema>;
