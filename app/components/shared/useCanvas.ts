import { useLayoutEffect } from 'react';

export const useCanvas = (props: {
  ref: React.RefObject<HTMLCanvasElement>;
  fn?: (args: { canvas: HTMLCanvasElement; context: CanvasRenderingContext2D }) => void | Promise<void>;
  deps?: unknown[];
}) => {
  const { ref, fn, deps } = props;
  useLayoutEffect(() => {
    if (!ref.current) {
      return;
    }

    const context = ref.current.getContext('2d');

    if (!context) {
      return;
    }

    void fn?.({ canvas: ref.current, context });
  }, deps);
};
