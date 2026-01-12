import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';

const siteHost = process.env.NEXT_PUBLIC_HOST || 'https://fixtools.io';

export default function UtilitiesCategory({ tools }) {
  const currentYear = new Date().getFullYear();
  const canonicalUrl = `${siteHost}/tools/utilities`;

  // Structured Data Schemas
  const structuredData = {
    // CollectionPage Schema for Google Sitelinks
    collectionPage: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Utility Tools – QR Code, Barcode, Password & URL Tools Online | FixTools",
      "description": "Free online utility tools for developers. Generate QR codes, barcodes, passwords, and encode/decode URLs instantly. All tools work 100% in your browser.",
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
          "name": "Utility Tools",
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
          "name": "What are utility tools?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Utility tools are online utilities that help with common tasks like generating QR codes, barcodes, passwords, and encoding/decoding URLs. These tools are essential for developers, marketers, and anyone who needs quick solutions for everyday tasks."
          }
        },
        {
          "@type": "Question",
          "name": "Are these utility tools free to use?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, all our utility tools are 100% free to use. There's no registration required, no account needed, and no hidden fees. All processing happens in your browser, so your data never leaves your device."
          }
        },
        {
          "@type": "Question",
          "name": "Do utility tools work offline?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, once the page loads, all our utility tools work entirely in your browser using JavaScript. No internet connection is needed after the initial page load. This ensures fast processing and complete privacy."
          }
        },
        {
          "@type": "Question",
          "name": "What can I generate with these tools?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our utility tools can generate QR codes for URLs, text, or contact information; barcodes in various formats; secure passwords with customizable options; and encode/decode URLs for safe transmission in web applications."
          }
        },
        {
          "@type": "Question",
          "name": "Is my data secure when using utility tools?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Absolutely. All utility tools process data entirely in your browser using client-side JavaScript. Your data never leaves your device, isn't sent to any server, and isn't stored anywhere. This ensures complete privacy and security."
          }
        },
        {
          "@type": "Question",
          "name": "Can I download QR codes and barcodes?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, all generated QR codes and barcodes can be downloaded as PNG or SVG images. You can use them in documents, websites, or print materials without any restrictions."
          }
        },
        {
          "@type": "Question",
          "name": "What password options are available?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our password generator allows you to customize length, include/exclude uppercase letters, lowercase letters, numbers, and special characters. You can also generate multiple passwords at once."
          }
        },
        {
          "@type": "Question",
          "name": "Do I need technical knowledge to use utility tools?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No, our utility tools are designed to be user-friendly and require no technical knowledge. Simply enter your input, adjust options if needed, and get instant results. All tools have clear instructions and examples."
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
        <title>Utility Tools – QR Code, Barcode, Password & URL Tools Online | FixTools</title>
        <meta name="title" content="Utility Tools – QR Code, Barcode, Password & URL Tools Online | FixTools" />
        <meta name="description" content={`Free online utility tools for developers. ${tools.length} tools including QR code generator, barcode generator, password generator, and URL encoder/decoder. Generate QR codes, barcodes, passwords, and encode URLs instantly. Works 100% in your browser - fast, secure, no registration required.`} />
        <meta name="keywords" content="utility tools, qr code generator, barcode generator, password generator, url encoder, url decoder, free utility tools, online utility tools" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        {/* Canonical URL */}
        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content="Utility Tools – QR Code, Barcode, Password & URL Tools Online" />
        <meta property="og:description" content={`Free online utility tools for developers. ${tools.length} tools including QR code generator, barcode generator, and more.`} />
        <meta property="og:image" content={`${siteHost}/images/utilities-tools-og.png`} />
        <meta property="og:site_name" content="FixTools" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content="Utility Tools – QR Code, Barcode, Password & URL Tools Online" />
        <meta property="twitter:description" content={`Free online utility tools for developers. Generate QR codes, barcodes, passwords, and more.`} />
        <meta property="twitter:image" content={`${siteHost}/images/utilities-tools-og.png`} />
        
        {/* Structured Data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.collectionPage) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.breadcrumb) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.faqPage) }} />
      </Head>

      <style jsx global>{`
        html:has(.utilities-category) {
          font-size: 100% !important;
        }
        
        .utilities-category {
          line-height: 1.5;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          width: 100%;
          min-height: 100vh;
        }
        
        .utilities-category *,
        .utilities-category *::before,
        .utilities-category *::after {
          box-sizing: border-box;
        }
        
        .utilities-category h1,
        .utilities-category h2,
        .utilities-category h3,
        .utilities-category p,
        .utilities-category ul,
        .utilities-category ol {
          margin: 0;
        }
        
        .utilities-category button {
          font-family: inherit;
          cursor: pointer;
        }
        
        .utilities-category input,
        .utilities-category textarea,
        .utilities-category select {
          font-family: inherit;
        }
      `}</style>

      <div className="utilities-category bg-[#fbfbfc] text-slate-900 min-h-screen">
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
              <Link className="hover:text-slate-900 transition-colors" href="/tools/utilities">Utilities</Link>
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
              <span className="font-semibold text-slate-900">Utility Tools</span>
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
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 px-4 py-1.5 text-xs font-semibold text-blue-700 shadow-sm mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              {tools.length} Free Tools • 100% Client-Side • No Sign-Up
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
                Utility Tools
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 max-w-3xl leading-relaxed mb-8">
              Professional <strong>utility tools</strong> for developers and marketers. Generate QR codes, barcodes, passwords, and encode/decode URLs instantly. 
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

        {/* Tools Grid */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">All Utility Tools</h2>
            <p className="text-slate-600">Click any tool to get started — no registration required</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map((tool) => (
              <Link
                key={tool.link}
                href={tool.link}
                className="group block p-6 rounded-2xl border-2 border-slate-200 bg-white hover:border-blue-300 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 shadow-lg shadow-blue-500/30 transition-transform duration-300 group-hover:scale-110">
                    <span className="text-2xl">🔧</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                      {tool.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {tool.desc}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* What are Utility Tools Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">What are Utility Tools?</h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                <strong>Utility tools</strong> are online utilities that help with common tasks like generating QR codes, barcodes, passwords, and encoding/decoding URLs. These tools are essential for developers building applications, marketers creating campaigns, and anyone who needs quick solutions for everyday tasks. According to <a href="https://developer.mozilla.org/en-US/docs/Web/API" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-800 font-semibold underline">MDN Web Docs</a>, 
                modern web APIs enable powerful client-side utilities that work entirely in the browser.
              </p>

              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Our utility tools use standard web technologies like Canvas API for QR codes and barcodes, Web Crypto API for secure password generation, and built-in JavaScript functions for URL encoding. All processing happens locally in your browser, ensuring complete privacy and security. According to <a href="https://www.w3.org/TR/encoding/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-800 font-semibold underline">W3C Encoding Standards</a>, 
                URL encoding is a fundamental part of web development.
              </p>

              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Whether you're generating QR codes for marketing materials, creating secure passwords for accounts, or encoding URLs for API requests, our utility tools make it fast and easy. All tools are free, require no registration, and work instantly in your browser.
              </p>

              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Utility Tool Types</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">✓</span>
                      <span>QR Code Generator</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">✓</span>
                      <span>Barcode Generator</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">✓</span>
                      <span>Password Generator</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">✓</span>
                      <span>URL Encoder/Decoder</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">✓</span>
                      <span>And more utilities</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border-2 border-cyan-200 bg-cyan-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Why Utility Tools?</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">✓</span>
                      <span>Save time on repetitive tasks</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">✓</span>
                      <span>Generate professional codes instantly</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">✓</span>
                      <span>100% private and secure</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">✓</span>
                      <span>No registration required</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">✓</span>
                      <span>Works offline after page load</span>
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
              <div className="h-1 w-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">How to Use These Tools</h2>
            </div>
            
            <p className="text-base text-slate-600 mb-6 leading-relaxed">
              Our utility tools are designed to be simple and intuitive. Follow these steps to get started:
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 text-white font-bold text-xl shadow-lg mb-4">
                  1
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Choose Your Tool</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Select the utility tool you need. Generate QR codes, barcodes, passwords, or encode/decode URLs.
                </p>
              </div>

              <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-bold text-xl shadow-lg mb-4">
                  2
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Enter Your Input</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Enter your text, URL, or adjust settings. For QR codes, enter the content. For passwords, set your preferences.
                </p>
              </div>

              <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white font-bold text-xl shadow-lg mb-4">
                  3
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Get Instant Results</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Click generate and get instant results. Download QR codes/barcodes, copy passwords, or use encoded URLs.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
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
  // Define utility tools manually (they'll be added to dbTools later)
  const tools = [
    {
      id: 'qr-code-generator',
      title: 'QR Code Generator',
      category: 'Utility Tools',
      link: '/utilities/qr-code-generator',
      desc: 'Generate QR codes for URLs, text, contact information, and more. Download as PNG or SVG. Customize size, colors, and error correction level.'
    },
    {
      id: 'barcode-generator',
      title: 'Barcode Generator',
      category: 'Utility Tools',
      link: '/utilities/barcode-generator',
      desc: 'Generate barcodes in various formats (Code128, EAN, UPC, etc.). Download as PNG or SVG. Perfect for inventory, products, and labels.'
    },
    {
      id: 'password-generator',
      title: 'Password Generator',
      category: 'Utility Tools',
      link: '/utilities/password-generator',
      desc: 'Generate secure, random passwords with customizable length and character sets. Include uppercase, lowercase, numbers, and special characters.'
    },
    {
      id: 'url-encoder',
      title: 'URL Encoder',
      category: 'Utility Tools',
      link: '/utilities/url-encoder',
      desc: 'Encode URLs and text to URL-safe format. Converts special characters to percent-encoded format for safe transmission in web applications.'
    },
    {
      id: 'url-decoder',
      title: 'URL Decoder',
      category: 'Utility Tools',
      link: '/utilities/url-decoder',
      desc: 'Decode URL-encoded strings back to readable text. Converts percent-encoded characters to their original form for easy reading.'
    }
  ];
  
  return {
    props: {
      tools,
    },
  };
}


