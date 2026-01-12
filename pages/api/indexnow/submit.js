/**
 * IndexNow API Route
 * 
 * POST /api/indexnow/submit
 * 
 * Submit URLs to IndexNow for instant search engine indexing
 * 
 * Body: {
 *   urls: string[] - Array of URLs to submit (relative paths or full URLs)
 *   paths?: string[] - Alternative: array of relative paths (will be converted to URLs)
 * }
 */

import { submitToIndexNow, getIndexNowConfig, pathsToUrls } from '@/lib/indexnow';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed. Use POST.' 
    });
  }

  // Get IndexNow configuration
  const config = getIndexNowConfig();
  
  if (!config) {
    return res.status(500).json({ 
      error: 'IndexNow not configured. Set NEXT_PUBLIC_HOST and INDEXNOW_KEY environment variables.' 
    });
  }

  try {
    const { urls, paths } = req.body;

    // Validate input
    if (!urls && !paths) {
      return res.status(400).json({ 
        error: 'Missing required field: urls or paths' 
      });
    }

    // Convert paths to URLs if provided
    let urlsToSubmit = urls || [];
    
    if (paths && paths.length > 0) {
      const baseUrl = process.env.NEXT_PUBLIC_HOST?.startsWith('http')
        ? process.env.NEXT_PUBLIC_HOST
        : `https://${config.host}`;
      const pathUrls = pathsToUrls(paths, baseUrl);
      urlsToSubmit = [...urlsToSubmit, ...pathUrls];
    }

    // Remove duplicates
    urlsToSubmit = [...new Set(urlsToSubmit)];

    if (urlsToSubmit.length === 0) {
      return res.status(400).json({ 
        error: 'No valid URLs to submit' 
      });
    }

    // Submit to IndexNow
    const result = await submitToIndexNow(
      urlsToSubmit,
      config.host,
      config.key,
      config.keyLocation
    );

    if (result.success) {
      return res.status(200).json({
        success: true,
        submitted: result.submitted,
        total: result.total || urlsToSubmit.length,
        skipped: result.skipped || 0,
        message: `Successfully submitted ${result.submitted} URL(s) to IndexNow`,
      });
    } else {
      return res.status(500).json({
        success: false,
        error: result.error || 'Unknown error',
      });
    }
  } catch (error) {
    console.error('[IndexNow API] Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
    });
  }
}

