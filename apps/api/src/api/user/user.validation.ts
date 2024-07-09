import { ZodType, z } from 'zod';

export class UserValidation {
  static readonly createUser = z.object({
    accountType: z.enum(["EMAIL", "GOOGLE", "FACEBOOK", "GITHUB"]),
    email: z.string().email(),
    contactEmail: z.string().email().min(11, {
      message: 'Should be at least 11 character(s)'
    }).max(256),
    password: z.string().min(8).max(512),
    displayName: z.string().min(3, { message: "Name should be minimal 3 characters" }).max(64).optional(),
    avatarUrl: z.string().url().optional(),
    role: z.enum(["SUPER_ADMIN", "STORE_ADMIN", "USER"]),
    status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"]),
  })

  static readonly updateUser = z.object({
    avatarUrl: z.string().url().optional(),
    displayName: z.string().min(3, { message: "Name should be minimal 3 characters" }).max(64).optional(),
  });

  static readonly changePassword = z.object({
    password: z.string().min(8).max(512),
    newPassword: z.string().min(8).max(512),
  });

  static readonly changeEmail = z.object({
    email: z.string().email().optional(),
    newEmail: z.string().email(),
    password: z.string().min(8).max(512),
  })
    .refine(
      (values) => {
        return values.email !== values.newEmail;
      },
      {
        message: 'New email must be different!',
        path: ['newEmail'],
      },
    );

  static readonly updateUserByAdmin = z.object({
    accountType: z.enum(["EMAIL", "GOOGLE", "FACEBOOK", "GITHUB"]).optional(),
    email: z.string().email().min(11, {
      message: 'Should be at least 11 character(s)'
    }).max(256).optional(),
    contactEmail: z.string().email().min(11, {
      message: 'Should be at least 11 character(s)'
    }).max(256).optional(),
    password: z.string().min(8).max(512).optional(),
    displayName: z.string().min(3, { message: "Name should be minimal 3 characters" }).max(64).optional(),
    avatarUrl: z.string().url().optional(),
    role: z.enum(["SUPER_ADMIN", "STORE_ADMIN", "USER"]).optional(),
    status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"]).optional(),
  });
}

export type UpdateUserRequest = z.input<typeof UserValidation.updateUser>

export type ChangePasswordRequest = z.input<typeof UserValidation.changePassword>
export type ChangeEmailRequest = z.input<typeof UserValidation.changeEmail>