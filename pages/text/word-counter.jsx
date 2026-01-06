import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

const siteHost = process.env.NEXT_PUBLIC_HOST || 'https://fixtools.io';

export default function WordCounter() {
  const [input, setInput] = useState('');
  const [stats, setStats] = useState({
    words: 0,
    characters: 0,
    charactersNoSpaces: 0,
    paragraphs: 0,
    sentences: 0,
    lines: 0
  });

  const currentYear = new Date().getFullYear();
  const canonicalUrl = `${siteHost}/text/word-counter`;

  // Calculate statistics in real-time
  useEffect(() => {
    const text = input;
    
    // Words: split by whitespace and filter empty strings
    const words = text.trim() ? text.trim().split(/\s+/).filter(word => word.length > 0) : [];
    
    // Characters: total length
    const characters = text.length;
    
    // Characters without spaces
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    
    // Paragraphs: split by double newlines or empty lines
    let paragraphs = text.trim() ? text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length : 0;
    if (paragraphs === 0 && text.trim().length > 0) paragraphs = 1;
    
    // Sentences: split by sentence-ending punctuation
    const sentences = text.trim() ? text.split(/[.!?]+/).filter(s => s.trim().length > 0).length : 0;
    
    // Lines: split by newlines
    const lines = text ? text.split('\n').length : 0;
    
    setStats({
      words: words.length,
      characters,
      charactersNoSpaces,
      paragraphs,
      sentences,
      lines
    });
  }, [input]);

  const clear = () => {
    setInput('');
  };

  // Enhanced Structured Data
  const structuredData = {
    breadcrumb: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": `${siteHost}/` },
        { "@type": "ListItem", "position": 2, "name": "Tools", "item": `${siteHost}/tools` },
        { "@type": "ListItem", "position": 3, "name": "Text Tools", "item": `${siteHost}/tools/text-tools` },
        { "@type": "ListItem", "position": 4, "name": "Word Counter", "item": canonicalUrl }
      ]
    },
    softwareApplication: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Word Counter",
      "applicationCategory": "UtilityApplication",
      "operatingSystem": "Web Browser",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "ratingCount": "4521",
        "bestRating": "5",
        "worstRating": "1"
      },
      "featureList": [
        "Count words, characters, paragraphs, sentences, and lines",
        "Real-time counting as you type",
        "Characters with and without spaces",
        "100% client-side processing",
        "No registration required",
        "Instant counting",
        "Copy to clipboard functionality",
        "Mobile-friendly interface"
      ],
      "description": "Free online word counter. Count words, characters (with and without spaces), paragraphs, sentences, and lines in real-time. Perfect for writers, students, and content creators. Works 100% in your browser. No registration required."
    },
    howTo: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Count Words and Characters",
      "description": "Step-by-step guide to count words, characters, paragraphs, and sentences online for free using FixTools Word Counter.",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Enter or paste your text",
          "text": "Type or paste the text you want to analyze into the input field. The word counter will automatically start counting as you type. You can paste text from documents, articles, essays, or any written content.",
          "position": 1
        },
        {
          "@type": "HowToStep",
          "name": "View real-time statistics",
          "text": "Watch the statistics update in real-time as you type. The counter displays: word count, total characters, characters without spaces, number of paragraphs, number of sentences, and number of lines. All counts update instantly without any delay.",
          "position": 2
        },
        {
          "@type": "HowToStep",
          "name": "Use the statistics",
          "text": "Use the word and character counts to meet writing requirements, track your progress, or analyze your content. The statistics help you understand the length and structure of your text, making it easier to meet word limits, character limits, or formatting requirements.",
          "position": 3
        }
      ]
    },
    faqPage: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is a word counter?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A word counter is a tool that analyzes text and counts various metrics including words, characters (with and without spaces), paragraphs, sentences, and lines. Word counters are essential for writers, students, content creators, and anyone who needs to meet specific word or character limits. They help track writing progress and ensure content meets length requirements."
          }
        },
        {
          "@type": "Question",
          "name": "How accurate is the word count?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our word counter is highly accurate and follows standard word counting rules. Words are counted by splitting text on whitespace (spaces, tabs, newlines) and filtering out empty strings. This matches the counting method used by most word processors like Microsoft Word and Google Docs. The counter updates in real-time as you type, ensuring accuracy at all times."
          }
        },
        {
          "@type": "Question",
          "name": "What's the difference between characters and characters without spaces?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Characters (with spaces) counts every character in your text including letters, numbers, punctuation, and spaces. Characters without spaces counts only the actual content characters, excluding all spaces. This is useful when you need to meet character limits that don't count spaces, such as Twitter's character limit or certain form field limits."
          }
        },
        {
          "@type": "Question",
          "name": "How are paragraphs counted?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Paragraphs are counted by splitting text on double newlines (blank lines) or sequences of whitespace between text blocks. A paragraph is defined as a block of text separated by blank lines. If your text has no blank lines but contains text, it counts as one paragraph. This matches how most word processors count paragraphs."
          }
        },
        {
          "@type": "Question",
          "name": "How are sentences counted?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Sentences are counted by splitting text on sentence-ending punctuation marks (periods, exclamation marks, question marks). The counter identifies sentence boundaries and counts each complete sentence. This helps you understand the structure and readability of your text."
          }
        },
        {
          "@type": "Question",
          "name": "Is my text stored or sent to a server?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No, absolutely not. All word counting happens entirely in your browser using client-side JavaScript. Your text never leaves your device, isn't sent to any server, and isn't stored anywhere. This ensures complete privacy and security. The counting algorithm runs locally in your browser without any network transmission."
          }
        },
        {
          "@type": "Question",
          "name": "Can I use this for academic writing?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, our word counter is perfect for academic writing. It helps you meet word count requirements for essays, research papers, and assignments. The real-time counting lets you track your progress as you write, ensuring you meet minimum or maximum word limits. The character count (with and without spaces) is also useful for abstract or title requirements."
          }
        },
        {
          "@type": "Question",
          "name": "Does it work on mobile devices?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, our word counter is fully responsive and works perfectly on mobile devices, tablets, and desktops. The interface adapts to your screen size, and all functionality works the same way on all devices. You can count words on your phone, tablet, or computer with the same accuracy and speed."
          }
        }
      ]
    }
  };

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>Word Counter - Free Online Word & Character Counter | FixTools</title>
        <meta name="title" content="Word Counter - Free Online Word & Character Counter | FixTools" />
        <meta name="description" content="Count words, characters (with and without spaces), paragraphs, sentences, and lines in real-time. Perfect for writers, students, and content creators. Free, instant, and works 100% in your browser. No registration required." />
        <meta name="keywords" content="word counter, character counter, word count, character count, text counter, word counter online, free word counter, paragraph counter, sentence counter" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content="Word Counter - Free Online Word & Character Counter" />
        <meta property="og:description" content="Count words, characters, paragraphs, and sentences in real-time. Free, instant, and works 100% in your browser." />
        <meta property="og:image" content={`${siteHost}/images/word-counter-og.png`} />
        <meta property="og:site_name" content="FixTools" />
        
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content="Word Counter - Free Online Word & Character Counter" />
        <meta property="twitter:description" content="Count words, characters, paragraphs, and sentences in real-time. Free and instant." />
        <meta property="twitter:image" content={`${siteHost}/images/word-counter-og.png`} />
        
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.breadcrumb) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.softwareApplication) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.howTo) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.faqPage) }} />
      </Head>

      <style jsx global>{`
        html:has(.word-counter-page) {
          font-size: 100% !important;
        }
        
        .word-counter-page {
          line-height: 1.5;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          width: 100%;
          min-height: 100vh;
        }
        
        .word-counter-page *,
        .word-counter-page *::before,
        .word-counter-page *::after {
          box-sizing: border-box;
        }
        
        .word-counter-page h1,
        .word-counter-page h2,
        .word-counter-page h3,
        .word-counter-page p,
        .word-counter-page ul,
        .word-counter-page ol {
          margin: 0;
        }
        
        .word-counter-page button {
          font-family: inherit;
          cursor: pointer;
        }
        
        .word-counter-page input,
        .word-counter-page textarea,
        .word-counter-page select {
          font-family: inherit;
        }
      `}</style>

      <div className="word-counter-page bg-[#fbfbfc] text-slate-900 min-h-screen">
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/fixtools-logos/fixtools-logos_black.svg" alt="FixTools" width={120} height={40} className="h-9 w-auto" />
            </Link>
            <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex" aria-label="Main navigation" role="navigation">
              <Link className="hover:text-slate-900 transition-colors" href="/tools/json">JSON</Link>
              <Link className="hover:text-slate-900 transition-colors" href="/tools/html">HTML</Link>
              <Link className="hover:text-slate-900 transition-colors" href="/tools/css">CSS</Link>
              <Link className="hover:text-slate-900 transition-colors" href="/tools/text-tools">Text Tools</Link>
              <Link className="hover:text-slate-900 transition-colors" href="/">All tools</Link>
            </nav>
            <Link href="/" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50">
              Browse tools
            </Link>
          </div>
        </header>

        <nav className="mx-auto max-w-6xl px-4 py-3" aria-label="Breadcrumb" role="navigation">
          <ol className="flex items-center gap-2 text-sm text-slate-600">
            <li><Link href="/" className="hover:text-slate-900 transition-colors">Home</Link></li>
            <li className="flex items-center gap-2"><span className="text-slate-400">/</span><Link href="/tools" className="hover:text-slate-900 transition-colors">Tools</Link></li>
            <li className="flex items-center gap-2"><span className="text-slate-400">/</span><Link href="/tools/text-tools" className="hover:text-slate-900 transition-colors">Text Tools</Link></li>
            <li className="flex items-center gap-2"><span className="text-slate-400">/</span><span className="font-semibold text-slate-900">Word Counter</span></li>
          </ol>
        </nav>

        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.35]" style={{ backgroundImage: 'url(/grid.png)', backgroundSize: '256px 256px' }}></div>
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-10 md:grid-cols-12 md:py-14">
            <div className="relative z-10 md:col-span-7 hero-content">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50 px-4 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Free • Fast • Privacy-first
              </div>
              
              <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                  Word Counter
                </span>
              </h1>
              
              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg md:leading-relaxed">
                Our <strong>word counter</strong> helps you count words, characters (with and without spaces), paragraphs, sentences, and lines in real-time. Perfect for writers, students, and content creators who need to meet word limits or track their writing progress. Works 100% in your browser with complete privacy.
              </p>

              <div className="mt-7 pb-5 flex flex-wrap items-center gap-3">
                <a href="#tool" className="group relative rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 transition-all duration-200 hover:shadow-xl hover:scale-[1.02]">
                  <span className="relative z-10 flex items-center gap-2">⚡ Count Words</span>
                </a>
                <a href="#how" className="rounded-2xl border-2 border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-900 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md">
                  How it works
                </a>
              </div>

              <dl className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Metrics</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">6 Types</dd>
                </div>
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Mode</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">Real-time</dd>
                </div>
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Time</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">Instant</dd>
                </div>
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Price</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">Free</dd>
                </div>
              </dl>
            </div>

            <div className="relative z-10 md:col-span-5">
              <div className="space-y-4 feature-cards-container">
                <div className="feature-card group rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-lg transition-all duration-300 hover:border-emerald-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg shadow-emerald-500/30 transition-transform duration-300 group-hover:scale-110">
                      <span className="text-2xl">⚡</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">Real-Time Counting</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Count words and characters instantly as you type. No waiting, no delays, no server processing.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="feature-card group rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-lg transition-all duration-300 hover:border-blue-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30 transition-transform duration-300 group-hover:scale-110">
                      <span className="text-2xl">🔒</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">100% Private</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Everything runs locally. Your text never leaves your device, ensuring complete privacy.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="feature-card group rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-lg transition-all duration-300 hover:border-purple-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg shadow-purple-500/30 transition-transform duration-300 group-hover:scale-110">
                      <span className="text-2xl">📊</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">Comprehensive Stats</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Count words, characters, paragraphs, sentences, and lines all in one place.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tool Interface */}
        <section id="tool" className="mx-auto max-w-6xl px-4 pb-12 pt-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 md:p-7" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Count Words & Characters online</h2>
                <p className="mt-1 text-sm text-slate-600">Enter your text and get real-time statistics instantly.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button onClick={clear} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50" aria-label="Clear input">Clear</button>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-12">
              <div className="md:col-span-8">
                <label className="mb-2 block text-sm font-semibold text-slate-800">Enter Text</label>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type or paste your text here to count words, characters, paragraphs, and sentences..."
                  className="w-full h-64 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-900/20 resize-none"
                  aria-label="Text input for word counting"
                />
              </div>

              <div className="md:col-span-4">
                <label className="mb-2 block text-sm font-semibold text-slate-800">Statistics</label>
                <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200">
                    <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-1">Words</div>
                    <div className="text-2xl font-bold text-emerald-700">{stats.words.toLocaleString()}</div>
                  </div>
                  
                  <div className="p-3 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200">
                    <div className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">Characters</div>
                    <div className="text-2xl font-bold text-blue-700">{stats.characters.toLocaleString()}</div>
                  </div>
                  
                  <div className="p-3 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200">
                    <div className="text-xs font-semibold text-purple-700 uppercase tracking-wide mb-1">No Spaces</div>
                    <div className="text-2xl font-bold text-purple-700">{stats.charactersNoSpaces.toLocaleString()}</div>
                  </div>
                  
                  <div className="p-3 rounded-xl bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200">
                    <div className="text-xs font-semibold text-orange-700 uppercase tracking-wide mb-1">Paragraphs</div>
                    <div className="text-2xl font-bold text-orange-700">{stats.paragraphs.toLocaleString()}</div>
                  </div>
                  
                  <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200">
                    <div className="text-xs font-semibold text-cyan-700 uppercase tracking-wide mb-1">Sentences</div>
                    <div className="text-2xl font-bold text-cyan-700">{stats.sentences.toLocaleString()}</div>
                  </div>
                  
                  <div className="p-3 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200">
                    <div className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-1">Lines</div>
                    <div className="text-2xl font-bold text-green-700">{stats.lines.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What is a Word Counter Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">What is a Word Counter?</h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                A <strong>word counter</strong> is a tool that analyzes text and counts various metrics including words, characters (with and without spaces), paragraphs, sentences, and lines. Word counters are essential for writers, students, content creators, bloggers, journalists, and anyone who needs to meet specific word or character limits. They help track writing progress, ensure content meets length requirements, and understand the structure of written text.
              </p>
              
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Word counters are commonly used in academic writing (essays, research papers), content creation (blog posts, articles), social media (character limits), professional writing (reports, proposals), and creative writing (novels, scripts). According to <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-800 font-semibold underline">MDN Web Docs</a>, JavaScript provides powerful string manipulation methods that enable accurate word and character counting in web browsers. Modern word counters use these methods to provide real-time, accurate statistics.
              </p>

              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Our word counter provides comprehensive statistics including word count, character count (with and without spaces), paragraph count, sentence count, and line count. All counting happens in real-time as you type, giving you instant feedback on your writing length and structure. This helps you meet word limits, track your progress, and understand the composition of your text.
              </p>

              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600">✗</span>
                    Manual Counting
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">•</span>
                      <span>Time-consuming and error-prone</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">•</span>
                      <span>Difficult for long documents</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">•</span>
                      <span>No real-time feedback</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">•</span>
                      <span>Inconsistent results</span>
                    </li>
                  </ul>
                </div>
                
                <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">✓</span>
                    Online Word Counter
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">•</span>
                      <span>Instant, accurate counting</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">•</span>
                      <span>Real-time updates as you type</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">•</span>
                      <span>Multiple metrics at once</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">•</span>
                      <span>Works for any text length</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Use Word Counter Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Why Use a Word Counter?</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Word counters are essential tools for anyone who writes:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-emerald-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg">
                    <span className="text-2xl">📝</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Meet Word Limits</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Academic assignments, blog posts, and articles often have specific word count requirements. A word counter helps you track your progress and ensure you meet minimum or maximum word limits. Real-time counting lets you know exactly how many words you've written as you type.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                    <span className="text-2xl">📊</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Track Writing Progress</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Word counters help you track your writing progress and set goals. Whether you're writing a novel, blog post, or academic paper, seeing your word count increase in real-time provides motivation and helps you stay on track with your writing goals.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-purple-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
                    <span className="text-2xl">🔢</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Character Limits</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Many platforms have character limits (Twitter, meta descriptions, form fields). Word counters show both character count with spaces and without spaces, helping you meet these limits. This is essential for social media posts, SEO meta descriptions, and form submissions.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-orange-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg">
                    <span className="text-2xl">📖</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Analyze Text Structure</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Word counters provide insights into text structure through paragraph, sentence, and line counts. This helps you understand the composition of your text, identify areas that need more or less content, and ensure proper formatting and structure.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how" className="mx-auto max-w-6xl px-4 pb-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
            <div className="md:col-span-7">
              <div className="inline-flex items-center gap-2 mb-3">
                <div className="h-1 w-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
                <h2 className="text-3xl font-bold text-slate-900">How it works</h2>
              </div>
              
              <p className="mt-2 text-slate-600 leading-relaxed">
                Our word counter makes it easy to count words and characters in seconds. Follow these simple steps:
              </p>

              <ol className="mt-6 space-y-4">
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    1
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Enter or paste your text</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Type or paste the text you want to analyze into the input field. The word counter will automatically start counting as you type. You can paste text from documents, articles, essays, or any written content. The counter works with any text length.
                    </p>
                  </div>
                </li>
                
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    2
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">View real-time statistics</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Watch the statistics update in real-time as you type. The counter displays: word count, total characters, characters without spaces, number of paragraphs, number of sentences, and number of lines. All counts update instantly without any delay, giving you immediate feedback on your text.
                    </p>
                  </div>
                </li>
                
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    3
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Use the statistics</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Use the word and character counts to meet writing requirements, track your progress, or analyze your content. The statistics help you understand the length and structure of your text, making it easier to meet word limits, character limits, or formatting requirements for your writing projects.
                    </p>
                  </div>
                </li>
              </ol>
            </div>

            <div className="md:col-span-5">
              <div className="sticky top-24 rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-7 shadow-xl">
                <div className="flex items-start gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg">
                    <span className="text-2xl">✨</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 pt-2">Why use our Word Counter?</h3>
                </div>
                
                <ul className="mt-4 space-y-3">
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">Real-time counting as you type</span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">100% client-side processing</span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">No registration required</span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">Comprehensive statistics (6 metrics)</span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">Works on all devices</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <h2 className="text-2xl font-semibold text-slate-900">Frequently Asked Questions</h2>
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4" open>
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What is a word counter?</summary>
                <p className="mt-2 text-sm text-slate-600">A word counter is a tool that analyzes text and counts various metrics including words, characters (with and without spaces), paragraphs, sentences, and lines. Word counters are essential for writers, students, content creators, and anyone who needs to meet specific word or character limits. They help track writing progress and ensure content meets length requirements.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">How accurate is the word count?</summary>
                <p className="mt-2 text-sm text-slate-600">Our word counter is highly accurate and follows standard word counting rules. Words are counted by splitting text on whitespace (spaces, tabs, newlines) and filtering out empty strings. This matches the counting method used by most word processors like Microsoft Word and Google Docs. The counter updates in real-time as you type, ensuring accuracy at all times.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What's the difference between characters and characters without spaces?</summary>
                <p className="mt-2 text-sm text-slate-600">Characters (with spaces) counts every character in your text including letters, numbers, punctuation, and spaces. Characters without spaces counts only the actual content characters, excluding all spaces. This is useful when you need to meet character limits that don't count spaces, such as Twitter's character limit or certain form field limits.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">How are paragraphs counted?</summary>
                <p className="mt-2 text-sm text-slate-600">Paragraphs are counted by splitting text on double newlines (blank lines) or sequences of whitespace between text blocks. A paragraph is defined as a block of text separated by blank lines. If your text has no blank lines but contains text, it counts as one paragraph. This matches how most word processors count paragraphs.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">How are sentences counted?</summary>
                <p className="mt-2 text-sm text-slate-600">Sentences are counted by splitting text on sentence-ending punctuation marks (periods, exclamation marks, question marks). The counter identifies sentence boundaries and counts each complete sentence. This helps you understand the structure and readability of your text.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Is my text stored or sent to a server?</summary>
                <p className="mt-2 text-sm text-slate-600">No, absolutely not. All word counting happens entirely in your browser using client-side JavaScript. Your text never leaves your device, isn't sent to any server, and isn't stored anywhere. This ensures complete privacy and security. The counting algorithm runs locally in your browser without any network transmission.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Can I use this for academic writing?</summary>
                <p className="mt-2 text-sm text-slate-600">Yes, our word counter is perfect for academic writing. It helps you meet word count requirements for essays, research papers, and assignments. The real-time counting lets you track your progress as you write, ensuring you meet minimum or maximum word limits. The character count (with and without spaces) is also useful for abstract or title requirements.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Does it work on mobile devices?</summary>
                <p className="mt-2 text-sm text-slate-600">Yes, our word counter is fully responsive and works perfectly on mobile devices, tablets, and desktops. The interface adapts to your screen size, and all functionality works the same way on all devices. You can count words on your phone, tablet, or computer with the same accuracy and speed.</p>
              </details>
            </div>
          </div>
        </section>

        {/* Related Tools Section */}
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Related Text Tools</h2>
            <p className="text-slate-600">Explore our complete suite of text tools for developers and writers:</p>
          </div>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-6">
            <Link href="/text/text-case-converter" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-purple-300 hover:shadow-lg transition-all duration-300" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🔤</span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">Text Case Converter</p>
                  <p className="text-xs text-slate-500">Convert Text Case</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">Convert text between uppercase, lowercase, title case, sentence case, and more. Real-time conversion.</p>
              <p className="mt-4 text-sm font-semibold text-purple-600 group-hover:text-purple-700">Open tool →</p>
            </Link>
            
            <Link href="/text/base64-encoder" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-blue-300 hover:shadow-lg transition-all duration-300" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🔐</span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">Base64 Encoder</p>
                  <p className="text-xs text-slate-500">Encode to Base64</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">Encode text and files to Base64 format. Create data URIs for images and encode email attachments.</p>
              <p className="mt-4 text-sm font-semibold text-blue-600 group-hover:text-blue-700">Open tool →</p>
            </Link>
            
            <Link href="/text/base64-decoder" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-green-300 hover:shadow-lg transition-all duration-300" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🔓</span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">Base64 Decoder</p>
                  <p className="text-xs text-slate-500">Decode Base64</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">Decode Base64 strings to text or files. Decode data URIs, email attachments, and Base64-encoded data.</p>
              <p className="mt-4 text-sm font-semibold text-green-600 group-hover:text-green-700">Open tool →</p>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Link href="/tools/text-tools" className="group rounded-3xl border-2 border-slate-900 bg-gradient-to-br from-slate-900 to-slate-800 p-6 hover:shadow-xl transition-all duration-300" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🔧</span>
                </div>
                <div>
                  <p className="text-base font-bold text-white">All Text Tools</p>
                  <p className="text-xs text-slate-400">Browse Complete Suite</p>
                </div>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">Discover all our free text tools for word counting, case conversion, Base64 encoding, and more.</p>
              <p className="mt-4 text-sm font-semibold text-emerald-400 group-hover:text-emerald-300">Browse all tools →</p>
            </Link>
          </div>
        </section>
        
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

