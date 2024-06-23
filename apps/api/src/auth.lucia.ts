import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { Lucia } from "lucia";
import { Prisma } from "@prisma/client";
import { NODE_ENV } from "./config.js";
import { prisma } from "./db.js";

const adapter = new PrismaAdapter(prisma.session, prisma.user)

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: NODE_ENV === "production"
    }
  },
  getUserAttributes: (attributes) => {
    return {
      displayName: attributes.displayName,
      role: attributes.role,
    }
  }
})
// const u: Prisma. = 
declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: Omit<Prisma.UserCreateInput, 'id'>
  }
}