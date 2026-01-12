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

export default function DNSLookup() {
  const [domains, setDomains] = useState(['']);
  const [recordType, setRecordType] = useState('ALL');
  const [results, setResults] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentRequirement, setPaymentRequirement] = useState(null);
  const [userSession, setUserSession] = useState({ processingPass: null });
  const [processingProgress, setProcessingProgress] = useState({ current: 0, total: 0, currentDomain: '' });

  const currentYear = new Date().getFullYear();
  const canonicalUrl = `${siteHost}/web-tools/dns-lookup`;

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

  const handleLookup = async () => {
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

      setProcessingProgress({ current: 0, total: validDomains.length, currentDomain: 'Looking up DNS records...' });

      const response = await fetch('/api/web-tools/dns-lookup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          domain: validDomains[0],
          domains: validDomains,
          recordType: recordType,
          sessionId: sessionId,
        }),
      });

      if (validDomains.length === 1) {
        setProcessingProgress({ current: 0, total: 1, currentDomain: validDomains[0] });
      } else {
        setProcessingProgress({ current: 1, total: validDomains.length, currentDomain: 'Analyzing DNS records...' });
      }

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 402) {
          setPaymentRequirement(data.requirement);
          setShowPaymentModal(true);
          setIsProcessing(false);
          return;
        }
        throw new Error(data.message || data.error || 'Failed to lookup DNS records');
      }

      if (data.success && data.results) {
        setProcessingProgress({ current: data.results.length, total: validDomains.length, currentDomain: 'Complete' });
        setResults(data.results);
      }
    } catch (err) {
      console.error('DNS lookup error:', err);
      setError(err.message || 'Failed to lookup DNS records. Please try again.');
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
      handleLookup();
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
          "name": "How do I perform a DNS lookup?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Enter the domain name (without https://) in the input field, select the DNS record type (A, AAAA, MX, TXT, CNAME, NS, SOA, or ALL), then click 'Lookup DNS'. The tool will query DNS servers and display all matching records for the specified domain. Results typically appear within 1-3 seconds."
          }
        },
        {
          "@type": "Question",
          "name": "What is a DNS lookup?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A DNS (Domain Name System) lookup is the process of querying DNS servers to retrieve information about a domain name, such as its IP address (A record), mail server (MX record), or other DNS records. DNS lookups translate human-readable domain names like 'example.com' into IP addresses like '93.184.216.34' that computers use to connect to websites."
          }
        },
        {
          "@type": "Question",
          "name": "What DNS record types can I lookup?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our DNS lookup tool supports all major DNS record types: A (IPv4 address), AAAA (IPv6 address), MX (mail exchange), TXT (text records), CNAME (canonical name), NS (name server), SOA (start of authority), and PTR (pointer/reverse DNS). You can also select 'ALL' to retrieve all available record types for a domain."
          }
        },
        {
          "@type": "Question",
          "name": "Can I lookup multiple domains at once?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Batch processing (4+ domains) requires a Processing Pass. Free tier allows checking up to 3 domains at a time. With a Processing Pass, you can lookup up to 20 domains in a single batch, making it efficient for monitoring multiple websites or your entire domain portfolio."
          }
        },
        {
          "@type": "Question",
          "name": "What is the difference between A and AAAA records?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A records map domain names to IPv4 addresses (32-bit addresses like 93.184.216.34), while AAAA records map domain names to IPv6 addresses (128-bit addresses like 2001:0db8:85a3:0000:0000:8a2e:0370:7334). Most websites have both A and AAAA records to support both IPv4 and IPv6 connections."
          }
        },
        {
          "@type": "Question",
          "name": "What is an MX record used for?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "MX (Mail Exchange) records specify which mail servers are responsible for accepting email messages for a domain. Each MX record includes a priority value (lower numbers = higher priority) and the hostname of the mail server. When you send an email to someone@example.com, the sending server looks up the MX records for example.com to find the correct mail server."
          }
        },
        {
          "@type": "Question",
          "name": "Is this DNS lookup tool free to use?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, our DNS Lookup tool is free for single domain lookups (up to 5 lookups per day). Batch processing and higher daily limits require a Processing Pass. We aim to provide valuable tools for free while offering premium options for power users and businesses."
          }
        }
      ]
    },
    
    softwareApp: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "DNS Lookup Tool",
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "Any",
      "description": "Free online DNS lookup tool. Query DNS records for any domain including A, AAAA, MX, TXT, CNAME, NS, SOA records. Real-time DNS resolution and propagation check.",
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
        "A record lookup (IPv4)",
        "AAAA record lookup (IPv6)",
        "MX record lookup",
        "TXT record lookup",
        "CNAME record lookup",
        "NS record lookup",
        "SOA record lookup",
        "PTR record lookup",
        "Batch processing (with pass)",
        "Real-time DNS resolution"
      ]
    },
    
    howTo: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Perform a DNS Lookup",
      "description": "Step-by-step guide to looking up DNS records for any domain online for free",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Enter Domain Name",
          "text": "Enter the domain name you want to lookup (e.g., example.com) into the input field. Do not include https:// or http:// - just the domain name.",
          "position": 1
        },
        {
          "@type": "HowToStep",
          "name": "Select Record Type",
          "text": "Choose the DNS record type you want to lookup: A (IPv4), AAAA (IPv6), MX (mail), TXT (text), CNAME (alias), NS (name server), SOA (authority), PTR (reverse), or ALL to retrieve all record types.",
          "position": 2
        },
        {
          "@type": "HowToStep",
          "name": "Lookup DNS Records",
          "text": "Click the 'Lookup DNS' button. The tool will query DNS servers and retrieve the specified DNS records. This typically takes 1-3 seconds.",
          "position": 3
        },
        {
          "@type": "HowToStep",
          "name": "Review Results",
          "text": "View the DNS lookup results including all matching records, IP addresses, mail server priorities, and other DNS information. Use the results to troubleshoot DNS issues, verify domain configuration, or check DNS propagation.",
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
          "name": "DNS Lookup",
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
        <title>DNS Lookup - Free Online DNS Record Query Tool | FixTools</title>
        <meta name="title" content="DNS Lookup - Free Online DNS Record Query Tool | FixTools" />
        <meta name="description" content="Lookup DNS records for any domain. Check A, AAAA, MX, TXT, CNAME, NS, SOA records. Free DNS lookup tool with real-time DNS resolution and propagation check. Query multiple record types instantly." />
        <meta name="keywords" content="dns lookup, dns lookup tool, dns record lookup, check dns records, dns query, dns resolver, mx record lookup, a record lookup, txt record lookup, cname lookup, ns record lookup, dns checker, domain dns lookup" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content="DNS Lookup - Free Online DNS Record Query Tool" />
        <meta property="og:description" content="Lookup DNS records for any domain. Check A, AAAA, MX, TXT, CNAME, NS, SOA records. Free DNS lookup tool with real-time resolution." />
        <meta property="og:image" content={`${siteHost}/images/og-dns-lookup.png`} />
        <meta property="og:site_name" content="FixTools" />
        
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content="DNS Lookup - Free Online DNS Record Query Tool" />
        <meta property="twitter:description" content="Lookup DNS records for any domain. Check A, AAAA, MX, TXT, CNAME, NS, SOA records." />
        <meta property="twitter:image" content={`${siteHost}/images/og-dns-lookup.png`} />
        
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.faqPage) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.softwareApp) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.howTo) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.breadcrumb) }} />
      </Head>

      <style jsx global>{`
        html:has(.dns-lookup-page) {
          font-size: 100% !important;
        }
        
        .dns-lookup-page * {
          box-sizing: border-box;
        }
        
        .dns-lookup-page h1,
        .dns-lookup-page h2,
        .dns-lookup-page h3,
        .dns-lookup-page p,
        .dns-lookup-page ul,
        .dns-lookup-page ol {
          margin: 0;
        }
        
        .dns-lookup-page button {
          font-family: inherit;
          cursor: pointer;
        }
        
        .dns-lookup-page input,
        .dns-lookup-page textarea,
        .dns-lookup-page select {
          font-family: inherit;
        }
        
        /* Fix typography styling within DNS lookup page sections */
        .dns-lookup-page section .max-w-none {
          font-size: 16px !important;
          line-height: 1.75 !important;
          color: #334155 !important;
        }
        
        .dns-lookup-page section .max-w-none h3 {
          font-size: 20px !important;
          font-weight: 700 !important;
          line-height: 1.75rem !important;
          margin-top: 1.5rem !important;
          margin-bottom: 0.75rem !important;
          color: #0f172a !important;
        }
        
        .dns-lookup-page section .max-w-none p {
          font-size: 16px !important;
          line-height: 1.75 !important;
          margin-bottom: 1rem !important;
          margin-top: 0 !important;
          color: #334155 !important;
        }
        
        .dns-lookup-page section .max-w-none ol {
          margin-top: 1rem !important;
          margin-bottom: 1rem !important;
          padding-left: 1.5rem !important;
          color: #334155 !important;
          list-style-type: decimal !important;
          list-style-position: outside !important;
        }
        
        .dns-lookup-page section .max-w-none ul {
          margin-top: 1rem !important;
          margin-bottom: 1rem !important;
          padding-left: 1.5rem !important;
          color: #334155 !important;
          list-style-type: disc !important;
          list-style-position: outside !important;
        }
        
        .dns-lookup-page section .max-w-none ol li,
        .dns-lookup-page section .max-w-none ul li {
          margin-top: 0.75rem !important;
          margin-bottom: 0.75rem !important;
          line-height: 1.75 !important;
          padding-left: 0.5rem !important;
          font-size: 16px !important;
        }
        
        .dns-lookup-page section .max-w-none strong {
          font-weight: 600 !important;
          color: #0f172a !important;
        }
        
        .dns-lookup-page section .max-w-none a {
          color: #059669 !important;
          text-decoration: underline !important;
          font-weight: 500 !important;
        }
        
        .dns-lookup-page section .max-w-none a:hover {
          color: #047857 !important;
        }
        
        /* Override global CSS font-size for this page */
        .dns-lookup-page {
          font-size: 16px !important;
        }
        
        .dns-lookup-page h1 {
          font-size: 3rem !important;
        }
        
        .dns-lookup-page h2 {
          font-size: 1.875rem !important;
        }
        
        .dns-lookup-page h3 {
          font-size: 1.25rem !important;
        }
        
        .dns-lookup-page p,
        .dns-lookup-page li,
        .dns-lookup-page span {
          font-size: 1rem !important;
        }
      `}</style>

      <div className="dns-lookup-page bg-[#fbfbfc] text-slate-900 min-h-screen">
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
            <li className="flex items-center gap-2"><span className="text-slate-400">/</span><span className="font-semibold text-slate-900">DNS Lookup</span></li>
          </ol>
        </nav>

        <section className="relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.35]" style={{ backgroundImage: 'url(/grid.png)', backgroundSize: '256px 256px' }}></div>
          <div className="mx-auto max-w-6xl px-4 py-10 md:py-14 relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-1.5 text-xs font-semibold text-blue-700 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Free • Fast • Secure
            </div>
            
            <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
                DNS Lookup Tool
              </span>
            </h1>
            
            <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg md:leading-relaxed">
              Lookup DNS records for any domain with our free <strong>DNS Lookup</strong> tool. Check A, AAAA, MX, TXT, CNAME, NS, SOA records instantly and get real-time DNS resolution and propagation information.
            </p>

            <dl className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
              <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Record Types</dt>
                <dd className="mt-1.5 text-sm font-bold text-slate-900">A, AAAA, MX, TXT</dd>
              </div>
              <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Resolution</dt>
                <dd className="mt-1.5 text-sm font-bold text-slate-900">Real-time</dd>
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
                <h2 className="text-xl font-semibold text-slate-900">DNS Lookup</h2>
                <p className="mt-1 text-sm text-slate-600">Enter domain name(s), choose record type, then click 'Lookup DNS'.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button onClick={handleClear} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50">Clear</button>
                <button 
                  onClick={handleLookup} 
                  disabled={isProcessing}
                  className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Looking up...' : '🔍 Lookup DNS'}
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
                        className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-900/20"
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
                    className="rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100"
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
                  <div className="mt-6 rounded-xl border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      <p className="text-sm font-semibold text-blue-900">
                        Looking up DNS records{processingProgress.total > 1 && ` (${processingProgress.current}/${processingProgress.total})`}...
                      </p>
                    </div>
                    {processingProgress.total > 1 && (
                      <div className="mt-3">
                        <div className="w-full bg-blue-200 rounded-full h-2.5">
                          <div 
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2.5 rounded-full transition-all duration-300"
                            style={{ width: `${(processingProgress.current / processingProgress.total) * 100}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-blue-700 mt-2 text-center">
                          Processing {processingProgress.current} of {processingProgress.total} domain{processingProgress.total !== 1 ? 's' : ''}
                        </p>
                      </div>
                    )}
                    {processingProgress.total === 1 && (
                      <div className="mt-3">
                        <div className="w-full bg-blue-200 rounded-full h-2.5 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2.5 rounded-full animate-pulse"
                            style={{ width: '60%' }}
                          ></div>
                        </div>
                        <p className="text-xs text-blue-700 mt-2 text-center">
                          {processingProgress.currentDomain || 'Querying DNS servers...'}
                        </p>
                      </div>
                    )}
                    <p className="text-xs text-blue-600 mt-3 text-center">
                      This may take 1-3 seconds per domain
                    </p>
                  </div>
                )}
              </div>

              <div className="md:col-span-4">
                <label className="mb-2 block text-sm font-semibold text-slate-800">Options</label>
                <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Record Type</label>
                    <select
                      value={recordType}
                      onChange={(e) => setRecordType(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white p-2 text-sm"
                    >
                      <option value="ALL">ALL (All Records)</option>
                      <option value="A">A (IPv4 Address)</option>
                      <option value="AAAA">AAAA (IPv6 Address)</option>
                      <option value="MX">MX (Mail Exchange)</option>
                      <option value="TXT">TXT (Text Record)</option>
                      <option value="CNAME">CNAME (Canonical Name)</option>
                      <option value="NS">NS (Name Server)</option>
                      <option value="SOA">SOA (Start of Authority)</option>
                      <option value="PTR">PTR (Pointer/Reverse DNS)</option>
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

            {/* DNS Lookup Results */}
            {results.length > 0 && (
              <div className="mt-6 space-y-6">
                <h3 className="text-lg font-semibold text-slate-900">Lookup Results</h3>
                {results.map((result, index) => (
                  <div key={index} className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-5">
                    {result.error ? (
                      <div className="text-red-700 text-sm">
                        <p className="font-semibold">Error for {result.domain}:</p>
                        <p>{result.error}</p>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{result.domain}</p>
                            <p className="text-xs text-slate-600">
                              Record Type: {result.recordType} • Looked up {new Date(result.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>

                        {result.recordType === 'ALL' && Array.isArray(result.records) && result.records.length > 0 ? (
                          <div className="space-y-4">
                            {result.records.map((recordGroup, groupIndex) => (
                              <div key={groupIndex} className="rounded-xl border border-slate-200 bg-white p-4">
                                <h4 className="text-sm font-semibold text-slate-800 mb-3">{recordGroup.type} Records</h4>
                                <div className="space-y-2 text-sm">
                                  {recordGroup.records && recordGroup.records.map((record, recordIndex) => (
                                    <div key={recordIndex} className="flex justify-between items-start">
                                      <span className="text-slate-600">Record {recordIndex + 1}:</span>
                                      <span className="font-mono text-xs font-medium text-slate-900 break-all text-right ml-4">
                                        {typeof record === 'object' ? record.value : record}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : result.records && result.records.length > 0 ? (
                          <div className="rounded-xl border border-slate-200 bg-white p-4">
                            <h4 className="text-sm font-semibold text-slate-800 mb-3">{result.recordType} Records</h4>
                            <div className="space-y-2 text-sm">
                              {result.records.map((record, recordIndex) => (
                                <div key={recordIndex} className="flex justify-between items-start">
                                  <span className="text-slate-600">Record {recordIndex + 1}:</span>
                                  <span className="font-mono text-xs font-medium text-slate-900 break-all text-right ml-4">
                                    {typeof record === 'object' ? (record.value || JSON.stringify(record)) : record}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="text-slate-600 text-sm">
                            <p>No {result.recordType} records found for {result.domain}</p>
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
              <div className="h-1 w-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">What is DNS?</h2>
            </div>
            
            <div className="max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                <strong>DNS (Domain Name System)</strong> is the phone book of the internet. It translates human-readable domain names like "example.com" into IP addresses like "93.184.216.34" that computers use to identify each other on the network. Without DNS, you would need to remember numeric IP addresses for every website you visit, which would be nearly impossible.
              </p>
              
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                When you type a website address into your browser, your computer queries DNS servers to find the corresponding IP address. This process, called a DNS lookup, happens behind the scenes in milliseconds. DNS is essential for the internet to function, as it enables users to access websites using memorable domain names instead of complex IP addresses.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">How DNS Works</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                The DNS lookup process involves several steps:
              </p>
              <ol className="space-y-3 mb-4 ml-6 text-slate-700" style={{ listStyleType: 'decimal', listStylePosition: 'outside', paddingLeft: '1.5rem' }}>
                <li className="leading-relaxed pl-2" style={{ fontSize: '16px', lineHeight: '1.75' }}><strong>User Request:</strong> You type a domain name (e.g., example.com) into your browser.</li>
                <li className="leading-relaxed pl-2" style={{ fontSize: '16px', lineHeight: '1.75' }}><strong>Local DNS Cache:</strong> Your computer first checks its local DNS cache to see if it already knows the IP address.</li>
                <li className="leading-relaxed pl-2" style={{ fontSize: '16px', lineHeight: '1.75' }}><strong>Recursive DNS Server:</strong> If not cached, your computer queries a recursive DNS server (usually provided by your ISP or a public DNS service like Google DNS or Cloudflare).</li>
                <li className="leading-relaxed pl-2" style={{ fontSize: '16px', lineHeight: '1.75' }}><strong>Root DNS Server:</strong> The recursive server queries a root DNS server, which directs it to the appropriate Top-Level Domain (TLD) server (e.g., .com, .org).</li>
                <li className="leading-relaxed pl-2" style={{ fontSize: '16px', lineHeight: '1.75' }}><strong>TLD DNS Server:</strong> The TLD server directs the query to the authoritative DNS server for the specific domain.</li>
                <li className="leading-relaxed pl-2" style={{ fontSize: '16px', lineHeight: '1.75' }}><strong>Authoritative DNS Server:</strong> The authoritative server returns the IP address for the domain, which is then cached and returned to your browser.</li>
                <li className="leading-relaxed pl-2" style={{ fontSize: '16px', lineHeight: '1.75' }}><strong>Connection Established:</strong> Your browser uses the IP address to connect to the website's server and load the webpage.</li>
              </ol>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">Types of DNS Records</h3>
              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-5">
                  <h4 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">A</span>
                    A Record (IPv4)
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    Maps a domain name to an IPv4 address (32-bit address like 93.184.216.34). This is the most common DNS record type and is required for websites to be accessible via IPv4.
                  </p>
                  <ul className="space-y-1 text-xs text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Required for website access</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Points to IPv4 addresses</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Most widely used record type</span>
                    </li>
                  </ul>
                </div>
                
                <div className="rounded-2xl border-2 border-indigo-200 bg-indigo-50 p-5">
                  <h4 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">AAAA</span>
                    AAAA Record (IPv6)
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    Maps a domain name to an IPv6 address (128-bit address like 2001:0db8:85a3:0000:0000:8a2e:0370:7334). Used for IPv6-enabled websites and networks.
                  </p>
                  <ul className="space-y-1 text-xs text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold mt-0.5">•</span>
                      <span>IPv6 support</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold mt-0.5">•</span>
                      <span>Future-proof addressing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold mt-0.5">•</span>
                      <span>Larger address space</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border-2 border-green-200 bg-green-50 p-5">
                  <h4 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 text-green-600">MX</span>
                    MX Record (Mail Exchange)
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    Specifies which mail servers are responsible for accepting email messages for a domain. Each MX record includes a priority value (lower numbers = higher priority).
                  </p>
                  <ul className="space-y-1 text-xs text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold mt-0.5">•</span>
                      <span>Email routing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold mt-0.5">•</span>
                      <span>Priority-based delivery</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold mt-0.5">•</span>
                      <span>Required for email</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border-2 border-purple-200 bg-purple-50 p-5">
                  <h4 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-purple-600">TXT</span>
                    TXT Record (Text)
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    Stores text information for various purposes, including SPF records for email authentication, DKIM keys, domain verification, and other metadata.
                  </p>
                  <ul className="space-y-1 text-xs text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>SPF/DKIM records</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>Domain verification</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>Flexible text storage</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border-2 border-orange-200 bg-orange-50 p-5">
                  <h4 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 text-orange-600">CNAME</span>
                    CNAME Record (Canonical Name)
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    Creates an alias from one domain name to another. When a DNS lookup queries a CNAME record, it returns the canonical (true) domain name instead of an IP address.
                  </p>
                  <ul className="space-y-1 text-xs text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 font-bold mt-0.5">•</span>
                      <span>Domain aliasing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 font-bold mt-0.5">•</span>
                      <span>Subdomain management</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 font-bold mt-0.5">•</span>
                      <span>Points to another domain</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-5">
                  <h4 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600">NS</span>
                    NS Record (Name Server)
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    Specifies which DNS servers are authoritative for a domain. NS records tell the internet where to find DNS information for your domain.
                  </p>
                  <ul className="space-y-1 text-xs text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">•</span>
                      <span>Authoritative servers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">•</span>
                      <span>DNS delegation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">•</span>
                      <span>Required for DNS</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <p className="text-base text-slate-700 leading-relaxed">
                DNS records serve many purposes: translating domain names to IP addresses for website access, routing email to the correct mail servers via MX records, providing domain verification and authentication through TXT records, enabling domain aliasing with CNAME records, and specifying authoritative DNS servers with NS records. Understanding DNS records is essential for website management, email configuration, and network troubleshooting.
              </p>
            </div>
          </div>
        </section>

        {/* Why DNS Lookup is Important Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Why DNS Lookup is Important</h2>
            </div>
            
            <div className="max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                DNS lookup is not just a technical tool—it's essential for website management, troubleshooting, and security. Here's why DNS lookup is crucial:
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">1. Website Troubleshooting</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                DNS lookup helps diagnose website connectivity issues. If a website isn't loading, checking DNS records can reveal whether the problem is with DNS configuration, IP address changes, or DNS propagation delays. By verifying A records, you can confirm that your domain is pointing to the correct IP address.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">2. Email Configuration Verification</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                DNS lookup is essential for email setup and troubleshooting. MX records determine which mail servers receive email for your domain. Verifying MX records ensures that email is being routed correctly. TXT records contain SPF and DKIM information that prevents email spoofing and improves deliverability.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">3. Security and Authentication</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                DNS lookup helps verify domain ownership and security configurations. TXT records are used for domain verification (e.g., Google Search Console, SSL certificate validation), SPF records prevent email spoofing, and DKIM records provide email authentication. Regular DNS lookups help ensure your security records are properly configured.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">4. DNS Propagation Monitoring</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                When you change DNS records, it takes time for changes to propagate across all DNS servers worldwide. DNS lookup tools help monitor propagation status by checking different DNS servers to see if they've updated with your new records. This is crucial when migrating websites or changing hosting providers.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">5. Network and Infrastructure Management</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                DNS lookup is essential for managing network infrastructure. NS records show which DNS servers are authoritative for your domain, helping you verify DNS hosting configuration. CNAME records help manage subdomains and aliases efficiently. SOA records provide information about DNS zone administration.
              </p>
            </div>
          </div>
        </section>

        {/* How to Use DNS Lookup Section */}
        <section id="how" className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">How to Use Our DNS Lookup Tool</h2>
            </div>
            
            <div className="max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-6">
                Our DNS lookup tool makes it easy to query DNS records for any domain. Follow these simple steps:
              </p>

              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-xl shadow-lg mb-4">
                    1
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">Enter Domain Name</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Provide the domain name you want to lookup (e.g., example.com). The tool accepts domains without protocol prefixes.
                  </p>
                </div>

                <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-xl shadow-lg mb-4">
                    2
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">Select Record Type</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Choose the DNS record type you want to lookup: A, AAAA, MX, TXT, CNAME, NS, SOA, PTR, or ALL to retrieve all record types.
                  </p>
                </div>

                <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-xl shadow-lg mb-4">
                    3
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">Lookup DNS Records</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Click the "Lookup DNS" button. Our server queries DNS servers and retrieves the specified records. This typically takes 1-3 seconds.
                  </p>
                </div>

                <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-xl shadow-lg mb-4">
                    4
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">Review Results</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    View the DNS lookup results including all matching records, IP addresses, mail server priorities, and other DNS information. Use the results to troubleshoot DNS issues or verify domain configuration.
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
              <div className="h-1 w-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">DNS Lookup Best Practices</h2>
            </div>
            
            <div className="max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Proper DNS management is essential for website reliability and email delivery. Here are best practices:
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">DNS Record Management</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Keep A and AAAA records up to date</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Verify MX records for email delivery</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Configure SPF and DKIM TXT records</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Use CNAME records for subdomains</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>Monitor DNS propagation after changes</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border-2 border-indigo-200 bg-indigo-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Security Configuration</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold mt-0.5">•</span>
                      <span>Implement SPF records to prevent spoofing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold mt-0.5">•</span>
                      <span>Configure DKIM for email authentication</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold mt-0.5">•</span>
                      <span>Use DMARC policies for email security</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold mt-0.5">•</span>
                      <span>Regularly verify DNS record integrity</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold mt-0.5">•</span>
                      <span>Monitor for unauthorized DNS changes</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border-2 border-green-200 bg-green-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Performance Optimization</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold mt-0.5">•</span>
                      <span>Use fast DNS providers (Cloudflare, Google DNS)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold mt-0.5">•</span>
                      <span>Configure appropriate TTL values</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold mt-0.5">•</span>
                      <span>Implement DNS caching where possible</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold mt-0.5">•</span>
                      <span>Monitor DNS query response times</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold mt-0.5">•</span>
                      <span>Use CDN with DNS optimization</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border-2 border-purple-200 bg-purple-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Troubleshooting</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>Check DNS records when websites don't load</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>Verify MX records for email issues</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>Test DNS propagation after changes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>Compare DNS records across servers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>Document DNS configurations for reference</span>
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
            <Link href="/tools/web-tools" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🌐</span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">All Web Tools</p>
                  <p className="text-xs text-slate-500">Browse Category</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">Discover all web tools for website analysis, testing, and security.</p>
              <p className="mt-4 text-sm font-semibold text-blue-600 group-hover:text-blue-700">Browse tools →</p>
            </Link>

            <Link href="/web-tools/ssl-checker" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
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
              <p className="mt-4 text-sm font-semibold text-blue-600 group-hover:text-blue-700">Check SSL →</p>
            </Link>

            <Link href="/web-tools/website-speed-test" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
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
              <p className="mt-4 text-sm font-semibold text-blue-600 group-hover:text-blue-700">Test speed →</p>
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

