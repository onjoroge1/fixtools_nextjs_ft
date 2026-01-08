/**
 * Stripe Configuration
 * Handles Stripe payment processing for premium features
 */

// Stripe keys (use environment variables in production)
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

// Product IDs from Stripe Dashboard
export const PRODUCTS = {
  PROCESSING_PASS: process.env.STRIPE_PROCESSING_PASS_PRICE_ID || 'price_processing_pass',
  SINGLE_LARGE_FILE: process.env.STRIPE_SINGLE_FILE_PRICE_ID || 'price_single_file',
};

// Pricing
export const PRICING = {
  PROCESSING_PASS: 2.99, // $2.99 for 24-hour pass
  SINGLE_LARGE_FILE: 1.99, // $1.99 for single large file
};

// Thresholds
export const THRESHOLDS = {
  MAX_FREE_FILE_SIZE: 100 * 1024 * 1024, // 100MB
  MAX_PAID_FILE_SIZE: 200 * 1024 * 1024, // 200MB (reduced from 500MB for better conversion rates and cost management)
  MAX_FREE_BATCH_FILES: 1, // 1 file for free
};

// Pass duration (24 hours in milliseconds)
export const PASS_DURATION = 24 * 60 * 60 * 1000;

/**
 * Check if file requires payment
 * @param {number} fileSize - File size in bytes
 * @param {number} fileCount - Number of files (for batch)
 * @returns {Object} - Payment requirement info
 */
export function checkPaymentRequirement(fileSize, fileCount = 1) {
  const requiresPayment = 
    fileSize > THRESHOLDS.MAX_FREE_FILE_SIZE ||
    fileCount > THRESHOLDS.MAX_FREE_BATCH_FILES;

  const reason = 
    fileSize > THRESHOLDS.MAX_FREE_FILE_SIZE ? 'file_size' :
    fileCount > THRESHOLDS.MAX_FREE_BATCH_FILES ? 'batch' :
    null;

  return {
    requiresPayment,
    reason,
    fileSize,
    fileCount,
    maxFreeSize: THRESHOLDS.MAX_FREE_FILE_SIZE,
    maxFreeBatch: THRESHOLDS.MAX_FREE_BATCH_FILES,
  };
}

/**
 * Get Stripe configuration
 */
export function getStripeConfig() {
  if (!STRIPE_SECRET_KEY || !STRIPE_PUBLISHABLE_KEY) {
    console.warn('Stripe keys not configured. Payment features will be disabled.');
    return null;
  }

  return {
    secretKey: STRIPE_SECRET_KEY,
    publishableKey: STRIPE_PUBLISHABLE_KEY,
  };
}

