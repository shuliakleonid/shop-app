import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'reflect-metadata';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log('-> init on 5011');
  await app.listen(5011);
}
bootstrap();
