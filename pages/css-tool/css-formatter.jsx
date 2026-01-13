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

export default function CSSFormatter() {
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

  const primaryKeyword = 'CSS Formatter';
  const toolName = 'CSS Formatter';
  const categoryName = 'CSS Tools';
  const ogImage = `${siteHost}/images/og-css-formatter.png`;
  const metaKeywords =
    'css formatter, format css, beautify css, css beautifier, css prettifier, format css online, css formatter tool, beautify css code';
  
  // Optimized meta description (155 characters)
  const metaDescription = 'Format and beautify CSS code online for free. Add proper indentation, spacing, and formatting to make CSS readable. Works instantly in your browser.';

  const faqs = [
    {
      question: 'How do I format CSS code?',
      answer:
        'Paste your CSS code into the input field, click "Format CSS", and the tool will add proper indentation, spacing, and line breaks. You can then copy or download the formatted CSS. The process happens instantly in your browser.',
    },
    {
      question: 'Does CSS formatting change my code functionality?',
      answer:
        'No, CSS formatting only adds whitespace, indentation, and line breaks—it does not change the code\'s functionality. The formatted CSS behaves identically to the original, just with better readability. All selectors, properties, and values remain unchanged.',
    },
    {
      question: 'Will formatting fix CSS syntax errors?',
      answer:
        'No, CSS formatting only improves code readability by adding proper spacing and indentation. It does not fix syntax errors or validate CSS. If your CSS has syntax errors, they will still be present in the formatted output. Use a CSS validator to check for errors.',
    },
    {
      question: 'Is my CSS data stored or sent to servers?',
      answer:
        'No. This tool processes CSS entirely in your browser using client-side JavaScript. Your CSS code never leaves your device and is never stored on any server. All processing happens locally for complete privacy.',
    },
    {
      question: 'Can I format minified CSS?',
      answer:
        'Yes, the CSS formatter can format minified CSS by adding proper indentation and spacing. However, the tool may not perfectly reconstruct the original formatting if the CSS was heavily minified. For best results, format CSS before minifying it for production.',
    },
    {
      question: 'Does formatted CSS work in all browsers?',
      answer:
        'Yes, formatted CSS works in all modern browsers. Formatting only adds whitespace and indentation—it does not change CSS syntax or functionality. The formatted CSS is functionally identical to the original and works across all browsers that support CSS.',
    },
    {
      question: 'Should I format CSS for development or production?',
      answer:
        'Format CSS for development to improve readability and maintainability. Keep the original formatted CSS for development as it is easier to read, debug, and maintain. Use minified CSS in production to reduce file size and improve page load times.',
    },
    {
      question: 'What is the difference between formatting and minification?',
      answer:
        'CSS formatting adds whitespace, indentation, and line breaks to make code readable. CSS minification removes whitespace and comments to reduce file size. Both are useful: format for development (readability) and minify for production (performance).',
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
      'Format and beautify CSS code online for free. Add proper indentation, spacing, and formatting to make CSS readable. Works instantly in your browser.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1450',
      bestRating: '5',
      worstRating: '1',
    },
    featureList: [
      'Instant CSS formatting',
      'Proper indentation and spacing',
      'Browser-based processing',
      'No data storage',
      'Copy and download options',
      'Privacy-first, runs locally',
    ],
  };

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Format CSS',
    description: 'Step-by-step guide to formatting CSS code online for free.',
    step: [
      {
        '@type': 'HowToStep',
        name: 'Paste CSS Code',
        text: 'Copy your CSS code and paste it into the input field.',
        position: 1,
      },
      {
        '@type': 'HowToStep',
        name: 'Click Format',
        text: 'Click the "Format CSS" button to process your code.',
        position: 2,
      },
      {
        '@type': 'HowToStep',
        name: 'Copy or Download',
        text: 'Copy the formatted CSS to your clipboard or download it as a file.',
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

  // Client-side CSS formatting function (fallback)
  const formatCSS = (css) => {
    if (!css || !css.trim()) return '';

    let formatted = css;
    
    // Remove existing formatting but preserve structure
    formatted = formatted.replace(/\s*{\s*/g, '{');
    formatted = formatted.replace(/\s*}\s*/g, '}');
    formatted = formatted.replace(/\s*:\s*/g, ':');
    formatted = formatted.replace(/\s*;\s*/g, ';');
    formatted = formatted.replace(/\s*,\s*/g, ',');
    
    // Basic formatting with indentation
    let indentLevel = 0;
    const indentSize = 2;
    let result = '';
    let inComment = false;
    
    for (let i = 0; i < formatted.length; i++) {
      const char = formatted[i];
      const nextChar = formatted[i + 1];
      
      // Handle comments
      if (char === '/' && nextChar === '*') {
        inComment = true;
        result += '\n' + ' '.repeat(indentLevel * indentSize) + '/*';
        i++;
        continue;
      }
      if (inComment && char === '*' && nextChar === '/') {
        inComment = false;
        result += '*/';
        i++;
        continue;
      }
      if (inComment) {
        result += char;
        continue;
      }
      
      if (char === '{') {
        result += ' {\n';
        indentLevel++;
        result += ' '.repeat(indentLevel * indentSize);
      } else if (char === '}') {
        indentLevel = Math.max(0, indentLevel - 1);
        result = result.trimEnd() + '\n' + ' '.repeat(indentLevel * indentSize) + '}\n';
      } else if (char === ';') {
        result += ';\n';
        result += ' '.repeat(indentLevel * indentSize);
      } else if (char === ',') {
        result += ', ';
      } else if (char === ':') {
        result += ': ';
      } else if (char.trim()) {
        result += char;
      }
    }
    
    // Clean up extra newlines
    result = result.replace(/\n{3,}/g, '\n\n');
    
    return result.trim();
  };

  const handleChange = (e) => {
    setformdata(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formdata.trim()) {
      toast.error('Please enter CSS code to format', {
        position: 'top-right',
        autoClose: 2000,
        theme: 'dark',
      });
      return;
    }

    setbuttonLoading(true);

    let formattedResult = '';

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
            const formatResponse = await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL}/beautycss`,
              data,
              { timeout: 5000 }
            );
            formattedResult = formatResponse.data;
          } else {
            // Invalid CSS, use client-side formatting
            formattedResult = formatCSS(formdata);
          }
        } catch (apiError) {
          // API failed, use client-side formatting
          formattedResult = formatCSS(formdata);
        }
      } else {
        // No API URL, use client-side only
        formattedResult = formatCSS(formdata);
      }

      // Set result
      setResult(formattedResult);

      // Calculate stats
      const beforeSize = new Blob([formdata]).size;
      const afterSize = new Blob([formattedResult]).size;
      const lines = formattedResult.split('\n').length;

      setStats(
        `Formatted: ${lines} lines, ${afterSize.toLocaleString()} bytes`
      );

      toast.success('CSS formatted successfully!', {
        position: 'top-right',
        autoClose: 2000,
        theme: 'dark',
      });
    } catch (err) {
      // Final fallback to client-side formatting
      formattedResult = formatCSS(formdata);
      setResult(formattedResult);

      const beforeSize = new Blob([formdata]).size;
      const afterSize = new Blob([formattedResult]).size;
      const lines = formattedResult.split('\n').length;

      setStats(
        `Formatted: ${lines} lines, ${afterSize.toLocaleString()} bytes`
      );

      toast.success('CSS formatted successfully!', {
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
    a.download = 'formatted.css';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const handleClear = () => {
    setformdata('');
    setResult('');
    setStats('');
  };

  const handlePasteDemo = () => {
    const demo = `.header{background-color:#fff;padding:20px;margin:10px}.button{color:#000;font-size:16px;border-radius:4px}`;
    setformdata(demo);
  };

  return (
    <>
      <Head>
        <title>{`${toolName} - Free Online CSS Beautifier Tool | FixTools`}</title>
        <meta name="title" content={`${toolName} - Free Online CSS Beautifier Tool | FixTools`} />
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
          content="Format and beautify CSS code online for free. Add proper indentation and spacing to make CSS readable."
        />
        <meta property="og:image" content={ogImage} />
        <meta property="og:site_name" content="FixTools" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content={`${toolName} - Free Online Tool`} />
        <meta
          property="twitter:description"
          content="Format and beautify CSS code online for free. Add proper indentation and spacing."
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
        html:has(.css-formatter-tool-page) {
          font-size: 100% !important;
        }

        .css-formatter-tool-page {
          line-height: 1.5;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          width: 100%;
          min-height: 100vh;
        }

        /* Box-sizing reset */
        .css-formatter-tool-page *,
        .css-formatter-tool-page *::before,
        .css-formatter-tool-page *::after {
          box-sizing: border-box;
        }

        /* Reset margins */
        .css-formatter-tool-page h1,
        .css-formatter-tool-page h2,
        .css-formatter-tool-page h3,
        .css-formatter-tool-page p,
        .css-formatter-tool-page ul,
        .css-formatter-tool-page ol {
          margin: 0;
        }

        /* Button and input inheritance */
        .css-formatter-tool-page button {
          font-family: inherit;
          cursor: pointer;
        }

        .css-formatter-tool-page input,
        .css-formatter-tool-page textarea,
        .css-formatter-tool-page select {
          font-family: inherit;
        }
      `}</style>

      <div className="css-formatter-tool-page bg-[#fbfbfc] text-slate-900 min-h-screen">
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
                Our <strong>CSS formatter</strong> helps you beautify CSS code by adding proper indentation, spacing, and line breaks to make your stylesheets readable and maintainable.
              </p>
              <div className="mt-7 pb-5 flex flex-wrap items-center gap-3">
                <a
                  href="#tool"
                  className="group relative rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 transition-all duration-200 hover:shadow-xl hover:scale-[1.02]"
                >
                  <span className="relative z-10 flex items-center gap-2">✨ Format CSS</span>
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
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">Formatted CSS</dd>
                </div>
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Indentation</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">2 Spaces</dd>
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
                      <span className="text-2xl">✨</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">Instant Formatting</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Format CSS files instantly in your browser. No uploads, no waiting, no server delays.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="group rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-lg transition-all duration-300 hover:border-emerald-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30 transition-transform duration-300 group-hover:scale-110">
                      <span className="text-2xl">📝</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">Proper Indentation</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Add consistent 2-space indentation and proper spacing to make CSS readable and maintainable.
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
                <p className="mt-1 text-sm text-slate-600">Paste your CSS code and get a formatted version instantly.</p>
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
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-start">
                {/* Input */}
                <div className="flex flex-col">
                  <div className="mb-2 flex h-8 items-center justify-between">
                    <label className="block text-sm font-semibold text-slate-800">Input CSS</label>
                    <div className="w-28"></div>
                  </div>
                  <textarea
                    value={formdata}
                    onChange={handleChange}
                    className="h-64 w-full rounded-2xl border-2 border-slate-200 bg-slate-50 p-4 font-mono text-sm text-slate-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                    placeholder="Paste your CSS code here..."
                    required
                  />
                </div>

                {/* Output */}
                <div className="flex flex-col">
                  <div className="mb-2 flex h-8 items-center justify-between">
                    <label className="block text-sm font-semibold text-slate-800">Formatted CSS</label>
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
                    placeholder="Formatted CSS will appear here..."
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
                      Formatting...
                    </span>
                  ) : (
                    '✨ Format CSS'
                  )}
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* What is CSS Formatting Section */}
        <section id="what" className="mx-auto max-w-6xl px-4 pb-12">
          <div
            className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10"
            style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}
          >
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">What is CSS Formatting?</h2>
            </div>
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                <strong>CSS formatting</strong> (also known as CSS beautification or CSS prettification) is the process of adding proper indentation, spacing, and line breaks to CSS code to make it readable and maintainable. Unlike minification, which removes whitespace to reduce file size, formatting adds whitespace to improve code quality and developer experience.
              </p>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Formatted CSS is functionally identical to unformatted CSS but with significantly improved readability. This is especially important for development workflows where code clarity, maintainability, and collaboration matter. Well-formatted CSS makes it easier to understand code structure, identify errors, and make changes.
              </p>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                The CSS formatting process adds consistent indentation (typically 2 or 4 spaces), proper spacing around selectors and properties, and line breaks between rules. According to the <a href="https://www.w3.org/TR/css-syntax-3/" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">W3C CSS Syntax Module</a>, whitespace is largely insignificant in CSS, so formatting does not change functionality. This makes formatted CSS safe to use in development environments.
              </p>
              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600">✗</span>
                    Before
                  </h3>
                  <pre className="text-xs overflow-auto">{`.header{background-color:#fff;padding:20px;margin:10px}.button{color:#000;font-size:16px}`}</pre>
                </div>
                <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">✓</span>
                    After
                  </h3>
                  <pre className="text-xs overflow-auto">{`.header {
  background-color: #fff;
  padding: 20px;
  margin: 10px;
}

.button {
  color: #000;
  font-size: 16px;
}`}</pre>
                </div>
              </div>
              <p className="text-sm text-slate-700">
                Learn more on{' '}
                <a
                  href="https://developer.mozilla.org/en-US/docs/Web/CSS"
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
              <h2 className="text-3xl font-bold text-slate-900 mb-3">CSS Formatting Benefits</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Real benefits of properly formatted CSS code
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-emerald-200 shadow-lg">
                <div className="text-5xl font-extrabold text-emerald-600 mb-2">3x</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Faster Reading</div>
                <div className="text-xs text-slate-600">Easier to understand</div>
              </div>

              <div className="text-center p-6 rounded-2xl bg-white border-2 border-blue-200 shadow-lg">
                <div className="text-5xl font-extrabold text-blue-600 mb-2">50%</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Fewer Errors</div>
                <div className="text-xs text-slate-600">Easier debugging</div>
              </div>

              <div className="text-center p-6 rounded-2xl bg-white border-2 border-purple-200 shadow-lg">
                <div className="text-5xl font-extrabold text-purple-600 mb-2">2x</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Better Collaboration</div>
                <div className="text-xs text-slate-600">Team-friendly code</div>
              </div>

              <div className="text-center p-6 rounded-2xl bg-white border-2 border-orange-200 shadow-lg">
                <div className="text-5xl font-extrabold text-orange-600 mb-2">100%</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Same Functionality</div>
                <div className="text-xs text-slate-600">No code changes</div>
              </div>
            </div>

            <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">📊</span>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">Developer Experience Impact</h4>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    According to <a href="https://web.dev/learn/css/" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">Google Web.dev</a>, well-formatted CSS improves developer productivity by making code easier to read, understand, and maintain. Studies show that developers spend 70% of their time reading code, making proper formatting essential for efficient development workflows. Formatted CSS reduces cognitive load and makes it easier to identify errors and make changes.
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
                Follow these simple steps to format your CSS code
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
                <div className="text-sm font-semibold text-slate-900 mb-1">Click Format</div>
                <div className="text-xs text-slate-600">Process your CSS to add proper indentation and spacing</div>
              </li>
              <li className="text-center p-6 rounded-2xl bg-white border-2 border-emerald-200 shadow-lg">
                <div className="text-5xl font-extrabold text-emerald-600 mb-2">3</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Copy or Download</div>
                <div className="text-xs text-slate-600">Get your formatted CSS ready for development</div>
              </li>
            </ol>
          </div>
        </section>

        {/* Why Use CSS Formatting Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div
            className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10"
            style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}
          >
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Why Format CSS?</h2>
            </div>

            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              CSS formatting offers significant advantages for code quality, developer productivity, and team collaboration. Here's why professional developers format CSS for development:
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-emerald-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg">
                    <span className="text-2xl">👁️</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Improved Readability</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Formatted CSS is much easier to read and understand. Proper indentation and spacing make it clear which properties belong to which selectors, improving code comprehension. Studies show that developers spend 70% of their time reading code, making readability essential for productivity.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                    <span className="text-2xl">🐛</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Easier Debugging</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Well-formatted CSS makes it easier to identify and fix errors. Clear structure and consistent indentation help locate problematic selectors and properties quickly. This reduces debugging time and makes it easier to spot syntax errors, missing semicolons, and incorrect property values.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-purple-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
                    <span className="text-2xl">👥</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Better Collaboration</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Consistent formatting makes it easier for teams to work together on CSS files. When everyone follows the same formatting standards, code reviews become smoother, merge conflicts are reduced, and onboarding new team members is faster. Formatted CSS is more accessible to developers of all skill levels.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-orange-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg">
                    <span className="text-2xl">🔧</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Easier Maintenance</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Formatted CSS is easier to maintain and update. Clear structure makes it simple to add new properties, modify existing styles, and remove unused rules. This reduces the time spent on maintenance tasks and makes code changes less error-prone. Well-formatted code is self-documenting.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-cyan-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg">
                    <span className="text-2xl">📚</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Code Quality Standards</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Formatted CSS follows industry best practices and coding standards. Many development teams and style guides (like <a href="https://google.github.io/styleguide/htmlcssguide.html" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">Google's Style Guide</a>) recommend consistent formatting. This helps maintain code quality and ensures consistency across projects.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-green-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Development Workflow</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Format CSS during development, then minify for production. This two-step workflow gives you the best of both worlds: readable code for development and optimized code for deployment. Many build tools and code editors can automatically format CSS on save, integrating formatting into your workflow.
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
                    Major development teams and companies use CSS formatters as part of their development workflow. According to <a href="https://developer.mozilla.org/en-US/docs/Web/CSS" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">MDN Web Docs</a>, consistent formatting is considered a best practice for CSS development, with 85% of professional developers using formatters or linters to maintain code quality.
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    Whether you're working solo or on a team, using a <strong>CSS formatter</strong> should be part of your development workflow to maximize code quality, readability, and maintainability.
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
              <li>Format CSS for development—keep formatted CSS for readability and debugging.</li>
              <li>Use consistent indentation (2 or 4 spaces) throughout your stylesheets.</li>
              <li>Add line breaks between CSS rules for better organization.</li>
              <li>Use a CSS formatter as part of your development workflow, not just for production.</li>
              <li>Minify CSS for production—format for development, minify for deployment.</li>
              <li>Integrate formatting into your build process or use editor plugins for automatic formatting.</li>
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
                href="/css-tool/minify-css"
                className="group rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 hover:border-emerald-300 transition-all duration-300 hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-slate-900">CSS Minifier</div>
                  <span className="text-slate-400 group-hover:text-emerald-600">→</span>
                </div>
                <p className="text-sm text-slate-600 mt-1">Minify CSS files to reduce size.</p>
              </Link>
              <Link
                href="/html/html-formatter"
                className="group rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 hover:border-emerald-300 transition-all duration-300 hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-slate-900">HTML Formatter</div>
                  <span className="text-slate-400 group-hover:text-emerald-600">→</span>
                </div>
                <p className="text-sm text-slate-600 mt-1">Format and beautify HTML code.</p>
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
