import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import PaymentModal from '../../components/PaymentModal';
import { 
  checkPaymentRequirement as checkPaymentRequirementNew, 
  getUserPlan
} from '../../lib/config/pricing';
import { hasValidProcessingPass as hasValidProcessingPassNew } from '../../lib/payments/payment-utils';

const siteHost = (process.env.NEXT_PUBLIC_HOST || 'https://fixtools.io').replace(/\/$/, '');

export default function MetadataExtractor() {
  const [urls, setUrls] = useState(['']);
  const [results, setResults] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentRequirement, setPaymentRequirement] = useState(null);
  const [userSession, setUserSession] = useState({ processingPass: null });
  const [processingProgress, setProcessingProgress] = useState({ current: 0, total: 0, currentUrl: '' });

  const currentYear = new Date().getFullYear();
  const canonicalUrl = `${siteHost}/web-tools/metadata-extractor`;

  // Check for valid processing pass
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const passData = localStorage.getItem('processingPass');
      if (passData) {
        try {
          const pass = JSON.parse(passData);
          const session = { processingPass: pass };
          if (hasValidProcessingPassNew(session)) {
            setUserSession(session);
          } else {
            localStorage.removeItem('processingPass');
            setUserSession({ processingPass: null });
          }
        } catch (e) {
          localStorage.removeItem('processingPass');
          setUserSession({ processingPass: null });
        }
      }
    }
  }, []);

  const handleUrlChange = (index, value) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  const addUrlField = () => {
    setUrls([...urls, '']);
  };

  const removeUrlField = (index) => {
    if (urls.length > 1) {
      setUrls(urls.filter((_, i) => i !== index));
    }
  };

  const handleClear = () => {
    setUrls(['']);
    setResults([]);
    setError('');
    setIsProcessing(false);
  };

  const handleExtractMetadata = async () => {
    const validUrls = urls.filter(url => url.trim());
    
    if (validUrls.length === 0) {
      setError('Please enter at least one URL.');
      return;
    }

    // Validate URLs
    for (const url of validUrls) {
      try {
        const trimmedUrl = url.trim();
        if (!trimmedUrl || trimmedUrl.length < 3) {
          setError('Please enter valid URLs.');
          return;
        }
      } catch (e) {
        setError('Please enter valid URLs.');
        return;
      }
    }

    // Check payment requirement (batch check)
    const urlCount = validUrls.length;
    const userPlan = getUserPlan(userSession);
    
    // For 4+ URLs: Require payment before processing
    if (urlCount >= 4) {
      const batchRequirement = checkPaymentRequirementNew('web-tools', 0, urlCount, userPlan);
      
      // Check if user has valid pass
      const hasValidPass = hasValidProcessingPassNew(userSession);
      
      if (!hasValidPass && batchRequirement.requiresPayment && batchRequirement.reason === 'batch') {
        const paymentReq = {
          requiresPayment: true,
          reason: 'batch',
          urlCount: urlCount,
          message: `Batch processing (${urlCount} URLs) requires a Processing Pass. Free tier allows up to 3 URLs at a time.`,
          ...batchRequirement,
        };
        
        setPaymentRequirement(paymentReq);
        setShowPaymentModal(true);
        setIsProcessing(false);
        return;
      }
    }

    setIsProcessing(true);
    setError('');
    setResults([]);
    setProcessingProgress({ current: 0, total: validUrls.length, currentUrl: validUrls[0] || '' });

    try {
      const passData = typeof window !== 'undefined' ? localStorage.getItem('processingPass') : null;
      let sessionId = null;
      
      if (passData) {
        try {
          const pass = JSON.parse(passData);
          const session = { processingPass: pass };
          if (hasValidProcessingPassNew(session)) {
            sessionId = pass.sessionId || null;
          }
        } catch (e) {
          // Invalid pass data
        }
      }

      setProcessingProgress({ current: 0, total: validUrls.length, currentUrl: 'Extracting metadata...' });

      const response = await fetch('/api/web-tools/metadata-extractor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: validUrls[0],
          urls: validUrls,
          sessionId: sessionId,
        }),
      });

      if (validUrls.length === 1) {
        setProcessingProgress({ current: 0, total: 1, currentUrl: validUrls[0] });
      } else {
        setProcessingProgress({ current: 1, total: validUrls.length, currentUrl: 'Analyzing metadata...' });
      }

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 402) {
          setPaymentRequirement(data.requirement);
          setShowPaymentModal(true);
          setIsProcessing(false);
          return;
        }
        throw new Error(data.message || data.error || 'Failed to extract metadata');
      }

      if (data.success && data.results) {
        setProcessingProgress({ current: data.results.length, total: validUrls.length, currentUrl: 'Complete' });
        setResults(data.results);
      }
    } catch (err) {
      console.error('Metadata extraction error:', err);
      setError(err.message || 'Failed to extract metadata. Please try again.');
    } finally {
      setIsProcessing(false);
      setProcessingProgress({ current: 0, total: 0, currentUrl: '' });
    }
  };

  const handlePaymentSuccess = () => {
    const passData = localStorage.getItem('processingPass');
    if (passData) {
      try {
        const pass = JSON.parse(passData);
        setUserSession({ processingPass: pass });
      } catch (e) {
        // Invalid pass data
      }
    }
    setShowPaymentModal(false);
    if (urls.filter(u => u.trim()).length > 0) {
      handleExtractMetadata();
    }
  };

  // Structured Data
  const structuredData = {
    faqPage: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How do I extract website metadata?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Enter the URL (with or without https://) in the input field, then click 'Extract Metadata'. The tool will analyze the website's HTML and extract all metadata including meta tags, Open Graph tags, Twitter Card tags, and structured data (JSON-LD). Results typically appear within 3-10 seconds."
          }
        },
        {
          "@type": "Question",
          "name": "What is website metadata?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Website metadata is information about a webpage that's not directly visible to users but is used by browsers, search engines, and social media platforms. Metadata includes title tags, meta descriptions, Open Graph tags (for social sharing), Twitter Card tags, structured data (JSON-LD), and other HTML meta tags. Metadata helps search engines understand content and helps social platforms display rich previews when links are shared."
          }
        },
        {
          "@type": "Question",
          "name": "What are Open Graph tags?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Open Graph tags are meta tags that control how content appears when shared on social media platforms like Facebook, LinkedIn, and Twitter. They include og:title, og:description, og:image, og:url, og:type, and more. Open Graph tags ensure your website looks good when shared on social media, increasing click-through rates and engagement."
          }
        },
        {
          "@type": "Question",
          "name": "What are Twitter Card tags?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Twitter Card tags are meta tags specifically for Twitter that create rich previews when links are shared. They include twitter:card, twitter:title, twitter:description, twitter:image, and twitter:site. Twitter Cards make shared links more visually appealing and engaging, increasing click-through rates on Twitter."
          }
        },
        {
          "@type": "Question",
          "name": "Can I extract metadata from multiple websites at once?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Batch processing (4+ URLs) requires a Processing Pass. Free tier allows extracting metadata from up to 3 URLs at a time. With a Processing Pass, you can extract metadata from up to 20 URLs in a single batch, making it efficient for analyzing multiple websites or your entire portfolio."
          }
        },
        {
          "@type": "Question",
          "name": "What is structured data (JSON-LD)?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Structured data (JSON-LD) is machine-readable code that helps search engines understand your content better. It uses Schema.org vocabulary to describe content, enabling rich snippets in search results. Common types include Organization, Article, Product, FAQPage, BreadcrumbList, and more. Structured data can improve search rankings and enable rich search results."
          }
        },
        {
          "@type": "Question",
          "name": "Is this metadata extractor tool free to use?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, our Website Metadata Extractor tool is free for single URL checks (up to 5 checks per day). Batch processing and higher daily limits require a Processing Pass. We aim to provide valuable tools for free while offering premium options for power users and businesses."
          }
        }
      ]
    },
    
    softwareApp: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Website Metadata Extractor",
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "Any",
      "description": "Free online website metadata extractor. Extract and analyze meta tags, Open Graph tags, Twitter Card tags, and structured data. Check multiple websites with batch processing.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "1700",
        "bestRating": "5",
        "worstRating": "1"
      },
      "featureList": [
        "Meta tag extraction",
        "Open Graph tag analysis",
        "Twitter Card tag extraction",
        "Structured data (JSON-LD) extraction",
        "Canonical URL detection",
        "Favicon extraction",
        "Batch processing (with pass)",
        "Comprehensive metadata reports"
      ]
    },
    
    howTo: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Extract Website Metadata",
      "description": "Step-by-step guide to extracting and analyzing website metadata online for free",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Enter URL",
          "text": "Enter the URL you want to analyze (e.g., https://example.com) into the input field. You can include or omit https:// - the tool will add it if missing.",
          "position": 1
        },
        {
          "@type": "HowToStep",
          "name": "Extract Metadata",
          "text": "Click the 'Extract Metadata' button. The tool will analyze the website's HTML and extract all metadata. This typically takes 3-10 seconds.",
          "position": 2
        },
        {
          "@type": "HowToStep",
          "name": "Review Results",
          "text": "View the metadata analysis including basic meta tags, Open Graph tags, Twitter Card tags, structured data, and other metadata. Use the results to understand how the website's metadata is configured and identify opportunities for improvement.",
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
          "name": "Web Tools",
          "item": `${siteHost}/tools/web-tools`
        },
        {
          "@type": "ListItem",
          "position": 4,
          "name": "Website Metadata Extractor",
          "item": canonicalUrl
        }
      ]
    }
  };

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>Website Metadata Extractor - Free Online Meta Tag Analyzer | FixTools</title>
        <meta name="title" content="Website Metadata Extractor - Free Online Meta Tag Analyzer | FixTools" />
        <meta name="description" content="Extract and analyze website metadata, meta tags, Open Graph tags, and structured data. Free website metadata checker and SEO tag analyzer tool with comprehensive metadata reports." />
        <meta name="keywords" content="metadata extractor, meta tag checker, open graph checker, twitter card checker, structured data extractor, json-ld extractor, metadata analyzer, seo tag checker, meta tags analyzer, website metadata" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content="Website Metadata Extractor - Free Online Meta Tag Analyzer" />
        <meta property="og:description" content="Extract and analyze website metadata, meta tags, Open Graph tags, and structured data." />
        <meta property="og:image" content={`${siteHost}/images/og-metadata-extractor.png`} />
        <meta property="og:site_name" content="FixTools" />
        
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content="Website Metadata Extractor - Free Online Meta Tag Analyzer" />
        <meta property="twitter:description" content="Extract and analyze website metadata, meta tags, Open Graph tags, and structured data." />
        <meta property="twitter:image" content={`${siteHost}/images/og-metadata-extractor.png`} />
        
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.faqPage) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.softwareApp) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.howTo) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.breadcrumb) }} />
      </Head>

      <style jsx global>{`
        html:has(.metadata-extractor-page) {
          font-size: 100% !important;
        }
        
        .metadata-extractor-page * {
          box-sizing: border-box;
        }
        
        .metadata-extractor-page h1,
        .metadata-extractor-page h2,
        .metadata-extractor-page h3,
        .metadata-extractor-page p,
        .metadata-extractor-page ul,
        .metadata-extractor-page ol {
          margin: 0;
        }
        
        .metadata-extractor-page button {
          font-family: inherit;
          cursor: pointer;
        }
        
        .metadata-extractor-page input,
        .metadata-extractor-page textarea,
        .metadata-extractor-page select {
          font-family: inherit;
        }
        
        /* Fix typography styling within metadata extractor page sections */
        .metadata-extractor-page section .max-w-none {
          font-size: 16px !important;
          line-height: 1.75 !important;
          color: #334155 !important;
        }
        
        .metadata-extractor-page section .max-w-none h3 {
          font-size: 20px !important;
          font-weight: 700 !important;
          line-height: 1.75rem !important;
          margin-top: 1.5rem !important;
          margin-bottom: 0.75rem !important;
          color: #0f172a !important;
        }
        
        .metadata-extractor-page section .max-w-none p {
          font-size: 16px !important;
          line-height: 1.75 !important;
          margin-bottom: 1rem !important;
          margin-top: 0 !important;
          color: #334155 !important;
        }
        
        .metadata-extractor-page section .max-w-none ol {
          margin-top: 1rem !important;
          margin-bottom: 1rem !important;
          padding-left: 1.5rem !important;
          color: #334155 !important;
          list-style-type: decimal !important;
          list-style-position: outside !important;
        }
        
        .metadata-extractor-page section .max-w-none ul {
          margin-top: 1rem !important;
          margin-bottom: 1rem !important;
          padding-left: 1.5rem !important;
          color: #334155 !important;
          list-style-type: disc !important;
          list-style-position: outside !important;
        }
        
        .metadata-extractor-page section .max-w-none ol li,
        .metadata-extractor-page section .max-w-none ul li {
          margin-top: 0.75rem !important;
          margin-bottom: 0.75rem !important;
          line-height: 1.75 !important;
          padding-left: 0.5rem !important;
          font-size: 16px !important;
        }
        
        .metadata-extractor-page section .max-w-none strong {
          font-weight: 600 !important;
          color: #0f172a !important;
        }
        
        .metadata-extractor-page section .max-w-none a {
          color: #7c3aed !important;
          text-decoration: underline !important;
          font-weight: 500 !important;
        }
        
        .metadata-extractor-page section .max-w-none a:hover {
          color: #6d28d9 !important;
        }
        
        /* Override global CSS font-size for this page */
        .metadata-extractor-page {
          font-size: 16px !important;
        }
        
        .metadata-extractor-page h1 {
          font-size: 3rem !important;
        }
        
        .metadata-extractor-page h2 {
          font-size: 1.875rem !important;
        }
        
        .metadata-extractor-page h3 {
          font-size: 1.25rem !important;
        }
        
        .metadata-extractor-page p,
        .metadata-extractor-page li,
        .metadata-extractor-page span {
          font-size: 1rem !important;
        }
      `}</style>

      <div className="metadata-extractor-page bg-[#fbfbfc] text-slate-900 min-h-screen">
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/fixtools-logos/fixtools-logos_black.svg" alt="FixTools" width={120} height={40} className="h-9 w-auto" />
            </Link>
            <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
              <Link className="hover:text-slate-900 transition-colors" href="/tools/json">JSON</Link>
              <Link className="hover:text-slate-900 transition-colors" href="/tools/html">HTML</Link>
              <Link className="hover:text-slate-900 transition-colors" href="/tools/web-tools">Web Tools</Link>
              <Link className="hover:text-slate-900 transition-colors" href="/">All tools</Link>
            </nav>
            <Link href="/tools" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50 transition-colors">
              Browse tools
            </Link>
          </div>
        </header>

        <nav className="mx-auto max-w-6xl px-4 py-3" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm text-slate-600">
            <li><Link href="/" className="hover:text-slate-900 transition-colors">Home</Link></li>
            <li className="flex items-center gap-2"><span className="text-slate-400">/</span><Link href="/tools" className="hover:text-slate-900 transition-colors">Tools</Link></li>
            <li className="flex items-center gap-2"><span className="text-slate-400">/</span><Link href="/tools/web-tools" className="hover:text-slate-900 transition-colors">Web Tools</Link></li>
            <li className="flex items-center gap-2"><span className="text-slate-400">/</span><span className="font-semibold text-slate-900">Website Metadata Extractor</span></li>
          </ol>
        </nav>

        <section className="relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.35]" style={{ backgroundImage: 'url(/grid.png)', backgroundSize: '256px 256px' }}></div>
          <div className="mx-auto max-w-6xl px-4 py-10 md:py-14 relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-gradient-to-r from-indigo-50 to-violet-50 px-4 py-1.5 text-xs font-semibold text-indigo-700 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              Free • Fast • Comprehensive
            </div>
            
            <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent">
                Website Metadata Extractor
              </span>
            </h1>
            
            <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg md:leading-relaxed">
              Extract and analyze website metadata, meta tags, Open Graph tags, and structured data with our free <strong>Website Metadata Extractor</strong> tool. Get comprehensive metadata reports instantly.
            </p>

            <dl className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
              <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Meta Tags</dt>
                <dd className="mt-1.5 text-sm font-bold text-slate-900">Full Extraction</dd>
              </div>
              <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Open Graph</dt>
                <dd className="mt-1.5 text-sm font-bold text-slate-900">Social Tags</dd>
              </div>
              <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Speed</dt>
                <dd className="mt-1.5 text-sm font-bold text-slate-900">3-10 seconds</dd>
              </div>
              <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Price</dt>
                <dd className="mt-1.5 text-sm font-bold text-slate-900">Free</dd>
              </div>
            </dl>
          </div>
        </section>

        <section id="tool" className="mx-auto max-w-6xl px-4 pb-12 pt-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 md:p-7" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Extract Website Metadata</h2>
                <p className="mt-1 text-sm text-slate-600">Enter URL(s), then click 'Extract Metadata' to analyze meta tags and structured data.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button onClick={handleClear} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50">Clear</button>
                <button 
                  onClick={handleExtractMetadata} 
                  disabled={isProcessing}
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Extracting...' : '📋 Extract Metadata'}
                </button>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-12">
              <div className="md:col-span-8">
                <label className="mb-2 block text-sm font-semibold text-slate-800">URL(s)</label>
                <div className="space-y-2">
                  {urls.map((url, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={url}
                        onChange={(e) => handleUrlChange(index, e.target.value)}
                        placeholder="https://example.com"
                        className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-indigo-900/20"
                      />
                      {urls.length > 1 && (
                        <button
                          onClick={() => removeUrlField(index)}
                          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={addUrlField}
                    className="rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100"
                  >
                    + Add URL (Batch)
                  </button>
                </div>
                {error && (
                  <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                {/* Processing Progress Indicator */}
                {isProcessing && (
                  <div className="mt-6 rounded-xl border-2 border-indigo-200 bg-gradient-to-r from-indigo-50 to-violet-50 p-6">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                      <p className="text-sm font-semibold text-indigo-900">
                        Extracting metadata{processingProgress.total > 1 && ` (${processingProgress.current}/${processingProgress.total})`}...
                      </p>
                    </div>
                    {processingProgress.total > 1 && (
                      <div className="mt-3">
                        <div className="w-full bg-indigo-200 rounded-full h-2.5">
                          <div 
                            className="bg-gradient-to-r from-indigo-600 to-violet-600 h-2.5 rounded-full transition-all duration-300"
                            style={{ width: `${(processingProgress.current / processingProgress.total) * 100}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-indigo-700 mt-2 text-center">
                          Processing {processingProgress.current} of {processingProgress.total} URL{processingProgress.total !== 1 ? 's' : ''}
                        </p>
                      </div>
                    )}
                    {processingProgress.total === 1 && (
                      <div className="mt-3">
                        <div className="w-full bg-indigo-200 rounded-full h-2.5 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-indigo-600 to-violet-600 h-2.5 rounded-full animate-pulse"
                            style={{ width: '60%' }}
                          ></div>
                        </div>
                        <p className="text-xs text-indigo-700 mt-2 text-center">
                          {processingProgress.currentUrl || 'Analyzing HTML...'}
                        </p>
                      </div>
                    )}
                    <p className="text-xs text-indigo-600 mt-3 text-center">
                      This may take 3-10 seconds per URL
                    </p>
                  </div>
                )}
              </div>

              <div className="md:col-span-4">
                <label className="mb-2 block text-sm font-semibold text-slate-800">Info</label>
                <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="rounded-xl border border-violet-200 bg-violet-50 p-3">
                    <p className="text-xs font-semibold text-violet-900 mb-1">Free Tier Limits</p>
                    <p className="text-xs text-violet-700">Up to 3 URLs per check</p>
                    <p className="text-xs text-violet-700">5 checks per day</p>
                    <p className="text-xs text-violet-700">4+ URLs: Requires pass</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary Statistics */}
            {results.length > 0 && (
              <div className="mt-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="rounded-xl border border-slate-200 bg-white p-3 text-center">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Total</p>
                    <p className="text-2xl font-bold text-slate-900">{results.length}</p>
                  </div>
                  <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-center">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">With Title</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {results.filter(r => r.summary?.hasTitle).length}
                    </p>
                  </div>
                  <div className="rounded-xl border border-green-200 bg-green-50 p-3 text-center">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">With OG</p>
                    <p className="text-2xl font-bold text-green-600">
                      {results.filter(r => r.summary?.hasOpenGraph).length}
                    </p>
                  </div>
                  <div className="rounded-xl border border-purple-200 bg-purple-50 p-3 text-center">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">With Twitter</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {results.filter(r => r.summary?.hasTwitter).length}
                    </p>
                  </div>
                  <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-3 text-center">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">With Schema</p>
                    <p className="text-2xl font-bold text-indigo-600">
                      {results.filter(r => r.summary?.hasStructuredData).length}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Metadata Extraction Results */}
            {results.length > 0 && (
              <div className="mt-6 space-y-6">
                <h3 className="text-lg font-semibold text-slate-900">Extraction Results</h3>
                {results.map((result, index) => (
                  <div key={index} className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-5">
                    {result.error ? (
                      <div className="text-red-700 text-sm">
                        <p className="font-semibold">Error for {result.url}:</p>
                        <p>{result.error}</p>
                      </div>
                    ) : result.metadata ? (
                      <>
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{result.url}</p>
                            <p className="text-xs text-slate-600">
                              Status: {result.statusCode} • Extracted {new Date(result.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>

                        {/* Basic Metadata */}
                        {result.metadata.basic && Object.keys(result.metadata.basic).length > 0 && (
                          <div className="mb-4 rounded-xl border-2 border-blue-200 bg-blue-50 p-4">
                            <h4 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
                              <span className="text-blue-600">📄</span>
                              Basic Metadata
                            </h4>
                            <div className="space-y-2 text-sm">
                              {Object.entries(result.metadata.basic).map(([key, value]) => (
                                <div key={key} className="flex justify-between items-start rounded-lg border border-blue-200 bg-white p-3">
                                  <span className="text-slate-600 font-mono text-xs">{key}:</span>
                                  <span className="font-medium text-slate-900 break-all text-right ml-4 max-w-md">
                                    {value || 'Not set'}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Open Graph Tags */}
                        {result.metadata.openGraph && Object.keys(result.metadata.openGraph).length > 0 && (
                          <div className="mb-4 rounded-xl border-2 border-green-200 bg-green-50 p-4">
                            <h4 className="text-sm font-semibold text-green-900 mb-3 flex items-center gap-2">
                              <span className="text-green-600">📱</span>
                              Open Graph Tags ({Object.keys(result.metadata.openGraph).length})
                            </h4>
                            <div className="space-y-2 text-sm">
                              {Object.entries(result.metadata.openGraph).map(([key, value]) => (
                                <div key={key} className="flex justify-between items-start rounded-lg border border-green-200 bg-white p-3">
                                  <span className="text-slate-600 font-mono text-xs">og:{key}:</span>
                                  <span className="font-medium text-slate-900 break-all text-right ml-4 max-w-md">
                                    {value || 'Not set'}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Twitter Card Tags */}
                        {result.metadata.twitter && Object.keys(result.metadata.twitter).length > 0 && (
                          <div className="mb-4 rounded-xl border-2 border-purple-200 bg-purple-50 p-4">
                            <h4 className="text-sm font-semibold text-purple-900 mb-3 flex items-center gap-2">
                              <span className="text-purple-600">🐦</span>
                              Twitter Card Tags ({Object.keys(result.metadata.twitter).length})
                            </h4>
                            <div className="space-y-2 text-sm">
                              {Object.entries(result.metadata.twitter).map(([key, value]) => (
                                <div key={key} className="flex justify-between items-start rounded-lg border border-purple-200 bg-white p-3">
                                  <span className="text-slate-600 font-mono text-xs">twitter:{key}:</span>
                                  <span className="font-medium text-slate-900 break-all text-right ml-4 max-w-md">
                                    {value || 'Not set'}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Structured Data */}
                        {result.metadata.structuredData && result.metadata.structuredData.length > 0 && (
                          <div className="mb-4 rounded-xl border-2 border-indigo-200 bg-indigo-50 p-4">
                            <h4 className="text-sm font-semibold text-indigo-900 mb-3 flex items-center gap-2">
                              <span className="text-indigo-600">🔷</span>
                              Structured Data (JSON-LD) ({result.metadata.structuredData.length})
                            </h4>
                            <div className="space-y-3">
                              {result.metadata.structuredData.map((sd, sdIndex) => (
                                <details key={sdIndex} className="rounded-lg border border-indigo-200 bg-white p-3">
                                  <summary className="cursor-pointer text-sm font-semibold text-indigo-900 mb-2">
                                    {sd['@type'] || 'Unknown Type'}
                                  </summary>
                                  <pre className="text-xs text-slate-700 overflow-x-auto mt-2 p-2 bg-slate-50 rounded border border-slate-200">
                                    {JSON.stringify(sd, null, 2)}
                                  </pre>
                                </details>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Other Metadata */}
                        {result.metadata.other && Object.keys(result.metadata.other).length > 0 && (
                          <details className="rounded-xl border-2 border-slate-200 bg-white p-4">
                            <summary className="cursor-pointer text-sm font-semibold text-slate-900 mb-3">
                              Other Metadata ({Object.keys(result.metadata.other).length})
                            </summary>
                            <div className="space-y-2 text-sm mt-3">
                              {Object.entries(result.metadata.other).map(([key, value]) => (
                                <div key={key} className="flex justify-between items-start rounded-lg border border-slate-200 bg-slate-50 p-2">
                                  <span className="text-slate-600 font-mono text-xs">{key}:</span>
                                  <span className="font-medium text-slate-900 break-all text-right ml-4 max-w-md text-xs">
                                    {value || 'Not set'}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </details>
                        )}
                      </>
                    ) : (
                      <div className="text-slate-600 text-sm">
                        <p>No metadata found for {result.url}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          requirement={paymentRequirement}
          onPaymentSuccess={handlePaymentSuccess}
        />

        {/* Educational Content Sections - 2,500+ words */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">What is Website Metadata?</h2>
            </div>
            
            <div className="max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                <strong>Website metadata</strong> is information about a webpage that's not directly visible to users but is used by browsers, search engines, and social media platforms. Metadata includes title tags, meta descriptions, Open Graph tags (for social sharing), Twitter Card tags, structured data (JSON-LD), and other HTML meta tags. Metadata helps search engines understand content and helps social platforms display rich previews when links are shared.
              </p>
              
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                When you share a link on social media or when search engines index your website, metadata provides context about the content. Title tags appear in search results and browser tabs. Meta descriptions appear in search results below titles. Open Graph tags control how content appears when shared on Facebook, LinkedIn, and other platforms. Twitter Card tags create rich previews on Twitter. Structured data helps search engines understand content structure and enables rich snippets.
              </p>

              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Website metadata is essential for SEO, social media sharing, and user experience. Proper metadata helps search engines understand and rank content, creates attractive social media previews that increase click-through rates, provides context for browser bookmarks and history, enables rich search results with structured data, and improves overall discoverability and engagement.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">How Website Metadata Works</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Website metadata is embedded in the HTML <code>&lt;head&gt;</code> section of web pages:
              </p>
              <ol className="space-y-3 mb-4 ml-6 text-slate-700" style={{ listStyleType: 'decimal', listStylePosition: 'outside', paddingLeft: '1.5rem' }}>
                <li className="leading-relaxed pl-2" style={{ fontSize: '16px', lineHeight: '1.75' }}><strong>HTML Head Section:</strong> Metadata is placed in the <code>&lt;head&gt;</code> section of HTML documents, before the visible content. Browsers and crawlers read this section to understand the page before rendering content.</li>
                <li className="leading-relaxed pl-2" style={{ fontSize: '16px', lineHeight: '1.75' }}><strong>Search Engine Crawling:</strong> Search engine crawlers read metadata to understand page content, relevance, and structure. This information helps determine rankings and what appears in search results.</li>
                <li className="leading-relaxed pl-2" style={{ fontSize: '16px', lineHeight: '1.75' }}><strong>Social Media Sharing:</strong> When links are shared on social media, platforms fetch and read Open Graph and Twitter Card tags to create rich previews with images, titles, and descriptions.</li>
                <li className="leading-relaxed pl-2" style={{ fontSize: '16px', lineHeight: '1.75' }}><strong>Browser Display:</strong> Browsers use metadata to display page titles in tabs, generate bookmarks, and show information in browser history. Title tags appear in browser tabs and bookmarks.</li>
                <li className="leading-relaxed pl-2" style={{ fontSize: '16px', lineHeight: '1.75' }}><strong>Rich Snippets:</strong> Structured data (JSON-LD) helps search engines understand content structure, enabling rich snippets in search results like star ratings, prices, FAQs, and event information.</li>
                <li className="leading-relaxed pl-2" style={{ fontSize: '16px', lineHeight: '1.75' }}><strong>SEO Signals:</strong> Metadata provides important SEO signals including page titles, descriptions, keywords, canonical URLs, and structured information that helps search engines understand and rank content.</li>
              </ol>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">Types of Website Metadata</h3>
              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-5">
                  <h4 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">📄</span>
                    Basic Meta Tags
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    Essential metadata including title, description, keywords, author, viewport, robots, and charset. These are the foundation of SEO and appear in search results.
                  </p>
                  <ul className="space-y-1 text-xs text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Title tag (appears in search results)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Meta description (search result snippet)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Meta keywords, author, viewport</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Robots meta tag (crawling instructions)</span>
                    </li>
                  </ul>
                </div>
                
                <div className="rounded-2xl border-2 border-green-200 bg-green-50 p-5">
                  <h4 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 text-green-600">📱</span>
                    Open Graph Tags
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    Meta tags that control how content appears when shared on social media platforms like Facebook, LinkedIn, and Twitter. They include og:title, og:description, og:image, og:url, and og:type.
                  </p>
                  <ul className="space-y-1 text-xs text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold mt-0.5">•</span>
                      <span>og:title (shared link title)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold mt-0.5">•</span>
                      <span>og:description (shared link description)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold mt-0.5">•</span>
                      <span>og:image (shared link image)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold mt-0.5">•</span>
                      <span>og:url, og:type, og:site_name</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border-2 border-purple-200 bg-purple-50 p-5">
                  <h4 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-purple-600">🐦</span>
                    Twitter Card Tags
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    Meta tags specifically for Twitter that create rich previews when links are shared. They include twitter:card, twitter:title, twitter:description, twitter:image, and twitter:site.
                  </p>
                  <ul className="space-y-1 text-xs text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>twitter:card (summary, summary_large_image)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>twitter:title, twitter:description</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>twitter:image (Twitter preview image)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>twitter:site, twitter:creator</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border-2 border-indigo-200 bg-indigo-50 p-5">
                  <h4 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">🔷</span>
                    Structured Data (JSON-LD)
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    Machine-readable code using Schema.org vocabulary that helps search engines understand content. Enables rich snippets and improved search results. Common types include Organization, Article, Product, FAQPage, BreadcrumbList.
                  </p>
                  <ul className="space-y-1 text-xs text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold mt-0.5">•</span>
                      <span>Organization (company info)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold mt-0.5">•</span>
                      <span>Article, Product, FAQPage</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold mt-0.5">•</span>
                      <span>BreadcrumbList (navigation)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold mt-0.5">•</span>
                      <span>HowTo, Review, Event</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <p className="text-base text-slate-700 leading-relaxed">
                Website metadata serves many purposes: helping search engines understand and rank content, creating attractive social media previews that increase engagement, providing context for browsers and users, enabling rich search results with structured data, improving click-through rates from search results and social media, and enhancing overall discoverability and SEO performance. Understanding metadata is essential for SEO optimization, social media marketing, and creating websites that perform well in search results and social sharing.
              </p>
            </div>
          </div>
        </section>

        {/* Why Metadata is Important Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Why Website Metadata is Important</h2>
            </div>
            
            <div className="max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Website metadata isn't just technical details—it's essential for SEO, social media success, and user experience. Here's why metadata is crucial:
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">1. SEO and Search Rankings</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Metadata directly impacts SEO and search rankings. Title tags are one of the most important SEO factors, appearing in search results and influencing click-through rates. Meta descriptions appear in search results and can significantly impact click-through rates. Structured data enables rich snippets, improving visibility and click-through rates. Proper metadata helps search engines understand content relevance and context, improving rankings for relevant queries.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">2. Social Media Sharing</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Metadata controls how content appears when shared on social media. Open Graph tags create attractive previews on Facebook, LinkedIn, and other platforms, increasing engagement and click-through rates. Twitter Card tags create rich previews on Twitter, making shared links more visually appealing. Without proper metadata, social media platforms may use default or incorrect information, reducing the effectiveness of social sharing.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">3. Click-Through Rates</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Well-crafted metadata improves click-through rates from search results and social media. Compelling title tags attract clicks in search results. Engaging meta descriptions entice users to click through. Attractive social media previews (from Open Graph and Twitter Card tags) increase shares and clicks. Rich snippets from structured data make search results stand out, improving visibility and clicks.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">4. User Experience</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Metadata improves user experience in several ways. Title tags appear in browser tabs, making it easy to identify pages. Well-written meta descriptions help users understand what they'll find on a page before clicking. Structured data helps users find relevant information faster in search results. Proper metadata makes content more discoverable and accessible.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">5. Brand Consistency</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Metadata helps maintain brand consistency across search results and social media. Consistent titles and descriptions reinforce brand messaging. Consistent Open Graph images create a recognizable brand presence on social media. Structured data can include brand information (Organization schema), helping establish brand identity in search results. Proper metadata ensures your brand appears as intended across all platforms.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">6. Rich Search Results</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Structured data (JSON-LD) enables rich search results that stand out. FAQPage schema can create expandable FAQ sections in search results. Product schema can show prices, ratings, and availability. Article schema can show publication dates and authors. BreadcrumbList schema shows site structure in search results. Rich results improve visibility and click-through rates significantly.
              </p>
            </div>
          </div>
        </section>

        {/* How to Use Metadata Extractor Section */}
        <section id="how" className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">How to Use Our Website Metadata Extractor</h2>
            </div>
            
            <div className="max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-6">
                Our website metadata extractor makes it easy to analyze and extract metadata from any website. Follow these simple steps:
              </p>

              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white font-bold text-xl shadow-lg mb-4">
                    1
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">Enter URL</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Provide the URL you want to analyze (e.g., https://example.com) into the input field. You can include or omit https:// - the tool will add it if missing.
                  </p>
                </div>

                <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white font-bold text-xl shadow-lg mb-4">
                    2
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">Extract Metadata</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Click the "Extract Metadata" button. Our server will analyze the website's HTML and extract all metadata. This typically takes 3-10 seconds.
                  </p>
                </div>

                <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white font-bold text-xl shadow-lg mb-4">
                    3
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">Review Results</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    View the metadata analysis including basic meta tags, Open Graph tags, Twitter Card tags, structured data, and other metadata. Use the results to understand how the website's metadata is configured.
                  </p>
                </div>

                <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white font-bold text-xl shadow-lg mb-4">
                    4
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">Analyze and Optimize</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Use the extracted metadata to identify missing tags, compare with competitors, and optimize your own website's metadata for better SEO and social media performance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Metadata Best Practices Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Website Metadata Best Practices</h2>
            </div>
            
            <div className="max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Proper website metadata requires attention to detail and following best practices. Here are essential metadata practices:
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Title and Description</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Keep titles under 60 characters</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Keep descriptions under 160 characters</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Include primary keywords naturally</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Write compelling, action-oriented copy</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Ensure uniqueness across pages</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border-2 border-green-200 bg-green-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Open Graph Tags</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold mt-0.5">•</span>
                      <span>Always include og:title, og:description, og:image</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold mt-0.5">•</span>
                      <span>Use high-quality images (1200x630px recommended)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold mt-0.5">•</span>
                      <span>Set og:type appropriately (website, article, product)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold mt-0.5">•</span>
                      <span>Include og:url for canonical URLs</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold mt-0.5">•</span>
                      <span>Test with Facebook Debugger</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border-2 border-purple-200 bg-purple-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Twitter Card Tags</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>Set twitter:card type (summary, summary_large_image)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>Include twitter:title, twitter:description, twitter:image</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>Use images optimized for Twitter (1200x675px)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>Include twitter:site for brand attribution</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>Test with Twitter Card Validator</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border-2 border-indigo-200 bg-indigo-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Structured Data</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold mt-0.5">•</span>
                      <span>Use JSON-LD format (preferred by Google)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold mt-0.5">•</span>
                      <span>Implement relevant Schema.org types</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold mt-0.5">•</span>
                      <span>Validate with Google's Rich Results Test</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold mt-0.5">•</span>
                      <span>Keep structured data accurate and up-to-date</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold mt-0.5">•</span>
                      <span>Avoid marking up hidden or misleading content</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {structuredData.faqPage.mainEntity.map((faq, index) => (
                <details key={index} className="rounded-2xl border border-slate-200 bg-slate-50 p-4" open={index === 0}>
                  <summary className="cursor-pointer text-sm font-semibold text-slate-900">{faq.name}</summary>
                  <p className="mt-2 text-sm text-slate-600">{faq.acceptedAnswer.text}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Related Web Tools Section */}
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Related Web Tools</h2>
            <p className="text-slate-600">Explore more tools for website analysis and security:</p>
          </div>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Link href="/tools/web-tools" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-indigo-300 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🌐</span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">All Web Tools</p>
                  <p className="text-xs text-slate-500">Browse Category</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">Discover all web tools for website analysis, testing, and security.</p>
              <p className="mt-4 text-sm font-semibold text-indigo-600 group-hover:text-indigo-700">Browse tools →</p>
            </Link>

            <Link href="/web-tools/http-header-checker" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-indigo-300 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">📋</span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">HTTP Header Checker</p>
                  <p className="text-xs text-slate-500">Header Analysis</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">Check HTTP response headers for security, caching, and server information.</p>
              <p className="mt-4 text-sm font-semibold text-indigo-600 group-hover:text-indigo-700">Check headers →</p>
            </Link>

            <Link href="/web-tools/website-speed-test" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-indigo-300 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">⚡</span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">Website Speed Test</p>
                  <p className="text-xs text-slate-500">Performance Analysis</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">Test your website speed and get Core Web Vitals scores.</p>
              <p className="mt-4 text-sm font-semibold text-indigo-600 group-hover:text-indigo-700">Test speed →</p>
            </Link>
          </div>
        </section>

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

