# Tool Page Template & Implementation Guide

**Last Updated**: December 31, 2025  
**Status**: Production-ready template based on `/html/html-minify`

---

## 🎯 Purpose

This document provides the **definitive template** for all tool pages across FixTools. It solves the "zoomed in" appearance issue caused by global CSS conflicts and provides a consistent, SEO-optimized structure.

---

## 🐛 Critical Fix: The Font-Size Problem

### The Problem
The global CSS (`/styles/globals.css`) contains:
```css
html {
  font-size: 62.5% !important;  /* Makes 1rem = 10px */
}
body {
  font-size: 1.6rem !important; /* 16px base for old pages */
}
```

This **breaks Tailwind CSS utilities** because:
- Tailwind expects `1rem = 16px` (browser default)
- With `font-size: 62.5%`, all Tailwind spacing/sizing is scaled down by 37.5%
- Result: Everything looks "zoomed in" or incorrectly sized

### The Solution
Wrap each tool page in a container class (e.g., `.html-minify-page`) and reset the font-size base:

```jsx
<style jsx global>{`
  .html-minify-page,
  .html-minify-page * {
    font-size: inherit;
  }
  
  .html-minify-page {
    font-size: 16px !important;
    font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
    line-height: 1.5 !important;
    width: 100%;
    min-height: 100vh;
  }
  
  .html-minify-page * {
    box-sizing: border-box;
  }
  
  .html-minify-page button {
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
    margin: 0;
    padding: 0;
    border: none;
    background: none;
    cursor: pointer;
  }
`}</style>

<div className="html-minify-page bg-[#fbfbfc] text-slate-900 min-h-screen">
  {/* All tool page content */}
</div>
```

---

## 📋 Template Structure

### 1. **Imports**
```jsx
import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
```

### 2. **Page Wrapper**
```jsx
export default function ToolName() {
  // State management here
  const currentYear = new Date().getFullYear();
  
  return (
    <>
      <Head>
        {/* SEO meta tags */}
      </Head>

      <style jsx global>{`
        /* Font-size reset - CRITICAL */
      `}</style>

      <div className="UNIQUE-PAGE-CLASS bg-[#fbfbfc] text-slate-900 min-h-screen">
        {/* Page sections */}
      </div>
    </>
  );
}
```

### 3. **Page Sections (in order)**

#### A. Header (Sticky Navigation)
```jsx
<header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
  <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
    <Link href="/" className="flex items-center gap-3">
      <Image src="/fixtools-logos/fixtools-logos_black.svg" alt="FixTools" width={120} height={40} className="h-9 w-auto" />
    </Link>
    <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
      <Link className="hover:text-slate-900" href="/categories/developer-tools">Developer</Link>
      <Link className="hover:text-slate-900" href="/categories/seo-tools">SEO</Link>
      <Link className="hover:text-slate-900" href="/categories/css-tools">CSS</Link>
      <Link className="hover:text-slate-900" href="/">All tools</Link>
    </nav>
    <Link href="/" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50">
      Browse tools
    </Link>
  </div>
</header>
```

#### B. Hero Section
```jsx
<section className="relative overflow-hidden">
  <div className="absolute inset-0 opacity-[0.35]" style={{ backgroundImage: 'url(/grid.png)', backgroundSize: '256px 256px' }}></div>
  <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-10 md:grid-cols-12 md:py-14">
    <div className="relative z-10 md:col-span-7">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm">
        <span className="inline-block h-2 w-2 rounded-full bg-emerald-500"></span>
        Free • Fast • Privacy-first
      </div>
      
      {/* H1 Title */}
      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
        [TOOL NAME]
      </h1>
      
      {/* Description */}
      <p className="mt-3 max-w-xl text-base leading-7 text-slate-600 md:text-lg">
        [Tool description - what it does, why it's useful]
      </p>

      {/* CTA Buttons */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <a href="#tool" className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
          ⚡ [Action Verb]
        </a>
        <a href="#how" className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50">
          How it works
        </a>
      </div>

      {/* Stats Cards (4 column grid) */}
      <dl className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <dt className="text-xs font-semibold text-slate-500">Output</dt>
          <dd className="mt-1 text-sm font-semibold">[Output type]</dd>
        </div>
        {/* 3 more stat cards */}
      </dl>
    </div>

    {/* Hero Image (right side) */}
    <div className="relative z-10 md:col-span-5">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
        <Image src="/hero.png" alt="[Tool] preview" width={600} height={450} className="w-full" />
      </div>
    </div>
  </div>
</section>
```

#### C. Tool UI Section
```jsx
<section id="tool" className="mx-auto max-w-6xl px-4 pb-12 pt-2">
  <div className="rounded-3xl border border-slate-200 bg-white p-5 md:p-7" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
    {/* Header with action buttons */}
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">[Tool action] online</h2>
        <p className="mt-1 text-sm text-slate-600">[Instructions]</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {/* Action buttons */}
      </div>
    </div>

    {/* Input/Output Grid (8 columns input, 4 columns options) */}
    <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-12">
      <div className="md:col-span-8">
        <label className="mb-2 block text-sm font-semibold text-slate-800">Input [Type]</label>
        <textarea className="h-64 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-900/20" placeholder="[Placeholder]" />
      </div>
      <div className="md:col-span-4">
        <label className="mb-2 block text-sm font-semibold text-slate-800">Options</label>
        {/* Tool-specific options */}
      </div>
    </div>

    {/* Output Section */}
    <div className="mt-6">
      {/* Output textarea and copy/download buttons */}
    </div>
  </div>
</section>
```

#### D. How It Works Section
```jsx
<section id="how" className="mx-auto max-w-6xl px-4 pb-12">
  <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
    <div className="md:col-span-7">
      <h2 className="text-2xl font-semibold text-slate-900">How it works</h2>
      <p className="mt-2 text-slate-600">[Brief explanation]</p>

      <ol className="mt-4 space-y-3">
        <li className="flex gap-3">
          <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-xl bg-slate-900 text-sm font-semibold text-white">1</span>
          <div>
            <p className="font-semibold">[Step 1 title]</p>
            <p className="text-sm text-slate-600">[Step 1 description]</p>
          </div>
        </li>
        {/* Steps 2 and 3 */}
      </ol>
    </div>

    <div className="md:col-span-5">
      <div className="rounded-3xl border border-slate-200 bg-white p-6" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
        <h3 className="text-lg font-semibold">Why use [Tool]?</h3>
        <ul className="mt-3 space-y-2 text-sm text-slate-700">
          <li>• [Benefit 1]</li>
          <li>• [Benefit 2]</li>
          <li>• [Benefit 3]</li>
          <li>• [Benefit 4]</li>
          <li>• [Benefit 5]</li>
        </ul>
      </div>
    </div>
  </div>
</section>
```

#### E. FAQ Section
```jsx
<section className="mx-auto max-w-6xl px-4 pb-12">
  <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
    <h2 className="text-2xl font-semibold text-slate-900">Frequently Asked Questions</h2>
    <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
      <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4" open>
        <summary className="cursor-pointer text-sm font-semibold text-slate-900">[Question 1]</summary>
        <p className="mt-2 text-sm text-slate-600">[Answer 1]</p>
      </details>
      {/* 3 more FAQ items */}
    </div>
  </div>
</section>
```

#### F. Related Tools Section
```jsx
<section className="mx-auto max-w-6xl px-4 pb-16">
  <h2 className="text-xl font-semibold text-slate-900">Related tools</h2>
  <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
    <Link href="/[tool-1]" className="group rounded-3xl border border-slate-200 bg-white p-5 hover:border-slate-300" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
      <p className="text-sm font-semibold">[Tool 1 Name]</p>
      <p className="mt-1 text-sm text-slate-600">[Tool 1 description]</p>
      <p className="mt-3 text-sm font-semibold text-slate-900 underline underline-offset-4">Open tool →</p>
    </Link>
    {/* 2 more related tools */}
  </div>
</section>
```

#### G. Footer
```jsx
<footer className="border-t border-slate-200 bg-white">
  <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 md:flex-row md:items-center md:justify-between">
    <p className="text-sm text-slate-600">© {currentYear} FixTools.io • Free online tools</p>
    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
      <Link className="hover:text-slate-900" href="/privacy">Privacy</Link>
      <Link className="hover:text-slate-900" href="/terms">Terms</Link>
      <Link className="hover:text-slate-900" href="/">All tools</Link>
    </div>
  </div>
</footer>
```

---

## 🎨 Design System Reference

### Colors (Tailwind classes)
- **Background**: `bg-[#fbfbfc]` (page), `bg-white` (cards), `bg-slate-50` (inputs)
- **Text**: `text-slate-900` (primary), `text-slate-600` (secondary), `text-slate-500` (labels)
- **Borders**: `border-slate-200`
- **Accent**: `bg-emerald-500` (success), `bg-slate-900` (primary buttons)

### Typography
- **H1**: `text-4xl md:text-5xl font-semibold`
- **H2**: `text-xl` to `text-2xl font-semibold`
- **Body**: `text-sm` to `text-base`
- **Labels**: `text-xs` to `text-sm font-semibold`

### Spacing
- **Max width**: `max-w-6xl` (1152px)
- **Padding**: `px-4` (horizontal), `py-10 md:py-14` (vertical sections)
- **Gaps**: `gap-3`, `gap-4`, `gap-6`, `gap-8`

### Border Radius
- **Small**: `rounded-xl` (12px)
- **Medium**: `rounded-2xl` (16px)
- **Large**: `rounded-3xl` (24px)
- **Full**: `rounded-full` (pill badges)

### Shadows
- **Soft shadow**: `style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}`
- Use on: cards, hero image, related tools

---

## 🚀 Implementation Checklist

When creating a new tool page:

- [ ] **Copy the template** from `/pages/html/html-minify.jsx`
- [ ] **Change wrapper class** (e.g., `.html-minify-page` → `.json-formatter-page`)
- [ ] **Update all content**:
  - [ ] Page title and meta description
  - [ ] H1 heading
  - [ ] Hero description
  - [ ] CTA button text
  - [ ] Tool-specific options/controls
  - [ ] Processing logic function
  - [ ] "How it works" 3 steps
  - [ ] "Why use this?" 5 benefits
  - [ ] 4 FAQ items
  - [ ] 3 related tools
- [ ] **Test functionality**:
  - [ ] Input/output works correctly
  - [ ] Copy button works
  - [ ] Download button works
  - [ ] All links navigate correctly
- [ ] **Test responsive design**: Mobile (375px), Tablet (768px), Desktop (1200px+)
- [ ] **Check linting**: No console errors, proper TypeScript/ESLint compliance
- [ ] **Verify SEO**: Proper heading hierarchy (H1 → H2 → H3), meta tags, structured data

---

## 📝 Naming Convention

Use kebab-case for wrapper classes based on route:
- `/html/html-minify` → `.html-minify-page`
- `/json/json-formatter` → `.json-formatter-page`
- `/css-tool/minify-css` → `.css-minify-page`
- `/seo-tools/sitemap-generator` → `.sitemap-generator-page`

---

## 🔧 Tool-Specific Customizations

### For Formatter/Beautifier Tools
- Default checkboxes: Indent size, Tab width, Add line breaks
- Output: Syntax-highlighted if possible
- Related tools: Minifier, Validator, Converter

### For Minifier/Compressor Tools
- Default checkboxes: Remove comments, Remove whitespace, Preserve strings
- Show before/after stats (bytes saved, %)
- Related tools: Formatter, Beautifier, Compressor

### For Generator Tools
- Options panel should have interactive controls (color pickers, sliders, dropdowns)
- Live preview if possible
- Related tools: Other generators in same category

### For Converter Tools
- Two textareas: Input format → Output format
- Format selection dropdowns
- Related tools: Other converters

---

## 🐛 Common Issues & Fixes

### Issue: Page looks "zoomed in" or incorrectly sized
**Fix**: Ensure the wrapper div has the font-size reset in `<style jsx global>`

### Issue: Tailwind classes not applying
**Fix**: 
1. Check Tailwind CDN is loaded in `_document.js`
2. Verify wrapper class has font-size reset
3. Clear Next.js cache: `rm -rf .next && npm run dev`

### Issue: Global CSS interfering with design
**Fix**: Add more specific resets in the `<style jsx global>` block:
```css
.tool-page-class button,
.tool-page-class input,
.tool-page-class textarea {
  /* Reset interfering global styles */
}
```

### Issue: Images not loading
**Fix**: 
1. Verify image exists in `/public/` directory
2. Use Next.js `<Image>` component with proper width/height
3. Image path must start with `/` (e.g., `/hero.png`)

---

## 📊 SEO Best Practices

### Meta Tags (Required)
```jsx
<Head>
  <meta charSet="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>[Tool Name] – [Short Description] | FixTools</title>
  <meta name="description" content="[150-160 character description with keywords]" />
  <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
  <meta property="og:title" content="[Tool Name] – [Description] | FixTools" />
  <meta property="og:description" content="[Same as description]" />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="[Tool screenshot URL]" />
</Head>
```

### Structured Data (FAQ Schema)
Add to `<Head>`:
```jsx
<script type="application/ld+json">
{JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "[Question 1]",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "[Answer 1]"
      }
    }
    // ... more questions
  ]
})}
</script>
```

### Heading Hierarchy
- **One H1** per page (tool name)
- **H2** for major sections (How it works, FAQ, Related tools)
- **H3** for subsections within cards
- **Use semantic HTML**: `<section>`, `<article>`, `<nav>`, `<footer>`

---

## 🎯 Performance Optimization

1. **Use Next.js Image component** for automatic optimization
2. **Lazy load images** below the fold (default with Next.js)
3. **Minimize JavaScript**: Process data client-side when possible
4. **Avoid external dependencies**: Use vanilla JS for tool logic
5. **Prefetch related tool links**: Next.js does this automatically

---

## 📦 Files Required

For each tool page:
1. **JSX file**: `/pages/[category]/[tool-name].jsx`
2. **Hero image**: `/public/hero-[tool-name].png` (optional, can reuse `/hero.png`)
3. **Grid background**: `/public/grid.png` (shared across all tools)
4. **Icons**: `/public/icons.svg` (shared)

---

## 🔗 Related Documentation

- **Homepage design**: `/PHASE1_HERO_COMPLETE.md`
- **HTML Minify redesign**: `/SESSION_HANDOFF_HTML_MINIFY.md`
- **Tool page redesign notes**: `/TOOL_PAGE_REDESIGN.md`
- **Quick start guide**: `/QUICK_START.md`

---

## 🎓 Example: Creating a JSON Formatter Page

1. Copy `/pages/html/html-minify.jsx` to `/pages/json/json-formatter.jsx`
2. Find/replace: `html-minify-page` → `json-formatter-page`
3. Update content:
   - H1: "JSON Formatter"
   - Description: "Format and beautify JSON..."
   - Options: Indent size (2 spaces, 4 spaces, tabs), Sort keys, Validate
   - Logic: `JSON.parse()` and `JSON.stringify()`
4. Update related tools: JSON Minifier, JSON Validator, JSON to CSV
5. Update FAQ: Questions about JSON validation, common errors, etc.

---

**End of Template Document**


