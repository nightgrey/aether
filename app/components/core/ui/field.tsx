import * as React from 'react';
import { type InputProps } from 'react-aria-components';
import { cn } from '~core/ui/utils';

interface FieldProps extends InputProps {
  orientation?: 'horizontal' | 'vertical';
}

/**
 * Layout component for form fields.
 *
 * @example
 *   <Field orientation="horizontal">
 *     {label}
 *     {input}
 *   </Field>
 *
 * @see {RadioGroup}
 */
export const Field = React.forwardRef<React.ElementRef<'div'>, FieldProps>(
  ({ className, orientation = 'vertical', children, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        data-orientation={orientation}
        className={cn(
          `flex data-[orientation=horizontal]:flex-row data-[orientation=vertical]:flex-col
          data-[orientation=horizontal]:items-center data-[orientation=horizontal]:space-x-2 data-[orientation=vertical]:space-y-2`,
          className,
        )}
      >
        {children}
      </div>
    );
  },
);
