import z from 'zod';
import {
  userLoginSchema,
  userRegistrationSchema,
  changePasswordSchema,
  TResponseUser,
} from '../users';
import { TResponseDetail } from '../common/common-dto';
import { authVerifyOtpSchema } from './auth-schema';

export type TRequestAuthLogin = z.infer<typeof userLoginSchema>;
export type TRequestAuthRegister = z.infer<typeof userRegistrationSchema>;
export type TRequestAuthChangePassword = z.infer<typeof changePasswordSchema>;
export type TRequestAuthVerifyOtp = z.infer<typeof authVerifyOtpSchema>;

export type TTokenItem = {
  accessToken: string;
  refreshToken: string;
};

export type TLoginItem = {
  token: TTokenItem;
  user: TResponseUser;
};

export type TResponseAuthLogin = TResponseDetail<TLoginItem>;
