import * as React from 'react';
import { cn } from '~core/ui/utils';
import {
  RadioGroup as AriaRadioGroup,
  type RadioGroupProps as AriaRadioGroupProps,
  type RadioProps as AriaRadioProps,
  Radio as AriaRadio,
} from 'react-aria-components';
import { buttonVariants } from './button';
import { Label } from './label';
import { Field } from './field';

const radioGroupBase = buttonVariants({ variant: 'secondary' });

interface RadioGroupProps extends Omit<AriaRadioGroupProps, 'orientation' | 'children'> {
  children?: React.ReactNode;
}

export const RadioGroup = React.forwardRef<React.ElementRef<typeof AriaRadioGroup>, RadioGroupProps>(
  ({ className, children: childrenProp, ...rest }, ref) => {
    const elements = React.Children.toArray(childrenProp).filter(React.isValidElement);

    const label = elements.find((child) => child.type === Label);
    const children = elements.filter((child) => child.type !== Label);
    return (
      <AriaRadioGroup className={cn('group/field group/radio', className)} ref={ref} {...rest}>
        <Field orientation="horizontal">
          {label}

          <div
            className={cn(
              radioGroupBase,
              `group/radio flex flex-row space-x-1 border-2 border-grey-400 bg-none p-0 transition-colors
              data-disabled:cursor-not-allowed`,
              className,
            )}
          >
            {children}
          </div>
        </Field>
      </AriaRadioGroup>
    );
  },
);

interface RadioProps extends Omit<AriaRadioProps, 'children'> {
  children?: React.ReactNode;
}

export const Radio = React.forwardRef<React.ElementRef<typeof AriaRadio>, RadioProps>(
  ({ className, children, ...rest }, ref) => {
    return (
      <AriaRadio
        ref={ref}
        className={cn(
          `delay-250 group flex flex-1 cursor-pointer items-center justify-center self-stretch px-3 text-grey-300 transition-colors
          data-selected:bg-grey-400 data-selected:text-white data-hovered:text-white data-focus-visible:outline
          data-focus-visible:outline-2 group-data-disabled/radio:pointer-events-none group-data-disabled/radio:text-grey-350`,
          className,
        )}
        {...rest}
      >
        {children}
      </AriaRadio>
    );
  },
);
