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

export default function BrokenLinkChecker() {
  const [urls, setUrls] = useState(['']);
  const [results, setResults] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentRequirement, setPaymentRequirement] = useState(null);
  const [userSession, setUserSession] = useState({ processingPass: null });
  const [processingProgress, setProcessingProgress] = useState({ current: 0, total: 0, currentUrl: '' });

  const currentYear = new Date().getFullYear();
  const canonicalUrl = `${siteHost}/web-tools/broken-link-checker`;

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

  const handleCheckBrokenLinks = async () => {
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

      setProcessingProgress({ current: 0, total: validUrls.length, currentUrl: 'Scanning for broken links...' });

      const response = await fetch('/api/web-tools/broken-link-checker', {
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
        setProcessingProgress({ current: 1, total: validUrls.length, currentUrl: 'Checking links...' });
      }

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 402) {
          setPaymentRequirement(data.requirement);
          setShowPaymentModal(true);
          setIsProcessing(false);
          return;
        }
        throw new Error(data.message || data.error || 'Failed to check broken links');
      }

      if (data.success && data.results) {
        setProcessingProgress({ current: data.results.length, total: validUrls.length, currentUrl: 'Complete' });
        setResults(data.results);
      }
    } catch (err) {
      console.error('Broken link check error:', err);
      setError(err.message || 'Failed to check broken links. Please try again.');
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
      handleCheckBrokenLinks();
    }
  };

  const getStatusColor = (link) => {
    if (link.isWorking) return 'text-green-600';
    if (link.isRedirect) return 'text-orange-600';
    if (link.isBroken) return 'text-red-600';
    return 'text-slate-600';
  };

  const getStatusBgColor = (link) => {
    if (link.isWorking) return 'border-green-200 bg-green-50';
    if (link.isRedirect) return 'border-orange-200 bg-orange-50';
    if (link.isBroken) return 'border-red-200 bg-red-50';
    return 'border-slate-200 bg-slate-50';
  };

  const getStatusText = (link) => {
    if (link.isWorking) return 'Working';
    if (link.isRedirect) return 'Redirect';
    if (link.isBroken) return 'Broken';
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
          "name": "How do I check for broken links on my website?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Enter the URL (with or without https://) in the input field, then click 'Check Broken Links'. The tool will scan the website for all links, check each link's status, and identify broken links (404 errors), working links, and redirects. Results typically appear within 10-30 seconds depending on the number of links."
          }
        },
        {
          "@type": "Question",
          "name": "What are broken links?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Broken links are URLs that return error status codes (typically 404 Not Found, but also 403 Forbidden, 500 Internal Server Error, etc.). Broken links occur when a page has been deleted, moved, or never existed. They create poor user experience, hurt SEO, and reduce website credibility."
          }
        },
        {
          "@type": "Question",
          "name": "Why are broken links bad for my website?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Broken links harm user experience, SEO, and website credibility. They frustrate users who can't access content, waste crawl budget for search engines, reduce trust and credibility, lower conversion rates, and can negatively impact search rankings. Regularly checking and fixing broken links is essential for maintaining a healthy website."
          }
        },
        {
          "@type": "Question",
          "name": "Can I check multiple websites at once?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Batch processing (4+ URLs) requires a Processing Pass. Free tier allows checking up to 3 URLs at a time (up to 50 links per URL). With a Processing Pass, you can check up to 20 URLs in a single batch with up to 500 links per URL, making it efficient for monitoring multiple websites or your entire portfolio."
          }
        },
        {
          "@type": "Question",
          "name": "What does the tool check?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our broken link checker extracts all links from a webpage (anchor tags with href attributes), checks each link's HTTP status code, categorizes links as working (200-299), broken (400+), or redirects (300-399), and provides detailed reports with link status, response times, and error messages. It skips javascript:, mailto:, tel:, and anchor-only links."
          }
        },
        {
          "@type": "Question",
          "name": "How often should I check for broken links?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Check for broken links regularly, especially after making changes to your website. For active websites, check monthly or after major content updates. For larger websites, consider weekly checks. After redesigns or migrations, check immediately. Regular monitoring helps identify and fix broken links before they impact users or SEO."
          }
        },
        {
          "@type": "Question",
          "name": "Is this broken link checker tool free to use?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, our Broken Link Checker tool is free for single URL checks (up to 50 links per URL, 5 checks per day). Batch processing and higher limits require a Processing Pass. We aim to provide valuable tools for free while offering premium options for power users and businesses."
          }
        }
      ]
    },
    
    softwareApp: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Broken Link Checker",
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "Any",
      "description": "Free online broken link checker. Find broken links on websites, check 404 errors, and identify dead links. Check multiple websites with batch processing.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "1600",
        "bestRating": "5",
        "worstRating": "1"
      },
      "featureList": [
        "Broken link detection",
        "404 error checking",
        "Link status verification",
        "Redirect detection",
        "Response time measurement",
        "Batch processing (with pass)",
        "Comprehensive link reports",
        "Dead link identification"
      ]
    },
    
    howTo: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Check for Broken Links",
      "description": "Step-by-step guide to finding broken links on websites online for free",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Enter URL",
          "text": "Enter the URL you want to check (e.g., https://example.com) into the input field. You can include or omit https:// - the tool will add it if missing.",
          "position": 1
        },
        {
          "@type": "HowToStep",
          "name": "Check Broken Links",
          "text": "Click the 'Check Broken Links' button. The tool will scan the webpage for all links and check each link's status. This typically takes 10-30 seconds depending on the number of links.",
          "position": 2
        },
        {
          "@type": "HowToStep",
          "name": "Review Results",
          "text": "View the broken link analysis including working links, broken links (404 errors), redirects, and link status codes. Use the results to identify and fix broken links on your website.",
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
          "name": "Broken Link Checker",
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
        <title>Broken Link Checker - Free Online Dead Link Finder | FixTools</title>
        <meta name="title" content="Broken Link Checker - Free Online Dead Link Finder | FixTools" />
        <meta name="description" content="Find broken links on websites. Scan entire website for dead links, 404 errors, and redirect issues. Free broken link checker tool with comprehensive link status reports." />
        <meta name="keywords" content="broken link checker, dead link finder, check broken links, 404 error checker, link checker, find dead links, broken url checker, website link checker, scan broken links, link status checker" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content="Broken Link Checker - Free Online Dead Link Finder" />
        <meta property="og:description" content="Find broken links on websites. Scan entire website for dead links, 404 errors, and redirect issues." />
        <meta property="og:image" content={`${siteHost}/images/og-broken-link-checker.png`} />
        <meta property="og:site_name" content="FixTools" />
        
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content="Broken Link Checker - Free Online Dead Link Finder" />
        <meta property="twitter:description" content="Find broken links on websites. Scan entire website for dead links, 404 errors, and redirect issues." />
        <meta property="twitter:image" content={`${siteHost}/images/og-broken-link-checker.png`} />
        
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.faqPage) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.softwareApp) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.howTo) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.breadcrumb) }} />
      </Head>

      <style jsx global>{`
        html:has(.broken-link-checker-page) {
          font-size: 100% !important;
        }
        
        .broken-link-checker-page * {
          box-sizing: border-box;
        }
        
        .broken-link-checker-page h1,
        .broken-link-checker-page h2,
        .broken-link-checker-page h3,
        .broken-link-checker-page p,
        .broken-link-checker-page ul,
        .broken-link-checker-page ol {
          margin: 0;
        }
        
        .broken-link-checker-page button {
          font-family: inherit;
          cursor: pointer;
        }
        
        .broken-link-checker-page input,
        .broken-link-checker-page textarea,
        .broken-link-checker-page select {
          font-family: inherit;
        }
        
        /* Fix typography styling within broken link checker page sections */
        .broken-link-checker-page section .max-w-none {
          font-size: 16px !important;
          line-height: 1.75 !important;
          color: #334155 !important;
        }
        
        .broken-link-checker-page section .max-w-none h3 {
          font-size: 20px !important;
          font-weight: 700 !important;
          line-height: 1.75rem !important;
          margin-top: 1.5rem !important;
          margin-bottom: 0.75rem !important;
          color: #0f172a !important;
        }
        
        .broken-link-checker-page section .max-w-none p {
          font-size: 16px !important;
          line-height: 1.75 !important;
          margin-bottom: 1rem !important;
          margin-top: 0 !important;
          color: #334155 !important;
        }
        
        .broken-link-checker-page section .max-w-none ol {
          margin-top: 1rem !important;
          margin-bottom: 1rem !important;
          padding-left: 1.5rem !important;
          color: #334155 !important;
          list-style-type: decimal !important;
          list-style-position: outside !important;
        }
        
        .broken-link-checker-page section .max-w-none ul {
          margin-top: 1rem !important;
          margin-bottom: 1rem !important;
          padding-left: 1.5rem !important;
          color: #334155 !important;
          list-style-type: disc !important;
          list-style-position: outside !important;
        }
        
        .broken-link-checker-page section .max-w-none ol li,
        .broken-link-checker-page section .max-w-none ul li {
          margin-top: 0.75rem !important;
          margin-bottom: 0.75rem !important;
          line-height: 1.75 !important;
          padding-left: 0.5rem !important;
          font-size: 16px !important;
        }
        
        .broken-link-checker-page section .max-w-none strong {
          font-weight: 600 !important;
          color: #0f172a !important;
        }
        
        .broken-link-checker-page section .max-w-none a {
          color: #dc2626 !important;
          text-decoration: underline !important;
          font-weight: 500 !important;
        }
        
        .broken-link-checker-page section .max-w-none a:hover {
          color: #b91c1c !important;
        }
        
        /* Override global CSS font-size for this page */
        .broken-link-checker-page {
          font-size: 16px !important;
        }
        
        .broken-link-checker-page h1 {
          font-size: 3rem !important;
        }
        
        .broken-link-checker-page h2 {
          font-size: 1.875rem !important;
        }
        
        .broken-link-checker-page h3 {
          font-size: 1.25rem !important;
        }
        
        .broken-link-checker-page p,
        .broken-link-checker-page li,
        .broken-link-checker-page span {
          font-size: 1rem !important;
        }
      `}</style>

      <div className="broken-link-checker-page bg-[#fbfbfc] text-slate-900 min-h-screen">
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
            <li className="flex items-center gap-2"><span className="text-slate-400">/</span><span className="font-semibold text-slate-900">Broken Link Checker</span></li>
          </ol>
        </nav>

        <section className="relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.35]" style={{ backgroundImage: 'url(/grid.png)', backgroundSize: '256px 256px' }}></div>
          <div className="mx-auto max-w-6xl px-4 py-10 md:py-14 relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-gradient-to-r from-red-50 to-rose-50 px-4 py-1.5 text-xs font-semibold text-red-700 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              Free • Fast • Comprehensive
            </div>
            
            <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              <span className="bg-gradient-to-r from-red-600 via-rose-600 to-red-600 bg-clip-text text-transparent">
                Broken Link Checker
              </span>
            </h1>
            
            <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg md:leading-relaxed">
              Find broken links on websites with our free <strong>Broken Link Checker</strong> tool. Scan entire website for dead links, 404 errors, and redirect issues instantly.
            </p>

            <dl className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
              <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Detection</dt>
                <dd className="mt-1.5 text-sm font-bold text-slate-900">404 Errors</dd>
              </div>
              <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</dt>
                <dd className="mt-1.5 text-sm font-bold text-slate-900">Link Verification</dd>
              </div>
              <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Speed</dt>
                <dd className="mt-1.5 text-sm font-bold text-slate-900">10-30 seconds</dd>
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
                <h2 className="text-xl font-semibold text-slate-900">Check for Broken Links</h2>
                <p className="mt-1 text-sm text-slate-600">Enter URL(s), then click 'Check Broken Links' to scan for dead links.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button onClick={handleClear} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50">Clear</button>
                <button 
                  onClick={handleCheckBrokenLinks} 
                  disabled={isProcessing}
                  className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Checking...' : '🔗 Check Broken Links'}
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
                        className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-red-900/20"
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
                    className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
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
                  <div className="mt-6 rounded-xl border-2 border-red-200 bg-gradient-to-r from-red-50 to-rose-50 p-6">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
                      <p className="text-sm font-semibold text-red-900">
                        Checking broken links{processingProgress.total > 1 && ` (${processingProgress.current}/${processingProgress.total})`}...
                      </p>
                    </div>
                    {processingProgress.total > 1 && (
                      <div className="mt-3">
                        <div className="w-full bg-red-200 rounded-full h-2.5">
                          <div 
                            className="bg-gradient-to-r from-red-600 to-rose-600 h-2.5 rounded-full transition-all duration-300"
                            style={{ width: `${(processingProgress.current / processingProgress.total) * 100}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-red-700 mt-2 text-center">
                          Processing {processingProgress.current} of {processingProgress.total} URL{processingProgress.total !== 1 ? 's' : ''}
                        </p>
                      </div>
                    )}
                    {processingProgress.total === 1 && (
                      <div className="mt-3">
                        <div className="w-full bg-red-200 rounded-full h-2.5 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-red-600 to-rose-600 h-2.5 rounded-full animate-pulse"
                            style={{ width: '60%' }}
                          ></div>
                        </div>
                        <p className="text-xs text-red-700 mt-2 text-center">
                          {processingProgress.currentUrl || 'Scanning links...'}
                        </p>
                      </div>
                    )}
                    <p className="text-xs text-red-600 mt-3 text-center">
                      This may take 10-30 seconds per URL
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
                    <p className="text-xs text-violet-700">50 links per URL</p>
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
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Total Links</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {results.reduce((sum, r) => sum + (r.totalLinks || 0), 0)}
                    </p>
                  </div>
                  <div className="rounded-xl border border-green-200 bg-green-50 p-3 text-center">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Working</p>
                    <p className="text-2xl font-bold text-green-600">
                      {results.reduce((sum, r) => sum + (r.summary?.working || 0), 0)}
                    </p>
                  </div>
                  <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-center">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Broken</p>
                    <p className="text-2xl font-bold text-red-600">
                      {results.reduce((sum, r) => sum + (r.summary?.broken || 0), 0)}
                    </p>
                  </div>
                  <div className="rounded-xl border border-orange-200 bg-orange-50 p-3 text-center">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Redirects</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {results.reduce((sum, r) => sum + (r.summary?.redirects || 0), 0)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Broken Link Check Results */}
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
                              Page Status: {result.pageStatus} • Total Links: {result.totalLinks} • Checked: {result.linksChecked} • Scanned {new Date(result.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>

                        {result.summary && (
                          <div className="mb-4 grid grid-cols-3 gap-3">
                            <div className="rounded-xl border border-green-200 bg-green-50 p-3 text-center">
                              <p className="text-xs font-semibold text-slate-600 mb-1">Working</p>
                              <p className="text-lg font-bold text-green-600">{result.summary.working}</p>
                            </div>
                            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-center">
                              <p className="text-xs font-semibold text-slate-600 mb-1">Broken</p>
                              <p className="text-lg font-bold text-red-600">{result.summary.broken}</p>
                            </div>
                            <div className="rounded-xl border border-orange-200 bg-orange-50 p-3 text-center">
                              <p className="text-xs font-semibold text-slate-600 mb-1">Redirects</p>
                              <p className="text-lg font-bold text-orange-600">{result.summary.redirects}</p>
                            </div>
                          </div>
                        )}

                        {result.links && result.links.length > 0 && (
                          <div className="space-y-4">
                            {result.summary && result.summary.broken > 0 && (
                              <div className="rounded-xl border-2 border-red-200 bg-red-50 p-4">
                                <h4 className="text-sm font-semibold text-red-900 mb-3 flex items-center gap-2">
                                  <span className="text-red-600">❌</span>
                                  Broken Links ({result.summary.broken})
                                </h4>
                                <div className="space-y-2 text-sm max-h-64 overflow-y-auto">
                                  {result.links.filter(l => l.isBroken).map((link, linkIndex) => (
                                    <div key={linkIndex} className="rounded-lg border border-red-200 bg-white p-3">
                                      <div className="flex justify-between items-start mb-1">
                                        <a href={link.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-red-900 break-all hover:underline">
                                          {link.url}
                                        </a>
                                        <span className="text-xs font-semibold text-red-600 ml-2">
                                          {link.statusCode || 'Error'}
                                        </span>
                                      </div>
                                      <p className="text-xs text-slate-600">{link.statusMessage || link.error}</p>
                                      {link.responseTime && (
                                        <p className="text-xs text-slate-500">Response time: {link.responseTime}ms</p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {result.summary && result.summary.redirects > 0 && (
                              <div className="rounded-xl border-2 border-orange-200 bg-orange-50 p-4">
                                <h4 className="text-sm font-semibold text-orange-900 mb-3 flex items-center gap-2">
                                  <span className="text-orange-600">↪</span>
                                  Redirects ({result.summary.redirects})
                                </h4>
                                <div className="space-y-2 text-sm max-h-48 overflow-y-auto">
                                  {result.links.filter(l => l.isRedirect).map((link, linkIndex) => (
                                    <div key={linkIndex} className="rounded-lg border border-orange-200 bg-white p-3">
                                      <div className="flex justify-between items-start mb-1">
                                        <a href={link.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-orange-900 break-all hover:underline">
                                          {link.url}
                                        </a>
                                        <span className="text-xs font-semibold text-orange-600 ml-2">
                                          {link.statusCode}
                                        </span>
                                      </div>
                                      {link.redirectLocation && (
                                        <p className="text-xs text-slate-600">Redirects to: {link.redirectLocation}</p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {result.summary && result.summary.working > 0 && (
                              <details className="rounded-xl border-2 border-green-200 bg-green-50 p-4">
                                <summary className="text-sm font-semibold text-green-900 mb-3 cursor-pointer flex items-center gap-2">
                                  <span className="text-green-600">✓</span>
                                  Working Links ({result.summary.working})
                                </summary>
                                <div className="space-y-2 text-sm max-h-48 overflow-y-auto mt-3">
                                  {result.links.filter(l => l.isWorking).slice(0, 20).map((link, linkIndex) => (
                                    <div key={linkIndex} className="rounded-lg border border-green-200 bg-white p-2">
                                      <a href={link.url} target="_blank" rel="noopener noreferrer" className="font-medium text-green-900 break-all hover:underline text-xs">
                                        {link.url}
                                      </a>
                                      <p className="text-xs text-slate-500">Status: {link.statusCode} • {link.responseTime}ms</p>
                                    </div>
                                  ))}
                                  {result.links.filter(l => l.isWorking).length > 20 && (
                                    <p className="text-xs text-slate-600 italic">... and {result.links.filter(l => l.isWorking).length - 20} more working links</p>
                                  )}
                                </div>
                              </details>
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
              <div className="h-1 w-8 bg-gradient-to-r from-red-500 to-rose-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">What are Broken Links?</h2>
            </div>
            
            <div className="max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                <strong>Broken links</strong> are URLs that return error status codes (typically 404 Not Found, but also 403 Forbidden, 500 Internal Server Error, connection timeouts, etc.). Broken links occur when a page has been deleted, moved, or never existed. They create poor user experience, hurt SEO, and reduce website credibility.
              </p>
              
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                When users click on a broken link, they're typically shown an error page (most commonly "404 Not Found"). This frustrates users, wastes their time, and creates a negative impression of your website. Broken links also waste search engine crawl budget, as search engine crawlers spend time trying to access pages that don't exist instead of indexing valuable content.
              </p>

              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Broken links can occur for many reasons: pages being deleted or moved without proper redirects, URLs being mistyped in content, external websites changing or removing their pages, server errors or downtime, and expired domains. Regular broken link checking helps identify and fix these issues before they impact users and SEO.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">How Broken Links Affect Your Website</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Broken links have significant negative impacts on your website:
              </p>
              <ol className="space-y-3 mb-4 ml-6 text-slate-700" style={{ listStyleType: 'decimal', listStylePosition: 'outside', paddingLeft: '1.5rem' }}>
                <li className="leading-relaxed pl-2" style={{ fontSize: '16px', lineHeight: '1.75' }}><strong>Poor User Experience:</strong> Users click on links expecting to find content, but instead encounter error pages. This frustrates users, wastes their time, and creates a negative impression of your website's quality and reliability.</li>
                <li className="leading-relaxed pl-2" style={{ fontSize: '16px', lineHeight: '1.75' }}><strong>SEO Impact:</strong> Broken links waste search engine crawl budget, as crawlers spend time on non-existent pages instead of indexing valuable content. They can also negatively impact search rankings and reduce the authority passed through internal linking.</li>
                <li className="leading-relaxed pl-2" style={{ fontSize: '16px', lineHeight: '1.75' }}><strong>Credibility Loss:</strong> Websites with many broken links appear unprofessional and poorly maintained. This reduces trust and credibility, which can lead to lower conversion rates and lost business.</li>
                <li className="leading-relaxed pl-2" style={{ fontSize: '16px', lineHeight: '1.75' }}><strong>Lost Traffic:</strong> Broken links prevent users from accessing content, resulting in lost page views and engagement. They also prevent search engines from discovering and indexing pages.</li>
                <li className="leading-relaxed pl-2" style={{ fontSize: '16px', lineHeight: '1.75' }}><strong>Conversion Impact:</strong> Broken links on important pages (product pages, pricing pages, contact pages) can prevent users from completing conversions, directly impacting revenue.</li>
                <li className="leading-relaxed pl-2" style={{ fontSize: '16px', lineHeight: '1.75' }}><strong>Mobile User Impact:</strong> Broken links are particularly frustrating on mobile devices, where users have less patience and are more likely to abandon sites with errors.</li>
              </ol>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">Types of Broken Links</h3>
              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-5">
                  <h4 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600">404</span>
                    404 Not Found
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    The most common type of broken link. Occurs when a page has been deleted, moved, or never existed. Users see a "404 Not Found" error page.
                  </p>
                  <ul className="space-y-1 text-xs text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">•</span>
                      <span>Page deleted or moved</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">•</span>
                      <span>URL typo or incorrect path</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">•</span>
                      <span>Most common broken link type</span>
                    </li>
                  </ul>
                </div>
                
                <div className="rounded-2xl border-2 border-orange-200 bg-orange-50 p-5">
                  <h4 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 text-orange-600">403</span>
                    403 Forbidden
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    Server refuses to provide access to the resource. Can occur due to permissions, security settings, or server configuration issues.
                  </p>
                  <ul className="space-y-1 text-xs text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 font-bold mt-0.5">•</span>
                      <span>Access denied by server</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 font-bold mt-0.5">•</span>
                      <span>Security or permission issues</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 font-bold mt-0.5">•</span>
                      <span>May require authentication</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-5">
                  <h4 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600">500</span>
                    500 Server Error
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    Internal server errors indicate server-side problems. The server is running but unable to fulfill the request due to an error.
                  </p>
                  <ul className="space-y-1 text-xs text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">•</span>
                      <span>Server-side error</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">•</span>
                      <span>Application or database issues</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">•</span>
                      <span>May be temporary</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-5">
                  <h4 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600">⏱</span>
                    Connection Timeout
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    Server doesn't respond within the timeout period. Can occur due to server overload, network issues, or server being down.
                  </p>
                  <ul className="space-y-1 text-xs text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="text-slate-600 font-bold mt-0.5">•</span>
                      <span>Server not responding</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-slate-600 font-bold mt-0.5">•</span>
                      <span>Network or server issues</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-slate-600 font-bold mt-0.5">•</span>
                      <span>May be temporary</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <p className="text-base text-slate-700 leading-relaxed">
                Broken links serve many purposes: identifying pages that need to be fixed or redirected, monitoring website health and maintenance needs, improving user experience by removing dead links, protecting SEO by ensuring crawlers can access content, maintaining credibility by keeping links up-to-date, and preventing revenue loss from broken links on important pages. Understanding broken links is essential for website maintenance, SEO optimization, and user experience improvement.
              </p>
            </div>
          </div>
        </section>

        {/* Why Broken Links Matter Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-red-500 to-rose-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Why Broken Links Matter</h2>
            </div>
            
            <div className="max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Broken links aren't just minor annoyances—they have serious consequences for your website's performance, user experience, and business success. Here's why broken links matter:
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">1. User Experience and Trust</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Broken links create frustrating user experiences. When users click on links expecting to find content, encountering error pages damages trust and credibility. Users may assume the website is poorly maintained or unprofessional, leading them to leave and potentially never return. First impressions matter, and broken links create negative first impressions.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">2. SEO and Search Rankings</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Broken links negatively impact SEO in several ways. They waste search engine crawl budget, as crawlers spend time on non-existent pages instead of indexing valuable content. They can reduce the authority passed through internal linking structures. Search engines may view websites with many broken links as poorly maintained, potentially affecting rankings. Regular broken link checking helps maintain healthy internal linking.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">3. Lost Traffic and Revenue</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Broken links directly result in lost traffic and revenue. When links to important pages (product pages, pricing pages, contact pages) are broken, users can't access those pages, preventing conversions and sales. Broken links on landing pages can reduce conversion rates. Broken links on blog posts prevent users from accessing related content, reducing engagement and time on site.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">4. Professional Reputation</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Websites with many broken links appear unprofessional and poorly maintained. This damages brand reputation and credibility. For businesses, broken links suggest a lack of attention to detail and care for users. Regular broken link checking and fixing demonstrates professionalism and commitment to providing a quality user experience.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">5. Mobile User Impact</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Broken links are particularly problematic on mobile devices. Mobile users have less patience and are more likely to abandon sites with errors. Broken links on mobile create extra friction, as users must wait for error pages to load. With mobile traffic often exceeding desktop, ensuring mobile users don't encounter broken links is critical.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">6. Legal and Compliance</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                In some cases, broken links can have legal implications. Broken links to terms of service, privacy policies, or compliance documents can create legal issues. Broken links in contracts or agreements can cause problems. While not always the case, maintaining working links to important legal documents is good practice.
              </p>
            </div>
          </div>
        </section>

        {/* How to Use Broken Link Checker Section */}
        <section id="how" className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-red-500 to-rose-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">How to Use Our Broken Link Checker</h2>
            </div>
            
            <div className="max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-6">
                Our broken link checker makes it easy to find and fix broken links on your website. Follow these simple steps:
              </p>

              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-rose-600 text-white font-bold text-xl shadow-lg mb-4">
                    1
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">Enter URL</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Provide the URL you want to check (e.g., https://example.com) into the input field. You can include or omit https:// - the tool will add it if missing.
                  </p>
                </div>

                <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-rose-600 text-white font-bold text-xl shadow-lg mb-4">
                    2
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">Check Broken Links</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Click the "Check Broken Links" button. Our server will scan the webpage for all links and check each link's status. This typically takes 10-30 seconds depending on the number of links.
                  </p>
                </div>

                <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-rose-600 text-white font-bold text-xl shadow-lg mb-4">
                    3
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">Review Results</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    View the broken link analysis including working links, broken links (404 errors), redirects, and link status codes. Use the results to identify which links need to be fixed.
                  </p>
                </div>

                <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-rose-600 text-white font-bold text-xl shadow-lg mb-4">
                    4
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">Fix Broken Links</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Fix broken links by updating URLs, implementing redirects, or removing dead links. Regular checking helps maintain a healthy website with working links.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Broken Link Prevention Best Practices Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-red-500 to-rose-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Broken Link Prevention Best Practices</h2>
            </div>
            
            <div className="max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Preventing broken links is better than fixing them. Here are best practices for preventing broken links:
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Regular Monitoring</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">•</span>
                      <span>Check for broken links regularly</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">•</span>
                      <span>Set up automated broken link checks</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">•</span>
                      <span>Monitor after content updates</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">•</span>
                      <span>Check after website migrations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">•</span>
                      <span>Review external links periodically</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border-2 border-orange-200 bg-orange-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Proper Redirects</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 font-bold mt-0.5">•</span>
                      <span>Use 301 redirects for moved pages</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 font-bold mt-0.5">•</span>
                      <span>Implement redirects before deleting pages</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 font-bold mt-0.5">•</span>
                      <span>Update internal links after moves</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 font-bold mt-0.5">•</span>
                      <span>Test redirects after implementation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 font-bold mt-0.5">•</span>
                      <span>Monitor redirect chains</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Link Management</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Use relative URLs for internal links</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Validate URLs before adding links</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Avoid deep linking to external sites</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Keep link lists up-to-date</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Document important links</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border-2 border-green-200 bg-green-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Content Management</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold mt-0.5">•</span>
                      <span>Check links before publishing content</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold mt-0.5">•</span>
                      <span>Update links when updating content</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold mt-0.5">•</span>
                      <span>Review links during content audits</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold mt-0.5">•</span>
                      <span>Train team on link best practices</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold mt-0.5">•</span>
                      <span>Use link validation tools in workflows</span>
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
            <Link href="/tools/web-tools" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-red-300 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-rose-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🌐</span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">All Web Tools</p>
                  <p className="text-xs text-slate-500">Browse Category</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">Discover all web tools for website analysis, testing, and security.</p>
              <p className="mt-4 text-sm font-semibold text-red-600 group-hover:text-red-700">Browse tools →</p>
            </Link>

            <Link href="/web-tools/uptime-monitor" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-red-300 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">📊</span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">Website Uptime Monitor</p>
                  <p className="text-xs text-slate-500">Availability Check</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">Monitor website uptime and availability in real-time.</p>
              <p className="mt-4 text-sm font-semibold text-red-600 group-hover:text-red-700">Monitor uptime →</p>
            </Link>

            <Link href="/web-tools/accessibility-checker" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-red-300 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">♿</span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">Website Accessibility Checker</p>
                  <p className="text-xs text-slate-500">WCAG Compliance</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">Check website accessibility and WCAG compliance.</p>
              <p className="mt-4 text-sm font-semibold text-red-600 group-hover:text-red-700">Check accessibility →</p>
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

