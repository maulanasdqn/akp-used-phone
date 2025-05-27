import { commonService } from '../../common/common-service';
import { TMetaRequest, TResponseList } from '../../common/common-dto';
import type {
  TRequestCreateRole,
  TRequestUpdateRole,
  TRequestPartialUpdateRole,
  TRequestRoleQuery,
  TRoleItem,
  TResponseRole,
} from './roles-dto';
import { PrismaClient } from '@prisma/client';

export const rolesRepository = (prisma: PrismaClient) => {
  return {
    getAll: async (
      query: TRequestRoleQuery
    ): Promise<TResponseList<TResponseRole>> => {
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
        prisma.role.findMany({
          where,
          skip,
          take,
          orderBy: { [sortBy]: sortOrder },
        }),
        prisma.role.count({ where }),
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
      const role = await prisma.role.findUnique({
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
      const role = await prisma.role.findFirst({
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
      const role = await prisma.role.create({
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
        const role = await prisma.role.update({
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
        const role = await prisma.role.update({
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
        const usersWithRole = await prisma.user.count({
          where: { roleId: id },
        });

        if (usersWithRole > 0) {
          return {
            message: `Cannot delete role. It is currently assigned to ${usersWithRole} user(s).`,
          };
        }

        await prisma.role.delete({
          where: { id },
        });
        return { message: 'Role deleted successfully' };
      } catch (error) {
        return { message: (error as Error).message };
      }
    },

    exists: async (id: string): Promise<boolean> => {
      const role = await prisma.role.findUnique({
        where: { id },
        select: { id: true },
      });
      return !!role;
    },

    existsByName: async (name: string): Promise<boolean> => {
      const role = await prisma.role.findFirst({
        where: { name },
        select: { id: true },
      });
      return !!role;
    },

    getUsersCount: async (id: string): Promise<number> => {
      return await prisma.user.count({
        where: { roleId: id },
      });
    },
  };
};
