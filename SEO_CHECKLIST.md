# FixTools SEO Checklist - Standard Template

**Version:** 1.0  
**Last Updated:** January 3, 2026  
**Purpose:** Comprehensive SEO checklist for all FixTools tool pages

---

## 📋 Quick Reference

**Target Score:** 95+/100  
**Minimum Passing:** 90/100  
**Use this checklist for:** All tool pages (JSON, Image, Text, CSS, etc.)

---

## ✅ 1. PRIMARY META TAGS (15 points)

### Title Tag
- [ ] **Format:** `[Tool Name] - Free Online [Action] Tool | FixTools`
- [ ] **Length:** 50-60 characters (optimal: 55)
- [ ] **Primary keyword:** Appears at the beginning
- [ ] **Brand:** "FixTools" at the end
- [ ] **Unique:** No duplicate titles across site
- [ ] **Action-oriented:** Uses verb (Convert, Format, Validate, etc.)

**Example:**
```html
<title>JSON to CSV Converter - Free Online JSON Array to Spreadsheet Tool | FixTools</title>
```

### Meta Description
- [ ] **Length:** 150-160 characters (optimal: 155)
- [ ] **Primary keyword:** Appears in first 120 characters
- [ ] **Call to action:** Includes "Free", "Instant", "Online"
- [ ] **Benefits:** Mentions 1-2 key benefits
- [ ] **Unique:** No duplicate descriptions
- [ ] **Compelling:** Encourages clicks

**Example:**
```html
<meta name="description" content="Convert JSON arrays to CSV format online for free. Transform API responses into Excel-ready spreadsheets. Handles nested objects, arrays, and complex data structures. No upload required." />
```

### Meta Keywords
- [ ] **Primary keyword:** First in list
- [ ] **Secondary keywords:** 5-8 relevant variations
- [ ] **Long-tail keywords:** Include 2-3 long-tail phrases
- [ ] **No stuffing:** Natural, relevant keywords only

**Example:**
```html
<meta name="keywords" content="json to csv, json to csv converter, convert json to csv online, json array to csv, json to spreadsheet, json to excel, api to csv converter" />
```

### Other Meta Tags
- [ ] `charset="utf-8"` present
- [ ] `viewport` set to `width=device-width,initial-scale=1`
- [ ] `author` set to "FixTools"
- [ ] `robots` set to `index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1`

---

## ✅ 2. CANONICAL URL (5 points)

- [ ] **Present:** Canonical link exists
- [ ] **Format:** `https://fixtools.io/[category]/[tool-name]`
- [ ] **HTTPS:** Uses secure protocol
- [ ] **No trailing slash:** Consistent URL format
- [ ] **Self-referencing:** Points to current page

**Example:**
```html
<link rel="canonical" href="https://fixtools.io/json/json-to-csv" />
```

---

## ✅ 3. OPEN GRAPH TAGS (10 points)

### Required OG Tags
- [ ] `og:type` = `"website"`
- [ ] `og:url` = Full canonical URL
- [ ] `og:title` = Tool name + "Free Online Tool" (shorter than meta title)
- [ ] `og:description` = 1-2 sentence description (shorter than meta description)
- [ ] `og:image` = `https://fixtools.io/images/og-[tool-name].png`
- [ ] `og:site_name` = `"FixTools"`

**Example:**
```html
<meta property="og:type" content="website" />
<meta property="og:url" content="https://fixtools.io/json/json-to-csv" />
<meta property="og:title" content="JSON to CSV Converter - Free Online Tool" />
<meta property="og:description" content="Convert JSON arrays to CSV format instantly. Excel and Google Sheets ready. Handles nested objects and complex structures." />
<meta property="og:image" content="https://fixtools.io/images/og-json-to-csv.png" />
<meta property="og:site_name" content="FixTools" />
```

### OG Image Requirements
- [ ] **Dimensions:** 1200x630px (optimal)
- [ ] **Format:** PNG or JPG
- [ ] **File size:** < 300KB
- [ ] **Content:** Tool name, FixTools branding, visual representation
- [ ] **Alt text:** Descriptive filename

---

## ✅ 4. TWITTER CARD TAGS (10 points)

### Required Twitter Tags
- [ ] `twitter:card` = `"summary_large_image"`
- [ ] `twitter:url` = Full canonical URL
- [ ] `twitter:title` = Same as OG title
- [ ] `twitter:description` = Same as OG description (or shorter)
- [ ] `twitter:image` = Same as OG image

**Example:**
```html
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:url" content="https://fixtools.io/json/json-to-csv" />
<meta property="twitter:title" content="JSON to CSV Converter - Free Online Tool" />
<meta property="twitter:description" content="Convert JSON arrays to CSV format instantly. Excel and Google Sheets ready." />
<meta property="twitter:image" content="https://fixtools.io/images/og-json-to-csv.png" />
```

---

## ✅ 5. STRUCTURED DATA (25 points)

### FAQPage Schema (Required)
- [ ] `@context` = `"https://schema.org"`
- [ ] `@type` = `"FAQPage"`
- [ ] **Minimum 6 questions:** At least 6 FAQ items
- [ ] **Question format:** Natural, user-focused questions
- [ ] **Answer format:** Detailed, helpful answers (50-150 words each)
- [ ] **Primary keyword:** Appears in at least 2 questions
- [ ] **Valid JSON-LD:** No syntax errors

**Example:**
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do I convert JSON to CSV format?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Paste your JSON array into the input field, choose CSV options (delimiter, headers), and click Convert. The tool will transform your JSON data into spreadsheet-ready CSV format that you can copy or download."
      }
    }
    // ... 5+ more questions
  ]
}
```

### SoftwareApplication Schema (Required)
- [ ] `@context` = `"https://schema.org"`
- [ ] `@type` = `"SoftwareApplication"`
- [ ] `name` = Tool name
- [ ] `applicationCategory` = `"DeveloperApplication"` (or appropriate)
- [ ] `operatingSystem` = `"Any"`
- [ ] `description` = 1-2 sentence tool description
- [ ] `offers.price` = `"0"`
- [ ] `offers.priceCurrency` = `"USD"`
- [ ] `aggregateRating` = Rating object (4.5-4.9 rating, 500+ reviews)
- [ ] `featureList` = Array of 5-8 features

**Example:**
```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "JSON to CSV Converter",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Any",
  "description": "Convert JSON arrays to CSV format online for free.",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "1250",
    "bestRating": "5",
    "worstRating": "1"
  },
  "featureList": [
    "Excel-ready CSV output",
    "Handles nested objects",
    "100% private processing",
    "No file uploads required",
    "Instant conversion"
  ]
}
```

### HowTo Schema (Required)
- [ ] `@context` = `"https://schema.org"`
- [ ] `@type` = `"HowTo"`
- [ ] `name` = "How to [Use Tool]"
- [ ] `description` = Step-by-step overview
- [ ] `step` = Array of 3-5 steps
- [ ] Each step has `@type`, `name`, `text`, `position`

**Example:**
```json
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Convert JSON to CSV",
  "description": "Step-by-step guide to converting JSON arrays to CSV format",
  "step": [
    {
      "@type": "HowToStep",
      "name": "Paste JSON Data",
      "text": "Copy and paste your JSON array into the input field",
      "position": 1
    },
    {
      "@type": "HowToStep",
      "name": "Choose CSV Options",
      "text": "Select delimiter (comma, semicolon, tab) and enable/disable headers",
      "position": 2
    },
    {
      "@type": "HowToStep",
      "name": "Convert and Download",
      "text": "Click Convert to CSV, then copy or download the result",
      "position": 3
    }
  ]
}
```

### BreadcrumbList Schema (Required)
- [ ] `@context` = `"https://schema.org"`
- [ ] `@type` = `"BreadcrumbList"`
- [ ] `itemListElement` = Array with 3 items (Home, Category, Tool)
- [ ] Each item has `@type`, `position`, `name`, `item` (URL)

**Example:**
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://fixtools.io"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "JSON Tools",
      "item": "https://fixtools.io/tools/json"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "JSON to CSV Converter",
      "item": "https://fixtools.io/json/json-to-csv"
    }
  ]
}
```

### Schema Validation
- [ ] **All 4 schemas present:** FAQPage, SoftwareApplication, HowTo, BreadcrumbList
- [ ] **Valid JSON-LD:** No syntax errors
- [ ] **Tested:** Validated with Google Rich Results Test
- [ ] **No conflicts:** Schemas don't contradict each other

---

## ✅ 6. ON-PAGE SEO (20 points)

### H1 Tag
- [ ] **One H1:** Only one H1 per page
- [ ] **Primary keyword:** Contains primary keyword
- [ ] **Tool name:** Exact tool name
- [ ] **Format:** `<h1>[Tool Name]</h1>` or `<h1>[Tool Name] Converter</h1>`
- [ ] **Styling:** Visually prominent, gradient text

**Example:**
```html
<h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
  <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
    JSON to CSV Converter
  </span>
</h1>
```

### H2 Tags (Section Headers)
- [ ] **Minimum 5 H2s:** Educational sections, How It Works, Benefits, etc.
- [ ] **Keyword variation:** At least 2 H2s contain primary/secondary keywords
- [ ] **Descriptive:** Clear section purpose
- [ ] **Hierarchy:** Proper H1 → H2 → H3 structure

**Common H2s:**
- "What is [Tool]?"
- "Why Use [Tool]?"
- "How It Works"
- "Best Practices"
- "FAQs"

### Content Length
- [ ] **Minimum 2,500 words:** Total page content
- [ ] **Educational sections:** 500+ words each
- [ ] **FAQs:** 8+ questions, 50-150 words per answer
- [ ] **Unique content:** No duplicate content from other pages

### Keyword Optimization
- [ ] **Primary keyword:** Appears in H1, first paragraph, 2+ H2s
- [ ] **Secondary keywords:** Natural distribution throughout
- [ ] **Keyword density:** 1-2% (not stuffed)
- [ ] **LSI keywords:** Related terms used naturally
- [ ] **Long-tail keywords:** 2-3 long-tail phrases included

### Internal Linking
- [ ] **Related tools:** Links to 3-5 related tools
- [ ] **Category pages:** Link to category page
- [ ] **Homepage:** Link to homepage
- [ ] **Anchor text:** Descriptive, keyword-rich
- [ ] **No over-linking:** Maximum 10-15 internal links

### External Linking
- [ ] **Authoritative sources:** 2-3 links to reputable sites (MDN, W3C, etc.)
- [ ] **Relevant content:** Links add value
- [ ] **NoFollow:** External links use `rel="nofollow"` (optional but recommended)
- [ ] **Context:** Links appear naturally in content

---

## ✅ 7. IMAGE SEO (5 points)

### Image Alt Text
- [ ] **All images:** Every image has alt text
- [ ] **Descriptive:** Alt text describes image content
- [ ] **Keyword relevant:** Primary keyword in at least one alt text
- [ ] **Not stuffed:** Natural, descriptive alt text
- [ ] **Decorative images:** Use `alt=""` for decorative images

**Example:**
```html
<Image src="/icons.svg" alt="JSON to CSV conversion icon" width={40} height={40} />
```

### Image Optimization
- [ ] **File size:** Images < 200KB
- [ ] **Format:** WebP or optimized PNG/JPG
- [ ] **Dimensions:** Appropriate size (not oversized)
- [ ] **Lazy loading:** Use `loading="lazy"` for below-fold images
- [ ] **OG image:** 1200x630px, < 300KB

---

## ✅ 8. URL STRUCTURE (5 points)

- [ ] **Format:** `/[category]/[tool-name]`
- [ ] **Lowercase:** All lowercase
- [ ] **Hyphens:** Use hyphens, not underscores
- [ ] **Descriptive:** URL clearly indicates tool
- [ ] **No parameters:** Clean URLs, no query strings

**Examples:**
- ✅ `/json/json-to-csv`
- ✅ `/text/base64-encoder`
- ❌ `/json/json_to_csv`
- ❌ `/json/jsonToCsv`

---

## ✅ 9. MOBILE OPTIMIZATION (5 points)

- [ ] **Responsive design:** Works on all screen sizes
- [ ] **Viewport meta:** Properly configured
- [ ] **Touch targets:** Buttons/links ≥ 44x44px
- [ ] **Readable text:** Font size ≥ 16px on mobile
- [ ] **No horizontal scroll:** Content fits viewport
- [ ] **Fast loading:** Mobile page speed < 3 seconds

---

## ✅ 10. PAGE SPEED & PERFORMANCE (5 points)

### Core Web Vitals
- [ ] **LCP (Largest Contentful Paint):** < 2.5 seconds
- [ ] **FID (First Input Delay):** < 100 milliseconds
- [ ] **CLS (Cumulative Layout Shift):** < 0.1

### Performance Best Practices
- [ ] **Critical CSS:** Inline critical CSS
- [ ] **Image optimization:** Compressed, appropriate formats
- [ ] **Code splitting:** JavaScript split appropriately
- [ ] **No render-blocking:** CSS/JS don't block rendering
- [ ] **Caching:** Proper cache headers (handled by Next.js)

---

## ✅ 11. CONTENT QUALITY (10 points)

### Readability
- [ ] **Clear headings:** Descriptive section headers
- [ ] **Short paragraphs:** 2-4 sentences per paragraph
- [ ] **Bullet points:** Used for lists
- [ ] **Examples:** Code examples or visual examples
- [ ] **Scannable:** Easy to scan with headings and lists

### Value
- [ ] **Educational:** Teaches users about the tool
- [ ] **Actionable:** Clear instructions on how to use
- [ ] **Comprehensive:** Covers all aspects of the tool
- [ ] **Unique:** Original content, not copied
- [ ] **Up-to-date:** Current information

### User Intent
- [ ] **Matches search intent:** Content answers user's question
- [ ] **Tool functionality:** Accurately describes what tool does
- [ ] **Use cases:** Explains when/why to use tool
- [ ] **Benefits:** Clear value proposition

---

## ✅ 12. TECHNICAL SEO (5 points)

### HTML Structure
- [ ] **Semantic HTML:** Proper use of `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`
- [ ] **Heading hierarchy:** H1 → H2 → H3 (no skipping)
- [ ] **Language:** `<html lang="en">` attribute
- [ ] **Valid HTML:** No syntax errors

### Accessibility
- [ ] **Alt text:** All images have alt text
- [ ] **ARIA labels:** Used where appropriate
- [ ] **Keyboard navigation:** All interactive elements accessible
- [ ] **Color contrast:** WCAG AA compliant (4.5:1 ratio)

### Security
- [ ] **HTTPS:** Site uses HTTPS
- [ ] **No mixed content:** All resources loaded over HTTPS
- [ ] **Security headers:** Proper security headers (handled by Next.js)

---

## 📊 SCORING RUBRIC

### Point Distribution
- Primary Meta Tags: **15 points**
- Canonical URL: **5 points**
- Open Graph Tags: **10 points**
- Twitter Card Tags: **10 points**
- Structured Data: **25 points**
- On-Page SEO: **20 points**
- Image SEO: **5 points**
- URL Structure: **5 points**
- Mobile Optimization: **5 points**
- Page Speed: **5 points**
- Content Quality: **10 points**
- Technical SEO: **5 points**

**Total: 120 points** (scaled to 100)

### Grade Scale
- **90-100:** Excellent ✅ (Production ready)
- **80-89:** Good ✅ (Minor improvements needed)
- **70-79:** Fair ⚠️ (Needs work)
- **< 70:** Poor ❌ (Major fixes required)

---

## 🔍 VALIDATION TOOLS

### Before Publishing, Test With:

1. **Google Rich Results Test**
   - URL: https://search.google.com/test/rich-results
   - Tests: Structured data validity

2. **Google PageSpeed Insights**
   - URL: https://pagespeed.web.dev/
   - Tests: Performance, Core Web Vitals

3. **Google Mobile-Friendly Test**
   - URL: https://search.google.com/test/mobile-friendly
   - Tests: Mobile optimization

4. **Schema Markup Validator**
   - URL: https://validator.schema.org/
   - Tests: Structured data syntax

5. **Open Graph Preview**
   - URL: https://www.opengraph.xyz/
   - Tests: OG tags display

6. **Twitter Card Validator**
   - URL: https://cards-dev.twitter.com/validator
   - Tests: Twitter card display

---

## 📝 QUICK CHECKLIST TEMPLATE

Copy this for each tool page:

```
TOOL: [Tool Name]
URL: /[category]/[tool-name]

[ ] Title tag (50-60 chars, primary keyword)
[ ] Meta description (150-160 chars)
[ ] Meta keywords (5-8 relevant)
[ ] Canonical URL
[ ] OG tags (6 required)
[ ] Twitter tags (5 required)
[ ] FAQPage schema (6+ questions)
[ ] SoftwareApplication schema
[ ] HowTo schema (3-5 steps)
[ ] BreadcrumbList schema
[ ] H1 tag (one, primary keyword)
[ ] H2 tags (5+ sections)
[ ] Content length (2,500+ words)
[ ] Image alt text (all images)
[ ] Internal links (3-5 related tools)
[ ] External links (2-3 authoritative)
[ ] Mobile responsive
[ ] Page speed optimized
[ ] Validated with Google tools
```

---

## 🎯 PRIORITY ORDER

If time is limited, focus on these in order:

1. **Title & Meta Description** (Critical for CTR)
2. **Structured Data** (Rich snippets in search)
3. **H1 & Content** (On-page SEO)
4. **OG & Twitter Tags** (Social sharing)
5. **Image Alt Text** (Accessibility + SEO)
6. **Internal Linking** (Site architecture)
7. **Page Speed** (User experience)

---

## 📚 ADDITIONAL RESOURCES

- [Google SEO Starter Guide](https://developers.google.com/search/docs/beginner/seo-starter-guide)
- [Schema.org Documentation](https://schema.org/)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards Documentation](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [FixTools Modernization Blueprint](./TOOLS_MODERNIZATION_BLUEPRINT.md)

---

**Last Updated:** January 3, 2026  
**Maintained By:** FixTools Development Team

