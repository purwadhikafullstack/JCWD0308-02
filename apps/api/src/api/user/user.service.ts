import { CreateUserRequest, UserFields } from "@/types/user.type.js";
import { pool, prisma } from "@/db.js";
import { Validation } from "@/utils/validation.js";
import { ChangeEmailRequest, ChangePasswordRequest, UpdateUserRequest, UserValidation } from "./user.validation.js";
import { ResponseError } from "@/utils/error.response.js";
import { compare, genSalt, hash } from "bcrypt";
import { generateId } from "lucia";
import { API_URL } from "@/config.js";
import { Request, Response } from "express";
import { sendChangeEmail } from "@/utils/email.js";
import { deleteFile, getBaseUrl } from "@/utils/file.js";

export class UserService {
  static getUsers = async ({ page, limit, search }: { page: number, limit?: number, search: string }) => {
    const where = search ? {
      OR: [
        { email: { contains: search, mode: 'insensitive' } },
        { displayName: { contains: search, mode: 'insensitive' } }
      ]
    } : {};

    const total = await prisma.user.count({ where });
    const users = await prisma.user.findMany({
      where,
      skip: (page - 1) * (limit || total),
      take: limit,
      select: { ...UserFields, StoreAdmin: true },
    });

    return { total, page, limit: limit || total, users };
  };

  static createUser = async (req: CreateUserRequest, res: Response) => {
    let newUser = Validation.validate(UserValidation.createUser, req);
    if (!newUser.avatarUrl) {
      newUser.avatarUrl = `${API_URL}/public/images/avatar.png`;
    }

    const findUser = await prisma.user.findUnique({
      where: {
        email: newUser.email,
      }
    });

    if (findUser) {
      throw new ResponseError(400, "Email already used!");
    }

    const salt = await genSalt(10);
    const hashed = await hash(newUser.password, salt);

    const user = await prisma.user.create({
      data: {
        ...newUser, referralCode: generateId(8), avatarUrl: newUser.avatarUrl, password: hashed
      },
      select: { ...UserFields }
    });

    if (user.role === "STORE_ADMIN") {
      await prisma.storeAdmin.create({
        data: {
          storeAdminId: user.id,
          storeId: res.locals.store?.id!
        }
      });
    }

    return user;
  };

  static changeEmailRequest = async (body: ChangeEmailRequest, req: Request, res: Response) => {

    let updatedUser = Validation.validate(UserValidation.changeEmail, body);

    const findUser = await prisma.user.findUnique({ where: { id: res?.locals?.user?.id }, select: { password: true } })

    if (!findUser) throw new ResponseError(400, 'Incorrect password!');

    let validPassword = await compare(updatedUser.password, findUser.password!);

    if (!validPassword) throw new ResponseError(403, 'Incorrect password!');

    const findUserByNewEmail = await prisma.user.findUnique({ where: { email: updatedUser.newEmail }, select: { id: true } })

    if (findUserByNewEmail) throw new ResponseError(400, 'New email address is already used!');

    const newToken = await prisma.userTokens.create({
      data: {
        type: "EMAIL",
        token: generateId(64),
        tokenExpiresAt: new Date(Date.now() + 60 * 60 * 1000),
        newEmail: updatedUser.newEmail,
        userId: res.locals?.user?.id!,
      },
      include: {
        user: {
          select: { ...UserFields }
        }
      }
    })

    await sendChangeEmail({ email: newToken.newEmail!, token: newToken.token, displayName: newToken.user.displayName! });

    await pool.query(`
      CREATE EVENT ${newToken.token}
      ON SCHEDULE AT date_add(now(), INTERVAL 7 DAY)
      DO  
          DELETE FROM user_tokens WHERE id='${newToken.id}'
    `)

    return { token: newToken.token, user: newToken.user };
  };

  static changeEmail = async (body: ChangeEmailRequest, req: Request, res: Response) => {
    let userData = Validation.validate(UserValidation.changeEmail, body);

    const findUser = await prisma.user.findUnique({ where: { id: res?.locals?.user?.id }, select: { password: true } })

    if (!findUser) throw new ResponseError(400, 'Incorrect password!');

    let validPassword = await compare(userData.password, findUser.password!);

    if (!validPassword) throw new ResponseError(403, 'Incorrect password!');

    const findUserByNewEmail = await prisma.user.findUnique({ where: { email: userData.newEmail }, select: { id: true } })

    if (findUserByNewEmail) throw new ResponseError(400, 'New email address is already used!');

    const updatedUser = await prisma.user.update({
      where: { id: res?.locals?.user?.id },
      data: {
        email: userData.newEmail,
        contactEmail: userData.newEmail,
      },
      select: { ...UserFields },
    });

    await prisma.userTokens.deleteMany({ where: { userId: updatedUser.id, type: "EMAIL" } })

    return updatedUser;
  };

  static updateUser = async (body: UpdateUserRequest, req: Request, res: Response) => {

    if (req.file) body.avatarUrl = `${API_URL}/public/images/${req.file.filename}`

    let updatedUser = Validation.validate(UserValidation.updateUser, body);

    const currentUser = await prisma.user.findUnique({ where: { id: res.locals?.user?.id }, select: { avatarUrl: true } })

    if (getBaseUrl(API_URL) === getBaseUrl(currentUser?.avatarUrl!) && updatedUser.avatarUrl !== currentUser?.avatarUrl && currentUser?.avatarUrl !== `${API_URL}/public/images/avatar.png` ) {
      deleteFile(currentUser?.avatarUrl!)
    }

    const user = await prisma.user.update({
      where: { id: res?.locals?.user?.id! },
      data: {
        ...updatedUser,
      },
      select: { ...UserFields }
    });

    return user;
  };

  static changePassword = async (body: ChangePasswordRequest, res: Response) => {
    let updatedUser = Validation.validate(UserValidation.changePassword, body);

    let findUser = await prisma.user.findUnique({
      where: { id: res.locals?.user?.id! },
      select: { id: true, password: true },
    });

    if (!findUser) throw new ResponseError(400, 'Incorrect password!');

    let validPassword = await compare(updatedUser.password, findUser.password!);

    if (!validPassword) throw new ResponseError(403, 'Incorrect password!');

    const salt = await genSalt(10);
    const hashed = await hash(updatedUser.newPassword, salt);

    const user = await prisma.user.update({
      where: { id: res?.locals?.user?.id! },
      data: {
        password: hashed
      },
      select: { ...UserFields }
    });

    return user;
  };

  static updateUserByAdmin = async (id: string, req: Partial<CreateUserRequest>, res: Response) => {
    let updatedUser = Validation.validate(UserValidation.updateUserByAdmin, req);

    if (updatedUser.password) {
      const salt = await genSalt(10);
      updatedUser.password = await hash(updatedUser.password, salt);
    }

    const user = await prisma.user.update({
      where: { id },
      data: {
        ...updatedUser,
      },
      select: { ...UserFields, StoreAdmin: true }
    });

    if (user.role === "STORE_ADMIN" && user.StoreAdmin?.storeId !== res.locals.store?.id) {
      await prisma.storeAdmin.update({
        where: { storeAdminId: user.id },
        data: {
          storeId: res.locals.store?.id!
        }
      });
    }

    return user;
  };

  static deleteUser = async (id: string) => {
    const user = await prisma.user.delete({
      where: { id },
      select: { ...UserFields }
    });

    return user;
  };
}
