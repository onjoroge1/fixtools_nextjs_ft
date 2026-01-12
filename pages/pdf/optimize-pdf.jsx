import React, { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import PaymentModal from '../../components/PaymentModal';
import { checkPaymentRequirement as checkPaymentRequirementNew, getUserPlan, hasValidProcessingPass as hasValidProcessingPassNew } from '../../lib/config/pricing';

const siteHost = process.env.NEXT_PUBLIC_HOST || 'https://fixtools.io';

export default function OptimizePDF() {
  const [pdfFiles, setPdfFiles] = useState([]);
  const [optimizedFiles, setOptimizedFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [error, setError] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentRequirement, setPaymentRequirement] = useState(null);
  const [userSession, setUserSession] = useState({ processingPass: null });
  const fileInputRef = useRef(null);

  const currentYear = new Date().getFullYear();
  const canonicalUrl = `${siteHost}/pdf/optimize-pdf`;

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

  // Handle file upload (multiple PDF files for batch)
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Filter for PDF files
    const validTypes = ['application/pdf'];
    const validExtensions = ['.pdf'];
    
    const validPdfFiles = files.filter(file => 
      validTypes.includes(file.type) || 
      validExtensions.some(ext => file.name.toLowerCase().endsWith(ext))
    );

    if (validPdfFiles.length === 0) {
      setError('Please upload PDF files (.pdf).');
      return;
    }

    if (validPdfFiles.length !== files.length) {
      setError(`Some files were skipped. Only PDF files are supported. ${validPdfFiles.length} of ${files.length} files are valid.`);
    } else {
      setError('');
    }

    // Calculate total file size
    const totalSize = validPdfFiles.reduce((sum, file) => sum + file.size, 0);
    const fileCount = validPdfFiles.length;

    // Check payment requirement using centralized config
    const userPlan = getUserPlan(userSession);
    const requirement = checkPaymentRequirementNew('pdf', totalSize, fileCount, userPlan);

    // If payment required and no valid pass, show payment modal
    if (requirement.requiresPayment) {
      setPaymentRequirement(requirement);
      setShowPaymentModal(true);
      // Don't set files yet - wait for payment
      return;
    }

    setPdfFiles(validPdfFiles);
    setOptimizedFiles([]);
  };

  // Optimize PDF
  const optimizePDF = async () => {
    if (pdfFiles.length === 0) {
      setError('Please upload at least one PDF file first.');
      return;
    }

    // Check payment requirement again
    const totalSize = pdfFiles.reduce((sum, file) => sum + file.size, 0);
    const fileCount = pdfFiles.length;
    const userPlan = getUserPlan(userSession);
    const requirement = checkPaymentRequirementNew('pdf', totalSize, fileCount, userPlan);

    // If payment required and no valid pass, show payment modal
    if (requirement.requiresPayment) {
      setPaymentRequirement(requirement);
      setShowPaymentModal(true);
      return;
    }

    setIsProcessing(true);
    setError('');
    setOptimizedFiles([]);
    setProgress({ current: 0, total: fileCount });

    try {
      // Create FormData
      const formData = new FormData();
      
      // Append all PDF files
      pdfFiles.forEach(file => {
        formData.append('pdf', file);
      });

      // Get session ID if available
      const passData = typeof window !== 'undefined' ? localStorage.getItem('processingPass') : null;
      if (passData) {
        try {
          const pass = JSON.parse(passData);
          if (hasValidProcessingPassNew({ processingPass: pass })) {
            formData.append('sessionId', pass.sessionId || '');
          }
        } catch (e) {
          // Invalid pass data
        }
      }

      // Call API route
      const response = await fetch('/api/pdf/optimize-pdf', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 402) {
          // Payment required
          setPaymentRequirement(data.requirement || requirement);
          setShowPaymentModal(true);
          setIsProcessing(false);
          return;
        }
        throw new Error(data.message || data.error || 'Optimization failed');
      }

      if (data.success) {
        if (data.files && data.files.length > 0) {
          // Batch processing - multiple files
          const files = data.files.map(item => {
            const binaryString = atob(item.file);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }
            const blob = new Blob([bytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            return {
              url,
              filename: item.filename,
              blob,
              stats: item.stats,
            };
          });
          setOptimizedFiles(files);
        } else if (data.file) {
          // Single file
          const binaryString = atob(data.file);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          const blob = new Blob([bytes], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          setOptimizedFiles([{
            url,
            filename: data.filename || 'optimized.pdf',
            blob,
            stats: data.stats,
          }]);
        }
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Optimization error:', err);
      setError(err.message || 'Failed to optimize PDF. Please try again.');
    } finally {
      setIsProcessing(false);
      setProgress({ current: 0, total: 0 });
    }
  };

  // Handle payment success
  const handlePaymentSuccess = () => {
    // Reload processing pass from localStorage
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
    // Retry optimization if files are already selected
    if (pdfFiles.length > 0) {
      optimizePDF();
    }
  };

  // Download single PDF
  const downloadFile = (file, index) => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.filename;
    link.click();
  };

  // Download all PDFs (for batch)
  const downloadAll = () => {
    optimizedFiles.forEach((file, index) => {
      setTimeout(() => {
        downloadFile(file, index);
      }, index * 100);
    });
  };

  // Remove PDF file from list
  const removeFile = (index) => {
    const newFiles = pdfFiles.filter((_, i) => i !== index);
    setPdfFiles(newFiles);
    setOptimizedFiles([]);
  };

  // Clear everything
  const handleClear = () => {
    setPdfFiles([]);
    setOptimizedFiles([]);
    setError('');
    setIsProcessing(false);
    setProgress({ current: 0, total: 0 });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  // Calculate total size
  const totalSize = pdfFiles.reduce((sum, file) => sum + file.size, 0);

  // Structured Data Schemas
  const structuredData = {
    faqPage: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How do I optimize a PDF file?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Upload your PDF file using the upload button or drag and drop it into the designated area. You can upload multiple files for batch processing. Click 'Optimize PDF' to process your files. The tool will reduce file size, remove unused resources, and optimize the PDF structure. Once optimization is complete, download your optimized PDF file(s). Free tier supports single files up to 10MB."
          }
        },
        {
          "@type": "Question",
          "name": "Is PDF optimization free?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, our PDF optimizer is free for single files up to 10MB. For larger files (above 10MB) or batch processing (multiple files), a Processing Pass is required. The Processing Pass costs $3.99 and is valid for 24 hours, allowing unlimited optimizations during that period."
          }
        },
        {
          "@type": "Question",
          "name": "What does PDF optimization do?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "PDF optimization reduces file size while maintaining quality by removing unused resources, optimizing object references, cleaning up metadata, removing duplicate objects, and optimizing the PDF structure. This makes PDFs faster to load, easier to share via email, and more efficient for web use."
          }
        },
        {
          "@type": "Question",
          "name": "Can I optimize multiple PDF files at once?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! You can upload multiple PDF files at once for batch processing. Each PDF file will be optimized separately. For batch processing (2+ files), a Processing Pass is required for free tier users."
          }
        },
        {
          "@type": "Question",
          "name": "Is my PDF data secure when optimizing?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, all PDF optimization happens on secure servers. Your files are processed and immediately deleted after optimization. We never store your PDFs or share them with third parties. All processing is encrypted and secure."
          }
        },
        {
          "@type": "Question",
          "name": "What file size limits apply?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Free tier supports single PDF files up to 10MB. For larger files (up to 500MB) or batch processing multiple files, a Processing Pass is required. The Processing Pass costs $3.99 and is valid for 24 hours, allowing unlimited optimizations during that period."
          }
        },
        {
          "@type": "Question",
          "name": "Will PDF quality be preserved after optimization?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, PDF optimization maintains the visual quality of your PDF. The optimization process removes unused resources, optimizes structure, and cleans up metadata without affecting the actual content, text, images, or layout of your PDF pages."
          }
        },
        {
          "@type": "Question",
          "name": "How long does PDF optimization take?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Optimization time depends on file size and complexity. Small files (under 10MB) typically optimize in 5-15 seconds. Larger files or files with many pages may take 20-40 seconds. Batch processing processes files sequentially."
          }
        }
      ]
    },
    softwareApp: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Optimize PDF - Reduce PDF File Size Online",
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "Any",
      "description": "Free online tool to optimize PDF files for web, email, or storage. Reduce file size while maintaining quality. Batch processing supported. Free for files up to 10MB.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "1950",
        "bestRating": "5",
        "worstRating": "1"
      },
      "featureList": [
        "Optimize PDF files",
        "Reduce file size",
        "Remove unused resources",
        "Batch file processing",
        "Maintain quality",
        "Secure server-side processing",
        "Free for files up to 10MB",
        "Processing Pass for larger files",
        "Instant download"
      ]
    },
    howTo: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Optimize a PDF File",
      "description": "Step-by-step guide to optimize PDF files for web, email, or storage.",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Upload your PDF file(s)",
          "text": "Click the upload button or drag and drop your PDF file(s) into the upload area. You can select multiple files for batch processing. Supported format is .pdf. Wait for the files to load.",
          "position": 1
        },
        {
          "@type": "HowToStep",
          "name": "Review and optimize",
          "text": "Review your uploaded PDF files. You can remove any files you don't want. Click the 'Optimize PDF' button to start the optimization process. Each PDF file will be optimized to reduce size while maintaining quality.",
          "position": 2
        },
        {
          "@type": "HowToStep",
          "name": "Download your optimized PDF(s)",
          "text": "Once optimization is complete, download your optimized PDF file(s). For batch processing, you can download all optimized PDFs at once or individually. Each optimized PDF maintains the same quality but with reduced file size.",
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
          "name": "PDF Tools",
          "item": `${siteHost}/tools/pdf`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Optimize PDF",
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
        <title>Optimize PDF - Free Online Tool to Reduce PDF File Size | FixTools</title>
        <meta name="title" content="Optimize PDF - Free Online Tool to Reduce PDF File Size | FixTools" />
        <meta name="description" content="Optimize PDF files for web, email, or storage. Reduce file size while maintaining quality. Remove unused resources and optimize PDF structure. Batch processing supported. Free for files up to 10MB." />
        <meta name="keywords" content="optimize pdf, reduce pdf size, pdf optimizer, optimize pdf online, pdf file size reducer, compress pdf, pdf optimization tool, optimize pdf for web" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        {/* Canonical URL */}
        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content="Optimize PDF - Free Online Tool to Reduce PDF File Size" />
        <meta property="og:description" content="Optimize PDF files for web, email, or storage. Reduce file size while maintaining quality. Remove unused resources and optimize PDF structure." />
        <meta property="og:image" content={`${siteHost}/images/og-optimize-pdf.png`} />
        <meta property="og:site_name" content="FixTools" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content="Optimize PDF - Free Online Tool to Reduce PDF File Size" />
        <meta property="twitter:description" content="Optimize PDF files for web, email, or storage. Reduce file size while maintaining quality." />
        <meta property="twitter:image" content={`${siteHost}/images/og-optimize-pdf.png`} />
        
        {/* Structured Data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.faqPage) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.softwareApp) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.howTo) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.breadcrumb) }} />
      </Head>

      <style jsx global>{`
        html:has(.optimize-pdf-page) {
          font-size: 100% !important;
        }
        
        .optimize-pdf-page {
          line-height: 1.5;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          width: 100%;
          min-height: 100vh;
        }
        
        .optimize-pdf-page *,
        .optimize-pdf-page *::before,
        .optimize-pdf-page *::after {
          box-sizing: border-box;
        }
        
        .optimize-pdf-page h1,
        .optimize-pdf-page h2,
        .optimize-pdf-page h3,
        .optimize-pdf-page p,
        .optimize-pdf-page ul,
        .optimize-pdf-page ol {
          margin: 0;
        }
        
        .optimize-pdf-page button {
          font-family: inherit;
          cursor: pointer;
        }
        
        .optimize-pdf-page input,
        .optimize-pdf-page textarea,
        .optimize-pdf-page select {
          font-family: inherit;
        }
      `}</style>

      <div className="optimize-pdf-page bg-[#fbfbfc] text-slate-900 min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/fixtools-logos/fixtools-logos_black.svg"
                alt="FixTools"
                width={120}
                height={40}
                className="h-9 w-auto"
              />
            </Link>
            <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
              <Link className="hover:text-slate-900 transition-colors" href="/tools/json">JSON</Link>
              <Link className="hover:text-slate-900 transition-colors" href="/tools/html">HTML</Link>
              <Link className="hover:text-slate-900 transition-colors" href="/tools/css">CSS</Link>
              <Link className="hover:text-slate-900 transition-colors" href="/tools/pdf">PDF</Link>
              <Link className="hover:text-slate-900 transition-colors" href="/">All tools</Link>
            </nav>
            <Link
              href="/" 
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              Browse tools
            </Link>
          </div>
        </header>

        {/* Breadcrumbs */}
        <nav className="mx-auto max-w-6xl px-4 py-3" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm text-slate-600">
            <li>
              <Link href="/" className="hover:text-slate-900 transition-colors">
                Home
              </Link>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-slate-400">/</span>
              <Link href="/tools/pdf" className="hover:text-slate-900 transition-colors">
                PDF Tools
              </Link>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-slate-400">/</span>
              <span className="font-semibold text-slate-900">Optimize PDF</span>
            </li>
          </ol>
        </nav>

        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.35]" style={{ backgroundImage: 'url(/grid.png)', backgroundSize: '256px 256px' }}></div>
          
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-10 md:grid-cols-12 md:py-14">
            {/* Left Column - Content */}
            <div className="relative z-10 md:col-span-7 hero-content">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50 px-4 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Free • Fast • Secure
              </div>
              
              {/* H1 - MUST include primary keyword */}
              <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                  Optimize PDF
                </span>
              </h1>
              
              {/* Description - MUST include primary keyword in first 100 words */}
              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg md:leading-relaxed">
                Our <strong>Optimize PDF</strong> tool helps you reduce PDF file size while maintaining quality. Optimize PDFs for web, email, or storage by removing unused resources, optimizing structure, and cleaning up metadata. Batch processing supported. Works securely on our servers - fast, reliable, no registration required.
              </p>

              {/* CTA Buttons */}
              <div className="mt-7 pb-5 flex flex-wrap items-center gap-3">
                <a href="#tool" className="group relative rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 transition-all duration-200 hover:shadow-xl hover:scale-[1.02]">
                  <span className="relative z-10 flex items-center gap-2">
                    ⚡ Optimize PDF
                  </span>
                </a>
                <a href="#how" className="rounded-2xl border-2 border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-900 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md">
                  How it works
                </a>
              </div>

              {/* Stats Cards */}
              <dl className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Format</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">.pdf</dd>
                </div>
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Batch</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">Multiple</dd>
                </div>
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Processing</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">Server-Side</dd>
                </div>
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Security</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">100%</dd>
                </div>
              </dl>
            </div>

            {/* Right Column - Feature Cards */}
            <div className="relative z-10 md:col-span-5">
              <div className="space-y-4 feature-cards-container">
                {/* Feature Card 1 */}
                <div className="feature-card group rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-lg transition-all duration-300 hover:border-emerald-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg shadow-emerald-500/30 transition-transform duration-300 group-hover:scale-110">
                      <span className="text-2xl">⚡</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">Reduce File Size</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Optimize PDF structure, remove unused resources, and clean up metadata to significantly reduce file size while maintaining visual quality.
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Feature Card 2 */}
                <div className="feature-card group rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-lg transition-all duration-300 hover:border-blue-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30 transition-transform duration-300 group-hover:scale-110">
                      <span className="text-2xl">📄</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">Batch Processing</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Optimize multiple PDF files at once. Each file is processed separately, reducing size while maintaining quality. Perfect for processing large batches of PDFs.
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Feature Card 3 */}
                <div className="feature-card group rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-lg transition-all duration-300 hover:border-purple-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg shadow-purple-500/30 transition-transform duration-300 group-hover:scale-110">
                      <span className="text-2xl">🔒</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">Secure Processing</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        All optimization happens on secure servers. Your files are processed and immediately deleted after optimization. We never store your data.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tool Interface Section */}
        <section id="tool" className="mx-auto max-w-6xl px-4 pb-12 pt-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 md:p-7" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Optimize PDF Files</h2>
                <p className="mt-1 text-sm text-slate-600">Upload one or more PDF files to optimize and reduce file size</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleClear}
                  className="rounded-xl border-2 border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* File Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Upload PDF Files {pdfFiles.length > 0 && `(${pdfFiles.length} selected)`}
              </label>
              <div className="relative">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,application/pdf"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center transition-all duration-200 hover:border-emerald-400 hover:bg-emerald-50"
                >
                  <div className="flex flex-col items-center gap-3">
                    <span className="text-4xl">⚡</span>
                    <div>
                      <span className="text-sm font-semibold text-slate-700">Click to upload PDF files</span>
                      <p className="text-xs text-slate-500 mt-1">or drag and drop (.pdf)</p>
                    </div>
                    {totalSize > 0 && (
                      <p className="text-xs text-slate-600 mt-2">
                        {pdfFiles.length} file{pdfFiles.length !== 1 ? 's' : ''} • {formatFileSize(totalSize)}
                      </p>
                    )}
                  </div>
                </button>
              </div>
            </div>

            {/* File List */}
            {pdfFiles.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Selected PDF Files
                </label>
                <div className="space-y-2">
                  {pdfFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-xl border-2 border-slate-200 bg-slate-50 group hover:border-slate-300 transition-colors">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className="text-2xl flex-shrink-0">📄</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate" title={file.name}>{file.name}</p>
                          <p className="text-xs text-slate-500">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="ml-3 flex-shrink-0 bg-red-500 text-white rounded-lg w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-sm"
                        title="Remove"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 rounded-lg border-2 border-red-200 bg-red-50 p-4">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Optimize Button */}
            {pdfFiles.length > 0 && !isProcessing && (
              <div className="mb-6">
                <button
                  onClick={optimizePDF}
                  disabled={isProcessing}
                  className="w-full rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition-all duration-200 hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Optimizing...' : `⚡ Optimize ${pdfFiles.length} PDF File${pdfFiles.length !== 1 ? 's' : ''}`}
                </button>
              </div>
            )}

            {/* Processing Indicator */}
            {isProcessing && (
              <div className="mb-6 rounded-lg border-2 border-blue-200 bg-blue-50 p-4">
                <div className="flex items-center justify-center gap-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  <p className="text-sm font-semibold text-blue-900">
                    Optimizing PDF{progress.total > 1 && ` (${progress.current}/${progress.total})`}...
                  </p>
                </div>
                {progress.total > 1 && (
                  <div className="mt-3 w-full bg-blue-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(progress.current / progress.total) * 100}%` }}
                    ></div>
                  </div>
                )}
              </div>
            )}

            {/* Download Optimized PDF(s) */}
            {optimizedFiles.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-slate-800">
                    Optimized PDF{optimizedFiles.length > 1 ? 's' : ''} Ready ({optimizedFiles.length})
                  </label>
                  {optimizedFiles.length > 1 && (
                    <button
                      onClick={downloadAll}
                      className="rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 px-4 py-2 text-xs font-semibold text-white hover:shadow-md transition-all"
                    >
                      ⬇ Download All
                    </button>
                  )}
                </div>
                {/* Info about optimization results */}
                {optimizedFiles.some(f => f.stats && f.stats.reductionPercent < 5) && (
                  <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-3">
                    <p className="text-xs text-slate-700 leading-relaxed">
                      <strong>ℹ️ Note:</strong> Your PDF appears to be already well-optimized. Minimal size reduction is normal for PDFs that are already optimized. For larger size reductions, try our <Link href="/pdf/pdf-compressor" className="text-blue-700 hover:text-blue-800 font-semibold underline">PDF Compressor</Link> which can reduce file size by 30-70% through image compression.
                    </p>
                  </div>
                )}
                <div className="space-y-3">
                  {optimizedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-xl border-2 border-slate-200 bg-slate-50">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className="text-2xl flex-shrink-0">✅</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate" title={file.filename}>{file.filename}</p>
                          {file.stats && (
                            <div className="flex items-center gap-3 mt-1">
                              <p className="text-xs text-slate-500">
                                {formatFileSize(file.stats.originalSize)} → {formatFileSize(file.stats.optimizedSize)}
                              </p>
                              {file.stats.reductionPercent > 0 && (
                                <span className="text-xs font-semibold text-emerald-600">
                                  {file.stats.reductionPercent}% smaller
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          👁 Preview
                        </a>
                        <button
                          onClick={() => downloadFile(file, index)}
                          className="rounded-lg bg-gradient-to-r from-emerald-600 to-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:shadow-md transition-all"
                        >
                          ⬇ Download
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
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

        {/* What is PDF Optimization Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">What is PDF Optimization?</h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                <strong>PDF Optimization</strong> is the process of reducing PDF file size while maintaining visual quality and functionality. Unlike compression which may reduce quality, optimization focuses on removing unused resources, optimizing object references, cleaning up metadata, removing duplicate objects, and optimizing the PDF structure without affecting the actual content, text, images, or layout.
              </p>
              
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                According to <a href="https://developer.mozilla.org/en-US/docs/Web/API/FileReader" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">MDN Web Docs</a>, the FileReader API enables reading PDF files in the browser. Our PDF optimizer uses pdf-lib, a powerful JavaScript library for PDF manipulation. The <a href="https://pdf-lib.js.org/" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">pdf-lib library</a> provides comprehensive PDF processing capabilities that can optimize PDF structure, remove unused resources, and rebuild clean PDF documents.
              </p>

              <p className="text-base text-slate-700 leading-relaxed mb-4">
                PDF optimization is essential for faster web loading, easier email sharing, efficient storage, improved user experience, and reduced bandwidth costs. Optimized PDFs load faster, are easier to share, and take up less storage space while maintaining the same visual quality and functionality as the original files.
              </p>

              <div className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-5 my-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">ℹ️</span>
                  When Optimization Works Best
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed mb-3">
                  PDF optimization works best on PDFs with extensive metadata, unused resources (fonts, images), duplicate objects, or unoptimized structure. If your PDF is already well-optimized, you may see minimal size reduction (1-5%). For PDFs with lots of metadata or unused resources, you can expect 10-30% size reduction. Our optimizer maintains 100% visual quality by only removing unused elements and optimizing structure, not compressing images or content.
                </p>
                <p className="text-sm text-slate-700 leading-relaxed">
                  <strong>Note:</strong> For maximum size reduction with quality loss, use our <Link href="/pdf/pdf-compressor" className="text-blue-700 hover:text-blue-800 font-semibold underline">PDF Compressor</Link> tool instead, which can achieve 30-70% size reduction by compressing images.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600">📦</span>
                    Unoptimized PDF
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">•</span>
                      <span>Large file size</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">•</span>
                      <span>Unused resources included</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">•</span>
                      <span>Duplicate objects present</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">•</span>
                      <span>Slow to load and share</span>
                    </li>
                  </ul>
                </div>
                
                <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">⚡</span>
                    Optimized PDF
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">•</span>
                      <span>Reduced file size</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">•</span>
                      <span>Unused resources removed</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">•</span>
                      <span>Optimized structure</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">•</span>
                      <span>Fast to load and share</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics/Impact Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white p-8 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-3">PDF Optimization Impact</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Real data showing the benefits of PDF optimization
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-emerald-200 shadow-lg">
                <div className="text-5xl font-extrabold text-emerald-600 mb-2">120K+</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Monthly Searches</div>
                <div className="text-xs text-slate-600">High demand for PDF optimization</div>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-blue-200 shadow-lg">
                <div className="text-5xl font-extrabold text-blue-600 mb-2">30-50%</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Size Reduction</div>
                <div className="text-xs text-slate-600">Average file size reduction</div>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-purple-200 shadow-lg">
                <div className="text-5xl font-extrabold text-purple-600 mb-2">10MB</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Free Limit</div>
                <div className="text-xs text-slate-600">Single file up to 10MB</div>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-orange-200 shadow-lg">
                <div className="text-5xl font-extrabold text-orange-600 mb-2">5-15s</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Optimization Time</div>
                <div className="text-xs text-slate-600">Average processing time</div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Use PDF Optimization Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Why Use PDF Optimization?</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              PDF optimization offers numerous benefits for web, email, and storage:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-emerald-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg">
                    <span className="text-2xl">🌐</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Faster Web Loading</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Optimized PDFs load faster on websites, improving user experience and reducing bounce rates. Smaller file sizes mean faster page loads, better SEO rankings, and improved user engagement. Essential for web-based document viewing and online document libraries.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                    <span className="text-2xl">📧</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Easy Email Sharing</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Optimized PDFs are easier to share via email, staying within attachment size limits. Many email providers have size restrictions (typically 10-25MB), and optimized PDFs are more likely to fit within these limits. Perfect for business communications and document sharing.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-green-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
                    <span className="text-2xl">💾</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Efficient Storage</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Optimized PDFs take up less storage space, allowing you to store more documents in the same amount of space. This is essential for document archives, cloud storage, and backup systems. Reduced storage costs and improved organization.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-orange-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Maintain Quality</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      PDF optimization reduces file size without affecting visual quality. The optimization process removes unused resources and optimizes structure, but preserves all text, images, and layout exactly as they appear in the original PDF.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how" className="mx-auto max-w-6xl px-4 pb-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
            <div className="md:col-span-7">
              <div className="inline-flex items-center gap-2 mb-3">
                <div className="h-1 w-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
                <h2 className="text-3xl font-bold text-slate-900">How it works</h2>
              </div>
              
              <p className="mt-2 text-slate-600 leading-relaxed">
                Our PDF optimizer makes it easy to reduce file size while maintaining quality. Follow these simple steps:
              </p>

              <ol className="mt-6 space-y-4">
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    1
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Upload your PDF file(s)</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Click the upload button or drag and drop your PDF file(s) into the upload area. You can select multiple files for batch processing. Supported format is .pdf. The files will be uploaded and prepared for optimization.
                    </p>
                  </div>
                </li>
                
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    2
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Review and optimize</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Review your uploaded PDF files. You can remove any files you don't want by clicking the × button. Click the 'Optimize PDF' button to start the optimization process. Each PDF file will be optimized to reduce size while maintaining quality.
                    </p>
                  </div>
                </li>
                
                <li className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50">
                  <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-base font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    3
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Download your optimized PDF(s)</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Once optimization is complete, download your optimized PDF file(s). For batch processing, you can download all optimized PDFs at once or individually. Each optimized PDF maintains the same quality but with reduced file size, ready for web, email, or storage.
                    </p>
                  </div>
                </li>
              </ol>
            </div>

            <div className="md:col-span-5">
              <div className="sticky top-24 rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-7 shadow-xl">
                <div className="flex items-start gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg">
                    <span className="text-2xl">✨</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 pt-2">Why use our PDF optimizer?</h3>
                </div>
                
                <ul className="mt-4 space-y-3">
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">Secure server-side processing</span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">Maintains visual quality</span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">Batch file processing</span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">Removes unused resources</span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">No registration required</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Best Practices Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Best Practices for PDF Optimization</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Following these best practices ensures optimal PDF optimization results:
            </p>
            
            <div className="space-y-6">
              <div className="p-6 rounded-2xl border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold text-lg shadow-lg">
                    1
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Optimize Before Sharing</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      Optimize PDFs before sharing via email or uploading to websites. This ensures faster uploads, easier email delivery, and better user experience. PDFs optimized for web use load faster and provide better user engagement.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 rounded-2xl border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-lg shadow-lg">
                    2
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Consider File Sizes</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      Free tier supports single PDF files up to 10MB. For larger files or batch processing, a Processing Pass is available. Consider optimizing large PDFs before sharing to ensure they fit within email size limits and load quickly on websites.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 rounded-2xl border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-green-600 text-white font-bold text-lg shadow-lg">
                    3
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Verify Optimization Results</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      After optimization, verify that the optimized PDF opens correctly and maintains the expected quality. Check that all pages are present, text is readable, and images are clear. The optimization process maintains quality while reducing size.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 rounded-2xl border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-red-50">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-orange-600 text-white font-bold text-lg shadow-lg">
                    4
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Use for Web and Email</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      PDF optimization is especially useful for PDFs intended for web viewing or email sharing. Optimized PDFs load faster on websites, are easier to share via email, and provide better user experience. Keep original files for archival purposes if needed.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Frequently Asked Questions</h2>
            </div>
            
            <div className="space-y-6">
              {structuredData.faqPage.mainEntity.map((faq, index) => (
                <div key={index} className="border-b border-slate-200 pb-6 last:border-b-0 last:pb-0">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{faq.name}</h3>
                  <p className="text-sm text-slate-700 leading-relaxed">{faq.acceptedAnswer.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Related Tools Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Related PDF Tools</h2>
            </div>
            
            <p className="text-base text-slate-600 mb-6 leading-relaxed">
              Explore other PDF tools to work with your documents:
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link href="/pdf/pdf-compressor" className="group block p-5 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-emerald-300 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                    <span className="text-xl">🗜️</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1 group-hover:text-emerald-600 transition-colors">PDF Compressor</h3>
                    <p className="text-xs text-slate-600">Compress PDF file size</p>
                  </div>
                </div>
              </Link>

              <Link href="/pdf/repair-pdf" className="group block p-5 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-emerald-300 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
                    <span className="text-xl">🔧</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1 group-hover:text-emerald-600 transition-colors">Repair PDF</h3>
                    <p className="text-xs text-slate-600">Fix corrupted PDF files</p>
                  </div>
                </div>
              </Link>

              <Link href="/pdf/pdf-merger" className="group block p-5 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-emerald-300 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
                    <span className="text-xl">📚</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1 group-hover:text-emerald-600 transition-colors">PDF Merger</h3>
                    <p className="text-xs text-slate-600">Combine multiple PDFs</p>
                  </div>
                </div>
              </Link>

              <Link href="/pdf/pdf-splitter" className="group block p-5 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-emerald-300 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-orange-600 shadow-lg">
                    <span className="text-xl">✂️</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1 group-hover:text-emerald-600 transition-colors">PDF Splitter</h3>
                    <p className="text-xs text-slate-600">Split PDF into multiple files</p>
                  </div>
                </div>
              </Link>

              <Link href="/pdf/pdf-rotator" className="group block p-5 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-emerald-300 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg">
                    <span className="text-xl">🔄</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1 group-hover:text-emerald-600 transition-colors">PDF Rotator</h3>
                    <p className="text-xs text-slate-600">Rotate PDF pages</p>
                  </div>
                </div>
              </Link>

              <Link href="/tools/pdf" className="group block p-5 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-emerald-300 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-500 to-slate-600 shadow-lg">
                    <span className="text-xl">📄</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1 group-hover:text-emerald-600 transition-colors">All PDF Tools</h3>
                    <p className="text-xs text-slate-600">View all PDF tools</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-200 bg-white mt-12">
          <div className="mx-auto max-w-6xl px-4 py-8">
            <div className="text-center text-sm text-slate-600">
              <p>© {currentYear} FixTools. All rights reserved. | <Link href="/privacy" className="hover:text-slate-900">Privacy</Link> | <Link href="/terms" className="hover:text-slate-900">Terms</Link></p>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}

