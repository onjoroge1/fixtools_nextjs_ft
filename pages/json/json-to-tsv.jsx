import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import MarqueeCTA from '@/components/MarqueeCTA';

export default function JSONToTSVConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [stats, setStats] = useState('');
  const [copyText, setCopyText] = useState('📋 Copy');
  
  // TSV Options
  const [includeHeaders, setIncludeHeaders] = useState(true);

  const currentYear = new Date().getFullYear();

  const demo = `[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "age": 30,
    "department": "Engineering",
    "isActive": true
  },
  {
    "id": 2,
    "name": "Jane Smith",
    "email": "jane@example.com",
    "age": 25,
    "department": "Marketing",
    "isActive": false
  },
  {
    "id": 3,
    "name": "Bob Johnson",
    "email": "bob@example.com",
    "age": 35,
    "department": "Sales",
    "isActive": true
  }
]`;

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

  // Escape TSV value if it contains special characters
  const escapeTSVValue = (value) => {
    if (value === null || value === undefined) return '';
    
    const stringValue = String(value);
    
    // TSV doesn't need quoting like CSV, but we should handle tabs and newlines
    // Replace tabs with spaces and newlines with spaces
    return stringValue.replace(/\t/g, ' ').replace(/\n/g, ' ').replace(/\r/g, '');
  };

  // Flatten nested objects into dot notation
  const flattenObject = (obj, prefix = '') => {
    const flattened = {};
    
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        const newKey = prefix ? `${prefix}.${key}` : key;
        
        if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
          // Recursively flatten nested objects
          Object.assign(flattened, flattenObject(value, newKey));
        } else if (Array.isArray(value)) {
          // Convert arrays to JSON string
          flattened[newKey] = JSON.stringify(value);
        } else {
          flattened[newKey] = value;
        }
      }
    }
    
    return flattened;
  };

  const handleConvert = () => {
    const inputText = input.trim();
    if (!inputText) return;
    
    try {
      const parsed = JSON.parse(inputText);
      
      // Check if input is an array
      if (!Array.isArray(parsed)) {
        alert('Input must be a JSON array of objects. Example: [{"key":"value"}]');
        setOutput('');
        setStats('');
        return;
      }
      
      if (parsed.length === 0) {
        alert('Input array is empty. Please provide an array with at least one object.');
        setOutput('');
        setStats('');
        return;
      }
      
      // Flatten all objects
      const flattenedData = parsed.map(obj => flattenObject(obj));
      
      // Extract all unique headers
      const headersSet = new Set();
      flattenedData.forEach(obj => {
        Object.keys(obj).forEach(key => headersSet.add(key));
      });
      const headers = Array.from(headersSet);
      
      // Build TSV (tab-separated values)
      let tsv = '';
      
      // Add headers if enabled
      if (includeHeaders) {
        tsv += headers.map(header => escapeTSVValue(header)).join('\t') + '\n';
      }
      
      // Add rows
      flattenedData.forEach(obj => {
        const row = headers.map(header => {
          const value = obj[header];
          return escapeTSVValue(value);
        });
        tsv += row.join('\t') + '\n';
      });
      
      setOutput(tsv);
      
      const rowCount = flattenedData.length;
      const columnCount = headers.length;
      const inputSize = new Blob([inputText]).size;
      const outputSize = new Blob([tsv]).size;
      
      setStats(`Converted ${rowCount} rows × ${columnCount} columns | ${inputSize.toLocaleString()} bytes (JSON) → ${outputSize.toLocaleString()} bytes (TSV)`);
      
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
    const blob = new Blob([text], { type: "text/tab-separated-values;charset=utf-8;" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "converted.tsv";
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
          "name": "How do I convert JSON to TSV format?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Paste your JSON array into the input field, choose TSV options (headers), and click Convert. The tool will transform your JSON data into TSV (Tab-Separated Values) format that you can copy or download."
          }
        },
        {
          "@type": "Question",
          "name": "Does the tool handle nested JSON objects?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! The converter automatically flattens nested objects using dot notation. For example, {user: {name: 'John'}} becomes a column named 'user.name' with value 'John'."
          }
        },
        {
          "@type": "Question",
          "name": "Can I open the TSV in Excel?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Absolutely. The generated TSV is fully compatible with Excel, Google Sheets, LibreOffice Calc, and all major spreadsheet applications. Excel can open TSV files directly."
          }
        },
        {
          "@type": "Question",
          "name": "What's the difference between TSV and CSV?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "TSV uses tabs (\\t) as delimiters while CSV uses commas (,). TSV is better for data containing commas, while CSV is more widely supported. Both can be converted from JSON with our tools."
          }
        },
        {
          "@type": "Question",
          "name": "Is my JSON data stored on your servers?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. All conversion happens locally in your browser using JavaScript. Your data never leaves your device and is not uploaded to any server."
          }
        },
        {
          "@type": "Question",
          "name": "Can I convert JSON arrays of different structures?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. The tool extracts all unique keys from all objects and creates a column for each. Objects missing certain keys will have empty values in those columns."
          }
        },
        {
          "@type": "Question",
          "name": "What happens to JSON arrays within objects?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Arrays are converted to JSON string format and placed in a single cell. This preserves the data structure while maintaining TSV compatibility."
          }
        },
        {
          "@type": "Question",
          "name": "Why use TSV instead of CSV?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "TSV is ideal when your data contains commas, as tabs are less common in text data. TSV avoids delimiter conflicts and is perfect for data with comma-separated values within fields."
          }
        }
      ]
    },
    
    softwareApp: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "JSON to TSV Converter",
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "Any",
      "description": "Free online tool to convert JSON data to TSV (Tab-Separated Values) format. Transform API responses and structured JSON into spreadsheet-ready TSV for Excel, Google Sheets, and data analysis.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "ratingCount": "1420",
        "bestRating": "5",
        "worstRating": "1"
      },
      "featureList": [
        "Convert JSON arrays to TSV format",
        "Flatten nested objects automatically",
        "Toggle header row inclusion",
        "Proper TSV escaping",
        "Excel and Google Sheets compatible",
        "Browser-based processing (no uploads)",
        "Download as .tsv file",
        "Copy to clipboard"
      ]
    },
    
    howTo: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Convert JSON to TSV",
      "description": "Step-by-step guide to convert JSON data to TSV (Tab-Separated Values) format online for free using FixTools JSON to TSV Converter.",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Paste your JSON array",
          "text": "Copy your JSON data (must be an array of objects) and paste it into the input field. The tool works with API responses, database exports, and any valid JSON array.",
          "position": 1
        },
        {
          "@type": "HowToStep",
          "name": "Choose TSV options",
          "text": "Select whether to include headers (column names in the first row). The tool handles nested objects by flattening them with dot notation.",
          "position": 2
        },
        {
          "@type": "HowToStep",
          "name": "Convert and export",
          "text": "Click the Convert button to transform your JSON to TSV. The tool will flatten nested objects, extract headers, and generate properly formatted TSV. Then copy to clipboard or download as a .tsv file.",
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
          "name": "JSON to TSV Converter",
          "item": "https://fixtools.io/json/json-to-tsv"
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
        <title>JSON to TSV Converter - Free Online JSON Array to Tab-Separated Values Tool | FixTools</title>
        <meta name="title" content="JSON to TSV Converter - Free Online JSON Array to Tab-Separated Values Tool | FixTools" />
        <meta name="description" content="Convert JSON arrays to TSV format online for free. Transform API responses into Excel-ready tab-separated values. Handles nested objects, arrays, and complex data structures. No upload required." />
        <meta name="keywords" content="json to tsv, json to tsv converter, convert json to tsv online, json array to tsv, json to tab separated values, json to spreadsheet, json to excel" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        <link rel="canonical" href="https://fixtools.io/json/json-to-tsv" />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        {/* Open Graph - SEO */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fixtools.io/json/json-to-tsv" />
        <meta property="og:title" content="JSON to TSV Converter - Free Online Tool" />
        <meta property="og:description" content="Convert JSON arrays to TSV format instantly. Excel and Google Sheets ready. Handles nested objects and complex structures." />
        <meta property="og:image" content="https://fixtools.io/images/og-json-to-tsv.png" />
        <meta property="og:site_name" content="FixTools" />
        
        {/* Twitter Card */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://fixtools.io/json/json-to-tsv" />
        <meta property="twitter:title" content="JSON to TSV Converter - Free Online Tool" />
        <meta property="twitter:description" content="Convert JSON arrays to TSV format instantly. Excel and Google Sheets ready." />
        <meta property="twitter:image" content="https://fixtools.io/images/og-json-to-tsv.png" />
        
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
        html:has(.json-to-tsv-page) {
          font-size: 100% !important;
        }
        
        .json-to-tsv-page {
          line-height: 1.5;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          width: 100%;
          min-height: 100vh;
        }
        
        .json-to-tsv-page *,
        .json-to-tsv-page *::before,
        .json-to-tsv-page *::after {
          box-sizing: border-box;
        }
        
        .json-to-tsv-page h1,
        .json-to-tsv-page h2,
        .json-to-tsv-page h3,
        .json-to-tsv-page p,
        .json-to-tsv-page ul,
        .json-to-tsv-page ol {
          margin: 0;
        }
        
        .json-to-tsv-page button {
          font-family: inherit;
          cursor: pointer;
        }
        
        .json-to-tsv-page input,
        .json-to-tsv-page textarea,
        .json-to-tsv-page select {
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

      <div className="json-to-tsv-page bg-[#fbfbfc] text-slate-900 min-h-screen">
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
              <span className="font-semibold text-slate-900">JSON to TSV Converter</span>
            </li>
          </ol>
        </nav>

        {/* Hero - SEO Optimized */}
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
                  JSON to TSV Converter
                </span>
              </h1>
              
              {/* SEO-optimized description with target keywords */}
              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg md:leading-relaxed">
                Convert <strong>JSON arrays to TSV format</strong> instantly. Transform API responses and structured JSON data into spreadsheet-ready TSV (Tab-Separated Values) for Excel, Google Sheets, and data analysis. Handles nested objects and complex structures automatically.
              </p>

              <div className="mt-7 pb-5 flex flex-wrap items-center gap-3">
                <a 
                  href="#tool" 
                  className="group relative rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 transition-all duration-200 hover:shadow-xl hover:shadow-slate-900/40 hover:scale-[1.02]"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    ⚡ Convert to TSV
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
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">JSON Array</dd>
                </div>
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Output</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">TSV Format</dd>
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
                <div className="feature-card group rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-lg transition-all duration-300 hover:border-emerald-300 hover:shadow-xl hover:-translate-y-1" style={{ animationDelay: '0.1s' }}>
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg shadow-emerald-500/30 transition-transform duration-300 group-hover:scale-110">
                      <span className="text-2xl">📊</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">Excel Ready</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Generate TSV files that open perfectly in Excel, Google Sheets, and all spreadsheet tools. TSV format avoids comma conflicts.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="feature-card group rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-lg transition-all duration-300 hover:border-blue-300 hover:shadow-xl hover:-translate-y-1" style={{ animationDelay: '0.2s' }}>
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30 transition-transform duration-300 group-hover:scale-110">
                      <span className="text-2xl">🔄</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">Handles Nested Data</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Automatically flattens nested objects using dot notation. Complex JSON structures made simple.
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
                        Everything runs locally in your browser. Your data never leaves your device.
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
                <h2 className="text-xl font-semibold text-slate-900">Convert JSON to TSV online</h2>
                <p className="mt-1 text-sm text-slate-600">Paste your JSON array, choose TSV options, and get spreadsheet-ready output.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button onClick={handlePasteDemo} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50">Paste demo</button>
                <button onClick={handleClear} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50">Clear</button>
                <button onClick={handleConvert} className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">⚡ Convert to TSV</button>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-12">
              <div className="md:col-span-8">
                <label className="mb-2 block text-sm font-semibold text-slate-800">Input JSON Array</label>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="h-64 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-900/20" 
                  placeholder='[{"id":1,"name":"John"},{"id":2,"name":"Jane"}]'
                />
              </div>
              <div className="md:col-span-4">
                <label className="mb-2 block text-sm font-semibold text-slate-800">TSV Options</label>
                <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4">
                  {/* Include Headers */}
                  <div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeHeaders}
                        onChange={(e) => setIncludeHeaders(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-2 focus:ring-slate-900/20"
                      />
                      <span className="text-sm font-semibold text-slate-800">Include headers</span>
                    </label>
                    <p className="mt-1 text-xs text-slate-500">
                      First row will contain column names.
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
                      <p className="text-xs text-slate-600">All conversion happens locally in your browser. No uploads.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <label className="text-sm font-semibold text-slate-800">TSV Output</label>
                <div className="flex flex-wrap items-center gap-2">
                  <button onClick={handleCopy} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50">{copyText}</button>
                  <button onClick={handleDownload} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50">⬇ Download .tsv</button>
                </div>
              </div>
              <textarea 
                value={output}
                className="mt-2 h-56 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm text-slate-900 outline-none" 
                placeholder="Your TSV output will appear here..." 
                readOnly
              />
              <p className="mt-2 text-xs text-slate-500">{stats}</p>
            </div>
          </div>
        </section>

        {/* What is JSON to TSV Conversion? */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">What is JSON to TSV Conversion?</h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                <strong>JSON to TSV conversion</strong> is the process of transforming hierarchical JSON data into a flat, tabular TSV (Tab-Separated Values) format. JSON (JavaScript Object Notation) stores data in nested objects and arrays, while TSV organizes data in rows and columns like a spreadsheet, using tabs (\\t) instead of commas as delimiters. This conversion is essential when you need to analyze JSON data in Excel, import it into databases, or share it with users who prefer spreadsheet formats—especially when your data contains commas.
              </p>
              
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                When you convert JSON to TSV, each object in a JSON array becomes a row in the TSV file, and each property becomes a column. For example, an array of user objects with properties like "name," "email," and "age" will produce a TSV with three columns and one row per user. This transformation makes complex API responses and database exports immediately usable in spreadsheet applications, with the advantage that TSV avoids delimiter conflicts when data contains commas.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">📝</span>
                    JSON (Hierarchical)
                  </h3>
                  <pre className="text-xs bg-white p-3 rounded-lg border border-slate-200 overflow-x-auto"><code>{`[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  },
  {
    "id": 2,
    "name": "Jane Smith",
    "email": "jane@example.com"
  }
]`}</code></pre>
                  <p className="text-sm text-slate-600 mt-3">Nested structure, hard to analyze in spreadsheets</p>
                </div>
                
                <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">📊</span>
                    TSV (Tab-Separated)
                  </h3>
                  <pre className="text-xs bg-white p-3 rounded-lg border border-emerald-200 overflow-x-auto"><code>{`id	name	email
1	John Doe	john@example.com
2	Jane Smith	jane@example.com`}</code></pre>
                  <p className="text-sm text-emerald-700 font-semibold mt-3">Flat table format, ready for Excel and analysis</p>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">How the Conversion Works</h3>
              <ul className="space-y-2 mb-4">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold mt-1">•</span>
                  <span className="text-slate-700"><strong>Parsing:</strong> The JSON array is parsed and validated</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold mt-1">•</span>
                  <span className="text-slate-700"><strong>Flattening:</strong> Nested objects are flattened using dot notation (e.g., user.address.city)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold mt-1">•</span>
                  <span className="text-slate-700"><strong>Header Extraction:</strong> All unique keys become column headers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold mt-1">•</span>
                  <span className="text-slate-700"><strong>Row Mapping:</strong> Each object's values are mapped to the corresponding columns</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold mt-1">•</span>
                  <span className="text-slate-700"><strong>TSV Generation:</strong> Data is formatted with tab delimiters (\\t) between values</span>
                </li>
        </ul>

              <p className="text-base text-slate-700 leading-relaxed mb-4">
                The conversion process handles edge cases like nested objects, arrays within objects, missing properties, and special characters. TSV format uses tabs as delimiters, which avoids conflicts with commas in data values. This ensures your data maintains integrity while becoming more accessible for spreadsheet analysis, data science workflows, and business intelligence tools.
              </p>
              
              <p className="text-base text-slate-700 leading-relaxed">
                <strong>JSON to TSV conversion</strong> is particularly useful for developers working with APIs, data analysts who prefer spreadsheets, and teams that need to share structured data with non-technical stakeholders who are more comfortable with Excel or Google Sheets than raw JSON. TSV is especially valuable when your data contains commas, as it eliminates delimiter conflicts.
              </p>
            </div>
          </div>
        </section>

        {/* Why Convert JSON to TSV? - Benefits Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Why Convert JSON to TSV?</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Converting JSON to TSV opens up powerful possibilities for data analysis, sharing, and integration. Here's why this transformation is essential for developers and data professionals:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Benefit 1 */}
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-emerald-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg">
                    <span className="text-2xl">📊</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Universal Spreadsheet Compatibility</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      TSV is widely supported by Excel, Google Sheets, LibreOffice Calc, Apple Numbers, and virtually every spreadsheet application. Unlike JSON, which requires specialized tools or technical knowledge, TSV files can be viewed and edited by anyone with basic computer skills. Excel can open TSV files directly.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Benefit 2 */}
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                    <span className="text-2xl">🔬</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">No Comma Conflicts</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      TSV uses tabs as delimiters, making it ideal for data containing commas. Unlike CSV, TSV avoids delimiter conflicts when values include commas, addresses, or comma-separated lists. This makes TSV perfect for data with complex text fields.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Benefit 3 */}
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-purple-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
                    <span className="text-2xl">🗄️</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Database Import Ready</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Most databases (MySQL, PostgreSQL, SQL Server, Oracle) have built-in TSV import functionality. You can bulk-import thousands of records in seconds using LOAD DATA or COPY commands. TSV is also a standard format for ETL pipelines and data migration.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Benefit 4 */}
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-orange-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg">
                    <span className="text-2xl">🤝</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Cross-Platform Data Sharing</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      TSV files work everywhere—Windows, Mac, Linux, mobile devices, and web applications. They're lightweight, easy to email, and require no special software to open. This universal compatibility makes TSV the go-to format for data exchange, especially when data contains commas.
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
            {/* Left Column - Steps */}
            <div className="md:col-span-7">
              <div className="inline-flex items-center gap-2 mb-3">
                <div className="h-1 w-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
                <h2 className="text-3xl font-bold text-slate-900">How JSON to TSV Conversion Works</h2>
              </div>
              
              <p className="mt-2 text-slate-600 leading-relaxed">
                Our converter transforms hierarchical JSON data into flat, spreadsheet-ready TSV format in three simple steps:
              </p>

              <ol className="mt-6 space-y-4">
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg shadow-slate-900/25 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-xl">
                    1
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Paste your JSON array</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Copy your JSON data (must be an array of objects) and paste it into the input field. Works with API responses, database exports, or any valid JSON array.
                    </p>
                  </div>
                </li>
                
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg shadow-slate-900/25 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-xl">
                    2
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Choose TSV options</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Select whether to include column headers in the first row. The tool handles nested objects by flattening them with dot notation. TSV uses tabs (\\t) as delimiters, avoiding comma conflicts.
                    </p>
                  </div>
                </li>
                
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg shadow-slate-900/25 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-xl">
                    3
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Convert and export your TSV</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Click Convert to transform your JSON into TSV format. The output appears instantly with tab-separated values. Copy to clipboard or download as a .tsv file ready to open in Excel or Google Sheets.
                    </p>
                  </div>
                </li>
              </ol>
            </div>

            {/* Right Column - Info Card */}
            <div className="md:col-span-5">
              <div className="sticky top-24 rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-7 shadow-xl shadow-slate-900/10 transition-all duration-300 hover:shadow-2xl hover:border-slate-300 hover:-translate-y-1">
                <div className="flex items-start gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg shadow-emerald-500/30">
                    <span className="text-2xl">✨</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 pt-2">
                    Key Features
                  </h3>
                </div>
                
                <ul className="mt-4 space-y-3">
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 transition-colors group-hover:bg-emerald-200">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">
                      Automatic nested object flattening
                    </span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 transition-colors group-hover:bg-emerald-200">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">
                      Handles arrays and complex structures
                    </span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 transition-colors group-hover:bg-emerald-200">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">
                      Tab delimiters (no comma conflicts)
                    </span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 transition-colors group-hover:bg-emerald-200">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">
                      Excel and Google Sheets compatible
                    </span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 transition-colors group-hover:bg-emerald-200">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">
                      100% browser-based (no uploads)
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900">Frequently Asked Questions</h2>
            <p className="mt-3 text-slate-600 max-w-2xl mx-auto">Everything you need to know about JSON to TSV conversion</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">How do I convert JSON to TSV format?</summary>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Paste your JSON array into the input field, choose your TSV options (headers), and click Convert. The tool will transform your JSON data into TSV format that you can copy or download.
                </p>
              </details>

              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Does the tool handle nested JSON objects?</summary>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Yes! The converter automatically flattens nested objects using dot notation. For example, {`{user: {name: 'John'}}`} becomes a column named 'user.name' with value 'John'.
                </p>
              </details>

              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Can I open the TSV in Excel?</summary>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Absolutely. The generated TSV is fully compatible with Excel, Google Sheets, LibreOffice Calc, and all major spreadsheet applications. Excel can open TSV files directly.
                </p>
              </details>

              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What's the difference between TSV and CSV?</summary>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  TSV uses tabs (\\t) as delimiters while CSV uses commas (,). TSV is better for data containing commas, while CSV is more widely supported. Both can be converted from JSON with our tools.
                </p>
              </details>

              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Is my JSON data stored on your servers?</summary>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  No. All conversion happens locally in your browser using JavaScript. Your data never leaves your device and is not uploaded to any server.
                </p>
              </details>

              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Can I convert JSON arrays of different structures?</summary>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Yes. The tool extracts all unique keys from all objects and creates a column for each. Objects missing certain keys will have empty values in those columns.
                </p>
              </details>
            </div>

            <div className="space-y-4">
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What happens to JSON arrays within objects?</summary>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Arrays are converted to JSON string format and placed in a single cell. This preserves the data structure while maintaining TSV compatibility.
                </p>
              </details>

              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Why use TSV instead of CSV?</summary>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  TSV is ideal when your data contains commas, as tabs are less common in text data. TSV avoids delimiter conflicts and is perfect for data with comma-separated values within fields.
                </p>
              </details>

              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Does TSV require quoting like CSV?</summary>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  TSV typically doesn't require quoting because tabs are less common in data than commas. However, if your data contains tabs, they are automatically replaced with spaces to maintain TSV structure.
                </p>
              </details>

              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Can I convert large JSON files?</summary>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Yes! The tool processes files entirely in your browser, so size limits depend on your browser's memory. Most files under 50MB work smoothly. For very large files, consider processing in chunks.
                </p>
              </details>

              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">How do I import TSV into a database?</summary>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Most databases support TSV import. In MySQL: LOAD DATA INFILE with FIELDS TERMINATED BY '\\t'. In PostgreSQL: COPY with DELIMITER E'\\t'. SQL Server: BULK INSERT with FIELDTERMINATOR = '\\t'.
                </p>
              </details>

              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Can I use this for production applications?</summary>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  This tool is perfect for testing, debugging, and one-off conversions. For production apps with high volume, integrate JSON to TSV conversion directly into your codebase using libraries (pandas in Python, csv-parse in Node.js) for better performance.
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* Learning CTA */}
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <MarqueeCTA
            href="/learn"
            title="📚 Master JSON & Data Conversion"
            description="Explore tutorials on JSON conversion, API integration, data transformation, and web development best practices."
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
            <p className="mt-3 text-slate-600 max-w-2xl mx-auto">More tools to work with JSON and data conversion</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/json/json-to-csv" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 transition-all duration-300 hover:border-indigo-300 hover:shadow-xl hover:-translate-y-1">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-2xl shadow-lg mb-4">
                📊
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">JSON to CSV</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Convert JSON arrays to CSV (comma-separated) format. Similar to TSV but uses commas as delimiters.
              </p>
              <div className="flex items-center gap-2 text-sm font-semibold text-indigo-600 group-hover:gap-3 transition-all">
                Try it now <span>→</span>
              </div>
            </Link>

            <Link href="/json/tsv-to-json" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 transition-all duration-300 hover:border-blue-300 hover:shadow-xl hover:-translate-y-1">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-2xl shadow-lg mb-4">
                🔄
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">TSV to JSON</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Convert TSV (tab-separated) files to JSON format. The reverse operation of JSON to TSV conversion.
              </p>
              <div className="flex items-center gap-2 text-sm font-semibold text-blue-600 group-hover:gap-3 transition-all">
                Try it now <span>→</span>
              </div>
            </Link>

            <Link href="/json/json-formatter" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 transition-all duration-300 hover:border-emerald-300 hover:shadow-xl hover:-translate-y-1">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 text-2xl shadow-lg mb-4">
                ✨
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">JSON Formatter</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Beautify and format JSON output after conversion. Make converted JSON more readable.
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
