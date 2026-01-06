import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

const siteHost = process.env.NEXT_PUBLIC_HOST || 'https://fixtools.io';

export default function RobotsTxtGenerator() {
  const [userAgents, setUserAgents] = useState([{ name: '*', allow: [], disallow: [], crawlDelay: '' }]);
  const [sitemapUrl, setSitemapUrl] = useState('');
  const [output, setOutput] = useState('');
  const [copyText, setCopyText] = useState('📋 Copy');
  const currentYear = new Date().getFullYear();
  const canonicalUrl = `${siteHost}/seo-tools/robots-txt`;

  const updateUserAgent = (index, field, value) => {
    const updated = [...userAgents];
    if (field === 'name') {
      updated[index].name = value;
    } else if (field === 'allow') {
      updated[index].allow = value.split('\n').filter(line => line.trim());
    } else if (field === 'disallow') {
      updated[index].disallow = value.split('\n').filter(line => line.trim());
    } else if (field === 'crawlDelay') {
      updated[index].crawlDelay = value;
    }
    setUserAgents(updated);
  };

  const addUserAgent = () => {
    setUserAgents([...userAgents, { name: '*', allow: [], disallow: [], crawlDelay: '' }]);
  };

  const removeUserAgent = (index) => {
    if (userAgents.length > 1) {
      setUserAgents(userAgents.filter((_, i) => i !== index));
    }
  };

  const generateRobotsTxt = () => {
    let robotsTxt = '';

    userAgents.forEach((ua, index) => {
      if (index > 0) robotsTxt += '\n';
      robotsTxt += `User-agent: ${ua.name}\n`;
      
      ua.allow.forEach(path => {
        robotsTxt += `Allow: ${path}\n`;
      });
      
      ua.disallow.forEach(path => {
        robotsTxt += `Disallow: ${path}\n`;
      });
      
      if (ua.crawlDelay) {
        robotsTxt += `Crawl-delay: ${ua.crawlDelay}\n`;
      }
    });

    if (sitemapUrl.trim()) {
      robotsTxt += `\nSitemap: ${sitemapUrl.trim()}\n`;
    }

    setOutput(robotsTxt);
  };

  React.useEffect(() => {
    generateRobotsTxt();
  }, [userAgents, sitemapUrl]);

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopyText('✅ Copied!');
    setTimeout(() => setCopyText('📋 Copy'), 2000);
  };

  const handleClear = () => {
    setUserAgents([{ name: '*', allow: [], disallow: [], crawlDelay: '' }]);
    setSitemapUrl('');
    setOutput('');
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'robots.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const loadPreset = (preset) => {
    if (preset === 'allow-all') {
      setUserAgents([{ name: '*', allow: [], disallow: [], crawlDelay: '' }]);
      setSitemapUrl('');
    } else if (preset === 'disallow-all') {
      setUserAgents([{ name: '*', allow: [], disallow: ['/'], crawlDelay: '' }]);
      setSitemapUrl('');
    } else if (preset === 'common') {
      setUserAgents([
        { 
          name: '*', 
          allow: [], 
          disallow: ['/admin/', '/private/', '/tmp/'], 
          crawlDelay: '' 
        }
      ]);
      setSitemapUrl('');
    }
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
        "name": "Robots.txt Generator",
        "item": canonicalUrl
      }
    ]
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Robots.txt Generator",
    "applicationCategory": "SEO Tool",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Free online robots.txt generator. Create SEO-optimized robots.txt files to control search engine crawlers. No registration required."
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Generate a Robots.txt File",
    "description": "Step-by-step guide to generating robots.txt files for your website",
    "step": [
      {
        "@type": "HowToStep",
        "name": "Configure User Agents",
        "text": "Add user agent rules to control which crawlers can access your site. Use '*' for all crawlers or specify specific bots like 'Googlebot' or 'Bingbot'."
      },
      {
        "@type": "HowToStep",
        "name": "Set Allow and Disallow Rules",
        "text": "Specify which paths crawlers are allowed or disallowed from accessing. Use 'Allow:' for paths to permit and 'Disallow:' for paths to block."
      },
      {
        "@type": "HowToStep",
        "name": "Add Sitemap URL",
        "text": "Optionally add your sitemap URL to help search engines discover your XML sitemap."
      },
      {
        "@type": "HowToStep",
        "name": "Copy or Download",
        "text": "Copy the generated robots.txt to your clipboard or download it as a text file."
      },
      {
        "@type": "HowToStep",
        "name": "Upload to Root Directory",
        "text": "Upload the robots.txt file to your website's root directory (e.g., https://example.com/robots.txt) so search engines can access it."
      }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is a robots.txt file?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A robots.txt file is a text file that tells search engine crawlers which pages or sections of your website they can or cannot access. It's placed in your website's root directory and follows the Robots Exclusion Protocol. The file helps you control how search engines crawl and index your site."
        }
      },
      {
        "@type": "Question",
        "name": "Why do I need a robots.txt file?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A robots.txt file helps you control which parts of your website search engines can crawl and index. It's useful for blocking private areas, preventing duplicate content issues, saving crawl budget, and directing crawlers to your sitemap. While not required, it's a best practice for SEO."
        }
      },
      {
        "@type": "Question",
        "name": "Where should I place my robots.txt file?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Your robots.txt file must be placed in your website's root directory and be accessible at https://example.com/robots.txt. It must be a plain text file (not HTML) and should be named exactly 'robots.txt' (lowercase)."
        }
      },
      {
        "@type": "Question",
        "name": "What is the difference between Allow and Disallow?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Allow specifies paths that crawlers are permitted to access, while Disallow specifies paths that should be blocked. Disallow rules take precedence over Allow rules. You can use both to fine-tune access control, for example, blocking a directory but allowing specific files within it."
        }
      },
      {
        "@type": "Question",
        "name": "What is a User-agent in robots.txt?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A User-agent identifies which search engine crawler the rules apply to. Use '*' to apply rules to all crawlers, or specify a specific bot like 'Googlebot', 'Bingbot', 'Slurp' (Yahoo), or others. Each User-agent section can have its own Allow and Disallow rules."
        }
      },
      {
        "@type": "Question",
        "name": "Can I block specific search engines?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, you can create separate User-agent sections for different search engines. For example, you can block all crawlers except Google by using 'User-agent: *' with 'Disallow: /' and then 'User-agent: Googlebot' with 'Allow: /'. However, most legitimate search engines respect robots.txt."
        }
      },
      {
        "@type": "Question",
        "name": "Is this robots.txt generator free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, our robots.txt generator is 100% free to use. There's no registration required, no account needed, and no hidden fees. All processing happens in your browser, ensuring complete privacy and security."
        }
      },
      {
        "@type": "Question",
        "name": "What is Crawl-delay?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Crawl-delay specifies the number of seconds a crawler should wait between requests to your server. This helps prevent overloading your server with too many requests. Note that Google ignores crawl-delay, but other search engines like Bing may respect it."
        }
      }
    ]
  };

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>Robots.txt Generator - Free SEO Robots File Creator | FixTools</title>
        <meta name="title" content="Robots.txt Generator - Free SEO Robots File Creator | FixTools" />
        <meta name="description" content="Generate robots.txt files for your website instantly. Free robots.txt generator to control search engine crawlers. Create SEO-optimized robots.txt with no registration required." />
        <meta name="keywords" content="robots.txt generator, robots txt, robots.txt creator, robots file generator, seo robots.txt, robots.txt maker, robots exclusion protocol" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content="Robots.txt Generator - Free SEO Robots File Creator" />
        <meta property="og:description" content="Generate robots.txt files for your website instantly. Free robots.txt generator to control search engine crawlers." />
        <meta property="og:image" content={`${siteHost}/images/robots-txt-og.png`} />
        <meta property="og:site_name" content="FixTools" />
        
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content="Robots.txt Generator - Free SEO Robots File Creator" />
        <meta property="twitter:description" content="Generate robots.txt files for your website instantly. Free robots.txt generator for search engines." />
        <meta property="twitter:image" content={`${siteHost}/images/robots-txt-og.png`} />
        
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      </Head>

      <style jsx global>{`
        html:has(.robots-txt-generator-page) {
          font-size: 100% !important;
        }
        
        .robots-txt-generator-page {
          line-height: 1.5;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          width: 100%;
          min-height: 100vh;
        }
        
        .robots-txt-generator-page *,
        .robots-txt-generator-page *::before,
        .robots-txt-generator-page *::after {
          box-sizing: border-box;
        }
      `}</style>

      <div className="robots-txt-generator-page bg-[#fbfbfc] text-slate-900 min-h-screen">
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
            <li className="flex items-center gap-2"><span className="text-slate-400">/</span><span className="font-semibold text-slate-900">Robots.txt Generator</span></li>
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
                Robots.txt Generator
              </span>
            </h1>
            
            <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg md:leading-relaxed">
              Generate robots.txt files for your website instantly. Control which search engine crawlers can access your site and which pages they should avoid. All processing happens in your browser.
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
              {/* Presets */}
              <div className="rounded-3xl border-2 border-amber-300 bg-white p-6 shadow-xl">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Quick Presets</h2>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => loadPreset('allow-all')}
                    className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50"
                  >
                    Allow All
                  </button>
                  <button
                    onClick={() => loadPreset('disallow-all')}
                    className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50"
                  >
                    Block All
                  </button>
                  <button
                    onClick={() => loadPreset('common')}
                    className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50"
                  >
                    Common
                  </button>
                </div>
              </div>

              {/* User Agents */}
              {userAgents.map((ua, index) => (
                <div key={index} className="rounded-3xl border-2 border-amber-300 bg-white p-6 shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-slate-900">User-agent {index + 1}</h2>
                    {userAgents.length > 1 && (
                      <button
                        onClick={() => removeUserAgent(index)}
                        className="rounded-xl border border-red-300 bg-red-50 px-3 py-1 text-sm font-semibold text-red-700 transition-all hover:bg-red-100"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">User-agent</label>
                      <input
                        type="text"
                        value={ua.name}
                        onChange={(e) => updateUserAgent(index, 'name', e.target.value)}
                        placeholder="* (for all crawlers)"
                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                      />
                      <p className="mt-1 text-xs text-slate-500">Use '*' for all crawlers, or specify: Googlebot, Bingbot, etc.</p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Allow (one per line)</label>
                      <textarea
                        value={ua.allow.join('\n')}
                        onChange={(e) => updateUserAgent(index, 'allow', e.target.value)}
                        placeholder="/public/&#10;/images/"
                        rows="3"
                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 font-mono text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Disallow (one per line)</label>
                      <textarea
                        value={ua.disallow.join('\n')}
                        onChange={(e) => updateUserAgent(index, 'disallow', e.target.value)}
                        placeholder="/admin/&#10;/private/"
                        rows="3"
                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 font-mono text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Crawl-delay (seconds)</label>
                      <input
                        type="number"
                        value={ua.crawlDelay}
                        onChange={(e) => updateUserAgent(index, 'crawlDelay', e.target.value)}
                        placeholder="Optional"
                        min="0"
                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={addUserAgent}
                className="w-full rounded-xl border-2 border-dashed border-amber-300 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700 transition-all hover:bg-amber-100"
              >
                + Add Another User-agent
              </button>

              {/* Sitemap */}
              <div className="rounded-3xl border-2 border-amber-300 bg-white p-6 shadow-xl">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Sitemap (Optional)</h2>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Sitemap URL</label>
                  <input
                    type="url"
                    value={sitemapUrl}
                    onChange={(e) => setSitemapUrl(e.target.value)}
                    placeholder="https://example.com/sitemap.xml"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleClear}
                  className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50"
                >
                  Clear All
                </button>
              </div>
            </div>

            {/* Output Section */}
            <div className="space-y-6">
              <div className="rounded-3xl border-2 border-amber-300 bg-white p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-slate-900">Generated robots.txt</h2>
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
                
                <textarea
                  readOnly
                  value={output || 'Configure user agents above to generate robots.txt...'}
                  rows="20"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 font-mono text-xs text-slate-900 focus:outline-none"
                />
              </div>

              {/* Instructions */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <h3 className="font-semibold text-slate-900 mb-2">📝 How to Use</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-slate-600">
                  <li>Configure user agent rules (use '*' for all crawlers)</li>
                  <li>Add Allow and Disallow paths as needed</li>
                  <li>Optionally add crawl-delay and sitemap URL</li>
                  <li>Copy the generated robots.txt or download it</li>
                  <li>Upload robots.txt to your website's root directory</li>
                  <li>Verify it's accessible at https://example.com/robots.txt</li>
                </ol>
              </div>
            </div>
          </div>
        </section>

        {/* Content Sections - Following Blueprint */}
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 md:p-10 shadow-lg">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">What is a robots.txt File?</h2>
            <p className="text-base text-slate-700 leading-relaxed mb-4">
              A <strong>robots.txt</strong> file is a text file that tells search engine crawlers which pages or sections of your website they can or cannot access. According to <a href="https://developers.google.com/search/docs/crawling-indexing/robots/robots_txt" target="_blank" rel="noopener noreferrer" className="text-amber-700 hover:text-amber-800 font-semibold underline">Google's Search Central</a>, robots.txt files follow the Robots Exclusion Protocol and help you control how search engines crawl and index your site.
            </p>
            <p className="text-base text-slate-700 leading-relaxed mb-4">
              The robots.txt file was created in 1994 and is now an <a href="https://www.robotstxt.org/" target="_blank" rel="noopener noreferrer" className="text-amber-700 hover:text-amber-800 font-semibold underline">official standard</a> maintained by the Internet Engineering Task Force (IETF). It's supported by all major search engines including Google, Bing, Yahoo, and others. The protocol is defined in <a href="https://datatracker.ietf.org/doc/html/rfc9309" target="_blank" rel="noopener noreferrer" className="text-amber-700 hover:text-amber-800 font-semibold underline">RFC 9309</a>.
            </p>
            <p className="text-base text-slate-700 leading-relaxed mb-4">
              Key components of a robots.txt file include:
            </p>
            <ul className="list-disc list-inside space-y-2 text-base text-slate-700 mb-4">
              <li><strong>User-agent:</strong> Specifies which crawler the rules apply to (use '*' for all crawlers)</li>
              <li><strong>Allow:</strong> Specifies paths that crawlers are permitted to access</li>
              <li><strong>Disallow:</strong> Specifies paths that should be blocked from crawling</li>
              <li><strong>Crawl-delay:</strong> Specifies the number of seconds a crawler should wait between requests</li>
              <li><strong>Sitemap:</strong> Points to the location of your XML sitemap file</li>
            </ul>
            <p className="text-base text-slate-700 leading-relaxed mb-4">
              Robots.txt files are especially important for controlling crawl budget, preventing duplicate content issues, blocking private areas, and directing search engines to your sitemap. However, it's important to note that robots.txt is a suggestion, not a security measure - malicious bots may ignore it. According to <a href="https://www.bing.com/webmasters/help/robots-txt-file-3b5ef6b2" target="_blank" rel="noopener noreferrer" className="text-amber-700 hover:text-amber-800 font-semibold underline">Bing Webmaster Tools</a>, robots.txt is one of the most effective ways to manage how search engines crawl your site.
            </p>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 md:p-10 shadow-lg">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Robots.txt Impact & Statistics</h2>
            <p className="text-base text-slate-700 leading-relaxed mb-6">
              Understanding the impact of robots.txt files helps you appreciate their importance in SEO and crawl management.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-3">SEO Impact</h3>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold mt-0.5">•</span>
                    <span><strong>Crawl Budget:</strong> Proper robots.txt can save 20-30% of crawl budget</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold mt-0.5">•</span>
                    <span><strong>Indexing Control:</strong> 90%+ of websites use robots.txt</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold mt-0.5">•</span>
                    <span><strong>Duplicate Content:</strong> Helps prevent duplicate content indexing</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-3">Technical Specifications</h3>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold mt-0.5">•</span>
                    <span><strong>File Size:</strong> Maximum 500KB (recommended under 100KB)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold mt-0.5">•</span>
                    <span><strong>Format:</strong> Plain text (UTF-8 encoding)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold mt-0.5">•</span>
                    <span><strong>Location:</strong> Must be in root directory</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-3">Robots.txt Usage Statistics</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm text-slate-700">
                <div>
                  <p className="font-semibold text-slate-900 mb-1">Websites Using robots.txt</p>
                  <p className="text-2xl font-bold text-emerald-600">90%+</p>
                  <p className="text-xs text-slate-600 mt-1">Of all indexed websites</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900 mb-1">Average File Size</p>
                  <p className="text-2xl font-bold text-emerald-600">2-5KB</p>
                  <p className="text-xs text-slate-600 mt-1">Most robots.txt files</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900 mb-1">Crawl Budget Savings</p>
                  <p className="text-2xl font-bold text-emerald-600">20-30%</p>
                  <p className="text-xs text-slate-600 mt-1">With proper configuration</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Use Section */}
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 md:p-10 shadow-lg">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Use a Robots.txt Generator?</h2>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Robots.txt generators simplify the process of creating properly formatted robots.txt files, ensuring search engines can correctly interpret your crawl directives. Here are the key benefits:
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
                      Manually creating robots.txt files is time-consuming and error-prone. Our generator ensures proper formatting, correct syntax, and valid directives. Create perfect robots.txt files in seconds instead of minutes.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-amber-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Control Crawl Budget</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Properly configured robots.txt files can save 20-30% of your crawl budget by preventing search engines from wasting time on unimportant or duplicate pages. This ensures crawlers focus on your most valuable content.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-amber-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
                    <span className="text-2xl">🔒</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Protect Private Areas</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Block search engines from indexing private areas like admin panels, user accounts, staging environments, and internal tools. While not a security measure, it prevents these pages from appearing in search results.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-amber-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
                    <span className="text-2xl">📊</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Prevent Duplicate Content</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Use robots.txt to block duplicate content, print-friendly pages, filtered views, and other variations that could dilute your SEO efforts. This helps search engines focus on your canonical content.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-amber-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg">
                    <span className="text-2xl">🗺️</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Direct to Sitemap</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Include your sitemap URL in robots.txt to help search engines discover your XML sitemap. This provides an additional way for crawlers to find all your important pages beyond following links.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-amber-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 shadow-lg">
                    <span className="text-2xl">✅</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Ensure Standards Compliance</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Our generator ensures your robots.txt file follows the official Robots Exclusion Protocol (RFC 9309). This prevents syntax errors, ensures proper formatting, and guarantees compatibility with all major search engines.
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
                  <span>Generate properly formatted robots.txt files instantly</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold mt-0.5">✓</span>
                  <span>Control crawl budget and save server resources</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold mt-0.5">✓</span>
                  <span>Protect private areas from search engine indexing</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold mt-0.5">✓</span>
                  <span>Prevent duplicate content issues</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold mt-0.5">✓</span>
                  <span>Direct search engines to your sitemap</span>
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
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Best Practices for Robots.txt Files</h2>
            <p className="text-base text-slate-700 leading-relaxed mb-6">
              Following robots.txt best practices ensures your file works correctly and helps search engines crawl your site efficiently.
            </p>

            <div className="space-y-6">
              <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-3">File Location & Format Best Practices</h3>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold mt-0.5">•</span>
                    <span><strong>Root Directory:</strong> Place robots.txt in your website's root directory (e.g., https://example.com/robots.txt)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold mt-0.5">•</span>
                    <span><strong>File Name:</strong> Must be exactly 'robots.txt' (lowercase, no spaces)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold mt-0.5">•</span>
                    <span><strong>Encoding:</strong> Use UTF-8 encoding for proper character support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold mt-0.5">•</span>
                    <span><strong>File Size:</strong> Keep under 500KB (recommended under 100KB for faster parsing)</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-3">Content Best Practices</h3>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold mt-0.5">•</span>
                    <span><strong>User-agent Order:</strong> More specific user-agents should come before general ones (e.g., 'Googlebot' before '*')</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold mt-0.5">•</span>
                    <span><strong>Path Matching:</strong> Use '/' to block everything, or specific paths like '/admin/' to block directories</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold mt-0.5">•</span>
                    <span><strong>Wildcards:</strong> Use '*' for matching patterns (e.g., 'Disallow: /*.pdf$' blocks all PDFs)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold mt-0.5">•</span>
                    <span><strong>Sitemap Location:</strong> Always include your sitemap URL to help search engines discover it</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-3">Security & Testing Best Practices</h3>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold mt-0.5">•</span>
                    <span><strong>Not a Security Tool:</strong> Remember that robots.txt is a suggestion, not a security measure. Use proper authentication for sensitive areas.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold mt-0.5">•</span>
                    <span><strong>Test Your File:</strong> Use Google Search Console's robots.txt Tester to verify your file works correctly</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold mt-0.5">•</span>
                    <span><strong>Monitor in Search Console:</strong> Check for robots.txt errors and warnings in Google Search Console</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold mt-0.5">•</span>
                    <span><strong>Keep It Updated:</strong> Update your robots.txt whenever you add or remove sections that should be blocked</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-3">Common Mistakes to Avoid</h3>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold mt-0.5">✗</span>
                    <span><strong>Blocking Important Pages:</strong> Accidentally blocking your homepage or important content pages</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold mt-0.5">✗</span>
                    <span><strong>Syntax Errors:</strong> Typos, incorrect capitalization, or missing colons in directives</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold mt-0.5">✗</span>
                    <span><strong>Wrong Location:</strong> Placing robots.txt in a subdirectory instead of root</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold mt-0.5">✗</span>
                    <span><strong>Over-blocking:</strong> Blocking too much content, preventing search engines from indexing valuable pages</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold mt-0.5">✗</span>
                    <span><strong>Missing Sitemap:</strong> Not including your sitemap URL in robots.txt</span>
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

