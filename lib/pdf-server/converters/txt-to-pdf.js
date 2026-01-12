/**
 * TXT to PDF Converter
 * Converts plain text files (.txt) to PDF format
 * Uses pdf-lib for PDF creation
 */

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { ConversionError } from '../utils/error-handler.js';

/**
 * Convert text file buffer to PDF
 * @param {Buffer} textBuffer - Text file buffer
 * @param {Object} options - Conversion options
 * @param {string} options.fontSize - Font size in points (default: 12)
 * @param {string} options.fontFamily - Font family (default: 'Helvetica')
 * @param {number} options.margin - Page margin in points (default: 72)
 * @param {string} options.pageSize - Page size ('letter', 'a4', 'legal') (default: 'letter')
 * @param {number} options.lineHeight - Line height multiplier (default: 1.5)
 * @returns {Promise<Buffer>} - PDF buffer
 */
export async function convertTxtToPDF(textBuffer, options = {}) {
  try {
    // Parse options with defaults
    const fontSize = options.fontSize || 12;
    const fontFamily = options.fontFamily || 'Helvetica';
    const margin = options.margin || 72; // 1 inch
    const pageSize = options.pageSize || 'letter';
    const lineHeight = options.lineHeight || 1.5;

    // Convert buffer to text string
    let textContent = textBuffer.toString('utf-8');
    
    // Handle different line endings (Windows \r\n, Mac \r, Unix \n)
    textContent = textContent.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    
    // Remove null bytes and other control characters (except newlines and tabs)
    textContent = textContent.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '');
    
    if (!textContent || textContent.trim().length === 0) {
      throw new ConversionError('Text file is empty or contains no readable content.');
    }

    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();

    // Embed fonts
    const fontMap = {
      'Helvetica': StandardFonts.Helvetica,
      'HelveticaBold': StandardFonts.HelveticaBold,
      'TimesRoman': StandardFonts.TimesRoman,
      'Courier': StandardFonts.Courier,
    };
    
    const fontName = fontMap[fontFamily] || StandardFonts.Helvetica;
    const font = await pdfDoc.embedFont(fontName);

    // Page size settings
    const pageSizes = {
      'letter': { width: 612, height: 792 }, // 8.5 x 11 inches
      'a4': { width: 595, height: 842 },   // A4
      'legal': { width: 612, height: 1008 }, // 8.5 x 14 inches
    };
    
    const size = pageSizes[pageSize] || pageSizes.letter;
    const pageWidth = size.width;
    const pageHeight = size.height;
    const maxWidth = pageWidth - (margin * 2);
    const maxHeight = pageHeight - (margin * 2);

    // Split text into lines
    const lines = textContent.split('\n');
    
    // Create first page
    let page = pdfDoc.addPage([pageWidth, pageHeight]);
    let yPosition = pageHeight - margin;
    const actualLineHeight = fontSize * lineHeight;

    // Process each line
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Check if we need a new page
      if (yPosition < margin + actualLineHeight) {
        page = pdfDoc.addPage([pageWidth, pageHeight]);
        yPosition = pageHeight - margin;
      }

      // Handle empty lines
      if (line.trim().length === 0) {
        yPosition -= actualLineHeight;
        continue;
      }

      // Handle long lines that need to be wrapped
      const words = line.split(' ');
      let currentLine = '';
      
      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const textWidth = font.widthOfTextAtSize(testLine, fontSize);
        
        if (textWidth > maxWidth && currentLine) {
          // Draw current line and start new line
          page.drawText(currentLine, {
            x: margin,
            y: yPosition,
            size: fontSize,
            font: font,
            color: rgb(0, 0, 0),
          });
          
          yPosition -= actualLineHeight;
          
          // Check if we need a new page
          if (yPosition < margin + actualLineHeight) {
            page = pdfDoc.addPage([pageWidth, pageHeight]);
            yPosition = pageHeight - margin;
          }
          
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }
      
      // Draw the remaining line
      if (currentLine) {
        page.drawText(currentLine, {
          x: margin,
          y: yPosition,
          size: fontSize,
          font: font,
          color: rgb(0, 0, 0),
        });
        
        yPosition -= actualLineHeight;
      }
    }

    // Save PDF
    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
  } catch (error) {
    if (error instanceof ConversionError) {
      throw error;
    }
    throw new ConversionError(`Failed to convert text to PDF: ${error.message || 'Unknown error'}`);
  }
}

/**
 * Get conversion statistics
 * @param {Buffer} textBuffer - Text file buffer
 * @returns {Object} - Statistics object
 */
export function getTxtToPdfStats(textBuffer) {
  try {
    const textContent = textBuffer.toString('utf-8');
    const lines = textContent.split('\n');
    const words = textContent.split(/\s+/).filter(w => w.length > 0);
    const characters = textContent.length;
    const charactersNoSpaces = textContent.replace(/\s/g, '').length;
    
    return {
      lines: lines.length,
      words: words.length,
      characters: characters,
      charactersNoSpaces: charactersNoSpaces,
      fileSize: textBuffer.length,
    };
  } catch (error) {
    return {
      lines: 0,
      words: 0,
      characters: 0,
      charactersNoSpaces: 0,
      fileSize: 0,
    };
  }
}

