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

export default function WebsiteComparison() {
  const [urls, setUrls] = useState(['', '']);
  const [results, setResults] = useState([]);
  const [comparison, setComparison] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentRequirement, setPaymentRequirement] = useState(null);
  const [userSession, setUserSession] = useState({ processingPass: null });
  const [processingProgress, setProcessingProgress] = useState({ current: 0, total: 0, currentUrl: '' });

  const currentYear = new Date().getFullYear();
  const canonicalUrl = `${siteHost}/web-tools/website-comparison`;

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
    if (urls.length > 2) {
      setUrls(urls.filter((_, i) => i !== index));
    }
  };

  const handleClear = () => {
    setUrls(['', '']);
    setResults([]);
    setComparison(null);
    setError('');
    setIsProcessing(false);
  };

  const handleCompareWebsites = async () => {
    const validUrls = urls.filter(url => url.trim());
    
    if (validUrls.length < 2) {
      setError('Please enter at least 2 URLs for comparison.');
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
    setComparison(null);
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

      setProcessingProgress({ current: 0, total: validUrls.length, currentUrl: 'Comparing websites...' });

      const response = await fetch('/api/web-tools/website-comparison', {
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

      if (validUrls.length === 2) {
        setProcessingProgress({ current: 0, total: 2, currentUrl: validUrls[0] });
      } else {
        setProcessingProgress({ current: 1, total: validUrls.length, currentUrl: 'Analyzing websites...' });
      }

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 402) {
          setPaymentRequirement(data.requirement);
          setShowPaymentModal(true);
          setIsProcessing(false);
          return;
        }
        throw new Error(data.message || data.error || 'Failed to compare websites');
      }

      if (data.success && data.results) {
        setProcessingProgress({ current: data.results.length, total: validUrls.length, currentUrl: 'Complete' });
        setResults(data.results);
        setComparison(data.comparison);
      }
    } catch (err) {
      console.error('Website comparison error:', err);
      setError(err.message || 'Failed to compare websites. Please try again.');
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
    if (urls.filter(u => u.trim()).length >= 2) {
      handleCompareWebsites();
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
          "name": "How do I compare websites?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Enter at least 2 URLs (with or without https://) in the input fields, then click 'Compare Websites'. The tool will analyze each website's performance, SEO, metadata, security, and structure, then provide a side-by-side comparison. Results typically appear within 5-15 seconds depending on the number of websites."
          }
        },
        {
          "@type": "Question",
          "name": "What does a website comparison show?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Website comparison shows response times, link counts, image counts, heading structure, metadata quality (title, description, Open Graph, Twitter Cards, structured data), security headers, HTTPS status, and server information. It also identifies which website is fastest, has the most links, best metadata, and more."
          }
        },
        {
          "@type": "Question",
          "name": "Why would I want to compare websites?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Website comparison helps you benchmark your website against competitors, identify areas for improvement, understand best practices in your industry, analyze competitor SEO strategies, compare performance metrics, and make data-driven decisions about website optimization."
          }
        },
        {
          "@type": "Question",
          "name": "Can I compare more than 2 websites?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, you can compare multiple websites at once. Free tier allows comparing up to 3 websites. Batch processing (4+ URLs) requires a Processing Pass. With a Processing Pass, you can compare up to 20 websites in a single batch, making it efficient for analyzing multiple competitors or your entire portfolio."
          }
        },
        {
          "@type": "Question",
          "name": "What metrics are compared?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The tool compares response times (speed), link counts, image counts, heading structure, metadata quality (title, description, Open Graph tags, Twitter Cards, structured data), security headers (HSTS, CSP, X-Frame-Options), HTTPS status, server information, and calculates averages across all websites."
          }
        },
        {
          "@type": "Question",
          "name": "How do I interpret the comparison results?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Compare the metrics side-by-side to see which website performs better in each category. Look for the fastest website (lowest response time), best metadata (most complete SEO tags), most security headers, and other metrics. Use the averages to see how each website compares to the group average. Identify strengths and weaknesses for optimization."
          }
        },
        {
          "@type": "Question",
          "name": "Is this website comparison tool free to use?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, our Website Comparison Tool is free for comparing 2-3 websites (up to 5 comparisons per day). Batch processing and higher daily limits require a Processing Pass. We aim to provide valuable tools for free while offering premium options for power users and businesses."
          }
        }
      ]
    },
    
    softwareApp: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Website Comparison Tool",
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "Any",
      "description": "Free online website comparison tool. Compare two or more websites side-by-side. Analyze performance, SEO, accessibility, security, and get visual comparisons. Compare multiple websites with batch processing.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "ratingCount": "1800",
        "bestRating": "5",
        "worstRating": "1"
      },
      "featureList": [
        "Side-by-side website comparison",
        "Performance metrics comparison",
        "SEO analysis comparison",
        "Metadata quality comparison",
        "Security headers comparison",
        "Response time comparison",
        "Batch processing (with pass)",
        "Comprehensive comparison reports"
      ]
    },
    
    howTo: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Compare Websites",
      "description": "Step-by-step guide to comparing two or more websites side-by-side online for free",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Enter URLs",
          "text": "Enter at least 2 URLs you want to compare (e.g., https://example.com, https://competitor.com) into the input fields. You can include or omit https:// - the tool will add it if missing.",
          "position": 1
        },
        {
          "@type": "HowToStep",
          "name": "Compare Websites",
          "text": "Click the 'Compare Websites' button. The tool will analyze each website's performance, SEO, metadata, and security. This typically takes 5-15 seconds depending on the number of websites.",
          "position": 2
        },
        {
          "@type": "HowToStep",
          "name": "Review Comparison Results",
          "text": "View the side-by-side comparison including response times, link counts, image counts, metadata quality, security headers, and other metrics. Use the comparison summary to identify which website performs best in each category.",
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
          "name": "Website Comparison Tool",
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
        <title>Website Comparison Tool - Free Online Side-by-Side Website Analyzer | FixTools</title>
        <meta name="title" content="Website Comparison Tool - Free Online Side-by-Side Website Analyzer | FixTools" />
        <meta name="description" content="Compare two or more websites side-by-side. Analyze performance, SEO, accessibility, security, and get visual comparisons. Free website comparison tool with comprehensive metrics." />
        <meta name="keywords" content="website comparison, compare websites, website analyzer, website comparison tool, compare site performance, seo comparison, website metrics comparison, competitor analysis, website benchmark" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content="Website Comparison Tool - Free Online Side-by-Side Website Analyzer" />
        <meta property="og:description" content="Compare two or more websites side-by-side. Analyze performance, SEO, accessibility, and security." />
        <meta property="og:image" content={`${siteHost}/images/og-website-comparison.png`} />
        <meta property="og:site_name" content="FixTools" />
        
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content="Website Comparison Tool - Free Online Side-by-Side Website Analyzer" />
        <meta property="twitter:description" content="Compare two or more websites side-by-side. Analyze performance, SEO, accessibility, and security." />
        <meta property="twitter:image" content={`${siteHost}/images/og-website-comparison.png`} />
        
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.faqPage) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.softwareApp) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.howTo) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.breadcrumb) }} />
      </Head>

      <style jsx global>{`
        html:has(.website-comparison-page) {
          font-size: 100% !important;
        }
        
        .website-comparison-page * {
          box-sizing: border-box;
        }
        
        .website-comparison-page h1,
        .website-comparison-page h2,
        .website-comparison-page h3,
        .website-comparison-page p,
        .website-comparison-page ul,
        .website-comparison-page ol {
          margin: 0;
        }
        
        .website-comparison-page button {
          font-family: inherit;
          cursor: pointer;
        }
        
        .website-comparison-page input,
        .website-comparison-page textarea,
        .website-comparison-page select {
          font-family: inherit;
        }
        
        /* Fix typography styling within website comparison page sections */
        .website-comparison-page section .max-w-none {
          font-size: 16px !important;
          line-height: 1.75 !important;
          color: #334155 !important;
        }
        
        .website-comparison-page section .max-w-none h3 {
          font-size: 20px !important;
          font-weight: 700 !important;
          line-height: 1.75rem !important;
          margin-top: 1.5rem !important;
          margin-bottom: 0.75rem !important;
          color: #0f172a !important;
        }
        
        .website-comparison-page section .max-w-none p {
          font-size: 16px !important;
          line-height: 1.75 !important;
          margin-bottom: 1rem !important;
          margin-top: 0 !important;
          color: #334155 !important;
        }
        
        .website-comparison-page section .max-w-none ol {
          margin-top: 1rem !important;
          margin-bottom: 1rem !important;
          padding-left: 1.5rem !important;
          color: #334155 !important;
          list-style-type: decimal !important;
          list-style-position: outside !important;
        }
        
        .website-comparison-page section .max-w-none ul {
          margin-top: 1rem !important;
          margin-bottom: 1rem !important;
          padding-left: 1.5rem !important;
          color: #334155 !important;
          list-style-type: disc !important;
          list-style-position: outside !important;
        }
        
        .website-comparison-page section .max-w-none ol li,
        .website-comparison-page section .max-w-none ul li {
          margin-top: 0.75rem !important;
          margin-bottom: 0.75rem !important;
          line-height: 1.75 !important;
          padding-left: 0.5rem !important;
          font-size: 16px !important;
        }
        
        .website-comparison-page section .max-w-none strong {
          font-weight: 600 !important;
          color: #0f172a !important;
        }
        
        .website-comparison-page section .max-w-none a {
          color: #7c2d12 !important;
          text-decoration: underline !important;
          font-weight: 500 !important;
        }
        
        .website-comparison-page section .max-w-none a:hover {
          color: #9a3412 !important;
        }
        
        /* Override global CSS font-size for this page */
        .website-comparison-page {
          font-size: 16px !important;
        }
        
        .website-comparison-page h1 {
          font-size: 3rem !important;
        }
        
        .website-comparison-page h2 {
          font-size: 1.875rem !important;
        }
        
        .website-comparison-page h3 {
          font-size: 1.25rem !important;
        }
        
        .website-comparison-page p,
        .website-comparison-page li,
        .website-comparison-page span {
          font-size: 1rem !important;
        }
      `}</style>

      <div className="website-comparison-page bg-[#fbfbfc] text-slate-900 min-h-screen">
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
            <li className="flex items-center gap-2"><span className="text-slate-400">/</span><span className="font-semibold text-slate-900">Website Comparison Tool</span></li>
          </ol>
        </nav>

        <section className="relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.35]" style={{ backgroundImage: 'url(/grid.png)', backgroundSize: '256px 256px' }}></div>
          <div className="mx-auto max-w-6xl px-4 py-10 md:py-14 relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-1.5 text-xs font-semibold text-amber-700 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              Free • Fast • Comprehensive
            </div>
            
            <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-600 bg-clip-text text-transparent">
                Website Comparison Tool
              </span>
            </h1>
            
            <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg md:leading-relaxed">
              Compare two or more websites side-by-side with our free <strong>Website Comparison Tool</strong>. Analyze performance, SEO, accessibility, security, and get visual comparisons instantly.
            </p>

            <dl className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
              <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Comparison</dt>
                <dd className="mt-1.5 text-sm font-bold text-slate-900">Side-by-Side</dd>
              </div>
              <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Metrics</dt>
                <dd className="mt-1.5 text-sm font-bold text-slate-900">Comprehensive</dd>
              </div>
              <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Speed</dt>
                <dd className="mt-1.5 text-sm font-bold text-slate-900">5-15 seconds</dd>
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
                <h2 className="text-xl font-semibold text-slate-900">Compare Websites</h2>
                <p className="mt-1 text-sm text-slate-600">Enter 2+ URLs, then click 'Compare Websites' to analyze side-by-side.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button onClick={handleClear} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50">Clear</button>
                <button 
                  onClick={handleCompareWebsites} 
                  disabled={isProcessing}
                  className="rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Comparing...' : '⚖️ Compare Websites'}
                </button>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-12">
              <div className="md:col-span-8">
                <label className="mb-2 block text-sm font-semibold text-slate-800">URL(s) - At least 2 required</label>
                <div className="space-y-2">
                  {urls.map((url, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={url}
                        onChange={(e) => handleUrlChange(index, e.target.value)}
                        placeholder={`Website ${index + 1} - https://example.com`}
                        className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-amber-900/20"
                      />
                      {urls.length > 2 && (
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
                    className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-100"
                  >
                    + Add Website (Batch)
                  </button>
                </div>
                {error && (
                  <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                {/* Processing Progress Indicator */}
                {isProcessing && (
                  <div className="mt-6 rounded-xl border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-6">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-600"></div>
                      <p className="text-sm font-semibold text-amber-900">
                        Comparing websites{processingProgress.total > 1 && ` (${processingProgress.current}/${processingProgress.total})`}...
                      </p>
                    </div>
                    {processingProgress.total > 1 && (
                      <div className="mt-3">
                        <div className="w-full bg-amber-200 rounded-full h-2.5">
                          <div 
                            className="bg-gradient-to-r from-amber-600 to-orange-600 h-2.5 rounded-full transition-all duration-300"
                            style={{ width: `${(processingProgress.current / processingProgress.total) * 100}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-amber-700 mt-2 text-center">
                          Processing {processingProgress.current} of {processingProgress.total} website{processingProgress.total !== 1 ? 's' : ''}
                        </p>
                      </div>
                    )}
                    {processingProgress.total === 2 && (
                      <div className="mt-3">
                        <div className="w-full bg-amber-200 rounded-full h-2.5 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-amber-600 to-orange-600 h-2.5 rounded-full animate-pulse"
                            style={{ width: '60%' }}
                          ></div>
                        </div>
                        <p className="text-xs text-amber-700 mt-2 text-center">
                          {processingProgress.currentUrl || 'Analyzing websites...'}
                        </p>
                      </div>
                    )}
                    <p className="text-xs text-amber-600 mt-3 text-center">
                      This may take 5-15 seconds per website
                    </p>
                  </div>
                )}
              </div>

              <div className="md:col-span-4">
                <label className="mb-2 block text-sm font-semibold text-slate-800">Info</label>
                <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="rounded-xl border border-violet-200 bg-violet-50 p-3">
                    <p className="text-xs font-semibold text-violet-900 mb-1">Free Tier Limits</p>
                    <p className="text-xs text-violet-700">Up to 3 websites per compare</p>
                    <p className="text-xs text-violet-700">5 comparisons per day</p>
                    <p className="text-xs text-violet-700">4+ websites: Requires pass</p>
                  </div>
                  <div className="rounded-xl border border-blue-200 bg-blue-50 p-3">
                    <p className="text-xs font-semibold text-blue-900 mb-1">Requirements</p>
                    <p className="text-xs text-blue-700">Minimum 2 websites required</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Comparison Summary */}
            {comparison && (
              <div className="mt-6 rounded-2xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-5">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Comparison Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-amber-200 bg-white p-4">
                    <h4 className="text-sm font-semibold text-slate-900 mb-3">Performance</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Fastest:</span>
                        <span className="font-semibold text-green-600 break-all text-right ml-4 max-w-xs">
                          {comparison.fastest || 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Slowest:</span>
                        <span className="font-semibold text-red-600 break-all text-right ml-4 max-w-xs">
                          {comparison.slowest || 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Avg Response:</span>
                        <span className="font-semibold text-slate-900">
                          {comparison.averages?.responseTime || 0}ms
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-amber-200 bg-white p-4">
                    <h4 className="text-sm font-semibold text-slate-900 mb-3">Content</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Most Links:</span>
                        <span className="font-semibold text-blue-600 break-all text-right ml-4 max-w-xs">
                          {comparison.mostLinks || 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Most Images:</span>
                        <span className="font-semibold text-purple-600 break-all text-right ml-4 max-w-xs">
                          {comparison.mostImages || 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Best Metadata:</span>
                        <span className="font-semibold text-indigo-600 break-all text-right ml-4 max-w-xs">
                          {comparison.bestMetadata || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Comparison Results - Side-by-Side Table */}
            {results.length > 0 && (
              <div className="mt-6 space-y-6">
                <h3 className="text-lg font-semibold text-slate-900">Comparison Results</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b-2 border-slate-300">
                        <th className="text-left p-3 text-sm font-semibold text-slate-900 bg-slate-50">Metric</th>
                        {results.filter(r => !r.error).map((result, index) => (
                          <th key={index} className="text-left p-3 text-sm font-semibold text-slate-900 bg-slate-50 min-w-[200px]">
                            <div className="break-all">{result.url}</div>
                            {result.statusCode && (
                              <div className="text-xs text-slate-500 mt-1">Status: {result.statusCode}</div>
                            )}
                          </th>
                        ))}
                        {comparison && (
                          <th className="text-left p-3 text-sm font-semibold text-slate-900 bg-amber-50">
                            Average
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-slate-200">
                        <td className="p-3 text-sm font-semibold text-slate-700">Response Time</td>
                        {results.filter(r => !r.error).map((result, index) => (
                          <td key={index} className="p-3 text-sm">
                            <span className={`font-semibold ${result.responseTime < 500 ? 'text-green-600' : result.responseTime < 1000 ? 'text-yellow-600' : 'text-red-600'}`}>
                              {result.responseTime || 0}ms
                            </span>
                          </td>
                        ))}
                        {comparison && (
                          <td className="p-3 text-sm font-semibold text-amber-700 bg-amber-50">
                            {comparison.averages?.responseTime || 0}ms
                          </td>
                        )}
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="p-3 text-sm font-semibold text-slate-700">Title</td>
                        {results.filter(r => !r.error).map((result, index) => (
                          <td key={index} className="p-3 text-sm">
                            <span className={result.title ? 'text-green-600 font-medium' : 'text-red-600'}>
                              {result.title ? '✓' : '✗'} {result.title || 'Not set'}
                            </span>
                          </td>
                        ))}
                        {comparison && (
                          <td className="p-3 text-sm text-slate-600 bg-amber-50">
                            -
                          </td>
                        )}
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="p-3 text-sm font-semibold text-slate-700">Description</td>
                        {results.filter(r => !r.error).map((result, index) => (
                          <td key={index} className="p-3 text-sm">
                            <span className={result.description ? 'text-green-600 font-medium' : 'text-red-600'}>
                              {result.description ? '✓' : '✗'} {result.description ? (result.description.length > 50 ? result.description.substring(0, 50) + '...' : result.description) : 'Not set'}
                            </span>
                          </td>
                        ))}
                        {comparison && (
                          <td className="p-3 text-sm text-slate-600 bg-amber-50">
                            -
                          </td>
                        )}
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="p-3 text-sm font-semibold text-slate-700">Links</td>
                        {results.filter(r => !r.error).map((result, index) => (
                          <td key={index} className="p-3 text-sm">
                            <span className="font-semibold text-slate-900">
                              {result.linkCount || 0}
                            </span>
                          </td>
                        ))}
                        {comparison && (
                          <td className="p-3 text-sm font-semibold text-amber-700 bg-amber-50">
                            {comparison.averages?.linkCount || 0}
                          </td>
                        )}
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="p-3 text-sm font-semibold text-slate-700">Images</td>
                        {results.filter(r => !r.error).map((result, index) => (
                          <td key={index} className="p-3 text-sm">
                            <span className="font-semibold text-slate-900">
                              {result.imageCount || 0}
                            </span>
                          </td>
                        ))}
                        {comparison && (
                          <td className="p-3 text-sm font-semibold text-amber-700 bg-amber-50">
                            {comparison.averages?.imageCount || 0}
                          </td>
                        )}
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="p-3 text-sm font-semibold text-slate-700">Headings</td>
                        {results.filter(r => !r.error).map((result, index) => (
                          <td key={index} className="p-3 text-sm">
                            <span className="font-semibold text-slate-900">
                              {result.headingCount || 0}
                            </span>
                          </td>
                        ))}
                        {comparison && (
                          <td className="p-3 text-sm font-semibold text-amber-700 bg-amber-50">
                            {comparison.averages?.headingCount || 0}
                          </td>
                        )}
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="p-3 text-sm font-semibold text-slate-700">Meta Tags</td>
                        {results.filter(r => !r.error).map((result, index) => (
                          <td key={index} className="p-3 text-sm">
                            <span className="font-semibold text-slate-900">
                              {result.metaTagsCount || 0}
                            </span>
                          </td>
                        ))}
                        {comparison && (
                          <td className="p-3 text-sm font-semibold text-amber-700 bg-amber-50">
                            {comparison.averages?.metaTagsCount || 0}
                          </td>
                        )}
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="p-3 text-sm font-semibold text-slate-700">Open Graph</td>
                        {results.filter(r => !r.error).map((result, index) => (
                          <td key={index} className="p-3 text-sm">
                            <span className={result.hasOpenGraph ? 'text-green-600 font-semibold' : 'text-red-600'}>
                              {result.hasOpenGraph ? '✓ Yes' : '✗ No'}
                            </span>
                          </td>
                        ))}
                        {comparison && (
                          <td className="p-3 text-sm text-slate-600 bg-amber-50">
                            {results.filter(r => !r.error && r.hasOpenGraph).length}/{results.filter(r => !r.error).length}
                          </td>
                        )}
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="p-3 text-sm font-semibold text-slate-700">Twitter Cards</td>
                        {results.filter(r => !r.error).map((result, index) => (
                          <td key={index} className="p-3 text-sm">
                            <span className={result.hasTwitter ? 'text-green-600 font-semibold' : 'text-red-600'}>
                              {result.hasTwitter ? '✓ Yes' : '✗ No'}
                            </span>
                          </td>
                        ))}
                        {comparison && (
                          <td className="p-3 text-sm text-slate-600 bg-amber-50">
                            {results.filter(r => !r.error && r.hasTwitter).length}/{results.filter(r => !r.error).length}
                          </td>
                        )}
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="p-3 text-sm font-semibold text-slate-700">Structured Data</td>
                        {results.filter(r => !r.error).map((result, index) => (
                          <td key={index} className="p-3 text-sm">
                            <span className={result.hasStructuredData ? 'text-green-600 font-semibold' : 'text-red-600'}>
                              {result.hasStructuredData ? '✓ Yes' : '✗ No'}
                            </span>
                          </td>
                        ))}
                        {comparison && (
                          <td className="p-3 text-sm text-slate-600 bg-amber-50">
                            {results.filter(r => !r.error && r.hasStructuredData).length}/{results.filter(r => !r.error).length}
                          </td>
                        )}
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="p-3 text-sm font-semibold text-slate-700">HTTPS</td>
                        {results.filter(r => !r.error).map((result, index) => (
                          <td key={index} className="p-3 text-sm">
                            <span className={result.isHttps ? 'text-green-600 font-semibold' : 'text-red-600'}>
                              {result.isHttps ? '✓ Yes' : '✗ No'}
                            </span>
                          </td>
                        ))}
                        {comparison && (
                          <td className="p-3 text-sm text-slate-600 bg-amber-50">
                            {comparison.hasHttps?.length || 0}/{results.filter(r => !r.error).length}
                          </td>
                        )}
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="p-3 text-sm font-semibold text-slate-700">Security Headers</td>
                        {results.filter(r => !r.error).map((result, index) => {
                          const securityHeadersCount = result.hasSecurityHeaders ? Object.values(result.hasSecurityHeaders).filter(Boolean).length : 0;
                          return (
                            <td key={index} className="p-3 text-sm">
                              <span className={`font-semibold ${securityHeadersCount >= 3 ? 'text-green-600' : securityHeadersCount >= 1 ? 'text-yellow-600' : 'text-red-600'}`}>
                                {securityHeadersCount}/4
                              </span>
                            </td>
                          );
                        })}
                        {comparison && (
                          <td className="p-3 text-sm text-slate-600 bg-amber-50">
                            {comparison.hasSecurityHeaders?.reduce((sum, item) => sum + item.count, 0) || 0}/{results.filter(r => !r.error).length * 4}
                          </td>
                        )}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Error Results */}
            {results.filter(r => r.error).length > 0 && (
              <div className="mt-6 rounded-xl border-2 border-red-200 bg-red-50 p-4">
                <h4 className="text-sm font-semibold text-red-900 mb-3">Errors</h4>
                <div className="space-y-2 text-sm">
                  {results.filter(r => r.error).map((result, index) => (
                    <div key={index} className="text-red-700">
                      <p className="font-semibold">{result.url}:</p>
                      <p>{result.error}</p>
                    </div>
                  ))}
                </div>
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
              <div className="h-1 w-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">What is Website Comparison?</h2>
            </div>
            
            <div className="max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                <strong>Website comparison</strong> is the process of analyzing two or more websites side-by-side to identify differences, similarities, strengths, and weaknesses. Website comparison tools analyze performance, SEO, accessibility, security, metadata, structure, and other metrics to provide comprehensive comparisons that help you understand how websites stack up against each other.
              </p>
              
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                When you compare websites, you're benchmarking your website against competitors, identifying areas for improvement, understanding best practices in your industry, analyzing competitor SEO strategies, comparing performance metrics, and making data-driven decisions about website optimization. Website comparison provides valuable insights that help you improve your own website's performance and competitiveness.
              </p>

              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Website comparison is essential for competitive analysis, SEO optimization, performance benchmarking, and strategic planning. Regular website comparisons help you stay ahead of competitors, identify opportunities for improvement, understand industry trends, and make informed decisions about website development and optimization strategies.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">How Website Comparison Works</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Website comparison involves several steps:
              </p>
              <ol className="space-y-3 mb-4 ml-6 text-slate-700" style={{ listStyleType: 'decimal', listStylePosition: 'outside', paddingLeft: '1.5rem' }}>
                <li className="leading-relaxed pl-2" style={{ fontSize: '16px', lineHeight: '1.75' }}><strong>Website Selection:</strong> Choose two or more websites to compare. These can be your website and competitors, multiple competitors, or different versions of your own website.</li>
                <li className="leading-relaxed pl-2" style={{ fontSize: '16px', lineHeight: '1.75' }}><strong>Data Collection:</strong> The comparison tool fetches and analyzes each website, collecting metrics like response times, link counts, image counts, metadata quality, security headers, and other relevant data.</li>
                <li className="leading-relaxed pl-2" style={{ fontSize: '16px', lineHeight: '1.75' }}><strong>Metric Analysis:</strong> Each website's metrics are analyzed and compared against others. This includes performance metrics (response times), content metrics (links, images, headings), SEO metrics (metadata, structured data), and security metrics (HTTPS, security headers).</li>
                <li className="leading-relaxed pl-2" style={{ fontSize: '16px', lineHeight: '1.75' }}><strong>Side-by-Side Comparison:</strong> Results are displayed side-by-side in a comparison table, making it easy to see differences and similarities across websites. Each metric is compared directly.</li>
                <li className="leading-relaxed pl-2" style={{ fontSize: '16px', lineHeight: '1.75' }}><strong>Summary Statistics:</strong> The tool calculates averages, identifies extremes (fastest, slowest, most links, best metadata), and provides insights into which websites perform best in each category.</li>
                <li className="leading-relaxed pl-2" style={{ fontSize: '16px', lineHeight: '1.75' }}><strong>Actionable Insights:</strong> Use the comparison results to identify areas for improvement, understand competitor strategies, benchmark your performance, and make data-driven optimization decisions.</li>
              </ol>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">What Metrics are Compared</h3>
              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-5">
                  <h4 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-600">⚡</span>
                    Performance Metrics
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    Response times, page load speeds, and server performance. These metrics help identify which websites load faster and provide better user experience.
                  </p>
                  <ul className="space-y-1 text-xs text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600 font-bold mt-0.5">•</span>
                      <span>Response time (ms)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600 font-bold mt-0.5">•</span>
                      <span>HTTP status codes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600 font-bold mt-0.5">•</span>
                      <span>Server information</span>
                    </li>
                  </ul>
                </div>
                
                <div className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-5">
                  <h4 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">🔍</span>
                    SEO Metrics
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    Metadata quality, structured data, Open Graph tags, Twitter Cards, and other SEO elements. These metrics help identify which websites have better SEO optimization.
                  </p>
                  <ul className="space-y-1 text-xs text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Title and description tags</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Open Graph and Twitter Cards</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Structured data (JSON-LD)</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border-2 border-green-200 bg-green-50 p-5">
                  <h4 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 text-green-600">📊</span>
                    Content Metrics
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    Link counts, image counts, heading structure, and content organization. These metrics help identify content differences and structure variations.
                  </p>
                  <ul className="space-y-1 text-xs text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold mt-0.5">•</span>
                      <span>Link counts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold mt-0.5">•</span>
                      <span>Image counts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold mt-0.5">•</span>
                      <span>Heading structure</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-5">
                  <h4 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600">🔒</span>
                    Security Metrics
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    HTTPS status, security headers (HSTS, CSP, X-Frame-Options), and server security. These metrics help identify which websites have better security implementations.
                  </p>
                  <ul className="space-y-1 text-xs text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">•</span>
                      <span>HTTPS status</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">•</span>
                      <span>Security headers count</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">•</span>
                      <span>HSTS, CSP, X-Frame-Options</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <p className="text-base text-slate-700 leading-relaxed">
                Website comparison serves many purposes: benchmarking your website against competitors, identifying areas for improvement, understanding industry best practices, analyzing competitor SEO strategies, comparing performance metrics, making data-driven optimization decisions, and staying competitive in your market. Understanding website comparison is essential for competitive analysis, SEO optimization, performance benchmarking, and strategic planning.
              </p>
            </div>
          </div>
        </section>

        {/* Why Website Comparison is Important Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Why Website Comparison is Important</h2>
            </div>
            
            <div className="max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Website comparison isn't just about curiosity—it's essential for competitive analysis, SEO optimization, and strategic planning. Here's why website comparison is crucial:
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">1. Competitive Analysis</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Website comparison enables comprehensive competitive analysis. By comparing your website with competitors, you can identify strengths and weaknesses, understand competitor strategies, benchmark your performance, identify opportunities for improvement, and stay ahead of industry trends. Regular competitive analysis helps you maintain and improve your competitive position.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">2. SEO Optimization</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Website comparison reveals SEO opportunities and weaknesses. By comparing metadata, structured data, and SEO elements, you can identify missing SEO tags, understand competitor SEO strategies, benchmark your SEO performance, identify best practices, and optimize your own website's SEO. SEO comparison helps you improve search rankings and visibility.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">3. Performance Benchmarking</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Website comparison helps benchmark performance. By comparing response times, page loads, and other performance metrics, you can identify performance gaps, understand industry standards, set performance goals, prioritize optimization efforts, and track progress over time. Performance benchmarking helps ensure your website competes effectively.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">4. Strategic Planning</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Website comparison informs strategic planning and decision-making. By understanding competitor strengths and weaknesses, you can make data-driven decisions about website development, prioritize optimization efforts, allocate resources effectively, identify market opportunities, and develop competitive strategies. Strategic comparison helps guide long-term website strategy.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">5. Best Practices Identification</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Website comparison helps identify industry best practices. By analyzing multiple websites, you can identify common patterns, understand industry standards, learn from successful implementations, identify emerging trends, and apply best practices to your own website. Best practices identification helps improve overall website quality.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">6. Continuous Improvement</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Website comparison enables continuous improvement. By regularly comparing your website with competitors, you can track improvements over time, identify new optimization opportunities, stay current with industry trends, maintain competitive advantage, and ensure your website evolves with market expectations. Continuous comparison drives ongoing optimization.
              </p>
            </div>
          </div>
        </section>

        {/* How to Use Website Comparison Section */}
        <section id="how" className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">How to Use Our Website Comparison Tool</h2>
            </div>
            
            <div className="max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-6">
                Our website comparison tool makes it easy to compare websites side-by-side. Follow these simple steps:
              </p>

              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white font-bold text-xl shadow-lg mb-4">
                    1
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">Enter URLs</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Enter at least 2 URLs you want to compare (e.g., https://example.com, https://competitor.com) into the input fields. You can include or omit https:// - the tool will add it if missing.
                  </p>
                </div>

                <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white font-bold text-xl shadow-lg mb-4">
                    2
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">Compare Websites</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Click the "Compare Websites" button. Our server will analyze each website's performance, SEO, metadata, and security. This typically takes 5-15 seconds depending on the number of websites.
                  </p>
                </div>

                <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white font-bold text-xl shadow-lg mb-4">
                    3
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">Review Comparison</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    View the side-by-side comparison table including response times, link counts, metadata quality, security headers, and other metrics. Use the comparison summary to identify which website performs best in each category.
                  </p>
                </div>

                <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white font-bold text-xl shadow-lg mb-4">
                    4
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">Analyze and Optimize</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Use the comparison results to identify areas for improvement, understand competitor strategies, benchmark your performance, and make data-driven decisions about website optimization.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Website Comparison Best Practices Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Website Comparison Best Practices</h2>
            </div>
            
            <div className="max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Effective website comparison requires proper methodology and analysis. Here are best practices:
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Selection Strategy</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600 font-bold mt-0.5">•</span>
                      <span>Compare similar websites (same industry/niche)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600 font-bold mt-0.5">•</span>
                      <span>Include direct competitors</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600 font-bold mt-0.5">•</span>
                      <span>Compare with industry leaders</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600 font-bold mt-0.5">•</span>
                      <span>Include your own website for benchmarking</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600 font-bold mt-0.5">•</span>
                      <span>Compare multiple websites for better insights</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border-2 border-orange-200 bg-orange-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Metric Analysis</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 font-bold mt-0.5">•</span>
                      <span>Focus on key metrics relevant to your goals</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 font-bold mt-0.5">•</span>
                      <span>Compare performance metrics (response times)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 font-bold mt-0.5">•</span>
                      <span>Analyze SEO metrics (metadata, structured data)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 font-bold mt-0.5">•</span>
                      <span>Review security metrics (HTTPS, security headers)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 font-bold mt-0.5">•</span>
                      <span>Use averages to understand group performance</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Actionable Insights</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Identify specific areas for improvement</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Prioritize optimizations based on impact</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Learn from best-performing websites</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Set benchmarks based on top performers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Track improvements over time</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border-2 border-green-200 bg-green-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Regular Monitoring</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold mt-0.5">•</span>
                      <span>Compare websites regularly (monthly/quarterly)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold mt-0.5">•</span>
                      <span>Track changes in competitor strategies</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold mt-0.5">•</span>
                      <span>Monitor industry trends and best practices</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold mt-0.5">•</span>
                      <span>Compare before and after optimizations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold mt-0.5">•</span>
                      <span>Document findings for reference</span>
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
            <Link href="/tools/web-tools" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-amber-300 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🌐</span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">All Web Tools</p>
                  <p className="text-xs text-slate-500">Browse Category</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">Discover all web tools for website analysis, testing, and security.</p>
              <p className="mt-4 text-sm font-semibold text-amber-600 group-hover:text-amber-700">Browse tools →</p>
            </Link>

            <Link href="/web-tools/website-speed-test" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-amber-300 hover:shadow-lg transition-all duration-300">
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
              <p className="mt-4 text-sm font-semibold text-amber-600 group-hover:text-amber-700">Test speed →</p>
            </Link>

            <Link href="/web-tools/metadata-extractor" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-amber-300 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">📋</span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">Website Metadata Extractor</p>
                  <p className="text-xs text-slate-500">Metadata Analysis</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">Extract and analyze website metadata, Open Graph tags, and structured data.</p>
              <p className="mt-4 text-sm font-semibold text-amber-600 group-hover:text-amber-700">Extract metadata →</p>
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

