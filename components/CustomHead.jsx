import React from 'react';
import Head from 'next/head';
export default function CustomHead({
  title,
  metaDescription,
  ogImageUrl,
  ogImageAlt,
  ogUrl,
}) {
  return (
    <Head>
      <title>{`${title} | Fixtools`}</title>
      <meta
        name='description'
        content={metaDescription}
        key='description'
      />
      <meta
        property='og:title'
        content={`${title} | Fixtools`}
        key='og:title'
      />
      <meta
        property='og:description'
        content={metaDescription}
        key='og:description'
      />
      <meta
        property='og:image'
        content={ogImageUrl}
        key='og:image'
      />
      <meta
        property='og:image:alt'
        content={ogImageAlt}
        key='og:image:alt'
      />
      <meta
        property='og:url'
        content={ogUrl}
        key='og:url'
      />

      <meta
        name='twitter:image'
        content={ogImageUrl}
        key='twitter:image'
      />
      <meta
        name='twitter:card'
        content='summary_large_image'
        key='twitter:card'
      />

      <link
        rel='canonical'
        href={ogUrl}
        key='canonical-url'
      />
    </Head>
  );
}
