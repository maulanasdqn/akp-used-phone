import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { createAuthClient } from 'better-auth/react';
import { prisma } from '@/shared/api/database';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },
  baseURL: process.env['BETTER_AUTH_URL'] ?? 'http://localhost:3000',
  secret:
    process.env['BETTER_AUTH_SECRET'] ?? 'fallback-secret-key-for-development',
  trustedOrigins: [
    'http://localhost:5174',
    'http://localhost:5173',
    'https://backoffice.used.msdqn.dev',
    'https://store.used.msdqn.dev',
  ],
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
});

export const authClient = createAuthClient({
  baseURL: process.env['BETTER_AUTH_URL'] ?? 'http://localhost:3000',
});
