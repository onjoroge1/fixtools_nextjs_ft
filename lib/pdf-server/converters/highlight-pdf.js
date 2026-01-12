/**
 * Highlight PDF Converter
 * Adds highlight annotations to PDF files
 * Uses pdf-lib for PDF manipulation with low-level annotation support
 */

import { PDFDocument, PDFName, PDFDict, PDFString, PDFArray, PDFNumber, rgb, StandardFonts } from 'pdf-lib';
import { ConversionError } from '../utils/error-handler.js';

/**
 * Add highlights to PDF
 * @param {Buffer} pdfBuffer - Original PDF buffer
 * @param {Array} highlights - Array of highlight objects with {page, text, x, y, width, height, color}
 * @param {Object} options - Additional options
 * @returns {Promise<Buffer>} - PDF buffer with highlights added
 */
export async function highlightPDF(pdfBuffer, highlights = [], options = {}) {
  try {
    if (!highlights || highlights.length === 0) {
      throw new ConversionError('No highlights provided. Please provide at least one highlight to add to the PDF.');
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

    // Validate highlights - check page numbers are valid
    const invalidHighlights = highlights.filter(highlight => 
      !highlight.page || highlight.page < 1 || highlight.page > pageCount
    );
    
    if (invalidHighlights.length > 0) {
      throw new ConversionError(
        `Invalid page numbers in highlights. PDF has ${pageCount} page(s), but highlights reference invalid pages.`
      );
    }

    // Group highlights by page for efficient processing
    const highlightsByPage = {};
    highlights.forEach((highlight, index) => {
      const pageNum = highlight.page || 1;
      if (!highlightsByPage[pageNum]) {
        highlightsByPage[pageNum] = [];
      }
      highlightsByPage[pageNum].push({
        ...highlight,
        index: index + 1,
      });
    });

    // Process each page that has highlights
    for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
      if (!highlightsByPage[pageNum]) continue;

      const page = sourcePdf.getPage(pageNum - 1); // pdf-lib uses 0-based indexing
      const { width, height } = page.getSize();
      const pageHighlights = highlightsByPage[pageNum];

      // Add each highlight as an annotation
      for (const highlight of pageHighlights) {
        try {
          // Get highlight coordinates and dimensions
          const highlightX = highlight.x !== undefined ? highlight.x : width * 0.1;
          const highlightY = highlight.y !== undefined ? highlight.y : height * 0.7;
          const highlightWidth = highlight.width !== undefined ? highlight.width : width * 0.8;
          const highlightHeight = highlight.height !== undefined ? highlight.height : 20;
          
          // Get highlight color (default: yellow)
          const color = highlight.color || { r: 1, g: 1, b: 0 }; // Yellow
          const highlightColor = [color.r || 1, color.g || 1, color.b || 0];
          
          // Create highlight annotation using low-level PDF structure
          // pdf-lib doesn't have direct highlight annotation support, so we use annotations
          const annotationDict = PDFDict.create(sourcePdf.context);
          
          // Set annotation type
          annotationDict.set(PDFName.of('Type'), PDFName.of('Annot'));
          annotationDict.set(PDFName.of('Subtype'), PDFName.of('Highlight')); // Highlight annotation type
          
          // Set rectangle (coordinates in PDF space - bottom-left origin)
          // Note: PDF coordinates start from bottom-left, so we need to convert
          const rectY = height - highlightY - highlightHeight; // Convert to bottom-left origin
          const rectArray = PDFArray.withContext(sourcePdf.context, [
            PDFNumber.of(highlightX),
            PDFNumber.of(rectY),
            PDFNumber.of(highlightX + highlightWidth),
            PDFNumber.of(rectY + highlightHeight)
          ]);
          annotationDict.set(PDFName.of('Rect'), rectArray);
          
          // Set highlight color (RGB values 0-1)
          const colorArray = PDFArray.withContext(sourcePdf.context, [
            PDFNumber.of(highlightColor[0]),
            PDFNumber.of(highlightColor[1]),
            PDFNumber.of(highlightColor[2])
          ]);
          annotationDict.set(PDFName.of('C'), colorArray);
          
          // Set quad points for text highlighting (corners of highlighted area)
          // QuadPoints define the quadrilateral region to highlight
          const quadPoints = PDFArray.withContext(sourcePdf.context, [
            PDFNumber.of(highlightX), PDFNumber.of(rectY + highlightHeight), // Top-left
            PDFNumber.of(highlightX + highlightWidth), PDFNumber.of(rectY + highlightHeight), // Top-right
            PDFNumber.of(highlightX), PDFNumber.of(rectY), // Bottom-left
            PDFNumber.of(highlightX + highlightWidth), PDFNumber.of(rectY) // Bottom-right
          ]);
          annotationDict.set(PDFName.of('QuadPoints'), quadPoints);
          
          // Set contents (optional text for the highlight)
          if (highlight.text) {
            annotationDict.set(PDFName.of('Contents'), PDFString.of(highlight.text));
          } else {
            annotationDict.set(PDFName.of('Contents'), PDFString.of('Highlighted text'));
          }
          
          // Set author if provided
          if (highlight.author) {
            annotationDict.set(PDFName.of('T'), PDFString.of(highlight.author));
          }
          
          // Set modification date
          const now = new Date();
          annotationDict.set(PDFName.of('M'), PDFString.of(`D:${now.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`));
          
          // Set border style (optional)
          const borderArray = PDFArray.withContext(sourcePdf.context, [
            PDFNumber.of(0), // Border width (0 for no border)
            PDFNumber.of(0),
            PDFNumber.of(0)
          ]);
          annotationDict.set(PDFName.of('BS'), PDFDict.create(sourcePdf.context));
          
          // Get or create annotations array for the page
          const pageDict = page.node;
          let annotsArray = pageDict.get(PDFName.of('Annots'));
          
          if (!annotsArray) {
            annotsArray = PDFArray.withContext(sourcePdf.context, []);
            pageDict.set(PDFName.of('Annots'), annotsArray);
          }
          
          // Add annotation reference to page
          const annotationRef = sourcePdf.context.register(annotationDict);
          annotsArray.push(annotationRef);
          
        } catch (highlightError) {
          console.warn(`Error adding highlight ${highlight.index} to page ${pageNum}:`, highlightError.message);
          // Continue with next highlight instead of failing entire operation
        }
      }
    }

    // Save the modified PDF
    const pdfBytes = await sourcePdf.save();
    return Buffer.from(pdfBytes);
    
  } catch (error) {
    if (error instanceof ConversionError) {
      throw error;
    }
    throw new ConversionError(`Failed to highlight PDF: ${error.message}`, error);
  }
}

/**
 * Get highlight statistics
 * @param {Array} highlights - Array of highlight objects
 * @returns {Object} - Statistics about highlights
 */
export function getHighlightStats(highlights = []) {
  if (!highlights || highlights.length === 0) {
    return {
      totalHighlights: 0,
      pagesWithHighlights: 0,
      highlightsByPage: {},
      colorsUsed: []
    };
  }

  const pagesWithHighlights = new Set(highlights.map(h => h.page)).size;
  const highlightsByPage = {};
  const colorsUsed = new Set();

  highlights.forEach(highlight => {
    const pageNum = highlight.page || 1;
    highlightsByPage[pageNum] = (highlightsByPage[pageNum] || 0) + 1;
    
    if (highlight.color) {
      const colorKey = `${highlight.color.r || 1},${highlight.color.g || 1},${highlight.color.b || 0}`;
      colorsUsed.add(colorKey);
    }
  });

  return {
    totalHighlights: highlights.length,
    pagesWithHighlights,
    highlightsByPage,
    colorsUsed: Array.from(colorsUsed)
  };
}


