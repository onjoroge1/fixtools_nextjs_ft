/**
 * Extract all URLs from sitemap structure
 * Used for initial IndexNow bulk submission
 */

import Data from '@/dbTools';

const siteHost = process.env.NEXT_PUBLIC_HOST || 'https://fixtools.io';

// Category URLs
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

// Static pages
const staticPages = [
  '/',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/tools',
];

// Special conversion tools
const specialPaths = [
  '/conversiontools/languageTranslation',
  '/conversiontools/timeZoneConversion',
];

// SEO tools
const seoPaths = [
  '/seo-tools/site-map-generator',
  '/seo-tools/ip-location',
  '/seo-tools/meta-tags',
  '/seo-tools/robots-txt',
];

// Popular tools
const popularTools = [
  '/json/json-formatter',
  '/html/html-formatter',
  '/html/html-minify',
  '/html/html-form-builder',
  '/html/html-embed-builder',
  '/html/html-element-builder',
  '/html/html-validator',
  '/html/html-accessibility-checker',
  '/html/html-security-scanner',
  '/html/html-seo-analyzer',
  '/html/html-performance-analyzer',
  '/html/html-email-builder',
  '/css-tool/gradient',
  '/css-tool/minify-css',
  '/css-tool/css-formatter',
  '/css-tool/transform-gen',
  '/css-tool/background-gen',
  '/css-tool/opacity-gen',
  '/css-tool/list-style-gen',
  '/aitools/qa',
  '/aitools/correction',
  '/conversiontools/currencyConversion',
  '/utilities/qr-code-generator',
  '/utilities/barcode-generator',
  '/utilities/password-generator',
  '/text/word-counter',
  '/text/text-case-converter',
  '/image-tools/image-compressor',
  '/image-tools/image-resizer',
];

// Learn pages
const learnPages = [
  '/learn/json',
];

// Additional tool paths
const additionalToolPaths = [
  '/utilities/url-encoder',
  '/utilities/url-decoder',
  '/text-tools/remove-spaces',
  '/text-tools/extract-links',
  '/text-tools/extract-email',
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
  '/pdf/pdf-compressor',
  '/pdf/pdf-merger',
  '/pdf/pdf-rotator',
  '/pdf/pdf-splitter',
  '/pdf/pdf-to-excel',
  '/pdf/pdf-to-jpg',
  '/pdf/pdf-to-png',
  '/pdf/pdf-to-word',
  '/pdf/word-to-pdf',
  '/pdf/image-to-pdf',
  '/pdf/ocr-pdf',
  '/pdf/optimize-pdf',
  '/pdf/highlight-pdf',
  '/pdf/add-comments-pdf',
  '/pdf/make-pdf-searchable',
  '/pdf/repair-pdf',
  '/pdf/excel-to-pdf',
  '/pdf/powerpoint-to-pdf',
];

/**
 * Normalize URL to prevent double slashes
 */
const normalizeUrl = (host, path) => {
  const cleanHost = host.replace(/\/+$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${cleanHost}${cleanPath}`;
};

/**
 * Get all URLs from sitemap structure
 * @returns {string[]} Array of absolute URLs
 */
export function getAllSitemapUrls() {
  const toolPaths = (Data || []).map((tool) => tool?.link).filter(Boolean);
  const allToolPaths = [...toolPaths, ...additionalToolPaths];

  // Combine all paths
  const allPaths = [
    ...staticPages,
    ...categoryPaths,
    ...learnPages,
    ...popularTools.filter((path) => allToolPaths.includes(path)),
    ...specialPaths,
    ...seoPaths,
    ...allToolPaths.filter(
      (path) =>
        !popularTools.includes(path) &&
        !specialPaths.includes(path) &&
        !seoPaths.includes(path)
    ),
  ];

  // Remove duplicates
  const uniquePaths = [...new Set(allPaths)];

  // Convert to absolute URLs
  const urls = uniquePaths.map(path => normalizeUrl(siteHost, path));

  return urls;
}

/**
 * Get URLs by category (for selective submission)
 */
export function getUrlsByCategory() {
  const toolPaths = (Data || []).map((tool) => tool?.link).filter(Boolean);
  const allToolPaths = [...toolPaths, ...additionalToolPaths];

  return {
    static: staticPages.map(path => normalizeUrl(siteHost, path)),
    categories: categoryPaths.map(path => normalizeUrl(siteHost, path)),
    learn: learnPages.map(path => normalizeUrl(siteHost, path)),
    popular: popularTools
      .filter((path) => allToolPaths.includes(path))
      .map(path => normalizeUrl(siteHost, path)),
    seo: seoPaths.map(path => normalizeUrl(siteHost, path)),
    conversion: specialPaths.map(path => normalizeUrl(siteHost, path)),
    regular: allToolPaths
      .filter(
        (path) =>
          !popularTools.includes(path) &&
          !specialPaths.includes(path) &&
          !seoPaths.includes(path)
      )
      .map(path => normalizeUrl(siteHost, path)),
  };
}

