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

export const PORT = process.env.PORT || 8000;
export const DATABASE_URL = process.env.DATABASE_URL || '';
