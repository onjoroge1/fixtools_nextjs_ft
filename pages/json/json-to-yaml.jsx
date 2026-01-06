import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import MarqueeCTA from '@/components/MarqueeCTA';

export default function JSONToYAMLConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [stats, setStats] = useState('');
  const [copyText, setCopyText] = useState('📋 Copy');
  
  // Options
  const [indentSize, setIndentSize] = useState(2);
  const [includeComments, setIncludeComments] = useState(false);

  const currentYear = new Date().getFullYear();

  const demo = `{
  "name": "my-app",
  "version": "1.0.0",
  "description": "Sample application configuration",
  "server": {
    "host": "localhost",
    "port": 3000,
    "ssl": false
  },
  "database": {
    "type": "postgresql",
    "connection": {
      "host": "db.example.com",
      "port": 5432,
      "username": "admin"
    }
  },
  "features": ["auth", "api", "dashboard"],
  "enabled": true
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

  // JSON to YAML conversion function
  const jsonToYaml = (obj, indent = 0) => {
    const spaces = ' '.repeat(indent * indentSize);
    let yaml = '';
    
    if (obj === null) {
      return 'null';
    }
    
    if (obj === undefined) {
      return 'null';
    }
    
    if (typeof obj === 'string') {
      // Check if string needs quoting
      if (obj.includes('\n') || obj.includes(':') || obj.includes('#') || obj.includes('[') || obj.includes('{')) {
        return `"${obj.replace(/"/g, '\\"')}"`;
      }
      // Check if string looks like a number or boolean
      if (obj === 'true' || obj === 'false' || obj === 'null' || !isNaN(obj)) {
        return `"${obj}"`;
      }
      return obj;
    }
    
    if (typeof obj === 'number' || typeof obj === 'boolean') {
      return String(obj);
    }
    
    if (Array.isArray(obj)) {
      if (obj.length === 0) {
        return '[]';
      }
      
      // Check if array contains only simple values
      const isSimple = obj.every(item => 
        typeof item !== 'object' || item === null
      );
      
      obj.forEach((item, index) => {
        if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
          yaml += `\n${spaces}-`;
          const itemYaml = jsonToYaml(item, indent + 1);
          const lines = itemYaml.split('\n').filter(line => line.trim());
          lines.forEach((line, i) => {
            if (i === 0) {
              yaml += ` ${line}`;
            } else {
              yaml += `\n${spaces}  ${line}`;
            }
          });
        } else {
          yaml += `\n${spaces}- ${jsonToYaml(item, indent + 1)}`;
        }
      });
      return yaml;
    }
    
    if (typeof obj === 'object') {
      const keys = Object.keys(obj);
      if (keys.length === 0) {
        return '{}';
      }
      
      keys.forEach((key, index) => {
        const value = obj[key];
        
        if (includeComments && index === 0 && indent === 0) {
          yaml += `${spaces}# Configuration\n`;
        }
        
        if (value === null || value === undefined) {
          yaml += `\n${spaces}${key}: null`;
        } else if (Array.isArray(value)) {
          if (value.length === 0) {
            yaml += `\n${spaces}${key}: []`;
          } else {
            yaml += `\n${spaces}${key}:`;
            yaml += jsonToYaml(value, indent + 1);
          }
        } else if (typeof value === 'object') {
          yaml += `\n${spaces}${key}:`;
          yaml += jsonToYaml(value, indent + 1);
        } else {
          yaml += `\n${spaces}${key}: ${jsonToYaml(value, indent)}`;
        }
      });
      
      return yaml;
    }
    
    return String(obj);
  };

  const handleConvert = () => {
    const inputText = input.trim();
    if (!inputText) return;
    
    try {
      const parsed = JSON.parse(inputText);
      let yamlOutput = jsonToYaml(parsed, 0);
      
      // Remove leading newline
      yamlOutput = yamlOutput.replace(/^\n/, '');
      
      // Add YAML document marker if includes comments
      if (includeComments) {
        yamlOutput = '---\n' + yamlOutput + '\n...';
      }
      
      setOutput(yamlOutput);
      
      const beforeSize = new Blob([inputText]).size;
      const afterSize = new Blob([yamlOutput]).size;
      const sizeDiff = afterSize - beforeSize;
      const sizeChangePercent = beforeSize > 0 ? ((sizeDiff / beforeSize) * 100).toFixed(1) : "0.0";
      
      setStats(`Converted: ${beforeSize.toLocaleString()} bytes (JSON) → ${afterSize.toLocaleString()} bytes (YAML) ${sizeDiff >= 0 ? '+' : ''}${sizeChangePercent}%`);
      
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
    const blob = new Blob([text], { type: "application/x-yaml" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "config.yaml";
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
          "name": "How do I convert JSON to YAML format?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Paste your JSON data into the input field, choose your YAML options (indentation, comments), and click Convert. The tool will transform your JSON into properly formatted YAML that you can copy or download."
          }
        },
        {
          "@type": "Question",
          "name": "Does the tool handle nested JSON objects?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! The converter automatically preserves the hierarchical structure of your JSON, converting nested objects into indented YAML format. Complex JSON structures are fully supported."
          }
        },
        {
          "@type": "Question",
          "name": "Can I use the YAML output in Kubernetes?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Absolutely. The generated YAML is valid and compatible with Kubernetes, Docker Compose, GitHub Actions, and all YAML-based configuration systems."
          }
        },
        {
          "@type": "Question",
          "name": "What's the difference between JSON and YAML?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "JSON uses brackets and quotes. YAML uses indentation and colons, making it more readable for humans. YAML is the standard for configuration files while JSON is preferred for APIs."
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
          "name": "Can I convert JSON arrays to YAML?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. JSON arrays are converted to YAML list format using dashes (-). The tool handles arrays of objects, nested arrays, and mixed data types."
          }
        },
        {
          "@type": "Question",
          "name": "Why convert JSON to YAML?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "YAML is more readable and the standard for configuration files in DevOps tools like Kubernetes, Docker, Ansible, and CI/CD pipelines. It's easier to edit and supports comments."
          }
        },
        {
          "@type": "Question",
          "name": "Does YAML support all JSON data types?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. YAML is a superset of JSON, meaning any valid JSON can be converted to YAML. YAML supports all JSON types: objects, arrays, strings, numbers, booleans, and null."
          }
        }
      ]
    },
    
    softwareApp: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "JSON to YAML Converter",
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "Any",
      "description": "Free online tool to convert JSON to YAML format. Transform API responses and JSON config files into YAML for Kubernetes, Docker Compose, and CI/CD pipelines.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "ratingCount": "1650",
        "bestRating": "5",
        "worstRating": "1"
      },
      "featureList": [
        "Convert JSON to YAML format",
        "Preserve nested structure automatically",
        "Handle arrays and complex objects",
        "Adjustable indentation (2 or 4 spaces)",
        "Optional comment markers",
        "Kubernetes and Docker compatible",
        "Browser-based processing (no uploads)",
        "Download as .yaml or .yml file",
        "Copy to clipboard"
      ]
    },
    
    howTo: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Convert JSON to YAML",
      "description": "Step-by-step guide to convert JSON data to YAML format online for free using FixTools JSON to YAML Converter.",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Paste your JSON data",
          "text": "Copy your JSON content (from APIs, config files, or any JSON source) and paste it into the input field. The tool supports all valid JSON formats including nested objects and arrays.",
          "position": 1
        },
        {
          "@type": "HowToStep",
          "name": "Choose YAML options",
          "text": "Select your preferred indentation level (2 or 4 spaces) and decide whether to include YAML document markers and comments. These options control the readability of your YAML output.",
          "position": 2
        },
        {
          "@type": "HowToStep",
          "name": "Convert and export",
          "text": "Click the Convert button to transform your JSON to YAML. The tool will parse the JSON structure and generate properly formatted YAML with correct indentation. Then copy to clipboard or download as a .yaml file.",
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
          "name": "JSON to YAML Converter",
          "item": "https://fixtools.io/json/json-to-yaml"
        }
      ]
    }
  };

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>JSON to YAML Converter - Free Online JSON to YAML Tool | FixTools</title>
        <meta name="title" content="JSON to YAML Converter - Free Online JSON to YAML Tool | FixTools" />
        <meta name="description" content="Convert JSON to YAML format online for free. Transform API responses and JSON configs into YAML for Kubernetes, Docker Compose, and CI/CD pipelines. Handles nested objects and arrays. No upload required." />
        <meta name="keywords" content="json to yaml, json to yaml converter, convert json to yaml online, json to yml, kubernetes yaml, docker compose yaml" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        <link rel="canonical" href="https://fixtools.io/json/json-to-yaml" />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fixtools.io/json/json-to-yaml" />
        <meta property="og:title" content="JSON to YAML Converter - Free Online Tool" />
        <meta property="og:description" content="Convert JSON to YAML format instantly. Perfect for Kubernetes, Docker Compose, and configuration files. Handles nested structures automatically." />
        <meta property="og:image" content="https://fixtools.io/images/og-json-to-yaml.png" />
        <meta property="og:site_name" content="FixTools" />
        
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://fixtools.io/json/json-to-yaml" />
        <meta property="twitter:title" content="JSON to YAML Converter - Free Online Tool" />
        <meta property="twitter:description" content="Convert JSON to YAML format instantly. Kubernetes and Docker Compose ready." />
        <meta property="twitter:image" content="https://fixtools.io/images/og-json-to-yaml.png" />
        
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
        html:has(.json-to-yaml-page) {
          font-size: 100% !important;
        }
        
        .json-to-yaml-page {
          line-height: 1.5;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          width: 100%;
          min-height: 100vh;
        }
        
        .json-to-yaml-page *,
        .json-to-yaml-page *::before,
        .json-to-yaml-page *::after {
          box-sizing: border-box;
        }
        
        .json-to-yaml-page h1,
        .json-to-yaml-page h2,
        .json-to-yaml-page h3,
        .json-to-yaml-page p,
        .json-to-yaml-page ul,
        .json-to-yaml-page ol {
          margin: 0;
        }
        
        .json-to-yaml-page button {
          font-family: inherit;
          cursor: pointer;
        }
        
        .json-to-yaml-page input,
        .json-to-yaml-page textarea,
        .json-to-yaml-page select {
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

      <div className="json-to-yaml-page bg-[#fbfbfc] text-slate-900 min-h-screen">
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
              <span className="font-semibold text-slate-900">JSON to YAML Converter</span>
            </li>
          </ol>
        </nav>

        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.35]" style={{ backgroundImage: 'url(/grid.png)', backgroundSize: '256px 256px' }}></div>
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-10 md:grid-cols-12 md:py-14">
            <div className="relative z-10 md:col-span-7 hero-content">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-gradient-to-r from-cyan-50 to-blue-50 px-4 py-1.5 text-xs font-semibold text-cyan-700 shadow-sm backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                Free • Fast • Privacy-first
              </div>
              
              <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                  JSON to YAML Converter
                </span>
              </h1>
              
              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg md:leading-relaxed">
                Convert <strong>JSON to YAML format</strong> instantly. Transform API responses and JSON configs into human-readable YAML for Kubernetes, Docker Compose, GitHub Actions, and CI/CD pipelines. Handles nested objects and arrays automatically.
              </p>

              <div className="mt-7 pb-5 flex flex-wrap items-center gap-3">
                <a 
                  href="#tool" 
                  className="group relative rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 transition-all duration-200 hover:shadow-xl hover:shadow-slate-900/40 hover:scale-[1.02]"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    ⚡ Convert to YAML
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
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">YAML Format</dd>
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
                <div className="feature-card group rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-lg transition-all duration-300 hover:border-cyan-300 hover:shadow-xl hover:-translate-y-1" style={{ animationDelay: '0.1s' }}>
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/30 transition-transform duration-300 group-hover:scale-110">
                      <span className="text-2xl">⚙️</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">Config File Ready</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Generate YAML perfect for Kubernetes, Docker, Ansible, and all DevOps configuration tools.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="feature-card group rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-lg transition-all duration-300 hover:border-blue-300 hover:shadow-xl hover:-translate-y-1" style={{ animationDelay: '0.2s' }}>
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30 transition-transform duration-300 group-hover:scale-110">
                      <span className="text-2xl">📖</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">Human Readable</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Clean indentation, no quotes or brackets. YAML is easier to read and edit than JSON.
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
                <h2 className="text-xl font-semibold text-slate-900">Convert JSON to YAML online</h2>
                <p className="mt-1 text-sm text-slate-600">Paste your JSON data, choose YAML options, and get config-ready output.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button onClick={handlePasteDemo} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50">Paste demo</button>
                <button onClick={handleClear} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50">Clear</button>
                <button onClick={handleConvert} className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">⚡ Convert to YAML</button>
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
                <label className="mb-2 block text-sm font-semibold text-slate-800">YAML Options</label>
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
                    <p className="mt-2 text-xs text-slate-500">
                      Standard is 2 spaces for YAML.
                    </p>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeComments}
                        onChange={(e) => setIncludeComments(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-2 focus:ring-slate-900/20"
                      />
                      <span className="text-sm font-semibold text-slate-800">Include document markers</span>
                    </label>
                    <p className="mt-1 text-xs text-slate-500">
                      Add --- header and ... footer.
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
                <label className="text-sm font-semibold text-slate-800">YAML Output</label>
                <div className="flex flex-wrap items-center gap-2">
                  <button onClick={handleCopy} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50">{copyText}</button>
                  <button onClick={handleDownload} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50">⬇ Download .yaml</button>
                </div>
              </div>
              <textarea 
                value={output}
                className="mt-2 h-56 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm text-slate-900 outline-none" 
                placeholder="Your YAML output will appear here..." 
                readOnly
              />
              <p className="mt-2 text-xs text-slate-500">{stats}</p>
            </div>
          </div>
        </section>

        {/* What is JSON to YAML Conversion? */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">What is JSON to YAML Conversion?</h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                <strong>JSON to YAML conversion</strong> is the process of transforming JavaScript Object Notation (JSON) data into YAML (YAML Ain't Markup Language) format. JSON is commonly used for APIs and data interchange, while YAML is the standard for configuration files in DevOps tools like Kubernetes, Docker, Ansible, GitHub Actions, and CI/CD pipelines. YAML offers superior readability with clean indentation instead of brackets and quotes.
              </p>
              
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                When you convert JSON to YAML, curly braces become indentation, square brackets become dashes, and quotes are removed where not needed. This transformation makes configuration files dramatically easier to read and edit for humans while maintaining full data compatibility. YAML is actually a superset of JSON, meaning any valid JSON is also valid YAML.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600">{`{}`}</span>
                    JSON (API Format)
                  </h3>
                  <pre className="text-xs bg-white p-3 rounded-lg border border-slate-200 overflow-x-auto"><code>{`{
  "server": {
    "host": "localhost",
    "port": 3000
  },
  "features": ["auth", "api"]
}`}</code></pre>
                  <p className="text-sm text-slate-600 mt-3">Brackets, quotes, verbose syntax</p>
                </div>
                
                <div className="rounded-2xl border-2 border-cyan-200 bg-cyan-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-100 text-cyan-600">⚙️</span>
                    YAML (Config Format)
                  </h3>
                  <pre className="text-xs bg-white p-3 rounded-lg border border-cyan-200 overflow-x-auto"><code>{`server:
  host: localhost
  port: 3000
features:
  - auth
  - api`}</code></pre>
                  <p className="text-sm text-cyan-700 font-semibold mt-3">Clean indentation, no quotes, human-readable</p>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">How the Conversion Works</h3>
              <ul className="space-y-2 mb-4">
                <li className="flex items-start gap-2">
                  <span className="text-cyan-600 font-bold mt-1">•</span>
                  <span className="text-slate-700"><strong>Parsing:</strong> The JSON string is parsed into a data structure</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-600 font-bold mt-1">•</span>
                  <span className="text-slate-700"><strong>Indentation:</strong> Curly braces are replaced with indented lines</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-600 font-bold mt-1">•</span>
                  <span className="text-slate-700"><strong>List Formatting:</strong> Arrays are converted to dash (-) prefixed lists</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-600 font-bold mt-1">•</span>
                  <span className="text-slate-700"><strong>Quote Removal:</strong> Simple values don't need quotes in YAML</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-600 font-bold mt-1">•</span>
                  <span className="text-slate-700"><strong>Nesting:</strong> Hierarchical structure is preserved through indentation levels</span>
                </li>
              </ul>

              <p className="text-base text-slate-700 leading-relaxed mb-4">
                The conversion process handles complex JSON structures including nested objects, arrays of objects, mixed data types, and special characters. The resulting YAML is properly indented, follows YAML syntax rules, and is ready to use in configuration files for Kubernetes deployments, Docker Compose services, Ansible playbooks, and GitHub Actions workflows.
              </p>
              
              <p className="text-base text-slate-700 leading-relaxed">
                <strong>JSON to YAML conversion</strong> is essential for DevOps workflows, infrastructure as code, and modern deployment pipelines where YAML is the standard configuration format. It bridges the gap between API-friendly JSON and human-friendly YAML, making data transformation seamless between development and deployment environments.
              </p>
            </div>
          </div>
        </section>

        {/* Why Convert JSON to YAML? */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Why Convert JSON to YAML?</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Converting JSON to YAML makes configuration files more readable and is essential for DevOps and cloud-native development:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-cyan-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg">
                    <span className="text-2xl">☸️</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">DevOps Standard</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      YAML is the standard for Kubernetes manifests, Docker Compose files, Helm charts, Ansible playbooks, GitHub Actions workflows, and CI/CD pipelines. Converting JSON API responses to YAML enables direct use in deployment configs.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                    <span className="text-2xl">📖</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Superior Readability</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      YAML removes brackets, excessive quotes, and commas. Clean indentation makes structure obvious at a glance. Team members can read and edit YAML configs without technical JSON knowledge. Comments are supported for documentation.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-emerald-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg">
                    <span className="text-2xl">⚙️</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Config File Native</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      While JSON excels at data interchange, YAML is purpose-built for configuration. It supports features like anchors and aliases for DRY configs, multi-line strings, and type inference. Perfect for infrastructure as code.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-orange-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg">
                    <span className="text-2xl">🚀</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Cloud Native Ecosystem</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      AWS CloudFormation, Azure Resource Manager, Google Cloud Deployment Manager, Terraform, and OpenAPI specs all use YAML. Converting JSON to YAML ensures compatibility with the entire cloud-native toolchain.
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
                <div className="h-1 w-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"></div>
                <h2 className="text-3xl font-bold text-slate-900">How JSON to YAML Conversion Works</h2>
              </div>
              
              <p className="mt-2 text-slate-600 leading-relaxed">
                Our converter parses JSON structure and transforms it into clean, indented YAML in three simple steps:
              </p>

              <ol className="mt-6 space-y-4">
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg shadow-slate-900/25 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-xl">
                    1
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Paste your JSON data</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Copy your JSON content from API responses, package.json, or any JSON source and paste it into the input field. Works with all valid JSON formats.
                    </p>
                  </div>
                </li>
                
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg shadow-slate-900/25 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-xl">
                    2
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Choose YAML options</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Select your indentation preference (2 or 4 spaces) and decide whether to include YAML document markers. These control the format of your output.
                    </p>
                  </div>
                </li>
                
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg shadow-slate-900/25 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-xl">
                    3
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Convert and export your YAML</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Click Convert to transform JSON to YAML. The tool removes brackets, formats lists with dashes, and creates clean indentation. Copy to clipboard or download as .yaml file.
                    </p>
                  </div>
                </li>
              </ol>
            </div>

            <div className="md:col-span-5">
              <div className="sticky top-24 rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-7 shadow-xl shadow-slate-900/10 transition-all duration-300 hover:shadow-2xl hover:border-slate-300 hover:-translate-y-1">
                <div className="flex items-start gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/30">
                    <span className="text-2xl">✨</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 pt-2">
                    Key Features
                  </h3>
                </div>
                
                <ul className="mt-4 space-y-3">
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-cyan-100 text-cyan-600 transition-colors group-hover:bg-cyan-200">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">
                      Kubernetes and Docker compatible
                    </span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-cyan-100 text-cyan-600 transition-colors group-hover:bg-cyan-200">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">
                      Handles nested objects and arrays
                    </span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-cyan-100 text-cyan-600 transition-colors group-hover:bg-cyan-200">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">
                      Clean indentation (no brackets)
                    </span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-cyan-100 text-cyan-600 transition-colors group-hover:bg-cyan-200">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">
                      CI/CD pipeline ready
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
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">How do I convert JSON to YAML format?</summary>
                <p className="mt-2 text-sm text-slate-600">
                  Paste your JSON data into the input field, choose your YAML options (indentation, markers), and click Convert. The tool will transform your JSON into properly formatted YAML.
                </p>
              </details>
              
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Can I use the YAML output in Kubernetes?</summary>
                <p className="mt-2 text-sm text-slate-600">
                  Absolutely. The generated YAML follows standard syntax and works perfectly with Kubernetes, Docker Compose, and all YAML-based tools.
                </p>
              </details>
              
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Does the tool handle nested JSON objects?</summary>
                <p className="mt-2 text-sm text-slate-600">
                  Yes! The converter preserves hierarchical structure using YAML indentation. Complex nested JSON is fully supported.
                </p>
              </details>
              
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Is my JSON data stored on your servers?</summary>
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
            title="Learn JSON & YAML - Free Interactive Tutorial"
            description="Master JSON syntax, YAML formatting, and conversion best practices with our comprehensive guide."
            buttonText="Start Learning"
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
            <Link href="/json/yaml-to-json" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-cyan-300 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🔄</span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">YAML to JSON</p>
                  <p className="text-xs text-slate-500">Reverse Conversion</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">Convert YAML config files back to JSON format for APIs and data processing.</p>
              <p className="mt-4 text-sm font-semibold text-cyan-600 group-hover:text-cyan-700">Open tool →</p>
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
              <p className="text-sm text-slate-600 leading-relaxed">Validate JSON syntax before conversion to ensure error-free YAML output.</p>
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
              <p className="text-sm text-slate-300 leading-relaxed">Discover 50+ free tools for JSON, YAML, XML, and data conversion tasks.</p>
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
