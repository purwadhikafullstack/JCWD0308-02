import { ICallback } from "@/types/index.js"
import { AuthService } from "./auth.service.js"
import { lucia } from "@/auth.lucia.js"
import { ResponseError } from "@/utils/error.response.js"

export class AuthController {
  createUserByEmail: ICallback = async (req, res, next) => {
    try {
      const user = await AuthService.registerByEmail(req.body)

      const session = await lucia.createSession(user.id, {})

      return res
        .status(201)
        .appendHeader("Set-Cookie", lucia.createSessionCookie(session.id).serialize())
        .json({ status: "OK", message: "Created new User", user })
    } catch (error) {
      next(error)
    }
  }

  signin: ICallback = async (req, res, next) => {
    try {
      const user = await AuthService.signin(req.body)

      const session = await lucia.createSession(user!.id, {})

      return res
        .status(200)
        .appendHeader("Set-Cookie", lucia.createSessionCookie(session.id).serialize())
        .json({ status: "OK", message: "Login Success", user })

    } catch (error) {
      next(error)
    }
  }

  signout: ICallback = async (req, res, next) => {
    try {
      if (!res.locals.session) throw new ResponseError(401, "Unauthorized")
      await lucia.invalidateSession(res.locals.session.id)

      // if (!res.locals.user) throw new ResponseError(401, "Unauthorized")
      // await lucia.invalidateUserSessions(res.locals.user?.id)

      return res
        .status(200)
        .appendHeader("Set-Cookie", lucia.createBlankSessionCookie().serialize())
        .json({ status: "OK", message: "Signout Success" })

    } catch (error) {
      next(error)
    }
  }

}