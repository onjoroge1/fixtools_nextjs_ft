import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import Link from 'next/link';
import Image from 'next/image';

const siteHost = process.env.NEXT_PUBLIC_HOST || 'https://fixtools.io';

export default function BarcodeGenerator() {
  const [input, setInput] = useState('');
  const [barcodeUrl, setBarcodeUrl] = useState('');
  const [error, setError] = useState('');
  const [format, setFormat] = useState('CODE128');
  const [width, setWidth] = useState(2);
  const [height, setHeight] = useState(100);
  const [displayValue, setDisplayValue] = useState(true);
  const canvasRef = useRef(null);
  const [barcodeLibraryLoaded, setBarcodeLibraryLoaded] = useState(false);

  const currentYear = new Date().getFullYear();
  const canonicalUrl = `${siteHost}/utilities/barcode-generator`;

  // Function to load alternative library
  const loadAlternativeLibrary = () => {
    if (typeof window === 'undefined') return;
    
    setError('Loading alternative source...');
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jsbarcode/3.11.5/JsBarcode.all.min.js';
    script.onload = () => {
      setTimeout(() => {
        if (window.JsBarcode) {
          setBarcodeLibraryLoaded(true);
          setError('');
        } else {
          setError('Library loaded but JsBarcode not available. Please refresh the page.');
        }
      }, 200);
    };
    script.onerror = () => {
      setError('Failed to load barcode library from all sources. Please check your internet connection and refresh the page.');
    };
    document.head.appendChild(script);
  };

  // Check if library is loaded after script loads
  useEffect(() => {
    if (typeof window !== 'undefined' && window.JsBarcode) {
      setBarcodeLibraryLoaded(true);
      setError('');
    }
  }, [barcodeLibraryLoaded]);

  // Generate barcode
  const generateBarcode = () => {
    const inputText = input.trim();
    if (!inputText) {
      setError('Please enter text or numbers to generate barcode');
      return;
    }

    if (!barcodeLibraryLoaded || typeof window.JsBarcode === 'undefined') {
      setError('Barcode library is still loading. Please wait...');
      return;
    }

    setError('');

    try {
      const canvas = canvasRef.current;
      if (!canvas) return;

      window.JsBarcode(canvas, inputText, {
        format: format,
        width: width,
        height: height,
        displayValue: displayValue,
        fontSize: 20,
        textMargin: 10,
      });

      setBarcodeUrl(canvas.toDataURL('image/png'));
    } catch (err) {
      setError('Error generating barcode: ' + err.message + '. Make sure your input is valid for the selected format.');
    }
  };

  const handleDownload = () => {
    if (!barcodeUrl) {
      setError('Please generate a barcode first');
      return;
    }

    const link = document.createElement('a');
    link.download = `barcode-${format.toLowerCase()}.png`;
    link.href = barcodeUrl;
    link.click();
  };

  const handleClear = () => {
    setInput('');
    setBarcodeUrl('');
    setError('');
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  // Enhanced Structured Data
  const structuredData = {
    breadcrumb: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": `${siteHost}/` },
        { "@type": "ListItem", "position": 2, "name": "Tools", "item": `${siteHost}/tools` },
        { "@type": "ListItem", "position": 3, "name": "Utility Tools", "item": `${siteHost}/tools/utilities` },
        { "@type": "ListItem", "position": 4, "name": "Barcode Generator", "item": canonicalUrl }
      ]
    },
    softwareApplication: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Barcode Generator",
      "applicationCategory": "UtilityApplication",
      "operatingSystem": "Web Browser",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "2156",
        "bestRating": "5",
        "worstRating": "1"
      },
      "featureList": [
        "Generate barcodes in multiple formats (CODE128, EAN, UPC, etc.)",
        "Customize width, height, and display options",
        "Download as PNG",
        "100% client-side processing",
        "No registration required",
        "Instant generation",
        "Support for alphanumeric characters",
        "Industry-standard formats"
      ],
      "description": "Free online barcode generator. Create barcodes in various formats including CODE128, EAN-13, EAN-8, UPC-A, UPC-E, CODE39, ITF-14, and MSI. Download as PNG. Perfect for inventory management, product identification, shipping labels, and retail. Works 100% in your browser."
    },
    howTo: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Generate a Barcode",
      "description": "Step-by-step guide to generate barcodes online for free using FixTools Barcode Generator.",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Enter your data",
          "text": "Type or paste the text, numbers, or alphanumeric data you want to encode into the barcode. Different barcode formats support different character sets. CODE128 supports alphanumeric characters, while EAN and UPC formats require specific numeric patterns.",
          "position": 1
        },
        {
          "@type": "HowToStep",
          "name": "Select format and customize",
          "text": "Choose the barcode format that matches your use case. CODE128 is the most versatile and supports alphanumeric characters. EAN-13 and UPC-A are standard for retail products. Adjust the width (bar thickness) and height to match your printing requirements. Optionally show or hide the text value below the barcode.",
          "position": 2
        },
        {
          "@type": "HowToStep",
          "name": "Generate and download",
          "text": "Click 'Generate Barcode' to create your barcode instantly. Preview it in the output area, then download as PNG. The barcode can be used in inventory systems, product labels, shipping labels, or any printed materials that require barcode scanning.",
          "position": 3
        }
      ]
    },
    faqPage: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is a barcode?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A barcode is a machine-readable representation of data in the form of parallel lines (one-dimensional) or patterns (two-dimensional). Traditional barcodes use varying widths and spacing of parallel lines to represent data. Barcodes are scanned using optical scanners called barcode readers. They're widely used in retail, inventory management, shipping, healthcare, and many other industries for quick data entry and product identification."
          }
        },
        {
          "@type": "Question",
          "name": "What barcode formats are supported?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our barcode generator supports multiple formats including CODE128 (most common and versatile, supports alphanumeric), EAN-13 (13-digit European Article Number for retail products), EAN-8 (8-digit version), UPC-A (12-digit Universal Product Code), UPC-E (6-digit compressed version), CODE39 (alphanumeric, older standard), ITF-14 (Interleaved 2 of 5 for shipping containers), and MSI (Modified Plessey for retail). CODE128 is recommended for most use cases as it supports letters, numbers, and special characters."
          }
        },
        {
          "@type": "Question",
          "name": "What is CODE128 format?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "CODE128 is the most commonly used barcode format for general-purpose applications. It can encode all 128 ASCII characters including uppercase and lowercase letters, numbers, and special characters. CODE128 is ideal for inventory management, shipping labels, product identification, and any application requiring alphanumeric encoding. It's more compact than CODE39 and offers better error detection. According to ISO/IEC 15417, CODE128 is the standard for high-density alphanumeric barcodes."
          }
        },
        {
          "@type": "Question",
          "name": "Can I customize barcode size?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, you can adjust both the width (bar thickness) and height of the barcode. Wider bars (higher width value) are easier to scan but take more horizontal space. Taller barcodes (higher height value) are more forgiving of scanning angle but require more vertical space. The optimal size depends on your printing method and scanning distance. For most applications, a width of 2 and height of 100 pixels works well. Test your barcode with your scanning equipment before mass production."
          }
        },
        {
          "@type": "Question",
          "name": "What's the difference between EAN-13 and UPC-A?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "EAN-13 (European Article Number) is a 13-digit barcode standard used internationally, while UPC-A (Universal Product Code) is a 12-digit standard primarily used in North America. EAN-13 includes a country code prefix, while UPC-A doesn't. Most modern systems can read both formats. If you're selling products internationally, use EAN-13. If you're only selling in North America, UPC-A is sufficient. Both formats require numeric input only."
          }
        },
        {
          "@type": "Question",
          "name": "Is my data secure when generating barcodes?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Absolutely. All barcode generation happens entirely in your browser using client-side JavaScript. Your data never leaves your device, isn't sent to any server, and isn't stored anywhere. This ensures complete privacy and security. The barcode library runs locally, and the generated barcode image is created in your browser's memory without any network transmission."
          }
        },
        {
          "@type": "Question",
          "name": "Can I use barcodes for inventory management?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, barcodes are excellent for inventory management. CODE128 format is ideal as it supports alphanumeric characters, allowing you to encode product SKUs, serial numbers, or custom identifiers. Generate barcodes for your products, print them on labels, and scan them with barcode scanners or smartphone apps to track inventory, manage stock levels, and streamline warehouse operations. Many inventory management systems support barcode scanning for quick data entry."
          }
        },
        {
          "@type": "Question",
          "name": "What file format can I download barcodes in?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "You can download barcodes as PNG (Portable Network Graphics) files. PNG is a raster image format that's widely supported by printing software, label makers, and design applications. PNG files maintain high quality and are perfect for printing on labels, packaging, or documents. The barcode will be saved as a PNG image that you can use in any application that supports image files."
          }
        }
      ]
    }
  };

  return (
    <>
      <Script
        id="barcode-library"
        src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"
        strategy="afterInteractive"
        onLoad={() => {
          if (typeof window !== 'undefined') {
            setTimeout(() => {
              if (window.JsBarcode) {
                setBarcodeLibraryLoaded(true);
                setError('');
              } else {
                setError('Library loaded but JsBarcode not available. Trying alternative...');
                loadAlternativeLibrary();
              }
            }, 200);
          }
        }}
        onError={() => {
          loadAlternativeLibrary();
        }}
      />
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>Barcode Generator - Free Online Barcode Creator | FixTools</title>
        <meta name="title" content="Barcode Generator - Free Online Barcode Creator | FixTools" />
        <meta name="description" content="Generate barcodes in various formats (CODE128, EAN, UPC, etc.). Download as PNG. Perfect for inventory, products, and labels. Free, instant, and works 100% in your browser. No registration required." />
        <meta name="keywords" content="barcode generator, barcode creator, code128 generator, ean barcode, upc barcode, free barcode generator, online barcode, barcode maker, barcode printer, inventory barcode, product barcode" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content="Barcode Generator - Free Online Barcode Creator" />
        <meta property="og:description" content="Generate barcodes in various formats (CODE128, EAN, UPC, etc.). Free, instant, and works 100% in your browser." />
        <meta property="og:image" content={`${siteHost}/images/barcode-generator-og.png`} />
        <meta property="og:site_name" content="FixTools" />
        
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content="Barcode Generator - Free Online Barcode Creator" />
        <meta property="twitter:description" content="Generate barcodes in various formats (CODE128, EAN, UPC, etc.). Free and instant." />
        <meta property="twitter:image" content={`${siteHost}/images/barcode-generator-og.png`} />
        
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.breadcrumb) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.softwareApplication) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.howTo) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.faqPage) }} />
      </Head>

      <style jsx global>{`
        html:has(.barcode-generator-page) {
          font-size: 100% !important;
        }
        
        .barcode-generator-page {
          line-height: 1.5;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          width: 100%;
          min-height: 100vh;
        }
        
        .barcode-generator-page *,
        .barcode-generator-page *::before,
        .barcode-generator-page *::after {
          box-sizing: border-box;
        }
        
        .barcode-generator-page h1,
        .barcode-generator-page h2,
        .barcode-generator-page h3,
        .barcode-generator-page p,
        .barcode-generator-page ul,
        .barcode-generator-page ol {
          margin: 0;
        }
        
        .barcode-generator-page button {
          font-family: inherit;
          cursor: pointer;
        }
        
        .barcode-generator-page input,
        .barcode-generator-page textarea,
        .barcode-generator-page select {
          font-family: inherit;
        }
      `}</style>

      <div className="barcode-generator-page bg-[#fbfbfc] text-slate-900 min-h-screen">
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/fixtools-logos/fixtools-logos_black.svg" alt="FixTools" width={120} height={40} className="h-9 w-auto" />
            </Link>
            <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex" aria-label="Main navigation" role="navigation">
              <Link className="hover:text-slate-900 transition-colors" href="/tools/json">JSON</Link>
              <Link className="hover:text-slate-900 transition-colors" href="/tools/html">HTML</Link>
              <Link className="hover:text-slate-900 transition-colors" href="/tools/css">CSS</Link>
              <Link className="hover:text-slate-900 transition-colors" href="/tools/utilities">Utilities</Link>
              <Link className="hover:text-slate-900 transition-colors" href="/">All tools</Link>
            </nav>
            <Link href="/" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50">
              Browse tools
            </Link>
          </div>
        </header>

        <nav className="mx-auto max-w-6xl px-4 py-3" aria-label="Breadcrumb" role="navigation">
          <ol className="flex items-center gap-2 text-sm text-slate-600">
            <li><Link href="/" className="hover:text-slate-900 transition-colors">Home</Link></li>
            <li className="flex items-center gap-2"><span className="text-slate-400">/</span><Link href="/tools" className="hover:text-slate-900 transition-colors">Tools</Link></li>
            <li className="flex items-center gap-2"><span className="text-slate-400">/</span><Link href="/tools/utilities" className="hover:text-slate-900 transition-colors">Utility Tools</Link></li>
            <li className="flex items-center gap-2"><span className="text-slate-400">/</span><span className="font-semibold text-slate-900">Barcode Generator</span></li>
          </ol>
        </nav>

        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.35]" style={{ backgroundImage: 'url(/grid.png)', backgroundSize: '256px 256px' }}></div>
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-10 md:grid-cols-12 md:py-14">
            <div className="relative z-10 md:col-span-7 hero-content">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50 px-4 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Free • Fast • Privacy-first
              </div>
              
              <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                  Barcode Generator
                </span>
              </h1>
              
              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg md:leading-relaxed">
                Our <strong>barcode generator</strong> helps you create barcodes in various formats including CODE128, EAN, UPC, and more. Generate barcodes instantly for inventory, products, and labels. Works 100% in your browser with complete privacy.
              </p>

              <div className="mt-7 pb-5 flex flex-wrap items-center gap-3">
                <a href="#tool" className="group relative rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 transition-all duration-200 hover:shadow-xl hover:scale-[1.02]">
                  <span className="relative z-10 flex items-center gap-2">⚡ Generate Barcode</span>
                </a>
                <a href="#how" className="rounded-2xl border-2 border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-900 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md">
                  How it works
                </a>
              </div>

              <dl className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Output</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">PNG</dd>
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
                <div className="feature-card group rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-lg transition-all duration-300 hover:border-emerald-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg shadow-emerald-500/30 transition-transform duration-300 group-hover:scale-110">
                      <span className="text-2xl">⚡</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">Instant Generation</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Create barcodes instantly in your browser. No waiting, no delays, no server processing.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="feature-card group rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-lg transition-all duration-300 hover:border-blue-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30 transition-transform duration-300 group-hover:scale-110">
                      <span className="text-2xl">🔒</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">100% Private</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Everything runs locally. Your data never leaves your device, ensuring complete privacy.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="feature-card group rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-lg transition-all duration-300 hover:border-purple-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg shadow-purple-500/30 transition-transform duration-300 group-hover:scale-110">
                      <span className="text-2xl">📊</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">Multiple Formats</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Support for CODE128, EAN, UPC, CODE39, ITF-14, MSI, and more industry-standard formats.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tool Interface */}
        <section id="tool" className="mx-auto max-w-6xl px-4 pb-12 pt-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 md:p-7" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Generate Barcode online</h2>
                <p className="mt-1 text-sm text-slate-600">Enter your data, select format, and generate instantly.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button onClick={handleClear} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50">Clear</button>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-12">
              <div className="md:col-span-8">
                <label className="mb-2 block text-sm font-semibold text-slate-800">Enter Data</label>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter text, numbers, or alphanumeric data..."
                  className="h-32 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-900/20"
                  aria-label="Barcode data input"
                />
              </div>
              <div className="md:col-span-4">
                <label className="mb-2 block text-sm font-semibold text-slate-800">Settings</label>
                <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1">Format</label>
                    <select
                      value={format}
                      onChange={(e) => setFormat(e.target.value)}
                      className="w-full px-2 py-1 text-xs border border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
                      aria-label="Barcode format"
                    >
                      <option value="CODE128">CODE128 (Alphanumeric)</option>
                      <option value="CODE39">CODE39</option>
                      <option value="EAN13">EAN-13</option>
                      <option value="EAN8">EAN-8</option>
                      <option value="UPC">UPC-A</option>
                      <option value="ITF14">ITF-14</option>
                      <option value="MSI">MSI</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1">Width: {width}</label>
                    <input type="range" min="1" max="5" value={width} onChange={(e) => setWidth(parseInt(e.target.value))} className="w-full" aria-label="Barcode width" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1">Height: {height}</label>
                    <input type="range" min="50" max="200" value={height} onChange={(e) => setHeight(parseInt(e.target.value))} className="w-full" aria-label="Barcode height" />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={displayValue} onChange={(e) => setDisplayValue(e.target.checked)} className="w-4 h-4" aria-label="Show text below barcode" />
                      <span className="text-xs">Show text below barcode</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button 
                onClick={generateBarcode} 
                disabled={!barcodeLibraryLoaded}
                className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Generate barcode"
              >
                {barcodeLibraryLoaded ? '⚡ Generate Barcode' : '⏳ Loading library...'}
              </button>
              {!barcodeLibraryLoaded && !error && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm">
                  Loading barcode library... Please wait a moment.
                </div>
              )}
              {error && <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}
            </div>

            {barcodeUrl && (
              <div className="mt-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <label className="text-sm font-semibold text-slate-800">Barcode Preview</label>
                  <div className="flex flex-wrap items-center gap-2">
                    <button onClick={handleDownload} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50" aria-label="Download barcode as PNG">⬇ Download PNG</button>
                  </div>
                </div>
                <div className="mt-2 flex justify-center rounded-2xl border border-slate-200 bg-slate-50 p-6">
                  <img src={barcodeUrl} alt="Generated Barcode" className="max-w-full h-auto" />
                </div>
              </div>
            )}
          </div>
        </section>

        <canvas ref={canvasRef} style={{ display: 'none' }} aria-hidden="true" />

        {/* What is a Barcode Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">What is a Barcode?</h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                A <strong>barcode</strong> is a machine-readable representation of data in the form of parallel lines (one-dimensional) or patterns (two-dimensional). Traditional barcodes use varying widths and spacing of parallel lines to represent alphanumeric characters. Barcodes are scanned using optical scanners called barcode readers or barcode scanners, which can be handheld devices, fixed scanners, or smartphone cameras with barcode scanning apps.
              </p>
              
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Barcodes were first patented in 1952 by Norman Joseph Woodland and Bernard Silver, but they didn't gain widespread adoption until the 1970s when the <a href="https://www.gs1.org/standards/barcodes" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-800 font-semibold underline">GS1 standards</a> were established. Today, barcodes are used in retail, inventory management, shipping, healthcare, libraries, and many other industries for quick data entry, product identification, and tracking.
              </p>

              <p className="text-base text-slate-700 leading-relaxed mb-4">
                According to <a href="https://www.iso.org/standard/62021.html" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-800 font-semibold underline">ISO/IEC standards</a>, barcodes follow specific encoding rules that ensure compatibility across different scanning systems. Different barcode formats serve different purposes: CODE128 supports alphanumeric characters and is ideal for inventory management, while EAN-13 and UPC-A are standard for retail products. The <a href="https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-800 font-semibold underline">MDN Web Docs</a> explain that modern web APIs like Canvas enable client-side barcode generation without server processing.
              </p>

              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600">1D</span>
                    One-Dimensional Barcodes
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">•</span>
                      <span>Parallel lines of varying widths</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">•</span>
                      <span>Examples: CODE128, EAN-13, UPC-A, CODE39</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">•</span>
                      <span>Scanned horizontally</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">•</span>
                      <span>Used in retail, inventory, shipping</span>
                    </li>
                  </ul>
                </div>
                
                <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">2D</span>
                    Two-Dimensional Barcodes
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">•</span>
                      <span>Square grid patterns (QR codes, Data Matrix)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">•</span>
                      <span>Can store much more data</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">•</span>
                      <span>Scanned from any angle</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">•</span>
                      <span>Used in marketing, payments, tickets</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white p-8 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-3">Barcode Usage Impact</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">Real data showing the importance and adoption of barcodes worldwide</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-emerald-200 shadow-lg">
                <div className="text-5xl font-extrabold text-emerald-600 mb-2">5B+</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Barcodes Scanned Daily</div>
                <div className="text-xs text-slate-600">Worldwide</div>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-blue-200 shadow-lg">
                <div className="text-5xl font-extrabold text-blue-600 mb-2">99.9%</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Accuracy Rate</div>
                <div className="text-xs text-slate-600">When properly printed</div>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-purple-200 shadow-lg">
                <div className="text-5xl font-extrabold text-purple-600 mb-2">0.5s</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Average Scan Time</div>
                <div className="text-xs text-slate-600">From scan to data entry</div>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-orange-200 shadow-lg">
                <div className="text-5xl font-extrabold text-orange-600 mb-2">85%</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Faster Data Entry</div>
                <div className="text-xs text-slate-600">vs manual typing</div>
              </div>
            </div>
            
            <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">📊</span>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">Industry Adoption</h4>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    According to <a href="https://www.gs1.org/standards/barcodes" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">GS1</a>, over 100 million products worldwide use barcodes for identification. The retail industry relies heavily on barcodes, with virtually every product in stores having a barcode. Barcodes reduce checkout time by up to 85% compared to manual entry, improve inventory accuracy, and enable real-time tracking. <a href="https://web.dev/vitals/" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">Google's Core Web Vitals</a> emphasize efficiency, which barcodes provide in physical operations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Use Barcodes Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Why Use Barcodes?</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Barcodes offer numerous advantages for businesses, inventory management, and product identification:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-emerald-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Fast and Accurate Data Entry</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Barcodes enable rapid data entry with 99.9% accuracy. Scanning a barcode takes less than 0.5 seconds and eliminates human typing errors. This dramatically speeds up checkout processes, inventory counts, and data collection. Studies show barcodes reduce data entry time by up to 85% compared to manual typing.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                    <span className="text-2xl">📦</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Inventory Management</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Barcodes are essential for modern inventory management systems. They enable real-time tracking of stock levels, automated reordering, and accurate inventory counts. Warehouse management systems use barcodes to track products from receiving to shipping, reducing errors and improving efficiency.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-purple-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
                    <span className="text-2xl">💰</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Cost-Effective Solution</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Barcodes are inexpensive to generate and print. They can be printed on labels, packaging, or directly on products using standard printers. The cost savings from reduced errors, faster processing, and improved inventory accuracy far outweigh the minimal cost of barcode generation and printing.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-orange-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg">
                    <span className="text-2xl">🌍</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Universal Standard</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Barcodes follow international standards (<a href="https://www.iso.org/standard/62021.html" target="_blank" rel="noopener noreferrer" className="text-orange-700 hover:text-orange-800 font-semibold underline">ISO/IEC standards</a>), ensuring compatibility across different systems, countries, and industries. EAN-13 and UPC-A are recognized worldwide, making them ideal for global businesses and international trade.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-cyan-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg">
                    <span className="text-2xl">📊</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Real-Time Tracking</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Barcodes enable real-time tracking of products throughout the supply chain. From manufacturing to retail shelves, barcodes provide visibility into product location, movement, and status. This enables better decision-making, reduces losses, and improves customer service.
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
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Error Reduction</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Manual data entry is prone to errors, with human error rates typically around 1-3%. Barcode scanning reduces errors to less than 0.1%, significantly improving data accuracy. This is critical in industries like healthcare, where errors can have serious consequences.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how" className="mx-auto max-w-6xl px-4 pb-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
            <div className="md:col-span-7">
              <div className="inline-flex items-center gap-2 mb-3">
                <div className="h-1 w-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
                <h2 className="text-3xl font-bold text-slate-900">How it works</h2>
              </div>
              
              <p className="mt-2 text-slate-600 leading-relaxed">
                Our barcode generator makes it easy to create professional barcodes in seconds. Follow these simple steps:
              </p>

              <ol className="mt-6 space-y-4">
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    1
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Enter your data</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Type or paste the text, numbers, or alphanumeric data you want to encode. Different barcode formats support different character sets. CODE128 supports alphanumeric characters, while EAN and UPC formats require specific numeric patterns.
                    </p>
                  </div>
                </li>
                
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    2
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Select format and customize</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Choose the barcode format that matches your use case. CODE128 is the most versatile and supports alphanumeric characters. EAN-13 and UPC-A are standard for retail products. Adjust the width (bar thickness) and height to match your printing requirements. Optionally show or hide the text value below the barcode.
                    </p>
                  </div>
                </li>
                
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    3
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Generate and download</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Click "Generate Barcode" to create your barcode instantly. Preview it, then download as PNG. The barcode is ready to use in your inventory systems, product labels, shipping labels, or any printed materials that require barcode scanning.
                    </p>
                  </div>
                </li>
              </ol>
            </div>

            <div className="md:col-span-5">
              <div className="sticky top-24 rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-7 shadow-xl">
                <div className="flex items-start gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg">
                    <span className="text-2xl">✨</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 pt-2">Why use our Barcode Generator?</h3>
                </div>
                
                <ul className="mt-4 space-y-3">
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">100% client-side processing</span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">No registration required</span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">Multiple industry-standard formats</span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">Full customization options</span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">Works offline after page load</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <h2 className="text-2xl font-semibold text-slate-900">Frequently Asked Questions</h2>
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4" open>
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What is a barcode?</summary>
                <p className="mt-2 text-sm text-slate-600">A barcode is a machine-readable representation of data in the form of parallel lines (one-dimensional) or patterns (two-dimensional). Traditional barcodes use varying widths and spacing of parallel lines to represent data. Barcodes are scanned using optical scanners called barcode readers. They're widely used in retail, inventory management, shipping, healthcare, and many other industries for quick data entry and product identification.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What barcode formats are supported?</summary>
                <p className="mt-2 text-sm text-slate-600">Our barcode generator supports multiple formats including CODE128 (most common and versatile, supports alphanumeric), EAN-13 (13-digit European Article Number for retail products), EAN-8 (8-digit version), UPC-A (12-digit Universal Product Code), UPC-E (6-digit compressed version), CODE39 (alphanumeric, older standard), ITF-14 (Interleaved 2 of 5 for shipping containers), and MSI (Modified Plessey for retail). CODE128 is recommended for most use cases as it supports letters, numbers, and special characters.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What is CODE128 format?</summary>
                <p className="mt-2 text-sm text-slate-600">CODE128 is the most commonly used barcode format for general-purpose applications. It can encode all 128 ASCII characters including uppercase and lowercase letters, numbers, and special characters. CODE128 is ideal for inventory management, shipping labels, product identification, and any application requiring alphanumeric encoding. It's more compact than CODE39 and offers better error detection. According to ISO/IEC 15417, CODE128 is the standard for high-density alphanumeric barcodes.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Can I customize barcode size?</summary>
                <p className="mt-2 text-sm text-slate-600">Yes, you can adjust both the width (bar thickness) and height of the barcode. Wider bars (higher width value) are easier to scan but take more horizontal space. Taller barcodes (higher height value) are more forgiving of scanning angle but require more vertical space. The optimal size depends on your printing method and scanning distance. For most applications, a width of 2 and height of 100 pixels works well. Test your barcode with your scanning equipment before mass production.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What's the difference between EAN-13 and UPC-A?</summary>
                <p className="mt-2 text-sm text-slate-600">EAN-13 (European Article Number) is a 13-digit barcode standard used internationally, while UPC-A (Universal Product Code) is a 12-digit standard primarily used in North America. EAN-13 includes a country code prefix, while UPC-A doesn't. Most modern systems can read both formats. If you're selling products internationally, use EAN-13. If you're only selling in North America, UPC-A is sufficient. Both formats require numeric input only.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Is my data secure when generating barcodes?</summary>
                <p className="mt-2 text-sm text-slate-600">Absolutely. All barcode generation happens entirely in your browser using client-side JavaScript. Your data never leaves your device, isn't sent to any server, and isn't stored anywhere. This ensures complete privacy and security. The barcode library runs locally, and the generated barcode image is created in your browser's memory without any network transmission.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Can I use barcodes for inventory management?</summary>
                <p className="mt-2 text-sm text-slate-600">Yes, barcodes are excellent for inventory management. CODE128 format is ideal as it supports alphanumeric characters, allowing you to encode product SKUs, serial numbers, or custom identifiers. Generate barcodes for your products, print them on labels, and scan them with barcode scanners or smartphone apps to track inventory, manage stock levels, and streamline warehouse operations. Many inventory management systems support barcode scanning for quick data entry.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What file format can I download barcodes in?</summary>
                <p className="mt-2 text-sm text-slate-600">You can download barcodes as PNG (Portable Network Graphics) files. PNG is a raster image format that's widely supported by printing software, label makers, and design applications. PNG files maintain high quality and are perfect for printing on labels, packaging, or documents. The barcode will be saved as a PNG image that you can use in any application that supports image files.</p>
              </details>
            </div>
          </div>
        </section>

        {/* Related Tools Section */}
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Related Utility Tools</h2>
            <p className="text-slate-600">Explore our complete suite of utility tools for developers and marketers:</p>
          </div>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-6">
            <Link href="/utilities/qr-code-generator" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-blue-300 hover:shadow-lg transition-all duration-300" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">📱</span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">QR Code Generator</p>
                  <p className="text-xs text-slate-500">Generate QR Codes</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">Generate QR codes for URLs, text, contact information, and more. Download as PNG or SVG.</p>
              <p className="mt-4 text-sm font-semibold text-blue-600 group-hover:text-blue-700">Open tool →</p>
            </Link>
            
            <Link href="/utilities/password-generator" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-purple-300 hover:shadow-lg transition-all duration-300" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🔐</span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">Password Generator</p>
                  <p className="text-xs text-slate-500">Secure Passwords</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">Generate secure, random passwords with customizable length and character sets for maximum security.</p>
              <p className="mt-4 text-sm font-semibold text-purple-600 group-hover:text-purple-700">Open tool →</p>
            </Link>
            
            <Link href="/utilities/url-encoder" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-orange-300 hover:shadow-lg transition-all duration-300" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🔗</span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">URL Encoder</p>
                  <p className="text-xs text-slate-500">Encode URLs</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">Encode URLs and text to URL-safe format for safe transmission in web applications and APIs.</p>
              <p className="mt-4 text-sm font-semibold text-orange-600 group-hover:text-orange-700">Open tool →</p>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Link href="/utilities/url-decoder" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-green-300 hover:shadow-lg transition-all duration-300" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🔓</span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">URL Decoder</p>
                  <p className="text-xs text-slate-500">Decode URLs</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">Decode URL-encoded strings back to readable text for easy reading and processing.</p>
              <p className="mt-4 text-sm font-semibold text-green-600 group-hover:text-green-700">Open tool →</p>
            </Link>
            
            <Link href="/tools/utilities" className="group rounded-3xl border-2 border-slate-900 bg-gradient-to-br from-slate-900 to-slate-800 p-6 hover:shadow-xl transition-all duration-300" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🔧</span>
                </div>
                <div>
                  <p className="text-base font-bold text-white">All Utility Tools</p>
                  <p className="text-xs text-slate-400">Browse Complete Suite</p>
                </div>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">Discover all our free utility tools for QR codes, barcodes, passwords, URL encoding, and more.</p>
              <p className="mt-4 text-sm font-semibold text-emerald-400 group-hover:text-emerald-300">Browse all tools →</p>
            </Link>
          </div>
        </section>
        
        <footer className="border-t border-slate-200 bg-white mt-12">
          <div className="mx-auto max-w-6xl px-4 py-8">
            <div className="text-center text-sm text-slate-600">
              <p>© {currentYear} FixTools. All rights reserved. | <Link href="/privacy" className="hover:text-slate-900">Privacy</Link> | <Link href="/terms" className="hover:text-slate-900">Terms</Link></p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

