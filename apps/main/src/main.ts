import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appConfig } from '@common/configuration/app.config';
import { swaggerConfig } from '@common/configuration/swagger/swagger.config';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });
  const configService = app.get(ConfigService);
  const mainConfig = configService.get('main', { infer: true });
  const PORT = mainConfig.PORT_MAIN;

  const createdApp = appConfig(app);

  swaggerConfig(createdApp, 'swagger-main');
  await createdApp.listen(PORT);
}
bootstrap();
