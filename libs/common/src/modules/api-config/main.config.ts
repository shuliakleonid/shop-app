import { registerAs } from '@nestjs/config';
import process from 'process';

export default registerAs('main', () => ({
  NODE_ENV: process.env.NODE_ENV,

  PORT_MAIN: process.env.PORT_MAIN_SERVER,
  PORT_ORDERS_SERVER: process.env.PORT_ORDERS_SERVER,
  PORT_CATALOG_SERVER: process.env.PORT_CATALOG_SERVER,
  PORT_SHOPPING_SERVER: process.env.PORT_SHOPPING_SERVER,

  CORS_ORIGIN: process.env.CORS_ORIGIN,
}));
