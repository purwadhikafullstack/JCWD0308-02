import { config } from 'dotenv';
import { resolve } from 'path';
import path from 'path';
import { fileURLToPath } from "url";

export const NODE_ENV = process.env.NODE_ENV || 'development';

const envFile = NODE_ENV === 'development' ? '.env.development' : '.env';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

config({ path: resolve(__dirname, `../${envFile}`) });
config({ path: resolve(__dirname, `../${envFile}.local`), override: true });

// Load all environment variables from .env file

export const PORT = process.env.PORT;

export const DATABASE_URL = process.env.DATABASE_URL || '';
export const DATABASE_NAME = process.env.DATABASE_NAME || '';
export const DATABASE_HOST = process.env.DATABASE_HOST || '';
export const DATABASE_PORT = +process.env.DATABASE_PORT! || 3306;
export const DATABASE_USER = process.env.DATABASE_USER || '';
export const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD || '';

export const GITHUB_OAUTH_URL = process.env.GITHUB_OAUTH_URL || '';
export const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || '';
export const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || '';

export const GOOGLE_OAUTH_URL = process.env.GOOGLE_OAUTH_URL || '';
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';

export const API_URL = process.env.API_URL || '';
export const WEB_URL = process.env.WEB_URL || '';

export const MAIL_USER = process.env.MAIL_USER || '';
export const MAIL_PASS = process.env.MAIL_PASS || '';
