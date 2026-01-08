/**
 * PDF to Excel Conversion API Route
 * Converts PDF files to Excel (.xlsx) format
 * 
 * POST /api/pdf/convert-to-excel
 * Body: FormData with 'pdf' file
 * Returns: { success: true, file: base64, filename: string }
 */

import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { convertPDFToExcel as convertPDF } from '../../../lib/pdf-server/converters/pdf-to-excel';
import { cleanupFiles, generateOutputFilename, validateFileType } from '../../../lib/pdf-server/utils/file-handler';
import { handleApiError, ValidationError } from '../../../lib/pdf-server/utils/error-handler';
import { checkPaymentRequirement, THRESHOLDS } from '../../../lib/payments/stripe-config';
import { verifyProcessingPass } from '../../../lib/payments/payment-utils';

export const config = {
  api: {
    bodyParser: false, // Disable default body parser for file uploads
    responseLimit: '50mb', // Allow larger responses
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      message: 'Only POST requests are supported' 
    });
  }

  let filesData = {}; // To store file info for cleanup
  try {
    // Ensure tmp directory exists
    const tmpDir = path.join(process.cwd(), 'tmp');
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }

    const form = formidable({
      maxFileSize: THRESHOLDS.MAX_PAID_FILE_SIZE, // Max file size for paid tier
      keepExtensions: true,
      uploadDir: tmpDir, // Temporary directory for uploads
    });

    const [fields, files] = await form.parse(req);
    const pdfFile = files.pdf?.[0];
    filesData = files; // Store for cleanup

    if (!pdfFile) {
      throw new ValidationError('No PDF file provided', 'pdf');
    }

    // Validate file type
    if (!validateFileType(pdfFile.originalFilename || '', ['.pdf'])) {
      throw new ValidationError('Invalid file type. Please upload a PDF file (.pdf).', 'pdf');
    }

    // Payment check
    const fileSize = pdfFile.size;
    const fileCount = files.pdf.length; // For batch processing
    const paymentRequirement = checkPaymentRequirement(fileSize, fileCount);

    if (paymentRequirement.requiresPayment) {
      const sessionId = fields.sessionId?.[0];
      const hasValidPass = await verifyProcessingPass(sessionId);

      if (!hasValidPass) {
        return res.status(402).json({
          error: 'Payment required',
          message: paymentRequirement.reason === 'file_size'
            ? `File size exceeds free limit (${THRESHOLDS.MAX_FREE_FILE_SIZE / (1024 * 1024)}MB). A Processing Pass is required.`
            : `Batch processing requires a Processing Pass.`,
          paymentRequired: true,
          reason: paymentRequirement.reason,
          fileSize: fileSize,
          fileCount: fileCount,
        });
      }
    }

    // Verify file exists and read it
    if (!fs.existsSync(pdfFile.filepath)) {
      throw new ValidationError('Uploaded file not found. Please try again.', 'pdf');
    }

    const pdfBuffer = fs.readFileSync(pdfFile.filepath);
    const excelBuffer = await convertPDF(pdfBuffer);

    // Clean up temp file after successful conversion
    cleanupFiles(pdfFile.filepath);

    const outputFilename = generateOutputFilename(
      pdfFile.originalFilename || 'document.pdf',
      '.xlsx'
    );

    return res.status(200).json({
      success: true,
      file: excelBuffer.toString('base64'),
      filename: outputFilename,
      message: 'PDF converted to Excel successfully',
    });
  } catch (error) {
    return handleApiError(error, res);
  } finally {
    // Ensure cleanup of temporary files
    if (filesData && filesData.pdf) {
      filesData.pdf.forEach(file => {
        if (file && file.filepath) {
          cleanupFiles(file.filepath);
        }
      });
    }
  }
}

