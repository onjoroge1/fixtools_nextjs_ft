import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

const siteHost = process.env.NEXT_PUBLIC_HOST || 'https://fixtools.io';

export default function TextCaseConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [caseType, setCaseType] = useState('uppercase');
  const [copyText, setCopyText] = useState('📋 Copy');

  const currentYear = new Date().getFullYear();
  const canonicalUrl = `${siteHost}/text/text-case-converter`;

  // Convert text based on selected case type
  const convertCase = (text, type) => {
    if (!text) return '';
    
    switch (type) {
      case 'uppercase':
        return text.toUpperCase();
      
      case 'lowercase':
        return text.toLowerCase();
      
      case 'title':
        return text.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
      
      case 'sentence':
        return text.toLowerCase().replace(/(^\w{1}|\.\s*\w{1})/gi, char => char.toUpperCase());
      
      case 'capitalize':
        return text.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
      
      case 'toggle':
        return text.split('').map(char => {
          if (char === char.toUpperCase()) {
            return char.toLowerCase();
          } else {
            return char.toUpperCase();
          }
        }).join('');
      
      case 'alternating':
        return text.split('').map((char, index) => {
          if (/\s/.test(char)) return char; // Keep spaces as-is
          return index % 2 === 0 ? char.toLowerCase() : char.toUpperCase();
        }).join('');
      
      case 'inverse':
        return text.split('').map(char => {
          if (char === char.toUpperCase() && /[A-Z]/.test(char)) {
            return char.toLowerCase();
          } else if (char === char.toLowerCase() && /[a-z]/.test(char)) {
            return char.toUpperCase();
          }
          return char;
        }).join('');
      
      default:
        return text;
    }
  };

  // Update output when input or case type changes
  useEffect(() => {
    const converted = convertCase(input, caseType);
    setOutput(converted);
  }, [input, caseType]);

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
        { "@type": "ListItem", "position": 4, "name": "Text Case Converter", "item": canonicalUrl }
      ]
    },
    softwareApplication: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Text Case Converter",
      "applicationCategory": "UtilityApplication",
      "operatingSystem": "Web Browser",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "3821",
        "bestRating": "5",
        "worstRating": "1"
      },
      "featureList": [
        "Convert text to uppercase, lowercase, title case, sentence case",
        "Real-time conversion as you type",
        "Multiple case conversion options",
        "100% client-side processing",
        "No registration required",
        "Instant conversion",
        "Copy to clipboard functionality",
        "Mobile-friendly interface"
      ],
      "description": "Free online text case converter. Convert text between uppercase, lowercase, title case, sentence case, and more. Real-time conversion, works 100% in your browser. No registration required."
    },
    howTo: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Convert Text Case",
      "description": "Step-by-step guide to convert text between different cases (uppercase, lowercase, title case, sentence case) online for free using FixTools Text Case Converter.",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Enter or paste your text",
          "text": "Type or paste the text you want to convert into the input field. The text case converter will automatically start converting as you type. You can paste text from documents, articles, or any written content.",
          "position": 1
        },
        {
          "@type": "HowToStep",
          "name": "Select case type",
          "text": "Choose the desired case type from the options: uppercase, lowercase, title case, sentence case, capitalize each word, toggle case, alternating case, or inverse case. The conversion happens instantly as you select different options.",
          "position": 2
        },
        {
          "@type": "HowToStep",
          "name": "Copy the converted text",
          "text": "Once you're satisfied with the converted text, click the copy button to copy it to your clipboard. You can then paste the converted text anywhere you need it. The conversion is instant and works in real-time.",
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
          "name": "What is a text case converter?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A text case converter is a tool that transforms text between different capitalization styles including uppercase (ALL CAPS), lowercase (all lowercase), title case (Each Word Capitalized), sentence case (First Letter Capitalized), and other variations. Text case converters are essential for formatting text, meeting style requirements, and ensuring consistent capitalization across documents."
          }
        },
        {
          "@type": "Question",
          "name": "What case types are supported?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our text case converter supports multiple case types: uppercase (ALL CAPS), lowercase (all lowercase), title case (Each Word Capitalized), sentence case (First Letter Capitalized), capitalize each word, toggle case (swap uppercase and lowercase), alternating case (aLtErNaTiNg), and inverse case (swap letters only). Each case type serves different formatting needs and style requirements."
          }
        },
        {
          "@type": "Question",
          "name": "What's the difference between title case and sentence case?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Title case capitalizes the first letter of each word (e.g., 'The Quick Brown Fox'), while sentence case capitalizes only the first letter of the first word in each sentence (e.g., 'The quick brown fox'). Title case is commonly used for headings and titles, while sentence case is used for body text and general writing. Our converter handles both automatically."
          }
        },
        {
          "@type": "Question",
          "name": "Is the conversion instant?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, the conversion is completely instant and happens in real-time as you type. There's no delay, no waiting, and no server processing. The conversion algorithm runs entirely in your browser using JavaScript, ensuring immediate results as you type or change the case type selection."
          }
        },
        {
          "@type": "Question",
          "name": "Is my text stored or sent to a server?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No, absolutely not. All text case conversion happens entirely in your browser using client-side JavaScript. Your text never leaves your device, isn't sent to any server, and isn't stored anywhere. This ensures complete privacy and security. The conversion algorithm runs locally in your browser without any network transmission."
          }
        },
        {
          "@type": "Question",
          "name": "Can I convert large amounts of text?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, our text case converter can handle large amounts of text. There's no character limit, and the conversion works instantly regardless of text length. Whether you're converting a single word, a paragraph, or an entire document, the converter processes it immediately in your browser."
          }
        },
        {
          "@type": "Question",
          "name": "Does it work on mobile devices?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, our text case converter is fully responsive and works perfectly on mobile devices, tablets, and desktops. The interface adapts to your screen size, and all functionality works the same way on all devices. You can convert text case on your phone, tablet, or computer with the same speed and accuracy."
          }
        },
        {
          "@type": "Question",
          "name": "What is toggle case?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Toggle case swaps uppercase and lowercase letters in your text. For example, 'Hello World' becomes 'hELLO wORLD'. This is useful for creating stylistic text effects, testing text processing, or converting text that was accidentally typed in the wrong case. The toggle case option instantly swaps all uppercase letters to lowercase and vice versa."
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
        <title>Text Case Converter - Free Online Case Converter | FixTools</title>
        <meta name="title" content="Text Case Converter - Free Online Case Converter | FixTools" />
        <meta name="description" content="Convert text between uppercase, lowercase, title case, sentence case, and more. Real-time conversion, works 100% in your browser. Free, instant, and no registration required." />
        <meta name="keywords" content="text case converter, case converter, uppercase converter, lowercase converter, title case converter, sentence case converter, text case changer, case transformer" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content="Text Case Converter - Free Online Case Converter" />
        <meta property="og:description" content="Convert text between uppercase, lowercase, title case, and more. Free and instant." />
        <meta property="og:image" content={`${siteHost}/images/text-case-converter-og.png`} />
        <meta property="og:site_name" content="FixTools" />
        
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content="Text Case Converter - Free Online Case Converter" />
        <meta property="twitter:description" content="Convert text between uppercase, lowercase, title case, and more. Free and instant." />
        <meta property="twitter:image" content={`${siteHost}/images/text-case-converter-og.png`} />
        
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.breadcrumb) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.softwareApplication) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.howTo) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.faqPage) }} />
      </Head>

      <style jsx global>{`
        html:has(.text-case-converter-page) {
          font-size: 100% !important;
        }
        
        .text-case-converter-page {
          line-height: 1.5;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          width: 100%;
          min-height: 100vh;
        }
        
        .text-case-converter-page *,
        .text-case-converter-page *::before,
        .text-case-converter-page *::after {
          box-sizing: border-box;
        }
        
        .text-case-converter-page h1,
        .text-case-converter-page h2,
        .text-case-converter-page h3,
        .text-case-converter-page p,
        .text-case-converter-page ul,
        .text-case-converter-page ol {
          margin: 0;
        }
        
        .text-case-converter-page button {
          font-family: inherit;
          cursor: pointer;
        }
        
        .text-case-converter-page input,
        .text-case-converter-page textarea,
        .text-case-converter-page select {
          font-family: inherit;
        }
      `}</style>

      <div className="text-case-converter-page bg-[#fbfbfc] text-slate-900 min-h-screen">
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
            <li className="flex items-center gap-2"><span className="text-slate-400">/</span><span className="font-semibold text-slate-900">Text Case Converter</span></li>
          </ol>
        </nav>

        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.35]" style={{ backgroundImage: 'url(/grid.png)', backgroundSize: '256px 256px' }}></div>
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-10 md:grid-cols-12 md:py-14">
            <div className="relative z-10 md:col-span-7 hero-content">
              <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 px-4 py-1.5 text-xs font-semibold text-purple-700 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                </span>
                Free • Fast • Privacy-first
              </div>
              
              <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                  Text Case Converter
                </span>
              </h1>
              
              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg md:leading-relaxed">
                Our <strong>text case converter</strong> transforms text between uppercase, lowercase, title case, sentence case, and more. Perfect for formatting text, meeting style requirements, and ensuring consistent capitalization. Works 100% in your browser with real-time conversion.
              </p>

              <div className="mt-7 pb-5 flex flex-wrap items-center gap-3">
                <a href="#tool" className="group relative rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 transition-all duration-200 hover:shadow-xl hover:scale-[1.02]">
                  <span className="relative z-10 flex items-center gap-2">⚡ Convert Text</span>
                </a>
                <a href="#how" className="rounded-2xl border-2 border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-900 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md">
                  How it works
                </a>
              </div>

              <dl className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Case Types</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">8 Options</dd>
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
                <div className="feature-card group rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-lg transition-all duration-300 hover:border-purple-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg shadow-purple-500/30 transition-transform duration-300 group-hover:scale-110">
                      <span className="text-2xl">⚡</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">Real-Time Conversion</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Convert text case instantly as you type. No waiting, no delays, no server processing.
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
                      <span className="text-2xl">🔤</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">Multiple Case Types</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Convert to uppercase, lowercase, title case, sentence case, and more.
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
                <h2 className="text-xl font-semibold text-slate-900">Convert Text Case online</h2>
                <p className="mt-1 text-sm text-slate-600">Enter your text and select the desired case type. Conversion happens instantly.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button onClick={clear} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50" aria-label="Clear input">Clear</button>
              </div>
            </div>

            <div className="mt-6">
              <label className="mb-2 block text-sm font-semibold text-slate-800">Select Case Type</label>
              <select
                value={caseType}
                onChange={(e) => setCaseType(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-900/20 mb-4"
                aria-label="Select case type"
              >
                <option value="uppercase">UPPERCASE (ALL CAPS)</option>
                <option value="lowercase">lowercase (all lowercase)</option>
                <option value="title">Title Case (Each Word Capitalized)</option>
                <option value="sentence">Sentence case (First letter capitalized)</option>
                <option value="capitalize">Capitalize Each Word</option>
                <option value="toggle">tOGGLE cASE (Swap Case)</option>
                <option value="alternating">aLtErNaTiNg CaSe</option>
                <option value="inverse">InVeRsE cAsE</option>
              </select>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">Input Text</label>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type or paste your text here to convert case..."
                  className="w-full h-64 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-900/20 resize-none"
                  aria-label="Text input for case conversion"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-sm font-semibold text-slate-800">Converted Text</label>
                  <button
                    onClick={handleCopy}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold hover:bg-slate-50 transition-colors"
                    aria-label="Copy converted text"
                  >
                    {copyText}
                  </button>
                </div>
                <textarea
                  value={output}
                  readOnly
                  placeholder="Converted text will appear here..."
                  className="w-full h-64 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 outline-none resize-none"
                  aria-label="Converted text output"
                />
              </div>
            </div>
          </div>
        </section>

        {/* What is Text Case Converter Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">What is a Text Case Converter?</h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                A <strong>text case converter</strong> is a tool that transforms text between different capitalization styles including uppercase (ALL CAPS), lowercase (all lowercase), title case (Each Word Capitalized), sentence case (First Letter Capitalized), and other variations. Text case converters are essential for formatting text, meeting style requirements, ensuring consistent capitalization across documents, and creating stylistic text effects.
              </p>
              
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Text case converters are commonly used in content creation (blog posts, articles, social media), academic writing (essays, research papers), professional writing (reports, proposals), web development (CSS text-transform, form validation), and creative writing (titles, headings). According to <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-800 font-semibold underline">MDN Web Docs</a>, JavaScript provides powerful string manipulation methods like <code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm">toUpperCase()</code> and <code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm">toLowerCase()</code> that enable accurate case conversion in web browsers. Modern text case converters use these methods to provide real-time, accurate conversions.
              </p>

              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Our text case converter provides multiple case conversion options including uppercase, lowercase, title case, sentence case, capitalize each word, toggle case, alternating case, and inverse case. All conversions happen in real-time as you type, giving you instant feedback on your text formatting. This helps you meet style requirements, ensure consistent capitalization, and format text exactly as needed.
              </p>

              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600">✗</span>
                    Manual Conversion
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">•</span>
                      <span>Time-consuming and error-prone</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">•</span>
                      <span>Difficult for long documents</span>
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
                
                <div className="rounded-2xl border-2 border-purple-200 bg-purple-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-purple-600">✓</span>
                    Online Case Converter
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>Instant, accurate conversion</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>Real-time updates as you type</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>Multiple case types available</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>Works for any text length</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Use Text Case Converter Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Why Use a Text Case Converter?</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Text case converters are essential tools for anyone who works with text:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-purple-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
                    <span className="text-2xl">📝</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Meet Style Requirements</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Different writing styles require different capitalization. Academic papers, blog posts, and professional documents often have specific case requirements. A text case converter helps you format text correctly and meet these requirements instantly. Real-time conversion lets you see the result immediately.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                    <span className="text-2xl">✨</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Consistent Formatting</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Text case converters ensure consistent capitalization across your entire document. Whether you're formatting headings, titles, or body text, a case converter helps maintain uniformity. This is essential for professional documents, websites, and publications where consistency matters.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-emerald-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Save Time</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Manually converting text case is time-consuming and error-prone. A text case converter automates this process, converting entire documents in seconds. Real-time conversion means you see results instantly as you type, saving valuable time and ensuring accuracy.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-orange-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg">
                    <span className="text-2xl">🎨</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Creative Text Effects</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Text case converters can create stylistic text effects like alternating case, toggle case, and inverse case. These effects are useful for creative writing, social media posts, and design projects. The converter makes it easy to experiment with different text styles and find the perfect look.
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
                <div className="h-1 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                <h2 className="text-3xl font-bold text-slate-900">How it works</h2>
              </div>
              
              <p className="mt-2 text-slate-600 leading-relaxed">
                Our text case converter makes it easy to convert text between different cases in seconds. Follow these simple steps:
              </p>

              <ol className="mt-6 space-y-4">
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    1
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Enter or paste your text</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Type or paste the text you want to convert into the input field. The text case converter will automatically start converting as you type. You can paste text from documents, articles, or any written content. The converter works with any text length.
                    </p>
                  </div>
                </li>
                
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    2
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Select case type</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Choose the desired case type from the options: uppercase, lowercase, title case, sentence case, capitalize each word, toggle case, alternating case, or inverse case. The conversion happens instantly as you select different options, giving you immediate feedback on your text formatting.
                    </p>
                  </div>
                </li>
                
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    3
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Copy the converted text</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Once you're satisfied with the converted text, click the copy button to copy it to your clipboard. You can then paste the converted text anywhere you need it. The conversion is instant and works in real-time, making it easy to format text exactly as needed.
                    </p>
                  </div>
                </li>
              </ol>
            </div>

            <div className="md:col-span-5">
              <div className="sticky top-24 rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-7 shadow-xl">
                <div className="flex items-start gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
                    <span className="text-2xl">✨</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 pt-2">Why use our Text Case Converter?</h3>
                </div>
                
                <ul className="mt-4 space-y-3">
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">Real-time conversion as you type</span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">100% client-side processing</span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">8 different case types</span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">No registration required</span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
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
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What is a text case converter?</summary>
                <p className="mt-2 text-sm text-slate-600">A text case converter is a tool that transforms text between different capitalization styles including uppercase (ALL CAPS), lowercase (all lowercase), title case (Each Word Capitalized), sentence case (First Letter Capitalized), and other variations. Text case converters are essential for formatting text, meeting style requirements, and ensuring consistent capitalization across documents.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What case types are supported?</summary>
                <p className="mt-2 text-sm text-slate-600">Our text case converter supports multiple case types: uppercase (ALL CAPS), lowercase (all lowercase), title case (Each Word Capitalized), sentence case (First Letter Capitalized), capitalize each word, toggle case (swap uppercase and lowercase), alternating case (aLtErNaTiNg), and inverse case (swap letters only). Each case type serves different formatting needs and style requirements.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What's the difference between title case and sentence case?</summary>
                <p className="mt-2 text-sm text-slate-600">Title case capitalizes the first letter of each word (e.g., 'The Quick Brown Fox'), while sentence case capitalizes only the first letter of the first word in each sentence (e.g., 'The quick brown fox'). Title case is commonly used for headings and titles, while sentence case is used for body text and general writing. Our converter handles both automatically.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Is the conversion instant?</summary>
                <p className="mt-2 text-sm text-slate-600">Yes, the conversion is completely instant and happens in real-time as you type. There's no delay, no waiting, and no server processing. The conversion algorithm runs entirely in your browser using JavaScript, ensuring immediate results as you type or change the case type selection.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Is my text stored or sent to a server?</summary>
                <p className="mt-2 text-sm text-slate-600">No, absolutely not. All text case conversion happens entirely in your browser using client-side JavaScript. Your text never leaves your device, isn't sent to any server, and isn't stored anywhere. This ensures complete privacy and security. The conversion algorithm runs locally in your browser without any network transmission.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Can I convert large amounts of text?</summary>
                <p className="mt-2 text-sm text-slate-600">Yes, our text case converter can handle large amounts of text. There's no character limit, and the conversion works instantly regardless of text length. Whether you're converting a single word, a paragraph, or an entire document, the converter processes it immediately in your browser.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Does it work on mobile devices?</summary>
                <p className="mt-2 text-sm text-slate-600">Yes, our text case converter is fully responsive and works perfectly on mobile devices, tablets, and desktops. The interface adapts to your screen size, and all functionality works the same way on all devices. You can convert text case on your phone, tablet, or computer with the same speed and accuracy.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What is toggle case?</summary>
                <p className="mt-2 text-sm text-slate-600">Toggle case swaps uppercase and lowercase letters in your text. For example, 'Hello World' becomes 'hELLO wORLD'. This is useful for creating stylistic text effects, testing text processing, or converting text that was accidentally typed in the wrong case. The toggle case option instantly swaps all uppercase letters to lowercase and vice versa.</p>
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
            
            <Link href="/text/base64-decoder" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-green-300 hover:shadow-lg transition-all duration-300" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🔓</span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">Base64 Decoder</p>
                  <p className="text-xs text-slate-500">Decode Base64</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">Decode Base64 strings to text or files. Decode data URIs, email attachments, and Base64-encoded data.</p>
              <p className="mt-4 text-sm font-semibold text-green-600 group-hover:text-green-700">Open tool →</p>
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
              <p className="text-sm text-slate-300 leading-relaxed">Discover all our free text tools for word counting, case conversion, Base64 encoding, and more.</p>
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

