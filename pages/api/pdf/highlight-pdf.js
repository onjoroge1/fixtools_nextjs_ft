import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { highlightPDF, getHighlightStats } from '../../../lib/pdf-server/converters/highlight-pdf';
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
      multiples: true, // Enable multiple file uploads for batch
    });

    const [fields, files] = await form.parse(req);
    const pdfFiles = files.pdf;
    const highlightsData = fields.highlights ? JSON.parse(fields.highlights[0]) : [];
    filesData = files;

    if (!pdfFiles || (Array.isArray(pdfFiles) ? pdfFiles.length === 0 : !pdfFiles)) {
      throw new ValidationError('No PDF file(s) provided', 'pdf');
    }
    if (!highlightsData || highlightsData.length === 0) {
      throw new ValidationError('No highlights provided. Please provide at least one highlight to add to the PDF.', 'highlights');
    }

    // Calculate total file size and count
    const pdfFilesArray = Array.isArray(pdfFiles) ? pdfFiles : [pdfFiles];
    const totalFileSize = pdfFilesArray.reduce((sum, file) => sum + file.size, 0);
    const fileCount = pdfFilesArray.length;

    // Check payment requirement
    const sessionId = fields.sessionId?.[0];
    const userPlan = await getUserPlanFromSession(sessionId);
    const paymentRequirement = checkPaymentRequirement('pdf', totalFileSize, fileCount, userPlan === PRICING_CONFIG.plans.day_pass ? 'day_pass' : 'free');

    if (paymentRequirement.requiresPayment) {
      const hasValidPass = await verifyProcessingPass(sessionId);

      if (!hasValidPass) {
        return res.status(402).json({
          error: 'Payment required',
          message: paymentRequirement.reason === 'file_size'
            ? `Total file size (${(totalFileSize / 1024 / 1024).toFixed(2)}MB) exceeds free limit of ${(paymentRequirement.maxFreeSize / 1024 / 1024).toFixed(0)}MB. A Processing Pass is required.`
            : `Batch processing ${fileCount} files requires a Processing Pass. Free tier allows ${paymentRequirement.maxFreeBatch} file at a time.`,
          paymentRequired: true,
          reason: paymentRequirement.reason,
          fileSize: totalFileSize,
          fileCount: fileCount,
          requirement: paymentRequirement,
        });
      }
    }

    // Process files
    const processFile = async (file) => {
      if (!validateFileType(file.originalFilename || '', ['.pdf'])) {
        throw new ValidationError('Invalid file type. Please upload a PDF document (.pdf).', 'pdf');
      }
      if (!fs.existsSync(file.filepath)) {
        throw new ValidationError('Uploaded file not found. Please try again.', 'pdf');
      }

      const pdfBuffer = fs.readFileSync(file.filepath);
      const highlightedPdfBuffer = await highlightPDF(pdfBuffer, highlightsData);

      const outputFilename = generateOutputFilename(
        file.originalFilename || 'document.pdf',
        '.pdf'
      ).replace('.pdf', '-highlighted.pdf');

      return {
        file: highlightedPdfBuffer.toString('base64'),
        filename: outputFilename,
      };
    };

    // Get highlight statistics
    const stats = getHighlightStats(highlightsData);

    if (Array.isArray(pdfFiles)) {
      // Batch processing
      const highlightedFiles = await Promise.all(pdfFiles.map(processFile));
      // Add stats to each file object
      const filesWithStats = highlightedFiles.map(file => ({
        ...file,
        stats: stats
      }));
      return res.status(200).json({
        success: true,
        files: filesWithStats,
        stats: stats,
        message: `Highlights added to ${pdfFiles.length} PDF document(s) successfully`,
      });
    } else {
      // Single file
      const highlightedFile = await processFile(pdfFiles);
      return res.status(200).json({
        success: true,
        file: highlightedFile.file,
        filename: highlightedFile.filename,
        stats: stats,
        message: 'Highlights added to PDF document successfully',
      });
    }
  } catch (error) {
    return handleApiError(error, res);
  } finally {
    if (filesData.pdf) {
      const filesToClean = Array.isArray(filesData.pdf) ? filesData.pdf : [filesData.pdf];
      filesToClean.forEach(file => cleanupFiles(file.filepath));
    }
  }
}


