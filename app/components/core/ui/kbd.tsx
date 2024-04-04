import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '~core/ui/utils';

const kbdVariants = cva(
  'whitespace-nowraptext-xs inline-flex items-center justify-center align-text-bottom font-mono text-2xs font-semibold transition-colors [&_.lucide]:inline-block [&_.lucide]:h-full [&_.lucide]:w-auto',
  {
    variants: {
      variant: {
        ghost: `rounded-md border-1 border-current text-grey-200`,
        white: `rounded-md border-1 border-white bg-white text-black`,
      },
      size: {
        default: 'h-5 min-w-8 px-1 py-0.5',
        // sm: 'h-9 px-3',
        // lg: 'h-14 px-8',
        // icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'white',
      size: 'default',
    },
  },
);

export interface KbdProps extends React.ComponentProps<'kbd'>, VariantProps<typeof kbdVariants> {}

const Kbd = React.forwardRef<HTMLElement, KbdProps>(({ className, variant, size, ...props }, ref) => {
  return <kbd className={kbdVariants({ variant, size, className })} ref={ref} {...props} />;
});
Kbd.displayName = 'Kbd';

export { Kbd, kbdVariants };
