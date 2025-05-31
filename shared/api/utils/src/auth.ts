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
  trustedOrigins: [
    'http://localhost:5174',
    process.env['FRONTEND_URL'] ?? 'http://localhost:5174',
  ],
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
});

export const authClient = createAuthClient({
  baseURL: process.env['BETTER_AUTH_URL'] ?? 'http://localhost:3000',
});
