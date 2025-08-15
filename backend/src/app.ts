import express from 'express';
import cors from 'cors';
import routes from './routes';
import { env } from './config/env';
import { errorHandler } from './middlewares/error.middleware';

export function createApp() {
  const app = express();
  app.use(express.json());
  if (env.CORS_ORIGIN) app.use(cors({ origin: env.CORS_ORIGIN.split(',') }));

  app.use(routes);
  app.use(errorHandler);
  return app;
}
