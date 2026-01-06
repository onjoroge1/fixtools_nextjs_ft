import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';

const siteHost = process.env.NEXT_PUBLIC_HOST || 'https://fixtools.io';

export default function BackToSchoolIndex() {
  const currentYear = new Date().getFullYear();
  const canonicalUrl = `${siteHost}/back-to-school`;

  // Sub-hubs for back-to-school
  const subHubs = [
    {
      title: 'Writing Tools',
      description: 'Tools to help students meet writing requirements, revise drafts, and submit clean assignments.',
      link: '/back-to-school/writing',
      icon: '✍️',
      color: 'blue',
      gradient: 'from-blue-600 via-indigo-600 to-blue-600',
      borderColor: 'border-blue-300',
      bgColor: 'from-blue-50 to-indigo-50',
      textColor: 'text-blue-700',
      toolCount: 7,
      tools: ['Word Counter', 'Character Counter', 'Essay Length Checker', 'Sentence Counter', 'Paragraph Counter', 'Case Converter', 'Text Diff']
    },
    {
      title: 'Reading & Comprehension',
      description: 'Tools for parents, teachers, and ESL learners to check reading levels and improve comprehension.',
      link: '/back-to-school/reading',
      icon: '📚',
      color: 'emerald',
      gradient: 'from-emerald-600 via-green-600 to-emerald-600',
      borderColor: 'border-emerald-300',
      bgColor: 'from-emerald-50 to-green-50',
      textColor: 'text-emerald-700',
      toolCount: 4,
      tools: ['Reading Level Checker', 'Reading Time Calculator', 'Keyword Density Checker', 'Text Complexity Checker']
    },
    {
      title: 'Study & Organization',
      description: 'Tools to help students plan, organize, and manage their study time effectively.',
      link: '/back-to-school/study-tools',
      icon: '📝',
      color: 'purple',
      gradient: 'from-purple-600 via-pink-600 to-purple-600',
      borderColor: 'border-purple-300',
      bgColor: 'from-purple-50 to-pink-50',
      textColor: 'text-purple-700',
      toolCount: 3,
      tools: ['Study Planner', 'Exam Countdown', 'Time Management Tools']
    }
  ];

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>Back to School Tools - Free Student & Teacher Resources | FixTools</title>
        <meta name="title" content="Back to School Tools - Free Student & Teacher Resources | FixTools" />
        <meta name="description" content="Free back-to-school tools for students and teachers. Writing tools, reading comprehension tools, study planners, and organization tools. All tools work 100% in your browser - fast, secure, no registration required." />
        <meta name="keywords" content="back to school tools, student tools, school writing tools, reading tools for students, study tools, free student resources, teacher tools" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content="Back to School Tools - Free Student & Teacher Resources" />
        <meta property="og:description" content="Free back-to-school tools for students and teachers. Writing, reading, and study tools." />
        <meta property="og:image" content={`${siteHost}/images/back-to-school-og.png`} />
        <meta property="og:site_name" content="FixTools" />
        
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content="Back to School Tools - Free Student & Teacher Resources" />
        <meta property="twitter:description" content="Free back-to-school tools for students and teachers." />
        <meta property="twitter:image" content={`${siteHost}/images/back-to-school-og.png`} />
        
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Back to School Tools",
          "description": "Free back-to-school tools for students and teachers",
          "url": canonicalUrl,
          "mainEntity": {
            "@type": "ItemList",
            "itemListElement": subHubs.map((hub, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "name": hub.title,
              "url": `${siteHost}${hub.link}`
            }))
          }
        })}} />
      </Head>

      <style jsx global>{`
        html:has(.back-to-school-index-page) {
          font-size: 100% !important;
        }
        
        .back-to-school-index-page {
          line-height: 1.5;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          width: 100%;
          min-height: 100vh;
        }
      `}</style>

      <div className="back-to-school-index-page bg-[#fbfbfc] text-slate-900 min-h-screen">
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
            <li className="flex items-center gap-2"><span className="text-slate-400">/</span><span className="font-semibold text-slate-900">Back to School</span></li>
          </ol>
        </nav>

        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.35]" style={{ backgroundImage: 'url(/grid.png)', backgroundSize: '256px 256px' }}></div>
          <div className="mx-auto max-w-6xl px-4 py-10 md:py-14 relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50 px-4 py-1.5 text-xs font-semibold text-orange-700 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
              Free • Private • Instant
            </div>
            
            <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 bg-clip-text text-transparent">
                Back to School Tools
              </span>
            </h1>
            
            <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg md:leading-relaxed">
              Free tools for students and teachers. Writing assistance, reading comprehension, study planning, and organization tools. All tools work 100% in your browser - no sign-ups, no watermarks, just fast results.
            </p>

            <dl className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
              <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Tool Categories</dt>
                <dd className="mt-1.5 text-sm font-bold text-slate-900">{subHubs.length}</dd>
              </div>
              <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total Tools</dt>
                <dd className="mt-1.5 text-sm font-bold text-slate-900">{subHubs.reduce((sum, hub) => sum + hub.toolCount, 0)}+</dd>
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

        {/* Sub-Hubs Section */}
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Choose Your Tool Category</h2>
            <p className="text-slate-600">Select a category below to find tools for your specific needs.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subHubs.map((hub) => (
              <Link
                key={hub.link}
                href={hub.link}
                className={`group rounded-3xl border-2 ${hub.borderColor} bg-white p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
                style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}
              >
                <div className="flex flex-col items-center text-center mb-4">
                  <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${hub.gradient} shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-3xl">{hub.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{hub.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">{hub.description}</p>
                </div>

                <div className="border-t border-slate-200 pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Tools Available</span>
                    <span className={`text-sm font-bold ${hub.textColor}`}>{hub.toolCount} tools</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {hub.tools.slice(0, 3).map((tool, idx) => (
                      <span key={idx} className="text-xs px-2 py-1 rounded-lg bg-slate-100 text-slate-700">
                        {tool}
                      </span>
                    ))}
                    {hub.tools.length > 3 && (
                      <span className="text-xs px-2 py-1 rounded-lg bg-slate-100 text-slate-700">
                        +{hub.tools.length - 3} more
                      </span>
                    )}
                  </div>
                  <div className={`flex items-center justify-center pt-4 border-t border-slate-200`}>
                    <span className={`text-sm font-semibold ${hub.textColor} group-hover:underline`}>
                      Explore {hub.title} →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Philosophy Section */}
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Why FixTools for Students?</h2>
            <p className="text-base text-slate-700 leading-relaxed mb-6">
              FixTools provides free, privacy-first tools that help students succeed without compromising their data or requiring sign-ups. All tools process data entirely in your browser, ensuring complete privacy and security. Perfect for students, teachers, and parents who need reliable tools without the hassle.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50">
                <h3 className="font-semibold text-slate-900 mb-2">🔒 Privacy-First</h3>
                <p className="text-sm text-slate-600">All processing happens in your browser. Your data never leaves your device.</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50">
                <h3 className="font-semibold text-slate-900 mb-2">⚡ Instant Results</h3>
                <p className="text-sm text-slate-600">No waiting, no uploads, no processing delays. Get results immediately.</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50">
                <h3 className="font-semibold text-slate-900 mb-2">✅ No Sign-Ups</h3>
                <p className="text-sm text-slate-600">Start using tools immediately. No accounts, no emails, no barriers.</p>
              </div>
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

