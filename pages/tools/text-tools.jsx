import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import Data from '@/dbTools';

const siteHost = process.env.NEXT_PUBLIC_HOST || 'https://fixtools.io';

export default function TextToolsCategory({ tools }) {
  const currentYear = new Date().getFullYear();
  const canonicalUrl = `${siteHost}/tools/text-tools`;

  // Structured Data Schemas
  const structuredData = {
    // CollectionPage Schema for Google Sitelinks
    collectionPage: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Text Tools – Extract, Format & Manipulate Text Data Online | FixTools",
      "description": "Free online text tools for extracting, formatting, and manipulating text data. Extract emails, links, remove spaces, and process text instantly. All tools work 100% in your browser.",
      "url": canonicalUrl,
      "mainEntity": {
        "@type": "ItemList",
        "numberOfItems": tools.length,
        "itemListElement": tools.map((tool, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": tool.title,
          "url": `${siteHost}${tool.link}`,
          "description": tool.desc
        }))
      }
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
          "name": "Text Tools",
          "item": canonicalUrl
        }
      ]
    },

    // FAQPage Schema
    faqPage: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What are text tools?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Text tools are online utilities that help extract, format, and manipulate text data. They include email extractors, link extractors, space removers, case converters, and other tools that process and transform text for various purposes."
          }
        },
        {
          "@type": "Question",
          "name": "Are these text tools free to use?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, all our text tools are 100% free to use. There's no registration required, no account needed, and no hidden fees. All processing happens in your browser, so your data never leaves your device."
          }
        },
        {
          "@type": "Question",
          "name": "Do text tools work offline?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, once the page loads, all our text tools work entirely in your browser using JavaScript. No internet connection is needed after the initial page load. This ensures fast processing and complete privacy."
          }
        },
        {
          "@type": "Question",
          "name": "What can I extract from text?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our text tools can extract emails, URLs, links, phone numbers, and other patterns from text. Simply paste your text, and the tool will identify and extract the relevant information automatically."
          }
        },
        {
          "@type": "Question",
          "name": "Can I format text with these tools?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, our text tools can remove spaces, convert case (uppercase, lowercase, title case), trim whitespace, and perform various formatting operations to clean and organize your text data."
          }
        },
        {
          "@type": "Question",
          "name": "Is my text data secure when using these tools?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Absolutely. All text tools process data entirely in your browser using client-side JavaScript. Your text never leaves your device, isn't sent to any server, and isn't stored anywhere. This ensures complete privacy and security."
          }
        },
        {
          "@type": "Question",
          "name": "Can I process large amounts of text?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, our text tools can handle large amounts of text. Since processing happens in your browser, performance depends on your device's capabilities. Most tools can process thousands of lines of text efficiently."
          }
        },
        {
          "@type": "Question",
          "name": "Do I need to know programming to use text tools?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No, our text tools are designed to be user-friendly and require no programming knowledge. Simply paste your text, click the process button, and get instant results. The tools handle all the complex processing automatically."
          }
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
        <title>Text Tools – Extract, Format & Manipulate Text Data Online | FixTools</title>
        <meta name="title" content="Text Tools – Extract, Format & Manipulate Text Data Online | FixTools" />
        <meta name="description" content={`Free online text tools for extracting, formatting, and manipulating text data. ${tools.length} tools including email extractor, link extractor, space remover, and more. Extract emails, links, remove spaces, and process text instantly. Works 100% in your browser - fast, secure, no registration required.`} />
        <meta name="keywords" content="text tools, email extractor, link extractor, text formatter, space remover, case converter, text manipulator, free text tools, online text tools" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        {/* Canonical URL */}
        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content="Text Tools – Extract, Format & Manipulate Text Data Online" />
        <meta property="og:description" content={`Free online text tools for extracting, formatting, and manipulating text data. ${tools.length} tools available.`} />
        <meta property="og:image" content={`${siteHost}/images/text-tools-og.png`} />
        <meta property="og:site_name" content="FixTools" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content="Text Tools – Extract, Format & Manipulate Text Data Online" />
        <meta property="twitter:description" content={`Free online text tools for extracting, formatting, and manipulating text data.`} />
        <meta property="twitter:image" content={`${siteHost}/images/text-tools-og.png`} />
        
        {/* Structured Data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.collectionPage) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.breadcrumb) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.faqPage) }} />
      </Head>

      <style jsx global>{`
        html:has(.text-tools-category) {
          font-size: 100% !important;
        }
        
        .text-tools-category {
          line-height: 1.5;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          width: 100%;
          min-height: 100vh;
        }
        
        .text-tools-category *,
        .text-tools-category *::before,
        .text-tools-category *::after {
          box-sizing: border-box;
        }
        
        .text-tools-category h1,
        .text-tools-category h2,
        .text-tools-category h3,
        .text-tools-category p,
        .text-tools-category ul,
        .text-tools-category ol {
          margin: 0;
        }
        
        .text-tools-category button {
          font-family: inherit;
          cursor: pointer;
        }
        
        .text-tools-category input,
        .text-tools-category textarea,
        .text-tools-category select {
          font-family: inherit;
        }
      `}</style>

      <div className="text-tools-category bg-[#fbfbfc] text-slate-900 min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-center gap-3">
              <Image 
                src="/fixtools-logos/fixtools-logos_black.svg" 
                alt="FixTools" 
                width={120} 
                height={40} 
                className="h-9 w-auto" 
              />
            </Link>
            <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
              <Link className="hover:text-slate-900 transition-colors" href="/tools/json">JSON</Link>
              <Link className="hover:text-slate-900 transition-colors" href="/tools/html">HTML</Link>
              <Link className="hover:text-slate-900 transition-colors" href="/tools/css">CSS</Link>
              <Link className="hover:text-slate-900 transition-colors" href="/tools/text-tools">Text</Link>
              <Link className="hover:text-slate-900 transition-colors" href="/">All tools</Link>
            </nav>
            <Link 
              href="/" 
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50 transition-colors"
            >
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
              <Link href="/tools" className="hover:text-slate-900 transition-colors">
                Tools
              </Link>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-slate-400">/</span>
              <span className="font-semibold text-slate-900">Text Tools</span>
            </li>
          </ol>
        </nav>

        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div 
            className="absolute inset-0 opacity-[0.35]" 
            style={{ backgroundImage: 'url(/grid.png)', backgroundSize: '256px 256px' }}
          />
          
          <div className="mx-auto max-w-6xl px-4 py-12 md:py-16 relative z-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-gradient-to-r from-teal-50 to-green-50 px-4 py-1.5 text-xs font-semibold text-teal-700 shadow-sm mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
              </span>
              {tools.length} Free Tools • 100% Client-Side • No Sign-Up
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-teal-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
                Text Tools
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 max-w-3xl leading-relaxed mb-8">
              Professional <strong>text tools</strong> for extracting, formatting, and manipulating text data. Extract emails, links, remove spaces, and process text instantly. 
              All tools work 100% in your browser — fast, secure, and private. No registration required.
            </p>

            {/* Stats */}
            <dl className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Tools</dt>
                <dd className="mt-1.5 text-2xl font-bold text-slate-900">{tools.length}</dd>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Processing</dt>
                <dd className="mt-1.5 text-2xl font-bold text-slate-900">Client-Side</dd>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Privacy</dt>
                <dd className="mt-1.5 text-2xl font-bold text-slate-900">100%</dd>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Cost</dt>
                <dd className="mt-1.5 text-2xl font-bold text-slate-900">Free</dd>
              </div>
            </dl>
          </div>
        </section>

        {/* Popular Tools Section */}
        <section className="mx-auto max-w-6xl px-4 pb-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Popular Text Tools</h2>
            <p className="text-slate-600">Most used tools for text processing and extraction</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {tools
              .filter(tool => 
                tool.link.includes('word-counter') || 
                tool.link.includes('text-case-converter') || 
                tool.link.includes('extract-email') || 
                tool.link.includes('extract-links')
              )
              .map((tool) => {
                const getToolIcon = (title, link) => {
                  const lowerTitle = title.toLowerCase();
                  const lowerLink = link.toLowerCase();
                  
                  if (lowerTitle.includes('word counter') || lowerLink.includes('word-counter')) {
                    return { icon: '📊', color: 'from-emerald-500 to-green-600', shadow: 'shadow-emerald-500/30' };
                  }
                  if (lowerTitle.includes('case converter') || lowerLink.includes('case-converter')) {
                    return { icon: '🔤', color: 'from-purple-500 to-pink-600', shadow: 'shadow-purple-500/30' };
                  }
                  if (lowerTitle.includes('extract email') || lowerLink.includes('extract-email')) {
                    return { icon: '📧', color: 'from-amber-500 to-orange-600', shadow: 'shadow-amber-500/30' };
                  }
                  if (lowerTitle.includes('extract link') || lowerLink.includes('extract-links')) {
                    return { icon: '🔗', color: 'from-indigo-500 to-blue-600', shadow: 'shadow-indigo-500/30' };
                  }
                  return { icon: '📝', color: 'from-teal-500 to-green-600', shadow: 'shadow-teal-500/30' };
                };
                
                const toolIcon = getToolIcon(tool.title, tool.link);
                
                return (
                  <Link
                    key={tool.link}
                    href={tool.link}
                    className="group block p-5 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-teal-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${toolIcon.color} shadow-lg ${toolIcon.shadow} transition-transform duration-300 group-hover:scale-110 mb-3`}>
                        <span className="text-3xl">{toolIcon.icon}</span>
                      </div>
                      <h3 className="font-bold text-slate-900 mb-2 group-hover:text-teal-600 transition-colors text-base">
                        {tool.title}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                        {tool.desc.substring(0, 80)}...
                      </p>
                    </div>
                  </Link>
                );
              })}
          </div>
        </section>

        {/* All Tools Grid */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">All Text Tools</h2>
            <p className="text-slate-600">Complete list of all {tools.length} text processing tools</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map((tool) => {
              // Get appropriate icon and color for each tool
              const getToolIcon = (title, link) => {
                const lowerTitle = title.toLowerCase();
                const lowerLink = link.toLowerCase();
                
                if (lowerTitle.includes('word counter') || lowerLink.includes('word-counter')) {
                  return { icon: '📊', color: 'from-emerald-500 to-green-600', shadow: 'shadow-emerald-500/30' };
                }
                if (lowerTitle.includes('case converter') || lowerLink.includes('case-converter')) {
                  return { icon: '🔤', color: 'from-purple-500 to-pink-600', shadow: 'shadow-purple-500/30' };
                }
                if (lowerTitle.includes('base64 encoder') || lowerLink.includes('base64-encoder')) {
                  return { icon: '🔐', color: 'from-blue-500 to-indigo-600', shadow: 'shadow-blue-500/30' };
                }
                if (lowerTitle.includes('base64 decoder') || lowerLink.includes('base64-decoder')) {
                  return { icon: '🔓', color: 'from-green-500 to-emerald-600', shadow: 'shadow-green-500/30' };
                }
                if (lowerTitle.includes('extract email') || lowerLink.includes('extract-email')) {
                  return { icon: '📧', color: 'from-amber-500 to-orange-600', shadow: 'shadow-amber-500/30' };
                }
                if (lowerTitle.includes('extract link') || lowerLink.includes('extract-links')) {
                  return { icon: '🔗', color: 'from-indigo-500 to-blue-600', shadow: 'shadow-indigo-500/30' };
                }
                if (lowerTitle.includes('Remove Space') || lowerLink.includes('remove-spaces')) {
                  return { icon: '🧹', color: 'from-teal-500 to-cyan-600', shadow: 'shadow-teal-500/30' };
                }
                // Default
                return { icon: '📝', color: 'from-teal-500 to-green-600', shadow: 'shadow-teal-500/30' };
              };
              
              const toolIcon = getToolIcon(tool.title, tool.link);
              
              return (
                <Link
                  key={tool.link}
                  href={tool.link}
                  className="group block p-6 rounded-2xl border-2 border-slate-200 bg-white hover:border-teal-300 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${toolIcon.color} shadow-lg ${toolIcon.shadow} transition-transform duration-300 group-hover:scale-110`}>
                      <span className="text-2xl">{toolIcon.icon}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-900 mb-1 group-hover:text-teal-600 transition-colors">
                        {tool.title}
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {tool.desc}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* What are Text Tools Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-teal-500 to-green-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">What are Text Tools?</h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                <strong>Text tools</strong> are online utilities that help extract, format, and manipulate text data. They use pattern matching, regular expressions, and text processing algorithms to identify and transform text according to your needs. According to <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions" target="_blank" rel="noopener noreferrer" className="text-teal-700 hover:text-teal-800 font-semibold underline">MDN Web Docs</a>, 
                text processing is a fundamental part of web development and data analysis.
              </p>

              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Our text tools can extract emails, URLs, links, phone numbers, and other patterns from text. They can also format text by removing spaces, converting case, trimming whitespace, and performing various cleaning operations. These tools are essential for data cleaning, content analysis, and text processing tasks. According to <a href="https://www.w3.org/TR/string-meta/" target="_blank" rel="noopener noreferrer" className="text-teal-700 hover:text-teal-800 font-semibold underline">W3C</a>, 
                text manipulation is crucial for web standards and accessibility.
              </p>

              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Whether you're cleaning data, extracting contact information, or formatting text for display, our text tools make it easy and efficient. All processing happens instantly in your browser, ensuring privacy and speed.
              </p>

              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="rounded-2xl border-2 border-teal-200 bg-teal-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Text Operations</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-teal-600 font-bold mt-0.5">✓</span>
                      <span>Extract emails and URLs</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-teal-600 font-bold mt-0.5">✓</span>
                      <span>Remove spaces and whitespace</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-teal-600 font-bold mt-0.5">✓</span>
                      <span>Convert text case</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-teal-600 font-bold mt-0.5">✓</span>
                      <span>Find and replace patterns</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-teal-600 font-bold mt-0.5">✓</span>
                      <span>Clean and format text</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Why Text Tools?</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-teal-600 font-bold mt-0.5">✓</span>
                      <span>Save time on manual text processing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-teal-600 font-bold mt-0.5">✓</span>
                      <span>Extract data automatically</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-teal-600 font-bold mt-0.5">✓</span>
                      <span>Format text consistently</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-teal-600 font-bold mt-0.5">✓</span>
                      <span>Process large amounts of text</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-teal-600 font-bold mt-0.5">✓</span>
                      <span>100% private and secure</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How to Use Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-teal-500 to-green-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">How to Use These Tools</h2>
            </div>
            
            <p className="text-base text-slate-600 mb-6 leading-relaxed">
              Our text tools are designed to be simple and intuitive. Follow these steps to get started:
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-green-600 text-white font-bold text-xl shadow-lg mb-4">
                  1
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Choose Your Tool</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Select the text tool you need. Extract emails, extract links, remove spaces, or format text.
                </p>
              </div>

              <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-xl shadow-lg mb-4">
                  2
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Paste Your Text</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Paste or type your text into the input field. For extractors, paste the text containing emails or links.
                </p>
              </div>

              <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white font-bold text-xl shadow-lg mb-4">
                  3
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Get Results</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Click the process button and get instant results. Copy the extracted data or formatted text as needed.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-teal-500 to-green-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Frequently Asked Questions</h2>
            </div>
            
            <div className="space-y-6">
              {structuredData.faqPage.mainEntity.map((faq, index) => (
                <div key={index} className="border-b border-slate-200 pb-6 last:border-b-0 last:pb-0">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{faq.name}</h3>
                  <p className="text-sm text-slate-700 leading-relaxed">{faq.acceptedAnswer.text}</p>
                </div>
              ))}
            </div>
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

export async function getStaticProps() {
  // Filter tools for Text Tools category
  const toolsFromData = (Data || []).filter((tool) => tool.category === 'Text Tools');
  
  // Add base64-encoder, base64-decoder, word-counter, and text-case-converter tools manually
  const additionalTools = [
    {
      id: 'word-counter',
      title: 'Word Counter',
      category: 'Text Tools',
      link: '/text/word-counter',
      desc: 'Count words, characters (with and without spaces), paragraphs, sentences, and lines in real-time. Perfect for writers, students, and content creators who need to meet word limits or track their writing progress.'
    },
    {
      id: 'text-case-converter',
      title: 'Text Case Converter',
      category: 'Text Tools',
      link: '/text/text-case-converter',
      desc: 'Convert text between uppercase, lowercase, title case, sentence case, and more. Real-time conversion, works 100% in your browser. Perfect for formatting text and meeting style requirements.'
    },
    {
      id: 'base64-encoder',
      title: 'Base64 Encoder',
      category: 'Text Tools',
      link: '/text/base64-encoder',
      desc: 'Encode text and files to Base64 format. Create data URIs for images, encode email attachments, and convert any data to Base64. Supports URL-safe encoding and file uploads.'
    },
    {
      id: 'base64-decoder',
      title: 'Base64 Decoder',
      category: 'Text Tools',
      link: '/text/base64-decoder',
      desc: 'Decode Base64 strings to text or files. Decode data URIs, email attachments, and Base64-encoded data. Supports URL-safe Base64, image preview, and file downloads.'
    }
  ];
  
  // Enhance descriptions for existing tools
  const enhancedTools = toolsFromData.map(tool => {
    if (tool.link === '/text-tools/remove-spaces') {
      return {
        ...tool,
        desc: 'Remove spaces from text online for free. Remove all spaces, leading spaces, trailing spaces, or extra spaces. Real-time processing, works 100% in your browser. Perfect for cleaning up text, formatting code, and preparing data.'
      };
    }
    if (tool.link === '/text-tools/extract-email') {
      return {
        ...tool,
        desc: 'Extract email addresses from text automatically. Find all email addresses in documents, articles, or any text content. Real-time extraction, works 100% in your browser. Perfect for contact extraction, data analysis, and email collection.'
      };
    }
    if (tool.link === '/text-tools/extract-links') {
      return {
        ...tool,
        desc: 'Extract links and URLs from text automatically. Find all HTTP, HTTPS, and www links. Real-time processing, works 100% in your browser. Perfect for analyzing content, creating link lists, and extracting URLs from documents.'
      };
    }
    return tool;
  });
  
  const tools = [...enhancedTools, ...additionalTools];
  
  return {
    props: {
      tools,
    },
  };
}

