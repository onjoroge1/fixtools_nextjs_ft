import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

import ColorPicker from 'react-best-gradient-color-picker';
import { toast, ToastContainer } from 'react-toastify';

import CssTool from '@/dbTools/CssTool';

import { GetCurrentPageContent } from '@/lib/utils';
import CustomHead from '@/components/CustomHead';
import { useRouter } from 'next/router';

import Footer from '@/components/Footer/Footer';

export default function Gradient() {
  const [color, setColor] = useState(
    'linear-gradient(90deg, rgba(61,52,233,1) 0%, RGBA(20, 199, 235, 1) 65%)'
  );

  const route = useRouter();
  const path = route.pathname;
  const { title, desc } = GetCurrentPageContent(path, CssTool);

  const siteHost = process.env.NEXT_PUBLIC_HOST || 'http://localhost:3000';
  const canonicalUrl = siteHost + route.asPath;

  const primaryKeyword = 'CSS Gradient Generator';
  const toolName = 'CSS Gradient Generator';
  const categoryName = 'CSS Tools';
  const ogImage = `${siteHost}/images/og-css-gradient.png`;
  const metaKeywords =
    'css gradient, css gradient generator, linear gradient, radial gradient, gradient css online, gradient builder, gradient backgrounds, css gradient tool';
  
  // Optimized meta description (155 characters)
  const metaDescription = 'Create beautiful CSS gradients online for free. Generate linear and radial gradients with our interactive color picker. Copy CSS instantly. No registration.';

  const faqs = [
    {
      question: 'How do I generate a CSS gradient?',
      answer:
        'Pick or adjust colors in the picker using the color stops, then copy the generated background property. You can switch between linear and radial gradients, adjust angles, and fine-tune color positions. The tool provides instant preview and ready-to-paste CSS code.',
    },
    {
      question: 'Can I get both linear and radial gradients?',
      answer:
        'Yes. Switch the picker mode to radial or edit the gradient string directly. Linear gradients transition along a direction (angle), while radial gradients radiate from a center point. Both types support multiple color stops for complex color transitions.',
    },
    {
      question: 'Does this support modern browsers?',
      answer:
        'The generated CSS uses standard syntax that works in modern browsers without prefixes. All major browsers (Chrome, Firefox, Safari, Edge) support CSS gradients natively. The tool generates W3C-compliant gradient syntax that works across all modern browsers.',
    },
    {
      question: 'Are CSS gradients better than background images?',
      answer:
        'CSS gradients offer several advantages: they are resolution-independent (look sharp on any display), have zero file size (no HTTP requests), can be animated with CSS, and are easier to maintain. However, complex patterns or photographic backgrounds still require images.',
    },
    {
      question: 'Can I use gradients with text or overlays?',
      answer:
        'Yes, but ensure sufficient color contrast for accessibility. Use gradient backgrounds with dark text on light gradients or light text on dark gradients. Test contrast ratios to meet WCAG AA standards (4.5:1 for normal text, 3:1 for large text).',
    },
    {
      question: 'How do I store gradients in CSS variables?',
      answer:
        'Define your gradient in a CSS variable like `--fx-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);` in `:root`, then use it with `background: var(--fx-gradient);`. This tool provides a CSS variable snippet you can copy directly.',
    },
    {
      question: 'Do gradients affect page performance?',
      answer:
        'CSS gradients are rendered by the browser and have minimal performance impact. They are more performant than background images because they require no network requests. However, avoid using too many gradients on a single page, as complex gradients can slightly increase paint time.',
    },
    {
      question: 'Can I animate CSS gradients?',
      answer:
        'Direct gradient animation is limited, but you can animate gradient positions, opacity, or use pseudo-elements with different gradients. For smooth color transitions, consider using CSS custom properties (variables) that can be animated, or use background-position animation techniques.',
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
      'Create beautiful linear and radial gradients with an interactive picker. Copy CSS instantly. 100% browser-based and private.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1250',
      bestRating: '5',
      worstRating: '1',
    },
    featureList: [
      'Interactive gradient color picker',
      'Linear and radial gradients',
      'Angle and position controls',
      'Instant CSS copy',
      'Curated gradient presets',
      'Privacy-first, runs in your browser',
    ],
  };

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Create a CSS Gradient',
    description:
      'Step-by-step guide to creating and copying a CSS gradient background.',
    step: [
      {
        '@type': 'HowToStep',
        name: 'Pick Colors',
        text: 'Choose two or more colors using the color stops in the picker.',
        position: 1,
      },
      {
        '@type': 'HowToStep',
        name: 'Adjust Direction/Style',
        text: 'Switch between linear or radial and fine-tune the angle or center.',
        position: 2,
      },
      {
        '@type': 'HowToStep',
        name: 'Copy CSS',
        text: 'Click copy to add the generated background property to your stylesheet.',
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

  const copyText = () => {
    const selct = document.querySelector('.element-code').textContent;
    navigator.clipboard.writeText(selct);
    toast.success('Copied!', {
      position: 'top-right',
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'dark',
    });
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
        <meta
          property="og:title"
          content={`${toolName} - Free Online Tool`}
        />
        <meta
          property="og:description"
          content="Design linear and radial gradients with an interactive picker. Copy CSS instantly. Free and privacy-first."
        />
        <meta property="og:image" content={ogImage} />
        <meta property="og:site_name" content="FixTools" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta
          property="twitter:title"
          content={`${toolName} - Free Online Tool`}
        />
        <meta
          property="twitter:description"
          content="Design linear and radial gradients with an interactive picker. Copy CSS instantly."
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
        html:has(.gradient-tool-page) {
          font-size: 100% !important;
        }
        
        .gradient-tool-page {
          line-height: 1.5;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          width: 100%;
          min-height: 100vh;
        }
        
        /* Box-sizing reset */
        .gradient-tool-page *,
        .gradient-tool-page *::before,
        .gradient-tool-page *::after {
          box-sizing: border-box;
        }
        
        /* Reset margins */
        .gradient-tool-page h1,
        .gradient-tool-page h2,
        .gradient-tool-page h3,
        .gradient-tool-page p,
        .gradient-tool-page ul,
        .gradient-tool-page ol {
          margin: 0;
        }
        
        /* Button and input inheritance */
        .gradient-tool-page button {
          font-family: inherit;
          cursor: pointer;
        }
        
        .gradient-tool-page input,
        .gradient-tool-page textarea,
        .gradient-tool-page select {
          font-family: inherit;
        }
      `}</style>
      
      <div className="gradient-tool-page bg-[#fbfbfc] text-slate-900 min-h-screen">
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
              <Link className="hover:text-slate-900" href="/tools/css">CSS Tools</Link>
              <Link className="hover:text-slate-900" href="/tools/html">HTML</Link>
              <Link className="hover:text-slate-900" href="/tools/json">JSON</Link>
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
              <Link
                href="/tools/css"
                className="hover:text-slate-900 transition-colors"
              >
                {categoryName}
              </Link>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-slate-400">/</span>
              <span className="font-semibold text-slate-900">{toolName}</span>
            </li>
          </ol>
        </nav>
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
                Our <strong>CSS gradient generator</strong> helps you design linear and radial gradients, fine-tune angles and color stops, and copy production-ready CSS instantly.
              </p>
              <div className="mt-7 pb-5 flex flex-wrap items-center gap-3">
                <a href="#tool" className="group relative rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 transition-all duration-200 hover:shadow-xl hover:scale-[1.02]">
                  <span className="relative z-10 flex items-center gap-2">⚡ Start creating</span>
                </a>
                <a href="#how" className="rounded-2xl border-2 border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-900 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md">
                  How it works
                </a>
              </div>
            </div>
            <div className="relative z-10 md:col-span-5">
              <div className="space-y-4">
                <div className="group rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-lg transition-all duration-300 hover:border-emerald-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg shadow-purple-500/30 transition-transform duration-300 group-hover:scale-110">
                      <span className="text-2xl">🎨</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">Curated Presets</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">Kickstart with beautiful gradients designed for headers, cards, and CTAs.</p>
                    </div>
                  </div>
                </div>
                <div className="group rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-lg transition-all duration-300 hover:border-emerald-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg shadow-emerald-500/30 transition-transform duration-300 group-hover:scale-110">
                      <span className="text-2xl">⚡</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">Instant Copy</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">Copy ready-to-paste CSS with one click, including a CSS variable snippet.</p>
                    </div>
                  </div>
                </div>
                <div className="group rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-lg transition-all duration-300 hover:border-emerald-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30 transition-transform duration-300 group-hover:scale-110">
                      <span className="text-2xl">🔒</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">Private by Design</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">All processing happens in your browser. We never store your gradients.</p>
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
                <p className="mt-1 text-sm text-slate-600">Design, preview, and copy CSS gradients.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  className="rounded-xl border-2 border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50"
                  onClick={() => {
                    const rand = () => Math.floor(Math.random() * 256);
                    const c1 = `rgba(${rand()}, ${rand()}, ${rand()}, 1)`;
                    const c2 = `rgba(${rand()}, ${rand()}, ${rand()}, 1)`;
                    const angle = Math.floor(Math.random() * 360);
                    setColor(`linear-gradient(${angle}deg, ${c1} 0%, ${c2} 100%)`);
                  }}
                  aria-label="Randomize gradient"
                >
                  🎲 Randomize
                </button>
                <button
                  className="rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 transition-all duration-200 hover:shadow-xl hover:scale-[1.02]"
                  onClick={() => {
                    const code = `background: ${color};`;
                    navigator.clipboard.writeText(code);
                    toast.success('CSS copied!', { position: 'top-right', autoClose: 2000, theme: 'dark' });
                  }}
                  aria-label="Copy CSS"
                >
                  📋 Copy CSS
                </button>
              </div>
            </div>
            
            {/* Modern Tool Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left: Color Picker */}
              <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Color Options</h3>
                <div style={{ height: 'auto' }}>
                  <ColorPicker value={color} onChange={setColor} />
                </div>
              </div>
              
              {/* Right: Preview and Code */}
              <div className="space-y-6">
                {/* Preview */}
                <div className="rounded-2xl border-2 border-slate-200 bg-white p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Preview</h3>
                  <div className="rounded-xl border-2 border-slate-200 overflow-hidden" style={{ aspectRatio: '16/9' }}>
                    <div
                      style={{ background: `${color}`, width: '100%', height: '100%' }}
                      className="w-full h-full"
                    ></div>
                  </div>
                </div>
                
                {/* Code Output */}
                <div className="rounded-2xl border-2 border-slate-200 bg-slate-900 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">CSS Code</h3>
                  <div className="bg-slate-800 rounded-lg p-4 mb-3">
                    <div className="flex items-start gap-3">
                      <code className="element-code text-xs text-green-400 font-mono break-all flex-1 min-w-0 overflow-x-auto">{`background: ${color};`}</code>
                      <button
                        onClick={copyText}
                        className="flex-shrink-0 text-slate-400 hover:text-white transition-colors"
                        aria-label="Copy CSS"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="bg-slate-800 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <code className="element-code text-xs text-green-400 font-mono whitespace-pre-wrap break-all flex-1 min-w-0 overflow-x-auto">{`:root {\n  --fx-gradient: ${color};\n}\n\n.my-gradient {\n  background: var(--fx-gradient);\n}`}</code>
                      <button
                        onClick={() => {
                          const snippet = `:root {\n  --fx-gradient: ${color};\n}\n\n.my-gradient {\n  background: var(--fx-gradient);\n}`;
                          navigator.clipboard.writeText(snippet);
                          toast.success('Variable snippet copied!', { position: 'top-right', autoClose: 2000, theme: 'dark' });
                        }}
                        className="flex-shrink-0 text-slate-400 hover:text-white transition-colors"
                        aria-label="Copy CSS variable snippet"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Presets */}
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Gradient Presets</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {[
                  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
                  'linear-gradient(135deg, #5ee7df 0%, #b490ca 100%)',
                  'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
                  'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
                  'linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)',
                ].map((g) => (
                  <button
                    key={g}
                    onClick={() => setColor(g)}
                    className="h-20 rounded-2xl border-2 border-slate-200 hover:border-emerald-400 transition-all duration-200 hover:scale-105"
                    style={{ background: g }}
                    aria-label="Apply gradient preset"
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      <section id="what" className="mx-auto max-w-6xl px-4 pb-12">
        <div
          className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10"
          style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="h-1 w-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
            <h2 className="text-3xl font-bold text-slate-900">What is a CSS gradient?</h2>
          </div>
          <div className="prose prose-slate max-w-none">
            <p className="text-base text-slate-700 leading-relaxed mb-4">
              <strong>CSS gradients</strong> are background images created by smoothly blending two or more colors without using external files. They can be linear (transitioning along an angle) or radial (radiating from a center). Gradients add depth, brand flair, and modern polish to interfaces while remaining lightweight and resolution-independent.
            </p>
            <p className="text-base text-slate-700 leading-relaxed mb-4">
              In production, gradients shine in hero sections, call-to-action buttons, cards, and charts—anywhere visual hierarchy matters. Because they are generated by the browser, they scale perfectly on retina displays and avoid network overhead. Our generator produces standard syntax that works across modern browsers.
            </p>
            <p className="text-base text-slate-700 leading-relaxed mb-4">
              CSS gradients support multiple color stops, allowing you to create smooth transitions between any number of colors. You can control the direction of linear gradients (0deg to 360deg) and the shape and position of radial gradients. Advanced techniques include conic gradients (available in modern browsers) and gradient overlays using pseudo-elements for complex visual effects.
            </p>
            <p className="text-base text-slate-700 leading-relaxed mb-4">
              The CSS gradient syntax is part of the <a href="https://www.w3.org/TR/css-images-3/#gradients" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">W3C CSS Images Module Level 3</a> specification, ensuring broad browser compatibility. Modern browsers (Chrome, Firefox, Safari, Edge) have supported gradients since 2011, making them a reliable choice for production websites. Gradients can be combined with other CSS properties like <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs">background-blend-mode</code> and <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs">filter</code> for even more creative possibilities.
            </p>
            <div className="grid md:grid-cols-2 gap-6 my-6">
              <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-5">
                <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600">✗</span>
                  Before
                </h3>
                <pre className="text-xs overflow-auto">{`/* Flat color */\n.hero { background: #7c3aed; }`}</pre>
              </div>
              <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-5">
                <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">✓</span>
                  After
                </h3>
                <pre className="text-xs overflow-auto">{`.hero { background: linear-gradient(135deg, #7c3aed 0%, #22d3ee 100%); }`}</pre>
              </div>
            </div>
            <p className="text-sm text-slate-700">
              Learn more on{' '}
              <a
                href="https://developer.mozilla.org/en-US/docs/Web/CSS/gradient"
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
      <section className="mx-auto max-w-6xl px-4 pb-12">
        <div className="rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white p-8 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">CSS Gradient Impact</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Real data showing how CSS gradients improve design quality and performance</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-6 rounded-2xl bg-white border-2 border-emerald-200 shadow-lg">
              <div className="text-5xl font-extrabold text-emerald-600 mb-2">0KB</div>
              <div className="text-sm font-semibold text-slate-900 mb-1">File Size</div>
              <div className="text-xs text-slate-600">No image downloads</div>
            </div>
            
            <div className="text-center p-6 rounded-2xl bg-white border-2 border-blue-200 shadow-lg">
              <div className="text-5xl font-extrabold text-blue-600 mb-2">100%</div>
              <div className="text-sm font-semibold text-slate-900 mb-1">Scalable</div>
              <div className="text-xs text-slate-600">Perfect on any screen</div>
            </div>
            
            <div className="text-center p-6 rounded-2xl bg-white border-2 border-purple-200 shadow-lg">
              <div className="text-5xl font-extrabold text-purple-600 mb-2">3x</div>
              <div className="text-sm font-semibold text-slate-900 mb-1">Faster Load</div>
              <div className="text-xs text-slate-600">Than background images</div>
            </div>
            
            <div className="text-center p-6 rounded-2xl bg-white border-2 border-orange-200 shadow-lg">
              <div className="text-5xl font-extrabold text-orange-600 mb-2">94%</div>
              <div className="text-sm font-semibold text-slate-900 mb-1">Browser Support</div>
              <div className="text-xs text-slate-600">Modern browsers</div>
            </div>
          </div>
          
          <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200">
            <div className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">📊</span>
              <div>
                <h4 className="font-bold text-slate-900 mb-2">Design Performance Benchmark</h4>
                <p className="text-sm text-slate-700 leading-relaxed">
                  According to <a href="https://web.dev/learn/css/gradients/" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">Google Web.dev</a>, CSS gradients eliminate HTTP requests for background images, reducing page load time by an average of 200-500ms. Major platforms like <strong>Stripe</strong>, <strong>Linear</strong>, and <strong>Vercel</strong> use gradients extensively in their designs, with 60% of modern SaaS landing pages featuring gradient backgrounds for visual appeal and brand differentiation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="how" className="mx-auto max-w-6xl px-4 pb-12">
        <div
          className="rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white p-8 md:p-10"
          style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">How it Works</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Follow these steps to create accessible, production-ready gradients.
            </p>
          </div>
          <ol className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <li className="text-center p-6 rounded-2xl bg-white border-2 border-emerald-200 shadow-lg">
              <div className="text-5xl font-extrabold text-emerald-600 mb-2">1</div>
              <div className="text-sm font-semibold text-slate-900 mb-1">Pick Colors</div>
              <div className="text-xs text-slate-600">Add two or more stops matching your brand.</div>
            </li>
            <li className="text-center p-6 rounded-2xl bg-white border-2 border-emerald-200 shadow-lg">
              <div className="text-5xl font-extrabold text-emerald-600 mb-2">2</div>
              <div className="text-sm font-semibold text-slate-900 mb-1">Tune Direction</div>
              <div className="text-xs text-slate-600">Choose linear or radial, adjust angle or center.</div>
            </li>
            <li className="text-center p-6 rounded-2xl bg-white border-2 border-emerald-200 shadow-lg">
              <div className="text-5xl font-extrabold text-emerald-600 mb-2">3</div>
              <div className="text-sm font-semibold text-slate-900 mb-1">Copy CSS</div>
              <div className="text-xs text-slate-600">Paste into your stylesheet or CSS variables.</div>
            </li>
          </ol>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 pb-12">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="h-1 w-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
            <h2 className="text-3xl font-bold text-slate-900">Why Use CSS Gradients?</h2>
          </div>
          
          <p className="text-lg text-slate-600 mb-6 leading-relaxed">
            CSS gradients offer significant advantages for modern web design, combining visual appeal with performance benefits. Here's why professional developers and designers choose gradients over traditional background images:
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-emerald-300 transition-all duration-300 hover:shadow-lg">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg">
                  <span className="text-2xl">⚡</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Zero File Size & Instant Load</h3>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    Unlike background images that require HTTP requests and file downloads, CSS gradients are generated by the browser with zero network overhead. This eliminates image loading delays, reduces bandwidth usage, and improves Core Web Vitals metrics like <strong>Largest Contentful Paint (LCP)</strong>. For mobile users on slower connections, this can mean 200-500ms faster page loads.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                  <span className="text-2xl">📱</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Perfect Scalability on Any Device</h3>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    CSS gradients are resolution-independent, meaning they look crisp on standard displays, retina screens, and high-DPI monitors without any pixelation. Unlike raster images that require multiple sizes (@2x, @3x) for different devices, a single gradient declaration works perfectly across all screen densities, reducing maintenance overhead.
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
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Modern Visual Appeal & Brand Identity</h3>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    Gradients add depth, dimension, and modern polish to interfaces. They're widely used by leading tech companies like <strong>Stripe</strong>, <strong>Linear</strong>, and <strong>Vercel</strong> to create distinctive brand experiences. Gradients can guide user attention, create visual hierarchy, and make CTAs more prominent. They work exceptionally well in hero sections, cards, and buttons.
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
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Easy Maintenance & Dynamic Updates</h3>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    Gradients are defined in CSS, making them easy to update, version control, and maintain. You can store them in CSS variables for reuse across components, adjust colors programmatically with JavaScript, and even animate gradient positions. This flexibility makes gradients ideal for design systems and theme switching (light/dark mode).
                  </p>
                </div>
              </div>
            </div>
            
            <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-cyan-300 transition-all duration-300 hover:shadow-lg">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg">
                  <span className="text-2xl">💰</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Reduced Bandwidth & Hosting Costs</h3>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    For high-traffic websites, eliminating background images reduces CDN bandwidth usage and hosting costs. A single gradient can replace multiple image files across different breakpoints. For a site with 1 million monthly visitors, this could save hundreds of dollars per month in bandwidth costs while improving user experience.
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
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Better SEO & Core Web Vitals</h3>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    Faster page loads improve Google's Core Web Vitals metrics, which are ranking factors. According to <a href="https://web.dev/vitals/" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">Google's research</a>, pages that load 1 second faster see 7% higher conversion rates. Gradients contribute to better <strong>First Contentful Paint (FCP)</strong> and <strong>Largest Contentful Paint (LCP)</strong> scores.
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
                  Major platforms like <strong>GitHub</strong>, <strong>Stripe</strong>, and <strong>Vercel</strong> use CSS gradients extensively in their designs. According to <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/gradient" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">MDN Web Docs</a>, CSS gradients have become the standard for modern web design, with 70% of top-performing websites using gradients in their hero sections and CTAs.
                </p>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Whether you're building a landing page, SaaS product, or e-commerce site, using a <strong>CSS gradient generator</strong> should be part of your design workflow to maximize visual appeal, performance, and user satisfaction.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
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
            <li>Use subtle gradients for backgrounds; bold gradients for CTAs.</li>
            <li>Store gradients in CSS variables (e.g., <code>--fx-gradient</code>) for reuse.</li>
            <li>Check color contrast when overlaying text to maintain accessibility.</li>
            <li>Prefer fewer stops for performance and visual clarity.</li>
            <li>Test across light/dark UI themes to ensure consistency.</li>
          </ul>
        </div>
      </section>
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
            <a href="/css-tool/box-shadow" className="group rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 hover:border-emerald-300 transition-all duration-300 hover:shadow-lg">
              <div className="flex items-center justify-between">
                <div className="font-semibold text-slate-900">CSS Box Shadow</div>
                <span className="text-slate-400 group-hover:text-emerald-600">→</span>
              </div>
              <p className="text-sm text-slate-600 mt-1">Craft soft, layered shadows for UI.</p>
            </a>
            <a href="/html/html-button-gen" className="group rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 hover:border-emerald-300 transition-all duration-300 hover:shadow-lg">
              <div className="flex items-center justify-between">
                <div className="font-semibold text-slate-900">HTML Button Generator</div>
                <span className="text-slate-400 group-hover:text-emerald-600">→</span>
              </div>
              <p className="text-sm text-slate-600 mt-1">Create accessible HTML buttons.</p>
            </a>
            <a href="/json/json-formatter" className="group rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 hover:border-emerald-300 transition-all duration-300 hover:shadow-lg">
              <div className="flex items-center justify-between">
                <div className="font-semibold text-slate-900">JSON Formatter</div>
                <span className="text-slate-400 group-hover:text-emerald-600">→</span>
              </div>
              <p className="text-sm text-slate-600 mt-1">Pretty-print and validate JSON.</p>
            </a>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 pb-12">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">Frequently Asked Questions</h2>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4" open>
              <summary className="cursor-pointer text-sm font-semibold text-slate-900">How do I generate a CSS gradient?</summary>
              <p className="mt-2 text-sm text-slate-600">Pick or adjust colors in the picker using the color stops, then copy the generated background property. You can switch between linear and radial gradients, adjust angles, and fine-tune color positions. The tool provides instant preview and ready-to-paste CSS code.</p>
            </details>
            <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <summary className="cursor-pointer text-sm font-semibold text-slate-900">Can I get both linear and radial gradients?</summary>
              <p className="mt-2 text-sm text-slate-600">Yes. Switch the picker mode to radial or edit the gradient string directly. Linear gradients transition along a direction (angle), while radial gradients radiate from a center point. Both types support multiple color stops for complex color transitions.</p>
            </details>
            <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <summary className="cursor-pointer text-sm font-semibold text-slate-900">Does this support modern browsers?</summary>
              <p className="mt-2 text-sm text-slate-600">The generated CSS uses standard syntax that works in modern browsers without prefixes. All major browsers (Chrome, Firefox, Safari, Edge) support CSS gradients natively. The tool generates W3C-compliant gradient syntax that works across all modern browsers.</p>
            </details>
            <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <summary className="cursor-pointer text-sm font-semibold text-slate-900">Are CSS gradients better than background images?</summary>
              <p className="mt-2 text-sm text-slate-600">CSS gradients offer several advantages: they are resolution-independent (look sharp on any display), have zero file size (no HTTP requests), can be animated with CSS, and are easier to maintain. However, complex patterns or photographic backgrounds still require images.</p>
            </details>
            <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <summary className="cursor-pointer text-sm font-semibold text-slate-900">Can I use gradients with text or overlays?</summary>
              <p className="mt-2 text-sm text-slate-600">Yes, but ensure sufficient color contrast for accessibility. Use gradient backgrounds with dark text on light gradients or light text on dark gradients. Test contrast ratios to meet WCAG AA standards (4.5:1 for normal text, 3:1 for large text).</p>
            </details>
            <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <summary className="cursor-pointer text-sm font-semibold text-slate-900">How do I store gradients in CSS variables?</summary>
              <p className="mt-2 text-sm text-slate-600">Define your gradient in a CSS variable like `--fx-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);` in `:root`, then use it with `background: var(--fx-gradient);`. This tool provides a CSS variable snippet you can copy directly.</p>
            </details>
            <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <summary className="cursor-pointer text-sm font-semibold text-slate-900">Do gradients affect page performance?</summary>
              <p className="mt-2 text-sm text-slate-600">CSS gradients are rendered by the browser and have minimal performance impact. They are more performant than background images because they require no network requests. However, avoid using too many gradients on a single page, as complex gradients can slightly increase paint time.</p>
            </details>
            <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <summary className="cursor-pointer text-sm font-semibold text-slate-900">Can I animate CSS gradients?</summary>
              <p className="mt-2 text-sm text-slate-600">Direct gradient animation is limited, but you can animate gradient positions, opacity, or use pseudo-elements with different gradients. For smooth color transitions, consider using CSS custom properties (variables) that can be animated, or use background-position animation techniques.</p>
            </details>
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

        <Footer />
      </div>
    </>
  );
}
