# Website Speed Test - Payment Strategy

**Date:** January 11, 2026  
**Tool:** Website Speed Test  
**Current Status:** Blocking batch processing before API call

---

## 🎯 Current Implementation

**Free Tier:**
- 1 URL per test
- 5 tests per day
- Full results for single URL

**Paid Tier:**
- Up to 20 URLs per batch
- 200 tests per day
- Full results for all URLs

**Current Behavior:**
- API blocks batch processing (2+ URLs) BEFORE making API calls
- Returns 402 Payment Required error
- User never sees results

---

## 💡 Recommended Strategy: "Freemium with Preview"

### **Option 1: Process but Limit Results (Recommended)**

**Free Tier Limits:**
- **1 URL:** Full results (current)
- **2-3 URLs:** Process all, but show LIMITED results:
  - ✅ Performance score only
  - ❌ Hide: Accessibility, Best Practices, SEO scores
  - ❌ Hide: Detailed Core Web Vitals breakdown
  - ❌ Hide: Performance metrics (FCP, Speed Index, TTI)
  - Show: "Upgrade to see full results" message

**Paid Tier:**
- **4+ URLs:** Require payment BEFORE processing
- **All URLs:** Full results after payment

**Benefits:**
- Users can see basic performance for 2-3 sites
- Creates value demonstration
- Encourages upgrade for full insights
- Prevents abuse (4+ URLs require payment)

---

### **Option 2: Process All, Paywall Results**

**Free Tier:**
- **1 URL:** Full results
- **2+ URLs:** Process all URLs, but show paywall overlay on results
- User must pay to view/download results

**Benefits:**
- Users see that processing worked
- Clear value before payment
- Can preview first result

**Drawbacks:**
- Uses API quota even if user doesn't pay
- More complex UI (paywall overlay)

---

### **Option 3: Strict Block (Current)**

**Free Tier:**
- **1 URL only:** Full results
- **2+ URLs:** Block before processing

**Benefits:**
- Simple implementation
- No wasted API calls
- Clear limits

**Drawbacks:**
- No value demonstration
- Less user-friendly

---

## 🎯 **RECOMMENDED: Option 1 - Process but Limit Results**

### Implementation Details

**Free Tier:**
1. **1 URL:** Full results ✅
2. **2-3 URLs:** 
   - Process all URLs
   - Show performance scores only
   - Hide detailed metrics
   - Show upgrade CTA
3. **4+ URLs:** Block before processing (require payment)

**Code Changes Needed:**

1. **API Route** (`pages/api/web-tools/website-speed-test.js`):
   ```javascript
   // Allow 2-3 URLs for free users, but mark as limited
   if (urlCount > 1 && urlCount <= 3 && userPlan === 'free') {
     // Process but return limited results
     return {
       success: true,
       results: results,
       limited: true, // Flag for limited results
       message: 'Upgrade to see full results for all URLs'
     };
   }
   
   // Block 4+ URLs for free users
   if (urlCount > 3 && userPlan === 'free') {
     return res.status(402).json({
       error: 'Payment required',
       message: 'Batch processing 4+ URLs requires a Processing Pass.',
       paymentRequired: true
     });
   }
   ```

2. **Frontend** (`pages/web-tools/website-speed-test.jsx`):
   - Check for `limited: true` flag
   - Show limited results UI
   - Display upgrade CTA
   - Hide detailed metrics for free users

---

## 📊 **Alternative: Tiered Approach**

### **Tier 1: Free (1 URL)**
- Full results
- All metrics visible

### **Tier 2: Preview (2-3 URLs)**
- Process all URLs
- Show performance scores only
- Hide detailed metrics
- Upgrade CTA

### **Tier 3: Paid (4+ URLs)**
- Require payment before processing
- Full results after payment

---

## ✅ **Final Recommendation**

**Use Option 1: Process but Limit Results**

**Thresholds:**
- **1 URL:** Free, full results
- **2-3 URLs:** Free, limited results (performance score only)
- **4+ URLs:** Require payment before processing

**Rationale:**
1. ✅ Demonstrates value (users see it works)
2. ✅ Encourages upgrade (they see partial results)
3. ✅ Prevents abuse (4+ URLs require payment)
4. ✅ Better UX than blocking completely
5. ✅ Uses API quota efficiently (only 2-3 free URLs max)

---

## 🔧 **Implementation Priority**

1. **Update API route** to allow 2-3 URLs for free users
2. **Add `limited` flag** to response
3. **Update frontend** to show limited results UI
4. **Add upgrade CTA** in limited results view
5. **Test payment flow** for 4+ URLs

---

## 📝 **User Experience Flow**

### **Free User - 2 URLs:**
1. User enters 2 URLs
2. Clicks "Test Speed"
3. API processes both URLs
4. Results show:
   - ✅ Performance scores (74, 82)
   - ❌ Accessibility, Best Practices, SEO (hidden)
   - ❌ Detailed metrics (hidden)
   - 💳 "Upgrade to see full results" button
5. User can upgrade to see all metrics

### **Free User - 4 URLs:**
1. User enters 4 URLs
2. Clicks "Test Speed"
3. Payment modal appears BEFORE processing
4. User pays → Processing starts
5. Full results shown after payment

---

**Status:** Ready for implementation  
**Priority:** High (improves conversion rate)

