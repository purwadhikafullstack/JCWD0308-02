import "server-only"
import { Mysql2Adapter } from "@lucia-auth/adapter-mysql";
// import { pool } from "./db";
import { Lucia, Session } from "lucia";
import { cache } from "react";
import { env } from "@/app/env";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import fetchSSR from "./fetchSSR";

export interface User {
	id: string;
	display_name: string;
	role: string;
}

export type auth = { user: User; session: Session; } | { user: null; session: null; }

// export const adapter = new Mysql2Adapter(pool, {
// 	user: "users",
// 	session: 'sessions'
// })

// export const lucia = new Lucia(adapter, {
// 	sessionCookie: {
// 		attributes: {
// 			secure: env.NODE_ENV === "production"
// 		}
// 	},
// 	getUserAttributes: (attributes) => {
// 		return {
// 			displayName: attributes.display_name,
// 			role: attributes.role,
// 		}
// 	}
// })

// declare module "lucia" {
// 	interface Register {
// 		Lucia: typeof lucia;
// 		DatabaseUserAttributes: Omit<DatabaseUser, "id">;
// 	}
// }

// const setSession = (result: auth) => {
// 	try {
// 		if (result.session && result.session.fresh) {
// 			const sessionCookie = lucia.createSessionCookie(result.session.id);
// 			cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
// 		}
// 		if (!result.session) {
// 			const sessionCookie = lucia.createBlankSessionCookie();
// 			cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
// 		}
// 	} catch { }
// }

export const validateRequest = cache(async (): Promise<auth> => {
	// const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;

	// const result = await lucia.validateSession(sessionId!);

	// setSession(result);

	// return result;
	const res = await fetchSSR(`${env.NEXT_PUBLIC_BASE_API_URL}/auth/session`)
	console.log(res);
	const auth = await res.json()
	
	return auth
})

const authenticated = cache(async () => {
	const request = await validateRequest()
	if (!request.user) {
		return redirect('/auth/login')
	}
	return request
})

const noAuthOnly = cache(async () => {
	const request = await validateRequest()
	if (request.session) {
		return redirect('/')
	}
	return request
})

const storeAdmin = cache(async () => {
	const request = await authenticated()
	if (request.user.role === "USER") {
		return redirect('/')
	}
	return request
})

const superAdmin = cache(async () => {
	const request = await authenticated()
	if (request.user.role !== "SUPER_ADMIN") {
		return redirect('/')
	}
	return request
})

export const protectedRoute = { authenticated, storeAdmin, superAdmin, noAuthOnly }