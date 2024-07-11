import { z } from 'zod';

export const createUserSchema = z.object({
  accountType: z.enum(["EMAIL", "GOOGLE", "FACEBOOK", "GITHUB"]),
  email: z.string().email().min(11, {
    message: 'Should be at least 11 character(s)',
  }).max(256),
  contactEmail: z.string().email().min(11, {
    message: 'Should be at least 11 character(s)',
  }).max(256),
  password: z.string().min(8, {
    message: 'Password must contain at least 8 characters',
  }).max(512),
  displayName: z.string().min(3).max(64).optional(),
  avatarUrl: z.string().url().optional(),
  role: z.enum(["SUPER_ADMIN", "STORE_ADMIN", "USER"]),
  status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"]),
});

export const updateUserSchema = z.object({
  accountType: z.enum(["EMAIL", "GOOGLE", "FACEBOOK", "GITHUB"]).optional(),
  email: z.string().email().min(11, {
    message: 'Should be at least 11 character(s)',
  }).max(256).optional(),
  contactEmail: z.string().email().min(11, {
    message: 'Should be at least 11 character(s)',
  }).max(256).optional(),
  password: z.string().min(8, {
    message: 'String must contain at least 8 character(s)',
  }).max(512).optional(),
  displayName: z.string().min(3).max(64).optional(),
  avatarUrl: z.string().url().optional(),
  role: z.enum(["SUPER_ADMIN", "STORE_ADMIN", "USER"]).optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"]).optional(),
});
