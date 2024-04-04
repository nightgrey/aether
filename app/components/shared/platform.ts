export const IS_CLIENT = typeof window !== 'undefined';
export const IS_SERVER = !IS_CLIENT;
export const IS_DEV = process.env.NODE_ENV === 'development';

export const PLATFORM =
  IS_CLIENT && 'navigator' in window && 'platform' in window.navigator ? window.navigator?.platform : '';
export const isMacLike = /(Mac|iPhone|iPod|iPad)/i.test(PLATFORM);
