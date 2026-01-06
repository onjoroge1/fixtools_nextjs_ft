import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import Data from '@/dbTools';

const siteHost = process.env.NEXT_PUBLIC_HOST || 'https://fixtools.io';

export default function SEOToolsCategory({ tools }) {
  const currentYear = new Date().getFullYear();
  const canonicalUrl = `${siteHost}/tools/seo-tools`;

  // Structured Data Schemas
  const structuredData = {
    // CollectionPage Schema for Google Sitelinks
    collectionPage: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "SEO Tools – Sitemap Generator, Meta Tags & SEO Optimization Online | FixTools",
      "description": "Free online SEO tools for search engine optimization. Generate sitemaps, create meta tags, inspect IP locations, and optimize your website for search engines. All tools work 100% in your browser.",
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
          "name": "SEO Tools",
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
          "name": "What are SEO tools?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "SEO tools are online utilities that help optimize websites for search engines. They include sitemap generators, meta tag generators, IP location checkers, robots.txt generators, and other tools that help improve search engine visibility and rankings."
          }
        },
        {
          "@type": "Question",
          "name": "Are these SEO tools free to use?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, all our SEO tools are 100% free to use. There's no registration required, no account needed, and no hidden fees. All processing happens in your browser, so your data never leaves your device."
          }
        },
        {
          "@type": "Question",
          "name": "Do SEO tools work offline?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, once the page loads, all our SEO tools work entirely in your browser using JavaScript. No internet connection is needed after the initial page load. This ensures fast processing and complete privacy."
          }
        },
        {
          "@type": "Question",
          "name": "What is a sitemap and why do I need one?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A sitemap is an XML file that lists all pages on your website, helping search engines discover and index your content. According to Google, sitemaps are especially important for large sites and can improve crawl efficiency. Our sitemap generator creates properly formatted XML sitemaps instantly."
          }
        },
        {
          "@type": "Question",
          "name": "How do meta tags affect SEO?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Meta tags provide information about your webpage to search engines. Title tags and meta descriptions appear in search results and can significantly impact click-through rates. Well-optimized meta tags help improve rankings and user engagement."
          }
        },
        {
          "@type": "Question",
          "name": "Is my website data secure when using SEO tools?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Absolutely. All SEO tools process data entirely in your browser using client-side JavaScript. Your website URLs, IP addresses, and other data never leave your device, aren't sent to any server, and aren't stored anywhere. This ensures complete privacy and security."
          }
        },
        {
          "@type": "Question",
          "name": "Can I use these SEO tools for multiple websites?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, you can use our SEO tools for as many websites as you need. There are no limits on usage, and all tools are free to use unlimited times. Generate sitemaps, meta tags, and other SEO assets for all your projects."
          }
        },
        {
          "@type": "Question",
          "name": "Do I need technical knowledge to use SEO tools?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No, our SEO tools are designed to be user-friendly. Simply enter your information, and the tools generate the necessary files or code. You can then copy and use the output in your website without needing deep technical knowledge."
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
        <title>SEO Tools – Sitemap Generator, Meta Tags & SEO Optimization Online | FixTools</title>
        <meta name="title" content="SEO Tools – Sitemap Generator, Meta Tags & SEO Optimization Online | FixTools" />
        <meta name="description" content={`Free online SEO tools for search engine optimization. ${tools.length} tools including sitemap generator, meta tag generator, IP location checker, and more. Generate sitemaps, create meta tags, and optimize your website for search engines. Works 100% in your browser - fast, secure, no registration required.`} />
        <meta name="keywords" content="seo tools, sitemap generator, meta tag generator, ip location checker, robots.txt generator, open graph generator, seo optimization, free seo tools, online seo tools" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        {/* Canonical URL */}
        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content="SEO Tools – Sitemap Generator, Meta Tags & SEO Optimization Online" />
        <meta property="og:description" content={`Free online SEO tools for search engine optimization. ${tools.length} tools including sitemap generator, meta tag generator, and more.`} />
        <meta property="og:image" content={`${siteHost}/images/seo-tools-og.png`} />
        <meta property="og:site_name" content="FixTools" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content="SEO Tools – Sitemap Generator, Meta Tags & SEO Optimization Online" />
        <meta property="twitter:description" content={`Free online SEO tools for search engine optimization. Generate sitemaps, create meta tags, and optimize your website.`} />
        <meta property="twitter:image" content={`${siteHost}/images/seo-tools-og.png`} />
        
        {/* Structured Data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.collectionPage) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.breadcrumb) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.faqPage) }} />
      </Head>

      <style jsx global>{`
        html:has(.seo-tools-category) {
          font-size: 100% !important;
        }
        
        .seo-tools-category {
          line-height: 1.5;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          width: 100%;
          min-height: 100vh;
        }
        
        .seo-tools-category *,
        .seo-tools-category *::before,
        .seo-tools-category *::after {
          box-sizing: border-box;
        }
        
        .seo-tools-category h1,
        .seo-tools-category h2,
        .seo-tools-category h3,
        .seo-tools-category p,
        .seo-tools-category ul,
        .seo-tools-category ol {
          margin: 0;
        }
        
        .seo-tools-category button {
          font-family: inherit;
          cursor: pointer;
        }
        
        .seo-tools-category input,
        .seo-tools-category textarea,
        .seo-tools-category select {
          font-family: inherit;
        }
      `}</style>

      <div className="seo-tools-category bg-[#fbfbfc] text-slate-900 min-h-screen">
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
              <Link className="hover:text-slate-900 transition-colors" href="/tools/seo-tools">SEO</Link>
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
              <span className="font-semibold text-slate-900">SEO Tools</span>
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
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 px-4 py-1.5 text-xs font-semibold text-amber-700 shadow-sm mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              {tools.length} Free Tools • 100% Client-Side • No Sign-Up
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-600 bg-clip-text text-transparent">
                SEO Tools
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 max-w-3xl leading-relaxed mb-8">
              Professional <strong>SEO tools</strong> for search engine optimization. Generate sitemaps, create meta tags, inspect IP locations, and optimize your website for search engines. 
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
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Popular SEO Tools</h2>
            <p className="text-slate-600">Most used tools for search engine optimization</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {tools
              .filter(tool => 
                tool.link.includes('site-map-generator') || 
                tool.link.includes('meta-tags') ||
                tool.link.includes('ip-location') ||
                tool.link.includes('robots-txt')
              )
              .map((tool) => {
                const getToolIcon = (title, link) => {
                  const lowerTitle = title.toLowerCase();
                  const lowerLink = link.toLowerCase();
                  
                  if (lowerTitle.includes('sitemap') || lowerLink.includes('sitemap')) {
                    return { icon: '🗺️', color: 'from-amber-500 to-yellow-600', shadow: 'shadow-amber-500/30' };
                  }
                  if (lowerTitle.includes('meta') || lowerLink.includes('meta-tags')) {
                    return { icon: '🏷️', color: 'from-amber-500 to-yellow-600', shadow: 'shadow-amber-500/30' };
                  }
                  if (lowerTitle.includes('ip') || lowerLink.includes('ip')) {
                    return { icon: '🌐', color: 'from-amber-500 to-yellow-600', shadow: 'shadow-amber-500/30' };
                  }
                  if (lowerTitle.includes('robots') || lowerLink.includes('robots')) {
                    return { icon: '🤖', color: 'from-amber-500 to-yellow-600', shadow: 'shadow-amber-500/30' };
                  }
                  return { icon: '🔍', color: 'from-amber-500 to-yellow-600', shadow: 'shadow-amber-500/30' };
                };
                
                const toolIcon = getToolIcon(tool.title, tool.link);
                
                return (
                  <Link
                    key={tool.link}
                    href={tool.link}
                    className="group block p-5 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-amber-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${toolIcon.color} shadow-lg ${toolIcon.shadow} transition-transform duration-300 group-hover:scale-110 mb-3`}>
                        <span className="text-3xl">{toolIcon.icon}</span>
                      </div>
                      <h3 className="font-bold text-slate-900 mb-2 group-hover:text-amber-600 transition-colors text-base">
                        {tool.title}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                        {tool.desc?.substring(0, 80) || 'SEO tool for optimization'}...
                      </p>
                    </div>
                  </Link>
                );
              })}
          </div>
        </section>

        {/* Tier 1 Tools - High Traffic, Low Friction */}
        <section className="mx-auto max-w-6xl px-4 pb-8">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-slate-900">Essential SEO Tools</h2>
              <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                High Traffic
              </span>
            </div>
            <p className="text-slate-600">Quick wins with strong ROI — simple tools that deliver big results</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* SERP Preview Tool */}
            <Link
              href="/seo-tools/serp-preview"
              className="group block p-6 rounded-2xl border-2 border-slate-200 bg-white hover:border-amber-300 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30 transition-transform duration-300 group-hover:scale-110">
                  <span className="text-2xl">👁️</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                      SERP Preview Tool
                    </h3>
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                      Coming Soon
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Preview how your page appears in Google search results. Test title and description with character limits.
                  </p>
                </div>
              </div>
            </Link>

            {/* Canonical Tag Generator */}
            <Link
              href="/seo-tools/canonical-tag"
              className="group block p-6 rounded-2xl border-2 border-slate-200 bg-white hover:border-amber-300 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg shadow-purple-500/30 transition-transform duration-300 group-hover:scale-110">
                  <span className="text-2xl">🔗</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                      Canonical Tag Generator
                    </h3>
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                      Coming Soon
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Generate canonical tags to prevent duplicate content issues. Simple URL input with best practices guide.
                  </p>
                </div>
              </div>
            </Link>

            {/* Redirect Generator */}
            <Link
              href="/seo-tools/redirect-generator"
              className="group block p-6 rounded-2xl border-2 border-slate-200 bg-white hover:border-amber-300 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/30 transition-transform duration-300 group-hover:scale-110">
                  <span className="text-2xl">↪️</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                      Redirect Generator
                    </h3>
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                      Coming Soon
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Generate 301 and 302 redirect rules for Apache, Nginx, Netlify, and Vercel. Bulk mode supported.
                  </p>
                </div>
              </div>
            </Link>

            {/* Open Graph Generator */}
            <Link
              href="/seo-tools/open-graph"
              className="group block p-6 rounded-2xl border-2 border-slate-200 bg-white hover:border-amber-300 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 shadow-lg shadow-pink-500/30 transition-transform duration-300 group-hover:scale-110">
                  <span className="text-2xl">📱</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                      Open Graph Generator
                    </h3>
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                      Coming Soon
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Generate Open Graph tags for Facebook, LinkedIn, and social media sharing. Perfect previews every time.
                  </p>
                </div>
              </div>
            </Link>

            {/* Internet Speed Test */}
            <Link
              href="/seo-tools/internet-speed-test"
              className="group block p-6 rounded-2xl border-2 border-slate-200 bg-white hover:border-amber-300 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/30 transition-transform duration-300 group-hover:scale-110">
                  <span className="text-2xl">⚡</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                      Internet Speed Test
                    </h3>
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                      Coming Soon
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Test your internet connection speed. Measure download, upload, and ping for website performance analysis.
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* Tier 2 Tools - Authority Builders */}
        <section className="mx-auto max-w-6xl px-4 pb-8">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-slate-900">Advanced SEO Tools</h2>
              <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                Authority Builders
              </span>
            </div>
            <p className="text-slate-600">Professional tools that establish Fixtools as a serious SEO utility suite</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Structured Data Generator */}
            <Link
              href="/seo-tools/structured-data"
              className="group block p-6 rounded-2xl border-2 border-slate-200 bg-white hover:border-amber-300 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30 transition-transform duration-300 group-hover:scale-110">
                  <span className="text-2xl">📊</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                      Structured Data Generator
                    </h3>
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                      Coming Soon
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Generate Schema.org markup for Article, FAQ, HowTo, Product, and Breadcrumb schemas. Rich results ready.
                  </p>
                </div>
              </div>
            </Link>

            {/* Hreflang Tag Generator */}
            <Link
              href="/seo-tools/hreflang-generator"
              className="group block p-6 rounded-2xl border-2 border-slate-200 bg-white hover:border-amber-300 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 shadow-lg shadow-teal-500/30 transition-transform duration-300 group-hover:scale-110">
                  <span className="text-2xl">🌍</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                      Hreflang Tag Generator
                    </h3>
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                      Coming Soon
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Generate hreflang tags for international SEO. Country and language matrix with HTML and XML outputs.
                  </p>
                </div>
              </div>
            </Link>

            {/* Robots.txt Tester */}
            <Link
              href="/seo-tools/robots-txt-tester"
              className="group block p-6 rounded-2xl border-2 border-slate-200 bg-white hover:border-amber-300 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg shadow-orange-500/30 transition-transform duration-300 group-hover:scale-110">
                  <span className="text-2xl">🧪</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                      Robots.txt Tester
                    </h3>
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                      Coming Soon
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Test robots.txt rules before deployment. Simulate Googlebot and Bingbot behavior with URL testing.
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* Tier 3 Tools - Premium/Phase 2 */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-slate-900">Premium SEO Tools</h2>
              <span className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                Phase 2
              </span>
            </div>
            <p className="text-slate-600">High-traffic tools requiring more complex implementation — coming in future phases</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Keyword Difficulty Checker */}
            <div className="group block p-6 rounded-2xl border-2 border-slate-200 bg-slate-50 opacity-75">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-400 to-slate-500 shadow-lg">
                  <span className="text-2xl">📈</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-slate-700">
                      Keyword Difficulty Checker
                    </h3>
                    <span className="inline-flex items-center rounded-full bg-slate-200 px-2 py-0.5 text-xs font-semibold text-slate-600">
                      Phase 2
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Analyze keyword competition and difficulty. SERP analysis with domain authority proxies. Monetization-friendly.
                  </p>
                </div>
              </div>
            </div>

            {/* Website SEO Audit */}
            <div className="group block p-6 rounded-2xl border-2 border-slate-200 bg-slate-50 opacity-75">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-400 to-slate-500 shadow-lg">
                  <span className="text-2xl">🔍</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-slate-700">
                      Website SEO Audit
                    </h3>
                    <span className="inline-flex items-center rounded-full bg-slate-200 px-2 py-0.5 text-xs font-semibold text-slate-600">
                      Phase 2
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Comprehensive SEO audit tool. Check title/meta presence, H1 usage, mobile friendliness, and indexability.
                  </p>
                </div>
              </div>
            </div>

            {/* Backlink Checker */}
            <div className="group block p-6 rounded-2xl border-2 border-slate-200 bg-slate-50 opacity-75">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-400 to-slate-500 shadow-lg">
                  <span className="text-2xl">🔗</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-slate-700">
                      Backlink Checker
                    </h3>
                    <span className="inline-flex items-center rounded-full bg-slate-200 px-2 py-0.5 text-xs font-semibold text-slate-600">
                      Phase 2
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Analyze backlinks and referring domains. API-dependent tool better suited for premium or freemium model.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* All Existing Tools Grid */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">All SEO Tools</h2>
            <p className="text-slate-600">Complete list of all available SEO tools</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map((tool) => {
              const getToolIcon = (title, link) => {
                const lowerTitle = title.toLowerCase();
                const lowerLink = link.toLowerCase();
                
                if (lowerTitle.includes('sitemap') || lowerLink.includes('sitemap')) {
                  return { icon: '🗺️', color: 'from-amber-500 to-yellow-600', shadow: 'shadow-amber-500/30' };
                }
                if (lowerTitle.includes('meta') || lowerLink.includes('meta-tags')) {
                  return { icon: '🏷️', color: 'from-amber-500 to-yellow-600', shadow: 'shadow-amber-500/30' };
                }
                if (lowerTitle.includes('ip') || lowerLink.includes('ip')) {
                  return { icon: '🌐', color: 'from-amber-500 to-yellow-600', shadow: 'shadow-amber-500/30' };
                }
                if (lowerTitle.includes('robots') || lowerLink.includes('robots')) {
                  return { icon: '🤖', color: 'from-amber-500 to-yellow-600', shadow: 'shadow-amber-500/30' };
                }
                return { icon: '🔍', color: 'from-amber-500 to-yellow-600', shadow: 'shadow-amber-500/30' };
              };
              
              const toolIcon = getToolIcon(tool.title, tool.link);
              
              return (
                <Link
                  key={tool.link}
                  href={tool.link}
                  className="group block p-6 rounded-2xl border-2 border-slate-200 bg-white hover:border-amber-300 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${toolIcon.color} shadow-lg ${toolIcon.shadow} transition-transform duration-300 group-hover:scale-110`}>
                      <span className="text-2xl">{toolIcon.icon}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-900 mb-1 group-hover:text-amber-600 transition-colors">
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

        {/* What is SEO Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">What is SEO?</h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                <strong>SEO (Search Engine Optimization)</strong> is the practice of optimizing websites to improve their visibility in search engine results. SEO involves various techniques including creating sitemaps, optimizing meta tags, improving site structure, and ensuring search engines can crawl and index your content effectively. According to <a href="https://developers.google.com/search/docs/fundamentals/seo-starter-guide" target="_blank" rel="noopener noreferrer" className="text-amber-700 hover:text-amber-800 font-semibold underline">Google's SEO Starter Guide</a>, 
                proper SEO can significantly improve your website's search rankings and organic traffic.
              </p>

              <p className="text-base text-slate-700 leading-relaxed mb-4">
                SEO tools help automate and simplify optimization tasks. Sitemap generators create XML files that help search engines discover all your pages. Meta tag generators ensure your pages have proper titles and descriptions for search results. IP location checkers help you understand your website's geographic reach. According to <a href="https://web.dev/learn/seo/" target="_blank" rel="noopener noreferrer" className="text-amber-700 hover:text-amber-800 font-semibold underline">Google Web.dev</a>, 
                technical SEO is crucial for modern websites.
              </p>

              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Our SEO tools are designed to be accessible to both beginners and experienced developers. They generate standards-compliant files and code that you can immediately use to improve your website's search engine performance.
              </p>

              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">SEO Essentials</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600 font-bold mt-0.5">✓</span>
                      <span>XML Sitemaps for search engines</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600 font-bold mt-0.5">✓</span>
                      <span>Meta tags for search results</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600 font-bold mt-0.5">✓</span>
                      <span>Robots.txt for crawl control</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600 font-bold mt-0.5">✓</span>
                      <span>Open Graph tags for social sharing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600 font-bold mt-0.5">✓</span>
                      <span>IP location analysis</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Why SEO Tools?</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600 font-bold mt-0.5">✓</span>
                      <span>Save time on manual SEO tasks</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600 font-bold mt-0.5">✓</span>
                      <span>Ensure standards compliance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600 font-bold mt-0.5">✓</span>
                      <span>Improve search rankings</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600 font-bold mt-0.5">✓</span>
                      <span>Generate files instantly</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600 font-bold mt-0.5">✓</span>
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
              <div className="h-1 w-8 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">How to Use These Tools</h2>
            </div>
            
            <p className="text-base text-slate-600 mb-6 leading-relaxed">
              Our SEO tools are designed to be simple and intuitive. Follow these steps to get started:
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 text-white font-bold text-xl shadow-lg mb-4">
                  1
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Choose Your Tool</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Select the SEO tool you need. Generate sitemaps, create meta tags, check IP locations, or create robots.txt files.
                </p>
              </div>

              <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-xl shadow-lg mb-4">
                  2
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Enter Your Information</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Fill in the required fields. For sitemaps, enter your URLs. For meta tags, enter your page information.
                </p>
              </div>

              <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white font-bold text-xl shadow-lg mb-4">
                  3
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Download & Use</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Copy or download the generated files and add them to your website. All processing happens in your browser.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full"></div>
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
  // Filter tools for SEO Tools category
  const tools = (Data || []).filter((tool) => tool.category === 'SEO Tools');
  
  return {
    props: {
      tools,
    },
  };
}

