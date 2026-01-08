/**
 * Verify Stripe Payment Session
 * POST /api/payments/verify-session
 * 
 * Verifies a Stripe Checkout session and returns processing pass if payment is successful
 */

import Stripe from 'stripe';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20.acacia', // Use latest stable version
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check if Stripe is configured
  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({ 
      error: 'Stripe not configured',
      message: 'STRIPE_SECRET_KEY environment variable is not set.' 
    });
  }

  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ 
        error: 'Session ID required',
        message: 'Please provide a valid session ID' 
      });
    }

    // Retrieve Stripe session
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Check if payment was successful
    if (session.payment_status !== 'paid') {
      return res.status(400).json({ 
        error: 'Payment not completed',
        message: `Payment status: ${session.payment_status}. Payment must be completed to receive processing pass.` 
      });
    }

    // Get product type from metadata
    const productType = session.metadata?.productType || 'processing-pass';

    // Calculate expiry time based on product type
    const now = Date.now();
    const expiresAt = productType === 'processing-pass'
      ? now + (24 * 60 * 60 * 1000) // 24 hours for processing pass
      : now + (60 * 60 * 1000); // 1 hour for single file

    // Create processing pass
    const processingPass = {
      valid: true,
      type: productType,
      createdAt: now,
      expiresAt: expiresAt,
      sessionId: session.id,
      customerEmail: session.customer_email || session.customer_details?.email || null,
    };

    return res.status(200).json({
      valid: true,
      processingPass,
      paymentStatus: session.payment_status,
      amountPaid: session.amount_total ? (session.amount_total / 100).toFixed(2) : null,
      currency: session.currency || 'usd',
    });
  } catch (error) {
    console.error('Session verification error:', error);
    
    // Handle Stripe-specific errors
    if (error.type === 'StripeInvalidRequestError') {
      return res.status(400).json({
        error: 'Invalid session ID',
        message: error.message,
      });
    }

    return res.status(500).json({
      error: 'Failed to verify session',
      message: error.message || 'An unexpected error occurred',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
}

