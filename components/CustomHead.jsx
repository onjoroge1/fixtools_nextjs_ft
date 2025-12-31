import React from 'react';
import Head from 'next/head';

export default function CustomHead({
  title,
  metaDescription,
  ogImageUrl,
  ogImageAlt,
  ogUrl,
  keywords,
  author = 'Fixtools',
  type = 'website',
}) {
  return (
    <Head>
      <title>{`${title} | Fixtools`}</title>

      {/* Basic Meta Tags */}
      <meta name="description" content={metaDescription} key="description" />
      {keywords && <meta name="keywords" content={keywords} key="keywords" />}
      <meta name="author" content={author} key="author" />

      {/* Open Graph */}
      <meta
        property="og:title"
        content={`${title} | Fixtools`}
        key="og:title"
      />
      <meta
        property="og:description"
        content={metaDescription}
        key="og:description"
      />
      <meta property="og:type" content={type} key="og:type" />
      <meta property="og:image" content={ogImageUrl} key="og:image" />
      <meta property="og:image:alt" content={ogImageAlt} key="og:image:alt" />
      <meta property="og:url" content={ogUrl} key="og:url" />
      <meta property="og:site_name" content="Fixtools" key="og:site_name" />

      {/* Twitter Card */}
      <meta
        name="twitter:card"
        content="summary_large_image"
        key="twitter:card"
      />
      <meta
        name="twitter:title"
        content={`${title} | Fixtools`}
        key="twitter:title"
      />
      <meta
        name="twitter:description"
        content={metaDescription}
        key="twitter:description"
      />
      <meta name="twitter:image" content={ogImageUrl} key="twitter:image" />
      <meta
        name="twitter:image:alt"
        content={ogImageAlt}
        key="twitter:image:alt"
      />

      {/* Canonical URL */}
      <link rel="canonical" href={ogUrl} key="canonical-url" />
    </Head>
  );
}
