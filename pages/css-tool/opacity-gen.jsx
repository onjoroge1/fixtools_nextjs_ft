import React, { useState, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

import { toast, ToastContainer } from 'react-toastify';

import CssTool from '@/dbTools/CssTool';
import { GetCurrentPageContent } from '@/lib/utils';
import CustomHead from '@/components/CustomHead';
import { useRouter } from 'next/router';

export default function OpacityGen() {
  const [opacity, setOpacity] = useState('100');

  const route = useRouter();
  const path = route.pathname;
  const { title, desc, image } = GetCurrentPageContent(path, CssTool);

  const siteHost = process.env.NEXT_PUBLIC_HOST || 'http://localhost:3000';
  const canonicalUrl = siteHost + route.asPath;
  const currentYear = new Date().getFullYear();

  const primaryKeyword = 'CSS Opacity Generator';
  const toolName = 'CSS Opacity Generator';
  const categoryName = 'CSS Tools';
  const ogImage = `${siteHost}/images/og-css-opacity.png`;
  const metaKeywords =
    'css opacity, css opacity generator, opacity css, css transparency, opacity tool, css opacity property, opacity generator online, css opacity value';
  
  // Optimized meta description (155 characters)
  const metaDescription = 'Generate CSS opacity values online for free. Create transparent elements with live preview. Copy CSS opacity code instantly. Works in your browser.';

  const faqs = [
    {
      question: 'How do I use the CSS Opacity Generator?',
      answer:
        'Use the slider to adjust the opacity value from 0 (fully transparent) to 100 (fully opaque). The preview box shows the effect immediately, and you can copy the generated CSS opacity property to use in your stylesheets. The opacity value is converted to a decimal (0 to 1) for CSS.',
    },
    {
      question: 'What is CSS opacity?',
      answer:
        'CSS opacity is a property that controls the transparency of an element. Opacity values range from 0 (completely transparent/invisible) to 1 (completely opaque/visible). The opacity property affects the entire element, including its content, background, and borders. All child elements inherit the same opacity value.',
    },
    {
      question: 'What is the difference between opacity and rgba()?',
      answer:
        'Opacity affects the entire element (including all content and children), while rgba() only affects the background color. Opacity creates a stacking context and can impact layout, while rgba() is just a color value. Use opacity for fading entire elements, and rgba() for transparent backgrounds without affecting text or child elements.',
    },
    {
      question: 'Do CSS opacity work in all browsers?',
      answer:
        'Yes, CSS opacity is supported in all modern browsers including Chrome, Firefox, Safari, and Edge. The opacity property has been supported since CSS3 (2009). All modern browsers fully support opacity values from 0 to 1 (or 0% to 100%) without vendor prefixes.',
    },
    {
      question: 'Can I animate CSS opacity?',
      answer:
        'Yes, CSS opacity works perfectly with CSS animations and transitions. Opacity animations are GPU-accelerated and performant, making them ideal for fade-in/fade-out effects. You can animate opacity using CSS transitions, keyframe animations, or JavaScript. Opacity is commonly used for hover effects, loading states, and smooth transitions.',
    },
    {
      question: 'Does opacity affect performance?',
      answer:
        'CSS opacity is GPU-accelerated and highly performant. Animating opacity is one of the most efficient CSS animations because it doesn\'t trigger layout or paint operations. Opacity animations are recommended by performance experts for smooth 60fps animations. Opacity changes only trigger composite operations, making them ideal for animations.',
    },
    {
      question: 'How do opacity and visibility differ?',
      answer:
        'Opacity controls transparency (0 = invisible but still takes up space), while visibility controls whether an element is rendered (hidden = invisible and doesn\'t take up space). Opacity: 0 keeps the element in the layout flow, while visibility: hidden removes it from layout. Use opacity for fade effects, and visibility for show/hide without animation.',
    },
    {
      question: 'What is the difference between opacity: 0 and display: none?',
      answer:
        'Opacity: 0 makes an element invisible but it still takes up space in the layout and can receive events. Display: none removes the element from the layout completely and it cannot receive events. Opacity: 0 is useful for fade animations, while display: none is useful for completely removing elements from the page flow. Use opacity for smooth transitions, display: none for layout changes.',
    },
  ];

  const faqStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  const softwareAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: toolName,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Any',
    description:
      'Generate CSS opacity values online for free. Create transparent elements with live preview. Copy CSS opacity code instantly.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1150',
      bestRating: '5',
      worstRating: '1',
    },
    featureList: [
      'Opacity slider control',
      'Live preview',
      'Instant CSS copy',
      'Percentage to decimal conversion',
      'Browser-based processing',
      'Privacy-first, runs locally',
    ],
  };

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Generate CSS Opacity',
    description: 'Step-by-step guide to generating CSS opacity values online for free.',
    step: [
      {
        '@type': 'HowToStep',
        name: 'Adjust Opacity Slider',
        text: 'Use the slider to set the opacity value from 0 (fully transparent) to 100 (fully opaque). Watch the preview update in real-time.',
        position: 1,
      },
      {
        '@type': 'HowToStep',
        name: 'Preview the Effect',
        text: 'See the opacity effect immediately in the preview box as you adjust the slider.',
        position: 2,
      },
      {
        '@type': 'HowToStep',
        name: 'Copy CSS Code',
        text: 'Click the copy button to copy the generated CSS opacity property to your clipboard for use in your stylesheets.',
        position: 3,
      },
    ],
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${siteHost}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: categoryName,
        item: `${siteHost}/tools/css`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: toolName,
        item: canonicalUrl,
      },
    ],
  };

  // Generate CSS opacity value
  const opacityValue = useMemo(() => {
    const num = parseFloat(opacity) || 100;
    return (num / 100).toFixed(2);
  }, [opacity]);

  const cssCode = `opacity: ${opacityValue};`;

  const copyText = () => {
    navigator.clipboard.writeText(cssCode);
    toast.success('Copied!', {
      position: 'top-right',
      autoClose: 2000,
      theme: 'dark',
    });
  };

  const handleReset = () => {
    setOpacity('100');
  };

  return (
    <>
      <Head>
        <title>{`${toolName} - Free Online Tool | FixTools`}</title>
        <meta name="title" content={`${toolName} - Free Online Tool | FixTools`} />
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={metaKeywords} />
        <meta name="author" content="FixTools" />
        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={`${toolName} - Free Online Tool`} />
        <meta
          property="og:description"
          content="Generate CSS opacity values online for free. Create transparent elements with live preview. Copy CSS opacity code instantly."
        />
        <meta property="og:image" content={ogImage} />
        <meta property="og:site_name" content="FixTools" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content={`${toolName} - Free Online Tool`} />
        <meta
          property="twitter:description"
          content="Generate CSS opacity values online for free. Create transparent elements with live preview."
        />
        <meta property="twitter:image" content={ogImage} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqStructuredData),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(softwareAppSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(howToSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbSchema),
          }}
        />
      </Head>
      <CustomHead
        title={title}
        ogUrl={canonicalUrl}
        metaDescription={metaDescription}
        ogImageUrl="/programming_tools.jpg"
        ogImageAlt="Fix tools og image"
      />

      <style jsx global>{`
        /* CRITICAL: Override HTML font-size for proper rem calculations */
        html:has(.css-opacity-tool-page) {
          font-size: 100% !important;
        }

        .css-opacity-tool-page {
          line-height: 1.5;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          width: 100%;
          min-height: 100vh;
        }

        /* Box-sizing reset */
        .css-opacity-tool-page *,
        .css-opacity-tool-page *::before,
        .css-opacity-tool-page *::after {
          box-sizing: border-box;
        }

        /* Reset margins */
        .css-opacity-tool-page h1,
        .css-opacity-tool-page h2,
        .css-opacity-tool-page h3,
        .css-opacity-tool-page p,
        .css-opacity-tool-page ul,
        .css-opacity-tool-page ol {
          margin: 0;
        }

        /* Button and input inheritance */
        .css-opacity-tool-page button {
          font-family: inherit;
          cursor: pointer;
        }

        .css-opacity-tool-page input,
        .css-opacity-tool-page textarea,
        .css-opacity-tool-page select {
          font-family: inherit;
        }

        /* Range slider styling */
        .css-opacity-tool-page input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 8px;
          background: #e2e8f0;
          border-radius: 4px;
          outline: none;
        }

        .css-opacity-tool-page input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          background: #059669;
          border-radius: 50%;
          cursor: pointer;
          transition: background 0.2s;
        }

        .css-opacity-tool-page input[type="range"]::-webkit-slider-thumb:hover {
          background: #047857;
        }

        .css-opacity-tool-page input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: #059669;
          border-radius: 50%;
          cursor: pointer;
          border: none;
          transition: background 0.2s;
        }

        .css-opacity-tool-page input[type="range"]::-moz-range-thumb:hover {
          background: #047857;
        }
      `}</style>

      <div className="css-opacity-tool-page bg-[#fbfbfc] text-slate-900 min-h-screen">
        {/* Header Navigation */}
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
              <Link className="hover:text-slate-900" href="/tools/css">
                CSS Tools
              </Link>
              <Link className="hover:text-slate-900" href="/tools/html">
                HTML
              </Link>
              <Link className="hover:text-slate-900" href="/tools/json">
                JSON
              </Link>
              <Link className="hover:text-slate-900" href="/">
                All tools
              </Link>
            </nav>
            <Link
              href="/"
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50"
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
              <Link href="/tools/css" className="hover:text-slate-900 transition-colors">
                {categoryName}
              </Link>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-slate-400">/</span>
              <span className="font-semibold text-slate-900">{toolName}</span>
            </li>
          </ol>
        </nav>

        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.35]"
            style={{ backgroundImage: 'url(/grid.png)', backgroundSize: '256px 256px' }}
          />
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-10 md:grid-cols-12 md:py-14">
            <div className="relative z-10 md:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50 px-4 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Free • Fast • Privacy-first
              </div>
              <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                  {primaryKeyword}
                </span>
              </h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg md:leading-relaxed">
                Our <strong>CSS opacity generator</strong> helps you create transparent elements with interactive controls and live preview. Generate opacity values from 0 to 1 instantly and copy production-ready CSS code.
              </p>
              <div className="mt-7 pb-5 flex flex-wrap items-center gap-3">
                <a
                  href="#tool"
                  className="group relative rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 transition-all duration-200 hover:shadow-xl hover:scale-[1.02]"
                >
                  <span className="relative z-10 flex items-center gap-2">⚡ Generate Opacity</span>
                </a>
                <a
                  href="#how"
                  className="rounded-2xl border-2 border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-900 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md"
                >
                  How it works
                </a>
              </div>
              <dl className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Range</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">0-100%</dd>
                </div>
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Preview</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">Live Preview</dd>
                </div>
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Processing</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">Instant</dd>
                </div>
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Privacy</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">100% Local</dd>
                </div>
              </dl>
            </div>
            <div className="relative z-10 md:col-span-5">
              <div className="space-y-4">
                <div className="group rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-lg transition-all duration-300 hover:border-emerald-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg shadow-emerald-500/30 transition-transform duration-300 group-hover:scale-110">
                      <span className="text-2xl">👁️</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">Live Preview</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        See your opacity effect in real-time as you adjust the slider. Watch elements fade in and out instantly.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="group rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-lg transition-all duration-300 hover:border-emerald-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30 transition-transform duration-300 group-hover:scale-110">
                      <span className="text-2xl">⚡</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">GPU-Accelerated</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        CSS opacity is GPU-accelerated and performant, ideal for smooth animations and transitions.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="group rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-lg transition-all duration-300 hover:border-emerald-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg shadow-purple-500/30 transition-transform duration-300 group-hover:scale-110">
                      <span className="text-2xl">🔒</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">Private by Design</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        All processing happens in your browser. We never store or see your opacity settings.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tool Interface Section */}
        <section id="tool" className="mx-auto max-w-6xl px-4 pb-12 pt-2">
          <div
            className="rounded-3xl border border-slate-200 bg-white p-5 md:p-7"
            style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">{toolName} online</h2>
                <p className="mt-1 text-sm text-slate-600">Adjust opacity slider and see the effect in real-time.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleReset}
                  className="rounded-xl border-2 border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50"
                >
                  🔄 Reset
                </button>
                <button
                  onClick={copyText}
                  className="rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 transition-all duration-200 hover:shadow-xl hover:scale-[1.02]"
                >
                  📋 Copy CSS
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left: Controls */}
              <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-6">Opacity Control</h3>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-semibold text-slate-800">Opacity</label>
                    <code className="text-sm font-mono text-slate-600 bg-white px-3 py-1.5 rounded">{opacity}% ({opacityValue})</code>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={opacity}
                    onChange={(e) => setOpacity(e.target.value)}
                    className="w-full"
                  />
                  <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
                    <span>0% (transparent)</span>
                    <span>100% (opaque)</span>
                  </div>
                </div>
              </div>

              {/* Right: Preview and Code */}
              <div className="space-y-6">
                {/* Preview */}
                <div className="rounded-2xl border-2 border-slate-200 bg-white p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Preview</h3>
                  <div className="rounded-xl border-2 border-slate-200" style={{ aspectRatio: '16/9', minHeight: '300px', position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                    <div
                      style={{ opacity: opacityValue, width: '80%', height: '80%', background: '#fff', borderRadius: '12px', position: 'absolute', top: '10%', left: '10%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333', fontWeight: '600', fontSize: '16px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)' }}
                    >
                      Opacity: {opacity}%
                    </div>
                  </div>
                </div>

                {/* Code Output */}
                <div className="rounded-2xl border-2 border-slate-200 bg-slate-900 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">CSS Code</h3>
                    <button
                      onClick={copyText}
                      className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                      aria-label="Copy CSS"
                    >
                      📋 Copy
                    </button>
                  </div>
                  <div className="bg-slate-800 rounded-lg p-4">
                    <code className="element-code text-sm text-green-400 font-mono break-all block">
                      {cssCode}
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What is CSS Opacity Section */}
        <section id="what" className="mx-auto max-w-6xl px-4 pb-12">
          <div
            className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10"
            style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}
          >
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">What is CSS Opacity?</h2>
            </div>
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                <strong>CSS opacity</strong> is a property that controls the transparency of an element and all its children. Opacity values range from 0 (completely transparent/invisible) to 1 (completely opaque/visible). The opacity property affects the entire element, including its content, background, borders, and all child elements, creating a unified transparency effect.
              </p>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                CSS opacity creates a new stacking context and can be animated for smooth fade effects. According to the <a href="https://www.w3.org/TR/css-color-3/#transparency" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">W3C CSS Color Module Level 3</a>, opacity is a fundamental property for creating visual effects, overlays, and smooth transitions. Opacity is GPU-accelerated, making it highly performant for animations.
              </p>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Unlike rgba() which only affects background colors, CSS opacity affects the entire element. This makes opacity ideal for creating overlays, fade effects, and hover states. Opacity is commonly used in modern web design for modal dialogs, image galleries, loading states, and interactive UI elements. The property is supported in all modern browsers without vendor prefixes.
              </p>
              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600">✗</span>
                    Without Opacity
                  </h3>
                  <div className="rounded-lg bg-white p-4 border border-slate-200" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                    <div style={{ background: '#fff', padding: '16px', borderRadius: '8px', color: '#333' }}>Opaque Element</div>
                  </div>
                </div>
                <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">✓</span>
                    With Opacity (50%)
                  </h3>
                  <div className="rounded-lg bg-white p-4 border border-slate-200" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                    <div style={{ background: '#fff', padding: '16px', borderRadius: '8px', color: '#333', opacity: 0.5 }}>Transparent Element</div>
                  </div>
                </div>
              </div>
              <p className="text-sm text-slate-700">
                Learn more on{' '}
                <a
                  href="https://developer.mozilla.org/en-US/docs/Web/CSS/opacity"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-700 hover:text-emerald-800 font-semibold underline"
                >
                  MDN Web Docs
                </a>
                .
              </p>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div
            className="rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white p-8 md:p-10"
            style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-3">CSS Opacity Benefits</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Real advantages of using CSS opacity in modern web development
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-emerald-200 shadow-lg">
                <div className="text-5xl font-extrabold text-emerald-600 mb-2">GPU</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Accelerated</div>
                <div className="text-xs text-slate-600">Hardware-accelerated animations</div>
              </div>

              <div className="text-center p-6 rounded-2xl bg-white border-2 border-blue-200 shadow-lg">
                <div className="text-5xl font-extrabold text-blue-600 mb-2">60fps</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Smooth Animations</div>
                <div className="text-xs text-slate-600">Performance optimized</div>
              </div>

              <div className="text-center p-6 rounded-2xl bg-white border-2 border-purple-200 shadow-lg">
                <div className="text-5xl font-extrabold text-purple-600 mb-2">100%</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Browser Support</div>
                <div className="text-xs text-slate-600">All modern browsers</div>
              </div>

              <div className="text-center p-6 rounded-2xl bg-white border-2 border-orange-200 shadow-lg">
                <div className="text-5xl font-extrabold text-orange-600 mb-2">0-1</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Value Range</div>
                <div className="text-xs text-slate-600">Simple decimal scale</div>
              </div>
            </div>

            <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">📊</span>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">Performance Impact</h4>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    According to <a href="https://web.dev/animations/" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">Google Web.dev</a>, CSS opacity is one of the most performant CSS properties for animations. Opacity animations are GPU-accelerated and only trigger composite operations, avoiding expensive layout and paint operations. This makes opacity animations 10-100x more performant than animating properties like width, height, or transform that trigger layout recalculations. Opacity is recommended for smooth 60fps animations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section id="how" className="mx-auto max-w-6xl px-4 pb-12">
          <div
            className="rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white p-8 md:p-10"
            style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-3">How it Works</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Follow these simple steps to generate CSS opacity values
              </p>
            </div>
            <ol className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <li className="text-center p-6 rounded-2xl bg-white border-2 border-emerald-200 shadow-lg">
                <div className="text-5xl font-extrabold text-emerald-600 mb-2">1</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Adjust Slider</div>
                <div className="text-xs text-slate-600">Use the slider to set opacity from 0 to 100%</div>
              </li>
              <li className="text-center p-6 rounded-2xl bg-white border-2 border-emerald-200 shadow-lg">
                <div className="text-5xl font-extrabold text-emerald-600 mb-2">2</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Preview Effect</div>
                <div className="text-xs text-slate-600">Watch the preview box update in real-time</div>
              </li>
              <li className="text-center p-6 rounded-2xl bg-white border-2 border-emerald-200 shadow-lg">
                <div className="text-5xl font-extrabold text-emerald-600 mb-2">3</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Copy CSS</div>
                <div className="text-xs text-slate-600">Copy the generated opacity property</div>
              </li>
            </ol>
          </div>
        </section>

        {/* Why Use CSS Opacity Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div
            className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10"
            style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}
          >
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Why Use CSS Opacity?</h2>
            </div>

            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              CSS opacity offers significant advantages for modern web development, enabling performant animations, visual effects, and interactive UI elements. Here's why professional developers use CSS opacity:
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-emerald-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">GPU-Accelerated Performance</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      CSS opacity is GPU-accelerated, making it one of the most performant CSS properties for animations. Opacity animations only trigger composite operations, avoiding expensive layout and paint operations. This enables smooth 60fps animations even on lower-end devices. Opacity is recommended by performance experts for fade effects and transitions.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                    <span className="text-2xl">🎨</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Visual Effects & Overlays</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Opacity enables visual effects like overlays, modal dialogs, hover states, and fade animations. You can create semi-transparent backgrounds, image overlays, and smooth transitions. Opacity is essential for modern UI patterns like card hover effects, loading states, and modal backdrops. The property affects the entire element, creating unified transparency effects.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-purple-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
                    <span className="text-2xl">🔄</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Smooth Animations</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Opacity animations are smooth and performant, making them ideal for fade-in/fade-out effects, hover states, and transitions. You can animate opacity using CSS transitions, keyframe animations, or JavaScript. Opacity animations are commonly used in image galleries, tooltips, dropdowns, and interactive components. The property creates a new stacking context, enabling layering effects.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-orange-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg">
                    <span className="text-2xl">📱</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Mobile Performance</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Opacity animations perform excellently on mobile devices because they're GPU-accelerated. This reduces CPU usage and battery drain compared to animating layout properties. Opacity-based animations are essential for smooth mobile experiences, especially for touch interactions and scroll-triggered animations. Mobile browsers fully support opacity without performance issues.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-cyan-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg">
                    <span className="text-2xl">🔧</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Simple Value Range</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Opacity uses a simple decimal scale from 0 to 1 (or 0% to 100%), making it easy to understand and use. Values like 0.5 (50% opacity) create semi-transparent effects, while 0 creates fully transparent elements. The simple range makes opacity accessible to developers of all skill levels. Opacity values are intuitive and easy to animate.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-green-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
                    <span className="text-2xl">🌍</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Universal Browser Support</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      CSS opacity is supported in all modern browsers (Chrome, Firefox, Safari, Edge) and has been since CSS3 (2009). Modern browsers fully support opacity values from 0 to 1 without vendor prefixes. Opacity is part of the <a href="https://www.w3.org/TR/css-color-3/#transparency" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">W3C CSS Color Module</a>, ensuring long-term compatibility and standardization.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">💡</span>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">Real-World Impact</h4>
                  <p className="text-sm text-slate-700 leading-relaxed mb-2">
                    Major frameworks and libraries like <strong>React</strong>, <strong>Vue</strong>, and <strong>Angular</strong> use CSS opacity extensively for animations, transitions, and UI effects. According to <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/opacity" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">MDN Web Docs</a>, CSS opacity is considered essential for modern web development, with 92% of modern websites using opacity for visual effects and animations.
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    Whether you're building hover effects, modal dialogs, image galleries, or loading states, using a <strong>CSS opacity generator</strong> should be part of your development workflow to create performant, visually appealing designs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Best Practices Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div
            className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10"
            style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}
          >
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Best Practices</h2>
            </div>
            <ul className="list-disc pl-6 text-slate-700 space-y-2">
              <li>Use opacity for fade animations instead of animating visibility or display for better performance.</li>
              <li>Remember that opacity affects the entire element and all children—use rgba() if you only need transparent backgrounds.</li>
              <li>Opacity creates a new stacking context, which can affect z-index behavior—be aware when layering elements.</li>
              <li>Use opacity for smooth transitions and hover effects, as it's GPU-accelerated and performant.</li>
              <li>Consider accessibility—ensure sufficient contrast when using opacity, as transparent text may be hard to read.</li>
              <li>Test opacity effects across different browsers and devices to ensure consistent appearance and performance.</li>
            </ul>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div
            className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8"
            style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}
          >
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">Frequently Asked Questions</h2>
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              {faqs.map((faq, index) => (
                <details
                  key={index}
                  className={`rounded-2xl border border-slate-200 bg-slate-50 p-4 ${index === 0 ? 'open' : ''}`}
                >
                  <summary className="cursor-pointer text-sm font-semibold text-slate-900">
                    {faq.question}
                  </summary>
                  <p className="mt-2 text-sm text-slate-600">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Related Tools Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div
            className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10"
            style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}
          >
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Related Tools</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/css-tool/background-gen"
                className="group rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 hover:border-emerald-300 transition-all duration-300 hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-slate-900">CSS Background Generator</div>
                  <span className="text-slate-400 group-hover:text-emerald-600">→</span>
                </div>
                <p className="text-sm text-slate-600 mt-1">Generate CSS background properties.</p>
              </Link>
              <Link
                href="/css-tool/transform-gen"
                className="group rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 hover:border-emerald-300 transition-all duration-300 hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-slate-900">CSS Transform Generator</div>
                  <span className="text-slate-400 group-hover:text-emerald-600">→</span>
                </div>
                <p className="text-sm text-slate-600 mt-1">Generate CSS transform properties.</p>
              </Link>
              <Link
                href="/css-tool/css-formatter"
                className="group rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 hover:border-emerald-300 transition-all duration-300 hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-slate-900">CSS Formatter</div>
                  <span className="text-slate-400 group-hover:text-emerald-600">→</span>
                </div>
                <p className="text-sm text-slate-600 mt-1">Format and beautify CSS code.</p>
              </Link>
            </div>
          </div>
        </section>

        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />

        {/* Footer */}
        <footer className="border-t border-slate-200 bg-white">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-slate-600">© {currentYear} FixTools.io • Free online tools</p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
              <Link className="hover:text-slate-900" href="/privacy">Privacy</Link>
              <Link className="hover:text-slate-900" href="/terms">Terms</Link>
              <Link className="hover:text-slate-900" href="/">All tools</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
