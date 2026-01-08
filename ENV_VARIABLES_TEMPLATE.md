# Environment Variables Template

Copy these to your `.env.local` file and fill in your actual values.

```bash
# Stripe API Keys
# Get from: https://dashboard.stripe.com/apikeys
STRIPE_SECRET_KEY=sk_test_YOUR_STRIPE_SECRET_KEY_HERE
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_STRIPE_PUBLISHABLE_KEY_HERE

# Stripe Product Price IDs
# Get from: https://dashboard.stripe.com/products
# Create "Processing Pass" product ($2.99) and copy the Price ID
STRIPE_PROCESSING_PASS_PRICE_ID=price_xxxxxxxxxxxxxxxxxxxxx

# Optional: Single File Processing
STRIPE_SINGLE_FILE_PRICE_ID=price_xxxxxxxxxxxxxxxxxxxxx

# Site URL
# Development: http://localhost:3000
# Production: https://fixtools.io
NEXT_PUBLIC_HOST=http://localhost:3000
```

## Quick Setup Steps:

1. **Create `.env.local` file** in project root
2. **Copy the template above** into `.env.local`
3. **Get Stripe keys** from Stripe Dashboard
4. **Create products** in Stripe Dashboard
5. **Copy Price IDs** to `.env.local`
6. **Restart dev server** (`npm run dev`)

## Important:

- ✅ `.env.local` is already in `.gitignore`
- ✅ Never commit API keys to Git
- ✅ Use test keys for development
- ✅ Use live keys for production

