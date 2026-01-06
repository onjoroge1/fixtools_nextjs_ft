import React, { useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';

const siteHost = process.env.NEXT_PUBLIC_HOST || 'http://localhost:3000';

export default function LearnJSON() {
  const [activeExample, setActiveExample] = useState('basic');
  const [tryItCode, setTryItCode] = useState(`{
  "name": "John Doe",
  "age": 30,
  "city": "New York"
}`);
  const [tryItOutput, setTryItOutput] = useState('');
  const [tryItError, setTryItError] = useState('');

  const canonicalUrl = `${siteHost}/learn/json`;
  const currentYear = new Date().getFullYear();

  const handleTryIt = () => {
    try {
      const parsed = JSON.parse(tryItCode);
      setTryItOutput(JSON.stringify(parsed, null, 2));
      setTryItError('');
    } catch (err) {
      setTryItError(err.message);
      setTryItOutput('');
    }
  };

  const codeExamples = {
    basic: `{
  "name": "John Doe",
  "age": 30,
  "isStudent": false
}`,
    array: `{
  "fruits": ["apple", "banana", "orange"],
  "numbers": [1, 2, 3, 4, 5]
}`,
    nested: `{
  "person": {
    "name": "Jane Smith",
    "contact": {
      "email": "jane@example.com",
      "phone": "+1-555-0100"
    }
  }
}`,
    api: `{
  "status": "success",
  "data": {
    "users": [
      {"id": 1, "name": "Alice"},
      {"id": 2, "name": "Bob"}
    ]
  },
  "timestamp": "2026-01-01T12:00:00Z"
}`
  };

  return (
    <>
      <Head>
        {/* Primary Meta Tags */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>Learn JSON - Free Interactive JSON Tutorial for Beginners | FixTools</title>
        <meta name="title" content="Learn JSON - Free Interactive JSON Tutorial for Beginners | FixTools" />
        <meta name="description" content="Master JSON with our free, interactive tutorial. Learn JSON syntax, data types, objects, arrays, and best practices. 50+ examples, try-it-yourself editor, and instant feedback." />
        <meta name="keywords" content="learn json, json tutorial, json for beginners, what is json, json syntax, json examples, json course, learn json online" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        {/* Canonical URL */}
        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content="Learn JSON - Free Interactive Tutorial" />
        <meta property="og:description" content="Master JSON with 50+ examples and interactive exercises. Free tutorial for beginners." />
        <meta property="og:image" content={`${siteHost}/images/json-tutorial-og.png`} />
        <meta property="og:site_name" content="FixTools" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content="Learn JSON - Free Interactive Tutorial" />
        <meta property="twitter:description" content="Master JSON with 50+ examples and interactive exercises" />
        <meta property="twitter:image" content={`${siteHost}/images/json-tutorial-og.png`} />

        {/* Educational Course Schema */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Course",
          "name": "JSON Tutorial for Beginners",
          "description": "Complete JSON tutorial covering syntax, data types, objects, arrays, and best practices",
          "provider": {
            "@type": "Organization",
            "name": "FixTools",
            "sameAs": siteHost
          },
          "educationalLevel": "Beginner",
          "teaches": "JSON (JavaScript Object Notation)",
          "timeRequired": "PT2H",
          "inLanguage": "en",
          "learningResourceType": "Tutorial",
          "isAccessibleForFree": true
        })}} />
      </Head>

      <style jsx global>{`
        html:has(.learn-json-page) {
          font-size: 100% !important;
        }
        
        .learn-json-page {
          line-height: 1.5;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          width: 100%;
          min-height: 100vh;
        }
      `}</style>

      <div className="learn-json-page bg-[#fbfbfc] text-slate-900 min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/fixtools-logos/fixtools-logos_black.svg" alt="FixTools" width={120} height={40} className="h-9 w-auto" />
            </Link>
            <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
              <Link className="hover:text-slate-900 transition-colors" href="/categories/json-tools">JSON Tools</Link>
              <Link className="font-semibold text-emerald-600" href="/learn/json">Learn JSON</Link>
              <Link className="hover:text-slate-900 transition-colors" href="/">All tools</Link>
            </nav>
            <Link href="/categories/json-tools" className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-100 transition-colors">
              Try Tools
            </Link>
          </div>
        </header>

        {/* Breadcrumbs */}
        <nav className="mx-auto max-w-6xl px-4 py-3" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm text-slate-600">
            <li><Link href="/" className="hover:text-slate-900 transition-colors">Home</Link></li>
            <li className="flex items-center gap-2">
              <span className="text-slate-400">/</span>
              <Link href="/learn" className="hover:text-slate-900 transition-colors">Learn</Link>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-slate-400">/</span>
              <span className="font-semibold text-slate-900">JSON Tutorial</span>
            </li>
          </ol>
        </nav>

        {/* Hero */}
        <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-emerald-50 via-green-50 to-white">
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'url(/grid.png)', backgroundSize: '128px 128px' }}></div>
          
          <div className="mx-auto max-w-6xl px-4 py-12 md:py-16 relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              FREE • INTERACTIVE • BEGINNER-FRIENDLY
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-600 bg-clip-text text-transparent">
                Learn JSON
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 max-w-3xl leading-relaxed mb-8">
              Master <strong>JSON (JavaScript Object Notation)</strong> with our comprehensive, interactive tutorial. 
              From basics to advanced concepts — learn by doing with 50+ live examples and instant feedback.
            </p>

            <div className="flex flex-wrap gap-3 mb-8">
              <a href="#chapter1" className="rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all duration-200 hover:shadow-xl hover:scale-[1.02]">
                Start Learning →
              </a>
              <a href="#examples" className="rounded-xl border-2 border-slate-200 bg-white px-6 py-3.5 text-base font-semibold text-slate-900 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md">
                View Examples
              </a>
            </div>

            <dl className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl">
              <div className="rounded-2xl border border-emerald-200 bg-white p-4 shadow-sm">
                <dt className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">Lessons</dt>
                <dd className="mt-1.5 text-2xl font-bold text-slate-900">10</dd>
              </div>
              <div className="rounded-2xl border border-emerald-200 bg-white p-4 shadow-sm">
                <dt className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">Examples</dt>
                <dd className="mt-1.5 text-2xl font-bold text-slate-900">50+</dd>
              </div>
              <div className="rounded-2xl border border-emerald-200 bg-white p-4 shadow-sm">
                <dt className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">Duration</dt>
                <dd className="mt-1.5 text-2xl font-bold text-slate-900">2 Hours</dd>
              </div>
              <div className="rounded-2xl border border-emerald-200 bg-white p-4 shadow-sm">
                <dt className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">Cost</dt>
                <dd className="mt-1.5 text-2xl font-bold text-slate-900">FREE</dd>
              </div>
            </dl>
          </div>
        </section>

        {/* Table of Contents - Sticky Sidebar Layout */}
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Sidebar - Table of Contents */}
            <aside className="lg:col-span-3">
              <div className="lg:sticky lg:top-20 rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Course Contents</h2>
                <nav className="space-y-2">
                  {[
                    { id: 'chapter1', title: 'What is JSON?' },
                    { id: 'chapter2', title: 'JSON Syntax' },
                    { id: 'chapter3', title: 'JSON Data Types' },
                    { id: 'chapter4', title: 'JSON Objects' },
                    { id: 'chapter5', title: 'JSON Arrays' },
                    { id: 'chapter6', title: 'Nested JSON' },
                    { id: 'chapter7', title: 'JSON vs XML' },
                    { id: 'chapter8', title: 'Common Mistakes' },
                    { id: 'chapter9', title: 'Best Practices' },
                    { id: 'chapter10', title: 'JSON Tools' },
                  ].map((chapter, index) => (
                    <a 
                      key={chapter.id}
                      href={`#${chapter.id}`}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors group"
                    >
                      <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600 group-hover:bg-emerald-100 group-hover:text-emerald-700">
                        {index + 1}
                      </span>
                      <span>{chapter.title}</span>
                    </a>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Main Content */}
            <main className="lg:col-span-9 space-y-12">
              
              {/* Chapter 1: What is JSON? */}
              <section id="chapter1" className="scroll-mt-20 rounded-3xl border border-slate-200 bg-white p-6 md:p-10 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white font-bold text-xl shadow-lg">
                    1
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900">What is JSON?</h2>
                    <p className="text-sm text-slate-600 mt-1">5 min read</p>
                  </div>
                </div>

                <div className="prose prose-slate max-w-none">
                  <p className="text-lg text-slate-700 leading-relaxed">
                    <strong>JSON</strong> stands for <strong>JavaScript Object Notation</strong>. It's a lightweight, text-based format for storing and 
                    transporting data that's easy for humans to read and write, and easy for machines to parse and generate.
                  </p>

                  <p className="text-base text-slate-700 leading-relaxed">
                    Originally derived from JavaScript, JSON is now language-independent and supported by virtually every programming language. 
                    It has become the de facto standard for web APIs, configuration files, and data interchange between systems.
                  </p>

                  <div className="mt-6 rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <span>📊</span> Why JSON is Popular
                    </h3>
                    <ul className="space-y-3 text-sm text-slate-700">
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                        <span><strong>Human-readable:</strong> Easy to understand at a glance</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                        <span><strong>Lightweight:</strong> Smaller than XML, faster to transmit</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                        <span><strong>Universal support:</strong> Works with Python, Java, PHP, Ruby, JavaScript, and more</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                        <span><strong>Native JavaScript:</strong> No parsing library needed in browsers</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                        <span><strong>Perfect for APIs:</strong> RESTful APIs almost exclusively use JSON</span>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-6 rounded-2xl bg-slate-900 p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-xs text-slate-400 font-mono">example.json</div>
                      <div className="text-xs text-emerald-400">Valid JSON ✓</div>
                    </div>
                    <pre className="text-sm text-green-400 font-mono overflow-x-auto"><code>{`{
  "name": "John Doe",
  "age": 30,
  "email": "john@example.com",
  "isActive": true
}`}</code></pre>
                  </div>
                </div>
              </section>

              {/* Chapter 2: JSON Syntax */}
              <section id="chapter2" className="scroll-mt-20 rounded-3xl border border-slate-200 bg-white p-6 md:p-10 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-xl shadow-lg">
                    2
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900">JSON Syntax Rules</h2>
                    <p className="text-sm text-slate-600 mt-1">7 min read</p>
                  </div>
                </div>

                <div className="prose prose-slate max-w-none">
                  <p className="text-lg text-slate-700 leading-relaxed mb-6">
                    JSON syntax is simple and strict. Understanding these rules will help you write valid JSON every time.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-6">
                      <h3 className="text-lg font-bold text-emerald-900 mb-4 flex items-center gap-2">
                        <span>✓</span> Correct Syntax
                      </h3>
                      <ul className="space-y-2 text-sm text-slate-700">
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-600 font-bold">•</span>
                          <span>Data in key-value pairs</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-600 font-bold">•</span>
                          <span>Keys must be strings in double quotes</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-600 font-bold">•</span>
                          <span>Values can be: string, number, object, array, boolean, null</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-600 font-bold">•</span>
                          <span>Comma after each key-value pair (except last)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-600 font-bold">•</span>
                          <span>Curly braces hold objects: <code className="bg-emerald-100 px-2 py-0.5 rounded text-xs">{`{}`}</code></span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-600 font-bold">•</span>
                          <span>Square brackets hold arrays: <code className="bg-emerald-100 px-2 py-0.5 rounded text-xs">[]</code></span>
                        </li>
                      </ul>
                    </div>

                    <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-6">
                      <h3 className="text-lg font-bold text-red-900 mb-4 flex items-center gap-2">
                        <span>✗</span> Common Errors
                      </h3>
                      <ul className="space-y-2 text-sm text-slate-700">
                        <li className="flex items-start gap-2">
                          <span className="text-red-600 font-bold">✗</span>
                          <span>Single quotes: <code className="bg-red-100 px-2 py-0.5 rounded text-xs">{`{'name': 'John'}`}</code></span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-600 font-bold">✗</span>
                          <span>Trailing commas: <code className="bg-red-100 px-2 py-0.5 rounded text-xs">{`{"age": 30,}`}</code></span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-600 font-bold">✗</span>
                          <span>Unquoted keys: <code className="bg-red-100 px-2 py-0.5 rounded text-xs">{`{name: "John"}`}</code></span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-600 font-bold">✗</span>
                          <span>Comments: <code className="bg-red-100 px-2 py-0.5 rounded text-xs">{'// Not allowed'}</code></span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-600 font-bold">✗</span>
                          <span>Undefined values: <code className="bg-red-100 px-2 py-0.5 rounded text-xs">undefined</code></span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-600 font-bold">✗</span>
                          <span>Functions: <code className="bg-red-100 px-2 py-0.5 rounded text-xs">function() {`{}`}</code></span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 grid md:grid-cols-2 gap-6">
                    <div className="rounded-2xl bg-red-50 border-2 border-red-200 p-5">
                      <h4 className="text-base font-bold text-red-900 mb-3 flex items-center gap-2">
                        <span>✗</span> Invalid JSON
                      </h4>
                      <div className="rounded-lg bg-slate-900 p-4">
                        <pre className="text-xs text-red-400 font-mono"><code>{`{
  name: "John",  // Missing quotes on key
  'age': 30,     // Single quotes
  "city": "NYC", // Trailing comma
}`}</code></pre>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-emerald-50 border-2 border-emerald-200 p-5">
                      <h4 className="text-base font-bold text-emerald-900 mb-3 flex items-center gap-2">
                        <span>✓</span> Valid JSON
                      </h4>
                      <div className="rounded-lg bg-slate-900 p-4">
                        <pre className="text-xs text-green-400 font-mono"><code>{`{
  "name": "John",
  "age": 30,
  "city": "NYC"
}`}</code></pre>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Try It Yourself - Interactive Section */}
              <section id="examples" className="scroll-mt-20 rounded-3xl border-2 border-emerald-300 bg-gradient-to-br from-emerald-50 to-green-50 p-6 md:p-10 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-green-700 text-white font-bold text-xl shadow-lg">
                    ⚡
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900">Try It Yourself</h2>
                    <p className="text-sm text-slate-600 mt-1">Edit the JSON and see the results</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Input */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">Your JSON:</label>
                    <textarea 
                      value={tryItCode}
                      onChange={(e) => setTryItCode(e.target.value)}
                      className="w-full h-64 rounded-xl border-2 border-slate-200 bg-slate-900 p-4 text-sm text-green-400 font-mono focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                      spellCheck="false"
                    />
                    <div className="mt-3 flex gap-2">
                      <button 
                        onClick={handleTryIt}
                        className="rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 px-4 py-2 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:scale-[1.02]"
                      >
                        ✓ Validate & Format
                      </button>
                      <button 
                        onClick={() => setTryItCode('')}
                        className="rounded-xl border-2 border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        Clear
                      </button>
                    </div>
                  </div>

                  {/* Output */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">Result:</label>
                    <div className="w-full h-64 rounded-xl border-2 border-emerald-200 bg-white p-4 overflow-auto">
                      {tryItError ? (
                        <div className="text-sm text-red-600 font-mono">
                          <strong>Error:</strong> {tryItError}
                        </div>
                      ) : tryItOutput ? (
                        <pre className="text-sm text-emerald-700 font-mono whitespace-pre-wrap">{tryItOutput}</pre>
                      ) : (
                        <div className="text-sm text-slate-400 italic">Click "Validate & Format" to see results</div>
                      )}
                    </div>
                    {!tryItError && tryItOutput && (
                      <div className="mt-3 flex items-center gap-2 text-sm text-emerald-700 font-semibold">
                        <span>✓</span> Valid JSON!
                      </div>
                    )}
                  </div>
                </div>

                {/* Example Templates */}
                <div className="mt-6">
                  <p className="text-sm font-semibold text-slate-700 mb-3">Try these examples:</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(codeExamples).map((key) => (
                      <button
                        key={key}
                        onClick={() => setTryItCode(codeExamples[key])}
                        className="rounded-lg border-2 border-emerald-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:border-emerald-300 transition-colors"
                      >
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </section>

              {/* Chapter 3: JSON Data Types */}
              <section id="chapter3" className="scroll-mt-20 rounded-3xl border border-slate-200 bg-white p-6 md:p-10 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 text-white font-bold text-xl shadow-lg">
                    3
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900">JSON Data Types</h2>
                    <p className="text-sm text-slate-600 mt-1">6 min read</p>
                  </div>
                </div>

                <div className="prose prose-slate max-w-none">
                  <p className="text-lg text-slate-700 leading-relaxed mb-6">
                    JSON supports six data types. Understanding these is crucial for working with JSON effectively.
                  </p>

                  <div className="space-y-6">
                    {[
                      {
                        type: 'String',
                        icon: '📝',
                        color: 'emerald',
                        description: 'Text wrapped in double quotes',
                        example: `"name": "John Doe"`,
                        notes: 'Must use double quotes, not single quotes. Can contain escaped characters like \\n, \\t, \\"'
                      },
                      {
                        type: 'Number',
                        icon: '🔢',
                        color: 'blue',
                        description: 'Integer or floating-point',
                        example: `"age": 30, "price": 19.99`,
                        notes: 'No quotes needed. Can be positive, negative, or exponential (1e10)'
                      },
                      {
                        type: 'Boolean',
                        icon: '✓✗',
                        color: 'purple',
                        description: 'True or false values',
                        example: `"isActive": true, "verified": false`,
                        notes: 'Lowercase only. No quotes. Use for yes/no, on/off states'
                      },
                      {
                        type: 'Null',
                        icon: '∅',
                        color: 'slate',
                        description: 'Represents "no value"',
                        example: `"middleName": null`,
                        notes: 'Lowercase only. Different from undefined (which is not valid JSON)'
                      },
                      {
                        type: 'Object',
                        icon: '{}',
                        color: 'orange',
                        description: 'Collection of key-value pairs',
                        example: `"person": {"name": "John", "age": 30}`,
                        notes: 'Wrapped in curly braces. Can be nested. Keys must be strings'
                      },
                      {
                        type: 'Array',
                        icon: '[]',
                        color: 'pink',
                        description: 'Ordered list of values',
                        example: `"colors": ["red", "green", "blue"]`,
                        notes: 'Wrapped in square brackets. Values can be any type, including mixed types'
                      }
                    ].map((dataType) => (
                      <div key={dataType.type} className={`rounded-2xl border-2 border-${dataType.color}-200 bg-${dataType.color}-50 p-6`}>
                        <div className="flex items-start gap-4">
                          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-white text-2xl shadow-md">
                            {dataType.icon}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-slate-900 mb-2">{dataType.type}</h3>
                            <p className="text-sm text-slate-700 mb-3">{dataType.description}</p>
                            <div className="rounded-lg bg-slate-900 p-3 mb-3">
                              <pre className="text-xs text-green-400 font-mono"><code>{dataType.example}</code></pre>
                            </div>
                            <p className="text-xs text-slate-600 italic">{dataType.notes}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Chapter 4: JSON Objects */}
              <section id="chapter4" className="scroll-mt-20 rounded-3xl border border-slate-200 bg-white p-6 md:p-10 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 text-white font-bold text-xl shadow-lg">
                    4
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900">JSON Objects</h2>
                    <p className="text-sm text-slate-600 mt-1">8 min read</p>
                  </div>
                </div>

                <div className="prose prose-slate max-w-none">
                  <p className="text-lg text-slate-700 leading-relaxed mb-6">
                    Objects are the foundation of JSON. They store data as <strong>key-value pairs</strong> wrapped in curly braces <code className="bg-slate-100 px-2 py-1 rounded text-sm">{`{}`}</code>.
                  </p>

                  <div className="rounded-2xl border-2 border-orange-200 bg-orange-50 p-6 mb-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-4">Object Structure</h3>
                    <div className="rounded-lg bg-slate-900 p-4 mb-4">
                      <pre className="text-sm text-green-400 font-mono"><code>{`{
  "key": "value",
  "anotherKey": "anotherValue"
}`}</code></pre>
                    </div>
                    <ul className="space-y-2 text-sm text-slate-700">
                      <li className="flex items-start gap-2">
                        <span className="text-orange-600 font-bold mt-0.5">•</span>
                        <span>Keys must be <strong>strings</strong> in double quotes</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-600 font-bold mt-0.5">•</span>
                        <span>Values can be any JSON data type</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-600 font-bold mt-0.5">•</span>
                        <span>Comma separates each key-value pair</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-600 font-bold mt-0.5">•</span>
                        <span>No comma after the last pair</span>
                      </li>
                    </ul>
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 mb-4 mt-8">Real-World Examples</h3>

                  <div className="space-y-6">
                    <div className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-6">
                      <h4 className="text-lg font-bold text-blue-900 mb-3">User Profile Object</h4>
                      <div className="rounded-lg bg-slate-900 p-4">
                        <pre className="text-xs text-green-400 font-mono"><code>{`{
  "userId": 12345,
  "username": "johndoe",
  "email": "john@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "age": 30,
  "isActive": true,
  "role": "admin"
}`}</code></pre>
                      </div>
                    </div>

                    <div className="rounded-2xl border-2 border-purple-200 bg-purple-50 p-6">
                      <h4 className="text-lg font-bold text-purple-900 mb-3">Product Object</h4>
                      <div className="rounded-lg bg-slate-900 p-4">
                        <pre className="text-xs text-green-400 font-mono"><code>{`{
  "productId": "ABC123",
  "name": "Wireless Headphones",
  "price": 99.99,
  "currency": "USD",
  "inStock": true,
  "rating": 4.5,
  "reviewCount": 1247
}`}</code></pre>
                      </div>
                    </div>

                    <div className="rounded-2xl border-2 border-pink-200 bg-pink-50 p-6">
                      <h4 className="text-lg font-bold text-pink-900 mb-3">API Response Object</h4>
                      <div className="rounded-lg bg-slate-900 p-4">
                        <pre className="text-xs text-green-400 font-mono"><code>{`{
  "status": "success",
  "message": "Data retrieved successfully",
  "timestamp": "2026-01-01T12:00:00Z",
  "responseTime": 45
}`}</code></pre>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-6">
                    <h3 className="text-xl font-bold text-emerald-900 mb-3 flex items-center gap-2">
                      <span>💡</span> Pro Tip
                    </h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Object keys should be <strong>descriptive</strong> and use <strong>camelCase</strong> or <strong>snake_case</strong> consistently. 
                      Good: <code className="bg-white px-2 py-1 rounded">"firstName"</code> or <code className="bg-white px-2 py-1 rounded">"first_name"</code>. 
                      Avoid: <code className="bg-white px-2 py-1 rounded">"fn"</code> or <code className="bg-white px-2 py-1 rounded">"First Name"</code> (with spaces).
                    </p>
                  </div>
                </div>
              </section>

              {/* Chapter 5: JSON Arrays */}
              <section id="chapter5" className="scroll-mt-20 rounded-3xl border border-slate-200 bg-white p-6 md:p-10 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-bold text-xl shadow-lg">
                    5
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900">JSON Arrays</h2>
                    <p className="text-sm text-slate-600 mt-1">7 min read</p>
                  </div>
                </div>

                <div className="prose prose-slate max-w-none">
                  <p className="text-lg text-slate-700 leading-relaxed mb-6">
                    Arrays store <strong>ordered lists</strong> of values wrapped in square brackets <code className="bg-slate-100 px-2 py-1 rounded text-sm">[]</code>. 
                    Arrays can contain any JSON data type, including other arrays and objects.
                  </p>

                  <div className="rounded-2xl border-2 border-cyan-200 bg-cyan-50 p-6 mb-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-4">Array Structure</h3>
                    <div className="rounded-lg bg-slate-900 p-4 mb-4">
                      <pre className="text-sm text-green-400 font-mono"><code>{`["value1", "value2", "value3"]`}</code></pre>
                    </div>
                    <ul className="space-y-2 text-sm text-slate-700">
                      <li className="flex items-start gap-2">
                        <span className="text-cyan-600 font-bold mt-0.5">•</span>
                        <span>Values are separated by commas</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-cyan-600 font-bold mt-0.5">•</span>
                        <span>Order matters (arrays are indexed from 0)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-cyan-600 font-bold mt-0.5">•</span>
                        <span>Can contain mixed data types</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-cyan-600 font-bold mt-0.5">•</span>
                        <span>Arrays can be empty: <code className="bg-white px-2 py-1 rounded">[]</code></span>
                      </li>
                    </ul>
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 mb-4 mt-8">Array Examples</h3>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-5">
                      <h4 className="text-base font-bold text-blue-900 mb-3">String Array</h4>
                      <div className="rounded-lg bg-slate-900 p-3">
                        <pre className="text-xs text-green-400 font-mono"><code>{`{
  "fruits": [
    "apple",
    "banana",
    "orange",
    "grape"
  ]
}`}</code></pre>
                      </div>
                    </div>

                    <div className="rounded-2xl border-2 border-purple-200 bg-purple-50 p-5">
                      <h4 className="text-base font-bold text-purple-900 mb-3">Number Array</h4>
                      <div className="rounded-lg bg-slate-900 p-3">
                        <pre className="text-xs text-green-400 font-mono"><code>{`{
  "scores": [
    95,
    87,
    92,
    78,
    100
  ]
}`}</code></pre>
                      </div>
                    </div>

                    <div className="rounded-2xl border-2 border-pink-200 bg-pink-50 p-5">
                      <h4 className="text-base font-bold text-pink-900 mb-3">Mixed Type Array</h4>
                      <div className="rounded-lg bg-slate-900 p-3">
                        <pre className="text-xs text-green-400 font-mono"><code>{`{
  "data": [
    "text",
    42,
    true,
    null
  ]
}`}</code></pre>
                      </div>
                    </div>

                    <div className="rounded-2xl border-2 border-orange-200 bg-orange-50 p-5">
                      <h4 className="text-base font-bold text-orange-900 mb-3">Array of Objects</h4>
                      <div className="rounded-lg bg-slate-900 p-3">
                        <pre className="text-xs text-green-400 font-mono"><code>{`{
  "users": [
    {"id": 1, "name": "Alice"},
    {"id": 2, "name": "Bob"},
    {"id": 3, "name": "Carol"}
  ]
}`}</code></pre>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 rounded-2xl border-2 border-yellow-200 bg-yellow-50 p-6">
                    <h3 className="text-xl font-bold text-yellow-900 mb-3 flex items-center gap-2">
                      <span>⚡</span> Common Use Cases
                    </h3>
                    <ul className="space-y-2 text-sm text-slate-700">
                      <li className="flex items-start gap-2">
                        <span className="text-yellow-600 font-bold mt-0.5">•</span>
                        <span><strong>Lists:</strong> Shopping cart items, to-do tasks, menu items</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-yellow-600 font-bold mt-0.5">•</span>
                        <span><strong>Collections:</strong> User list, product catalog, blog posts</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-yellow-600 font-bold mt-0.5">•</span>
                        <span><strong>Tags/Categories:</strong> <code className="bg-white px-2 py-1 rounded">{`["javascript", "json", "tutorial"]`}</code></span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-yellow-600 font-bold mt-0.5">•</span>
                        <span><strong>Time series:</strong> Daily temperatures, stock prices, page views</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Chapter 6: Nested JSON */}
              <section id="chapter6" className="scroll-mt-20 rounded-3xl border border-slate-200 bg-white p-6 md:p-10 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-xl shadow-lg">
                    6
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900">Nested JSON</h2>
                    <p className="text-sm text-slate-600 mt-1">10 min read</p>
                  </div>
                </div>

                <div className="prose prose-slate max-w-none">
                  <p className="text-lg text-slate-700 leading-relaxed mb-6">
                    <strong>Nested JSON</strong> means placing objects inside objects, or arrays inside arrays, to create complex hierarchical data structures. 
                    This is where JSON really shines for representing real-world data.
                  </p>

                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Objects in Objects</h3>

                  <div className="rounded-2xl border-2 border-indigo-200 bg-indigo-50 p-6 mb-6">
                    <div className="rounded-lg bg-slate-900 p-4">
                      <pre className="text-sm text-green-400 font-mono"><code>{`{
  "user": {
    "id": 12345,
    "profile": {
      "firstName": "Jane",
      "lastName": "Smith",
      "contact": {
        "email": "jane@example.com",
        "phone": "+1-555-0100",
        "address": {
          "street": "123 Main St",
          "city": "New York",
          "zipCode": "10001"
        }
      }
    },
    "preferences": {
      "theme": "dark",
      "notifications": true,
      "language": "en"
    }
  }
}`}</code></pre>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 mb-4 mt-8">Arrays in Objects</h3>

                  <div className="rounded-2xl border-2 border-purple-200 bg-purple-50 p-6 mb-6">
                    <div className="rounded-lg bg-slate-900 p-4">
                      <pre className="text-sm text-green-400 font-mono"><code>{`{
  "company": "TechCorp",
  "employees": [
    {
      "id": 1,
      "name": "Alice Johnson",
      "role": "Engineer",
      "skills": ["JavaScript", "Python", "React"]
    },
    {
      "id": 2,
      "name": "Bob Williams",
      "role": "Designer",
      "skills": ["Figma", "Photoshop", "CSS"]
    }
  ],
  "departments": ["Engineering", "Design", "Marketing"]
}`}</code></pre>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 mb-4 mt-8">Arrays in Arrays</h3>

                  <div className="rounded-2xl border-2 border-pink-200 bg-pink-50 p-6 mb-6">
                    <div className="rounded-lg bg-slate-900 p-4">
                      <pre className="text-sm text-green-400 font-mono"><code>{`{
  "matrix": [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
  ],
  "calendar": [
    ["Mon", "Tue", "Wed", "Thu", "Fri"],
    ["1", "2", "3", "4", "5"],
    ["8", "9", "10", "11", "12"]
  ]
}`}</code></pre>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 mb-4 mt-8">Complex Real-World Example</h3>

                  <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-6">
                    <h4 className="text-lg font-bold text-emerald-900 mb-3">E-commerce Order</h4>
                    <div className="rounded-lg bg-slate-900 p-4">
                      <pre className="text-xs text-green-400 font-mono overflow-x-auto"><code>{`{
  "orderId": "ORD-2026-001",
  "customer": {
    "id": 789,
    "name": "John Doe",
    "email": "john@example.com",
    "shippingAddress": {
      "street": "456 Oak Avenue",
      "city": "Los Angeles",
      "state": "CA",
      "zipCode": "90001",
      "country": "USA"
    }
  },
  "items": [
    {
      "productId": "P001",
      "name": "Laptop",
      "quantity": 1,
      "price": 999.99,
      "specifications": {
        "brand": "TechBrand",
        "model": "Pro 15",
        "ram": "16GB",
        "storage": "512GB SSD"
      }
    },
    {
      "productId": "P002",
      "name": "Mouse",
      "quantity": 2,
      "price": 29.99
    }
  ],
  "payment": {
    "method": "credit_card",
    "last4": "4242",
    "status": "completed"
  },
  "totals": {
    "subtotal": 1059.97,
    "tax": 84.80,
    "shipping": 15.00,
    "total": 1159.77
  },
  "status": "shipped",
  "tracking": {
    "carrier": "FedEx",
    "trackingNumber": "1234567890",
    "estimatedDelivery": "2026-01-05"
  }
}`}</code></pre>
                    </div>
                  </div>

                  <div className="mt-8 rounded-2xl border-2 border-blue-200 bg-blue-50 p-6">
                    <h3 className="text-xl font-bold text-blue-900 mb-3 flex items-center gap-2">
                      <span>📏</span> Nesting Best Practices
                    </h3>
                    <ul className="space-y-2 text-sm text-slate-700">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold mt-0.5">1.</span>
                        <span><strong>Keep it shallow:</strong> Avoid nesting more than 3-4 levels deep (makes it hard to read)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold mt-0.5">2.</span>
                        <span><strong>Use meaningful names:</strong> Keys should clearly indicate what the nested data represents</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold mt-0.5">3.</span>
                        <span><strong>Group related data:</strong> Nest data that logically belongs together (like address fields)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold mt-0.5">4.</span>
                        <span><strong>Consider performance:</strong> Very deep nesting can slow down parsing in some languages</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Chapter 7: JSON vs XML */}
              <section id="chapter7" className="scroll-mt-20 rounded-3xl border border-slate-200 bg-white p-6 md:p-10 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 text-white font-bold text-xl shadow-lg">
                    7
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900">JSON vs XML</h2>
                    <p className="text-sm text-slate-600 mt-1">6 min read</p>
                  </div>
                </div>

                <div className="prose prose-slate max-w-none">
                  <p className="text-lg text-slate-700 leading-relaxed mb-6">
                    Before JSON became popular, <strong>XML (eXtensible Markup Language)</strong> was the standard for data exchange. 
                    Let's compare them to understand why JSON won.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-6">
                      <h3 className="text-xl font-bold text-emerald-900 mb-4 flex items-center gap-2">
                        <span>📄</span> JSON Format
                      </h3>
                      <div className="rounded-lg bg-slate-900 p-4">
                        <pre className="text-xs text-green-400 font-mono"><code>{`{
  "person": {
    "name": "John Doe",
    "age": 30,
    "email": "john@example.com",
    "active": true
  }
}`}</code></pre>
                      </div>
                      <p className="text-xs text-slate-600 mt-3"><strong>Size:</strong> 112 bytes</p>
                    </div>

                    <div className="rounded-2xl border-2 border-orange-200 bg-orange-50 p-6">
                      <h3 className="text-xl font-bold text-orange-900 mb-4 flex items-center gap-2">
                        <span>📋</span> XML Format
                      </h3>
                      <div className="rounded-lg bg-slate-900 p-4">
                        <pre className="text-xs text-orange-400 font-mono"><code>{`<?xml version="1.0"?>
<person>
  <name>John Doe</name>
  <age>30</age>
  <email>john@example.com</email>
  <active>true</active>
</person>`}</code></pre>
                      </div>
                      <p className="text-xs text-slate-600 mt-3"><strong>Size:</strong> 156 bytes (39% larger)</p>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Detailed Comparison</h3>

                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b-2 border-slate-300">
                          <th className="text-left p-4 font-bold text-slate-900 bg-slate-100">Feature</th>
                          <th className="text-left p-4 font-bold text-emerald-900 bg-emerald-50">JSON</th>
                          <th className="text-left p-4 font-bold text-orange-900 bg-orange-50">XML</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        <tr className="border-b border-slate-200">
                          <td className="p-4 font-semibold text-slate-700">Readability</td>
                          <td className="p-4 text-emerald-700">✓ Easy to read</td>
                          <td className="p-4 text-orange-700">Verbose, harder to read</td>
                        </tr>
                        <tr className="border-b border-slate-200 bg-slate-50">
                          <td className="p-4 font-semibold text-slate-700">File Size</td>
                          <td className="p-4 text-emerald-700">✓ Smaller (20-40% less)</td>
                          <td className="p-4 text-orange-700">Larger (tags + closing tags)</td>
                        </tr>
                        <tr className="border-b border-slate-200">
                          <td className="p-4 font-semibold text-slate-700">Parsing Speed</td>
                          <td className="p-4 text-emerald-700">✓ Faster</td>
                          <td className="p-4 text-orange-700">Slower</td>
                        </tr>
                        <tr className="border-b border-slate-200 bg-slate-50">
                          <td className="p-4 font-semibold text-slate-700">Data Types</td>
                          <td className="p-4 text-emerald-700">✓ Native (string, number, boolean, null)</td>
                          <td className="p-4 text-orange-700">Everything is text</td>
                        </tr>
                        <tr className="border-b border-slate-200">
                          <td className="p-4 font-semibold text-slate-700">Arrays</td>
                          <td className="p-4 text-emerald-700">✓ Native support</td>
                          <td className="p-4 text-orange-700">Repeated elements</td>
                        </tr>
                        <tr className="border-b border-slate-200 bg-slate-50">
                          <td className="p-4 font-semibold text-slate-700">Comments</td>
                          <td className="p-4 text-orange-700">Not supported</td>
                          <td className="p-4 text-emerald-700">✓ Supported</td>
                        </tr>
                        <tr className="border-b border-slate-200">
                          <td className="p-4 font-semibold text-slate-700">Attributes</td>
                          <td className="p-4 text-orange-700">Not supported</td>
                          <td className="p-4 text-emerald-700">✓ Supported</td>
                        </tr>
                        <tr className="border-b border-slate-200 bg-slate-50">
                          <td className="p-4 font-semibold text-slate-700">Schema Validation</td>
                          <td className="p-4 text-emerald-700">JSON Schema</td>
                          <td className="p-4 text-emerald-700">✓ XSD (more mature)</td>
                        </tr>
                        <tr className="border-b border-slate-200">
                          <td className="p-4 font-semibold text-slate-700">Browser Support</td>
                          <td className="p-4 text-emerald-700">✓ Native JavaScript</td>
                          <td className="p-4 text-orange-700">Requires parser</td>
                        </tr>
                        <tr className="bg-slate-50">
                          <td className="p-4 font-semibold text-slate-700">Use Cases</td>
                          <td className="p-4 text-emerald-700">✓ APIs, config files, web apps</td>
                          <td className="p-4 text-orange-700">Documents, legacy systems</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-8 grid md:grid-cols-2 gap-6">
                    <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-6">
                      <h3 className="text-lg font-bold text-emerald-900 mb-3 flex items-center gap-2">
                        <span>✓</span> When to Use JSON
                      </h3>
                      <ul className="space-y-2 text-sm text-slate-700">
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-600 font-bold mt-0.5">•</span>
                          <span>RESTful APIs</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-600 font-bold mt-0.5">•</span>
                          <span>Web applications & mobile apps</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-600 font-bold mt-0.5">•</span>
                          <span>Configuration files</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-600 font-bold mt-0.5">•</span>
                          <span>NoSQL databases (MongoDB)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-600 font-bold mt-0.5">•</span>
                          <span>When file size matters</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-600 font-bold mt-0.5">•</span>
                          <span>When speed matters</span>
                        </li>
                      </ul>
                    </div>

                    <div className="rounded-2xl border-2 border-orange-200 bg-orange-50 p-6">
                      <h3 className="text-lg font-bold text-orange-900 mb-3 flex items-center gap-2">
                        <span>✓</span> When to Use XML
                      </h3>
                      <ul className="space-y-2 text-sm text-slate-700">
                        <li className="flex items-start gap-2">
                          <span className="text-orange-600 font-bold mt-0.5">•</span>
                          <span>Document-centric data (HTML-like)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-orange-600 font-bold mt-0.5">•</span>
                          <span>When you need comments</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-orange-600 font-bold mt-0.5">•</span>
                          <span>Complex schema validation (XSD)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-orange-600 font-bold mt-0.5">•</span>
                          <span>Legacy system integration</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-orange-600 font-bold mt-0.5">•</span>
                          <span>SOAP web services</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-orange-600 font-bold mt-0.5">•</span>
                          <span>When attributes are needed</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-8 rounded-2xl border-2 border-blue-200 bg-blue-50 p-6">
                    <h3 className="text-xl font-bold text-blue-900 mb-3 flex items-center gap-2">
                      <span>🏆</span> The Winner?
                    </h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      For modern web development, <strong>JSON is the clear winner</strong>. It's simpler, faster, and better suited for APIs and web applications. 
                      However, XML still has its place in document-based systems and enterprise environments. Many developers now use both: 
                      JSON for APIs and data exchange, XML for configuration and documents.
                    </p>
                  </div>
                </div>
              </section>

              {/* Chapter 8: Common Mistakes */}
              <section id="chapter8" className="scroll-mt-20 rounded-3xl border border-slate-200 bg-white p-6 md:p-10 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-pink-600 text-white font-bold text-xl shadow-lg">
                    8
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900">Common Mistakes</h2>
                    <p className="text-sm text-slate-600 mt-1">8 min read</p>
                  </div>
                </div>

                <div className="prose prose-slate max-w-none">
                  <p className="text-lg text-slate-700 leading-relaxed mb-6">
                    Even experienced developers make JSON mistakes. Here are the most common errors and how to fix them.
                  </p>

                  <div className="space-y-6">
                    {[
                      {
                        number: 1,
                        title: 'Trailing Commas',
                        wrong: `{
  "name": "John",
  "age": 30,
}`,
                        right: `{
  "name": "John",
  "age": 30
}`,
                        explanation: 'JSON does not allow commas after the last item in an object or array. Remove trailing commas.',
                        severity: 'high'
                      },
                      {
                        number: 2,
                        title: 'Single Quotes',
                        wrong: `{
  'name': 'John',
  'age': 30
}`,
                        right: `{
  "name": "John",
  "age": 30
}`,
                        explanation: 'JSON requires double quotes for both keys and string values. Single quotes are not valid.',
                        severity: 'high'
                      },
                      {
                        number: 3,
                        title: 'Unquoted Keys',
                        wrong: `{
  name: "John",
  age: 30
}`,
                        right: `{
  "name": "John",
  "age": 30
}`,
                        explanation: 'All object keys must be strings wrapped in double quotes. Unquoted keys are JavaScript, not JSON.',
                        severity: 'high'
                      },
                      {
                        number: 4,
                        title: 'Comments',
                        wrong: `{
  // This is a comment
  "name": "John",
  "age": 30
}`,
                        right: `{
  "name": "John",
  "age": 30
}`,
                        explanation: 'JSON does not support comments. If you need explanations, use a "comment" or "_note" key with a string value.',
                        severity: 'medium'
                      },
                      {
                        number: 5,
                        title: 'Undefined Values',
                        wrong: `{
  "name": "John",
  "middleName": undefined
}`,
                        right: `{
  "name": "John",
  "middleName": null
}`,
                        explanation: 'Use null for "no value", not undefined. Undefined is not a valid JSON value.',
                        severity: 'high'
                      },
                      {
                        number: 6,
                        title: 'Functions',
                        wrong: `{
  "name": "John",
  "greet": function() {
    return "Hello";
  }
}`,
                        right: `{
  "name": "John",
  "greeting": "Hello"
}`,
                        explanation: 'JSON can only store data, not functions. Store function results or use strings to represent actions.',
                        severity: 'high'
                      },
                      {
                        number: 7,
                        title: 'Missing Closing Brackets',
                        wrong: `{
  "person": {
    "name": "John",
    "age": 30
  }`,
                        right: `{
  "person": {
    "name": "John",
    "age": 30
  }
}`,
                        explanation: 'Every opening brace or bracket must have a matching closing one. Count carefully when nesting.',
                        severity: 'high'
                      },
                      {
                        number: 8,
                        title: 'Duplicate Keys',
                        wrong: `{
  "name": "John",
  "name": "Jane"
}`,
                        right: `{
  "firstName": "John",
  "lastName": "Jane"
}`,
                        explanation: 'Each key in an object must be unique. Duplicate keys will cause the last value to override previous ones.',
                        severity: 'medium'
                      }
                    ].map((mistake) => (
                      <div key={mistake.number} className="rounded-2xl border-2 border-red-200 bg-red-50 p-6">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-red-600 text-white font-bold text-lg">
                            {mistake.number}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-red-900 mb-2">{mistake.title}</h3>
                            <p className="text-sm text-slate-700 mb-4">{mistake.explanation}</p>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                            mistake.severity === 'high' ? 'bg-red-600 text-white' : 'bg-orange-200 text-orange-800'
                          }`}>
                            {mistake.severity.toUpperCase()}
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-bold text-red-900 mb-2 flex items-center gap-2">
                              <span>✗</span> Wrong
                            </h4>
                            <div className="rounded-lg bg-slate-900 p-3">
                              <pre className="text-xs text-red-400 font-mono"><code>{mistake.wrong}</code></pre>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm font-bold text-emerald-900 mb-2 flex items-center gap-2">
                              <span>✓</span> Correct
                            </h4>
                            <div className="rounded-lg bg-slate-900 p-3">
                              <pre className="text-xs text-green-400 font-mono"><code>{mistake.right}</code></pre>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 rounded-2xl border-2 border-blue-200 bg-blue-50 p-6">
                    <h3 className="text-xl font-bold text-blue-900 mb-3 flex items-center gap-2">
                      <span>🛠️</span> How to Catch Errors
                    </h3>
                    <ul className="space-y-2 text-sm text-slate-700">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold mt-0.5">1.</span>
                        <span><strong>Use a JSON validator:</strong> Tools like <Link href="/json/json-validator" className="text-blue-700 underline">our JSON Validator</Link> catch errors instantly</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold mt-0.5">2.</span>
                        <span><strong>Enable linting in your editor:</strong> VS Code, Sublime, and most IDEs have JSON validation built-in</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold mt-0.5">3.</span>
                        <span><strong>Test with JSON.parse():</strong> In JavaScript, wrap parsing in try-catch to handle errors gracefully</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold mt-0.5">4.</span>
                        <span><strong>Use formatters:</strong> <Link href="/json/json-formatter" className="text-blue-700 underline">JSON formatters</Link> help spot structural issues visually</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Chapter 9: Best Practices */}
              <section id="chapter9" className="scroll-mt-20 rounded-3xl border border-slate-200 bg-white p-6 md:p-10 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white font-bold text-xl shadow-lg">
                    9
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900">Best Practices</h2>
                    <p className="text-sm text-slate-600 mt-1">10 min read</p>
                  </div>
                </div>

                <div className="prose prose-slate max-w-none">
                  <p className="text-lg text-slate-700 leading-relaxed mb-6">
                    Follow these industry-standard best practices to write clean, maintainable, and efficient JSON.
                  </p>

                  <div className="space-y-6">
                    {[
                      {
                        number: 1,
                        title: 'Use Consistent Naming Conventions',
                        icon: '📝',
                        color: 'blue',
                        content: (
                          <>
                            <p className="text-sm text-slate-700 mb-3">Choose a naming style and stick with it across your entire project.</p>
                            <div className="grid md:grid-cols-2 gap-3">
                              <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3">
                                <p className="text-xs font-bold text-emerald-900 mb-2">✓ camelCase (recommended)</p>
                                <code className="text-xs text-slate-700">{`{"firstName": "John", "lastName": "Doe"}`}</code>
                              </div>
                              <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3">
                                <p className="text-xs font-bold text-emerald-900 mb-2">✓ snake_case (also valid)</p>
                                <code className="text-xs text-slate-700">{`{"first_name": "John", "last_name": "Doe"}`}</code>
                              </div>
                            </div>
                            <div className="mt-3 rounded-lg bg-red-50 border border-red-200 p-3">
                              <p className="text-xs font-bold text-red-900 mb-2">✗ Mixed styles (avoid)</p>
                              <code className="text-xs text-slate-700">{`{"firstName": "John", "last_name": "Doe"}`}</code>
                            </div>
                          </>
                        )
                      },
                      {
                        number: 2,
                        title: 'Keep JSON Simple and Flat',
                        icon: '📊',
                        color: 'purple',
                        content: (
                          <>
                            <p className="text-sm text-slate-700 mb-3">Avoid excessive nesting. If your JSON is more than 3-4 levels deep, consider restructuring.</p>
                            <div className="grid md:grid-cols-2 gap-3">
                              <div className="rounded-lg bg-red-50 border border-red-200 p-3">
                                <p className="text-xs font-bold text-red-900 mb-2">✗ Too deeply nested</p>
                                <pre className="text-xs text-slate-700 overflow-x-auto"><code>{`{
  "data": {
    "user": {
      "profile": {
        "address": {
          "primary": {
            "street": "..."
          }
        }
      }
    }
  }
}`}</code></pre>
                              </div>
                              <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3">
                                <p className="text-xs font-bold text-emerald-900 mb-2">✓ Flatter structure</p>
                                <pre className="text-xs text-slate-700 overflow-x-auto"><code>{`{
  "userId": 123,
  "profileId": 456,
  "primaryAddress": {
    "street": "..."
  }
}`}</code></pre>
                              </div>
                            </div>
                          </>
                        )
                      },
                      {
                        number: 3,
                        title: 'Use Meaningful, Descriptive Keys',
                        icon: '🏷️',
                        color: 'orange',
                        content: (
                          <>
                            <p className="text-sm text-slate-700 mb-3">Key names should clearly indicate what the value represents. Avoid abbreviations unless they're industry-standard.</p>
                            <div className="grid md:grid-cols-2 gap-3">
                              <div className="rounded-lg bg-red-50 border border-red-200 p-3">
                                <p className="text-xs font-bold text-red-900 mb-2">✗ Unclear abbreviations</p>
                                <code className="text-xs text-slate-700">{`{"fn": "John", "ln": "Doe", "dob": "1990-01-01"}`}</code>
                              </div>
                              <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3">
                                <p className="text-xs font-bold text-emerald-900 mb-2">✓ Clear, descriptive names</p>
                                <code className="text-xs text-slate-700">{`{"firstName": "John", "lastName": "Doe", "birthDate": "1990-01-01"}`}</code>
                              </div>
                            </div>
                          </>
                        )
                      },
                      {
                        number: 4,
                        title: 'Always Validate JSON',
                        icon: '✓',
                        color: 'green',
                        content: (
                          <>
                            <p className="text-sm text-slate-700 mb-3">Before deploying, always validate your JSON. Invalid JSON will break APIs and applications.</p>
                            <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                              <p className="text-sm font-bold text-blue-900 mb-2">Validation Tools:</p>
                              <ul className="space-y-1 text-sm text-slate-700">
                                <li className="flex items-center gap-2">
                                  <span className="text-blue-600">•</span>
                                  <Link href="/json/json-validator" className="text-blue-700 underline font-semibold">FixTools JSON Validator</Link> - Instant online validation
                                </li>
                                <li className="flex items-center gap-2">
                                  <span className="text-blue-600">•</span>
                                  <span>VS Code built-in validator (automatic)</span>
                                </li>
                                <li className="flex items-center gap-2">
                                  <span className="text-blue-600">•</span>
                                  <span>Command-line: <code className="bg-white px-2 py-1 rounded text-xs">jq</code> or <code className="bg-white px-2 py-1 rounded text-xs">python -m json.tool</code></span>
                                </li>
                              </ul>
                            </div>
                          </>
                        )
                      },
                      {
                        number: 5,
                        title: 'Format for Development, Minify for Production',
                        icon: '⚡',
                        color: 'yellow',
                        content: (
                          <>
                            <p className="text-sm text-slate-700 mb-3">Use formatted JSON during development for readability, but minify for production to reduce file size.</p>
                            <div className="grid md:grid-cols-2 gap-3">
                              <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3">
                                <p className="text-xs font-bold text-emerald-900 mb-2">✓ Development (formatted)</p>
                                <pre className="text-xs text-slate-700"><code>{`{
  "name": "John",
  "age": 30
}`}</code></pre>
                                <p className="text-xs text-slate-600 mt-2">Easy to read and debug</p>
                              </div>
                              <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
                                <p className="text-xs font-bold text-blue-900 mb-2">✓ Production (minified)</p>
                                <pre className="text-xs text-slate-700"><code>{`{"name":"John","age":30}`}</code></pre>
                                <p className="text-xs text-slate-600 mt-2">Smaller file size, faster transmission</p>
                              </div>
                            </div>
                            <p className="text-xs text-slate-600 mt-3">
                              Use <Link href="/json/json-formatter" className="text-blue-700 underline">JSON Formatter</Link> for development and <Link href="/json/minify-json" className="text-blue-700 underline">JSON Minifier</Link> for production.
                            </p>
                          </>
                        )
                      },
                      {
                        number: 6,
                        title: 'Use Appropriate Data Types',
                        icon: '🔢',
                        color: 'indigo',
                        content: (
                          <>
                            <p className="text-sm text-slate-700 mb-3">Choose the right data type for each value. Don't store numbers as strings or booleans as numbers.</p>
                            <div className="grid md:grid-cols-2 gap-3">
                              <div className="rounded-lg bg-red-50 border border-red-200 p-3">
                                <p className="text-xs font-bold text-red-900 mb-2">✗ Wrong types</p>
                                <pre className="text-xs text-slate-700"><code>{`{
  "age": "30",
  "price": "19.99",
  "isActive": 1
}`}</code></pre>
                              </div>
                              <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3">
                                <p className="text-xs font-bold text-emerald-900 mb-2">✓ Correct types</p>
                                <pre className="text-xs text-slate-700"><code>{`{
  "age": 30,
  "price": 19.99,
  "isActive": true
}`}</code></pre>
                              </div>
                            </div>
                          </>
                        )
                      },
                      {
                        number: 7,
                        title: 'Handle Null Values Consistently',
                        icon: '∅',
                        color: 'slate',
                        content: (
                          <>
                            <p className="text-sm text-slate-700 mb-3">Decide whether to use null for missing values or omit the key entirely. Be consistent across your API.</p>
                            <div className="grid md:grid-cols-2 gap-3">
                              <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
                                <p className="text-xs font-bold text-blue-900 mb-2">Option A: Include null</p>
                                <pre className="text-xs text-slate-700"><code>{`{
  "firstName": "John",
  "middleName": null,
  "lastName": "Doe"
}`}</code></pre>
                              </div>
                              <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
                                <p className="text-xs font-bold text-blue-900 mb-2">Option B: Omit key</p>
                                <pre className="text-xs text-slate-700"><code>{`{
  "firstName": "John",
  "lastName": "Doe"
}`}</code></pre>
                              </div>
                            </div>
                            <p className="text-xs text-slate-600 mt-3"><strong>Both are valid</strong> — choose one approach and stick with it throughout your project.</p>
                          </>
                        )
                      },
                      {
                        number: 8,
                        title: 'Document Your JSON Schema',
                        icon: '📚',
                        color: 'pink',
                        content: (
                          <>
                            <p className="text-sm text-slate-700 mb-3">For APIs, document your JSON structure using JSON Schema or API documentation tools like Swagger/OpenAPI.</p>
                            <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                              <p className="text-sm font-bold text-blue-900 mb-2">JSON Schema Example:</p>
                              <pre className="text-xs text-slate-700 overflow-x-auto"><code>{`{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "name": {"type": "string"},
    "age": {"type": "number"},
    "email": {"type": "string", "format": "email"}
  },
  "required": ["name", "email"]
}`}</code></pre>
                            </div>
                          </>
                        )
                      },
                      {
                        number: 9,
                        title: 'Use Arrays for Lists, Objects for Records',
                        icon: '📋',
                        color: 'teal',
                        content: (
                          <>
                            <p className="text-sm text-slate-700 mb-3">Arrays are for ordered collections of similar items. Objects are for structured data with named properties.</p>
                            <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-4">
                              <p className="text-xs font-bold text-emerald-900 mb-2">✓ Correct usage</p>
                              <pre className="text-xs text-slate-700 overflow-x-auto"><code>{`{
  "user": {
    "name": "John",
    "email": "john@example.com"
  },
  "purchases": [
    {"id": 1, "product": "Laptop"},
    {"id": 2, "product": "Mouse"}
  ]
}`}</code></pre>
                            </div>
                          </>
                        )
                      },
                      {
                        number: 10,
                        title: 'Version Your API Responses',
                        icon: '🔄',
                        color: 'cyan',
                        content: (
                          <>
                            <p className="text-sm text-slate-700 mb-3">Include version information in your JSON responses to manage API changes over time.</p>
                            <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                              <pre className="text-xs text-slate-700"><code>{`{
  "apiVersion": "1.0",
  "data": {
    "users": [...]
  }
}`}</code></pre>
                            </div>
                            <p className="text-xs text-slate-600 mt-3">This helps clients know which response format to expect and makes migrations easier.</p>
                          </>
                        )
                      }
                    ].map((practice) => (
                      <div key={practice.number} className={`rounded-2xl border-2 border-${practice.color}-200 bg-${practice.color}-50 p-6`}>
                        <div className="flex items-start gap-4 mb-4">
                          <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-${practice.color}-500 to-${practice.color}-600 text-white font-bold text-xl shadow-lg`}>
                            {practice.number}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-slate-900 mb-1 flex items-center gap-2">
                              <span>{practice.icon}</span>
                              {practice.title}
                            </h3>
                          </div>
                        </div>
                        <div className="ml-16">
                          {practice.content}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 rounded-2xl border-2 border-emerald-300 bg-gradient-to-br from-emerald-50 to-green-50 p-6">
                    <h3 className="text-xl font-bold text-emerald-900 mb-3 flex items-center gap-2">
                      <span>🎯</span> Key Takeaways
                    </h3>
                    <ul className="space-y-2 text-sm text-slate-700">
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                        <span><strong>Be consistent</strong> with naming, formatting, and null handling</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                        <span><strong>Keep it simple</strong> — avoid excessive nesting and complexity</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                        <span><strong>Always validate</strong> before deploying to production</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                        <span><strong>Format for humans, minify for machines</strong></span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                        <span><strong>Document your schema</strong> for API consumers</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

            </main>
          </div>
        </div>

        {/* Tools CTA */}
        <section id="chapter10" className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-600 to-green-600 p-8 md:p-12 shadow-2xl">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Practice?</h2>
              <p className="text-lg text-emerald-50 max-w-2xl mx-auto mb-8">
                Now that you understand JSON, try our professional tools to format, validate, minify, and convert JSON data.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link 
                  href="/json/json-formatter"
                  className="rounded-xl bg-white px-6 py-3 text-base font-semibold text-emerald-600 shadow-lg transition-all hover:bg-emerald-50 hover:scale-[1.02]"
                >
                  JSON Formatter
                </Link>
                <Link 
                  href="/json/json-validator"
                  className="rounded-xl bg-white px-6 py-3 text-base font-semibold text-emerald-600 shadow-lg transition-all hover:bg-emerald-50 hover:scale-[1.02]"
                >
                  JSON Validator
                </Link>
                <Link 
                  href="/categories/json-tools"
                  className="rounded-xl border-2 border-white/30 bg-white/10 backdrop-blur-sm px-6 py-3 text-base font-semibold text-white transition-all hover:bg-white/20"
                >
                  View All Tools →
                </Link>
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

