/**
 * Excel to PDF Converter
 * Converts Excel spreadsheets (.xlsx, .xls) to PDF format
 * Uses xlsx for Excel parsing and pdf-lib for PDF creation
 */

import * as XLSX from 'xlsx';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { ConversionError } from '../utils/error-handler.js';

/**
 * Convert Excel buffer to PDF
 * @param {Buffer} excelBuffer - Excel file buffer
 * @param {Object} options - Conversion options
 * @returns {Promise<Buffer>} - PDF buffer
 */
export async function convertExcelToPDF(excelBuffer, options = {}) {
  try {
    // Parse Excel workbook
    const workbook = XLSX.read(excelBuffer, { type: 'buffer' });
    
    if (!workbook || !workbook.SheetNames || workbook.SheetNames.length === 0) {
      throw new ConversionError('Invalid Excel file. The file may be corrupted or empty.');
    }

    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    
    // Add fonts
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    // Process each sheet
    for (let sheetIndex = 0; sheetIndex < workbook.SheetNames.length; sheetIndex++) {
      const sheetName = workbook.SheetNames[sheetIndex];
      const worksheet = workbook.Sheets[sheetName];
      
      // Convert sheet to JSON array
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
        header: 1, 
        defval: '',
        raw: false 
      });
      
      if (!jsonData || jsonData.length === 0) {
        continue; // Skip empty sheets
      }

      // Create a new page for this sheet
      const page = pdfDoc.addPage([612, 792]); // US Letter size
      const { width, height } = page.getSize();
      
      // Page margins
      const margin = 50;
      const contentWidth = width - (margin * 2);
      const contentHeight = height - (margin * 2);
      
      // Calculate cell dimensions
      const maxCols = Math.max(...jsonData.map(row => row.length));
      const cellWidth = contentWidth / Math.max(maxCols, 1);
      const cellHeight = 20;
      const fontSize = 10;
      
      // Draw sheet name as header
      page.drawText(sheetName, {
        x: margin,
        y: height - margin - 20,
        size: 14,
        font: boldFont,
        color: rgb(0, 0, 0),
      });
      
      // Draw table data
      let yPosition = height - margin - 50;
      const startY = yPosition;
      
      for (let rowIndex = 0; rowIndex < jsonData.length; rowIndex++) {
        const row = jsonData[rowIndex];
        
        // Check if we need a new page
        if (yPosition < margin + cellHeight) {
          const newPage = pdfDoc.addPage([612, 792]);
          yPosition = newPage.getSize().height - margin - 50;
          
          // Redraw header on new page
          newPage.drawText(sheetName, {
            x: margin,
            y: newPage.getSize().height - margin - 20,
            size: 14,
            font: boldFont,
            color: rgb(0, 0, 0),
          });
        }
        
        // Draw row cells
        for (let colIndex = 0; colIndex < row.length; colIndex++) {
          const cellValue = String(row[colIndex] || '').substring(0, 50); // Limit cell text length
          const xPosition = margin + (colIndex * cellWidth);
          
          // Draw cell border (simple rectangle)
          page.drawRectangle({
            x: xPosition,
            y: yPosition - cellHeight,
            width: cellWidth,
            height: cellHeight,
            borderColor: rgb(0.8, 0.8, 0.8),
            borderWidth: 0.5,
          });
          
          // Draw cell text
          if (cellValue) {
            try {
              page.drawText(cellValue, {
                x: xPosition + 2,
                y: yPosition - cellHeight + 5,
                size: fontSize,
                font: rowIndex === 0 ? boldFont : font, // Bold header row
                color: rgb(0, 0, 0),
                maxWidth: cellWidth - 4,
              });
            } catch (textError) {
              // Skip text that can't be rendered
              console.warn(`Could not render cell text: ${cellValue}`);
            }
          }
        }
        
        yPosition -= cellHeight;
      }
    }

    // If no pages were created, create a page with error message
    if (pdfDoc.getPageCount() === 0) {
      const page = pdfDoc.addPage([612, 792]);
      page.drawText('No data found in Excel file.', {
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

    // Handle xlsx-specific errors
    if (error.message && error.message.includes('Cannot read')) {
      throw new ConversionError('Invalid Excel file format. Please ensure the file is a valid .xlsx or .xls file.');
    }

    throw new ConversionError(
      `Failed to convert Excel to PDF: ${error.message}`,
      error
    );
  }
}


