import Data from '@/dbTools';

const siteHost = process.env.NEXT_PUBLIC_HOST || 'http://localhost:3000';

// Category URLs - these are important landing pages
const categoryPaths = [
  '/categories/ai-tools',
  '/categories/conversion-tools',
  '/categories/json-tools',
  '/categories/html-tools',
  '/categories/css-tools',
  '/categories/seo-tools',
];

// Static pages with their priorities
const staticPages = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/about', priority: '0.4', changefreq: 'monthly' },
  { path: '/contact', priority: '0.4', changefreq: 'monthly' },
  { path: '/privacy', priority: '0.3', changefreq: 'yearly' },
  { path: '/terms', priority: '0.3', changefreq: 'yearly' },
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
];

const uniquePaths = () => {
  const toolPaths = (Data || []).map((tool) => tool?.link).filter(Boolean);

  return {
    categories: categoryPaths,
    popular: popularTools.filter((path) => toolPaths.includes(path)),
    special: [...specialPaths, ...seoPaths],
    regular: toolPaths.filter(
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
