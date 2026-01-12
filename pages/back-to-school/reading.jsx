import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';

const siteHost = process.env.NEXT_PUBLIC_HOST || 'https://fixtools.io';

export default function BackToSchoolReading() {
  const currentYear = new Date().getFullYear();
  const canonicalUrl = `${siteHost}/back-to-school/reading`;

  // Reading tools that link to evergreen /tools/* URLs
  const readingTools = [
    {
      title: 'Reading Level Checker',
      description: 'Check the reading level and complexity of text. Perfect for parents and teachers assessing student materials.',
      link: '/tools/reading-level-checker',
      icon: '📖',
      status: 'coming-soon'
    },
    {
      title: 'Reading Time Calculator',
      description: 'Calculate how long it takes to read a text. Help students plan reading assignments and study time.',
      link: '/tools/reading-time-calculator',
      icon: '⏱️',
      status: 'coming-soon'
    },
    {
      title: 'Word Counter',
      description: 'Count words, characters, and paragraphs. Useful for tracking reading progress and comprehension exercises.',
      link: '/text/word-counter',
      icon: '📊',
      status: 'available'
    },
    {
      title: 'Text Complexity Analyzer',
      description: 'Analyze text complexity, sentence length, and vocabulary difficulty. Help teachers select appropriate reading materials.',
      link: '/tools/text-complexity-analyzer',
      icon: '🔍',
      status: 'coming-soon'
    }
  ];

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>Reading Tools for Students - Free Comprehension & Analysis Tools | FixTools</title>
        <meta name="title" content="Reading Tools for Students - Free Comprehension & Analysis Tools | FixTools" />
        <meta name="description" content="Free reading tools for students, parents, and teachers. Reading level checkers, reading time calculators, and text analysis tools. All tools work 100% in your browser." />
        <meta name="keywords" content="reading tools for students, reading level checker, reading time calculator, text analysis, comprehension tools, school reading tools" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content="Reading Tools for Students - Free Comprehension & Analysis Tools" />
        <meta property="og:description" content="Free reading tools for students, parents, and teachers." />
        <meta property="og:image" content={`${siteHost}/images/reading-tools-og.png`} />
        <meta property="og:site_name" content="FixTools" />
        
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content="Reading Tools for Students - Free Comprehension & Analysis Tools" />
        <meta property="twitter:description" content="Free reading tools for students, parents, and teachers." />
        <meta property="twitter:image" content={`${siteHost}/images/reading-tools-og.png`} />
      </Head>

      <style jsx global>{`
        html:has(.back-to-school-reading-page) {
          font-size: 100% !important;
        }
        
        .back-to-school-reading-page {
          line-height: 1.5;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          width: 100%;
          min-height: 100vh;
        }
      `}</style>

      <div className="back-to-school-reading-page bg-[#fbfbfc] text-slate-900 min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/fixtools-logos/fixtools-logos_black.svg" alt="FixTools" width={120} height={40} className="h-9 w-auto" />
            </Link>
            <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex" aria-label="Main navigation" role="navigation">
              <Link className="hover:text-slate-900 transition-colors" href="/tools/json">JSON</Link>
              <Link className="hover:text-slate-900 transition-colors" href="/tools/html">HTML</Link>
              <Link className="hover:text-slate-900 transition-colors" href="/tools/css">CSS</Link>
              <Link className="hover:text-slate-900 transition-colors" href="/tools/image-tools">Images</Link>
              <Link className="hover:text-slate-900 transition-colors" href="/learn">Learn</Link>
              <Link className="font-semibold text-orange-600" href="/back-to-school">Back to School</Link>
              <Link className="hover:text-slate-900 transition-colors" href="/tools">All tools</Link>
            </nav>
            <Link href="/tools" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50">
              Browse tools
            </Link>
          </div>
        </header>

        {/* Breadcrumbs */}
        <nav className="mx-auto max-w-6xl px-4 py-3" aria-label="Breadcrumb" role="navigation">
          <ol className="flex items-center gap-2 text-sm text-slate-600">
            <li><Link href="/" className="hover:text-slate-900 transition-colors">Home</Link></li>
            <li className="flex items-center gap-2"><span className="text-slate-400">/</span><Link href="/back-to-school" className="hover:text-slate-900 transition-colors">Back to School</Link></li>
            <li className="flex items-center gap-2"><span className="text-slate-400">/</span><span className="font-semibold text-slate-900">Reading Tools</span></li>
          </ol>
        </nav>

        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.35]" style={{ backgroundImage: 'url(/grid.png)', backgroundSize: '256px 256px' }}></div>
          <div className="mx-auto max-w-6xl px-4 py-10 md:py-14 relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50 px-4 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Free • Private • Instant
            </div>
            
            <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              <span className="bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-600 bg-clip-text text-transparent">
                Reading Tools for Students
              </span>
            </h1>
            
            <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg md:leading-relaxed">
              Tools for parents, teachers, and ESL learners to check reading levels, calculate reading time, and analyze text complexity. All tools work 100% in your browser.
            </p>

            <dl className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
              <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Tools</dt>
                <dd className="mt-1.5 text-sm font-bold text-slate-900">{readingTools.length}</dd>
              </div>
              <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Processing</dt>
                <dd className="mt-1.5 text-sm font-bold text-slate-900">Client-Side</dd>
              </div>
              <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Privacy</dt>
                <dd className="mt-1.5 text-sm font-bold text-slate-900">100%</dd>
              </div>
              <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Price</dt>
                <dd className="mt-1.5 text-sm font-bold text-slate-900">Free</dd>
              </div>
            </dl>
          </div>
        </section>

        {/* Tools Grid */}
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {readingTools.map((tool) => (
              <Link
                key={tool.link}
                href={tool.status === 'available' ? tool.link : '#'}
                className={`group rounded-3xl border-2 p-6 transition-all duration-300 flex flex-col ${
                  tool.status === 'available'
                    ? 'border-emerald-300 bg-white hover:shadow-xl hover:-translate-y-1'
                    : 'border-slate-200 bg-slate-50 opacity-75 cursor-not-allowed'
                }`}
                style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}
              >
                <div className="flex flex-col items-center text-center mb-4">
                  <div className={`flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300 ${
                    tool.status === 'available' 
                      ? 'bg-gradient-to-br from-emerald-600 via-green-600 to-emerald-600'
                      : 'bg-gradient-to-br from-slate-400 to-slate-500'
                  }`}>
                    <span className="text-3xl">{tool.icon}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold text-slate-900">{tool.title}</h3>
                    {tool.status === 'coming-soon' && (
                      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-slate-100 text-slate-600">
                        Coming Soon
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">{tool.description}</p>
                </div>
                {tool.status === 'available' && (
                  <div className="mt-auto pt-4 border-t border-slate-200 flex items-center justify-center">
                    <span className="text-sm font-semibold text-emerald-600 group-hover:underline">
                      Open Tool →
                    </span>
                  </div>
                )}
                {tool.status === 'coming-soon' && (
                  <div className="mt-auto pt-4 border-t border-slate-200 text-center">
                    <span className="text-sm text-slate-500">Coming soon</span>
                  </div>
                )}
              </Link>
            ))}
          </div>
        </section>

        {/* Related Categories */}
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">More Back-to-School Tools</h2>
            <p className="text-slate-600">Explore other categories to find tools for writing, studying, and organization.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/back-to-school/writing" className="group rounded-2xl border-2 border-blue-300 bg-white p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-600 shadow-lg">
                  <span className="text-2xl">✍️</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Writing Tools</h3>
                  <p className="text-sm text-slate-600">Word counters, formatters, and essay helpers</p>
                </div>
              </div>
            </Link>
            <Link href="/back-to-school/study-tools" className="group rounded-2xl border-2 border-purple-300 bg-white p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 via-pink-600 to-purple-600 shadow-lg">
                  <span className="text-2xl">📝</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Study & Organization</h3>
                  <p className="text-sm text-slate-600">Study planners and time management tools</p>
                </div>
              </div>
            </Link>
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


