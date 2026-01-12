/**
 * Website Metadata Extractor API
 * POST /api/web-tools/metadata-extractor
 * 
 * Extracts and analyzes website metadata, meta tags, Open Graph tags, and structured data.
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
          resolve({
            html: html,
            statusCode: res.statusCode,
            headers: res.headers,
            baseUrl: url,
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

// Extract metadata from HTML
function extractMetadata(html, baseUrl) {
  const metadata = {
    basic: {},
    openGraph: {},
    twitter: {},
    structuredData: [],
    other: {},
  };

  // Extract title
  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  if (titleMatch && titleMatch[1]) {
    metadata.basic.title = titleMatch[1].trim();
  }

  // Extract meta tags
  const metaMatches = html.match(/<meta[^>]+>/gi) || [];
  
  metaMatches.forEach((metaTag) => {
    // Get attribute values
    const nameMatch = metaTag.match(/name=["']([^"']+)["']/i);
    const propertyMatch = metaTag.match(/property=["']([^"']+)["']/i);
    const contentMatch = metaTag.match(/content=["']([^"']+)["']/i);
    const httpEquivMatch = metaTag.match(/http-equiv=["']([^"']+)["']/i);
    const charsetMatch = metaTag.match(/charset=["']?([^"'\s>]+)["']?/i);

    if (charsetMatch) {
      metadata.basic.charset = charsetMatch[1];
    }

    if (contentMatch) {
      const content = contentMatch[1];
      
      // Open Graph tags
      if (propertyMatch) {
        const property = propertyMatch[1].toLowerCase();
        if (property.startsWith('og:')) {
          const key = property.replace('og:', '');
          metadata.openGraph[key] = content;
        } else if (property.startsWith('article:')) {
          metadata.openGraph[property] = content;
        }
      }
      
      // Twitter Card tags
      if (nameMatch) {
        const name = nameMatch[1].toLowerCase();
        if (name.startsWith('twitter:')) {
          const key = name.replace('twitter:', '');
          metadata.twitter[key] = content;
        }
      }

      // Basic meta tags
      if (nameMatch && !nameMatch[1].toLowerCase().startsWith('twitter:')) {
        const name = nameMatch[1].toLowerCase();
        if (name === 'description') {
          metadata.basic.description = content;
        } else if (name === 'keywords') {
          metadata.basic.keywords = content;
        } else if (name === 'author') {
          metadata.basic.author = content;
        } else if (name === 'viewport') {
          metadata.basic.viewport = content;
        } else if (name === 'robots') {
          metadata.basic.robots = content;
        } else if (name === 'generator') {
          metadata.basic.generator = content;
        } else {
          metadata.other[name] = content;
        }
      }

      // HTTP-EQUIV meta tags
      if (httpEquivMatch) {
        const httpEquiv = httpEquivMatch[1].toLowerCase();
        metadata.other[`http-equiv:${httpEquiv}`] = content;
      }
    }
  });

  // Extract canonical URL
  const canonicalMatch = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i);
  if (canonicalMatch && canonicalMatch[1]) {
    metadata.basic.canonical = canonicalMatch[1];
  }

  // Extract structured data (JSON-LD)
  const jsonLdMatches = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([^<]*)<\/script>/gi) || [];
  jsonLdMatches.forEach((scriptTag) => {
    const contentMatch = scriptTag.match(/<script[^>]*>([^<]*)<\/script>/i);
    if (contentMatch && contentMatch[1]) {
      try {
        const structuredData = JSON.parse(contentMatch[1]);
        metadata.structuredData.push(structuredData);
      } catch (e) {
        // Invalid JSON, skip
      }
    }
  });

  // Extract favicon
  const faviconMatches = html.match(/<link[^>]+rel=["'](?:icon|shortcut icon)["'][^>]+href=["']([^"']+)["']/i);
  if (faviconMatches && faviconMatches[1]) {
    metadata.basic.favicon = faviconMatches[1];
  }

  // Extract language
  const htmlMatch = html.match(/<html[^>]+lang=["']([^"']+)["']/i);
  if (htmlMatch && htmlMatch[1]) {
    metadata.basic.language = htmlMatch[1];
  }

  return metadata;
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
          message: 'Daily rate limit exceeded. A Processing Pass is required for unlimited metadata extraction.',
          paymentRequired: true,
          reason: 'rate_limit',
          requirement: rateLimitRequirement,
        });
      }
    }

    // Process each URL (extract metadata)
    const results = [];
    
    for (const url of validUrls) {
      try {
        // Fetch HTML from the URL
        const { html, statusCode, headers, baseUrl } = await fetchHtml(url);
        
        // Extract metadata from HTML
        const metadata = extractMetadata(html, baseUrl);
        
        results.push({
          url: url,
          statusCode: statusCode,
          metadata: metadata,
          summary: {
            hasTitle: !!metadata.basic.title,
            hasDescription: !!metadata.basic.description,
            hasOpenGraph: Object.keys(metadata.openGraph).length > 0,
            hasTwitter: Object.keys(metadata.twitter).length > 0,
            hasStructuredData: metadata.structuredData.length > 0,
            structuredDataTypes: metadata.structuredData.map(sd => sd['@type'] || 'Unknown').filter(Boolean),
          },
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        console.error(`Error extracting metadata for ${url}:`, error);
        results.push({
          url: url,
          statusCode: 0,
          error: error.message || 'Failed to extract metadata',
          metadata: null,
          summary: null,
          timestamp: new Date().toISOString(),
        });
      }
    }

    // Calculate overall summary
    const totalWithTitle = results.filter(r => r.summary?.hasTitle).length;
    const totalWithDescription = results.filter(r => r.summary?.hasDescription).length;
    const totalWithOpenGraph = results.filter(r => r.summary?.hasOpenGraph).length;
    const totalWithTwitter = results.filter(r => r.summary?.hasTwitter).length;
    const totalWithStructuredData = results.filter(r => r.summary?.hasStructuredData).length;

    return res.status(200).json({
      success: true,
      results: results,
      count: results.length,
      summary: {
        total: results.length,
        withTitle: totalWithTitle,
        withDescription: totalWithDescription,
        withOpenGraph: totalWithOpenGraph,
        withTwitter: totalWithTwitter,
        withStructuredData: totalWithStructuredData,
      },
      message: `Metadata extraction completed for ${results.length} URL(s)`,
    });

  } catch (error) {
    console.error('Metadata extraction error:', error);
    return res.status(500).json({
      error: 'Metadata extraction failed',
      message: error.message || 'Failed to extract metadata. Please try again.',
      ...(process.env.NODE_ENV === 'development' && { details: error.stack })
    });
  }
}

