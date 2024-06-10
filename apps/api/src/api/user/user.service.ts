import { CreateUserRequest, UserFields } from "@/types/user.type.js"
import { prisma } from "@/db.js"
import { Validation } from "@/utils/validation.js"
import { UserValidation } from "./user.validation.js"
import { ResponseError } from "@/utils/error.response.js"
import { genSalt, hash } from "bcrypt"
import { generateId } from "lucia"

export class UserService {
    static createUser = async (req: CreateUserRequest) => {
        let newUser = Validation.validate(UserValidation.createUser, req)
    
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
            ...newUser, referralCode: generateId(8),avatarUrl: "avatar.png", password: hashed
          },
          select: { ...UserFields }
        })
    
        return user
      }

      static updateUser = async (id: string, req: Partial<CreateUserRequest>) => {
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
            select: { ...UserFields }
        });

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