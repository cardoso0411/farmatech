import { config } from 'dotenv';
import { z } from 'zod';

config();

const databaseUrlFromLegacyConfig =
  process.env.DATABASE_URL ||
  (process.env.DB_HOST && process.env.DB_USER && process.env.DB_NAME
    ? `mysql://${process.env.DB_USER}:${process.env.DB_PASSWORD ?? ''}@${process.env.DB_HOST}:${
        process.env.DB_PORT ?? '3306'
      }/${process.env.DB_NAME}`
    : undefined);

const envSchema = z.object({
  PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL é obrigatória.'),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
});

export const env = envSchema.parse({
  ...process.env,
  DATABASE_URL: databaseUrlFromLegacyConfig,
});
