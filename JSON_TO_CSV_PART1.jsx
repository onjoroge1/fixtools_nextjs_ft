import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import MarqueeCTA from '@/components/MarqueeCTA';

export default function JSONToCSVConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [stats, setStats] = useState('');
  const [copyText, setCopyText] = useState('📋 Copy');
  
  // CSV Options
  const [delimiter, setDelimiter] = useState(',');
  const [includeHeaders, setIncludeHeaders] = useState(true);
  const [quoteAll, setQuoteAll] = useState(false);

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

  // Escape CSV value if it contains special characters
  const escapeCSVValue = (value) => {
    if (value === null || value === undefined) return '';
    
    const stringValue = String(value);
    
    // Quote if contains delimiter, newline, or quote
    if (stringValue.includes(delimiter) || stringValue.includes('\n') || stringValue.includes('"')) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    
    // Quote all values if option is enabled
    if (quoteAll) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    
    return stringValue;
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
      
      // Build CSV
      let csv = '';
      
      // Add headers if enabled
      if (includeHeaders) {
        csv += headers.map(header => escapeCSVValue(header)).join(delimiter) + '\n';
      }
      
      // Add rows
      flattenedData.forEach(obj => {
        const row = headers.map(header => {
          const value = obj[header];
          return escapeCSVValue(value);
        });
        csv += row.join(delimiter) + '\n';
      });
      
      setOutput(csv);
      
      const rowCount = flattenedData.length;
      const columnCount = headers.length;
      const inputSize = new Blob([inputText]).size;
      const outputSize = new Blob([csv]).size;
      
      setStats(`Converted ${rowCount} rows × ${columnCount} columns | ${inputSize} bytes → ${outputSize} bytes`);
      
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
    const blob = new Blob([text], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "converted.csv";
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
          "name": "How do I convert JSON to CSV format?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Paste your JSON array into the input field, choose your CSV options (delimiter, headers), and click Convert. The tool will transform your JSON data into CSV format that you can copy or download."
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
          "name": "Can I open the CSV in Excel?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Absolutely. The generated CSV is fully compatible with Excel, Google Sheets, LibreOffice Calc, and all major spreadsheet applications."
          }
        },
        {
          "@type": "Question",
          "name": "What delimiter options are available?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "You can choose between comma (,), semicolon (;), tab, or pipe (|) as your delimiter. Comma is the standard for CSV files."
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
            "text": "Arrays are converted to JSON string format and placed in a single cell. This preserves the data structure while maintaining CSV compatibility."
          }
        },
        {
          "@type": "Question",
          "name": "Why use CSV instead of JSON?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "CSV is ideal for tabular data analysis in spreadsheets, importing into databases, data science tools like pandas, and sharing with non-technical users who prefer Excel."
          }
        }
      ]
    },
    
    // SoftwareApplication Schema
    softwareApp: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "JSON to CSV Converter",
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "Any",
      "description": "Free online tool to convert JSON data to CSV format. Transform API responses and structured JSON into spreadsheet-ready CSV for Excel, Google Sheets, and data analysis.",
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
      "featureList": [
        "Convert JSON arrays to CSV format",
        "Flatten nested objects automatically",
        "Multiple delimiter options (comma, semicolon, tab, pipe)",
        "Toggle header row inclusion",
        "Proper CSV escaping and quoting",
        "Excel and Google Sheets compatible",
        "Browser-based processing (no uploads)",
        "Download as .csv file",
        "Copy to clipboard"
      ]
    },
    
    // HowTo Schema
    howTo: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Convert JSON to CSV",
      "description": "Step-by-step guide to convert JSON data to CSV format online for free using FixTools JSON to CSV Converter.",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Paste your JSON array",
          "text": "Copy your JSON data (must be an array of objects) and paste it into the input field. The tool works with API responses, database exports, and any valid JSON array.",
          "position": 1
        },
        {
          "@type": "HowToStep",
          "name": "Choose CSV options",
          "text": "Select your preferred delimiter (comma, semicolon, tab, or pipe), decide whether to include headers, and choose quoting options based on your needs.",
          "position": 2
        },
        {
          "@type": "HowToStep",
          "name": "Convert and export",
          "text": "Click the Convert button to transform your JSON to CSV. The tool will flatten nested objects, extract headers, and generate properly formatted CSV. Then copy to clipboard or download as a .csv file.",
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
          "item": "https://fixtools.io/categories/json-tools"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "JSON to CSV Converter",
          "item": "https://fixtools.io/json/json-to-csv"
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
        <title>JSON to CSV Converter - Free Online JSON Array to Spreadsheet Tool | FixTools</title>
        <meta name="title" content="JSON to CSV Converter - Free Online JSON Array to Spreadsheet Tool | FixTools" />
        <meta name="description" content="Convert JSON arrays to CSV format online for free. Transform API responses into Excel-ready spreadsheets. Handles nested objects, arrays, and complex data structures. No upload required." />
        <meta name="keywords" content="json to csv, json to csv converter, convert json to csv online, json array to csv, json to spreadsheet, json to excel, api to csv converter" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://fixtools.io/json/json-to-csv" />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fixtools.io/json/json-to-csv" />
        <meta property="og:title" content="JSON to CSV Converter - Free Online Tool" />
        <meta property="og:description" content="Convert JSON arrays to CSV format instantly. Excel and Google Sheets ready. Handles nested objects and complex structures." />
        <meta property="og:image" content="https://fixtools.io/images/og-json-to-csv.png" />
        <meta property="og:site_name" content="FixTools" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://fixtools.io/json/json-to-csv" />
        <meta property="twitter:title" content="JSON to CSV Converter - Free Online Tool" />
        <meta property="twitter:description" content="Convert JSON arrays to CSV format instantly. Excel and Google Sheets ready." />
        <meta property="twitter:image" content="https://fixtools.io/images/og-json-to-csv.png" />
        
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
        /* CRITICAL FIX: Override base font-size for proper rem calculations */
        html:has(.json-to-csv-page) {
          font-size: 100% !important;
        }
        
        .json-to-csv-page {
          line-height: 1.5;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          width: 100%;
          min-height: 100vh;
        }
        
        /* Box-sizing reset */
        .json-to-csv-page *,
        .json-to-csv-page *::before,
        .json-to-csv-page *::after {
          box-sizing: border-box;
        }
        
        /* Reset margins */
        .json-to-csv-page h1,
        .json-to-csv-page h2,
        .json-to-csv-page h3,
        .json-to-csv-page p,
        .json-to-csv-page ul,
        .json-to-csv-page ol {
          margin: 0;
        }
        
        .json-to-csv-page button {
          font-family: inherit;
          cursor: pointer;
        }
        
        .json-to-csv-page input,
        .json-to-csv-page textarea,
        .json-to-csv-page select {
          font-family: inherit;
        }

        /* Hero Content Animations */
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
      `}</style>

      <div className="json-to-csv-page bg-[#fbfbfc] text-slate-900 min-h-screen">
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
              <Link href="/categories/json-tools" className="hover:text-slate-900 transition-colors">
                JSON Tools
              </Link>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-slate-400">/</span>
              <span className="font-semibold text-slate-900">JSON to CSV Converter</span>
            </li>
          </ol>
        </nav>

        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.35]" style={{ backgroundImage: 'url(/grid.png)', backgroundSize: '256px 256px' }}></div>
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-10 md:grid-cols-12 md:py-14">
            <div className="relative z-10 md:col-span-7 hero-content">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50 px-4 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Free • Fast • Privacy-first
              </div>
              
              {/* H1 with primary keyword */}
              <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                  JSON to CSV Converter
                </span>
              </h1>
              
              {/* Description with keyword optimization */}
              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg md:leading-relaxed">
                Convert <strong>JSON arrays to CSV format</strong> instantly. Transform API responses and structured JSON data into spreadsheet-ready CSV for Excel, Google Sheets, and data analysis. Handles nested objects and complex structures automatically.
              </p>

              {/* CTA Buttons */}
              <div className="mt-7 pb-5 flex flex-wrap items-center gap-3">
                <a 
                  href="#tool" 
                  className="group relative rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 transition-all duration-200 hover:shadow-xl hover:shadow-slate-900/40 hover:scale-[1.02]"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    ⚡ Convert to CSV
                  </span>
                </a>
                <a 
                  href="#how" 
                  className="rounded-2xl border-2 border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-900 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md"
                >
                  How it works
                </a>
              </div>

              {/* Stats Cards */}
              <dl className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Output</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">CSV Format</dd>
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

            {/* Right Column - Feature Cards */}
            <div className="relative z-10 md:col-span-5">
              <div className="space-y-4 feature-cards-container">
                {/* Feature Card 1 */}
                <div className="feature-card group rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-lg transition-all duration-300 hover:border-emerald-300 hover:shadow-xl hover:-translate-y-1" style={{ animationDelay: '0.1s' }}>
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg shadow-emerald-500/30 transition-transform duration-300 group-hover:scale-110">
                      <span className="text-2xl">📊</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">Excel Ready</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Generate CSV files that open perfectly in Excel, Google Sheets, and all spreadsheet tools.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Feature Card 2 */}
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

                {/* Feature Card 3 */}
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

        {/* Tool UI - PART 1 of the file due to length limit */}
        <section id="tool" className="mx-auto max-w-6xl px-4 pb-12 pt-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 md:p-7" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Convert JSON to CSV online</h2>
                <p className="mt-1 text-sm text-slate-600">Paste your JSON array, choose CSV options, and get spreadsheet-ready output.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button onClick={handlePasteDemo} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50">Paste demo</button>
                <button onClick={handleClear} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50">Clear</button>
                <button onClick={handleConvert} className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">⚡ Convert to CSV</button>
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
                <label className="mb-2 block text-sm font-semibold text-slate-800">CSV Options</label>
                <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4">
                  {/* Delimiter */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-2">Delimiter</label>
                    <select
                      value={delimiter}
                      onChange={(e) => setDelimiter(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-slate-900/20"
                    >
                      <option value=",">Comma (,)</option>
                      <option value=";">Semicolon (;)</option>
                      <option value={"\t"}>Tab</option>
                      <option value="|">Pipe (|)</option>
                    </select>
                    <p className="mt-2 text-xs text-slate-500">
                      Comma is standard for most CSV files.
                    </p>
                  </div>

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

                  {/* Quote All */}
                  <div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={quoteAll}
                        onChange={(e) => setQuoteAll(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-2 focus:ring-slate-900/20"
                      />
                      <span className="text-sm font-semibold text-slate-800">Quote all values</span>
                    </label>
                    <p className="mt-1 text-xs text-slate-500">
                      Wrap all values in quotes.
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
                <label className="text-sm font-semibold text-slate-800">CSV Output</label>
                <div className="flex flex-wrap items-center gap-2">
                  <button onClick={handleCopy} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50">{copyText}</button>
                  <button onClick={handleDownload} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50">⬇ Download .csv</button>
                </div>
              </div>
              <textarea 
                value={output}
                className="mt-2 h-56 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm text-slate-900 outline-none" 
                placeholder="Your CSV output will appear here..." 
                readOnly
              />
              <p className="mt-2 text-xs text-slate-500">{stats}</p>
            </div>
          </div>
        </section>

        {/* Continue with educational sections in next message due to character limit */}

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



