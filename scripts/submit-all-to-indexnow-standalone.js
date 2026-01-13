#!/usr/bin/env node

/**
 * Standalone IndexNow Bulk Submission Script
 * 
 * This version works without Next.js context by duplicating the URL collection logic.
 * Use this if the main script has import issues.
 * 
 * Usage:
 *   NEXT_PUBLIC_HOST=https://fixtools.io INDEXNOW_KEY=your-key node scripts/submit-all-to-indexnow-standalone.js
 */

// IndexNow API URL
const INDEXNOW_API_URL = 'https://api.indexnow.org/indexnow';
const MAX_URLS_PER_REQUEST = 10000;

// Sitemap paths (duplicated from sitemap.xml.js for standalone use)
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

const staticPages = [
  '/',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/tools',
];

const specialPaths = [
  '/conversiontools/languageTranslation',
  '/conversiontools/timeZoneConversion',
];

const seoPaths = [
  '/seo-tools/site-map-generator',
  '/seo-tools/ip-location',
  '/seo-tools/meta-tags',
  '/seo-tools/robots-txt',
];

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

const learnPages = [
  '/learn/json',
];

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

function normalizeUrl(host, path) {
  const cleanHost = host.replace(/\/+$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${cleanHost}${cleanPath}`;
}

function getAllUrls() {
  // Combine all paths (simplified - doesn't check Data since we can't import it)
  const allPaths = [
    ...staticPages,
    ...categoryPaths,
    ...learnPages,
    ...popularTools,
    ...specialPaths,
    ...seoPaths,
    ...additionalToolPaths,
  ];

  // Remove duplicates
  const uniquePaths = [...new Set(allPaths)];

  // Convert to absolute URLs
  const siteHost = process.env.NEXT_PUBLIC_HOST || 'https://fixtools.io';
  const cleanHost = siteHost.replace(/\/+$/, '');
  const urls = uniquePaths.map(path => normalizeUrl(cleanHost, path));

  return urls;
}

async function submitToIndexNow(urls, host, key, keyLocation) {
  const payload = {
    host: host,
    key: key,
    keyLocation: keyLocation,
    urlList: urls.slice(0, MAX_URLS_PER_REQUEST),
  };

  try {
    const response = await fetch(INDEXNOW_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    return response.ok || response.status === 202;
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
}

async function submitBatched(urls, host, key, keyLocation, batchSize = 1000) {
  const batches = [];
  let totalSubmitted = 0;
  const errors = [];

  for (let i = 0; i < urls.length; i += batchSize) {
    batches.push(urls.slice(i, i + batchSize));
  }

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    console.log(`Submitting batch ${i + 1}/${batches.length} (${batch.length} URLs)...`);
    
    const success = await submitToIndexNow(batch, host, key, keyLocation);
    
    if (success) {
      totalSubmitted += batch.length;
    } else {
      errors.push(`Batch ${i + 1} failed`);
    }

    if (i < batches.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  return { totalSubmitted, batches: batches.length, errors };
}

async function main() {
  console.log('🚀 IndexNow Bulk Submission Script (Standalone)');
  console.log('================================================\n');

  const host = process.env.NEXT_PUBLIC_HOST?.replace(/^https?:\/\//, '').replace(/\/+$/, '');
  const key = process.env.INDEXNOW_KEY;
  const keyFileName = 'fixtools-indexnow-f5cd607761931bc5e0f10b4f1e6fb71752740f1731bbd342c2c6c3263d3c8400.txt';
  const baseUrl = process.env.NEXT_PUBLIC_HOST?.startsWith('http')
    ? process.env.NEXT_PUBLIC_HOST
    : `https://${host}`;
  const keyLocation = `${baseUrl}/${keyFileName}`;

  if (!host || !key) {
    console.error('❌ Missing configuration!');
    console.error('Set NEXT_PUBLIC_HOST and INDEXNOW_KEY environment variables.');
    console.error('\nExample:');
    console.error('  NEXT_PUBLIC_HOST=https://fixtools.io INDEXNOW_KEY=your-key node scripts/submit-all-to-indexnow-standalone.js');
    process.exit(1);
  }

  console.log(`📋 Configuration:`);
  console.log(`   Host: ${host}`);
  console.log(`   Key: ${key.substring(0, 20)}...`);
  console.log(`   Key Location: ${keyLocation}\n`);

  console.log('📊 Collecting URLs...');
  const urls = getAllUrls();
  console.log(`   Found ${urls.length} URLs\n`);

  if (urls.length === 0) {
    console.error('❌ No URLs found!');
    process.exit(1);
  }

  console.log('📝 Sample URLs (first 5):');
  urls.slice(0, 5).forEach((url, i) => {
    console.log(`   ${i + 1}. ${url}`);
  });
  if (urls.length > 5) {
    console.log(`   ... and ${urls.length - 5} more\n`);
  }

  console.log(`📤 Submitting ${urls.length} URLs to IndexNow...\n`);
  const result = await submitBatched(urls, host, key, keyLocation, 1000);

  console.log('\n================================================');
  if (result.errors.length === 0) {
    console.log('✅ Submission Complete!');
    console.log(`   Total URLs submitted: ${result.totalSubmitted}`);
    console.log(`   Batches processed: ${result.batches}`);
  } else {
    console.log('⚠️  Submission completed with errors');
    console.log(`   Total URLs submitted: ${result.totalSubmitted}`);
    console.log(`   Errors: ${result.errors.length}`);
  }
  console.log('================================================\n');
}

main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});

