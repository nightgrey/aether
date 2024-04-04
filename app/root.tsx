import { cssBundleHref } from '@remix-run/css-bundle';
import type { LinksFunction, MetaFunction } from '@remix-run/node';
import { Links, Meta, Scripts, ScrollRestoration } from '@remix-run/react';
import './globals.css';
import '@fontsource-variable/inter/index.css';
import Layout from '~core/Layout';
import { BackgroundRemoval } from '~features/backgroundRemoval';
import { Toaster } from '~core/ui/sonner';
import { env } from '~shared/env';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

export const links: LinksFunction = () => [...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : [])];

export const meta: MetaFunction = () => {
  return [
    { title: 'Aether' },

    {
      name: 'description',
      content: 'Remove background from images with local AI.',
    },

    {
      property: 'og:title',
      content: 'Aether',
    },

    {
      property: 'og:description',
      content: 'Remove background from images with local AI.',
    },

    {
      property: 'og:url',
      content: 'https://github.com/nightgrey/aether',
    },

    {
      name: 'twitter:creator',
      content: '@nightrey_',
    },

    {
      name: 'twitter:title',
      content: 'Aether',
    },

    {
      name: 'twitter:description',
      content: 'Remove background from images with local AI.',
    },
  ];
};

const App = () => {
  return (
    <html className="dark" lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-black text-white">
        <Layout>
          <BackgroundRemoval />
        </Layout>
        <ScrollRestoration />
        <Scripts />
        <Toaster />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
};

export const HydrateFallback = App;

export default App;
