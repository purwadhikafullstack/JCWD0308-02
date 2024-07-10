import { lucia } from "@/auth.lucia.js";
import { NODE_ENV, WEB_URL } from "@/config.js";
import { prisma } from "@/db.js";
import { ICallback } from "@/types/index.js";
import { ResponseError } from "@/utils/error.response.js";
import { serializeCookie } from "oslo/cookie";

export class AuthMiddleware {
  static identifyRequest: ICallback = async (req, res, next) => {

    try {
      const sessionId = lucia.readSessionCookie(req.headers.cookie ?? "");
      // const storeId = req.headers.cookie ?? "";

      if (!sessionId) {
        res.locals.user = null
        res.locals.session = null
        return next()
      }

      const { session, user } = await lucia.validateSession(sessionId)

      if (session && session.fresh) {
        res.appendHeader("Set-Cookie", lucia.createSessionCookie(session.id).serialize())
      }

      if (!session) {
        res.appendHeader("Set-Cookie", lucia.createBlankSessionCookie().serialize())
      }

      res.locals.user = user
      res.locals.session = session

      return next()
    } catch (error) {
      next(error)
    }
  }

  static identifyStoreAdmin: ICallback = async (req, res, next) => {
    if (res.locals.user?.role === "STORE_ADMIN") {
      const store = await prisma.storeAdmin.findUnique({ where: { storeAdminId: res.locals.user.id } })

      res.appendHeader("Set-Cookie", serializeCookie('storeId', store?.storeId!, {
        path: '/',
        secure: NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 30,
        sameSite: 'lax',
      }))

      res.locals.store = { id: store?.storeId! }
    }

    next()
  }

  static identifyUser: ICallback = async (req, res, next) => {
    if (res.locals.user?.role === "USER") {

      if (!req.cookies.addressId) {
        const mainAddress = await prisma.userAddress.findFirst({ where: { userId: res.locals.user.id } })
        res.appendHeader("Set-Cookie", serializeCookie('addressId', mainAddress?.id!, {
          path: '/',
          secure: NODE_ENV === 'production',
          httpOnly: true,
          maxAge: 60 * 60 * 24 * 30,
          sameSite: 'lax',
        }))


        res.locals.address = { id: mainAddress?.id! }

      }

      res.locals.address = { id: req.cookies.addressId || res.locals.address?.id! }

    }

    next()
  }

  static identifySuperAdmin: ICallback = async (req, res, next) => {
    if (res.locals.user?.role === "SUPER_ADMIN") {
      const store = await prisma.store.findFirst({ orderBy: { createdAt: 'asc' } })

      if (!req.cookies.storeId) {
        res.appendHeader("Set-Cookie", serializeCookie('storeId', store?.id!, {
          path: '/',
          secure: NODE_ENV === 'production',
          httpOnly: true,
          maxAge: 60 * 60 * 24 * 30,
          sameSite: 'lax',
        }))

      }

      res.locals.store = { id: req.cookies.storeId || store?.id! }
    }

    next()
  }

  static authed: ICallback = async (req, res, next) => {
    try {
      if (!res.locals.user || res.locals.user.status !== 'ACTIVE') throw new ResponseError(401, "Unauthorized")
      next()
    } catch (error) {
      next(error)
    }
  }

  static noAuthOnly: ICallback = async (req, res, next) => {
    try {
      if (res.locals.session) return res.redirect(WEB_URL)
      next()
    } catch (error) {
      next(error)
    }
  }

  static storeAdmin: ICallback = async (req, res, next) => {
    try {
      if (res.locals.user?.role === "USER" || res.locals.user?.status !== 'ACTIVE') throw new ResponseError(401, "Unauthorized")
      next()
    } catch (error) {
      next(error)
    }
  }

  static superAdmin: ICallback = async (req, res, next) => {
    try {
      if (res.locals.user?.role !== "SUPER_ADMIN" || res.locals.user?.status !== 'ACTIVE') throw new ResponseError(401, "Unauthorized")
      next()
    } catch (error) {
      next(error)
    }
  }
}