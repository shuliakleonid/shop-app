import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'reflect-metadata';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });
  const configService = app.get(ConfigService);
  const mainConfig = configService.get('main', { infer: true });
  const PORT = mainConfig.PORT_CATALOG_SERVER;

  await app.listen(PORT);
}
bootstrap();
