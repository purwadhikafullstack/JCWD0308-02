import type { Session, User } from 'lucia';

declare global {
  namespace Express {
    interface Locals {
      user: User | null;
      address: { id: string } | null;
      session: Session | null;
      store: { id: string } | null;
    }
  }
}
