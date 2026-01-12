/**
 * Error handling utilities for PDF server operations
 */

/**
 * Create standardized error response
 * @param {Error} error - Error object
 * @param {boolean} includeStack - Whether to include stack trace
 * @returns {Object} - Error response object
 */
export function createErrorResponse(error, includeStack = false) {
  const response = {
    error: error.name || 'Error',
    message: error.message || 'An error occurred',
  };

  // Include stack trace in development
  if (includeStack && process.env.NODE_ENV === 'development') {
    response.stack = error.stack;
  }

  // Add specific error details
  if (error.code) {
    response.code = error.code;
  }

  return response;
}

/**
 * Handle API errors consistently
 * @param {Error} error - Error object
 * @param {Object} res - Express response object
 * @param {number} defaultStatus - Default HTTP status code
 */
export function handleApiError(error, res, defaultStatus = 500) {
  console.error('API Error:', error);

  const statusCode = error.statusCode || defaultStatus;
  const errorResponse = createErrorResponse(
    error,
    process.env.NODE_ENV === 'development'
  );

  return res.status(statusCode).json(errorResponse);
}

/**
 * Validation error class
 */
export class ValidationError extends Error {
  constructor(message, field = null) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
    this.field = field;
  }
}

/**
 * Conversion error class
 */
export class ConversionError extends Error {
  constructor(message, originalError = null) {
    super(message);
    this.name = 'ConversionError';
    this.statusCode = 500;
    this.originalError = originalError;
  }
}

/**
 * File error class
 */
export class FileError extends Error {
  constructor(message, code = null) {
    super(message);
    this.name = 'FileError';
    this.statusCode = 400;
    this.code = code;
  }
}


