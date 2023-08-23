import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const swaggerConfig = (app: INestApplication, name: string) => {
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Shop-app')
    .setDescription('')
    .setVersion('')
    .addBearerAuth()
    .addBasicAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  return SwaggerModule.setup(name, app, document);
};
