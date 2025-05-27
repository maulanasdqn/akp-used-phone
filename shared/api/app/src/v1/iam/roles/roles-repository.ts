import { commonService } from '../common/common-service';
import { TMetaRequest, TResponseList } from '../common/common-dto';
import type {
  TRequestCreateRole,
  TRequestUpdateRole,
  TRequestPartialUpdateRole,
  TRequestRoleQuery,
  TRoleItem,
  TResponseRole,
} from './roles-dto';

export const rolesRepository = () => {
  return {
    getAll: async (
      query: TRequestRoleQuery
    ): Promise<TResponseList<TResponseRole>> => {
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
        ...(search && {
          name: { contains: search, mode: 'insensitive' as const },
        }),
      };

      const [roles, total] = await Promise.all([
        prisma.appRoles.findMany({
          where,
          skip,
          take,
          orderBy: { [sortBy]: sortOrder },
        }),
        prisma.appRoles.count({ where }),
      ]);

      const mappedRoles = roles.map(
        (role): TResponseRole => ({
          id: role.id,
          name: role.name,
          createdAt: role.createdAt,
          updatedAt: role.updatedAt,
        })
      );

      return commonService().paginate(mappedRoles, total, metaRequest);
    },

    getById: async (
      id: string
    ): Promise<TResponseRole | { message: string }> => {
      const { prisma } = await import('@/shared/api/database');
      const role = await prisma.appRoles.findUnique({
        where: { id },
      });

      if (!role) {
        return { message: 'Not Found' };
      }

      return {
        id: role.id,
        name: role.name,
        createdAt: role.createdAt,
        updatedAt: role.updatedAt,
      };
    },

    getByName: async (
      name: string
    ): Promise<TRoleItem | { message: string }> => {
      const { prisma } = await import('@/shared/api/database');
      const role = await prisma.appRoles.findFirst({
        where: { name },
      });

      if (!role) {
        return { message: 'Not Found' };
      }

      return {
        id: role.id,
        name: role.name,
        createdAt: role.createdAt,
        updatedAt: role.updatedAt,
      };
    },

    create: async (data: TRequestCreateRole): Promise<TResponseRole> => {
      const { prisma } = await import('@/shared/api/database');
      const role = await prisma.appRoles.create({
        data: {
          name: data.name,
        },
      });

      return {
        id: role.id,
        name: role.name,
        createdAt: role.createdAt,
        updatedAt: role.updatedAt,
      };
    },

    update: async (
      data: TRequestUpdateRole
    ): Promise<TResponseRole | { message: string }> => {
      try {
        const { prisma } = await import('@/shared/api/database');
        const role = await prisma.appRoles.update({
          where: { id: data.id },
          data: {
            ...(data.name && { name: data.name }),
          },
        });

        return {
          id: role.id,
          name: role.name,
          createdAt: role.createdAt,
          updatedAt: role.updatedAt,
        };
      } catch (error) {
        return { message: (error as Error).message };
      }
    },

    partialUpdate: async (
      id: string,
      data: TRequestPartialUpdateRole
    ): Promise<TResponseRole | { message: string }> => {
      try {
        const { prisma } = await import('@/shared/api/database');
        const role = await prisma.appRoles.update({
          where: { id },
          data: {
            ...(data.name && { name: data.name }),
          },
        });

        return {
          id: role.id,
          name: role.name,
          createdAt: role.createdAt,
          updatedAt: role.updatedAt,
        };
      } catch (error) {
        return { message: (error as Error).message };
      }
    },

    delete: async (id: string): Promise<{ message: string }> => {
      try {
        const { prisma } = await import('@/shared/api/database');
        // Check if role is being used by any users
        const usersWithRole = await prisma.appUsers.count({
          where: { roleId: id },
        });

        if (usersWithRole > 0) {
          return {
            message: `Cannot delete role. It is currently assigned to ${usersWithRole} user(s).`,
          };
        }

        await prisma.appRoles.delete({
          where: { id },
        });
        return { message: 'Role deleted successfully' };
      } catch (error) {
        return { message: (error as Error).message };
      }
    },

    exists: async (id: string): Promise<boolean> => {
      const { prisma } = await import('@/shared/api/database');
      const role = await prisma.appRoles.findUnique({
        where: { id },
        select: { id: true },
      });
      return !!role;
    },

    existsByName: async (name: string): Promise<boolean> => {
      const { prisma } = await import('@/shared/api/database');
      const role = await prisma.appRoles.findFirst({
        where: { name },
        select: { id: true },
      });
      return !!role;
    },

    getUsersCount: async (id: string): Promise<number> => {
      const { prisma } = await import('@/shared/api/database');
      return await prisma.appUsers.count({
        where: { roleId: id },
      });
    },
  };
};
