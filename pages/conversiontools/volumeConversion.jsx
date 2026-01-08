import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { volumeConversion } from '@/components/conversionToolComponent/conversionToolsFunctions';

export default function VolumeConversion() {
  const [inputValue, setInputValue] = useState('');
  const [convertFrom, setConvertFrom] = useState('');
  const [convertTo, setConvertTo] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const currentYear = new Date().getFullYear();

  // Volume units - ordered by common usage
  const volumeUnits = [
    // Metric SI units (most common)
    { code: 'milliliter', name: 'Milliliter (mL)', description: '1/1,000 liter - small volumes' },
    { code: 'liter', name: 'Liter (L)', description: 'Base metric unit of volume' },
    { code: 'cubicMeter', name: 'Cubic Meter (m³)', description: '1,000 liters - large volumes' },
    
    // Metric cubic units
    { code: 'cubicCentimeter', name: 'Cubic Centimeter (cm³)', description: '1 mL - equivalent to milliliter' },
    { code: 'cubicDecimeter', name: 'Cubic Decimeter (dm³)', description: '1 liter - equivalent to liter' },
    
    // US Customary units
    { code: 'teaspoon', name: 'Teaspoon (tsp)', description: '5 mL - US cooking measurement' },
    { code: 'tablespoon', name: 'Tablespoon (tbsp)', description: '15 mL - US cooking measurement' },
    { code: 'usFluidOunce', name: 'US Fluid Ounce (fl oz)', description: '29.57 mL - US liquid volume' },
    { code: 'usCup', name: 'US Cup (cup)', description: '236.59 mL - US cooking measurement' },
    { code: 'usPint', name: 'US Pint (pt)', description: '473.18 mL - US liquid volume' },
    { code: 'usQuart', name: 'US Quart (qt)', description: '946.35 mL - US liquid volume' },
    { code: 'usGallon', name: 'US Gallon (gal)', description: '3.785 L - US liquid volume' },
    { code: 'usBarrel', name: 'US Barrel (bbl)', description: '119.24 L - US fluid barrel' },
    
    // US Cubic units
    { code: 'cubicInch', name: 'Cubic Inch (in³)', description: '16.39 mL - US cubic volume' },
    { code: 'cubicFoot', name: 'Cubic Foot (ft³)', description: '28.32 L - US cubic volume' },
    { code: 'cubicYard', name: 'Cubic Yard (yd³)', description: '764.55 L - US cubic volume' },
    
    // Imperial units (UK)
    { code: 'imperialFluidOunce', name: 'Imperial Fluid Ounce (fl oz UK)', description: '28.41 mL - UK liquid volume' },
    { code: 'imperialCup', name: 'Imperial Cup (cup UK)', description: '284.13 mL - UK cooking measurement' },
    { code: 'imperialPint', name: 'Imperial Pint (pt UK)', description: '568.26 mL - UK liquid volume' },
    { code: 'imperialQuart', name: 'Imperial Quart (qt UK)', description: '1.137 L - UK liquid volume' },
    { code: 'imperialGallon', name: 'Imperial Gallon (gal UK)', description: '4.546 L - UK liquid volume' },
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
      const convertedValue = volumeConversion(convertFrom, convertTo, amount);
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
      
      const fromUnit = volumeUnits.find(u => u.code === convertFrom)?.name.split(' ')[0] || convertFrom;
      const toUnit = volumeUnits.find(u => u.code === convertTo)?.name.split(' ')[0] || convertTo;
      
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
          "name": "How do I convert volume units online?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "To convert volume units online, select your source volume unit from the 'Convert From' dropdown (e.g., liters, gallons, cups, milliliters), choose your target volume unit from the 'Convert To' dropdown, enter the volume value you want to convert, and click the Convert button. The tool will instantly display the converted volume using precise mathematical conversions."
          }
        },
        {
          "@type": "Question",
          "name": "What volume units are supported by this converter?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our volume converter supports 20 volume units including milliliters, liters, cubic meters, gallons (US and Imperial), cups, fluid ounces, pints, quarts, cubic inches, cubic feet, cubic yards, teaspoons, tablespoons, barrels, and more. This comprehensive range covers everything from cooking measurements to engineering volumes, making it perfect for recipes, scientific calculations, construction projects, and everyday volume conversions."
          }
        },
        {
          "@type": "Question",
          "name": "How accurate are the volume conversions?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our volume converter uses precise mathematical conversions based on standard volume unit definitions. Conversions are calculated client-side in your browser with high precision, ensuring accurate results. For example, 1 liter = 1,000 milliliters, 1 US gallon = 3.78541 liters, and 1 cubic meter = 1,000 liters. The tool maintains accuracy across all unit conversions."
          }
        },
        {
          "@type": "Question",
          "name": "What is the difference between US and Imperial volume units?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "US and Imperial volume units have different sizes. For example, 1 US gallon equals 3.78541 liters, while 1 Imperial gallon equals 4.54609 liters (about 20% larger). Similarly, US and Imperial fluid ounces, cups, pints, and quarts differ slightly. Our converter supports both systems, allowing you to convert between US and Imperial units accurately. US units are commonly used in the United States, while Imperial units are used in the United Kingdom and some Commonwealth countries."
          }
        },
        {
          "@type": "Question",
          "name": "Is this volume converter free to use?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, our volume converter is completely free to use. There are no registration requirements, no hidden fees, and no limits on the number of conversions you can perform. Simply visit the page, enter your values, and convert volume units instantly without any cost."
          }
        },
        {
          "@type": "Question",
          "name": "How do I convert liters to gallons or cups to milliliters?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "To convert liters to gallons, select 'Liter' as the source unit and 'US Gallon' (or 'Imperial Gallon') as the target unit, enter the number of liters, and click Convert. Similarly, to convert cups to milliliters, select 'US Cup' as the source and 'Milliliter' as the target. The converter handles all standard volume unit conversions automatically with precise calculations."
          }
        },
        {
          "@type": "Question",
          "name": "Can I use this for cooking and recipe conversions?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Absolutely! Our volume converter is perfect for cooking and recipe conversions. It supports common cooking units like teaspoons, tablespoons, cups, fluid ounces, pints, and quarts. You can easily convert between metric (milliliters, liters) and US customary units (cups, tablespoons) to adapt recipes from different measurement systems."
          }
        },
        {
          "@type": "Question",
          "name": "Can I convert between cubic units like cubic meters and cubic feet?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, our converter supports conversions between all cubic units including cubic meters, cubic centimeters, cubic inches, cubic feet, and cubic yards. These units are commonly used in engineering, construction, and scientific applications. For example, you can convert construction volumes from cubic yards to cubic meters or calculate material quantities using different measurement systems."
          }
        }
      ]
    },
    
    // SoftwareApplication Schema
    softwareApp: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Volume Converter",
      "applicationCategory": "UtilityApplication",
      "operatingSystem": "Any",
      "description": "Free online volume converter tool to convert between 20 volume units including milliliters, liters, gallons (US and Imperial), cups, fluid ounces, pints, quarts, cubic meters, cubic feet, teaspoons, tablespoons, and more. Fast, accurate, and works instantly in your browser.",
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
        "20 volume units supported",
        "Milliliters to cubic meters range",
        "US and Imperial units included",
        "Cooking measurements (cups, teaspoons, tablespoons)",
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
      "name": "How to Convert Volume Units Online",
      "description": "Step-by-step guide to convert between volume units online using FixTools free volume converter with instant, precise calculations.",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Select source volume unit",
          "text": "Choose the volume unit you want to convert from using the 'Convert From' dropdown menu. Options include milliliters, liters, gallons (US and Imperial), cups, fluid ounces, pints, quarts, cubic meters, cubic feet, teaspoons, tablespoons, and more.",
          "position": 1
        },
        {
          "@type": "HowToStep",
          "name": "Choose target volume unit",
          "text": "Select the volume unit you want to convert to from the 'Convert To' dropdown menu. You can convert between any of the 20 supported volume units, including US and Imperial measurements.",
          "position": 2
        },
        {
          "@type": "HowToStep",
          "name": "Enter volume value",
          "text": "Type the volume value you want to convert in the input field. You can enter whole numbers or decimals. The tool accepts any numeric value.",
          "position": 3
        },
        {
          "@type": "HowToStep",
          "name": "Convert and view result",
          "text": "Click the Convert button to instantly see the converted volume. The result displays the equivalent value in your target volume unit with appropriate precision formatting. You can swap units or perform additional conversions as needed.",
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
          "name": "Volume Converter",
          "item": "https://fixtools.io/conversiontools/volumeConversion"
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
        <title>Volume Converter - Free Online Liter, Gallon, Cup, Milliliter Conversion Tool | FixTools</title>
        <meta name="title" content="Volume Converter - Free Online Liter, Gallon, Cup, Milliliter Conversion Tool | FixTools" />
        <meta name="description" content="Convert between 20 volume units online for free. Convert liters, gallons (US and Imperial), cups, fluid ounces, milliliters, cubic meters, cubic feet, teaspoons, tablespoons, and more. Instant, accurate, and works in your browser. Perfect for cooking, engineering, and everyday volume conversions." />
        <meta name="keywords" content="volume converter, liter converter, gallon converter, cup converter, milliliter converter, volume unit conversion, convert liters to gallons, convert cups to milliliters, convert volume units, volume calculator, cooking volume converter" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://fixtools.io/conversiontools/volumeConversion" />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fixtools.io/conversiontools/volumeConversion" />
        <meta property="og:title" content="Volume Converter - Free Online Liter, Gallon, Cup Conversion Tool" />
        <meta property="og:description" content="Convert between 20 volume units with instant, precise calculations. Milliliters to cubic meters, US and Imperial units, all in your browser." />
        <meta property="og:image" content="https://fixtools.io/images/og-volume-converter.png" />
        <meta property="og:site_name" content="FixTools" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://fixtools.io/conversiontools/volumeConversion" />
        <meta property="twitter:title" content="Volume Converter - Free Online Tool" />
        <meta property="twitter:description" content="Convert between 20 volume units instantly. Liters, gallons, cups, milliliters, and more. All in your browser." />
        <meta property="twitter:image" content="https://fixtools.io/images/og-volume-converter.png" />
        
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
        html:has(.volume-converter-page) {
          font-size: 100% !important;
        }
        
        .volume-converter-page {
          line-height: 1.5;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          width: 100%;
          min-height: 100vh;
        }
        
        /* Box-sizing reset */
        .time-converter-page *,
        .time-converter-page *::before,
        .time-converter-page *::after {
          box-sizing: border-box;
        }
        
        /* Reset margins */
        .volume-converter-page h1,
        .volume-converter-page h2,
        .volume-converter-page h3,
        .volume-converter-page p,
        .volume-converter-page ul,
        .volume-converter-page ol {
          margin: 0;
        }
        
        /* Button and input inheritance */
        .volume-converter-page button {
          font-family: inherit;
          cursor: pointer;
        }
        
        .volume-converter-page input,
        .volume-converter-page textarea,
        .volume-converter-page select {
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

      <div className="volume-converter-page bg-[#fbfbfc] text-slate-900 min-h-screen">
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
              <span className="font-semibold text-slate-900">Volume Converter</span>
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
                  Volume Converter
                </span>
              </h1>
              
              {/* Description */}
              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg md:leading-relaxed">
                Our <strong>volume converter</strong> helps you convert between 20 volume units including liters, gallons, cups, fluid ounces, cubic meters, and more. Fast, accurate, and works instantly in your browser. Perfect for cooking, engineering, and everyday volume conversions.
              </p>

              {/* CTA Buttons */}
              <div className="mt-7 pb-5 flex flex-wrap items-center gap-3">
                <a href="#tool" className="group relative rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 transition-all duration-200 hover:shadow-xl hover:scale-[1.02]">
                  <span className="relative z-10 flex items-center gap-2">
                    ⚡ Convert Volume
                  </span>
                </a>
                <a href="#how" className="rounded-2xl border-2 border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-900 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md">
                  How it works
                </a>
              </div>

              {/* Stats Cards */}
              <dl className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Volume Units</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">20</dd>
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
                      <span className="text-2xl">💧</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">20 Volume Units</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Convert between milliliters, liters, gallons, cups, fluid ounces, cubic meters, cubic feet, and more. Supports both US and Imperial units.
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
                <h2 className="text-xl font-semibold text-slate-900">Volume Converter online</h2>
                <p className="mt-1 text-sm text-slate-600">Convert between 20 volume units with instant, precise calculations</p>
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
                    <option value="">Select volume unit</option>
                    {volumeUnits.map((unit) => (
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
                    <option value="">Select volume unit</option>
                    {volumeUnits.map((unit) => (
                      <option key={unit.code} value={unit.code}>
                        {unit.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Volume Value Input */}
              <div>
                <label htmlFor="inputValue" className="block text-sm font-medium text-slate-700 mb-2">
                  Volume Value
                </label>
                <input
                  type="number"
                  id="inputValue"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Enter volume value"
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
                Convert Volume
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
                  <div className="text-sm font-semibold text-emerald-700 uppercase tracking-wide mb-2">Converted Volume</div>
                  <div className="text-3xl font-bold text-slate-900">{result}</div>
                </div>
              )}
            </form>
          </div>
        </section>

        {/* Understanding Volume Units - Educational Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Understanding Volume Units</h2>
            </div>
            
            <p className="text-base text-slate-700 leading-relaxed mb-6">
              Volume units measure the amount of space occupied by a substance or the capacity of a container. Understanding each unit's origin, common applications, and relationships helps you choose the right unit for your needs and make accurate conversions. Here's a comprehensive guide to all volume units supported by our converter.
            </p>

            {/* Metric Volume Units */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-lg font-bold">📏</span>
                Metric Volume Units (SI)
              </h3>
              
              <div className="space-y-6">
                {/* Picosecond */}
                <div className="rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 hover:border-violet-300 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white font-bold text-xs">
                      ps
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-slate-900 mb-2">Picosecond (ps)</h4>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Definition:</strong> One picosecond equals 1 trillionth of a second (1/1,000,000,000,000 second or 10⁻¹² seconds). The prefix "pico" means one trillionth in the metric system.
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Common Uses:</strong> Picoseconds are used in ultrafast physics, laser science, and advanced electronics. Examples include: ultrafast laser pulses, molecular dynamics simulations, quantum computing operations, high-speed electronics timing, and atomic-scale processes. Light travels approximately 0.3 millimeters (0.012 inches) in one picosecond in a vacuum. This unit is essential for studying processes that occur at the atomic and molecular level.
                      </p>
                      <p className="text-sm text-slate-600 italic">
                        <strong>Conversion:</strong> 1 ps = 0.000000000001 s = 0.001 ns = 1,000 fs
                      </p>
                    </div>
                  </div>
                </div>

                {/* Nanosecond */}
                <div className="rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 hover:border-violet-300 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white font-bold text-xs">
                      ns
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-slate-900 mb-2">Nanosecond (ns)</h4>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Definition:</strong> One nanosecond equals 1 billionth of a second (1/1,000,000,000 second or 10⁻⁹ seconds). The prefix "nano" means one billionth in the metric system.
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Common Uses:</strong> Nanoseconds are used in computer science, electronics, and physics. Examples include: computer processor clock cycles (modern CPUs operate at gigahertz frequencies, where each cycle is measured in nanoseconds), memory access times, network latency measurements, laser pulse durations, and quantum physics experiments. Light travels approximately 30 centimeters (11.8 inches) in one nanosecond in a vacuum.
                      </p>
                      <p className="text-sm text-slate-600 italic">
                        <strong>Conversion:</strong> 1 ns = 0.000000001 s = 0.000001 ms = 0.001 μs
                      </p>
                    </div>
                  </div>
                </div>

                {/* Microsecond */}
                <div className="rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 hover:border-purple-300 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 text-white font-bold text-xs">
                      μs
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-slate-900 mb-2">Microsecond (μs)</h4>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Definition:</strong> One microsecond equals 1 millionth of a second (1/1,000,000 second or 10⁻⁶ seconds). The prefix "micro" means one millionth in the metric system.
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Common Uses:</strong> Microseconds are used in electronics, telecommunications, and scientific measurements. Examples include: radio frequency timing, audio signal processing, camera shutter speeds (some high-speed cameras capture images in microseconds), radar systems, and timing measurements in physics experiments. Light travels approximately 300 meters (984 feet) in one microsecond in a vacuum.
                      </p>
                      <p className="text-sm text-slate-600 italic">
                        <strong>Conversion:</strong> 1 μs = 0.000001 s = 0.001 ms = 1,000 ns
                      </p>
                    </div>
                  </div>
                </div>

                {/* Millisecond */}
                <div className="rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 hover:border-pink-300 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 text-white font-bold text-sm">
                      ms
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-slate-900 mb-2">Millisecond (ms)</h4>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Definition:</strong> One millisecond equals 1 thousandth of a second (1/1,000 second or 10⁻³ seconds). The prefix "milli" means one thousandth in the metric system.
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Common Uses:</strong> Milliseconds are commonly used in computing, sports timing, and everyday measurements. Examples include: computer response times, video game frame rates (60 FPS = 16.67 ms per frame), reaction time measurements, stopwatch precision, audio latency, and network ping times. Human reaction time is typically 150-300 milliseconds. A typical blink of an eye takes 100-400 milliseconds.
                      </p>
                      <p className="text-sm text-slate-600 italic">
                        <strong>Conversion:</strong> 1 ms = 0.001 s = 1,000 μs = 1,000,000 ns
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Standard Time Units */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-lg font-bold">⏰</span>
                Standard Time Units (SI Base)
              </h3>
              
              <div className="space-y-6">
                {/* Second */}
                <div className="rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 hover:border-blue-300 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-lg">
                      s
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-slate-900 mb-2">Second (s)</h4>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Definition:</strong> The second is the base unit of time in the International System of Units (SI). It is defined as the duration of 9,192,631,770 periods of the radiation corresponding to the transition between two hyperfine levels of the ground state of the cesium-133 atom.
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>History:</strong> The modern definition of the second was adopted in 1967, replacing the older definition based on the Earth's rotation. This atomic definition provides extreme precision and stability, making it the foundation for all time measurements worldwide. The second is one of the seven base units in the SI system.
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Common Uses:</strong> Seconds are the most fundamental time unit, used in all scientific, engineering, and everyday applications. Examples include: scientific measurements, sports timing, cooking timers, countdown timers, and all time-based calculations. The heartbeat of an average adult at rest is approximately 60-100 beats per minute, or about 0.6-1 second per beat.
                      </p>
                      <p className="text-sm text-slate-600 italic">
                        <strong>Conversion:</strong> 1 s = 1,000 ms = 1,000,000 μs = 1,000,000,000 ns
                      </p>
                    </div>
                  </div>
                </div>

                {/* Minute */}
                <div className="rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 hover:border-indigo-300 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-lg">
                      min
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-slate-900 mb-2">Minute (min)</h4>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Definition:</strong> One minute equals 60 seconds. The minute is not an official SI unit but is accepted for use with SI units. It's one of the most commonly used time units in everyday life.
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>History:</strong> The minute has been used since ancient times, originally derived from dividing an hour into 60 parts (following the Babylonian sexagesimal system). The word "minute" comes from the Latin "pars minuta prima" meaning "first small part."
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Common Uses:</strong> Minutes are used extensively in everyday life for timing activities, meetings, cooking, exercise, and scheduling. Examples include: meeting durations (30-minute meetings), cooking times (bake for 45 minutes), exercise intervals (run for 20 minutes), and time estimates. Most people think in minutes for short to medium-duration activities.
                      </p>
                      <p className="text-sm text-slate-600 italic">
                        <strong>Conversion:</strong> 1 min = 60 s = 0.0167 hours
                      </p>
                    </div>
                  </div>
                </div>

                {/* Hour */}
                <div className="rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 hover:border-emerald-300 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white font-bold text-lg">
                      h
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-slate-900 mb-2">Hour (h)</h4>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Definition:</strong> One hour equals 60 minutes or 3,600 seconds. Like the minute, the hour is not an official SI unit but is accepted for use with SI units and is fundamental to our daily timekeeping.
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>History:</strong> The hour has been used since ancient civilizations, with the 24-hour day being divided into 12 hours of daylight and 12 hours of darkness (though the length varied with seasons). The modern equal-length hour became standard with mechanical clocks in the Middle Ages.
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Common Uses:</strong> Hours are the standard unit for work schedules, travel time, and longer activities. Examples include: work shifts (8-hour workday), travel time (2-hour flight), movie durations (90-minute to 3-hour films), sleep duration (7-9 hours per night), and hourly wages. The average human sleeps 7-9 hours per day.
                      </p>
                      <p className="text-sm text-slate-600 italic">
                        <strong>Conversion:</strong> 1 h = 60 min = 3,600 s = 0.0417 days
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Calendar Time Units */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white text-lg font-bold">📅</span>
                Calendar Time Units
              </h3>
              
              <div className="space-y-6">
                {/* Day */}
                <div className="rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 hover:border-amber-300 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white font-bold text-lg">
                      d
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-slate-900 mb-2">Day (d)</h4>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Definition:</strong> One day equals 24 hours or 86,400 seconds. A day represents one complete rotation of the Earth on its axis relative to the Sun (solar day).
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>History:</strong> The concept of a day is one of the oldest time measurements, based on the natural cycle of day and night. The 24-hour division comes from ancient Egyptian and Babylonian systems. The modern definition is based on the mean solar day.
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Common Uses:</strong> Days are fundamental to human life and scheduling. Examples include: project timelines (5-day workweek), medication schedules (take twice daily), vacation planning (7-day trip), and age calculations. Most people organize their lives around daily cycles of work, rest, and activities.
                      </p>
                      <p className="text-sm text-slate-600 italic">
                        <strong>Conversion:</strong> 1 d = 24 h = 1,440 min = 86,400 s
                      </p>
                    </div>
                  </div>
                </div>

                {/* Week */}
                <div className="rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 hover:border-orange-300 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 text-white font-bold text-lg">
                      wk
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-slate-900 mb-2">Week (wk)</h4>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Definition:</strong> One week equals 7 days or 604,800 seconds. The week is a cultural and religious time unit, not based on astronomical cycles.
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>History:</strong> The 7-day week has ancient origins, possibly from the Babylonians who associated each day with a celestial body. It was adopted by many cultures and is now the standard work and rest cycle in most of the world.
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Common Uses:</strong> Weeks are used for scheduling, planning, and recurring cycles. Examples include: work schedules (40-hour workweek), pregnancy tracking (measured in weeks), project timelines (2-week sprint), pay periods (bi-weekly), and course schedules (10-week semester). Most calendars and planners are organized by weeks.
                      </p>
                      <p className="text-sm text-slate-600 italic">
                        <strong>Conversion:</strong> 1 wk = 7 d = 168 h = 604,800 s
                      </p>
                    </div>
                  </div>
                </div>

                {/* Fortnight */}
                <div className="rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 hover:border-red-300 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-rose-600 text-white font-bold text-sm">
                      14d
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-slate-900 mb-2">Fortnight</h4>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Definition:</strong> One fortnight equals 14 days or 1,209,600 seconds. The word "fortnight" comes from "fourteen nights" and is commonly used in British English and some Commonwealth countries.
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>History:</strong> The fortnight has been used since Middle English times and remains a standard unit in many English-speaking countries outside North America. It's particularly common in the UK, Australia, and New Zealand for scheduling and planning purposes.
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Common Uses:</strong> Fortnights are used for bi-weekly scheduling, pay periods, and project planning. Examples include: bi-weekly pay periods (paid every fortnight), rental agreements (fortnightly rent), project milestones, and vacation planning. Many businesses and organizations use fortnightly cycles for operations and reporting.
                      </p>
                      <p className="text-sm text-slate-600 italic">
                        <strong>Conversion:</strong> 1 fortnight = 14 d = 336 h = 1,209,600 s = 2 weeks
                      </p>
                    </div>
                  </div>
                </div>

                {/* Month */}
                <div className="rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 hover:border-red-300 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-rose-600 text-white font-bold text-sm">
                      mo
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-slate-900 mb-2">Month (30 days)</h4>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Definition:</strong> One month equals 30 days or 2,592,000 seconds. This is a standardized month used for calculations, as actual calendar months vary in length (28-31 days).
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Note:</strong> Calendar months have different lengths: 28-31 days depending on the month and whether it's a leap year. For conversion purposes, we use 30 days as a standard average, which is commonly used in business and financial calculations.
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Common Uses:</strong> Months are used for billing cycles, subscriptions, and medium-term planning. Examples include: monthly subscriptions, rent payments, billing cycles, project milestones, and age calculations (especially for babies and young children). Most financial and business operations use monthly cycles.
                      </p>
                      <p className="text-sm text-slate-600 italic">
                        <strong>Conversion:</strong> 1 mo (30 days) = 30 d = 720 h = 2,592,000 s
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quarter */}
                <div className="rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 hover:border-pink-300 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 text-white font-bold text-sm">
                      Q
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-slate-900 mb-2">Quarter (3 months)</h4>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Definition:</strong> One quarter equals 3 months or 90 days (7,776,000 seconds). This is a standard business and financial time unit.
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Common Uses:</strong> Quarters are fundamental to business, finance, and corporate reporting. Examples include: quarterly earnings reports (Q1, Q2, Q3, Q4), fiscal year planning, quarterly goals and reviews, stock market analysis, and business performance metrics. Most publicly traded companies report financial results quarterly. Academic years are often divided into quarters in some educational systems.
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Business Context:</strong> The business year is typically divided into four quarters: Q1 (January-March), Q2 (April-June), Q3 (July-September), and Q4 (October-December). Quarterly reporting is required for public companies and provides regular updates on financial performance.
                      </p>
                      <p className="text-sm text-slate-600 italic">
                        <strong>Conversion:</strong> 1 quarter = 3 mo = 90 d = 2,160 h = 7,776,000 s
                      </p>
                    </div>
                  </div>
                </div>

                {/* Year */}
                <div className="rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 hover:border-rose-300 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 text-white font-bold text-lg">
                      yr
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-slate-900 mb-2">Year (365 days)</h4>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Definition:</strong> One year equals 365 days or 31,536,000 seconds. This represents a common year (non-leap year) in the Gregorian calendar.
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Note:</strong> A leap year has 366 days (31,622,400 seconds) to account for the approximately 365.25 days it takes Earth to orbit the Sun. For conversion purposes, we use 365 days as the standard, which is accurate for most calculations.
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Common Uses:</strong> Years are fundamental to age, history, and long-term planning. Examples include: age calculations, historical dates, annual reports, yearly goals, and long-term investments. The average human lifespan is approximately 70-80 years. Most major life events and milestones are measured in years.
                      </p>
                      <p className="text-sm text-slate-600 italic">
                        <strong>Conversion:</strong> 1 yr (365 days) = 365 d = 8,760 h = 31,536,000 s = 4 quarters
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Long-Term Time Units */}
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 text-white text-lg font-bold">🌍</span>
                Long-Term Time Units
              </h3>
              
              <div className="space-y-6">
                {/* Decade */}
                <div className="rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 hover:border-teal-300 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 text-white font-bold text-sm">
                      10yr
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-slate-900 mb-2">Decade</h4>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Definition:</strong> One decade equals 10 years or 315,360,000 seconds (based on 365-day years).
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Common Uses:</strong> Decades are used for historical periods, generational analysis, and long-term trends. Examples include: historical eras (the 1960s, the 1990s), generational cohorts (millennials, Gen Z), economic cycles, and long-term planning. Decades help organize history and cultural trends into manageable periods.
                      </p>
                      <p className="text-sm text-slate-600 italic">
                        <strong>Conversion:</strong> 1 decade = 10 yr = 3,650 d = 315,360,000 s
                      </p>
                    </div>
                  </div>
                </div>

                {/* Century */}
                <div className="rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 hover:border-cyan-300 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-bold text-sm">
                      100yr
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-slate-900 mb-2">Century</h4>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Definition:</strong> One century equals 100 years or 3,153,600,000 seconds (based on 365-day years).
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Common Uses:</strong> Centuries are used for major historical periods, geological time scales, and very long-term planning. Examples include: historical eras (20th century, 21st century), architectural lifespans, long-term environmental changes, and generational family histories. Most major historical events and cultural shifts are measured in centuries.
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Historical Context:</strong> The 20th century (1901-2000) saw two world wars, space exploration, and the digital revolution. The 21st century (2001-2100) is marked by globalization, climate change awareness, and rapid technological advancement.
                      </p>
                      <p className="text-sm text-slate-600 italic">
                        <strong>Conversion:</strong> 1 century = 100 yr = 36,500 d = 3,153,600,000 s = 10 decades
                      </p>
                    </div>
                  </div>
                </div>

                {/* Millennium */}
                <div className="rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 hover:border-blue-300 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-xs">
                      1000yr
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-slate-900 mb-2">Millennium</h4>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Definition:</strong> One millennium equals 1,000 years or 31,536,000,000 seconds (based on 365-day years). The word "millennium" comes from Latin "mille" (thousand) and "annus" (year).
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Common Uses:</strong> Millenniums are used for very long-term historical periods, geological time scales, and major cultural epochs. Examples include: major historical transitions (the turn of the millennium in 2000), geological eras, long-term climate studies, and civilization timelines. The concept of millennia helps organize human history into major epochs and cultural periods.
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Historical Context:</strong> The first millennium CE (1-1000) saw the rise and fall of empires, the spread of major religions, and significant cultural developments. The second millennium (1001-2000) included the Renaissance, Industrial Revolution, and modern era. The third millennium (2001-3000) is just beginning and will see continued technological and social evolution.
                      </p>
                      <p className="text-sm text-slate-600 italic">
                        <strong>Conversion:</strong> 1 millennium = 1,000 yr = 365,000 d = 10 centuries = 100 decades
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Unit Comparison Table */}
            <div className="mt-8 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Quick Reference: Time Unit Equivalents</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-slate-300">
                      <th className="text-left py-3 px-4 font-bold text-slate-900">Unit</th>
                      <th className="text-right py-3 px-4 font-bold text-slate-900">Seconds</th>
                      <th className="text-right py-3 px-4 font-bold text-slate-900">Minutes</th>
                      <th className="text-right py-3 px-4 font-bold text-slate-900">Hours</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr className="hover:bg-slate-100">
                      <td className="py-3 px-4 font-medium text-slate-900">1 Nanosecond</td>
                      <td className="py-3 px-4 text-right text-slate-700">0.000000001 s</td>
                      <td className="py-3 px-4 text-right text-slate-700">1.67×10⁻¹¹ min</td>
                      <td className="py-3 px-4 text-right text-slate-700">2.78×10⁻¹³ h</td>
                    </tr>
                    <tr className="hover:bg-slate-100">
                      <td className="py-3 px-4 font-medium text-slate-900">1 Microsecond</td>
                      <td className="py-3 px-4 text-right text-slate-700">0.000001 s</td>
                      <td className="py-3 px-4 text-right text-slate-700">1.67×10⁻⁸ min</td>
                      <td className="py-3 px-4 text-right text-slate-700">2.78×10⁻¹⁰ h</td>
                    </tr>
                    <tr className="hover:bg-slate-100">
                      <td className="py-3 px-4 font-medium text-slate-900">1 Millisecond</td>
                      <td className="py-3 px-4 text-right text-slate-700">0.001 s</td>
                      <td className="py-3 px-4 text-right text-slate-700">0.0000167 min</td>
                      <td className="py-3 px-4 text-right text-slate-700">0.000000278 h</td>
                    </tr>
                    <tr className="hover:bg-slate-100">
                      <td className="py-3 px-4 font-medium text-slate-900">1 Second</td>
                      <td className="py-3 px-4 text-right text-slate-700">1 s</td>
                      <td className="py-3 px-4 text-right text-slate-700">0.0167 min</td>
                      <td className="py-3 px-4 text-right text-slate-700">0.000278 h</td>
                    </tr>
                    <tr className="hover:bg-slate-100">
                      <td className="py-3 px-4 font-medium text-slate-900">1 Minute</td>
                      <td className="py-3 px-4 text-right text-slate-700">60 s</td>
                      <td className="py-3 px-4 text-right text-slate-700">1 min</td>
                      <td className="py-3 px-4 text-right text-slate-700">0.0167 h</td>
                    </tr>
                    <tr className="hover:bg-slate-100">
                      <td className="py-3 px-4 font-medium text-slate-900">1 Hour</td>
                      <td className="py-3 px-4 text-right text-slate-700">3,600 s</td>
                      <td className="py-3 px-4 text-right text-slate-700">60 min</td>
                      <td className="py-3 px-4 text-right text-slate-700">1 h</td>
                    </tr>
                    <tr className="hover:bg-slate-100">
                      <td className="py-3 px-4 font-medium text-slate-900">1 Day</td>
                      <td className="py-3 px-4 text-right text-slate-700">86,400 s</td>
                      <td className="py-3 px-4 text-right text-slate-700">1,440 min</td>
                      <td className="py-3 px-4 text-right text-slate-700">24 h</td>
                    </tr>
                    <tr className="hover:bg-slate-100">
                      <td className="py-3 px-4 font-medium text-slate-900">1 Week</td>
                      <td className="py-3 px-4 text-right text-slate-700">604,800 s</td>
                      <td className="py-3 px-4 text-right text-slate-700">10,080 min</td>
                      <td className="py-3 px-4 text-right text-slate-700">168 h</td>
                    </tr>
                    <tr className="hover:bg-slate-100">
                      <td className="py-3 px-4 font-medium text-slate-900">1 Year (365 days)</td>
                      <td className="py-3 px-4 text-right text-slate-700">31,536,000 s</td>
                      <td className="py-3 px-4 text-right text-slate-700">525,600 min</td>
                      <td className="py-3 px-4 text-right text-slate-700">8,760 h</td>
                    </tr>
                    <tr className="hover:bg-slate-100">
                      <td className="py-3 px-4 font-medium text-slate-900">1 Decade</td>
                      <td className="py-3 px-4 text-right text-slate-700">315,360,000 s</td>
                      <td className="py-3 px-4 text-right text-slate-700">5,256,000 min</td>
                      <td className="py-3 px-4 text-right text-slate-700">87,600 h</td>
                    </tr>
                    <tr className="hover:bg-slate-100">
                      <td className="py-3 px-4 font-medium text-slate-900">1 Century</td>
                      <td className="py-3 px-4 text-right text-slate-700">3,153,600,000 s</td>
                      <td className="py-3 px-4 text-right text-slate-700">52,560,000 min</td>
                      <td className="py-3 px-4 text-right text-slate-700">876,000 h</td>
                    </tr>
                    <tr className="hover:bg-slate-100">
                      <td className="py-3 px-4 font-medium text-slate-900">1 Millennium</td>
                      <td className="py-3 px-4 text-right text-slate-700">31,536,000,000 s</td>
                      <td className="py-3 px-4 text-right text-slate-700">525,600,000 min</td>
                      <td className="py-3 px-4 text-right text-slate-700">8,760,000 h</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* What is Time Conversion? Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">What is Volume Conversion?</h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                <strong>Volume conversion</strong> is the process of converting a volume measurement from one unit to another. Volume measures the amount of space occupied by a substance or the capacity of a container. Understanding how to convert between different volume units is essential for cooking, engineering, scientific research, and everyday measurements.
              </p>
              
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Volume units range from the very small (milliliters, used in cooking and chemistry) to the very large (cubic meters, used in construction and shipping). The most commonly used volume units include milliliters, liters, gallons (US and Imperial), cups, fluid ounces, pints, quarts, and cubic meters. Each unit has a precise mathematical relationship to the others, with the liter being the base metric unit for volume in the International System of Units (SI).
              </p>
              
              <p className="text-base text-slate-700 leading-relaxed mb-6">
                According to the <a href="https://www.bipm.org/en/publications/si-brochure/" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">International Bureau of Weights and Measures (BIPM)</a>, the liter is defined as a special name for the cubic decimeter (1 L = 1 dm³ = 0.001 m³). This precise definition allows for accurate conversions between all volume units, from milliliters (1/1,000 of a liter) to cubic meters (1,000 liters). It's important to note the differences between US customary units and Imperial units, as they have different sizes despite similar names.
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
                    <li>• Confusing US vs Imperial units</li>
                    <li>• Difficult for large volumes</li>
                  </ul>
                </div>
                
                <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">✓</span>
                    Online Volume Converter
                  </h3>
                  <ul className="text-sm text-slate-700 space-y-2">
                    <li>• Instant conversion results</li>
                    <li>• Precise calculations</li>
                    <li>• US and Imperial units supported</li>
                    <li>• Supports 20 volume units</li>
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
              <h2 className="text-3xl font-bold text-slate-900 mb-3">Volume Conversion Facts</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Interesting facts about volume units and their relationships
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-emerald-200 shadow-lg">
                <div className="text-5xl font-extrabold text-emerald-600 mb-2">1,000</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">mL in a Liter</div>
                <div className="text-xs text-slate-600">Base metric relationship</div>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-blue-200 shadow-lg">
                <div className="text-5xl font-extrabold text-blue-600 mb-2">3.785</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Liters in US Gallon</div>
                <div className="text-xs text-slate-600">US customary unit</div>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-purple-200 shadow-lg">
                <div className="text-5xl font-extrabold text-purple-600 mb-2">4.546</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Liters in UK Gallon</div>
                <div className="text-xs text-slate-600">Imperial unit (~20% larger)</div>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-orange-200 shadow-lg">
                <div className="text-5xl font-extrabold text-orange-600 mb-2">236.59</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">mL in a US Cup</div>
                <div className="text-xs text-slate-600">Standard US cup measure</div>
              </div>
            </div>
            
            {/* Authority Link */}
            <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">📊</span>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">Volume Measurement Standards</h4>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    According to the <a href="https://www.bipm.org/en/publications/si-brochure/" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">International Bureau of Weights and Measures (BIPM)</a>, the liter is defined as a special name for the cubic decimeter (1 L = 1 dm³ = 0.001 m³) in the International System of Units (SI). All volume conversions are based on precise mathematical relationships, ensuring accuracy across all volume unit conversions from milliliters to cubic meters. Note that US and Imperial units differ in size despite similar names.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Use Time Converter? Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Why Use Our Volume Converter?</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Our volume converter provides instant, accurate conversions between 20 volume units with high precision. Whether you're cooking, working on engineering projects, or converting measurements, our tool offers the speed, accuracy, and convenience you need.
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
                      All time conversions happen instantly in your browser using precise mathematical calculations. No server delays, no API calls, no waiting—just instant results whenever you need them. Perfect for quick calculations, programming tasks, and scientific work where speed matters.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Benefit 2 */}
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                    <span className="text-2xl">⏱️</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">20 Comprehensive Volume Units</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Convert between milliliters, liters, gallons (US and Imperial), cups, fluid ounces, pints, quarts, cubic meters, cubic feet, cubic inches, cubic yards, teaspoons, tablespoons, barrels, and more. This comprehensive range covers everything from small cooking measurements to large engineering volumes, supporting both metric and customary unit systems.
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
                      Our converter uses precise mathematical formulas based on the International System of Units (SI) definitions. Conversions maintain high precision, making it suitable for cooking, scientific experiments, engineering projects, and construction where accuracy is critical. The tool correctly handles both US and Imperial unit systems.
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
                      All conversions happen locally in your browser. We never store, log, or transmit your conversion data. Your calculations remain completely private, making this tool safe for sensitive scientific or business calculations. No registration, no tracking, no data collection.
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
                      Use our volume converter as much as you want, whenever you need it, without any cost. No hidden fees, no premium tiers, no usage limits. Convert volume units unlimited times for free, making it perfect for home cooks, students, professionals, engineers, and anyone who needs regular volume conversions.
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
                      Access our volume converter from any device—desktop, tablet, or smartphone. The responsive design works perfectly on all screen sizes, so you can convert volume units on the go. Perfect for cooks in the kitchen, professionals on job sites, or anyone who needs quick volume conversions anywhere.
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
              Our volume converter uses precise mathematical conversions based on the International System of Units (SI) definitions. All conversions are calculated client-side in your browser for instant results. Conversions use liters as the base unit, ensuring accuracy across all metric and customary measurements.
            </p>
            
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg mx-auto mb-4">
                  <span className="text-3xl font-bold text-white">1</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Select Units</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Choose your source volume unit from the "Convert From" dropdown and your target volume unit from the "Convert To" dropdown.
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
                  Our converter calculates the conversion using precise mathematical formulas, converting to liters first, then to your target unit.
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
              <h2 className="text-3xl font-bold text-slate-900">Best Practices for Volume Conversion</h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                When converting volume units, following best practices ensures you get accurate results and understand the relationships between different volume measurements. Here are essential tips for using volume converters effectively:
              </p>
              
              <h3 className="text-xl font-bold text-slate-900 mt-6 mb-3">1. Distinguish US and Imperial Units</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Always be aware of whether you're using US or Imperial units, as they differ significantly. For example, 1 US gallon = 3.785 liters, while 1 Imperial gallon = 4.546 liters (about 20% larger). This difference applies to fluid ounces, cups, pints, and quarts as well. When following recipes or specifications, make sure you're using the correct system.
              </p>
              
              <h3 className="text-xl font-bold text-slate-900 mt-6 mb-3">2. Understand Common Cooking Measurements</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                For cooking conversions, remember that 1 US cup = 236.59 mL, 1 tablespoon = 14.79 mL, and 1 teaspoon = 4.93 mL. When converting recipe volumes, be consistent with the measurement system (US vs Imperial) used in your recipe. Most US recipes use US customary units, while UK/Australian recipes typically use Imperial units.
              </p>
              
              <h3 className="text-xl font-bold text-slate-900 mt-6 mb-3">3. Use Appropriate Units for Your Context</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Choose time units that make sense for your application. For computer science and programming, nanoseconds and milliseconds are common. For everyday use, seconds, minutes, and hours are most practical. For historical or geological contexts, years, decades, and centuries are appropriate.
              </p>
              
              <h3 className="text-xl font-bold text-slate-900 mt-6 mb-3">4. Verify Large Number Conversions</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                When converting very large numbers (e.g., converting millions of seconds to years), verify the result makes sense. For example, 31,536,000 seconds equals 1 year, so 100,000,000 seconds equals approximately 3.17 years. Double-checking helps catch input errors.
              </p>
              
              <h3 className="text-xl font-bold text-slate-900 mt-6 mb-3">5. Note Month and Year Definitions</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Our converter uses standard definitions: 1 month = 30 days (2,592,000 seconds) and 1 year = 365 days (31,536,000 seconds). For precise calendar calculations, you may need to account for actual month lengths and leap years, but for most conversions, these standard values provide sufficient accuracy.
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
                <h3 className="text-lg font-bold text-slate-900 mb-2">How do I convert volume units online?</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  To convert volume units online, select your source volume unit from the 'Convert From' dropdown (e.g., liters, gallons, cups, milliliters), choose your target volume unit from the 'Convert To' dropdown, enter the volume value you want to convert, and click the Convert button. The tool will instantly display the converted volume using precise mathematical conversions.
                </p>
              </div>
              
              <div className="border-b border-slate-200 pb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">What volume units are supported by this converter?</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Our volume converter supports 20 volume units including milliliters, liters, cubic meters, gallons (US and Imperial), cups, fluid ounces, pints, quarts, cubic inches, cubic feet, cubic yards, teaspoons, tablespoons, barrels, and more. This comprehensive range covers everything from small cooking measurements to large engineering volumes, making it perfect for recipes, scientific experiments, construction projects, and everyday conversions.
                </p>
              </div>
              
              <div className="border-b border-slate-200 pb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">How accurate are the volume conversions?</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Our volume converter uses precise mathematical conversions based on standard volume unit definitions. Conversions are calculated client-side in your browser with high precision, ensuring accurate results. For example, 1 liter = 1,000 milliliters, 1 US gallon = 3.78541 liters, and 1 cubic meter = 1,000 liters. The tool maintains accuracy across all unit conversions.
                </p>
              </div>
              
              <div className="border-b border-slate-200 pb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">What is the difference between US and Imperial volume units?</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  US and Imperial volume units have different sizes. For example, 1 US gallon equals 3.78541 liters, while 1 Imperial gallon equals 4.54609 liters (about 20% larger). Similarly, US and Imperial fluid ounces, cups, pints, and quarts differ slightly. Our converter supports both systems, allowing you to convert between US and Imperial units accurately. US units are commonly used in the United States, while Imperial units are used in the United Kingdom and some Commonwealth countries.
                </p>
              </div>
              
              <div className="border-b border-slate-200 pb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Is this volume converter free to use?</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Yes, our volume converter is completely free to use. There are no registration requirements, no hidden fees, and no limits on the number of conversions you can perform. Simply visit the page, enter your values, and convert volume units instantly without any cost.
                </p>
              </div>
              
              <div className="border-b border-slate-200 pb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">How do I convert liters to gallons or cups to milliliters?</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  To convert liters to gallons, select 'Liter' as the source unit and 'US Gallon' (or 'Imperial Gallon') as the target unit, enter the number of liters, and click Convert. Similarly, to convert cups to milliliters, select 'US Cup' as the source and 'Milliliter' as the target. The converter handles all standard volume unit conversions automatically with precise calculations.
                </p>
              </div>
              
              <div className="border-b border-slate-200 pb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Can I use this for cooking and recipe conversions?</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Absolutely! Our volume converter is perfect for cooking and recipe conversions. It supports common cooking units like teaspoons, tablespoons, cups, fluid ounces, pints, and quarts. You can easily convert between metric (milliliters, liters) and US customary units (cups, tablespoons) to adapt recipes from different measurement systems.
                </p>
              </div>
              
              <div className="pb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Can I convert between cubic units like cubic meters and cubic feet?</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Yes, our converter supports conversions between all cubic units including cubic meters, cubic centimeters, cubic inches, cubic feet, and cubic yards. These units are commonly used in engineering, construction, and scientific applications. For example, you can convert construction volumes from cubic yards to cubic meters or calculate material quantities using different measurement systems.
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
              <Link href="/conversiontools/currencyConversion" className="group rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 transition-all duration-300 hover:border-emerald-300 hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600">
                    <span className="text-xl">💱</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Currency Converter</h3>
                </div>
                <p className="text-sm text-slate-600">Convert between 170+ world currencies with real-time exchange rates.</p>
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

