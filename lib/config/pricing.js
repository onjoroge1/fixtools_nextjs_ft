/**
 * FixTools Pricing Configuration
 * Centralized configuration for all tools across the platform
 * 
 * This configuration defines:
 * - Pricing plans (free, day_pass, pro)
 * - Tool-specific limits (PDF, Image, Video)
 * - Grace rules and abuse protection
 * 
 * Usage:
 * import { PRICING_CONFIG, getToolLimits, checkPaymentRequirement } from '@/lib/config/pricing';
 */

export const PRICING_CONFIG = {
  currency: "USD",

  plans: {
    free: {
      price: 0,
      duration_hours: null,
      features: {
        priority_queue: false,
        batch_processing: false,
        ocr: false,
        watermark_free: true,
        history_days: 0
      }
    },

    day_pass: {
      price: 3.99,
      duration_hours: 24,
      features: {
        priority_queue: true,
        batch_processing: true,
        ocr: true,
        watermark_free: true,
        history_days: 1
      }
    },

    pro: {
      price: 7.99,
      billing_cycle: "monthly",
      features: {
        priority_queue: true,
        batch_processing: true,
        ocr: true,
        watermark_free: true,
        history_days: 30
      }
    }
  },

  tools: {
    pdf: {
      free: {
        max_file_size_mb: 10,
        max_files_per_job: 1,
        max_jobs_per_day: 5,
        ocr: false,
        batch: false
      },
      paid: {
        max_file_size_mb: 500,
        max_files_per_job: 20,
        max_jobs_per_day: 200,
        ocr: true,
        batch: true
      },
      hard_cap: {
        max_file_size_mb: 1024,
        max_processing_time_seconds: 180
      }
    },

    image: {
      free: {
        max_file_size_mb: 5,
        max_files_per_job: 1,
        max_jobs_per_day: 10,
        max_output_resolution_px: 2048,
        batch: false
      },
      paid: {
        max_file_size_mb: 100,
        max_files_per_job: 50,
        max_jobs_per_day: 500,
        max_output_resolution_px: 8192,
        batch: true
      },
      hard_cap: {
        max_file_size_mb: 250,
        max_processing_time_seconds: 120
      }
    },

    video: {
      free: {
        max_file_size_mb: 50,
        max_files_per_job: 1,
        max_jobs_per_day: 1,
        batch: false,
        watermark: true
      },
      paid: {
        max_file_size_mb: 500,
        max_files_per_job: 5,
        max_jobs_per_day: 50,
        batch: true,
        watermark: false
      },
      hard_cap: {
        max_file_size_mb: 2048,
        max_processing_time_seconds: 600
      }
    },

    'web-tools': {
      free: {
        max_file_size_mb: 10,
        max_files_per_job: 3, // Allow up to 3 items free, 4+ requires payment
        max_jobs_per_day: 5,
        batch: false
      },
      paid: {
        max_file_size_mb: 500,
        max_files_per_job: 20,
        max_jobs_per_day: 200,
        batch: true
      },
      hard_cap: {
        max_file_size_mb: 1024,
        max_processing_time_seconds: 180
      }
    }
  },

  grace_rules: {
    allow_one_time_overage: true,
    overage_buffer_percent: 20,
    grace_message: "This file slightly exceeds the free limit — we've processed it this time."
  },

  abuse_protection: {
    rate_limit_per_ip_per_hour: 60,
    cooldown_on_failure_seconds: 30,
    block_batch_on_free: true
  }
};

/**
 * Get tool-specific limits based on user plan
 * @param {string} toolType - Tool type ('pdf', 'image', 'video')
 * @param {string} plan - User plan ('free', 'day_pass', 'pro')
 * @returns {Object} - Tool limits
 */
export function getToolLimits(toolType = 'pdf', plan = 'free') {
  const toolConfig = PRICING_CONFIG.tools[toolType];
  if (!toolConfig) {
    console.warn(`Tool type '${toolType}' not found, using PDF defaults`);
    return PRICING_CONFIG.tools.pdf[plan === 'free' ? 'free' : 'paid'];
  }

  return plan === 'free' ? toolConfig.free : toolConfig.paid;
}

/**
 * Check if payment is required for a file operation
 * @param {string} toolType - Tool type ('pdf', 'image', 'video')
 * @param {number} fileSizeBytes - File size in bytes
 * @param {number} fileCount - Number of files (for batch)
 * @param {string} plan - User plan ('free', 'day_pass', 'pro')
 * @returns {Object} - Payment requirement info
 */
export function checkPaymentRequirement(toolType = 'pdf', fileSizeBytes = 0, fileCount = 1, plan = 'free') {
  // Paid plans don't require payment
  if (plan !== 'free') {
    return {
      requiresPayment: false,
      reason: null,
      fileSize: fileSizeBytes,
      fileCount,
      plan
    };
  }

  const limits = getToolLimits(toolType, 'free');
  const maxFileSizeBytes = limits.max_file_size_mb * 1024 * 1024;
  const maxFiles = limits.max_files_per_job;

  // Check file size
  const exceedsFileSize = fileSizeBytes > maxFileSizeBytes;
  
  // Check batch limit
  const exceedsBatchLimit = fileCount > maxFiles && PRICING_CONFIG.abuse_protection.block_batch_on_free;

  // Check grace rule (allow 20% overage once) - ONLY applies to file size, not batch
  const graceBuffer = maxFileSizeBytes * (1 + PRICING_CONFIG.grace_rules.overage_buffer_percent / 100);
  const withinGracePeriod = fileSizeBytes <= graceBuffer && PRICING_CONFIG.grace_rules.allow_one_time_overage;

  // Payment required if: (file size exceeds AND not in grace) OR (batch exceeds)
  // Grace period only applies to file size, not batch limits
  const requiresPayment = (exceedsFileSize && !withinGracePeriod) || exceedsBatchLimit;

  let reason = null;
  if (exceedsFileSize && !withinGracePeriod) {
    reason = 'file_size';
  } else if (exceedsBatchLimit) {
    reason = 'batch';
  }

  return {
    requiresPayment,
    reason,
    fileSize: fileSizeBytes,
    fileCount,
    maxFreeSize: maxFileSizeBytes,
    maxFreeBatch: maxFiles,
    withinGracePeriod,
    plan
  };
}

/**
 * Check if user has valid processing pass
 * @param {Object} session - User session/state
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
 * Get user plan from session
 * @param {Object} session - User session/state
 * @returns {string} - Plan name ('free', 'day_pass', 'pro')
 */
export function getUserPlan(session) {
  if (!session) return 'free';
  
  if (hasValidProcessingPass(session)) {
    // Check if it's a day pass or pro
    const passType = session.processingPass?.type;
    if (passType === 'pro') return 'pro';
    if (passType === 'processing-pass' || passType === 'day_pass') return 'day_pass';
  }

  return 'free';
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
 * @param {Object} requirement - Payment requirement object from checkPaymentRequirement
 * @param {string} toolType - Tool type for context
 * @returns {Object} - Message and details
 */
export function getPaymentMessage(requirement, toolType = 'pdf') {
  const { reason, fileSize, fileCount, maxFreeSize } = requirement;
  const limits = getToolLimits(toolType, 'free');

  if (reason === 'file_size') {
    return {
      title: 'File Size Limit',
      message: `Your file (${formatFileSize(fileSize)}) exceeds our free limit of ${formatFileSize(maxFreeSize)}.`,
      action: `Get a Processing Pass to process files up to ${limits.paid?.max_file_size_mb || 500}MB`,
      price: PRICING_CONFIG.plans.day_pass.price
    };
  }

  if (reason === 'batch') {
    return {
      title: 'Batch Processing',
      message: `Processing ${fileCount} files requires a Processing Pass. Free tier allows ${limits.max_files_per_job} file at a time.`,
      action: 'Get a Processing Pass to process multiple files',
      price: PRICING_CONFIG.plans.day_pass.price
    };
  }

  return null;
}

export default PRICING_CONFIG;


