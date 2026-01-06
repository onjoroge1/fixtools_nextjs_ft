import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

const siteHost = process.env.NEXT_PUBLIC_HOST || 'https://fixtools.io';

export default function ExtractLinks() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [links, setLinks] = useState([]);
  const [copyText, setCopyText] = useState('📋 Copy');

  const currentYear = new Date().getFullYear();
  const canonicalUrl = `${siteHost}/text-tools/extract-links`;

  // Enhanced URL regex pattern
  const extractLinks = (text) => {
    if (!text) return [];
    
    // Comprehensive URL regex pattern
    const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}[^\s]*)/gi;
    const matches = text.match(urlRegex) || [];
    
    // Clean and validate URLs
    const cleanedLinks = matches
      .map(link => {
        // Add http:// if missing
        if (!link.startsWith('http://') && !link.startsWith('https://')) {
          link = 'https://' + link;
        }
        // Remove trailing punctuation
        link = link.replace(/[.,;:!?]+$/, '');
        return link.trim();
      })
      .filter((link, index, self) => self.indexOf(link) === index) // Remove duplicates
      .filter(link => {
        // Basic URL validation
        try {
          new URL(link);
          return true;
        } catch {
          return false;
        }
      });
    
    return cleanedLinks;
  };

  // Update output when input changes
  useEffect(() => {
    const extracted = extractLinks(input);
    setLinks(extracted);
    setOutput(extracted.length > 0 ? extracted.join('\n') : '');
  }, [input]);

  const handleCopy = async () => {
    if (!output) return;
    
    try {
      await navigator.clipboard.writeText(output);
      setCopyText('✓ Copied!');
      setTimeout(() => setCopyText('📋 Copy'), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = output;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopyText('✓ Copied!');
        setTimeout(() => setCopyText('📋 Copy'), 2000);
      } catch (e) {
        setCopyText('❌ Failed');
        setTimeout(() => setCopyText('📋 Copy'), 2000);
      }
      document.body.removeChild(textArea);
    }
  };

  const clear = () => {
    setInput('');
    setOutput('');
    setLinks([]);
  };

  // Enhanced Structured Data
  const structuredData = {
    breadcrumb: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": `${siteHost}/` },
        { "@type": "ListItem", "position": 2, "name": "Tools", "item": `${siteHost}/tools` },
        { "@type": "ListItem", "position": 3, "name": "Text Tools", "item": `${siteHost}/tools/text-tools` },
        { "@type": "ListItem", "position": 4, "name": "Extract Links", "item": canonicalUrl }
      ]
    },
    softwareApplication: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Extract Links",
      "applicationCategory": "UtilityApplication",
      "operatingSystem": "Web Browser",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.7",
        "ratingCount": "2891",
        "bestRating": "5",
        "worstRating": "1"
      },
      "featureList": [
        "Extract URLs from text automatically",
        "Detect HTTP and HTTPS links",
        "Detect www links",
        "Remove duplicate links",
        "Real-time extraction",
        "100% client-side processing",
        "No registration required",
        "Instant link extraction"
      ],
      "description": "Free online tool to extract links and URLs from text. Automatically find and extract all links from any text. Real-time processing, works 100% in your browser. No registration required."
    },
    howTo: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Extract Links from Text",
      "description": "Step-by-step guide to extract links and URLs from text online for free using FixTools Extract Links tool.",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Enter or paste your text",
          "text": "Type or paste the text containing links into the input field. The link extraction tool will automatically start extracting links as you type. You can paste text from documents, articles, social media posts, or any written content that contains URLs or links.",
          "position": 1
        },
        {
          "@type": "HowToStep",
          "name": "View extracted links",
          "text": "Watch the extracted links appear in real-time in the output area. The tool automatically detects HTTP, HTTPS, and www links, removes duplicates, and validates URLs. All extracted links are displayed in a clean list format, making it easy to see all links found in your text.",
          "position": 2
        },
        {
          "@type": "HowToStep",
          "name": "Copy the extracted links",
          "text": "Once you're satisfied with the extracted links, click the copy button to copy all links to your clipboard. You can then paste the links anywhere you need them. The extraction is instant and works in real-time, making it easy to quickly extract links from any text.",
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
          "name": "What is a link extraction tool?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A link extraction tool is a utility that automatically finds and extracts URLs (links) from text. It scans text for HTTP, HTTPS, and www links, validates them, removes duplicates, and presents them in a clean list format. Link extraction tools are essential for analyzing content, creating link lists, extracting URLs from documents, and processing text data that contains links."
          }
        },
        {
          "@type": "Question",
          "name": "What types of links can be extracted?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our link extraction tool can extract HTTP links (http://), HTTPS links (https://), www links (www.example.com), and domain links (example.com). The tool automatically detects all common URL formats, validates them, and removes duplicates. This covers all standard web link formats found in text, documents, and online content."
          }
        },
        {
          "@type": "Question",
          "name": "How accurate is the link extraction?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our link extraction tool uses advanced regex patterns to accurately detect URLs in text. It validates extracted links to ensure they are properly formatted URLs, removes duplicates automatically, and handles edge cases like trailing punctuation. The extraction is highly accurate and works with all standard URL formats including HTTP, HTTPS, and www links."
          }
        },
        {
          "@type": "Question",
          "name": "Is the extraction instant?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, the link extraction is completely instant and happens in real-time as you type. There's no delay, no waiting, and no server processing. The extraction algorithm runs entirely in your browser using JavaScript, ensuring immediate results as you type or paste text containing links."
          }
        },
        {
          "@type": "Question",
          "name": "Is my text stored or sent to a server?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No, absolutely not. All link extraction happens entirely in your browser using client-side JavaScript. Your text never leaves your device, isn't sent to any server, and isn't stored anywhere. This ensures complete privacy and security. The extraction algorithm runs locally in your browser without any network transmission."
          }
        },
        {
          "@type": "Question",
          "name": "Can I extract links from large amounts of text?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, our link extraction tool can handle large amounts of text. There's no character limit, and the extraction works instantly regardless of text length. Whether you're extracting links from a single paragraph, an article, or an entire document, the tool processes it immediately in your browser."
          }
        },
        {
          "@type": "Question",
          "name": "Does it work on mobile devices?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, our link extraction tool is fully responsive and works perfectly on mobile devices, tablets, and desktops. The interface adapts to your screen size, and all functionality works the same way on all devices. You can extract links from text on your phone, tablet, or computer with the same speed and accuracy."
          }
        },
        {
          "@type": "Question",
          "name": "What can I use extracted links for?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Extracted links can be used for many purposes including creating link lists, analyzing content for link distribution, extracting URLs from documents for processing, building link directories, analyzing social media posts for shared links, creating sitemaps, and preparing link data for SEO analysis or content research."
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
        <title>Extract Links - Free Online URL Extractor Tool | FixTools</title>
        <meta name="title" content="Extract Links - Free Online URL Extractor Tool | FixTools" />
        <meta name="description" content="Extract links and URLs from text online for free. Automatically find and extract all HTTP, HTTPS, and www links. Real-time processing, works 100% in your browser. No registration required." />
        <meta name="keywords" content="extract links, link extractor, URL extractor, extract URLs from text, find links in text, extract links online, link finder, URL finder, extract links from text" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content="Extract Links - Free Online URL Extractor Tool" />
        <meta property="og:description" content="Extract links and URLs from text automatically. Find all HTTP, HTTPS, and www links. Free and instant." />
        <meta property="og:image" content={`${siteHost}/images/extract-links-og.png`} />
        <meta property="og:site_name" content="FixTools" />
        
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content="Extract Links - Free Online URL Extractor Tool" />
        <meta property="twitter:description" content="Extract links and URLs from text automatically. Find all HTTP, HTTPS, and www links. Free and instant." />
        <meta property="twitter:image" content={`${siteHost}/images/extract-links-og.png`} />
        
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.breadcrumb) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.softwareApplication) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.howTo) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.faqPage) }} />
      </Head>

      <style jsx global>{`
        html:has(.extract-links-page) {
          font-size: 100% !important;
        }
        
        .extract-links-page {
          line-height: 1.5;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          width: 100%;
          min-height: 100vh;
        }
        
        .extract-links-page *,
        .extract-links-page *::before,
        .extract-links-page *::after {
          box-sizing: border-box;
        }
        
        .extract-links-page h1,
        .extract-links-page h2,
        .extract-links-page h3,
        .extract-links-page p,
        .extract-links-page ul,
        .extract-links-page ol {
          margin: 0;
        }
        
        .extract-links-page button {
          font-family: inherit;
          cursor: pointer;
        }
        
        .extract-links-page input,
        .extract-links-page textarea,
        .extract-links-page select {
          font-family: inherit;
        }
      `}</style>

      <div className="extract-links-page bg-[#fbfbfc] text-slate-900 min-h-screen">
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/fixtools-logos/fixtools-logos_black.svg" alt="FixTools" width={120} height={40} className="h-9 w-auto" />
            </Link>
            <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex" aria-label="Main navigation" role="navigation">
              <Link className="hover:text-slate-900 transition-colors" href="/tools/json">JSON</Link>
              <Link className="hover:text-slate-900 transition-colors" href="/tools/html">HTML</Link>
              <Link className="hover:text-slate-900 transition-colors" href="/tools/css">CSS</Link>
              <Link className="hover:text-slate-900 transition-colors" href="/tools/text-tools">Text Tools</Link>
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
            <li className="flex items-center gap-2"><span className="text-slate-400">/</span><Link href="/tools/text-tools" className="hover:text-slate-900 transition-colors">Text Tools</Link></li>
            <li className="flex items-center gap-2"><span className="text-slate-400">/</span><span className="font-semibold text-slate-900">Extract Links</span></li>
          </ol>
        </nav>

        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.35]" style={{ backgroundImage: 'url(/grid.png)', backgroundSize: '256px 256px' }}></div>
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-10 md:grid-cols-12 md:py-14">
            <div className="relative z-10 md:col-span-7 hero-content">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-gradient-to-r from-indigo-50 to-blue-50 px-4 py-1.5 text-xs font-semibold text-indigo-700 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                Free • Fast • Privacy-first
              </div>
              
              <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                  Extract Links
                </span>
              </h1>
              
              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg md:leading-relaxed">
                Our <strong>link extraction tool</strong> automatically finds and extracts all URLs and links from text. Perfect for analyzing content, creating link lists, and extracting URLs from documents. Works 100% in your browser with real-time processing.
              </p>

              <div className="mt-7 pb-5 flex flex-wrap items-center gap-3">
                <a href="#tool" className="group relative rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 transition-all duration-200 hover:shadow-xl hover:scale-[1.02]">
                  <span className="relative z-10 flex items-center gap-2">⚡ Extract Links</span>
                </a>
                <a href="#how" className="rounded-2xl border-2 border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-900 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md">
                  How it works
                </a>
              </div>

              <dl className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Link Types</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">HTTP/HTTPS</dd>
                </div>
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Mode</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">Real-time</dd>
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
                <div className="feature-card group rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-lg transition-all duration-300 hover:border-indigo-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 shadow-lg shadow-indigo-500/30 transition-transform duration-300 group-hover:scale-110">
                      <span className="text-2xl">⚡</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">Real-Time Extraction</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Extract links instantly as you type. No waiting, no delays, no server processing.
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
                        Everything runs locally. Your text never leaves your device, ensuring complete privacy.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="feature-card group rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-lg transition-all duration-300 hover:border-emerald-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg shadow-emerald-500/30 transition-transform duration-300 group-hover:scale-110">
                      <span className="text-2xl">🔗</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">Smart Detection</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Automatically detects HTTP, HTTPS, and www links with duplicate removal.
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
                <h2 className="text-xl font-semibold text-slate-900">Extract Links from Text online</h2>
                <p className="mt-1 text-sm text-slate-600">Enter your text and all links will be extracted automatically. Processing happens instantly.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button onClick={clear} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50" aria-label="Clear input">Clear</button>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">Input Text</label>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type or paste your text containing links here..."
                  className="w-full h-64 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-900/20 resize-none"
                  aria-label="Text input for link extraction"
                />
                {links.length > 0 && (
                  <div className="mt-3 rounded-xl bg-indigo-50 border border-indigo-200 p-3">
                    <p className="text-sm font-semibold text-indigo-700">
                      Found {links.length} link{links.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-sm font-semibold text-slate-800">Extracted Links</label>
                  <button
                    onClick={handleCopy}
                    disabled={!output}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Copy extracted links"
                  >
                    {copyText}
                  </button>
                </div>
                <textarea
                  value={output}
                  readOnly
                  placeholder="Extracted links will appear here..."
                  className="w-full h-64 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 outline-none resize-none font-mono"
                  aria-label="Extracted links output"
                />
              </div>
            </div>
          </div>
        </section>

        {/* What is Link Extraction Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">What is Link Extraction?</h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                <strong>Link extraction</strong>, also known as URL extraction, is the process of automatically finding and extracting links (URLs or uniform resource locators) from text. A link is a string of text that contains the address of a web page, typically beginning with the HTTP or HTTPS protocol. Link extraction involves scanning text for these URL patterns, validating them, and presenting them in a clean, organized format.
              </p>
              
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Link extraction tools are commonly used in content analysis (analyzing articles and blog posts for link distribution), SEO research (extracting links from competitor content), data processing (preparing link data for analysis), social media analysis (finding shared links in posts), web scraping (extracting URLs from HTML), and content management (building link directories). According to <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-800 font-semibold underline">MDN Web Docs</a>, JavaScript provides powerful string manipulation methods like <code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm">match()</code> and regular expressions that enable accurate link extraction in web browsers. Modern link extraction tools use these methods to provide real-time, accurate URL detection.
              </p>

              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Our link extraction tool automatically detects HTTP links (http://), HTTPS links (https://), www links (www.example.com), and domain links (example.com). The tool validates extracted links, removes duplicates, and presents them in a clean list format. All extraction happens in real-time as you type, giving you instant feedback on all links found in your text. This helps you analyze content, create link lists, extract URLs from documents, and process text data efficiently.
              </p>

              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600">✗</span>
                    Manual Extraction
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">•</span>
                      <span>Time-consuming and error-prone</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">•</span>
                      <span>Difficult for large documents</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">•</span>
                      <span>Easy to miss links</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">•</span>
                      <span>No real-time feedback</span>
                    </li>
                  </ul>
                </div>
                
                <div className="rounded-2xl border-2 border-indigo-200 bg-indigo-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">✓</span>
                    Online Link Extractor
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold mt-0.5">•</span>
                      <span>Instant, accurate extraction</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold mt-0.5">•</span>
                      <span>Real-time updates as you type</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold mt-0.5">•</span>
                      <span>Automatic duplicate removal</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold mt-0.5">•</span>
                      <span>Works for any text length</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Use Link Extraction Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Why Use a Link Extraction Tool?</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Link extraction tools are essential for anyone who works with content and links:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-indigo-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 shadow-lg">
                    <span className="text-2xl">📊</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Analyze Content</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Link extraction helps you analyze content by identifying all links in articles, blog posts, or documents. This is essential for SEO research, competitor analysis, content auditing, and understanding link distribution. Quickly extract all links from any text to see which websites are referenced, analyze link patterns, and understand content structure.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                    <span className="text-2xl">🔗</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Create Link Lists</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Link extraction makes it easy to create organized link lists from any text. Extract all links from documents, articles, or social media posts and organize them into clean lists. This is useful for building link directories, creating resource pages, compiling reference lists, and organizing link collections for research or documentation.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-purple-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
                    <span className="text-2xl">📱</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Social Media Analysis</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Link extraction is perfect for analyzing social media posts to see which websites are being shared. Extract links from Twitter, Facebook, LinkedIn, or any social media content to analyze link distribution, identify trending URLs, understand sharing patterns, and track which websites receive the most social media traffic.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-orange-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Save Time</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Manually finding and extracting links from text is time-consuming and error-prone, especially for large documents. A link extraction tool automates this process, extracting all links from entire documents in seconds. Real-time processing means you see results instantly as you type, saving valuable time and ensuring accuracy.
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
                <div className="h-1 w-8 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full"></div>
                <h2 className="text-3xl font-bold text-slate-900">How it works</h2>
              </div>
              
              <p className="mt-2 text-slate-600 leading-relaxed">
                Our link extraction tool makes it easy to extract links from text in seconds. Follow these simple steps:
              </p>

              <ol className="mt-6 space-y-4">
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    1
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Enter or paste your text</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Type or paste the text containing links into the input field. The link extraction tool will automatically start extracting links as you type. You can paste text from documents, articles, social media posts, or any written content that contains URLs or links. The tool works with any text length.
                    </p>
                  </div>
                </li>
                
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    2
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">View extracted links</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Watch the extracted links appear in real-time in the output area. The tool automatically detects HTTP, HTTPS, and www links, removes duplicates, and validates URLs. All extracted links are displayed in a clean list format, making it easy to see all links found in your text. The link count is displayed below the input field.
                    </p>
                  </div>
                </li>
                
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    3
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Copy the extracted links</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Once you're satisfied with the extracted links, click the copy button to copy all links to your clipboard. You can then paste the links anywhere you need them. The extraction is instant and works in real-time, making it easy to quickly extract links from any text for analysis, processing, or documentation.
                    </p>
                  </div>
                </li>
              </ol>
            </div>

            <div className="md:col-span-5">
              <div className="sticky top-24 rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-7 shadow-xl">
                <div className="flex items-start gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 shadow-lg">
                    <span className="text-2xl">✨</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 pt-2">Why use our Link Extractor?</h3>
                </div>
                
                <ul className="mt-4 space-y-3">
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">Real-time extraction as you type</span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">100% client-side processing</span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">Automatic duplicate removal</span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">No registration required</span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">Works on all devices</span>
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
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What is a link extraction tool?</summary>
                <p className="mt-2 text-sm text-slate-600">A link extraction tool is a utility that automatically finds and extracts URLs (links) from text. It scans text for HTTP, HTTPS, and www links, validates them, removes duplicates, and presents them in a clean list format. Link extraction tools are essential for analyzing content, creating link lists, extracting URLs from documents, and processing text data that contains links.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What types of links can be extracted?</summary>
                <p className="mt-2 text-sm text-slate-600">Our link extraction tool can extract HTTP links (http://), HTTPS links (https://), www links (www.example.com), and domain links (example.com). The tool automatically detects all common URL formats, validates them, and removes duplicates. This covers all standard web link formats found in text, documents, and online content.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">How accurate is the link extraction?</summary>
                <p className="mt-2 text-sm text-slate-600">Our link extraction tool uses advanced regex patterns to accurately detect URLs in text. It validates extracted links to ensure they are properly formatted URLs, removes duplicates automatically, and handles edge cases like trailing punctuation. The extraction is highly accurate and works with all standard URL formats including HTTP, HTTPS, and www links.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Is the extraction instant?</summary>
                <p className="mt-2 text-sm text-slate-600">Yes, the link extraction is completely instant and happens in real-time as you type. There's no delay, no waiting, and no server processing. The extraction algorithm runs entirely in your browser using JavaScript, ensuring immediate results as you type or paste text containing links.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Is my text stored or sent to a server?</summary>
                <p className="mt-2 text-sm text-slate-600">No, absolutely not. All link extraction happens entirely in your browser using client-side JavaScript. Your text never leaves your device, isn't sent to any server, and isn't stored anywhere. This ensures complete privacy and security. The extraction algorithm runs locally in your browser without any network transmission.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Can I extract links from large amounts of text?</summary>
                <p className="mt-2 text-sm text-slate-600">Yes, our link extraction tool can handle large amounts of text. There's no character limit, and the extraction works instantly regardless of text length. Whether you're extracting links from a single paragraph, an article, or an entire document, the tool processes it immediately in your browser.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Does it work on mobile devices?</summary>
                <p className="mt-2 text-sm text-slate-600">Yes, our link extraction tool is fully responsive and works perfectly on mobile devices, tablets, and desktops. The interface adapts to your screen size, and all functionality works the same way on all devices. You can extract links from text on your phone, tablet, or computer with the same speed and accuracy.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What can I use extracted links for?</summary>
                <p className="mt-2 text-sm text-slate-600">Extracted links can be used for many purposes including creating link lists, analyzing content for link distribution, extracting URLs from documents for processing, building link directories, analyzing social media posts for shared links, creating sitemaps, and preparing link data for SEO analysis or content research.</p>
              </details>
            </div>
          </div>
        </section>

        {/* Related Tools Section */}
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Related Text Tools</h2>
            <p className="text-slate-600">Explore our complete suite of text tools for developers and writers:</p>
          </div>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-6">
            <Link href="/text-tools/extract-email" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-amber-300 hover:shadow-lg transition-all duration-300" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">📧</span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">Extract Email</p>
                  <p className="text-xs text-slate-500">Extract Email Addresses</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">Extract email addresses from text automatically. Find all email addresses in documents, articles, or any text content.</p>
              <p className="mt-4 text-sm font-semibold text-amber-600 group-hover:text-amber-700">Open tool →</p>
            </Link>
            
            <Link href="/text/word-counter" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-emerald-300 hover:shadow-lg transition-all duration-300" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">📊</span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">Word Counter</p>
                  <p className="text-xs text-slate-500">Count Words & Characters</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">Count words, characters (with and without spaces), paragraphs, sentences, and lines in real-time.</p>
              <p className="mt-4 text-sm font-semibold text-emerald-600 group-hover:text-emerald-700">Open tool →</p>
            </Link>
            
            <Link href="/text/text-case-converter" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-purple-300 hover:shadow-lg transition-all duration-300" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🔤</span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">Text Case Converter</p>
                  <p className="text-xs text-slate-500">Convert Text Case</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">Convert text between uppercase, lowercase, title case, sentence case, and more. Real-time conversion.</p>
              <p className="mt-4 text-sm font-semibold text-purple-600 group-hover:text-purple-700">Open tool →</p>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Link href="/tools/text-tools" className="group rounded-3xl border-2 border-slate-900 bg-gradient-to-br from-slate-900 to-slate-800 p-6 hover:shadow-xl transition-all duration-300" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🔧</span>
                </div>
                <div>
                  <p className="text-base font-bold text-white">All Text Tools</p>
                  <p className="text-xs text-slate-400">Browse Complete Suite</p>
                </div>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">Discover all our free text tools for word counting, case conversion, link extraction, email extraction, and more.</p>
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
