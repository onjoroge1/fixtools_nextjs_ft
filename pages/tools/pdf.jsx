import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import Data from '@/dbTools';

const siteHost = process.env.NEXT_PUBLIC_HOST || 'https://fixtools.io';

export default function PDFToolsCategory({ tools }) {
  const currentYear = new Date().getFullYear();
  const canonicalUrl = `${siteHost}/tools/pdf`;

  // Structured Data Schemas
  const structuredData = {
    // CollectionPage Schema for Google Sitelinks
    collectionPage: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "PDF Tools – Merge, Split, Compress & Convert PDF Online | FixTools",
      "description": "Free online PDF tools for working with PDF documents. Merge, split, compress, rotate, and convert PDF files instantly. All tools work 100% in your browser.",
      "url": canonicalUrl,
      "mainEntity": {
        "@type": "ItemList",
        "numberOfItems": tools.length || 0,
        "itemListElement": (tools || []).map((tool, index) => ({
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
          "name": "PDF Tools",
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
          "name": "What are PDF tools?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "PDF tools are online utilities that help you work with PDF (Portable Document Format) files. They include tools to merge multiple PDFs, split PDFs into separate files, compress PDFs to reduce file size, rotate pages, convert PDFs to other formats, and more."
          }
        },
        {
          "@type": "Question",
          "name": "Are these PDF tools free to use?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, all our PDF tools are 100% free to use. There's no registration required, no account needed, and no hidden fees. All processing happens in your browser, so your files never leave your device."
          }
        },
        {
          "@type": "Question",
          "name": "Do PDF tools work offline?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, once the page loads, all our PDF tools work entirely in your browser using JavaScript. No internet connection is needed after the initial page load. This ensures fast processing and complete privacy."
          }
        },
        {
          "@type": "Question",
          "name": "What file sizes can PDF tools handle?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our PDF tools can handle files up to several megabytes in size. However, for optimal performance, we recommend files under 10MB. For very large files, consider processing them in smaller batches or using desktop software."
          }
        },
        {
          "@type": "Question",
          "name": "Can I merge multiple PDF files?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! Our PDF merger tool allows you to combine multiple PDF files into a single document. Simply upload or select the PDFs you want to merge, arrange them in the desired order, and download the combined file."
          }
        },
        {
          "@type": "Question",
          "name": "Is my PDF data secure when using these tools?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Absolutely. All PDF tools process files entirely in your browser using client-side JavaScript. Your PDFs never leave your device, aren't sent to any server, and aren't stored anywhere. This ensures complete privacy and security."
          }
        },
        {
          "@type": "Question",
          "name": "Can I compress PDF files to reduce size?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! Our PDF compressor tool reduces file size by optimizing images, removing unnecessary metadata, and compressing content. This is especially useful for email attachments and web uploads where file size matters."
          }
        },
        {
          "@type": "Question",
          "name": "What PDF operations are available?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our PDF tools support merging, splitting, compressing, rotating pages, converting to images, and extracting text. All operations are performed client-side for maximum privacy and security."
          }
        }
      ]
    }
  };

  const toolCount = tools?.length || 0;

  return (
    <>
      <Head>
        {/* Primary Meta Tags */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>PDF Tools – Merge, Split, Compress & Convert PDF Online | FixTools</title>
        <meta name="title" content="PDF Tools – Merge, Split, Compress & Convert PDF Online | FixTools" />
        <meta name="description" content="Free online PDF tools for working with PDF documents. Merge, split, compress, rotate, and convert PDF files instantly. {toolCount > 0 ? toolCount + ' tools' : 'Professional tools'} including PDF merger, splitter, compressor, and converter. Works 100% in your browser - fast, secure, no registration required." />
        <meta name="keywords" content="pdf tools, pdf merger, pdf splitter, pdf compressor, pdf converter, merge pdf, split pdf, compress pdf, pdf to jpg, pdf to png, free pdf tools, online pdf tools" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        {/* Canonical URL */}
        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content="PDF Tools – Merge, Split, Compress & Convert PDF Online" />
        <meta property="og:description" content="Free online PDF tools for working with PDF documents. Merge, split, compress, rotate, and convert PDF files instantly." />
        <meta property="og:image" content={`${siteHost}/images/pdf-tools-og.png`} />
        <meta property="og:site_name" content="FixTools" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content="PDF Tools – Merge, Split, Compress & Convert PDF Online" />
        <meta property="twitter:description" content="Free online PDF tools for working with PDF documents. Merge, split, compress, rotate, and convert PDF files instantly." />
        <meta property="twitter:image" content={`${siteHost}/images/pdf-tools-og.png`} />
        
        {/* Structured Data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.collectionPage) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.breadcrumb) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.faqPage) }} />
      </Head>

      <style jsx global>{`
        html:has(.pdf-tools-category) {
          font-size: 100% !important;
        }
        
        .pdf-tools-category {
          line-height: 1.5;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          width: 100%;
          min-height: 100vh;
        }
        
        .pdf-tools-category *,
        .pdf-tools-category *::before,
        .pdf-tools-category *::after {
          box-sizing: border-box;
        }
        
        .pdf-tools-category h1,
        .pdf-tools-category h2,
        .pdf-tools-category h3,
        .pdf-tools-category p,
        .pdf-tools-category ul,
        .pdf-tools-category ol {
          margin: 0;
        }
        
        .pdf-tools-category button {
          font-family: inherit;
          cursor: pointer;
        }
        
        .pdf-tools-category input,
        .pdf-tools-category textarea,
        .pdf-tools-category select {
          font-family: inherit;
        }
      `}</style>

      <div className="pdf-tools-category bg-[#fbfbfc] text-slate-900 min-h-screen">
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
              <Link href="/tools" className="hover:text-slate-900 transition-colors">
                Tools
              </Link>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-slate-400">/</span>
              <span className="font-semibold text-slate-900">PDF Tools</span>
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
            <div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-gradient-to-r from-red-50 to-orange-50 px-4 py-1.5 text-xs font-semibold text-red-700 shadow-sm mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              {toolCount > 0 ? `${toolCount} Free Tools` : 'Professional Tools'} • 100% Client-Side • No Sign-Up
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-red-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
                PDF Tools
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 max-w-3xl leading-relaxed mb-8">
              Professional <strong>PDF tools</strong> for working with PDF documents. Merge, split, compress, rotate, and convert PDF files instantly. 
              All tools work 100% in your browser — fast, secure, and private. No registration required.
            </p>

            {/* Stats */}
            <dl className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Tools</dt>
                <dd className="mt-1.5 text-2xl font-bold text-slate-900">{toolCount || 'Coming Soon'}</dd>
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

        {/* Tools Grid */}
        {toolCount > 0 ? (
          <section className="mx-auto max-w-6xl px-4 pb-12">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">All PDF Tools</h2>
              <p className="text-slate-600">Click any tool to get started — no registration required</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tools.map((tool) => {
                const getToolIcon = (title, link) => {
                  const lowerTitle = title.toLowerCase();
                  const lowerLink = link.toLowerCase();
                  
                  if (lowerTitle.includes('to jpg') || lowerLink.includes('to-jpg')) {
                    return { icon: '🖼️', color: 'from-red-500 to-orange-600', shadow: 'shadow-red-500/30' };
                  }
                  if (lowerTitle.includes('compressor') || lowerLink.includes('compressor')) {
                    return { icon: '🗜️', color: 'from-blue-500 to-indigo-600', shadow: 'shadow-blue-500/30' };
                  }
                  if (lowerTitle.includes('merger') || lowerLink.includes('merger')) {
                    return { icon: '📚', color: 'from-green-500 to-emerald-600', shadow: 'shadow-green-500/30' };
                  }
                  if (lowerTitle.includes('splitter') || lowerLink.includes('splitter')) {
                    return { icon: '✂️', color: 'from-purple-500 to-pink-600', shadow: 'shadow-purple-500/30' };
                  }
                  if (lowerTitle.includes('to word') || lowerLink.includes('to-word')) {
                    return { icon: '📝', color: 'from-indigo-500 to-blue-600', shadow: 'shadow-indigo-500/30' };
                  }
                  if (lowerTitle.includes('to png') || lowerLink.includes('to-png')) {
                    return { icon: '🖼️', color: 'from-cyan-500 to-blue-600', shadow: 'shadow-cyan-500/30' };
                  }
                  if (lowerTitle.includes('rotate') || lowerLink.includes('rotate')) {
                    return { icon: '🔄', color: 'from-orange-500 to-red-600', shadow: 'shadow-orange-500/30' };
                  }
                  return { icon: '📄', color: 'from-red-500 to-orange-600', shadow: 'shadow-red-500/30' };
                };
                
                const toolIcon = getToolIcon(tool.title, tool.link);
                
                return (
                  <Link
                    key={tool.link}
                    href={tool.link}
                    className="group block p-6 rounded-2xl border-2 border-slate-200 bg-white hover:border-red-300 hover:shadow-lg cursor-pointer transition-all duration-300"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${toolIcon.color} shadow-lg ${toolIcon.shadow} transition-transform duration-300 group-hover:scale-110`}>
                        <span className="text-2xl">{toolIcon.icon}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900 group-hover:text-red-600 transition-colors mb-1">
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
        ) : (
          <section className="mx-auto max-w-6xl px-4 pb-12">
            <div className="rounded-3xl border-2 border-red-200 bg-gradient-to-br from-red-50 to-orange-50 p-8 md:p-12 text-center">
              <div className="text-6xl mb-4">📄</div>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">PDF Tools Coming Soon</h2>
              <p className="text-slate-600 max-w-2xl mx-auto mb-6">
                We're working on bringing you powerful PDF tools including merge, split, compress, rotate, and convert functionality. 
                All tools will work 100% in your browser for maximum privacy and security.
              </p>
              <div className="flex flex-wrap justify-center gap-3 text-sm">
                <span className="px-4 py-2 rounded-full bg-white border border-red-200 text-slate-700">PDF Merger</span>
                <span className="px-4 py-2 rounded-full bg-white border border-red-200 text-slate-700">PDF Splitter</span>
                <span className="px-4 py-2 rounded-full bg-white border border-red-200 text-slate-700">PDF Compressor</span>
                <span className="px-4 py-2 rounded-full bg-white border border-red-200 text-slate-700">PDF Converter</span>
              </div>
            </div>
          </section>
        )}

        {/* What is PDF Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">What is PDF?</h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                <strong>PDF (Portable Document Format)</strong> is a file format developed by Adobe that preserves the formatting of documents regardless of the software, hardware, or operating system used to view them. PDFs are widely used for documents, forms, ebooks, and professional publications. According to <a href="https://developer.mozilla.org/en-US/docs/Web/PDF" target="_blank" rel="noopener noreferrer" className="text-red-700 hover:text-red-800 font-semibold underline">MDN Web Docs</a>, 
                PDFs are the standard format for document sharing and archiving.
              </p>

              <p className="text-base text-slate-700 leading-relaxed mb-4">
                PDF files can contain text, images, forms, annotations, and interactive elements. They're designed to look the same on any device, making them ideal for sharing documents that need to maintain their exact appearance. PDF tools help users manipulate these files without expensive software, enabling tasks like merging multiple documents, splitting large files, compressing for email, and converting to other formats.
              </p>

              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Our PDF tools use client-side processing to ensure your documents remain private and secure. All operations happen in your browser, so your files never leave your device or get uploaded to any server.
              </p>

              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Common PDF Operations</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">✓</span>
                      <span>Merge multiple PDFs into one</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">✓</span>
                      <span>Split PDF into separate files</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">✓</span>
                      <span>Compress to reduce file size</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">✓</span>
                      <span>Rotate pages orientation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">✓</span>
                      <span>Convert to images or other formats</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Why PDF Tools?</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">✓</span>
                      <span>No software installation needed</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">✓</span>
                      <span>100% privacy - files stay on your device</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">✓</span>
                      <span>Free to use, no registration</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">✓</span>
                      <span>Works on any device with a browser</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">✓</span>
                      <span>Fast processing, no upload delays</span>
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
              <div className="h-1 w-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">How to Use These Tools</h2>
            </div>
            
            <p className="text-base text-slate-600 mb-6 leading-relaxed">
              Our PDF tools are designed to be simple and intuitive. Follow these steps to get started:
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-orange-600 text-white font-bold text-xl shadow-lg mb-4">
                  1
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Choose Your Tool</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Select the PDF tool you need. Merge, split, compress, rotate, or convert PDF files.
                </p>
              </div>

              <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-xl shadow-lg mb-4">
                  2
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Upload Your PDF</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Upload or drag-and-drop your PDF file(s). All processing happens in your browser for maximum privacy.
                </p>
              </div>

              <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white font-bold text-xl shadow-lg mb-4">
                  3
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Download Result</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Process your PDF and download the result. Your files are never uploaded to any server.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"></div>
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
  // All PDF Tools we'll be creating
  const tools = [
    // ✅ Available Tools
    {
      id: 'pdf-to-jpg',
      title: 'PDF to JPG',
      category: 'PDF Tools',
      link: '/pdf/pdf-to-jpg',
      desc: 'Convert PDF pages to JPG images. Extract individual pages or all pages as high-quality JPG images. Perfect for sharing PDF content as images or embedding in documents. Supports batch conversion of all pages.',
      searchVolume: 301000,
      status: 'available'
    },
    {
      id: 'pdf-compressor',
      title: 'PDF Compressor',
      category: 'PDF Tools',
      link: '/pdf/pdf-compressor',
      desc: 'Compress PDF files to reduce file size while maintaining quality. Optimize PDFs for email attachments, web uploads, and storage. Achieve 30-70% size reduction with adjustable compression settings.',
      status: 'available'
    },
    {
      id: 'pdf-merger',
      title: 'PDF Merger',
      category: 'PDF Tools',
      link: '/pdf/pdf-merger',
      desc: 'Merge multiple PDF files into a single document. Combine PDFs in any order you want. Perfect for combining reports, documents, or presentations. Drag and drop to reorder pages.',
      status: 'available'
    },
    {
      id: 'pdf-splitter',
      title: 'PDF Splitter',
      category: 'PDF Tools',
      link: '/pdf/pdf-splitter',
      desc: 'Split PDF files into separate documents. Extract specific pages or split by page ranges. Create individual PDFs from each page or custom page ranges. Perfect for organizing large documents.',
      status: 'available'
    },
    {
      id: 'pdf-to-png',
      title: 'PDF to PNG',
      category: 'PDF Tools',
      link: '/pdf/pdf-to-png',
      desc: 'Convert PDF pages to PNG images with transparent backgrounds. Extract pages as high-quality PNG images. Perfect for web use, presentations, or image editing. Supports batch conversion.',
      searchVolume: 90000,
      status: 'available'
    },
    {
      id: 'pdf-rotator',
      title: 'Rotate PDF',
      category: 'PDF Tools',
      link: '/pdf/pdf-rotator',
      desc: 'Rotate PDF pages 90°, 180°, or 270°. Fix orientation issues or rotate pages for better viewing. Rotate individual pages or all pages at once. Maintains PDF quality and formatting.',
      status: 'available'
    },
    
    // ⏳ Coming Soon - High Priority Conversion Tools
    {
      id: 'pdf-to-word',
      title: 'PDF to Word',
      category: 'PDF Tools',
      link: '/pdf/pdf-to-word',
      desc: 'Convert PDF documents to editable Word (.docx) format. Extract text and formatting from PDFs for editing in Microsoft Word or Google Docs. Preserves text, images, and basic formatting. Free for files up to 100MB.',
      searchVolume: 450000,
      status: 'available'
    },
    {
      id: 'word-to-pdf',
      title: 'Word to PDF',
      category: 'PDF Tools',
      link: '/pdf/word-to-pdf',
      desc: 'Convert Word documents (.docx) to PDF format. Preserve formatting, fonts, images, and layout. Perfect for creating professional PDFs from Word documents. Works entirely in your browser.',
      searchVolume: 350000,
      status: 'available'
    },
    {
      id: 'pdf-to-excel',
      title: 'PDF to Excel',
      category: 'PDF Tools',
      link: '/pdf/pdf-to-excel',
      desc: 'Extract tables and data from PDF files into Excel spreadsheets (.xlsx). Convert PDF tables to editable Excel format. Perfect for data extraction and analysis. Preserves table structure.',
      searchVolume: 300000,
      status: 'available'
    },
    {
      id: 'excel-to-pdf',
      title: 'Excel to PDF',
      category: 'PDF Tools',
      link: '/pdf/excel-to-pdf',
      desc: 'Convert Excel spreadsheets (.xlsx, .xls) to PDF format. Preserve tables, data, and formatting. Batch processing supported. Free for files up to 10MB.',
      searchVolume: 250000
    },
    {
      id: 'powerpoint-to-pdf',
      title: 'PowerPoint to PDF',
      category: 'PDF Tools',
      link: '/pdf/powerpoint-to-pdf',
      desc: 'Convert PowerPoint presentations (.pptx, .ppt) to PDF format. Preserve slides, text, and formatting. Batch processing supported. Free for files up to 10MB.',
      searchVolume: 200000
    },
    {
      id: 'pdf-to-powerpoint',
      title: 'PDF to PowerPoint',
      category: 'PDF Tools',
      link: '/pdf/pdf-to-powerpoint',
      desc: 'Convert PDF documents to editable PowerPoint presentations (.pptx). Extract pages as slides. Perfect for creating presentations from PDF documents. Preserves layout and images.',
      searchVolume: 150000,
      status: 'coming-soon'
    },
    {
      id: 'image-to-pdf',
      title: 'Image to PDF',
      category: 'PDF Tools',
      link: '/pdf/image-to-pdf',
      desc: 'Convert images (JPG, PNG, GIF, WebP, BMP) to PDF format. Combine multiple images into a single PDF. Perfect for creating PDFs from photos or screenshots. Works entirely in your browser with payment support for large files and batch processing.',
      searchVolume: 180000
    },
    {
      id: 'pdf-to-txt',
      title: 'PDF to TXT',
      category: 'PDF Tools',
      link: '/pdf/pdf-to-txt',
      desc: 'Extract text from PDF files to plain text format. Convert PDF documents to .txt files. Perfect for text extraction and content reuse. Preserves text content only.',
      searchVolume: 100000,
      status: 'coming-soon'
    },
    {
      id: 'txt-to-pdf',
      title: 'TXT to PDF',
      category: 'PDF Tools',
      link: '/pdf/txt-to-pdf',
      desc: 'Convert text files (.txt) to PDF format. Create PDFs from plain text documents. Perfect for converting notes, documents, or code to PDF. Batch processing supported for paid users.',
      searchVolume: 80000
    },
    {
      id: 'pdf-to-html',
      title: 'PDF to HTML',
      category: 'PDF Tools',
      link: '/pdf/pdf-to-html',
      desc: 'Convert PDF documents to HTML format. Extract content and structure for web use. Perfect for converting PDFs to web pages. Preserves text and basic formatting.',
      searchVolume: 60000,
      status: 'coming-soon'
    },
    {
      id: 'html-to-pdf',
      title: 'HTML to PDF',
      category: 'PDF Tools',
      link: '/pdf/html-to-pdf',
      desc: 'Convert HTML files or web pages to PDF format. Create PDFs from HTML content. Perfect for saving web pages as PDFs. Preserves styling and layout.',
      searchVolume: 90000,
      status: 'coming-soon'
    },
    
    // 🔒 Security & Protection Tools
    {
      id: 'password-protect-pdf',
      title: 'Password Protect PDF',
      category: 'PDF Tools',
      link: '/pdf/password-protect-pdf',
      desc: 'Add password protection to PDF files. Secure your documents with encryption. Set user and owner passwords. Perfect for protecting sensitive documents. Works entirely in your browser.',
      searchVolume: 180000,
      status: 'coming-soon'
    },
    {
      id: 'unlock-pdf',
      title: 'Unlock PDF',
      category: 'PDF Tools',
      link: '/pdf/unlock-pdf',
      desc: 'Remove password protection from PDF files. Unlock encrypted PDFs with the correct password. Perfect for accessing protected documents. Batch processing supported for paid users.',
      searchVolume: 150000,
      status: 'active'
    },
    {
      id: 'watermark-pdf',
      title: 'Watermark PDF',
      category: 'PDF Tools',
      link: '/pdf/watermark-pdf',
      desc: 'Add text or image watermarks to PDF files. Protect your documents with custom watermarks. Perfect for branding or copyright protection. Works entirely in your browser.',
      searchVolume: 120000,
      status: 'coming-soon'
    },
    {
      id: 'sign-pdf',
      title: 'Sign PDF',
      category: 'PDF Tools',
      link: '/pdf/sign-pdf',
      desc: 'Add electronic signatures to PDF documents. Sign PDFs with digital signatures or drawn signatures. Perfect for contracts and agreements. Works entirely in your browser.',
      searchVolume: 200000,
      status: 'coming-soon'
    },
    
    // ✏️ Editing & Manipulation Tools
    {
      id: 'edit-pdf',
      title: 'Edit PDF',
      category: 'PDF Tools',
      link: '/pdf/edit-pdf',
      desc: 'Edit text and images in PDF files. Modify PDF content directly. Add, remove, or change text and images. Perfect for making quick edits to PDF documents.',
      searchVolume: 250000,
      status: 'coming-soon'
    },
    {
      id: 'add-page-numbers',
      title: 'Add Page Numbers',
      category: 'PDF Tools',
      link: '/pdf/add-page-numbers',
      desc: 'Add page numbers to PDF documents. Customize page number format, position, and style. Perfect for professional documents. Works entirely in your browser.',
      searchVolume: 90000,
      status: 'coming-soon'
    },
    {
      id: 'reorder-pdf-pages',
      title: 'Reorder PDF Pages',
      category: 'PDF Tools',
      link: '/pdf/reorder-pdf-pages',
      desc: 'Change the order of pages in PDF files. Drag and drop to reorder pages. Perfect for organizing PDF documents. Works entirely in your browser.',
      searchVolume: 80000,
      status: 'coming-soon'
    },
    {
      id: 'delete-pdf-pages',
      title: 'Delete PDF Pages',
      category: 'PDF Tools',
      link: '/pdf/delete-pdf-pages',
      desc: 'Remove pages from PDF files. Delete specific pages or page ranges. Perfect for cleaning up PDF documents. Batch processing supported for paid users.',
      searchVolume: 70000
    },
    {
      id: 'extract-pdf-pages',
      title: 'Extract PDF Pages',
      category: 'PDF Tools',
      link: '/pdf/extract-pdf-pages',
      desc: 'Extract specific pages from PDF files. Create new PDFs from selected pages. Perfect for extracting important sections. Works entirely in your browser.',
      searchVolume: 60000,
      status: 'active'
    },
    
    // 📝 Annotation & Collaboration Tools
    {
      id: 'annotate-pdf',
      title: 'Annotate PDF',
      category: 'PDF Tools',
      link: '/pdf/annotate-pdf',
      desc: 'Add annotations, comments, and notes to PDF files. Mark up PDFs with text, shapes, and highlights. Perfect for reviewing and collaborating on documents.',
      searchVolume: 100000,
      status: 'coming-soon'
    },
    {
      id: 'highlight-pdf',
      title: 'Highlight PDF',
      category: 'PDF Tools',
      link: '/pdf/highlight-pdf',
      desc: 'Highlight text in PDF documents. Mark important sections with colored highlights. Perfect for studying and reviewing documents. Works entirely in your browser.',
      searchVolume: 80000,
      status: 'active'
    },
    {
      id: 'add-comments-pdf',
      title: 'Add Comments to PDF',
      category: 'PDF Tools',
      link: '/pdf/add-comments-pdf',
      desc: 'Add comments and notes to PDF files. Collaborate on documents with comments. Perfect for feedback and reviews. Works entirely in your browser.',
      searchVolume: 60000,
      status: 'active'
    },
    
    // 🔍 Advanced Features
    {
      id: 'ocr-pdf',
      title: 'OCR PDF',
      category: 'PDF Tools',
      link: '/pdf/ocr-pdf',
      desc: 'Extract text from scanned PDFs and image-based PDFs using OCR technology. Convert scanned documents to editable, searchable text. Works 100% in your browser.',
      searchVolume: 400000
    },
    {
      id: 'make-pdf-searchable',
      title: 'Make PDF Searchable',
      category: 'PDF Tools',
      link: '/pdf/make-pdf-searchable',
      desc: 'Make scanned or image-based PDFs searchable by adding invisible text layer using OCR. Enable text search, selection, and copying. Batch processing supported. Free for files up to 10MB.',
      searchVolume: 150000
    },
    {
      id: 'optimize-pdf',
      title: 'Optimize PDF',
      category: 'PDF Tools',
      link: '/pdf/optimize-pdf',
      desc: 'Optimize PDF files for web, email, or storage. Reduce file size while maintaining quality. Remove unused resources and optimize structure. Batch processing supported. Free for files up to 10MB.',
      searchVolume: 120000
    },
    {
      id: 'repair-pdf',
      title: 'Repair PDF',
      category: 'PDF Tools',
      link: '/pdf/repair-pdf',
      desc: 'Repair corrupted or damaged PDF files. Extract valid pages and rebuild clean PDFs. Fix PDF errors and restore functionality. Batch processing supported. Free for files up to 10MB.',
      searchVolume: 90000
    }
  ];
  
  return {
    props: {
      tools: tools || [],
    },
  };
}


