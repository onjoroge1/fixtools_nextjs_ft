/**
 * PDF Repair Converter
 * Repairs corrupted or damaged PDF files by extracting valid content
 * Uses pdf-lib to validate and rebuild PDFs
 */

import { PDFDocument } from 'pdf-lib';
import { ConversionError } from '../utils/error-handler.js';

/**
 * Repair PDF by extracting valid pages and rebuilding
 * @param {Buffer} pdfBuffer - PDF file buffer (may be corrupted)
 * @param {Object} options - Repair options
 * @returns {Promise<Buffer>} - Repaired PDF buffer
 */
export async function repairPDF(pdfBuffer, options = {}) {
  try {
    // Try to load the PDF - this validates the structure
    let sourcePdf;
    try {
      sourcePdf = await PDFDocument.load(pdfBuffer, {
        ignoreEncryption: true, // Try to load even if encrypted
        updateMetadata: false,
      });
    } catch (loadError) {
      // If PDF is too corrupted to load, try to extract what we can
      throw new ConversionError(
        'PDF file is severely corrupted and cannot be repaired. The file structure is too damaged to extract any valid content.',
        loadError
      );
    }

    // Create a new PDF document for the repaired version
    const repairedPdf = await PDFDocument.create();

    // Copy metadata from source if available
    try {
      const sourceMetadata = sourcePdf.getTitle() || sourcePdf.getSubject() || sourcePdf.getAuthor();
      if (sourceMetadata) {
        // Copy available metadata
        if (sourcePdf.getTitle()) {
          repairedPdf.setTitle(sourcePdf.getTitle());
        }
        if (sourcePdf.getAuthor()) {
          repairedPdf.setAuthor(sourcePdf.getAuthor());
        }
        if (sourcePdf.getSubject()) {
          repairedPdf.setSubject(sourcePdf.getSubject());
        }
        if (sourcePdf.getCreator()) {
          repairedPdf.setCreator(sourcePdf.getCreator());
        }
        if (sourcePdf.getProducer()) {
          repairedPdf.setProducer(sourcePdf.getProducer());
        }
      }
    } catch (metadataError) {
      // Metadata extraction failed, continue without it
      console.warn('Could not extract PDF metadata:', metadataError.message);
    }

    // Get all pages from source PDF
    const pageCount = sourcePdf.getPageCount();
    let pagesCopied = 0;
    let pagesSkipped = 0;

    // Try to copy each page
    for (let i = 0; i < pageCount; i++) {
      try {
        const [copiedPage] = await repairedPdf.copyPages(sourcePdf, [i]);
        repairedPdf.addPage(copiedPage);
        pagesCopied++;
      } catch (pageError) {
        // This page is corrupted, skip it
        console.warn(`Skipping corrupted page ${i + 1}:`, pageError.message);
        pagesSkipped++;
        continue;
      }
    }

    // Check if we were able to extract any pages
    if (pagesCopied === 0) {
      throw new ConversionError(
        'Could not extract any valid pages from the PDF. The file may be too severely corrupted.',
        new Error('No valid pages found')
      );
    }

    // If some pages were skipped, log a warning
    if (pagesSkipped > 0) {
      console.warn(`Repaired PDF: ${pagesCopied} pages copied, ${pagesSkipped} pages skipped due to corruption`);
    }

    // Save the repaired PDF
    const repairedBytes = await repairedPdf.save();
    return Buffer.from(repairedBytes);
  } catch (error) {
    if (error instanceof ConversionError) {
      throw error;
    }

    // Handle pdf-lib specific errors
    if (error.message && error.message.includes('Invalid PDF')) {
      throw new ConversionError(
        'Invalid PDF structure. The file may be corrupted or not a valid PDF file.',
        error
      );
    }

    if (error.message && error.message.includes('encrypted')) {
      throw new ConversionError(
        'PDF is password-protected. Please remove the password before repairing, or provide the password.',
        error
      );
    }

    throw new ConversionError(
      `Failed to repair PDF: ${error.message}`,
      error
    );
  }
}

/**
 * Validate PDF structure
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @returns {Promise<Object>} - Validation result
 */
export async function validatePDF(pdfBuffer) {
  try {
    const pdf = await PDFDocument.load(pdfBuffer, {
      ignoreEncryption: true,
      updateMetadata: false,
    });

    const pageCount = pdf.getPageCount();
    const isValid = pageCount > 0;

    return {
      isValid,
      pageCount,
      hasMetadata: !!(pdf.getTitle() || pdf.getAuthor() || pdf.getSubject()),
      message: isValid ? 'PDF is valid and does not need repair.' : 'PDF appears to be empty or corrupted.',
    };
  } catch (error) {
    return {
      isValid: false,
      pageCount: 0,
      hasMetadata: false,
      message: `PDF validation failed: ${error.message}`,
      error: error.message,
    };
  }
}


