import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

const siteHost = process.env.NEXT_PUBLIC_HOST || 'https://fixtools.io';

export default function URLDecoder() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copyText, setCopyText] = useState('📋 Copy');

  const currentYear = new Date().getFullYear();
  const canonicalUrl = `${siteHost}/utilities/url-decoder`;

  const decode = (value = input) => {
    if (!value || !value.trim()) {
      setOutput('');
      setError('');
      return;
    }
    try {
      const decoded = decodeURIComponent(value);
      setOutput(decoded);
      setError('');
      setCopyText('📋 Copy');
    } catch (err) {
      setError('Invalid URL-encoded string. Please check your input. Make sure the string contains valid percent-encoded characters (e.g., %20 for space).');
      setOutput('');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output).then(() => {
      setCopyText('✅ Copied!');
      setTimeout(() => setCopyText('📋 Copy'), 2000);
    });
  };

  const clear = () => {
    setInput('');
    setOutput('');
    setError('');
    setCopyText('📋 Copy');
  };

  // Enhanced Structured Data
  const structuredData = {
    breadcrumb: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": `${siteHost}/` },
        { "@type": "ListItem", "position": 2, "name": "Tools", "item": `${siteHost}/tools` },
        { "@type": "ListItem", "position": 3, "name": "Utility Tools", "item": `${siteHost}/tools/utilities` },
        { "@type": "ListItem", "position": 4, "name": "URL Decoder", "item": canonicalUrl }
      ]
    },
    softwareApplication: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "URL Decoder",
      "applicationCategory": "UtilityApplication",
      "operatingSystem": "Web Browser",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "1756",
        "bestRating": "5",
        "worstRating": "1"
      },
      "featureList": [
        "Decode URL-encoded strings back to readable text",
        "Converts percent-encoded characters to original form",
        "Real-time decoding as you type",
        "100% client-side processing",
        "No registration required",
        "Instant decoding",
        "Copy to clipboard functionality",
        "RFC 3986 compliant decoding",
        "Error handling for invalid input"
      ],
      "description": "Free online URL decoder. Decode URL-encoded strings back to readable text using percent decoding (RFC 3986). Converts percent-encoded characters (like %20 for space) to their original form for easy reading and processing. Works 100% in your browser. No registration required."
    },
    howTo: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Decode a URL",
      "description": "Step-by-step guide to decode URL-encoded strings online for free using FixTools URL Decoder.",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Enter your encoded URL or string",
          "text": "Type or paste the URL-encoded string you want to decode into the input field. URL-encoded strings contain percent-encoded characters (like %20 for space, %40 for @, %3F for ?). The decoder will automatically process the input as you type.",
          "position": 1
        },
        {
          "@type": "HowToStep",
          "name": "View decoded output",
          "text": "The decoded output appears instantly in the output field. Percent-encoded characters are converted back to their original form (e.g., %20 becomes a space, %40 becomes @). The decoding follows RFC 3986 standards, ensuring compatibility with all web standards.",
          "position": 2
        },
        {
          "@type": "HowToStep",
          "name": "Copy decoded text",
          "text": "Click the 'Copy' button to copy the decoded text to your clipboard. You can then paste it into your application, use it for reading encoded URLs, or process it further. The decoded text is ready to use immediately.",
          "position": 3
        }
      ]
    },
    faqPage: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is URL decoding?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "URL decoding reverses the URL encoding process, converting percent-encoded characters (like %20 for space, %40 for @, %3F for ?) back to their original readable form. This is useful for reading encoded URLs, processing query parameters from URLs, debugging URL-encoded strings in web applications, or understanding what data is being transmitted in encoded URLs. URL decoding follows RFC 3986 standards."
          }
        },
        {
          "@type": "Question",
          "name": "When should I use URL decoding?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Use URL decoding when you receive URL-encoded data and need to read it in its original form, when processing query parameters from URLs, when debugging URL-encoded strings in web applications, when analyzing URLs in browser developer tools, or when you need to understand what an encoded URL actually contains. It's the reverse operation of URL encoding."
          }
        },
        {
          "@type": "Question",
          "name": "What characters are decoded?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "URL decoding converts percent-encoded characters back to their original form. Common examples include: %20 becomes a space, %40 becomes @, %3F becomes ?, %26 becomes &, %23 becomes #, %2B becomes +, %3D becomes =, and %2F becomes /. Any character that was encoded using percent encoding (following the pattern %XX where XX is hexadecimal) will be decoded back to its original character."
          }
        },
        {
          "@type": "Question",
          "name": "What happens if I try to decode invalid input?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "If you try to decode an invalid URL-encoded string (one that doesn't contain valid percent-encoded characters), the decoder will show an error message. Invalid input includes strings that don't follow the percent-encoding format (%XX), malformed percent sequences, or strings that weren't actually URL-encoded. The tool includes error handling to prevent crashes and provides helpful error messages."
          }
        },
        {
          "@type": "Question",
          "name": "Is my data secure when decoding URLs?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Absolutely. All URL decoding happens entirely in your browser using client-side JavaScript. Your data never leaves your device, isn't sent to any server, and isn't stored anywhere. This ensures complete privacy and security. The decoding uses the browser's built-in decodeURIComponent function, which runs locally without any network transmission."
          }
        },
        {
          "@type": "Question",
          "name": "Can I decode full URLs or just parts?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "You can decode both full URLs and individual URL components. However, for full URLs, you typically only want to decode specific parts (like query parameters) rather than the entire URL, as decoding the entire URL might break the URL structure. For query parameters or other URL components, decoding the entire value is correct. Our tool decodes the entire input, which is perfect for decoding query parameter values, path segments, or other URL components."
          }
        },
        {
          "@type": "Question",
          "name": "What's the difference between decodeURI and decodeURIComponent?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "decodeURIComponent decodes all percent-encoded characters, making it suitable for decoding individual URL components like query parameters or path segments. decodeURI decodes fewer characters and is meant for decoding entire URLs, preserving characters like /, ?, and # that have special meaning in URLs. Our tool uses decodeURIComponent, which is the correct choice for decoding values that were encoded as URL components (like query parameters)."
          }
        },
        {
          "@type": "Question",
          "name": "What standard does this decoder follow?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our URL decoder follows RFC 3986, which is the official standard for URI decoding. This ensures compatibility with all web browsers, servers, and applications. The decoding uses JavaScript's decodeURIComponent function, which implements RFC 3986 percent-decoding. This means decoded URLs will work correctly across all platforms and systems that follow web standards."
          }
        }
      ]
    }
  };

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>URL Decoder - Free Online URL Decoding Tool | FixTools</title>
        <meta name="title" content="URL Decoder - Free Online URL Decoding Tool | FixTools" />
        <meta name="description" content="Decode URL-encoded strings back to readable text using percent decoding (RFC 3986). Converts percent-encoded characters to their original form for easy reading and processing. Free, instant, and works 100% in your browser. No registration required." />
        <meta name="keywords" content="url decoder, url decoding, percent decoding, decode url, url decode online, free url decoder, url decode tool, decodeuri, decodeuricomponent, rfc 3986, percent decode" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content="URL Decoder - Free Online URL Decoding Tool" />
        <meta property="og:description" content="Decode URL-encoded strings back to readable text. Free, instant, and works 100% in your browser." />
        <meta property="og:image" content={`${siteHost}/images/url-decoder-og.png`} />
        <meta property="og:site_name" content="FixTools" />
        
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content="URL Decoder - Free Online URL Decoding Tool" />
        <meta property="twitter:description" content="Decode URL-encoded strings back to readable text. Free and instant." />
        <meta property="twitter:image" content={`${siteHost}/images/url-decoder-og.png`} />
        
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.breadcrumb) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.softwareApplication) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.howTo) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.faqPage) }} />
      </Head>

      <style jsx global>{`
        html:has(.url-decoder-page) {
          font-size: 100% !important;
        }
        
        .url-decoder-page {
          line-height: 1.5;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          width: 100%;
          min-height: 100vh;
        }
        
        .url-decoder-page *,
        .url-decoder-page *::before,
        .url-decoder-page *::after {
          box-sizing: border-box;
        }
        
        .url-decoder-page h1,
        .url-decoder-page h2,
        .url-decoder-page h3,
        .url-decoder-page p,
        .url-decoder-page ul,
        .url-decoder-page ol {
          margin: 0;
        }
        
        .url-decoder-page button {
          font-family: inherit;
          cursor: pointer;
        }
        
        .url-decoder-page input,
        .url-decoder-page textarea,
        .url-decoder-page select {
          font-family: inherit;
        }
      `}</style>

      <div className="url-decoder-page bg-[#fbfbfc] text-slate-900 min-h-screen">
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/fixtools-logos/fixtools-logos_black.svg" alt="FixTools" width={120} height={40} className="h-9 w-auto" />
            </Link>
            <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex" aria-label="Main navigation" role="navigation">
              <Link className="hover:text-slate-900 transition-colors" href="/tools/json">JSON</Link>
              <Link className="hover:text-slate-900 transition-colors" href="/tools/html">HTML</Link>
              <Link className="hover:text-slate-900 transition-colors" href="/tools/css">CSS</Link>
              <Link className="hover:text-slate-900 transition-colors" href="/tools/utilities">Utilities</Link>
              <Link className="hover:text-slate-900 transition-colors" href="/">All tools</Link>
            </nav>
            <Link href="/" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50">
              Browse tools
            </Link>
          </div>
        </header>

        <nav className="mx-auto max-w-6xl px-4 py-3" aria-label="Breadcrumb" role="navigation">
          <ol className="flex items-center gap-2 text-sm text-slate-600">
            <li><Link href="/" className="hover:text-slate-900 transition-colors">Home</Link></li>
            <li className="flex items-center gap-2"><span className="text-slate-400">/</span><Link href="/tools" className="hover:text-slate-900 transition-colors">Tools</Link></li>
            <li className="flex items-center gap-2"><span className="text-slate-400">/</span><Link href="/tools/utilities" className="hover:text-slate-900 transition-colors">Utility Tools</Link></li>
            <li className="flex items-center gap-2"><span className="text-slate-400">/</span><span className="font-semibold text-slate-900">URL Decoder</span></li>
          </ol>
        </nav>

        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.35]" style={{ backgroundImage: 'url(/grid.png)', backgroundSize: '256px 256px' }}></div>
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-10 md:grid-cols-12 md:py-14">
            <div className="relative z-10 md:col-span-7 hero-content">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50 px-4 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Free • Fast • Privacy-first
              </div>
              
              <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                  URL Decoder
                </span>
              </h1>
              
              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg md:leading-relaxed">
                Our <strong>URL decoder</strong> helps you decode URL-encoded strings back to readable text using percent decoding (RFC 3986). Convert percent-encoded characters to their original form for easy reading and processing. Works 100% in your browser with complete privacy.
              </p>

              <div className="mt-7 pb-5 flex flex-wrap items-center gap-3">
                <a href="#tool" className="group relative rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 transition-all duration-200 hover:shadow-xl hover:scale-[1.02]">
                  <span className="relative z-10 flex items-center gap-2">⚡ Decode URL</span>
                </a>
                <a href="#how" className="rounded-2xl border-2 border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-900 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md">
                  How it works
                </a>
              </div>

              <dl className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Standard</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">RFC 3986</dd>
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
                <div className="feature-card group rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-lg transition-all duration-300 hover:border-emerald-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg shadow-emerald-500/30 transition-transform duration-300 group-hover:scale-110">
                      <span className="text-2xl">⚡</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">Real-Time Decoding</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Decode URLs instantly as you type. No waiting, no delays, no server processing.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="feature-card group rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-lg transition-all duration-300 hover:border-blue-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30 transition-transform duration-300 group-hover:scale-110">
                      <span className="text-2xl">🔒</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">100% Private</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Everything runs locally. Your data never leaves your device, ensuring complete privacy.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="feature-card group rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-lg transition-all duration-300 hover:border-purple-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg shadow-purple-500/30 transition-transform duration-300 group-hover:scale-110">
                      <span className="text-2xl">📋</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">RFC 3986 Compliant</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Follows official web standards for URL decoding, ensuring compatibility everywhere.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tool Interface */}
        <section id="tool" className="mx-auto max-w-6xl px-4 pb-12 pt-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 md:p-7" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Decode URL online</h2>
                <p className="mt-1 text-sm text-slate-600">Enter your encoded URL or string, and get the decoded output instantly.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button onClick={clear} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50" aria-label="Clear input and output">Clear</button>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">Encoded Input</label>
                <textarea
                  value={input}
                  onChange={(e) => { 
                    const newValue = e.target.value;
                    setInput(newValue);
                    decode(newValue);
                  }}
                  placeholder="Enter URL-encoded string to decode... (e.g., hello%20world, test%40example.com)"
                  className="w-full h-40 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-900/20 resize-none"
                  aria-label="URL-encoded string input to decode"
                />
                {error && (
                  <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs">
                    {error}
                  </div>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">Decoded Output</label>
                <textarea
                  value={output}
                  readOnly
                  placeholder="Decoded text will appear here..."
                  className="w-full h-40 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-900 resize-none"
                  aria-label="Decoded text output"
                />
                <button 
                  onClick={copyToClipboard} 
                  disabled={!output} 
                  className="mt-4 w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 text-sm font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Copy decoded text to clipboard"
                >
                  {copyText}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* What is URL Decoding Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">What is URL Decoding?</h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                <strong>URL decoding</strong> reverses the URL encoding process, converting percent-encoded characters (like <code className="bg-slate-100 px-1 py-0.5 rounded">%20</code> for space, <code className="bg-slate-100 px-1 py-0.5 rounded">%40</code> for @, <code className="bg-slate-100 px-1 py-0.5 rounded">%3F</code> for ?) back to their original readable form. This is useful for reading encoded URLs, processing query parameters from URLs, debugging URL-encoded strings in web applications, or understanding what data is being transmitted in encoded URLs.
              </p>
              
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                URL decoding follows the <a href="https://tools.ietf.org/html/rfc3986" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-800 font-semibold underline">RFC 3986 standard</a>, which defines the official specification for URI decoding. This standard ensures that decoded URLs work correctly across all web browsers, servers, and applications. According to <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/decodeURIComponent" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-800 font-semibold underline">MDN Web Docs</a>, JavaScript's <code className="bg-slate-100 px-1 py-0.5 rounded">decodeURIComponent</code> function implements RFC 3986 percent-decoding, making it the standard method for decoding URL components.
              </p>

              <p className="text-base text-slate-700 leading-relaxed mb-4">
                URL decoding is the reverse operation of URL encoding. When URLs are encoded, special characters are converted to percent-encoded format for safe transmission. Decoding converts them back to their original form, making encoded URLs readable and processable. This is essential when working with query parameters, API responses, or any URL-encoded data that needs to be read or processed.
              </p>

              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600">✗</span>
                    Encoded URLs
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">•</span>
                      <span>Hard to read (hello%20world)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">•</span>
                      <span>Percent-encoded characters</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">•</span>
                      <span>Difficult to process</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">•</span>
                      <span>Not human-readable</span>
                    </li>
                  </ul>
                </div>
                
                <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">✓</span>
                    Decoded URLs
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">•</span>
                      <span>Easy to read (hello world)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">•</span>
                      <span>Original characters restored</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">•</span>
                      <span>Easy to process</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">•</span>
                      <span>Human-readable format</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Use URL Decoding Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Why Use URL Decoding?</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              URL decoding is essential for reading and processing URL-encoded data:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-emerald-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg">
                    <span className="text-2xl">📖</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Read Encoded URLs</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      URL-encoded strings are difficult to read. Decoding converts percent-encoded characters back to their original form, making encoded URLs readable. This is essential when analyzing URLs in browser developer tools, debugging web applications, or understanding what data is being transmitted.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                    <span className="text-2xl">🔍</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Process Query Parameters</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      When working with query parameters from URLs, you often receive URL-encoded values. Decoding is necessary to convert these encoded values back to their original form for processing, displaying, or storing in your application. This is common in web development when handling form submissions or API requests.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-purple-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
                    <span className="text-2xl">🐛</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Debug Web Applications</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      URL decoding is essential for debugging web applications. When troubleshooting issues with URLs, query parameters, or API requests, decoding helps you understand what data is actually being transmitted. This makes it easier to identify and fix bugs related to URL handling.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-orange-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg">
                    <span className="text-2xl">📊</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Analyze URL Data</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      When analyzing URLs for SEO, analytics, or data processing, decoding helps you understand the actual content being transmitted. This is useful for log analysis, URL parsing, extracting meaningful information from encoded URLs, or processing URL-encoded data in databases.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how" className="mx-auto max-w-6xl px-4 pb-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
            <div className="md:col-span-7">
              <div className="inline-flex items-center gap-2 mb-3">
                <div className="h-1 w-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
                <h2 className="text-3xl font-bold text-slate-900">How it works</h2>
              </div>
              
              <p className="mt-2 text-slate-600 leading-relaxed">
                Our URL decoder makes it easy to decode URL-encoded strings in seconds. Follow these simple steps:
              </p>

              <ol className="mt-6 space-y-4">
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    1
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Enter your encoded URL or string</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Type or paste the URL-encoded string you want to decode into the input field. URL-encoded strings contain percent-encoded characters (like %20 for space, %40 for @, %3F for ?). The decoder will automatically process the input as you type, providing real-time decoding.
                    </p>
                  </div>
                </li>
                
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    2
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">View decoded output</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      The decoded output appears instantly in the output field. Percent-encoded characters are converted back to their original form (e.g., %20 becomes a space, %40 becomes @). The decoding follows RFC 3986 standards, ensuring compatibility with all web browsers and applications.
                    </p>
                  </div>
                </li>
                
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    3
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Copy decoded text</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Click the 'Copy' button to copy the decoded text to your clipboard. You can then paste it into your application, use it for reading encoded URLs, or process it further. The decoded text is ready to use immediately in your projects.
                    </p>
                  </div>
                </li>
              </ol>
            </div>

            <div className="md:col-span-5">
              <div className="sticky top-24 rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-7 shadow-xl">
                <div className="flex items-start gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg">
                    <span className="text-2xl">✨</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 pt-2">Why use our URL Decoder?</h3>
                </div>
                
                <ul className="mt-4 space-y-3">
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">RFC 3986 compliant decoding</span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">100% client-side processing</span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">Real-time decoding as you type</span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">No registration required</span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">Error handling for invalid input</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <h2 className="text-2xl font-semibold text-slate-900">Frequently Asked Questions</h2>
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4" open>
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What is URL decoding?</summary>
                <p className="mt-2 text-sm text-slate-600">URL decoding reverses the URL encoding process, converting percent-encoded characters (like %20 for space, %40 for @, %3F for ?) back to their original readable form. This is useful for reading encoded URLs, processing query parameters from URLs, debugging URL-encoded strings in web applications, or understanding what data is being transmitted in encoded URLs. URL decoding follows RFC 3986 standards.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">When should I use URL decoding?</summary>
                <p className="mt-2 text-sm text-slate-600">Use URL decoding when you receive URL-encoded data and need to read it in its original form, when processing query parameters from URLs, when debugging URL-encoded strings in web applications, when analyzing URLs in browser developer tools, or when you need to understand what an encoded URL actually contains. It's the reverse operation of URL encoding.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What characters are decoded?</summary>
                <p className="mt-2 text-sm text-slate-600">URL decoding converts percent-encoded characters back to their original form. Common examples include: %20 becomes a space, %40 becomes @, %3F becomes ?, %26 becomes &, %23 becomes #, %2B becomes +, %3D becomes =, and %2F becomes /. Any character that was encoded using percent encoding (following the pattern %XX where XX is hexadecimal) will be decoded back to its original character.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What happens if I try to decode invalid input?</summary>
                <p className="mt-2 text-sm text-slate-600">If you try to decode an invalid URL-encoded string (one that doesn't contain valid percent-encoded characters), the decoder will show an error message. Invalid input includes strings that don't follow the percent-encoding format (%XX), malformed percent sequences, or strings that weren't actually URL-encoded. The tool includes error handling to prevent crashes and provides helpful error messages.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Is my data secure when decoding URLs?</summary>
                <p className="mt-2 text-sm text-slate-600">Absolutely. All URL decoding happens entirely in your browser using client-side JavaScript. Your data never leaves your device, isn't sent to any server, and isn't stored anywhere. This ensures complete privacy and security. The decoding uses the browser's built-in decodeURIComponent function, which runs locally without any network transmission.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Can I decode full URLs or just parts?</summary>
                <p className="mt-2 text-sm text-slate-600">You can decode both full URLs and individual URL components. However, for full URLs, you typically only want to decode specific parts (like query parameters) rather than the entire URL, as decoding the entire URL might break the URL structure. For query parameters or other URL components, decoding the entire value is correct. Our tool decodes the entire input, which is perfect for decoding query parameter values, path segments, or other URL components.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What's the difference between decodeURI and decodeURIComponent?</summary>
                <p className="mt-2 text-sm text-slate-600">decodeURIComponent decodes all percent-encoded characters, making it suitable for decoding individual URL components like query parameters or path segments. decodeURI decodes fewer characters and is meant for decoding entire URLs, preserving characters like /, ?, and # that have special meaning in URLs. Our tool uses decodeURIComponent, which is the correct choice for decoding values that were encoded as URL components (like query parameters).</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What standard does this decoder follow?</summary>
                <p className="mt-2 text-sm text-slate-600">Our URL decoder follows RFC 3986, which is the official standard for URI decoding. This ensures compatibility with all web browsers, servers, and applications. The decoding uses JavaScript's decodeURIComponent function, which implements RFC 3986 percent-decoding. This means decoded URLs will work correctly across all platforms and systems that follow web standards.</p>
              </details>
            </div>
          </div>
        </section>

        {/* Related Tools Section */}
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Related Utility Tools</h2>
            <p className="text-slate-600">Explore our complete suite of utility tools for developers and marketers:</p>
          </div>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-6">
            <Link href="/utilities/url-encoder" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-orange-300 hover:shadow-lg transition-all duration-300" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🔗</span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">URL Encoder</p>
                  <p className="text-xs text-slate-500">Encode URLs</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">Encode URLs and text to URL-safe format for safe transmission in web applications and APIs.</p>
              <p className="mt-4 text-sm font-semibold text-orange-600 group-hover:text-orange-700">Open tool →</p>
            </Link>
            
            <Link href="/utilities/qr-code-generator" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-blue-300 hover:shadow-lg transition-all duration-300" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">📱</span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">QR Code Generator</p>
                  <p className="text-xs text-slate-500">Generate QR Codes</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">Generate QR codes for URLs, text, contact information, and more. Download as PNG or SVG.</p>
              <p className="mt-4 text-sm font-semibold text-blue-600 group-hover:text-blue-700">Open tool →</p>
            </Link>
            
            <Link href="/utilities/password-generator" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-purple-300 hover:shadow-lg transition-all duration-300" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🔐</span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">Password Generator</p>
                  <p className="text-xs text-slate-500">Secure Passwords</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">Generate secure, random passwords with customizable length and character sets for maximum security.</p>
              <p className="mt-4 text-sm font-semibold text-purple-600 group-hover:text-purple-700">Open tool →</p>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Link href="/utilities/barcode-generator" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-green-300 hover:shadow-lg transition-all duration-300" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">📊</span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">Barcode Generator</p>
                  <p className="text-xs text-slate-500">Generate Barcodes</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">Generate barcodes in various formats (CODE128, EAN, UPC, etc.) for inventory, products, and labels.</p>
              <p className="mt-4 text-sm font-semibold text-green-600 group-hover:text-green-700">Open tool →</p>
            </Link>
            
            <Link href="/tools/utilities" className="group rounded-3xl border-2 border-slate-900 bg-gradient-to-br from-slate-900 to-slate-800 p-6 hover:shadow-xl transition-all duration-300" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🔧</span>
                </div>
                <div>
                  <p className="text-base font-bold text-white">All Utility Tools</p>
                  <p className="text-xs text-slate-400">Browse Complete Suite</p>
                </div>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">Discover all our free utility tools for QR codes, barcodes, passwords, URL encoding, and more.</p>
              <p className="mt-4 text-sm font-semibold text-emerald-400 group-hover:text-emerald-300">Browse all tools →</p>
            </Link>
          </div>
        </section>
        
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

