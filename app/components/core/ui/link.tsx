import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '~core/ui/utils';
import { Link as RemixLink } from '@remix-run/react';

const linkVariants = cva(undefined, {
  variants: {
    variant: {
      default: 'text-grey-300 hover:text-grey-200',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface LinkProps extends React.ComponentProps<typeof RemixLink>, VariantProps<typeof linkVariants> {}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(({ className, variant, children, ...props }, ref) => {
  return (
    <RemixLink ref={ref} className={cn(linkVariants({ variant, className }))} {...props}>
      {children}
    </RemixLink>
  );
});

Link.displayName = 'Link';

export { Link, linkVariants };
