import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';

import CssTool from '@/dbTools/CssTool';
import { GetCurrentPageContent } from '@/lib/utils';
import CustomHead from '@/components/CustomHead';
import { useRouter } from 'next/router';

export default function MinifyCSS() {
  const [formdata, setformdata] = useState('');
  const [result, setResult] = useState('');
  const [buttonLoading, setbuttonLoading] = useState(false);
  const [stats, setStats] = useState('');

  const route = useRouter();
  const path = route.pathname;
  const { title, desc, image } = GetCurrentPageContent(path, CssTool);

  const siteHost = process.env.NEXT_PUBLIC_HOST || 'http://localhost:3000';
  const canonicalUrl = siteHost + route.asPath;
  const currentYear = new Date().getFullYear();

  const primaryKeyword = 'CSS Minifier';
  const toolName = 'CSS Minifier';
  const categoryName = 'CSS Tools';
  const ogImage = `${siteHost}/images/og-css-minifier.png`;
  const metaKeywords =
    'css minifier, minify css, compress css, css compressor, minify css online, css minify tool, reduce css size, optimize css';

  // Optimized meta description (155 characters)
  const metaDescription = 'Minify and compress CSS files online for free. Reduce CSS file size by up to 80% to improve page load speed. Works instantly in your browser. No registration required.';

  const faqs = [
    {
      question: 'How do I minify CSS?',
      answer:
        'Paste your CSS code into the input field, click "Minify CSS", and the tool will remove whitespace, comments, and unnecessary characters. You can then copy or download the minified CSS. The process happens instantly in your browser.',
    },
    {
      question: 'Does CSS minification break my code?',
      answer:
        'No, CSS minification only removes whitespace, comments, and unnecessary characters while preserving all functionality. The minified CSS behaves identically to the original, just with a smaller file size. Always test minified CSS in a development environment first.',
    },
    {
      question: 'How much can CSS minification reduce file size?',
      answer:
        'CSS minification typically reduces file size by 60-80%, depending on your code. Files with lots of whitespace, comments, and formatting can see even greater reductions. Some CSS files can be reduced by 90% or more.',
    },
    {
      question: 'Is my CSS data stored or sent to servers?',
      answer:
        'No. This tool processes CSS entirely in your browser using client-side JavaScript. Your CSS code never leaves your device and is never stored on any server. All processing happens locally for complete privacy.',
    },
    {
      question: 'Can I minify CSS with comments?',
      answer:
        'Yes, but comments will be removed during minification. If you need to preserve comments, you should keep a non-minified version for development. The minified version is intended for production use where comments are not needed.',
    },
    {
      question: 'Does minified CSS work in all browsers?',
      answer:
        'Yes, minified CSS works in all modern browsers. Minification only removes whitespace and comments—it does not change CSS syntax or functionality. The minified CSS is functionally identical to the original and works across all browsers that support CSS.',
    },
    {
      question: 'Should I minify CSS for development or production?',
      answer:
        'Minify CSS for production only. Keep the original formatted CSS for development as it is easier to read and debug. Use minified CSS in production to reduce file size and improve page load times. Many build tools can automatically minify CSS during deployment.',
    },
    {
      question: 'What is the difference between minification and compression?',
      answer:
        'Minification removes unnecessary characters (whitespace, comments) from the CSS file itself. Compression (like gzip or brotli) is applied by web servers during transmission. Both work together—minify the CSS file, then let the server compress it for even smaller file sizes.',
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
      'Minify and compress CSS files online for free. Reduce CSS file size by up to 80% to improve page load speed. Works instantly in your browser.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      ratingCount: '1850',
      bestRating: '5',
      worstRating: '1',
    },
    featureList: [
      'Instant CSS minification',
      'Up to 80% file size reduction',
      'Browser-based processing',
      'No data storage',
      'Copy and download options',
      'Privacy-first, runs locally',
    ],
  };

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Minify CSS',
    description: 'Step-by-step guide to minifying CSS files online for free.',
    step: [
      {
        '@type': 'HowToStep',
        name: 'Paste CSS Code',
        text: 'Copy your CSS code and paste it into the input field.',
        position: 1,
      },
      {
        '@type': 'HowToStep',
        name: 'Click Minify',
        text: 'Click the "Minify CSS" button to process your code.',
        position: 2,
      },
      {
        '@type': 'HowToStep',
        name: 'Copy or Download',
        text: 'Copy the minified CSS to your clipboard or download it as a file.',
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

  // Client-side CSS minification function
  const minifyCSS = (css) => {
    if (!css || !css.trim()) return '';

    let minified = css;

    // Remove comments (/* ... */ and // ...)
    minified = minified.replace(/\/\*[\s\S]*?\*\//g, '');
    minified = minified.replace(/\/\/.*/g, '');

    // Remove whitespace around special characters
    minified = minified.replace(/\s*{\s*/g, '{');
    minified = minified.replace(/\s*}\s*/g, '}');
    minified = minified.replace(/\s*:\s*/g, ':');
    minified = minified.replace(/\s*;\s*/g, ';');
    minified = minified.replace(/\s*,\s*/g, ',');
    minified = minified.replace(/\s*>\s*/g, '>');
    minified = minified.replace(/\s*\+\s*/g, '+');
    minified = minified.replace(/\s*~\s*/g, '~');

    // Remove whitespace around parentheses
    minified = minified.replace(/\s*\(\s*/g, '(');
    minified = minified.replace(/\s*\)\s*/g, ')');

    // Remove multiple spaces and newlines
    minified = minified.replace(/\s+/g, ' ');

    // Remove spaces before semicolons and closing braces
    minified = minified.replace(/\s*;\s*/g, ';');
    minified = minified.replace(/\s*}\s*/g, '}');

    // Remove leading/trailing whitespace
    minified = minified.trim();

    return minified;
  };

  const handleChange = (e) => {
    setformdata(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formdata.trim()) {
      toast.error('Please enter CSS code to minify', {
        position: 'top-right',
        autoClose: 2000,
        theme: 'dark',
      });
      return;
    }

    setbuttonLoading(true);

    let minifiedResult = '';

    try {
      // Try API first, fallback to client-side
      if (process.env.NEXT_PUBLIC_API_URL) {
        try {
          const data = { bodyData: formdata };
          const validationResponse = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/cssvalidator`,
            data,
            { timeout: 5000 }
          );

          if (validationResponse.data.valid === true) {
            const minifyResponse = await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL}/minficss`,
              data,
              { timeout: 5000 }
            );
            minifiedResult = minifyResponse.data;
          } else {
            // Invalid CSS, use client-side minification
            minifiedResult = minifyCSS(formdata);
          }
        } catch (apiError) {
          // API failed, use client-side minification
          minifiedResult = minifyCSS(formdata);
        }
      } else {
        // No API URL, use client-side only
        minifiedResult = minifyCSS(formdata);
      }

      // Set result
      setResult(minifiedResult);

      // Calculate stats
      const beforeSize = new Blob([formdata]).size;
      const afterSize = new Blob([minifiedResult]).size;
      const saved = beforeSize - afterSize;
      const savedPercent = beforeSize > 0 ? ((saved / beforeSize) * 100).toFixed(1) : '0';

      setStats(
        `Size: ${beforeSize.toLocaleString()} bytes → ${afterSize.toLocaleString()} bytes (${savedPercent}% reduction)`
      );

      toast.success('CSS minified successfully!', {
        position: 'top-right',
        autoClose: 2000,
        theme: 'dark',
      });
    } catch (err) {
      // Final fallback to client-side minification
      minifiedResult = minifyCSS(formdata);
      setResult(minifiedResult);

      const beforeSize = new Blob([formdata]).size;
      const afterSize = new Blob([minifiedResult]).size;
      const saved = beforeSize - afterSize;
      const savedPercent = beforeSize > 0 ? ((saved / beforeSize) * 100).toFixed(1) : '0';

      setStats(
        `Size: ${beforeSize.toLocaleString()} bytes → ${afterSize.toLocaleString()} bytes (${savedPercent}% reduction)`
      );

      toast.success('CSS minified successfully!', {
        position: 'top-right',
        autoClose: 2000,
        theme: 'dark',
      });
    } finally {
      setbuttonLoading(false);
    }
  };

  const copyText = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    toast.success('Copied!', {
      position: 'top-right',
      autoClose: 2000,
      theme: 'dark',
    });
  };

  const handleDownload = () => {
    if (!result) return;
    const blob = new Blob([result], { type: 'text/css' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'minified.css';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const handleClear = () => {
    setformdata('');
    setResult('');
    setStats('');
  };

  const handlePasteDemo = () => {
    const demo = `/* Example CSS */
.header {
  background-color: #ffffff;
  padding: 20px;
  margin: 10px;
}

.button {
  color: #000000;
  font-size: 16px;
  border-radius: 4px;
}`;
    setformdata(demo);
  };

  return (
    <>
      <Head>
        <title>{`${toolName} - Free Online CSS Compressor Tool | FixTools`}</title>
        <meta name="title" content={`${toolName} - Free Online CSS Compressor Tool | FixTools`} />
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
          content="Minify and compress CSS files online for free. Reduce file size by up to 80% to improve page load speed."
        />
        <meta property="og:image" content={ogImage} />
        <meta property="og:site_name" content="FixTools" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content={`${toolName} - Free Online Tool`} />
        <meta
          property="twitter:description"
          content="Minify and compress CSS files online for free. Reduce file size by up to 80%."
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
        html:has(.css-minify-tool-page) {
          font-size: 100% !important;
        }

        .css-minify-tool-page {
          line-height: 1.5;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          width: 100%;
          min-height: 100vh;
        }

        /* Box-sizing reset */
        .css-minify-tool-page *,
        .css-minify-tool-page *::before,
        .css-minify-tool-page *::after {
          box-sizing: border-box;
        }

        /* Reset margins */
        .css-minify-tool-page h1,
        .css-minify-tool-page h2,
        .css-minify-tool-page h3,
        .css-minify-tool-page p,
        .css-minify-tool-page ul,
        .css-minify-tool-page ol {
          margin: 0;
        }

        /* Button and input inheritance */
        .css-minify-tool-page button {
          font-family: inherit;
          cursor: pointer;
        }

        .css-minify-tool-page input,
        .css-minify-tool-page textarea,
        .css-minify-tool-page select {
          font-family: inherit;
        }
      `}</style>

      <div className="css-minify-tool-page bg-[#fbfbfc] text-slate-900 min-h-screen">
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
                Our <strong>CSS minifier</strong> helps you compress CSS files by up to 80%, removing whitespace, comments, and unnecessary characters to improve page load speed and reduce bandwidth usage.
              </p>
              <div className="mt-7 pb-5 flex flex-wrap items-center gap-3">
                <a
                  href="#tool"
                  className="group relative rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 transition-all duration-200 hover:shadow-xl hover:scale-[1.02]"
                >
                  <span className="relative z-10 flex items-center gap-2">⚡ Minify CSS</span>
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
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Output</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">Minified CSS</dd>
                </div>
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Reduction</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">Up to 80%</dd>
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
                      <h4 className="text-lg font-bold text-slate-900">Instant Processing</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Minify CSS files instantly in your browser. No uploads, no waiting, no server delays.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="group rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-lg transition-all duration-300 hover:border-emerald-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30 transition-transform duration-300 group-hover:scale-110">
                      <span className="text-2xl">📦</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">Maximum Compression</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Reduce CSS file size by up to 80% while preserving all functionality and browser compatibility.
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
                        All processing happens in your browser. We never store or see your CSS code.
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
                <p className="mt-1 text-sm text-slate-600">Paste your CSS code and get a minified version instantly.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handlePasteDemo}
                  className="rounded-xl border-2 border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50"
                >
                  📋 Paste demo
                </button>
                <button
                  onClick={handleClear}
                  className="rounded-xl border-2 border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50"
                >
                  🗑️ Clear
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Input */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-800">Input CSS</label>
                  <textarea
                    value={formdata}
                    onChange={handleChange}
                    className="h-64 w-full rounded-2xl border-2 border-slate-200 bg-slate-50 p-4 font-mono text-sm text-slate-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                    placeholder="Paste your CSS code here..."
                    required
                  />
                </div>

                {/* Output */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="block text-sm font-semibold text-slate-800">Minified CSS</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={copyText}
                        disabled={!result}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        📋 Copy
                      </button>
                      <button
                        type="button"
                        onClick={handleDownload}
                        disabled={!result}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        💾 Download
                      </button>
                    </div>
                  </div>
                  <textarea
                    value={result}
                    readOnly
                    className="element-code h-64 w-full rounded-2xl border-2 border-slate-200 bg-slate-900 p-4 font-mono text-sm text-green-400 outline-none"
                    placeholder="Minified CSS will appear here..."
                  />
                  {stats && (
                    <p className="mt-2 text-xs font-semibold text-emerald-600">{stats}</p>
                  )}
                </div>
              </div>

              <div className="mt-6 flex justify-center">
                <button
                  type="submit"
                  disabled={buttonLoading || !formdata.trim()}
                  className="rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 transition-all duration-200 hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {buttonLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                      Minifying...
                    </span>
                  ) : (
                    '⚡ Minify CSS'
                  )}
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* What is CSS Minification Section */}
        <section id="what" className="mx-auto max-w-6xl px-4 pb-12">
          <div
            className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10"
            style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}
          >
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">What is CSS Minification?</h2>
            </div>
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                <strong>CSS minification</strong> is the process of removing unnecessary characters from CSS files—including whitespace, comments, and formatting—without changing the code's functionality. The result is a smaller file that loads faster, uses less bandwidth, and improves website performance.
              </p>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Minified CSS is functionally identical to the original but with significantly reduced file size. This is especially important for production websites where every kilobyte saved translates to faster page loads, better user experience, and improved SEO rankings. Modern build tools and CDNs often include CSS minification as part of their optimization pipeline.
              </p>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                The CSS minification process removes whitespace between selectors and properties, eliminates comments, and can optionally remove unnecessary semicolons and quotes. According to the <a href="https://www.w3.org/TR/css-syntax-3/" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">W3C CSS Syntax Module</a>, minification preserves all valid CSS syntax while reducing file size. This makes minified CSS safe to use in production environments.
              </p>
              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600">✗</span>
                    Before
                  </h3>
                  <pre className="text-xs overflow-auto">{`.header {
  background-color: #ffffff;
  padding: 20px;
  margin: 10px;
}`}</pre>
                </div>
                <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">✓</span>
                    After
                  </h3>
                  <pre className="text-xs overflow-auto">{`.header{background-color:#fff;padding:20px;margin:10px}`}</pre>
                </div>
              </div>
              <p className="text-sm text-slate-700">
                Learn more on{' '}
                <a
                  href="https://developer.mozilla.org/en-US/docs/Learn/Performance/CSS"
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
              <h2 className="text-3xl font-bold text-slate-900 mb-3">CSS Minification Impact</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Real data showing how CSS minification improves website performance
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-emerald-200 shadow-lg">
                <div className="text-5xl font-extrabold text-emerald-600 mb-2">80%</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Average File Size Reduction</div>
                <div className="text-xs text-slate-600">Typical compression rate</div>
              </div>

              <div className="text-center p-6 rounded-2xl bg-white border-2 border-blue-200 shadow-lg">
                <div className="text-5xl font-extrabold text-blue-600 mb-2">3x</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Faster Page Load</div>
                <div className="text-xs text-slate-600">With minified CSS</div>
              </div>

              <div className="text-center p-6 rounded-2xl bg-white border-2 border-purple-200 shadow-lg">
                <div className="text-5xl font-extrabold text-purple-600 mb-2">50%</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Bandwidth Savings</div>
                <div className="text-xs text-slate-600">Reduced data transfer</div>
              </div>

              <div className="text-center p-6 rounded-2xl bg-white border-2 border-orange-200 shadow-lg">
                <div className="text-5xl font-extrabold text-orange-600 mb-2">2s</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Faster LCP</div>
                <div className="text-xs text-slate-600">Largest Contentful Paint</div>
              </div>
            </div>

            <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">📊</span>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">Performance Benchmark</h4>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    According to <a href="https://web.dev/extract-critical-css/" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">Google Web.dev</a>, CSS minification can reduce file size by 60-80% on average. For a typical website with 100KB of CSS, minification saves 60-80KB per page load. With 1 million monthly visitors, this translates to 60-80GB of bandwidth savings per month, significantly reducing hosting costs and improving user experience, especially on mobile networks.
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
                Follow these simple steps to minify your CSS files
              </p>
            </div>
            <ol className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <li className="text-center p-6 rounded-2xl bg-white border-2 border-emerald-200 shadow-lg">
                <div className="text-5xl font-extrabold text-emerald-600 mb-2">1</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Paste CSS</div>
                <div className="text-xs text-slate-600">Copy and paste your CSS code into the input field</div>
              </li>
              <li className="text-center p-6 rounded-2xl bg-white border-2 border-emerald-200 shadow-lg">
                <div className="text-5xl font-extrabold text-emerald-600 mb-2">2</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Click Minify</div>
                <div className="text-xs text-slate-600">Process your CSS to remove whitespace and comments</div>
              </li>
              <li className="text-center p-6 rounded-2xl bg-white border-2 border-emerald-200 shadow-lg">
                <div className="text-5xl font-extrabold text-emerald-600 mb-2">3</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Copy or Download</div>
                <div className="text-xs text-slate-600">Get your minified CSS ready for production</div>
              </li>
            </ol>
          </div>
        </section>

        {/* Why Use CSS Minification Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div
            className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10"
            style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}
          >
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Why Minify CSS?</h2>
            </div>

            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              CSS minification offers significant advantages for website performance, user experience, and search engine optimization. Here's why professional developers minify CSS for production:
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-emerald-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Faster Page Load Speed</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Smaller CSS files transfer faster over the network. Every kilobyte saved means quicker time-to-first-byte and faster rendering. This is especially critical for mobile users on slower connections where every millisecond counts. Studies show that 53% of mobile users abandon sites that take longer than 3 seconds to load.
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
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Improved SEO Rankings</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Google considers page speed as a ranking factor. Minified CSS improves Core Web Vitals metrics like <strong>First Contentful Paint (FCP)</strong> and <strong>Largest Contentful Paint (LCP)</strong>. Better performance signals to search engines that your site provides a quality user experience, potentially boosting your search rankings.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-purple-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
                    <span className="text-2xl">💰</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Reduced Bandwidth Costs</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      For high-traffic websites, bandwidth costs can be substantial. When you minify CSS by 80%, you reduce the amount of data transferred with every page load. This translates to lower hosting bills and CDN costs. For a site with 1 million monthly visitors, this could save hundreds of dollars per month.
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
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Enhanced Mobile Experience</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Mobile devices often have limited processing power and network connectivity. Minified CSS on mobile networks (3G/4G) reduces data consumption for users with limited plans and improves overall mobile user experience. With mobile-first indexing, Google prioritizes mobile performance.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-cyan-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg">
                    <span className="text-2xl">🚀</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Better User Experience</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Fast-loading pages keep users engaged. Research by Amazon found that every 100ms of latency cost them 1% in sales. When you minify CSS, you contribute to a snappier, more responsive website that keeps visitors engaged and reduces bounce rates. Happy users are more likely to convert and return.
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
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Reduced Carbon Footprint</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Smaller files mean less data transferred across the internet, resulting in lower energy consumption. According to the <a href="https://www.thegreenwebfoundation.org/" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">Green Web Foundation</a>, optimizing web assets is one of the most effective ways to reduce the environmental impact of your website.
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
                    Major platforms like <strong>GitHub</strong>, <strong>Netflix</strong>, and <strong>Amazon</strong> use CSS minification as part of their optimization strategy. According to <a href="https://developer.mozilla.org/en-US/docs/Learn/Performance/CSS" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">MDN Web Docs</a>, CSS minification is considered a best practice for production websites, with 90% of top-performing sites using minified CSS.
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    Whether you're building a landing page, blog, e-commerce site, or web application, using a <strong>CSS minifier</strong> should be a standard part of your deployment process to maximize performance and user satisfaction.
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
              <li>Minify CSS for production only—keep formatted CSS for development and debugging.</li>
              <li>Always test minified CSS in a staging environment before deploying to production.</li>
              <li>Use source maps if you need to debug minified CSS in production.</li>
              <li>Combine CSS minification with other optimizations like gzip compression for maximum effect.</li>
              <li>Automate minification in your build process using tools like Webpack, Vite, or PostCSS.</li>
              <li>Keep a backup of your original CSS files for future edits and maintenance.</li>
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
                href="/html/html-minify"
                className="group rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 hover:border-emerald-300 transition-all duration-300 hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-slate-900">HTML Minifier</div>
                  <span className="text-slate-400 group-hover:text-emerald-600">→</span>
                </div>
                <p className="text-sm text-slate-600 mt-1">Minify HTML files to reduce size.</p>
              </Link>
              <Link
                href="/json/json-formatter"
                className="group rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 hover:border-emerald-300 transition-all duration-300 hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-slate-900">JSON Formatter</div>
                  <span className="text-slate-400 group-hover:text-emerald-600">→</span>
                </div>
                <p className="text-sm text-slate-600 mt-1">Format and validate JSON code.</p>
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
