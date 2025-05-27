import { commonService } from '../iam/common/common-service';
import { TMetaRequest, TResponseList } from '../iam/common/common-dto';
import type {
  TRequestCreateProduct,
  TRequestUpdateProduct,
  TRequestPartialUpdateProduct,
  TRequestProductQuery,
  TProductItem,
  TResponseProduct,
  TResponseProductWithCreator,
} from './products-dto';

export const productsRepository = () => {
  return {
    getAll: async (
      query: TRequestProductQuery
    ): Promise<TResponseList<TResponseProductWithCreator>> => {
      const { prisma } = await import('@/shared/api/database');

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
        prisma.appProducts.findMany({
          where,
          skip,
          take,
          orderBy: { [sortBy]: sortOrder },
          include: {
            creator: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        }),
        prisma.appProducts.count({ where }),
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
            firstName: product.creator.firstName,
            lastName: product.creator.lastName,
          },
        })
      );

      return commonService().paginate(mappedProducts, total, metaRequest);
    },

    getById: async (
      id: string
    ): Promise<TResponseProductWithCreator | { message: string }> => {
      const { prisma } = await import('@/shared/api/database');

      const product = await prisma.appProducts.findUnique({
        where: { id },
        include: {
          creator: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
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
          firstName: product.creator.firstName,
          lastName: product.creator.lastName,
        },
      };
    },

    getBySku: async (
      sku: string
    ): Promise<TProductItem | { message: string }> => {
      const { prisma } = await import('@/shared/api/database');

      const product = await prisma.appProducts.findFirst({
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
      const { prisma } = await import('@/shared/api/database');

      const product = await prisma.appProducts.findFirst({
        where: { slug },
        include: {
          creator: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
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
          firstName: product.creator.firstName,
          lastName: product.creator.lastName,
        },
      };
    },

    create: async (data: TRequestCreateProduct): Promise<TResponseProduct> => {
      const { prisma } = await import('@/shared/api/database');

      const product = await prisma.appProducts.create({
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
        const { prisma } = await import('@/shared/api/database');

        const product = await prisma.appProducts.update({
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
      id: string,
      data: TRequestPartialUpdateProduct
    ): Promise<TResponseProduct | { message: string }> => {
      try {
        const { prisma } = await import('@/shared/api/database');

        const product = await prisma.appProducts.update({
          where: { id },
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
        const { prisma } = await import('@/shared/api/database');

        await prisma.appProducts.delete({
          where: { id },
        });
        return { message: 'Product deleted successfully' };
      } catch (error) {
        return { message: (error as Error).message };
      }
    },

    exists: async (id: string): Promise<boolean> => {
      const { prisma } = await import('@/shared/api/database');

      const product = await prisma.appProducts.findUnique({
        where: { id },
        select: { id: true },
      });
      return !!product;
    },

    existsBySku: async (sku: string): Promise<boolean> => {
      const { prisma } = await import('@/shared/api/database');

      const product = await prisma.appProducts.findFirst({
        where: { sku },
        select: { id: true },
      });
      return !!product;
    },

    existsBySlug: async (slug: string): Promise<boolean> => {
      const { prisma } = await import('@/shared/api/database');

      const product = await prisma.appProducts.findFirst({
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
        const { prisma } = await import('@/shared/api/database');

        await prisma.appProducts.update({
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
      const { prisma } = await import('@/shared/api/database');

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
        prisma.appProducts.findMany({
          where,
          skip,
          take,
          orderBy: { [sortBy]: sortOrder },
        }),
        prisma.appProducts.count({ where }),
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
