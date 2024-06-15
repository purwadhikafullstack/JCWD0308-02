import { lucia } from "@/auth.lucia.js";
import { ICallback } from "@/types/index.js";
import { ResponseError } from "@/utils/error.response.js";

export class AuthMiddleware {
  static identifyRequest: ICallback = async (req, res, next) => {
    try {
      const sessionId = lucia.readSessionCookie(req.headers.cookie ?? "");

      if (!sessionId) {
        res.locals.user = null
        res.locals.session = null
        return next()
      }

      const { session, user } = await lucia.validateSession(sessionId)

      if (session && session.fresh) {
        console.log('hit fresh');

        res.appendHeader("Set-Cookie", lucia.createSessionCookie(session.id).serialize())
      }

      if (!session) {
        console.log('hit false');
        res.appendHeader("Set-Cookie", lucia.createBlankSessionCookie().serialize())
      }

      res.locals.user = user
      res.locals.session = session

      console.log(res.locals.session);
      console.log(res.locals.user);

      return next()
    } catch (error) {
      next(error)
    }
  }

  static authed: ICallback = async (req, res, next) => {
    try {
      if (!res.locals.user) throw new ResponseError(401, "Unauthorized")
      next()
    } catch (error) {
      next(error)
    }
  }

  static storeAdmin: ICallback = async (req, res, next) => {
    try {
      if (res.locals.user?.role === "USER") throw new ResponseError(401, "Unauthorized")
      next()
    } catch (error) {
      next(error)
    }
  }

  static superAdmin: ICallback = async (req, res, next) => {
    try {
      if (res.locals.user?.role !== "SUPER_ADMIN") throw new ResponseError(401, "Unauthorized")
      next()
    } catch (error) {
      next(error)
    }
  }
}