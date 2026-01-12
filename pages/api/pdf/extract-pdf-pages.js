import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { extractPDFPages, getExtractPagesStats, parsePageRange } from '../../../lib/pdf-server/converters/extract-pdf-pages';
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
    const pagesToExtract = fields.pagesToExtract?.[0]; // Page range string (e.g., "1-3,5,7-9")
    filesData = files;

    if (!pdfFiles || (Array.isArray(pdfFiles) ? pdfFiles.length === 0 : !pdfFiles)) {
      throw new ValidationError('No PDF file(s) provided. Please upload a PDF file.', 'pdf');
    }

    if (!pagesToExtract || !pagesToExtract.trim()) {
      throw new ValidationError('No pages specified for extraction. Please provide page numbers or ranges to extract (e.g., "1-3,5,7-9").', 'pagesToExtract');
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
      
      // Get page count first to validate page range
      const { PDFDocument } = await import('pdf-lib');
      const tempPdf = await PDFDocument.load(pdfBuffer);
      const pageCount = tempPdf.getPageCount();
      
      // Validate page range early for better error messages
      try {
        parsePageRange(pagesToExtract, pageCount);
      } catch (parseError) {
        // If parsePageRange throws ConversionError, extract message for ValidationError
        const errorMessage = parseError.message || 'Invalid page range format.';
        throw new ValidationError(errorMessage, 'pagesToExtract');
      }

      // Extract pages (pass string, function will parse internally)
      let extractedPdfBuffer;
      try {
        extractedPdfBuffer = await extractPDFPages(pdfBuffer, pagesToExtract);
      } catch (extractError) {
        // Convert ConversionError to ValidationError for consistent API responses
        if (extractError instanceof ConversionError || extractError.message) {
          throw new ValidationError(extractError.message || 'Failed to extract pages from PDF.', 'pagesToExtract');
        }
        throw extractError;
      }

      // Get statistics
      const stats = getExtractPagesStats(pageCount, pagesToExtract);

      const outputFilename = generateOutputFilename(
        file.originalFilename || 'document.pdf',
        '.pdf'
      ).replace('.pdf', '-extracted.pdf');

      return {
        file: extractedPdfBuffer.toString('base64'),
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
        message: `Pages extracted from ${pdfFilesArray.length} PDF document(s) successfully`,
      });
    } else {
      // Single file
      const processedFile = await processFile(pdfFiles);
      return res.status(200).json({
        success: true,
        file: processedFile.file,
        filename: processedFile.filename,
        stats: processedFile.stats,
        message: 'Pages extracted from PDF successfully',
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

