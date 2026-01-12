/**
 * PDF to Excel Converter
 * Converts PDF documents to Excel (.xlsx) format
 * Extracts tables and data from PDFs
 */

import pdfParse from 'pdf-parse';
import * as XLSX from 'xlsx';
import { ConversionError } from '../utils/error-handler.js';

/**
 * Detect and extract tables from PDF text
 * @param {string} text - PDF text content
 * @returns {Array} - Array of tables (2D arrays)
 */
function extractTables(text) {
  const tables = [];
  const lines = text.split('\n').filter(line => line.trim().length > 0);

  // Simple table detection: look for lines with multiple columns (separated by spaces/tabs)
  let currentTable = [];
  let previousColumnCount = 0;

  for (const line of lines) {
    // Split by multiple spaces or tabs
    const columns = line.split(/\s{2,}|\t+/).filter(col => col.trim().length > 0);
    
    if (columns.length >= 2) {
      // Potential table row
      if (previousColumnCount === 0 || previousColumnCount === columns.length) {
        // Same number of columns as previous row, likely part of same table
        currentTable.push(columns.map(col => col.trim()));
        previousColumnCount = columns.length;
      } else {
        // Different column count, start new table
        if (currentTable.length > 0) {
          tables.push(currentTable);
        }
        currentTable = [columns.map(col => col.trim())];
        previousColumnCount = columns.length;
      }
    } else {
      // Not a table row, finalize current table if it exists
      if (currentTable.length > 0) {
        tables.push(currentTable);
        currentTable = [];
        previousColumnCount = 0;
      }
    }
  }

  // Add last table if exists
  if (currentTable.length > 0) {
    tables.push(currentTable);
  }

  return tables;
}

/**
 * Convert PDF buffer to Excel workbook
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @param {Object} options - Conversion options
 * @returns {Promise<Buffer>} - Excel file buffer
 */
export async function convertPDFToExcel(pdfBuffer, options = {}) {
  try {
    // Extract text from PDF using pdf-parse
    const pdfData = await pdfParse(pdfBuffer);
    
    if (!pdfData || !pdfData.text) {
      throw new ConversionError('Failed to extract text from PDF. The PDF may be image-based or corrupted.');
    }

    const text = pdfData.text;
    const pages = pdfData.numpages || 1;

    // Try to extract tables
    const tables = extractTables(text);

    // Create Excel workbook
    const workbook = XLSX.utils.book_new();

    if (tables.length > 0) {
      // If tables were detected, create a sheet for each table
      tables.forEach((table, index) => {
        // Ensure all rows have the same number of columns
        const maxColumns = Math.max(...table.map(row => row.length));
        const normalizedTable = table.map(row => {
          const normalizedRow = [...row];
          while (normalizedRow.length < maxColumns) {
            normalizedRow.push('');
          }
          return normalizedRow;
        });

        const worksheet = XLSX.utils.aoa_to_sheet(normalizedTable);
        const sheetName = tables.length === 1 ? 'Sheet1' : `Table ${index + 1}`;
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
      });
    } else {
      // No tables detected, create a single sheet with all text
      // Split text into rows (by lines)
      const rows = text.split('\n').filter(line => line.trim().length > 0);
      
      // Create a single column with all text
      const data = rows.map(row => [row.trim()]);
      
      // Add header
      data.unshift(['Extracted Text from PDF']);

      const worksheet = XLSX.utils.aoa_to_sheet(data);
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    }

    // Generate Excel file buffer
    const excelBuffer = XLSX.write(workbook, { 
      type: 'buffer', 
      bookType: 'xlsx',
      compression: true 
    });

    return Buffer.from(excelBuffer);
  } catch (error) {
    if (error instanceof ConversionError) {
      throw error;
    }

    // Handle pdf-parse specific errors
    if (error.message && error.message.includes('Invalid PDF')) {
      throw new ConversionError('Invalid PDF structure. The file may be corrupted.');
    }

    throw new ConversionError(
      `Failed to convert PDF to Excel: ${error.message}`,
      error
    );
  }
}

/**
 * Extract text from PDF
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @returns {Promise<string>} - Extracted text content
 */
export async function extractTextFromPDF(pdfBuffer) {
  try {
    const pdfData = await pdfParse(pdfBuffer);
    return pdfData.text || '';
  } catch (error) {
    throw new ConversionError(
      `Failed to extract text from PDF: ${error.message}`,
      error
    );
  }
}


