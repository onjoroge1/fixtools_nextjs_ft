/**
 * PDF to Word Converter
 * Converts PDF documents to editable Word (.docx) format
 * Uses pdf-parse for text extraction
 */

import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import pdfParse from 'pdf-parse';
import { ConversionError } from '../utils/error-handler.js';

/**
 * Convert PDF buffer to Word document
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @param {Object} options - Conversion options
 * @returns {Promise<Buffer>} - Word document buffer
 */
export async function convertPDFToWord(pdfBuffer, options = {}) {
  try {
    // Extract text from PDF using pdf-parse
    const pdfData = await pdfParse(pdfBuffer);
    
    if (!pdfData || !pdfData.text) {
      throw new ConversionError('Failed to extract text from PDF. The PDF may be image-based or corrupted.');
    }

    // Split text into pages if page info is available
    const pages = pdfData.numpages || 1;
    const fullText = pdfData.text || '';
    
    // Extract content from each page
    const paragraphs = [];
    
    // Add document title
    if (options.includeTitle !== false) {
      paragraphs.push(
        new Paragraph({
          text: 'Converted from PDF',
          heading: HeadingLevel.HEADING_1,
        })
      );
    }

    // If we have page information, try to split by pages
    // Note: pdf-parse doesn't always provide per-page text, so we'll use the full text
    // and add page breaks based on estimated content
    
    if (pages > 1 && fullText.length > 0) {
      // Estimate characters per page
      const charsPerPage = Math.ceil(fullText.length / pages);
      
      // Split text into chunks (approximate pages)
      for (let i = 0; i < pages; i++) {
        // Add page break (except for first page)
        if (i > 0 && options.addPageBreaks !== false) {
          paragraphs.push(
            new Paragraph({
              text: '',
              pageBreakBefore: true,
            })
          );
        }

        // Add page header
        if (options.includePageNumbers !== false) {
          paragraphs.push(
            new Paragraph({
              text: `Page ${i + 1}`,
              heading: HeadingLevel.HEADING_2,
            })
          );
        }

        // Extract text for this page (approximate)
        const start = i * charsPerPage;
        const end = Math.min((i + 1) * charsPerPage, fullText.length);
        const pageText = fullText.substring(start, end).trim();

        if (pageText) {
          // Split page text into paragraphs (by double newlines or single newlines)
          const pageParagraphs = pageText.split(/\n\s*\n|\n{2,}/).filter(p => p.trim().length > 0);
          
          pageParagraphs.forEach(text => {
            // Clean up text (remove excessive whitespace)
            const cleanText = text.replace(/\s+/g, ' ').trim();
            
            if (cleanText.length > 0) {
              paragraphs.push(
                new Paragraph({
                  children: [
                    new TextRun({
                      text: cleanText,
                    }),
                  ],
                })
              );
            }
          });
        }
      }
    } else {
      // Single page or no page info - use full text
      if (options.includePageNumbers !== false && pages > 1) {
        paragraphs.push(
          new Paragraph({
            text: `Page 1 of ${pages}`,
            heading: HeadingLevel.HEADING_2,
          })
        );
      }

      // Split full text into paragraphs
      const textParagraphs = fullText.split(/\n\s*\n|\n{2,}/).filter(p => p.trim().length > 0);
      
      textParagraphs.forEach(text => {
        const cleanText = text.replace(/\s+/g, ' ').trim();
        
        if (cleanText.length > 0) {
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: cleanText,
                }),
              ],
            })
          );
        }
      });
    }

    // If no paragraphs were created, add a message
    if (paragraphs.length === 0 || (paragraphs.length === 1 && paragraphs[0].text === 'Converted from PDF')) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: 'No extractable text found in this PDF. The PDF may be image-based or scanned. Consider using OCR to extract text.',
            }),
          ],
        })
      );
    }

    // Create Word document
    const doc = new Document({
      sections: [{
        properties: {},
        children: paragraphs,
      }],
    });

    // Generate Word document buffer
    const buffer = await Packer.toBuffer(doc);
    return buffer;
  } catch (error) {
    if (error instanceof ConversionError) {
      throw error;
    }
    
    // Handle pdf-parse specific errors
    if (error.message && error.message.includes('Invalid PDF')) {
      throw new ConversionError('Invalid PDF structure. The file may be corrupted.');
    }
    
    throw new ConversionError(
      `Failed to convert PDF to Word: ${error.message}`,
      error
    );
  }
}

/**
 * Extract text from PDF
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @returns {Promise<Object>} - PDF data with text and metadata
 */
export async function extractTextFromPDF(pdfBuffer) {
  try {
    const pdfData = await pdfParse(pdfBuffer);
    return {
      text: pdfData.text || '',
      numPages: pdfData.numpages || 1,
      info: pdfData.info || {},
    };
  } catch (error) {
    throw new ConversionError(
      `Failed to extract text from PDF: ${error.message}`,
      error
    );
  }
}

