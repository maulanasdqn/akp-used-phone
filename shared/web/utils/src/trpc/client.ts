import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink, loggerLink } from '@trpc/client';
import type { AppRouter } from '@/shared/trpc';
import SuperJSON from 'superjson';

export const trpc = createTRPCReact<AppRouter>();

export const trpcLinks = {
  links: [
    httpBatchLink({
      url: 'https://api.used.msdqn.dev/v1/trpc',
      headers() {
        return {
          'x-trpc-source': 'react',
        };
      },
      transformer: SuperJSON,
      fetch(url, options) {
        return fetch(url, {
          ...options,
          credentials: 'include',
        });
      },
    }),
    loggerLink({
      enabled: (op) =>
        import.meta?.env?.['NODE_ENV'] === 'development' ||
        (op.direction === 'down' && op.result instanceof Error),
    }),
  ],
};

export type { AppRouter };
