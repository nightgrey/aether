export const IS_CLIENT = typeof window !== 'undefined';
export const IS_SERVER = !IS_CLIENT;
export const IS_DEV = process.env.NODE_ENV === 'development';

export const env = {
  URL: IS_CLIENT ? window.ENV.URL : process.env.VERCEL_URL ?? process.env.URL,
};

export const config = env;
