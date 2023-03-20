import '../styles/globals.css';
import 'bootstrap/dist/css/bootstrap.css';
import { BrowserRouter } from 'react-router-dom';
import Head from 'next/head';
import CustomHead from '@/components/CustomHead';
import { Metadata } from 'next';

import 'react-toastify/dist/ReactToastify.css';

export default function App({ Component, pageProps }) {
  return (
    <>
      {/* Global Head */}
      <Head>
        <title>Home Page | Fixtools</title>
        <meta
          name='description'
          content='Tools for solving your day to day problems'
          key='description'
        />
        <meta
          property='og:title'
          content='Home Page | Fixtools'
          key='og:title'
        />
        <meta
          property='og:description'
          content='Toolsfor solving your day to day problems'
          key='og:description'
        />
        <meta
          property='og:type'
          content='website'
        />
        <meta
          name='google-site-verification'
          content='HUW38hlFL73UwjOfkEX-XF8NPFFp5_jVoj6wVuSX9EY'
        />

        <meta
          property='og:image'
          content={`/programming_tools.jpg`}
          key='og:image'
        />
        <meta
          property='og:image:alt'
          content='Online Tools for solving your day to day problems'
          key='og:image:alt'
        />
        <meta
          property='og:url'
          content={process.env.NEXT_PUBLIC_HOST}
          key='og:url'
        />
        <meta
          property='og:locale'
          content='en_GB'
        />
        <meta
          property='og:type'
          content='website'
        />
        <meta
          name='twitter:image'
          content={`/programming_tools.jpg`}
          key='twitter:image'
        />
        <meta
          name='twitter:card'
          content='summary_large_image'
          key='twitter:card'
        />
        <link
          rel='icon'
          href='/fixtools-logos/fixtools-logos_black.svg'
        />
        <link
          rel='apple-touch-icon'
          href='/fixtools-logos/fixtools-logos_black.svg'
        />

        <link
          rel='canonical'
          href={process.env.NEXT_PUBLIC_HOST}
          key='canonical-url'
        />
        <link
          rel='stylesheet'
          href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css'
          integrity='sha512-KfkfwYDsLkIlwQp6LFnl8zNdLGxu9YAA1QvwINks4PhcElQSvqcyVLLD9aMhXd13uQjoXtEKNosOWaZqXgel0g=='
          crossorigin='anonymous'
          referrerpolicy='no-referrer'
        />
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>
      <Component {...pageProps} />
    </>
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
    url: process.env.NEXT_PUBLIC_HOST,
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Project',
    description: 'Tools for conversion, solving problem , fixing issues',
    name: 'fixtools',
    alternateName: 'fixtools',
    url: process.env.NEXT_PUBLIC_HOST,
    logo: './fixtools-logos_black.png',
  },
];
