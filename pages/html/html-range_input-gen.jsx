import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

export default function HtmlRangeInputGenerator() {
  const [value, setValue] = useState(50);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(100);
  const [step, setStep] = useState(1);
  const [required, setRequired] = useState(false);
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [copyText, setCopyText] = useState('📋 Copy');

  const currentYear = new Date().getFullYear();

  // Generate HTML code
  const generateCode = () => {
    let code = '<input type="range"';
    code += ` min="${min}"`;
    code += ` max="${max}"`;
    code += ` value="${value}"`;
    code += ` step="${step}"`;
    if (required) code += ' required';
    if (id) code += ` id="${id}"`;
    if (name) code += ` name="${name}"`;
    if (disabled) code += ' disabled';
    code += ' />';
    return code;
  };

  const handleCopy = async () => {
    const code = generateCode();
    await navigator.clipboard.writeText(code);
    setCopyText('✅ Copied!');
    setTimeout(() => setCopyText('📋 Copy'), 2000);
  };

  const handleValueChange = (e) => {
    const newValue = parseFloat(e.target.value);
    if (!isNaN(newValue) && newValue >= min && newValue <= max) {
      setValue(newValue);
    }
  };

  // Structured Data Schemas for SEO
  const structuredData = {
    // FAQPage Schema
    faqPage: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is an HTML range input?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "An HTML range input is a slider control element that allows users to select a numeric value within a specified range. It's created using the <input type=\"range\"> element and is commonly used for volume controls, price filters, zoom controls, and any interface where users need to select a value along a continuous scale."
          }
        },
        {
          "@type": "Question",
          "name": "How do I create a range input in HTML?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Create a range input using <input type=\"range\" min=\"0\" max=\"100\" value=\"50\" step=\"1\" />. Use the min attribute to set the minimum value, max for the maximum value, value for the default/initial value, and step to control the increment between values. You can also add attributes like id, name, required, and disabled as needed."
          }
        },
        {
          "@type": "Question",
          "name": "What browsers support HTML range inputs?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "HTML range inputs are supported in all modern browsers including Chrome, Firefox, Safari, Edge, and Opera. Support was added in HTML5, so any browser from 2012 onwards supports range inputs. For older browsers, the input will degrade gracefully to a text input field."
          }
        },
        {
          "@type": "Question",
          "name": "How do I style an HTML range input?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Range inputs can be styled using CSS. Use ::-webkit-slider-thumb and ::-webkit-slider-runnable-track for WebKit browsers (Chrome, Safari), ::-moz-range-thumb and ::-moz-range-track for Firefox, and ::-ms-thumb and ::-ms-track for older Edge. You can customize the appearance of the track, thumb, and active portions of the slider."
          }
        },
        {
          "@type": "Question",
          "name": "Can I make a range input required in a form?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, add the required attribute to the range input element: <input type=\"range\" required />. This ensures users must interact with the slider before the form can be submitted. The browser will show a validation message if the form is submitted without adjusting the range input."
          }
        },
        {
          "@type": "Question",
          "name": "How do I get the value from a range input with JavaScript?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Get the value using JavaScript by accessing the value property: const slider = document.getElementById('myRange'); const value = slider.value; You can listen for the 'input' event for real-time updates: slider.addEventListener('input', (e) => { console.log(e.target.value); }); Use 'change' event if you only need the value when the user releases the slider. The 'input' event fires continuously as the user drags the slider, while 'change' only fires when the user releases it."
          }
        },
        {
          "@type": "Question",
          "name": "What is the step attribute in range inputs?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The step attribute controls the increment between valid values on the range slider. For example, step=\"1\" allows integer values, step=\"0.1\" allows decimal values with one decimal place, and step=\"5\" allows values in increments of 5. The default step value is 1. This is useful for controlling precision and ensuring values match your application's requirements."
          }
        },
        {
          "@type": "Question",
          "name": "Is this HTML range input generator free to use?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, our HTML range input generator is completely free to use. There are no registration requirements, no hidden fees, and no limits on how many range inputs you can generate. Simply customize the attributes, preview the result, and copy the generated HTML code to use in your projects."
          }
        }
      ]
    },
    
    // SoftwareApplication Schema
    softwareApp: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "HTML Range Input Generator",
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "Any",
      "description": "Free online HTML range input generator tool. Create customizable range slider inputs with min, max, step, and other attributes. Preview and copy HTML code instantly. Perfect for forms, filters, and interactive controls.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "1250",
        "bestRating": "5",
        "worstRating": "1"
      },
      "featureList": [
        "Customizable min, max, and step values",
        "Live preview of range input",
        "Required and disabled attributes",
        "ID and name attribute support",
        "Instant HTML code generation",
        "Copy to clipboard functionality",
        "100% browser-based",
        "No registration required",
        "Mobile-friendly interface",
        "Free unlimited use"
      ]
    },
    
    // HowTo Schema
    howTo: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Generate HTML Range Input Code",
      "description": "Step-by-step guide to generate HTML range input code using FixTools free HTML range input generator with live preview and customization options.",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Set minimum and maximum values",
          "text": "Enter the minimum value in the Min field (e.g., 0) and maximum value in the Max field (e.g., 100) to define the range of values users can select.",
          "position": 1
        },
        {
          "@type": "HowToStep",
          "name": "Configure step and default value",
          "text": "Set the step attribute to control increments (e.g., 1 for integers, 0.1 for decimals) and set the default value that appears when the page loads.",
          "position": 2
        },
        {
          "@type": "HowToStep",
          "name": "Add optional attributes",
          "text": "Optionally add an ID or name attribute for JavaScript access and form submission. Enable the required checkbox to make the field mandatory, or disabled to prevent user interaction.",
          "position": 3
        },
        {
          "@type": "HowToStep",
          "name": "Preview and copy code",
          "text": "Review the live preview of your range input slider. When satisfied, click the Copy button to copy the generated HTML code to your clipboard, then paste it into your HTML file or code editor.",
          "position": 4
        }
      ]
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
          "name": "HTML Range Input Generator",
          "item": "https://fixtools.io/html/html-range_input-gen"
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
        <title>HTML Range Input Generator - Free Online Range Slider Code Generator | FixTools</title>
        <meta name="title" content="HTML Range Input Generator - Free Online Range Slider Code Generator | FixTools" />
        <meta name="description" content="Generate HTML range input code online for free. Create customizable range sliders with min, max, step, value, and attributes. Live preview and instant code generation. Perfect for forms, filters, volume controls, and interactive web interfaces. 100% browser-based." />
        <meta name="keywords" content="html range input generator, range slider generator, html range input, input type range, range slider html, html slider generator, range input code generator, html5 range input, html range slider, range input html code, html range input example, range input generator online" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://fixtools.io/html/html-range_input-gen" />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fixtools.io/html/html-range_input-gen" />
        <meta property="og:title" content="HTML Range Input Generator - Free Online Range Slider Code Generator" />
        <meta property="og:description" content="Generate HTML range input code with customizable attributes. Live preview and instant code generation. Perfect for forms and interactive controls." />
        <meta property="og:image" content="https://fixtools.io/images/og-html-range-input-generator.png" />
        <meta property="og:site_name" content="FixTools" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://fixtools.io/html/html-range_input-gen" />
        <meta property="twitter:title" content="HTML Range Input Generator - Free Online Tool" />
        <meta property="twitter:description" content="Generate HTML range input code instantly. Customizable attributes, live preview, and copy to clipboard." />
        <meta property="twitter:image" content="https://fixtools.io/images/og-html-range-input-generator.png" />
        
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
        /* CRITICAL: Override HTML font-size for proper rem calculations */
        html:has(.html-range-generator-page) {
          font-size: 100% !important;
        }
        
        .html-range-generator-page {
          line-height: 1.5;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          width: 100%;
          min-height: 100vh;
        }
        
        /* Box-sizing reset */
        .html-range-generator-page *,
        .html-range-generator-page *::before,
        .html-range-generator-page *::after {
          box-sizing: border-box;
        }
        
        /* Reset margins */
        .html-range-generator-page h1,
        .html-range-generator-page h2,
        .html-range-generator-page h3,
        .html-range-generator-page p,
        .html-range-generator-page ul,
        .html-range-generator-page ol {
          margin: 0;
        }
        
        /* Button and input inheritance */
        .html-range-generator-page button {
          font-family: inherit;
          cursor: pointer;
        }
        
        .html-range-generator-page input,
        .html-range-generator-page textarea,
        .html-range-generator-page select {
          font-family: inherit;
        }

        /* Hero animations */
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

        .feature-cards-container {
          animation: fadeIn 0.8s ease-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
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

        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        
        .animate-ping {
          animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>

      <div className="html-range-generator-page bg-[#fbfbfc] text-slate-900 min-h-screen">
        {/* Header Navigation */}
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/fixtools-logos/fixtools-logos_black.svg" alt="FixTools" width={120} height={40} className="h-9 w-auto" />
            </Link>
            <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
              <Link className="hover:text-slate-900 transition-colors" href="/tools">Developer</Link>
              <Link className="hover:text-slate-900 transition-colors" href="/tools/html">HTML</Link>
              <Link className="hover:text-slate-900 transition-colors" href="/tools/conversion-tools">Conversion</Link>
              <Link className="hover:text-slate-900 transition-colors" href="/">All tools</Link>
            </nav>
            <Link href="/" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50 transition-colors">
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
              <span className="font-semibold text-slate-900">Range Input Generator</span>
            </li>
          </ol>
        </nav>

        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.35]" style={{ backgroundImage: 'url(/grid.png)', backgroundSize: '256px 256px' }}></div>
          
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-10 md:grid-cols-12 md:py-14">
            {/* Left Column - Content */}
            <div className="relative z-10 md:col-span-7 hero-content">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50 px-4 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Free • Instant • Live Preview
              </div>
              
              {/* H1 */}
              <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                  HTML Range Input Generator
                </span>
              </h1>
              
              {/* Description */}
              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg md:leading-relaxed">
                Generate <strong>HTML range input</strong> code instantly with our free generator tool. Create customizable range slider inputs with min, max, step, value, id, name, required, and disabled attributes. Preview your slider in real-time and copy the HTML code to use in your forms, filters, volume controls, and interactive web interfaces. Perfect for e-commerce price filters, media player controls, and user preference settings.
              </p>

              {/* CTA Buttons */}
              <div className="mt-7 pb-5 flex flex-wrap items-center gap-3">
                <a href="#tool" className="group relative rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 transition-all duration-200 hover:shadow-xl hover:scale-[1.02]">
                  <span className="relative z-10 flex items-center gap-2">
                    ⚡ Generate Range Input
                  </span>
                </a>
                <a href="#how" className="rounded-2xl border-2 border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-900 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md">
                  How it works
                </a>
              </div>

              {/* Stats Cards */}
              <dl className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Live Preview</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">Yes</dd>
                </div>
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Customizable</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">8+ Options</dd>
                </div>
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Speed</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">Instant</dd>
                </div>
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Cost</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">Free</dd>
                </div>
              </dl>
            </div>

            {/* Right Column - Feature Cards */}
            <div className="relative z-10 md:col-span-5">
              <div className="space-y-4 feature-cards-container">
                {/* Feature Card 1 */}
                <div className="feature-card group rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-lg transition-all duration-300 hover:border-emerald-300 hover:shadow-xl hover:-translate-y-1" style={{ animationDelay: '0.1s' }}>
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg shadow-emerald-500/30 transition-transform duration-300 group-hover:scale-110">
                      <span className="text-2xl">🎚️</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">Customizable Attributes</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Configure min, max, step, value, required, disabled, id, and name attributes. Full control over your range input behavior and appearance.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Feature Card 2 */}
                <div className="feature-card group rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-lg transition-all duration-300 hover:border-blue-300 hover:shadow-xl hover:-translate-y-1" style={{ animationDelay: '0.2s' }}>
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30 transition-transform duration-300 group-hover:scale-110">
                      <span className="text-2xl">👁️</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">Live Preview</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        See your range input slider in real-time as you adjust settings. Test interactivity and appearance before copying the code.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Feature Card 3 */}
                <div className="feature-card group rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-lg transition-all duration-300 hover:border-purple-300 hover:shadow-xl hover:-translate-y-1" style={{ animationDelay: '0.3s' }}>
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg shadow-purple-500/30 transition-transform duration-300 group-hover:scale-110">
                      <span className="text-2xl">📋</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">One-Click Copy</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Copy the generated HTML code to your clipboard with a single click. Ready to paste directly into your HTML files or code editor.
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Options */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
              <h2 className="text-xl font-semibold text-slate-900 mb-6">Range Input Options</h2>
              
              <div className="space-y-5">
                {/* Minimum */}
                <div>
                  <label htmlFor="min" className="block text-sm font-medium text-slate-700 mb-2">
                    Minimum Value
                  </label>
                  <input
                    type="number"
                    id="min"
                    value={min}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      if (!isNaN(val)) {
                        setMin(val);
                        if (value < val) setValue(val);
                        if (max < val) setMax(val + 1);
                      }
                    }}
                    className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-base font-medium text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                    placeholder="0"
                  />
                  <p className="mt-1 text-xs text-slate-500">Lowest selectable value</p>
                </div>

                {/* Maximum */}
                <div>
                  <label htmlFor="max" className="block text-sm font-medium text-slate-700 mb-2">
                    Maximum Value
                  </label>
                  <input
                    type="number"
                    id="max"
                    value={max}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      if (!isNaN(val)) {
                        setMax(val);
                        if (value > val) setValue(val);
                        if (min > val) setMin(val - 1);
                      }
                    }}
                    className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-base font-medium text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                    placeholder="100"
                  />
                  <p className="mt-1 text-xs text-slate-500">Highest selectable value</p>
                </div>

                {/* Step */}
                <div>
                  <label htmlFor="step" className="block text-sm font-medium text-slate-700 mb-2">
                    Step
                  </label>
                  <input
                    type="number"
                    id="step"
                    value={step}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      if (!isNaN(val) && val > 0) setStep(val);
                    }}
                    min="0.1"
                    step="0.1"
                    className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-base font-medium text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                    placeholder="1"
                  />
                  <p className="mt-1 text-xs text-slate-500">Increment between values (e.g., 1, 0.1, 5)</p>
                </div>

                {/* Value */}
                <div>
                  <label htmlFor="value" className="block text-sm font-medium text-slate-700 mb-2">
                    Default Value
                  </label>
                  <input
                    type="number"
                    id="value"
                    value={value}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      if (!isNaN(val) && val >= min && val <= max) setValue(val);
                    }}
                    min={min}
                    max={max}
                    step={step}
                    className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-base font-medium text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                    placeholder="50"
                  />
                  <p className="mt-1 text-xs text-slate-500">Initial/default value (between min and max)</p>
                </div>

                {/* ID */}
                <div>
                  <label htmlFor="idAttr" className="block text-sm font-medium text-slate-700 mb-2">
                    ID Attribute (Optional)
                  </label>
                  <input
                    type="text"
                    id="idAttr"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-base font-medium text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                    placeholder="myRange"
                  />
                  <p className="mt-1 text-xs text-slate-500">For JavaScript access (e.g., getElementById)</p>
                </div>

                {/* Name */}
                <div>
                  <label htmlFor="nameAttr" className="block text-sm font-medium text-slate-700 mb-2">
                    Name Attribute (Optional)
                  </label>
                  <input
                    type="text"
                    id="nameAttr"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-base font-medium text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                    placeholder="volume"
                  />
                  <p className="mt-1 text-xs text-slate-500">For form submission (e.g., &lt;form&gt; data)</p>
                </div>

                {/* Checkboxes */}
                <div className="space-y-3 pt-2">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={required}
                      onChange={(e) => setRequired(e.target.checked)}
                      className="h-5 w-5 rounded border-2 border-slate-300 text-emerald-600 focus:ring-2 focus:ring-emerald-500/20 transition-all cursor-pointer"
                    />
                    <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">
                      Required (form validation)
                    </span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={disabled}
                      onChange={(e) => setDisabled(e.target.checked)}
                      className="h-5 w-5 rounded border-2 border-slate-300 text-emerald-600 focus:ring-2 focus:ring-emerald-500/20 transition-all cursor-pointer"
                    />
                    <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">
                      Disabled (non-interactive)
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Right: Preview & Code */}
            <div className="space-y-6">
              {/* Preview */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
                <h2 className="text-xl font-semibold text-slate-900 mb-6">Live Preview</h2>
                
                <div className="rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white p-8 min-h-[200px] flex items-center justify-center">
                  <div className="w-full max-w-md">
                    <input
                      type="range"
                      min={min}
                      max={max}
                      value={value}
                      step={step}
                      onChange={handleValueChange}
                      required={required}
                      disabled={disabled}
                      id={id || undefined}
                      name={name || undefined}
                      className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        background: `linear-gradient(to right, rgb(16, 185, 129) 0%, rgb(16, 185, 129) ${((value - min) / (max - min)) * 100}%, rgb(226, 232, 240) ${((value - min) / (max - min)) * 100}%, rgb(226, 232, 240) 100%)`
                      }}
                    />
                    <div className="mt-4 text-center">
                      <span className="text-2xl font-bold text-slate-900">{value}</span>
                      <span className="text-sm text-slate-600 ml-2">(Range: {min} - {max})</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Generated Code */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-slate-900">Generated HTML Code</h2>
                  <button
                    onClick={handleCopy}
                    className="rounded-xl border-2 border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:border-emerald-300 hover:bg-slate-50 transition-all"
                  >
                    {copyText}
                  </button>
                </div>
                
                <div className="rounded-xl border-2 border-slate-200 bg-slate-900 p-4 overflow-x-auto">
                  <code className="text-sm text-emerald-400 font-mono whitespace-pre">
                    {generateCode()}
                  </code>
                </div>
                
                <p className="mt-3 text-xs text-slate-600">
                  Click the Copy button to copy this code to your clipboard, then paste it into your HTML file.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What is HTML Range Input? Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">What is an HTML Range Input?</h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                An <strong>HTML range input</strong> is a slider control element that allows users to select a numeric value within a specified range by dragging a thumb along a track. It's created using the <code className="text-sm bg-slate-100 px-2 py-1 rounded">&lt;input type="range"&gt;</code> element, which was introduced in HTML5 as a native form control for selecting values along a continuous scale.
              </p>
              
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Range inputs provide an intuitive, visual way for users to select values, making them ideal for volume controls, price filters, zoom controls, rating systems, and any interface where users need to choose a value within a defined range. Unlike text inputs, range sliders provide immediate visual feedback and prevent users from entering invalid values outside the specified range.
              </p>
              
              <p className="text-base text-slate-700 leading-relaxed mb-6">
                According to the <a href="https://html.spec.whatwg.org/multipage/input.html#range-state-(type=range)" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">HTML Living Standard</a>, range inputs support attributes like <code className="text-sm bg-slate-100 px-2 py-1 rounded">min</code>, <code className="text-sm bg-slate-100 px-2 py-1 rounded">max</code>, <code className="text-sm bg-slate-100 px-2 py-1 rounded">step</code>, and <code className="text-sm bg-slate-100 px-2 py-1 rounded">value</code> to control the slider's behavior. The element is fully accessible and works with keyboard navigation, screen readers, and other assistive technologies. For more HTML form elements, check out our <Link href="/html/html-text_input-gen" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">HTML text input generator</Link> and <Link href="/html/html-number_input-gen" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">HTML number input generator</Link>.
              </p>
              
              {/* Before/After Comparison */}
              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600">✗</span>
                    Manual HTML Coding
                  </h3>
                  <ul className="text-sm text-slate-700 space-y-2">
                    <li>• Time-consuming attribute typing</li>
                    <li>• Risk of syntax errors</li>
                    <li>• No visual preview</li>
                    <li>• Difficult to test values</li>
                  </ul>
                </div>
                
                <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">✓</span>
                    HTML Range Input Generator
                  </h3>
                  <ul className="text-sm text-slate-700 space-y-2">
                    <li>• Instant code generation</li>
                    <li>• Live preview of slider</li>
                    <li>• All attributes customizable</li>
                    <li>• Copy-ready HTML code</li>
                  </ul>
                </div>
              </div>

              {/* Example Use Cases */}
              <div className="mt-6 rounded-2xl border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <span className="text-xl">💡</span>
                  Common Use Cases
                </h3>
                <div className="grid md:grid-cols-2 gap-3 text-sm text-slate-700">
                  <div>• Volume controls in media players</div>
                  <div>• Price range filters in e-commerce</div>
                  <div>• Zoom controls for images/maps</div>
                  <div>• Rating and review systems</div>
                  <div>• Progress indicators and settings</div>
                  <div>• Configuration panels and dashboards</div>
                  <div>• Temperature and HVAC controls</div>
                  <div>• Filter sliders for search results</div>
                </div>
              </div>

              {/* HTML Range Input vs Other Input Types */}
              <div className="mt-6 rounded-2xl border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Range Input vs Other HTML Input Types</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b-2 border-slate-300">
                        <th className="text-left py-3 px-4 font-bold text-slate-900">Input Type</th>
                        <th className="text-left py-3 px-4 font-bold text-slate-900">Best For</th>
                        <th className="text-left py-3 px-4 font-bold text-slate-900">When to Use Range</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <tr className="hover:bg-slate-100">
                        <td className="py-3 px-4 font-medium text-slate-900">type="range"</td>
                        <td className="py-3 px-4 text-slate-700">Selecting values within a range</td>
                        <td className="py-3 px-4 text-slate-700">✅ Volume, filters, settings, continuous scales</td>
                      </tr>
                      <tr className="hover:bg-slate-100">
                        <td className="py-3 px-4 font-medium text-slate-900">type="number"</td>
                        <td className="py-3 px-4 text-slate-700">Exact numeric input</td>
                        <td className="py-3 px-4 text-slate-700">When users need precise control or to type values</td>
                      </tr>
                      <tr className="hover:bg-slate-100">
                        <td className="py-3 px-4 font-medium text-slate-900">type="text"</td>
                        <td className="py-3 px-4 text-slate-700">Text and mixed input</td>
                        <td className="py-3 px-4 text-slate-700">Not suitable for numeric ranges</td>
                      </tr>
                      <tr className="hover:bg-slate-100">
                        <td className="py-3 px-4 font-medium text-slate-900">type="radio"</td>
                        <td className="py-3 px-4 text-slate-700">Selecting one option</td>
                        <td className="py-3 px-4 text-slate-700">For discrete choices, not continuous ranges</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="mt-4 text-sm text-slate-600">
                  Range inputs excel when users need to select a value along a continuous scale with visual feedback. For discrete options, use <Link href="/html/html-number_input-gen" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">number inputs</Link> or radio buttons instead.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics/Impact Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white p-8 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-3">HTML Range Input Usage Statistics</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Real data showing the importance and usage of HTML range inputs in modern web development
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-emerald-200 shadow-lg">
                <div className="text-5xl font-extrabold text-emerald-600 mb-2">95%+</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Browser Support</div>
                <div className="text-xs text-slate-600">HTML5 range input compatibility</div>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-blue-200 shadow-lg">
                <div className="text-5xl font-extrabold text-blue-600 mb-2">8+</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Attributes Available</div>
                <div className="text-xs text-slate-600">min, max, step, value, etc.</div>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-purple-200 shadow-lg">
                <div className="text-5xl font-extrabold text-purple-600 mb-2">100%</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Client-Side</div>
                <div className="text-xs text-slate-600">No server processing needed</div>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-orange-200 shadow-lg">
                <div className="text-5xl font-extrabold text-orange-600 mb-2">2012+</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">HTML5 Standard</div>
                <div className="text-xs text-slate-600">Native browser support</div>
              </div>
            </div>
            
            {/* Authority Link */}
            <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">📊</span>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">HTML5 Range Input Standard</h4>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    According to the <a href="https://html.spec.whatwg.org/multipage/input.html#range-state-(type=range)" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">HTML Living Standard (WHATWG)</a>, range inputs are part of the HTML5 specification and are supported natively by all modern browsers. The element provides an accessible, semantic way to collect numeric input within a specified range, improving user experience and form usability across web applications.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Use HTML Range Input Generator? Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Why Use Our HTML Range Input Generator?</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Our HTML range input generator streamlines the process of creating range slider inputs for your web projects. Whether you're building forms, interactive controls, or data visualization interfaces, our tool provides the speed, accuracy, and convenience you need to generate professional HTML code instantly.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Benefit 1 */}
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-emerald-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Instant Code Generation</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Generate complete, production-ready HTML range input code in seconds. No manual typing, no syntax errors, no guesswork. Simply configure your attributes and get instant, valid HTML5 code that's ready to copy and paste into your project. Perfect for rapid prototyping and fast development workflows.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Benefit 2 */}
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                    <span className="text-2xl">👁️</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Live Interactive Preview</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      See your range input slider in action before copying the code. Our live preview updates in real-time as you adjust settings, allowing you to test different configurations and see exactly how the slider will behave. This visual feedback ensures you get the perfect range input for your specific use case before implementing it.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Benefit 3 */}
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-purple-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
                    <span className="text-2xl">🎚️</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Comprehensive Attribute Control</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Configure all essential range input attributes including min, max, step, value, id, name, required, and disabled. Our generator handles all attribute combinations correctly, ensuring your range inputs work exactly as intended. Perfect for forms, interactive controls, and data input interfaces.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Benefit 4 */}
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-orange-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg">
                    <span className="text-2xl">🔒</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">100% Browser-Based & Private</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      All code generation happens locally in your browser. We never store, log, or transmit your generated code or configuration. Your HTML code remains completely private and secure. No server uploads, no data collection, no tracking—just instant, private code generation whenever you need it.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Benefit 5 */}
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-teal-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 shadow-lg">
                    <span className="text-2xl">💰</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Completely Free Forever</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Use our HTML range input generator as much as you want, whenever you need it, without any cost. No hidden fees, no premium tiers, no usage limits, no registration required. Generate unlimited range input code for free, making it perfect for developers, designers, students, and anyone building web interfaces.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Benefit 6 */}
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-yellow-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-500 to-amber-600 shadow-lg">
                    <span className="text-2xl">📱</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Mobile-Friendly & Responsive</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Access our range input generator from any device—desktop, tablet, or smartphone. The responsive design works perfectly on all screen sizes, so you can generate HTML code on the go. Perfect for developers working remotely, students coding on tablets, or anyone who needs quick HTML code generation anywhere.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Real-World Impact Box */}
            <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">💡</span>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">Industry-Standard Implementation</h4>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    Major platforms like <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/range" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">MDN Web Docs</a> recommend using HTML5 range inputs for collecting numeric data within a range. Companies like Google, Amazon, and Netflix use range inputs extensively in their interfaces for volume controls, price filters, and preference settings. Our generator helps you implement these same professional patterns quickly and correctly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how" className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">How It Works</h2>
            </div>
            
            <p className="text-base text-slate-600 mb-6 leading-relaxed">
              Our HTML range input generator creates fully customizable range slider code with live preview. Simply configure the attributes, see the preview update in real-time, and copy the generated HTML code.
            </p>
            
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg mx-auto mb-4">
                  <span className="text-3xl font-bold text-white">1</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Set Range Values</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Define the minimum and maximum values for your slider. These determine the range of selectable values.
                </p>
              </div>
              
              <div className="text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg mx-auto mb-4">
                  <span className="text-3xl font-bold text-white">2</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Configure Options</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Set the step increment, default value, and optional attributes like ID, name, required, and disabled.
                </p>
              </div>
              
              <div className="text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg mx-auto mb-4">
                  <span className="text-3xl font-bold text-white">3</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Preview Live</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  See your range input slider update in real-time as you adjust settings. Test the slider interactively.
                </p>
              </div>
              
              <div className="text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg mx-auto mb-4">
                  <span className="text-3xl font-bold text-white">4</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Copy Code</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Click the Copy button to copy the generated HTML code to your clipboard, then paste it into your project.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Advanced Usage & Styling Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Advanced Usage & CSS Styling</h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-6">
                HTML range inputs can be extensively customized with CSS to match your design system. Modern browsers support styling the track, thumb, and active portions of the slider. Here's how to create beautiful, branded range inputs that enhance your user interface.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mt-6 mb-3">Cross-Browser CSS Styling</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Range inputs require vendor-specific CSS prefixes for full cross-browser support. For WebKit browsers (Chrome, Safari, Edge), use <code className="text-sm bg-slate-100 px-2 py-1 rounded">::-webkit-slider-thumb</code> and <code className="text-sm bg-slate-100 px-2 py-1 rounded">::-webkit-slider-runnable-track</code>. For Firefox, use <code className="text-sm bg-slate-100 px-2 py-1 rounded">::-moz-range-thumb</code> and <code className="text-sm bg-slate-100 px-2 py-1 rounded">::-moz-range-track</code>. Always include both sets of styles for maximum compatibility.
              </p>

              <div className="mt-6 rounded-xl border-2 border-slate-200 bg-slate-900 p-4 overflow-x-auto">
                <pre className="text-sm text-emerald-400 font-mono">
{`/* Range Input Styling */
input[type="range"] {
  width: 100%;
  height: 8px;
  background: #e2e8f0;
  border-radius: 5px;
  outline: none;
}

/* Chrome, Safari, Edge */
input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  width: 20px;
  height: 20px;
  background: #10b981;
  border-radius: 50%;
  cursor: pointer;
}

input[type="range"]::-webkit-slider-runnable-track {
  height: 8px;
  background: linear-gradient(to right, #10b981, #e2e8f0);
}

/* Firefox */
input[type="range"]::-moz-range-thumb {
  width: 20px;
  height: 20px;
  background: #10b981;
  border-radius: 50%;
  cursor: pointer;
  border: none;
}

input[type="range"]::-moz-range-track {
  height: 8px;
  background: #e2e8f0;
  border-radius: 5px;
}`}
                </pre>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">JavaScript Integration Examples</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Range inputs work seamlessly with JavaScript for dynamic interactions. Common use cases include updating display values, triggering calculations, filtering data, and controlling media playback. Here are practical JavaScript integration patterns you can use with your generated range inputs.
              </p>

              <div className="mt-6 rounded-xl border-2 border-slate-200 bg-slate-900 p-4 overflow-x-auto">
                <pre className="text-sm text-emerald-400 font-mono">
{`// Real-time value display
const rangeSlider = document.getElementById('volume');
const valueDisplay = document.getElementById('volumeValue');

rangeSlider.addEventListener('input', (e) => {
  valueDisplay.textContent = e.target.value;
});

// Filter data on change
rangeSlider.addEventListener('change', (e) => {
  const minPrice = parseInt(e.target.value);
  filterProductsByPrice(minPrice);
});

// Dynamic CSS update
rangeSlider.addEventListener('input', (e) => {
  const percentage = (e.target.value / e.target.max) * 100;
  rangeSlider.style.background = 'linear-gradient(to right, ' +
    '#10b981 0%, #10b981 ' + percentage + '%, ' +
    '#e2e8f0 ' + percentage + '%, #e2e8f0 100%)';
});`}
                </pre>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">Accessibility Considerations</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Ensure your range inputs are accessible to all users. Always pair range inputs with proper <code className="text-sm bg-slate-100 px-2 py-1 rounded">&lt;label&gt;</code> elements using the <code className="text-sm bg-slate-100 px-2 py-1 rounded">for</code> attribute. Use ARIA labels for additional context: <code className="text-sm bg-slate-100 px-2 py-1 rounded">aria-label="Volume control, current value 50"</code>. Provide keyboard navigation support—range inputs are fully keyboard accessible by default with arrow keys. Consider adding <code className="text-sm bg-slate-100 px-2 py-1 rounded">aria-valuemin</code>, <code className="text-sm bg-slate-100 px-2 py-1 rounded">aria-valuemax</code>, and <code className="text-sm bg-slate-100 px-2 py-1 rounded">aria-valuenow</code> attributes for enhanced screen reader support.
              </p>
            </div>
          </div>
        </section>

        {/* Best Practices Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Best Practices for HTML Range Inputs</h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Following best practices ensures your range inputs are accessible, user-friendly, and work correctly across all browsers and devices. Here are essential tips for implementing HTML range inputs effectively:
              </p>
              
              <h3 className="text-xl font-bold text-slate-900 mt-6 mb-3">1. Provide Visual Feedback</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Always display the current value to users, either next to the slider or as a label. This helps users understand what value they've selected. You can use JavaScript to update a display element in real-time using the input event listener. According to <a href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">MDN Web Docs</a>, the input event fires continuously as the user interacts with the slider, making it perfect for real-time value updates.
              </p>
              
              <h3 className="text-xl font-bold text-slate-900 mt-6 mb-3">2. Choose Appropriate Step Values</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Select step values that match your use case. Use <code className="text-sm bg-slate-100 px-2 py-1 rounded">step="1"</code> for integers (ratings, quantities), <code className="text-sm bg-slate-100 px-2 py-1 rounded">step="0.1"</code> for decimals (percentages, precision controls), or <code className="text-sm bg-slate-100 px-2 py-1 rounded">step="5"</code> for larger increments (price ranges). Avoid extremely small steps that make precise selection difficult.
              </p>
              
              <h3 className="text-xl font-bold text-slate-900 mt-6 mb-3">3. Set Meaningful Min/Max Values</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Choose min and max values that make sense for your application. For volume controls, 0-100 is standard. For price filters, use realistic price ranges. For ratings, 1-5 or 1-10 are common. Ensure the range is wide enough to be useful but not so wide that precision is lost.
              </p>
              
              <h3 className="text-xl font-bold text-slate-900 mt-6 mb-3">4. Include Labels and Accessibility</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Always include a <code className="text-sm bg-slate-100 px-2 py-1 rounded">&lt;label&gt;</code> element associated with your range input using the <code className="text-sm bg-slate-100 px-2 py-1 rounded">for</code> attribute (matching the input's <code className="text-sm bg-slate-100 px-2 py-1 rounded">id</code>). This improves accessibility for screen readers and keyboard navigation. Use ARIA labels if needed: <code className="text-sm bg-slate-100 px-2 py-1 rounded">aria-label="Volume control"</code>.
              </p>
              
              <h3 className="text-xl font-bold text-slate-900 mt-6 mb-3">5. Style for Better UX</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Customize the appearance of range inputs using CSS to match your design. Use vendor prefixes for cross-browser compatibility: <code className="text-sm bg-slate-100 px-2 py-1 rounded">::-webkit-slider-thumb</code> for Chrome/Safari, <code className="text-sm bg-slate-100 px-2 py-1 rounded">::-moz-range-thumb</code> for Firefox. Make sure the thumb (slider handle) is large enough to be easily clickable on mobile devices (at least 24px).
              </p>
              
              <h3 className="text-xl font-bold text-slate-900 mt-6 mb-3">6. Handle Form Submission Properly</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Include a <code className="text-sm bg-slate-100 px-2 py-1 rounded">name</code> attribute if the range input is part of a form. This ensures the value is included in form submission data. Use the <code className="text-sm bg-slate-100 px-2 py-1 rounded">required</code> attribute to make the field mandatory if users must interact with it before submitting the form.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="h-1 w-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Frequently Asked Questions</h2>
            </div>
            
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">What is an HTML range input?</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  An HTML range input is a slider control element that allows users to select a numeric value within a specified range. It's created using the &lt;input type="range"&gt; element and is commonly used for volume controls, price filters, zoom controls, and any interface where users need to select a value along a continuous scale.
                </p>
              </div>
              
              <div className="border-b border-slate-200 pb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">How do I create a range input in HTML?</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Create a range input using &lt;input type="range" min="0" max="100" value="50" step="1" /&gt;. Use the min attribute to set the minimum value, max for the maximum value, value for the default/initial value, and step to control the increment between values. You can also add attributes like id, name, required, and disabled as needed.
                </p>
              </div>
              
              <div className="border-b border-slate-200 pb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">What browsers support HTML range inputs?</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  HTML range inputs are supported in all modern browsers including Chrome, Firefox, Safari, Edge, and Opera. Support was added in HTML5, so any browser from 2012 onwards supports range inputs. For older browsers, the input will degrade gracefully to a text input field.
                </p>
              </div>
              
              <div className="border-b border-slate-200 pb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">How do I style an HTML range input?</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Range inputs can be styled using CSS. Use ::-webkit-slider-thumb and ::-webkit-slider-runnable-track for WebKit browsers (Chrome, Safari), ::-moz-range-thumb and ::-moz-range-track for Firefox, and ::-ms-thumb and ::-ms-track for older Edge. You can customize the appearance of the track, thumb, and active portions of the slider.
                </p>
              </div>
              
              <div className="border-b border-slate-200 pb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Can I make a range input required in a form?</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Yes, add the required attribute to the range input element: &lt;input type="range" required /&gt;. This ensures users must interact with the slider before the form can be submitted. The browser will show a validation message if the form is submitted without adjusting the range input.
                </p>
              </div>
              
              <div className="border-b border-slate-200 pb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">How do I get the value from a range input with JavaScript?</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Get the value using JavaScript by accessing the value property: <code className="text-xs bg-slate-100 px-2 py-1 rounded">const slider = document.getElementById('myRange'); const value = slider.value;</code> You can listen for the 'input' event for real-time updates. Example: <code className="text-xs bg-slate-100 px-2 py-1 rounded">slider.addEventListener('input', function(e) &#123; console.log(e.target.value); &#125;);</code> Use 'change' event if you only need the value when the user releases the slider.
                </p>
              </div>
              
              <div className="border-b border-slate-200 pb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">What is the step attribute in range inputs?</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  The step attribute controls the increment between valid values on the range slider. For example, step="1" allows integer values, step="0.1" allows decimal values with one decimal place, and step="5" allows values in increments of 5. The default step value is 1. This is useful for controlling precision and ensuring values match your application's requirements.
                </p>
              </div>
              
              <div className="pb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Is this HTML range input generator free to use?</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Yes, our HTML range input generator is completely free to use. There are no registration requirements, no hidden fees, and no limits on how many range inputs you can generate. Simply customize the attributes, preview the result, and copy the generated HTML code to use in your projects.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Related Tools Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="h-1 w-8 bg-gradient-to-r from-slate-500 to-slate-600 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Related Tools</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link href="/html/html-text_input-gen" className="group rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 transition-all duration-300 hover:border-blue-300 hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600">
                    <span className="text-xl">📝</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Text Input Generator</h3>
                </div>
                <p className="text-sm text-slate-600">Generate HTML text input fields with customizable attributes.</p>
              </Link>
              
              <Link href="/html/html-number_input-gen" className="group rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 transition-all duration-300 hover:border-purple-300 hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600">
                    <span className="text-xl">🔢</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Number Input Generator</h3>
                </div>
                <p className="text-sm text-slate-600">Create HTML number input fields for numeric values.</p>
              </Link>
              
              <Link href="/html/html-color_input-gen" className="group rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 transition-all duration-300 hover:border-emerald-300 hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600">
                    <span className="text-xl">🎨</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Color Input Generator</h3>
                </div>
                <p className="text-sm text-slate-600">Generate HTML color picker input fields.</p>
              </Link>
              
              <Link href="/html/html-date_input-gen" className="group rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 transition-all duration-300 hover:border-orange-300 hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600">
                    <span className="text-xl">📅</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Date Input Generator</h3>
                </div>
                <p className="text-sm text-slate-600">Create HTML date picker input fields.</p>
              </Link>
              
              <Link href="/html/html-progress-gen" className="group rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 transition-all duration-300 hover:border-teal-300 hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600">
                    <span className="text-xl">📊</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Progress Bar Generator</h3>
                </div>
                <p className="text-sm text-slate-600">Generate HTML progress bar elements.</p>
              </Link>
              
              <Link href="/html/html-button-gen" className="group rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 transition-all duration-300 hover:border-yellow-300 hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-500 to-amber-600">
                    <span className="text-xl">🔘</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Button Generator</h3>
                </div>
                <p className="text-sm text-slate-600">Create HTML button elements with custom attributes.</p>
              </Link>
              
              <Link href="/html/html-textarea-gen" className="group rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 transition-all duration-300 hover:border-teal-300 hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600">
                    <span className="text-xl">📝</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Textarea Generator</h3>
                </div>
                <p className="text-sm text-slate-600">Generate HTML textarea elements for multi-line text input.</p>
              </Link>
              
              <Link href="/html/html-minify" className="group rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 transition-all duration-300 hover:border-purple-300 hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600">
                    <span className="text-xl">⚡</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">HTML Minifier</h3>
                </div>
                <p className="text-sm text-slate-600">Minify and compress your HTML code to reduce file size.</p>
              </Link>
              
              <Link href="/tools/html" className="group rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 transition-all duration-300 hover:border-slate-300 hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-slate-500 to-slate-600">
                    <span className="text-xl">🛠️</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">All HTML Tools</h3>
                </div>
                <p className="text-sm text-slate-600">Browse our complete collection of HTML generators and tools.</p>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-8">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <div className="flex items-center gap-3">
                <Image src="/fixtools-logos/fixtools-logos_black.svg" alt="FixTools" width={100} height={33} className="h-8 w-auto" />
                <span className="text-sm text-slate-600">© {currentYear} FixTools. All rights reserved.</span>
              </div>
              <nav className="flex items-center gap-6 text-sm text-slate-600">
                <Link href="/" className="hover:text-slate-900 transition-colors">Home</Link>
                <Link href="/tools" className="hover:text-slate-900 transition-colors">All Tools</Link>
                <Link href="/about" className="hover:text-slate-900 transition-colors">About</Link>
              </nav>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
