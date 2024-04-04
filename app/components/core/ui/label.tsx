import * as React from 'react';
import { cn } from '~core/ui/utils';
import { Label as AriaLabel, type LabelProps as AriaLabelProps } from 'react-aria-components';

interface LabelProps extends AriaLabelProps {}

export const Label = React.forwardRef<React.ElementRef<'label'>, LabelProps>(
  ({ className, children, ...rest }, ref) => {
    return (
      <AriaLabel
        ref={ref}
        className={cn('text-sm text-grey-200 transition-colors group-data-disabled/field:text-grey-350', className)}
        {...rest}
      >
        {children}
      </AriaLabel>
    );
  },
);
