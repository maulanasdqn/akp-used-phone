import { commonService } from '../../common/common-service';
import { TMetaRequest, TResponseList } from '../../common/common-dto';
import type {
  TRequestCreatePermission,
  TRequestUpdatePermission,
  TRequestPartialUpdatePermission,
  TRequestPermissionQuery,
  TPermissionItem,
  TResponsePermission,
} from './permissions-dto';
import { PrismaClient } from '@prisma/client';

export const permissionsRepository = (prisma: PrismaClient) => {
  return {
    getAll: async (
      query: TRequestPermissionQuery
    ): Promise<TResponseList<TResponsePermission>> => {
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
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { permission: { contains: search, mode: 'insensitive' as const } },
          ],
        }),
      };

      const [permissions, total] = await Promise.all([
        prisma.permission.findMany({
          where,
          skip,
          take,
          orderBy: { [sortBy]: sortOrder },
        }),
        prisma.permission.count({ where }),
      ]);

      const mappedPermissions = permissions.map(
        (permission): TResponsePermission => ({
          id: permission.id,
          name: permission.name,
          createdAt: permission.createdAt,
          updatedAt: permission.updatedAt,
        })
      );

      return commonService().paginate(mappedPermissions, total, metaRequest);
    },

    getById: async (
      id: string
    ): Promise<TResponsePermission | { message: string }> => {
      const permission = await prisma.permission.findUnique({
        where: { id },
      });

      if (!permission) {
        return { message: 'Not Found' };
      }

      return {
        id: permission.id,
        name: permission.name,

        createdAt: permission.createdAt,
        updatedAt: permission.updatedAt,
      };
    },

    getByName: async (
      name: string
    ): Promise<TPermissionItem | { message: string }> => {
      const permission = await prisma.permission.findFirst({
        where: { name },
      });

      if (!permission) {
        return { message: 'Not Found' };
      }

      return {
        id: permission.id,
        name: permission.name,

        createdAt: permission.createdAt,
        updatedAt: permission.updatedAt,
      };
    },

    create: async (
      data: TRequestCreatePermission
    ): Promise<TResponsePermission> => {
      const permission = await prisma.permission.create({
        data: {
          name: data.name,
        },
      });

      return {
        id: permission.id,
        name: permission.name,
        createdAt: permission.createdAt,
        updatedAt: permission.updatedAt,
      };
    },

    update: async (
      data: TRequestUpdatePermission
    ): Promise<TResponsePermission | { message: string }> => {
      try {
        const permission = await prisma.permission.update({
          where: { id: data.id },
          data: {
            ...(data.name && { name: data.name }),
          },
        });

        return {
          id: permission.id,
          name: permission.name,

          createdAt: permission.createdAt,
          updatedAt: permission.updatedAt,
        };
      } catch (error) {
        return { message: (error as Error).message };
      }
    },

    partialUpdate: async (
      id: string,
      data: TRequestPartialUpdatePermission
    ): Promise<TResponsePermission | { message: string }> => {
      try {
        const permission = await prisma.permission.update({
          where: { id },
          data: {
            ...(data.name && { name: data.name }),
          },
        });

        return {
          id: permission.id,
          name: permission.name,

          createdAt: permission.createdAt,
          updatedAt: permission.updatedAt,
        };
      } catch (error) {
        return { message: (error as Error).message };
      }
    },

    delete: async (id: string): Promise<{ message: string }> => {
      try {
        const rolesWithPermission = await prisma.rolePermission.count({
          where: { permissionId: id },
        });

        if (rolesWithPermission > 0) {
          return {
            message: `Cannot delete permission. It is currently assigned to ${rolesWithPermission} role(s).`,
          };
        }

        await prisma.permission.delete({
          where: { id },
        });
        return { message: 'Permission deleted successfully' };
      } catch (error) {
        return { message: (error as Error).message };
      }
    },

    exists: async (id: string): Promise<boolean> => {
      const permission = await prisma.permission.findUnique({
        where: { id },
        select: { id: true },
      });
      return !!permission;
    },

    existsByName: async (name: string): Promise<boolean> => {
      const permission = await prisma.permission.findFirst({
        where: { name },
        select: { id: true },
      });
      return !!permission;
    },

    getRolesCount: async (id: string): Promise<number> => {
      return await prisma.rolePermission.count({
        where: { permissionId: id },
      });
    },
  };
};
