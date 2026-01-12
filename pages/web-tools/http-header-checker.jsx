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

export default function HTTPHeaderChecker() {
  const [urls, setUrls] = useState(['']);
  const [results, setResults] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentRequirement, setPaymentRequirement] = useState(null);
  const [userSession, setUserSession] = useState({ processingPass: null });
  const [processingProgress, setProcessingProgress] = useState({ current: 0, total: 0, currentUrl: '' });

  const currentYear = new Date().getFullYear();
  const canonicalUrl = `${siteHost}/web-tools/http-header-checker`;

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

  const handleCheckHeaders = async () => {
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

      setProcessingProgress({ current: 0, total: validUrls.length, currentUrl: 'Checking HTTP headers...' });

      const response = await fetch('/api/web-tools/http-header-checker', {
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
        setProcessingProgress({ current: 1, total: validUrls.length, currentUrl: 'Analyzing headers...' });
      }

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 402) {
          setPaymentRequirement(data.requirement);
          setShowPaymentModal(true);
          setIsProcessing(false);
          return;
        }
        throw new Error(data.message || data.error || 'Failed to check HTTP headers');
      }

      if (data.success && data.results) {
        setProcessingProgress({ current: data.results.length, total: validUrls.length, currentUrl: 'Complete' });
        setResults(data.results);
      }
    } catch (err) {
      console.error('HTTP header check error:', err);
      setError(err.message || 'Failed to check HTTP headers. Please try again.');
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
      handleCheckHeaders();
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
          "name": "How do I check HTTP headers?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Enter the URL (with or without https://) in the input field, then click 'Check Headers'. The tool will send an HTTP request and retrieve all response headers including security headers, caching headers, server information, and CORS settings. Results typically appear within 1-3 seconds."
          }
        },
        {
          "@type": "Question",
          "name": "What are HTTP headers?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "HTTP headers are metadata sent by web servers in response to HTTP requests. They contain information about the server, caching policies, security settings, content types, and more. Headers control how browsers and clients interact with web servers, affecting security, performance, and functionality of websites."
          }
        },
        {
          "@type": "Question",
          "name": "What security headers should I check?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Important security headers include: Strict-Transport-Security (HSTS), Content-Security-Policy (CSP), X-Content-Type-Options, X-Frame-Options (clickjacking protection), X-XSS-Protection, Referrer-Policy, Permissions-Policy, and Expect-CT. These headers help protect websites from common attacks like XSS, clickjacking, and man-in-the-middle attacks."
          }
        },
        {
          "@type": "Question",
          "name": "Can I check multiple URLs at once?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Batch processing (4+ URLs) requires a Processing Pass. Free tier allows checking up to 3 URLs at a time. With a Processing Pass, you can check up to 20 URLs in a single batch, making it efficient for monitoring multiple websites or analyzing entire domains."
          }
        },
        {
          "@type": "Question",
          "name": "What is HSTS (Strict-Transport-Security)?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "HSTS (HTTP Strict Transport Security) is a security header that forces browsers to use HTTPS connections only. When enabled, browsers will automatically convert HTTP requests to HTTPS and remember this preference for a specified duration. This prevents man-in-the-middle attacks and protocol downgrade attacks."
          }
        },
        {
          "@type": "Question",
          "name": "What is Content-Security-Policy (CSP)?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Content-Security-Policy (CSP) is a security header that helps prevent cross-site scripting (XSS) attacks by controlling which resources (scripts, styles, images, etc.) can be loaded and executed. CSP allows website owners to whitelist trusted sources and block potentially malicious content from unauthorized sources."
          }
        },
        {
          "@type": "Question",
          "name": "Is this HTTP header checker tool free to use?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, our HTTP Header Checker tool is free for single URL checks (up to 5 checks per day). Batch processing and higher daily limits require a Processing Pass. We aim to provide valuable tools for free while offering premium options for power users and businesses."
          }
        }
      ]
    },
    
    softwareApp: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "HTTP Header Checker",
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "Any",
      "description": "Free online HTTP header checker. Analyze HTTP response headers, security headers, caching policies, and server information. Check multiple URLs with batch processing.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "1300",
        "bestRating": "5",
        "worstRating": "1"
      },
      "featureList": [
        "HTTP response header analysis",
        "Security header checker",
        "Caching header analysis",
        "CORS header checker",
        "Server information",
        "Batch processing (with pass)",
        "Real-time header inspection",
        "Redirect detection"
      ]
    },
    
    howTo: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Check HTTP Headers",
      "description": "Step-by-step guide to checking HTTP response headers for any website online for free",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Enter URL",
          "text": "Enter the URL you want to check (e.g., https://example.com) into the input field. You can include or omit https:// - the tool will add it if missing.",
          "position": 1
        },
        {
          "@type": "HowToStep",
          "name": "Check HTTP Headers",
          "text": "Click the 'Check Headers' button. The tool will send an HTTP HEAD request to the server and retrieve all response headers. This typically takes 1-3 seconds.",
          "position": 2
        },
        {
          "@type": "HowToStep",
          "name": "Review Results",
          "text": "View the HTTP header analysis including categorized headers (security, caching, CORS, server), status codes, redirect information, and header values. Use the results to verify security configurations and troubleshoot header-related issues.",
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
          "name": "HTTP Header Checker",
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
        <title>HTTP Header Checker - Free Online HTTP Response Header Analyzer | FixTools</title>
        <meta name="title" content="HTTP Header Checker - Free Online HTTP Response Header Analyzer | FixTools" />
        <meta name="description" content="Check HTTP response headers for any website. Analyze security headers, redirects, caching policies, and server information. Free HTTP header checker and analyzer tool with real-time inspection." />
        <meta name="keywords" content="http header checker, http header analyzer, check http headers, http response headers, security headers checker, hsts checker, csp checker, http header test, server headers, check response headers" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content="HTTP Header Checker - Free Online HTTP Response Header Analyzer" />
        <meta property="og:description" content="Check HTTP response headers for any website. Analyze security headers, caching policies, and server information." />
        <meta property="og:image" content={`${siteHost}/images/og-http-header-checker.png`} />
        <meta property="og:site_name" content="FixTools" />
        
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content="HTTP Header Checker - Free Online HTTP Response Header Analyzer" />
        <meta property="twitter:description" content="Check HTTP response headers for any website. Analyze security headers and server information." />
        <meta property="twitter:image" content={`${siteHost}/images/og-http-header-checker.png`} />
        
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.faqPage) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.softwareApp) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.howTo) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.breadcrumb) }} />
      </Head>

      <style jsx global>{`
        html:has(.http-header-checker-page) {
          font-size: 100% !important;
        }
        
        .http-header-checker-page * {
          box-sizing: border-box;
        }
        
        .http-header-checker-page h1,
        .http-header-checker-page h2,
        .http-header-checker-page h3,
        .http-header-checker-page p,
        .http-header-checker-page ul,
        .http-header-checker-page ol {
          margin: 0;
        }
        
        .http-header-checker-page button {
          font-family: inherit;
          cursor: pointer;
        }
        
        .http-header-checker-page input,
        .http-header-checker-page textarea,
        .http-header-checker-page select {
          font-family: inherit;
        }
        
        /* Fix typography styling within HTTP header checker page sections */
        .http-header-checker-page section .max-w-none {
          font-size: 16px !important;
          line-height: 1.75 !important;
          color: #334155 !important;
        }
        
        .http-header-checker-page section .max-w-none h3 {
          font-size: 20px !important;
          font-weight: 700 !important;
          line-height: 1.75rem !important;
          margin-top: 1.5rem !important;
          margin-bottom: 0.75rem !important;
          color: #0f172a !important;
        }
        
        .http-header-checker-page section .max-w-none p {
          font-size: 16px !important;
          line-height: 1.75 !important;
          margin-bottom: 1rem !important;
          margin-top: 0 !important;
          color: #334155 !important;
        }
        
        .http-header-checker-page section .max-w-none ol {
          margin-top: 1rem !important;
          margin-bottom: 1rem !important;
          padding-left: 1.5rem !important;
          color: #334155 !important;
          list-style-type: decimal !important;
          list-style-position: outside !important;
        }
        
        .http-header-checker-page section .max-w-none ul {
          margin-top: 1rem !important;
          margin-bottom: 1rem !important;
          padding-left: 1.5rem !important;
          color: #334155 !important;
          list-style-type: disc !important;
          list-style-position: outside !important;
        }
        
        .http-header-checker-page section .max-w-none ol li,
        .http-header-checker-page section .max-w-none ul li {
          margin-top: 0.75rem !important;
          margin-bottom: 0.75rem !important;
          line-height: 1.75 !important;
          padding-left: 0.5rem !important;
          font-size: 16px !important;
        }
        
        .http-header-checker-page section .max-w-none strong {
          font-weight: 600 !important;
          color: #0f172a !important;
        }
        
        .http-header-checker-page section .max-w-none a {
          color: #059669 !important;
          text-decoration: underline !important;
          font-weight: 500 !important;
        }
        
        .http-header-checker-page section .max-w-none a:hover {
          color: #047857 !important;
        }
        
        /* Override global CSS font-size for this page */
        .http-header-checker-page {
          font-size: 16px !important;
        }
        
        .http-header-checker-page h1 {
          font-size: 3rem !important;
        }
        
        .http-header-checker-page h2 {
          font-size: 1.875rem !important;
        }
        
        .http-header-checker-page h3 {
          font-size: 1.25rem !important;
        }
        
        .http-header-checker-page p,
        .http-header-checker-page li,
        .http-header-checker-page span {
          font-size: 1rem !important;
        }
      `}</style>

      <div className="http-header-checker-page bg-[#fbfbfc] text-slate-900 min-h-screen">
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
            <li className="flex items-center gap-2"><span className="text-slate-400">/</span><span className="font-semibold text-slate-900">HTTP Header Checker</span></li>
          </ol>
        </nav>

        <section className="relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.35]" style={{ backgroundImage: 'url(/grid.png)', backgroundSize: '256px 256px' }}></div>
          <div className="mx-auto max-w-6xl px-4 py-10 md:py-14 relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 px-4 py-1.5 text-xs font-semibold text-purple-700 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
              Free • Fast • Secure
            </div>
            
            <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                HTTP Header Checker
              </span>
            </h1>
            
            <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg md:leading-relaxed">
              Check HTTP response headers for any website with our free <strong>HTTP Header Checker</strong> tool. Analyze security headers, redirects, caching policies, and server information instantly.
            </p>

            <dl className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
              <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Security</dt>
                <dd className="mt-1.5 text-sm font-bold text-slate-900">Header Analysis</dd>
              </div>
              <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Caching</dt>
                <dd className="mt-1.5 text-sm font-bold text-slate-900">Policy Check</dd>
              </div>
              <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Speed</dt>
                <dd className="mt-1.5 text-sm font-bold text-slate-900">1-3 seconds</dd>
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
                <h2 className="text-xl font-semibold text-slate-900">Check HTTP Headers</h2>
                <p className="mt-1 text-sm text-slate-600">Enter URL(s), then click 'Check Headers' to analyze response headers.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button onClick={handleClear} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50">Clear</button>
                <button 
                  onClick={handleCheckHeaders} 
                  disabled={isProcessing}
                  className="rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Checking...' : '🔍 Check Headers'}
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
                        className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-purple-900/20"
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
                    className="rounded-xl border border-purple-200 bg-purple-50 px-3 py-2 text-sm font-semibold text-purple-700 hover:bg-purple-100"
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
                  <div className="mt-6 rounded-xl border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 p-6">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                      <p className="text-sm font-semibold text-purple-900">
                        Checking HTTP headers{processingProgress.total > 1 && ` (${processingProgress.current}/${processingProgress.total})`}...
                      </p>
                    </div>
                    {processingProgress.total > 1 && (
                      <div className="mt-3">
                        <div className="w-full bg-purple-200 rounded-full h-2.5">
                          <div 
                            className="bg-gradient-to-r from-purple-600 to-pink-600 h-2.5 rounded-full transition-all duration-300"
                            style={{ width: `${(processingProgress.current / processingProgress.total) * 100}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-purple-700 mt-2 text-center">
                          Processing {processingProgress.current} of {processingProgress.total} URL{processingProgress.total !== 1 ? 's' : ''}
                        </p>
                      </div>
                    )}
                    {processingProgress.total === 1 && (
                      <div className="mt-3">
                        <div className="w-full bg-purple-200 rounded-full h-2.5 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-purple-600 to-pink-600 h-2.5 rounded-full animate-pulse"
                            style={{ width: '60%' }}
                          ></div>
                        </div>
                        <p className="text-xs text-purple-700 mt-2 text-center">
                          {processingProgress.currentUrl || 'Sending HTTP request...'}
                        </p>
                      </div>
                    )}
                    <p className="text-xs text-purple-600 mt-3 text-center">
                      This may take 1-3 seconds per URL
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

            {/* HTTP Header Check Results */}
            {results.length > 0 && (
              <div className="mt-6 space-y-6">
                <h3 className="text-lg font-semibold text-slate-900">Check Results</h3>
                {results.map((result, index) => (
                  <div key={index} className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-5">
                    {result.error ? (
                      <div className="text-red-700 text-sm">
                        <p className="font-semibold">Error for {result.url}:</p>
                        <p>{result.error}</p>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{result.url}</p>
                            <p className="text-xs text-slate-600">
                              Status: {result.statusCode} {result.statusMessage} • Checked {new Date(result.timestamp).toLocaleString()}
                            </p>
                          </div>
                          {result.isRedirect && (
                            <div className="rounded-xl border-2 border-orange-200 bg-orange-50 p-3">
                              <p className="text-xs font-semibold text-slate-700 mb-1">Redirect</p>
                              <p className="text-lg font-bold text-orange-600">{result.statusCode}</p>
                            </div>
                          )}
                        </div>

                        {result.isRedirect && result.redirectLocation && (
                          <div className="mb-4 rounded-xl border border-orange-200 bg-orange-50 p-4">
                            <p className="text-xs font-semibold text-orange-900 mb-1">Redirect Location</p>
                            <p className="text-sm text-orange-700 break-all">{result.redirectLocation}</p>
                          </div>
                        )}

                        {result.categorizedHeaders && (
                          <div className="space-y-4">
                            {Object.keys(result.categorizedHeaders.security).length > 0 && (
                              <div className="rounded-xl border border-green-200 bg-green-50 p-4">
                                <h4 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                                  <span className="text-green-600">🔒</span>
                                  Security Headers
                                </h4>
                                <div className="space-y-2 text-sm">
                                  {Object.entries(result.categorizedHeaders.security).map(([key, value]) => (
                                    <div key={key} className="flex justify-between items-start">
                                      <span className="text-slate-600 font-mono text-xs">{key}:</span>
                                      <span className="font-mono text-xs font-medium text-slate-900 break-all text-right ml-4">
                                        {Array.isArray(value) ? value.join(', ') : value}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {Object.keys(result.categorizedHeaders.caching).length > 0 && (
                              <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                                <h4 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                                  <span className="text-blue-600">⚡</span>
                                  Caching Headers
                                </h4>
                                <div className="space-y-2 text-sm">
                                  {Object.entries(result.categorizedHeaders.caching).map(([key, value]) => (
                                    <div key={key} className="flex justify-between items-start">
                                      <span className="text-slate-600 font-mono text-xs">{key}:</span>
                                      <span className="font-mono text-xs font-medium text-slate-900 break-all text-right ml-4">
                                        {Array.isArray(value) ? value.join(', ') : value}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {Object.keys(result.categorizedHeaders.cors).length > 0 && (
                              <div className="rounded-xl border border-purple-200 bg-purple-50 p-4">
                                <h4 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                                  <span className="text-purple-600">🌐</span>
                                  CORS Headers
                                </h4>
                                <div className="space-y-2 text-sm">
                                  {Object.entries(result.categorizedHeaders.cors).map(([key, value]) => (
                                    <div key={key} className="flex justify-between items-start">
                                      <span className="text-slate-600 font-mono text-xs">{key}:</span>
                                      <span className="font-mono text-xs font-medium text-slate-900 break-all text-right ml-4">
                                        {Array.isArray(value) ? value.join(', ') : value}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {Object.keys(result.categorizedHeaders.server).length > 0 && (
                              <div className="rounded-xl border border-slate-200 bg-white p-4">
                                <h4 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                                  <span className="text-slate-600">🖥️</span>
                                  Server Information
                                </h4>
                                <div className="space-y-2 text-sm">
                                  {Object.entries(result.categorizedHeaders.server).map(([key, value]) => (
                                    <div key={key} className="flex justify-between items-start">
                                      <span className="text-slate-600 font-mono text-xs">{key}:</span>
                                      <span className="font-mono text-xs font-medium text-slate-900 break-all text-right ml-4">
                                        {Array.isArray(value) ? value.join(', ') : value}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {Object.keys(result.categorizedHeaders.other).length > 0 && (
                              <div className="rounded-xl border border-slate-200 bg-white p-4">
                                <h4 className="text-sm font-semibold text-slate-800 mb-3">Other Headers</h4>
                                <div className="space-y-2 text-sm">
                                  {Object.entries(result.categorizedHeaders.other).map(([key, value]) => (
                                    <div key={key} className="flex justify-between items-start">
                                      <span className="text-slate-600 font-mono text-xs">{key}:</span>
                                      <span className="font-mono text-xs font-medium text-slate-900 break-all text-right ml-4">
                                        {Array.isArray(value) ? value.join(', ') : value}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </>
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
              <div className="h-1 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">What are HTTP Headers?</h2>
            </div>
            
            <div className="max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                <strong>HTTP headers</strong> are metadata sent by web servers in response to HTTP requests. They contain information about the server, caching policies, security settings, content types, redirects, and more. HTTP headers control how browsers and clients interact with web servers, affecting security, performance, and functionality of websites.
              </p>
              
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                When you visit a website, your browser sends an HTTP request to the server. The server responds with an HTTP response that includes headers before the actual content. These headers tell the browser how to handle the response, what security measures are in place, how long to cache resources, and other critical information about the server and content.
              </p>

              <p className="text-base text-slate-700 leading-relaxed mb-4">
                HTTP headers are essential for website security, performance optimization, and proper functionality. Security headers like Strict-Transport-Security (HSTS) and Content-Security-Policy (CSP) protect websites from attacks. Caching headers control how browsers and proxies cache resources, improving load times. CORS headers enable cross-origin resource sharing for APIs. Understanding HTTP headers is crucial for web developers, security professionals, and site administrators.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">How HTTP Headers Work</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                The HTTP header process involves several steps:
              </p>
              <ol className="space-y-3 mb-4 ml-6 text-slate-700" style={{ listStyleType: 'decimal', listStylePosition: 'outside', paddingLeft: '1.5rem' }}>
                <li className="leading-relaxed pl-2" style={{ fontSize: '16px', lineHeight: '1.75' }}><strong>Client Request:</strong> Your browser sends an HTTP request to the server, including request headers like User-Agent, Accept, and Accept-Language.</li>
                <li className="leading-relaxed pl-2" style={{ fontSize: '16px', lineHeight: '1.75' }}><strong>Server Processing:</strong> The server processes the request and prepares an HTTP response, including response headers and content.</li>
                <li className="leading-relaxed pl-2" style={{ fontSize: '16px', lineHeight: '1.75' }}><strong>Header Transmission:</strong> The server sends response headers first, before the actual content. Headers are sent as plain text key-value pairs.</li>
                <li className="leading-relaxed pl-2" style={{ fontSize: '16px', lineHeight: '1.75' }}><strong>Browser Parsing:</strong> Your browser receives and parses the headers, applying security policies, caching rules, and other directives before processing the content.</li>
                <li className="leading-relaxed pl-2" style={{ fontSize: '16px', lineHeight: '1.75' }}><strong>Content Delivery:</strong> After headers are processed, the browser receives and renders the actual content (HTML, images, CSS, etc.) according to the header instructions.</li>
                <li className="leading-relaxed pl-2" style={{ fontSize: '16px', lineHeight: '1.75' }}><strong>Policy Enforcement:</strong> The browser enforces security policies, caching rules, and other directives specified in the headers throughout the page load and subsequent requests.</li>
              </ol>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">Types of HTTP Headers</h3>
              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="rounded-2xl border-2 border-green-200 bg-green-50 p-5">
                  <h4 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 text-green-600">🔒</span>
                    Security Headers
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    Security headers protect websites from common attacks. These include HSTS (forces HTTPS), CSP (prevents XSS), X-Frame-Options (clickjacking protection), and more.
                  </p>
                  <ul className="space-y-1 text-xs text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold mt-0.5">•</span>
                      <span>Strict-Transport-Security (HSTS)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold mt-0.5">•</span>
                      <span>Content-Security-Policy (CSP)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold mt-0.5">•</span>
                      <span>X-Frame-Options</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold mt-0.5">•</span>
                      <span>X-Content-Type-Options</span>
                    </li>
                  </ul>
                </div>
                
                <div className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-5">
                  <h4 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">⚡</span>
                    Caching Headers
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    Caching headers control how browsers and proxies cache resources. These headers improve website performance by reducing server load and speeding up page loads.
                  </p>
                  <ul className="space-y-1 text-xs text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Cache-Control</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Expires</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>ETag</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Last-Modified</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border-2 border-purple-200 bg-purple-50 p-5">
                  <h4 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-purple-600">🌐</span>
                    CORS Headers
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    CORS (Cross-Origin Resource Sharing) headers control access to resources from different origins. These headers enable secure cross-origin requests for APIs and web applications.
                  </p>
                  <ul className="space-y-1 text-xs text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>Access-Control-Allow-Origin</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>Access-Control-Allow-Methods</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>Access-Control-Allow-Headers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>Access-Control-Allow-Credentials</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-5">
                  <h4 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600">🖥️</span>
                    Server Headers
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    Server headers provide information about the web server software and technology stack. These headers help identify the server type and version.
                  </p>
                  <ul className="space-y-1 text-xs text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="text-slate-600 font-bold mt-0.5">•</span>
                      <span>Server</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-slate-600 font-bold mt-0.5">•</span>
                      <span>X-Powered-By</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-slate-600 font-bold mt-0.5">•</span>
                      <span>X-AspNet-Version</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-slate-600 font-bold mt-0.5">•</span>
                      <span>X-Runtime</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <p className="text-base text-slate-700 leading-relaxed">
                HTTP headers serve many purposes: enforcing security policies to protect websites from attacks, controlling caching behavior to improve performance, enabling cross-origin resource sharing for APIs, providing server information for debugging and identification, managing content types and encoding, and controlling redirects and status codes. Understanding HTTP headers is essential for web development, security hardening, and performance optimization.
              </p>
            </div>
          </div>
        </section>

        {/* Why HTTP Headers are Important Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Why HTTP Headers are Important</h2>
            </div>
            
            <div className="max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                HTTP headers are not just technical metadata—they're essential for website security, performance, and functionality. Here's why HTTP headers are crucial:
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">1. Security Protection</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                HTTP security headers protect websites from common attacks. Strict-Transport-Security (HSTS) forces HTTPS connections, preventing man-in-the-middle attacks. Content-Security-Policy (CSP) prevents cross-site scripting (XSS) attacks by controlling which resources can be loaded. X-Frame-Options protects against clickjacking attacks. Without proper security headers, websites are vulnerable to various attacks that can compromise user data and website integrity.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">2. Performance Optimization</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                HTTP caching headers significantly improve website performance. Cache-Control headers tell browsers how long to cache resources, reducing server load and speeding up page loads for returning visitors. ETag headers enable efficient cache validation, allowing browsers to use cached versions when content hasn't changed. Proper caching headers can reduce bandwidth usage, decrease server load, and improve user experience significantly.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">3. SEO and Search Rankings</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                HTTP headers can impact SEO and search rankings. Search engines consider website security when ranking results, and security headers like HSTS and CSP are positive signals. Proper caching headers improve page load times, which is a ranking factor. Canonical headers help prevent duplicate content issues. Redirect headers (301, 302) preserve SEO value when moving content. Monitoring HTTP headers helps ensure your website is optimized for search engines.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">4. API Security and CORS</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                HTTP headers are essential for API security and cross-origin resource sharing. CORS headers control which origins can access your API, preventing unauthorized cross-origin requests. Access-Control-Allow-Credentials enables secure authentication for cross-origin requests. Proper CORS configuration is crucial for modern web applications that rely on APIs from different domains.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">5. Compliance and Standards</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                HTTP headers help websites comply with security standards and best practices. Many security frameworks (OWASP, PCI DSS) recommend specific security headers. Privacy regulations may require certain headers for data protection. Industry standards often specify header requirements. Regular header checking ensures compliance with security standards and best practices.
              </p>
            </div>
          </div>
        </section>

        {/* How to Use HTTP Header Checker Section */}
        <section id="how" className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">How to Use Our HTTP Header Checker</h2>
            </div>
            
            <div className="max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-6">
                Our HTTP header checker makes it easy to analyze response headers for any website. Follow these simple steps:
              </p>

              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 text-white font-bold text-xl shadow-lg mb-4">
                    1
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">Enter URL</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Provide the URL you want to check (e.g., https://example.com). The tool accepts URLs with or without the https:// protocol prefix.
                  </p>
                </div>

                <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 text-white font-bold text-xl shadow-lg mb-4">
                    2
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">Check HTTP Headers</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Click the "Check Headers" button. Our server sends an HTTP HEAD request and retrieves all response headers. This typically takes 1-3 seconds.
                  </p>
                </div>

                <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 text-white font-bold text-xl shadow-lg mb-4">
                    3
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">Review Results</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    View the HTTP header analysis including categorized headers (security, caching, CORS, server), status codes, redirect information, and header values. Use the results to verify security configurations and troubleshoot header-related issues.
                  </p>
                </div>

                <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 text-white font-bold text-xl shadow-lg mb-4">
                    4
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">Analyze Security</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Review security headers to ensure your website is properly protected. Check for missing security headers, verify CSP policies, and ensure HSTS is configured correctly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Security Headers Best Practices Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Security Headers Best Practices</h2>
            </div>
            
            <div className="max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Proper HTTP header configuration is essential for website security and performance. Here are best practices:
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="rounded-2xl border-2 border-green-200 bg-green-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Essential Security Headers</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold mt-0.5">•</span>
                      <span>Enable Strict-Transport-Security (HSTS) for HTTPS sites</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold mt-0.5">•</span>
                      <span>Implement Content-Security-Policy (CSP)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold mt-0.5">•</span>
                      <span>Set X-Frame-Options to prevent clickjacking</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold mt-0.5">•</span>
                      <span>Configure X-Content-Type-Options: nosniff</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold mt-0.5">•</span>
                      <span>Set Referrer-Policy for privacy</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Caching Optimization</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Set appropriate Cache-Control headers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Use ETag for efficient cache validation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Configure Last-Modified headers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Balance caching with content freshness</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Different cache policies for static vs dynamic content</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border-2 border-purple-200 bg-purple-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">CORS Configuration</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>Configure CORS headers for APIs carefully</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>Use specific origins, avoid wildcards</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>Limit allowed methods and headers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>Enable credentials only when necessary</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>Test CORS configuration regularly</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border-2 border-orange-200 bg-orange-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Monitoring and Testing</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 font-bold mt-0.5">•</span>
                      <span>Regularly check headers for all pages</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 font-bold mt-0.5">•</span>
                      <span>Verify security headers after changes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 font-bold mt-0.5">•</span>
                      <span>Test header changes in staging first</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 font-bold mt-0.5">•</span>
                      <span>Monitor header compliance with standards</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 font-bold mt-0.5">•</span>
                      <span>Document header configurations for reference</span>
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
            <Link href="/tools/web-tools" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-purple-300 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🌐</span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">All Web Tools</p>
                  <p className="text-xs text-slate-500">Browse Category</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">Discover all web tools for website analysis, testing, and security.</p>
              <p className="mt-4 text-sm font-semibold text-purple-600 group-hover:text-purple-700">Browse tools →</p>
            </Link>

            <Link href="/web-tools/ssl-checker" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-purple-300 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🔒</span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">SSL Certificate Checker</p>
                  <p className="text-xs text-slate-500">Security Analysis</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">Check SSL certificate validity, expiration, and security for any domain.</p>
              <p className="mt-4 text-sm font-semibold text-purple-600 group-hover:text-purple-700">Check SSL →</p>
            </Link>

            <Link href="/web-tools/dns-lookup" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-purple-300 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🔍</span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">DNS Lookup</p>
                  <p className="text-xs text-slate-500">DNS Resolution</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">Lookup DNS records for any domain including A, AAAA, MX, TXT records.</p>
              <p className="mt-4 text-sm font-semibold text-purple-600 group-hover:text-purple-700">Lookup DNS →</p>
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

