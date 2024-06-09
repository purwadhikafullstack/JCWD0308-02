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
  role: true,
  referralCode: true,
  registerCode: true,
  status: true,
  updatedAt: true,
  createdAt: true,
}