import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

const siteHost = process.env.NEXT_PUBLIC_HOST || 'https://fixtools.io';

export default function SitemapGenerator() {
  const [urls, setUrls] = useState('');
  const [sitemapUrl, setSitemapUrl] = useState('');
  const [output, setOutput] = useState('');
  const [copyText, setCopyText] = useState('📋 Copy');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const currentYear = new Date().getFullYear();
  const canonicalUrl = `${siteHost}/seo-tools/site-map-generator`;

  const generateSitemap = () => {
    setError('');
    
    if (!urls.trim()) {
      setOutput('');
      return;
    }

    try {
      // Parse URLs from textarea (one per line or comma-separated)
      const urlList = urls
        .split(/[\n,]/)
        .map(url => url.trim())
        .filter(url => url.length > 0);

      if (urlList.length === 0) {
        setError('Please enter at least one URL');
        setOutput('');
        return;
      }

      // Validate URLs
      const invalidUrls = urlList.filter(url => {
        try {
          new URL(url);
          return false;
        } catch {
          return true;
        }
      });

      if (invalidUrls.length > 0) {
        setError(`Invalid URLs: ${invalidUrls.join(', ')}`);
        setOutput('');
        return;
      }

      // Generate XML sitemap
      const now = new Date().toISOString();
      let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
      xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
      
      urlList.forEach(url => {
        xml += '  <url>\n';
        xml += `    <loc>${escapeXml(url)}</loc>\n`;
        xml += `    <lastmod>${now.split('T')[0]}</lastmod>\n`;
        xml += '    <changefreq>weekly</changefreq>\n';
        xml += '    <priority>0.8</priority>\n';
        xml += '  </url>\n';
      });
      
      xml += '</urlset>';
      
      setOutput(xml);
      setError('');
    } catch (err) {
      setError('Error generating sitemap: ' + err.message);
      setOutput('');
    }
  };

  const escapeXml = (str) => {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  };

  React.useEffect(() => {
    generateSitemap();
  }, [urls]);

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopyText('✅ Copied!');
    setTimeout(() => setCopyText('📋 Copy'), 2000);
  };

  const handleClear = () => {
    setUrls('');
    setSitemapUrl('');
    setOutput('');
    setError('');
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
        "name": "Sitemap Generator",
        "item": canonicalUrl
      }
    ]
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "XML Sitemap Generator",
    "applicationCategory": "SEO Tool",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Free online XML sitemap generator. Create SEO-optimized sitemaps for search engines instantly. No registration required."
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Generate an XML Sitemap",
    "description": "Step-by-step guide to generating XML sitemaps for your website",
    "step": [
      {
        "@type": "HowToStep",
        "name": "Enter Your URLs",
        "text": "Paste or type your website URLs into the text area, one URL per line or separated by commas."
      },
      {
        "@type": "HowToStep",
        "name": "Review Generated Sitemap",
        "text": "The XML sitemap will be generated automatically as you type. Review the output to ensure all URLs are included."
      },
      {
        "@type": "HowToStep",
        "name": "Copy or Download",
        "text": "Click the copy button to copy the sitemap to your clipboard, or download it as an XML file."
      },
      {
        "@type": "HowToStep",
        "name": "Upload to Your Server",
        "text": "Upload the sitemap.xml file to your website's root directory (e.g., https://example.com/sitemap.xml)."
      },
      {
        "@type": "HowToStep",
        "name": "Submit to Search Engines",
        "text": "Submit your sitemap to Google Search Console and Bing Webmaster Tools to help search engines discover your pages."
      }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is an XML sitemap?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "An XML sitemap is a file that lists all the important pages on your website in a format that search engines can easily read. It helps search engines discover, crawl, and index your pages more efficiently. Sitemaps are especially useful for large websites or sites with complex navigation structures."
        }
      },
      {
        "@type": "Question",
        "name": "Why do I need a sitemap?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "XML sitemaps help search engines discover all your pages, especially new or recently updated content. They're essential for large websites, sites with deep navigation, new websites, and sites with limited internal linking. Sitemaps can improve your site's visibility in search results and help search engines understand your site structure."
        }
      },
      {
        "@type": "Question",
        "name": "What is the maximum number of URLs in a sitemap?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "According to the sitemap protocol, a single sitemap file can contain up to 50,000 URLs and must be no larger than 50MB (uncompressed). If you have more than 50,000 URLs, you should create multiple sitemap files and use a sitemap index file to reference them all."
        }
      },
      {
        "@type": "Question",
        "name": "Where should I place my sitemap?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Your sitemap should be placed in your website's root directory (e.g., https://example.com/sitemap.xml). This makes it easily accessible to search engines. You can also submit your sitemap directly to Google Search Console and Bing Webmaster Tools."
        }
      },
      {
        "@type": "Question",
        "name": "How often should I update my sitemap?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You should update your sitemap whenever you add, remove, or significantly modify pages on your website. For active websites, updating your sitemap weekly or monthly is recommended. The lastmod date in your sitemap helps search engines know when content was last updated."
        }
      },
      {
        "@type": "Question",
        "name": "Is this sitemap generator free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, our XML sitemap generator is 100% free to use. There's no registration required, no account needed, and no hidden fees. All processing happens in your browser, ensuring complete privacy and security."
        }
      },
      {
        "@type": "Question",
        "name": "What format should URLs be in?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "URLs should be complete, absolute URLs including the protocol (http:// or https://). For example: https://example.com/page. You can enter URLs one per line or separated by commas. The generator will automatically validate and format them correctly."
        }
      },
      {
        "@type": "Question",
        "name": "Can I customize priority and changefreq?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The current version generates sitemaps with default values (priority: 0.8, changefreq: weekly). These are standard values that work well for most websites. Priority and changefreq are hints to search engines, not directives, so they may not always be followed exactly."
        }
      }
    ]
  };

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>XML Sitemap Generator - Free SEO Sitemap Creator | FixTools</title>
        <meta name="title" content="XML Sitemap Generator - Free SEO Sitemap Creator | FixTools" />
        <meta name="description" content="Generate XML sitemaps for your website instantly. Free sitemap generator for Google, Bing, and all search engines. Create SEO-optimized sitemaps with no registration required." />
        <meta name="keywords" content="sitemap generator, xml sitemap, sitemap creator, google sitemap, sitemap xml generator, seo sitemap, website sitemap, sitemap maker" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content="XML Sitemap Generator - Free SEO Sitemap Creator" />
        <meta property="og:description" content="Generate XML sitemaps for your website instantly. Free sitemap generator for Google, Bing, and all search engines." />
        <meta property="og:image" content={`${siteHost}/images/sitemap-generator-og.png`} />
        <meta property="og:site_name" content="FixTools" />
        
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content="XML Sitemap Generator - Free SEO Sitemap Creator" />
        <meta property="twitter:description" content="Generate XML sitemaps for your website instantly. Free sitemap generator for search engines." />
        <meta property="twitter:image" content={`${siteHost}/images/sitemap-generator-og.png`} />
        
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      </Head>

      <style jsx global>{`
        html:has(.sitemap-generator-page) {
          font-size: 100% !important;
        }
        
        .sitemap-generator-page {
          line-height: 1.5;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          width: 100%;
          min-height: 100vh;
        }
        
        .sitemap-generator-page *,
        .sitemap-generator-page *::before,
        .sitemap-generator-page *::after {
          box-sizing: border-box;
        }
      `}</style>

      <div className="sitemap-generator-page bg-[#fbfbfc] text-slate-900 min-h-screen">
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
            <li className="flex items-center gap-2"><span className="text-slate-400">/</span><span className="font-semibold text-slate-900">Sitemap Generator</span></li>
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
                XML Sitemap Generator
              </span>
            </h1>
            
            <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg md:leading-relaxed">
              Generate XML sitemaps for your website instantly. Create SEO-optimized sitemaps that help search engines discover and index all your pages. All processing happens in your browser.
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
                <h2 className="text-xl font-bold text-slate-900 mb-4">Enter Your URLs</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Website URLs *
                    </label>
                    <textarea
                      value={urls}
                      onChange={(e) => setUrls(e.target.value)}
                      placeholder="https://example.com/page1&#10;https://example.com/page2&#10;https://example.com/page3"
                      rows="12"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 font-mono text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    />
                    <p className="mt-1 text-xs text-slate-500">
                      Enter one URL per line or separate by commas. URLs must include http:// or https://
                    </p>
                  </div>

                  {error && (
                    <div className="rounded-xl border-2 border-red-200 bg-red-50 p-4">
                      <p className="text-sm font-semibold text-red-800">{error}</p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={handleClear}
                      className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <h3 className="font-semibold text-slate-900 mb-2">📝 How to Use</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-slate-600">
                  <li>Enter your website URLs (one per line or comma-separated)</li>
                  <li>The XML sitemap will be generated automatically</li>
                  <li>Review the generated sitemap in the output area</li>
                  <li>Copy the sitemap or download it as an XML file</li>
                  <li>Upload sitemap.xml to your website's root directory</li>
                  <li>Submit to Google Search Console and Bing Webmaster Tools</li>
                </ol>
              </div>
            </div>

            {/* Output Section */}
            <div className="space-y-6">
              <div className="rounded-3xl border-2 border-amber-300 bg-white p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-slate-900">Generated XML Sitemap</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCopy}
                      disabled={!output}
                      className="rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {copyText}
                    </button>
                    <button
                      onClick={handleDownload}
                      disabled={!output}
                      className="rounded-xl border border-amber-600 bg-white px-4 py-2 text-sm font-semibold text-amber-600 transition-all hover:bg-amber-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      💾 Download
                    </button>
                  </div>
                </div>
                
                <div className="mb-2 text-xs text-slate-500">
                  {output ? `${urls.split(/[\n,]/).filter(u => u.trim()).length} URLs in sitemap` : 'Enter URLs to generate sitemap...'}
                </div>
                
                <textarea
                  readOnly
                  value={output || 'Enter your URLs in the form to generate an XML sitemap...'}
                  rows="20"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 font-mono text-xs text-slate-900 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Content Sections - Following Blueprint */}
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 md:p-10 shadow-lg">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">What is an XML Sitemap?</h2>
            <p className="text-base text-slate-700 leading-relaxed mb-4">
              An <strong>XML sitemap</strong> is a file that lists all the important pages on your website in a format that search engines can easily read and understand. According to <a href="https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview" target="_blank" rel="noopener noreferrer" className="text-amber-700 hover:text-amber-800 font-semibold underline">Google's Search Central</a>, sitemaps help search engines discover, crawl, and index your pages more efficiently.
            </p>
            <p className="text-base text-slate-700 leading-relaxed mb-4">
              XML sitemaps follow the <a href="https://www.sitemaps.org/protocol.html" target="_blank" rel="noopener noreferrer" className="text-amber-700 hover:text-amber-800 font-semibold underline">Sitemap Protocol</a>, an open standard that defines the XML format for sitemaps. This protocol is supported by all major search engines, including Google, Bing, Yahoo, and others. The protocol was created by Google and is now maintained by <a href="https://www.sitemaps.org/" target="_blank" rel="noopener noreferrer" className="text-amber-700 hover:text-amber-800 font-semibold underline">sitemaps.org</a>.
            </p>
            <p className="text-base text-slate-700 leading-relaxed mb-4">
              Key components of an XML sitemap include:
            </p>
            <ul className="list-disc list-inside space-y-2 text-base text-slate-700 mb-4">
              <li><strong>URL Location (&lt;loc&gt;):</strong> The complete URL of each page on your website</li>
              <li><strong>Last Modified (&lt;lastmod&gt;):</strong> The date when the page was last updated</li>
              <li><strong>Change Frequency (&lt;changefreq&gt;):</strong> How often the page is updated (always, hourly, daily, weekly, monthly, yearly, never)</li>
              <li><strong>Priority (&lt;priority&gt;):</strong> The relative importance of the URL compared to other URLs on your site (0.0 to 1.0)</li>
            </ul>
            <p className="text-base text-slate-700 leading-relaxed mb-4">
              Sitemaps are especially important for large websites, sites with complex navigation structures, new websites, and sites with limited internal linking. They help ensure that search engines can discover all your important pages, even if they're not easily accessible through your site's navigation. According to <a href="https://www.bing.com/webmasters/help/sitemaps-3b5ef6b2" target="_blank" rel="noopener noreferrer" className="text-amber-700 hover:text-amber-800 font-semibold underline">Bing Webmaster Tools</a>, sitemaps are one of the most effective ways to help search engines understand your site structure.
            </p>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 md:p-10 shadow-lg">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Sitemap Impact & Statistics</h2>
            <p className="text-base text-slate-700 leading-relaxed mb-6">
              Understanding the impact of XML sitemaps helps you appreciate their importance in SEO and search engine indexing.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-3">SEO Impact</h3>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold mt-0.5">•</span>
                    <span><strong>Faster Indexing:</strong> Pages with sitemaps are indexed 2-3x faster</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold mt-0.5">•</span>
                    <span><strong>Better Discovery:</strong> 95%+ of indexed sites use sitemaps</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold mt-0.5">•</span>
                    <span><strong>Deep Pages:</strong> Sitemaps help index pages 3+ levels deep</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-3">Technical Specifications</h3>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold mt-0.5">•</span>
                    <span><strong>Max URLs:</strong> 50,000 URLs per sitemap file</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold mt-0.5">•</span>
                    <span><strong>File Size:</strong> Maximum 50MB uncompressed</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold mt-0.5">•</span>
                    <span><strong>Format:</strong> XML (UTF-8 encoding required)</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-3">Sitemap Usage Statistics</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm text-slate-700">
                <div>
                  <p className="font-semibold text-slate-900 mb-1">Websites Using Sitemaps</p>
                  <p className="text-2xl font-bold text-emerald-600">95%+</p>
                  <p className="text-xs text-slate-600 mt-1">Of all indexed websites</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900 mb-1">Average Sitemap Size</p>
                  <p className="text-2xl font-bold text-emerald-600">500-2K</p>
                  <p className="text-xs text-slate-600 mt-1">URLs per sitemap</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900 mb-1">Indexing Improvement</p>
                  <p className="text-2xl font-bold text-emerald-600">2-3x</p>
                  <p className="text-xs text-slate-600 mt-1">Faster page discovery</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Use Section */}
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 md:p-10 shadow-lg">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Use an XML Sitemap Generator?</h2>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              XML sitemap generators simplify the process of creating SEO-optimized sitemaps, ensuring search engines can discover and index all your important pages. Here are the key benefits:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-amber-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 shadow-lg">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Faster Page Discovery</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Sitemaps help search engines discover your pages 2-3x faster than relying solely on crawling. This is especially important for new websites, deep pages, or pages with limited internal linking. Search engines can immediately see all your important URLs in one place.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-amber-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                    <span className="text-2xl">🔍</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Better Search Engine Indexing</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Sitemaps ensure that all your important pages are submitted to search engines, improving your chances of getting indexed. This is crucial for large websites where some pages might be missed during normal crawling, or for pages that are dynamically generated.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-amber-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
                    <span className="text-2xl">📊</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Track Indexing Status</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      When you submit your sitemap to Google Search Console or Bing Webmaster Tools, you can track which pages have been indexed, identify errors, and monitor your site's indexing health. This provides valuable insights into how search engines view your website.
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
                      Our sitemap generator ensures your XML sitemap follows the official Sitemap Protocol standards. This prevents syntax errors, ensures proper formatting, and guarantees compatibility with all major search engines including Google, Bing, Yahoo, and others.
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
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Save Time & Reduce Errors</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Manually creating XML sitemaps is time-consuming and error-prone. Our generator creates properly formatted sitemaps instantly, with correct XML structure, proper escaping, and all required elements. Generate perfect sitemaps in seconds instead of hours.
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
                      All sitemap generation happens entirely in your browser. Your URLs never leave your device, ensuring complete privacy and security. No data is stored, logged, or transmitted to any server. Perfect for sensitive or private websites.
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
                  <span>Generate XML sitemaps instantly with proper formatting</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold mt-0.5">✓</span>
                  <span>Help search engines discover your pages 2-3x faster</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold mt-0.5">✓</span>
                  <span>Improve indexing for large or complex websites</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold mt-0.5">✓</span>
                  <span>Track indexing status in search console tools</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold mt-0.5">✓</span>
                  <span>Ensure compliance with Sitemap Protocol standards</span>
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
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Best Practices for XML Sitemaps</h2>
            <p className="text-base text-slate-700 leading-relaxed mb-6">
              Following sitemap best practices ensures your website is properly indexed by search engines and maximizes your SEO potential.
            </p>

            <div className="space-y-6">
              <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-3">Sitemap Content Best Practices</h3>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold mt-0.5">•</span>
                    <span><strong>Include Important Pages:</strong> Only include pages you want search engines to index. Exclude duplicate content, low-quality pages, and pages with noindex tags.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold mt-0.5">•</span>
                    <span><strong>Use Absolute URLs:</strong> Always use complete URLs including the protocol (https://). Relative URLs won't work in sitemaps.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold mt-0.5">•</span>
                    <span><strong>Keep It Updated:</strong> Update your sitemap whenever you add, remove, or significantly modify pages. Update the lastmod date to reflect changes.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold mt-0.5">•</span>
                    <span><strong>Limit Size:</strong> Keep individual sitemap files under 50,000 URLs and 50MB. Use sitemap index files for larger sites.</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-3">Sitemap Submission Best Practices</h3>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold mt-0.5">•</span>
                    <span><strong>Submit to Search Engines:</strong> Submit your sitemap to Google Search Console and Bing Webmaster Tools for faster indexing.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold mt-0.5">•</span>
                    <span><strong>Add robots.txt Reference:</strong> Include your sitemap location in your robots.txt file (Sitemap: https://example.com/sitemap.xml).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold mt-0.5">•</span>
                    <span><strong>Place in Root Directory:</strong> Upload sitemap.xml to your website's root directory for easy access by search engines.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold mt-0.5">•</span>
                    <span><strong>Monitor in Search Console:</strong> Regularly check Google Search Console for sitemap errors, indexing issues, and coverage problems.</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-3">Sitemap Structure Best Practices</h3>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold mt-0.5">•</span>
                    <span><strong>Use Sitemap Index:</strong> For sites with more than 50,000 URLs, create multiple sitemaps and use a sitemap index file to reference them all.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold mt-0.5">•</span>
                    <span><strong>Organize by Type:</strong> Consider creating separate sitemaps for different content types (pages, blog posts, products, images) for better organization.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold mt-0.5">•</span>
                    <span><strong>Validate XML:</strong> Always validate your sitemap XML to ensure it's well-formed and follows the protocol standards.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold mt-0.5">•</span>
                    <span><strong>Use HTTPS:</strong> Always use HTTPS URLs in your sitemap for security and SEO benefits.</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-3">Common Mistakes to Avoid</h3>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold mt-0.5">✗</span>
                    <span><strong>Including Noindex Pages:</strong> Don't include pages with noindex meta tags or blocked by robots.txt</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold mt-0.5">✗</span>
                    <span><strong>Using Relative URLs:</strong> Always use absolute URLs with full protocol (https://)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold mt-0.5">✗</span>
                    <span><strong>Exceeding Limits:</strong> Don't exceed 50,000 URLs or 50MB per sitemap file</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold mt-0.5">✗</span>
                    <span><strong>Outdated Sitemaps:</strong> Don't forget to update your sitemap when adding or removing pages</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold mt-0.5">✗</span>
                    <span><strong>Not Submitting:</strong> Creating a sitemap isn't enough - you must submit it to search engines</span>
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
            <Link href="/seo-tools/meta-tags" className="group rounded-2xl border-2 border-amber-300 bg-white p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-600 via-yellow-600 to-amber-600 shadow-lg">
                  <span className="text-2xl">🏷️</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Meta Tag Generator</h3>
                  <p className="text-sm text-slate-600">Generate SEO meta tags</p>
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
            <Link href="/seo-tools/ip-location" className="group rounded-2xl border-2 border-amber-300 bg-white p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-600 via-yellow-600 to-amber-600 shadow-lg">
                  <span className="text-2xl">🌐</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">IP Location Checker</h3>
                  <p className="text-sm text-slate-600">Check your IP address</p>
                </div>
              </div>
            </Link>
          </div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <Link href="/tools/json" className="group rounded-2xl border-2 border-slate-200 bg-white p-6 hover:border-amber-300 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                  <span className="text-2xl">📋</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">JSON Tools</h3>
                  <p className="text-sm text-slate-600">Format, validate, and minify JSON</p>
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
