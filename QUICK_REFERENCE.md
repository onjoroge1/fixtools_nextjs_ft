# FixTools - Quick Reference

**Last Updated:** January 2, 2026

---

## 📁 Essential Documents

| Document | Purpose | When to Read |
|----------|---------|--------------|
| **[README.md](./README.md)** | Project overview, setup, architecture | First time / onboarding |
| **[SESSION_HANDOFF.md](./SESSION_HANDOFF.md)** | Current status, what's done, what's next | Start of every session |
| **[DEVELOPMENT_PLAN.md](./DEVELOPMENT_PLAN.md)** | Complete roadmap, phases, sprints | Planning / strategic decisions |
| **[TOOL_TERMINOLOGY_GUIDE.md](./TOOL_TERMINOLOGY_GUIDE.md)** | Terminology standards by tool type | Building/fixing tools |
| **[TOOLS_MODERNIZATION_BLUEPRINT.md](./TOOLS_MODERNIZATION_BLUEPRINT.md)** | Complete tool building guide | Building new tools |
| **[DEEP_DIVE_PREVENTION_SYSTEM.md](./DEEP_DIVE_PREVENTION_SYSTEM.md)** | Audit system documentation | Understanding audit results |

---

## 🚀 Quick Start Commands

```bash
# Development
npm run dev                    # Start dev server (localhost:3000)
npm run build                  # Build for production
npm start                      # Run production build

# Quality Assurance
node audit-tool-terminology.js <file> <type>    # Audit single tool
node audit-all-tools.js                         # Audit all tools

# Tool Types: converter, formatter, validator, minifier
```

---

## 📊 Current Project Status

```
✅ Production-Ready: 34/48 tools (71%)
🔄 In Progress: 14/48 tools (29%)
📊 Total Issues: 2,119
🎯 Priority 1 (Batch Fix): 1,729 issues (82%)
🎯 Priority 2 (Partial): 204 issues (10%)
🎯 Priority 3 (Other): 149 issues (7%)
```

---

## 🎯 Immediate Next Actions

### **Step 1:** Investigate "247 Clone Pattern"
Read one converter (e.g., `csv-to-json.jsx`), confirm it matches json-to-xml's BEFORE state

### **Step 2:** Create Batch Fix Script
Use `json-to-xml.jsx` as template to fix 7 converters at once

### **Step 3:** Execute Batch Fix
Run script, re-audit, verify: 2,119 → ~400 issues

### **Step 4:** Complete Remaining Tools
Fix Priority 2 & 3 tools systematically

### **Step 5:** Final Verification
All tools 0 critical issues, test functionality

**Estimated Total Time:** 10-14 hours

---

## 🏗️ Tool Types & Terminology

| Type | Says | Never Says | Example |
|------|------|-----------|---------|
| **Converter** | convert, transform, integration | format, minify, beautify | JSON to XML |
| **Formatter** | format, beautify, readability | minify, compress | JSON Formatter |
| **Validator** | validate, check, errors | format, minify | JSON Validator |
| **Minifier** | minify, compress, optimize | format, beautify | JSON Minifier |

**Rule:** Never mix terminology on a single page.

---

## 📋 Common Fixes Pattern

**Problem:** Tool cloned from wrong type (e.g., converter uses formatter language)

**Fix Pattern:**
1. Function name: `FormatJSON()` → `[ToolName]Converter()`
2. Variables: `formatted` → `convertedOutput` or `xmlOutput`
3. Meta title: Remove "Format/Beautify" → "Convert/Transform"
4. Hero description: Rewrite for correct purpose
5. Benefits: Update to match tool type
6. Statistics: Update metrics to match tool type
7. FAQs: Replace with type-specific questions
8. Structured data: Update JSON-LD schemas

---

## 🎨 Design System

**Colors:**
- Primary: `from-emerald-500 to-green-600`
- Secondary: `from-blue-500 to-indigo-600`
- Accent: `from-purple-600 to-indigo-700`

**Components:**
- Hero: Animated gradient + feature cards
- CTA: Marquee-style with animation
- Cards: Hover effects, shadows, borders
- Buttons: Gradient backgrounds

**Typography:**
- Headings: `text-3xl` to `text-5xl`, bold
- Body: `text-slate-600` or `text-slate-700`

---

## 🔍 Priority Tools to Fix

### **Priority 1: "247 Clone Pattern"** (1,729 issues)
- base64-to-json.jsx
- csv-to-json.jsx
- json-to-base64.jsx
- json-to-csv.jsx
- json-to-text.jsx
- json-to-tsv.jsx
- xml-to-json.jsx

**Strategy:** Batch fix with script

### **Priority 2: Partial Fixes** (204 issues)
- json-to-xml.jsx (46 issues)
- tsv-to-json.jsx (87 issues)
- json-to-yaml.jsx (71 issues)

**Strategy:** Individual manual fixes

### **Priority 3: Other Types** (149 issues)
- json-validator.jsx (53 issues)
- minify-json.jsx (45 issues)
- html-minify.jsx (21 issues)
- json-formatter.jsx (30 issues)

**Strategy:** Individual manual fixes

---

## ✅ Quality Checklist

**Before Marking Tool Complete:**
- [ ] Run audit: 0 critical issues
- [ ] Test functionality: Tool works correctly
- [ ] Check mobile: Responsive on all screens
- [ ] Verify SEO: Meta tags, structured data present
- [ ] 8+ FAQs: All tool-specific
- [ ] 1,500+ words: Comprehensive content
- [ ] Correct terminology: No mixed language
- [ ] No broken links: All internal links work

---

## 🎯 Success Metrics

| Metric | Target | Current |
|--------|--------|---------|
| Tools with 0 issues | 100% | 71% |
| Average SEO score | 9/10 | 8.5/10 |
| Mobile responsive | 100% | 100% |
| Page load speed | <2s | ~1.5s |

---

## 📞 Getting Help

**Stuck? Check these in order:**

1. **SESSION_HANDOFF.md** - Current status, known issues
2. **TOOL_TERMINOLOGY_GUIDE.md** - Terminology standards
3. **TOOLS_MODERNIZATION_BLUEPRINT.md** - Complete building guide
4. **AUDIT_RESULTS_ANALYSIS.md** - Issue breakdown
5. **DEVELOPMENT_PLAN.md** - Long-term roadmap

**Still stuck?** Document the blocker for the next agent.

---

## 🔧 Useful Code Snippets

### **Surgical CSS Reset**
```jsx
<style jsx>{`
  /* Only affects this page */
  html:has(.tool-page) {
    font-size: 100% !important;
  }
`}</style>
<div className="tool-page">
  {/* Page content */}
</div>
```

### **Code Example (JSX-safe)**
```jsx
<code>{`{ "key": "value" }`}</code>
```

### **Marquee CTA**
```jsx
<div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-indigo-700 to-blue-800 p-12">
  <h2>Ready to Learn More?</h2>
  <Link href="/learn/json">Start Learning →</Link>
</div>
```

---

## 📈 Session Progress Template

**Use this to track your session:**

```markdown
## Session [Date]

**Duration:** [X] hours

**Goals:**
- [ ] Goal 1
- [ ] Goal 2
- [ ] Goal 3

**Accomplished:**
- ✅ Task 1
- ✅ Task 2

**Issues Encountered:**
- Issue 1: [Description + solution]

**Next Steps:**
- Step 1
- Step 2

**Metrics:**
- Issues before: X
- Issues after: Y
- Reduction: Z%
```

---

## 🚨 Known Gotchas

### **1. JSX in Code Examples**
JSON/XML code with `{`, `:`, `<`, `>` breaks JSX parsing.  
**Fix:** Use template literals: `` {`{ "key": "value" }`} ``

### **2. Global CSS Conflicts**
`globals.css` sets `font-size: 62.5%` which breaks Tailwind.  
**Fix:** Add `.tool-page` class + surgical CSS reset.

### **3. Audit False Positives**
"Related Tools" links get flagged as errors.  
**Accept:** These are okay if clearly referencing OTHER tools.

### **4. Contextual "Format" Uses**
Phrases like "XML format" or "data format" are correct.  
**Accept:** When "format" is a noun (data structure), not verb (tool action).

---

## 🎉 You're Ready!

**Everything you need is documented.**

**Next action:** Open [SESSION_HANDOFF.md](./SESSION_HANDOFF.md) and start with Step 1.

---

**Good luck! 🚀**



