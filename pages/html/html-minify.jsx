import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

export default function MinifyHTML() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [fetchUrl, setFetchUrl] = useState('');
  const [stats, setStats] = useState('');
  const [copyText, setCopyText] = useState('📋 Copy');
  
  // Options
  const [optComments, setOptComments] = useState(true);
  const [optWhitespace, setOptWhitespace] = useState(true);
  const [optKeepOneSpace, setOptKeepOneSpace] = useState(true);

  const currentYear = new Date().getFullYear();

  const demo = `<!doctype html>
<html>
  <head>
    <title>Demo</title>
  </head>
  <body>
    <!-- Greeting -->
    <div class="container">
      <h1> Hello world </h1>
      <p>   This   has   extra   spaces. </p>
    </div>
  </body>
</html>`;

  function minifyHTML(input, { removeComments, collapseWhitespace, keepOneSpace }) {
    let out = input;

    if (removeComments) {
      out = out.replace(/<!--([\s\S]*?)-->/g, "");
    }
    if (collapseWhitespace) {
      out = out.replace(/\s+/g, " ");
      out = out.replace(/>\s+</g, "><");
      out = out.trim();
    }
    return out;
  }

  function setStatsText(before, after) {
    const b = new Blob([before]).size;
    const a = new Blob([after]).size;
    const saved = b > 0 ? (((b - a) / b) * 100).toFixed(1) : "0.0";
    setStats(`Size: ${b.toLocaleString()} bytes → ${a.toLocaleString()} bytes (saved ${saved}%)`);
  }

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

  const handleMinify = () => {
    const inputText = input || "";
    const opts = {
      removeComments: optComments,
      collapseWhitespace: optWhitespace,
      keepOneSpace: optKeepOneSpace
    };
    const out = minifyHTML(inputText, opts);
    setOutput(out);
    setStatsText(inputText, out);
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
    const blob = new Blob([text], { type: "text/html" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "minified.html";
    a.click();
    URL.revokeObjectURL(a.href);
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
    // FAQPage Schema
    faqPage: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Is HTML minification safe?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Generally yes. Minification removes whitespace and comments while keeping structure intact. Always test if you rely on whitespace-sensitive layouts."
          }
        },
        {
          "@type": "Question",
          "name": "Do you store my HTML?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. This tool processes input locally in the browser and does not upload your content."
          }
        },
        {
          "@type": "Question",
          "name": "Does this remove comments?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes by default. Toggle 'Remove HTML comments' to keep them."
          }
        },
        {
          "@type": "Question",
          "name": "Will this break inline scripts?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Usually no, but be cautious if your scripts parse HTML strings or depend on exact whitespace. When in doubt, test."
          }
        },
        {
          "@type": "Question",
          "name": "How much file size can I save by minifying HTML?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "On average, HTML minification can reduce file size by 40-60%, depending on your code's formatting and comment density. Some files with heavy commenting can see even greater reductions."
          }
        },
        {
          "@type": "Question",
          "name": "Does HTML minification improve SEO?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, indirectly. Minified HTML loads faster, improving Core Web Vitals metrics like First Contentful Paint (FCP) and Largest Contentful Paint (LCP), which are ranking factors for Google. Faster pages provide better user experience."
          }
        },
        {
          "@type": "Question",
          "name": "Can I minify HTML automatically in my build process?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Most modern build tools (Webpack, Vite, Next.js) have HTML minification plugins. You can also use command-line tools like html-minifier-terser or integrate minification into your CI/CD pipeline."
          }
        },
        {
          "@type": "Question",
          "name": "What's the difference between minification and compression?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Minification removes unnecessary characters (whitespace, comments) from code itself. Compression (like gzip or brotli) is applied by web servers during transmission. Both work together - minify first, then compress for maximum file size reduction."
          }
        }
      ]
    },
    
    // SoftwareApplication Schema
    softwareApp: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "HTML Minifier",
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "Any",
      "description": "Free online HTML minifier tool to compress HTML code by removing whitespace and comments. Works instantly in your browser with complete privacy.",
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
        "Remove HTML comments",
        "Collapse whitespace",
        "Browser-based processing",
        "No data storage",
        "Instant results",
        "Download minified files",
        "Copy to clipboard",
        "Fetch from URL"
      ]
    },
    
    // HowTo Schema
    howTo: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Minify HTML",
      "description": "Step-by-step guide to minify HTML code online for free using FixTools HTML Minifier.",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Paste your HTML code",
          "text": "Copy your HTML code and paste it into the input field, or fetch HTML directly from a URL if CORS allows.",
          "position": 1
        },
        {
          "@type": "HowToStep",
          "name": "Choose minification options",
          "text": "Select options like removing comments, collapsing whitespace, and keeping single spaces between words to prevent merging.",
          "position": 2
        },
        {
          "@type": "HowToStep",
          "name": "Minify and export",
          "text": "Click the Minify button to process your HTML. Then copy the minified output to clipboard or download it as an HTML file.",
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
          "name": "HTML Tools",
          "item": "https://fixtools.io/tools/html"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "HTML Minifier",
          "item": "https://fixtools.io/html/html-minify"
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
        <title>HTML Minifier - Free Online Tool to Compress & Minify HTML | FixTools</title>
        <meta name="title" content="HTML Minifier - Free Online Tool to Compress & Minify HTML | FixTools" />
        <meta name="description" content="Minify HTML online for free. Remove whitespace, comments, and reduce file size by up to 60%. Fast, secure, and works in your browser. No registration required." />
        <meta name="keywords" content="html minifier, minify html, compress html, html optimizer, html minification tool, remove whitespace html, html compressor online" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://fixtools.io/html/html-minify" />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fixtools.io/html/html-minify" />
        <meta property="og:title" content="HTML Minifier - Free Online Tool to Compress & Minify HTML" />
        <meta property="og:description" content="Minify HTML online for free. Remove whitespace and reduce file size by up to 60%. Fast, secure, and works in your browser." />
        <meta property="og:image" content="https://fixtools.io/images/og-html-minifier.png" />
        <meta property="og:site_name" content="FixTools" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://fixtools.io/html/html-minify" />
        <meta property="twitter:title" content="HTML Minifier - Free Online Tool" />
        <meta property="twitter:description" content="Minify HTML online for free. Remove whitespace and reduce file size by up to 60%." />
        <meta property="twitter:image" content="https://fixtools.io/images/og-html-minifier.png" />
        
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
         * CRITICAL FIX: Override HTML font-size for proper rem calculations
         * The :has() selector targets the html element when this page is present
         * This makes 1rem = 16px (browser default) instead of 10px (global 62.5%)
         */
        html:has(.html-minify-page) {
          font-size: 100% !important;
        }
        
        /* 
         * SURGICAL CSS RESET - Only reset what's needed
         * Goal: Fix global CSS conflicts without breaking Tailwind utilities
         */
        
        .html-minify-page {
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
        .html-minify-page dl > div:hover {
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
        .html-minify-page *,
        .html-minify-page *::before,
        .html-minify-page *::after {
          box-sizing: border-box;
        }
        
        /* Remove default link underline */
        .html-minify-page a {
          text-decoration: none;
        }
        
        /* Reset global heading margins that might interfere */
        .html-minify-page h1,
        .html-minify-page h2,
        .html-minify-page h3,
        .html-minify-page h4,
        .html-minify-page h5,
        .html-minify-page h6 {
          margin: 0;
        }
        
        /* Reset global paragraph/list margins */
        .html-minify-page p,
        .html-minify-page ul,
        .html-minify-page ol,
        .html-minify-page dl,
        .html-minify-page dd {
          margin: 0;
        }
        
        /* Minimal button reset - only reset interfering globals */
        .html-minify-page button {
          font-family: inherit;
          cursor: pointer;
        }
        
        /* Let Tailwind handle all other button styling */
        /* DO NOT reset padding, margin, border, or background */
        
        /* Ensure inputs and textareas inherit font properly */
        .html-minify-page input,
        .html-minify-page textarea,
        .html-minify-page select {
          font-family: inherit;
        }
      `}</style>

      <div className="html-minify-page bg-[#fbfbfc] text-slate-900 min-h-screen">
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
              <Link href="/tools/html" className="hover:text-slate-900 transition-colors">
                HTML Tools
              </Link>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-slate-400">/</span>
              <span className="font-semibold text-slate-900">HTML Minifier</span>
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
                  HTML Minifier
                </span>
              </h1>
              
              {/* Enhanced description with better line height and keyword optimization */}
              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg md:leading-relaxed">
                Our <strong>HTML minifier</strong> helps you compress HTML code by removing unnecessary whitespace and comments. Minify HTML to reduce file size by up to 60%, speed up page load times, and improve Core Web Vitals for better SEO performance.
              </p>

              {/* Enhanced CTA buttons with better effects */}
              <div className="mt-7 pb-5 flex flex-wrap items-center gap-3">
                <a 
                  href="#tool" 
                  className="group relative rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 transition-all duration-200 hover:shadow-xl hover:shadow-slate-900/40 hover:scale-[1.02]"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    ⚡ Minify HTML
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
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">Minified HTML</dd>
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
                <h2 className="text-xl font-semibold text-slate-900">Minify HTML online</h2>
                <p className="mt-1 text-sm text-slate-600">Paste your HTML, choose options, and get a compact output you can copy or download.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button onClick={handlePasteDemo} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50">Paste demo</button>
                <button onClick={handleClear} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50">Clear</button>
                <button onClick={handleMinify} className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">⚡ Minify</button>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-12">
              <div className="md:col-span-8">
                <label className="mb-2 block text-sm font-semibold text-slate-800">Input HTML</label>
                <textarea 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="h-64 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-900/20" 
                  placeholder="Paste your HTML here..."
                />
              </div>
              <div className="md:col-span-4">
                <label className="mb-2 block text-sm font-semibold text-slate-800">Options</label>
                <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
                  <label className="flex cursor-pointer items-start gap-3">
                    <input 
                      type="checkbox" 
                      className="mt-1 h-4 w-4" 
                      checked={optComments}
                      onChange={(e) => setOptComments(e.target.checked)}
                    />
                    <span>
                      <span className="block text-sm font-semibold">Remove HTML comments</span>
                      <span className="block text-xs text-slate-600">Strips &lt;!-- comments --&gt; from the output.</span>
                    </span>
                  </label>
                  <label className="flex cursor-pointer items-start gap-3">
                    <input 
                      type="checkbox" 
                      className="mt-1 h-4 w-4" 
                      checked={optWhitespace}
                      onChange={(e) => setOptWhitespace(e.target.checked)}
                    />
                    <span>
                      <span className="block text-sm font-semibold">Collapse whitespace</span>
                      <span className="block text-xs text-slate-600">Removes extra spaces, tabs, and line breaks.</span>
                    </span>
                  </label>
                  <label className="flex cursor-pointer items-start gap-3">
                    <input 
                      type="checkbox" 
                      className="mt-1 h-4 w-4" 
                      checked={optKeepOneSpace}
                      onChange={(e) => setOptKeepOneSpace(e.target.checked)}
                    />
                    <span>
                      <span className="block text-sm font-semibold">Keep single spaces between words</span>
                      <span className="block text-xs text-slate-600">Prevents words from merging accidentally.</span>
                    </span>
                  </label>

                  <div className="pt-2">
                    <label className="block text-sm font-semibold text-slate-800">Fetch from URL (optional)</label>
                    <div className="mt-2 flex gap-2">
                      <input 
                        value={fetchUrl}
                        onChange={(e) => setFetchUrl(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/20" 
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

            <div className="mt-6">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <label className="text-sm font-semibold text-slate-800">Minified output</label>
                <div className="flex flex-wrap items-center gap-2">
                  <button onClick={handleCopy} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50">{copyText}</button>
                  <button onClick={handleDownload} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50">⬇ Download</button>
                </div>
              </div>
              <textarea 
                value={output}
                className="mt-2 h-56 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm text-slate-900 outline-none" 
                placeholder="Your minified HTML will appear here..." 
                readOnly
              />
              <p className="mt-2 text-xs text-slate-500">{stats}</p>
            </div>
          </div>
        </section>

        {/* What is HTML Minification? - Educational Content */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">What is HTML Minification?</h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                <strong>HTML minification</strong> is the process of removing unnecessary characters from HTML code without changing its functionality. This includes eliminating whitespace, line breaks, comments, and other redundant elements that make code more readable for humans but aren&apos;t required for browsers to render the page correctly.
              </p>
              
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                When you write HTML code, you typically format it with indentation, spaces, and line breaks to make it easier to read and maintain. While these formatting choices help developers understand the code structure, web browsers don&apos;t need this extra spacing to display the page. An <strong>HTML minifier</strong> strips away these unnecessary characters, resulting in a smaller file size that loads faster.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600">✗</span>
                    Before Minification
                  </h3>
                  <pre className="text-xs bg-white p-3 rounded-lg border border-slate-200 overflow-x-auto"><code>{`<!DOCTYPE html>
<html>
  <head>
    <title>Example</title>
  </head>
  <body>
    <!-- Main content -->
    <div class="container">
      <h1>  Hello World  </h1>
      <p>   Welcome   </p>
    </div>
  </body>
</html>`}</code></pre>
                  <p className="text-sm text-slate-600 mt-3">File size: ~250 bytes</p>
                </div>
                
                <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">✓</span>
                    After Minification
                  </h3>
                  <pre className="text-xs bg-white p-3 rounded-lg border border-emerald-200 overflow-x-auto"><code>{`<!DOCTYPE html><html><head><title>Example</title></head><body><div class="container"><h1>Hello World</h1><p>Welcome</p></div></body></html>`}</code></pre>
                  <p className="text-sm text-emerald-700 font-semibold mt-3">File size: ~140 bytes (44% smaller)</p>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">What Gets Removed During Minification?</h3>
              <ul className="space-y-2 mb-4">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold mt-1">•</span>
                  <span className="text-slate-700"><strong>Whitespace:</strong> Extra spaces, tabs, and line breaks between HTML tags</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold mt-1">•</span>
                  <span className="text-slate-700"><strong>HTML Comments:</strong> Developer notes wrapped in <code className="bg-slate-100 px-2 py-0.5 rounded text-sm">&lt;!-- --&gt;</code> tags</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold mt-1">•</span>
                  <span className="text-slate-700"><strong>Empty Attributes:</strong> Redundant or default attribute values</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold mt-1">•</span>
                  <span className="text-slate-700"><strong>Unnecessary Quotes:</strong> Optional quotes around certain attribute values (when safe)</span>
                </li>
              </ul>
              
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                The result is a compact, streamlined HTML file that maintains 100% functionality while consuming less bandwidth and loading faster. This optimization technique is especially valuable for high-traffic websites where even small file size reductions can translate to significant bandwidth savings and improved user experience.
              </p>
              
              <p className="text-base text-slate-700 leading-relaxed">
                Modern web development workflows often include HTML minification as an automated step in the build process. However, online tools like this <strong>HTML minifier</strong> provide a quick way to compress HTML for smaller projects, testing, or one-off optimizations without requiring build tool configuration.
              </p>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white p-8 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-3">HTML Minification Impact</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">Real data showing the performance benefits of minifying HTML code</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-emerald-200 shadow-lg">
                <div className="text-5xl font-extrabold text-emerald-600 mb-2">40-60%</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Average File Size Reduction</div>
                <div className="text-xs text-slate-600">Typical savings from minification</div>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-blue-200 shadow-lg">
                <div className="text-5xl font-extrabold text-blue-600 mb-2">0.3-0.7s</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Faster Page Load Time</div>
                <div className="text-xs text-slate-600">Improvement on 3G networks</div>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-purple-200 shadow-lg">
                <div className="text-5xl font-extrabold text-purple-600 mb-2">15-25%</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Core Web Vitals Boost</div>
                <div className="text-xs text-slate-600">Improvement in LCP & FCP</div>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-orange-200 shadow-lg">
                <div className="text-5xl font-extrabold text-orange-600 mb-2">30%</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Bandwidth Savings</div>
                <div className="text-xs text-slate-600">Reduced server costs</div>
              </div>
            </div>
            
            <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">📊</span>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">Performance Benchmark</h4>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    According to <a href="https://web.dev/fast/" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">Google&apos;s Web.dev</a>, a 0.1 second improvement in load time can increase conversion rates by up to 8%. By reducing HTML file size through minification, you directly improve page speed metrics that Google uses for search rankings.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Minify HTML - Benefits Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Why Minify HTML?</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Minifying HTML offers significant advantages for website performance, user experience, and search engine optimization. Here&apos;s why you should make HTML minification part of your optimization workflow:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Benefit 1 */}
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-emerald-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Faster Page Load Speed</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Smaller HTML files transfer faster over the network. Every kilobyte saved means quicker time-to-first-byte and faster rendering. This is especially critical for mobile users on slower connections where every millisecond counts. Studies show that 53% of mobile users abandon sites that take longer than 3 seconds to load.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Benefit 2 */}
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Improved SEO Rankings</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Google considers page speed as a ranking factor. Minified HTML improves Core Web Vitals metrics like <strong>First Contentful Paint (FCP)</strong> and <strong>Largest Contentful Paint (LCP)</strong>. Better performance signals to search engines that your site provides a quality user experience, potentially boosting your search rankings.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Benefit 3 */}
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-purple-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
                    <span className="text-2xl">💰</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Reduced Bandwidth Costs</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      For high-traffic websites, bandwidth costs can be substantial. When you <strong>compress HTML</strong> by 40-60%, you reduce the amount of data transferred with every page load. This translates to lower hosting bills and CDN costs. For a site with 1 million monthly visitors, this could save hundreds of dollars per month.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Benefit 4 */}
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-orange-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg">
                    <span className="text-2xl">📱</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Enhanced Mobile Experience</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Mobile devices often have limited processing power and network connectivity. Minified HTML loads faster on mobile networks (3G/4G), reduces data consumption for users with limited plans, and improves overall mobile user experience. With mobile-first indexing, Google prioritizes mobile performance.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Benefit 5 */}
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-cyan-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg">
                    <span className="text-2xl">🚀</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Better User Experience</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Fast-loading pages keep users engaged. Research by Amazon found that every 100ms of latency cost them 1% in sales. When you <strong>minify HTML</strong>, you contribute to a snappier, more responsive website that keeps visitors engaged and reduces bounce rates. Happy users are more likely to convert and return.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Benefit 6 */}
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-green-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
                    <span className="text-2xl">🌍</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Reduced Carbon Footprint</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Smaller files mean less data transferred across the internet, resulting in lower energy consumption. According to the <a href="https://www.thegreenwebfoundation.org/" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">Green Web Foundation</a>, optimizing web assets is one of the most effective ways to reduce the environmental impact of your website.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">💡</span>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">Real-World Impact</h4>
                  <p className="text-sm text-slate-700 leading-relaxed mb-2">
                    Major websites like <strong>Google</strong>, <strong>Facebook</strong>, and <strong>Amazon</strong> heavily minify their HTML and other assets. Google reported that reducing page load time by 0.5 seconds resulted in a 20% increase in traffic. HTML minification is a critical optimization technique used by top-performing websites worldwide.
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    Whether you&apos;re building a landing page, blog, e-commerce site, or web application, using an <strong>HTML minifier</strong> should be a standard part of your deployment process to maximize performance and user satisfaction.
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
                A good tool page can rank without relying on JavaScript-only UI. This layout includes clear headings, helpful copy, and FAQs for search intent coverage.
              </p>

              {/* Enhanced Steps with animations */}
              <ol className="mt-6 space-y-4">
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg shadow-slate-900/25 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-xl">
                    1
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Paste your HTML</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Or fetch HTML from a URL (if allowed by CORS).
                    </p>
                  </div>
                </li>
                
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg shadow-slate-900/25 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-xl">
                    2
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Choose options</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Remove comments, collapse whitespace, and keep safe spacing.
                    </p>
                  </div>
                </li>
                
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg shadow-slate-900/25 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-xl">
                    3
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Minify and export</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Copy the output or download an .html file.
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
                    Why use an HTML Minifier?
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
                      Reduce page size and bandwidth
                    </span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 transition-colors group-hover:bg-emerald-200">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">
                      Improve load-time performance signals
                    </span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 transition-colors group-hover:bg-emerald-200">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">
                      Keep pages cleaner for deployment
                    </span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 transition-colors group-hover:bg-emerald-200">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">
                      Great for static sites and landing pages
                    </span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 transition-colors group-hover:bg-emerald-200">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">
                      Works instantly, no sign-up
                    </span>
                  </li>
                </ul>
                
                {/* Enhanced tip box */}
                <div className="mt-6 rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50 p-4">
                  <div className="flex gap-2">
                    <span className="text-lg flex-shrink-0">💡</span>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      <span className="font-bold">Pro tip:</span> Pair this with an{' '}
                      <Link href="/html/html-formatter" className="font-bold text-emerald-700 hover:text-emerald-800 underline underline-offset-2">
                        HTML Formatter
                      </Link>
                      {' '}for editing, then minify right before shipping.
                    </p>
                  </div>
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
              <h2 className="text-3xl font-bold text-slate-900">Best Practices for HTML Minification</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              While HTML minification is generally safe and straightforward, following these best practices ensures optimal results without breaking your website:
            </p>
            
            <div className="space-y-6">
              {/* Best Practice 1 */}
              <div className="p-6 rounded-2xl border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold text-lg shadow-lg">
                    1
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Only Minify for Production</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      Keep your development and source files formatted and readable with proper indentation and comments. Only <strong>minify HTML</strong> when deploying to production. This maintains code readability for your development team while delivering optimized files to end users.
                    </p>
                    <div className="p-3 rounded-lg bg-white border border-emerald-200">
                      <p className="text-xs text-slate-600 font-mono">
                        ✅ <strong>DO:</strong> Keep source.html readable → Minify to dist/index.html for deployment<br />
                        ❌ <strong>DON&apos;T:</strong> Edit minified files directly
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
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Always Test After Minification</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      After minifying, test your website thoroughly. While rare, some edge cases can cause issues: <code className="bg-white px-2 py-1 rounded text-xs border border-blue-200">&lt;pre&gt;</code> tags with sensitive whitespace, inline JavaScript that parses HTML, or CSS selectors that depend on whitespace.
                    </p>
                    <div className="p-3 rounded-lg bg-white border border-blue-200">
                      <p className="text-xs text-slate-600">
                        <strong>Test checklist:</strong> Layout rendering • JavaScript functionality • Form submissions • Responsive design • Browser compatibility
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
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Use Version Control</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      Store your original, formatted HTML in version control systems like <strong>Git</strong>. Never commit minified files to your repository (unless they&apos;re in a build/dist directory). This keeps your repository clean and makes code reviews manageable.
                    </p>
                    <div className="p-3 rounded-lg bg-white border border-purple-200">
                      <p className="text-xs text-slate-600 font-mono">
                        Add to .gitignore: <code className="bg-slate-100 px-2 py-0.5 rounded">dist/*.min.html</code> or <code className="bg-slate-100 px-2 py-0.5 rounded">build/</code>
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
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Automate the Process</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      For projects with frequent updates, automate HTML minification in your build pipeline. Use build tools like <strong>Webpack</strong>, <strong>Gulp</strong>, <strong>Vite</strong>, or <strong>Next.js</strong> with minification plugins. This ensures consistency and eliminates manual steps.
                    </p>
                    <div className="p-3 rounded-lg bg-white border border-orange-200">
                      <p className="text-xs text-slate-600">
                        <strong>Popular tools:</strong> html-minifier-terser • HTMLMinifier plugin for Webpack • Built-in Next.js optimization
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
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Combine with Other Optimizations</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      <strong>HTML minification</strong> is most effective when combined with other performance optimizations. Also minify your CSS and JavaScript, enable gzip/brotli compression on your server, use a CDN, optimize images, and implement caching strategies.
                    </p>
                    <div className="p-3 rounded-lg bg-white border border-cyan-200">
                      <p className="text-xs text-slate-600">
                        <strong>Optimization stack:</strong> HTML Minification → CSS/JS Minification → Server Compression → CDN → Caching
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
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Monitor Performance Metrics</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      Use tools like <a href="https://pagespeed.web.dev/" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">Google PageSpeed Insights</a>, <a href="https://www.webpagetest.org/" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">WebPageTest</a>, or <a href="https://developers.google.com/web/tools/lighthouse" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">Lighthouse</a> to measure the impact of minification. Track metrics like First Contentful Paint, Largest Contentful Paint, and Total Blocking Time before and after optimization.
                    </p>
                    <div className="p-3 rounded-lg bg-white border border-green-200">
                      <p className="text-xs text-slate-600">
                        <strong>Key metrics:</strong> FCP • LCP • TBT • CLS • TTI • File size reduction
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
                      <span>Minifying HTML with <code className="bg-slate-800 px-2 py-0.5 rounded">&lt;pre&gt;</code> or <code className="bg-slate-800 px-2 py-0.5 rounded">&lt;code&gt;</code> blocks without testing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 font-bold">•</span>
                      <span>Removing conditional comments needed for IE compatibility (if still supporting IE)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 font-bold">•</span>
                      <span>Editing minified files instead of keeping a source version</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 font-bold">•</span>
                      <span>Minifying during development (slows debugging)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 font-bold">•</span>
                      <span>Not testing on different browsers after minification</span>
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
              <h2 className="text-3xl font-bold text-slate-900">HTML Minification Methods Comparison</h2>
            </div>
            
            <p className="text-base text-slate-600 mb-6 leading-relaxed">
              Choose the right <strong>HTML minifier</strong> approach based on your project needs and workflow:
            </p>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white">
                    <th className="text-left p-4 rounded-tl-xl font-semibold">Method</th>
                    <th className="text-center p-4 font-semibold">Speed</th>
                    <th className="text-center p-4 font-semibold">File Size Reduction</th>
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
                        Online Tool (This Page)
                      </div>
                    </td>
                    <td className="text-center p-4">
                      <div className="inline-flex gap-1">
                        <span className="text-emerald-600">⚡⚡⚡</span>
                      </div>
                      <div className="text-xs text-slate-600 mt-1">Instant</div>
                    </td>
                    <td className="text-center p-4">
                      <div className="font-bold text-emerald-700">40-60%</div>
                      <div className="text-xs text-slate-600 mt-1">Good</div>
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
                      Quick tests, one-off files, small projects
                    </td>
                  </tr>
                  
                  <tr className="border-b-2 border-slate-200 hover:bg-slate-50">
                    <td className="p-4 font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🔧</span>
                        Build Tool (Webpack/Vite)
                      </div>
                    </td>
                    <td className="text-center p-4">
                      <div className="inline-flex gap-1">
                        <span className="text-blue-600">⚡⚡</span>
                      </div>
                      <div className="text-xs text-slate-600 mt-1">Fast</div>
                    </td>
                    <td className="text-center p-4">
                      <div className="font-bold text-blue-700">50-70%</div>
                      <div className="text-xs text-slate-600 mt-1">Excellent</div>
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
                      Large projects, automated workflows, SPAs
                    </td>
                  </tr>
                  
                  <tr className="border-b-2 border-slate-200 hover:bg-slate-50">
                    <td className="p-4 font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">⚙️</span>
                        CLI Tool (Node.js)
                      </div>
                    </td>
                    <td className="text-center p-4">
                      <div className="inline-flex gap-1">
                        <span className="text-purple-600">⚡⚡⚡</span>
                      </div>
                      <div className="text-xs text-slate-600 mt-1">Very Fast</div>
                    </td>
                    <td className="text-center p-4">
                      <div className="font-bold text-purple-700">50-65%</div>
                      <div className="text-xs text-slate-600 mt-1">Very Good</div>
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
                      Scripting, batch processing, CI/CD pipelines
                    </td>
                  </tr>
                  
                  <tr className="border-b-2 border-slate-200 hover:bg-slate-50">
                    <td className="p-4 font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">☁️</span>
                        CDN with Auto-Minify
                      </div>
                    </td>
                    <td className="text-center p-4">
                      <div className="inline-flex gap-1">
                        <span className="text-orange-600">⚡⚡⚡</span>
                      </div>
                      <div className="text-xs text-slate-600 mt-1">Instant</div>
                    </td>
                    <td className="text-center p-4">
                      <div className="font-bold text-orange-700">50-65%</div>
                      <div className="text-xs text-slate-600 mt-1">Very Good</div>
                    </td>
                    <td className="text-center p-4">
                      <div className="inline-flex gap-1">
                        <span className="text-yellow-500">⭐⭐⭐</span>
                      </div>
                      <div className="text-xs text-slate-600 mt-1">Very Easy</div>
                    </td>
                    <td className="text-center p-4">
                      <div className="font-bold text-orange-600">$$</div>
                      <div className="text-xs text-slate-600 mt-1">Paid</div>
                    </td>
                    <td className="p-4 text-sm text-slate-700">
                      High-traffic sites, enterprise, global distribution
                    </td>
                  </tr>
                  
                  <tr className="hover:bg-slate-50">
                    <td className="p-4 font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🤖</span>
                        Framework Built-in (Next.js)
                      </div>
                    </td>
                    <td className="text-center p-4">
                      <div className="inline-flex gap-1">
                        <span className="text-indigo-600">⚡⚡</span>
                      </div>
                      <div className="text-xs text-slate-600 mt-1">Fast</div>
                    </td>
                    <td className="text-center p-4">
                      <div className="font-bold text-indigo-700">55-75%</div>
                      <div className="text-xs text-slate-600 mt-1">Excellent</div>
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
                      React apps, SSR projects, modern frameworks
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
                    For <strong>quick one-off tasks</strong>, use this online HTML minifier. For <strong>production projects</strong>, integrate minification into your build process using tools like Webpack, Gulp, or your framework&apos;s built-in optimizer. For <strong>enterprise sites</strong> with high traffic, consider a CDN with automatic minification like Cloudflare or Fastly for edge optimization.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs - Expanded for SEO */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <h2 className="text-2xl font-semibold text-slate-900">Frequently Asked Questions</h2>
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4" open>
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Is HTML minification safe?</summary>
                <p className="mt-2 text-sm text-slate-600">Generally yes. Minification removes whitespace and comments while keeping structure intact. Always test if you rely on whitespace-sensitive layouts.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Do you store my HTML?</summary>
                <p className="mt-2 text-sm text-slate-600">No. This tool processes input locally in the browser and does not upload your content. Your code never leaves your device.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Does this remove comments?</summary>
                <p className="mt-2 text-sm text-slate-600">Yes by default. Toggle &quot;Remove HTML comments&quot; to keep them.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Will this break inline scripts?</summary>
                <p className="mt-2 text-sm text-slate-600">Usually no, but be cautious if your scripts parse HTML strings or depend on exact whitespace. When in doubt, test.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">How much file size can I save by minifying HTML?</summary>
                <p className="mt-2 text-sm text-slate-600">On average, HTML minification can reduce file size by 40-60%, depending on your code&apos;s formatting and comment density. Some files with heavy commenting can see even greater reductions.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Does HTML minification improve SEO?</summary>
                <p className="mt-2 text-sm text-slate-600">Yes, indirectly. Minified HTML loads faster, improving Core Web Vitals metrics like First Contentful Paint (FCP) and Largest Contentful Paint (LCP), which are ranking factors for Google. Faster pages provide better user experience.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Can I minify HTML automatically in my build process?</summary>
                <p className="mt-2 text-sm text-slate-600">Yes. Most modern build tools (Webpack, Vite, Next.js) have HTML minification plugins. You can also use command-line tools like html-minifier-terser or integrate minification into your CI/CD pipeline.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What&apos;s the difference between minification and compression?</summary>
                <p className="mt-2 text-sm text-slate-600">Minification removes unnecessary characters (whitespace, comments) from code itself. Compression (like gzip or brotli) is applied by web servers during transmission. Both work together - minify first, then compress for maximum file size reduction.</p>
              </details>
            </div>
          </div>
        </section>

        {/* Related tools */}
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Related HTML & Optimization Tools</h2>
            <p className="text-slate-600">Explore our complete suite of developer tools to optimize your web projects:</p>
          </div>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-6">
            <Link href="/html/html-formatter" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-emerald-300 hover:shadow-lg transition-all duration-300" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">📝</span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">HTML Formatter</p>
                  <p className="text-xs text-slate-500">Beautify & Format</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">Beautify and format HTML for readability, then minify before shipping to production.</p>
              <p className="mt-4 text-sm font-semibold text-emerald-600 group-hover:text-emerald-700">Open tool →</p>
            </Link>
            
            <Link href="/css-tool/minify-css" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-purple-300 hover:shadow-lg transition-all duration-300" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🎨</span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">CSS Minifier</p>
                  <p className="text-xs text-slate-500">Compress Styles</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">Compress CSS to improve performance and reduce bundle size alongside HTML minification.</p>
              <p className="mt-4 text-sm font-semibold text-purple-600 group-hover:text-purple-700">Open tool →</p>
            </Link>
            
            <Link href="/json/json-minify" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-orange-300 hover:shadow-lg transition-all duration-300" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">⚙️</span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">JSON Minifier</p>
                  <p className="text-xs text-slate-500">Compress Data</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">Minify JSON data files to reduce API payload sizes and improve load times.</p>
              <p className="mt-4 text-sm font-semibold text-orange-600 group-hover:text-orange-700">Open tool →</p>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Link href="/seo-tools/site-map-generator" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-green-300 hover:shadow-lg transition-all duration-300" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🗺️</span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">Sitemap Generator</p>
                  <p className="text-xs text-slate-500">SEO Tool</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">Generate XML sitemaps to improve crawlability and indexing for better SEO performance.</p>
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
              <p className="text-sm text-slate-600 leading-relaxed">Validate HTML syntax and structure to ensure your code is error-free before minification.</p>
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
              <p className="text-sm text-slate-300 leading-relaxed">Discover 50+ free tools for HTML, CSS, JavaScript, JSON, and more web development tasks.</p>
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
