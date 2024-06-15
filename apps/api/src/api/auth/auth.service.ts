import { ResponseError } from "@/utils/error.response.js"
import { Validation } from "@/utils/validation.js"
import { compare, genSalt, hash } from "bcrypt"
import { generateId } from "lucia"
import { AuthValidation } from "./auth.validation.js"
import { RegisterRequest, SigninRequest } from "@/types/auth.type.js"
import { UserFields } from "@/types/user.type.js"
import { prisma } from "@/db.js"

export class AuthService {
  static registerByEmail = async (req: RegisterRequest) => {
    let userData = Validation.validate(AuthValidation.REGISTER, req)

    const findUser = await prisma.user.findUnique({
      where: {
        email: userData.email,
      }
    })

    if (findUser) {
      throw new ResponseError(400, "Email already used!")
    }

    const salt = await genSalt(10)
    const hashed = await hash(userData.password, salt)

    const user = await prisma.user.create({
      data: {
        ...userData, referralCode: generateId(8), accountType: "EMAIL", avatarUrl: "avatar.png", status: "ACTIVE", password: hashed
      },
      select: { ...UserFields }
    })

    return user
  }

  static signin = async (req: SigninRequest) => {
    let signinData = Validation.validate(AuthValidation.SIGNIN, req)

    let findUser = await prisma.user.findUnique({ where: { email: signinData.email }, select: { id: true, password: true } })

    if (!findUser) throw new ResponseError(400, 'Email or Password is wrong!')

    let validPassword = await compare(signinData.password, findUser.password!)

    if (!validPassword) throw new ResponseError(403, 'Incorrect email or password!')

    return await prisma.user.findUnique({ where: { id: findUser.id }, select: { ...UserFields } })!
  }
}