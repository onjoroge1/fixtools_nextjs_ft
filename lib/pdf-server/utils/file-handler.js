/**
 * File handling utilities for PDF server operations
 */

import fs from 'fs';
import path from 'path';

/**
 * Validate file type
 * @param {string} filename - File name
 * @param {string[]} allowedExtensions - Array of allowed extensions (e.g., ['.pdf', '.docx'])
 * @returns {boolean} - True if file type is valid
 */
export function validateFileType(filename, allowedExtensions) {
  if (!filename) return false;
  const ext = path.extname(filename).toLowerCase();
  return allowedExtensions.includes(ext);
}

/**
 * Get file size in bytes
 * @param {string} filepath - Path to file
 * @returns {number} - File size in bytes
 */
export function getFileSize(filepath) {
  try {
    const stats = fs.statSync(filepath);
    return stats.size;
  } catch (error) {
    return 0;
  }
}

/**
 * Format file size for display
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted file size (e.g., "2.5 MB")
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Clean up temporary files
 * @param {string|string[]} filepaths - File path(s) to delete
 */
export function cleanupFiles(filepaths) {
  const paths = Array.isArray(filepaths) ? filepaths : [filepaths];
  paths.forEach(filepath => {
    try {
      if (filepath && fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
    } catch (error) {
      console.warn(`Failed to delete temp file ${filepath}:`, error.message);
    }
  });
}

/**
 * Generate output filename
 * @param {string} inputFilename - Original filename
 * @param {string} newExtension - New file extension (e.g., '.docx')
 * @returns {string} - Output filename
 */
export function generateOutputFilename(inputFilename, newExtension) {
  if (!inputFilename) return `document${newExtension}`;
  const ext = path.extname(inputFilename);
  return inputFilename.replace(ext, newExtension);
}

/**
 * Validate file size
 * @param {string} filepath - Path to file
 * @param {number} maxSizeBytes - Maximum size in bytes
 * @returns {boolean} - True if file size is within limit
 */
export function validateFileSize(filepath, maxSizeBytes) {
  try {
    const size = getFileSize(filepath);
    return size > 0 && size <= maxSizeBytes;
  } catch (error) {
    return false;
  }
}

