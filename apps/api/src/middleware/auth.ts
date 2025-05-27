import { Hono, Context } from 'hono';
import { verifyAccessToken, CustomJWTPayload } from '@/shared/api/utils';
import { prisma } from '@/shared/api/database';

declare module 'hono' {
  interface ContextVariableMap {
    user: CustomJWTPayload;
  }
}

export const authMiddleware = () => {
  const app = new Hono();

  app.use('/*', async (c, next) => {
    const publicRoutes = [
      '/auth/login',
      '/auth/register',
      '/auth/refresh',
      '/products/list',
      '/products/detail/',
      '/docs',
    ];

    const isPublicRoute = publicRoutes.some((route) =>
      c.req.path.startsWith(route)
    );

    if (isPublicRoute) {
      return next();
    }

    const authHeader = c.req.header('Authorization');

    if (!authHeader?.startsWith('Bearer ')) {
      return c.json(
        { message: 'Authorization header missing or invalid' },
        401
      );
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return c.json({ message: 'Access token missing' }, 401);
    }

    try {
      const decoded = verifyAccessToken(token);
      c.set('user', decoded);
      return next();
    } catch (error) {
      return c.json(
        {
          message: error instanceof Error ? error.message : 'Invalid token',
        },
        401
      );
    }
  });

  return app;
};

export const getCurrentUser = (c: Context): CustomJWTPayload => {
  return c.get('user');
};

export const requireRole = (allowedRoles: string[]) => {
  return async (c: Context, next: () => Promise<void>) => {
    const user = getCurrentUser(c);
    if (!user) {
      return c.json({ message: 'User not authenticated' }, 401);
    }
    if (!allowedRoles.includes(user.roleId)) {
      return c.json({ message: 'Insufficient permissions' }, 403);
    }
    return next();
  };
};

export const requirePermission = (permission: string) => {
  return async (c: Context, next: () => Promise<void>) => {
    const user = getCurrentUser(c);

    if (!user) {
      return c.json({ message: 'User not authenticated' }, 401);
    }

    try {
      const rolePermission = await prisma.appRolePermissions.findFirst({
        where: {
          roleId: user.roleId,
          permission: {
            permission: permission,
          },
        },
        include: {
          permission: true,
        },
      });

      if (!rolePermission) {
        return c.json(
          {
            message: `Access denied. Required permission: ${permission}`,
            error: 'INSUFFICIENT_PERMISSIONS',
          },
          403
        );
      }

      console.log(`Permission granted: ${permission} for user: ${user.userId}`);
      return next();
    } catch (error) {
      console.error('Error checking permissions:', error);
      return c.json(
        {
          message: 'Internal server error while checking permissions',
          error: 'PERMISSION_CHECK_FAILED',
        },
        500
      );
    }
  };
};
