/**
 * Payment Utilities
 * Helper functions for payment processing and session management
 */

import { PASS_DURATION } from './stripe-config';

/**
 * Check if user has valid processing pass
 * @param {Object} session - User session object
 * @returns {boolean} - True if pass is valid
 */
export function hasValidProcessingPass(session) {
  if (!session || !session.processingPass) {
    return false;
  }

  const { valid, expiresAt } = session.processingPass;
  const now = Date.now();

  return valid && expiresAt > now;
}

/**
 * Create processing pass object
 * @param {string} type - Pass type ('processing-pass' or 'single-file')
 * @returns {Object} - Processing pass object
 */
export function createProcessingPass(type = 'processing-pass') {
  const now = Date.now();
  const expiresAt = type === 'processing-pass' 
    ? now + PASS_DURATION 
    : now + (60 * 60 * 1000); // 1 hour for single file

  return {
    valid: true,
    type,
    createdAt: now,
    expiresAt,
  };
}

/**
 * Get pass expiry time (human readable)
 * @param {number} expiresAt - Expiry timestamp
 * @returns {string} - Formatted expiry time
 */
export function getPassExpiryTime(expiresAt) {
  const now = Date.now();
  const remaining = expiresAt - now;

  if (remaining <= 0) {
    return 'Expired';
  }

  const hours = Math.floor(remaining / (60 * 60 * 1000));
  const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));

  if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ${minutes} minute${minutes > 1 ? 's' : ''}`;
  }
  return `${minutes} minute${minutes > 1 ? 's' : ''}`;
}

/**
 * Format file size for display
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted size
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Get payment message based on requirement
 * @param {Object} requirement - Payment requirement object
 * @returns {Object} - Message and details
 */
export function getPaymentMessage(requirement) {
  const { reason, fileSize, fileCount, maxFreeSize } = requirement;

  if (reason === 'file_size') {
    return {
      title: 'File Size Limit',
      message: `Your file (${formatFileSize(fileSize)}) exceeds our free limit of ${formatFileSize(maxFreeSize)}.`,
      action: 'Get a Processing Pass to process files up to 500MB',
    };
  }

  if (reason === 'batch') {
    return {
      title: 'Batch Processing',
      message: `Processing ${fileCount} files requires a Processing Pass.`,
      action: 'Get a Processing Pass to process unlimited files',
    };
  }

  return null;
}

