import {
  usersService,
  rolesService,
  permissionsService,
  productsService,
} from '@/shared/api/app';
import { createTRPCInstance } from '@/shared/api/utils';

export const appRouter = createTRPCInstance({
  users: usersService,
  roles: rolesService,
  permissions: permissionsService,
  products: productsService,
});

export type AppRouter = typeof appRouter;
