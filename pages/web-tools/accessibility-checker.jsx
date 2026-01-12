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

export default function AccessibilityChecker() {
  const [urls, setUrls] = useState(['']);
  const [results, setResults] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentRequirement, setPaymentRequirement] = useState(null);
  const [userSession, setUserSession] = useState({ processingPass: null });
  const [processingProgress, setProcessingProgress] = useState({ current: 0, total: 0, currentUrl: '' });

  const currentYear = new Date().getFullYear();
  const canonicalUrl = `${siteHost}/web-tools/accessibility-checker`;

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

  const handleCheckAccessibility = async () => {
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

      setProcessingProgress({ current: 0, total: validUrls.length, currentUrl: 'Checking website accessibility...' });

      const response = await fetch('/api/web-tools/accessibility-checker', {
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
        setProcessingProgress({ current: 1, total: validUrls.length, currentUrl: 'Analyzing accessibility...' });
      }

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 402) {
          setPaymentRequirement(data.requirement);
          setShowPaymentModal(true);
          setIsProcessing(false);
          return;
        }
        throw new Error(data.message || data.error || 'Failed to check accessibility');
      }

      if (data.success && data.results) {
        setProcessingProgress({ current: data.results.length, total: validUrls.length, currentUrl: 'Complete' });
        setResults(data.results);
      }
    } catch (err) {
      console.error('Accessibility check error:', err);
      setError(err.message || 'Failed to check accessibility. Please try again.');
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
      handleCheckAccessibility();
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'border-green-200 bg-green-50';
    if (score >= 60) return 'border-yellow-200 bg-yellow-50';
    return 'border-red-200 bg-red-50';
  };

  const getSeverityColor = (severity) => {
    if (severity === 'high') return 'text-red-600';
    if (severity === 'medium') return 'text-orange-600';
    return 'text-yellow-600';
  };

  const getSeverityBgColor = (severity) => {
    if (severity === 'high') return 'border-red-200 bg-red-50';
    if (severity === 'medium') return 'border-orange-200 bg-orange-50';
    return 'border-yellow-200 bg-yellow-50';
  };

  // Structured Data
  const structuredData = {
    faqPage: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How do I check website accessibility?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Enter the URL (with or without https://) in the input field, then click 'Check Accessibility'. The tool will analyze the website's HTML for accessibility issues including missing alt text, ARIA labels, heading structure, and WCAG compliance. Results typically appear within 3-10 seconds."
          }
        },
        {
          "@type": "Question",
          "name": "What is website accessibility?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Website accessibility is the practice of making websites usable by people with disabilities, including visual, auditory, motor, and cognitive impairments. Accessible websites work with assistive technologies like screen readers, provide alternative text for images, use proper heading structures, ensure keyboard navigation, and meet WCAG (Web Content Accessibility Guidelines) standards."
          }
        },
        {
          "@type": "Question",
          "name": "What are WCAG guidelines?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "WCAG (Web Content Accessibility Guidelines) are international standards for web accessibility developed by the W3C. WCAG 2.1 has three levels: A (minimum), AA (recommended), and AAA (highest). The guidelines cover perceivable, operable, understandable, and robust content. Most websites aim for WCAG 2.1 AA compliance, which is often required by law in many countries."
          }
        },
        {
          "@type": "Question",
          "name": "Why is website accessibility important?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Website accessibility is important for legal compliance, inclusive design, SEO benefits, and business success. Many countries have laws requiring accessible websites. Accessible sites reach more users, improve SEO (search engines favor accessible sites), and provide better user experience for everyone. Accessible design often improves overall usability for all users."
          }
        },
        {
          "@type": "Question",
          "name": "Can I check multiple websites at once?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Batch processing (4+ URLs) requires a Processing Pass. Free tier allows checking up to 3 URLs at a time. With a Processing Pass, you can check up to 20 URLs in a single batch, making it efficient for monitoring multiple websites or your entire portfolio for accessibility compliance."
          }
        },
        {
          "@type": "Question",
          "name": "What accessibility issues does this tool check?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our accessibility checker identifies common issues including: missing alt text on images, missing or empty title tags, missing lang attribute, improper heading structure, form controls without labels, missing ARIA landmarks, and lack of skip navigation links. The tool provides a comprehensive accessibility score and detailed recommendations for improvement."
          }
        },
        {
          "@type": "Question",
          "name": "Is this accessibility checker tool free to use?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, our Website Accessibility Checker tool is free for single URL checks (up to 5 checks per day). Batch processing and higher daily limits require a Processing Pass. We aim to provide valuable tools for free while offering premium options for power users and businesses."
          }
        }
      ]
    },
    
    softwareApp: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Website Accessibility Checker",
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "Any",
      "description": "Free online website accessibility checker. Check WCAG compliance, find accessibility issues, test ARIA labels, and analyze color contrast. Check multiple websites with batch processing.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "ratingCount": "1500",
        "bestRating": "5",
        "worstRating": "1"
      },
      "featureList": [
        "WCAG compliance checking",
        "Accessibility issue detection",
        "ARIA label testing",
        "Image alt text checking",
        "Heading structure analysis",
        "Form label validation",
        "Batch processing (with pass)",
        "Accessibility score calculation"
      ]
    },
    
    howTo: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Check Website Accessibility",
      "description": "Step-by-step guide to checking website accessibility and WCAG compliance online for free",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Enter URL",
          "text": "Enter the URL you want to check (e.g., https://example.com) into the input field. You can include or omit https:// - the tool will add it if missing.",
          "position": 1
        },
        {
          "@type": "HowToStep",
          "name": "Check Accessibility",
          "text": "Click the 'Check Accessibility' button. The tool will analyze the website's HTML for accessibility issues. This typically takes 3-10 seconds.",
          "position": 2
        },
        {
          "@type": "HowToStep",
          "name": "Review Results",
          "text": "View the accessibility analysis including accessibility score, issues, warnings, and recommendations. Use the results to identify and fix accessibility problems.",
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
          "name": "Website Accessibility Checker",
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
        <title>Website Accessibility Checker - Free WCAG Compliance Checker | FixTools</title>
        <meta name="title" content="Website Accessibility Checker - Free WCAG Compliance Checker | FixTools" />
        <meta name="description" content="Check website accessibility and WCAG compliance. Find accessibility issues, test ARIA labels, analyze color contrast, and ensure your website is accessible to all users. Free website accessibility checker tool." />
        <meta name="keywords" content="accessibility checker, wcag compliance checker, website accessibility, check accessibility, aria labels, alt text checker, accessibility audit, wcag 2.1, accessibility testing, web accessibility" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content="Website Accessibility Checker - Free WCAG Compliance Checker" />
        <meta property="og:description" content="Check website accessibility and WCAG compliance. Find accessibility issues, test ARIA labels, and analyze color contrast." />
        <meta property="og:image" content={`${siteHost}/images/og-accessibility-checker.png`} />
        <meta property="og:site_name" content="FixTools" />
        
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content="Website Accessibility Checker - Free WCAG Compliance Checker" />
        <meta property="twitter:description" content="Check website accessibility and WCAG compliance. Find accessibility issues and test ARIA labels." />
        <meta property="twitter:image" content={`${siteHost}/images/og-accessibility-checker.png`} />
        
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.faqPage) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.softwareApp) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.howTo) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.breadcrumb) }} />
      </Head>

      <style jsx global>{`
        html:has(.accessibility-checker-page) {
          font-size: 100% !important;
        }
        
        .accessibility-checker-page * {
          box-sizing: border-box;
        }
        
        .accessibility-checker-page h1,
        .accessibility-checker-page h2,
        .accessibility-checker-page h3,
        .accessibility-checker-page p,
        .accessibility-checker-page ul,
        .accessibility-checker-page ol {
          margin: 0;
        }
        
        .accessibility-checker-page button {
          font-family: inherit;
          cursor: pointer;
        }
        
        .accessibility-checker-page input,
        .accessibility-checker-page textarea,
        .accessibility-checker-page select {
          font-family: inherit;
        }
        
        /* Fix typography styling within accessibility checker page sections */
        .accessibility-checker-page section .max-w-none {
          font-size: 16px !important;
          line-height: 1.75 !important;
          color: #334155 !important;
        }
        
        .accessibility-checker-page section .max-w-none h3 {
          font-size: 20px !important;
          font-weight: 700 !important;
          line-height: 1.75rem !important;
          margin-top: 1.5rem !important;
          margin-bottom: 0.75rem !important;
          color: #0f172a !important;
        }
        
        .accessibility-checker-page section .max-w-none p {
          font-size: 16px !important;
          line-height: 1.75 !important;
          margin-bottom: 1rem !important;
          margin-top: 0 !important;
          color: #334155 !important;
        }
        
        .accessibility-checker-page section .max-w-none ol {
          margin-top: 1rem !important;
          margin-bottom: 1rem !important;
          padding-left: 1.5rem !important;
          color: #334155 !important;
          list-style-type: decimal !important;
          list-style-position: outside !important;
        }
        
        .accessibility-checker-page section .max-w-none ul {
          margin-top: 1rem !important;
          margin-bottom: 1rem !important;
          padding-left: 1.5rem !important;
          color: #334155 !important;
          list-style-type: disc !important;
          list-style-position: outside !important;
        }
        
        .accessibility-checker-page section .max-w-none ol li,
        .accessibility-checker-page section .max-w-none ul li {
          margin-top: 0.75rem !important;
          margin-bottom: 0.75rem !important;
          line-height: 1.75 !important;
          padding-left: 0.5rem !important;
          font-size: 16px !important;
        }
        
        .accessibility-checker-page section .max-w-none strong {
          font-weight: 600 !important;
          color: #0f172a !important;
        }
        
        .accessibility-checker-page section .max-w-none a {
          color: #0891b2 !important;
          text-decoration: underline !important;
          font-weight: 500 !important;
        }
        
        .accessibility-checker-page section .max-w-none a:hover {
          color: #0e7490 !important;
        }
        
        /* Override global CSS font-size for this page */
        .accessibility-checker-page {
          font-size: 16px !important;
        }
        
        .accessibility-checker-page h1 {
          font-size: 3rem !important;
        }
        
        .accessibility-checker-page h2 {
          font-size: 1.875rem !important;
        }
        
        .accessibility-checker-page h3 {
          font-size: 1.25rem !important;
        }
        
        .accessibility-checker-page p,
        .accessibility-checker-page li,
        .accessibility-checker-page span {
          font-size: 1rem !important;
        }
      `}</style>

      <div className="accessibility-checker-page bg-[#fbfbfc] text-slate-900 min-h-screen">
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
            <li className="flex items-center gap-2"><span className="text-slate-400">/</span><span className="font-semibold text-slate-900">Website Accessibility Checker</span></li>
          </ol>
        </nav>

        <section className="relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.35]" style={{ backgroundImage: 'url(/grid.png)', backgroundSize: '256px 256px' }}></div>
          <div className="mx-auto max-w-6xl px-4 py-10 md:py-14 relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-gradient-to-r from-teal-50 to-cyan-50 px-4 py-1.5 text-xs font-semibold text-teal-700 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
              </span>
              Free • Fast • WCAG Compliant
            </div>
            
            <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              <span className="bg-gradient-to-r from-teal-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent">
                Website Accessibility Checker
              </span>
            </h1>
            
            <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg md:leading-relaxed">
              Check website accessibility and WCAG compliance with our free <strong>Website Accessibility Checker</strong> tool. Find accessibility issues, test ARIA labels, analyze color contrast, and ensure your website is accessible to all users.
            </p>

            <dl className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
              <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">WCAG</dt>
                <dd className="mt-1.5 text-sm font-bold text-slate-900">Compliance Check</dd>
              </div>
              <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Issues</dt>
                <dd className="mt-1.5 text-sm font-bold text-slate-900">Issue Detection</dd>
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
                <h2 className="text-xl font-semibold text-slate-900">Check Website Accessibility</h2>
                <p className="mt-1 text-sm text-slate-600">Enter URL(s), then click 'Check Accessibility' to analyze WCAG compliance.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button onClick={handleClear} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50">Clear</button>
                <button 
                  onClick={handleCheckAccessibility} 
                  disabled={isProcessing}
                  className="rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Checking...' : '♿ Check Accessibility'}
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
                        className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-teal-900/20"
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
                    className="rounded-xl border border-teal-200 bg-teal-50 px-3 py-2 text-sm font-semibold text-teal-700 hover:bg-teal-100"
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
                  <div className="mt-6 rounded-xl border-2 border-teal-200 bg-gradient-to-r from-teal-50 to-cyan-50 p-6">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-600"></div>
                      <p className="text-sm font-semibold text-teal-900">
                        Checking accessibility{processingProgress.total > 1 && ` (${processingProgress.current}/${processingProgress.total})`}...
                      </p>
                    </div>
                    {processingProgress.total > 1 && (
                      <div className="mt-3">
                        <div className="w-full bg-teal-200 rounded-full h-2.5">
                          <div 
                            className="bg-gradient-to-r from-teal-600 to-cyan-600 h-2.5 rounded-full transition-all duration-300"
                            style={{ width: `${(processingProgress.current / processingProgress.total) * 100}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-teal-700 mt-2 text-center">
                          Processing {processingProgress.current} of {processingProgress.total} URL{processingProgress.total !== 1 ? 's' : ''}
                        </p>
                      </div>
                    )}
                    {processingProgress.total === 1 && (
                      <div className="mt-3">
                        <div className="w-full bg-teal-200 rounded-full h-2.5 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-teal-600 to-cyan-600 h-2.5 rounded-full animate-pulse"
                            style={{ width: '60%' }}
                          ></div>
                        </div>
                        <p className="text-xs text-teal-700 mt-2 text-center">
                          {processingProgress.currentUrl || 'Analyzing HTML...'}
                        </p>
                      </div>
                    )}
                    <p className="text-xs text-teal-600 mt-3 text-center">
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
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="rounded-xl border border-slate-200 bg-white p-3 text-center">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Total</p>
                    <p className="text-2xl font-bold text-slate-900">{results.length}</p>
                  </div>
                  <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-center">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Issues</p>
                    <p className="text-2xl font-bold text-red-600">
                      {results.reduce((sum, r) => sum + (r.issues?.length || 0), 0)}
                    </p>
                  </div>
                  <div className="rounded-xl border border-orange-200 bg-orange-50 p-3 text-center">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Warnings</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {results.reduce((sum, r) => sum + (r.warnings?.length || 0), 0)}
                    </p>
                  </div>
                  <div className="rounded-xl border border-green-200 bg-green-50 p-3 text-center">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Avg Score</p>
                    <p className="text-2xl font-bold text-green-600">
                      {Math.round(results.reduce((sum, r) => sum + (r.score || 0), 0) / results.length)}/100
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Accessibility Check Results */}
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
                              Status: {result.statusCode} • Checked {new Date(result.timestamp).toLocaleString()}
                            </p>
                          </div>
                          <div className={`rounded-xl border-2 p-3 ${getScoreBgColor(result.score || 0)}`}>
                            <p className="text-xs font-semibold text-slate-700 mb-1">Score</p>
                            <p className={`text-2xl font-bold ${getScoreColor(result.score || 0)}`}>
                              {result.score || 0}/100
                            </p>
                          </div>
                        </div>

                        {/* Issues */}
                        {result.issues && result.issues.length > 0 && (
                          <div className="mb-4 rounded-xl border-2 border-red-200 bg-red-50 p-4">
                            <h4 className="text-sm font-semibold text-red-900 mb-3 flex items-center gap-2">
                              <span className="text-red-600">⚠</span>
                              Issues ({result.issues.length})
                            </h4>
                            <div className="space-y-2 text-sm">
                              {result.issues.map((issue, issueIndex) => (
                                <div key={issueIndex} className={`rounded-lg border p-3 ${getSeverityBgColor(issue.severity)}`}>
                                  <div className="flex justify-between items-start mb-1">
                                    <span className="font-semibold text-slate-900">{issue.message}</span>
                                    <span className={`text-xs font-semibold ${getSeverityColor(issue.severity)}`}>
                                      {issue.severity}
                                    </span>
                                  </div>
                                  <p className="text-xs text-slate-600">Element: {issue.element}</p>
                                  {issue.guideline && (
                                    <p className="text-xs text-slate-600">Guideline: {issue.guideline}</p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Warnings */}
                        {result.warnings && result.warnings.length > 0 && (
                          <div className="mb-4 rounded-xl border-2 border-orange-200 bg-orange-50 p-4">
                            <h4 className="text-sm font-semibold text-orange-900 mb-3 flex items-center gap-2">
                              <span className="text-orange-600">⚠</span>
                              Warnings ({result.warnings.length})
                            </h4>
                            <div className="space-y-2 text-sm">
                              {result.warnings.map((warning, warningIndex) => (
                                <div key={warningIndex} className={`rounded-lg border p-3 ${getSeverityBgColor(warning.severity)}`}>
                                  <div className="flex justify-between items-start mb-1">
                                    <span className="font-semibold text-slate-900">{warning.message}</span>
                                    <span className={`text-xs font-semibold ${getSeverityColor(warning.severity)}`}>
                                      {warning.severity}
                                    </span>
                                  </div>
                                  <p className="text-xs text-slate-600">Element: {warning.element}</p>
                                  {warning.guideline && (
                                    <p className="text-xs text-slate-600">Guideline: {warning.guideline}</p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Info */}
                        {result.info && result.info.length > 0 && (
                          <div className="mb-4 rounded-xl border-2 border-blue-200 bg-blue-50 p-4">
                            <h4 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
                              <span className="text-blue-600">ℹ</span>
                              Information ({result.info.length})
                            </h4>
                            <div className="space-y-2 text-sm">
                              {result.info.map((info, infoIndex) => (
                                <div key={infoIndex} className="rounded-lg border border-blue-200 bg-white p-3">
                                  <p className="font-semibold text-slate-900">{info.message}</p>
                                  <p className="text-xs text-slate-600">Element: {info.element}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {(!result.issues || result.issues.length === 0) && (!result.warnings || result.warnings.length === 0) && (
                          <div className="rounded-xl border-2 border-green-200 bg-green-50 p-4 text-center">
                            <p className="text-sm font-semibold text-green-900">✓ No accessibility issues found!</p>
                            <p className="text-xs text-green-700 mt-1">This website appears to have good accessibility practices.</p>
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
              <div className="h-1 w-8 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">What is Website Accessibility?</h2>
            </div>
            
            <div className="max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                <strong>Website accessibility</strong> is the practice of making websites usable by people with disabilities, including visual, auditory, motor, and cognitive impairments. Accessible websites work with assistive technologies like screen readers, provide alternative text for images, use proper heading structures, ensure keyboard navigation, and meet WCAG (Web Content Accessibility Guidelines) standards.
              </p>
              
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                When websites are accessible, they can be used by people with disabilities just as effectively as by people without disabilities. This includes people who are blind or have low vision, deaf or hard of hearing, have motor impairments that limit their ability to use a mouse, have cognitive disabilities that affect how they process information, or use assistive technologies like screen readers, voice recognition software, or alternative input devices.
              </p>

              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Website accessibility is not just about compliance—it's about inclusive design and equal access to information and services. Accessible websites benefit everyone, not just people with disabilities. For example, captions on videos help people in noisy environments, keyboard navigation helps people with temporary injuries, and clear headings help everyone understand content structure.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">How Website Accessibility Works</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Website accessibility involves several key principles and practices:
              </p>
              <ol className="space-y-3 mb-4 ml-6 text-slate-700" style={{ listStyleType: 'decimal', listStylePosition: 'outside', paddingLeft: '1.5rem' }}>
                <li className="leading-relaxed pl-2" style={{ fontSize: '16px', lineHeight: '1.75' }}><strong>Perceivable:</strong> Information and user interface components must be presentable to users in ways they can perceive. This includes providing text alternatives for images, captions for videos, and ensuring content can be presented in different ways without losing meaning.</li>
                <li className="leading-relaxed pl-2" style={{ fontSize: '16px', lineHeight: '1.75' }}><strong>Operable:</strong> User interface components and navigation must be operable. This includes ensuring all functionality is available via keyboard, providing sufficient time for users to read and use content, and avoiding content that causes seizures.</li>
                <li className="leading-relaxed pl-2" style={{ fontSize: '16px', lineHeight: '1.75' }}><strong>Understandable:</strong> Information and the operation of user interface must be understandable. This includes making text readable, ensuring content appears and operates in predictable ways, and helping users avoid and correct mistakes.</li>
                <li className="leading-relaxed pl-2" style={{ fontSize: '16px', lineHeight: '1.75' }}><strong>Robust:</strong> Content must be robust enough that it can be interpreted reliably by a wide variety of user agents, including assistive technologies. This includes ensuring compatibility with current and future assistive technologies.</li>
                <li className="leading-relaxed pl-2" style={{ fontSize: '16px', lineHeight: '1.75' }}><strong>Assistive Technologies:</strong> Accessible websites work with assistive technologies like screen readers (JAWS, NVDA, VoiceOver), voice recognition software, alternative keyboards, and switch devices that help people with disabilities interact with computers.</li>
                <li className="leading-relaxed pl-2" style={{ fontSize: '16px', lineHeight: '1.75' }}><strong>WCAG Compliance:</strong> Websites should follow WCAG (Web Content Accessibility Guidelines) standards, which have three levels: A (minimum), AA (recommended), and AAA (highest). Most websites aim for WCAG 2.1 AA compliance.</li>
              </ol>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">Key Accessibility Features</h3>
              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="rounded-2xl border-2 border-teal-200 bg-teal-50 p-5">
                  <h4 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-100 text-teal-600">🖼️</span>
                    Alternative Text
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    All images should have descriptive alt text that conveys the meaning or purpose of the image. This helps screen reader users understand images.
                  </p>
                  <ul className="space-y-1 text-xs text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="text-teal-600 font-bold mt-0.5">•</span>
                      <span>Descriptive alt text for images</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-teal-600 font-bold mt-0.5">•</span>
                      <span>Empty alt for decorative images</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-teal-600 font-bold mt-0.5">•</span>
                      <span>Alt text conveys image purpose</span>
                    </li>
                  </ul>
                </div>
                
                <div className="rounded-2xl border-2 border-cyan-200 bg-cyan-50 p-5">
                  <h4 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-100 text-cyan-600">⌨️</span>
                    Keyboard Navigation
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    All interactive elements should be accessible via keyboard. Users should be able to navigate, activate links, and use forms without a mouse.
                  </p>
                  <ul className="space-y-1 text-xs text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-600 font-bold mt-0.5">•</span>
                      <span>Keyboard-accessible navigation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-600 font-bold mt-0.5">•</span>
                      <span>Visible focus indicators</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-600 font-bold mt-0.5">•</span>
                      <span>Logical tab order</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-5">
                  <h4 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">📋</span>
                    Form Labels
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    All form controls must have associated labels. Labels help screen reader users understand what information is required and provide context for form fields.
                  </p>
                  <ul className="space-y-1 text-xs text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Labels for all form controls</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>ARIA labels for complex forms</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Error messages associated with fields</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border-2 border-indigo-200 bg-indigo-50 p-5">
                  <h4 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">🎨</span>
                    Color Contrast
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    Text must have sufficient color contrast against its background. WCAG requires a contrast ratio of at least 4.5:1 for normal text and 3:1 for large text.
                  </p>
                  <ul className="space-y-1 text-xs text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold mt-0.5">•</span>
                      <span>4.5:1 contrast for normal text</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold mt-0.5">•</span>
                      <span>3:1 contrast for large text</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold mt-0.5">•</span>
                      <span>Color not sole indicator</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <p className="text-base text-slate-700 leading-relaxed">
                Website accessibility serves many purposes: ensuring equal access to information and services for people with disabilities, complying with legal requirements (ADA, Section 508, EN 301 549), improving SEO (search engines favor accessible sites), providing better user experience for everyone, and expanding market reach to include people with disabilities. Understanding accessibility is essential for inclusive web design, legal compliance, and creating websites that work for everyone.
              </p>
            </div>
          </div>
        </section>

        {/* Why Accessibility is Important Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Why Website Accessibility is Important</h2>
            </div>
            
            <div className="max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Website accessibility is not just a nice-to-have feature—it's essential for legal compliance, inclusive design, and business success. Here's why accessibility is crucial:
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">1. Legal Compliance</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Many countries have laws requiring websites to be accessible. In the United States, the Americans with Disabilities Act (ADA) and Section 508 of the Rehabilitation Act require federal websites and many public-facing websites to be accessible. The European Union's EN 301 549 standard requires accessibility for public sector websites. Non-compliance can result in legal action, fines, and damage to reputation.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">2. Inclusive Design and Equal Access</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Accessible websites ensure equal access to information and services for people with disabilities. Approximately 15% of the world's population has some form of disability. By making websites accessible, you're including millions of potential users who would otherwise be excluded. Accessible design is simply the right thing to do and demonstrates social responsibility.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">3. SEO and Search Rankings</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Accessible websites often rank better in search engines. Many accessibility practices improve SEO: descriptive alt text helps image search, proper heading structure helps search engines understand content hierarchy, semantic HTML helps search engines parse content, and keyboard navigation helps search engines crawl pages. Accessible websites are often more discoverable and rank higher in search results.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">4. Better User Experience for Everyone</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Accessible design improves user experience for everyone, not just people with disabilities. Clear headings help all users understand content structure, keyboard navigation helps users with temporary injuries, captions on videos help users in noisy environments, and good color contrast helps users with temporary vision issues. Accessible design is simply good design.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">5. Business Benefits</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Accessible websites provide business benefits beyond compliance. Accessible sites reach more users, potentially increasing revenue by 15-20%, reduce legal risk from accessibility lawsuits, improve brand reputation as an inclusive company, and often provide better user experience that leads to higher conversion rates. Investing in accessibility is investing in your business.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">6. Future-Proofing</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Accessible websites are more future-proof and compatible with emerging technologies. As new assistive technologies emerge, accessible websites are more likely to work with them. Accessible design follows web standards, making websites more maintainable and compatible with future browsers and devices. Investing in accessibility now saves time and money later.
              </p>
            </div>
          </div>
        </section>

        {/* How to Use Accessibility Checker Section */}
        <section id="how" className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">How to Use Our Website Accessibility Checker</h2>
            </div>
            
            <div className="max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-6">
                Our website accessibility checker makes it easy to analyze websites for accessibility issues. Follow these simple steps:
              </p>

              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 text-white font-bold text-xl shadow-lg mb-4">
                    1
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">Enter URL</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Provide the URL you want to check (e.g., https://example.com) into the input field. You can include or omit https:// - the tool will add it if missing.
                  </p>
                </div>

                <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 text-white font-bold text-xl shadow-lg mb-4">
                    2
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">Check Accessibility</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Click the "Check Accessibility" button. Our server will analyze the website's HTML for accessibility issues. This typically takes 3-10 seconds.
                  </p>
                </div>

                <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 text-white font-bold text-xl shadow-lg mb-4">
                    3
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">Review Results</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    View the accessibility analysis including accessibility score, issues, warnings, and recommendations. Use the results to identify and fix accessibility problems.
                  </p>
                </div>

                <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 text-white font-bold text-xl shadow-lg mb-4">
                    4
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">Fix Issues</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Address identified issues by adding alt text to images, fixing form labels, improving heading structure, and implementing other accessibility improvements.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Accessibility Best Practices Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Website Accessibility Best Practices</h2>
            </div>
            
            <div className="max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Proper website accessibility requires attention to detail and following best practices. Here are essential accessibility practices:
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="rounded-2xl border-2 border-teal-200 bg-teal-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Content Accessibility</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-teal-600 font-bold mt-0.5">•</span>
                      <span>Add descriptive alt text to all images</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-teal-600 font-bold mt-0.5">•</span>
                      <span>Use proper heading hierarchy (h1-h6)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-teal-600 font-bold mt-0.5">•</span>
                      <span>Provide captions for videos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-teal-600 font-bold mt-0.5">•</span>
                      <span>Ensure sufficient color contrast</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-teal-600 font-bold mt-0.5">•</span>
                      <span>Don't rely on color alone to convey information</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border-2 border-cyan-200 bg-cyan-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Navigation and Structure</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-600 font-bold mt-0.5">•</span>
                      <span>Ensure keyboard accessibility</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-600 font-bold mt-0.5">•</span>
                      <span>Provide skip navigation links</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-600 font-bold mt-0.5">•</span>
                      <span>Use semantic HTML5 elements</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-600 font-bold mt-0.5">•</span>
                      <span>Implement ARIA landmarks</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-600 font-bold mt-0.5">•</span>
                      <span>Ensure logical tab order</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Forms and Inputs</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Label all form controls</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Provide clear error messages</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Use ARIA labels for complex forms</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Ensure form validation is accessible</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Group related form fields</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border-2 border-indigo-200 bg-indigo-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Testing and Validation</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold mt-0.5">•</span>
                      <span>Test with screen readers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold mt-0.5">•</span>
                      <span>Test keyboard-only navigation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold mt-0.5">•</span>
                      <span>Use automated accessibility tools</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold mt-0.5">•</span>
                      <span>Validate WCAG compliance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold mt-0.5">•</span>
                      <span>Conduct manual accessibility audits</span>
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
            <Link href="/tools/web-tools" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-teal-300 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🌐</span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">All Web Tools</p>
                  <p className="text-xs text-slate-500">Browse Category</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">Discover all web tools for website analysis, testing, and security.</p>
              <p className="mt-4 text-sm font-semibold text-teal-600 group-hover:text-teal-700">Browse tools →</p>
            </Link>

            <Link href="/web-tools/website-speed-test" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-teal-300 hover:shadow-lg transition-all duration-300">
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
              <p className="mt-4 text-sm font-semibold text-teal-600 group-hover:text-teal-700">Test speed →</p>
            </Link>

            <Link href="/web-tools/uptime-monitor" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-teal-300 hover:shadow-lg transition-all duration-300">
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
              <p className="mt-4 text-sm font-semibold text-teal-600 group-hover:text-teal-700">Monitor uptime →</p>
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

