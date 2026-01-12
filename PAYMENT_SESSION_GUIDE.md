# Payment Session & User Plan Detection Guide

**Purpose:** How to determine if a user has paid for a session and is allowed to do batch processing or use higher limits

---

## 🔄 Payment Flow Overview

```
1. User uploads file(s) → Check payment requirement
2. If payment needed → Show PaymentModal
3. User pays via Stripe → Redirect to /payment/success
4. Success page verifies payment → Stores processing pass in localStorage
5. User returns to tool → Tool checks localStorage for valid pass
6. Tool uses getUserPlan() → Determines if user has paid plan
7. Tool checks limits → Uses checkPaymentRequirement() with user plan
```

---

## 📦 Storage: Processing Pass in localStorage

### Structure

The processing pass is stored in `localStorage` with the key `'processingPass'`:

```javascript
{
  valid: true,
  type: 'processing-pass' | 'day_pass' | 'pro',
  createdAt: 1234567890000,  // Timestamp
  expiresAt: 1234567890000,  // Timestamp (24 hours from creation)
  sessionId: 'cs_test_...',  // Stripe session ID
  customerEmail: 'user@example.com'  // Optional
}
```

### How It's Created

After successful Stripe payment, the `/api/payments/verify-session` endpoint creates the pass:

```javascript
// In pages/api/payments/verify-session.js
const processingPass = {
  valid: true,
  type: productType,  // 'processing-pass' (day pass) or 'pro'
  createdAt: Date.now(),
  expiresAt: Date.now() + (24 * 60 * 60 * 1000),  // 24 hours
  sessionId: session.id,
  customerEmail: session.customer_email
};
```

Then stored in localStorage:

```javascript
// In pages/payment/success.jsx
localStorage.setItem('processingPass', JSON.stringify(data.processingPass));
```

---

## 🔍 How to Check User Plan in Your Tool

### Step 1: Import Required Functions

```javascript
import { 
  getUserPlan, 
  hasValidProcessingPass,
  checkPaymentRequirement,
  getToolLimits
} from '@/lib/config/pricing';
```

### Step 2: Load Processing Pass from localStorage

```javascript
const [userSession, setUserSession] = useState({ processingPass: null });

useEffect(() => {
  if (typeof window !== 'undefined') {
    const passData = localStorage.getItem('processingPass');
    if (passData) {
      try {
        const pass = JSON.parse(passData);
        const session = { processingPass: pass };
        
        // Check if pass is still valid (not expired)
        if (hasValidProcessingPass(session)) {
          setUserSession(session);
        } else {
          // Pass expired, remove it
          localStorage.removeItem('processingPass');
          setUserSession({ processingPass: null });
        }
      } catch (e) {
        // Invalid pass data, remove it
        localStorage.removeItem('processingPass');
        setUserSession({ processingPass: null });
      }
    }
  }
}, []);
```

### Step 3: Get User Plan

```javascript
const userPlan = getUserPlan(userSession);
// Returns: 'free' | 'day_pass' | 'pro'
```

### Step 4: Check Payment Requirements

```javascript
const totalSize = files.reduce((sum, file) => sum + file.size, 0);
const fileCount = files.length;
const toolType = 'image'; // or 'pdf', 'video'

const requirement = checkPaymentRequirement(
  toolType,      // 'pdf', 'image', or 'video'
  totalSize,     // Total file size in bytes
  fileCount,     // Number of files
  userPlan       // 'free', 'day_pass', or 'pro'
);

if (requirement.requiresPayment) {
  // Show payment modal
  setShowPaymentModal(true);
  setPaymentRequirement(requirement);
} else {
  // User can proceed (either free tier or has paid plan)
  processFiles();
}
```

---

## 🎯 Complete Example: Image to PDF Tool

```javascript
import { 
  getUserPlan, 
  hasValidProcessingPass,
  checkPaymentRequirement 
} from '@/lib/config/pricing';

export default function ImageToPDF() {
  const [userSession, setUserSession] = useState({ processingPass: null });
  const [imageFiles, setImageFiles] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentRequirement, setPaymentRequirement] = useState(null);

  // Load processing pass on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const passData = localStorage.getItem('processingPass');
      if (passData) {
        try {
          const pass = JSON.parse(passData);
          const session = { processingPass: pass };
          if (hasValidProcessingPass(session)) {
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

  // Handle file upload
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    const fileCount = files.length;

    // Get user plan
    const userPlan = getUserPlan(userSession);

    // Check payment requirement
    const requirement = checkPaymentRequirement(
      'image',      // Tool type
      totalSize,    // Total file size
      fileCount,    // Number of files
      userPlan      // User's plan
    );

    // If payment required, show modal
    if (requirement.requiresPayment) {
      setPaymentRequirement(requirement);
      setShowPaymentModal(true);
      return; // Don't set files yet
    }

    // User can proceed - set files
    setImageFiles(files);
  };

  // Handle payment success (after user pays)
  const handlePaymentSuccess = () => {
    // Reload processing pass from localStorage
    const passData = localStorage.getItem('processingPass');
    if (passData) {
      try {
        const pass = JSON.parse(passData);
        setUserSession({ processingPass: pass });
      } catch (e) {
        // Invalid pass
      }
    }
    setShowPaymentModal(false);
    
    // Retry conversion if files are already selected
    if (imageFiles.length > 0) {
      convertImagesToPDF();
    }
  };

  // Convert images to PDF
  const convertImagesToPDF = async () => {
    // Check payment requirement again before processing
    const totalSize = imageFiles.reduce((sum, file) => sum + file.size, 0);
    const fileCount = imageFiles.length;
    const userPlan = getUserPlan(userSession);
    
    const requirement = checkPaymentRequirement('image', totalSize, fileCount, userPlan);

    if (requirement.requiresPayment) {
      setPaymentRequirement(requirement);
      setShowPaymentModal(true);
      return;
    }

    // Proceed with conversion...
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

## 🔑 Key Functions Reference

### `getUserPlan(session)`

Determines user's current plan based on processing pass.

```javascript
import { getUserPlan } from '@/lib/config/pricing';

const userPlan = getUserPlan(userSession);
// Returns: 'free' | 'day_pass' | 'pro'
```

**Logic:**
- If no session or no processing pass → `'free'`
- If processing pass type is `'pro'` → `'pro'`
- If processing pass type is `'processing-pass'` or `'day_pass'` → `'day_pass'`
- Otherwise → `'free'`

### `hasValidProcessingPass(session)`

Checks if processing pass exists and is not expired.

```javascript
import { hasValidProcessingPass } from '@/lib/config/pricing';

const isValid = hasValidProcessingPass(userSession);
// Returns: true | false
```

**Checks:**
- Session exists
- Processing pass exists
- Pass is valid (`valid: true`)
- Pass hasn't expired (`expiresAt > now`)

### `checkPaymentRequirement(toolType, fileSizeBytes, fileCount, plan)`

Checks if payment is required for an operation.

```javascript
import { checkPaymentRequirement } from '@/lib/config/pricing';

const requirement = checkPaymentRequirement(
  'image',        // Tool type: 'pdf', 'image', or 'video'
  5242880,        // File size in bytes (5MB)
  2,              // Number of files
  'free'          // User plan: 'free', 'day_pass', or 'pro'
);
```

**Returns:**
```javascript
{
  requiresPayment: true | false,
  reason: 'file_size' | 'batch' | null,
  fileSize: 5242880,
  fileCount: 2,
  maxFreeSize: 5242880,      // 5MB for images
  maxFreeBatch: 1,            // 1 file for free tier
  withinGracePeriod: false,
  plan: 'free'
}
```

**Logic:**
- If plan is `'day_pass'` or `'pro'` → `requiresPayment: false`
- If plan is `'free'`:
  - Check file size against free limits
  - Check batch count against free limits
  - Apply grace rules (20% overage buffer)
  - Return requirement object

### `getToolLimits(toolType, plan)`

Gets tool-specific limits for a plan.

```javascript
import { getToolLimits } from '@/lib/config/pricing';

const limits = getToolLimits('image', 'free');
// Returns:
// {
//   max_file_size_mb: 5,
//   max_files_per_job: 1,
//   max_jobs_per_day: 10,
//   max_output_resolution_px: 2048,
//   batch: false
// }

const paidLimits = getToolLimits('image', 'day_pass');
// Returns:
// {
//   max_file_size_mb: 100,
//   max_files_per_job: 50,
//   max_jobs_per_day: 500,
//   max_output_resolution_px: 8192,
//   batch: true
// }
```

---

## 📊 Plan Comparison

| Feature | Free | Day Pass ($3.99) | Pro ($7.99/mo) |
|---------|------|------------------|----------------|
| **PDF Tools** | | | |
| Max file size | 10MB | 500MB | 500MB |
| Max files/job | 1 | 20 | 20 |
| Batch processing | ❌ | ✅ | ✅ |
| OCR | ❌ | ✅ | ✅ |
| **Image Tools** | | | |
| Max file size | 5MB | 100MB | 100MB |
| Max files/job | 1 | 50 | 50 |
| Batch processing | ❌ | ✅ | ✅ |
| **Video Tools** | | | |
| Max file size | 50MB | 500MB | 500MB |
| Max files/job | 1 | 5 | 5 |
| Batch processing | ❌ | ✅ | ✅ |
| Watermark | ✅ | ❌ | ❌ |
| **Duration** | N/A | 24 hours | Monthly |

---

## 🛡️ Security Considerations

### Client-Side Validation

⚠️ **Important:** All payment checks happen client-side. This is acceptable for:
- User experience (immediate feedback)
- UI/UX (showing payment modals)

### Server-Side Validation (Recommended)

For production, you should also validate on the server:

```javascript
// In your API route (e.g., /api/pdf/convert)
export default async function handler(req, res) {
  const { fileSize, fileCount } = req.body;
  
  // Get processing pass from request (could be in header or body)
  const passData = req.headers['x-processing-pass'];
  let userPlan = 'free';
  
  if (passData) {
    try {
      const pass = JSON.parse(passData);
      if (hasValidProcessingPass({ processingPass: pass })) {
        userPlan = getUserPlan({ processingPass: pass });
      }
    } catch (e) {
      // Invalid pass
    }
  }
  
  // Check limits server-side
  const requirement = checkPaymentRequirement('pdf', fileSize, fileCount, userPlan);
  
  if (requirement.requiresPayment) {
    return res.status(402).json({ 
      error: 'Payment required',
      requirement 
    });
  }
  
  // Proceed with processing...
}
```

---

## 🔄 Payment Success Flow

1. **User completes payment** → Stripe redirects to `/payment/success?session_id=cs_...&return=/pdf/image-to-pdf`

2. **Success page verifies payment:**
   ```javascript
   // pages/payment/success.jsx
   const response = await fetch('/api/payments/verify-session', {
     method: 'POST',
     body: JSON.stringify({ sessionId })
   });
   ```

3. **API verifies with Stripe:**
   ```javascript
   // pages/api/payments/verify-session.js
   const session = await stripe.checkout.sessions.retrieve(sessionId);
   if (session.payment_status === 'paid') {
     // Create processing pass
     const processingPass = { ... };
     return { valid: true, processingPass };
   }
   ```

4. **Success page stores pass:**
   ```javascript
   localStorage.setItem('processingPass', JSON.stringify(data.processingPass));
   ```

5. **User redirected back to tool:**
   ```javascript
   router.push(returnUrl); // e.g., /pdf/image-to-pdf
   ```

6. **Tool checks localStorage on mount:**
   ```javascript
   useEffect(() => {
     const passData = localStorage.getItem('processingPass');
     // Load and validate pass
   }, []);
   ```

---

## ✅ Quick Checklist for New Tools

When adding payment support to a new tool:

- [ ] Import `getUserPlan`, `hasValidProcessingPass`, `checkPaymentRequirement` from `@/lib/config/pricing`
- [ ] Add state for `userSession` with `processingPass: null`
- [ ] Load processing pass from localStorage in `useEffect`
- [ ] Check payment requirement before processing files
- [ ] Show `PaymentModal` if payment required
- [ ] Handle payment success callback to reload pass
- [ ] Re-check payment requirement after payment success
- [ ] Use correct `toolType` ('pdf', 'image', or 'video')

---

## 🐛 Debugging

### Check if user has valid pass:

```javascript
// In browser console
const pass = JSON.parse(localStorage.getItem('processingPass'));
console.log('Pass:', pass);
console.log('Expires:', new Date(pass.expiresAt));
console.log('Valid:', pass.valid && pass.expiresAt > Date.now());
```

### Check user plan:

```javascript
import { getUserPlan } from '@/lib/config/pricing';
const userPlan = getUserPlan({ processingPass: pass });
console.log('User plan:', userPlan);
```

### Check payment requirement:

```javascript
import { checkPaymentRequirement } from '@/lib/config/pricing';
const req = checkPaymentRequirement('image', 10485760, 2, 'free');
console.log('Requirement:', req);
```

---

**Last Updated:** January 2026  
**Maintained By:** FixTools Development Team


