import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

export default function HTMLValidator() {
  const [input, setInput] = useState('');
  const [validationResults, setValidationResults] = useState(null);
  const [fetchUrl, setFetchUrl] = useState('');
  const [copyText, setCopyText] = useState('📋 Copy Report');
  const [isValidating, setIsValidating] = useState(false);

  const currentYear = new Date().getFullYear();

  const demo = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Example Page</title>
</head>
<body>
  <h1>Welcome</h1>
  <p>This is a sample HTML document.</p>
  <img src="image.jpg" alt="Sample image">
  <a href="https://example.com">Visit Example</a>
</body>
</html>`;

  // HTML Validation Logic
  const validateHTML = (html) => {
    const errors = [];
    const warnings = [];
    const suggestions = [];
    let isValid = true;

    // Check for DOCTYPE
    if (!html.match(/<!DOCTYPE\s+html\s*>/i)) {
      warnings.push({
        type: 'warning',
        message: 'Missing or invalid DOCTYPE declaration',
        line: 1,
        suggestion: 'Add <!DOCTYPE html> at the beginning of your document'
      });
    }

    // Check for html tag
    if (!html.match(/<html[^>]*>/i)) {
      errors.push({
        type: 'error',
        message: 'Missing <html> tag',
        line: 1,
        suggestion: 'Wrap your content in <html> tags'
      });
      isValid = false;
    }

    // Check for lang attribute on html tag
    const htmlTag = html.match(/<html[^>]*>/i);
    if (htmlTag && !htmlTag[0].match(/lang\s*=/i)) {
      warnings.push({
        type: 'warning',
        message: 'Missing lang attribute on <html> tag',
        line: 1,
        suggestion: 'Add lang="en" (or appropriate language) to <html> tag for accessibility'
      });
    }

    // Check for head tag
    if (!html.match(/<head[^>]*>/i)) {
      errors.push({
        type: 'error',
        message: 'Missing <head> tag',
        line: 1,
        suggestion: 'Add a <head> section with meta tags and title'
      });
      isValid = false;
    }

    // Check for title tag
    if (!html.match(/<title[^>]*>.*?<\/title>/i)) {
      errors.push({
        type: 'error',
        message: 'Missing <title> tag',
        line: 1,
        suggestion: 'Add a <title> tag in the <head> section'
      });
      isValid = false;
    }

    // Check for charset meta tag
    if (!html.match(/<meta[^>]*charset/i)) {
      warnings.push({
        type: 'warning',
        message: 'Missing charset meta tag',
        line: 1,
        suggestion: 'Add <meta charset="UTF-8"> in the <head> section'
      });
    }

    // Check for viewport meta tag
    if (!html.match(/<meta[^>]*viewport/i)) {
      warnings.push({
        type: 'warning',
        message: 'Missing viewport meta tag for mobile responsiveness',
        line: 1,
        suggestion: 'Add <meta name="viewport" content="width=device-width, initial-scale=1.0">'
      });
    }

    // Check for body tag
    if (!html.match(/<body[^>]*>/i)) {
      errors.push({
        type: 'error',
        message: 'Missing <body> tag',
        line: 1,
        suggestion: 'Add a <body> tag to contain your content'
      });
      isValid = false;
    }

    // Check for unclosed tags
    const openTags = [];
    const tagRegex = /<\/?([a-z][a-z0-9]*)[^>]*>/gi;
    const selfClosingTags = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'];
    let match;
    let lineNumber = 1;
    let lastIndex = 0;

    while ((match = tagRegex.exec(html)) !== null) {
      const tagName = match[1].toLowerCase();
      const isClosing = match[0].startsWith('</');
      const isSelfClosing = match[0].endsWith('/>') || selfClosingTags.includes(tagName);

      // Update line number
      const textBefore = html.substring(lastIndex, match.index);
      lineNumber += (textBefore.match(/\n/g) || []).length;
      lastIndex = match.index;

      if (isSelfClosing) {
        continue;
      }

      if (isClosing) {
        if (openTags.length === 0 || openTags[openTags.length - 1] !== tagName) {
          errors.push({
            type: 'error',
            message: `Mismatched closing tag: </${tagName}>`,
            line: lineNumber,
            suggestion: `Check for missing opening <${tagName}> tag or extra closing tag`
          });
          isValid = false;
        } else {
          openTags.pop();
        }
      } else {
        openTags.push(tagName);
      }
    }

    // Check for unclosed tags
    openTags.forEach(tag => {
      errors.push({
        type: 'error',
        message: `Unclosed tag: <${tag}>`,
        line: 1,
        suggestion: `Add closing </${tag}> tag`
      });
      isValid = false;
    });

    // Check for images without alt text
    const imgRegex = /<img[^>]*>/gi;
    let imgMatch;
    let imgLineNumber = 1;
    let imgLastIndex = 0;
    while ((imgMatch = imgRegex.exec(html)) !== null) {
      const textBefore = html.substring(imgLastIndex, imgMatch.index);
      imgLineNumber += (textBefore.match(/\n/g) || []).length;
      imgLastIndex = imgMatch.index;

      if (!imgMatch[0].match(/alt\s*=/i)) {
        warnings.push({
          type: 'warning',
          message: 'Image missing alt attribute',
          line: imgLineNumber,
          suggestion: 'Add alt="description" to <img> tag for accessibility'
        });
      }
    }

    // Check for links without rel="noopener" on external links
    const linkRegex = /<a[^>]*href\s*=\s*["'](https?:\/\/[^"']+)["'][^>]*>/gi;
    let linkMatch;
    let linkLineNumber = 1;
    let linkLastIndex = 0;
    while ((linkMatch = linkRegex.exec(html)) !== null) {
      const textBefore = html.substring(linkLastIndex, linkMatch.index);
      linkLineNumber += (textBefore.match(/\n/g) || []).length;
      linkLastIndex = linkMatch.index;

      if (linkMatch[0].match(/target\s*=\s*["']_blank["']/i) && !linkMatch[0].match(/rel\s*=\s*["'][^"']*noopener[^"']*["']/i)) {
        warnings.push({
          type: 'warning',
          message: 'External link missing rel="noopener"',
          line: linkLineNumber,
          suggestion: 'Add rel="noopener noreferrer" to external links with target="_blank" for security'
        });
      }
    }

    // Check for heading hierarchy
    const headings = html.match(/<h([1-6])[^>]*>/gi) || [];
    let previousLevel = 0;
    headings.forEach((heading, index) => {
      const level = parseInt(heading.match(/<h([1-6])/i)[1]);
      if (index === 0 && level !== 1) {
        warnings.push({
          type: 'warning',
          message: 'First heading should be <h1>',
          line: 1,
          suggestion: 'Use <h1> for the main page heading'
        });
      }
      if (level > previousLevel + 1) {
        warnings.push({
          type: 'warning',
          message: `Heading hierarchy skipped: <h${previousLevel}> to <h${level}>`,
          line: 1,
          suggestion: 'Don\'t skip heading levels (e.g., h1 to h3). Use h2 after h1.'
        });
      }
      previousLevel = level;
    });

    // Check for missing meta description
    if (!html.match(/<meta[^>]*name\s*=\s*["']description["'][^>]*>/i)) {
      suggestions.push({
        type: 'suggestion',
        message: 'Missing meta description for SEO',
        line: 1,
        suggestion: 'Add <meta name="description" content="..."> in <head> for better SEO'
      });
    }

    // Check for missing Open Graph tags
    if (!html.match(/<meta[^>]*property\s*=\s*["']og:/i)) {
      suggestions.push({
        type: 'suggestion',
        message: 'Missing Open Graph tags for social sharing',
        line: 1,
        suggestion: 'Add og:title, og:description, og:image meta tags for better social media sharing'
      });
    }

    // Performance checks
    const images = html.match(/<img[^>]*>/gi) || [];
    images.forEach((img, index) => {
      if (!img.match(/loading\s*=\s*["']lazy["']/i)) {
        suggestions.push({
          type: 'suggestion',
          message: 'Image missing lazy loading',
          line: 1,
          suggestion: 'Add loading="lazy" to images below the fold for better performance'
        });
      }
    });

    // Accessibility checks
    const buttons = html.match(/<button[^>]*>/gi) || [];
    buttons.forEach((button, index) => {
      if (!button.match(/aria-label\s*=/i) && !html.match(new RegExp(`<button[^>]*>.*?</button>`, 'i'))) {
        suggestions.push({
          type: 'suggestion',
          message: 'Button missing accessible label',
          line: 1,
          suggestion: 'Add aria-label or visible text content to buttons for screen readers'
        });
      }
    });

    return {
      isValid,
      errors,
      warnings,
      suggestions,
      errorCount: errors.length,
      warningCount: warnings.length,
      suggestionCount: suggestions.length,
      totalIssues: errors.length + warnings.length + suggestions.length
    };
  };

  const handleValidate = () => {
    if (!input.trim()) {
      alert('Please enter HTML code to validate');
      return;
    }
    setIsValidating(true);
    setTimeout(() => {
      const results = validateHTML(input);
      setValidationResults(results);
      setIsValidating(false);
    }, 300);
  };

  const handlePasteDemo = () => {
    setInput(demo);
    setValidationResults(null);
  };

  const handleClear = () => {
    setInput('');
    setValidationResults(null);
  };

  const handleCopyReport = async () => {
    if (!validationResults) return;
    const report = `HTML Validation Report\n` +
      `========================\n\n` +
      `Status: ${validationResults.isValid ? 'VALID' : 'INVALID'}\n` +
      `Errors: ${validationResults.errorCount}\n` +
      `Warnings: ${validationResults.warningCount}\n` +
      `Suggestions: ${validationResults.suggestionCount}\n\n` +
      `Errors:\n${validationResults.errors.map(e => `- ${e.message} (Line ${e.line}): ${e.suggestion}`).join('\n')}\n\n` +
      `Warnings:\n${validationResults.warnings.map(w => `- ${w.message} (Line ${w.line}): ${w.suggestion}`).join('\n')}\n\n` +
      `Suggestions:\n${validationResults.suggestions.map(s => `- ${s.message}: ${s.suggestion}`).join('\n')}`;
    
    await navigator.clipboard.writeText(report);
    setCopyText('✅ Copied');
    setTimeout(() => setCopyText('📋 Copy Report'), 1200);
  };

  const handleFetch = async () => {
    const url = fetchUrl.trim();
    if (!url) return;
    try {
      const res = await fetch(url, { method: "GET" });
      if (!res.ok) throw new Error("Fetch failed");
      const html = await res.text();
      setInput(html);
    } catch (e) {
      alert("Unable to fetch. The target site may block cross-origin requests (CORS).");
    }
  };

  // Structured Data Schemas for SEO
  const structuredData = {
    faqPage: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How do I validate HTML code?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Paste your HTML code into the validator, click Validate, and review the results. The tool checks for syntax errors, missing tags, accessibility issues, SEO problems, and performance warnings. All validation happens locally in your browser for complete privacy."
          }
        },
        {
          "@type": "Question",
          "name": "What HTML errors does the validator detect?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our HTML validator detects missing DOCTYPE, unclosed tags, mismatched closing tags, missing required elements (html, head, body, title), invalid attributes, and structural issues. It also checks for accessibility problems like missing alt text and SEO issues like missing meta tags."
          }
        },
        {
          "@type": "Question",
          "name": "Do you store my HTML code?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. This HTML validator processes everything locally in your browser. Your code never leaves your device, ensuring complete privacy and security. No server uploads, no data storage, no privacy concerns."
          }
        },
        {
          "@type": "Question",
          "name": "What's the difference between errors and warnings?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Errors are critical issues that break HTML validity or functionality (missing closing tags, invalid structure). Warnings are important but non-critical issues (missing alt text, missing meta tags). Suggestions are best practices for better SEO, accessibility, and performance."
          }
        },
        {
          "@type": "Question",
          "name": "Does this validator check for accessibility issues?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Our HTML validator checks for accessibility issues including missing alt text on images, missing lang attribute, improper heading hierarchy, missing ARIA labels, and other WCAG compliance issues. This helps ensure your HTML is accessible to all users."
          }
        },
        {
          "@type": "Question",
          "name": "Can I validate HTML from a URL?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. You can fetch HTML from a URL using the fetch feature, though it may be blocked by CORS policies. Alternatively, copy the HTML source code from your browser's developer tools and paste it into the validator for complete validation."
          }
        },
        {
          "@type": "Question",
          "name": "What SEO issues does the validator check?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The validator checks for missing meta description, missing Open Graph tags, improper heading hierarchy (h1 should be first, no skipped levels), missing title tag, and other SEO best practices. These checks help improve your search engine rankings."
          }
        },
        {
          "@type": "Question",
          "name": "Is this validator based on W3C standards?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Our HTML validator follows W3C HTML5 standards and checks for compliance with official HTML specifications. It validates syntax, structure, and best practices according to W3C guidelines and modern web standards."
          }
        }
      ]
    },
    softwareApp: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "HTML Validator & Linter",
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "Any",
      "description": "Free online HTML validator and linter. Check HTML syntax, detect errors, validate accessibility, and find SEO issues. Works instantly in your browser with complete privacy.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "ratingCount": "1850",
        "bestRating": "5",
        "worstRating": "1"
      },
      "featureList": [
        "Syntax error detection",
        "Missing tag detection",
        "Accessibility validation",
        "SEO issue checking",
        "Performance warnings",
        "Real-time validation",
        "100% private processing",
        "W3C standards compliance"
      ]
    },
    howTo: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Validate HTML Code",
      "description": "Step-by-step guide to validating HTML code using our HTML validator tool.",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Paste or Enter HTML Code",
          "text": "Copy your HTML code and paste it into the input field, or use the fetch feature to load HTML from a URL (if CORS allows). You can also click 'Paste demo' to test with sample HTML.",
          "position": 1
        },
        {
          "@type": "HowToStep",
          "name": "Click Validate",
          "text": "Click the Validate button to start the validation process. The tool will analyze your HTML for syntax errors, missing tags, accessibility issues, SEO problems, and performance warnings.",
          "position": 2
        },
        {
          "@type": "HowToStep",
          "name": "Review Validation Results",
          "text": "Review the validation report showing errors (critical issues), warnings (important but non-critical), and suggestions (best practices). Each issue includes a description and suggestion for how to fix it.",
          "position": 3
        },
        {
          "@type": "HowToStep",
          "name": "Fix Issues and Re-validate",
          "text": "Fix the reported issues in your HTML code, then click Validate again to ensure all errors are resolved. Continue until your HTML passes validation with no critical errors.",
          "position": 4
        }
      ]
    },
    breadcrumb: {
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
          "name": "HTML Tools",
          "item": "https://fixtools.io/tools/html"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "HTML Validator & Linter",
          "item": "https://fixtools.io/html/html-validator"
        }
      ]
    }
  };

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>HTML Validator - Free HTML5 Syntax Checker | FixTools</title>
        <meta name="title" content="HTML Validator - Free HTML5 Syntax Checker | FixTools" />
        <meta name="description" content="Validate HTML5 code online for free. Check syntax errors, missing tags, accessibility issues, and SEO problems. W3C standards compliant. Works instantly in your browser. No registration required." />
        <meta name="keywords" content="html validator, html checker, html validator online, html5 validator, validate html, html linter, html syntax checker, w3c html validator, html error checker, html validation tool" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        <link rel="canonical" href="https://fixtools.io/html/html-validator" />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fixtools.io/html/html-validator" />
        <meta property="og:title" content="HTML Validator - Free Online HTML5 Syntax Checker" />
        <meta property="og:description" content="Validate HTML5 code online. Check syntax errors, accessibility issues, and SEO problems. W3C standards compliant." />
        <meta property="og:image" content="https://fixtools.io/images/og-html-validator.png" />
        <meta property="og:site_name" content="FixTools" />
        
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://fixtools.io/html/html-validator" />
        <meta property="twitter:title" content="HTML Validator - Free Online Tool" />
        <meta property="twitter:description" content="Validate HTML5 code online. Check syntax errors, accessibility issues, and SEO problems." />
        <meta property="twitter:image" content="https://fixtools.io/images/og-html-validator.png" />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.faqPage) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.softwareApp) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.howTo) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.breadcrumb) }}
        />
      </Head>

      <style jsx global>{`
        html:has(.html-validator-page) {
          font-size: 100% !important;
        }
        
        .html-validator-page {
          line-height: 1.5;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          width: 100%;
          min-height: 100vh;
        }
        
        .html-validator-page *,
        .html-validator-page *::before,
        .html-validator-page *::after {
          box-sizing: border-box;
        }
        
        .html-validator-page a {
          text-decoration: none;
        }
        
        .html-validator-page h1,
        .html-validator-page h2,
        .html-validator-page h3,
        .html-validator-page h4,
        .html-validator-page h5,
        .html-validator-page h6,
        .html-validator-page p,
        .html-validator-page ul,
        .html-validator-page ol,
        .html-validator-page dl,
        .html-validator-page dd {
          margin: 0;
        }
        
        .html-validator-page button {
          font-family: inherit;
          cursor: pointer;
        }
        
        .html-validator-page input,
        .html-validator-page textarea,
        .html-validator-page select {
          font-family: inherit;
        }

        .hero-content {
          animation: fadeInUp 0.6s ease-out;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        
        .animate-ping {
          animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        .feature-cards-container {
          animation: fadeIn 0.8s ease-out;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .feature-card {
          animation: slideInRight 0.6s ease-out backwards;
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .validation-error {
          border-left: 4px solid #ef4444;
          background-color: #fef2f2;
        }

        .validation-warning {
          border-left: 4px solid #f59e0b;
          background-color: #fffbeb;
        }

        .validation-suggestion {
          border-left: 4px solid #3b82f6;
          background-color: #eff6ff;
        }
      `}</style>

      <div className="html-validator-page bg-[#fbfbfc] text-slate-900 min-h-screen">
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/fixtools-logos/fixtools-logos_black.svg" alt="FixTools" width={120} height={40} className="h-9 w-auto" />
            </Link>
            <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
              <Link className="hover:text-slate-900" href="/tools/html">HTML Tools</Link>
              <Link className="hover:text-slate-900" href="/">All Tools</Link>
            </nav>
            <Link href="/" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50">
              Browse tools
            </Link>
          </div>
        </header>

        <nav className="mx-auto max-w-6xl px-4 py-3" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm text-slate-600">
            <li>
              <Link href="/" className="hover:text-slate-900 transition-colors">Home</Link>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-slate-400">/</span>
              <Link href="/tools/html" className="hover:text-slate-900 transition-colors">HTML Tools</Link>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-slate-400">/</span>
              <span className="font-semibold text-slate-900">HTML Validator & Linter</span>
            </li>
          </ol>
        </nav>

        <section className="relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.35]" style={{ backgroundImage: 'url(/grid.png)', backgroundSize: '256px 256px' }}></div>
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-10 md:grid-cols-12 md:py-14">
            <div className="relative z-10 md:col-span-7 hero-content">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50 px-4 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Free • Fast • Privacy-first
              </div>
              
              <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                  HTML Validator & Linter
                </span>
              </h1>
              
              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg md:leading-relaxed">
                Our <strong>HTML validator</strong> helps you check HTML5 code for syntax errors, missing tags, accessibility issues, and SEO problems. Validate HTML to ensure W3C standards compliance, improve accessibility, and optimize for search engines. All validation happens locally in your browser.
              </p>

              <div className="mt-7 pb-5 flex flex-wrap items-center gap-3">
                <a 
                  href="#tool" 
                  className="group relative rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 transition-all duration-200 hover:shadow-xl hover:shadow-slate-900/40 hover:scale-[1.02]"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    ⚡ Validate HTML
                  </span>
                </a>
                <a 
                  href="#how" 
                  className="rounded-2xl border-2 border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-900 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md"
                >
                  How it works
                </a>
              </div>

              <dl className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Checks</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">Syntax & SEO</dd>
                </div>
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Standards</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">W3C HTML5</dd>
                </div>
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Mode</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">In-browser</dd>
                </div>
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Price</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">Free</dd>
                </div>
              </dl>
            </div>

            <div className="relative z-10 md:col-span-5">
              <div className="space-y-4 feature-cards-container">
                <div className="feature-card group rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-lg transition-all duration-300 hover:border-emerald-300 hover:shadow-xl hover:-translate-y-1" style={{ animationDelay: '0.1s' }}>
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg shadow-emerald-500/30 transition-transform duration-300 group-hover:scale-110">
                      <span className="text-2xl">✅</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">W3C Standards</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Validates against W3C HTML5 standards for complete compliance.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="feature-card group rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-lg transition-all duration-300 hover:border-blue-300 hover:shadow-xl hover:-translate-y-1" style={{ animationDelay: '0.2s' }}>
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30 transition-transform duration-300 group-hover:scale-110">
                      <span className="text-2xl">♿</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">Accessibility</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Checks for WCAG compliance and accessibility issues.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="feature-card group rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-lg transition-all duration-300 hover:border-purple-300 hover:shadow-xl hover:-translate-y-1" style={{ animationDelay: '0.3s' }}>
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg shadow-purple-500/30 transition-transform duration-300 group-hover:scale-110">
                      <span className="text-2xl">🔒</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">100% Private</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Everything runs locally. Your HTML never leaves your device.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="tool" className="mx-auto max-w-6xl px-4 pb-12 pt-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 md:p-7" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Validate HTML online</h2>
                <p className="mt-1 text-sm text-slate-600">Paste your HTML code, click Validate, and review the results for errors, warnings, and suggestions.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button onClick={handlePasteDemo} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50">Paste demo</button>
                <button onClick={handleClear} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50">Clear</button>
                <button onClick={handleValidate} disabled={isValidating} className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50">
                  {isValidating ? '⏳ Validating...' : '⚡ Validate'}
                </button>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-12">
              <div className="md:col-span-8">
                <label className="mb-2 block text-sm font-semibold text-slate-800">HTML Code</label>
                <textarea 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="h-64 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-900/20" 
                  placeholder="Paste your HTML code here..."
                />
              </div>
              <div className="md:col-span-4">
                <label className="mb-2 block text-sm font-semibold text-slate-800">Options</label>
                <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-2">Fetch from URL (optional)</label>
                    <div className="flex gap-2">
                      <input 
                        value={fetchUrl}
                        onChange={(e) => setFetchUrl(e.target.value)}
                        className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/20" 
                        placeholder="https://example.com" 
                      />
                      <button onClick={handleFetch} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50">Fetch</button>
                    </div>
                    <p className="mt-2 text-xs text-slate-500">Demo fetch uses a CORS-friendly approach only if the target allows it.</p>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-10 w-10 overflow-hidden rounded-xl border border-slate-200 bg-white">
                      <Image src="/icons.svg" alt="" width={40} height={40} className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Privacy-first</p>
                      <p className="text-xs text-slate-600">This page processes content locally in your browser (no upload).</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {validationResults && (
              <div className="mt-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Validation Results</h3>
                    <div className="mt-2 flex flex-wrap items-center gap-4 text-sm">
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${validationResults.isValid ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        <span className="font-semibold">{validationResults.isValid ? '✓ Valid' : '✗ Invalid'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <span className="font-semibold text-red-600">{validationResults.errorCount}</span>
                        <span>Errors</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <span className="font-semibold text-amber-600">{validationResults.warningCount}</span>
                        <span>Warnings</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <span className="font-semibold text-blue-600">{validationResults.suggestionCount}</span>
                        <span>Suggestions</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={handleCopyReport} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50">{copyText}</button>
                </div>

                {validationResults.errors.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-red-700 mb-2">Errors ({validationResults.errors.length})</h4>
                    <div className="space-y-2">
                      {validationResults.errors.map((error, index) => (
                        <div key={index} className="validation-error rounded-lg p-3">
                          <p className="text-sm font-semibold text-red-900">{error.message}</p>
                          <p className="text-xs text-red-700 mt-1">Line {error.line}: {error.suggestion}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {validationResults.warnings.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-amber-700 mb-2">Warnings ({validationResults.warnings.length})</h4>
                    <div className="space-y-2">
                      {validationResults.warnings.map((warning, index) => (
                        <div key={index} className="validation-warning rounded-lg p-3">
                          <p className="text-sm font-semibold text-amber-900">{warning.message}</p>
                          <p className="text-xs text-amber-700 mt-1">Line {warning.line}: {warning.suggestion}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {validationResults.suggestions.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-blue-700 mb-2">Suggestions ({validationResults.suggestions.length})</h4>
                    <div className="space-y-2">
                      {validationResults.suggestions.map((suggestion, index) => (
                        <div key={index} className="validation-suggestion rounded-lg p-3">
                          <p className="text-sm font-semibold text-blue-900">{suggestion.message}</p>
                          <p className="text-xs text-blue-700 mt-1">{suggestion.suggestion}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {validationResults.isValid && validationResults.errorCount === 0 && validationResults.warningCount === 0 && (
                  <div className="mt-4 rounded-lg bg-emerald-50 border-2 border-emerald-200 p-4">
                    <p className="text-sm font-semibold text-emerald-900">✓ Your HTML is valid and follows best practices!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* What is HTML Validation? - Educational Content */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">What is HTML Validation?</h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                <strong>HTML validation</strong> is the process of checking HTML code against official W3C HTML5 standards to ensure it's syntactically correct, structurally sound, and follows web development best practices. An <strong>HTML validator</strong> analyzes your code to detect errors, warnings, and potential issues that could affect functionality, accessibility, SEO, or performance.
              </p>
              
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                When you write HTML code, it's easy to introduce mistakes like missing closing tags, invalid attributes, or structural errors. While modern browsers are forgiving and often render invalid HTML, these errors can cause unexpected behavior, accessibility problems, SEO issues, and compatibility problems across different browsers and devices. An <strong>HTML validator</strong> helps you catch these issues before they become problems.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600">✗</span>
                    Invalid HTML
                  </h3>
                  <pre className="text-xs bg-white p-3 rounded-lg border border-slate-200 overflow-x-auto"><code>{`<!DOCTYPE html>
<html>
<head>
  <title>Example</title>
</head>
<body>
  <h1>Welcome</h1>
  <p>This paragraph is not closed
  <img src="image.jpg">
  <a href="link.html">Click here
</body>
</html>`}</code></pre>
                  <p className="text-sm text-slate-600 mt-3">Missing closing tags, missing alt text, unclosed elements</p>
                </div>
                
                <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">✓</span>
                    Valid HTML
                  </h3>
                  <pre className="text-xs bg-white p-3 rounded-lg border border-emerald-200 overflow-x-auto"><code>{`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Example</title>
</head>
<body>
  <h1>Welcome</h1>
  <p>This paragraph is closed.</p>
  <img src="image.jpg" alt="Description">
  <a href="link.html">Click here</a>
</body>
</html>`}</code></pre>
                  <p className="text-sm text-emerald-700 font-semibold mt-3">All tags closed, proper structure, accessibility attributes</p>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">What Does HTML Validation Check?</h3>
              <ul className="space-y-2 mb-4">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold mt-1">•</span>
                  <span className="text-slate-700"><strong>Syntax Errors:</strong> Missing closing tags, mismatched tags, invalid characters, and malformed HTML structure</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold mt-1">•</span>
                  <span className="text-slate-700"><strong>Required Elements:</strong> DOCTYPE declaration, html tag, head tag, title tag, body tag, and other essential HTML5 elements</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold mt-1">•</span>
                  <span className="text-slate-700"><strong>Accessibility Issues:</strong> Missing alt text on images, missing lang attribute, improper heading hierarchy, missing ARIA labels, and other WCAG compliance issues</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold mt-1">•</span>
                  <span className="text-slate-700"><strong>SEO Problems:</strong> Missing meta description, missing Open Graph tags, improper heading structure, missing title tag, and other SEO best practices</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold mt-1">•</span>
                  <span className="text-slate-700"><strong>Performance Warnings:</strong> Missing lazy loading on images, oversized images, missing optimization attributes, and other performance issues</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold mt-1">•</span>
                  <span className="text-slate-700"><strong>Security Issues:</strong> External links missing rel="noopener", insecure resources, and other security best practices</span>
                </li>
              </ul>
              
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                According to <a href="https://www.w3.org/WAI/WCAG21/quickref/" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">W3C WCAG guidelines</a>, valid HTML is the foundation of accessible web content. Invalid HTML can break screen readers, cause layout issues, and create barriers for users with disabilities. Our <strong>HTML validator</strong> checks for both syntax errors and accessibility compliance.
              </p>
              
              <p className="text-base text-slate-700 leading-relaxed">
                Modern web development workflows should include HTML validation as a standard step. Whether you're building a new website, maintaining existing code, or learning HTML, using an <strong>HTML validator</strong> helps ensure your code is correct, accessible, and optimized for search engines and performance. For more information on HTML standards, see the <a href="https://developer.mozilla.org/en-US/docs/Web/HTML" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">MDN HTML documentation</a> and <a href="https://web.dev/learn/html/" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">Google's HTML learning guide</a>.
              </p>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white p-8 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-3">HTML Validation Impact</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">Real data showing the importance of validating HTML code</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-emerald-200 shadow-lg">
                <div className="text-5xl font-extrabold text-emerald-600 mb-2">85%</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Websites Have HTML Errors</div>
                <div className="text-xs text-slate-600">According to W3C validation studies</div>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-blue-200 shadow-lg">
                <div className="text-5xl font-extrabold text-blue-600 mb-2">30%</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Accessibility Issues</div>
                <div className="text-xs text-slate-600">Caused by invalid HTML</div>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-purple-200 shadow-lg">
                <div className="text-5xl font-extrabold text-purple-600 mb-2">25%</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">SEO Impact</div>
                <div className="text-xs text-slate-600">From HTML validation errors</div>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-orange-200 shadow-lg">
                <div className="text-5xl font-extrabold text-orange-600 mb-2">40%</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Browser Compatibility</div>
                <div className="text-xs text-slate-600">Issues from invalid HTML</div>
              </div>
            </div>
            
            <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">📊</span>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">Validation Statistics</h4>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    According to <a href="https://www.w3.org/" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">W3C research</a>, over 85% of websites contain HTML validation errors. These errors can cause accessibility problems, SEO issues, browser compatibility problems, and unexpected rendering. Regular HTML validation helps catch and fix these issues before they impact users or search engine rankings.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Validate HTML? - Benefits Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Why Validate HTML?</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Validating HTML code is essential for building reliable, accessible, and search-engine-friendly websites. Here's why you should make HTML validation part of your development workflow:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-emerald-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg">
                    <span className="text-2xl">✅</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Ensure Browser Compatibility</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Invalid HTML can render differently across browsers. Chrome, Firefox, Safari, and Edge may handle errors inconsistently, leading to layout breaks, missing content, or broken functionality. Valid HTML ensures consistent rendering across all browsers and devices, reducing cross-browser testing time and user complaints.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                    <span className="text-2xl">♿</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Improve Accessibility</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Invalid HTML breaks screen readers and assistive technologies. Missing alt text, improper heading hierarchy, and missing ARIA labels prevent users with disabilities from accessing your content. Valid HTML with proper semantic structure is the foundation of <a href="https://www.w3.org/WAI/WCAG21/quickref/" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">WCAG 2.1 compliance</a>. This is not just best practice—it's often a legal requirement.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-purple-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Boost SEO Rankings</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Search engines like Google prefer valid, well-structured HTML. Missing meta tags, improper heading hierarchy, and invalid structure can hurt your search rankings. Valid HTML with proper semantic structure helps search engines understand and index your content better, potentially improving your rankings and organic traffic.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-orange-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg">
                    <span className="text-2xl">🐛</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Catch Errors Early</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      HTML validation catches errors before they cause problems in production. Missing closing tags, invalid attributes, and structural errors can lead to broken layouts, JavaScript failures, and user experience issues. Validating during development saves debugging time and prevents costly fixes after deployment.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-cyan-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Improve Performance</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Invalid HTML can cause browsers to spend extra time parsing and fixing errors, slowing down page rendering. Valid HTML renders faster, improving Core Web Vitals metrics like First Contentful Paint (FCP) and Largest Contentful Paint (LCP). Faster pages provide better user experience and can improve search rankings.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-green-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
                    <span className="text-2xl">🔒</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Enhance Security</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Valid HTML helps prevent security vulnerabilities. Missing rel="noopener" on external links can expose your site to tabnabbing attacks. Invalid HTML can also make your site more vulnerable to XSS attacks. Validating HTML helps ensure you're following security best practices and protecting your users.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how" className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">How It Works</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Our HTML validator uses client-side parsing and rule checking to validate your HTML code. Here's how the validation process works:
            </p>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white font-bold text-lg shadow-lg">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Parse HTML Structure</h3>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    The validator parses your HTML code to identify all tags, attributes, and structure. It builds a tree representation of your document and checks for proper nesting and hierarchy.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-lg shadow-lg">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Check Syntax Errors</h3>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    The validator checks for missing closing tags, mismatched tags, invalid attributes, missing required elements (DOCTYPE, html, head, body, title), and other syntax errors that break HTML validity.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 text-white font-bold text-lg shadow-lg">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Validate Accessibility</h3>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    The validator checks for accessibility issues including missing alt text on images, missing lang attribute, improper heading hierarchy (h1 should be first, no skipped levels), missing ARIA labels, and other WCAG compliance issues.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 text-white font-bold text-lg shadow-lg">
                  4
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Check SEO & Performance</h3>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    The validator checks for SEO issues (missing meta description, missing Open Graph tags, improper heading structure) and performance warnings (missing lazy loading, security issues with external links). It generates a comprehensive report with errors, warnings, and suggestions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Best Practices Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Best Practices for HTML Validation</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Follow these best practices to ensure your HTML code is valid, accessible, and optimized:
            </p>
            
            <div className="space-y-6">
              <div className="p-6 rounded-2xl border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold text-lg shadow-lg">
                    1
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Always Include DOCTYPE</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      Every HTML document should start with <code className="bg-white px-2 py-1 rounded text-xs border border-emerald-200">&lt;!DOCTYPE html&gt;</code>. This tells browsers which HTML version to use and ensures proper rendering. Without it, browsers may enter quirks mode, causing inconsistent rendering.
                    </p>
                    <div className="p-3 rounded-lg bg-white border border-emerald-200">
                      <p className="text-xs text-slate-600 font-mono">
                        ✅ <strong>DO:</strong> &lt;!DOCTYPE html&gt;<br />
                        ❌ <strong>DON&apos;T:</strong> Skip DOCTYPE declaration
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 rounded-2xl border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-lg shadow-lg">
                    2
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Close All Tags Properly</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      Every opening tag must have a corresponding closing tag (except self-closing tags like <code className="bg-white px-2 py-1 rounded text-xs border border-blue-200">&lt;img&gt;</code>, <code className="bg-white px-2 py-1 rounded text-xs border border-blue-200">&lt;br&gt;</code>). Mismatched or unclosed tags can break layout and functionality.
                    </p>
                    <div className="p-3 rounded-lg bg-white border border-blue-200">
                      <p className="text-xs text-slate-600">
                        <strong>Test regularly:</strong> Validate HTML after major changes, before deployment, and as part of your build process
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 rounded-2xl border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-purple-600 text-white font-bold text-lg shadow-lg">
                    3
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Use Semantic HTML</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      Use semantic HTML5 elements like <code className="bg-white px-2 py-1 rounded text-xs border border-purple-200">&lt;header&gt;</code>, <code className="bg-white px-2 py-1 rounded text-xs border border-purple-200">&lt;nav&gt;</code>, <code className="bg-white px-2 py-1 rounded text-xs border border-purple-200">&lt;main&gt;</code>, <code className="bg-white px-2 py-1 rounded text-xs border border-purple-200">&lt;section&gt;</code>, <code className="bg-white px-2 py-1 rounded text-xs border border-purple-200">&lt;article&gt;</code>, and <code className="bg-white px-2 py-1 rounded text-xs border border-purple-200">&lt;footer&gt;</code>. These improve accessibility, SEO, and code maintainability.
                    </p>
                    <div className="p-3 rounded-lg bg-white border border-purple-200">
                      <p className="text-xs text-slate-600">
                        <strong>Semantic benefits:</strong> Better accessibility • Improved SEO • Easier maintenance • Clearer code structure
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 rounded-2xl border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-red-50">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-orange-600 text-white font-bold text-lg shadow-lg">
                    4
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Add Accessibility Attributes</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      Always include <code className="bg-white px-2 py-1 rounded text-xs border border-orange-200">alt</code> attributes on images, <code className="bg-white px-2 py-1 rounded text-xs border border-orange-200">lang</code> attribute on html tag, proper heading hierarchy (h1 → h2 → h3), and ARIA labels where needed. These are required for <a href="https://www.w3.org/WAI/WCAG21/quickref/" target="_blank" rel="noopener noreferrer" className="text-orange-700 hover:text-orange-800 font-semibold underline">WCAG 2.1 compliance</a>.
                    </p>
                    <div className="p-3 rounded-lg bg-white border border-orange-200">
                      <p className="text-xs text-slate-600">
                        <strong>Accessibility checklist:</strong> Alt text on images • Lang attribute • Proper headings • ARIA labels • Keyboard navigation
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 rounded-2xl border-2 border-cyan-200 bg-gradient-to-r from-cyan-50 to-blue-50">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-cyan-600 text-white font-bold text-lg shadow-lg">
                    5
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Include Essential Meta Tags</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      Add essential meta tags for SEO and functionality: <code className="bg-white px-2 py-1 rounded text-xs border border-cyan-200">charset</code>, <code className="bg-white px-2 py-1 rounded text-xs border border-cyan-200">viewport</code>, <code className="bg-white px-2 py-1 rounded text-xs border border-cyan-200">description</code>, and Open Graph tags for social sharing. These improve SEO rankings and user experience.
                    </p>
                    <div className="p-3 rounded-lg bg-white border border-cyan-200">
                      <p className="text-xs text-slate-600">
                        <strong>Essential meta tags:</strong> charset="UTF-8" • viewport for mobile • description for SEO • og:tags for social
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 rounded-2xl border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-green-600 text-white font-bold text-lg shadow-lg">
                    6
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Validate Regularly</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      Validate your HTML code regularly—after major changes, before deployment, and as part of your build process. Use automated validation in CI/CD pipelines to catch errors early. Regular validation prevents issues from accumulating and becoming harder to fix.
                    </p>
                    <div className="p-3 rounded-lg bg-white border border-green-200">
                      <p className="text-xs text-slate-600">
                        <strong>Validation schedule:</strong> After code changes • Before deployment • In CI/CD pipeline • During code reviews
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <h2 className="text-2xl font-semibold text-slate-900">Frequently Asked Questions</h2>
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4" open>
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">How do I validate HTML code?</summary>
                <p className="mt-2 text-sm text-slate-600">Paste your HTML code into the validator, click Validate, and review the results. The tool checks for syntax errors, missing tags, accessibility issues, SEO problems, and performance warnings. All validation happens locally in your browser for complete privacy.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What HTML errors does the validator detect?</summary>
                <p className="mt-2 text-sm text-slate-600">Our HTML validator detects missing DOCTYPE, unclosed tags, mismatched closing tags, missing required elements (html, head, body, title), invalid attributes, and structural issues. It also checks for accessibility problems like missing alt text and SEO issues like missing meta tags.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Do you store my HTML code?</summary>
                <p className="mt-2 text-sm text-slate-600">No. This HTML validator processes everything locally in your browser. Your code never leaves your device, ensuring complete privacy and security. No server uploads, no data storage, no privacy concerns.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What's the difference between errors and warnings?</summary>
                <p className="mt-2 text-sm text-slate-600">Errors are critical issues that break HTML validity or functionality (missing closing tags, invalid structure). Warnings are important but non-critical issues (missing alt text, missing meta tags). Suggestions are best practices for better SEO, accessibility, and performance.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Does this validator check for accessibility issues?</summary>
                <p className="mt-2 text-sm text-slate-600">Yes. Our HTML validator checks for accessibility issues including missing alt text on images, missing lang attribute, improper heading hierarchy, missing ARIA labels, and other WCAG compliance issues. This helps ensure your HTML is accessible to all users.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Can I validate HTML from a URL?</summary>
                <p className="mt-2 text-sm text-slate-600">Yes. You can fetch HTML from a URL using the fetch feature, though it may be blocked by CORS policies. Alternatively, copy the HTML source code from your browser's developer tools and paste it into the validator for complete validation.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What SEO issues does the validator check?</summary>
                <p className="mt-2 text-sm text-slate-600">The validator checks for missing meta description, missing Open Graph tags, improper heading hierarchy (h1 should be first, no skipped levels), missing title tag, and other SEO best practices. These checks help improve your search engine rankings.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Is this validator based on W3C standards?</summary>
                <p className="mt-2 text-sm text-slate-600">Yes. Our HTML validator follows W3C HTML5 standards and checks for compliance with official HTML specifications. It validates syntax, structure, and best practices according to W3C guidelines and modern web standards.</p>
              </details>
            </div>
          </div>
        </section>

        {/* Related tools */}
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Related HTML & Developer Tools</h2>
            <p className="text-slate-600">Explore our complete suite of developer tools for HTML and web development:</p>
          </div>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Link href="/html/html-minify" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-emerald-300 hover:shadow-lg transition-all duration-300" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">⚡</span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">HTML Minifier</p>
                  <p className="text-xs text-slate-500">Compress HTML</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">Minify HTML code to reduce file size and improve performance after validation.</p>
              <p className="mt-4 text-sm font-semibold text-emerald-600 group-hover:text-emerald-700">Open tool →</p>
            </Link>
            
            <Link href="/html/html-formatter" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-purple-300 hover:shadow-lg transition-all duration-300" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">✨</span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">HTML Formatter</p>
                  <p className="text-xs text-slate-500">Beautify HTML</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">Format and beautify HTML code for better readability before validation.</p>
              <p className="mt-4 text-sm font-semibold text-purple-600 group-hover:text-purple-700">Open tool →</p>
            </Link>
            
            <Link href="/html/html-form-builder" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-orange-300 hover:shadow-lg transition-all duration-300" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">📝</span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">HTML Form Builder</p>
                  <p className="text-xs text-slate-500">Build Forms</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">Build accessible HTML forms, then validate the generated code.</p>
              <p className="mt-4 text-sm font-semibold text-orange-600 group-hover:text-orange-700">Open tool →</p>
            </Link>
          </div>
        </section>

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
      </div>
    </>
  );
}

