import { ZodType, z } from 'zod';

export class AuthValidation {
  static readonly REGISTER: ZodType = z.object({
    email: z.string().email().min(11, {
      message: 'Should be at least 11 character(s)'
    }).max(256),
    password: z.string().min(8).max(512),
    displayName: z.string().min(1).max(64).optional(),
    registerCode: z.string().length(8).optional(),
  })

  static readonly SIGNIN: ZodType = z.object({
    email: z.string().email().min(11, {
      message: 'Should be at least 11 character(s)'
    }).max(256),
    password: z.string().min(8).max(512),
  })
}