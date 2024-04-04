interface SpinDelayOptions {
  /**
   * The delay in milliseconds before the spinner is displayed.
   * @default 500
   */
  delay?: number;
  /**
   * The minimum duration in milliseconds the spinner is displayed.
   * @default 200
   */
  minDuration?: number;
  /**
   * Whether to enable the spinner on the server side. If true, `delay` will be
   * ignored, and the spinner will be shown immediately if `loading` is true.
   * @default true
   */
  ssr?: boolean;
}

type State = 'IDLE' | 'DELAY' | 'DISPLAY' | 'EXPIRE';

export const defaultOptions: SpinDelayOptions = {
  delay: 500,
  minDuration: 200,
  ssr: true,
};

export function spinDelay(fn: () => Promise<void>, options?: SpinDelayOptions): void {
  options = Object.assign({}, defaultOptions, options);

  const isSSR = typeof window === 'undefined';
  const initialState = (options.ssr ?? false) && isSSR ? 'DISPLAY' : 'IDLE';
  let state: State = initialState;
  let timeout: NodeJS.Timeout | null = null;

  const setLoading = (loading: boolean) => {
    if (loading && (state === 'IDLE' || isSSR)) {
      if (timeout) {
        clearTimeout(timeout);
      }

      const delay = isSSR ? 0 : options.delay;
      timeout = setTimeout(async () => {
        if (!loading) {
          state = 'IDLE';
          return;
        }

        timeout = setTimeout(() => {
          state = 'EXPIRE';
        }, options.minDuration);

        state = 'DISPLAY';
        await fn();
      }, delay);

      if (!isSSR) {
        state = 'DELAY';
      }
    }

    if (!loading && state !== 'DISPLAY') {
      if (timeout) {
        clearTimeout(timeout);
      }
      state = 'IDLE';
    }
  };

  setLoading(true);

  return setLoading;
}
