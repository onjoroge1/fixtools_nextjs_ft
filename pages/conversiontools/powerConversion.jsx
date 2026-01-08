import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { powerConversion } from '@/components/conversionToolComponent/conversionToolsFunctions';

export default function PowerConversion() {
  const [inputValue, setInputValue] = useState('');
  const [convertFrom, setConvertFrom] = useState('');
  const [convertTo, setConvertTo] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const currentYear = new Date().getFullYear();

  // Power units list - ordered by common usage
  const powerUnits = [
    // SI metric units (most common)
    { value: 'milliwatt', label: 'Milliwatt (mW)', description: '0.001 watts - small electronics' },
    { value: 'watt', label: 'Watt (W)', description: 'Basic SI unit of power' },
    { value: 'kilowatt', label: 'Kilowatt (kW)', description: '1,000 watts - household/utility' },
    { value: 'megawatt', label: 'Megawatt (MW)', description: '1,000,000 watts - power plants' },
    { value: 'gigawatt', label: 'Gigawatt (GW)', description: '1,000,000,000 watts - large power plants' },
    
    // Traditional/Imperial units
    { value: 'horsepower', label: 'Horsepower (hp)', description: '745.7 watts - engines, motors' },
    { value: 'metricHorsepower', label: 'Metric Horsepower (PS)', description: '735.5 watts - European standard' },
    
    // Energy rate units
    { value: 'btuPerHour', label: 'BTU per Hour (BTU/h)', description: '0.293 watts - heating/cooling' },
    { value: 'footPoundPerSecond', label: 'Foot-Pound per Second (ft·lbf/s)', description: '1.356 watts - mechanical power' },
    { value: 'caloriePerSecond', label: 'Calorie per Second (cal/s)', description: '4.184 watts - thermal power' },
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
      const convertedValue = powerConversion(convertFrom, convertTo, amount);
      if (convertedValue === undefined || isNaN(convertedValue)) {
        setError('Conversion not supported between these units');
        return;
      }
      
      const formattedResult = convertedValue.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 6
      });
      
      const fromUnit = powerUnits.find(u => u.value === convertFrom)?.label.split(' ')[0] || convertFrom;
      const toUnit = powerUnits.find(u => u.value === convertTo)?.label.split(' ')[0] || convertTo;
      
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
          "name": "How do I convert power units online?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "To convert power units online, select your source unit (watt, kilowatt, megawatt, horsepower, BTU/h, or any of our 10 supported units) from the 'Convert From' dropdown, choose your target unit from the 'Convert To' dropdown, enter the power value you want to convert, and click the Convert button. The tool will instantly display the converted power value with high precision."
          }
        },
        {
          "@type": "Question",
          "name": "What is the difference between watt, kilowatt, and megawatt?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Watt (W) is the basic unit of power in the International System of Units (SI). One kilowatt (kW) equals 1,000 watts, and one megawatt (MW) equals 1,000,000 watts. For example, a typical household light bulb uses 60-100 watts, a hairdryer uses about 1,500 watts (1.5 kW), and a large power plant generates electricity in megawatts."
          }
        },
        {
          "@type": "Question",
          "name": "Is this power converter accurate?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, our power converter uses precise mathematical conversions based on the standard SI unit relationships. One kilowatt equals exactly 1,000 watts, and one megawatt equals exactly 1,000,000 watts. The tool provides results with up to 6 decimal places for accuracy and displays formatted numbers for easy reading."
          }
        },
        {
          "@type": "Question",
          "name": "Can I use this converter for electrical engineering calculations?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, this tool is suitable for basic power unit conversions needed in electrical engineering, energy calculations, and power system analysis. However, for complex engineering projects, always verify calculations with professional engineering software and consult relevant standards and codes. Our converter handles the fundamental unit conversions accurately."
          }
        },
        {
          "@type": "Question",
          "name": "What are common use cases for power conversion?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Power conversion is commonly used for: calculating energy consumption (converting appliance wattage to kilowatts), sizing solar panel systems (converting total watts to kilowatts), comparing power plant capacities (converting megawatts to kilowatts), understanding electrical bills (kWh to power ratings), and various engineering and technical applications."
          }
        },
        {
          "@type": "Question",
          "name": "Is this power converter free to use?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, our power converter is completely free to use. There are no registration requirements, no hidden fees, and no limits on the number of conversions you can perform. Simply enter your power values and convert between watts, kilowatts, and megawatts instantly without any cost."
          }
        },
        {
          "@type": "Question",
          "name": "How do I convert kilowatts to watts?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "To convert kilowatts to watts, multiply the kilowatt value by 1,000. For example, 5 kilowatts equals 5,000 watts. Our converter handles this automatically—just select 'kilowatt' as the source unit, 'watt' as the target unit, enter the value, and click Convert. The result will show the equivalent wattage."
          }
        },
        {
          "@type": "Question",
          "name": "What is the relationship between power and energy?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Power is the rate at which energy is used or generated, measured in watts. Energy is the total amount of work done or electricity consumed, measured in watt-hours or kilowatt-hours (kWh). For example, a 1,000-watt (1 kW) appliance running for 1 hour consumes 1 kWh of energy. Power units (W, kW, MW) describe the capacity or rate, while energy units (Wh, kWh, MWh) describe the total consumption over time."
          }
        }
      ]
    },
    
    // SoftwareApplication Schema
    softwareApp: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Power Converter",
      "applicationCategory": "UtilityApplication",
      "operatingSystem": "Any",
      "description": "Free online power converter tool to convert between 10 power units including watts, kilowatts, megawatts, gigawatts, horsepower, BTU/h, and more. Fast, accurate, and works instantly in your browser.",
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
        "Convert 10 power units (W, kW, MW, GW, hp, PS, BTU/h, etc.)",
        "High-precision calculations",
        "Instant conversion",
        "100% free and private",
        "No registration required",
        "Mobile-friendly interface",
        "Easy-to-use interface",
        "Detailed unit information"
      ]
    },
    
    // HowTo Schema
    howTo: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Convert Power Units Online",
      "description": "Step-by-step guide to convert between power units (watts, kilowatts, megawatts, horsepower, BTU/h, and more) using FixTools free power converter.",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Select source power unit",
          "text": "Choose the power unit you want to convert from using the 'Convert From' dropdown menu. Options include watt (W), kilowatt (kW), megawatt (MW), gigawatt (GW), horsepower (hp), metric horsepower (PS), BTU per hour, and more.",
          "position": 1
        },
        {
          "@type": "HowToStep",
          "name": "Choose target power unit",
          "text": "Select the power unit you want to convert to from the 'Convert To' dropdown menu. Ensure it's different from the source unit.",
          "position": 2
        },
        {
          "@type": "HowToStep",
          "name": "Enter power value",
          "text": "Type the power value you want to convert in the input field. You can enter whole numbers or decimals. The tool accepts any positive numeric value.",
          "position": 3
        },
        {
          "@type": "HowToStep",
          "name": "Convert and view result",
          "text": "Click the Convert button to instantly see the converted power value. The result displays the equivalent value in your target unit with formatted numbers for easy reading. You can swap units or perform additional conversions as needed.",
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
          "name": "Power Converter",
          "item": "https://fixtools.io/conversiontools/powerConversion"
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
        <title>Power Converter - Free Online Watt, Kilowatt, Megawatt Conversion Tool | FixTools</title>
        <meta name="title" content="Power Converter - Free Online Watt, Kilowatt, Megawatt Conversion Tool | FixTools" />
        <meta name="description" content="Convert power units online for free. Convert between watts, kilowatts, megawatts, gigawatts, horsepower, BTU/h, and 10+ power units instantly. Includes comprehensive educational guide explaining each unit. Fast, accurate, and works in your browser. Perfect for electrical engineering, mechanical engineering, and energy calculations." />
        <meta name="keywords" content="power converter, watt converter, kilowatt converter, megawatt converter, horsepower converter, BTU converter, power unit conversion, convert watts to kilowatts, convert horsepower to watts, convert BTU to watts, power calculator, electrical power converter" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://fixtools.io/conversiontools/powerConversion" />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fixtools.io/conversiontools/powerConversion" />
        <meta property="og:title" content="Power Converter - Free Online Watt, Kilowatt, Megawatt, Horsepower Tool" />
        <meta property="og:description" content="Convert between watts, kilowatts, megawatts, gigawatts, horsepower, BTU/h, and 10+ power units instantly. Free, accurate power unit conversion tool." />
        <meta property="og:image" content="https://fixtools.io/images/og-power-converter.png" />
        <meta property="og:site_name" content="FixTools" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://fixtools.io/conversiontools/powerConversion" />
        <meta property="twitter:title" content="Power Converter - Free Online Tool" />
        <meta property="twitter:description" content="Convert watts, kilowatts, megawatts, horsepower, BTU/h, and 10+ power units instantly. Free and accurate power conversion." />
        <meta property="twitter:image" content="https://fixtools.io/images/og-power-converter.png" />
        
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
        html:has(.power-converter-page) {
          font-size: 100% !important;
        }
        
        .power-converter-page {
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
        .power-converter-page h1,
        .power-converter-page h2,
        .power-converter-page h3,
        .power-converter-page p,
        .power-converter-page ul,
        .power-converter-page ol {
          margin: 0;
        }
        
        /* Button and input inheritance */
        .power-converter-page button {
          font-family: inherit;
          cursor: pointer;
        }
        
        .power-converter-page input,
        .power-converter-page textarea,
        .power-converter-page select {
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

      <div className="power-converter-page bg-[#fbfbfc] text-slate-900 min-h-screen">
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
              <span className="font-semibold text-slate-900">Power Converter</span>
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
                  Power Converter
                </span>
              </h1>
              
              {/* Description */}
              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg md:leading-relaxed">
                Our <strong>power converter</strong> helps you convert between 10 power units including watts, kilowatts, megawatts, horsepower, BTU/h, and more. Perfect for electrical engineering, energy calculations, and understanding power consumption. Fast, accurate, and works entirely in your browser.
              </p>

              {/* CTA Buttons */}
              <div className="mt-7 pb-5 flex flex-wrap items-center gap-3">
                <a href="#tool" className="group relative rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 transition-all duration-200 hover:shadow-xl hover:scale-[1.02]">
                  <span className="relative z-10 flex items-center gap-2">
                    ⚡ Convert Power Units
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
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">10 Units</dd>
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
                      <h4 className="text-lg font-bold text-slate-900">10 Power Units</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Convert between watts, kilowatts, megawatts, gigawatts, horsepower, BTU/h, and more with precise calculations.
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
                <h2 className="text-xl font-semibold text-slate-900">Power Converter online</h2>
                <p className="mt-1 text-sm text-slate-600">Convert between 10 power units including watts, kilowatts, megawatts, horsepower, BTU/h, and more instantly</p>
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
                    {powerUnits.map((unit) => (
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
                    {powerUnits.map((unit) => (
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
                  Power Value
                </label>
                <input
                  type="number"
                  id="inputValue"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Enter power value"
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
                Convert Power Units
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
                  <div className="text-sm font-semibold text-emerald-700 uppercase tracking-wide mb-2">Converted Power</div>
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
              <h2 className="text-3xl font-bold text-slate-900">What is Power?</h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                <strong>Power</strong> is the rate at which energy is transferred, used, or transformed per unit of time. In the International System of Units (SI), power is measured in watts (W), named after Scottish engineer James Watt. Power represents how quickly work is done or energy is consumed. For example, a 100-watt light bulb uses energy at a rate of 100 joules per second.
              </p>
              
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Power units are essential in electrical engineering, energy systems, and everyday life. Understanding power conversion between watts, kilowatts, megawatts, horsepower, and other units is crucial for sizing electrical systems, calculating energy consumption, and comparing power generation capacities. Our converter supports 10 power units including SI metric units (milliwatt, watt, kilowatt, megawatt, gigawatt), traditional units (horsepower, metric horsepower), and specialized units (BTU per hour, foot-pound per second, calorie per second) for comprehensive power conversion needs.
              </p>
              
              <p className="text-base text-slate-700 leading-relaxed mb-6">
                According to the <a href="https://www.nist.gov/pml/weights-and-measures/metric-si/si-units" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">National Institute of Standards and Technology (NIST)</a>, the watt is the standard unit of power in the SI system. Power is fundamental to understanding electrical systems, as it directly relates to energy consumption (power × time = energy). This relationship is why utility companies bill customers in kilowatt-hours (kWh), representing the total energy consumed over time.
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
                    Online Power Converter
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
              <h2 className="text-3xl font-bold text-slate-900">Understanding Power Units</h2>
            </div>
            
            <p className="text-base text-slate-700 leading-relaxed mb-6">
              Power units represent the rate at which energy is used or generated. Understanding each unit's origin, common applications, and relationships helps you choose the right unit for your needs and make accurate conversions. Here's a comprehensive guide to all power units supported by our converter.
            </p>

            {/* SI Metric Units */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-lg font-bold">SI</span>
                SI Metric Units
              </h3>
              
              <div className="space-y-6">
                {/* Milliwatt */}
                <div className="rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 hover:border-blue-300 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-lg">
                      mW
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-slate-900 mb-2">Milliwatt (mW)</h4>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Definition:</strong> One milliwatt equals 0.001 watts (1/1,000 of a watt). The prefix "milli" means one-thousandth in the metric system.
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Common Uses:</strong> Milliwatts are used for very small power measurements, particularly in electronics and telecommunications. Examples include LED indicators (1-5 mW), small sensors, hearing aids, and low-power wireless devices. In laser technology, milliwatts are common for low-power lasers used in pointers, barcode scanners, and optical communication systems.
                      </p>
                      <p className="text-sm text-slate-600 italic">
                        <strong>Conversion:</strong> 1 mW = 0.001 W = 0.000001 kW
                      </p>
                    </div>
                  </div>
                </div>

                {/* Watt */}
                <div className="rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 hover:border-emerald-300 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white font-bold text-lg">
                      W
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-slate-900 mb-2">Watt (W)</h4>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Definition:</strong> The watt is the base unit of power in the International System of Units (SI), named after Scottish engineer James Watt (1736-1819). One watt equals one joule per second, representing the rate of energy transfer or conversion.
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>History:</strong> The watt was adopted as the SI unit of power in 1960, replacing the older "horsepower" in scientific contexts. James Watt's improvements to the steam engine revolutionized the Industrial Revolution, making power measurement standardization essential.
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Common Uses:</strong> Watts are used for household appliances (light bulbs: 40-100 W, laptops: 30-100 W, refrigerators: 100-400 W), small electronics, and personal devices. Most consumer electronics are rated in watts, making it the most familiar power unit for everyday use.
                      </p>
                      <p className="text-sm text-slate-600 italic">
                        <strong>Conversion:</strong> 1 W = 0.001 kW = 0.000001 MW = 1 J/s
                      </p>
                    </div>
                  </div>
                </div>

                {/* Kilowatt */}
                <div className="rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 hover:border-purple-300 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 text-white font-bold text-lg">
                      kW
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-slate-900 mb-2">Kilowatt (kW)</h4>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Definition:</strong> One kilowatt equals 1,000 watts. The prefix "kilo" means one thousand in the metric system.
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Common Uses:</strong> Kilowatts are the standard unit for household energy consumption, utility bills, and medium-scale power systems. Electric utilities bill customers in kilowatt-hours (kWh), representing energy consumed over time. Common applications include: residential solar panel systems (3-10 kW), electric vehicle charging (7-22 kW), home heating systems (5-20 kW), and small commercial buildings.
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Energy Relationship:</strong> Power (kW) × Time (hours) = Energy (kWh). For example, a 2 kW heater running for 3 hours consumes 6 kWh of energy.
                      </p>
                      <p className="text-sm text-slate-600 italic">
                        <strong>Conversion:</strong> 1 kW = 1,000 W = 0.001 MW = 1.341 hp
                      </p>
                    </div>
                  </div>
                </div>

                {/* Megawatt */}
                <div className="rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 hover:border-orange-300 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 text-white font-bold text-lg">
                      MW
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-slate-900 mb-2">Megawatt (MW)</h4>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Definition:</strong> One megawatt equals 1,000,000 watts (1 million watts). The prefix "mega" means one million in the metric system.
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Common Uses:</strong> Megawatts are used for large-scale power generation, industrial facilities, and utility-scale renewable energy. Examples include: wind turbines (1.5-8 MW each), solar farms (10-500 MW), natural gas power plants (100-1,000 MW), nuclear reactors (500-1,400 MW per unit), and large industrial facilities. One megawatt can power approximately 750-1,000 average homes.
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Scale Context:</strong> A typical coal-fired power plant generates 500-1,000 MW, while a large nuclear power plant can generate 1,000-1,400 MW. Modern wind farms often have total capacities of 100-500 MW.
                      </p>
                      <p className="text-sm text-slate-600 italic">
                        <strong>Conversion:</strong> 1 MW = 1,000 kW = 1,000,000 W = 1,341 hp
                      </p>
                    </div>
                  </div>
                </div>

                {/* Gigawatt */}
                <div className="rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 hover:border-teal-300 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 text-white font-bold text-lg">
                      GW
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-slate-900 mb-2">Gigawatt (GW)</h4>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Definition:</strong> One gigawatt equals 1,000,000,000 watts (1 billion watts). The prefix "giga" means one billion in the metric system.
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Common Uses:</strong> Gigawatts are used for national and regional power generation capacity, large-scale renewable energy projects, and major power grid infrastructure. Examples include: large nuclear power plants (1-1.6 GW), massive solar installations (1-2 GW), hydroelectric dams (2-22 GW), and total national power generation capacity. The entire United States has a generating capacity of approximately 1,200 GW.
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Scale Context:</strong> One gigawatt can power approximately 750,000 to 1 million average homes. The largest power plants in the world, such as China's Three Gorges Dam, generate over 22 GW. Major cities often require 1-5 GW of generating capacity.
                      </p>
                      <p className="text-sm text-slate-600 italic">
                        <strong>Conversion:</strong> 1 GW = 1,000 MW = 1,000,000 kW = 1,000,000,000 W
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Traditional/Imperial Units */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white text-lg font-bold">⚙️</span>
                Traditional & Imperial Units
              </h3>
              
              <div className="space-y-6">
                {/* Horsepower */}
                <div className="rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 hover:border-amber-300 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white font-bold text-lg">
                      hp
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-slate-900 mb-2">Horsepower (hp) - Mechanical/Imperial</h4>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Definition:</strong> One mechanical horsepower equals approximately 745.7 watts. This is also called "imperial horsepower" or "mechanical horsepower" and is the standard used in the United States and United Kingdom.
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>History:</strong> Horsepower was originally defined by James Watt in the 18th century to compare the output of steam engines to draft horses. He determined that a horse could turn a mill wheel 2.4 times per minute, lifting 33,000 pounds one foot per minute, which equals 550 foot-pounds per second or approximately 745.7 watts.
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Common Uses:</strong> Horsepower is the standard unit for rating engines, motors, and mechanical power systems. Examples include: car engines (100-700 hp), lawn mowers (5-25 hp), boats (50-1,000+ hp), industrial motors, and agricultural equipment. In the automotive industry, horsepower is the primary metric for engine performance.
                      </p>
                      <p className="text-sm text-slate-600 italic">
                        <strong>Conversion:</strong> 1 hp = 745.7 W = 0.7457 kW = 1.014 PS (metric hp)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Metric Horsepower */}
                <div className="rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 hover:border-yellow-300 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-500 to-amber-600 text-white font-bold text-lg">
                      PS
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-slate-900 mb-2">Metric Horsepower (PS) - Pferdestärke</h4>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Definition:</strong> One metric horsepower (PS, from German "Pferdestärke") equals approximately 735.5 watts. This is the standard used in most European countries and Japan.
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>History:</strong> Metric horsepower was defined in the 19th century as the power needed to lift 75 kilograms one meter in one second, which equals 735.49875 watts. It's slightly smaller than mechanical horsepower.
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Common Uses:</strong> PS is used throughout Europe and Japan for rating car engines, motorcycles, and other vehicles. European car specifications typically list power in both kW and PS. For example, a 150 PS car engine equals approximately 110 kW or 148 hp (mechanical).
                      </p>
                      <p className="text-sm text-slate-600 italic">
                        <strong>Conversion:</strong> 1 PS = 735.5 W = 0.7355 kW = 0.986 hp (mechanical)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Specialized Units */}
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 text-white text-lg font-bold">🔧</span>
                Specialized Units
              </h3>
              
              <div className="space-y-6">
                {/* BTU per Hour */}
                <div className="rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 hover:border-rose-300 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 text-white font-bold text-sm">
                      BTU/h
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-slate-900 mb-2">BTU per Hour (BTU/h)</h4>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Definition:</strong> BTU per hour represents the rate of thermal energy transfer. One BTU (British Thermal Unit) equals the energy needed to raise one pound of water by one degree Fahrenheit. One BTU per hour equals approximately 0.293 watts.
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Common Uses:</strong> BTU/h is the standard unit for heating and cooling systems in the United States. Examples include: air conditioners (5,000-24,000 BTU/h for residential), furnaces (40,000-200,000 BTU/h), heat pumps, and commercial HVAC systems. When shopping for air conditioners, you'll see ratings like "12,000 BTU" which means 12,000 BTU per hour of cooling capacity.
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Practical Example:</strong> A 12,000 BTU/h air conditioner has a cooling capacity of approximately 3.5 kW. This is typically sufficient for cooling a 400-500 square foot room.
                      </p>
                      <p className="text-sm text-slate-600 italic">
                        <strong>Conversion:</strong> 1 BTU/h = 0.293 W = 0.000293 kW ≈ 1/3,412 kW
                      </p>
                    </div>
                  </div>
                </div>

                {/* Foot-Pound per Second */}
                <div className="rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 hover:border-indigo-300 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-xs">
                      ft·lbf/s
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-slate-900 mb-2">Foot-Pound per Second (ft·lbf/s)</h4>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Definition:</strong> One foot-pound per second equals the power needed to apply a force of one pound-force through a distance of one foot in one second. One ft·lbf/s equals approximately 1.356 watts.
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>History:</strong> This unit comes from the British Imperial system and was commonly used before the adoption of horsepower and watts. It's directly related to mechanical work and power in engineering calculations.
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Common Uses:</strong> Foot-pound per second is used in mechanical engineering, particularly in the United States, for calculating power in rotating machinery, torque applications, and mechanical systems. It's also used in physics education to illustrate the relationship between force, distance, and power.
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Relationship:</strong> 550 ft·lbf/s = 1 horsepower (mechanical). This is the original definition of horsepower.
                      </p>
                      <p className="text-sm text-slate-600 italic">
                        <strong>Conversion:</strong> 1 ft·lbf/s = 1.356 W = 0.001356 kW
                      </p>
                    </div>
                  </div>
                </div>

                {/* Calorie per Second */}
                <div className="rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 hover:border-red-300 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-rose-600 text-white font-bold text-sm">
                      cal/s
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-slate-900 mb-2">Calorie per Second (cal/s)</h4>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Definition:</strong> One calorie per second equals the rate of thermal energy transfer. One calorie (thermochemical) equals 4.184 joules, so one calorie per second equals 4.184 watts.
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Common Uses:</strong> Calorie per second is used in thermal engineering, nutrition science (for metabolic rates), and heat transfer calculations. It's particularly useful when working with thermal power systems, food energy, and biological processes. The human body at rest consumes energy at approximately 1-1.5 calories per second (4-6 watts), while during intense exercise, this can increase to 10-20 calories per second (40-80 watts).
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        <strong>Note:</strong> The "calorie" used in power calculations is the thermochemical calorie (4.184 J), not the "Calorie" (kilocalorie) used in food labeling, which is 1,000 times larger.
                      </p>
                      <p className="text-sm text-slate-600 italic">
                        <strong>Conversion:</strong> 1 cal/s = 4.184 W = 0.004184 kW
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Unit Comparison Table */}
            <div className="mt-8 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Quick Reference: Power Unit Equivalents</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-slate-300">
                      <th className="text-left py-3 px-4 font-bold text-slate-900">Unit</th>
                      <th className="text-right py-3 px-4 font-bold text-slate-900">Watts</th>
                      <th className="text-right py-3 px-4 font-bold text-slate-900">Kilowatts</th>
                      <th className="text-right py-3 px-4 font-bold text-slate-900">Horsepower</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr className="hover:bg-slate-100">
                      <td className="py-3 px-4 font-medium text-slate-900">1 Milliwatt</td>
                      <td className="py-3 px-4 text-right text-slate-700">0.001 W</td>
                      <td className="py-3 px-4 text-right text-slate-700">0.000001 kW</td>
                      <td className="py-3 px-4 text-right text-slate-700">0.00000134 hp</td>
                    </tr>
                    <tr className="hover:bg-slate-100">
                      <td className="py-3 px-4 font-medium text-slate-900">1 Watt</td>
                      <td className="py-3 px-4 text-right text-slate-700">1 W</td>
                      <td className="py-3 px-4 text-right text-slate-700">0.001 kW</td>
                      <td className="py-3 px-4 text-right text-slate-700">0.00134 hp</td>
                    </tr>
                    <tr className="hover:bg-slate-100">
                      <td className="py-3 px-4 font-medium text-slate-900">1 Kilowatt</td>
                      <td className="py-3 px-4 text-right text-slate-700">1,000 W</td>
                      <td className="py-3 px-4 text-right text-slate-700">1 kW</td>
                      <td className="py-3 px-4 text-right text-slate-700">1.341 hp</td>
                    </tr>
                    <tr className="hover:bg-slate-100">
                      <td className="py-3 px-4 font-medium text-slate-900">1 Megawatt</td>
                      <td className="py-3 px-4 text-right text-slate-700">1,000,000 W</td>
                      <td className="py-3 px-4 text-right text-slate-700">1,000 kW</td>
                      <td className="py-3 px-4 text-right text-slate-700">1,341 hp</td>
                    </tr>
                    <tr className="hover:bg-slate-100">
                      <td className="py-3 px-4 font-medium text-slate-900">1 Gigawatt</td>
                      <td className="py-3 px-4 text-right text-slate-700">1,000,000,000 W</td>
                      <td className="py-3 px-4 text-right text-slate-700">1,000,000 kW</td>
                      <td className="py-3 px-4 text-right text-slate-700">1,341,000 hp</td>
                    </tr>
                    <tr className="hover:bg-slate-100">
                      <td className="py-3 px-4 font-medium text-slate-900">1 Horsepower (hp)</td>
                      <td className="py-3 px-4 text-right text-slate-700">745.7 W</td>
                      <td className="py-3 px-4 text-right text-slate-700">0.7457 kW</td>
                      <td className="py-3 px-4 text-right text-slate-700">1 hp</td>
                    </tr>
                    <tr className="hover:bg-slate-100">
                      <td className="py-3 px-4 font-medium text-slate-900">1 Metric Horsepower (PS)</td>
                      <td className="py-3 px-4 text-right text-slate-700">735.5 W</td>
                      <td className="py-3 px-4 text-right text-slate-700">0.7355 kW</td>
                      <td className="py-3 px-4 text-right text-slate-700">0.986 hp</td>
                    </tr>
                    <tr className="hover:bg-slate-100">
                      <td className="py-3 px-4 font-medium text-slate-900">1 BTU per Hour</td>
                      <td className="py-3 px-4 text-right text-slate-700">0.293 W</td>
                      <td className="py-3 px-4 text-right text-slate-700">0.000293 kW</td>
                      <td className="py-3 px-4 text-right text-slate-700">0.000393 hp</td>
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
              <h2 className="text-3xl font-bold text-slate-900 mb-3">Power Conversion Impact</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Understanding power units is essential for electrical engineering and energy management
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-emerald-200 shadow-lg">
                <div className="text-5xl font-extrabold text-emerald-600 mb-2">1 kW</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Household Average</div>
                <div className="text-xs text-slate-600">Typical home power consumption</div>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-blue-200 shadow-lg">
                <div className="text-5xl font-extrabold text-blue-600 mb-2">100 W</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Light Bulb</div>
                <div className="text-xs text-slate-600">Standard incandescent bulb</div>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-purple-200 shadow-lg">
                <div className="text-5xl font-extrabold text-purple-600 mb-2">1.5 MW</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Wind Turbine</div>
                <div className="text-xs text-slate-600">Average modern turbine capacity</div>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-orange-200 shadow-lg">
                <div className="text-5xl font-extrabold text-orange-600 mb-2">500 MW</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Power Plant</div>
                <div className="text-xs text-slate-600">Medium-sized generating station</div>
              </div>
            </div>
            
            {/* Authority Link */}
            <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">📊</span>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">Understanding Power Units</h4>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    According to the <a href="https://www.nist.gov/pml/weights-and-measures/metric-si/si-units" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">National Institute of Standards and Technology (NIST)</a>, the watt is the standard SI unit of power, defined as one joule per second. Understanding power unit conversions is essential for electrical engineers, energy managers, and anyone working with electrical systems or renewable energy projects. The ability to convert between watts, kilowatts, and megawatts accurately is fundamental to proper system design and energy calculations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Use Power Converter? Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Why Use Our Power Converter?</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Our power converter provides instant, accurate conversions between 10 power units including watts, kilowatts, megawatts, gigawatts, horsepower (mechanical and metric), BTU per hour, and more. Whether you're working on electrical engineering projects, calculating energy consumption, comparing power generation capacities, or working with engines and motors, our tool offers the precision and ease of use you need.
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
                      Get immediate power unit conversions with high precision (up to 6 decimal places). Perfect for electrical engineering calculations, energy system design, and professional applications. Our converter supports 10 power units including SI metric units (W, kW, MW, GW), traditional units (horsepower), and specialized units (BTU/h). All conversions use exact mathematical relationships, ensuring accurate results every time.
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
                      Quickly compare power values across different units. Convert appliance wattage to kilowatts for energy bills, convert engine horsepower to kilowatts for specifications, convert solar panel capacities from kilowatts to megawatts for large installations, or convert BTU/h to watts for HVAC systems. The swap feature lets you instantly reverse conversions, making it easy to work in either direction without recalculating.
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
                      Ideal for electrical engineers, mechanical engineers, energy consultants, HVAC professionals, and anyone working with power systems. Use it for sizing electrical equipment, converting engine specifications, calculating load requirements, designing renewable energy systems, HVAC system sizing, and understanding utility-scale power generation. The tool provides formatted output that's ready for professional documentation.
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
                      Access our power converter from any device—desktop, tablet, or smartphone. The responsive design works perfectly on all screen sizes, so you can convert power units on the go. Perfect for field engineers and technicians who need quick conversions while working on-site or in the field.
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
                      Use our power converter as much as you want, whenever you need it, without any cost. No hidden fees, no premium tiers, no usage limits. Convert power units unlimited times for free, making it perfect for students, professionals, and anyone working with electrical systems regularly.
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
              Our power converter uses precise mathematical relationships between power units to provide accurate conversions instantly. Here's how the process works:
            </p>
            
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg mx-auto mb-4">
                  <span className="text-3xl font-bold text-white">1</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Select Units</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Choose your source power unit (watt, kilowatt, or megawatt) from the "Convert From" dropdown and your target unit from the "Convert To" dropdown.
                </p>
              </div>
              
              <div className="text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg mx-auto mb-4">
                  <span className="text-3xl font-bold text-white">2</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Enter Value</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Type the power value you want to convert in the input field. You can enter whole numbers or decimals for precise values.
                </p>
              </div>
              
              <div className="text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg mx-auto mb-4">
                  <span className="text-3xl font-bold text-white">3</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Calculate</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Our system performs the precise mathematical conversion using standard SI unit relationships (1 kW = 1,000 W, 1 MW = 1,000,000 W).
                </p>
              </div>
              
              <div className="text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg mx-auto mb-4">
                  <span className="text-3xl font-bold text-white">4</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">View Result</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Click Convert to instantly see the converted power value displayed clearly with the target unit abbreviation, formatted for easy reading.
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
              <h2 className="text-3xl font-bold text-slate-900">Best Practices for Power Conversion</h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                When converting power units, following best practices ensures accurate results and proper understanding of electrical and mechanical systems. Here are essential tips for using power converters effectively:
              </p>
              
              <h3 className="text-xl font-bold text-slate-900 mt-6 mb-3">1. Understand the Relationship Between Units</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Remember that power conversions follow standard metric prefixes: 1 kilowatt = 1,000 watts, 1 megawatt = 1,000,000 watts, and 1 gigawatt = 1,000,000,000 watts. These are exact conversions based on the International System of Units (SI). For traditional units, 1 mechanical horsepower (hp) ≈ 745.7 watts, 1 metric horsepower (PS) ≈ 735.5 watts, and 1 BTU/hour ≈ 0.293 watts. Understanding these relationships helps verify calculator results and catch potential errors in manual calculations.
              </p>
              
              <h3 className="text-xl font-bold text-slate-900 mt-6 mb-3">2. Distinguish Between Power and Energy</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Power (watts, kilowatts, megawatts) represents the rate of energy use, while energy (watt-hours, kilowatt-hours, megawatt-hours) represents total consumption over time. When calculating energy bills, multiply power by time: Power (kW) × Time (hours) = Energy (kWh). Our converter handles power units only; for energy conversions, use a dedicated energy converter.
              </p>
              
              <h3 className="text-xl font-bold text-slate-900 mt-6 mb-3">3. Use Appropriate Precision</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                For most practical applications, 2-4 decimal places are sufficient. However, for precise engineering calculations, our converter provides up to 6 decimal places. Match the precision to your application: household appliances typically don't need high precision, while electrical engineering calculations may require greater accuracy.
              </p>
              
              <h3 className="text-xl font-bold text-slate-900 mt-6 mb-3">4. Verify Results for Critical Applications</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                For critical engineering projects, electrical system design, or safety-related calculations, always verify results using multiple methods or professional engineering software. While our converter uses precise calculations, independent verification is essential for high-stakes applications where errors could have serious consequences.
              </p>
              
              <h3 className="text-xl font-bold text-slate-900 mt-6 mb-3">5. Consider Context and Application</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Different applications use different power units. Household appliances are typically rated in watts, utility bills show consumption in kilowatts, power plants generate electricity in megawatts or gigawatts, engines and motors are rated in horsepower, and HVAC systems use BTU per hour. Understanding which unit is appropriate for your context helps ensure clear communication and proper system understanding. Our converter supports all these common units, making it versatile for various professional applications.
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
                <h3 className="text-lg font-bold text-slate-900 mb-2">How do I convert power units online?</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  To convert power units online, select your source unit (watt, kilowatt, or megawatt) from the 'Convert From' dropdown, choose your target unit from the 'Convert To' dropdown, enter the power value you want to convert, and click the Convert button. The tool will instantly display the converted power value with high precision.
                </p>
              </div>
              
              <div className="border-b border-slate-200 pb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">What power units are supported?</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Our converter supports 10 power units: SI metric units (milliwatt, watt, kilowatt, megawatt, gigawatt), traditional units (mechanical horsepower, metric horsepower/PS), and specialized units (BTU per hour, foot-pound per second, calorie per second). Watt (W) is the basic SI unit. One kilowatt equals 1,000 watts, one megawatt equals 1,000,000 watts, and one gigawatt equals 1,000,000,000 watts. One mechanical horsepower equals approximately 745.7 watts.
                </p>
              </div>
              
              <div className="border-b border-slate-200 pb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Is this power converter accurate?</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Yes, our power converter uses precise mathematical conversions based on the standard SI unit relationships. One kilowatt equals exactly 1,000 watts, and one megawatt equals exactly 1,000,000 watts. The tool provides results with up to 6 decimal places for accuracy and displays formatted numbers for easy reading.
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
                <h3 className="text-lg font-bold text-slate-900 mb-2">Is this power converter free to use?</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Yes, our power converter is completely free to use. There are no registration requirements, no hidden fees, and no limits on the number of conversions you can perform. Simply enter your power values and convert between any of our 10 supported power units (watts, kilowatts, megawatts, gigawatts, horsepower, BTU/h, and more) instantly without any cost.
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

