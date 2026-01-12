/**
 * PowerPoint to PDF Conversion API Route
 * Converts PowerPoint presentations to PDF format
 * 
 * POST /api/pdf/powerpoint-to-pdf
 * Body: FormData with 'powerpoint' file(s) for batch processing
 * Returns: { success: true, file: base64, filename: string } or { success: true, files: [...] } for batch
 */

import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { convertPowerPointToPDF as convertPowerPoint } from '../../../lib/pdf-server/converters/powerpoint-to-pdf';
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
    const powerpointFiles = files.powerpoint || [];
    filesData = files; // Store for cleanup

    if (!powerpointFiles || powerpointFiles.length === 0) {
      throw new ValidationError('No PowerPoint file provided', 'powerpoint');
    }

    // Validate file types
    for (const file of powerpointFiles) {
      if (!validateFileType(file.originalFilename || '', ['.pptx', '.ppt'])) {
        throw new ValidationError('Invalid file type. Please upload PowerPoint files (.pptx or .ppt).', 'powerpoint');
      }
    }

    // Calculate total size and file count
    const totalSize = powerpointFiles.reduce((sum, file) => sum + file.size, 0);
    const fileCount = powerpointFiles.length;

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
      // Single file conversion
      const powerpointFile = powerpointFiles[0];
      
      // Verify file exists and read it
      if (!fs.existsSync(powerpointFile.filepath)) {
        throw new ValidationError('Uploaded file not found. Please try again.', 'powerpoint');
      }

      const powerpointBuffer = fs.readFileSync(powerpointFile.filepath);
      const pdfBuffer = await convertPowerPoint(powerpointBuffer);

      const outputFilename = generateOutputFilename(
        powerpointFile.originalFilename || 'presentation.pptx',
        '.pdf'
      );

      // Clean up temp file after successful conversion
      cleanupFiles(powerpointFile.filepath);

      return res.status(200).json({
        success: true,
        file: pdfBuffer.toString('base64'),
        filename: outputFilename,
        message: 'PowerPoint file converted to PDF successfully',
      });
    } else {
      // Batch processing - convert all files and return as array
      const convertedFiles = [];
      
      for (const powerpointFile of powerpointFiles) {
        if (!fs.existsSync(powerpointFile.filepath)) {
          console.warn(`File not found: ${powerpointFile.filepath}`);
          continue;
        }

        try {
          const powerpointBuffer = fs.readFileSync(powerpointFile.filepath);
          const pdfBuffer = await convertPowerPoint(powerpointBuffer);

          const outputFilename = generateOutputFilename(
            powerpointFile.originalFilename || 'presentation.pptx',
            '.pdf'
          );

          convertedFiles.push({
            filename: outputFilename,
            file: pdfBuffer.toString('base64'),
          });

          // Clean up temp file
          cleanupFiles(powerpointFile.filepath);
        } catch (fileError) {
          console.error(`Error converting ${powerpointFile.originalFilename}:`, fileError);
          // Continue with other files
        }
      }

      if (convertedFiles.length === 0) {
        throw new ValidationError('Failed to convert any files. Please check your PowerPoint files and try again.', 'powerpoint');
      }

      return res.status(200).json({
        success: true,
        files: convertedFiles,
        message: `Successfully converted ${convertedFiles.length} of ${fileCount} PowerPoint files to PDF`,
        converted: convertedFiles.length,
        total: fileCount,
      });
    }
  } catch (error) {
    return handleApiError(error, res);
  } finally {
    // Ensure cleanup of temporary files
    if (filesData && filesData.powerpoint) {
      filesData.powerpoint.forEach(file => {
        if (file && file.filepath) {
          cleanupFiles(file.filepath);
        }
      });
    }
  }
}


