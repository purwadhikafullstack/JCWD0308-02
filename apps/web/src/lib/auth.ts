import "server-only"
import { Session } from "lucia";
import { cache } from "react";
import { env } from "@/app/env";
import { redirect } from "next/navigation";
import fetchSSR from "./fetchSSR";

export interface User {
	id: string;
	displayName: string;
	role: string;
}

export type auth = { user: User; session: Session; } | { user: null; session: null; }
export const validateRequest = cache(async (): Promise<auth> => {
	
	const res = await fetchSSR(`${env.NEXT_PUBLIC_BASE_API_URL}/auth/session`)
	const auth = await res.json()
	
	return auth
})


export const getUserRole = async (): Promise<string | null> => {
	const auth = await validateRequest();
	return auth.user ? auth.user.role : null;
  }

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

const user = cache(async () => {
	const request = await authenticated()
	if (!(request.user.role === "USER")) {
		return redirect('/')
	}
	return request
})

export const protectedRoute = { authenticated, storeAdmin, superAdmin, noAuthOnly, user }