import { z } from 'zod';
import { authService } from './auth-service';
import {
  userLoginSchema,
  userRegistrationSchema,
  changePasswordSchema,
} from '../users/users-schema';
import { authVerifyOtpSchema } from './auth-schema';
import { commonService } from '../common/common-service';

const t = commonService().initTrpc();
const publicProcedure = t.procedure;
const router = t.router;

export const authRouter = router({
  login: publicProcedure.input(userLoginSchema).mutation(async ({ input }) => {
    return await authService().login(input);
  }),

  register: publicProcedure
    .input(userRegistrationSchema)
    .mutation(async ({ input }) => {
      return await authService().register(input);
    }),

  changePassword: publicProcedure
    .input(
      z.object({
        userId: z.string().ulid(),
        passwords: changePasswordSchema,
      })
    )
    .mutation(async ({ input }) => {
      return await authService().changePassword(input.userId, input.passwords);
    }),

  refreshToken: publicProcedure
    .input(
      z.object({
        refreshToken: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      return await authService().refreshToken(input.refreshToken);
    }),

  verifyOtp: publicProcedure
    .input(authVerifyOtpSchema)
    .mutation(async ({ input }) => {
      return await authService().verifyOtp(input);
    }),

  // Get current user profile (requires authentication)
  me: publicProcedure.query(async () => {
    // This would typically require authentication middleware
    // For now, we'll return a placeholder
    return { message: 'User profile endpoint - requires authentication' };
  }),

  // Logout endpoint (for token blacklisting if implemented)
  logout: publicProcedure
    .input(
      z.object({
        refreshToken: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      // TODO: Implement token blacklisting logic
      console.log('Logout called with refresh token:', input.refreshToken);
      return { message: 'Logged out successfully' };
    }),
});

export type AuthRouter = typeof authRouter;
