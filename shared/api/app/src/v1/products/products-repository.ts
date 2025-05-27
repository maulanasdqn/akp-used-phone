import { commonService } from '../common/common-service';
import { TMetaRequest, TResponseList } from '../common/common-dto';
import type {
  TRequestCreateProduct,
  TRequestUpdateProduct,
  TRequestPartialUpdateProduct,
  TRequestProductQuery,
  TProductItem,
  TResponseProduct,
  TResponseProductWithCreator,
} from './products-dto';
import { PrismaClient } from '@prisma/client';

export const productsRepository = (prisma: PrismaClient) => {
  return {
    getAll: async (
      query: TRequestProductQuery
    ): Promise<TResponseList<TResponseProductWithCreator>> => {
      const {
        search,
        createdBy,
        minPrice,
        maxPrice,
        inStock,
        sortBy,
        sortOrder,
      } = query;

      const metaRequest: TMetaRequest = {
        page: query.page,
        perPage: query.limit,
        search,
        sortBy,
        order: sortOrder,
      };

      const { skip, take } = commonService().getPaginationParams(metaRequest);

      const where = {
        ...(search && {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { description: { contains: search, mode: 'insensitive' as const } },
            { sku: { contains: search, mode: 'insensitive' as const } },
          ],
        }),
        ...(createdBy && { createdBy }),
        ...(minPrice && { price: { gte: minPrice } }),
        ...(maxPrice && { price: { lte: maxPrice } }),
        ...(minPrice &&
          maxPrice && { price: { gte: minPrice, lte: maxPrice } }),
        ...(inStock !== undefined && {
          stockQuantity: inStock ? { gt: 0 } : { equals: 0 },
        }),
      };

      const [products, total] = await Promise.all([
        prisma.product.findMany({
          where,
          skip,
          take,
          orderBy: { [sortBy]: sortOrder },
          include: {
            creator: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
        }),
        prisma.product.count({ where }),
      ]);

      const mappedProducts = products.map(
        (product): TResponseProductWithCreator => ({
          id: product.id,
          sku: product.sku,
          slug: product.slug,
          name: product.name,
          description: product.description,
          price: product.price.toNumber(),
          imageUrl: product.imageUrl,
          stockQuantity: product.stockQuantity,
          minimumOrderQuantity: product.minimumOrderQuantity,
          createdBy: product.createdBy,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
          creator: {
            id: product.creator.id,
            email: product.creator.email,
            name: product.creator.name,
          },
        })
      );

      return commonService().paginate(mappedProducts, total, metaRequest);
    },

    getById: async (
      id: string
    ): Promise<TResponseProductWithCreator | { message: string }> => {
      const product = await prisma.product.findUnique({
        where: { id },
        include: {
          creator: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
        },
      });

      if (!product) {
        return { message: 'Not Found' };
      }

      return {
        id: product.id,
        sku: product.sku,
        slug: product.slug,
        name: product.name,
        description: product.description,
        price: product.price.toNumber(),
        imageUrl: product.imageUrl,
        stockQuantity: product.stockQuantity,
        minimumOrderQuantity: product.minimumOrderQuantity,
        createdBy: product.createdBy,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        creator: {
          id: product.creator.id,
          email: product.creator.email,
          name: product.creator.name,
        },
      };
    },

    getBySku: async (
      sku: string
    ): Promise<TProductItem | { message: string }> => {
      const product = await prisma.product.findFirst({
        where: { sku },
      });

      if (!product) {
        return { message: 'Not Found' };
      }

      return {
        id: product.id,
        sku: product.sku,
        slug: product.slug,
        name: product.name,
        description: product.description,
        price: product.price.toNumber(),
        imageUrl: product.imageUrl,
        stockQuantity: product.stockQuantity,
        minimumOrderQuantity: product.minimumOrderQuantity,
        createdBy: product.createdBy,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      };
    },

    getBySlug: async (
      slug: string
    ): Promise<TResponseProductWithCreator | { message: string }> => {
      const product = await prisma.product.findFirst({
        where: { slug },
        include: {
          creator: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
        },
      });

      if (!product) {
        return { message: 'Not Found' };
      }

      return {
        id: product.id,
        sku: product.sku,
        slug: product.slug,
        name: product.name,
        description: product.description,
        price: product.price.toNumber(),
        imageUrl: product.imageUrl,
        stockQuantity: product.stockQuantity,
        minimumOrderQuantity: product.minimumOrderQuantity,
        createdBy: product.createdBy,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        creator: {
          id: product.creator.id,
          email: product.creator.email,
          name: product.creator.name,
        },
      };
    },

    create: async (data: TRequestCreateProduct): Promise<TResponseProduct> => {
      const product = await prisma.product.create({
        data: {
          sku: data.sku,
          slug: data.slug,
          name: data.name,
          description: data.description,
          price: data.price,
          imageUrl: data.imageUrl,
          stockQuantity: data.stockQuantity,
          minimumOrderQuantity: data.minimumOrderQuantity,
          createdBy: data.createdBy,
        },
      });

      return {
        id: product.id,
        sku: product.sku,
        slug: product.slug,
        name: product.name,
        description: product.description,
        price: product.price.toNumber(),
        imageUrl: product.imageUrl,
        stockQuantity: product.stockQuantity,
        minimumOrderQuantity: product.minimumOrderQuantity,
        createdBy: product.createdBy,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      };
    },

    update: async (
      data: TRequestUpdateProduct
    ): Promise<TResponseProduct | { message: string }> => {
      try {
        const product = await prisma.product.update({
          where: { id: data.id },
          data: {
            ...(data.sku && { sku: data.sku }),
            ...(data.slug && { slug: data.slug }),
            ...(data.name && { name: data.name }),
            ...(data.description && { description: data.description }),
            ...(data.price !== undefined && { price: data.price }),
            ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl }),
            ...(data.stockQuantity !== undefined && {
              stockQuantity: data.stockQuantity,
            }),
            ...(data.minimumOrderQuantity !== undefined && {
              minimumOrderQuantity: data.minimumOrderQuantity,
            }),
          },
        });

        return {
          id: product.id,
          sku: product.sku,
          slug: product.slug,
          name: product.name,
          description: product.description,
          price: product.price.toNumber(),
          imageUrl: product.imageUrl,
          stockQuantity: product.stockQuantity,
          minimumOrderQuantity: product.minimumOrderQuantity,
          createdBy: product.createdBy,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
        };
      } catch (error) {
        return { message: (error as Error).message };
      }
    },

    partialUpdate: async (
      data: TRequestPartialUpdateProduct
    ): Promise<TResponseProduct | { message: string }> => {
      try {
        const product = await prisma.product.update({
          where: { id: data.id },
          data: {
            ...(data.sku && { sku: data.sku }),
            ...(data.slug && { slug: data.slug }),
            ...(data.name && { name: data.name }),
            ...(data.description && { description: data.description }),
            ...(data.price !== undefined && { price: data.price }),
            ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl }),
            ...(data.stockQuantity !== undefined && {
              stockQuantity: data.stockQuantity,
            }),
            ...(data.minimumOrderQuantity !== undefined && {
              minimumOrderQuantity: data.minimumOrderQuantity,
            }),
          },
        });

        return {
          id: product.id,
          sku: product.sku,
          slug: product.slug,
          name: product.name,
          description: product.description,
          price: product.price.toNumber(),
          imageUrl: product.imageUrl,
          stockQuantity: product.stockQuantity,
          minimumOrderQuantity: product.minimumOrderQuantity,
          createdBy: product.createdBy,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
        };
      } catch (error) {
        return { message: (error as Error).message };
      }
    },

    delete: async (id: string): Promise<{ message: string }> => {
      try {
        await prisma.product.delete({
          where: { id },
        });
        return { message: 'Product deleted successfully' };
      } catch (error) {
        return { message: (error as Error).message };
      }
    },

    exists: async (id: string): Promise<boolean> => {
      const product = await prisma.product.findUnique({
        where: { id },
        select: { id: true },
      });
      return !!product;
    },

    existsBySku: async (sku: string): Promise<boolean> => {
      const product = await prisma.product.findFirst({
        where: { sku },
        select: { id: true },
      });
      return !!product;
    },

    existsBySlug: async (slug: string): Promise<boolean> => {
      const product = await prisma.product.findFirst({
        where: { slug },
        select: { id: true },
      });
      return !!product;
    },

    updateStock: async (
      id: string,
      stockQuantity: number
    ): Promise<{ message: string }> => {
      try {
        await prisma.product.update({
          where: { id },
          data: { stockQuantity },
        });
        return { message: 'Stock updated successfully' };
      } catch (error) {
        return { message: (error as Error).message };
      }
    },

    getByCreator: async (
      createdBy: string,
      query: TRequestProductQuery
    ): Promise<TResponseList<TResponseProduct>> => {
      const { search, sortBy, sortOrder } = query;

      const metaRequest: TMetaRequest = {
        page: query.page,
        perPage: query.limit,
        search,
        sortBy,
        order: sortOrder,
      };

      const { skip, take } = commonService().getPaginationParams(metaRequest);

      const where = {
        createdBy,
        ...(search && {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { description: { contains: search, mode: 'insensitive' as const } },
            { sku: { contains: search, mode: 'insensitive' as const } },
          ],
        }),
      };

      const [products, total] = await Promise.all([
        prisma.product.findMany({
          where,
          skip,
          take,
          orderBy: { [sortBy]: sortOrder },
        }),
        prisma.product.count({ where }),
      ]);

      const mappedProducts = products.map(
        (product): TResponseProduct => ({
          id: product.id,
          sku: product.sku,
          slug: product.slug,
          name: product.name,
          description: product.description,
          price: product.price.toNumber(),
          imageUrl: product.imageUrl,
          stockQuantity: product.stockQuantity,
          minimumOrderQuantity: product.minimumOrderQuantity,
          createdBy: product.createdBy,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
        })
      );

      return commonService().paginate(mappedProducts, total, metaRequest);
    },
  };
};
