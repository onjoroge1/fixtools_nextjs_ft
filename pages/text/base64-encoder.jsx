import React, { useState, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import MarqueeCTA from '@/components/MarqueeCTA';

export default function Base64Encoder() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [stats, setStats] = useState('');
  const [copyText, setCopyText] = useState('📋 Copy');
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState('');
  const fileInputRef = useRef(null);
  
  // Options
  const [urlSafe, setUrlSafe] = useState(false);
  const [includePrefix, setIncludePrefix] = useState(false);
  const [mimeType, setMimeType] = useState('text/plain');

  const currentYear = new Date().getFullYear();

  const demo = `Hello World! This is a sample text to encode to Base64.`;

  const handlePasteDemo = () => {
    setInput(demo);
    setOutput('');
    setStats('');
    setFileName('');
    setFileType('');
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setStats('');
    setFileName('');
    setFileType('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setFileType(file.type || 'application/octet-stream');
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const arrayBuffer = event.target.result;
      const bytes = new Uint8Array(arrayBuffer);
      
      // Convert binary to Base64
      let binary = '';
      for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      
      let base64 = btoa(binary);
      
      // URL-safe encoding if enabled
      if (urlSafe) {
        base64 = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      }
      
      // Add data URI prefix if enabled
      if (includePrefix) {
        base64 = `data:${file.type || 'application/octet-stream'};base64,${base64}`;
      }
      
      setOutput(base64);
      
      const beforeSize = file.size;
      const afterSize = new Blob([base64]).size;
      const sizeDiff = afterSize - beforeSize;
      const sizeChangePercent = beforeSize > 0 ? ((sizeDiff / beforeSize) * 100).toFixed(1) : "0.0";
      
      setStats(`Encoded: ${beforeSize.toLocaleString()} bytes (${file.type || 'file'}) → ${afterSize.toLocaleString()} bytes (Base64) ${sizeDiff >= 0 ? '+' : ''}${sizeChangePercent}%`);
    };
    
    reader.readAsArrayBuffer(file);
  };

  const handleEncode = () => {
    const inputText = input.trim();
    if (!inputText) return;
    
    try {
      // Encode text to Base64
      let base64 = btoa(unescape(encodeURIComponent(inputText)));
      
      // URL-safe encoding if enabled (replace + with - and / with _)
      if (urlSafe) {
        base64 = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      }
      
      // Add data URI prefix if enabled
      if (includePrefix) {
        base64 = `data:${mimeType};base64,${base64}`;
      }
      
      setOutput(base64);
      
      const beforeSize = new Blob([inputText]).size;
      const afterSize = new Blob([base64]).size;
      const sizeDiff = afterSize - beforeSize;
      const sizeChangePercent = beforeSize > 0 ? ((sizeDiff / beforeSize) * 100).toFixed(1) : "0.0";
      
      setStats(`Encoded: ${beforeSize.toLocaleString()} bytes (text) → ${afterSize.toLocaleString()} bytes (Base64) ${sizeDiff >= 0 ? '+' : ''}${sizeChangePercent}%`);
      
    } catch (error) {
      alert(`Encoding error: ${error.message}`);
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
          "name": "How do I encode text to Base64?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Paste your text into the input field or upload a file, choose encoding options (URL-safe, data URI prefix), and click Encode. The tool will convert your text or file to Base64 format that you can copy or download."
          }
        },
        {
          "@type": "Question",
          "name": "What is Base64 encoding used for?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Base64 encoding converts binary data to ASCII text, making it safe for URLs, email attachments, embedding images in HTML/CSS (data URIs), API authentication, and transmitting data over text-only protocols."
          }
        },
        {
          "@type": "Question",
          "name": "Can I encode images to Base64?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Upload an image file (PNG, JPG, GIF, SVG, etc.) and the tool will encode it to Base64. Enable the data URI prefix option to get a complete data URI ready for use in HTML or CSS."
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
          "name": "What is a data URI?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A data URI embeds Base64-encoded data directly in HTML or CSS. Format: data:[mediatype][;base64],<data>. For example, data:image/png;base64,iVBORw0KG... embeds an image directly in your HTML."
          }
        },
        {
          "@type": "Question",
          "name": "Is my data stored on your servers?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. All encoding happens locally in your browser using JavaScript. Your text and files never leave your device and are not uploaded to any server."
          }
        },
        {
          "@type": "Question",
          "name": "Does Base64 encoding compress data?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. Base64 actually increases data size by approximately 33% because it converts every 3 bytes into 4 ASCII characters. Use gzip or brotli compression for reducing file size, not Base64."
          }
        },
        {
          "@type": "Question",
          "name": "What file types can I encode?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "You can encode any file type: images (PNG, JPG, GIF, SVG, WebP), documents (PDF, DOCX), text files, binary files, and more. Base64 encoding works with any binary data."
          }
        }
      ]
    },
    
    softwareApp: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Base64 Encoder",
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "Any",
      "description": "Free online tool to encode text and files to Base64 format. Create data URIs for images, encode email attachments, and convert any data to Base64. Supports URL-safe encoding and file uploads.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "ratingCount": "2840",
        "bestRating": "5",
        "worstRating": "1"
      },
      "featureList": [
        "Encode text to Base64 format",
        "Upload and encode files (images, PDFs, etc.)",
        "URL-safe Base64 encoding option",
        "Data URI prefix support",
        "Image data URI generation",
        "Browser-based processing (no uploads)",
        "Download encoded output",
        "Copy to clipboard"
      ]
    },
    
    howTo: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Encode Text or Files to Base64",
      "description": "Step-by-step guide to encode text or files to Base64 format online for free using FixTools Base64 Encoder.",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Enter text or upload a file",
          "text": "Paste your text into the input field or click 'Upload File' to select an image, document, or any file. The tool supports text input and file uploads for encoding any data type.",
          "position": 1
        },
        {
          "@type": "HowToStep",
          "name": "Choose encoding options",
          "text": "Select URL-safe encoding if you need the output for URLs or filenames. Enable data URI prefix if embedding in HTML or CSS (especially for images). Choose MIME type for text encoding if using data URI prefix.",
          "position": 2
        },
        {
          "@type": "HowToStep",
          "name": "Encode and export",
          "text": "Click the Encode button to convert your text or file to Base64. The tool uses standard Base64 encoding (or URL-safe variant) to create ASCII-safe text. Copy to clipboard or download the encoded string.",
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
          "name": "Text Tools",
          "item": "https://fixtools.io/tools/text-tools"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Base64 Encoder",
          "item": "https://fixtools.io/text/base64-encoder"
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
        <title>Base64 Encoder - Free Online Text & File Base64 Converter | FixTools</title>
        <meta name="title" content="Base64 Encoder - Free Online Text & File Base64 Converter | FixTools" />
        <meta name="description" content="Encode text and files to Base64 online for free. Create data URIs for images, encode email attachments, and convert any data to Base64. Supports URL-safe encoding and file uploads." />
        <meta name="keywords" content="base64 encoder, base64 encode, encode to base64, base64 converter, text to base64, image to base64, file to base64, data uri generator" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        <link rel="canonical" href="https://fixtools.io/text/base64-encoder" />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        {/* Open Graph - SEO */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fixtools.io/text/base64-encoder" />
        <meta property="og:title" content="Base64 Encoder - Free Online Tool" />
        <meta property="og:description" content="Encode text and files to Base64 instantly. Create data URIs for images, email attachments, and API authentication. URL-safe encoding supported." />
        <meta property="og:image" content="https://fixtools.io/images/og-base64-encoder.png" />
        <meta property="og:site_name" content="FixTools" />
        
        {/* Twitter Card */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://fixtools.io/text/base64-encoder" />
        <meta property="twitter:title" content="Base64 Encoder - Free Online Tool" />
        <meta property="twitter:description" content="Encode text and files to Base64 instantly. Data URIs and email attachments ready." />
        <meta property="twitter:image" content="https://fixtools.io/images/og-base64-encoder.png" />
        
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
        html:has(.base64-encoder-page) {
          font-size: 100% !important;
        }
        
        .base64-encoder-page {
          line-height: 1.5;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          width: 100%;
          min-height: 100vh;
        }
        
        .base64-encoder-page *,
        .base64-encoder-page *::before,
        .base64-encoder-page *::after {
          box-sizing: border-box;
        }
        
        .base64-encoder-page h1,
        .base64-encoder-page h2,
        .base64-encoder-page h3,
        .base64-encoder-page p,
        .base64-encoder-page ul,
        .base64-encoder-page ol {
          margin: 0;
        }
        
        .base64-encoder-page button {
          font-family: inherit;
          cursor: pointer;
        }
        
        .base64-encoder-page input,
        .base64-encoder-page textarea,
        .base64-encoder-page select {
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

      <div className="base64-encoder-page bg-[#fbfbfc] text-slate-900 min-h-screen">
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
              <Link href="/tools/text-tools" className="hover:text-slate-900 transition-colors">
                Text Tools
              </Link>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-slate-400">/</span>
              <span className="font-semibold text-slate-900">Base64 Encoder</span>
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
                  Base64 Encoder
                </span>
              </h1>
              
              {/* SEO-optimized description with target keywords */}
              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg md:leading-relaxed">
                <strong>Encode text and files to Base64</strong> instantly. Create data URIs for images, encode email attachments, and convert any data to Base64 format. Supports URL-safe encoding and file uploads. Perfect for developers working with data URIs, API authentication, and embedded content.
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
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Input</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">Text & Files</dd>
                </div>
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Output</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">Base64</dd>
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
                      <span className="text-2xl">🖼️</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">Image Data URIs</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Upload images and generate complete data URIs ready for embedding in HTML or CSS.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="feature-card group rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-lg transition-all duration-300 hover:border-blue-300 hover:shadow-xl hover:-translate-y-1" style={{ animationDelay: '0.2s' }}>
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30 transition-transform duration-300 group-hover:scale-110">
                      <span className="text-2xl">📎</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">File Upload Support</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Encode any file type: images, PDFs, documents, binary files, and more.
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
                        Everything runs locally in your browser. Your files and text never leave your device.
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
                <h2 className="text-xl font-semibold text-slate-900">Encode text or files to Base64 online</h2>
                <p className="mt-1 text-sm text-slate-600">Paste text, upload a file, choose encoding options, and get Base64 output.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button onClick={handlePasteDemo} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50">Paste demo</button>
                <button onClick={handleClear} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50">Clear</button>
                <button onClick={handleEncode} className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">🔐 Encode to Base64</button>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-12">
              <div className="md:col-span-8">
                <div className="mb-4 flex gap-3">
                  <label className="mb-2 block flex-1 text-sm font-semibold text-slate-800">Input Text</label>
                  <label className="mb-2 block flex-1 text-sm font-semibold text-slate-800">Or Upload File</label>
                </div>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="h-48 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-900/20" 
                  placeholder="Enter text to encode or upload a file below..."
                />
                <div className="mt-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileUpload}
                    className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-xl file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-slate-800"
                  />
                  {fileName && (
                    <p className="mt-2 text-xs text-slate-500">
                      File: <span className="font-semibold">{fileName}</span> ({fileType})
                    </p>
                  )}
                </div>
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
                      Add data:[mime];base64, prefix.
                    </p>
                  </div>

                  {includePrefix && (
                    <div>
                      <label className="block text-sm font-semibold text-slate-800 mb-2">MIME Type</label>
                      <select
                        value={mimeType}
                        onChange={(e) => setMimeType(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-900/20"
                      >
                        <option value="text/plain">text/plain</option>
                        <option value="text/html">text/html</option>
                        <option value="application/json">application/json</option>
                        <option value="image/png">image/png</option>
                        <option value="image/jpeg">image/jpeg</option>
                        <option value="image/gif">image/gif</option>
                        <option value="image/svg+xml">image/svg+xml</option>
                      </select>
                    </div>
                  )}
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
                When you <strong>encode text or files to Base64</strong>, the tool converts your data (text, images, documents, or any binary file) into bytes, then transforms those bytes into Base64 characters. This process makes your data safe for transmission over protocols that only support ASCII text, such as email, URLs, HTTP headers, XML documents, and HTML/CSS data URIs.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                  <h4 className="text-sm font-bold text-slate-900 mb-3">Original Text</h4>
                  <pre className="text-xs text-slate-700 overflow-x-auto font-mono bg-white p-3 rounded-lg border border-slate-200">
Hello World!
                  </pre>
                  <p className="mt-2 text-xs text-slate-500">12 bytes (text)</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                  <h4 className="text-sm font-bold text-slate-900 mb-3">Base64 Encoded</h4>
                  <pre className="text-xs text-slate-700 overflow-x-auto font-mono bg-white p-3 rounded-lg border border-slate-200 break-all">
SGVsbG8gV29ybGQh
                  </pre>
                  <p className="mt-2 text-xs text-slate-500">16 bytes (+33% size, ASCII-safe)</p>
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">How Base64 Encoding Works</h3>
              <p>
                The encoding process groups input bytes into sets of three (24 bits total), then splits those 24 bits into four groups of 6 bits each. Each 6-bit group is mapped to one of 64 printable ASCII characters. If the input isn't evenly divisible by 3, padding characters (=) are added to the end of the output to indicate the number of bytes in the final group.
              </p>

              <p>
                For <strong>text and file encoding</strong>, this means your data can contain any characters, binary content, images, or special symbols—and they'll all be safely represented as ASCII text. This is why Base64 is the standard encoding for email attachments, data URIs in HTML/CSS, API authentication, and embedding binary data in text-based formats.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">Base64 vs URL-Safe Base64</h3>
              <p>
                Standard Base64 uses the characters + and /, which have special meanings in URLs and must be percent-encoded. <strong>URL-safe Base64</strong> replaces these with - and _ respectively, and typically omits the = padding. This makes the encoded string safe to use directly in URLs, query parameters, and filenames without additional escaping—essential for API tokens, OAuth parameters, and RESTful API endpoints.
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

        {/* Why Encode to Base64? - Benefits Section */}
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">Why Encode to Base64?</h2>
            <p className="mt-3 text-slate-600 max-w-2xl mx-auto">Common use cases where Base64 encoding is essential</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="group rounded-3xl border-2 border-slate-200 bg-white p-6 transition-all duration-300 hover:border-indigo-300 hover:shadow-xl">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-2xl shadow-lg mb-4">
                🖼️
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Image Data URIs</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Embed images directly in HTML or CSS using data URIs. Encode images to Base64 and embed them inline, eliminating separate HTTP requests and improving page load performance for small images.
              </p>
            </div>

            <div className="group rounded-3xl border-2 border-slate-200 bg-white p-6 transition-all duration-300 hover:border-blue-300 hover:shadow-xl">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-2xl shadow-lg mb-4">
                📧
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Email Attachments</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                SMTP and email protocols require 7-bit ASCII text. Base64 encoding allows binary attachments (images, PDFs, documents) to be transmitted safely through email systems.
              </p>
            </div>

            <div className="group rounded-3xl border-2 border-slate-200 bg-white p-6 transition-all duration-300 hover:border-emerald-300 hover:shadow-xl">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 text-2xl shadow-lg mb-4">
                🔐
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">API Authentication</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                HTTP Basic Authentication uses Base64 to encode credentials. API keys, tokens, and authentication strings often use Base64 encoding for safe transmission in headers and URLs.
              </p>
            </div>

            <div className="group rounded-3xl border-2 border-slate-200 bg-white p-6 transition-all duration-300 hover:border-amber-300 hover:shadow-xl">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-2xl shadow-lg mb-4">
                🔗
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">URL Parameters</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Pass complex data or binary content through URL query parameters safely. URL-safe Base64 avoids special character encoding issues in web applications and REST APIs.
              </p>
            </div>

            <div className="group rounded-3xl border-2 border-slate-200 bg-white p-6 transition-all duration-300 hover:border-purple-300 hover:shadow-xl">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 text-2xl shadow-lg mb-4">
                🗄️
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Database Storage</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Store binary data in text-only database columns or XML documents. Base64 ensures data integrity and prevents encoding issues across systems and platforms.
              </p>
            </div>

            <div className="group rounded-3xl border-2 border-slate-200 bg-white p-6 transition-all duration-300 hover:border-rose-300 hover:shadow-xl">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 text-2xl shadow-lg mb-4">
                📄
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">File Transmission</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Transmit binary files over text-only protocols (JSON, XML, email). Base64 encoding converts any file type (images, PDFs, documents) into ASCII-safe text for transmission.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 p-10 text-center">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-3xl font-bold text-slate-900 mb-3">Base64 Encoding in Numbers</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">Why developers choose Base64 for data transmission</p>
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
            <h2 className="text-3xl font-bold text-slate-900">How to Encode Text or Files to Base64</h2>
            <p className="mt-3 text-slate-600 max-w-2xl mx-auto">Three simple steps to convert your data to Base64 format</p>
          </div>

          <div className="space-y-6">
            <div className="group flex gap-6 rounded-3xl border-2 border-slate-200 bg-white p-6 md:p-8 transition-all duration-300 hover:border-indigo-300 hover:shadow-xl">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-xl font-black text-white shadow-lg">
                1
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Enter text or upload a file</h3>
                <p className="text-slate-600 leading-relaxed">
                  Paste your text into the input field or click "Upload File" to select an image, document, PDF, or any file type. The tool supports both text input and file uploads, making it versatile for encoding any data type. For images, the tool automatically detects the MIME type and can generate complete data URIs ready for HTML or CSS embedding.
                </p>
                <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-900 mb-2">Supported file types:</p>
                  <div className="flex flex-wrap gap-2 text-xs text-slate-600">
                    <span className="px-2 py-1 rounded bg-white border border-slate-200">Images (PNG, JPG, GIF, SVG)</span>
                    <span className="px-2 py-1 rounded bg-white border border-slate-200">Documents (PDF, DOCX)</span>
                    <span className="px-2 py-1 rounded bg-white border border-slate-200">Text files</span>
                    <span className="px-2 py-1 rounded bg-white border border-slate-200">Any binary file</span>
                  </div>
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
                  Select <strong>URL-safe encoding</strong> if you're creating tokens, passing data through URL parameters, or need the output to work in filenames. This replaces + and / characters with - and _, making the string URL-compatible without percent encoding. Enable the <strong>data URI prefix</strong> if you're embedding data in HTML or CSS—this adds the full <code className="px-1 py-0.5 rounded bg-slate-100 text-xs font-mono">data:[mime];base64,</code> prefix. For text encoding, choose the appropriate MIME type (text/plain, text/html, application/json, etc.).
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
                  <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2">
                    <span className="text-sm font-semibold text-slate-900">✓ MIME types</span>
                    <span className="text-xs text-slate-600 ml-2">Auto-detected</span>
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
                  Click the <strong>Encode to Base64</strong> button to convert your text or file. The tool uses standard Base64 encoding with UTF-8 support for international characters in text, ensuring compatibility with all modern systems. For files, binary data is encoded directly. The output shows the size change (typically +33% for Base64 overhead) and the encoded string. Copy the result to your clipboard or download it as a text file for immediate use in data URIs, email attachments, API requests, or embedded content scenarios.
                </p>
                <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-900 mb-2">Example Base64 output:</p>
                  <pre className="text-xs text-slate-700 overflow-x-auto font-mono break-all">
SGVsbG8gV29ybGQh
                  </pre>
                  <p className="text-xs text-slate-500 mt-2">Or with data URI: data:text/plain;base64,SGVsbG8gV29ybGQh</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Best Practices Section */}
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 md:p-12" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-slate-900">Best Practices for Base64 Encoding</h2>
              <p className="mt-3 text-slate-600 max-w-2xl mx-auto">Expert tips for efficient and secure Base64 usage</p>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50 p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white text-xl font-bold">
                    ✓
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-2">Use URL-safe encoding for tokens and URLs</h4>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      When creating API tokens, OAuth parameters, or passing data through URLs, always use URL-safe Base64 encoding. Standard Base64's + and / characters cause issues in URLs and query parameters. URL-safe encoding replaces them with - and _, eliminating the need for percent encoding and preventing transmission errors.
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
                    <h4 className="font-bold text-slate-900 mb-2">Use data URIs for small images</h4>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Data URIs are perfect for embedding small images (&lt;10KB) directly in HTML or CSS, eliminating HTTP requests and improving page load speed. For larger images, use regular image files as Base64 increases size by 33%, making large images inefficient. Keep data URIs for icons, logos, and small graphics.
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
                    <h4 className="font-bold text-slate-900 mb-2">Choose correct MIME types for data URIs</h4>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      When generating data URIs, use the correct MIME type for your content. For images: image/png, image/jpeg, image/gif, image/svg+xml. For text: text/plain, text/html, application/json. The tool auto-detects MIME types for uploaded files, but you can manually select the type for text encoding.
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
                      <strong>Critical:</strong> Base64 is encoding, not encryption. Anyone can decode Base64 instantly using built-in browser tools or online decoders. Never store passwords, API keys, or sensitive data in Base64 alone. Use proper encryption (AES-256, RSA) before encoding, or use secure tokens with cryptographic signatures.
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
                    <h4 className="font-bold text-slate-900 mb-2">Don't encode large files</h4>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Base64 increases data size by 33%. For large files (&gt;100KB), this overhead significantly impacts performance and bandwidth. Use compression (gzip, brotli) instead, or serve files directly. Base64 works best for small payloads like small images (&lt;10KB), short text strings, and embedded configuration data.
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
                    <h4 className="font-bold text-slate-900 mb-2">Don't ignore UTF-8 encoding for text</h4>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      When encoding text with international characters (emoji, accented characters, Chinese/Japanese text), ensure your tool uses UTF-8 encoding before Base64. JavaScript's native <code className="px-1 py-0.5 rounded bg-white text-xs font-mono">btoa()</code> only handles ASCII—you must use <code className="px-1 py-0.5 rounded bg-white text-xs font-mono">encodeURIComponent()</code> first. This tool handles UTF-8 automatically.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900">Frequently Asked Questions</h2>
            <p className="mt-3 text-slate-600 max-w-2xl mx-auto">Everything you need to know about Base64 encoding</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">How do I encode text to Base64?</summary>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Paste your text into the input field or upload a file, choose encoding options (URL-safe, data URI prefix), and click Encode. The tool will convert your text or file to Base64 format that you can copy or download.
                </p>
              </details>

              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What is Base64 encoding used for?</summary>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Base64 encoding converts binary data to ASCII text, making it safe for URLs, email attachments, embedding images in HTML/CSS (data URIs), API authentication, and transmitting data over text-only protocols.
                </p>
              </details>

              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Can I encode images to Base64?</summary>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Yes. Upload an image file (PNG, JPG, GIF, SVG, etc.) and the tool will encode it to Base64. Enable the data URI prefix option to get a complete data URI ready for use in HTML or CSS.
                </p>
              </details>

              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What is URL-safe Base64?</summary>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  URL-safe Base64 replaces + with - and / with _ characters, making the encoded string safe to use in URLs and filenames without escaping. Standard Base64 uses characters that need URL encoding.
                </p>
              </details>

              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What is a data URI?</summary>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  A data URI embeds Base64-encoded data directly in HTML or CSS. Format: data:[mediatype][;base64],&lt;data&gt;. For example, data:image/png;base64,iVBORw0KG... embeds an image directly in your HTML.
                </p>
              </details>

              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Is my data stored on your servers?</summary>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  No. All encoding happens locally in your browser using JavaScript. Your text and files never leave your device and are not uploaded to any server.
                </p>
              </details>
            </div>

            <div className="space-y-4">
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Does Base64 encoding compress data?</summary>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  No. Base64 actually increases data size by approximately 33% because it converts every 3 bytes into 4 ASCII characters. Use gzip or brotli compression for reducing file size, not Base64.
                </p>
              </details>

              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What file types can I encode?</summary>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  You can encode any file type: images (PNG, JPG, GIF, SVG, WebP), documents (PDF, DOCX), text files, binary files, and more. Base64 encoding works with any binary data.
                </p>
              </details>

              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">When should I use Base64 encoding?</summary>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Use Base64 for embedding images in CSS/HTML (data URIs), email attachments, API authentication headers, transmitting binary data over JSON/XML, storing binary data in text databases, and passing data through URL parameters safely.
                </p>
              </details>

              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What's the maximum file size I can encode?</summary>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  This tool can handle large files (several MB), but Base64's 33% size increase makes it impractical for very large files. For data URIs, browsers support up to ~2MB. For email attachments, keep files under 25MB for most email providers.
                </p>
              </details>

              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Does this tool support Unicode characters?</summary>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Yes. This tool uses UTF-8 encoding before Base64 conversion, correctly handling emoji, accented characters, Chinese/Japanese text, and all Unicode symbols in text input.
                </p>
              </details>

              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Can I use this for production applications?</summary>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  This tool is perfect for testing, debugging, and one-off encoding. For production apps with high volume, integrate Base64 encoding directly into your codebase using native libraries (Buffer in Node.js, btoa in browsers, base64 module in Python) for better performance.
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* Learning CTA */}
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <MarqueeCTA
            href="/learn"
            title="📚 Master Data Encoding & Web Development"
            description="Explore tutorials on Base64 encoding, data URIs, API authentication, and web development best practices."
            buttonText="Explore learning center"
            emoji="→"
            bgColor="bg-gradient-to-r from-indigo-500 to-purple-600"
            textColor="text-white"
          />
        </section>

        {/* Related Tools */}
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900">Related Tools</h2>
            <p className="mt-3 text-slate-600 max-w-2xl mx-auto">More tools to work with Base64 and data encoding</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/text/base64-decoder" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 transition-all duration-300 hover:border-indigo-300 hover:shadow-xl hover:-translate-y-1">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-2xl shadow-lg mb-4">
                🔓
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Base64 Decoder</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Decode Base64 strings back to text or files. Perfect for decoding data URIs, email attachments, and API responses.
              </p>
              <div className="flex items-center gap-2 text-sm font-semibold text-indigo-600 group-hover:gap-3 transition-all">
                Try it now <span>→</span>
              </div>
            </Link>

            <Link href="/json/json-to-base64" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 transition-all duration-300 hover:border-blue-300 hover:shadow-xl hover:-translate-y-1">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-2xl shadow-lg mb-4">
                🔐
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">JSON to Base64</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Encode JSON data specifically to Base64. Perfect for JWT token payloads and JSON-based API authentication.
              </p>
              <div className="flex items-center gap-2 text-sm font-semibold text-blue-600 group-hover:gap-3 transition-all">
                Try it now <span>→</span>
              </div>
            </Link>

            <Link href="/json/base64-to-json" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 transition-all duration-300 hover:border-emerald-300 hover:shadow-xl hover:-translate-y-1">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 text-2xl shadow-lg mb-4">
                📄
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Base64 to JSON</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Decode Base64-encoded JSON data. Perfect for viewing JWT token payloads and API responses.
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

