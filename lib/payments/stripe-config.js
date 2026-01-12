/**
 * Stripe Configuration
 * Handles Stripe payment processing for premium features
 * 
 * Note: This file maintains backward compatibility while using the new centralized pricing config
 */

import { PRICING_CONFIG, checkPaymentRequirement as checkPaymentRequirementNew } from '../config/pricing';

// Stripe keys (use environment variables in production)
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

// Product IDs from Stripe Dashboard
export const PRODUCTS = {
  PROCESSING_PASS: process.env.STRIPE_PROCESSING_PASS_PRICE_ID || 'price_processing_pass',
  SINGLE_LARGE_FILE: process.env.STRIPE_SINGLE_FILE_PRICE_ID || 'price_single_file',
};

// Pricing (from centralized config)
export const PRICING = {
  PROCESSING_PASS: PRICING_CONFIG.plans.day_pass.price, // $3.99 for 24-hour pass
  SINGLE_LARGE_FILE: 1.99, // $1.99 for single large file (legacy)
};

// Thresholds (from centralized config - PDF tool defaults)
const PDF_LIMITS = PRICING_CONFIG.tools.pdf.free;
export const THRESHOLDS = {
  MAX_FREE_FILE_SIZE: PDF_LIMITS.max_file_size_mb * 1024 * 1024, // 10MB for PDF
  MAX_PAID_FILE_SIZE: PRICING_CONFIG.tools.pdf.paid.max_file_size_mb * 1024 * 1024, // 500MB
  MAX_FREE_BATCH_FILES: PDF_LIMITS.max_files_per_job, // 1 file for free
};

// Pass duration (24 hours in milliseconds)
export const PASS_DURATION = PRICING_CONFIG.plans.day_pass.duration_hours * 60 * 60 * 1000;

/**
 * Check if file requires payment
 * @param {number} fileSize - File size in bytes
 * @param {number} fileCount - Number of files (for batch)
 * @param {string} toolType - Tool type ('pdf', 'image', 'video') - defaults to 'pdf' for backward compatibility
 * @returns {Object} - Payment requirement info
 */
export function checkPaymentRequirement(fileSize, fileCount = 1, toolType = 'pdf') {
  // Use new centralized config
  return checkPaymentRequirementNew(toolType, fileSize, fileCount, 'free');
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

