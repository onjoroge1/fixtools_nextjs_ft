import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import Data from '@/dbTools';

const siteHost = process.env.NEXT_PUBLIC_HOST || 'https://fixtools.io';

export default function HTMLToolsCategory({ tools }) {
  const currentYear = new Date().getFullYear();
  const canonicalUrl = `${siteHost}/tools/html`;

  // Structured Data Schemas
  const structuredData = {
    // CollectionPage Schema for Google Sitelinks
    collectionPage: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "HTML Tools – Format, Minify, Validate & Generate HTML Online | FixTools",
      "description": "Free online HTML tools for developers. Format, minify, validate, and generate HTML code instantly. All tools work 100% in your browser.",
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
          "name": "HTML Tools",
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
          "name": "What are HTML tools?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "HTML tools are online utilities that help developers work with HTML (HyperText Markup Language) code. They include formatters to beautify HTML, minifiers to compress files, validators to check syntax, and generators to create HTML elements quickly."
          }
        },
        {
          "@type": "Question",
          "name": "Are these HTML tools free to use?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, all our HTML tools are 100% free to use. There's no registration required, no account needed, and no hidden fees. All processing happens in your browser, so your data never leaves your device."
          }
        },
        {
          "@type": "Question",
          "name": "Do HTML tools work offline?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, once the page loads, all our HTML tools work entirely in your browser using JavaScript. No internet connection is needed after the initial page load. This ensures fast processing and complete privacy."
          }
        },
        {
          "@type": "Question",
          "name": "What's the difference between HTML formatting and HTML minifying?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "HTML formatting adds whitespace and indentation to make HTML readable for humans. HTML minifying removes all unnecessary whitespace, comments, and optimizes code to reduce file size. Use formatting for development and debugging, and minifying for production to optimize page load speeds and improve SEO."
          }
        },
        {
          "@type": "Question",
          "name": "Can I generate HTML elements?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! We offer generators for various HTML elements including buttons, forms, images, links, iframes, and more. Simply fill in the options, and the tool generates clean, standards-compliant HTML code that you can copy and use immediately."
          }
        },
        {
          "@type": "Question",
          "name": "How do I validate HTML code?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Use our HTML Validator tool. Simply paste your HTML code, and it will check for syntax errors, missing closing tags, invalid attributes, and other issues. It provides detailed error messages with line numbers to help you fix problems quickly."
          }
        },
        {
          "@type": "Question",
          "name": "Is my HTML code secure when using these tools?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Absolutely. All HTML tools process code entirely in your browser using client-side JavaScript. Your HTML never leaves your device, isn't sent to any server, and isn't stored anywhere. This ensures complete privacy and security."
          }
        },
        {
          "@type": "Question",
          "name": "Why should I minify HTML for production?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Minifying HTML reduces file size, which improves page load speed and Core Web Vitals scores. According to Google, faster pages rank higher in search results and provide better user experience. Minified HTML can reduce file size by 20-50%."
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
        <title>HTML Tools – Format, Minify, Validate & Generate HTML Online | FixTools</title>
        <meta name="title" content="HTML Tools – Format, Minify, Validate & Generate HTML Online | FixTools" />
        <meta name="description" content="Free online HTML tools for developers. Format, minify, validate, and generate HTML code instantly. {tools.length} tools including HTML formatter, minifier, validator, and element generators. Works 100% in your browser - fast, secure, no registration required." />
        <meta name="keywords" content="html tools, html formatter, html minifier, html validator, html generator, html beautifier, minify html, format html, validate html, free html tools, online html tools" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        {/* Canonical URL */}
        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content="HTML Tools – Format, Minify, Validate & Generate HTML Online" />
        <meta property="og:description" content="Free online HTML tools for developers. Format, minify, validate, and generate HTML code instantly." />
        <meta property="og:image" content={`${siteHost}/images/html-tools-og.png`} />
        <meta property="og:site_name" content="FixTools" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content="HTML Tools – Format, Minify, Validate & Generate HTML Online" />
        <meta property="twitter:description" content="Free online HTML tools for developers. Format, minify, validate, and generate HTML code instantly." />
        <meta property="twitter:image" content={`${siteHost}/images/html-tools-og.png`} />
        
        {/* Structured Data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.collectionPage) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.breadcrumb) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.faqPage) }} />
      </Head>

      <style jsx global>{`
        html:has(.html-tools-category) {
          font-size: 100% !important;
        }
        
        .html-tools-category {
          line-height: 1.5;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          width: 100%;
          min-height: 100vh;
        }
        
        .html-tools-category *,
        .html-tools-category *::before,
        .html-tools-category *::after {
          box-sizing: border-box;
        }
        
        .html-tools-category h1,
        .html-tools-category h2,
        .html-tools-category h3,
        .html-tools-category p,
        .html-tools-category ul,
        .html-tools-category ol {
          margin: 0;
        }
        
        .html-tools-category button {
          font-family: inherit;
          cursor: pointer;
        }
        
        .html-tools-category input,
        .html-tools-category textarea,
        .html-tools-category select {
          font-family: inherit;
        }
      `}</style>

      <div className="html-tools-category bg-[#fbfbfc] text-slate-900 min-h-screen">
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
              <span className="font-semibold text-slate-900">HTML Tools</span>
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
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-1.5 text-xs font-semibold text-blue-700 shadow-sm mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              {tools.length} Free Tools • 100% Client-Side • No Sign-Up
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
                HTML Tools
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 max-w-3xl leading-relaxed mb-8">
              Professional <strong>HTML tools</strong> for developers. Format, minify, validate, and generate HTML code instantly. 
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
            <h2 className="text-2xl font-bold text-slate-900 mb-2">All HTML Tools</h2>
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
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30 transition-transform duration-300 group-hover:scale-110">
                    <span className="text-2xl">📄</span>
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

        {/* What is HTML Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">What is HTML?</h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                <strong>HTML (HyperText Markup Language)</strong> is the standard markup language for creating web pages and web applications. HTML describes the structure of a web page semantically and originally included cues for its appearance. According to <a href="https://developer.mozilla.org/en-US/docs/Web/HTML" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-800 font-semibold underline">MDN Web Docs</a>, 
                HTML is one of the three core technologies of the World Wide Web, alongside CSS and JavaScript.
              </p>

              <p className="text-base text-slate-700 leading-relaxed mb-4">
                HTML elements are the building blocks of web pages. They tell browsers how to display content, from headings and paragraphs to images, links, forms, and interactive elements. Modern HTML5 includes semantic elements like <code className="bg-slate-100 px-2 py-1 rounded text-sm">&lt;header&gt;</code>, <code className="bg-slate-100 px-2 py-1 rounded text-sm">&lt;nav&gt;</code>, <code className="bg-slate-100 px-2 py-1 rounded text-sm">&lt;article&gt;</code>, and <code className="bg-slate-100 px-2 py-1 rounded text-sm">&lt;footer&gt;</code> that improve SEO and accessibility. 
                According to <a href="https://web.dev/learn/html/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-800 font-semibold underline">Google</a>, 
                well-structured HTML is essential for search engine optimization and user experience.
              </p>

              <p className="text-base text-slate-700 leading-relaxed mb-4">
                HTML tools help developers write cleaner, more efficient code. Formatters improve readability, minifiers optimize file size for production, validators catch errors early, and generators speed up development by creating boilerplate code automatically.
              </p>

              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">HTML Example</h3>
                  <pre className="text-xs bg-slate-900 text-blue-400 p-4 rounded-lg overflow-x-auto font-mono"><code>{`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My Page</title>
</head>
<body>
  <header>
    <h1>Welcome</h1>
  </header>
  <main>
    <p>Hello, World!</p>
  </main>
</body>
</html>`}</code></pre>
                </div>

                <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Why HTML Tools?</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">✓</span>
                      <span>Improve code readability</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">✓</span>
                      <span>Optimize for performance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">✓</span>
                      <span>Catch errors before deployment</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">✓</span>
                      <span>Generate code faster</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">✓</span>
                      <span>Ensure standards compliance</span>
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
              <div className="h-1 w-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">How to Use These Tools</h2>
            </div>
            
            <p className="text-base text-slate-600 mb-6 leading-relaxed">
              Our HTML tools are designed to be simple and intuitive. Follow these steps to get started:
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-xl shadow-lg mb-4">
                  1
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Choose Your Tool</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Select the HTML tool you need from the grid above. Format, minify, validate, or generate HTML code.
                </p>
              </div>

              <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white font-bold text-xl shadow-lg mb-4">
                  2
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Paste or Generate</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  For formatters/minifiers, paste your HTML code. For generators, fill in the options to create HTML elements.
                </p>
              </div>

              <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 text-white font-bold text-xl shadow-lg mb-4">
                  3
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Copy & Use</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Copy the processed or generated HTML code and use it in your project. All processing happens in your browser.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
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
  // Filter tools for HTML category
  const tools = (Data || []).filter((tool) => tool.category === 'HTML Tools');
  
  return {
    props: {
      tools,
    },
  };
}



