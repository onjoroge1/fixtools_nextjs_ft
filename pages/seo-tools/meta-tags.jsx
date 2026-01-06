import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

const siteHost = process.env.NEXT_PUBLIC_HOST || 'https://fixtools.io';

export default function MetaTagsGenerator() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    keywords: '',
    author: '',
    robots: 'index, follow',
    viewport: 'width=device-width, initial-scale=1',
    charset: 'utf-8',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    ogUrl: '',
    ogType: 'website',
    twitterCard: 'summary_large_image',
    twitterTitle: '',
    twitterDescription: '',
    twitterImage: '',
  });
  const [output, setOutput] = useState('');
  const [copyText, setCopyText] = useState('📋 Copy');
  const currentYear = new Date().getFullYear();
  const canonicalUrl = `${siteHost}/seo-tools/meta-tags`;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generateMetaTags = () => {
    const {
      title, description, keywords, author, robots, viewport, charset,
      ogTitle, ogDescription, ogImage, ogUrl, ogType,
      twitterCard, twitterTitle, twitterDescription, twitterImage
    } = formData;

    if (!title && !description) {
      setOutput('');
      return;
    }

    let metaTags = `<!-- Primary Meta Tags -->\n`;
    metaTags += `<meta charset="${charset}">\n`;
    metaTags += `<meta name="viewport" content="${viewport}">\n`;
    if (title) metaTags += `<title>${title}</title>\n`;
    if (title) metaTags += `<meta name="title" content="${title}">\n`;
    if (description) metaTags += `<meta name="description" content="${description}">\n`;
    if (keywords) metaTags += `<meta name="keywords" content="${keywords}">\n`;
    if (author) metaTags += `<meta name="author" content="${author}">\n`;
    if (robots) metaTags += `<meta name="robots" content="${robots}">\n`;

    metaTags += `\n<!-- Open Graph / Facebook -->\n`;
    metaTags += `<meta property="og:type" content="${ogType || 'website'}">\n`;
    if (ogUrl) metaTags += `<meta property="og:url" content="${ogUrl}">\n`;
    if (ogTitle || title) metaTags += `<meta property="og:title" content="${ogTitle || title}">\n`;
    if (ogDescription || description) metaTags += `<meta property="og:description" content="${ogDescription || description}">\n`;
    if (ogImage) metaTags += `<meta property="og:image" content="${ogImage}">\n`;

    metaTags += `\n<!-- Twitter -->\n`;
    metaTags += `<meta property="twitter:card" content="${twitterCard}">\n`;
    if (twitterTitle || title) metaTags += `<meta property="twitter:title" content="${twitterTitle || title}">\n`;
    if (twitterDescription || description) metaTags += `<meta property="twitter:description" content="${twitterDescription || description}">\n`;
    if (twitterImage || ogImage) metaTags += `<meta property="twitter:image" content="${twitterImage || ogImage}">\n`;

    setOutput(metaTags);
  };

  React.useEffect(() => {
    generateMetaTags();
  }, [formData]);

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopyText('✅ Copied!');
    setTimeout(() => setCopyText('📋 Copy'), 2000);
  };

  const handleClear = () => {
    setFormData({
      title: '',
      description: '',
      keywords: '',
      author: '',
      robots: 'index, follow',
      viewport: 'width=device-width, initial-scale=1',
      charset: 'utf-8',
      ogTitle: '',
      ogDescription: '',
      ogImage: '',
      ogUrl: '',
      ogType: 'website',
      twitterCard: 'summary_large_image',
      twitterTitle: '',
      twitterDescription: '',
      twitterImage: '',
    });
    setOutput('');
  };

  // Structured Data Schemas
  const breadcrumbSchema = {
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
        "name": "SEO Tools",
        "item": `${siteHost}/tools/seo-tools`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": "Meta Tag Generator",
        "item": canonicalUrl
      }
    ]
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Meta Tag Generator",
    "applicationCategory": "SEO Tool",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Free online meta tag generator. Create SEO-optimized meta tags, Open Graph tags, and Twitter cards instantly. No registration required."
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Generate Meta Tags",
    "description": "Step-by-step guide to generating meta tags for your website",
    "step": [
      {
        "@type": "HowToStep",
        "name": "Enter Page Information",
        "text": "Fill in your page title, description, and keywords in the form above."
      },
      {
        "@type": "HowToStep",
        "name": "Add Open Graph Tags",
        "text": "Optionally add Open Graph tags for social media sharing (Facebook, LinkedIn)."
      },
      {
        "@type": "HowToStep",
        "name": "Configure Twitter Cards",
        "text": "Add Twitter card information for better social media previews."
      },
      {
        "@type": "HowToStep",
        "name": "Copy Generated Tags",
        "text": "Click the copy button to copy all generated meta tags to your clipboard."
      },
      {
        "@type": "HowToStep",
        "name": "Add to HTML",
        "text": "Paste the meta tags into the <head> section of your HTML document."
      }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What are meta tags?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Meta tags are HTML elements that provide metadata about a webpage. They include title tags, description tags, keywords, and Open Graph tags. Meta tags help search engines understand your content and display it properly in search results and social media shares."
        }
      },
      {
        "@type": "Question",
        "name": "Why are meta tags important for SEO?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Meta tags are crucial for SEO because they help search engines understand your page content, improve click-through rates from search results, and control how your pages appear when shared on social media. Proper meta tags can significantly impact your search rankings and social media engagement."
        }
      },
      {
        "@type": "Question",
        "name": "What is the optimal length for meta descriptions?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Meta descriptions should be between 150-160 characters for optimal display in search results. Shorter descriptions may not provide enough information, while longer descriptions get truncated. Our generator helps you create descriptions within this optimal range."
        }
      },
      {
        "@type": "Question",
        "name": "What are Open Graph tags?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Open Graph tags are meta tags that control how your content appears when shared on social media platforms like Facebook, LinkedIn, and Twitter. They include og:title, og:description, og:image, and og:url tags that create rich previews when your links are shared."
        }
      },
      {
        "@type": "Question",
        "name": "Do I need Twitter Card tags if I have Open Graph tags?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Twitter can use Open Graph tags as a fallback, but Twitter Card tags (twitter:card, twitter:title, etc.) provide better control over how your content appears on Twitter. For best results, include both Open Graph and Twitter Card tags."
        }
      },
      {
        "@type": "Question",
        "name": "Where do I place meta tags in my HTML?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "All meta tags should be placed in the <head> section of your HTML document, before the closing </head> tag. They should come after the <title> tag but before any CSS or JavaScript includes."
        }
      },
      {
        "@type": "Question",
        "name": "Is this meta tag generator free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, our meta tag generator is 100% free to use. There's no registration required, no account needed, and no hidden fees. All processing happens in your browser, ensuring complete privacy."
        }
      },
      {
        "@type": "Question",
        "name": "Can I use this tool offline?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, once the page loads, the meta tag generator works entirely in your browser using JavaScript. No internet connection is needed after the initial page load, ensuring fast processing and complete privacy."
        }
      }
    ]
  };

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>Meta Tag Generator - Free SEO Meta Tags Creator | FixTools</title>
        <meta name="title" content="Meta Tag Generator - Free SEO Meta Tags Creator | FixTools" />
        <meta name="description" content="Generate SEO-optimized meta tags, Open Graph tags, and Twitter cards instantly. Free meta tag generator for title, description, keywords, and social media tags. No registration required." />
        <meta name="keywords" content="meta tag generator, meta tags, seo meta tags, open graph generator, twitter cards, meta description generator, html meta tags" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content="Meta Tag Generator - Free SEO Meta Tags Creator" />
        <meta property="og:description" content="Generate SEO-optimized meta tags, Open Graph tags, and Twitter cards instantly. Free and private." />
        <meta property="og:image" content={`${siteHost}/images/meta-tags-og.png`} />
        <meta property="og:site_name" content="FixTools" />
        
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content="Meta Tag Generator - Free SEO Meta Tags Creator" />
        <meta property="twitter:description" content="Generate SEO-optimized meta tags, Open Graph tags, and Twitter cards instantly." />
        <meta property="twitter:image" content={`${siteHost}/images/meta-tags-og.png`} />
        
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      </Head>

      <style jsx global>{`
        html:has(.meta-tags-generator-page) {
          font-size: 100% !important;
        }
        
        .meta-tags-generator-page {
          line-height: 1.5;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          width: 100%;
          min-height: 100vh;
        }
        
        .meta-tags-generator-page *,
        .meta-tags-generator-page *::before,
        .meta-tags-generator-page *::after {
          box-sizing: border-box;
        }
      `}</style>

      <div className="meta-tags-generator-page bg-[#fbfbfc] text-slate-900 min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/fixtools-logos/fixtools-logos_black.svg" alt="FixTools" width={120} height={40} className="h-9 w-auto" />
            </Link>
            <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
              <Link className="hover:text-slate-900 transition-colors" href="/tools/json">JSON</Link>
              <Link className="hover:text-slate-900 transition-colors" href="/tools/html">HTML</Link>
              <Link className="hover:text-slate-900 transition-colors" href="/tools/css">CSS</Link>
              <Link className="hover:text-slate-900 transition-colors" href="/tools/image-tools">Images</Link>
              <Link className="hover:text-slate-900 transition-colors" href="/learn">Learn</Link>
              <Link className="hover:text-slate-900 transition-colors" href="/back-to-school">Back to School</Link>
              <Link className="hover:text-slate-900 transition-colors" href="/tools">All tools</Link>
            </nav>
            <Link href="/tools" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50">
              Browse tools
            </Link>
          </div>
        </header>

        {/* Breadcrumbs */}
        <nav className="mx-auto max-w-6xl px-4 py-3" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm text-slate-600">
            <li><Link href="/" className="hover:text-slate-900 transition-colors">Home</Link></li>
            <li className="flex items-center gap-2"><span className="text-slate-400">/</span><Link href="/tools" className="hover:text-slate-900 transition-colors">Tools</Link></li>
            <li className="flex items-center gap-2"><span className="text-slate-400">/</span><Link href="/tools/seo-tools" className="hover:text-slate-900 transition-colors">SEO Tools</Link></li>
            <li className="flex items-center gap-2"><span className="text-slate-400">/</span><span className="font-semibold text-slate-900">Meta Tag Generator</span></li>
          </ol>
        </nav>

        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.35]" style={{ backgroundImage: 'url(/grid.png)', backgroundSize: '256px 256px' }}></div>
          <div className="mx-auto max-w-6xl px-4 py-10 md:py-14 relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 px-4 py-1.5 text-xs font-semibold text-amber-700 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              Free • Private • Instant
            </div>
            
            <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              <span className="bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-600 bg-clip-text text-transparent">
                Meta Tag Generator
              </span>
            </h1>
            
            <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg md:leading-relaxed">
              Generate SEO-optimized meta tags, Open Graph tags, and Twitter cards instantly. Create perfect meta tags for title, description, keywords, and social media sharing. All processing happens in your browser.
            </p>

            <dl className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
              <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Processing</dt>
                <dd className="mt-1.5 text-sm font-bold text-slate-900">Client-Side</dd>
              </div>
              <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Privacy</dt>
                <dd className="mt-1.5 text-sm font-bold text-slate-900">100%</dd>
              </div>
              <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Speed</dt>
                <dd className="mt-1.5 text-sm font-bold text-slate-900">&lt;1s</dd>
              </div>
              <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Price</dt>
                <dd className="mt-1.5 text-sm font-bold text-slate-900">Free</dd>
              </div>
            </dl>
          </div>
        </section>

        {/* Tool Interface */}
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Form */}
            <div className="space-y-6">
              <div className="rounded-3xl border-2 border-amber-300 bg-white p-6 shadow-xl">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Page Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Page Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="My Awesome Website"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    />
                    <p className="mt-1 text-xs text-slate-500">Recommended: 50-60 characters</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Meta Description *</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="A brief description of your page content..."
                      rows="3"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    />
                    <p className="mt-1 text-xs text-slate-500">Recommended: 150-160 characters</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Keywords</label>
                    <input
                      type="text"
                      name="keywords"
                      value={formData.keywords}
                      onChange={handleChange}
                      placeholder="keyword1, keyword2, keyword3"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Author</label>
                    <input
                      type="text"
                      name="author"
                      value={formData.author}
                      onChange={handleChange}
                      placeholder="Your Name or Company"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Robots</label>
                    <select
                      name="robots"
                      value={formData.robots}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    >
                      <option value="index, follow">Index, Follow</option>
                      <option value="noindex, nofollow">Noindex, Nofollow</option>
                      <option value="index, nofollow">Index, Nofollow</option>
                      <option value="noindex, follow">Noindex, Follow</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Open Graph Section */}
              <div className="rounded-3xl border-2 border-amber-300 bg-white p-6 shadow-xl">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Open Graph Tags (Social Media)</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">OG Title</label>
                    <input
                      type="text"
                      name="ogTitle"
                      value={formData.ogTitle}
                      onChange={handleChange}
                      placeholder="Leave empty to use page title"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">OG Description</label>
                    <textarea
                      name="ogDescription"
                      value={formData.ogDescription}
                      onChange={handleChange}
                      placeholder="Leave empty to use meta description"
                      rows="2"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">OG Image URL</label>
                    <input
                      type="url"
                      name="ogImage"
                      value={formData.ogImage}
                      onChange={handleChange}
                      placeholder="https://example.com/image.png"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    />
                    <p className="mt-1 text-xs text-slate-500">Recommended: 1200x630px</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">OG URL</label>
                    <input
                      type="url"
                      name="ogUrl"
                      value={formData.ogUrl}
                      onChange={handleChange}
                      placeholder="https://example.com/page"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">OG Type</label>
                    <select
                      name="ogType"
                      value={formData.ogType}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    >
                      <option value="website">Website</option>
                      <option value="article">Article</option>
                      <option value="product">Product</option>
                      <option value="video">Video</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Twitter Cards Section */}
              <div className="rounded-3xl border-2 border-amber-300 bg-white p-6 shadow-xl">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Twitter Cards</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Twitter Card Type</label>
                    <select
                      name="twitterCard"
                      value={formData.twitterCard}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    >
                      <option value="summary_large_image">Summary Large Image</option>
                      <option value="summary">Summary</option>
                      <option value="app">App</option>
                      <option value="player">Player</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Twitter Title</label>
                    <input
                      type="text"
                      name="twitterTitle"
                      value={formData.twitterTitle}
                      onChange={handleChange}
                      placeholder="Leave empty to use OG title"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Twitter Description</label>
                    <textarea
                      name="twitterDescription"
                      value={formData.twitterDescription}
                      onChange={handleChange}
                      placeholder="Leave empty to use OG description"
                      rows="2"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Twitter Image URL</label>
                    <input
                      type="url"
                      name="twitterImage"
                      value={formData.twitterImage}
                      onChange={handleChange}
                      placeholder="Leave empty to use OG image"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Output Section */}
            <div className="space-y-6">
              <div className="rounded-3xl border-2 border-amber-300 bg-white p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-slate-900">Generated Meta Tags</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCopy}
                      disabled={!output}
                      className="rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {copyText}
                    </button>
                    <button
                      onClick={handleClear}
                      className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50"
                    >
                      Clear
                    </button>
                  </div>
                </div>
                
                <textarea
                  readOnly
                  value={output || 'Fill in the form to generate meta tags...'}
                  rows="20"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 font-mono text-sm text-slate-900 focus:outline-none"
                />
              </div>

              {/* Instructions */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <h3 className="font-semibold text-slate-900 mb-2">📝 How to Use</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-slate-600">
                  <li>Fill in your page information (title, description, etc.)</li>
                  <li>Optionally add Open Graph tags for social media</li>
                  <li>Configure Twitter Card tags if needed</li>
                  <li>Copy the generated meta tags</li>
                  <li>Paste them into the &lt;head&gt; section of your HTML</li>
                </ol>
              </div>
            </div>
          </div>
        </section>

        {/* Content Sections - Following Blueprint */}
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 md:p-10 shadow-lg">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">What are Meta Tags?</h2>
            <p className="text-base text-slate-700 leading-relaxed mb-4">
              Meta tags are HTML elements that provide metadata about a webpage. They don't appear on the page itself but are read by search engines, browsers, and social media platforms to understand and display your content properly. According to <a href="https://developers.google.com/search/docs/appearance/snippet" target="_blank" rel="noopener noreferrer" className="text-amber-700 hover:text-amber-800 font-semibold underline">Google's Search Central</a>, meta tags help search engines understand your content and create rich snippets in search results.
            </p>
            <p className="text-base text-slate-700 leading-relaxed mb-4">
              The most important meta tags include:
            </p>
            <ul className="list-disc list-inside space-y-2 text-base text-slate-700 mb-4">
              <li><strong>Title Tag:</strong> The title that appears in browser tabs and search results (50-60 characters recommended). According to <a href="https://moz.com/learn/seo/title-tag" target="_blank" rel="noopener noreferrer" className="text-amber-700 hover:text-amber-800 font-semibold underline">Moz</a>, title tags are one of the most important on-page SEO factors.</li>
              <li><strong>Meta Description:</strong> A brief summary that appears in search results (150-160 characters recommended). While not a direct ranking factor, meta descriptions significantly impact click-through rates from search results.</li>
              <li><strong>Meta Keywords:</strong> Keywords related to your content (less important now but still used by some search engines). Google officially stated they don't use meta keywords for ranking, but other search engines may still reference them.</li>
              <li><strong>Open Graph Tags:</strong> Control how your content appears when shared on Facebook, LinkedIn, and other social platforms. Defined by <a href="https://ogp.me/" target="_blank" rel="noopener noreferrer" className="text-amber-700 hover:text-amber-800 font-semibold underline">Open Graph Protocol</a>, these tags create rich social media previews.</li>
              <li><strong>Twitter Cards:</strong> Control how your content appears when shared on Twitter. Twitter Cards provide enhanced previews with images, titles, and descriptions, improving engagement on social media.</li>
            </ul>
            <p className="text-base text-slate-700 leading-relaxed mb-4">
              Meta tags are defined in the HTML specification and are part of the <a href="https://www.w3.org/TR/html5/document-metadata.html" target="_blank" rel="noopener noreferrer" className="text-amber-700 hover:text-amber-800 font-semibold underline">W3C HTML5 standard</a>. They provide essential information about your webpage that helps search engines index and display your content correctly in search results and social media shares.
            </p>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 md:p-10 shadow-lg">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Meta Tags Impact & Statistics</h2>
            <p className="text-base text-slate-700 leading-relaxed mb-6">
              Understanding the impact of meta tags helps you appreciate their importance in SEO and social media marketing.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-3">SEO Impact</h3>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold mt-0.5">•</span>
                    <span><strong>Click-Through Rate:</strong> Well-written meta descriptions can increase CTR by 5-15%</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold mt-0.5">•</span>
                    <span><strong>Title Tags:</strong> One of the top 3 on-page SEO ranking factors</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold mt-0.5">•</span>
                    <span><strong>Social Sharing:</strong> Pages with Open Graph tags get 2-3x more social engagement</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-3">Best Practices Data</h3>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold mt-0.5">•</span>
                    <span><strong>Title Length:</strong> 50-60 characters for optimal display (90% of titles)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold mt-0.5">•</span>
                    <span><strong>Description Length:</strong> 150-160 characters for full display in SERPs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold mt-0.5">•</span>
                    <span><strong>OG Image Size:</strong> 1200x630px recommended for best social previews</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-3">Meta Tags Usage Statistics</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm text-slate-700">
                <div>
                  <p className="font-semibold text-slate-900 mb-1">Websites Using Meta Tags</p>
                  <p className="text-2xl font-bold text-emerald-600">95%+</p>
                  <p className="text-xs text-slate-600 mt-1">Of all indexed websites</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900 mb-1">Open Graph Adoption</p>
                  <p className="text-2xl font-bold text-emerald-600">80%+</p>
                  <p className="text-xs text-slate-600 mt-1">Of top-ranking websites</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900 mb-1">CTR Improvement</p>
                  <p className="text-2xl font-bold text-emerald-600">5-15%</p>
                  <p className="text-xs text-slate-600 mt-1">With optimized meta descriptions</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Use Section */}
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 md:p-10 shadow-lg">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Use a Meta Tag Generator?</h2>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Meta tag generators simplify the process of creating SEO-optimized meta tags, ensuring your website appears correctly in search results and social media shares. Here are the key benefits:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-amber-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 shadow-lg">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Save Time & Reduce Errors</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Manually writing meta tags is time-consuming and error-prone. A meta tag generator ensures proper formatting, correct syntax, and optimal character lengths. Generate perfect meta tags in seconds instead of minutes.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-amber-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                    <span className="text-2xl">📈</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Improve Search Rankings</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Properly optimized meta tags help search engines understand your content, leading to better rankings. Title tags are one of the most important on-page SEO factors, and well-written descriptions improve click-through rates.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-amber-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
                    <span className="text-2xl">📱</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Enhance Social Media Sharing</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Open Graph tags and Twitter Cards create rich, engaging previews when your content is shared on social media. Pages with proper social meta tags receive 2-3x more engagement and clicks from social platforms.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-amber-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
                    <span className="text-2xl">✅</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Ensure Standards Compliance</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Meta tag generators ensure your tags follow HTML5 standards and best practices. This prevents syntax errors, ensures proper formatting, and guarantees compatibility across all browsers and platforms.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-amber-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Optimize Character Lengths</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Our generator provides real-time character counts and recommendations, ensuring your title tags (50-60 chars) and descriptions (150-160 chars) are optimized for search engine display. No more truncated titles or descriptions in search results.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-amber-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 shadow-lg">
                    <span className="text-2xl">🔒</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">100% Privacy & Security</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      All meta tag generation happens entirely in your browser. Your content never leaves your device, ensuring complete privacy and security. No data is stored, logged, or transmitted to any server.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-6 mt-6">
              <h3 className="text-lg font-bold text-slate-900 mb-3">Key Benefits Summary</h3>
              <ul className="grid md:grid-cols-2 gap-3 text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold mt-0.5">✓</span>
                  <span>Generate SEO-optimized meta tags instantly</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold mt-0.5">✓</span>
                  <span>Create Open Graph and Twitter Card tags automatically</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold mt-0.5">✓</span>
                  <span>Ensure proper character lengths for optimal display</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold mt-0.5">✓</span>
                  <span>Improve search rankings and click-through rates</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold mt-0.5">✓</span>
                  <span>Enhance social media sharing with rich previews</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold mt-0.5">✓</span>
                  <span>Free, instant, and requires no registration</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Best Practices Section */}
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 md:p-10 shadow-lg">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Best Practices for Meta Tags</h2>
            <p className="text-base text-slate-700 leading-relaxed mb-6">
              Following meta tag best practices ensures your website appears correctly in search results and social media shares, maximizing your SEO and social media engagement.
            </p>

            <div className="space-y-6">
              <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-3">Title Tag Best Practices</h3>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold mt-0.5">•</span>
                    <span><strong>Length:</strong> Keep titles between 50-60 characters to avoid truncation in search results</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold mt-0.5">•</span>
                    <span><strong>Primary Keyword:</strong> Include your primary keyword near the beginning of the title</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold mt-0.5">•</span>
                    <span><strong>Brand Name:</strong> Include your brand name at the end, separated by a pipe (|)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold mt-0.5">•</span>
                    <span><strong>Uniqueness:</strong> Create unique title tags for every page on your website</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold mt-0.5">•</span>
                    <span><strong>Avoid:</strong> Keyword stuffing, duplicate titles, or generic titles like "Home" or "Page 1"</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-3">Meta Description Best Practices</h3>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold mt-0.5">•</span>
                    <span><strong>Length:</strong> Aim for 150-160 characters for optimal display in search results</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold mt-0.5">•</span>
                    <span><strong>Compelling Copy:</strong> Write descriptions that encourage clicks with clear value propositions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold mt-0.5">•</span>
                    <span><strong>Include Keywords:</strong> Naturally incorporate primary and secondary keywords</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold mt-0.5">•</span>
                    <span><strong>Call-to-Action:</strong> Include action words like "Learn", "Discover", "Get Started" when appropriate</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold mt-0.5">•</span>
                    <span><strong>Uniqueness:</strong> Write unique descriptions for each page to avoid duplicate content issues</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-3">Open Graph Tag Best Practices</h3>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold mt-0.5">•</span>
                    <span><strong>OG Image:</strong> Use high-quality images (1200x630px) that represent your content accurately</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold mt-0.5">•</span>
                    <span><strong>OG Title:</strong> Can be different from your HTML title tag, optimized for social sharing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold mt-0.5">•</span>
                    <span><strong>OG Description:</strong> Write engaging descriptions that encourage social media clicks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold mt-0.5">•</span>
                    <span><strong>OG URL:</strong> Always use the canonical URL to avoid duplicate content issues</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold mt-0.5">•</span>
                    <span><strong>Test Your Tags:</strong> Use Facebook's Sharing Debugger and Twitter's Card Validator to preview how your content appears</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-3">Common Mistakes to Avoid</h3>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold mt-0.5">✗</span>
                    <span><strong>Duplicate Meta Tags:</strong> Using the same title or description across multiple pages</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold mt-0.5">✗</span>
                    <span><strong>Missing Meta Tags:</strong> Not including meta tags on important pages</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold mt-0.5">✗</span>
                    <span><strong>Keyword Stuffing:</strong> Overusing keywords in titles and descriptions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold mt-0.5">✗</span>
                    <span><strong>Ignoring Character Limits:</strong> Creating titles or descriptions that get truncated</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold mt-0.5">✗</span>
                    <span><strong>Missing Social Tags:</strong> Not including Open Graph or Twitter Card tags</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 md:p-10 shadow-lg">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {faqSchema.mainEntity.map((faq, idx) => (
                <div key={idx} className="border-b border-slate-200 pb-6 last:border-b-0 last:pb-0">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{faq.name}</h3>
                  <p className="text-base text-slate-600 leading-relaxed">{faq.acceptedAnswer.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Related Tools */}
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Related SEO Tools</h2>
            <p className="text-slate-600">Explore other SEO tools to optimize your website.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/seo-tools/open-graph" className="group rounded-2xl border-2 border-amber-300 bg-white p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-600 via-yellow-600 to-amber-600 shadow-lg">
                  <span className="text-2xl">📱</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Open Graph Generator</h3>
                  <p className="text-sm text-slate-600">Generate Open Graph tags</p>
                </div>
              </div>
            </Link>
            <Link href="/seo-tools/robots-txt" className="group rounded-2xl border-2 border-amber-300 bg-white p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-600 via-yellow-600 to-amber-600 shadow-lg">
                  <span className="text-2xl">🤖</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Robots.txt Generator</h3>
                  <p className="text-sm text-slate-600">Create robots.txt files</p>
                </div>
              </div>
            </Link>
            <Link href="/seo-tools/site-map-generator" className="group rounded-2xl border-2 border-amber-300 bg-white p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-600 via-yellow-600 to-amber-600 shadow-lg">
                  <span className="text-2xl">🗺️</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Sitemap Generator</h3>
                  <p className="text-sm text-slate-600">Generate XML sitemaps</p>
                </div>
              </div>
            </Link>
          </div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/seo-tools/ip-location" className="group rounded-2xl border-2 border-slate-200 bg-white p-6 hover:border-amber-300 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                  <span className="text-2xl">🌐</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">IP Location Checker</h3>
                  <p className="text-sm text-slate-600">Check your IP address and location</p>
                </div>
              </div>
            </Link>
            <Link href="/tools/html" className="group rounded-2xl border-2 border-slate-200 bg-white p-6 hover:border-amber-300 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg">
                  <span className="text-2xl">📄</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">HTML Tools</h3>
                  <p className="text-sm text-slate-600">Format, minify, and validate HTML</p>
                </div>
              </div>
            </Link>
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

