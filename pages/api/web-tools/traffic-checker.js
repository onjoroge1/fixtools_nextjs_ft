/**
 * Website Traffic Checker API
 * POST /api/web-tools/traffic-checker
 * 
 * Checks and estimates website traffic, visitor statistics, and popularity metrics. Analyzes website traffic trends, page views, and engagement metrics.
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

// Fetch website information
async function fetchWebsiteInfo(url, timeout = 15000) {
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

// Estimate traffic based on website signals
function estimateTraffic(url, html, statusCode, headers, responseTime) {
  const info = {
    url: url,
    statusCode: statusCode,
    responseTime: responseTime,
    isOnline: statusCode >= 200 && statusCode < 400,
    estimatedTraffic: null,
    trafficRange: null,
    trafficCategory: null,
    indicators: {
      hasSeoSignals: false,
      hasSocialSignals: false,
      hasPerformanceSignals: false,
      hasContentSignals: false,
      linkCount: 0,
      imageCount: 0,
      pageSize: 0,
      hasOpenGraph: false,
      hasTwitter: false,
      hasStructuredData: false,
    },
  };

  if (!html || statusCode < 200 || statusCode >= 400) {
    info.estimatedTraffic = 'Unable to estimate - website not accessible';
    info.trafficCategory = 'Unknown';
    return info;
  }

  // Extract SEO signals
  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  const descMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i);
  if (titleMatch && descMatch) {
    info.indicators.hasSeoSignals = true;
  }

  // Check for Open Graph
  if (html.match(/<meta[^>]+property=["']og:/i)) {
    info.indicators.hasOpenGraph = true;
    info.indicators.hasSocialSignals = true;
  }

  // Check for Twitter Card
  if (html.match(/<meta[^>]+name=["']twitter:/i)) {
    info.indicators.hasTwitter = true;
    info.indicators.hasSocialSignals = true;
  }

  // Check for structured data
  if (html.match(/<script[^>]*type=["']application\/ld\+json["']/i)) {
    info.indicators.hasStructuredData = true;
    info.indicators.hasContentSignals = true;
  }

  // Count links and images
  const linkMatches = html.match(/<a[^>]+href=/gi) || [];
  info.indicators.linkCount = linkMatches.length;

  const imgMatches = html.match(/<img[^>]+>/gi) || [];
  info.indicators.imageCount = imgMatches.length;

  // Calculate page size
  info.indicators.pageSize = Buffer.byteLength(html, 'utf8');

  // Performance signals (response time)
  if (responseTime < 1000) {
    info.indicators.hasPerformanceSignals = true;
  }

  // Content signals (sufficient content)
  if (html.length > 2000) {
    info.indicators.hasContentSignals = true;
  }

  // Estimate traffic based on signals
  // This is a simplified estimation algorithm - conservative approach
  // In production, this would integrate with APIs like SimilarWeb, SEMrush, or Alexa
  // Note: We're being conservative because we can't actually measure real traffic
  // without analytics access or paid APIs
  
  let score = 0;
  
  // SEO signals (basic requirements, not high-traffic indicators)
  if (info.indicators.hasSeoSignals) score += 0.5; // Reduced from 2
  
  // Social signals (indicates marketing effort)
  if (info.indicators.hasSocialSignals) score += 0.5; // Reduced from 2
  
  // Performance (fast sites might be more popular)
  if (info.indicators.hasPerformanceSignals) score += 0.5; // Reduced from 1
  
  // Content quality (more content might indicate established site)
  if (info.indicators.hasContentSignals) {
    // Scale based on actual content length
    if (html.length > 10000) score += 1; // Substantial content
    else if (html.length > 5000) score += 0.5; // Moderate content
    else score += 0.25; // Minimal content
  }
  
  // Structured data (indicates professional SEO)
  if (info.indicators.hasStructuredData) score += 0.5; // Reduced from 1
  
  // Links (more links might indicate established site, but not always)
  if (info.indicators.linkCount > 50) score += 1; // Many links
  else if (info.indicators.linkCount > 20) score += 0.5; // Moderate links
  else if (info.indicators.linkCount > 10) score += 0.25; // Few links
  
  // Images (more images might indicate content-rich site)
  if (info.indicators.imageCount > 20) score += 0.5; // Many images
  else if (info.indicators.imageCount > 10) score += 0.25; // Some images
  
  // Performance bonus (very fast sites are often well-optimized)
  if (responseTime < 300) score += 0.5; // Very fast
  else if (responseTime < 500) score += 0.25; // Fast
  
  // Page size (larger pages might indicate content-rich site)
  const pageSizeKB = info.indicators.pageSize / 1024;
  if (pageSizeKB > 500) score += 0.5; // Large page
  else if (pageSizeKB > 200) score += 0.25; // Medium page
  
  // Conservative thresholds - most sites should fall in Low/Low-Medium range
  // Without actual traffic data, we default to conservative estimates
  const finalScore = Math.round(score * 10) / 10; // Round to 1 decimal
  
  // Map score to traffic estimates (conservative approach)
  // Note: This is a simplified estimation. Real traffic data requires paid APIs
  // We're intentionally conservative - most sites without actual analytics data
  // should be estimated in the low ranges
  if (finalScore >= 7) {
    info.trafficCategory = 'High Traffic';
    info.estimatedTraffic = '100,000 - 1,000,000+ monthly visitors';
    info.trafficRange = { min: 100000, max: 1000000 };
  } else if (finalScore >= 4) {
    info.trafficCategory = 'Medium-High Traffic';
    info.estimatedTraffic = '10,000 - 100,000 monthly visitors';
    info.trafficRange = { min: 10000, max: 100000 };
  } else if (finalScore >= 2) {
    info.trafficCategory = 'Medium Traffic';
    info.estimatedTraffic = '1,000 - 10,000 monthly visitors';
    info.trafficRange = { min: 1000, max: 10000 };
  } else if (finalScore >= 1) {
    info.trafficCategory = 'Low-Medium Traffic';
    info.estimatedTraffic = '100 - 1,000 monthly visitors';
    info.trafficRange = { min: 100, max: 1000 };
  } else {
    info.trafficCategory = 'Low Traffic';
    info.estimatedTraffic = 'Less than 100 monthly visitors';
    info.trafficRange = { min: 0, max: 100 };
  }

  // Add confidence level (always low-medium since we're estimating)
  info.confidence = finalScore >= 5 ? 'Medium' : 'Low';
  info.score = finalScore;

  // Extract domain age indicator (from meta tags if available)
  const robotsMatch = html.match(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)["']/i);
  if (robotsMatch) {
    info.indicators.hasRobotsMeta = true;
  }

  return info;
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
          message: 'Daily rate limit exceeded. A Processing Pass is required for unlimited traffic checks.',
          paymentRequired: true,
          reason: 'rate_limit',
          requirement: rateLimitRequirement,
        });
      }
    }

    // Process each URL (estimate traffic)
    const results = [];
    
    for (const url of validUrls) {
      try {
        // Fetch website information
        const { html, statusCode, headers, baseUrl, responseTime } = await fetchWebsiteInfo(url);
        
        // Estimate traffic
        const trafficInfo = estimateTraffic(baseUrl, html, statusCode, headers, responseTime);
        
        results.push({
          ...trafficInfo,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        console.error(`Error checking traffic for ${url}:`, error);
        results.push({
          url: url,
          statusCode: 0,
          error: error.message || 'Failed to check traffic',
          isOnline: false,
          estimatedTraffic: 'Unable to estimate',
          trafficCategory: 'Unknown',
          timestamp: new Date().toISOString(),
        });
      }
    }

    return res.status(200).json({
      success: true,
      results: results,
      count: results.length,
      message: `Traffic check completed for ${results.length} URL(s)`,
      disclaimer: 'Traffic estimates are conservative approximations based on publicly available signals (SEO indicators, content quality, performance). These estimates do not reflect actual visitor counts and should not be used for business decisions. For accurate traffic data, use Google Analytics (for your own sites) or paid APIs like SimilarWeb/SEMrush (for competitor data).',
    });

  } catch (error) {
    console.error('Traffic checker error:', error);
    return res.status(500).json({
      error: 'Traffic check failed',
      message: error.message || 'Failed to check traffic. Please try again.',
      ...(process.env.NODE_ENV === 'development' && { details: error.stack })
    });
  }
}

