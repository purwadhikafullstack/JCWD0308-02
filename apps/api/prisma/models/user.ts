import { hash } from 'bcrypt';
import { generateId } from 'lucia';
import { AccountType, UserRole, UserStatus } from '@prisma/client';

export async function listUsers() {
  return [
    {
      email: 'admin1@admin.com',
      password: await hash('admin123', 12),
      displayName: 'Super Admin',
      avatarUrl: 'http://example.com/default-avatar.png',
      accountType: AccountType.EMAIL,
      role: UserRole.SUPER_ADMIN,
      status: UserStatus.ACTIVE,
      referralCode: generateId(8),
      contactEmail: 'admin1@admin.com',
    },
    {
      email: 'admin2@admin.com',
      password: await hash('admin123', 12),
      displayName: 'Store Admin',
      avatarUrl: 'http://example.com/default-avatar.png',
      accountType: AccountType.EMAIL,
      role: UserRole.STORE_ADMIN,
      status: UserStatus.ACTIVE,
      referralCode: generateId(8),
      contactEmail: 'admin2@admin.com',
    },
    {
      email: 'user1@example.com',
      password: await hash('user12345', 12),
      displayName: 'Hali',
      avatarUrl: 'http://example.com/default-avatar.png',
      accountType: AccountType.EMAIL,
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
      referralCode: generateId(8),
      contactEmail: 'user1@example.com',
    },
    {
      email: 'user2@example.com',
      password: await hash('user12345', 12),
      displayName: 'Upan',
      avatarUrl: 'http://example.com/default-avatar.png',
      accountType: AccountType.EMAIL,
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
      referralCode: generateId(8),
      contactEmail: 'user2@example.com',
    },
  ];
}
