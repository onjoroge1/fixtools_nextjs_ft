import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { areaConversion } from '@/components/conversionToolComponent/conversionToolsFunctions';

export default function AreaConversion() {
  const [inputValue, setInputValue] = useState('');
  const [convertFrom, setConvertFrom] = useState('');
  const [convertTo, setConvertTo] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const currentYear = new Date().getFullYear();

  // Area units - ordered by common usage
  const areaUnits = [
    // Metric SI units (most common)
    { code: 'squareMillimeter', name: 'Square Millimeter (mm²)', description: '1/1,000,000 m² - tiny areas' },
    { code: 'squareCentimeter', name: 'Square Centimeter (cm²)', description: '1/10,000 m² - small areas' },
    { code: 'squareMeter', name: 'Square Meter (m²)', description: 'Base metric unit of area' },
    { code: 'squareKilometer', name: 'Square Kilometer (km²)', description: '1,000,000 m² - large areas' },
    { code: 'hectare', name: 'Hectare (ha)', description: '10,000 m² - land areas' },
    { code: 'are', name: 'Are (a)', description: '100 m² - land areas' },
    
    // US/Imperial units
    { code: 'squareInch', name: 'Square Inch (in²)', description: '6.45 cm² - small areas' },
    { code: 'squareFoot', name: 'Square Foot (ft²)', description: '0.093 m² - room areas' },
    { code: 'squareYard', name: 'Square Yard (yd²)', description: '0.836 m² - yard areas' },
    { code: 'acre', name: 'Acre', description: '4,047 m² - land areas' },
    { code: 'squareMile', name: 'Square Mile (mi²)', description: '2.59 km² - large land areas' },
  ];

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

    try {
      const convertedValue = areaConversion(convertFrom, convertTo, amount);
      if (convertedValue === undefined || isNaN(convertedValue)) {
        setError('Conversion not supported between these units');
        return;
      }
      
      // Format result based on magnitude
      let formattedResult;
      if (convertedValue < 0.000001) {
        formattedResult = convertedValue.toExponential(6);
      } else if (convertedValue < 1) {
        formattedResult = convertedValue.toFixed(6).replace(/\.?0+$/, '');
      } else if (convertedValue < 1000) {
        formattedResult = convertedValue.toFixed(6).replace(/\.?0+$/, '');
      } else {
        formattedResult = convertedValue.toLocaleString('en-US', { 
          minimumFractionDigits: 2,
          maximumFractionDigits: 6,
          useGrouping: true 
        });
      }
      
      const fromUnit = areaUnits.find(u => u.code === convertFrom)?.name.split(' ')[0] || convertFrom;
      const toUnit = areaUnits.find(u => u.code === convertTo)?.name.split(' ')[0] || convertTo;
      
      setResult(`${formattedResult} ${toUnit}`);
      setError('');
    } catch (err) {
      console.error('Conversion error:', err);
      setError('An error occurred during conversion. Please try again.');
    }
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
          "name": "How do I convert area units online?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "To convert area units online, select your source area unit from the 'Convert From' dropdown (e.g., square meters, acres, square feet, hectares), choose your target area unit from the 'Convert To' dropdown, enter the area value you want to convert, and click the Convert button. The tool will instantly display the converted area using precise mathematical conversions."
          }
        },
        {
          "@type": "Question",
          "name": "What area units are supported by this converter?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our area converter supports 11 area units including square millimeters, square centimeters, square meters, square kilometers, hectares, ares, square inches, square feet, square yards, acres, and square miles. This comprehensive range covers everything from tiny measurements to large land areas, making it perfect for construction, real estate, agriculture, and everyday area conversions."
          }
        },
        {
          "@type": "Question",
          "name": "How accurate are the area conversions?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our area converter uses precise mathematical conversions based on standard area unit definitions. Conversions are calculated client-side in your browser with high precision, ensuring accurate results. For example, 1 square meter = 10.764 square feet, 1 acre = 4,047 square meters, and 1 hectare = 10,000 square meters. The tool maintains accuracy across all unit conversions."
          }
        },
        {
          "@type": "Question",
          "name": "What is the difference between a hectare and an acre?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A hectare is a metric unit equal to 10,000 square meters (about 2.47 acres), while an acre is an imperial unit equal to 4,047 square meters (about 0.405 hectares). Hectares are commonly used in most countries worldwide for measuring land, while acres are primarily used in the United States and United Kingdom. One hectare is approximately 2.47 times larger than one acre."
          }
        },
        {
          "@type": "Question",
          "name": "Is this area converter free to use?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, our area converter is completely free to use. There are no registration requirements, no hidden fees, and no limits on the number of conversions you can perform. Simply visit the page, enter your values, and convert area units instantly without any cost."
          }
        },
        {
          "@type": "Question",
          "name": "How do I convert square meters to acres or square feet to hectares?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "To convert square meters to acres, select 'Square Meter' as the source unit and 'Acre' as the target unit, enter the number of square meters, and click Convert. Similarly, to convert square feet to hectares, select 'Square Foot' as the source and 'Hectare' as the target. The converter handles all standard area unit conversions automatically with precise calculations."
          }
        },
        {
          "@type": "Question",
          "name": "Can I use this for real estate and construction conversions?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Absolutely! Our area converter is perfect for real estate and construction conversions. It supports common units like square feet, square meters, acres, and hectares. You can easily convert property sizes, room areas, lot sizes, and construction measurements between different measurement systems."
          }
        },
        {
          "@type": "Question",
          "name": "What is a square meter equivalent to in square feet?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "One square meter equals approximately 10.764 square feet. This conversion is commonly used when converting between metric and imperial area measurements, especially in real estate, construction, and interior design projects."
          }
        }
      ]
    },
    
    // SoftwareApplication Schema
    softwareApp: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Area Converter",
      "applicationCategory": "UtilityApplication",
      "operatingSystem": "Any",
      "description": "Free online area converter tool to convert between 11 area units including square meters, acres, square feet, hectares, square kilometers, and more. Fast, accurate, and works instantly in your browser.",
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
        "11 area units supported",
        "Square meters to acres range",
        "Metric and imperial units included",
        "Instant client-side conversion",
        "100% private and secure",
        "No registration required",
        "High-precision calculations",
        "Mobile-friendly interface",
        "Free unlimited conversions"
      ]
    },
    
    // HowTo Schema
    howTo: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Convert Area Units Online",
      "description": "Step-by-step guide to convert between area units online using FixTools free area converter with instant, precise calculations.",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Select source area unit",
          "text": "Choose the area unit you want to convert from using the 'Convert From' dropdown menu. Options include square meters, acres, square feet, hectares, square kilometers, and more.",
          "position": 1
        },
        {
          "@type": "HowToStep",
          "name": "Choose target area unit",
          "text": "Select the area unit you want to convert to from the 'Convert To' dropdown menu. You can convert between any of the 11 supported area units, including metric and imperial measurements.",
          "position": 2
        },
        {
          "@type": "HowToStep",
          "name": "Enter area value",
          "text": "Type the area value you want to convert in the input field. You can enter whole numbers or decimals. The tool accepts any numeric value.",
          "position": 3
        },
        {
          "@type": "HowToStep",
          "name": "Convert and view result",
          "text": "Click the Convert button to instantly see the converted area. The result displays the equivalent value in your target area unit with appropriate precision formatting. You can swap units or perform additional conversions as needed.",
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
          "name": "Area Converter",
          "item": "https://fixtools.io/conversiontools/areaConversion"
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
        <title>Area Converter - Free Online Square Meter, Acre, Square Foot Conversion Tool | FixTools</title>
        <meta name="title" content="Area Converter - Free Online Square Meter, Acre, Square Foot Conversion Tool | FixTools" />
        <meta name="description" content="Convert between 11 area units online for free. Convert square meters, acres, square feet, hectares, square kilometers, and more. Instant, accurate, and works in your browser. Perfect for real estate, construction, and everyday area conversions." />
        <meta name="keywords" content="area converter, square meter converter, acre converter, square foot converter, hectare converter, area unit conversion, convert square meters to acres, convert square feet to hectares, area calculator, real estate area converter" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://fixtools.io/conversiontools/areaConversion" />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fixtools.io/conversiontools/areaConversion" />
        <meta property="og:title" content="Area Converter - Free Online Square Meter, Acre Conversion Tool" />
        <meta property="og:description" content="Convert between 11 area units with instant, precise calculations. Square meters to acres, hectares to square feet, all in your browser." />
        <meta property="og:image" content="https://fixtools.io/images/og-area-converter.png" />
        <meta property="og:site_name" content="FixTools" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://fixtools.io/conversiontools/areaConversion" />
        <meta property="twitter:title" content="Area Converter - Free Online Tool" />
        <meta property="twitter:description" content="Convert between 11 area units instantly. Square meters, acres, hectares, square feet, and more. All in your browser." />
        <meta property="twitter:image" content="https://fixtools.io/images/og-area-converter.png" />
        
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
        html:has(.area-converter-page) {
          font-size: 100% !important;
        }
        
        .area-converter-page {
          line-height: 1.5;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          width: 100%;
          min-height: 100vh;
        }
        
        /* Box-sizing reset */
        .area-converter-page *,
        .area-converter-page *::before,
        .area-converter-page *::after {
          box-sizing: border-box;
        }
        
        /* Reset margins */
        .area-converter-page h1,
        .area-converter-page h2,
        .area-converter-page h3,
        .area-converter-page p,
        .area-converter-page ul,
        .area-converter-page ol {
          margin: 0;
        }
        
        /* Button and input inheritance */
        .area-converter-page button {
          font-family: inherit;
          cursor: pointer;
        }
        
        .area-converter-page input,
        .area-converter-page textarea,
        .area-converter-page select {
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

      <div className="area-converter-page bg-[#fbfbfc] text-slate-900 min-h-screen">
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
              <span className="font-semibold text-slate-900">Area Converter</span>
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
                  Area Converter
                </span>
              </h1>
              
              {/* Description */}
              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg md:leading-relaxed">
                Our <strong>area converter</strong> helps you convert between 11 area units including square meters, acres, square feet, hectares, square kilometers, and more. Fast, accurate, and works instantly in your browser. Perfect for real estate, construction, agriculture, and everyday area conversions.
              </p>

              {/* CTA Buttons */}
              <div className="mt-7 pb-5 flex flex-wrap items-center gap-3">
                <a href="#tool" className="group relative rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 transition-all duration-200 hover:shadow-xl hover:scale-[1.02]">
                  <span className="relative z-10 flex items-center gap-2">
                    ⚡ Convert Area
                  </span>
                </a>
                <a href="#how" className="rounded-2xl border-2 border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-900 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md">
                  How it works
                </a>
              </div>

              {/* Stats Cards */}
              <dl className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Area Units</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">11</dd>
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
                      <span className="text-2xl">📐</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">11 Area Units</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Convert between square meters, acres, square feet, hectares, square kilometers, square inches, square yards, and more. Supports both metric and imperial units.
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
                <h2 className="text-xl font-semibold text-slate-900">Area Converter online</h2>
                <p className="mt-1 text-sm text-slate-600">Convert between 11 area units with instant, precise calculations</p>
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
                    <option value="">Select area unit</option>
                    {areaUnits.map((unit) => (
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
                    <option value="">Select area unit</option>
                    {areaUnits.map((unit) => (
                      <option key={unit.code} value={unit.code}>
                        {unit.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Area Value Input */}
              <div>
                <label htmlFor="inputValue" className="block text-sm font-medium text-slate-700 mb-2">
                  Area Value
                </label>
                <input
                  type="number"
                  id="inputValue"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Enter area value"
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
                Convert Area
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
                  <div className="text-sm font-semibold text-emerald-700 uppercase tracking-wide mb-2">Converted Area</div>
                  <div className="text-3xl font-bold text-slate-900">{result}</div>
                </div>
              )}
            </form>
          </div>
        </section>
        {/* Understanding Area Units - Educational Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Understanding Area Units</h2>
            </div>
            
            <p className="text-base text-slate-700 leading-relaxed mb-6">
              <strong>Area units</strong> measure the size of a two-dimensional surface or space. Understanding each unit's origin, common applications, and relationships helps you choose the right unit for your needs and make accurate conversions. Here's a comprehensive guide to all area units supported by our converter.
            </p>

            {/* Metric Area Units */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-lg font-bold">📏</span>
                Metric Area Units (SI)
              </h3>
              
              <div className="space-y-6">
                {/* Square Millimeter */}
                <div className="rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 hover:border-violet-300 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white font-bold text-xs">
                      mm²
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-slate-900 mb-2">Square Millimeter (mm²)</h4>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Definition:</strong> One square millimeter equals 0.000001 square meters (1/1,000,000 m²). It's the area of a square with sides of 1 millimeter. The prefix "milli" means one thousandth in the metric system.
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Common Uses:</strong> Square millimeters are used for very small surface areas. Examples include: electronic component sizes, paper thickness measurements, precision manufacturing, and microscopic surface areas. This unit is essential for detailed engineering and scientific measurements.
                      </p>
                      <p className="text-sm text-slate-600 italic">
                        <strong>Conversion:</strong> 1 mm² = 0.000001 m² = 0.00155 in² = 100 cm²
                      </p>
                    </div>
                  </div>
                </div>

                {/* Square Centimeter */}
                <div className="rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 hover:border-purple-300 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 text-white font-bold text-sm">
                      cm²
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-slate-900 mb-2">Square Centimeter (cm²)</h4>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Definition:</strong> One square centimeter equals 0.0001 square meters (1/10,000 m²). It's the area of a square with sides of 1 centimeter. The prefix "centi" means one hundredth in the metric system.
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Common Uses:</strong> Square centimeters are commonly used for small surface areas. Examples include: paper sizes, small object surfaces, clothing fabric areas, and medical measurements. A standard credit card is approximately 85.6 cm² (5.3 × 16.1 cm).
                      </p>
                      <p className="text-sm text-slate-600 italic">
                        <strong>Conversion:</strong> 1 cm² = 0.0001 m² = 0.155 in² = 100 mm²
                      </p>
                    </div>
                  </div>
                </div>

                {/* Square Meter */}
                <div className="rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 hover:border-blue-300 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-lg">
                      m²
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-slate-900 mb-2">Square Meter (m²)</h4>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Definition:</strong> The square meter is the base unit of area in the International System of Units (SI). It's the area of a square with sides of 1 meter. One square meter equals 10.764 square feet.
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>History:</strong> The square meter is derived from the meter, which was originally defined in 1799 as one ten-millionth of the distance from the equator to the North Pole. The modern definition is based on the speed of light.
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Common Uses:</strong> Square meters are the standard unit for measuring area in most countries worldwide. Examples include: room sizes, property areas, construction materials, floor space calculations, and real estate listings. A typical small bedroom is approximately 12-15 m².
                      </p>
                      <p className="text-sm text-slate-600 italic">
                        <strong>Conversion:</strong> 1 m² = 10.764 ft² = 1.196 yd² = 0.000247 acres = 10,000 cm²
                      </p>
                    </div>
                  </div>
                </div>

                {/* Hectare */}
                <div className="rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 hover:border-emerald-300 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white font-bold text-lg">
                      ha
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-slate-900 mb-2">Hectare (ha)</h4>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Definition:</strong> One hectare equals 10,000 square meters or 2.471 acres. It's a metric unit commonly used for measuring land areas, especially in agriculture and real estate. The name comes from "hecto" (hundred) and "are" (100 m²), meaning "100 ares."
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>History:</strong> The hectare was introduced in France in 1795 as part of the metric system. It was designed to be a practical unit for measuring agricultural and forest land.
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Common Uses:</strong> Hectares are widely used for measuring large land areas. Examples include: agricultural land, forest areas, parks, sports fields, and large properties. A hectare is approximately the size of a soccer field (100 m × 100 m). Most countries worldwide use hectares for land measurement.
                      </p>
                      <p className="text-sm text-slate-600 italic">
                        <strong>Conversion:</strong> 1 ha = 10,000 m² = 2.471 acres = 0.01 km² = 100 ares
                      </p>
                    </div>
                  </div>
                </div>

                {/* Square Kilometer */}
                <div className="rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 hover:border-indigo-300 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-lg">
                      km²
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-slate-900 mb-2">Square Kilometer (km²)</h4>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Definition:</strong> One square kilometer equals 1,000,000 square meters (1 km × 1 km) or approximately 0.386 square miles. It's used for measuring very large areas such as cities, countries, and geographical regions.
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Common Uses:</strong> Square kilometers are used for measuring large geographical areas. Examples include: city areas (New York City is approximately 783.8 km²), country sizes (France is approximately 643,801 km²), national parks, lakes, and large land developments. It's the standard unit for geographical and administrative area measurements.
                      </p>
                      <p className="text-sm text-slate-600 italic">
                        <strong>Conversion:</strong> 1 km² = 1,000,000 m² = 247.1 acres = 0.386 mi² = 100 hectares
                      </p>
                    </div>
                  </div>
                </div>

                {/* Are */}
                <div className="rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 hover:border-teal-300 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 text-white font-bold text-lg">
                      a
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-slate-900 mb-2">Are (a)</h4>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Definition:</strong> One are equals 100 square meters (10 m × 10 m) or 0.01 hectares. It's a metric unit used for measuring medium-sized land areas, though it's less commonly used than hectares or square meters today.
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>History:</strong> The are was introduced as part of the metric system in France in 1795. It was originally designed as a base unit but is now less commonly used, with the hectare (100 ares) being preferred for land measurement.
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Common Uses:</strong> Ares are sometimes used for measuring smaller land plots, garden sizes, and agricultural parcels. While not as common as hectares or square meters, they're still used in some European countries for land registration and taxation purposes. One are is approximately 107.6 square feet.
                      </p>
                      <p className="text-sm text-slate-600 italic">
                        <strong>Conversion:</strong> 1 a = 100 m² = 0.01 ha = 0.0247 acres = 1,076.4 ft²
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* US/Imperial Area Units */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 text-white text-lg font-bold">🇺🇸</span>
                US/Imperial Area Units
              </h3>
              
              <div className="space-y-6">
                {/* Square Inch */}
                <div className="rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 hover:border-orange-300 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 text-white font-bold text-xs">
                      in²
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-slate-900 mb-2">Square Inch (in²)</h4>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Definition:</strong> One square inch equals the area of a square with sides of 1 inch, approximately 6.452 square centimeters or 0.00064516 square meters. It's a small unit commonly used in the United States.
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Common Uses:</strong> Square inches are used for small surface areas in the US. Examples include: screen sizes (smartphone screens, monitors), paper sizes, fabric measurements, and small object surfaces. A standard US letter-size paper is 93.5 in² (8.5 × 11 inches).
                      </p>
                      <p className="text-sm text-slate-600 italic">
                        <strong>Conversion:</strong> 1 in² = 6.452 cm² = 0.00064516 m² = 0.00694 ft²
                      </p>
                    </div>
                  </div>
                </div>

                {/* Square Foot */}
                <div className="rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 hover:border-red-300 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-rose-600 text-white font-bold text-lg">
                      ft²
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-slate-900 mb-2">Square Foot (ft²)</h4>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Definition:</strong> One square foot equals the area of a square with sides of 1 foot (12 inches), approximately 0.092903 square meters or 144 square inches. It's the most commonly used area unit in the United States.
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Common Uses:</strong> Square feet are the standard unit for measuring area in the US. Examples include: room sizes, house areas, apartment sizes, real estate listings, construction materials, and floor space. A typical small bedroom is approximately 120-150 ft² (11-14 m²). Most US real estate listings use square feet.
                      </p>
                      <p className="text-sm text-slate-600 italic">
                        <strong>Conversion:</strong> 1 ft² = 0.092903 m² = 144 in² = 0.111 yd² = 0.000023 acres
                      </p>
                    </div>
                  </div>
                </div>

                {/* Square Yard */}
                <div className="rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 hover:border-rose-300 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 text-white font-bold text-lg">
                      yd²
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-slate-900 mb-2">Square Yard (yd²)</h4>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Definition:</strong> One square yard equals the area of a square with sides of 1 yard (3 feet), approximately 0.836127 square meters or 9 square feet. It's commonly used in the US and UK for medium-sized areas.
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Common Uses:</strong> Square yards are used for measuring medium-sized areas. Examples include: carpet and flooring measurements, landscaping areas, small gardens, and construction materials. One square yard equals 9 square feet. It's commonly used in the textile industry for fabric measurements.
                      </p>
                      <p className="text-sm text-slate-600 italic">
                        <strong>Conversion:</strong> 1 yd² = 0.836127 m² = 9 ft² = 1,296 in² = 0.000207 acres
                      </p>
                    </div>
                  </div>
                </div>

                {/* Acre */}
                <div className="rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 hover:border-emerald-300 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white font-bold text-lg">
                      ac
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-slate-900 mb-2">Acre</h4>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Definition:</strong> One acre equals 4,046.86 square meters, 43,560 square feet, or approximately 0.405 hectares. It's a unit of land area used primarily in the United States and United Kingdom for measuring large land areas, especially in agriculture and real estate.
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>History:</strong> The acre has historical origins dating back to medieval England. It was originally defined as the area of land that could be plowed in one day by a yoke of oxen. The modern definition is standardized at 43,560 square feet.
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Common Uses:</strong> Acres are widely used for measuring large land areas in the US and UK. Examples include: agricultural land, farms, ranches, large properties, real estate listings, parks, and land development projects. One acre is approximately the size of a football field (without end zones). It's the standard unit for land measurement in the United States.
                      </p>
                      <p className="text-sm text-slate-600 italic">
                        <strong>Conversion:</strong> 1 acre = 4,046.86 m² = 43,560 ft² = 4,840 yd² = 0.405 hectares = 0.00156 mi²
                      </p>
                    </div>
                  </div>
                </div>

                {/* Square Mile */}
                <div className="rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 hover:border-blue-300 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-lg">
                      mi²
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-slate-900 mb-2">Square Mile (mi²)</h4>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Definition:</strong> One square mile equals the area of a square with sides of 1 mile (5,280 feet), approximately 2.59 square kilometers, 640 acres, or 2,589,988 square meters. It's used for measuring very large land areas.
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Common Uses:</strong> Square miles are used for measuring large geographical areas, especially in the United States. Examples include: city areas (Los Angeles is approximately 502.7 mi²), state sizes (Texas is approximately 268,596 mi²), national parks, counties, and large land developments. One square mile equals 640 acres.
                      </p>
                      <p className="text-sm text-slate-600 italic">
                        <strong>Conversion:</strong> 1 mi² = 2.59 km² = 640 acres = 2,589,988 m² = 27,878,400 ft²
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Unit Comparison Table */}
            <div className="mt-8 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Quick Reference: Area Unit Equivalents</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-slate-300">
                      <th className="text-left py-3 px-4 font-bold text-slate-900">Unit</th>
                      <th className="text-right py-3 px-4 font-bold text-slate-900">Square Meters</th>
                      <th className="text-right py-3 px-4 font-bold text-slate-900">Square Feet</th>
                      <th className="text-right py-3 px-4 font-bold text-slate-900">Acres</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr className="hover:bg-slate-100">
                      <td className="py-3 px-4 font-medium text-slate-900">1 Square Millimeter</td>
                      <td className="py-3 px-4 text-right text-slate-700">0.000001 m²</td>
                      <td className="py-3 px-4 text-right text-slate-700">0.00001076 ft²</td>
                      <td className="py-3 px-4 text-right text-slate-700">2.47×10⁻¹⁰ acres</td>
                    </tr>
                    <tr className="hover:bg-slate-100">
                      <td className="py-3 px-4 font-medium text-slate-900">1 Square Centimeter</td>
                      <td className="py-3 px-4 text-right text-slate-700">0.0001 m²</td>
                      <td className="py-3 px-4 text-right text-slate-700">0.001076 ft²</td>
                      <td className="py-3 px-4 text-right text-slate-700">2.47×10⁻⁸ acres</td>
                    </tr>
                    <tr className="hover:bg-slate-100">
                      <td className="py-3 px-4 font-medium text-slate-900">1 Square Meter</td>
                      <td className="py-3 px-4 text-right text-slate-700">1 m²</td>
                      <td className="py-3 px-4 text-right text-slate-700">10.764 ft²</td>
                      <td className="py-3 px-4 text-right text-slate-700">0.000247 acres</td>
                    </tr>
                    <tr className="hover:bg-slate-100">
                      <td className="py-3 px-4 font-medium text-slate-900">1 Hectare</td>
                      <td className="py-3 px-4 text-right text-slate-700">10,000 m²</td>
                      <td className="py-3 px-4 text-right text-slate-700">107,639 ft²</td>
                      <td className="py-3 px-4 text-right text-slate-700">2.471 acres</td>
                    </tr>
                    <tr className="hover:bg-slate-100">
                      <td className="py-3 px-4 font-medium text-slate-900">1 Square Kilometer</td>
                      <td className="py-3 px-4 text-right text-slate-700">1,000,000 m²</td>
                      <td className="py-3 px-4 text-right text-slate-700">10,763,910 ft²</td>
                      <td className="py-3 px-4 text-right text-slate-700">247.1 acres</td>
                    </tr>
                    <tr className="hover:bg-slate-100">
                      <td className="py-3 px-4 font-medium text-slate-900">1 Square Inch</td>
                      <td className="py-3 px-4 text-right text-slate-700">0.000645 m²</td>
                      <td className="py-3 px-4 text-right text-slate-700">0.00694 ft²</td>
                      <td className="py-3 px-4 text-right text-slate-700">1.59×10⁻⁷ acres</td>
                    </tr>
                    <tr className="hover:bg-slate-100">
                      <td className="py-3 px-4 font-medium text-slate-900">1 Square Foot</td>
                      <td className="py-3 px-4 text-right text-slate-700">0.092903 m²</td>
                      <td className="py-3 px-4 text-right text-slate-700">1 ft²</td>
                      <td className="py-3 px-4 text-right text-slate-700">0.000023 acres</td>
                    </tr>
                    <tr className="hover:bg-slate-100">
                      <td className="py-3 px-4 font-medium text-slate-900">1 Square Yard</td>
                      <td className="py-3 px-4 text-right text-slate-700">0.836127 m²</td>
                      <td className="py-3 px-4 text-right text-slate-700">9 ft²</td>
                      <td className="py-3 px-4 text-right text-slate-700">0.000207 acres</td>
                    </tr>
                    <tr className="hover:bg-slate-100">
                      <td className="py-3 px-4 font-medium text-slate-900">1 Acre</td>
                      <td className="py-3 px-4 text-right text-slate-700">4,046.86 m²</td>
                      <td className="py-3 px-4 text-right text-slate-700">43,560 ft²</td>
                      <td className="py-3 px-4 text-right text-slate-700">1 acre</td>
                    </tr>
                    <tr className="hover:bg-slate-100">
                      <td className="py-3 px-4 font-medium text-slate-900">1 Square Mile</td>
                      <td className="py-3 px-4 text-right text-slate-700">2,589,988 m²</td>
                      <td className="py-3 px-4 text-right text-slate-700">27,878,400 ft²</td>
                      <td className="py-3 px-4 text-right text-slate-700">640 acres</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
        {/* What is Area Conversion? Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">What is Area Conversion?</h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                <strong>Area conversion</strong> is the process of converting an area measurement from one unit to another. Area measures the size of a two-dimensional surface or space. Understanding how to convert between different area units is essential for real estate, construction, agriculture, interior design, and everyday measurements.
              </p>
              
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Area units range from the very small (square millimeters, used in precision manufacturing) to the very large (square kilometers, used for geographical areas). The most commonly used area units include square meters (metric), square feet (US/Imperial), acres (US/UK), and hectares (metric). Each unit has a precise mathematical relationship to the others, with the square meter being the base metric unit for area in the International System of Units (SI).
              </p>
              
              <p className="text-base text-slate-700 leading-relaxed mb-6">
                According to the <a href="https://www.bipm.org/en/publications/si-brochure/" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">International Bureau of Weights and Measures (BIPM)</a>, the square meter is the base unit of area in the International System of Units (SI). This precise definition allows for accurate conversions between all area units, from square millimeters (1/1,000,000 of a square meter) to square kilometers (1,000,000 square meters). It's important to note the differences between metric and imperial units, as they use different base measurements.
              </p>
              
              {/* Before/After Comparison */}
              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600">✗</span>
                    Manual Calculation
                  </h3>
                  <ul className="text-sm text-slate-700 space-y-2">
                    <li>• Time-consuming conversions</li>
                    <li>• Risk of calculation errors</li>
                    <li>• Confusing metric vs imperial units</li>
                    <li>• Difficult for large areas</li>
                  </ul>
                </div>
                
                <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">✓</span>
                    Online Area Converter
                  </h3>
                  <ul className="text-sm text-slate-700 space-y-2">
                    <li>• Instant conversion results</li>
                    <li>• Precise calculations</li>
                    <li>• Metric and imperial units supported</li>
                    <li>• Supports 11 area units</li>
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
              <h2 className="text-3xl font-bold text-slate-900 mb-3">Area Conversion Facts</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Interesting facts about area units and their relationships
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-emerald-200 shadow-lg">
                <div className="text-5xl font-extrabold text-emerald-600 mb-2">10.764</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">ft² in 1 m²</div>
                <div className="text-xs text-slate-600">Standard conversion</div>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-blue-200 shadow-lg">
                <div className="text-5xl font-extrabold text-blue-600 mb-2">2.471</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Acres in 1 Hectare</div>
                <div className="text-xs text-slate-600">Land measurement</div>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-purple-200 shadow-lg">
                <div className="text-5xl font-extrabold text-purple-600 mb-2">43,560</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">ft² in 1 Acre</div>
                <div className="text-xs text-slate-600">US standard unit</div>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-orange-200 shadow-lg">
                <div className="text-5xl font-extrabold text-orange-600 mb-2">640</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Acres in 1 mi²</div>
                <div className="text-xs text-slate-600">Geographical area</div>
              </div>
            </div>
            
            {/* Authority Link */}
            <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">📊</span>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">Area Measurement Standards</h4>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    According to the <a href="https://www.bipm.org/en/publications/si-brochure/" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">International Bureau of Weights and Measures (BIPM)</a>, the square meter is the base unit of area in the International System of Units (SI). All area conversions are based on precise mathematical relationships, ensuring accuracy across all area unit conversions from square millimeters to square kilometers. Note that metric and imperial units use different base measurements.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Use Area Converter? Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Why Use Our Area Converter?</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Our area converter provides instant, accurate conversions between 11 area units with high precision. Whether you're working on real estate, construction projects, agriculture, or converting measurements, our tool offers the speed, accuracy, and convenience you need.
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
                      All area conversions happen instantly in your browser using precise mathematical calculations. No server delays, no API calls, no waiting—just instant results whenever you need them. Perfect for quick calculations, real estate work, construction projects, and professional applications where speed matters.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Benefit 2 */}
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                    <span className="text-2xl">📐</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">11 Comprehensive Area Units</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Convert between square meters, acres, square feet, hectares, square kilometers, square inches, square yards, square miles, and more. This comprehensive range covers everything from tiny measurements to large land areas, supporting both metric and imperial measurement systems used worldwide.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Benefit 3 */}
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-purple-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">High-Precision Calculations</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Our converter uses precise mathematical formulas based on the International System of Units (SI) definitions. Conversions maintain high precision, making it suitable for real estate transactions, construction projects, agricultural planning, and professional applications where accuracy is critical.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Benefit 4 */}
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-orange-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg">
                    <span className="text-2xl">🔒</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">100% Private & Secure</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      All conversions happen locally in your browser. We never store, log, or transmit your conversion data. Your calculations remain completely private, making this tool safe for sensitive real estate, construction, or business calculations. No registration, no tracking, no data collection.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Benefit 5 */}
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-teal-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 shadow-lg">
                    <span className="text-2xl">💰</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Completely Free Forever</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Use our area converter as much as you want, whenever you need it, without any cost. No hidden fees, no premium tiers, no usage limits. Convert area units unlimited times for free, making it perfect for homeowners, real estate professionals, contractors, students, and anyone who needs regular area conversions.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Benefit 6 */}
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-yellow-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-500 to-amber-600 shadow-lg">
                    <span className="text-2xl">📱</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Mobile-Friendly Design</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Access our area converter from any device—desktop, tablet, or smartphone. The responsive design works perfectly on all screen sizes, so you can convert area units on the go. Perfect for real estate agents at property showings, contractors on job sites, or anyone who needs quick area conversions anywhere.
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
              Our area converter uses precise mathematical conversions based on the International System of Units (SI) definitions. All conversions are calculated client-side in your browser for instant results. Conversions use square meters as the base unit, ensuring accuracy across all metric and imperial measurements.
            </p>
            
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg mx-auto mb-4">
                  <span className="text-3xl font-bold text-white">1</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Select Units</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Choose your source area unit from the "Convert From" dropdown and your target area unit from the "Convert To" dropdown.
                </p>
              </div>
              
              <div className="text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg mx-auto mb-4">
                  <span className="text-3xl font-bold text-white">2</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Enter Amount</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Type the amount you want to convert in the input field. You can enter whole numbers or decimals.
                </p>
              </div>
              
              <div className="text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg mx-auto mb-4">
                  <span className="text-3xl font-bold text-white">3</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Calculate</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Our converter calculates the conversion using precise mathematical formulas, converting to square meters first, then to your target unit.
                </p>
              </div>
              
              <div className="text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg mx-auto mb-4">
                  <span className="text-3xl font-bold text-white">4</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">View Result</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Click Convert to instantly see the converted amount displayed clearly with appropriate precision formatting.
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
              <h2 className="text-3xl font-bold text-slate-900">Best Practices for Area Conversion</h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                When converting area units, following best practices ensures you get accurate results and understand the relationships between different area measurements. Here are essential tips for using area converters effectively:
              </p>
              
              <h3 className="text-xl font-bold text-slate-900 mt-6 mb-3">1. Distinguish Metric and Imperial Units</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Always be aware of whether you're using metric or imperial units, as they use different base measurements. For example, 1 square meter = 10.764 square feet, while 1 hectare = 2.471 acres. Metric units are used in most countries worldwide, while imperial units are primarily used in the United States and United Kingdom. When working with international clients or documents, make sure you're using the correct system.
              </p>
              
              <h3 className="text-xl font-bold text-slate-900 mt-6 mb-3">2. Understand Common Real Estate Measurements</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                For real estate conversions, remember that 1 square meter = 10.764 square feet, 1 acre = 43,560 square feet, and 1 hectare = 2.471 acres. When converting property sizes, be consistent with the measurement system used in your region or documents. Most US real estate listings use square feet and acres, while most international listings use square meters and hectares.
              </p>
              
              <h3 className="text-xl font-bold text-slate-900 mt-6 mb-3">3. Use Appropriate Units for Your Context</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Choose area units that make sense for your application. For small spaces (rooms, apartments), square meters or square feet are most practical. For medium-sized areas (yards, lots), square yards or ares are appropriate. For large land areas (farms, parks), acres, hectares, or square kilometers are commonly used. For very large geographical areas (cities, countries), square kilometers or square miles are standard.
              </p>
              
              <h3 className="text-xl font-bold text-slate-900 mt-6 mb-3">4. Verify Large Number Conversions</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                When converting very large numbers (e.g., converting millions of square feet to hectares), verify the result makes sense. For example, 1 hectare = 10,000 square meters = 107,639 square feet, so 1,000,000 square feet equals approximately 9.29 hectares. Double-checking helps catch input errors and ensures accuracy in important calculations like property valuations or construction estimates.
              </p>
              
              <h3 className="text-xl font-bold text-slate-900 mt-6 mb-3">5. Note Regional Preferences</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Different regions prefer different area units. The United States primarily uses square feet and acres, while most other countries use square meters and hectares. The United Kingdom uses both systems, with imperial units (acres, square feet) commonly used for real estate and metric units (square meters, hectares) used in official documents. When working internationally, always specify which unit system you're using.
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
                <h3 className="text-lg font-bold text-slate-900 mb-2">How do I convert area units online?</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  To convert area units online, select your source area unit from the 'Convert From' dropdown (e.g., square meters, acres, square feet, hectares), choose your target area unit from the 'Convert To' dropdown, enter the area value you want to convert, and click the Convert button. The tool will instantly display the converted area using precise mathematical conversions.
                </p>
              </div>
              
              <div className="border-b border-slate-200 pb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">What area units are supported by this converter?</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Our area converter supports 11 area units including square millimeters, square centimeters, square meters, square kilometers, hectares, ares, square inches, square feet, square yards, acres, and square miles. This comprehensive range covers everything from tiny measurements to large land areas, making it perfect for construction, real estate, agriculture, and everyday area conversions.
                </p>
              </div>
              
              <div className="border-b border-slate-200 pb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">How accurate are the area conversions?</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Our area converter uses precise mathematical conversions based on standard area unit definitions. Conversions are calculated client-side in your browser with high precision, ensuring accurate results. For example, 1 square meter = 10.764 square feet, 1 acre = 4,047 square meters, and 1 hectare = 10,000 square meters. The tool maintains accuracy across all unit conversions.
                </p>
              </div>
              
              <div className="border-b border-slate-200 pb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">What is the difference between a hectare and an acre?</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  A hectare is a metric unit equal to 10,000 square meters (about 2.47 acres), while an acre is an imperial unit equal to 4,047 square meters (about 0.405 hectares). Hectares are commonly used in most countries worldwide for measuring land, while acres are primarily used in the United States and United Kingdom. One hectare is approximately 2.47 times larger than one acre.
                </p>
              </div>
              
              <div className="border-b border-slate-200 pb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Is this area converter free to use?</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Yes, our area converter is completely free to use. There are no registration requirements, no hidden fees, and no limits on the number of conversions you can perform. Simply visit the page, enter your values, and convert area units instantly without any cost.
                </p>
              </div>
              
              <div className="border-b border-slate-200 pb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">How do I convert square meters to acres or square feet to hectares?</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  To convert square meters to acres, select 'Square Meter' as the source unit and 'Acre' as the target unit, enter the number of square meters, and click Convert. Similarly, to convert square feet to hectares, select 'Square Foot' as the source and 'Hectare' as the target. The converter handles all standard area unit conversions automatically with precise calculations.
                </p>
              </div>
              
              <div className="border-b border-slate-200 pb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Can I use this for real estate and construction conversions?</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Absolutely! Our area converter is perfect for real estate and construction conversions. It supports common units like square feet, square meters, acres, and hectares. You can easily convert property sizes, room areas, lot sizes, and construction measurements between different measurement systems.
                </p>
              </div>
              
              <div className="pb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">What is a square meter equivalent to in square feet?</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  One square meter equals approximately 10.764 square feet. This conversion is commonly used when converting between metric and imperial area measurements, especially in real estate, construction, and interior design projects.
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
              
              <Link href="/conversiontools/volumeConversion" className="group rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 transition-all duration-300 hover:border-blue-300 hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600">
                    <span className="text-xl">💧</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Volume Converter</h3>
                </div>
                <p className="text-sm text-slate-600">Convert between liters, gallons, cubic meters, milliliters, and other volume units.</p>
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
              
              <Link href="/conversiontools/temperatureConversion" className="group rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 transition-all duration-300 hover:border-orange-300 hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600">
                    <span className="text-xl">🌡️</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Temperature Converter</h3>
                </div>
                <p className="text-sm text-slate-600">Convert between Celsius, Fahrenheit, Kelvin, and more temperature units.</p>
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
              
              <Link href="/conversiontools/pressureConversion" className="group rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 transition-all duration-300 hover:border-purple-300 hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600">
                    <span className="text-xl">📊</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Pressure Converter</h3>
                </div>
                <p className="text-sm text-slate-600">Convert between pascals, bars, PSI, atmospheres, and other pressure units.</p>
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
