# 💳 Payment & Rate Limits Standards

**Last Updated:** January 2026  
**Purpose:** Standardized implementation guide for rate limits, batch processing, and Stripe payment integration across all FixTools

---

## 📋 Table of Contents

1. [Rate Limits Standards](#rate-limits-standards)
2. [Batch Processing Standards](#batch-processing-standards)
3. [Stripe Payment Integration](#stripe-payment-integration)
4. [Payment Modal Standards](#payment-modal-standards)
5. [Implementation Examples](#implementation-examples)
6. [Best Practices](#best-practices)

---

## 🚦 Rate Limits Standards

### **Overview**

Rate limits prevent abuse and ensure fair usage across all users. All tools must implement rate limiting based on user plan.

### **Standard Rate Limits by Tool Type**

| Tool Type | Free Tier | Paid Tier (Day Pass) |
|-----------|-----------|---------------------|
| **PDF Tools** | 5 jobs/day | 200 jobs/day |
| **Image Tools** | 10 jobs/day | 500 jobs/day |
| **Video Tools** | 1 job/day | 50 jobs/day |
| **Web Tools** | 5 jobs/day | 200 jobs/day |

### **Rate Limit Implementation**

#### **1. API Route (Server-Side)**

```javascript
import { checkPaymentRequirement } from '../../../lib/config/pricing';
import { verifyProcessingPass } from '../../../lib/payments/payment-utils';

// Get user plan from session
async function getUserPlanFromSession(sessionId) {
  if (!sessionId) return 'free';
  
  try {
    const hasValidPass = await verifyProcessingPass(sessionId);
    if (hasValidPass) {
      return 'day_pass';
    }
  } catch (e) {
    // Invalid session
  }
  return 'free';
}

// Check rate limits
export default async function handler(req, res) {
  const { sessionId } = req.body;
  const userPlan = await getUserPlanFromSession(sessionId);
  
  // Check rate limit requirement
  const rateLimitRequirement = checkPaymentRequirement('tool-type', 0, 1, userPlan);
  
  if (rateLimitRequirement.requiresPayment && rateLimitRequirement.reason === 'rate_limit') {
    const hasValidPass = await verifyProcessingPass(sessionId);
    if (!hasValidPass) {
      return res.status(402).json({
        error: 'Payment required',
        message: 'Daily rate limit exceeded. A Processing Pass is required for unlimited access.',
        paymentRequired: true,
        reason: 'rate_limit',
        requirement: rateLimitRequirement,
      });
    }
  }
  
  // Continue with processing...
}
```

#### **2. Frontend (Client-Side)**

```javascript
import { checkPaymentRequirement as checkPaymentRequirementNew, getUserPlan } from '../../lib/config/pricing';
import { hasValidProcessingPass as hasValidProcessingPassNew } from '../../lib/payments/payment-utils';

const handleProcess = async () => {
  const userPlan = getUserPlan(userSession);
  
  // Check rate limit
  const rateLimitRequirement = checkPaymentRequirementNew('tool-type', 0, 1, userPlan);
  
  if (rateLimitRequirement.requiresPayment && rateLimitRequirement.reason === 'rate_limit') {
    setPaymentRequirement(rateLimitRequirement);
    setShowPaymentModal(true);
    return;
  }
  
  // Continue with processing...
};
```

### **Rate Limit Tracking**

**Current Implementation:** Simplified check (no persistent tracking)  
**Production Recommendation:** Implement per-IP/user tracking using:
- Redis for distributed rate limiting
- Database for user-specific limits
- IP-based tracking for anonymous users

---

## 📦 Batch Processing Standards

### **Overview**

Batch processing allows users to process multiple files/items in a single operation. Free tier has strict limits; paid tier allows unlimited batch processing.

### **Standard Batch Limits by Tool Type**

| Tool Type | Free Tier | Paid Tier (Day Pass) |
|-----------|-----------|---------------------|
| **PDF Tools** | 1 file/job | 20 files/job |
| **Image Tools** | 1 file/job | 50 files/job |
| **Video Tools** | 1 file/job | 5 files/job |
| **Web Tools** | 1-3 items/job | 20 items/job |

**Note:** For Web Tools (SSL Checker, Website Speed Test, etc.), the free tier allows up to 3 items per job. Payment is required for 4+ items.

### **Batch Processing Strategies**

#### **Strategy 1: Hard Block (Standard)**

Block batch processing for free users, require payment before processing.

```javascript
// API Route
const fileCount = files.length;
const userPlan = await getUserPlanFromSession(sessionId);

if (fileCount > 1) {
  const batchRequirement = checkPaymentRequirement('tool-type', 0, fileCount, userPlan);
  
  if (batchRequirement.requiresPayment && batchRequirement.reason === 'batch') {
    const hasValidPass = await verifyProcessingPass(sessionId);
    if (!hasValidPass) {
      return res.status(402).json({
        error: 'Payment required',
        message: `Batch processing (${fileCount} files) requires a Processing Pass. Free tier allows 1 file at a time.`,
        paymentRequired: true,
        reason: 'batch',
        fileCount: fileCount,
        requirement: batchRequirement,
      });
    }
  }
}
```

#### **Strategy 2: Freemium with Preview (Advanced)**

Allow limited batch processing for free users, show limited results, require payment for full results.

**Example: Website Speed Test (2-3 URLs free, 4+ require payment)**

#### **Strategy 3: Web Tools Batch Threshold (Standard)**

Allow up to 3 items for free users, require payment for 4+ items.

**Example: SSL Certificate Checker (1-3 domains free, 4+ require payment)**

```javascript
// API Route
const domainCount = validDomains.length;
const userPlan = await getUserPlanFromSession(sessionId);

// For 4+ domains: Require payment before processing
if (domainCount >= 4) {
  const batchRequirement = checkPaymentRequirement('web-tools', 0, domainCount, userPlan);
  
  if (batchRequirement.requiresPayment && batchRequirement.reason === 'batch') {
    const hasValidPass = await verifyProcessingPass(sessionId);
    if (!hasValidPass) {
      return res.status(402).json({
        error: 'Payment required',
        message: `Batch processing (${domainCount} domains) requires a Processing Pass. Free tier allows up to 3 domains at a time.`,
        paymentRequired: true,
        reason: 'batch',
        domainCount: domainCount,
        requirement: batchRequirement,
      });
    }
  }
}
```

```javascript
// API Route
const urlCount = validUrls.length;
const userPlan = await getUserPlanFromSession(sessionId);
let isLimitedResults = false;

if (urlCount > 1) {
  // For 2-3 URLs: Allow free users but mark as limited
  if (urlCount <= 3 && userPlan === 'free') {
    isLimitedResults = true;
    // Process but will return limited results
  } 
  // For 4+ URLs: Require payment before processing
  else if (urlCount > 3) {
    const batchRequirement = checkPaymentRequirement('web-tools', 0, urlCount, userPlan);
    if (batchRequirement.requiresPayment && batchRequirement.reason === 'batch') {
      const hasValidPass = await verifyProcessingPass(sessionId);
      if (!hasValidPass) {
        return res.status(402).json({
          error: 'Payment required',
          message: `Batch processing (${urlCount} URLs) requires a Processing Pass.`,
          paymentRequired: true,
          reason: 'batch',
          urlCount: urlCount,
          requirement: batchRequirement,
        });
      }
    }
  }
}

// Return limited results if applicable
if (isLimitedResults) {
  // Return only basic results, hide detailed metrics
  return res.status(200).json({
    success: true,
    results: limitedResults,
    limited: true,
    message: 'Upgrade to see full results',
  });
}
```

### **When to Use Each Strategy**

- **Hard Block:** Use for file processing tools (PDF, Image, Video) where partial results don't make sense
- **Freemium with Preview:** Use for analysis/reporting tools where showing partial results demonstrates value
- **Web Tools Batch Threshold:** Use for web analysis tools (SSL Checker, DNS Lookup, etc.) where allowing 1-3 items free provides value while encouraging upgrades for larger batches

---

## 💳 Stripe Payment Integration

### **Overview**

All payment processing uses Stripe Checkout. The payment flow is standardized across all tools.

### **Payment Flow**

```
User Action → Check Limits → Payment Required? → Show Payment Modal → Stripe Checkout → Payment Success → Store Pass → Continue Processing
```

### **1. Payment Check (Frontend)**

```javascript
import { checkPaymentRequirement as checkPaymentRequirementNew, getUserPlan } from '../../lib/config/pricing';
import { hasValidProcessingPass as hasValidProcessingPassNew } from '../../lib/payments/payment-utils';
import PaymentModal from '../../components/PaymentModal';

const [showPaymentModal, setShowPaymentModal] = useState(false);
const [paymentRequirement, setPaymentRequirement] = useState(null);
const [userSession, setUserSession] = useState({ processingPass: null });

// Load session from localStorage
useEffect(() => {
  if (typeof window !== 'undefined') {
    const passData = localStorage.getItem('processingPass');
    if (passData) {
      try {
        const pass = JSON.parse(passData);
        const session = { processingPass: pass };
        if (hasValidProcessingPassNew(session)) {
          setUserSession(session);
        } else {
          localStorage.removeItem('processingPass');
          setUserSession({ processingPass: null });
        }
      } catch (e) {
        localStorage.removeItem('processingPass');
        setUserSession({ processingPass: null });
      }
    }
  }
}, []);

// Check payment requirement
const handleProcess = async () => {
  const userPlan = getUserPlan(userSession);
  
  // Check batch processing
  const batchRequirement = checkPaymentRequirementNew('tool-type', fileSize, fileCount, userPlan);
  
  if (batchRequirement.requiresPayment && batchRequirement.reason === 'batch') {
    setPaymentRequirement(batchRequirement);
    setShowPaymentModal(true);
    return;
  }
  
  // Check file size
  const sizeRequirement = checkPaymentRequirementNew('tool-type', fileSize, 1, userPlan);
  
  if (sizeRequirement.requiresPayment && sizeRequirement.reason === 'file_size') {
    setPaymentRequirement(sizeRequirement);
    setShowPaymentModal(true);
    return;
  }
  
  // Continue with processing...
};

// Handle payment success
const handlePaymentSuccess = () => {
  const passData = localStorage.getItem('processingPass');
  if (passData) {
    try {
      const pass = JSON.parse(passData);
      setUserSession({ processingPass: pass });
    } catch (e) {
      // Invalid pass data
    }
  }
  setShowPaymentModal(false);
  // Retry processing after payment
  handleProcess();
};

// Render Payment Modal
<PaymentModal
  isOpen={showPaymentModal}
  onClose={() => setShowPaymentModal(false)}
  requirement={paymentRequirement}
  onPaymentSuccess={handlePaymentSuccess}
/>
```

### **2. Payment Check (API Route)**

```javascript
import { checkPaymentRequirement } from '../../../lib/config/pricing';
import { verifyProcessingPass } from '../../../lib/payments/payment-utils';

export default async function handler(req, res) {
  const { fileSize, fileCount, sessionId } = req.body;
  
  // Get user plan
  async function getUserPlanFromSession(sessionId) {
    if (!sessionId) return 'free';
    
    try {
      const hasValidPass = await verifyProcessingPass(sessionId);
      if (hasValidPass) {
        return 'day_pass';
      }
    } catch (e) {
      // Invalid session
    }
    return 'free';
  }
  
  const userPlan = await getUserPlanFromSession(sessionId);
  
  // Check payment requirement
  const requirement = checkPaymentRequirement('tool-type', fileSize, fileCount, userPlan);
  
  if (requirement.requiresPayment) {
    const hasValidPass = await verifyProcessingPass(sessionId);
    if (!hasValidPass) {
      return res.status(402).json({
        error: 'Payment required',
        message: getPaymentMessage(requirement),
        paymentRequired: true,
        reason: requirement.reason,
        requirement: requirement,
      });
    }
  }
  
  // Continue with processing...
}
```

### **3. Stripe Checkout Session Creation**

The `PaymentModal` component automatically handles Stripe checkout session creation:

```javascript
// PaymentModal.jsx (already implemented)
const handlePayment = async () => {
  const response = await fetch('/api/payments/create-checkout-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      productType: 'processing-pass', // or 'single-file'
      successUrl: `${window.location.origin}/payment/success?return=${encodeURIComponent(window.location.pathname)}`,
      cancelUrl: `${window.location.origin}/payment/cancel`,
    }),
  });
  
  const data = await response.json();
  
  if (data.url) {
    window.location.href = data.url; // Redirect to Stripe Checkout
  }
};
```

### **4. Payment Success Handling**

After successful payment, the user is redirected to `/payment/success` which:
1. Verifies the Stripe session
2. Creates a processing pass
3. Stores it in localStorage
4. Redirects back to the original tool

---

## 🎨 Payment Modal Standards

### **Component Usage**

The `PaymentModal` component is standardized and should be used consistently across all tools.

```javascript
import PaymentModal from '../../components/PaymentModal';

// State
const [showPaymentModal, setShowPaymentModal] = useState(false);
const [paymentRequirement, setPaymentRequirement] = useState(null);

// Render
<PaymentModal
  isOpen={showPaymentModal}
  onClose={() => setShowPaymentModal(false)}
  requirement={paymentRequirement}
  onPaymentSuccess={handlePaymentSuccess}
/>
```

### **Payment Requirement Object**

The `requirement` object must have the following structure:

```javascript
{
  requiresPayment: true,
  reason: 'batch' | 'file_size' | 'rate_limit',
  fileSize: number,        // File size in bytes (for file_size reason)
  fileCount: number,       // Number of files (for batch reason)
  urlCount: number,        // Number of URLs (for web tools batch)
  maxFreeSize: number,     // Max free file size in bytes
  maxFreeBatch: number,    // Max free batch size
  message: string,         // User-friendly message
  plan: 'free' | 'day_pass' | 'pro'
}
```

### **Payment Modal Features**

The standard `PaymentModal` includes:
- ✅ Lock icon with gradient background
- ✅ Dynamic title and message based on requirement
- ✅ Benefits list (Processing Pass features)
- ✅ Price display ($3.99)
- ✅ "Get Processing Pass" button
- ✅ "Maybe Later" button
- ✅ Security badge (Stripe secured)
- ✅ Error handling
- ✅ Loading states

### **Customization**

The modal automatically:
- Determines `productType` based on requirement reason
- Shows appropriate message via `getPaymentMessage()`
- Handles Stripe checkout session creation
- Manages payment flow

**Do NOT customize the modal UI** - keep it consistent across all tools.

---

## 📝 Implementation Examples

### **Example 1: PDF Tool with File Size & Batch Checks**

```javascript
// pages/api/pdf/my-tool.js
import { checkPaymentRequirement } from '../../../lib/config/pricing';
import { verifyProcessingPass } from '../../../lib/payments/payment-utils';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { files, sessionId } = req.body;
    
    // Get user plan
    async function getUserPlanFromSession(sessionId) {
      if (!sessionId) return 'free';
      try {
        const hasValidPass = await verifyProcessingPass(sessionId);
        return hasValidPass ? 'day_pass' : 'free';
      } catch (e) {
        return 'free';
      }
    }
    
    const userPlan = await getUserPlanFromSession(sessionId);
    
    // Calculate total file size
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    const fileCount = files.length;
    
    // Check payment requirement
    const requirement = checkPaymentRequirement('pdf', totalSize, fileCount, userPlan);
    
    if (requirement.requiresPayment) {
      const hasValidPass = await verifyProcessingPass(sessionId);
      if (!hasValidPass) {
        return res.status(402).json({
          error: 'Payment required',
          message: requirement.reason === 'file_size'
            ? `File size (${formatFileSize(totalSize)}) exceeds free limit of ${formatFileSize(requirement.maxFreeSize)}.`
            : `Batch processing (${fileCount} files) requires a Processing Pass.`,
          paymentRequired: true,
          reason: requirement.reason,
          requirement: requirement,
        });
      }
    }
    
    // Process files...
    // ...
    
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      error: 'Processing failed',
      message: error.message,
    });
  }
}
```

### **Example 2: Frontend with Payment Modal**

```javascript
// pages/tools/my-tool.jsx
import { useState, useEffect } from 'react';
import { checkPaymentRequirement as checkPaymentRequirementNew, getUserPlan } from '../../lib/config/pricing';
import { hasValidProcessingPass as hasValidProcessingPassNew } from '../../lib/payments/payment-utils';
import PaymentModal from '../../components/PaymentModal';

export default function MyTool() {
  const [files, setFiles] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentRequirement, setPaymentRequirement] = useState(null);
  const [userSession, setUserSession] = useState({ processingPass: null });
  
  // Load session
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const passData = localStorage.getItem('processingPass');
      if (passData) {
        try {
          const pass = JSON.parse(passData);
          const session = { processingPass: pass };
          if (hasValidProcessingPassNew(session)) {
            setUserSession(session);
          } else {
            localStorage.removeItem('processingPass');
            setUserSession({ processingPass: null });
          }
        } catch (e) {
          localStorage.removeItem('processingPass');
          setUserSession({ processingPass: null });
        }
      }
    }
  }, []);
  
  const handleProcess = async () => {
    if (files.length === 0) return;
    
    const userPlan = getUserPlan(userSession);
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    const fileCount = files.length;
    
    // Check payment requirement
    const requirement = checkPaymentRequirementNew('pdf', totalSize, fileCount, userPlan);
    
    if (requirement.requiresPayment) {
      setPaymentRequirement(requirement);
      setShowPaymentModal(true);
      return;
    }
    
    // Continue with processing...
    // ...
  };
  
  const handlePaymentSuccess = () => {
    const passData = localStorage.getItem('processingPass');
    if (passData) {
      try {
        const pass = JSON.parse(passData);
        setUserSession({ processingPass: pass });
      } catch (e) {
        // Invalid pass data
      }
    }
    setShowPaymentModal(false);
    handleProcess(); // Retry after payment
  };
  
  return (
    <>
      {/* Your tool UI */}
      
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        requirement={paymentRequirement}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </>
  );
}
```

---

## ✅ Best Practices

### **1. Always Check Limits Before Processing**

✅ **DO:**
```javascript
// Check limits first
const requirement = checkPaymentRequirement('tool-type', fileSize, fileCount, userPlan);
if (requirement.requiresPayment) {
  // Show payment modal
  return;
}
// Then process
```

❌ **DON'T:**
```javascript
// Process first, check later
await processFiles();
// This wastes resources
```

### **2. Use Centralized Config**

✅ **DO:**
```javascript
import { checkPaymentRequirement } from '../../../lib/config/pricing';
```

❌ **DON'T:**
```javascript
// Hardcode limits
if (fileSize > 10 * 1024 * 1024) {
  // This breaks when limits change
}
```

### **3. Consistent Error Responses**

✅ **DO:**
```javascript
return res.status(402).json({
  error: 'Payment required',
  message: 'User-friendly message',
  paymentRequired: true,
  reason: 'batch',
  requirement: requirement,
});
```

❌ **DON'T:**
```javascript
// Inconsistent error formats
return res.status(400).json({ error: 'Pay up!' });
```

### **4. Session Management**

✅ **DO:**
```javascript
// Check session validity
const hasValidPass = await verifyProcessingPass(sessionId);
if (hasValidPass) {
  return 'day_pass';
}
```

❌ **DON'T:**
```javascript
// Trust session without verification
if (sessionId) {
  return 'day_pass'; // Security risk!
}
```

### **5. User Experience**

✅ **DO:**
- Show payment modal before processing
- Provide clear error messages
- Allow users to retry after payment
- Show progress indicators

❌ **DON'T:**
- Block users without explanation
- Process files then ask for payment
- Hide payment requirements

---

## 🔧 Configuration Reference

### **Tool Types**

Available tool types in `lib/config/pricing.js`:
- `'pdf'` - PDF processing tools
- `'image'` - Image processing tools
- `'video'` - Video processing tools
- `'web-tools'` - Web analysis tools

### **User Plans**

- `'free'` - Free tier (default)
- `'day_pass'` - 24-hour Processing Pass ($3.99)
- `'pro'` - Pro subscription ($7.99/month)

### **Payment Reasons**

- `'file_size'` - File exceeds free size limit
- `'batch'` - Batch processing requires payment
- `'rate_limit'` - Daily rate limit exceeded

---

## 📚 Related Documentation

- `lib/config/pricing.js` - Centralized pricing configuration
- `lib/payments/payment-utils.js` - Payment helper functions
- `components/PaymentModal.jsx` - Standard payment modal component
- `pages/api/payments/create-checkout-session.js` - Stripe checkout session API
- `STRIPE_SETUP_GUIDE.md` - Stripe setup instructions

---

## 🆘 Troubleshooting

### **Payment Modal Not Showing**

1. Check that `paymentRequirement` is set correctly
2. Verify `showPaymentModal` state is `true`
3. Ensure `PaymentModal` component is imported and rendered
4. Check browser console for errors

### **Payment Check Not Working**

1. Verify `checkPaymentRequirement` is imported correctly
2. Check that tool type matches configuration
3. Ensure user plan is determined correctly
4. Verify session ID is passed to API

### **Rate Limits Not Enforced**

1. Check that rate limit checks are implemented
2. Verify user plan detection
3. Ensure payment requirement is checked before processing
4. Check that `reason === 'rate_limit'` is handled

---

**Last Updated:** January 2026  
**Maintained By:** FixTools Development Team

