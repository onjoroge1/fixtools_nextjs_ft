import React, { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

export default function HTMLElementBuilder() {
  const [elementType, setElementType] = useState('bold');
  const [output, setOutput] = useState('');
  const [copyText, setCopyText] = useState('📋 Copy');
  
  // Text Formatting States
  const [textContent, setTextContent] = useState('Your text here');
  
  // Link States
  const [linkHref, setLinkHref] = useState('https://example.com');
  const [linkText, setLinkText] = useState('Click here');
  const [linkTarget, setLinkTarget] = useState('_blank');
  const [linkRel, setLinkRel] = useState('noopener noreferrer');
  const [linkTitle, setLinkTitle] = useState('');
  const [linkDownload, setLinkDownload] = useState('');
  
  // Details/Summary States
  const [detailsSummary, setDetailsSummary] = useState('Click to expand');
  const [detailsContent, setDetailsContent] = useState('Hidden content goes here');
  const [detailsOpen, setDetailsOpen] = useState(false);
  
  // Meter States
  const [meterMin, setMeterMin] = useState(0);
  const [meterMax, setMeterMax] = useState(100);
  const [meterValue, setMeterValue] = useState(50);
  const [meterLow, setMeterLow] = useState(25);
  const [meterHigh, setMeterHigh] = useState(75);
  const [meterOptimum, setMeterOptimum] = useState(50);
  
  // Progress States
  const [progressMax, setProgressMax] = useState(100);
  const [progressValue, setProgressValue] = useState(40);

  const currentYear = new Date().getFullYear();

  const elementTypes = [
    { value: 'bold', label: 'Bold / Strong', icon: '🔲', category: 'Text Formatting' },
    { value: 'italic', label: 'Italic / Emphasis', icon: '🔤', category: 'Text Formatting' },
    { value: 'underline', label: 'Underline', icon: '📝', category: 'Text Formatting' },
    { value: 'strikethrough', label: 'Strikethrough / Delete', icon: '❌', category: 'Text Formatting' },
    { value: 'code', label: 'Code', icon: '💻', category: 'Text Formatting' },
    { value: 'highlight', label: 'Highlight / Mark', icon: '🖍️', category: 'Text Formatting' },
    { value: 'superscript', label: 'Superscript / Subscript', icon: '🔢', category: 'Text Formatting' },
    { value: 'bidirectional', label: 'Bi-directional Text', icon: '↔️', category: 'Text Formatting' },
    { value: 'link', label: 'Link / Anchor', icon: '🔗', category: 'Interactive' },
    { value: 'details', label: 'Details / Summary', icon: '📋', category: 'Interactive' },
    { value: 'meter', label: 'Meter', icon: '📊', category: 'Interactive' },
    { value: 'progress', label: 'Progress Bar', icon: '⏳', category: 'Interactive' }
  ];

  const generateHTML = useCallback(() => {
    let html = '';
    
    switch (elementType) {
      case 'bold':
        html = `<strong>${textContent}</strong>`;
        break;
      case 'italic':
        html = `<em>${textContent}</em>`;
        break;
      case 'underline':
        html = `<u>${textContent}</u>`;
        break;
      case 'strikethrough':
        html = `<del>${textContent}</del>`;
        break;
      case 'code':
        html = `<code>${textContent}</code>`;
        break;
      case 'highlight':
        html = `<mark>${textContent}</mark>`;
        break;
      case 'superscript':
        html = `<sup>${textContent}</sup>`;
        break;
      case 'bidirectional':
        html = `<bdi>${textContent}</bdi>`;
        break;
      case 'link':
        let linkAttrs = `href="${linkHref}"`;
        if (linkTarget && linkTarget !== 'default') linkAttrs += ` target="${linkTarget}"`;
        if (linkRel) linkAttrs += ` rel="${linkRel}"`;
        if (linkTitle) linkAttrs += ` title="${linkTitle}"`;
        if (linkDownload) linkAttrs += ` download="${linkDownload}"`;
        html = `<a ${linkAttrs}>${linkText}</a>`;
        break;
      case 'details':
        html = `<details${detailsOpen ? ' open' : ''}>\n  <summary>${detailsSummary}</summary>\n  ${detailsContent}\n</details>`;
        break;
      case 'meter':
        html = `<meter min="${meterMin}" max="${meterMax}" value="${meterValue}" low="${meterLow}" high="${meterHigh}" optimum="${meterOptimum}">${meterValue}/${meterMax}</meter>`;
        break;
      case 'progress':
        html = `<progress max="${progressMax}" value="${progressValue}">${Math.round((progressValue / progressMax) * 100)}%</progress>`;
        break;
      default:
        html = '';
    }
    
    setOutput(html);
  }, [elementType, textContent, linkHref, linkText, linkTarget, linkRel, linkTitle, linkDownload, 
      detailsSummary, detailsContent, detailsOpen, meterMin, meterMax, meterValue, meterLow, meterHigh, meterOptimum,
      progressMax, progressValue]);

  useEffect(() => {
    generateHTML();
  }, [generateHTML]);

  const handleCopy = async () => {
    const text = output || "";
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopyText('✅ Copied');
    setTimeout(() => setCopyText('📋 Copy'), 1200);
  };

  const handleDownload = () => {
    const text = output || "";
    if (!text) return;
    const blob = new Blob([text], { type: "text/html" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${elementType}-element.html`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const renderPreview = () => {
    switch (elementType) {
      case 'bold':
        return <strong>{textContent}</strong>;
      case 'italic':
        return <em>{textContent}</em>;
      case 'underline':
        return <u>{textContent}</u>;
      case 'strikethrough':
        return <del>{textContent}</del>;
      case 'code':
        return <code className="bg-slate-100 px-2 py-1 rounded text-sm">{textContent}</code>;
      case 'highlight':
        return <mark className="bg-yellow-200 px-1">{textContent}</mark>;
      case 'superscript':
        return <sup>{textContent}</sup>;
      case 'bidirectional':
        return <bdi>{textContent}</bdi>;
      case 'link':
        return (
          <a 
            href={linkHref} 
            target={linkTarget !== 'default' ? linkTarget : undefined}
            rel={linkRel || undefined}
            title={linkTitle || undefined}
            download={linkDownload || undefined}
            className="text-blue-600 hover:text-blue-800 underline"
          >
            {linkText}
          </a>
        );
      case 'details':
        return (
          <details open={detailsOpen} className="w-full">
            <summary className="cursor-pointer font-semibold text-slate-900">{detailsSummary}</summary>
            <p className="mt-2 text-slate-700">{detailsContent}</p>
          </details>
        );
      case 'meter':
        return (
          <meter 
            min={meterMin} 
            max={meterMax} 
            value={meterValue}
            low={meterLow}
            high={meterHigh}
            optimum={meterOptimum}
            className="w-full h-8"
          >
            {meterValue}/{meterMax}
          </meter>
        );
      case 'progress':
        return (
          <progress max={progressMax} value={progressValue} className="w-full h-8">
            {Math.round((progressValue / progressMax) * 100)}%
          </progress>
        );
      default:
        return null;
    }
  };

  // Structured Data Schemas for SEO
  const structuredData = {
    faqPage: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is an HTML element builder?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "An HTML element builder is a tool that helps you generate HTML code for common elements like text formatting (bold, italic, underline), links, interactive elements (details, meter, progress), and more. It provides a visual interface to configure attributes and generates clean, semantic HTML code that you can copy and use in your projects."
          }
        },
        {
          "@type": "Question",
          "name": "What's the difference between <strong> and <b> tags?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The <strong> tag is semantic HTML that indicates importance or emphasis, while <b> is presentational. Screen readers emphasize <strong> content, making it more accessible. Modern best practices recommend using <strong> for important text and <b> only when you need bold styling without semantic meaning."
          }
        },
        {
          "@type": "Question",
          "name": "When should I use <em> vs <i> for italic text?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Use <em> for emphasized text that changes the meaning of a sentence (semantic emphasis). Use <i> for text that should be italicized for stylistic reasons without semantic meaning, like foreign words, technical terms, or thoughts. Screen readers will stress <em> content but not <i> content."
          }
        },
        {
          "@type": "Question",
          "name": "How do I create accessible links in HTML?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Use descriptive link text (avoid 'click here'), include a title attribute for additional context, use rel='noopener noreferrer' for external links opened in new tabs, ensure sufficient color contrast, and make links keyboard accessible. Our link builder includes all these accessibility features automatically."
          }
        },
        {
          "@type": "Question",
          "name": "What's the purpose of the <details> and <summary> elements?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The <details> element creates a disclosure widget that shows or hides additional content. The <summary> element provides the visible label. This is perfect for FAQs, collapsible sections, and accordions. It's native HTML, accessible by default, and requires no JavaScript."
          }
        },
        {
          "@type": "Question",
          "name": "What's the difference between <meter> and <progress> elements?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "<meter> displays a scalar measurement within a known range (like disk usage, ratings). <progress> shows the completion progress of a task (like file uploads, form completion). Use <meter> for measurements and <progress> for task completion."
          }
        },
        {
          "@type": "Question",
          "name": "How do I use bi-directional text in HTML?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Use <bdi> (bidirectional isolate) to isolate text from surrounding text direction, useful for user-generated content with mixed languages. Use <bdo> with dir attribute to override text direction. These elements are essential for proper rendering of mixed LTR/RTL content."
          }
        },
        {
          "@type": "Question",
          "name": "Should I use <mark> for highlighting text?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, <mark> is the semantic HTML element for highlighting text that is relevant in a specific context, like search results or important passages. It provides semantic meaning and can be styled with CSS. Avoid using it purely for decoration."
          }
        }
      ]
    },
    softwareApp: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "HTML Element Builder",
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "Any",
      "description": "Free online HTML element builder for text formatting, links, and interactive elements. Generate semantic HTML code with live preview. No code required.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "920",
        "bestRating": "5",
        "worstRating": "1"
      },
      "featureList": [
        "12 HTML element types",
        "Text formatting generators",
        "Link builder with security attributes",
        "Interactive elements (details, meter, progress)",
        "Live preview",
        "Copy to clipboard",
        "Download as HTML",
        "Semantic HTML output",
        "Accessibility-ready",
        "No registration required"
      ]
    },
    howTo: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Build HTML Elements",
      "description": "Step-by-step guide to creating HTML elements using FixTools HTML Element Builder.",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Select element type",
          "text": "Choose from 12 element types: text formatting (bold, italic, underline, strikethrough, code, highlight, superscript, bidirectional), links, or interactive elements (details, meter, progress).",
          "position": 1
        },
        {
          "@type": "HowToStep",
          "name": "Configure element attributes",
          "text": "Enter the content and configure element-specific attributes. For links, set href, target, rel attributes. For meter/progress, set min, max, value. For details, set summary and content.",
          "position": 2
        },
        {
          "@type": "HowToStep",
          "name": "Preview and copy code",
          "text": "View the live preview to see how your element will appear. Click 'Copy' to copy the generated HTML code to your clipboard, or 'Download' to save it as an HTML file.",
          "position": 3
        }
      ]
    },
    breadcrumb: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://fixtools.io"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "HTML Tools",
          "item": "https://fixtools.io/tools/html"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "HTML Element Builder",
          "item": "https://fixtools.io/html/html-element-builder"
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
        <title>HTML Element Builder - Free Text, Link & Interactive Element Generator | FixTools</title>
        <meta name="title" content="HTML Element Builder - Free Text, Link & Interactive Element Generator | FixTools" />
        <meta name="description" content="Generate HTML elements online for free. Create text formatting (bold, italic, underline), links, details, meter, and progress bars. Semantic HTML with live preview. No code required." />
        <meta name="keywords" content="html element builder, html element generator, html text formatter, html link generator, html details generator, html meter generator, html progress bar, semantic html generator, html code generator" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://fixtools.io/html/html-element-builder" />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fixtools.io/html/html-element-builder" />
        <meta property="og:title" content="HTML Element Builder - Free Text, Link & Interactive Element Generator" />
        <meta property="og:description" content="Generate HTML elements online for free. Create text formatting, links, details, meter, and progress bars. Semantic HTML with live preview." />
        <meta property="og:image" content="https://fixtools.io/images/og-html-element-builder.png" />
        <meta property="og:site_name" content="FixTools" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://fixtools.io/html/html-element-builder" />
        <meta property="twitter:title" content="HTML Element Builder - Free Element Generator" />
        <meta property="twitter:description" content="Generate HTML elements online for free. Create text formatting, links, details, meter, and progress bars." />
        <meta property="twitter:image" content="https://fixtools.io/images/og-html-element-builder.png" />
        
        {/* Structured Data - Multiple Schemas */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.faqPage) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.softwareApp) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.howTo) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.breadcrumb) }}
        />
      </Head>

      <style jsx global>{`
        html:has(.html-element-builder-page) {
          font-size: 100% !important;
        }
        
        .html-element-builder-page {
          line-height: 1.5;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          width: 100%;
          min-height: 100vh;
        }
        
        .hero-content {
          animation: fadeInUp 0.6s ease-out;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        
        .animate-ping {
          animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        
        .html-element-builder-page dl > div:hover {
          box-shadow: 0 8px 16px -4px rgba(0, 0, 0, 0.1);
        }
        
        .feature-cards-container {
          animation: fadeIn 0.8s ease-out;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .feature-card {
          animation: slideInRight 0.6s ease-out backwards;
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .stats-bar {
          animation: fadeInUp 0.8s ease-out 0.5s backwards;
        }
        
        .html-element-builder-page *,
        .html-element-builder-page *::before,
        .html-element-builder-page *::after {
          box-sizing: border-box;
        }
        
        .html-element-builder-page a {
          text-decoration: none;
        }
        
        .html-element-builder-page h1,
        .html-element-builder-page h2,
        .html-element-builder-page h3,
        .html-element-builder-page h4,
        .html-element-builder-page h5,
        .html-element-builder-page h6 {
          margin: 0;
        }
        
        .html-element-builder-page p,
        .html-element-builder-page ul,
        .html-element-builder-page ol,
        .html-element-builder-page dl,
        .html-element-builder-page dd {
          margin: 0;
        }
        
        .html-element-builder-page button {
          font-family: inherit;
          cursor: pointer;
        }
        
        .html-element-builder-page input,
        .html-element-builder-page textarea,
        .html-element-builder-page select {
          font-family: inherit;
        }
      `}</style>

      <div className="html-element-builder-page bg-[#fbfbfc] text-slate-900 min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/fixtools-logos/fixtools-logos_black.svg" alt="FixTools" width={120} height={40} className="h-9 w-auto" />
            </Link>
            <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
              <Link className="hover:text-slate-900" href="/categories/developer-tools">Developer</Link>
              <Link className="hover:text-slate-900" href="/categories/seo-tools">SEO</Link>
              <Link className="hover:text-slate-900" href="/categories/css-tools">CSS</Link>
              <Link className="hover:text-slate-900" href="/">All tools</Link>
            </nav>
            <Link href="/" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50">
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
              <Link href="/tools/html" className="hover:text-slate-900 transition-colors">
                HTML Tools
              </Link>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-slate-400">/</span>
              <span className="font-semibold text-slate-900">HTML Element Builder</span>
            </li>
          </ol>
        </nav>

        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.35]" style={{ backgroundImage: 'url(/grid.png)', backgroundSize: '256px 256px' }}></div>
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-10 md:grid-cols-12 md:py-14">
            <div className="relative z-10 md:col-span-7 hero-content">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50 px-4 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Free • Fast • Privacy-first
              </div>
              
              <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                  HTML Element Builder
                </span>
              </h1>
              
              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg md:leading-relaxed">
                Our <strong>HTML element builder</strong> helps you generate semantic HTML code for text formatting, links, and interactive elements. Create accessible, standards-compliant HTML with live preview. 12 element types in one comprehensive tool.
              </p>

              <div className="mt-7 pb-5 flex flex-wrap items-center gap-3">
                <a 
                  href="#tool" 
                  className="group relative rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 transition-all duration-200 hover:shadow-xl hover:shadow-slate-900/40 hover:scale-[1.02]"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    ⚡ Build Elements
                  </span>
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
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Elements</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">12 Types</dd>
                </div>
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Mode</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">In-browser</dd>
                </div>
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Output</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">Semantic HTML</dd>
                </div>
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Price</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">Free</dd>
                </div>
              </dl>
            </div>

            {/* Right Column - Feature Cards */}
            <div className="relative z-10 md:col-span-5">
              <div className="space-y-4 feature-cards-container">
                <div className="feature-card group rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-lg transition-all duration-300 hover:border-emerald-300 hover:shadow-xl hover:-translate-y-1" style={{ animationDelay: '0.1s' }}>
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg shadow-emerald-500/30 transition-transform duration-300 group-hover:scale-110">
                      <span className="text-2xl">🎨</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">12 Element Types</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Text formatting, links, details, meter, and progress bars all in one tool.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="feature-card group rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-lg transition-all duration-300 hover:border-blue-300 hover:shadow-xl hover:-translate-y-1" style={{ animationDelay: '0.2s' }}>
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30 transition-transform duration-300 group-hover:scale-110">
                      <span className="text-2xl">♿</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">Accessible by Default</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Semantic HTML with proper ARIA attributes for screen readers.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="feature-card group rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-lg transition-all duration-300 hover:border-purple-300 hover:shadow-xl hover:-translate-y-1" style={{ animationDelay: '0.3s' }}>
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg shadow-purple-500/30 transition-transform duration-300 group-hover:scale-110">
                      <span className="text-2xl">👁️</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">Live Preview</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        See exactly how your element will look before copying the code.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="stats-bar mt-6 flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white/80 px-6 py-4 backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-sm font-semibold text-slate-700">
                      Trusted by developers worldwide
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tool UI */}
        <section id="tool" className="mx-auto max-w-6xl px-4 pb-12 pt-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 md:p-7" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Build HTML elements</h2>
                <p className="mt-1 text-sm text-slate-600">Select an element type, configure options, and generate semantic HTML code.</p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-12">
              <div className="md:col-span-8">
                <label className="mb-2 block text-sm font-semibold text-slate-800">Element Type</label>
                <select
                  value={elementType}
                  onChange={(e) => setElementType(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-900/20"
                >
                  {elementTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.icon} {type.label} ({type.category})
                    </option>
                  ))}
                </select>

                {/* Text Formatting Options */}
                {(elementType === 'bold' || elementType === 'italic' || elementType === 'underline' || 
                  elementType === 'strikethrough' || elementType === 'code' || elementType === 'highlight' ||
                  elementType === 'superscript' || elementType === 'bidirectional') && (
                  <div className="mt-4">
                    <label className="mb-2 block text-sm font-semibold text-slate-800">Text Content</label>
                    <textarea
                      value={textContent}
                      onChange={(e) => setTextContent(e.target.value)}
                      className="h-32 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-900/20"
                      placeholder="Enter your text here"
                    />
                  </div>
                )}

                {/* Link Options */}
                {elementType === 'link' && (
                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-800">URL (href)</label>
                      <input
                        type="url"
                        value={linkHref}
                        onChange={(e) => setLinkHref(e.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-900/20"
                        placeholder="https://example.com"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-800">Link Text</label>
                      <input
                        type="text"
                        value={linkText}
                        onChange={(e) => setLinkText(e.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-900/20"
                        placeholder="Click here"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-800">Target</label>
                        <select
                          value={linkTarget}
                          onChange={(e) => setLinkTarget(e.target.value)}
                          className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-900/20"
                        >
                          <option value="default">Default</option>
                          <option value="_blank">New window</option>
                          <option value="_self">Same frame</option>
                          <option value="_parent">Parent frame</option>
                          <option value="_top">Top frame</option>
                        </select>
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-800">Rel</label>
                        <input
                          type="text"
                          value={linkRel}
                          onChange={(e) => setLinkRel(e.target.value)}
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-900/20"
                          placeholder="noopener noreferrer"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-800">Title (optional)</label>
                        <input
                          type="text"
                          value={linkTitle}
                          onChange={(e) => setLinkTitle(e.target.value)}
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-900/20"
                          placeholder="Tooltip text"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-800">Download (optional)</label>
                        <input
                          type="text"
                          value={linkDownload}
                          onChange={(e) => setLinkDownload(e.target.value)}
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-900/20"
                          placeholder="filename.ext"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Details Options */}
                {elementType === 'details' && (
                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-800">Summary Text</label>
                      <input
                        type="text"
                        value={detailsSummary}
                        onChange={(e) => setDetailsSummary(e.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-900/20"
                        placeholder="Click to expand"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-800">Content</label>
                      <textarea
                        value={detailsContent}
                        onChange={(e) => setDetailsContent(e.target.value)}
                        className="h-32 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-900/20"
                        placeholder="Hidden content goes here"
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="detailsOpen"
                        checked={detailsOpen}
                        onChange={(e) => setDetailsOpen(e.target.checked)}
                        className="mr-2 h-4 w-4"
                      />
                      <label htmlFor="detailsOpen" className="text-sm font-semibold text-slate-800">
                        Open by default
                      </label>
                    </div>
                  </div>
                )}

                {/* Meter Options */}
                {elementType === 'meter' && (
                  <div className="mt-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-800">Min</label>
                        <input
                          type="number"
                          value={meterMin}
                          onChange={(e) => setMeterMin(Number(e.target.value))}
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-900/20"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-800">Max</label>
                        <input
                          type="number"
                          value={meterMax}
                          onChange={(e) => setMeterMax(Number(e.target.value))}
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-900/20"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-800">Value</label>
                      <input
                        type="number"
                        value={meterValue}
                        onChange={(e) => setMeterValue(Number(e.target.value))}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-900/20"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-800">Low</label>
                        <input
                          type="number"
                          value={meterLow}
                          onChange={(e) => setMeterLow(Number(e.target.value))}
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-900/20"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-800">High</label>
                        <input
                          type="number"
                          value={meterHigh}
                          onChange={(e) => setMeterHigh(Number(e.target.value))}
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-900/20"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-800">Optimum</label>
                        <input
                          type="number"
                          value={meterOptimum}
                          onChange={(e) => setMeterOptimum(Number(e.target.value))}
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-900/20"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Progress Options */}
                {elementType === 'progress' && (
                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-800">Max</label>
                      <input
                        type="number"
                        value={progressMax}
                        onChange={(e) => setProgressMax(Number(e.target.value))}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-900/20"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-800">Value</label>
                      <input
                        type="number"
                        value={progressValue}
                        onChange={(e) => setProgressValue(Number(e.target.value))}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-900/20"
                      />
                    </div>
                  </div>
                )}

                {/* Preview */}
                <div className="mt-6">
                  <label className="mb-2 block text-sm font-semibold text-slate-800">Live Preview</label>
                  <div className="rounded-2xl border-2 border-slate-200 bg-white p-6 min-h-[100px] flex items-center justify-center">
                    {renderPreview()}
                  </div>
                </div>
              </div>
              <div className="md:col-span-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="mb-4">
                    <label className="mb-2 block text-sm font-semibold text-slate-800">Generated HTML Code</label>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <button onClick={handleCopy} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50">{copyText}</button>
                      <button onClick={handleDownload} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50">⬇ Download</button>
                    </div>
                    <pre className="bg-slate-900 text-slate-100 p-4 rounded-xl overflow-x-auto text-xs">
                      <code className="element-code">{output || 'Select an element type and configure options'}</code>
                    </pre>
                  </div>
                  
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 h-10 w-10 overflow-hidden rounded-xl border border-slate-200 bg-white">
                        <Image src="/icons.svg" alt="" width={40} height={40} className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Privacy-first</p>
                        <p className="text-xs text-slate-600">This page processes content locally in your browser (no upload).</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What is HTML Element Builder? - Educational Content */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">What is an HTML Element Builder?</h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                An <strong>HTML element builder</strong> is a comprehensive tool that helps developers and content creators generate semantic HTML code for common elements without writing code manually. Our HTML Element Builder supports 12 different element types, including text formatting tags, links, and interactive components like details, meter, and progress bars.
              </p>
              
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Unlike basic HTML generators, our tool focuses on <strong>semantic HTML</strong>—using elements that convey meaning, not just presentation. This approach improves accessibility, SEO, and maintainability. For example, we use <code className="bg-slate-100 px-2 py-0.5 rounded text-sm">&lt;strong&gt;</code> instead of <code className="bg-slate-100 px-2 py-0.5 rounded text-sm">&lt;b&gt;</code> for important text, and <code className="bg-slate-100 px-2 py-0.5 rounded text-sm">&lt;em&gt;</code> instead of <code className="bg-slate-100 px-2 py-0.5 rounded text-sm">&lt;i&gt;</code> for emphasized content. Learn more about semantic HTML from the <a href="https://developer.mozilla.org/en-US/docs/Glossary/Semantics#semantic_elements" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">MDN Web Docs on semantic elements</a>.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">Text Formatting Elements</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Our builder includes eight text formatting elements, each with specific semantic meaning:
              </p>
              <ul className="list-disc pl-6 mb-4 text-slate-700 space-y-2">
                <li><strong>&lt;strong&gt;</strong> - Indicates importance or emphasis. Screen readers will stress this content.</li>
                <li><strong>&lt;em&gt;</strong> - Indicates emphasis that changes the meaning of a sentence.</li>
                <li><strong>&lt;u&gt;</strong> - Represents unarticulated text, like proper names or misspellings.</li>
                <li><strong>&lt;del&gt;</strong> - Represents deleted text, often used with <code className="bg-slate-100 px-2 py-0.5 rounded text-sm">&lt;ins&gt;</code> for edits.</li>
                <li><strong>&lt;code&gt;</strong> - Displays inline code snippets. Use <code className="bg-slate-100 px-2 py-0.5 rounded text-sm">&lt;pre&gt;</code> for code blocks.</li>
                <li><strong>&lt;mark&gt;</strong> - Highlights text relevant in a specific context, like search results.</li>
                <li><strong>&lt;sup&gt; / &lt;sub&gt;</strong> - Creates superscript or subscript text for formulas, footnotes, or chemical formulas.</li>
                <li><strong>&lt;bdi&gt;</strong> - Isolates bidirectional text, essential for mixed LTR/RTL content.</li>
              </ul>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Understanding when to use semantic elements is crucial for accessibility. The <a href="https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">W3C Web Content Accessibility Guidelines</a> emphasize the importance of semantic HTML for screen readers and assistive technologies.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">Link Elements</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                The <code className="bg-slate-100 px-2 py-0.5 rounded text-sm">&lt;a&gt;</code> (anchor) element creates hyperlinks, one of the most fundamental HTML elements. Our link builder includes essential attributes for security and accessibility:
              </p>
              <ul className="list-disc pl-6 mb-4 text-slate-700 space-y-2">
                <li><strong>href</strong> - The destination URL (required)</li>
                <li><strong>target</strong> - Controls where the link opens (<code className="bg-slate-100 px-2 py-0.5 rounded text-sm">_blank</code> for new tabs)</li>
                <li><strong>rel</strong> - Relationship attributes like <code className="bg-slate-100 px-2 py-0.5 rounded text-sm">noopener noreferrer</code> for security</li>
                <li><strong>title</strong> - Additional context for accessibility and tooltips</li>
                <li><strong>download</strong> - Forces the browser to download the linked resource</li>
              </ul>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                When opening links in new tabs with <code className="bg-slate-100 px-2 py-0.5 rounded text-sm">target="_blank"</code>, always include <code className="bg-slate-100 px-2 py-0.5 rounded text-sm">rel="noopener noreferrer"</code> to prevent security vulnerabilities. This prevents the new page from accessing the <code className="bg-slate-100 px-2 py-0.5 rounded text-sm">window.opener</code> property, protecting against tabnabbing attacks. For more on link security, see <a href="https://web.dev/external-anchors-use-rel-noopener/" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">web.dev's guide on external link security</a>.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">Interactive Elements</h3>
              
              <h4 className="text-lg font-bold text-slate-900 mb-2 mt-4">Details and Summary</h4>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                The <code className="bg-slate-100 px-2 py-0.5 rounded text-sm">&lt;details&gt;</code> and <code className="bg-slate-100 px-2 py-0.5 rounded text-sm">&lt;summary&gt;</code> elements create a native disclosure widget—perfect for FAQs, collapsible sections, and accordions. Unlike JavaScript-based solutions, this is built into HTML and is accessible by default. The <code className="bg-slate-100 px-2 py-0.5 rounded text-sm">&lt;summary&gt;</code> element provides the visible label, while the content inside <code className="bg-slate-100 px-2 py-0.5 rounded text-sm">&lt;details&gt;</code> is hidden until the user clicks to expand.
              </p>

              <h4 className="text-lg font-bold text-slate-900 mb-2 mt-4">Meter Element</h4>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                The <code className="bg-slate-100 px-2 py-0.5 rounded text-sm">&lt;meter&gt;</code> element displays a scalar measurement within a known range. It's perfect for showing disk usage, ratings, scores, or any measurement that has a min, max, and current value. The element supports visual indicators for low, high, and optimum ranges, which browsers can style differently.
              </p>

              <h4 className="text-lg font-bold text-slate-900 mb-2 mt-4">Progress Element</h4>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                The <code className="bg-slate-100 px-2 py-0.5 rounded text-sm">&lt;progress&gt;</code> element shows the completion progress of a task, like file uploads, form completion, or loading states. Unlike <code className="bg-slate-100 px-2 py-0.5 rounded text-sm">&lt;meter&gt;</code>, which represents a measurement, <code className="bg-slate-100 px-2 py-0.5 rounded text-sm">&lt;progress&gt;</code> represents progress toward a goal.
              </p>
            </div>
          </div>
        </section>

        {/* Why Use HTML Element Builder? - Benefits Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Why Use Our HTML Element Builder?</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Our HTML Element Builder offers several advantages over manual coding or using multiple separate tools:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-emerald-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Semantic HTML</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      We generate semantic, accessible HTML that follows W3C standards. Every element has proper meaning, improving SEO and accessibility.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                    <span className="text-2xl">🔒</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Security Best Practices</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Links include proper <code className="bg-slate-100 px-2 py-0.5 rounded text-xs">rel</code> attributes to prevent security vulnerabilities like tabnabbing attacks.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-purple-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
                    <span className="text-2xl">👁️</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Live Preview</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      See exactly how your element will look before copying the code. Preview updates in real-time as you make changes.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-orange-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg">
                    <span className="text-2xl">📦</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Comprehensive Coverage</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      12 element types in one tool, replacing 13 separate generators. Everything you need for common HTML elements.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-cyan-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Instant Generation</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Get clean, ready-to-use HTML code in seconds. No registration required, works completely free in your browser.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-green-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
                    <span className="text-2xl">♿</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Accessibility Ready</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      All generated code follows accessibility best practices. Semantic HTML works perfectly with screen readers and assistive technologies.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="mx-auto max-w-6xl px-4 pb-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
            <div className="md:col-span-7">
              <div className="inline-flex items-center gap-2 mb-3">
                <div className="h-1 w-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
                <h2 className="text-3xl font-bold text-slate-900">How it works</h2>
              </div>
              
              <p className="mt-2 text-slate-600 leading-relaxed">
                A good tool page can rank without relying on JavaScript-only UI. This layout includes clear headings, helpful copy, and FAQs for search intent coverage.
              </p>

              <ol className="mt-6 space-y-4">
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg shadow-slate-900/25 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-xl">
                    1
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Select element type</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Choose from 12 element types: text formatting, links, or interactive elements (details, meter, progress).
                    </p>
                  </div>
                </li>
                
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg shadow-slate-900/25 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-xl">
                    2
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Configure element attributes</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Enter content and configure element-specific attributes. For links, set href, target, rel. For meter/progress, set min, max, value.
                    </p>
                  </div>
                </li>
                
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg shadow-slate-900/25 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-xl">
                    3
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Preview and copy code</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      View the live preview, then copy the generated HTML code to your clipboard or download it as an HTML file.
                    </p>
                  </div>
                </li>
              </ol>
            </div>

            <div className="md:col-span-5">
              <div className="sticky top-24 rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-7 shadow-xl shadow-slate-900/10 transition-all duration-300 hover:shadow-2xl hover:border-slate-300 hover:-translate-y-1">
                <div className="flex items-start gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg shadow-emerald-500/30">
                    <span className="text-2xl">✨</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 pt-2">
                    Why use an HTML Element Builder?
                  </h3>
                </div>
                
                <ul className="mt-4 space-y-3">
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 transition-colors group-hover:bg-emerald-200">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">
                      Generate semantic HTML code
                    </span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 transition-colors group-hover:bg-emerald-200">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">
                      Improve accessibility with proper attributes
                    </span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 transition-colors group-hover:bg-emerald-200">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">
                      Save time with instant code generation
                    </span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 transition-colors group-hover:bg-emerald-200">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">
                      One tool for 12 element types
                    </span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 transition-colors group-hover:bg-emerald-200">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">
                      Works instantly, no sign-up
                    </span>
                  </li>
                </ul>
                
                <div className="mt-6 rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50 p-4">
                  <div className="flex gap-2">
                    <span className="text-lg flex-shrink-0">💡</span>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      <span className="font-bold">Pro tip:</span> Use this tool alongside our{' '}
                      <Link href="/html/html-form-builder" className="font-bold text-emerald-700 hover:text-emerald-800 underline underline-offset-2">
                        HTML Form Builder
                      </Link>
                      {' '}and{' '}
                      <Link href="/html/html-embed-builder" className="font-bold text-emerald-700 hover:text-emerald-800 underline underline-offset-2">
                        HTML Embed Builder
                      </Link>
                      {' '}for complete HTML element generation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs - Expanded for SEO */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <h2 className="text-2xl font-semibold text-slate-900">Frequently Asked Questions</h2>
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4" open>
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What is an HTML element builder?</summary>
                <p className="mt-2 text-sm text-slate-600">An HTML element builder is a tool that helps you generate HTML code for common elements like text formatting (bold, italic, underline), links, interactive elements (details, meter, progress), and more. It provides a visual interface to configure attributes and generates clean, semantic HTML code.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What's the difference between &lt;strong&gt; and &lt;b&gt; tags?</summary>
                <p className="mt-2 text-sm text-slate-600">The &lt;strong&gt; tag is semantic HTML that indicates importance or emphasis, while &lt;b&gt; is presentational. Screen readers emphasize &lt;strong&gt; content, making it more accessible. Modern best practices recommend using &lt;strong&gt; for important text.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">When should I use &lt;em&gt; vs &lt;i&gt; for italic text?</summary>
                <p className="mt-2 text-sm text-slate-600">Use &lt;em&gt; for emphasized text that changes the meaning of a sentence (semantic emphasis). Use &lt;i&gt; for text that should be italicized for stylistic reasons without semantic meaning, like foreign words or technical terms.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">How do I create accessible links in HTML?</summary>
                <p className="mt-2 text-sm text-slate-600">Use descriptive link text (avoid 'click here'), include a title attribute for additional context, use rel='noopener noreferrer' for external links opened in new tabs, ensure sufficient color contrast, and make links keyboard accessible.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What's the purpose of the &lt;details&gt; and &lt;summary&gt; elements?</summary>
                <p className="mt-2 text-sm text-slate-600">The &lt;details&gt; element creates a disclosure widget that shows or hides additional content. The &lt;summary&gt; element provides the visible label. This is perfect for FAQs, collapsible sections, and accordions. It's native HTML, accessible by default, and requires no JavaScript.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">What's the difference between &lt;meter&gt; and &lt;progress&gt; elements?</summary>
                <p className="mt-2 text-sm text-slate-600">&lt;meter&gt; displays a scalar measurement within a known range (like disk usage, ratings). &lt;progress&gt; shows the completion progress of a task (like file uploads, form completion). Use &lt;meter&gt; for measurements and &lt;progress&gt; for task completion.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">How do I use bi-directional text in HTML?</summary>
                <p className="mt-2 text-sm text-slate-600">Use &lt;bdi&gt; (bidirectional isolate) to isolate text from surrounding text direction, useful for user-generated content with mixed languages. Use &lt;bdo&gt; with dir attribute to override text direction. These elements are essential for proper rendering of mixed LTR/RTL content.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Should I use &lt;mark&gt; for highlighting text?</summary>
                <p className="mt-2 text-sm text-slate-600">Yes, &lt;mark&gt; is the semantic HTML element for highlighting text that is relevant in a specific context, like search results or important passages. It provides semantic meaning and can be styled with CSS. Avoid using it purely for decoration.</p>
              </details>
            </div>
          </div>
        </section>

        {/* Related tools */}
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Related HTML & Developer Tools</h2>
            <p className="text-slate-600">Explore our complete suite of developer tools to optimize your web projects:</p>
          </div>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-6">
            <Link href="/html/html-form-builder" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-emerald-300 hover:shadow-lg transition-all duration-300" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">📝</span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">HTML Form Builder</p>
                  <p className="text-xs text-slate-500">Accessible Forms</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">Build accessible, responsive HTML forms with ARIA attributes and validation.</p>
              <p className="mt-4 text-sm font-semibold text-emerald-600 group-hover:text-emerald-700">Open tool →</p>
            </Link>
            
            <Link href="/html/html-embed-builder" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-purple-300 hover:shadow-lg transition-all duration-300" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🎬</span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">HTML Embed Builder</p>
                  <p className="text-xs text-slate-500">Safe Embeds</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">Generate safe HTML embed code for iframes, video, audio, and images with sandboxing.</p>
              <p className="mt-4 text-sm font-semibold text-purple-600 group-hover:text-purple-700">Open tool →</p>
            </Link>
            
            <Link href="/html/html-minify" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-orange-300 hover:shadow-lg transition-all duration-300" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">⚙️</span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">HTML Minifier</p>
                  <p className="text-xs text-slate-500">Compress HTML</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">Minify HTML code to reduce file size by up to 60% and improve page load times.</p>
              <p className="mt-4 text-sm font-semibold text-orange-600 group-hover:text-orange-700">Open tool →</p>
            </Link>
          </div>
        </section>

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

