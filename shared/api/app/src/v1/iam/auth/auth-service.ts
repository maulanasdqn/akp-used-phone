import {
  hashPassword,
  verifyPassword,
  generateTokens,
  verifyRefreshToken,
} from '@/shared/api/utils';
import { authRepository } from './auth-repository';
import {
  TRequestAuthLogin,
  TRequestAuthRegister,
  TRequestAuthChangePassword,
  TRequestAuthVerifyOtp,
  TResponseAuthLogin,
} from './auth-dto';
import { TResponseMessage } from '../common/common-dto';

export const authService = () => {
  const authRepo = authRepository();

  return {
    login: async (
      data: TRequestAuthLogin
    ): Promise<TResponseAuthLogin | TResponseMessage> => {
      try {
        const userResult = await authRepo.login(data);
        if ('message' in userResult) {
          return userResult;
        }
        const isValidPassword = await verifyPassword(
          data.password,
          userResult.data.user.password
        );
        if (!isValidPassword) {
          return { message: 'Invalid credentials' };
        }
        const tokens = generateTokens({
          userId: userResult.data.user.id,
          email: userResult.data.user.email,
          roleId: userResult.data.user.roleId,
        });
        const userWithoutPassword = {
          id: userResult.data.user.id,
          email: userResult.data.user.email,
          firstName: userResult.data.user.firstName,
          lastName: userResult.data.user.lastName,
          roleId: userResult.data.user.roleId,
          createdAt: userResult.data.user.createdAt,
          updatedAt: userResult.data.user.updatedAt,
        };
        return {
          data: {
            token: tokens,
            user: userWithoutPassword,
          },
          message: 'Login successful',
        };
      } catch (error) {
        return { message: (error as Error).message };
      }
    },

    register: async (data: TRequestAuthRegister): Promise<TResponseMessage> => {
      try {
        const hashedPassword = await hashPassword(data.password);
        const result = await authRepo.register({
          ...data,
          password: hashedPassword,
        });
        return result;
      } catch (error) {
        return { message: (error as Error).message };
      }
    },

    changePassword: async (
      userId: string,
      data: TRequestAuthChangePassword
    ): Promise<TResponseMessage> => {
      try {
        const hashedNewPassword = await hashPassword(data.newPassword);
        const result = await authRepo.changePassword(userId, {
          ...data,
          newPassword: hashedNewPassword,
        });
        return result;
      } catch (error) {
        return { message: (error as Error).message };
      }
    },

    refreshToken: async (
      refreshToken: string
    ): Promise<{ data: { accessToken: string } } | TResponseMessage> => {
      try {
        const decoded = verifyRefreshToken(refreshToken);
        const tokens = generateTokens({
          userId: decoded.userId,
          email: decoded.email,
          roleId: decoded.roleId,
        });
        return {
          data: {
            accessToken: tokens.accessToken,
          },
        };
      } catch (error) {
        return { message: (error as Error).message };
      }
    },

    verifyOtp: async (
      data: TRequestAuthVerifyOtp
    ): Promise<TResponseMessage> => {
      return await authRepo.verifyOtp(data);
    },
  };
};
