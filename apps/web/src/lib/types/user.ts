export type IUserProfile = {
  id: string;
  email: string | null;
  contactEmail: string | null;
  displayName: string;
  avatarUrl: string;
  role: "SUPER_ADMIN" | "STORE_ADMIN" | "USER";
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  referralCode: string;
  registerCode: string | null;
  updatedAt: Date;
  createdAt: Date;
}

export interface User {
  id: string;
  displayName: string;
  email: string;
  accountType: string;
  contactEmail: string;
  role: string;
  status: string;
  referralCode: string;
  avatarUrl?: string;
  password: string;
  createdAt: string;
  updatedAt: string;
}
