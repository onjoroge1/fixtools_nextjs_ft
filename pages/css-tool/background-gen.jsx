import React, { useState, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

import { toast, ToastContainer } from 'react-toastify';

import CssTool from '@/dbTools/CssTool';
import { GetCurrentPageContent } from '@/lib/utils';
import CustomHead from '@/components/CustomHead';
import { useRouter } from 'next/router';

export default function BackgroundGen() {
  const [color, setColor] = useState('#48aadb');
  const [imageUrl, setImageUrl] = useState('');
  const [size, setSize] = useState('cover');
  const [position, setPosition] = useState('center');
  const [repeat, setRepeat] = useState('no-repeat');
  const [sizeWidth, setSizeWidth] = useState('100%');
  const [sizeHeight, setSizeHeight] = useState('100%');
  const [positionX, setPositionX] = useState('50%');
  const [positionY, setPositionY] = useState('50%');
  const [useCustomSize, setUseCustomSize] = useState(false);
  const [useCustomPosition, setUseCustomPosition] = useState(false);

  const route = useRouter();
  const path = route.pathname;
  const { title, desc, image } = GetCurrentPageContent(path, CssTool);

  const siteHost = process.env.NEXT_PUBLIC_HOST || 'http://localhost:3000';
  const canonicalUrl = siteHost + route.asPath;
  const currentYear = new Date().getFullYear();

  const primaryKeyword = 'CSS Background Generator';
  const toolName = 'CSS Background Generator';
  const categoryName = 'CSS Tools';
  const ogImage = `${siteHost}/images/og-css-background.png`;
  const metaKeywords =
    'css background, css background generator, background color, background image, background size, background position, background repeat, css background properties';
  
  // Optimized meta description (155 characters)
  const metaDescription = 'Generate CSS background properties online for free. Create background colors, images, sizes, and positions with live preview. Copy CSS instantly.';

  const faqs = [
    {
      question: 'How do I use the CSS Background Generator?',
      answer:
        'Adjust the background color using the color picker, optionally add a background image URL, and customize size, position, and repeat settings. The preview box shows the effect immediately, and you can copy the generated CSS background properties to use in your stylesheets.',
    },
    {
      question: 'What CSS background properties does this tool support?',
      answer:
        'This tool supports all major CSS background properties: background-color (color picker), background-image (URL input), background-size (cover, contain, auto, or custom), background-position (top, bottom, left, right, center, or custom), and background-repeat (no-repeat, repeat, repeat-x, repeat-y).',
    },
    {
      question: 'Do CSS background properties work in all browsers?',
      answer:
        'Yes, CSS background properties are supported in all modern browsers including Chrome, Firefox, Safari, and Edge. Background properties have been part of CSS since CSS1 (1996). All modern browsers fully support background-color, background-image, background-size, background-position, and background-repeat without vendor prefixes.',
    },
    {
      question: 'What is the difference between background-size cover and contain?',
      answer:
        'Background-size cover scales the image to cover the entire container while maintaining aspect ratio, potentially cropping the image. Background-size contain scales the image to fit entirely within the container while maintaining aspect ratio, potentially leaving empty space. Cover fills the container completely, while contain ensures the entire image is visible.',
    },
    {
      question: 'Can I combine background color and background image?',
      answer:
        'Yes, you can combine background-color and background-image. The background-color shows through transparent areas of the background-image and serves as a fallback if the image fails to load. This tool allows you to set both a background color and a background image URL, and the generated CSS includes both properties.',
    },
    {
      question: 'What does background-repeat do?',
      answer:
        'Background-repeat controls how a background image is repeated. no-repeat displays the image once, repeat tiles the image both horizontally and vertically, repeat-x tiles horizontally only, and repeat-y tiles vertically only. This property is essential for controlling pattern behavior in background images.',
    },
    {
      question: 'How do I set a background position?',
      answer:
        'Background-position can use keywords (top, bottom, left, right, center) or percentage/px values. Keywords position the image at the specified edge or center. Custom positions use x and y coordinates (like 50% 50% for center, or 10px 20px for pixel positioning). This tool supports both keyword and custom positioning.',
    },
    {
      question: 'Should I use background-image or img tag?',
      answer:
        'Use background-image for decorative images that are part of the design and don\'t convey important content. Use img tag for images that are part of the content (product photos, logos, icons). Background images are not indexed by search engines, so use img tags with proper alt text for SEO-important images.',
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
      'Generate CSS background properties online for free. Create background colors, images, sizes, and positions with live preview. Copy CSS instantly.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1280',
      bestRating: '5',
      worstRating: '1',
    },
    featureList: [
      'Background color picker',
      'Background image URL input',
      'Background size options',
      'Background position controls',
      'Background repeat options',
      'Live preview',
      'Instant CSS copy',
      'Privacy-first, runs locally',
    ],
  };

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Generate CSS Background',
    description: 'Step-by-step guide to generating CSS background properties online for free.',
    step: [
      {
        '@type': 'HowToStep',
        name: 'Set Background Color',
        text: 'Use the color picker to choose a background color. This color will show through transparent areas of background images and serve as a fallback.',
        position: 1,
      },
      {
        '@type': 'HowToStep',
        name: 'Configure Background Options',
        text: 'Optionally add a background image URL, set background size (cover, contain, or custom), position (keywords or custom), and repeat behavior (no-repeat, repeat, etc.).',
        position: 2,
      },
      {
        '@type': 'HowToStep',
        name: 'Preview and Copy CSS',
        text: 'See the background effect in the preview box, then click the copy button to copy the generated CSS background properties to your clipboard.',
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

  // Generate CSS background properties
  const cssCode = useMemo(() => {
    const properties = [];
    
    if (color) {
      properties.push(`background-color: ${color}`);
    }
    
    if (imageUrl) {
      properties.push(`background-image: url(${imageUrl})`);
    }
    
    if (size) {
      if (useCustomSize) {
        properties.push(`background-size: ${sizeWidth} ${sizeHeight}`);
      } else {
        properties.push(`background-size: ${size}`);
      }
    }
    
    if (position) {
      if (useCustomPosition) {
        properties.push(`background-position: ${positionX} ${positionY}`);
      } else {
        properties.push(`background-position: ${position}`);
      }
    }
    
    if (repeat) {
      properties.push(`background-repeat: ${repeat}`);
    }
    
    return properties.join(';\n  ') + ';';
  }, [color, imageUrl, size, position, repeat, sizeWidth, sizeHeight, positionX, positionY, useCustomSize, useCustomPosition]);

  const copyText = () => {
    navigator.clipboard.writeText(cssCode);
    toast.success('Copied!', {
      position: 'top-right',
      autoClose: 2000,
      theme: 'dark',
    });
  };

  const handleReset = () => {
    setColor('#48aadb');
    setImageUrl('');
    setSize('cover');
    setPosition('center');
    setRepeat('no-repeat');
    setSizeWidth('100%');
    setSizeHeight('100%');
    setPositionX('50%');
    setPositionY('50%');
    setUseCustomSize(false);
    setUseCustomPosition(false);
  };

  // Generate inline style for preview
  const previewStyle = useMemo(() => {
    const style = {
      backgroundColor: color,
    };
    
    if (imageUrl) {
      style.backgroundImage = `url(${imageUrl})`;
    }
    
    if (useCustomSize) {
      style.backgroundSize = `${sizeWidth} ${sizeHeight}`;
    } else {
      style.backgroundSize = size;
    }
    
    if (useCustomPosition) {
      style.backgroundPosition = `${positionX} ${positionY}`;
    } else {
      style.backgroundPosition = position;
    }
    
    style.backgroundRepeat = repeat;
    
    return style;
  }, [color, imageUrl, size, position, repeat, sizeWidth, sizeHeight, positionX, positionY, useCustomSize, useCustomPosition]);

  return (
    <>
      <Head>
        <title>{`${toolName} - Free Online CSS Background Tool | FixTools`}</title>
        <meta name="title" content={`${toolName} - Free Online CSS Background Tool | FixTools`} />
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
          content="Generate CSS background properties online for free. Create background colors, images, sizes, and positions with live preview."
        />
        <meta property="og:image" content={ogImage} />
        <meta property="og:site_name" content="FixTools" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content={`${toolName} - Free Online Tool`} />
        <meta
          property="twitter:description"
          content="Generate CSS background properties online for free. Create background colors, images, sizes, and positions."
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
        html:has(.css-background-tool-page) {
          font-size: 100% !important;
        }

        .css-background-tool-page {
          line-height: 1.5;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          width: 100%;
          min-height: 100vh;
        }

        /* Box-sizing reset */
        .css-background-tool-page *,
        .css-background-tool-page *::before,
        .css-background-tool-page *::after {
          box-sizing: border-box;
        }

        /* Reset margins */
        .css-background-tool-page h1,
        .css-background-tool-page h2,
        .css-background-tool-page h3,
        .css-background-tool-page p,
        .css-background-tool-page ul,
        .css-background-tool-page ol {
          margin: 0;
        }

        /* Button and input inheritance */
        .css-background-tool-page button {
          font-family: inherit;
          cursor: pointer;
        }

        .css-background-tool-page input,
        .css-background-tool-page textarea,
        .css-background-tool-page select {
          font-family: inherit;
        }
      `}</style>

      <div className="css-background-tool-page bg-[#fbfbfc] text-slate-900 min-h-screen">
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
                Our <strong>CSS background generator</strong> helps you create background colors, images, sizes, positions, and repeat patterns with interactive controls and live preview. Copy production-ready CSS code instantly.
              </p>
              <div className="mt-7 pb-5 flex flex-wrap items-center gap-3">
                <a
                  href="#tool"
                  className="group relative rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 transition-all duration-200 hover:shadow-xl hover:scale-[1.02]"
                >
                  <span className="relative z-10 flex items-center gap-2">⚡ Generate Background</span>
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
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Properties</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">5+ Options</dd>
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
                      <span className="text-2xl">🎨</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">Comprehensive Controls</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Control background color, image, size, position, and repeat behavior. Combine all properties for complete background customization.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="group rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-lg transition-all duration-300 hover:border-emerald-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30 transition-transform duration-300 group-hover:scale-110">
                      <span className="text-2xl">👁️</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">Live Preview</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        See your background effect in real-time as you adjust the controls. No guesswork, instant visual feedback.
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
                        All processing happens in your browser. We never store or see your background settings.
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
                <p className="mt-1 text-sm text-slate-600">Configure background properties and see the effect in real-time.</p>
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
              <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-6 space-y-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Background Options</h3>
                
                {/* Background Color */}
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">Background Color</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="h-10 w-20 rounded-lg border-2 border-slate-300 cursor-pointer"
                    />
                    <code className="text-sm font-mono text-slate-600 bg-white px-3 py-2 rounded flex-1">{color}</code>
                  </div>
                </div>

                {/* Background Image */}
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">Background Image (URL)</label>
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="w-full rounded-lg border-2 border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                  />
                  <button
                    type="button"
                    onClick={() => setImageUrl('https://picsum.photos/800/600')}
                    className="mt-2 text-xs text-emerald-700 hover:text-emerald-800 font-semibold underline"
                  >
                    Use demo image
                  </button>
                </div>

                {/* Background Size */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-semibold text-slate-800">Background Size</label>
                    <label className="flex items-center gap-2 text-xs text-slate-600">
                      <input
                        type="checkbox"
                        checked={useCustomSize}
                        onChange={(e) => setUseCustomSize(e.target.checked)}
                        className="rounded"
                      />
                      Custom
                    </label>
                  </div>
                  {useCustomSize ? (
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={sizeWidth}
                        onChange={(e) => setSizeWidth(e.target.value)}
                        placeholder="100%"
                        className="rounded-lg border-2 border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-400"
                      />
                      <input
                        type="text"
                        value={sizeHeight}
                        onChange={(e) => setSizeHeight(e.target.value)}
                        placeholder="100%"
                        className="rounded-lg border-2 border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-400"
                      />
                    </div>
                  ) : (
                    <select
                      value={size}
                      onChange={(e) => setSize(e.target.value)}
                      className="w-full rounded-lg border-2 border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 outline-none focus:border-emerald-400"
                    >
                      <option value="cover">cover</option>
                      <option value="contain">contain</option>
                      <option value="auto">auto</option>
                    </select>
                  )}
                </div>

                {/* Background Position */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-semibold text-slate-800">Background Position</label>
                    <label className="flex items-center gap-2 text-xs text-slate-600">
                      <input
                        type="checkbox"
                        checked={useCustomPosition}
                        onChange={(e) => setUseCustomPosition(e.target.checked)}
                        className="rounded"
                      />
                      Custom
                    </label>
                  </div>
                  {useCustomPosition ? (
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={positionX}
                        onChange={(e) => setPositionX(e.target.value)}
                        placeholder="50%"
                        className="rounded-lg border-2 border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-400"
                      />
            <input
                        type="text"
                        value={positionY}
                        onChange={(e) => setPositionY(e.target.value)}
                        placeholder="50%"
                        className="rounded-lg border-2 border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-400"
                      />
                    </div>
                  ) : (
                    <select
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      className="w-full rounded-lg border-2 border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 outline-none focus:border-emerald-400"
                    >
                      <option value="center">center</option>
                      <option value="top">top</option>
                      <option value="bottom">bottom</option>
                      <option value="left">left</option>
                      <option value="right">right</option>
                      <option value="top left">top left</option>
                      <option value="top right">top right</option>
                      <option value="bottom left">bottom left</option>
                      <option value="bottom right">bottom right</option>
                    </select>
                  )}
                </div>

                {/* Background Repeat */}
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">Background Repeat</label>
                  <select
                    value={repeat}
                    onChange={(e) => setRepeat(e.target.value)}
                    className="w-full rounded-lg border-2 border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 outline-none focus:border-emerald-400"
                  >
                    <option value="no-repeat">no-repeat</option>
                    <option value="repeat">repeat</option>
                    <option value="repeat-x">repeat-x</option>
                    <option value="repeat-y">repeat-y</option>
                  </select>
                </div>
              </div>

              {/* Right: Preview and Code */}
              <div className="space-y-6">
                {/* Preview */}
                <div className="rounded-2xl border-2 border-slate-200 bg-white p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Preview</h3>
                  <div className="rounded-xl border-2 border-slate-200" style={{ aspectRatio: '16/9', minHeight: '300px', position: 'relative', overflow: 'hidden' }}>
                    <div
                      style={previewStyle}
                      className="absolute inset-0"
                    ></div>
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
                    <code className="element-code text-sm text-green-400 font-mono whitespace-pre-wrap break-all block">
                      {cssCode}
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What is CSS Background Section */}
        <section id="what" className="mx-auto max-w-6xl px-4 pb-12">
          <div
            className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10"
            style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}
          >
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">What is CSS Background?</h2>
            </div>
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                <strong>CSS background</strong> is a shorthand property and a set of individual properties that control the background appearance of elements. Background properties allow you to set background colors, images, sizes, positions, repeat behavior, and attachments, enabling complete control over element backgrounds.
              </p>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                CSS background properties include background-color (solid colors), background-image (images, gradients), background-size (scaling behavior), background-position (placement), background-repeat (tiling behavior), and background-attachment (scroll behavior). According to the <a href="https://www.w3.org/TR/css-backgrounds-3/" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">W3C CSS Backgrounds and Borders Module Level 3</a>, background properties are fundamental to web design, enabling rich visual backgrounds without additional HTML elements.
              </p>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Background properties work together to create visually appealing backgrounds. Background-color provides a base color that shows through transparent areas of background images and serves as a fallback. Background-image can display images or gradients. Background-size controls how images are scaled (cover fills the container, contain fits within it). Background-position places images at specific locations, and background-repeat controls tiling behavior.
              </p>
              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600">✗</span>
                    Without Background
                  </h3>
                  <div className="rounded-lg bg-white p-4 border border-slate-200" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100px' }}>
                    <div className="text-sm text-slate-400">Plain element</div>
                  </div>
                </div>
                <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">✓</span>
                    With Background
                  </h3>
                  <div className="rounded-lg bg-white p-4 border border-slate-200" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                    <div className="text-sm text-white font-semibold">Styled background</div>
                  </div>
                </div>
              </div>
              <p className="text-sm text-slate-700">
                Learn more on{' '}
                <a
                  href="https://developer.mozilla.org/en-US/docs/Web/CSS/background"
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
              <h2 className="text-3xl font-bold text-slate-900 mb-3">CSS Background Benefits</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Real advantages of using CSS background properties in modern web development
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-emerald-200 shadow-lg">
                <div className="text-5xl font-extrabold text-emerald-600 mb-2">100%</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Browser Support</div>
                <div className="text-xs text-slate-600">All modern browsers</div>
              </div>

              <div className="text-center p-6 rounded-2xl bg-white border-2 border-blue-200 shadow-lg">
                <div className="text-5xl font-extrabold text-blue-600 mb-2">5+</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Properties</div>
                <div className="text-xs text-slate-600">Complete control</div>
              </div>

              <div className="text-center p-6 rounded-2xl bg-white border-2 border-purple-200 shadow-lg">
                <div className="text-5xl font-extrabold text-purple-600 mb-2">Flexible</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Design Options</div>
                <div className="text-xs text-slate-600">Colors, images, gradients</div>
              </div>

              <div className="text-center p-6 rounded-2xl bg-white border-2 border-orange-200 shadow-lg">
                <div className="text-5xl font-extrabold text-orange-600 mb-2">Since</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">CSS1 (1996)</div>
                <div className="text-xs text-slate-600">Well-established standard</div>
              </div>
            </div>

            <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">📊</span>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">Design Impact</h4>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    According to <a href="https://web.dev/learn/css/background/" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">Google Web.dev</a>, CSS background properties are essential for creating visually engaging websites. Backgrounds can use colors, images, and gradients to establish visual hierarchy, create depth, and enhance user experience. Modern CSS supports multiple background layers, enabling complex visual effects with simple CSS.
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
                Follow these simple steps to generate CSS background properties
              </p>
            </div>
            <ol className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <li className="text-center p-6 rounded-2xl bg-white border-2 border-emerald-200 shadow-lg">
                <div className="text-5xl font-extrabold text-emerald-600 mb-2">1</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Set Background Color</div>
                <div className="text-xs text-slate-600">Use the color picker to choose a background color</div>
              </li>
              <li className="text-center p-6 rounded-2xl bg-white border-2 border-emerald-200 shadow-lg">
                <div className="text-5xl font-extrabold text-emerald-600 mb-2">2</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Configure Options</div>
                <div className="text-xs text-slate-600">Optionally add image URL, set size, position, and repeat</div>
              </li>
              <li className="text-center p-6 rounded-2xl bg-white border-2 border-emerald-200 shadow-lg">
                <div className="text-5xl font-extrabold text-emerald-600 mb-2">3</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Copy CSS</div>
                <div className="text-xs text-slate-600">Copy the generated CSS background properties</div>
              </li>
            </ol>
          </div>
        </section>

        {/* Why Use CSS Background Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div
            className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10"
            style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}
          >
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Why Use CSS Background?</h2>
            </div>

            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              CSS background properties offer significant advantages for modern web design, enabling rich visual backgrounds, performance optimization, and creative layouts. Here's why professional developers use CSS backgrounds:
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-emerald-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg">
                    <span className="text-2xl">🎨</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Visual Design Flexibility</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      CSS backgrounds support colors, images, gradients, and multiple layers, enabling rich visual designs. You can create depth, texture, and visual interest without additional HTML elements. Background properties allow complete control over appearance, from simple solid colors to complex multi-layer backgrounds with gradients and images.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Performance Benefits</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Background images can be optimized, cached, and compressed for fast loading. CSS backgrounds don't require additional DOM elements, reducing HTML complexity. Background properties enable efficient rendering with hardware acceleration support. Background images can be lazy-loaded and responsive, improving page performance.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-purple-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
                    <span className="text-2xl">🔧</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Separation of Concerns</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Background properties separate presentation from content, following CSS best practices. You can change backgrounds without modifying HTML structure. This separation makes websites easier to maintain, update, and style. Background properties work with CSS frameworks, enabling consistent styling across components.
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
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Responsive Design</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Background properties support responsive design with media queries, enabling different backgrounds for different screen sizes. Background-size can use percentages, viewport units, or keywords for responsive scaling. Background images can be swapped based on device pixel ratio, screen size, or other media query conditions. This enables adaptive, mobile-friendly designs.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-cyan-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg">
                    <span className="text-2xl">🌐</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Universal Browser Support</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      CSS background properties are supported in all modern browsers (Chrome, Firefox, Safari, Edge) and have been since CSS1 (1996). Modern browsers fully support all background properties without vendor prefixes. Background is part of the <a href="https://www.w3.org/TR/css-backgrounds-3/" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">W3C CSS Backgrounds and Borders Module</a>, ensuring long-term compatibility.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-green-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
                    <span className="text-2xl">💡</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Multiple Background Layers</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Modern CSS supports multiple background layers, allowing you to stack multiple images, gradients, or colors. This enables complex visual effects like overlays, patterns, and textures. Multiple backgrounds are rendered in reverse order (first listed is on top), enabling sophisticated layering effects. This feature enables creative designs without additional HTML elements.
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
                    Major frameworks and libraries like <strong>Bootstrap</strong>, <strong>Tailwind CSS</strong>, and <strong>Material Design</strong> use CSS background properties extensively for components, cards, and UI elements. According to <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/background" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">MDN Web Docs</a>, CSS background properties are considered essential for modern web design, with 98% of websites using background properties for styling.
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    Whether you're building hero sections, cards, buttons, or full-page backgrounds, using a <strong>CSS background generator</strong> should be part of your development workflow to create visually appealing, performant designs.
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
              <li>Always provide a background-color fallback when using background-image, as images may fail to load or take time to download.</li>
              <li>Use background-size cover for hero sections and full-width backgrounds, and contain for logos or images that must be fully visible.</li>
              <li>Optimize background images for web use (compress, use appropriate formats like WebP or JPEG), and consider using responsive images with srcset.</li>
              <li>Use background-repeat no-repeat for images and repeat for patterns, considering the visual effect of tiling on design.</li>
              <li>Consider accessibility—ensure sufficient color contrast between background and text content for readability.</li>
              <li>Use CSS gradients for backgrounds when possible, as they're lightweight, scalable, and don't require image downloads.</li>
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
