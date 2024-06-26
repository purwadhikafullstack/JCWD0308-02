import { ResponseError } from '@/utils/error.response.js';
import { Validation } from '@/utils/validation.js';
import { compare, genSalt, hash } from 'bcrypt';
import { generateId } from 'lucia';
import { AuthValidation } from './auth.validation.js';
import { RegisterRequest, SigninRequest } from '@/types/auth.type.js';
import { UserFields } from '@/types/user.type.js';
import { prisma } from '@/db.js';
import { github, google } from '@/auth.lucia.js';
import { AuthHelper, ICreateUserByGitHub } from './auth.helper.js';

export class AuthService {
  static registerByEmail = async (req: RegisterRequest) => {
    let userData = Validation.validate(AuthValidation.REGISTER, req);

    const findUser = await prisma.user.findUnique({
      where: {
        email: userData.email,
      },
    });

    if (findUser) {
      throw new ResponseError(400, 'Email already used!');
    }

    const salt = await genSalt(10);
    const hashed = await hash(userData.password, salt);

    const user = await prisma.user.create({
      data: {
        ...userData,
        referralCode: generateId(8),
        accountType: 'EMAIL',
        avatarUrl: 'avatar.png',
        status: 'ACTIVE',
        password: hashed,
      },
      select: { ...UserFields },
    });

    return user;
  };

  static signin = async (req: SigninRequest) => {
    let signinData = Validation.validate(AuthValidation.SIGNIN, req);

    let findUser = await prisma.user.findUnique({
      where: { email: signinData.email },
      select: { id: true, password: true },
    });

    if (!findUser) throw new ResponseError(400, 'Email or Password is wrong!');

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
}
