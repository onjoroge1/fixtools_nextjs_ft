/**
 * URL Redirect Checker API
 * POST /api/web-tools/redirect-checker
 * 
 * Checks URL redirects and follows redirect chains. Detects 301, 302 redirects, finds final destination, and checks for redirect loops.
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

// Follow redirect chain
async function followRedirects(url, maxRedirects = 10, visited = new Set()) {
  const results = {
    originalUrl: url,
    redirectChain: [],
    finalUrl: null,
    finalStatusCode: null,
    redirectCount: 0,
    hasLoop: false,
    hasTooManyRedirects: false,
    totalTime: 0,
    timestamps: [],
  };

  let currentUrl = url;
  let redirectCount = 0;
  const redirectChain = [];
  const startTime = Date.now();

  try {
    while (redirectCount < maxRedirects) {
      // Check for redirect loop
      if (visited.has(currentUrl)) {
        results.hasLoop = true;
        results.redirectChain = redirectChain;
        results.finalUrl = currentUrl;
        results.finalStatusCode = null;
        results.redirectCount = redirectCount;
        return results;
      }

      visited.add(currentUrl);

      const stepStartTime = Date.now();
      const parsedUrl = new URL(currentUrl);
      const protocol = parsedUrl.protocol === 'https:' ? https : http;
      
      const options = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
        path: parsedUrl.pathname + parsedUrl.search,
        method: 'HEAD',
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; FixTools/1.0; +https://fixtools.io)',
          'Accept': '*/*',
        },
        maxRedirects: 0, // Handle redirects manually
      };

      const stepResult = await new Promise((resolve, reject) => {
        const req = protocol.request(options, (res) => {
          // Consume response data to prevent hanging
          res.on('data', () => {});
          
          res.on('end', () => {
            const stepEndTime = Date.now();
            const stepTime = stepEndTime - stepStartTime;

            const step = {
              url: currentUrl,
              statusCode: res.statusCode,
              statusText: res.statusMessage,
              redirectType: null,
              location: null,
              headers: {
                location: res.headers.location,
                server: res.headers.server,
                'content-type': res.headers['content-type'],
              },
              responseTime: stepTime,
              timestamp: new Date().toISOString(),
            };

            // Check if it's a redirect
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
              step.redirectType = res.statusCode === 301 ? 'Permanent (301)' : 
                                  res.statusCode === 302 ? 'Temporary (302)' :
                                  res.statusCode === 303 ? 'See Other (303)' :
                                  res.statusCode === 307 ? 'Temporary Redirect (307)' :
                                  res.statusCode === 308 ? 'Permanent Redirect (308)' :
                                  `Redirect (${res.statusCode})`;
              step.location = res.headers.location;

              // Resolve relative URLs
              let nextUrl = res.headers.location;
              if (!nextUrl.startsWith('http://') && !nextUrl.startsWith('https://')) {
                const baseUrl = new URL(currentUrl);
                if (nextUrl.startsWith('//')) {
                  nextUrl = baseUrl.protocol + nextUrl;
                } else if (nextUrl.startsWith('/')) {
                  nextUrl = baseUrl.protocol + '//' + baseUrl.hostname + (baseUrl.port ? ':' + baseUrl.port : '') + nextUrl;
                } else {
                  const path = baseUrl.pathname.split('/').slice(0, -1).join('/') || '/';
                  nextUrl = baseUrl.protocol + '//' + baseUrl.hostname + (baseUrl.port ? ':' + baseUrl.port : '') + path + '/' + nextUrl;
                }
              }

              redirectChain.push(step);
              currentUrl = nextUrl;
              redirectCount++;
              resolve({ continue: true, step });
            } else {
              // Final destination
              step.redirectType = 'Final Destination';
              redirectChain.push(step);
              resolve({ continue: false, step });
            }
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
      });

      if (!stepResult.continue) {
        // Reached final destination
        results.redirectChain = redirectChain;
        results.finalUrl = currentUrl;
        results.finalStatusCode = stepResult.step.statusCode;
        results.redirectCount = redirectCount;
        results.totalTime = Date.now() - startTime;
        break;
      }
    }

    if (redirectCount >= maxRedirects) {
      results.hasTooManyRedirects = true;
      results.redirectChain = redirectChain;
      results.finalUrl = currentUrl;
    }

    results.totalTime = Date.now() - startTime;

  } catch (error) {
    results.error = error.message || 'Failed to follow redirects';
    results.redirectChain = redirectChain;
    results.finalUrl = currentUrl;
  }

  return results;
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
          message: 'Daily rate limit exceeded. A Processing Pass is required for unlimited redirect checks.',
          paymentRequired: true,
          reason: 'rate_limit',
          requirement: rateLimitRequirement,
        });
      }
    }

    // Process each URL (follow redirects)
    const results = [];
    
    for (const url of validUrls) {
      try {
        const redirectInfo = await followRedirects(url);
        results.push({
          ...redirectInfo,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        console.error(`Error checking redirects for ${url}:`, error);
        results.push({
          originalUrl: url,
          error: error.message || 'Failed to check redirects',
          redirectChain: [],
          redirectCount: 0,
          timestamp: new Date().toISOString(),
        });
      }
    }

    return res.status(200).json({
      success: true,
      results: results,
      count: results.length,
      message: `Redirect check completed for ${results.length} URL(s)`,
    });

  } catch (error) {
    console.error('Redirect checker error:', error);
    return res.status(500).json({
      error: 'Redirect check failed',
      message: error.message || 'Failed to check redirects. Please try again.',
      ...(process.env.NODE_ENV === 'development' && { details: error.stack })
    });
  }
}

