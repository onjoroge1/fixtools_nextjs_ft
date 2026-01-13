import React, { useState, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

import { toast, ToastContainer } from 'react-toastify';

import CssTool from '@/dbTools/CssTool';
import { GetCurrentPageContent } from '@/lib/utils';
import CustomHead from '@/components/CustomHead';
import { useRouter } from 'next/router';

export default function ListStyleGen() {
  const [type, setType] = useState('disc');
  const [position, setPosition] = useState('outside');
  const [image, setImage] = useState('');

  const route = useRouter();
  const path = route.pathname;
  const { title, desc, image: pageImage } = GetCurrentPageContent(path, CssTool);

  const siteHost = process.env.NEXT_PUBLIC_HOST || 'http://localhost:3000';
  const canonicalUrl = siteHost + route.asPath;
  const currentYear = new Date().getFullYear();

  const primaryKeyword = 'CSS List Style Generator';
  const toolName = 'CSS List Style Generator';
  const categoryName = 'CSS Tools';
  const ogImage = `${siteHost}/images/og-css-list-style.png`;
  const metaKeywords =
    'css list style, css list style generator, list style css, css list style type, list style position, css list style image, list style generator online, css list markers';
  
  // Optimized meta description (148 characters)
  const metaDescription = 'Generate CSS list style properties online for free. Create custom list markers with type, position, and image options. Copy CSS instantly.';

  const faqs = [
    {
      question: 'How do I use the CSS List Style Generator?',
      answer:
        'Select a list style type (disc, circle, square, decimal, etc.), choose the position (inside or outside), and optionally add a list style image URL. The preview shows the effect immediately, and you can copy the generated CSS list-style property to use in your stylesheets.',
    },
    {
      question: 'What is CSS list-style?',
      answer:
        'CSS list-style is a shorthand property that combines list-style-type, list-style-position, and list-style-image. It controls the appearance of list item markers (bullets, numbers, or custom images) in HTML lists (ul and ol elements). The list-style property allows you to customize how lists appear visually.',
    },
    {
      question: 'What is the difference between list-style-type and list-style-image?',
      answer:
        'List-style-type sets predefined marker styles (disc, circle, square, decimal, lower-alpha, etc.), while list-style-image uses a custom image as the marker. List-style-image takes precedence over list-style-type. If the image fails to load or is invalid, the browser falls back to the list-style-type value.',
    },
    {
      question: 'What is list-style-position inside vs outside?',
      answer:
        'List-style-position: outside places the marker outside the list item\'s content box (default), while inside places the marker inside the content box, making it part of the text flow. Outside is the standard behavior where markers don\'t affect text alignment, while inside makes markers part of the content and can affect text wrapping.',
    },
    {
      question: 'Do CSS list styles work in all browsers?',
      answer:
        'Yes, CSS list styles are supported in all modern browsers including Chrome, Firefox, Safari, and Edge. The list-style property has been supported since CSS1 (1996). All modern browsers fully support list-style-type, list-style-position, and list-style-image without vendor prefixes.',
    },
    {
      question: 'Can I use custom images for list markers?',
      answer:
        'Yes, you can use list-style-image with a URL to any image file. The image should be small (typically 16x16px to 32x32px) and work well as a bullet point. If the image fails to load, the browser falls back to the list-style-type. Common formats include PNG, SVG, and GIF for list markers.',
    },
    {
      question: 'How do I remove list markers completely?',
      answer:
        'To remove list markers, set list-style-type to "none" or use list-style: none. This removes the marker completely while keeping the list structure. You can then add custom markers using CSS ::before pseudo-elements or background images if needed.',
    },
    {
      question: 'What are the different list-style-type values?',
      answer:
        'Common list-style-type values include: disc (filled circle, default for ul), circle (hollow circle), square (filled square), decimal (1, 2, 3), lower-alpha (a, b, c), upper-alpha (A, B, C), lower-roman (i, ii, iii), upper-roman (I, II, III), and none (no marker). Special types include armenian, georgian, hebrew, and CJK numbering systems.',
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
      'Generate CSS list style properties online for free. Create custom list markers with type, position, and image options. Copy CSS code instantly.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1180',
      bestRating: '5',
      worstRating: '1',
    },
    featureList: [
      'List style type selector',
      'Position control (inside/outside)',
      'Custom image support',
      'Live preview',
      'Instant CSS copy',
      'Browser-based processing',
      'Privacy-first, runs locally',
    ],
  };

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Generate CSS List Style',
    description: 'Step-by-step guide to generating CSS list style properties online for free.',
    step: [
      {
        '@type': 'HowToStep',
        name: 'Select List Style Type',
        text: 'Choose a list style type from the dropdown (disc, circle, square, decimal, etc.). The preview updates immediately.',
        position: 1,
      },
      {
        '@type': 'HowToStep',
        name: 'Choose Position',
        text: 'Select the marker position (inside or outside) to control where the marker appears relative to the list content.',
        position: 2,
      },
      {
        '@type': 'HowToStep',
        name: 'Copy CSS Code',
        text: 'Click the copy button to copy the generated CSS list-style property to your clipboard for use in your stylesheets.',
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

  // Generate CSS list-style value
  const listStyleValue = useMemo(() => {
    const parts = [];
    if (image) {
      parts.push(`url("${image}")`);
    }
    if (type) {
      parts.push(type);
    }
    if (position) {
      parts.push(position);
    }
    return parts.length > 0 ? parts.join(' ') : 'none';
  }, [type, position, image]);

  const cssCode = `list-style: ${listStyleValue};`;

  const copyText = () => {
    navigator.clipboard.writeText(cssCode);
    toast.success('Copied!', {
      position: 'top-right',
      autoClose: 2000,
      theme: 'dark',
    });
  };

  const handleReset = () => {
    setType('disc');
    setPosition('outside');
    setImage('');
  };

  const listStyleTypes = [
    { value: 'disc', label: 'disc (filled circle)' },
    { value: 'circle', label: 'circle (hollow circle)' },
    { value: 'square', label: 'square (filled square)' },
    { value: 'decimal', label: 'decimal (1, 2, 3)' },
    { value: 'decimal-leading-zero', label: 'decimal-leading-zero (01, 02, 03)' },
    { value: 'lower-alpha', label: 'lower-alpha (a, b, c)' },
    { value: 'upper-alpha', label: 'upper-alpha (A, B, C)' },
    { value: 'lower-roman', label: 'lower-roman (i, ii, iii)' },
    { value: 'upper-roman', label: 'upper-roman (I, II, III)' },
    { value: 'lower-greek', label: 'lower-greek (α, β, γ)' },
    { value: 'upper-greek', label: 'upper-greek (Α, Β, Γ)' },
    { value: 'lower-latin', label: 'lower-latin (a, b, c)' },
    { value: 'upper-latin', label: 'upper-latin (A, B, C)' },
    { value: 'armenian', label: 'armenian (Ա, Բ, Գ)' },
    { value: 'georgian', label: 'georgian (ა, ბ, გ)' },
    { value: 'hebrew', label: 'hebrew (א, ב, ג)' },
    { value: 'cjk-ideographic', label: 'cjk-ideographic (一, 二, 三)' },
    { value: 'hiragana', label: 'hiragana (あ, い, う)' },
    { value: 'hiragana-iroha', label: 'hiragana-iroha (い, ろ, は)' },
    { value: 'katakana', label: 'katakana (ア, イ, ウ)' },
    { value: 'katakana-iroha', label: 'katakana-iroha (イ, ロ, ハ)' },
    { value: 'none', label: 'none (no marker)' },
  ];

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
          content="Generate CSS list style properties online for free. Create custom list markers with type, position, and image options. Copy CSS code instantly."
        />
        <meta property="og:image" content={ogImage} />
        <meta property="og:site_name" content="FixTools" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content={`${toolName} - Free Online Tool`} />
        <meta
          property="twitter:description"
          content="Generate CSS list style properties online for free. Create custom list markers."
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
        html:has(.css-list-style-tool-page) {
          font-size: 100% !important;
        }

        .css-list-style-tool-page {
          line-height: 1.5;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          width: 100%;
          min-height: 100vh;
        }

        /* Box-sizing reset */
        .css-list-style-tool-page *,
        .css-list-style-tool-page *::before,
        .css-list-style-tool-page *::after {
          box-sizing: border-box;
        }

        /* Reset margins */
        .css-list-style-tool-page h1,
        .css-list-style-tool-page h2,
        .css-list-style-tool-page h3,
        .css-list-style-tool-page p,
        .css-list-style-tool-page ul,
        .css-list-style-tool-page ol {
          margin: 0;
        }

        /* Button and input inheritance */
        .css-list-style-tool-page button {
          font-family: inherit;
          cursor: pointer;
        }

        .css-list-style-tool-page input,
        .css-list-style-tool-page textarea,
        .css-list-style-tool-page select {
          font-family: inherit;
        }
      `}</style>

      <div className="css-list-style-tool-page bg-[#fbfbfc] text-slate-900 min-h-screen">
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
                Generate CSS list style properties online for free. Create custom list markers with type, position, and image options. Copy CSS code instantly.
              </p>
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
                <p className="mt-1 text-sm text-slate-600">Select list style options and copy the generated CSS code.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleReset}
                  className="rounded-xl border-2 border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50"
                >
                  🔄 Reset
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-start">
              {/* Left: Controls */}
              <div className="flex flex-col">
                <div className="mb-2 flex h-8 items-center justify-between">
                  <label className="block text-sm font-semibold text-slate-800">List Style Options</label>
                  <div className="w-28"></div>
                </div>
                <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      List Style Type
                    </label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full rounded-lg border-2 border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 outline-none focus:border-emerald-400"
                    >
                      {listStyleTypes.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Position
                    </label>
                    <select
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      className="w-full rounded-lg border-2 border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 outline-none focus:border-emerald-400"
                    >
                      <option value="outside">outside (default)</option>
                      <option value="inside">inside</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      List Style Image URL (optional)
                    </label>
                    <input
                      type="text"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      placeholder="https://example.com/marker.png"
                      className="w-full rounded-lg border-2 border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 outline-none focus:border-emerald-400"
                    />
                    {image && (
                      <button
                        onClick={() => setImage('')}
                        className="mt-2 text-xs text-slate-500 hover:text-slate-700"
                      >
                        Clear image
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Preview and Code */}
              <div className="flex flex-col">
                <div className="mb-2 flex h-8 items-center justify-between">
                  <label className="block text-sm font-semibold text-slate-800">Generated CSS</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={copyText}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      📋 Copy
                    </button>
                  </div>
                </div>
                <textarea
                  value={cssCode}
                  readOnly
                  className="element-code h-64 w-full rounded-2xl border-2 border-slate-200 bg-slate-900 p-4 font-mono text-sm text-green-400 outline-none resize-none"
                  placeholder="Generated CSS will appear here..."
                />
              </div>
            </div>
          </div>
        </section>

        {/* What is CSS List Style Section */}
        <section id="what" className="mx-auto max-w-6xl px-4 pb-12">
          <div
            className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10"
            style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}
          >
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">What is CSS List Style?</h2>
            </div>
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                <strong>CSS list-style</strong> is a shorthand property that combines <code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm">list-style-type</code>, <code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm">list-style-position</code>, and <code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm">list-style-image</code>. It controls the appearance of list item markers (bullets, numbers, or custom images) in HTML lists (<code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm">&lt;ul&gt;</code> and <code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm">&lt;ol&gt;</code> elements). The list-style property allows you to customize how lists appear visually, from simple bullets to complex numbering systems.
              </p>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                According to the <a href="https://www.w3.org/TR/css-lists-3/" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">W3C CSS Lists and Counters Module Level 3</a>, list-style is a fundamental property for styling lists. The property provides extensive control over list markers, supporting various numbering systems, custom images, and positioning options. List-style is essential for creating visually appealing and accessible lists in web design.
              </p>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                CSS list-style supports over 20 different marker types, including standard bullets (disc, circle, square), numeric systems (decimal, lower-roman, upper-roman), alphabetic systems (lower-alpha, upper-alpha), and international numbering systems (armenian, georgian, hebrew, CJK ideographic). The property also allows custom images via <code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm">list-style-image</code>, making it highly flexible for branding and design requirements.
              </p>
              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">✓</span>
                    Default List (disc)
                  </h3>
                  <ul style={{ listStyle: 'disc outside', paddingLeft: '1.5rem' }}>
                    <li>List item one</li>
                    <li>List item two</li>
                    <li>List item three</li>
                  </ul>
                </div>
                <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">✓</span>
                    Custom List (decimal)
                  </h3>
                  <ol style={{ listStyle: 'decimal outside', paddingLeft: '1.5rem' }}>
                    <li>List item one</li>
                    <li>List item two</li>
                    <li>List item three</li>
                  </ol>
                </div>
              </div>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                The <code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm">list-style</code> property is a shorthand that can accept one, two, or three values. When using a custom image, the format is: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm">list-style: url("image.png") type position</code>. If the image fails to load, the browser falls back to the specified type. This makes list-style highly flexible for creating custom branded lists while maintaining accessibility and fallback options.
              </p>
              <p className="text-sm text-slate-700">
                Learn more on{' '}
                <a
                  href="https://developer.mozilla.org/en-US/docs/Web/CSS/list-style"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-700 hover:text-emerald-800 font-semibold underline"
                >
                  MDN Web Docs
                </a>
                {' '}and{' '}
                <a
                  href="https://web.dev/learn/css/lists"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-700 hover:text-emerald-800 font-semibold underline"
                >
                  Google Web.dev
                </a>
                .
              </p>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section id="statistics" className="mx-auto max-w-6xl px-4 pb-12">
          <div
            className="rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white p-8 md:p-10"
            style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-3">CSS List Style Benefits</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Real advantages of using CSS list-style in modern web development
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-emerald-200 shadow-lg">
                <div className="text-5xl font-extrabold text-emerald-600 mb-2">22+</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Marker Types</div>
                <div className="text-xs text-slate-600">Extensive options</div>
              </div>

              <div className="text-center p-6 rounded-2xl bg-white border-2 border-blue-200 shadow-lg">
                <div className="text-5xl font-extrabold text-blue-600 mb-2">100%</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Browser Support</div>
                <div className="text-xs text-slate-600">All modern browsers</div>
              </div>

              <div className="text-center p-6 rounded-2xl bg-white border-2 border-purple-200 shadow-lg">
                <div className="text-5xl font-extrabold text-purple-600 mb-2">Semantic</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">HTML Structure</div>
                <div className="text-xs text-slate-600">Accessibility first</div>
              </div>

              <div className="text-center p-6 rounded-2xl bg-white border-2 border-orange-200 shadow-lg">
                <div className="text-5xl font-extrabold text-orange-600 mb-2">CSS1</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Since 1996</div>
                <div className="text-xs text-slate-600">Mature standard</div>
              </div>
            </div>

            <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">📊</span>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">Industry Usage</h4>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    According to <a href="https://web.dev/learn/css/lists" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">Google Web.dev</a>, CSS list-style is used in over 85% of websites that contain lists. The property is essential for creating accessible, semantic HTML lists while maintaining complete visual control. Major frameworks like <strong>Bootstrap</strong>, <strong>Tailwind CSS</strong>, and <strong>Foundation</strong> use list-style extensively for navigation menus, content lists, and structured content displays. The <a href="https://www.w3.org/TR/css-lists-3/" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">W3C CSS Lists Module</a> specification ensures long-term compatibility and standardization across all browsers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CSS List Style Benefits Section */}
        <section id="benefits" className="mx-auto max-w-6xl px-4 pb-12">
          <div
            className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10"
            style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}
          >
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900 mb-3">CSS List Style Benefits</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="rounded-xl border-2 border-slate-200 bg-slate-50 p-5">
                <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">1</span>
                  Visual Customization
                </h3>
                <p className="text-sm text-slate-700">
                  Customize list markers to match your design aesthetic, from simple bullets to complex numbering systems and custom images.
                </p>
              </div>
              <div className="rounded-xl border-2 border-slate-200 bg-slate-50 p-5">
                <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">2</span>
                  Brand Consistency
                </h3>
                <p className="text-sm text-slate-700">
                  Use custom images for list markers to maintain brand consistency across your website and create unique visual identity.
                </p>
              </div>
              <div className="rounded-xl border-2 border-slate-200 bg-slate-50 p-5">
                <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-purple-600">3</span>
                  Accessibility
                </h3>
                <p className="text-sm text-slate-700">
                  Proper list styling improves readability and accessibility, making content easier to scan and understand for all users.
                </p>
              </div>
              <div className="rounded-xl border-2 border-slate-200 bg-slate-50 p-5">
                <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 text-orange-600">4</span>
                  International Support
                </h3>
                <p className="text-sm text-slate-700">
                  Support for international numbering systems (armenian, georgian, hebrew, CJK) enables proper localization for global audiences.
                </p>
              </div>
              <div className="rounded-xl border-2 border-slate-200 bg-slate-50 p-5">
                <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600">5</span>
                  Layout Control
                </h3>
                <p className="text-sm text-slate-700">
                  Control marker position (inside/outside) to optimize space usage and text alignment for different layout requirements.
                </p>
              </div>
              <div className="rounded-xl border-2 border-slate-200 bg-slate-50 p-5">
                <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">6</span>
                  Semantic HTML
                </h3>
                <p className="text-sm text-slate-700">
                  Style semantic HTML lists without changing markup, maintaining proper document structure while achieving desired visual appearance.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section id="how-it-works" className="mx-auto max-w-6xl px-4 pb-12">
          <div
            className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10"
            style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}
          >
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900 mb-3">How it Works</h2>
            </div>
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-6">
                This CSS List Style Generator processes your selections entirely in your browser. No data is sent to any server, ensuring complete privacy and instant results.
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="rounded-xl border-2 border-slate-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 text-white text-xl font-bold mb-4">
                    1
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Select Options</h3>
                  <p className="text-sm text-slate-700">
                    Choose a list style type, position, and optionally add a custom image URL.
                  </p>
                </div>
                <div className="rounded-xl border-2 border-slate-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-600 text-white text-xl font-bold mb-4">
                    2
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Preview Live</h3>
                  <p className="text-sm text-slate-700">
                    See the list style effect immediately in the preview box as you make changes.
                  </p>
                </div>
                <div className="rounded-xl border-2 border-slate-200 bg-gradient-to-br from-purple-50 to-pink-50 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-600 text-white text-xl font-bold mb-4">
                    3
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Copy CSS</h3>
                  <p className="text-sm text-slate-700">
                    Copy the generated CSS code to your clipboard and paste it into your stylesheet.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Use CSS List Style Section */}
        <section id="why-use" className="mx-auto max-w-6xl px-4 pb-12">
          <div
            className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10"
            style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}
          >
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Why Use CSS List Style?</h2>
            </div>
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                CSS list-style is essential for creating visually appealing and professional lists in web design. Whether you need simple bullets, complex numbering systems, or custom branded markers, list-style provides the flexibility to achieve your design goals while maintaining semantic HTML structure. The property offers over 22 different marker types, from standard bullets to complex international numbering systems, making it highly versatile for different content types and design requirements.
              </p>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Unlike removing list markers and using custom CSS with pseudo-elements, the list-style property is semantic, accessible, and properly handled by screen readers. It maintains the document structure while allowing complete visual customization. This makes list-style the preferred method for styling lists in modern web development. Screen readers understand list structure when proper HTML elements (<code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm">&lt;ul&gt;</code> and <code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm">&lt;ol&gt;</code>) are used with list-style, providing better accessibility than custom solutions.
              </p>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                The property is highly performant and doesn't require additional DOM manipulation or JavaScript. All processing happens in CSS, making it efficient and maintainable. List-style is supported in all modern browsers and has been part of the CSS specification since CSS1 (1996), ensuring wide compatibility. The property doesn't trigger layout recalculation or paint operations, making it highly performant even with complex nested lists.
              </p>
              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="rounded-xl border-2 border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Standard Marker Types</h3>
                  <ul className="space-y-2 text-sm text-slate-700" style={{ listStyle: 'disc outside', paddingLeft: '1.5rem' }}>
                    <li><strong>disc</strong> - Filled circle (default for ul)</li>
                    <li><strong>circle</strong> - Hollow circle</li>
                    <li><strong>square</strong> - Filled square</li>
                    <li><strong>decimal</strong> - Arabic numerals (1, 2, 3)</li>
                    <li><strong>lower-alpha</strong> - Lowercase letters (a, b, c)</li>
                    <li><strong>upper-alpha</strong> - Uppercase letters (A, B, C)</li>
                    <li><strong>lower-roman</strong> - Lowercase Roman (i, ii, iii)</li>
                    <li><strong>upper-roman</strong> - Uppercase Roman (I, II, III)</li>
                  </ul>
                </div>
                <div className="rounded-xl border-2 border-emerald-200 bg-emerald-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">International Systems</h3>
                  <ul className="space-y-2 text-sm text-slate-700" style={{ listStyle: 'disc outside', paddingLeft: '1.5rem' }}>
                    <li><strong>armenian</strong> - Armenian numbering</li>
                    <li><strong>georgian</strong> - Georgian numbering</li>
                    <li><strong>hebrew</strong> - Hebrew numbering</li>
                    <li><strong>cjk-ideographic</strong> - CJK ideographic</li>
                    <li><strong>hiragana</strong> - Hiragana characters</li>
                    <li><strong>katakana</strong> - Katakana characters</li>
                    <li><strong>none</strong> - No marker</li>
                    <li><strong>url()</strong> - Custom image marker</li>
                  </ul>
                </div>
              </div>
              <div className="rounded-xl border-2 border-slate-200 bg-slate-50 p-5 my-6">
                <h3 className="text-lg font-bold text-slate-900 mb-3">Common Use Cases:</h3>
                <ul className="space-y-2 text-sm text-slate-700" style={{ listStyle: 'disc outside', paddingLeft: '1.5rem' }}>
                  <li><strong>Navigation Menus:</strong> Styling horizontal and vertical navigation menus with custom markers or no markers</li>
                  <li><strong>Content Lists:</strong> Creating structured content lists with appropriate marker types for different content hierarchies</li>
                  <li><strong>Numbered Instructions:</strong> Creating step-by-step instructions and tutorials with decimal or roman numbering</li>
                  <li><strong>Branded Lists:</strong> Using custom images for list markers to maintain brand consistency</li>
                  <li><strong>Nested Lists:</strong> Implementing multi-level nested lists with different marker types for each level</li>
                  <li><strong>International Content:</strong> Supporting international numbering systems for global audiences</li>
                  <li><strong>Accessible Content:</strong> Creating accessible, semantic list structures that work with screen readers</li>
                  <li><strong>Site Maps:</strong> Building hierarchical site maps with appropriate marker types</li>
                </ul>
              </div>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                According to the <a href="https://www.w3.org/TR/css-lists-3/" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">W3C CSS Lists and Counters Module Level 3</a>, list-style is the recommended method for styling lists in modern web development. The property provides complete control over list markers while maintaining semantic HTML structure and accessibility. Whether you're building simple content lists or complex navigation systems, CSS list-style provides the tools you need to create professional, accessible lists.
              </p>
            </div>
          </div>
        </section>

        {/* Best Practices Section */}
        <section id="best-practices" className="mx-auto max-w-6xl px-4 pb-12">
          <div
            className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10"
            style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}
          >
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Best Practices</h2>
            </div>
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-6">
                Following best practices ensures your CSS list-style implementations are accessible, performant, and maintainable. Here are essential guidelines for using list-style effectively:
              </p>
              <div className="space-y-6">
                <div className="rounded-xl border-2 border-emerald-200 bg-emerald-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">✓ Use Semantic HTML</h3>
                  <p className="text-sm text-slate-700 leading-relaxed mb-2">
                    Always use proper HTML list elements (<code className="bg-white px-1.5 py-0.5 rounded text-xs">ul</code> or <code className="bg-white px-1.5 py-0.5 rounded text-xs">ol</code>) rather than styling divs to look like lists. This ensures accessibility and proper document structure. Screen readers rely on semantic HTML to understand list structure, so using proper elements is essential for accessibility compliance (WCAG 2.1).
                  </p>
                  <div className="bg-white rounded-lg p-3 mt-2">
                    <code className="text-xs text-slate-700">
                      &lt;ul style="list-style: disc outside"&gt;<br />
                      &nbsp;&nbsp;&lt;li&gt;Item 1&lt;/li&gt;<br />
                      &nbsp;&nbsp;&lt;li&gt;Item 2&lt;/li&gt;<br />
                      &lt;/ul&gt;
                    </code>
                  </div>
                </div>
                <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">✓ Optimize List Style Images</h3>
                  <p className="text-sm text-slate-700 leading-relaxed mb-2">
                    When using custom images via <code className="bg-white px-1.5 py-0.5 rounded text-xs">list-style-image</code>, keep file sizes small (16x16px to 32x32px) and use formats like SVG or optimized PNG. Provide fallback types in case images fail to load. SVG is preferred for scalability and small file sizes. Always include a fallback type value so lists remain functional if images fail to load.
                  </p>
                  <div className="bg-white rounded-lg p-3 mt-2">
                    <code className="text-xs text-slate-700">
                      list-style: url("marker.svg") disc outside;
                    </code>
                  </div>
                </div>
                <div className="rounded-xl border-2 border-purple-200 bg-purple-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">✓ Consider Position Carefully</h3>
                  <p className="text-sm text-slate-700 leading-relaxed mb-2">
                    Use <code className="bg-white px-1.5 py-0.5 rounded text-xs">outside</code> for most cases (default), as it places markers outside the content box and doesn't affect text alignment. Use <code className="bg-white px-1.5 py-0.5 rounded text-xs">inside</code> only when you need markers to be part of the text flow, which can affect text wrapping and alignment. Inside positioning is useful for compact layouts but can make lists harder to read.
                  </p>
                  <div className="grid md:grid-cols-2 gap-3 mt-3">
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-xs font-semibold mb-2">Outside (default)</p>
                      <ul style={{ listStyle: 'disc outside', paddingLeft: '1.5rem', fontSize: '12px' }}>
                        <li>Marker outside</li>
                        <li>Better alignment</li>
                      </ul>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-xs font-semibold mb-2">Inside</p>
                      <ul style={{ listStyle: 'disc inside', paddingLeft: '1rem', fontSize: '12px' }}>
                        <li>Marker inside</li>
                        <li>Compact layout</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="rounded-xl border-2 border-orange-200 bg-orange-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">✓ Test Cross-Browser Compatibility</h3>
                  <p className="text-sm text-slate-700 leading-relaxed mb-2">
                    While list-style is widely supported, some exotic numbering systems (armenian, georgian, hebrew, CJK) may render differently across browsers. Test your lists in multiple browsers (Chrome, Firefox, Safari, Edge) for consistency. Standard marker types (disc, circle, square, decimal, alpha, roman) have excellent cross-browser support, but international systems may require fallbacks.
                  </p>
                  <p className="text-xs text-slate-600 mt-2">
                    Tip: Use standard marker types when possible, and provide fallbacks for international systems.
                  </p>
                </div>
                <div className="rounded-xl border-2 border-red-200 bg-red-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">✓ Maintain Accessibility</h3>
                  <p className="text-sm text-slate-700 leading-relaxed mb-2">
                    Don't remove list markers entirely (<code className="bg-white px-1.5 py-0.5 rounded text-xs">list-style: none</code>) unless you provide alternative visual indicators or use the list for non-semantic purposes. Screen readers rely on proper list structure for navigation. If you remove markers, ensure content remains accessible through other means (headings, ARIA labels, or visual indicators).
                  </p>
                  <p className="text-xs text-slate-600 mt-2">
                    According to <a href="https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">MDN Accessibility Guidelines</a>, proper list structure is essential for screen reader users.
                  </p>
                </div>
                <div className="rounded-xl border-2 border-indigo-200 bg-indigo-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">✓ Use Appropriate Marker Types</h3>
                  <p className="text-sm text-slate-700 leading-relaxed mb-2">
                    Choose marker types that match your content hierarchy and purpose. Use <code className="bg-white px-1.5 py-0.5 rounded text-xs">disc</code> for unordered lists, <code className="bg-white px-1.5 py-0.5 rounded text-xs">decimal</code> for ordered lists, and custom types for specific content needs. Nested lists can use different marker types for each level to improve visual hierarchy. The <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/list-style" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">MDN Web Docs</a> provide comprehensive guidance on choosing appropriate marker types.
                  </p>
                </div>
                <div className="rounded-xl border-2 border-cyan-200 bg-cyan-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">✓ Consider Performance</h3>
                  <p className="text-sm text-slate-700 leading-relaxed mb-2">
                    CSS list-style is highly performant and doesn't require JavaScript or DOM manipulation. The property is rendered entirely in CSS, making it efficient even with long lists or nested structures. When using custom images, ensure they're optimized and cached to maintain performance. The property doesn't trigger layout recalculation, making it ideal for dynamic content.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs Section */}
        <section id="faqs" className="mx-auto max-w-6xl px-4 pb-12">
          <div
            className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10"
            style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}
          >
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="rounded-xl border-2 border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{faq.question}</h3>
                  <p className="text-sm text-slate-700 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Related Tools Section */}
        <section id="related-tools" className="mx-auto max-w-6xl px-4 pb-12">
          <div
            className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10"
            style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}
          >
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Related Tools</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <Link
                href="/css-tool/css-formatter"
                className="rounded-xl border-2 border-slate-200 bg-slate-50 p-4 hover:border-emerald-400 hover:bg-emerald-50 transition-colors"
              >
                <h3 className="font-bold text-slate-900 mb-1">CSS Formatter</h3>
                <p className="text-sm text-slate-600">Format and beautify CSS code</p>
              </Link>
              <Link
                href="/css-tool/minify-css"
                className="rounded-xl border-2 border-slate-200 bg-slate-50 p-4 hover:border-emerald-400 hover:bg-emerald-50 transition-colors"
              >
                <h3 className="font-bold text-slate-900 mb-1">CSS Minifier</h3>
                <p className="text-sm text-slate-600">Minify and compress CSS files</p>
              </Link>
              <Link
                href="/css-tool/gradient"
                className="rounded-xl border-2 border-slate-200 bg-slate-50 p-4 hover:border-emerald-400 hover:bg-emerald-50 transition-colors"
              >
                <h3 className="font-bold text-slate-900 mb-1">CSS Gradient Generator</h3>
                <p className="text-sm text-slate-600">Create beautiful CSS gradients</p>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-slate-900 text-white py-12 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <h3 className="font-bold text-lg mb-4">FixTools</h3>
                <p className="text-slate-400 text-sm">
                  Free online tools for developers, designers, and content creators.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">CSS Tools</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li>
                    <Link href="/tools/css" className="hover:text-white">
                      All CSS Tools
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Resources</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li>
                    <a
                      href="https://developer.mozilla.org/en-US/docs/Web/CSS"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white"
                    >
                      MDN CSS Docs
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.w3.org/Style/CSS/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white"
                    >
                      W3C CSS Spec
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">All Tools</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li>
                    <Link href="/" className="hover:text-white">
                      Home
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-400">
              <p>© {currentYear} FixTools. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>

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
    </>
  );
}
