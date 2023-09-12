import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
        PORT_MAIN: Joi.number(),
        PORT_ORDERS_SERVER: Joi.number(),
        PORT_CATALOG_SERVER: Joi.number(),
        PORT_SHOPPING_SERVER: Joi.number(),
        API_KEY_STRIPE: Joi.string(),
        SECRET_HOOK_STRIPE: Joi.string(),
        TEST_CLIENT_URL: Joi.string(),
        STRIPE_CURRENCY: Joi.string(),
        DATABASE_URL: Joi.string(),
        CORS_ORIGIN: Joi.string(),
        ACCESS_TOKEN_SECRET: Joi.string(),
        EXPIRED_ACCESS: Joi.string(),
        REFRESH_TOKEN_SECRET: Joi.string(),
        EXPIRED_REFRESH: Joi.string(),
      }),
      expandVariables: true,
    }),
  ],
  providers: [],
  exports: [],
})
export class ApiConfigModule {}
