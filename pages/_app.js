import '../styles/globals.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'react-toastify/dist/ReactToastify.css';

import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Script from 'next/script';
import { inter, poppins, roboto } from '../lib/fonts';
import * as analytics from '../lib/analytics';
import CookieConsent from '../components/CookieConsent';
import { ThemeProvider } from '../contexts/ThemeContext';

const siteHost = process.env.NEXT_PUBLIC_HOST || 'http://localhost:3000';

export default function App({ Component, pageProps }) {
  const router = useRouter();

  // Track page views
  useEffect(() => {
    const handleRouteChange = (url) => {
      analytics.pageview(url);
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <ThemeProvider>
      {/* Google Analytics */}
      {analytics.GA_MEASUREMENT_ID && (
        <>
          <Script
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${analytics.GA_MEASUREMENT_ID}`}
          />
          <Script
            id="google-analytics"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${analytics.GA_MEASUREMENT_ID}', {
                  page_path: window.location.pathname,
                  send_page_view: true
                });
              `,
            }}
          />
        </>
      )}

      <style jsx global>{`
        :root {
          --font-inter: ${inter.style.fontFamily};
          --font-poppins: ${poppins.style.fontFamily};
          --font-roboto: ${roboto.style.fontFamily};
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
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css"
          integrity="sha512-KfkfwYDsLkIlwQp6LFnl8zNdLGxu9YAA1QvwINks4PhcElQSvqcyVLLD9aMhXd13uQjoXtEKNosOWaZqXgel0g=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>
      <Component {...pageProps} />
      <CookieConsent />
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
