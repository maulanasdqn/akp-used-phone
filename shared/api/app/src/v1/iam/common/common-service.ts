import { TMetaRequest, TResponseList } from './common-dto';
import { initTRPC } from '@trpc/server';

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

    initTrpc: () => {
      type Context = {
        prisma: any;
      };
      const t = initTRPC.context<Context>().create();
      return t;
    },

    prisma: async () => {
      const { prisma } = await import('@/shared/api/database');
      return prisma;
    },
  };
};
