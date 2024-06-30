import type { Session, User } from "lucia"

declare global {
  namespace Express {
    interface Locals {
      user: User | null
      session: Session | null
      store: { id: string } | null
    }
  }
}