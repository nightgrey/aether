import * as React from 'react';
import { cn } from '~core/ui/utils';

interface ContainerProps extends React.ComponentPropsWithoutRef<'div'> {
  /**
   * The orientation of the container.
   * @default 'horizontal'
   */
  orientation?: 'vertical' | 'horizontal' | 'both';
}

export const Container = React.forwardRef<React.ElementRef<'div'>, ContainerProps>(
  ({ className, orientation = 'horizontal', children, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'full-container',
          {
            'px-6': orientation === 'horizontal',
            'py-6': orientation === 'vertical',
            'px-6 py-6': orientation === 'both',
          },
          className,
        )}
        {...rest}
      >
        {children}
      </div>
    );
  },
);
