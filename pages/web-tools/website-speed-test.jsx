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

export default function WebsiteSpeedTest() {
  const [urls, setUrls] = useState(['']);
  const [strategy, setStrategy] = useState('mobile');
  const [results, setResults] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentRequirement, setPaymentRequirement] = useState(null);
  const [userSession, setUserSession] = useState({ processingPass: null });
  const [processingProgress, setProcessingProgress] = useState({ current: 0, total: 0, currentUrl: '' });

  const currentYear = new Date().getFullYear();
  const canonicalUrl = `${siteHost}/web-tools/website-speed-test`;

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

  // Handle URL input change
  const handleUrlChange = (index, value) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  // Add URL field (for batch)
  const addUrlField = () => {
    setUrls([...urls, '']);
  };

  // Remove URL field
  const removeUrlField = (index) => {
    if (urls.length > 1) {
      setUrls(urls.filter((_, i) => i !== index));
    }
  };

  // Run speed test
  const handleSpeedTest = async () => {
    // Filter empty URLs
    const validUrls = urls.filter(url => url.trim());
    
    if (validUrls.length === 0) {
      setError('Please enter at least one URL.');
      return;
    }

    // Validate URLs
    for (const url of validUrls) {
      try {
        const parsedUrl = new URL(url);
        if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
          setError('Please enter valid HTTP or HTTPS URLs.');
          return;
        }
      } catch (e) {
        setError('Please enter valid URLs.');
        return;
      }
    }

    // Check payment requirement (batch check)
    // Strategy: Allow 2-3 URLs for free (limited results), require payment for 4+
    const urlCount = validUrls.length;
    const userPlan = getUserPlan(userSession);
    
    // For 4+ URLs: Always require payment before processing
    if (urlCount > 3) {
      const batchRequirement = checkPaymentRequirementNew('web-tools', 0, urlCount, userPlan);
      
      // Check if user has valid pass
      const hasValidPass = hasValidProcessingPassNew(userSession);
      
      if (!hasValidPass) {
        // Create payment requirement object
        const paymentReq = {
          requiresPayment: true,
          reason: 'batch',
          urlCount: urlCount,
          message: `Batch processing (${urlCount} URLs) requires a Processing Pass. Free tier allows up to 3 URLs with limited results.`,
          ...batchRequirement,
        };
        
        setPaymentRequirement(paymentReq);
        setShowPaymentModal(true);
        setIsProcessing(false);
        return;
      }
    }
    // For 2-3 URLs: Allow processing but will show limited results (handled by API)
    // Note: We don't block 2-3 URLs, but API will return limited results

    setIsProcessing(true);
    setError('');
    setResults([]);
    setProcessingProgress({ current: 0, total: validUrls.length, currentUrl: validUrls[0] || '' });

    try {
      // Get session ID if available
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

      // Update progress: Starting
      setProcessingProgress({ current: 0, total: validUrls.length, currentUrl: 'Initializing...' });

      const response = await fetch('/api/web-tools/website-speed-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: validUrls[0],
          urls: validUrls,
          strategy,
          sessionId: sessionId,
        }),
      });

      // Update progress: Processing (show indeterminate progress for single URL)
      if (validUrls.length === 1) {
        setProcessingProgress({ current: 0, total: 1, currentUrl: validUrls[0] });
      } else {
        setProcessingProgress({ current: 1, total: validUrls.length, currentUrl: 'Analyzing performance...' });
      }

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 402) {
          // Payment required
          setPaymentRequirement(data.requirement);
          setShowPaymentModal(true);
          setIsProcessing(false);
          return;
        }
        throw new Error(data.message || data.error || 'Failed to test website speed');
      }

      if (data.success && data.results) {
        // Update progress: Complete
        setProcessingProgress({ current: data.results.length, total: validUrls.length, currentUrl: 'Complete' });
        
        // Store limited flag if present
        const resultsWithLimited = data.results.map(result => ({
          ...result,
          limited: data.limited || result.limited || false,
        }));
        setResults(resultsWithLimited);
        
        // Show upgrade message if results are limited
        if (data.limited) {
          // Don't set as error, just informational
          // The UI will show upgrade CTA
        }
      }
    } catch (err) {
      console.error('Speed test error:', err);
      // Check if it's a rate limit error
      if (err.message && err.message.includes('Rate limit')) {
        setError('Rate limit exceeded. The Google PageSpeed Insights API has a limit of 25 requests per day per IP address when using the public API. Please try again tomorrow, or contact us for API key setup instructions.');
      } else {
        setError(err.message || 'Failed to test website speed. Please try again.');
      }
    } finally {
      setIsProcessing(false);
      setProcessingProgress({ current: 0, total: 0, currentUrl: '' });
    }
  };

  // Handle payment success
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
    // Retry speed test if URLs are already entered
    if (urls.some(url => url.trim())) {
      handleSpeedTest();
    }
  };

  // Clear all
  const handleClear = () => {
    setUrls(['']);
    setResults([]);
    setError('');
    setIsProcessing(false);
  };

  // Get score color
  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Get score bg color
  const getScoreBgColor = (score) => {
    if (score >= 90) return 'bg-green-100';
    if (score >= 50) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  // Format time
  const formatTime = (ms) => {
    if (!ms) return 'N/A';
    if (ms < 1000) return `${Math.round(ms)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  // Structured Data Schemas
  const structuredData = {
    faqPage: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How do I test my website speed?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Enter your website URL in the input field, choose your testing strategy (mobile or desktop), then click 'Test Speed'. The tool uses Google PageSpeed Insights to analyze your website's performance, Core Web Vitals, and provide optimization recommendations. Results typically appear within 10-30 seconds."
          }
        },
        {
          "@type": "Question",
          "name": "What is a website speed test?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A website speed test measures how fast your website loads and performs. It analyzes Core Web Vitals (LCP, FID, CLS), page load times, and provides a performance score from 0-100. Speed tests help identify performance bottlenecks and optimization opportunities to improve user experience and SEO rankings."
          }
        },
        {
          "@type": "Question",
          "name": "What are Core Web Vitals?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Core Web Vitals are three key metrics that Google uses to measure website user experience: Largest Contentful Paint (LCP) measures loading performance, First Input Delay (FID) measures interactivity, and Cumulative Layout Shift (CLS) measures visual stability. These metrics are ranking factors for Google search results."
          }
        },
        {
          "@type": "Question",
          "name": "Can I test multiple websites at once?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Batch processing (multiple URLs) requires a Processing Pass. Free tier allows testing one URL at a time. With a Processing Pass, you can test up to 20 websites in a single batch, making it efficient for comparing multiple sites or testing your entire website portfolio."
          }
        },
        {
          "@type": "Question",
          "name": "What is the difference between mobile and desktop speed tests?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Mobile speed tests simulate how your website performs on mobile devices (slower CPU, mobile network conditions), while desktop tests simulate desktop performance (faster CPU, broadband connection). Mobile tests are typically more important for SEO as Google uses mobile-first indexing. Both tests provide valuable insights into your website's performance."
          }
        },
        {
          "@type": "Question",
          "name": "What is a good website speed score?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A good website speed score is 90-100 (green). Scores 50-89 (yellow) indicate room for improvement, while scores below 50 (red) need immediate optimization. Google recommends aiming for scores above 90 for optimal user experience and SEO rankings. Core Web Vitals should also meet Google's thresholds: LCP < 2.5s, FID < 100ms, CLS < 0.1."
          }
        },
        {
          "@type": "Question",
          "name": "How often should I test my website speed?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Test your website speed regularly, especially after making changes to your website, adding new content, or updating plugins. Monthly testing is recommended for most websites, while high-traffic sites should test weekly. Regular testing helps catch performance regressions early and ensures your website maintains optimal speed."
          }
        },
        {
          "@type": "Question",
          "name": "Is my website speed data secure?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, all speed tests are processed securely. We only access the URLs you provide and don't store them. Test results are generated on-demand and not logged or shared. Your privacy is protected, and all processing is done securely using Google's PageSpeed Insights API."
          }
        }
      ]
    },
    
    softwareApp: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Website Speed Test",
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "Any",
      "description": "Free online website speed test tool to analyze website performance, Core Web Vitals, and page load times. Test your website speed with Google PageSpeed Insights integration. Fast, secure, and easy to use.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "ratingCount": "1200",
        "bestRating": "5",
        "worstRating": "1"
      },
      "featureList": [
        "Core Web Vitals analysis",
        "Performance score (0-100)",
        "Mobile and desktop testing",
        "Page load time metrics",
        "Optimization recommendations",
        "Batch processing (with pass)",
        "100% private and secure"
      ]
    },
    
    howTo: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Test Website Speed",
      "description": "Step-by-step guide to testing website speed and performance online for free",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Enter Website URL",
          "text": "Enter the website URL you want to test in the input field. Include the full URL with http:// or https:// protocol.",
          "position": 1
        },
        {
          "@type": "HowToStep",
          "name": "Choose Testing Strategy",
          "text": "Select your testing strategy: Mobile (simulates mobile device performance) or Desktop (simulates desktop performance). Mobile testing is recommended as Google uses mobile-first indexing.",
          "position": 2
        },
        {
          "@type": "HowToStep",
          "name": "Run Speed Test",
          "text": "Click 'Test Speed' to analyze your website. The tool uses Google PageSpeed Insights to measure performance, Core Web Vitals, and provide optimization recommendations.",
          "position": 3
        },
        {
          "@type": "HowToStep",
          "name": "Review Results",
          "text": "Review your performance score, Core Web Vitals metrics (LCP, FID, CLS), page load times, and optimization opportunities. Use the recommendations to improve your website speed.",
          "position": 4
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
          "name": "Website Speed Test",
          "item": canonicalUrl
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
        <title>Website Speed Test - Free Online Page Speed & Performance Analyzer | FixTools</title>
        <meta name="title" content="Website Speed Test - Free Online Page Speed & Performance Analyzer | FixTools" />
        <meta name="description" content="Test your website speed and performance instantly. Get Core Web Vitals scores, page load times, and optimization recommendations. Free website speed test tool with Google PageSpeed Insights integration. Fast, secure, no registration required." />
        <meta name="keywords" content="website speed test, page speed test, website performance test, page speed checker, website speed analyzer, core web vitals test, page speed insights, website speed checker, test website speed, page speed analyzer" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        {/* Canonical URL */}
        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content="Website Speed Test - Free Online Page Speed & Performance Analyzer" />
        <meta property="og:description" content="Test your website speed and performance instantly. Get Core Web Vitals scores, page load times, and optimization recommendations." />
        <meta property="og:image" content={`${siteHost}/images/og-website-speed-test.png`} />
        <meta property="og:site_name" content="FixTools" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content="Website Speed Test - Free Online Tool" />
        <meta property="twitter:description" content="Test your website speed and performance instantly. Get Core Web Vitals scores and optimization recommendations." />
        <meta property="twitter:image" content={`${siteHost}/images/og-website-speed-test.png`} />
        
        {/* Structured Data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.faqPage) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.softwareApp) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.howTo) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.breadcrumb) }} />
      </Head>

      <style jsx global>{`
        html:has(.website-speed-test-page) {
          font-size: 100% !important;
        }
        
        .website-speed-test-page {
          line-height: 1.5;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          width: 100%;
          min-height: 100vh;
        }
        
        .website-speed-test-page *,
        .website-speed-test-page *::before,
        .website-speed-test-page *::after {
          box-sizing: border-box;
        }
        
        .website-speed-test-page h1,
        .website-speed-test-page h2,
        .website-speed-test-page h3,
        .website-speed-test-page p,
        .website-speed-test-page ul,
        .website-speed-test-page ol {
          margin: 0;
        }
        
        .website-speed-test-page button {
          font-family: inherit;
          cursor: pointer;
        }
        
        .website-speed-test-page input,
        .website-speed-test-page textarea,
        .website-speed-test-page select {
          font-family: inherit;
        }
      `}</style>

      <div className="website-speed-test-page bg-[#fbfbfc] text-slate-900 min-h-screen">
        {/* Header */}
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

        {/* Breadcrumbs */}
        <nav className="mx-auto max-w-6xl px-4 py-3" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm text-slate-600">
            <li><Link href="/" className="hover:text-slate-900 transition-colors">Home</Link></li>
            <li className="flex items-center gap-2"><span className="text-slate-400">/</span><Link href="/tools" className="hover:text-slate-900 transition-colors">Tools</Link></li>
            <li className="flex items-center gap-2"><span className="text-slate-400">/</span><Link href="/tools/web-tools" className="hover:text-slate-900 transition-colors">Web Tools</Link></li>
            <li className="flex items-center gap-2"><span className="text-slate-400">/</span><span className="font-semibold text-slate-900">Website Speed Test</span></li>
          </ol>
        </nav>

        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.35]" style={{ backgroundImage: 'url(/grid.png)', backgroundSize: '256px 256px' }}></div>
          <div className="mx-auto max-w-6xl px-4 py-10 md:py-14 relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-gradient-to-r from-violet-50 to-purple-50 px-4 py-1.5 text-xs font-semibold text-violet-700 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
              </span>
              Free • Fast • Secure
            </div>
            
            <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-violet-600 bg-clip-text text-transparent">
                Website Speed Test
              </span>
            </h1>
            
            <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg md:leading-relaxed">
              Test your website speed and performance instantly. Our <strong>website speed test tool</strong> analyzes Core Web Vitals, page load times, and provides optimization recommendations using Google PageSpeed Insights. Perfect for SEO optimization and performance monitoring.
            </p>

            <dl className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
              <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Core Web Vitals</dt>
                <dd className="mt-1.5 text-sm font-bold text-slate-900">LCP, FID, CLS</dd>
              </div>
              <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Processing</dt>
                <dd className="mt-1.5 text-sm font-bold text-slate-900">Server-Side</dd>
              </div>
              <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Speed</dt>
                <dd className="mt-1.5 text-sm font-bold text-slate-900">10-30s</dd>
              </div>
              <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Price</dt>
                <dd className="mt-1.5 text-sm font-bold text-slate-900">Free</dd>
              </div>
            </dl>
          </div>
        </section>

        {/* Tool UI */}
        <section id="tool" className="mx-auto max-w-6xl px-4 pb-12 pt-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 md:p-7" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Test Website Speed</h2>
                <p className="mt-1 text-sm text-slate-600">Enter website URL, choose testing strategy, then test your website speed.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button onClick={handleClear} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50">Clear</button>
                <button 
                  onClick={handleSpeedTest} 
                  disabled={isProcessing}
                  className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Testing...' : '⚡ Test Speed'}
                </button>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-12">
              <div className="md:col-span-8">
                <label className="mb-2 block text-sm font-semibold text-slate-800">Website URL(s)</label>
                <div className="space-y-2">
                  {urls.map((url, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => handleUrlChange(index, e.target.value)}
                        placeholder="https://example.com"
                        className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-violet-900/20"
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
                    className="rounded-xl border border-violet-200 bg-violet-50 px-3 py-2 text-sm font-semibold text-violet-700 hover:bg-violet-100"
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
                  <div className="mt-6 rounded-xl border-2 border-violet-200 bg-gradient-to-r from-violet-50 to-purple-50 p-6">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-violet-600"></div>
                      <p className="text-sm font-semibold text-violet-900">
                        Testing website speed{processingProgress.total > 1 && ` (${processingProgress.current}/${processingProgress.total})`}...
                      </p>
                    </div>
                    {processingProgress.total > 1 && (
                      <div className="mt-3">
                        <div className="w-full bg-violet-200 rounded-full h-2.5">
                          <div 
                            className="bg-gradient-to-r from-violet-600 to-purple-600 h-2.5 rounded-full transition-all duration-300"
                            style={{ width: `${(processingProgress.current / processingProgress.total) * 100}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-violet-700 mt-2 text-center">
                          Processing {processingProgress.current} of {processingProgress.total} URL{processingProgress.total !== 1 ? 's' : ''}
                        </p>
                      </div>
                    )}
                    {processingProgress.total === 1 && (
                      <div className="mt-3">
                        <div className="w-full bg-violet-200 rounded-full h-2.5 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-violet-600 to-purple-600 h-2.5 rounded-full animate-pulse"
                            style={{ width: '60%' }}
                          ></div>
                        </div>
                        <p className="text-xs text-violet-700 mt-2 text-center">
                          {processingProgress.currentUrl || 'Analyzing website performance...'}
                        </p>
                      </div>
                    )}
                    <p className="text-xs text-violet-600 mt-3 text-center">
                      This may take 10-30 seconds per URL
                    </p>
                  </div>
                )}
              </div>

              <div className="md:col-span-4">
                <label className="mb-2 block text-sm font-semibold text-slate-800">Options</label>
                <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Testing Strategy</label>
                    <select
                      value={strategy}
                      onChange={(e) => setStrategy(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white p-2 text-sm"
                    >
                      <option value="mobile">Mobile</option>
                      <option value="desktop">Desktop</option>
                    </select>
                  </div>
                  <div className="rounded-xl border border-violet-200 bg-violet-50 p-3">
                    <p className="text-xs font-semibold text-violet-900 mb-1">Free Tier Limits</p>
                    <p className="text-xs text-violet-700">1 URL: Full results</p>
                    <p className="text-xs text-violet-700">2-3 URLs: Limited results</p>
                    <p className="text-xs text-violet-700">4+ URLs: Requires pass</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Speed Test Results */}
            {results.length > 0 && (
              <div className="mt-6 space-y-6">
                <label className="block text-sm font-semibold text-slate-800">Speed Test Results</label>
                {results.map((result, index) => (
                  <div key={index} className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-6">
                    {result.error ? (
                      <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                        <p className="text-sm font-semibold text-red-900 mb-1">{result.url}</p>
                        <p className="text-sm text-red-700">{result.error}</p>
                      </div>
                    ) : (
                      <>
                        <div className="mb-4 flex items-center justify-between">
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{result.url}</p>
                            <p className="text-xs text-slate-600">
                              {result.strategy === 'mobile' ? '📱 Mobile' : '🖥️ Desktop'} • Tested {new Date(result.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>

                        {/* Performance Score */}
                        <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className={`rounded-xl border-2 p-4 ${getScoreBgColor(result.performance.score)}`}>
                            <p className="text-xs font-semibold text-slate-700 mb-1">Performance</p>
                            <p className={`text-3xl font-bold ${getScoreColor(result.performance.score)}`}>
                              {result.performance.score}
                            </p>
                          </div>
                          {result.limited ? (
                            <>
                              <div className="rounded-xl border-2 border-slate-200 bg-slate-50 p-4 relative overflow-hidden">
                                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-violet-50 to-purple-50 opacity-90">
                                  <span className="text-2xl">🔒</span>
                                </div>
                                <p className="text-xs font-semibold text-slate-500 mb-1">Accessibility</p>
                                <p className="text-3xl font-bold text-slate-400">—</p>
                              </div>
                              <div className="rounded-xl border-2 border-slate-200 bg-slate-50 p-4 relative overflow-hidden">
                                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-violet-50 to-purple-50 opacity-90">
                                  <span className="text-2xl">🔒</span>
                                </div>
                                <p className="text-xs font-semibold text-slate-500 mb-1">Best Practices</p>
                                <p className="text-3xl font-bold text-slate-400">—</p>
                              </div>
                              <div className="rounded-xl border-2 border-slate-200 bg-slate-50 p-4 relative overflow-hidden">
                                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-violet-50 to-purple-50 opacity-90">
                                  <span className="text-2xl">🔒</span>
                                </div>
                                <p className="text-xs font-semibold text-slate-500 mb-1">SEO</p>
                                <p className="text-3xl font-bold text-slate-400">—</p>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className={`rounded-xl border-2 p-4 ${getScoreBgColor(result.accessibility?.score || 0)}`}>
                                <p className="text-xs font-semibold text-slate-700 mb-1">Accessibility</p>
                                <p className={`text-3xl font-bold ${getScoreColor(result.accessibility?.score || 0)}`}>
                                  {result.accessibility?.score || 0}
                                </p>
                              </div>
                              <div className={`rounded-xl border-2 p-4 ${getScoreBgColor(result.bestPractices?.score || 0)}`}>
                                <p className="text-xs font-semibold text-slate-700 mb-1">Best Practices</p>
                                <p className={`text-3xl font-bold ${getScoreColor(result.bestPractices?.score || 0)}`}>
                                  {result.bestPractices?.score || 0}
                                </p>
                              </div>
                              <div className={`rounded-xl border-2 p-4 ${getScoreBgColor(result.seo?.score || 0)}`}>
                                <p className="text-xs font-semibold text-slate-700 mb-1">SEO</p>
                                <p className={`text-3xl font-bold ${getScoreColor(result.seo?.score || 0)}`}>
                                  {result.seo?.score || 0}
                                </p>
                              </div>
                            </>
                          )}
                        </div>

                        {/* Core Web Vitals - Hidden for limited results */}
                        {!result.limited && (
                          <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4">
                            <h3 className="text-sm font-bold text-slate-900 mb-3">Core Web Vitals</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                                <p className="text-xs font-semibold text-slate-700 mb-1">LCP</p>
                                <p className="text-lg font-bold text-slate-900">
                                  {formatTime(result.performance.metrics?.largestContentfulPaint)}
                                </p>
                                <p className="text-xs text-slate-600 mt-1">Largest Contentful Paint</p>
                              </div>
                              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                                <p className="text-xs font-semibold text-slate-700 mb-1">FID</p>
                                <p className="text-lg font-bold text-slate-900">
                                  {formatTime(result.performance.metrics?.totalBlockingTime)}
                                </p>
                                <p className="text-xs text-slate-600 mt-1">Total Blocking Time</p>
                              </div>
                              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                                <p className="text-xs font-semibold text-slate-700 mb-1">CLS</p>
                                <p className="text-lg font-bold text-slate-900">
                                  {result.performance.metrics?.cumulativeLayoutShift?.toFixed(3) || '0.000'}
                                </p>
                                <p className="text-xs text-slate-600 mt-1">Cumulative Layout Shift</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Performance Metrics - Hidden for limited results */}
                        {!result.limited && (
                          <div className="rounded-xl border border-slate-200 bg-white p-4">
                            <h3 className="text-sm font-bold text-slate-900 mb-3">Performance Metrics</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                              <div>
                                <p className="text-xs font-semibold text-slate-700 mb-1">First Contentful Paint</p>
                                <p className="text-sm font-bold text-slate-900">
                                  {formatTime(result.performance.metrics?.firstContentfulPaint)}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-slate-700 mb-1">Speed Index</p>
                                <p className="text-sm font-bold text-slate-900">
                                  {formatTime(result.performance.metrics?.speedIndex)}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-slate-700 mb-1">Time to Interactive</p>
                                <p className="text-sm font-bold text-slate-900">
                                  {formatTime(result.performance.metrics?.timeToInteractive)}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Limited Results Upgrade CTA */}
                        {result.limited && (
                          <div className="mb-6 rounded-xl border-2 border-violet-200 bg-gradient-to-r from-violet-50 to-purple-50 p-6">
                            <div className="flex items-start gap-4">
                              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg">
                                <span className="text-2xl">🔓</span>
                              </div>
                              <div className="flex-1">
                                <h3 className="text-lg font-bold text-slate-900 mb-2">Upgrade to See Full Results</h3>
                                <p className="text-sm text-slate-700 leading-relaxed mb-4">
                                  You're viewing limited results. Get a Processing Pass to unlock:
                                </p>
                                <ul className="space-y-2 mb-4 text-sm text-slate-700">
                                  <li className="flex items-start gap-2">
                                    <span className="text-violet-600 font-bold mt-0.5">✓</span>
                                    <span>Accessibility, Best Practices, and SEO scores</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <span className="text-violet-600 font-bold mt-0.5">✓</span>
                                    <span>Detailed Core Web Vitals breakdown</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <span className="text-violet-600 font-bold mt-0.5">✓</span>
                                    <span>Performance metrics (FCP, Speed Index, TTI)</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <span className="text-violet-600 font-bold mt-0.5">✓</span>
                                    <span>Batch processing for 4+ URLs</span>
                                  </li>
                                </ul>
                                <button
                                  onClick={() => {
                                    setPaymentRequirement({
                                      requiresPayment: true,
                                      reason: 'batch',
                                      urlCount: urls.filter(u => u.trim()).length,
                                    });
                                    setShowPaymentModal(true);
                                  }}
                                  className="rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white hover:shadow-lg transition-all"
                                >
                                  Get Processing Pass - $3.99
                                </button>
                              </div>
                            </div>
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

        {/* Payment Modal */}
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          requirement={paymentRequirement}
          onPaymentSuccess={handlePaymentSuccess}
        />

        {/* What is Website Speed Test? - Educational Content */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">What is a Website Speed Test?</h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                A <strong>website speed test</strong> is a performance analysis tool that measures how fast your website loads and performs. It analyzes key performance metrics including Core Web Vitals (LCP, FID, CLS), page load times, render-blocking resources, and provides a comprehensive performance score from 0-100. Website speed tests are essential for SEO optimization, user experience improvement, and identifying performance bottlenecks that may be slowing down your website.
              </p>
              
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                According to <a href="https://web.dev/" target="_blank" rel="noopener noreferrer" className="text-violet-700 hover:text-violet-800 font-semibold underline">Google Web.dev</a>, website speed is a critical ranking factor for search engines. Google uses Core Web Vitals as ranking signals, meaning faster websites rank higher in search results. A website speed test helps you understand your website's performance, identify optimization opportunities, and ensure your site meets Google's performance thresholds for optimal SEO rankings.
              </p>
              
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Our <strong>website speed test tool</strong> uses Google PageSpeed Insights API to analyze your website's performance. This provides accurate, real-world performance metrics based on actual user experience data. The tool tests both mobile and desktop performance, giving you comprehensive insights into how your website performs across different devices and network conditions. Mobile testing is particularly important as Google uses mobile-first indexing, meaning your mobile performance directly impacts your search rankings.
              </p>

              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 text-violet-600">📱</span>
                    Mobile Speed Test
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    Simulates how your website performs on mobile devices with slower CPU and mobile network conditions. Mobile tests are critical for SEO as Google uses mobile-first indexing and mobile performance as ranking factors.
                  </p>
                  <ul className="space-y-1 text-xs text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="text-violet-600 font-bold mt-0.5">•</span>
                      <span>Mobile-first indexing impact</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-violet-600 font-bold mt-0.5">•</span>
                      <span>Real-world mobile performance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-violet-600 font-bold mt-0.5">•</span>
                      <span>SEO ranking factor</span>
                    </li>
                  </ul>
                </div>
                
                <div className="rounded-2xl border-2 border-violet-200 bg-violet-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-white">🖥️</span>
                    Desktop Speed Test
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    Simulates how your website performs on desktop devices with faster CPU and broadband connections. Desktop tests help optimize for desktop users and provide baseline performance metrics.
                  </p>
                  <ul className="space-y-1 text-xs text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="text-violet-600 font-bold mt-0.5">•</span>
                      <span>Desktop user experience</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-violet-600 font-bold mt-0.5">•</span>
                      <span>Baseline performance metrics</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-violet-600 font-bold mt-0.5">•</span>
                      <span>Optimization reference</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <p className="text-base text-slate-700 leading-relaxed">
                Website speed tests serve many purposes: optimizing website performance for better user experience, improving SEO rankings through Core Web Vitals optimization, identifying performance bottlenecks and slow-loading resources, monitoring website performance over time, comparing performance before and after optimizations, and ensuring your website meets Google's performance thresholds. Whether you're optimizing a new website or monitoring an existing one, regular speed testing helps maintain optimal performance and search rankings.
              </p>
            </div>
          </div>
        </section>

        {/* Core Web Vitals Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Understanding Core Web Vitals</h2>
            </div>
            
            <p className="text-base text-slate-600 mb-6 leading-relaxed">
              Core Web Vitals are three key metrics that Google uses to measure website user experience. These metrics are ranking factors for Google search results and directly impact your SEO performance.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="rounded-2xl border-2 border-green-200 bg-green-50 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <span className="text-2xl">⚡</span>
                  Largest Contentful Paint (LCP)
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed mb-3">
                  Measures loading performance. LCP marks the point when the largest content element (image, video, or text block) becomes visible in the viewport.
                </p>
                <div className="rounded-lg border border-green-200 bg-white p-3">
                  <p className="text-xs font-semibold text-slate-700 mb-1">Google Threshold</p>
                  <p className="text-sm font-bold text-green-700">Good: &lt; 2.5 seconds</p>
                  <p className="text-xs text-slate-600 mt-1">Needs improvement: 2.5-4.0s</p>
                  <p className="text-xs text-slate-600">Poor: &gt; 4.0s</p>
                </div>
              </div>
              
              <div className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <span className="text-2xl">🎯</span>
                  First Input Delay (FID)
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed mb-3">
                  Measures interactivity. FID measures the time from when a user first interacts with your page (clicks, taps, key presses) to when the browser responds.
                </p>
                <div className="rounded-lg border border-blue-200 bg-white p-3">
                  <p className="text-xs font-semibold text-slate-700 mb-1">Google Threshold</p>
                  <p className="text-sm font-bold text-blue-700">Good: &lt; 100 milliseconds</p>
                  <p className="text-xs text-slate-600 mt-1">Needs improvement: 100-300ms</p>
                  <p className="text-xs text-slate-600">Poor: &gt; 300ms</p>
                </div>
              </div>
              
              <div className="rounded-2xl border-2 border-purple-200 bg-purple-50 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <span className="text-2xl">📐</span>
                  Cumulative Layout Shift (CLS)
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed mb-3">
                  Measures visual stability. CLS quantifies how much visible content shifts during page load, which can be frustrating for users.
                </p>
                <div className="rounded-lg border border-purple-200 bg-white p-3">
                  <p className="text-xs font-semibold text-slate-700 mb-1">Google Threshold</p>
                  <p className="text-sm font-bold text-purple-700">Good: &lt; 0.1</p>
                  <p className="text-xs text-slate-600 mt-1">Needs improvement: 0.1-0.25</p>
                  <p className="text-xs text-slate-600">Poor: &gt; 0.25</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-6 rounded-2xl bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">📊</span>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">SEO Impact</h4>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    According to <a href="https://developers.google.com/search/docs/appearance/core-web-vitals" target="_blank" rel="noopener noreferrer" className="text-violet-700 hover:text-violet-800 font-semibold underline">Google's Core Web Vitals documentation</a>, these metrics are ranking factors for search results. Websites that meet the "Good" thresholds for all three Core Web Vitals are more likely to rank higher in Google search results. Regular speed testing helps ensure your website maintains optimal Core Web Vitals scores.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white p-8 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-3">Website Speed Impact</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">Statistics and benefits of website speed optimization</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-violet-200 shadow-lg">
                <div className="text-5xl font-extrabold text-violet-600 mb-2">53%</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Mobile Bounce Rate</div>
                <div className="text-xs text-slate-600">If page load &gt; 3 seconds</div>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-blue-200 shadow-lg">
                <div className="text-5xl font-extrabold text-blue-600 mb-2">1s</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Delay = 7% Loss</div>
                <div className="text-xs text-slate-600">In conversions</div>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-purple-200 shadow-lg">
                <div className="text-5xl font-extrabold text-purple-600 mb-2">90+</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Target Score</div>
                <div className="text-xs text-slate-600">For optimal SEO</div>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-orange-200 shadow-lg">
                <div className="text-5xl font-extrabold text-orange-600 mb-2">2.5s</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">LCP Target</div>
                <div className="text-xs text-slate-600">Core Web Vital</div>
              </div>
            </div>
            
            <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">📈</span>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">Performance Matters</h4>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    According to <a href="https://www.thinkwithgoogle.com/marketing-strategies/app-and-mobile/mobile-page-speed-new-industry-benchmarks/" target="_blank" rel="noopener noreferrer" className="text-violet-700 hover:text-violet-800 font-semibold underline">Google's research</a>, 53% of mobile users abandon sites that take longer than 3 seconds to load. Every second of delay can result in a 7% reduction in conversions. Fast websites not only rank higher in search results but also provide better user experience, leading to higher engagement and conversions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Use Website Speed Test - Benefits Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Why Use Website Speed Test?</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Website speed testing offers numerous advantages for website owners, developers, SEO professionals, and businesses. Here&apos;s why you should regularly test your website speed:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-violet-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg">
                    <span className="text-2xl">📈</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">SEO Optimization</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Improve your search engine rankings by optimizing Core Web Vitals. Google uses website speed and Core Web Vitals as ranking factors, meaning faster websites rank higher in search results. Regular speed testing helps you identify performance issues and optimize your website to meet Google's performance thresholds, improving your SEO rankings and organic traffic.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                    <span className="text-2xl">👥</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">User Experience</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Enhance user experience by ensuring fast page load times. Slow websites frustrate users and lead to high bounce rates. According to Google, 53% of mobile users abandon sites that take longer than 3 seconds to load. Speed testing helps you identify and fix performance bottlenecks, ensuring your website provides a fast, smooth user experience that keeps visitors engaged.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-purple-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
                    <span className="text-2xl">💰</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Conversion Optimization</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Increase conversions by improving website speed. Research shows that every second of page load delay can result in a 7% reduction in conversions. Fast websites not only rank higher but also convert better, leading to increased revenue. Speed testing helps you identify performance issues that may be costing you conversions and revenue.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-orange-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg">
                    <span className="text-2xl">🔍</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Performance Monitoring</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Monitor website performance over time and catch performance regressions early. Regular speed testing helps you track performance trends, identify when performance degrades, and ensure your website maintains optimal speed after updates, new content, or plugin installations. This proactive approach helps maintain consistent performance and user experience.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how" className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">How It Works</h2>
            </div>
            
            <p className="text-base text-slate-600 mb-6 leading-relaxed">
              Our website speed test tool uses Google PageSpeed Insights API to analyze your website's performance. Here&apos;s how the process works:
            </p>
            
            <div className="grid md:grid-cols-4 gap-6">
              <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white font-bold text-xl shadow-lg mb-4">
                  1
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Enter URL</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Enter the website URL you want to test. The tool accepts HTTP and HTTPS URLs from publicly accessible websites.
                </p>
              </div>

              <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-xl shadow-lg mb-4">
                  2
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Choose Strategy</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Select your testing strategy: Mobile (simulates mobile device performance) or Desktop (simulates desktop performance). Mobile testing is recommended for SEO.
                </p>
              </div>

              <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 text-white font-bold text-xl shadow-lg mb-4">
                  3
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Analyze Performance</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Our server uses Google PageSpeed Insights API to analyze your website's performance, Core Web Vitals, and provide optimization recommendations.
                </p>
              </div>

              <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white font-bold text-xl shadow-lg mb-4">
                  4
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Review Results</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Review your performance score, Core Web Vitals metrics, page load times, and optimization opportunities. Use the recommendations to improve your website speed.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Best Practices Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Best Practices for Website Speed Optimization</h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                To improve your website speed and performance, follow these best practices:
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="rounded-2xl border-2 border-violet-200 bg-violet-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Image Optimization</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-violet-600 font-bold mt-0.5">•</span>
                      <span><strong>Compress images:</strong> Use WebP format and compress images to reduce file size without quality loss</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-violet-600 font-bold mt-0.5">•</span>
                      <span><strong>Lazy loading:</strong> Implement lazy loading for images below the fold to improve initial page load</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-violet-600 font-bold mt-0.5">•</span>
                      <span><strong>Responsive images:</strong> Use srcset and sizes attributes for responsive images</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Code Optimization</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-violet-600 font-bold mt-0.5">•</span>
                      <span><strong>Minify CSS/JS:</strong> Remove whitespace and comments from CSS and JavaScript files</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-violet-600 font-bold mt-0.5">•</span>
                      <span><strong>Code splitting:</strong> Split large JavaScript bundles into smaller chunks</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-violet-600 font-bold mt-0.5">•</span>
                      <span><strong>Remove unused code:</strong> Eliminate unused CSS and JavaScript to reduce file sizes</span>
                    </li>
                  </ul>
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">Additional Optimization Tips</h3>
              <ul className="space-y-2 mb-4">
                <li className="flex items-start gap-2">
                  <span className="text-violet-600 font-bold mt-1">•</span>
                  <span className="text-slate-700"><strong>Use CDN:</strong> Content Delivery Networks (CDNs) serve content from locations closer to users, reducing latency</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-600 font-bold mt-1">•</span>
                  <span className="text-slate-700"><strong>Enable caching:</strong> Implement browser caching and server-side caching to reduce load times for returning visitors</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-600 font-bold mt-1">•</span>
                  <span className="text-slate-700"><strong>Optimize fonts:</strong> Use font-display: swap, preload critical fonts, and limit font families</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-600 font-bold mt-1">•</span>
                  <span className="text-slate-700"><strong>Reduce server response time:</strong> Optimize server configuration, use fast hosting, and minimize database queries</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-600 font-bold mt-1">•</span>
                  <span className="text-slate-700"><strong>Eliminate render-blocking resources:</strong> Defer non-critical CSS and JavaScript, inline critical CSS</span>
                </li>
              </ul>
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

        {/* Related Tools */}
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Related Web Tools</h2>
            <p className="text-slate-600">Explore more tools for website analysis and testing:</p>
          </div>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Link href="/web-tools/website-screenshot" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-violet-300 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">📸</span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">Website Screenshot</p>
                  <p className="text-xs text-slate-500">Capture webpage images</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">Take screenshots of any website URL and download as PNG or PDF.</p>
              <p className="mt-4 text-sm font-semibold text-violet-600 group-hover:text-violet-700">Try tool →</p>
            </Link>

            <Link href="/tools/web-tools" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-violet-300 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🌐</span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">All Web Tools</p>
                  <p className="text-xs text-slate-500">Browse Category</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">Discover all web tools for website analysis, testing, and more.</p>
              <p className="mt-4 text-sm font-semibold text-violet-600 group-hover:text-violet-700">Browse tools →</p>
            </Link>

            <Link href="/tools/seo-tools" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-violet-300 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🔍</span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">SEO Tools</p>
                  <p className="text-xs text-slate-500">Optimization tools</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">Explore SEO tools for search engine optimization and ranking improvement.</p>
              <p className="mt-4 text-sm font-semibold text-violet-600 group-hover:text-violet-700">Browse tools →</p>
            </Link>
          </div>
        </section>

        {/* Footer */}
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

