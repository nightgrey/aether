import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '~core/ui/utils';
import { useBackgroundRemovalContext } from '~features/backgroundRemoval/useBackgroundRemoval';
import { Button } from 'react-aria-components';

interface EmptyProps extends React.ComponentPropsWithoutRef<typeof motion.div> {}

export const Empty = React.forwardRef<React.ElementRef<typeof motion.div>, EmptyProps>(
  ({ className, ...rest }, ref) => {
    const {
      props: { inputFileTriggerProps },
    } = useBackgroundRemovalContext();

    return (
      <motion.div className={cn('absolute', className)} {...rest} ref={ref}>
        <Button
          className="pointer:hover:drop-shadow-glow-xl pointer:focus:drop-shadow-glow-xl p-10 outline-none drop-shadow-glow transition-all"
          {...inputFileTriggerProps}
          type="button"
        >
          <h1 className="text-4xl font-extrabold tracking-tight shadow-white outline-none sm:text-5xl md:text-7xl">
            Remove background <span className="align-center animate-blink">┃</span>
          </h1>
        </Button>
        <span className="text-md -mt-7 block text-center text-grey-300 sm:text-sm">
          Drag and drop, paste from clipboard or{'  '}
          <Button excludeFromTabOrder className="-m-5 inline p-5" {...inputFileTriggerProps}>
            click to upload an image
          </Button>
        </span>
      </motion.div>
    );
  },
);
