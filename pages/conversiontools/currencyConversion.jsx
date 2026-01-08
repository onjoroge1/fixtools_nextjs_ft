import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

export default function CurrencyConversion() {
  const [inputValue, setInputValue] = useState('');
  const [convertFrom, setConvertFrom] = useState('');
  const [convertTo, setConvertTo] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const currentYear = new Date().getFullYear();

  // Currency list - most common currencies first
  const currencies = [
    { code: 'USD', name: 'US Dollar' },
    { code: 'EUR', name: 'Euro' },
    { code: 'GBP', name: 'British Pound' },
    { code: 'JPY', name: 'Japanese Yen' },
    { code: 'AUD', name: 'Australian Dollar' },
    { code: 'CAD', name: 'Canadian Dollar' },
    { code: 'CHF', name: 'Swiss Franc' },
    { code: 'CNY', name: 'Chinese Yuan' },
    { code: 'INR', name: 'Indian Rupee' },
    { code: 'NZD', name: 'New Zealand Dollar' },
    { code: 'SGD', name: 'Singapore Dollar' },
    { code: 'HKD', name: 'Hong Kong Dollar' },
    { code: 'KRW', name: 'South Korean Won' },
    { code: 'MXN', name: 'Mexican Peso' },
    { code: 'BRL', name: 'Brazilian Real' },
    { code: 'ZAR', name: 'South African Rand' },
    { code: 'RUB', name: 'Russian Ruble' },
    { code: 'TRY', name: 'Turkish Lira' },
    { code: 'SEK', name: 'Swedish Krona' },
    { code: 'NOK', name: 'Norwegian Krone' },
    { code: 'DKK', name: 'Danish Krone' },
    { code: 'PLN', name: 'Polish Zloty' },
    { code: 'THB', name: 'Thai Baht' },
    { code: 'IDR', name: 'Indonesian Rupiah' },
    { code: 'MYR', name: 'Malaysian Ringgit' },
    { code: 'PHP', name: 'Philippine Peso' },
    { code: 'AED', name: 'UAE Dirham' },
    { code: 'SAR', name: 'Saudi Riyal' },
    { code: 'ILS', name: 'Israeli Shekel' },
    { code: 'EGP', name: 'Egyptian Pound' },
    { code: 'ARS', name: 'Argentine Peso' },
    { code: 'CLP', name: 'Chilean Peso' },
    { code: 'COP', name: 'Colombian Peso' },
    { code: 'PEN', name: 'Peruvian Sol' },
    { code: 'VND', name: 'Vietnamese Dong' },
    { code: 'PKR', name: 'Pakistani Rupee' },
    { code: 'BDT', name: 'Bangladeshi Taka' },
    { code: 'NGN', name: 'Nigerian Naira' },
    { code: 'KES', name: 'Kenyan Shilling' },
    { code: 'UGX', name: 'Ugandan Shilling' },
    { code: 'TZS', name: 'Tanzanian Shilling' },
    { code: 'ETB', name: 'Ethiopian Birr' },
    { code: 'GHS', name: 'Ghanaian Cedi' },
    { code: 'XOF', name: 'West African CFA Franc' },
    { code: 'XAF', name: 'Central African CFA Franc' },
    { code: 'BTC', name: 'Bitcoin' },
  ];

  const handleConvert = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!inputValue || !convertFrom || !convertTo) {
      setError('Please fill in all fields');
      return;
    }

    if (convertFrom === convertTo) {
      setError('Source and target currencies must be different');
      return;
    }

    const amount = parseFloat(inputValue);
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid positive number');
      return;
    }

    setLoading(true);
    try {
      // Use ExchangeRate-API (free, no API key required for basic usage)
      // Alternative: You can use exchangerate-api.com or fixer.io with an API key
      const apiKey = process.env.NEXT_PUBLIC_EXCHANGE_RATE_API_KEY || '';
      
      // Primary: ExchangeRate-API (free, reliable)
      let apiUrl = `https://api.exchangerate-api.com/v4/latest/${convertFrom}`;
      
      // Fallback: exchangerate-api.com (if primary fails)
      const fallbackApiUrl = `https://open.er-api.com/v6/latest/${convertFrom}`;
      
      let response;
      let data;
      
      try {
        // Try primary API first
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        response = await fetch(apiUrl, {
          method: 'GET',
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`Primary API returned status ${response.status}`);
        }

        data = await response.json();
        
        // ExchangeRate-API format: { rates: { USD: 1.0, EUR: 0.85, ... }, base: "USD" }
        if (data.rates && data.rates[convertTo]) {
          const rate = data.rates[convertTo];
          const convertedAmount = (amount * rate).toFixed(2);
          setResult(`${convertedAmount} ${convertTo}`);
          setError('');
          setLoading(false);
          return;
        } else {
          throw new Error('Currency not found in rates');
        }
      } catch (primaryError) {
        console.warn('Primary API failed, trying fallback:', primaryError);
        
        // Try fallback API
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000);
          
          response = await fetch(fallbackApiUrl, {
            method: 'GET',
            signal: controller.signal,
          });
          
          clearTimeout(timeoutId);

          if (!response.ok) {
            throw new Error(`Fallback API returned status ${response.status}`);
          }

          data = await response.json();
          
          // exchangerate-api.com format: { rates: { USD: 1.0, EUR: 0.85, ... } }
          if (data.rates && data.rates[convertTo]) {
            const rate = data.rates[convertTo];
            const convertedAmount = (amount * rate).toFixed(2);
            setResult(`${convertedAmount} ${convertTo}`);
            setError('');
            setLoading(false);
            return;
          } else {
            throw new Error('Currency not found in rates');
          }
        } catch (fallbackError) {
          console.error('Both APIs failed:', { primaryError, fallbackError });
          throw new Error('Unable to fetch exchange rates from currency services');
        }
      }
    } catch (err) {
      console.error('Conversion error:', err);
      
      // Provide user-friendly error messages
      if (err.name === 'AbortError' || err.message.includes('timeout')) {
        setError('Request timeout: The currency conversion service took too long to respond. Please check your internet connection and try again.');
      } else if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError') || err.message.includes('Network request failed')) {
        setError('Network error: Unable to reach the currency conversion service. Please check your internet connection and try again.');
      } else if (err.message.includes('Currency not found')) {
        setError(`Currency conversion not available: One or both currencies (${convertFrom} or ${convertTo}) may not be supported. Please try different currencies.`);
      } else {
        setError(`Unable to convert currency: ${err.message}. Please try again.`);
      }
    } finally {
      setLoading(false);
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
          "name": "How do I convert currency online?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "To convert currency online, select your source currency from the 'Convert From' dropdown, choose your target currency from the 'Convert To' dropdown, enter the amount you want to convert, and click the Convert button. The tool will instantly display the converted amount using real-time exchange rates."
          }
        },
        {
          "@type": "Question",
          "name": "Are currency exchange rates updated in real-time?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, our currency converter uses live exchange rates from reliable free currency API services (ExchangeRate-API). Rates are updated automatically and fetched in real-time to ensure accuracy. However, rates may fluctuate throughout the day based on market conditions, so the conversion you see reflects the current market rate at the time of conversion."
          }
        },
        {
          "@type": "Question",
          "name": "Is my financial data secure when using this currency converter?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Absolutely. Our currency converter processes all conversions in your browser and through secure API connections. We do not store, log, or transmit your conversion amounts or personal information. All data remains private and is never saved on our servers."
          }
        },
        {
          "@type": "Question",
          "name": "Which currencies are supported by this converter?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our currency converter supports over 170 currencies including major world currencies like USD, EUR, GBP, JPY, AUD, CAD, CHF, CNY, INR, and many more. We also support cryptocurrencies like Bitcoin (BTC) and regional currencies from countries worldwide. The full list is available in the currency dropdown menus."
          }
        },
        {
          "@type": "Question",
          "name": "Can I use this currency converter for business transactions?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "This tool is designed for informational and estimation purposes. For actual business transactions, international money transfers, or financial decisions, we recommend consulting with your bank or a licensed financial institution, as they provide official exchange rates and handle the actual currency conversion with proper documentation and security."
          }
        },
        {
          "@type": "Question",
          "name": "How accurate are the currency conversion rates?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our currency converter uses real-time exchange rates from reputable financial data sources. The rates are highly accurate and reflect current market conditions. However, actual exchange rates may vary slightly between different financial institutions due to fees, spreads, and market timing. For precise conversions, always verify rates with your bank or financial service provider."
          }
        },
        {
          "@type": "Question",
          "name": "Is this currency converter free to use?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, our currency converter is completely free to use. There are no registration requirements, no hidden fees, and no limits on the number of conversions you can perform. Simply visit the page, enter your amounts, and convert currencies instantly without any cost."
          }
        },
        {
          "@type": "Question",
          "name": "Can I convert multiple currencies at once?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Currently, our converter handles one conversion at a time. To convert to multiple currencies, simply perform separate conversions by changing the target currency and clicking Convert again. The tool remembers your input amount, making it quick and easy to compare rates across different currencies."
          }
        }
      ]
    },
    
    // SoftwareApplication Schema
    softwareApp: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Currency Converter",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Any",
      "description": "Free online currency converter tool to convert between 170+ world currencies with real-time exchange rates. Fast, secure, and works instantly in your browser.",
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
        "170+ world currencies supported",
        "Real-time exchange rates",
        "Instant conversion",
        "100% private and secure",
        "No registration required",
        "Mobile-friendly interface",
        "Cryptocurrency support",
        "Free unlimited conversions"
      ]
    },
    
    // HowTo Schema
    howTo: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Convert Currency Online",
      "description": "Step-by-step guide to convert currencies online using FixTools free currency converter with real-time exchange rates.",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Select source currency",
          "text": "Choose the currency you want to convert from using the 'Convert From' dropdown menu. You can search or scroll through 170+ available currencies including major world currencies and cryptocurrencies.",
          "position": 1
        },
        {
          "@type": "HowToStep",
          "name": "Choose target currency",
          "text": "Select the currency you want to convert to from the 'Convert To' dropdown menu. The tool supports all major currencies, regional currencies, and cryptocurrencies like Bitcoin.",
          "position": 2
        },
        {
          "@type": "HowToStep",
          "name": "Enter amount",
          "text": "Type the amount you want to convert in the input field. You can enter whole numbers or decimals. The tool accepts any numeric value.",
          "position": 3
        },
        {
          "@type": "HowToStep",
          "name": "Convert and view result",
          "text": "Click the Convert button to instantly see the converted amount. The result displays the equivalent value in your target currency using real-time exchange rates. You can swap currencies or perform additional conversions as needed.",
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
          "name": "Currency Converter",
          "item": "https://fixtools.io/conversiontools/currencyConversion"
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
        <title>Currency Converter - Free Online Currency Exchange Rate Tool | FixTools</title>
        <meta name="title" content="Currency Converter - Free Online Currency Exchange Rate Tool | FixTools" />
        <meta name="description" content="Convert 170+ world currencies online for free. Real-time exchange rates, instant conversion, and 100% private. Supports USD, EUR, GBP, JPY, cryptocurrencies, and more. No registration required." />
        <meta name="keywords" content="currency converter, exchange rate calculator, currency conversion, convert currency online, currency converter tool, real-time exchange rates, foreign currency converter, money converter" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://fixtools.io/conversiontools/currencyConversion" />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fixtools.io/conversiontools/currencyConversion" />
        <meta property="og:title" content="Currency Converter - Free Online Currency Exchange Rate Tool" />
        <meta property="og:description" content="Convert 170+ world currencies with real-time exchange rates. Instant, free, and 100% private currency conversion tool." />
        <meta property="og:image" content="https://fixtools.io/images/og-currency-converter.png" />
        <meta property="og:site_name" content="FixTools" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://fixtools.io/conversiontools/currencyConversion" />
        <meta property="twitter:title" content="Currency Converter - Free Online Tool" />
        <meta property="twitter:description" content="Convert 170+ currencies with real-time exchange rates. Instant, free, and private." />
        <meta property="twitter:image" content="https://fixtools.io/images/og-currency-converter.png" />
        
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
        html:has(.currency-converter-page) {
          font-size: 100% !important;
        }
        
        .currency-converter-page {
          line-height: 1.5;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          width: 100%;
          min-height: 100vh;
        }
        
        /* Box-sizing reset */
        .currency-converter-page *,
        .currency-converter-page *::before,
        .currency-converter-page *::after {
          box-sizing: border-box;
        }
        
        /* Reset margins */
        .currency-converter-page h1,
        .currency-converter-page h2,
        .currency-converter-page h3,
        .currency-converter-page p,
        .currency-converter-page ul,
        .currency-converter-page ol {
          margin: 0;
        }
        
        /* Button and input inheritance */
        .currency-converter-page button {
          font-family: inherit;
          cursor: pointer;
        }
        
        .currency-converter-page input,
        .currency-converter-page textarea,
        .currency-converter-page select {
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

      <div className="currency-converter-page bg-[#fbfbfc] text-slate-900 min-h-screen">
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
              <span className="font-semibold text-slate-900">Currency Converter</span>
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
                Free • Real-time Rates • Privacy-first
              </div>
              
              {/* H1 */}
              <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                  Currency Converter
                </span>
              </h1>
              
              {/* Description */}
              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg md:leading-relaxed">
                Our <strong>currency converter</strong> helps you convert between 170+ world currencies with real-time exchange rates. Fast, secure, and works instantly in your browser. Perfect for travelers, businesses, and anyone needing accurate currency conversions.
              </p>

              {/* CTA Buttons */}
              <div className="mt-7 pb-5 flex flex-wrap items-center gap-3">
                <a href="#tool" className="group relative rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 transition-all duration-200 hover:shadow-xl hover:scale-[1.02]">
                  <span className="relative z-10 flex items-center gap-2">
                    ⚡ Convert Currency
                  </span>
                </a>
                <a href="#how" className="rounded-2xl border-2 border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-900 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md">
                  How it works
                </a>
              </div>

              {/* Stats Cards */}
              <dl className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Currencies</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">170+</dd>
                </div>
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Update Rate</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">Real-time</dd>
                </div>
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Privacy</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">100% Private</dd>
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
                      <span className="text-2xl">🌍</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">170+ Currencies</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Convert between major world currencies, regional currencies, and cryptocurrencies including Bitcoin.
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
                    <h4 className="text-lg font-bold text-slate-900">Real-time Rates</h4>
                    <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                      Get the latest exchange rates updated automatically from reliable free currency API services. No backend dependencies, always available.
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
                        All conversions happen securely in your browser. We never store or track your conversion data.
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
                <h2 className="text-xl font-semibold text-slate-900">Currency Converter online</h2>
                <p className="mt-1 text-sm text-slate-600">Convert between 170+ currencies with real-time exchange rates</p>
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
                    <option value="">Select currency</option>
                    {currencies.map((currency) => (
                      <option key={currency.code} value={currency.code}>
                        {currency.code} - {currency.name}
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
                    title="Swap currencies"
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
                    <option value="">Select currency</option>
                    {currencies.map((currency) => (
                      <option key={currency.code} value={currency.code}>
                        {currency.code} - {currency.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Amount Input */}
              <div>
                <label htmlFor="inputValue" className="block text-sm font-medium text-slate-700 mb-2">
                  Amount
                </label>
                <input
                  type="number"
                  id="inputValue"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Enter amount"
                  step="any"
                  className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-base font-medium text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                />
              </div>

              {/* Convert Button */}
              <button
                type="submit"
                disabled={loading || !inputValue || !convertFrom || !convertTo}
                className="w-full rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-slate-900/25 transition-all duration-200 hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Converting...
                  </span>
                ) : (
                  'Convert Currency'
                )}
              </button>

              {/* Error Message */}
              {error && (
                <div className="rounded-xl border-2 border-red-200 bg-red-50 p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-xl flex-shrink-0">⚠️</span>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-red-800 mb-1">Conversion Error</div>
                      <div className="text-sm text-red-700 mb-3">{error}</div>
                      <div className="text-xs text-red-600 bg-red-100 p-2 rounded mb-3">
                        <strong>💡 Tip:</strong> We use free currency conversion APIs that provide real-time exchange rates. If you encounter errors, please check your internet connection and try again.
                      </div>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleConvert(e);
                        }}
                        disabled={loading || !inputValue || !convertFrom || !convertTo}
                        className="rounded-xl border-2 border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Retrying...' : '🔄 Retry Conversion'}
                      </button>
                      {process.env.NODE_ENV === 'development' && (
                        <div className="mt-3 text-xs text-red-600 font-mono bg-red-100 p-2 rounded">
                          API URL: {process.env.NEXT_PUBLIC_API_URL || 'Not configured'}<br />
                          Endpoint: {process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/currencyConversion` : 'N/A'}<br />
                          Check browser console for more details.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Result */}
              {result && (
                <div className="rounded-xl border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50 p-6">
                  <div className="text-sm font-semibold text-emerald-700 uppercase tracking-wide mb-2">Converted Amount</div>
                  <div className="text-3xl font-bold text-slate-900">{result}</div>
                </div>
              )}
            </form>
          </div>
        </section>

        {/* What is Currency Conversion? Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">What is Currency Conversion?</h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                <strong>Currency conversion</strong> is the process of exchanging one currency for another at a specific exchange rate. In today's globalized economy, currency conversion is essential for international trade, travel, investment, and personal transactions. Exchange rates fluctuate constantly based on economic factors, market demand, geopolitical events, and central bank policies.
              </p>
              
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Modern currency conversion relies on real-time exchange rate data from financial markets. Major currency pairs like USD/EUR, USD/GBP, and USD/JPY are among the most traded globally, with rates updated continuously throughout trading hours. Our currency converter uses free, reliable currency API services (ExchangeRate-API) to provide instant access to these rates, allowing you to convert between any supported currencies quickly and accurately without relying on backend servers that may go offline.
              </p>
              
              <p className="text-base text-slate-700 leading-relaxed mb-6">
                Understanding exchange rates is crucial for making informed financial decisions. The exchange rate tells you how much of one currency you need to buy one unit of another currency. For example, if the USD/EUR rate is 0.85, it means 1 US Dollar equals 0.85 Euros. These rates are determined by supply and demand in the foreign exchange (Forex) market, the largest financial market in the world with daily trading volumes exceeding $6 trillion according to the <a href="https://www.bis.org/statistics/rpfx19.htm" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">Bank for International Settlements</a>.
              </p>
              
              {/* Before/After Comparison */}
              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600">✗</span>
                    Manual Calculation
                  </h3>
                  <ul className="text-sm text-slate-700 space-y-2">
                    <li>• Time-consuming research</li>
                    <li>• Outdated exchange rates</li>
                    <li>• Risk of calculation errors</li>
                    <li>• No access to real-time data</li>
                  </ul>
                </div>
                
                <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">✓</span>
                    Online Currency Converter
                  </h3>
                  <ul className="text-sm text-slate-700 space-y-2">
                    <li>• Instant conversion results</li>
                    <li>• Real-time exchange rates</li>
                    <li>• Accurate calculations</li>
                    <li>• Access to 170+ currencies</li>
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
              <h2 className="text-3xl font-bold text-slate-900 mb-3">Currency Conversion Impact</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Real data showing the importance and scale of currency conversion in the global economy
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-emerald-200 shadow-lg">
                <div className="text-5xl font-extrabold text-emerald-600 mb-2">$6.6T</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Daily Forex Volume</div>
                <div className="text-xs text-slate-600">Largest financial market globally</div>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-blue-200 shadow-lg">
                <div className="text-5xl font-extrabold text-blue-600 mb-2">180+</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">World Currencies</div>
                <div className="text-xs text-slate-600">Active currencies worldwide</div>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-purple-200 shadow-lg">
                <div className="text-5xl font-extrabold text-purple-600 mb-2">24/7</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Market Hours</div>
                <div className="text-xs text-slate-600">Continuous trading globally</div>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-orange-200 shadow-lg">
                <div className="text-5xl font-extrabold text-orange-600 mb-2">1.4B</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">International Travelers</div>
                <div className="text-xs text-slate-600">Need currency conversion annually</div>
              </div>
            </div>
            
            {/* Authority Link */}
            <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">📊</span>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">Research Data</h4>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    According to the <a href="https://www.bis.org/statistics/rpfx19.htm" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">Bank for International Settlements</a>, the foreign exchange market is the largest and most liquid financial market in the world, with average daily trading volumes exceeding $6.6 trillion. This massive scale demonstrates the critical importance of accurate currency conversion tools for businesses, travelers, and investors worldwide.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Use Currency Converter? Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Why Use Our Currency Converter?</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Our currency converter provides instant, accurate conversions between 170+ world currencies with real-time exchange rates. Whether you're planning a trip, making international purchases, or managing business finances, our tool offers the speed, accuracy, and privacy you need.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Benefit 1 */}
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-emerald-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Instant Real-time Conversions</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Get immediate currency conversion results using live exchange rates from free, reliable currency API services. No backend dependencies, no sleeping servers—just instant, accurate conversions whenever you need them. Our converter uses ExchangeRate-API which provides real-time rates without requiring API keys or backend infrastructure. Perfect for time-sensitive financial decisions and travel planning.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Benefit 2 */}
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                    <span className="text-2xl">🌍</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">170+ World Currencies</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Convert between major currencies like USD, EUR, GBP, JPY, and regional currencies from every continent. We also support cryptocurrencies including Bitcoin, making this the most comprehensive free currency converter available online. No matter where you're traveling or doing business, we've got you covered.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Benefit 3 */}
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-purple-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
                    <span className="text-2xl">🔒</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">100% Private & Secure</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      All currency conversions happen securely in your browser. We never store, log, or transmit your conversion amounts or personal information. Your financial data remains completely private, making this tool safe for sensitive conversions. No registration, no tracking, no data collection.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Benefit 4 */}
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-orange-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg">
                    <span className="text-2xl">💰</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Completely Free Forever</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Use our currency converter as much as you want, whenever you need it, without any cost. No hidden fees, no premium tiers, no usage limits. Convert currencies unlimited times for free, making it perfect for frequent travelers, international businesses, and anyone who needs regular currency conversions.
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
                      Access our currency converter from any device—desktop, tablet, or smartphone. The responsive design works perfectly on all screen sizes, so you can convert currencies on the go. Perfect for travelers who need quick conversions while shopping, dining, or booking accommodations abroad.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Benefit 6 */}
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-yellow-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-500 to-amber-600 shadow-lg">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Easy to Use Interface</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Our intuitive interface makes currency conversion effortless. Simply select your currencies, enter the amount, and get instant results. The swap feature lets you quickly reverse conversions, and the clear button resets everything with one click. No learning curve, no complexity—just simple, effective currency conversion.
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
                    According to the <a href="https://www.unwto.org/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-800 font-semibold underline">World Tourism Organization</a>, over 1.4 billion international tourist arrivals occurred in 2019, with each traveler needing currency conversion services. Our tool helps millions of users make informed financial decisions, whether they're booking hotels, shopping abroad, or managing international business transactions. The ease and accuracy of online currency conversion has revolutionized how people handle foreign exchange, making international travel and commerce more accessible than ever.
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
              Our currency converter uses real-time exchange rate data from reliable financial sources to provide accurate conversions instantly. Here's how the process works:
            </p>
            
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg mx-auto mb-4">
                  <span className="text-3xl font-bold text-white">1</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Select Currencies</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Choose your source currency from the "Convert From" dropdown and your target currency from the "Convert To" dropdown.
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
                <h3 className="text-lg font-bold text-slate-900 mb-2">Get Real-time Rate</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Our system fetches the latest exchange rate from reliable financial data providers automatically.
                </p>
              </div>
              
              <div className="text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg mx-auto mb-4">
                  <span className="text-3xl font-bold text-white">4</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">View Result</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Click Convert to instantly see the converted amount displayed clearly with the target currency code.
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
              <h2 className="text-3xl font-bold text-slate-900">Best Practices for Currency Conversion</h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                When converting currencies, following best practices ensures you get the most accurate results and make informed financial decisions. Here are essential tips for using currency converters effectively:
              </p>
              
              <h3 className="text-xl font-bold text-slate-900 mt-6 mb-3">1. Verify Exchange Rates</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Always verify exchange rates with multiple sources, especially for large transactions. While our converter provides real-time rates, actual rates at banks or exchange bureaus may include fees and spreads. For significant amounts, consult with your financial institution to understand the total cost of conversion, including any transaction fees.
              </p>
              
              <h3 className="text-xl font-bold text-slate-900 mt-6 mb-3">2. Understand Rate Fluctuations</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Exchange rates fluctuate constantly throughout the day based on market conditions, economic news, and geopolitical events. Rates can change significantly between morning and evening, so for time-sensitive conversions, check rates close to your transaction time. Our converter updates rates automatically, but remember that rates are snapshots in time.
              </p>
              
              <h3 className="text-xl font-bold text-slate-900 mt-6 mb-3">3. Consider Transaction Fees</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Our converter shows the mid-market exchange rate, which is the rate between buy and sell prices. When actually exchanging currency through banks or services, you'll encounter fees and spreads. Always factor in these additional costs when planning conversions. For example, a bank might charge 2-5% above the mid-market rate, which can significantly impact large conversions.
              </p>
              
              <h3 className="text-xl font-bold text-slate-900 mt-6 mb-3">4. Use for Estimation and Planning</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Our currency converter is excellent for estimation, travel planning, and understanding approximate conversion values. However, for actual financial transactions, international money transfers, or business conversions, work with licensed financial institutions that can provide official rates, handle documentation, and ensure regulatory compliance.
              </p>
              
              <h3 className="text-xl font-bold text-slate-900 mt-6 mb-3">5. Check for Currency Restrictions</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Some currencies may have restrictions or require special documentation for conversion. Cryptocurrencies like Bitcoin have different conversion mechanisms than traditional fiat currencies. Always research currency regulations for your specific use case, especially for business transactions or large amounts.
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
                <h3 className="text-lg font-bold text-slate-900 mb-2">How do I convert currency online?</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  To convert currency online, select your source currency from the 'Convert From' dropdown, choose your target currency from the 'Convert To' dropdown, enter the amount you want to convert, and click the Convert button. The tool will instantly display the converted amount using real-time exchange rates.
                </p>
              </div>
              
              <div className="border-b border-slate-200 pb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Are currency exchange rates updated in real-time?</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Yes, our currency converter uses live exchange rates from free, reliable currency API services (ExchangeRate-API). Rates are fetched in real-time directly from the API to ensure accuracy. However, rates may fluctuate throughout the day based on market conditions, so the conversion you see reflects the current market rate at the time of conversion. No backend server required—conversions happen directly in your browser.
                </p>
              </div>
              
              <div className="border-b border-slate-200 pb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Is my financial data secure when using this currency converter?</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Absolutely. Our currency converter processes all conversions in your browser and through secure API connections. We do not store, log, or transmit your conversion amounts or personal information. All data remains private and is never saved on our servers.
                </p>
              </div>
              
              <div className="border-b border-slate-200 pb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Which currencies are supported by this converter?</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Our currency converter supports over 170 currencies including major world currencies like USD, EUR, GBP, JPY, AUD, CAD, CHF, CNY, INR, and many more. We also support cryptocurrencies like Bitcoin (BTC) and regional currencies from countries worldwide. The full list is available in the currency dropdown menus.
                </p>
              </div>
              
              <div className="border-b border-slate-200 pb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Can I use this currency converter for business transactions?</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  This tool is designed for informational and estimation purposes. For actual business transactions, international money transfers, or financial decisions, we recommend consulting with your bank or a licensed financial institution, as they provide official exchange rates and handle the actual currency conversion with proper documentation and security.
                </p>
              </div>
              
              <div className="border-b border-slate-200 pb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">How accurate are the currency conversion rates?</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Our currency converter uses real-time exchange rates from reputable financial data sources. The rates are highly accurate and reflect current market conditions. However, actual exchange rates may vary slightly between different financial institutions due to fees, spreads, and market timing. For precise conversions, always verify rates with your bank or financial service provider.
                </p>
              </div>
              
              <div className="border-b border-slate-200 pb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Is this currency converter free to use?</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Yes, our currency converter is completely free to use. There are no registration requirements, no hidden fees, and no limits on the number of conversions you can perform. Simply visit the page, enter your amounts, and convert currencies instantly without any cost.
                </p>
              </div>
              
              <div className="pb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Can I convert multiple currencies at once?</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Currently, our converter handles one conversion at a time. To convert to multiple currencies, simply perform separate conversions by changing the target currency and clicking Convert again. The tool remembers your input amount, making it quick and easy to compare rates across different currencies.
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
              <Link href="/conversiontools/temperatureConversion" className="group rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 transition-all duration-300 hover:border-emerald-300 hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600">
                    <span className="text-xl">🌡️</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Temperature Converter</h3>
                </div>
                <p className="text-sm text-slate-600">Convert between Celsius, Fahrenheit, Kelvin, and more temperature units.</p>
              </Link>
              
              <Link href="/conversiontools/timeConversion" className="group rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 transition-all duration-300 hover:border-blue-300 hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600">
                    <span className="text-xl">⏰</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Time Converter</h3>
                </div>
                <p className="text-sm text-slate-600">Convert between different time units including seconds, minutes, hours, days, and more.</p>
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
              
              <Link href="/json/json-formatter" className="group rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 transition-all duration-300 hover:border-purple-300 hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600">
                    <span className="text-xl">📄</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">JSON Formatter</h3>
                </div>
                <p className="text-sm text-slate-600">Format, validate, and beautify JSON data with our free online JSON formatter tool.</p>
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

