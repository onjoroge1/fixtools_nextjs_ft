import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { unlockPDF, getUnlockStats } from '../../../lib/pdf-server/converters/unlock-pdf';
import { cleanupFiles, generateOutputFilename, validateFileType } from '../../../lib/pdf-server/utils/file-handler';
import { handleApiError, ValidationError, ConversionError } from '../../../lib/pdf-server/utils/error-handler';
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
    const pdfFiles = files.pdf || files.file; // Support both 'pdf' and 'file' field names
    const password = fields.password?.[0]; // Password to unlock PDFs
    filesData = files;

    if (!pdfFiles || (Array.isArray(pdfFiles) ? pdfFiles.length === 0 : !pdfFiles)) {
      throw new ValidationError('No PDF file(s) provided. Please upload a PDF file.', 'pdf');
    }

    if (!password || !password.trim()) {
      throw new ValidationError('Password is required to unlock PDF files. Please provide the password.', 'password');
    }

    // Calculate total file size and count
    const pdfFilesArray = Array.isArray(pdfFiles) ? pdfFiles : [pdfFiles];
    const totalFileSize = pdfFilesArray.reduce((sum, file) => sum + file.size, 0);
    const fileCount = pdfFilesArray.length;

    // Check payment requirement
    const sessionId = fields.sessionId?.[0];
    const userPlan = await getUserPlanFromSession(sessionId);
    const planName = userPlan === PRICING_CONFIG.plans.day_pass ? 'day_pass' : 'free';
    const paymentRequirement = checkPaymentRequirement('pdf', totalFileSize, fileCount, planName);

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
      
      // Unlock PDF (pass password, function will use it internally)
      let unlockedPdfBuffer;
      try {
        unlockedPdfBuffer = await unlockPDF(pdfBuffer, password.trim());
      } catch (unlockError) {
        // Convert ConversionError to ValidationError for consistent API responses
        if (unlockError instanceof ConversionError || unlockError.message) {
          throw new ValidationError(unlockError.message || 'Failed to unlock PDF. Please check your password.', 'password');
        }
        throw unlockError;
      }

      // Get statistics
      const { PDFDocument } = await import('pdf-lib');
      const tempPdf = await PDFDocument.load(unlockedPdfBuffer);
      const pageCount = tempPdf.getPageCount();
      const stats = getUnlockStats(pageCount);

      const outputFilename = generateOutputFilename(
        file.originalFilename || 'document.pdf',
        '.pdf'
      ).replace('.pdf', '-unlocked.pdf');

      return {
        file: unlockedPdfBuffer.toString('base64'),
        filename: outputFilename,
        stats: stats,
      };
    };

    if (Array.isArray(pdfFiles)) {
      // Batch processing
      const processedFiles = await Promise.all(pdfFilesArray.map(processFile));
      return res.status(200).json({
        success: true,
        files: processedFiles,
        message: `Unlocked ${pdfFilesArray.length} PDF document(s) successfully`,
      });
    } else {
      // Single file
      const processedFile = await processFile(pdfFiles);
      return res.status(200).json({
        success: true,
        file: processedFile.file,
        filename: processedFile.filename,
        stats: processedFile.stats,
        message: 'PDF unlocked successfully',
      });
    }
  } catch (error) {
    return handleApiError(error, res);
  } finally {
    if (filesData.pdf || filesData.file) {
      const filesToClean = Array.isArray(filesData.pdf || filesData.file) 
        ? (filesData.pdf || filesData.file) 
        : [filesData.pdf || filesData.file];
      await cleanupFiles(filesToClean);
    }
  }
}

