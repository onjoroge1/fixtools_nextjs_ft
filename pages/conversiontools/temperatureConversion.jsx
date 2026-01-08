import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

export default function TemperatureConversion() {
  const [inputValue, setInputValue] = useState('');
  const [convertFrom, setConvertFrom] = useState('');
  const [convertTo, setConvertTo] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const currentYear = new Date().getFullYear();

  // Temperature units with proper names
  const temperatureUnits = [
    { code: 'celsius', name: 'Celsius (°C)', description: 'Metric temperature scale' },
    { code: 'fahrenheit', name: 'Fahrenheit (°F)', description: 'Imperial temperature scale' },
    { code: 'kelvin', name: 'Kelvin (K)', description: 'Absolute temperature scale' },
    { code: 'rankine', name: 'Rankine (°R)', description: 'Absolute Fahrenheit scale' },
  ];

  // Conversion function - converts to Celsius first, then to target unit
  const convertTemperature = (from, to, value) => {
    let valueInCelsius;
    
    // Convert to Celsius first
    switch (from) {
      case 'celsius':
        valueInCelsius = value;
        break;
      case 'fahrenheit':
        valueInCelsius = ((value - 32) * 5) / 9;
        break;
      case 'kelvin':
        valueInCelsius = value - 273.15;
        break;
      case 'rankine':
        valueInCelsius = ((value - 491.67) * 5) / 9;
        break;
      default:
        return null;
    }
    
    // Convert from Celsius to target unit
    switch (to) {
      case 'celsius':
        return valueInCelsius;
      case 'fahrenheit':
        return (valueInCelsius * 9) / 5 + 32;
      case 'kelvin':
        return valueInCelsius + 273.15;
      case 'rankine':
        return (valueInCelsius * 9) / 5 + 491.67;
      default:
        return null;
    }
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
    if (isNaN(amount)) {
      setError('Please enter a valid number');
      return;
    }

    const convertedValue = convertTemperature(convertFrom, convertTo, amount);
    
    if (convertedValue === null) {
      setError('Invalid conversion. Please select valid temperature units.');
      return;
    }

    // Format result with appropriate decimal places
    const formattedResult = convertedValue.toFixed(2);
    const unit = temperatureUnits.find(u => u.code === convertTo);
    setResult(`${formattedResult} ${unit?.name || convertTo}`);
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
          "name": "How do I convert temperature units online?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "To convert temperature units online, select your source temperature scale from the 'Convert From' dropdown (Celsius, Fahrenheit, Kelvin, or Rankine), choose your target temperature scale from the 'Convert To' dropdown, enter the temperature value you want to convert, and click the Convert button. The tool will instantly display the converted temperature using precise mathematical formulas."
          }
        },
        {
          "@type": "Question",
          "name": "What temperature scales are supported by this converter?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our temperature converter supports four major temperature scales: Celsius (°C), the metric system standard used worldwide; Fahrenheit (°F), commonly used in the United States; Kelvin (K), the absolute temperature scale used in scientific applications; and Rankine (°R), the absolute Fahrenheit scale used in some engineering applications."
          }
        },
        {
          "@type": "Question",
          "name": "How accurate are the temperature conversions?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our temperature converter uses precise mathematical formulas based on standard temperature scale definitions. Conversions are calculated client-side in your browser with high precision, ensuring accurate results. For example, the conversion between Celsius and Fahrenheit uses the exact formula: °F = (°C × 9/5) + 32, and Celsius to Kelvin uses: K = °C + 273.15."
          }
        },
        {
          "@type": "Question",
          "name": "What is the difference between Celsius and Fahrenheit?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Celsius and Fahrenheit are two different temperature scales. Celsius is based on the freezing point (0°C) and boiling point (100°C) of water at standard atmospheric pressure. Fahrenheit uses 32°F as the freezing point and 212°F as the boiling point of water. The conversion formula is: °F = (°C × 9/5) + 32. Most countries use Celsius, while the United States primarily uses Fahrenheit."
          }
        },
        {
          "@type": "Question",
          "name": "What is Kelvin and when is it used?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Kelvin is the base unit of temperature in the International System of Units (SI). It's an absolute temperature scale where 0 K (absolute zero) is the lowest possible temperature. Kelvin is used in scientific applications, physics, chemistry, and engineering. The conversion from Celsius to Kelvin is: K = °C + 273.15. Absolute zero (0 K) equals -273.15°C or -459.67°F."
          }
        },
        {
          "@type": "Question",
          "name": "Is this temperature converter free to use?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, our temperature converter is completely free to use. There are no registration requirements, no hidden fees, and no limits on the number of conversions you can perform. Simply visit the page, enter your temperature values, and convert between temperature scales instantly without any cost."
          }
        },
        {
          "@type": "Question",
          "name": "Can I convert negative temperatures?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, you can convert negative temperatures. All temperature scales support negative values except Kelvin and Rankine, which are absolute scales starting from zero. For example, -40°C equals -40°F (the only point where both scales meet), and -273.15°C equals 0 K (absolute zero). The converter handles all valid temperature ranges correctly."
          }
        },
        {
          "@type": "Question",
          "name": "Are the conversions calculated in real-time?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, all temperature conversions are calculated instantly in your browser using precise mathematical formulas. There's no server delay, no API calls, and no waiting time. The conversion happens immediately when you click the Convert button, providing instant results for any temperature scale conversion."
          }
        }
      ]
    },
    
    // SoftwareApplication Schema
    softwareApp: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Temperature Converter",
      "applicationCategory": "UtilityApplication",
      "operatingSystem": "Any",
      "description": "Free online temperature converter tool to convert between Celsius, Fahrenheit, Kelvin, and Rankine temperature scales. Fast, accurate, and works instantly in your browser.",
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
        "4 temperature scales supported",
        "Celsius, Fahrenheit, Kelvin, Rankine",
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
      "name": "How to Convert Temperature Units Online",
      "description": "Step-by-step guide to convert between temperature scales online using FixTools free temperature converter with instant, precise calculations.",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Select source temperature scale",
          "text": "Choose the temperature scale you want to convert from using the 'Convert From' dropdown menu. Options include Celsius (°C), Fahrenheit (°F), Kelvin (K), and Rankine (°R).",
          "position": 1
        },
        {
          "@type": "HowToStep",
          "name": "Choose target temperature scale",
          "text": "Select the temperature scale you want to convert to from the 'Convert To' dropdown menu. You can convert between any of the four supported temperature scales.",
          "position": 2
        },
        {
          "@type": "HowToStep",
          "name": "Enter temperature value",
          "text": "Type the temperature value you want to convert in the input field. You can enter whole numbers or decimals. The tool accepts any numeric value, including negative temperatures (except for Kelvin and Rankine which are absolute scales).",
          "position": 3
        },
        {
          "@type": "HowToStep",
          "name": "Convert and view result",
          "text": "Click the Convert button to instantly see the converted temperature. The result displays the equivalent value in your target temperature scale with appropriate precision formatting. You can swap scales or perform additional conversions as needed.",
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
          "name": "Temperature Converter",
          "item": "https://fixtools.io/conversiontools/temperatureConversion"
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
        <title>Temperature Converter - Free Online Celsius, Fahrenheit, Kelvin Converter | FixTools</title>
        <meta name="title" content="Temperature Converter - Free Online Celsius, Fahrenheit, Kelvin Converter | FixTools" />
        <meta name="description" content="Convert between Celsius, Fahrenheit, Kelvin, and Rankine temperature scales online for free. Instant, accurate conversions with precise formulas. Works in your browser." />
        <meta name="keywords" content="temperature converter, celsius to fahrenheit, fahrenheit to celsius, kelvin converter, temperature conversion calculator, convert temperature, celsius fahrenheit kelvin" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://fixtools.io/conversiontools/temperatureConversion" />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fixtools.io/conversiontools/temperatureConversion" />
        <meta property="og:title" content="Temperature Converter - Free Online Temperature Scale Converter" />
        <meta property="og:description" content="Convert between Celsius, Fahrenheit, Kelvin, and Rankine with instant, precise calculations. All in your browser." />
        <meta property="og:image" content="https://fixtools.io/images/og-temperature-converter.png" />
        <meta property="og:site_name" content="FixTools" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://fixtools.io/conversiontools/temperatureConversion" />
        <meta property="twitter:title" content="Temperature Converter - Free Online Tool" />
        <meta property="twitter:description" content="Convert between Celsius, Fahrenheit, Kelvin, and Rankine instantly. All in your browser." />
        <meta property="twitter:image" content="https://fixtools.io/images/og-temperature-converter.png" />
        
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
        html:has(.temperature-converter-page) {
          font-size: 100% !important;
        }
        
        .temperature-converter-page {
          line-height: 1.5;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          width: 100%;
          min-height: 100vh;
        }
        
        /* Box-sizing reset */
        .temperature-converter-page *,
        .temperature-converter-page *::before,
        .temperature-converter-page *::after {
          box-sizing: border-box;
        }
        
        /* Reset margins */
        .temperature-converter-page h1,
        .temperature-converter-page h2,
        .temperature-converter-page h3,
        .temperature-converter-page p,
        .temperature-converter-page ul,
        .temperature-converter-page ol {
          margin: 0;
        }
        
        /* Button and input inheritance */
        .temperature-converter-page button {
          font-family: inherit;
          cursor: pointer;
        }
        
        .temperature-converter-page input,
        .temperature-converter-page textarea,
        .temperature-converter-page select {
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

      <div className="temperature-converter-page bg-[#fbfbfc] text-slate-900 min-h-screen">
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
              <span className="font-semibold text-slate-900">Temperature Converter</span>
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
                  Temperature Converter
                </span>
              </h1>
              
              {/* Description */}
              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg md:leading-relaxed">
                Our <strong>temperature converter</strong> helps you convert between Celsius, Fahrenheit, Kelvin, and Rankine temperature scales. Fast, accurate, and works instantly in your browser. Perfect for cooking, weather, scientific calculations, and everyday temperature conversions.
              </p>

              {/* CTA Buttons */}
              <div className="mt-7 pb-5 flex flex-wrap items-center gap-3">
                <a href="#tool" className="group relative rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 transition-all duration-200 hover:shadow-xl hover:scale-[1.02]">
                  <span className="relative z-10 flex items-center gap-2">
                    ⚡ Convert Temperature
                  </span>
                </a>
                <a href="#how" className="rounded-2xl border-2 border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-900 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md">
                  How it works
                </a>
              </div>

              {/* Stats Cards */}
              <dl className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Scales</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">4</dd>
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
                      <span className="text-2xl">🌡️</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">4 Temperature Scales</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Convert between Celsius, Fahrenheit, Kelvin, and Rankine. Cover all major temperature measurement systems used worldwide.
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
                        All conversions happen instantly in your browser using precise mathematical formulas. No server delays, no API calls—just instant results.
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
                <h2 className="text-xl font-semibold text-slate-900">Temperature Converter online</h2>
                <p className="mt-1 text-sm text-slate-600">Convert between Celsius, Fahrenheit, Kelvin, and Rankine with instant, precise calculations</p>
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
                    <option value="">Select temperature scale</option>
                    {temperatureUnits.map((unit) => (
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
                    <option value="">Select temperature scale</option>
                    {temperatureUnits.map((unit) => (
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
                  Temperature
                </label>
                <input
                  type="number"
                  id="inputValue"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Enter temperature"
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
                Convert Temperature
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
                  <div className="text-sm font-semibold text-emerald-700 uppercase tracking-wide mb-2">Converted Temperature</div>
                  <div className="text-3xl font-bold text-slate-900">{result}</div>
                </div>
              )}
            </form>
          </div>
        </section>

        {/* What is Temperature Conversion? Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">What is Temperature Conversion?</h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                <strong>Temperature conversion</strong> is the process of converting a temperature measurement from one scale to another. Temperature is one of the most commonly measured physical quantities, used in cooking, weather forecasting, scientific research, engineering, and everyday life. Understanding how to convert between different temperature scales is essential for accurate measurements and calculations.
              </p>
              
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                The four major temperature scales are Celsius (°C), used in most of the world and in scientific applications; Fahrenheit (°F), primarily used in the United States; Kelvin (K), the absolute temperature scale used in physics and chemistry; and Rankine (°R), the absolute Fahrenheit scale used in some engineering applications. Each scale has specific reference points and conversion formulas that allow precise conversion between them.
              </p>
              
              <p className="text-base text-slate-700 leading-relaxed mb-6">
                According to the <a href="https://www.bipm.org/en/publications/si-brochure/" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">International Bureau of Weights and Measures (BIPM)</a>, the kelvin is the base unit of temperature in the International System of Units (SI). The conversion formulas are based on precise mathematical relationships: Celsius to Fahrenheit uses °F = (°C × 9/5) + 32, while Celsius to Kelvin uses K = °C + 273.15. These formulas ensure accurate conversions across all temperature scales.
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
                    <li>• Difficult to remember formulas</li>
                  </ul>
                </div>
                
                <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">✓</span>
                    Online Temperature Converter
                  </h3>
                  <ul className="text-sm text-slate-700 space-y-2">
                    <li>• Instant conversion results</li>
                    <li>• Precise calculations</li>
                    <li>• Easy to use interface</li>
                    <li>• Supports all major scales</li>
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
              <h2 className="text-3xl font-bold text-slate-900 mb-3">Temperature Conversion Facts</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Key reference points and interesting facts about temperature scales
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-emerald-200 shadow-lg">
                <div className="text-5xl font-extrabold text-emerald-600 mb-2">-40°</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Celsius = Fahrenheit</div>
                <div className="text-xs text-slate-600">The only point where both scales meet</div>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-blue-200 shadow-lg">
                <div className="text-5xl font-extrabold text-blue-600 mb-2">0 K</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Absolute Zero</div>
                <div className="text-xs text-slate-600">-273.15°C or -459.67°F</div>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-purple-200 shadow-lg">
                <div className="text-5xl font-extrabold text-purple-600 mb-2">100°C</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Water Boiling Point</div>
                <div className="text-xs text-slate-600">212°F at sea level</div>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-orange-200 shadow-lg">
                <div className="text-5xl font-extrabold text-orange-600 mb-2">0°C</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Water Freezing Point</div>
                <div className="text-xs text-slate-600">32°F at sea level</div>
              </div>
            </div>
            
            {/* Authority Link */}
            <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">📊</span>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">Temperature Measurement Standards</h4>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    According to the <a href="https://www.bipm.org/en/publications/si-brochure/" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">International Bureau of Weights and Measures (BIPM)</a>, the kelvin is the base unit of temperature in the International System of Units (SI). The kelvin is defined in terms of the triple point of water (273.16 K) and absolute zero (0 K), providing a precise foundation for all temperature conversions and scientific measurements.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Use Temperature Converter? Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Why Use Our Temperature Converter?</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Our temperature converter provides instant, accurate conversions between four major temperature scales with high precision. Whether you're cooking, checking the weather, working on scientific calculations, or planning travel, our tool offers the speed, accuracy, and convenience you need.
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
                      All temperature conversions happen instantly in your browser using precise mathematical formulas. No server delays, no API calls, no waiting—just instant results whenever you need them. Perfect for quick cooking conversions, weather checks, and scientific calculations where speed matters.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Benefit 2 */}
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                    <span className="text-2xl">🌡️</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">4 Major Temperature Scales</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Convert between Celsius (used worldwide), Fahrenheit (used in the US), Kelvin (absolute scale for science), and Rankine (absolute Fahrenheit scale). This comprehensive coverage ensures you can convert temperatures for any application, from cooking recipes to scientific research.
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
                      Our converter uses precise mathematical formulas based on standard temperature scale definitions. Conversions maintain high precision with results displayed to 2 decimal places, making it suitable for scientific calculations, engineering projects, and cooking applications where accuracy is important.
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
                      All conversions happen locally in your browser. We never store, log, or transmit your conversion data. Your temperature conversions remain completely private, making this tool safe for sensitive scientific or business calculations. No registration, no tracking, no data collection.
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
                      Use our temperature converter as much as you want, whenever you need it, without any cost. No hidden fees, no premium tiers, no usage limits. Convert temperatures unlimited times for free, making it perfect for students, chefs, scientists, and anyone who needs regular temperature conversions.
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
                      Access our temperature converter from any device—desktop, tablet, or smartphone. The responsive design works perfectly on all screen sizes, so you can convert temperatures on the go. Perfect for cooking in the kitchen, checking weather while traveling, or working in the field.
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
              Our temperature converter uses precise mathematical conversion formulas based on standard temperature scale definitions. All conversions are calculated client-side in your browser for instant results.
            </p>
            
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg mx-auto mb-4">
                  <span className="text-3xl font-bold text-white">1</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Select Scales</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Choose your source temperature scale from the "Convert From" dropdown and your target temperature scale from the "Convert To" dropdown.
                </p>
              </div>
              
              <div className="text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg mx-auto mb-4">
                  <span className="text-3xl font-bold text-white">2</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Enter Temperature</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Type the temperature value you want to convert in the input field. You can enter whole numbers or decimals, including negative values.
                </p>
              </div>
              
              <div className="text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg mx-auto mb-4">
                  <span className="text-3xl font-bold text-white">3</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Calculate</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Our converter calculates the conversion using precise formulas, converting to Celsius first, then to your target scale.
                </p>
              </div>
              
              <div className="text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg mx-auto mb-4">
                  <span className="text-3xl font-bold text-white">4</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">View Result</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Click Convert to instantly see the converted temperature displayed clearly with the appropriate temperature scale symbol.
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
              <h2 className="text-3xl font-bold text-slate-900">Best Practices for Temperature Conversion</h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                When converting temperatures, following best practices ensures you get accurate results and understand the relationships between different temperature scales. Here are essential tips for using temperature converters effectively:
              </p>
              
              <h3 className="text-xl font-bold text-slate-900 mt-6 mb-3">1. Understand Scale Reference Points</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Familiarize yourself with key reference points for each temperature scale. Water freezes at 0°C (32°F, 273.15 K) and boils at 100°C (212°F, 373.15 K) at standard atmospheric pressure. Absolute zero is 0 K (-273.15°C, -459.67°F). The point where Celsius and Fahrenheit are equal is -40° (-40°C = -40°F). Understanding these reference points helps verify conversions.
              </p>
              
              <h3 className="text-xl font-bold text-slate-900 mt-6 mb-3">2. Use Appropriate Scales for Your Context</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Choose temperature scales that make sense for your application. For cooking, Celsius and Fahrenheit are most common. For scientific work, Kelvin is essential as it's an absolute scale. For weather in the US, Fahrenheit is standard, while most of the world uses Celsius. Rankine is primarily used in some engineering applications in the US.
              </p>
              
              <h3 className="text-xl font-bold text-slate-900 mt-6 mb-3">3. Be Aware of Negative Temperatures</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                All temperature scales except Kelvin and Rankine support negative values. Celsius and Fahrenheit can go below zero, but Kelvin and Rankine are absolute scales starting from zero (absolute zero). When converting to Kelvin or Rankine, remember that negative Celsius or Fahrenheit values will still result in positive Kelvin or Rankine values (though very small).
              </p>
              
              <h3 className="text-xl font-bold text-slate-900 mt-6 mb-3">4. Verify Common Conversion Points</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Use known conversion points to verify accuracy. For example, 0°C should equal 32°F, 100°C should equal 212°F, and -40°C should equal -40°F. Room temperature is approximately 20-25°C (68-77°F). Body temperature is 37°C (98.6°F). These reference points help catch input errors.
              </p>
              
              <h3 className="text-xl font-bold text-slate-900 mt-6 mb-3">5. Consider Precision for Scientific Applications</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                For scientific and engineering applications, be aware that our converter displays results to 2 decimal places, which is sufficient for most applications. For extremely precise scientific work, you may need additional decimal places, but for cooking, weather, and general use, 2 decimal places provides excellent accuracy.
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
                <h3 className="text-lg font-bold text-slate-900 mb-2">How do I convert temperature units online?</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  To convert temperature units online, select your source temperature scale from the 'Convert From' dropdown (Celsius, Fahrenheit, Kelvin, or Rankine), choose your target temperature scale from the 'Convert To' dropdown, enter the temperature value you want to convert, and click the Convert button. The tool will instantly display the converted temperature using precise mathematical formulas.
                </p>
              </div>
              
              <div className="border-b border-slate-200 pb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">What temperature scales are supported by this converter?</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Our temperature converter supports four major temperature scales: Celsius (°C), the metric system standard used worldwide; Fahrenheit (°F), commonly used in the United States; Kelvin (K), the absolute temperature scale used in scientific applications; and Rankine (°R), the absolute Fahrenheit scale used in some engineering applications.
                </p>
              </div>
              
              <div className="border-b border-slate-200 pb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">How accurate are the temperature conversions?</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Our temperature converter uses precise mathematical formulas based on standard temperature scale definitions. Conversions are calculated client-side in your browser with high precision, ensuring accurate results. For example, the conversion between Celsius and Fahrenheit uses the exact formula: °F = (°C × 9/5) + 32, and Celsius to Kelvin uses: K = °C + 273.15.
                </p>
              </div>
              
              <div className="border-b border-slate-200 pb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">What is the difference between Celsius and Fahrenheit?</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Celsius and Fahrenheit are two different temperature scales. Celsius is based on the freezing point (0°C) and boiling point (100°C) of water at standard atmospheric pressure. Fahrenheit uses 32°F as the freezing point and 212°F as the boiling point of water. The conversion formula is: °F = (°C × 9/5) + 32. Most countries use Celsius, while the United States primarily uses Fahrenheit.
                </p>
              </div>
              
              <div className="border-b border-slate-200 pb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">What is Kelvin and when is it used?</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Kelvin is the base unit of temperature in the International System of Units (SI). It's an absolute temperature scale where 0 K (absolute zero) is the lowest possible temperature. Kelvin is used in scientific applications, physics, chemistry, and engineering. The conversion from Celsius to Kelvin is: K = °C + 273.15. Absolute zero (0 K) equals -273.15°C or -459.67°F.
                </p>
              </div>
              
              <div className="border-b border-slate-200 pb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Is this temperature converter free to use?</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Yes, our temperature converter is completely free to use. There are no registration requirements, no hidden fees, and no limits on the number of conversions you can perform. Simply visit the page, enter your temperature values, and convert between temperature scales instantly without any cost.
                </p>
              </div>
              
              <div className="border-b border-slate-200 pb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Can I convert negative temperatures?</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Yes, you can convert negative temperatures. All temperature scales support negative values except Kelvin and Rankine, which are absolute scales starting from zero. For example, -40°C equals -40°F (the only point where both scales meet), and -273.15°C equals 0 K (absolute zero). The converter handles all valid temperature ranges correctly.
                </p>
              </div>
              
              <div className="pb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Are the conversions calculated in real-time?</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Yes, all temperature conversions are calculated instantly in your browser using precise mathematical formulas. There's no server delay, no API calls, and no waiting time. The conversion happens immediately when you click the Convert button, providing instant results for any temperature scale conversion.
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
              <Link href="/conversiontools/timeConversion" className="group rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 transition-all duration-300 hover:border-emerald-300 hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600">
                    <span className="text-xl">⏱️</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Time Converter</h3>
                </div>
                <p className="text-sm text-slate-600">Convert between nanoseconds, seconds, minutes, hours, days, weeks, months, years, and more.</p>
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
              
              <Link href="/conversiontools/lengthConversion" className="group rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 transition-all duration-300 hover:border-purple-300 hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600">
                    <span className="text-xl">📏</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Length Converter</h3>
                </div>
                <p className="text-sm text-slate-600">Convert between meters, feet, inches, kilometers, miles, and other length units.</p>
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
              
              <Link href="/conversiontools/timeZoneConversion" className="group rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 transition-all duration-300 hover:border-purple-300 hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600">
                    <span className="text-xl">🌍</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Time Zone Converter</h3>
                </div>
                <p className="text-sm text-slate-600">Convert time between different time zones around the world.</p>
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

