import { commonService } from '../common/common-service';
import { TMetaRequest, TResponseList } from '../common/common-dto';
import type {
  TRequestCreateUser,
  TRequestUpdateUser,
  TRequestPartialUpdateUser,
  TRequestUserQuery,
  TUserItem,
  TResponseUser,
  TResponseUserWithRole,
} from './users-dto';

export const usersRepository = () => {
  return {
    getAll: async (
      query: TRequestUserQuery
    ): Promise<TResponseList<TResponseUserWithRole>> => {
      const { prisma } = await import('@/shared/api/database');
      const { search, roleId, sortBy, sortOrder } = query;

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
            { email: { contains: search, mode: 'insensitive' as const } },
            { firstName: { contains: search, mode: 'insensitive' as const } },
            { lastName: { contains: search, mode: 'insensitive' as const } },
          ],
        }),
        ...(roleId && { roleId }),
      };

      const [users, total] = await Promise.all([
        prisma.appUsers.findMany({
          where,
          skip,
          take,
          orderBy: { [sortBy]: sortOrder },
          include: {
            role: true,
          },
        }),
        prisma.appUsers.count({ where }),
      ]);

      const mappedUsers = users.map(
        (user): TResponseUserWithRole => ({
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          roleId: user.roleId,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          role: {
            id: user.role.id,
            name: user.role.name,
            createdAt: user.role.createdAt,
            updatedAt: user.role.updatedAt,
          },
        })
      );

      return commonService().paginate(mappedUsers, total, metaRequest);
    },

    getById: async (
      id: string
    ): Promise<TResponseUserWithRole | { message: string }> => {
      const { prisma } = await import('@/shared/api/database');
      const user = await prisma.appUsers.findUnique({
        where: { id },
        include: {
          role: true,
        },
      });

      if (!user) {
        return { message: 'Not Found' };
      }

      return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roleId: user.roleId,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        role: {
          id: user.role.id,
          name: user.role.name,
          createdAt: user.role.createdAt,
          updatedAt: user.role.updatedAt,
        },
      };
    },

    getByEmail: async (
      email: string
    ): Promise<TUserItem | { message: string }> => {
      const { prisma } = await import('@/shared/api/database');
      const user = await prisma.appUsers.findUnique({
        where: { email },
      });

      if (!user) {
        return { message: 'Not Found' };
      }

      return {
        id: user.id,
        email: user.email,
        password: user.password,
        firstName: user.firstName,
        lastName: user.lastName,
        roleId: user.roleId,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    },

    create: async (data: TRequestCreateUser): Promise<TResponseUser> => {
      const { prisma } = await import('@/shared/api/database');
      const user = await prisma.appUsers.create({
        data: {
          email: data.email,
          password: data.password,
          firstName: data.firstName,
          lastName: data.lastName,
          roleId: data.roleId,
        },
      });

      return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roleId: user.roleId,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    },

    update: async (
      data: TRequestUpdateUser
    ): Promise<TResponseUser | { message: string }> => {
      try {
        const { prisma } = await import('@/shared/api/database');
        const user = await prisma.appUsers.update({
          where: { id: data.id },
          data: {
            ...(data.email && { email: data.email }),
            ...(data.password && { password: data.password }),
            ...(data.firstName && { firstName: data.firstName }),
            ...(data.lastName && { lastName: data.lastName }),
            ...(data.roleId && { roleId: data.roleId }),
          },
        });

        return {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          roleId: user.roleId,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        };
      } catch (error) {
        return { message: (error as Error).message };
      }
    },

    partialUpdate: async (
      id: string,
      data: TRequestPartialUpdateUser
    ): Promise<TResponseUser | { message: string }> => {
      try {
        const { prisma } = await import('@/shared/api/database');
        const user = await prisma.appUsers.update({
          where: { id },
          data: {
            ...(data.email && { email: data.email }),
            ...(data.password && { password: data.password }),
            ...(data.firstName && { firstName: data.firstName }),
            ...(data.lastName && { lastName: data.lastName }),
            ...(data.roleId && { roleId: data.roleId }),
          },
        });

        return {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          roleId: user.roleId,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        };
      } catch (error) {
        return { message: (error as Error).message };
      }
    },

    delete: async (id: string): Promise<{ message: string }> => {
      try {
        const { prisma } = await import('@/shared/api/database');
        await prisma.appUsers.delete({
          where: { id },
        });
        return { message: 'User deleted successfully' };
      } catch (error) {
        return { message: (error as Error).message };
      }
    },

    exists: async (id: string): Promise<boolean> => {
      const { prisma } = await import('@/shared/api/database');
      const user = await prisma.appUsers.findUnique({
        where: { id },
        select: { id: true },
      });
      return !!user;
    },

    existsByEmail: async (email: string): Promise<boolean> => {
      const { prisma } = await import('@/shared/api/database');
      const user = await prisma.appUsers.findUnique({
        where: { email },
        select: { id: true },
      });
      return !!user;
    },

    updatePassword: async (
      id: string,
      hashedPassword: string
    ): Promise<{ message: string }> => {
      try {
        const { prisma } = await import('@/shared/api/database');
        await prisma.appUsers.update({
          where: { id },
          data: { password: hashedPassword },
        });
        return { message: 'Password updated successfully' };
      } catch (error) {
        return { message: (error as Error).message };
      }
    },
  };
};
