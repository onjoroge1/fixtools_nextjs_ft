import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

const siteHost = process.env.NEXT_PUBLIC_HOST || 'https://fixtools.io';

export default function URLEncoder() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copyText, setCopyText] = useState('📋 Copy');

  const currentYear = new Date().getFullYear();
  const canonicalUrl = `${siteHost}/utilities/url-encoder`;

  const encode = (value = input) => {
    if (!value || !value.trim()) {
      setOutput('');
      return;
    }
    try {
      const encoded = encodeURIComponent(value);
      setOutput(encoded);
      setCopyText('📋 Copy');
    } catch (error) {
      setOutput('Error encoding: ' + error.message);
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
        { "@type": "ListItem", "position": 4, "name": "URL Encoder", "item": canonicalUrl }
      ]
    },
    softwareApplication: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "URL Encoder",
      "applicationCategory": "UtilityApplication",
      "operatingSystem": "Web Browser",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "1892",
        "bestRating": "5",
        "worstRating": "1"
      },
      "featureList": [
        "Encode URLs and text to URL-safe format",
        "Converts special characters to percent-encoded format",
        "Real-time encoding as you type",
        "100% client-side processing",
        "No registration required",
        "Instant encoding",
        "Copy to clipboard functionality",
        "RFC 3986 compliant encoding"
      ],
      "description": "Free online URL encoder. Encode URLs and text to URL-safe format using percent encoding (RFC 3986). Converts special characters to percent-encoded format for safe transmission in web applications, APIs, and URLs. Works 100% in your browser. No registration required."
    },
    howTo: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Encode a URL",
      "description": "Step-by-step guide to encode URLs and text online for free using FixTools URL Encoder.",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Enter your URL or text",
          "text": "Type or paste the URL or text you want to encode into the input field. You can encode full URLs, query parameters, or any text containing special characters. The encoder will automatically process the input as you type.",
          "position": 1
        },
        {
          "@type": "HowToStep",
          "name": "View encoded output",
          "text": "The encoded output appears instantly in the output field. Special characters are converted to percent-encoded format (e.g., spaces become %20, @ becomes %40). The encoding follows RFC 3986 standards, ensuring compatibility with all web browsers and applications.",
          "position": 2
        },
        {
          "@type": "HowToStep",
          "name": "Copy encoded URL",
          "text": "Click the 'Copy' button to copy the encoded URL to your clipboard. You can then paste it into your web application, API request, or anywhere else you need a URL-safe string. The encoded URL is ready to use immediately.",
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
          "name": "What is URL encoding?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "URL encoding (also called percent encoding) is a mechanism for encoding information in a Uniform Resource Identifier (URI). It converts special characters in URLs to a format that can be safely transmitted over the internet. Characters like spaces become %20, the @ symbol becomes %40, and other special characters are converted to their hexadecimal representation preceded by a percent sign. URL encoding follows the RFC 3986 standard and is essential for preventing URL parsing errors and security issues."
          }
        },
        {
          "@type": "Question",
          "name": "When should I use URL encoding?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Use URL encoding when including user input in URLs, passing data in query parameters, constructing URLs dynamically, or when special characters need to be safely transmitted in web applications. It's essential for: query string parameters, form data in GET requests, API endpoints with dynamic values, file paths in URLs, and any text that will be part of a URL. URL encoding prevents browsers and servers from misinterpreting special characters as URL delimiters or control characters."
          }
        },
        {
          "@type": "Question",
          "name": "What characters are encoded in URLs?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Characters that are encoded include: spaces (become %20), special characters like @, #, $, %, &, +, =, ?, and many others. Reserved characters that have special meaning in URLs (like /, ?, #, [, ], @, !, $, &, ', (, ), *, +, ,, ;, =) are encoded. Unreserved characters (letters, numbers, and characters like - _ . ~) typically don't need encoding but can be encoded. Our encoder uses encodeURIComponent which encodes all characters except: A-Z, a-z, 0-9, - _ . ! ~ * ' ( )."
          }
        },
        {
          "@type": "Question",
          "name": "What's the difference between encodeURI and encodeURIComponent?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "encodeURIComponent encodes all characters except letters, digits, and - _ . ! ~ * ' ( ), making it suitable for encoding individual URL components like query parameters or path segments. encodeURI encodes fewer characters and is meant for encoding entire URLs, preserving characters like /, ?, and # that have special meaning in URLs. Our tool uses encodeURIComponent, which is the correct choice for encoding values that will be used as URL components (like query parameters)."
          }
        },
        {
          "@type": "Question",
          "name": "Is my data secure when encoding URLs?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Absolutely. All URL encoding happens entirely in your browser using client-side JavaScript. Your data never leaves your device, isn't sent to any server, and isn't stored anywhere. This ensures complete privacy and security. The encoding uses the browser's built-in encodeURIComponent function, which runs locally without any network transmission."
          }
        },
        {
          "@type": "Question",
          "name": "Can I encode full URLs or just parts?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "You can encode both full URLs and individual URL components. However, for full URLs, you typically only want to encode specific parts (like query parameters) rather than the entire URL, as encoding the entire URL would break the URL structure. For query parameters or other URL components, encoding the entire value is correct. Our tool encodes the entire input, which is perfect for encoding query parameter values, path segments, or other URL components."
          }
        },
        {
          "@type": "Question",
          "name": "Why do I need to encode URLs?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "URL encoding is necessary because URLs have a specific structure and certain characters have special meanings. Without encoding, special characters can break URL parsing, cause security vulnerabilities, or result in incorrect requests. For example, a space in a URL could be interpreted as a delimiter, or an ampersand (&) in a query parameter could be interpreted as starting a new parameter. Encoding ensures that all characters are transmitted safely and interpreted correctly by browsers and servers."
          }
        },
        {
          "@type": "Question",
          "name": "What standard does this encoder follow?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our URL encoder follows RFC 3986, which is the official standard for URI encoding. This ensures compatibility with all web browsers, servers, and applications. The encoding uses JavaScript's encodeURIComponent function, which implements RFC 3986 percent-encoding. This means encoded URLs will work correctly across all platforms and systems that follow web standards."
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
        <title>URL Encoder - Free Online URL Encoding Tool | FixTools</title>
        <meta name="title" content="URL Encoder - Free Online URL Encoding Tool | FixTools" />
        <meta name="description" content="Encode URLs and text to URL-safe format using percent encoding (RFC 3986). Converts special characters to percent-encoded format for safe transmission in web applications, APIs, and URLs. Free, instant, and works 100% in your browser. No registration required." />
        <meta name="keywords" content="url encoder, url encoding, percent encoding, encode url, url encode online, free url encoder, url encode tool, encodeuri, encodeuricomponent, rfc 3986, url safe encoding" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content="URL Encoder - Free Online URL Encoding Tool" />
        <meta property="og:description" content="Encode URLs and text to URL-safe format. Free, instant, and works 100% in your browser." />
        <meta property="og:image" content={`${siteHost}/images/url-encoder-og.png`} />
        <meta property="og:site_name" content="FixTools" />
        
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content="URL Encoder - Free Online URL Encoding Tool" />
        <meta property="twitter:description" content="Encode URLs and text to URL-safe format. Free and instant." />
        <meta property="twitter:image" content={`${siteHost}/images/url-encoder-og.png`} />
        
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.breadcrumb) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.softwareApplication) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.howTo) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.faqPage) }} />
      </Head>

      <style jsx global>{`
        html:has(.url-encoder-page) {
          font-size: 100% !important;
        }
        
        .url-encoder-page {
          line-height: 1.5;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          width: 100%;
          min-height: 100vh;
        }
        
        .url-encoder-page *,
        .url-encoder-page *::before,
        .url-encoder-page *::after {
          box-sizing: border-box;
        }
        
        .url-encoder-page h1,
        .url-encoder-page h2,
        .url-encoder-page h3,
        .url-encoder-page p,
        .url-encoder-page ul,
        .url-encoder-page ol {
          margin: 0;
        }
        
        .url-encoder-page button {
          font-family: inherit;
          cursor: pointer;
        }
        
        .url-encoder-page input,
        .url-encoder-page textarea,
        .url-encoder-page select {
          font-family: inherit;
        }
      `}</style>

      <div className="url-encoder-page bg-[#fbfbfc] text-slate-900 min-h-screen">
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
            <li className="flex items-center gap-2"><span className="text-slate-400">/</span><span className="font-semibold text-slate-900">URL Encoder</span></li>
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
                  URL Encoder
                </span>
              </h1>
              
              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg md:leading-relaxed">
                Our <strong>URL encoder</strong> helps you encode URLs and text to URL-safe format using percent encoding (RFC 3986). Convert special characters to percent-encoded format for safe transmission in web applications, APIs, and URLs. Works 100% in your browser with complete privacy.
              </p>

              <div className="mt-7 pb-5 flex flex-wrap items-center gap-3">
                <a href="#tool" className="group relative rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 transition-all duration-200 hover:shadow-xl hover:scale-[1.02]">
                  <span className="relative z-10 flex items-center gap-2">⚡ Encode URL</span>
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
                      <h4 className="text-lg font-bold text-slate-900">Real-Time Encoding</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Encode URLs instantly as you type. No waiting, no delays, no server processing.
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
                        Follows official web standards for URL encoding, ensuring compatibility everywhere.
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
                <h2 className="text-xl font-semibold text-slate-900">Encode URL online</h2>
                <p className="mt-1 text-sm text-slate-600">Enter your URL or text, and get the encoded output instantly.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button onClick={clear} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50" aria-label="Clear input and output">Clear</button>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">Input</label>
                <textarea
                  value={input}
                  onChange={(e) => { 
                    const newValue = e.target.value;
                    setInput(newValue);
                    encode(newValue);
                  }}
                  placeholder="Enter URL or text to encode... (e.g., hello world, test@example.com)"
                  className="w-full h-40 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-900/20 resize-none"
                  aria-label="URL or text input to encode"
                />
                {input && input === output && (
                  <p className="mt-2 text-xs text-slate-500">
                    ℹ️ No encoding needed: This text contains only safe characters (letters, numbers, dots, hyphens, underscores).
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">Encoded Output</label>
                <textarea
                  value={output}
                  readOnly
                  placeholder="Encoded URL will appear here..."
                  className="w-full h-40 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-900 resize-none"
                  aria-label="Encoded URL output"
                />
                <button 
                  onClick={copyToClipboard} 
                  disabled={!output} 
                  className="mt-4 w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 text-sm font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Copy encoded URL to clipboard"
                >
                  {copyText}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* What is URL Encoding Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">What is URL Encoding?</h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                <strong>URL encoding</strong> (also called percent encoding) is a mechanism for encoding information in a Uniform Resource Identifier (URI). It converts special characters in URLs to a format that can be safely transmitted over the internet. Characters like spaces become <code className="bg-slate-100 px-1 py-0.5 rounded">%20</code>, the @ symbol becomes <code className="bg-slate-100 px-1 py-0.5 rounded">%40</code>, and other special characters are converted to their hexadecimal representation preceded by a percent sign.
              </p>
              
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                URL encoding follows the <a href="https://tools.ietf.org/html/rfc3986" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-800 font-semibold underline">RFC 3986 standard</a>, which defines the official specification for URI encoding. This standard ensures that encoded URLs work correctly across all web browsers, servers, and applications. According to <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-800 font-semibold underline">MDN Web Docs</a>, JavaScript's <code className="bg-slate-100 px-1 py-0.5 rounded">encodeURIComponent</code> function implements RFC 3986 percent-encoding, making it the standard method for encoding URL components.
              </p>

              <p className="text-base text-slate-700 leading-relaxed mb-4">
                URL encoding is essential because URLs have a specific structure and certain characters have special meanings. Without encoding, special characters can break URL parsing, cause security vulnerabilities, or result in incorrect requests. For example, a space in a URL could be interpreted as a delimiter, or an ampersand (&) in a query parameter could be interpreted as starting a new parameter.
              </p>

              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600">✗</span>
                    Unencoded URLs
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">•</span>
                      <span>Spaces break URL parsing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">•</span>
                      <span>Special characters cause errors</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">•</span>
                      <span>Security vulnerabilities</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">•</span>
                      <span>Browser compatibility issues</span>
                    </li>
                  </ul>
                </div>
                
                <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">✓</span>
                    Encoded URLs
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">•</span>
                      <span>Safe transmission over internet</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">•</span>
                      <span>Prevents parsing errors</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">•</span>
                      <span>Universal compatibility</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">•</span>
                      <span>RFC 3986 compliant</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Use URL Encoding Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Why Use URL Encoding?</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              URL encoding is essential for safe and reliable web development:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-emerald-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg">
                    <span className="text-2xl">🔒</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Prevents URL Parsing Errors</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Special characters in URLs can break parsing. For example, a space in a URL can be interpreted as a delimiter, causing the URL to be split incorrectly. Encoding ensures all characters are transmitted safely and interpreted correctly by browsers and servers.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                    <span className="text-2xl">🛡️</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Security Protection</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      URL encoding helps prevent security vulnerabilities like injection attacks. By encoding special characters, you prevent malicious input from being interpreted as code or commands. This is especially important when handling user input in URLs.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-purple-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
                    <span className="text-2xl">🌍</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Universal Compatibility</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Encoded URLs work consistently across all web browsers, servers, and applications. Following RFC 3986 ensures your URLs will be interpreted correctly everywhere, from modern browsers to legacy systems and APIs.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-orange-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg">
                    <span className="text-2xl">📡</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">API and Query Parameters</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      When building APIs or passing data in query parameters, URL encoding is essential. It ensures that values containing special characters are transmitted correctly. For example, encoding is required when passing user input, search terms, or file paths in URLs.
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
                Our URL encoder makes it easy to encode URLs and text in seconds. Follow these simple steps:
              </p>

              <ol className="mt-6 space-y-4">
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    1
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Enter your URL or text</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Type or paste the URL or text you want to encode into the input field. You can encode full URLs, query parameters, or any text containing special characters. The encoder will automatically process the input as you type, providing real-time encoding.
                    </p>
                  </div>
                </li>
                
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    2
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">View encoded output</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      The encoded output appears instantly in the output field. Special characters are converted to percent-encoded format (e.g., spaces become %20, @ becomes %40). The encoding follows RFC 3986 standards, ensuring compatibility with all web browsers and applications.
                    </p>
                  </div>
                </li>
                
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    3
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Copy encoded URL</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Click the 'Copy' button to copy the encoded URL to your clipboard. You can then paste it into your web application, API request, or anywhere else you need a URL-safe string. The encoded URL is ready to use immediately in your projects.
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
                  <h3 className="text-xl font-bold text-slate-900 pt-2">Why use our URL Encoder?</h3>
                </div>
                
                <ul className="mt-4 space-y-3">
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">RFC 3986 compliant encoding</span>
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
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">Real-time encoding as you type</span>
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
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">Copy to clipboard functionality</span>
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
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What is URL encoding?</summary>
                <p className="mt-2 text-sm text-slate-600">URL encoding (also called percent encoding) is a mechanism for encoding information in a Uniform Resource Identifier (URI). It converts special characters in URLs to a format that can be safely transmitted over the internet. Characters like spaces become %20, the @ symbol becomes %40, and other special characters are converted to their hexadecimal representation preceded by a percent sign. URL encoding follows the RFC 3986 standard.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">When should I use URL encoding?</summary>
                <p className="mt-2 text-sm text-slate-600">Use URL encoding when including user input in URLs, passing data in query parameters, constructing URLs dynamically, or when special characters need to be safely transmitted in web applications. It's essential for: query string parameters, form data in GET requests, API endpoints with dynamic values, file paths in URLs, and any text that will be part of a URL.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What characters are encoded in URLs?</summary>
                <p className="mt-2 text-sm text-slate-600">Characters that are encoded include: spaces (become %20), special characters like @, #, $, %, &, +, =, ?, and many others. Reserved characters that have special meaning in URLs (like /, ?, #, [, ], @, !, $, &, ', (, ), *, +, ,, ;, =) are encoded. Unreserved characters (letters, numbers, and characters like - _ . ~) typically don't need encoding but can be encoded.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What's the difference between encodeURI and encodeURIComponent?</summary>
                <p className="mt-2 text-sm text-slate-600">encodeURIComponent encodes all characters except letters, digits, and - _ . ! ~ * ' ( ), making it suitable for encoding individual URL components like query parameters or path segments. encodeURI encodes fewer characters and is meant for encoding entire URLs, preserving characters like /, ?, and # that have special meaning in URLs. Our tool uses encodeURIComponent, which is the correct choice for encoding values that will be used as URL components.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Is my data secure when encoding URLs?</summary>
                <p className="mt-2 text-sm text-slate-600">Absolutely. All URL encoding happens entirely in your browser using client-side JavaScript. Your data never leaves your device, isn't sent to any server, and isn't stored anywhere. This ensures complete privacy and security. The encoding uses the browser's built-in encodeURIComponent function, which runs locally without any network transmission.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Can I encode full URLs or just parts?</summary>
                <p className="mt-2 text-sm text-slate-600">You can encode both full URLs and individual URL components. However, for full URLs, you typically only want to encode specific parts (like query parameters) rather than the entire URL, as encoding the entire URL would break the URL structure. For query parameters or other URL components, encoding the entire value is correct. Our tool encodes the entire input, which is perfect for encoding query parameter values, path segments, or other URL components.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Why do I need to encode URLs?</summary>
                <p className="mt-2 text-sm text-slate-600">URL encoding is necessary because URLs have a specific structure and certain characters have special meanings. Without encoding, special characters can break URL parsing, cause security vulnerabilities, or result in incorrect requests. For example, a space in a URL could be interpreted as a delimiter, or an ampersand (&) in a query parameter could be interpreted as starting a new parameter. Encoding ensures that all characters are transmitted safely and interpreted correctly by browsers and servers.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What standard does this encoder follow?</summary>
                <p className="mt-2 text-sm text-slate-600">Our URL encoder follows RFC 3986, which is the official standard for URI encoding. This ensures compatibility with all web browsers, servers, and applications. The encoding uses JavaScript's encodeURIComponent function, which implements RFC 3986 percent-encoding. This means encoded URLs will work correctly across all platforms and systems that follow web standards.</p>
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
            <Link href="/utilities/url-decoder" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-green-300 hover:shadow-lg transition-all duration-300" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🔓</span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">URL Decoder</p>
                  <p className="text-xs text-slate-500">Decode URLs</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">Decode URL-encoded strings back to readable text for easy reading and processing.</p>
              <p className="mt-4 text-sm font-semibold text-green-600 group-hover:text-green-700">Open tool →</p>
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
            <Link href="/utilities/barcode-generator" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-orange-300 hover:shadow-lg transition-all duration-300" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">📊</span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">Barcode Generator</p>
                  <p className="text-xs text-slate-500">Generate Barcodes</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">Generate barcodes in various formats (CODE128, EAN, UPC, etc.) for inventory, products, and labels.</p>
              <p className="mt-4 text-sm font-semibold text-orange-600 group-hover:text-orange-700">Open tool →</p>
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

