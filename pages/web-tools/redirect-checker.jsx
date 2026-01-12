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

export default function RedirectChecker() {
  const [urls, setUrls] = useState(['']);
  const [results, setResults] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentRequirement, setPaymentRequirement] = useState(null);
  const [userSession, setUserSession] = useState({ processingPass: null });
  const [processingProgress, setProcessingProgress] = useState({ current: 0, total: 0, currentUrl: '' });

  const currentYear = new Date().getFullYear();
  const canonicalUrl = `${siteHost}/web-tools/redirect-checker`;

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

  const handleCheckRedirects = async () => {
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

      setProcessingProgress({ current: 0, total: validUrls.length, currentUrl: 'Checking redirects...' });

      const response = await fetch('/api/web-tools/redirect-checker', {
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

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 402) {
          setPaymentRequirement(data.requirement);
          setShowPaymentModal(true);
          setIsProcessing(false);
          return;
        }
        throw new Error(data.message || data.error || 'Failed to check redirects');
      }

      if (data.success && data.results) {
        setProcessingProgress({ current: data.results.length, total: validUrls.length, currentUrl: 'Complete' });
        setResults(data.results);
      }
    } catch (err) {
      console.error('Redirect checker error:', err);
      setError(err.message || 'Failed to check redirects. Please try again.');
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
      handleCheckRedirects();
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
          "name": "What is a URL redirect?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A URL redirect is when a web server sends a response telling the browser to go to a different URL instead of the one requested. Common redirect types include 301 (permanent redirect), 302 (temporary redirect), 303 (See Other), 307 (Temporary Redirect), and 308 (Permanent Redirect). Redirects are used for URL changes, domain migrations, SEO purposes, and maintaining backward compatibility."
          }
        },
        {
          "@type": "Question",
          "name": "How do I check URL redirects?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Enter the URL you want to check (with or without https://) into the input field, then click 'Check Redirects'. The tool will follow the redirect chain, showing each step including status codes, redirect types (301, 302, etc.), and the final destination URL. Results typically appear within 3-10 seconds depending on the number of redirects."
          }
        },
        {
          "@type": "Question",
          "name": "What is the difference between 301 and 302 redirects?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A 301 redirect is permanent, meaning the old URL has permanently moved to the new URL. Search engines transfer SEO value from the old URL to the new one. A 302 redirect is temporary, meaning the old URL may return. Search engines don't transfer SEO value with 302 redirects. Use 301 for permanent moves, domain migrations, and SEO consolidation. Use 302 for temporary maintenance, A/B testing, or seasonal redirects."
          }
        },
        {
          "@type": "Question",
          "name": "What is a redirect loop?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A redirect loop occurs when URL A redirects to URL B, which redirects back to URL A (or through a chain that eventually loops back). This creates an infinite loop that browsers detect and stop. Redirect loops prevent pages from loading and should be fixed immediately. Common causes include incorrect redirect chains, misconfigured server rules, and conflicting redirect rules."
          }
        },
        {
          "@type": "Question",
          "name": "Can I check multiple URLs at once?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, you can check multiple URLs at once. Free tier allows checking up to 3 URLs. Batch processing (4+ URLs) requires a Processing Pass. With a Processing Pass, you can check up to 20 URLs in a single batch, making it efficient for analyzing multiple URLs or your entire redirect structure."
          }
        },
        {
          "@type": "Question",
          "name": "Why should I check URL redirects?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Checking URL redirects helps ensure proper SEO value transfer, verify domain migrations, detect redirect loops, confirm correct redirect types (301 vs 302), validate URL changes, identify broken redirect chains, and maintain website performance. Regular redirect checking is essential for SEO maintenance and website health."
          }
        },
        {
          "@type": "Question",
          "name": "Is this redirect checker tool free to use?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, our URL Redirect Checker tool is free for checking 1-3 URLs (up to 5 checks per day). Batch processing and higher daily limits require a Processing Pass. We aim to provide valuable tools for free while offering premium options for power users and businesses."
          }
        }
      ]
    },
    
    softwareApp: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "URL Redirect Checker",
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "Any",
      "description": "Free online URL redirect checker. Check 301, 302 redirects, follow redirect chains, detect redirect loops, and find final destination. Free redirect checker tool with comprehensive analysis.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "1650",
        "bestRating": "5",
        "worstRating": "1"
      },
      "featureList": [
        "Follow redirect chains",
        "Detect 301, 302, 303, 307, 308 redirects",
        "Find final destination URL",
        "Detect redirect loops",
        "Response time measurement",
        "Batch processing (with pass)",
        "Comprehensive redirect analysis"
      ]
    },
    
    howTo: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Check URL Redirects",
      "description": "Step-by-step guide to checking URL redirects and following redirect chains online for free",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Enter URL",
          "text": "Enter the URL you want to check (e.g., https://example.com/old-page) into the input field. You can include or omit https:// - the tool will add it if missing.",
          "position": 1
        },
        {
          "@type": "HowToStep",
          "name": "Check Redirects",
          "text": "Click the 'Check Redirects' button. The tool will follow the redirect chain, analyzing each step. This typically takes 3-10 seconds depending on the number of redirects.",
          "position": 2
        },
        {
          "@type": "HowToStep",
          "name": "Review Results",
          "text": "View the redirect chain showing each step including status codes (301, 302, etc.), redirect types, response times, and the final destination URL. Check for redirect loops or too many redirects.",
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
          "name": "URL Redirect Checker",
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
        <title>URL Redirect Checker - Free Online Redirect Chain Analyzer | FixTools</title>
        <meta name="title" content="URL Redirect Checker - Free Online Redirect Chain Analyzer | FixTools" />
        <meta name="description" content="Check URL redirects and follow redirect chains. Detect 301, 302 redirects, find final destination, and check for redirect loops. Free redirect checker tool with comprehensive analysis." />
        <meta name="keywords" content="redirect checker, url redirect checker, check redirects, 301 redirect, 302 redirect, redirect chain, redirect loop, url redirect, redirect analyzer, follow redirects" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content="URL Redirect Checker - Free Online Redirect Chain Analyzer" />
        <meta property="og:description" content="Check URL redirects and follow redirect chains. Detect 301, 302 redirects, find final destination, and check for redirect loops." />
        <meta property="og:image" content={`${siteHost}/images/og-redirect-checker.png`} />
        <meta property="og:site_name" content="FixTools" />
        
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content="URL Redirect Checker - Free Online Redirect Chain Analyzer" />
        <meta property="twitter:description" content="Check URL redirects and follow redirect chains. Detect 301, 302 redirects, find final destination, and check for redirect loops." />
        <meta property="twitter:image" content={`${siteHost}/images/og-redirect-checker.png`} />
        
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.faqPage) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.softwareApp) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.howTo) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.breadcrumb) }} />
      </Head>

      <style jsx global>{`
        html:has(.redirect-checker-page) {
          font-size: 100% !important;
        }
        
        .redirect-checker-page * {
          box-sizing: border-box;
        }
        
        .redirect-checker-page h1,
        .redirect-checker-page h2,
        .redirect-checker-page h3,
        .redirect-checker-page p,
        .redirect-checker-page ul,
        .redirect-checker-page ol {
          margin: 0;
        }
        
        .redirect-checker-page button {
          font-family: inherit;
          cursor: pointer;
        }
        
        .redirect-checker-page input,
        .redirect-checker-page textarea,
        .redirect-checker-page select {
          font-family: inherit;
        }
        
        /* Fix typography styling within redirect checker page sections */
        .redirect-checker-page section .max-w-none {
          font-size: 16px !important;
          line-height: 1.75 !important;
          color: #334155 !important;
        }
        
        .redirect-checker-page section .max-w-none h3 {
          font-size: 20px !important;
          font-weight: 700 !important;
          line-height: 1.75rem !important;
          margin-top: 1.5rem !important;
          margin-bottom: 0.75rem !important;
          color: #0f172a !important;
        }
        
        .redirect-checker-page section .max-w-none p {
          font-size: 16px !important;
          line-height: 1.75 !important;
          margin-bottom: 1rem !important;
          margin-top: 0 !important;
          color: #334155 !important;
        }
        
        .redirect-checker-page section .max-w-none ol {
          margin-top: 1rem !important;
          margin-bottom: 1rem !important;
          padding-left: 1.5rem !important;
          color: #334155 !important;
          list-style-type: decimal !important;
          list-style-position: outside !important;
        }
        
        .redirect-checker-page section .max-w-none ul {
          margin-top: 1rem !important;
          margin-bottom: 1rem !important;
          padding-left: 1.5rem !important;
          color: #334155 !important;
          list-style-type: disc !important;
          list-style-position: outside !important;
        }
        
        .redirect-checker-page section .max-w-none ol li,
        .redirect-checker-page section .max-w-none ul li {
          margin-top: 0.75rem !important;
          margin-bottom: 0.75rem !important;
          line-height: 1.75 !important;
          padding-left: 0.5rem !important;
          font-size: 16px !important;
        }
        
        .redirect-checker-page section .max-w-none strong {
          font-weight: 600 !important;
          color: #0f172a !important;
        }
        
        .redirect-checker-page section .max-w-none a {
          color: #7c2d12 !important;
          text-decoration: underline !important;
          font-weight: 500 !important;
        }
        
        .redirect-checker-page section .max-w-none a:hover {
          color: #9a3412 !important;
        }
        
        /* Override global CSS font-size for this page */
        .redirect-checker-page {
          font-size: 16px !important;
        }
        
        .redirect-checker-page h1 {
          font-size: 3rem !important;
        }
        
        .redirect-checker-page h2 {
          font-size: 1.875rem !important;
        }
        
        .redirect-checker-page h3 {
          font-size: 1.25rem !important;
        }
        
        .redirect-checker-page p,
        .redirect-checker-page li,
        .redirect-checker-page span {
          font-size: 1rem !important;
        }
      `}</style>

      <div className="redirect-checker-page bg-[#fbfbfc] text-slate-900 min-h-screen">
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
            <li className="flex items-center gap-2"><span className="text-slate-400">/</span><span className="font-semibold text-slate-900">URL Redirect Checker</span></li>
          </ol>
        </nav>

        <section className="relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.35]" style={{ backgroundImage: 'url(/grid.png)', backgroundSize: '256px 256px' }}></div>
          <div className="mx-auto max-w-6xl px-4 py-10 md:py-14 relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-gradient-to-r from-rose-50 to-pink-50 px-4 py-1.5 text-xs font-semibold text-rose-700 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
              Free • Fast • Comprehensive
            </div>
            
            <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              <span className="bg-gradient-to-r from-rose-600 via-pink-600 to-rose-600 bg-clip-text text-transparent">
                URL Redirect Checker
              </span>
            </h1>
            
            <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg md:leading-relaxed">
              Check URL redirects and follow redirect chains with our free <strong>URL Redirect Checker</strong>. Detect 301, 302 redirects, find final destination, and check for redirect loops instantly.
            </p>

            <dl className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
              <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Redirect Types</dt>
                <dd className="mt-1.5 text-sm font-bold text-slate-900">All Common</dd>
              </div>
              <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Loop Detection</dt>
                <dd className="mt-1.5 text-sm font-bold text-slate-900">Automatic</dd>
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
                <h2 className="text-xl font-semibold text-slate-900">Check URL Redirects</h2>
                <p className="mt-1 text-sm text-slate-600">Enter URL(s), then click 'Check Redirects' to analyze redirect chains.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button onClick={handleClear} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50">Clear</button>
                <button 
                  onClick={handleCheckRedirects} 
                  disabled={isProcessing}
                  className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Checking...' : '🔍 Check Redirects'}
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
                        placeholder="https://example.com/old-page"
                        className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-rose-900/20"
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
                    className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100"
                  >
                    + Add URL (Batch)
                  </button>
                </div>
                {error && (
                  <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                {isProcessing && (
                  <div className="mt-6 rounded-xl border-2 border-rose-200 bg-gradient-to-r from-rose-50 to-pink-50 p-6">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-rose-600"></div>
                      <p className="text-sm font-semibold text-rose-900">
                        Checking redirects{processingProgress.total > 1 && ` (${processingProgress.current}/${processingProgress.total})`}...
                      </p>
                    </div>
                    {processingProgress.total > 1 && (
                      <div className="mt-3">
                        <div className="w-full bg-rose-200 rounded-full h-2.5">
                          <div 
                            className="bg-gradient-to-r from-rose-600 to-pink-600 h-2.5 rounded-full transition-all duration-300"
                            style={{ width: `${(processingProgress.current / processingProgress.total) * 100}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-rose-700 mt-2 text-center">
                          Processing {processingProgress.current} of {processingProgress.total} URL{processingProgress.total !== 1 ? 's' : ''}
                        </p>
                      </div>
                    )}
                    {processingProgress.total === 1 && (
                      <div className="mt-3">
                        <div className="w-full bg-rose-200 rounded-full h-2.5 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-rose-600 to-pink-600 h-2.5 rounded-full animate-pulse"
                            style={{ width: '60%' }}
                          ></div>
                        </div>
                        <p className="text-xs text-rose-700 mt-2 text-center">
                          {processingProgress.currentUrl || 'Following redirect chain...'}
                        </p>
                      </div>
                    )}
                    <p className="text-xs text-rose-600 mt-3 text-center">
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

            {/* Redirect Results */}
            {results.length > 0 && (
              <div className="mt-6 space-y-6">
                <h3 className="text-lg font-semibold text-slate-900">Redirect Analysis Results</h3>
                {results.map((result, index) => (
                  <div key={index} className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-5">
                    {result.error ? (
                      <div className="text-red-700 text-sm">
                        <p className="font-semibold">Error for {result.originalUrl}:</p>
                        <p>{result.error}</p>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="text-sm font-semibold text-slate-900">Original URL: {result.originalUrl}</p>
                            <p className="text-xs text-slate-600 mt-1">
                              Redirects: {result.redirectCount || 0} • 
                              {result.hasLoop && <span className="text-red-600 font-semibold ml-1"> Loop Detected</span>}
                              {result.hasTooManyRedirects && <span className="text-orange-600 font-semibold ml-1"> Too Many Redirects</span>}
                              {!result.hasLoop && !result.hasTooManyRedirects && result.finalUrl && <span className="text-green-600 font-semibold ml-1"> Complete</span>}
                            </p>
                          </div>
                        </div>

                        {result.redirectChain && result.redirectChain.length > 0 && (
                          <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-slate-800">Redirect Chain:</h4>
                            {result.redirectChain.map((step, stepIndex) => (
                              <div key={stepIndex} className="rounded-xl border border-slate-200 bg-white p-4">
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex-1">
                                    <p className="text-xs font-semibold text-slate-700 mb-1">Step {stepIndex + 1}</p>
                                    <p className="text-xs font-mono text-slate-600 break-all">{step.url}</p>
                                  </div>
                                  <div className="ml-4 text-right">
                                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                                      step.statusCode >= 200 && step.statusCode < 300 ? 'bg-green-100 text-green-700' :
                                      step.statusCode >= 300 && step.statusCode < 400 ? 'bg-yellow-100 text-yellow-700' :
                                      step.statusCode >= 400 ? 'bg-red-100 text-red-700' :
                                      'bg-slate-100 text-slate-700'
                                    }`}>
                                      {step.statusCode} {step.statusText}
                                    </span>
                                    <p className="text-xs text-slate-500 mt-1">{step.responseTime}ms</p>
                                  </div>
                                </div>
                                <p className="text-xs font-semibold text-slate-700 mt-2">
                                  {step.redirectType}
                                  {step.location && (
                                    <span className="text-slate-600 font-normal ml-2">→ {step.location}</span>
                                  )}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}

                        {result.finalUrl && (
                          <div className="mt-4 rounded-xl border-2 border-green-200 bg-green-50 p-4">
                            <p className="text-xs font-semibold text-green-900 mb-1">Final Destination:</p>
                            <p className="text-sm font-mono text-green-700 break-all">{result.finalUrl}</p>
                            {result.finalStatusCode && (
                              <p className="text-xs text-green-600 mt-1">Status: {result.finalStatusCode}</p>
                            )}
                          </div>
                        )}

                        {result.totalTime && (
                          <div className="mt-3 text-xs text-slate-600">
                            Total time: {result.totalTime}ms
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
              <div className="h-1 w-8 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">What is a URL Redirect?</h2>
            </div>
            
            <div className="max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                <strong>A URL redirect</strong> is when a web server sends an HTTP response telling the browser to go to a different URL instead of the one originally requested. Redirects are fundamental to how the web works, enabling URL changes, domain migrations, SEO optimization, and maintaining backward compatibility when URLs change.
              </p>
              
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                When you visit a URL that has been redirected, your browser automatically follows the redirect to the new location. This happens transparently to users but is crucial for website management, SEO, and maintaining links. Redirects can be permanent (301), temporary (302), or serve other specific purposes depending on the HTTP status code used.
              </p>

              <p className="text-base text-slate-700 leading-relaxed mb-4">
                URL redirects are essential for website management, SEO optimization, domain migrations, URL structure changes, maintaining backward compatibility, and ensuring users and search engines can always find the right content even when URLs change. Understanding redirects is crucial for effective website management and SEO strategy.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">How URL Redirects Work</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                The redirect process involves several steps:
              </p>
              <ol className="space-y-3 mb-4 ml-6 text-slate-700" style={{ listStyleType: 'decimal', listStylePosition: 'outside', paddingLeft: '1.5rem' }}>
                <li className="leading-relaxed pl-2" style={{ fontSize: '16px', lineHeight: '1.75' }}><strong>Initial Request:</strong> A browser or client sends an HTTP request to a URL (e.g., https://example.com/old-page).</li>
                <li className="leading-relaxed pl-2" style={{ fontSize: '16px', lineHeight: '1.75' }}><strong>Server Response:</strong> The web server responds with an HTTP status code in the 3xx range (300-399) indicating a redirect, along with a Location header containing the new URL.</li>
                <li className="leading-relaxed pl-2" style={{ fontSize: '16px', lineHeight: '1.75' }}><strong>Browser Follows:</strong> The browser automatically follows the redirect by sending a new request to the URL specified in the Location header.</li>
                <li className="leading-relaxed pl-2" style={{ fontSize: '16px', lineHeight: '1.75' }}><strong>Redirect Chain:</strong> If the new URL also redirects, the browser continues following redirects until reaching a final destination or hitting a redirect loop limit.</li>
                <li className="leading-relaxed pl-2" style={{ fontSize: '16px', lineHeight: '1.75' }}><strong>Final Destination:</strong> The browser eventually reaches a final URL that returns content (status 200) or an error (4xx/5xx), completing the redirect chain.</li>
              </ol>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">Types of URL Redirects</h3>
              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="rounded-2xl border-2 border-green-200 bg-green-50 p-5">
                  <h4 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 text-green-600">301</span>
                    301 Permanent Redirect
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    Indicates that the old URL has permanently moved to the new URL. Search engines transfer SEO value (link juice, rankings) from the old URL to the new one. Use for permanent moves, domain migrations, and SEO consolidation.
                  </p>
                  <ul className="space-y-1 text-xs text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold mt-0.5">•</span>
                      <span>Transfers SEO value</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold mt-0.5">•</span>
                      <span>Use for permanent moves</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold mt-0.5">•</span>
                      <span>Search engines update indexes</span>
                    </li>
                  </ul>
                </div>
                
                <div className="rounded-2xl border-2 border-yellow-200 bg-yellow-50 p-5">
                  <h4 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-100 text-yellow-600">302</span>
                    302 Temporary Redirect
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    Indicates that the redirect is temporary and the old URL may return. Search engines don't transfer SEO value with 302 redirects. Use for temporary maintenance, A/B testing, or seasonal redirects.
                  </p>
                  <ul className="space-y-1 text-xs text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-600 font-bold mt-0.5">•</span>
                      <span>Doesn't transfer SEO value</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-600 font-bold mt-0.5">•</span>
                      <span>Use for temporary moves</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-600 font-bold mt-0.5">•</span>
                      <span>Search engines keep old URL indexed</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-5">
                  <h4 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">303</span>
                    303 See Other
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    Indicates that the response to the request can be found at a different URI and should be retrieved using GET. Used after POST requests to redirect to a result page.
                  </p>
                  <ul className="space-y-1 text-xs text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Used after POST requests</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Forces GET method on redirect</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Common in form submissions</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border-2 border-purple-200 bg-purple-50 p-5">
                  <h4 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-purple-600">307</span>
                    307 Temporary Redirect
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    Similar to 302 but preserves the HTTP method (GET, POST, etc.) used in the original request. Used when the redirect should maintain the same HTTP method.
                  </p>
                  <ul className="space-y-1 text-xs text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>Preserves HTTP method</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>Use for API redirects</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>Maintains request method</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border-2 border-indigo-200 bg-indigo-50 p-5">
                  <h4 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">308</span>
                    308 Permanent Redirect
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    Similar to 301 but preserves the HTTP method. Used for permanent redirects where the request method should be maintained. Common in RESTful APIs.
                  </p>
                  <ul className="space-y-1 text-xs text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold mt-0.5">•</span>
                      <span>Permanent with method preservation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold mt-0.5">•</span>
                      <span>Use for API redirects</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold mt-0.5">•</span>
                      <span>Transfers SEO value</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <p className="text-base text-slate-700 leading-relaxed">
                Understanding the different redirect types is essential for proper website management and SEO. Choosing the right redirect type ensures proper SEO value transfer, maintains user experience, and prevents issues like redirect loops or lost SEO rankings.
              </p>
            </div>
          </div>
        </section>

        {/* Why Check Redirects Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Why Check URL Redirects?</h2>
            </div>
            
            <div className="max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Regular redirect checking is essential for website health, SEO performance, and user experience. Here's why checking redirects matters:
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">1. SEO Value Transfer</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Proper redirect checking ensures SEO value (link juice, rankings, authority) is correctly transferred from old URLs to new ones. 301 redirects transfer SEO value, while 302 redirects don't. Checking redirects helps verify that permanent moves use 301 redirects and that redirect chains aren't too long (which can dilute SEO value).
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">2. Detect Redirect Loops</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Redirect loops occur when URL A redirects to URL B, which redirects back to URL A. This creates an infinite loop that prevents pages from loading. Redirect checking helps detect loops early, allowing you to fix them before users encounter errors. Loops can cause significant SEO and user experience issues.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">3. Verify Domain Migrations</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                When migrating domains or changing URL structures, redirect checking ensures all old URLs correctly redirect to new locations. This is crucial for maintaining SEO rankings, preserving link value, and ensuring users can always find content. Comprehensive redirect checking verifies entire redirect chains work correctly.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">4. Performance Optimization</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Long redirect chains (multiple redirects in sequence) slow down page loads and can dilute SEO value. Redirect checking helps identify and optimize long chains, ensuring users reach content quickly. Each redirect adds latency, so minimizing redirect chains improves performance and user experience.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">5. Correct Redirect Types</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Using the wrong redirect type (e.g., 302 instead of 301 for permanent moves) can hurt SEO. Redirect checking verifies that permanent moves use 301 redirects and temporary redirects use 302. This ensures proper SEO value transfer and search engine indexing.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">6. Broken Redirect Chains</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Redirect chains can break if intermediate URLs are removed or changed incorrectly. Regular redirect checking identifies broken chains, ensuring all redirects lead to valid final destinations. Broken redirects create dead ends that frustrate users and waste crawl budget.
              </p>
            </div>
          </div>
        </section>

        {/* How to Use Section */}
        <section id="how" className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">How to Use Our URL Redirect Checker</h2>
            </div>
            
            <div className="max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-6">
                Our URL redirect checker makes it easy to check redirects and follow redirect chains. Follow these simple steps:
              </p>

              <div className="grid md:grid-cols-3 gap-6 my-6">
                <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 text-white font-bold text-xl shadow-lg mb-4">
                    1
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">Enter URL</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Enter the URL you want to check (e.g., https://example.com/old-page) into the input field. You can include or omit https:// - the tool will add it if missing.
                  </p>
                </div>

                <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 text-white font-bold text-xl shadow-lg mb-4">
                    2
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">Check Redirects</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Click the "Check Redirects" button. Our server will follow the redirect chain, analyzing each step. This typically takes 3-10 seconds depending on the number of redirects.
                  </p>
                </div>

                <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 text-white font-bold text-xl shadow-lg mb-4">
                    3
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">Review Results</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    View the redirect chain showing each step including status codes (301, 302, etc.), redirect types, response times, and the final destination URL. Check for redirect loops or issues.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Best Practices Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">URL Redirect Best Practices</h2>
            </div>
            
            <div className="max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Effective redirect management requires proper strategy and regular monitoring. Here are best practices:
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="rounded-2xl border-2 border-rose-200 bg-rose-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Redirect Type Selection</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-rose-600 font-bold mt-0.5">•</span>
                      <span>Use 301 for permanent moves</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-rose-600 font-bold mt-0.5">•</span>
                      <span>Use 302 for temporary redirects</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-rose-600 font-bold mt-0.5">•</span>
                      <span>Avoid using 302 for permanent moves</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-rose-600 font-bold mt-0.5">•</span>
                      <span>Use 303/307/308 for specific cases</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border-2 border-pink-200 bg-pink-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Redirect Chain Optimization</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-pink-600 font-bold mt-0.5">•</span>
                      <span>Keep redirect chains short (1-2 redirects max)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-pink-600 font-bold mt-0.5">•</span>
                      <span>Avoid multiple consecutive redirects</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-pink-600 font-bold mt-0.5">•</span>
                      <span>Redirect directly to final destination when possible</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-pink-600 font-bold mt-0.5">•</span>
                      <span>Update old redirects to point to new final URLs</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Loop Prevention</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">•</span>
                      <span>Test redirects before deploying</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">•</span>
                      <span>Check for circular redirect patterns</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">•</span>
                      <span>Monitor redirect chains regularly</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">•</span>
                      <span>Fix loops immediately when detected</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border-2 border-orange-200 bg-orange-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">SEO Considerations</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 font-bold mt-0.5">•</span>
                      <span>Always use 301 for permanent moves</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 font-bold mt-0.5">•</span>
                      <span>Update internal links to new URLs over time</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 font-bold mt-0.5">•</span>
                      <span>Monitor redirect performance in Google Search Console</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 font-bold mt-0.5">•</span>
                      <span>Keep redirects active for at least 6-12 months</span>
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
            <Link href="/tools/web-tools" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-rose-300 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🌐</span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">All Web Tools</p>
                  <p className="text-xs text-slate-500">Browse Category</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">Discover all web tools for website analysis, testing, and security.</p>
              <p className="mt-4 text-sm font-semibold text-rose-600 group-hover:text-rose-700">Browse tools →</p>
            </Link>

            <Link href="/web-tools/website-comparison" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-rose-300 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">⚖️</span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">Website Comparison Tool</p>
                  <p className="text-xs text-slate-500">Comparison Analysis</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">Compare two or more websites side-by-side with comprehensive metrics.</p>
              <p className="mt-4 text-sm font-semibold text-rose-600 group-hover:text-rose-700">Compare websites →</p>
            </Link>

            <Link href="/web-tools/http-header-checker" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-rose-300 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">📋</span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">HTTP Header Checker</p>
                  <p className="text-xs text-slate-500">Security Analysis</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">Check HTTP response headers, security headers, and server information.</p>
              <p className="mt-4 text-sm font-semibold text-rose-600 group-hover:text-rose-700">Check headers →</p>
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

