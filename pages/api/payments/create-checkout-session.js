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

    const envVarName = productType === 'processing-pass'
      ? 'STRIPE_PROCESSING_PASS_PRICE_ID'
      : 'STRIPE_SINGLE_FILE_PRICE_ID';

    // Validate price ID exists and is in correct format
    if (!priceId) {
      return res.status(500).json({ 
        error: 'Price ID not configured',
        message: `${envVarName} environment variable is not set. Please create a product and price in Stripe Dashboard and add the price ID (starts with 'price_') to your environment variables.`,
        help: 'Steps: 1) Go to Stripe Dashboard → Products → Create/Select Product → Add Price → Copy the Price ID (starts with "price_") → Add to .env.local file'
      });
    }

    // Trim whitespace in case there are any
    const trimmedPriceId = priceId.trim();

    // Validate price ID format (should start with 'price_')
    if (!trimmedPriceId.startsWith('price_')) {
      // Log the actual value for debugging
      console.error(`[${envVarName}] Invalid Price ID format. Received: "${priceId}" (trimmed: "${trimmedPriceId}", length: ${priceId.length})`);
      
      // Check if it looks like a number (common mistake)
      const isNumeric = !isNaN(parseFloat(priceId)) && isFinite(priceId);
      const errorMessage = isNumeric
        ? `The ${envVarName} is set to a number (${priceId}), but it must be a Stripe Price ID (starts with 'price_'). You cannot use the price amount directly.`
        : `The ${envVarName} must be a Stripe Price ID (starts with 'price_'), but received: "${priceId}"`;
      
      return res.status(500).json({ 
        error: 'Invalid Price ID format',
        message: errorMessage,
        received: priceId,
        expected: 'A value starting with "price_" (e.g., "price_1234567890abcdef")',
        help: 'To fix: 1) Go to Stripe Dashboard → Products → Create/Select Product → Add Price → Copy the Price ID (starts with "price_") → Update .env.local file → Restart dev server',
        note: isNumeric ? 'You copied the price amount instead of the Price ID. The Price ID is different from the price amount.' : ''
      });
    }

    // Get base URL
    const baseUrl = process.env.NEXT_PUBLIC_HOST || 'http://localhost:3000';
    
    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: trimmedPriceId,
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
      // Check if it's a price ID issue
      if (error.param === 'line_items[0][price]' || error.message?.includes('price')) {
        const reqProductType = req.body?.productType || 'processing-pass';
        const envVarName = reqProductType === 'processing-pass'
          ? 'STRIPE_PROCESSING_PASS_PRICE_ID'
          : 'STRIPE_SINGLE_FILE_PRICE_ID';
        
        return res.status(400).json({
          error: 'Invalid Price ID',
          message: `The ${envVarName} environment variable must be a Stripe Price ID (starts with 'price_'), not a numerical value. Please create a product and price in Stripe Dashboard, then copy the Price ID (e.g., 'price_1234567890') to your environment variables.`,
          help: 'To fix this: 1) Go to Stripe Dashboard → Products → Create/Select Product → Add Price → Copy the Price ID (starts with "price_") → Add to .env.local file',
        });
      }
      
      return res.status(400).json({
        error: 'Invalid Stripe request',
        message: error.message,
        param: error.param,
      });
    }

    return res.status(500).json({
      error: 'Failed to create checkout session',
      message: error.message || 'An unexpected error occurred',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
}

