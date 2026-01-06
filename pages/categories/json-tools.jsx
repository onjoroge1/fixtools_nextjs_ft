import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Data from '@/dbTools';

const siteHost = process.env.NEXT_PUBLIC_HOST || 'http://localhost:3000';

export default function JSONToolsCategory({ tools }) {
  const router = useRouter();
  const canonicalUrl = `${siteHost}/categories/json-tools`;
  const currentYear = new Date().getFullYear();

  return (
    <>
      <Head>
        {/* Primary Meta Tags */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>Free JSON Tools - Format, Validate, Convert & Minify JSON Online | FixTools</title>
        <meta name="title" content="Free JSON Tools - Format, Validate, Convert & Minify JSON Online | FixTools" />
        <meta name="description" content="13 free JSON tools for developers. Format, validate, minify, and convert JSON data. Works 100% in your browser - fast, secure, no registration required." />
        <meta name="keywords" content="json tools, json formatter, json validator, json minifier, json converter, json to xml, xml to json, json to csv, free json tools, online json tools" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        {/* Canonical URL */}
        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content="Free JSON Tools - Format, Validate, Convert & Minify JSON" />
        <meta property="og:description" content="13 free JSON tools for developers. Format, validate, minify, and convert JSON data instantly." />
        <meta property="og:image" content={`${siteHost}/images/json-tools-og.png`} />
        <meta property="og:site_name" content="FixTools" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content="Free JSON Tools - Format, Validate, Convert & Minify JSON" />
        <meta property="twitter:description" content="13 free JSON tools for developers. Format, validate, minify, and convert JSON data instantly." />
        <meta property="twitter:image" content={`${siteHost}/images/json-tools-og.png`} />
      </Head>

      <style jsx global>{`
        /* Critical CSS reset for category page */
        html:has(.json-tools-category) {
          font-size: 100% !important;
        }
        
        .json-tools-category {
          line-height: 1.5;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          width: 100%;
          min-height: 100vh;
        }
        
        .json-tools-category *,
        .json-tools-category *::before,
        .json-tools-category *::after {
          box-sizing: border-box;
        }
      `}</style>

      <div className="json-tools-category bg-[#fbfbfc] text-slate-900 min-h-screen">
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
              <Link className="hover:text-slate-900 transition-colors" href="/categories/json-tools">JSON</Link>
              <Link className="hover:text-slate-900 transition-colors" href="/categories/html-tools">HTML</Link>
              <Link className="hover:text-slate-900 transition-colors" href="/categories/css-tools">CSS</Link>
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
              <span className="font-semibold text-slate-900">JSON Tools</span>
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
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50 px-4 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              13 Free Tools • 100% Client-Side • No Sign-Up
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-600 bg-clip-text text-transparent">
                JSON Tools
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 max-w-3xl leading-relaxed mb-8">
              Professional <strong>JSON tools</strong> for developers. Format, validate, minify, and convert JSON data instantly. 
              All tools work 100% in your browser — fast, secure, and private.
            </p>

            {/* Stats */}
            <dl className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Tools</dt>
                <dd className="mt-1.5 text-2xl font-bold text-slate-900">13</dd>
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

        {/* Educational CTA - Marquee Style */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="relative overflow-hidden rounded-3xl border-2 border-emerald-300 bg-gradient-to-br from-emerald-600 via-green-600 to-teal-600 p-8 md:p-12 shadow-2xl">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url(/grid.png)', backgroundSize: '64px 64px' }}></div>
            
            <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
              {/* Left: Content */}
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold text-white mb-4">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                  </span>
                  FREE TUTORIAL
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Learn JSON from Scratch
                </h2>
                
                <p className="text-lg text-emerald-50 mb-6 leading-relaxed">
                  Master JSON with our comprehensive, interactive tutorial. From basics to advanced concepts — 
                  learn by doing with live examples and instant feedback.
                </p>
                
                <div className="flex flex-wrap gap-3">
                  <Link 
                    href="/learn/json"
                    className="group inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-base font-semibold text-emerald-600 shadow-lg transition-all duration-200 hover:bg-emerald-50 hover:scale-[1.02] hover:shadow-xl"
                  >
                    <span>📚 Start Learning</span>
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </Link>
                  
                  <Link 
                    href="/learn/json#examples"
                    className="inline-flex items-center gap-2 rounded-xl border-2 border-white/30 bg-white/10 backdrop-blur-sm px-6 py-3.5 text-base font-semibold text-white transition-all duration-200 hover:bg-white/20"
                  >
                    <span>⚡ Try Examples</span>
                  </Link>
                </div>
                
                {/* Quick Stats */}
                <div className="mt-6 flex flex-wrap gap-4 text-sm text-emerald-50">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">✓</span>
                    <span>10 Interactive Lessons</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">✓</span>
                    <span>50+ Code Examples</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">✓</span>
                    <span>Try It Yourself Editor</span>
                  </div>
                </div>
              </div>
              
              {/* Right: Visual Preview */}
              <div className="hidden md:block">
                <div className="rounded-2xl bg-slate-900 p-4 shadow-2xl border-4 border-white/20">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                    <div className="text-xs text-slate-400 font-mono">json-tutorial.json</div>
                  </div>
                  <pre className="text-xs text-green-400 font-mono overflow-x-auto"><code>{`{
  "course": "JSON Mastery",
  "lessons": 10,
  "features": [
    "Interactive examples",
    "Try it yourself",
    "Real-world projects"
  ],
  "difficulty": "beginner",
  "price": "FREE",
  "completion": "2 hours"
}`}</code></pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tools Grid */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">All JSON Tools</h2>
            <p className="text-slate-600">Click any tool to get started — no registration required</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map((tool) => (
              <Link
                key={tool.link}
                href={tool.link}
                className="group block p-6 rounded-2xl border-2 border-slate-200 bg-white hover:border-emerald-300 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg shadow-emerald-500/30 transition-transform duration-300 group-hover:scale-110">
                    <span className="text-2xl">📄</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 mb-1 group-hover:text-emerald-600 transition-colors">
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

        {/* What is JSON Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">What is JSON?</h2>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                <strong>JSON (JavaScript Object Notation)</strong> is a lightweight, text-based data interchange format that's easy for humans to read and write, 
                and easy for machines to parse and generate. Originally derived from JavaScript, JSON is now language-independent and used universally across 
                modern web development, APIs, and data storage.
              </p>

              <p className="text-base text-slate-700 leading-relaxed mb-4">
                JSON represents data as key-value pairs wrapped in curly braces <code className="bg-slate-100 px-2 py-1 rounded text-sm">{`{}`}</code>, 
                with support for nested objects and arrays. This simple structure makes JSON the de facto standard for web APIs, configuration files, 
                and data exchange between systems.
              </p>

              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">JSON Example</h3>
                  <pre className="text-xs bg-slate-900 text-green-400 p-4 rounded-lg overflow-x-auto font-mono"><code>{`{
  "name": "John Doe",
  "age": 30,
  "email": "john@example.com",
  "isActive": true,
  "roles": ["admin", "user"]
}`}</code></pre>
                </div>

                <div className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Why JSON?</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                      <span>Human-readable and easy to debug</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                      <span>Supported by all programming languages</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                      <span>Lightweight (smaller than XML)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                      <span>Native JavaScript support</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                      <span>Perfect for APIs and web services</span>
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
            <h2 className="text-3xl font-bold text-slate-900 mb-6">How to Use These Tools</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white font-bold text-xl shadow-lg mb-4">
                  1
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Choose Your Tool</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Select the JSON tool you need from the grid above. Format, validate, minify, or convert JSON data.
                </p>
              </div>

              <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-xl shadow-lg mb-4">
                  2
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Paste Your JSON</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Copy your JSON data and paste it into the input field. Works with API responses, config files, or any JSON source.
                </p>
              </div>

              <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 text-white font-bold text-xl shadow-lg mb-4">
                  3
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Get Results</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Click the action button, get instant results, then copy or download. All processing happens in your browser.
                </p>
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

export async function getStaticProps() {
  // Filter tools for JSON category
  const tools = (Data || []).filter((tool) => tool.category === 'JSON Tools');
  
  return {
    props: {
      tools,
    },
  };
}

