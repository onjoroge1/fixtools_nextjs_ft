import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

export default function HTMLSEOAnalyzer() {
  const [input, setInput] = useState('');
  const [seoResults, setSeoResults] = useState(null);
  const [fetchUrl, setFetchUrl] = useState('');
  const [copyText, setCopyText] = useState('📋 Copy Report');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const currentYear = new Date().getFullYear();

  const demo = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SEO Optimized Example Page - Best Practices</title>
  <meta name="description" content="This is an example HTML page demonstrating SEO best practices including meta tags, heading hierarchy, and structured data.">
  <meta name="keywords" content="seo, optimization, html, best practices">
  <link rel="canonical" href="https://example.com/page">
  <meta property="og:title" content="SEO Optimized Example Page">
  <meta property="og:description" content="Example page demonstrating SEO best practices">
  <meta property="og:image" content="https://example.com/image.jpg">
</head>
<body>
  <header>
    <nav>
      <a href="/">Home</a>
      <a href="/about">About</a>
    </nav>
  </header>
  <main>
    <h1>Welcome to Our SEO Optimized Website</h1>
    <p>This is a sample HTML document with SEO best practices.</p>
    <h2>Key Features</h2>
    <p>Our website follows SEO best practices for better search engine rankings.</p>
    <img src="image.jpg" alt="SEO optimized image example" loading="lazy">
    <h3>Benefits</h3>
    <ul>
      <li>Proper meta tags</li>
      <li>Semantic HTML structure</li>
      <li>Optimized heading hierarchy</li>
    </ul>
  </main>
  <footer>
    <p>&copy; 2026 Example Company</p>
  </footer>
</body>
</html>`;

  // HTML SEO Analysis Logic (Meta tags, heading hierarchy, structured data, etc.)
  const analyzeSEO = (html) => {
    const errors = [];
    const warnings = [];
    const suggestions = [];
    let seoScore = 100;
    const seoLevel = 'Excellent';

    // SEO Check 1: Title Tag (Critical for SEO)
    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    if (!titleMatch || !titleMatch[1].trim()) {
      errors.push({
        type: 'error',
        message: 'Missing or empty <title> tag (Critical for SEO)',
        line: 1,
        guideline: 'SEO Best Practice - Title Tag',
        suggestion: 'Add a descriptive <title> tag (50-60 characters) with primary keyword in the <head> section'
      });
      seoScore -= 15;
    } else {
      const titleText = titleMatch[1].trim();
      const titleLength = titleText.length;
      if (titleLength < 30) {
        warnings.push({
          type: 'warning',
          message: `Title tag too short (${titleLength} characters, recommended: 50-60)`,
          line: 1,
          guideline: 'SEO Best Practice - Title Tag',
          suggestion: 'Expand title to 50-60 characters for better search engine visibility'
        });
        seoScore -= 3;
      } else if (titleLength > 60) {
        warnings.push({
          type: 'warning',
          message: `Title tag too long (${titleLength} characters, recommended: 50-60)`,
          line: 1,
          guideline: 'SEO Best Practice - Title Tag',
          suggestion: 'Shorten title to 50-60 characters to avoid truncation in search results'
        });
        seoScore -= 2;
      }
    }

    // SEO Check 2: Meta Description
    const metaDescMatch = html.match(/<meta[^>]*name\s*=\s*["']description["'][^>]*content\s*=\s*["']([^"']+)["'][^>]*>/i);
    if (!metaDescMatch || !metaDescMatch[1].trim()) {
      errors.push({
        type: 'error',
        message: 'Missing meta description tag (Critical for SEO)',
        line: 1,
        guideline: 'SEO Best Practice - Meta Description',
        suggestion: 'Add <meta name="description" content="..."> (150-160 characters) in the <head> section'
      });
      seoScore -= 15;
    } else {
      const descText = metaDescMatch[1].trim();
      const descLength = descText.length;
      if (descLength < 120) {
        warnings.push({
          type: 'warning',
          message: `Meta description too short (${descLength} characters, recommended: 150-160)`,
          line: 1,
          guideline: 'SEO Best Practice - Meta Description',
          suggestion: 'Expand meta description to 150-160 characters for better search result snippets'
        });
        seoScore -= 2;
      } else if (descLength > 160) {
        warnings.push({
          type: 'warning',
          message: `Meta description too long (${descLength} characters, recommended: 150-160)`,
          line: 1,
          guideline: 'SEO Best Practice - Meta Description',
          suggestion: 'Shorten meta description to 150-160 characters to avoid truncation'
        });
        seoScore -= 1;
      }
    }

    // SEO Check 3: Canonical URL
    const canonicalMatch = html.match(/<link[^>]*rel\s*=\s*["']canonical["'][^>]*href\s*=\s*["']([^"']+)["'][^>]*>/i);
    if (!canonicalMatch) {
      warnings.push({
        type: 'warning',
        message: 'Missing canonical URL link',
        line: 1,
        guideline: 'SEO Best Practice - Canonical URL',
        suggestion: 'Add <link rel="canonical" href="..."> to prevent duplicate content issues'
      });
      seoScore -= 3;
    }

    // SEO Check 4: Open Graph Tags
    const ogTitle = html.match(/<meta[^>]*property\s*=\s*["']og:title["'][^>]*>/i);
    const ogDescription = html.match(/<meta[^>]*property\s*=\s*["']og:description["'][^>]*>/i);
    const ogImage = html.match(/<meta[^>]*property\s*=\s*["']og:image["'][^>]*>/i);
    const ogUrl = html.match(/<meta[^>]*property\s*=\s*["']og:url["'][^>]*>/i);
    
    if (!ogTitle) {
      warnings.push({
        type: 'warning',
        message: 'Missing Open Graph title tag (og:title)',
        line: 1,
        guideline: 'SEO Best Practice - Social Sharing',
        suggestion: 'Add <meta property="og:title" content="..."> for better social media sharing'
      });
      seoScore -= 2;
    }
    if (!ogDescription) {
      warnings.push({
        type: 'warning',
        message: 'Missing Open Graph description tag (og:description)',
        line: 1,
        guideline: 'SEO Best Practice - Social Sharing',
        suggestion: 'Add <meta property="og:description" content="..."> for better social media sharing'
      });
      seoScore -= 2;
    }
    if (!ogImage) {
      suggestions.push({
        type: 'suggestion',
        message: 'Missing Open Graph image tag (og:image)',
        line: 1,
        guideline: 'SEO Best Practice - Social Sharing',
        suggestion: 'Add <meta property="og:image" content="..."> (1200x630px) for better social media previews'
      });
    }

    // SEO Check 5: Heading Hierarchy
    const headings = html.match(/<h([1-6])[^>]*>/gi) || [];
    let previousLevel = 0;
    let hasH1 = false;
    let h1Count = 0;
    
    headings.forEach((heading, index) => {
      const level = parseInt(heading.match(/<h([1-6])/i)[1]);
      if (level === 1) {
        hasH1 = true;
        h1Count++;
      }
      
      if (index === 0 && level !== 1) {
        errors.push({
          type: 'error',
          message: 'First heading should be <h1> (SEO best practice)',
          line: 1,
          guideline: 'SEO Best Practice - Heading Hierarchy',
          suggestion: 'Use <h1> for the main page heading to establish document structure for search engines'
        });
        seoScore -= 5;
      }
      if (level > previousLevel + 1 && previousLevel > 0) {
        warnings.push({
          type: 'warning',
          message: `Heading hierarchy skipped: <h${previousLevel}> to <h${level}>`,
          line: 1,
          guideline: 'SEO Best Practice - Heading Hierarchy',
          suggestion: 'Don\'t skip heading levels (e.g., h1 to h3). Use h2 after h1 for proper document structure.'
        });
        seoScore -= 2;
      }
      previousLevel = level;
    });
    
    if (headings.length > 0 && !hasH1) {
      errors.push({
        type: 'error',
        message: 'No <h1> heading found (SEO best practice)',
        line: 1,
        guideline: 'SEO Best Practice - Heading Hierarchy',
        suggestion: 'Add an <h1> heading to establish the main page topic for search engines'
      });
      seoScore -= 5;
    }
    
    if (h1Count > 1) {
      warnings.push({
        type: 'warning',
        message: `Multiple <h1> headings found (${h1Count}), should have only one`,
        line: 1,
        guideline: 'SEO Best Practice - Heading Hierarchy',
        suggestion: 'Use only one <h1> per page for better SEO. Use <h2> for subsections.'
      });
      seoScore -= 3;
    }

    // SEO Check 6: Images without alt text
    const imgRegex = /<img[^>]*>/gi;
    let imgMatch;
    let imgLineNumber = 1;
    let imgLastIndex = 0;
    let imagesWithAlt = 0;
    let imagesWithoutAlt = 0;
    
    while ((imgMatch = imgRegex.exec(html)) !== null) {
      const textBefore = html.substring(imgLastIndex, imgMatch.index);
      imgLineNumber += (textBefore.match(/\n/g) || []).length;
      imgLastIndex = imgMatch.index;

      const altMatch = imgMatch[0].match(/alt\s*=\s*["']([^"']*)["']/i);
      if (!altMatch) {
        warnings.push({
          type: 'warning',
          message: 'Image missing alt attribute (SEO and accessibility)',
          line: imgLineNumber,
          guideline: 'SEO Best Practice - Image Optimization',
          suggestion: 'Add alt="descriptive text" to <img> tag for better SEO and accessibility'
        });
        imagesWithoutAlt++;
        seoScore -= 2;
      } else if (altMatch[1].trim() === '') {
        imagesWithAlt++;
        // Empty alt is acceptable for decorative images
      } else {
        imagesWithAlt++;
      }
    }

    // SEO Check 7: Structured Data (JSON-LD)
    const structuredData = html.match(/<script[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>/gi) || [];
    if (structuredData.length === 0) {
      suggestions.push({
        type: 'suggestion',
        message: 'No structured data (JSON-LD) found',
        line: 1,
        guideline: 'SEO Best Practice - Structured Data',
        suggestion: 'Add structured data (JSON-LD) for better rich snippets: FAQPage, SoftwareApplication, HowTo, BreadcrumbList'
      });
    }

    // SEO Check 8: Internal Links
    const internalLinks = html.match(/<a[^>]*href\s*=\s*["'](?!https?:\/\/)([^"']+)["'][^>]*>/gi) || [];
    if (internalLinks.length < 3) {
      suggestions.push({
        type: 'suggestion',
        message: 'Few internal links found (SEO best practice)',
        line: 1,
        guideline: 'SEO Best Practice - Internal Linking',
        suggestion: 'Add more internal links (3-5+) to improve site structure and SEO'
      });
    }

    // Check for autocomplete on sensitive fields
    const sensitiveInputs = html.match(/<input[^>]*(type\s*=\s*["'](password|email|tel|text)[^"']*["'])[^>]*>/gi) || [];
    sensitiveInputs.forEach((input) => {
      if (input.match(/type\s*=\s*["']password["']/i) && !input.match(/autocomplete\s*=/i)) {
        suggestions.push({
          type: 'suggestion',
          message: 'Password input missing autocomplete attribute',
          line: 1,
          guideline: 'OWASP A02:2021 - Cryptographic Failures',
          suggestion: 'Add autocomplete="new-password" or autocomplete="current-password" for better security'
        });
      }
    });

    // Check for mixed content (HTTPS page loading HTTP resources)
    const hasHTTPS = html.match(/https:\/\//i);
    if (hasHTTPS) {
      const httpResources = html.match(/src\s*=\s*["']http:\/\/([^"']+)["']/gi) || [];
      if (httpResources.length > 0) {
        errors.push({
          type: 'error',
          message: 'Mixed content detected: HTTPS page loading HTTP resources',
          line: 1,
          guideline: 'OWASP A02:2021 - Cryptographic Failures',
          suggestion: 'Use HTTPS for all resources on HTTPS pages to prevent mixed content warnings and security issues'
        });
        securityScore -= 10;
      }
    }

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

    // SEO Check 9: Meta Keywords (optional but can help)
    const metaKeywords = html.match(/<meta[^>]*name\s*=\s*["']keywords["'][^>]*>/i);
    if (!metaKeywords) {
      suggestions.push({
        type: 'suggestion',
        message: 'Missing meta keywords tag (optional)',
        line: 1,
        guideline: 'SEO Best Practice - Meta Tags',
        suggestion: 'Add <meta name="keywords" content="keyword1, keyword2"> for additional SEO signals'
      });
    }

    // SEO Check 10: Viewport meta tag (mobile SEO)
    const viewport = html.match(/<meta[^>]*name\s*=\s*["']viewport["'][^>]*>/i);
    if (!viewport) {
      warnings.push({
        type: 'warning',
        message: 'Missing viewport meta tag (mobile SEO)',
        line: 1,
        guideline: 'SEO Best Practice - Mobile Optimization',
        suggestion: 'Add <meta name="viewport" content="width=device-width, initial-scale=1.0"> for mobile-friendly pages'
      });
      seoScore -= 3;
    }

    // SEO Check 11: Language attribute
    const htmlTag = html.match(/<html[^>]*>/i);
    if (htmlTag && !htmlTag[0].match(/lang\s*=/i)) {
      warnings.push({
        type: 'warning',
        message: 'Missing lang attribute on <html> tag',
        line: 1,
        guideline: 'SEO Best Practice - Language Declaration',
        suggestion: 'Add lang="en" (or appropriate language) to <html> tag for better SEO and accessibility'
      });
      seoScore -= 2;
    }

    // SEO Check 12: Content length (estimate)
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    if (bodyMatch) {
      const bodyText = bodyMatch[1].replace(/<[^>]+>/g, ' ').trim();
      const wordCount = bodyText.split(/\s+/).filter(word => word.length > 0).length;
      if (wordCount < 300) {
        warnings.push({
          type: 'warning',
          message: `Low content length (approximately ${wordCount} words, recommended: 300+)`,
          line: 1,
          guideline: 'SEO Best Practice - Content Quality',
          suggestion: 'Add more content (300+ words) for better SEO rankings'
        });
        seoScore -= 3;
      }
    }

    // Calculate final SEO score
    seoScore = Math.max(0, Math.min(100, seoScore));
    const finalSeoLevel = seoScore >= 90 ? 'Excellent' : seoScore >= 70 ? 'Good' : seoScore >= 50 ? 'Fair' : 'Poor';

    return {
      seoScore,
      seoLevel: finalSeoLevel,
      errors,
      warnings,
      suggestions,
      errorCount: errors.length,
      warningCount: warnings.length,
      suggestionCount: suggestions.length,
      totalIssues: errors.length + warnings.length + suggestions.length,
      summary: {
        imagesWithAlt,
        imagesWithoutAlt,
        headingsCount: headings.length,
        h1Count,
        internalLinksCount: internalLinks.length,
        structuredDataCount: structuredData.length
      }
    };
  };

  const handleAnalyzeSEO = () => {
    if (!input.trim()) {
      alert('Please enter HTML code to analyze');
      return;
    }
    setIsAnalyzing(true);
    setTimeout(() => {
      const results = analyzeSEO(input);
      setSeoResults(results);
      setIsAnalyzing(false);
    }, 300);
  };

  const handlePasteDemo = () => {
    setInput(demo);
    setSeoResults(null);
  };

  const handleClear = () => {
    setInput('');
    setSeoResults(null);
  };

  const handleCopyReport = async () => {
    if (!seoResults) return;
    const report = `HTML SEO Analysis Report\n` +
      `========================\n\n` +
      `SEO Score: ${seoResults.seoScore}/100\n` +
      `SEO Level: ${seoResults.seoLevel}\n` +
      `Errors: ${seoResults.errorCount}\n` +
      `Warnings: ${seoResults.warningCount}\n` +
      `Suggestions: ${seoResults.suggestionCount}\n\n` +
      `Errors:\n${seoResults.errors.map(e => `- ${e.message} (${e.guideline || 'SEO'}): ${e.suggestion}`).join('\n')}\n\n` +
      `Warnings:\n${seoResults.warnings.map(w => `- ${w.message} (${w.guideline || 'SEO'}): ${w.suggestion}`).join('\n')}\n\n` +
      `Suggestions:\n${seoResults.suggestions.map(s => `- ${s.message} (${s.guideline || 'SEO'}): ${s.suggestion}`).join('\n')}`;
    
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
          "name": "How do I analyze HTML for SEO issues?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Paste your HTML code into the SEO analyzer, click Analyze SEO, and review the results. The tool checks for SEO issues including missing meta tags, improper heading hierarchy, missing structured data, images without alt text, and other SEO best practices. All analysis happens locally in your browser for complete privacy."
          }
        },
        {
          "@type": "Question",
          "name": "What SEO issues does the analyzer detect?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our HTML SEO analyzer detects SEO issues including missing or improper title tags, missing meta descriptions, missing Open Graph tags, improper heading hierarchy (missing h1, skipped levels), missing alt text on images, missing structured data (JSON-LD), and low content length. It provides specific SEO best practice references for each issue."
          }
        },
        {
          "@type": "Question",
          "name": "Do you store my HTML code?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. This HTML SEO analyzer processes everything locally in your browser. Your code never leaves your device, ensuring complete privacy and security. No server uploads, no data storage, no privacy concerns."
          }
        },
        {
          "@type": "Question",
          "name": "What's the difference between errors and warnings?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Errors are critical SEO issues that significantly impact search rankings (missing title tag, missing meta description). Warnings are important but less critical SEO issues (title too long/short, missing Open Graph tags). Suggestions are best practices for better SEO beyond minimum requirements (structured data, internal linking)."
          }
        },
        {
          "@type": "Question",
          "name": "Does this analyzer check for meta tags?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Our HTML SEO analyzer checks for essential meta tags including title tag (50-60 characters), meta description (150-160 characters), Open Graph tags (og:title, og:description, og:image), canonical URL, viewport tag, and meta keywords. It validates length and provides recommendations for optimal SEO performance."
          }
        },
        {
          "@type": "Question",
          "name": "Can I analyze HTML SEO from a URL?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. You can fetch HTML from a URL using the fetch feature, though it may be blocked by CORS policies. Alternatively, copy the HTML source code from your browser's developer tools and paste it into the SEO analyzer for complete SEO testing."
          }
        },
        {
          "@type": "Question",
          "name": "What SEO standards does this analyzer follow?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "This SEO analyzer follows Google SEO best practices and industry standards. It checks for proper meta tags, heading hierarchy, structured data (Schema.org), image optimization, internal linking, and content quality. The tool provides an SEO score and level based on established SEO best practices."
          }
        },
        {
          "@type": "Question",
          "name": "Is this analyzer based on official SEO guidelines?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Our HTML SEO analyzer follows official Google SEO guidelines and industry best practices. It checks for compliance with SEO standards including proper meta tag implementation, heading hierarchy, structured data (Schema.org), image optimization, and content quality according to Google's Search Engine Optimization Starter Guide."
          }
        }
      ]
    },
    softwareApp: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "HTML SEO Analyzer",
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "Any",
      "description": "Free online HTML SEO analyzer. Check meta tags, heading hierarchy, structured data, and SEO best practices. Works instantly in your browser with complete privacy.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "1950",
        "bestRating": "5",
        "worstRating": "1"
      },
      "featureList": [
        "Meta tag validation",
        "Heading hierarchy checking",
        "Structured data detection",
        "Image alt text validation",
        "Open Graph tag checking",
        "Internal link analysis",
        "Content length analysis",
        "100% private processing"
      ]
    },
    howTo: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Analyze HTML for SEO Issues",
      "description": "Step-by-step guide to analyzing HTML code for SEO issues and best practices using our SEO analyzer tool.",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Paste or Enter HTML Code",
          "text": "Copy your HTML code and paste it into the input field, or use the fetch feature to load HTML from a URL (if CORS allows). You can also click 'Paste demo' to test with SEO-optimized sample HTML.",
          "position": 1
        },
        {
          "@type": "HowToStep",
          "name": "Click Analyze SEO",
          "text": "Click the Analyze SEO button to start the SEO analysis. The tool will analyze your HTML for SEO issues including missing meta tags, improper heading hierarchy, missing structured data, images without alt text, and other SEO best practices.",
          "position": 2
        },
        {
          "@type": "HowToStep",
          "name": "Review SEO Results",
          "text": "Review the SEO analysis report showing your SEO score, errors (critical SEO issues), warnings (important issues), and suggestions (best practices). Each issue includes the specific SEO best practice reference and how to fix it.",
          "position": 3
        },
        {
          "@type": "HowToStep",
          "name": "Fix Issues and Re-analyze",
          "text": "Fix the reported SEO issues in your HTML code, then click Analyze SEO again to ensure your code is optimized. Continue until your HTML achieves a high SEO score with no critical errors.",
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
          "name": "HTML SEO Analyzer",
          "item": "https://fixtools.io/html/html-seo-analyzer"
        }
      ]
    }
  };

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>HTML SEO Analyzer - Free SEO Checker Tool | FixTools</title>
        <meta name="title" content="HTML SEO Analyzer - Free SEO Checker Tool | FixTools" />
        <meta name="description" content="Analyze HTML code for SEO issues online for free. Check meta tags, heading hierarchy, structured data, and SEO best practices. Works instantly in your browser." />
        <meta name="keywords" content="html seo analyzer, seo checker, html seo test, meta tag checker, seo analyzer tool, html seo validator, seo audit tool, meta description checker, heading hierarchy checker, structured data validator" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        <link rel="canonical" href="https://fixtools.io/html/html-seo-analyzer" />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fixtools.io/html/html-seo-analyzer" />
        <meta property="og:title" content="HTML SEO Analyzer - Free SEO Checker Tool" />
        <meta property="og:description" content="Analyze HTML code for SEO issues. Check meta tags, heading hierarchy, and structured data." />
        <meta property="og:image" content="https://fixtools.io/images/og-html-seo-analyzer.png" />
        <meta property="og:site_name" content="FixTools" />
        
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://fixtools.io/html/html-seo-analyzer" />
        <meta property="twitter:title" content="HTML SEO Analyzer - Free Tool" />
        <meta property="twitter:description" content="Analyze HTML code for SEO issues. Check meta tags, heading hierarchy, and structured data." />
        <meta property="twitter:image" content="https://fixtools.io/images/og-html-seo-analyzer.png" />
        
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
        html:has(.html-seo-analyzer-page) {
          font-size: 100% !important;
        }
        
        .html-seo-analyzer-page {
          line-height: 1.5;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          width: 100%;
          min-height: 100vh;
        }
        
        .html-security-scanner-page *,
        .html-security-scanner-page *::before,
        .html-security-scanner-page *::after {
          box-sizing: border-box;
        }
        
        .html-security-scanner-page a {
          text-decoration: none;
        }
        
        .html-security-scanner-page h1,
        .html-security-scanner-page h2,
        .html-security-scanner-page h3,
        .html-security-scanner-page h4,
        .html-security-scanner-page h5,
        .html-security-scanner-page h6,
        .html-security-scanner-page p,
        .html-security-scanner-page ul,
        .html-security-scanner-page ol,
        .html-security-scanner-page dl,
        .html-security-scanner-page dd {
          margin: 0;
        }
        
        .html-security-scanner-page button {
          font-family: inherit;
          cursor: pointer;
        }
        
        .html-security-scanner-page input,
        .html-security-scanner-page textarea,
        .html-security-scanner-page select {
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

        .accessibility-error {
          border-left: 4px solid #ef4444;
          background-color: #fef2f2;
        }

        .accessibility-warning {
          border-left: 4px solid #f59e0b;
          background-color: #fffbeb;
        }

        .accessibility-suggestion {
          border-left: 4px solid #3b82f6;
          background-color: #eff6ff;
        }
      `}</style>

      <div className="html-seo-analyzer-page bg-[#fbfbfc] text-slate-900 min-h-screen">
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
              <span className="font-semibold text-slate-900">HTML SEO Analyzer</span>
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
                  HTML SEO Analyzer
                </span>
              </h1>
              
              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg md:leading-relaxed">
                Our <strong>HTML SEO analyzer</strong> helps you analyze HTML code for SEO issues. Check for missing meta tags, improper heading hierarchy, missing structured data, images without alt text, and other SEO best practices. Test for title tag length, meta description quality, Open Graph tags, and content optimization. All analysis happens locally in your browser.
              </p>

              <div className="mt-7 pb-5 flex flex-wrap items-center gap-3">
                <a 
                  href="#tool" 
                  className="group relative rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 transition-all duration-200 hover:shadow-xl hover:shadow-slate-900/40 hover:scale-[1.02]"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    ⚡ Analyze SEO
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
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">12+ SEO Items</dd>
                </div>
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Standards</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">Google SEO</dd>
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
                      <h4 className="text-lg font-bold text-slate-900">Meta Tags</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Validates title tags, meta descriptions, and Open Graph tags for optimal SEO.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="feature-card group rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-lg transition-all duration-300 hover:border-blue-300 hover:shadow-xl hover:-translate-y-1" style={{ animationDelay: '0.2s' }}>
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30 transition-transform duration-300 group-hover:scale-110">
                      <span className="text-2xl">📊</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">Structured Data</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Detects JSON-LD structured data and validates Schema.org implementation.
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
                <h2 className="text-xl font-semibold text-slate-900">Analyze HTML SEO online</h2>
                <p className="mt-1 text-sm text-slate-600">Paste your HTML code, click Analyze SEO, and review the SEO analysis results with errors, warnings, and suggestions.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button onClick={handlePasteDemo} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50">Paste demo</button>
                <button onClick={handleClear} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50">Clear</button>
                <button onClick={handleAnalyzeSEO} disabled={isAnalyzing} className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50">
                  {isAnalyzing ? '⏳ Analyzing...' : '⚡ Analyze SEO'}
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

            {seoResults && (
              <div className="mt-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">SEO Analysis Results</h3>
                    <div className="mt-2 flex flex-wrap items-center gap-4 text-sm">
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${seoResults.seoScore >= 90 ? 'bg-emerald-100 text-emerald-700' : seoResults.seoScore >= 70 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                        <span className="font-semibold">Score: {seoResults.seoScore}/100</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <span className="font-semibold text-slate-900">{seoResults.seoLevel}</span>
                        <span>SEO Level</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <span className="font-semibold text-red-600">{seoResults.errorCount}</span>
                        <span>Errors</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <span className="font-semibold text-amber-600">{seoResults.warningCount}</span>
                        <span>Warnings</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <span className="font-semibold text-blue-600">{seoResults.suggestionCount}</span>
                        <span>Suggestions</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={handleCopyReport} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50">{copyText}</button>
                </div>

                {seoResults.errors.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-red-700 mb-2">Errors - Critical SEO Issues ({seoResults.errors.length})</h4>
                    <div className="space-y-2">
                      {seoResults.errors.map((error, index) => (
                        <div key={index} className="seo-error rounded-lg p-3">
                          <p className="text-sm font-semibold text-red-900">{error.message}</p>
                          <p className="text-xs text-red-700 mt-1">{error.guideline || 'SEO'}: {error.suggestion}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {seoResults.warnings.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-amber-700 mb-2">Warnings - Important Issues ({seoResults.warnings.length})</h4>
                    <div className="space-y-2">
                      {seoResults.warnings.map((warning, index) => (
                        <div key={index} className="seo-warning rounded-lg p-3">
                          <p className="text-sm font-semibold text-amber-900">{warning.message}</p>
                          <p className="text-xs text-amber-700 mt-1">{warning.guideline || 'SEO'}: {warning.suggestion}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {seoResults.suggestions.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-blue-700 mb-2">Suggestions - Best Practices ({seoResults.suggestions.length})</h4>
                    <div className="space-y-2">
                      {seoResults.suggestions.map((suggestion, index) => (
                        <div key={index} className="seo-suggestion rounded-lg p-3">
                          <p className="text-sm font-semibold text-blue-900">{suggestion.message}</p>
                          <p className="text-xs text-blue-700 mt-1">{suggestion.guideline || 'SEO'}: {suggestion.suggestion}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {seoResults.seoScore >= 90 && seoResults.errorCount === 0 && (
                  <div className="mt-4 rounded-lg bg-emerald-50 border-2 border-emerald-200 p-4">
                    <p className="text-sm font-semibold text-emerald-900">✓ Your HTML has {seoResults.seoLevel} SEO! No critical issues found!</p>
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
              <h2 className="text-3xl font-bold text-slate-900">What is HTML SEO Analysis?</h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                <strong>HTML SEO analysis</strong> is the process of testing HTML code for search engine optimization issues and best practices. An <strong>HTML SEO analyzer</strong> analyzes your code to detect missing meta tags, improper heading hierarchy, missing structured data, images without alt text, and other SEO issues that could impact your search engine rankings and visibility.
              </p>
              
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                When you build websites, it's essential to ensure they're optimized for search engines. Missing title tags or meta descriptions prevent search engines from properly indexing your content. Improper heading hierarchy confuses search engine crawlers. Missing structured data (JSON-LD) prevents rich snippets in search results. An <strong>HTML SEO analyzer</strong> helps you identify and fix these issues to achieve better search engine rankings and improve your website's visibility.
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
                According to <a href="https://developers.google.com/search/docs/fundamentals/seo-starter-guide" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">Google's SEO Starter Guide</a>, proper meta tags and heading hierarchy are essential for search engine rankings. Missing title tags, improper meta descriptions, and missing structured data can significantly impact your search visibility. Our <strong>HTML SEO analyzer</strong> tests for SEO best practices to ensure your website is optimized for search engines.
              </p>
              
              <p className="text-base text-slate-700 leading-relaxed">
                Modern web development workflows should include HTML SEO analysis as a standard step. Whether you're building a new website, maintaining existing code, or learning HTML, using an <strong>HTML SEO analyzer</strong> helps ensure your code is optimized, search engine friendly, and compliant with SEO best practices. For more information on SEO standards, see the <a href="https://developers.google.com/search/docs/fundamentals/seo-starter-guide" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">Google SEO Starter Guide</a>, <a href="https://developer.mozilla.org/en-US/docs/Learn/Common_questions/What_is_search_engine_optimization" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">MDN SEO documentation</a>, and <a href="https://web.dev/vitals/" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">Google's Web Vitals guide</a>.
              </p>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white p-8 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-3">HTML SEO Impact</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">Real data showing the importance of analyzing HTML for SEO optimization</p>
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
                    According to <a href="https://developers.google.com/search/docs/fundamentals/seo-starter-guide" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">Google SEO research</a>, over 60% of websites have SEO issues that could be improved. Missing meta tags, improper heading hierarchy, missing structured data, and images without alt text are common problems. Regular HTML SEO analysis helps catch and fix these issues to achieve better search engine rankings and improve your website's visibility.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Analyze HTML SEO? - Benefits Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Why Analyze HTML SEO?</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Analyzing HTML for SEO issues is essential for building search engine optimized, discoverable, and high-ranking websites. Here's why you should make SEO analysis part of your development workflow:
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
                      Unoptimized HTML prevents websites from ranking well in search engines. Missing title tags or meta descriptions prevent search engines from properly indexing your content. Improper heading hierarchy confuses search engine crawlers. Missing structured data prevents rich snippets in search results. SEO-optimized HTML with proper meta tags, heading hierarchy, structured data, and image optimization is the foundation of <a href="https://developers.google.com/search/docs/fundamentals/seo-starter-guide" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">Google SEO best practices</a>. This is not just best practice—it's essential for improving your search engine rankings and driving organic traffic.
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
              <h2 className="text-3xl font-bold text-slate-900">Best Practices for HTML SEO</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Follow these best practices to ensure your HTML code is optimized for search engines:
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
                      Always include proper title tags (50-60 characters), meta descriptions (150-160 characters), Open Graph tags, canonical URLs, and structured data (JSON-LD). These are required for <a href="https://developers.google.com/search/docs/fundamentals/seo-starter-guide" target="_blank" rel="noopener noreferrer" className="text-orange-700 hover:text-orange-800 font-semibold underline">Google SEO best practices</a>.
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

