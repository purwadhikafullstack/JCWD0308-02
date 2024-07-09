import { AccountType, UserRole, UserStatus } from "@prisma/client";

export interface PublicUserResponse {
  id: string;
  displayName: string | null;
  avatarUrl: string | null;
}

export const PublicUserFields = {
  id: true,
  displayName: true,
  avatarUrl: true,
}

export const UserFields = {
  ...PublicUserFields,
  email: true,
  contactEmail: true,
  displayName : true,
  role: true,
  avatarUrl : true,
  accountType: true,
  referralCode: true,
  registerCode: true,
  status: true,
  updatedAt: true,
  createdAt: true,
}

export interface CreateUserRequest {
  accountType : AccountType
  email: string;
  contactEmail :string
  password: string;
  displayName : string
  avatarUrl? : string
  role : UserRole
  status : UserStatus
}

export type IUserProfile = typeof UserFields