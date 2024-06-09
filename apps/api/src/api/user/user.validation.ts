import { ZodType, z } from 'zod';

export class UserValidation {
  static readonly createUser: ZodType = z.object({
    accountType: z.enum(["EMAIL", "GOOGLE", "FACEBOOK", "GITHUB"]),
    email: z.string().email().min(11, {
      message: 'Should be at least 11 character(s)'
    }).max(256),
    contactEmail: z.string().email().min(11, {
      message: 'Should be at least 11 character(s)'
    }).max(256),
    password: z.string().min(8).max(512),
    displayName: z.string().min(1).max(64).optional(),
    avatarUrl: z.string().url().optional(),
    role: z.enum(["SUPER_ADMIN", "STORE_ADMIN", "USER"]), 
    status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"]),
  })

  static readonly updateUser: ZodType = z.object({
    accountType: z.enum(["EMAIL", "GOOGLE", "FACEBOOK", "GITHUB"]).optional(),
    email: z.string().email().min(11, {
      message: 'Should be at least 11 character(s)'
    }).max(256).optional(),
    contactEmail: z.string().email().min(11, {
      message: 'Should be at least 11 character(s)'
    }).max(256).optional(),
    password: z.string().min(8).max(512).optional(),
    displayName: z.string().min(1).max(64).optional(),
    avatarUrl: z.string().url().optional(),
    role: z.enum(["SUPER_ADMIN", "STORE_ADMIN", "USER"]).optional(),
    status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"]).optional(),
  });
}