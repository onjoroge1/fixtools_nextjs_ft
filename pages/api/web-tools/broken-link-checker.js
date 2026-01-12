/**
 * Broken Link Checker API
 * POST /api/web-tools/broken-link-checker
 * 
 * Finds broken links on websites. Scans entire website for dead links, 404 errors, and redirect issues.
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

// Check if a URL is accessible
function checkLink(url, timeout = 10000) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    
    try {
      const parsedUrl = new URL(url);
      const protocol = parsedUrl.protocol === 'https:' ? https : http;
      const options = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
        path: parsedUrl.pathname + parsedUrl.search,
        method: 'HEAD',
        timeout: timeout,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; FixTools/1.0; +https://fixtools.io)',
        },
        maxRedirects: 5,
      };

      const req = protocol.request(options, (res) => {
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        const statusCode = res.statusCode;
        
        const isWorking = statusCode >= 200 && statusCode < 300;
        const isRedirect = statusCode >= 300 && statusCode < 400;
        const isBroken = statusCode >= 400;

        resolve({
          url: url,
          statusCode: statusCode,
          statusMessage: res.statusMessage,
          isWorking: isWorking,
          isRedirect: isRedirect,
          isBroken: isBroken,
          responseTime: responseTime,
          redirectLocation: isRedirect ? res.headers.location : null,
        });
      });

      req.on('error', (error) => {
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        
        resolve({
          url: url,
          statusCode: 0,
          statusMessage: error.message || 'Connection failed',
          isWorking: false,
          isRedirect: false,
          isBroken: true,
          responseTime: responseTime,
          error: error.message || 'Failed to connect',
        });
      });

      req.on('timeout', () => {
        req.destroy();
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        
        resolve({
          url: url,
          statusCode: 0,
          statusMessage: 'Request timeout',
          isWorking: false,
          isRedirect: false,
          isBroken: true,
          responseTime: responseTime,
          error: 'Request timeout',
        });
      });

      req.end();
    } catch (error) {
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      resolve({
        url: url,
        statusCode: 0,
        statusMessage: 'Invalid URL',
        isWorking: false,
        isRedirect: false,
        isBroken: true,
        responseTime: responseTime,
        error: `Invalid URL: ${error.message}`,
      });
    }
  });
}

// Extract all links from HTML
function extractLinks(html, baseUrl) {
  const links = new Set();
  
  try {
    const baseUrlObj = new URL(baseUrl);
    
    // Extract href attributes from anchor tags
    const hrefMatches = html.match(/<a[^>]+href=["']([^"']+)["'][^>]*>/gi) || [];
    
    hrefMatches.forEach((anchorTag) => {
      const hrefMatch = anchorTag.match(/href=["']([^"']+)["']/i);
      if (hrefMatch && hrefMatch[1]) {
        let link = hrefMatch[1].trim();
        
        // Skip javascript:, mailto:, tel:, #, and empty links
        if (
          link.startsWith('javascript:') ||
          link.startsWith('mailto:') ||
          link.startsWith('tel:') ||
          link.startsWith('#') ||
          link === ''
        ) {
          return;
        }

        try {
          // Convert relative URLs to absolute
          if (link.startsWith('//')) {
            link = baseUrlObj.protocol + link;
          } else if (link.startsWith('/')) {
            link = baseUrlObj.protocol + '//' + baseUrlObj.hostname + link;
          } else if (!link.startsWith('http://') && !link.startsWith('https://')) {
            // Relative path
            const basePath = baseUrlObj.pathname.substring(0, baseUrlObj.pathname.lastIndexOf('/'));
            link = baseUrlObj.protocol + '//' + baseUrlObj.hostname + basePath + '/' + link;
          }

          // Normalize URL
          const linkUrl = new URL(link);
          links.add(linkUrl.href);
        } catch (e) {
          // Invalid URL, skip
        }
      }
    });
  } catch (e) {
    // Error extracting links
  }

  return Array.from(links);
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
          message: 'Daily rate limit exceeded. A Processing Pass is required for unlimited broken link checks.',
          paymentRequired: true,
          reason: 'rate_limit',
          requirement: rateLimitRequirement,
        });
      }
    }

    // Process each URL (check for broken links)
    const results = [];
    
    for (const url of validUrls) {
      try {
        // Fetch HTML from the URL
        const { html, statusCode: pageStatus, baseUrl } = await fetchHtml(url);
        
        // Extract all links from the HTML
        const links = extractLinks(html, baseUrl);
        
        // Limit the number of links to check (free tier: max 50 links, paid: max 500 links)
        const maxLinksToCheck = userPlan === 'day_pass' ? 500 : 50;
        const linksToCheck = links.slice(0, maxLinksToCheck);
        
        // Check each link
        const linkResults = [];
        for (const link of linksToCheck) {
          const linkCheck = await checkLink(link);
          linkResults.push(linkCheck);
        }
        
        // Categorize links
        const workingLinks = linkResults.filter(l => l.isWorking);
        const brokenLinks = linkResults.filter(l => l.isBroken);
        const redirectLinks = linkResults.filter(l => l.isRedirect);
        
        results.push({
          url: url,
          pageStatus: pageStatus,
          totalLinks: links.length,
          linksChecked: linksToCheck.length,
          links: linkResults,
          summary: {
            working: workingLinks.length,
            broken: brokenLinks.length,
            redirects: redirectLinks.length,
          },
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        console.error(`Error checking broken links for ${url}:`, error);
        results.push({
          url: url,
          pageStatus: 0,
          error: error.message || 'Failed to check broken links',
          totalLinks: 0,
          linksChecked: 0,
          links: [],
          summary: {
            working: 0,
            broken: 0,
            redirects: 0,
          },
          timestamp: new Date().toISOString(),
        });
      }
    }

    // Calculate overall summary
    const totalLinks = results.reduce((sum, r) => sum + (r.totalLinks || 0), 0);
    const totalBroken = results.reduce((sum, r) => sum + (r.summary?.broken || 0), 0);
    const totalWorking = results.reduce((sum, r) => sum + (r.summary?.working || 0), 0);
    const totalRedirects = results.reduce((sum, r) => sum + (r.summary?.redirects || 0), 0);

    return res.status(200).json({
      success: true,
      results: results,
      count: results.length,
      summary: {
        total: results.length,
        totalLinks: totalLinks,
        totalBroken: totalBroken,
        totalWorking: totalWorking,
        totalRedirects: totalRedirects,
      },
      message: `Broken link check completed for ${results.length} URL(s)`,
    });

  } catch (error) {
    console.error('Broken link check error:', error);
    return res.status(500).json({
      error: 'Broken link check failed',
      message: error.message || 'Failed to check broken links. Please try again.',
      ...(process.env.NODE_ENV === 'development' && { details: error.stack })
    });
  }
}

