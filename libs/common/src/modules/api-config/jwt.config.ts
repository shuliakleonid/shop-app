import process from 'process';
import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  EXPIRED_ACCESS: process.env.EXPIRED_ACCESS,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  EXPIRED_REFRESH: process.env.EXPIRED_REFRESH,
}));
