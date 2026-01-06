import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

const siteHost = process.env.NEXT_PUBLIC_HOST || 'https://fixtools.io';

export default function IPLocation() {
  const [ipInput, setIpInput] = useState('');
  const [ipInfo, setIpInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [autoDetected, setAutoDetected] = useState(false);
  const [copyText, setCopyText] = useState('📋 Copy');
  const currentYear = new Date().getFullYear();
  const canonicalUrl = `${siteHost}/seo-tools/ip-location`;

  // Auto-detect user's IP on page load
  useEffect(() => {
    detectMyIP();
  }, []);

  const detectMyIP = async () => {
    setLoading(true);
    setError('');
    try {
      // Use ipapi.co for free IP detection (no API key needed for basic usage)
      const response = await fetch('https://ipapi.co/json/');
      if (!response.ok) throw new Error('Failed to detect IP');
      const data = await response.json();
      
      setIpInput(data.ip || '');
      setIpInfo(data);
      setAutoDetected(true);
    } catch (err) {
      // Fallback to alternative service
      try {
        const fallbackResponse = await fetch('https://api.ipify.org?format=json');
        const fallbackData = await fallbackResponse.json();
        if (fallbackData.ip) {
          setIpInput(fallbackData.ip);
          await lookupIP(fallbackData.ip);
          setAutoDetected(true);
        }
      } catch (fallbackErr) {
        setError('Unable to detect your IP address. Please enter an IP address manually.');
      }
    } finally {
      setLoading(false);
    }
  };

  const lookupIP = async (ipAddress) => {
    if (!ipAddress.trim()) {
      setError('Please enter an IP address');
      return;
    }

    // Basic IP validation
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (!ipRegex.test(ipAddress.trim())) {
      setError('Please enter a valid IP address (e.g., 8.8.8.8)');
      return;
    }

    setLoading(true);
    setError('');
    setAutoDetected(false);

    try {
      const response = await fetch(`https://ipapi.co/${ipAddress.trim()}/json/`);
      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please try again in a moment.');
        }
        throw new Error('Failed to lookup IP address');
      }
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.reason || 'Invalid IP address');
      }
      
      setIpInfo(data);
    } catch (err) {
      setError(err.message || 'Failed to lookup IP address. Please try again.');
      setIpInfo(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    lookupIP(ipInput);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopyText('✅ Copied!');
    setTimeout(() => setCopyText('📋 Copy'), 2000);
  };

  const handleClear = () => {
    setIpInput('');
    setIpInfo(null);
    setError('');
    setAutoDetected(false);
  };

  // Format IP info for display
  const formatIPInfo = () => {
    if (!ipInfo) return '';
    
    let info = `IP Address: ${ipInfo.ip || 'N/A'}\n`;
    if (ipInfo.city) info += `City: ${ipInfo.city}\n`;
    if (ipInfo.region) info += `Region: ${ipInfo.region}\n`;
    if (ipInfo.country_name) info += `Country: ${ipInfo.country_name} (${ipInfo.country_code || ''})\n`;
    if (ipInfo.postal) info += `Postal Code: ${ipInfo.postal}\n`;
    if (ipInfo.latitude && ipInfo.longitude) {
      info += `Coordinates: ${ipInfo.latitude}, ${ipInfo.longitude}\n`;
    }
    if (ipInfo.timezone) info += `Timezone: ${ipInfo.timezone}\n`;
    if (ipInfo.org) info += `Organization: ${ipInfo.org}\n`;
    if (ipInfo.asn) info += `ASN: ${ipInfo.asn}\n`;
    
    return info.trim();
  };

  // Structured Data Schemas
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": `${siteHost}/`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Tools",
        "item": `${siteHost}/tools`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "SEO Tools",
        "item": `${siteHost}/tools/seo-tools`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": "IP Location Checker",
        "item": canonicalUrl
      }
    ]
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "IP Location Checker",
    "applicationCategory": "SEO Tool",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Free IP location checker and 'What is my IP' tool. Get your IP address, location, ISP, and geolocation information instantly. No registration required."
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Check IP Location",
    "description": "Step-by-step guide to checking IP address location",
    "step": [
      {
        "@type": "HowToStep",
        "name": "Auto-Detect Your IP",
        "text": "Click 'What is my IP' button to automatically detect your current IP address and location information."
      },
      {
        "@type": "HowToStep",
        "name": "Or Enter IP Address",
        "text": "Enter any IP address in the input field to lookup its location, ISP, and geolocation data."
      },
      {
        "@type": "HowToStep",
        "name": "View Results",
        "text": "View detailed information including city, country, coordinates, timezone, and organization."
      },
      {
        "@type": "HowToStep",
        "name": "Copy Information",
        "text": "Click the copy button to copy IP information to your clipboard for easy sharing or documentation."
      }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is my IP address?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Your IP address is a unique identifier assigned to your device when connected to the internet. Click the 'What is my IP' button to automatically detect your current IP address and view detailed location information."
        }
      },
      {
        "@type": "Question",
        "name": "How accurate is IP geolocation?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "IP geolocation is generally accurate to the city level, but accuracy can vary. It's based on the location of your ISP's infrastructure, not your exact physical location. Results are typically accurate within 50-100 miles for most users."
        }
      },
      {
        "@type": "Question",
        "name": "Can I lookup any IP address?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, you can lookup any public IP address (IPv4) using this tool. Simply enter the IP address in the input field and click 'Lookup IP'. The tool will display location, ISP, timezone, and other geolocation information."
        }
      },
      {
        "@type": "Question",
        "name": "Is my IP address private?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, all IP lookups are processed securely. We use third-party services (ipapi.co) that don't store your IP address or lookup history. Your privacy is protected, and no data is saved on our servers."
        }
      },
      {
        "@type": "Question",
        "name": "What information does IP lookup provide?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "IP lookup provides detailed information including: IP address, city, region/state, country, postal code, coordinates (latitude/longitude), timezone, ISP/organization, and ASN (Autonomous System Number)."
        }
      },
      {
        "@type": "Question",
        "name": "Why would I need to check my IP address?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Checking your IP address is useful for troubleshooting network issues, verifying VPN connections, understanding your geographic location for services, checking if your IP is blocked, and for security purposes like detecting unauthorized access."
        }
      },
      {
        "@type": "Question",
        "name": "Is this IP location tool free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, our IP location checker is 100% free to use. There's no registration required, no account needed, and no hidden fees. You can check your IP address or lookup any IP address as many times as you need."
        }
      },
      {
        "@type": "Question",
        "name": "Can I use this tool on mobile devices?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! The IP location checker is fully responsive and works on mobile devices, tablets, and desktops. You can check your IP address from any device with an internet connection."
        }
      }
    ]
  };

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>What is My IP - Free IP Location Checker | FixTools</title>
        <meta name="title" content="What is My IP - Free IP Location Checker | FixTools" />
        <meta name="description" content="Check your IP address and location instantly. Free IP location checker with geolocation, ISP, timezone, and coordinates. Find out what is my IP with detailed information." />
        <meta name="keywords" content="what is my ip, ip address checker, ip location, ip lookup, ip geolocation, find my ip, check ip address, ip location finder, ip address lookup, my ip address" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content="What is My IP - Free IP Location Checker" />
        <meta property="og:description" content="Check your IP address and location instantly. Free IP location checker with geolocation, ISP, and timezone information." />
        <meta property="og:image" content={`${siteHost}/images/ip-location-og.png`} />
        <meta property="og:site_name" content="FixTools" />
        
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content="What is My IP - Free IP Location Checker" />
        <meta property="twitter:description" content="Check your IP address and location instantly. Free IP location checker." />
        <meta property="twitter:image" content={`${siteHost}/images/ip-location-og.png`} />
        
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      </Head>

      <style jsx global>{`
        html:has(.ip-location-page) {
          font-size: 100% !important;
        }
        
        .ip-location-page {
          line-height: 1.5;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          width: 100%;
          min-height: 100vh;
        }
        
        .ip-location-page *,
        .ip-location-page *::before,
        .ip-location-page *::after {
          box-sizing: border-box;
        }
      `}</style>

      <div className="ip-location-page bg-[#fbfbfc] text-slate-900 min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/fixtools-logos/fixtools-logos_black.svg" alt="FixTools" width={120} height={40} className="h-9 w-auto" />
            </Link>
            <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
              <Link className="hover:text-slate-900 transition-colors" href="/tools/json">JSON</Link>
              <Link className="hover:text-slate-900 transition-colors" href="/tools/html">HTML</Link>
              <Link className="hover:text-slate-900 transition-colors" href="/tools/css">CSS</Link>
              <Link className="hover:text-slate-900 transition-colors" href="/tools/image-tools">Images</Link>
              <Link className="hover:text-slate-900 transition-colors" href="/learn">Learn</Link>
              <Link className="hover:text-slate-900 transition-colors" href="/back-to-school">Back to School</Link>
              <Link className="hover:text-slate-900 transition-colors" href="/tools">All tools</Link>
            </nav>
            <Link href="/tools" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50">
              Browse tools
            </Link>
          </div>
        </header>

        {/* Breadcrumbs */}
        <nav className="mx-auto max-w-6xl px-4 py-3" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm text-slate-600">
            <li><Link href="/" className="hover:text-slate-900 transition-colors">Home</Link></li>
            <li className="flex items-center gap-2"><span className="text-slate-400">/</span><Link href="/tools" className="hover:text-slate-900 transition-colors">Tools</Link></li>
            <li className="flex items-center gap-2"><span className="text-slate-400">/</span><Link href="/tools/seo-tools" className="hover:text-slate-900 transition-colors">SEO Tools</Link></li>
            <li className="flex items-center gap-2"><span className="text-slate-400">/</span><span className="font-semibold text-slate-900">IP Location Checker</span></li>
          </ol>
        </nav>

        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.35]" style={{ backgroundImage: 'url(/grid.png)', backgroundSize: '256px 256px' }}></div>
          <div className="mx-auto max-w-6xl px-4 py-10 md:py-14 relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 px-4 py-1.5 text-xs font-semibold text-amber-700 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              Free • Private • Instant
            </div>
            
            <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              <span className="bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-600 bg-clip-text text-transparent">
                IP Location Checker
              </span>
            </h1>
            
            <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg md:leading-relaxed">
              Check your IP address and location instantly. Find out "what is my IP" with detailed geolocation information including city, country, ISP, timezone, and coordinates. Free IP lookup tool.
            </p>

            <dl className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
              <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Processing</dt>
                <dd className="mt-1.5 text-sm font-bold text-slate-900">API-Based</dd>
              </div>
              <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Privacy</dt>
                <dd className="mt-1.5 text-sm font-bold text-slate-900">Secure</dd>
              </div>
              <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Speed</dt>
                <dd className="mt-1.5 text-sm font-bold text-slate-900">&lt;2s</dd>
              </div>
              <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Price</dt>
                <dd className="mt-1.5 text-sm font-bold text-slate-900">Free</dd>
              </div>
            </dl>
          </div>
        </section>

        {/* Tool Interface */}
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="space-y-6">
              <div className="rounded-3xl border-2 border-amber-300 bg-white p-6 shadow-xl">
                <h2 className="text-xl font-bold text-slate-900 mb-4">IP Address Lookup</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">IP Address</label>
                    <input
                      type="text"
                      value={ipInput}
                      onChange={(e) => setIpInput(e.target.value)}
                      placeholder="8.8.8.8 or leave empty for auto-detect"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    />
                    <p className="mt-1 text-xs text-slate-500">Enter an IP address or click "What is my IP" to auto-detect</p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={detectMyIP}
                      disabled={loading}
                      className="flex-1 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading && !ipInfo ? 'Detecting...' : '🌐 What is my IP'}
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={loading || !ipInput.trim()}
                      className="flex-1 rounded-xl bg-amber-600 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Looking up...' : '🔍 Lookup IP'}
                    </button>
                  </div>

                  {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  )}

                  {autoDetected && (
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
                      <p className="text-sm text-emerald-700">✅ Your IP address has been auto-detected!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div className="space-y-6">
              <div className="rounded-3xl border-2 border-amber-300 bg-white p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-slate-900">IP Information</h2>
                  {ipInfo && (
                    <button
                      onClick={() => handleCopy(formatIPInfo())}
                      className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-200"
                    >
                      {copyText}
                    </button>
                  )}
                </div>
                
                {loading && !ipInfo ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
                  </div>
                ) : ipInfo ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">IP Address</p>
                        <p className="text-lg font-bold text-slate-900">{ipInfo.ip || 'N/A'}</p>
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Country</p>
                        <p className="text-lg font-bold text-slate-900">{ipInfo.country_name || 'N/A'}</p>
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">City</p>
                        <p className="text-lg font-bold text-slate-900">{ipInfo.city || 'N/A'}</p>
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Region</p>
                        <p className="text-lg font-bold text-slate-900">{ipInfo.region || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Additional Information</p>
                      <div className="space-y-2 text-sm text-slate-700">
                        {ipInfo.postal && <p><strong>Postal Code:</strong> {ipInfo.postal}</p>}
                        {ipInfo.latitude && ipInfo.longitude && (
                          <p><strong>Coordinates:</strong> {ipInfo.latitude}, {ipInfo.longitude}</p>
                        )}
                        {ipInfo.timezone && <p><strong>Timezone:</strong> {ipInfo.timezone}</p>}
                        {ipInfo.org && <p><strong>ISP/Organization:</strong> {ipInfo.org}</p>}
                        {ipInfo.asn && <p><strong>ASN:</strong> {ipInfo.asn}</p>}
                      </div>
                    </div>

                    <button
                      onClick={handleClear}
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50"
                    >
                      Clear Results
                    </button>
                  </div>
                ) : (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center">
                    <p className="text-slate-600">Enter an IP address or click "What is my IP" to get started</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Content Sections */}
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 md:p-10 shadow-lg">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">What is an IP Address?</h2>
            <p className="text-base text-slate-700 leading-relaxed mb-4">
              An <strong>IP (Internet Protocol) address</strong> is a unique numerical identifier assigned to every device connected to the internet. It functions like a mailing address, allowing data to be routed to the correct destination across the global network. According to <a href="https://www.iana.org/numbers" target="_blank" rel="noopener noreferrer" className="text-amber-700 hover:text-amber-800 font-semibold underline">IANA (Internet Assigned Numbers Authority)</a>, IP addresses are managed globally to ensure unique identification of every internet-connected device.
            </p>
            <p className="text-base text-slate-700 leading-relaxed mb-4">
              IP addresses come in two main versions:
            </p>
            <ul className="list-disc list-inside space-y-2 text-base text-slate-700 mb-4">
              <li><strong>IPv4:</strong> The most common format, consisting of four numbers separated by dots (e.g., 192.168.1.1). As defined in <a href="https://tools.ietf.org/html/rfc791" target="_blank" rel="noopener noreferrer" className="text-amber-700 hover:text-amber-800 font-semibold underline">RFC 791</a>, IPv4 provides approximately 4.3 billion unique addresses.</li>
              <li><strong>IPv6:</strong> A newer format designed to accommodate the growing number of internet-connected devices. IPv6, as specified in <a href="https://tools.ietf.org/html/rfc2460" target="_blank" rel="noopener noreferrer" className="text-amber-700 hover:text-amber-800 font-semibold underline">RFC 2460</a>, provides virtually unlimited address space with 340 undecillion possible addresses.</li>
            </ul>
            <p className="text-base text-slate-700 leading-relaxed mb-4">
              Your IP address reveals information about your approximate geographic location, internet service provider (ISP), and network. This information is used by websites and services to provide location-based content, prevent fraud, and optimize performance. According to <a href="https://en.wikipedia.org/wiki/IP_address" target="_blank" rel="noopener noreferrer" className="text-amber-700 hover:text-amber-800 font-semibold underline">Wikipedia</a>, IP addresses are essential for internet communication and network routing.
            </p>
            <p className="text-base text-slate-700 leading-relaxed mb-4">
              IP geolocation works by mapping IP addresses to geographic locations using databases maintained by organizations like <a href="https://www.arin.net/" target="_blank" rel="noopener noreferrer" className="text-amber-700 hover:text-amber-800 font-semibold underline">ARIN (American Registry for Internet Numbers)</a> and other regional internet registries. These databases track which IP address ranges are assigned to which ISPs and geographic regions.
            </p>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 md:p-10 shadow-lg">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">IP Address Statistics & Data</h2>
            <p className="text-base text-slate-700 leading-relaxed mb-6">
              Understanding IP address usage and geolocation accuracy helps you make informed decisions about when and how to use IP location tools.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-3">IPv4 vs IPv6 Adoption</h3>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold mt-0.5">•</span>
                    <span><strong>IPv4:</strong> Still dominant with ~4.3 billion addresses (nearly exhausted)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold mt-0.5">•</span>
                    <span><strong>IPv6:</strong> Growing adoption, currently ~35-40% of Google traffic</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold mt-0.5">•</span>
                    <span><strong>Transition:</strong> Gradual migration to IPv6 as IPv4 addresses run out</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-3">Geolocation Accuracy</h3>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold mt-0.5">•</span>
                    <span><strong>Country-level:</strong> 95-99% accurate</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold mt-0.5">•</span>
                    <span><strong>City-level:</strong> 80-90% accurate (varies by region)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold mt-0.5">•</span>
                    <span><strong>Precision:</strong> Typically within 50-100 miles of actual location</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-3">IP Address Usage Statistics</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm text-slate-700">
                <div>
                  <p className="font-semibold text-slate-900 mb-1">Total IPv4 Addresses</p>
                  <p className="text-2xl font-bold text-emerald-600">4.3 Billion</p>
                  <p className="text-xs text-slate-600 mt-1">Nearly exhausted globally</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900 mb-1">Daily IP Lookups</p>
                  <p className="text-2xl font-bold text-emerald-600">Millions</p>
                  <p className="text-xs text-slate-600 mt-1">For security, geolocation, and analytics</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900 mb-1">Geolocation Services</p>
                  <p className="text-2xl font-bold text-emerald-600">100+</p>
                  <p className="text-xs text-slate-600 mt-1">Commercial and free services available</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Use Section */}
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 md:p-10 shadow-lg">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Use an IP Location Checker?</h2>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              IP location checkers are essential tools for a wide range of use cases, from troubleshooting network issues to enhancing security and understanding your digital footprint.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-amber-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 shadow-lg">
                    <span className="text-2xl">🔒</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Security & Fraud Prevention</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Verify login locations to detect unauthorized access. If you see logins from unexpected locations, you can immediately secure your accounts. Many security systems use IP geolocation to flag suspicious activity and prevent fraud.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-amber-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                    <span className="text-2xl">🌐</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">VPN & Proxy Verification</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Check if your VPN or proxy is working correctly by verifying your IP address and location. Ensure your privacy tools are functioning as expected and that your real location is properly masked.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-amber-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
                    <span className="text-2xl">🔧</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Network Troubleshooting</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Diagnose network connectivity issues by checking your IP address. Verify that your device is receiving a valid IP, confirm your ISP assignment, and troubleshoot routing problems. Essential for IT professionals and network administrators.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-amber-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
                    <span className="text-2xl">📊</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Content Localization</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Websites use IP geolocation to provide location-specific content, currency, language, and services. Understanding your IP location helps you understand why you see certain content and ensures you receive the most relevant information.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-amber-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg">
                    <span className="text-2xl">🛡️</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Access Control & Blocking</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Check if your IP address is blocked by websites or services. Some platforms block IPs from certain regions or ISPs. Understanding your IP location helps you troubleshoot access issues and determine if geographic restrictions are affecting you.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-amber-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 shadow-lg">
                    <span className="text-2xl">📈</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Analytics & Marketing</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Businesses use IP geolocation for analytics, understanding their audience demographics, and delivering targeted marketing campaigns. Knowing your IP location helps you understand how businesses see and categorize your traffic.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-6 mt-6">
              <h3 className="text-lg font-bold text-slate-900 mb-3">Key Benefits Summary</h3>
              <ul className="grid md:grid-cols-2 gap-3 text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold mt-0.5">✓</span>
                  <span>Instant IP address detection and location information</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold mt-0.5">✓</span>
                  <span>Verify VPN and proxy functionality</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold mt-0.5">✓</span>
                  <span>Enhance security by monitoring login locations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold mt-0.5">✓</span>
                  <span>Troubleshoot network connectivity issues</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold mt-0.5">✓</span>
                  <span>Understand geographic content restrictions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold mt-0.5">✓</span>
                  <span>Free, instant, and requires no registration</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Best Practices Section */}
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 md:p-10 shadow-lg">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Best Practices for IP Location Checking</h2>
            <p className="text-base text-slate-700 leading-relaxed mb-6">
              Understanding when and how to use IP location tools effectively helps you get the most value while maintaining privacy and security.
            </p>

            <div className="space-y-6">
              <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-3">When to Check Your IP Address</h3>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold mt-0.5">•</span>
                    <span><strong>After connecting to a VPN:</strong> Verify that your IP address has changed and your location is properly masked</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold mt-0.5">•</span>
                    <span><strong>When troubleshooting network issues:</strong> Confirm your device has a valid public IP address</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold mt-0.5">•</span>
                    <span><strong>After receiving security alerts:</strong> Check if login locations match your actual location</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold mt-0.5">•</span>
                    <span><strong>When accessing geo-restricted content:</strong> Verify your IP location matches the required region</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold mt-0.5">•</span>
                    <span><strong>For website development:</strong> Test how your site displays location-based content</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-3">Understanding IP Geolocation Accuracy</h3>
                <p className="text-sm text-slate-700 leading-relaxed mb-3">
                  IP geolocation accuracy varies based on several factors:
                </p>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold mt-0.5">•</span>
                    <span><strong>ISP Infrastructure:</strong> Location is based on your ISP's network infrastructure, not your exact physical location</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold mt-0.5">•</span>
                    <span><strong>Mobile Networks:</strong> Mobile IPs may show the location of the cell tower, which can be miles away</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold mt-0.5">•</span>
                    <span><strong>VPN/Proxy Usage:</strong> If using a VPN, the location will reflect the VPN server's location, not yours</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold mt-0.5">•</span>
                    <span><strong>Regional Variations:</strong> Accuracy is typically better in urban areas with more ISP infrastructure</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-3">Privacy Considerations</h3>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold mt-0.5">•</span>
                    <span><strong>Use reputable services:</strong> Choose IP lookup tools that don't store or log your IP address or lookup history</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold mt-0.5">•</span>
                    <span><strong>Understand data sharing:</strong> Some services may share IP data with third parties - check privacy policies</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold mt-0.5">•</span>
                    <span><strong>Use VPN when needed:</strong> If privacy is a concern, use a VPN to mask your real IP address</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold mt-0.5">•</span>
                    <span><strong>Limit lookups:</strong> Avoid excessive IP lookups that might be tracked or logged</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-3">Security Best Practices</h3>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold mt-0.5">•</span>
                    <span><strong>Monitor login locations:</strong> Regularly check your IP to detect unauthorized access from unexpected locations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold mt-0.5">•</span>
                    <span><strong>Verify VPN functionality:</strong> Always verify your VPN is working by checking your IP after connecting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold mt-0.5">•</span>
                    <span><strong>Check for IP blocking:</strong> If you can't access a service, check if your IP is blocked or blacklisted</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold mt-0.5">•</span>
                    <span><strong>Use HTTPS:</strong> Always use secure connections when checking IP information to protect your data</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 md:p-10 shadow-lg">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {faqSchema.mainEntity.map((faq, idx) => (
                <div key={idx} className="border-b border-slate-200 pb-6 last:border-b-0 last:pb-0">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{faq.name}</h3>
                  <p className="text-base text-slate-600 leading-relaxed">{faq.acceptedAnswer.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Related Tools */}
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Related SEO Tools</h2>
            <p className="text-slate-600">Explore other SEO tools to optimize your website.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/seo-tools/meta-tags" className="group rounded-2xl border-2 border-amber-300 bg-white p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-600 via-yellow-600 to-amber-600 shadow-lg">
                  <span className="text-2xl">🏷️</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Meta Tag Generator</h3>
                  <p className="text-sm text-slate-600">Generate SEO meta tags</p>
                </div>
              </div>
            </Link>
            <Link href="/seo-tools/site-map-generator" className="group rounded-2xl border-2 border-amber-300 bg-white p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-600 via-yellow-600 to-amber-600 shadow-lg">
                  <span className="text-2xl">🗺️</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Sitemap Generator</h3>
                  <p className="text-sm text-slate-600">Generate XML sitemaps</p>
                </div>
              </div>
            </Link>
            <Link href="/seo-tools/robots-txt" className="group rounded-2xl border-2 border-amber-300 bg-white p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-600 via-yellow-600 to-amber-600 shadow-lg">
                  <span className="text-2xl">🤖</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Robots.txt Generator</h3>
                  <p className="text-sm text-slate-600">Create robots.txt files</p>
                </div>
              </div>
            </Link>
          </div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/tools/utilities" className="group rounded-2xl border-2 border-slate-200 bg-white p-6 hover:border-amber-300 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                  <span className="text-2xl">🔧</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Utility Tools</h3>
                  <p className="text-sm text-slate-600">QR codes, barcodes, password generator, and more</p>
                </div>
              </div>
            </Link>
            <Link href="/tools/text-tools" className="group rounded-2xl border-2 border-slate-200 bg-white p-6 hover:border-amber-300 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg">
                  <span className="text-2xl">📝</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Text Tools</h3>
                  <p className="text-sm text-slate-600">Word counter, case converter, and text processing tools</p>
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-200 bg-white mt-12">
          <div className="mx-auto max-w-6xl px-4 py-8">
            <div className="text-center text-sm text-slate-600">
              <p>© {currentYear} FixTools. All rights reserved. | <Link href="/privacy" className="hover:text-slate-900">Privacy</Link> | <Link href="/terms" className="hover:text-slate-900">Terms</Link></p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
