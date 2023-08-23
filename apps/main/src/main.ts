import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appConfig } from '../../../libs/common/src/configuration/app.config';
import { swaggerConfig } from '../../../libs/common/src/configuration/swagger/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const createdApp = appConfig(app);
  swaggerConfig(createdApp, 'swagger-main');

  await createdApp.listen(5010);
}
bootstrap();
