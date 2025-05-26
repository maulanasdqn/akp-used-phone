import { PrismaClient } from '@prisma/client/prisma-client';

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}
export const prisma =
  globalThis.__prisma ??
  new PrismaClient({
    log: ['query', 'error', 'warn'],
  });

if (process.env['NODE_ENV'] !== 'production') {
  globalThis.__prisma = prisma;
}

export { PrismaClient };
export type {
  AppUsers,
  AppRoles,
  AppPermissions,
  AppRolePermissions,
  AppProducts,
} from '@prisma/client/prisma-client';
