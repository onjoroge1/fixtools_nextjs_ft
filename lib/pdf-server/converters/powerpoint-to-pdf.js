/**
 * PowerPoint to PDF Converter
 * Converts PowerPoint presentations (.pptx) to PDF format
 * Uses JSZip for PPTX parsing and pdf-lib for PDF creation
 * 
 * Note: PPTX files are ZIP archives containing XML files
 */

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { ConversionError } from '../utils/error-handler.js';

/**
 * Simple XML text extractor (basic implementation)
 * Extracts text content from XML string
 */
function extractTextFromXML(xmlString) {
  if (!xmlString) return '';
  
  // Remove XML tags and extract text content
  let text = xmlString
    .replace(/<[^>]+>/g, ' ') // Remove XML tags
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x([0-9A-Fa-f]+);/g, (match, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
  
  return text;
}

/**
 * Parse PPTX file (ZIP archive) and extract slide content
 * @param {Buffer} pptxBuffer - PowerPoint file buffer
 * @returns {Promise<Array>} - Array of slide text content
 */
async function parsePPTX(pptxBuffer) {
  try {
    // PPTX is a ZIP file, but we'll use a simpler approach
    // For now, we'll create a basic converter that extracts what it can
    
    // Try to use JSZip if available
    let JSZip;
    try {
      const jszipModule = await import('jszip');
      JSZip = jszipModule.default || jszipModule;
    } catch (e) {
      // JSZip not available
      throw new ConversionError('PowerPoint parsing requires JSZip library. Please install jszip: npm install jszip');
    }

    const zip = await JSZip.loadAsync(pptxBuffer);
    const slides = [];
    
    // PPTX structure: ppt/slides/slide1.xml, slide2.xml, etc.
    const slideFiles = Object.keys(zip.files).filter(name => 
      name.startsWith('ppt/slides/slide') && name.endsWith('.xml')
    ).sort((a, b) => {
      // Sort by slide number
      const numA = parseInt(a.match(/slide(\d+)/)?.[1] || '0');
      const numB = parseInt(b.match(/slide(\d+)/)?.[1] || '0');
      return numA - numB;
    });

    if (slideFiles.length === 0) {
      throw new ConversionError('No slides found in PowerPoint file. The file may be corrupted or empty.');
    }

    // Extract text from each slide
    for (const slideFile of slideFiles) {
      try {
        const slideXml = await zip.files[slideFile].async('string');
        const slideText = extractTextFromXML(slideXml);
        slides.push({
          number: slides.length + 1,
          text: slideText || `Slide ${slides.length + 1}`,
        });
      } catch (slideError) {
        // If we can't parse a slide, add a placeholder
        slides.push({
          number: slides.length + 1,
          text: `Slide ${slides.length + 1}`,
        });
      }
    }

    return slides;
  } catch (error) {
    if (error instanceof ConversionError) {
      throw error;
    }
    throw new ConversionError(
      `Failed to parse PowerPoint file: ${error.message}`,
      error
    );
  }
}

/**
 * Convert PowerPoint buffer to PDF
 * @param {Buffer} pptxBuffer - PowerPoint file buffer
 * @param {Object} options - Conversion options
 * @returns {Promise<Buffer>} - PDF buffer
 */
export async function convertPowerPointToPDF(pptxBuffer, options = {}) {
  try {
    // Parse PowerPoint file
    const slides = await parsePPTX(pptxBuffer);
    
    if (!slides || slides.length === 0) {
      throw new ConversionError('No extractable content found in PowerPoint file.');
    }

    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    
    // Add fonts
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    // Process each slide
    for (const slide of slides) {
      // Create a new page for this slide (landscape for presentations)
      const page = pdfDoc.addPage([792, 612]); // Landscape: 11x8.5 inches
      const { width, height } = page.getSize();
      
      // Page margins
      const margin = 72; // 1 inch
      const contentWidth = width - (margin * 2);
      const contentHeight = height - (margin * 2);
      
      // Draw slide number/title
      const slideTitle = `Slide ${slide.number}`;
      page.drawText(slideTitle, {
        x: margin,
        y: height - margin - 30,
        size: 18,
        font: boldFont,
        color: rgb(0, 0, 0),
      });
      
      // Draw slide content
      if (slide.text && slide.text.trim()) {
        const lines = slide.text.split(/\n+/).filter(line => line.trim());
        const fontSize = 12;
        const lineHeight = fontSize * 1.5;
        let yPosition = height - margin - 60;
        
        for (const line of lines) {
          if (yPosition < margin + lineHeight) {
            // Need a new page for this slide
            const newPage = pdfDoc.addPage([792, 612]);
            yPosition = newPage.getSize().height - margin - 30;
            
            // Redraw slide title on new page
            newPage.drawText(slideTitle, {
              x: margin,
              y: newPage.getSize().height - margin - 30,
              size: 18,
              font: boldFont,
              color: rgb(0, 0, 0),
            });
            yPosition -= 30;
          }
          
          // Sanitize text for PDF rendering
          const sanitizedLine = line
            .split('')
            .map(char => {
              const charCode = char.charCodeAt(0);
              // Only include printable ASCII and common Unicode
              if (charCode < 0x20 && charCode !== 0x09 && charCode !== 0x0A && charCode !== 0x0D) {
                return '';
              }
              if (charCode > 0xFF) {
                // Replace common Unicode with ASCII
                const replacements = {
                  '\u2013': '-',
                  '\u2014': '--',
                  '\u2026': '...',
                  '\u201C': '"',
                  '\u201D': '"',
                  '\u2018': "'",
                  '\u2019': "'",
                };
                return replacements[char] || '?';
              }
              return char;
            })
            .join('')
            .substring(0, 100); // Limit line length
          
          try {
            page.drawText(sanitizedLine, {
              x: margin,
              y: yPosition,
              size: fontSize,
              font: font,
              color: rgb(0, 0, 0),
              maxWidth: contentWidth,
            });
          } catch (textError) {
            // Skip text that can't be rendered
            console.warn(`Could not render slide text: ${sanitizedLine}`);
          }
          
          yPosition -= lineHeight;
        }
      } else {
        // Empty slide - just show slide number
        page.drawText('(Empty slide)', {
          x: margin,
          y: height / 2,
          size: 14,
          font: font,
          color: rgb(0.5, 0.5, 0.5),
        });
      }
    }

    // If no pages were created, create a page with error message
    if (pdfDoc.getPageCount() === 0) {
      const page = pdfDoc.addPage([792, 612]);
      page.drawText('No content found in PowerPoint file.', {
        x: 50,
        y: 400,
        size: 12,
        font: font,
        color: rgb(0, 0, 0),
      });
    }

    // Save PDF
    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
  } catch (error) {
    if (error instanceof ConversionError) {
      throw error;
    }

    throw new ConversionError(
      `Failed to convert PowerPoint to PDF: ${error.message}`,
      error
    );
  }
}

