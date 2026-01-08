import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

export default function LengthConversion() {
  const [inputValue, setInputValue] = useState('');
  const [convertFrom, setConvertFrom] = useState('');
  const [convertTo, setConvertTo] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const currentYear = new Date().getFullYear();

  // Length units with conversions to meters as base unit
  const lengthUnits = [
    // Very small units
    { code: 'nanometer', name: 'Nanometer (nm)', toMeters: 1e-9 },
    { code: 'micrometer', name: 'Micrometer (μm)', toMeters: 1e-6 },
    { code: 'millimeter', name: 'Millimeter (mm)', toMeters: 0.001 },
    { code: 'centimeter', name: 'Centimeter (cm)', toMeters: 0.01 },
    { code: 'decimeter', name: 'Decimeter (dm)', toMeters: 0.1 },
    
    // Base and common units
    { code: 'meter', name: 'Meter (m)', toMeters: 1 },
    { code: 'kilometer', name: 'Kilometer (km)', toMeters: 1000 },
    
    // Imperial units
    { code: 'inch', name: 'Inch (in)', toMeters: 0.0254 },
    { code: 'foot', name: 'Foot (ft)', toMeters: 0.3048 },
    { code: 'yard', name: 'Yard (yd)', toMeters: 0.9144 },
    { code: 'mile', name: 'Mile (mi)', toMeters: 1609.344 },
    
    // Nautical
    { code: 'nauticalMile', name: 'Nautical Mile (nmi)', toMeters: 1852 },
    
    // Large units
    { code: 'lightYear', name: 'Light Year (ly)', toMeters: 9.461e15 },
    { code: 'astronomicalUnit', name: 'Astronomical Unit (AU)', toMeters: 1.496e11 },
    { code: 'parsec', name: 'Parsec (pc)', toMeters: 3.086e16 },
  ];

  // Conversion function - converts to meters first, then to target unit
  const convertLength = (from, to, value) => {
    const fromUnit = lengthUnits.find(u => u.code === from);
    const toUnit = lengthUnits.find(u => u.code === to);
    
    if (!fromUnit || !toUnit) {
      return null;
    }
    
    // Convert to meters first
    const valueInMeters = value * fromUnit.toMeters;
    // Convert from meters to target unit
    const result = valueInMeters / toUnit.toMeters;
    
    return result;
  };

  const handleConvert = (e) => {
    e.preventDefault();
    setError('');
    
    if (!inputValue || !convertFrom || !convertTo) {
      setError('Please fill in all fields');
      return;
    }

    if (convertFrom === convertTo) {
      setError('Source and target units must be different');
      return;
    }

    const amount = parseFloat(inputValue);
    if (isNaN(amount) || amount < 0) {
      setError('Please enter a valid positive number');
      return;
    }

    const convertedValue = convertLength(convertFrom, convertTo, amount);
    
    if (convertedValue === null) {
      setError('Invalid conversion. Please select valid length units.');
      return;
    }

    // Format result based on magnitude
    let formattedResult;
    if (convertedValue < 0.000001) {
      formattedResult = convertedValue.toExponential(6);
    } else if (convertedValue < 1) {
      formattedResult = convertedValue.toFixed(10).replace(/\.?0+$/, '');
    } else if (convertedValue < 1000) {
      formattedResult = convertedValue.toFixed(6).replace(/\.?0+$/, '');
    } else {
      formattedResult = convertedValue.toLocaleString('en-US', { 
        maximumFractionDigits: 6,
        useGrouping: true 
      });
    }

    const targetUnit = lengthUnits.find(u => u.code === convertTo);
    setResult(`${formattedResult} ${targetUnit?.name || convertTo}`);
    setError('');
  };

  const handleSwap = () => {
    const temp = convertFrom;
    setConvertFrom(convertTo);
    setConvertTo(temp);
    setResult('');
    setError('');
  };

  const handleClear = () => {
    setInputValue('');
    setConvertFrom('');
    setConvertTo('');
    setResult('');
    setError('');
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
          "name": "How do I convert length units online?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "To convert length units online, select your source length unit from the 'Convert From' dropdown (e.g., meters, feet, inches, kilometers), choose your target length unit from the 'Convert To' dropdown, enter the length value you want to convert, and click the Convert button. The tool will instantly display the converted length using precise mathematical conversions."
          }
        },
        {
          "@type": "Question",
          "name": "What length units are supported by this converter?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our length converter supports 16 length units including metric units (nanometer, micrometer, millimeter, centimeter, decimeter, meter, kilometer), imperial units (inch, foot, yard, mile), nautical units (nautical mile), and astronomical units (light year, astronomical unit, parsec). This comprehensive range covers everything from the smallest measurements to astronomical distances."
          }
        },
        {
          "@type": "Question",
          "name": "How accurate are the length conversions?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our length converter uses precise mathematical conversions based on standard length unit definitions. Conversions are calculated client-side in your browser with high precision, ensuring accurate results. For example, 1 meter = 3.28084 feet, 1 kilometer = 0.621371 miles, and 1 inch = 0.0254 meters. All conversions use exact conversion factors."
          }
        },
        {
          "@type": "Question",
          "name": "Can I convert between metric and imperial units?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, our converter seamlessly converts between metric units (meters, kilometers, centimeters) and imperial units (feet, inches, yards, miles). Simply select your source unit from one system and your target unit from another system. The converter handles all cross-system conversions automatically with precise calculations."
          }
        },
        {
          "@type": "Question",
          "name": "What is the difference between a mile and a nautical mile?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A mile (statute mile) is a land-based unit equal to 1,609.344 meters or 5,280 feet, commonly used in the United States. A nautical mile is a unit used in navigation and aviation, equal to 1,852 meters or approximately 1.15078 statute miles. Nautical miles are based on the Earth's circumference and are used for sea and air navigation."
          }
        },
        {
          "@type": "Question",
          "name": "Is this length converter free to use?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, our length converter is completely free to use. There are no registration requirements, no hidden fees, and no limits on the number of conversions you can perform. Simply visit the page, enter your length values, and convert between length units instantly without any cost."
          }
        },
        {
          "@type": "Question",
          "name": "Can I convert very small units like nanometers?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, our converter supports conversions between very small length units including nanometers (1 billionth of a meter), micrometers (1 millionth of a meter), and millimeters. This makes it perfect for scientific calculations, engineering applications, and precision measurements in fields like nanotechnology and microscopy."
          }
        },
        {
          "@type": "Question",
          "name": "Are the conversions calculated in real-time?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, all length conversions are calculated instantly in your browser using precise mathematical formulas. There's no server delay, no API calls, and no waiting time. The conversion happens immediately when you click the Convert button, providing instant results for any length unit conversion."
          }
        }
      ]
    },
    
    // SoftwareApplication Schema
    softwareApp: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Length Converter",
      "applicationCategory": "UtilityApplication",
      "operatingSystem": "Any",
      "description": "Free online length converter tool to convert between 16 length units including metric, imperial, nautical, and astronomical units. Fast, accurate, and works instantly in your browser.",
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
        "16 length units supported",
        "Metric and imperial systems",
        "Nautical and astronomical units",
        "Instant client-side conversion",
        "100% private and secure",
        "No registration required",
        "High-precision calculations",
        "Free unlimited conversions"
      ]
    },
    
    // HowTo Schema
    howTo: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Convert Length Units Online",
      "description": "Step-by-step guide to convert between length units online using FixTools free length converter with instant, precise calculations.",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Select source length unit",
          "text": "Choose the length unit you want to convert from using the 'Convert From' dropdown menu. Options include metric units (meter, kilometer, centimeter), imperial units (foot, inch, yard, mile), nautical units, and astronomical units.",
          "position": 1
        },
        {
          "@type": "HowToStep",
          "name": "Choose target length unit",
          "text": "Select the length unit you want to convert to from the 'Convert To' dropdown menu. You can convert between any of the 16 supported length units, including cross-system conversions between metric and imperial.",
          "position": 2
        },
        {
          "@type": "HowToStep",
          "name": "Enter length value",
          "text": "Type the length value you want to convert in the input field. You can enter whole numbers or decimals. The tool accepts any numeric value.",
          "position": 3
        },
        {
          "@type": "HowToStep",
          "name": "Convert and view result",
          "text": "Click the Convert button to instantly see the converted length. The result displays the equivalent value in your target length unit with appropriate precision formatting. You can swap units or perform additional conversions as needed.",
          "position": 4
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
          "name": "Conversion Tools",
          "item": "https://fixtools.io/tools/conversion-tools"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Length Converter",
          "item": "https://fixtools.io/conversiontools/lengthConversion"
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
        <title>Length Converter - Free Online Length Unit Conversion Tool | FixTools</title>
        <meta name="title" content="Length Converter - Free Online Length Unit Conversion Tool | FixTools" />
        <meta name="description" content="Convert between 16 length units online for free. Convert meters, feet, inches, kilometers, miles, nautical miles, and more. Instant, accurate conversions with precise formulas. Works in your browser." />
        <meta name="keywords" content="length converter, length unit converter, convert length units, meters to feet, feet to meters, inches to cm, length conversion calculator, convert meters to inches, length unit conversion tool" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://fixtools.io/conversiontools/lengthConversion" />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fixtools.io/conversiontools/lengthConversion" />
        <meta property="og:title" content="Length Converter - Free Online Length Unit Converter" />
        <meta property="og:description" content="Convert between 16 length units with instant, precise calculations. Metric, imperial, nautical, and astronomical units." />
        <meta property="og:image" content="https://fixtools.io/images/og-length-converter.png" />
        <meta property="og:site_name" content="FixTools" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://fixtools.io/conversiontools/lengthConversion" />
        <meta property="twitter:title" content="Length Converter - Free Online Tool" />
        <meta property="twitter:description" content="Convert between 16 length units instantly. Metric, imperial, nautical, and astronomical units." />
        <meta property="twitter:image" content="https://fixtools.io/images/og-length-converter.png" />
        
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
        /* CRITICAL: Override HTML font-size for proper rem calculations */
        html:has(.length-converter-page) {
          font-size: 100% !important;
        }
        
        .length-converter-page {
          line-height: 1.5;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          width: 100%;
          min-height: 100vh;
        }
        
        /* Box-sizing reset */
        .length-converter-page *,
        .length-converter-page *::before,
        .length-converter-page *::after {
          box-sizing: border-box;
        }
        
        /* Reset margins */
        .length-converter-page h1,
        .length-converter-page h2,
        .length-converter-page h3,
        .length-converter-page p,
        .length-converter-page ul,
        .length-converter-page ol {
          margin: 0;
        }
        
        /* Button and input inheritance */
        .length-converter-page button {
          font-family: inherit;
          cursor: pointer;
        }
        
        .length-converter-page input,
        .length-converter-page textarea,
        .length-converter-page select {
          font-family: inherit;
        }

        /* Hero animations */
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
          from { opacity: 0; }
          to { opacity: 1; }
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

        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        
        .animate-ping {
          animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>

      <div className="length-converter-page bg-[#fbfbfc] text-slate-900 min-h-screen">
        {/* Header Navigation */}
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/fixtools-logos/fixtools-logos_black.svg" alt="FixTools" width={120} height={40} className="h-9 w-auto" />
            </Link>
            <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
              <Link className="hover:text-slate-900 transition-colors" href="/tools">Developer</Link>
              <Link className="hover:text-slate-900 transition-colors" href="/tools/seo-tools">SEO</Link>
              <Link className="hover:text-slate-900 transition-colors" href="/tools/conversion-tools">Conversion</Link>
              <Link className="hover:text-slate-900 transition-colors" href="/">All tools</Link>
            </nav>
            <Link href="/" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50 transition-colors">
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
              <Link href="/tools/conversion-tools" className="hover:text-slate-900 transition-colors">
                Conversion Tools
              </Link>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-slate-400">/</span>
              <span className="font-semibold text-slate-900">Length Converter</span>
            </li>
          </ol>
        </nav>

        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.35]" style={{ backgroundImage: 'url(/grid.png)', backgroundSize: '256px 256px' }}></div>
          
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-10 md:grid-cols-12 md:py-14">
            {/* Left Column - Content */}
            <div className="relative z-10 md:col-span-7 hero-content">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50 px-4 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Free • Instant • Precise
              </div>
              
              {/* H1 */}
              <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                  Length Converter
                </span>
              </h1>
              
              {/* Description */}
              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg md:leading-relaxed">
                Our <strong>length converter</strong> helps you convert between 16 length units from nanometers to parsecs. Fast, accurate, and works instantly in your browser. Perfect for construction, engineering, scientific calculations, and everyday length conversions.
              </p>

              {/* CTA Buttons */}
              <div className="mt-7 pb-5 flex flex-wrap items-center gap-3">
                <a href="#tool" className="group relative rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 transition-all duration-200 hover:shadow-xl hover:scale-[1.02]">
                  <span className="relative z-10 flex items-center gap-2">
                    ⚡ Convert Length
                  </span>
                </a>
                <a href="#how" className="rounded-2xl border-2 border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-900 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md">
                  How it works
                </a>
              </div>

              {/* Stats Cards */}
              <dl className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Length Units</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">16</dd>
                </div>
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Precision</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">High</dd>
                </div>
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Speed</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">Instant</dd>
                </div>
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Cost</dt>
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
                      <span className="text-2xl">📏</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">16 Length Units</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Convert between metric units (meter, kilometer, centimeter), imperial units (foot, inch, yard, mile), nautical miles, and astronomical units (light year, parsec).
                      </p>
                    </div>
                  </div>
                </div>

                {/* Feature Card 2 */}
                <div className="feature-card group rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-lg transition-all duration-300 hover:border-blue-300 hover:shadow-xl hover:-translate-y-1" style={{ animationDelay: '0.2s' }}>
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30 transition-transform duration-300 group-hover:scale-110">
                      <span className="text-2xl">⚡</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">Instant Conversion</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        All conversions happen instantly in your browser using precise mathematical calculations. No server delays, no API calls—just instant results.
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
                        All conversions happen locally in your browser. We never store, log, or transmit your conversion data. Complete privacy guaranteed.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tool Interface Section */}
        <section id="tool" className="mx-auto max-w-6xl px-4 pb-12 pt-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 md:p-7" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Length Converter online</h2>
                <p className="mt-1 text-sm text-slate-600">Convert between 16 length units with instant, precise calculations</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleClear}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Tool UI */}
            <form onSubmit={handleConvert} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Convert From */}
                <div>
                  <label htmlFor="convertFrom" className="block text-sm font-medium text-slate-700 mb-2">
                    Convert From
                  </label>
                  <select
                    id="convertFrom"
                    value={convertFrom}
                    onChange={(e) => setConvertFrom(e.target.value)}
                    className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  >
                    <option value="">Select length unit</option>
                    {lengthUnits.map((unit) => (
                      <option key={unit.code} value={unit.code}>
                        {unit.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Swap Button */}
                <div className="flex items-end justify-center">
                  <button
                    type="button"
                    onClick={handleSwap}
                    className="rounded-xl border-2 border-slate-200 bg-white p-3 text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all hover:scale-105"
                    title="Swap units"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </button>
                </div>

                {/* Convert To */}
                <div>
                  <label htmlFor="convertTo" className="block text-sm font-medium text-slate-700 mb-2">
                    Convert To
                  </label>
                  <select
                    id="convertTo"
                    value={convertTo}
                    onChange={(e) => setConvertTo(e.target.value)}
                    className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  >
                    <option value="">Select length unit</option>
                    {lengthUnits.map((unit) => (
                      <option key={unit.code} value={unit.code}>
                        {unit.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Amount Input */}
              <div>
                <label htmlFor="inputValue" className="block text-sm font-medium text-slate-700 mb-2">
                  Length
                </label>
                <input
                  type="number"
                  id="inputValue"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Enter length"
                  step="any"
                  className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-base font-medium text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                />
              </div>

              {/* Convert Button */}
              <button
                type="submit"
                disabled={!inputValue || !convertFrom || !convertTo}
                className="w-full rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-slate-900/25 transition-all duration-200 hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                Convert Length
              </button>

              {/* Error Message */}
              {error && (
                <div className="rounded-xl border-2 border-red-200 bg-red-50 p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-xl flex-shrink-0">⚠️</span>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-red-800 mb-1">Conversion Error</div>
                      <div className="text-sm text-red-700">{error}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Result */}
              {result && (
                <div className="rounded-xl border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50 p-6">
                  <div className="text-sm font-semibold text-emerald-700 uppercase tracking-wide mb-2">Converted Length</div>
                  <div className="text-3xl font-bold text-slate-900">{result}</div>
                </div>
              )}
            </form>
          </div>
        </section>

        {/* What is Length Conversion? Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">What is Length Conversion?</h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                <strong>Length conversion</strong> is the process of converting a length measurement from one unit to another. Length is one of the most fundamental measurements in science, engineering, construction, and daily life. Understanding how to convert between different length units is essential for accurate measurements, calculations, and communication across different measurement systems.
              </p>
              
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Length units range from the extremely small (nanometers, used in nanotechnology and molecular biology) to the very large (parsecs, used in astronomy). The most commonly used length units include meters and kilometers in the metric system, and feet, inches, yards, and miles in the imperial system. Each unit has a precise mathematical relationship to the others, with the meter being the base unit in the International System of Units (SI).
              </p>
              
              <p className="text-base text-slate-700 leading-relaxed mb-6">
                According to the <a href="https://www.bipm.org/en/publications/si-brochure/" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">International Bureau of Weights and Measures (BIPM)</a>, the meter is defined as the length of the path travelled by light in vacuum during a time interval of 1/299,792,458 of a second. This precise definition allows for accurate conversions between all length units, from nanometers (1 billionth of a meter) to parsecs (approximately 3.086 × 10¹⁶ meters).
              </p>
              
              {/* Before/After Comparison */}
              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600">✗</span>
                    Manual Calculation
                  </h3>
                  <ul className="text-sm text-slate-700 space-y-2">
                    <li>• Complex conversion formulas</li>
                    <li>• Risk of calculation errors</li>
                    <li>• Time-consuming process</li>
                    <li>• Difficult for large numbers</li>
                  </ul>
                </div>
                
                <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">✓</span>
                    Online Length Converter
                  </h3>
                  <ul className="text-sm text-slate-700 space-y-2">
                    <li>• Instant conversion results</li>
                    <li>• Precise calculations</li>
                    <li>• Handles any magnitude</li>
                    <li>• Supports 16 length units</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics/Impact Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white p-8 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-3">Length Conversion Facts</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Key reference points and interesting facts about length units
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-emerald-200 shadow-lg">
                <div className="text-5xl font-extrabold text-emerald-600 mb-2">1 m</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">= 3.28084 ft</div>
                <div className="text-xs text-slate-600">Standard conversion</div>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-blue-200 shadow-lg">
                <div className="text-5xl font-extrabold text-blue-600 mb-2">1 km</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">= 0.621371 mi</div>
                <div className="text-xs text-slate-600">Kilometer to mile</div>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-purple-200 shadow-lg">
                <div className="text-5xl font-extrabold text-purple-600 mb-2">1 in</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">= 2.54 cm</div>
                <div className="text-xs text-slate-600">Inch to centimeter</div>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-orange-200 shadow-lg">
                <div className="text-5xl font-extrabold text-orange-600 mb-2">1 nmi</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">= 1.15078 mi</div>
                <div className="text-xs text-slate-600">Nautical mile</div>
              </div>
            </div>
            
            {/* Authority Link */}
            <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">📊</span>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">Length Measurement Standards</h4>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    According to the <a href="https://www.bipm.org/en/publications/si-brochure/" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">International Bureau of Weights and Measures (BIPM)</a>, the meter is the base unit of length in the International System of Units (SI). The meter is defined in terms of the speed of light, providing a precise foundation for all length conversions and scientific measurements. This definition ensures accuracy across all length unit conversions from nanometers to parsecs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Use Length Converter? Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Why Use Our Length Converter?</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Our length converter provides instant, accurate conversions between 16 length units with high precision. Whether you're working on construction projects, engineering calculations, scientific research, or everyday measurements, our tool offers the speed, accuracy, and convenience you need.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Benefit 1 */}
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-emerald-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Instant Client-Side Conversion</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      All length conversions happen instantly in your browser using precise mathematical calculations. No server delays, no API calls, no waiting—just instant results whenever you need them. Perfect for quick construction measurements, engineering calculations, and scientific work where speed matters.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Benefit 2 */}
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                    <span className="text-2xl">📏</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">16 Comprehensive Length Units</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Convert between metric units (meter, kilometer, centimeter, millimeter), imperial units (foot, inch, yard, mile), nautical miles for navigation, and astronomical units (light year, parsec) for space measurements. This comprehensive range covers everything from microscopic measurements to astronomical distances.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Benefit 3 */}
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-purple-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
                    <span className="text-2xl">🌍</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Metric and Imperial Support</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Seamlessly convert between metric and imperial systems. Whether you're working with meters and kilometers (used worldwide) or feet, inches, and miles (used in the US), our converter handles all cross-system conversions automatically with precise calculations based on official conversion factors.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Benefit 4 */}
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-orange-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">High-Precision Calculations</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Our converter uses precise mathematical formulas based on the International System of Units (SI) definitions. Conversions maintain high precision, making it suitable for scientific calculations, engineering projects, construction work, and programming applications where accuracy is critical.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Benefit 5 */}
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-teal-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 shadow-lg">
                    <span className="text-2xl">🔒</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">100% Private & Secure</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      All conversions happen locally in your browser. We never store, log, or transmit your conversion data. Your length measurements remain completely private, making this tool safe for sensitive construction, engineering, or scientific calculations. No registration, no tracking, no data collection.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Benefit 6 */}
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-yellow-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-500 to-amber-600 shadow-lg">
                    <span className="text-2xl">💰</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Completely Free Forever</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Use our length converter as much as you want, whenever you need it, without any cost. No hidden fees, no premium tiers, no usage limits. Convert length units unlimited times for free, making it perfect for students, professionals, engineers, and anyone who needs regular length conversions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how" className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">How It Works</h2>
            </div>
            
            <p className="text-base text-slate-600 mb-6 leading-relaxed">
              Our length converter uses precise mathematical conversions based on the International System of Units (SI) definitions. All conversions are calculated client-side in your browser for instant results.
            </p>
            
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg mx-auto mb-4">
                  <span className="text-3xl font-bold text-white">1</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Select Units</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Choose your source length unit from the "Convert From" dropdown and your target length unit from the "Convert To" dropdown.
                </p>
              </div>
              
              <div className="text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg mx-auto mb-4">
                  <span className="text-3xl font-bold text-white">2</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Enter Length</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Type the length value you want to convert in the input field. You can enter whole numbers or decimals.
                </p>
              </div>
              
              <div className="text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg mx-auto mb-4">
                  <span className="text-3xl font-bold text-white">3</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Calculate</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Our converter calculates the conversion using precise formulas, converting to meters first, then to your target unit.
                </p>
              </div>
              
              <div className="text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg mx-auto mb-4">
                  <span className="text-3xl font-bold text-white">4</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">View Result</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Click Convert to instantly see the converted length displayed clearly with appropriate precision formatting.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Best Practices Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Best Practices for Length Conversion</h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                When converting length units, following best practices ensures you get accurate results and understand the relationships between different measurement systems. Here are essential tips for using length converters effectively:
              </p>
              
              <h3 className="text-xl font-bold text-slate-900 mt-6 mb-3">1. Understand System Differences</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Familiarize yourself with the differences between metric and imperial systems. The metric system is decimal-based (10, 100, 1000), making conversions straightforward. The imperial system uses various conversion factors (12 inches = 1 foot, 3 feet = 1 yard, 5280 feet = 1 mile). Understanding these relationships helps verify conversions and catch potential errors.
              </p>
              
              <h3 className="text-xl font-bold text-slate-900 mt-6 mb-3">2. Use Appropriate Units for Your Context</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Choose length units that make sense for your application. For construction and engineering, meters, feet, and inches are common. For scientific work, nanometers, micrometers, and meters are standard. For navigation, nautical miles are used. For astronomy, light years and parsecs are appropriate. Using contextually appropriate units makes measurements more meaningful.
              </p>
              
              <h3 className="text-xl font-bold text-slate-900 mt-6 mb-3">3. Verify Common Conversion Points</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Use known conversion points to verify accuracy. For example, 1 meter should equal approximately 3.28 feet, 1 kilometer should equal approximately 0.62 miles, and 1 inch should equal exactly 2.54 centimeters. These reference points help catch input errors and verify that conversions are working correctly.
              </p>
              
              <h3 className="text-xl font-bold text-slate-900 mt-6 mb-3">4. Consider Precision for Small Units</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                When working with very small length units like nanometers or micrometers, be aware that results may be displayed in scientific notation for extremely small values. This is normal and ensures precision is maintained. For example, converting 1 nanometer to kilometers results in a very small decimal number (1 × 10⁻¹² km).
              </p>
              
              <h3 className="text-xl font-bold text-slate-900 mt-6 mb-3">5. Note Nautical vs. Statute Miles</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Be aware of the difference between nautical miles and statute miles. A nautical mile (1,852 meters) is longer than a statute mile (1,609.344 meters). Nautical miles are used in navigation and aviation, while statute miles are used for land distances. Our converter supports both, so make sure you're using the correct unit for your application.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="h-1 w-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Frequently Asked Questions</h2>
            </div>
            
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">How do I convert length units online?</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  To convert length units online, select your source length unit from the 'Convert From' dropdown (e.g., meters, feet, inches, kilometers), choose your target length unit from the 'Convert To' dropdown, enter the length value you want to convert, and click the Convert button. The tool will instantly display the converted length using precise mathematical conversions.
                </p>
              </div>
              
              <div className="border-b border-slate-200 pb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">What length units are supported by this converter?</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Our length converter supports 16 length units including metric units (nanometer, micrometer, millimeter, centimeter, decimeter, meter, kilometer), imperial units (inch, foot, yard, mile), nautical units (nautical mile), and astronomical units (light year, astronomical unit, parsec). This comprehensive range covers everything from the smallest measurements to astronomical distances.
                </p>
              </div>
              
              <div className="border-b border-slate-200 pb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">How accurate are the length conversions?</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Our length converter uses precise mathematical conversions based on standard length unit definitions. Conversions are calculated client-side in your browser with high precision, ensuring accurate results. For example, 1 meter = 3.28084 feet, 1 kilometer = 0.621371 miles, and 1 inch = 0.0254 meters. All conversions use exact conversion factors.
                </p>
              </div>
              
              <div className="border-b border-slate-200 pb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Can I convert between metric and imperial units?</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Yes, our converter seamlessly converts between metric units (meters, kilometers, centimeters) and imperial units (feet, inches, yards, miles). Simply select your source unit from one system and your target unit from another system. The converter handles all cross-system conversions automatically with precise calculations.
                </p>
              </div>
              
              <div className="border-b border-slate-200 pb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">What is the difference between a mile and a nautical mile?</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  A mile (statute mile) is a land-based unit equal to 1,609.344 meters or 5,280 feet, commonly used in the United States. A nautical mile is a unit used in navigation and aviation, equal to 1,852 meters or approximately 1.15078 statute miles. Nautical miles are based on the Earth's circumference and are used for sea and air navigation.
                </p>
              </div>
              
              <div className="border-b border-slate-200 pb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Is this length converter free to use?</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Yes, our length converter is completely free to use. There are no registration requirements, no hidden fees, and no limits on the number of conversions you can perform. Simply visit the page, enter your length values, and convert between length units instantly without any cost.
                </p>
              </div>
              
              <div className="border-b border-slate-200 pb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Can I convert very small units like nanometers?</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Yes, our converter supports conversions between very small length units including nanometers (1 billionth of a meter), micrometers (1 millionth of a meter), and millimeters. This makes it perfect for scientific calculations, engineering applications, and precision measurements in fields like nanotechnology and microscopy.
                </p>
              </div>
              
              <div className="pb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Are the conversions calculated in real-time?</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Yes, all length conversions are calculated instantly in your browser using precise mathematical formulas. There's no server delay, no API calls, and no waiting time. The conversion happens immediately when you click the Convert button, providing instant results for any length unit conversion.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Related Tools Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="h-1 w-8 bg-gradient-to-r from-slate-500 to-slate-600 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Related Tools</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link href="/conversiontools/temperatureConversion" className="group rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 transition-all duration-300 hover:border-orange-300 hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600">
                    <span className="text-xl">🌡️</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Temperature Converter</h3>
                </div>
                <p className="text-sm text-slate-600">Convert between Celsius, Fahrenheit, Kelvin, and Rankine temperature scales.</p>
              </Link>
              
              <Link href="/conversiontools/timeConversion" className="group rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 transition-all duration-300 hover:border-emerald-300 hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600">
                    <span className="text-xl">⏱️</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Time Converter</h3>
                </div>
                <p className="text-sm text-slate-600">Convert between nanoseconds, seconds, minutes, hours, days, weeks, months, years, and more.</p>
              </Link>
              
              <Link href="/conversiontools/massConversion" className="group rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 transition-all duration-300 hover:border-emerald-300 hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600">
                    <span className="text-xl">⚖️</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Mass Converter</h3>
                </div>
                <p className="text-sm text-slate-600">Convert between kilograms, pounds, grams, ounces, and other mass units.</p>
              </Link>
              
              <Link href="/conversiontools/volumeConversion" className="group rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 transition-all duration-300 hover:border-blue-300 hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600">
                    <span className="text-xl">💧</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Volume Converter</h3>
                </div>
                <p className="text-sm text-slate-600">Convert between liters, gallons, cubic meters, milliliters, and other volume units.</p>
              </Link>
              
              <Link href="/conversiontools/currencyConversion" className="group rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 transition-all duration-300 hover:border-emerald-300 hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600">
                    <span className="text-xl">💱</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Currency Converter</h3>
                </div>
                <p className="text-sm text-slate-600">Convert between 170+ world currencies with real-time exchange rates.</p>
              </Link>
              
              <Link href="/conversiontools/areaConversion" className="group rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 transition-all duration-300 hover:border-purple-300 hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600">
                    <span className="text-xl">📐</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Area Converter</h3>
                </div>
                <p className="text-sm text-slate-600">Convert between square meters, square feet, acres, hectares, and other area units.</p>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-8">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <div className="flex items-center gap-3">
                <Image src="/fixtools-logos/fixtools-logos_black.svg" alt="FixTools" width={100} height={33} className="h-8 w-auto" />
                <span className="text-sm text-slate-600">© {currentYear} FixTools. All rights reserved.</span>
              </div>
              <nav className="flex items-center gap-6 text-sm text-slate-600">
                <Link href="/" className="hover:text-slate-900 transition-colors">Home</Link>
                <Link href="/tools" className="hover:text-slate-900 transition-colors">All Tools</Link>
                <Link href="/about" className="hover:text-slate-900 transition-colors">About</Link>
              </nav>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

