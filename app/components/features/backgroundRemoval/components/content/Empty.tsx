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
          className="hover:drop-shadow-glow-xl focus:drop-shadow-glow-xl p-10 outline-none drop-shadow-glow transition-all"
          {...inputFileTriggerProps}
          type="button"
        >
          <h1 className="text-7xl font-extrabold tracking-tight shadow-white outline-none">
            Upload image <span className="align-center animate-blink">┃</span>
          </h1>
        </Button>
        <span className="-mt-7 block text-center text-grey-300">
          Drag and drop, paste from clipboard or{'  '}
          <Button excludeFromTabOrder className="-m-5 inline p-5" {...inputFileTriggerProps}>
            click
          </Button>
        </span>
      </motion.div>
    );
  },
);
