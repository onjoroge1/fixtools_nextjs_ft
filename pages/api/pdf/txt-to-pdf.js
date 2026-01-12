import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { convertTxtToPDF, getTxtToPdfStats } from '../../../lib/pdf-server/converters/txt-to-pdf';
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
    const txtFiles = files.txt || files.file; // Support both 'txt' and 'file' field names
    filesData = files;

    if (!txtFiles || (Array.isArray(txtFiles) ? txtFiles.length === 0 : !txtFiles)) {
      throw new ValidationError('No text file(s) provided. Please upload a .txt file.', 'txt');
    }

    // Calculate total file size and count
    const txtFilesArray = Array.isArray(txtFiles) ? txtFiles : [txtFiles];
    const totalFileSize = txtFilesArray.reduce((sum, file) => sum + file.size, 0);
    const fileCount = txtFilesArray.length;

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

    // Parse conversion options
    const options = {};
    if (fields.fontSize) options.fontSize = parseInt(fields.fontSize[0]) || 12;
    if (fields.pageSize) options.pageSize = fields.pageSize[0] || 'letter';
    if (fields.margin) options.margin = parseInt(fields.margin[0]) || 72;
    if (fields.lineHeight) options.lineHeight = parseFloat(fields.lineHeight[0]) || 1.5;

    // Process files
    const processFile = async (file) => {
      if (!validateFileType(file.originalFilename || '', ['.txt', '.text'])) {
        throw new ValidationError('Invalid file type. Please upload a text file (.txt).', 'txt');
      }
      if (!fs.existsSync(file.filepath)) {
        throw new ValidationError('Uploaded file not found. Please try again.', 'txt');
      }

      const txtBuffer = fs.readFileSync(file.filepath);
      const pdfBuffer = await convertTxtToPDF(txtBuffer, options);

      const outputFilename = generateOutputFilename(
        file.originalFilename || 'document.txt',
        '.pdf'
      ).replace(/\.txt$/i, '.pdf').replace(/\.text$/i, '.pdf');

      // Get statistics
      const stats = getTxtToPdfStats(txtBuffer);

      return {
        file: pdfBuffer.toString('base64'),
        filename: outputFilename,
        stats: stats,
      };
    };

    if (Array.isArray(txtFiles)) {
      // Batch processing
      const convertedFiles = await Promise.all(txtFilesArray.map(processFile));
      return res.status(200).json({
        success: true,
        files: convertedFiles,
        message: `Converted ${txtFilesArray.length} text file(s) to PDF successfully`,
      });
    } else {
      // Single file
      const convertedFile = await processFile(txtFiles);
      return res.status(200).json({
        success: true,
        file: convertedFile.file,
        filename: convertedFile.filename,
        stats: convertedFile.stats,
        message: 'Text file converted to PDF successfully',
      });
    }
  } catch (error) {
    return handleApiError(error, res);
  } finally {
    if (filesData.txt || filesData.file) {
      const filesToClean = Array.isArray(filesData.txt || filesData.file) 
        ? (filesData.txt || filesData.file) 
        : [filesData.txt || filesData.file];
      await cleanupFiles(filesToClean);
    }
  }
}

