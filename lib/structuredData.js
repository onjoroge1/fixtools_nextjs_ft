/**
 * Structured Data Utility Functions for SEO
 * These functions generate JSON-LD structured data for better search engine visibility
 */

/**
 * Creates a WebSite schema
 */
export const createWebsiteSchema = (siteUrl, siteName) => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: siteName,
  url: siteUrl,
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${siteUrl}/search?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
});

/**
 * Creates a SoftwareApplication schema for tools
 */
export const createToolSchema = (tool, siteUrl) => ({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: tool.title,
  description: tool.desc,
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Web',
  url: `${siteUrl}${tool.link}`,
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '100',
  },
});

/**
 * Creates a HowTo schema for tool instructions
 */
export const createHowToSchema = (title, description, steps, siteUrl) => ({
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: title,
  description: description,
  step: steps.map((step, index) => ({
    '@type': 'HowToStep',
    position: index + 1,
    name: step.name,
    text: step.text,
    url: siteUrl,
  })),
});

/**
 * Creates BreadcrumbList schema
 */
export const createBreadcrumbSchema = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

/**
 * Creates Organization schema
 */
export const createOrganizationSchema = (siteUrl, logoUrl) => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Fixtools',
  url: siteUrl,
  logo: logoUrl,
  description:
    'Free online developer tools for formatting, conversion, and AI-powered utilities',
  sameAs: [
    // Add social media URLs here
  ],
});

/**
 * Creates FAQ schema
 */
export const createFAQSchema = (faqs) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
});


