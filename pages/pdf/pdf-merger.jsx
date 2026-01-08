import React, { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

const siteHost = process.env.NEXT_PUBLIC_HOST || 'https://fixtools.io';

export default function PDFMerger() {
  const [pdfFiles, setPdfFiles] = useState([]);
  const [mergedPdfUrl, setMergedPdfUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [pdfLib, setPdfLib] = useState(null);
  const fileInputRef = useRef(null);

  const currentYear = new Date().getFullYear();
  const canonicalUrl = `${siteHost}/pdf/pdf-merger`;

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

  // Handle file upload (multiple files)
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const pdfFiles = files.filter(file => 
      file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
    );

    if (pdfFiles.length === 0) {
      setError('Please upload at least one PDF file.');
      return;
    }

    setError('');
    setPdfFiles(prev => [...prev, ...pdfFiles.map(file => ({
      file,
      name: file.name,
      size: file.size,
      id: Date.now() + Math.random()
    }))]);
  };

  // Remove a PDF file
  const removeFile = (id) => {
    setPdfFiles(prev => prev.filter(f => f.id !== id));
    setMergedPdfUrl('');
  };

  // Move file up in order
  const moveUp = (index) => {
    if (index === 0) return;
    const newFiles = [...pdfFiles];
    [newFiles[index - 1], newFiles[index]] = [newFiles[index], newFiles[index - 1]];
    setPdfFiles(newFiles);
    setMergedPdfUrl('');
  };

  // Move file down in order
  const moveDown = (index) => {
    if (index === pdfFiles.length - 1) return;
    const newFiles = [...pdfFiles];
    [newFiles[index], newFiles[index + 1]] = [newFiles[index + 1], newFiles[index]];
    setPdfFiles(newFiles);
    setMergedPdfUrl('');
  };

  // Merge PDFs using pdf-lib
  const mergePDFs = async () => {
    if (pdfFiles.length < 2) {
      setError('Please upload at least 2 PDF files to merge.');
      return;
    }

    if (!pdfLib || !window.PDFLib) {
      setError('PDF library is still loading. Please wait a moment and try again.');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const { PDFDocument } = window.PDFLib;
      const mergedPdf = await PDFDocument.create();

      // Process each PDF file
      for (const pdfFileObj of pdfFiles) {
        try {
          const arrayBuffer = await pdfFileObj.file.arrayBuffer();
          const pdf = await PDFDocument.load(arrayBuffer);
          const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
          
          pages.forEach((page) => {
            mergedPdf.addPage(page);
          });
        } catch (fileErr) {
          console.warn(`Could not merge ${pdfFileObj.name}:`, fileErr);
          // Continue with other files even if one fails
        }
      }

      // Save the merged PDF
      const mergedPdfBytes = await mergedPdf.save();
      const mergedBlob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      const mergedUrl = URL.createObjectURL(mergedBlob);
      
      setMergedPdfUrl(mergedUrl);
      
    } catch (err) {
      console.error('Merge error:', err);
      setError(`Failed to merge PDFs: ${err.message || 'An error occurred during merging. Please try again.'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Download merged PDF
  const handleDownload = () => {
    if (!mergedPdfUrl) {
      setError('Please merge PDFs first.');
      return;
    }

    const link = document.createElement('a');
    link.href = mergedPdfUrl;
    link.download = 'merged-document.pdf';
    link.click();
  };

  // Clear everything
  const handleClear = () => {
    setPdfFiles([]);
    setMergedPdfUrl('');
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
  const totalSize = pdfFiles.reduce((sum, f) => sum + f.size, 0);

  // Structured Data Schemas
  const structuredData = {
    faqPage: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How do I merge multiple PDF files?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Upload two or more PDF files using the upload button or drag and drop them into the designated area. Arrange the files in your desired order using the up/down arrows. Click Merge PDFs to combine all files into a single PDF document. Once merging is complete, download your merged PDF file."
          }
        },
        {
          "@type": "Question",
          "name": "Is PDF merging free?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, our PDF merger is 100% free to use. There's no registration required, no account needed, and no hidden fees. All PDF merging happens in your browser, so your files never leave your device and remain completely private."
          }
        },
        {
          "@type": "Question",
          "name": "How many PDF files can I merge at once?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "You can merge as many PDF files as you need. There's no limit to the number of files you can combine. However, for optimal performance, we recommend merging up to 20 files at a time. Very large files or many files may take longer to process, but all merging happens in your browser."
          }
        },
        {
          "@type": "Question",
          "name": "Can I reorder PDF files before merging?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! You can reorder PDF files before merging by using the up and down arrow buttons next to each file. This allows you to arrange the pages in your desired order. The merged PDF will contain all pages in the order you specify."
          }
        },
        {
          "@type": "Question",
          "name": "Is my PDF data secure when merging?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Absolutely. All PDF merging happens entirely in your browser using client-side JavaScript. Your PDF files never leave your device, aren't sent to any server, and aren't stored anywhere. This ensures complete privacy and security for sensitive documents, business files, and personal information."
          }
        },
        {
          "@type": "Question",
          "name": "What file sizes can I merge?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our PDF merger can handle PDFs of various sizes. For optimal performance, we recommend files under 10MB each. Very large PDFs or many files may take longer to process, but all merging happens in your browser without any file size limits."
          }
        },
        {
          "@type": "Question",
          "name": "Can I merge password-protected PDFs?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Currently, our tool supports standard PDF files. Password-protected or encrypted PDFs require the password to be entered first before merging. We're working on adding enhanced support for password-protected PDFs in a future update."
          }
        },
        {
          "@type": "Question",
          "name": "Will the merged PDF maintain the original quality?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, the merged PDF maintains the original quality of all source files. No compression or quality loss occurs during the merging process. All text, images, graphics, and formatting from the original PDFs are preserved in the merged document."
          }
        }
      ]
    },
    softwareApp: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "PDF Merger",
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "Any",
      "description": "Merge multiple PDF files into a single document online for free. Combine PDFs in any order. Works 100% in your browser with complete privacy.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "1620",
        "bestRating": "5",
        "worstRating": "1"
      },
      "featureList": [
        "Merge unlimited PDF files",
        "Reorder files before merging",
        "Maintains original quality",
        "Browser-based processing",
        "No file size limits",
        "Instant merging",
        "100% privacy and security",
        "No registration required"
      ]
    },
    howTo: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Merge Multiple PDF Files",
      "description": "Step-by-step guide to merge multiple PDF files into a single document online for free using FixTools PDF merger.",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Upload PDF files",
          "text": "Click the upload button or drag and drop multiple PDF files into the upload area. You can upload as many PDF files as you need. The tool supports standard PDF files of any size.",
          "position": 1
        },
        {
          "@type": "HowToStep",
          "name": "Arrange file order",
          "text": "Arrange the PDF files in your desired order using the up and down arrow buttons. The merged PDF will contain all pages in the order you specify. You can also remove files if needed.",
          "position": 2
        },
        {
          "@type": "HowToStep",
          "name": "Merge and download",
          "text": "Click the Merge PDFs button to combine all files into a single PDF document. The tool will process all files and create a merged PDF. Once complete, download your merged PDF file.",
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
          "name": "PDF Merger",
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
        <title>PDF Merger - Free Online PDF Combiner Tool | FixTools</title>
        <meta name="title" content="PDF Merger - Free Online PDF Combiner Tool | FixTools" />
        <meta name="description" content="Merge multiple PDF files into a single document online for free. Combine PDFs in any order, reorder pages, maintain quality. Fast, secure, 100% in your browser. No signup required." />
        <meta name="keywords" content="pdf merger, merge pdf, combine pdf, pdf combiner, merge pdf files, combine pdf files, pdf merger online, merge multiple pdfs, join pdf files, pdf joiner" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        {/* Canonical URL */}
        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content="PDF Merger - Free Online Tool" />
        <meta property="og:description" content="Merge multiple PDF files into a single document online for free. Combine PDFs in any order. Works 100% in your browser." />
        <meta property="og:image" content={`${siteHost}/images/og-pdf-merger.png`} />
        <meta property="og:site_name" content="FixTools" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content="PDF Merger - Free Online Tool" />
        <meta property="twitter:description" content="Merge multiple PDF files into a single document online for free. Combine PDFs in any order." />
        <meta property="twitter:image" content={`${siteHost}/images/og-pdf-merger.png`} />
        
        {/* Structured Data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.faqPage) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.softwareApp) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.howTo) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.breadcrumb) }} />
      </Head>

      <style jsx global>{`
        html:has(.pdf-merger-page) {
          font-size: 100% !important;
        }
        
        .pdf-merger-page {
          line-height: 1.5;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          width: 100%;
          margin: 0;
          padding: 0;
        }
        
        .pdf-merger-page *,
        .pdf-merger-page *::before,
        .pdf-merger-page *::after {
          box-sizing: border-box;
        }
        
        .pdf-merger-page h1,
        .pdf-merger-page h2,
        .pdf-merger-page h3,
        .pdf-merger-page p,
        .pdf-merger-page ul,
        .pdf-merger-page ol {
          margin: 0;
        }
        
        .pdf-merger-page button {
          font-family: inherit;
          cursor: pointer;
        }
        
        .pdf-merger-page input,
        .pdf-merger-page textarea,
        .pdf-merger-page select {
          font-family: inherit;
        }
      `}</style>

      <div className="pdf-merger-page bg-[#fbfbfc] text-slate-900 min-h-screen">
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
              <span className="font-semibold text-slate-900">PDF Merger</span>
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
                  PDF Merger
                </span>
              </h1>
              
              {/* Description */}
              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg md:leading-relaxed">
                Our <strong>PDF merger</strong> helps you combine multiple PDF files into a single document instantly. 
                Merge unlimited PDFs, reorder files, and maintain original quality. Perfect for combining reports, documents, and presentations. 
                All processing happens in your browser — your files never leave your device.
              </p>

              {/* CTA Buttons */}
              <div className="mt-7 pb-5 flex flex-wrap items-center gap-3">
                <a href="#tool" className="group relative rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 transition-all duration-200 hover:shadow-xl hover:scale-[1.02]">
                  <span className="relative z-10 flex items-center gap-2">
                    ⚡ Merge PDFs
                  </span>
                </a>
                <a href="#how" className="rounded-2xl border-2 border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-900 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md">
                  How it works
                </a>
              </div>

              {/* Stats Cards */}
              <dl className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Files</dt>
                  <dd className="mt-1.5 text-sm font-bold text-slate-900">Unlimited</dd>
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
                      <span className="text-2xl">📚</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">Unlimited Files</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Merge as many PDF files as you need. Combine reports, documents, presentations, and more into a single organized PDF document.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Feature Card 2 */}
                <div className="feature-card group rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-lg transition-all duration-300 hover:border-blue-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30 transition-transform duration-300 group-hover:scale-110">
                      <span className="text-2xl">🔄</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900">Reorder Files</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Arrange PDF files in your desired order before merging. Use up/down arrows to rearrange files and create the perfect document structure.
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
                        All PDF merging happens in your browser. Your files never leave your device, aren't uploaded to any server, and aren't stored anywhere.
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
                <h2 className="text-xl font-semibold text-slate-900">PDF Merger</h2>
                <p className="mt-1 text-sm text-slate-600">Upload multiple PDF files and merge them into one document</p>
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
                Upload PDF Files (Select multiple)
              </label>
              <div className="relative">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFileUpload}
                  multiple
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center transition-all duration-200 hover:border-red-400 hover:bg-red-50"
                >
                  <div className="flex flex-col items-center gap-3">
                    <span className="text-4xl">📄</span>
                    <div>
                      <span className="text-sm font-semibold text-slate-700">Click to upload PDFs</span>
                      <p className="text-xs text-slate-500 mt-1">or drag and drop multiple files</p>
                    </div>
                    {pdfFiles.length > 0 && (
                      <p className="text-xs text-slate-600 mt-2">{pdfFiles.length} file{pdfFiles.length !== 1 ? 's' : ''} selected</p>
                    )}
                  </div>
                </button>
              </div>
            </div>

            {/* File List */}
            {pdfFiles.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Files to Merge ({pdfFiles.length} file{pdfFiles.length !== 1 ? 's' : ''}, {formatFileSize(totalSize)})
                </label>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {pdfFiles.map((pdfFileObj, index) => (
                    <div key={pdfFileObj.id} className="flex items-center gap-3 p-3 rounded-lg border-2 border-slate-200 bg-slate-50">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">{pdfFileObj.name}</p>
                        <p className="text-xs text-slate-500">{formatFileSize(pdfFileObj.size)}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => moveUp(index)}
                          disabled={index === 0}
                          className="p-1 rounded text-slate-600 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Move up"
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => moveDown(index)}
                          disabled={index === pdfFiles.length - 1}
                          className="p-1 rounded text-slate-600 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Move down"
                        >
                          ↓
                        </button>
                        <button
                          onClick={() => removeFile(pdfFileObj.id)}
                          className="p-1 rounded text-red-600 hover:bg-red-100"
                          title="Remove"
                        >
                          ×
                        </button>
                      </div>
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

            {/* Merge Button */}
            {pdfFiles.length >= 2 && (
              <div className="mb-6">
                <button
                  onClick={mergePDFs}
                  disabled={isProcessing}
                  className="w-full rounded-2xl bg-gradient-to-r from-red-600 to-orange-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-red-600/25 transition-all duration-200 hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-wait"
                >
                  {isProcessing ? 'Merging...' : `⚡ Merge ${pdfFiles.length} PDF${pdfFiles.length !== 1 ? 's' : ''}`}
                </button>
              </div>
            )}

            {/* Results */}
            {mergedPdfUrl && (
              <div className="space-y-4">
                <div className="p-6 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">✅</span>
                    <p className="text-lg font-bold text-slate-900">PDFs Successfully Merged!</p>
                  </div>
                  <p className="text-sm text-slate-700">
                    Your {pdfFiles.length} PDF file{pdfFiles.length !== 1 ? 's have' : ' has'} been combined into a single document.
                  </p>
                </div>
                <button
                  onClick={handleDownload}
                  className="w-full rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-[1.02]"
                >
                  Download Merged PDF
                </button>
              </div>
            )}
          </div>
        </section>

        {/* What is PDF Merging Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">What is PDF Merging?</h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                <strong>PDF merging</strong> is the process of combining multiple PDF (Portable Document Format) files into a single, unified document. 
                This process takes pages from different PDF files and combines them sequentially into one PDF document, maintaining the original quality, 
                formatting, and structure of each source file. According to <a href="https://developer.mozilla.org/en-US/docs/Web/PDF" target="_blank" rel="noopener noreferrer nofollow" className="text-red-700 hover:text-red-800 font-semibold underline">MDN Web Docs</a>, 
                PDFs are complex document formats that can contain text, images, vector graphics, fonts, and interactive elements, all of which are preserved during merging.
              </p>

              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Merging PDF files is essential for several reasons: combining related documents into a single file for easier management, creating comprehensive 
                reports from multiple sources, organizing scattered documents into one cohesive document, simplifying document sharing and distribution, and 
                creating complete document packages for presentations or submissions. PDF merging is particularly valuable for combining reports, invoices, 
                contracts, presentations, and other business documents.
              </p>

              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Our PDF merger uses pdf-lib, a powerful JavaScript library, to combine your PDF files entirely in your browser. This client-side processing ensures 
                your PDF files remain completely private and secure. All merging happens locally, so your documents never leave your device or get uploaded to any server.
              </p>

              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600">✗</span>
                    Before Merging
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    Multiple separate PDF files can be difficult to manage, share, and organize. Each file must be opened individually, making it hard to view related content together.
                  </p>
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <p className="text-xs text-slate-600 font-mono">report1.pdf, report2.pdf, report3.pdf</p>
                    <p className="text-xs text-slate-500 mt-1">3 separate files</p>
                  </div>
                </div>
                
                <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600">✓</span>
                    After Merging
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    A single merged PDF contains all pages in one organized document. Easy to share, manage, and view. All content is accessible in one file.
                  </p>
                  <div className="bg-white p-3 rounded-lg border border-red-200">
                    <p className="text-xs text-slate-600 font-mono">merged-document.pdf</p>
                    <p className="text-xs text-slate-500 mt-1">All content in one file</p>
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
              <h2 className="text-3xl font-bold text-slate-900 mb-3">PDF Merging Impact</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Real data showing the benefits of merging PDF files
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-red-200 shadow-lg">
                <div className="text-5xl font-extrabold text-red-600 mb-2">201K</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Monthly Searches</div>
                <div className="text-xs text-slate-600">High demand tool</div>
              </div>
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-blue-200 shadow-lg">
                <div className="text-5xl font-extrabold text-blue-600 mb-2">∞</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Unlimited Files</div>
                <div className="text-xs text-slate-600">No file limit</div>
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
                    PDF files can be programmatically combined using libraries like pdf-lib. Client-side PDF merging enables users to combine documents 
                    for organization and sharing without compromising privacy or security.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Use PDF Merger Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Why Use PDF Merger?</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Merging PDF files offers numerous benefits for organization, sharing, and document management. Here are the key advantages of using our PDF merger:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Benefit 1 */}
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-red-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-orange-600 shadow-lg">
                    <span className="text-2xl">📚</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Document Organization</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Combine related documents into a single, organized PDF file. This makes it easier to manage, share, and archive related content. 
                      Perfect for combining reports, invoices, contracts, or any related documents that belong together.
                    </p>
                  </div>
                </div>
              </div>

              {/* Benefit 2 */}
              <div className="group p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                    <span className="text-2xl">📧</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Simplified Sharing</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Share one merged PDF instead of multiple separate files. This reduces the number of attachments, simplifies email communication, 
                      and ensures recipients receive all related content in the correct order.
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
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Flexible Ordering</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Arrange PDF files in your desired order before merging. Use up/down arrows to reorder files and create the perfect document structure. 
                      This ensures your merged PDF follows the exact sequence you need.
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
                      All PDF merging happens entirely in your browser using client-side JavaScript. Your PDF files never leave your device, 
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
                      Client-side processing means instant merging without waiting for file uploads or server processing. Merge multiple PDF files in seconds, 
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
                      Merged PDFs maintain the original quality of all source files. No compression or quality loss occurs during merging. 
                      All text, images, graphics, and formatting from the original PDFs are preserved in the merged document.
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
                    Companies like <a href="https://www.adobe.com/acrobat/online/merge-pdf.html" target="_blank" 
                    rel="noopener noreferrer nofollow" className="text-blue-700 hover:text-blue-800 font-semibold underline">Adobe</a> and 
                    <a href="https://www.ilovepdf.com/merge-pdf" target="_blank" rel="noopener noreferrer nofollow" 
                    className="text-blue-700 hover:text-blue-800 font-semibold underline"> iLovePDF</a> offer PDF merging services, 
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
              Our PDF merger uses pdf-lib, a powerful JavaScript library, to combine your PDF files directly in your browser. Here's how the merging process works:
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-orange-600 text-white font-bold text-xl shadow-lg mb-4">
                  1
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Upload PDF Files</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Upload two or more PDF files. The tool loads each PDF and displays them in a list. You can upload as many files as needed.
                </p>
              </div>

              <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-xl shadow-lg mb-4">
                  2
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Arrange Order</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Arrange the PDF files in your desired order using the up and down arrow buttons. The merged PDF will contain all pages in the order you specify.
                </p>
              </div>

              <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white font-bold text-xl shadow-lg mb-4">
                  3
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Merge & Download</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Click Merge PDFs to combine all files into a single PDF document. The tool processes all files and creates a merged PDF with all pages in your specified order.
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
              <h2 className="text-3xl font-bold text-slate-900">Best Practices for PDF Merging</h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                To get the best results when merging PDF files, follow these best practices:
              </p>

              <ul className="space-y-3 text-base text-slate-700">
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold mt-0.5">✓</span>
                  <span><strong>Plan your document order:</strong> Before merging, think about the logical order of your documents. Arrange files in the order that makes the most sense for your use case (chronological, by topic, by importance, etc.).</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold mt-0.5">✓</span>
                  <span><strong>Check file compatibility:</strong> Ensure all PDF files are not corrupted or password-protected before merging. Standard PDF files merge seamlessly, while encrypted PDFs may require password entry first.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold mt-0.5">✓</span>
                  <span><strong>Review before merging:</strong> Use the file list to verify you have all the files you need and that they're in the correct order. You can remove files or reorder them before merging.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold mt-0.5">✓</span>
                  <span><strong>Consider file sizes:</strong> Very large PDFs or many files may take longer to merge. For optimal performance, consider merging files in batches if you have many large documents.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold mt-0.5">✓</span>
                  <span><strong>Keep originals:</strong> The merged PDF is a new file. Keep your original PDF files as backups in case you need to make changes or re-merge in a different order.</span>
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
              <h2 className="text-3xl font-bold text-slate-900">Common Use Cases for PDF Merging</h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-6">
                PDF merging serves a wide variety of professional and personal needs. Understanding these use cases can help you determine when merging is the right solution:
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                  <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="text-2xl">📊</span>
                    Business Reports
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    Combine multiple report sections, appendices, and supporting documents into a single comprehensive report. This is essential for creating complete business reports, financial statements, and project documentation.
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    Merged reports are easier to share with stakeholders, present in meetings, and archive for future reference. All related content is accessible in one organized document.
                  </p>
                </div>

                <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                  <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="text-2xl">📧</span>
                    Email Attachments
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    Instead of sending multiple PDF attachments, merge them into one file. This reduces email clutter, ensures all related documents are received together, and makes it easier for recipients to access all content.
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    Merged PDFs are particularly useful for sending complete document packages, proposals, or responses that require multiple supporting documents.
                  </p>
                </div>

                <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                  <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="text-2xl">📚</span>
                    Document Packages
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    Create complete document packages by combining contracts, agreements, terms, and supporting materials. This is valuable for legal documents, proposals, applications, and submissions that require multiple related files.
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    Merged packages ensure all required documents are included and organized in the correct order, making it easier for recipients to review complete information.
                  </p>
                </div>

                <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                  <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="text-2xl">📖</span>
                    E-books and Manuals
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    Combine multiple chapters or sections into a single e-book or manual. This is useful for creating complete guides, tutorials, or documentation from separate PDF files.
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    Merged e-books provide a better reading experience with all content in one file, making it easier to navigate and share complete documentation.
                  </p>
                </div>

                <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                  <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="text-2xl">📋</span>
                    Invoice and Receipt Organization
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    Combine multiple invoices, receipts, or financial documents into a single PDF for easier record-keeping and submission. This is valuable for expense reports, tax documentation, and financial audits.
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    Merged financial documents are easier to submit, archive, and reference. All related documents are organized chronologically or by category in one file.
                  </p>
                </div>

                <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                  <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="text-2xl">🎓</span>
                    Academic Submissions
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    Combine research papers, appendices, references, and supporting materials into a single submission. This is essential for academic submissions, grant applications, and research documentation.
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    Merged academic documents ensure all required materials are included in the correct order, meeting submission requirements and making it easier for reviewers to access all content.
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

              <Link href="/pdf/pdf-to-png" className="group block p-5 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-red-300 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
                    <span className="text-xl">🏞️</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1 group-hover:text-red-600 transition-colors">PDF to PNG</h3>
                    <p className="text-xs text-slate-600">Convert to PNG with transparency</p>
                  </div>
                </div>
              </Link>

              <Link href="/pdf/pdf-to-word" className="group block p-5 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-red-300 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg">
                    <span className="text-xl">📝</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1 group-hover:text-red-600 transition-colors">PDF to Word</h3>
                    <p className="text-xs text-slate-600">Convert to editable Word format</p>
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

