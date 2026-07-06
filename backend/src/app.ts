import cors from 'cors';
import express from 'express';
import { env } from './config/env';
import { errorHandler } from './middlewares/error-handler';
import { appRouter } from './routes';

export const app = express();

app.use(
  cors({
    origin: env.CORS_ORIGIN,
  })
);
app.use(express.json());

app.use('/api', appRouter);
app.use(errorHandler);
