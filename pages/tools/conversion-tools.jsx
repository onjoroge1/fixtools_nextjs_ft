import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import Data from '@/dbTools';

const siteHost = process.env.NEXT_PUBLIC_HOST || 'https://fixtools.io';

export default function ConversionToolsCategory({ tools }) {
  const currentYear = new Date().getFullYear();
  const canonicalUrl = `${siteHost}/tools/conversion-tools`;

  // Structured Data Schemas
  const structuredData = {
    // CollectionPage Schema for Google Sitelinks
    collectionPage: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Conversion Tools – Currency, Units, Temperature & Time Zone Converter Online | FixTools",
      "description": "Free online conversion tools for currency, units, temperature, pressure, volume, and time zones. Convert between different measurement systems instantly. All tools work 100% in your browser.",
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
          "name": "Conversion Tools",
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
          "name": "What are conversion tools?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Conversion tools are online utilities that convert values between different units, currencies, time zones, and measurement systems. They help you quickly convert currency, temperature, pressure, volume, length, weight, and other units without manual calculations."
          }
        },
        {
          "@type": "Question",
          "name": "Are these conversion tools free to use?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, all our conversion tools are 100% free to use. There's no registration required, no account needed, and no hidden fees. All processing happens in your browser, so your data never leaves your device."
          }
        },
        {
          "@type": "Question",
          "name": "Do conversion tools work offline?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, once the page loads, all our conversion tools work entirely in your browser using JavaScript. No internet connection is needed after the initial page load. This ensures fast processing and complete privacy."
          }
        },
        {
          "@type": "Question",
          "name": "Are currency conversion rates updated in real-time?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Currency conversion rates are typically updated periodically. For the most accurate real-time rates, check the tool's description. Most tools use standard conversion rates that are updated regularly to reflect current market values."
          }
        },
        {
          "@type": "Question",
          "name": "What units can I convert?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our conversion tools support currency, temperature (Celsius, Fahrenheit, Kelvin), pressure (PSI, bar, Pascal), volume (liters, gallons, cubic meters), length (meters, feet, inches), weight (kilograms, pounds), and time zones. Check each tool for specific supported units."
          }
        },
        {
          "@type": "Question",
          "name": "Is my data secure when using conversion tools?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Absolutely. All conversion tools process data entirely in your browser using client-side JavaScript. Your values and conversions never leave your device, aren't sent to any server, and aren't stored anywhere. This ensures complete privacy and security."
          }
        },
        {
          "@type": "Question",
          "name": "Can I convert multiple values at once?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Most conversion tools support single value conversion. For multiple conversions, you can use the tool multiple times. Each conversion is instant and requires no page reload."
          }
        },
        {
          "@type": "Question",
          "name": "Do I need to know conversion formulas?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No, our conversion tools handle all the calculations automatically. Simply enter your value, select the source and target units, and get instant results. No mathematical knowledge required."
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
        <title>Conversion Tools – Currency, Units, Temperature & Time Zone Converter Online | FixTools</title>
        <meta name="title" content="Conversion Tools – Currency, Units, Temperature & Time Zone Converter Online | FixTools" />
        <meta name="description" content={`Free online conversion tools for currency, units, temperature, pressure, volume, and time zones. ${tools.length} tools including currency converter, temperature converter, unit converter, and time zone converter. Convert between different measurement systems instantly. Works 100% in your browser - fast, secure, no registration required.`} />
        <meta name="keywords" content="conversion tools, currency converter, unit converter, temperature converter, time zone converter, pressure converter, volume converter, free conversion tools, online converter" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        {/* Canonical URL */}
        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content="Conversion Tools – Currency, Units, Temperature & Time Zone Converter Online" />
        <meta property="og:description" content={`Free online conversion tools for currency, units, temperature, and more. ${tools.length} tools available.`} />
        <meta property="og:image" content={`${siteHost}/images/conversion-tools-og.png`} />
        <meta property="og:site_name" content="FixTools" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content="Conversion Tools – Currency, Units, Temperature & Time Zone Converter Online" />
        <meta property="twitter:description" content={`Free online conversion tools for currency, units, temperature, and more.`} />
        <meta property="twitter:image" content={`${siteHost}/images/conversion-tools-og.png`} />
        
        {/* Structured Data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.collectionPage) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.breadcrumb) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.faqPage) }} />
      </Head>

      <style jsx global>{`
        html:has(.conversion-tools-category) {
          font-size: 100% !important;
        }
        
        .conversion-tools-category {
          line-height: 1.5;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          width: 100%;
          min-height: 100vh;
        }
        
        .conversion-tools-category *,
        .conversion-tools-category *::before,
        .conversion-tools-category *::after {
          box-sizing: border-box;
        }
        
        .conversion-tools-category h1,
        .conversion-tools-category h2,
        .conversion-tools-category h3,
        .conversion-tools-category p,
        .conversion-tools-category ul,
        .conversion-tools-category ol {
          margin: 0;
        }
        
        .conversion-tools-category button {
          font-family: inherit;
          cursor: pointer;
        }
        
        .conversion-tools-category input,
        .conversion-tools-category textarea,
        .conversion-tools-category select {
          font-family: inherit;
        }
      `}</style>

      <div className="conversion-tools-category bg-[#fbfbfc] text-slate-900 min-h-screen">
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
              <Link className="hover:text-slate-900 transition-colors" href="/tools/conversion-tools">Convert</Link>
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
              <span className="font-semibold text-slate-900">Conversion Tools</span>
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
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-gradient-to-r from-cyan-50 to-blue-50 px-4 py-1.5 text-xs font-semibold text-cyan-700 shadow-sm mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              {tools.length} Free Tools • 100% Client-Side • No Sign-Up
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Conversion Tools
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 max-w-3xl leading-relaxed mb-8">
              Professional <strong>conversion tools</strong> for currency, units, temperature, pressure, volume, and time zones. Convert between different measurement systems instantly. 
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
            <h2 className="text-2xl font-bold text-slate-900 mb-2">All Conversion Tools</h2>
            <p className="text-slate-600">Click any tool to get started — no registration required</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map((tool) => (
              <Link
                key={tool.link}
                href={tool.link}
                className="group block p-6 rounded-2xl border-2 border-slate-200 bg-white hover:border-cyan-300 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/30 transition-transform duration-300 group-hover:scale-110">
                    <span className="text-2xl">🔄</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 mb-1 group-hover:text-cyan-600 transition-colors">
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

        {/* What are Conversion Tools Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">What are Conversion Tools?</h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                <strong>Conversion tools</strong> are online utilities that convert values between different units, currencies, time zones, and measurement systems. They eliminate the need for manual calculations and help you quickly convert between metric and imperial units, different currencies, temperature scales, and more. According to <a href="https://www.nist.gov/pml/weights-and-measures/metric-si/si-units" target="_blank" rel="noopener noreferrer" className="text-cyan-700 hover:text-cyan-800 font-semibold underline">NIST</a>, 
                standardized unit conversions are essential for accurate measurements across industries.
              </p>

              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Our conversion tools support a wide range of conversions including currency (USD, EUR, GBP, and more), temperature (Celsius, Fahrenheit, Kelvin), pressure (PSI, bar, Pascal), volume (liters, gallons, cubic meters), length, weight, and time zones. All conversions use standard conversion factors and are calculated instantly in your browser. According to <a href="https://www.bipm.org/en/measurement-units/" target="_blank" rel="noopener noreferrer" className="text-cyan-700 hover:text-cyan-800 font-semibold underline">BIPM</a>, 
                the International System of Units (SI) provides the foundation for accurate conversions.
              </p>

              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Whether you're working on international projects, cooking with recipes from different countries, or simply need to convert units for daily tasks, our conversion tools make it easy and accurate.
              </p>

              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="rounded-2xl border-2 border-cyan-200 bg-cyan-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Conversion Types</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-600 font-bold mt-0.5">✓</span>
                      <span>Currency (USD, EUR, GBP, etc.)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-600 font-bold mt-0.5">✓</span>
                      <span>Temperature (Celsius, Fahrenheit, Kelvin)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-600 font-bold mt-0.5">✓</span>
                      <span>Pressure (PSI, bar, Pascal)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-600 font-bold mt-0.5">✓</span>
                      <span>Volume (liters, gallons, cubic meters)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-600 font-bold mt-0.5">✓</span>
                      <span>Time zones and more</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Why Conversion Tools?</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-600 font-bold mt-0.5">✓</span>
                      <span>Instant accurate conversions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-600 font-bold mt-0.5">✓</span>
                      <span>No manual calculations needed</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-600 font-bold mt-0.5">✓</span>
                      <span>Support for multiple unit systems</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-600 font-bold mt-0.5">✓</span>
                      <span>Works offline after page load</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-600 font-bold mt-0.5">✓</span>
                      <span>100% free and private</span>
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
              <div className="h-1 w-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">How to Use These Tools</h2>
            </div>
            
            <p className="text-base text-slate-600 mb-6 leading-relaxed">
              Our conversion tools are designed to be simple and intuitive. Follow these steps to get started:
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-bold text-xl shadow-lg mb-4">
                  1
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Choose Your Converter</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Select the conversion tool you need. Currency, temperature, pressure, volume, or time zone converter.
                </p>
              </div>

              <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-xl shadow-lg mb-4">
                  2
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Enter Your Value</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Enter the value you want to convert and select the source unit. For currency, select the source currency.
                </p>
              </div>

              <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white font-bold text-xl shadow-lg mb-4">
                  3
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Get Instant Results</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Select the target unit and get instant conversion results. All calculations happen in your browser.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"></div>
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
  // Filter tools for Conversion Tools category
  const tools = (Data || []).filter((tool) => tool.category === 'Conversion Tools');
  
  return {
    props: {
      tools,
    },
  };
}

