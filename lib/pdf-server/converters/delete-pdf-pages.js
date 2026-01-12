/**
 * Delete PDF Pages Converter
 * Removes specific pages from PDF documents
 * Uses pdf-lib for PDF manipulation
 */

import { PDFDocument } from 'pdf-lib';
import { ConversionError } from '../utils/error-handler.js';

/**
 * Parse page range string (e.g., "1-3,5,7-9") into array of page indices (0-based)
 * @param {string} pageRangeStr - Page range string
 * @param {number} totalPages - Total number of pages in PDF
 * @returns {Array<number>} - Array of page indices to delete (0-based)
 */
export function parsePageRange(pageRangeStr, totalPages) {
  if (!pageRangeStr || !pageRangeStr.trim()) {
    throw new ConversionError('Page range cannot be empty. Please specify which pages to delete.');
  }

  const pagesToDelete = new Set();
  const parts = pageRangeStr.split(',');
  
  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    
    if (trimmed.includes('-')) {
      // Handle range (e.g., "1-3")
      const rangeParts = trimmed.split('-');
      if (rangeParts.length !== 2) {
        throw new ConversionError(`Invalid page range format: "${trimmed}". Use format like "1-3" or "1,3,5".`);
      }
      
      const start = parseInt(rangeParts[0].trim(), 10);
      const end = parseInt(rangeParts[1].trim(), 10);
      
      if (isNaN(start) || isNaN(end)) {
        throw new ConversionError(`Invalid page numbers in range "${trimmed}". Please use numeric values.`);
      }
      
      if (start < 1 || end > totalPages) {
        throw new ConversionError(`Page numbers must be between 1 and ${totalPages}. Range "${trimmed}" is invalid.`);
      }
      
      if (start > end) {
        throw new ConversionError(`Invalid range: start page (${start}) must be less than or equal to end page (${end}).`);
      }
      
      // Convert to 0-based index and add all pages in range
      for (let i = start; i <= end; i++) {
        pagesToDelete.add(i - 1); // Convert to 0-based index
      }
    } else {
      // Handle single page (e.g., "5")
      const pageNum = parseInt(trimmed, 10);
      
      if (isNaN(pageNum)) {
        throw new ConversionError(`Invalid page number: "${trimmed}". Please use numeric values.`);
      }
      
      if (pageNum < 1 || pageNum > totalPages) {
        throw new ConversionError(`Page number ${pageNum} is invalid. PDF has ${totalPages} page(s). Valid range: 1-${totalPages}.`);
      }
      
      pagesToDelete.add(pageNum - 1); // Convert to 0-based index
    }
  }
  
  return Array.from(pagesToDelete).sort((a, b) => a - b);
}

/**
 * Delete pages from PDF document
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @param {string|Array<number>} pagesToDelete - Page range string (e.g., "1-3,5,7-9") or array of page numbers (1-based)
 * @param {Object} options - Conversion options
 * @returns {Promise<Buffer>} - PDF buffer with pages removed
 */
export async function deletePDFPages(pdfBuffer, pagesToDelete, options = {}) {
  try {
    // Load the PDF document
    let sourcePdf;
    try {
      sourcePdf = await PDFDocument.load(pdfBuffer, {
        ignoreEncryption: false,
        updateMetadata: false,
        capNumbers: false,
      });
    } catch (loadError) {
      throw new ConversionError(
        'Failed to load PDF file. The file may be corrupted or password-protected.',
        loadError
      );
    }

    // Get total page count
    const pageCount = sourcePdf.getPageCount();
    
    if (pageCount === 0) {
      throw new ConversionError('PDF file contains no pages.');
    }

    // Parse pages to delete
    let pagesToDeleteIndices;
    if (typeof pagesToDelete === 'string') {
      // Parse page range string
      pagesToDeleteIndices = parsePageRange(pagesToDelete, pageCount);
    } else if (Array.isArray(pagesToDelete)) {
      // Array of page numbers (1-based), convert to 0-based indices
      pagesToDeleteIndices = pagesToDelete
        .map(pageNum => {
          const num = parseInt(pageNum, 10);
          if (isNaN(num) || num < 1 || num > pageCount) {
            throw new ConversionError(`Invalid page number: ${pageNum}. PDF has ${pageCount} page(s).`);
          }
          return num - 1; // Convert to 0-based index
        })
        .sort((a, b) => a - b);
    } else {
      throw new ConversionError('Pages to delete must be a string (e.g., "1-3,5") or an array of page numbers.');
    }

    // Validate that we're not deleting all pages
    if (pagesToDeleteIndices.length >= pageCount) {
      throw new ConversionError(
        `Cannot delete all ${pageCount} page(s). At least one page must remain in the PDF.`
      );
    }

    // Create a new PDF document with pages that should remain
    const newPdf = await PDFDocument.create();

    // Copy metadata from source if available
    try {
      if (sourcePdf.getTitle()) {
        newPdf.setTitle(sourcePdf.getTitle());
      }
      if (sourcePdf.getAuthor()) {
        newPdf.setAuthor(sourcePdf.getAuthor());
      }
      if (sourcePdf.getSubject()) {
        newPdf.setSubject(sourcePdf.getSubject());
      }
      if (sourcePdf.getCreator()) {
        newPdf.setCreator(sourcePdf.getCreator());
      }
      if (sourcePdf.getProducer()) {
        newPdf.setProducer(sourcePdf.getProducer());
      }
      if (sourcePdf.getKeywords()) {
        newPdf.setKeywords(sourcePdf.getKeywords());
      }
    } catch (metadataError) {
      // Metadata extraction failed, continue without it
      console.warn('Could not copy PDF metadata:', metadataError.message);
    }

    // Copy all pages EXCEPT the ones to delete
    const pagesToKeep = [];
    for (let i = 0; i < pageCount; i++) {
      if (!pagesToDeleteIndices.includes(i)) {
        pagesToKeep.push(i);
      }
    }

    // Copy pages to keep
    if (pagesToKeep.length === 0) {
      throw new ConversionError('No pages remain after deletion. At least one page must remain in the PDF.');
    }

    const copiedPages = await newPdf.copyPages(sourcePdf, pagesToKeep);
    
    // Add all copied pages
    copiedPages.forEach((page) => {
      newPdf.addPage(page);
    });

    // Save the new PDF
    const pdfBytes = await newPdf.save({
      useObjectStreams: true,
      addDefaultPage: false,
    });

    return Buffer.from(pdfBytes);
  } catch (error) {
    if (error instanceof ConversionError) {
      throw error;
    }
    throw new ConversionError(`Failed to delete pages from PDF: ${error.message || 'Unknown error'}`);
  }
}

/**
 * Get deletion statistics
 * @param {number} totalPages - Total pages in original PDF
 * @param {string|Array<number>} pagesToDelete - Pages to delete
 * @returns {Object} - Statistics object
 */
export function getDeletePagesStats(totalPages, pagesToDelete) {
  try {
    let pagesToDeleteCount = 0;
    
    if (typeof pagesToDelete === 'string') {
      // Parse to count pages
      const parts = pagesToDelete.split(',');
      for (const part of parts) {
        const trimmed = part.trim();
        if (trimmed.includes('-')) {
          const [start, end] = trimmed.split('-').map(n => parseInt(n.trim(), 10));
          if (!isNaN(start) && !isNaN(end)) {
            pagesToDeleteCount += (end - start + 1);
          }
        } else {
          const pageNum = parseInt(trimmed, 10);
          if (!isNaN(pageNum)) {
            pagesToDeleteCount += 1;
          }
        }
      }
    } else if (Array.isArray(pagesToDelete)) {
      pagesToDeleteCount = pagesToDelete.length;
    }
    
    const pagesRemaining = totalPages - pagesToDeleteCount;
    const deletionPercentage = totalPages > 0 ? ((pagesToDeleteCount / totalPages) * 100).toFixed(1) : 0;
    
    return {
      totalPages,
      pagesDeleted: pagesToDeleteCount,
      pagesRemaining,
      deletionPercentage: parseFloat(deletionPercentage),
    };
  } catch (error) {
    return {
      totalPages,
      pagesDeleted: 0,
      pagesRemaining: totalPages,
      deletionPercentage: 0,
    };
  }
}

