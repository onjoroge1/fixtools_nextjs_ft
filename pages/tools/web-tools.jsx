import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import Data from '@/dbTools';

const siteHost = process.env.NEXT_PUBLIC_HOST || 'https://fixtools.io';

export default function WebToolsCategory({ tools }) {
  const currentYear = new Date().getFullYear();
  const canonicalUrl = `${siteHost}/tools/web-tools`;

  // Structured Data Schemas
  const structuredData = {
    // CollectionPage Schema for Google Sitelinks
    collectionPage: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Web Tools – Website Screenshot, Performance & Analysis Online | FixTools",
      "description": "Free online web tools for website analysis, screenshots, and performance testing. Take website screenshots, analyze performance, and test websites instantly. All tools work 100% in your browser.",
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
          "name": "Web Tools",
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
          "name": "What are web tools?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Web tools are online utilities that help analyze, test, and interact with websites. They include website screenshot tools, performance analyzers, and other utilities that help you understand and work with web pages and websites."
          }
        },
        {
          "@type": "Question",
          "name": "Are these web tools free to use?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, all our web tools are 100% free to use. There's no registration required, no account needed, and no hidden fees. Some tools require server-side processing for screenshots, but basic features work in your browser."
          }
        },
        {
          "@type": "Question",
          "name": "How do website screenshot tools work?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Website screenshot tools use headless browsers (like Playwright or Puppeteer) to render web pages on a server and capture them as images or PDFs. This allows you to take screenshots of any publicly accessible website URL and download them in various formats."
          }
        },
        {
          "@type": "Question",
          "name": "Can I screenshot any website?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "You can screenshot most publicly accessible websites (HTTP and HTTPS). However, websites behind authentication, localhost URLs, or private networks cannot be accessed. Some websites may also block automated screenshot tools."
          }
        },
        {
          "@type": "Question",
          "name": "Is my data secure when using web tools?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, all web tools are designed with privacy in mind. Screenshot tools only access the URLs you provide and don't store them. We don't log your requests or share your data with third parties."
          }
        },
        {
          "@type": "Question",
          "name": "What formats are supported for website screenshots?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Website screenshot tools typically support PNG (image) and PDF formats. PNG is best for images and sharing, while PDF is ideal for documentation and archiving. Some tools also support JPEG format."
          }
        },
        {
          "@type": "Question",
          "name": "Can I use these tools for multiple websites?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, you can use our web tools for as many websites as you need. There are usage limits to prevent abuse, but normal usage allows you to test and screenshot multiple websites without restrictions."
          }
        },
        {
          "@type": "Question",
          "name": "Do I need technical knowledge to use web tools?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No, our web tools are designed to be user-friendly. Simply enter a website URL, choose your options, and the tool will generate the screenshot or analysis for you. No coding or technical expertise required."
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
        <title>Web Tools – Website Screenshot, Performance & Analysis Online | FixTools</title>
        <meta name="title" content="Web Tools – Website Screenshot, Performance & Analysis Online | FixTools" />
        <meta name="description" content={`Free online web tools for website analysis and screenshots. ${tools.length} tools including website screenshot, performance testing, and more. Take website screenshots, analyze performance, and test websites instantly. Works 100% in your browser - fast, secure, no registration required.`} />
        <meta name="keywords" content="web tools, website screenshot, webpage screenshot, website analyzer, page screenshot online, website performance, free web tools, online web tools" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        {/* Canonical URL */}
        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content="Web Tools – Website Screenshot, Performance & Analysis Online" />
        <meta property="og:description" content={`Free online web tools for website analysis. ${tools.length} tools including website screenshot and more.`} />
        <meta property="og:image" content={`${siteHost}/images/web-tools-og.png`} />
        <meta property="og:site_name" content="FixTools" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content="Web Tools – Website Screenshot, Performance & Analysis Online" />
        <meta property="twitter:description" content={`Free online web tools for website analysis. Take website screenshots and analyze performance.`} />
        <meta property="twitter:image" content={`${siteHost}/images/web-tools-og.png`} />
        
        {/* Structured Data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.collectionPage) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.breadcrumb) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.faqPage) }} />
      </Head>

      <style jsx global>{`
        html:has(.web-tools-category) {
          font-size: 100% !important;
        }
        
        .web-tools-category {
          line-height: 1.5;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          width: 100%;
          min-height: 100vh;
        }
        
        .web-tools-category *,
        .web-tools-category *::before,
        .web-tools-category *::after {
          box-sizing: border-box;
        }
        
        .web-tools-category h1,
        .web-tools-category h2,
        .web-tools-category h3,
        .web-tools-category p,
        .web-tools-category ul,
        .web-tools-category ol {
          margin: 0;
        }
        
        .web-tools-category button {
          font-family: inherit;
          cursor: pointer;
        }
        
        .web-tools-category input,
        .web-tools-category textarea,
        .web-tools-category select {
          font-family: inherit;
        }
      `}</style>

      <div className="web-tools-category bg-[#fbfbfc] text-slate-900 min-h-screen">
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
              <Link className="hover:text-slate-900 transition-colors" href="/tools/web-tools">Web Tools</Link>
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
              <span className="font-semibold text-slate-900">Web Tools</span>
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
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-gradient-to-r from-violet-50 to-purple-50 px-4 py-1.5 text-xs font-semibold text-violet-700 shadow-sm mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
              </span>
              {tools.length} Free Tools • Fast • Secure
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-violet-600 bg-clip-text text-transparent">
                Web Tools
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 max-w-3xl leading-relaxed mb-8">
              Professional <strong>web tools</strong> for website analysis and testing. Take website screenshots, analyze performance, and test websites instantly. 
              Fast, secure, and easy to use. No registration required.
            </p>

            {/* Stats */}
            <dl className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Tools</dt>
                <dd className="mt-1.5 text-2xl font-bold text-slate-900">{tools.length}</dd>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Processing</dt>
                <dd className="mt-1.5 text-2xl font-bold text-slate-900">Server-Side</dd>
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

        {/* All Tools Grid */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">All Web Tools</h2>
            <p className="text-slate-600">Complete list of all available web tools</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map((tool) => {
              const getToolIcon = (title, link) => {
                const lowerTitle = title.toLowerCase();
                const lowerLink = link.toLowerCase();
                
                // Screenshot
                if (lowerTitle.includes('screenshot') || lowerLink.includes('screenshot')) {
                  return { icon: '📸', color: 'from-violet-500 to-purple-600', shadow: 'shadow-violet-500/30' };
                }
                // Speed Test / Performance
                if (lowerTitle.includes('speed') || lowerTitle.includes('performance') || lowerLink.includes('speed')) {
                  return { icon: '⚡', color: 'from-violet-500 to-purple-600', shadow: 'shadow-violet-500/30' };
                }
                // SSL Certificate
                if (lowerTitle.includes('ssl') || lowerLink.includes('ssl')) {
                  return { icon: '🔒', color: 'from-violet-500 to-purple-600', shadow: 'shadow-violet-500/30' };
                }
                // DNS
                if (lowerTitle.includes('dns') || lowerLink.includes('dns')) {
                  return { icon: '🌐', color: 'from-violet-500 to-purple-600', shadow: 'shadow-violet-500/30' };
                }
                // HTTP Headers
                if (lowerTitle.includes('header') || lowerLink.includes('header')) {
                  return { icon: '📋', color: 'from-violet-500 to-purple-600', shadow: 'shadow-violet-500/30' };
                }
                // Uptime Monitor
                if (lowerTitle.includes('uptime') || lowerLink.includes('uptime')) {
                  return { icon: '⏱️', color: 'from-violet-500 to-purple-600', shadow: 'shadow-violet-500/30' };
                }
                // Accessibility
                if (lowerTitle.includes('accessibility') || lowerLink.includes('accessibility')) {
                  return { icon: '♿', color: 'from-violet-500 to-purple-600', shadow: 'shadow-violet-500/30' };
                }
                // Broken Links
                if (lowerTitle.includes('broken') || lowerTitle.includes('link') || lowerLink.includes('broken')) {
                  return { icon: '🔗', color: 'from-violet-500 to-purple-600', shadow: 'shadow-violet-500/30' };
                }
                // Metadata
                if (lowerTitle.includes('metadata') || lowerTitle.includes('meta') || lowerLink.includes('metadata')) {
                  return { icon: '📊', color: 'from-violet-500 to-purple-600', shadow: 'shadow-violet-500/30' };
                }
                // Comparison
                if (lowerTitle.includes('comparison') || lowerLink.includes('comparison')) {
                  return { icon: '⚖️', color: 'from-violet-500 to-purple-600', shadow: 'shadow-violet-500/30' };
                }
                // Redirect
                if (lowerTitle.includes('redirect') || lowerLink.includes('redirect')) {
                  return { icon: '🔄', color: 'from-violet-500 to-purple-600', shadow: 'shadow-violet-500/30' };
                }
                // Traffic
                if (lowerTitle.includes('traffic') || lowerLink.includes('traffic')) {
                  return { icon: '📈', color: 'from-violet-500 to-purple-600', shadow: 'shadow-violet-500/30' };
                }
                // Analyzer (catch-all)
                if (lowerTitle.includes('analyzer') || lowerLink.includes('analyzer')) {
                  return { icon: '🔍', color: 'from-violet-500 to-purple-600', shadow: 'shadow-violet-500/30' };
                }
                // Default
                return { icon: '🌐', color: 'from-violet-500 to-purple-600', shadow: 'shadow-violet-500/30' };
              };
              
              const toolIcon = getToolIcon(tool.title, tool.link);
              
              return (
                <Link
                  key={tool.link}
                  href={tool.link}
                  className="group block p-6 rounded-2xl border-2 border-slate-200 bg-white hover:border-violet-300 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${toolIcon.color} shadow-lg ${toolIcon.shadow} transition-transform duration-300 group-hover:scale-110`}>
                      <span className="text-2xl">{toolIcon.icon}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-900 mb-1 group-hover:text-violet-600 transition-colors">
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

        {/* What are Web Tools Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">What are Web Tools?</h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                <strong>Web tools</strong> are online utilities that help you analyze, test, and interact with websites. They include website screenshot tools, performance analyzers, and other utilities that help you understand and work with web pages and websites. According to <a href="https://web.dev/" target="_blank" rel="noopener noreferrer" className="text-violet-700 hover:text-violet-800 font-semibold underline">Google Web.dev</a>, 
                web tools are essential for modern web development and testing.
              </p>

              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Web tools help automate and simplify website testing tasks. Website screenshot tools allow you to capture and save images of web pages for documentation, design review, or archiving. Performance analyzers help you understand how fast your website loads and identify optimization opportunities. According to <a href="https://developers.google.com/web/tools" target="_blank" rel="noopener noreferrer" className="text-violet-700 hover:text-violet-800 font-semibold underline">Google Web Tools</a>, 
                these tools are crucial for building fast, reliable websites.
              </p>

              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Our web tools are designed to be accessible to both beginners and experienced developers. They generate high-quality screenshots and analysis that you can immediately use to improve your website or document your work.
              </p>

              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="rounded-2xl border-2 border-violet-200 bg-violet-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Web Tools Essentials</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-violet-600 font-bold mt-0.5">✓</span>
                      <span>Website screenshots for documentation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-violet-600 font-bold mt-0.5">✓</span>
                      <span>Performance analysis and testing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-violet-600 font-bold mt-0.5">✓</span>
                      <span>Website testing and validation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-violet-600 font-bold mt-0.5">✓</span>
                      <span>PNG and PDF export formats</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-violet-600 font-bold mt-0.5">✓</span>
                      <span>Full-page screenshot support</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Why Web Tools?</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-violet-600 font-bold mt-0.5">✓</span>
                      <span>Save time on manual testing tasks</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-violet-600 font-bold mt-0.5">✓</span>
                      <span>Document website designs instantly</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-violet-600 font-bold mt-0.5">✓</span>
                      <span>Test website performance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-violet-600 font-bold mt-0.5">✓</span>
                      <span>Generate high-quality screenshots</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-violet-600 font-bold mt-0.5">✓</span>
                      <span>No technical expertise needed</span>
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
              <div className="h-1 w-8 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">How to Use These Tools</h2>
            </div>
            
            <p className="text-base text-slate-600 mb-6 leading-relaxed">
              Our web tools are designed to be simple and intuitive. Follow these steps to get started:
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white font-bold text-xl shadow-lg mb-4">
                  1
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Choose Your Tool</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Select the web tool you need. Take website screenshots, analyze performance, or test websites.
                </p>
              </div>

              <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-xl shadow-lg mb-4">
                  2
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Enter Website URL</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Enter the website URL you want to screenshot or analyze. Choose your options like format and dimensions.
                </p>
              </div>

              <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white font-bold text-xl shadow-lg mb-4">
                  3
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Download & Use</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Download your screenshot or analysis results. Use them for documentation, design review, or testing.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full"></div>
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
  // Filter tools for Web Tools category
  const tools = (Data || []).filter((tool) => tool.category === 'Web Tools');
  
  return {
    props: {
      tools,
    },
  };
}

