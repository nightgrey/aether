import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '~core/ui/utils';
interface ImageProps extends React.ComponentPropsWithoutRef<typeof motion.img> {}

export const Image = React.forwardRef<React.ElementRef<typeof motion.img>, ImageProps>(
  ({ className, ...rest }, ref) => {
    return (
      <motion.img
        initial={{
          scale: 0.75,
        }}
        variants={{
          visible: {
            scale: 1,
          },
          hasOutput: {
            translateX: '50%',
          },
          isDropTarget: {
            scale: 0.75,
            opacity: 0.5,
          },
        }}
        exit={{
          scale: 0.75,
          opacity: 0,
          transition: {
            duration: 0.1,
          },
        }}
        className={cn('absolute max-h-full w-auto max-w-[var(--width)px] object-contain', className)}
        {...rest}
        ref={ref}
      />
    );
  },
);
