import * as React from 'react';
import { motion } from 'framer-motion';
import { Button as UiButton } from '~core/ui/button';
import { cn } from '~core/ui/utils';
import { X as LucideX } from 'lucide-react';

const Button = motion(UiButton);
const X = motion(LucideX);

interface CloseButtonProps extends React.ComponentPropsWithoutRef<typeof Button> {}

export const CloseButton = React.forwardRef<React.ElementRef<typeof Button>, CloseButtonProps>(
  ({ className, ...rest }, ref) => {
    return (
      <Button
        variant="icon"
        initial={{
          opacity: 0.2,
          display: 'none',
        }}
        animate={{ opacity: 1, display: 'inline-flex' }}
        exit={{
          opacity: 0,
          display: 'none',
        }}
        type="reset"
        className={cn('utline-none absolute left-0 top-0 z-20 size-20 focus-visible:ring-white', className)}
        {...rest}
        ref={ref}
      >
        <X whileHover={{ strokeWidth: '1px' }} strokeWidth={0.5} size={64} />
      </Button>
    );
  },
);
