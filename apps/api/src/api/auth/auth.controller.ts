import { ICallback } from "@/types/index.js"
import { AuthService } from "./auth.service.js"
import { github, google, lucia } from "@/auth.lucia.js"
import { ResponseError } from "@/utils/error.response.js"
import { generateCodeVerifier, generateState } from "arctic"
import { WEB_URL } from "@/config.js"
import { AuthHelper, createOAuthCookie } from "./auth.helper.js"

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

      return res
        .status(200)
        .appendHeader("Set-Cookie", lucia.createBlankSessionCookie().serialize())
        .json({ status: "OK", message: "Signout Success" })

    } catch (error) {
      next(error)
    }
  }

  github: ICallback = async (req, res, next) => {
    try {
      const state = generateState()
      const url = await github.createAuthorizationURL(state, { scopes: ["user:email"] })
      console.log(url.toString());

      res.appendHeader('Set-Cookie', createOAuthCookie('github_oauth_state', state))
        .redirect(url.toString())
    } catch (error) {
      next(error)
    }
  }

  githubCallback: ICallback = async (req, res, next) => {
    const { code, state, storedState } = AuthHelper.getGitHubCodesFromURL(req)
    try {
      if (!code || !state || !storedState || state !== storedState) throw new ResponseError(400, "")

      const user = await AuthService.githubOAuth(code)

      const session = await lucia.createSession(user.id, {});
      return res
        .clearCookie('github_oauth_state')
        .appendHeader("Set-Cookie", lucia.createSessionCookie(session.id).serialize())
        .redirect(`${WEB_URL}`);

    } catch (error) {
      next(error)
    }
  }

  google: ICallback = async (req, res, next) => {
    try {
      const state = generateState()
      const codeVerifier = generateCodeVerifier();
      const url = await google.createAuthorizationURL(state, codeVerifier, {
        scopes: ["profile", "email"],
      });

      res
        .appendHeader('Set-Cookie', createOAuthCookie('google_oauth_state', state))
        .appendHeader('Set-Cookie', createOAuthCookie('google_code_verifier', codeVerifier))
        .redirect(url.toString())
    } catch (error) {
      next(error)
    }
  }

  googleCallback: ICallback = async (req, res, next) => {
    const { code, state, storedState, codeVerifier } = AuthHelper.getGoogleCodesFromURL(req)
    try {
      if (!code || !state || !storedState || state !== storedState || !codeVerifier) throw new ResponseError(400, "")

      const user = await AuthService.googleOAuth(code, codeVerifier)

      const session = await lucia.createSession(user.id, {});
      return res
        .clearCookie('google_oauth_state')
        .clearCookie('google_code_verifier')
        .appendHeader("Set-Cookie", lucia.createSessionCookie(session.id).serialize())
        .redirect(`${WEB_URL}`);
    } catch (error) {
      next(error)
    }
  }

  getSession: ICallback = async (req, res, next) => {
    try {
      return res
        .status(200)
        .json({ status: "OK", user: res.locals.user, session: res.locals.session })

    } catch (error) {
      next(error)
    }
  }

}