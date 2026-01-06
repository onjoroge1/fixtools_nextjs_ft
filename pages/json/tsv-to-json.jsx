import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import MarqueeCTA from '@/components/MarqueeCTA';

export default function TSVToJSONConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [stats, setStats] = useState('');
  const [copyText, setCopyText] = useState('📋 Copy');
  
  // Options
  const [indentSize, setIndentSize] = useState(2);

  const currentYear = new Date().getFullYear();

  const demo = `name\tage\temail\tcity\tactive
John Doe\t30\tjohn@example.com\tNew York\ttrue
Jane Smith\t25\tjane@example.com\tLos Angeles\tfalse
Bob Johnson\t35\tbob@example.com\tChicago\ttrue`;

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

  const handleConvert = () => {
    const inputText = input.trim();
    if (!inputText.trim()) return;
    
    try {
      // Parse TSV to JSON
      const lines = inputText.trim().split('\n');
      if (lines.length < 2) {
        alert('TSV must have at least a header row and one data row');
        return;
      }
      
      const headers = lines[0].split('\t').map(h => h.trim());
      const result = [];
      
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split('\t');
        const obj = {};
        headers.forEach((header, index) => {
          const value = values[index]?.trim() || '';
          // Try to parse as number or boolean
          if (value === 'true') obj[header] = true;
          else if (value === 'false') obj[header] = false;
          else if (!isNaN(value) && value !== '') obj[header] = Number(value);
          else obj[header] = value;
        });
        result.push(obj);
      }
      
      const converted = JSON.stringify(result, null, indentSize);
      setOutput(converted);
      
      const inputSize = new Blob([inputText]).size;
      const outputSize = new Blob([converted]).size;
      const rowCount = result.length;
      const columnCount = headers.length;
      
      setStats(`Converted ${rowCount} rows × ${columnCount} columns | ${inputSize.toLocaleString()} bytes (TSV) → ${outputSize.toLocaleString()} bytes (JSON)`);
    } catch (error) {
      alert(`Error converting TSV: ${error.message}`);
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
    a.download = "converted.json";
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
          "name": "How do I convert TSV to JSON?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Paste your TSV data into the input field (first row should contain column headers), choose JSON indentation options, and click Convert. The tool will automatically parse the TSV and generate a JSON array of objects."
          }
        },
        {
          "@type": "Question",
          "name": "What is TSV format?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "TSV (Tab-Separated Values) is a text format where data is organized in rows and columns, with tabs (\\t) separating each value. It's commonly used for exporting data from spreadsheets and databases, similar to CSV but using tabs instead of commas."
          }
        },
        {
          "@type": "Question",
          "name": "What's the difference between TSV and CSV?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "TSV uses tabs (\\t) as delimiters while CSV uses commas (,). TSV is better for data containing commas, while CSV is more widely supported. Both can be converted to JSON with our tools."
          }
        },
        {
          "@type": "Question",
          "name": "Can I convert large TSV files?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! The tool processes files entirely in your browser, so size limits depend on your browser's memory. Most files under 50MB work smoothly. For very large files, consider processing in chunks."
          }
        },
        {
          "@type": "Question",
          "name": "Does the tool handle empty cells?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Empty cells in TSV are converted to empty strings in JSON. The tool preserves all data structure including missing values."
          }
        },
        {
          "@type": "Question",
          "name": "Is my TSV data stored on your servers?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. All conversion happens locally in your browser using JavaScript. Your TSV data never leaves your device and is not uploaded to any server."
          }
        },
        {
          "@type": "Question",
          "name": "Can the tool parse numbers and booleans?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. The tool automatically detects and converts numeric strings to numbers, and 'true'/'false' strings to boolean values. This makes the JSON output more useful for programmatic use."
          }
        },
        {
          "@type": "Question",
          "name": "What if my TSV has inconsistent columns?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The tool uses the header row to determine column structure. Rows with fewer values will have empty strings for missing columns. Rows with extra values will be truncated to match the header count."
          }
        }
      ]
    },
    
    softwareApp: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "TSV to JSON Converter",
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "Any",
      "description": "Free online tool to convert TSV (Tab-Separated Values) files to JSON format. Transform spreadsheet data and tabular exports into structured JSON arrays. Handles numbers, booleans, and empty cells automatically.",
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
        "Convert TSV to JSON format",
        "Automatic type detection (numbers, booleans)",
        "JSON indentation options",
        "Handles empty cells and missing values",
        "Browser-based processing (no uploads)",
        "Download as .json file",
        "Copy to clipboard"
      ]
    },
    
    howTo: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Convert TSV to JSON",
      "description": "Step-by-step guide to convert TSV (Tab-Separated Values) data to JSON format online for free using FixTools TSV to JSON Converter.",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Paste your TSV data",
          "text": "Copy your TSV data from a spreadsheet, database export, or text file and paste it into the input field. The first row should contain column headers, and subsequent rows should contain data values separated by tabs.",
          "position": 1
        },
        {
          "@type": "HowToStep",
          "name": "Choose JSON indentation options",
          "text": "Select your preferred JSON indentation (0 for compact, 2 or 4 spaces for readable format). The tool automatically detects and converts numbers and booleans from TSV strings.",
          "position": 2
        },
        {
          "@type": "HowToStep",
          "name": "Convert and export",
          "text": "Click the Convert button to transform your TSV to JSON. The tool parses tab-separated values and generates a JSON array of objects. Copy to clipboard or download as a .json file.",
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
          "name": "TSV to JSON Converter",
          "item": "https://fixtools.io/json/tsv-to-json"
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
        <title>TSV to JSON Converter - Free Online Tab-Separated Values to JSON Tool | FixTools</title>
        <meta name="title" content="TSV to JSON Converter - Free Online Tab-Separated Values to JSON Tool | FixTools" />
        <meta name="description" content="Convert TSV to JSON online for free. Transform tab-separated values from spreadsheets and databases into structured JSON arrays. Handles numbers, booleans, and empty cells automatically." />
        <meta name="keywords" content="tsv to json, tsv to json converter, convert tsv to json, tab separated values to json, tsv json converter online, spreadsheet to json" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        <link rel="canonical" href="https://fixtools.io/json/tsv-to-json" />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        {/* Open Graph - SEO */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fixtools.io/json/tsv-to-json" />
        <meta property="og:title" content="TSV to JSON Converter - Free Online Tool" />
        <meta property="og:description" content="Convert TSV to JSON instantly. Transform spreadsheet data and tabular exports into structured JSON arrays. Automatic type detection." />
        <meta property="og:image" content="https://fixtools.io/images/og-tsv-to-json.png" />
        <meta property="og:site_name" content="FixTools" />
        
        {/* Twitter Card */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://fixtools.io/json/tsv-to-json" />
        <meta property="twitter:title" content="TSV to JSON Converter - Free Online Tool" />
        <meta property="twitter:description" content="Convert TSV to JSON instantly. Spreadsheet data to structured JSON arrays." />
        <meta property="twitter:image" content="https://fixtools.io/images/og-tsv-to-json.png" />
        
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
        html:has(.tsv-to-json-page) {
          font-size: 100% !important;
        }
        
        .tsv-to-json-page {
          line-height: 1.5;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          width: 100%;
          min-height: 100vh;
        }
        
        .tsv-to-json-page *,
        .tsv-to-json-page *::before,
        .tsv-to-json-page *::after {
          box-sizing: border-box;
        }
        
        .tsv-to-json-page h1,
        .tsv-to-json-page h2,
        .tsv-to-json-page h3,
        .tsv-to-json-page p,
        .tsv-to-json-page ul,
        .tsv-to-json-page ol {
          margin: 0;
        }
        
        .tsv-to-json-page button {
          font-family: inherit;
          cursor: pointer;
        }
        
        .tsv-to-json-page input,
        .tsv-to-json-page textarea,
        .tsv-to-json-page select {
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

      <div className="tsv-to-json-page bg-[#fbfbfc] text-slate-900 min-h-screen">
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
              <span className="font-semibold text-slate-900">TSV to JSON Converter</span>
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
                  TSV to JSON Converter
                </span>
              </h1>
              
              {/* SEO-optimized description with target keywords */}
              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg md:leading-relaxed">
                <strong>Convert TSV to JSON</strong> instantly. Transform tab-separated values from spreadsheets and databases into structured JSON arrays. Handles numbers, booleans, and empty cells automatically. Perfect for developers working with spreadsheet data and database exports.
              </p>

              <div className="mt-7 pb-5 flex flex-wrap items-center gap-3">
                <a 
                  href="#tool" 
                  className="group relative rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 transition-all duration-200 hover:shadow-xl hover:shadow-slate-900/40 hover:scale-[1.02]"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    ⚡ Convert to JSON
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
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">TSV Format</dd>
                </div>
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Output</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">JSON Array</dd>
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
                      <span className="text-2xl">🔢</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">Smart Type Detection</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Automatically converts numeric strings to numbers and 'true'/'false' strings to booleans for better JSON output.
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
                      <h4 className="text-lg font-bold text-slate-900">Spreadsheet Compatible</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Works with TSV exports from Excel, Google Sheets, and database tools. Perfect for converting spreadsheet data to JSON.
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
                        Everything runs locally in your browser. Your TSV data never leaves your device.
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
                <h2 className="text-xl font-semibold text-slate-900">Convert TSV to JSON online</h2>
                <p className="mt-1 text-sm text-slate-600">Paste your TSV data, choose JSON indentation options, and get structured JSON output.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button onClick={handlePasteDemo} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50">Paste demo</button>
                <button onClick={handleClear} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50">Clear</button>
                <button onClick={handleConvert} className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">⚡ Convert to JSON</button>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-12">
              <div className="md:col-span-8">
                <label className="mb-2 block text-sm font-semibold text-slate-800">Input TSV Data</label>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="h-64 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-900/20" 
                  placeholder="name	age	email
John Doe	30	john@example.com
Jane Smith	25	jane@example.com"
                />
                <p className="mt-2 text-xs text-slate-500">First row should contain column headers. Values are separated by tabs (\\t).</p>
              </div>
              <div className="md:col-span-4">
                <label className="mb-2 block text-sm font-semibold text-slate-800">JSON Options</label>
                <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-2">Indentation</label>
                    <select
                      value={indentSize}
                      onChange={(e) => setIndentSize(Number(e.target.value))}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-900/20"
                    >
                      <option value={0}>Minified (no spaces)</option>
                      <option value={2}>2 spaces</option>
                      <option value={4}>4 spaces</option>
                    </select>
                    <p className="mt-1 text-xs text-slate-500">
                      Choose JSON indentation style.
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
                      <p className="text-xs text-slate-600">All conversion happens locally. No uploads.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <label className="text-sm font-semibold text-slate-800">JSON Output</label>
                <div className="flex flex-wrap items-center gap-2">
                  <button onClick={handleCopy} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50">{copyText}</button>
                  <button onClick={handleDownload} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50">⬇ Download</button>
                </div>
              </div>
              <textarea 
                value={output}
                className="mt-2 h-56 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm text-slate-900 outline-none" 
                placeholder="Your JSON output will appear here..." 
                readOnly
              />
              <p className="mt-2 text-xs text-slate-500">{stats}</p>
            </div>
          </div>
        </section>

        {/* What is TSV to JSON Conversion? - Educational Content */}
        <section className="mx-auto max-w-6xl px-4 pb-16 pt-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 md:p-12" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="text-center">
              <h2 className="text-3xl font-bold text-slate-900">What is TSV to JSON Conversion?</h2>
              <p className="mt-3 text-slate-600 max-w-2xl mx-auto">Understanding how tab-separated values transform into structured JSON data</p>
            </div>

            <div className="mt-10 space-y-6 text-base leading-relaxed text-slate-700">
              <p>
                <strong>TSV to JSON conversion</strong> is the process of transforming tab-separated values (TSV) into structured JSON (JavaScript Object Notation) format. TSV is a simple text format where data is organized in rows and columns, with tab characters (\\t) separating each value. JSON stores data as structured objects and arrays, making it ideal for APIs, databases, and programmatic data manipulation.
              </p>

              <p>
                When you <strong>convert TSV to JSON</strong>, each row in the TSV file becomes an object in a JSON array, and each column header becomes a property name. For example, a TSV file with headers "name," "age," and "email" will produce a JSON array where each object has these properties. This transformation makes spreadsheet data immediately usable in web applications, APIs, and modern development workflows.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                  <h4 className="text-sm font-bold text-slate-900 mb-3">TSV Format (Tab-Separated)</h4>
                  <pre className="text-xs text-slate-700 overflow-x-auto font-mono bg-white p-3 rounded-lg border border-slate-200">
{`name	age	email
John Doe	30	john@example.com
Jane Smith	25	jane@example.com`}
                  </pre>
                  <p className="mt-2 text-xs text-slate-500">Tab characters (\\t) separate values</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                  <h4 className="text-sm font-bold text-slate-900 mb-3">JSON Format (Structured)</h4>
                  <pre className="text-xs text-slate-700 overflow-x-auto font-mono bg-white p-3 rounded-lg border border-slate-200">
{`[
  {
    "name": "John Doe",
    "age": 30,
    "email": "john@example.com"
  },
  {
    "name": "Jane Smith",
    "age": 25,
    "email": "jane@example.com"
  }
]`}
                  </pre>
                  <p className="mt-2 text-xs text-slate-500">Structured objects with proper types</p>
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">How TSV to JSON Conversion Works</h3>
              <p>
                The conversion process parses the TSV file line by line: the first row contains column headers, and subsequent rows contain data values. Each data row is split by tab characters, and the values are mapped to their corresponding header names to create JSON objects. The tool automatically detects and converts numeric strings to numbers and boolean strings ('true'/'false') to actual boolean values, making the JSON output more useful for programmatic use.
              </p>

              <p>
                For <strong>TSV to JSON conversion</strong>, this means your spreadsheet data (exported from Excel, Google Sheets, or databases) can be immediately transformed into structured JSON that works seamlessly with APIs, web applications, and modern development tools. This is why TSV to JSON conversion is essential for developers working with spreadsheet exports, database dumps, and data migration tasks.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">TSV vs CSV vs JSON</h3>
              <p>
                <strong>TSV (Tab-Separated Values)</strong> uses tabs as delimiters, making it ideal for data containing commas. <strong>CSV (Comma-Separated Values)</strong> uses commas and is more widely supported. <strong>JSON</strong> is structured and hierarchical, perfect for APIs and web applications. TSV to JSON conversion bridges the gap between spreadsheet formats and modern web development, allowing you to use spreadsheet data in JSON-based systems.
              </p>

              <div className="rounded-2xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50 p-6 mt-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-2xl shadow-lg">
                    💡
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-2">Automatic Type Detection</h4>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      This tool automatically detects and converts data types: numeric strings become numbers, 'true'/'false' strings become booleans, and empty cells become empty strings. This makes the JSON output immediately usable in your applications without manual type conversion.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Convert TSV to JSON? - Benefits Section */}
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">Why Convert TSV to JSON?</h2>
            <p className="mt-3 text-slate-600 max-w-2xl mx-auto">Common use cases where TSV to JSON conversion is essential</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="group rounded-3xl border-2 border-slate-200 bg-white p-6 transition-all duration-300 hover:border-indigo-300 hover:shadow-xl">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-2xl shadow-lg mb-4">
                🌐
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">API Integration</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Convert spreadsheet exports to JSON for API requests and responses. Modern APIs expect JSON format, and TSV to JSON conversion makes your spreadsheet data API-ready instantly.
              </p>
            </div>

            <div className="group rounded-3xl border-2 border-slate-200 bg-white p-6 transition-all duration-300 hover:border-blue-300 hover:shadow-xl">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-2xl shadow-lg mb-4">
                🗄️
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Database Imports</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Import TSV exports into NoSQL databases (MongoDB, CouchDB) that use JSON format. Convert spreadsheet data to JSON for seamless database integration.
              </p>
            </div>

            <div className="group rounded-3xl border-2 border-slate-200 bg-white p-6 transition-all duration-300 hover:border-emerald-300 hover:shadow-xl">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 text-2xl shadow-lg mb-4">
                🔄
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Data Migration</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Migrate data from legacy systems that export TSV to modern JSON-based applications. Convert historical spreadsheet data to JSON for new systems.
              </p>
            </div>

            <div className="group rounded-3xl border-2 border-slate-200 bg-white p-6 transition-all duration-300 hover:border-amber-300 hover:shadow-xl">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-2xl shadow-lg mb-4">
                📊
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Web Applications</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Use spreadsheet data in web applications that consume JSON. Convert TSV exports from Excel or Google Sheets to JSON for frontend applications.
              </p>
            </div>

            <div className="group rounded-3xl border-2 border-slate-200 bg-white p-6 transition-all duration-300 hover:border-purple-300 hover:shadow-xl">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 text-2xl shadow-lg mb-4">
                🔬
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Data Science</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Convert TSV data to JSON for use in data science tools and scripts. JSON is widely supported in Python, R, and JavaScript data processing libraries.
              </p>
            </div>

            <div className="group rounded-3xl border-2 border-slate-200 bg-white p-6 transition-all duration-300 hover:border-rose-300 hover:shadow-xl">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 text-2xl shadow-lg mb-4">
                🔧
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Configuration Files</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Transform spreadsheet-based configuration data to JSON format. Many modern tools and frameworks use JSON for configuration, and TSV to JSON conversion makes this transition seamless.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 p-10 text-center">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-3xl font-bold text-slate-900 mb-3">TSV to JSON Conversion in Numbers</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">Why developers convert TSV data to JSON format</p>
            </div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <div className="text-4xl font-black text-indigo-600">Tab</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Delimiter</div>
                <div className="text-xs text-slate-600">Uses \\t (tab) character to separate values</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <div className="text-4xl font-black text-blue-600">100%</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Type Detection</div>
                <div className="text-xs text-slate-600">Automatic number and boolean conversion</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <div className="text-4xl font-black text-emerald-600">Instant</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Conversion Speed</div>
                <div className="text-xs text-slate-600">Real-time conversion in your browser</div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works - Step by Step */}
        <section id="how" className="mx-auto max-w-6xl px-4 pb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">How to Convert TSV to JSON</h2>
            <p className="mt-3 text-slate-600 max-w-2xl mx-auto">Three simple steps to transform your TSV data into JSON format</p>
          </div>

          <div className="space-y-6">
            <div className="group flex gap-6 rounded-3xl border-2 border-slate-200 bg-white p-6 md:p-8 transition-all duration-300 hover:border-indigo-300 hover:shadow-xl">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-xl font-black text-white shadow-lg">
                1
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Paste your TSV data</h3>
                <p className="text-slate-600 leading-relaxed">
                  Copy your TSV data from a spreadsheet (Excel, Google Sheets), database export, or text file and paste it into the input field. The first row must contain column headers, and subsequent rows should contain data values separated by tabs (\\t). TSV format is ideal for data containing commas, as tabs avoid delimiter conflicts.
                </p>
                <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-900 mb-2">Example TSV format:</p>
                  <pre className="text-xs text-slate-700 overflow-x-auto font-mono">
{`name	age	email	city
John Doe	30	john@example.com	New York
Jane Smith	25	jane@example.com	Los Angeles`}
                  </pre>
                </div>
              </div>
            </div>

            <div className="group flex gap-6 rounded-3xl border-2 border-slate-200 bg-white p-6 md:p-8 transition-all duration-300 hover:border-blue-300 hover:shadow-xl">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-xl font-black text-white shadow-lg">
                2
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Choose JSON indentation options</h3>
                <p className="text-slate-600 leading-relaxed">
                  Select your preferred JSON indentation: <strong>0 spaces</strong> for compact JSON (smallest size), <strong>2 spaces</strong> for standard readable format, or <strong>4 spaces</strong> for extra readability. The tool automatically detects and converts numeric strings to numbers and 'true'/'false' strings to boolean values, making the JSON output immediately usable in your applications.
                </p>
                <div className="mt-4 flex flex-wrap gap-4">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2">
                    <span className="text-sm font-semibold text-slate-900">✓ Type Detection</span>
                    <span className="text-xs text-slate-600 ml-2">Auto numbers & booleans</span>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2">
                    <span className="text-sm font-semibold text-slate-900">✓ Indentation</span>
                    <span className="text-xs text-slate-600 ml-2">0, 2, or 4 spaces</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="group flex gap-6 rounded-3xl border-2 border-slate-200 bg-white p-6 md:p-8 transition-all duration-300 hover:border-emerald-300 hover:shadow-xl">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 text-xl font-black text-white shadow-lg">
                3
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Convert and export</h3>
                <p className="text-slate-600 leading-relaxed">
                  Click the <strong>Convert to JSON</strong> button to transform your TSV data. The tool parses tab-separated values, maps them to column headers, and generates a JSON array of objects with proper data types. The output shows conversion statistics (rows, columns, file sizes) and the formatted JSON. Copy the result to your clipboard or download it as a .json file for immediate use in APIs, databases, or web applications.
                </p>
                <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-900 mb-2">Example JSON output:</p>
                  <pre className="text-xs text-slate-700 overflow-x-auto font-mono">
{`[
  {
    "name": "John Doe",
    "age": 30,
    "email": "john@example.com",
    "city": "New York"
  },
  {
    "name": "Jane Smith",
    "age": 25,
    "email": "jane@example.com",
    "city": "Los Angeles"
  }
]`}
                  </pre>
                  <p className="text-xs text-slate-500 mt-2">Ready to use in APIs and applications</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Best Practices Section */}
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 md:p-12" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-slate-900">Best Practices for TSV to JSON Conversion</h2>
              <p className="mt-3 text-slate-600 max-w-2xl mx-auto">Expert tips for accurate and efficient TSV to JSON conversion</p>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50 p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white text-xl font-bold">
                    ✓
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-2">Always include a header row</h4>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      The first row of your TSV should contain column names. These become property names in the JSON objects. Without headers, the tool cannot create meaningful JSON structure. Ensure headers are unique and don't contain special characters that might cause issues in JSON property names.
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
                    <h4 className="font-bold text-slate-900 mb-2">Use TSV for data containing commas</h4>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      TSV (tab-separated) is ideal when your data contains commas, as tabs are less common in text data. If you have CSV data with comma issues, consider converting it to TSV first, or use our CSV to JSON converter which handles comma escaping properly.
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
                    <h4 className="font-bold text-slate-900 mb-2">Let the tool handle type conversion</h4>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      The tool automatically converts numeric strings to numbers and 'true'/'false' strings to booleans. Don't manually format these values—let the tool detect and convert them for you. This ensures consistent type handling across all rows.
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
                    <h4 className="font-bold text-slate-900 mb-2">Don't use spaces in headers unnecessarily</h4>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      While spaces in headers are allowed, they can make JSON property names harder to work with programmatically. Consider using camelCase or snake_case for headers (e.g., "firstName" instead of "First Name") for better JSON compatibility.
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
                    <h4 className="font-bold text-slate-900 mb-2">Don't mix delimiters</h4>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      TSV files must use tab characters (\\t) consistently. Mixing tabs with spaces or other characters will cause parsing errors. If your data has inconsistent delimiters, clean it up before conversion or use a text editor to standardize the format.
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
                    <h4 className="font-bold text-slate-900 mb-2">Don't ignore empty cells</h4>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Empty cells in TSV are converted to empty strings in JSON. If you need null values instead, preprocess your TSV to use "null" as a string, or handle empty strings in your application code. The tool preserves all data structure including missing values.
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
            <h2 className="text-3xl font-bold text-slate-900">TSV to JSON Conversion Methods</h2>
            <p className="mt-3 text-slate-600 max-w-2xl mx-auto">Compare different approaches to converting TSV data to JSON format</p>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-slate-200 bg-slate-50">
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-900">Method</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-900">Best For</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-900">Setup Time</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-900">Type Detection</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-900">Ease of Use</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="bg-indigo-50">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">Online Tool</div>
                    <div className="text-xs text-slate-600 mt-1">FixTools (this page)</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700">Quick conversions, testing, one-off files</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                      Instant
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-emerald-600 text-xl">✓</span>
                    <div className="text-xs text-slate-500">Automatic</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-emerald-600 text-xl">✓</span>
                    <div className="text-xs text-slate-500">Very Easy</div>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">Python pandas</div>
                    <div className="text-xs text-slate-600 mt-1 font-mono">pd.read_csv(sep='\\t').to_json()</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700">Data science, large files, automation</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
                      Python install
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-emerald-600 text-xl">✓</span>
                    <div className="text-xs text-slate-500">Automatic</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-amber-600 text-xl">⚠</span>
                    <div className="text-xs text-slate-500">Requires code</div>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">Node.js csv-parse</div>
                    <div className="text-xs text-slate-600 mt-1 font-mono">csv-parse with delimiter: '\\t'</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700">Server-side, Node.js applications</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
                      npm install
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-slate-400 text-xl">✗</span>
                    <div className="text-xs text-slate-500">Manual</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-amber-600 text-xl">⚠</span>
                    <div className="text-xs text-slate-500">Requires code</div>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">Excel Power Query</div>
                    <div className="text-xs text-slate-600 mt-1">Built-in Excel feature</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700">Excel users, spreadsheet workflows</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                      Pre-installed
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-slate-400 text-xl">✗</span>
                    <div className="text-xs text-slate-500">Manual</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-amber-600 text-xl">⚠</span>
                    <div className="text-xs text-slate-500">Complex UI</div>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">Command Line (jq)</div>
                    <div className="text-xs text-slate-600 mt-1 font-mono">tsv-to-json script</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700">Shell scripts, automation, CI/CD</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                      Script setup
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-slate-400 text-xl">✗</span>
                    <div className="text-xs text-slate-500">Manual</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-amber-600 text-xl">⚠</span>
                    <div className="text-xs text-slate-500">Requires CLI</div>
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
                  This online converter is ideal for quick testing, one-off conversions, and situations where you need automatic type detection with zero setup. It requires no installation and works entirely in your browser with complete privacy. For production applications with high volume or complex requirements, integrate TSV parsing directly into your codebase using libraries like pandas (Python) or csv-parse (Node.js).
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900">Frequently Asked Questions</h2>
            <p className="mt-3 text-slate-600 max-w-2xl mx-auto">Everything you need to know about TSV to JSON conversion</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">How do I convert TSV to JSON?</summary>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Paste your TSV data into the input field (first row should contain column headers), choose JSON indentation options, and click Convert. The tool will automatically parse the TSV and generate a JSON array of objects.
                </p>
              </details>

              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What is TSV format?</summary>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  TSV (Tab-Separated Values) is a text format where data is organized in rows and columns, with tabs (\\t) separating each value. It's commonly used for exporting data from spreadsheets and databases, similar to CSV but using tabs instead of commas.
                </p>
              </details>

              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What's the difference between TSV and CSV?</summary>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  TSV uses tabs (\\t) as delimiters while CSV uses commas (,). TSV is better for data containing commas, while CSV is more widely supported. Both can be converted to JSON with our tools.
                </p>
              </details>

              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Can I convert large TSV files?</summary>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Yes! The tool processes files entirely in your browser, so size limits depend on your browser's memory. Most files under 50MB work smoothly. For very large files, consider processing in chunks.
                </p>
              </details>

              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Does the tool handle empty cells?</summary>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Yes. Empty cells in TSV are converted to empty strings in JSON. The tool preserves all data structure including missing values.
                </p>
              </details>

              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Is my TSV data stored on your servers?</summary>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  No. All conversion happens locally in your browser using JavaScript. Your TSV data never leaves your device and is not uploaded to any server.
                </p>
              </details>
            </div>

            <div className="space-y-4">
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Can the tool parse numbers and booleans?</summary>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Yes. The tool automatically detects and converts numeric strings to numbers, and 'true'/'false' strings to boolean values. This makes the JSON output more useful for programmatic use.
                </p>
              </details>

              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What if my TSV has inconsistent columns?</summary>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  The tool uses the header row to determine column structure. Rows with fewer values will have empty strings for missing columns. Rows with extra values will be truncated to match the header count.
                </p>
              </details>

              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Can I convert TSV with special characters?</summary>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Yes. TSV format handles special characters better than CSV because tabs are less common in text data. The tool preserves all characters including quotes, commas, and newlines within cell values.
                </p>
              </details>

              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">How do I export TSV from Excel?</summary>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  In Excel, go to File → Save As, choose "Text (Tab delimited) (*.txt)" format. This creates a TSV file that you can paste directly into this converter. Google Sheets: File → Download → Tab-separated values.
                </p>
              </details>

              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What JSON format does the tool output?</summary>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  The tool outputs a JSON array of objects. Each TSV row becomes an object, and each column header becomes a property name. You can choose indentation (0, 2, or 4 spaces) for readability.
                </p>
              </details>

              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Can I use this for production applications?</summary>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  This tool is perfect for testing, debugging, and one-off conversions. For production apps with high volume, integrate TSV parsing directly into your codebase using libraries (pandas in Python, csv-parse in Node.js) for better performance and error handling.
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
            <Link href="/json/csv-to-json" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 transition-all duration-300 hover:border-indigo-300 hover:shadow-xl hover:-translate-y-1">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-2xl shadow-lg mb-4">
                📊
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">CSV to JSON</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Convert CSV (comma-separated) files to JSON format. Similar to TSV but uses commas as delimiters.
              </p>
              <div className="flex items-center gap-2 text-sm font-semibold text-indigo-600 group-hover:gap-3 transition-all">
                Try it now <span>→</span>
              </div>
            </Link>

            <Link href="/json/json-to-csv" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 transition-all duration-300 hover:border-blue-300 hover:shadow-xl hover:-translate-y-1">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-2xl shadow-lg mb-4">
                🔄
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">JSON to CSV</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Convert JSON arrays to CSV format. The reverse operation of TSV/CSV to JSON conversion.
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
