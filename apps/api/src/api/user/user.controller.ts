import { ICallback } from '@/types/index.js';
import { prisma } from '@/db.js';
import { UserFields } from '@/types/user.type.js';
import { UserService } from './user.service.js';
import { lucia } from '@/auth.lucia.js';

export class UserController {

  getUsers: ICallback = async (req, res) => {
    const users = await prisma.user.findMany();

    return res.status(200).json({ users });
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

  createUserByAdmin: ICallback = async (req, res, next) => {
    try {
      const user = await UserService.createUser(req.body)

      const session = await lucia.createSession(user.id, {})

      return res
        .status(201)
        .appendHeader("Set-Cookie", lucia.createSessionCookie(session.id).serialize())
        .json({ status: "OK", message: "Good Job Admin! New User Created!", user })
    } catch (error) {
      next(error)
    }
  }

  updateUserByAdmin: ICallback = async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await UserService.updateUser(id, req.body);

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