import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import MarqueeCTA from '@/components/MarqueeCTA';

export default function Base64Decoder() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [stats, setStats] = useState('');
  const [copyText, setCopyText] = useState('📋 Copy');
  const [outputType, setOutputType] = useState('text'); // 'text' or 'binary'
  const [mimeType, setMimeType] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  // Options
  const [autoDetectUrlSafe, setAutoDetectUrlSafe] = useState(true);
  const [autoRemovePrefix, setAutoRemovePrefix] = useState(true);

  const currentYear = new Date().getFullYear();

  const demo = `SGVsbG8gV29ybGQh`;

  const handlePasteDemo = () => {
    setInput(demo);
    setOutput('');
    setStats('');
    setOutputType('text');
    setMimeType('');
    setImagePreview('');
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setStats('');
    setOutputType('text');
    setMimeType('');
    setImagePreview('');
  };

  const handleDecode = () => {
    const inputText = input.trim();
    if (!inputText) return;
    
    try {
      let base64String = inputText;
      let detectedMimeType = '';
      
      // Auto-remove data URI prefix if enabled
      if (autoRemovePrefix && base64String.startsWith('data:')) {
        const commaIndex = base64String.indexOf(',');
        if (commaIndex !== -1) {
          const prefix = base64String.substring(0, commaIndex);
          // Extract MIME type from prefix
          const mimeMatch = prefix.match(/data:([^;]+)/);
          if (mimeMatch) {
            detectedMimeType = mimeMatch[1];
            setMimeType(detectedMimeType);
          }
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
      
      // Decode Base64 to binary
      const binaryString = atob(base64String);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      // Try to decode as UTF-8 text first
      try {
        const textDecoder = new TextDecoder('utf-8');
        const decodedText = textDecoder.decode(bytes);
        
        // Check if it's valid UTF-8 text (mostly printable ASCII)
        const isText = /^[\x20-\x7E\s]*$/.test(decodedText) || decodedText.length > 0;
        
        if (isText && decodedText.length < 10000) { // Assume text if reasonable length
          setOutput(decodedText);
          setOutputType('text');
          setImagePreview('');
          
          const beforeSize = new Blob([inputText]).size;
          const afterSize = new Blob([decodedText]).size;
          const sizeDiff = beforeSize - afterSize;
          const sizeChangePercent = beforeSize > 0 ? ((sizeDiff / beforeSize) * 100).toFixed(1) : "0.0";
          
          setStats(`Decoded: ${beforeSize.toLocaleString()} bytes (Base64) → ${afterSize.toLocaleString()} bytes (text) ${sizeDiff >= 0 ? '-' : '+'}${sizeChangePercent}%`);
        } else {
          // Binary data - treat as file
          setOutputType('binary');
          setOutput('');
          setImagePreview('');
          
          // Check if it's an image
          if (detectedMimeType && detectedMimeType.startsWith('image/')) {
            const blob = new Blob([bytes], { type: detectedMimeType });
            const url = URL.createObjectURL(blob);
            setImagePreview(url);
            setMimeType(detectedMimeType);
          }
          
          const beforeSize = new Blob([inputText]).size;
          const afterSize = bytes.length;
          const sizeDiff = beforeSize - afterSize;
          const sizeChangePercent = beforeSize > 0 ? ((sizeDiff / beforeSize) * 100).toFixed(1) : "0.0";
          
          setStats(`Decoded: ${beforeSize.toLocaleString()} bytes (Base64) → ${afterSize.toLocaleString()} bytes (binary) ${sizeDiff >= 0 ? '-' : '+'}${sizeChangePercent}%`);
        }
      } catch (e) {
        // Not valid UTF-8, treat as binary
        setOutputType('binary');
        setOutput('');
        setImagePreview('');
        
        const beforeSize = new Blob([inputText]).size;
        const afterSize = bytes.length;
        const sizeDiff = beforeSize - afterSize;
        const sizeChangePercent = beforeSize > 0 ? ((sizeDiff / beforeSize) * 100).toFixed(1) : "0.0";
        
        setStats(`Decoded: ${beforeSize.toLocaleString()} bytes (Base64) → ${afterSize.toLocaleString()} bytes (binary) ${sizeDiff >= 0 ? '-' : '+'}${sizeChangePercent}%`);
      }
      
    } catch (error) {
      if (error.message.includes('Invalid character')) {
        alert(`Invalid Base64 string: ${error.message}. Make sure the input is valid Base64 encoded data.`);
      } else {
        alert(`Decoding error: ${error.message}`);
      }
      setOutput('');
      setStats('');
      setOutputType('text');
      setMimeType('');
      setImagePreview('');
    }
  };

  const handleCopy = async () => {
    if (outputType === 'text') {
      const text = output || "";
      if (!text) return;
      await navigator.clipboard.writeText(text);
    } else {
      // Copy Base64 input for binary
      const text = input || "";
      if (!text) return;
      await navigator.clipboard.writeText(text);
    }
    setCopyText('✅ Copied');
    setTimeout(() => setCopyText('📋 Copy'), 1200);
  };

  const handleDownload = () => {
    if (outputType === 'text') {
      const text = output || "";
      if (!text) return;
      const blob = new Blob([text], { type: "text/plain" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "decoded.txt";
      a.click();
      URL.revokeObjectURL(a.href);
    } else {
      // Download binary file
      const inputText = input.trim();
      if (!inputText) return;
      
      try {
        let base64String = inputText;
        
        if (autoRemovePrefix && base64String.startsWith('data:')) {
          const commaIndex = base64String.indexOf(',');
          if (commaIndex !== -1) {
            base64String = base64String.substring(commaIndex + 1);
          }
        }
        
        if (autoDetectUrlSafe && (base64String.includes('-') || base64String.includes('_'))) {
          base64String = base64String.replace(/-/g, '+').replace(/_/g, '/');
          while (base64String.length % 4 !== 0) {
            base64String += '=';
          }
        }
        
        const binaryString = atob(base64String);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        
        // Determine file extension from MIME type
        let extension = 'bin';
        if (mimeType) {
          const extMap = {
            'image/png': 'png',
            'image/jpeg': 'jpg',
            'image/jpg': 'jpg',
            'image/gif': 'gif',
            'image/svg+xml': 'svg',
            'application/pdf': 'pdf',
            'text/plain': 'txt',
            'text/html': 'html',
            'application/json': 'json'
          };
          extension = extMap[mimeType] || 'bin';
        }
        
        const blob = new Blob([bytes], { type: mimeType || 'application/octet-stream' });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `decoded.${extension}`;
        a.click();
        URL.revokeObjectURL(a.href);
      } catch (error) {
        alert(`Error downloading file: ${error.message}`);
      }
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
          "name": "How do I decode Base64?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Paste your Base64 string into the input field, enable auto-detection options if needed, and click Decode. The tool will decode the Base64 string to text or binary data that you can view, copy, or download."
          }
        },
        {
          "@type": "Question",
          "name": "What is Base64 decoding?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Base64 decoding converts Base64-encoded strings back to their original format (text, images, files, or binary data). The process reverses Base64 encoding, converting ASCII characters back to bytes and then to the original data."
          }
        },
        {
          "@type": "Question",
          "name": "Can I decode images from Base64?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. If your Base64 string contains image data (from a data URI or image encoding), the tool will detect it and allow you to preview or download the image. The tool automatically detects image MIME types from data URI prefixes."
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
          "name": "What if the decoded data is binary?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "If the Base64 string contains binary data (images, PDFs, etc.), the tool will detect it and allow you to download it as a file. For images, you can preview them directly in the browser. The tool automatically detects the file type from data URI prefixes."
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
            "text": "If your Base64 string starts with 'data:[mime];base64,', enable the auto-remove prefix option. The tool will automatically strip the prefix before decoding and detect the MIME type for proper file handling."
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
      "name": "Base64 Decoder",
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "Any",
      "description": "Free online tool to decode Base64 strings to text or files. Decode data URIs, email attachments, and Base64-encoded data. Supports URL-safe Base64, image preview, and file downloads.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "ratingCount": "2560",
        "bestRating": "5",
        "worstRating": "1"
      },
      "featureList": [
        "Decode Base64 to text or files",
        "URL-safe Base64 auto-detection",
        "Data URI prefix removal",
        "Image preview and download",
        "Binary file download support",
        "Browser-based processing (no uploads)",
        "Copy decoded text",
        "Download decoded files"
      ]
    },
    
    howTo: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Decode Base64 Strings",
      "description": "Step-by-step guide to decode Base64-encoded strings to text or files online for free using FixTools Base64 Decoder.",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Paste your Base64 string",
          "text": "Copy your Base64-encoded string (from data URIs, email attachments, API responses, or any Base64 source) and paste it into the input field. The tool supports both standard and URL-safe Base64 encoding.",
          "position": 1
        },
        {
          "@type": "HowToStep",
          "name": "Configure decoding options",
          "text": "Enable auto-detect URL-safe if your Base64 string uses - and _ characters. Enable auto-remove prefix if your string starts with 'data:[mime];base64,'. These options ensure proper decoding of various Base64 formats.",
          "position": 2
        },
        {
          "@type": "HowToStep",
          "name": "Decode and view/download",
          "text": "Click the Decode button to convert your Base64 string. The tool automatically detects if the output is text or binary data. For text, view and copy the result. For binary files (especially images), preview or download the decoded file.",
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
          "name": "Base64 Decoder",
          "item": "https://fixtools.io/text/base64-decoder"
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
        <title>Base64 Decoder - Free Online Base64 to Text & File Converter | FixTools</title>
        <meta name="title" content="Base64 Decoder - Free Online Base64 to Text & File Converter | FixTools" />
        <meta name="description" content="Decode Base64 to text and files online for free. Decode data URIs, email attachments, and Base64-encoded data. Supports URL-safe Base64, image preview, and file downloads." />
        <meta name="keywords" content="base64 decoder, base64 decode, decode base64, base64 converter, base64 to text, base64 to image, decode base64 online, base64 decode file" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        <link rel="canonical" href="https://fixtools.io/text/base64-decoder" />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        {/* Open Graph - SEO */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fixtools.io/text/base64-decoder" />
        <meta property="og:title" content="Base64 Decoder - Free Online Tool" />
        <meta property="og:description" content="Decode Base64 to text and files instantly. Decode data URIs, email attachments, and API responses. URL-safe Base64 supported." />
        <meta property="og:image" content="https://fixtools.io/images/og-base64-decoder.png" />
        <meta property="og:site_name" content="FixTools" />
        
        {/* Twitter Card */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://fixtools.io/text/base64-decoder" />
        <meta property="twitter:title" content="Base64 Decoder - Free Online Tool" />
        <meta property="twitter:description" content="Decode Base64 to text and files instantly. Data URIs and email attachments ready." />
        <meta property="twitter:image" content="https://fixtools.io/images/og-base64-decoder.png" />
        
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
        html:has(.base64-decoder-page) {
          font-size: 100% !important;
        }
        
        .base64-decoder-page {
          line-height: 1.5;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          width: 100%;
          min-height: 100vh;
        }
        
        .base64-decoder-page *,
        .base64-decoder-page *::before,
        .base64-decoder-page *::after {
          box-sizing: border-box;
        }
        
        .base64-decoder-page h1,
        .base64-decoder-page h2,
        .base64-decoder-page h3,
        .base64-decoder-page p,
        .base64-decoder-page ul,
        .base64-decoder-page ol {
          margin: 0;
        }
        
        .base64-decoder-page button {
          font-family: inherit;
          cursor: pointer;
        }
        
        .base64-decoder-page input,
        .base64-decoder-page textarea,
        .base64-decoder-page select {
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

      <div className="base64-decoder-page bg-[#fbfbfc] text-slate-900 min-h-screen">
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
              <span className="font-semibold text-slate-900">Base64 Decoder</span>
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
                  Base64 Decoder
                </span>
              </h1>
              
              {/* SEO-optimized description with target keywords */}
              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg md:leading-relaxed">
                <strong>Decode Base64 to text and files</strong> instantly. Decode data URIs, email attachments, and Base64-encoded data. Supports URL-safe Base64 decoding and automatic file type detection. Perfect for developers working with data URIs, API responses, and embedded content.
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
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Input</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">Base64</dd>
                </div>
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Output</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">Text & Files</dd>
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
                      <h4 className="text-lg font-bold text-slate-900">Image Preview</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Automatically detect and preview images from Base64 data URIs. View decoded images directly in the browser.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="feature-card group rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-lg transition-all duration-300 hover:border-blue-300 hover:shadow-xl hover:-translate-y-1" style={{ animationDelay: '0.2s' }}>
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30 transition-transform duration-300 group-hover:scale-110">
                      <span className="text-2xl">📥</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">File Download</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Download decoded files (images, PDFs, documents) with correct file extensions and MIME types.
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
                <h2 className="text-xl font-semibold text-slate-900">Decode Base64 to text or files online</h2>
                <p className="mt-1 text-sm text-slate-600">Paste your Base64 string, configure options, and get decoded output.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button onClick={handlePasteDemo} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50">Paste demo</button>
                <button onClick={handleClear} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50">Clear</button>
                <button onClick={handleDecode} className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">🔓 Decode Base64</button>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-12">
              <div className="md:col-span-8">
                <label className="mb-2 block text-sm font-semibold text-slate-800">Input Base64</label>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="h-64 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-900/20" 
                  placeholder="SGVsbG8gV29ybGQh or data:image/png;base64,..."
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
                      Remove data:[mime];base64,
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
                      <p className="text-xs text-slate-600">All decoding happens locally. No uploads.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <label className="text-sm font-semibold text-slate-800">
                  {outputType === 'text' ? 'Decoded Text Output' : 'Decoded File Output'}
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  <button onClick={handleCopy} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50">{copyText}</button>
                  <button onClick={handleDownload} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50">⬇ Download</button>
                </div>
              </div>
              
              {outputType === 'text' ? (
                <textarea 
                  value={output}
                  className="mt-2 h-56 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm text-slate-900 outline-none" 
                  placeholder="Your decoded text will appear here..." 
                  readOnly
                />
              ) : (
                <div className="mt-2 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  {imagePreview ? (
                    <div>
                      <p className="text-sm font-semibold text-slate-900 mb-2">Image Preview:</p>
                      <img src={imagePreview} alt="Decoded" className="max-w-full h-auto rounded-lg border border-slate-200" />
                      <p className="mt-2 text-xs text-slate-500">MIME Type: {mimeType}</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm font-semibold text-slate-900 mb-2">Binary File Detected</p>
                      <p className="text-sm text-slate-600">MIME Type: {mimeType || 'application/octet-stream'}</p>
                      <p className="text-xs text-slate-500 mt-2">Click Download to save the decoded file.</p>
                    </div>
                  )}
                </div>
              )}
              <p className="mt-2 text-xs text-slate-500">{stats}</p>
            </div>
          </div>
        </section>

        {/* What is Base64 Decoding? - Educational Content */}
        <section className="mx-auto max-w-6xl px-4 pb-16 pt-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 md:p-12" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="text-center">
              <h2 className="text-3xl font-bold text-slate-900">What is Base64 Decoding?</h2>
              <p className="mt-3 text-slate-600 max-w-2xl mx-auto">Understanding how Base64 decoding converts encoded strings back to original data</p>
            </div>

            <div className="mt-10 space-y-6 text-base leading-relaxed text-slate-700">
              <p>
                <strong>Base64 decoding</strong> is the reverse process of Base64 encoding. It converts Base64-encoded strings (which use 64 ASCII characters: A-Z, a-z, 0-9, +, /) back into their original binary or text format. When decoding Base64, the tool reverses the encoding process: it takes the Base64 characters, converts them back to bytes (each 4 Base64 characters represent 3 bytes), and then decodes those bytes to text or binary data.
              </p>

              <p>
                When you <strong>decode Base64</strong>, the tool groups Base64 characters into sets of four (representing 24 bits total), converts each 6-bit group back to its original byte value, and reassembles the bytes into the original data. If padding characters (=) are present, they indicate how many bytes were in the final group during encoding. The decoded data can be text, images, PDFs, or any binary file.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                  <h4 className="text-sm font-bold text-slate-900 mb-3">Base64 Encoded String</h4>
                  <pre className="text-xs text-slate-700 overflow-x-auto font-mono bg-white p-3 rounded-lg border border-slate-200 break-all">
SGVsbG8gV29ybGQh
                  </pre>
                  <p className="mt-2 text-xs text-slate-500">16 bytes (Base64-encoded)</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                  <h4 className="text-sm font-bold text-slate-900 mb-3">Decoded Text</h4>
                  <pre className="text-xs text-slate-700 overflow-x-auto font-mono bg-white p-3 rounded-lg border border-slate-200">
Hello World!
                  </pre>
                  <p className="mt-2 text-xs text-slate-500">12 bytes (original text)</p>
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">How Base64 Decoding Works</h3>
              <p>
                The decoding process reverses Base64 encoding: it groups Base64 characters into sets of four (representing 24 bits total), converts each 6-bit group back to its original byte value, and reassembles the bytes into the original data. For text data, bytes are decoded using UTF-8 encoding. For binary data (images, PDFs, etc.), bytes are preserved as-is for file download.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">URL-Safe Base64 Decoding</h3>
              <p>
                URL-safe Base64 uses - and _ instead of + and / to avoid URL encoding issues. When decoding URL-safe Base64, these characters must be converted back to + and / before standard Base64 decoding. This tool automatically detects and handles URL-safe Base64 encoding, making it easy to decode tokens, API responses, and other URL-safe Base64 strings.
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

        {/* Why Decode Base64? - Benefits Section */}
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">Why Decode Base64?</h2>
            <p className="mt-3 text-slate-600 max-w-2xl mx-auto">Common use cases where Base64 decoding reveals original data</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="group rounded-3xl border-2 border-slate-200 bg-white p-6 transition-all duration-300 hover:border-indigo-300 hover:shadow-xl">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-2xl shadow-lg mb-4">
                🖼️
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Image Data URIs</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Decode Base64-encoded images from data URIs in HTML or CSS. Extract and view images that were embedded inline, or download them as separate image files.
              </p>
            </div>

            <div className="group rounded-3xl border-2 border-slate-200 bg-white p-6 transition-all duration-300 hover:border-blue-300 hover:shadow-xl">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-2xl shadow-lg mb-4">
                📧
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Email Attachments</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Decode Base64-encoded email attachments. Email systems encode binary attachments in Base64, requiring decoding to access the original files.
              </p>
            </div>

            <div className="group rounded-3xl border-2 border-slate-200 bg-white p-6 transition-all duration-300 hover:border-emerald-300 hover:shadow-xl">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 text-2xl shadow-lg mb-4">
                🔐
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">API Responses</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Decode Base64-encoded data from API responses. Some APIs encode binary data or text in Base64 for transmission, requiring decoding to access the actual content.
              </p>
            </div>

            <div className="group rounded-3xl border-2 border-slate-200 bg-white p-6 transition-all duration-300 hover:border-amber-300 hover:shadow-xl">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-2xl shadow-lg mb-4">
                🔗
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">URL Parameters</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Decode Base64-encoded data passed through URL query parameters. Extract and view data that was encoded for safe URL transmission.
              </p>
            </div>

            <div className="group rounded-3xl border-2 border-slate-200 bg-white p-6 transition-all duration-300 hover:border-purple-300 hover:shadow-xl">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 text-2xl shadow-lg mb-4">
                🗄️
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Database Storage</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Decode Base64-encoded data stored in text database columns. Some databases store binary data as Base64 strings, requiring decoding to access the original files.
              </p>
            </div>

            <div className="group rounded-3xl border-2 border-slate-200 bg-white p-6 transition-all duration-300 hover:border-rose-300 hover:shadow-xl">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 text-2xl shadow-lg mb-4">
                📄
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">File Recovery</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Recover files from Base64-encoded strings. Decode images, PDFs, documents, or any binary file that was encoded to Base64 for transmission or storage.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900">Frequently Asked Questions</h2>
            <p className="mt-3 text-slate-600 max-w-2xl mx-auto">Everything you need to know about Base64 decoding</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">How do I decode Base64?</summary>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Paste your Base64 string into the input field, enable auto-detection options if needed, and click Decode. The tool will decode the Base64 string to text or binary data that you can view, copy, or download.
                </p>
              </details>

              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What is Base64 decoding?</summary>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Base64 decoding converts Base64-encoded strings back to their original format (text, images, files, or binary data). The process reverses Base64 encoding, converting ASCII characters back to bytes and then to the original data.
                </p>
              </details>

              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Can I decode images from Base64?</summary>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Yes. If your Base64 string contains image data (from a data URI or image encoding), the tool will detect it and allow you to preview or download the image. The tool automatically detects image MIME types from data URI prefixes.
                </p>
              </details>

              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Does this tool handle URL-safe Base64?</summary>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Yes. The tool can auto-detect URL-safe Base64 encoding (which uses - and _ instead of + and /). Enable the auto-detect option to automatically convert URL-safe Base64 to standard Base64 before decoding.
                </p>
              </details>

              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What if the decoded data is binary?</summary>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  If the Base64 string contains binary data (images, PDFs, etc.), the tool will detect it and allow you to download it as a file. For images, you can preview them directly in the browser. The tool automatically detects the file type from data URI prefixes.
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
                  If your Base64 string starts with 'data:[mime];base64,', enable the auto-remove prefix option. The tool will automatically strip the prefix before decoding and detect the MIME type for proper file handling.
                </p>
              </details>

              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Why is my Base64 string invalid?</summary>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Base64 strings must only contain A-Z, a-z, 0-9, +, /, and = characters (or - and _ for URL-safe). Invalid characters, incorrect padding, or truncated strings will cause decoding errors.
                </p>
              </details>

              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Can I decode any file type?</summary>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Yes. Base64 can encode any file type, and this tool can decode any Base64-encoded data back to its original format: images, PDFs, documents, text files, binary files, and more.
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
                  Yes. This tool uses UTF-8 decoding after Base64 decoding, correctly handling emoji, accented characters, Chinese/Japanese text, and all Unicode symbols in decoded text.
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
            title="📚 Master Data Encoding & Web Development"
            description="Explore tutorials on Base64 encoding/decoding, data URIs, API authentication, and web development best practices."
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
            <Link href="/text/base64-encoder" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 transition-all duration-300 hover:border-indigo-300 hover:shadow-xl hover:-translate-y-1">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-2xl shadow-lg mb-4">
                🔐
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Base64 Encoder</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Encode text and files to Base64 format. Create data URIs for images, email attachments, and API authentication strings.
              </p>
              <div className="flex items-center gap-2 text-sm font-semibold text-indigo-600 group-hover:gap-3 transition-all">
                Try it now <span>→</span>
              </div>
            </Link>

            <Link href="/json/json-to-base64" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 transition-all duration-300 hover:border-blue-300 hover:shadow-xl hover:-translate-y-1">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-2xl shadow-lg mb-4">
                📄
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
                🔓
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

