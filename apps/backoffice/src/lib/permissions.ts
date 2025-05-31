import { PrismaClient } from '@prisma/client';

// Initialize Prisma client for direct database access
const prisma = new PrismaClient();

export interface UserPermissions {
  userId: string;
  permissions: string[];
  role?: {
    id: string;
    name: string;
  };
}

/**
 * Get user permissions by fetching user with role and permissions from database
 */
export async function getUserPermissions(userId: string): Promise<string[]> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    if (!user?.role) {
      return [];
    }

    return user.role.permissions.map((rp) => rp.permission.name);
  } catch (error) {
    console.error('Error fetching user permissions:', error);
    return [];
  }
}

/**
 * Check if user has specific permission
 */
export async function userHasPermission(
  userId: string,
  permission: string
): Promise<boolean> {
  const permissions = await getUserPermissions(userId);
  return permissions.includes(permission);
}

/**
 * Check if user has any of the specified permissions
 */
export async function userHasAnyPermission(
  userId: string,
  permissions: string[]
): Promise<boolean> {
  const userPermissions = await getUserPermissions(userId);
  return permissions.some((permission) => userPermissions.includes(permission));
}

/**
 * Get user with role information
 */
export async function getUserWithRole(userId: string) {
  try {
    return await prisma.user.findUnique({
      where: { id: userId },
      include: {
        role: true,
      },
    });
  } catch (error) {
    console.error('Error fetching user with role:', error);
    return null;
  }
}
