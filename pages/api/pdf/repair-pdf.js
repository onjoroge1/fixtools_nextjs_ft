/**
 * PDF Repair API Route
 * Repairs corrupted or damaged PDF files
 * 
 * POST /api/pdf/repair-pdf
 * Body: FormData with 'pdf' file(s) for batch processing
 * Returns: { success: true, file: base64, filename: string } or { success: true, files: [...] } for batch
 */

import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { repairPDF } from '../../../lib/pdf-server/converters/repair-pdf';
import { cleanupFiles, generateOutputFilename, validateFileType } from '../../../lib/pdf-server/utils/file-handler';
import { handleApiError, ValidationError } from '../../../lib/pdf-server/utils/error-handler';
import { checkPaymentRequirement as checkPaymentRequirementNew, getUserPlan, hasValidProcessingPass } from '../../../lib/config/pricing';
import { PRICING_CONFIG } from '../../../lib/config/pricing';

export const config = {
  api: {
    bodyParser: false, // Disable default body parser for file uploads
    responseLimit: '50mb', // Allow larger responses
  },
};

/**
 * Verify processing pass from session ID
 * @param {string} sessionId - Stripe session ID
 * @returns {Promise<boolean>} - True if pass is valid
 */
async function verifyProcessingPass(sessionId) {
  if (!sessionId) return false;
  
  // In a real implementation, you'd verify this against a database
  // For now, we'll check if it's a valid format
  // The actual verification happens client-side via localStorage
  return sessionId && sessionId.startsWith('cs_');
}

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

    const pdfLimits = PRICING_CONFIG.tools.pdf;
    const maxFileSize = pdfLimits.paid.max_file_size_mb * 1024 * 1024;

    const form = formidable({
      maxFileSize: maxFileSize, // Max file size for paid tier
      keepExtensions: true,
      uploadDir: tmpDir, // Temporary directory for uploads
      multiples: true, // Allow multiple files for batch processing
    });

    const [fields, files] = await form.parse(req);
    const pdfFiles = files.pdf || [];
    filesData = files; // Store for cleanup

    if (!pdfFiles || pdfFiles.length === 0) {
      throw new ValidationError('No PDF file provided', 'pdf');
    }

    // Validate file types
    for (const file of pdfFiles) {
      if (!validateFileType(file.originalFilename || '', ['.pdf'])) {
        throw new ValidationError('Invalid file type. Please upload PDF files (.pdf).', 'pdf');
      }
    }

    // Calculate total size and file count
    const totalSize = pdfFiles.reduce((sum, file) => sum + file.size, 0);
    const fileCount = pdfFiles.length;

    // Get user plan from session ID
    const sessionId = fields.sessionId?.[0];
    let userPlan = 'free';
    
    // In production, you'd verify the session ID against a database
    // For now, if sessionId exists and is valid format, assume day_pass
    if (sessionId && verifyProcessingPass(sessionId)) {
      userPlan = 'day_pass';
    }

    // Payment check using centralized config
    const paymentRequirement = checkPaymentRequirementNew('pdf', totalSize, fileCount, userPlan);

    if (paymentRequirement.requiresPayment) {
      return res.status(402).json({
        error: 'Payment required',
        message: paymentRequirement.reason === 'file_size'
          ? `Total file size (${(totalSize / (1024 * 1024)).toFixed(2)}MB) exceeds free limit (${(paymentRequirement.maxFreeSize / (1024 * 1024)).toFixed(0)}MB). A Processing Pass is required.`
          : `Batch processing (${fileCount} files) requires a Processing Pass. Free tier allows ${paymentRequirement.maxFreeBatch} file at a time.`,
        paymentRequired: true,
        reason: paymentRequirement.reason,
        fileSize: totalSize,
        fileCount: fileCount,
        requirement: paymentRequirement,
      });
    }

    // Process files (single or batch)
    if (fileCount === 1) {
      // Single file repair
      const pdfFile = pdfFiles[0];
      
      // Verify file exists and read it
      if (!fs.existsSync(pdfFile.filepath)) {
        throw new ValidationError('Uploaded file not found. Please try again.', 'pdf');
      }

      const pdfBuffer = fs.readFileSync(pdfFile.filepath);
      const repairedBuffer = await repairPDF(pdfBuffer);

      const originalFilename = pdfFile.originalFilename || 'document.pdf';
      const ext = path.extname(originalFilename);
      const baseName = originalFilename.replace(ext, '');
      const outputFilename = `${baseName}-repaired${ext}`;

      // Clean up temp file after successful repair
      cleanupFiles(pdfFile.filepath);

      return res.status(200).json({
        success: true,
        file: repairedBuffer.toString('base64'),
        filename: outputFilename,
        message: 'PDF file repaired successfully',
      });
    } else {
      // Batch processing - repair all files and return as array
      const repairedFiles = [];
      
      for (const pdfFile of pdfFiles) {
        if (!fs.existsSync(pdfFile.filepath)) {
          console.warn(`File not found: ${pdfFile.filepath}`);
          continue;
        }

        try {
          const pdfBuffer = fs.readFileSync(pdfFile.filepath);
          const repairedBuffer = await repairPDF(pdfBuffer);

          const originalFilename = pdfFile.originalFilename || 'document.pdf';
          const ext = path.extname(originalFilename);
          const baseName = originalFilename.replace(ext, '');
          const outputFilename = `${baseName}-repaired${ext}`;

          repairedFiles.push({
            filename: outputFilename,
            file: repairedBuffer.toString('base64'),
          });

          // Clean up temp file
          cleanupFiles(pdfFile.filepath);
        } catch (fileError) {
          console.error(`Error repairing ${pdfFile.originalFilename}:`, fileError);
          // Continue with other files
        }
      }

      if (repairedFiles.length === 0) {
        throw new ValidationError('Failed to repair any files. Please check your PDF files and try again.', 'pdf');
      }

      return res.status(200).json({
        success: true,
        files: repairedFiles,
        message: `Successfully repaired ${repairedFiles.length} of ${fileCount} PDF files`,
        repaired: repairedFiles.length,
        total: fileCount,
      });
    }
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

