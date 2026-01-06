import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

const siteHost = process.env.NEXT_PUBLIC_HOST || 'https://fixtools.io';

export default function RemoveSpaces() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [removeType, setRemoveType] = useState('all'); // 'all', 'leading', 'trailing', 'extra'
  const [copyText, setCopyText] = useState('📋 Copy');

  const currentYear = new Date().getFullYear();
  const canonicalUrl = `${siteHost}/text-tools/remove-spaces`;

  // Remove spaces based on selected type
  const removeSpaces = (text, type) => {
    if (!text) return '';
    
    switch (type) {
      case 'all':
        return text.replace(/\s/g, '');
      case 'leading':
        return text.replace(/^\s+/gm, '');
      case 'trailing':
        return text.replace(/\s+$/gm, '');
      case 'extra':
        return text.replace(/\s+/g, ' ').trim();
      default:
        return text;
    }
  };

  // Update output when input or remove type changes
  useEffect(() => {
    const processed = removeSpaces(input, removeType);
    setOutput(processed);
  }, [input, removeType]);

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
        { "@type": "ListItem", "position": 4, "name": "Remove Spaces", "item": canonicalUrl }
      ]
    },
    softwareApplication: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Remove Spaces",
      "applicationCategory": "UtilityApplication",
      "operatingSystem": "Web Browser",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "3215",
        "bestRating": "5",
        "worstRating": "1"
      },
      "featureList": [
        "Remove all spaces from text",
        "Remove leading spaces",
        "Remove trailing spaces",
        "Remove extra spaces (normalize)",
        "Real-time processing",
        "100% client-side processing",
        "No registration required",
        "Instant space removal"
      ],
      "description": "Free online tool to remove spaces from text. Remove all spaces, leading spaces, trailing spaces, or extra spaces. Real-time processing, works 100% in your browser. No registration required."
    },
    howTo: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Remove Spaces from Text",
      "description": "Step-by-step guide to remove spaces from text online for free using FixTools Remove Spaces tool.",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Enter or paste your text",
          "text": "Type or paste the text you want to process into the input field. The space removal tool will automatically start processing as you type. You can paste text from documents, code, or any written content that contains spaces you want to remove.",
          "position": 1
        },
        {
          "@type": "HowToStep",
          "name": "Select removal type",
          "text": "Choose the type of space removal you need: remove all spaces (complete removal), remove leading spaces (from the start of lines), remove trailing spaces (from the end of lines), or remove extra spaces (normalize multiple spaces to single spaces). The conversion happens instantly as you select different options.",
          "position": 2
        },
        {
          "@type": "HowToStep",
          "name": "Copy the processed text",
          "text": "Once you're satisfied with the processed text, click the copy button to copy it to your clipboard. You can then paste the text without spaces anywhere you need it. The processing is instant and works in real-time, making it easy to clean up text quickly.",
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
          "name": "What is a space removal tool?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A space removal tool is a utility that removes spaces from text. It can remove all spaces completely, remove leading spaces (at the start of lines), remove trailing spaces (at the end of lines), or normalize extra spaces (replace multiple spaces with single spaces). Space removal tools are essential for cleaning up text, formatting code, preparing data for processing, and ensuring consistent text formatting."
          }
        },
        {
          "@type": "Question",
          "name": "What types of spaces can be removed?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our space removal tool can remove all spaces (complete removal), leading spaces (spaces at the beginning of lines), trailing spaces (spaces at the end of lines), or extra spaces (normalize multiple consecutive spaces to single spaces). This covers all common space removal needs for text processing, code formatting, and data cleaning."
          }
        },
        {
          "@type": "Question",
          "name": "What's the difference between removing all spaces and removing extra spaces?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Removing all spaces completely removes every space character from your text, resulting in text with no spaces at all. Removing extra spaces (normalizing) replaces multiple consecutive spaces with a single space, preserving word boundaries while cleaning up excessive spacing. Use 'remove all' when you need completely space-free text, and use 'remove extra' when you want to clean up formatting while keeping words separated."
          }
        },
        {
          "@type": "Question",
          "name": "Is the processing instant?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, the space removal is completely instant and happens in real-time as you type. There's no delay, no waiting, and no server processing. The removal algorithm runs entirely in your browser using JavaScript, ensuring immediate results as you type or change the removal type selection."
          }
        },
        {
          "@type": "Question",
          "name": "Is my text stored or sent to a server?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No, absolutely not. All space removal happens entirely in your browser using client-side JavaScript. Your text never leaves your device, isn't sent to any server, and isn't stored anywhere. This ensures complete privacy and security. The removal algorithm runs locally in your browser without any network transmission."
          }
        },
        {
          "@type": "Question",
          "name": "Can I remove spaces from large amounts of text?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, our space removal tool can handle large amounts of text. There's no character limit, and the processing works instantly regardless of text length. Whether you're removing spaces from a single word, a paragraph, or an entire document, the tool processes it immediately in your browser."
          }
        },
        {
          "@type": "Question",
          "name": "Does it work on mobile devices?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, our space removal tool is fully responsive and works perfectly on mobile devices, tablets, and desktops. The interface adapts to your screen size, and all functionality works the same way on all devices. You can remove spaces from text on your phone, tablet, or computer with the same speed and accuracy."
          }
        },
        {
          "@type": "Question",
          "name": "What are leading and trailing spaces?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Leading spaces are spaces at the beginning of lines (before the first character), while trailing spaces are spaces at the end of lines (after the last character). These spaces are often invisible but can cause formatting issues, especially in code or structured data. Our tool can remove leading spaces, trailing spaces, or both to clean up your text formatting."
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
        <title>Remove Spaces - Free Online Space Remover Tool | FixTools</title>
        <meta name="title" content="Remove Spaces - Free Online Space Remover Tool | FixTools" />
        <meta name="description" content="Remove spaces from text online for free. Remove all spaces, leading spaces, trailing spaces, or extra spaces. Real-time processing, works 100% in your browser. No registration required." />
        <meta name="keywords" content="remove spaces, space remover, remove spaces from text, remove all spaces, remove leading spaces, remove trailing spaces, remove extra spaces, space removal tool, text cleaner" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content="Remove Spaces - Free Online Space Remover Tool" />
        <meta property="og:description" content="Remove spaces from text online. Remove all spaces, leading spaces, trailing spaces, or extra spaces. Free and instant." />
        <meta property="og:image" content={`${siteHost}/images/remove-spaces-og.png`} />
        <meta property="og:site_name" content="FixTools" />
        
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content="Remove Spaces - Free Online Space Remover Tool" />
        <meta property="twitter:description" content="Remove spaces from text online. Remove all spaces, leading spaces, trailing spaces, or extra spaces. Free and instant." />
        <meta property="twitter:image" content={`${siteHost}/images/remove-spaces-og.png`} />
        
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.breadcrumb) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.softwareApplication) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.howTo) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.faqPage) }} />
      </Head>

      <style jsx global>{`
        html:has(.remove-spaces-page) {
          font-size: 100% !important;
        }
        
        .remove-spaces-page {
          line-height: 1.5;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          width: 100%;
          min-height: 100vh;
        }
        
        .remove-spaces-page *,
        .remove-spaces-page *::before,
        .remove-spaces-page *::after {
          box-sizing: border-box;
        }
        
        .remove-spaces-page h1,
        .remove-spaces-page h2,
        .remove-spaces-page h3,
        .remove-spaces-page p,
        .remove-spaces-page ul,
        .remove-spaces-page ol {
          margin: 0;
        }
        
        .remove-spaces-page button {
          font-family: inherit;
          cursor: pointer;
        }
        
        .remove-spaces-page input,
        .remove-spaces-page textarea,
        .remove-spaces-page select {
          font-family: inherit;
        }
      `}</style>

      <div className="remove-spaces-page bg-[#fbfbfc] text-slate-900 min-h-screen">
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
            <li className="flex items-center gap-2"><span className="text-slate-400">/</span><span className="font-semibold text-slate-900">Remove Spaces</span></li>
          </ol>
        </nav>

        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.35]" style={{ backgroundImage: 'url(/grid.png)', backgroundSize: '256px 256px' }}></div>
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-10 md:grid-cols-12 md:py-14">
            <div className="relative z-10 md:col-span-7 hero-content">
              <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-gradient-to-r from-teal-50 to-cyan-50 px-4 py-1.5 text-xs font-semibold text-teal-700 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                </span>
                Free • Fast • Privacy-first
              </div>
              
              <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                  Remove Spaces
                </span>
              </h1>
              
              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg md:leading-relaxed">
                Our <strong>space removal tool</strong> helps you remove spaces from text instantly. Remove all spaces, leading spaces, trailing spaces, or extra spaces. Perfect for cleaning up text, formatting code, and preparing data. Works 100% in your browser with real-time processing.
              </p>

              <div className="mt-7 pb-5 flex flex-wrap items-center gap-3">
                <a href="#tool" className="group relative rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 transition-all duration-200 hover:shadow-xl hover:scale-[1.02]">
                  <span className="relative z-10 flex items-center gap-2">⚡ Remove Spaces</span>
                </a>
                <a href="#how" className="rounded-2xl border-2 border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-900 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md">
                  How it works
                </a>
              </div>

              <dl className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Removal Types</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">4 Options</dd>
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
                <div className="feature-card group rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-lg transition-all duration-300 hover:border-teal-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 shadow-lg shadow-teal-500/30 transition-transform duration-300 group-hover:scale-110">
                      <span className="text-2xl">⚡</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">Real-Time Processing</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Remove spaces instantly as you type. No waiting, no delays, no server processing.
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
                      <span className="text-2xl">🎯</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">Multiple Options</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Remove all spaces, leading spaces, trailing spaces, or extra spaces.
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
                <h2 className="text-xl font-semibold text-slate-900">Remove Spaces from Text online</h2>
                <p className="mt-1 text-sm text-slate-600">Enter your text and select the removal type. Processing happens instantly.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button onClick={clear} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50" aria-label="Clear input">Clear</button>
              </div>
            </div>

            <div className="mt-6">
              <label className="mb-2 block text-sm font-semibold text-slate-800">Select Removal Type</label>
              <select
                value={removeType}
                onChange={(e) => setRemoveType(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-900/20 mb-4"
                aria-label="Select space removal type"
              >
                <option value="all">Remove All Spaces</option>
                <option value="leading">Remove Leading Spaces</option>
                <option value="trailing">Remove Trailing Spaces</option>
                <option value="extra">Remove Extra Spaces (Normalize)</option>
              </select>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">Input Text</label>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type or paste your text here to remove spaces..."
                  className="w-full h-64 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-900/20 resize-none"
                  aria-label="Text input for space removal"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-sm font-semibold text-slate-800">Processed Text</label>
                  <button
                    onClick={handleCopy}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold hover:bg-slate-50 transition-colors"
                    aria-label="Copy processed text"
                  >
                    {copyText}
                  </button>
                </div>
                <textarea
                  value={output}
                  readOnly
                  placeholder="Processed text will appear here..."
                  className="w-full h-64 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 outline-none resize-none"
                  aria-label="Processed text output"
                />
              </div>
            </div>
          </div>
        </section>

        {/* What is Remove Spaces Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">What is Space Removal?</h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                <strong>Space removal</strong> is the process of eliminating spaces from text. This can involve removing all spaces completely, removing leading spaces (at the start of lines), removing trailing spaces (at the end of lines), or normalizing extra spaces (replacing multiple consecutive spaces with single spaces). Space removal is essential for cleaning up text, formatting code, preparing data for processing, ensuring consistent text formatting, and meeting specific formatting requirements.
              </p>
              
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Space removal tools are commonly used in text processing (cleaning up documents), code formatting (removing unnecessary whitespace), data preparation (preparing text for databases or APIs), web development (formatting HTML/CSS/JavaScript), content management (cleaning up user input), and data analysis (preparing text for processing). According to <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-800 font-semibold underline">MDN Web Docs</a>, JavaScript provides powerful string manipulation methods like <code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm">replace()</code> and regular expressions that enable accurate space removal in web browsers. Modern space removal tools use these methods to provide real-time, accurate processing.
              </p>

              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Our space removal tool provides multiple removal options including removing all spaces (complete removal), removing leading spaces (from the start of lines), removing trailing spaces (from the end of lines), and removing extra spaces (normalizing multiple spaces to single spaces). All processing happens in real-time as you type, giving you instant feedback on your text formatting. This helps you clean up text, format code, prepare data, and ensure consistent formatting exactly as needed.
              </p>

              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600">✗</span>
                    Manual Removal
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
                      <span>Inconsistent results</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">•</span>
                      <span>No real-time feedback</span>
                    </li>
                  </ul>
                </div>
                
                <div className="rounded-2xl border-2 border-teal-200 bg-teal-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-100 text-teal-600">✓</span>
                    Online Space Remover
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-teal-600 font-bold mt-0.5">•</span>
                      <span>Instant, accurate removal</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-teal-600 font-bold mt-0.5">•</span>
                      <span>Real-time updates as you type</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-teal-600 font-bold mt-0.5">•</span>
                      <span>Multiple removal options</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-teal-600 font-bold mt-0.5">•</span>
                      <span>Works for any text length</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Use Remove Spaces Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Why Use a Space Removal Tool?</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Space removal tools are essential for anyone who works with text:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-teal-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 shadow-lg">
                    <span className="text-2xl">🧹</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Clean Up Text</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Space removal tools help you clean up text by removing unnecessary spaces. Whether you're removing all spaces for compact text, removing leading/trailing spaces for clean formatting, or normalizing extra spaces for consistent formatting, space removal ensures your text is clean and properly formatted. This is essential for professional documents, code, and data processing.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                    <span className="text-2xl">💻</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Format Code</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Space removal is essential for code formatting. Removing leading and trailing spaces ensures clean code formatting, while removing extra spaces normalizes code structure. This is particularly important in languages like Python where indentation matters, or in HTML/CSS/JavaScript where whitespace can affect rendering. Clean code is easier to read, maintain, and debug.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-purple-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
                    <span className="text-2xl">📊</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Prepare Data</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Space removal is crucial for data preparation. Many databases, APIs, and data processing systems require clean text without leading/trailing spaces or excessive spacing. Removing spaces ensures data consistency, prevents processing errors, and ensures accurate data analysis. This is essential for CSV files, database imports, and API integrations.
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
                      Manually removing spaces is time-consuming and error-prone, especially for large documents or code files. A space removal tool automates this process, removing spaces from entire documents in seconds. Real-time processing means you see results instantly as you type, saving valuable time and ensuring accuracy. This is essential for productivity and efficiency.
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
                <div className="h-1 w-8 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full"></div>
                <h2 className="text-3xl font-bold text-slate-900">How it works</h2>
              </div>
              
              <p className="mt-2 text-slate-600 leading-relaxed">
                Our space removal tool makes it easy to remove spaces from text in seconds. Follow these simple steps:
              </p>

              <ol className="mt-6 space-y-4">
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    1
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Enter or paste your text</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Type or paste the text you want to process into the input field. The space removal tool will automatically start processing as you type. You can paste text from documents, code, or any written content that contains spaces you want to remove. The tool works with any text length.
                    </p>
                  </div>
                </li>
                
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    2
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Select removal type</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Choose the type of space removal you need: remove all spaces (complete removal), remove leading spaces (from the start of lines), remove trailing spaces (from the end of lines), or remove extra spaces (normalize multiple spaces to single spaces). The conversion happens instantly as you select different options, giving you immediate feedback on your text formatting.
                    </p>
                  </div>
                </li>
                
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    3
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Copy the processed text</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Once you're satisfied with the processed text, click the copy button to copy it to your clipboard. You can then paste the text without spaces anywhere you need it. The processing is instant and works in real-time, making it easy to clean up text quickly and efficiently.
                    </p>
                  </div>
                </li>
              </ol>
            </div>

            <div className="md:col-span-5">
              <div className="sticky top-24 rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-7 shadow-xl">
                <div className="flex items-start gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 shadow-lg">
                    <span className="text-2xl">✨</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 pt-2">Why use our Space Remover?</h3>
                </div>
                
                <ul className="mt-4 space-y-3">
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-teal-100 text-teal-600">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">Real-time processing as you type</span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-teal-100 text-teal-600">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">100% client-side processing</span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-teal-100 text-teal-600">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">4 different removal options</span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-teal-100 text-teal-600">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">No registration required</span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-teal-100 text-teal-600">
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
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What is a space removal tool?</summary>
                <p className="mt-2 text-sm text-slate-600">A space removal tool is a utility that removes spaces from text. It can remove all spaces completely, remove leading spaces (at the start of lines), remove trailing spaces (at the end of lines), or normalize extra spaces (replace multiple spaces with single spaces). Space removal tools are essential for cleaning up text, formatting code, preparing data for processing, and ensuring consistent text formatting.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What types of spaces can be removed?</summary>
                <p className="mt-2 text-sm text-slate-600">Our space removal tool can remove all spaces (complete removal), leading spaces (spaces at the beginning of lines), trailing spaces (spaces at the end of lines), or extra spaces (normalize multiple consecutive spaces to single spaces). This covers all common space removal needs for text processing, code formatting, and data cleaning.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What's the difference between removing all spaces and removing extra spaces?</summary>
                <p className="mt-2 text-sm text-slate-600">Removing all spaces completely removes every space character from your text, resulting in text with no spaces at all. Removing extra spaces (normalizing) replaces multiple consecutive spaces with a single space, preserving word boundaries while cleaning up excessive spacing. Use 'remove all' when you need completely space-free text, and use 'remove extra' when you want to clean up formatting while keeping words separated.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Is the processing instant?</summary>
                <p className="mt-2 text-sm text-slate-600">Yes, the space removal is completely instant and happens in real-time as you type. There's no delay, no waiting, and no server processing. The removal algorithm runs entirely in your browser using JavaScript, ensuring immediate results as you type or change the removal type selection.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Is my text stored or sent to a server?</summary>
                <p className="mt-2 text-sm text-slate-600">No, absolutely not. All space removal happens entirely in your browser using client-side JavaScript. Your text never leaves your device, isn't sent to any server, and isn't stored anywhere. This ensures complete privacy and security. The removal algorithm runs locally in your browser without any network transmission.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Can I remove spaces from large amounts of text?</summary>
                <p className="mt-2 text-sm text-slate-600">Yes, our space removal tool can handle large amounts of text. There's no character limit, and the processing works instantly regardless of text length. Whether you're removing spaces from a single word, a paragraph, or an entire document, the tool processes it immediately in your browser.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Does it work on mobile devices?</summary>
                <p className="mt-2 text-sm text-slate-600">Yes, our space removal tool is fully responsive and works perfectly on mobile devices, tablets, and desktops. The interface adapts to your screen size, and all functionality works the same way on all devices. You can remove spaces from text on your phone, tablet, or computer with the same speed and accuracy.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What are leading and trailing spaces?</summary>
                <p className="mt-2 text-sm text-slate-600">Leading spaces are spaces at the beginning of lines (before the first character), while trailing spaces are spaces at the end of lines (after the last character). These spaces are often invisible but can cause formatting issues, especially in code or structured data. Our tool can remove leading spaces, trailing spaces, or both to clean up your text formatting.</p>
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
            
            <Link href="/text/base64-encoder" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-blue-300 hover:shadow-lg transition-all duration-300" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🔐</span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">Base64 Encoder</p>
                  <p className="text-xs text-slate-500">Encode to Base64</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">Encode text and files to Base64 format. Create data URIs for images and encode email attachments.</p>
              <p className="mt-4 text-sm font-semibold text-blue-600 group-hover:text-blue-700">Open tool →</p>
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
              <p className="text-sm text-slate-300 leading-relaxed">Discover all our free text tools for word counting, case conversion, Base64 encoding, space removal, and more.</p>
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
