import { LoaderFunctionArgs, redirect } from 'react-router';
import { authClient } from './auth';

const mappingPublicRoutes = [
  '/auth/login',
  '/auth/forgot',
  '/auth/new-password',
  '/auth/register',
  '/auth/verify-email',
  '/auth/reset-password',
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

    return null;
  } catch (error) {
    console.error('Middleware error:', error);
    return redirect('/auth/login');
  }
};
