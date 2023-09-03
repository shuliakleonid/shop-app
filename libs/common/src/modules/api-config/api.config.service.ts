import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvType } from './configuration';

@Injectable()
export class ApiConfigService {
  constructor(private configService: ConfigService<EnvType>) {}

  get NODE_ENV(): string {
    return this.configService.get('NODE_ENV', { infer: true });
  }

  get PORT(): number {
    return +this.configService.get('PORT', { infer: true }) || 3000;
  }

  get SERVER_URL_MAIN(): string {
    return this.configService.get('url_apps.SERVER_URL_MAIN', { infer: true });
  }

  get SERVER_URL_CART(): string {
    return this.configService.get('url_apps.SERVER_URL_CART', { infer: true });
  }

  get SERVER_URL_CATALOG(): string {
    return this.configService.get('url_apps.SERVER_URL_CATALOG', { infer: true });
  }

  get SERVER_URL_ORDERS(): string {
    return this.configService.get('url_apps.SERVER_URL_ORDERS', { infer: true });
  }

  get CORS_ORIGIN(): string {
    return this.configService.get('CORS_ORIGIN', { infer: true });
  }

  get DATABASE_URL(): string {
    return this.configService.get('database.DATABASE_URL', { infer: true });
  }

  get ACCESS_TOKEN_SECRET(): string {
    return this.configService.get('jwt.ACCESS_TOKEN_SECRET', { infer: true });
  }

  get EXPIRED_ACCESS(): string {
    return this.configService.get('jwt.EXPIRED_ACCESS', { infer: true });
  }

  get REFRESH_TOKEN_SECRET(): string {
    return this.configService.get('jwt.REFRESH_TOKEN_SECRET', { infer: true });
  }

  get EXPIRED_REFRESH(): string {
    return this.configService.get('jwt.EXPIRED_REFRESH', { infer: true });
  }

  get TOKEN_NGROK(): string {
    return this.configService.get('dev.TOKEN_NGROK', { infer: true });
  }

  get API_KEY_STRIPE(): string {
    return this.configService.get('payment.stripe.API_KEY_STRIPE', { infer: true });
  }

  get SECRET_HOOK_STRIPE(): string {
    return this.configService.get('payment.stripe.SECRET_HOOK_STRIPE', { infer: true });
  }

  get TEST_CLIENT_URL(): string {
    return this.configService.get('dev.TEST_CLIENT_URL', { infer: true });
  }

  get STRIPE_CURRENCY(): string {
    return this.configService.get('payment.stripe.STRIPE_CURRENCY', { infer: true });
  }
}
