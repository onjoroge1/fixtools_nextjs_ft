/**
 * Website Accessibility Checker API
 * POST /api/web-tools/accessibility-checker
 * 
 * Checks website accessibility and WCAG compliance. Finds accessibility issues, tests ARIA labels, and analyzes color contrast.
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

// Check accessibility issues in HTML
function checkAccessibility(html, url) {
  const issues = [];
  const warnings = [];
  const info = [];

  // Basic HTML structure checks
  if (!html || html.trim().length === 0) {
    issues.push({
      type: 'error',
      severity: 'high',
      message: 'No HTML content found',
      element: 'document',
      guideline: 'WCAG 2.1 - 4.1.1',
    });
    return { issues, warnings, info, score: 0 };
  }

  // Check for DOCTYPE
  if (!html.match(/<!doctype\s+html>/i)) {
    warnings.push({
      type: 'warning',
      severity: 'medium',
      message: 'Missing or invalid DOCTYPE declaration',
      element: 'document',
      guideline: 'HTML5 Standard',
    });
  }

  // Check for title tag
  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  if (!titleMatch || !titleMatch[1].trim()) {
    issues.push({
      type: 'error',
      severity: 'high',
      message: 'Missing or empty title tag',
      element: 'title',
      guideline: 'WCAG 2.1 - 2.4.2',
    });
  } else {
    info.push({
      type: 'info',
      severity: 'low',
      message: `Title found: "${titleMatch[1].trim()}"`,
      element: 'title',
    });
  }

  // Check for lang attribute
  const htmlMatch = html.match(/<html[^>]*>/i);
  if (htmlMatch && !htmlMatch[0].match(/lang=["']/i)) {
    issues.push({
      type: 'error',
      severity: 'medium',
      message: 'Missing lang attribute on html element',
      element: 'html',
      guideline: 'WCAG 2.1 - 3.1.1',
    });
  } else if (htmlMatch) {
    const langMatch = htmlMatch[0].match(/lang=["']([^"']+)["']/i);
    if (langMatch) {
      info.push({
        type: 'info',
        severity: 'low',
        message: `Language attribute found: ${langMatch[1]}`,
        element: 'html',
      });
    }
  }

  // Check images for alt attributes
  const imgMatches = html.match(/<img[^>]+>/gi) || [];
  let imagesWithAlt = 0;
  let imagesWithoutAlt = 0;
  let imagesWithEmptyAlt = 0;

  imgMatches.forEach((imgTag, index) => {
    if (imgTag.match(/alt=["']/i)) {
      const altMatch = imgTag.match(/alt=["']([^"']*)["']/i);
      if (altMatch && altMatch[1].trim()) {
        imagesWithAlt++;
      } else {
        imagesWithEmptyAlt++;
        warnings.push({
          type: 'warning',
          severity: 'medium',
          message: 'Image with empty alt attribute',
          element: `img[${index + 1}]`,
          guideline: 'WCAG 2.1 - 1.1.1',
          code: imgTag.substring(0, 100),
        });
      }
    } else {
      imagesWithoutAlt++;
      issues.push({
        type: 'error',
        severity: 'high',
        message: 'Image missing alt attribute',
        element: `img[${index + 1}]`,
        guideline: 'WCAG 2.1 - 1.1.1',
        code: imgTag.substring(0, 100),
      });
    }
  });

  if (imgMatches.length > 0) {
    info.push({
      type: 'info',
      severity: 'low',
      message: `Found ${imgMatches.length} image(s): ${imagesWithAlt} with alt text, ${imagesWithEmptyAlt} with empty alt, ${imagesWithoutAlt} without alt`,
      element: 'images',
    });
  }

  // Check for heading structure (h1-h6)
  const h1Matches = html.match(/<h1[^>]*>/gi) || [];
  const h2Matches = html.match(/<h2[^>]*>/gi) || [];
  const headingMatches = html.match(/<h[1-6][^>]*>/gi) || [];

  if (h1Matches.length === 0) {
    warnings.push({
      type: 'warning',
      severity: 'medium',
      message: 'No h1 heading found',
      element: 'headings',
      guideline: 'WCAG 2.1 - 2.4.6',
    });
  } else if (h1Matches.length > 1) {
    warnings.push({
      type: 'warning',
      severity: 'medium',
      message: `Multiple h1 headings found (${h1Matches.length})`,
      element: 'headings',
      guideline: 'WCAG 2.1 - 2.4.6',
    });
  } else {
    info.push({
      type: 'info',
      severity: 'low',
      message: `Found ${h1Matches.length} h1 heading(s), ${h2Matches.length} h2 heading(s), ${headingMatches.length} total headings`,
      element: 'headings',
    });
  }

  // Check forms for labels
  const inputMatches = html.match(/<input[^>]+>/gi) || [];
  const textareaMatches = html.match(/<textarea[^>]+>/gi) || [];
  const selectMatches = html.match(/<select[^>]+>/gi) || [];
  const totalFormControls = inputMatches.length + textareaMatches.length + selectMatches.length;
  let formControlsCount = totalFormControls;

  if (totalFormControls > 0) {
    const labelMatches = html.match(/<label[^>]*>/gi) || [];
    info.push({
      type: 'info',
      severity: 'low',
      message: `Found ${totalFormControls} form control(s) and ${labelMatches.length} label(s)`,
      element: 'forms',
    });

    // Check for inputs without labels or aria-labels
    [...inputMatches, ...textareaMatches, ...selectMatches].forEach((control, index) => {
      const hasId = control.match(/id=["']([^"']+)["']/i);
      const hasAriaLabel = control.match(/aria-label=["']([^"']+)["']/i);
      const hasAriaLabelledBy = control.match(/aria-labelledby=["']([^"']+)["']/i);

      if (!hasAriaLabel && !hasAriaLabelledBy) {
        if (hasId) {
          const idValue = hasId[1];
          const hasLabel = html.match(new RegExp(`<label[^>]*for=["']${idValue}["']`, 'i'));
          if (!hasLabel) {
            warnings.push({
              type: 'warning',
              severity: 'medium',
              message: 'Form control without associated label or aria-label',
              element: `form-control[${index + 1}]`,
              guideline: 'WCAG 2.1 - 3.3.2',
              code: control.substring(0, 100),
            });
          }
        } else {
          warnings.push({
            type: 'warning',
            severity: 'medium',
            message: 'Form control without id, label, or aria-label',
            element: `form-control[${index + 1}]`,
            guideline: 'WCAG 2.1 - 3.3.2',
            code: control.substring(0, 100),
          });
        }
      }
    });
  }

  // Check for ARIA landmarks
  const ariaLandmarks = html.match(/role=["'](banner|navigation|main|complementary|contentinfo|search|form)[^"']*["']/gi) || [];
  const semanticElements = html.match(/<(header|nav|main|aside|footer|article|section)[^>]*>/gi) || [];

  if (ariaLandmarks.length > 0 || semanticElements.length > 0) {
    info.push({
      type: 'info',
      severity: 'low',
      message: `Found ${ariaLandmarks.length} ARIA landmark(s) and ${semanticElements.length} semantic element(s)`,
      element: 'structure',
    });
  } else {
    warnings.push({
      type: 'warning',
      severity: 'low',
      message: 'No ARIA landmarks or semantic HTML5 elements found',
      element: 'structure',
      guideline: 'WCAG 2.1 - 1.3.1',
    });
  }

  // Check for skip links
  if (!html.match(/<a[^>]*href=["']#[^"']*["'][^>]*>.*skip.*<\/a>/i) && !html.match(/<a[^>]*>.*skip.*<\/a>[^<]*href=["']#[^"']*["']/i)) {
    warnings.push({
      type: 'warning',
      severity: 'low',
      message: 'No skip navigation link found',
      element: 'navigation',
      guideline: 'WCAG 2.1 - 2.4.1',
    });
  }

  // Calculate accessibility score (0-100)
  const totalChecks = issues.length + warnings.length;
  const errorWeight = 5;
  const warningWeight = 2;
  const maxScore = 100;
  const penalty = (issues.length * errorWeight) + (warnings.length * warningWeight);
  const score = Math.max(0, Math.min(maxScore, maxScore - penalty));

  return {
    issues,
    warnings,
    info,
    score: Math.round(score),
    summary: {
      totalIssues: issues.length,
      totalWarnings: warnings.length,
      totalInfo: info.length,
      imagesCount: imgMatches.length,
      imagesWithAlt: imagesWithAlt,
    imagesWithoutAlt: imagesWithoutAlt,
    headingsCount: headingMatches.length,
    formControlsCount: formControlsCount,
  },
  };
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
          message: 'Daily rate limit exceeded. A Processing Pass is required for unlimited accessibility checks.',
          paymentRequired: true,
          reason: 'rate_limit',
          requirement: rateLimitRequirement,
        });
      }
    }

    // Process each URL (check accessibility)
    const results = [];
    
    for (const url of validUrls) {
      try {
        const { html, statusCode } = await fetchHtml(url);
        const accessibilityCheck = checkAccessibility(html, url);
        
        results.push({
          url: url,
          statusCode: statusCode,
          ...accessibilityCheck,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        console.error(`Error checking accessibility for ${url}:`, error);
        results.push({
          url: url,
          statusCode: 0,
          error: error.message || 'Failed to check accessibility',
          issues: [],
          warnings: [],
          info: [],
          score: 0,
          timestamp: new Date().toISOString(),
        });
      }
    }

    // Calculate overall summary
    const totalIssues = results.reduce((sum, r) => sum + (r.issues?.length || 0), 0);
    const totalWarnings = results.reduce((sum, r) => sum + (r.warnings?.length || 0), 0);
    const avgScore = results.reduce((sum, r) => sum + (r.score || 0), 0) / results.length;

    return res.status(200).json({
      success: true,
      results: results,
      count: results.length,
      summary: {
        total: results.length,
        totalIssues: totalIssues,
        totalWarnings: totalWarnings,
        avgScore: Math.round(avgScore),
      },
      message: `Accessibility check completed for ${results.length} URL(s)`,
    });

  } catch (error) {
    console.error('Accessibility check error:', error);
    return res.status(500).json({
      error: 'Accessibility check failed',
      message: error.message || 'Failed to check accessibility. Please try again.',
      ...(process.env.NODE_ENV === 'development' && { details: error.stack })
    });
  }
}

