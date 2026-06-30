import dotenv from 'dotenv';
import { z } from 'zod';
import path from 'path';

// Load .env file
dotenv.config({ path: path.join(__dirname, '../../.env') });

const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  MONGODB_URI: z.string().default('mongodb://localhost:27017/food-discovery'),
  JWT_ACCESS_SECRET: z.string().min(8, 'Access token secret must be at least 8 characters'),
  JWT_REFRESH_SECRET: z.string().min(8, 'Refresh token secret must be at least 8 characters'),
  JWT_ACCESS_EXPIRATION: z.string().default('15m'),
  JWT_REFRESH_EXPIRATION: z.string().default('7d'),
  CORS_ORIGIN: z.string().default('*'),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error('Invalid environment variables:', result.error.format());
  process.exit(1);
}

export const env = result.data;
export type EnvType = z.infer<typeof envSchema>;
