import { ICallback } from '@/types/index.js';
import { prisma } from '@/db.js';
import { UserFields } from '@/types/user.type.js';

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
}