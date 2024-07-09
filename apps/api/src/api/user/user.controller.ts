import { ICallback } from '@/types/index.js';
import { prisma } from '@/db.js';
import { UserFields } from '@/types/user.type.js';
import { UserService } from './user.service.js';
import { ResponseError } from '@/utils/error.response.js';
import { lucia } from '@/auth.lucia.js';
import { AuthHelper } from '../auth/auth.helper.js';
import { AuthService } from '../auth/auth.service.js';

export class UserController {
  getUsers: ICallback = async (req, res) => {
    const { page, limit, search } = req.query;
    const pageNumber = parseInt(page as string, 10) || 1;
    const pageSize = parseInt(limit as string, 10) || 10;

    const filters: any = {};

    if (search) {
      filters.OR = [
        { email: { contains: search } },
        { displayName: { contains: search } }
      ];
    }

    const total = await prisma.user.count({
      where: filters,
    });

    const users = await prisma.user.findMany({
      where: filters,
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
      select: { ...UserFields, StoreAdmin: true },
    });

    return res.status(200).json({ users, total });
  }

  getUserById: ICallback = async (req, res) => {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: { ...UserFields },
    });

    if (!user) {
      return res.status(404);
    }

    return res.status(200).json(user);
  }

  getUserProfile: ICallback = async (req, res, next) => {
    try {
      if (!res.locals.user) throw new ResponseError(401, "Unauthorized")
      const user = await prisma.user.findUnique({
        where: { id: res.locals.user.id },
        select: { ...UserFields },
      });

      if (!user) {
        return res.status(404);
      }

      return res.status(200).json({ status: "Ok", user });
    } catch (error) {
      next(error)
    }
  }

  createUserByAdmin: ICallback = async (req, res, next) => {
    try {
      const user = await UserService.createUser(req.body, res)
      return res
        .status(201)
        .json({ status: "OK", message: "Good Job Admin! New User Created!", user })
    } catch (error) {
      next(error)
    }
  }

  checkToken: ICallback = async (req, res, next) => {
    const token = req.params.token

    try {
      const { user, isTokenExpired, newToken } = await AuthService.checkToken(token)

      if (!user) throw new ResponseError(400, "Your link is invalid!")

      return res
        .status(200)
        .json({ status: 'OK', user, isTokenExpired, newToken });
    } catch (error) {
      next(error);
    }
  };

  updateUser: ICallback = async (req, res, next) => {
    try {
      const user = await UserService.updateUser(req.body, req, res);

      return res.status(200).json({ status: "OK", message: "Your Profile Updated Successfully", user });
    } catch (error) {
      next(error);
    }
  }

  changeEmailRequest: ICallback = async (req, res, next) => {
    try {
      const user = await UserService.changeEmailRequest(req.body, req, res);

      return res.status(200).json({ status: "OK", message: "Change email request succeed, please check your email!", ...user });
    } catch (error) {
      next(error);
    }
  }

  changeEmail: ICallback = async (req, res, next) => {
    const token = req.params.token

    try {
      const { user, isTokenExpired } = await AuthService.checkToken(token)

      if (!user) throw new ResponseError(400, "Your link verification is invalid!")

      if (isTokenExpired) {
        await AuthService.resendToken(user.id)
        throw new ResponseError(400, "Your link verification is expired! please check your email, we already resend new email verification!")
      }

      const updatedUser = await UserService.changeEmail(req.body, req, res)

      await lucia.invalidateUserSessions(updatedUser.id)

      const session = await lucia.createSession(updatedUser.id, {});

      await AuthHelper.setCookies(updatedUser!, res)

      return res
        .status(200)
        .appendHeader(
          'Set-Cookie',
          lucia.createSessionCookie(session.id).serialize(),
        ).json({ status: "OK", message: "Your Email Updated Successfully", user: updatedUser });
    } catch (error) {
      next(error);
    }
  }

  changePassword: ICallback = async (req, res, next) => {
    try {
      const user = await UserService.changePassword(req.body, res);

      await lucia.invalidateUserSessions(user.id)

      const session = await lucia.createSession(user.id, {});

      await AuthHelper.setCookies(user!, res)

      return res.status(200)
        .appendHeader(
          'Set-Cookie',
          lucia.createSessionCookie(session.id).serialize(),
        ).json({ status: "OK", message: "Your Password Updated Successfully", user });
    } catch (error) {
      next(error);
    }
  }

  updateUserByAdmin: ICallback = async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await UserService.updateUserByAdmin(id, req.body, res);

      return res.status(200).json({ status: "OK", message: "User Updated Successfully", user });
    } catch (error) {
      next(error);
    }
  }

  deleteUserByAdmin: ICallback = async (req, res, next) => {
    try {
      const { id } = req.params;
      await UserService.deleteUser(id);

      return res.status(200).json({ status: "OK", message: "User Deleted Successfully" });
    } catch (error) {
      next(error);
    }
  }
}
