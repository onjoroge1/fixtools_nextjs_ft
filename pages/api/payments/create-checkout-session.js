/**
 * Create Stripe Checkout Session
 * POST /api/payments/create-checkout-session
 * 
 * Creates a Stripe Checkout session for Processing Pass or Single File payment
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
      message: 'STRIPE_SECRET_KEY environment variable is not set. Please configure Stripe in your environment variables.' 
    });
  }

  try {
    const { productType, successUrl, cancelUrl } = req.body;

    // Validate product type
    const validTypes = ['processing-pass', 'single-file'];
    if (!productType || !validTypes.includes(productType)) {
      return res.status(400).json({ 
        error: 'Invalid product type',
        message: `Product type must be one of: ${validTypes.join(', ')}` 
      });
    }

    // Get price ID based on product type
    const priceId = productType === 'processing-pass'
      ? process.env.STRIPE_PROCESSING_PASS_PRICE_ID
      : process.env.STRIPE_SINGLE_FILE_PRICE_ID;

    if (!priceId) {
      return res.status(500).json({ 
        error: 'Price ID not configured',
        message: `STRIPE_${productType.toUpperCase().replace('-', '_')}_PRICE_ID environment variable is not set. Please create a product and price in Stripe Dashboard and add the price ID to your environment variables.` 
      });
    }

    // Get base URL
    const baseUrl = process.env.NEXT_PUBLIC_HOST || 'http://localhost:3000';
    
    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl || `${baseUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${baseUrl}/payment/cancel`,
      metadata: {
        productType,
        timestamp: new Date().toISOString(),
      },
      // Allow promotion codes
      allow_promotion_codes: true,
      // Customer email collection
      customer_email: undefined, // Let user enter email
      // Billing address collection (optional)
      billing_address_collection: 'auto',
    });

    return res.status(200).json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    
    // Handle Stripe-specific errors
    if (error.type === 'StripeInvalidRequestError') {
      return res.status(400).json({
        error: 'Invalid Stripe request',
        message: error.message,
      });
    }

    return res.status(500).json({
      error: 'Failed to create checkout session',
      message: error.message || 'An unexpected error occurred',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
}

