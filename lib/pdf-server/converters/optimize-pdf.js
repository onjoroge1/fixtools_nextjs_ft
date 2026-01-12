/**
 * PDF Optimizer Converter
 * Optimizes PDF files for web, email, or storage
 * Reduces file size while maintaining quality through various optimization techniques
 * Uses pdf-lib for PDF manipulation with aggressive optimization
 */

import { PDFDocument } from 'pdf-lib';
import { ConversionError } from '../utils/error-handler.js';

/**
 * Optimize PDF by reducing file size and cleaning up structure
 * Uses aggressive optimization techniques while maintaining visual quality
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @param {Object} options - Optimization options
 * @returns {Promise<Buffer>} - Optimized PDF buffer
 */
export async function optimizePDF(pdfBuffer, options = {}) {
  try {
    // Load the PDF document
    let sourcePdf;
    try {
      sourcePdf = await PDFDocument.load(pdfBuffer, {
        ignoreEncryption: false,
        updateMetadata: false,
        // Parse with minimal overhead
        capNumbers: false,
      });
    } catch (loadError) {
      throw new ConversionError(
        'Failed to load PDF file. The file may be corrupted or password-protected.',
        loadError
      );
    }

    // Create a new optimized PDF document
    const optimizedPdf = await PDFDocument.create();

    // AGGRESSIVE METADATA REMOVAL - Remove ALL metadata to reduce size
    // Don't copy any metadata - this can save significant space
    // Many PDFs have extensive metadata that's not needed for viewing
    try {
      // Explicitly set minimal metadata
      optimizedPdf.setTitle('');
      optimizedPdf.setAuthor('');
      optimizedPdf.setSubject('');
      optimizedPdf.setCreator('');
      optimizedPdf.setProducer('');
      optimizedPdf.setKeywords([]);
      // Remove creation/modification dates
      optimizedPdf.setCreationDate(new Date(0));
      optimizedPdf.setModificationDate(new Date(0));
    } catch (metadataError) {
      // Continue even if metadata removal fails
      console.warn('Could not remove PDF metadata:', metadataError.message);
    }

    // Get all pages from source PDF
    const pageCount = sourcePdf.getPageCount();
    
    if (pageCount === 0) {
      throw new ConversionError('PDF file contains no pages.');
    }

    // Copy all pages to optimized PDF
    // This process automatically:
    // - Removes unused resources (fonts, images, etc.)
    // - Optimizes object references
    // - Cleans up the PDF structure
    const copiedPages = await optimizedPdf.copyPages(sourcePdf, Array.from({ length: pageCount }, (_, i) => i));

    // Add all copied pages
    copiedPages.forEach((page) => {
      optimizedPdf.addPage(page);
    });

    // Additional optimizations that pdf-lib performs automatically:
    // 1. Removes unused fonts (only fonts actually used are embedded)
    // 2. Removes unused images (only images on pages are kept)
    // 3. Optimizes object structure (removes duplicate objects)
    // 4. Optimizes cross-reference tables

    // Save the optimized PDF with maximum compression settings
    // These options provide the best size reduction without quality loss:
    const optimizedBytes = await optimizedPdf.save({
      useObjectStreams: true, // Use object streams for better compression (PDF 1.5+)
      addDefaultPage: false, // Don't add empty default page
      // Note: pdf-lib doesn't expose advanced compression options like:
      // - Image recompression (would reduce quality)
      // - Font subsetting (requires font parsing)
      // - Advanced stream compression filters
      // These limitations mean optimization is best for PDFs with:
      // - Lots of metadata
      // - Unused resources (fonts, images)
      // - Duplicate objects
      // - Unoptimized structure
    });

    // Return optimized PDF
    // Note: If reduction is minimal, the PDF was likely already well-optimized
    // pdf-lib's optimization focuses on structure cleanup, not content compression
    return Buffer.from(optimizedBytes);
  } catch (error) {
    if (error instanceof ConversionError) {
      throw error;
    }

    // Handle pdf-lib specific errors
    if (error.message && error.message.includes('Invalid PDF')) {
      throw new ConversionError(
        'Invalid PDF structure. The file may be corrupted.',
        error
      );
    }

    if (error.message && error.message.includes('encrypted')) {
      throw new ConversionError(
        'PDF is password-protected. Please remove the password before optimizing.',
        error
      );
    }

    throw new ConversionError(
      `Failed to optimize PDF: ${error.message}`,
      error
    );
  }
}

/**
 * Get optimization statistics
 * @param {Buffer} originalBuffer - Original PDF buffer
 * @param {Buffer} optimizedBuffer - Optimized PDF buffer
 * @returns {Object} - Optimization statistics
 */
export function getOptimizationStats(originalBuffer, optimizedBuffer) {
  const originalSize = originalBuffer.length;
  const optimizedSize = optimizedBuffer.length;
  const sizeReduction = originalSize - optimizedSize;
  const reductionPercent = originalSize > 0 
    ? ((sizeReduction / originalSize) * 100).toFixed(1)
    : 0;

  return {
    originalSize,
    optimizedSize,
    sizeReduction,
    reductionPercent: parseFloat(reductionPercent),
    isOptimized: optimizedSize < originalSize,
  };
}

