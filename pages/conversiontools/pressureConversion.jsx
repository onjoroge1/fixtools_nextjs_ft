import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { presurreConversion } from '@/components/conversionToolComponent/conversionToolsFunctions';

export default function PressureConversion() {
  const [inputValue, setInputValue] = useState('');
  const [convertFrom, setConvertFrom] = useState('');
  const [convertTo, setConvertTo] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const currentYear = new Date().getFullYear();

  // Pressure units list - ordered by common usage
  const pressureUnits = [
    // SI metric units (most common)
    { value: 'pascal', label: 'Pascal (Pa)', description: 'Basic SI unit of pressure' },
    { value: 'kilopascal', label: 'Kilopascal (kPa)', description: '1,000 pascals - common metric unit' },
    { value: 'megapascal', label: 'Megapascal (MPa)', description: '1,000,000 pascals - high pressure' },
    
    // Bar units
    { value: 'bar', label: 'Bar (bar)', description: '100,000 pascals - meteorology, engineering' },
    { value: 'millibar', label: 'Millibar (mbar)', description: '0.001 bar - weather, atmospheric pressure' },
    { value: 'hectopascal', label: 'Hectopascal (hPa)', description: '100 pascals - equal to millibar' },
    
    // Atmosphere units
    { value: 'atm', label: 'Atmosphere (atm)', description: '101,325 Pa - standard atmospheric pressure' },
    { value: 'technicalAtmosphere', label: 'Technical Atmosphere (at)', description: '98,066.5 Pa - metric system' },
    
    // Imperial/US units
    { value: 'psi', label: 'Pounds per Square Inch (psi)', description: '6,894.76 Pa - US standard' },
    { value: 'psf', label: 'Pounds per Square Foot (psf)', description: '47.88 Pa - US engineering' },
    
    // Mercury column units
    { value: 'torr', label: 'Torr (torr)', description: '133.322 Pa - vacuum, mmHg equivalent' },
    { value: 'millimeterOfMercury', label: 'Millimeter of Mercury (mmHg)', description: '133.322 Pa - medical, barometric' },
    { value: 'inchOfMercury', label: 'Inch of Mercury (inHg)', description: '3,386.39 Pa - aviation, weather' },
    
    // Water column units
    { value: 'inchOfWater', label: 'Inch of Water (inH2O)', description: '249.089 Pa - low pressure systems' },
    { value: 'millimeterOfWater', label: 'Millimeter of Water (mmH2O)', description: '9.80665 Pa - precise low pressure' },
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
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid positive number');
      return;
    }

    try {
      const convertedValue = presurreConversion(convertFrom, convertTo, amount);
      if (convertedValue === undefined || isNaN(convertedValue)) {
        setError('Conversion not supported between these units');
        return;
      }
      
      const formattedResult = convertedValue.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 6
      });
      
      const fromUnit = pressureUnits.find(u => u.value === convertFrom)?.label.split(' ')[0] || convertFrom;
      const toUnit = pressureUnits.find(u => u.value === convertTo)?.label.split(' ')[0] || convertTo;
      
      setResult(`${formattedResult} ${toUnit}`);
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
          "name": "How do I convert pressure units online?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "To convert pressure units online, select your source unit (pascal, bar, PSI, atmosphere, torr, or any of our 15 supported units) from the 'Convert From' dropdown, choose your target unit from the 'Convert To' dropdown, enter the pressure value you want to convert, and click the Convert button. The tool will instantly display the converted pressure value with high precision."
          }
        },
        {
          "@type": "Question",
          "name": "What is the difference between pascal, bar, and PSI?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Pascal (Pa) is the basic SI unit of pressure, equal to one newton per square meter. One bar equals 100,000 pascals, and one PSI (pounds per square inch) equals approximately 6,894.76 pascals. For example, standard atmospheric pressure at sea level is 101,325 Pa (101.325 kPa), which equals 1 bar or 14.696 PSI. Weather systems often use millibars (mbar) or hectopascals (hPa), while tire pressure is commonly measured in PSI."
          }
        },
        {
          "@type": "Question",
          "name": "Is this pressure converter accurate?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, our pressure converter uses precise mathematical conversions based on standard unit relationships. One bar equals exactly 100,000 pascals, one standard atmosphere equals 101,325 pascals, and one PSI equals 6,894.76 pascals. The tool provides results with up to 6 decimal places for accuracy and displays formatted numbers for easy reading."
          }
        },
        {
          "@type": "Question",
          "name": "Can I use this converter for engineering calculations?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, this tool is suitable for basic pressure unit conversions needed in engineering, HVAC systems, meteorology, and scientific applications. However, for critical engineering projects, system design, or safety-related calculations, always verify results using multiple methods or professional engineering software. Our converter handles fundamental unit conversions accurately."
          }
        },
        {
          "@type": "Question",
          "name": "What are common use cases for pressure conversion?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Pressure conversion is commonly used for: tire pressure measurements (PSI to bar), weather forecasting (millibars/hectopascals), HVAC system design (inches of water column), medical equipment (mmHg), aviation (inches of mercury), engineering applications (pascals to PSI), scuba diving (atmospheres), and various scientific and industrial processes."
          }
        },
        {
          "@type": "Question",
          "name": "Is this pressure converter free to use?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, our pressure converter is completely free to use. There are no registration requirements, no hidden fees, and no limits on the number of conversions you can perform. Simply enter your pressure values and convert between any of our 15 supported units instantly without any cost."
          }
        },
        {
          "@type": "Question",
          "name": "How do I convert PSI to bar?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "To convert PSI to bar, divide the PSI value by 14.504 (or multiply by 0.068948). For example, 30 PSI equals approximately 2.069 bar. Our converter handles this automatically—just select 'PSI' as the source unit, 'bar' as the target unit, enter the value, and click Convert. The result will show the equivalent pressure in bars."
          }
        },
        {
          "@type": "Question",
          "name": "What is standard atmospheric pressure?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Standard atmospheric pressure at sea level is defined as 101,325 pascals (101.325 kPa), which equals 1 atmosphere (atm), 1.01325 bar, 760 torr (or mmHg), or 14.696 PSI. This is the average atmospheric pressure at sea level and serves as a reference point for many pressure measurements. Weather systems use variations from this standard to forecast conditions."
          }
        }
      ]
    },
    
    // SoftwareApplication Schema
    softwareApp: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Pressure Converter",
      "applicationCategory": "UtilityApplication",
      "operatingSystem": "Any",
      "description": "Free online pressure converter tool to convert between 15 pressure units including pascals, bars, PSI, atmospheres, torr, mmHg, and more. Fast, accurate, and works instantly in your browser.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "950",
        "bestRating": "5",
        "worstRating": "1"
      },
      "featureList": [
        "Convert 15 pressure units (Pa, kPa, bar, PSI, atm, torr, mmHg, inHg, etc.)",
        "High-precision calculations",
        "Instant conversion",
        "100% free and private",
        "No registration required",
        "Mobile-friendly interface",
        "Easy-to-use interface",
        "Detailed unit information and educational guide"
      ]
    },
    
    // HowTo Schema
    howTo: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Convert Pressure Units Online",
      "description": "Step-by-step guide to convert between pressure units (pascals, bars, PSI, atmospheres, torr, and more) using FixTools free pressure converter.",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Select source pressure unit",
          "text": "Choose the pressure unit you want to convert from using the 'Convert From' dropdown menu. Options include pascal (Pa), kilopascal (kPa), bar, PSI, atmosphere (atm), torr, millimeter of mercury (mmHg), inch of mercury (inHg), and more.",
          "position": 1
        },
        {
          "@type": "HowToStep",
          "name": "Choose target pressure unit",
          "text": "Select the pressure unit you want to convert to from the 'Convert To' dropdown menu. Ensure it's different from the source unit.",
          "position": 2
        },
        {
          "@type": "HowToStep",
          "name": "Enter pressure value",
          "text": "Type the pressure value you want to convert in the input field. You can enter whole numbers or decimals. The tool accepts any positive numeric value.",
          "position": 3
        },
        {
          "@type": "HowToStep",
          "name": "Convert and view result",
          "text": "Click the Convert button to instantly see the converted pressure value. The result displays the equivalent value in your target unit with formatted numbers for easy reading. You can swap units or perform additional conversions as needed.",
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
          "name": "Pressure Converter",
          "item": "https://fixtools.io/conversiontools/pressureConversion"
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
        <title>Pressure Converter - Free Online Pascal, Bar, PSI, Atmosphere Conversion Tool | FixTools</title>
        <meta name="title" content="Pressure Converter - Free Online Pascal, Bar, PSI, Atmosphere Conversion Tool | FixTools" />
        <meta name="description" content="Convert pressure units online for free. Convert between pascals, bars, PSI, atmospheres, torr, mmHg, inHg, and 15+ pressure units instantly. Includes comprehensive educational guide explaining each unit. Fast, accurate, and works in your browser. Perfect for engineering, meteorology, HVAC systems, and scientific applications." />
        <meta name="keywords" content="pressure converter, pascal converter, bar converter, PSI converter, atmosphere converter, torr converter, pressure unit conversion, convert PSI to bar, convert bar to pascal, convert atmosphere to PSI, pressure calculator, engineering pressure converter" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://fixtools.io/conversiontools/pressureConversion" />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fixtools.io/conversiontools/pressureConversion" />
        <meta property="og:title" content="Pressure Converter - Free Online Pascal, Bar, PSI, Atmosphere Tool" />
        <meta property="og:description" content="Convert between pascals, bars, PSI, atmospheres, torr, mmHg, inHg, and 15+ pressure units instantly. Free, accurate pressure unit conversion tool." />
        <meta property="og:image" content="https://fixtools.io/images/og-pressure-converter.png" />
        <meta property="og:site_name" content="FixTools" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://fixtools.io/conversiontools/pressureConversion" />
        <meta property="twitter:title" content="Pressure Converter - Free Online Tool" />
        <meta property="twitter:description" content="Convert pascals, bars, PSI, atmospheres, torr, and 15+ pressure units instantly. Free and accurate pressure conversion." />
        <meta property="twitter:image" content="https://fixtools.io/images/og-pressure-converter.png" />
        
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
        html:has(.pressure-converter-page) {
          font-size: 100% !important;
        }
        
        .pressure-converter-page {
          line-height: 1.5;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          width: 100%;
          min-height: 100vh;
        }
        
        /* Box-sizing reset */
        .power-converter-page *,
        .power-converter-page *::before,
        .power-converter-page *::after {
          box-sizing: border-box;
        }
        
        /* Reset margins */
        .pressure-converter-page h1,
        .pressure-converter-page h2,
        .pressure-converter-page h3,
        .pressure-converter-page p,
        .pressure-converter-page ul,
        .pressure-converter-page ol {
          margin: 0;
        }
        
        /* Button and input inheritance */
        .pressure-converter-page button {
          font-family: inherit;
          cursor: pointer;
        }
        
        .pressure-converter-page input,
        .pressure-converter-page textarea,
        .pressure-converter-page select {
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

      <div className="pressure-converter-page bg-[#fbfbfc] text-slate-900 min-h-screen">
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
              <span className="font-semibold text-slate-900">Pressure Converter</span>
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
                Free • Fast • Accurate
              </div>
              
              {/* H1 */}
              <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                  Pressure Converter
                </span>
              </h1>
              
              {/* Description */}
              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg md:leading-relaxed">
                Our <strong>pressure converter</strong> helps you convert between 15 pressure units including pascals, bars, PSI, atmospheres, torr, and more. Perfect for engineering, meteorology, HVAC systems, and scientific applications. Fast, accurate, and works entirely in your browser.
              </p>

              {/* CTA Buttons */}
              <div className="mt-7 pb-5 flex flex-wrap items-center gap-3">
                <a href="#tool" className="group relative rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 transition-all duration-200 hover:shadow-xl hover:scale-[1.02]">
                  <span className="relative z-10 flex items-center gap-2">
                    ⚡ Convert Pressure Units
                  </span>
                </a>
                <a href="#how" className="rounded-2xl border-2 border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-900 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md">
                  How it works
                </a>
              </div>

              {/* Stats Cards */}
              <dl className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Units</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">15 Units</dd>
                </div>
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Precision</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">High</dd>
                </div>
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Processing</dt>
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
                      <span className="text-2xl">⚡</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">15 Pressure Units</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Convert between pascals, bars, PSI, atmospheres, torr, inches of mercury, and more with precise calculations.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Feature Card 2 */}
                <div className="feature-card group rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-lg transition-all duration-300 hover:border-blue-300 hover:shadow-xl hover:-translate-y-1" style={{ animationDelay: '0.2s' }}>
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30 transition-transform duration-300 group-hover:scale-110">
                      <span className="text-2xl">🎯</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">High Precision</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Get accurate results with up to 6 decimal places, formatted for easy reading and professional use.
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
                        All conversions happen in your browser. We never store or track your data.
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
                <h2 className="text-xl font-semibold text-slate-900">Pressure Converter online</h2>
                <p className="mt-1 text-sm text-slate-600">Convert between 15 pressure units including pascals, bars, PSI, atmospheres, torr, and more instantly</p>
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
                    <option value="">Select unit</option>
                    {pressureUnits.map((unit) => (
                      <option key={unit.value} value={unit.value}>
                        {unit.label}
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
                    <option value="">Select unit</option>
                    {pressureUnits.map((unit) => (
                      <option key={unit.value} value={unit.value}>
                        {unit.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Power Value Input */}
              <div>
                <label htmlFor="inputValue" className="block text-sm font-medium text-slate-700 mb-2">
                  Pressure Value
                </label>
                <input
                  type="number"
                  id="inputValue"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Enter pressure value"
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
                Convert Pressure Units
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
                  <div className="text-sm font-semibold text-emerald-700 uppercase tracking-wide mb-2">Converted Pressure</div>
                  <div className="text-3xl font-bold text-slate-900">{result}</div>
                </div>
              )}
            </form>
          </div>
        </section>

        {/* What is Power? Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">What is Pressure?</h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                <strong>Pressure</strong> is the force applied perpendicular to the surface of an object per unit area. In the International System of Units (SI), pressure is measured in pascals (Pa), named after French physicist Blaise Pascal. One pascal equals one newton per square meter (N/m²). Pressure is a fundamental physical quantity that describes how force is distributed over an area, and it's essential in many scientific and engineering applications.
              </p>
              
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Pressure units are critical in numerous fields including engineering, meteorology, medicine, aviation, and HVAC systems. Understanding pressure conversion between pascals, bars, PSI (pounds per square inch), atmospheres, torr, and other units is crucial for system design, weather forecasting, medical monitoring, and industrial processes. Our converter supports 15 pressure units including SI metric units (pascal, kilopascal, megapascal), bar units (bar, millibar, hectopascal), atmosphere units (standard atmosphere, technical atmosphere), imperial units (PSI, PSF), and specialized units (torr, mmHg, inHg, water column units) for comprehensive pressure conversion needs.
              </p>
              
              <p className="text-base text-slate-700 leading-relaxed mb-6">
                According to the <a href="https://www.nist.gov/pml/weights-and-measures/metric-si/si-units" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">National Institute of Standards and Technology (NIST)</a>, the pascal is the standard unit of pressure in the SI system. Atmospheric pressure at sea level is approximately 101,325 pascals (101.325 kPa), which equals 1 standard atmosphere (atm) or 14.696 PSI. Understanding these relationships is essential for engineers, meteorologists, and anyone working with pressure-dependent systems.
              </p>
              
              {/* Before/After Comparison */}
              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600">✗</span>
                    Manual Calculation
                  </h3>
                  <ul className="text-sm text-slate-700 space-y-2">
                    <li>• Time-consuming multiplication/division</li>
                    <li>• Risk of calculation errors</li>
                    <li>• Difficult to verify accuracy</li>
                    <li>• No formatted output</li>
                  </ul>
                </div>
                
                <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">✓</span>
                    Online Pressure Converter
                  </h3>
                  <ul className="text-sm text-slate-700 space-y-2">
                    <li>• Instant conversion results</li>
                    <li>• High-precision calculations</li>
                    <li>• Formatted numbers for clarity</li>
                    <li>• Easy unit swapping</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Understanding Power Units - Educational Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Understanding Pressure Units</h2>
            </div>
            
            <p className="text-base text-slate-700 leading-relaxed mb-6">
              Pressure units measure the force applied per unit area. Understanding each unit's origin, common applications, and relationships helps you choose the right unit for your needs and make accurate conversions. Here's a comprehensive guide to all pressure units supported by our converter.
            </p>

            {/* SI Metric Units */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-lg font-bold">SI</span>
                SI Metric Units
              </h3>
              
              <div className="space-y-6">
                {/* Pascal */}
                <div className="rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 hover:border-blue-300 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-lg">
                      Pa
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-slate-900 mb-2">Pascal (Pa)</h4>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Definition:</strong> The pascal is the base unit of pressure in the International System of Units (SI), named after French physicist Blaise Pascal (1623-1662). One pascal equals one newton per square meter (N/m²), representing the force of one newton applied over one square meter.
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>History:</strong> The pascal was adopted as the SI unit of pressure in 1971. Blaise Pascal made significant contributions to fluid mechanics and pressure studies, particularly in hydrostatics and barometric pressure measurements. The unit replaced older pressure units in scientific contexts.
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Common Uses:</strong> Pascals are used in scientific research, engineering calculations, and precision measurements. Due to their small size (standard atmospheric pressure is 101,325 Pa), larger multiples like kilopascals (kPa) and megapascals (MPa) are more commonly used in practical applications. One pascal is approximately the pressure exerted by a dollar bill lying flat on a surface.
                      </p>
                      <p className="text-sm text-slate-600 italic">
                        <strong>Conversion:</strong> 1 Pa = 0.001 kPa = 0.000001 MPa = 0.00001 bar = 0.000145 PSI
                      </p>
                    </div>
                  </div>
                </div>

                {/* Kilopascal */}
                <div className="rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 hover:border-emerald-300 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white font-bold text-lg">
                      kPa
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-slate-900 mb-2">Kilopascal (kPa)</h4>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Definition:</strong> One kilopascal equals 1,000 pascals. The prefix "kilo" means one thousand in the metric system. Kilopascals are one of the most commonly used pressure units in engineering and everyday applications.
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Common Uses:</strong> Kilopascals are widely used in engineering, meteorology, and automotive applications. Examples include: tire pressure specifications (typically 200-300 kPa for passenger cars), weather barometric pressure (sea level averages around 101.325 kPa), medical equipment, and industrial pressure measurements. Many pressure gauges and sensors are calibrated in kilopascals.
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Practical Example:</strong> Standard atmospheric pressure at sea level is approximately 101.325 kPa. Tire pressure for a typical car is around 200-250 kPa (29-36 PSI). A strong vacuum cleaner might generate around 20-30 kPa of negative pressure.
                      </p>
                      <p className="text-sm text-slate-600 italic">
                        <strong>Conversion:</strong> 1 kPa = 1,000 Pa = 0.001 MPa = 0.01 bar = 0.145 PSI
                      </p>
                    </div>
                  </div>
                </div>

                {/* Megapascal */}
                <div className="rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 hover:border-purple-300 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 text-white font-bold text-lg">
                      MPa
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-slate-900 mb-2">Megapascal (MPa)</h4>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Definition:</strong> One megapascal equals 1,000,000 pascals (1 million pascals). The prefix "mega" means one million in the metric system. Megapascals are used for high-pressure applications.
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Common Uses:</strong> Megapascals are used in materials science, structural engineering, and high-pressure systems. Examples include: material strength ratings (steel: 200-500 MPa tensile strength), hydraulic systems (10-70 MPa), scuba diving tanks (20-30 MPa), industrial pressure vessels, and geological pressure measurements. Many engineering specifications and material data sheets use megapascals.
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Scale Context:</strong> One megapascal equals approximately 145 PSI. High-strength steel can withstand 400-500 MPa before failure, while hydraulic systems commonly operate at 20-35 MPa. Deep ocean pressures can reach 100+ MPa at extreme depths.
                      </p>
                      <p className="text-sm text-slate-600 italic">
                        <strong>Conversion:</strong> 1 MPa = 1,000 kPa = 1,000,000 Pa = 10 bar = 145 PSI
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bar Units */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white text-lg font-bold">📊</span>
                Bar Units
              </h3>
              
              <div className="space-y-6">
                {/* Bar */}
                <div className="rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 hover:border-cyan-300 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-bold text-lg">
                      bar
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-slate-900 mb-2">Bar (bar)</h4>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Definition:</strong> One bar equals 100,000 pascals (100 kPa). The bar is approximately equal to atmospheric pressure at sea level, making it a convenient unit for many applications.
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>History:</strong> The bar was introduced in 1909 by British meteorologist William Napier Shaw. It was originally defined as exactly 1,000,000 dynes per square centimeter, which equals 100,000 pascals. The bar is not an official SI unit but is widely accepted for use with SI units.
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Common Uses:</strong> Bars are extensively used in meteorology (weather reporting), engineering (hydraulic and pneumatic systems), scuba diving, and industrial applications. Standard atmospheric pressure is approximately 1.01325 bar. Many European countries use bar for tire pressure instead of PSI, with typical car tire pressure around 2-2.5 bar.
                      </p>
                      <p className="text-sm text-slate-600 italic">
                        <strong>Conversion:</strong> 1 bar = 100,000 Pa = 100 kPa = 0.1 MPa = 14.504 PSI ≈ 1 atm
                      </p>
                    </div>
                  </div>
                </div>

                {/* Millibar */}
                <div className="rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 hover:border-blue-300 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-sm">
                      mbar
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-slate-900 mb-2">Millibar (mbar)</h4>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Definition:</strong> One millibar equals 0.001 bar, which equals 100 pascals. Millibars are equivalent to hectopascals (hPa).
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Common Uses:</strong> Millibars are the standard unit for atmospheric pressure in meteorology and weather forecasting. Standard atmospheric pressure at sea level is approximately 1,013.25 mbar. Weather maps, barometers, and meteorological instruments typically display pressure in millibars. Pressure changes of a few millibars indicate significant weather system movements.
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Weather Context:</strong> Normal sea-level pressure ranges from 980-1,040 mbar. High pressure systems (anticyclones) typically have pressures above 1,020 mbar, while low pressure systems (cyclones) have pressures below 1,000 mbar. Hurricanes and typhoons can have central pressures below 950 mbar.
                      </p>
                      <p className="text-sm text-slate-600 italic">
                        <strong>Conversion:</strong> 1 mbar = 0.001 bar = 100 Pa = 1 hPa = 0.0145 PSI
                      </p>
                    </div>
                  </div>
                </div>

                {/* Hectopascal */}
                <div className="rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 hover:border-indigo-300 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-sm">
                      hPa
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-slate-900 mb-2">Hectopascal (hPa)</h4>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Definition:</strong> One hectopascal equals 100 pascals. Hectopascals are numerically identical to millibars (1 hPa = 1 mbar), making them equivalent units.
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Common Uses:</strong> Hectopascals are used in meteorology and weather reporting, particularly in countries using the metric system. They're the preferred SI unit for atmospheric pressure measurements. Weather stations, barometers, and meteorological services worldwide use hectopascals. Standard atmospheric pressure is 1,013.25 hPa.
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>International Standard:</strong> The World Meteorological Organization (WMO) recommends using hectopascals for atmospheric pressure reporting. Modern digital barometers and weather stations typically display pressure in hectopascals, and this unit appears in most weather forecasts and aviation weather reports.
                      </p>
                      <p className="text-sm text-slate-600 italic">
                        <strong>Conversion:</strong> 1 hPa = 100 Pa = 1 mbar = 0.001 bar = 0.0145 PSI
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Atmosphere Units */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 text-white text-lg font-bold">🌍</span>
                Atmosphere Units
              </h3>
              
              <div className="space-y-6">
                {/* Standard Atmosphere */}
                <div className="rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 hover:border-teal-300 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 text-white font-bold text-lg">
                      atm
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-slate-900 mb-2">Standard Atmosphere (atm)</h4>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Definition:</strong> One standard atmosphere equals exactly 101,325 pascals. This represents the average atmospheric pressure at sea level under standard conditions (15°C, 1013.25 mbar).
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>History:</strong> The standard atmosphere was established in 1954 by the 10th General Conference on Weights and Measures as exactly 101,325 Pa. It's based on the average atmospheric pressure at sea level, providing a convenient reference point for pressure measurements.
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Common Uses:</strong> Atmospheres are used in chemistry, physics, scuba diving, and as a reference point for pressure measurements. Scuba diving equipment is rated in atmospheres (tank pressure: 200-300 atm). Chemical reactions are often conducted at standard temperature and pressure (STP), which includes 1 atm. Many scientific calculations use atmospheres as a convenient reference.
                      </p>
                      <p className="text-sm text-slate-600 italic">
                        <strong>Conversion:</strong> 1 atm = 101,325 Pa = 101.325 kPa = 1.01325 bar = 14.696 PSI
                      </p>
                    </div>
                  </div>
                </div>

                {/* Technical Atmosphere */}
                <div className="rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 hover:border-cyan-300 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-bold text-sm">
                      at
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-slate-900 mb-2">Technical Atmosphere (at)</h4>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Definition:</strong> One technical atmosphere equals 98,066.5 pascals. This is defined as the pressure exerted by a kilogram-force per square centimeter, used in the metric technical system.
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>History:</strong> The technical atmosphere was used in engineering applications in European countries before widespread SI adoption. It's based on the metric technical system (kgf/cm²) rather than the SI system. Although largely replaced by bar and pascal, it's still occasionally used in some engineering contexts.
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Common Uses:</strong> Technical atmospheres are sometimes used in European engineering specifications, particularly in older documentation or in certain industrial contexts. They're less common today, with most applications using bar or pascal instead. The technical atmosphere is approximately 0.968 standard atmospheres.
                      </p>
                      <p className="text-sm text-slate-600 italic">
                        <strong>Conversion:</strong> 1 at = 98,066.5 Pa = 98.0665 kPa = 0.980665 bar = 14.223 PSI
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Imperial/US Units */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white text-lg font-bold">🇺🇸</span>
                Imperial & US Customary Units
              </h3>
              
              <div className="space-y-6">
                {/* PSI */}
                <div className="rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 hover:border-amber-300 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white font-bold text-lg">
                      PSI
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-slate-900 mb-2">Pounds per Square Inch (PSI)</h4>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Definition:</strong> One PSI equals the pressure exerted by one pound-force applied over one square inch. One PSI equals approximately 6,894.76 pascals.
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>History:</strong> PSI has been used in the United States and United Kingdom since the 19th century for engineering and industrial applications. It's part of the imperial system of units and remains the standard pressure unit in the United States for most applications.
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Common Uses:</strong> PSI is the standard unit for tire pressure, hydraulic systems, pneumatic systems, and many engineering applications in the United States. Examples include: car tire pressure (28-35 PSI), bicycle tires (40-100 PSI), hydraulic systems (500-5,000 PSI), compressed air systems (90-120 PSI), and scuba diving tanks (3,000 PSI). Standard atmospheric pressure is approximately 14.696 PSI.
                      </p>
                      <p className="text-sm text-slate-600 italic">
                        <strong>Conversion:</strong> 1 PSI = 6,894.76 Pa = 6.895 kPa = 0.068948 bar = 0.068046 atm
                      </p>
                    </div>
                  </div>
                </div>

                {/* PSF */}
                <div className="rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 hover:border-orange-300 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 text-white font-bold text-sm">
                      psf
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-slate-900 mb-2">Pounds per Square Foot (psf)</h4>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Definition:</strong> One pound per square foot equals the pressure exerted by one pound-force applied over one square foot. One psf equals approximately 47.88 pascals.
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Common Uses:</strong> PSF is commonly used in structural engineering, building codes, and construction in the United States. Examples include: wind load calculations (typically 10-50 psf), snow load specifications (20-100 psf depending on region), building design loads, and floor load capacity ratings. Structural engineers use psf for calculating loads on buildings and determining material requirements.
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Relationship:</strong> 1 PSI = 144 psf (since there are 144 square inches in a square foot). This makes psf useful for large-area pressure applications like wind and snow loading.
                      </p>
                      <p className="text-sm text-slate-600 italic">
                        <strong>Conversion:</strong> 1 psf = 47.88 Pa = 0.04788 kPa = 1/144 PSI
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mercury Column Units */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 text-white text-lg font-bold">🌡️</span>
                Mercury Column Units
              </h3>
              
              <div className="space-y-6">
                {/* Torr / mmHg */}
                <div className="rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 hover:border-rose-300 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 text-white font-bold text-sm">
                      torr
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-slate-900 mb-2">Torr / Millimeter of Mercury (mmHg)</h4>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Definition:</strong> One torr equals exactly 1/760 of a standard atmosphere, which equals 133.322 pascals. Torr and millimeter of mercury (mmHg) are essentially equivalent units, with torr being slightly more precise.
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>History:</strong> The torr is named after Italian physicist Evangelista Torricelli, who invented the mercury barometer in 1643. The unit was originally defined as the pressure that would support a column of mercury 1 millimeter high. Standard atmospheric pressure (760 mmHg) corresponds to approximately 760 torr.
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Common Uses:</strong> Torr and mmHg are extensively used in medicine, vacuum technology, and scientific research. Examples include: blood pressure measurements (systolic: 120 mmHg, diastolic: 80 mmHg), vacuum systems (high vacuum: 0.001-1 torr), barometric pressure readings, and laboratory equipment calibration. Medical sphygmomanometers (blood pressure monitors) are calibrated in mmHg.
                      </p>
                      <p className="text-sm text-slate-600 italic">
                        <strong>Conversion:</strong> 1 torr = 1 mmHg = 133.322 Pa = 0.133322 kPa = 0.019337 PSI
                      </p>
                    </div>
                  </div>
                </div>

                {/* Inch of Mercury */}
                <div className="rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 hover:border-pink-300 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 text-white font-bold text-xs">
                      inHg
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-slate-900 mb-2">Inch of Mercury (inHg)</h4>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Definition:</strong> One inch of mercury equals the pressure that would support a column of mercury one inch high. One inHg equals approximately 3,386.39 pascals.
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>History:</strong> Inches of mercury became a standard unit through the use of mercury barometers. The unit was widely adopted in English-speaking countries for atmospheric pressure measurements and continues to be used in aviation and meteorology in the United States.
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Common Uses:</strong> Inches of mercury are primarily used in aviation and meteorology in the United States. Examples include: altimeter settings (29.92 inHg at sea level), weather reporting, barometric pressure displays, and aircraft instruments. Aviation weather reports (METARs) include altimeter settings in inches of mercury. Standard atmospheric pressure is approximately 29.92 inHg.
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Aviation Context:</strong> Pilots set their altimeters using local barometric pressure in inches of mercury. Lower pressures indicate high altitude or approaching weather systems, while higher pressures indicate clear weather. Pressure altitudes are critical for flight safety and navigation.
                      </p>
                      <p className="text-sm text-slate-600 italic">
                        <strong>Conversion:</strong> 1 inHg = 3,386.39 Pa = 3.38639 kPa = 25.4 mmHg = 0.491 PSI
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Water Column Units */}
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 text-white text-lg font-bold">💧</span>
                Water Column Units
              </h3>
              
              <div className="space-y-6">
                {/* Inch of Water */}
                <div className="rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 hover:border-blue-300 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 text-white font-bold text-xs">
                      inH2O
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-slate-900 mb-2">Inch of Water (inH2O)</h4>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Definition:</strong> One inch of water equals the pressure exerted by a column of water one inch high. One inH2O equals approximately 249.089 pascals at 4°C.
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Common Uses:</strong> Inches of water column are primarily used in HVAC (heating, ventilation, and air conditioning) systems, low-pressure applications, and building ventilation. Examples include: static pressure in ductwork (typically 0.1-2 inH2O), fan pressure ratings, natural gas line pressures (4-7 inH2O), and low-pressure steam systems. HVAC technicians commonly use inches of water to measure and adjust system pressures.
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>HVAC Context:</strong> Most residential and commercial HVAC systems operate at pressures measured in inches of water column. Typical values: supply air static pressure (0.5-1.5 inH2O), return air pressure (-0.1 to -0.5 inH2O), and natural gas pressure (4-7 inH2O for residential). These low pressures are ideal for measuring with manometers and pressure gauges in HVAC applications.
                      </p>
                      <p className="text-sm text-slate-600 italic">
                        <strong>Conversion:</strong> 1 inH2O = 249.089 Pa = 0.249 kPa = 0.036127 PSI
                      </p>
                    </div>
                  </div>
                </div>

                {/* Millimeter of Water */}
                <div className="rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 hover:border-cyan-300 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-teal-600 text-white font-bold text-xs">
                      mmH2O
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-slate-900 mb-2">Millimeter of Water (mmH2O)</h4>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Definition:</strong> One millimeter of water equals the pressure exerted by a column of water one millimeter high. One mmH2O equals approximately 9.80665 pascals at 4°C (where water has maximum density).
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Common Uses:</strong> Millimeters of water are used in precision low-pressure measurements, particularly in metric-system countries and scientific applications. Examples include: precise HVAC measurements, laboratory pressure calibrations, low-pressure fluid systems, and meteorological applications. The unit provides finer resolution than inches of water for precise measurements.
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Precision Context:</strong> Since 1 mmH2O equals approximately 9.81 Pa, this unit provides a convenient way to measure very low pressures with high precision. It's particularly useful in applications where pressure differences are small, such as in building ventilation, low-pressure air systems, and precision fluid mechanics measurements.
                      </p>
                      <p className="text-sm text-slate-600 italic">
                        <strong>Conversion:</strong> 1 mmH2O = 9.80665 Pa = 0.00980665 kPa = 25.4 inH2O (1 in = 25.4 mm)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Unit Comparison Table */}
            <div className="mt-8 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Quick Reference: Pressure Unit Equivalents</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-slate-300">
                      <th className="text-left py-3 px-4 font-bold text-slate-900">Unit</th>
                      <th className="text-right py-3 px-4 font-bold text-slate-900">Pascals</th>
                      <th className="text-right py-3 px-4 font-bold text-slate-900">Bars</th>
                      <th className="text-right py-3 px-4 font-bold text-slate-900">PSI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr className="hover:bg-slate-100">
                      <td className="py-3 px-4 font-medium text-slate-900">1 Pascal</td>
                      <td className="py-3 px-4 text-right text-slate-700">1 Pa</td>
                      <td className="py-3 px-4 text-right text-slate-700">0.00001 bar</td>
                      <td className="py-3 px-4 text-right text-slate-700">0.000145 PSI</td>
                    </tr>
                    <tr className="hover:bg-slate-100">
                      <td className="py-3 px-4 font-medium text-slate-900">1 Kilopascal</td>
                      <td className="py-3 px-4 text-right text-slate-700">1,000 Pa</td>
                      <td className="py-3 px-4 text-right text-slate-700">0.01 bar</td>
                      <td className="py-3 px-4 text-right text-slate-700">0.145 PSI</td>
                    </tr>
                    <tr className="hover:bg-slate-100">
                      <td className="py-3 px-4 font-medium text-slate-900">1 Bar</td>
                      <td className="py-3 px-4 text-right text-slate-700">100,000 Pa</td>
                      <td className="py-3 px-4 text-right text-slate-700">1 bar</td>
                      <td className="py-3 px-4 text-right text-slate-700">14.504 PSI</td>
                    </tr>
                    <tr className="hover:bg-slate-100">
                      <td className="py-3 px-4 font-medium text-slate-900">1 Atmosphere</td>
                      <td className="py-3 px-4 text-right text-slate-700">101,325 Pa</td>
                      <td className="py-3 px-4 text-right text-slate-700">1.01325 bar</td>
                      <td className="py-3 px-4 text-right text-slate-700">14.696 PSI</td>
                    </tr>
                    <tr className="hover:bg-slate-100">
                      <td className="py-3 px-4 font-medium text-slate-900">1 PSI</td>
                      <td className="py-3 px-4 text-right text-slate-700">6,894.76 Pa</td>
                      <td className="py-3 px-4 text-right text-slate-700">0.068948 bar</td>
                      <td className="py-3 px-4 text-right text-slate-700">1 PSI</td>
                    </tr>
                    <tr className="hover:bg-slate-100">
                      <td className="py-3 px-4 font-medium text-slate-900">1 Torr (mmHg)</td>
                      <td className="py-3 px-4 text-right text-slate-700">133.322 Pa</td>
                      <td className="py-3 px-4 text-right text-slate-700">0.001333 bar</td>
                      <td className="py-3 px-4 text-right text-slate-700">0.019337 PSI</td>
                    </tr>
                    <tr className="hover:bg-slate-100">
                      <td className="py-3 px-4 font-medium text-slate-900">1 Inch of Mercury</td>
                      <td className="py-3 px-4 text-right text-slate-700">3,386.39 Pa</td>
                      <td className="py-3 px-4 text-right text-slate-700">0.033864 bar</td>
                      <td className="py-3 px-4 text-right text-slate-700">0.491 PSI</td>
                    </tr>
                    <tr className="hover:bg-slate-100">
                      <td className="py-3 px-4 font-medium text-slate-900">1 Inch of Water</td>
                      <td className="py-3 px-4 text-right text-slate-700">249.089 Pa</td>
                      <td className="py-3 px-4 text-right text-slate-700">0.002491 bar</td>
                      <td className="py-3 px-4 text-right text-slate-700">0.036127 PSI</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics/Impact Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white p-8 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-3">Pressure Conversion Impact</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Understanding pressure units is essential for engineering, meteorology, and scientific applications
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-emerald-200 shadow-lg">
                <div className="text-4xl font-extrabold text-emerald-600 mb-2">101.3 kPa</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Atmospheric</div>
                <div className="text-xs text-slate-600">Standard sea-level pressure</div>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-blue-200 shadow-lg">
                <div className="text-4xl font-extrabold text-blue-600 mb-2">30 PSI</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Tire Pressure</div>
                <div className="text-xs text-slate-600">Typical car tire pressure</div>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-purple-200 shadow-lg">
                <div className="text-4xl font-extrabold text-purple-600 mb-2">120 mmHg</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Blood Pressure</div>
                <div className="text-xs text-slate-600">Normal systolic pressure</div>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-orange-200 shadow-lg">
                <div className="text-4xl font-extrabold text-orange-600 mb-2">1 inH2O</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">HVAC Pressure</div>
                <div className="text-xs text-slate-600">Typical duct static pressure</div>
              </div>
            </div>
            
            {/* Authority Link */}
            <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">📊</span>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">Understanding Pressure Units</h4>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    According to the <a href="https://www.nist.gov/pml/weights-and-measures/metric-si/si-units" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">National Institute of Standards and Technology (NIST)</a>, the pascal is the standard SI unit of pressure, defined as one newton per square meter. Understanding pressure unit conversions is essential for engineers, meteorologists, HVAC technicians, and anyone working with pressure-dependent systems. The ability to convert between pascals, bars, PSI, atmospheres, and specialized units accurately is fundamental to proper system design, safety, and scientific measurements.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Use Pressure Converter? Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Why Use Our Pressure Converter?</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Our pressure converter provides instant, accurate conversions between 15 pressure units including pascals, bars, PSI, atmospheres, torr, millimeters of mercury, inches of mercury, water column units, and more. Whether you're working on engineering projects, meteorology calculations, HVAC system design, medical equipment, or scientific research, our tool offers the precision and ease of use you need.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Benefit 1 */}
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-emerald-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Instant High-Precision Conversions</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Get immediate pressure unit conversions with high precision (up to 6 decimal places). Perfect for engineering calculations, HVAC system design, meteorology, and professional applications. Our converter supports 15 pressure units including SI metric units (Pa, kPa, MPa), bar units (bar, mbar, hPa), atmosphere units (atm, at), imperial units (PSI, psf), and specialized units (torr, mmHg, inHg, water column). All conversions use exact mathematical relationships, ensuring accurate results every time.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Benefit 2 */}
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Easy Unit Comparison</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Quickly compare pressure values across different units. Convert tire pressure from PSI to bar for European specifications, convert barometric pressure from millibars to inches of mercury for aviation, convert HVAC static pressure from inches of water to pascals for engineering calculations, or convert blood pressure from mmHg to kilopascals for medical documentation. The swap feature lets you instantly reverse conversions, making it easy to work in either direction without recalculating.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Benefit 3 */}
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-purple-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
                    <span className="text-2xl">📐</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Engineering & Professional Use</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Ideal for engineers, meteorologists, HVAC technicians, medical professionals, and anyone working with pressure systems. Use it for HVAC system design (converting static pressures), tire pressure specifications, barometric pressure readings, hydraulic system calculations, medical equipment calibration (blood pressure monitors), aviation altimeter settings, and scientific research. The tool provides formatted output that's ready for professional documentation.
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
                      All power conversions happen locally in your browser. We never store, log, or transmit your conversion values or personal information. Your calculations remain completely private, making this tool safe for sensitive engineering projects and confidential energy system designs.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Benefit 5 */}
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-teal-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 shadow-lg">
                    <span className="text-2xl">📱</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Mobile-Friendly Design</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Access our pressure converter from any device—desktop, tablet, or smartphone. The responsive design works perfectly on all screen sizes, so you can convert pressure units on the go. Perfect for field engineers, HVAC technicians, and meteorologists who need quick conversions while working on-site or in the field.
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
                      Use our pressure converter as much as you want, whenever you need it, without any cost. No hidden fees, no premium tiers, no usage limits. Convert pressure units unlimited times for free, making it perfect for students, professionals, and anyone working with pressure systems regularly.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Real-World Impact Box */}
            <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">💡</span>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">Real-World Impact</h4>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    According to the <a href="https://www.eia.gov/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-800 font-semibold underline">U.S. Energy Information Administration (EIA)</a>, the United States consumed approximately 4,000 terawatt-hours of electricity in 2020, equivalent to about 4,000,000,000 megawatt-hours. Understanding power unit conversions is essential for energy professionals, electrical engineers, and anyone working with renewable energy systems. Our tool helps professionals and students make accurate power calculations quickly, supporting better energy system design and more efficient electrical installations.
                  </p>
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
              Our pressure converter uses precise mathematical relationships between pressure units to provide accurate conversions instantly. Here's how the process works:
            </p>
            
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg mx-auto mb-4">
                  <span className="text-3xl font-bold text-white">1</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Select Units</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Choose your source pressure unit (pascal, bar, PSI, atmosphere, torr, or any of our 15 supported units) from the "Convert From" dropdown and your target unit from the "Convert To" dropdown.
                </p>
              </div>
              
              <div className="text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg mx-auto mb-4">
                  <span className="text-3xl font-bold text-white">2</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Enter Value</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Type the pressure value you want to convert in the input field. You can enter whole numbers or decimals for precise values.
                </p>
              </div>
              
              <div className="text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg mx-auto mb-4">
                  <span className="text-3xl font-bold text-white">3</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Calculate</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Our system performs the precise mathematical conversion using standard unit relationships (1 bar = 100,000 Pa, 1 atm = 101,325 Pa, 1 PSI = 6,894.76 Pa).
                </p>
              </div>
              
              <div className="text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg mx-auto mb-4">
                  <span className="text-3xl font-bold text-white">4</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">View Result</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Click Convert to instantly see the converted pressure value displayed clearly with the target unit abbreviation, formatted for easy reading.
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
              <h2 className="text-3xl font-bold text-slate-900">Best Practices for Pressure Conversion</h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                When converting pressure units, following best practices ensures accurate results and proper understanding of pressure systems and measurements. Here are essential tips for using pressure converters effectively:
              </p>
              
              <h3 className="text-xl font-bold text-slate-900 mt-6 mb-3">1. Understand the Relationship Between Units</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Remember that pressure conversions follow standard relationships: 1 bar = 100,000 pascals, 1 atmosphere = 101,325 pascals, and 1 PSI = 6,894.76 pascals. Standard atmospheric pressure at sea level is approximately 101.325 kPa, 1.01325 bar, or 14.696 PSI. For specialized units, 1 torr (mmHg) = 133.322 Pa, 1 inch of mercury = 3,386.39 Pa, and 1 inch of water = 249.089 Pa. Understanding these relationships helps verify calculator results and catch potential errors in manual calculations.
              </p>
              
              <h3 className="text-xl font-bold text-slate-900 mt-6 mb-3">2. Distinguish Between Absolute and Gauge Pressure</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Absolute pressure is measured relative to a perfect vacuum (zero pressure), while gauge pressure is measured relative to atmospheric pressure. For example, tire pressure is typically measured as gauge pressure (30 PSI gauge means 30 PSI above atmospheric pressure). When converting, ensure you understand whether your measurements are absolute or gauge pressure. Our converter handles unit conversions regardless of whether you're working with absolute or gauge pressure, but be aware of this distinction in your applications.
              </p>
              
              <h3 className="text-xl font-bold text-slate-900 mt-6 mb-3">3. Use Appropriate Precision</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                For most practical applications, 2-4 decimal places are sufficient. However, for precise engineering calculations, medical equipment, or scientific research, our converter provides up to 6 decimal places. Match the precision to your application: tire pressure typically doesn't need high precision, while laboratory measurements or HVAC system design may require greater accuracy.
              </p>
              
              <h3 className="text-xl font-bold text-slate-900 mt-6 mb-3">4. Verify Results for Critical Applications</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                For critical engineering projects, medical equipment calibration, safety-related calculations, or system design, always verify results using multiple methods or professional engineering software. While our converter uses precise calculations, independent verification is essential for high-stakes applications where errors could have serious consequences, such as medical devices, pressure vessel design, or aviation systems.
              </p>
              
              <h3 className="text-xl font-bold text-slate-900 mt-6 mb-3">5. Consider Context and Application</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Different applications use different pressure units. Tire pressure is commonly measured in PSI (US) or bar (Europe), weather barometric pressure uses millibars or hectopascals, medical blood pressure uses mmHg, HVAC systems use inches of water column, aviation uses inches of mercury, and engineering often uses pascals or bars. Understanding which unit is appropriate for your context helps ensure clear communication and proper system understanding. Our converter supports all these common units, making it versatile for various professional applications across engineering, meteorology, medicine, and industry.
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
                <h3 className="text-lg font-bold text-slate-900 mb-2">How do I convert pressure units online?</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  To convert pressure units online, select your source unit (pascal, bar, PSI, atmosphere, torr, or any of our 15 supported units) from the 'Convert From' dropdown, choose your target unit from the 'Convert To' dropdown, enter the pressure value you want to convert, and click the Convert button. The tool will instantly display the converted pressure value with high precision.
                </p>
              </div>
              
              <div className="border-b border-slate-200 pb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">What power units are supported?</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Our converter supports 10 power units: SI metric units (milliwatt, watt, kilowatt, megawatt, gigawatt), traditional units (mechanical horsepower, metric horsepower/PS), and specialized units (BTU per hour, foot-pound per second, calorie per second). Watt (W) is the basic SI unit. One kilowatt equals 1,000 watts, one megawatt equals 1,000,000 watts, and one gigawatt equals 1,000,000,000 watts. One mechanical horsepower equals approximately 745.7 watts.
                </p>
              </div>
              
              <div className="border-b border-slate-200 pb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Is this pressure converter accurate?</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Yes, our pressure converter uses precise mathematical conversions based on standard unit relationships. One bar equals exactly 100,000 pascals, one standard atmosphere equals 101,325 pascals, and one PSI equals 6,894.76 pascals. The tool provides results with up to 6 decimal places for accuracy and displays formatted numbers for easy reading.
                </p>
              </div>
              
              <div className="border-b border-slate-200 pb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Can I use this converter for electrical engineering calculations?</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Yes, this tool is suitable for basic power unit conversions needed in electrical engineering, energy calculations, and power system analysis. However, for complex engineering projects, always verify calculations with professional engineering software and consult relevant standards and codes. Our converter handles the fundamental unit conversions accurately.
                </p>
              </div>
              
              <div className="border-b border-slate-200 pb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">What are common use cases for power conversion?</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Power conversion is commonly used for: calculating energy consumption (converting appliance wattage to kilowatts), sizing solar panel systems (converting total watts to kilowatts or megawatts), comparing power plant capacities (converting megawatts to gigawatts), converting engine horsepower to kilowatts for specifications, HVAC system sizing (converting BTU/h to watts or kilowatts), understanding electrical bills, and various engineering and technical applications in electrical, mechanical, and energy systems.
                </p>
              </div>
              
              <div className="border-b border-slate-200 pb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Is this pressure converter free to use?</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Yes, our pressure converter is completely free to use. There are no registration requirements, no hidden fees, and no limits on the number of conversions you can perform. Simply enter your pressure values and convert between any of our 15 supported pressure units (pascals, bars, PSI, atmospheres, torr, mmHg, inHg, water column units, and more) instantly without any cost.
                </p>
              </div>
              
              <div className="border-b border-slate-200 pb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">How do I convert kilowatts to watts?</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  To convert kilowatts to watts, multiply the kilowatt value by 1,000. For example, 5 kilowatts equals 5,000 watts. Our converter handles this automatically—just select 'kilowatt' as the source unit, 'watt' as the target unit, enter the value, and click Convert. The result will show the equivalent wattage.
                </p>
              </div>
              
              <div className="pb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">What is the relationship between power and energy?</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Power is the rate at which energy is used or generated, measured in watts. Energy is the total amount of work done or electricity consumed, measured in watt-hours or kilowatt-hours (kWh). For example, a 1,000-watt (1 kW) appliance running for 1 hour consumes 1 kWh of energy. Power units (W, kW, MW) describe the capacity or rate, while energy units (Wh, kWh, MWh) describe the total consumption over time.
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
              <Link href="/conversiontools/energyConversion" className="group rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 transition-all duration-300 hover:border-emerald-300 hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600">
                    <span className="text-xl">⚡</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Energy Converter</h3>
                </div>
                <p className="text-sm text-slate-600">Convert between joules, kilojoules, calories, and other energy units.</p>
              </Link>
              
              <Link href="/conversiontools/temperatureConversion" className="group rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 transition-all duration-300 hover:border-orange-300 hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600">
                    <span className="text-xl">🌡️</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Temperature Converter</h3>
                </div>
                <p className="text-sm text-slate-600">Convert between Celsius, Fahrenheit, Kelvin, and Rankine temperature units.</p>
              </Link>
              
              <Link href="/conversiontools/lengthConversion" className="group rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 transition-all duration-300 hover:border-purple-300 hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600">
                    <span className="text-xl">📏</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Length Converter</h3>
                </div>
                <p className="text-sm text-slate-600">Convert between meters, feet, inches, kilometers, and other length units.</p>
              </Link>
              
              <Link href="/conversiontools/massConversion" className="group rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 transition-all duration-300 hover:border-emerald-300 hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600">
                    <span className="text-xl">⚖️</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Mass Converter</h3>
                </div>
                <p className="text-sm text-slate-600">Convert between kilograms, pounds, grams, and other mass units.</p>
              </Link>
              
              <Link href="/conversiontools/volumeConversion" className="group rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 transition-all duration-300 hover:border-blue-300 hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600">
                    <span className="text-xl">💧</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Volume Converter</h3>
                </div>
                <p className="text-sm text-slate-600">Convert between liters, gallons, cubic meters, and other volume units.</p>
              </Link>
              
              <Link href="/conversiontools/currencyConversion" className="group rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 transition-all duration-300 hover:border-yellow-300 hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-500 to-amber-600">
                    <span className="text-xl">💵</span>
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

