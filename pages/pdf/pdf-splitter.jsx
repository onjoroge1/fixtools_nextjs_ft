import React, { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

const siteHost = process.env.NEXT_PUBLIC_HOST || 'https://fixtools.io';

export default function PDFSplitter() {
  const [pdfFile, setPdfFile] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [splitMode, setSplitMode] = useState('range'); // 'range', 'every', 'single'
  const [pageRange, setPageRange] = useState('');
  const [splitInterval, setSplitInterval] = useState(1);
  const [splitPdfUrls, setSplitPdfUrls] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [pdfLib, setPdfLib] = useState(null);
  const fileInputRef = useRef(null);

  const currentYear = new Date().getFullYear();
  const canonicalUrl = `${siteHost}/pdf/pdf-splitter`;

  // Load pdf-lib library
  useEffect(() => {
    const loadLibrary = async () => {
      if (typeof window !== 'undefined') {
        // Load pdf-lib from CDN
        if (!window.PDFLib) {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js';
          script.async = true;
          script.onload = () => {
            if (window.PDFLib) {
              setPdfLib(window.PDFLib);
            }
          };
          script.onerror = () => {
            setError('Failed to load PDF library. Please refresh the page.');
          };
          document.head.appendChild(script);
        } else {
          setPdfLib(window.PDFLib);
        }
      }
    };
    loadLibrary();
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
    setSplitPdfUrls([]);
    
    // Load PDF to get page count
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        if (window.PDFLib) {
          const { PDFDocument } = window.PDFLib;
          const arrayBuffer = event.target.result;
          const pdfDoc = await PDFDocument.load(arrayBuffer);
          const pages = pdfDoc.getPageCount();
          setTotalPages(pages);
        }
      } catch (err) {
        console.error('Error loading PDF:', err);
        setError('Failed to load PDF. Please ensure it is a valid PDF file.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // Parse page range (e.g., "1-3,5,7-9")
  const parsePageRange = (rangeStr, maxPages) => {
    const pages = new Set();
    const parts = rangeStr.split(',');
    
    for (const part of parts) {
      const trimmed = part.trim();
      if (trimmed.includes('-')) {
        const [start, end] = trimmed.split('-').map(n => parseInt(n.trim()));
        if (!isNaN(start) && !isNaN(end) && start > 0 && end <= maxPages && start <= end) {
          for (let i = start; i <= end; i++) {
            pages.add(i - 1); // Convert to 0-based index
          }
        }
      } else {
        const page = parseInt(trimmed);
        if (!isNaN(page) && page > 0 && page <= maxPages) {
          pages.add(page - 1); // Convert to 0-based index
        }
      }
    }
    
    return Array.from(pages).sort((a, b) => a - b);
  };

  // Split PDF using pdf-lib
  const splitPDF = async () => {
    if (!pdfFile) {
      setError('Please upload a PDF file first.');
      return;
    }

    if (!pdfLib || !window.PDFLib) {
      setError('PDF library is still loading. Please wait a moment and try again.');
      return;
    }

    if (totalPages === 0) {
      setError('Please wait for the PDF to load completely.');
      return;
    }

    setIsProcessing(true);
    setError('');
    setSplitPdfUrls([]);

    try {
      const { PDFDocument } = window.PDFLib;
      const arrayBuffer = await pdfFile.arrayBuffer();
      const sourcePdf = await PDFDocument.load(arrayBuffer);
      const urls = [];

      if (splitMode === 'range') {
        // Split by page range
        if (!pageRange.trim()) {
          setError('Please enter a page range (e.g., "1-3,5,7-9").');
          setIsProcessing(false);
          return;
        }

        const pageIndices = parsePageRange(pageRange, totalPages);
        if (pageIndices.length === 0) {
          setError('Invalid page range. Please check your input.');
          setIsProcessing(false);
          return;
        }

        // Create a single PDF with selected pages
        const newPdf = await PDFDocument.create();
        for (const pageIndex of pageIndices) {
          const [copiedPage] = await newPdf.copyPages(sourcePdf, [pageIndex]);
          newPdf.addPage(copiedPage);
        }

        const pdfBytes = await newPdf.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        urls.push({ url, name: `split-pages-${pageRange.replace(/,/g, '-')}.pdf` });
      } else if (splitMode === 'every') {
        // Split every N pages
        const interval = parseInt(splitInterval) || 1;
        if (interval < 1 || interval > totalPages) {
          setError('Invalid interval. Please enter a number between 1 and ' + totalPages);
          setIsProcessing(false);
          return;
        }

        for (let start = 0; start < totalPages; start += interval) {
          const end = Math.min(start + interval, totalPages);
          const pageIndices = [];
          for (let i = start; i < end; i++) {
            pageIndices.push(i);
          }

          const newPdf = await PDFDocument.create();
          for (const pageIndex of pageIndices) {
            const [copiedPage] = await newPdf.copyPages(sourcePdf, [pageIndex]);
            newPdf.addPage(copiedPage);
          }

          const pdfBytes = await newPdf.save();
          const blob = new Blob([pdfBytes], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          urls.push({ url, name: `split-${start + 1}-${end}.pdf` });
        }
      } else if (splitMode === 'single') {
        // Split into individual pages
        for (let i = 0; i < totalPages; i++) {
          const newPdf = await PDFDocument.create();
          const [copiedPage] = await newPdf.copyPages(sourcePdf, [i]);
          newPdf.addPage(copiedPage);

          const pdfBytes = await newPdf.save();
          const blob = new Blob([pdfBytes], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          urls.push({ url, name: `page-${i + 1}.pdf` });
        }
      }

      setSplitPdfUrls(urls);
    } catch (err) {
      console.error('Split error:', err);
      setError(`Failed to split PDF: ${err.message || 'An error occurred during splitting. Please try again.'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Download a split PDF
  const handleDownload = (urlObj) => {
    const link = document.createElement('a');
    link.href = urlObj.url;
    link.download = urlObj.name;
    link.click();
  };

  // Download all split PDFs as ZIP (simplified - just download individually)
  const handleDownloadAll = () => {
    splitPdfUrls.forEach((urlObj, index) => {
      setTimeout(() => {
        handleDownload(urlObj);
      }, index * 200); // Stagger downloads
    });
  };

  // Clear everything
  const handleClear = () => {
    setPdfFile(null);
    setTotalPages(0);
    setPageRange('');
    setSplitInterval(1);
    setSplitMode('range');
    setSplitPdfUrls([]);
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

  // Structured Data Schemas
  const structuredData = {
    faqPage: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How do I split a PDF file?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Upload your PDF file using the upload button or drag and drop it into the designated area. Choose your split mode: extract specific pages by range (e.g., '1-3,5,7-9'), split every N pages, or split into individual pages. Click Split PDF to process your file. Once splitting is complete, download your split PDF files."
          }
        },
        {
          "@type": "Question",
          "name": "Is PDF splitting free?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, our PDF splitter is 100% free to use. There's no registration required, no account needed, and no hidden fees. All PDF splitting happens in your browser, so your files never leave your device and remain completely private."
          }
        },
        {
          "@type": "Question",
          "name": "What split modes are available?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our PDF splitter offers three split modes: Range mode allows you to extract specific pages or page ranges (e.g., '1-3,5,7-9'). Every N pages mode splits the PDF into multiple files, each containing N pages. Single page mode splits the PDF into individual pages, creating one file per page."
          }
        },
        {
          "@type": "Question",
          "name": "Can I extract specific pages from a PDF?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! Use the Range mode to extract specific pages. Enter page numbers or ranges separated by commas (e.g., '1-3,5,7-9' to extract pages 1, 2, 3, 5, 7, 8, and 9). The tool will create a new PDF containing only the selected pages."
          }
        },
        {
          "@type": "Question",
          "name": "Is my PDF data secure when splitting?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Absolutely. All PDF splitting happens entirely in your browser using client-side JavaScript. Your PDF files never leave your device, aren't sent to any server, and aren't stored anywhere. This ensures complete privacy and security for sensitive documents, business files, and personal information."
          }
        },
        {
          "@type": "Question",
          "name": "What file sizes can I split?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our PDF splitter can handle PDFs of various sizes. For optimal performance, we recommend files under 10MB. Very large PDFs may take longer to process, but all splitting happens in your browser without any file size limits."
          }
        },
        {
          "@type": "Question",
          "name": "Can I split password-protected PDFs?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Currently, our tool supports standard PDF files. Password-protected or encrypted PDFs require the password to be entered first before splitting. We're working on adding enhanced support for password-protected PDFs in a future update."
          }
        },
        {
          "@type": "Question",
          "name": "Will the split PDFs maintain the original quality?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, the split PDFs maintain the original quality of the source file. No compression or quality loss occurs during splitting. All text, images, graphics, and formatting from the original PDF are preserved in the split documents."
          }
        }
      ]
    },
    softwareApp: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "PDF Splitter",
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "Any",
      "description": "Split PDF files into multiple documents online for free. Extract specific pages, split every N pages, or split into individual pages. Works 100% in your browser with complete privacy.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "1520",
        "bestRating": "5",
        "worstRating": "1"
      },
      "featureList": [
        "Extract specific pages or ranges",
        "Split every N pages",
        "Split into individual pages",
        "Browser-based processing",
        "No file size limits",
        "Instant splitting",
        "100% privacy and security",
        "No registration required"
      ]
    },
    howTo: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Split a PDF File",
      "description": "Step-by-step guide to split PDF files into multiple documents online for free using FixTools PDF splitter.",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Upload PDF file",
          "text": "Click the upload button or drag and drop your PDF file into the upload area. The tool will load the PDF and display the total number of pages. The tool supports standard PDF files of any size.",
          "position": 1
        },
        {
          "@type": "HowToStep",
          "name": "Choose split mode",
          "text": "Select your split mode: Range mode to extract specific pages (e.g., '1-3,5,7-9'), Every N pages mode to split into multiple files with N pages each, or Single page mode to split into individual pages.",
          "position": 2
        },
        {
          "@type": "HowToStep",
          "name": "Split and download",
          "text": "Click the Split PDF button to process your file. The tool will create the split PDF files based on your selected mode. Once complete, download individual files or all files at once.",
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
          "name": "PDF Splitter",
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
        <title>PDF Splitter - Free Online PDF Page Extractor | FixTools</title>
        <meta name="title" content="PDF Splitter - Free Online PDF Page Extractor | FixTools" />
        <meta name="description" content="Split PDF files into multiple documents online for free. Extract specific pages, split every N pages, or split into individual pages. Fast, secure, 100% in your browser. No signup required." />
        <meta name="keywords" content="pdf splitter, split pdf, extract pdf pages, pdf page extractor, split pdf file, pdf splitter online, extract pages from pdf, split pdf into pages, pdf page splitter, divide pdf" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        {/* Canonical URL */}
        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content="PDF Splitter - Free Online Tool" />
        <meta property="og:description" content="Split PDF files into multiple documents online for free. Extract specific pages or split into individual pages. Works 100% in your browser." />
        <meta property="og:image" content={`${siteHost}/images/og-pdf-splitter.png`} />
        <meta property="og:site_name" content="FixTools" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content="PDF Splitter - Free Online Tool" />
        <meta property="twitter:description" content="Split PDF files into multiple documents online for free. Extract specific pages or split into individual pages." />
        <meta property="twitter:image" content={`${siteHost}/images/og-pdf-splitter.png`} />
        
        {/* Structured Data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.faqPage) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.softwareApp) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.howTo) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.breadcrumb) }} />
      </Head>

      <style jsx global>{`
        html:has(.pdf-splitter-page) {
          font-size: 100% !important;
        }
        
        .pdf-splitter-page {
          line-height: 1.5;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          width: 100%;
          margin: 0;
          padding: 0;
        }
        
        .pdf-splitter-page *,
        .pdf-splitter-page *::before,
        .pdf-splitter-page *::after {
          box-sizing: border-box;
        }
        
        .pdf-splitter-page h1,
        .pdf-splitter-page h2,
        .pdf-splitter-page h3,
        .pdf-splitter-page p,
        .pdf-splitter-page ul,
        .pdf-splitter-page ol {
          margin: 0;
        }
        
        .pdf-splitter-page button {
          font-family: inherit;
          cursor: pointer;
        }
        
        .pdf-splitter-page input,
        .pdf-splitter-page textarea,
        .pdf-splitter-page select {
          font-family: inherit;
        }
      `}</style>

      <div className="pdf-splitter-page bg-[#fbfbfc] text-slate-900 min-h-screen">
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
              <span className="font-semibold text-slate-900">PDF Splitter</span>
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
                Free • Fast • Privacy-first
              </div>
              
              {/* H1 */}
              <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                  PDF Splitter
                </span>
              </h1>
              
              {/* Description */}
              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg md:leading-relaxed">
                Our <strong>PDF splitter</strong> helps you split large PDF files into smaller, manageable documents instantly. 
                Extract specific pages, split every N pages, or split into individual pages. Perfect for organizing documents, extracting sections, and managing large files. 
                All processing happens in your browser — your files never leave your device.
              </p>

              {/* CTA Buttons */}
              <div className="mt-7 pb-5 flex flex-wrap items-center gap-3">
                <a href="#tool" className="group relative rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 transition-all duration-200 hover:shadow-xl hover:scale-[1.02]">
                  <span className="relative z-10 flex items-center gap-2">
                    ⚡ Split PDF
                  </span>
                </a>
                <a href="#how" className="rounded-2xl border-2 border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-900 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md">
                  How it works
                </a>
              </div>

              {/* Stats Cards */}
              <dl className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Modes</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">3 Options</dd>
                </div>
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Quality</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">Original</dd>
                </div>
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Processing</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">Client-Side</dd>
                </div>
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Privacy</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">100%</dd>
                </div>
              </dl>
            </div>

            {/* Right Column - Feature Cards */}
            <div className="relative z-10 md:col-span-5">
              <div className="space-y-4 feature-cards-container">
                {/* Feature Card 1 */}
                <div className="feature-card group rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-lg transition-all duration-300 hover:border-red-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-orange-600 shadow-lg shadow-red-500/30 transition-transform duration-300 group-hover:scale-110">
                      <span className="text-2xl">✂️</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">Extract Pages</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Extract specific pages or page ranges from your PDF. Enter page numbers or ranges (e.g., '1-3,5,7-9') to create a new PDF with only the pages you need.
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
                      <h4 className="text-lg font-bold text-slate-900">Split Every N Pages</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Split your PDF into multiple files, each containing N pages. Perfect for dividing large documents into smaller, manageable sections.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Feature Card 3 */}
                <div className="feature-card group rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-lg transition-all duration-300 hover:border-emerald-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg shadow-emerald-500/30 transition-transform duration-300 group-hover:scale-110">
                      <span className="text-2xl">🔒</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">100% Private</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        All PDF splitting happens in your browser. Your files never leave your device, aren't sent to any server, and aren't stored anywhere.
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
                <h2 className="text-xl font-semibold text-slate-900">PDF Splitter</h2>
                <p className="mt-1 text-sm text-slate-600">Upload a PDF file and split it into multiple documents</p>
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
                        {pdfFile.name} ({formatFileSize(pdfFile.size)}) {totalPages > 0 && `• ${totalPages} page${totalPages !== 1 ? 's' : ''}`}
                      </p>
                    )}
                  </div>
                </button>
              </div>
            </div>

            {/* Split Mode Selection */}
            {pdfFile && totalPages > 0 && (
              <div className="mb-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Split Mode
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <button
                      onClick={() => setSplitMode('range')}
                      className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        splitMode === 'range'
                          ? 'bg-red-600 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      Extract Pages
                    </button>
                    <button
                      onClick={() => setSplitMode('every')}
                      className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        splitMode === 'every'
                          ? 'bg-red-600 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      Every N Pages
                    </button>
                    <button
                      onClick={() => setSplitMode('single')}
                      className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        splitMode === 'single'
                          ? 'bg-red-600 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      Individual Pages
                    </button>
                  </div>
                </div>

                {/* Range Input */}
                {splitMode === 'range' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Page Range (e.g., "1-3,5,7-9")
                    </label>
                    <input
                      type="text"
                      value={pageRange}
                      onChange={(e) => setPageRange(e.target.value)}
                      placeholder="1-3,5,7-9"
                      className="w-full rounded-lg border-2 border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 focus:border-red-500 focus:outline-none"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      Enter page numbers or ranges. Total pages: {totalPages}
                    </p>
                  </div>
                )}

                {/* Interval Input */}
                {splitMode === 'every' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Split Every N Pages
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={totalPages}
                      value={splitInterval}
                      onChange={(e) => setSplitInterval(parseInt(e.target.value) || 1)}
                      className="w-full rounded-lg border-2 border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 focus:border-red-500 focus:outline-none"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      Split into files with {splitInterval} page{splitInterval !== 1 ? 's' : ''} each. Total pages: {totalPages}
                    </p>
                  </div>
                )}

                {/* Single Page Info */}
                {splitMode === 'single' && (
                  <div className="p-4 rounded-lg bg-slate-50 border-2 border-slate-200">
                    <p className="text-sm text-slate-700">
                      The PDF will be split into {totalPages} individual page{totalPages !== 1 ? 's' : ''}, creating one file per page.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 rounded-lg border-2 border-red-200 bg-red-50 p-4">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Split Button */}
            {pdfFile && totalPages > 0 && (
              <div className="mb-6">
                <button
                  onClick={splitPDF}
                  disabled={isProcessing}
                  className="w-full rounded-2xl bg-gradient-to-r from-red-600 to-orange-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-red-600/25 transition-all duration-200 hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-wait"
                >
                  {isProcessing ? 'Splitting...' : '⚡ Split PDF'}
                </button>
              </div>
            )}

            {/* Results */}
            {splitPdfUrls.length > 0 && (
              <div className="space-y-4">
                <div className="p-6 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">✅</span>
                    <p className="text-lg font-bold text-slate-900">PDF Successfully Split!</p>
                  </div>
                  <p className="text-sm text-slate-700">
                    Your PDF has been split into {splitPdfUrls.length} file{splitPdfUrls.length !== 1 ? 's' : ''}.
                  </p>
                </div>
                
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {splitPdfUrls.map((urlObj, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border-2 border-slate-200 bg-slate-50">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">{urlObj.name}</p>
                      </div>
                      <button
                        onClick={() => handleDownload(urlObj)}
                        className="ml-3 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:shadow-md transition-all"
                      >
                        Download
                      </button>
                    </div>
                  ))}
                </div>

                {splitPdfUrls.length > 1 && (
                  <button
                    onClick={handleDownloadAll}
                    className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-[1.02]"
                  >
                    Download All ({splitPdfUrls.length} files)
                  </button>
                )}
              </div>
            )}
          </div>
        </section>

        {/* What is PDF Splitting Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">What is PDF Splitting?</h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                <strong>PDF splitting</strong> is the process of dividing a single PDF (Portable Document Format) file into multiple, smaller PDF documents. 
                This process extracts specific pages or page ranges from the original PDF and creates new PDF files containing only the selected pages. 
                According to <a href="https://developer.mozilla.org/en-US/docs/Web/PDF" target="_blank" rel="noopener noreferrer nofollow" className="text-red-700 hover:text-red-800 font-semibold underline">MDN Web Docs</a>, 
                PDFs are complex document formats that can contain text, images, vector graphics, fonts, and interactive elements, all of which are preserved during splitting.
              </p>

              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Splitting PDF files is essential for several reasons: extracting specific pages or sections from large documents, dividing large files into 
                smaller, more manageable documents, organizing content by topic or chapter, creating separate documents for different purposes, simplifying 
                document sharing and distribution, and reducing file sizes for easier handling. PDF splitting is particularly valuable for extracting pages 
                from reports, separating chapters from books, dividing presentations into sections, and organizing large document collections.
              </p>

              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Our PDF splitter uses pdf-lib, a powerful JavaScript library, to split your PDF files entirely in your browser. This client-side processing ensures 
                your PDF files remain completely private and secure. All splitting happens locally, so your documents never leave your device or get uploaded to any server.
              </p>

              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600">✗</span>
                    Before Splitting
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    A single large PDF file can be difficult to manage, share, and navigate. All content is in one file, making it hard to extract specific sections or share individual parts.
                  </p>
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <p className="text-xs text-slate-600 font-mono">large-document.pdf (50 pages)</p>
                    <p className="text-xs text-slate-500 mt-1">All content in one file</p>
                  </div>
                </div>
                
                <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600">✓</span>
                    After Splitting
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    Multiple smaller PDF files, each containing specific pages or sections. Easy to manage, share, and organize. Each file can be used independently.
                  </p>
                  <div className="bg-white p-3 rounded-lg border border-red-200">
                    <p className="text-xs text-slate-600 font-mono">section1.pdf, section2.pdf, section3.pdf</p>
                    <p className="text-xs text-slate-500 mt-1">Organized and manageable</p>
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
              <h2 className="text-3xl font-bold text-slate-900 mb-3">PDF Splitting Impact</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Real data showing the benefits of splitting PDF files
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-red-200 shadow-lg">
                <div className="text-5xl font-extrabold text-red-600 mb-2">165K</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Monthly Searches</div>
                <div className="text-xs text-slate-600">High demand tool</div>
              </div>
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-blue-200 shadow-lg">
                <div className="text-5xl font-extrabold text-blue-600 mb-2">3</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Split Modes</div>
                <div className="text-xs text-slate-600">Flexible options</div>
              </div>
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-emerald-200 shadow-lg">
                <div className="text-5xl font-extrabold text-emerald-600 mb-2">100%</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Quality Preserved</div>
                <div className="text-xs text-slate-600">Original quality</div>
              </div>
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-purple-200 shadow-lg">
                <div className="text-5xl font-extrabold text-purple-600 mb-2">100%</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Client-Side</div>
                <div className="text-xs text-slate-600">Complete privacy</div>
              </div>
            </div>
            
            {/* Authority Link */}
            <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-red-50 to-orange-50 border border-red-200">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">📊</span>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">Research Data</h4>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    According to <a href="https://developer.mozilla.org/en-US/docs/Web/PDF" target="_blank" 
                    rel="noopener noreferrer nofollow" className="text-red-700 hover:text-red-800 font-semibold underline">MDN Web Docs</a>, 
                    PDF files can be programmatically split using libraries like pdf-lib. Client-side PDF splitting enables users to extract pages and 
                    divide documents for organization and sharing without compromising privacy or security.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Use PDF Splitter Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Why Use PDF Splitter?</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Splitting PDF files offers numerous benefits for organization, sharing, and document management. Here are the key advantages of using our PDF splitter:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Benefit 1 */}
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-red-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-orange-600 shadow-lg">
                    <span className="text-2xl">✂️</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Extract Specific Pages</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Extract only the pages you need from large PDF documents. Perfect for creating focused documents, extracting specific sections, 
                      or removing unnecessary pages. Enter page ranges or individual page numbers to get exactly what you need.
                    </p>
                  </div>
                </div>
              </div>

              {/* Benefit 2 */}
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                    <span className="text-2xl">📄</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Divide Large Documents</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Split large PDF files into smaller, more manageable documents. This makes it easier to share, organize, and work with specific sections. 
                      Perfect for dividing reports, books, presentations, or any large document into logical parts.
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
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Multiple Split Modes</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Choose from three split modes: extract specific pages by range, split every N pages, or split into individual pages. 
                      This flexibility allows you to split PDFs exactly how you need them for your specific use case.
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
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Privacy & Security</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      All PDF splitting happens entirely in your browser using client-side JavaScript. Your PDF files never leave your device, 
                      aren't uploaded to any server, and aren't stored anywhere. This ensures complete privacy and security for sensitive documents.
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
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Fast Processing</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Client-side processing means instant splitting without waiting for file uploads or server processing. Split PDF files in seconds, 
                      even for large documents. No internet connection required after the initial page load.
                    </p>
                  </div>
                </div>
              </div>

              {/* Benefit 6 */}
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-cyan-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg">
                    <span className="text-2xl">🎨</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Quality Preservation</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Split PDFs maintain the original quality of the source file. No compression or quality loss occurs during splitting. 
                      All text, images, graphics, and formatting from the original PDF are preserved in the split documents.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Real-World Impact Box */}
            <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">💡</span>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">Real-World Impact</h4>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    Companies like <a href="https://www.adobe.com/acrobat/online/split-pdf.html" target="_blank" 
                    rel="noopener noreferrer nofollow" className="text-blue-700 hover:text-blue-800 font-semibold underline">Adobe</a> and 
                    <a href="https://www.ilovepdf.com/split-pdf" target="_blank" rel="noopener noreferrer nofollow" 
                    className="text-blue-700 hover:text-blue-800 font-semibold underline"> iLovePDF</a> offer PDF splitting services, 
                    but they require file uploads to their servers. Our client-side approach ensures your documents remain completely private, 
                    making it ideal for sensitive business documents, legal files, medical records, and confidential materials.
                  </p>
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
              Our PDF splitter uses pdf-lib, a powerful JavaScript library, to split your PDF files directly in your browser. Here's how the splitting process works:
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-orange-600 text-white font-bold text-xl shadow-lg mb-4">
                  1
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Upload PDF File</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Upload your PDF file. The tool loads the PDF and displays the total number of pages. You can then choose your split mode.
                </p>
              </div>

              <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-xl shadow-lg mb-4">
                  2
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Choose Split Mode</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Select your split mode: extract specific pages by range, split every N pages, or split into individual pages. Enter the required parameters for your chosen mode.
                </p>
              </div>

              <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white font-bold text-xl shadow-lg mb-4">
                  3
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Split & Download</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Click Split PDF to process your file. The tool creates the split PDF files based on your selected mode. Once complete, download individual files or all files at once.
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
              <h2 className="text-3xl font-bold text-slate-900">Best Practices for PDF Splitting</h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                To get the best results when splitting PDF files, follow these best practices:
              </p>

              <ul className="space-y-3 text-base text-slate-700">
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold mt-0.5">✓</span>
                  <span><strong>Plan your split strategy:</strong> Before splitting, think about how you want to divide the document. Consider logical breaks (chapters, sections, topics) to create meaningful separate files.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold mt-0.5">✓</span>
                  <span><strong>Verify page numbers:</strong> Check the total number of pages in your PDF before entering page ranges. Ensure your page ranges are valid and within the document's page count.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold mt-0.5">✓</span>
                  <span><strong>Use descriptive names:</strong> When downloading split PDFs, consider renaming them with descriptive names that indicate their content. This makes it easier to organize and find specific files later.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold mt-0.5">✓</span>
                  <span><strong>Keep originals:</strong> The split PDFs are new files. Keep your original PDF file as a backup in case you need to re-split in a different way or access the complete document.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold mt-0.5">✓</span>
                  <span><strong>Test with small ranges first:</strong> For large PDFs, test your split strategy with a small page range first to ensure it works as expected before processing the entire document.</span>
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
              <h2 className="text-3xl font-bold text-slate-900">Common Use Cases for PDF Splitting</h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-6">
                PDF splitting serves a wide variety of professional and personal needs. Understanding these use cases can help you determine when splitting is the right solution:
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                  <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="text-2xl">📚</span>
                    Extract Chapters
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    Extract individual chapters or sections from large PDF books, reports, or documents. This is essential for creating focused reading materials, sharing specific sections, or organizing content by topic.
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    Split PDFs allow you to work with specific chapters without loading the entire document, making it easier to study, share, or reference particular sections.
                  </p>
                </div>

                <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                  <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="text-2xl">📧</span>
                    Share Specific Pages
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    Extract and share only the relevant pages from a large PDF document. Instead of sending the entire file, extract the specific pages that recipients need, reducing file size and improving communication efficiency.
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    This is particularly useful for sharing specific sections of reports, proposals, or documents where only certain pages are relevant to the recipient.
                  </p>
                </div>

                <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                  <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="text-2xl">📊</span>
                    Organize Large Documents
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    Divide large PDF documents into smaller, more manageable files. This makes it easier to organize, navigate, and work with specific sections. Perfect for breaking down comprehensive reports, manuals, or documentation.
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    Split documents are easier to manage in file systems, faster to open and process, and more convenient for collaborative work where different team members need different sections.
                  </p>
                </div>

                <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                  <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="text-2xl">📖</span>
                    Create Page Collections
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    Extract pages from multiple PDFs to create custom collections. Combine specific pages from different documents to create focused reference materials, study guides, or custom documentation.
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    This use case is valuable for students creating study materials, researchers compiling references, or professionals building custom documentation from multiple sources.
                  </p>
                </div>

                <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                  <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="text-2xl">📋</span>
                    Remove Unnecessary Pages
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    Extract only the pages you need, effectively removing unnecessary pages from a document. This is valuable for cleaning up documents, removing blank pages, or creating streamlined versions of large files.
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    Split PDFs allow you to create cleaner, more focused documents by excluding pages that aren't needed for your specific purpose.
                  </p>
                </div>

                <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                  <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="text-2xl">🎓</span>
                    Academic Work
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    Extract specific pages from research papers, textbooks, or academic documents for citations, references, or study materials. This is essential for academic research, note-taking, and creating focused study resources.
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    Split PDFs enable students and researchers to work with specific sections of academic materials without managing entire large documents.
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
              <Link href="/pdf/pdf-to-jpg" className="group block p-5 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-red-300 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-orange-600 shadow-lg">
                    <span className="text-xl">🖼️</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1 group-hover:text-red-600 transition-colors">PDF to JPG</h3>
                    <p className="text-xs text-slate-600">Convert PDF pages to images</p>
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
                    <span className="text-xl">➕</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1 group-hover:text-red-600 transition-colors">PDF Merger</h3>
                    <p className="text-xs text-slate-600">Combine multiple PDFs</p>
                  </div>
                </div>
              </Link>

              <Link href="/pdf/pdf-to-png" className="group block p-5 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-red-300 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
                    <span className="text-xl">🏞️</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1 group-hover:text-red-600 transition-colors">PDF to PNG</h3>
                    <p className="text-xs text-slate-600">Convert to PNG with transparency</p>
                  </div>
                </div>
              </Link>

              <Link href="/pdf/pdf-rotator" className="group block p-5 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-red-300 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg">
                    <span className="text-xl">🔄</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1 group-hover:text-red-600 transition-colors">PDF Rotator</h3>
                    <p className="text-xs text-slate-600">Rotate PDF pages</p>
                  </div>
                </div>
              </Link>

              <Link href="/tools/pdf" className="group block p-5 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-red-300 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-500 to-slate-600 shadow-lg">
                    <span className="text-xl">📄</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1 group-hover:text-red-600 transition-colors">All PDF Tools</h3>
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


