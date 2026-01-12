/**
 * Website Screenshot API Route
 * Takes screenshots of websites using Playwright
 * 
 * POST /api/web-tools/website-screenshot
 * Body: { url: string, format: 'png' | 'pdf', options?: { width?: number, height?: number, fullPage?: boolean }, urls?: string[] }
 * Returns: { success: true, data: base64, format: string, filename: string, size?: number }
 */

// NOTE: This requires Playwright to be installed:
// npm install playwright
// npx playwright install chromium

import { checkPaymentRequirement } from '../../../lib/config/pricing';
import { verifyProcessingPass } from '../../../lib/payments/payment-utils';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
    responseLimit: '10mb',
  },
};

async function getUserPlanFromSession(sessionId) {
  if (sessionId) {
    try {
      const hasValidPass = await verifyProcessingPass(sessionId);
      if (hasValidPass) {
        return 'day_pass';
      }
    } catch (e) {
      // Invalid session
    }
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
    const { url, format = 'png', options = {}, urls = [] } = req.body;

    // Validate URL
    if (!url || typeof url !== 'string') {
      return res.status(400).json({
        error: 'Invalid URL',
        message: 'Please provide a valid URL'
      });
    }

    // Validate URL format
    let parsedUrl;
    try {
      parsedUrl = new URL(url);
      if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        throw new Error('Invalid protocol');
      }
    } catch (e) {
      return res.status(400).json({
        error: 'Invalid URL',
        message: 'Please provide a valid HTTP or HTTPS URL'
      });
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
      return res.status(400).json({
        error: 'Invalid URL',
        message: 'Private and localhost URLs are not allowed'
      });
    }

    // Validate format
    if (!['png', 'pdf'].includes(format)) {
      return res.status(400).json({
        error: 'Invalid format',
        message: 'Format must be "png" or "pdf"'
      });
    }

    // Extract options
    const {
      width = 1920,
      height = 1080,
      fullPage = false,
      waitTime = 0,
    } = options;

    // Validate dimensions
    if (width < 320 || width > 3840 || height < 240 || height > 2160) {
      return res.status(400).json({
        error: 'Invalid dimensions',
        message: 'Width must be between 320-3840px and height between 240-2160px'
      });
    }

    // Check for batch processing (multiple URLs)
    const urlCount = urls.length > 0 ? urls.length : 1;
    const sessionId = req.body.sessionId;
    const userPlan = await getUserPlanFromSession(sessionId);
    
    // Check payment requirement for batch
    if (urlCount > 1) {
      const batchRequirement = checkPaymentRequirement('web-tools', 0, urlCount, userPlan);
      if (batchRequirement.requiresPayment && batchRequirement.reason === 'batch') {
        const hasValidPass = await verifyProcessingPass(sessionId);
        if (!hasValidPass) {
          return res.status(402).json({
            error: 'Payment required',
            message: `Batch processing (${urlCount} URLs) requires a Processing Pass. Free tier allows 1 URL at a time.`,
            paymentRequired: true,
            reason: 'batch',
            urlCount: urlCount,
            requirement: batchRequirement,
          });
        }
      }
    }

    // Playwright implementation
    let playwright;
    try {
      playwright = require('playwright');
    } catch (e) {
      return res.status(501).json({
        error: 'Playwright not installed',
        message: 'Playwright needs to be installed. Run: npm install playwright && npx playwright install',
        instructions: 'Install Playwright: npm install playwright && npx playwright install'
      });
    }
    
    const { chromium } = playwright;
    let browser;
    
    try {
      browser = await chromium.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      
      // Set viewport - for fullPage, we still set a viewport but Playwright will capture beyond it
      const page = await browser.newPage({
        viewport: { width, height: fullPage ? 1080 : height } // Set a reasonable height for fullPage
      });
      
      // Navigate to URL with timeout
      await page.goto(url, {
        waitUntil: 'networkidle',
        timeout: 30000
      });
      
      // Wait if specified
      if (waitTime > 0) {
        await page.waitForTimeout(waitTime);
      }
      
      // For full page screenshots, wait for all content to load
      if (fullPage) {
        // Wait for images and other resources to load
        await page.evaluate(() => {
          return Promise.all([
            // Wait for all images to load
            ...Array.from(document.images).map(img => {
              if (img.complete) return Promise.resolve();
              return new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = resolve; // Continue even if image fails
                setTimeout(resolve, 5000); // Timeout after 5s
              });
            }),
            // Wait for fonts to load
            document.fonts.ready
          ]);
        });
        
        // Scroll to bottom to trigger lazy-loaded content
        await page.evaluate(async () => {
          await new Promise((resolve) => {
            let totalHeight = 0;
            const distance = 100;
            const timer = setInterval(() => {
              const scrollHeight = document.body.scrollHeight;
              window.scrollBy(0, distance);
              totalHeight += distance;
              
              if (totalHeight >= scrollHeight) {
                clearInterval(timer);
                window.scrollTo(0, 0); // Scroll back to top
                resolve();
              }
            }, 100);
          });
        });
        
        // Wait a bit more for any animations or lazy-loaded content
        await page.waitForTimeout(1000);
      }
      
      let screenshot;
      let filename;
      let mimeType;
      
      if (format === 'pdf') {
        // For PDF, use fullPage option to capture entire page
        if (fullPage) {
          screenshot = await page.pdf({
            printBackground: true,
            width: `${width}px`,
            // Don't set height - let it be determined by content
            preferCSSPageSize: false,
          });
        } else {
          screenshot = await page.pdf({
            format: 'A4',
            printBackground: true,
            width: `${width}px`,
            height: `${height}px`
          });
        }
        filename = `screenshot-${Date.now()}.pdf`;
        mimeType = 'application/pdf';
      } else {
        // For PNG, use fullPage option to capture entire page
        screenshot = await page.screenshot({
          type: 'png',
          fullPage: fullPage,
        });
        filename = `screenshot-${Date.now()}.png`;
        mimeType = 'image/png';
      }
      
      await browser.close();
      
      // Calculate file size
      const fileSizeBytes = screenshot.length;
      
      // Check output file size (> 10MB requires payment)
      const outputRequirement = checkPaymentRequirement('web-tools', fileSizeBytes, 1, userPlan);
      
      if (outputRequirement.requiresPayment && outputRequirement.reason === 'file_size') {
        const hasValidPass = await verifyProcessingPass(sessionId);
        if (!hasValidPass) {
          // Still return the screenshot data, but mark it as requiring payment
          const base64 = screenshot.toString('base64');
          return res.status(402).json({
            error: 'Payment required',
            message: `Screenshot size (${(fileSizeBytes / 1024 / 1024).toFixed(2)}MB) exceeds free limit (${(outputRequirement.maxFreeSize / 1024 / 1024).toFixed(0)}MB). A Processing Pass is required.`,
            paymentRequired: true,
            reason: 'file_size',
            fileSize: fileSizeBytes,
            requirement: outputRequirement,
            // Include screenshot data so frontend can show preview
            data: base64,
            format: format,
            filename: filename,
            mimeType: mimeType,
          });
        }
      }
      
      // Convert to base64
      const base64 = screenshot.toString('base64');
      
      return res.status(200).json({
        success: true,
        data: base64,
        format: format,
        filename: filename,
        mimeType: mimeType,
        size: fileSizeBytes,
        message: 'Screenshot captured successfully'
      });
      
    } catch (launchError) {
      if (browser) {
        await browser.close();
      }
      // Check if it's a browser not installed error
      if (launchError.message && (launchError.message.includes('Executable doesn\'t exist') || launchError.message.includes('browserType.launch'))) {
        return res.status(501).json({
          error: 'Playwright browsers not installed',
          message: 'Playwright browsers need to be installed. Run: npx playwright install',
          instructions: 'Run: npx playwright install (or npx playwright install chromium for just Chromium)'
        });
      }
      // Other browser launch errors
      throw launchError;
    }

  } catch (error) {
    console.error('Screenshot error:', error);
    
    // Check if it's a browser executable error (in case it wasn't caught above)
    if (error.message && (error.message.includes('Executable doesn\'t exist') || error.message.includes('browserType.launch'))) {
      return res.status(501).json({
        error: 'Playwright browsers not installed',
        message: 'Playwright browsers need to be installed. Run: npx playwright install',
        instructions: 'Run: npx playwright install (or npx playwright install chromium for just Chromium)'
      });
    }
    
    return res.status(500).json({
      error: 'Screenshot failed',
      message: error.message || 'Failed to capture screenshot. Please try again.',
      ...(process.env.NODE_ENV === 'development' && { details: error.stack })
    });
  }
}

