import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import Data from '@/dbTools';

const siteHost = process.env.NEXT_PUBLIC_HOST || 'https://fixtools.io';

export default function AIToolsCategory({ tools }) {
  const currentYear = new Date().getFullYear();
  const canonicalUrl = `${siteHost}/tools/ai-tools`;

  // Structured Data Schemas
  const structuredData = {
    // CollectionPage Schema for Google Sitelinks
    collectionPage: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "AI Tools – Chat, Summarize, Classify & Generate Content Online | FixTools",
      "description": "Free online AI tools for content generation, summarization, classification, and more. Chat, summarize, classify, and generate content with AI. All tools work 100% in your browser.",
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
          "name": "AI Tools",
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
          "name": "What are AI tools?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "AI tools are online utilities powered by artificial intelligence that help you generate, summarize, classify, and process content. They include chatbots, text summarizers, grammar correctors, keyword extractors, and content generators that use AI to assist with various tasks."
          }
        },
        {
          "@type": "Question",
          "name": "Are these AI tools free to use?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, all our AI tools are 100% free to use. There's no registration required, no account needed, and no hidden fees. All processing happens in your browser, so your data never leaves your device."
          }
        },
        {
          "@type": "Question",
          "name": "Do AI tools work offline?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Most AI tools require an internet connection to access AI models. However, some tools like text processors and formatters work entirely client-side. Check each tool's description for specific requirements."
          }
        },
        {
          "@type": "Question",
          "name": "Is my data secure when using AI tools?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, we prioritize your privacy. All tools that can work client-side process data entirely in your browser. For tools that require AI processing, we use secure connections and don't store your data. Always check each tool's privacy policy for specific details."
          }
        },
        {
          "@type": "Question",
          "name": "What can AI tools help me with?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our AI tools can help with grammar correction, text summarization, question answering, keyword extraction, content classification, and more. They're designed to assist with content creation, editing, and analysis tasks."
          }
        },
        {
          "@type": "Question",
          "name": "Can I use AI tools for commercial purposes?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, our AI tools are free to use for both personal and commercial purposes. However, always review the output for accuracy and ensure it meets your specific requirements before using it in commercial projects."
          }
        },
        {
          "@type": "Question",
          "name": "How accurate are the AI tools?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "AI tools provide helpful assistance, but results should always be reviewed for accuracy. The quality of output depends on the input quality and the specific task. We recommend using AI tools as assistants rather than replacements for human judgment."
          }
        },
        {
          "@type": "Question",
          "name": "Do AI tools require API keys?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No, our AI tools don't require API keys or any setup. Simply visit the tool page and start using it immediately. All tools are ready to use without configuration."
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
        <title>AI Tools – Chat, Summarize, Classify & Generate Content Online | FixTools</title>
        <meta name="title" content="AI Tools – Chat, Summarize, Classify & Generate Content Online | FixTools" />
        <meta name="description" content={`Free online AI tools for content generation, summarization, classification, and more. ${tools.length} tools including grammar correction, Q&A, summarization, keyword extraction, and content detection. Works 100% in your browser - fast, secure, no registration required.`} />
        <meta name="keywords" content="ai tools, ai chat, ai summarizer, grammar correction, keyword extraction, content generator, ai content detector, free ai tools, online ai tools" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        {/* Canonical URL */}
        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content="AI Tools – Chat, Summarize, Classify & Generate Content Online" />
        <meta property="og:description" content={`Free online AI tools for content generation, summarization, classification, and more. ${tools.length} tools available.`} />
        <meta property="og:image" content={`${siteHost}/images/ai-tools-og.png`} />
        <meta property="og:site_name" content="FixTools" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content="AI Tools – Chat, Summarize, Classify & Generate Content Online" />
        <meta property="twitter:description" content={`Free online AI tools for content generation, summarization, classification, and more.`} />
        <meta property="twitter:image" content={`${siteHost}/images/ai-tools-og.png`} />
        
        {/* Structured Data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.collectionPage) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.breadcrumb) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.faqPage) }} />
      </Head>

      <style jsx global>{`
        html:has(.ai-tools-category) {
          font-size: 100% !important;
        }
        
        .ai-tools-category {
          line-height: 1.5;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          width: 100%;
          min-height: 100vh;
        }
        
        .ai-tools-category *,
        .ai-tools-category *::before,
        .ai-tools-category *::after {
          box-sizing: border-box;
        }
        
        .ai-tools-category h1,
        .ai-tools-category h2,
        .ai-tools-category h3,
        .ai-tools-category p,
        .ai-tools-category ul,
        .ai-tools-category ol {
          margin: 0;
        }
        
        .ai-tools-category button {
          font-family: inherit;
          cursor: pointer;
        }
        
        .ai-tools-category input,
        .ai-tools-category textarea,
        .ai-tools-category select {
          font-family: inherit;
        }
      `}</style>

      <div className="ai-tools-category bg-[#fbfbfc] text-slate-900 min-h-screen">
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
              <Link className="hover:text-slate-900 transition-colors" href="/tools/ai-tools">AI</Link>
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
              <span className="font-semibold text-slate-900">AI Tools</span>
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
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-1.5 text-xs font-semibold text-indigo-700 shadow-sm mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              {tools.length} Free Tools • AI-Powered • No Sign-Up
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                AI Tools
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 max-w-3xl leading-relaxed mb-8">
              Professional <strong>AI tools</strong> for content generation, summarization, classification, and more. Chat, summarize, classify, and generate content with AI. 
              All tools work in your browser — fast, secure, and private. No registration required.
            </p>

            {/* Stats */}
            <dl className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Tools</dt>
                <dd className="mt-1.5 text-2xl font-bold text-slate-900">{tools.length}</dd>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Processing</dt>
                <dd className="mt-1.5 text-2xl font-bold text-slate-900">AI-Powered</dd>
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
            <h2 className="text-2xl font-bold text-slate-900 mb-2">All AI Tools</h2>
            <p className="text-slate-600">Click any tool to get started — no registration required</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map((tool) => (
              <Link
                key={tool.link}
                href={tool.link}
                className="group block p-6 rounded-2xl border-2 border-slate-200 bg-white hover:border-indigo-300 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30 transition-transform duration-300 group-hover:scale-110">
                    <span className="text-2xl">🤖</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">
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

        {/* What is AI Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">What is AI?</h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                <strong>AI (Artificial Intelligence)</strong> refers to computer systems that can perform tasks typically requiring human intelligence, such as understanding language, recognizing patterns, and making decisions. AI tools use machine learning and natural language processing to assist with content creation, analysis, and automation. According to <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_AI_API" target="_blank" rel="noopener noreferrer" className="text-indigo-700 hover:text-indigo-800 font-semibold underline">MDN Web Docs</a>, 
                AI is increasingly integrated into web applications to enhance user experiences.
              </p>

              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Modern AI tools can help with grammar correction, text summarization, question answering, keyword extraction, content classification, and more. These tools leverage large language models and machine learning algorithms to understand context and generate helpful responses. Major platforms like <a href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer" className="text-indigo-700 hover:text-indigo-800 font-semibold underline">Google</a> 
                are making AI more accessible to developers and users worldwide.
              </p>

              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Our AI tools are designed to be accessible and easy to use, requiring no technical knowledge or setup. Simply input your content, and the AI processes it to provide helpful results, whether that's correcting grammar, summarizing text, or extracting keywords.
              </p>

              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="rounded-2xl border-2 border-indigo-200 bg-indigo-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">AI Tool Examples</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold mt-0.5">✓</span>
                      <span>Grammar Correction</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold mt-0.5">✓</span>
                      <span>Text Summarization</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold mt-0.5">✓</span>
                      <span>Question Answering</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold mt-0.5">✓</span>
                      <span>Keyword Extraction</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold mt-0.5">✓</span>
                      <span>Content Detection</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Why AI Tools?</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold mt-0.5">✓</span>
                      <span>Save time on repetitive tasks</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold mt-0.5">✓</span>
                      <span>Improve content quality</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold mt-0.5">✓</span>
                      <span>Enhance productivity</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold mt-0.5">✓</span>
                      <span>Get instant assistance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold mt-0.5">✓</span>
                      <span>No technical knowledge needed</span>
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
              <div className="h-1 w-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">How to Use These Tools</h2>
            </div>
            
            <p className="text-base text-slate-600 mb-6 leading-relaxed">
              Our AI tools are designed to be simple and intuitive. Follow these steps to get started:
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-xl shadow-lg mb-4">
                  1
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Choose Your Tool</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Select the AI tool you need from the grid above. Grammar correction, summarization, Q&A, or keyword extraction.
                </p>
              </div>

              <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-xl shadow-lg mb-4">
                  2
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Enter Your Content</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Paste or type your text into the input field. For Q&A tools, enter your question and context.
                </p>
              </div>

              <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white font-bold text-xl shadow-lg mb-4">
                  3
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Get AI Results</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Click the process button and get instant AI-powered results. Review and use the output as needed.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
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
  // Filter tools for AI Tools category
  const tools = (Data || []).filter((tool) => tool.category === 'AI Tools');
  
  return {
    props: {
      tools,
    },
  };
}

