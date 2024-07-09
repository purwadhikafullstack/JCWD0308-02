import { ResponseError } from '@/utils/error.response.js';
import { Validation } from '@/utils/validation.js';
import { compare, genSalt, hash } from 'bcrypt';
import { generateId } from 'lucia';
import { AuthValidation, RegisterRequest, ResetPasswordRequest, SetAccountRequest } from './auth.validation.js';
import { SigninRequest } from '@/types/auth.type.js';
import { UserFields } from '@/types/user.type.js';
import { pool, prisma } from '@/db.js';
import { github, google } from '@/auth.lucia.js';
import { AuthHelper, ICreateUserByGitHub } from './auth.helper.js';
import { API_URL } from '@/config.js';
import { sendEmailVerification, sendResetPassword } from '@/utils/email.js';

export class AuthService {
  static registerByEmail = async (req: RegisterRequest) => {
    console.log(req);

    let userData = Validation.validate(AuthValidation.REGISTER, req);

    const findUser = await prisma.user.findUnique({
      where: {
        email: userData.email,
      },
    });

    if (findUser?.status === "ACTIVE") {
      throw new ResponseError(400, 'Email already used!');
    }

    if (findUser?.status === "INACTIVE") {
      const verifyToken = await prisma.userTokens.create({
        data: {
          userId: findUser.id,
          token: generateId(64),
          tokenExpiresAt: new Date(Date.now() + 60 * 60 * 1000),
        }
      })
      await sendEmailVerification({ email: findUser.email!, token: verifyToken.token });

      await pool.query(`
      CREATE EVENT ${verifyToken.token}
      ON SCHEDULE AT date_add(now(), INTERVAL 7 DAY)
      DO  
          DELETE FROM user_tokens WHERE id='${verifyToken.id}'
    `)

      throw new ResponseError(400, 'Email already registered, Please check your email to verify your account!');
    }

    const user = await prisma.user.create({
      data: {
        ...userData,
        referralCode: generateId(8),
        contactEmail: userData.email,
        accountType: 'EMAIL',
        avatarUrl: `${API_URL}/public/images/avatar.png`,
      },
      select: { ...UserFields },
    });

    const verifyToken = await prisma.userTokens.create({
      data: {
        userId: user.id,
        token: generateId(64),
        tokenExpiresAt: new Date(Date.now() + 60 * 60 * 1000),
      }
    })

    await sendEmailVerification({ email: user.email!, token: verifyToken.token! });

    await pool.query(`
      CREATE EVENT ${verifyToken.token}
      ON SCHEDULE AT date_add(now(), INTERVAL 7 DAY)
      DO  
          DELETE FROM user_tokens WHERE id='${verifyToken.id}'
    `)

    return { user, token: verifyToken.token };
  };

  static checkToken = async (token: string) => {
    const findToken = await prisma.userTokens.findUnique({
      where: { token: token },
      include: {
        user: { select: { ...UserFields } }
      }
    });
    let isTokenExpired = false

    if (findToken?.tokenExpiresAt! < new Date()) {
      isTokenExpired = true
    }

    return { user: findToken?.user, isTokenExpired, newToken: findToken };
  }

  static resendToken = async (userId: string) => {
    const newToken = await prisma.userTokens.create({
      data: {
        userId,
        token: generateId(64),
        tokenExpiresAt: new Date(Date.now() + 60 * 60 * 1000)
      },
      include: {
        user: true,
      }
    })

    await sendEmailVerification({ email: newToken.user.email!, token: newToken.token });

    await pool.query(`
      CREATE EVENT ${newToken.token}
      ON SCHEDULE AT date_add(now(), INTERVAL 7 DAY)
      DO  
          DELETE FROM user_tokens WHERE id='${newToken.id}'
    `)

    return { user: newToken.user, token: newToken.token, newToken }
  }

  static verifyAccount = async (req: SetAccountRequest, userId: string) => {
    let userData = Validation.validate(AuthValidation.SETACCOUNT, req);

    const salt = await genSalt(10);
    const hashed = await hash(userData.password, salt);

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...userData,
        status: 'ACTIVE',
        password: hashed,
      },
      select: { ...UserFields },
    });

    await prisma.userTokens.deleteMany({ where: { userId: user.id, type: "REGISTER" } })

    return user;
  };

  static signin = async (req: SigninRequest) => {
    let signinData = Validation.validate(AuthValidation.SIGNIN, req);

    let findUser = await prisma.user.findUnique({
      where: { email: signinData.email },
      select: { id: true, password: true },
    });

    if (!findUser) throw new ResponseError(400, 'Incorrect email or password!');

    let validPassword = await compare(signinData.password, findUser.password!);

    if (!validPassword)
      throw new ResponseError(403, 'Incorrect email or password!');

    return await prisma.user.findUnique({
      where: { id: findUser.id },
      select: { ...UserFields },
    })!;
  };

  static githubOAuth = async (code: string) => {
    const tokens = await github.validateAuthorizationCode(code);
    const githubUser = await AuthHelper.getGitHubUser(tokens.accessToken);

    const existingUser = await AuthHelper.getUserByOAuthId(githubUser);

    if (existingUser) return existingUser;

    return await AuthHelper.createUserByGitHub(githubUser);
  };

  static googleOAuth = async (code: string, codeVerifier: string) => {
    const tokens = await google.validateAuthorizationCode(code, codeVerifier);
    const googleUser = await AuthHelper.getGoogleUser(tokens.accessToken);

    const existingUser = await AuthHelper.getUserByOAuthId(googleUser);

    if (existingUser) return existingUser;

    return await AuthHelper.createUserByGoogle(googleUser);
  };

  static resetRequest = async (req: RegisterRequest) => {
    let userData = Validation.validate(AuthValidation.REGISTER, req)

    const findUser = await prisma.user.findUnique({ where: { email: userData.email, accountType: 'EMAIL' } })

    if (!findUser) throw new ResponseError(404, "Cannot find account with this email!")

    const reset = await prisma.userTokens.create({
      data: {
        userId: findUser.id,
        token: generateId(64), type: 'RESET',
        tokenExpiresAt: new Date(Date.now() + 60 * 60 * 1000),
      }
    })

    await sendResetPassword({ email: findUser.email!, token: reset.token, displayName: findUser.displayName! })

    await pool.query(`
      CREATE EVENT ${reset.token}
      ON SCHEDULE AT date_add(now(), INTERVAL 1 HOUR)
      DO  
          DELETE FROM user_tokens WHERE id='${reset.id}'
    `)

    return
  }

  static resetPassword = async (req: ResetPasswordRequest, userId: string) => {
    let userData = Validation.validate(AuthValidation.RESET, req)

    const salt = await genSalt(10);
    const hashed = await hash(userData.password, salt);

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashed,
      },
      select: { ...UserFields }
    })

    await prisma.userTokens.deleteMany({
      where: { type: "RESET", userId: updatedUser.id },
    })

    return updatedUser
  }
}
