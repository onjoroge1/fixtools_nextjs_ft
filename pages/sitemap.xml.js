import Data from '@/dbTools';

const siteHost = process.env.NEXT_PUBLIC_HOST || 'http://localhost:3000';

// Category URLs - these are important landing pages
const categoryPaths = [
  '/tools/ai-tools',
  '/tools/conversion-tools',
  '/tools/json',
  '/tools/html',
  '/tools/css',
  '/tools/seo-tools',
  '/tools/text-tools',
  '/tools/pdf',
  '/tools/utilities',
  '/tools/image-tools',
  '/learn',
  '/back-to-school',
  '/back-to-school/writing',
  '/back-to-school/reading',
  '/back-to-school/study-tools',
  '/games',
];

// Static pages with their priorities
const staticPages = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/about', priority: '0.4', changefreq: 'monthly' },
  { path: '/contact', priority: '0.4', changefreq: 'monthly' },
  { path: '/privacy', priority: '0.3', changefreq: 'yearly' },
  { path: '/terms', priority: '0.3', changefreq: 'yearly' },
  { path: '/tools', priority: '0.9', changefreq: 'weekly' },
];

// Special conversion tools
const specialPaths = [
  '/conversiontools/languageTranslation',
  '/conversiontools/timeZoneConversion',
];

// SEO tools
const seoPaths = ['/seo-tools/site-map-generator', '/seo-tools/ip-location'];

// Popular tools (higher priority)
const popularTools = [
  '/json/json-formatter',
  '/html/html-formatter',
  '/css-tool/gradient',
  '/css-tool/box-shadow',
  '/aitools/qa',
  '/aitools/correction',
  '/conversiontools/currencyConversion',
  // New high-priority tools
  '/utilities/qr-code-generator',
  '/utilities/barcode-generator',
  '/utilities/password-generator',
  '/text/word-counter',
  '/text/text-case-converter',
  '/tools/image-compressor',
  '/tools/image-resizer',
];

// Learn pages
const learnPages = [
  '/learn/json',
  // Add more as they're created: '/learn/html', '/learn/css', etc.
];

// Additional tool paths that may not be in Data
const additionalToolPaths = [
  // Utilities
  '/utilities/qr-code-generator',
  '/utilities/barcode-generator',
  '/utilities/password-generator',
  '/utilities/url-encoder',
  '/utilities/url-decoder',
  // Text Tools
  '/text/word-counter',
  '/text/text-case-converter',
  '/text-tools/remove-spaces',
  '/text-tools/extract-links',
  '/text-tools/extract-email',
  // Image Tools
  '/image-tools/image-resizer',
  '/image-tools/image-compressor',
  '/image-tools/image-to-base64',
  '/image-tools/base64-to-image',
  '/image-tools/image-format-converter',
  '/image-tools/image-cropper',
  '/image-tools/image-rotator',
  '/image-tools/image-watermark',
  '/image-tools/image-background-remover',
  '/image-tools/image-flipper',
  '/image-tools/image-blur-tool',
  '/image-tools/image-brightness-adjuster',
  '/image-tools/image-contrast-adjuster',
  '/image-tools/image-grayscale-converter',
  '/image-tools/image-metadata-viewer',
];

const uniquePaths = () => {
  const toolPaths = (Data || []).map((tool) => tool?.link).filter(Boolean);
  const allToolPaths = [...toolPaths, ...additionalToolPaths];

  return {
    categories: categoryPaths,
    popular: popularTools.filter((path) => allToolPaths.includes(path)),
    special: [...specialPaths, ...seoPaths],
    regular: allToolPaths.filter(
      (path) =>
        !popularTools.includes(path) &&
        !specialPaths.includes(path) &&
        !seoPaths.includes(path)
    ),
  };
};

const getPriority = (path, type) => {
  if (path === '/') return '1.0';
  if (type === 'category') return '0.8';
  if (type === 'popular') return '0.7';
  if (type === 'special') return '0.6';
  if (type === 'static') return '0.4';
  return '0.5'; // regular tools
};

const getChangeFreq = (path, type) => {
  if (path === '/') return 'daily';
  if (type === 'category') return 'weekly';
  if (type === 'popular' || type === 'special') return 'weekly';
  return 'monthly';
};

const generateSiteMap = (paths) => {
  const lastmod = new Date().toISOString();

  // Static pages
  const staticUrls = staticPages
    .map(
      (page) => `
  <url>
    <loc>${siteHost}${page.path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
    )
    .join('');

  // Categories
  const categoryUrls = paths.categories
    .map(
      (path) => `
  <url>
    <loc>${siteHost}${path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${getChangeFreq(path, 'category')}</changefreq>
    <priority>${getPriority(path, 'category')}</priority>
  </url>`
    )
    .join('');

  // Learn pages
  const learnUrls = learnPages
    .map(
      (path) => `
  <url>
    <loc>${siteHost}${path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`
    )
    .join('');

  // Popular tools
  const popularUrls = paths.popular
    .map(
      (path) => `
  <url>
    <loc>${siteHost}${path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${getChangeFreq(path, 'popular')}</changefreq>
    <priority>${getPriority(path, 'popular')}</priority>
  </url>`
    )
    .join('');

  // Special tools
  const specialUrls = paths.special
    .map(
      (path) => `
  <url>
    <loc>${siteHost}${path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${getChangeFreq(path, 'special')}</changefreq>
    <priority>${getPriority(path, 'special')}</priority>
  </url>`
    )
    .join('');

  // Regular tools
  const regularUrls = paths.regular
    .map(
      (path) => `
  <url>
    <loc>${siteHost}${path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${getChangeFreq(path, 'regular')}</changefreq>
    <priority>${getPriority(path, 'regular')}</priority>
  </url>`
    )
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  ${staticUrls}
  ${categoryUrls}
  ${learnUrls}
  ${popularUrls}
  ${specialUrls}
  ${regularUrls}
</urlset>`;
};

export async function getServerSideProps({ res }) {
  const paths = uniquePaths();
  const sitemap = generateSiteMap(paths);

  res.setHeader('Content-Type', 'text/xml');
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=86400, stale-while-revalidate'
  );
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default function SiteMap() {
  return null;
}
