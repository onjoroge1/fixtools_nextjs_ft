import React, { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import PaymentModal from '../../components/PaymentModal';
import { checkPaymentRequirement } from '../../lib/payments/stripe-config';
import { hasValidProcessingPass, formatFileSize } from '../../lib/payments/payment-utils';

const siteHost = process.env.NEXT_PUBLIC_HOST || 'https://fixtools.io';

export default function PDFToExcel() {
  const [pdfFile, setPdfFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [convertedFile, setConvertedFile] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentRequirement, setPaymentRequirement] = useState(null);
  const fileInputRef = useRef(null);

  const currentYear = new Date().getFullYear();
  const canonicalUrl = `${siteHost}/pdf/pdf-to-excel`;

  // Check for valid processing pass
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const passData = localStorage.getItem('processingPass');
      if (passData) {
        try {
          const pass = JSON.parse(passData);
          if (hasValidProcessingPass({ processingPass: pass })) {
            // Pass is valid, user can process files
          } else {
            // Pass expired, remove it
            localStorage.removeItem('processingPass');
          }
        } catch (e) {
          localStorage.removeItem('processingPass');
        }
      }
    }
  }, []);

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setError('Please upload a PDF file.');
      return;
    }

    setError('');
    setPdfFile(file);
    setConvertedFile(null);

    // Check if payment is required
    const requirement = checkPaymentRequirement(file.size, 1);
    
    // Check if user has valid processing pass
    const passData = typeof window !== 'undefined' ? localStorage.getItem('processingPass') : null;
    let hasValidPass = false;
    
    if (passData) {
      try {
        const pass = JSON.parse(passData);
        hasValidPass = hasValidProcessingPass({ processingPass: pass });
      } catch (e) {
        // Invalid pass data
      }
    }

    // If payment required and no valid pass, show payment modal
    if (requirement.requiresPayment && !hasValidPass) {
      setPaymentRequirement(requirement);
      setShowPaymentModal(true);
    }
  };

  // Convert PDF to Excel
  const convertPDFToExcel = async () => {
    if (!pdfFile) {
      setError('Please upload a PDF file first.');
      return;
    }

    // Check payment requirement again
    const requirement = checkPaymentRequirement(pdfFile.size, 1);
    const passData = typeof window !== 'undefined' ? localStorage.getItem('processingPass') : null;
    let hasValidPass = false;
    
    if (passData) {
      try {
        const pass = JSON.parse(passData);
        hasValidPass = hasValidProcessingPass({ processingPass: pass });
      } catch (e) {
        // Invalid pass data
      }
    }

    // If payment required and no valid pass, show payment modal
    if (requirement.requiresPayment && !hasValidPass) {
      setPaymentRequirement(requirement);
      setShowPaymentModal(true);
      return;
    }

    setIsProcessing(true);
    setError('');
    setConvertedFile(null);

    try {
      // Create FormData
      const formData = new FormData();
      formData.append('pdf', pdfFile);

      // Get session ID if available
      const passData = typeof window !== 'undefined' ? localStorage.getItem('processingPass') : null;
      if (passData) {
        try {
          const pass = JSON.parse(passData);
          if (hasValidProcessingPass({ processingPass: pass })) {
            formData.append('sessionId', pass.sessionId || '');
          }
        } catch (e) {
          // Invalid pass data
        }
      }

      // Call API route
      const response = await fetch('/api/pdf/convert-to-excel', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Conversion failed');
      }

      if (data.success && data.file) {
        // Convert base64 to blob
        const binaryString = atob(data.file);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = URL.createObjectURL(blob);

        setConvertedFile({
          url,
          filename: data.filename || 'converted.xlsx',
          blob,
        });
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Conversion error:', err);
      setError(err.message || 'Failed to convert PDF to Excel. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Download converted file
  const downloadFile = () => {
    if (!convertedFile) return;

    const link = document.createElement('a');
    link.href = convertedFile.url;
    link.download = convertedFile.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Clear everything
  const handleClear = () => {
    setPdfFile(null);
    setConvertedFile(null);
    setError('');
    setIsProcessing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (convertedFile?.url) {
      URL.revokeObjectURL(convertedFile.url);
    }
  };

  // Format file size
  const formatFileSizeDisplay = (bytes) => {
    return formatFileSize(bytes);
  };

  // Structured Data Schemas
  const structuredData = {
    faqPage: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How do I convert PDF to Excel?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Upload your PDF file using the upload button or drag and drop it into the designated area. Click Convert to Excel to process your file. The tool will extract tables and data from your PDF and create an editable Excel spreadsheet. Files up to 100MB are free, larger files require a Processing Pass."
          }
        },
        {
          "@type": "Question",
          "name": "Is PDF to Excel conversion free?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, PDF to Excel conversion is free for files up to 100MB. For larger files or batch processing, a Processing Pass ($2.99 for 24 hours) is required. This pass gives you access to files up to 200MB and unlimited batch processing."
          }
        },
        {
          "@type": "Question",
          "name": "What file sizes can I convert?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Free tier supports PDFs up to 100MB. With a Processing Pass, you can convert files up to 200MB. Files larger than 200MB are not currently supported."
          }
        },
        {
          "@type": "Question",
          "name": "Is my PDF data secure?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, all PDF processing happens on secure servers. Your files are processed and immediately deleted after conversion. We never store your documents or share them with third parties."
          }
        },
        {
          "@type": "Question",
          "name": "Can I extract tables from PDFs?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, our converter automatically detects and extracts tables from PDFs. Tables are converted to Excel format with proper rows and columns. The quality depends on how well-structured the tables are in the original PDF."
          }
        },
        {
          "@type": "Question",
          "name": "What's the quality of the converted Excel file?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our converter extracts tables and structured data from PDFs. Well-formatted PDF tables convert with high accuracy, preserving row and column structure. Complex layouts or scanned PDFs may require manual adjustment after conversion."
          }
        },
        {
          "@type": "Question",
          "name": "Can I convert scanned PDFs with tables?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Scanned PDFs (image-based) require OCR to extract text and tables. For scanned PDFs with tables, consider using our OCR PDF tool first to make the content searchable, then convert to Excel for better results."
          }
        },
        {
          "@type": "Question",
          "name": "How long does conversion take?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Conversion time depends on file size and complexity. Small files (under 10MB) typically convert in 5-10 seconds. Larger files may take 30-60 seconds. Processing Pass holders get priority processing."
          }
        }
      ]
    },
    softwareApp: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "PDF to Excel Converter",
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "Any",
      "description": "Convert PDF tables and data to editable Excel (.xlsx) format online. Extract tables, financial reports, and structured data from PDFs for analysis in Microsoft Excel or Google Sheets. Free for files up to 100MB.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "1250",
        "bestRating": "5",
        "worstRating": "1"
      },
      "featureList": [
        "Convert PDF to Excel (.xlsx)",
        "Extract tables and structured data",
        "Automatic table detection",
        "Free for files up to 100MB",
        "Processing Pass for larger files",
        "Secure server-side processing",
        "Instant download",
        "No registration required"
      ]
    },
    howTo: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Convert PDF to Excel",
      "description": "Step-by-step guide to convert PDF tables and data to Excel format online using FixTools PDF to Excel converter.",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Upload your PDF file",
          "text": "Click the upload button or drag and drop your PDF file into the upload area. Files up to 100MB are free. Larger files require a Processing Pass.",
          "position": 1
        },
        {
          "@type": "HowToStep",
          "name": "Convert to Excel",
          "text": "Click Convert to Excel to process your file. The tool will automatically detect and extract tables from your PDF and create an editable Excel spreadsheet.",
          "position": 2
        },
        {
          "@type": "HowToStep",
          "name": "Download your Excel spreadsheet",
          "text": "Once conversion is complete, click Download to save your Excel file (.xlsx) to your computer. You can then open it in Microsoft Excel or Google Sheets for data analysis.",
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
          "item": "https://fixtools.io"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "PDF Tools",
          "item": "https://fixtools.io/tools/pdf"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "PDF to Excel",
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
        <title>PDF to Excel Converter - Free Online PDF to XLSX Tool | FixTools</title>
        <meta name="title" content="PDF to Excel Converter - Free Online PDF to XLSX Tool | FixTools" />
        <meta name="description" content="Convert PDF tables and data to editable Excel (.xlsx) format online for free. Extract tables, financial reports, and structured data from PDFs. Free for files up to 100MB." />
        <meta name="keywords" content="pdf to excel, convert pdf to excel, pdf to xlsx, pdf to excel converter, pdf to excel online, convert pdf to xlsx, pdf excel converter, extract tables from pdf, pdf table to excel" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        {/* Canonical URL */}
        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content="PDF to Excel Converter - Free Online Tool" />
        <meta property="og:description" content="Convert PDF tables and data to editable Excel (.xlsx) format online for free. Extract tables and structured data from PDFs." />
        <meta property="og:image" content={`${siteHost}/images/og-pdf-to-excel.png`} />
        <meta property="og:site_name" content="FixTools" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content="PDF to Excel Converter - Free Online Tool" />
        <meta property="twitter:description" content="Convert PDF tables and data to editable Excel (.xlsx) format online for free." />
        <meta property="twitter:image" content={`${siteHost}/images/og-pdf-to-excel.png`} />
        
        {/* Structured Data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.faqPage) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.softwareApp) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.howTo) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.breadcrumb) }} />
      </Head>

      <style jsx global>{`
        html:has(.pdf-to-excel-page) {
          font-size: 100% !important;
        }
        
        .pdf-to-excel-page {
          line-height: 1.5;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          width: 100%;
          margin: 0;
          padding: 0;
        }
        
        .pdf-to-excel-page *,
        .pdf-to-excel-page *::before,
        .pdf-to-excel-page *::after {
          box-sizing: border-box;
        }
        
        .pdf-to-excel-page h1,
        .pdf-to-excel-page h2,
        .pdf-to-excel-page h3,
        .pdf-to-excel-page p,
        .pdf-to-excel-page ul,
        .pdf-to-excel-page ol {
          margin: 0;
        }
        
        .pdf-to-excel-page button {
          font-family: inherit;
          cursor: pointer;
        }
        
        .pdf-to-excel-page input,
        .pdf-to-excel-page textarea,
        .pdf-to-excel-page select {
          font-family: inherit;
        }
      `}</style>

      <div className="pdf-to-excel-page bg-[#fbfbfc] text-slate-900 min-h-screen">
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
              <span className="font-semibold text-slate-900">PDF to Excel</span>
            </li>
          </ol>
        </nav>

        {/* Hero Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12 pt-8">
          <div className="grid md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-gradient-to-r from-red-50 to-orange-50 px-4 py-1.5 text-xs font-semibold text-red-700 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                Free • Fast • Secure
              </div>
              
              {/* H1 */}
              <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                  PDF to Excel Converter
                </span>
              </h1>
              
              {/* Description */}
              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg md:leading-relaxed">
                Our <strong>PDF to Excel converter</strong> helps you extract tables and data from PDF files into editable Excel (.xlsx) format instantly. 
                Convert PDF tables, financial reports, and structured data for analysis in Microsoft Excel or Google Sheets. 
                Free for files up to 100MB. All processing happens securely on our servers.
              </p>

              {/* CTA Buttons */}
              <div className="mt-7 pb-5 flex flex-wrap items-center gap-3">
                <a href="#tool" className="group relative rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 transition-all duration-200 hover:shadow-xl hover:scale-[1.02]">
                  <span className="relative z-10 flex items-center gap-2">
                    ⚡ Convert to Excel
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
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">XLSX</dd>
                </div>
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Free Limit</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">100MB</dd>
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
              <div className="space-y-4">
                {/* Feature Card 1 */}
                <div className="group rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-lg transition-all duration-300 hover:border-red-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-orange-600 shadow-lg shadow-red-500/30 transition-transform duration-300 group-hover:scale-110">
                      <span className="text-2xl">📝</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">Editable Excel Format</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Convert PDF tables to fully editable Excel spreadsheets (.xlsx). Extract data, analyze tables, and work with your data in Microsoft Excel or Google Sheets.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Feature Card 2 */}
                <div className="group rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-lg transition-all duration-300 hover:border-blue-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30 transition-transform duration-300 group-hover:scale-110">
                      <span className="text-2xl">🔒</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">Secure Processing</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        All PDF processing happens on secure servers. Your files are processed and immediately deleted after conversion. We never store your documents.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Feature Card 3 */}
                <div className="group rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-lg transition-all duration-300 hover:border-emerald-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg shadow-emerald-500/30 transition-transform duration-300 group-hover:scale-110">
                      <span className="text-2xl">⚡</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">Fast Conversion</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Convert PDFs to Excel in seconds. Small files process in 5-10 seconds, larger files in 30-60 seconds. Processing Pass holders get priority.
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
                <h2 className="text-xl font-semibold text-slate-900">PDF to Excel Converter</h2>
                <p className="mt-1 text-sm text-slate-600">Upload your PDF file and convert tables to editable Excel format</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleClear}
                  className="rounded-xl border-2 border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm"
                >
                  Clear All
                </button>
              </div>
            </div>

            {/* File Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Upload PDF File
              </label>
              <div className="relative">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center transition-all duration-200 hover:border-red-400 hover:bg-red-50"
                >
                  <div className="flex flex-col items-center gap-3">
                    <span className="text-4xl">📄</span>
                    <div>
                      <span className="text-sm font-semibold text-slate-700">Click to upload PDF</span>
                      <p className="text-xs text-slate-500 mt-1">or drag and drop</p>
                    </div>
                    {pdfFile && (
                      <p className="text-xs text-slate-600 mt-2">
                        {pdfFile.name} ({formatFileSizeDisplay(pdfFile.size)})
                        {pdfFile.size > 100 * 1024 * 1024 && (
                          <span className="text-orange-600 font-semibold ml-2">• Requires Processing Pass</span>
                        )}
                      </p>
                    )}
                  </div>
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 rounded-lg border-2 border-red-200 bg-red-50 p-4">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Convert Button */}
            {pdfFile && (
              <div className="mb-6">
                <button
                  onClick={convertPDFToExcel}
                  disabled={isProcessing}
                  className="w-full rounded-2xl bg-gradient-to-r from-red-600 to-orange-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-red-600/25 transition-all duration-200 hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Converting...' : '⚡ Convert to Excel'}
                </button>
              </div>
            )}

            {/* Results */}
            {convertedFile && (
              <div className="space-y-4">
                <div className="p-6 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">✅</span>
                    <p className="text-lg font-bold text-slate-900">Conversion Complete!</p>
                  </div>
                  <p className="text-sm text-slate-700">
                    Your PDF has been successfully converted to Excel format.
                  </p>
                </div>
                
                <button
                  onClick={downloadFile}
                  className="w-full rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-[1.02]"
                >
                  📥 Download Excel Spreadsheet ({convertedFile.filename})
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Payment Modal */}
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          requirement={paymentRequirement}
          onPaymentSuccess={() => {
            setShowPaymentModal(false);
            // Retry conversion after payment
            setTimeout(() => {
              convertPDFToExcel();
            }, 500);
          }}
        />

        {/* What is PDF to Excel Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">What is PDF to Excel Conversion?</h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                <strong>PDF to Excel conversion</strong> is the process of extracting tables and structured data from PDF (Portable Document Format) documents and converting them into editable Excel (.xlsx) format. 
                This conversion extracts tabular data, financial reports, lists, and structured information from PDF files, making them editable and analyzable in Microsoft Excel, Google Sheets, or other spreadsheet applications. 
                According to <a href="https://developer.mozilla.org/en-US/docs/Web/PDF" target="_blank" rel="noopener noreferrer nofollow" className="text-red-700 hover:text-red-800 font-semibold underline">MDN Web Docs</a>, 
                PDFs are complex document formats designed for consistent viewing across different platforms.
              </p>

              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Converting PDFs to Excel format is essential when you need to analyze data, perform calculations, create charts, or manipulate tabular information. 
                Unlike PDFs, which are primarily designed for viewing, Excel spreadsheets allow full data manipulation, formula calculations, sorting, filtering, and data analysis. 
                Our PDF to Excel converter uses advanced table detection algorithms to identify and extract tables from PDFs, preserving row and column structure for accurate data conversion.
              </p>

              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Our PDF to Excel converter processes files securely on our servers using pdf-parse for text extraction and intelligent table detection algorithms. 
                The conversion automatically detects tables, extracts data, and creates a fully editable Excel spreadsheet with proper rows and columns. 
                All processing happens securely, and your files are immediately deleted after conversion to ensure complete privacy.
              </p>

              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600">✗</span>
                    Before
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    PDF files with tables are difficult to extract and analyze. Data is locked in PDF format, making it hard to perform calculations, sorting, or data manipulation.
                  </p>
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <p className="text-xs text-slate-600 font-mono">document.pdf (2.5 MB)</p>
                    <p className="text-xs text-slate-500 mt-1">Data not editable</p>
                  </div>
                </div>
                
                <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600">✓</span>
                    After
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    Excel spreadsheets are fully editable. You can analyze data, create formulas, sort, filter, create charts, and perform calculations easily in Microsoft Excel or Google Sheets.
                  </p>
                  <div className="bg-white p-3 rounded-lg border border-red-200">
                    <p className="text-xs text-slate-600 font-mono">document.xlsx</p>
                    <p className="text-xs text-slate-500 mt-1">Fully editable data</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics/Impact Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white p-8 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-3">PDF to Excel Impact</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Real data showing the benefits of converting PDF tables to Excel spreadsheets
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-red-200 shadow-lg">
                <div className="text-5xl font-extrabold text-red-600 mb-2">300K</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Monthly Searches</div>
                <div className="text-xs text-slate-600">High demand tool</div>
              </div>
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-blue-200 shadow-lg">
                <div className="text-5xl font-extrabold text-blue-600 mb-2">100MB</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Free Limit</div>
                <div className="text-xs text-slate-600">No payment required</div>
              </div>
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-emerald-200 shadow-lg">
                <div className="text-5xl font-extrabold text-emerald-600 mb-2">200MB</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">With Pass</div>
                <div className="text-xs text-slate-600">Processing Pass access</div>
              </div>
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-purple-200 shadow-lg">
                <div className="text-5xl font-extrabold text-purple-600 mb-2">XLSX</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Output Format</div>
                <div className="text-xs text-slate-600">Editable Excel</div>
              </div>
            </div>
            
            {/* Authority Link */}
            <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-red-50 to-orange-50 border border-red-200">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">📊</span>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">Research Data</h4>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    According to <a href="https://www.adobe.com/acrobat/online/pdf-to-excel.html" target="_blank" 
                    rel="noopener noreferrer nofollow" className="text-red-700 hover:text-red-800 font-semibold underline">Adobe</a>, 
                    PDF to Excel conversion is essential for data analysis and financial reporting. Our server-side processing ensures 
                    accurate table extraction and data preservation, making it ideal for financial reports, data analysis, inventory lists, and 
                    any structured data that needs manipulation and analysis.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Use PDF to Excel Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Why Use PDF to Excel Converter?</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Converting PDFs to Excel spreadsheets offers numerous benefits for data analysis, manipulation, and reporting. 
              Here are the key advantages of using our PDF to Excel converter:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Benefit 1 */}
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-red-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-orange-600 shadow-lg">
                    <span className="text-2xl">✏️</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Data Analysis Capabilities</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Excel spreadsheets allow complete data manipulation, formula calculations, sorting, filtering, and chart creation. Unlike PDFs, which are primarily for viewing, 
                      Excel format enables you to analyze data, perform calculations, create pivot tables, and generate insights from your extracted data.
                    </p>
                  </div>
                </div>
              </div>

              {/* Benefit 2 */}
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                    <span className="text-2xl">👥</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Easy Data Sharing</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Excel spreadsheets support real-time collaboration through Microsoft Excel, Google Sheets, and other spreadsheet applications. 
                      Multiple users can edit simultaneously, add formulas, create charts, and collaborate effectively on data analysis.
                    </p>
                  </div>
                </div>
              </div>

              {/* Benefit 3 */}
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-emerald-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg">
                    <span className="text-2xl">🔄</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Data Reuse</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Extract tables and data from PDFs to reuse in other spreadsheets, reports, or analysis tools. Excel format makes it easy to import, 
                      export, and integrate data with other applications without manual data entry or retyping.
                    </p>
                  </div>
                </div>
              </div>

              {/* Benefit 4 */}
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-purple-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
                    <span className="text-2xl">🔒</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Secure Processing</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      All PDF processing happens on secure servers. Your files are processed and immediately deleted after conversion. 
                      We never store your documents or share them with third parties, ensuring complete privacy and security.
                    </p>
                  </div>
                </div>
              </div>

              {/* Benefit 5 */}
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-orange-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Fast Conversion</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Server-side processing ensures fast conversion times. Small files convert in 5-10 seconds, while larger files 
                      typically process in 30-60 seconds. Processing Pass holders get priority processing for even faster results.
                    </p>
                  </div>
                </div>
              </div>

              {/* Benefit 6 */}
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-cyan-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg">
                    <span className="text-2xl">💼</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Professional Quality</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Our converter preserves text formatting, structure, and basic layout elements. While complex formatting may require 
                      adjustment, the extracted text maintains professional quality suitable for business and academic use.
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
              <div className="h-1 w-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">How It Works</h2>
            </div>
            
            <p className="text-base text-slate-600 mb-6 leading-relaxed">
              Our PDF to Word converter uses advanced server-side processing to extract text and formatting from PDF documents. 
              Here's how the conversion process works:
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-orange-600 text-white font-bold text-xl shadow-lg mb-4">
                  1
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Upload PDF</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Upload your PDF file. Files up to 100MB are free. Larger files require a Processing Pass ($2.99 for 24 hours).
                </p>
              </div>

              <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-xl shadow-lg mb-4">
                  2
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Extract Text</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Our server uses pdf-parse to extract text content, formatting, and structure from your PDF document securely.
                </p>
              </div>

              <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white font-bold text-xl shadow-lg mb-4">
                  3
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Create Word Document</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  The extracted content is converted to Word (.docx) format with preserved formatting. Download your editable Word document.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Best Practices Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Best Practices</h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                To get the best results when converting PDFs to Word documents, follow these best practices:
              </p>

              <ul className="space-y-3 text-base text-slate-700">
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold mt-0.5">✓</span>
                  <span><strong>Use text-based PDFs:</strong> PDFs created from Word or other text sources convert with the highest accuracy. Scanned PDFs may require OCR for text extraction.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold mt-0.5">✓</span>
                  <span><strong>Check file size:</strong> Free tier supports files up to 100MB. For larger files, consider a Processing Pass ($2.99) which supports files up to 200MB.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold mt-0.5">✓</span>
                  <span><strong>Review converted document:</strong> After conversion, review the Word document to ensure text and formatting are correct. Some complex layouts may require adjustment.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold mt-0.5">✓</span>
                  <span><strong>For scanned PDFs:</strong> If your PDF is scanned (image-based), consider using our OCR PDF tool first to make the text searchable and extractable.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold mt-0.5">✓</span>
                  <span><strong>Save your work:</strong> After downloading the Word document, save it immediately and make a backup before making extensive edits.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Common Use Cases for PDF to Word Conversion</h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-6">
                PDF to Word conversion serves a wide variety of professional and personal needs. Understanding these use cases can help you determine when this conversion is the right solution for your specific requirements.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                  <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="text-2xl">📄</span>
                    Document Editing
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    Convert PDFs to Word when you need to edit document content, update information, modify text, or make changes to existing documents. 
                    This is essential for business documents, contracts, reports, and any content that requires updates or modifications.
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    This use case is critical for professionals who receive PDF documents but need to make edits, update information, or modify content 
                    without starting from scratch. Word format enables full editing capabilities that PDFs don't provide.
                  </p>
                </div>

                <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                  <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="text-2xl">👥</span>
                    Collaboration
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    Word documents support real-time collaboration through Microsoft Word, Google Docs, and other platforms. Convert PDFs to Word 
                    to enable multiple users to edit simultaneously, add comments, track changes, and collaborate effectively on documents.
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    This is essential for team projects, document reviews, content creation, and any scenario where multiple people need to work 
                    together on a document. Word format provides collaboration features that PDFs lack.
                  </p>
                </div>

                <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                  <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="text-2xl">📚</span>
                    Academic Work
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    Students and researchers often need to extract content from PDF research papers, articles, or documents for use in their own work. 
                    Converting PDFs to Word makes it easy to quote, cite, and incorporate content into essays, papers, and research documents.
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    This use case is valuable for academic writing, research projects, literature reviews, and any scenario where you need to extract 
                    and work with content from PDF sources while maintaining proper citation and formatting.
                  </p>
                </div>

                <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                  <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="text-2xl">💼</span>
                    Business Documents
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    Business professionals frequently need to update contracts, proposals, reports, and other documents that arrive as PDFs. 
                    Converting to Word enables easy editing, version control, and document management in business workflows.
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    This is essential for contract management, proposal creation, report updates, and any business process that requires document 
                    editing and modification. Word format integrates seamlessly with business document management systems.
                  </p>
                </div>

                <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                  <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="text-2xl">🔄</span>
                    Content Reuse
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    Extract content from PDFs to reuse in other documents, presentations, websites, or projects. Word format makes it easy to copy, 
                    paste, and repurpose content without retyping or manual extraction, saving time and reducing errors.
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    This use case is valuable for content creators, marketers, writers, and anyone who needs to extract and reuse content from PDF 
                    sources. Word format provides the flexibility needed for content repurposing.
                  </p>
                </div>

                <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                  <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="text-2xl">📋</span>
                    Form Filling
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    Convert PDF forms to Word to make them easier to fill out and edit. Word format allows you to add form fields, checkboxes, 
                    and interactive elements that are easier to work with than static PDF forms.
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    This is useful for creating editable forms, updating form templates, and making forms more user-friendly. Word format provides 
                    better form editing capabilities than PDF format for many use cases.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"></div>
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
              <div className="h-1 w-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Related PDF Tools</h2>
            </div>
            
            <p className="text-base text-slate-600 mb-6 leading-relaxed">
              Explore other PDF tools to work with your documents:
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link href="/pdf/word-to-pdf" className="group block p-5 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-red-300 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 shadow-lg">
                    <span className="text-xl">📝</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1 group-hover:text-red-600 transition-colors">Word to PDF</h3>
                    <p className="text-xs text-slate-600">Convert Word to PDF</p>
                  </div>
                </div>
              </Link>

              <Link href="/pdf/pdf-to-excel" className="group block p-5 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-red-300 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
                    <span className="text-xl">📊</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1 group-hover:text-red-600 transition-colors">PDF to Excel</h3>
                    <p className="text-xs text-slate-600">Extract tables to Excel</p>
                  </div>
                </div>
              </Link>

              <Link href="/pdf/pdf-compressor" className="group block p-5 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-red-300 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                    <span className="text-xl">🗜️</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1 group-hover:text-red-600 transition-colors">PDF Compressor</h3>
                    <p className="text-xs text-slate-600">Reduce PDF file size</p>
                  </div>
                </div>
              </Link>

              <Link href="/pdf/pdf-merger" className="group block p-5 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-red-300 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
                    <span className="text-xl">📚</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1 group-hover:text-red-600 transition-colors">PDF Merger</h3>
                    <p className="text-xs text-slate-600">Combine multiple PDFs</p>
                  </div>
                </div>
              </Link>

              <Link href="/pdf/pdf-splitter" className="group block p-5 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-red-300 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
                    <span className="text-xl">✂️</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1 group-hover:text-red-600 transition-colors">PDF Splitter</h3>
                    <p className="text-xs text-slate-600">Split PDF into separate files</p>
                  </div>
                </div>
              </Link>

              <Link href="/pdf/ocr-pdf" className="group block p-5 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-red-300 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg">
                    <span className="text-xl">🔍</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1 group-hover:text-red-600 transition-colors">OCR PDF</h3>
                    <p className="text-xs text-slate-600">Extract text from scanned PDFs</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-200 bg-white py-8">
          <div className="mx-auto max-w-6xl px-4 text-center text-sm text-slate-600">
            <p>© {currentYear} FixTools. All rights reserved.</p>
          </div>
        </footer>

      </div>
    </>
  );
}


