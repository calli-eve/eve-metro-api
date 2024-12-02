import dotenv from 'dotenv';
import express from 'express';
import { z } from 'zod';
import { restrictHealthCheck, healthCheckHandler } from './handlers/health.js';
import { connectionsHandler } from './handlers/connections.js';
import { limiter, validateApiKey } from './middleware.js'; 
import fs from 'fs/promises'; 

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

const config = JSON.parse(await fs.readFile('./config.json', 'utf-8')); 
const envSchema = z.object({
  PORT: z.string().default('3000'),
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

const configSchema = z.object({
  apiKeys: z.array(z.string().uuid()),
});

const parsedConfig = configSchema.safeParse(config); 
if (!parsedConfig.success) {
  console.error('Invalid config:', parsedConfig.error.format());
  process.exit(1);
}

app.use(express.json());
app.use(limiter);
app.post('/connections', validateApiKey(parsedConfig), connectionsHandler);
app.get('/health', restrictHealthCheck, healthCheckHandler);
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});