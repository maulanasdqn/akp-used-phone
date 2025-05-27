import { commonService } from '../common/common-service';
import { TMetaRequest, TResponseList } from '../common/common-dto';
import type {
  TRequestCreatePermission,
  TRequestUpdatePermission,
  TRequestPartialUpdatePermission,
  TRequestPermissionQuery,
  TPermissionItem,
  TResponsePermission,
} from './permissions-dto';

export const permissionsRepository = () => {
  return {
    getAll: async (
      query: TRequestPermissionQuery
    ): Promise<TResponseList<TResponsePermission>> => {
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
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { permission: { contains: search, mode: 'insensitive' as const } },
          ],
        }),
      };

      const [permissions, total] = await Promise.all([
        prisma.appPermissions.findMany({
          where,
          skip,
          take,
          orderBy: { [sortBy]: sortOrder },
        }),
        prisma.appPermissions.count({ where }),
      ]);

      const mappedPermissions = permissions.map(
        (permission): TResponsePermission => ({
          id: permission.id,
          name: permission.name,
          permission: permission.permission,
          createdAt: permission.createdAt,
          updatedAt: permission.updatedAt,
        })
      );

      return commonService().paginate(mappedPermissions, total, metaRequest);
    },

    getById: async (
      id: string
    ): Promise<TResponsePermission | { message: string }> => {
      const { prisma } = await import('@/shared/api/database');
      const permission = await prisma.appPermissions.findUnique({
        where: { id },
      });

      if (!permission) {
        return { message: 'Not Found' };
      }

      return {
        id: permission.id,
        name: permission.name,
        permission: permission.permission,
        createdAt: permission.createdAt,
        updatedAt: permission.updatedAt,
      };
    },

    getByName: async (
      name: string
    ): Promise<TPermissionItem | { message: string }> => {
      const { prisma } = await import('@/shared/api/database');
      const permission = await prisma.appPermissions.findFirst({
        where: { name },
      });

      if (!permission) {
        return { message: 'Not Found' };
      }

      return {
        id: permission.id,
        name: permission.name,
        permission: permission.permission,
        createdAt: permission.createdAt,
        updatedAt: permission.updatedAt,
      };
    },

    create: async (
      data: TRequestCreatePermission
    ): Promise<TResponsePermission> => {
      const { prisma } = await import('@/shared/api/database');
      const permission = await prisma.appPermissions.create({
        data: {
          name: data.name,
          permission: data.permission,
        },
      });

      return {
        id: permission.id,
        name: permission.name,
        permission: permission.permission,
        createdAt: permission.createdAt,
        updatedAt: permission.updatedAt,
      };
    },

    update: async (
      data: TRequestUpdatePermission
    ): Promise<TResponsePermission | { message: string }> => {
      try {
        const { prisma } = await import('@/shared/api/database');
        const permission = await prisma.appPermissions.update({
          where: { id: data.id },
          data: {
            ...(data.name && { name: data.name }),
            ...(data.permission && { permission: data.permission }),
          },
        });

        return {
          id: permission.id,
          name: permission.name,
          permission: permission.permission,
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
        const { prisma } = await import('@/shared/api/database');
        const permission = await prisma.appPermissions.update({
          where: { id },
          data: {
            ...(data.name && { name: data.name }),
            ...(data.permission && { permission: data.permission }),
          },
        });

        return {
          id: permission.id,
          name: permission.name,
          permission: permission.permission,
          createdAt: permission.createdAt,
          updatedAt: permission.updatedAt,
        };
      } catch (error) {
        return { message: (error as Error).message };
      }
    },

    delete: async (id: string): Promise<{ message: string }> => {
      try {
        const { prisma } = await import('@/shared/api/database');
        // Check if permission is being used by any roles
        const rolesWithPermission = await prisma.appRolePermissions.count({
          where: { permissionId: id },
        });

        if (rolesWithPermission > 0) {
          return {
            message: `Cannot delete permission. It is currently assigned to ${rolesWithPermission} role(s).`,
          };
        }

        await prisma.appPermissions.delete({
          where: { id },
        });
        return { message: 'Permission deleted successfully' };
      } catch (error) {
        return { message: (error as Error).message };
      }
    },

    exists: async (id: string): Promise<boolean> => {
      const { prisma } = await import('@/shared/api/database');
      const permission = await prisma.appPermissions.findUnique({
        where: { id },
        select: { id: true },
      });
      return !!permission;
    },

    existsByName: async (name: string): Promise<boolean> => {
      const { prisma } = await import('@/shared/api/database');
      const permission = await prisma.appPermissions.findFirst({
        where: { name },
        select: { id: true },
      });
      return !!permission;
    },

    getRolesCount: async (id: string): Promise<number> => {
      const { prisma } = await import('@/shared/api/database');
      return await prisma.appRolePermissions.count({
        where: { permissionId: id },
      });
    },
  };
};
