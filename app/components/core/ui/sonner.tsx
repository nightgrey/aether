'use client';

import { useTheme } from 'next-themes';
import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'dark' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      offset={24 + 24}
      position="top-right"
      toastOptions={{
        classNames: {
          toast:
            'group font-sans leading-normal text-md rounded-none toast group-[.toaster]:shadow-lg group-[.toaster]:bg-grey-500 group-[.toaster]:text-white group-[.toaster]:border-none',
          description: 'group-[.toast]:text-grey-300',
          actionButton: 'group-[.toast]:bg-grey-100 group-[.toast]:text-grey-600',
          cancelButton: 'group-[.toast]:bg-grey-600 group-[.toast]:text-grey-400',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
