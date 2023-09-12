import { INestApplication } from '@nestjs/common';
import { pipeSetup } from './pipe.setup';
import { exceptionFilterSetup } from './exception-filter.setup';
import cookieParser from 'cookie-parser';

export const appConfig = (app: INestApplication) => {
  baseAppConfig(app);
  app.enableCors({
    origin: [],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  });
  return app;
};

export const baseAppConfig = (app: INestApplication) => {
  pipeSetup(app);
  exceptionFilterSetup(app);
  app.use(cookieParser());
};
