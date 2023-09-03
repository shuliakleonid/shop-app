import * as process from 'process';

export const configuration = () => ({
  NODE_ENV: process.env.NODE_ENV,

  PORT: process.env.PORT,
  url_apps: {
    SERVER_URL_MAIN: process.env.SERVER_URL_MAIN,
    SERVER_URL_CART: process.env.SERVER_URL_CART,
    SERVER_URL_CATALOG: process.env.SERVER_URL_CATALOG,
    SERVER_URL_ORDERS: process.env.SERVER_URL_ORDERS,
  },

  CORS_ORIGIN: process.env.CORS_ORIGIN,

  database: {
    POSTGRES_HOST: process.env.POSTGRES_HOST,
    POSTGRES_PORT: process.env.POSTGRES_PORT,
    POSTGRES_USER: process.env.POSTGRES_USER,
    POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
    POSTGRES_DB: process.env.POSTGRES_DB,

    DATABASE_URL: process.env.DATABASE_URL,
  },
  jwt: {
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    EXPIRED_ACCESS: process.env.EXPIRED_ACCESS,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    EXPIRED_REFRESH: process.env.EXPIRED_REFRESH,
  },
  payment: {
    stripe: {
      API_KEY_STRIPE: process.env.API_KEY_STRIPE,
      SECRET_HOOK_STRIPE: process.env.SECRET_HOOK_STRIPE,
      STRIPE_CURRENCY: process.env.STRIPE_CURRENCY,
    },
  },
  dev: {
    TOKEN_NGROK: process.env.TOKEN_NGROK,
    CURRENT_APP_BASE_URL: process.env.CURRENT_APP_BASE_URL,
    TEST_CLIENT_URL: process.env.TEST_CLIENT_URL,
  },
});

export type EnvType = ReturnType<typeof configuration>;
