import { commonService } from '../../common/common-service';
import { TMetaRequest, TResponseList } from '../../common/common-dto';
import type {
  TRequestCreateUser,
  TRequestUpdateUser,
  TRequestPartialUpdateUser,
  TRequestUserQuery,
  TUserItem,
  TResponseUser,
  TResponseUserWithRole,
} from './users-dto';
import { PrismaClient } from '@prisma/client';

export const usersRepository = (prisma: PrismaClient) => {
  return {
    getAll: async (
      query: TRequestUserQuery
    ): Promise<TResponseList<TResponseUserWithRole>> => {
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
        prisma.user.findMany({
          where,
          skip,
          take,
          orderBy: { [sortBy]: sortOrder },
          include: {
            role: true,
          },
        }),
        prisma.user.count({ where }),
      ]);

      const mappedUsers = users.map(
        (user): TResponseUserWithRole => ({
          id: user.id,
          email: user.email,
          name: user.name,
          roleId: user.roleId ?? '',
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          role: {
            id: user?.role?.id ?? '',
            name: user?.role?.name ?? '',
            createdAt: user?.role?.createdAt ?? new Date(),
            updatedAt: user?.role?.updatedAt ?? new Date(),
          },
        })
      );

      return commonService().paginate(mappedUsers, total, metaRequest);
    },

    getById: async (
      id: string
    ): Promise<TResponseUserWithRole | { message: string }> => {
      const user = await prisma.user.findUnique({
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
        name: user.name,
        roleId: user.roleId ?? '',
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        role: {
          id: user?.role?.id ?? '',
          name: user?.role?.name ?? '',
          createdAt: user?.role?.createdAt ?? new Date(),
          updatedAt: user?.role?.updatedAt ?? new Date(),
        },
      };
    },

    getByEmail: async (
      email: string
    ): Promise<TUserItem | { message: string }> => {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return { message: 'Not Found' };
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        roleId: user.roleId ?? '',
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    },

    create: async (data: TRequestCreateUser): Promise<TResponseUser> => {
      const user = await prisma.user.create({
        data: {
          email: data.email,
          name: data.name,
          roleId: data.roleId,
          image:
            data.image ??
            'https://www.shutterstock.com/image-vector/vector-design-avatar-dummy-sign-600nw-1290556063.jpg',
        },
      });

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        roleId: user.roleId ?? '',
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    },

    update: async (
      data: TRequestUpdateUser
    ): Promise<TResponseUser | { message: string }> => {
      try {
        const user = await prisma.user.update({
          where: { id: data.id },
          data: {
            ...(data.email && { email: data.email }),
            ...(data.password && { password: data.password }),
            ...(data.name && { lastName: data.name }),
            ...(data.roleId && { roleId: data.roleId }),
          },
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          roleId: user.roleId ?? '',
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
        const user = await prisma.user.update({
          where: { id },
          data: {
            ...(data.email && { email: data.email }),
            ...(data.password && { password: data.password }),
            ...(data.name && { name: data.name }),
            ...(data.roleId && { roleId: data.roleId }),
          },
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          roleId: user.roleId ?? '',
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        };
      } catch (error) {
        return { message: (error as Error).message };
      }
    },

    delete: async (id: string): Promise<{ message: string }> => {
      try {
        await prisma.user.delete({
          where: { id },
        });
        return { message: 'User deleted successfully' };
      } catch (error) {
        return { message: (error as Error).message };
      }
    },

    exists: async (id: string): Promise<boolean> => {
      const user = await prisma.user.findUnique({
        where: { id },
        select: { id: true },
      });
      return !!user;
    },

    existsByEmail: async (email: string): Promise<boolean> => {
      const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true },
      });
      return !!user;
    },
  };
};
