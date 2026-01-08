/**
 * Word to PDF Converter
 * Converts Word documents (.docx) to PDF format
 * Uses mammoth for Word document parsing and pdf-lib for PDF creation
 */

import mammoth from 'mammoth';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { ConversionError } from '../utils/error-handler.js';

/**
 * Convert Word document buffer to PDF
 * @param {Buffer} wordBuffer - Word document buffer
 * @param {Object} options - Conversion options
 * @returns {Promise<Buffer>} - PDF buffer
 */
export async function convertWordToPDF(wordBuffer, options = {}) {
  try {
    // Convert Word document to HTML using mammoth
    const result = await mammoth.convertToHtml({ buffer: wordBuffer });
    const html = result.value;
    const messages = result.messages;

    // Log any conversion warnings
    if (messages && messages.length > 0) {
      console.warn('Word to PDF conversion warnings:', messages);
    }

    // Extract text content from HTML (simple approach)
    // Remove HTML tags and decode entities
    const textContent = html
      .replace(/<[^>]*>/g, ' ') // Remove HTML tags
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();

    if (!textContent || textContent.length === 0) {
      throw new ConversionError('No extractable content found in Word document.');
    }

    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();

    // Add a standard font
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    /**
     * Sanitize text to only include WinAnsi-encodable characters
     * Replaces unsupported Unicode characters with alternatives or removes them
     */
    const sanitizeText = (text) => {
      return text
        .split('')
        .map(char => {
          const charCode = char.charCodeAt(0);
          // WinAnsi supports characters 0x20-0x7E and some extended (0x80-0xFF)
          // For characters outside this range, replace with alternatives
          if (charCode < 0x20 && charCode !== 0x09 && charCode !== 0x0A && charCode !== 0x0D) {
            return ''; // Remove control characters except tab, newline, carriage return
          }
          if (charCode > 0xFF) {
            // Replace common Unicode characters with ASCII alternatives
            const replacements = {
              '\u2192': '->',  // →
              '\u2190': '<-',  // ←
              '\u2191': '^',   // ↑
              '\u2193': 'v',   // ↓
              '\u2022': '*',   // •
              '\u2013': '-',   // –
              '\u2014': '--',  // —
              '\u2026': '...', // …
              '\u201C': '"',   // "
              '\u201D': '"',   // "
              '\u2018': "'",   // '
              '\u2019': "'",   // '
              '\u00A9': '(c)', // ©
              '\u00AE': '(R)', // ®
              '\u2122': '(TM)', // ™
              '\u20AC': 'EUR', // €
              '\u00A3': 'GBP', // £
              '\u00A5': 'JPY', // ¥
            };
            return replacements[char] || '?';
          }
          return char;
        })
        .join('');
    };

    // Page settings
    const pageWidth = 612; // US Letter width in points (8.5 inches)
    const pageHeight = 792; // US Letter height in points (11 inches)
    const margin = 72; // 1 inch margin
    const maxWidth = pageWidth - (margin * 2);
    const fontSize = options.fontSize || 12;
    const lineHeight = fontSize * 1.5;

    // Split text into paragraphs (by double newlines or HTML paragraph breaks)
    const paragraphs = textContent
      .split(/\n\s*\n|<\/p>|<p>/i)
      .map(p => p.trim())
      .filter(p => p.length > 0);

    let currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
    let yPosition = pageHeight - margin;

    // Process each paragraph
    for (const paragraph of paragraphs) {
      // Check if we need a new page
      if (yPosition < margin + lineHeight) {
        currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
        yPosition = pageHeight - margin;
      }

      // Sanitize paragraph first to handle Unicode characters
      const sanitizedParagraph = sanitizeText(paragraph);
      if (!sanitizedParagraph) continue; // Skip empty paragraphs after sanitization
      
      // Split long paragraphs into lines that fit the page width
      const words = sanitizedParagraph.split(' ');
      let currentLine = '';

      for (const word of words) {
        if (!word) continue; // Skip empty words
        
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const textWidth = font.widthOfTextAtSize(testLine, fontSize);

        if (textWidth > maxWidth && currentLine) {
          // Draw the current line
          currentPage.drawText(currentLine, {
            x: margin,
            y: yPosition,
            size: fontSize,
            font: font,
            color: rgb(0, 0, 0),
          });

          yPosition -= lineHeight;

          // Check if we need a new page
          if (yPosition < margin + lineHeight) {
            currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
            yPosition = pageHeight - margin;
          }

          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }

      // Draw the last line of the paragraph
      if (currentLine) {
        currentPage.drawText(currentLine, {
          x: margin,
          y: yPosition,
          size: fontSize,
          font: font,
          color: rgb(0, 0, 0),
        });

        yPosition -= lineHeight;
      }

      // Add spacing between paragraphs
      yPosition -= lineHeight * 0.5;
    }

    // Generate PDF buffer
    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
  } catch (error) {
    if (error instanceof ConversionError) {
      throw error;
    }

    // Handle mammoth-specific errors
    if (error.message && error.message.includes('Invalid')) {
      throw new ConversionError('Invalid Word document structure. The file may be corrupted or in an unsupported format.');
    }

    throw new ConversionError(
      `Failed to convert Word to PDF: ${error.message}`,
      error
    );
  }
}

/**
 * Extract text from Word document
 * @param {Buffer} wordBuffer - Word document buffer
 * @returns {Promise<string>} - Extracted text content
 */
export async function extractTextFromWord(wordBuffer) {
  try {
    const result = await mammoth.extractRawText({ buffer: wordBuffer });
    return result.value;
  } catch (error) {
    throw new ConversionError(
      `Failed to extract text from Word document: ${error.message}`,
      error
    );
  }
}

