import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

// For Cloudflare Workers, use Prisma Accelerate
const createPrismaClient = () => {
  // Check if we're in Cloudflare Workers environment
  if (
    typeof globalThis !== 'undefined' &&
    typeof globalThis.fetch !== 'undefined' &&
    !process?.versions?.node
  ) {
    // Cloudflare Workers environment - use edge client with Accelerate
    return new PrismaClient({
      datasourceUrl: process.env['DATABASE_URL'],
    }).$extends(withAccelerate());
  } else {
    // Node.js environment (local development, Vercel) - use regular client
    const { PrismaClient: NodePrismaClient } = require('@prisma/client');
    return new NodePrismaClient({
      log:
        process.env['NODE_ENV'] !== 'production'
          ? ['query', 'error', 'warn']
          : ['error'],
    });
  }
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
