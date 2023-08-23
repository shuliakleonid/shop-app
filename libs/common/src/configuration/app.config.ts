import { INestApplication } from '@nestjs/common';
import { pipeSetup } from './pipe.setup';
import { exceptionFilterSetup } from './exception-filter.setup';
import cookieParser from 'cookie-parser';

export const appConfig = (app: INestApplication) => {
  baseAppConfig(app);
  app.enableCors({
    origin: [
      // 'http://localhost:3000',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  });
  return app;
};

export const baseAppConfig = (app: INestApplication) => {
  //pipe validation
  pipeSetup(app);
  //exception filter
  exceptionFilterSetup(app);
  //add work with cookies
  app.use(cookieParser());
};
