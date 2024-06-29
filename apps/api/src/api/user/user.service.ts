import { CreateUserRequest, UserFields } from "@/types/user.type.js"
import { prisma } from "@/db.js"
import { Validation } from "@/utils/validation.js"
import { UserValidation } from "./user.validation.js"
import { ResponseError } from "@/utils/error.response.js"
import { genSalt, hash } from "bcrypt"
import { generateId } from "lucia"
import { API_URL } from "@/config.js"
import { Response } from "express"

export class UserService {
  static createUser = async (req: CreateUserRequest, res: Response) => {
    let newUser = Validation.validate(UserValidation.createUser, req)
    if (!newUser.avatarUrl) {
      newUser.avatarUrl = `${API_URL}/public/images/avatar.png`
    }

    const findUser = await prisma.user.findUnique({
      where: {
        email: newUser.email,
      }
    })

    if (findUser) {
      throw new ResponseError(400, "Email already used!")
    }

    const salt = await genSalt(10)
    const hashed = await hash(newUser.password, salt)

    const user = await prisma.user.create({
      data: {
        ...newUser, referralCode: generateId(8), avatarUrl: newUser.avatarUrl, password: hashed
      },
      select: { ...UserFields }
    })

    if (user.role === "STORE_ADMIN") {
      await prisma.storeAdmin.create({
        data: {
          storeAdminId: user.id,
          storeId: res.locals.store?.id!
        }
      })
    }

    return user
  }

  static updateUser = async (id: string, req: Partial<CreateUserRequest>, res: Response) => {
    let updatedUser = Validation.validate(UserValidation.updateUser, req);

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
      })
    }

    return user;
  }

  static deleteUser = async (id: string) => {
    const user = await prisma.user.delete({
      where: { id },
      select: { ...UserFields }
    });

    return user;
  }
}