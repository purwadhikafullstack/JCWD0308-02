import { ICallback } from '@/types/index.js';
import { github, google, lucia } from '@/auth.lucia.js';
import { ResponseError } from '@/utils/error.response.js';
import { generateCodeVerifier, generateState } from 'arctic';
import { WEB_URL } from '@/config.js';
import { AuthHelper, createOAuthCookie } from './auth.helper.js';
import { OAuthService } from './oauth.service.js';

export class OAuthController {
  github: ICallback = async (req, res, next) => {
    try {
      const state = generateState();
      const url = await github.createAuthorizationURL(state, {
        scopes: ['user:email'],
      });

      res
        .appendHeader(
          'Set-Cookie',
          createOAuthCookie('github_oauth_state', state),
        )
        .redirect(url.toString());
    } catch (error) {
      next(error);
    }
  };

  githubCallback: ICallback = async (req, res, next) => {
    const { code, state, storedState } = AuthHelper.getGitHubCodesFromURL(req);
    try {
      if (!code || !state || !storedState || state !== storedState)
        throw new ResponseError(400, '');

      const user = await OAuthService.githubOAuth(code);

      const session = await lucia.createSession(user.id, {});

      await AuthHelper.setCookies(user!, res)

      return res
        .clearCookie('github_oauth_state')
        .appendHeader(
          'Set-Cookie',
          lucia.createSessionCookie(session.id).serialize(),
        )
        .redirect(`${WEB_URL}`);
    } catch (error) {
      next(error);
    }
  };

  google: ICallback = async (req, res, next) => {
    try {
      const state = generateState();
      const codeVerifier = generateCodeVerifier();
      const url = await google.createAuthorizationURL(state, codeVerifier, {
        scopes: ['profile', 'email'],
      });

      res
        .appendHeader(
          'Set-Cookie',
          createOAuthCookie('google_oauth_state', state),
        )
        .appendHeader(
          'Set-Cookie',
          createOAuthCookie('google_code_verifier', codeVerifier),
        )
        .redirect(url.toString());
    } catch (error) {
      next(error);
    }
  };

  googleCallback: ICallback = async (req, res, next) => {
    const { code, state, storedState, codeVerifier } = AuthHelper.getGoogleCodesFromURL(req);
    try {
      if (
        !code ||
        !state ||
        !storedState ||
        state !== storedState ||
        !codeVerifier
      )
        throw new ResponseError(400, '');

      const user = await OAuthService.googleOAuth(code, codeVerifier);

      const session = await lucia.createSession(user.id, {});

      await AuthHelper.setCookies(user!, res)

      return res
        .clearCookie('google_oauth_state')
        .clearCookie('google_code_verifier')
        .appendHeader(
          'Set-Cookie',
          lucia.createSessionCookie(session.id).serialize(),
        )
        .redirect(`${WEB_URL}`);
    } catch (error) {
      next(error);
    }
  };
}
