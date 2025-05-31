import { LoaderFunctionArgs, redirect } from 'react-router';
import { authClient } from './auth';
import { getUserPermissions } from './lib/permissions';

const mappingPublicRoutes = [
  '/auth/login',
  '/auth/forgot',
  '/auth/new-password',
  '/auth/register',
  '/auth/verify-email',
  '/auth/reset-password',
];

interface RoutePermission {
  path: string;
  permissions: string[];
  exact?: boolean;
}

const mappingRoutePermissions: RoutePermission[] = [
  {
    path: '/dashboard',
    permissions: [],
    exact: true,
  },
  {
    path: '/buy',
    permissions: ['buy:access'],
    exact: false,
  },
  {
    path: '/users',
    permissions: ['users:read', 'users:manage'],
    exact: false,
  },
  {
    path: '/roles',
    permissions: ['roles:read', 'roles:manage'],
    exact: false,
  },
  {
    path: '/permissions',
    permissions: ['permissions:read', 'permissions:manage'],
    exact: false,
  },
];

export const middleware = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const pathname = url.pathname;

  try {
    const { data: session, error } = await authClient.getSession({
      fetchOptions: {
        headers: {
          cookie: request.headers.get('cookie') ?? '',
        },
      },
    });

    const isPublicRoute = mappingPublicRoutes.some((route) => {
      return pathname === route || pathname.startsWith(route);
    });

    if (isPublicRoute) {
      if (session?.user && !error) {
        return redirect('/dashboard');
      }
      return null;
    }

    if (!session?.user || error) {
      const loginUrl = new URL('/auth/login', url.origin);
      loginUrl.searchParams.set('redirect', pathname);
      return redirect(loginUrl.toString());
    }

    const matchedRoute = mappingRoutePermissions.find((route) => {
      if (route.exact) {
        return route.path === pathname;
      }
      return pathname.startsWith(route.path);
    });

    if (matchedRoute && matchedRoute.permissions.length > 0) {
      const userPermissions = await getUserPermissions(session.user.id);
      const hasPermission = matchedRoute.permissions.some((permission) =>
        userPermissions.includes(permission)
      );

      if (!hasPermission) {
        return redirect('/dashboard?error=unauthorized');
      }
    }

    return null;
  } catch (error) {
    console.error('Middleware error:', error);
    return redirect('/auth/login');
  }
};
