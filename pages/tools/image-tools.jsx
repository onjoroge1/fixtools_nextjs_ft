import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';

const siteHost = process.env.NEXT_PUBLIC_HOST || 'https://fixtools.io';

export default function ImageToolsCategory({ tools }) {
  const currentYear = new Date().getFullYear();
  const canonicalUrl = `${siteHost}/tools/image-tools`;

  // Structured Data Schemas
  const structuredData = {
    // CollectionPage Schema for Google Sitelinks
    collectionPage: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Image Tools – Resize, Compress, Convert & Edit Images Online | FixTools",
      "description": "Free online image tools for developers and designers. Resize, compress, convert, crop, rotate, and edit images instantly. All tools work 100% in your browser.",
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
          "name": "Image Tools",
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
          "name": "What are image tools?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Image tools are online utilities that help developers and designers work with images. They include tools to resize, compress, convert, crop, rotate, watermark, and edit images. All processing happens in your browser using the Canvas API."
          }
        },
        {
          "@type": "Question",
          "name": "Are these image tools free to use?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, all our image tools are 100% free to use. There's no registration required, no account needed, and no hidden fees. All processing happens in your browser, so your images never leave your device."
          }
        },
        {
          "@type": "Question",
          "name": "Do image tools work offline?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, once the page loads, all our image tools work entirely in your browser using JavaScript and the Canvas API. No internet connection is needed after the initial page load. This ensures fast processing and complete privacy."
          }
        },
        {
          "@type": "Question",
          "name": "What image formats are supported?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our image tools support all common image formats including JPEG, PNG, GIF, WebP, BMP, and SVG. You can convert between formats, resize, compress, and edit images in any of these formats."
          }
        },
        {
          "@type": "Question",
          "name": "Is my image data secure?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Absolutely. All image tools process data entirely in your browser using client-side JavaScript. Your images never leave your device, aren't sent to any server, and aren't stored anywhere. This ensures complete privacy and security."
          }
        },
        {
          "@type": "Question",
          "name": "Can I download processed images?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, all processed images can be downloaded in their original format or converted to a different format. You can save resized, compressed, cropped, or edited images directly to your device."
          }
        },
        {
          "@type": "Question",
          "name": "What's the difference between image resizing and image compression?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Image resizing changes the dimensions (width and height) of an image. Image compression reduces the file size without necessarily changing dimensions, often by adjusting quality settings. Both are useful for optimizing images for web use."
          }
        },
        {
          "@type": "Question",
          "name": "Do I need technical knowledge to use image tools?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No, our image tools are designed to be user-friendly and require no technical knowledge. Simply upload your image, adjust settings if needed, and get instant results. All tools have clear instructions and examples."
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
        <title>Image Tools – Resize, Compress, Convert & Edit Images Online | FixTools</title>
        <meta name="title" content="Image Tools – Resize, Compress, Convert & Edit Images Online | FixTools" />
        <meta name="description" content={`Free online image tools for developers and designers. ${tools.length} tools including image resizer, compressor, converter, cropper, rotator, and more. Resize, compress, convert, and edit images instantly. Works 100% in your browser - fast, secure, no registration required.`} />
        <meta name="keywords" content="image tools, image resizer, image compressor, image converter, image cropper, image rotator, image watermark, free image tools, online image tools" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        {/* Canonical URL */}
        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content="Image Tools – Resize, Compress, Convert & Edit Images Online" />
        <meta property="og:description" content={`Free online image tools for developers and designers. ${tools.length} tools including image resizer, compressor, converter, and more.`} />
        <meta property="og:image" content={`${siteHost}/images/image-tools-og.png`} />
        <meta property="og:site_name" content="FixTools" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content="Image Tools – Resize, Compress, Convert & Edit Images Online" />
        <meta property="twitter:description" content={`Free online image tools for developers and designers. Resize, compress, convert, and edit images instantly.`} />
        <meta property="twitter:image" content={`${siteHost}/images/image-tools-og.png`} />
        
        {/* Structured Data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.collectionPage) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.breadcrumb) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.faqPage) }} />
      </Head>

      <style jsx global>{`
        html:has(.image-tools-category) {
          font-size: 100% !important;
        }
        
        .image-tools-category {
          line-height: 1.5;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          width: 100%;
          min-height: 100vh;
        }
        
        .image-tools-category *,
        .image-tools-category *::before,
        .image-tools-category *::after {
          box-sizing: border-box;
        }
        
        .image-tools-category h1,
        .image-tools-category h2,
        .image-tools-category h3,
        .image-tools-category p,
        .image-tools-category ul,
        .image-tools-category ol {
          margin: 0;
        }
        
        .image-tools-category button {
          font-family: inherit;
          cursor: pointer;
        }
        
        .image-tools-category input,
        .image-tools-category textarea,
        .image-tools-category select {
          font-family: inherit;
        }
      `}</style>

      <div className="image-tools-category bg-[#fbfbfc] text-slate-900 min-h-screen">
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
              <Link className="hover:text-slate-900 transition-colors" href="/tools/image-tools">Images</Link>
              <Link className="hover:text-slate-900 transition-colors" href="/tools/utilities">Utilities</Link>
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
              <span className="font-semibold text-slate-900">Image Tools</span>
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
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 px-4 py-1.5 text-xs font-semibold text-purple-700 shadow-sm mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
              {tools.length} Free Tools • 100% Client-Side • No Sign-Up
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                Image Tools
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 max-w-3xl leading-relaxed mb-8">
              Professional <strong>image tools</strong> for developers and designers. Resize, compress, convert, crop, rotate, watermark, and edit images instantly. 
              All tools work 100% in your browser — fast, secure, and private. No registration required.
            </p>

            {/* Stats */}
            <dl className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Tools</dt>
                <dd className="mt-1.5 text-2xl font-bold text-slate-900">{tools.length}</dd>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Processing</dt>
                <dd className="mt-1.5 text-2xl font-bold text-slate-900">Client-Side</dd>
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

        {/* Popular Tools Section */}
        <section className="mx-auto max-w-6xl px-4 pb-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Popular Image Tools</h2>
            <p className="text-slate-600">Most used tools for image processing and optimization</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {tools
              .filter(tool => 
                tool.link.includes('image-resizer') || 
                tool.link.includes('image-compressor') || 
                tool.link.includes('image-format-converter') || 
                tool.link.includes('image-cropper')
              )
              .map((tool) => {
                const getToolIcon = (title, link) => {
                  const lowerTitle = title.toLowerCase();
                  const lowerLink = link.toLowerCase();
                  
                  if (lowerTitle.includes('resizer') || lowerLink.includes('resizer')) {
                    return { icon: '📏', color: 'from-purple-500 to-pink-600', shadow: 'shadow-purple-500/30' };
                  }
                  if (lowerTitle.includes('compressor') || lowerLink.includes('compressor')) {
                    return { icon: '🗜️', color: 'from-blue-500 to-indigo-600', shadow: 'shadow-blue-500/30' };
                  }
                  if (lowerTitle.includes('format converter') || lowerLink.includes('format-converter')) {
                    return { icon: '🔄', color: 'from-pink-500 to-rose-600', shadow: 'shadow-pink-500/30' };
                  }
                  if (lowerTitle.includes('cropper') || lowerLink.includes('cropper')) {
                    return { icon: '✂️', color: 'from-green-500 to-emerald-600', shadow: 'shadow-green-500/30' };
                  }
                  return { icon: '🖼️', color: 'from-purple-500 to-pink-600', shadow: 'shadow-purple-500/30' };
                };
                
                const toolIcon = getToolIcon(tool.title, tool.link);
                
                return (
                  <Link
                    key={tool.link}
                    href={tool.link}
                    className="group block p-5 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-purple-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${toolIcon.color} shadow-lg ${toolIcon.shadow} transition-transform duration-300 group-hover:scale-110 mb-3`}>
                        <span className="text-3xl">{toolIcon.icon}</span>
                      </div>
                      <h3 className="font-bold text-slate-900 mb-2 group-hover:text-purple-600 transition-colors text-base">
                        {tool.title}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                        {tool.desc.substring(0, 80)}...
                      </p>
                    </div>
                  </Link>
                );
              })}
          </div>
        </section>

        {/* All Tools Grid */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">All Image Tools</h2>
            <p className="text-slate-600">Complete list of all {tools.length} image processing tools</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map((tool) => {
              // Get appropriate icon and color for each tool
              const getToolIcon = (title, link) => {
                const lowerTitle = title.toLowerCase();
                const lowerLink = link.toLowerCase();
                
                if (lowerTitle.includes('resizer') || lowerLink.includes('resizer')) {
                  return { icon: '📏', color: 'from-purple-500 to-pink-600', shadow: 'shadow-purple-500/30' };
                }
                if (lowerTitle.includes('compressor') || lowerLink.includes('compressor')) {
                  return { icon: '🗜️', color: 'from-blue-500 to-indigo-600', shadow: 'shadow-blue-500/30' };
                }
                if (lowerTitle.includes('to base64') || lowerLink.includes('to-base64')) {
                  return { icon: '🔐', color: 'from-cyan-500 to-blue-600', shadow: 'shadow-cyan-500/30' };
                }
                if (lowerTitle.includes('base64 to image') || lowerLink.includes('base64-to-image')) {
                  return { icon: '🔓', color: 'from-blue-500 to-cyan-600', shadow: 'shadow-blue-500/30' };
                }
                if (lowerTitle.includes('format converter') || lowerLink.includes('format-converter')) {
                  return { icon: '🔄', color: 'from-pink-500 to-rose-600', shadow: 'shadow-pink-500/30' };
                }
                if (lowerTitle.includes('cropper') || lowerLink.includes('cropper')) {
                  return { icon: '✂️', color: 'from-green-500 to-emerald-600', shadow: 'shadow-green-500/30' };
                }
                if (lowerTitle.includes('rotator') || lowerLink.includes('rotator')) {
                  return { icon: '🔄', color: 'from-orange-500 to-red-600', shadow: 'shadow-orange-500/30' };
                }
                if (lowerTitle.includes('watermark') || lowerLink.includes('watermark')) {
                  return { icon: '💧', color: 'from-indigo-500 to-purple-600', shadow: 'shadow-indigo-500/30' };
                }
                if (lowerTitle.includes('background remover') || lowerLink.includes('background-remover')) {
                  return { icon: '🎭', color: 'from-violet-500 to-purple-600', shadow: 'shadow-violet-500/30' };
                }
                if (lowerTitle.includes('flipper') || lowerLink.includes('flipper')) {
                  return { icon: '↔️', color: 'from-amber-500 to-yellow-600', shadow: 'shadow-amber-500/30' };
                }
                if (lowerTitle.includes('blur') || lowerLink.includes('blur')) {
                  return { icon: '🌫️', color: 'from-slate-500 to-gray-600', shadow: 'shadow-slate-500/30' };
                }
                if (lowerTitle.includes('brightness') || lowerLink.includes('brightness')) {
                  return { icon: '💡', color: 'from-yellow-500 to-amber-600', shadow: 'shadow-yellow-500/30' };
                }
                if (lowerTitle.includes('contrast') || lowerLink.includes('contrast')) {
                  return { icon: '🎨', color: 'from-rose-500 to-pink-600', shadow: 'shadow-rose-500/30' };
                }
                if (lowerTitle.includes('grayscale') || lowerLink.includes('grayscale')) {
                  return { icon: '⚫', color: 'from-gray-500 to-slate-600', shadow: 'shadow-gray-500/30' };
                }
                if (lowerTitle.includes('metadata') || lowerLink.includes('metadata')) {
                  return { icon: '📋', color: 'from-teal-500 to-cyan-600', shadow: 'shadow-teal-500/30' };
                }
                // Default
                return { icon: '🖼️', color: 'from-purple-500 to-pink-600', shadow: 'shadow-purple-500/30' };
              };
              
              const toolIcon = getToolIcon(tool.title, tool.link);
              
              return (
                <Link
                  key={tool.link}
                  href={tool.link}
                  className="group block p-6 rounded-2xl border-2 border-slate-200 bg-white hover:border-purple-300 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${toolIcon.color} shadow-lg ${toolIcon.shadow} transition-transform duration-300 group-hover:scale-110`}>
                      <span className="text-2xl">{toolIcon.icon}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-900 mb-1 group-hover:text-purple-600 transition-colors">
                        {tool.title}
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {tool.desc}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* What are Image Tools Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">What are Image Tools?</h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                <strong>Image tools</strong> are online utilities that help developers and designers work with images. They include tools to resize, compress, convert, crop, rotate, watermark, and edit images. According to <a href="https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API" target="_blank" rel="noopener noreferrer" className="text-purple-700 hover:text-purple-800 font-semibold underline">MDN Web Docs</a>, 
                the Canvas API enables powerful client-side image processing that works entirely in the browser.
              </p>

              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Our image tools use standard web technologies like Canvas API for image manipulation, File API for file handling, and built-in JavaScript functions for image processing. All processing happens locally in your browser, ensuring complete privacy and security. According to <a href="https://www.w3.org/TR/html5/embedded-content-0.html#the-img-element" target="_blank" rel="noopener noreferrer" className="text-purple-700 hover:text-purple-800 font-semibold underline">W3C HTML5 Standards</a>, 
                modern browsers provide comprehensive support for image manipulation.
              </p>

              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Whether you're resizing images for web use, compressing photos for faster loading, converting formats for compatibility, or adding watermarks for branding, our image tools make it fast and easy. All tools are free, require no registration, and work instantly in your browser.
              </p>

              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="rounded-2xl border-2 border-purple-200 bg-purple-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Image Tool Types</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">✓</span>
                      <span>Resize & Compress</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">✓</span>
                      <span>Format Conversion</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">✓</span>
                      <span>Crop & Rotate</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">✓</span>
                      <span>Watermark & Edit</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">✓</span>
                      <span>Base64 Encoding</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border-2 border-pink-200 bg-pink-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Why Image Tools?</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">✓</span>
                      <span>Optimize images for web</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">✓</span>
                      <span>Process images instantly</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">✓</span>
                      <span>100% private and secure</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">✓</span>
                      <span>No registration required</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">✓</span>
                      <span>Works offline after page load</span>
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
              <div className="h-1 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">How to Use These Tools</h2>
            </div>
            
            <p className="text-base text-slate-600 mb-6 leading-relaxed">
              Our image tools are designed to be simple and intuitive. Follow these steps to get started:
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 text-white font-bold text-xl shadow-lg mb-4">
                  1
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Choose Your Tool</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Select the image tool you need. Resize, compress, convert, crop, rotate, watermark, or edit images.
                </p>
              </div>

              <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 text-white font-bold text-xl shadow-lg mb-4">
                  2
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Upload Your Image</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Upload your image file. Adjust settings like dimensions, quality, format, or crop area as needed.
                </p>
              </div>

              <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white font-bold text-xl shadow-lg mb-4">
                  3
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Download Result</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Click process and get instant results. Download your processed image in the desired format.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
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
  // All 15 Image Tools (Phase 3A + Additional)
  const tools = [
    // Phase 3A (5 tools)
    {
      id: 'image-resizer',
      title: 'Image Resizer',
      category: 'Image Tools',
      link: '/image-tools/image-resizer',
      desc: 'Resize images to specific dimensions or maintain aspect ratio. Perfect for optimizing images for web, social media, or print. Supports JPEG, PNG, GIF, WebP, and more. Quick presets for Instagram, Facebook, Twitter, LinkedIn, and YouTube. Real-time preview and instant download.'
    },
    {
      id: 'image-compressor',
      title: 'Image Compressor',
      category: 'Image Tools',
      link: '/image-tools/image-compressor',
      desc: 'Compress images to reduce file size while maintaining quality. Optimize images for faster loading times and better performance. Adjustable quality settings (0.1 to 1.0). Supports JPEG, WebP, and PNG formats. Real-time compression preview with file size comparison. Achieve 60-90% size reduction.'
    },
    {
      id: 'image-to-base64',
      title: 'Image to Base64',
      category: 'Image Tools',
      link: '/image-tools/image-to-base64',
      desc: 'Convert images to Base64 encoded strings. Perfect for embedding images in HTML, CSS, or JSON. Supports all common image formats.'
    },
    {
      id: 'base64-to-image',
      title: 'Base64 to Image',
      category: 'Image Tools',
      link: '/image-tools/base64-to-image',
      desc: 'Convert Base64 encoded strings back to images. Decode Base64 image data and download as image files. Supports all common image formats.'
    },
    {
      id: 'image-format-converter',
      title: 'Image Format Converter',
      category: 'Image Tools',
      link: '/image-tools/image-format-converter',
      desc: 'Convert images between formats: JPEG, PNG, GIF, WebP, BMP, and SVG. Maintain quality while changing formats. Perfect for compatibility needs.'
    },
    // Additional 10 tools
    {
      id: 'image-cropper',
      title: 'Image Cropper',
      category: 'Image Tools',
      link: '/image-tools/image-cropper',
      desc: 'Crop images to desired dimensions or aspect ratios. Select custom crop areas or use preset aspect ratios. Perfect for social media and thumbnails.'
    },
    {
      id: 'image-rotator',
      title: 'Image Rotator',
      category: 'Image Tools',
      link: '/image-tools/image-rotator',
      desc: 'Rotate images 90°, 180°, 270°, or custom angles. Fix orientation issues or rotate for creative purposes. Supports all common image formats.'
    },
    {
      id: 'image-watermark',
      title: 'Image Watermark',
      category: 'Image Tools',
      link: '/image-tools/image-watermark',
      desc: 'Add text or image watermarks to images. Customize position, opacity, size, and style. Perfect for branding and copyright protection.'
    },
    {
      id: 'image-background-remover',
      title: 'Image Background Remover',
      category: 'Image Tools',
      link: '/image-tools/image-background-remover',
      desc: 'Remove backgrounds from images and make them transparent. Perfect for product photos, portraits, and graphic design. Supports PNG output.'
    },
    {
      id: 'image-flipper',
      title: 'Image Flipper',
      category: 'Image Tools',
      link: '/image-tools/image-flipper',
      desc: 'Flip images horizontally or vertically. Reverse images for mirror effects or correct orientation. Quick and easy image flipping tool.'
    },
    {
      id: 'image-blur-tool',
      title: 'Image Blur Tool',
      category: 'Image Tools',
      link: '/image-tools/image-blur-tool',
      desc: 'Apply blur effects to images with adjustable intensity. Create artistic effects or blur sensitive information. Gaussian and box blur options.'
    },
    {
      id: 'image-brightness-adjuster',
      title: 'Image Brightness Adjuster',
      category: 'Image Tools',
      link: '/image-tools/image-brightness-adjuster',
      desc: 'Adjust image brightness levels. Make images brighter or darker with real-time preview. Perfect for correcting exposure and lighting issues.'
    },
    {
      id: 'image-contrast-adjuster',
      title: 'Image Contrast Adjuster',
      category: 'Image Tools',
      link: '/image-tools/image-contrast-adjuster',
      desc: 'Adjust image contrast levels. Increase or decrease contrast for better visibility and visual appeal. Real-time preview and adjustments.'
    },
    {
      id: 'image-grayscale-converter',
      title: 'Image Grayscale Converter',
      category: 'Image Tools',
      link: '/image-tools/image-grayscale-converter',
      desc: 'Convert color images to grayscale (black and white). Create classic monochrome images. Supports all common image formats.'
    },
    {
      id: 'image-metadata-viewer',
      title: 'Image Metadata Viewer',
      category: 'Image Tools',
      link: '/image-tools/image-metadata-viewer',
      desc: 'View EXIF data and metadata from images. See camera settings, location data, timestamps, and more. Extract and analyze image information.'
    }
  ];
  
  return {
    props: {
      tools,
    },
  };
}

