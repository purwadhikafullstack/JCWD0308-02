import { UserFields } from '@/types/user.type.js';
import { GITHUB_OAUTH_URL, GOOGLE_OAUTH_URL, NODE_ENV } from '@/config.js';
import { prisma } from '@/db.js';
import { AccountType, Prisma } from '@prisma/client';
import { Request, Response } from 'express';
import { generateId } from 'lucia';
import { CookieAttributes, parseCookies, serializeCookie } from 'oslo/cookie';
import { user } from './auth.validation.js';
import { sendWelcomeOAuth } from '@/utils/email.js';

export interface ICreateUserByEmail extends Prisma.UserCreateInput {
  email: string;
  contactEmail: string;
  accountType: 'EMAIL';
}

export interface ICreateUserByOAuth extends Prisma.UserCreateInput {
  contactEmail: string;
  providerId: string;
  accountType: AccountType;
  status: 'ACTIVE';
}

export interface ICreateUserByGitHub extends ICreateUserByOAuth {
  accountType: 'GITHUB';
}

export interface ICreateUserByGoogle extends ICreateUserByOAuth {
  accountType: 'GOOGLE';
}

export const createOAuthCookie = (name: string, value: string) => {
  return serializeCookie(name, value, {
    path: '/',
    secure: NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: 'lax',
  });
};

export class AuthHelper {
  static getGitHubCodesFromURL = (req: Request) => {
    const code = req.query?.code?.toString() ?? null;
    const state = req.query?.state?.toString() ?? null;
    const storedState =
      parseCookies(req.headers.cookie ?? '').get('github_oauth_state') ?? null;
    return { code, state, storedState };
  };

  static getGoogleCodesFromURL = (req: Request) => {
    const code = req.query?.code?.toString() ?? null;
    const state = req.query?.state?.toString() ?? null;
    const storedState =
      parseCookies(req.headers.cookie ?? '').get('google_oauth_state') ?? null;
    const codeVerifier =
      parseCookies(req.headers.cookie ?? '').get('google_code_verifier') ??
      null;
    return { code, state, storedState, codeVerifier };
  };

  static getGitHubUserData = (token: string) => {
    return fetch(`${GITHUB_OAUTH_URL}/user`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  static setCookies = async (user: user, res: Response) => {
    
    if (user?.role === "STORE_ADMIN") {
      const store = await prisma.storeAdmin.findUnique({ where: { storeAdminId: user!.id } })
      AuthHelper.setStoreIdCookie(res, store?.storeId!)
    }

    if (user?.role === "SUPER_ADMIN") {
      const store = await prisma.store.findFirst({ orderBy: { createdAt: 'asc' } })
      AuthHelper.setStoreIdCookie(res, store?.id!)
    }

    if (user?.role === "USER") {
      const address = await prisma.userAddress.findFirst({ where: {userId: user.id, isMainAddress: true } })
      AuthHelper.setAddressIdCookie(res, address?.id!)
    }
  }

  static setStoreIdCookie = (res: Response, storeId: string) => {
    res.appendHeader("Set-Cookie", serializeCookie('storeId', storeId!, {
      path: '/',
      secure: NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30,
      sameSite: 'lax',
    }))
  };

  static setAddressIdCookie = (res: Response, addressId: string) => {
    res.appendHeader("Set-Cookie", serializeCookie('addressId', addressId!, {
      path: '/',
      secure: NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30,
      sameSite: 'lax',
    }))
  };

  static getGoogleUserData = async (token: string) => {
    return (
      await fetch(`${GOOGLE_OAUTH_URL}/v1/userinfo`, {
        headers: { Authorization: `Bearer ${token}` },
      })
    ).json();
  };

  static getGitHubUserEmail = (token: string) => {
    return fetch(`${GITHUB_OAUTH_URL}/user/emails`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  static getGitHubUser = async (
    token: string,
  ): Promise<ICreateUserByGitHub> => {
    const [githubUser, githubUserEmail] = await Promise.all([
      (await this.getGitHubUserData(token)).json(),
      (await this.getGitHubUserEmail(token)).json(),
    ]);

    return {
      accountType: 'GITHUB',
      status: 'ACTIVE',
      providerId: `${githubUser.id}`,
      displayName: githubUser.login,
      referralCode: generateId(8),
      avatarUrl: githubUser.avatar_url,
      contactEmail: githubUser.email || githubUserEmail[0].email,
    };
  };

  static getGoogleUser = async (token: string): Promise<any> => {
    const googleUser = await this.getGoogleUserData(token);

    return {
      accountType: 'GOOGLE',
      status: 'ACTIVE',
      providerId: `${googleUser.sub}`,
      displayName: googleUser.name,
      referralCode: generateId(8),
      avatarUrl: googleUser.picture,
      contactEmail: googleUser.email,
    };
  };

  static createUserByGitHub = async (data: ICreateUserByGitHub) => {
    const user = await prisma.user.create({ data });
    await sendWelcomeOAuth({email: user.contactEmail!, displayName: user.displayName!})
    return user
  };

  static createUserByGoogle = async (data: ICreateUserByGoogle) => {
    const user = await prisma.user.create({ data });
    await sendWelcomeOAuth({email: user.contactEmail!, displayName: user.displayName!})
    return user
  };

  static getUserByOAuthId = async (data: ICreateUserByOAuth) => {
    return await prisma.user.findFirst({
      where: {
        AND: [
          { accountType: data.accountType },
          { providerId: data.providerId },
        ],
      },
    });
  };
}
