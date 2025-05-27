import { TResponseMessage } from '../common/common-dto';
import { usersRepository } from '../users/users-repository';
import { TUserItem } from '../users/users-dto';
import {
  TRequestAuthLogin,
  TRequestAuthRegister,
  TRequestAuthChangePassword,
  TRequestAuthVerifyOtp,
} from './auth-dto';

export const authRepository = () => {
  const userRepo = usersRepository();

  return {
    login: async (
      data: TRequestAuthLogin
    ): Promise<{ data: { user: TUserItem } } | TResponseMessage> => {
      const userResult = await userRepo.getByEmail(data.email);
      if ('message' in userResult) {
        return {
          message: userResult.message,
        };
      }
      return {
        data: {
          user: userResult,
        },
      };
    },

    register: async (
      data: TRequestAuthRegister
    ): Promise<{ message: string }> => {
      const existsResult = await userRepo.existsByEmail(data.email);
      if (existsResult) {
        return { message: 'User already exists with this email' };
      }
      try {
        const { prisma } = await import('@/shared/api/database');
        const defaultRole = await prisma.appRoles.findFirst({
          where: { name: 'user' },
        });

        if (!defaultRole) {
          return {
            message:
              'Default user role not found. Please run database seeding.',
          };
        }
        await userRepo.create({
          email: data.email,
          password: data.password,
          firstName: data.firstName,
          lastName: data.lastName,
          roleId: defaultRole.id,
        });
        return { message: 'User registered successfully' };
      } catch (error) {
        return { message: (error as Error).message };
      }
    },

    changePassword: async (
      userId: string,
      data: TRequestAuthChangePassword
    ): Promise<{ message: string }> => {
      return await userRepo.updatePassword(userId, data.newPassword);
    },

    verifyOtp: async (
      data: TRequestAuthVerifyOtp
    ): Promise<TResponseMessage> => {
      console.log(data);
      return { message: 'OTP verification not implemented' };
    },
  };
};
