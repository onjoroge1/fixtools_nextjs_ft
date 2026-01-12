/**
 * Website Comparison API
 * POST /api/web-tools/website-comparison
 * 
 * Compares two or more websites side-by-side. Analyzes performance, SEO, accessibility, and provides visual comparisons.
 * Requires payment for batch processing (4+ URLs) or exceeding rate limits
 */

import { checkPaymentRequirement } from '../../../lib/config/pricing';
import { verifyProcessingPass } from '../../../lib/payments/payment-utils';
import https from 'https';
import http from 'http';
import { URL } from 'url';

// Get user plan from session
async function getUserPlanFromSession(sessionId) {
  if (!sessionId) return 'free';
  
  try {
    const hasValidPass = await verifyProcessingPass(sessionId);
    if (hasValidPass) {
      return 'day_pass';
    }
  } catch (e) {
    // Invalid session
  }
  return 'free';
}

// Fetch HTML content from URL
function fetchHtml(url, timeout = 15000) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    try {
      const parsedUrl = new URL(url);
      const protocol = parsedUrl.protocol === 'https:' ? https : http;
      const options = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
        path: parsedUrl.pathname + parsedUrl.search,
        method: 'GET',
        timeout: timeout,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; FixTools/1.0; +https://fixtools.io)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
      };

      let html = '';
      const req = protocol.request(options, (res) => {
        res.on('data', (chunk) => {
          html += chunk.toString();
        });

        res.on('end', () => {
          const endTime = Date.now();
          const responseTime = endTime - startTime;
          resolve({
            html: html,
            statusCode: res.statusCode,
            headers: res.headers,
            baseUrl: url,
            responseTime: responseTime,
          });
        });
      });

      req.on('error', (error) => {
        reject(new Error(`HTTP request failed: ${error.message}`));
      });

      req.on('timeout', () => {
        req.destroy();
        reject(new Error('HTTP request timeout'));
      });

      req.end();
    } catch (error) {
      reject(new Error(`Invalid URL: ${error.message}`));
    }
  });
}

// Extract basic website information
function extractWebsiteInfo(html, url, statusCode, headers, responseTime) {
  const info = {
    url: url,
    statusCode: statusCode,
    responseTime: responseTime,
    title: null,
    description: null,
    language: null,
    charset: null,
    viewport: null,
    hasOpenGraph: false,
    hasTwitter: false,
    hasStructuredData: false,
    linkCount: 0,
    imageCount: 0,
    headingCount: 0,
    metaTagsCount: 0,
  };

  // Extract title
  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  if (titleMatch && titleMatch[1]) {
    info.title = titleMatch[1].trim();
  }

  // Extract meta description
  const descMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i);
  if (descMatch && descMatch[1]) {
    info.description = descMatch[1].trim();
  }

  // Extract language
  const langMatch = html.match(/<html[^>]+lang=["']([^"']+)["']/i);
  if (langMatch && langMatch[1]) {
    info.language = langMatch[1];
  }

  // Extract charset
  const charsetMatch = html.match(/<meta[^>]+charset=["']?([^"'\s>]+)["']?/i);
  if (charsetMatch && charsetMatch[1]) {
    info.charset = charsetMatch[1];
  }

  // Extract viewport
  const viewportMatch = html.match(/<meta[^>]+name=["']viewport["'][^>]+content=["']([^"']+)["']/i);
  if (viewportMatch && viewportMatch[1]) {
    info.viewport = viewportMatch[1];
  }

  // Check for Open Graph
  if (html.match(/<meta[^>]+property=["']og:/i)) {
    info.hasOpenGraph = true;
  }

  // Check for Twitter Card
  if (html.match(/<meta[^>]+name=["']twitter:/i)) {
    info.hasTwitter = true;
  }

  // Check for structured data
  if (html.match(/<script[^>]*type=["']application\/ld\+json["']/i)) {
    info.hasStructuredData = true;
  }

  // Count links
  const linkMatches = html.match(/<a[^>]+href=/gi) || [];
  info.linkCount = linkMatches.length;

  // Count images
  const imgMatches = html.match(/<img[^>]+>/gi) || [];
  info.imageCount = imgMatches.length;

  // Count headings
  const headingMatches = html.match(/<h[1-6][^>]*>/gi) || [];
  info.headingCount = headingMatches.length;

  // Count meta tags
  const metaMatches = html.match(/<meta[^>]+>/gi) || [];
  info.metaTagsCount = metaMatches.length;

  // Extract canonical URL
  const canonicalMatch = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i);
  if (canonicalMatch && canonicalMatch[1]) {
    info.canonical = canonicalMatch[1];
  }

  // Check HTTPS
  info.isHttps = url.startsWith('https://');

  // Extract server info from headers
  if (headers.server) {
    info.server = headers.server;
  }

  // Check security headers
  info.hasSecurityHeaders = {
    hsts: !!headers['strict-transport-security'],
    csp: !!headers['content-security-policy'],
    xFrame: !!headers['x-frame-options'],
    xContentType: !!headers['x-content-type-options'],
  };

  return info;
}

// Compare websites
function compareWebsites(websites) {
  if (websites.length < 2) {
    return {
      comparison: null,
      message: 'At least 2 websites are required for comparison',
    };
  }

  const comparison = {
    totalWebsites: websites.length,
    fastest: null,
    slowest: null,
    mostLinks: null,
    mostImages: null,
    bestMetadata: null,
    hasHttps: [],
    hasSecurityHeaders: [],
    averages: {
      responseTime: 0,
      linkCount: 0,
      imageCount: 0,
      headingCount: 0,
      metaTagsCount: 0,
    },
  };

  // Calculate averages and find extremes
  let totalResponseTime = 0;
  let totalLinks = 0;
  let totalImages = 0;
  let totalHeadings = 0;
  let totalMetaTags = 0;
  let fastestTime = Infinity;
  let slowestTime = 0;
  let mostLinksCount = 0;
  let mostImagesCount = 0;
  let bestMetadataScore = 0;

  websites.forEach((site) => {
    totalResponseTime += site.responseTime || 0;
    totalLinks += site.linkCount || 0;
    totalImages += site.imageCount || 0;
    totalHeadings += site.headingCount || 0;
    totalMetaTags += site.metaTagsCount || 0;

    if (site.responseTime < fastestTime) {
      fastestTime = site.responseTime;
      comparison.fastest = site.url;
    }

    if (site.responseTime > slowestTime) {
      slowestTime = site.responseTime;
      comparison.slowest = site.url;
    }

    if (site.linkCount > mostLinksCount) {
      mostLinksCount = site.linkCount;
      comparison.mostLinks = site.url;
    }

    if (site.imageCount > mostImagesCount) {
      mostImagesCount = site.imageCount;
      comparison.mostImages = site.url;
    }

    // Calculate metadata score (title + description + Open Graph + Twitter + structured data)
    const metadataScore = (site.title ? 1 : 0) + 
                          (site.description ? 1 : 0) + 
                          (site.hasOpenGraph ? 1 : 0) + 
                          (site.hasTwitter ? 1 : 0) + 
                          (site.hasStructuredData ? 1 : 0);

    if (metadataScore > bestMetadataScore) {
      bestMetadataScore = metadataScore;
      comparison.bestMetadata = site.url;
    }

    if (site.isHttps) {
      comparison.hasHttps.push(site.url);
    }

    const securityHeadersCount = Object.values(site.hasSecurityHeaders || {}).filter(Boolean).length;
    if (securityHeadersCount > 0) {
      comparison.hasSecurityHeaders.push({
        url: site.url,
        count: securityHeadersCount,
      });
    }
  });

  comparison.averages.responseTime = Math.round(totalResponseTime / websites.length);
  comparison.averages.linkCount = Math.round(totalLinks / websites.length);
  comparison.averages.imageCount = Math.round(totalImages / websites.length);
  comparison.averages.headingCount = Math.round(totalHeadings / websites.length);
  comparison.averages.metaTagsCount = Math.round(totalMetaTags / websites.length);

  return comparison;
}

// Validate URL
function validateUrl(inputUrl) {
  if (!inputUrl || inputUrl.trim().length < 3) {
    throw new Error('Invalid URL format');
  }

  // Add protocol if missing
  let url = inputUrl.trim();
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }

  try {
    const parsedUrl = new URL(url);
    
    // Check for localhost/private IPs
    const hostname = parsedUrl.hostname;
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname.startsWith('192.168.') ||
      hostname.startsWith('10.') ||
      hostname.startsWith('172.16.') ||
      hostname.startsWith('172.17.') ||
      hostname.startsWith('172.18.') ||
      hostname.startsWith('172.19.') ||
      hostname.startsWith('172.2') ||
      hostname.startsWith('172.3') ||
      hostname.endsWith('.local')
    ) {
      throw new Error('Private and localhost URLs are not allowed');
    }

    return url;
  } catch (error) {
    throw new Error(`Invalid URL format: ${error.message}`);
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      message: 'Only POST requests are supported' 
    });
  }

  try {
    const { url, urls = [], sessionId } = req.body;

    // Validate URL(s)
    const allUrls = urls.length > 0 ? urls : (url ? [url] : []);
    
    if (allUrls.length === 0) {
      return res.status(400).json({
        error: 'Invalid URL',
        message: 'Please provide at least one valid URL'
      });
    }

    // For comparison, need at least 2 URLs
    if (allUrls.length < 2) {
      return res.status(400).json({
        error: 'Insufficient URLs',
        message: 'At least 2 URLs are required for website comparison'
      });
    }

    // Validate each URL
    const validUrls = [];
    for (const testUrl of allUrls) {
      try {
        const cleanUrl = validateUrl(testUrl);
        validUrls.push(cleanUrl);
      } catch (e) {
        return res.status(400).json({
          error: 'Invalid URL',
          message: `Please provide a valid URL for ${testUrl}. Error: ${e.message}`
        });
      }
    }

    const urlCount = validUrls.length;
    const userPlan = await getUserPlanFromSession(sessionId);
    
    // Check payment requirement for batch (4+ URLs require payment)
    if (urlCount >= 4) {
      const batchRequirement = checkPaymentRequirement('web-tools', 0, urlCount, userPlan);
      if (batchRequirement.requiresPayment && batchRequirement.reason === 'batch') {
        const hasValidPass = await verifyProcessingPass(sessionId);
        if (!hasValidPass) {
          return res.status(402).json({
            error: 'Payment required',
            message: `Batch processing (${urlCount} URLs) requires a Processing Pass. Free tier allows up to 3 URLs at a time.`,
            paymentRequired: true,
            reason: 'batch',
            urlCount: urlCount,
            requirement: batchRequirement,
          });
        }
      }
    }

    // Check rate limits (free tier: 5 checks per day)
    const rateLimitRequirement = checkPaymentRequirement('web-tools', 0, 1, userPlan);
    if (rateLimitRequirement.requiresPayment && rateLimitRequirement.reason === 'rate_limit') {
      const hasValidPass = await verifyProcessingPass(sessionId);
      if (!hasValidPass) {
        return res.status(402).json({
          error: 'Payment required',
          message: 'Daily rate limit exceeded. A Processing Pass is required for unlimited website comparisons.',
          paymentRequired: true,
          reason: 'rate_limit',
          requirement: rateLimitRequirement,
        });
      }
    }

    // Process each URL (extract website information)
    const results = [];
    
    for (const url of validUrls) {
      try {
        // Fetch HTML from the URL
        const { html, statusCode, headers, baseUrl, responseTime } = await fetchHtml(url);
        
        // Extract website information
        const websiteInfo = extractWebsiteInfo(html, baseUrl, statusCode, headers, responseTime);
        
        results.push(websiteInfo);
      } catch (error) {
        console.error(`Error comparing website ${url}:`, error);
        results.push({
          url: url,
          statusCode: 0,
          error: error.message || 'Failed to fetch website',
          responseTime: 0,
          timestamp: new Date().toISOString(),
        });
      }
    }

    // Compare websites
    const validResults = results.filter(r => !r.error);
    const comparison = compareWebsites(validResults);

    return res.status(200).json({
      success: true,
      results: results,
      comparison: comparison,
      count: results.length,
      message: `Website comparison completed for ${results.length} URL(s)`,
    });

  } catch (error) {
    console.error('Website comparison error:', error);
    return res.status(500).json({
      error: 'Website comparison failed',
      message: error.message || 'Failed to compare websites. Please try again.',
      ...(process.env.NODE_ENV === 'development' && { details: error.stack })
    });
  }
}

