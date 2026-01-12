import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import Data from '@/dbTools';

const siteHost = process.env.NEXT_PUBLIC_HOST || 'https://fixtools.io';

export default function CSSToolsCategory({ tools }) {
  const currentYear = new Date().getFullYear();
  const canonicalUrl = `${siteHost}/tools/css`;

  // Structured Data Schemas
  const structuredData = {
    // CollectionPage Schema for Google Sitelinks
    collectionPage: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "CSS Tools – Generate, Format, Minify & Optimize CSS Online | FixTools",
      "description": "Free online CSS tools for developers. Generate gradients, shadows, borders, and more. Format, minify, and optimize CSS code instantly. All tools work 100% in your browser.",
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
          "name": "CSS Tools",
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
          "name": "What are CSS tools?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "CSS tools are online utilities that help developers create, format, minify, and optimize CSS (Cascading Style Sheets) code. They include visual generators for gradients, shadows, borders, and other CSS properties, as well as formatters and minifiers to improve code quality and performance."
          }
        },
        {
          "@type": "Question",
          "name": "Are these CSS tools free to use?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, all our CSS tools are 100% free to use. There's no registration required, no account needed, and no hidden fees. All processing happens in your browser, so your data never leaves your device."
          }
        },
        {
          "@type": "Question",
          "name": "Do CSS tools work offline?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, once the page loads, all our CSS tools work entirely in your browser using JavaScript. No internet connection is needed after the initial page load. This ensures fast processing and complete privacy."
          }
        },
        {
          "@type": "Question",
          "name": "What's the difference between CSS formatting and CSS minifying?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "CSS formatting adds whitespace and indentation to make CSS readable for humans. CSS minifying removes all unnecessary whitespace, comments, and optimizes code to reduce file size. Use formatting for development and debugging, and minifying for production to optimize page load speeds."
          }
        },
        {
          "@type": "Question",
          "name": "Can I generate CSS code visually?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! We offer visual generators for CSS gradients, box shadows, text shadows, borders, border radius, and many other properties. Simply adjust the controls, see the preview in real-time, and copy the generated CSS code."
          }
        },
        {
          "@type": "Question",
          "name": "How do I minify CSS for production?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Use our CSS Minifier tool. Simply paste your CSS code, and it will remove all unnecessary whitespace, comments, and optimize the code. This reduces file size and improves page load performance, which is crucial for SEO and user experience."
          }
        },
        {
          "@type": "Question",
          "name": "Is my CSS code secure when using these tools?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Absolutely. All CSS tools process code entirely in your browser using client-side JavaScript. Your CSS never leaves your device, isn't sent to any server, and isn't stored anywhere. This ensures complete privacy and security."
          }
        },
        {
          "@type": "Question",
          "name": "What CSS properties can I generate?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our CSS tools can generate code for gradients, box shadows, text shadows, borders, border radius, transforms, filters, and many other CSS properties. All generators provide real-time previews and copy-ready CSS code."
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
        <title>CSS Tools – Generate, Format, Minify & Optimize CSS Online | FixTools</title>
        <meta name="title" content="CSS Tools – Generate, Format, Minify & Optimize CSS Online | FixTools" />
        <meta name="description" content="Free online CSS tools for developers. Generate gradients, shadows, borders, and more. Format, minify, and optimize CSS code instantly. {tools.length} tools including CSS gradient generator, box shadow generator, formatter, and minifier. Works 100% in your browser - fast, secure, no registration required." />
        <meta name="keywords" content="css tools, css generator, css gradient generator, box shadow generator, css formatter, css minifier, css optimizer, border radius generator, text shadow generator, free css tools, online css tools" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        {/* Canonical URL */}
        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content="CSS Tools – Generate, Format, Minify & Optimize CSS Online" />
        <meta property="og:description" content="Free online CSS tools for developers. Generate gradients, shadows, borders, and more. Format, minify, and optimize CSS code instantly." />
        <meta property="og:image" content={`${siteHost}/images/css-tools-og.png`} />
        <meta property="og:site_name" content="FixTools" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content="CSS Tools – Generate, Format, Minify & Optimize CSS Online" />
        <meta property="twitter:description" content="Free online CSS tools for developers. Generate gradients, shadows, borders, and more." />
        <meta property="twitter:image" content={`${siteHost}/images/css-tools-og.png`} />
        
        {/* Structured Data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.collectionPage) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.breadcrumb) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.faqPage) }} />
      </Head>

      <style jsx global>{`
        html:has(.css-tools-category) {
          font-size: 100% !important;
        }
        
        .css-tools-category {
          line-height: 1.5;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          width: 100%;
          min-height: 100vh;
        }
        
        .css-tools-category *,
        .css-tools-category *::before,
        .css-tools-category *::after {
          box-sizing: border-box;
        }
        
        .css-tools-category h1,
        .css-tools-category h2,
        .css-tools-category h3,
        .css-tools-category p,
        .css-tools-category ul,
        .css-tools-category ol {
          margin: 0;
        }
        
        .css-tools-category button {
          font-family: inherit;
          cursor: pointer;
        }
        
        .css-tools-category input,
        .css-tools-category textarea,
        .css-tools-category select {
          font-family: inherit;
        }
      `}</style>

      <div className="css-tools-category bg-[#fbfbfc] text-slate-900 min-h-screen">
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
              <span className="font-semibold text-slate-900">CSS Tools</span>
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
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 px-4 py-1.5 text-xs font-semibold text-purple-700 shadow-sm mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
              {tools.length} Free Tools • 100% Client-Side • No Sign-Up
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                CSS Tools
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 max-w-3xl leading-relaxed mb-8">
              Professional <strong>CSS tools</strong> for developers. Generate gradients, shadows, borders, and more. Format, minify, and optimize CSS code instantly. 
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
            <h2 className="text-2xl font-bold text-slate-900 mb-2">All CSS Tools</h2>
            <p className="text-slate-600">Click any tool to get started — no registration required</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map((tool) => (
              <Link
                key={tool.link}
                href={tool.link}
                className="group block p-6 rounded-2xl border-2 border-slate-200 bg-white hover:border-purple-300 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg shadow-purple-500/30 transition-transform duration-300 group-hover:scale-110">
                    <span className="text-2xl">🎨</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 mb-1 group-hover:text-purple-600 transition-colors">
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

        {/* What is CSS Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">What is CSS?</h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                <strong>CSS (Cascading Style Sheets)</strong> is a stylesheet language used to describe the presentation of HTML and XML documents. CSS controls the visual appearance of web pages, including colors, fonts, layouts, spacing, animations, and responsive design. According to <a href="https://developer.mozilla.org/en-US/docs/Web/CSS" target="_blank" rel="noopener noreferrer" className="text-purple-700 hover:text-purple-800 font-semibold underline">MDN Web Docs</a>, 
                CSS is one of the core technologies of the World Wide Web, alongside HTML and JavaScript.
              </p>

              <p className="text-base text-slate-700 leading-relaxed mb-4">
                CSS allows developers to separate content (HTML) from presentation (styling), making websites easier to maintain and update. Modern CSS includes powerful features like Flexbox, Grid, CSS Variables, and animations that enable complex layouts and interactive designs. Major platforms like <a href="https://web.dev/learn/css/" target="_blank" rel="noopener noreferrer" className="text-purple-700 hover:text-purple-800 font-semibold underline">Google</a> 
                recommend optimizing CSS for performance, which is why tools like minifiers and formatters are essential for web development.
              </p>

              <p className="text-base text-slate-700 leading-relaxed mb-4">
                CSS generators help developers create complex styles visually without memorizing syntax. Tools like gradient generators, shadow generators, and border generators save time and ensure cross-browser compatibility by generating optimized, standards-compliant CSS code.
              </p>

              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="rounded-2xl border-2 border-purple-200 bg-purple-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">CSS Example</h3>
                  <pre className="text-xs bg-slate-900 text-purple-400 p-4 rounded-lg overflow-x-auto font-mono"><code>{`.button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  border-radius: 8px;
  padding: 12px 24px;
  color: white;
  font-weight: 600;
}`}</code></pre>
                </div>

                <div className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Why CSS Tools?</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">✓</span>
                      <span>Visual generators save time</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">✓</span>
                      <span>Ensure cross-browser compatibility</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">✓</span>
                      <span>Optimize code for performance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">✓</span>
                      <span>Learn CSS syntax through examples</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">✓</span>
                      <span>Generate production-ready code</span>
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
              <div className="h-1 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">How to Use These Tools</h2>
            </div>
            
            <p className="text-base text-slate-600 mb-6 leading-relaxed">
              Our CSS tools are designed to be simple and intuitive. Follow these steps to get started:
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 text-white font-bold text-xl shadow-lg mb-4">
                  1
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Choose Your Tool</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Select the CSS tool you need from the grid above. Generate gradients, shadows, format, or minify CSS code.
                </p>
              </div>

              <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-xl shadow-lg mb-4">
                  2
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Create or Paste CSS</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  For generators, adjust controls to see real-time previews. For formatters/minifiers, paste your CSS code.
                </p>
              </div>

              <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white font-bold text-xl shadow-lg mb-4">
                  3
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Copy & Use</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Copy the generated or processed CSS code and use it in your project. All processing happens in your browser.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
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
  // Filter tools for CSS category
  const tools = (Data || []).filter((tool) => tool.category === 'CSS Tools');
  
  return {
    props: {
      tools,
    },
  };
}



