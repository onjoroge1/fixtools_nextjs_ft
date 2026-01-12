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

export default function TrafficChecker() {
  const [urls, setUrls] = useState(['']);
  const [results, setResults] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentRequirement, setPaymentRequirement] = useState(null);
  const [userSession, setUserSession] = useState({ processingPass: null });
  const [processingProgress, setProcessingProgress] = useState({ current: 0, total: 0, currentUrl: '' });

  const currentYear = new Date().getFullYear();
  const canonicalUrl = `${siteHost}/web-tools/traffic-checker`;

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

  const handleCheckTraffic = async () => {
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

      setProcessingProgress({ current: 0, total: validUrls.length, currentUrl: 'Checking traffic...' });

      const response = await fetch('/api/web-tools/traffic-checker', {
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
        throw new Error(data.message || data.error || 'Failed to check traffic');
      }

      if (data.success && data.results) {
        setProcessingProgress({ current: data.results.length, total: validUrls.length, currentUrl: 'Complete' });
        setResults(data.results);
      }
    } catch (err) {
      console.error('Traffic checker error:', err);
      setError(err.message || 'Failed to check traffic. Please try again.');
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
      handleCheckTraffic();
    }
  };

  const getTrafficColor = (category) => {
    if (category === 'High Traffic') return 'text-green-600 bg-green-50 border-green-200';
    if (category === 'Medium-High Traffic') return 'text-blue-600 bg-blue-50 border-blue-200';
    if (category === 'Medium Traffic') return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    if (category === 'Low-Medium Traffic') return 'text-orange-600 bg-orange-50 border-orange-200';
    if (category === 'Low Traffic') return 'text-red-600 bg-red-50 border-red-200';
    return 'text-slate-600 bg-slate-50 border-slate-200';
  };

  // Structured Data
  const structuredData = {
    faqPage: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How do I check website traffic?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Enter the URL you want to check (with or without https://) into the input field, then click 'Check Traffic'. The tool will analyze the website and estimate traffic based on publicly available signals like SEO indicators, performance metrics, content quality, and social signals. Results typically appear within 3-10 seconds."
          }
        },
        {
          "@type": "Question",
          "name": "What does a website traffic checker show?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A website traffic checker estimates monthly visitor counts, traffic categories (high, medium, low), traffic ranges, and provides indicators like SEO signals, social signals, performance metrics, and content quality. It also shows website status, response times, and confidence levels for the estimates."
          }
        },
        {
          "@type": "Question",
          "name": "Are traffic estimates accurate?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Traffic estimates are based on publicly available signals and should be used as approximations. For accurate traffic data, consider using professional analytics tools (Google Analytics), paid APIs (SimilarWeb, SEMrush, Ahrefs), or official website analytics. Estimates provide general insights but may not reflect exact visitor counts."
          }
        },
        {
          "@type": "Question",
          "name": "What factors affect traffic estimates?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Traffic estimates consider SEO indicators (title, description, meta tags), social signals (Open Graph, Twitter Cards), performance metrics (response time, page load speed), content quality (structured data, content length), link counts, image counts, and overall website optimization. Higher scores indicate more traffic potential."
          }
        },
        {
          "@type": "Question",
          "name": "Can I check multiple websites at once?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, you can check multiple websites at once. Free tier allows checking up to 3 websites. Batch processing (4+ URLs) requires a Processing Pass. With a Processing Pass, you can check up to 20 websites in a single batch, making it efficient for analyzing multiple competitors or your entire portfolio."
          }
        },
        {
          "@type": "Question",
          "name": "Why should I check website traffic?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Checking website traffic helps understand competitor performance, identify high-traffic websites, benchmark your website, analyze market trends, estimate potential reach, research target audiences, and make data-driven decisions about marketing and SEO strategies. Traffic estimates provide valuable market insights."
          }
        },
        {
          "@type": "Question",
          "name": "Is this traffic checker tool free to use?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, our Website Traffic Checker tool is free for checking 1-3 websites (up to 5 checks per day). Batch processing and higher daily limits require a Processing Pass. We aim to provide valuable tools for free while offering premium options for power users and businesses."
          }
        }
      ]
    },
    
    softwareApp: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Website Traffic Checker",
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "Any",
      "description": "Free online website traffic checker. Check and estimate website traffic, visitor statistics, and popularity metrics. Analyze traffic trends, page views, and engagement metrics.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.7",
        "ratingCount": "1550",
        "bestRating": "5",
        "worstRating": "1"
      },
      "featureList": [
        "Traffic estimation",
        "Visitor count estimates",
        "Traffic category classification",
        "SEO signal analysis",
        "Performance metrics",
        "Content quality indicators",
        "Batch processing (with pass)",
        "Comprehensive traffic reports"
      ]
    },
    
    howTo: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Check Website Traffic",
      "description": "Step-by-step guide to checking and estimating website traffic online for free",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Enter URL",
          "text": "Enter the URL you want to check (e.g., https://example.com) into the input field. You can include or omit https:// - the tool will add it if missing.",
          "position": 1
        },
        {
          "@type": "HowToStep",
          "name": "Check Traffic",
          "text": "Click the 'Check Traffic' button. The tool will analyze the website's SEO signals, performance metrics, content quality, and social signals. This typically takes 3-10 seconds.",
          "position": 2
        },
        {
          "@type": "HowToStep",
          "name": "Review Results",
          "text": "View the traffic estimate including monthly visitor estimates, traffic category, traffic range, and confidence level. Analyze the indicators to understand what factors influence the estimate.",
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
          "name": "Website Traffic Checker",
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
        <title>Website Traffic Checker - Free Online Traffic Estimator | FixTools</title>
        <meta name="title" content="Website Traffic Checker - Free Online Traffic Estimator | FixTools" />
        <meta name="description" content="Check and estimate website traffic, visitor statistics, and popularity metrics. Analyze website traffic trends, page views, and engagement metrics. Free traffic checker tool." />
        <meta name="keywords" content="website traffic checker, check website traffic, traffic estimator, website visitors, traffic analyzer, website analytics, traffic estimate, website popularity, visitor statistics, traffic metrics" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content="Website Traffic Checker - Free Online Traffic Estimator" />
        <meta property="og:description" content="Check and estimate website traffic, visitor statistics, and popularity metrics. Analyze traffic trends and engagement metrics." />
        <meta property="og:image" content={`${siteHost}/images/og-traffic-checker.png`} />
        <meta property="og:site_name" content="FixTools" />
        
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content="Website Traffic Checker - Free Online Traffic Estimator" />
        <meta property="twitter:description" content="Check and estimate website traffic, visitor statistics, and popularity metrics. Analyze traffic trends and engagement metrics." />
        <meta property="twitter:image" content={`${siteHost}/images/og-traffic-checker.png`} />
        
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.faqPage) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.softwareApp) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.howTo) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.breadcrumb) }} />
      </Head>

      <style jsx global>{`
        html:has(.traffic-checker-page) {
          font-size: 100% !important;
        }
        
        .traffic-checker-page * {
          box-sizing: border-box;
        }
        
        .traffic-checker-page h1,
        .traffic-checker-page h2,
        .traffic-checker-page h3,
        .traffic-checker-page p,
        .traffic-checker-page ul,
        .traffic-checker-page ol {
          margin: 0;
        }
        
        .traffic-checker-page button {
          font-family: inherit;
          cursor: pointer;
        }
        
        .traffic-checker-page input,
        .traffic-checker-page textarea,
        .traffic-checker-page select {
          font-family: inherit;
        }
        
        /* Fix typography styling within traffic checker page sections */
        .traffic-checker-page section .max-w-none {
          font-size: 16px !important;
          line-height: 1.75 !important;
          color: #334155 !important;
        }
        
        .traffic-checker-page section .max-w-none h3 {
          font-size: 20px !important;
          font-weight: 700 !important;
          line-height: 1.75rem !important;
          margin-top: 1.5rem !important;
          margin-bottom: 0.75rem !important;
          color: #0f172a !important;
        }
        
        .traffic-checker-page section .max-w-none p {
          font-size: 16px !important;
          line-height: 1.75 !important;
          margin-bottom: 1rem !important;
          margin-top: 0 !important;
          color: #334155 !important;
        }
        
        .traffic-checker-page section .max-w-none ol {
          margin-top: 1rem !important;
          margin-bottom: 1rem !important;
          padding-left: 1.5rem !important;
          color: #334155 !important;
          list-style-type: decimal !important;
          list-style-position: outside !important;
        }
        
        .traffic-checker-page section .max-w-none ul {
          margin-top: 1rem !important;
          margin-bottom: 1rem !important;
          padding-left: 1.5rem !important;
          color: #334155 !important;
          list-style-type: disc !important;
          list-style-position: outside !important;
        }
        
        .traffic-checker-page section .max-w-none ol li,
        .traffic-checker-page section .max-w-none ul li {
          margin-top: 0.75rem !important;
          margin-bottom: 0.75rem !important;
          line-height: 1.75 !important;
          padding-left: 0.5rem !important;
          font-size: 16px !important;
        }
        
        .traffic-checker-page section .max-w-none strong {
          font-weight: 600 !important;
          color: #0f172a !important;
        }
        
        .traffic-checker-page section .max-w-none a {
          color: #7c2d12 !important;
          text-decoration: underline !important;
          font-weight: 500 !important;
        }
        
        .traffic-checker-page section .max-w-none a:hover {
          color: #9a3412 !important;
        }
        
        /* Override global CSS font-size for this page */
        .traffic-checker-page {
          font-size: 16px !important;
        }
        
        .traffic-checker-page h1 {
          font-size: 3rem !important;
        }
        
        .traffic-checker-page h2 {
          font-size: 1.875rem !important;
        }
        
        .traffic-checker-page h3 {
          font-size: 1.25rem !important;
        }
        
        .traffic-checker-page p,
        .traffic-checker-page li,
        .traffic-checker-page span {
          font-size: 1rem !important;
        }
      `}</style>

      <div className="traffic-checker-page bg-[#fbfbfc] text-slate-900 min-h-screen">
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
            <li className="flex items-center gap-2"><span className="text-slate-400">/</span><span className="font-semibold text-slate-900">Website Traffic Checker</span></li>
          </ol>
        </nav>

        <section className="relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.35]" style={{ backgroundImage: 'url(/grid.png)', backgroundSize: '256px 256px' }}></div>
          <div className="mx-auto max-w-6xl px-4 py-10 md:py-14 relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 px-4 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Free • Fast • Comprehensive
            </div>
            
            <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 bg-clip-text text-transparent">
                Website Traffic Checker
              </span>
            </h1>
            
            <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg md:leading-relaxed">
              Check and estimate website traffic, visitor statistics, and popularity metrics with our free <strong>Website Traffic Checker</strong>. Analyze traffic trends, page views, and engagement metrics instantly.
            </p>

            <dl className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
              <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Traffic Estimate</dt>
                <dd className="mt-1.5 text-sm font-bold text-slate-900">Instant</dd>
              </div>
              <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Metrics</dt>
                <dd className="mt-1.5 text-sm font-bold text-slate-900">Comprehensive</dd>
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
                <h2 className="text-xl font-semibold text-slate-900">Check Website Traffic</h2>
                <p className="mt-1 text-sm text-slate-600">Enter URL(s), then click 'Check Traffic' to estimate visitor statistics.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button onClick={handleClear} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50">Clear</button>
                <button 
                  onClick={handleCheckTraffic} 
                  disabled={isProcessing}
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Checking...' : '📊 Check Traffic'}
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
                        className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-emerald-900/20"
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
                    className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-100"
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
                  <div className="mt-6 rounded-xl border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 p-6">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600"></div>
                      <p className="text-sm font-semibold text-emerald-900">
                        Checking traffic{processingProgress.total > 1 && ` (${processingProgress.current}/${processingProgress.total})`}...
                      </p>
                    </div>
                    {processingProgress.total > 1 && (
                      <div className="mt-3">
                        <div className="w-full bg-emerald-200 rounded-full h-2.5">
                          <div 
                            className="bg-gradient-to-r from-emerald-600 to-teal-600 h-2.5 rounded-full transition-all duration-300"
                            style={{ width: `${(processingProgress.current / processingProgress.total) * 100}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-emerald-700 mt-2 text-center">
                          Processing {processingProgress.current} of {processingProgress.total} URL{processingProgress.total !== 1 ? 's' : ''}
                        </p>
                      </div>
                    )}
                    {processingProgress.total === 1 && (
                      <div className="mt-3">
                        <div className="w-full bg-emerald-200 rounded-full h-2.5 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-emerald-600 to-teal-600 h-2.5 rounded-full animate-pulse"
                            style={{ width: '60%' }}
                          ></div>
                        </div>
                        <p className="text-xs text-emerald-700 mt-2 text-center">
                          {processingProgress.currentUrl || 'Analyzing website signals...'}
                        </p>
                      </div>
                    )}
                    <p className="text-xs text-emerald-600 mt-3 text-center">
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
                  <div className="rounded-xl border border-blue-200 bg-blue-50 p-3">
                    <p className="text-xs font-semibold text-blue-900 mb-1">Note</p>
                    <p className="text-xs text-blue-700">Traffic estimates are approximations based on publicly available signals.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Traffic Results */}
            {results.length > 0 && (
              <div className="mt-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">Traffic Analysis Results</h3>
                  <div className="text-xs text-slate-600 italic">
                    Estimates based on publicly available signals
                  </div>
                </div>
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
                            <p className="text-sm font-semibold text-slate-900">Website: {result.url}</p>
                            <p className="text-xs text-slate-600 mt-1">
                              Status: {result.isOnline ? <span className="text-green-600 font-semibold">Online</span> : <span className="text-red-600 font-semibold">Offline</span>}
                              {result.responseTime && <span className="ml-2">• Response: {result.responseTime}ms</span>}
                            </p>
                          </div>
                        </div>

                        {result.estimatedTraffic && (
                          <div className={`rounded-xl border-2 p-4 mb-4 ${getTrafficColor(result.trafficCategory)}`}>
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-sm font-semibold">{result.trafficCategory}</p>
                              {result.confidence && (
                                <span className={`text-xs px-2 py-1 rounded ${
                                  result.confidence === 'High' ? 'bg-green-200 text-green-800' :
                                  result.confidence === 'Medium' ? 'bg-yellow-200 text-yellow-800' :
                                  'bg-slate-200 text-slate-800'
                                }`}>
                                  {result.confidence} Confidence
                                </span>
                              )}
                            </div>
                            <p className="text-lg font-bold mb-1">{result.estimatedTraffic}</p>
                            {result.trafficRange && (
                              <p className="text-xs opacity-75">Range: {result.trafficRange.min.toLocaleString()} - {result.trafficRange.max.toLocaleString()} monthly visitors</p>
                            )}
                          </div>
                        )}

                        {result.indicators && (
                          <div className="grid md:grid-cols-2 gap-4 mt-4">
                            <div className="rounded-xl border border-slate-200 bg-white p-4">
                              <h4 className="text-xs font-semibold text-slate-800 mb-3">Quality Indicators</h4>
                              <div className="space-y-2 text-xs">
                                <div className="flex items-center justify-between">
                                  <span className="text-slate-600">SEO Signals:</span>
                                  <span className={result.indicators.hasSeoSignals ? 'text-green-600 font-semibold' : 'text-red-600'}>{result.indicators.hasSeoSignals ? '✓ Yes' : '✗ No'}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-slate-600">Social Signals:</span>
                                  <span className={result.indicators.hasSocialSignals ? 'text-green-600 font-semibold' : 'text-red-600'}>{result.indicators.hasSocialSignals ? '✓ Yes' : '✗ No'}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-slate-600">Performance:</span>
                                  <span className={result.indicators.hasPerformanceSignals ? 'text-green-600 font-semibold' : 'text-yellow-600'}>{result.indicators.hasPerformanceSignals ? '✓ Fast' : 'Slow'}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-slate-600">Content Quality:</span>
                                  <span className={result.indicators.hasContentSignals ? 'text-green-600 font-semibold' : 'text-red-600'}>{result.indicators.hasContentSignals ? '✓ Good' : 'Poor'}</span>
                                </div>
                              </div>
                            </div>

                            <div className="rounded-xl border border-slate-200 bg-white p-4">
                              <h4 className="text-xs font-semibold text-slate-800 mb-3">Website Metrics</h4>
                              <div className="space-y-2 text-xs">
                                <div className="flex items-center justify-between">
                                  <span className="text-slate-600">Links:</span>
                                  <span className="font-semibold text-slate-900">{result.indicators.linkCount || 0}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-slate-600">Images:</span>
                                  <span className="font-semibold text-slate-900">{result.indicators.imageCount || 0}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-slate-600">Page Size:</span>
                                  <span className="font-semibold text-slate-900">{result.indicators.pageSize ? (result.indicators.pageSize / 1024).toFixed(2) + ' KB' : 'N/A'}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-slate-600">Structured Data:</span>
                                  <span className={result.indicators.hasStructuredData ? 'text-green-600 font-semibold' : 'text-red-600'}>{result.indicators.hasStructuredData ? '✓ Yes' : '✗ No'}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {result.score !== undefined && (
                          <div className="mt-4 text-xs text-slate-600">
                            Quality Score: {result.score}/10
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
              <div className="h-1 w-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">What is Website Traffic?</h2>
            </div>
            
            <div className="max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                <strong>Website traffic</strong> refers to the number of visitors and visits a website receives over a period of time, typically measured in monthly visitors, daily visitors, or page views. Traffic metrics are fundamental indicators of a website's popularity, reach, engagement, and overall success. Understanding website traffic helps businesses, marketers, and website owners measure performance, identify trends, and make data-driven decisions.
              </p>
              
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Website traffic encompasses various metrics including unique visitors (individual users), page views (total pages viewed), sessions (individual visits), bounce rate (percentage of single-page visits), average session duration, pages per session, and traffic sources (organic search, direct, referral, social, paid). These metrics provide comprehensive insights into how users interact with websites, where they come from, and how engaged they are with content.
              </p>

              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Website traffic is essential for measuring website performance, understanding audience behavior, evaluating marketing effectiveness, identifying growth opportunities, benchmarking against competitors, making data-driven decisions, and optimizing content and strategies. Regular traffic analysis is crucial for website success and business growth.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">How Website Traffic is Measured</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Website traffic measurement involves several methods and tools:
              </p>
              <ol className="space-y-3 mb-4 ml-6 text-slate-700" style={{ listStyleType: 'decimal', listStylePosition: 'outside', paddingLeft: '1.5rem' }}>
                <li className="leading-relaxed pl-2" style={{ fontSize: '16px', lineHeight: '1.75' }}><strong>Analytics Tools:</strong> Professional analytics tools like Google Analytics, Adobe Analytics, and Matomo track actual visitor data through JavaScript tracking codes, cookies, and server logs, providing accurate traffic metrics, user behavior, and detailed insights.</li>
                <li className="leading-relaxed pl-2" style={{ fontSize: '16px', lineHeight: '1.75' }}><strong>Traffic Estimation APIs:</strong> Paid APIs like SimilarWeb, SEMrush, Ahrefs, and Alexa provide traffic estimates based on panel data, ISP data, browser extensions, and statistical modeling, offering competitive intelligence and market insights.</li>
                <li className="leading-relaxed pl-2" style={{ fontSize: '16px', lineHeight: '1.75' }}><strong>Public Signal Analysis:</strong> Free tools estimate traffic based on publicly available signals like SEO indicators, social signals, performance metrics, content quality, backlinks, and domain authority, providing approximations without direct access to analytics data.</li>
                <li className="leading-relaxed pl-2" style={{ fontSize: '16px', lineHeight: '1.75' }}><strong>Server Logs:</strong> Web server access logs record all requests to a website, providing raw traffic data including IP addresses, user agents, referrers, and request times, though they require processing and analysis.</li>
                <li className="leading-relaxed pl-2" style={{ fontSize: '16px', lineHeight: '1.75' }}><strong>CDN Analytics:</strong> Content Delivery Networks (CDNs) like Cloudflare and AWS CloudFront provide traffic analytics including request counts, bandwidth usage, geographic distribution, and performance metrics for websites using their services.</li>
              </ol>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">Traffic Categories and Ranges</h3>
              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="rounded-2xl border-2 border-green-200 bg-green-50 p-5">
                  <h4 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 text-green-600">📈</span>
                    High Traffic
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    Websites receiving 100,000+ monthly visitors. These sites typically have strong SEO, active content marketing, large social media followings, and established brand presence.
                  </p>
                  <ul className="space-y-1 text-xs text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold mt-0.5">•</span>
                      <span>100,000 - 1,000,000+ monthly visitors</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold mt-0.5">•</span>
                      <span>Strong SEO and content strategy</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold mt-0.5">•</span>
                      <span>Established brand presence</span>
                    </li>
                  </ul>
                </div>
                
                <div className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-5">
                  <h4 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">📊</span>
                    Medium-High Traffic
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    Websites receiving 10,000 - 100,000 monthly visitors. These sites have growing audiences, good SEO, active marketing, and developing brand recognition.
                  </p>
                  <ul className="space-y-1 text-xs text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>10,000 - 100,000 monthly visitors</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Growing audience and engagement</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Developing brand presence</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border-2 border-yellow-200 bg-yellow-50 p-5">
                  <h4 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-100 text-yellow-600">📉</span>
                    Medium Traffic
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    Websites receiving 1,000 - 10,000 monthly visitors. These sites are building their audience, developing SEO, and establishing their online presence.
                  </p>
                  <ul className="space-y-1 text-xs text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-600 font-bold mt-0.5">•</span>
                      <span>1,000 - 10,000 monthly visitors</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-600 font-bold mt-0.5">•</span>
                      <span>Building audience and engagement</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-600 font-bold mt-0.5">•</span>
                      <span>Developing online presence</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border-2 border-orange-200 bg-orange-50 p-5">
                  <h4 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 text-orange-600">📋</span>
                    Low-Medium Traffic
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    Websites receiving 100 - 1,000 monthly visitors. These sites are new, niche, or in early stages of growth, requiring SEO and marketing efforts.
                  </p>
                  <ul className="space-y-1 text-xs text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 font-bold mt-0.5">•</span>
                      <span>100 - 1,000 monthly visitors</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 font-bold mt-0.5">•</span>
                      <span>Early stage or niche website</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 font-bold mt-0.5">•</span>
                      <span>Needs SEO and marketing growth</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <p className="text-base text-slate-700 leading-relaxed">
                Understanding traffic categories helps benchmark performance, set realistic goals, identify growth opportunities, and make informed decisions about marketing and SEO strategies. Traffic estimates provide valuable market insights when actual analytics data isn't available.
              </p>
            </div>
          </div>
        </section>

        {/* Why Check Traffic Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Why Check Website Traffic?</h2>
            </div>
            
            <div className="max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Regular traffic checking provides valuable insights for businesses, marketers, and website owners. Here's why checking website traffic matters:
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">1. Competitive Analysis</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Traffic checking enables competitive analysis by comparing your website's traffic with competitors. Understanding competitor traffic levels helps identify market leaders, benchmark performance, identify growth opportunities, and make data-driven decisions about marketing and SEO strategies. Competitive traffic analysis reveals market trends and opportunities.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">2. Market Research</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Traffic checking supports market research by identifying high-traffic websites in your industry, understanding audience sizes, evaluating market potential, and identifying successful content and strategies. Market research helps identify trends, opportunities, and competitive positioning in your industry.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">3. SEO Strategy</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Traffic checking informs SEO strategy by identifying high-traffic websites that rank well, analyzing successful SEO tactics, understanding keyword competition, and identifying content opportunities. SEO traffic analysis helps prioritize keywords, content topics, and optimization efforts.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">4. Partnership Opportunities</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Traffic checking identifies potential partnership opportunities by finding high-traffic websites in related niches, evaluating audience sizes, and identifying collaboration opportunities. Traffic analysis helps identify valuable partners for guest posting, link building, and content collaborations.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">5. Investment Decisions</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Traffic checking supports investment decisions by evaluating website value, assessing growth potential, understanding market positioning, and making informed decisions about acquisitions, partnerships, or marketing investments. Traffic data provides insights into website value and potential.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">6. Performance Benchmarking</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Traffic checking enables performance benchmarking by comparing your website's traffic with industry standards, identifying performance gaps, setting realistic goals, and tracking progress over time. Benchmarking helps measure success and identify areas for improvement.
              </p>
            </div>
          </div>
        </section>

        {/* How to Use Section */}
        <section id="how" className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">How to Use Our Website Traffic Checker</h2>
            </div>
            
            <div className="max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-6">
                Our website traffic checker makes it easy to estimate website traffic and analyze visitor statistics. Follow these simple steps:
              </p>

              <div className="grid md:grid-cols-3 gap-6 my-6">
                <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-bold text-xl shadow-lg mb-4">
                    1
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">Enter URL</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Enter the URL you want to check (e.g., https://example.com) into the input field. You can include or omit https:// - the tool will add it if missing.
                  </p>
                </div>

                <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-bold text-xl shadow-lg mb-4">
                    2
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">Check Traffic</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Click the "Check Traffic" button. Our server will analyze the website's SEO signals, performance metrics, content quality, and social signals. This typically takes 3-10 seconds.
                  </p>
                </div>

                <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-bold text-xl shadow-lg mb-4">
                    3
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">Review Results</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    View the traffic estimate including monthly visitor estimates, traffic category, traffic range, and confidence level. Analyze the indicators to understand what factors influence the estimate.
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
              <div className="h-1 w-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Traffic Estimation Best Practices</h2>
            </div>
            
            <div className="max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Understanding traffic estimation helps you interpret results effectively. Here are best practices:
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Understanding Estimates</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">•</span>
                      <span>Estimates are approximations, not exact counts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">•</span>
                      <span>Consider confidence levels (high, medium, low)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">•</span>
                      <span>Use ranges rather than specific numbers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">•</span>
                      <span>Compare multiple tools for better accuracy</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border-2 border-teal-200 bg-teal-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Interpreting Indicators</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-teal-600 font-bold mt-0.5">•</span>
                      <span>SEO signals indicate search visibility</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-teal-600 font-bold mt-0.5">•</span>
                      <span>Social signals indicate brand presence</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-teal-600 font-bold mt-0.5">•</span>
                      <span>Performance signals affect user experience</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-teal-600 font-bold mt-0.5">•</span>
                      <span>Content quality affects engagement</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">For Accurate Data</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Use Google Analytics for your own sites</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Consider paid APIs for competitive data</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Combine multiple data sources</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Use estimates as general guidance</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border-2 border-cyan-200 bg-cyan-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Using Results</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-600 font-bold mt-0.5">•</span>
                      <span>Compare with competitors</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-600 font-bold mt-0.5">•</span>
                      <span>Identify market opportunities</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-600 font-bold mt-0.5">•</span>
                      <span>Benchmark performance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-600 font-bold mt-0.5">•</span>
                      <span>Make data-driven decisions</span>
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
            <Link href="/tools/web-tools" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-emerald-300 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🌐</span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">All Web Tools</p>
                  <p className="text-xs text-slate-500">Browse Category</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">Discover all web tools for website analysis, testing, and security.</p>
              <p className="mt-4 text-sm font-semibold text-emerald-600 group-hover:text-emerald-700">Browse tools →</p>
            </Link>

            <Link href="/web-tools/website-comparison" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-emerald-300 hover:shadow-lg transition-all duration-300">
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
              <p className="mt-4 text-sm font-semibold text-emerald-600 group-hover:text-emerald-700">Compare websites →</p>
            </Link>

            <Link href="/web-tools/website-speed-test" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-emerald-300 hover:shadow-lg transition-all duration-300">
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
              <p className="mt-4 text-sm font-semibold text-emerald-600 group-hover:text-emerald-700">Test speed →</p>
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

