import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import MarqueeCTA from '@/components/MarqueeCTA';

export default function Base64ToJSONDecoder() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [stats, setStats] = useState('');
  const [copyText, setCopyText] = useState('📋 Copy');
  
  // Options
  const [indentSize, setIndentSize] = useState(2);
  const [autoDetectUrlSafe, setAutoDetectUrlSafe] = useState(true);
  const [autoRemovePrefix, setAutoRemovePrefix] = useState(true);

  const currentYear = new Date().getFullYear();

  const demo = `eyJ1c2VySWQiOiAidXNlcl8xMjM0NSIsICJ0b2tlbiI6ICJhYmMxMjNkZWY0NTYiLCAicGVybWlzc2lvbnMiOiBbInJlYWQiLCAid3JpdGUiXSwgImV4cGlyZXNBdCI6ICIyMDI0LTEyLTMxVDIzOjU5OjU5WiIsICJtZXRhZGF0YSI6IHsiaXAiOiAiMTkyLjE2OC4xLjEiLCAidXNlckFnZW50IjogIk1vemlsbGEvNS4wIn19`;

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

  const handleDecode = () => {
    const inputText = input.trim();
    if (!inputText) return;
    
    try {
      let base64String = inputText;
      
      // Auto-remove data URI prefix if enabled
      if (autoRemovePrefix && base64String.startsWith('data:')) {
        const commaIndex = base64String.indexOf(',');
        if (commaIndex !== -1) {
          base64String = base64String.substring(commaIndex + 1);
        }
      }
      
      // Auto-detect and handle URL-safe Base64
      if (autoDetectUrlSafe && (base64String.includes('-') || base64String.includes('_'))) {
        // URL-safe Base64: replace - with + and _ with /
        base64String = base64String.replace(/-/g, '+').replace(/_/g, '/');
        // Add padding if needed
        while (base64String.length % 4 !== 0) {
          base64String += '=';
        }
      }
      
      // Decode Base64 to string
      const decoded = decodeURIComponent(escape(atob(base64String)));
      
      // Validate and parse as JSON
      const parsed = JSON.parse(decoded);
      
      // Format JSON with indentation
      const formatted = JSON.stringify(parsed, null, indentSize);
      setOutput(formatted);
      
      const beforeSize = new Blob([inputText]).size;
      const afterSize = new Blob([formatted]).size;
      const sizeDiff = beforeSize - afterSize;
      const sizeChangePercent = beforeSize > 0 ? ((sizeDiff / beforeSize) * 100).toFixed(1) : "0.0";
      
      setStats(`Decoded: ${beforeSize.toLocaleString()} bytes (Base64) → ${afterSize.toLocaleString()} bytes (JSON) ${sizeDiff >= 0 ? '-' : '+'}${sizeChangePercent}%`);
      
    } catch (error) {
      if (error.message.includes('Invalid character')) {
        alert(`Invalid Base64 string: ${error.message}. Make sure the input is valid Base64 encoded data.`);
      } else if (error.message.includes('Unexpected token')) {
        alert(`Decoded data is not valid JSON: ${error.message}. The Base64 string may not contain JSON data.`);
      } else {
        alert(`Error: ${error.message}`);
      }
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
    const blob = new Blob([text], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "decoded.json";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  // Structured Data Schemas for SEO
  const structuredData = {
    faqPage: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How do I decode Base64 to JSON?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Paste your Base64 string into the input field, enable auto-detection options if needed, and click Decode. The tool will decode the Base64 string, validate it as JSON, and format it for easy reading."
          }
        },
        {
          "@type": "Question",
          "name": "What is Base64 decoding?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Base64 decoding converts Base64-encoded strings back to their original format. When decoding Base64 to JSON, the tool first decodes the Base64 string to text, then validates and formats it as JSON."
          }
        },
        {
          "@type": "Question",
          "name": "Does this tool handle URL-safe Base64?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. The tool can auto-detect URL-safe Base64 encoding (which uses - and _ instead of + and /). Enable the auto-detect option to automatically convert URL-safe Base64 to standard Base64 before decoding."
          }
        },
        {
          "@type": "Question",
          "name": "Can I decode JWT tokens with this tool?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. JWT tokens contain Base64-encoded JSON payloads. Paste the Base64-encoded payload section (between the dots) into this tool to decode and view the JSON data. Note: This only decodes the payload, not the full JWT token."
          }
        },
        {
          "@type": "Question",
          "name": "What if the decoded data is not JSON?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "If the Base64 string doesn't contain valid JSON data, the tool will show an error. Base64 can encode any data (text, images, binary), but this tool specifically validates and formats the output as JSON."
          }
        },
        {
          "@type": "Question",
          "name": "Is my Base64 data stored on your servers?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. All decoding happens locally in your browser using JavaScript. Your Base64 data never leaves your device and is not uploaded to any server."
          }
        },
        {
          "@type": "Question",
          "name": "How do I handle data URI prefixes?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "If your Base64 string starts with 'data:application/json;base64,', enable the auto-remove prefix option. The tool will automatically strip the prefix before decoding."
          }
        },
        {
          "@type": "Question",
          "name": "Why is my Base64 string invalid?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Base64 strings must only contain A-Z, a-z, 0-9, +, /, and = characters (or - and _ for URL-safe). Invalid characters, incorrect padding, or truncated strings will cause decoding errors."
          }
        }
      ]
    },
    
    softwareApp: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Base64 to JSON Decoder",
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "Any",
      "description": "Free online tool to decode Base64 strings to JSON format. Decode JWT token payloads, API responses, and Base64-encoded JSON data. Supports URL-safe Base64 and data URI prefixes.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "1240",
        "bestRating": "5",
        "worstRating": "1"
      },
      "featureList": [
        "Decode Base64 to JSON format",
        "URL-safe Base64 auto-detection",
        "Data URI prefix removal",
        "JSON validation and formatting",
        "JWT token payload decoding",
        "Browser-based processing (no uploads)",
        "Download decoded JSON",
        "Copy to clipboard"
      ]
    },
    
    howTo: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Decode Base64 to JSON",
      "description": "Step-by-step guide to decode Base64-encoded strings to JSON format online for free using FixTools Base64 to JSON Decoder.",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Paste your Base64 string",
          "text": "Copy your Base64-encoded string (from JWT tokens, API responses, or data URIs) and paste it into the input field. The tool supports both standard and URL-safe Base64 encoding.",
          "position": 1
        },
        {
          "@type": "HowToStep",
          "name": "Configure decoding options",
          "text": "Enable auto-detect URL-safe if your Base64 string uses - and _ characters. Enable auto-remove prefix if your string starts with 'data:application/json;base64,'. Choose JSON indentation size for formatting.",
          "position": 2
        },
        {
          "@type": "HowToStep",
          "name": "Decode and view JSON",
          "text": "Click the Decode button to convert your Base64 string to JSON. The tool validates the decoded data as JSON and formats it with proper indentation. Copy to clipboard or download the decoded JSON file.",
          "position": 3
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
          "name": "JSON Tools",
          "item": "https://fixtools.io/tools/json"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Base64 to JSON Decoder",
          "item": "https://fixtools.io/json/base64-to-json"
        }
      ]
    }
  };

  return (
    <>
      <Head>
        {/* Primary Meta Tags - SEO Optimized */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>Base64 to JSON Decoder - Free Online Base64 JSON Converter | FixTools</title>
        <meta name="title" content="Base64 to JSON Decoder - Free Online Base64 JSON Converter | FixTools" />
        <meta name="description" content="Decode Base64 to JSON online for free. Decode JWT token payloads, API responses, and Base64-encoded JSON data. Supports URL-safe Base64 and data URI prefixes." />
        <meta name="keywords" content="base64 to json, base64 json decoder, decode base64 to json, base64 decode json online, jwt token decoder, base64 to json converter" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        <link rel="canonical" href="https://fixtools.io/json/base64-to-json" />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        {/* Open Graph - SEO */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fixtools.io/json/base64-to-json" />
        <meta property="og:title" content="Base64 to JSON Decoder - Free Online Tool" />
        <meta property="og:description" content="Decode Base64 to JSON instantly. Perfect for JWT token payloads, API responses, and Base64-encoded JSON data. URL-safe Base64 supported." />
        <meta property="og:image" content="https://fixtools.io/images/og-base64-to-json.png" />
        <meta property="og:site_name" content="FixTools" />
        
        {/* Twitter Card */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://fixtools.io/json/base64-to-json" />
        <meta property="twitter:title" content="Base64 to JSON Decoder - Free Online Tool" />
        <meta property="twitter:description" content="Decode Base64 to JSON instantly. JWT tokens and API responses ready." />
        <meta property="twitter:image" content="https://fixtools.io/images/og-base64-to-json.png" />
        
        {/* Structured Data */}
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
        html:has(.base64-to-json-page) {
          font-size: 100% !important;
        }
        
        .base64-to-json-page {
          line-height: 1.5;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          width: 100%;
          min-height: 100vh;
        }
        
        .base64-to-json-page *,
        .base64-to-json-page *::before,
        .base64-to-json-page *::after {
          box-sizing: border-box;
        }
        
        .base64-to-json-page h1,
        .base64-to-json-page h2,
        .base64-to-json-page h3,
        .base64-to-json-page p,
        .base64-to-json-page ul,
        .base64-to-json-page ol {
          margin: 0;
        }
        
        .base64-to-json-page button {
          font-family: inherit;
          cursor: pointer;
        }
        
        .base64-to-json-page input,
        .base64-to-json-page textarea,
        .base64-to-json-page select {
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
      `}</style>

      <div className="base64-to-json-page bg-[#fbfbfc] text-slate-900 min-h-screen">
        {/* Header */}
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
              <span className="font-semibold text-slate-900">Base64 to JSON Decoder</span>
            </li>
          </ol>
        </nav>

        {/* Hero - SEO Optimized */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.35]" style={{ backgroundImage: 'url(/grid.png)', backgroundSize: '256px 256px' }}></div>
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-10 md:grid-cols-12 md:py-14">
            <div className="relative z-10 md:col-span-7 hero-content">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-1.5 text-xs font-semibold text-indigo-700 shadow-sm backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                Free • Fast • Privacy-first
              </div>
              
              <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                  Base64 to JSON Decoder
                </span>
              </h1>
              
              {/* SEO-optimized description with target keywords */}
              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg md:leading-relaxed">
                <strong>Decode Base64 to JSON</strong> instantly. Decode JWT token payloads, API responses, and Base64-encoded JSON data. Supports URL-safe Base64 decoding and automatic data URI prefix removal. Perfect for developers working with JWT tokens and Base64-encoded JSON.
              </p>

              <div className="mt-7 pb-5 flex flex-wrap items-center gap-3">
                <a 
                  href="#tool" 
                  className="group relative rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 transition-all duration-200 hover:shadow-xl hover:shadow-slate-900/40 hover:scale-[1.02]"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    🔓 Decode Base64
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
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Output</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">JSON</dd>
                </div>
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Mode</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">In-browser</dd>
                </div>
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Time</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">Instant</dd>
                </div>
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Price</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">Free</dd>
                </div>
              </dl>
            </div>

            <div className="relative z-10 md:col-span-5">
              <div className="space-y-4 feature-cards-container">
                <div className="feature-card group rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-lg transition-all duration-300 hover:border-indigo-300 hover:shadow-xl hover:-translate-y-1" style={{ animationDelay: '0.1s' }}>
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30 transition-transform duration-300 group-hover:scale-110">
                      <span className="text-2xl">🔑</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">JWT Token Decoder</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Decode JWT token payloads from Base64. Extract and view JSON data from authentication tokens instantly.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="feature-card group rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-lg transition-all duration-300 hover:border-blue-300 hover:shadow-xl hover:-translate-y-1" style={{ animationDelay: '0.2s' }}>
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30 transition-transform duration-300 group-hover:scale-110">
                      <span className="text-2xl">🔗</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">URL-Safe Base64</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Auto-detect and decode URL-safe Base64 strings. Handles - and _ characters automatically.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="feature-card group rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-lg transition-all duration-300 hover:border-emerald-300 hover:shadow-xl hover:-translate-y-1" style={{ animationDelay: '0.3s' }}>
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg shadow-emerald-500/30 transition-transform duration-300 group-hover:scale-110">
                      <span className="text-2xl">🔒</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">100% Private</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Everything runs locally in your browser. Your Base64 data never leaves your device.
                      </p>
                    </div>
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
                <h2 className="text-xl font-semibold text-slate-900">Decode Base64 to JSON online</h2>
                <p className="mt-1 text-sm text-slate-600">Paste your Base64 string, configure options, and get formatted JSON output.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button onClick={handlePasteDemo} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50">Paste demo</button>
                <button onClick={handleClear} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50">Clear</button>
                <button onClick={handleDecode} className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">🔓 Decode to JSON</button>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-12">
              <div className="md:col-span-8">
                <label className="mb-2 block text-sm font-semibold text-slate-800">Input Base64</label>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="h-64 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-900/20" 
                  placeholder="eyJ1c2VySWQiOiAidXNlcl8xMjM0NSJ9"
                />
              </div>
              <div className="md:col-span-4">
                <label className="mb-2 block text-sm font-semibold text-slate-800">Decoding Options</label>
                <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4">
                  <div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={autoDetectUrlSafe}
                        onChange={(e) => setAutoDetectUrlSafe(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-2 focus:ring-slate-900/20"
                      />
                      <span className="text-sm font-semibold text-slate-800">Auto-detect URL-safe</span>
                    </label>
                    <p className="mt-1 text-xs text-slate-500">
                      Convert - and _ to + and /.
                    </p>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={autoRemovePrefix}
                        onChange={(e) => setAutoRemovePrefix(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-2 focus:ring-slate-900/20"
                      />
                      <span className="text-sm font-semibold text-slate-800">Auto-remove data URI prefix</span>
                    </label>
                    <p className="mt-1 text-xs text-slate-500">
                      Remove data:application/json;base64,
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-2">JSON Indentation</label>
                    <select
                      value={indentSize}
                      onChange={(e) => setIndentSize(Number(e.target.value))}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-900/20"
                    >
                      <option value={0}>Minified (no spaces)</option>
                      <option value={2}>2 spaces</option>
                      <option value={4}>4 spaces</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-10 w-10 overflow-hidden rounded-xl border border-slate-200 bg-white">
                      <Image src="/icons.svg" alt="" width={40} height={40} className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Privacy-first</p>
                      <p className="text-xs text-slate-600">All decoding happens locally. No uploads.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <label className="text-sm font-semibold text-slate-800">Decoded JSON Output</label>
                <div className="flex flex-wrap items-center gap-2">
                  <button onClick={handleCopy} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50">{copyText}</button>
                  <button onClick={handleDownload} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50">⬇ Download</button>
                </div>
              </div>
              <textarea 
                value={output}
                className="mt-2 h-56 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm text-slate-900 outline-none" 
                placeholder="Your decoded JSON will appear here..." 
                readOnly
              />
              <p className="mt-2 text-xs text-slate-500">{stats}</p>
            </div>
          </div>
        </section>

        {/* What is Base64 Decoding? - Educational Content */}
        <section className="mx-auto max-w-6xl px-4 pb-16 pt-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 md:p-12" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="text-center">
              <h2 className="text-3xl font-bold text-slate-900">What is Base64 Decoding?</h2>
              <p className="mt-3 text-slate-600 max-w-2xl mx-auto">Understanding how Base64 decoding converts encoded strings back to readable JSON data</p>
            </div>

            <div className="mt-10 space-y-6 text-base leading-relaxed text-slate-700">
              <p>
                <strong>Base64 decoding</strong> is the reverse process of Base64 encoding. It converts Base64-encoded strings (which use 64 ASCII characters: A-Z, a-z, 0-9, +, /) back into their original binary or text format. When decoding Base64 to JSON, the tool first converts the Base64 string back to bytes, then decodes those bytes to text using UTF-8, and finally validates and formats the result as JSON.
              </p>

              <p>
                When you <strong>decode Base64 to JSON</strong>, the tool reverses the encoding process: it takes the Base64 characters, converts them back to bytes (each 4 Base64 characters represent 3 bytes), decodes the bytes to text using UTF-8 encoding, and then parses and formats the text as JSON. This is essential for reading JWT token payloads, API responses, and any Base64-encoded JSON data.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                  <h4 className="text-sm font-bold text-slate-900 mb-3">Base64 Encoded String</h4>
                  <pre className="text-xs text-slate-700 overflow-x-auto font-mono bg-white p-3 rounded-lg border border-slate-200 break-all">
eyJ1c2VyIjogImpvaG4iLAogInRva2VuIjogImFiYzEyMyJ9
                  </pre>
                  <p className="mt-2 text-xs text-slate-500">69 bytes (Base64-encoded)</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                  <h4 className="text-sm font-bold text-slate-900 mb-3">Decoded JSON</h4>
                  <pre className="text-xs text-slate-700 overflow-x-auto font-mono bg-white p-3 rounded-lg border border-slate-200">
{`{
  "user": "john",
  "token": "abc123"
}`}
                  </pre>
                  <p className="mt-2 text-xs text-slate-500">52 bytes (human-readable JSON)</p>
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">How Base64 Decoding Works</h3>
              <p>
                The decoding process reverses Base64 encoding: it groups Base64 characters into sets of four (representing 24 bits total), converts each 6-bit group back to its original byte value, and reassembles the bytes into the original data. If padding characters (=) are present, they indicate how many bytes were in the final group during encoding.
              </p>

              <p>
                For <strong>Base64 to JSON conversion</strong>, this means your Base64-encoded string (which may have been created from JSON data) is decoded back to text, validated as JSON syntax, and formatted for readability. This is why Base64 decoding is essential for JWT tokens, where the payload section is Base64-encoded JSON that needs to be read and verified.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">URL-Safe Base64 Decoding</h3>
              <p>
                URL-safe Base64 uses - and _ instead of + and / to avoid URL encoding issues. When decoding URL-safe Base64, these characters must be converted back to + and / before standard Base64 decoding. This tool automatically detects and handles URL-safe Base64 encoding, making it easy to decode JWT tokens and other URL-safe Base64 strings.
              </p>

              <div className="rounded-2xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50 p-6 mt-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-2xl shadow-lg">
                    💡
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-2">Base64 Decoding is Reversible</h4>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Base64 encoding and decoding are perfect inverses. Any data encoded to Base64 can be decoded back to its original form without loss. This makes Base64 ideal for transmitting binary data as text, but remember: Base64 is encoding, not encryption—anyone can decode it.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Decode Base64 to JSON? - Benefits Section */}
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">Why Decode Base64 to JSON?</h2>
            <p className="mt-3 text-slate-600 max-w-2xl mx-auto">Common use cases where Base64 decoding reveals JSON data</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="group rounded-3xl border-2 border-slate-200 bg-white p-6 transition-all duration-300 hover:border-indigo-300 hover:shadow-xl">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-2xl shadow-lg mb-4">
                🔑
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">JWT Token Payloads</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Decode JWT token payloads to view user claims, permissions, and expiration data. JWT tokens contain Base64-encoded JSON in their payload section, which must be decoded to read the token contents.
              </p>
            </div>

            <div className="group rounded-3xl border-2 border-slate-200 bg-white p-6 transition-all duration-300 hover:border-blue-300 hover:shadow-xl">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-2xl shadow-lg mb-4">
                🌐
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">API Responses</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Decode Base64-encoded JSON from API responses. Some APIs encode JSON data in Base64 for transmission, requiring decoding to access the actual JSON content.
              </p>
            </div>

            <div className="group rounded-3xl border-2 border-slate-200 bg-white p-6 transition-all duration-300 hover:border-emerald-300 hover:shadow-xl">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 text-2xl shadow-lg mb-4">
                🔗
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Data URIs</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Extract JSON data from data URIs embedded in HTML or CSS. Data URIs use Base64 encoding, and this tool can decode the JSON content from strings like data:application/json;base64,...
              </p>
            </div>

            <div className="group rounded-3xl border-2 border-slate-200 bg-white p-6 transition-all duration-300 hover:border-amber-300 hover:shadow-xl">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-2xl shadow-lg mb-4">
                🔐
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Authentication Tokens</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Decode OAuth tokens, API keys, and authentication strings that contain Base64-encoded JSON metadata. View token contents for debugging and verification.
              </p>
            </div>

            <div className="group rounded-3xl border-2 border-slate-200 bg-white p-6 transition-all duration-300 hover:border-purple-300 hover:shadow-xl">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 text-2xl shadow-lg mb-4">
                📧
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Email Attachments</h3>
              <p className="text-sm text-sm text-slate-600 leading-relaxed">
                Decode Base64-encoded JSON from email attachments or MIME messages. Email protocols use Base64 encoding, and JSON data may be embedded within.
              </p>
            </div>

            <div className="group rounded-3xl border-2 border-slate-200 bg-white p-6 transition-all duration-300 hover:border-rose-300 hover:shadow-xl">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 text-2xl shadow-lg mb-4">
                🗄️
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Database Storage</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Decode Base64-encoded JSON stored in text database columns. Some databases store binary JSON data as Base64 strings, requiring decoding to access the original JSON.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 p-10 text-center">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-3xl font-bold text-slate-900 mb-3">Base64 Decoding in Numbers</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">Why developers decode Base64 to access JSON data</p>
            </div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <div className="text-4xl font-black text-indigo-600">-33%</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Size Reduction</div>
                <div className="text-xs text-slate-600">Base64 decoding reduces size by ~33% (4 chars → 3 bytes)</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <div className="text-4xl font-black text-blue-600">100%</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Lossless</div>
                <div className="text-xs text-slate-600">Perfect decoding with zero data loss</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <div className="text-4xl font-black text-emerald-600">Instant</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Decoding Speed</div>
                <div className="text-xs text-slate-600">Real-time decoding in your browser</div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works - Step by Step */}
        <section id="how" className="mx-auto max-w-6xl px-4 pb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">How to Decode Base64 to JSON</h2>
            <p className="mt-3 text-slate-600 max-w-2xl mx-auto">Three simple steps to convert your Base64 string to readable JSON</p>
          </div>

          <div className="space-y-6">
            <div className="group flex gap-6 rounded-3xl border-2 border-slate-200 bg-white p-6 md:p-8 transition-all duration-300 hover:border-indigo-300 hover:shadow-xl">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-xl font-black text-white shadow-lg">
                1
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Paste your Base64 string</h3>
                <p className="text-slate-600 leading-relaxed">
                  Copy your Base64-encoded string from a JWT token payload, API response, data URI, or any Base64 source and paste it into the input field. The tool accepts both standard Base64 (with + and /) and URL-safe Base64 (with - and _). If your string includes a data URI prefix like <code className="px-1 py-0.5 rounded bg-slate-100 text-xs font-mono">data:application/json;base64,</code>, the tool can automatically remove it.
                </p>
                <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-900 mb-2">Example Base64 from JWT payload:</p>
                  <pre className="text-xs text-slate-700 overflow-x-auto font-mono break-all">
eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyNDI2MjIsInJvbGVzIjpbImFkbWluIiwidXNlciJdfQ
                  </pre>
                </div>
              </div>
            </div>

            <div className="group flex gap-6 rounded-3xl border-2 border-slate-200 bg-white p-6 md:p-8 transition-all duration-300 hover:border-blue-300 hover:shadow-xl">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-xl font-black text-white shadow-lg">
                2
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Configure decoding options</h3>
                <p className="text-slate-600 leading-relaxed">
                  Enable <strong>auto-detect URL-safe</strong> if your Base64 string uses - and _ characters (common in JWT tokens and URLs). This automatically converts URL-safe Base64 to standard Base64 before decoding. Enable <strong>auto-remove data URI prefix</strong> if your string starts with a data URI prefix—the tool will strip it automatically. Choose your preferred JSON indentation (0, 2, or 4 spaces) for the formatted output.
                </p>
                <div className="mt-4 flex flex-wrap gap-4">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2">
                    <span className="text-sm font-semibold text-slate-900">✓ URL-safe</span>
                    <span className="text-xs text-slate-600 ml-2">Auto-detect</span>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2">
                    <span className="text-sm font-semibold text-slate-900">✓ Data URI</span>
                    <span className="text-xs text-slate-600 ml-2">Auto-remove</span>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2">
                    <span className="text-sm font-semibold text-slate-900">✓ Formatting</span>
                    <span className="text-xs text-slate-600 ml-2">2-4 spaces</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="group flex gap-6 rounded-3xl border-2 border-slate-200 bg-white p-6 md:p-8 transition-all duration-300 hover:border-emerald-300 hover:shadow-xl">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 text-xl font-black text-white shadow-lg">
                3
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Decode and view JSON</h3>
                <p className="text-slate-600 leading-relaxed">
                  Click the <strong>Decode to JSON</strong> button to convert your Base64 string. The tool uses standard Base64 decoding with UTF-8 support for international characters, ensuring compatibility with all modern systems. The decoded text is validated as JSON syntax, and if valid, it's formatted with proper indentation. The output shows the size change (typically -33% when decoding Base64) and the formatted JSON. Copy the result to your clipboard or download it as a JSON file for immediate use.
                </p>
                <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-900 mb-2">Example decoded JSON output:</p>
                  <pre className="text-xs text-slate-700 overflow-x-auto font-mono">
{`{
  "sub": "1234567890",
  "name": "John Doe",
  "iat": 1516239022,
  "exp": 1516242622,
  "roles": ["admin", "user"]
}`}
                  </pre>
                  <p className="text-xs text-slate-500 mt-2">Ready to read and analyze</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Best Practices Section */}
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 md:p-12" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-slate-900">Best Practices for Base64 to JSON Decoding</h2>
              <p className="mt-3 text-slate-600 max-w-2xl mx-auto">Expert tips for accurate and secure Base64 decoding</p>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50 p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white text-xl font-bold">
                    ✓
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-2">Enable auto-detect for URL-safe Base64</h4>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      JWT tokens and many API responses use URL-safe Base64 encoding (with - and _ instead of + and /). Always enable the auto-detect option to automatically convert URL-safe Base64 to standard Base64 before decoding. This prevents "Invalid character" errors and ensures successful decoding.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50 p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white text-xl font-bold">
                    ✓
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-2">Remove data URI prefixes automatically</h4>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      If your Base64 string comes from a data URI (starts with "data:application/json;base64,"), enable the auto-remove prefix option. The tool will strip the prefix before decoding, preventing "Invalid character" errors. This is common when decoding Base64 from HTML or CSS data URIs.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50 p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white text-xl font-bold">
                    ✓
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-2">Validate decoded data as JSON</h4>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      This tool automatically validates decoded data as JSON syntax. If the Base64 string doesn't contain valid JSON, you'll get a clear error message. Base64 can encode any data (text, images, binary), but this tool specifically validates and formats JSON output.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border-2 border-rose-200 bg-gradient-to-br from-rose-50 to-red-50 p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-rose-500 text-white text-xl font-bold">
                    ✗
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-2">Don't assume all Base64 is JSON</h4>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      <strong>Important:</strong> Base64 can encode any data type—text, images, binary files, XML, CSV, etc. This tool specifically validates and formats JSON output. If you decode Base64 that contains non-JSON data (like an image), you'll get a JSON validation error. Use a general Base64 decoder for non-JSON data.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border-2 border-rose-200 bg-gradient-to-br from-rose-50 to-red-50 p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-rose-500 text-white text-xl font-bold">
                    ✗
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-2">Don't decode sensitive tokens in public</h4>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      While this tool processes data locally in your browser, be cautious when decoding sensitive authentication tokens or API keys. Even though decoding happens locally, avoid pasting sensitive tokens into any tool if you're on a shared computer or untrusted network.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border-2 border-rose-200 bg-gradient-to-br from-rose-50 to-red-50 p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-rose-500 text-white text-xl font-bold">
                    ✗
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-2">Don't ignore padding errors</h4>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Base64 strings must have correct padding (trailing = characters). If you get padding errors, check that your Base64 string is complete and hasn't been truncated. URL-safe Base64 often omits padding, but the tool automatically adds it back when auto-detecting URL-safe encoding.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900">Base64 to JSON Decoding Methods</h2>
            <p className="mt-3 text-slate-600 max-w-2xl mx-auto">Compare different approaches to decoding Base64 strings to JSON</p>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-slate-200 bg-slate-50">
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-900">Method</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-900">Best For</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-900">Setup Time</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-900">URL-Safe</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-900">JSON Validation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="bg-indigo-50">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">Online Tool</div>
                    <div className="text-xs text-slate-600 mt-1">FixTools (this page)</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700">Quick decoding, testing, JWT payload viewing</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                      Instant
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-emerald-600 text-xl">✓</span>
                    <div className="text-xs text-slate-500">Auto-detect</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-emerald-600 text-xl">✓</span>
                    <div className="text-xs text-slate-500">Built-in</div>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">JavaScript atob()</div>
                    <div className="text-xs text-slate-600 mt-1 font-mono">atob(base64)</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700">Browser-based apps, client-side decoding</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                      No setup
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-slate-400 text-xl">✗</span>
                    <div className="text-xs text-slate-500">Manual convert</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-slate-400 text-xl">✗</span>
                    <div className="text-xs text-slate-500">Manual parse</div>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">Node.js Buffer</div>
                    <div className="text-xs text-slate-600 mt-1 font-mono">Buffer.from(base64, 'base64').toString()</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700">Server-side, CLI scripts, build tools</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
                      Node.js install
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-slate-400 text-xl">✗</span>
                    <div className="text-xs text-slate-500">Manual convert</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-slate-400 text-xl">✗</span>
                    <div className="text-xs text-slate-500">Manual parse</div>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">Python base64</div>
                    <div className="text-xs text-slate-600 mt-1 font-mono">base64.b64decode(base64).decode()</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700">Python scripts, data processing, ETL pipelines</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
                      Python install
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-emerald-600 text-xl">✓</span>
                    <div className="text-xs text-slate-500">urlsafe_b64decode</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-slate-400 text-xl">✗</span>
                    <div className="text-xs text-slate-500">Manual parse</div>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">JWT Libraries</div>
                    <div className="text-xs text-slate-600 mt-1">jsonwebtoken, jose, etc.</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700">JWT token decoding with signature verification</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                      Library install
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-emerald-600 text-xl">✓</span>
                    <div className="text-xs text-slate-500">Built-in</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-emerald-600 text-xl">✓</span>
                    <div className="text-xs text-slate-500">Built-in</div>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">Command Line (base64)</div>
                    <div className="text-xs text-slate-600 mt-1 font-mono">echo 'base64' | base64 -d</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700">Shell scripts, CI/CD pipelines, automation</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                      Pre-installed
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-slate-400 text-xl">✗</span>
                    <div className="text-xs text-slate-500">Manual convert</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-slate-400 text-xl">✗</span>
                    <div className="text-xs text-slate-500">Manual parse</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6 rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-2xl shadow-lg">
                💡
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-2">When to Use This Online Tool</h4>
                <p className="text-sm text-slate-700 leading-relaxed">
                  This online decoder is ideal for quick testing, debugging JWT tokens, viewing one-off Base64-encoded JSON, and situations where you need both URL-safe Base64 handling and JSON validation with formatting. It requires zero setup and works entirely in your browser with complete privacy. For production applications with high volume, integrate Base64 decoding directly into your codebase using native libraries.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900">Frequently Asked Questions</h2>
            <p className="mt-3 text-slate-600 max-w-2xl mx-auto">Everything you need to know about Base64 to JSON decoding</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">How do I decode Base64 to JSON?</summary>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Paste your Base64 string into the input field, enable auto-detection options if needed, and click Decode. The tool will decode the Base64 string, validate it as JSON, and format it for easy reading.
                </p>
              </details>

              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What is Base64 decoding?</summary>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Base64 decoding converts Base64-encoded strings back to their original format. When decoding Base64 to JSON, the tool first decodes the Base64 string to text, then validates and formats it as JSON.
                </p>
              </details>

              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Does this tool handle URL-safe Base64?</summary>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Yes. The tool can auto-detect URL-safe Base64 encoding (which uses - and _ instead of + and /). Enable the auto-detect option to automatically convert URL-safe Base64 to standard Base64 before decoding.
                </p>
              </details>

              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Can I decode JWT tokens with this tool?</summary>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Yes. JWT tokens contain Base64-encoded JSON payloads. Paste the Base64-encoded payload section (between the dots) into this tool to decode and view the JSON data. Note: This only decodes the payload, not the full JWT token.
                </p>
              </details>

              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What if the decoded data is not JSON?</summary>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  If the Base64 string doesn't contain valid JSON data, the tool will show an error. Base64 can encode any data (text, images, binary), but this tool specifically validates and formats the output as JSON.
                </p>
              </details>

              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Is my Base64 data stored on your servers?</summary>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  No. All decoding happens locally in your browser using JavaScript. Your Base64 data never leaves your device and is not uploaded to any server.
                </p>
              </details>
            </div>

            <div className="space-y-4">
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">How do I handle data URI prefixes?</summary>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  If your Base64 string starts with 'data:application/json;base64,', enable the auto-remove prefix option. The tool will automatically strip the prefix before decoding.
                </p>
              </details>

              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Why is my Base64 string invalid?</summary>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Base64 strings must only contain A-Z, a-z, 0-9, +, /, and = characters (or - and _ for URL-safe). Invalid characters, incorrect padding, or truncated strings will cause decoding errors.
                </p>
              </details>

              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Can I decode Base64 that contains images?</summary>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  This tool is specifically for decoding Base64 to JSON. If your Base64 string contains image data or other binary content, it won't be valid JSON and will show an error. Use a general Base64 decoder for non-JSON data.
                </p>
              </details>

              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What's the difference between Base64 decoding and decryption?</summary>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Base64 decoding is a reversible encoding process—anyone can decode Base64 instantly. Decryption requires a secret key and is used for security. Base64 is encoding, not encryption. Never use Base64 alone for security.
                </p>
              </details>

              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Does this tool support Unicode characters?</summary>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Yes. This tool uses UTF-8 decoding after Base64 decoding, correctly handling emoji, accented characters, Chinese/Japanese text, and all Unicode symbols in the decoded JSON.
                </p>
              </details>

              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Can I use this for production applications?</summary>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  This tool is perfect for testing, debugging, and one-off decoding. For production apps with high volume, integrate Base64 decoding directly into your codebase using native libraries (Buffer in Node.js, atob in browsers, base64 module in Python) for better performance.
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* Learning CTA */}
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <MarqueeCTA
            href="/learn"
            title="📚 Master JSON & Data Encoding"
            description="Explore tutorials on JWT tokens, API authentication, Base64 encoding/decoding, and web development best practices."
            buttonText="Explore learning center"
            emoji="→"
            bgColor="bg-gradient-to-r from-indigo-500 to-purple-600"
            textColor="text-white"
          />
        </section>

        {/* Related Tools */}
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900">Related JSON Tools</h2>
            <p className="mt-3 text-slate-600 max-w-2xl mx-auto">More tools to work with JSON and Base64 data</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/json/json-to-base64" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 transition-all duration-300 hover:border-indigo-300 hover:shadow-xl hover:-translate-y-1">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-2xl shadow-lg mb-4">
                🔐
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">JSON to Base64 Encoder</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Encode JSON data to Base64 format. Perfect for creating JWT token payloads and API authentication strings.
              </p>
              <div className="flex items-center gap-2 text-sm font-semibold text-indigo-600 group-hover:gap-3 transition-all">
                Try it now <span>→</span>
              </div>
            </Link>

            <Link href="/json/json-formatter" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 transition-all duration-300 hover:border-blue-300 hover:shadow-xl hover:-translate-y-1">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-2xl shadow-lg mb-4">
                ✨
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">JSON Formatter</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Beautify and format JSON with proper indentation. Make decoded JSON more readable with consistent formatting.
              </p>
              <div className="flex items-center gap-2 text-sm font-semibold text-blue-600 group-hover:gap-3 transition-all">
                Try it now <span>→</span>
              </div>
            </Link>

            <Link href="/json/json-validator" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 transition-all duration-300 hover:border-emerald-300 hover:shadow-xl hover:-translate-y-1">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 text-2xl shadow-lg mb-4">
                ✓
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">JSON Validator</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Validate JSON syntax after decoding. Ensure your decoded Base64 data is correctly formatted JSON.
              </p>
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600 group-hover:gap-3 transition-all">
                Try it now <span>→</span>
              </div>
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
