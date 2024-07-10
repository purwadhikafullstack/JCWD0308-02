import { github, google } from '@/auth.lucia.js';
import { AuthHelper } from './auth.helper.js';
export class OAuthService {
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
