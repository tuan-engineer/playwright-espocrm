import { z } from 'zod';
import path from 'path';
import dotenv from 'dotenv';

// Set default environment for startup like: dev, staging, prod
const envFile = '.env.dev';
// Place website-specific configurations here, if any
const configs = {
  STORAGE_PATH: path.resolve(process.cwd(), '.auth/storage-state.json'),
};

dotenv.config({ path: path.resolve(process.cwd(), process.env['ENV_FILE'] ?? envFile) });
const envSchema = z.object({
  TEST_KEY: z
    .enum(['LOCAL_TESTING', 'STAG_TESTING', 'UAT_TESTING', 'PROD_TESTING'])
    .default('LOCAL_TESTING'),
  BASE_URL: z.string().url().default('http://localhost/espocrm'),
  ADMIN_USERNAME: z.string().default('admin'),
  ADMIN_PASSWORD: z.string().default('1'),
  USER_USERNAME: z.string().default('user'),
  USER_PASSWORD: z.string().default('1'),
  DATABASE_HOST: z.string().default('localhost'),
  DATABASE_NAME: z.string().default('espocrm'),
  DATABASE_USER: z.string().default('root'),
  DATABASE_PASSWORD: z.string().default(''),
});
const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.error(
    '[Config Error]: Invalid environment variables:',
    JSON.stringify(parsed.error.format(), null, 2),
  );
  process.exit(1);
}
export const CONFIG = {
  ROOT: configs,
  ENV: parsed.data,
} as const;
export type EnvConfig = typeof CONFIG;
