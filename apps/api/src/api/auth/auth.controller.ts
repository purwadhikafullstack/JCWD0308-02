import { ICallback } from '@/types/index.js';
import { AuthService } from './auth.service.js';
import { github, google, lucia } from '@/auth.lucia.js';
import { ResponseError } from '@/utils/error.response.js';
import { generateCodeVerifier, generateState } from 'arctic';
import { NODE_ENV, WEB_URL } from '@/config.js';
import { AuthHelper, createOAuthCookie } from './auth.helper.js';
import { StoreService } from '../store/store.service.js';
import { prisma } from '@/db.js';
import { serializeCookie } from 'oslo/cookie';

export class AuthController {
  createUserByEmail: ICallback = async (req, res, next) => {
    try {
      const user = await AuthService.registerByEmail(req.body);

      return res
        .status(201)
        .json({
          status: 'OK',
          message: 'Welcome to Grosirun, please check your email to set your account!',
          user
        });
    } catch (error) {
      next(error);
    }
  };

  signin: ICallback = async (req, res, next) => {
    try {
      const user = await AuthService.signin(req.body);

      const session = await lucia.createSession(user!.id, {});

      await AuthHelper.setCookies(user!, res)

      return res
        .status(200)
        .appendHeader(
          'Set-Cookie',
          lucia.createSessionCookie(session.id).serialize(),
        )
        .json({ status: 'OK', message: 'Login Success', user });
    } catch (error) {
      next(error);
    }
  };

  signout: ICallback = async (req, res, next) => {
    try {
      if (!res.locals.session) throw new ResponseError(401, 'Unauthorized');

      await lucia.invalidateSession(res.locals.session.id);

      return res
        .status(200)
        .appendHeader(
          'Set-Cookie',
          lucia.createBlankSessionCookie().serialize(),
        )
        .clearCookie('storeId')
        .clearCookie('addressId')
        .json({ status: 'OK', message: 'Signout Success' });
    } catch (error) {
      next(error);
    }
  };

  getSession: ICallback = async (req, res, next) => {
    try {
      return res
        .status(200)
        .json({
          status: 'OK',
          user: res.locals.user,
          session: res.locals.session,
        });
    } catch (error) {
      next(error);
    }
  };

  checkToken: ICallback = async (req, res, next) => {
    const token = req.params.token

    try {
      const { user, isTokenExpired } = await AuthService.checkToken(token)

      if (!user) throw new ResponseError(400, "Your link is invalid!")

      return res
        .status(200)
        .json({ status: 'OK', user, isTokenExpired });
    } catch (error) {
      next(error);
    }
  };

  resendVerify: ICallback = async (req, res, next) => {
    const token = req.params.token

    try {
      const { user } = await AuthService.checkToken(token)

      if (!user) throw new ResponseError(400, "Your link verification is invalid!")

      const updatedUser = await AuthService.resendToken(user.id)

      return res
        .status(200)
        .json({
          status: 'OK',
          message: 'Welcome to Grosirun, please check your email to set your account!',
          user: updatedUser
        });
    } catch (error) {
      next(error);
    }
  };

  verifyAccount: ICallback = async (req, res, next) => {
    const token = req.params.token

    try {
      const { user, isTokenExpired } = await AuthService.checkToken(token)

      if (!user) throw new ResponseError(400, "Your link verification is invalid!")

      if (isTokenExpired) {
        await AuthService.resendToken(user.id)
        throw new ResponseError(400, "Your link verification is expired! please check your email, we already resend new email verification!")
      }

      const updatedUser = await AuthService.verifyAccount(req.body, user.id)

      return res
        .status(200)
        .json({
          status: 'OK',
          message: 'Welcome to Grosirun, you can signin now!',
          user: updatedUser
        });
    } catch (error) {
      next(error);
    }
  };

  resetRequest: ICallback = async (req, res, next) => {
    try {

      await AuthService.resetRequest(req.body)

      res
        .status(200)
        .json({ status: 'OK', message: "Please check your email, we already send you link reset password" })
    } catch (error) {
      next(error);
    }
  }

  resetPassword: ICallback = async (req, res, next) => {
    const token = req.params.token
    try {
      const { user, isTokenExpired } = await AuthService.checkToken(token)

      if (!user) throw new ResponseError(400, "Your link reset password is invalid!")

      if (isTokenExpired) throw new ResponseError(400, "Your link reset password is expired!")

      const updatedUser = await AuthService.resetPassword(req.body, user?.id!)

      await lucia.invalidateUserSessions(updatedUser.id)

      const session = await lucia.createSession(updatedUser.id, {});

      await AuthHelper.setCookies(user!, res)

      return res
        .status(200)
        .appendHeader(
          'Set-Cookie',
          lucia.createSessionCookie(session.id).serialize(),
        )
        .json({ status: 'OK', message: "Your account password has been reset!", user: updatedUser })
    } catch (error) {
      next(error);
    }
  }
}
