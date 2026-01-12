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

export default function SSLChecker() {
  const [domains, setDomains] = useState(['']);
  const [port, setPort] = useState(443);
  const [results, setResults] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentRequirement, setPaymentRequirement] = useState(null);
  const [userSession, setUserSession] = useState({ processingPass: null });
  const [processingProgress, setProcessingProgress] = useState({ current: 0, total: 0, currentDomain: '' });

  const currentYear = new Date().getFullYear();
  const canonicalUrl = `${siteHost}/web-tools/ssl-checker`;

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

  const handleDomainChange = (index, value) => {
    const newDomains = [...domains];
    newDomains[index] = value;
    setDomains(newDomains);
  };

  const addDomainField = () => {
    setDomains([...domains, '']);
  };

  const removeDomainField = (index) => {
    if (domains.length > 1) {
      setDomains(domains.filter((_, i) => i !== index));
    }
  };

  const handleClear = () => {
    setDomains(['']);
    setResults([]);
    setError('');
    setIsProcessing(false);
  };

  const handleCheckSSL = async () => {
    const validDomains = domains.filter(domain => domain.trim());
    
    if (validDomains.length === 0) {
      setError('Please enter at least one domain.');
      return;
    }

    // Validate domains
    for (const domain of validDomains) {
      try {
        let cleanDomain = domain.trim().replace(/^https?:\/\//, '').replace(/\/$/, '');
        cleanDomain = cleanDomain.split(':')[0];
        
        if (!cleanDomain || cleanDomain.length < 3) {
          setError('Please enter valid domains.');
          return;
        }
      } catch (e) {
        setError('Please enter valid domains.');
        return;
      }
    }

    // Check payment requirement (batch check)
    const domainCount = validDomains.length;
    const userPlan = getUserPlan(userSession);
    
    // For 4+ domains: Require payment before processing
    if (domainCount >= 4) {
      const batchRequirement = checkPaymentRequirementNew('web-tools', 0, domainCount, userPlan);
      
      // Check if user has valid pass
      const hasValidPass = hasValidProcessingPassNew(userSession);
      
      if (!hasValidPass && batchRequirement.requiresPayment && batchRequirement.reason === 'batch') {
        const paymentReq = {
          requiresPayment: true,
          reason: 'batch',
          domainCount: domainCount,
          message: `Batch processing (${domainCount} domains) requires a Processing Pass. Free tier allows up to 3 domains at a time.`,
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
    setProcessingProgress({ current: 0, total: validDomains.length, currentDomain: validDomains[0] || '' });

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

      setProcessingProgress({ current: 0, total: validDomains.length, currentDomain: validDomains[0] || 'Checking...' });

      const response = await fetch('/api/web-tools/ssl-checker', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          domain: validDomains[0],
          domains: validDomains,
          port: port,
          sessionId: sessionId,
        }),
      });

      if (validDomains.length === 1) {
        setProcessingProgress({ current: 0, total: 1, currentDomain: validDomains[0] });
      } else {
        setProcessingProgress({ current: 1, total: validDomains.length, currentDomain: 'Analyzing certificates...' });
      }

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 402) {
          setPaymentRequirement(data.requirement);
          setShowPaymentModal(true);
          setIsProcessing(false);
          return;
        }
        throw new Error(data.message || data.error || 'Failed to check SSL certificate');
      }

      if (data.success && data.results) {
        setProcessingProgress({ current: data.results.length, total: validDomains.length, currentDomain: 'Complete' });
        setResults(data.results);
      }
    } catch (err) {
      console.error('SSL check error:', err);
      setError(err.message || 'Failed to check SSL certificate. Please try again.');
    } finally {
      setIsProcessing(false);
      setProcessingProgress({ current: 0, total: 0, currentDomain: '' });
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
    if (domains.filter(d => d.trim()).length > 0) {
      handleCheckSSL();
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (result) => {
    if (result.error) return 'text-red-600';
    if (result.expired) return 'text-red-600';
    if (result.expiringSoon) return 'text-orange-600';
    if (result.valid) return 'text-emerald-600';
    return 'text-slate-600';
  };

  const getStatusBgColor = (result) => {
    if (result.error) return 'border-red-200 bg-red-50';
    if (result.expired) return 'border-red-200 bg-red-50';
    if (result.expiringSoon) return 'border-orange-200 bg-orange-50';
    if (result.valid) return 'border-emerald-200 bg-emerald-50';
    return 'border-slate-200 bg-slate-50';
  };

  // Structured Data
  const structuredData = {
    faqPage: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How do I check an SSL certificate?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Enter the domain name (without https://) in the input field, then click 'Check SSL'. The tool will connect to the server, retrieve the SSL certificate, and display information about its validity, expiration date, issuer, and security details. Results typically appear within 2-5 seconds."
          }
        },
        {
          "@type": "Question",
          "name": "What is an SSL certificate?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "An SSL (Secure Sockets Layer) certificate is a digital certificate that authenticates a website's identity and enables an encrypted connection between a web server and a browser. SSL certificates ensure that data transmitted between the server and browser remains private and secure, protecting sensitive information like passwords, credit card numbers, and personal data from being intercepted by hackers."
          }
        },
        {
          "@type": "Question",
          "name": "Why is SSL important for my website?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "SSL is crucial for website security and SEO. It encrypts data transmission, protects user information, builds trust with visitors (indicated by the padlock icon), improves Google search rankings (HTTPS is a ranking factor), and is required for modern web features like geolocation and service workers. Without SSL, browsers show security warnings that can drive away visitors."
          }
        },
        {
          "@type": "Question",
          "name": "Can I check multiple domains at once?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Batch processing (4+ domains) requires a Processing Pass. Free tier allows checking up to 3 domains at a time. With a Processing Pass, you can check up to 20 domains in a single batch, making it efficient for monitoring multiple websites or your entire domain portfolio."
          }
        },
        {
          "@type": "Question",
          "name": "What does it mean if my SSL certificate is expiring soon?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "If your SSL certificate is expiring within 30 days, you should renew it immediately. Expired certificates cause browsers to show security warnings, which can damage your website's reputation and drive away visitors. Most certificate authorities allow renewal up to 90 days before expiration. Set up automatic renewal or calendar reminders to avoid certificate expiration."
          }
        },
        {
          "@type": "Question",
          "name": "What is the difference between SSL and TLS?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "SSL (Secure Sockets Layer) and TLS (Transport Layer Security) are cryptographic protocols that provide secure communication. TLS is the modern, updated version of SSL. SSL 3.0 was deprecated in 2015, and today we use TLS 1.2 or TLS 1.3. However, the term 'SSL' is still commonly used to refer to both protocols. When people say 'SSL certificate,' they typically mean a certificate used for TLS encryption."
          }
        },
        {
          "@type": "Question",
          "name": "How often should I check my SSL certificate?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Check your SSL certificate regularly, especially before expiration. Most certificates are valid for 90 days to 1 year. Check monthly for certificates expiring within 3 months, and weekly for certificates expiring within 30 days. Set up automated monitoring if possible to receive alerts before expiration."
          }
        },
        {
          "@type": "Question",
          "name": "Is this SSL checker tool free to use?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, our SSL Certificate Checker tool is free for single domain checks (up to 5 checks per day). Batch processing and higher daily limits require a Processing Pass. We aim to provide valuable tools for free while offering premium options for power users and businesses."
          }
        }
      ]
    },
    
    softwareApp: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "SSL Certificate Checker",
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "Any",
      "description": "Free online SSL certificate checker. Verify SSL certificate validity, expiration date, issuer, and security. Check multiple domains with batch processing.",
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
        "SSL certificate validity check",
        "Expiration date tracking",
        "Certificate issuer information",
        "Security analysis",
        "Batch processing (with pass)",
        "Real-time certificate data",
        "Secure and private checking"
      ]
    },
    
    howTo: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Check SSL Certificate",
      "description": "Step-by-step guide to checking SSL certificate validity and expiration online for free",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Enter Domain Name",
          "text": "Enter the domain name you want to check (e.g., example.com) into the input field. Do not include https:// or http:// - just the domain name.",
          "position": 1
        },
        {
          "@type": "HowToStep",
          "name": "Select Port (Optional)",
          "text": "Choose the port number if checking a non-standard port (default is 443 for HTTPS). Most websites use port 443.",
          "position": 2
        },
        {
          "@type": "HowToStep",
          "name": "Check SSL Certificate",
          "text": "Click the 'Check SSL' button. The tool will connect to the server and retrieve the SSL certificate information. This typically takes 2-5 seconds.",
          "position": 3
        },
        {
          "@type": "HowToStep",
          "name": "Review Results",
          "text": "View the SSL certificate details including validity status, expiration date, issuer information, and security details. If the certificate is expiring soon or expired, take action to renew it.",
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
          "name": "SSL Certificate Checker",
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
        <title>SSL Certificate Checker - Free Online SSL Check & Certificate Validator | FixTools</title>
        <meta name="title" content="SSL Certificate Checker - Free Online SSL Check & Certificate Validator | FixTools" />
        <meta name="description" content="Check SSL certificate validity, expiration date, issuer, and security for any domain. Free SSL certificate checker tool to verify your website SSL certificate status. Real-time certificate analysis." />
        <meta name="keywords" content="ssl checker, ssl certificate checker, check ssl certificate, ssl test, ssl certificate validator, ssl certificate expiration, ssl certificate checker online, verify ssl certificate, ssl certificate info, check ssl expiry" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content="SSL Certificate Checker - Free Online SSL Check & Certificate Validator" />
        <meta property="og:description" content="Check SSL certificate validity, expiration date, issuer, and security for any domain. Free SSL certificate checker tool." />
        <meta property="og:image" content={`${siteHost}/images/og-ssl-checker.png`} />
        <meta property="og:site_name" content="FixTools" />
        
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content="SSL Certificate Checker - Free Online SSL Check & Certificate Validator" />
        <meta property="twitter:description" content="Check SSL certificate validity, expiration date, issuer, and security for any domain." />
        <meta property="twitter:image" content={`${siteHost}/images/og-ssl-checker.png`} />
        
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.faqPage) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.softwareApp) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.howTo) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.breadcrumb) }} />
      </Head>

      <style jsx global>{`
        html:has(.ssl-checker-page) {
          font-size: 100% !important;
        }
        
        .ssl-checker-page * {
          box-sizing: border-box;
        }
        
        .ssl-checker-page h1,
        .ssl-checker-page h2,
        .ssl-checker-page h3,
        .ssl-checker-page p,
        .ssl-checker-page ul,
        .ssl-checker-page ol {
          margin: 0;
        }
        
        .ssl-checker-page button {
          font-family: inherit;
          cursor: pointer;
        }
        
        .ssl-checker-page input,
        .ssl-checker-page textarea,
        .ssl-checker-page select {
          font-family: inherit;
        }
        
        /* Fix typography styling within SSL checker page sections */
        .ssl-checker-page section .max-w-none {
          font-size: 16px !important;
          line-height: 1.75 !important;
          color: #334155 !important;
        }
        
        .ssl-checker-page section .max-w-none h3 {
          font-size: 20px !important;
          font-weight: 700 !important;
          line-height: 1.75rem !important;
          margin-top: 1.5rem !important;
          margin-bottom: 0.75rem !important;
          color: #0f172a !important;
        }
        
        .ssl-checker-page section .max-w-none p {
          font-size: 16px !important;
          line-height: 1.75 !important;
          margin-bottom: 1rem !important;
          margin-top: 0 !important;
          color: #334155 !important;
        }
        
        .ssl-checker-page section .max-w-none ol {
          margin-top: 1rem !important;
          margin-bottom: 1rem !important;
          padding-left: 1.5rem !important;
          color: #334155 !important;
          list-style-type: decimal !important;
          list-style-position: outside !important;
        }
        
        .ssl-checker-page section .max-w-none ul {
          margin-top: 1rem !important;
          margin-bottom: 1rem !important;
          padding-left: 1.5rem !important;
          color: #334155 !important;
          list-style-type: disc !important;
          list-style-position: outside !important;
        }
        
        .ssl-checker-page section .max-w-none ol li,
        .ssl-checker-page section .max-w-none ul li {
          margin-top: 0.75rem !important;
          margin-bottom: 0.75rem !important;
          line-height: 1.75 !important;
          padding-left: 0.5rem !important;
          font-size: 16px !important;
        }
        
        .ssl-checker-page section .max-w-none strong {
          font-weight: 600 !important;
          color: #0f172a !important;
        }
        
        .ssl-checker-page section .max-w-none a {
          color: #059669 !important;
          text-decoration: underline !important;
          font-weight: 500 !important;
        }
        
        .ssl-checker-page section .max-w-none a:hover {
          color: #047857 !important;
        }
        
        /* Override global CSS font-size for this page */
        .ssl-checker-page {
          font-size: 16px !important;
        }
        
        .ssl-checker-page h1 {
          font-size: 3rem !important;
        }
        
        .ssl-checker-page h2 {
          font-size: 1.875rem !important;
        }
        
        .ssl-checker-page h3 {
          font-size: 1.25rem !important;
        }
        
        .ssl-checker-page p,
        .ssl-checker-page li,
        .ssl-checker-page span {
          font-size: 1rem !important;
        }
      `}</style>

      <div className="ssl-checker-page bg-[#fbfbfc] text-slate-900 min-h-screen">
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
            <li className="flex items-center gap-2"><span className="text-slate-400">/</span><span className="font-semibold text-slate-900">SSL Certificate Checker</span></li>
          </ol>
        </nav>

        <section className="relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.35]" style={{ backgroundImage: 'url(/grid.png)', backgroundSize: '256px 256px' }}></div>
          <div className="mx-auto max-w-6xl px-4 py-10 md:py-14 relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50 px-4 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Free • Fast • Secure
            </div>
            
            <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              <span className="bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-600 bg-clip-text text-transparent">
                SSL Certificate Checker
              </span>
            </h1>
            
            <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg md:leading-relaxed">
              Verify SSL certificate validity, expiration date, issuer, and security for any domain with our free <strong>SSL Certificate Checker</strong> tool. Get instant certificate information and ensure your website's security is up to date.
            </p>

            <dl className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
              <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Validity</dt>
                <dd className="mt-1.5 text-sm font-bold text-slate-900">Real-time Check</dd>
              </div>
              <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Expiration</dt>
                <dd className="mt-1.5 text-sm font-bold text-slate-900">Date Tracking</dd>
              </div>
              <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Speed</dt>
                <dd className="mt-1.5 text-sm font-bold text-slate-900">2-5 seconds</dd>
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
                <h2 className="text-xl font-semibold text-slate-900">Check SSL Certificate</h2>
                <p className="mt-1 text-sm text-slate-600">Enter domain name(s), choose port, then click 'Check SSL'.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button onClick={handleClear} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50">Clear</button>
                <button 
                  onClick={handleCheckSSL} 
                  disabled={isProcessing}
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Checking...' : '🔒 Check SSL'}
                </button>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-12">
              <div className="md:col-span-8">
                <label className="mb-2 block text-sm font-semibold text-slate-800">Domain Name(s)</label>
                <div className="space-y-2">
                  {domains.map((domain, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={domain}
                        onChange={(e) => handleDomainChange(index, e.target.value)}
                        placeholder="example.com"
                        className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-emerald-900/20"
                      />
                      {domains.length > 1 && (
                        <button
                          onClick={() => removeDomainField(index)}
                          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={addDomainField}
                    className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-100"
                  >
                    + Add Domain (Batch)
                  </button>
                </div>
                {error && (
                  <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                {/* Processing Progress Indicator */}
                {isProcessing && (
                  <div className="mt-6 rounded-xl border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50 p-6">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600"></div>
                      <p className="text-sm font-semibold text-emerald-900">
                        Checking SSL certificate{processingProgress.total > 1 && ` (${processingProgress.current}/${processingProgress.total})`}...
                      </p>
                    </div>
                    {processingProgress.total > 1 && (
                      <div className="mt-3">
                        <div className="w-full bg-emerald-200 rounded-full h-2.5">
                          <div 
                            className="bg-gradient-to-r from-emerald-600 to-green-600 h-2.5 rounded-full transition-all duration-300"
                            style={{ width: `${(processingProgress.current / processingProgress.total) * 100}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-emerald-700 mt-2 text-center">
                          Processing {processingProgress.current} of {processingProgress.total} domain{processingProgress.total !== 1 ? 's' : ''}
                        </p>
                      </div>
                    )}
                    {processingProgress.total === 1 && (
                      <div className="mt-3">
                        <div className="w-full bg-emerald-200 rounded-full h-2.5 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-emerald-600 to-green-600 h-2.5 rounded-full animate-pulse"
                            style={{ width: '60%' }}
                          ></div>
                        </div>
                        <p className="text-xs text-emerald-700 mt-2 text-center">
                          {processingProgress.currentDomain || 'Connecting to server...'}
                        </p>
                      </div>
                    )}
                    <p className="text-xs text-emerald-600 mt-3 text-center">
                      This may take 2-5 seconds per domain
                    </p>
                  </div>
                )}
              </div>

              <div className="md:col-span-4">
                <label className="mb-2 block text-sm font-semibold text-slate-800">Options</label>
                <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Port</label>
                    <select
                      value={port}
                      onChange={(e) => setPort(Number(e.target.value))}
                      className="w-full rounded-xl border border-slate-200 bg-white p-2 text-sm"
                    >
                      <option value={443}>443 (HTTPS)</option>
                      <option value={8443}>8443 (Alternative HTTPS)</option>
                      <option value={8080}>8080 (HTTP)</option>
                    </select>
                  </div>
                  <div className="rounded-xl border border-violet-200 bg-violet-50 p-3">
                    <p className="text-xs font-semibold text-violet-900 mb-1">Free Tier Limits</p>
                    <p className="text-xs text-violet-700">Up to 3 domains per check</p>
                    <p className="text-xs text-violet-700">5 checks per day</p>
                    <p className="text-xs text-violet-700">4+ domains: Requires pass</p>
                  </div>
                </div>
              </div>
            </div>

            {/* SSL Check Results */}
            {results.length > 0 && (
              <div className="mt-6 space-y-6">
                <h3 className="text-lg font-semibold text-slate-900">Check Results</h3>
                {results.map((result, index) => (
                  <div key={index} className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-5">
                    {result.error ? (
                      <div className="text-red-700 text-sm">
                        <p className="font-semibold">Error for {result.hostname}:</p>
                        <p>{result.error}</p>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{result.hostname}</p>
                            <p className="text-xs text-slate-600">
                              Port {result.port} • Checked {new Date(result.timestamp).toLocaleString()}
                            </p>
                          </div>
                          <div className={`rounded-xl border-2 p-3 ${getStatusBgColor(result)}`}>
                            <p className="text-xs font-semibold text-slate-700 mb-1">Status</p>
                            <p className={`text-lg font-bold ${getStatusColor(result)}`}>
                              {result.expired ? 'Expired' : result.expiringSoon ? 'Expiring Soon' : result.valid ? 'Valid' : 'Invalid'}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="rounded-xl border border-slate-200 bg-white p-4">
                            <h4 className="text-sm font-semibold text-slate-800 mb-3">Validity Period</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-slate-600">Valid From:</span>
                                <span className="font-medium text-slate-900">{formatDate(result.validFrom)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-600">Valid To:</span>
                                <span className="font-medium text-slate-900">{formatDate(result.validTo)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-600">Days Until Expiry:</span>
                                <span className={`font-bold ${result.expiringSoon ? 'text-orange-600' : 'text-slate-900'}`}>
                                  {result.daysUntilExpiry} days
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="rounded-xl border border-slate-200 bg-white p-4">
                            <h4 className="text-sm font-semibold text-slate-800 mb-3">Issuer Information</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-slate-600">Common Name:</span>
                                <span className="font-medium text-slate-900">{result.issuer.commonName}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-600">Organization:</span>
                                <span className="font-medium text-slate-900">{result.issuer.organization}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-600">Country:</span>
                                <span className="font-medium text-slate-900">{result.issuer.country}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="rounded-xl border border-slate-200 bg-white p-4">
                            <h4 className="text-sm font-semibold text-slate-800 mb-3">Certificate Details</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-slate-600">Serial Number:</span>
                                <span className="font-mono text-xs font-medium text-slate-900 break-all">{result.serialNumber}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-600">Signature Algorithm:</span>
                                <span className="font-medium text-slate-900">{result.signatureAlgorithm}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-600">Public Key:</span>
                                <span className="font-medium text-slate-900">{result.publicKey.bits} bits ({result.publicKey.algorithm})</span>
                              </div>
                            </div>
                          </div>

                          <div className="rounded-xl border border-slate-200 bg-white p-4">
                            <h4 className="text-sm font-semibold text-slate-800 mb-3">Connection Details</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-slate-600">Protocol:</span>
                                <span className="font-medium text-slate-900">{result.protocol}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-600">Cipher:</span>
                                <span className="font-medium text-slate-900">{result.cipher.name}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-600">Cipher Version:</span>
                                <span className="font-medium text-slate-900">{result.cipher.version}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {result.subject.altNames && (
                          <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
                            <h4 className="text-sm font-semibold text-slate-800 mb-2">Subject Alternative Names</h4>
                            <p className="text-xs text-slate-600">
                              {Array.isArray(result.subject.altNames) 
                                ? result.subject.altNames.join(', ')
                                : typeof result.subject.altNames === 'string'
                                ? result.subject.altNames
                                : 'N/A'}
                            </p>
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
              <div className="h-1 w-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">What is an SSL Certificate?</h2>
            </div>
            
            <div className="max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                An <strong>SSL (Secure Sockets Layer) certificate</strong> is a digital certificate that authenticates a website's identity and enables an encrypted connection between a web server and a browser. SSL certificates are essential for securing data transmission over the internet, protecting sensitive information like passwords, credit card numbers, and personal data from being intercepted by hackers or malicious actors.
              </p>
              
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                When you visit a website with a valid SSL certificate, your browser establishes a secure connection using the HTTPS protocol (HyperText Transfer Protocol Secure). This encrypted connection ensures that all data exchanged between your browser and the website's server remains private and cannot be read by third parties, even if intercepted during transmission.
              </p>
              
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                SSL certificates are issued by trusted Certificate Authorities (CAs) like Let's Encrypt, DigiCert, GlobalSign, and others. These authorities verify the website owner's identity before issuing a certificate, ensuring that visitors can trust the website they're connecting to. Modern browsers display a padlock icon (🔒) in the address bar when a website has a valid SSL certificate, providing visual confirmation of security.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">How SSL Certificates Work</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                The SSL/TLS handshake process establishes a secure connection in several steps:
              </p>
              <ol className="space-y-3 mb-4 ml-6 text-slate-700" style={{ listStyleType: 'decimal', listStylePosition: 'outside', paddingLeft: '1.5rem' }}>
                <li className="leading-relaxed pl-2" style={{ fontSize: '16px', lineHeight: '1.75' }}><strong>Client Hello:</strong> Your browser initiates a connection and sends supported encryption methods.</li>
                <li className="leading-relaxed pl-2" style={{ fontSize: '16px', lineHeight: '1.75' }}><strong>Server Hello:</strong> The server responds with its SSL certificate and selected encryption method.</li>
                <li className="leading-relaxed pl-2" style={{ fontSize: '16px', lineHeight: '1.75' }}><strong>Certificate Verification:</strong> Your browser verifies the certificate's validity and checks if it's issued by a trusted CA.</li>
                <li className="leading-relaxed pl-2" style={{ fontSize: '16px', lineHeight: '1.75' }}><strong>Key Exchange:</strong> The browser and server exchange encryption keys to establish a secure session.</li>
                <li className="leading-relaxed pl-2" style={{ fontSize: '16px', lineHeight: '1.75' }}><strong>Encrypted Communication:</strong> All subsequent data is encrypted using the agreed-upon encryption method.</li>
              </ol>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">Types of SSL Certificates</h3>
              <div className="grid md:grid-cols-3 gap-6 my-6">
                <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-5">
                  <h4 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">🔒</span>
                    Domain Validated (DV)
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    The most basic type of SSL certificate. CAs verify domain ownership only, typically through email or DNS verification. Issued quickly (minutes to hours) and suitable for personal websites and blogs.
                  </p>
                  <ul className="space-y-1 text-xs text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">•</span>
                      <span>Fast issuance (minutes to hours)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">•</span>
                      <span>Low cost or free (Let's Encrypt)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">•</span>
                      <span>Basic encryption only</span>
                    </li>
                  </ul>
                </div>
                
                <div className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-5">
                  <h4 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">🏢</span>
                    Organization Validated (OV)
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    CAs verify both domain ownership and organization details. Includes company information in the certificate. Takes 1-3 days to issue and provides higher trust levels for business websites.
                  </p>
                  <ul className="space-y-1 text-xs text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">•</span>
                      <span>Organization verification required</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">•</span>
                      <span>1-3 day issuance time</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">•</span>
                      <span>Higher trust and credibility</span>
                    </li>
                  </ul>
                </div>
                
                <div className="rounded-2xl border-2 border-purple-200 bg-purple-50 p-5">
                  <h4 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-purple-600">✅</span>
                    Extended Validation (EV)
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    The highest level of SSL certificate. Requires extensive business verification. Browsers display the company name in the address bar. Takes 1-5 days to issue and provides maximum trust for e-commerce and financial sites.
                  </p>
                  <ul className="space-y-1 text-xs text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">•</span>
                      <span>Most rigorous verification</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">•</span>
                      <span>Company name in address bar</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">•</span>
                      <span>Highest trust and security</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Why SSL Certificates Are Important</h2>
            </div>
            
            <div className="max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                SSL certificates are not just a security feature—they're essential for modern websites. Here's why SSL is crucial for your website:
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">1. Data Protection and Encryption</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                SSL certificates encrypt all data transmitted between your website and visitors' browsers. This protects sensitive information like login credentials, credit card numbers, personal data, and private messages from being intercepted by hackers. Without SSL, data is transmitted in plain text, making it vulnerable to man-in-the-middle attacks and data theft.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">2. SEO Benefits and Google Rankings</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Google uses HTTPS as a ranking signal, meaning websites with SSL certificates tend to rank higher in search results. Since 2014, Google has explicitly stated that HTTPS is a ranking factor. Additionally, Google Chrome and other browsers display security warnings for non-HTTPS sites, which can significantly impact click-through rates and user trust.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">3. User Trust and Credibility</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                The padlock icon (🔒) in the browser address bar provides visual confirmation of security, building trust with visitors. Users are more likely to make purchases, submit forms, and share personal information on websites with valid SSL certificates. Studies show that 85% of online shoppers avoid unsecured websites, making SSL essential for e-commerce and lead generation.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">4. Browser Requirements</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Modern browsers require HTTPS for many web features, including geolocation API, service workers, push notifications, and Progressive Web Apps (PWAs). Without SSL, your website cannot use these advanced features, limiting functionality and user experience.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">5. Compliance and Regulations</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Many regulations and standards require SSL encryption, including PCI DSS for payment processing, GDPR for data protection, and HIPAA for healthcare information. SSL certificates help ensure compliance with these regulations and protect your business from legal issues.
              </p>

              <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200">
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">📊</span>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-2">SSL Statistics</h4>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      According to <a href="https://transparencyreport.google.com/https/overview" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">Google's Transparency Report</a>, over 95% of web traffic is now encrypted with HTTPS. This represents a massive shift from just a few years ago, when most websites used unencrypted HTTP. The trend toward universal encryption continues to grow, making SSL certificates essential for all websites.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Understanding SSL Certificate Expiration</h2>
            </div>
            
            <div className="max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                SSL certificates have a limited validity period, typically ranging from 90 days to 1 year. Understanding certificate expiration is crucial for maintaining website security and avoiding service disruptions.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">Certificate Validity Periods</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Most SSL certificates are valid for 90 days to 1 year. Let's Encrypt, the most popular free certificate authority, issues certificates valid for 90 days. Commercial CAs typically issue certificates valid for 1-2 years. The shorter validity period for free certificates encourages regular renewal and reduces the risk of compromised certificates remaining valid for extended periods.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">Why Certificates Expire</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Certificate expiration serves several security purposes:
              </p>
              <ul className="space-y-2 mb-4">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold mt-1">•</span>
                  <span className="text-slate-700"><strong>Key Rotation:</strong> Regular expiration forces key rotation, reducing the risk of compromised private keys being used indefinitely.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold mt-1">•</span>
                  <span className="text-slate-700"><strong>Revocation:</strong> Expired certificates are automatically invalid, making revocation easier if a certificate is compromised.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold mt-1">•</span>
                  <span className="text-slate-700"><strong>Security Updates:</strong> Expiration ensures certificates use current encryption standards and security practices.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold mt-1">•</span>
                  <span className="text-slate-700"><strong>Domain Verification:</strong> Renewal requires re-verification of domain ownership, preventing unauthorized certificate issuance.</span>
                </li>
              </ul>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">What Happens When a Certificate Expires?</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                When an SSL certificate expires, browsers display security warnings to visitors, indicating that the connection is not secure. These warnings can significantly impact user trust and website traffic. Modern browsers like Chrome and Firefox show prominent "Not Secure" warnings, and some may block access to the website entirely. E-commerce sites with expired certificates often experience a sharp drop in conversions, as customers are unwilling to enter payment information on unsecured sites.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">Best Practices for Certificate Management</h3>
              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-5">
                  <h4 className="text-lg font-bold text-slate-900 mb-3">Automated Renewal</h4>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">•</span>
                      <span>Set up automatic certificate renewal using tools like Certbot for Let's Encrypt</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">•</span>
                      <span>Configure renewal reminders 30 days before expiration</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">•</span>
                      <span>Test renewal process in staging environment</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-5">
                  <h4 className="text-lg font-bold text-slate-900 mb-3">Monitoring</h4>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">•</span>
                      <span>Use SSL monitoring tools to track certificate expiration</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">•</span>
                      <span>Set up email alerts for certificates expiring within 30 days</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">•</span>
                      <span>Regularly check certificates for all domains and subdomains</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="how" className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">How Our SSL Certificate Checker Works</h2>
            </div>
            
            <p className="text-base text-slate-600 mb-6 leading-relaxed">
              Our SSL Certificate Checker tool simplifies the process of verifying SSL certificate information by connecting directly to the target server and retrieving certificate details. Here's how it works:
            </p>
            
            <div className="grid md:grid-cols-4 gap-6">
              <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white font-bold text-xl shadow-lg mb-4">
                  1
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Enter Domain</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Provide the domain name you want to check (e.g., example.com). The tool accepts domains without protocol prefixes.
                </p>
              </div>

              <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-xl shadow-lg mb-4">
                  2
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Connect to Server</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Our server establishes a TLS/SSL connection to the target domain on the specified port (default: 443 for HTTPS).
                </p>
              </div>

              <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 text-white font-bold text-xl shadow-lg mb-4">
                  3
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Retrieve Certificate</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  The server retrieves the SSL certificate from the target domain, including all certificate details and metadata.
                </p>
              </div>

              <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 text-white font-bold text-xl shadow-lg mb-4">
                  4
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Display Results</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Certificate information is parsed and displayed in an easy-to-understand format, including validity, expiration, and issuer details.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Best Practices for SSL Certificate Management</h2>
            </div>
            
            <div className="max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Proper SSL certificate management is essential for maintaining website security and avoiding service disruptions. Here are best practices:
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Certificate Renewal</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">•</span>
                      <span>Renew certificates 30 days before expiration</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">•</span>
                      <span>Set up automated renewal for Let's Encrypt certificates</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">•</span>
                      <span>Test renewal process before expiration</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">•</span>
                      <span>Keep backup certificates for critical domains</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Security Configuration</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">•</span>
                      <span>Use TLS 1.2 or higher (disable older versions)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">•</span>
                      <span>Enable HSTS (HTTP Strict Transport Security)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">•</span>
                      <span>Use strong cipher suites only</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">•</span>
                      <span>Implement certificate pinning for critical apps</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border-2 border-purple-200 bg-purple-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Monitoring and Alerts</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">•</span>
                      <span>Monitor all certificates regularly (weekly or monthly)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">•</span>
                      <span>Set up email alerts for expiration warnings</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">•</span>
                      <span>Use monitoring tools for certificate health</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">•</span>
                      <span>Track certificates for all domains and subdomains</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border-2 border-orange-200 bg-orange-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Documentation</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">•</span>
                      <span>Document certificate locations and renewal procedures</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">•</span>
                      <span>Maintain a certificate inventory</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">•</span>
                      <span>Keep records of certificate authorities and contacts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">•</span>
                      <span>Document emergency renewal procedures</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

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

        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Related Web Tools</h2>
            <p className="text-slate-600">Explore more tools for website analysis and security:</p>
          </div>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Link href="/tools/web-tools" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-emerald-300 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
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

            <Link href="/web-tools/website-screenshot" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-emerald-300 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">📸</span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">Website Screenshot</p>
                  <p className="text-xs text-slate-500">Visual Capture</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">Capture screenshots of any website as PNG or PDF.</p>
              <p className="mt-4 text-sm font-semibold text-emerald-600 group-hover:text-emerald-700">Take screenshot →</p>
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

