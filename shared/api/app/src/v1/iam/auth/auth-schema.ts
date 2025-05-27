import z from 'zod';

export const authVerifyOtpSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email({ message: 'Invalid email format' }),
  otp: z
    .string({ required_error: 'OTP code is required' })
    .min(6, { message: 'OTP code must be at least 6 digits' })
    .max(6, { message: 'OTP code must be at most 6 digits' }),
});
