# 💳 Stripe Integration Setup Guide

**Date:** January 2026  
**Purpose:** Complete guide for setting up Stripe payments for PDF tools

---

## 📋 **PREREQUISITES**

1. **Stripe Account** - Create account at https://stripe.com
2. **Stripe SDK** - Already installed (`stripe@^14.25.0`)
3. **Environment Variables** - Need to be configured

---

## 🚀 **STEP-BY-STEP SETUP**

### **Step 1: Create Stripe Account**

1. Go to https://stripe.com
2. Sign up for a free account
3. Complete account verification
4. Access the Stripe Dashboard

---

### **Step 2: Get API Keys**

1. **Go to Stripe Dashboard** → Developers → API keys
2. **Copy your keys:**
   - **Publishable key** (starts with `pk_test_` or `pk_live_`)
   - **Secret key** (starts with `sk_test_` or `sk_live_`)

**Important:**
- Use **test keys** (`pk_test_`, `sk_test_`) for development
- Use **live keys** (`pk_live_`, `sk_live_`) for production

---

### **Step 3: Create Products in Stripe**

#### **Product 1: Processing Pass**

1. **Go to Stripe Dashboard** → Products → Add product
2. **Product Details:**
   - **Name:** Processing Pass
   - **Description:** 24-hour access to premium PDF processing features
   - **Pricing:**
     - **Price:** $2.99
     - **Billing:** One-time
     - **Currency:** USD
3. **Save the Price ID** (starts with `price_...`)

#### **Product 2: Single Large File (Optional)**

1. **Go to Stripe Dashboard** → Products → Add product
2. **Product Details:**
   - **Name:** Single Large File Processing
   - **Description:** Process one large file (up to 500MB)
   - **Pricing:**
     - **Price:** $1.99
     - **Billing:** One-time
     - **Currency:** USD
3. **Save the Price ID** (starts with `price_...`)

---

### **Step 4: Configure Environment Variables**

Create or update `.env.local` file in your project root:

```bash
# Stripe API Keys
STRIPE_SECRET_KEY=sk_test_YOUR_STRIPE_SECRET_KEY_HERE
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_STRIPE_PUBLISHABLE_KEY_HERE

# Stripe Product Price IDs
STRIPE_PROCESSING_PASS_PRICE_ID=price_xxxxxxxxxxxxxxxxxxxxx
STRIPE_SINGLE_FILE_PRICE_ID=price_xxxxxxxxxxxxxxxxxxxxx

# Site URL (for redirects)
NEXT_PUBLIC_HOST=https://fixtools.io
```

**For Development:**
```bash
# Use test keys
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_PROCESSING_PASS_PRICE_ID=price_...
NEXT_PUBLIC_HOST=http://localhost:3000
```

**For Production:**
```bash
# Use live keys
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_PROCESSING_PASS_PRICE_ID=price_...
NEXT_PUBLIC_HOST=https://fixtools.io
```

---

### **Step 5: Add Environment Variables to Vercel**

If deploying to Vercel:

1. **Go to Vercel Dashboard** → Your Project → Settings → Environment Variables
2. **Add each variable:**
   - `STRIPE_SECRET_KEY`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `STRIPE_PROCESSING_PASS_PRICE_ID`
   - `STRIPE_SINGLE_FILE_PRICE_ID` (optional)
   - `NEXT_PUBLIC_HOST`
3. **Select environments** (Production, Preview, Development)
4. **Save and redeploy**

---

## 🧪 **TESTING THE INTEGRATION**

### **Test Mode Setup:**

1. **Use Stripe Test Mode:**
   - Use test API keys (`pk_test_`, `sk_test_`)
   - Create test products in Stripe Dashboard
   - Use test price IDs

2. **Test Cards:**
   - **Success:** `4242 4242 4242 4242`
   - **Decline:** `4000 0000 0000 0002`
   - **3D Secure:** `4000 0025 0000 3155`
   - **Any future expiry date, any CVC, any ZIP**

3. **Test Flow:**
   - Upload a file >100MB
   - Payment modal should appear
   - Use test card `4242 4242 4242 4242`
   - Complete payment
   - Should redirect to success page
   - Processing pass should be stored

---

## 🔧 **TROUBLESHOOTING**

### **Common Issues:**

#### **1. "Stripe not configured" Error**
- **Cause:** Missing `STRIPE_SECRET_KEY` environment variable
- **Fix:** Add `STRIPE_SECRET_KEY` to `.env.local` and restart dev server

#### **2. "Price ID not configured" Error**
- **Cause:** Missing price ID environment variable
- **Fix:** Create product in Stripe Dashboard and add `STRIPE_PROCESSING_PASS_PRICE_ID` to `.env.local`

#### **3. "Invalid session ID" Error**
- **Cause:** Session ID doesn't exist or expired
- **Fix:** Check that session ID is correct and not expired (sessions expire after 24 hours)

#### **4. Payment Not Completing**
- **Cause:** Using live keys in test mode or vice versa
- **Fix:** Ensure test keys are used with test cards, live keys with real cards

#### **5. Redirect Not Working**
- **Cause:** `NEXT_PUBLIC_HOST` not set correctly
- **Fix:** Set `NEXT_PUBLIC_HOST` to your actual domain (e.g., `https://fixtools.io`)

---

## 📊 **MONITORING & ANALYTICS**

### **Stripe Dashboard:**

1. **Payments** - View all transactions
2. **Customers** - View customer information
3. **Products** - Manage products and prices
4. **Webhooks** - Set up webhooks for payment events (optional)

### **Recommended Webhooks:**

- `checkout.session.completed` - When payment succeeds
- `payment_intent.succeeded` - When payment is confirmed
- `payment_intent.payment_failed` - When payment fails

---

## 🔒 **SECURITY BEST PRACTICES**

1. **Never commit API keys to Git**
   - Add `.env.local` to `.gitignore`
   - Use environment variables only

2. **Use different keys for test/production**
   - Test keys: `sk_test_...`, `pk_test_...`
   - Live keys: `sk_live_...`, `pk_live_...`

3. **Rotate keys regularly**
   - Change keys if compromised
   - Update in Stripe Dashboard and environment variables

4. **Monitor for suspicious activity**
   - Check Stripe Dashboard regularly
   - Set up alerts for failed payments
   - Review transaction logs

---

## 📝 **ENVIRONMENT VARIABLES REFERENCE**

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `STRIPE_SECRET_KEY` | Stripe secret API key | `sk_test_...` | ✅ Yes |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | `pk_test_...` | ✅ Yes |
| `STRIPE_PROCESSING_PASS_PRICE_ID` | Processing Pass price ID | `price_...` | ✅ Yes |
| `STRIPE_SINGLE_FILE_PRICE_ID` | Single file price ID | `price_...` | ⚠️ Optional |
| `NEXT_PUBLIC_HOST` | Site URL for redirects | `https://fixtools.io` | ✅ Yes |

---

## ✅ **VERIFICATION CHECKLIST**

- [ ] Stripe account created
- [ ] API keys obtained (test and live)
- [ ] Products created in Stripe Dashboard
- [ ] Price IDs copied
- [ ] Environment variables set in `.env.local`
- [ ] Environment variables set in Vercel (if deploying)
- [ ] Test payment completed successfully
- [ ] Processing pass stored after payment
- [ ] Redirect to success page works
- [ ] Payment modal appears for files >100MB

---

## 🎯 **NEXT STEPS AFTER SETUP**

1. **Test the payment flow** with test cards
2. **Monitor Stripe Dashboard** for test transactions
3. **Switch to live keys** when ready for production
4. **Set up webhooks** (optional, for advanced features)
5. **Monitor revenue** in Stripe Dashboard

---

## 📞 **SUPPORT**

- **Stripe Documentation:** https://stripe.com/docs
- **Stripe Support:** https://support.stripe.com
- **Stripe API Reference:** https://stripe.com/docs/api

---

**Ready to process payments! 🚀**

