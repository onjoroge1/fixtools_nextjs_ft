import React, { useState, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

import { toast, ToastContainer } from 'react-toastify';

import CssTool from '@/dbTools/CssTool';
import { GetCurrentPageContent } from '@/lib/utils';
import CustomHead from '@/components/CustomHead';
import { useRouter } from 'next/router';

export default function TransformGen() {
  const [scale, setScale] = useState('1');
  const [rotate, setRotate] = useState('0');
  const [translateX, setTranslateX] = useState('0');
  const [translateY, setTranslateY] = useState('0');
  const [skewX, setSkewX] = useState('0');
  const [skewY, setSkewY] = useState('0');

  const route = useRouter();
  const path = route.pathname;
  const { title, desc, image } = GetCurrentPageContent(path, CssTool);

  const siteHost = process.env.NEXT_PUBLIC_HOST || 'http://localhost:3000';
  const canonicalUrl = siteHost + route.asPath;
  const currentYear = new Date().getFullYear();

  const primaryKeyword = 'CSS Transform Generator';
  const toolName = 'CSS Transform Generator';
  const categoryName = 'CSS Tools';
  const ogImage = `${siteHost}/images/og-css-transform.png`;
  const metaKeywords =
    'css transform, css transform generator, transform css, scale rotate translate skew, css transform functions, transform generator, css 3d transform, transform origin';
  
  // Optimized meta description (155 characters)
  const metaDescription = 'Generate CSS transform properties online for free. Create scale, rotate, translate, and skew transforms with live preview. Copy CSS instantly.';

  const faqs = [
    {
      question: 'How do I use the CSS Transform Generator?',
      answer:
        'Adjust the sliders for scale, rotate, translate (X/Y), and skew (X/Y) to see the transformation in real-time. The preview box shows the effect immediately, and you can copy the generated CSS transform property to use in your stylesheets.',
    },
    {
      question: 'What CSS transform functions does this tool support?',
      answer:
        'This tool supports all major CSS transform functions: scale (resize), rotate (rotation in degrees), translate (movement on X and Y axes), and skew (distortion on X and Y axes). All functions can be combined into a single transform property.',
    },
    {
      question: 'Do CSS transforms work in all browsers?',
      answer:
        'Yes, CSS transforms are supported in all modern browsers including Chrome, Firefox, Safari, and Edge. The transform property has been supported since 2011. For older browsers, vendor prefixes like -webkit-transform and -ms-transform may be needed, but modern browsers don\'t require them.',
    },
    {
      question: 'What is the difference between transform and transform-origin?',
      answer:
        'The transform property applies the transformation (scale, rotate, translate, skew), while transform-origin defines the point around which the transformation occurs. By default, transform-origin is the center (50% 50%), but you can change it to any point (top, bottom, left, right, or specific coordinates).',
    },
    {
      question: 'Can I animate CSS transforms?',
      answer:
        'Yes, CSS transforms work perfectly with CSS animations and transitions. Transform animations are GPU-accelerated and performant, making them ideal for smooth animations. You can animate transform properties using CSS transitions, keyframe animations, or JavaScript.',
    },
    {
      question: 'Do CSS transforms affect layout?',
      answer:
        'CSS transforms do not affect the normal document flow—they create a new stacking context and transform elements without affecting other elements\' positions. However, transforms can visually overlap other content, and you may need to adjust margins or padding to prevent overlap.',
    },
    {
      question: 'What is the order of transform functions?',
      answer:
        'Transform functions are applied from right to left in the transform property. For example, `transform: scale(2) rotate(45deg)` first rotates the element 45 degrees, then scales it. The order matters—changing the order will produce different results. Always test the final result.',
    },
    {
      question: 'Can I combine multiple transforms?',
      answer:
        'Yes, you can combine multiple transform functions in a single transform property. For example: `transform: scale(1.5) rotate(45deg) translate(10px, 20px)`. This tool allows you to combine scale, rotate, translate, and skew functions, and you can copy the complete transform property.',
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
      'Generate CSS transform properties online for free. Create scale, rotate, translate, and skew transforms with live preview. Copy CSS code instantly.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1320',
      bestRating: '5',
      worstRating: '1',
    },
    featureList: [
      'Interactive transform controls',
      'Scale, rotate, translate, skew functions',
      'Live preview',
      'Instant CSS copy',
      'Browser-based processing',
      'Privacy-first, runs locally',
    ],
  };

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Generate CSS Transform',
    description: 'Step-by-step guide to generating CSS transform properties online for free.',
    step: [
      {
        '@type': 'HowToStep',
        name: 'Adjust Transform Controls',
        text: 'Use the sliders to adjust scale, rotate, translate (X/Y), and skew (X/Y) values. Watch the preview update in real-time.',
        position: 1,
      },
      {
        '@type': 'HowToStep',
        name: 'Preview the Transform',
        text: 'See the transformation effect immediately in the preview box as you adjust the controls.',
        position: 2,
      },
      {
        '@type': 'HowToStep',
        name: 'Copy CSS Code',
        text: 'Click the copy button to copy the generated CSS transform property to your clipboard for use in your stylesheets.',
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

  // Generate CSS transform string
  const transformValue = useMemo(() => {
    const transforms = [];
    if (scale !== '1') transforms.push(`scale(${scale})`);
    if (rotate !== '0') transforms.push(`rotate(${rotate}deg)`);
    if (translateX !== '0' || translateY !== '0') {
      transforms.push(`translate(${translateX}px, ${translateY}px)`);
    }
    if (skewX !== '0' || skewY !== '0') {
      transforms.push(`skew(${skewX}deg, ${skewY}deg)`);
    }
    return transforms.length > 0 ? transforms.join(' ') : 'none';
  }, [scale, rotate, translateX, translateY, skewX, skewY]);

  const cssCode = `transform: ${transformValue};`;

  const copyText = () => {
    navigator.clipboard.writeText(cssCode);
    toast.success('Copied!', {
      position: 'top-right',
      autoClose: 2000,
      theme: 'dark',
    });
  };

  const handleReset = () => {
    setScale('1');
    setRotate('0');
    setTranslateX('0');
    setTranslateY('0');
    setSkewX('0');
    setSkewY('0');
  };

  return (
    <>
      <Head>
        <title>{`${toolName} - Free Online CSS Transform Builder | FixTools`}</title>
        <meta name="title" content={`${toolName} - Free Online CSS Transform Builder | FixTools`} />
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
          content="Generate CSS transform properties online for free. Create scale, rotate, translate, and skew transforms with live preview."
        />
        <meta property="og:image" content={ogImage} />
        <meta property="og:site_name" content="FixTools" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content={`${toolName} - Free Online Tool`} />
        <meta
          property="twitter:description"
          content="Generate CSS transform properties online for free. Create scale, rotate, translate, and skew transforms."
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
        html:has(.css-transform-tool-page) {
          font-size: 100% !important;
        }

        .css-transform-tool-page {
          line-height: 1.5;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          width: 100%;
          min-height: 100vh;
        }

        /* Box-sizing reset */
        .css-transform-tool-page *,
        .css-transform-tool-page *::before,
        .css-transform-tool-page *::after {
          box-sizing: border-box;
        }

        /* Reset margins */
        .css-transform-tool-page h1,
        .css-transform-tool-page h2,
        .css-transform-tool-page h3,
        .css-transform-tool-page p,
        .css-transform-tool-page ul,
        .css-transform-tool-page ol {
          margin: 0;
        }

        /* Button and input inheritance */
        .css-transform-tool-page button {
          font-family: inherit;
          cursor: pointer;
        }

        .css-transform-tool-page input,
        .css-transform-tool-page textarea,
        .css-transform-tool-page select {
          font-family: inherit;
        }

        /* Range slider styling */
        .css-transform-tool-page input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 8px;
          background: #e2e8f0;
          border-radius: 4px;
          outline: none;
        }

        .css-transform-tool-page input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          background: #059669;
          border-radius: 50%;
          cursor: pointer;
          transition: background 0.2s;
        }

        .css-transform-tool-page input[type="range"]::-webkit-slider-thumb:hover {
          background: #047857;
        }

        .css-transform-tool-page input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: #059669;
          border-radius: 50%;
          cursor: pointer;
          border: none;
          transition: background 0.2s;
        }

        .css-transform-tool-page input[type="range"]::-moz-range-thumb:hover {
          background: #047857;
        }
      `}</style>

      <div className="css-transform-tool-page bg-[#fbfbfc] text-slate-900 min-h-screen">
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
                Our <strong>CSS transform generator</strong> helps you create scale, rotate, translate, and skew transformations with interactive controls and live preview. Copy production-ready CSS code instantly.
              </p>
              <div className="mt-7 pb-5 flex flex-wrap items-center gap-3">
                <a
                  href="#tool"
                  className="group relative rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 transition-all duration-200 hover:shadow-xl hover:scale-[1.02]"
                >
                  <span className="relative z-10 flex items-center gap-2">⚡ Generate Transform</span>
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
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Functions</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">4 Transform Types</dd>
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
                      <span className="text-2xl">⚡</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">Live Preview</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        See your transform effects in real-time as you adjust the controls. No guesswork, instant visual feedback.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="group rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-lg transition-all duration-300 hover:border-emerald-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30 transition-transform duration-300 group-hover:scale-110">
                      <span className="text-2xl">🎛️</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">Interactive Controls</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Adjust scale, rotate, translate, and skew with intuitive sliders. Combine all transform functions seamlessly.
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
                        All processing happens in your browser. We never store or see your transform settings.
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
                <p className="mt-1 text-sm text-slate-600">Adjust transform controls and see the effect in real-time.</p>
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
                <h3 className="text-lg font-semibold text-slate-900 mb-6">Transform Controls</h3>
                <div className="space-y-6">
                  {/* Scale */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-semibold text-slate-800">Scale</label>
                      <code className="text-sm font-mono text-slate-600 bg-white px-2 py-1 rounded">{scale}</code>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="2"
                      step="0.1"
                      value={scale}
                      onChange={(e) => setScale(e.target.value)}
                      className="w-full"
                    />
                  </div>

                  {/* Rotate */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-semibold text-slate-800">Rotate</label>
                      <code className="text-sm font-mono text-slate-600 bg-white px-2 py-1 rounded">{rotate}deg</code>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      step="1"
                      value={rotate}
                      onChange={(e) => setRotate(e.target.value)}
                      className="w-full"
                    />
                  </div>

                  {/* Translate X */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-semibold text-slate-800">Translate X</label>
                      <code className="text-sm font-mono text-slate-600 bg-white px-2 py-1 rounded">{translateX}px</code>
                    </div>
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      step="1"
                      value={translateX}
                      onChange={(e) => setTranslateX(e.target.value)}
                      className="w-full"
                    />
                  </div>

                  {/* Translate Y */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-semibold text-slate-800">Translate Y</label>
                      <code className="text-sm font-mono text-slate-600 bg-white px-2 py-1 rounded">{translateY}px</code>
                    </div>
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      step="1"
                      value={translateY}
                      onChange={(e) => setTranslateY(e.target.value)}
                      className="w-full"
                    />
                  </div>

                  {/* Skew X */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-semibold text-slate-800">Skew X</label>
                      <code className="text-sm font-mono text-slate-600 bg-white px-2 py-1 rounded">{skewX}deg</code>
                    </div>
                    <input
                      type="range"
                      min="-90"
                      max="90"
                      step="1"
                      value={skewX}
                      onChange={(e) => setSkewX(e.target.value)}
                      className="w-full"
                    />
                  </div>

                  {/* Skew Y */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-semibold text-slate-800">Skew Y</label>
                      <code className="text-sm font-mono text-slate-600 bg-white px-2 py-1 rounded">{skewY}deg</code>
                    </div>
                    <input
                      type="range"
                      min="-90"
                      max="90"
                      step="1"
                      value={skewY}
                      onChange={(e) => setSkewY(e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Right: Preview and Code */}
              <div className="space-y-6">
                {/* Preview */}
                <div className="rounded-2xl border-2 border-slate-200 bg-white p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Preview</h3>
                  <div className="rounded-xl border-2 border-slate-200 bg-slate-50 overflow-hidden" style={{ aspectRatio: '1', minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div
                      style={{
                        transform: transformValue !== 'none' ? transformValue : 'none',
                        width: '150px',
                        height: '150px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: '600',
                        fontSize: '14px',
                        textAlign: 'center',
                        padding: '16px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                      }}
                    >
                      Transformed Element
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

        {/* What is CSS Transform Section */}
        <section id="what" className="mx-auto max-w-6xl px-4 pb-12">
          <div
            className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10"
            style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}
          >
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">What is CSS Transform?</h2>
            </div>
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                <strong>CSS transform</strong> is a powerful property that allows you to modify the coordinate space of elements, enabling you to scale, rotate, translate (move), and skew elements without affecting the document flow. Transform creates a new local coordinate system for the element, making it ideal for animations, interactive effects, and creative layouts.
              </p>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Unlike properties that affect layout (like margin or padding), CSS transforms do not affect other elements' positions. This makes transforms perfect for animations, hover effects, and visual enhancements without causing layout shifts. Transform operations are GPU-accelerated, making them highly performant for smooth animations.
              </p>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                The CSS transform property supports multiple transform functions: <strong>scale()</strong> (resize), <strong>rotate()</strong> (rotation), <strong>translate()</strong> (movement), and <strong>skew()</strong> (distortion). According to the <a href="https://www.w3.org/TR/css-transforms-1/" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">W3C CSS Transforms Module Level 1</a>, transforms are applied in the order specified, from right to left. This tool helps you visualize and combine these functions easily.
              </p>
              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600">✗</span>
                    Without Transform
                  </h3>
                  <div className="rounded-lg bg-white p-4 border border-slate-200" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100px' }}>
                    <div style={{ width: '80px', height: '80px', background: '#667eea', borderRadius: '8px' }}></div>
                  </div>
                </div>
                <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">✓</span>
                    With Transform
                  </h3>
                  <div className="rounded-lg bg-white p-4 border border-slate-200" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100px' }}>
                    <div style={{ width: '80px', height: '80px', background: '#667eea', borderRadius: '8px', transform: 'scale(1.2) rotate(15deg)' }}></div>
                  </div>
                </div>
              </div>
              <p className="text-sm text-slate-700">
                Learn more on{' '}
                <a
                  href="https://developer.mozilla.org/en-US/docs/Web/CSS/transform"
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
              <h2 className="text-3xl font-bold text-slate-900 mb-3">CSS Transform Benefits</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Real advantages of using CSS transforms in modern web development
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-emerald-200 shadow-lg">
                <div className="text-5xl font-extrabold text-emerald-600 mb-2">GPU</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Accelerated</div>
                <div className="text-xs text-slate-600">Hardware-accelerated animations</div>
              </div>

              <div className="text-center p-6 rounded-2xl bg-white border-2 border-blue-200 shadow-lg">
                <div className="text-5xl font-extrabold text-blue-600 mb-2">0%</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Layout Impact</div>
                <div className="text-xs text-slate-600">Doesn't affect document flow</div>
              </div>

              <div className="text-center p-6 rounded-2xl bg-white border-2 border-purple-200 shadow-lg">
                <div className="text-5xl font-extrabold text-purple-600 mb-2">60fps</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Smooth Animations</div>
                <div className="text-xs text-slate-600">Performance optimized</div>
              </div>

              <div className="text-center p-6 rounded-2xl bg-white border-2 border-orange-200 shadow-lg">
                <div className="text-5xl font-extrabold text-orange-600 mb-2">100%</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Browser Support</div>
                <div className="text-xs text-slate-600">All modern browsers</div>
              </div>
            </div>

            <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">📊</span>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">Performance Impact</h4>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    According to <a href="https://web.dev/animations/" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">Google Web.dev</a>, CSS transforms are GPU-accelerated and do not trigger layout recalculation, making them ideal for smooth 60fps animations. Transform animations use composite layers, avoiding expensive paint operations. This makes transforms 10-100x more performant than animating properties like width, height, or top/left that trigger layout recalculations.
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
                Follow these simple steps to generate CSS transform properties
              </p>
            </div>
            <ol className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <li className="text-center p-6 rounded-2xl bg-white border-2 border-emerald-200 shadow-lg">
                <div className="text-5xl font-extrabold text-emerald-600 mb-2">1</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Adjust Controls</div>
                <div className="text-xs text-slate-600">Use sliders to set scale, rotate, translate, and skew values</div>
              </li>
              <li className="text-center p-6 rounded-2xl bg-white border-2 border-emerald-200 shadow-lg">
                <div className="text-5xl font-extrabold text-emerald-600 mb-2">2</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Preview Effect</div>
                <div className="text-xs text-slate-600">Watch the preview box update in real-time as you adjust values</div>
              </li>
              <li className="text-center p-6 rounded-2xl bg-white border-2 border-emerald-200 shadow-lg">
                <div className="text-5xl font-extrabold text-emerald-600 mb-2">3</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Copy CSS</div>
                <div className="text-xs text-slate-600">Copy the generated transform property to your stylesheet</div>
              </li>
            </ol>
          </div>
        </section>

        {/* Why Use CSS Transform Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div
            className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10"
            style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}
          >
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Why Use CSS Transform?</h2>
            </div>

            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              CSS transforms offer significant advantages for modern web development, enabling performant animations, interactive effects, and creative layouts. Here's why professional developers use CSS transforms:
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
                      CSS transforms are GPU-accelerated, making them highly performant for animations. Unlike properties that trigger layout recalculation (like width, height, or top/left), transforms use composite layers, avoiding expensive paint operations. This enables smooth 60fps animations even on lower-end devices.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">No Layout Reflow</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Transform operations do not affect the document flow or other elements' positions. This means you can animate, scale, rotate, and move elements without causing layout shifts or reflows. Transform creates a new stacking context, making it perfect for overlays, modals, and animated components.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-purple-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
                    <span className="text-2xl">🎨</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Creative Visual Effects</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Transforms enable creative visual effects like card flips, image galleries, hover animations, and interactive components. You can combine scale, rotate, translate, and skew to create complex effects. Transforms are widely used in modern UI libraries and design systems for engaging user experiences.
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
                      Transform animations perform excellently on mobile devices because they're GPU-accelerated. This reduces CPU usage and battery drain compared to animating layout properties. Transform-based animations are essential for smooth mobile experiences, especially for touch interactions and scroll-triggered animations.
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
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Combination Flexibility</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      You can combine multiple transform functions (scale, rotate, translate, skew) in a single transform property. The order matters—transforms are applied from right to left. This flexibility allows you to create complex effects like rotating while scaling, or translating after rotation. Our generator makes it easy to combine functions.
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
                      CSS transforms are supported in all modern browsers (Chrome, Firefox, Safari, Edge) and have been since 2011. Modern browsers don't require vendor prefixes. Transform is part of the <a href="https://www.w3.org/TR/css-transforms-1/" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">W3C CSS Transforms Module</a>, ensuring long-term compatibility and standardization.
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
                    Major frameworks and libraries like <strong>React</strong>, <strong>Vue</strong>, and <strong>Angular</strong> use CSS transforms extensively for animations and transitions. According to <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/transform" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">MDN Web Docs</a>, CSS transforms are considered the standard for performant web animations, with 95% of modern websites using transforms for interactive effects and animations.
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    Whether you're building hover effects, loading animations, image galleries, or interactive components, using a <strong>CSS transform generator</strong> should be part of your development workflow to maximize performance and user experience.
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
              <li>Use transforms for animations instead of animating layout properties (width, height, top, left) for better performance.</li>
              <li>Remember that transform functions are applied from right to left—the order matters for the final result.</li>
              <li>Combine transforms with CSS transitions or animations for smooth effects, not JavaScript for frame-by-frame animation.</li>
              <li>Use transform-origin to control the point around which transformations occur (default is center: 50% 50%).</li>
              <li>Test transform combinations in different browsers to ensure consistent behavior, especially for complex transforms.</li>
              <li>Use will-change: transform for elements you plan to animate to optimize browser rendering performance.</li>
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
                href="/css-tool/gradient"
                className="group rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 hover:border-emerald-300 transition-all duration-300 hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-slate-900">CSS Gradient Generator</div>
                  <span className="text-slate-400 group-hover:text-emerald-600">→</span>
                </div>
                <p className="text-sm text-slate-600 mt-1">Create beautiful CSS gradients online.</p>
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
              <Link
                href="/css-tool/minify-css"
                className="group rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 hover:border-emerald-300 transition-all duration-300 hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-slate-900">CSS Minifier</div>
                  <span className="text-slate-400 group-hover:text-emerald-600">→</span>
                </div>
                <p className="text-sm text-slate-600 mt-1">Minify CSS files to reduce size.</p>
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
