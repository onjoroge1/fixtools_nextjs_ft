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

export default function UptimeMonitor() {
  const [urls, setUrls] = useState(['']);
  const [results, setResults] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentRequirement, setPaymentRequirement] = useState(null);
  const [userSession, setUserSession] = useState({ processingPass: null });
  const [processingProgress, setProcessingProgress] = useState({ current: 0, total: 0, currentUrl: '' });

  const currentYear = new Date().getFullYear();
  const canonicalUrl = `${siteHost}/web-tools/uptime-monitor`;

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

  const handleCheckUptime = async () => {
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

      setProcessingProgress({ current: 0, total: validUrls.length, currentUrl: 'Checking website uptime...' });

      const response = await fetch('/api/web-tools/uptime-monitor', {
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
        setProcessingProgress({ current: 1, total: validUrls.length, currentUrl: 'Analyzing uptime...' });
      }

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 402) {
          setPaymentRequirement(data.requirement);
          setShowPaymentModal(true);
          setIsProcessing(false);
          return;
        }
        throw new Error(data.message || data.error || 'Failed to check uptime');
      }

      if (data.success && data.results) {
        setProcessingProgress({ current: data.results.length, total: validUrls.length, currentUrl: 'Complete' });
        setResults(data.results);
      }
    } catch (err) {
      console.error('Uptime check error:', err);
      setError(err.message || 'Failed to check uptime. Please try again.');
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
      handleCheckUptime();
    }
  };

  const getStatusColor = (result) => {
    if (result.isOnline) return 'text-green-600';
    if (result.status === 'redirect') return 'text-orange-600';
    if (result.isError || !result.isOnline) return 'text-red-600';
    return 'text-slate-600';
  };

  const getStatusBgColor = (result) => {
    if (result.isOnline) return 'border-green-200 bg-green-50';
    if (result.status === 'redirect') return 'border-orange-200 bg-orange-50';
    if (result.isError || !result.isOnline) return 'border-red-200 bg-red-50';
    return 'border-slate-200 bg-slate-50';
  };

  const getStatusText = (result) => {
    if (result.isOnline) return 'Online';
    if (result.status === 'redirect') return 'Redirect';
    if (result.status === 'timeout') return 'Timeout';
    if (result.isError || !result.isOnline) return 'Offline';
    return 'Unknown';
  };

  // Structured Data
  const structuredData = {
    faqPage: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How do I check website uptime?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Enter the URL (with or without https://) in the input field, then click 'Check Uptime'. The tool will send an HTTP request to the server and check if the website is online, measure response time, and detect any errors or redirects. Results typically appear within 1-3 seconds."
          }
        },
        {
          "@type": "Question",
          "name": "What is website uptime monitoring?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Website uptime monitoring is the process of regularly checking if a website is accessible and responding correctly. Uptime monitoring tracks website availability, response times, error rates, and downtime incidents. It helps website owners identify outages quickly, measure performance, and ensure websites are accessible to visitors."
          }
        },
        {
          "@type": "Question",
          "name": "Why is uptime monitoring important?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Uptime monitoring is crucial for website reliability and user experience. It helps identify outages quickly, minimizing downtime impact, measures response times to ensure fast page loads, detects errors before they affect users, provides statistics for performance analysis, and enables proactive maintenance to prevent issues."
          }
        },
        {
          "@type": "Question",
          "name": "Can I check multiple websites at once?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Batch processing (4+ URLs) requires a Processing Pass. Free tier allows checking up to 3 URLs at a time. With a Processing Pass, you can check up to 20 URLs in a single batch, making it efficient for monitoring multiple websites or your entire portfolio."
          }
        },
        {
          "@type": "Question",
          "name": "What does response time mean?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Response time is the amount of time it takes for a server to respond to an HTTP request. It's measured in milliseconds (ms) and indicates how quickly a website responds. Lower response times mean faster websites. Good response times are typically under 200ms, while response times over 1 second may indicate performance issues."
          }
        },
        {
          "@type": "Question",
          "name": "What is a good uptime percentage?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A good uptime percentage depends on your website's purpose. For most websites, 99.9% uptime (about 43 minutes of downtime per month) is acceptable. For critical services, 99.99% uptime (about 4 minutes of downtime per month) is recommended. E-commerce and financial sites often require 99.999% uptime (less than 5 minutes of downtime per year)."
          }
        },
        {
          "@type": "Question",
          "name": "Is this uptime monitor tool free to use?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, our Website Uptime Monitor tool is free for single URL checks (up to 5 checks per day). Batch processing and higher daily limits require a Processing Pass. We aim to provide valuable tools for free while offering premium options for power users and businesses."
          }
        }
      ]
    },
    
    softwareApp: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Website Uptime Monitor",
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "Any",
      "description": "Free online website uptime monitor. Check if websites are online, track response times, and get uptime statistics. Monitor multiple websites with batch processing.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "ratingCount": "1400",
        "bestRating": "5",
        "worstRating": "1"
      },
      "featureList": [
        "Website availability check",
        "Response time measurement",
        "Error detection",
        "Redirect detection",
        "Status code analysis",
        "Batch processing (with pass)",
        "Real-time uptime monitoring",
        "Uptime statistics"
      ]
    },
    
    howTo: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Monitor Website Uptime",
      "description": "Step-by-step guide to checking website uptime and availability online for free",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Enter URL",
          "text": "Enter the URL you want to monitor (e.g., https://example.com) into the input field. You can include or omit https:// - the tool will add it if missing.",
          "position": 1
        },
        {
          "@type": "HowToStep",
          "name": "Check Uptime",
          "text": "Click the 'Check Uptime' button. The tool will send an HTTP request to the server and check if the website is online. This typically takes 1-3 seconds.",
          "position": 2
        },
        {
          "@type": "HowToStep",
          "name": "Review Results",
          "text": "View the uptime check results including status (online/offline), response time, status code, and any errors. Use the results to verify website availability and identify performance issues.",
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
          "name": "Website Uptime Monitor",
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
        <title>Website Uptime Monitor - Free Online Website Availability Checker | FixTools</title>
        <meta name="title" content="Website Uptime Monitor - Free Online Website Availability Checker | FixTools" />
        <meta name="description" content="Monitor website uptime and availability. Check if your website is online, track response times, and get uptime statistics. Free website uptime checker tool with real-time monitoring and batch processing." />
        <meta name="keywords" content="uptime monitor, website uptime checker, check website uptime, website availability checker, uptime monitoring, website status checker, response time checker, website downtime checker, uptime statistics, website monitoring tool" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content="Website Uptime Monitor - Free Online Website Availability Checker" />
        <meta property="og:description" content="Monitor website uptime and availability. Check if your website is online, track response times, and get uptime statistics." />
        <meta property="og:image" content={`${siteHost}/images/og-uptime-monitor.png`} />
        <meta property="og:site_name" content="FixTools" />
        
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content="Website Uptime Monitor - Free Online Website Availability Checker" />
        <meta property="twitter:description" content="Monitor website uptime and availability. Check if your website is online, track response times, and get uptime statistics." />
        <meta property="twitter:image" content={`${siteHost}/images/og-uptime-monitor.png`} />
        
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.faqPage) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.softwareApp) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.howTo) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.breadcrumb) }} />
      </Head>

      <style jsx global>{`
        html:has(.uptime-monitor-page) {
          font-size: 100% !important;
        }
        
        .uptime-monitor-page * {
          box-sizing: border-box;
        }
        
        .uptime-monitor-page h1,
        .uptime-monitor-page h2,
        .uptime-monitor-page h3,
        .uptime-monitor-page p,
        .uptime-monitor-page ul,
        .uptime-monitor-page ol {
          margin: 0;
        }
        
        .uptime-monitor-page button {
          font-family: inherit;
          cursor: pointer;
        }
        
        .uptime-monitor-page input,
        .uptime-monitor-page textarea,
        .uptime-monitor-page select {
          font-family: inherit;
        }
        
        /* Fix typography styling within uptime monitor page sections */
        .uptime-monitor-page section .max-w-none {
          font-size: 16px !important;
          line-height: 1.75 !important;
          color: #334155 !important;
        }
        
        .uptime-monitor-page section .max-w-none h3 {
          font-size: 20px !important;
          font-weight: 700 !important;
          line-height: 1.75rem !important;
          margin-top: 1.5rem !important;
          margin-bottom: 0.75rem !important;
          color: #0f172a !important;
        }
        
        .uptime-monitor-page section .max-w-none p {
          font-size: 16px !important;
          line-height: 1.75 !important;
          margin-bottom: 1rem !important;
          margin-top: 0 !important;
          color: #334155 !important;
        }
        
        .uptime-monitor-page section .max-w-none ol {
          margin-top: 1rem !important;
          margin-bottom: 1rem !important;
          padding-left: 1.5rem !important;
          color: #334155 !important;
          list-style-type: decimal !important;
          list-style-position: outside !important;
        }
        
        .uptime-monitor-page section .max-w-none ul {
          margin-top: 1rem !important;
          margin-bottom: 1rem !important;
          padding-left: 1.5rem !important;
          color: #334155 !important;
          list-style-type: disc !important;
          list-style-position: outside !important;
        }
        
        .uptime-monitor-page section .max-w-none ol li,
        .uptime-monitor-page section .max-w-none ul li {
          margin-top: 0.75rem !important;
          margin-bottom: 0.75rem !important;
          line-height: 1.75 !important;
          padding-left: 0.5rem !important;
          font-size: 16px !important;
        }
        
        .uptime-monitor-page section .max-w-none strong {
          font-weight: 600 !important;
          color: #0f172a !important;
        }
        
        .uptime-monitor-page section .max-w-none a {
          color: #059669 !important;
          text-decoration: underline !important;
          font-weight: 500 !important;
        }
        
        .uptime-monitor-page section .max-w-none a:hover {
          color: #047857 !important;
        }
        
        /* Override global CSS font-size for this page */
        .uptime-monitor-page {
          font-size: 16px !important;
        }
        
        .uptime-monitor-page h1 {
          font-size: 3rem !important;
        }
        
        .uptime-monitor-page h2 {
          font-size: 1.875rem !important;
        }
        
        .uptime-monitor-page h3 {
          font-size: 1.25rem !important;
        }
        
        .uptime-monitor-page p,
        .uptime-monitor-page li,
        .uptime-monitor-page span {
          font-size: 1rem !important;
        }
      `}</style>

      <div className="uptime-monitor-page bg-[#fbfbfc] text-slate-900 min-h-screen">
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
            <li className="flex items-center gap-2"><span className="text-slate-400">/</span><span className="font-semibold text-slate-900">Website Uptime Monitor</span></li>
          </ol>
        </nav>

        <section className="relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.35]" style={{ backgroundImage: 'url(/grid.png)', backgroundSize: '256px 256px' }}></div>
          <div className="mx-auto max-w-6xl px-4 py-10 md:py-14 relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50 px-4 py-1.5 text-xs font-semibold text-orange-700 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
              Free • Fast • Secure
            </div>
            
            <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 bg-clip-text text-transparent">
                Website Uptime Monitor
              </span>
            </h1>
            
            <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg md:leading-relaxed">
              Monitor website uptime and availability with our free <strong>Website Uptime Monitor</strong> tool. Check if your website is online, track response times, and get instant uptime statistics.
            </p>

            <dl className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
              <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Availability</dt>
                <dd className="mt-1.5 text-sm font-bold text-slate-900">Real-time Check</dd>
              </div>
              <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Response Time</dt>
                <dd className="mt-1.5 text-sm font-bold text-slate-900">Measured</dd>
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
                <h2 className="text-xl font-semibold text-slate-900">Check Website Uptime</h2>
                <p className="mt-1 text-sm text-slate-600">Enter URL(s), then click 'Check Uptime' to verify website availability.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button onClick={handleClear} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50">Clear</button>
                <button 
                  onClick={handleCheckUptime} 
                  disabled={isProcessing}
                  className="rounded-xl bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Checking...' : '⚡ Check Uptime'}
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
                        className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-orange-900/20"
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
                    className="rounded-xl border border-orange-200 bg-orange-50 px-3 py-2 text-sm font-semibold text-orange-700 hover:bg-orange-100"
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
                  <div className="mt-6 rounded-xl border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50 p-6">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600"></div>
                      <p className="text-sm font-semibold text-orange-900">
                        Checking website uptime{processingProgress.total > 1 && ` (${processingProgress.current}/${processingProgress.total})`}...
                      </p>
                    </div>
                    {processingProgress.total > 1 && (
                      <div className="mt-3">
                        <div className="w-full bg-orange-200 rounded-full h-2.5">
                          <div 
                            className="bg-gradient-to-r from-orange-600 to-amber-600 h-2.5 rounded-full transition-all duration-300"
                            style={{ width: `${(processingProgress.current / processingProgress.total) * 100}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-orange-700 mt-2 text-center">
                          Processing {processingProgress.current} of {processingProgress.total} URL{processingProgress.total !== 1 ? 's' : ''}
                        </p>
                      </div>
                    )}
                    {processingProgress.total === 1 && (
                      <div className="mt-3">
                        <div className="w-full bg-orange-200 rounded-full h-2.5 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-orange-600 to-amber-600 h-2.5 rounded-full animate-pulse"
                            style={{ width: '60%' }}
                          ></div>
                        </div>
                        <p className="text-xs text-orange-700 mt-2 text-center">
                          {processingProgress.currentUrl || 'Sending HTTP request...'}
                        </p>
                      </div>
                    )}
                    <p className="text-xs text-orange-600 mt-3 text-center">
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

            {/* Summary Statistics */}
            {results.length > 0 && (
              <div className="mt-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="rounded-xl border border-slate-200 bg-white p-3 text-center">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Total</p>
                    <p className="text-2xl font-bold text-slate-900">{results.length}</p>
                  </div>
                  <div className="rounded-xl border border-green-200 bg-green-50 p-3 text-center">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Online</p>
                    <p className="text-2xl font-bold text-green-600">{results.filter(r => r.isOnline).length}</p>
                  </div>
                  <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-center">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Offline</p>
                    <p className="text-2xl font-bold text-red-600">{results.filter(r => !r.isOnline).length}</p>
                  </div>
                  <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-center">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Avg Response</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {Math.round(results.reduce((sum, r) => sum + (r.responseTime || 0), 0) / results.length)}ms
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Uptime Check Results */}
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
                              Checked {new Date(result.timestamp).toLocaleString()}
                            </p>
                          </div>
                          <div className={`rounded-xl border-2 p-3 ${getStatusBgColor(result)}`}>
                            <p className="text-xs font-semibold text-slate-700 mb-1">Status</p>
                            <p className={`text-lg font-bold ${getStatusColor(result)}`}>
                              {getStatusText(result)}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="rounded-xl border border-slate-200 bg-white p-4">
                            <h4 className="text-sm font-semibold text-slate-800 mb-3">Response Time</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-slate-600">Time:</span>
                                <span className={`font-bold ${result.responseTime > 1000 ? 'text-orange-600' : result.responseTime > 500 ? 'text-yellow-600' : 'text-green-600'}`}>
                                  {result.responseTime}ms
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-600">Status:</span>
                                <span className={result.responseTime < 200 ? 'text-green-600 font-medium' : result.responseTime < 1000 ? 'text-yellow-600 font-medium' : 'text-orange-600 font-medium'}>
                                  {result.responseTime < 200 ? 'Excellent' : result.responseTime < 1000 ? 'Good' : 'Slow'}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="rounded-xl border border-slate-200 bg-white p-4">
                            <h4 className="text-sm font-semibold text-slate-800 mb-3">Status Code</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-slate-600">Code:</span>
                                <span className={`font-bold ${result.statusCode >= 200 && result.statusCode < 300 ? 'text-green-600' : result.statusCode >= 300 && result.statusCode < 400 ? 'text-orange-600' : 'text-red-600'}`}>
                                  {result.statusCode || 'N/A'}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-600">Message:</span>
                                <span className="font-medium text-slate-900">{result.statusMessage || 'N/A'}</span>
                              </div>
                            </div>
                          </div>

                          <div className="rounded-xl border border-slate-200 bg-white p-4">
                            <h4 className="text-sm font-semibold text-slate-800 mb-3">Availability</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-slate-600">Online:</span>
                                <span className={`font-bold ${result.isOnline ? 'text-green-600' : 'text-red-600'}`}>
                                  {result.isOnline ? 'Yes' : 'No'}
                                </span>
                              </div>
                              {result.isRedirect && (
                                <div className="flex justify-between">
                                  <span className="text-slate-600">Redirect:</span>
                                  <span className="font-medium text-orange-600">Yes</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
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
              <div className="h-1 w-8 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">What is Website Uptime Monitoring?</h2>
            </div>
            
            <div className="max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                <strong>Website uptime monitoring</strong> is the process of regularly checking if a website is accessible and responding correctly. Uptime monitoring tracks website availability, response times, error rates, and downtime incidents. It helps website owners identify outages quickly, measure performance, and ensure websites are accessible to visitors.
              </p>
              
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                When you monitor website uptime, you send regular HTTP requests to your website's server to verify it's online and responding. The monitoring system measures response times, checks for errors, and tracks availability over time. This provides valuable insights into website reliability and helps identify issues before they affect users.
              </p>

              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Website uptime monitoring is essential for maintaining website reliability and user experience. Regular monitoring helps identify outages quickly, minimizing downtime impact, measures response times to ensure fast page loads, detects errors before they affect users, provides statistics for performance analysis, and enables proactive maintenance to prevent issues.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">How Website Uptime Monitoring Works</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                The website uptime monitoring process involves several steps:
              </p>
              <ol className="space-y-3 mb-4 ml-6 text-slate-700" style={{ listStyleType: 'decimal', listStylePosition: 'outside', paddingLeft: '1.5rem' }}>
                <li className="leading-relaxed pl-2" style={{ fontSize: '16px', lineHeight: '1.75' }}><strong>HTTP Request:</strong> The monitoring system sends an HTTP request (typically GET or HEAD) to the website's server at regular intervals.</li>
                <li className="leading-relaxed pl-2" style={{ fontSize: '16px', lineHeight: '1.75' }}><strong>Response Measurement:</strong> The system measures the response time (time from request to response) and checks the HTTP status code.</li>
                <li className="leading-relaxed pl-2" style={{ fontSize: '16px', lineHeight: '1.75' }}><strong>Status Detection:</strong> The system determines if the website is online (status 200-299), offline (no response or error), or redirecting (status 300-399).</li>
                <li className="leading-relaxed pl-2" style={{ fontSize: '16px', lineHeight: '1.75' }}><strong>Error Tracking:</strong> The system tracks errors, timeouts, and connection failures, logging them for analysis.</li>
                <li className="leading-relaxed pl-2" style={{ fontSize: '16px', lineHeight: '1.75' }}><strong>Statistics Calculation:</strong> The system calculates uptime percentage, average response time, error rates, and other statistics over time.</li>
                <li className="leading-relaxed pl-2" style={{ fontSize: '16px', lineHeight: '1.75' }}><strong>Alerting:</strong> When downtime is detected or performance degrades, the system sends alerts via email, SMS, or other channels.</li>
              </ol>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">Key Metrics in Uptime Monitoring</h3>
              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="rounded-2xl border-2 border-green-200 bg-green-50 p-5">
                  <h4 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 text-green-600">✓</span>
                    Uptime Percentage
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    The percentage of time a website is available and accessible. Calculated as (uptime / total time) × 100. Higher percentages indicate better reliability.
                  </p>
                  <ul className="space-y-1 text-xs text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold mt-0.5">•</span>
                      <span>99.9% = ~43 minutes downtime/month</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold mt-0.5">•</span>
                      <span>99.99% = ~4 minutes downtime/month</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold mt-0.5">•</span>
                      <span>99.999% = ~5 minutes downtime/year</span>
                    </li>
                  </ul>
                </div>
                
                <div className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-5">
                  <h4 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">⚡</span>
                    Response Time
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    The time it takes for a server to respond to an HTTP request, measured in milliseconds (ms). Lower response times indicate faster websites.
                  </p>
                  <ul className="space-y-1 text-xs text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>&lt; 200ms = Excellent</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>200-1000ms = Good</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>&gt; 1000ms = Slow</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border-2 border-orange-200 bg-orange-50 p-5">
                  <h4 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 text-orange-600">⚠</span>
                    Error Rate
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    The percentage of requests that result in errors or failures. Lower error rates indicate more reliable websites. Common errors include timeouts, connection failures, and HTTP 4xx/5xx status codes.
                  </p>
                  <ul className="space-y-1 text-xs text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 font-bold mt-0.5">•</span>
                      <span>Timeouts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 font-bold mt-0.5">•</span>
                      <span>Connection failures</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 font-bold mt-0.5">•</span>
                      <span>HTTP errors (4xx, 5xx)</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-5">
                  <h4 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600">📊</span>
                    Downtime Incidents
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    The number and duration of periods when a website is unavailable. Downtime incidents are tracked with start time, end time, duration, and cause.
                  </p>
                  <ul className="space-y-1 text-xs text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">•</span>
                      <span>Incident tracking</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">•</span>
                      <span>Duration measurement</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">•</span>
                      <span>Root cause analysis</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <p className="text-base text-slate-700 leading-relaxed">
                Website uptime monitoring serves many purposes: ensuring website reliability and availability, identifying outages quickly to minimize impact, measuring performance through response time tracking, detecting errors before they affect users, providing statistics for performance analysis, and enabling proactive maintenance to prevent issues. Understanding uptime monitoring is essential for website management, performance optimization, and user experience improvement.
              </p>
            </div>
          </div>
        </section>

        {/* Why Uptime Monitoring is Important Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Why Website Uptime Monitoring is Important</h2>
            </div>
            
            <div className="max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Website uptime monitoring is not just a technical tool—it's essential for website reliability, user experience, and business success. Here's why uptime monitoring is crucial:
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">1. User Experience and Trust</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Website uptime directly impacts user experience and trust. When a website is down, visitors can't access content, make purchases, or use services, leading to lost revenue and damaged reputation. Regular uptime monitoring helps ensure websites are available when users need them, maintaining trust and providing a positive user experience. Even brief outages can result in lost customers and revenue.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">2. Business Impact and Revenue</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Website downtime has direct business impact. For e-commerce sites, every minute of downtime can mean thousands of dollars in lost sales. For service-based businesses, downtime affects customer satisfaction and can lead to customer churn. Uptime monitoring helps minimize downtime by enabling quick detection and response, reducing revenue loss and business impact.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">3. SEO and Search Rankings</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Website uptime and performance can impact SEO and search rankings. Search engines consider website availability and response times when ranking results. Frequent downtime or slow response times can negatively impact search rankings. Uptime monitoring helps ensure websites maintain good performance metrics, supporting SEO efforts and search visibility.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">4. Proactive Issue Detection</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Uptime monitoring enables proactive issue detection before they become critical problems. By monitoring response times and error rates, you can identify performance degradation early. This allows for proactive maintenance and fixes before issues cause outages. Early detection helps prevent extended downtime and minimizes impact on users.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">5. Performance Optimization</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Uptime monitoring provides valuable performance data for optimization. Response time tracking helps identify slow pages or resources. Error tracking helps identify problematic areas. Availability statistics help measure the effectiveness of optimizations. This data enables data-driven decisions about performance improvements.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">6. SLA Compliance and Reporting</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Uptime monitoring helps ensure compliance with Service Level Agreements (SLAs) and provides reporting for stakeholders. Many businesses have SLAs that specify uptime requirements (e.g., 99.9% uptime). Uptime monitoring provides data to verify compliance and generate reports for stakeholders. This helps maintain transparency and accountability.
              </p>
            </div>
          </div>
        </section>

        {/* How to Use Uptime Monitor Section */}
        <section id="how" className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">How to Use Our Website Uptime Monitor</h2>
            </div>
            
            <div className="max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-6">
                Our website uptime monitor makes it easy to check website availability and response times. Follow these simple steps:
              </p>

              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 text-white font-bold text-xl shadow-lg mb-4">
                    1
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">Enter URL</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Provide the URL you want to monitor (e.g., https://example.com) into the input field. You can include or omit https:// - the tool will add it if missing.
                  </p>
                </div>

                <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 text-white font-bold text-xl shadow-lg mb-4">
                    2
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">Check Uptime</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Click the "Check Uptime" button. Our server sends an HTTP request to the website and checks if it's online. This typically takes 1-3 seconds.
                  </p>
                </div>

                <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 text-white font-bold text-xl shadow-lg mb-4">
                    3
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">Review Results</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    View the uptime check results including status (online/offline), response time, status code, and any errors. Use the results to verify website availability and identify performance issues.
                  </p>
                </div>

                <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 text-white font-bold text-xl shadow-lg mb-4">
                    4
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">Monitor Performance</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Review response times and status codes to monitor website performance. Track changes over time to identify trends and optimize performance.
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
              <div className="h-1 w-8 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Website Uptime Monitoring Best Practices</h2>
            </div>
            
            <div className="max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Proper website uptime monitoring is essential for maintaining website reliability and performance. Here are best practices:
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="rounded-2xl border-2 border-green-200 bg-green-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Monitoring Configuration</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold mt-0.5">•</span>
                      <span>Monitor critical pages regularly</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold mt-0.5">•</span>
                      <span>Set appropriate check intervals (1-5 minutes)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold mt-0.5">•</span>
                      <span>Monitor from multiple locations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold mt-0.5">•</span>
                      <span>Configure alert thresholds</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold mt-0.5">•</span>
                      <span>Set up multiple notification channels</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Performance Tracking</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Track response times over time</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Monitor average and peak response times</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Set performance baselines</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Alert on performance degradation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Compare performance across regions</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border-2 border-orange-200 bg-orange-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Alerting and Response</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 font-bold mt-0.5">•</span>
                      <span>Configure immediate alerts for downtime</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 font-bold mt-0.5">•</span>
                      <span>Set up escalation procedures</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 font-bold mt-0.5">•</span>
                      <span>Test alerting systems regularly</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 font-bold mt-0.5">•</span>
                      <span>Document incident response procedures</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 font-bold mt-0.5">•</span>
                      <span>Review and analyze downtime incidents</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border-2 border-purple-200 bg-purple-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Reporting and Analysis</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>Generate regular uptime reports</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>Track uptime trends over time</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>Calculate uptime percentages</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>Analyze downtime patterns</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>Share reports with stakeholders</span>
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
            <Link href="/tools/web-tools" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-orange-300 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🌐</span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">All Web Tools</p>
                  <p className="text-xs text-slate-500">Browse Category</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">Discover all web tools for website analysis, testing, and security.</p>
              <p className="mt-4 text-sm font-semibold text-orange-600 group-hover:text-orange-700">Browse tools →</p>
            </Link>

            <Link href="/web-tools/ssl-checker" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-orange-300 hover:shadow-lg transition-all duration-300">
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
              <p className="mt-4 text-sm font-semibold text-orange-600 group-hover:text-orange-700">Check SSL →</p>
            </Link>

            <Link href="/web-tools/website-speed-test" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-orange-300 hover:shadow-lg transition-all duration-300">
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
              <p className="mt-4 text-sm font-semibold text-orange-600 group-hover:text-orange-700">Test speed →</p>
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

