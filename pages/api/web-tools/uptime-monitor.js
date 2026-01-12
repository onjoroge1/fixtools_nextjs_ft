/**
 * Website Uptime Monitor API
 * POST /api/web-tools/uptime-monitor
 * 
 * Monitors website uptime and availability. Checks if websites are online, tracks response times, and provides uptime statistics.
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

// Check website uptime
function checkUptime(url, timeout = 10000) {
  return new Promise((resolve) => {
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
        },
      };

      const req = protocol.request(options, (res) => {
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        const statusCode = res.statusCode;
        
        // Determine status based on status code
        const isOnline = statusCode >= 200 && statusCode < 400;
        const isRedirect = statusCode >= 300 && statusCode < 400;
        const isError = statusCode >= 400;
        
        let status = 'online';
        if (isError) {
          status = 'error';
        } else if (isRedirect) {
          status = 'redirect';
        }

        resolve({
          url: url,
          status: status,
          isOnline: isOnline,
          isRedirect: isRedirect,
          isError: isError,
          statusCode: statusCode,
          statusMessage: res.statusMessage,
          responseTime: responseTime,
          timestamp: new Date().toISOString(),
        });
      });

      req.on('error', (error) => {
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        
        resolve({
          url: url,
          status: 'offline',
          isOnline: false,
          isRedirect: false,
          isError: true,
          statusCode: 0,
          statusMessage: error.message || 'Connection failed',
          responseTime: responseTime,
          error: error.message || 'Failed to connect to server',
          timestamp: new Date().toISOString(),
        });
      });

      req.on('timeout', () => {
        req.destroy();
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        
        resolve({
          url: url,
          status: 'timeout',
          isOnline: false,
          isRedirect: false,
          isError: true,
          statusCode: 0,
          statusMessage: 'Request timeout',
          responseTime: responseTime,
          error: 'Request timeout - server did not respond within ' + timeout + 'ms',
          timestamp: new Date().toISOString(),
        });
      });

      req.end();
    } catch (error) {
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      resolve({
        url: url,
        status: 'error',
        isOnline: false,
        isRedirect: false,
        isError: true,
        statusCode: 0,
        statusMessage: 'Invalid URL',
        responseTime: responseTime,
        error: `Invalid URL: ${error.message}`,
        timestamp: new Date().toISOString(),
      });
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
          message: 'Daily rate limit exceeded. A Processing Pass is required for unlimited uptime checks.',
          paymentRequired: true,
          reason: 'rate_limit',
          requirement: rateLimitRequirement,
        });
      }
    }

    // Process each URL (check uptime)
    const results = [];
    
    for (const url of validUrls) {
      try {
        const uptimeInfo = await checkUptime(url);
        results.push(uptimeInfo);
      } catch (error) {
        console.error(`Error checking uptime for ${url}:`, error);
        results.push({
          url: url,
          status: 'error',
          isOnline: false,
          isRedirect: false,
          isError: true,
          statusCode: 0,
          statusMessage: 'Check failed',
          responseTime: 0,
          error: error.message || 'Failed to check uptime',
          timestamp: new Date().toISOString(),
        });
      }
    }

    // Calculate summary statistics
    const totalUrls = results.length;
    const onlineUrls = results.filter(r => r.isOnline).length;
    const offlineUrls = results.filter(r => !r.isOnline).length;
    const avgResponseTime = results.reduce((sum, r) => sum + (r.responseTime || 0), 0) / totalUrls;

    return res.status(200).json({
      success: true,
      results: results,
      count: results.length,
      summary: {
        total: totalUrls,
        online: onlineUrls,
        offline: offlineUrls,
        avgResponseTime: Math.round(avgResponseTime),
      },
      message: `Uptime check completed for ${results.length} URL(s)`,
    });

  } catch (error) {
    console.error('Uptime check error:', error);
    return res.status(500).json({
      error: 'Uptime check failed',
      message: error.message || 'Failed to check uptime. Please try again.',
      ...(process.env.NODE_ENV === 'development' && { details: error.stack })
    });
  }
}

