import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '~core/ui/utils';
import { Button as AriaButton } from 'react-aria-components';
import { dataAttr } from '~shared/utils';

const buttonVariants = cva(
  'group/button relative inline-flex items-center justify-center whitespace-nowrap border-1 border-2 text-sm font-semibold ring-black transition-colors focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 aria-busy:opacity-100',
  {
    variants: {
      variant: {
        default: 'border-white bg-white text-grey-600 hover:bg-transparent hover:text-white',
        black: 'border-amber-700 bg-amber-700 text-amber-300 hover:border-black hover:bg-black hover:text-white',
        ghost: ' border-white bg-transparent text-white hover:bg-white hover:text-grey-600',
        icon: `border-0 text-grey-400 transition-colors hover:text-grey-200`,
        link: 'border-0 text-white underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-12 px-4 py-2',

        // sm: 'h-9 px-3',
        // lg: 'h-14 px-8',
        icon: 'size-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends Omit<React.ComponentPropsWithoutRef<typeof AriaButton>, 'children'>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  children?: React.ReactNode;
}

const Button = React.forwardRef<React.ElementRef<typeof AriaButton>, ButtonProps>(
  (
    {
      className,
      variant,
      isLoading: isLoadingProp = false,
      isDisabled: isDisabledProp = false,
      size,
      children,
      ...props
    },
    ref,
  ) => {
    const isDisabled = isLoadingProp || isDisabledProp;

    return (
      <AriaButton
        ref={ref}
        {...props}
        isDisabled={isDisabled}
        className={cn(buttonVariants({ variant, size, className }))}
        data-loading={dataAttr(isLoadingProp)}
      >
        {isLoadingProp && (
          <div className="absolute inset-0 flex items-center justify-center ">
            <Loader2 className="font-large animate-spin" />
          </div>
        )}
        <span className="group-data-[loading]/button:invisible">{children}</span>
      </AriaButton>
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
