#!/usr/bin/env node

/**
 * Initial Bulk IndexNow Submission Script
 * 
 * This script submits ALL URLs from the sitemap to IndexNow.
 * Run this once after initial IndexNow setup.
 * 
 * Usage:
 *   npm run indexnow:submit-all
 * 
 * Or with environment variables:
 *   NEXT_PUBLIC_HOST=https://fixtools.io INDEXNOW_KEY=your-key npm run indexnow:submit-all
 */

// Note: Environment variables should be set before running this script
// The script will use process.env.NEXT_PUBLIC_HOST and process.env.INDEXNOW_KEY

async function main() {
  console.log('🚀 IndexNow Bulk Submission Script');
  console.log('=====================================\n');

  // Dynamic imports for ES modules
  const { getAllSitemapUrls } = await import('../lib/getAllSitemapUrls.js');
  const { submitToIndexNowBatched, getIndexNowConfig } = await import('../lib/indexnow.js');

  // Get configuration
  const config = getIndexNowConfig();
  
  if (!config) {
    console.error('❌ IndexNow not configured!');
    console.error('Set NEXT_PUBLIC_HOST and INDEXNOW_KEY environment variables.');
    process.exit(1);
  }

  console.log(`📋 Configuration:`);
  console.log(`   Host: ${config.host}`);
  console.log(`   Key: ${config.key.substring(0, 20)}...`);
  console.log(`   Key Location: ${config.keyLocation}\n`);

  // Get all URLs from sitemap
  console.log('📊 Collecting URLs from sitemap...');
  const urls = getAllSitemapUrls();
  console.log(`   Found ${urls.length} URLs\n`);

  if (urls.length === 0) {
    console.error('❌ No URLs found!');
    process.exit(1);
  }

  // Show sample URLs
  console.log('📝 Sample URLs (first 5):');
  urls.slice(0, 5).forEach((url, i) => {
    console.log(`   ${i + 1}. ${url}`);
  });
  if (urls.length > 5) {
    console.log(`   ... and ${urls.length - 5} more\n`);
  } else {
    console.log('');
  }

  // Confirm before submitting
  console.log('⚠️  Ready to submit all URLs to IndexNow');
  console.log(`   This will submit ${urls.length} URLs in batches\n`);

  // Submit in batches
  console.log('📤 Submitting to IndexNow...\n');
  const result = await submitToIndexNowBatched(
    urls,
    config.host,
    config.key,
    config.keyLocation,
    1000 // Batch size
  );

  // Report results
  console.log('\n=====================================');
  if (result.success) {
    console.log('✅ Submission Complete!');
    console.log(`   Total URLs submitted: ${result.totalSubmitted}`);
    console.log(`   Batches processed: ${result.batches}`);
    console.log('\n📊 Next Steps:');
    console.log('   1. Check Bing Webmaster Tools for indexing status');
    console.log('   2. Monitor search results over the next 24-48 hours');
    console.log('   3. Use /api/indexnow/submit for future page updates');
  } else {
    console.log('⚠️  Submission completed with errors');
    console.log(`   Total URLs submitted: ${result.totalSubmitted}`);
    console.log(`   Errors: ${result.errors.length}`);
    result.errors.forEach((error, i) => {
      console.log(`   ${i + 1}. ${error}`);
    });
  }
  console.log('=====================================\n');
}

// Run the script
main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});

