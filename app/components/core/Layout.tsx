import { cn } from './ui/utils';
import { Footer } from './Footer';

const Layout = ({ className, children, ...rest }: React.ComponentPropsWithoutRef<'div'>) => {
  return (
    <>
      <div className={cn('layout flex h-screen flex-col', className)} {...rest}>
        <main className="main min-h-0 flex-grow">{children}</main>
        <Footer />
      </div>
    </>
  );
};

export default Layout;
