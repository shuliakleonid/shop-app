import { Module } from '@nestjs/common';
import { ApiConfigService } from './api.config.service';
import { configuration } from './configuration';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
        // PORT: Joi.number(),
        // PORT_IMAGES: Joi.number(),
        // PORT_PAYMENTS: Joi.number(),
        //
        // SERVER_URL_MAIN: Joi.string(),
        // SERVER_URL_CART: Joi.string(),
        // SERVER_URL_CATALOG: Joi.string(),
        // SERVER_URL_ORDERS: Joi.string(),
        //
        // CORS_ORIGIN: Joi.string().required(),
        //
        // DATABASE_URL: Joi.string().required(),
        //
        // ACCESS_TOKEN_SECRET: Joi.string().required(),
        // EXPIRED_ACCESS: Joi.string().required(),
        // REFRESH_TOKEN_SECRET: Joi.string().required(),
        // EXPIRED_REFRESH: Joi.string().required(),
      }),
      expandVariables: true,
    }),
  ],
  providers: [ApiConfigService],
  exports: [ApiConfigService],
})
export class ApiConfigModule {}
