import 'dotenv/config';
import { z } from 'zod';

const Env = z.object({
  PORT: z.coerce.number().default(8080),
  CORS_ORIGIN: z.string().optional(),      
  DYNAMIC_ENV_ID: z.string().optional(),
});

export const env = Env.parse(process.env);
