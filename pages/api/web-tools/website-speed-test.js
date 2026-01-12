/**
 * Website Speed Test API
 * POST /api/web-tools/website-speed-test
 * 
 * Tests website performance using Google PageSpeed Insights API
 * Requires payment for batch processing (multiple URLs) or exceeding rate limits
 */

import { checkPaymentRequirement } from '../../../lib/config/pricing';
import { verifyProcessingPass } from '../../../lib/payments/payment-utils';

// Get user plan from session
async function getUserPlanFromSession(sessionId) {
  if (!sessionId) return 'free';
  
  try {
    const hasValidPass = await verifyProcessingPass(sessionId);
    if (hasValidPass) {
      return 'day_pass'; // Processing pass grants day_pass benefits
    }
  } catch (e) {
    // Invalid session
  }
  return 'free';
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      message: 'Only POST requests are supported' 
    });
  }

  try {
    const { url, urls = [], strategy = 'mobile', sessionId } = req.body;

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
      if (!testUrl || typeof testUrl !== 'string') continue;
      
      try {
        const parsedUrl = new URL(testUrl);
        if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
          continue;
        }
        
        // Block private/localhost URLs for security
        const hostname = parsedUrl.hostname;
        if (
          hostname === 'localhost' ||
          hostname === '127.0.0.1' ||
          hostname === '0.0.0.0' ||
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
          continue;
        }
        
        validUrls.push(testUrl);
      } catch (e) {
        continue;
      }
    }

    if (validUrls.length === 0) {
      return res.status(400).json({
        error: 'Invalid URL',
        message: 'Please provide at least one valid HTTP or HTTPS URL'
      });
    }

    // Validate strategy
    if (!['mobile', 'desktop'].includes(strategy)) {
      return res.status(400).json({
        error: 'Invalid strategy',
        message: 'Strategy must be "mobile" or "desktop"'
      });
    }

    // Check for batch processing (multiple URLs)
    const urlCount = validUrls.length;
    const userPlan = await getUserPlanFromSession(sessionId);
    
    // Check payment requirement for batch
    // Strategy: Allow 2-3 URLs for free (limited results), require payment for 4+
    let isLimitedResults = false;
    
    if (urlCount > 1) {
      // For 2-3 URLs: Allow free users but mark as limited
      if (urlCount <= 3 && userPlan === 'free') {
        isLimitedResults = true;
        // Process but will return limited results
      } 
      // For 4+ URLs: Require payment before processing
      else if (urlCount > 3) {
        const batchRequirement = checkPaymentRequirement('web-tools', 0, urlCount, userPlan);
        if (batchRequirement.requiresPayment && batchRequirement.reason === 'batch') {
          const hasValidPass = await verifyProcessingPass(sessionId);
          if (!hasValidPass) {
            return res.status(402).json({
              error: 'Payment required',
              message: `Batch processing (${urlCount} URLs) requires a Processing Pass. Free tier allows up to 3 URLs with limited results.`,
              paymentRequired: true,
              reason: 'batch',
              urlCount: urlCount,
              requirement: batchRequirement,
            });
          }
        }
      }
    }

    // Check rate limits (free tier: 5 tests per day)
    // Note: This is a simplified check. In production, you'd track per IP/user
    const rateLimitRequirement = checkPaymentRequirement('web-tools', 0, 1, userPlan);
    if (rateLimitRequirement.requiresPayment && rateLimitRequirement.reason === 'rate_limit') {
      const hasValidPass = await verifyProcessingPass(sessionId);
      if (!hasValidPass) {
        return res.status(402).json({
          error: 'Payment required',
          message: 'Daily rate limit exceeded. A Processing Pass is required for unlimited speed tests.',
          paymentRequired: true,
          reason: 'rate_limit',
          requirement: rateLimitRequirement,
        });
      }
    }

    // Get Google PageSpeed Insights API key
    const apiKey = process.env.GOOGLE_PAGESPEED_API_KEY;
    
    if (!apiKey) {
      // Fallback: Use public API (limited, but works)
      // Note: Public API has strict rate limits (25 requests per day per IP)
      console.warn('GOOGLE_PAGESPEED_API_KEY not set, using public API (limited to 25 requests/day per IP)');
    }

    // Process each URL
    const results = [];
    
    for (const testUrl of validUrls) {
      try {
        // Call Google PageSpeed Insights API
        // Explicitly request all categories to ensure they're included in the response
        const categoryParam = '&category=PERFORMANCE&category=ACCESSIBILITY&category=BEST_PRACTICES&category=SEO';
        const apiUrl = apiKey
          ? `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(testUrl)}&strategy=${strategy}${categoryParam}&key=${apiKey}`
          : `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(testUrl)}&strategy=${strategy}${categoryParam}`;
        
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          // Handle specific error codes
          if (response.status === 429) {
            throw new Error('Rate limit exceeded. Please try again in a few minutes. For unlimited access, consider using a Google PageSpeed Insights API key.');
          }
          if (response.status === 400) {
            throw new Error('Invalid URL or request. Please check the URL and try again.');
          }
          if (response.status === 403) {
            throw new Error('Access denied. API key may be invalid or quota exceeded.');
          }
          if (response.status === 500) {
            throw new Error('Google PageSpeed Insights service temporarily unavailable. Please try again later.');
          }
          throw new Error(`PageSpeed API error: ${response.status}. Please try again later.`);
        }

        const data = await response.json();

        // Debug: Output API response structure (truncated for readability)
        if (process.env.NODE_ENV === 'development') {
          console.log('=== API RESPONSE STRUCTURE ===');
          console.log('Top-level keys:', Object.keys(data));
          if (data.lighthouseResult?.categories) {
            console.log('Categories available:', Object.keys(data.lighthouseResult.categories));
            console.log('Categories object:', JSON.stringify(data.lighthouseResult.categories, null, 2));
          } else {
            console.log('WARNING: No categories found in response');
            console.log('Full lighthouseResult keys:', Object.keys(data.lighthouseResult || {}));
          }
          console.log('=== END API RESPONSE STRUCTURE ===');
        }

        // Extract key metrics
        const lighthouseResult = data.lighthouseResult;
        const loadingExperience = data.loadingExperience;

        if (!lighthouseResult) {
          throw new Error('Invalid response from PageSpeed API');
        }

        // Debug: Output lighthouse result structure
        if (process.env.NODE_ENV === 'development') {
          console.log('=== LIGHTHOUSE RESULT ===');
          console.log('Lighthouse keys:', Object.keys(lighthouseResult));
          console.log('Categories:', lighthouseResult.categories);
          console.log('Categories keys:', lighthouseResult.categories ? Object.keys(lighthouseResult.categories) : 'null');
          console.log('=== END LIGHTHOUSE RESULT ===');
        }

        // Core Web Vitals
        const audits = lighthouseResult.audits || {};
        const categories = lighthouseResult.categories || {};

        // Helper function to safely extract category score
        const getCategoryScore = (category) => {
          if (!category) return 0;
          const score = category.score;
          // Handle null, undefined, or NaN
          if (score === null || score === undefined || isNaN(score)) {
            return 0;
          }
          // Score is 0-1, convert to 0-100
          return Math.round(score * 100);
        };

        // Debug logging in development
        if (process.env.NODE_ENV === 'development') {
          console.log('Categories available:', Object.keys(categories));
          console.log('Performance score:', categories.performance?.score);
          console.log('Accessibility score:', categories.accessibility?.score);
          console.log('Best Practices score:', categories['best-practices']?.score);
          console.log('SEO score:', categories.seo?.score);
        }

        const result = {
          url: testUrl,
          strategy: strategy,
          performance: {
            score: getCategoryScore(categories.performance),
            metrics: {
              firstContentfulPaint: audits['first-contentful-paint']?.numericValue || 0,
              largestContentfulPaint: audits['largest-contentful-paint']?.numericValue || 0,
              totalBlockingTime: audits['total-blocking-time']?.numericValue || 0,
              cumulativeLayoutShift: audits['cumulative-layout-shift']?.numericValue || 0,
              speedIndex: audits['speed-index']?.numericValue || 0,
              timeToInteractive: audits['interactive']?.numericValue || 0,
            },
            opportunities: (audits['render-blocking-resources']?.details?.items || []).slice(0, 5).map(item => ({
              title: item.url || 'Resource',
              savings: item.wastedBytes || 0,
            })),
          },
          accessibility: {
            score: getCategoryScore(categories.accessibility),
          },
          bestPractices: {
            score: getCategoryScore(categories['best-practices']),
          },
          seo: {
            score: getCategoryScore(categories.seo),
          },
          loadingExperience: loadingExperience ? {
            metrics: {
              firstContentfulPaint: loadingExperience.metrics?.FIRST_CONTENTFUL_PAINT_MS?.percentile || 0,
              largestContentfulPaint: loadingExperience.metrics?.LARGEST_CONTENTFUL_PAINT_MS?.percentile || 0,
              cumulativeLayoutShift: loadingExperience.metrics?.CUMULATIVE_LAYOUT_SHIFT_SCORE?.percentile || 0,
            },
          } : null,
          timestamp: new Date().toISOString(),
        };

        results.push(result);
      } catch (error) {
        console.error(`Error testing ${testUrl}:`, error);
        
        // Provide more helpful error messages
        let errorMessage = error.message || 'Failed to test website speed';
        
        // Enhance rate limit error message
        if (error.message && error.message.includes('Rate limit')) {
          errorMessage = 'Rate limit exceeded. The Google PageSpeed Insights public API allows 25 requests per day per IP address. Please try again tomorrow or use an API key for unlimited access.';
        }
        
        results.push({
          url: testUrl,
          error: errorMessage,
          timestamp: new Date().toISOString(),
        });
      }
    }

    // For free users with 2-3 URLs, limit the results to performance score only
    let finalResults = results;
    if (isLimitedResults) {
      finalResults = results.map(result => {
        if (result.error) {
          return result; // Keep error results as-is
        }
        // Return limited result: only performance score, hide other metrics
        return {
          url: result.url,
          strategy: result.strategy,
          timestamp: result.timestamp,
          performance: {
            score: result.performance.score,
            // Hide detailed metrics
          },
          // Hide accessibility, bestPractices, seo, and detailed metrics
          limited: true,
        };
      });
    }

    return res.status(200).json({
      success: true,
      results: finalResults,
      count: finalResults.length,
      limited: isLimitedResults,
      message: isLimitedResults 
        ? `Speed test completed. Upgrade to see full results including Accessibility, Best Practices, SEO, and detailed metrics.`
        : `Speed test completed for ${finalResults.length} URL(s)`,
    });

  } catch (error) {
    console.error('Speed test error:', error);
    return res.status(500).json({
      error: 'Speed test failed',
      message: error.message || 'Failed to test website speed. Please try again.',
      ...(process.env.NODE_ENV === 'development' && { details: error.stack })
    });
  }
}

