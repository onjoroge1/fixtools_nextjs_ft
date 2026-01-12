import React, { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import PaymentModal from '../../components/PaymentModal';
import { checkPaymentRequirement as checkPaymentRequirementNew, getUserPlan, hasValidProcessingPass as hasValidProcessingPassNew } from '../../lib/config/pricing';

const siteHost = process.env.NEXT_PUBLIC_HOST || 'https://fixtools.io';

export default function TxtToPDF() {
  const [txtFiles, setTxtFiles] = useState([]);
  const [convertedFiles, setConvertedFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [error, setError] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentRequirement, setPaymentRequirement] = useState(null);
  const [userSession, setUserSession] = useState({ processingPass: null });
  const [conversionOptions, setConversionOptions] = useState({
    fontSize: 12,
    pageSize: 'letter',
    margin: 72,
    lineHeight: 1.5,
  });
  const fileInputRef = useRef(null);

  const currentYear = new Date().getFullYear();
  const canonicalUrl = `${siteHost}/pdf/txt-to-pdf`;

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

  // Handle file upload (multiple text files)
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Filter for text files
    const validTxtFiles = files.filter(file => 
      file.type === 'text/plain' || 
      /\.(txt|text)$/i.test(file.name)
    );

    if (validTxtFiles.length === 0) {
      setError('Please upload text files (.txt).');
      return;
    }

    if (validTxtFiles.length !== files.length) {
      setError(`Some files were skipped. Only text files (.txt) are supported. ${validTxtFiles.length} of ${files.length} files are valid.`);
    } else {
      setError('');
    }

    // Calculate total file size
    const totalSize = validTxtFiles.reduce((sum, file) => sum + file.size, 0);
    const fileCount = validTxtFiles.length;

    // Check payment requirement using new centralized config
    const userPlan = getUserPlan(userSession);
    const requirement = checkPaymentRequirementNew('pdf', totalSize, fileCount, userPlan);

    // If payment required and no valid pass, show payment modal
    if (requirement.requiresPayment) {
      setPaymentRequirement(requirement);
      setShowPaymentModal(true);
      // Don't set files yet - wait for payment
      return;
    }

    setTxtFiles(validTxtFiles);
    setConvertedFiles([]);
  };

  // Convert text files to PDF
  const convertTxtToPDF = async () => {
    if (txtFiles.length === 0) {
      setError('Please upload at least one text file first.');
      return;
    }

    // Check payment requirement again
    const totalSize = txtFiles.reduce((sum, file) => sum + file.size, 0);
    const fileCount = txtFiles.length;
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
    setProgress({ current: 0, total: txtFiles.length });

    try {
      const formData = new FormData();
      
      // Add files
      txtFiles.forEach((file) => {
        formData.append('txt', file);
      });

      // Add options
      formData.append('fontSize', conversionOptions.fontSize.toString());
      formData.append('pageSize', conversionOptions.pageSize);
      formData.append('margin', conversionOptions.margin.toString());
      formData.append('lineHeight', conversionOptions.lineHeight.toString());

      // Add session ID if available
      const passData = localStorage.getItem('processingPass');
      if (passData) {
        try {
          const pass = JSON.parse(passData);
          if (pass.sessionId) {
            formData.append('sessionId', pass.sessionId);
          }
        } catch (e) {
          // Invalid pass data
        }
      }

      const response = await fetch('/api/pdf/txt-to-pdf', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 402) {
          // Payment required
          setPaymentRequirement(data.requirement);
          setShowPaymentModal(true);
          setIsProcessing(false);
          return;
        }
        throw new Error(data.error || data.message || 'Failed to convert text to PDF');
      }

      if (data.success) {
        if (data.files && Array.isArray(data.files)) {
          // Batch processing
          setConvertedFiles(data.files);
        } else if (data.file) {
          // Single file
          setConvertedFiles([{ file: data.file, filename: data.filename, stats: data.stats }]);
        }
      }
    } catch (err) {
      console.error('Conversion error:', err);
      setError('Failed to convert text to PDF: ' + (err.message || 'Unknown error'));
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
    // Retry conversion if files are already selected
    if (txtFiles.length > 0) {
      convertTxtToPDF();
    }
  };

  // Download PDF
  const handleDownload = (fileData, index) => {
    if (!fileData || !fileData.file) {
      setError('No PDF to download. Please convert text files first.');
      return;
    }

    const link = document.createElement('a');
    link.href = `data:application/pdf;base64,${fileData.file}`;
    link.download = fileData.filename || `text-to-pdf-${index + 1}.pdf`;
    link.click();
  };

  // Remove text file from list
  const removeTxtFile = (index) => {
    const newFiles = txtFiles.filter((_, i) => i !== index);
    setTxtFiles(newFiles);
    setConvertedFiles([]);
  };

  // Clear everything
  const handleClear = () => {
    setTxtFiles([]);
    setConvertedFiles([]);
    setError('');
    setIsProcessing(false);
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
  const totalSize = txtFiles.reduce((sum, file) => sum + file.size, 0);

  // Structured Data Schemas
  const structuredData = {
    faqPage: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How do I convert text files to PDF?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Upload one or more text files (.txt) using the upload button or drag and drop them into the designated area. You can select multiple text files at once for batch processing. Configure PDF options like font size, page size, and margins if needed. Click 'Convert to PDF' to create PDF documents from your text files. Once conversion is complete, download your PDF file(s)."
          }
        },
        {
          "@type": "Question",
          "name": "Is text to PDF conversion free?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, our text to PDF converter is free for single text files up to 10MB. For larger files (above 10MB) or batch processing (multiple files), a Processing Pass is required. All processing happens on our secure servers, ensuring your text files are processed quickly and efficiently."
          }
        },
        {
          "@type": "Question",
          "name": "What text file formats are supported?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our tool supports plain text files with .txt or .text extensions. The tool reads UTF-8 encoded text files and converts them to PDF format with proper text wrapping, page breaks, and formatting. Unicode characters are supported, though some special characters may be replaced with ASCII equivalents for PDF compatibility."
          }
        },
        {
          "@type": "Question",
          "name": "Can I convert multiple text files to PDF at once?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! You can upload multiple text files at once and they will all be converted to separate PDF documents. Each text file becomes its own PDF file. For batch processing (2+ files), a Processing Pass is required for free tier users. Paid users can process up to 20 files in a single batch."
          }
        },
        {
          "@type": "Question",
          "name": "Is my text data secure when converting?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, your text files are processed securely on our servers. Files are automatically deleted after processing is complete. We do not store, share, or access your text content. For maximum privacy, consider using our Processing Pass for larger files, which ensures priority processing and enhanced security."
          }
        },
        {
          "@type": "Question",
          "name": "What file size limits apply?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Free tier supports single text files up to 10MB. For larger files (up to 500MB) or batch processing multiple files, a Processing Pass is required. The Processing Pass costs $3.99 and is valid for 24 hours, allowing unlimited conversions during that period."
          }
        },
        {
          "@type": "Question",
          "name": "Can I customize the PDF output?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, you can customize several PDF options including font size (default 12pt), page size (Letter, A4, or Legal), margins (default 1 inch), and line height (default 1.5). These options help you create PDFs that match your formatting preferences and document requirements."
          }
        },
        {
          "@type": "Question",
          "name": "Will text formatting be preserved in the PDF?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The tool preserves line breaks and paragraph structure from your text file. Text is automatically wrapped to fit page margins, and long lines are broken appropriately. The PDF maintains the original text content with proper spacing and readability, formatted according to your selected options."
          }
        }
      ]
    },
    softwareApp: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "TXT to PDF - Convert Text Files to PDF Online",
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "Any",
      "description": "Free online tool to convert text files to PDF. Convert .txt files to PDF format with customizable options. Batch processing supported. Works securely on our servers with automatic file cleanup.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.7",
        "ratingCount": "920",
        "bestRating": "5",
        "worstRating": "1"
      },
      "featureList": [
        "Convert text files to PDF",
        "Batch text file processing",
        "Customizable PDF options",
        "Secure server-side processing",
        "Automatic file cleanup",
        "No registration required",
        "Download PDF instantly",
        "UTF-8 text support"
      ]
    },
    howTo: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Convert Text Files to PDF",
      "description": "Step-by-step guide to convert text files to PDF format online.",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Upload your text files",
          "text": "Click the upload button or drag and drop your text files (.txt) into the upload area. You can select multiple text files at once for batch processing. Supported format is plain text (.txt) with UTF-8 encoding. Wait for the files to load.",
          "position": 1
        },
        {
          "@type": "HowToStep",
          "name": "Configure PDF options",
          "text": "Optionally configure PDF settings like font size (default 12pt), page size (Letter, A4, or Legal), margins (default 1 inch), and line height (default 1.5). These options help customize the PDF output to match your needs.",
          "position": 2
        },
        {
          "@type": "HowToStep",
          "name": "Convert and download",
          "text": "Click the 'Convert to PDF' button to start the conversion process. Each text file will be converted to a separate PDF document. Once conversion is complete, click 'Download PDF' to save your PDF file(s).",
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
          "name": "TXT to PDF",
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
        <title>TXT to PDF - Free Online Text to PDF Converter | FixTools</title>
        <meta name="title" content="TXT to PDF - Free Online Text to PDF Converter | FixTools" />
        <meta name="description" content="Convert text files to PDF online for free. Convert .txt files to PDF format with customizable options. Batch processing supported. Works securely on our servers - fast, reliable, no registration required." />
        <meta name="keywords" content="txt to pdf, convert txt to pdf, text to pdf, convert text to pdf, txt to pdf converter, text file to pdf, .txt to pdf, convert .txt to pdf online" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        {/* Canonical URL */}
        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content="TXT to PDF - Free Online Text to PDF Converter" />
        <meta property="og:description" content="Convert text files to PDF online for free. Convert .txt files to PDF format with customizable options. Batch processing supported." />
        <meta property="og:image" content={`${siteHost}/images/og-txt-to-pdf.png`} />
        <meta property="og:site_name" content="FixTools" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content="TXT to PDF - Free Online Text to PDF Converter" />
        <meta property="twitter:description" content="Convert text files to PDF online for free. Convert .txt files to PDF format with customizable options." />
        <meta property="twitter:image" content={`${siteHost}/images/og-txt-to-pdf.png`} />
        
        {/* Structured Data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.faqPage) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.softwareApp) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.howTo) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.breadcrumb) }} />
      </Head>

      <style jsx global>{`
        html:has(.txt-to-pdf-page) {
          font-size: 100% !important;
        }
        
        .txt-to-pdf-page {
          line-height: 1.5;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          width: 100%;
          min-height: 100vh;
        }
        
        .txt-to-pdf-page *,
        .txt-to-pdf-page *::before,
        .txt-to-pdf-page *::after {
          box-sizing: border-box;
        }
        
        .txt-to-pdf-page h1,
        .txt-to-pdf-page h2,
        .txt-to-pdf-page h3,
        .txt-to-pdf-page p,
        .txt-to-pdf-page ul,
        .txt-to-pdf-page ol {
          margin: 0;
        }
        
        .txt-to-pdf-page button {
          font-family: inherit;
          cursor: pointer;
        }
        
        .txt-to-pdf-page input,
        .txt-to-pdf-page textarea,
        .txt-to-pdf-page select {
          font-family: inherit;
        }
      `}</style>

      <div className="txt-to-pdf-page bg-[#fbfbfc] text-slate-900 min-h-screen">
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
              <span className="font-semibold text-slate-900">TXT to PDF</span>
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
                  TXT to PDF
                </span>
              </h1>
              
              {/* Description - MUST include primary keyword in first 100 words */}
              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg md:leading-relaxed">
                Our <strong>TXT to PDF</strong> tool helps you convert text files to PDF format instantly. Convert .txt files to PDF documents with customizable options. Batch processing supported for multiple files. Works securely on our servers - fast, reliable, no registration required.
              </p>

              {/* CTA Buttons */}
              <div className="mt-7 pb-5 flex flex-wrap items-center gap-3">
                <a href="#tool" className="group relative rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 transition-all duration-200 hover:shadow-xl hover:scale-[1.02]">
                  <span className="relative z-10 flex items-center gap-2">
                    ⚡ Convert Text Files
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
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">.txt</dd>
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
                      <span className="text-2xl">📄</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">Text File Support</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Supports plain text files (.txt) with UTF-8 encoding. Convert any text document to PDF with proper formatting and text wrapping.
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Feature Card 2 */}
                <div className="feature-card group rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-lg transition-all duration-300 hover:border-blue-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30 transition-transform duration-300 group-hover:scale-110">
                      <span className="text-2xl">⚙️</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">Customizable Options</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Configure font size, page size (Letter, A4, Legal), margins, and line height to create PDFs that match your requirements.
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
                        All conversion happens on secure servers. Files are automatically deleted after processing to ensure your data remains private.
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
                <h2 className="text-xl font-semibold text-slate-900">Convert Text Files to PDF</h2>
                <p className="mt-1 text-sm text-slate-600">Upload one or more text files to convert to PDF format</p>
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
                Upload Text Files {txtFiles.length > 0 && `(${txtFiles.length} selected)`}
              </label>
              <div className="relative">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt,.text,text/plain"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center transition-all duration-200 hover:border-emerald-400 hover:bg-emerald-50"
                >
                  <div className="flex flex-col items-center gap-3">
                    <span className="text-4xl">📄</span>
                    <div>
                      <span className="text-sm font-semibold text-slate-700">Click to upload text files</span>
                      <p className="text-xs text-slate-500 mt-1">or drag and drop (.txt files)</p>
                    </div>
                    {totalSize > 0 && (
                      <p className="text-xs text-slate-600 mt-2">
                        {txtFiles.length} file{txtFiles.length !== 1 ? 's' : ''} • {formatFileSize(totalSize)}
                      </p>
                    )}
                  </div>
                </button>
              </div>
            </div>

            {/* Text Files List */}
            {txtFiles.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Selected Text Files
                </label>
                <div className="space-y-2">
                  {txtFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between rounded-xl border-2 border-slate-200 bg-slate-50 p-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className="text-2xl">📄</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate" title={file.name}>{file.name}</p>
                          <p className="text-xs text-slate-500">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeTxtFile(index)}
                        className="ml-3 rounded-lg bg-red-500 text-white px-3 py-1.5 text-xs font-medium hover:bg-red-600 transition-colors"
                        title="Remove"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PDF Options */}
            {txtFiles.length > 0 && (
              <div className="mb-6 rounded-xl border-2 border-slate-200 bg-slate-50 p-4">
                <h3 className="text-sm font-semibold text-slate-900 mb-4">PDF Options</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Font Size</label>
                    <input
                      type="number"
                      min="8"
                      max="24"
                      value={conversionOptions.fontSize}
                      onChange={(e) => setConversionOptions({ ...conversionOptions, fontSize: parseInt(e.target.value) || 12 })}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Page Size</label>
                    <select
                      value={conversionOptions.pageSize}
                      onChange={(e) => setConversionOptions({ ...conversionOptions, pageSize: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                    >
                      <option value="letter">Letter (8.5" × 11")</option>
                      <option value="a4">A4 (210 × 297mm)</option>
                      <option value="legal">Legal (8.5" × 14")</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Margin (points)</label>
                    <input
                      type="number"
                      min="36"
                      max="144"
                      value={conversionOptions.margin}
                      onChange={(e) => setConversionOptions({ ...conversionOptions, margin: parseInt(e.target.value) || 72 })}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Line Height</label>
                    <input
                      type="number"
                      min="1"
                      max="3"
                      step="0.1"
                      value={conversionOptions.lineHeight}
                      onChange={(e) => setConversionOptions({ ...conversionOptions, lineHeight: parseFloat(e.target.value) || 1.5 })}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 rounded-lg border-2 border-red-200 bg-red-50 p-4">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Convert Button */}
            {txtFiles.length > 0 && !isProcessing && (
              <div className="mb-6">
                <button
                  onClick={convertTxtToPDF}
                  disabled={isProcessing}
                  className="w-full rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition-all duration-200 hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Converting...' : `⚡ Convert ${txtFiles.length} Text File${txtFiles.length !== 1 ? 's' : ''} to PDF`}
                </button>
              </div>
            )}

            {/* Processing Indicator */}
            {isProcessing && (
              <div className="mb-6 rounded-lg border-2 border-blue-200 bg-blue-50 p-4">
                <div className="flex items-center justify-center gap-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  <p className="text-sm font-semibold text-blue-900">Converting text files to PDF...</p>
                </div>
                {progress.total > 0 && (
                  <div className="mt-3">
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(progress.current / progress.total) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 text-center">
                      Processing {progress.current} of {progress.total} files
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Download PDFs */}
            {convertedFiles.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-slate-800">
                    PDF{convertedFiles.length > 1 ? 's' : ''} Ready ({convertedFiles.length})
                  </label>
                </div>
                <div className="space-y-3">
                  {convertedFiles.map((fileData, index) => (
                    <div key={index} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <span className="text-2xl">📄</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 truncate" title={fileData.filename}>
                              {fileData.filename || `text-to-pdf-${index + 1}.pdf`}
                            </p>
                            {fileData.stats && (
                              <p className="text-xs text-slate-500 mt-1">
                                {fileData.stats.lines} lines • {fileData.stats.words} words • {fileData.stats.characters} characters
                              </p>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => handleDownload(fileData, index)}
                          className="ml-3 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 px-4 py-2 text-xs font-semibold text-white hover:shadow-md transition-all"
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

        {/* What is TXT to PDF Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">What is TXT to PDF Conversion?</h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                <strong>TXT to PDF</strong> conversion is the process of converting plain text files (.txt) into PDF documents. This is useful for creating professional documents from text files, archiving text content in a standardized format, sharing text documents that can be viewed on any device, and converting notes or code snippets to PDF format.
              </p>
              
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                According to <a href="https://www.w3.org/TR/encoding/" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">W3C Encoding Standards</a>, text files are typically encoded in UTF-8, which supports international characters and symbols. Our TXT to PDF tool reads UTF-8 encoded text files and converts them to PDF format with proper text wrapping, page breaks, and formatting. The <a href="https://pdf-lib.js.org/" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">pdf-lib library</a> provides comprehensive PDF creation capabilities that ensure text is properly formatted and readable in the resulting PDF.
              </p>

              <p className="text-base text-slate-700 leading-relaxed mb-4">
                TXT to PDF conversion is essential for document management, creating professional documents from plain text, archiving text content, sharing text files in a universal format, and converting code or notes to PDF. PDF format ensures text documents are preserved with proper formatting and can be viewed on any device or platform without requiring specific text editors.
              </p>
            </div>
          </div>
        </section>

        {/* Why Use TXT to PDF Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Why Use TXT to PDF?</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Converting text files to PDF offers numerous benefits:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-emerald-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg">
                    <span className="text-2xl">📚</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Document Archiving</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Convert text files to PDF for long-term archiving. PDF format ensures documents remain accessible and readable for years to come, regardless of software changes or device updates. PDFs are standardized and widely supported across all platforms.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                    <span className="text-2xl">📄</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Professional Formatting</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Create professional-looking documents from plain text files. PDF format provides consistent formatting, proper page breaks, and professional appearance that's suitable for sharing, printing, or archiving important text content.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-purple-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
                    <span className="text-2xl">🌐</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Universal Compatibility</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      PDF format is universally supported across all devices and platforms. Convert text files to PDF to ensure your documents can be viewed on any computer, tablet, or smartphone without requiring specific text editors or software.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-orange-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg">
                    <span className="text-2xl">🔒</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Secure Sharing</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      PDF format provides better security and control over document sharing. Convert text files to PDF to protect your content, control who can view or edit documents, and ensure consistent formatting when sharing with others.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how" className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">How It Works</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Our TXT to PDF converter makes it easy to convert text files to PDF format:
            </p>
            
            <div className="space-y-6">
              {structuredData.howTo.step.map((step, index) => (
                <div key={index} className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-r from-slate-50 to-white">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white font-bold text-lg shadow-lg">
                      {step.position}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-900 mb-2">{step.name}</h3>
                      <p className="text-sm text-slate-700 leading-relaxed">{step.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Best Practices Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Best Practices for TXT to PDF</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Following these best practices ensures optimal PDF conversion results:
            </p>
            
            <div className="space-y-6">
              <div className="p-6 rounded-2xl border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold text-lg shadow-lg">
                    1
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Use UTF-8 Encoding</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      Ensure your text files are saved in UTF-8 encoding for best results. UTF-8 supports international characters, special symbols, and ensures proper text conversion. Most text editors default to UTF-8, but verify your file encoding before conversion.
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
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Choose Appropriate Page Size</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      Select the page size that matches your document requirements. Letter (8.5" × 11") is standard for US documents, A4 (210 × 297mm) for international documents, and Legal (8.5" × 14") for longer documents. The tool automatically adjusts text wrapping based on your selection.
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
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Adjust Font Size and Margins</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      Customize font size (8-24pt) and margins (36-144 points) to match your document needs. Larger fonts and margins create more readable documents, while smaller settings allow more content per page. Default settings (12pt font, 72pt margins) work well for most documents.
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
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Consider File Size Limits</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      Free tier supports single text files up to 10MB. For larger files (up to 500MB) or batch processing multiple files, a Processing Pass is available. Consider splitting very large text files or upgrading to a Processing Pass for unlimited conversions.
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
              <Link href="/pdf/pdf-to-txt" className="group block p-5 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-emerald-300 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 shadow-lg">
                    <span className="text-xl">📝</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1 group-hover:text-emerald-600 transition-colors">PDF to TXT</h3>
                    <p className="text-xs text-slate-600">Extract text from PDF files</p>
                  </div>
                </div>
              </Link>

              <Link href="/pdf/word-to-pdf" className="group block p-5 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-emerald-300 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg">
                    <span className="text-xl">📝</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1 group-hover:text-emerald-600 transition-colors">Word to PDF</h3>
                    <p className="text-xs text-slate-600">Convert Word to PDF</p>
                  </div>
                </div>
              </Link>

              <Link href="/pdf/image-to-pdf" className="group block p-5 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-emerald-300 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-orange-600 shadow-lg">
                    <span className="text-xl">🖼️</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1 group-hover:text-emerald-600 transition-colors">Image to PDF</h3>
                    <p className="text-xs text-slate-600">Convert images to PDF</p>
                  </div>
                </div>
              </Link>

              <Link href="/pdf/pdf-compressor" className="group block p-5 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-emerald-300 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                    <span className="text-xl">🗜️</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1 group-hover:text-emerald-600 transition-colors">PDF Compressor</h3>
                    <p className="text-xs text-slate-600">Reduce PDF file size</p>
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

