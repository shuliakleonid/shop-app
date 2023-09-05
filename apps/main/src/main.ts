import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appConfig } from '@common/configuration/app.config';
import { swaggerConfig } from '@common/configuration/swagger/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });
  const createdApp = appConfig(app);
  swaggerConfig(createdApp, 'swagger-main');
  await createdApp.listen(5010);
}
bootstrap();
