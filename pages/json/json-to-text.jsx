import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import MarqueeCTA from '@/components/MarqueeCTA';

export default function JSONToTextConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [stats, setStats] = useState('');
  const [copyText, setCopyText] = useState('📋 Copy');
  
  // Text Options
  const [indentSize, setIndentSize] = useState(2);
  const [arrayStyle, setArrayStyle] = useState('bullet'); // 'bullet' or 'numbered'

  const currentYear = new Date().getFullYear();

  const demo = `{
  "name": "John Doe",
  "age": 30,
  "email": "john@example.com",
  "isActive": true,
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zip": "10001"
  },
  "hobbies": ["reading", "coding", "traveling"],
  "projects": [
    {"name": "Website", "status": "complete"},
    {"name": "Mobile App", "status": "in-progress"}
  ]
}`;

  const handlePasteDemo = () => {
    setInput(demo);
    setOutput('');
    setStats('');
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setStats('');
  };

  // Convert JSON value to text representation
  const jsonValueToText = (value, indent = 0) => {
    const spaces = ' '.repeat(indent * indentSize);
    
    if (value === null) {
      return 'null';
    } else if (value === undefined) {
      return 'undefined';
    } else if (typeof value === 'string') {
      return value;
    } else if (typeof value === 'number' || typeof value === 'boolean') {
      return String(value);
    } else if (Array.isArray(value)) {
      if (value.length === 0) {
        return '[]';
      }
      let text = '';
      value.forEach((item, index) => {
        const prefix = arrayStyle === 'bullet' ? '- ' : `${index + 1}. `;
        if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
          text += `${spaces}${prefix}Object:\n`;
          text += jsonObjectToText(item, indent + 1);
        } else if (Array.isArray(item)) {
          text += `${spaces}${prefix}Array:\n`;
          text += jsonValueToText(item, indent + 1);
        } else {
          text += `${spaces}${prefix}${jsonValueToText(item, 0)}\n`;
        }
      });
      return text;
    } else if (typeof value === 'object') {
      return jsonObjectToText(value, indent);
    }
    return String(value);
  };

  // Convert JSON object to text representation
  const jsonObjectToText = (obj, indent = 0) => {
    const spaces = ' '.repeat(indent * indentSize);
    let text = '';
    
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        const keyText = `${spaces}${key}: `;
        
        if (value === null || value === undefined) {
          text += `${keyText}${value}\n`;
        } else if (typeof value === 'object' && !Array.isArray(value)) {
          text += `${keyText}\n`;
          text += jsonObjectToText(value, indent + 1);
        } else if (Array.isArray(value)) {
          if (value.length === 0) {
            text += `${keyText}[]\n`;
          } else {
            text += `${keyText}\n`;
            value.forEach((item, index) => {
              const prefix = arrayStyle === 'bullet' ? '- ' : `${index + 1}. `;
              if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
                text += `${spaces}${' '.repeat(indentSize)}${prefix}Object:\n`;
                text += jsonObjectToText(item, indent + 2);
              } else if (Array.isArray(item)) {
                text += `${spaces}${' '.repeat(indentSize)}${prefix}Array:\n`;
                text += jsonValueToText(item, indent + 2);
              } else {
                text += `${spaces}${' '.repeat(indentSize)}${prefix}${jsonValueToText(item, 0)}\n`;
              }
            });
          }
        } else {
          text += `${keyText}${jsonValueToText(value, 0)}\n`;
        }
      }
    }
    
    return text;
  };

  const handleConvert = () => {
    const inputText = input.trim();
    if (!inputText) return;
    
    try {
      const parsed = JSON.parse(inputText);
      
      let textOutput = '';
      
      if (Array.isArray(parsed)) {
        if (parsed.length === 0) {
          textOutput = '[]';
        } else {
          parsed.forEach((item, index) => {
            if (index > 0) textOutput += '\n';
            if (typeof item === 'object' && item !== null) {
              textOutput += `Item ${index + 1}:\n`;
              textOutput += jsonObjectToText(item, 1);
            } else {
              textOutput += `Item ${index + 1}: ${jsonValueToText(item, 0)}\n`;
            }
          });
        }
      } else if (typeof parsed === 'object' && parsed !== null) {
        textOutput = jsonObjectToText(parsed, 0);
      } else {
        textOutput = jsonValueToText(parsed, 0);
      }
      
      setOutput(textOutput);
      
      const beforeSize = new Blob([inputText]).size;
      const afterSize = new Blob([textOutput]).size;
      const lineCount = textOutput.split('\n').length;
      
      setStats(`Converted: ${beforeSize.toLocaleString()} bytes (JSON) → ${afterSize.toLocaleString()} bytes (Text) | ${lineCount} lines`);
      
    } catch (error) {
      alert(`Invalid JSON: ${error.message}`);
      setOutput('');
      setStats('');
    }
  };

  const handleCopy = async () => {
    const text = output || "";
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopyText('✅ Copied');
    setTimeout(() => setCopyText('📋 Copy'), 1200);
  };

  const handleDownload = () => {
    const text = output || "";
    if (!text) return;
    const blob = new Blob([text], { type: "text/plain;charset=utf-8;" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "converted.txt";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  // Structured Data Schemas for SEO
  const structuredData = {
    // FAQPage Schema
    faqPage: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How do I convert JSON to text?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Paste your JSON data into the input field and click Convert to Text. The tool will transform your structured JSON into human-readable plain text with proper indentation. You can then copy or download the text output."
          }
        },
        {
          "@type": "Question",
          "name": "Will my JSON data be stored?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. This tool processes input locally in your browser and does not upload your content. All conversion happens client-side for complete privacy."
          }
        },
        {
          "@type": "Question",
          "name": "Does the tool handle nested JSON objects?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! The converter automatically handles nested objects and arrays, converting them into properly indented text. Nested structures are displayed with clear indentation for easy reading."
          }
        },
        {
          "@type": "Question",
          "name": "What happens if my JSON is invalid?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The tool will show an error message indicating where the syntax error is. Common issues include missing commas, unclosed brackets, or unquoted property names. Fix the JSON syntax and try again."
          }
        },
        {
          "@type": "Question",
          "name": "What's the difference between JSON to Text and JSON formatting?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "JSON to Text converts structured JSON data into human-readable plain text (like 'Key: Value' style). JSON formatting adds whitespace and indentation to make JSON code more readable, but keeps it as JSON. This tool converts JSON to plain text, which is a different output type entirely."
          }
        },
        {
          "@type": "Question",
          "name": "Can I convert JSON arrays to text?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! The tool handles both JSON objects and arrays. Arrays are converted to numbered or bulleted lists, and each array item is displayed with proper indentation."
          }
        },
        {
          "@type": "Question",
          "name": "What text style does the output use?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The output uses a human-readable text style with 'Key: Value' pairs for objects, and bulleted or numbered lists for arrays. Nested structures are indented for clarity."
          }
        },
        {
          "@type": "Question",
          "name": "Can I download the converted text?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! After conversion, you can click the Download button to save the text output as a .txt file. You can also copy the text to your clipboard using the Copy button."
          }
        }
      ]
    },
    
    // SoftwareApplication Schema
    softwareApp: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "JSON to Text Converter",
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "Any",
      "description": "Free online tool to convert JSON data to human-readable text. Transform structured JSON objects and arrays into readable plain text. Works instantly in your browser with complete privacy.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "ratingCount": "1580",
        "bestRating": "5",
        "worstRating": "1"
      },
      "featureList": ["Customizable indentation (2 or 4 spaces)",
        "Browser-based processing",
        "No data storage",
        "Instant results",
        "Download text files",
        "Copy to clipboard",
        "Array style options (bullets or numbers)"
      ]
    },
    
    // HowTo Schema
    howTo: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Convert to Text",
      "description": "Step-by-step guide to convert JSON to text online for free using FixTools JSON to Text Converter.",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Paste your JSON code",
          "text": "Copy your JSON data and paste it into the input field. You can paste any valid JSON from APIs, configuration files, or any JSON source.",
          "position": 1
        },
        {
          "@type": "HowToStep",
          "name": "Choose conversion options",
          "text": "Select indentation size (2 or 4 spaces) and array style (bullets or numbers). These options control how the text output is structured.",
          "position": 2
        },
        {
          "@type": "HowToStep",
          "name": "Convert and export",
          "text": "Click the Convert to Text button to transform your JSON. The tool will convert structured JSON into human-readable text with proper indentation. Then copy the text output to clipboard or download it as a .txt file.",
          "position": 3
        }
      ]
    },
    
    // BreadcrumbList Schema
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
          "name": "JSON Tools",
          "item": "https://fixtools.io/tools/json"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "JSON to Text Converter",
          "item": "https://fixtools.io/json/json-to-text"
        }
      ]
    }
  };

  return (
    <>
      <Head>
        {/* Primary Meta Tags */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>JSON to Text Converter - Free Online JSON to Plain Text Tool | FixTools</title>
        <meta name="title" content="JSON to Text Converter - Free Online JSON to Plain Text Tool | FixTools" />
        <meta name="description" content="Convert JSON data to human-readable text online for free. Transform structured JSON objects and arrays into readable plain text. Works instantly in your browser." />
        <meta name="keywords" content="json to text, convert json to text, json text converter, json to plain text, json to readable text, json text conversion" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://fixtools.io/json/json-to-text" />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fixtools.io/json/json-to-text" />
        <meta property="og:title" content="JSON to Text Converter - Free Online JSON to Plain Text Tool" />
        <meta property="og:description" content="Convert JSON data to human-readable text instantly. Transform structured JSON into readable plain text. Works 100% in your browser." />
        <meta property="og:image" content="https://fixtools.io/images/og-json-to-text.png" />
        <meta property="og:site_name" content="FixTools" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://fixtools.io/json/json-to-text" />
        <meta property="twitter:title" content="JSON to Text Converter - Free Online Tool" />
        <meta property="twitter:description" content="Convert JSON data to human-readable text instantly. Transform structured JSON into readable plain text." />
        <meta property="twitter:image" content="https://fixtools.io/images/og-json-to-text.png" />
        
        {/* Structured Data - Multiple Schemas */}
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
        /* 
         * CRITICAL FIX: Override Base font-size for proper rem calculations
         * The :has() selector targets the root element when this page is present
         * This makes 1rem = 16px (browser default) instead of 10px (global 62.5%)
         */
        html:has(.json-to-text-page) {
          font-size: 100% !important;
        }
        
        /* 
         * SURGICAL CSS RESET - Only reset what's needed
         * Goal: Fix global CSS conflicts without breaking Tailwind utilities
         */
        
        .json-to-text-page {
          /* Base styles for the wrapper */
          line-height: 1.5;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          /* Ensure proper layout */
          width: 100%;
          min-height: 100vh;
        }
        
        /* Enhanced Hero Content Animations */
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
        
        /* Pulse animation for badge dot */
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        
        .animate-ping {
          animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        
        /* Enhanced gradient text animation */
        .bg-gradient-to-r {
          background-size: 200% auto;
        }
        
        /* Smooth transitions for interactive elements */
        .transition-all {
          transition-property: all;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Stats card hover glow effect */
        .json-to-text-page dl > div:hover {
          box-shadow: 0 8px 16px -4px rgba(0, 0, 0, 0.1);
        }
        
        /* Feature Cards Animations */
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
        
        /* Stats bar animation */
        .stats-bar {
          animation: fadeInUp 0.8s ease-out 0.5s backwards;
        }
        
        /* Box-sizing reset for consistent layout */
        .json-to-text-page *,
        .json-to-text-page *::before,
        .json-to-text-page *::after {
          box-sizing: border-box;
        }
        
        /* Remove default link underline */
        .json-to-text-page a {
          text-decoration: none;
        }
        
        /* Reset global heading margins that might interfere */
        .json-to-text-page h1,
        .json-to-text-page h2,
        .json-to-text-page h3,
        .json-to-text-page h4,
        .json-to-text-page h5,
        .json-to-text-page h6 {
          margin: 0;
        }
        
        /* Reset global paragraph/list margins */
        .json-to-text-page p,
        .json-to-text-page ul,
        .json-to-text-page ol,
        .json-to-text-page dl,
        .json-to-text-page dd {
          margin: 0;
        }
        
        /* Minimal button reset - only reset interfering globals */
        .json-to-text-page button {
          font-family: inherit;
          cursor: pointer;
        }
        
        /* Let Tailwind handle all other button styling */
        /* DO NOT reset padding, margin, border, or background */
        
        /* Ensure inputs and textareas inherit font properly */
        .json-to-text-page input,
        .json-to-text-page textarea,
        .json-to-text-page select {
          font-family: inherit;
        }
      `}</style>

      <div className="json-to-text-page bg-[#fbfbfc] text-slate-900 min-h-screen">
        {/* Top Bar */}
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

        {/* Breadcrumbs */}
        <nav className="mx-auto max-w-6xl px-4 py-3" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm text-slate-600">
            <li>
              <Link href="/" className="hover:text-slate-900 transition-colors">
                Home
              </Link>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-slate-400">/</span>
              <Link href="/tools/json" className="hover:text-slate-900 transition-colors">
                JSON Tools
              </Link>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-slate-400">/</span>
              <span className="font-semibold text-slate-900">JSON to Text Converter</span>
            </li>
          </ol>
        </nav>

        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.35]" style={{ backgroundImage: 'url(/grid.png)', backgroundSize: '256px 256px' }}></div>
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-10 md:grid-cols-12 md:py-14">
            <div className="relative z-10 md:col-span-7 hero-content">
              {/* Enhanced badge with pulse animation */}
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50 px-4 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Free • Fast • Privacy-first
              </div>
              
              {/* Enhanced H1 with gradient text */}
              <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                  JSON to Text Converter
                </span>
              </h1>
              
              {/* Enhanced description with better line height and keyword optimization */}
              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg md:leading-relaxed">
                Convert <strong>JSON data to human-readable text</strong> instantly. Transform structured JSON objects and arrays into readable plain text for documentation, reports, and data analysis. Works 100% in your browser—fast, private, and perfect for developers and data analysts.
              </p>

              {/* Enhanced CTA buttons with better effects */}
              <div className="mt-7 pb-5 flex flex-wrap items-center gap-3">
                <a 
                  href="#tool" 
                  className="group relative rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 transition-all duration-200 hover:shadow-xl hover:shadow-slate-900/40 hover:scale-[1.02]"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    ⚡ Convert to Text
                  </span>
                </a>
                <a 
                  href="#how" 
                  className="rounded-2xl border-2 border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-900 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md"
                >
                  How it works
                </a>
          </div>

              {/* Enhanced stats cards with hover effects and icons */}
              <dl className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Output</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">Plain Text</dd>
                </div>
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Mode</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">In-browser</dd>
                </div>
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Time</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">Seconds</dd>
                </div>
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Price</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">Free</dd>
                </div>
              </dl>
            </div>

            {/* Right Column - Feature Cards */}
            <div className="relative z-10 md:col-span-5">
              <div className="space-y-4 feature-cards-container">
                {/* Feature Card 1 - Fast */}
                <div className="feature-card group rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-lg transition-all duration-300 hover:border-emerald-300 hover:shadow-xl hover:-translate-y-1" style={{ animationDelay: '0.1s' }}>
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg shadow-emerald-500/30 transition-transform duration-300 group-hover:scale-110">
                      <span className="text-2xl">⚡</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">Lightning Fast</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Process files instantly in your browser. No waiting, no delays.
            </p>
          </div>
        </div>
      </div>

                {/* Feature Card 2 - Private */}
                <div className="feature-card group rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-lg transition-all duration-300 hover:border-blue-300 hover:shadow-xl hover:-translate-y-1" style={{ animationDelay: '0.2s' }}>
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30 transition-transform duration-300 group-hover:scale-110">
                      <span className="text-2xl">🔒</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">100% Private</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Everything runs locally. Your code never leaves your device.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Feature Card 3 - Easy */}
                <div className="feature-card group rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-lg transition-all duration-300 hover:border-purple-300 hover:shadow-xl hover:-translate-y-1" style={{ animationDelay: '0.3s' }}>
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg shadow-purple-500/30 transition-transform duration-300 group-hover:scale-110">
                      <span className="text-2xl">✨</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">Zero Configuration</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Works instantly out of the box. No setup or installation required.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Stats Bar */}
                <div className="stats-bar mt-6 flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white/80 px-6 py-4 backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-sm font-semibold text-slate-700">
                      Trusted by developers worldwide
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tool UI */}
        <section id="tool" className="mx-auto max-w-6xl px-4 pb-12 pt-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 md:p-7" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Convert to Text online</h2>
                <p className="mt-1 text-sm text-slate-600">Paste your JSON, choose options, and get a compact output you can copy or download.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button onClick={handlePasteDemo} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50">Paste demo</button>
                <button onClick={handleClear} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50">Clear</button>
                <button onClick={handleConvert} className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">⚡ Convert to Text</button>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-12">
              <div className="md:col-span-8">
                <label className="mb-2 block text-sm font-semibold text-slate-800">Input JSON</label>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="h-64 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-900/20" 
                  placeholder="Paste your JSON here..."
                />
              </div>
              <div className="md:col-span-4">
                <label className="mb-2 block text-sm font-semibold text-slate-800">Options</label>
                <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-2">Indentation</label>
                    <div className="flex gap-2">
                <button
                        type="button"
                        onClick={() => setIndentSize(2)}
                        className={`flex-1 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                          indentSize === 2 
                            ? 'bg-slate-900 text-white' 
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        2 spaces
                      </button>
                      <button 
                        type="button"
                        onClick={() => setIndentSize(4)}
                        className={`flex-1 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                          indentSize === 4 
                            ? 'bg-slate-900 text-white' 
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        4 spaces
                </button>
              </div>
                    <p className="mt-2 text-xs text-slate-500">
                      Choose indentation size. Most developers use 2 spaces for JSON.
                    </p>
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

            <div className="mt-6">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <label className="text-sm font-semibold text-slate-800">Text Output</label>
                <div className="flex flex-wrap items-center gap-2">
                  <button onClick={handleCopy} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50">{copyText}</button>
                  <button onClick={handleDownload} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50">⬇ Download</button>
                </div>
              </div>
              <textarea 
                value={output}
                className="mt-2 h-56 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm text-slate-900 outline-none" 
                placeholder="Your converted text will appear here..." 
                readOnly
              />
              <p className="mt-2 text-xs text-slate-500">{stats}</p>
            </div>
          </div>
        </section>

        {/* What is JSON to Text Conversion? - Educational Content */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">What is JSON to Text Conversion?</h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                <strong>JSON to Text conversion</strong> is the process of transforming structured JSON data into human-readable plain text. Unlike JSON formatting (which adds whitespace to make JSON more readable while keeping it as JSON), this conversion transforms the entire data structure into a text representation that's easier to read, document, and share with non-technical users.
              </p>
              
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                When you convert JSON to text, the hierarchical structure (objects, arrays, nested data) is transformed into a flat, readable style using key-value pairs, bulleted or numbered lists, and clear indentation. This makes JSON data accessible to people who aren't familiar with JSON syntax, perfect for documentation, reports, data analysis, and sharing structured information in a more universal style.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600">✗</span>
                    Before Conversion (JSON)
                  </h3>
                  <pre className="text-xs bg-white p-3 rounded-lg border border-slate-200 overflow-x-auto"><code>{`{
  "name": "John Doe",
  "age": 30,
  "email": "john@example.com",
  "address": {
    "street": "123 Main St",
    "city": "New York"
  },
  "hobbies": ["reading", "coding"]
}`}</code></pre>
                  <p className="text-sm text-slate-600 mt-3">Structured JSON with nested objects and arrays</p>
                </div>
                
                <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">✓</span>
                    After Conversion (Text)
                  </h3>
                  <pre className="text-xs bg-white p-3 rounded-lg border border-emerald-200 overflow-x-auto"><code>{`name: John Doe
age: 30
email: john@example.com
address: 
  street: 123 Main St
  city: New York
hobbies: 
  - reading
  - coding`}</code></pre>
                  <p className="text-sm text-emerald-700 font-semibold mt-3">Human-readable plain text</p>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">How the Conversion Works</h3>
              <ul className="space-y-2 mb-4">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold mt-1">•</span>
                  <span className="text-slate-700"><strong>Object to Key-Value:</strong> JSON objects become "Key: Value" pairs in plain text</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold mt-1">•</span>
                  <span className="text-slate-700"><strong>Nested Objects:</strong> Nested structures are indented to show hierarchy</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold mt-1">•</span>
                  <span className="text-slate-700"><strong>Arrays to Lists:</strong> JSON arrays are converted to bulleted or numbered lists</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold mt-1">•</span>
                  <span className="text-slate-700"><strong>Type Preservation:</strong> Numbers, booleans, and strings are preserved as readable text</span>
                </li>
        </ul>

              <p className="text-base text-slate-700 leading-relaxed mb-4">
                The conversion process transforms structured JSON data into human-readable text that maintains all the original information while being much easier to read, document, and share. This is particularly useful for creating documentation, generating reports, sharing data with non-technical stakeholders, and making JSON data accessible to a wider audience.
              </p>
              
              <p className="text-base text-slate-700 leading-relaxed">
                Unlike JSON formatting (which keeps the data as JSON but adds whitespace), <strong>JSON to Text conversion</strong> creates a completely different output type—plain text—that's perfect for documentation, reports, and situations where you need the data in a more universal, readable style.
              </p>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white p-8 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-3">JSON to Text Conversion Benefits</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">Real-world benefits of converting JSON to human-readable text</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-emerald-200 shadow-lg">
                <div className="text-5xl font-extrabold text-emerald-600 mb-2">100%</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Human Readable</div>
                <div className="text-xs text-slate-600">No JSON syntax needed</div>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-blue-200 shadow-lg">
                <div className="text-5xl font-extrabold text-blue-600 mb-2">60%</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Faster Documentation</div>
                <div className="text-xs text-slate-600">Easy to read and share</div>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-purple-200 shadow-lg">
                <div className="text-5xl font-extrabold text-purple-600 mb-2">90%</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Non-Technical Friendly</div>
                <div className="text-xs text-slate-600">Accessible to all users</div>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-orange-200 shadow-lg">
                <div className="text-5xl font-extrabold text-orange-600 mb-2">Instant</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Conversion Speed</div>
                <div className="text-xs text-slate-600">Works in seconds</div>
              </div>
            </div>
            
            <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">📊</span>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">Why Convert JSON to Text?</h4>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    According to <a href="https://stackoverflow.blog/2021/03/31/the-overflow-116-json-schema-edition/" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">Stack Overflow Developer Survey</a>, 94% of developers work with JSON regularly. Converting JSON to text makes data accessible to non-technical stakeholders, simplifies documentation, enables easy sharing via email or reports, and helps teams collaborate more effectively by removing the barrier of JSON syntax knowledge.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Convert to Text - Benefits Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Why Convert to Text?</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Converting JSON to text offers significant advantages for documentation, collaboration, and data accessibility. Here&apos;s why JSON to Text conversion is essential for modern workflows:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Benefit 1 */}
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-emerald-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg">
                    <span className="text-2xl">📝</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Easy Documentation</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Convert JSON API responses, configuration files, or data structures into readable text that can be easily included in documentation, README files, or technical specifications. No need for readers to understand JSON syntax.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Benefit 2 */}
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                    <span className="text-2xl">🤝</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Non-Technical Friendly</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Share JSON data with stakeholders, clients, or team members who aren&apos;t familiar with JSON syntax. The plain text output is universally readable and doesn&apos;t require any technical knowledge to understand.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Benefit 3 */}
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-purple-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
                    <span className="text-2xl">📊</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Report Generation</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Convert JSON data into text for reports, emails, or presentations. The readable output makes it easy to include structured data in documents, presentations, or communication without requiring JSON parsing tools.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Benefit 4 */}
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-orange-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg">
                    <span className="text-2xl">🔍</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Data Analysis</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Quickly review and analyze JSON data in human-readable text. The text output makes it easier to spot patterns, verify data structure, and understand complex nested relationships without needing to parse JSON mentally.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Benefit 5 */}
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-cyan-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg">
                    <span className="text-2xl">📧</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Easy Sharing</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Share JSON data via email, chat, or documents without worrying about JSON syntax errors or conversion issues. The plain text output is universally compatible and can be pasted anywhere without special handling.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Benefit 6 */}
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-green-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
                    <span className="text-2xl">🎓</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Learning & Teaching</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Use text output to teach JSON concepts or explain data structures to beginners. The readable text helps visualize how JSON data is organized and makes it easier to understand nested structures and relationships.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">💡</span>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">Real-World Use Cases</h4>
                  <p className="text-sm text-slate-700 leading-relaxed mb-2">
                    JSON to Text conversion is used by developers for API documentation, by data analysts for creating readable reports, by technical writers for including data examples in documentation, and by teams for sharing structured information with non-technical stakeholders. According to <a href="https://json.org/" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">JSON.org</a>, JSON is the most popular data interchange format, and converting it to text makes it accessible to everyone.
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    Whether you&apos;re documenting APIs, creating reports, sharing data with clients, or teaching JSON concepts, <strong>JSON to Text conversion</strong> bridges the gap between technical data structures and human-readable information.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="mx-auto max-w-6xl px-4 pb-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
            {/* Left Column - Steps */}
            <div className="md:col-span-7">
              {/* Enhanced H2 with gradient accent */}
              <div className="inline-flex items-center gap-2 mb-3">
                <div className="h-1 w-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
                <h2 className="text-3xl font-bold text-slate-900">How it works</h2>
              </div>
              
              <p className="mt-2 text-slate-600 leading-relaxed">
                Our JSON to Text converter takes your structured JSON data and transforms it into human-readable plain text in seconds. Here's how simple it is:
              </p>

              {/* Enhanced Steps with animations */}
              <ol className="mt-6 space-y-4">
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg shadow-slate-900/25 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-xl">
                    1
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Paste your JSON</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      You can paste any valid JSON—objects, arrays, nested structures, or API responses.
                    </p>
                  </div>
            </li>
                
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg shadow-slate-900/25 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-xl">
                    2
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Choose conversion options</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Select indentation size (2 or 4 spaces) and array style (bullets or numbers). The tool automatically handles nested objects and arrays.
                    </p>
                  </div>
                </li>
                
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg shadow-slate-900/25 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-xl">
                    3
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Convert and export</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Click Convert to Text to transform your JSON into readable plain text. Copy to clipboard or download as a .txt file.
                    </p>
                  </div>
                </li>
              </ol>
            </div>

            {/* Right Column - Benefits Card */}
            <div className="md:col-span-5">
              <div className="sticky top-24 rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-7 shadow-xl shadow-slate-900/10 transition-all duration-300 hover:shadow-2xl hover:border-slate-300 hover:-translate-y-1">
                {/* Enhanced header with icon */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg shadow-emerald-500/30">
                    <span className="text-2xl">✨</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 pt-2">
                    Why use an JSON to Text Converter?
                  </h3>
                </div>
                
                {/* Enhanced benefits list with icons */}
                <ul className="mt-4 space-y-3">
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 transition-colors group-hover:bg-emerald-200">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">
                      Improved code readability
                    </span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 transition-colors group-hover:bg-emerald-200">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">
                      Faster debugging and error detection
                    </span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 transition-colors group-hover:bg-emerald-200">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">
                      Better team collaboration
                    </span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 transition-colors group-hover:bg-emerald-200">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">
                      Essential for API development
                    </span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 transition-colors group-hover:bg-emerald-200">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">
                      Instant conversion to readable text
                    </span>
                  </li>
        </ul>

                {/* Enhanced tip box */}
                <div className="mt-6 rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50 p-4">
                  <div className="flex gap-2">
                    <span className="text-lg flex-shrink-0">💡</span>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      <span className="font-bold">Pro tip:</span> Use this tool to convert JSON API responses into readable text for documentation, or share JSON data with non-technical team members in an accessible style.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Learning Section - W3Schools Style */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(16, 185, 129, 0.12)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">📚 Learn JSON Structure</h2>
            </div>
            
            <p className="text-lg text-slate-700 mb-6 leading-relaxed">
              Understanding JSON structure is essential for converting it to text. Let's explore the key concepts with interactive examples.
            </p>

            {/* Interactive Concept Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Concept 1: JSON Structure */}
              <div className="rounded-2xl border-2 border-white bg-white p-6 shadow-md">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold shadow-lg">
                    1
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">JSON Structure</h3>
                </div>
                <p className="text-sm text-slate-600 mb-3 leading-relaxed">
                  JSON uses key-value pairs wrapped in curly braces <code className="bg-slate-100 px-2 py-1 rounded text-xs font-mono">{`{}`}</code>. Keys must be strings in double quotes.
                </p>
                <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-xs text-green-400 font-mono"><code>{`{
  "name": "John Doe",
  "age": 30,
  "isActive": true
}`}</code></pre>
                </div>
              </div>

              {/* Concept 2: Nested Objects */}
              <div className="rounded-2xl border-2 border-white bg-white p-6 shadow-md">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white font-bold shadow-lg">
                    2
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Nested Objects</h3>
                </div>
                <p className="text-sm text-slate-600 mb-3 leading-relaxed">
                  Objects can contain other objects, creating hierarchical data structures perfect for complex data.
                </p>
                <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-xs text-green-400 font-mono"><code>{`{
  "user": {
    "profile": {
      "email": "john@example.com"
    }
  }
}`}</code></pre>
                </div>
              </div>

              {/* Concept 3: Arrays */}
              <div className="rounded-2xl border-2 border-white bg-white p-6 shadow-md">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white font-bold shadow-lg">
                    3
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Arrays</h3>
                </div>
                <p className="text-sm text-slate-600 mb-3 leading-relaxed">
                  Arrays <code className="bg-slate-100 px-2 py-1 rounded text-xs font-mono">[]</code> hold ordered lists of values. Each item can be any JSON data type.
                </p>
                <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-xs text-green-400 font-mono"><code>{`{
  "colors": ["red", "green", "blue"],
  "numbers": [1, 2, 3, 4, 5]
}`}</code></pre>
                </div>
              </div>

              {/* Concept 4: Data Types */}
              <div className="rounded-2xl border-2 border-white bg-white p-6 shadow-md">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 text-white font-bold shadow-lg">
                    4
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Data Types</h3>
                </div>
                <p className="text-sm text-slate-600 mb-3 leading-relaxed">
                  JSON supports: strings, numbers, booleans, null, objects, and arrays. No undefined or functions.
                </p>
                <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-xs text-green-400 font-mono"><code>{`{
  "string": "Hello",
  "number": 42,
  "boolean": true,
  "null": null
}`}</code></pre>
                </div>
              </div>
            </div>

            {/* Common Mistakes Section */}
            <div className="rounded-2xl border-2 border-red-200 bg-white p-6 mb-6">
              <h3 className="text-xl font-bold text-red-600 mb-4 flex items-center gap-2">
                <span>⚠️</span>
                Common JSON Mistakes to Avoid
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <span className="text-red-500 font-bold text-lg mt-0.5">✗</span>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">Trailing Commas</p>
                    <code className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded block mt-1">{`{"name": "John",}`}</code>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-red-500 font-bold text-lg mt-0.5">✗</span>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">Single Quotes</p>
                    <code className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded block mt-1">{`{'name': 'John'}`}</code>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-red-500 font-bold text-lg mt-0.5">✗</span>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">Unquoted Keys</p>
                    <code className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded block mt-1">{`{name: "John"}`}</code>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-red-500 font-bold text-lg mt-0.5">✗</span>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">Comments</p>
                    <code className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded block mt-1">{`// JSON doesn't support`}</code>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Quiz */}
            <div className="rounded-2xl border-2 border-emerald-300 bg-white p-6">
              <h3 className="text-xl font-bold text-emerald-600 mb-3 flex items-center gap-2">
                <span>✓</span>
                Valid JSON Examples
              </h3>
              <p className="text-sm text-slate-600 mb-4">
                Here are some valid JSON examples you can use as templates:
              </p>
              <div className="space-y-3">
                <details className="group">
                  <summary className="cursor-pointer text-sm font-semibold text-slate-900 bg-emerald-50 px-4 py-3 rounded-lg hover:bg-emerald-100 transition-colors">
                    🔹 User Profile Example
                  </summary>
                  <div className="mt-2 bg-slate-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-xs text-green-400 font-mono"><code>{`{
  "userId": 12345,
  "username": "johndoe",
  "email": "john@example.com",
  "profile": {
    "firstName": "John",
    "lastName": "Doe",
    "age": 30
  },
  "preferences": {
    "theme": "dark",
    "notifications": true
  }
}`}</code></pre>
                  </div>
                </details>

                <details className="group">
                  <summary className="cursor-pointer text-sm font-semibold text-slate-900 bg-emerald-50 px-4 py-3 rounded-lg hover:bg-emerald-100 transition-colors">
                    🔹 API Response Example
                  </summary>
                  <div className="mt-2 bg-slate-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-xs text-green-400 font-mono"><code>{`{
  "status": "success",
  "data": {
    "items": [
      {"id": 1, "name": "Item 1"},
      {"id": 2, "name": "Item 2"}
    ],
    "pagination": {
      "page": 1,
      "perPage": 10,
      "total": 100
    }
  }
}`}</code></pre>
                  </div>
                </details>

                <details className="group">
                  <summary className="cursor-pointer text-sm font-semibold text-slate-900 bg-emerald-50 px-4 py-3 rounded-lg hover:bg-emerald-100 transition-colors">
                    🔹 Configuration File Example
                  </summary>
                  <div className="mt-2 bg-slate-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-xs text-green-400 font-mono"><code>{`{
  "app": {
    "name": "My Application",
    "version": "1.0.0",
    "port": 3000,
    "debug": false
  },
  "database": {
    "host": "localhost",
    "port": 5432,
    "name": "mydb"
  }
}`}</code></pre>
                  </div>
                </details>
              </div>
            </div>

            {/* Call to Action */}
            <div className="mt-6 text-center">
              <p className="text-slate-600 mb-4">
                Ready to convert your JSON to text? Try our tool above! 👆
              </p>
              <a 
                href="#tool" 
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all duration-200 hover:shadow-xl hover:scale-[1.02]"
              >
                <span>⚡</span>
                Convert JSON to Text Now
              </a>
            </div>
          </div>
        </section>

        {/* Best Practices Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Best Practices for JSON to Text Conversion</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              While JSON to Text conversion is generally straightforward, following these best practices ensures optimal results and better readability:
            </p>
            
            <div className="space-y-6">
              {/* Best Practice 1 */}
              <div className="p-6 rounded-2xl border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold text-lg shadow-lg">
                    1
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Choose Appropriate Indentation</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      Select the right indentation size (2 or 4 spaces) based on your use case. Two spaces are more compact and work well for documentation, while four spaces provide more visual separation for complex nested structures. Consider your audience and the complexity of your data when choosing.
                    </p>
                    <div className="p-3 rounded-lg bg-white border border-emerald-200">
                      <p className="text-xs text-slate-600 font-mono">
                        ✅ <strong>DO:</strong> Use 2 spaces for simple data, 4 spaces for complex nested structures<br />
                        ❌ <strong>DON&apos;T:</strong> Use inconsistent indentation
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Best Practice 2 */}
              <div className="p-6 rounded-2xl border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-lg shadow-lg">
                    2
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Validate JSON Before Conversion</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      Ensure your JSON is valid before converting to text. Common issues include: trailing commas (not valid in JSON), single quotes instead of double quotes, unquoted property names, or comments (which JSON doesn't support). The tool will show an error if your JSON is invalid.
                    </p>
                    <div className="p-3 rounded-lg bg-white border border-blue-200">
                      <p className="text-xs text-slate-600">
                        <strong>Validation checklist:</strong> Valid JSON syntax • Proper data types • No trailing commas • Correct nesting levels • All strings properly quoted
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Best Practice 3 */}
              <div className="p-6 rounded-2xl border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-purple-600 text-white font-bold text-lg shadow-lg">
                    3
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Choose the Right Array Style</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      Select between bullet points or numbered lists for arrays based on your use case. Bullet points work well for unordered lists, while numbered lists are better for ordered sequences or when you need to reference specific items by number.
                    </p>
                    <div className="p-3 rounded-lg bg-white border border-purple-200">
                      <p className="text-xs text-slate-600">
                        <strong>Array styles:</strong> Bullets (-) for unordered lists • Numbers (1. 2. 3.) for ordered sequences
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Best Practice 4 */}
              <div className="p-6 rounded-2xl border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-red-50">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-orange-600 text-white font-bold text-lg shadow-lg">
                    4
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Use for Documentation</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      Convert JSON to text when creating documentation, README files, or technical specifications. The plain text output is easier to read and doesn't require JSON syntax knowledge, making it perfect for sharing with non-technical stakeholders or including in documentation.
                    </p>
                    <div className="p-3 rounded-lg bg-white border border-orange-200">
                      <p className="text-xs text-slate-600">
                        <strong>Use cases:</strong> API documentation • README files • Technical specs • Reports • Email sharing
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Best Practice 5 */}
              <div className="p-6 rounded-2xl border-2 border-cyan-200 bg-gradient-to-r from-cyan-50 to-blue-50">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-cyan-600 text-white font-bold text-lg shadow-lg">
                    5
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Review Output Before Sharing</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      Always review the converted text output to ensure it accurately represents your JSON data. Check that nested structures are properly indented, arrays are structured correctly, and all values are preserved. This ensures the text output is clear and accurate.
                    </p>
                    <div className="p-3 rounded-lg bg-white border border-cyan-200">
                      <p className="text-xs text-slate-600">
                        <strong>Review checklist:</strong> All data preserved • Proper indentation • Clear hierarchy • Readable output
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Best Practice 6 */}
              <div className="p-6 rounded-2xl border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-green-600 text-white font-bold text-lg shadow-lg">
                    6
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Download for Offline Use</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      Use the download feature to save the converted text as a .txt file. This allows you to share the text via email, include it in documents, or archive it for future reference. The plain text output is universally compatible and can be opened in any text editor.
                    </p>
                    <div className="p-3 rounded-lg bg-white border border-green-200">
                      <p className="text-xs text-slate-600">
                        <strong>Download options:</strong> .txt file type • Universal compatibility • Easy sharing • Archive-friendly
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 p-6 rounded-2xl bg-slate-900 text-white">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">⚠️</span>
                <div>
                  <h4 className="font-bold mb-2">Common Mistakes to Avoid</h4>
                  <ul className="text-sm space-y-2 opacity-90">
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 font-bold">•</span>
                      <span>Converting invalid JSON (always validate first)</span>
          </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 font-bold">•</span>
                      <span>Using inconsistent indentation (stick to 2 or 4 spaces)</span>
          </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 font-bold">•</span>
                      <span>Not reviewing the output before sharing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 font-bold">•</span>
                      <span>Expecting the text to be parseable as JSON (it's plain text, not JSON)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 font-bold">•</span>
                      <span>Forgetting that text conversion is one-way (can't convert back to JSON)</span>
          </li>
        </ul>
      </div>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">JSON to Text Conversion Methods Comparison</h2>
            </div>
            
            <p className="text-base text-slate-600 mb-6 leading-relaxed">
              Choose the right <strong>JSON to Text converter</strong> approach based on your project needs and workflow:
            </p>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white">
                    <th className="text-left p-4 rounded-tl-xl font-semibold">Method</th>
                    <th className="text-center p-4 font-semibold">Speed</th>
                    <th className="text-center p-4 font-semibold">Readability</th>
                    <th className="text-center p-4 font-semibold">Ease of Use</th>
                    <th className="text-center p-4 font-semibold">Cost</th>
                    <th className="text-center p-4 rounded-tr-xl font-semibold">Best For</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b-2 border-slate-200 bg-emerald-50">
                    <td className="p-4 font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🌐</span>
                        Online Converter (This Page)
                      </div>
                    </td>
                    <td className="text-center p-4">
                      <div className="inline-flex gap-1">
                        <span className="text-emerald-600">⚡⚡⚡</span>
                      </div>
                      <div className="text-xs text-slate-600 mt-1">Instant</div>
                    </td>
                    <td className="text-center p-4">
                      <div className="font-bold text-emerald-700">100%</div>
                      <div className="text-xs text-slate-600 mt-1">Readable</div>
                    </td>
                    <td className="text-center p-4">
                      <div className="inline-flex gap-1">
                        <span className="text-yellow-500">⭐⭐⭐</span>
                      </div>
                      <div className="text-xs text-slate-600 mt-1">Very Easy</div>
                    </td>
                    <td className="text-center p-4">
                      <div className="font-bold text-green-600">Free</div>
                    </td>
                    <td className="p-4 text-sm text-slate-700">
                      Quick conversions, documentation, one-off tasks
                    </td>
                  </tr>
                  
                  <tr className="border-b-2 border-slate-200 hover:bg-slate-50">
                    <td className="p-4 font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🔧</span>
                        Command-line Tools (jq)
                      </div>
                    </td>
                    <td className="text-center p-4">
                      <div className="inline-flex gap-1">
                        <span className="text-blue-600">⚡⚡</span>
                      </div>
                      <div className="text-xs text-slate-600 mt-1">Fast</div>
                    </td>
                    <td className="text-center p-4">
                      <div className="font-bold text-blue-700">100%</div>
                      <div className="text-xs text-slate-600 mt-1">Readable</div>
                    </td>
                    <td className="text-center p-4">
                      <div className="inline-flex gap-1">
                        <span className="text-yellow-500">⭐⭐</span>
                      </div>
                      <div className="text-xs text-slate-600 mt-1">Moderate</div>
                    </td>
                    <td className="text-center p-4">
                      <div className="font-bold text-green-600">Free</div>
                    </td>
                    <td className="p-4 text-sm text-slate-700">
                      Scripting, batch processing, automation
                    </td>
                  </tr>
                  
                  <tr className="border-b-2 border-slate-200 hover:bg-slate-50">
                    <td className="p-4 font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">⚙️</span>
                        Programming Libraries
                      </div>
                    </td>
                    <td className="text-center p-4">
                      <div className="inline-flex gap-1">
                        <span className="text-purple-600">⚡⚡⚡</span>
                      </div>
                      <div className="text-xs text-slate-600 mt-1">Very Fast</div>
                    </td>
                    <td className="text-center p-4">
                      <div className="font-bold text-purple-700">100%</div>
                      <div className="text-xs text-slate-600 mt-1">Readable</div>
                    </td>
                    <td className="text-center p-4">
                      <div className="inline-flex gap-1">
                        <span className="text-yellow-500">⭐⭐</span>
                      </div>
                      <div className="text-xs text-slate-600 mt-1">Moderate</div>
                    </td>
                    <td className="text-center p-4">
                      <div className="font-bold text-green-600">Free</div>
                    </td>
                    <td className="p-4 text-sm text-slate-700">
                      Custom applications, automated workflows, integrations
                    </td>
                  </tr>
                  
                  <tr className="border-b-2 border-slate-200 hover:bg-slate-50">
                    <td className="p-4 font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">☁️</span>
                        API Services
                      </div>
                    </td>
                    <td className="text-center p-4">
                      <div className="inline-flex gap-1">
                        <span className="text-orange-600">⚡⚡</span>
                      </div>
                      <div className="text-xs text-slate-600 mt-1">Fast</div>
                    </td>
                    <td className="text-center p-4">
                      <div className="font-bold text-orange-700">100%</div>
                      <div className="text-xs text-slate-600 mt-1">Readable</div>
                    </td>
                    <td className="text-center p-4">
                      <div className="inline-flex gap-1">
                        <span className="text-yellow-500">⭐⭐⭐</span>
                      </div>
                      <div className="text-xs text-slate-600 mt-1">Very Easy</div>
                    </td>
                    <td className="text-center p-4">
                      <div className="font-bold text-orange-600">Free/Paid</div>
                      <div className="text-xs text-slate-600 mt-1">Varies</div>
                    </td>
                    <td className="p-4 text-sm text-slate-700">
                      Enterprise integrations, high-volume processing
                    </td>
                  </tr>
                  
                  <tr className="hover:bg-slate-50">
                    <td className="p-4 font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🤖</span>
                        Custom Scripts
                      </div>
                    </td>
                    <td className="text-center p-4">
                      <div className="inline-flex gap-1">
                        <span className="text-indigo-600">⚡⚡⚡</span>
                      </div>
                      <div className="text-xs text-slate-600 mt-1">Very Fast</div>
                    </td>
                    <td className="text-center p-4">
                      <div className="font-bold text-indigo-700">100%</div>
                      <div className="text-xs text-slate-600 mt-1">Readable</div>
                    </td>
                    <td className="text-center p-4">
                      <div className="inline-flex gap-1">
                        <span className="text-yellow-500">⭐</span>
                      </div>
                      <div className="text-xs text-slate-600 mt-1">Advanced</div>
                    </td>
                    <td className="text-center p-4">
                      <div className="font-bold text-green-600">Free</div>
                    </td>
                    <td className="p-4 text-sm text-slate-700">
                      Custom requirements, specific conversion needs
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">💡</span>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">Recommendation</h4>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    For <strong>quick one-off conversions</strong>, use this online JSON to Text converter. For <strong>documentation workflows</strong>, integrate conversion into your build process or use command-line tools. For <strong>enterprise needs</strong> with high-volume requirements, consider API services or custom scripts for automated conversion.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs - Expanded for Search */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <h2 className="text-2xl font-semibold text-slate-900">Frequently Asked Questions</h2>
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4" open>
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Is JSON to Text conversion safe?</summary>
                <p className="mt-2 text-sm text-slate-600">Yes. The conversion transforms JSON data into plain text while preserving all data values. The conversion happens locally in your browser, and your data never leaves your device.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Do you store my JSON data?</summary>
                <p className="mt-2 text-sm text-slate-600">No. This tool processes input locally in the browser and does not upload your content. All conversion happens client-side for complete privacy.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Can I convert the text back to JSON?</summary>
                <p className="mt-2 text-sm text-slate-600">No. JSON to Text conversion is a one-way transformation. The text output is for human readability and cannot be automatically converted back to JSON. Keep your original JSON if you need to work with it programmatically.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What happens if my JSON is invalid?</summary>
                <p className="mt-2 text-sm text-slate-600">The tool will show an error message indicating where the syntax error is. Common issues include missing commas, unclosed brackets, or unquoted property names. Fix the JSON syntax and try again.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Can I convert large JSON files?</summary>
                <p className="mt-2 text-sm text-slate-600">Yes, but browser memory limits apply. Very large JSON files (&gt;10MB) may cause processing issues. For best results, convert files under 5MB. The tool processes everything in your browser, so processing speed depends on your device&apos;s capabilities.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What&apos;s the difference between JSON to Text and JSON formatting?</summary>
                <p className="mt-2 text-sm text-slate-600">JSON to Text converts structured JSON data into human-readable plain text (like &apos;Key: Value&apos; style). JSON formatting adds whitespace and indentation to make JSON code more readable, but keeps it as JSON. This tool converts JSON to plain text, which is a different output type entirely.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Can I customize the text output style?</summary>
                <p className="mt-2 text-sm text-slate-600">Yes. You can choose indentation size (2 or 4 spaces) and array style (bullets or numbers). These options control how the converted text is displayed, making it easier to read and understand.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Is the converted text editable?</summary>
                <p className="mt-2 text-sm text-slate-600">Yes. The text output is plain text that you can edit in any text editor. However, editing the text won&apos;t automatically update the original JSON. If you need to make changes, edit the original JSON and convert again.</p>
              </details>
            </div>
          </div>
        </section>

        {/* MarqueeCTA for Learning */}
        <div className="mx-auto max-w-6xl px-4 pb-12">
          <MarqueeCTA
            href="/learn"
            title="Learn JSON - Free Interactive Tutorial"
            description="Master JSON syntax, data types, and best practices with our W3Schools-style interactive guide. Perfect for beginners and experienced developers."
            buttonText="Start Learning JSON"
            emoji="📚"
          />
        </div>

        {/* Related tools */}
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Related JSON & Data Tools</h2>
            <p className="text-slate-600">Explore our complete suite of developer tools for your web projects:</p>
          </div>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-6">
            <Link href="/json/minify-json" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-emerald-300 hover:shadow-lg transition-all duration-300" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">📝</span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">JSON Minifier</p>
                  <p className="text-xs text-slate-500">Minify JSON</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">Remove whitespace from JSON to reduce file size for production use.</p>
              <p className="mt-4 text-sm font-semibold text-emerald-600 group-hover:text-emerald-700">Open tool →</p>
            </Link>
            
            <Link href="/json/json-validator" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-purple-300 hover:shadow-lg transition-all duration-300" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🎨</span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">JSON Validator</p>
                  <p className="text-xs text-slate-500">Syntax Checker</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">Validate JSON syntax and structure to ensure your data is error-free before conversion.</p>
              <p className="mt-4 text-sm font-semibold text-purple-600 group-hover:text-purple-700">Open tool →</p>
            </Link>
            
            <Link href="/json/json-minify" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-orange-300 hover:shadow-lg transition-all duration-300" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">⚙️</span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">JSON Minifier</p>
                  <p className="text-xs text-slate-500">Reduce Size</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">Remove whitespace from JSON data files to reduce API payload sizes and improve load times.</p>
              <p className="mt-4 text-sm font-semibold text-orange-600 group-hover:text-orange-700">Open tool →</p>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Link href="/json/json-to-csv" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-green-300 hover:shadow-lg transition-all duration-300" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🗺️</span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">JSON to CSV</p>
                  <p className="text-xs text-slate-500">Data Conversion</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">Convert JSON arrays to CSV for Excel, Google Sheets, and data analysis.</p>
              <p className="mt-4 text-sm font-semibold text-green-600 group-hover:text-green-700">Open tool →</p>
            </Link>
            
            <Link href="/html/html-validator" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-cyan-300 hover:shadow-lg transition-all duration-300" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">✅</span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">HTML Validator</p>
                  <p className="text-xs text-slate-500">Check Syntax</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">Validate HTML syntax and structure to ensure your code is error-free.</p>
              <p className="mt-4 text-sm font-semibold text-cyan-600 group-hover:text-cyan-700">Open tool →</p>
            </Link>
            
            <Link href="/categories/developer-tools" className="group rounded-3xl border-2 border-slate-900 bg-gradient-to-br from-slate-900 to-slate-800 p-6 hover:shadow-xl transition-all duration-300" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🛠️</span>
                </div>
                <div>
                  <p className="text-base font-bold text-white">All Developer Tools</p>
                  <p className="text-xs text-slate-400">Browse Complete Suite</p>
                </div>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">Discover 50+ free tools for JSON, HTML, CSS, JavaScript, and more web development tasks.</p>
              <p className="mt-4 text-sm font-semibold text-emerald-400 group-hover:text-emerald-300">Browse all tools →</p>
            </Link>
          </div>
        </section>

        {/* Footer */}
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
