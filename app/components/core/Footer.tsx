import * as React from 'react';
import { cn } from '~core/ui/utils';
import { Separator } from '~core/ui/separator';
import { Link } from '~core/ui/link';
import { Container } from './ui/container';
import { Github } from 'lucide-react';

const DEFAULT_LINKS: Array<React.ComponentProps<typeof Link>> = [
  /*   {
    title: "What's this?",
    children: '?',
    to: '/about',
    className: 'text-2xl font-semibold leading-none relative top-[-1px]',
  }, */
  {
    title: 'x.com/nightgrey_',
    to: 'https://x.com/nightgrey_',
    children: '𝕏',
    className: 'text-2xl font-semibold leading-none',
  },
  {
    title: 'github.com/nightgrey/aether',
    to: 'https://github.com/nightgrey/aether',
    children: <Github />,
  },
];

interface FooterProps extends React.ComponentPropsWithoutRef<'footer'> {
  links?: Array<React.ComponentProps<typeof Link>>;
}

export const Footer = React.forwardRef<React.ElementRef<'footer'>, FooterProps>(
  ({ className, links = DEFAULT_LINKS, children, ...rest }, ref) => {
    return (
      <>
        <footer ref={ref} className={cn('footer text-xs text-grey-300', className)} {...rest}>
          <Container orientation="horizontal" className="flex items-center justify-end space-x-4 py-2">
            {links.map((link, i) => (
              <React.Fragment key={link.title}>
                <Link {...link} className={cn('inline-block px-1.5 py-2', link.className)} />
                {i !== links.length - 1 && <Separator className="h-6" orientation="vertical" />}
              </React.Fragment>
            ))}
          </Container>
        </footer>
      </>
    );
  },
);
