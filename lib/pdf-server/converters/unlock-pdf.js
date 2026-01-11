/**
 * Unlock PDF Converter
 * Removes password protection from PDF documents
 * Uses pdf-lib for PDF manipulation
 */

import { PDFDocument } from 'pdf-lib';
import { ConversionError } from '../utils/error-handler.js';

/**
 * Unlock password-protected PDF by removing encryption
 * @param {Buffer} pdfBuffer - PDF file buffer (password-protected)
 * @param {string} password - Password to unlock the PDF
 * @param {Object} options - Unlock options
 * @returns {Promise<Buffer>} - Unlocked PDF buffer (no password)
 */
export async function unlockPDF(pdfBuffer, password, options = {}) {
  try {
    if (!password || typeof password !== 'string') {
      throw new ConversionError('Password is required to unlock the PDF. Please provide the correct password.');
    }

    // Load the password-protected PDF document
    let sourcePdf;
    try {
      sourcePdf = await PDFDocument.load(pdfBuffer, {
        ignoreEncryption: false,
        updateMetadata: false,
        capNumbers: false,
        // Pass the password to unlock the PDF
        password: password,
      });
    } catch (loadError) {
      // Check if it's a password error
      if (loadError.message && (
        loadError.message.includes('password') ||
        loadError.message.includes('encrypted') ||
        loadError.message.includes('Invalid password')
      )) {
        throw new ConversionError(
          'Incorrect password. Please provide the correct password to unlock this PDF.',
          loadError
        );
      }
      
      // Other errors
      throw new ConversionError(
        'Failed to load PDF file. The file may be corrupted or the password is incorrect.',
        loadError
      );
    }

    // Get total page count
    const pageCount = sourcePdf.getPageCount();
    
    if (pageCount === 0) {
      throw new ConversionError('PDF file contains no pages.');
    }

    // Create a new unlocked PDF document
    const unlockedPdf = await PDFDocument.create();

    // Copy metadata from source if available
    try {
      if (sourcePdf.getTitle()) {
        unlockedPdf.setTitle(sourcePdf.getTitle());
      }
      if (sourcePdf.getAuthor()) {
        unlockedPdf.setAuthor(sourcePdf.getAuthor());
      }
      if (sourcePdf.getSubject()) {
        unlockedPdf.setSubject(sourcePdf.getSubject());
      }
      if (sourcePdf.getCreator()) {
        unlockedPdf.setCreator(sourcePdf.getCreator());
      }
      if (sourcePdf.getProducer()) {
        unlockedPdf.setProducer(sourcePdf.getProducer());
      }
      if (sourcePdf.getKeywords()) {
        unlockedPdf.setKeywords(sourcePdf.getKeywords());
      }
    } catch (metadataError) {
      // Metadata extraction failed, continue without it
      console.warn('Could not copy PDF metadata:', metadataError.message);
    }

    // Copy all pages from the locked PDF to the unlocked PDF
    const pageIndices = Array.from({ length: pageCount }, (_, i) => i);
    const copiedPages = await unlockedPdf.copyPages(sourcePdf, pageIndices);
    
    // Add all copied pages in order
    copiedPages.forEach((page) => {
      unlockedPdf.addPage(page);
    });

    // Save the unlocked PDF (no encryption/password by default)
    const pdfBytes = await unlockedPdf.save({
      useObjectStreams: true,
      addDefaultPage: false,
    });

    return Buffer.from(pdfBytes);
  } catch (error) {
    if (error instanceof ConversionError) {
      throw error;
    }
    throw new ConversionError(`Failed to unlock PDF: ${error.message || 'Unknown error'}`);
  }
}

/**
 * Get unlock statistics
 * @param {number} totalPages - Total pages in original PDF
 * @returns {Object} - Statistics object
 */
export function getUnlockStats(totalPages) {
  return {
    totalPages,
    unlocked: true,
  };
}

