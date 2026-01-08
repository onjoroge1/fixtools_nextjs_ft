/**
 * PDF to Word Conversion API Route
 * Converts PDF files to editable Word (.docx) format
 * 
 * POST /api/pdf/convert-to-word
 * Body: FormData with 'pdf' file
 * Returns: { success: true, file: base64, filename: string }
 */

import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { convertPDFToWord as convertPDF } from '../../../lib/pdf-server/converters/pdf-to-word';
import { cleanupFiles, generateOutputFilename, validateFileType } from '../../../lib/pdf-server/utils/file-handler';
import { handleApiError, ValidationError } from '../../../lib/pdf-server/utils/error-handler';

export const config = {
  api: {
    bodyParser: false, // Disable default body parser for file uploads
    responseLimit: '50mb', // Allow larger responses
  },
};

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      message: 'Only POST requests are supported' 
    });
  }

  try {
    // Parse multipart form data
    const form = formidable({
      maxFileSize: 50 * 1024 * 1024, // 50MB max file size
      keepExtensions: true,
    });

    const [fields, files] = await form.parse(req);
    const pdfFile = files.pdf?.[0];

    if (!pdfFile) {
      return res.status(400).json({ 
        error: 'No PDF file provided',
        message: 'Please upload a PDF file' 
      });
    }

    // Validate file type
    const fileExtension = path.extname(pdfFile.originalFilename || '').toLowerCase();
    if (fileExtension !== '.pdf') {
      cleanupFiles(pdfFile.filepath);
      return res.status(400).json({ 
        error: 'Invalid file type',
        message: 'Please upload a PDF file (.pdf)' 
      });
    }

    // Read PDF file
    const pdfBuffer = fs.readFileSync(pdfFile.filepath);
    
    // Convert PDF to Word using converter module
    const docxBuffer = await convertPDF(pdfBuffer);

    // Clean up temp file
    cleanupFiles(pdfFile.filepath);

    // Generate output filename
    const outputFilename = generateOutputFilename(
      pdfFile.originalFilename || 'document.pdf',
      '.docx'
    );

    // Return Word document as base64
    return res.status(200).json({
      success: true,
      file: docxBuffer.toString('base64'),
      filename: outputFilename,
      message: 'PDF converted to Word successfully',
    });
  } catch (error) {
    // Clean up temp files on error
    if (files && files.pdf) {
      files.pdf.forEach(file => {
        if (file && file.filepath) {
          cleanupFiles(file.filepath);
        }
      });
    }

    return handleApiError(error, res);
  }
}

