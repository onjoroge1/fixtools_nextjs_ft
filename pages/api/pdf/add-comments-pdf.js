import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { addCommentsToPDF, getCommentsStats } from '../../../lib/pdf-server/converters/add-comments-pdf';
import { cleanupFiles, generateOutputFilename, validateFileType } from '../../../lib/pdf-server/utils/file-handler';
import { handleApiError, ValidationError } from '../../../lib/pdf-server/utils/error-handler';
import { checkPaymentRequirement, PRICING_CONFIG } from '../../../lib/config/pricing';
import { verifyProcessingPass } from '../../../lib/payments/payment-utils';

export const config = {
  api: {
    bodyParser: false,
    responseLimit: '50mb',
  },
};

/**
 * Get user plan from session ID
 * @param {string} sessionId - Session ID from localStorage
 * @returns {Object} - User plan object
 */
async function getUserPlanFromSession(sessionId) {
  if (sessionId) {
    // In a real app, verify session ID with Stripe or your DB
    // For now, assume day_pass if session ID is present
    try {
      const hasValidPass = await verifyProcessingPass(sessionId);
      if (hasValidPass) {
        return PRICING_CONFIG.plans.day_pass;
      }
    } catch (e) {
      // Invalid session
    }
  }
  return PRICING_CONFIG.plans.free;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let filesData = {};
  try {
    const tmpDir = path.join(process.cwd(), 'tmp');
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }

    const form = formidable({
      maxFileSize: PRICING_CONFIG.tools.pdf.paid.max_file_size_mb * 1024 * 1024, // 500MB for paid tier
      keepExtensions: true,
      uploadDir: tmpDir,
      multiples: true, // Enable multiple file uploads
    });

    const [fields, files] = await form.parse(req);
    const pdfFiles = files.pdf;
    filesData = files;

    if (!pdfFiles || (Array.isArray(pdfFiles) ? pdfFiles.length === 0 : !pdfFiles)) {
      throw new ValidationError('No PDF file(s) provided', 'pdf');
    }

    // Parse comments from fields
    let comments = [];
    try {
      if (fields.comments && fields.comments[0]) {
        comments = JSON.parse(fields.comments[0]);
      }
    } catch (parseError) {
      throw new ValidationError('Invalid comments format. Comments must be valid JSON.', 'comments');
    }

    if (!Array.isArray(comments) || comments.length === 0) {
      throw new ValidationError('No comments provided. Please provide at least one comment to add to the PDF.', 'comments');
    }

    // Calculate total file size and count
    const pdfFilesArray = Array.isArray(pdfFiles) ? pdfFiles : [pdfFiles];
    const totalFileSize = pdfFilesArray.reduce((sum, file) => sum + file.size, 0);
    const fileCount = pdfFilesArray.length;

    // Check payment requirement
    const userPlan = await getUserPlanFromSession(fields.sessionId?.[0]);
    const paymentRequirement = checkPaymentRequirement('pdf', totalFileSize, fileCount, userPlan === PRICING_CONFIG.plans.free ? 'free' : 'day_pass');

    if (paymentRequirement.requiresPayment) {
      const sessionId = fields.sessionId?.[0];
      const hasValidPass = await verifyProcessingPass(sessionId);

      if (!hasValidPass) {
        return res.status(402).json({
          error: 'Payment required',
          message: paymentRequirement.reason === 'file_size'
            ? `Total file size exceeds free limit. A Processing Pass is required.`
            : `Batch processing requires a Processing Pass.`,
          paymentRequired: true,
          reason: paymentRequirement.reason,
          fileSize: totalFileSize,
          fileCount: fileCount,
          requirement: paymentRequirement,
        });
      }
    }

    // Process each PDF file
    const processedFiles = [];
    const stats = [];

    for (const file of pdfFilesArray) {
      if (!validateFileType(file.originalFilename || '', ['.pdf'])) {
        throw new ValidationError('Invalid file type. Please upload a PDF document (.pdf).', 'pdf');
      }

      if (!fs.existsSync(file.filepath)) {
        throw new ValidationError('Uploaded file not found. Please try again.', 'pdf');
      }

      const pdfBuffer = fs.readFileSync(file.filepath);
      
      // For each PDF, apply all comments (or comments for that specific PDF if per-file comments are supported)
      // For now, we'll apply all comments to each PDF
      const modifiedPdfBuffer = await addCommentsToPDF(pdfBuffer, comments);

      const outputFilename = generateOutputFilename(
        file.originalFilename || 'document.pdf',
        '.pdf'
      ).replace('.pdf', '-with-comments.pdf');

      // Get statistics for this file
      const fileStats = getCommentsStats(comments);

      processedFiles.push({
        file: modifiedPdfBuffer.toString('base64'),
        filename: outputFilename,
        stats: fileStats,
      });

      stats.push(fileStats);
    }

    // Return results
    if (processedFiles.length === 1) {
      return res.status(200).json({
        success: true,
        file: processedFiles[0].file,
        filename: processedFiles[0].filename,
        stats: processedFiles[0].stats,
        message: 'Comments added to PDF successfully',
      });
    } else {
      return res.status(200).json({
        success: true,
        files: processedFiles,
        message: `${processedFiles.length} PDF file(s) processed successfully`,
      });
    }
  } catch (error) {
    return handleApiError(error, res);
  } finally {
    // Cleanup uploaded files
    if (filesData.pdf) {
      const filesToClean = Array.isArray(filesData.pdf) ? filesData.pdf : [filesData.pdf];
      filesToClean.forEach(file => {
        if (file.filepath) {
          cleanupFiles(file.filepath);
        }
      });
    }
  }
}


