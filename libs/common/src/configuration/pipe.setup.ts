import { BadRequestException, INestApplication, ValidationPipe } from '@nestjs/common';

export function pipeSetup(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      stopAtFirstError: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
      exceptionFactory: errors => {
        const errorsForRes = [];
        errors.forEach(e => {
          for (const eKey in e.constraints) {
            errorsForRes.push({
              field: e.property,
              message: e.constraints[eKey],
            });
          }
        });
        throw new BadRequestException(errorsForRes);
      },
    }),
  );
}
