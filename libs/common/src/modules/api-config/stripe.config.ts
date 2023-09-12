import process from 'process';
import { registerAs } from '@nestjs/config';

export default registerAs('stripe', () => ({
  API_KEY_STRIPE: process.env.API_KEY_STRIPE,
  SECRET_HOOK_STRIPE: process.env.SECRET_HOOK_STRIPE,
  STRIPE_CURRENCY: process.env.STRIPE_CURRENCY,
  TEST_CLIENT_URL: process.env.TEST_CLIENT_URL,
}));
