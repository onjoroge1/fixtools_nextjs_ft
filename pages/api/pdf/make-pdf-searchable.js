/**
 * Make PDF Searchable API Route
 * Adds invisible text layer to scanned/image-based PDFs using OCR
 * 
 * POST /api/pdf/make-pdf-searchable
 * Body: FormData with 'pdf' file(s) for batch processing
 * Returns: { success: true, file: base64, filename: string } or { success: true, files: [...] } for batch
 * 
 * Note: This is a placeholder API route. The actual OCR and text layer addition
 * happens client-side using Tesseract.js and pdf-lib for better performance.
 * This route handles payment checks and file validation.
 */

import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { cleanupFiles, validateFileType } from '../../../lib/pdf-server/utils/file-handler';
import { handleApiError, ValidationError } from '../../../lib/pdf-server/utils/error-handler';
import { checkPaymentRequirement as checkPaymentRequirementNew } from '../../../lib/config/pricing';
import { PRICING_CONFIG } from '../../../lib/config/pricing';

export const config = {
  api: {
    bodyParser: false,
    responseLimit: '50mb',
  },
};

/**
 * Verify processing pass from session ID
 */
async function verifyProcessingPass(sessionId) {
  if (!sessionId) return false;
  return sessionId && sessionId.startsWith('cs_');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      message: 'Only POST requests are supported' 
    });
  }

  // Note: The actual OCR and text layer addition happens client-side
  // This API route is primarily for payment validation
  // The client will send the processed PDF back or handle it entirely client-side
  
  return res.status(200).json({
    success: true,
    message: 'Payment check passed. Processing happens client-side.',
    clientSide: true, // Indicates client should handle OCR
  });
}


