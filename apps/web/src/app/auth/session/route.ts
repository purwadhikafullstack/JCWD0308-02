import { lucia } from "@/lib/auth";
import { cookies, headers } from "next/headers";

export async function GET(request: Request) {

  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;

  if (!sessionId) {
    return Response.json({ user: null, session: null });
  }

  const result = await lucia.validateSession(sessionId);
  // next.js throws when you attempt to set cookie when rendering page
  try {

    if (result.session && result.session.fresh) {

      const sessionCookie = lucia.createSessionCookie(result.session.id);
      cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    }
    if (!result.session) {
      console.log('hit');
      
      const sessionCookie = lucia.createBlankSessionCookie();
      console.log(sessionCookie);
      
      cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    }
  } catch { }

  return Response.json({ user: result.user, session: result.session });
}