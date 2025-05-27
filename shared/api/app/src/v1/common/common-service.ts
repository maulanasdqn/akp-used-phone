import { TMetaRequest, TResponseList } from './common-dto';
import { createTRPCInstance } from '@/shared/api/utils';

export const commonService = () => {
  return {
    paginate: <T>(
      data: T[],
      total: number,
      request: TMetaRequest
    ): TResponseList<T> => {
      const page = request.page ?? 1;
      const perPage = request.perPage ?? 10;

      return {
        data,
        meta: {
          page,
          perPage,
          total,
        },
      };
    },

    getPaginationParams: (request: TMetaRequest) => {
      const page = request.page ?? 1;
      const perPage = request.perPage ?? 10;
      const skip = (page - 1) * perPage;

      return {
        skip,
        take: perPage,
        page,
        perPage,
      };
    },

    prisma: async () => {
      const { prisma } = await import('@/shared/api/database');
      return prisma;
    },
  };
};
