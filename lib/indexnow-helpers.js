/**
 * IndexNow Helper Functions
 * 
 * Convenience functions for common IndexNow use cases
 */

import { submitToIndexNow, getIndexNowConfig, pathsToUrls } from './indexnow';

/**
 * Submit a single page URL to IndexNow
 * 
 * @param {string} urlOrPath - Full URL or relative path (e.g., '/tools/json' or 'https://fixtools.io/tools/json')
 * @returns {Promise<boolean>} Success status
 */
export async function submitPageToIndexNow(urlOrPath) {
  const config = getIndexNowConfig();
  
  if (!config) {
    console.warn('[IndexNow] Not configured, skipping submission');
    return false;
  }

  // Convert path to URL if needed
  let url = urlOrPath;
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    const baseUrl = process.env.NEXT_PUBLIC_HOST?.startsWith('http')
      ? process.env.NEXT_PUBLIC_HOST
      : `https://${config.host}`;
    url = `${baseUrl}${url.startsWith('/') ? url : `/${url}`}`;
  }

  const result = await submitToIndexNow([url], config.host, config.key, config.keyLocation);
  
  if (result.success) {
    console.log(`[IndexNow] Submitted: ${url}`);
  } else {
    console.error(`[IndexNow] Failed to submit ${url}:`, result.error);
  }
  
  return result.success;
}

/**
 * Submit multiple pages to IndexNow
 * 
 * @param {string[]} urlsOrPaths - Array of URLs or paths
 * @returns {Promise<{success: boolean, submitted: number}>}
 */
export async function submitPagesToIndexNow(urlsOrPaths) {
  const config = getIndexNowConfig();
  
  if (!config) {
    console.warn('[IndexNow] Not configured, skipping submission');
    return { success: false, submitted: 0 };
  }

  const baseUrl = process.env.NEXT_PUBLIC_HOST?.startsWith('http')
    ? process.env.NEXT_PUBLIC_HOST
    : `https://${config.host}`;

  // Convert paths to URLs
  const urls = urlsOrPaths.map(item => {
    if (item.startsWith('http://') || item.startsWith('https://')) {
      return item;
    }
    return `${baseUrl}${item.startsWith('/') ? item : `/${item}`}`;
  });

  const result = await submitToIndexNow(urls, config.host, config.key, config.keyLocation);
  
  if (result.success) {
    console.log(`[IndexNow] Submitted ${result.submitted} URL(s)`);
  } else {
    console.error(`[IndexNow] Failed:`, result.error);
  }
  
  return result;
}

/**
 * Submit a page after update (for use in getStaticProps or API routes)
 * 
 * Example usage in getStaticProps:
 * 
 * export async function getStaticProps() {
 *   // ... generate page data ...
 *   
 *   // Submit to IndexNow after page generation
 *   if (process.env.NODE_ENV === 'production') {
 *     await submitPageUpdateToIndexNow('/tools/json-formatter');
 *   }
 *   
 *   return { props: { ... } };
 * }
 * 
 * @param {string} path - Relative path (e.g., '/tools/json-formatter')
 * @returns {Promise<void>}
 */
export async function submitPageUpdateToIndexNow(path) {
  // Only submit in production
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[IndexNow] Skipping submission in ${process.env.NODE_ENV} mode: ${path}`);
    return;
  }

  await submitPageToIndexNow(path);
}

/**
 * Client-side helper (for use in browser)
 * Calls the API route to submit URLs
 * 
 * @param {string[]} paths - Array of relative paths
 * @returns {Promise<{success: boolean, submitted: number}>}
 */
export async function submitToIndexNowViaAPI(paths) {
  try {
    const response = await fetch('/api/indexnow/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ paths }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('[IndexNow] API call failed:', error);
    return { success: false, submitted: 0, error: error.message };
  }
}

