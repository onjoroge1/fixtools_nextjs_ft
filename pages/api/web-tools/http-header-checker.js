/**
 * HTTP Header Checker API
 * POST /api/web-tools/http-header-checker
 * 
 * Checks HTTP response headers for any website. Analyzes security headers, redirects, and server information.
 * Requires payment for batch processing (4+ domains) or exceeding rate limits
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

// Fetch HTTP headers for a URL
function fetchHeaders(url) {
  return new Promise((resolve, reject) => {
    try {
      const parsedUrl = new URL(url);
      const protocol = parsedUrl.protocol === 'https:' ? https : http;
      const options = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
        path: parsedUrl.pathname + parsedUrl.search,
        method: 'HEAD',
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; FixTools/1.0; +https://fixtools.io)',
        },
      };

      const req = protocol.request(options, (res) => {
        const headers = {};
        const statusCode = res.statusCode;
        const statusMessage = res.statusMessage;

        // Get all headers
        Object.keys(res.headers).forEach((key) => {
          headers[key.toLowerCase()] = res.headers[key];
        });

        // Categorize headers
        const securityHeaders = [
          'strict-transport-security',
          'content-security-policy',
          'x-content-type-options',
          'x-frame-options',
          'x-xss-protection',
          'referrer-policy',
          'permissions-policy',
          'expect-ct',
          'public-key-pins',
        ];

        const cachingHeaders = [
          'cache-control',
          'expires',
          'etag',
          'last-modified',
          'pragma',
        ];

        const corsHeaders = [
          'access-control-allow-origin',
          'access-control-allow-methods',
          'access-control-allow-headers',
          'access-control-allow-credentials',
          'access-control-expose-headers',
        ];

        const categorizedHeaders = {
          security: {},
          caching: {},
          cors: {},
          server: {},
          other: {},
        };

        Object.keys(headers).forEach((key) => {
          if (securityHeaders.includes(key)) {
            categorizedHeaders.security[key] = headers[key];
          } else if (cachingHeaders.includes(key)) {
            categorizedHeaders.caching[key] = headers[key];
          } else if (corsHeaders.includes(key)) {
            categorizedHeaders.cors[key] = headers[key];
          } else if (key === 'server' || key === 'x-powered-by') {
            categorizedHeaders.server[key] = headers[key];
          } else {
            categorizedHeaders.other[key] = headers[key];
          }
        });

        // Check for redirects
        const isRedirect = statusCode >= 300 && statusCode < 400;
        const redirectLocation = isRedirect ? headers.location : null;

        resolve({
          url: url,
          statusCode: statusCode,
          statusMessage: statusMessage,
          isRedirect: isRedirect,
          redirectLocation: redirectLocation,
          headers: headers,
          categorizedHeaders: categorizedHeaders,
          timestamp: new Date().toISOString(),
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
          message: 'Daily rate limit exceeded. A Processing Pass is required for unlimited HTTP header checks.',
          paymentRequired: true,
          reason: 'rate_limit',
          requirement: rateLimitRequirement,
        });
      }
    }

    // Process each URL
    const results = [];
    
    for (const url of validUrls) {
      try {
        const headerInfo = await fetchHeaders(url);
        results.push(headerInfo);
      } catch (error) {
        console.error(`Error checking headers for ${url}:`, error);
        results.push({
          url: url,
          error: error.message || 'Failed to check HTTP headers',
          timestamp: new Date().toISOString(),
        });
      }
    }

    return res.status(200).json({
      success: true,
      results: results,
      count: results.length,
      message: `HTTP header check completed for ${results.length} URL(s)`,
    });

  } catch (error) {
    console.error('HTTP header check error:', error);
    return res.status(500).json({
      error: 'HTTP header check failed',
      message: error.message || 'Failed to check HTTP headers. Please try again.',
      ...(process.env.NODE_ENV === 'development' && { details: error.stack })
    });
  }
}

