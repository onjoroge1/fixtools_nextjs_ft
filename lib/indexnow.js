/**
 * IndexNow Utility - Submit URLs to search engines for instant indexing
 * 
 * IndexNow is supported by Bing, Yandex, and other search engines.
 * It allows instant notification when pages are created or updated.
 * 
 * @see https://www.indexnow.org/
 */

const INDEXNOW_API_URL = 'https://api.indexnow.org/indexnow';
const MAX_URLS_PER_REQUEST = 10000; // IndexNow limit

/**
 * Submit URLs to IndexNow API
 * 
 * @param {string[]} urls - Array of full URLs to submit (must include https://)
 * @param {string} host - Domain host (e.g., 'fixtools.io')
 * @param {string} key - IndexNow key
 * @param {string} keyLocation - Full URL to key file
 * @returns {Promise<{success: boolean, submitted: number, error?: string}>}
 */
export async function submitToIndexNow(urls, host, key, keyLocation) {
  if (!urls || urls.length === 0) {
    return { success: false, submitted: 0, error: 'No URLs provided' };
  }

  if (!host || !key || !keyLocation) {
    return { 
      success: false, 
      submitted: 0, 
      error: 'Missing required parameters: host, key, or keyLocation' 
    };
  }

  // Validate URLs are absolute
  const validUrls = urls.filter(url => {
    return url && (url.startsWith('http://') || url.startsWith('https://'));
  });

  if (validUrls.length === 0) {
    return { success: false, submitted: 0, error: 'No valid URLs provided' };
  }

  // Limit to IndexNow's maximum
  const urlsToSubmit = validUrls.slice(0, MAX_URLS_PER_REQUEST);

  const payload = {
    host: host,
    key: key,
    keyLocation: keyLocation,
    urlList: urlsToSubmit,
  };

  try {
    const response = await fetch(INDEXNOW_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    // IndexNow returns 200 for success, 202 for accepted
    if (response.ok || response.status === 202) {
      console.log(`[IndexNow] Successfully submitted ${urlsToSubmit.length} URLs`);
      return { 
        success: true, 
        submitted: urlsToSubmit.length,
        total: validUrls.length,
        skipped: validUrls.length - urlsToSubmit.length,
      };
    } else {
      const errorText = await response.text();
      console.error(`[IndexNow] Error: ${response.status} - ${errorText}`);
      return { 
        success: false, 
        submitted: 0, 
        error: `HTTP ${response.status}: ${errorText}` 
      };
    }
  } catch (error) {
    console.error('[IndexNow] Network error:', error);
    return { 
      success: false, 
      submitted: 0, 
      error: error.message || 'Network error' 
    };
  }
}

/**
 * Submit URLs in batches (for large URL lists)
 * 
 * @param {string[]} urls - Array of URLs to submit
 * @param {string} host - Domain host
 * @param {string} key - IndexNow key
 * @param {string} keyLocation - Full URL to key file
 * @param {number} batchSize - Number of URLs per batch (default: 1000)
 * @returns {Promise<{success: boolean, totalSubmitted: number, batches: number, errors: string[]}>}
 */
export async function submitToIndexNowBatched(urls, host, key, keyLocation, batchSize = 1000) {
  const batches = [];
  const errors = [];
  let totalSubmitted = 0;

  // Split URLs into batches
  for (let i = 0; i < urls.length; i += batchSize) {
    batches.push(urls.slice(i, i + batchSize));
  }

  console.log(`[IndexNow] Submitting ${urls.length} URLs in ${batches.length} batches`);

  // Submit each batch
  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    console.log(`[IndexNow] Submitting batch ${i + 1}/${batches.length} (${batch.length} URLs)`);
    
    const result = await submitToIndexNow(batch, host, key, keyLocation);
    
    if (result.success) {
      totalSubmitted += result.submitted;
    } else {
      errors.push(`Batch ${i + 1}: ${result.error}`);
    }

    // Small delay between batches to avoid rate limiting
    if (i < batches.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  return {
    success: errors.length === 0,
    totalSubmitted,
    batches: batches.length,
    errors,
  };
}

/**
 * Helper to convert relative paths to absolute URLs
 * 
 * @param {string[]} paths - Array of relative paths (e.g., ['/tools/json', '/about'])
 * @param {string} baseUrl - Base URL (e.g., 'https://fixtools.io')
 * @returns {string[]} Array of absolute URLs
 */
export function pathsToUrls(paths, baseUrl) {
  const cleanBaseUrl = baseUrl.replace(/\/+$/, '');
  return paths.map(path => {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${cleanBaseUrl}${cleanPath}`;
  });
}

/**
 * Get IndexNow configuration from environment variables
 * 
 * @returns {{host: string, key: string, keyLocation: string} | null}
 */
export function getIndexNowConfig() {
  const host = process.env.NEXT_PUBLIC_HOST?.replace(/^https?:\/\//, '').replace(/\/+$/, '');
  const key = process.env.INDEXNOW_KEY;
  const keyFileName = process.env.INDEXNOW_KEY_FILE || 'fixtools-indexnow-f5cd607761931bc5e0f10b4f1e6fb71752740f1731bbd342c2c6c3263d3c8400.txt';
  
  if (!host || !key) {
    console.warn('[IndexNow] Missing configuration. Set NEXT_PUBLIC_HOST and INDEXNOW_KEY');
    return null;
  }

  const baseUrl = process.env.NEXT_PUBLIC_HOST?.startsWith('http') 
    ? process.env.NEXT_PUBLIC_HOST 
    : `https://${host}`;
  
  const keyLocation = `${baseUrl}/${keyFileName}`;

  return { host, key, keyLocation };
}

