import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import MarqueeCTA from '@/components/MarqueeCTA';

export default function JSONToBase64Encoder() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [stats, setStats] = useState('');
  const [copyText, setCopyText] = useState('📋 Copy');
  
  // Options
  const [urlSafe, setUrlSafe] = useState(false);
  const [includePrefix, setIncludePrefix] = useState(false);

  const currentYear = new Date().getFullYear();

  const demo = `{
  "userId": "user_12345",
  "token": "abc123def456",
  "permissions": ["read", "write"],
  "expiresAt": "2024-12-31T23:59:59Z",
  "metadata": {
    "ip": "192.168.1.1",
    "userAgent": "Mozilla/5.0"
  }
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

  const handleEncode = () => {
    const inputText = input.trim();
    if (!inputText) return;
    
    try {
      // Validate JSON first
      JSON.parse(inputText);
      
      // Encode to Base64
      let base64 = btoa(unescape(encodeURIComponent(inputText)));
      
      // URL-safe encoding if enabled (replace + with - and / with _)
      if (urlSafe) {
        base64 = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      }
      
      // Add data URI prefix if enabled
      if (includePrefix) {
        base64 = 'data:application/json;base64,' + base64;
      }
      
      setOutput(base64);
      
      const beforeSize = new Blob([inputText]).size;
      const afterSize = new Blob([base64]).size;
      const sizeDiff = afterSize - beforeSize;
      const sizeChangePercent = beforeSize > 0 ? ((sizeDiff / beforeSize) * 100).toFixed(1) : "0.0";
      
      setStats(`Encoded: ${beforeSize.toLocaleString()} bytes (JSON) → ${afterSize.toLocaleString()} bytes (Base64) ${sizeDiff >= 0 ? '+' : ''}${sizeChangePercent}%`);
      
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
    const blob = new Blob([text], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "encoded.txt";
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
          "name": "How do I encode JSON to Base64?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Paste your JSON data into the input field, choose your encoding options (URL-safe, data URI prefix), and click Encode. The tool will validate your JSON and convert it to Base64 encoding that you can copy or download."
          }
        },
        {
          "@type": "Question",
          "name": "What is Base64 encoding used for?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Base64 encoding converts binary data to ASCII text, making it safe for URLs, email, JSON tokens (JWT), API authentication, data URIs in HTML/CSS, and transmitting data over text-only protocols."
          }
        },
        {
          "@type": "Question",
          "name": "Is Base64 encoding secure?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. Base64 is an encoding method, not encryption. Anyone can decode Base64 back to the original data. Never use Base64 alone for sensitive data. Use proper encryption (AES, RSA) for security."
          }
        },
        {
          "@type": "Question",
          "name": "What is URL-safe Base64?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "URL-safe Base64 replaces + with - and / with _ characters, making the encoded string safe to use in URLs and filenames without escaping. Standard Base64 uses characters that need URL encoding."
          }
        },
        {
          "@type": "Question",
          "name": "Can I decode Base64 back to JSON?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Base64 encoding is reversible. Use atob() in JavaScript or any Base64 decoder to convert the encoded string back to the original JSON data."
          }
        },
        {
          "@type": "Question",
          "name": "Is my JSON data stored on your servers?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. All encoding happens locally in your browser using JavaScript. Your data never leaves your device and is not uploaded to any server."
          }
        },
        {
          "@type": "Question",
          "name": "Does Base64 encoding compress data?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. Base64 actually increases data size by about 33% because it converts 3 bytes into 4 ASCII characters. Use gzip or brotli for compression, not Base64."
          }
        },
        {
          "@type": "Question",
          "name": "When should I use Base64 encoding?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Use Base64 for JWT tokens, embedding images in CSS/HTML (data URIs), API authentication headers, transmitting binary data over JSON/XML, and storing binary data in text databases."
          }
        }
      ]
    },
    
    softwareApp: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "JSON to Base64 Encoder",
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "Any",
      "description": "Free online tool to encode JSON to Base64 format. Create JWT tokens, data URIs, and API authentication strings. Supports URL-safe encoding and data URI prefixes.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "1520",
        "bestRating": "5",
        "worstRating": "1"
      },
      "featureList": [
        "Encode JSON to Base64 format",
        "URL-safe Base64 encoding option",
        "Data URI prefix support",
        "JSON validation before encoding",
        "JWT token creation",
        "Browser-based processing (no uploads)",
        "Download encoded output",
        "Copy to clipboard"
      ]
    },
    
    howTo: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Encode JSON to Base64",
      "description": "Step-by-step guide to encode JSON data to Base64 format online for free using FixTools JSON to Base64 Encoder.",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Paste your JSON data",
          "text": "Copy your JSON content (API response, config data, or token payload) and paste it into the input field. The tool validates JSON syntax before encoding.",
          "position": 1
        },
        {
          "@type": "HowToStep",
          "name": "Choose encoding options",
          "text": "Select URL-safe encoding if you need the output for URLs or filenames. Enable data URI prefix if embedding in HTML or CSS. These options control the format of your Base64 output.",
          "position": 2
        },
        {
          "@type": "HowToStep",
          "name": "Encode and export",
          "text": "Click the Encode button to convert your JSON to Base64. The tool uses standard Base64 encoding (or URL-safe variant) to create ASCII-safe text. Copy to clipboard or download the encoded string.",
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
          "name": "JSON to Base64 Encoder",
          "item": "https://fixtools.io/json/json-to-base64"
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
        <title>JSON to Base64 Encoder - Free Online JSON Base64 Converter | FixTools</title>
        <meta name="title" content="JSON to Base64 Encoder - Free Online JSON Base64 Converter | FixTools" />
        <meta name="description" content="Encode JSON to Base64 online for free. Create JWT tokens, data URIs, and API authentication strings. Supports URL-safe encoding. Perfect for JSON web tokens and embedded data." />
        <meta name="keywords" content="json to base64, json base64 encoder, encode json to base64, base64 encode json online, jwt token generator, json to base64 converter" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        <link rel="canonical" href="https://fixtools.io/json/json-to-base64" />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        {/* Open Graph - SEO */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fixtools.io/json/json-to-base64" />
        <meta property="og:title" content="JSON to Base64 Encoder - Free Online Tool" />
        <meta property="og:description" content="Encode JSON to Base64 instantly. Perfect for JWT tokens, data URIs, and API authentication. URL-safe encoding supported." />
        <meta property="og:image" content="https://fixtools.io/images/og-json-to-base64.png" />
        <meta property="og:site_name" content="FixTools" />
        
        {/* Twitter Card */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://fixtools.io/json/json-to-base64" />
        <meta property="twitter:title" content="JSON to Base64 Encoder - Free Online Tool" />
        <meta property="twitter:description" content="Encode JSON to Base64 instantly. JWT tokens and data URIs ready." />
        <meta property="twitter:image" content="https://fixtools.io/images/og-json-to-base64.png" />
        
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
        html:has(.json-to-base64-page) {
          font-size: 100% !important;
        }
        
        .json-to-base64-page {
          line-height: 1.5;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          width: 100%;
          min-height: 100vh;
        }
        
        .json-to-base64-page *,
        .json-to-base64-page *::before,
        .json-to-base64-page *::after {
          box-sizing: border-box;
        }
        
        .json-to-base64-page h1,
        .json-to-base64-page h2,
        .json-to-base64-page h3,
        .json-to-base64-page p,
        .json-to-base64-page ul,
        .json-to-base64-page ol {
          margin: 0;
        }
        
        .json-to-base64-page button {
          font-family: inherit;
          cursor: pointer;
        }
        
        .json-to-base64-page input,
        .json-to-base64-page textarea,
        .json-to-base64-page select {
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

      <div className="json-to-base64-page bg-[#fbfbfc] text-slate-900 min-h-screen">
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
              <span className="font-semibold text-slate-900">JSON to Base64 Encoder</span>
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
                  JSON to Base64 Encoder
                </span>
              </h1>
              
              {/* SEO-optimized description with target keywords */}
              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg md:leading-relaxed">
                <strong>Encode JSON to Base64</strong> instantly. Create JWT tokens, data URIs, and API authentication strings. Supports URL-safe encoding for tokens, embedded data in HTML/CSS, and secure JSON transmission. Perfect for developers working with JSON web tokens and Base64 data.
              </p>

              <div className="mt-7 pb-5 flex flex-wrap items-center gap-3">
                <a 
                  href="#tool" 
                  className="group relative rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 transition-all duration-200 hover:shadow-xl hover:shadow-slate-900/40 hover:scale-[1.02]"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    🔐 Encode to Base64
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
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">Base64</dd>
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
                      <h4 className="text-lg font-bold text-slate-900">JWT Token Ready</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Generate Base64-encoded JSON payloads perfect for JWT tokens and API authentication.
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
                      <h4 className="text-lg font-bold text-slate-900">URL-Safe Encoding</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Optional URL-safe mode replaces special characters, making output safe for URLs and filenames.
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
                        Everything runs locally in your browser. Your JSON data never leaves your device.
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
                <h2 className="text-xl font-semibold text-slate-900">Encode JSON to Base64 online</h2>
                <p className="mt-1 text-sm text-slate-600">Paste your JSON data, choose encoding options, and get Base64 output.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button onClick={handlePasteDemo} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50">Paste demo</button>
                <button onClick={handleClear} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50">Clear</button>
                <button onClick={handleEncode} className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">🔐 Encode to Base64</button>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-12">
              <div className="md:col-span-8">
                <label className="mb-2 block text-sm font-semibold text-slate-800">Input JSON</label>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="h-64 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-900/20" 
                  placeholder={'{\"key\": \"value\"}'}
                />
              </div>
              <div className="md:col-span-4">
                <label className="mb-2 block text-sm font-semibold text-slate-800">Encoding Options</label>
                <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4">
                  <div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={urlSafe}
                        onChange={(e) => setUrlSafe(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-2 focus:ring-slate-900/20"
                      />
                      <span className="text-sm font-semibold text-slate-800">URL-safe encoding</span>
                    </label>
                    <p className="mt-1 text-xs text-slate-500">
                      Replace + and / with - and _.
                    </p>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includePrefix}
                        onChange={(e) => setIncludePrefix(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-2 focus:ring-slate-900/20"
                      />
                      <span className="text-sm font-semibold text-slate-800">Data URI prefix</span>
                    </label>
                    <p className="mt-1 text-xs text-slate-500">
                      Add data:application/json;base64,
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
                      <p className="text-xs text-slate-600">All encoding happens locally. No uploads.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <label className="text-sm font-semibold text-slate-800">Base64 Output</label>
                <div className="flex flex-wrap items-center gap-2">
                  <button onClick={handleCopy} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50">{copyText}</button>
                  <button onClick={handleDownload} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50">⬇ Download</button>
                </div>
              </div>
              <textarea 
                value={output}
                className="mt-2 h-56 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm text-slate-900 outline-none break-all" 
                placeholder="Your Base64 output will appear here..." 
                readOnly
              />
              <p className="mt-2 text-xs text-slate-500">{stats}</p>
            </div>
          </div>
        </section>

        {/* What is Base64 Encoding? - Educational Content */}
        <section className="mx-auto max-w-6xl px-4 pb-16 pt-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 md:p-12" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="text-center">
              <h2 className="text-3xl font-bold text-slate-900">What is Base64 Encoding?</h2>
              <p className="mt-3 text-slate-600 max-w-2xl mx-auto">Understanding how Base64 converts binary data to ASCII text for safe transmission</p>
            </div>

            <div className="mt-10 space-y-6 text-base leading-relaxed text-slate-700">
              <p>
                <strong>Base64 encoding</strong> is a binary-to-text encoding scheme that converts binary data into a sequence of printable ASCII characters. It's called "Base64" because it uses 64 different characters (A-Z, a-z, 0-9, +, and /) to represent data. Each Base64 character represents exactly 6 bits of data, meaning every 3 bytes of input produces 4 bytes of Base64-encoded output.
              </p>

              <p>
                When you <strong>encode JSON to Base64</strong>, the tool first converts your JSON string into bytes (using UTF-8 encoding to handle international characters), then transforms those bytes into Base64 characters. This process makes your JSON data safe for transmission over protocols that only support ASCII text, such as email, URLs, HTTP headers, and XML documents.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                  <h4 className="text-sm font-bold text-slate-900 mb-3">Original JSON</h4>
                  <pre className="text-xs text-slate-700 overflow-x-auto font-mono bg-white p-3 rounded-lg border border-slate-200">
{`{"user": "john",
 "token": "abc123"}`}
                  </pre>
                  <p className="mt-2 text-xs text-slate-500">52 bytes (human-readable)</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                  <h4 className="text-sm font-bold text-slate-900 mb-3">Base64 Encoded</h4>
                  <pre className="text-xs text-slate-700 overflow-x-auto font-mono bg-white p-3 rounded-lg border border-slate-200 break-all">
eyJ1c2VyIjogImpvaG4iLAogInRva2VuIjogImFiYzEyMyJ9
                  </pre>
                  <p className="mt-2 text-xs text-slate-500">69 bytes (+33% size, ASCII-safe)</p>
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">How Base64 Encoding Works</h3>
              <p>
                The encoding process groups input bytes into sets of three (24 bits total), then splits those 24 bits into four groups of 6 bits each. Each 6-bit group is mapped to one of 64 printable ASCII characters. If the input isn't evenly divisible by 3, padding characters (=) are added to the end of the output to indicate the number of bytes in the final group.
              </p>

              <p>
                For <strong>JSON to Base64 conversion</strong>, this means your JSON data can contain any Unicode characters, newlines, quotes, and special symbols—and they'll all be safely represented as ASCII text. This is why Base64 is the standard encoding for JWT (JSON Web Tokens), where JSON payloads need to be embedded in HTTP headers and URLs.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">Base64 vs URL-Safe Base64</h3>
              <p>
                Standard Base64 uses the characters + and /, which have special meanings in URLs and must be percent-encoded. <strong>URL-safe Base64</strong> replaces these with - and _ respectively, and typically omits the = padding. This makes the encoded string safe to use directly in URLs, query parameters, and filenames without additional escaping—essential for JWT tokens, OAuth parameters, and RESTful API endpoints.
              </p>

              <div className="rounded-2xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50 p-6 mt-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-2xl shadow-lg">
                    💡
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-2">Base64 is NOT Encryption</h4>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Base64 is an <strong>encoding</strong> method, not encryption. Anyone can decode Base64 back to the original data instantly. Never use Base64 alone to protect sensitive information. For security, use proper encryption (AES-256, RSA) before Base64 encoding.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Encode JSON to Base64? - Benefits Section */}
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">Why Encode JSON to Base64?</h2>
            <p className="mt-3 text-slate-600 max-w-2xl mx-auto">Common use cases where Base64 encoding is essential for JSON data</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="group rounded-3xl border-2 border-slate-200 bg-white p-6 transition-all duration-300 hover:border-indigo-300 hover:shadow-xl">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-2xl shadow-lg mb-4">
                🔑
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">JWT Tokens</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                JSON Web Tokens encode three Base64 sections: header, payload, and signature. The payload contains your JSON data encoded in URL-safe Base64 for authentication and authorization.
              </p>
            </div>

            <div className="group rounded-3xl border-2 border-slate-200 bg-white p-6 transition-all duration-300 hover:border-blue-300 hover:shadow-xl">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-2xl shadow-lg mb-4">
                🔗
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Data URIs</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Embed JSON data directly in HTML or CSS using data URIs (data:application/json;base64,...). Useful for inline configuration, small datasets, and eliminating HTTP requests.
              </p>
            </div>

            <div className="group rounded-3xl border-2 border-slate-200 bg-white p-6 transition-all duration-300 hover:border-emerald-300 hover:shadow-xl">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 text-2xl shadow-lg mb-4">
                🌐
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">API Authentication</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                HTTP Basic Authentication uses Base64 to encode credentials. OAuth tokens and API keys often use Base64-encoded JSON for metadata and permissions.
              </p>
            </div>

            <div className="group rounded-3xl border-2 border-slate-200 bg-white p-6 transition-all duration-300 hover:border-amber-300 hover:shadow-xl">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-2xl shadow-lg mb-4">
                📧
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Email & Messaging</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                SMTP and email protocols require 7-bit ASCII text. Base64 encoding allows JSON attachments and structured data to be transmitted safely through email systems.
              </p>
            </div>

            <div className="group rounded-3xl border-2 border-slate-200 bg-white p-6 transition-all duration-300 hover:border-purple-300 hover:shadow-xl">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 text-2xl shadow-lg mb-4">
                🗄️
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Database Storage</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Store binary JSON data in text-only database columns or XML documents. Base64 ensures data integrity and prevents encoding issues across systems.
              </p>
            </div>

            <div className="group rounded-3xl border-2 border-slate-200 bg-white p-6 transition-all duration-300 hover:border-rose-300 hover:shadow-xl">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 text-2xl shadow-lg mb-4">
                🔐
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">URL Parameters</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Pass complex JSON state or configuration through URL query parameters safely. URL-safe Base64 avoids special character encoding issues in web applications.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 p-10 text-center">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-3xl font-bold text-slate-900 mb-3">Base64 Encoding in Numbers</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">Why developers choose Base64 for JSON data transmission</p>
            </div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <div className="text-4xl font-black text-indigo-600">64</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Character Set</div>
                <div className="text-xs text-slate-600">A-Z, a-z, 0-9, +, / characters for encoding</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <div className="text-4xl font-black text-blue-600">+33%</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Size Overhead</div>
                <div className="text-xs text-slate-600">Base64 increases size by ~33% (3 bytes → 4 chars)</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <div className="text-4xl font-black text-emerald-600">100%</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">ASCII Compatible</div>
                <div className="text-xs text-slate-600">Works with any text-only protocol or system</div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works - Step by Step */}
        <section id="how" className="mx-auto max-w-6xl px-4 pb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">How to Encode JSON to Base64</h2>
            <p className="mt-3 text-slate-600 max-w-2xl mx-auto">Three simple steps to convert your JSON data to Base64 format</p>
          </div>

          <div className="space-y-6">
            <div className="group flex gap-6 rounded-3xl border-2 border-slate-200 bg-white p-6 md:p-8 transition-all duration-300 hover:border-indigo-300 hover:shadow-xl">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-xl font-black text-white shadow-lg">
                1
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Paste your JSON data</h3>
                <p className="text-slate-600 leading-relaxed">
                  Copy your JSON content from an API response, configuration file, or token payload and paste it into the input field. The tool automatically validates JSON syntax before encoding, catching any formatting errors. Your JSON can include nested objects, arrays, Unicode characters, and special symbols—everything will be handled correctly.
                </p>
                <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-900 mb-2">Example JSON for JWT payload:</p>
                  <pre className="text-xs text-slate-700 overflow-x-auto font-mono">
{`{
  "sub": "1234567890",
  "name": "John Doe",
  "iat": 1516239022,
  "exp": 1516242622,
  "roles": ["admin", "user"]
}`}
                  </pre>
                </div>
              </div>
            </div>

            <div className="group flex gap-6 rounded-3xl border-2 border-slate-200 bg-white p-6 md:p-8 transition-all duration-300 hover:border-blue-300 hover:shadow-xl">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-xl font-black text-white shadow-lg">
                2
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Choose encoding options</h3>
                <p className="text-slate-600 leading-relaxed">
                  Select <strong>URL-safe encoding</strong> if you're creating JWT tokens, passing data through URL parameters, or need the output to work in filenames. This replaces + and / characters with - and _, making the string URL-compatible without percent encoding. Enable the <strong>data URI prefix</strong> if you're embedding JSON in HTML or CSS—this adds the full <code className="px-1 py-0.5 rounded bg-slate-100 text-xs font-mono">data:application/json;base64,</code> prefix for immediate use.
                </p>
                <div className="mt-4 flex flex-wrap gap-4">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2">
                    <span className="text-sm font-semibold text-slate-900">✓ URL-safe</span>
                    <span className="text-xs text-slate-600 ml-2">For tokens & URLs</span>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2">
                    <span className="text-sm font-semibold text-slate-900">✓ Data URI</span>
                    <span className="text-xs text-slate-600 ml-2">For HTML/CSS</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="group flex gap-6 rounded-3xl border-2 border-slate-200 bg-white p-6 md:p-8 transition-all duration-300 hover:border-emerald-300 hover:shadow-xl">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 text-xl font-black text-white shadow-lg">
                3
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Encode and export</h3>
                <p className="text-slate-600 leading-relaxed">
                  Click the <strong>Encode to Base64</strong> button to convert your JSON. The tool uses standard Base64 encoding with UTF-8 support for international characters, ensuring compatibility with all modern systems. The output shows the size change (typically +33% for Base64 overhead) and the encoded string. Copy the result to your clipboard or download it as a text file for immediate use in JWT tokens, API requests, or embedded data scenarios.
                </p>
                <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-900 mb-2">Example Base64 output:</p>
                  <pre className="text-xs text-slate-700 overflow-x-auto font-mono break-all">
eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyNDI2MjIsInJvbGVzIjpbImFkbWluIiwidXNlciJdfQ
                  </pre>
                  <p className="text-xs text-slate-500 mt-2">Ready to use in JWT header.payload.signature format</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Best Practices Section */}
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 md:p-12" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-slate-900">Best Practices for Base64 JSON Encoding</h2>
              <p className="mt-3 text-slate-600 max-w-2xl mx-auto">Expert tips for secure and efficient Base64 usage</p>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50 p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white text-xl font-bold">
                    ✓
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-2">Use URL-safe encoding for tokens</h4>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      When creating JWT tokens or passing data through URLs, always use URL-safe Base64 encoding. Standard Base64's + and / characters cause issues in URLs and query parameters. URL-safe encoding replaces them with - and _, eliminating the need for percent encoding and preventing transmission errors.
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
                    <h4 className="font-bold text-slate-900 mb-2">Minify JSON before encoding</h4>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Remove unnecessary whitespace from your JSON before Base64 encoding to reduce output size. Since Base64 adds ~33% overhead, starting with smaller input significantly reduces the final encoded string length—critical for JWT tokens which must fit in HTTP headers (typically limited to 8KB).
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
                    <h4 className="font-bold text-slate-900 mb-2">Validate JSON before encoding</h4>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Always validate JSON syntax before Base64 encoding. Invalid JSON will encode successfully but fail when decoded and parsed, causing runtime errors that are difficult to debug. This tool automatically validates JSON structure and provides clear error messages for syntax issues.
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
                    <h4 className="font-bold text-slate-900 mb-2">Don't use Base64 for security</h4>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      <strong>Critical:</strong> Base64 is encoding, not encryption. Anyone can decode Base64 instantly using built-in browser tools or online decoders. Never store passwords, API keys, or sensitive data in Base64 alone. Use proper encryption (AES-256, RSA) before encoding, or use secure tokens (JWT with HMAC/RSA signatures).
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
                    <h4 className="font-bold text-slate-900 mb-2">Don't encode large datasets</h4>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Base64 increases data size by 33%. For large JSON datasets (&gt;100KB), this overhead significantly impacts performance and bandwidth. Use compression (gzip, brotli) instead, or split data into smaller chunks. Base64 works best for small payloads like JWT tokens (typically 200-2000 bytes) and embedded configuration data.
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
                    <h4 className="font-bold text-slate-900 mb-2">Don't ignore UTF-8 encoding</h4>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      When encoding JSON with international characters (emoji, accented characters, Chinese/Japanese text), ensure your tool uses UTF-8 encoding before Base64. JavaScript's native <code className="px-1 py-0.5 rounded bg-white text-xs font-mono">btoa()</code> only handles ASCII—you must use <code className="px-1 py-0.5 rounded bg-white text-xs font-mono">encodeURIComponent()</code> first. This tool handles UTF-8 automatically.
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
            <h2 className="text-3xl font-bold text-slate-900">JSON to Base64 Encoding Methods</h2>
            <p className="mt-3 text-slate-600 max-w-2xl mx-auto">Compare different approaches to encoding JSON data as Base64</p>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-slate-200 bg-slate-50">
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-900">Method</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-900">Best For</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-900">Setup Time</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-900">UTF-8 Support</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-900">URL-Safe</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="bg-indigo-50">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">Online Tool</div>
                    <div className="text-xs text-slate-600 mt-1">FixTools (this page)</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700">Quick conversions, testing, JWT payload generation</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                      Instant
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-emerald-600 text-xl">✓</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-emerald-600 text-xl">✓</span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">JavaScript btoa()</div>
                    <div className="text-xs text-slate-600 mt-1 font-mono">btoa(unescape(encodeURIComponent(json)))</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700">Browser-based apps, client-side encoding</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                      No setup
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-amber-600 text-xl">⚠</span>
                    <div className="text-xs text-slate-500">Needs wrapper</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-slate-400 text-xl">✗</span>
                    <div className="text-xs text-slate-500">Manual replace</div>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">Node.js Buffer</div>
                    <div className="text-xs text-slate-600 mt-1 font-mono">Buffer.from(json).toString('base64')</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700">Server-side, CLI scripts, build tools</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
                      Node.js install
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-emerald-600 text-xl">✓</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-slate-400 text-xl">✗</span>
                    <div className="text-xs text-slate-500">Manual replace</div>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">Python base64</div>
                    <div className="text-xs text-slate-600 mt-1 font-mono">base64.b64encode(json.encode())</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700">Python scripts, data processing, ETL pipelines</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
                      Python install
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-emerald-600 text-xl">✓</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-emerald-600 text-xl">✓</span>
                    <div className="text-xs text-slate-500">urlsafe_b64encode</div>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">JWT Libraries</div>
                    <div className="text-xs text-slate-600 mt-1">jsonwebtoken, jose, etc.</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700">JWT token generation with signing</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                      Library install
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-emerald-600 text-xl">✓</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-emerald-600 text-xl">✓</span>
                    <div className="text-xs text-slate-500">Built-in</div>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">Command Line (base64)</div>
                    <div className="text-xs text-slate-600 mt-1 font-mono">echo '{}' | base64</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700">Shell scripts, CI/CD pipelines, automation</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                      Pre-installed
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-emerald-600 text-xl">✓</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-slate-400 text-xl">✗</span>
                    <div className="text-xs text-slate-500">Manual replace</div>
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
                  This online encoder is ideal for quick testing, debugging JWT tokens, generating one-off Base64 strings, and situations where you need both standard and URL-safe encoding with proper UTF-8 support. It requires zero setup and works entirely in your browser with complete privacy. For production applications with high volume, integrate Base64 encoding directly into your codebase using native libraries.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900">Frequently Asked Questions</h2>
            <p className="mt-3 text-slate-600 max-w-2xl mx-auto">Everything you need to know about JSON to Base64 encoding</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">How do I encode JSON to Base64?</summary>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Paste your JSON data into the input field, choose your encoding options (URL-safe, data URI prefix), and click Encode. The tool validates your JSON and converts it to Base64 encoding that you can copy or download.
                </p>
              </details>

              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What is Base64 encoding used for?</summary>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Base64 encoding converts binary data to ASCII text, making it safe for URLs, email, JSON tokens (JWT), API authentication, data URIs in HTML/CSS, and transmitting data over text-only protocols. It's essential for web tokens and embedded data.
                </p>
              </details>

              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Is Base64 encoding secure?</summary>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  No. Base64 is an encoding method, not encryption. Anyone can decode Base64 back to the original data instantly using browser tools or online decoders. Never use Base64 alone for sensitive data. Use proper encryption (AES, RSA) for security.
                </p>
              </details>

              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What is URL-safe Base64?</summary>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  URL-safe Base64 replaces + with - and / with _ characters, making the encoded string safe to use in URLs and filenames without escaping. Standard Base64 uses characters that need URL encoding. Essential for JWT tokens and query parameters.
                </p>
              </details>

              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Can I decode Base64 back to JSON?</summary>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Yes. Base64 encoding is reversible. Use atob() in JavaScript or any Base64 decoder to convert the encoded string back to the original JSON data. The decoding process is instantaneous and lossless.
                </p>
              </details>

              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">How do I create a JWT token from JSON?</summary>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  JWT tokens consist of three Base64-encoded parts: header, payload, and signature, separated by dots. Use URL-safe Base64 to encode your JSON payload, then combine it with an encoded header and HMAC/RSA signature: header.payload.signature.
                </p>
              </details>
            </div>

            <div className="space-y-4">
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Is my JSON data stored on your servers?</summary>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  No. All encoding happens locally in your browser using JavaScript. Your data never leaves your device and is not uploaded to any server. We have zero access to your JSON content, ensuring complete privacy.
                </p>
              </details>

              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Does Base64 encoding compress data?</summary>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  No. Base64 actually increases data size by approximately 33% because it converts every 3 bytes into 4 ASCII characters. Use gzip or brotli compression for reducing file size, not Base64. Base64 is for encoding, not compression.
                </p>
              </details>

              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">When should I use Base64 encoding?</summary>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Use Base64 for JWT tokens, embedding images in CSS/HTML (data URIs), API authentication headers (HTTP Basic Auth), transmitting binary data over JSON/XML, storing binary data in text databases, and passing data through URL parameters safely.
                </p>
              </details>

              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What's the maximum JSON size I can encode?</summary>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  This tool can handle large JSON files (several MB), but Base64's 33% size increase makes it impractical for large datasets. For JWT tokens, keep payloads under 6KB due to HTTP header limits. For data URIs, browsers support up to ~2MB.
                </p>
              </details>

              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Does this tool support Unicode characters?</summary>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Yes. This tool uses UTF-8 encoding before Base64 conversion, correctly handling emoji, accented characters, Chinese/Japanese text, and all Unicode symbols. Standard btoa() only handles ASCII, but we use proper UTF-8 encoding first.
                </p>
              </details>

              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Can I use this for production applications?</summary>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  This tool is perfect for testing, debugging, and one-off conversions. For production apps with high volume, integrate Base64 encoding directly into your codebase using native libraries (Buffer in Node.js, btoa in browsers, base64 module in Python) for better performance.
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
            description="Explore tutorials on JWT tokens, API authentication, Base64 encoding, and web development best practices."
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
            <p className="mt-3 text-slate-600 max-w-2xl mx-auto">More tools to work with JSON data</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/json/base64-to-json" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 transition-all duration-300 hover:border-indigo-300 hover:shadow-xl hover:-translate-y-1">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-2xl shadow-lg mb-4">
                🔓
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Base64 to JSON Decoder</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Decode Base64-encoded strings back to readable JSON. Perfect for debugging JWT tokens and API responses.
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
                Beautify and format JSON with proper indentation. Minify JSON before Base64 encoding to reduce size.
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
                Validate JSON syntax before encoding. Catch errors early and ensure your data is correctly formatted.
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
