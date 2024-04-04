/// <reference types="vite/client" />
/// <reference types="@remix-run/node" />

import { type Env } from 'onnxruntime-web';
import { type O } from 'ts-toolbelt';

// Add custom CSS properties
// @see https://github.com/frenic/csstype#what-should-i-do-when-i-get-type-errors
declare module 'csstype' {
  interface Properties {
    // Allow any CSS variable
    [index: `--${string}`]: any;
  }
}

// declare type Env for `window.onnx`
declare global {
  interface Window {
    onnx?: O.Partial<
      {
        env: Env;
      },
      'deep'
    >;
    ENV: {
      URL: string;
      VERCEL_URL: string;
    };
  }
}

type Getters = {
  [Property in keyof Getters as `data-${K}`]: DataAttributes[K];
};
type DataAttributes = {
  [K in keyof DataAttributes as `data-${K}`]: DataAttributes[K];
};

declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    [key: `data-${string}`]: boolean | string | undefined;
  }
}
