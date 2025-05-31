import { PrismaClient } from '@prisma/client/edge';

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

const createPrismaClient = () => {
  const { PrismaClient: NodePrismaClient } = require('@prisma/client');
  return new NodePrismaClient({
    log:
      process.env['NODE_ENV'] !== 'production'
        ? ['query', 'error', 'warn']
        : ['error'],
  });
};

export const prisma = globalThis.__prisma ?? createPrismaClient();

if (process.env['NODE_ENV'] !== 'production') {
  globalThis.__prisma = prisma;
}

export { PrismaClient };
export type {
  User,
  Role,
  Permission,
  RolePermission,
  Product,
} from '@prisma/client';
