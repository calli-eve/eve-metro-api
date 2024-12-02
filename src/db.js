import knex from 'knex';
import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  DB_HOST: z.string(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),
});

const parsedEnv = envSchema.safeParse(process.env);
if (!parsedEnv.success) {
  console.error('Invalid environment variables:', parsedEnv.error.format());
  process.exit(1);
}

const db = knex({
  client: 'pg',
  connection: {
    host: parsedEnv.data.DB_HOST,
    user: parsedEnv.data.DB_USER,
    password: parsedEnv.data.DB_PASSWORD,
    database: parsedEnv.data.DB_NAME,
  },
});

export default db; 