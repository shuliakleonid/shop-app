import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });

  const configService = app.get(ConfigService);
  const mainConfig = configService.get('main', { infer: true });
  const PORT = mainConfig.PORT_SHOPPING_SERVER;
  await app.listen(PORT);
}
bootstrap();
