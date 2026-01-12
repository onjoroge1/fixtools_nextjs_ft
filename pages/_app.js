import '../styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';

import Head from 'next/head';
import Script from 'next/script';
import { inter, poppins } from '../lib/fonts';
import CookieConsent from '../components/CookieConsent';
import { ThemeProvider } from '../contexts/ThemeContext';

// Vercel Analytics
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

const siteHost = process.env.NEXT_PUBLIC_HOST || 'http://localhost:3000';

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider>

      <style jsx global>{`
        :root {
          --font-inter: ${inter.style.fontFamily};
          --font-poppins: ${poppins.style.fontFamily};
        }
      `}</style>
      {/* Global Head */}
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Home Page | Fixtools</title>
        <meta
          name="description"
          content="Tools for solving your day to day problems"
          key="description"
        />
        <meta
          property="og:title"
          content="Home Page | Fixtools"
          key="og:title"
        />
        <meta
          property="og:description"
          content="Tools for solving your day to day problems"
          key="og:description"
        />
        <meta property="og:type" content="website" />
        <meta
          name="google-site-verification"
          content="HUW38hlFL73UwjOfkEX-XF8NPFFp5_jVoj6wVuSX9EY"
        />
        <meta
          property="og:image"
          content={`/programming_tools.jpg`}
          key="og:image"
        />
        <meta
          property="og:image:alt"
          content="Online Tools for solving your day to day problems"
          key="og:image:alt"
        />
        <meta property="og:url" content={siteHost} key="og:url" />
        <meta property="og:locale" content="en_GB" />
        <meta
          name="twitter:image"
          content={`/programming_tools.jpg`}
          key="twitter:image"
        />
        <meta
          name="twitter:card"
          content="summary_large_image"
          key="twitter:card"
        />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" />
        <link
          rel="apple-touch-icon"
          href="/fixtools-logos/fixtools-logos_black.svg"
        />
        <link rel="canonical" href={siteHost} key="canonical-url" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>
      <Component {...pageProps} />
      <CookieConsent />
      <Analytics />
      <SpeedInsights />
    </ThemeProvider>
  );
}

const structuredData = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    description: 'Tools for conversion, solving problem , fixing issues',
    headline: 'Tools for solving your day to day problems',
    name: 'fixtools',
    alternateName: 'Fixtools',
    url: siteHost,
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Project',
    description: 'Tools for conversion, solving problem , fixing issues',
    name: 'fixtools',
    alternateName: 'fixtools',
    url: siteHost,
    logo: './fixtools-logos_black.png',
  },
];

