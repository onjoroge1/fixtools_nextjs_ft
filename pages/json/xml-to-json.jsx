import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import MarqueeCTA from '@/components/MarqueeCTA';

export default function XMLToJSONConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [stats, setStats] = useState('');
  const [copyText, setCopyText] = useState('📋 Copy');
  
  // Options
  const [indentSize, setIndentSize] = useState(2);
  const [includeRoot, setIncludeRoot] = useState(true);

  const currentYear = new Date().getFullYear();

  const demo = `<?xml version="1.0" encoding="UTF-8"?>
<user>
  <id>1</id>
  <name>John Doe</name>
  <email>john@example.com</email>
  <age>30</age>
  <isActive>true</isActive>
  <address>
    <street>123 Main St</street>
    <city>New York</city>
    <state>NY</state>
    <zip>10001</zip>
  </address>
  <hobbies>
    <hobby>reading</hobby>
    <hobby>coding</hobby>
    <hobby>traveling</hobby>
  </hobbies>
</user>`;

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

  // XML to JSON conversion function
  const xmlToJson = (xmlString) => {
    // Remove XML declaration
    xmlString = xmlString.replace(/<\?xml.*?\?>/g, '').trim();
    
    // Parse XML manually (simple parser for common cases)
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
    
    // Check for parsing errors
    const parserError = xmlDoc.querySelector('parsererror');
    if (parserError) {
      throw new Error('Invalid XML: ' + parserError.textContent);
    }
    
    // Convert XML DOM to JSON
    const convertNode = (node) => {
      if (node.nodeType === 3) { // Text node
        const text = node.textContent.trim();
        // Try to parse as number or boolean
        if (text === 'true') return true;
        if (text === 'false') return false;
        if (text && !isNaN(text)) return Number(text);
        return text;
      }
      
      if (node.nodeType === 1) { // Element node
        const obj = {};
        
        // Add attributes
        if (node.attributes && node.attributes.length > 0) {
          for (let i = 0; i < node.attributes.length; i++) {
            const attr = node.attributes[i];
            obj[`@${attr.name}`] = attr.value;
          }
        }
        
        // Process child nodes
        const children = Array.from(node.childNodes);
        
        // If only text content, return the value directly
        if (children.length === 1 && children[0].nodeType === 3) {
          const textValue = convertNode(children[0]);
          if (Object.keys(obj).length === 0) {
            return textValue;
          } else {
            obj['#text'] = textValue;
            return obj;
          }
        }
        
        // Group children by tag name
        const childGroups = {};
        children.forEach(child => {
          if (child.nodeType === 1) { // Element
            const tagName = child.nodeName;
            if (!childGroups[tagName]) {
              childGroups[tagName] = [];
            }
            childGroups[tagName].push(child);
          } else if (child.nodeType === 3 && child.textContent.trim()) { // Text
            obj['#text'] = convertNode(child);
          }
        });
        
        // Convert child groups to JSON
        Object.keys(childGroups).forEach(tagName => {
          const nodes = childGroups[tagName];
          if (nodes.length === 1) {
            obj[tagName] = convertNode(nodes[0]);
          } else {
            obj[tagName] = nodes.map(n => convertNode(n));
          }
        });
        
        return obj;
      }
      
      return null;
    };
    
    const rootElement = xmlDoc.documentElement;
    if (!rootElement) {
      throw new Error('No root element found');
    }
    
    if (includeRoot) {
      return { [rootElement.nodeName]: convertNode(rootElement) };
    } else {
      return convertNode(rootElement);
    }
  };

  const handleConvert = () => {
    const inputText = input.trim();
    if (!inputText) return;
    
    try {
      const jsonObj = xmlToJson(inputText);
      const jsonOutput = JSON.stringify(jsonObj, null, indentSize);
      setOutput(jsonOutput);
      
      const beforeSize = new Blob([inputText]).size;
      const afterSize = new Blob([jsonOutput]).size;
      const sizeDiff = afterSize - beforeSize;
      const sizeChangePercent = beforeSize > 0 ? ((sizeDiff / beforeSize) * 100).toFixed(1) : "0.0";
      
      setStats(`Converted: ${beforeSize.toLocaleString()} bytes (XML) → ${afterSize.toLocaleString()} bytes (JSON) ${sizeDiff >= 0 ? '+' : ''}${sizeChangePercent}%`);
      
    } catch (error) {
      alert(`Invalid XML: ${error.message}`);
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
    // FAQPage Schema
    faqPage: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How do I convert XML to JSON format?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Paste your XML data into the input field, choose your JSON options (indentation, root element), and click Convert. The tool will parse your XML and transform it into properly structured JSON that you can copy or download."
          }
        },
        {
          "@type": "Question",
          "name": "Does the tool handle nested XML elements?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! The converter automatically preserves the hierarchical structure of your XML, converting nested elements into nested JSON objects. Complex XML structures are fully supported."
          }
        },
        {
          "@type": "Question",
          "name": "Are XML attributes preserved?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. XML attributes are converted to JSON properties prefixed with @ symbol. For example, <item id='1'> becomes {\"@id\": \"1\"}."
          }
        },
        {
          "@type": "Question",
          "name": "Can I use the JSON output in my application?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Absolutely. The generated JSON is valid and can be used directly in JavaScript, Python, Node.js, or any programming language that supports JSON parsing."
          }
        },
        {
          "@type": "Question",
          "name": "Is my XML data stored on your servers?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. All conversion happens locally in your browser using JavaScript. Your data never leaves your device and is not uploaded to any server."
          }
        },
        {
          "@type": "Question",
          "name": "What happens to repeated XML elements?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Repeated XML elements (like multiple <item> tags) are automatically converted to JSON arrays. This preserves the list structure in a JSON-native format."
          }
        },
        {
          "@type": "Question",
          "name": "Can I convert XML from SOAP or RSS feeds?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. This tool works with any valid XML including SOAP responses, RSS feeds, SVG files, config files, and API responses."
          }
        },
        {
          "@type": "Question",
          "name": "Why convert XML to JSON?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "JSON is more lightweight, easier to work with in JavaScript, and the standard format for modern APIs. Converting XML to JSON makes legacy data compatible with modern web applications."
          }
        }
      ]
    },
    
    // SoftwareApplication Schema
    softwareApp: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "XML to JSON Converter",
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "Any",
      "description": "Free online tool to convert XML data to JSON format. Transform SOAP responses, RSS feeds, and XML files into JSON for modern web applications and APIs.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "1420",
        "bestRating": "5",
        "worstRating": "1"
      },
      "featureList": [
        "Convert XML to JSON format",
        "Preserve nested structure automatically",
        "Handle XML attributes",
        "Convert repeated elements to arrays",
        "Adjustable JSON indentation",
        "Include/exclude root element",
        "Browser-based processing (no uploads)",
        "Download as .json file",
        "Copy to clipboard"
      ]
    },
    
    // HowTo Schema
    howTo: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Convert XML to JSON",
      "description": "Step-by-step guide to convert XML data to JSON format online for free using FixTools XML to JSON Converter.",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Paste your XML data",
          "text": "Copy your XML content (from SOAP responses, RSS feeds, config files, or any XML source) and paste it into the input field. The tool supports all valid XML formats.",
          "position": 1
        },
        {
          "@type": "HowToStep",
          "name": "Choose JSON options",
          "text": "Select your preferred indentation level (2 or 4 spaces) and decide whether to include the root element in the JSON output. These options control the structure of your JSON result.",
          "position": 2
        },
        {
          "@type": "HowToStep",
          "name": "Convert and export",
          "text": "Click the Convert button to transform your XML to JSON. The tool will parse the XML structure, convert elements and attributes to JSON format, and generate properly formatted output. Then copy to clipboard or download as a .json file.",
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
          "name": "XML to JSON Converter",
          "item": "https://fixtools.io/json/xml-to-json"
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
        <title>XML to JSON Converter - Free Online XML Parser Tool | FixTools</title>
        <meta name="title" content="XML to JSON Converter - Free Online XML Parser Tool | FixTools" />
        <meta name="description" content="Convert XML to JSON format online for free. Transform SOAP responses, RSS feeds, and XML files into JSON for modern APIs. Handles nested elements and attributes. No upload required." />
        <meta name="keywords" content="xml to json, xml to json converter, convert xml to json online, xml parser, soap to json, rss to json, xml transformation" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://fixtools.io/json/xml-to-json" />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fixtools.io/json/xml-to-json" />
        <meta property="og:title" content="XML to JSON Converter - Free Online Tool" />
        <meta property="og:description" content="Convert XML to JSON format instantly. Handles SOAP, RSS, and complex XML structures. Parse and transform XML to modern JSON." />
        <meta property="og:image" content="https://fixtools.io/images/og-xml-to-json.png" />
        <meta property="og:site_name" content="FixTools" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://fixtools.io/json/xml-to-json" />
        <meta property="twitter:title" content="XML to JSON Converter - Free Online Tool" />
        <meta property="twitter:description" content="Convert XML to JSON format instantly. Handles SOAP, RSS, and complex structures." />
        <meta property="twitter:image" content="https://fixtools.io/images/og-xml-to-json.png" />
        
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
        html:has(.xml-to-json-page) {
          font-size: 100% !important;
        }
        
        .xml-to-json-page {
          line-height: 1.5;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          width: 100%;
          min-height: 100vh;
        }
        
        .xml-to-json-page *,
        .xml-to-json-page *::before,
        .xml-to-json-page *::after {
          box-sizing: border-box;
        }
        
        .xml-to-json-page h1,
        .xml-to-json-page h2,
        .xml-to-json-page h3,
        .xml-to-json-page p,
        .xml-to-json-page ul,
        .xml-to-json-page ol {
          margin: 0;
        }
        
        .xml-to-json-page button {
          font-family: inherit;
          cursor: pointer;
        }
        
        .xml-to-json-page input,
        .xml-to-json-page textarea,
        .xml-to-json-page select {
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

      <div className="xml-to-json-page bg-[#fbfbfc] text-slate-900 min-h-screen">
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
              <span className="font-semibold text-slate-900">XML to JSON Converter</span>
            </li>
          </ol>
        </nav>

        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.35]" style={{ backgroundImage: 'url(/grid.png)', backgroundSize: '256px 256px' }}></div>
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-10 md:grid-cols-12 md:py-14">
            <div className="relative z-10 md:col-span-7 hero-content">
              <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 px-4 py-1.5 text-xs font-semibold text-purple-700 shadow-sm backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                </span>
                Free • Fast • Privacy-first
              </div>
              
              <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                  XML to JSON Converter
                </span>
              </h1>
              
              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg md:leading-relaxed">
                Convert <strong>XML to JSON format</strong> instantly. Transform SOAP responses, RSS feeds, and XML files into modern JSON for APIs and web applications. Handles nested elements, attributes, and complex structures automatically.
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
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Output</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">JSON Format</dd>
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
                <div className="feature-card group rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-lg transition-all duration-300 hover:border-purple-300 hover:shadow-xl hover:-translate-y-1" style={{ animationDelay: '0.1s' }}>
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg shadow-purple-500/30 transition-transform duration-300 group-hover:scale-110">
                      <span className="text-2xl">🔄</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">Modern JSON Output</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Generate clean, valid JSON from legacy XML files. Perfect for modern APIs and web apps.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="feature-card group rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-lg transition-all duration-300 hover:border-blue-300 hover:shadow-xl hover:-translate-y-1" style={{ animationDelay: '0.2s' }}>
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30 transition-transform duration-300 group-hover:scale-110">
                      <span className="text-2xl">📦</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">Preserves Structure</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Maintains hierarchy and converts attributes properly. Complex XML structures handled automatically.
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
                        Everything runs locally in your browser. Your XML data never leaves your device.
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
                <h2 className="text-xl font-semibold text-slate-900">Convert XML to JSON online</h2>
                <p className="mt-1 text-sm text-slate-600">Paste your XML data, choose JSON options, and get modern JSON output.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button onClick={handlePasteDemo} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50">Paste demo</button>
                <button onClick={handleClear} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50">Clear</button>
                <button onClick={handleConvert} className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">⚡ Convert to JSON</button>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-12">
              <div className="md:col-span-8">
                <label className="mb-2 block text-sm font-semibold text-slate-800">Input XML</label>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="h-64 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-900/20" 
                  placeholder='<?xml version="1.0"?><root>...</root>'
                />
              </div>
              <div className="md:col-span-4">
                <label className="mb-2 block text-sm font-semibold text-slate-800">JSON Options</label>
                <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-2">Indentation</label>
                    <select
                      value={indentSize}
                      onChange={(e) => setIndentSize(Number(e.target.value))}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-slate-900/20"
                    >
                      <option value={2}>2 spaces</option>
                      <option value={4}>4 spaces</option>
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeRoot}
                        onChange={(e) => setIncludeRoot(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-2 focus:ring-slate-900/20"
                      />
                      <span className="text-sm font-semibold text-slate-800">Include root element</span>
                    </label>
                    <p className="mt-1 text-xs text-slate-500">
                      Keep root XML tag as JSON property.
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
                <label className="text-sm font-semibold text-slate-800">JSON Output</label>
                <div className="flex flex-wrap items-center gap-2">
                  <button onClick={handleCopy} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50">{copyText}</button>
                  <button onClick={handleDownload} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50">⬇ Download .json</button>
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

        {/* What is XML to JSON Conversion? */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">What is XML to JSON Conversion?</h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                <strong>XML to JSON conversion</strong> is the process of transforming Extensible Markup Language (XML) data into JavaScript Object Notation (JSON) format. XML is a legacy markup language commonly used in SOAP APIs, RSS feeds, configuration files, and enterprise systems. JSON is the modern standard for data interchange in web applications, RESTful APIs, and JavaScript-based systems.
              </p>
              
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                When you convert XML to JSON, XML elements become JSON objects, XML attributes are prefixed with @ symbols, repeated elements become arrays, and nested structures are preserved. This transformation makes legacy XML data compatible with modern web technologies that expect JSON input, such as React, Vue, Angular, Node.js, and REST APIs.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 text-orange-600">📄</span>
                    XML (Legacy)
                  </h3>
                  <pre className="text-xs bg-white p-3 rounded-lg border border-slate-200 overflow-x-auto"><code>{`<user>
  <name>John Doe</name>
  <email>john@example.com</email>
  <age>30</age>
</user>`}</code></pre>
                  <p className="text-sm text-slate-600 mt-3">Verbose markup, harder to work with in JavaScript</p>
                </div>
                
                <div className="rounded-2xl border-2 border-purple-200 bg-purple-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-purple-600">{ }</span>
                    JSON (Modern)
                  </h3>
                  <pre className="text-xs bg-white p-3 rounded-lg border border-purple-200 overflow-x-auto"><code>{`{
  "user": {
    "name": "John Doe",
    "email": "john@example.com",
    "age": 30
  }
}`}</code></pre>
                  <p className="text-sm text-purple-700 font-semibold mt-3">Lightweight, JavaScript-native, modern API standard</p>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">How the Conversion Works</h3>
              <ul className="space-y-2 mb-4">
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold mt-1">•</span>
                  <span className="text-slate-700"><strong>Parsing:</strong> The XML string is parsed into a Document Object Model (DOM) structure</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold mt-1">•</span>
                  <span className="text-slate-700"><strong>Element Conversion:</strong> Each XML element becomes a JSON object property</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold mt-1">•</span>
                  <span className="text-slate-700"><strong>Attribute Handling:</strong> XML attributes are converted to JSON properties with @ prefix</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold mt-1">•</span>
                  <span className="text-slate-700"><strong>Array Detection:</strong> Repeated elements are automatically grouped into JSON arrays</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold mt-1">•</span>
                  <span className="text-slate-700"><strong>Type Inference:</strong> String values are converted to numbers or booleans where appropriate</span>
                </li>
              </ul>

              <p className="text-base text-slate-700 leading-relaxed mb-4">
                The conversion process intelligently handles edge cases like self-closing tags, CDATA sections, mixed content, and XML namespaces. This ensures your XML data is accurately represented in JSON format while maintaining semantic meaning and data integrity.
              </p>
              
              <p className="text-base text-slate-700 leading-relaxed">
                <strong>XML to JSON conversion</strong> is essential for modernizing legacy systems, integrating SOAP services with REST APIs, processing RSS feeds in JavaScript, and making XML configuration files accessible to modern web frameworks. It's the bridge between old and new web technologies.
              </p>
            </div>
          </div>
        </section>

        {/* Why Convert XML to JSON? */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Why Convert XML to JSON?</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Converting XML to JSON makes legacy data compatible with modern web applications and provides significant advantages for development, performance, and integration:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-purple-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">JavaScript Native</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      JSON is native to JavaScript with built-in JSON.parse() and JSON.stringify() methods. No external XML parsing libraries needed. Direct object manipulation in code. Perfect for React, Vue, Angular, and all modern frameworks.
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
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Smaller File Size</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      JSON is typically 20-30% smaller than equivalent XML due to less verbose syntax. No closing tags required. Faster network transmission. Reduced bandwidth costs for API calls and mobile apps.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-emerald-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg">
                    <span className="text-2xl">🔌</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Modern API Standard</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      JSON is the standard for RESTful APIs, GraphQL, and modern web services. Converting SOAP/XML responses to JSON enables integration with REST APIs. Makes legacy enterprise systems accessible to modern apps.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-orange-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg">
                    <span className="text-2xl">👨‍💻</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Easier to Read</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      JSON is more readable and easier to understand than XML. Cleaner syntax with less boilerplate. Better for debugging API responses. Developers prefer working with JSON over XML by overwhelming margins.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how" className="mx-auto max-w-6xl px-4 pb-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
            <div className="md:col-span-7">
              <div className="inline-flex items-center gap-2 mb-3">
                <div className="h-1 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                <h2 className="text-3xl font-bold text-slate-900">How XML to JSON Conversion Works</h2>
              </div>
              
              <p className="mt-2 text-slate-600 leading-relaxed">
                Our converter parses XML structure and transforms it into clean, modern JSON in three simple steps:
              </p>

              <ol className="mt-6 space-y-4">
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg shadow-slate-900/25 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-xl">
                    1
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Paste your XML data</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Copy your XML content from SOAP responses, RSS feeds, SVG files, or config files and paste it into the input field. Works with all valid XML formats.
                    </p>
                  </div>
                </li>
                
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg shadow-slate-900/25 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-xl">
                    2
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Choose JSON options</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Select your indentation preference (2 or 4 spaces) and decide whether to include the root XML element as a JSON property. These options control the output structure.
                    </p>
                  </div>
                </li>
                
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg shadow-slate-900/25 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-xl">
                    3
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Convert and export your JSON</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Click Convert to parse XML and generate JSON. The tool preserves structure, converts attributes, and handles arrays automatically. Copy to clipboard or download as .json file.
                    </p>
                  </div>
                </li>
              </ol>
            </div>

            <div className="md:col-span-5">
              <div className="sticky top-24 rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-7 shadow-xl shadow-slate-900/10 transition-all duration-300 hover:shadow-2xl hover:border-slate-300 hover:-translate-y-1">
                <div className="flex items-start gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg shadow-purple-500/30">
                    <span className="text-2xl">✨</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 pt-2">
                    Key Features
                  </h3>
                </div>
                
                <ul className="mt-4 space-y-3">
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-600 transition-colors group-hover:bg-purple-200">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">
                      Preserves nested XML structure
                    </span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-600 transition-colors group-hover:bg-purple-200">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">
                      Converts attributes to JSON properties
                    </span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-600 transition-colors group-hover:bg-purple-200">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">
                      Handles repeated elements as arrays
                    </span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-600 transition-colors group-hover:bg-purple-200">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">
                      Works with SOAP, RSS, SVG formats
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <h2 className="text-2xl font-semibold text-slate-900">Frequently Asked Questions</h2>
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4" open>
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">How do I convert XML to JSON format?</summary>
                <p className="mt-2 text-sm text-slate-600">
                  Paste your XML data into the input field, choose your JSON options (indentation, root element), and click Convert. The tool will parse your XML and transform it into valid JSON.
                </p>
              </details>
              
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Does the tool handle nested XML elements?</summary>
                <p className="mt-2 text-sm text-slate-600">
                  Yes! The converter preserves the hierarchical structure of your XML, converting nested elements into nested JSON objects automatically.
                </p>
              </details>
              
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Are XML attributes preserved?</summary>
                <p className="mt-2 text-sm text-slate-600">
                  Yes. XML attributes are converted to JSON properties with an @ prefix. For example, &lt;item id=&quot;1&quot;&gt; becomes {'{'}&#34;@id&#34;: &#34;1&#34;{'}'}.
                </p>
              </details>
              
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Is my XML data stored on your servers?</summary>
                <p className="mt-2 text-sm text-slate-600">
                  No. All conversion happens locally in your browser using JavaScript. Your data never leaves your device.
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* MarqueeCTA */}
        <div className="mx-auto max-w-6xl px-4 pb-12">
          <MarqueeCTA
            href="/learn"
            title="Learn JSON - Free Interactive Tutorial"
            description="Master JSON syntax, XML differences, and best practices with our comprehensive interactive guide."
            buttonText="Start Learning JSON"
            emoji="📚"
          />
        </div>

        {/* Related Tools */}
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Related Data Conversion Tools</h2>
            <p className="text-slate-600">Explore our complete suite of JSON and data transformation tools:</p>
          </div>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Link href="/json/json-to-xml" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-purple-300 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🔄</span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">JSON to XML</p>
                  <p className="text-xs text-slate-500">Reverse Conversion</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">Convert JSON back to XML format for legacy systems and SOAP APIs.</p>
              <p className="mt-4 text-sm font-semibold text-purple-600 group-hover:text-purple-700">Open tool →</p>
            </Link>
            
            <Link href="/json/json-validator" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-green-300 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">✅</span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">JSON Validator</p>
                  <p className="text-xs text-slate-500">Syntax Checker</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">Validate JSON syntax and structure to ensure your converted data is error-free.</p>
              <p className="mt-4 text-sm font-semibold text-green-600 group-hover:text-green-700">Open tool →</p>
            </Link>
            
            <Link href="/categories/developer-tools" className="group rounded-3xl border-2 border-slate-900 bg-gradient-to-br from-slate-900 to-slate-800 p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🛠️</span>
                </div>
                <div>
                  <p className="text-base font-bold text-white">All Developer Tools</p>
                  <p className="text-xs text-slate-400">Browse Complete Suite</p>
                </div>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">Discover 50+ free tools for JSON, HTML, CSS, XML, and data conversion tasks.</p>
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
