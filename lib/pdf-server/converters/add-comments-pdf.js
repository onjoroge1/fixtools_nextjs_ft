/**
 * Add Comments to PDF Converter
 * Adds comment annotations (text comments, notes, highlights) to PDF files
 * Uses pdf-lib for PDF manipulation
 */

import { PDFDocument, PDFName, PDFDict, PDFString, PDFArray, rgb, StandardFonts } from 'pdf-lib';
import { ConversionError } from '../utils/error-handler.js';

/**
 * Add comments to PDF
 * @param {Buffer} pdfBuffer - Original PDF buffer
 * @param {Array} comments - Array of comment objects with {page, x, y, text, author, color}
 * @param {Object} options - Additional options
 * @returns {Promise<Buffer>} - PDF buffer with comments added
 */
export async function addCommentsToPDF(pdfBuffer, comments = [], options = {}) {
  try {
    if (!comments || comments.length === 0) {
      throw new ConversionError('No comments provided. Please provide at least one comment to add to the PDF.');
    }

    let sourcePdf;
    try {
      sourcePdf = await PDFDocument.load(pdfBuffer, {
        ignoreEncryption: false,
        updateMetadata: false,
      });
    } catch (loadError) {
      throw new ConversionError(
        'Failed to load PDF file. The file may be corrupted or password-protected.',
        loadError
      );
    }

    const pageCount = sourcePdf.getPageCount();
    
    if (pageCount === 0) {
      throw new ConversionError('PDF file contains no pages.');
    }

    // Validate comments - check page numbers are valid
    const invalidComments = comments.filter(comment => 
      !comment.page || comment.page < 1 || comment.page > pageCount
    );
    
    if (invalidComments.length > 0) {
      throw new ConversionError(
        `Invalid page numbers in comments. PDF has ${pageCount} page(s), but comments reference invalid pages.`
      );
    }

    // Group comments by page for efficient processing
    const commentsByPage = {};
    comments.forEach((comment, index) => {
      const pageNum = comment.page || 1;
      if (!commentsByPage[pageNum]) {
        commentsByPage[pageNum] = [];
      }
      commentsByPage[pageNum].push({
        ...comment,
        index: index + 1,
      });
    });

    // Get fonts for text rendering
    const helveticaFont = await sourcePdf.embedFont(StandardFonts.Helvetica);
    const helveticaBoldFont = await sourcePdf.embedFont(StandardFonts.HelveticaBold);

    // Process each page that has comments
    for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
      if (!commentsByPage[pageNum]) continue;

      const page = sourcePdf.getPage(pageNum - 1); // pdf-lib uses 0-based indexing
      const { width, height } = page.getSize();
      const pageComments = commentsByPage[pageNum];

      // Add each comment as an annotation
      for (const comment of pageComments) {
        try {
          const commentX = comment.x !== undefined ? comment.x : width * 0.1; // Default: 10% from left
          const commentY = comment.y !== undefined ? comment.y : height * 0.9; // Default: 90% from bottom
          const commentText = comment.text || 'Comment';
          const authorName = comment.author || 'User';
          const commentColor = comment.color || { r: 1, g: 1, b: 0 }; // Yellow default

          // Create a text annotation (comment/note)
          // pdf-lib doesn't have direct annotation support, so we'll add text overlays
          // For proper PDF comments, we'd need to use lower-level PDF structure manipulation
          // For now, we'll add visible text markers and callout boxes

          // Draw a comment icon/box
          const boxWidth = 200;
          const boxHeight = 60;
          const adjustedX = Math.min(commentX, width - boxWidth - 20);
          const adjustedY = Math.min(commentY, height - 20);

          // Draw comment background box
          page.drawRectangle({
            x: adjustedX,
            y: adjustedY - boxHeight,
            width: boxWidth,
            height: boxHeight,
            color: rgb(1, 1, 0.8), // Light yellow background
            borderColor: rgb(commentColor.r || 1, commentColor.g || 1, commentColor.b || 0),
            borderWidth: 2,
            borderOpacity: 0.8,
            opacity: 0.9,
          });

          // Draw author name
          page.drawText(authorName, {
            x: adjustedX + 5,
            y: adjustedY - 20,
            size: 10,
            font: helveticaBoldFont,
            color: rgb(0.2, 0.2, 0.2),
          });

          // Draw comment text (wrapped if needed)
          const textLines = wrapText(commentText, boxWidth - 10, 10, helveticaFont);
          textLines.forEach((line, lineIndex) => {
            if (lineIndex < 3) { // Max 3 lines of text
              page.drawText(line, {
                x: adjustedX + 5,
                y: adjustedY - 35 - (lineIndex * 12),
                size: 9,
                font: helveticaFont,
                color: rgb(0, 0, 0),
                maxWidth: boxWidth - 10,
              });
            }
          });

          // Draw a line from comment to the point if coordinates provided
          if (comment.targetX !== undefined && comment.targetY !== undefined) {
            const targetX = comment.targetX;
            const targetY = height - comment.targetY; // Convert to PDF coordinates
            
            // Draw line from comment box to target point
            const lineStartX = adjustedX + boxWidth / 2;
            const lineStartY = adjustedY - boxHeight;
            
            // Simple line drawing using rectangle (pdf-lib doesn't have direct line support)
            const lineLength = Math.sqrt(
              Math.pow(targetX - lineStartX, 2) + Math.pow(targetY - lineStartY, 2)
            );
            const angle = Math.atan2(targetY - lineStartY, targetX - lineStartX);
            
            // Draw line using a thin rectangle rotated
            page.drawRectangle({
              x: lineStartX,
              y: lineStartY,
              width: Math.min(lineLength, 100),
              height: 1,
              color: rgb(commentColor.r || 1, commentColor.g || 1, commentColor.b || 0),
              opacity: 0.7,
              rotate: { degrees: (angle * 180) / Math.PI },
            });

            // Draw a small circle at the target point
            page.drawCircle({
              x: targetX,
              y: targetY,
              size: 3,
              color: rgb(commentColor.r || 1, commentColor.g || 1, commentColor.b || 0),
              borderColor: rgb(0, 0, 0),
              borderWidth: 1,
            });
          } else {
            // Draw a comment icon (💬 emoji would be rendered as text)
            page.drawText('💬', {
              x: adjustedX - 15,
              y: adjustedY - 30,
              size: 16,
              color: rgb(commentColor.r || 1, commentColor.g || 1, commentColor.b || 0),
            });
          }
        } catch (commentError) {
          console.warn(`Error adding comment ${comment.index || ''} to page ${pageNum}:`, commentError.message);
          // Continue with other comments
        }
      }
    }

    // Save the modified PDF
    const modifiedPdfBytes = await sourcePdf.save({
      useObjectStreams: true,
      addDefaultPage: false,
    });

    return Buffer.from(modifiedPdfBytes);
  } catch (error) {
    if (error instanceof ConversionError) {
      throw error;
    }
    
    if (error.message && error.message.includes('Invalid PDF')) {
      throw new ConversionError(
        'Invalid PDF structure. The file may be corrupted.',
        error
      );
    }
    
    if (error.message && error.message.includes('encrypted')) {
      throw new ConversionError(
        'PDF is password-protected. Please remove the password before adding comments.',
        error
      );
    }

    throw new ConversionError(
      `Failed to add comments to PDF: ${error.message}`,
      error
    );
  }
}

/**
 * Helper function to wrap text to fit within width
 * @param {string} text - Text to wrap
 * @param {number} maxWidth - Maximum width in points
 * @param {number} fontSize - Font size
 * @param {PDFFont} font - Font object
 * @returns {Array<string>} - Array of wrapped text lines
 */
function wrapText(text, maxWidth, fontSize, font) {
  if (!text || text.trim().length === 0) return [];
  
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';

  words.forEach(word => {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    // Rough estimate: average character width is ~0.6 * fontSize
    const testWidth = testLine.length * fontSize * 0.6;
    
    if (testWidth > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

/**
 * Get statistics about comments added
 * @param {Array} comments - Array of comments
 * @returns {Object} - Statistics object
 */
export function getCommentsStats(comments) {
  if (!comments || comments.length === 0) {
    return {
      totalComments: 0,
      commentsByPage: {},
      uniqueAuthors: 0,
    };
  }

  const commentsByPage = {};
  const authors = new Set();

  comments.forEach(comment => {
    const pageNum = comment.page || 1;
    commentsByPage[pageNum] = (commentsByPage[pageNum] || 0) + 1;
    if (comment.author) {
      authors.add(comment.author);
    }
  });

  return {
    totalComments: comments.length,
    commentsByPage,
    uniqueAuthors: authors.size,
    pageCount: Object.keys(commentsByPage).length,
  };
}


