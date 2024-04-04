import * as React from 'react';
import { motion } from 'framer-motion';
import { Plus as LucidePlus } from 'lucide-react';
import { cn } from '~core/ui/utils';

const Plus = motion(LucidePlus);

interface DropIndicatorProps extends React.ComponentPropsWithoutRef<typeof Plus> {}

export const DropIndicator = React.forwardRef<React.ElementRef<typeof Plus>, DropIndicatorProps>(
  ({ className, ...rest }, ref) => {
    return (
      <Plus
        initial={{
          scale: 0.25,
        }}
        variants={{
          isDropTarget: {
            scale: 1,
          },
        }}
        className={cn('absolute', className)}
        size={64}
        {...rest}
        ref={ref}
      />
    );
  },
);
