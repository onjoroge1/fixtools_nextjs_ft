/**
 * Google Analytics 4 Configuration
 * Tracks page views, events, and conversions
 */

// Google Analytics Measurement ID
// Get yours from: https://analytics.google.com/
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || '';

// Check if GA is enabled
export const isGAEnabled = () => {
  return typeof window !== 'undefined' && GA_MEASUREMENT_ID && window.gtag;
};

// Page view tracking
export const pageview = (url) => {
  if (!isGAEnabled()) return;

  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
  });
};

// Event tracking
export const event = ({ action, category, label, value }) => {
  if (!isGAEnabled()) return;

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

// Tool usage tracking
export const trackToolUsage = (toolName, toolCategory) => {
  event({
    action: 'tool_used',
    category: toolCategory,
    label: toolName,
  });
};

// Copy action tracking
export const trackCopy = (toolName, contentType) => {
  event({
    action: 'copy_result',
    category: 'engagement',
    label: `${toolName} - ${contentType}`,
  });
};

// Search tracking
export const trackSearch = (searchTerm, resultCount) => {
  event({
    action: 'search',
    category: 'engagement',
    label: searchTerm,
    value: resultCount,
  });
};

// Download tracking
export const trackDownload = (toolName, fileType) => {
  event({
    action: 'download',
    category: 'conversion',
    label: `${toolName} - ${fileType}`,
  });
};

// Error tracking
export const trackError = (errorMessage, errorLocation) => {
  event({
    action: 'error',
    category: 'technical',
    label: `${errorLocation}: ${errorMessage}`,
  });
};

// Time on tool tracking
export const trackTimeOnTool = (toolName, seconds) => {
  event({
    action: 'time_on_tool',
    category: 'engagement',
    label: toolName,
    value: Math.round(seconds),
  });
};


