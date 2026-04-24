import { z } from 'zod';
import path from 'path';
import dotenv from 'dotenv';

/**
 * Identify environment and load corresponding .env file
 */
const APP_ENV = process.env['APP_ENV'] ?? 'dev';
dotenv.config({ path: path.resolve(process.cwd(), `.env.${APP_ENV}`) });

/**
 * Define Environment Schema
 */
const envSchema = z.object({
  APP_ENV: z.enum(['dev', 'staging', 'prod']).default('dev'),
  PAGE_URL: z.string().url(),
  PAGE_ADMIN_USERNAME: z.string().min(1),
  PAGE_ADMIN_PASSWORD: z.string().min(1),
  PAGE_USER_USERNAME: z.string().min(1),
  PAGE_USER_PASSWORD: z.string().min(1),
  DB_HOST: z.string().min(1),
  DB_NAME: z.string().min(1),
  DB_USER: z.string().min(1),
  DB_PASSWORD: z.string().min(1),
  TEST_KEY: z.string().min(1)
});

/**
 * Validate process.env
 * Inject APP_ENV explicitly to ensure it reflects the resolved value,
 * not whatever (or nothing) is inside the .env file.
 */
const result = envSchema.safeParse({
  ...process.env,
  APP_ENV, // explicit override — resolved before dotenv ran
});

if (!result.success) {
  console.error('Invalid environment variables:', result.error.format());
  process.exit(1);
}

/**
 * Export validated Configuration
 */
export const CONFIG = {
  ROOT: {
    STORAGE_PATH: path.resolve(process.cwd(), '.auth/storage-state.json'),
  },
  ENV: result.data,
} as const;

export type EnvConfig = typeof CONFIG;
