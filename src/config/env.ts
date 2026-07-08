import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('3000'),
  DATABASE_URL: z.string().default('postgres://dummy:dummy@localhost:5432/dummy'),
  REDIS_URL: z.string().default('redis://localhost:6379'),
  JWT_SECRET: z.string().default('super_secret_dummy_jwt_key_12345!'),
  OLLAMA_BASE_URL: z.string().default('http://localhost:11434'),
});

export const env = envSchema.parse(process.env);
