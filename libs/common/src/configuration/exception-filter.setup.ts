import { INestApplication } from '@nestjs/common';
import { ErrorExceptionFilter, ErrorFilter, HttpExceptionFilter } from './exception.filter';

export function exceptionFilterSetup(app: INestApplication) {
  app.useGlobalFilters(new ErrorFilter(), new HttpExceptionFilter(), new ErrorExceptionFilter());
}
