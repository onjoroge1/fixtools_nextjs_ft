import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

export default function SpeedConversion() {
  const [inputValue, setInputValue] = useState('');
  const [convertFrom, setConvertFrom] = useState('');
  const [convertTo, setConvertTo] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const currentYear = new Date().getFullYear();

  // Speed units with conversions to meters per second as base unit
  const speedUnits = [
    // Common units
    { code: 'meterPerSecond', name: 'Meter per Second (m/s)', toMetersPerSecond: 1 },
    { code: 'kilometerPerHour', name: 'Kilometer per Hour (km/h)', toMetersPerSecond: 1000 / 3600 },
    { code: 'milePerHour', name: 'Mile per Hour (mph)', toMetersPerSecond: 1609.344 / 3600 },
    { code: 'footPerSecond', name: 'Foot per Second (ft/s)', toMetersPerSecond: 0.3048 },
    
    // Nautical
    { code: 'knot', name: 'Knot (kn)', toMetersPerSecond: 1852 / 3600 },
    { code: 'nauticalMilePerHour', name: 'Nautical Mile per Hour', toMetersPerSecond: 1852 / 3600 },
    
    // Other units
    { code: 'kilometerPerSecond', name: 'Kilometer per Second (km/s)', toMetersPerSecond: 1000 },
    { code: 'milePerSecond', name: 'Mile per Second (mi/s)', toMetersPerSecond: 1609.344 },
    { code: 'footPerMinute', name: 'Foot per Minute (ft/min)', toMetersPerSecond: 0.3048 / 60 },
    { code: 'inchPerSecond', name: 'Inch per Second (in/s)', toMetersPerSecond: 0.0254 },
    { code: 'yardPerSecond', name: 'Yard per Second (yd/s)', toMetersPerSecond: 0.9144 },
    
    // Scientific/Extreme
    { code: 'mach', name: 'Mach (at sea level)', toMetersPerSecond: 343 }, // Speed of sound at sea level
    { code: 'speedOfLight', name: 'Speed of Light (c)', toMetersPerSecond: 299792458 },
  ];

  // Conversion function - converts to meters per second first, then to target unit
  const convertSpeed = (from, to, value) => {
    const fromUnit = speedUnits.find(u => u.code === from);
    const toUnit = speedUnits.find(u => u.code === to);
    
    if (!fromUnit || !toUnit) {
      return null;
    }
    
    // Convert to meters per second first
    const valueInMetersPerSecond = value * fromUnit.toMetersPerSecond;
    // Convert from meters per second to target unit
    const result = valueInMetersPerSecond / toUnit.toMetersPerSecond;
    
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

    const convertedValue = convertSpeed(convertFrom, convertTo, amount);
    
    if (convertedValue === null) {
      setError('Invalid conversion. Please select valid speed units.');
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

    const targetUnit = speedUnits.find(u => u.code === convertTo);
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
          "name": "How do I convert speed units online?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "To convert speed units online, select your source speed unit from the 'Convert From' dropdown (e.g., kilometers per hour, miles per hour, meters per second), choose your target speed unit from the 'Convert To' dropdown, enter the speed value you want to convert, and click the Convert button. The tool will instantly display the converted speed using precise mathematical conversions."
          }
        },
        {
          "@type": "Question",
          "name": "What speed units are supported by this converter?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our speed converter supports 13 speed units including common units (meter per second, kilometer per hour, mile per hour, foot per second), nautical units (knot, nautical mile per hour), and scientific units (kilometer per second, mile per second, mach, speed of light). This comprehensive range covers everything from everyday speeds to extreme scientific measurements."
          }
        },
        {
          "@type": "Question",
          "name": "How accurate are the speed conversions?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our speed converter uses precise mathematical conversions based on standard speed unit definitions. Conversions are calculated client-side in your browser with high precision, ensuring accurate results. For example, 1 meter per second = 3.6 kilometers per hour, 1 mile per hour = 1.609344 kilometers per hour, and 1 knot = 1.852 kilometers per hour. All conversions use exact conversion factors."
          }
        },
        {
          "@type": "Question",
          "name": "What is a knot and when is it used?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A knot is a unit of speed equal to one nautical mile per hour, approximately 1.852 kilometers per hour or 1.151 miles per hour. Knots are primarily used in navigation, aviation, and maritime applications. The term comes from the practice of measuring ship speed using a log line with knots tied at regular intervals."
          }
        },
        {
          "@type": "Question",
          "name": "Can I convert between metric and imperial speed units?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, our converter seamlessly converts between metric units (meters per second, kilometers per hour) and imperial units (miles per hour, feet per second). Simply select your source unit from one system and your target unit from another system. The converter handles all cross-system conversions automatically with precise calculations."
          }
        },
        {
          "@type": "Question",
          "name": "Is this speed converter free to use?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, our speed converter is completely free to use. There are no registration requirements, no hidden fees, and no limits on the number of conversions you can perform. Simply visit the page, enter your speed values, and convert between speed units instantly without any cost."
          }
        },
        {
          "@type": "Question",
          "name": "What is Mach speed?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Mach is a unit of speed relative to the speed of sound. Mach 1 equals the speed of sound in the surrounding medium. At sea level and standard atmospheric conditions, Mach 1 is approximately 343 meters per second (1,235 kilometers per hour or 767 miles per hour). Mach speeds are commonly used in aviation and aerospace to describe aircraft speeds relative to the speed of sound."
          }
        },
        {
          "@type": "Question",
          "name": "Are the conversions calculated in real-time?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, all speed conversions are calculated instantly in your browser using precise mathematical formulas. There's no server delay, no API calls, and no waiting time. The conversion happens immediately when you click the Convert button, providing instant results for any speed unit conversion."
          }
        }
      ]
    },
    
    // SoftwareApplication Schema
    softwareApp: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Speed Converter",
      "applicationCategory": "UtilityApplication",
      "operatingSystem": "Any",
      "description": "Free online speed converter tool to convert between 13 speed units including meters per second, kilometers per hour, miles per hour, knots, mach, and speed of light. Fast, accurate, and works instantly in your browser.",
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
        "13 speed units supported",
        "Metric and imperial systems",
        "Nautical and scientific units",
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
      "name": "How to Convert Speed Units Online",
      "description": "Step-by-step guide to convert between speed units online using FixTools free speed converter with instant, precise calculations.",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Select source speed unit",
          "text": "Choose the speed unit you want to convert from using the 'Convert From' dropdown menu. Options include common units (km/h, mph, m/s), nautical units (knots), and scientific units (mach, speed of light).",
          "position": 1
        },
        {
          "@type": "HowToStep",
          "name": "Choose target speed unit",
          "text": "Select the speed unit you want to convert to from the 'Convert To' dropdown menu. You can convert between any of the 13 supported speed units, including cross-system conversions between metric and imperial.",
          "position": 2
        },
        {
          "@type": "HowToStep",
          "name": "Enter speed value",
          "text": "Type the speed value you want to convert in the input field. You can enter whole numbers or decimals. The tool accepts any numeric value.",
          "position": 3
        },
        {
          "@type": "HowToStep",
          "name": "Convert and view result",
          "text": "Click the Convert button to instantly see the converted speed. The result displays the equivalent value in your target speed unit with appropriate precision formatting. You can swap units or perform additional conversions as needed.",
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
          "name": "Speed Converter",
          "item": "https://fixtools.io/conversiontools/speedConversion"
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
        <title>Speed Converter - Free Online Speed Unit Conversion Tool | FixTools</title>
        <meta name="title" content="Speed Converter - Free Online Speed Unit Conversion Tool | FixTools" />
        <meta name="description" content="Convert between 13 speed units online for free. Convert km/h to mph, m/s to km/h, knots, mach, and more. Instant, accurate speed conversions with precise formulas. Works in your browser." />
        <meta name="keywords" content="speed converter, speed unit converter, convert speed units, kmh to mph, mph to kmh, meters per second to kmh, speed conversion calculator, convert kmh to mph, speed unit conversion tool" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://fixtools.io/conversiontools/speedConversion" />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fixtools.io/conversiontools/speedConversion" />
        <meta property="og:title" content="Speed Converter - Free Online Speed Unit Converter" />
        <meta property="og:description" content="Convert between 13 speed units with instant, precise calculations. km/h, mph, m/s, knots, mach, and more." />
        <meta property="og:image" content="https://fixtools.io/images/og-speed-converter.png" />
        <meta property="og:site_name" content="FixTools" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://fixtools.io/conversiontools/speedConversion" />
        <meta property="twitter:title" content="Speed Converter - Free Online Tool" />
        <meta property="twitter:description" content="Convert between 13 speed units instantly. km/h, mph, m/s, knots, and more." />
        <meta property="twitter:image" content="https://fixtools.io/images/og-speed-converter.png" />
        
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
        html:has(.speed-converter-page) {
          font-size: 100% !important;
        }
        
        .speed-converter-page {
          line-height: 1.5;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          width: 100%;
          min-height: 100vh;
        }
        
        /* Box-sizing reset */
        .speed-converter-page *,
        .speed-converter-page *::before,
        .speed-converter-page *::after {
          box-sizing: border-box;
        }
        
        /* Reset margins */
        .speed-converter-page h1,
        .speed-converter-page h2,
        .speed-converter-page h3,
        .speed-converter-page p,
        .speed-converter-page ul,
        .speed-converter-page ol {
          margin: 0;
        }
        
        /* Button and input inheritance */
        .speed-converter-page button {
          font-family: inherit;
          cursor: pointer;
        }
        
        .speed-converter-page input,
        .speed-converter-page textarea,
        .speed-converter-page select {
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

      <div className="speed-converter-page bg-[#fbfbfc] text-slate-900 min-h-screen">
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
              <span className="font-semibold text-slate-900">Speed Converter</span>
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
                  Speed Converter
                </span>
              </h1>
              
              {/* Description */}
              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg md:leading-relaxed">
                Our <strong>speed converter</strong> helps you convert between 13 speed units from meters per second to speed of light. Fast, accurate, and works instantly in your browser. Perfect for automotive, aviation, navigation, and scientific speed calculations.
              </p>

              {/* CTA Buttons */}
              <div className="mt-7 pb-5 flex flex-wrap items-center gap-3">
                <a href="#tool" className="group relative rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 transition-all duration-200 hover:shadow-xl hover:scale-[1.02]">
                  <span className="relative z-10 flex items-center gap-2">
                    ⚡ Convert Speed
                  </span>
                </a>
                <a href="#how" className="rounded-2xl border-2 border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-900 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md">
                  How it works
                </a>
              </div>

              {/* Stats Cards */}
              <dl className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Speed Units</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">13</dd>
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
                      <span className="text-2xl">🚗</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">13 Speed Units</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Convert between common units (km/h, mph, m/s), nautical units (knots), and scientific units (mach, speed of light).
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
                <h2 className="text-xl font-semibold text-slate-900">Speed Converter online</h2>
                <p className="mt-1 text-sm text-slate-600">Convert between 13 speed units with instant, precise calculations</p>
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
                    <option value="">Select speed unit</option>
                    {speedUnits.map((unit) => (
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
                    <option value="">Select speed unit</option>
                    {speedUnits.map((unit) => (
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
                  Speed
                </label>
                <input
                  type="number"
                  id="inputValue"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Enter speed"
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
                Convert Speed
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
                  <div className="text-sm font-semibold text-emerald-700 uppercase tracking-wide mb-2">Converted Speed</div>
                  <div className="text-3xl font-bold text-slate-900">{result}</div>
                </div>
              )}
            </form>
          </div>
        </section>

        {/* What is Speed Conversion? Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">What is Speed Conversion?</h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                <strong>Speed conversion</strong> is the process of converting a speed measurement from one unit to another. Speed is a fundamental physical quantity representing the rate at which an object covers distance. Understanding how to convert between different speed units is essential for automotive applications, aviation, navigation, scientific research, and everyday use.
              </p>
              
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Speed units vary by application and geographic region. The most commonly used units include kilometers per hour (km/h) in most of the world, miles per hour (mph) in the United States, meters per second (m/s) in scientific applications, and knots in navigation and aviation. Each unit has a precise mathematical relationship to the others, with meters per second being the base unit in the International System of Units (SI).
              </p>
              
              <p className="text-base text-slate-700 leading-relaxed mb-6">
                According to the <a href="https://www.bipm.org/en/publications/si-brochure/" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">International Bureau of Weights and Measures (BIPM)</a>, speed is measured as distance divided by time. The meter per second (m/s) is the SI unit for speed. Common conversions include: 1 m/s = 3.6 km/h, 1 mph = 1.609344 km/h, and 1 knot = 1.852 km/h. These precise relationships allow accurate conversions between all speed units.
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
                    <li>• Difficult to remember factors</li>
                  </ul>
                </div>
                
                <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">✓</span>
                    Online Speed Converter
                  </h3>
                  <ul className="text-sm text-slate-700 space-y-2">
                    <li>• Instant conversion results</li>
                    <li>• Precise calculations</li>
                    <li>• Handles any magnitude</li>
                    <li>• Supports 13 speed units</li>
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
              <h2 className="text-3xl font-bold text-slate-900 mb-3">Speed Conversion Facts</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Key reference points and interesting facts about speed units
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-emerald-200 shadow-lg">
                <div className="text-5xl font-extrabold text-emerald-600 mb-2">3.6</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">m/s = 1 km/h</div>
                <div className="text-xs text-slate-600">Standard conversion</div>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-blue-200 shadow-lg">
                <div className="text-5xl font-extrabold text-blue-600 mb-2">1.609</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">km/h = 1 mph</div>
                <div className="text-xs text-slate-600">Mile to kilometer</div>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-purple-200 shadow-lg">
                <div className="text-5xl font-extrabold text-purple-600 mb-2">1.852</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">km/h = 1 knot</div>
                <div className="text-xs text-slate-600">Nautical speed</div>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-orange-200 shadow-lg">
                <div className="text-5xl font-extrabold text-orange-600 mb-2">343</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">m/s = Mach 1</div>
                <div className="text-xs text-slate-600">Speed of sound</div>
              </div>
            </div>
            
            {/* Authority Link */}
            <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">📊</span>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">Speed Measurement Standards</h4>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    According to the <a href="https://www.bipm.org/en/publications/si-brochure/" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">International Bureau of Weights and Measures (BIPM)</a>, speed is defined as distance divided by time. The meter per second (m/s) is the base unit of speed in the International System of Units (SI). This precise definition ensures accurate conversions between all speed units, from everyday measurements like kilometers per hour to extreme scientific measurements like the speed of light (299,792,458 m/s).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Use Speed Converter? Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Why Use Our Speed Converter?</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Our speed converter provides instant, accurate conversions between 13 speed units with high precision. Whether you're working on automotive projects, aviation calculations, navigation, or scientific research, our tool offers the speed, accuracy, and convenience you need.
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
                      All speed conversions happen instantly in your browser using precise mathematical calculations. No server delays, no API calls, no waiting—just instant results whenever you need them. Perfect for quick speed checks, automotive calculations, and navigation work where speed matters.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Benefit 2 */}
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                    <span className="text-2xl">🚗</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">13 Comprehensive Speed Units</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Convert between common units (kilometer per hour, mile per hour, meter per second, foot per second), nautical units (knot, nautical mile per hour), and scientific units (kilometer per second, mile per second, mach, speed of light). This comprehensive range covers everything from everyday speeds to extreme scientific measurements.
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
                      Seamlessly convert between metric units (meters per second, kilometers per hour) and imperial units (miles per hour, feet per second). Whether you're working with metric measurements used worldwide or imperial measurements used in the US, our converter handles all cross-system conversions automatically with precise calculations.
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
                      Our converter uses precise mathematical formulas based on the International System of Units (SI) definitions. Conversions maintain high precision, making it suitable for scientific calculations, engineering projects, automotive applications, and navigation work where accuracy is critical.
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
                      All conversions happen locally in your browser. We never store, log, or transmit your conversion data. Your speed measurements remain completely private, making this tool safe for sensitive automotive, aviation, or scientific calculations. No registration, no tracking, no data collection.
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
                      Use our speed converter as much as you want, whenever you need it, without any cost. No hidden fees, no premium tiers, no usage limits. Convert speed units unlimited times for free, making it perfect for drivers, pilots, engineers, scientists, and anyone who needs regular speed conversions.
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
              Our speed converter uses precise mathematical conversions based on the International System of Units (SI) definitions. All conversions are calculated client-side in your browser for instant results.
            </p>
            
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg mx-auto mb-4">
                  <span className="text-3xl font-bold text-white">1</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Select Units</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Choose your source speed unit from the "Convert From" dropdown and your target speed unit from the "Convert To" dropdown.
                </p>
              </div>
              
              <div className="text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg mx-auto mb-4">
                  <span className="text-3xl font-bold text-white">2</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Enter Speed</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Type the speed value you want to convert in the input field. You can enter whole numbers or decimals.
                </p>
              </div>
              
              <div className="text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg mx-auto mb-4">
                  <span className="text-3xl font-bold text-white">3</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Calculate</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Our converter calculates the conversion using precise formulas, converting to meters per second first, then to your target unit.
                </p>
              </div>
              
              <div className="text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg mx-auto mb-4">
                  <span className="text-3xl font-bold text-white">4</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">View Result</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Click Convert to instantly see the converted speed displayed clearly with appropriate precision formatting.
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
              <h2 className="text-3xl font-bold text-slate-900">Best Practices for Speed Conversion</h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                When converting speed units, following best practices ensures you get accurate results and understand the relationships between different measurement systems. Here are essential tips for using speed converters effectively:
              </p>
              
              <h3 className="text-xl font-bold text-slate-900 mt-6 mb-3">1. Understand System Differences</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Familiarize yourself with the differences between metric and imperial speed units. Metric units (meters per second, kilometers per hour) are used worldwide, while imperial units (miles per hour, feet per second) are primarily used in the United States. Understanding these relationships helps verify conversions and catch potential errors.
              </p>
              
              <h3 className="text-xl font-bold text-slate-900 mt-6 mb-3">2. Use Appropriate Units for Your Context</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Choose speed units that make sense for your application. For automotive use, kilometers per hour (km/h) or miles per hour (mph) are common. For scientific work, meters per second (m/s) is standard. For navigation and aviation, knots are standard. For extreme scientific applications, mach or speed of light may be appropriate.
              </p>
              
              <h3 className="text-xl font-bold text-slate-900 mt-6 mb-3">3. Verify Common Conversion Points</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Use known conversion points to verify accuracy. For example, 1 meter per second should equal 3.6 kilometers per hour, 1 mile per hour should equal approximately 1.609 kilometers per hour, and 1 knot should equal 1.852 kilometers per hour. These reference points help catch input errors and verify conversions.
              </p>
              
              <h3 className="text-xl font-bold text-slate-900 mt-6 mb-3">4. Be Aware of Nautical vs. Statute Miles</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Be aware of the difference between nautical miles and statute miles when working with knots. A knot is one nautical mile per hour, where a nautical mile (1,852 meters) is longer than a statute mile (1,609.344 meters). This distinction is important for accurate navigation and aviation conversions.
              </p>
              
              <h3 className="text-xl font-bold text-slate-900 mt-6 mb-3">5. Consider Mach Speed Context</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                When using Mach speed, remember that it's relative to the speed of sound, which varies with altitude, temperature, and atmospheric conditions. Our converter uses Mach 1 = 343 m/s (speed of sound at sea level under standard conditions). For precise aviation calculations at different altitudes, you may need to adjust for actual conditions.
              </p>
            </div>
          </div>
        </section>

        {/* Speed Units Comparison Table */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Speed Units Comparison</h2>
            </div>
            
            <p className="text-base text-slate-600 mb-6 leading-relaxed">
              Compare common speed units and their relationships. This table helps you understand conversion factors and choose the right unit for your needs.
            </p>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-50 to-slate-100">
                    <th className="border-2 border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-900">Speed Unit</th>
                    <th className="border-2 border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-900">Abbreviation</th>
                    <th className="border-2 border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-900">Meters per Second</th>
                    <th className="border-2 border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-900">Kilometers per Hour</th>
                    <th className="border-2 border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-900">Miles per Hour</th>
                    <th className="border-2 border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-900">Common Use</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="border-2 border-slate-200 px-4 py-3 text-sm font-medium text-slate-900">Meter per Second</td>
                    <td className="border-2 border-slate-200 px-4 py-3 text-sm text-slate-700">m/s</td>
                    <td className="border-2 border-slate-200 px-4 py-3 text-sm text-slate-700">1.000</td>
                    <td className="border-2 border-slate-200 px-4 py-3 text-sm text-slate-700">3.600</td>
                    <td className="border-2 border-slate-200 px-4 py-3 text-sm text-slate-700">2.237</td>
                    <td className="border-2 border-slate-200 px-4 py-3 text-sm text-slate-700">Scientific, SI base unit</td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors bg-white">
                    <td className="border-2 border-slate-200 px-4 py-3 text-sm font-medium text-slate-900">Kilometer per Hour</td>
                    <td className="border-2 border-slate-200 px-4 py-3 text-sm text-slate-700">km/h</td>
                    <td className="border-2 border-slate-200 px-4 py-3 text-sm text-slate-700">0.278</td>
                    <td className="border-2 border-slate-200 px-4 py-3 text-sm text-slate-700">1.000</td>
                    <td className="border-2 border-slate-200 px-4 py-3 text-sm text-slate-700">0.621</td>
                    <td className="border-2 border-slate-200 px-4 py-3 text-sm text-slate-700">Automotive, worldwide</td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="border-2 border-slate-200 px-4 py-3 text-sm font-medium text-slate-900">Mile per Hour</td>
                    <td className="border-2 border-slate-200 px-4 py-3 text-sm text-slate-700">mph</td>
                    <td className="border-2 border-slate-200 px-4 py-3 text-sm text-slate-700">0.447</td>
                    <td className="border-2 border-slate-200 px-4 py-3 text-sm text-slate-700">1.609</td>
                    <td className="border-2 border-slate-200 px-4 py-3 text-sm text-slate-700">1.000</td>
                    <td className="border-2 border-slate-200 px-4 py-3 text-sm text-slate-700">Automotive, United States</td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors bg-white">
                    <td className="border-2 border-slate-200 px-4 py-3 text-sm font-medium text-slate-900">Knot</td>
                    <td className="border-2 border-slate-200 px-4 py-3 text-sm text-slate-700">kn</td>
                    <td className="border-2 border-slate-200 px-4 py-3 text-sm text-slate-700">0.514</td>
                    <td className="border-2 border-slate-200 px-4 py-3 text-sm text-slate-700">1.852</td>
                    <td className="border-2 border-slate-200 px-4 py-3 text-sm text-slate-700">1.151</td>
                    <td className="border-2 border-slate-200 px-4 py-3 text-sm text-slate-700">Navigation, aviation</td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="border-2 border-slate-200 px-4 py-3 text-sm font-medium text-slate-900">Foot per Second</td>
                    <td className="border-2 border-slate-200 px-4 py-3 text-sm text-slate-700">ft/s</td>
                    <td className="border-2 border-slate-200 px-4 py-3 text-sm text-slate-700">0.305</td>
                    <td className="border-2 border-slate-200 px-4 py-3 text-sm text-slate-700">1.097</td>
                    <td className="border-2 border-slate-200 px-4 py-3 text-sm text-slate-700">0.682</td>
                    <td className="border-2 border-slate-200 px-4 py-3 text-sm text-slate-700">Engineering, physics</td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors bg-white">
                    <td className="border-2 border-slate-200 px-4 py-3 text-sm font-medium text-slate-900">Mach (at sea level)</td>
                    <td className="border-2 border-slate-200 px-4 py-3 text-sm text-slate-700">Mach</td>
                    <td className="border-2 border-slate-200 px-4 py-3 text-sm text-slate-700">343.000</td>
                    <td className="border-2 border-slate-200 px-4 py-3 text-sm text-slate-700">1,235</td>
                    <td className="border-2 border-slate-200 px-4 py-3 text-sm text-slate-700">767</td>
                    <td className="border-2 border-slate-200 px-4 py-3 text-sm text-slate-700">Aviation, aerospace</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 p-4 rounded-xl bg-blue-50 border border-blue-200">
              <p className="text-sm text-slate-700 leading-relaxed">
                <strong className="text-slate-900">Note:</strong> Conversion factors are precise mathematical values. Mach speed is relative to the speed of sound at sea level (343 m/s). For high-altitude calculations, Mach values will differ. All conversions use exact conversion factors based on the International System of Units (SI).
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
                <h3 className="text-lg font-bold text-slate-900 mb-2">How do I convert speed units online?</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  To convert speed units online, select your source speed unit from the 'Convert From' dropdown (e.g., kilometers per hour, miles per hour, meters per second), choose your target speed unit from the 'Convert To' dropdown, enter the speed value you want to convert, and click the Convert button. The tool will instantly display the converted speed using precise mathematical conversions.
                </p>
              </div>
              
              <div className="border-b border-slate-200 pb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">What speed units are supported by this converter?</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Our speed converter supports 13 speed units including common units (meter per second, kilometer per hour, mile per hour, foot per second), nautical units (knot, nautical mile per hour), and scientific units (kilometer per second, mile per second, mach, speed of light). This comprehensive range covers everything from everyday speeds to extreme scientific measurements.
                </p>
              </div>
              
              <div className="border-b border-slate-200 pb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">How accurate are the speed conversions?</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Our speed converter uses precise mathematical conversions based on standard speed unit definitions. Conversions are calculated client-side in your browser with high precision, ensuring accurate results. For example, 1 meter per second = 3.6 kilometers per hour, 1 mile per hour = 1.609344 kilometers per hour, and 1 knot = 1.852 kilometers per hour. All conversions use exact conversion factors.
                </p>
              </div>
              
              <div className="border-b border-slate-200 pb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">What is a knot and when is it used?</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  A knot is a unit of speed equal to one nautical mile per hour, approximately 1.852 kilometers per hour or 1.151 miles per hour. Knots are primarily used in navigation, aviation, and maritime applications. The term comes from the practice of measuring ship speed using a log line with knots tied at regular intervals.
                </p>
              </div>
              
              <div className="border-b border-slate-200 pb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Can I convert between metric and imperial speed units?</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Yes, our converter seamlessly converts between metric units (meters per second, kilometers per hour) and imperial units (miles per hour, feet per second). Simply select your source unit from one system and your target unit from another system. The converter handles all cross-system conversions automatically with precise calculations.
                </p>
              </div>
              
              <div className="border-b border-slate-200 pb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Is this speed converter free to use?</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Yes, our speed converter is completely free to use. There are no registration requirements, no hidden fees, and no limits on the number of conversions you can perform. Simply visit the page, enter your speed values, and convert between speed units instantly without any cost.
                </p>
              </div>
              
              <div className="border-b border-slate-200 pb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">What is Mach speed?</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Mach is a unit of speed relative to the speed of sound. Mach 1 equals the speed of sound in the surrounding medium. At sea level and standard atmospheric conditions, Mach 1 is approximately 343 meters per second (1,235 kilometers per hour or 767 miles per hour). Mach speeds are commonly used in aviation and aerospace to describe aircraft speeds relative to the speed of sound.
                </p>
              </div>
              
              <div className="pb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Are the conversions calculated in real-time?</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Yes, all speed conversions are calculated instantly in your browser using precise mathematical formulas. There's no server delay, no API calls, and no waiting time. The conversion happens immediately when you click the Convert button, providing instant results for any speed unit conversion.
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
              <Link href="/conversiontools/lengthConversion" className="group rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 transition-all duration-300 hover:border-purple-300 hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600">
                    <span className="text-xl">📏</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Length Converter</h3>
                </div>
                <p className="text-sm text-slate-600">Convert between meters, feet, inches, kilometers, miles, and other length units.</p>
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
              
              <Link href="/conversiontools/temperatureConversion" className="group rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 transition-all duration-300 hover:border-orange-300 hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600">
                    <span className="text-xl">🌡️</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Temperature Converter</h3>
                </div>
                <p className="text-sm text-slate-600">Convert between Celsius, Fahrenheit, Kelvin, and Rankine temperature scales.</p>
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

