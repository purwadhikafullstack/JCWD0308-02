import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { Lucia } from "lucia";
import { Prisma } from "@prisma/client";
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, API_URL, NODE_ENV } from "./config.js";
import { prisma } from "./db.js";
import { GitHub, Google } from "arctic";
import { webcrypto } from "node:crypto";

// globalThis.crypto = webcrypto as Crypto;
if (typeof globalThis.crypto === "undefined") {
  Object.defineProperty(globalThis, "crypto", {
    value: webcrypto,
    configurable: true,
  });
}

const adapter = new PrismaAdapter(prisma.session, prisma.user);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes) => {
    return {
      displayName: attributes.displayName,
      role: attributes.role,
      status: attributes.status,
    };
  },
});

export const github = new GitHub(GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET);

export const google = new Google(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, `${API_URL}/auth/google/callback`);

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: Omit<Prisma.UserCreateInput, "id">;
  }
}
