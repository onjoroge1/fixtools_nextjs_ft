import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import Data from '@/dbTools';

const siteHost = process.env.NEXT_PUBLIC_HOST || 'https://fixtools.io';

export default function ToolsIndex({ categoryStats }) {
  const currentYear = new Date().getFullYear();
  const canonicalUrl = `${siteHost}/tools`;

  // Category definitions with links and colors
  const categories = [
    {
      name: 'JSON Tools',
      slug: 'json',
      description: 'Format, validate, minify, and convert JSON data instantly.',
      icon: '📄',
      color: 'emerald',
      gradient: 'from-emerald-600 via-green-600 to-emerald-600',
      borderColor: 'border-emerald-300',
      bgColor: 'from-emerald-50 to-green-50',
      textColor: 'text-emerald-700',
      badgeColor: 'emerald',
      link: '/tools/json',
      toolCount: categoryStats['JSON Tools'] || 0
    },
    {
      name: 'HTML Tools',
      slug: 'html',
      description: 'Format, minify, validate, and generate HTML code.',
      icon: '📄',
      color: 'blue',
      gradient: 'from-blue-600 via-indigo-600 to-blue-600',
      borderColor: 'border-blue-300',
      bgColor: 'from-blue-50 to-indigo-50',
      textColor: 'text-blue-700',
      badgeColor: 'blue',
      link: '/tools/html',
      toolCount: categoryStats['HTML Tools'] || 0
    },
    {
      name: 'CSS Tools',
      slug: 'css',
      description: 'Generate gradients, shadows, borders, and optimize CSS code.',
      icon: '🎨',
      color: 'purple',
      gradient: 'from-purple-600 via-pink-600 to-purple-600',
      borderColor: 'border-purple-300',
      bgColor: 'from-purple-50 to-pink-50',
      textColor: 'text-purple-700',
      badgeColor: 'purple',
      link: '/tools/css',
      toolCount: categoryStats['CSS Tools'] || 0
    },
    {
      name: 'Image Tools',
      slug: 'image',
      description: 'Resize, compress, convert, crop, rotate, and edit images.',
      icon: '🖼️',
      color: 'purple',
      gradient: 'from-purple-600 via-pink-600 to-purple-600',
      borderColor: 'border-purple-300',
      bgColor: 'from-purple-50 to-pink-50',
      textColor: 'text-purple-700',
      badgeColor: 'purple',
      link: '/tools/image-tools',
      toolCount: categoryStats['Image Tools'] || 0
    },
    {
      name: 'PDF Tools',
      slug: 'pdf',
      description: 'Merge, split, compress, rotate, and convert PDF files.',
      icon: '📄',
      color: 'red',
      gradient: 'from-red-600 via-orange-600 to-red-600',
      borderColor: 'border-red-300',
      bgColor: 'from-red-50 to-orange-50',
      textColor: 'text-red-700',
      badgeColor: 'red',
      link: '/tools/pdf',
      toolCount: categoryStats['PDF Tools'] || 0
    },
    {
      name: 'AI Tools',
      slug: 'ai',
      description: 'Chat, summarize, classify, and generate content with AI.',
      icon: '🤖',
      color: 'indigo',
      gradient: 'from-indigo-600 via-purple-600 to-indigo-600',
      borderColor: 'border-indigo-300',
      bgColor: 'from-indigo-50 to-purple-50',
      textColor: 'text-indigo-700',
      badgeColor: 'indigo',
      link: '/tools/ai-tools',
      toolCount: categoryStats['AI Tools'] || 0
    },
    {
      name: 'SEO Tools',
      slug: 'seo',
      description: 'Create sitemaps, generate meta tags, and optimize for search engines.',
      icon: '🔍',
      color: 'amber',
      gradient: 'from-amber-600 via-yellow-600 to-amber-600',
      borderColor: 'border-amber-300',
      bgColor: 'from-amber-50 to-yellow-50',
      textColor: 'text-amber-700',
      badgeColor: 'amber',
      link: '/tools/seo-tools',
      toolCount: categoryStats['SEO Tools'] || 0
    },
    {
      name: 'Conversion Tools',
      slug: 'conversion',
      description: 'Convert currency, units, temperature, and time zones.',
      icon: '🔄',
      color: 'cyan',
      gradient: 'from-cyan-600 via-blue-600 to-cyan-600',
      borderColor: 'border-cyan-300',
      bgColor: 'from-cyan-50 to-blue-50',
      textColor: 'text-cyan-700',
      badgeColor: 'cyan',
      link: '/tools/conversion-tools',
      toolCount: categoryStats['Conversion Tools'] || 0
    },
    {
      name: 'Text Tools',
      slug: 'text',
      description: 'Extract, format, and manipulate text data.',
      icon: '📝',
      color: 'teal',
      gradient: 'from-teal-600 via-green-600 to-teal-600',
      borderColor: 'border-teal-300',
      bgColor: 'from-teal-50 to-green-50',
      textColor: 'text-teal-700',
      badgeColor: 'teal',
      link: '/tools/text-tools',
      toolCount: categoryStats['Text Tools'] || 0
    },
    {
      name: 'Utility Tools',
      slug: 'utilities',
      description: 'Generate QR codes, barcodes, passwords, and encode URLs.',
      icon: '🔧',
      color: 'blue',
      gradient: 'from-blue-600 via-cyan-600 to-blue-600',
      borderColor: 'border-blue-300',
      bgColor: 'from-blue-50 to-cyan-50',
      textColor: 'text-blue-700',
      badgeColor: 'blue',
      link: '/tools/utilities',
      toolCount: 5
    },
    {
      name: 'Web Tools',
      slug: 'web-tools',
      description: 'Analyze websites, take screenshots, test performance, and more.',
      icon: '🌐',
      color: 'violet',
      gradient: 'from-violet-600 via-purple-600 to-violet-600',
      borderColor: 'border-violet-300',
      bgColor: 'from-violet-50 to-purple-50',
      textColor: 'text-violet-700',
      badgeColor: 'violet',
      link: '/tools/web-tools',
      toolCount: categoryStats['Web Tools'] || 0
    }
  ];

  const totalTools = Object.values(categoryStats).reduce((sum, count) => sum + count, 0);

  // Structured Data Schemas
  const structuredData = {
    // CollectionPage Schema
    collectionPage: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Free Online Developer Tools - JSON, HTML, CSS, PDF & More | FixTools",
      "description": `Browse ${totalTools} free online developer tools. Format, validate, convert, and optimize code instantly. All tools work 100% in your browser.`,
      "url": canonicalUrl,
      "mainEntity": {
        "@type": "ItemList",
        "numberOfItems": categories.length,
        "itemListElement": categories.map((cat, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": cat.name,
          "url": `${siteHost}${cat.link}`,
          "description": cat.description
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
          "name": "What tools are available on FixTools?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `FixTools offers ${totalTools} free online tools across 8 categories: JSON Tools for data formatting and conversion, HTML Tools for markup generation and optimization, CSS Tools for style generation and minification, PDF Tools for document manipulation, AI Tools for content generation, SEO Tools for search optimization, Conversion Tools for unit and currency conversion, and Text Tools for text processing.`
          }
        },
        {
          "@type": "Question",
          "name": "Are all FixTools free to use?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `Yes, all ${totalTools} tools on FixTools are 100% free to use. There's no registration required, no account needed, and no hidden fees. All processing happens in your browser, so your data never leaves your device.`
          }
        },
        {
          "@type": "Question",
          "name": "Do FixTools work offline?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, once the page loads, all our tools work entirely in your browser using JavaScript. No internet connection is needed after the initial page load. This ensures fast processing and complete privacy."
          }
        },
        {
          "@type": "Question",
          "name": "How do I find the right tool?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Browse tools by category using the links above, or use the search function on our homepage. Each category page lists all available tools with descriptions. You can also use keyboard shortcuts (Cmd/Ctrl + K) to quickly search for tools."
          }
        },
        {
          "@type": "Question",
          "name": "Is my data secure when using FixTools?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Absolutely. All tools process data entirely in your browser using client-side JavaScript. Your data never leaves your device, isn't sent to any server, and isn't stored anywhere. This ensures complete privacy and security."
          }
        },
        {
          "@type": "Question",
          "name": "What file sizes can FixTools handle?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Most tools can handle files up to several megabytes in size. However, for optimal performance, we recommend files under 5-10MB depending on the tool. For very large files, consider processing them in chunks or using desktop software."
          }
        },
        {
          "@type": "Question",
          "name": "Can I use FixTools on mobile devices?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! All FixTools are fully responsive and work on mobile devices, tablets, and desktops. The interface adapts to your screen size for optimal usability."
          }
        },
        {
          "@type": "Question",
          "name": "Do FixTools require any software installation?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No, FixTools are web-based and require no software installation. Simply visit the tool page in your browser and start using it immediately. All tools work with modern browsers like Chrome, Firefox, Safari, and Edge."
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
        <title>Free Online Developer Tools – JSON, HTML, CSS, PDF & More | FixTools</title>
        <meta name="title" content="Free Online Developer Tools – JSON, HTML, CSS, PDF & More | FixTools" />
        <meta name="description" content={`Browse ${totalTools} free online developer tools. Format, validate, convert, and optimize code instantly. JSON, HTML, CSS, PDF, AI, SEO, and conversion tools. All tools work 100% in your browser - fast, secure, no registration required.`} />
        <meta name="keywords" content="developer tools, online tools, json tools, html tools, css tools, pdf tools, free tools, web tools, code formatter, code minifier, json formatter, html minifier, css generator" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        {/* Canonical URL */}
        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content="Free Online Developer Tools – JSON, HTML, CSS, PDF & More" />
        <meta property="og:description" content={`Browse ${totalTools} free online developer tools. Format, validate, convert, and optimize code instantly.`} />
        <meta property="og:image" content={`${siteHost}/images/tools-og.png`} />
        <meta property="og:site_name" content="FixTools" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content="Free Online Developer Tools – JSON, HTML, CSS, PDF & More" />
        <meta property="twitter:description" content={`Browse ${totalTools} free online developer tools. Format, validate, convert, and optimize code instantly.`} />
        <meta property="twitter:image" content={`${siteHost}/images/tools-og.png`} />
        
        {/* Structured Data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.collectionPage) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.breadcrumb) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.faqPage) }} />
      </Head>

      <style jsx global>{`
        html:has(.tools-index) {
          font-size: 100% !important;
        }
        
        .tools-index {
          line-height: 1.5;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          width: 100%;
          min-height: 100vh;
        }
        
        .tools-index *,
        .tools-index *::before,
        .tools-index *::after {
          box-sizing: border-box;
        }
        
        .tools-index h1,
        .tools-index h2,
        .tools-index h3,
        .tools-index p,
        .tools-index ul,
        .tools-index ol {
          margin: 0;
        }
        
        .tools-index button {
          font-family: inherit;
          cursor: pointer;
        }
        
        .tools-index input,
        .tools-index textarea,
        .tools-index select {
          font-family: inherit;
        }
      `}</style>

      <div className="tools-index bg-[#fbfbfc] text-slate-900 min-h-screen">
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
              <Link className="hover:text-slate-900 transition-colors" href="/tools/pdf">PDF</Link>
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
              <span className="font-semibold text-slate-900">Tools</span>
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
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100 px-4 py-1.5 text-xs font-semibold text-slate-700 shadow-sm mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-500"></span>
              </span>
              {totalTools} Free Tools • 8 Categories • 100% Client-Side
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                Developer Tools
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 max-w-3xl leading-relaxed mb-8">
              Browse <strong>{totalTools} free online tools</strong> for developers. Format, validate, convert, and optimize code instantly. 
              All tools work 100% in your browser — fast, secure, and private. No registration required.
            </p>

            {/* Stats */}
            <dl className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total Tools</dt>
                <dd className="mt-1.5 text-2xl font-bold text-slate-900">{totalTools}</dd>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Categories</dt>
                <dd className="mt-1.5 text-2xl font-bold text-slate-900">{categories.length}</dd>
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

        {/* Categories Grid */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Browse Tools by Category</h2>
            <p className="text-slate-600">Click any category to see all available tools</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={category.link}
                className="group block p-6 rounded-2xl border-2 border-slate-200 bg-white hover:border-slate-300 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex flex-col items-start gap-4">
                  <div className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${category.bgColor} shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                    <span className="text-3xl">{category.icon}</span>
                  </div>
                  <div className="flex-1 w-full">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className={`font-bold text-slate-900 transition-colors ${
                        category.color === 'emerald' ? 'group-hover:text-emerald-600' :
                        category.color === 'blue' ? 'group-hover:text-blue-600' :
                        category.color === 'purple' ? 'group-hover:text-purple-600' :
                        category.color === 'violet' ? 'group-hover:text-violet-600' :
                        category.color === 'red' ? 'group-hover:text-red-600' :
                        category.color === 'indigo' ? 'group-hover:text-indigo-600' :
                        category.color === 'amber' ? 'group-hover:text-amber-600' :
                        category.color === 'cyan' ? 'group-hover:text-cyan-600' :
                        'group-hover:text-teal-600'
                      }`}>
                        {category.name}
                      </h3>
                      {category.toolCount > 0 && (
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          category.badgeColor === 'emerald' ? 'bg-emerald-100 text-emerald-700' :
                          category.badgeColor === 'blue' ? 'bg-blue-100 text-blue-700' :
                          category.badgeColor === 'purple' ? 'bg-purple-100 text-purple-700' :
                          category.badgeColor === 'violet' ? 'bg-violet-100 text-violet-700' :
                          category.badgeColor === 'red' ? 'bg-red-100 text-red-700' :
                          category.badgeColor === 'indigo' ? 'bg-indigo-100 text-indigo-700' :
                          category.badgeColor === 'amber' ? 'bg-amber-100 text-amber-700' :
                          category.badgeColor === 'cyan' ? 'bg-cyan-100 text-cyan-700' :
                          'bg-teal-100 text-teal-700'
                        }`}>
                          {category.toolCount}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed mb-3">
                      {category.description}
                    </p>
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">
                      <span>View tools</span>
                      <span className="transition-transform group-hover:translate-x-1">→</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Why FixTools Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-slate-500 to-slate-700 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Why Choose FixTools?</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 mt-6">
              <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white font-bold text-xl shadow-lg mb-4">
                  ⚡
                </div>
                <h3 className="font-bold text-slate-900 mb-2">100% Client-Side</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  All processing happens in your browser. No data leaves your device, ensuring complete privacy and security.
                </p>
              </div>

              <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-xl shadow-lg mb-4">
                  🚀
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Fast & Free</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Instant results with no registration required. Use any tool as often as you want, completely free.
                </p>
              </div>

              <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 text-white font-bold text-xl shadow-lg mb-4">
                  🎯
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Developer-Focused</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Built by developers, for developers. Tools designed to solve real problems you face every day.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-slate-500 to-slate-700 rounded-full"></div>
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
  // Calculate tool counts per category
  const categoryStats = {};
  
  (Data || []).forEach((tool) => {
    if (tool.category) {
      categoryStats[tool.category] = (categoryStats[tool.category] || 0) + 1;
    }
  });
  
  return {
    props: {
      categoryStats,
    },
  };
}

