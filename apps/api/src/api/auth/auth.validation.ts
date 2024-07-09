import { $Enums } from '@prisma/client';
import { ZodType, z } from 'zod';

export class AuthValidation {
  static readonly REGISTER = z.object({
    email: z.string().email().min(11, {
      message: 'Should be at least 11 character(s)'
    }).max(256)
  })
  
  static readonly SETACCOUNT = z.object({
    email: z.string().email().min(11, {
      message: 'Should be at least 11 character(s)'
    }).max(256),
    password: z.string().min(8).max(512),
    displayName: z.string().min(1).max(64),
    registerCode: z.string().length(8).optional(),
  })

  static readonly SIGNIN = z.object({
    email: z.string().email().min(11, {
      message: 'Should be at least 11 character(s)'
    }).max(256),
    password: z.string().min(8).max(512),
  })

  static readonly RESET = z.object({
    password: z.string().min(8).max(512),
  })
}

export type RegisterRequest = z.infer<typeof AuthValidation.REGISTER>
export type SetAccountRequest = z.infer<typeof AuthValidation.SETACCOUNT>
export type ResetPasswordRequest = z.infer<typeof AuthValidation.RESET>

export type user = {
  id: string;
  updatedAt: Date;
  createdAt: Date;
  status: $Enums.UserStatus;
  displayName: string | null;
  avatarUrl: string;
  contactEmail: string | null;
  email: string | null;
  role: $Enums.UserRole;
  referralCode: string;
  registerCode: string | null;
}